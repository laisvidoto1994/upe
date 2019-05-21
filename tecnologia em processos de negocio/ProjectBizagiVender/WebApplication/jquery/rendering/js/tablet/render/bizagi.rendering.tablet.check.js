/*
*   Name: BizAgi Tablet Render Check
*   Author: Andres Valencia
*   Comments: Check implementation for tablet
*/

// Extends itself
bizagi.rendering.check.extend('bizagi.rendering.check', {}, {
   
   /* POSTRENDER
   ======================================================*/
   postRender : function(){
        
        var self = this;
        var control = self.getControl();
        
       
        // Call base
        this._super();

        self.input = $("input",self.getControl());
        // Bind changes to set value
        self.input.change(function(){
            if (self.input.is(':checked')) {
                self.setValue(true);
            } else {
                self.setValue(false);
            }
        });        
   },
   
   /* SET DISPLAY VALUE
   ======================================================*/
   setDisplayValue : function(value){
        
        var self = this;
        var properties = self.properties;
        
        // Call base
        this._super(value);
        
        // Set value in control
        if (properties.editable) {
            var parsedValue = bizagi.util.parseBoolean(value);
            if (parsedValue == true) {
                self.input.prop('checked', true);
            }
        }
   }
   
});
