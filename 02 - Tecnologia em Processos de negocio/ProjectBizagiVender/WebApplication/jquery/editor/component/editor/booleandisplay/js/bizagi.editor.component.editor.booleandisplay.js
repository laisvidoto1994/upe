/*
@title: Editor BooleanDisplay Component
@authors: Ramiro Gomez
@date: 09-jul-2012
*/
bizagi.editor.component.editor(
    "bizagi.editor.component.editor.booleandisplay", {
        init : function(canvas, model, controller) {
            this._super(canvas, model, controller);
        },
        renderEditor : function(container, data) {
            var self = this,
            elEditor, elOption, elPadreValues, elValue, elProperties, lblRequired;

            /** parámetro para visulaización inline o en bloque  self.inline = boolean **/
            self.inline = false;

            $.extend(data, {   
                                uiValues:
                                [
                                    { label: bizagi.localization.getResource("formmodeler-component-editor-booleandisplay-option-check"), value: "check", style: "bz-studio bz-yes-no_16x16_standard", icon: "nothing" },
                                    { label: bizagi.localization.getResource("formmodeler-component-editor-booleandisplay-option-radio"), value: "option", style: "bz-studio  bz-radio_16x16_standard", icon: "nothing" }
                                ],
                                valueCheck:false
                            });

            data.value = (!data.value)? "expression" : data.value;

            self.inputValue = data.value;

            elEditor = $.tmpl(self.getTemplate("frame"), data);
            elEditAction = $.tmpl(self.getTemplate("edit"), {});

            if(self.inline){
                elEditor.addClass('bizagi-editor-booleandisplay-inline');
            }

            elEditor.appendTo(container);

            lblRequired = $('label',elEditor);
            self.addRequired(lblRequired);

            /*
                uiControls.comboBox
                @params: contenedor del uiControl, { uiValues:valores del combo, uiInline: visualizacion en linea con el label, onChange: funcion que se ejecuta al cambiar el valor }
            */
            var miCombo = new self.uiControls.comboBox(
                {
                    uiEditor:self,
                    uiContainer:$('.ui-control-editor',elEditor),
                    uiValues:data.uiValues,
                    uiInline:self.inline,
                    onChange:function(elValue, event){
                        self.responseChangeCombo(elValue, event, self);
                    }
                });
            
        },
        remove : function() {
            this.element.hide();
            this.element.empty();
        },
        loadTemplates : function() {
            var deferred = new $.Deferred();
            $.when(
                this.loadTemplate("frame", bizagi.getTemplate("bizagi.editor.component.editor.booleandisplay").concat("#booleandisplay-frame")),
                this.loadTemplate("edit", bizagi.getTemplate("bizagi.editor.component.editor.booleandisplay").concat("#booleandisplay-frame-edit"))
            ).done(function() {
                deferred.resolve();
            });
            return deferred.promise();
        },
        responseChangeCombo: function(elValue ,event, self){

            var oldValueProp, newValueProp;

            oldValueProp = self.inputValue;
            newValueProp = elValue;

            self.controller.publish("propertyEditorChanged", { typeEvent: bizagi.editor.component.properties.events.PROPERTIES_CHANGE_PROPERTY, oldValue : oldValueProp, newValue : newValueProp, data : newValueProp, type : self.options.name, id : self.element.closest(".bizagi_editor_component_properties").data("id")});
            self.inputValue = newValueProp;
        }
    }
);