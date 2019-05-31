/*
*   Name: BizAgi Tablet Render Text Extension
*   Author: Bizagi Mobile Team
*   Comments:
*   -   This script will redefine the text render class to adjust to smartphone devices
*/

// Extends itself
bizagi.rendering.text.extend("bizagi.rendering.text", {}, {
    /**
     *
     */
    renderSingle: function () {
        var self = this;
        var properties = self.properties;
        var container = self.getContainerRender();
        var control = self.getControl();

        self.input = (control.find("input").length != 0) ? control.find("input") : control.find(".bz-rn-non-editable");

        // Define max length of element
        if (properties.maxLength > 0) {
            self.input.attr("maxlength", properties.maxLength);
        }

        if (!properties.editable) {
            container.addClass("bz-rn-non-editable");
            self.input.attr("readonly", "readonly");
        } else {
            container.addClass("bz-command-edit-inline");
            self.input.removeAttr("readonly");
            self.configureHandlers();
        }
    },

    /**
     * Creates the markup for the readonly text field
     * Comment: includes the default value in the markup
     * @returns {html}
     */
    renderReadOnly: function () {
        var self = this;
        var template = self.renderFactory.getTemplate("readonly");
        return $.fasttmpl(template, {});
    },

    /**
     *
     */
    postRenderSingle: function () {
        //Attach event for retype double
        var self = this;
        var properties = self.properties;

        self._super();

        if (properties.retype == "double") {
            self.attachRetypeDouble();
        }

        // Implement maxlength behaviour (in android lets you write more chars than allowed)

        var element = self.element;
        var input = $("input", element);

        if (!input || input.length === 0) return;
    },

    setDisplayValue: function (value) {
        var self = this;
        self.setValue(value, false);

        // This is temporal
        if (typeof (value) == "object") return;

        if (typeof (value) === "string") {
            value = value.replaceAll("\\n", " ").replaceAll("\n", " ");
            value = value.replaceAll("&amp;", "&");

            if (self.properties.editable) {
                self.input.first().html(value);
                self.input.first().val(value);
            } else {
                self.input.text(value);
            }

        }
    },

    setDisplayValueEdit: function (value) {
        var self = this;
        self.inputEdition.val(value);
    },

    actionSave: function () {
        var self = this;
        var value = self.inputEdition.val();

        self.setValue(value, false);
        self.input.html(value);
        self.input.val(value);
    },

    getTemplateName: function () {
        return "text";
    },

    attachRetypeDouble: function () {
        var self = this;
        var element = self.element;

        var input = $("input", element);
        if (!input || input.length == 0) return;

        // Apply blur handler to check value
        input.blur(function () {
            var control = $(this);
            if ($(control).attr("type") != "hidden" &&
                $(control).css("display") != "none" &&
                $(control).css("visibility") != "hidden") {

                if (!control.data("oldValue") || $(this).data("oldValue") == "") {

                    // Check that there is something in the value
                    if (control.val() == "")
                        return;

                    // Check if a value has already been set
                    if (control.val() == control.attr("newValue"))
                        return;

                    control.data("oldValue", control.val());
                    control.val("");
                    
                    try {
                        // Create new tooltip
                        control.tooltip("destroy");
                    } catch (e) {
                    }

                    control.attr("title", self.getResource("render-number-retype")); //"Re-escriba el valor"
                    control.tooltip();
                    control.tooltip("open");

                    // Focus after 100ms to avoid bubbling
                    setTimeout(function () {
                        control.focus();
                        input.focus();
                    }, 100);
                } else {
                    if (control.val() != control.data("oldValue")) {
                        self.setValue("");
                        control.val("");
                        control.data("oldValue", "");
                        control.tooltip("destroy");
                        control.attr("title", self.getResource("render-text-retype-error"));
                        control.tooltip();
                        control.tooltip("open");

                        setTimeout(function () {
                            control.focus();
                        }, 100);
                    } else {

                        control.data("newValue", control.val());
                        control.data("oldValue", "");

                        // Destroy tooltips
                        control.tooltip("destroy");
                    }
                }
            }
        });
    }
});