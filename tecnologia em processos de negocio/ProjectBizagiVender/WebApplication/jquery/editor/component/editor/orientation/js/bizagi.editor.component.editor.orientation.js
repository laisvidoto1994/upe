/*
@title: Editor orientation
@authors: Rhony Pedraza
@date: 28-aug-2012
*/
bizagi.editor.component.editor(
    "bizagi.editor.component.editor.orientation", {
        init : function(canvas, model, controller) {
            var self = this;
            self._super(canvas, model, controller);
        },
        renderEditor : function(container, data) {
            var self = this, elEditor;
            
            /** parámetro para visulaización inline o en bloque  self.inline = boolean **/
            // param visualization
            self.inline = false;
            
            $.extend(data, {
                uiValues: [
                    {
                        label: bizagi.localization.getResource("formmodeler-component-editor-orientation-ltr"),
                        style: "bz-studio bz-orientation-left-to-right_16x16_standard",
                        value : "ltr"
                    },
                    {
                        label: bizagi.localization.getResource("formmodeler-component-editor-orientation-rtl"),
                        style: "bz-studio bz-orientation-right-to-left_16x16_standard",
                        value : "rtl"
                    },
                    {
                        label: bizagi.localization.getResource("formmodeler-component-editor-orientation-inherited"),
                        style: "bz-studio bz-orientation-inherited_16x16_standard",
                        value: "inherited"
                    }
                ],
                valueCheck : false
            });
            
            if(data.value === undefined) {
                data.value = "ltr";
            } else {
                if(data.value === null) {
                    data.value = "ltr";
                }
            }
            
            self.inputValue = data.value;
            
            elEditor = $.tmpl(self.getTemplate("frame"), data);

            if(self.inline){
                elEditor.addClass('bizagi-editor-orientation-inline');
            }

            elEditor.appendTo(container);

            /*
                uiControls.comboBox
                @params: contenedor del uiControl, { uiValues:valores del combo, uiInline: visualizacion en linea con el label, onChange: funcion que se ejecuta al cambiar el valor }
            */
            var miCombo = new self.uiControls.comboBox({
                uiEditor : self,
                uiContainer : $('.ui-control-editor', elEditor),
                uiValues : data.uiValues,
                uiInline : self.inline,
                onChange : function(elValue, event) {
                    self.responseChangeCombo(elValue, event, self);
                }
            });
        },
        responseChangeCombo: function(elValue ,event, self) {
            var oldValueProp, newValueProp, options;
            
            oldValueProp = self.inputValue;
            newValueProp = elValue;
            
            options = {
                typeEvent : bizagi.editor.component.properties.events.PROPERTIES_CHANGE_PROPERTY,
                oldValue : oldValueProp,
                newValue : newValueProp,
                data : newValueProp,
                type : self.options.name,
                id : self.element.closest(".bizagi_editor_component_properties").data("id")
            };
            
            self.controller.publish("propertyEditorChanged", options);
            self.inputValue = newValueProp;
        },
        remove : function() {
            var self = this;
            self.element.hide();
            self.element.empty();
        },
        loadTemplates : function() {
            var deferred = new $.Deferred();
            $.when(
                this.loadTemplate("frame", bizagi.getTemplate("bizagi.editor.component.editor.orientation").concat("#orientation-frame"))
            ).done(function() {
                deferred.resolve();
            });
            return deferred.promise();
        }
    }
);