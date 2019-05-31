/*
*   Name: BizAgi Smartphone Render Label Extension
*   Author: Diego Parra
*   Comments:
*   -   This script will redefine the label render class to adjust to smartphone devices
*/

// Extends itself
bizagi.rendering.label.extend("bizagi.rendering.label", {}, {

    renderSingle: function () {
        var self = this;
        var properties = self.properties;
        var container = self.getContainerRender();
        var control = self.getControl();
        properties.editable = false;

        self.getContainerRender().css("min-height", "20px");
        self.getContainerRender().find(".ui-bizagi-label").css("height", "auto");
        self.getContainerRender().find(".ui-bizagi-label").css("min-height", "20px");
        
        if (!self.properties.editable)
            self.getContainerRender().addClass("bz-command-not-edit");

        this._super();
    }



});