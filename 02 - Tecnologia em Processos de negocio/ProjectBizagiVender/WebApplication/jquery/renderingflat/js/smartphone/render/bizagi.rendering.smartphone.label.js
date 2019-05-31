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

        properties.editable = false;
        self.getArrowContainer().hide();

        if (!self.properties.editable)
            self.getContainerRender().addClass("bz-rn-non-editable");

        container.addClass("ui-bz-rn-label-only");

        this._super();
    }
});