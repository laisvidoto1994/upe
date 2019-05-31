/*
*   Name: BizAgi Workportal Main Controller
*   Author: oo
*   Comments:
*   -   This script will define a base class to handle workportal layouts for any device
*/

$.Class.extend("bizagi.workportal.controllers.controller", {}, {

    /**
    *   Constructor
    */
    init: function (workportalFacade, dataService, params) {
        // Set workportal facade
        this.workportalFacade = workportalFacade;

        // Set data service
        this.dataService = dataService;

        // Set l10n service
        this.resources = bizagi.localization;

        //set container to bind events
        this.container = params.container || document;

        // Set a component container hash to use with templates
        this.componentContainers = {};

        bizagi.workportal.controllers.instances = {};
        bizagi.workportal.controllers.instances.controller = this;
    },

    /**
    *   Returns the current workportal
    */
    getWorkportal: function () {
        return this.workportalFacade.workportal;
    },

    /**
    *   Publish an event so any controller can subscribe to it
    */
    publish: function (eventName, params) {
        return $(this.container).triggerHandler(eventName, params);
    },

    /**
    *   Subscribe to an event that any controller could trigger
    */
    subscribe: function (eventName, callback) {
        $(this.container).bind(eventName, callback);
    },
     
    subscribeEvent: function (eventName, callback) {
        $(document).bind(eventName, callback);
    },


    /**
    *   Subscribe to one time event that any controller could trigger
    */
    subscribeOneTime: function (eventName, callback) {
        $(this.container).one(eventName, callback);
    },

    /**
    *   Un Subscribe to an event that any controller could trigger in this document
    */
    unsubscribe: function (eventName, callback) {
        if (callback) {
            $(this.container).unbind(eventName, callback);
        }
        else { $(this.container).unbind(eventName); }
    },

    /**
    *   Makes the base processing of the layout (mix templates + data)
    *   after all that processing will call a post-render method to
    *   be implemented in each device to apply custom plugins
    *   Returns a promise because the rendering could be asynchronous
    */
    render: function () {        
        bizagi.showMessageBox("controllers render", "Error");

        var self = this;
        var defer = new $.Deferred();

        // Render content
        $.when(self.renderContent())
        .done(function () {

            // Call post-render method
            self.postRender();

            // Resolve deferred
            defer.resolve(self.getContent());
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
    getResource: function (key, defaultValue) {
        return this.resources.getResource(key, defaultValue);
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
    postRender: function () { }

    /*
    *   Returns the component replaced tag selector
    */
 

});
