/*
 *   Name: BizAgi Render Column ReadOnlyDecorator Class
 *   Author: Diego Parra
 *   Comments:
 *   -   This script will define basic stuff for readonly-columns
 */

bizagi.rendering.columns.column.extend("bizagi.rendering.columns.readonly", {}, {

    /*
    *   Constructor
    */
    init: function (params) {
        // Call base
        this._super(params);

        // Set base column styles
        var properties = this.properties;

        // Define the column as readonly
        properties.editable = required = false;
    },

    /*
    *   Return true if the column is read-only, so we can make a quick render
    */
    isReadonly: function () {
        return true;
    },

    /*
    *   Returns the in-memory processed element 
    *   so the caller could append it to any place
    */
    render: function (surrogateKey, value) {
        if (typeof value === "string") {
            var valueToDisplay = value.replaceAll("\\n", "<br/>");
            valueToDisplay = valueToDisplay.replaceAll("\n", "<br/>");
            return valueToDisplay;
        }
        return value;
    },

    /*
    *   Post process the element after it has been rendered
    */
    postRender: function (surrogateKey, cell) {
        // DON'T DO ANYTHING
    },

    /*
    *   Returns the in-memory processed element when the element is read-only
    */
    renderReadOnly: function (surrogateKey, value) {
        return this.render(surrogateKey, value);
    },

    /*
    *   Post process the element after it has been rendered
    */
    postRenderReadOnly: function (surrogateKey, cell) {
        // DON'T DO ANYTHING
    },
    
    /*
    *   Method to check if a value is valid or not in this render
    */
    isValueValid: function () {
        // It is always valid because the column is readonly
        return true;
    }
});

