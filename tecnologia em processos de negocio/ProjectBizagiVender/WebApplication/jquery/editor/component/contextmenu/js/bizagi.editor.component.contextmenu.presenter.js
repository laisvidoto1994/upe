/*
*   Name: Bizagi FormModeler Editor contextmenu Presenter
*   Author: Rhony Pedraza
*/
bizagi.editor.observableClass.extend("bizagi.editor.component.contextmenu.presenter", {}, {
    /*
    *   Creates the presenter
    */
    init: function (params) {
        
        this._super();
        params = params || {};

        // Create component instance
        this.guid = params.guid;
        this.canvas = params.canvas || $("<div />").appendTo("form-modeler");
        this.contextmenu = new bizagi.editor.component.contextmenu(this.canvas, $.extend(params, { presenter: this }));
    },
    
    /*
    *   Returns the context menu supplied guid
    */
    getGuid: function () {
        return this.guid;
    },

    /*
    *   Destroys the component
    */
    destroy: function () {
        this.contextmenu.destroy();
    },

    /*
    *   Renders the context menu
    */
    render: function (params) {
        var self = this;
        params = params || {};

        return self.contextmenu.render(params);
    }
});