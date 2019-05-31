/* 
* Upload control for Bizagi Workportal
* @author: David Andres Niño Villalobos
*/

(function ($) {
    $.fn.bizagiUpload = function (options) {

        var self = this;

        var controlReference = this;

        // define options
        options = options || {};

        var opt = {
            renderReference: {},
            dialogTemplate: {},
            properties: {},
            uploadedFiles: -1,
            maxAllowedFiles: -1,

            isECM: false,
            isUpdatingECM: false,

            onUploadFileCompletedCallback: function () { },
            onChangeFile: function () { },
            onCheckMaxSize: checkMaxSize,
            dialogTitle: ""
        }

        // Extend options
        $.extend(opt, opt, options);

        self.opt = opt;

        function init() {

            bindElements();
            formatExtensions();
        }

        // Add events
        function bindElements() {

            //By default, the control is enabled
            if (opt.renderReference.enabled === undefined)
                opt.renderReference.enabled = true;

            // Click event
            if (opt.isECM && opt.isUpdatingECM) {
                $(".modal-ecm .ecm-options-upgrade", self).click(function () {
                    if (opt.renderReference.enabled) {
                        //Hides the modal control
                        $(".modal-ecm", self).hide();

                        // Open dialog
                        openUploadDialog();
                    }
                });

            } else {
                self.click(function () {

                    if (opt.renderReference.enabled)
                    // Open dialog
                        openUploadDialog();
                });
            }
        }

        /*
        * Adjust the valid extensions, to keep it in a list wich is used inside the upload dialog template
        */
        function formatExtensions() {

            if (opt.properties.validExtensions != "") {
                var extensionList = opt.properties.validExtensions.replaceAll("*", "");
                extensionList = extensionList.replaceAll(";", ",");

                opt.properties.processedFileExtension = extensionList;
            }
        }

        /*
        * open the upload Dialog
        */
        function openUploadDialog() {

            var self = this;
            var doc = window.document;
            var dialogBox = self.dialogBox = $("<div class='ui-bizagi-component-loading'/>");

            // Reset Flag
            self.isClicked = false;

            var buttons = {};

            // Select button
            buttons[bizagi.localization.getResource("render-upload-dialog-select")] = function (e) {

                var result = false;

                if (!self.isClicked) {
                    self.isClicked = true;

                    if ((opt.onCheckMaxSize(opt.renderReference) && checkFileTypes())) {
                        //Check this parameter exclusive for upload.noflash control
                        if (opt.uploadedFiles > 0 && opt.maxAllowedFiles > 0)
                            result = !maxFilesLimit() ? true : false;
                        else
                            result = true;

                        //Separated Logic for ECM upload dialog
                        if (opt.isECM) {

                            var fileName = $('input[type=file]', dialogBox).val();
                            fileName = fileName.substring(fileName.lastIndexOf("\\") + 1, fileName.length);
                            $('[name=Filename]', self.dialobBox).val(fileName);

                            if (opt.isUpdatingECM) {
                                var extension = "*" + fileName.substring(fileName.lastIndexOf("."), fileName.length);
                                $('[name=fileext]', self.dialobBox).val(extension);
                            }
                        }


                        if (result) {
                            $.when(processUploadFile()).done(function (data) {
                                if (opt.isECM) {
                                    var response = JSON.parse(data);

                                    if (opt.isUpdatingECM) {
                                        //Inserts manually the attributes
                                        if (response.xpath)
                                            result.xPath = result.xpath;



                                        if (!response.idPageCache)
                                            response.idPageCache = opt.properties.idPageCache;

                                        /**
                                        //opt.properties.xpath = opt.properties.xPath;
                                        opt.properties.fileName = response.fileName;
                                        opt.properties.filename = response.fileName;
                                        /**/

                                        response.filename = response.fileName;

                                        var data = { fileName: response.fileName,
                                            idAttrib: response.idAttrib,
                                            idFileUpload: response.idFileUpload,
                                            idPageCache: response.idPageCache,
                                            xPath: opt.properties.xPath,
                                            xpathContext: opt.properties.xpathContext
                                        };

                                        opt.onUploadFileCompletedCallback(opt.renderReference, data, controlReference, response);
                                    }
                                    else {
                                        opt.onUploadFileCompletedCallback(opt.renderReference, response);
                                    }
                                }
                                else
                                    opt.onUploadFileCompletedCallback(opt.renderReference, data);

                                closeUploadDialog();
                            });
                        }
                    }
                    else {
                        self.isClicked = false;
                    }
                }
            };



            // Cancel button
            buttons[bizagi.localization.getResource("text-cancel")] = function () {
                closeUploadDialog();
            };


            // Creates a dialog
            dialogBox.dialog({
                width: 500,
                height: 200,
                minHeight: 200,
                minWidth: 400,
                title: opt.dialogTitle,
                modal: true,
                buttons: buttons,
                close: function () {
                    closeUploadDialog();
                },
                maximize: function () {
                    // Next lines if the current document is inside an Iframe.
                    if (window.self !== window.top) {
                        if (typeof (dialogBox.parent()) != "undefined") {
                            var w = window,
                                d = document,
                                e = d.documentElement,
                                g = d.getElementsByTagName('body')[0],
                                y = w.innerHeight || e.clientHeight || g.clientHeight;
                            dialogBox.parent().height(y - 10);
                        }
                    }
                }
            });

            //Creates the element whit the required parameters
            var contentDialog = $.tmpl(opt.dialogTemplate, opt.properties);
            contentDialog.appendTo(dialogBox);

            $("input[type=file]", contentDialog).change(function (event) {
                opt.onChangeFile(event.target.files);
            });

            $('.ui-bizagi-loading-message').remove();
            // Verifies if current page is an iframe
            if (window.self !== window.top) {
                window.setTimeout(function () {
                    var newScroll = parseInt(dialogBox.parent().css("top")) - (parseInt(dialogBox.parent().css("height")) / 0.85);
                    var bodyelem = ($.browser.safari) ? $("body") : $("html,body");
                    bodyelem.scrollTop(newScroll);
                }, 0);
            }
        }

        /*
        *   Process an upload file into the server
        */
        function processUploadFile() {
            var self = this;
            var defer = new $.Deferred();
            var dialogBox = self.dialogBox;
            var uploadForm = $("form", dialogBox);
            var uploadIFrame = $("iframe", uploadForm);

            // When the iframe loads the user we need to evaluate the response and close the dialog
            var timeoutFn = function () {
                try {
                    var response = "";
                    if (uploadIFrame[0].contentWindow) {
                        var iframeContent = bizagi.util.isIE8() ? $(uploadIFrame[0].contentWindow.document.body) : $(uploadIFrame[0].contentWindow.eval("document.body"));

                        response = iframeContent.text();
                        //response = $("pre", iframeContent).length == 0 ? iframeContent[0].innerHTML : $("pre", iframeContent)[0].innerHTML;
                    }
                    if (response.length > 0) {
                        defer.resolve(response);
                    } else {
                        setTimeout(timeoutFn, 50);
                    }
                } catch (e) {
                    if (typeof (Windows) != undefined) {
                        defer.resolve('{"type": "error","cause":"iframeW8"}');
                    } else {
                        // Nothing to do, just close the window and show error message
                        closeUploadDialog();
                        bizagi.log(e.toString());
                    }
                }
            };

            // Execute the timed function in order to check when the response has arrived
            timeoutFn();

            // Submit the form
            uploadForm.submit();

            return defer.promise();
        }

        /*
        *   Verifies the maximun file size 
        */
        function checkMaxSize() {
            var self = this;
            var properties = opt.properties;
            var dialogBox = self.dialogBox;
            var fileControl = $("input[type=file]", dialogBox).get(0) || {};

            // Dont exist any way to know file size in IEx, just skip this validation
            if (fileControl.files != undefined) {
                if (fileControl.files.length > 0) {
                    if (fileControl.files[0].size > properties.maxSize) {
                        showError(bizagi.localization.getResource("render-upload-alert-maxsize").replace("{0}", properties.maxSize));
                        return false;
                    }
                    return true;
                }
                else {
                    showError(bizagi.localization.getResource("render-required-upload").replace("#label#", ""));
                    return false;
                }
            } else {
                if (bizagi.util.isIE()) {
                    if (fileControl.value === "" || !fileControl.value) {
                        showError(bizagi.localization.getResource("render-required-upload").replace("#label#", ""));
                        return false;
                    } else {
                        return true;
                    }
                } else {
                    return true;
                }
            }
        }

        /*
        *   Verifies the file extension after selecting it from the "Browse file" dialog
        */
        function checkFileTypes() {
            var self = this;
            var properties = opt.properties;
            var dialogBox = self.dialogBox;
            var file = $("input[type=file]", dialogBox).val();
            if (properties.validExtensions && properties.validExtensions.length > 0) {
                var validExtensions = properties.validExtensions.replaceAll("*.", "").split(";");
                if (!validateFilenameExtension(file, validExtensions, true)) {
                    showError(bizagi.localization.getResource("render-upload-allowed-extensions") + properties.validExtensions);
                    return false;
                }
            }
            return true;
        }

        /*
        *
        */
        function validateFilenameExtension(stringToCheck, acceptableExtensionsArray, required) {
            if (required == false && stringToCheck.length == 0) {
                return true;
            }
            for (var i = 0; i < acceptableExtensionsArray.length; i++) {
                if (acceptableExtensionsArray[i].toLowerCase() == "*") {
                    return true
                }
                if (stringToCheck.toLowerCase().endsWith(acceptableExtensionsArray[i].toLowerCase())) {
                    return true;
                }
            }
            return false;
        }

        /*
        *   Check the maximun file than can be uploaded
        */
        function maxFilesLimit() {
            if (opt.uploadedFiles >= opt.maxfiles) {
                return true;
            } else {
                return false;
            }
        }

        /*
        *   Display the error inside the control
        */
        function showError(message) {
            var self = this;
            var errorContainer = $("#alert-file-upload", self.dialogBox);

            // Empty container
            errorContainer.empty();
            errorContainer.show();

            errorContainer.html(message);
        }


        /*
        *   Close the upload dialog
        */
        function closeUploadDialog() {
            var self = this;
            self.dialogBox.dialog('destroy');
            self.dialogBox.remove();
        }

        // Init plugin
        init();

        return self;
    };
})(jQuery);