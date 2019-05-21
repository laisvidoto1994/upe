/*
*   Name: BizAgi FormModeler Editor Form
*   Author: Alexander Mejia, Diego Parra
*   Comments:
*   -   This script will define basic stuff for Form(model)
*/

bizagi.editor.base.container.extend("bizagi.editor.base.form", {},

// Extend from container and search form behaviour (multiple inheritance)
	$.extend({}, bizagi.editor.base.formBehaviour, {

	    /*
	    *   Constructor0
	    */
	    init: function (data, elementFactory, regenerateGuid) {
	        var self = this;

	        // Set the element name
	        self.type = "form";

	        // Call base
	        this._super(data, elementFactory, regenerateGuid);	       

	        // Load action
	        self.actions = data && data.actions ? data.actions : [];
	        self.actions = regenerateGuid ? self.regenerateGuidsActions() : self.actions;
	        // Load validatons
	        self.validations = data && data.validations ? data.validations : [];
	        self.validations = regenerateGuid ? self.regenerateGuidsValidations() : self.validations;

	        self.buttons = [];

	        // Load buttons
	        if (data.buttons) {
	            self.loadButtons(data);
	            self.properties.usecustombuttons = (self.properties.usecustombuttons === undefined) ? true : self.properties.usecustombuttons;
	        }

	        self.contextentity = data.contextentity,
            self.scopedefinition = data.scopedefinition;
	        self.isActivityForm = data.isActivityForm == undefined ? data.isActivityForm : (data.buttons ? true : false);
	        self.version = data.version;
	    },

	    /*
	    *   Load buttons from persistence model
	    */
	    loadButtons: function (data) {
	        var self = this;

	        if (data) {
	            if (data.buttons) {
	                var buttons = self.buttons = [];

	                // Iterate for each element in the object
	                $.each(data.buttons, function (i, button) {
	                    var child = self.elementFactory.createElement(button.type, button);
	                    child.setParent(self);

	                    // Add to internal collection
	                    buttons.push(child);
	                });
	            }
	        }
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
	        var self = this;
	        var defer = $.Deferred();
	        var childrenReady = self._super();

	        $.when(childrenReady)
            .done(function (result) {
                var container = result.container;
                var properties = container.properties;
                properties.isReadOnly = self.triggerGlobalHandler("isReadOnlyForm");
                defer.resolve({ form: result.container });
            });

	        return defer.promise();
	    },

	    /*
	    *   Get persistence model
	    */
	    getPersistenceModel: function () {
	        var self = this;
	        var result = this._super();

	        self.buttons = self.buttons || [];

	        // Add actions and validations
	        result.actions = self.actions;
	        result.validations = self.validations;

	        // Add contextentity and scopedefinition
	        result.contextentity = (typeof self.contextentity === "string") ? bizagi.editor.utilities.buildComplexReference(self.contextentity) : self.contextentity;	      
	        if (self.scopeDefinitionCanBeAdded()) {
	            result.scopedefinition = (typeof self.scopedefinition === "string") ? bizagi.editor.utilities.buildComplexReference(self.scopedefinition) : self.scopedefinition;
	        }
	        result.version = self.version;

	        // Add buttons
	        if (self.hasCustomButtons()) {
	            result.buttons = [];
	            $.each(self.buttons, function (i, child) {
	                result.buttons.push(child.getPersistenceModel());
	            });
	        }

	        return result;
	    },

	    /*
	     * Returns true if the scopeDefinition has an appropiate value
	     */
	    scopeDefinitionCanBeAdded: function(){
	        var self = this;

	        var addScopeDefinition = true;

	        if (typeof self.scopedefinition === "string") {
	            addScopeDefinition = !bizagi.editor.utilities.isGuidEmpty(self.scopedefinition);
	        }
	        else if (bizagi.editor.utilities.isObject(self.scopedefinition)) {
	            addScopeDefinition = !bizagi.editor.utilities.isGuidEmpty(bizagi.editor.utilities.resolveComplexReference(self.scopedefinition));
	        } else {
	            addScopeDefinition = false;
	        }

	        return addScopeDefinition;
	    },

	    /*
	    *   Returns true if the form contains custom buttons
	    */
	    hasCustomButtons: function () {
	        var self = this;
	        return self.properties.usecustombuttons !== undefined ? self.properties.usecustombuttons : false;
	    },

	    /*
	    *   Get persistence model,  needs to be overriden in order to get model
	    */
	    getSearchResultRenderingModel: function () { },

	    /*
	    *   Get button rendering model
	    */
	    getButtonRenderingModel: function () {
	        return $.when.apply($, $.map(this.buttons, function (button) { return button.getRenderingModel("button"); }))
    	        .pipe(function () {
    	            var elements = $.makeArray(arguments);
    	            return elements;
    	        });
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
	                if (container.elements[i].type !== "nestedform" ) {
	                    // Iterate children
	                    self.getCommandsControls(container.elements[i], hash, controls);
	                }
	            }
				if (container.elements[i].controlType === "boolean" && container.elements[i].properties.display === "check" && bizagi.util.parseBoolean(container.elements[i].properties.isexclusive)) {
                    continue;
                }

	            var controlType = container.elements[i].getControlType();
	            var isXpathVisualPoperty = container.elements[i].isVisualProperty("xpath");

	            if (container.elements[i].isHidden() && !controlType && !bizagi.util.isEmpty(container.elements[i].properties.xpath)) {
	                controls.push(container.elements[i]);
	                continue;
	            }

	            if (container.elements[i].type == "offlinegrid") {
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
					var xpathNestedForm = container.elements[i].isContainedInNestedForm();
					var xpath = (xpathNestedForm) ? xpathNestedForm + "." + container.elements[i].getXpath() : container.elements[i].getXpath();
					xpath = (container.isGrid()) ? container.getXpath() + "[]." + container.elements[i].getXpath() : xpath;

					var compositeBaXpath;
					if(container.isGrid() || xpathNestedForm ){
						if(typeof container.properties.xpath === "object"){
							compositeBaXpath = self.buildCompositeXpath({ originalXpath: container.properties.xpath, resolved: xpath });
						}else{
							var baXpathNestedForm = container.elements[i].getXpathNestedForm();
							compositeBaXpath =self.buildCompositeXpath({ originalXpath: baXpathNestedForm, resolved: xpath });
						}
					}else{
						compositeBaXpath =container.elements[i].properties.xpath;
					}
					var relatedEntity = bizagi.editor.utilities.resolveRelatedEntityFromXpath(container.elements[i].properties.xpath);
					hash[xpath] = {
	                    label: (container.isGrid()) ? ((bizagi.util.trim(container.resolveDisplayNameProperty()) || container.getXpath()) + "." + container.elements[i].resolveDisplayNameProperty()) : container.elements[i].resolveDisplayNameProperty(),
	                    type: container.elements[i].getControlType(container.elements[i]),
	                    render: container.elements[i].elementType == "render" ? true : null,
	                    container: container.elements[i].elementType == "container" ? true : null,
	                    baxpath: compositeBaXpath,
	                    xpathContainer: (container.isGrid()) ? container.getXpath() : null,
	                    controlType: container.elements[i].type,
	                    style: container.elements[i].style,
	                    relatedEntity: relatedEntity
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

	            // The grid is a render with elements, then if the condition is valid iterate children
	            if ((container.elements[i].isGrid()) &&
    	            !bizagi.util.isEmpty(container.elements[i].properties.xpath)) {
	                self.getCommandsControls(container.elements[i], hash, controls);
	            }
	        }

	        if (self.properties.usecustombuttons) {
	            for (var i = 0; i < self.getFormParent().buttons.length; i++) {
	                var button = self.getFormParent().buttons[i];
	                var id = button.guid;
	                hash[id] = {
	                    label: button.properties.caption.i18n["default"],
	                    type: "activityFlowButton",
	                    render: button.elementType == "render" ? true : null,
	                    container: null,
	                    renderId: button.guid,
	                    propertyToUpdate: "renderId",
	                    xpathContainer: null,
	                    controlType: "activityFlowButton"
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
    	            self.getCommandsControls({ elements: specialControls, isGrid: function () { return false; } }, hash);
    	            defer.resolve();
    	        });

	        return defer.promise();
	    },

	    /*
	    *   Builds map with all xpath configurated 
	    */
	    getMapControls: function (container, hash) {
	        var self = this;
	        hash = hash || {};

	        for (var i = 0; i < container.elements.length; i++) {
	            var element = container.elements[i];
	            if (element.elementType == "container" || element.isGrid()) {
	                // Iterate children
	                self.getMapControls(element, hash);
	            }

	            if (container.elements[i].type == "nestedform" ||
                    container.elements[i].type == "formlink" ||
                    container.elements[i].type == "hidden" ||
                    container.elements[i].type == "offlinehidden") {
	                continue;
	            }

	            if (!bizagi.util.isEmpty(container.elements[i].properties.xpath)) {

	                var xpathNestedForm = container.elements[i].isContainedInNestedForm();
	                var xpath = (xpathNestedForm) ? xpathNestedForm + "." + container.elements[i].getXpath() + container.elements[i].getFilter()
                                                              : container.elements[i].getXpath() + container.elements[i].getFilter();

	                xpath = container.isGrid() ? container.getXpath() + container.getFilter() + "." + xpath : xpath;
	                if (!hash[xpath]) { hash[xpath] = { elements: [] }; }
	               
	                hash[xpath].elements.push({	                  
	                    guid: container.elements[i].guid
	                });

	                xpathNestedForm ? hash[xpath].elements[hash[xpath].elements.length - 1].nestedForm = true : "";
	            }
	        }

	        return hash;
	    },


	    /*
	    *   Builds map with all xpath configurated 
	    */
	    getMapXpath: function (container, hash) {
	        var self = this;
	        hash = hash || {};

	        for (var i = 0; i < container.elements.length; i++) {
	            var element = container.elements[i];
	            if ((element.elementType == "container" || element.isGrid()) && container.elements[i].isEditable()) {
	                // Iterate children
	                self.getMapXpath(element, hash);
	            }

	            if (container.elements[i].type == "nestedform" ||
                    container.elements[i].type == "formlink" ||
                    container.elements[i].type == "hidden" ||
                    container.elements[i].type == "offlinehidden") {
	                continue;
	            }

	            if (!bizagi.util.isEmpty(container.elements[i].properties.xpath)) {

	                var xpathNestedForm = container.elements[i].isContainedInNestedForm();
	                var xpath = (xpathNestedForm) ? xpathNestedForm + "." + container.elements[i].getXpath() + container.elements[i].getFilter()
                                                              : container.elements[i].getXpath() + container.elements[i].getFilter();

	                xpath = container.isGrid() ? container.getXpath() + container.getFilter() + "." + xpath : xpath;
	                if (!hash[xpath]) { hash[xpath] = { editables: 0, elements: [] }; }

	                var editable = bizagi.editor.utilities.resolveProperty(container.elements[i].properties, "editable.fixedvalue") || true;
	                hash[xpath].editables = bizagi.util.parseBoolean(editable) ? hash[xpath].editables + 1 : hash[xpath].editables;
	                hash[xpath].elements.push({
	                    editable: editable ? bizagi.util.parseBoolean(editable) : true,
	                    guid: container.elements[i].guid
	                });
	                xpathNestedForm ? hash[xpath].elements[hash[xpath].elements.length - 1].nestedForm = true : "";
	            }
	        }

	        return hash;
	    },

	    /*
	    *   Builds xpath column for actions and validations
	    *   format (collection[].atributte)
	    */
	    buildxpathColumn: function (data) {
	        return buildCompositeXpath(data);
	    },

		/*
		 *   Builds xpath  for actions and validations
		 *
		 */
		buildCompositeXpath: function (data) {
			var xpath;
			if (typeof data.originalXpath === "object") {
				var newXpath = bizagi.clone(data.originalXpath);
				newXpath.xpath.baxpath.xpath = data.resolved;
				return newXpath;
			}
			return xpath;
		},

	    /*
	    * Adds action
	    */
	    addAction: function (action) {
	        this.actions.push(action);
	    },

	    /*
	    *   Remove an action
	    */
	    deleteAction: function (guid) {
	        var self = this;

	        var index = -1;
	        for (var i = 0; i < self.actions.length; i++) {
	            if (self.actions[i].guid == guid) {
	                index = i;
	                break;
	            }
	        }
	        if (index >= 0) self.actions.splice(index, 1);
	    },

	    /*
	    * Adds validation
	    */
	    addValidation: function (validation) {
	        this.validations.push(validation);
	    },

	    /*
	    *   Delete a validation
	    */
	    deleteValidation: function (guid) {
	        var self = this;

	        var index = -1;
	        for (var i = 0; i < self.validations.length; i++) {
	            if (self.validations[i].guid == guid) {
	                index = i;
	                break;
	            }
	        }
	        if (index >= 0) self.validations.splice(index, 1);
	    },


	    /*
	    *   Publish a global event that the view will replicate
	    */
	    triggerGlobalHandler: function (eventType, data) {
	        var self = this;

	        return self.publish(eventType, data);
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
	    * This method updates the guid of element referenced in an action
	    */
	    regenerateGuidsActions: function () {
	        var self = this;

	        for (var i = 0, l = self.actions.length; i < l; i++) {
	            var action = self.actions[i];
	            var expressions = [];
	            self.getExpressions(action.conditions.expressions, expressions);

	            // Iterate for each expresion in the action
	            for (var j = 0, k = expressions.length; j < k; j++) {
	                var exp = expressions[j];
	                if (exp.renderId) {
	                    if (self.isGridContext(exp.renderId)) {
	                        var parameters = self.processGridContext(exp.renderId);
	                        var render = self.getElementByOldGuid(parameters.guidControl);
	                        var guid = (render) ? render.guid : parameters.guidControl;
	                        var renderId = parameters.gridXpath + "[]." + guid;
	                        exp.renderId = renderId;
	                    } else {
	                        render = self.getElementByOldGuid(exp.renderId);
	                        exp.renderId = (render) ? render.guid : exp.renderId;
	                    }
	                }
	            }

	            if (action.commands) {
	                // Iterate for each command in the action
	                for (j = 0, k = action.commands.length; j < k; j++) {
	                    var command = action.commands[j];
	                    if (command.renderId || command.container) {
	                        render = self.getElementByOldGuid(command.renderId || command.container);
	                        if (command.renderId) {
	                            command.renderId = render ? render.guid : command.renderId;
	                        } else {
	                            command.container = render ? render.guid : command.container;
	                        }
	                    }
	                }
	            }

	            if (action.elseCommands) {
	                // Iterate for each else-command in the action
	                for (j = 0, k = action.elseCommands.length; j < k; j++) {
	                    var elseCommand = action.elseCommands[j];
	                    if (elseCommand.renderId || elseCommand.container) {
	                        render = self.getElementByOldGuid(elseCommand.renderId || elseCommand.container);
	                        if (elseCommand.renderId) {
	                            elseCommand.renderId = render ? render.guid : elseCommand.renderId;
	                        } else {
	                            elseCommand.container = render ? render.guid : elseCommand.container;
	                        }
	                    }
	                }
	            }

	            if (action.dependencies) {
	                // Iterate for each dependencies in the action
	                for (j = 0, k = action.dependencies.length; j < k; j++) {
	                    var dependency = action.dependencies[j];
	                    if (typeof dependency == "string") {
	                        if (self.isGridContext(dependency)) {
	                            parameters = self.processGridContext(dependency);
	                            render = self.getElementByOldGuid(parameters.guidControl);
	                            guid = (render) ? render.guid : parameters.guidControl;
	                            renderId = parameters.gridXpath + "[]." + guid;
	                            action.dependencies[j] = renderId;
	                        } else {
	                            render = self.getElementByOldGuid(dependency);
	                            action.dependencies[j] = (render) ? render.guid : dependency;
	                        }
	                    }
	                }
	            }
	        }
	    },

	    /*
	    * This method gets the expressions defined in actions and validations
	    */
	    getExpressions: function (expressions, result) {
	        var self = this;

	        for (var i = 0, l = expressions.length; i < l; i++) {
	            var expression = expressions[i];
	            if (expression.complex) {
	                self.getExpressions(expression.complex.conditions.expressions, result);
	            } else if (expression.simple) {
	                result.push(expression.simple);
	            }
	        }
	    },



	    /*
	    * This method updates the guid of element referenced in a validation
	    */
	    regenerateGuidsValidations: function () {
	        var self = this;

	        for (var i = 0, l = self.validations.length; i < l; i++) {
	            var validation = self.validations[i];
	            var expressions = [];
	            self.getExpressions(validation.conditions.expressions, expressions);

	            // Iterate for each expresion in the action
	            for (var j = 0, k = expressions.length; j < k; j++) {
	                var exp = expressions[j];
	                if (exp.renderId) {
	                    if (self.isGridContext(exp.renderId)) {
	                        var parameters = self.processGridContext(exp.renderId);
	                        var render = self.getElementByOldGuid(parameters.guidControl);
	                        var guid = (render) ? render.guid : parameters.guidControl;
	                        var renderId = parameters.gridXpath + "[]." + guid;
	                        exp.renderId = renderId;
	                    } else {
	                        render = self.getElementByOldGuid(exp.renderId);
	                        exp.renderId = (render) ? render.guid : exp.renderId;
	                    }
	                }
	            }
	        }
	    },

	    /*
	    * Returns true is the renderId contain reference to a grid
	    */
	    isGridContext: function (renderId) {

	        // Check in condition.xpath
	        if (renderId && renderId.indexOf("[]") > 0) {
	            return true;
	        }
	        return false;
	    },

	    /*
	    *   Return the grid xpath parts
	    *   xpath grid and reference to element
	    */
	    processGridContext: function (renderId) {

	        // Eval using regular expressions
	        var regex = new RegExp(/([\w\.]*)\[\]\.([\w\.|\w-\.]*)/g);
	        var matches = regex.exec(renderId);
	        var guidControl, gridXpath;
	        if (matches) {
	            gridXpath = matches[1];
	            guidControl = matches[2];
	        } else {
	            guidControl = "";
	            gridXpath = "";
	        }

	        return { guidControl: guidControl, gridXpath: gridXpath };
	    },

	    /*
	    * Create default buttons
	    */
	    createDefaultButtons: function (parent) {
	        var self = this;
	        self.buttons = [];
	        var saveButtonGuid = Math.guid();
	        var saveButton = self.elementFactory.createElement("formbutton", {
	            guid: saveButtonGuid,
	            properties: {
	                caption: bizagi.editor.utilities.buildComplexLocalizable(bizagi.localization.getResource("render-form-button-save"), saveButtonGuid, "caption"),
	                actions: ["submitData", "refresh"]
	            }
	        });

	        saveButton.setParent(self);

	        var nextButtonGuid = Math.guid();
	        var nextButton = self.elementFactory.createElement("formbutton", {
	            guid: nextButtonGuid,
	            properties: {
	                caption: bizagi.editor.utilities.buildComplexLocalizable(bizagi.localization.getResource("render-form-button-next"), nextButtonGuid, "caption"),
	                actions: ["validate", "submitData", "next"]
	            }
	        });

	        nextButton.setParent(self);

	        self.buttons.push(saveButton);
	        self.buttons.push(nextButton);
	    }
	}
));