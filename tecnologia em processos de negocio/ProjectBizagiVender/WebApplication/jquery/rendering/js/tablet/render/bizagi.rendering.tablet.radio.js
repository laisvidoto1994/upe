/*  
 *   Name: BizAgi Tablet Render list Extension
 *   Author: Diego Parra
 *   Comments:
 *   -   This script will redefine the list render class to adjust to tablet devices
 */

// Extends from base list 
bizagi.rendering.radio.extend('bizagi.rendering.radio', {}, {

    /* POSTRENDER
    ======================================================*/
    postRender : function(){
        var self = this;

        // Call base 
        this._super();
        self.combo =  self.getControl();
        // Bind changes to set value
        self.combo.change(function(){
            var selectedRadio = self.combo.find('input:radio:checked');
            var newValue = { 
                id: selectedRadio.prop('value'), // The value is the Id LOL
                value: selectedRadio.siblings('label').text()
            };
            self.setValue(newValue);
        });
    },

    /* SETS DISPLAY VALUE
    ======================================================*/
    setDisplayValue: function (value) {
        var self = this;
        var properties = self.properties;

        if (properties.editable) {
            if (value !== undefined && value.id != null) {
                // Find the control to check where value is
                self.combo.find('input[type="radio"][value="'+ value.id +'"]').prop('checked','checked');
            }
        }
    }
});
