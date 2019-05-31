/*
 @title: Editor linktarget Component
 @authors: Maria Camila Angel
 @date: 8-abr-2015
 */
bizagi.editor.component.editor(
    "bizagi.editor.component.editor.linktarget", {
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
                        {label:bizagi.localization.getResource("formmodeler-component-editor-linktarget-option-newtab"), value:"newtab"},
                        {label:bizagi.localization.getResource("formmodeler-component-editor-linktarget-option-newwindow"), value:"newwindow"}
                    ],
                valueCheck:false
            });

            //data.value = (!data.value)? "expression" : data.value;

            self.inputValue = data.value;

            elEditor = $.tmpl(self.getTemplate("frame"), data);
            elEditor.appendTo(container)


            /*
             uiControls.comboBox
             @params: contenedor del uiControl, { uiValues:valores del combo, uiInline: visualizacion en linea con el label, onChange: funcion que se ejecuta al cambiar el valor }
             */
            var miCombo = new self.uiControls.comboBox(
                {
                    uiWidthIcon: 0,
                    uiEditor: self,
                    uiContainer: $('.ui-control-editor', elEditor),
                    uiValues: data.uiValues,
                    onChange: function (elValue, event) {
                        self.responseChangeCombo(elValue, event, self);
                    }
                });
        },
        loadTemplates : function() {
            var deferred = new $.Deferred();
            $.when(
                this.loadTemplate("frame", bizagi.getTemplate("bizagi.editor.component.editor.linktarget").concat("#linktarget-frame"))
            ).done(function() {
                    deferred.resolve();
                });
            return deferred.promise();
        },
        responseChangeCombo: function(elValue ,event, self){

            var oldValueProp, newValueProp;

            oldValueProp = self.inputValue;
            newValueProp = elValue;

            options = {
                typeEvent: bizagi.editor.component.properties.events.PROPERTIES_CHANGE_PROPERTY,
                oldValue : oldValueProp,
                newValue : newValueProp,
                data : newValueProp,
                type : self.options.name,
                id : self.element.closest(".bizagi_editor_component_properties").data("id")
            };

            self.controller.publish("propertyEditorChanged", options);
            self.inputValue = newValueProp;
        }
    }
);