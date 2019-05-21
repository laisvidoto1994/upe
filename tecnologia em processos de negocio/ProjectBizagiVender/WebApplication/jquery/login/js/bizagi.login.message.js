/**
 * Message controller
 * @author Edward J Morales
 */


$.Class.extend("bizagi.login.message", {}, {
    /**
    * Constructor
    * @param {html} wrapper HTML Selector to insert message
    */
    init: function (loginFacade, wrapper) {
        this.wrapper = wrapper || $("<div></div>");
        this.messageWrapper = wrapper;
        this.errorBuffer = [];
        this.successBuffer = [];
        this.messageTemplate = loginFacade.getTemplate("login-error-message");
    },
    addErrorMessage: function (message) {
        this.errorBuffer.push(message);
    },
    addSuccessMessage: function (message) {
        this.successBuffer.push(message);
    },
    cleanErrorsQueue: function () {
        this.errorBuffer = [];
    },
    cleanSuccessQueue: function () {
        this.successBuffer = [];
    },
    /**
    * Show errors in the form
    */
    showErrors: function () {
        var self = this;
        // Render Template
        var errors = $.tmpl(self.messageTemplate, { "messages": self.errorBuffer });
        // Empty wrappet
        self.wrapper.empty();
        // Append messages
        self.wrapper.append(errors);

        // auto flush
        self.cleanErrorsQueue();

        //Show the content, if it was hiden before
        self.wrapper.show();
    },
    /**
    * Show success in the form
    */
    showSuccess: function () {
        var self = this;

        // Render Template
        var success = $.tmpl(self.messageTemplate, { "messages": self.successBuffer });

        // Add success class
        success.addClass("success");

        // Empty wrappet
        self.wrapper.empty();
        // Append messages
        self.wrapper.append(success);

        // auto flush
        self.cleanSuccessQueue();

        //Show the content, if it was hiden before
        self.wrapper.show();
    },
    hideErrors: function () {
        this.wrapper.hide();
    },
    hasErrors: function () {
        return (this.errorBuffer.length > 0) ? true : false;
    },
    hasSuccess: function () {
        return (this.successBuffer.length > 0) ? true : false;
    },

    /*
    *
    */
    showWidgetCustomMessage: function (messageStatus, messageType, params, isFromServer) {
        var self = this, message = bizagi.localization.getMessageFromLocalization(messageStatus, messageType, params, isFromServer);

        self.addErrorMessage(message);
        self.showErrors();        
    }
    
});