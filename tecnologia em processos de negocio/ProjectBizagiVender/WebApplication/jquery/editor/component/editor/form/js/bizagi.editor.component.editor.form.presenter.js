/*
*   Name: Bizagi FormModeler Editor Form Presenter
*   Author: Alexander Mejia, Diego Parra (refactor)
*/
bizagi.editor.observableClass.extend("bizagi.editor.component.editor.form.presenter", {}, {

    // Constructor
    init: function (params) {
        var self = this;

        // Call base
        self._super();

        // Process params
        params = params || {};
        self.canvas = params.canvas || $("<div />");
        self.model = params.model || {};

        self.formEditor = new bizagi.editor.component.editor.form(self.canvas, self.model, self);
       
    },

    /*
    *   Returns the representing element guid
    */
    getGuid: function () {
        return this.model.getGuid();
    },

    /*
    *   Refreshes the component
    */
    refresh: function (params) {
        var self = this;
        self.gridcolumneditor.refresh(params);
    },

    /*
    *   Renders the component view
    */
    render: function () {
        var self = this;
        self.formEditor.render();
    },

    /*
    *   Remove the component
    */
    destroy: function () {
        self.gridcolumneditor.destroy();
    }
})