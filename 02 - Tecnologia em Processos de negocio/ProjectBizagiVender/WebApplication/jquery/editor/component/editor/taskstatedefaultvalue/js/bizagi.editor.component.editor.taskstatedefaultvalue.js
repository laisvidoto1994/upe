/*
@title: Editor taskstatedefaultvalue
@authors: Cristian Olaya
@date: 28-aug-2012
*/
bizagi.editor.component.editor(
    "bizagi.editor.component.editor.taskstatedefaultvalue", {
        map: {
            0: "taskstate-all",
            1: "taskstate-expired",
            2: "taskstate-expires-today",
            7: "taskstate-expires-future"
        }
    }, {
        init: function (canvas, model, controller) {
            var self = this;
            self._super(canvas, model, controller);
        },
        /*
        *
        */
        renderEditor: function (container, data) {
            var self = this, elEditor;

            /** parámetro para visulaización inline o en bloque  self.inline = boolean **/
            // param visualization
            self.inline = false;

            $.extend(data, {
                uiValues: [
                    {
                        label: bizagi.localization.getResource("formmodeler-component-editor-taskstatedefaultvalue-all"),
                        value: "taskstate-all"
                    },
                    {
                        label: bizagi.localization.getResource("formmodeler-component-editor-taskstatedefaultvalue-expired"),
                        value: "taskstate-expired"
                    },
                    {
                        label: bizagi.localization.getResource("formmodeler-component-editor-taskstatedefaultvalue-expiresinthefuture"),
                        value: "taskstate-expires-future"
                    },
                    {
                        label: bizagi.localization.getResource("formmodeler-component-editor-taskstatedefaultvalue-expirestoday"),
                        value: "taskstate-expires-today"
                    }
                ],
                valueCheck: false
            });

            if (data.value === undefined || data.value === null) {
                data.value = 0;
            }

            if (typeof data.value == "object") {
                data.value = (data.value.fixedvalue) ? data.value.fixedvalue : 0;
            }

            data.value = self.Class.map[data.value];

            self.inputValue = data.value;

            elEditor = $.tmpl(self.getTemplate("frame"), data);

            if (self.inline) {
                elEditor.addClass('bizagi-editor-taskstatedefaultvalue-inline');
            }

            elEditor.appendTo(container);

            /*
            uiControls.comboBox
            @params: contenedor del uiControl, { uiValues:valores del combo, uiInline: visualizacion en linea con el label, onChange: funcion que se ejecuta al cambiar el valor }
            */
            var miCombo = new self.uiControls.comboBox({
                uiEditor: self,
                uiContainer: $('.ui-control-editor', elEditor),
                uiValues: data.uiValues,
                uiInline: self.inline,
                onChange: function (elValue, event) {
                    self.responseChangeCombo(elValue, event, self);
                }
            });
        },
        responseChangeCombo: function (elValue, event, self) {
            var newValueProp, options;

            newValueProp = self.buildValue(elValue);

            options = {
                typeEvent: bizagi.editor.component.properties.events.PROPERTIES_CHANGE_PROPERTY,
                newValue: newValueProp,
                data: newValueProp,
                type: self.options.name,
                id: self.element.closest(".bizagi_editor_component_properties").data("id")
            };

            self.controller.publish("propertyEditorChanged", options);
            self.inputValue = newValueProp;
        },
        remove: function () {
            var self = this;
            self.element.hide();
            self.element.empty();
        },
        loadTemplates: function () {
            var deferred = new $.Deferred();
            $.when(
                this.loadTemplate("frame", bizagi.getTemplate("bizagi.editor.component.editor.taskstatedefaultvalue").concat("#taskstatedefaultvalue-frame"))
            ).done(function () {
                deferred.resolve();
            });
            return deferred.promise();
        },
        /*
        * returns the value in json format
        */
        buildValue: function (data) {
            var value = 0;            
            for (var index in this.Class.map) {
                var item = this.Class.map[index];
                if (item == data) {
                    value = index;
                    break;
                }
            }
            return { fixedvalue: value };
        }
    }
);