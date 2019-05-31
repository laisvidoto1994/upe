/*
*   Name: BizAgi Desktop Render Upload Extension (offline compatibility)
*   Author: Richar Urbano (based on Ricardo Pérez version)
*   Comments:
*   -   This script will redefine the upload render class in order to provide a compatibility to offline forms
*/

// Extends itself
bizagi.rendering.upload.extend("bizagi.rendering.upload.offline", {}, {
    /*
    *   Template method to implement in each children to customize each control
    */
    renderControl: function () {
        this.errorDiv = document.createElement("div");
        this.errorDiv.id = "alert-file-upload";

        var self = this,
            properties = self.properties;

        var template = self.renderFactory.getTemplate("upload.noFlash");

        // Render template
        var html = $.fasttmpl(template, {
            xpath: bizagi.util.encodeXpath(self.getUploadXpath()),
            editable: (self.filesCount < properties.maxfiles) && properties.editable,
            haveFiles: (self.filesCount != 0)
        });

        // Render current children
        var items = "";
        for (var i = 0; i < self.filesCount; i++) {
            var item = self.renderUploadItem(self.files[i]);
            items += item;
        }
        html = self.replaceFilesHtml(html, items);
        return html;
    },

    /*
    *   Template method to implement in each device to customize each render after processed
    */
    postRender: function () {
        var self = this;
        var control = self.getControl();

        // Set control container to behave as a block
        control.addClass("ui-bizagi-render-display-block");
        control.addClass("ui-bizagi-render-upload");
    },

    /*
    *   Template method to implement in each device to customize the render's behaviour to add handlers
    */
    configureHandlers: function () {
        bizagi.rendering.uploadHtml5.prototype.configureHandlers.call(this);
    },

    /*
    *   Opens a dialog in order to upload file per file
    */
    openUploadDialog: function () {
        bizagi.rendering.uploadHtml5.prototype.openUploadDialog.call(this);
    },

    renderUploadItem: function (objectUpload) {
        var self = this;
        var properties = self.properties;
        var mode = self.getMode();

        var template = self.renderFactory.getTemplate("uploadItem");

        var html = $.fasttmpl(template, {
            url: "javascript:void(0);",
            allowDelete: properties.allowDelete,
            filename: objectUpload[0].value,
            id: bizagi.util.randomNumber(),
            mode: mode
        });

        return html;
    },
    /*
    *   Collect Data
    */
    collectData: function (renderValues) {
        if (this.filesCount > 0) {
            renderValues[this.properties.xpath] = this.files;
        }
    },

    /*
    *   Process an upload file into the server
    */
    processUploadFile: function () {
        var self = this;
        var control = self.getControl();
        var dialogBox = self.dialogBox;
        var uploadForm = $("form", dialogBox);
        var input = $("input:file", uploadForm);

        var reader = new FileReader();

        reader.onload = function (e) {
            var dataURL = e.target.result;
            var uploadWrapper = $(".ui-bizagi-render-upload-wrapper", control);

            var fileLoaded = input.get(0).files[0];

            var dataURLtoSave = dataURL.replace(/^data:.*;base64,/, "");

            var fileToSave = [
                { xpath: "fileName", DataType: "15", value: fileLoaded.name },
                { xpath: "data", DataType: "19", value: dataURLtoSave }
            ];

            self.files.push(fileToSave);

            // Increment counter
            self.filesCount = self.filesCount + 1;

            self.setValue(self.files);

            var newItem = self.renderUploadItem(fileToSave);

            // Locate it after the upload wrapper
            uploadWrapper.after($(newItem));

            if (self.filesCount >= self.properties.maxfiles)
                uploadWrapper.remove();

            // Trigger change
            self.triggerRenderChange();
            self.closeUploadDialog();
            $("#no-files", self.getControl()).hide();
        };

        reader.readAsDataURL(input.get(0).files[0]);
    },

    checkMaxSize: function () {
        return bizagi.rendering.uploadHtml5.prototype.checkFileTypes.call(this);
    },

    checkFileTypes: function () {
        return bizagi.rendering.uploadHtml5.prototype.checkFileTypes.call(this);
    },

    stringEndsWithValidExtension: function (stringToCheck, acceptableExtensionsArray, required) {
        return bizagi.rendering.uploadHtml5.prototype.stringEndsWithValidExtension.apply(this, arguments);
    },
    /*
    *   Close the upload dialog
    */
    closeUploadDialog: function () {
        var self = this;
        self.dialogBox.dialog('destroy');
        self.dialogBox.remove();
    },
    canBeSent: function () {
        // This render cannot be sent because it is full ajax
        return true;
    }
});