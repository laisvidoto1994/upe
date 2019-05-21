/*
*   Name: BizAgi FormModeler Editor Controls
*   Author: Alexander Mejia
*   Comments:
*   -   This script will define basic stuff for controls (elements in toolbar)
*/

bizagi.editor.observableClass.extend("bizagi.editor.controls", {}, {
    /*
    *   Initializes the controls model with the incoming data
    */
    init: function (data, controlsToDisabled) {
        var self = this;

        // Call base
        self._super();

        self.controls = {};
        self.convertToMap = {};
        self.controlsToConvert = {};
        controlsToDisabled = controlsToDisabled || {};

        if (typeof (data) !== "undefined")
            self.processData(data, controlsToDisabled);
    },

    /*
    *   Process the data in order to build the model
    */
    processData: function (data, controlsToDisabled) {
        var self = this;

        $.each(data.controls, function (_, control) {
            if (!controlsToDisabled[control.name]) {

                if (self.isConvertible(control.name)) {
                    self.addControlInConvertToMap(control);
                }
                self.controls[control.name] = control;
            }
        });
    },

    /*
    *   Finds the control by name
    */
    findControl: function (name) {
        var self = this;

        var control = self.controls[name];
        if (control == null) {
            throw "there aren't a control with name " + name;
        }

        return control;
    },

    /*
    *  disabled letter control
    */
    disabledControls: function (customFlags) {
        var self = this;

        for (var key in customFlags) {
            if (self.controls[key] && customFlags[key]) {
                delete self.controls[key];               
            }
        }


    },

    /*
    *   Gets the design properties of control by name
    */
    getDesignProperties: function (name) {
        var self = this;

        var control = self.findControl(name);

        if (control.design && control.design.properties) { return control.design.properties; }
        else { return {}; }

    },

    /*
    * Gets the Guid of control in its metadata definition
    */
    getGuidControl: function (controlName) {
        var self = this;

        var control = self.findControl(controlName);

        return control.jquery;
    },


    /*
    * exclude control association because this not apply 
    */
    isConvertible: function (name) {
        if (name == "association") { return false;}

        if (name == "userpassword") { return false; }

        if (name == "comboselected") { return false; }

        if (name == "getuser") { return false; }

        if (name == "stakeholder") { return false; }

        return true;
    },

    /*
    *   Adds the xpath property to convertToMap
    */
    addControlInConvertToMap: function (control) {
        var self = this;
        var type = control.type || "render";
        var designProperties = control.design ? control.design.properties : null;

        if (designProperties) {
            var xpathProperty = designProperties["xpath"];
            if (xpathProperty && xpathProperty["bas-type"]) {

                var convertToMap = self.getConvertToMap(type);

                if (!convertToMap[xpathProperty["bas-type"]]) { convertToMap[xpathProperty["bas-type"]] = []; }
                var definition = {
                    controlName: control.name,
                    filterBy: xpathProperty["editor-parameters"] ? xpathProperty["editor-parameters"].types : null,
                    caption: bizagi.editor.utilities.resolveInternalResource(control["display"]),
                    style: control.style
                };

                convertToMap[xpathProperty["bas-type"]].push(definition);

                self.controlsToConvert[control.name] = {
                    siblings: convertToMap[xpathProperty["bas-type"]],
                    definition: definition
                };
            }
        }
    },

    /*
    * Returns map convertTo objects
    */
    getConvertToMap: function (controlType) {
        var self = this;

        if (!self.convertToMap[controlType]) { self.convertToMap[controlType] = {}; }

        return self.convertToMap[controlType];
    },

    /*
    *  Gets controls to convert
    */
    getControlsToConvert: function (name) {
        var self = this;

        if (!self.controlsToConvert[name]) { return []; }

        var infoControl = self.controlsToConvert[name];

        return $.grep(infoControl.siblings, function (control, _) {
            return (control.controlName !== infoControl.definition.controlName && self.filterBy(infoControl, control.filterBy));

        });
    },

    /*
    *  filter by valid controls
    */
    filterBy: function (infoControl, filter) {

        if (infoControl.definition.filterBy && $.isArray(infoControl.definition.filterBy) && filter && $.isArray(filter)) {
            for (var i = 0, l = infoControl.definition.filterBy.length; i < l; i += 1) {
                var type = infoControl.definition.filterBy[i];
                if (filter.indexOf(type) >= 0) { return true; }
            }
            return false;
        }
        else { return true; }

    },

    /*
    * Checks if any property isn't enabled
    */
    disableControlProperties: function (flag) {
        var self = this;

        for (var key in bizagi.editor.overrides[flag]) {
            var overridesControl = bizagi.editor.overrides[flag][key];

            var control = self.controls[key];

            if (control != undefined) {

                if (bizagi.editor.utilities.isObject(overridesControl)) {
                    var disableProperties = (overridesControl.properties && overridesControl.properties["disable"]) || [];

                    control.disableProperties = (!control.disableProperties) ? [] : control.disableProperties;

                    for (var i = 0; i <= disableProperties.length; i++) {
                        control.disableProperties.push(disableProperties[i]);
                    }

                }
            }
        }

    }

})

