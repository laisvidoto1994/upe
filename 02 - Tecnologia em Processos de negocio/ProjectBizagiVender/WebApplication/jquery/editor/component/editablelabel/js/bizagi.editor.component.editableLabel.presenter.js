
/*
*   Name: Bizagi FormModeler Editable Label Presenter
*   Author: Diego Parra
*   Date: 28/08/2012
*/
bizagi.editor.observableClass.extend("bizagi.editor.component.editableLabel.presenter", {}, {

    /*
    *   Creates the presenter
    */
    init: function (params) {
        this._super();
        params = params || {};

        this.canvas = params.canvas || $("<div />");
        this.editableLabel = new bizagi.editor.component.editableLabel(this.canvas, $.extend(params, { presenter: this }));
    },

    /*
    *   Render the component
    */
    render: function () {
        var self = this;
        return self.editableLabel.render();
    },

    /*
    *   Destroy the element
    */
    destroy: function () {
        var self = this;
        if (!self.editableLabel) return;
        self.editableLabel.destroy();
        self.editableLabel = null;
    }
});