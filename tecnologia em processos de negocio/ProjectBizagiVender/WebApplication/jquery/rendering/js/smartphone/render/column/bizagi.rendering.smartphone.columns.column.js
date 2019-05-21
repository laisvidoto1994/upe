/*
*   Name: BizAgi Tablet Column Decorator Extension
*   Author: Diego Parra
*   Comments:
*   -   This script will redefine the column decorator class to adjust to tablet devices
*/

// Extends itself
bizagi.rendering.columns.column.extend("bizagi.rendering.columns.column", {}, {

    /*
    *   Apply custom overrides to each decorated instance
    */
    applyOverrides: function (decorated) {
        // Hacks the getControl method in the decorated render to add features
        if (decorated && decorated.getControl) {
            this.originalGetControl = decorated.getControl;
            decorated.getControl = this.getControl;
            decorated.properties.displayType = "normal";
        }
    },

    /*
    *   Template method to get the control element
    *   This code runs under the decorated element context
    */
    getControl: function () {
        var self = this;
        var result = this._super();

        if (!result || result.length == 0) {
            result = $(".ui-bizagi-cell-readonly", self.element || self.observableElement);
        }

        return result;
    },


    /*
    *   Apply column styles to a specified element
    */
    applyColumnStyles: function (element) {
        var self = this;
        var properties = self.properties;

        // Set cell alignment
        element.css("-webkit-box-pack", properties.align);

        // Set cell back color
        if (properties.textFormat.background) {
            element.css("background-color", properties.textFormat.background);
            element.css("background-image", "none");
        }
    },

    /*
    *   Post process the element after it has been rendered
    */
    postRenderReadOnly: function (surrogateKey, cell) {
        var self = this;
        var properties = self.properties;

        // Call base

        // var decorated = this.getDecorated(surrogateKey);
        this._super(key, cell);

        // Just draw render if the cell layout has been filled
        if (cell && cell.length > 0) {
            var cellIcon = $(".ui-bizagi-cell-icon", cell);
            if (!properties.editable) cellIcon.detach();

            // Apply styles to cell
            self.applyColumnStyles(cell);

            if (properties.align == "left") {
                cellIcon.addClass("ui-bizagi-cell-icon-right");
            }
        }
    }


});