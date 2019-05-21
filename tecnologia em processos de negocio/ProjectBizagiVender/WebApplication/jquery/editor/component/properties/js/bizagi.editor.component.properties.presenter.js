/*
*   Name: Bizagi FormModeler Editor Properties Adapter
*   Author: Rhony Pedraza, Diego Parra (refactor)
*/
bizagi.editor.observableClass.extend("bizagi.editor.component.properties.presenter", {}, {
    /*
    *   Constructor
    */
    init: function (params) {
        var self = this;

        // Call base
        self._super();

        // Create component
        params = params || {};
        self.canvas = params.canvas || $("<div />").appendTo("form-modeler");
        self.propertyBox = new bizagi.editor.component.properties(self.canvas, $.extend(params, { presenter: self }));
    },

    /*
    *   Remove the component
    */
    destroy: function () {
        var self = this;
        if (self.propertyBox) self.propertyBox.destroy();
        if (self.canvas) self.canvas.remove();
        self.propertyBox = null;
        self.canvas = null;
    },

    /*
    *   Renders the component
    */
    render: function (params) {
        var self = this;
        if (self.propertyBox) self.propertyBox.render(params);
    }
});