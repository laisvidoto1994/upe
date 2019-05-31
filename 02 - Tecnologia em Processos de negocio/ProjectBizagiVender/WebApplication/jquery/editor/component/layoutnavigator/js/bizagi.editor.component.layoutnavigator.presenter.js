/*
*   Name: Bizagi FormModeler Editor Layout Navigator Presenter
*   Author: Diego Parra
*/
bizagi.editor.observableClass.extend("bizagi.editor.component.layoutnavigator.presenter", {}, {
    /*
    *   Constructor
    */
    init: function (params) {
        var self = this;

        // call base
        self._super();

        params = params || {};

        self.canvas = params.canvas || $("<div />").addClass("bizagi_editor_layoutnavigator_container");
        self.model = params.model;
        self.layoutNavigator = new bizagi.editor.component.layoutnavigator(self.canvas, $.extend(params, { presenter: self }));
        
    },

    /*
    *   Creates the internal controller
    */
    /*
    *   Render the component
    */
    render: function (params) {
        var self = this;
        params = params || {};

        self.model = params.model || self.model;
        self.layoutNavigator.updateModel(self.model);
        return self.layoutNavigator.render(params);
    }

   
});