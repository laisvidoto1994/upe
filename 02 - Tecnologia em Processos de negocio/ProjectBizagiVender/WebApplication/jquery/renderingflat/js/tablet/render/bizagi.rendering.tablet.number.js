/*
*   Name: BizAgi Tablet Render Number Extension
*   Author: Bizagi Mobile Team 
*   Comments:
*   -   This script will redefine the number render class to adjust to tablet devices
*/

// Extends itself
bizagi.rendering.number.extend("bizagi.rendering.number", {}, {
    /*
    *
    */
    renderReadOnly: function () {
        var self = this;
        var value = self._super();
        var template = self.renderFactory.getTemplate("readonlyNumber");
        return $.fasttmpl(template, {value: value});
    },

    /* POSTRENDER 
    =====================================================*/
    postRender: function () {
        var self = this;

        // Call base
        self._super();

        self.numericInput = $("input", self.getControl());

        var input = $("input", self.element);
        if (!input || input.length === 0) return;
    },

    /*
    *
    */
    postRenderReadOnly: function() {
        var self = this;
        var control = self.getControl();
        var container = self.getControl();

        container.closest(".ui-bizagi-render").addClass("bz-rn-read-only");
        self.numericInput = $(".ui-bizagi-render-numeric", control);
    },

    /* SETS THE VALUE IN THE RENDERED CONTROL
    =====================================================*/
    setDisplayValue: function (value) {
        var self = this;
        var properties = self.properties;
        var container = self.getControl();
        var displayValue = self.getDisplayValue(value);

        if (typeof (displayValue) == "string" || typeof (displayValue) == "number") {
            if (properties.editable && self.numericInput) {
                self.numericInput.prop("value", value);
                // Formats the input
                self.executeFormatCurrencyPlugin();
            } else if (!properties.editable) {
                self.numericInput.text(displayValue);
            }
        }

        // Set internal value
        self.setValue(value, false);
    },

    attachRetypeDouble: function() {
        var self = this;
        var element = self.element;

        var input = $("input", element);
        if (!input || input.length === 0) return;

        // Apply blur handler to check value
        input.blur(function() {
            var control = $(this);

            self.retypeDouble(control);
        });
    },

    retypeDouble: function(control) {
        var self = this;

        if ($(control).attr("type") !== "hidden" &&
            $(control).css("display") !== "none" &&
            $(control).css("visibility") !== "hidden") {

            if (!control.data("oldValue") || $(this).data("oldValue") === "") {

                // Check that there is something in the value or if a value has already been set
                if (control.val() === "" || control.val() === control.attr("newValue"))
                    return;

                control.data("oldValue", control.val());
                control.val("");

                // Create new tooltip
                try {
                    control.tooltip("destroy");
                } catch (e) { }

                // Re-type value
                control.attr("title", self.getResource("render-number-retype"));
                control.tooltip();
                control.tooltip("open");

                // Focus after 100ms to avoid bubbling
                setTimeout(function() {
                    control.focus();
                }, 100);

            } else {

                // Check that there is something in the value
                if (control.val() === "") {
                    return;
                }

                if (control.val() !== control.data("oldValue")) {
                    self.setValue("");
                    control.val("");
                    control.data("oldValue", "");

                    try {
                        // Destroy tooltips
                        control.tooltip("destroy");
                    } catch (e) { }

                    control.attr("title", self.getResource("render-number-retype-fail"));
                    control.tooltip();
                    control.tooltip("open");

                    setTimeout(function() {
                        control.focus();
                    }, 100);

                } else {
                    control.data("newValue", control.val());
                    control.data("oldValue", "");

                    try {
                        // Destroy tooltips
                        control.tooltip("destroy");
                    } catch (e) { }
                }

            }
        }
    }
});