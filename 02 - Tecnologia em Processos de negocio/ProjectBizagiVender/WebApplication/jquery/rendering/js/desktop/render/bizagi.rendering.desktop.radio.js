/*  
*   Name: BizAgi Desktop Render list Extension
*   Author: Diego Parra
*   Comments:
*   -   This script will redefine the list render class to adjust to desktop devices
*/

// Extends from base list
bizagi.rendering.radio.extend("bizagi.rendering.radio", {}, {

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

        self.properties.unique = Math.ceil(Math.random() * 1000);


        // Apply plugin
        self.radiogroup = $(".ui-bizagi-render-radio", control);
        self.radiogroup.optiongroup({ orientation: self.properties.orientation });
        if(self.selectedValue){
            self.radiogroup.optiongroup("setValue", self.selectedValue);
        }
    },

    /*
    *   Template method to implement in each device to customize the render's behaviour to add handlers
    */
    configureHandlers: function () {
        var self = this;

        // Call base
        self._super();

        // Bind handler
        self.radiogroup.bind("optiongroupchange", function (event, ui) {
            // Updates internal value
            self.onOptionGroupChange(ui);
        });
    },

    onOptionGroupChange: function(ui) {
        var self = this;
        var newValue = { id: ui.value, value: ui.text };
        self.selectedValue = newValue.value;
        self.setValue(newValue);
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

        if (properties.editable) {
            if (value !== undefined && value.id != "") {
                self.radiogroup.optiongroup("setValue", value.id || value.value);
            }
        }
    },

    /*
     *   Sets the value in the rendered control
     */
    clearDisplayValue: function () {
        var self = this;
        var control = self.getControl();
        if (self.radiogroup) {
            if ($.data(self.radiogroup[0])['ui-optiongroup']) {
                self.radiogroup.optiongroup("setValue", 0);
            } else {
                $(control).html("<label class='readonly-control'></label>");
            }
        } else if (!self.properties.editable) {
            $(control).html("<label class='readonly-control'></label>");
        }
    },

    /*
    *   Returns the selected value in the template
    */
    getSelectedValue: function () {
        var self = this;
        return self.selectedValue;
    }

});
