/*
@title: Editor (general) xpathmultiple
@authors: Christian Collazos
@date: 29-may-13
*/
bizagi.editor.component.editor(
    "bizagi.editor.component.editor.xpathmultiple", {
        init: function (canvas, model, controller) {
            this._super(canvas, model, controller);
        },
        renderEditor: function (container, data) {
            var elEditor, self = this, xpathValue, lblRequired;

            self.map = self.retrieveMapSubproperties(data.subproperties);

            self.xpathValue = xpathValue = data.value || [];
            self.propertiesNames = self.getSubpropertiesNames(data.subproperties, self.map);
            data.hasXpaths = (data.value && data.value.length > 0) ? true : false;

            // Check readonly
            data.readonly = self.options["editor-parameters"].readonly || false;

            self.inputValue = data.value;

            if (xpathValue.length == 0) {
                data.value = {
                    baxpath: {
                        xpath: ""
                    }
                };
            }
           
            elEditor = $.tmpl(self.getTemplate("xpathframe"), data);
            elEditor.appendTo(container);

            lblRequired = $('label', elEditor);
            self.addRequired(lblRequired);                 
  
        },
        getSubpropertiesNames: function (subproperties, map) {
            var hash = {}, name, subproperty;

            if (!subproperties) return hash;

            for (var i = 0; i < subproperties.length; i++) {
                subproperty = subproperties[i].property;
                name = subproperty.name.split(".")[1];
                hash[name] = subproperty.name;
            }
            return hash;
        },
        retrieveMapSubproperties: function (subproperties) {
            var i, map = {}, subproperty;

            // When rendering child editors
            if (!subproperties) return map;

            for (i = 0; i < subproperties.length; i++) {
                subproperty = subproperties[i].property;
                map[subproperty.name] = i;
            }
            return map;
        },        
        remove: function () {
            this.element.hide();
            this.element.empty();
        },
        positionXpathDialog: function (xpathElement) {
            var offset = xpathElement.offset();

            return {
                top: offset.top + xpathElement.outerHeight(true),
                left: offset.left
            };
        },
        loadTemplates: function () {
            var deferred = $.Deferred();
            $.when(
                this.loadTemplate("xpathframe", bizagi.getTemplate("bizagi.editor.component.editor.xpathmultiple").concat("#xpathmultiple-xpathframe"))
            ).done(function () {
                deferred.resolve();
            });
            return deferred.promise();
        },

        // xpath-frame
        ".xpath-select click": function (el, event) {
            var self = this;
            var xpathElement = self.element.find(".fileprint-item-container");
            var position = self.positionXpathDialog(xpathElement);
            var options = {
                typeEvent: bizagi.editor.component.properties.events.PROPERTIES_SELECT_XPATH_MULTIPLE,
                oldValue: self.inputValue,
                position: position,
                type: self.options.name,
                subproperties: self.propertiesNames,
                xpathValue: self.options.value,
                typeEditor: self.options["bas-type"],
                editorParameters: self.options["editor-parameters"],
                id: self.element.closest(".bizagi_editor_component_properties").data("id")
            };

            if (self.options.hasOwnProperty("exclusive")) {
                options = $.extend({}, options, { exclusive: self.options.exclusive });
            }

            self.controller.publish("propertyEditorChanged", options);
        },
        // xpath-default-value
        ".biz-ico-default click": function (el, event) {
            var self = this;
            var xpathElement = self.element.find(".fileprint-item-container");
            var position = self.positionXpathDialog(xpathElement);
            var defaultValue = false;
            var newValuebyDefault = { xpath: {}, relatedentity: {} };
            if (self.options.subproperties) {
                for (var i = 0; i < self.model.subproperties.length; i++) {
                    if (self.options.subproperties[i].property) {
                        defaultValue = self.options.subproperties[i].property["default"];
                        if (defaultValue) {
                            var subpropertyValue = self.options.subproperties[i].property.name.replace('xpath.', '');
                            if (subpropertyValue == 'xpath') {
                                newValuebyDefault.xpath = defaultValue;
                            } else {
                                newValuebyDefault.relatedentity = defaultValue;
                            }
                        }
                    }
                }
            }

            if (!defaultValue) {
                newValuebyDefault = undefined;
            }

            var options = {
                typeEvent: bizagi.editor.component.properties.events.PROPERTIES_CHANGE_PROPERTY,
                oldValue: this.inputValue,
                newValue: newValuebyDefault,
                data: newValuebyDefault,
                type: this.options.name,
                id: this.element.closest(".bizagi_editor_component_properties").data("id")
            };

            self.controller.publish("propertyEditorChanged", options);

            self.element.empty();
            self.options.value = newValuebyDefault;
            self.renderEditor(this.element, self.options);
        }, 
        // xpath-delete-item
        ".interface-image-rule-delete click": function (el, event) {
                var self = this;
                var currentValue = self.inputValue;
                var deleteId = el[0].id;
                deleteId=Number(deleteId.substring(7,8));
                currentValue.splice(deleteId,1);
                if(currentValue.length == 0){
                    currentValue=undefined;
                }
                
                var xpathElement = self.element.find(".fileprint-item-container");
                var position = self.positionXpathDialog(xpathElement);
                var defaultValue = false;
                var newValuebyDefault = { xpath: {}, relatedentity: {} };
               

                if (!defaultValue) {
                    newValuebyDefault = undefined;
                }

                var options = {
                    typeEvent: bizagi.editor.component.properties.events.PROPERTIES_CHANGE_PROPERTY,
                    oldValue: this.inputValue,
                    newValue: currentValue,
                    data: newValuebyDefault,
                    type: this.options.name,
                    id: this.element.closest(".bizagi_editor_component_properties").data("id")
                };

                self.controller.publish("propertyEditorChanged", options);

                self.element.empty();
                self.options.value = currentValue;
                self.renderEditor(this.element, self.options);
     
        },
    }
);