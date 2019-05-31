/**
 * Show a startform within a dialog box
 * Based on dialog.form developed by Diego Parra
 *
 * @author Edward Morales
 */

$.Class.extend("bizagi.rendering.dialog.startForm", {
	POPUP_WIDTH: 900,
	POPUP_HEIGHT: 650
}, {

	/**
	 * Constructor
	 * @param dataService
	 * @param renderFactory
	 * @param dialogParams
	 */
	init: function(dataService, renderFactory, dialogParams) {
		var self = this;
		var doc = window.document;

		// Object whit reference and actions of buttons
		self.buttons = {};

		for(var item in dialogParams.extraButtons) {
			self.buttons[bizagi.localization.getResource(item)] = dialogParams.extraButtons[item];
		}

		// Define instance variables
		this.dataService = dataService;
		this.renderFactory = renderFactory;
		this.dialogDeferred = new $.Deferred();
		dialogParams = self.dialogParams = dialogParams || {};

		// Draw dialog box
		self.dialogBox = $("<div class='ui-bizagi-component-loading'/>");
		self.dialogBox.empty();
		self.dialogBox.appendTo("body", doc);

		// Create dialog box
		self.showDialogBox(self.dialogBox, dialogParams)
			.done(function(data) {
				self.dialogDeferred.resolve(data);
			})
			.fail(function() {
				self.dialogDeferred.reject();
			});
	},

	/*
	 *   Render the form
	 *   The params are the same that will be send to the ajax service
	 *   Returns a deferred
	 */
	render: function(params) {
		var self = this;

		// Fill dialog box
		self.renderDialogBox(self.dialogBox, params);

		// Return promise
		return self.dialogDeferred.promise();
	},
	/*
	 *   Shows the dialog box in the browser
	 *   Returns a promise that the dialog will be closed
	 */
	showDialogBox: function(dialogBox, dialogParams) {
		var self = this;

		// Define buttons
		var buttons = {};
		var defer = new $.Deferred();

		// Define options
		var showSaveButton = bizagi.util.parseBoolean(dialogParams.showSaveButton) !== null ? bizagi.util.parseBoolean(dialogParams.showSaveButton) : true;
		var showCancelButton = bizagi.util.parseBoolean(dialogParams.showCancelButton) !== null ? bizagi.util.parseBoolean(dialogParams.showCancelButton) : true;
		var saveButtonLabel = dialogParams.saveButtonLabel ? dialogParams.saveButtonLabel : bizagi.localization.getResource("render-form-dialog-box-save");
		var cancelButtonLabel = dialogParams.cancelButtonLabel ? dialogParams.cancelButtonLabel : bizagi.localization.getResource("render-form-dialog-box-cancel");
		var maximized = bizagi.util.parseBoolean(dialogParams.maximized) !== null ? bizagi.util.parseBoolean(dialogParams.maximized) : false;

		if(showSaveButton) {
			buttons[saveButtonLabel] = function() {
				if(self.form) {
					// Perform validations
					if(self.form.validateForm()) {

						// Collect data
						var data = {};

						if(dialogParams.forceCollectData) {
							// Turn on flag to force to collect all data on the form
							$.forceCollectData = true;
							self.form.collectRenderValues(data);
							// Turn off flag
							$.forceCollectData = false;
						} else {
							self.form.collectRenderValues(data);
						}

						if(dialogParams.allowGetOriginalFormValues) {

							data.formValues = self.form.children;
						}

						// Add page cache for this form
						data.idPageCache = self.form.getPageCache();

						// Call user callback
						if(dialogParams.onSave) {
							$.when(dialogParams.onSave(data))
								.done(function(result) {
									if(result == null || result == true || result.type == "success") {
										defer.resolve();
										self.closeDialogBox();
									} else if(result.type == "validationMessages") {
										// Add validation messages
										self.form.addValidationMessage(result.messages);
										// Update original value to use as reference to other futures changes in the dialogBox
										$.each(data, function(key) {
											var renders = self.form.getRenders(key);
											$.each(renders, function(i, render) {
												render.updateOriginalValue();
											});
										});
									} else if(result.type == "error") {
										// Add error messages
										self.form.addErrorMessage(result.message);
									}
								});

						} else {
							defer.resolve();
							self.closeDialogBox();
						}
					}
				}
			};
		}
		if(showCancelButton) {
			buttons[cancelButtonLabel] = function() {
				dialogParams.onCancel && dialogParams.onCancel();
				self.closeDialogBox();
			};
		}

		//Attach the desired extra buttons
		self.buttons = $.extend(buttons, self.buttons);

		// Creates a dialog
		dialogBox.dialog({
			width: this.Class.POPUP_WIDTH,
			height: this.Class.POPUP_HEIGHT,
			title: dialogParams.title,
			modal: true,
			buttons: self.buttons,
			resizable: false,  // This one is to avoid a memory leak, DO NOT CHANGE PLEASE
			maximized: maximized,
			open: function() {
				// only for windows 8 App
				if(typeof Windows !== "undefined") {
					$(window).bind("resize.dialog", self._appresize.bind(self));
					$(self.dialogBox).dialog('widget').show();
				}
				if(maximized) {
					// remove scroll bar
					$("body", window.document).css("position", "fixed");
				}
			},
			close: function() {
				if(typeof Windows !== "undefined") {
					$(window).unbind("resize.dialog");
				}

				// set scroll bar
				$("body", window.document).css("position", "static");

				defer.reject();
				self.closeDialogBox();
			},
			resizeStop: function(event, ui) {
				if(self.form) {
					self.form.resize(ui.size);
				}
			}
		});

		self.adjustOverlay();

		// Return promise
		return defer.promise();
	},
	_appresize: function() {
		var self = this;
		$(self.dialogBox).dialog('widget').css({
			left: ((window.screen.width / 2) - (self.Class.POPUP_WIDTH / 2)) + "px",
			top: ((window.screen.height / 2) - (self.Class.POPUP_HEIGHT / 2)) + "px",
			width: self.Class.POPUP_WIDTH + "px",
			height: self.Class.POPUP_HEIGHT + "px"
		}).show();

	},
	/*
	 *   Closes the dialog box
	 */
	closeDialogBox: function() {
		var self = this;
		var dialogBox = self.dialogBox;
		// set scroll bar
		$("body", window.document).css("position", "static");
		dialogBox.dialog('destroy');
		dialogBox.remove();
		self.dispose();
	},

	/*
	 * Renders the dialog box content
	 */
	renderDialogBox: function(dialogBox, params) {
		var self = this;
		var def = new $.Deferred();

		// Clear dialog box
		dialogBox.empty();

		// Check context
		try {
			if(self.form && self.form.params.data.contextType) {
				params.contextType = self.form.params.data.contextType;
			}
		} catch(e) {
		}

		// Load template and data
		return $.when(self.dataService.getStartForm(params)).pipe(function(data) {

			// Apply contextType
			data.form.contextType = params.contextType;

			// Apply editable param
			if(params.editable == false) {
				data.form.properties.editable = false;

				// The actions don't apply in dialog form
				self.removeActions(data.form);
			}

			// The transitions don't apply in dialog form
			self.removeTransitions(data.form);

			// Render dialog template
			self.form = self.renderFactory.getContainer({
				type: "form",
				data: data.form,
				focus: params.focus || false,
				selectedTabs: params.selectedTabs,
				isRefresh: params.isRefresh || false
			});

			def.resolve(self.form);

			// Return rendering promise
			return self.form.render();
		}, function(message) {
			/*** FAIL FILTER **/
			var errorTemplate = self.renderFactory.getCommonTemplate("form-error");
			if(typeof message == "object" && message.responseText) {
				var objMessage = JSON.parse(message.responseText);
				message = "Error:" + objMessage.errorType + "<br>" + objMessage.message || " Error in form ";
			}

			// Clear dialog box
			$("*", dialogBox).remove();

			$.tmpl(errorTemplate, {
				message: message
			}).appendTo(dialogBox);
		}).done(function(element) {
			// Remove button container
			$(".ui-bizagi-button-container", element).remove();

			// Append form  in the dialog
			$('.ui-bizagi-loading-message', dialogBox).remove();
			dialogBox.data("loading", false);
			dialogBox.removeClass("ui-bizagi-component-loading");
			dialogBox.html(element);

			// Customize dialog box
			dialogBox = self.customizeDialogBox(dialogBox);

			// Publish an event to check if the form has been set in the DOM
			self.form.triggerHandler("ondomincluded");

			setTimeout(function() {
				if(self.dialogParams.maximized) {
					var instance = self.dialogBox.data("ui-dialog");
					instance.recalculate && instance.recalculate();
				}
			}, 650);


			// Attach a refresh handler to recreate all the form
			self.form.bind("refresh", function(_, refreshParams) {
				// Check current scroll in parent
				refreshParams = $.extend({
					focus: focus,
					selectedTabs: self.form.getSelectedTabs(),
					isRefresh: true
				}, params, refreshParams);

				return self.renderDialogBox(dialogBox, refreshParams);
			});
		});

		return def.promise();
	},
	/*
	 *   This method can be overriden in order to customize the dialog form rendering
	 */
	customizeDialogBox: function(dialogBox) {
		return dialogBox;
	},

	/*
	 * This method removes the transitions
	 */
	removeTransitions: function(data) {
		data = data || {};

		if(data.transitions) {
			delete data.transitions;
		}
	},

	/*
	 * This method removes the actions
	 */
	removeActions: function(data) {
		data = data || {};

		if(data.actions) {
			delete data.actions;
		}
	},

	dispose: function() {
		var self = this;
		if(self.form) {
			self.form.dispose();
		}
		bizagi.util.dispose(self.buttons);
		bizagi.util.dispose(self);
	},

	adjustOverlay: function() {
		var overlay = $(".ui-widget-overlay");
		var body = $("body");
		var overlayHeight = parseInt(overlay.height()), overlayBody = parseInt(body.height());

		if(overlayHeight < overlayBody) {
			overlay.height(overlayBody);
		}
	}
});
