/*
 *   Name: BizAgi Desktop Actions Column Decorator Extension
 *   Author: Cristian Olaya
 *           Iván Ricardo Taimal
 *   Comments:
 *   -   This script will redefine the text column decorator class to adjust to desktop devices
 */

// Extends from column
bizagi.rendering.columns.column.extend("bizagi.rendering.columns.exclusiveCheck", {}, {

    /*
     *   Returns the in-memory processed element
     *   so the caller could append it to any place
     */
    render: function (surrogateKey, value) {

        var self = this;
        // Set flag to check when a render has changed
        self.changed = false;
        var properties = self.properties;
        // Set grid and id references to the control in order to render the content
        var decorated = self.getDecorated(surrogateKey);
        decorated.grid = self.grid;
        decorated.column = this;
        decorated.surrogateKey = surrogateKey;

        // Set cell value

        var mode = self.getMode();

        if (self.grid.exclusiveChanges[self.properties.xpath]) {
            if (self.grid.exclusiveChanges[self.properties.xpath].key === surrogateKey) {
                self.setValue(surrogateKey, self.grid.exclusiveChanges[self.properties.xpath].value);
            }
            else {
                self.setValue(surrogateKey, false);
            }
        }
        else {
            if (self.grid.originalEnabledChecks && self.grid.originalEnabledChecks.length > 1) {
                self.setValue(surrogateKey, false);
            }
            else {
                self.setValue(surrogateKey, value);
            }
        }

        // Override render properties
        self.overrideDecoratedRenderProperties(surrogateKey);


        // If the render is not editable return the readonly version of the column
        if (!properties.editable)
            return self.renderReadOnly.apply(self, arguments);

        // Returns the decorated render inside a custom layout for columns
        self.readyDeferred = new $.Deferred();
        var cell = decorated.render("cell");

        // If the render changes set the flag on
        decorated.bind("renderchange", function () {
            self.changed = true;
            var lastKey = self.grid.exclusiveChanges[self.properties.xpath] ? self.grid.exclusiveChanges[self.properties.xpath].key : -1;
            if (lastKey !== surrogateKey) {
                self.clearOtherRows(surrogateKey, value);
            }
            var simpleXpathArray = self.properties.xpath.split(".");
            self.grid.exclusiveChanges[self.properties.xpath] = {
                xpath: self.properties.xpath,
                simpleXpath: simpleXpathArray[simpleXpathArray.length - 1],
                value: self.getValue(surrogateKey),
                key: surrogateKey
            };
        });

        self.bind("rendered", function () {
            self.readyDeferred.resolve();
        });

        return cell;
    },

    /*
     *   Post process the element after it has been rendered
     */
    postRender: function (surrogateKey, cell) {
        // Call base
        this._super(surrogateKey, cell);

        var self = this;
        var mode = self.getMode();

        this.setSurrogateKey(surrogateKey);
        if (mode == "execution") {

            var decorated = this.getDecorated(surrogateKey);
            var control = decorated.getControl();

            // Check if its new row
            if (control.parents("tr").data("new-row")) {
                // Show a disabled check box
                control.html('<input type="checkbox" name="exclusiveCheck" title="' + bizagi.localization.getResource('render-grid-column-button-mandatory-key') + '" disabled="disabled" style="width:16.5px;height:16.5px;">');

                //Set the column with this attribute, so when the control is evaluated in isValid(), validated
                //also if it is required, and belongs from a new row
                self.isNewRow = true;
            } else {
                self.isNewRow = false;
            }
        }
    },

    clearOtherRows: function (surrogateKey, value) {
        var self = this;
        for (var j = 0; j < self.grid.properties.data.rows.length; j++) {
            var rowIndex = self.grid.properties.data.rows[j][0];
            if (rowIndex !== surrogateKey) {
                var decorated = self.getDecorated(rowIndex);
                decorated.setDisplayValue(false);
                self.setValue(rowIndex, false);
            }
        }
    }
});
