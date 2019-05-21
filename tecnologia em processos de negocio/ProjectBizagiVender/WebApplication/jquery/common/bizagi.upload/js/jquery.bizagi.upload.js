﻿/*
 * Upload control for Bizagi Workportal
 * @author: David Andres Niño Villalobos
 */

(function($) {
	$.fn.bizagiUpload = function(options) {

		var self = this,
			controlReference = this;

		// define options
		options = options || {};

		var opt = {
			renderReference: {},
			dialogTemplate: {},
			properties: {},
			uploadedFiles: -1,
			maxAllowedFiles: -1,

			isIE: bizagi.util.isIE,
			isECM: false,
			isUpdatingECM: false,

			onUploadFileCompletedCallback: function() {
			},
			onChangeFile: function() {
			},
			onCheckMaxSize: checkMaxSize,
			dialogTitle: "",
			height: 350,
			width: 500,
			onUploadFileProcess: function() {
			},
			onUploadDialogReady: function() {
			}
		};

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
			if(opt.renderReference.enabled === undefined)
				opt.renderReference.enabled = true;

			// Click event
			if(opt.isECM && opt.isUpdatingECM) {
				$(".modal-ecm .ecm-options-upgrade", self).click(function() {
					if(opt.renderReference.enabled) {
						//Hides the modal control
						$(".modal-ecm", self).hide();

						// Open dialog
						openUploadDialog();
					}
				});

			} else {
				self.click(function() {
					if(opt.renderReference.enabled)
						openUploadDialog(); // Open dialog
				});
			}
		}

		/*
		 * Adjust the valid extensions, to keep it in a list wich is used inside the upload dialog template
		 */
		function formatExtensions() {

			if(opt.properties.validExtensions != "") {
				var extensionList = opt.properties.validExtensions.replaceAll("*", "");
				extensionList = extensionList.replaceAll(";", ",");

				opt.properties.processedFileExtension = extensionList;
			}
		}

		/*
		 * open the upload Dialog
		 */
		function openUploadDialog() {
			var self = this,
			    doc = window.document,
			    dialogBox = self.dialogBox = $("<div class='ui-bizagi-component-loading'/>");

			var reverseButtons = false;
			if(opt.renderReference.getFormContainer){
				reverseButtons = opt.renderReference.getFormContainer().properties.orientation == "rtl" ? true : false;
			}

		    // Reset Flag
			self.isClicked = false;

			var buttons = [];

		    // Select button
			buttons[0] = {
			    text: bizagi.localization.getResource("render-upload-dialog-select"),
			    click: function (e) {

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
			                    opt.onUploadFileProcess();
			                    $.when(processUploadFile.call(this)).done(function (data) {
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

			                                var data = {
			                                    fileName: response.fileName,
			                                    idAttrib: response.idAttrib,
			                                    idFileUpload: response.idFileUpload,
			                                    idPageCache: response.idPageCache,
			                                    xPath: opt.properties.xPath,
			                                    xpathContext: opt.properties.xpathContext
			                                };

			                                opt.onUploadFileCompletedCallback(opt.renderReference, data, controlReference, response);
			                            } else {
			                                opt.onUploadFileCompletedCallback(opt.renderReference, response);
			                            }
			                        } else
			                            opt.onUploadFileCompletedCallback(opt.renderReference, data);

			                        if (opt.alertAfterUpload) {
			                            bizagi.showMessageBox(bizagi.localization.getResource(opt.alertAfterUpload), "Bizagi", "info");
			                        }
			                        closeUploadDialog();
			                    });
			                }
			            } else {
			                self.isClicked = false;
			            }
			        }
			    }
			}



		    // Cancel button
			buttons[1] = {
			    text: bizagi.localization.getResource("text-cancel"),
			    click: function () {
			        closeUploadDialog();
			    }
			}

			if (reverseButtons)
			    buttons.reverse();


			// Creates a dialog
			opt.renderReference.dialogBox = dialogBox.dialog({
				width: opt.width,
				height: opt.height,
				title: opt.dialogTitle,
				modal: true,
                draggable: false,
                resizable: false,
                maximize: false,
				buttons: buttons,
				close: function() {
					closeUploadDialog();
				}
			});

			//Creates the element with the required parameters

			var contentDialog = $.tmpl(opt.dialogTemplate, opt.properties, {
				isIE: opt.isIE,
				timeout: getEstimatedTimeByNetworkSpeed
			});
			contentDialog.appendTo(dialogBox);

			$("input[type=file]", contentDialog).change(function(event) {
				opt.onChangeFile(event.target.files);
			});

			$('.ui-bizagi-loading-message').remove();
			opt.onUploadDialogReady();
		}

		/*
		 *   Process an upload file into the server
		 */
		function processUploadFile() {
		    if (bizagi.util.isIE() && !(bizagi.util.isIE11() || bizagi.util.isIE10())) {
				return processUploadFileOldBrowsers();
		    } else {
				return processUploadFileModernBrowsers();
			}
		}

		function processUploadFileOldBrowsers() {
			var self = this;
			var defer = new $.Deferred();
			var dialogBox = opt.renderReference.dialogBox;
			var uploadForm = $("form", dialogBox);
			var uploadIFrame = $("iframe", uploadForm);

			var fileControl = $("input[type=file]", dialogBox).get(0) || {};
			if (typeof fileControl.files !== "undefined") {
				var netSpeed = (typeof opt.properties.networkSpeed != "undefined") ? opt.properties.networkSpeed : networkSpeed();
				var estimatedTime = getEstimatedTimeByNetworkSpeed(fileControl.files ? fileControl.files[0].size : 666, netSpeed);
				var $estimatedTime = $("#estimatedtime", dialogBox);
				var $statusContainer = $("#file-upload-status", dialogBox);
				$("#file-upload-status .file-upload-latency").show();

				clearInterval(self.interval);
				self.interval = window.setInterval(function() {
					$estimatedTime.html(--estimatedTime + " s");
					if(estimatedTime <= 0) {
						$statusContainer.html("Still working...");
						clearInterval(self.interval);
					}
				}, 1000);
			}

			// When the iframe loads the user we need to evaluate the response and close the dialog
			var timeoutFn = function() {
				try {
					var response = "";
					if(uploadIFrame[0].contentWindow || windoFrameObj) {

						if(bizagi.util.isIE8()) {
							iframeContent = $(uploadIFrame[0].contentWindow.document.body);
							response = iframeContent.text();
						} else {
							iframeContent = $(uploadIFrame[0].contentWindow.eval("document.body"));
							response = iframeContent.text();
						}
					}
					if(response.length > 0) {
						defer.resolve(response);
					} else {
						setTimeout(timeoutFn, 50);
					}
				} catch(e) {
					// Nothing to do, just close the window and show error message
					closeUploadDialog();
					window.alert(e.toString());
				}
			};

			///Due to the server response, is necessary to validate which browser the client is using
			if(bizagi.util.isIE() || bizagi.util.isIE11()) {
				//Creates dataService object to call required services
				if(!self.dataService)
					self.dataService = new bizagi.workportal.services.service();

				$.when(self.dataService.getCurrentUser("")).done(function(responseLogin) {
					// Execute the timed function in order to check when the response has arrived
					timeoutFn();

					// Submit the form
					uploadForm.submit();
				}).fail(function(event) {
				});
			}
			else {
				// Execute the timed function in order to check when the response has arrived
				timeoutFn();

				// Submit the form
				uploadForm.submit();
			}

			return defer.promise();
		}

		function processUploadFileModernBrowsers() {
			var fileControl = $("input[type=file]", dialogBox).get(0) || {};
			var $form = $("form", dialogBox);
			var def = new $.Deferred();
			var $statusElement = $("#file-upload-status .file-upload-statusbar");
			$statusElement.show();


			var xhr = new XMLHttpRequest();

			var data = new FormData();
			data.append($("input[type=file]", dialogBox).prop("name"), fileControl.files[0]);

			$("input[type='hidden']", dialogBox).each(function() {
				data.append(this.name, this.value);
			});

			var uploadProgress = function(progress) {
			    var percent = Math.round(progress.loaded * 100 / progress.total);
			    var message = (percent >= 99) ? bizagi.localization.getResource("render-upload-status-waiting") : percent + "%";

			    $(".statusbar", $statusElement).css("width", percent + "%");
				$(".statuspercent", $statusElement).html(message);
			};

			var uploadComplete = function(e) {
				def.resolve(e.target.responseText);
			};

			xhr.upload.addEventListener("progress", uploadProgress, false);
			xhr.addEventListener("load", uploadComplete, false);

			xhr.open("POST", opt.properties.url);
			xhr.send(data);

			return def.promise();
		}

		/*
		 *   Verifies the maximun file size
		 */
		function checkMaxSize() {
			var self = this;
			var properties = opt.properties;
			var dialogBox = opt.renderReference.dialogBox;
			var fileControl = $("input[type=file]", dialogBox).get(0) || {};

			// Dont exist any way to know file size in IEx, just skip this validation
			if(fileControl.files != undefined) {
				if(fileControl.files.length > 0) {
					if(fileControl.files[0].size > properties.maxSize) {
						showError(bizagi.localization.getResource("render-upload-alert-maxsize").replace("{0}", properties.maxSize));
						return false;
					}
					return true;
				} else {
					showError(bizagi.localization.getResource("render-required-upload").replace("#label#", ""));
					return false;
				}
			} else {
				if(bizagi.util.isIE()) {
					if(fileControl.value === "" || !fileControl.value) {
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
			if(properties.validExtensions && properties.validExtensions.length > 0) {
				var validExtensions = properties.validExtensions.replaceAll("*.", "").split(";");
				if(!validateFilenameExtension(file, validExtensions, true)) {
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
			if(required == false && stringToCheck.length == 0) {
				return true;
			}
			for(var i = 0; i < acceptableExtensionsArray.length; i++) {
				if(acceptableExtensionsArray[i].toLowerCase() == "*") {
					return true
				}
				if(stringToCheck.toLowerCase().endsWith(acceptableExtensionsArray[i].toLowerCase())) {
					return true;
				}
			}
			return false;
		}

		/*
		 *   Check the maximun file than can be uploaded
		 */
		function maxFilesLimit() {
			if(opt.uploadedFiles >= opt.maxfiles) {
				return true;
			} else {
				return false;
			}
		}

		/*
		 *   Display the error inside the control
		 */
		function showError(message) {
			var self = this,
				errorContainer = $("#alert-file-upload", self.dialogBox);

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
			self.dialogBox.detach();

			self.isClicked = false;
		}

		// Init plugin
		init();

		return self;
	};
})(jQuery);
