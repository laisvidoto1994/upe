/**
 * Bizagi login module
 * 
 * @author Edward J Morales
 */

/*
 *   Create login facade
 */
$.Class.extend("bizagi.login.facade", {}, {
    /* 
     *   Constructor
     */
    init: function(params) {
        this.oAuthParameters = params.oAuthParameters || {};
        // Defines a device factory (desktop, tablets ...)
        this.deviceFactory = new bizagi.login.device.factory(this);
        // Creates a data service instance
        this.dataService = new bizagi.login.services.service(params);
        // Set default params
        this.defaultParams = params || {};
    },
    /*
     *   Loads the default widget when executing the workportal
     */
    loadDefaultWidget: function() {

    },
    /*
     *   Start point method to use in the main javascript pages
     *   This method will process everything and attach the html directly to the dom
     */
    execute: function(canvas) {
        var self = this;
        var doc = this.ownerDocument;
        var body = $("body", doc);
        canvas = canvas || $("<div/>").appendTo(body);
        // Loads the default Widget
        self.loadDefaultWidget();
        // Creates ready deferred
        self.executionDeferred = new $.Deferred();
        $.when(self.process()).done(function(content) {
            // Replace canvas with content
            bizagi.util.replaceSelector(body, canvas, content);
            self.executionDeferred.resolve();
        });
    },
    /*
     *   Returns the execution deferred to determine if the component is ready or not
     */
    ready: function() {
        return this.executionDeferred.promise();
    },
    /*
     *   Loads a login facade to delegate rendering based on device detection
     *   Returns a deferred to set callbacks when the process is done
     */
    process: function() {
        var self = this;
        var defer = new $.Deferred();
        // Create a workportal facade
        var facade = this.deviceFactory.getLoginFacade(self.dataService);
        // Set callback when requests have been done
        $.when(facade).pipe(function(loginFacade) {
            // Creates login component
            self.loginFacade = loginFacade;
            return loginFacade.render();
        }).done(function(content) {
            // Resolve deferred
            defer.resolve(content);
        });
        return defer.promise();
    }
});
