/*
@title: select process
@authors: Andrés Fernando Muñoz
@date: 2014-19-08
*/
bizagi.editor.component.editor(
    "bizagi.editor.component.editor.selectprocess", {

        init: function (canvas, model, controller) {
            var self = this;

            self._super(canvas, model, controller);
        },

        /*
        * Process the editor
        */
        renderEditor: function (container, data) {
            var self = this,
                elEditor;
            

            var parameters = self.getEditorParameters(data);
            data.showLabel = parameters.showLabel == "undefined" ? true : parameters.showLabel;
            data.disabled = data.allowClick || false;

            elEditor = $.tmpl(self.getTemplate("frame"), data);
            elEditor.appendTo(container);

        },

        remove: function () {
            this.element.hide();
            this.element.empty();
        },

        /*
        * Load the templates
        */
        loadTemplates: function () {
            var deferred = $.Deferred();
            $.when(
                this.loadTemplate("frame", bizagi.getTemplate("bizagi.editor.component.editor.selectprocess").concat("#selectprocess-frame"))
            ).done(function () {
                deferred.resolve();
            });
            return deferred.promise();
        },

        /*
        * Returns the paremeters defined in the editor
        */
        getEditorParameters: function (data) {

            return data["editor-parameters"] || {};
        },

        ".biz-action-select-process click": function (el, event) {
            var self = this;
            event.stopPropagation();
            self.controller.publish("propertyEditorChanged", {
                typeEvent: bizagi.editor.component.properties.events.PROPERTIES_SELECT_PROCESS,
                type: this.options.name,
                id: this.element.closest(".bizagi_editor_component_properties").data("id")
            });
        }
    }
);