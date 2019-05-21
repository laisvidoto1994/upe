/*
*   Name: BizAgi Form Modeler Select Form Editor Handlers
*   Author: Diego Parra
*   Comments:
*   -   This script will handler modeler view select form editor drawing and handlers
*/

bizagi.editor.modelerView.extend("bizagi.editor.modelerView", {}, {

    /*
    *   Draws the select form editor
    */
    drawSelectFormEditor: function (params) {
        var self = this;

        // Remove any select form editor created
        self.decorator.canvas.find(".bizagi_editor_component_editor_form").detach();

        // find container in decorator component for append select form editor
        var container = self.decorator.canvas.find(".editor-ui-actions-container");

        var canvas = $("<div />")
            .appendTo(container);

        var model = $.extend(self.executeCommand({ command: "getSelectFormModel", guid: params.guid, property: params.property }), { caption: params.caption });

        self.getRelatedForms( model);
        var formSelector = self.formSelector = new bizagi.editor.component.editor.form.presenter({ canvas: canvas, model: model });

        // Render the component
        formSelector.render();
    },

    /*
    *  Get the related forms
    */
    getRelatedForms: function (model) {

        // get the related forms using a C# service
        if (typeof model.xpath === "object") {

            var loadRelatedFormsProtocol = bizagi.editor.communicationprotocol.factory.createProtocol({
                    protocol : "relatedforms",
                    xpath : bizagi.editor.utilities.resolveComplexXpath(model.xpath),
                    context : model.context
                });
            
            $.when(loadRelatedFormsProtocol.processRequest())
                .done(function (values) {
                    if (values) { model.relatedForms = values; }
                });
        }
    }
})