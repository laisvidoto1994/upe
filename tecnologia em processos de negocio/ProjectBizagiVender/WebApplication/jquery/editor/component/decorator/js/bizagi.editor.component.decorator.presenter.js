/*
*   Name: Bizagi FormModeler Editor Decorator Presenter
*   Author: Rhony Pedraza - Refactor Alexander Mejia
*/

bizagi.editor.observableClass.extend("bizagi.editor.component.decorator.presenter", {}, {
    /*
    *   Creates the presenter
    */
    init: function (params) {
        var self = this;

        params = params || {};
        self._super();
        self.canvas = params.canvas;
        self.model = params.model;
        self.decoratedElement = params.data.element;
        self.decorator = new bizagi.editor.component.decorator(self.canvas, $.extend(params, { presenter: self }));
    },

    /*
    *   Destroys the current component
    */
    destroy: function () {
        this.decorator.destroy();
    },
    
    /*
    *   Removes the current decorator
    */
    remove: function () {
        this.decorator.remove();
    },

    /*
    *   Returns the current decorated element
    */
    getDecoratedElement: function () {
        return this.decoratedElement;
    },

    /*
    *   Render the component
    */
    render: function (params) {
        var self = this;
        params = params || {};

        self.model = params.model || self.model;
        self.decorator.updateModel(self.model);
        return self.decorator.render(params);
    }
});