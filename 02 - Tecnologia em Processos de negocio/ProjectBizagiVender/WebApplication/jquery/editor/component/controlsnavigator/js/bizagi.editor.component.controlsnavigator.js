 /*
@title: Controls Navigator Component
@authors: Rhony Pedraza
@date: 28-feb-12
*/

bizagi.editor.component.controller("bizagi.editor.component.controlsnavigator", {

    /*
    *  Constructor
    */
    init: function (canvas, params) {
        var self = this;

        // Call super
        self._super();
        params = params || {};

        // Set up the variables
        self.model = params.model;
        self.canvas = canvas;
        self.presenter = params.presenter;
        self.tmpl = {};        
    },

    /*
    *   Renders the accordion
    */
    render: function (params) {
        var self = this;
        params = params || {};
        self.isReadOnly = (params.isReadOnly != "undefined") ? bizagi.util.parseBoolean(params.isReadOnly) : false;
        
        self.element.empty();

        $.when(self.loadTemplates())
            .done(function () {

                self.renderGroups(self.element, self.model.groups);

                if (!self.isReadOnly) {
                    setTimeout(function() {
                        self.setDraggableItems();
                    }, 1000);

                }

                if (self.element.data().hasOwnProperty("ui-accordion")) {
                    self.element.accordion("destroy");
                }

                self.element.accordion({ header: "> .mtool-group > .mtool-group-header", heightStyle: "content", collapsible: true, active: false });

            });
    },

    /*
    * split  in groups
    */
    renderGroups: function (container, groups) {
        var self = this;

        $.each(groups, function (i, group) {
            var elGroup = $.tmpl(self.getTemplate("group"), group);
            self.renderItems(elGroup.find(".mtool-group-items"), group.items);
            elGroup.appendTo(container);
        });
    },

    /*
    * Render each control
    */
    renderItems: function (container, items) {
        var self = this;

        $.each(items, function (i, item) {
            item.name = item.name.replace("column", "");

            $.when(item.icon)
                .done(function (icon) {
                    item.icon = icon;
                    var elItem = $.tmpl(self.getTemplate("item"), item);
                    elItem.data("render", { name: item.id, type: item.type, icon: icon, displayName: item.name, style: item.style }); // IMPORTANT
                    elItem.appendTo(container);
                });
        });
    },


    /*
    *   Load all needed templates
    */
    loadTemplates: function () {
        var self = this;
        var defer = new $.Deferred();

        $.when(
            self.loadTemplate("group", bizagi.getTemplate("bizagi.editor.component.controlsnavigator").concat("#mtool-group")),
            self.loadTemplate("item", bizagi.getTemplate("bizagi.editor.component.controlsnavigator").concat("#mtool-item")),
            self.loadTemplate("helper", bizagi.getTemplate("bizagi.editor.component.controlsnavigator").concat("#mtool-helper"))
        ).done(function () {
            defer.resolve();
        });

        return defer.promise();
    },

    /*
    * Sets control as a draggable item
    */
    setDraggableItems: function () {
        var self = this;
        $(".mtool-item").data('self', self);
        $(".mtool-item").draggable({
            helper: self.draggableHelper,
            connectToSortable: ".ui-bizagi-container-connectedSortable.ui-bizagi-container",
            distance: 15,
            start: function (event, ui) {
                var draggableElement, wrapperMain, mainPanel, wrapperScroll, limitTop, limitBottom;

                draggableElement = $(event.currentTarget);

                $('#main-panel').addClass('bz-main-dashed-grid');
                draggableElement.addClass('ui-dragging');

                wrapperMain = $('.wrapper-main-panel');
                mainPanel = $('#main-panel', wrapperMain);
                wrapperScroll = $('.wrapper-main-scroll', wrapperMain);

                mainPanel.addClass('ui-start-drag');
                self.presenter.publish("controlRefreshCanvas", {});

                if (mainPanel.hasClass('biz-auto-height')) {

                    limitTop = wrapperMain.position().top + parseFloat(wrapperMain.css('padding-top')) + parseFloat(wrapperMain.css('margin-top')) + 50;
                    limitBottom = wrapperScroll.outerHeight();
                    /*create autoScroll*/
                    bizagi.util.autoScroll(wrapperScroll, limitTop, limitBottom, 'controlsnavigator');

                }

            },
            stop: function (event, ui) {
                var draggableElement, mainPanel, self;

                draggableElement = $(event.currentTarget);
                self = $(this).data("self");

                mainPanel = $('#main-panel');

                mainPanel.removeClass('bz-main-dashed-grid').removeClass('ui-start-drag'); ;
                draggableElement.removeClass('ui-dragging');

                bizagi.util.removeAutoScroll('autoscroll', 'controlsnavigator');
                self.presenter.publish("controlRefreshCanvas", {});

            },
            containment: "document"
        });
    },

    // Define a helper element to be used for dragging display
    draggableHelper: function (event, ui) {
        var element,
        self,
        width,
        draggableElement = $(event.currentTarget),
        display = "controls",
        caption = "Control",
        draggableHelper,
        wrapperScroll,
        wrapperMain,
        mainPanel,
        limitTop,
        limitBottom;

        draggableElement.addClass('ui-dragging');

        display = draggableElement.data("id");
        caption = draggableElement.data("caption");
        icon = draggableElement.data("render") && draggableElement.data("render").icon;
        style = draggableElement.data("render") && draggableElement.data("render").style;
        self = draggableElement.data("self");

        draggableHelper = $.tmpl(self.getTemplate("helper"), { id: display, caption: caption, icon: icon, style: style });

        draggableHelper.appendTo('form-modeler').css({ 'zIndex': 900 });

        widthLabel = parseFloat($('label', draggableHelper).width());
        widthIcon = parseFloat($('.biz-ico', draggableHelper).eq(0).width());
        widthTotal = widthLabel + widthIcon + 40 + 'px';
        draggableHelper.css('width', widthTotal);

        return draggableHelper;

    },

    /*
    * Updates the model
    */
    updateModel: function (model) {
        var self = this;

        self.model = model;
    },

    /**********************************************************************************************
    *  Event Handlers
    ***********************************************************************************************/

    /*
    * Raises a control doble click handler so the customer can react to that
    */
    ".mtool-item dblclick": function (element) {
        var self = this, wrapperMainScroll, wrapperHTMLScrollHeight;

        var render = element.data("render");
        self.presenter.publish("controlDoubleClick", { name: render.name, type: render.type, displayName: render.displayName });

        wrapperMainScroll = $('.wrapper-main-scroll');
        wrapperHTMLScrollHeight = wrapperMainScroll[0].scrollHeight;
        wrapperMainScroll.scrollTop(wrapperHTMLScrollHeight);
        elementLast = $('.ui-bizagi-container-form > div:last', wrapperMainScroll);
        bizagi.util.highLightElement(elementLast);

    }
});