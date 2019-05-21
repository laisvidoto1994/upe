/*
@title: Editor BooleanRule Component
@authors: Rhony Pedraza / Ramiro Gomez
@date: 07-may-12
*/
bizagi.editor.component.editor(
    "bizagi.editor.component.editor.ruleexpression", {
        init: function (canvas, model, controller) {
            this._super(canvas, model, controller);
        },
        renderEditor: function (container, data) {
            var self = this, conditionSimple,
                elEditor;

            /** parámetro para visulaización inline o en bloque  self.inline = boolean **/
            self.inline = true;
            self.data = data;

            conditionSimple = self.createDataSource();
            self.inputValue = data.value;

            elEditor = $.tmpl(self.getTemplate("frame"), data);
            if (self.inline) {
                elEditor.addClass('bizagi-editor-ruleexpression-inline');
            }

            elEditor.appendTo(container);
            self.setInitValue(data.value);
            self.createUIControls(elEditor, conditionSimple);

        },
        createDataSource: function () {
            var self = this;
            var editorParameters = self.data["editor-parameters"];
            var conditionSimple = null, objectExpression = null;

            if (self.data.value) {
                if (self.data.value["rule"] || self.data.value["rule90"]) {
                    objectExpression = { label: bizagi.localization.getResource("formmodeler-component-editor-ruleexpression-option-expression"), value: self.data.value, icon: "expression", style: "bz-studio bz-expresion-ex_16x16_standard" };
                } else {
                    objectExpression = { label: bizagi.localization.getResource("formmodeler-component-editor-ruleexpression-option-expression"), value: { "rule": { "baref": { "ref": "expression" } } }, icon: "expression", style: "bz-studio bz-expresion-ex_16x16_standard" };
                }
            }

            if (!$.isEmptyObject(editorParameters) && !editorParameters.type) {
                if (editorParameters.allowboolean !== undefined) {
                    if (editorParameters.allowboolean == "false" || editorParameters.allowboolean == false) {
                        $.extend(self.data, {
                            uiValues:
                                [
                                    objectExpression
                                ],
                            valueCheck: false
                        });
                        conditionSimple = true;
                    }
                }
            } else {
                $.extend(self.data, {
                    uiValues:
                                [
                                    { label: bizagi.localization.getResource("formmodeler-component-editor-ruleexpression-option-true"), value: { "fixedvalue": "true" }, icon: "true", style: "bz-studio bz-yes-no_16x16_standard" },
                                    { label: bizagi.localization.getResource("formmodeler-component-editor-ruleexpression-option-false"), value: { "fixedvalue": "false" }, icon: "false", style: "bz-studio bz-false_16x16_standard" },
                                    objectExpression
                                ],
                    valueCheck: false
                });
                conditionSimple = false;
            }

            return conditionSimple;
        },
        createUIControls: function (elEditor, conditionSimple) {
            var self = this;
            /*
            uiControls.comboBox
            @params: contenedor del uiControl, { uiValues:valores del combo, uiInline: visualizacion en linea con el label, onChange: funcion que se ejecuta al cambiar el valor }
            */
            if (conditionSimple) {
                self.myCombo = new self.uiControls.comboBox(
                            {
                                uiEditor: self,
                                uiPlaceHolderText: "-----",
                                uiContainer: $('.ui-control-editor', elEditor),
                                uiValues: self.data.uiValues,
                                uiInline: self.inline,
                                onChange: function (elValue, event) {
                                    self.responseChangeCombo(elValue, event, self);
                                }
                            });
            } else {
                self.myCombo = new self.uiControls.comboBox(
                {
                    uiEditor: self,
                    uiContainer: $('.ui-control-editor', elEditor),
                    uiValues: self.data.uiValues,
                    uiInline: self.inline,
                    onChange: function (elValue, event) {
                        self.responseChangeCombo(elValue, event, self);
                    }
                });
            }
        },
        remove: function () {
            this.element.hide();
            this.element.empty();
        },
        loadTemplates: function () {
            var deferred = new $.Deferred();
            $.when(
                this.loadTemplate("frame", bizagi.getTemplate("bizagi.editor.component.editor.ruleexpression").concat("#ruleexpression-frame")),
                this.loadTemplate("option", bizagi.getTemplate("bizagi.editor.component.editor.ruleexpression").concat("#ruleexpression-frame-option")),
                this.loadTemplate("edit", bizagi.getTemplate("bizagi.editor.component.editor.ruleexpression").concat("#ruleexpression-frame-edit"))
            ).done(function () {
                deferred.resolve();
            });
            return deferred.promise();
        },
        setInitValue: function (val) {

            var valBoolean, self = this, uiValues = self.data.uiValues;

            for (var i = 0; i < uiValues.length; i++) {
                delete uiValues[i].selected;

                if (val["rule"] && uiValues[i].value["rule"]) {
                    uiValues[i].selected = 'selected';
                    if (val["rule"].displayName) {
                        uiValues[i].label = val["rule"].displayName;
                    }
                }
                else if (val["rule90"] && uiValues[i].value["rule90"]) {
                    uiValues[i].selected = 'selected';
                    if (val["rule90"].displayName) {
                        uiValues[i].label = val["rule90"].displayName;
                    }
                }
                else {
                    valBoolean = eval(uiValues[i].value.fixedvalue);
                    if (eval(val.fixedvalue) === valBoolean) {
                        uiValues[i].selected = 'selected';
                    }
                }
            }



            // val.fixedvalue can be boolean false
            //return val.fixedvalue || val.baref.ref;
        },
        responseChangeCombo: function (elValue, event, self) {

            var oldValueProp, newValueProp, typeEvent;

            oldValueProp = self.inputValue;
            newValueProp = elValue;

            typeEvent = bizagi.editor.component.properties.events.PROPERTIES_CHANGE_PROPERTY;

            if (newValueProp["rule"] || newValueProp["rule90"]) {
                typeEvent = bizagi.editor.component.properties.events.PROPERTIES_SELECT_EXPRESSION;
                self.options.name = self.options.name;
            }

            self.options.value = elValue;
            self.setInitValue(newValueProp);
            self.myCombo.update(self.data.uiValues);

            bizagi.log('PROPERTIES_SELECT_EXPRESSION', newValueProp);
            self.controller.publish("propertyEditorChanged", { typeEvent: typeEvent, oldValue: oldValueProp, newValue: newValueProp, data: newValueProp, type: self.options.name, id: self.element.closest(".bizagi_editor_component_properties").data("id"), categorytype: "Boolean" });
            self.inputValue = newValueProp;

        }
    }
);
