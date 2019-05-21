/*
*   Name: BizAgi Workportal Main Controller
*   Author: Diego Parra
*   Comments:
*   -   This script will define a base class to handle workportal layouts for any device
*/

$.Class.extend("bizagi.workportal.controllers.controller", {}, {

    /**
    *   Constructor
    */
    init: function (workportalFacade, dataService) {
        // Set workportal facade
        this.workportalFacade = workportalFacade;

        // Set data service
        this.dataService = dataService;

        // Set l10n service
        this.resources = bizagi.localization;

        // Set a component container hash to use with templates
        this.componentContainers = {};

        // Define an object to hold the subscribe collection
        this.subscribers = [];

        // Flag to check if the element is disposed
        this.disposed = false;

        // Define an object to hold the templates used in the widget
        this.tmpl = {};

        //Define deferred to know if the templates were loaded
        this.templatesDeferred = null;
    },

    /*
    *   Returns the current workportal
    */
    getWorkportal: function () {
        return this.workportalFacade.workportal;
    },

    /**
    *   Publish an event so any controller can subscribe to it
    */
    publish: function (eventName, params) {
        if (this.disposed) return null;
        return $(document).triggerHandler(eventName, params);
    },

    /**
    *   Subscribe to an event that any controller could trigger
    */
    subscribe: function (eventName, callback) {
        if (this.disposed) return null;
        $(document).bind(eventName, callback);
        this.subscribers.push({ event: eventName });
    },

    /**
    *   Subscribe to one time event that any controller could trigger
    */
    subscribeOneTime: function (eventName, callback) {
        if (this.disposed) return null;
        $(document).one(eventName, callback);
        this.subscribers.push({ event: eventName });
    },

    /**
    *   Un Subscribe to an event that any controller could trigger in this document
    */
    unsubscribe: function (eventName, callback) {
        if (this.disposed) return null;
        if (callback) {
            $(document).unbind(eventName, callback);
        }
        else { $(document).unbind(eventName); }
    },

    /**
    *   Makes the base processing of the layout (mix templates + data)
    *   after all that processing will call a post-render method to
    *   be implemented in each device to apply custom plugins
    *   Returns a promise because the rendering could be asynchronous
    */
    render: function () {
        var self = this;
        var defer = new $.Deferred();
        self.renderingDeferred = new $.Deferred();

        // Render content
        $.when(self.areTemplatedLoaded())
        .pipe(function () {
            return self.renderContent();
        })
        .done(function () {

            // Call post-render method
            self.postRender();

            // Resolve deferred
            defer.resolve(self.getContent());
            self.renderingDeferred.resolve();
        });

        return defer.promise();
    },

    /*
    *   Returs the rendered content
    */
    getContent: function () {
        return this.content;
    },

    /*
    *   Returns the mapped resource
    */
    getResource: function (key) {
        return this.resources.getResource(key);
    },

    /*
    *   Renders the content for the current controller
    *
    */
    renderContent: function () {
        // Override on implementations
        return "";
    },


    /*
    *   To be overriden in each device to apply layouts
    */
    postRender: function () { },

    /*
    *   Returns the component replaced tag selector
    */
    getComponentSelector: function (component) {
        return "[data-bizagi-component=" + component + "]";
    },

    /*
    *   Returns the component replaced tag selector
    */
    getComponentContainer: function (component) {
        var self = this;
        var content = self.getContent();
        if (!content || content.length == 0) return null;

        // Find component parent and cache it
        //var componentElement = self.componentContainers[component];
        //if (componentElement == null) {
            // Find the component inside the main content
            //componentElement = $(self.getComponentSelector(component), content);

            // If still not found, try to check if content element is the component
          //  if (componentElement.length == 0 && content.is(self.getComponentSelector(component))) {
          //      componentElement = content;
          //  }

            // Cache the component
           // self.componentContainers[component] = componentElement;
        //}
        //return self.componentContainers[component];
        return $(self.getComponentSelector(component), content);
    },

    /*
    *   Asks for a full resize
    */
    resizeLayout: function () {
        this.publish("resizeLayout");
    },

    /*
    * Do stuff when a resize has been triggered
    */
    performResizeLayout: function () { },

    /*
    *   Disposes the widget
    */
    dispose: function () {
        var self = this;
        
        if (self.subscribers != null) {
            // Remove all subcriptions
            $.each(self.subscribers, function (i, item) {
                self.unsubscribe(item.event);
            });
        }
        
        setTimeout(function () {
            bizagi.util.dispose(self);
            self.disposed = true;
        }, bizagi.override.disposeTime || 50);
    },


    /*
    * Loads dinamically a set of templates
    */
    loadTemplates: function (templates) {
        var self = this,
            def = self.templatesDeferred = new $.Deferred(),
            tmplPromises = [];

        var useNewEngine = (templates.useNewEngine != undefined) ?  templates.useNewEngine : true;

        for (var name in templates) {
            if (name != "useNewEngine") {
                tmplPromises.push(
                    self.loadTemplate({
                        "name" : name,
                        "path" : templates[name],
                        "useNewEngine" :useNewEngine
                   })
                );
            }
        }

        $.when.apply($, tmplPromises)
            .done(function () {
                def.resolve();
            });

        return def.promise();
    },


    /*
    * Loads template 
    */
    loadTemplate: function (data) {
        var self = this;

        if (self.tmpl[data.name]) {
            return self.tmpl[data.name];
        } else {
            if (data.useNewEngine){
                return bizagi.templateService.getTemplateWidget(data.path)
                    .done(function (tmpl) {
                        self.tmpl[data.name] = tmpl;
                    });
            }

            return bizagi.templateService.getTemplate(data.path)
                .done(function (tmpl) {
                    self.tmpl[data.name] = tmpl;
                });

        }
    },

    /*
    * Gets template 
    */
    getTemplate: function (name) {
        if (this.tmpl.hasOwnProperty(name)) {
            return this.tmpl[name];
        }
        return null;

    },

    /*
    * Returns a promise, it is resoved when the widget is rendered
    */
    isRendered: function () {
        var self = this;

        if (!self.renderingDeferred) {
            return false;
        }
        return self.renderingDeferred.promise();
    },

    /*
    *
    */
    areTemplatedLoaded: function () {
        return this.templatesDeferred;
    }

});
