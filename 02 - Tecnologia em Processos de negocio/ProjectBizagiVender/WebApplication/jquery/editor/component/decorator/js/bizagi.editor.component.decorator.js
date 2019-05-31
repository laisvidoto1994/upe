/*
@title: Decorator Component
@authors: Rhony Pedraza - Alexander Mejia(Refactor)
@date: 7-mar-12
 Comments:
 *     Define the decorator component
*/

bizagi.editor.component.controller("bizagi.editor.component.decorator", {

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
    * Renders the decorator into element 
    */
    render: function () {
        var self = this;
        $('.ui-decorator-tooltip').remove();
        if (self.targetElement != undefined) {
            self.targetElement.removeClass("container-decorator");
        }

        if (self.data.element !== undefined) {
            self.targetElement = self.data.element;
            self.targetElement.addClass("container-decorator");
        }


        $.when(self.loadTemplates()).done(function () {
            self.element.appendTo(self.targetElement);
            self.element.addClass('ui-control-decorator');

            self.element.show();
            self.element.empty();
            self.renderDecorator(self.element);
        });
    },

    renderDecorator: function (container) {
        var self = this,
            decorator = $.tmpl(this.getTemplate("decoratorFrame"), self.model),
            specificOptions = $(".biz-decorator-specific-options", decorator).clone().addClass("ui-clone"),
            specificOptionsParent = container.parent().outerHeight(true);

        if ( specificOptionsParent > 470 ) {
            specificOptions.appendTo(container);
        }

        decorator.appendTo(container);

        self.setDecoratorPosition(decorator, container);

        $('.biz-ico.decorator-image', self.element).tooltip({ tooltipClass: 'ui-widget-content ui-decorator-tooltip',
            position: {
                my: "left top",
                at: "left bottom",
                offset: "0 10"
            }
        });

    },

    setDecoratorPosition: function (decorator, container) {
        var self = this;

        var containerDecorator = container.parent().closest('.ui-col');
        var decoratorOptions = $('.biz-decorator-standard-options', decorator);
        if (containerDecorator.length > 0) {
            if (containerDecorator[0].scrollWidth > containerDecorator.outerWidth()) {
                decorator.addClass('ui-decorator-left');
            }
            if (containerDecorator.outerWidth() < decoratorOptions.outerWidth()) {
                decorator.addClass('ui-decorator-vertical');
            };
        }
    },

    remove: function () {
        if (this.targetElement !== undefined) {
            this.targetElement.removeClass("container-decorator");
        }

        $('.ui-decorator-tooltip').remove();

        this.element.hide();
        this.element.empty();
    },

    /*
    *   Load all needed templates
    */
    loadTemplates: function () {
        var self = this;
        var defer = new $.Deferred();

        $.when(
            self.loadTemplate("decoratorFrame", bizagi.getTemplate("bizagi.editor.component.decorator").concat("#decorator-frame"))
        ).done(function () {
            defer.resolve();
        });

        return defer.promise();
    },

    /*
    *   Destroys the current component
    */
    destroy: function () {
        $('.ui-decorator-tooltip').remove();
        this.element.detach();
    },

    /*************************************************************************************************** 
    *   EVENT HANDLERS
    *****************************************************************************************************/

    /*
    *   Manages show properties button click
    */
    ".decorator-gear click": function (element, event) {

        var self = this;
        event.stopPropagation();
        self.presenter.publish("showProperties", self.data);
    },

    /*
    *   Manages show xpath button click
    */
    ".decorator-bind click": function (element, event) {
        var self = this;
        event.stopPropagation();
        self.presenter.publish("showXpathNavigator", self.data);
    },

    /*
    *   Manages delete element button click
    */
    ".decorator-delete click": function (element, event) {
        var self = this;
        event.stopPropagation();
        self.presenter.publish("deleteElement", self.data.guid);

    },

    /*
    *   Manages edit button click
    */
    ".decorator-edit click": function (element, event) {
        var self = this;
        event.stopPropagation();
        self.presenter.publish("openNestedForm", self.data.guid);
    },

    ".editor-ui-button-actions click": function (element, event) {
        var self = this;

        event.stopPropagation();
        var id = element.data("id");
        self.presenter.publish("buttonClicked", { button: id, guid: self.data.guid });

    }
});