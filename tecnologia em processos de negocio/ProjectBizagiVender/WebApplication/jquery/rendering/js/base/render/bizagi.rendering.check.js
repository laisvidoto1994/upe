/*
*   Name: BizAgi Render Check Class
*   Author: Diego Parra
*   Comments:
*   -   This script will define basic stuff for check renders
*/

bizagi.rendering.render.extend("bizagi.rendering.check", {}, {

    /*
    *   Update or init the element data
    */
    initializeData: function (data) {
        // Call base
        this._super(data);

        // Fill default properties
        var properties = this.properties;
        properties.value = typeof (properties.value) != "undefined" ? bizagi.util.parseBoolean(properties.value) : null;
    },

    /*
    *   Template method to implement in each children to customize each control
    */
    renderControl: function () {
        var self = this;        
        var template = self.renderFactory.getTemplate("check");

        // Render template
        var randomId = bizagi.util.randomNumber(100, 10000000);
        var html = $.fasttmpl(template, {
            id: randomId  // A random id 
        });
        return html;
    },
    
    renderReadOnly: function () {
        var self = this;

        return self.renderControl();
    },

    /*
    *   Template method to implement in each device to customize each render after processed
    */
    postRender: function () {
        var self = this;
        var control = self.getControl();
        
        // Call base
        self._super();
        
        self.input = control.find("label");
    },

    /* 
    *   Gets the display value of the render
    */
    getDisplayValue: function () {
        var self = this;
        var value = self.getValue();

        if (bizagi.util.parseBoolean(value) == true) {
            return this.getResource("render-boolean-yes");

        } else if (bizagi.util.parseBoolean(value) == false) {
            return this.getResource("render-boolean-no");

        } else {
            return "";
        }
    },

    /*
    *   Check if a render has no value for required validation
    */
    hasValue: function () {
        var self = this;
        var value = self.getValue();

        if (bizagi.util.isEmpty(value)) return false;

        var booleanValue = bizagi.util.parseBoolean(value);

        if( booleanValue === false && self.properties.required) {
            return false;
        } else{
            return true;
        }
    }

});