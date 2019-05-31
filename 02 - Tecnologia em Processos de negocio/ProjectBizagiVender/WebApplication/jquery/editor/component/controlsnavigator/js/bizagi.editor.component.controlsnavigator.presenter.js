/*
*   Name: Bizagi FormModeler Editor Controls Navigator Presenter
*   Author: Rhony Pedraza
*/

bizagi.editor.observableClass.extend("bizagi.editor.component.controlsnavigator.presenter", {}, {
    init: function (params) {
        var self = this;

        self._super();
        
        params = params || {};
        self.canvas = params.canvas;
        self.model = params.model;
        self.controlsNavigator = new bizagi.editor.component.controlsnavigator(self.canvas, $.extend(params, { presenter: self }));
    },
    
    render: function (params) {
        var self = this;
        params = params || {};

        self.model = params.model || self.model;
        self.controlsNavigator.updateModel(self.model);
        return self.controlsNavigator.render(params);

    }
});