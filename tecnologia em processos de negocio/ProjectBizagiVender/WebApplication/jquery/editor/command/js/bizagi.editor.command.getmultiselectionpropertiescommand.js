
/*
*   Name: BizAgi FormModeler Editor Get Multiselection Properties Command
*   Author: Alexander Mejia
*   Comments:
*   -   This command will retrieve the appropiate model in current multiselection
* 
*   
*   
*/

bizagi.editor.notUndoableCommand.extend("bizagi.editor.getMultiselectionPropertiesCommand", {

    properties: {
        visible: false,
        editable: false,
        required: false,
        format: false,
        layout: false
    },

    defaultValueProperties: {
        visible: {
            fixedvalue: "true"
        },
        editable: {
            fixedvalue: "true"
        },
        required: {
            fixedvalue: "false"
        },
        format: {
            size: undefined,
            bold: undefined,
            italic: undefined,
            underline: undefined,
            strikethru: undefined,
            color: undefined,
            background: undefined
        },
        layout: {
            labelwidth: 50,
            valuewidth: 50
        }
    }

}, {

    /*  
    *   Gets the element property for a given element guid
    */
    execute: function () {
        var self = this,
            args = self.arguments || {};

        self.mergeModel = bizagi.clone(self.Class.properties);

        self.selectedElements = self.controller.getGuidsSelected();

        // Get properties model of each element
        self.getPropertiesModel(self.selectedElements);

        self.findCommonProperties();

        args.result = self.buildModel();

        self.resetProperties();
        return true;
    },

    /*
    * Gets properties model for each element
    */
    getPropertiesModel: function (elements) {
        var self = this;
        self.propertiesModel = {};
       
        for (var i = 0, l = elements.length; i < l; i++) {
            var guid = elements[i];
            var element = self.model.getElement(guid);
            
            // Because propertyModel is a static property for each type of render ejm text, is necesary clone the object
            self.propertiesModel[guid] = $.extend(true, {}, element.getPropertiesModel());
        }
    },

    /*
    * Reset properties to default value( False )
    */
    resetProperties: function () {
        var self = this;

        for (var property in self.Class.properties) {
            self.Class.properties[property] = false;
        }

    },


    /*
    * Finds common properties in all models
    * In this moment bizagi wil support the following properties
    *  - visible
    *  - editable
    *  - required
    */
    findCommonProperties: function () {
        var self = this;
        self.commonProperties = {};

        for (var guid in self.propertiesModel) {
            self.resetProperties();
            self.commonProperties[guid] = {};
            var tabs = self.propertiesModel[guid].elements[0].tabs;
            if (!self.findPropertiesInTabs(guid, tabs)) {
                self.removePropertiesInMergeModel();
            }

        }

    },

    /*
    * In this moment bizagi wil support the following properties
    *  - visible
    *  - editable
    *  - required 
    */
    findPropertiesInTabs: function (guid, tabs) {
        var self = this;

        for (var i = 0, l = tabs.length; i < l; i++) {
            var tab = tabs[i];

            for (var j = 0, k = tab.elements.length; j < k; j++) {
                var element = tab.elements[j];
                if (element.property && self.propertyIsValid(element.property["name"])) {
                    if (typeof (self.mergeModel[element.property["name"]]) === "boolean") { self.mergeModel[element.property["name"]] = { element:element, tab: tab }; }
                    else { self.resolvePropertyValue(element); }
                    if (self.findAllProperties()) { return true; }
                }
            }
        }

        return false;
    },

    /*
    *  Merge property value 
    */
    resolvePropertyValue: function (element) {
        var self = this;

        if (self.mergeModel[element.property.name]) {
            var currentElement = self.mergeModel[element.property.name].element;

            if (!bizagi.editor.utilities.objectEquals(element.property["value"], currentElement.property["value"])) {
                currentElement.property["value"] = self.Class.defaultValueProperties[element.property.name];
                if (currentElement.property.subproperties) {
                    var subproperties = currentElement.property.subproperties;
                    for (var i = 0, l = subproperties.length; i < l; i++) {
                        var subproperty = subproperties[i].property;
                        if (subproperty) {
                            subproperty.value = self.Class.defaultValueProperties[subproperty.name];
                        }

                    }
                }
            }
        }

    },

    /*
    * Checks is property is valid to match
    */
    propertyIsValid: function (propertyName) {
        var self = this;

        for (var property in self.Class.properties) {
            if (!self.Class.properties.hasOwnProperty(property)) { break; }

            if (property === propertyName) {
                self.Class.properties[property] = true;
                return true;
            }
        }

        return false;
    },

    /*
    * Check if all properties was finded
    */
    findAllProperties: function () {
        var self = this;
        var result = true;

        for (var property in self.Class.properties) {
            result &= self.Class.properties[property];
            if (!result) { return result; }
        }

        return result;
    },

    /*
    *  Removes properties don't common
    */
    removePropertiesInMergeModel: function () {
        var self = this;

        for (var property in self.Class.properties) {
            if (!self.Class.properties[property]) {
                delete self.mergeModel[property];
            }
        }
    },

    /*
    * Builds model with common properties
    */
    buildModel: function () {
        var self = this;
        var model = {};

        var numberElements = self.selectedElements.length;

        model.renderCaption = numberElements + " " + bizagi.localization.getResource("bizagi-editor-properties-multiple-controls-caption");
        model.idRender = "00000000-0000-0000-0000-000000000000";
        model.element = { type: "multiselect" };
        model.elements = [];

        var propertyModel = { tabs: [] };
        var tabs = self.mergeTabs();
        for (var tab in tabs) {
            propertyModel.tabs.push(tabs[tab]);
        }

        model.elements.push(propertyModel);

        return model;
    },

    /*
    * 
    */
    mergeTabs: function () {
        var self = this;

        var tabs = {};

        for (var property in self.mergeModel) {
            var currentTab = self.mergeModel[property].tab;
            if (tabs[currentTab.caption]) {
                tabs[currentTab.caption].elements.push(self.mergeModel[property].element);
            }
            else {
                tabs[currentTab.caption] = { elements: [], caption: currentTab.caption, id: currentTab.id };
                tabs[currentTab.caption].elements.push(self.mergeModel[property].element);
            }
        }

        return tabs;
    }



})