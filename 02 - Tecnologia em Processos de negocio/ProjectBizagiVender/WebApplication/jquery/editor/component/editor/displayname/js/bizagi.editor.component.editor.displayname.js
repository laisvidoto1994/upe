/*
@title: Editor Boolean Component
@authors: Alexander Mejia / Ramiro Gomez
@date: 14-jun-12
*/

bizagi.editor.component.editor(
    "bizagi.editor.component.editor.displayname", {
        
        init : function(canvas, model, controller) {
            this._super(canvas, model, controller);
            this.focus = null;
        },
        
        renderEditor : function(container, data) {
            var self = this,
                caption,
                elEditor,
                lblRequired;
                
            self.inputValue = self.options.value;
            self.defaultValue = (data["default"]) ? data["default"] : "";

            self.localization = (data.showLocalization) ? true : true;
            elEditor = $.tmpl(self.getTemplate("frame"), data);
            elLocalization = $.tmpl(self.getTemplate("localization"));

            if(self.localization){ $('.ui-control-input',elEditor).append(elLocalization); };

            elEditor.appendTo(container);

            lblRequired = $('label',elEditor);
            self.addRequired(lblRequired);

        },
        
        loadTemplates : function() {
            var self = this,deferred;

            deferred = new $.Deferred();
            $.when(
                self.loadTemplate("frame", bizagi.getTemplate("bizagi.editor.component.editor.displayname").concat("#displayname-frame")),
                self.loadTemplate("localization", bizagi.getTemplate("bizagi.editor.component.editor.displayname").concat("#displayname-localization"))
            ).done(function() {
                deferred.resolve();
            });
            return deferred.promise();
        },
        
        remove: function(){
            var self = this;
        	self.element.hide();
            self.element.empty();
        },
        "input keyup" : function(el, event) {
            var value = el.val();
            
            if( ( event.keyCode == 13 ) && ( value !== this.inputValue ) ) {
                
                this.controller.publish("propertyEditorChanged", { typeEvent: bizagi.editor.component.properties.events.PROPERTIES_CHANGE_PROPERTY, oldValue : this.inputValue, newValue : value, type : this.options.name, id : this.element.closest(".bizagi_editor_component_properties").data("id") });
                this.inputValue = value;
            }
        },
        "input blur" : function(el, event) {
            var self = this,
            localizationIcon,
            inputParent = self.element.find('input[type="text"]').parent();
            var value = el.val();

            localizationIcon = self.element.find('.editor-displayname-localization');
            localizationIcon.removeClass('ui-control-fadeIn');
            inputParent.toggleClass('ui-control-focus');

            this.controller.publish("propertyEditorChanged", { typeEvent: bizagi.editor.component.properties.events.PROPERTIES_CHANGE_PROPERTY, oldValue : this.inputValue, newValue : value, type : this.options.name, id : this.element.closest(".bizagi_editor_component_properties").data("id") });
            this.inputValue = value;
        },
         "input focus" : function(el, event) {
            var localizationIcon,
            value,
            input,
            self = this;

            localizationIcon = self.element.find('.editor-displayname-localization');
            inputParent = self.element.find('input[type="text"]').parent();

            localizationIcon.addClass('ui-control-fadeIn');
            inputParent.toggleClass('ui-control-focus');

            value = el.val();

            if ( value !== this.inputValue ){            
                self.controller.publish("propertyEditorChanged", { typeEvent: bizagi.editor.component.properties.events.PROPERTIES_CHANGE_PROPERTY, oldValue : this.inputValue, newValue : value, type : this.options.name, id : this.element.closest(".bizagi_editor_component_properties").data("id") });
                self.inputValue = value;
            } 
         },
        "span.editor-displayname-localization click" : function(el, event) {
            var self = this;

            self.controller.publish("propertyEditorChanged", { typeEvent: bizagi.editor.component.properties.events.PROPERTIES_SHOW_LOCALIZATION, id : this.element.closest(".bizagi_editor_component_properties").data("id") });
        },
        "span.editor-displayname-localization mouseenter" : function(el, event) {
            var self = this;

            el.addClass('ui-control-fadeIn');
        },
        "span.editor-displayname-localization mouseleave" : function(el, event) {
            var self = this;

            el.removeClass('ui-control-fadeIn');
        }                            
    }
)    
