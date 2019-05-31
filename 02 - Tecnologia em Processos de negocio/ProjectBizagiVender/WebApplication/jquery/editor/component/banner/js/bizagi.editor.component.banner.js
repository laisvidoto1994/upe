/*
@title: banner Component
@authors:Ramiro Gomez
@date: 05 Oct 2012
 Comments:
 *     Define the banner component
*/

bizagi.editor.component.controller("bizagi.editor.component.banner", {

    /*
    *   Constructor
    */
    init: function (canvas, params) {
        var self = this;
        params = params || {};

        self._super(canvas);

        //set up the variables
        self.canvas = canvas;
        self.presenter = params.presenter;
        self.model = params.model;
        self.data = params.data;
        self.tmpl = {};
    },

    /*
    *   Updates the model
    */
    updateModel: function (model) {
        var self = this;

        self.model = model;
        self.update();
    },

    /*
    * Renders the banner into element 
    */
    render: function () {
        var self = this;

        $.when(self.loadTemplates()).done(function () {
            self.element.show();
            self.element.empty();
            self.renderbanner(self.element, self.model);
        });
    },

    renderbanner: function (element, model) {
       var self=this, banner;
        var caption = model.banner.displayname;
        var icon = model.banner.icon;
        var cite = model.banner.cite;

        self.bannerModel = model;

        if(model.banner.on){

            banner = $.tmpl(self.getTemplate("banner"), { caption: caption, icon:icon, cite:cite });
            element.css('position', 'relative');
            element.append(banner);

            $('.ui-tabs-panel', self.data.element).addClass('ui-wbanner-space-show');

            if(this.visibility = 'hide'){
                self.hide();
            }
        }
        
    },

    remove: function () {
        this.element.hide();
        this.element.empty();
    },

    hide:function(){
        var self = this;
        self.visibility = 'hide';
        $('.ui-tabs-panel', self.data.element).removeClass('ui-wbanner-space-show').addClass('ui-wbanner-space-hide');
        self.element.hide();
    },
    show:function(){
        var self = this;
        self.visibility = 'show';
        $('.ui-tabs-panel', self.data.element).removeClass('ui-wbanner-space-hide').addClass('ui-wbanner-space-show');
        self.element.show('slow');
        self.element.css('overflow','visible');
    },

    /*
    *   Load all needed templates
    */
    loadTemplates: function () {
        var self = this;
        var defer = new $.Deferred();

        $.when(
            self.loadTemplate("banner", bizagi.getTemplate("bizagi.editor.component.banner").concat("#banner-component"))
        ).done(function () {
            defer.resolve();
        });

        return defer.promise();
    },

    /*
    *   Destroys the current component
    */
    destroy: function () {
        this.element.detach();
    },

    /*************************************************************************************************** 
    *   EVENT HANDLERS
    *****************************************************************************************************/

    /*
    *   Manages show properties button click
    */
    ".bizagi-editor-banner-container click": function (element, event) {

        var self = this;
        event.stopPropagation();
        self.presenter.publish("onBannerClick", { model:self.bannerModel, reference:self});
    }
});