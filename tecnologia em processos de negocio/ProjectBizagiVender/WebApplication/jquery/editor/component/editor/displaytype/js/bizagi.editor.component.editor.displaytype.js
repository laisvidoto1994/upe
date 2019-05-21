/*
@title: Editor displaytype
@authors: Rhony Pedraza
@date: 13-jun-12
*/
bizagi.editor.component.editor(
    "bizagi.editor.component.editor.displaytype", {
        init: function (canvas, model, controller) {
            this._super(canvas, model, controller);
        },
        renderEditor: function (container, data) {
            var self = this, elEditor, lblRequired;

            self.inline = true;

            $.extend(data, {
                uiValues:
                                [
                                    { label: bizagi.localization.getResource("formmodeler-component-editor-displaytype-option-both"), value: "both", style: " bz-studio bz-display-both_16x16_standard" },
                                    { label: bizagi.localization.getResource("formmodeler-component-editor-displaytype-option-label"), value: "label", style: "bz-studio bz-text-label_16x16_standard" },
                                    { label: bizagi.localization.getResource("formmodeler-component-editor-displaytype-option-value"), value: "value", style: "bz-studio bz-display-value_16x16_standard" },
                                    { label: bizagi.localization.getResource("formmodeler-component-editor-displaytype-option-reversed"), value: "reversed", style: "bz-studio bz-display-reversed_16x16_standard" },
                                    { label: bizagi.localization.getResource("formmodeler-component-editor-displaytype-option-vertical"), value: "vertical", style: "bz-studio bz-display-vertical_16x16_standard" }
                                ]
            });

            self.removeItems(data);

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

        /*
        * 
        */
        removeItems: function (data) {
            var editorParameters = data["editor-parameters"];
            var items = editorParameters && editorParameters.hide;
            var values = data.uiValues;

            if ($.isArray(items) && items.length > 0) {
                values = [];
                for (var i = 0, l = data.uiValues.length; i < l; i++) {
                    var value = data.uiValues[i].value;
                    if ($.inArray(value, items) == -1) {
                        values.push(data.uiValues[i]);            
                    }
                }
            }

            data.uiValues = values;
        },

        remove: function () {
            this.element.hide();
            this.element.empty();
        },
        loadTemplates: function () {
            var deferred = $.Deferred();
            $.when(
                this.loadTemplate("frame", bizagi.getTemplate("bizagi.editor.component.editor.displaytype").concat("#displaytype-frame"))
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