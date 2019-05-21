/*
*   Name: BizAgi Desktop Render Number Extension
*   Author: Diego Parra
*   Comments:
*   -   This script will redefine the number render class to adjust to desktop devices
*/

// Extends itself
bizagi.rendering.number.extend("bizagi.rendering.number", {}, {
    /*
    *   Sets the value in the rendered control
    */
    setDisplayValue: function(value) {
        var self = this;
        var properties = self.properties;

        // Call base
        this._super(value);

        // Set value in input
        if (value != null && properties.editable) {
            self.numericInput.val(value);

            self.value = self.properties.value = value;

            // Formats the input
            self.executeFormatCurrencyPlugin();
        }

    },

    attachRetypeDouble: function() {
        var self = this;
        var element = self.element;

        var input = $("input", element);
        if (!input || input.length == 0) return;

        // Apply blur handler to check value
        input.blur(function() {
            var control = $(this);
            var previousValue = self.previousValue;
            var value = self.value;
            var typeControl = self.parent.properties.type;

            if (typeControl == "grid") {
                if (previousValue != null && value != previousValue) {
                    if ($(this).data("newValue") != undefined && control.val() != $(this).data("newValue")) {
                        $(this).data().newValue = undefined;
                    }
                }
                self.retypeDouble(control);
            } else {
                self.retypeDouble(control);
            }

        });
    },

    retypeDouble: function(control) {
        var self = this;
        var element = self.element;

        if ($(control).attr("type") != "hidden" &&
            $(control).css("display") != "none" &&
            $(control).css("visibility") != "hidden" &&
            $(this).data("newValue") == undefined) {

            if (!control.data("oldValue") || $(this).data("oldValue") == "") {

                // Check that there is something in the value
                if (control.val() == "")
                    return;

                // Check if a value has already been set
                if (control.val() == control.data("newValue"))
                    return;

                control.data("oldValue", control.val());
                control.val("");
                // Create new tooltip
                try {
                    control.tooltip("destroy");
                } catch(e) {
                    console.log('Error: ' + e);
                }
                control.attr("title", self.getResource("render-number-retype")); //"Re-escriba el valor"
                
                //Set up tool tip
                control.tooltip();

                var toolTipZindex = $.getMaxZindex();
                control.tooltip().on( "tooltipopen", function( event, ui ) {
                    ui.tooltip.zIndex(toolTipZindex);
                    }
                );

                control.tooltip("open");
                // Focus after 100ms to avoid bubbling
                setTimeout(function() { control.focus(); }, 100);

            } else {

                // Check that there is something in the value
                if (control.val() == "") {
                    return;
                }

                if (control.val() != control.data("oldValue")) {
                    self.setValue("");
                    control.val("");
                    control.data("oldValue", "");
                    // Create new tooltip
                    try {
                        control.tooltip("destroy");
                    } catch(e) {
                        console.log('Error: ' + e);
                    }

                    control.attr("title", self.getResource("render-number-retype-fail"));
                    
                    //Set up tool tip
                    control.tooltip();

                    var toolTipZindex = $.getMaxZindex();
                    control.tooltip().on( "tooltipopen", function( event, ui ) {
                        ui.tooltip.zIndex(toolTipZindex);
                        }
                    );
                    
                    control.tooltip("open");
                    setTimeout(function() { control.focus(); }, 100);
                } else {
                    control.data("newValue", control.val());
                    control.data("oldValue", "");
                    // Destroy tooltips
                    try {
                        control.tooltip("destroy");
                    } catch(e) {
                        console.log('Error: ' + e);
                    }
                }
            }
        }
    }
});