/*
 *   Name: BizAgi Render Image Class
 *   Author: Edward J Morales
 *   Comments:
 *   -   This script will redefine the image render class to adjust to desktop devices
 */

// TODO: DELETE THIS FILE, WE DONT USE FLASH PLUGIN ANYMORE


// Extends itself
bizagi.rendering.image.extend("bizagi.rendering.image", {}, {
    /*
     *   Template method to implement in each device to customize each render after processed
     */
    postRender: function() {
        var self = this;
        var properties = self.properties;
        var control = self.getControl();
        var mode = self.getMode();
        var template = self.renderFactory.getTemplate("image-flash");
        var url = "";

        // Flash to define flash version
        self.properties.flashVersion = true;

        // Render template
        var html = $.fasttmpl(template, {
            xpath: bizagi.util.encodeXpath(self.getUploadXpath()),
            editable: properties.editable,
            url: self.properties.url,
            allowDelete: properties.allowDelete,
            mode: mode
        });

        $(".ui-bizagi-render-upload-wrapper", control).append(html);

        $('a', control).css({
            height: self.properties.height + "px",
            width: self.properties.width + "px"
        });

        $(".img, .ui-bizagi-render-image-wrapper .image-file", control).css({
            width: self.properties.width + "px",
            height: self.properties.height + "px"
        });

        $(".ui-bizagi-render-image-wrapper .image-file", control).addClass('w-size-' + self.properties.width);

    },
    /*
     *   Template method to implement in each device to customize the render's behaviour to add handlers
     */
    configureHandlers: function() {
        var self = this;
        var control = self.getControl();
        // Call base
        self._super();

        // DiegoP: swfobject plugin does not work if the object does not exist in the dom so 
        // we need to run this when the form has been set in the dom
        self.ready().done(function() {
            var fileInput = $(".ui-bizagi-render-upload-wrapper input", control);
            if (fileInput.length > 0 && self.properties.editable) {
                self.applyUploadPlugin();
            }
        });
    },
    /*
     *   Template method to implement in each device to customize the render's behaviour when rendering in design mode
     */
    configureDesignView: function() {
        var self = this;
        var control = self.getControl();
        // Call base
        self._super();
        $("*:not(.ui-bizagi-render-control-required)", control).css({
            padding: "0px",
            margin: "0px",
            border: "0px",
            'line-height': '0px',
            position: 'relative',
            display: 'table',
            top: '0'
        });

        $(".image-file", control).css({
            width: self.properties.width + "px",
            height: self.properties.height + "px"
        });
    },
    /*
     *   Template method to implement in each device to customize each render after processed in read-only mode
     */
    postRenderReadOnly: function() {
        var self = this;
        var control = self.getControl();
        var template = self.renderFactory.getTemplate("image");
        var mode = self.getMode();

        // Render template
        var html = $.fasttmpl(template, {
            xpath: bizagi.util.encodeXpath(self.getUploadXpath()),
            editable: false,
            url: self.properties.url,
            allowDelete: false,
            mode: mode
        });

        $(".ui-bizagi-render-upload-wrapper", control).append(html);

        $(".ui-bizagi-render-image-wrapper .image-file", control).addClass('w-size-' + self.properties.width);

        $("a, .img, .ui-bizagi-render-image-wrapper .image-file, .ui-bizagi-render-image-wrapper", control).css({
            width: self.properties.width + "px",
            height: self.properties.height + "px"
        });
    },
    /*
     *   Applies the upload plugin
     */
    applyUploadPlugin: function() {
        var self = this,
                properties = self.properties,
                control = self.getControl();

        var fileInput = $(".ui-bizagi-render-upload-wrapper input", control);
        // Add some plugin properties
        var swf = properties.swf || self.dataService.getUploadSwfLocation();
        var cancelImage = self.dataService.getUploadCancelImage();
        var form = self.getFormContainer();
        var data = self.buildAddParams();
        data[self.Class.BA_ACTION_PARAMETER_PREFIX + "sessionId"] = form.properties.sessionId;

        // Apply upload plugin
        fileInput.uploadify({
            hideButton: true,
            wmode: 'transparent',
            uploader: swf,
            script: properties.addUrl,
            scriptData: data,
            scriptAccess: 'always',
            auto: true,
            buttonImg: '',
            styleClass: 'testimageclass',
            cancelImg: cancelImage,
            width: self.properties.width,
            height: self.properties.height,
            multi: false,
            //	fileDataName: properties.xpath,
            sizeLimit: properties.maxSize,
            fileExt: properties.validExtensions,
            fileDesc: properties.validExtensions ? self.getResource("render-upload-allowed-extensions") + properties.validExtensions : "",
            queueID: "q_" + bizagi.util.encodeXpath(self.getUploadXpath()),
            onComplete: function(event, queueId, fileObj, response, responseData) {
                if (event.isPropagationStopped())
                    return;
                event.stopPropagation();
                self.onUploadFileCompleted(response);
            }
        });

        // Bind handlers
        //  * Item Mouse over
        control.delegate(".ui-bizagi-render-upload-item", "mouseover", function() {
            var item = $(this);
            $(".ui-bizagi-render-upload-icon", item).css("display", "inline-block");
            item.removeClass("ui-state-default").addClass("ui-state-hover");
        });

        //  * Item Mouse out
        control.delegate(".ui-bizagi-render-upload-item", "mouseout", function() {
            var item = $(this);
            $(".ui-bizagi-render-upload-icon", item).css("display", "none");
            item.addClass("ui-state-default").removeClass("ui-state-hover");
        });

        $("object", control).css("height", self.properties.height);
    },
    /*
     *   Handler to process server response after a file has been uploaded
     */
    onUploadFileCompleted: function(response) {
        var self = this;
        var control = self.getControl();
        var imageWrapper = $(".ui-bizagi-render-image-wrapper", control);
        var result = JSON.parse(response);

        // Set width
        $(".uploadifyQueueItem", control).css({
            width: self.properties.width
        });

        if (result.type !== "error") {
            $.when(self.renderUploadItem()).done(function(htmlImage) {
                // Empty container and add new image
                $(imageWrapper).empty();
                $(imageWrapper).append(htmlImage);

                // Trigger change
                self.triggerRenderChange();

                $(".img, .ui-bizagi-render-image-wrapper .image-file", control).css({
                    width: self.properties.width + "px",
                    height: self.properties.height + "px"
                });

                $(".ui-bizagi-render-image-wrapper .image-file", control).addClass('w-size-' + self.properties.width);
            });
        } else {
            // Show server error
            bizagi.showMessageBox(result.message);
        }
    }
});
