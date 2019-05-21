/*
*   Name: Bizagi FormModeler Editor Overlay Grid Presenter
*   Author: Alexander Mejia, Diego Parra (refactor)
*/
bizagi.editor.observableClass.extend("bizagi.editor.component.gridcolumneditor.presenter", {}, {

    // Constructor
    init: function (params) {
        var self = this;

        // Call base
        self._super();

        // Process params
        params = params || {};
        this.canvas = params.canvas || $("<div />");

       
        this.model = new bizagi.editor.component.gridcolumneditor.model(params.gridModel);
        // Creates component
        self.gridcolumneditor = new bizagi.editor.component.gridcolumneditor(this.canvas, {
            model: this.model,
            presenter: self,
            renderArea: params.renderArea
        });
        

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
    render: function (params) {
        var self = this;
        self.gridcolumneditor.render(params);
    },

    /*
    *   Remove the component
    */
    destroy: function () {
        var self = this;

        self.gridcolumneditor.destroy();
    }
})