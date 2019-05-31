/**
 * Base definition of Polymorphic launcher
 *
 * @author: Edward J Morales
 */
bizagi.rendering.render.extend("bizagi.rendering.polymorphicLauncher", {}, {
	/*
	 * Constructor
	 */
	init: function(params) {
		// Call base
		this._super(params);
	},

	/*
	 * Initialize the control with data provided
	 */
	initializeData: function(data) {
		var self = this;
		// Call base
		this._super(data);
		var form = self.getFormContainer();
		this.typeForm = form.properties.typeForm || "";
		var mode = self.getMode();

		self.deferredActions = new $.Deferred();
		self.deferredActions.promise();

		self.properties.valueWidth = 100;
		self.properties.displayType = "value";
		self.properties.allowSearch = (typeof data.properties.allowSearch == "undefined") ? false : data.properties.allowSearch;
		self.properties.additionalXpath = self.properties.additionalXpath || [];

		if(!self.properties.value) {
			self.properties.value = self.value = [];
			self.properties.originalValue = [];
		} else if(typeof self.properties.value == "string") {
			self.properties.value = self.value = JSON.parse(self.properties.value);
		}

		// Data of get process property value
		self.processPropertyValueArgs = {
			"pcaseId": self.getIdCase(),
			"pguidEntity": self.properties.guidEntity,
			"idRender": self.properties.id,
			"xpathContext": form.properties.xpathContext,
			"idPageCache": form.properties.idPageCache,
			"property": "data",
			"ptags": self.getTagList(self.properties.tagslist),
			"additionalXpaths": self.properties.additionalXpath
		};
	},

	/**
	 * Send processpropertyvalue in order to execute an Action
	 * This method is used when this control stay in Summary form or Global form
	 * @param action
	 */
	executeActionImmediately: function(action) {
		var self = this;
		//Execute action immediately
		var form = self.getFormContainer();

		var processPropertyValueExecuteConstructor = {
			"idRender": self.properties.id,
			"xpathContext": form.properties.xpathContext,
			"idPageCache": form.properties.idPageCache,
			"property": "executeConstructor",
			"psurrogatedKey": self.properties.surrogatedKey,
			"pguidConstructor": action.guidConstructor,
			"pparameters": JSON.encode({
				"idStartScope": action.idStartScope,
				"pactionXpath": self.properties.xpathActions,
				"idPageCache": action.idPageCache
			})
		};

		self.dataService.executeActions(processPropertyValueExecuteConstructor).done(function(data) {
			self.notifyExecution(data.response, action);
		}).fail(function(error) {
			// TODO: Create generic mechanism to send notifications
			self.notifyExecution("Error", action);
		});
	},

	/**
	 * notify action execution status
	 * @param response
	 */
	notifyExecution: function(response, actionName) {
		// To override in each device
	},

	/**
	 * Render control in read only mode: properties.editable = false
	 * @return {*}
	 */
	renderReadOnly: function() {
		return this.renderControl();
	},

	/**
	 * Make a postrender of readonly control
	 */
	postRenderReadOnly: function() {
		this.properties.readOnly = true;
		this.postRender();
	},

	/**
	 * Template method to implement in each children to customize each control
	 * @return {string}
	 */
	renderControl: function() {
		var self = this;
		var properties = self.properties;
		var mode = self.getMode();
		var template;
		var html = "";

		// Render template
		if(mode == "design") {
			template = self.renderFactory.getTemplate("render-polymorphicLauncher-design");
			var params = {
				type: properties.type,
				allowSearch: properties.allowSearch
			};
			html = $.fasttmpl(template, params);
		} else if(properties.surrogatedKey) {
			template = self.renderFactory.getTemplate("render-polymorphicLauncher");
			html = $.fasttmpl(template);
		}
		return html;
	},


	/**
	 * Public method to determine if a value is valid or not
	 * @param invalidElements
	 * @return {*}
	 */
	isValid: function(invalidElements) {
		var self = this,
			properties = self.properties;
		// Call base
		var bValid = this._super(invalidElements);
		var value = self.getValue();
		// TODO: write functionality
		return bValid;
	},

	/**
	 * Sets the value in the rendered control
	 * @param value
	 */
	setDisplayValue: function(value) {
		var self = this;
		// Set internal value
		self.setValue(value, false);
	},

	/**
	 * Process an action
	 * @param action
	 */
	actionManager: function(action) {
		var self = this;
		var guidProcess = action.guidObject || "";
		var def = new $.Deferred();

        action.recordXpath = self.getFormContainer().properties.recordXpath;

		/**
		/**
		 * Check if action is a process
		 */
		switch(action.actionType) {
			case "Process":
				// Verify if case has startform
				var params = {
					guidWFClass: guidProcess
				};

				$.when(self.dataService.hasStartForm(params)).done(function(result) {
					if(result.hasStartForm) {
						// Open a dialog with startform and wait for Scope
						$.when(self.processStartForm({
							guidprocess: guidProcess,
							title: action.displayNamee,
                            recordXpath: action.recordXpath
						})).done(function(idStartScope) {
							action.idStartScope = idStartScope;
							def.resolve(action);
						});
					} else {
						// Just add action to queue to be executed on nextEvent
						def.resolve(action);
					}
				});

				break;
			case "Rule":
				// Just add action to queue to be executed on nextEvent
				def.resolve(action);
				break;
			case "Form":
				$.when(self.processActionForm(action)).done(function(idStartScope) {
					action.idStartScope = idStartScope;
					def.resolve(action);
				});
				break;
		}

		return def.promise();
	},

	/**
	 * Add actions within value object
	 * @param action
	 */
	addActionToQueue: function(action) {
		var self = this;
		var actionsList = self.getValue();
		var formParams = self.getFormContainer().getParams();
		
		action.params = action.params || {};

        var recordXpath = self.properties.xpathContext;

		switch(action.actionType) {
			case "Process":
				action.params = {
					additionalXpaths: self.properties.additionalXpath.join(","),
					idParentWorkitem: formParams.idWorkitem || bizagi.context.idWorkItem,
                    recordXpath: recordXpath
				};
                if (typeof action.idStartScope !== "undefined") {
                    action.params.idStartScope = action.idStartScope;
                }
				break;
			case "Form":
				action.params = {
					idStartScope: action.idStartScope,
					additionalXpaths: self.properties.additionalXpath.join(","),
					entityXpath: self.properties.xpathActions,
					idParentWorkitem: formParams.idWorkitem || bizagi.context.idWorkItem,
					idEntity: action.idEntity,
					guidEntity: action.guidEntity
				};
				break;
			case "Rule":
				//TODO
				break;
		}

		actionsList.push(action);
		self.setValue(actionsList);
		self.setDisplayValue(actionsList);
	},

	/**
	 * Remove action within value object
	 * @param index
	 */
	removeActionToQueue: function(index) {
		var self = this;
		var value = self.getValue();
		value.splice(index, 1);
		self.setValue(value);
		self.setDisplayValue(value);
	},
	/**
	 * Add the render data to the given collection in order to send data to the server
	 * @param renderValues
	 */
	collectData: function(renderValues) {
		var self = this;
		if(self.controlValueIsChanged()) {
			var properties = self.properties;
			var xpath = properties.xpath;
			var controlValue = self.getValue();
			var actions = [];
			$.each(controlValue, function(index, value) {
				var action = {};
				action.params = value.params || {};
				action.guidAction = value.guidObject || value.guidAction;
				action.displayName = value.displayName;
				action.guidConstructor = value.guidConstructor;
				action.actionType = value.actionType;
				action.xpathContext = value.xpathContext;
				action.guidEntity = value.guidEntity;
				actions.push(action);
			});
			renderValues[xpath] = (actions.length == 0) ? "" : JSON.encode(actions);
		}
	},

	/**
	 * Util to count how many actions are there
	 * @param action
	 * @return {number}
	 */
	countSameActions: function(action) {
		var self = this;
		var value = self.getValue();
		var count = 0;
		$.each(value, function(key, value) {
			if(value.guidAction == action.guidAction) {
				count++;
			}
		});
		return count;
	},

	/**
	 * Get list of tags
	 * @param taglist
	 * @return {Array}
	 */
	getTagList: function(taglist) {
		taglist = taglist || [];
		var result = [];

		for(var i = taglist.length; i > 0; i--) {
			result.push(taglist[i - 1].value);
		}
		return (result.length > 0) ? result : "";
	}
});