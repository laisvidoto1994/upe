/*
@title: Editor totalize
@authors: Diego Parra
@date: 20-02-2013
*/
bizagi.editor.component.editor(
    "bizagi.editor.component.editor.totalize", {
        init: function (canvas, model, controller) {
            this._super(canvas, model, controller);
        },
        renderEditor: function (container, data) {
            var self = this, elEditor, lblRequired;

            self.inline = true;
            
            if (data["editor-parameters"].type && data["editor-parameters"].type == "number") {
                $.extend(data, {
                    uiValues:
                                [
                                    { label: bizagi.localization.getResource("formmodeler-component-editor-totalize-option-none"), value: "" },
                                    { label: bizagi.localization.getResource("formmodeler-component-editor-totalize-option-sum"), value: "sum" },
                                    { label: bizagi.localization.getResource("formmodeler-component-editor-totalize-option-max"), value: "max" },
                                    { label: bizagi.localization.getResource("formmodeler-component-editor-totalize-option-min"), value: "min" },
                                    { label: bizagi.localization.getResource("formmodeler-component-editor-totalize-option-avg"), value: "avg" },
                                    { label: bizagi.localization.getResource("formmodeler-component-editor-totalize-option-count"), value: "count" }
                                ]
                });
            } else {
                $.extend(data, {
                    uiValues:
                                [
                                    { label: bizagi.localization.getResource("formmodeler-component-editor-totalize-option-none"), value: "" },
                                    { label: bizagi.localization.getResource("formmodeler-component-editor-totalize-option-count"), value: "count" }
                                ]
                });
            }
            

            data.value = (!data.value) ? "expression" : data.value;

            for (var i = 0; i < data.uiValues.length; i++) {
                if (data.value === data.uiValues[i].value) {
                    data.uiValues[i].selected = true;
                }
            }

            self.inputValue = data.value;

            elEditor = $.tmpl(this.getTemplate("frame"), data);
            elEditor.appendTo(container);

            lblRequired = $('label', elEditor);
            self.addRequired(lblRequired);

            /*
            uiControls.comboBox
            @params: contenedor del uiControl, { uiValues:valores del combo, uiInline: visualizacion en linea con el label, onChange: funcion que se ejecuta al cambiar el valor }
            */
            var miCombo = new self.uiControls.comboBox(
                {
                    uiWidthIcon: 32,
                    uiEditor: self,
                    uiContainer: $('.ui-control-editor', elEditor),
                    uiValues: data.uiValues,
                    uiInline: self.inline,
                    onChange: function (elValue, event) {
                        self.responseChangeCombo(elValue, event, self);
                    }
                });
        },
        remove: function () {
            this.element.hide();
            this.element.empty();
        },
        loadTemplates: function () {
            var deferred = $.Deferred();
            $.when(
                this.loadTemplate("frame", bizagi.getTemplate("bizagi.editor.component.editor.totalize").concat("#totalize-frame"))
            ).done(function () {
                deferred.resolve();
            });
            return deferred.promise();
        },
        responseChangeCombo: function (elValue, event, self) {

            var oldValueProp, newValueProp;

            oldValueProp = self.inputValue;
            newValueProp = elValue;

            self.controller.publish("propertyEditorChanged", { typeEvent: bizagi.editor.component.properties.events.PROPERTIES_CHANGE_PROPERTY, oldValue: oldValueProp, newValue: newValueProp, data: newValueProp, type: self.options.name, id: self.element.closest(".bizagi_editor_component_properties").data("id") });
            self.inputValue = newValueProp;
        }
    }
);