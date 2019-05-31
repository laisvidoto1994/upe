/*
@title: Dialog Component
@authors: Alexander Mejia
@date: 2-nov-12
*/
bizagi.editor.component.controller("bizagi.editor.component.dialog", {}, {
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
    *   Loads all component templates
    */
    loadTemplates: function () {
        var self = this;

        // Define mapping
        var templateMap = {
            "content-dialog": bizagi.getTemplate("bizagi.editor.component.dialog").concat("#dialog-container")
        };

        // Fetch templates
        return self._super(templateMap);
    },

    /*
    *   Renders the component
    */
    render: function () {
        var self = this;
        var element = self.element;

        // Clear everything
        element.empty();

        // Wait for templates
        $.when(self.loadTemplates()).done(function () {

            // Render
            var dialogTemplate = self.dialogTemplate = self.getTemplate("content-dialog");
            $.tmpl(dialogTemplate, self.model.getModel()).appendTo(element);

        });
    },

    /*
    *  Destroy component
    */
    destroy: function (fn) {
        var self = this;
        self.element.detach();
        self.publish("close", fn);
    },

    /* ***********************************************************************
    *                                    EVENTS
    **************************************************************************/

    // button handler
    ".bz-fm-dialog-button  click": function (element) {
        var self = this;

        var key = element.data("key");
        if (key) { var fn = self.model.getClickEvent(key); }
        self.destroy(fn);
    }

});