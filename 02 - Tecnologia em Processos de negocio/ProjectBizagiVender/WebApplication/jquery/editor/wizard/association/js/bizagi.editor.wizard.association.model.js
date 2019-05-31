/*
*   Name: BizAgi Editor Wizard Association Model Model
*   Author: Alexander Mejia 
*   Comments:
*   -   This script will define basic stuff for wizard association model 
*    
*/

bizagi.editor.observableClass.extend("bizagi.editor.wizard.association.model", {}, {

    /*
    *   Constructor
    */
    init: function (data) {
        var self = this;
        data = data || {};
        
        self.elementGuid = data.guid || Math.guid();        
        self.data = data;
        self.leftProperties = {};
        self.rightProperties = {};
        self.properties = {};
        self.xpathProperty = null;      

        // Process model
        self.processData(data);
    },

    /*
    *   Process the model to populate columns array
    */
    processData: function (data) {
        var self = this;
        var leftProperties = self.getLeftPropertiesModel();
        var rightProperties = self.getRightPropertiesModel();

        for (var i = 0, l = leftProperties.length; i < l; i++) {
            var leftProperty = leftProperties[i];
            leftProperty.value = data[leftProperty.property];
            leftProperty.displayValue = self.getDisplayValue(leftProperty);
            self.leftProperties[leftProperty.property] = leftProperty;
            self.properties[leftProperty.property] = leftProperty;
        }

        for (i = 0, l = rightProperties.length; i < l; i++) {
            var rightProperty = rightProperties[i];
            rightProperty.value = data[rightProperty.property];
            rightProperty.displayValue = self.getDisplayValue(rightProperty);
            self.rightProperties[rightProperty.property] = rightProperty;
            self.properties[rightProperty.property] = rightProperty;
        }
    },

    /*
    *
    */
    getDisplayValue: function (property) {
        if (property.value) {
            if (property.editor == "xpatheditor") { return bizagi.editor.utilities.resolveComplexXpath(property.value); }
            if (property.editor == "filter") { return bizagi.editor.utilities.resolvefilterExpression(property.value); }
            if (property.editor == "localizable") { return bizagi.editor.utilities.resolvei18n(property.value); }
        }
    },

    /*
    * This method updates a property in the model
    */
    updateProperty: function (value, displayValue, propertyName) {
        var self = this;

        var property = self.properties[propertyName];
        if (property) {
            property.value = value;
            property.displayValue = displayValue;
            self.cleanProperties(propertyName);
        }
    },

    /*
    * This method cleans dependent properties
    */
    cleanProperties: function (propertyName) {
        var self = this;

        if (propertyName == "leftxpath") {
            var leftProperties = self.getLeftPropertiesModel();
            for (var i = 1, l = leftProperties.length; i < l; i++) {
                var leftProperty = leftProperties[i];
                self.leftProperties[leftProperty.property].value = null;
                self.leftProperties[leftProperty.property].displayValue = null;
            }
        }
        else if (propertyName == "rightxpath") {
            var rightProperties = self.getRightPropertiesModel();
            for (i = 1, l = rightProperties.length; i < l; i++) {
                var rightProperty = rightProperties[i];
                self.rightProperties[rightProperty.property].value = null;
                self.rightProperties[rightProperty.property].displayValue = null;
            }
        }
    },

    /*
    *   Updates internal model
    */
    update: function (model) {
        var self = this;
        self.processModel(model);
    },

    /*
    * This method gets the filter attribute defined
    */
    getFilter: function (propertyName) {
        var self = this;

        var property = self.properties[propertyName];
        if (!property) { return ""; }

        return property.filterBy;
    },

    /*
    * This method gets the valid types for the attribute
    */
    getFilterTypes: function (propertyName) {
        var self = this;

        var property = self.properties[propertyName];
        if (!property) { return null; }

        return property.types;    
    }, 
    
    /*
    * This method gets the xpath of related entity defined
    */
    getRelatedEntity: function (propertyName) {
        var self = this;

        var property = self.properties[propertyName];
        if (!property) { return null; }

        return self.getPropertyValue(property.entity);

    },

    /*
    * This method returns the entity related
    */
    getEntity: function (propertyName) {
        var self = this;

        var property = self.properties[propertyName];
        if (!property) { return null; }

        return property.entity;

    },

    /*
    * This method gets the current value of property
    */
    getPropertyValue: function (propertyName) {
        var self = this;

        var property = self.properties[propertyName];
        if (!property) { return null; }

        return property.value;
    },

    /*
    * This method return the attributes of property
    */
    getProperty: function (propertyName) {
        var self = this;

        return self.properties[propertyName];
    },

    /*
    * This method retuns the guid of current element
    */
    getElementGuid: function () {
        return this.elementGuid;
    },
   
    /*
    * This method update dependencies 
    */
    updateDependencies: function () {
        var self = this;

        var reanOnlyLeft = bizagi.util.isEmpty(self.getPropertyValue("leftxpath"));
        for (var leftKey in self.leftProperties) {
            if (leftKey == "leftxpath") { continue; }
            self.leftProperties[leftKey].readonly = reanOnlyLeft;
        }

        var reanOnlyright = bizagi.util.isEmpty(self.getPropertyValue("rightxpath"));
        for (var rightKey in self.rightProperties) {
            if (rightKey == "rightxpath") { continue; }
            self.rightProperties[rightKey].readonly = reanOnlyright;
        }
    },

    /*
    * This method returns true if all properties were filled
    */
    isValid: function () {
        var self = this;

        for (var property in self.properties) {
            if (self.properties[property].required && !self.properties[property].value) {
                return false;
            }
        }

        return true;
    },

    /*
    *   Get model for rendering
    */
    getViewModel: function () {
        var self = this;

        self.updateDependencies();

        return {
            leftProperties: self.getViewLeftPropertiesModel(),
            rightProperties: self.getViewRightPropertiesModel()
        };
    },

    /*
    * This method returns the left properties
    */
    getViewLeftPropertiesModel: function () {
        var self = this;
        var leftProperties = [];

        for (var leftKey in self.leftProperties) {
            leftProperties.push(self.leftProperties[leftKey]);
        }

        return leftProperties;
    },

    /*
    * This method returns the rigth properties
    */
    getViewRightPropertiesModel: function () {
        var self = this;
        var rightProperties = [];

        for (var rightKey in self.rightProperties) {
            rightProperties.push(self.rightProperties[rightKey]);
        }

        return rightProperties;
    },

    /*
    * This method builds the initial model, for left properties
    */
    getLeftPropertiesModel: function () {
        var leftProperties = [];
        leftProperties.push({ property: "leftxpath", value: null, editor: "xpatheditor", filterBy: "xpathtocollection", readonly: false, displayValue: null, required: true, title: bizagi.localization.getResource("bizagi-editor-wizard-association-editor-leftxpath") });
        leftProperties.push({ property: "leftdisplayattrib", value: null, editor: "xpatheditor", filterBy: "xpathfromentity", types: ["string", "number", "date", "boolean"], readonly: true, displayValue: null, entity: "leftxpath", required: true, title: bizagi.localization.getResource("bizagi-editor-wizard-association-editor-leftdisplayattrib") });
        leftProperties.push({ property: "leftadditionalattrib", value: null, editor: "xpatheditor", filterBy: "xpathfromentity", types: ["string", "number", "date", "boolean"], readonly: true, displayValue: null, entity: "leftxpath", title: bizagi.localization.getResource("bizagi-editor-wizard-association-editor-leftadditionalattrib") });        
        leftProperties.push({ property: "leftfilter", value: null, editor: "filter", readonly: true, displayValue: null, entity: "leftxpath", title: bizagi.localization.getResource("bizagi-editor-wizard-association-editor-leftfilter") });
        leftProperties.push({ property: "leftcaption", value: "", editor: "localizable", readonly: true, displayValue: null, required: true, title:  bizagi.localization.getResource("bizagi-editor-wizard-association-editor-leftcaption") });

        return leftProperties;
    },

    /*
    * This method builds the initial model, for right properties
    */
    getRightPropertiesModel: function () {
        var rightProperties = [];
        rightProperties.push({ property: "rightxpath", value: null, readonly: false, editor: "xpatheditor", filterBy: "xpathtocollection", displayValue: null, required: true, title: bizagi.localization.getResource("bizagi-editor-wizard-association-editor-rightxpath") });
        rightProperties.push({ property: "rightdisplayattrib", value: null, editor: "xpatheditor", filterBy: "xpathfromentity", types: ["string", "number", "date", "boolean"], readonly: true, displayValue: null, entity: "rightxpath", required: true, title: bizagi.localization.getResource("bizagi-editor-wizard-association-editor-rightdisplayattrib") });
        rightProperties.push({ property: "rightadditionalattrib", value: null, editor: "xpatheditor", filterBy: "xpathfromentity", types: ["string", "number", "date", "boolean"], readonly: true, displayValue: null, entity: "rightxpath", title: bizagi.localization.getResource("bizagi-editor-wizard-association-editor-rightadditionalattrib") });        
        rightProperties.push({ property: "rightfilter", value: null, editor: "filter", readonly: true, displayValue: null, entity: "rightxpath", title: bizagi.localization.getResource("bizagi-editor-wizard-association-editor-rightfilter") });
        rightProperties.push({ property: "rightcaption", value: "", editor: "localizable", readonly: true, displayValue: null, required: true, title: bizagi.localization.getResource("bizagi-editor-wizard-association-editor-rightcaption") });

        return rightProperties;
    },

    /*
    * This method returns the persistence model
    */
    getPersistenceModel: function (params) {
        var self = this;
        var properties = {};

        for (var property in self.properties) {
            // Only if the property has a value
            if (self.properties[property].value) {
                properties[property] = self.properties[property].value;
            }
        }

        properties["factxpath"] = params.factxpath;
        properties["guid"] = self.getElementGuid();
        properties["leftfactname"] = params.leftfactname;
        properties["rightfactname"] = params.rightfactname;

        return properties;
    }
});