/*
@title: Editor Boolean Component
@authors: Rhony Pedraza
@date: 03-may-12
*/
bizagi.editor.component.editor(
    "bizagi.editor.component.editor.boolean", {
        init: function (canvas, model, controller) {
            this._super(canvas, model, controller);
            this.focus = null;
        },
        renderEditor: function (container, data) {
            var self = this, elDefaultAction, elEditor, elTooltip = false, lblRequired, eParams, labels = {};
            if (data.value === undefined) {
                data.value = false;
            } else {
                if (data.value === null || data.value === false || data.value == "false") {
                    data.value = false;
                } else {
                    if (data.value === true || data.value == "true") {
                        data.value = true;
                    }
                }
            }

            self.inputValue = (data.value) ? true : false;
            if (data["default"] === undefined) {
                self.defaultValue = false;
            } else {
                if (data["default"] === null || data["default"] === false || data["default"] == "false") {
                    self.defaultValue = false;
                } else {
                    if (data["default"] === true || data["default"] == "true") {
                        self.defaultValue = true;
                    }
                }
            }

            eParams = data["editor-parameters"];
            if (eParams) {
                elTooltip = (eParams.tooltip) ? bizagi.localization.getResource(eParams.tooltip) : false;
                if (eParams.labels) {
                    labels["true"] = bizagi.localization.getResource(eParams.labels["true"].caption);
                    labels["false"] = bizagi.localization.getResource(eParams.labels["false"].caption);
                }
            }

            self.inline = true;

            $.extend(data, {
                uiValues:
                                [
                                    { label: eParams.labels ? labels["true"] : bizagi.localization.getResource("formmodeler-component-editor-boolean-true"), value: "true" },
                                    { label: eParams.labels ? labels["false"] : bizagi.localization.getResource("formmodeler-component-editor-boolean-false"), value: "false" }
                                ],
                tooltip: elTooltip
            });

            elEditor = $.tmpl(this.getTemplate("frame"), data);
            elDefaultAction = $.tmpl(this.getTemplate("default"));

            if (self.inline) {
                elEditor.addClass('bizagi-editor-boolean-inline');
            }

            elEditor.append(elDefaultAction);
            elEditor.appendTo(container);

            lblRequired = $('label', elEditor);
            self.addRequired(lblRequired);

            /*
            uiControls.comboBox
            @params: contenedor del uiControl, { uiValues:valores del combo, uiInline: visualizacion en linea con el label, onChange: funcion que se ejecuta al cambiar el valor }
            */
            var miSwitch = new self.uiControls.booleanSwitch(
                {
                    uiEditor: self,
                    uiContainer: $('.ui-control-editor', elEditor),
                    uiValues: data.uiValues,
                    uiInline: self.inline,
                    onChange: function (elValue, event) {
                        self.responseChangeSwitch(elValue, event, self);
                    }
                });


            $('.boolean-container.ui-control-container[title]', self.element).tooltip({ tooltipClass: 'ui-widget-content ui-propertybox-tooltip ui-boolean-editor-tooltip',
                position: {
                                                                            my: "left top+10",
                                                                            at: "left bottom"
                                                                            
                }
            });

        },
        remove: function () {
            this.element.hide();
            this.element.empty();
        },
        loadTemplates: function () {
            var deferred = new $.Deferred();
            $.when(
                this.loadTemplate("frame", bizagi.getTemplate("bizagi.editor.component.editor.boolean").concat("#boolean-frame")),
                this.loadTemplate("default", bizagi.getTemplate("bizagi.editor.component.editor.boolean").concat("#boolean-default-action"))
            ).done(function () {
                deferred.resolve();
            });
            return deferred.promise();
        },
        responseChangeSwitch: function (elValue, event, self) {
            var oldValueProp, newValueProp;

            oldValueProp = self.inputValue;
            newValueProp = elValue;
            self.controller.publish("propertyEditorChanged", { typeEvent: bizagi.editor.component.properties.events.PROPERTIES_CHANGE_PROPERTY, oldValue: oldValueProp, newValue: newValueProp, type: self.options.name, id: self.element.closest(".bizagi_editor_component_properties").data("id") });
            self.inputValue = newValueProp;
        },

        ".editor-boolean-icon-default-value click": function (el) {
            var self = this, oldValueProp, options;
            oldValueProp = self.inputValue;

            options = {
                typeEvent: bizagi.editor.component.properties.events.PROPERTIES_CHANGE_PROPERTY,
                oldValue: oldValueProp,
                newValue: self.defaultValue,
                type: self.options.name,
                id: self.element.closest(".bizagi_editor_component_properties").data("id")
            };
            self.controller.publish("propertyEditorChanged", options);
            self.inputValue = self.defaultValue;
        }
    }
);
