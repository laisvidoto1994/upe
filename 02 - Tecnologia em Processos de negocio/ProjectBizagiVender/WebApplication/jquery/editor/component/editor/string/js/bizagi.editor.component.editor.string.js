/*
@title: Editor String Component
@authors: Rhony Pedraza
@date: 24-apr-12
*/
bizagi.editor.component.editor(
    "bizagi.editor.component.editor.string", {
        init : function(canvas, model, controller) {
            this._super(canvas, model, controller);
        },
        renderEditor : function(container, data) {
            var self = this,
            elEditor, elDefaultAction, elLocalization;

            self.inputValue = data.value;
            self.defaultValue = data["default"];
            self.charLimit = 300;

            self.localization = (data.showLocalization) ? true : false;
            self.placeholder = (data["editor-parameters"].placeholder)? true : false;
            self.placeholderText = (self.placeholder) ? ' '+data["editor-parameters"].placeholder : ' ';
            self.isReadOnly = (data["editor-parameters"].readOnly !== undefined) ? bizagi.util.parseBoolean(data["editor-parameters"].readOnly) : false;
            

            $.extend(data, {
                placeholder: self.placeholder,
                placeholderText: self.placeholderText,
                isReadOnly: self.isReadOnly
            });


            elEditor = $.tmpl(self.getTemplate("frame"), data);

            if (!self.isReadOnly) {

                elDefaultAction = $.tmpl(self.getTemplate("default"));
                elLocalization = $.tmpl(self.getTemplate("localization"));

                if (self.localization) { $('.editor-string-input', elEditor).append(elLocalization); };
                $('.editor-string-input', elEditor).append(elDefaultAction);
            }

            elEditor.appendTo(container);
        },
        remove : function() {
            var self = this;

            self.element.hide();
            self.element.empty();
        },
        loadTemplates : function() {
            var self = this,
            deferred = new $.Deferred();
            
            $.when(
                self.loadTemplate("frame", bizagi.getTemplate("bizagi.editor.component.editor.string").concat("#string-frame")),
                self.loadTemplate("default", bizagi.getTemplate("bizagi.editor.component.editor.string").concat("#string-default-value")),
                self.loadTemplate("localization", bizagi.getTemplate("bizagi.editor.component.editor.string").concat("#string-localization"))
            ).done(function() {
                deferred.resolve();    
            });
            
            return deferred.promise();
        },
        validate:function(el){
            var self = this,
            element,
            elValue,
            isLength = false

            element = $(el);
            elValue = element.val();

            if(!self.isLength(el) && elValue.length){
                if(!element.hasClass('error')){
                    element.addClass('error');
                }
                self.showError(el,self.Error);
                element.select();
            }else{
                element.removeClass('error');
                self.hideError(el);
                isLength = true;
            }

            return isLength;

        },
        isLength:function(el){
            var self = this;
            
            self.Error = bizagi.localization.getResource("bizagi-editor-numberrange-error-lenght").replace('$number', self.charLimit);
            
            return (el.val().length <= self.charLimit);
        },
        "label click" : function(el, event) {
            el.next().focus();
        },
        "input keydown" : function(el, event) {
            var self = this;

            if(event.keyCode == 13) {
                if(self.validate(el)) {
                    if(self.inputValue != el.val()) {
                        var options = {
                            typeEvent : bizagi.editor.component.properties.events.PROPERTIES_CHANGE_PROPERTY,
                            oldValue : self.inputValue,
                            newValue : el.val(),
                            type : self.options.name,
                            id : self.element.closest(".bizagi_editor_component_properties").data("id")
                        }
                        if(self.options.hasOwnProperty("exclusive")) {
                            options = $.extend({}, options, { exclusive : self.options.exclusive });
                        }
                        self.controller.publish("propertyEditorChanged", options);
                        self.inputValue = el.val();
                    }
                }
            }
        },
        "input blur" : function(el, event) {
            var self = this,
            localizationIcon,
            inputParent = self.element.find('input[type="text"]').parent();

            if(self.validate(el)) {
                if(this.inputValue != el.val()) {
                    var options = {
                        typeEvent : bizagi.editor.component.properties.events.PROPERTIES_CHANGE_PROPERTY,
                        oldValue : self.inputValue,
                        newValue : el.val(),
                        type : self.options.name,
                        id : self.element.closest(".bizagi_editor_component_properties").data("id")
                    }
                    if(self.options.hasOwnProperty("exclusive")) {
                        options = $.extend({}, options, { exclusive : self.options.exclusive });
                    }
                    self.controller.publish("propertyEditorChanged", options);
                    self.inputValue = el.val();
                }
            }

            localizationIcon = self.element.find('.editor-string-icon-localization');
            localizationIcon.removeClass('editor_string_fadeIn');
            inputParent.toggleClass('editor-string-focus');
        },
         "input focus" : function(el, event) {
            var localizationIcon,
            self = this;

            localizationIcon = self.element.find('.editor-string-icon-localization');
            inputParent = self.element.find('input[type="text"]').parent();

            localizationIcon.addClass('editor_string_fadeIn');
            inputParent.toggleClass('editor-string-focus');
         },
        "span.editor-string-icon-localization click" : function(el, event) {
            this.controller.publish("propertyEditorChanged", {typeEvent: bizagi.editor.component.properties.events.PROPERTIES_SHOW_LOCALIZATION, id : this.element.closest(".bizagi_editor_component_properties").data("id")});
        },
        ".editor-string-icon-default-value click":function(el, event){
            var input,
            self = this,
            elValue = self.defaultValue;

            input = self.element.find('input[type="text"]');

            if(elValue) {
                input.val(elValue);
                self.controller.publish("propertyEditorChanged", {typeEvent: bizagi.editor.component.properties.events.PROPERTIES_CHANGE_PROPERTY, oldValue : self.inputValue, newValue : elValue, type : self.options.name, id : self.element.closest(".bizagi_editor_component_properties").data("id")});
            }
        },
        ".editor-string-icon-localization mouseenter" : function(el, event) {
            el.addClass('editor_string_fadeIn');
        },
        ".editor-string-icon-localization mouseleave" : function(el, event) {
            el.removeClass('editor_string_fadeIn');
        }
    }
);