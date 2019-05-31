/*
*   Name: BizAgi Tablet Render Text Extension
*   Author: Bizagi Mobile Team
*   Comments:
*   -   This script will redefine the text render class to adjust to tablet devices
*/

// Extends itself
bizagi.rendering.text.extend("bizagi.rendering.text", {}, {

    /* POSTRENDER 
    =====================================================*/
    postRender: function() {
        var self = this;
        var properties = self.properties;

        // Call base
        self._super();

        // Set the default maxlenght for the input
        if (properties.maxLength > 0) {
            self.input.prop("maxlength", properties.maxLength);
        }
    },

    /**
     *
     */
    renderReadOnly: function() {
        var self = this;
        var template = self.renderFactory.getTemplate("readonly");
        return $.fasttmpl(template, {});
    },

    /**
     *
     */
    postRenderReadOnly: function() {
        var self = this;
        var control = self.getControl();

        self._super();
        self.input = control.find(".bz-rn-readonly");
    },

    /* SETS THE VALUE IN THE RENDERED CONTROL
    =====================================================*/
    setDisplayValue: function(value) {
        var self = this;
        var properties = self.properties;
        var decodedValue = bizagi.util.decodeURI(value);

        // Set value in input
        if (!bizagi.util.isEmpty(value) && properties.editable) {
            value = value.replaceAll("\\n", " ").replaceAll("\n", " ");
            self.input.prop("value", value);
        } else if (!self.properties.editable ) {
            // Render as simple value
            if (typeof (value) == "string") {

                var control = self.getControl();
                var displayValue = self.getDisplayValue();
                var decodedDisplayValue = bizagi.util.decodeURI(displayValue);

                // Replace line breaks for html line breaks
                var valueToDisplay = decodedDisplayValue.replaceAll("&", "&amp;");
                valueToDisplay = valueToDisplay.replaceAll("<", "&lt;").replaceAll(">", "&gt;");
                valueToDisplay = valueToDisplay.replaceAll("\"", "&#34;").replaceAll("'", "&#39;").replaceAll("/", "&#47;");
                valueToDisplay = valueToDisplay.replaceAll("\\n", "<br/>");
                valueToDisplay = valueToDisplay.replaceAll("\n", "<br/>");

                self.input.html(valueToDisplay);

            } else {
                if (bizagi.util.isNull(value)) {
                    self.input.html("");
                }
            }
        }
        // Set internal value
        self.setValue(decodedValue, false);
    },

    attachRetypeDouble: function() {
        var self = this;
        var element = self.element;

        var input = $("input", element);
        if (!input || input.length === 0) return;

        // Apply blur handler to check value
        input.blur(function() {
            var control = $(this);
            if ($(control).attr("type") !== "hidden" &&
                $(control).css("display") !== "none" &&
                $(control).css("visibility") !== "hidden") {

                if (!control.data("oldValue") || $(this).data("oldValue") === "") {

                    // Check that there is something in the value
                    if (control.val() === "")
                        return;

                    // Check if a value has already been set
                    if (control.val() === control.attr("newValue"))
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
                    setTimeout(function() {
                        control.focus();
                    }, 100);

                } else {
                    if (control.val() !== control.data("oldValue")) {
                        self.setValue("");
                        control.val("");
                        control.data("oldValue", "");
                        control.tooltip("destroy");
                        control.attr("title", self.getResource("render-text-retype-error"));
                        control.tooltip();
                        control.tooltip("open");

                        setTimeout(function() {
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