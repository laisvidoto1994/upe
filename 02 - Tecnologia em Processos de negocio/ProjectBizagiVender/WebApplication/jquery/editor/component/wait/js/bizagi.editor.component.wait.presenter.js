 /*
*   Name: Bizagi FormModeler Editor Wait  Presenter
*   Author: Alexander Mejia
*/
bizagi.editor.observableClass.extend("bizagi.editor.component.wait.presenter", {}, {

    /*
    *   Initializes the presenter
    */
    init: function (params) {
        var self = this;

        self._super();

        //process params
        params = params || {};
        self.canvas = params.canvas || $("<div />");
        self.model = new bizagi.editor.component.wait.model(params.model);

        // Creates component
        self.waitEditor = new bizagi.editor.component.wait(self.canvas, {
            model: self.model,
            presenter: self,
            renderArea: params.renderArea
        });
    },

    /*
    *   Renders the component view
    */
    render: function (params) {
        var self = this;
        self.waitEditor.render(params);
    },

    /*
    *   Remove the component
    */
    destroy: function () {
        var self = this;

        self.waitEditor.destroy();
    }
})