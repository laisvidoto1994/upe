/*
* jQuery BizAgi Render Upload Widget 0.1 
* Copyright (c) http://www.bizagi.com
*
* Depends:
*	jquery.ui.core.js
*	jquery.ui.widget.js
*	jquery.metadata.js
*	jquery.uploadify.js
*	jquery.lightbox.js
*	swfObject.js
*	bizagi.ui.render.base.js
*/
(function ($) {

    var BIZAGI_UPLOAD_ADD_HANDLER = "ajax/AjaxUploadHandler.aspx";
    var BIZAGI_UPLOAD_GET_HANDLER = "ajax/GetFile.aspx";
    var BIZAGI_UPLOAD_DELETE_HANDLER = "ajax/DeleteFile.aspx";
    var BIZAGI_UPLOAD_SWF_URL = "js/other/uploadify.swf";

    $.ui.baseRender.subclass('ui.uploadRender', {
        /* Renders the control*/
        _render: function () {
            var self = this,
            properties = self.options.properties,
            control = self.control;

            // Make control to behave as a block container
            control.addClass("ui-bizagi-render-upload")
                   .addClass("ui-bizagi-render-display-block");

            // Set defaults
            self.getUrl = properties.getUrl || BIZAGI_UPLOAD_GET_HANDLER;
            self.addUrl = properties.addUrl || BIZAGI_UPLOAD_ADD_HANDLER;
            self.deleteUrl = properties.deleteUrl || BIZAGI_UPLOAD_DELETE_HANDLER;
            self.swf = properties.swf || BIZAGI_UPLOAD_SWF_URL;

            // Build upload container
            self.container = $('<ul class="ui-bizagi-render-upload-container"></ul>')
                .appendTo(control);
            self.uploadWrapper = $('<li class="ui-bizagi-render-upload-wrapper"><a href="javascript:;">Subir un archivo</a></li>')
                .appendTo(self.container);
            self.input = $('<input type="file" id="h_' + encodeXpath(properties.xpath) + '" />')
                .appendTo(self.uploadWrapper);

            // Set render files
            self.filesCount = 0;
            if (properties.files) {
                self.filesCount = properties.files.length;
                for (i = 0; i < self.filesCount; i++) {
                    self._renderUploadItem(properties.files[i].Name);
                }
            }

            // Creates queue
            self.queue = $('<span class="ui-bizagi-render-upload-queue" id="q_' + encodeXpath(properties.xpath) + '" ></span>')
                .appendTo(control);

            // Apply uploadify plugin
            self._applyUploadPlugin();
        },

        /* Applies the upload plugin*/
        _applyUploadPlugin: function () {
            var self = this,
                properties = self.options.properties;

            // Apply upload plugin
            self.input.uploadify({
                hideButton: true,
                wmode: 'transparent',
                uploader: self.swf,
                script: urlMergeQueryString(self.addUrl, "xpath=" + properties.xpath),
                scriptAccess: 'always',
                auto: true,
                buttonImg: '',
                cancelImg: 'css/other/images/upload-cancel.png',
                width: 'inherit',
                height: 32,
                multi: (properties.onlyImages ? true : false),
                sizeLimit: (properties.maxSize || 0),
                fileExt: (properties.validExtension || ''),
                fileDesc: (properties.validExtension ? $.bizAgiResources["bizagi-ui-render-upload-allowed-extensions"] + properties.validExtension : ''),
                queueID: "q_" + encodeXpath(properties.xpath),
                onComplete: function (event, queueID, fileObj, response, data) {
                    var result = eval("(" + response + ")");
                    self._renderUploadItem(result.Name);

                    // Increment counter
                    self.filesCount = self.filesCount + 1;

                    if (self.filesCount >= properties.maxFiles) {
                        self.input.uploadifyClearQueue();
                        self.uploadWrapper.css({ 'height': 0, 'position': 'fixed' });
                        $("object", self.uploadWrapper).css("height", "0");
                        $("a", self.uploadWrapper).hide();
                    }
                }
            });
        },

        /* Renders a single upload item */
        _renderUploadItem: function (fileName) {
            var self = this,
                properties = self.options.properties;

            if (properties.onlyImages && properties.onlyImages == true) {
                return self._renderImageUploadItem(fileName);
            }

            return self._renderNormalUploadItem(fileName);
        },

        /* Renders a normal upload item*/
        _renderNormalUploadItem: function (fileName) {
            var self = this;

            var item = $('<li class="ui-bizagi-render-upload-item ui-state-default"></li>');
            var url = urlMergeQueryString(self.getUrl, 'fileName=' + fileName);
            item.append('<a href="' + url + '" target="_blank">' + fileName + '</a>');

            // Add action icons
            item.append('<span class="ui-bizagi-render-upload-icon ui-bizagi-render-upload-item-delete ui-icon ui-icon-close"></span>');
            item.append('<span class="ui-bizagi-render-upload-icon ui-bizagi-render-upload-item-mail ui-icon ui-icon-mail-closed"></span>');

            // Attach mouse over event
            item.mouseover(function () {
                $(".ui-bizagi-render-upload-icon", item).css("display", "inline-block");
                item.removeClass("ui-state-default").addClass("ui-state-hover");
            });

            // Attach mouse out event
            item.mouseout(function () {
                $(".ui-bizagi-render-upload-icon", item).css("display", "none");
                item.addClass("ui-state-default").removeClass("ui-state-hover");
            });

            // Bind delete handler
            $(".ui-bizagi-render-upload-item-delete", item).click(function () {
                self._deleteUploadItem(item, fileName);
            });

            // Add item to container
            self.container.prepend(item);

            return item;
        },

        /* Renders an image upload item */
        _renderImageUploadItem: function (fileName) {
            var self = this;

            var imageContainer = $(".ui-bizagi-render-upload-image-container", self.container);

            // Creates container
            if (imageContainer.length == 0) {
                imageContainer = $('<li class="ui-bizagi-render-upload-image-container"></li>');

                // Add item to container
                self.container.prepend(imageContainer);
            }

            // Append item
            var src = urlMergeQueryString(self.getUrl, 'fileName=' + fileName);
            var item = $('<span><a href="' + src + '" target="_blank"><img src="' + src + '" width="100" height="100" alt="" /></a></span>');
            $(imageContainer).append(item);

            // Add action icons
            item.append('<span class="ui-bizagi-render-upload-icon ui-bizagi-render-upload-item-delete ui-icon ui-icon-close"></span>');
            item.append('<span class="ui-bizagi-render-upload-icon ui-bizagi-render-upload-item-mail ui-icon ui-icon-mail-closed"></span>');

            // Attach mouse over event
            item.mouseover(function () {
                item.addClass("ui-bizagi-focused");
                $(".ui-bizagi-render-upload-icon", item).css("display", "block");
            });

            // Attach mouse out event
            item.mouseout(function () {
                item.removeClass("ui-bizagi-focused");
                $(".ui-bizagi-render-upload-icon", item).css("display", "none");
            });

            // Attach delete button event
            $(".ui-bizagi-render-upload-item-delete", item).click(function () {
                self._deleteUploadItem(item, fileName, function () {
                    self._applyLightBoxPlugin(imageContainer);
                });
            });

            // Apply lightbox plugin
            self._applyLightBoxPlugin(imageContainer);

            return item;
        },

        /* Apply the lightbox plugin for gallery show*/
        _applyLightBoxPlugin: function (imageContainer) {
            // Apply lightbox plugin
            $("a", imageContainer).lightBox({
                fixedNavigation: true,
                imageLoading: 'css/other/images/lightbox-ico-loading.gif',
                imageBtnPrev: 'css/other/images/lightbox-btn-prev.gif',
                imageBtnNext: 'css/other/images/lightbox-btn-next.gif',
                imageBtnClose: 'css/other/images/lightbox-btn-close.gif',
                imageBlank: 'css/other/images/lightbox-blank.gif',
                maxWidth: 600,
                maxHeight: 600
            });
        },

        _deleteUploadItem: function (item, fileName, callback) {
            var self = this,
                properties = self.options.properties;

            $.ajax({
                url: urlMergeQueryString(self.deleteUrl, 'fileName=' + fileName),
                success: function (data) {
                    item.fadeOut(300, function () {
                        item.detach();

                        // Call callback
                        if (callback)
                            callback();
                    });

                    if (properties.maxFiles) {
                        // Substract counter
                        self.filesCount = self.filesCount - 1;

                        if (self.filesCount < properties.maxFiles) {
                            self.uploadWrapper.css({ 'height': '', 'position': '' });
                            $("object", self.uploadWrapper).css("height", "");
                            $("a", self.uploadWrapper).show();
                        }
                    }
                }
            });
        }
    });

})(jQuery);