/*
@title: Editor controlreference
@authors: Ramiro Gomez
@date: 12-Jul-2012
*/
bizagi.editor.component.editor(
    "bizagi.editor.component.editor.controlreference", {
        init : function(canvas, model, controller) {
            this._super(canvas, model, controller);
        },
        renderEditor : function(container, data) {
            var self = this, elEditor, columnsLength, lblRequired;
            
            self.inline = true;

            self.retrieveData(data);
            

            data.value = (!data.value)? "isEmpty" : data.value;

            self.inputValue = data.value;

            elEditor = $.tmpl(this.getTemplate("frame"), data);
            elEditor.appendTo(container);

            lblRequired = $('label',elEditor);
            self.addRequired(lblRequired);

             /*
                uiControls.comboBox
                @params: contenedor del uiControl
            */
            self.myCombo = new self.uiControls.comboBox(
                {
                    uiEditor:self,
                    uiPlaceHolderText:bizagi.localization.getResource("formmodeler-component-editor-all-select-one"),
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
            var deferred = $.Deferred();
            $.when(
                this.loadTemplate("frame", bizagi.getTemplate("bizagi.editor.component.editor.controlreference").concat("#controlreference-frame"))
            ).done(function() {
                deferred.resolve();
            });
            return deferred.promise();
        },
        retrieveData:function(model){
            var stringForIcon, elementsLength, newObject, newValues;


            if(model["editor-parameters"].hasOwnProperty('elements')){

                elementsLength = model["editor-parameters"]["elements"].length;
                newValues = [];

                for(var i=0;  i<elementsLength ; i++){
                    newObject = {};

                    newObject.label = model["editor-parameters"]["elements"][i].displayname;
                    newObject.value = model["editor-parameters"]["elements"][i].guid;

                    stringForIcon = 'controlreference-icon-' + model["editor-parameters"]["elements"][i].displayname["i18n"]["default"].replace(/ /gi, '').toLowerCase();

                    newObject.icon = "column "+stringForIcon;

                    newValues.push(newObject);
                }

                $.extend(model, {uiValues:newValues});

            }

            return model;
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