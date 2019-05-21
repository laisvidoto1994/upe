/*
*   Name: BizAgi smartphone Render Number Extension
*   Author: Oscar O
*   Comments:
*   -   This script will redefine the number render class to adjust to tablet devices
*/

// Extends itself
bizagi.rendering.number.extend("bizagi.rendering.number", {}, {


    renderSingle: function () {

        var self = this;
        var properties = self.properties;
        var container = self.getContainerRender();
        var control = self.getControl();

        self.numericInput = self.input = (control.find("input").length != 0) ? control.find("input") : control.append("<span class=\"bz-command-not-edit bz-rn-text\"></span>").find("span");

        if (!properties.editable) {
            container.addClass("bz-command-not-edit");
            self.input.attr('readonly', "readonly");
        } else {
            container.addClass("bz-command-edit-inline");
            self.input.removeAttr("readonly");
            self.configureHandlers();
        }

    },

    postRenderSingle: function () {
        //Attach event for retype double
        var self = this;
        var properties = self.properties;

        self._super();

        if (properties.retype == "double") {
            self.attachRetypeDouble();
        }

    },


    setDisplayValue: function (value) {
        var self = this;

        self.setValue(value, false);
        self.input.html(value);
        self.input.val(value);
        self.executeFormatCurrencyPlugin();
        //  self.numericInput = self.input;
        //   self.numericInput.numeric(self.properties.decimalSymbol);
        // Attach Format Currency Plugin to format the input
        //  self.attachFormatCurrency();

    },

    renderEdition: function () {
        var self = this;
        var textTmpl = self.renderFactory.getTemplate(self.getTemplateEditionName());
        self.inputEdition = $.tmpl(textTmpl);

    },

    setDisplayValueEdit: function (value) {
        var self = this;
        self.setValue(value, false);

        self.inputEdition.val(value);
    },

    actionSave: function () {
        var self = this;
        var value = self.inputEdition.val();
        self.setValue(value, false);
        self.input.html(value);
        self.input.val(value);
        if (self.properties.submitOnChange)
            self.submitOnChange();

    },

    configureHandlers: function () {
        var self = this;
        var input = self.input;
        self.numericInput = input;
        self.attachFormatCurrency();
        // Add numeric plugin to avoid invalid keystrokes
        self.input.numeric(self.properties.decimalSymbol);
        
        //fix bug in base 
        self.input.blur(function () {
            var inputValue = self.input.val();
            if (inputValue == "" || !bizagi.util.isNumeric(inputValue) && self.properties.value == 0) {
                self.setValue("", false);
                self.input.html("");
                self.input.val("");
            }

        });

    },


    getTemplateName: function () {
        return "text";
    },
    getTemplateEditionName: function () {
        return "edition.number";
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
                    // Create new tooltip
                    try {
                        control.tooltip("destroy");
                    } catch (e) { }
                    control.attr("title", self.getResource("render-number-retype")); //"Re-escriba el valor"
                    control.tooltip();
                    control.tooltip("open");
                    // Focus after 100ms to avoid bubbling
                    setTimeout(function () { control.focus(); }, 100);

                }

                else {
                    if (control.val() != control.data("oldValue")) {
                        self.setValue("");
                        control.val("");
                        control.data("oldValue", "");
                        control.tooltip("destroy");
                        control.attr("title", self.getResource("render-number-retype-fail"));
                        control.tooltip();
                        control.tooltip("open");
                        setTimeout(function () { control.focus(); }, 100);
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
