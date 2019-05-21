/*
*   Name: BizAgi Tablet slide view implementation
*   Author: Richar Urbano - RicharU
*   Comments:
*   -   Serves as an slide form that can render a inner form
*/

// Extends itself
$.Class.extend("bizagi.rendering.tablet.slide.view", {}, {
    /* CONSTRUCTOR
    =====================================================*/
    init: function (dataService, renderFactory, slideFormParams) {
        var self = this;

        // Define instance variables
        self.dataService = dataService;
        self.renderFactory = renderFactory;
        self.slideFormParams = slideFormParams || {};

        if (!self.slideFormDeferred) {
            self.slideFormDeferred = new $.Deferred();
        }

        self.container = self.slideFormParams.navigation.createRenderContainer({ title: self.slideFormParams.title });
    },

    buttons: [],
    processButtons: function () {
      var self = this;
      var dfd = new $.Deferred();

      var onSaveClick = function onSaveClick () {
        if (self.form) {
          // Perform validations
          if (self.form.validateForm()) {

            // Collect data
            var data = {};
            self.form.collectRenderValues(data);

            if (self.slideFormParams.allowGetOriginalFormValues) {
              data.formValues = self.form.children;
            }

            // Add page cache for this form
            data.idPageCache = self.form.getPageCache();

            // Call user callback
            if (self.slideFormParams.onSave) {
              $.when(self.slideFormParams.onSave(data))
                .done(function (result) {
                  if ( !result || result === true || result.type === "success") {
                    // Close slide
                    self.goBack();

                    // Resolve deferred
                    dfd.resolve();

                  } else if (result.type === "validationMessages") {
                    // Add validation messages
                    self.form.addValidationMessage(result.messages);
                  } else if (result.type === "error") {
                    // Add error messages
                    self.form.addErrorMessage(result.message);
                  }
                }).fail(function (dataFail) {

                var message = (dataFail.responseText) ? dataFail.responseText : ((typeof dataFail === "string") ? dataFail : dataFail.toString());

                // Convert String to object
                if (typeof message === "string") {
                  try {
                    message = JSON.parse(message).message;
                  } catch (e) {
                    message = message.match(/"message":(.*)",/)[0];
                    message = message.substr(11, message.length - 13);
                  }

                } else if (!message.message) {
                  message = dataFail;
                }

                self.form.validateForm();
                self.form.clearValidationMessages();
                self.form.addValidationMessage(message);

                // Close slide
                self.goBack();

                //reject defered
                dfd.reject();
              });

            } else {
              // Close slide
              self.goBack();

              //reject defered
              dfd.reject();
            }
          }
        }
      };

      var onCancelClick = function onCancelClick () {
        // Close slide
        self.goBack();
        //reject defered
        dfd.reject();
      };

      self.buttons = [
        {
          "caption": bizagi.localization.getResource("render-form-dialog-box-save"),
          "actions": ["submitData", "refresh"],
          "submitData": true,
          "refresh": true,
          "ordinal": 0,
          "action": "save",
          "save": true,
          "style": "",
          callback: onSaveClick,
        },
        {
          "caption": bizagi.localization.getResource("render-form-dialog-box-close"),
          "actions": ["submitData", "refresh"],
          "submitData": true,
          "refresh": true,
          "ordinal": 1,
          "action": "back",
          "save": true,
          "style": "",
          callback: onCancelClick,
        },
      ];

      // Create buttons object
      var objFormButtons = {buttons: []};

      // If form is editable, add "save" button
      if (!self.slideFormParams.showSaveButton) {
          self.buttons.shift();
      }

      self.buttons.map(function(button){
        objFormButtons.buttons.push({
          text: button.caption,
          click: button.callback,
        });
      });

      // Render Currents buttons
      var slideOptions = $.extend(objFormButtons, this.slideFormParams);
      self._renderButtons(slideOptions);

      // Return promise
      return dfd.promise();
    },

    /*
    *   Render the form
    *   The params are the same that will be send to the ajax service
    *   Returns a deferred
    */
    render: function (params) {
        var self = this;

        self.processButtons()
            .done(function (data) {
                self.slideFormDeferred.resolve(data);
            }).fail(function () {
                self.slideFormDeferred.reject();
            });

        // Fill content
        self.renderSlideForm(self.slideForm, params);

        // Return promise
        return self.slideFormDeferred.promise();
    },

    /* RENDERS slideForm
    =====================================================*/
    renderSlideForm: function(slideForm, params) {

        var self = this;
        var defer = new $.Deferred();

        bizagiLoader().start();

        // Load template and data
        $.when(self.dataService.getFormData(params))
            .then(function(data) {
                /*** SUCCESS FILTER **/
                if (params.recordXPath) {
                    data.form.properties.recordXpath = params.recordXPath;
                }

                // Apply editable param
                if (!self.slideFormParams.showSaveButton || params.editable === false) {
                    data.form.properties.editable = false; 
	    	        }

	    	        if (typeof (data.form.properties) !== "undefined"){
                    data.form.properties.orientation = self.slideFormParams.orientation || "ltr";
                }

                // Render dialog template
                self.form = self.renderFactory.getContainer({
                    type: "form",
                    data: data.form,
                    navigation: self.slideFormParams.navigation
                });

                self.form.params = params.formParams;
                self.form.buttons = self.buttons;

                // Return rendering promise
                return self.form.render();

            }).done(function(element) {

                // Append form in the slide view
                self.container.element.html(element);

                if (!params.isRefresh) {
                    self.slideFormParams.navigation.navigate(self.container.id);
                }

                // Remove default form buttons
                $(".ui-bizagi-button-container .action-button", self.form.container).remove();
                // Add Button
                $(".ui-bizagi-button-container", self.form.container).append(self.buttonContainer);

                // Publish an event to check if the form has been set in the DOM
                self.form.triggerHandler("ondomincluded");

                // Attach a refresh handler to recreate all the form
                self.form.bind("refresh", function(data, refreshParams) {
                    refreshParams.formParams = refreshParams.params || self.form.params;
                    self.render(refreshParams);
                });
            }).fail(function(message) {
                /*** Form load failure ***/

                var errorTemplate = self.renderFactory.getCommonTemplate("form-error");
                var error_message = message.message || "Error";

                $.tmpl(errorTemplate, { message: error_message }).appendTo(self.container.element);
                // Navigate on view
                self.slideFormParams.navigation.navigate(self.container.id);
            }).always(function() {
                bizagiLoader().stop();
            });

        return defer.promise();
    },

    // Go back and destroy
    goBack: function () {
        this.container.destroy();
    },

    /**
     * Process render buttons
     */
    _renderButtons: function (options) {
        var self = this;
        var content = $("<div class='bz-slide-button-container'></div>");

        $.each(options.buttons, function (ui, value) {
            $("<div class='action-button'>" + value.text + "</div>").click(
                value.click
            ).appendTo(content);
        });

        self.buttonContainer = content;
    }
});