/*
*   Name: Bizagi FormModeler Button Editor Presenter
*   Author: Diego Parra
*/
bizagi.editor.observableClass.extend("bizagi.editor.component.buttoneditor.presenter", {}, {

    /*
    *   Constructor
    */
    init: function (params) {
        var self = this;

        // Call base
        self._super();

        // Process params
        params = params || {};
        this.model = new bizagi.editor.component.buttoneditor.model(params.buttonModel);

        // Creates component
        self.buttoneditor = new bizagi.editor.component.buttoneditor(params.canvas, {
            model: this.model,
            presenter: self,
            isReadOnly : params.isReadOnly
        });
    },

    /*
    *   Refreshes the component
    */
    refresh: function (params) {
        var self = this;
        self.buttoneditor.refresh(params);
    },

    /*
    *   Renders the component view
    */
    render: function (params) {
        var self = this;
        self.buttoneditor.render($.extend(params));
    }
})