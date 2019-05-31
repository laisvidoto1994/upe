/*
* Author : Alexande Mejia
* Date   : 01 Jan 2013 
* Comments:
*     Define the model for editor multiple
*
*/

$.Class.extend("bizagi.editor.component.editor.multiple.model", {

    // Static properties
    subpropertyRegex: /[^.]*$/
}, {

    /*
    *   Constructor
    */
    init: function (data) {
        var self = this;

        self.data = data;
        self.properties = {};
        self.parameters = data && data["editor-parameters"];

        self.processData(data);
    },

    /*
    * Process data
    */
    processData: function (data) {
        var self = this;

        if (data["subproperties"]) {
            for (var i = 0, l = data["subproperties"].length; i < l; i++) {
                var property = data["subproperties"][i];
                property = property["property"];
                property["propertyName"] = self.Class.subpropertyRegex.exec(property.name)[0];
                property["selected"] = self.isMatchValue(property["propertyName"]);
                property["selectedcss"] = (property["selected"]) ? " selected" : "";
                self.properties[property.name] = property;
            }
        }
    },

    /*
    * Returns model
    */
    getModel: function () {
        var self = this;

        return {
            caption: self.getCaption(),
            properties: self.getProperties(),
            isExclusive: self.isExclusive(),
            isEmpty: !self.hasValue(),
            noneCaption: self.getNodeCaption()
        };
    },

    /*
    * Return current value
    */
    getValue: function () {
        return this.data["value"];
    },


    /*
    * Return true if the properties are mutually exclusive
    */
    isExclusive: function () {
        var self = this;

        if (self.parameters) {
            var exclusive = bizagi.util.parseBoolean(self.parameters["exclusive"]);
            return (exclusive) ? true : false;

        }
        return false;
    },

    /*
    * Returns true if property is only for update (example support rule 90)
    */
    isOnlyForUpdate: function (property) {

        var parameters = property["editor-parameters"];
        if (parameters) {
            var onlyForUpdate = bizagi.util.parseBoolean(parameters["onlyforupdate"]);
            return (onlyForUpdate) ? true : false;
        }

        return false;
    },

    /*
    * Return true if currentValue match propery
    */
    isMatchValue: function (propertyName) {
        var self = this;

        var value = self.data["value"];

        if (!value) { return false; }
        return (value[propertyName]) ? true : false;
    },


    /*
    * Returns true if there is a value assigned to property 
    */
    hasValue: function () {
        return (!bizagi.util.isEmpty(this.data["value"]));
    },


    /*
    * Gets valid properties
    */
    getProperties: function () {
        var self = this;
        var properties = [];

        for (var key in self.properties) {
            if (!self.properties.hasOwnProperty(key)) continue;

            var property = self.properties[key];
            if (self.isOnlyForUpdate(property)) {
                if (property["selected"]) { properties.push(property); }
            }
            else { properties.push(property); }
        }

        return properties;
    },

    /*
    * Gets selected property
    */
    getSelectedProperty: function () {
        var self = this;

        var properties = self.getProperties();

        if (self.getValue()) {
            return $.grep(properties, function (prop, _) {
                return (prop.selected);
            });
        }
        else { return properties; }
    },

    /*
    * Returns property 
    */
    getPropertyByIndex: function (index) {
        var self = this;

        var properties = self.getProperties();
        return properties[index];
    },

    /*
    * Returns caption of property
    */
    getCaption: function () {
        return this.data["caption"] || "Multiple";
    },

    /*
    * return the caption to show in the node option
    */
    getNodeCaption: function () {
        var self = this,
            editorParameters = self.data['editor-parameters'] || {};

        if (editorParameters.noneCaption) {
            return bizagi.editor.utilities.resolveInternalResource(editorParameters.noneCaption)
        }

        return bizagi.localization.getResource("formmodeler-component-editor-multiple-none");
    }


});