/*
*   Name: BizAgi FormModeler Wait Model
*   Author: Alexander Mejia
*   Comments:
*   -   This script will define basic stuff for wait component model 
*/

bizagi.editor.observableClass.extend("bizagi.editor.component.wait.model", {}, {

    /*
    *   Constructor
    */
    init: function (model) {
        var self = this;
        model = model || {};

        self.message = model.message || "";
    },

    getModel: function () {
        return { message : this.message };
    }
});
