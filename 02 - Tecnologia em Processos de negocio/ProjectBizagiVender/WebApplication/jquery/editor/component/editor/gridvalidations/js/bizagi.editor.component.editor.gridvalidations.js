/*
@title: grid validations
@authors: Alexander Mejia
@date: 09-aug-12
*/
bizagi.editor.component.editor(
    "bizagi.editor.component.editor.gridvalidations", {

        init: function (canvas, model, controller) {
            var self = this;

            self._super(canvas, model, controller);
        },

        renderEditor: function (container, data) {
            var self = this,
                elEditor,
                lblRequired;

            elEditor = $.tmpl(self.getTemplate("frame"), data);
            elEditor.appendTo(container);

            lblRequired = $('label',elEditor);
            self.addRequired(lblRequired);

        },

        remove: function () {
            this.element.hide();
            this.element.empty();
        },

        loadTemplates: function () {
            var deferred = $.Deferred();
            $.when(
                this.loadTemplate("frame", bizagi.getTemplate("bizagi.editor.component.editor.gridvalidations").concat("#gridvalidations-frame"))
            ).done(function () {
                deferred.resolve();
            });
            return deferred.promise();
        },

        ".biz-action-validate click": function (el, event) {
            var self = this;

            event.stopPropagation();
            self.controller.publish("propertyEditorChanged", {
                typeEvent: bizagi.editor.component.properties.events.PROPERTIES_SHOW_GRID_VALIDATIONS,
                type: this.options.name,
                id: this.element.closest(".bizagi_editor_component_properties").data("id")
            });
        }
    }
);