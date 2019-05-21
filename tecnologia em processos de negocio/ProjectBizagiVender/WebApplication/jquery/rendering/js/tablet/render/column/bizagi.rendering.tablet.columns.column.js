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
    *   Returns the in-memory processed element 
    *   so the caller could append it to any place
    */
    render: function (surrogateKey, value, tableCell) {
        var result = this._super(surrogateKey, value, tableCell);
        var decorated = this.getDecorated(surrogateKey);
        if (decorated.element) {
            // Clean all display types
            decorated.element.removeClass("ui-bizagi-render-display-normal ui-bizagi-render-display-vertical ui-bizagi-render-display-reversed")
                          .removeClass("ui-bizagi-render-display-vertical-reversed ui-bizagi-render-display-label ui-bizagi-render-display-value");

            // Add a new common class for all cells
            decorated.element.addClass("ui-bizagi-render-display-cell");
        }

        return result;
    },

    /*
    *   Returns the cell html to be inserted in the table
    */
   /* renderReadOnly: function (surrogateKey, value, tableCell) {
        var self = this;
        var decorated = this.getDecorated(surrogateKey);
        var cell = this._super(surrogateKey, value, tableCell);

        // Just draw render if the cell layout has been filled
        if (cell && cell.length > 0) {

            // Add display value
            $(".ui-bizagi-cell-readonly", cell).html(decorated.getDisplayValue());

            // Apply styles to cell
            self.applyColumnStyles(cell);

            // Return just content
            return cell;
        }

        return "";
    },*/

    postRenderReadOnly: function (surrogateKey, cell) {

        var self = this;
        var decorated = self.getDecorated(surrogateKey);
        var editable = self.properties.editable;
        decorated.properties.editable = false;

        if (decorated.grid == undefined) {
            decorated.grid = self.grid;
        }
        if (self.properties.singleInstance) {
            decorated.element = cell;
        }
        decorated.postRenderElement(cell);
        decorated.properties.editable = editable;

        /*var self = this;
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
        }*/
    },

    /*
    *   Apply column styles to a specified element
    */
    applyColumnStyles: function (element) {
        var self = this;
        var properties = self.properties;
        element = $(element);
        // Set cell alignment
        element.css("-webkit-box-pack", properties.align);

        // Set cell back color
        if (properties.textFormat.background) {
            element.css("background-color", properties.textFormat.background);
            element.css("background-image", "none");
        }
    }
});