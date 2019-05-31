/*
@title: grid validations
@authors: Alexander Mejia
@date: 09-aug-12
*/
bizagi.editor.component.editor(
    "bizagi.editor.component.editor.associationconfig", {

        init: function (canvas, model, controller) {
            var self = this;

            self._super(canvas, model, controller);
        },

        renderEditor: function (container, data) {
            var self = this,
                elEditor,
                lblRequired;

            data.ButtonName = bizagi.localization.getResource("formmodeler-component-editor-associationconfig-buttonname");

            data.caption = (bizagi.util.trim(data.caption).length > 0) ? data.caption : " ";

            elEditor = $.tmpl(self.getTemplate("frame"), data);
            elEditor.appendTo(container);

            lblRequired = $('div', elEditor);
            self.addRequired(lblRequired);

        },

        remove: function () {
            this.element.hide();
            this.element.empty();
        },

        loadTemplates: function () {
            var deferred = $.Deferred();
            $.when(
                this.loadTemplate("frame", bizagi.getTemplate("bizagi.editor.component.editor.associationconfig").concat("#associationconfig-frame"))
            ).done(function () {
                deferred.resolve();
            });
            return deferred.promise();
        },

        ".biz-action-validate click": function (el, event) {
            var self = this;            
            event.stopPropagation();
            self.controller.publish("propertyEditorChanged", {
                typeEvent: bizagi.editor.component.properties.events.PROPERTIES_SHOW_ASSOCIATION_EDITOR,
                type: this.options.name,
                id: this.element.closest(".bizagi_editor_component_properties").data("id")
            });
        }
    }
);