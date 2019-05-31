
/*
*   Name: Bizagi FormModeler xpathnavigator Presenter
*   Author: David Montoya
*   Date: 15mar12
*/
bizagi.editor.observableClass.extend("bizagi.editor.component.xpathnavigator.presenter", {}, {

    /*
    *   Creates the presenter
    */
    init: function (params) {
        this._super();
        params = params || {};

        this.canvas = params.canvas || $("<div />");
        this.model = params.model;
        this.xpathNavigator = new bizagi.editor.component.xpathnavigator(this.canvas, $.extend(params, { presenter: this }));
    },

    /*
    *   Render the component
    */
    render: function (params) {
        var self = this;
        params = params || {};

        self.model = params.model || self.model;
        self.xpathNavigator.updateModel(self.model);
        return self.xpathNavigator.render(params);
    },

    /*
    *   Render the component
    */
    renderPopup: function (params) {
        var self = this, options;
        params = params || {};

        self.model = params.model || self.model;
        self.xpathNavigator.updateModel(self.model);

        // Bind close event
        self.xpathNavigator.subscribe("close", function () {
            if (params.onClose) params.onClose();
        });
        
        options = $.extend(params, { context: "floating" });
        return self.xpathNavigator.render(options);
    },

    /*
    *   Closes the popup
    */
    closePopup: function () {
        var self = this;
        self.xpathNavigator.close();
    },

    /*
    *   Finds and highlight a given xpath
    */
    showXpath: function (xpath) {
        var self = this;

        return self.xpathNavigator.showXpath(xpath);
    },
    
    /*
    *
    */
    showXpathByGuid : function(form, xpath) {
        this.xpathNavigator.showXpathByGuid(form, xpath);
    },

    /*
    * Finds and highlight a given metadata xpath
    */
    showMetadataXpath : function(xpath){
        this.xpathNavigator.showMetadataXpath(xpath);    
    }
    
});