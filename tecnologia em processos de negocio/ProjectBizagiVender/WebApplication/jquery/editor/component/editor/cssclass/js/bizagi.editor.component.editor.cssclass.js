/*
@title: Editor CSSClass
@authors: Rhony Pedraza
@date: 21-jan-13
*/
bizagi.editor.component.editor(
    "bizagi.editor.component.editor.cssclass", {
        init : function(canvas, model, controller) {
            this._super(canvas, model, controller);
        },
        renderEditor : function(container, data) {
            var self = this, elEditor;
            
            if(data.value === undefined) {
                data.value = "";
            } else {
                if(data.value === null) {
                    data.value = "";
                }
            }
            
            self.inputValue = data.value;
            
            elEditor = $.tmpl(self.getTemplate("frame"), data);
            elEditor.appendTo(container);
        },
        validateAndPublish : function(element, value) {
            var self = this, error;
            var reg = /^([a-zA-Z]([a-zA-Z0-9_-])*|\s)*$/;
            if(reg.test(value)) {
                self.hideError(element);
                self.publishValue(value);
            } else {
                error = bizagi.localization.getResource("formmodeler-component-editor-cssclass-error-class");
                self.showError(element, error);
                element.select();
            }
            
        },
        publishValue : function(value) {
            var self = this;
            var options = {
                typeEvent: bizagi.editor.component.properties.events.PROPERTIES_CHANGE_PROPERTY,
                oldValue: self.inputValue,
                newValue: value,
                type: self.options.name,
                id: self.element.closest(".bizagi_editor_component_properties").data("id")
            };
            
            self.controller.publish("propertyEditorChanged", options);
            
            self.inputValue = value;
        },
        loadTemplates : function() {
            var self = this, defer;
            defer = $.Deferred();
            $.when(
                self.loadTemplate("frame", bizagi.getTemplate("bizagi.editor.component.editor.cssclass").concat("#cssclass-frame"))
            ).done(function() {
                defer.resolve();
            });
            return defer.promise();
        },
        
        "input keyup" : function(el, event) {
            var self = this;
            var value = el.val();
            
            if(event.keyCode == 13 && value != self.inputValue) {
                self.validateAndPublish(el, value);
            }
        },
        "input blur" : function(el) {
            var self = this;
            var value = el.val();
            
            if(value != self.inputValue) {
                self.validateAndPublish(el, value);
            }
        }
    }
);