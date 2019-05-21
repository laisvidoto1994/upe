/*
* @title : Base wizard class
* @author : Diego Parra
* @date   : 08/11/2012
* Comments:
*     Defines a base class for all wizards
*
*/
bizagi.editor.component.controller("bizagi.editor.wizard.base", {

    /*
    *   Constructor
    */
    init: function (canvas, params) {
        // Call base
        this._super(canvas);
        this.params = params;
    },

    /*
    *   Renders the wizard
    */
    render: function () {
        var self = this;
        var defer = new $.Deferred();

        $.when(
            self.loadTemplates()
        ).done(function () {

            // Render custom wizard
            self.renderWizard();

            // Render wizard buttons
            var buttons = self.renderButtons();
            buttons.appendTo(self.element);

            // Resolves the async call
            defer.resolve();
        });

        return defer.promise();
    },

    /*
    *   Load all needed templates
    */
    loadTemplates: function (templateMap) {
        // Define mapping
        templateMap = templateMap || {};
        var templateMap = $.extend(templateMap, {
            "wizard-buttons": (bizagi.getTemplate("bizagi.editor.wizard.base") + "#wizard-buttons")
        });

        // Fetch templates
        return this._super(templateMap);
    },

    /*
    *   Return the available buttons, can be overriden
    */
    getButtons: function () {
        return [
                    { button: "cancel", caption: bizagi.localization.getResource("bizagi-editor-wizard-buttons-cancel") },
                    { button: "finish", caption: bizagi.localization.getResource("bizagi-editor-wizard-buttons-finish") }
               ];
    },

    /*
    *   Implement on each wizard
    */
    renderWizard: function () { },

    /*
    *   Render the wizard buttons
    */
    renderButtons: function () {
        var self = this;
        var buttons = self.getButtons();

        var result = $.tmpl(self.getTemplate("wizard-buttons"), { buttons: buttons });

        // Apply button plugin
        $("button", result).button();

        // Add button handlers
        $("button", result).click(function () {
            var button = $(this).attr("data-button");
            self.processButton(button);
        });

        return result;
    },

    /*
    *   Process wizard button    
    */
    processButton: function (button) {
        var self = this;
        if (button == "cancel") {
            self.presenter.closePopup({ success: false });
        }

        if (button == "finish") {
            self.processFinishButton();
        }
    },

    /*
    *   Process finish button
    */
    processFinishButton: function () {
        var self = this;
        self.presenter.closePopup({ success: true });
    }
});

