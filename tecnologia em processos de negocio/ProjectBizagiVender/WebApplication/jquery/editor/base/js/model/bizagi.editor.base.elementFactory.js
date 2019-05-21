/*
*   Name: BizAgi FormModeler Element Factory
*   Author: Diego Parra
*   Comments:
*   -   This script will hold some virtual classes created based on the control's definitions
*       also acts as a factory to create instances for the virtual classes
*/

$.Class.extend("bizagi.editor.base.elementFactory", {
    // Static properties
    designValueRegex: /<\w+:([\w:]+)>/
}, {

    /*
    *   Constructor, initializes all the definitions
    */
    init: function (params) {
        var self = this;

        // Creates a map to hold the virtual classes and its relationship with the matching name
        self.classes = {};

        // Holds convertToMap       
        var controls = self.controls = params.controls;

        // Initializes the classes
        $.each(params.definitions.controls, function (i, control) {
            var controlsToConvert = controls.getControlsToConvert(control.name);
            var _class = self.createClassForControl(control, controlsToConvert);
            self.classes[control.name] = _class;
        });
    },

    /*
    *   Creates a class extending from render or container based on 
    */
    createClassForControl: function (control, controlsToConvert) {
        var self = this;
        var type = control.type || "render";
        var extendingClass = (type == "container" || type == "offlinecontainer" || type == "adhoccontainer") ? "bizagi.editor.base.container" : "bizagi.editor.base.render";


        // Special cases, extend for known classes
        if (type == "queryInternal") {
            extendingClass = "bizagi.editor.base.internal";
        } else if (control.name === "grid" || control.name === "groupedgrid" || control.name === "offlinegrid" || control.name === "adhocgrid") {
            extendingClass = "bizagi.editor.base.grid";
        } else if (control.name === "panel" || control.name === "horizontal") {
            extendingClass = "bizagi.editor.base.container";
        } else if (control.name === "nestedform" || control.name === "querynestedform") {
            extendingClass = "bizagi.editor.base.nestedform";
        } else if (control.name === "form") {
            extendingClass = "bizagi.editor.base.form";
        } else if (control.name === "template") {
            extendingClass = "bizagi.editor.base.template";
        } else if (control.name === "layout") {
            extendingClass = "bizagi.editor.base.layout";
        } else if (control.name === "offlineform") {
            extendingClass = "bizagi.editor.base.offlineform";
        } else if (control.name === "adhocform") {
            extendingClass = "bizagi.editor.base.adhocform";
        } else if (control.name === "searchform") {
            extendingClass = "bizagi.editor.base.searchform";
        } else if (control.name === "queryform") {
            extendingClass = "bizagi.editor.base.queryform";
        } else if (control.name == "startform") {
            extendingClass = "bizagi.editor.base.startform";
        } else if (control.name === "formbutton") {
            extendingClass = "bizagi.editor.base.formbutton";
        } else if (control.name === "collectionnavigator") {
            extendingClass = "bizagi.editor.base.collectionnavigator";
        }  else if (control.name === "actionlauncher") {
            extendingClass = "bizagi.editor.base.actionlauncher";
        } else if (control.name === "polymorphiclauncher") {
            extendingClass = "bizagi.editor.base.polymorphiclauncher";
        } else if (control.name === "entitytemplate") {
            extendingClass = "bizagi.editor.base.entitytemplate";
        } else if (type === "template") {
            extendingClass = "bizagi.editor.base.renderLayout";
        }

        var className = "bizagi.editor." + control.name;
        var code = extendingClass + '.extend("' + className + '" , {}, {\n' +
				'init: function ( data, elementFactory, regenerateGuid ) {\n' +
    	            'var self = this;\n' +
                    'self.type = "' + control.name + '";\n' +
                    'self.style = "' + control.style + '";\n' +
                    'this._super(data, elementFactory, regenerateGuid);\n' +
                    'this.propertyModel = this.Class.propertyModel;\n' +
                    'this.decoratorModel = this.Class.decoratorModel;\n' +
                    'this.contextMenuModel = this.Class.contextMenuModel;\n' +
                    'this.convertToModel = this.Class.convertToModel;\n' +
                    'this["widget-guid"] = this.Class["widget-guid"];\n' +
                    'this.context = this.Class.decoratorModel;\n' +
                    'this.defaultValues = {};\n' +
                    'this.asyncProperties = [];\n' +
                    'this.requiredProperties = {};\n' +
                    'this.xpathProperties = [];\n' +
                    'this.requiredDependentProperties = {};\n' +
                    'this.designValueProperties = {};\n' +
                    'this.controlType = ' + (control["data-type"] ? '"' + control["data-type"] + '"' : 'null') + ';\n' +
                    self.buildCodeForDefaultProperties(control.design.properties) +
                    self.buildCodeForDesignValueProperties(control) +
                    self.buildCodeForRequiredProperties(control.design.properties) +
                    self.buildCodeForRequiredDependentProperties(control.design.properties) +
                '}, \n\n' +

                'getRenderingProperties: function ( ) {\n' +
    	            'var self = this;\n' +
        	        'var defer = $.Deferred();\n' +
                    'var result = this._super();\n' +
                    self.buildCodeForRenderingModel(control) +
                    '$.when.apply($, self.asyncProperties).done(function(){ defer.resolve(result);}) \n' +
                    'return defer.promise();\n' +
                '},\n\n' +

                'getRibbonProperties: function ( ) {\n' +
    	            'var self = this;\n' +
                    'var result = [];\n' +
                    self.buildCodeForRibbonProperties(control) +
                    'return result;\n' +
                '},\n\n' +

                 'getLocalizableProperties: function ( ) {\n' +
    	            'var self = this;\n' +
                    'var result = [];\n' +
                    self.buildCodeForLocalizableProperties(control) +
                    'return result;\n' +
                '},\n\n' +
        '})\n';

        try {

            // Execute the code therefore creating the prototype in memory
            eval(code);

            // Inject the property, decorator and context menu models as static properties
            eval(className).propertyModel = new bizagi.editor.component.properties.model(control);
            eval(className).decoratorModel = bizagi.editor.component.decorator.model.getSpecificModel(control);
            eval(className).contextMenuModel = new bizagi.editor.component.contextmenu.model(control.design.visual["context-menu"], controlsToConvert);
            eval(className).convertToModel = controlsToConvert;

            // Define GUID for userfield
            eval(className)["widget-guid"] = (control.rendertype === "userfield") ? control.guid : null;

        } catch (e) {
            console.warn(e);
            return "bizagi.editor.label";
        }

        return className;
    },

    addWidgetsControls: function (widgets) {
        var self = this;

        // Initializes the classes
        $.each(widgets, function (i, widget) {
            var _class = self.createClassForControl(widget, []);
            self.classes[widget.name] = _class;
        });

    },

    /*
    *   Build code to automate JSON dummy generation
    */
    buildCodeForRenderingModel: function (control) {
        var self = this,
		    result = "";

        // Add code to retrieve live rendering properties
        for (var property in control.runtime.properties) {
            var runtimeProperty = control.runtime.properties[property];
            if (runtimeProperty.designvalue) {
                var designValue = runtimeProperty.designvalue;
                var match = this.Class.designValueRegex.exec(designValue);
                if (match) {
                    var resolvedValue = match[1].replace(/:/g, ".");
                    if (self.isLocalizableProperty(control, resolvedValue)) {
                        result += self.resolvePropertyLocalizable(control, runtimeProperty.name, resolvedValue);
                    } else if (self.isOrientationProperty(control, runtimeProperty.name)) {
                        result += self.resolveOrientationProperty(control, runtimeProperty.name, resolvedValue);
                    }
                    else {
                        result += 'result["' + runtimeProperty.name + '"] = self.resolveProperty("' + resolvedValue + '");\n';
                    }
                } else {
                    if (typeof runtimeProperty["designvalue"] === "object") { result += 'result["' + runtimeProperty.name + '"] = JSON.parse(\'' + JSON.encode(runtimeProperty["designvalue"]) + '\');\n'; }
                    else { result += 'result["' + runtimeProperty.name + '"] = "' + runtimeProperty["designvalue"] + '";\n'; }
                }
            }
        }

        return result;
    },

    /*
    *   Build code to automate JSON dummy generation for ribbon properties
    */
    buildCodeForRibbonProperties: function (control) {
        var result = "";
        var ribbonAllowedProperties = ["visible", "editable", "required"];

        $.each(ribbonAllowedProperties, function (i, property) {
            // Check for visible property
            if (control.design.properties[property]) {
                result += 'result.push("' + property + '");\n';
            }
        });

        return result;
    },

    /*
    * This method returns an object with the localizable properties
    */
    buildCodeForLocalizableProperties: function (control) {
        var result = "";

        for (var property in control.design.properties) {
            var designProperty = control.design.properties[property];

            if ((designProperty["bas-type"] === "localizable-string") ||
                (designProperty["bas-type"] === "localizablestring") ||
                    (designProperty["bas-type"] === "displayName")) {

                result += 'result.push("' + property + '");\n';
            }
        }

        return result;
    },

    /*
    *   Build code to determine build a map in order to check if a property has designvalue set or not
    */
    buildCodeForDesignValueProperties: function (control) {
        var result = "";
        var processedProperties = {};

        // Add code to retrieve live rendering properties
        for (var property in control.runtime.properties) {
            var runtimeProperty = control.runtime.properties[property];
            var designValue = runtimeProperty.designvalue;
            if (designValue) {
                var match = this.Class.designValueRegex.exec(designValue);
                if (match) {
                    var firstPath = match[1].split(":")[0];
                    if (!processedProperties[firstPath]) {
                        result += 'self.designValueProperties["' + firstPath + '"] = true;\n';
                        processedProperties[firstPath] = true;
                    }
                }
            }
        }
        return result;
    },

    /*
    *   Check if a property is localizable or not
    */
    isLocalizableProperty: function (control, propertyName) {
        var designProperty;

        designProperty = control.design.properties[propertyName];

        if (typeof designProperty === "undefined") {
            return false;
        }

        return ((designProperty["bas-type"] === "localizable-string") ||
            (designProperty["bas-type"] === "localizablestring") ||
                (designProperty["bas-type"] === "displayName"));

    },

    /*
    *   Check if the property is orientation
    */
    isOrientationProperty: function (control, runtimeProperty) {
        var designProperty;

        designProperty = control.design.properties[runtimeProperty];

        if (typeof designProperty === "undefined") {
            return false;
        }

        return (designProperty["bas-type"] === "orientation");

    },

    /*
    *   Resolve localizable property automation
    */
    resolvePropertyLocalizable: function (control, runtimeProperty, match) {
        if (runtimeProperty === "displayName") { return '$.when(self.resolveDisplayNameProperty("' + match + '")).done(function(value){result["' + runtimeProperty + '"] = value;}); \n'; }
        else { return 'result["' + runtimeProperty + '"] = self.resolveI18nProperty("' + match + '"); \n'; }
    },

    /*
    *   Resolve orientation property automation
    */
    resolveOrientationProperty: function (control, runtimeProperty, match) {
        return 'result["' + runtimeProperty + '"] = self.resolveIsRightToLeftProperty("' + match + '"); \n';
    },

    /*
    *   Build code to automate JSON default properties creation
    */
    buildCodeForDefaultProperties: function (properties, parentProperty) {
        var self = this,
		    result = "";
        for (var key in properties) {
            var designProperty = properties[key];
            var defaultValueKey = parentProperty ? parentProperty + "." + key : key;
            if (designProperty["default"]) {
                if (typeof designProperty["default"] === "object") {
                    result += 'self.defaultValues["' + defaultValueKey + '"] =  JSON.parse(\'' + self.getDefaultValueProperty(designProperty["default"]) + '\');\n';
                } else {
                    result += 'self.defaultValues["' + defaultValueKey + '"] = \'' + designProperty["default"] + '\';\n';
                }
                result += 'self.assignDefaultProperty("' + defaultValueKey + '",  self.defaultValues["' + defaultValueKey + '"]);\n';
            }

            // Check if the property has subproperties
            if (designProperty.subproperties) {
                result += self.buildCodeForDefaultProperties(designProperty.subproperties, defaultValueKey);
            }

        }
        return result;
    },

    /*
    *   Build code to automate JSON required properties creation
    */
    buildCodeForRequiredProperties: function (properties, prefix) {
        var self = this,
            result = "";

        for (var key in properties) {
            var designProperty = properties[key];
            if (designProperty.required) {
                key = (prefix) ? prefix + "." + key : key;
                result += 'self.requiredProperties["' + key + '"] = \'' + designProperty.required + '\';\n';
            }

            // Check if the property has subproperties
            if (designProperty.subproperties) {
                result += self.buildCodeForRequiredProperties(designProperty.subproperties, key);
            }
        }

        return result;
    },

    /*
    *   Build code to automate JSON required dependent properties creation
    */
    buildCodeForRequiredDependentProperties: function (properties, prefix) {
        var self = this,
            result = "";

        for (var key in properties) {
            var designProperty = properties[key];
            if (designProperty.dependencies && self.isRequiredDependentProperty(designProperty)) {
                key = (prefix) ? prefix + "." + key : key;

                result += 'self.requiredDependentProperties["' + key + '"] = JSON.parse(\'' + JSON.encode(designProperty.dependencies.conditions) + '\');\n';
            }

            if (designProperty["editor-parameters"]) {
                var editorParameters = designProperty["editor-parameters"];
                for (var param in editorParameters) {
                    var value = editorParameters[param];
                    if (!editorParameters.hasOwnProperty(param)) continue;
                    if (typeof value !== "string") continue;
                    if (value.indexOf("<design:xpath") > -1) {

                        result += (prefix) ? 'self.xpathProperties.push("' + prefix + "." + key + '");\n' : 'self.xpathProperties.push("' + key + '");\n';
                    }
                };
            };


            // Check if the property has subproperties
            if (designProperty.subproperties) {
                result += self.buildCodeForRequiredDependentProperties(designProperty.subproperties, key);
            }
        }

        return result;
    },

    /*
    *   Gets the default value for a property
    */
    getDefaultValueProperty: function (defaultProperty) {
        if (typeof defaultProperty === "object") {
            return JSON.encode(defaultProperty);
        }

        return defaultProperty;
    },

    /*
    *   Create a instance for an element based on the in-memory created prototype
    */
    createElement: function (name, data, regenerateGuid) {
        var self = this;

        if (!self.classes[name]) {
            console.warn("No control definition found for type: " + name);
            return new bizagi.editor.render.generic(data, this);
        }
        var fn = eval("var bafn = function(data, elementFactory, regenerateGuid) { " +
                        " var element = new " + self.classes[name] + "(data, elementFactory, regenerateGuid);" +
                        " return element;" +
                      "};bafn");

        return fn(data, this, regenerateGuid);
    },

    /*
    *   Create a instance for an column element based on the in-memory created prototype
    */
    createColumnElement: function (name, data, regenerateGuid) {
        var self = this;

        if (!self.classes[name]) {
            console.warn("No control definition found for column type: " + name);
            return new bizagi.editor.column.generic(data, this, regenerateGuid);
        }

        return self.createElement(name, data, regenerateGuid);
    },

    // ********************************* HELPER FUNCTIONS ***************************************
    // ******************************************************************************************

    /*
    *   check if the required attribute depends the value of another property
    */
    isRequiredDependentProperty: function (designProperty) {
        var result = false;

        var dependencies = designProperty.dependencies;
        if (dependencies && dependencies.actions && dependencies.actions["required"]) { result = true; }

        return result;
    }

});


