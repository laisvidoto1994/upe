/*
*   Name: Bizagi FormModeler Editor Ribbon Presenter
*   Author: Rhony Pedraza - Alexander Mejia Refactor
*/

bizagi.editor.observableClass.extend("bizagi.editor.component.ribbon.presenter", {}, {

    /*
    *   Constructor
    */
    init: function (params) {
        var self = this;

        self._super();
        params = params || {};
        self.canvas = params.canvas;
        self.model = params.model;
        self.ribbon = new bizagi.editor.component.ribbon(self.canvas, $.extend(params, { presenter: self }));
    },

    /*
    *   Returns the representing element guid
    */
    getGuid: function () {
        return this.guid;
    },

    /*
    *   Render the component
    */
    render: function (params) {
        var self = this;
        params = params || { };

        // Save guid for reference
        self.guid = params.guid || null;
        return self.ribbon.render(params);
    }

});
