/*
*   Name: BizAgi Desktop Date Column Decorator Extension
*   Author: Diego Parra
*   Comments:
*   -   This script will redefine the date column decorator class to adjust to desktop devices
*/

// Extends itself
bizagi.rendering.columns.date.extend("bizagi.rendering.columns.date", {}, {

    /*
    *   Apply custom overrides to each decorated instance
    */
    applyOverrides: function (decorated) {
        var self = this;
        var mode = self.getMode();
            self._super(decorated);
        
        // Hacks the getControl method in the decorated render to add features
        if (decorated) {
            decorated.showTime = false;

            if (mode === "execution") {
                decorated.changeMinValue = function (value) {
                    // resolve array minvalue
                    var properties = this.properties;
                    var dateControl = this.getDateControl();
                    var calculateValue = self.resolveValue(this, value);

                    // Set value in control
                    if (value && properties.editable) {
                        properties.minValue = value;
                        dateControl.datepicker("option", "minDate", new Date(calculateValue));
                    }
                };

                decorated.changeMaxValue = function (value) {
                    // resolve array minvalue
                    var properties = this.properties;
                    var dateControl = this.getDateControl();
                    var calculateValue = self.resolveValue(this, value);

                    // Set value in control
                    if (value && properties.editable) {
                        properties.maxValue = value;
                        dateControl.datepicker("option", "maxDate", new Date(calculateValue));
                    }
                };
            }
        }
         if(mode != "design"){
          decorated.getDateControl = function (){
            var self = this;
                return self.dateControl = $(".ui-bizagi-render-date", self.getControl());
          };
         }

    },

    resolveValue: function (context, value) {
        var result = "";
        if (bizagi.util.isString(value)) {
            result = value;
        }
        if (bizagi.util.isArray(value)) {
            var indexes = context.grid.getIndexes();
            var surrogateKey = context.surrogateKey;
            var index = indexes.indexOf(surrogateKey);
            if (index !== -1) {
                result = value[index];
            }
        }
        return result;
    },

    /*
    *   Post process the element after it has been rendered
    */
    postRender: function (surrogateKey, cell) {
        // Call base
        this._super(surrogateKey, cell);

        var self = this;
        var properties = self.properties;
        var decorated = this.getDecorated(surrogateKey);
        // Call base
        decorated.properties.showTime = false;
        decorated.properties.showTime = properties.showTime;

        // Apply styles to input
        var input = $("input", cell);
        this.applyColumnStyles(input);
    },


    /*
    *   Post process the element after it has been rendered
    */
    postRenderReadOnly: function (surrogateKey, cell) {
        // Call base
        this._super(surrogateKey, cell);

        var self = this;
        var properties = self.properties;
        var decorated = this.getDecorated(surrogateKey);
        // Call base, but resuming the original show time property when rendering not editable
        decorated.properties.showTime = properties.showTime;
    }
});
