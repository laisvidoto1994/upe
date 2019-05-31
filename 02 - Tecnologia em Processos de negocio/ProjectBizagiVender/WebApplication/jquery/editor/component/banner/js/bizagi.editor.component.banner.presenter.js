/*
*   Name: Bizagi FormModeler Editor banner Presenter
*   Author: Ramiro Gomez 
*/

bizagi.editor.observableClass.extend("bizagi.editor.component.banner.presenter", {}, {
    /*
    *   Creates the presenter
    */
    init: function (params) {
        var self = this;

        params = params || {};
        self._super();
        self.canvas = params.canvas;
        self.model = params.model;
        self.bannerElement = params.data.element;
        self.banner = new bizagi.editor.component.banner(self.canvas, $.extend(params, { presenter: self }));
    },

    /*
    *   Destroys the current component
    */
    destroy: function () {
        this.banner.destroy();
    },
    
    /*
    *   Removes the current banner
    */
    remove: function () {
        this.banner.remove();
    },

    /*
    *   Returns the current decorated element
    */
    getBannerElement: function () {
        return this.bannerElement;
    },

    /*
    *   Render the component
    */
    render: function (params) {
        var self = this;
        params = params || {};

        self.model = params.model || self.setModel();
        self.banner.updateModel(self.model);
        return self.banner.render(params);
    },
    hide:function(){
        var self = this;
        self.banner.hide();
    },
    show:function(){
        var self = this;
        self.banner.show();
    },
    /*
    *   Set the model for banner
    */
    setModel: function(){
        var self = this;
        
        var instModel = new bizagi.editor.component.banner.model();
        var model = instModel.getBannerModel();
        self.banner.updateModel(model);

        return model;
    }

});