/**
*   Name: BizAgi Tablet Render Text Extension
*   Author: Bizagi Mobile Team
*   Comments: Extended text implementation
*/
bizagi.rendering.extendedText.extend("bizagi.rendering.extendedText", {
    TEXTAREA_LINE_HEIGHT: 14
}, {
    /**
     * Creates the markup for the readonly extendedText field
     * Comment: includes the default value in the markup
     * @returns {html}
     */
    renderReadOnly : function () {
        var self = this;
        var result = self._super();
        var template = self.renderFactory.getTemplate("readonlyExtendedText");
        // Render template
        var html = $.fasttmpl(template, {"value": result});
        return html;
    },

    renderSingle: function () {
        var self = this;        
        var properties = self.properties;
        var container = self.getContainerRender();

        self.element = container;

        if (!properties.editable) {
            self.input = container.find(".bz-rn-text-extended pre");
            container.addClass("bz-rn-non-editable");
        } else {
            self.input = container.find(".bz-rn-text-extended");
            container.addClass("bz-command-edit-inline");

            $(self.input).bind("keyup", function () {
                self.calculateHeight(this);
                self.setValue(self.input.val(), false);
            });
        }
    },

    postRenderSingle: function() {
        //Attach event for retype double
        var self = this;
        var properties = self.properties;
        var control = self.getControl();

        self.textarea = control.find("textarea");        

        // Set the default maxlenght for the input if is 0 or undefined set to infinity
        // this resolve issue with scope strings that don't have maxlength
        if (properties.maxLength > 0)
            self.textarea.prop("maxlength", properties.maxLength);

        if (properties.maxLines) {
            self.hasMaxLines = true;
            self.textarea.prop("rows", properties.maxLines);
        } else {
            self.hasMaxLines = false;
            self.textarea.prop("rows", 6);
        }

        self._super();
    },

    /**
     *  SET DISPLAY VALUE
     *
    */
    setDisplayValue: function (value) {
        var self = this;
        var properties = self.properties;        

        self.setValue(value, false);

        if (!properties.editable) {
            self.input.html(jQuery.nl2br(value));
        } else {
            self.input.html(value.replaceAll("\\n", "\n"));
            self.input.val(value.replaceAll("\\n", "\n"));

            if (!self.hasMaxLines) {
                var rows = self.input.val().split("\n");
                self.input.prop("rows", rows.length + 1);
            }
        }
    },

    renderEdition: function () {
    },

    setDisplayValueEdit: function (value) {
    },

    actionSave: function () {
    },

    calculateHeight: function (input) {
        var self = this;
        var textarea = input;
        var newHeight = textarea.scrollHeight;
        var currentHeight = textarea.clientHeight;

        if (newHeight > currentHeight && !self.hasMaxLines) {
            $(textarea).css("height", newHeight + 2 * self.Class.TEXTAREA_LINE_HEIGHT + "px");
        }
    }
});