/*
*   Name: BizAgi Desktop Render Yes-No Extension
*   Author: Diego Parra
*   Comments:
*   -   This script will redefine the Yes-No render class to adjust to desktop devices
*/

// Extends itself
bizagi.rendering.check.extend("bizagi.rendering.check", {}, {

    /*
    *   Template method to implement in each device to customize each render after processed
    */
    postRender: function () {
        var self = this;
        var control = self.getControl();

        // Call base 
        this._super();

        // Set control container to behave as a block
        control.addClass("ui-bizagi-render-display-block");
        control.addClass("ui-bizagi-render-boolean-yesno");

        if (self.properties.required) {
            $(".ui-bizagi-render-control-required", control).css({ "height": "22px" });
        }
        
        // Apply plugins
        if (!bizagi.util.isIE()) {
            
            // JUST FOR NON IE- BROWSERS
            self.input.check();
        } else {
            control.find("label").addClass("checkbox-ie");
        }
    },

    postRenderReadOnly: function () {
        var self = this;
        var control = self.getControl();

        self.postRender();

        // Set as disabled
        var check = $("input", control);
        check.attr("readonly", "readonly");
        check.attr("disabled", "disabled");
    },

    /*
    *   Template method to implement in each device to customize the render's behaviour to add handlers
    */
    configureHandlers: function () {
        var self = this;

        // Call base
        self._super();

        // Bind change event
        if (!bizagi.util.isIE()) {
            // PLUGIN IMPLEMENTATION
            self.input.bind("checkchange", function (evt, ui) {
                self.setValue(ui.value);
            });
        } else {
            // NON PLUGIN IMPLEMENTATION
            self.input.bind("change", function (evt, ui) {
                var value = $("input", self.input).is(":checked");
                self.setValue(value);
            });
        }
    },

    /*
    *   Template method to implement in each device to customize the render's behaviour when rendering in design mode
    */
    configureDesignView: function () {
        var self = this;
        var control = self.getControl();

        // Unbind plugin handlers
        control.find("input").unbind("click");
    },

    /*
    *   Sets the value in the rendered control
    */
    setDisplayValue: function (value) {
        var self = this;
        var properties = self.properties;

        value = bizagi.util.parseBoolean(value);

        // Call base
        this._super(value);

        // Set value in control
        //if (properties.editable) {
            var parsedValue = bizagi.util.parseBoolean(value);
            if (!bizagi.util.isIE()) {
                // PLUGIN IMPLEMENTATION
                if (parsedValue == true) {
                    self.input.check("checkItem");
                } else {
                    self.input.check("uncheckItem");
                }
            }
            else {
                // NON PLUGIN IMPLEMENTATION
                if (parsedValue == true) {
                    $("input", self.input).attr("checked", "checked");
                } else {
                    $("input", self.input).removeAttr("checked");
                }
            }

        //}
    },

    /*
     * Cleans current value
     */
    cleanData: function () {
        var self = this;
        self.setDisplayValue(false);
        self.setValue(false, false);
    }
});
