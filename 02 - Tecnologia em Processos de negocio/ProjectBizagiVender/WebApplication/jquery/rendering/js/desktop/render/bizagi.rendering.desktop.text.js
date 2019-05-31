/*
*   Name: BizAgi Desktop Render Text Extension
*   Author: Diego Parra
*   Comments:
*   -   This script will redefine the text render class to adjust to desktop devices
*/

// Extends itself
bizagi.rendering.text.extend("bizagi.rendering.text", {}, {

    /*
    *   Template method to implement in each device to customize each render after processed
    */
    postRender: function () {
        var self = this;
        var properties = self.properties;

        // Call base 
        this._super();

        // Define max length of element
        if (properties.maxLength > 0) {
            self.input.attr("maxlength", properties.maxLength);
        }
    },


    /*
    *   Sets the value in the rendered control 
    */
    setDisplayValue: function (value) {
        var self = this,
        properties = self.properties;

        // Call base
        this._super(value);

        // Set value in input
        if (!bizagi.util.isEmpty(value) && properties.editable) {
            var valueToDisplay = value.toString().replaceAll("\\n", " ");
            valueToDisplay = valueToDisplay.replaceAll("\n", " ");
            self.input.val(valueToDisplay);
        } else {
            if (value === null && properties.editable) {
                self.input.val("");
            }
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
            self.retypeDouble(control);
        });
    },

    retypeDouble: function (control) {
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
                } catch (e) { }
                control.attr("title", self.getResource("render-text-retype")); //"Re-escriba el valor"
                
                //Set up tool tip
                control.tooltip();

                var toolTipZindex = $.getMaxZindex();
                control.tooltip().on( "tooltipopen", function( event, ui ) {
                    ui.tooltip.zIndex(toolTipZindex);
                    }
                );
                
                control.tooltip("open");
                // Focus after 100ms to avoid bubbling
                setTimeout(function () { control.focus(); }, 100);

            }

            else {

                // Check that there is something in the value
                if (control.val() == "") {
                    return;
                }

                if (control.val() != control.data("oldValue")) {
                    self.setValue("");
                    control.val("");
                    control.data("oldValue", "");
                    control.tooltip("destroy");
                    control.attr("title", self.getResource("render-text-retype-fail"));
                    
                    //Set up tool tip
                    control.tooltip();

                    var toolTipZindex = $.getMaxZindex();
                    control.tooltip().on( "tooltipopen", function( event, ui ) {
                        ui.tooltip.zIndex(toolTipZindex);
                        }
                    );

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

    },
    collectData: function (renderValues) {
        var self = this;
        var properties = self.properties;

        // Add the render value
        var xpath = properties.xpath;
        // replace strange character
        var value = self.getValue();
        if (self.getValue() != null)
            if (typeof (self.getValue()) != "undefined") {
                value = self.getValue().replaceAll(String.fromCharCode("030"), '');
                value = self.getValue().replaceAll(String.fromCharCode("018"), '');
                value = self.getValue().replaceAll(String.fromCharCode("016"), '');
            }

        if ($.controlValueIsChanged(self)) {
            // Filter by valid xpaths and valid values        
            if (!bizagi.util.isEmpty(xpath)) {
                if (!bizagi.util.isEmpty(value)) {
                    renderValues[properties.xpath] = value;
                } else if (value === "") {
                    renderValues[properties.xpath] = "";
                }
            }
        }
    }
});