/*
*   Name: BizAgi Panel Container Class
*   Author: Diego Parra
*   Comments:
*   -   This script will define a panel container class for all devices
*/

bizagi.rendering.container.extend("bizagi.rendering.panel", {}, {

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
        var template = self.renderFactory.getTemplate("panel");

        // Render the panel
        var html = $.fasttmpl(template, {
            displayName: properties.displayName,
            loading: properties.loading,
            message: properties.message,
            orientation: properties.orientation,
            uniqueId: properties.uniqueId,
            cssClass: properties.cssclass
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
        var properties = this.properties;

        // Set height
        if (properties.height) {
            panel.height(properties.height);
        }

        // Call base
        this._super(panel);
    }

});