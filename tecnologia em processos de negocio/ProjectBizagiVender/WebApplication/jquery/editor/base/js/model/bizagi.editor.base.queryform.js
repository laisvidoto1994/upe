/*
*   Name: BizAgi FormModeler Editor Form
*   Author: Juan Pablo Crossley
*   Comments:
*   -   This script will define basic stuff for Query Form(model)
*/

bizagi.editor.base.container.extend("bizagi.editor.base.queryform", {},

// Extend from container and search form behaviour (multiple inheritance)
	$.extend({}, bizagi.editor.base.queryFormValidations, {

	    /*
	    *   Constructor
	    */
	    init: function (data, elementFactory, regenerateGuid) {
	        var self = this;

	        // Set the element name
	        self.type = "queryform";

	        // Call base
	        this._super(data, elementFactory, regenerateGuid);

	        // Load action
	        self.actions = data && data.actions ? data.actions : [];
	        self.actions = regenerateGuid ? self.regenerateGuidsActions() : self.actions;
	        // Load validatons
	        self.validations = data && data.validations ? data.validations : [];
	        self.validations = regenerateGuid ? self.regenerateGuidsValidations() : self.validations;

	        self.contextentity = data.contextentity,
            self.scopedefinition = data.scopedefinition;
	        self.version = data.version;

	    },

	    /*
	    * Resolves control type
	    */
	    getFormParent: function () {
	        return this;
	    },

	    /*
	    *   Returns the JSON needed to render the element 
	    */
	    getRenderingModel: function () {
	        var defer = $.Deferred();
	        var childrenReady = this._super();

	        $.when(childrenReady)
            .done(function (result) {
                defer.resolve({ form: result.container });
            });

	        return defer.promise();
	    },

	    /*
	    *   Get persistence model
	    */
	    getPersistenceModel: function () {
	        var self = this;
	        var model = this._super();

	        var entityType = self.triggerGlobalHandler("getContextEntityType");

	        // Add actions and validations
	        model.actions = self.actions;
	        model.validations = self.validations;
	        
            //Always save onlynested property
	        model.properties.onlynested = model.properties.onlynested || false;
            	        
	        model.contextentity = (typeof self.contextentity === "string") ? bizagi.editor.utilities.buildComplexReference(self.contextentity) : self.contextentity;
	        model.scopedefinition = (typeof self.scopedefinition === "string") ? bizagi.editor.utilities.buildComplexReference(self.scopedefinition) : self.scopedefinition;
	        model.version = self.version;
	        model.queryType = (entityType == "application") ? "application" : "entity";
	        return model;
	    },


	    resolveDisplayNameProperty: function () {
	        var self = this;


	        if (self.resolveProperty("displayName")) {
	            return self.resolveI18nProperty("displayName");
	        }
	        else { return undefined; }

	    },

	    /*
	    *   Return the action and validations model
	    */
	    getCommandsModel: function () {
	        var self = this;
	        var defer = $.Deferred();
	        var hash = {};
	        var specialControls = [];

	        var controls = self.getCommandsControls(self, hash, specialControls);

	        if (specialControls.length > 0) {
	            $.when(self.getCommandsSpecialControls(specialControls, hash)).
    	            done(function () {
    	                defer.resolve({
    	                    actions: self.getActions(),
    	                    validations: self.getValidations(),
    	                    controls: controls,
    	                    enableReverse: self.verifyFormHasReverse()
    	                });
    	            });
	        } else {
	            defer.resolve({
	                actions: self.getActions(),
	                validations: self.getValidations(),
	                controls: controls,
	                enableReverse: self.verifyFormHasReverse()
	            });
	        }

	        return defer.promise();
	    },

	    /*
	    *   Get all validations ( instrinsec and external)
	    */
	    getValidations: function () {
	        var self = this;
	        var validations = bizagi.clone(self.validations);
	        $.merge(validations, self.getInherentValidations());
	        return validations;
	    },

	    /*
	    * Get all Actions, updates the displayName of rule for the execute-rule commands
	    */
	    getActions: function () {
	        var self = this;

	        $.each(self.actions, function (_, action) {
	            var ruleCommands = $.grep(action.commands, function (command) {
	                return (command.command === "execute-rule" || command.command === "execute-gridrule");
	            });

	            for (var i = 0, l = ruleCommands.length; i < l; i++) {
	                var argument = ruleCommands[i].argument;


	                if (!bizagi.editor.utilities.isObject(argument)) {
	                    argument = { rule: argument, label: "Rule" };
	                }

	                if (argument.guid) {
	                    argument.rule = bizagi.editor.utilities.buildComplexReference(argument.guid);
	                    delete argument.guid;
	                }

	                (function (rule, arg, command) {

	                    var ruleDisplayNameProtocol = bizagi.editor.communicationprotocol.factory.createProtocol({ protocol: "getruledisplayname", rule: rule });
	                    $.when(ruleDisplayNameProtocol.processRequest()).
    	                done(function (data) {
    	                    arg.label = (data) ? data.displayName : arg.label;
    	                    command.argument = arg;
    	                });

	                })(argument.rule, argument, ruleCommands[i]);
	            }

	        });

	        return self.actions;
	    },

	    /*
	    *   Return an object with action and validations
	    */
	    getActionValidationsModel: function () {
	        var self = this;

	        return {
	            actions: self.actions,
	            validations: self.validations,
	            mapXpaths: self.getMapControls(self, {})
	        };
	    },

	    /*
	    *   Set the action and validations model
	    */
	    setCommandsModel: function (model) {
	        var self = this;

	        // Load action and validations
	        self.actions = model.actions || [];
	        self.validations = model.validations ? $.grep(model.validations, function (item) { return item.inherent ? false : true; }) : [];
	    },

	    /*
	    *   Gets all the available controls for action and validations
	    */
	    getCommandsControls: function (container, hash, controls) {
	        var self = this;
	        hash = hash || {};
	        controls = controls || [];


	        for (var i = 0; i < container.elements.length; i++) {

	            if (container.elements[i].elementType == "container") {
	                if (container.elements[i].type !== "nestedform") {
	                    // Iterate children
	                    self.getCommandsControls(container.elements[i], hash, controls);
	                }
	            }

	            var controlType = container.elements[i].getControlType();
	            var isXpathVisualPoperty = container.elements[i].isVisualProperty("xpath");

	            if (container.elements[i].isHidden() && !controlType && !bizagi.util.isEmpty(container.elements[i].properties.xpath)) {
	                controls.push(container.elements[i]);
	                continue;
	            }

	            // The Internals elements aren't supported in V&A
	            if (container.elements[i].isInternal()) {
	                continue;
	            }

	            if (container.elements[i].type == "image") {
	                continue;
	            }

	            if (controlType &&
                    !bizagi.util.isEmpty(container.elements[i].properties.xpath) &&
                    container.elements[i].elementType !== "container"
	                ) {

	                // Add to hash
	                var xpath = (container.isGrid()) ? container.getXpath() + "[]." + container.elements[i].getXpath() : container.elements[i].getXpath();
	                hash[xpath] = {
	                    label: (container.isGrid()) ? ((bizagi.util.trim(container.resolveDisplayNameProperty()) || container.getXpath()) + "." + container.elements[i].resolveDisplayNameProperty()) : container.elements[i].resolveDisplayNameProperty(),
	                    type: container.elements[i].getControlType(container.elements[i]),
	                    render: container.elements[i].elementType == "render" ? true : null,
	                    container: container.elements[i].elementType == "container" ? true : null,
	                    baxpath: (container.isGrid()) ? self.buildxpathColumn({ originalXpath: container.properties.xpath, resolved: xpath }) : container.elements[i].properties.xpath,
	                    xpathContainer: (container.isGrid()) ? container.getXpath() : null,
	                    controlType: container.elements[i].type,
	                    style: container.elements[i].style
	                };
	            }
	            else if (controlType && container.elements[i].elementType === "container") {
	                // Add to hash
	                var id = container.elements[i].guid;
	                hash[id] = {
	                    label: container.elements[i].resolveDisplayNameProperty() || controlType + " " + id,
	                    type: container.elements[i].getControlType(container.elements[i]),
	                    render: false,
	                    container: true,
	                    containerId: id,
	                    propertyToUpdate: "container",
	                    controlType: container.elements[i].type,
	                    style: container.elements[i].style
	                };
	            }
	            else if (!isXpathVisualPoperty &&
    	                 controlType &&
        	             container.elements[i].elementType !== "container") {
	                // Add to hash
	                id = container.isGrid() ? container.getXpath() + "[]." + container.elements[i].guid : container.elements[i].guid;
	                hash[id] = {
	                    label: container.isGrid() ? (container.resolveDisplayNameProperty() || container.getXpath()) + "." + container.elements[i].resolveDisplayNameProperty() || (controlType + " " + id) : container.elements[i].resolveDisplayNameProperty() || controlType + " " + id,
	                    type: controlType,
	                    render: container.elements[i].elementType == "render" ? true : null,
	                    container: container.elements[i].elementType == "container" ? true : null,
	                    renderId: id,
	                    propertyToUpdate: "renderId",
	                    xpathContainer: (container.isGrid()) ? container.getXpath() : null,
	                    controlType: container.elements[i].type,
	                    style: container.elements[i].style
	                };
	            }
	            
	        }

	        return hash;
	    },


	    /*
	    *   Gets all the available special controls for action and validations
	    */
	    getCommandsSpecialControls: function (specialControls, hash) {
	        var self = this;
	        var defer = new $.Deferred;

	        $.when.apply($, $.map(specialControls, function (control) { return control.getControlAttributes(); }))
    	        .done(function () {
    	            self.getCommandsControls({ elements: specialControls, isGrid: function() { return false; } }, hash);
    	            defer.resolve();
    	        });

	        return defer.promise();
	    },

	    /*
	    * Check if in the actual form exists any action using the 'automatic' or reverse option
	    */
	    verifyFormHasReverse: function () {
	        var self = this;
	        var actions = self.actions;
	        var hasFormReverse = false;

	        for (var i = 0; i < actions.length; i++) {
	            if (actions[i].elseAction && actions[i].elseAction == "automatic") {
	                hasFormReverse = true;
	                break;
	            }
	        }

	        return hasFormReverse;
	    },
	    
	    /*
	    *   function dummy,  doesn't apply in queryforms
	    */
	    getMapXpath: function () {
	        return;
	    },

	    /*
       *   function dummy,  doesn't apply in queryforms
       */
	    getMapControls: function () {
	        return;
	    },

	    /*
	    *   Publish a global event that the view will replicate
	    */
	    triggerGlobalHandler: function (eventType, data) {
	        var self = this;

	        return self.publish(eventType, data);
	    }
	}
));