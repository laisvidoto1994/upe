/*
@title: Editor casestatedefaultvalue
@authors: Cristian Olaya
@date: 28-aug-2012
*/
bizagi.editor.component.editor(
    "bizagi.editor.component.editor.casestatedefaultvalue", {
        map: {
            0: "casestate-all",
            5: "casestate-closed",
            2: "casestate-pending",
            4: "casestate-aborted"
        }
    }, {
        init: function (canvas, model, controller) {
            var self = this;
            self._super(canvas, model, controller);
        },
        renderEditor: function (container, data) {
            var self = this, elEditor;


            self.inline = false;

            $.extend(data, {
                uiValues: [
                    {
                        label: bizagi.localization.getResource("formmodeler-component-editor-casestatedefaultvalue-all"),
                        value: "casestate-all",
                        style: "bz-studio bz-state-blue_16x16_standard"
                    },
                    {
                        label: bizagi.localization.getResource("formmodeler-component-editor-casestatedefaultvalue-closed"),
                        value: "casestate-closed",
                        style: "bz-studio bz-state-red_16x16_standard"
                    },
                    {
                        label: bizagi.localization.getResource("formmodeler-component-editor-casestatedefaultvalue-pending"),
                        value: "casestate-pending",
                        style: "bz-studio bz-state-yellow_16x16_standard"
                    },
                    {
                        label: bizagi.localization.getResource("formmodeler-component-editor-casestatedefaultvalue-aborted"),
                        value: "casestate-aborted",
                        style: "bz-studio bz-remove-cross_16x16_standard"
                    }
                ],
                valueCheck: false
            });

            if (data.value === undefined) {
                data.value = 0;
            } else {
                if (data.value === null) {
                    data.value = 0;
                }
            }

            if (typeof data.value == "object") {
                data.value = (data.value.fixedvalue) ? data.value.fixedvalue : 0;
            }

            data.value = self.Class.map[data.value];

            self.inputValue = data.value;

            elEditor = $.tmpl(self.getTemplate("frame"), data);

            if (self.inline) {
                elEditor.addClass('bizagi-editor-casestatedefaultvalue-inline');
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
            self.inputValue = elValue;
        },
        remove: function () {
            var self = this;
            self.element.hide();
            self.element.empty();
        },
        loadTemplates: function () {
            var deferred = new $.Deferred();
            $.when(
                this.loadTemplate("frame", bizagi.getTemplate("bizagi.editor.component.editor.casestatedefaultvalue").concat("#casestatedefaultvalue-frame"))
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