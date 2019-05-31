/*
@title: Layout Navigator Component
@authors: Diego Parra
@date: 14-jun-12
*/
bizagi.editor.component.controller("bizagi.editor.component.layoutnavigator", {

    /*
    *  Constructor
    */
    init: function (canvas, params) {
        var self = this;

        // Call base
        self._super();
        params = params || {};
        self.canvas = canvas;
        self.model = params.model;
        self.presenter = params.presenter;        
    },

    /*
    *   Renders the layout
    */
    render: function (params) {
        var self = this, data, layoutContainer, layoutItem, optionsLayout;

        params = params || {};
        self.isReadOnly = (params.isReadOnly != "undefined") ? bizagi.util.parseBoolean(params.isReadOnly) : false;
        
        // Clear element
        self.element.empty();
        self.showPercent = true;

        $.when(
            self.loadTemplates()
        ).done(function () {

            data = self.model;
            layoutContainer = $.tmpl(self.getTemplate("layoutContainer"), {});

            for (var i = 0; i < data.layouts.length; i++) {

                layoutItem = $.tmpl(self.getTemplate("layoutItem"), data.layouts[i]);
                optionsLayout = $('.bz-fm-layout-width', layoutItem);

                if (self.showPercent) {

                    var valuesCol = data.layouts[i].childrens;
                    for (var k = 0; k < valuesCol.length; k++) {
                        layoutWidth = $.tmpl(self.getTemplate("layoutWidth"), { value: valuesCol[k].properties.width });
                        optionsLayout.append(layoutWidth);
                    };

                } else {
                    optionsLayout.remove();
                }

                layoutContainer.append(layoutItem);
            };

            self.element.append(layoutContainer);

            if (!self.isReadOnly) {
                self.setDraggableItems();
            }
        });
    },

    /*
    *   Updates the model
    */
    updateModel: function (model) {
        var self = this;
        self.model = model;
    },

    /*
    *   Loads all component templates
    */
    loadTemplates: function () {
        // Define mapping
        var templateMap = {
            "layoutContainer": (bizagi.getTemplate("bizagi.editor.component.layoutnavigator") + "#layout-container"),
            "layoutItem": (bizagi.getTemplate("bizagi.editor.component.layoutnavigator") + "#layout-item"),
            "layoutWidth": (bizagi.getTemplate("bizagi.editor.component.layoutnavigator") + "#layout-width"),
            "layoutHelper": (bizagi.getTemplate("bizagi.editor.component.layoutnavigator") + "#layout-helper")
        };

        // Fetch templates
        return this._super(templateMap);
    },

    /*
    *   Sets the layout as a draggable element
    */
    setDraggableItems: function () {
        var self = this;
        $(".bz-fm-layout-navigator-item").data('self', self);
        $(".bz-fm-layout-navigator-item").draggable({
            helper: self.draggableHelper,
            connectToSortable: ".ui-bizagi-container-connectedSortable",
            distance: 15,
            start: function () {
                $('#main-panel').addClass('bz-main-dashed-grid').addClass('ui-start-drag');
                self.presenter.publish("controlRefreshCanvas", {});
            },
            stop: function () {
                $('#main-panel').removeClass('bz-main-dashed-grid').removeClass('ui-start-drag');
                bizagi.util.removeAutoScroll('autoscroll', 'layoutnavigator');
                self.presenter.publish("controlRefreshCanvas", {});
            }
        });
    },

    /*
    *   Define a helper element to be used for dragging display
    */
    draggableHelper: function (event) {
        var element,
        self,
        draggableElement = $(event.currentTarget),
        display,
        caption,
        draggableHelper,
        style;

        draggableElement.addClass('ui-dragging');

        display = draggableElement.data("id");
        caption = draggableElement.data("caption");
        self = draggableElement.data("self");
        style = draggableElement.data("style");

        draggableElement.data('type', display);
        draggableElement.data('display', caption);


        element = $.tmpl(self.getTemplate("layoutHelper"), { id: display, caption: caption, style: style });

        draggableHelper = element.appendTo('form-modeler').css({ 'zIndex': 900 });

        var widthLabel = parseFloat($('label', draggableHelper).width());
        var widthIcon = parseFloat($('.bz-fm-layout-image', draggableHelper).eq(0).width());
        var widthTotal = widthLabel + widthIcon + 40 + 'px';

        draggableHelper.css('width', widthTotal);

        //TODO: EVALUAR SI PASAR LA GENERACION DE AUTO SCROLL A UN UTIL
        var wrapperMain = $('.wrapper-main-panel');
        var mainPanel = $('#main-panel', wrapperMain);
        var wrapperScroll = $('.wrapper-main-scroll', wrapperMain);
        if (mainPanel.hasClass('biz-auto-height')) {

            var limitTop = wrapperMain.position().top + parseFloat(wrapperMain.css('padding-top')) + parseFloat(wrapperMain.css('margin-top')) + 50;
            var limitBottom = wrapperScroll.outerHeight();
            /*create autoScroll*/
            bizagi.util.autoScroll(wrapperScroll, limitTop, limitBottom, 'layoutnavigator');

        }

        return draggableHelper;
    },


    /*************************************************************************************************** 
    *   EVENT HANDLERS
    *****************************************************************************************************/

    /*
    *   Raises a layout doble click handler so the consumer can react to that
    */
    ".bz-fm-layout-navigator-item dblclick": function (el) {
        var self = this, wrapperMainScroll, wrapperHTMLScrollHeight, elementLast;

        self.presenter.publish("layoutDoubleClick", { id: el.data("id") });

        wrapperMainScroll = $('.wrapper-main-scroll');
        wrapperHTMLScrollHeight = wrapperMainScroll[0].scrollHeight;
        wrapperMainScroll.scrollTop(wrapperHTMLScrollHeight);


        elementLast = $('.ui-bizagi-container-form > div:last', wrapperMainScroll);
        bizagi.util.highLightElement(elementLast);
    }
});