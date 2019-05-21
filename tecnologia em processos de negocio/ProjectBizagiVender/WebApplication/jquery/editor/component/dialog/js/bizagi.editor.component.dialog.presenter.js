 /*
*   Name: Bizagi FormModeler Editor Dialog  Presenter
*   Author: Alexander Mejia
*/
bizagi.editor.observableClass.extend("bizagi.editor.component.dialog.presenter", {}, {

    /*
    *   Initializes the presenter
    */
    init: function () {
        this._super();
    },

    /*
    *   Shows the dialog editor inside a popup,
    *   also acts like an async method which resolves when the user closes this popup
    */
    show: function (params) {
        var self = this;
        var defer = new $.Deferred();
        var model = new bizagi.editor.component.dialog.model(params.data);

        // Create popup
        var popup = self.popup = bizagi.createPopup({
            name: model.getName(),
            container: "form-modeler",
            title: model.getTitle(),            
            onClose: function (fn) {
                defer.resolve(fn);
            }
        });

        // Create the editor
        self.dialog = new bizagi.editor.component.dialog(popup.content, { model: model, presenter: self });
        self.dialog.subscribe("close", function (ev, fn) { self.onClose(fn); });
        self.dialog.render();

        return defer.promise();
    },

    onClose: function (fn) {
        var self = this;
        self.popup.close(fn);
    }
});