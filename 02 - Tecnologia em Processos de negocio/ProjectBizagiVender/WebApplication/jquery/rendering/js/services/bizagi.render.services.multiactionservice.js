/*
 *   Name: BizAgi Rendering Services
 *   Author: Diego Parra
 *   Comments:
 *   -   This class will provide a facade to access to multiaction rendering REST services
 */
$.Class.extend("bizagi.render.services.multiactionservice", {
    // Statics
    BA_ACTION_PARAMETER_PREFIX: "p_",
    BA_CONTEXT_PARAMETER_PREFIX: "h_",
    BA_PAGE_CACHE: "pageCacheId"
}, {

    /* 
    *   Constructor
    */
    init: function (service) {
        this.service = service;
        this.serviceLocator = service.serviceLocator;

        // Multiaction - batch stuff
        this.batch = {};
        this.batchTimer = 50;
        this.circularDependencies = new bizagi.circularDependencies();

        // Create proxyed version of methods
        this.replicateServiceMethods();
    },

    /*
    *   Returns the internal service
    */
    getService: function () {
        return this.service;
    },

    /*
    *   Create a proxied multiaction version for service calls
    */
    replicateServiceMethods: function () {
        var self = this;
        for (var key in this.service.Class.prototype) {
            // Omit the folowing methods
            if (key == "init" || key == "constructor" || key == "Class" || key == "multiaction") continue;

            // Replicate instance methods
            self[key] = eval('var tmp = function(){ return this.proxyMethod(this.getService().' + key + ', arguments);};tmp');
        }
    },

    /*
    *   Perform the proxy call for each service method
    */
    proxyMethod: function (method, arguments) {
        var service = this.service;

        // Check if has only one argument, else execute directly
        if (!arguments || arguments.length != 1) {
            return method.apply(service, arguments);
        }

        // Check if the argument is object, else execute directly
        if (typeof (arguments[0]) != "object") {
            return method.apply(service, arguments);
        }

        var params = arguments[0];

        // If the caller is requesting a prepare call, just execute the method with the current arguments
        if (params.prepare == true) return method.apply(service, arguments);

        // Prepare the ajax instead of sending it
        params.prepare = true;
        var action = method.apply(service, arguments);

        return this.add(action);
    },

    /**
    * This method make a standard error message
    */
    makeCircularDependenciesError: function (error) {
        var messageTmpl = bizagi.localization.getResource("render-actions-loop-validation");

        return printf(messageTmpl, error.dependencyFrom, error.dependencyTo);
    },


    /*
    *   Add an action to be performed in a multiaction, and be resolved later
    *   returns a deferred
    */
    add: function (action) {
        var self = this;
        var deferred = new $.Deferred();

        var name = action.h_action || "unnamed";

        // Put here all actions to ignore in circular dependencies
        var exceptionActions = ["PROCESSPROPERTYVALUE", "LOADTEMPLATE", "ADDRELATIONWITHDATA"];

        if (exceptionActions.indexOf(name) < 0 && bizagi.override.detectCircularDependencies) {
            self.circularDependencies.addNode(name, action);
        }

        // First clear previous timeout
        clearTimeout(self.batchTimeout);
        var tag = action.tag = Math.guid();
        var singleAction = { action: action, deferred: deferred };
        self.batch[tag] = singleAction;

        // Start a new timeout
        self.batchTimeout = setTimeout(function () {
            var resolveDependencies = self.circularDependencies.resolve();

            if (resolveDependencies.error) {
                // Reset Queue
                for (var i in self.batch) {
                    var message = resolveDependencies.error.multiactionError;
                    self.batch[i].deferred.reject(message);
                }
                self.batch = {};
            } else {
                self.fire();
            }
        }, self.batchTimer);

        return deferred.promise();
    },
    /*
    *   Fires up the multiaction
    */
    fire: function () {
        var self = this;
        var batch = {};

        // Prepare actions and clone batch manually
        var actions = [];
        $.each(self.batch, function (tag, item) {
            actions.push(item.action);
            batch[tag] = item;
        });

        // Reset batch
        self.batch = {};

        // Fire ajax 
        $.when(self.execute({ actions: actions, rejectDeferreds: false }))
                .done(function (responses) {

                    // Process each response
                    $.each(responses, function (i, response) {
                        var tag = response.tag;
                        if (!response.error) {
                            batch[tag].deferred.resolve(response.result);
                        } else {
                            batch[tag].deferred.reject(response.error, response, response.error.message);
                        }

                        // Remove paired tag from collection
                        delete batch[tag];
                    });

                    // Check if there are unpaired actions so we need to trigger fail deferred
                    $.each(batch, function (i, item) {
                        item.deferred.reject({ type: "not-processed", message: "Operation didn't executed" }, '', "Operation didn't executed");
                    });
                }).fail(function (xhr, type, error) {

                    // Check if there are unpaired actions so we need to trigger fail deferred
                    var errorMessage = typeof (error) !== "undefined" ? error.message : (error || "Operation didn't executed");
                    $.each(batch, function (i, item) {
                        item.deferred.reject({ type: "not-processed", message: errorMessage }, '', "Operation didn't executed");
                    });
                });
    },
    /*
    *   Sends a multiaction to the server
    */
    execute: function (params) {
        var self = this;

        // Define data
        var data = {};
        var rejectDeferreds = params.rejectDeferreds !== undefined ? params.rejectDeferreds : true;
        data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "action"] = "multiaction";

        // Check action tag
        $.each(params.actions, function (i, action) {
            action[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "tag"] = action.tag || i;
            delete action.tag;
        });

        // Fill optional parameters
        params = params || {};
        if (params.actions) {
            data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "actions"] = JSON.encode(params.actions);
        }

        // Log submit data
        bizagi.debug("Performing multi-action", data);

        // Call ajax and returns promise
        var deferred = new $.Deferred();
        $.ajax({
            url: self.serviceLocator.getUrl("render-multiaction"),
            data: data,
            type: "POST",
            dataType: "json",
            serviceType: "MULTIACTION",
            beforeSend: function (xhr, status) {
                bizagi.multiactionConnection = bizagi.multiactionConnection || [];
                bizagi.multiactionConnection.push(xhr);
            }

        }).done(function (responses) {
            for (i in responses) {
                if (typeof responses[i] !== "function") {
                    var response = responses[i];
                    if (response.error) {
                        if (rejectDeferreds) {
                            deferred.reject(this, "servererror", response);
                            return;
                        }

                    }
                }
            }
            deferred.resolve(responses);

        }).fail(function (xhr) {
            var response = xhr.responseText || xhr;
            var finalResponse;
            // Try to parse the response
            try {
                finalResponse = JSON.parse(response);
            } catch (e) { }
            deferred.reject(xhr, "servererror", finalResponse);
        });

        return deferred.promise();
    }
});
