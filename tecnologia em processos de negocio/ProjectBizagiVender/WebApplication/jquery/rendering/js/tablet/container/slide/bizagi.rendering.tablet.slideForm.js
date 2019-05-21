/*
*   Name: BizAgi Tablet slide form implementation
*   Author: Andres Valencia
*   Comments:
*   -   Serves as an slide form that can render a inner form
*/

// Extends itself
$.Class.extend('bizagi.rendering.tablet.slideForm', {}, {

    /* CONSTRUCTOR
    =====================================================*/
    init: function (dataService, renderFactory, slideFormParams) {

        var self = this;

        // Define instance variables
        this.dataService = dataService;
        this.renderFactory = renderFactory;
        this.slideFormDeferred = new $.Deferred();
        this.slideFormParams = slideFormParams || {};

        // Create container    	
        self.slideForm = $('<div>').addClass('slideForm');

        // Apply slide plugin
        self.applySlidePlugin(self.slideForm)
		.done(function (data) {
		    self.slideFormDeferred.resolve(data);
		})
		.fail(
		    function () {
		        self.slideFormDeferred.reject();
		    });
        if (this.slideForm.parent().parent()) this.slideForm.parent().parent().scrollTop("0");

        //bug ipad whit add grid and into form exist other grid an this activate option add
        if (this.slideForm.parent().parent() && !this.slideForm.parent().parent().hasClass("scroll-content")) {
            this.slideForm.parent().parent().parent().scrollTop("0");
            this.slideForm.parent().parent().find(".ui-bizagi-form").hide();
        }


    },

    /*
    *   Shows the slideForm form container in the browser
    *   Returns a promise that the dialog will be closed
    */
    applySlidePlugin: function (slideForm) {

        var self = this;
        var dfd = new $.Deferred();

        // Create buttons object

        var objFormButtons = { buttons: [] };

        // If form is editable, add "save" button
        if (self.slideFormParams.showSaveButton) {
            objFormButtons.buttons.push({
                text: bizagi.localization.getResource("render-form-dialog-box-save"),
                click: function () {
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
            				        if (result == null || result == true || result.type == "success") {

            				            slideForm.parent().css('webkit-animation-name', 'slideFormExit');

            				            setTimeout(function () {
            				                // Resolve deferred
            				                dfd.resolve();

            				                // Close slide
            				                slideForm.slideContent("close");

            				                // Detach slideForm
            				                slideForm.parent().detach();
            				            }, 300);
            				        } else if (result.type == "validationMessages") {
            				            // Add validation messages 
            				            self.form.addValidationMessage(result.messages);

            				            var messageContainers = $(".ui-bizagi-notifications-container-bottom");
            				            $.each(messageContainers, function (i, elem) {
            				                if ($(elem).css("display") == "block") {
            				                    $(elem).appendTo("body");
            				                }
            				            });
            				        } else if (result.type == "error") {
            				            // Add error messages 
            				            self.form.addErrorMessage(result.message);
            				        }
            				    }).fail(function (dataFail) {

            				        var message = (dataFail.responseText) ? dataFail.responseText : ((typeof dataFail == "string") ? dataFail : dataFail.toString());
            				        //Convert String to object
            				        if (typeof message == "string") {
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


            				    });

                            } else {
                                slideForm.parent().css('webkit-animation-name', 'slideFormExit');

                                setTimeout(function () {
                                    // Close slide
                                    slideForm.slideContent("close");

                                    // Detach slideForm
                                    slideForm.parent().detach();

                                    //reject defered
                                    dfd.reject();
                                }, 300);
                            }
                        }
                    }
                }
            });
        }

        // Add cancel button by default
        objFormButtons.buttons.push({
            text: bizagi.localization.getResource("render-form-dialog-box-cancel"),
            click: function () {

                slideForm.parent().css('webkit-animation-name', 'slideFormExit');

                setTimeout(function () {

                    // Close slide
                    slideForm.slideContent("close");

                    // Detach slideForm
                    slideForm.parent().detach();

                    //reject defered
                    dfd.reject();
                }, 300);
            }
        });

        var slideOptions = $.extend(objFormButtons, this.slideFormParams);

        // Apply dialog plugin
        slideForm.slideContent(slideOptions);

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

        // Fill content
        self.renderSlideForm(self.slideForm, params);

        // Return promise
        return self.slideFormDeferred.promise();
    },

    /* RENDERS slideForm
    =====================================================*/
    renderSlideForm: function (slideForm, params) {

        var self = this;

        // Clear slideForm, because the refresh method could call this method again
        slideForm.empty();

        // Load template and data
        $.when(self.dataService.getFormData(params))
    	.pipe(function (data) {
    	    /*** SUCCESS FILTER **/

    	    // Apply editable param
    	    if (params.editable == false) data.form.properties.editable = false;

    	    // Render dialog template
    	    self.form = self.renderFactory.getContainer({
    	        type: "form",
    	        data: data.form
    	    });

    	    // Return rendering promise
    	    return self.form.render();
    	}, function (message) {
    	    /*** FAIL FILTER **/
    	    var errorTemplate = self.renderFactory.getCommonTemplate('form-error');
    	    $.tmpl(errorTemplate, { message: message }).appendTo(slideForm.find('.scroll-content'));
    	}
        ).done(function (element) {

            // Append form  in the dialog
            element.appendTo(slideForm);

            // Remove default form buttons
            $('.slideForm .ui-bizagi-button-container').remove();

            // Publish an event to check if the form has been set in the DOM
            self.form.triggerHandler('ondomincluded');

            // Attach a refresh handler to recreate all the form
            self.form.bind('refresh', function () {
                self.renderSlideForm(slideForm, params);
            });
        });
    }
});