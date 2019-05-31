/*
*   Name: BizAgi Desktop Nested Form Extension
*   Author: Diego Parra
*   Comments:
*   -   This script will define a nested form container class for all devices
*/

bizagi.rendering.panel.extend("bizagi.rendering.nestedForm", {}, {

    /*
    *   Template method to implement in each device to customize the render's behaviour when rendering in design mode
    */
    configureDesignView: function () {
        var self = this;
        var properties = self.properties;
        var container = self.container;

        container.removeClass("ui-bizagi-container-panel");
        container.addClass("ui-bizagi-container-nestedform");
        
        var title = $("<span class= 'ui-bizagi-container-nestedform-title'/>");
        title.text("Nested Form: " + properties.formDisplayName);
        container.prepend(title);        
    }
});