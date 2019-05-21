/*
*   Name: BizAgi Element Class
*   Author: Diego Parra
*   Comments:
*   -   This script will define a base class with common stuff related to all renders and containers
*/

$.Class.extend("bizagi.rendering.element", {
    ELEMENT_TYPE_CONTAINER: 1,
    ELEMENT_TYPE_RENDER: 2,
    ELEMENT_TYPE_COLUMN: 3
}, {

    /*
    *   Constructor
    */
    init: function (params) {
        // Set render factory
        this.renderFactory = params.renderFactory;

        // Set data service
        this.dataService = params.dataService;

        // Set reference to parent
        this.parent = params.parent;

        // Set l10n service
        this.resources = bizagi.localization;

        // Set the observable element
        this.observableElement = $("<div />");

        // Set the dispose flag
        this.disposed = false;

        // Update data
        this.initializeData(params.data);

        // Define an object to hold the subscribe collection
        this.subscribers = [];
    },

    /*
    *   Update or init the element data
    */
    initializeData: function (data) {
        var self = this;

        // Set the internal data
        this.properties = {};
        if (data && data.properties) this.properties = data.properties;

        // Set xpath context
        this.properties.xpathContext = this.getXpathContext();

        // Set page cache
        this.properties.idPageCache = this.getPageCache();
    },

    /*
    *   Returns the xpath context of the element
    */
    getXpathContext: function () {
        // By default return parent's xpath context
        // This method is overriden in form container which contains the real xpath context

        return (this.parent != undefined && typeof this.parent.getXpathContext == "function") ? this.parent.getXpathContext() : "";
    },

    /*
    *   Returns the page cache for the current element
    */
    getPageCache: function () {
        // By default return parent's page cache
        // This method is overriden in form container which contains the real page cache

        return (this.parent != undefined && typeof this.parent.getPageCache == "function") ? this.parent.getPageCache() : "";
    },

    /*
    *   Returns the form containing the element
    */
    getFormContainer: function () {
        // By default return parent's form container
        // This method is overriden in form container which returns itself
        if (typeof (this.parent) != "undefined")
        return this.parent.getFormContainer();
    },


    /*
    *   Returns the mapped resource
    */
    getResource: function (key) {
        return this.resources.getResource(key);
    },

    /*
    *   Returns the element type
    */
    getElementType: function () { },

    /* 
    *   Resizes the element 
    */
    resize: function (size) {

    },

    /*
    *   Focus on the current element
    */
    focus: function () {

        if (this.properties.required) {
            var layout = $("#ui-bizagi-wp-app-render-form-content");
            // Check if element is visible into scroll
            if (!bizagi.util.isScrolledIntoView(this.element, layout)) {
                $(this.element).attr('tabindex', -1).focus();
            }
            if (this.element) {
                this.element.effect('highlight', 2000);
            }
        }

        //Check if the element has parent
        if (this.parent && typeof this.parent.focus == 'function') {
            this.parent.focus();
        }
    },

    /*
    *   Publish a global event that the facade will replicate
    */
    triggerGlobalHandler: function (eventType, data) {
        if (this.disposed) return null;
        if (this.parent) return this.parent.triggerGlobalHandler(eventType, data);
        return null;
    },

    /*
    *   Triggers an event inside the control
    */
    trigger: function (eventType, data) {
        if (this.disposed) return null;
        if (this.observableElement) return this.observableElement.trigger(eventType, data);
        return null;
    },

    /*
    *   Triggers an event handler inside the control
    */
    triggerHandler: function (eventType, data) {
        if (this.disposed) return null;
        if (this.observableElement) return this.observableElement.triggerHandler(eventType, data);
        return null;
    },

    /*
    *   Binds to an event
    */
    bind: function (eventType, fn) {
        if (this.disposed) return null;
        if (this.observableElement) return this.observableElement.bind(eventType, fn);
        this.subscribers.push({ event: eventType });
        return null;
    },

    /*
    *   Un-binds to an event
    */
    unbind: function (eventType, fn) {
        if (this.disposed) return null;
        if (this.observableElement) return this.observableElement.unbind(eventType, fn);
        return null;
    },

    /*
    *   Binds a one time event
    */
    one: function (eventType, fn) {
        if (this.disposed) return null;
        if (this.observableElement) return this.observableElement.one(eventType, fn);
        this.subscribers.push({ event: eventType });
        return null;
    },

    /*
    *   Return the rendered element
    */
    getRenderedElement: function () { },

    /*
    *   Get current rendering mode
    */
    getMode: function () {
        if (this.parent) return this.parent.getMode();
    },

    /*
    *   Get current rendering params
    */
    getParams: function () {
        if (this.parent) return this.parent.getParams();
    },

    /*
    * Get current form type (ex. queryform, form)
    */
    getFormType: function () {
        var self = this;

        var form = self.getFormContainer();
        return form.properties.type || "form";
    },

    /*
    *   Returns a promise that will resolve when the element is ready
    */
    ready: function () { },

    /*
    *   Returns a promise that will resolve when the element is ready to save
    */
    isReadyToSave: function () { },

    /*
    *   Get the custom handlers set for this execution
    */
    getCustomHandlers: function () {
        return null;
    },

    /*
    *   Dispose the class so we can detect when a class is invalid already
    */
    dispose: function () {
        var self = this;
        self.disposed = true;

        setTimeout(function () {
            if (self.subscribers != null) {
                // Remove all subcriptions
                $.each(self.subscribers, function (i, item) {
                    self.unbind(item.event);
                });
            }
            delete self.subscribers;

            if (self.observableElement) self.observableElement.off();
            bizagi.util.dispose(self);
        }, bizagi.override.disposeTime || 50);
    },

    /*
    *   Check if the current object is disposed
    */
    isDisposed: function () {
        return this.disposed;
    },

    /*
    *   This method process the error or alert messages coming from the server, and adds them to the validation controller
    */
    processFailMessage: function(message) {
        var self = this;
        var form = self.getFormContainer();
        var isOfflineForm = bizagi.util.isOfflineForm({ context: self });

        if (message.errorType === "CustomMessageException") {
            // Clear previous validations
            form.validationController.clearValidationMessages();
            var error = bizagi.localization.getResource(message.message);
            form.validationController.showErrorMessage(error);
        } else {
            var message = message || {};
            message = typeof (message) == "string" ? JSON.parse(message) : message;
            var type = message.type || "error";
            var code = message.code || "code";
            message = message.responseText || (message.message || message);

            // Omit processing when the ajax didn't process
            if (type === "not-processed") return;
            if (type === "not-shown") return;
            if (isOfflineForm && code === "AUTH_ERROR") return;

            // Clear previous validations
            form.validationController.clearValidationMessages();
            if (type == "alert") {
                form.validationController.showAlertMessage(message);
            } else {
                form.validationController.showErrorMessage(message);
            }
        }

        return message;
    },

    /*
    *   Sets a waiting overlay above the current element
    */
    startLoading: function () {  /* Override in implementations */ },

    /*
    *   Removes the waiting overlay
    */
    endLoading: function () { /* Override in implementations */ },

    /**
    *   Prepare control to remove it from the render, that allows to
    *   clean all elements of the control or to do any stuff before to remove
    */
    beforeToRefresh: function () { /* Implement in each render and container if you need */ },

    /**
    *   Run before that the control has been refreshed
    */
    afterToRefresh: function () { /* Implement in each render and container if you need */ }
});

