/**
 * Device definition of Polymorphic launcher
 *
 * @author: Ricardo Perez
 */

bizagi.rendering.polymorphicLauncher.extend("bizagi.rendering.polymorphicLauncher", {}, {
	/**
	 * Render a specific implementation for Tablet device
	 */
	postRender: function() {
		var self = this;
		var properties = self.properties;
		var mode = self.getMode();
		var html, template;

		if(mode == "design" || !self.properties.surrogatedKey) {
			return "";
		}

		self.configureQueueVisibility();

		/**
		 * Define params to get list of actions
		 */
		return $.when(self.dataService.multiaction().getPolymorphicActions(self.processPropertyValueArgs)).done(function(response) {
			// Convert default response to tree data structure
			response = self.dataService.serializePolymorphicActions(response);
			self.totalActions = bizagi.clone(response);
			var actions = bizagi.clone(response);
			self.lessActions = bizagi.clone(actions);

			// NOTE: Code extracted
			var templateArguments = {
				actions: actions,
				allowSearch: properties.allowSearch,
				treeActionsList: self.getTreeItems(actions)
			};
			template = self.renderFactory.getTemplate("render-polymorphicLauncher-vertical-tree");

			var control = self.getControl();
			var actionsContainer = $(".bz-polymorphic-launcher-constructors-container", control);
			actionsContainer.append($.fasttmpl(template, templateArguments));
			self.bindHandlers();
		});
	},

	/**
	 * Get rendered html of each node of constructors
	 * @param actions
	 * @param level
	 * @return {string}
	 */
	getTreeItems: function(actions, level) {
		var self = this;
		var item = "<ul>";
		var templateTreeItem = self.renderFactory.getTemplate("render-polymorphicLauncher-vertical-tree-item");
		actions = actions || {};
		level = level || 1;

		$.each(actions, function(key, value) {
			item += $.fasttmpl(templateTreeItem, value);

			if(value.children) {
				item += self.getTreeItems(value.children, level + 1);
			}
		});
        item += "</ul>";
        return item;
	},

	/**
	 * Add binding to html elements
	 */
	bindHandlers: function() {
		var self = this;
		var control = self.getControl();
        var actionLauncherControls = $(".bz-polymorphic-launcher-constructors-container li span", control);

		//Binding for click action on buttons
		actionLauncherControls.on("click", function() {
			var $targetData = $(this).parent();
			var action = {
				guidEntity: $targetData.data("guidentity"),
				guidObject: $targetData.data("guidobject"),
				guidConstructor: $targetData.data("guidconstructor"),
				displayName: $targetData.data("display-name"),
				actionType: $targetData.data("action-type"),
				xpathContext: $targetData.data("xpathcontext")
			};
			self.onActionClicked(action);
		});
		//Catch the typed text in the search field and filter the action list
		$.expr[":"].FilterAction = function(entity, i, array) {
			var search = array[3];
			if(!search) {
				return false;
			}
			return new RegExp(search, "i").test($(entity).text());
		};
        $("input#ui-bizagi-render-action-launcher-filter-input", control).keyup(function() {
            var search = $(this).val();
            $(".bz-polymorphic-launcher-constructors-container li", control).show();
            if(search) {
                $(".bz-polymorphic-launcher-constructors-container li", control).not(":FilterAction(" + search + ")").hide();
            }
        });

	},
	/**
	 * Execute an Action
	 * @param action
	 */
	onActionClicked: function(action) {
		var self = this;

		$.when(self.actionManager(action)).done(function(act) {
			self.executeAction(act);
		});
	},
	/**
	 * Show a message when action has been executed
	 * @param status
	 * @param action
	 */
	notifyExecution: function(status, action) {
		var self = this;
		if(status == "success"){
			$.notifier.add({
                class_name: "success",
                title: action.displayName,
                text: self.getResource("render-action-launcher-success-excecution").replace('%s',  action.displayName),
                sticky: false
            });

		}else{
			$.notifier.add({
                class_name: "error",
                title: action.displayName,
                text: self.getResource("render-action-launcher-failed-excecution").replace('%s',  action.displayName),
                sticky: false
            });
		}
	},
	/**
	 * Show a dialog with a form
	 * @param action
	 * @return {*}
	 */
	processActionForm: function(action) {
		var self = this;
		var properties = self.properties;
		var form = self.getFormContainer();
		var additionalXpaths = self.properties.additionalXpath.join(",");
		var def = new $.Deferred();
		var xpathContext = action.xpathContext || "";
		var formParams = form.getParams();

        var recordXpath = self.properties.recordXpath;

		// Show dialog with new form after that
        var slideForm = new bizagi.rendering.tablet.slide.form(self.dataService, self.renderFactory,{
			title: properties.detailLabel || bizagi.localization.getResource("render-grid-details-form"),
			navigation: formParams.navigation,
			showSaveButton: true,
			cancelButtonLabel: bizagi.localization.getResource("render-form-dialog-box-close"),
			onSave: function(data) {
				var pageCache = data.idPageCache;
				data.idPageCache = null;
				// Submit the form
				return self.dataService.multiaction().submitData({
					action: "SAVE",
					data: data,
                    xpathContext: slideForm.form.properties.xpathContext, //self.properties.xpathContext,
					idPageCache: pageCache,
					isOfflineForm: false,
					isActionStartForm: true
				}).pipe(function(savedData) {
					if(!action.editMode && self.countSameActions(action) == 0) {
						action.idStartScope = savedData.IdScope;
					}
					def.resolve(savedData.IdScope);
				});
			},
			onCancel: function(data) {

			}
		});

        slideForm.render({
			"idForm": action.guidObject,
			"contextType": "entity",
			"guidEntity": action.guidEntity,
			"idCase": self.properties.caseId,
			"idWorkitem": self.typeForm != "SummaryForm" ? formParams.idWorkitem : undefined,
			"additionalXpaths": additionalXpaths,
			//"xpathContext": xpathContext,
			"idStartScope": action.idStartScope,
			"surrogateKey": self.properties.surrogatedKey,
            "recordXpath": recordXpath
		});

		return def.promise();
	},

	/**
	 * Process a start form
	 * @param args
	 * @return {*}
	 */
	processStartForm: function(args) {
		var self = this;
		var properties = self.properties;
		var form = self.getFormContainer();
		var def = new $.Deferred();
		var formParams = form.getParams();
		args = args || {};


        var slideForm = new bizagi.rendering.tablet.startForm(self.dataService, self.renderFactory,{
			//showSaveButton: properties.editable,
			maximized: properties.maximized,
			title: args.title || "",
			navigation: formParams.navigation,
			saveButtonLabel: (self.typeForm == "GlobalForm" || this.typeForm == "SummaryForm") ? bizagi.localization.getResource("render-form-button-create") : bizagi.localization.getResource("render-form-dialog-box-save"),
			onSave: function(data) {
				form.startLoading();

				// Submit the form
				return self.dataService.multiaction().submitData({
					action: "SAVE",
					data: data,
					xpathContext: self.properties.xpathContext,
					idPageCache: data.idPageCache,
					isOfflineForm: false,
					isActionStartForm: true
				}).pipe(function(savedData) {
					form.endLoading();
					def.resolve(savedData.IdScope);
				});
			}
		});

        slideForm.render({
			guidprocess: args.guidprocess,
			idStartScope: args.idStartScope,
			idCase: self.properties.caseId,
            idWorkitem: self.typeForm != "SummaryForm" ? formParams.idWorkitem : undefined,
			additionalXpaths: self.properties.additionalXpath.join(","),
			surrogatedKey: self.properties.surrogatedKey,
            recordXpath: args.recordXpath,
            mappingstakeholders: true
		});

		return def.promise();
	},
	/**
	 * Execute and action if a form is global form or summary, or send to queue
	 * @param action
	 */
	executeAction: function(action) {
		var self = this;

		if (self.typeForm == "GlobalForm" || self.typeForm == "SummaryForm") {
            if (confirm(bizagi.localization.getResource("render-action-launcher-immediatly-action-confirmation"))) {
                self.executeActionImmediately(action);
            }
		} else {
			self.addActionToQueue(action);
		}
	},
    /**
     * Show confirmation dialog
     * @param action
     */
    showConfirmationDialog: function(action) {
        var self = this;

        if (confirm(bizagi.localization.getResource("render-action-launcher-single-action-confirmation"))) {
            self.setValue([]);
            $.when(self.actionManager(action)).done(function(act){
                self.executeAction(act);
            });
        }
    },
	/**
	 * Render actual value of control and set events
	 * @param data
	 */
	setDisplayValue: function(data) {
		var self = this;
		var control = self.getControl();
        var actionsToExecuteContainer = $(".bz-polymorphic-launcher-constructors-to-execute-container", control);
		var template = self.renderFactory.getTemplate("render-polymorphicLauncher-actions-to-execute");
		self.configureQueueVisibility();

		$.when($.fasttmpl(template, {actions: data})).done(function(html) {
			actionsToExecuteContainer.empty();
			actionsToExecuteContainer.append(html);
                var removeActionSelector = $(".action-to-execute-control .delete-action", actionsToExecuteContainer);
                var openActionSelector = $(".action-to-execute-control label", actionsToExecuteContainer);
                removeActionSelector.on("click", function() {
				var index = $(this).parent().data("index");
				self.removeActionToQueue(index);
			});
			openActionSelector.bind("click", function() {
				var $target = $(this).parent();
				var type = $target.data("actiontype");
				var guidprocess = $target.data("guidprocess");
				var idStartScope = $target.data("idstartscope");
				var title = $target.data("title");
			    var xpathContext = $target.data("xpathcontext");
				var idEntity = $target.data("identity") || "";
				var guidEntity = $target.data("guidentity");
                var recordXpath = xpathContext || self.properties.xpathContext;

				switch(type) {
					case "Process":
						if(idStartScope) {
							self.processStartForm({
								guidprocess: guidprocess,
								idStartScope: idStartScope,
								title: title,
								xpathContext: xpathContext,
                                recordXpath: recordXpath
							});
						}
						break;
					case "Form":
						var action = {
							guidProcess: guidprocess,
							idStartScope: idStartScope,
							editMode: true,
							xpathContext: xpathContext,
							idEntity: idEntity,
							guidEntity: guidEntity,
							guidObject: guidprocess
						};

						self.processActionForm(action);
						break;
					case "Rule":
						// Rules dont have forms or something like that
						break;
				}
			});
		});
	},
	/**
	 * Show container if it has actions
	 */
	configureQueueVisibility: function() {
		var self = this;
		var control = self.getControl();
        var actionsToExecuteContainer = $(".bz-polymorphic-launcher-constructors-to-execute-container", control);
		var actionsToExecuteTitle = $(".actions-to-execute-title", control);
		if(self.getValue().length > 0) {
			actionsToExecuteContainer.show();
			actionsToExecuteTitle.show();
		} else {
			actionsToExecuteContainer.hide();
			actionsToExecuteTitle.hide();
		}
	}
});