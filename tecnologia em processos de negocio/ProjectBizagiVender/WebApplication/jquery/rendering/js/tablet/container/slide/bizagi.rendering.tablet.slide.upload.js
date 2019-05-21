
/*
*   Name: BizAgi Tablet slide Upload implementation
*   Author: Diego Parra
*   Comments:
*   -   Serves as an slide view that will show an upload file without exiting the application
*/

// Extends itself
$.Class.extend('bizagi.rendering.tablet.slide.upload', {}, {

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
        self.slideForm = $('<div>').addClass('slide-upload');

        // Apply slide plugin
        self.applySlidePlugin(self.slideForm)
		.done(function (data) {
		    self.slideFormDeferred.resolve(data);
		})
		.fail(function () {
		    self.slideFormDeferred.reject();
		});
    },

    /*
    *   Shows the slideForm form container in the browser
    *   Returns a promise that the dialog will be closed
    */
    applySlidePlugin: function (slideForm) {
        var dfd = new $.Deferred();

        // Create buttons object
        var slideOptions = { buttons: [] };

        // Add cancel button by default
        slideOptions.buttons.push({
            text: bizagi.localization.getResource("workportal-case-dialog-box-close"),
            click: function () {
                // Close slide

                slideForm.slideContent("close");

                // Detach slideForm
                slideForm.parent().detach();

                //reject defered
                dfd.reject();
            }
    
        }/*,          
            {
                   text:bizagi.localization.getResource("render-tablet-slide-upload-link"),
                   click: function () {
                       // Close slide

                       slideForm.slideContent("close");

                       // Detach slideForm
                       slideForm.parent().detach();

                       //reject defered
                       dfd.reject();
                   }
            }*/
        
    
    );

        // Apply dialog plugin
        slideOptions = $.extend(slideOptions, this.slideFormParams);
        slideForm.slideContent(slideOptions);

        // Return promise
        return dfd.promise();
    },

    /*
    *   Render the grid view form
    *   The params are the same that will be send to the ajax service
    *   Returns a deferred
    */
    render: function (params) {
        var self = this;

        // Fill content
        self.renderUploadFile(self.slideForm, params);

        // Return promise
        return self.slideFormDeferred.promise();
    },

    /* Render the file inside a frame
    =====================================================*/
    renderUploadFile: function (slideForm, params) {
        var self = this;
        var template = self.renderFactory.getCommonTemplate("uploadSlide");

        // Render template
        var content = $.tmpl(template, {
            url: params.url
        }).appendTo(slideForm);

        content.find(".ui-slide-upload-link").click(function () {
            $.when(bizagi.showConfirmationBox(bizagi.localization.getResource("render-tablet-slide-upload-confirmation")))
			.done(function () {
			    window.location.href = params.url;
			});
        });
    }
});