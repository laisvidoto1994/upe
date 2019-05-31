/*
* *   Name: BizAgi Desktop Render Query Case State Extension
*   Author: Iván Ricardo Taimal Narváez
*   Comments:
*   -   This script will redefine the query list render class to adjust to desktop devices
*/

// Extends itself
bizagi.rendering.radio.extend("bizagi.rendering.queryCaseState", {}, {

    /*
     *   Update or init the element data
     */
    initializeData: function (data) {
        var self = this;
        var horizontal =(typeof data.properties.horizontal !== "undefined") ? bizagi.util.parseBoolean(data.properties.horizontal) : true;
        // Call base
        this._super(data);

        // Fill default properties
        var properties = this.properties;
        properties.horizontal =horizontal;
        if(typeof properties.defaultValue == "undefined" && properties.value === null ){
            self.setValue({ id: "0" }, false);
        }
    },
    /*
     *   Returns the internal value
     */
    getValue: function () {
        if(this.value && this.value.id && !isNaN(this.value.id)){
            return {id: parseInt(this.value.id),value:this.value.value};
        }else{
            return this.value;
        }
    },
    /*
     *   Sets the value in the rendered control
     */
    setDisplayValue: function (value) {
        value.id= value.id+"";
        this._super(value);
    }
});

