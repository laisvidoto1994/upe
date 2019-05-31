/*
*   Name: BizAgi smartphones Render Hidden Extension
*   Author: Diego Parra
*   Comments:
*   -   This script will redefine the hidden render class to adjust to smartphone devices
*/


// Extends itself
bizagi.rendering.hidden.extend("bizagi.rendering.hidden", {}, {
    render: function () {
        var self = this;
        return self.renderSingle();
    },
    renderSingle: function () {
        var self = this;
        var properties = self.properties;
        if (properties.value !== undefined) {
            self.setDisplayValue(properties.value);
        }  
        self.element = $("<div></div>").hide();
        return self.element;
    },

    setDisplayValue: function (value) {
        var self = this;
            self.setValue(value, false);
    }


});
