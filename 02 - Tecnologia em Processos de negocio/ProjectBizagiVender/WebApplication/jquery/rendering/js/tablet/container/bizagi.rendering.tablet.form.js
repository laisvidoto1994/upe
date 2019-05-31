/*
*   Name: BizAgi Tablet Form Extension
*   Author: Diego Parra
*   Comments:
*   -   This script will redefine the container class to adjust to tablet devices
*   -   Will apply a desktop form template
*/

// Auto extend
bizagi.rendering.form.extend("bizagi.rendering.form", {
	
	/* CONSTRUCTOR
	======================================================*/
	init: function (params) {
		var self = this;
		
		// Define variables
		self.warnings = {};
		self.errors = {};

		// Call base
		this._super(params);
	},
	
	/*  Template method to implement in each device to customize each container after processed
	======================================================*/
	postRenderContainer: function (container) {
		var self = this;
		var properties = self.properties;
		self._super(container);
		var buttons = self.getButtons();

		$(self).on("onRefreshStarted", function () {
		    $(".render-form > div:first-child").removeClass("scroll-content");
		});

		$(self).on("onRefreshFinished", function () {
		    $(".render-form > div:first-child").addClass("scroll-content");
		});
	    
		// Show warnings
		if (!bizagi.util.isObjectEmpty(self.warnings)) {
			var warningContainer = $('<ul class="ui-bizagi-form-warnings"></ul>');
			for (var key in self.warnings) {
				warningContainer.append($('<li>' + key + '</li>'));
			}

			// Add button
			// Changed warning style due to bug http://devs-jbizagi/redmine/issues/show/2232
			$("<button>" + "X" + "</button>").appendTo(warningContainer);
			
			// Append to body 
			warningContainer.prependTo(self.container);
			warningContainer.click(function() {
				warningContainer.detach();
			});
		}
		
		// Show errors
		if (!bizagi.util.isObjectEmpty(self.errors)) {
			var errorContainer = $('<ul class="ui-bizagi-form-errors"></ul>');
			for (var ekey in self.errors) {
				errorContainer.append($('<li>' + ekey + '</li>'));
			}
			
			// Add button
			// Changed warning style due to bug http://devs-jbizagi/redmine/issues/show/2232
			$("<button>" + "X" + "</button>").prependTo(errorContainer);
			
			// Append to body 
			errorContainer.appendTo(self.container);
			errorContainer.click(function() {
				errorContainer.detach();
			});
			
			// Hide routing buttons when an error was found
			$.each(properties.buttons, function(i, button) {
				if (button.routing) {
					self.getButtons().eq(i).prop("disabled", true);
				}
			});
		}

		//Set button length
		var lengthButtons = (buttons) ? buttons.length : 0;

		if (lengthButtons) {

			$(document).data('auto-save', 'auto-save');

			//bind event auto-save
			$(document).unbind("save-form").bind("save-form", function (e, deferredSave) {
				self.autoSaveEvents(deferredSave);
			});

			//bind event beforeunload
			$(window).unbind('beforeunload').bind('beforeunload', function (e) {

				var newData = {};
				self.collectRenderValues(newData);
				//if there are changes in the form show a message
				if (!$.isEmptyObject(newData) && $(document).data('auto-save')) {

					return bizagi.localization.getResource("confirmation-savebox-message2");
				}

				return;

			});

		}
		
	},
	/*
    * Auto Save Events
    */
    autoSaveEvents: function (deferredSave, saveBox) {

        var self = this;
        var data = {};
        self.collectRenderValues(data);

        if (!$.isEmptyObject(data)) {

            $.when(bizagi.showSaveBox(bizagi.localization.getResource("confirmation-savebox-message1"), "Bizagi", "warning")).done(function () {
                self.saveForm();
                deferredSave.resolve();
            }).fail(function () {
                deferredSave.resolve();
            });

        } else {
            deferredSave.resolve();
        }

    },
    
	checkWidgetsData : function() {
		var popupResponse = null;
		if(bizagi.workportal.tablet.popup) {
			if(bizagi.workportal.tablet.popup.instance) {
				if(bizagi.workportal.tablet.popup.instance.getResponseValues) {
					popupResponse = bizagi.workportal.tablet.popup.instance.getResponseValues(bizagi.workportal.tablet.popup.instance.getResponseValuesParams);
					if(popupResponse === null) {
						bizagi.showMessageBox(bizagi.localization.getResource("workportal-widget-complexgateway-path"), bizagi.localization.getResource("render-widget-complexgateway-error"));
						return -1;
					} else {
						bizagi.workportal.tablet.popup.instance.dontClose = false;
						bizagi.workportal.tablet.popup.instance.close();
					}
				}
			}
		}
		return popupResponse;
	},
	
	repaintComplexGateway : function() {
		var self = this;
		if(self.focus !== undefined) {
			if(self.focus.idCaseObject !== undefined) {
				if(self.focus.idCaseObject.isComplex !== undefined) {
					self.dataService.getWorkitems({
						idCase: self.focus.idCaseObject.idCase
					}).done(function(data) {
						if(data.workItems.length == 1) {
							if(data.workItems[0].taskType == "ComplexGateway") {
								var transitions = data.workItems[0].transitions;
								
								self.currentPopup = "complexgateway";
								$(document).triggerHandler("popupWidget", {
									widgetName : bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_COMPLEXGATEWAY,
									options : {
										transitions : transitions,
										sourceElement: ".ui-bizagi-form",
										insertAfter : ".ui-bizagi-form .ui-bizagi-button-container",
										height: 'auto',
										offset: "8 0", //x y
										activeScroll: false,
										dontClose : true,
										closed: function () {
											self.currentPopup = null;
										}
									}
								});
							}
						}
					});
				}
			}
		}
	},
	
  
   /* TEMPLATE METHOD TO GET THE BUTTONS OBJECTS
   ======================================================*/
	getButtons: function () {
		var self = this;
		var container = self.container;

		return $(".ui-bizagi-button-container :button", container);
	},
	
	/* METHOD TO ADD WARNINGS TO THE FORM
   ======================================================*/
	addWarning: function (message) {
		var self = this;
		self.warnings[message] = message;
	},
	
	/* METHOD TO ADD ERRORS TO THE FORM
   ======================================================*/
	addError: function (message) {
		var self = this;
		self.errors[message] = message;
	},
	
	/*  Executes a single button action
	======================================================= */
	processButton: function (buttonProperties) {
		var self = this;
		
		// Disable routing button
		if (!bizagi.util.isObjectEmpty(self.errors)) {
			if (bizagi.util.parseBoolean(buttonProperties.routing)) return;
		}

		// Call base
		this._super(buttonProperties);
	}

});