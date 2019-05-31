/*
@title: Layout Component
@authors: Rhony Pedraza, Diego Parra (refactor)
@date: 1-mar-12
*/

bizagi.editor.component.controller("bizagi.editor.component.layout", {

    /*
    *   Constructor
    */
    init: function (canvas, params) {
        params = params || {};

        // Call super
        this._super(canvas);

        // Set up the variables
        this.model = params.model;
        this.canvas = canvas;
        this.presenter = params.presenter;
        this.context = params.context;
        this.isActivityForm = params.isActivityForm;
    },

    /*
    *   Load all needed templates
    */
    loadTemplates: function () {
        // Define mapping
        var templateMap = {
            "frames": bizagi.getTemplate("bizagi.editor.component.layout").concat("#layout-frames"),
            "tabs": bizagi.getTemplate("bizagi.editor.component.layout").concat("#layout-left-tabs")
        };

        // Fetch templates
        return this._super(templateMap);
    },

    /*
    *   Refresh the view
    */
    refresh: function () {
        this.render();
    },

    /*
    *   Renders the view
    */
    render: function () {
        var self = this;

        // Load templates and then render
        return $.when(self.loadTemplates())
                .done(function () {
                    // Render main frames
                    self.renderFrames(self.element);
                    self.leftPanel = self.element.find("#left-panel");
                    self.applyThemeToLayout();

                    window.myResize = self.applyThemeToLayout;
                    $(window).bind("resize.windowPanel", window.myResize);

                    // Render left tabs panel
                    self.renderTabs(self.leftPanel);
                });
    },
    /*
    *   Style the layout
    */
    applyThemeToLayout: function () {
        var self = this, marginLP, realLPCHeight, leftPanelContainer, realHeightToWraper, leftPanel;
        // Adjust elements
        leftPanel = $("#left-panel");
        leftPanelContainer = $('.wrapper-left-panel');

        realHeightToWraper = $('form-modeler').height() - (parseFloat(leftPanelContainer.css('margin-top')) - leftPanelContainer.position().top);
        leftPanelContainer.css('height', realHeightToWraper);

        // Adjust tabs panel
        marginLP = parseFloat(leftPanel.css('margin-top')) + parseFloat(leftPanel.css('margin-bottom'));
        realLPCHeight = (leftPanelContainer.height() - marginLP) - (parseFloat(leftPanelContainer.css('padding-top')) + parseFloat(leftPanelContainer.css('padding-bottom')));

        $('.ui-tabs-panel',leftPanel).addClass('ui-resized');
    },

    /*
    *   Render frames
    */
    renderFrames: function (container) {
        var self = this;
        var elFrames = $.tmpl(self.getTemplate("frames"), { context: self.context, isActivityForm: self.isActivityForm });
        elFrames.appendTo(container);
    },

    /*
    *   Render tabs
    */
    renderTabs: function (container) {
        var elTabs = $.tmpl(this.getTemplate("tabs"));
        elTabs.appendTo(container);
    }
});