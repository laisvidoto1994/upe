

/*
*   Name: BizAgi FormModeler Editor Aplly Overrides Element Command
*   Author: Alexander Mejia
*   Comments:
*   -   This script will define basic stuff for applyOverridesElementCommand
*
*   Arguments
*   -   guid
*/

bizagi.editor.notUndoableCommand.extend("bizagi.editor.applyOverridesElementCommand", {

    propertiesOverrides: {
        "currency": { allowdecimals: "true", thousands: "true" },
        "float": { allowdecimals: "true", thousands: "true" },
        "number": { allowdecimals: "false", thousands: "false" }
    },

    requiredPropertiesOverrides: {
        "combo": {
            "entity-parametric": {
                "data.displayattrib": false
            },
            "entity-master": {
                "data.displayattrib": true
            },
            "entity-stakeholder": {
                "data.displayattrib": true
            }
        },
        "columncombo": {
            "entity-parametric": {
                "data.displayattrib": false
            },
            "entity-master": {
                "data.displayattrib": true
            },
            "entity-stakeholder": {
                "data.displayattrib": true
            }
        },
        "querycombo": {
            "entity-parametric": {
                "data.displayattrib": false
            },
            "entity-master": {
                "data.displayattrib": true
            },
            "entity-stakeholder": {
                "data.displayattrib": true
            }
        },
        "searchcombo": {
            "entity-parametric": {
                "data.displayattrib": false
            },
            "entity-master": {
                "data.displayattrib": true
            },
            "entity-stakeholder": {
                "data.displayattrib": true
            }
        },

        "list": {
            "entity-parametric": {
                "data.displayattrib": false
            },
            "entity-master": {
                "data.displayattrib": true
            },
            "entity-stakeholder": {
                "data.displayattrib": true
            }
        },
        "columnlist": {
            "entity-parametric": {
                "data.displayattrib": false
            },
            "entity-master": {
                "data.displayattrib": true
            },
            "entity-stakeholder": {
                "data.displayattrib": true
            }
        },
        "querylist": {
            "entity-parametric": {
                "data.displayattrib": false
            },
            "entity-master": {
                "data.displayattrib": true
            },
            "entity-stakeholder": {
                "data.displayattrib": true
            }
        },
        "radio": {
            "entity-parametric": {
                "data.displayattrib": false
            },
            "entity-master": {
                "data.displayattrib": true
            },
            "entity-stakeholder": {
                "data.displayattrib": true
            }
        },
        "columnradio": {
            "entity-parametric": {
                "data.displayattrib": false
            },
            "entity-master": {
                "data.displayattrib": true
            },
            "entity-stakeholder": {
                "data.displayattrib": true
            }
        },
        "queryradio": {
            "entity-parametric": {
                "data.displayattrib": false
            },
            "entity-master": {
                "data.displayattrib": true
            },
            "entity-stakeholder": {
                "data.displayattrib": true
            }
        }
    }

}, {

    /*
    *   Perform property change
    */
    execute: function () {
        var self = this;
        var args = self.arguments;
            
        if (self.controller.isOfflineFormContext()) { return true; }

        self.element = args.element || self.model.getElement(args.guid);

        if (!bizagi.editor.utilities.isObject(self.element.properties.xpath)) { return true; }

        self.xpathModel = (self.controller.isGridContext() ) ?  self.controller.getXpathNavigatorModelGrid() :self.controller.getXpathNavigatorModel();
        args.overrides = args.overrides || { "properties": true, "requiredProperties": true };


        if (args.overrides.properties) { self.propertiesOverrides(); }
        if (args.overrides.requiredProperties) { self.requiredPropertiesOverrides(); }

        self.updateControlType();

        return true;
    },


    /*
    * Finds properties to overrides
    */
    propertiesOverrides: function () {
        var self = this;
        var renderType = self.getRenderType();
        if (renderType && self.Class.propertiesOverrides[renderType]) {
            self.element.propertiesOverrides(self.Class.propertiesOverrides[renderType]);
        }
    },

    /*
    * Finds required properties to overrides
    */
    requiredPropertiesOverrides: function () {
        var self = this;
        var properties = self.element.properties;

        var type = properties.type;
        var renderType = self.getRenderType();
        var requiredProperties = self.Class.requiredPropertiesOverrides[type];
        if (requiredProperties && requiredProperties[renderType]) {
            self.element.requiredPropertiesOverrides(requiredProperties[renderType]);
        }
    },

    /*
    * Gets render type of element
    */
    getRenderType: function () {
        var self = this;
        var properties = self.element.properties;
        var xpath = properties.xpath;

        var node = self.xpathModel.getNodeByXpath(bizagi.editor.utilities.resolveComplexXpath(xpath));
        return (node) ? node.getRenderType() : false;
    },

    /*
    * Set the control type of the element
    */
    updateControlType: function () {
        var self = this;

        if (self.element.type == "hidden" ||
            self.element.type == "offlinehidden" ||
            self.element.type == "columnhidden" ||
            self.element.type == "queryhidden" ||
            self.element.type == "layoutPlaceholder") {
            self.element.controlType = self.getRenderType();
        }
    }


})
