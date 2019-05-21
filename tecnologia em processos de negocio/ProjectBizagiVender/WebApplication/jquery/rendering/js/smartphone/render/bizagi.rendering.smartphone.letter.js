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
        var container = self.getContainerRender();
        var control = self.getControl();
        properties.editable = false;
        if (!properties.editable) {
            //container.addClass("bz-command-not-edit");
        }

    },
    setDisplayValue: function (value) {
    },
    renderEdition: function () {
        var self = this;
        var properties = self.properties;
        var container = self.getContainerRender();
        var control = self.getControl();
        self.value = self.getLetterContent();
        var textTmpl = self.renderFactory.getTemplate(self.getTemplateEditionName());
        self.inputEdition = $.tmpl(textTmpl);
    },
    setDisplayValueEdit: function (value) {
        var self = this;
        $.when(value).done(function (response) {
            $(self.inputEdition).html(response);
            //self.value=value.responseText
        });
    },
    actionSave: function () {
    },
    getTemplateEditionName: function () {
        return "edition.letter";
    }


});
