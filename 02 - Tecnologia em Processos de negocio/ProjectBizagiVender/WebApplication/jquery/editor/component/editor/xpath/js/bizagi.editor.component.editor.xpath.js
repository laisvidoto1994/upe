/*
@title: Editor (general) xpath
@authors: Rhony Pedraza
@date: 16-jul-12
*/
bizagi.editor.component.editor(
    "bizagi.editor.component.editor.xpath", {
        init: function (canvas, model, controller) {
            this._super(canvas, model, controller);
        },
        renderEditor: function (container, data) {
            var elEditor, self = this, xpathValue, lblRequired;

            self.map = self.retrieveMapSubproperties(data.subproperties);

            self.xpathValue = xpathValue = bizagi.editor.utilities.getXpathObject(data.value);
            self.propertiesNames = self.getSubpropertiesNames(data.subproperties, self.map);

            // Check readonly
            data.readonly = self.options["editor-parameters"].readonly || false;

            if (xpathValue === undefined) {
                data.value = {
                    baxpath: {
                        xpath: ""
                    }
                };
            } else {
                if (xpathValue === null) {
                    data.value = {
                        baxpath: {
                            xpath: ""
                        }
                    };
                } else {
                    data.value = xpathValue;
                }
            }

            self.inputValue = data.value;

            // choose an editor option
            switch (data["bas-type"]) {
                case "xpathfromentity":
                    // fix for getpropertiesmodelcommand                    
                    if(typeof(data.subproperties[0].property.value) != typeof(data.value)) {
                        data.value.baxpath.xpath = "";
                    }
                    
                    self.renderXpathFromEntity(container, data);
                    break;
                case "xpathtosimple":
                    self.renderXpathToSimple(container, data);
                    break;
                case "xpathtoentity":
                    self.renderXpathToEntity(container, data);
                    break;
                case "xpathtocollection":
                    self.renderXpathToCollection(container, data);
                    break;
                case "xpathtoentitytemplate":
                    self.renderXpathToCollection(container, data);
                    break;
                case "xpath":
                    self.renderXpath(container, data);
                    break;
                default:
                    elEditor = $.tmpl(self.getTemplate("frame"), data);
                    elEditor.appendTo(container);

                    lblRequired = $('label',elEditor);
                    self.addRequired(lblRequired);
                    break;
            }

            // fix value
            if (data.value.baxpath.xpath == "")
                data.value.baxpath.xpath = "xpath";
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
        renderXpath: function (container, data) {
            var elEditor, lblRequired, self = this;
            elEditor = $.tmpl(this.getTemplate("xpath"), data);
            elEditor.appendTo(container);

            lblRequired = $('label', elEditor);
            self.addRequired(lblRequired);
        },
        renderXpathToCollection: function (container, data) {
            var elEditor, lblRequired, self = this;
            elEditor = $.tmpl(this.getTemplate("xpathtocollection"), data);
            elEditor.appendTo(container);
            
            lblRequired = $('label',elEditor);
            self.addRequired(lblRequired);
        },
        renderXpathToEntity: function (container, data) {
            var elEditor, lblRequired, self = this;
            elEditor = $.tmpl(this.getTemplate("xpathtoentity"), data);
            elEditor.appendTo(container);
            
            lblRequired = $('label',elEditor);
            self.addRequired(lblRequired);
        },
        renderXpathToSimple: function (container, data) {
            var elEditor, lblRequired, self = this;
            elEditor = $.tmpl(this.getTemplate("xpathtosimple"), data);
            elEditor.appendTo(container);

            lblRequired = $('label',elEditor);
            self.addRequired(lblRequired);
        },
        renderXpathFromEntity: function (container, data) {
            var elEditor, lblRequired, self = this;
            elEditor = $.tmpl(this.getTemplate("xpathfromentity"), data);
            elEditor.appendTo(container);

            lblRequired = $('label',elEditor);
            self.addRequired(lblRequired);
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
                this.loadTemplate("frame", bizagi.getTemplate("bizagi.editor.component.editor.xpath").concat("#xpath-frame")),
                this.loadTemplate("xpathfromentity", bizagi.getTemplate("bizagi.editor.component.editor.xpath").concat("#xpath-xpathfromentity")),
                this.loadTemplate("xpathtosimple", bizagi.getTemplate("bizagi.editor.component.editor.xpath").concat("#xpath-xpathtosimple")),
                this.loadTemplate("xpathtoentity", bizagi.getTemplate("bizagi.editor.component.editor.xpath").concat("#xpath-xpathtoentity")),
                this.loadTemplate("xpathtocollection", bizagi.getTemplate("bizagi.editor.component.editor.xpath").concat("#xpath-xpathtocollection")),
                this.loadTemplate("xpath", bizagi.getTemplate("bizagi.editor.component.editor.xpath").concat("#xpath"))
            ).done(function () {
                deferred.resolve();
            });
            return deferred.promise();
        },

        // xpath
        ".xpath.xpath-image-world click": function (el, event) {
            var self = this;
            var xpathElement = self.element.find(".xpath-value");
            var position = self.positionXpathDialog(xpathElement);
            var options = {
                typeEvent: bizagi.editor.component.properties.events.PROPERTIES_SELECT_XPATH,
                oldValue: self.inputValue,
                position: position,
                type: self.options.name,
                subproperties: self.propertiesNames,
                xpathValue: self.options.value,
                //typeEditor: self.options["bas-type"],
                editor: self,
                editorParameters: self.options["editor-parameters"],
                id: self.element.closest(".bizagi_editor_component_properties").data("id")
            };

            self.controller.publish("propertyEditorChanged", options);
        },
        // xpath-from-entity
        ".xpath-from-entity.xpath-image-world click": function (el, event) {
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
        // xpath-to-simple
        ".xpath-to-simple.xpath-image-world click": function (el, event) {
            var self = this;
            var xpathElement = self.element.find(".xpath-value");
            var position = self.positionXpathDialog(xpathElement);
            var options = {
                typeEvent: bizagi.editor.component.properties.events.PROPERTIES_SELECT_XPATH_TO_SIMPLE,
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
        // xpath-to-entity
        ".xpath-to-entity.xpath-image-world click": function (el, event) {
            var self = this;
            var xpathElement = self.element.find(".xpath-value");
            var position = self.positionXpathDialog(xpathElement);
            
            var id = self.element.closest(".bizagi_editor_component_properties").data("id");

            self.controller.publish("propertyEditorChanged", {
                typeEvent: bizagi.editor.component.properties.events.PROPERTIES_SELECT_XPATH_TO_ENTITY,
                oldValue: self.inputValue,
                position: position,
                type: self.options.name,
                subproperties: self.propertiesNames,
                xpathValue: self.options.value,
                typeEditor: self.options["bas-type"],
                id: id
            });
        },
        // xpath-to-collection
        ".xpath-to-collection.xpath-image-world click": function (el, event) {
            var self = this;
            var xpathElement = self.element.find(".xpath-value");
            var position = self.positionXpathDialog(xpathElement);

            self.controller.publish("propertyEditorChanged", {
                typeEvent: bizagi.editor.component.properties.events.PROPERTIES_SELECT_XPATH_TO_COLLECTION,
                oldValue: self.inputValue,
                position: position,
                type: self.options.name,
                subproperties: self.propertiesNames,
                xpathValue: self.options.value,
                typeEditor: self.options["bas-type"],
                context: ((self.model["editor-parameters"] && self.model["editor-parameters"].context != null) ? self.model["editor-parameters"].context : null),
                id: self.element.closest(".bizagi_editor_component_properties").data("id")
            });
        },
        // xpath-defaukt-value
        ".biz-ico-default click": function (el, event) {
            var self = this;
            var xpathElement = self.element.find(".xpath-value");
            var position = self.positionXpathDialog(xpathElement);
            var defaultValue = false;
            var newValuebyDefault = {xpath:{},relatedentity:{}};
            if(self.options.subproperties){
                for(var i=0; i< self.model.subproperties.length; i++){
                    if(self.options.subproperties[i].property){
                        defaultValue = self.options.subproperties[i].property["default"];
                        if(defaultValue){
                            var subpropertyValue = self.options.subproperties[i].property.name.replace('xpath.','');
                            if(subpropertyValue == 'xpath'){
                                newValuebyDefault.xpath = defaultValue;
                            }else{
                                newValuebyDefault.relatedentity = defaultValue;
                            }
                        }
                    }
                }
            }

            if(!defaultValue){
                newValuebyDefault = undefined;
            }

            var options = {
                    typeEvent: bizagi.editor.component.properties.events.PROPERTIES_CHANGE_PROPERTY,
                    oldValue : this.inputValue,
                    newValue : newValuebyDefault,
                    data : newValuebyDefault,
                    type : this.options.name,
                    id : this.element.closest(".bizagi_editor_component_properties").data("id")
            };

            self.controller.publish("propertyEditorChanged", options);
            
            self.element.empty();
            self.options.value = newValuebyDefault;
            self.renderEditor(this.element, self.options);
        }
    }
);