/*
@title: Editor adhocattribute
@authors: Jose Aranzazu
*/
bizagi.editor.component.editor(
    "bizagi.editor.component.editor.adhocattribute", {
        init: function (canvas, model, controller) {
            this._super(canvas, model, controller);
        },
        renderEditor: function (container, data) {
            var self = this, elEditor, lblRequired;                        

            self.inline = true;

            // Check readonly
            data.readonly = self.options["editor-parameters"].readonly || false;

            elEditor = $.tmpl(self.getTemplate("frame"), data);

            elEditor.appendTo(container);

            self.inputValue = data.value;

            $.when(data["editor-parameters"].attribs).done(function (result) {
                self.attributesMetadata = result;
                var miCombo = new self.uiControls.comboBox(
                {
                    uiEditor: self,
                    uiContainer: $('.ui-control-editor', elEditor),
                    uiValues: self.getDataForCombo(data.value),
                    uiInline: self.inline,
                    uiInitValue: -1,
                    onChange: function (elValue, event) {
                        self.responseChangeCombo(elValue, event, self);
                    }
                });
            });            
        }, 
        loadTemplates: function () {
            var deferred = $.Deferred();
            $.when(
                this.loadTemplate("frame", bizagi.getTemplate("bizagi.editor.component.editor.adhocattribute").concat("#adhocattribute-frame"))
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
        },
        ".xpath-from-adhoc-entity.xpath-image-world click": function (el, event) {
            var self = this;
            var xpathElement = self.element.find(".xpath-value");
            var position = self.positionXpathDialog(xpathElement);
            var options = {
                typeEvent: bizagi.editor.component.properties.events.PROPERTIES_SELECT_XPATH_FROM_ENTITY,
                oldValue: self.inputValue,
                position: position,
                type: self.options.name,
                subproperties: self.propertiesNames,
                xpathValue: self.options.value,
                typeEditor: self.options["bas-type"],
                editor: self,
                editorParameters: self.options["editor-parameters"],
                id: self.element.closest(".bizagi_editor_component_properties").data("id")
            };

            self.controller.publish("propertyEditorChanged", options);
        },
        getDisplayAttribute: function (attributeId) {
            var self = this;            
            var currentAttrib = self.attributesMetadata.filter(function (attrib) {
                return attrib.attribGuid === attributeId;
            })[0];
            return currentAttrib.displayName;
        },
        getDataForCombo: function (selectedItem) {
            var self = this;
            //var uiValues = [{ label: "Select any attribute...", value: "" }];
            var uiValues = [];
            for (var i = 0; i < self.attributesMetadata.length; i++) {
                var item = { label: self.attributesMetadata[i].displayName, value: self.attributesMetadata[i].attribGuid };
                switch (self.attributesMetadata[i].attribType.type) {
                    case 15:
                        item.style = "ui-bizagi-type-attribute-string";
                        break;
                    case 7:
                        item.style = "ui-bizagi-type-attribute-number";
                        break;
                    case 8:
                        item.style = "ui-bizagi-type-attribute-currency";
                        break
                    case 5:
                        item.style = "ui-bizagi-type-attribute-boolean";
                        break;
                    case 12:
                        item.style = "ui-bizagi-type-attribute-date";
                        break;
                    default:
                        item.style = "ui-bizagi-type-attribute";
                        break;
                }
                if (item.value === selectedItem)                
                    item.selected = true;
                uiValues.push(item);
            }
            if (!selectedItem) {
                uiValues[0].selected = true; //Select the first column
                self.controller.publish("propertyEditorChanged", { typeEvent: bizagi.editor.component.properties.events.PROPERTIES_CHANGE_PROPERTY, oldValue: "", newValue: uiValues[0].value, data: uiValues[0].value, type: self.options.name, id: self.element.closest(".bizagi_editor_component_properties").data("id") });
            }
            return uiValues;
        },
        responseChangeCombo: function (elValue, event, self) {
            var oldValueProp, newValueProp;
            oldValueProp = self.inputValue;
            newValueProp = elValue;
            self.controller.publish("propertyEditorChanged", {
                typeEvent: bizagi.editor.component.properties.events.PROPERTIES_CHANGE_PROPERTY,
                oldValue: oldValueProp,
                newValue: newValueProp,
                data: newValueProp,
                type: self.options.name,
                id: self.element.closest(".bizagi_editor_component_properties").data("id")
            });
            self.inputValue = newValueProp;
        }
    }
);