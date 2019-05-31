/*
*   Name: BizAgi FormModeler Editor Properties
*   Author: Alexander Mejia, Diego Parra (refactor)
*   Comments:
*   -   This script will define basic stuff for editor properties
*/

bizagi.editor.observableClass.extend("bizagi.editor.component.properties.model", {

    // Hash properties related with rules    
    rulePropertiesHash: [
        "defaultvalue.rule",
        "defaultvalue.rule90",
        "daterange.maxrule",
        "daterange.maxrule90",
        "daterange.minrule",
        "daterange.minrule90",
        "buttonrule",
        "buttonrule.rule",
        "buttonrule.rule90",
        "data.filter.rule",
        "editable.rule",
        "editable.rule90",
        "visible.rule",
        "visible.rule90",
        "required.rule",
        "required.rule90"
    ]
}, {
    /*
    *   Constructor, initialize a model with a static definition
    */
    init: function (definition) {
        var self = this;

        // Call base
        this._super();

        if (definition) {
            self.disableProperties = definition.disableProperties;
            this.initModel(definition);
        }


        self.communicationProtocol = bizagi.editor.communicationprotocol.factory;
    },

    /*
    *   Initializes the model with the control definition
    */
    initModel: function (definition) {
        var self = this;
        var model = self.model = {
            idRender: '',
            elements: []
        };

        // create external definitions for renders
        self.externalProperties = self.populateExternalProperties(definition);

        // Create an indexed view fo the properties
        self.indexedProperties = {};

        self.designProperties = definition.design.properties;
        var visual = definition.design.visual["property-box"];

        // Process tabs
        if (visual.tabs) {
            var tabs = [];
            $.each(visual.tabs, function (i, tab) {
                var item = {
                    id: tab.id,
                    caption: bizagi.editor.utilities.resolveInternalResource(tab.caption)
                };

                // Process subelements
                item.elements = self.initElements({ elements: tab.elements });
                tabs.push(item);
            });
            model.elements.push({ tabs: tabs });
        } else {
            // TODO: Still don't know what to do when there are no tabs	
            // I think there will no be tabs tag, instead we will have an elements tag
            model.elements = self.initElements({ elements: visual.elements });
        }
    },

    /*
    *   Process a set of sub-elements
    */
    initElements: function (params) {
        var self = this;
        var elements = params.elements || [];
        var prefix = params.prefix;
        var applyIndexing = params.applyIndexing || true;
        var result = [];

        applyIndexing = applyIndexing !== undefined ? applyIndexing : true;

        // Iterate over elements
        $.each(elements, function (i, element) {
            var type = element.type || elements[i].type;
            var item = null;
            if (type == "property") {

                if (self.propertyIsEnabled(element.value)) {
                    // Normal property
                    var property = self.getDesignProperty(element.value);
                    if ($.isEmptyObject(property)) {
                        throw "The visual property (" + element.value + ") doesn't exist. External properties: " + JSON.stringify(self.externalProperties);
                    }
                    var name = element.value || element.name;
                    item = {
                        "bas-type": property["bas-type"] || element["bas-type"],
                        "name": prefix ? prefix + "." + name : name,
                        "required": property.required || {},
                        "caption": bizagi.editor.utilities.resolveInternalResource(property.caption) || element.caption,
                        "user-editable": property["user-editable"] || element["user-editable"],
                        "value": element.dataValue || null,
                        "editor-parameters": property["editor-parameters"] ? self.processEditorParameters(property) : (element["editor-parameters"] || {}),
                        "default": property["default"],
                        "deprecated": property["deprecated"] || false
                    };

                    // Add to indexed properties
                    if (applyIndexing) self.indexedProperties[item.name] = item;

                    // Process suproperties for properties
                    if (property.subproperties) {
                        self.processSubproperties(item.name, property, item);
                    }
                }

            } else {
                // Groups and categories
                item = {
                    id: element.id,
                    caption: bizagi.editor.utilities.resolveInternalResource(element.caption)
                };
                if (element.exclusive !== undefined) {
                    $.extend(item, { exclusive: true });
                }
                if (element.visibility !== undefined) {
                    $.extend(item, { visibility: element.visibility });
                }
            }

            // If the property was processed
            if (item) {
                // Process sub-elements if they exist
                if (element.elements) item.elements = self.initElements({ elements: element.elements });

                // Add to result
                var wrapper = {};
                wrapper[type] = item;
                result.push(wrapper);
            }
        });

        return result;
    },

    getDesignProperty: function (name) {
        var self = this;
        if (name.indexOf(".") === -1) {
            return self.designProperties[name] || {};
        } else {
            // Search in subproperties
            var parts = name.split(".");
            if (parts.length > 1) {
                var property = self.designProperties[parts[0]];
                return property.subproperties[parts[1]];
            } else {
                return {};
            }
        }
    },


    /*
    *   Process editor parameters
    */
    processEditorParameters: function (property) {
        var self = this;
        var attr;
        var hasRule = false;
        var editorParameters;

        // Check if a rule attribute has been found
        for (attr in property["editor-parameters"]) {
            var attribute = property["editor-parameters"][attr];
            if (attribute.rule) {
                hasRule = true;
                break;
            }
        }

        // If the parameters contains a rule parameter
        if (hasRule) {
            editorParameters = {};
            for (attr in property["editor-parameters"]) {
                if (property["editor-parameters"][attr].rule) {
                    var rule = property["editor-parameters"][attr].rule;
                    if (rule.search(/^<.*>$/) != -1) {
                        rule = rule.substring(1, rule.length - 1);
                        // parse
                        var tokens = rule.split(":");
                        if (tokens.length > 1) {
                            if (tokens[0] == "design") {
                                var prop = tokens[1]; // related property
                                if (tokens[2] === undefined) { // select value or default
                                    var designProp = self.designProperties[prop];
                                    editorParameters[attr] = {
                                        value: ((designProp.value !== undefined | designProp.value != null) ? designProp.value : (designProp["default"] === "true") ? true : false),
                                        rule: (property["editor-parameters"][attr].rule)
                                    };
                                }
                            }
                        }
                    }
                } else {
                    editorParameters[attr] = property["editor-parameters"][attr];
                }
            }

        } else {
            editorParameters = property["editor-parameters"];
        }

        return editorParameters;
    },

    /*
    *   Process element subproperties
    */
    processSubproperties: function (prefix, property, item) {
        var self = this,
            subpropertyName, subproperty, newProperty,
            subproperties = [];

        // Pre-process subproperties before adding them to the model
        for (subpropertyName in property.subproperties) {
            subproperty = property.subproperties[subpropertyName];

            // Create new property based on subproperty data
            newProperty = {
                "value": subpropertyName,
                "type": "property"
            };
            self.designProperties[subpropertyName] = subproperty;

            // Push to array
            subproperties.push(newProperty);
        }

        // Process subproperties into the model
        item.subproperties = self.initElements({ elements: subproperties, applyIndexing: false, prefix: prefix });
    },

    /*  
    *   Combines the static model with the current data and returns the properties model
    */
    process: function (element) {
        var self = this;

        // Set identifier
        self.model.idRender = element.guid;
        self.model.element = element;

        // Iterate through properties
        for (var key in self.indexedProperties) {
            var indexedProperty = self.indexedProperties[key];

            // Initialize value 
            indexedProperty.value = null;

            if (self.isForm(indexedProperty)) { self.updateFormInModel(element, indexedProperty); }
            if (self.isLayoutContainer(indexedProperty)) { self.updateLayoutProperty(element, key); }
            if (element.isText() && self.isSpecialProperty(indexedProperty.name)) { self.updateDefaultValueProperty(element, indexedProperty, key); }
            if (self.isActiveContainerProperty(indexedProperty)) { self.updateActiveContainerProperty(element, indexedProperty); }
            self.updatePropertyModel(element, indexedProperty, key);
        }

        return self.model;
    },

    /*
    *   Checks if the property is a form property
    */
    
    isForm: function (indexedProperty) {
        return (indexedProperty["bas-type"] === "form" ||
                 indexedProperty["bas-type"] === "searchform");
    },

    /*
    *   Checks if the property is a layout property
    */
    isLayoutContainer: function (indexedProperty) {
        return (indexedProperty["bas-type"] === "change-layout" ||
                 indexedProperty["bas-type"] === "changelayout");
    },

    /*
    *   Checks if the property is localizable
    */
    isLocalizableProperty: function (indexedProperty) {
        return (indexedProperty["bas-type"] === "localizable-string" ||
                 indexedProperty["bas-type"] === "localizablestring");
    },


    /*
    * Checks if the property is active container
    */
    isActiveContainerProperty: function (indexedProperty) {
        return (indexedProperty["bas-type"] === "active-container" ||
                indexedProperty["bas-type"] === "activecontainer");
    },

    /*
    *   Updates form property in this model
    */
    updateFormInModel: function (element, indexedProperty) {
        var self = this,
            loadRelatedFormsProtocol,
            properties = element.properties;

        if ((properties && typeof properties.xpath === "object") || !element.isRequiredProperty("xpath")) {

            var xpath = bizagi.editor.utilities.resolveComplexXpath(properties.xpath);
            var relatedEntity = bizagi.editor.utilities.resolveRelatedEntityFromXpath(properties.xpath);

            loadRelatedFormsProtocol = self.communicationProtocol.createProtocol({
                protocol: "relatedforms",
                xpath: element.triggerGlobalHandler("getContextXpath", { xpath: xpath }),
                relatedEntity: relatedEntity,
                context: indexedProperty["bas-type"],
                isScopeAttribute: element.triggerGlobalHandler("getNodeInfo", { xpath: xpath, callback: function (node) { return node.isScopeAttribute; } })
            });

            indexedProperty.relatedForms = loadRelatedFormsProtocol.processRequest();            

        } else {
            indexedProperty.relatedForms = [];
        }
    },


    /*
    *   Updates changelayput property in this model
    */
    updateLayoutProperty: function (element, key) {
        var value = { elements: [] };

        if (element.elements) {
            $.each(element.elements, function (index, child) {
                var width = child.properties.width || "0%";
                value.elements.push({ index: index, width: width });
            });
        }

        element.properties[key] = value;
    },

    /*
    *   Sets a value in the fixed property model, in order to mix it with values
    */
    updatePropertyModel: function (element, indexedProperty, key) {
        var self = this;
        var factory = bizagi.editor.component.properties.commands.factory;

        indexedProperty.show = true;
        indexedProperty.notShow = undefined;

        // Update rule property value
        if (self.isRuleProperty(key)) {
            var ruleCommand = factory.createRuleCommand({ command: key, element: element, key: key });
            ruleCommand.execute();
        }

        var propertyCommand = factory.createCommand({ command: key, element: element, key: key, indexedProperty: indexedProperty });
        if (propertyCommand) {
            propertyCommand.execute();
        }

        // Set property model value
        var value = bizagi.editor.utilities.resolveProperty(element.properties, key);
        if (bizagi.editor.utilities.isObject(value)) {
            value = bizagi.clone(value);
            value = self.resolveObjectProperty(indexedProperty, value);
        }

        indexedProperty.value = value;
        if (!indexedProperty.value && indexedProperty.deprecated && bizagi.override.enableDeprecatedProperties) {
            indexedProperty.show = false;
        }
    },


    /*
    * Sets default attribute for property 
    */
    updateDefaultValueProperty: function (element, indexedProperty, key) {
        indexedProperty["default"] = element.getDefaultValueProperty(key);
    },
    /*
    *
    */
    updateActiveContainerProperty: function (element, indexedProperty) {
        var elements = element.getChildren();
        indexedProperty["editor-parameters"] = indexedProperty["editor-parameters"] || {};
        indexedProperty["editor-parameters"]["values"] = (elements.length > 0) ?
            $.map(elements, function (el, _) {
                return { label: el.resolveDisplayNameProperty(), value: el.guid, icon: "tab" };
            }) : [];
    },

    resolveObjectProperty: function (indexedProperty, value) {
        var self = this;

        if (self.isLocalizableProperty(indexedProperty)) { value = self.resolveResource(value["i18n"], bizagi.editorLanguage.key); }
        return value;
    },

    /*
    *   Resolve needed resources
    */
    resolveResource: function (element, language) {
        if (!element) return "";
        if (typeof (element) == "string") return element;

        // Check if there is resource for the current language
        language = language || bizagi.language;

        if (element.languages) {

            while (element.languages[language] == null && language.length > 0) {

                // Retry with a lesser language
                var languageParts = language.split("-");
                languageParts.pop();
                language = languageParts.join("-");
            }

            if (language.length == 0 || element.languages[language] == null) {
                // Return default language
                return element["default"];
            }
        }
        else { return element["default"]; }

        return element.languages[language];
    },

    /*
    * Returns true if the property requires special treatment
    */
    isSpecialProperty: function (property) {
        return (property === "maxlength");
    },


    populateExternalProperties: function (definition) {
        return {
            renderCaption: bizagi.editor.utilities.resolveInternalResource(definition.display)
        };
    },

    /*
    *  get element caption from xpath
    */
    getCaption: function (xpath) {
        var self = this;

        if (self.indexedProperties[xpath] && self.indexedProperties[xpath].caption) {
            return self.indexedProperties[xpath].caption;
        }

        return xpath;
    },

    /*
    * Returns true if the property is related with expression rules
    */
    isRuleProperty: function (property) {
        var self = this;
        return (self.Class.rulePropertiesHash.indexOf(property) >= 0);
    },

    /*
    * Return true if the property is enabled
    */
    propertyIsEnabled: function (property) {
        var self = this;

        return ($.inArray(property, self.disableProperties) < 0);
    }

});