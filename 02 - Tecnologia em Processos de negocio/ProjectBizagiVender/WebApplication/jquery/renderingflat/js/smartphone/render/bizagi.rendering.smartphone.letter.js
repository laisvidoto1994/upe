/*
*   Name: BizAgi smartphone Render Letter Extension
*   Author: oscaro
*   Comments:
*   -   This script will redefine the letter render class to adjust to smartphones devices
*/

// Extends itself
bizagi.rendering.letter.extend("bizagi.rendering.letter", {}, {

    renderSingle: function () {
        var self = this;
        var properties = self.properties;

        properties.editable = false;
    }
});
