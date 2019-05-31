/*
*   Name: BizAgi FormModeler Editor Element
*   Author: Alexander Mejia, Diego Parra
*   Comments:
*   -   This script will define basic stuff for element
*/

bizagi.editor.observableClass.extend("bizagi.editor.base.element", {

    exclusiveProperty: /[^.]*/
},
// Extend from base element and element validations (multiple inheritance)
    $.extend({}, bizagi.editor.base.elementValidations, {

        /*
        *   Constructor for base element
        */
        init: function (data, elementFactory, regenerateGuid) {

            var self = this;

            // Set element factory
            this.elementFactory = elementFactory;

            // Call base
            this._super();

            // Set properties
            this.properties = data && data.properties ? JSON.parse(JSON.encode(data.properties)) : {};

            // Initialize guid
            if (!data || !data.guid) {
                this.guid = Math.guid();
            } else if (regenerateGuid) {
                this.oldGuid = data.guid;
                this.guid = Math.guid();               
            } else {
                this.guid = data.guid;
            }

            this.updateLocalizableProperties();

            // Initialize properties, decorator and context menu models 
            self.propertyModel = {};
            self.decoratorModel = {};
            self.contextMenuModel = {};
            self.convertToModel = [];
            self["widget-guid"] = null;
            self.messageValidation = "";
            self.defaultDisplayName = {};
        },

        /*
        *   Returns if a element is ready or not
        *   Can be overriden in order to add deferreds or something
        *   by default all elements are ready
        */
        ready: function () {
            return true;
        },


        /*
        *   Set parent element
        */
        setParent: function (parent) {
            this.parent = parent;

            // Subscribe to refresh handler
            this.subscribe("refresh", function () { parent.publish("refresh"); });
        },

        /*
        *   Get parent element
        */
        getParent: function () {
            return this.parent;
        },

        /*
        *   Get properties
        */
        getProperties: function () {
            return this.properties;
        },

        /*
        *   Returns the JSON needed to render the element 
        */
        getRenderingModel: function () {
            var self = this;
            var defer = $.Deferred();

            $.when(self.getRenderingProperties())
                .done(function (renderingProperties) {
                    renderingProperties = renderingProperties || {};
                    defer.resolve({ properties: renderingProperties });
                });

            return defer.promise();
        },

        /*
        *   Returns the available properties to be displayed in the ribbon
        *   Must be overriden in inheritors, and this method is injected in the element factory
        */
        getRibbonProperties: function () {
            return [];
        },

        /*
        *   Extension method to add properties when creatin JSON for rendering
        */
        getRenderingProperties: function () {
            var self = this;
            var properties = {};

            // Set guid
            properties.guid = self.guid;
            properties.id = self.guid;
            properties.messageValidation = self.messageValidation;

            return properties;
        },

        /*
        *   Get properties model
        */
        getPropertiesModel: function () {
            var self = this;
            if (self.propertyModel) {
                return self.propertyModel.process(self);
            }

            return {};
        },

        /*
        * Gets indexed proeprties
        */
        getIndexedProperties: function () {
            var self = this;
            if (self.propertyModel) {
                return self.propertyModel.indexedProperties || {};
            }
            return {};
        },

        getPropertiesExternal: function () {
            var self = this;
            if (self.propertyModel) {
                if (self.propertyModel.externalProperties) {
                    return self.propertyModel.externalProperties;
                }
            }
            return {};
        },

        /*
        *   Get persistence model
        */
        getPersistenceModel: function () {
            var self = this;

            var result = {
                type: self.type,
                guid: self.guid,
                properties: self.filterDefaultValues(self.properties)
            };

            // If element is an userfield then guid is added to model
            if (self["widget-guid"]) { result["widget-guid"] = bizagi.editor.utilities.buildComplexReference(self["widget-guid"]); }

            return result;
        },

        getGridColumnModel: function () {
            var self = this;
            var defer = $.Deferred();

            var result = self.getPersistenceModel();

            $.when(self.resolveDisplayNameProperty())
                .done(function (displayName) {
                    if (self.resolveProperty("displayName")) { result.properties["displayName"] = self.resolveProperty("displayName"); }
                    else { result.properties["displayName"] = displayName; }
                    defer.resolve(result);
                });

            return defer.promise();
        },

        /*
        *   Get context menu model
        */
        getContextMenuModel: function () {
            var self = this;
            var contextMenuModel = self.contextMenuModel;

            var propertiesUsed = contextMenuModel.getProperties();
            for (var key in propertiesUsed) {
                contextMenuModel.assignProperty(key, self.resolveProperty(key));
            }

            return contextMenuModel;
        },

        /*
        *   Get convert to model
        */
        getConvertToModel: function () {
            var self = this;

            return bizagi.clone(self.convertToModel);
        },

        /*
        *
        */
        resolveType: function (renderType) {
            var self = this;

            if (self.Class.renderTypeMapping[renderType]) { return self.Class.renderTypeMapping[renderType]; }
            return renderType;
        },


        /*
        *   Get decorator model
        */
        getDecoratorModel: function () {
            var self = this;
            return self.decoratorModel;
        },


        /*
        * Return property base
        */
        getExclusiveProperty: function (propertyPath) {

            if (propertyPath) { return this.Class.exclusiveProperty.exec(propertyPath)[0]; }

        },
        /*
        *   Filter the default values to avoid when persisting
        */
        filterDefaultValues: function () {
            var self = this;
            var filteredProperties = bizagi.clone(self.properties);

            if (self.defaultValues) {
                $.each(self.defaultValues, function (key, defaultValue) {
                    var value = self.resolveProperty(key);

                    if (bizagi.editor.utilities.isBoolean(value)) {
                        value = bizagi.util.parseBoolean(value);
                        defaultValue = bizagi.util.parseBoolean(defaultValue);
                    }

                    if (bizagi.editor.utilities.objectEquals(value, defaultValue)) {
                        bizagi.editor.utilities.assignProperty(filteredProperties, key, undefined);
                    }
                });
            }

            return filteredProperties;
        },

        /*
        * Resolves control type
        */
        getControlType: function () { },

        /*
        *   Returns the element guid
        */
        getGuid: function () {
            var self = this;

            return self.guid;
        },

        /*
        *   Returns a valid xpath, resolves the xpath complex element
        */
        getXpath: function () {
            var self = this;
            var properties = self.properties;
            if (!properties || !properties.xpath) return null;

            // Resolves the complex xpath element
            return bizagi.editor.utilities.resolveComplexXpath(properties.xpath);
        },

        /*
        *   Returns a valid xpath, resolves the xpath complex element
        */
        getFilter: function () {
            var self = this;

            // Resolves the complex filter element
            return bizagi.editor.utilities.resolvefilterExpression(self.resolveProperty("data.filter")) || "";

        },

        /*
        *   Resolves a complex display name localization object
        **/
        getDisplayName: function () {
            var self = this;
            var properties = self.properties;
            return bizagi.editor.utilities.resolvei18n(properties.displayName);

        },

        /*
        *   Assign default property
        */
        assignDefaultProperty: function (propertyPath, defaultValue) {
            var self = this;
            // Assign the default value only when the current value is not empty, because we dont want to override persisted vaLues
            if (self.resolveProperty(propertyPath) === undefined || self.resolveProperty(propertyPath) === null) {
                self.assignProperty(propertyPath, defaultValue);
            }
        },

        /*
        *   Assign a property value
        */
        assignProperty: function (propertyPath, value, exclusive) {
            var self = this;

            bizagi.editor.utilities.assignProperty(self.properties, propertyPath, value, exclusive);
            if (propertyPath === "xpath") {
                if (!value) { self.removeDefaultDisplayName(); }
                if (self.xpathProperties.length > 0) { self.cleanXpathProperties(); }
            }
        },

        /*
        * Overrides properties
        */
        propertiesOverrides: function (propertiesOverrides) {
            var self = this;

            $.extend(self.properties, propertiesOverrides);

        },

        /*
        * Overrides required properties
        */
        requiredPropertiesOverrides: function (propertiesOverrides) {
            var self = this;
            var indexedProperties = self.getIndexedProperties();

            $.extend(self.requiredProperties, propertiesOverrides);

            for (var key in propertiesOverrides) {
                if (!propertiesOverrides.hasOwnProperty(key)) continue;
                var property = indexedProperties[key] || {};
                property.required = propertiesOverrides[key];
            }

        },

        /*
        *   Another alias just for readibility
        */
        setProperty: function (propertyPath, value) {
            this.assignProperty(propertyPath, value);
        },

        /*
        *   Resolve a property path
        */
        resolveProperty: function (propertyPath) {
            return bizagi.editor.utilities.resolveProperty(this.properties, propertyPath);
        },

        /*
        *   Resolve displayName property
        */
        resolveDisplayNameProperty: function () {
            var self = this;
            var def = new $.Deferred();

            self.asyncProperties = self.asyncProperties || [];

            if (self.resolveProperty("displayName")) {
                return self.resolveI18nProperty("displayName");
            }
            else if (self.defaultDisplayName && self.defaultDisplayName[bizagi.editorLanguage.key]) {
                return self.defaultDisplayName[bizagi.editorLanguage.key];
            }
            else {
                self.asyncProperties.push($.when(self.triggerGlobalHandler("getDefaultDisplayName", { element: self }))
                                            .pipe(function (data) {
                                                if (!data) {
                                                    def.resolve("");
                                                    return;
                                                }
                                                if (typeof data === "string") {
                                                    self.defaultDisplayName = self.defaultDisplayName || {};
                                                    self.defaultDisplayName["default"] = data;
                                                    def.resolve(data);
                                                }
                                                else {
                                                    self.defaultDisplayName = self.defaultDisplayName || {};
                                                    self.defaultDisplayName[bizagi.editorLanguage.key] = data.displayName;
                                                    self.defaultDisplayName["default"] = data.defaultValue;
                                                    def.resolve(data.displayName);
                                                }
                                            }));
                return def.promise();
            }
        },



        /*
        *   Another alias just for readibility
        */
        getProperty: function (propertyPath) {
            return this.resolveProperty(propertyPath);
        },

        /*
        *   Resolves a fixed value property
        */
        resolveFixedValueProperty: function (propertyPath) {
            var self = this;
            var value = self.resolveProperty(propertyPath);
            return (value !== undefined && value.fixedvalue !== undefined) ? value.fixedvalue : true;
        },

        /*
        *   Resolves a fixed value property
        */
        resolveI18nProperty: function (propertyPath) {
            var self = this;
            var value = self.resolveProperty(propertyPath);
            var result = "";

            if (value && value["i18n"]) {
                if (bizagi.editorLanguage.key === "default") { result = value["i18n"]["default"]; }
                else if (value["i18n"]["languages"]) { result = value["i18n"]["languages"][bizagi.editorLanguage.key] || value["i18n"]["default"]; }
                else { result = value["i18n"]["default"]; }
            }

            return result;
        },

        /*
        *   Resolves orientation mode
        */
        resolveIsRightToLeftProperty: function () {

            var self = this;
            return self.isDefaultValueinHierarchicalChain(self, "orientation") || ((bizagi.editorLanguage && bizagi.util.parseBoolean(bizagi.editorLanguage.IsRightToLeft)) ? "rtl" : "ltr");
        },

        /*
        *  Checks if the value property is its default value, in self or hierarchical chain (parent)
        *  return value  
        */
        isDefaultValueinHierarchicalChain: function (element, property) {
            var self = this;
            var result = false;

            if (!element || typeof element.getDefaultValueProperty !== "function") { return result; }

            if (element.getDefaultValueProperty(property) === element.getProperty(property)) {
                result = self.isDefaultValueinHierarchicalChain(element.getParent(), property);
            }
            else { result = element.getProperty(property); }

            return result;
        },

        /*
        *   Get default property
        */
        getDefaultValueProperty: function (property) {
            var self = this;

            var defaultValue = function (node) {
                if (property === "maxlength") { return node.getMaxLength(); }
                return null;
            };

            var xpath = self.properties["xpath"];
            if (xpath) {
                xpath = bizagi.editor.utilities.resolveComplexXpath(xpath);
                return self.defaultValues[property] || self.triggerGlobalHandler("getNodeInfo", { property: property, xpath: xpath, callback: defaultValue });

            }

            return self.defaultValues[property];
        },

        /*
        *   Returns default displayName
        */
        getDefaultLocalizableProperty: function (property) {
            return (property === "displayName") ? this.defaultDisplayName["default"] : "";
        },

        /*
        *   Returns true if the property has a design value
        */
        hasDesignValue: function (property) {
            return this.designValueProperties[property] || false;
        },

        /*
        *   Returns true if the property is a visual property (
        */
        isVisualProperty: function (propertyPath) {
            return this.propertyModel.indexedProperties ? (this.propertyModel.indexedProperties[propertyPath] || false) : false;
        },

        /*
        * Returns true if the bas type property is localizable-string 
        */
        isLocalizableProperty: function (propertyPath) {
            var self = this;

            var dataProperty = self.propertyModel.indexedProperties[propertyPath];

            if (!dataProperty || !dataProperty["bas-type"]) { return false; };
            return (dataProperty["bas-type"] === "localizable-string" || dataProperty["bas-type"] === "localizablestring");
        },

        /*
        * Returns if the element is internal 
        */
        isInternal: function () {
            return false;
        },

        /*
        *   Returns true if the property is required
        */
        isRequiredProperty: function (propertyPath) {
            var self = this;
            var sep = ".";

            if (!self.requiredProperties) return false;

            var parts = propertyPath.split(".");
            var property = parts[0];
            for (var i = 0; i < parts.length; i++) {
                if (self.requiredProperties[property]) { return true; }
                if (parts[i + 1]) { property = property + sep + parts[i + 1]; }
            }

            return false;
        },

        /*
        *   Returns true if the property is dependent
        */
        isDependentProperty: function (property) {
            var self = this;

            if (!self.requiredDependentProperties) return false;

            for (var key in self.requiredDependentProperties) {
                if (self.requiredDependentProperties[key].property === property || key === property) return true;

            }

            return false;
        },

        /*
        * Returns true if the element is editable 
        */
        isEditable: function () {
            var self = this;

            function check() {
                if (self.resolveProperty("editable.fixedvalue") === false ||
                    self.resolveProperty("editable.fixedvalue") === "false") { return false; }
                else { return true; }
            }


            if (self.parent != undefined) {
                return self.parent.isEditable() && check();
            }

            return check();
        },

        /*
        * Returns true if the xpath is an attribute of parameter entity
        */
        isParametricAttribute: function (xpath) {
            var self = this;
            xpath = xpath || "";
            xpath = xpath + bizagi.editor.utilities.resolveComplexXpath(self.properties["xpath"]);

            var node = self.triggerGlobalHandler("getNodeInfo", { xpath: xpath });
            return node ? (node.parentIsParametricEntity() && $.inArray(node.renderType, ["cascadingcombo", "combo", "suggest"]) == -1) : false;

        },
        /*
        *  Returns true if elements is a text
        */
        isText: function () {
            return (this.type === "text" || this.type === "columntext" || this.type === "offlinetext");
        },

        /*
        *  Returns true if elements is a hidden
        */
        isHidden: function () {
            return (this.type === "hidden" || this.type === "columnhidden" || this.type === "offlinehidden");
        },

        /*
        *  Returns true if elements is a grid
        */
        isGrid: function () {
            return (this.type === "grid");
        },

        /*
        * Restores to default displayName
        */
        restoreDefaultDisplayName: function () {
            var self = this;

            if (self.properties["displayName"] && typeof self.properties["displayName"] === "string") {
                self.assignProperty("displayName", undefined);
            }
        },

        /*
        * Removes default displayName cache
        */
        removeDefaultDisplayName: function () {
            this.defaultDisplayName = {};
        },

        /*
        *   Returns form validations result 
        */
        getFormValidations: function () {
            return this.formValidations;
        },

        /*
        *   Returns form parent 
        */
        getFormParent: function () {
            return this.parent.getFormParent();
        },

        /*
        *   Returns validations result 
        */
        getValidations: function () {
            return this.validations;
        },

        /*
        *   Removes validations in element
        */
        removeValidations: function () {
            var self = this;

            // clean messageValidation property
            self.messageValidation = "";

            // clean properties model
            self.propertyModel.model.validations = undefined;

        },

        /*
        *   Publish a global event that the view will replicate
        */
        triggerGlobalHandler: function (eventType, data) {
            var self = this;

            if (self.parent)
                return self.parent.triggerGlobalHandler(eventType, data);

            return null;
        },

        /*
        * Clean properties
        */
        cleanXpathProperties: function () {
            var self = this;
            var defaultValues = self.defaultValues || {};

            $.each(self.xpathProperties, function (_, propertyPath) {
                bizagi.editor.utilities.assignProperty(self.properties, propertyPath, defaultValues[propertyPath]);
            });
        },

        /*
        *   Check if the current element is inside a nested form
        */
        isContainedInNestedForm: function () {
            var self = this;

            // If the element has no parent, we are in the root element
            if (!self.parent) return false;

            // If the parent is nested form, this element is contained in a nested form
            if (self.parent.type === "nestedform") { return self.parent.getXpath(); }

            // If the element has a parent, then check in it recursively
            return self.parent.isContainedInNestedForm();
        },

        /*
         *   Check if the current element is inside a nested form
         */
        getXpathNestedForm: function () {
            var self = this;

            // If the element has no parent, we are in the root element
            if (!self.parent) {return false;}

            // If the parent is nested form, return xpath parent
            if (self.parent.type === "nestedform") { return self.parent.properties.xpath; }

            // If the element has a parent, then getXpathNestedForm recursively
            return self.parent.getXpathNestedForm();
        },

        /*
        * This method updates the localizable properties
        * because the current guid of control was regenerated
        */
        updateLocalizableProperties: function () {
            var self = this;

            var localizableProperties = self.getLocalizableProperties();
            var properties = self.properties;

            for (var i = 0, l = localizableProperties.length; i < l; i++) {
                var lProperty = localizableProperties[i];

                if (properties[lProperty]) {
                    if (typeof properties[lProperty] == "object") {
                        var i18N = properties[lProperty].i18n;
                        i18N.uri = self.guid + ":" + lProperty;
                    }
                }
            }
        },

        /*
        * Determine if the control is visible in the form.
        * The controls are always visibles in forms designer (in template designer is different)
        */
        isVisible: function () {
            return true;
        }

    }));



