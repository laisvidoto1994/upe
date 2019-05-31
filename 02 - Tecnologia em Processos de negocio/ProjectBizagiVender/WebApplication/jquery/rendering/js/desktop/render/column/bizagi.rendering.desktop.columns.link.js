/*
*   Name: BizAgi Desktop Link Column Decorator Extension
*   Author: Diego Parra
*   Comments:
*   -   This script will redefine the link column decorator class to adjust to desktop devices
*/

// Extends from column
bizagi.rendering.columns.column.extend("bizagi.rendering.columns.link", {}, {

    /*
    *   Apply custom overrides to each decorated instance
    */
    applyOverrides: function (decorated) {
        this._super(decorated);
        decorated.getControl = this.getControl;
        // Hacks the getControl method in the decorated render to add features
        if (decorated.properties.type == "columnFormLink") {
            decorated.getFormLinkXpath = this.getFormLinkXpath;
        }
        // Hack renderControl and post render to avoid processing when using inline add
        var originalRenderControl = decorated.renderControl;
        originalInternalPostRender = decorated.internalPostRender;
        decorated.internalPostRender = function () {
            var control = decorated.getControl();
            // Check if its new row
            if (control.parents("tr").data("new-row")) {
                // Show message:  Please save record before to upload a file
                control.html('<label style="font-weight: normal;">'+bizagi.localization.getResource('render-grid-column-button-mandatory-key')+'</label>');
                //Set the column with this attribute, so when the control is evaluated in isValid(), validated
                //also if it is required, and belongs from a new row
                self.isNewRow = true;
            } else {
                self.isNewRow = false;
                $.when(originalRenderControl.apply(decorated, arguments)).done(function (html) {
                    if (control.hasClass("ui-bizagi-render-control") ||
                        control.hasClass("ui-bizagi-cell-readonly")) {
                        originalInternalPostRender.apply(decorated, arguments);
                    }
                });
            }
        }
    },

    /*
    *   Template method to get the control element
    *   This will execute under the decorated element context
    */
    getControl: function () {
        var self = this;
        var properties = self.properties;

        if (properties.editable) {
            return $(".ui-bizagi-render-control", self.element);
        } else {
            if($(".ui-bizagi-cell-readonly", self.element).length > 0){
                return $(".ui-bizagi-cell-readonly", self.element);
            }
            else{
                return $(".ui-bizagi-render-control", self.element);
            }
        }
    },

    /*
    *   Returns the in-memory processed element
    *   so the caller could append it to any place
    */
    render: function (surrogateKey, value, tableCell, caller) {
        var self = this;
        var decorated = self.getDecorated(surrogateKey);

        // Change the xpath context
        decorated.properties.xpathContext = self.grid.properties.xpath + "[id=" + surrogateKey + "]";

        if (self.grid.properties.xpathContext && decorated.properties.xpathContext.indexOf(self.grid.properties.xpathContext) == -1)
            decorated.properties.xpathContext = self.grid.properties.xpathContext + "." + decorated.properties.xpathContext;

        // Render the control
        var result = this._super(surrogateKey, value, tableCell, caller);

        return result;
    },
    /*
    *   Returns the cell html to be inserted in the table
    */
    renderReadOnly: function (surrogateKey, value, tableCell) {
        var self = this;

        // Render the control editable
        if (typeof (self.properties.canBeSaved) == "undefined") self.properties.canBeSaved = (self.properties.editable == true);
        var result = this.render(surrogateKey, value, tableCell, "CALLER_RENDER_READ_ONLY_COLUMNSLINK");

        return result;
    },

    /*
    *   Post process the element after it has been rendered
    */
    postRenderReadOnly: function (surrogateKey, cell, tableCell) {
        var self = this;

        // Render the control editable
        this.postRender(surrogateKey, cell, tableCell);
    },

    /*
    *   Get Form Link xpath to use
    */
    getFormLinkXpath: function () {
        // Calculate layout properties to maximized property
        this.properties.maximized = bizagi.util.parseBoolean(this.properties.maximized) != null ? bizagi.util.parseBoolean(this.properties.maximized) : false;
        this.calculateInitialLayoutProperties();

        if (!this.properties.xpath){
            return;
        }
        return this.properties.xpath;
    }


});
