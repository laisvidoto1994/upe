/*
*   Name: BizAgi smartphone Render Number Extension
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
        var template = self.renderFactory.getTemplate("readonlyNumber");
        return $.fasttmpl(template, {});
    },

    /*
    *
    */
    renderSingle: function () {
        var self = this;
        var properties = self.properties;
        var container = self.getContainerRender();
        var control = self.getControl();

        if (!properties.editable) {
            self.numericInput = self.input = control.find(".ui-bizagi-render-numeric");
            container.addClass("bz-rn-non-editable");
            container.find("i").addClass("bz-rn-icon-readonly").addClass("bz-mo-icon").addClass("bz-number-icon");
        } else {
            self.numericInput = self.input = control.find("input");
            container.addClass("bz-command-edit-inline");
            self.input.removeAttr("readonly");
            self.configureHandlers();
        }
    },

    /*
    *
    */
    postRenderSingle: function () {
        var self = this;
        var properties = self.properties;

        self._super();

        //Attach event for retype double
        if (properties.retype === "double") {
            self.attachRetypeDouble();
        }
    },

    /*
    *
    */
    executeFormatCurrencyPlugin: function () {
        var self = this;
        var properties = self.properties;

        self._super();

        if (!properties.editable && properties.percentage) {
            self.numericInput.text(self.input.text() + "%");
        }
    },

    /*
    *
    */
    setDisplayValue: function (value) {
        var self = this;
        var properties = self.properties;

        self.setValue(value, false);
        
        if (!properties.editable) {
            self.input.text(value);
        } else {
            self.input.html(value);
            self.input.val(value);
        }

        self.executeFormatCurrencyPlugin();
    },

    /*
    *
    */
    configureHandlers: function () {
        var self = this;
        var input = self.input;
        var properties = self.properties;

        self.numericInput = input;
        self.attachFormatCurrency();

        // Add numeric plugin to avoid invalid keystrokes
        self.input.numeric(self.properties.decimalSymbol);

        self.input.blur(function () {
            var inputValue = self.input.val();

            if (inputValue === "" || !bizagi.util.isNumeric(inputValue) && self.properties.value === 0) {
                self.setValue("", false);

                self.input.html("");
                self.input.val("");
            }
        });
    },

    /*
    *
    */
    attachRetypeDouble: function () {
        var self = this;
        var element = self.element;

        var input = $("input", element);
        if (!input || input.length === 0) return;

        // Apply blur handler to check value
        input.blur(function () {
            var control = $(this);
            self.retypeDouble(control);
        });
    },

    /*
    *
    */
    retypeDouble: function (control) {
        var self = this;

        if ($(control).attr("type") !== "hidden" &&
                $(control).css("display") !== "none" &&
                $(control).css("visibility") !== "hidden") {

            if (!control.data("oldValue") || $(this).data("oldValue") === "") {

                // Check that there is something in the value or 
                // if a value has already been set
                if (control.val() === "" || control.val() === control.attr("newValue"))
                    return;

                // Create new tooltip
                control.data("oldValue", control.val());
                control.val("");

                try {
                    control.tooltip("destroy");
                } catch (e) { }

                // Re-type value
                control.attr("title", self.getResource("render-number-retype"));

                // Setup tooltip
                control.tooltip();
                control.tooltip("open");

                // Focus after 100ms to avoid bubbling
                setTimeout(function () {
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

                    setTimeout(function () {
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