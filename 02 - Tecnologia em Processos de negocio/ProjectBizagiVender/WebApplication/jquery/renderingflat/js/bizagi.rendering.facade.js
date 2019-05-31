/*
 *   Name: BizAgi Rendering
 *   Author: Diego Parra
 *   Comments:
 *   -   This script will process a rendering page by calling an ajax service to retrieve the model,
 *       and then process it to create base layout, and then call the device render factory
 */

// Define BizAgi Rendering namespace
bizagi.rendering = bizagi.rendering || {};

/*
 *   This class will define a method to process the page
 *   1. Fetch the data
 *   2. Call the device factory to appropiately render the content
 */
$.Class.extend("bizagi.rendering.facade", {
    form: undefined,
    executionDeferred: new $.Deferred()
}, {
    /*
    *   Constructor
    */
    init: function (params) {
        params = params || {};

        // Set observable element
        this.observableElement = $({});

        // Injection of Device, only for print version purpose
        var device = params.device || "";

        // Defines a device factory for all rendering
        this.deviceFactory = new bizagi.rendering.device.factory();

        // Creates a data service instance
        this.dataService = new bizagi.render.services.service(params);

        // Retreives the render factory
        this.renderFactory = this.deviceFactory.getRenderFactory(this.dataService, device);
    },
    getFactory: function () {
        var self = this;
        return {
            deviceFactory: self.deviceFactory,
            dataService: self.dataService,
            renderFactory: self.renderFactory
        };
    },
    /*
    *   Subscribe method
    */
    subscribe: function () {
        this.observableElement.bind.apply(this.observableElement, arguments);
    },
    /*
    *   Unsubscribe method
    */
    unsubscribe: function () {
        this.observableElement.unbind.apply(this.observableElement, arguments);
    },
    /*
    *   Publish method
    */
    publish: function () {
        return this.observableElement.triggerHandler.apply(this.observableElement, arguments);
    },
    /*
    *   This method will re-execute the process
    */
    update: function (params) {
        var self = this;

        // Update rendering mode
        if (params.mode)
            self.mode = params.mode;

        return self.execute($.extend(params, {
            canvas: self.canvas,
            mode: self.mode
        }));
    },
    /*
    *   Start point method to use in the main javascript pages
    *   This method will process everything and attach the html directly to the dom
    */
    execute: function (params) {
        var self = this;
        var doc = this.ownerDocument;
        var body = $("body", doc);
        params = params || {};

        // Creates ready deferred
        if (self.executionDeferred && self.executionDeferred.state) {
            if (self.executionDeferred.state() == "resolved") {
                self.executionDeferred = $.Deferred();
            }
        } else {
            self.executionDeferred = $.Deferred();
        }

        // Performance measurement stuff
        bizagi.chrono.initAndStart("rendering+data", true);
        bizagi.rendering.render.startOptimization();

        // Override mode
        if (typeof (params.mode) === "undefined") {
            if (!bizagi.util.isEmpty(window.location.search)) {
                var queryString = bizagi.util.getQueryString();
                params.mode = queryString["mode"];
            }
        }

        // If the canvas is not given, we need to create one
        var canvas = self.canvas = params.canvas = params.canvas || $("<div />").appendTo(body);
        self.mode = params.mode;

        self.process(params).done(function (form) {

            // Clear canvas    
            if (!params.refreshing) {
                canvas.empty();
            }

            // Append content
            canvas.append(form.container);

            // Keep reference in class
            self.form = form;
            self.form.setSize({ width: self.lastWidth, height: self.lastHeight });

            // Save window size variables
            setTimeout(function () {
                self.lastWidth = $(window).width();
                self.lastHeight = $(window).height();
            }, 2000);

            // Publish an event to check if the form has been set in the DOM
            form.triggerHandler("ondomincluded");

            // Notify to module users that the form has been rendered
            self.publish("rendering-formRendered", {});

            // Configure handlers
            self.configureRefresh(form, canvas);
            self.configureRouting(form, canvas);
            self.configureRenderError(form, canvas);
            self.configureResize(form);
            self.configureGlobalHandlers(form);

            // Check if it is a summary form
            if (params.summaryForm) {
                form.container.addClass("ui-bizagi-summary-form");
            }

            // Ends main timer and log everything
            bizagi.chrono.stopAndLog("rendering");
            bizagi.chrono.stopAndLog("rendering+data");
            bizagi.chrono.stopAndLog("submitForm");
            bizagi.chrono.stopAndLog("submitForm-ajax");
            bizagi.chrono.stopAndLog("waiting");

            // Resolves deferred
            bizagi.rendering.render.stopOptimization();

            // Expose public reference of form
            if (bizagi.override.enableE2EInterface) {
                self.Class.form = self.form;
                self.Class.executionDeferred.resolve(self.form);
            }

            self.executionDeferred.resolve(self.form);

        }).fail(function (message, errorType) {

            $.when(self.renderFactory)
            .done(function (renderFactory) {

                var errorTemplate = renderFactory.getCommonTemplate("form-error");
                // Fill canvas
                canvas.empty();
                canvas.append($.tmpl(errorTemplate, {
                    message: message
                }));
                self.canvas.triggerHandler("errorform");
                // Ends main timer and log everything
                bizagi.chrono.stopAndLog("rendering");
                bizagi.chrono.stopAndLog("rendering+data");

                self.executionDeferred.reject();
            });
        });

        return self.executionDeferred.promise();
    },
    /*
    *   Returns the execution deferred to determine if the component is ready or not
    */
    ready: function () {
        return this.executionDeferred.promise();
    },
    /*
    *   Loads data and render factory in order to process the form
    *   Returns a deferred to set callbacks when the process is done
    */
    process: function (params) {
        var self = this;
        var defer = new $.Deferred();

        // Call get form data service
        var dataPromise = self.dataService.getFormData(params);

        // Set callback when requests have been done
        var canvas = self.canvas || params.canvas;

        $.when(dataPromise, self.renderFactory)
        .done(function (data, renderFactory) {
            if (data && data.type == "reload") {
                var form = self.form;
                if (form) {
                    form.endLoading();
                    form.dispose();
                }
                // Trigger handler on canvas
                canvas.triggerHandler("routing");

            } else if (data && data.type == "suspended") {
                var errorTemplate = renderFactory.getTemplate("info-message");
                var message = bizagi.localization.getResource("render-case-suspended");
                var errorHtml = $.tmpl(errorTemplate, {
                    message: message
                });
                // Remove loading icon from summary container
                errorHtml.appendTo(canvas);

                defer.fail();

            } else if (data && data.type != "error") {
                if (params.hasOwnProperty('printversion')) {
                    data = self.transformGridControl(data);
                    data.form.properties.editable = "False";
                }
                bizagi.chrono.initAndStart("rendering");
                var form = self.processForm(data.form, renderFactory, params);

                // Resolve deferred
                defer.resolve(form);

            } else {
                self.getFailDeferred(data, defer);
            }
        }).fail(function (errorMessage) {
            self.getFailDeferred(errorMessage, defer);
        });

        return defer.promise();
    },
    /**
    * In the print version widget when grid control was rendered, the main render has broken
    * Is necesary change id of grid control to fixed these  problems
    */
    transformGridControl: function (data) {
        var self = this;
        if (data == null) {
            return data;
        }

        if (data.hasOwnProperty('type') && data.type == 'grid') {
            data.id = data.id + "-print";
            data.allowAdd = "False";
            data.allowDelete = "False";
            data.allowEdit = "False";
            data.allowGrouping = "False";
            data.allowMore = "False";
            data.allowSearch = "False";
        } else {
            $.each(data, function (key, value) {
                if (typeof (value) == 'object') {
                    data[key] = self.transformGridControl(data[key]);
                }
            });
        }
        return data;
    },
    /**
    * Resolve deferred 
    */
    getFailDeferred: function (errorMessage, defer) {
        var self = this;
        var message = "";
        var jsonErrorMessage = {};
        try {
            jsonErrorMessage = JSON.parse(errorMessage.responseText);
        } catch (e) {
            jsonErrorMessage = { message: errorMessage.responseText, errorType: "ERRORUNKNOWN" };
        }


        if (jsonErrorMessage.message) {
            message += "<br>Error Type: " + jsonErrorMessage.errorType;
            message += "<br>Error Message: " + jsonErrorMessage.message;
        } else {
            if (jsonErrorMessage.errorType == "JSharpNotSupportedException") {
                message += "<br>Error Message: " + bizagi.localization.getResource("jsharp-required");
            }
        }

        // Error in metadata InvalidFormMetadata
        if (jsonErrorMessage.errorType == 'ERRORUNKNOWN') {
            defer.reject(message, jsonErrorMessage.errorType);
        } else {

            defer.reject(message);
        }
    },
    /*
    *   Process the form
    */
    processForm: function (data, renderFactory, params) {
        var form = renderFactory.getContainer($.extend(params, {
            type: params.type || "form",
            data: data
        }));

        // Render the full form
        form.render();

        return form;
    },
    /*
    *   Performs a resize
    */
    resize: function (args) {
        var self = this;
        if (self.form) {
            self.form.trigger("renderresize", args);
        }
    },
    /*
    *   Binds a refresh handler to detect when the whole form needs to fetch all data from server
    */
    configureRefresh: function (form, canvas) {
        var self = this;

        // Attach a refresh handler to recreate all the form
        form.one("refresh", function (_, refreshParams) {

            // Find the scroll top
            var parent = form.container.parent();
            parent = bizagi.util.scrollTop(parent);

            //var scrollTop = (refreshParams.focus) ? $('div[data-render-id="' + refreshParams.focus.id + '"]').offset().top - 100 : parent.scrollTop();//no sirve si est� emulado o en el dispositivo
            var scrollTop = parent.scrollTop();//tiene errores con tabs
            self.activeTabs = $('.bz-wp-tabs-ui.tabSelected', bizagi.kendoMobileApplication.view().content);

            //Dispose current form
            form.dispose();
            canvas.fastEmpty();

            if (self.executionDeferred && self.executionDeferred.state) {
                if (self.executionDeferred.state() == "resolved") {
                    self.executionDeferred = $.Deferred();
                }
            }

            // Re-execute process
            $.extend(refreshParams, { idCase: bizagi.context.idCase, displayName: bizagi.context.displayName });
            $.when(self.execute($.extend(refreshParams, { canvas: canvas, refreshing: true })))
            .done(function () {
                self.activeTabs.each(function (i, e) {
                    var dataReference = $(e).data('reference-tab');
                    $('div[data-reference-tab="' + dataReference + '"]').trigger('click');
                });
                // Restore scroll at same position
                setTimeout(function () { parent.scrollTop(scrollTop); }, 100);
            });

            return self.executionDeferred.promise();
        });
    },
    /*
    *   Binds a resize hanlder to configure the resize behaviour
    */
    configureResize: function (form) {
        var self = this;

        // Attach resize handler
        form.bind("renderresize", function (_, args) {
            args = args || {};
            // Just allow one resize at a time
            if (self.resizeTimeout)
                return;
            var resizeFn = function () {
                // Call resize event in form
                var width = $(window).width();
                var height = $(window).height();
                if (args.forceResize || width != self.lastWidth) {

                    // Logging stuff
                    bizagi.chrono.initAndStart("resize");

                    // Perform resize
                    form.resize({
                        width: width,
                        height: height
                    });
                    self.lastWidth = width;
                    self.lastHeight = height;

                    // Logging stuff
                    bizagi.chrono.stopAndLog("resize");
                    bizagi.chrono.log("resize");
                }

                self.resizeTimeout = null;
            };
            self.resizeTimeout = setTimeout(resizeFn, 0);

        });
        self.resize();
    },
    /*
    *   Binds a routing handler to detect when the workportal need to enroute the case
    */
    configureRouting: function (form, canvas) {
        // Attach a routing handler to notify to the caller
        form.bind("routing", function (context, triggerParams) {
            //Dispose current form
            form.dispose();

            // Trigger handler on canvas
            canvas.triggerHandler("routing", triggerParams);
        });
    },
    /*
    *   Binds a generic handler that will be replicated to facade instantiators
    */
    configureGlobalHandlers: function (form) {
        var self = this;

        // Attach a routing handler to notify to the caller
        form.bind("globalHandler", function (_, args) {
            // Trigger handler on canvas
            return self.publish(args.eventType, args.data);
        });
    },
    /*
    * Binds error form handler to detect when the render element nop posible get information or error in server
    */
    configureRenderError: function (form, canvas) {
        var self = this;

        form.bind("formRenderingError", function (event, errorMessage) {
            $.when(self.renderFactory)
                    .done(function (renderFactory) {
                        var message = "<br>Error: ";

                        errorMessage = errorMessage.replace(/(\r\n|\n|\r)/gm, "");

                        var jsonErrorMessage = JSON.parse(errorMessage);
                        if (jsonErrorMessage.message) {
                            message += jsonErrorMessage.message;
                            message += "<br>Error Type: " + jsonErrorMessage.errorType;
                        }
                        var errorTemplate = renderFactory.getCommonTemplate("form-error");
                        // Fill canvas
                        canvas.empty();
                        canvas.append($.tmpl(errorTemplate, {
                            message: message
                        }));
                        //send the type error to differentiate between a form and an item for render
                        self.canvas.triggerHandler("errorform", "renderItemError");
                        // Ends main timer and log everything
                        bizagi.chrono.stopAndLog("rendering+data");
                        bizagi.chrono.stopAndLog("rendering");
                    });
        });
    }
});
