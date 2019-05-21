
/*
*   Name: Bizagi Tablet slide view Upload implementation
*   Author: Richar Urbano - RicharU
*   Comments:
*   -   Serves as an slide view that will show an upload file without exiting the application
*/

// Extends itself
$.Class.extend('bizagi.rendering.tablet.slide.view.upload', {}, {
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
        self.slideContainer = self.slideFormParams.navigation.createRenderContainer({title : self.slideFormParams.title});

        self.processButtons()
            .done(function (data) {
                self.slideFormDeferred.resolve(data);
            }).fail(function () {
                self.slideFormDeferred.reject();
            });
    },

    /**
     * Shows the slideForm form container in the browser 
     * @returns {} Returns a promise that the dialog will be closed
     */
    processButtons: function () {
        var self = this;
        var dfd = new $.Deferred();

        // Create buttons object
        var slideOptions = { buttons: [] };

        // Add cancel button by default
        slideOptions.buttons.push({
            text: bizagi.localization.getResource("workportal-case-dialog-box-close"),
            click: function () {

                // Close slide      
                self.goBack();

                //reject defered
                dfd.reject();
            }
        });

        // Apply dialog plugin
        slideOptions = $.extend(slideOptions, this.slideFormParams);
        self._renderButtons(slideOptions);

        // Return promise
        return dfd.promise();
    },

    /**
     * Render the grid view form
     * The params are the same that will be send to the ajax service
     * @param {} params 
     * @returns {} Returns a deferred
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
        var content = $.tmpl(template, { url: params.url });

        // Append content in the slide view
        self.slideContainer.element.html(content);

        // Add Button
        $('.ui-bizagi-button-container', self.slideContainer).append(self.buttonContainer);

        // Navigate on view
        self.slideFormParams.navigation.navigate(self.slideContainer.id);

        content.find(".ui-slide-upload-link").click(function () {
            $.when(bizagi.showConfirmationBox(bizagi.localization.getResource("render-tablet-slide-upload-confirmation")))
                .done(function () {
                    window.location.href = params.url;
                });
        });
    },

    /**
     * Go back and destroy
     * @returns {} 
     */
    goBack: function () {
        var self = this;

        self.slideContainer.destroy();
    },

    /**
     * Process render buttons
     * @param {} options 
     * @returns {} 
     */
    _renderButtons: function (options) {
        var self = this;
        var content = $("<div class='bz-slide-button-container'></div>");

        $.each(options.buttons, function (ui, value) {
            var button = $("<div class='action-button'>" + value.text + "</div>").click(
                value.click
            ).appendTo(content);
        });

        self.buttonContainer = content;
    }
});