/*
*   Name: BizAgi Tablet Render Number Extension
*   Author: Diego Parra
*   Comments:
*   -   This script will redefine the number render class to adjust to tablet devices
*/

// Extends itself
bizagi.rendering.number.extend("bizagi.rendering.number", {}, {


    /* POSTRENDER 
    =====================================================*/
    postRender: function () {
        var self = this;

        // Call base
        this._super();

        self.numericInput = $("input", self.getControl());

        if (bizagi.detectDevice() == "tablet_android") {
            var input = $("input", self.element);

            if (!input || input.length == 0) return;
        }
    },


    /* SETS THE VALUE IN THE RENDERED CONTROL
    =====================================================*/
    setDisplayValue: function (value) {
        var self = this;
        var properties = self.properties;
        self.setValue(value);
        // Call base
        this._super(value);

        // Set value in input
        if (value != null && properties.editable && self.numericInput) {
            self.numericInput.prop('value', value);

            // Formats the input
            self.executeFormatCurrencyPlugin();
        } else {
            //  $("input", self.getControl()).val(value);
        }
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
