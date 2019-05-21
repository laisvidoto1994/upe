/*
    @title: Wait Component
    @authors: Alexander Mejia
    @date: 15-jan-13
*/
bizagi.editor.component.controller("bizagi.editor.component.wait", {}, {
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
        self.renderArea = params.renderArea;

    },

    /*
    *   Loads all component templates
    */
    loadTemplates: function () {
        // Define mapping
        var templateMap = {
            "wait": (bizagi.getTemplate("bizagi.editor.component.wait") + "#wait-container")
        };

        // Fetch templates
        return this._super(templateMap);
    },

    /*
    *   Renders the component
    */
    render: function () {
        var self = this;
        var defer = new $.Deferred();

        bizagi.log("self.createOverlay();");

        // Create overlay
        self.createOverlay();

        // Clear container 
        var element = self.element;

        // Clear everything
        element.empty();

        // Load templates and then render
        $.when(self.loadTemplates())
        .done(function () {
            // Render
            var waitTemplate = self.getTemplate("wait");
            $.tmpl(waitTemplate, self.model.getModel()).appendTo(element);
            defer.resolve();
        });

        return defer.promise();
    },

    /*
    *   Creates an overlay layer
    */
    createOverlay: function () {
        var self = this;
        if (self.overlay) return self.overlay;

        // Create overlay
        var overlay = self.overlay = $("<div />");
        overlay.addClass("bz-grid-wait-container-main");
        self.renderArea.addClass("bz-edit-mode");

        overlay.appendTo(self.renderArea);

        // Add current canvas to overlay
        self.canvas.appendTo(overlay);

    },

    destroy: function () {
        var self = this;
        self.overlay.detach();
        self.renderArea.removeClass("bz-edit-mode");
    }

});