bizagi.editor.component.editor(
    "bizagi.editor.component.editor.adhocsuggest", {
        init: function (canvas, model, controller) {
            this._super(canvas, model, controller);
            var self = this;
            self.adhocProcessId = model.adhocProcessId;
        },
        renderEditor: function (container, data) {
            var self = this,
            elEditor, elDefaultAction, elLocalization, lblRequired;

            self.inputValue = data.value;            
            self.charLimit = 300;
            
            self.placeholder = (data["editor-parameters"].placeholder) ? true : false;
            self.placeholderText = (self.placeholder) ? ' ' + data["editor-parameters"].placeholder : ' ';
            self.isReadOnly = (data["editor-parameters"].readOnly !== undefined) ? bizagi.util.parseBoolean(data["editor-parameters"].readOnly) : false;

            $.extend(data, {
                placeholder: self.placeholder,
                placeholderText: self.placeholderText,
                isReadOnly: self.isReadOnly
            });

            elEditor = $.tmpl(self.getTemplate("frame"), data);            

            elEditor.appendTo(container);

            self.adhocXpathInput = $("#adhocsuggest-input", elEditor);
            if(data.value){
                self.adhocXpathInput.val(data.value.xpath);
            }

            self.adhocXpathInput.on("focusin", function () {
                self.createAutoComplete(elEditor);
            });

            lblRequired = $('label', elEditor);
            self.addRequired(lblRequired);
            /*self.adhocXpathInput.on("focusout", function () {
                self.destroyAutoComplete(elEditor);
            });*/
        },
        createAutoComplete: function(editor){
            var self = this;
            if (self.autoCompleteCreated) return;
            if (self.adhocXpathvalues) {
                self.initializeAutoComplete(self.adhocXpathInput, self.adhocXpathvalues);
            } else {
                $.when(self.getDataSource()).done(function (data) {
                    self.adhocXpathvalues = data;
                    self.initializeAutoComplete(self.adhocXpathInput, data);
                });
            }
            self.autoCompleteCreated = true;
        },
        destroyAutoComplete: function (editor) {
            var self = this;
            if (!self.autoCompleteCreated) return;
            var input = $("#adhocsuggest-input", editor);
            if (input.hasClass("ui-autocomplete-input")) input.autocomplete("destroy");
        },
        remove: function () {
            var self = this;

            self.element.hide();
            self.element.empty();
        },
        loadTemplates: function () {
            var self = this,
            deferred = new $.Deferred();

            $.when(
                self.loadTemplate("frame", bizagi.getTemplate("bizagi.editor.component.editor.adhocsuggest").concat("#adhocsuggest-frame"))
            ).done(function () {
                deferred.resolve();
            });

            return deferred.promise();
        },
        validate: function (el) {
            var self = this,
            element,
            elValue,
            isLength = false

            element = $(el);
            elValue = element.val();

            if (!self.isLength(el) && elValue.length) {
                if (!element.hasClass('error')) {
                    element.addClass('error');
                }
                self.showError(el, self.Error);
                element.select();
            } else {
                element.removeClass('error');
                self.hideError(el);
                isLength = true;
            }

            return isLength;

        },
        isLength: function (el) {
            var self = this;

            self.Error = bizagi.localization.getResource("bizagi-editor-numberrange-error-lenght").replace('$number', self.charLimit);

            return (el.val().length <= self.charLimit);
        },
        "label click": function (el, event) {
            el.next().focus();
        },
        initializeAutoComplete: function (element, data) {
            var self = this;            
            element.autocomplete({
                minLength: 2,
                source: data,
                appendTo: ".bizagi_editor_component_properties",
                select: function (event, ui) {
                    var name = ui.item.label.indexOf('.') > -1 ? ui.item.label.split('.')[1] : ui.item.label ;
                    element.val(name);
                    var relatedEntity = self.inputValue ? self.inputValue.relatedEntity : null;                    
                    var newValue = { xpath: element.val(), relatedEntity: relatedEntity };
                    var options = {
                        typeEvent: bizagi.editor.component.properties.events.PROPERTIES_CHANGE_PROPERTY,
                        oldValue: self.inputValue,                        
                        newValue: newValue,
                        type: self.options.name,
                        refreshProperties: true,
                        removeDefaultDisplayName: true,
                        id: self.element.closest(".bizagi_editor_component_properties").data("id")
                    }
                    self.inputValue = newValue;
                    self.controller.publish("propertyEditorChanged", options);                                        
                    return false;
                },
                focus: function () {
                    return false;
                },
                change: function (event, ui) {
                    if (ui.item === null) {
                        element.val(event.currentTarget.value);
                        var relatedEntity = self.inputValue ? self.inputValue.relatedEntity : null
                        var newValue = element.val().length > 0 ? { xpath: element.val(), relatedEntity: relatedEntity } : undefined;
                        var options = {
                            typeEvent: bizagi.editor.component.properties.events.PROPERTIES_CHANGE_PROPERTY,
                            oldValue: self.inputValue,                            
                            newValue: newValue,
                            type: self.options.name,
                            refreshProperties: true,
                            removeDefaultDisplayName: true,
                            id: self.element.closest(".bizagi_editor_component_properties").data("id")
                        }                                               
                        self.inputValue = newValue;
                        self.controller.publish("propertyEditorChanged", options);
                    }
                    return false;
                }
            });                            
        },
        getDataSource: function () {
            var self = this;
            var def = new $.Deferred();
            var getDataSchema = bizagi.editor.communicationprotocol.factory.createProtocol({ protocol: "getadhocdataschema", adhocProcessId: self.adhocProcessId });

            $.when(getDataSchema.processRequest()).done(function (data) {                
                var values = [];
                if (data.properties) {
                    $.each(data.properties, function (key, val) {
                        values.push({ label: val.name, value: val.name });
                    });
                }
                def.resolve(values);
            });

            return def.promise();
        }        
    }
);