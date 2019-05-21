/*
*   Name: BizAgi Tablet Render Text Extension
*   Author: Oscar o
*   Comments: Extended text implementation
*/

// Extends itself
bizagi.rendering.extendedText.extend("bizagi.rendering.extendedText", {
    TEXTAREA_LINE_HEIGHT: 10
}, {

    //


    renderSingle: function () {
        var self = this;
        var control = self.getControl();
        var properties = self.properties;
        var container = self.getContainerRender();

        self.element = container;
        self.input = container.find(".bz-rn-text-extended");

        if (!properties.editable) {
            container.addClass("bz-command-not-edit");
            self.input.attr('readonly', "readonly");
            self.input = self.getControl().html("<span class=\"bz-command-not-edit bz-rn-text\"></span>").find("span");
        }
    },

    /* SET DISPLAY VALUE
    ======================================================*/
    setDisplayValue: function (value) {

        var self = this;
        var properties = self.properties;
        var container = self.getContainerRender();

        self.setValue(value, false);
        if (!properties.editable) {
            value = value.replaceAll("<", "&#60");
            value = value.replaceAll(">", "&#62");
            value = value.replaceAll("\"", "&#34;").replaceAll("'", "&#39;").replaceAll("/", "&#47;");
            self.input.html(jQuery.nl2br(value));
        }
        else {
            self.input.html(value.replaceAll('\\n', '\n'));
            self.input.val(value.replaceAll('\\n', '\n'));
        }

        self.calculateHeight(self.input);

    },

    renderEdition: function () {

        var self = this;
        var properties = self.properties;
        var container = self.getContainerRender();
        var control = self.getControl();

        var extendedTextTmpl = self.renderFactory.getTemplate("edition.extendedText");
        self.inputEdition = $.tmpl(extendedTextTmpl);

        $(self.inputEdition).bind("keyup", function () {
            /* var textarea = this;
            var newHeight = textarea.scrollHeight;
            var currentHeight = textarea.clientHeight;

            if (newHeight > currentHeight) {
            $(this).css("height", newHeight + 2 * self.Class.TEXTAREA_LINE_HEIGHT + 'px');
            }*/
            self.calculateHeight(this);

        });

        // do focus to input to allow instant edition
        setTimeout(function () {
            $(self.inputEdition).focus();
        }, 1000);


    },
    setDisplayValueEdit: function (value) {
        var self = this;
        self.inputEdition.html(value.replaceAll('\\n', '\n'));
        $(self.inputEdition).keyup();

    },

    actionSave: function () {
        var self = this;

        var value = self.inputEdition.val();
        self.setValue(value, false);
        self.input.html(value);
        self.input.val(value);
        self.input.css("height", self.inputEdition.height() - self.Class.TEXTAREA_LINE_HEIGHT);

    },


    calculateHeight: function (input) {
        var self = this;
        var textarea = input;
        var newHeight = textarea.scrollHeight;
        var currentHeight = textarea.clientHeight;
        if (newHeight > currentHeight) {
            $(textarea).css("height", newHeight + 2 * self.Class.TEXTAREA_LINE_HEIGHT + 'px');
        }
    }




});