/*
*   Name: BizAgi Panel Container Class
*   Author: David Romero
*   Comments:
*   -   This script will define a panel container class for all devices
*/

bizagi.rendering.container.extend("bizagi.rendering.contentPanel", {}, {

    /*
    *   Constructor
    */
    initializeData: function (params) {
        var self = this;

        // Call base
        this._super(params);

        // Override properties
        var properties = self.properties;
        properties.displayName = properties.displayName || "";
    },


    /*
    *   Render the container layout
    */
    renderContainer: function () {
        var self = this;
        var properties = this.properties;
        var template = self.renderFactory.getTemplate("contentPanel");

        // Render the panel
        var html = $.fasttmpl(template, {
            displayName: properties.displayName,
            mode: self.getMode(),
            uniqueId: properties.uniqueId,
            isDesign: (self.getMode() === "design"),
            messageValidation: properties.messageValidation,
            cssClass: properties.cssclass,
            guid: properties.guid
        });

        // Render children
        html = self.replaceChildrenHtml(html, self.renderChildrenHtml());
        return html;
    },

    /*
    *   Process the html rendering object
    */
    postRenderContainer: function (panel) {

        var self = this;

        // Call base
        self._super(panel);
    }

});