/* 
 * Upload control for Bizagi Workportal
 *
 * This control has the same functionality as jquery.bizagi.upload (bizagiUpload)
 * except it is NOT shown in a dialog
 * @author: Andrés Fernando Muñoz Muñoz
 */

(function ($) {
    $.fn.bizagiFileUpload = function (options) {

        var self = this;
        var contentFormUpload;

        var controlReference = this;

        // define options
        options = options || {};

        var opt = {
            renderReference: {},
            formTemplate: {},
            properties: {},
            uploadedFiles: -1,
            maxAllowedFiles: -1,

            isIE: bizagi.util.isIE,
            isECM: false,
            isUpdatingECM: false,

            onUploadFileCompletedCallback: function () { },
            onUploadFileFailCallback: function () { },
            onChangeFile: function () { },
            onCheckMaxSize: checkMaxSize,
            height: 200,
            width: 500,
            onUploadFileProcess: function () { },
            onUploadFormReady: function () { }
        };

        // Extend options
        $.extend(opt, opt, options);

        self.opt = opt;

        function init() {
            formatExtensions();
            initUploadForm();
        }


        /*
         * open the upload form
         */
        function initUploadForm() {
            var contentForm = $.tmpl(opt.formTemplate, opt.properties, {isIE: opt.isIE});


            self.width("100%");
            self.height("40px");

            //this.contentForm = contentForm;
            contentFormUpload = contentForm;
            self.html(contentForm);
            $("input[type=file]", contentForm).change(function (event) {
                opt.onChangeFile(event.target.files);
            });
            bindSubmitButton();
            $(".ui-bizagi-loading-message").remove();
            opt.onUploadFormReady();
        }

        /*
         * Adjust the valid extensions, to keep it in a list wich is used inside the upload template
         */
        function formatExtensions() {

            if (opt.properties.validExtensions !== "") {
                var extensionList = opt.properties.validExtensions.replaceAll("*", "");
                extensionList = extensionList.replaceAll(";", ",");

                opt.properties.processedFileExtension = extensionList;
            }
        }

        function bindSubmitButton(){
            var self = this;
            var doc = window.document;

            var contentForm = contentFormUpload;
            var buttons = {};

            // Select button
            $("#upload-file", contentForm).click(function (e) {


                var result = false;

                    if ((opt.onCheckMaxSize(opt.renderReference) && checkFileTypes())) {
                        //start loading mask
                        opt.onUploadFileProcess();
                        //Check this parameter exclusive for upload.noflash control
                        if (opt.uploadedFiles > 0 && opt.maxAllowedFiles > 0) {
                            result = !maxFilesLimit() ? true : false;
                        }
                        else {
                            result = true;
                        }

                        //Separated Logic for ECM upload form
                        if (opt.isECM) {

                            var fileName = $("input[type=file]",  contentForm).val();
                            fileName = fileName.substring(fileName.lastIndexOf("\\") + 1, fileName.length);
                            $("[name=Filename]", contentForm).val(fileName);

                            if (opt.isUpdatingECM) {
                                var extension = "*" + fileName.substring(fileName.lastIndexOf("."), fileName.length);
                                $("[name=fileext]", contentForm).val(extension);
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

                                if(opt.alertAfterUpload){
                                    bizagi.showMessageBox(bizagi.localization.getResource(opt.alertAfterUpload), "Bizagi", "info");
                                }

                            }).fail(function(data) {
                                opt.onUploadFileFailCallback(data);
                                if(opt.alerFailtAfterUpload){
                                    bizagi.showMessageBox(bizagi.localization.getResource(opt.alerFailtAfterUpload), "Bizagi", "warning");
                                }
                            });
                        }
                    }


            });
        }


        /*
         *   Process an upload file into the server
         */
        function processUploadFile() {
            var self = this;
            var defer = new $.Deferred();
            var contentForm = contentFormUpload;
            var uploadForm = $("form", contentForm);
            var uploadIFrame = $("iframe", uploadForm);

            // When the iframe loads the user we need to evaluate the response
            var timeoutFn = function () {
                try {
                    var response = "";
                    if (uploadIFrame[0].contentWindow) {
                        var iframeContent = bizagi.util.isIE() ? $(uploadIFrame[0].contentWindow.document.body) : $(uploadIFrame[0].contentWindow.eval("document.body"));

                        response = iframeContent.text();
                        //response = $("pre", iframeContent).length == 0 ? iframeContent[0].innerHTML : $("pre", iframeContent)[0].innerHTML;
                    }
                    if (response.length > 0) {
                        var responseJSON = JSON.parse(response);
                        if(responseJSON.result){
                            defer.resolve(response);
                        }else{
                            defer.reject(response);
                        }
                    } else {
                        setTimeout(timeoutFn, 50);
                    }
                } catch (e) {
                    // Nothing to do, just show error message
                    window.alert(e.toString());
                }
            };

            // Execute the timed function in order to check when the response has arrived
            timeoutFn();

            // Submit the form
            //console.log(uploadForm);
            uploadForm.submit();

            return defer.promise();
        }

        /*
         *   Verifies the maximun file size
         */
        function checkMaxSize() {
            var self = this;
            var properties = opt.properties;
            var contentForm = contentFormUpload;
            var fileControl = $("input[type=file]", contentForm).get(0) || {};

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
         *   Verifies the file extension after selecting it from the "Browse file"
         */
        function checkFileTypes() {
            var self = this;
            var properties = opt.properties;
            var contentForm = contentFormUpload;
            var file = $("input[type=file]", contentForm).val();
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
            var errorContainer = $("#alert-file-upload", contentFormUpload);

            // Empty container
            errorContainer.empty();
            errorContainer.show();

            errorContainer.html(message);
        }




        // Init plugin
        init();

        return self;
    };
})(jQuery);