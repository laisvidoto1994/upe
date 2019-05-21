/**
 * Grid control Column Button
 *
 * @author Edward Morales
 */
bizagi.rendering.columns.column.extend("bizagi.rendering.columns.button", {}, {
    applyOverrides: function (decorated) {
        var self = this;
        var properties = self.properties;
        var mode = self.getMode();
        this._super(decorated);

        decorated.configureHandlers = function () {
            var self = this;
            var control = decorated.getControl();
            var button = $(":button", control);

            button.bind("click", function (e) {
                decorated.processButton.apply(self);

            });
        };
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
                // Show message:  Please save record before to click the button
                control.html(bizagi.localization.getResource('render-grid-column-button-mandatory-key'));

                //Set the column with this attribute, so when the control is evaluated in isValid(), validated
                //also if it is required, and belongs from a new row
                self.isNewRow = true;
            } else {
                self.isNewRow = false;
            }
        }
    },

    /*
    *   Post process the element after it has been rendered
    */
    postRenderReadOnly: function (surrogateKey, cell) {
        var self = this;
        var properties = self.properties;

        // Call base
        this._super(surrogateKey, cell);
        
    },
    /*
    *   Returns the in-memory processed element when the element is read-only
    */
    renderReadOnly: function (surrogateKey, value) {
        var self = this;
        var cell;

        var decorated = this.getDecorated(surrogateKey);
        self.setSurrogateKey(surrogateKey);

        self.applyOverrides(decorated);
        // Set grid and id references to the control in order to render the content
        decorated.grid = this.grid;
        decorated.column = this;
        decorated.surrogateKey = surrogateKey;

        // Set ready deferred
        self.readyDeferred = new $.Deferred();

        // We need to render the inner control as read-only
        
        // Changes editable to false to render read-only
        var editable = this.properties.editable;
        decorated.properties.editable = false;
        cell = decorated.render("cell.button");
        decorated.properties.editable = editable;
        

        // Attach rendered handler
        self.bind("rendered", function () {
            self.readyDeferred.resolve();
        });

        return cell;
    }
});