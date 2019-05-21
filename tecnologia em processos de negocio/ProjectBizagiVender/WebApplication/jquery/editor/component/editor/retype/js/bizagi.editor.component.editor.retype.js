/*
@title: Editor retype
@authors: Rhony Pedraza
@date: 26-jun-12
*/
bizagi.editor.component.editor(
    "bizagi.editor.component.editor.retype", {
        init: function (canvas, model, controller) {
            this._super(canvas, model, controller);
        },
        renderEditor: function (container, data) {
            var elEditor, valDuplicate = "", valDouble = "", valNone = "", self = this;
            self.paramsRetype = data["editor-parameters"];
            self.paramsHide = self.paramsRetype && data["editor-parameters"].hide ? data["editor-parameters"].hide : undefined;

            self.inline = false;
            if (self.inline) {
                self.element.addClass('retype-inline');
            }


            $.extend(data, {
                uiValues:
                                [
                                    {
                                        value: 'duplicate',
                                        style: 'bz-studio bz-duplicate-retype_16x16_standard',
                                        label: bizagi.localization.getResource("formmodeler-component-editor-retype-duplicate")
                                    },
                                    {
                                        value: 'double',
                                        style: 'bz-studio bz-double-retype_16x16_standard',
                                        label: bizagi.localization.getResource("formmodeler-component-editor-retype-double")
                                    },
                                    {
                                        value: 'none',
                                        style: 'bz-studio bz-none-retype_16x16_standard',
                                        label: bizagi.localization.getResource("formmodeler-component-editor-retype-none")
                                    }
                                ]
            });

            if (data.value != "duplicate" &&
                 data.value != "double" &&
                 data.value != "none") {
                data.value = "none";
            }

            if (self.paramsHide != undefined) {
                for (var i = 0; i < self.paramsHide.length; i++) {
                    if (self.paramsHide[i] === "duplicate") {
                        data.uiValues = data.uiValues.slice(1, 3);
                    }
                }
            }

            for (var i = 0; i < data.uiValues.length; i++) {
                if (data.value === data.uiValues[i].value) {
                    data.uiValues[i].selected = true;
                }
            }

            elEditor = $.tmpl(this.getTemplate("frame"), data);
            elEditor.appendTo(container);

            this.inputValue = data.value;



            /*
            uiControls.comboBox
            @params: contenedor del uiControl, { uiValues:valores del combo, uiInline: visualizacion en linea con el label, onChange: funcion que se ejecuta al cambiar el valor }
            */
            var miCombo = new self.uiControls.comboBox(
            {
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
            var self = this, deferred = $.Deferred();

            $.when(
                self.loadTemplate("frame", bizagi.getTemplate("bizagi.editor.component.editor.retype").concat("#retype-frame"))
            ).done(function () {
                deferred.resolve();
            });
            return deferred.promise();
        }
        ,
        responseChangeCombo: function (elValue, event, self) {

            var oldValueProp, newValueProp;

            oldValueProp = self.inputValue;
            newValueProp = elValue;

            self.controller.publish("propertyEditorChanged", { typeEvent: bizagi.editor.component.properties.events.PROPERTIES_CHANGE_PROPERTY, oldValue: oldValueProp, newValue: newValueProp, data: newValueProp, type: self.options.name, id: self.element.closest(".bizagi_editor_component_properties").data("id") });
            self.inputValue = newValueProp;
        }
    }
);