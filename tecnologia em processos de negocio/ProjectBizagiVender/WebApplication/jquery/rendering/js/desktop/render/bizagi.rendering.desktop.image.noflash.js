/*
 *   Name: BizAgi Render Image Whitout flash
 *   Author: Edward J Morales
 *   Comments:
 *   -   This script will redefine the image render class to adjust to desktop devices
 */

// Extends itself
bizagi.rendering.image.extend("bizagi.rendering.imageNoFlash", {}, {
	/*
	 *   Template method to implement in each device to customize each render after processed
	 */

	postRender: function() {
		var self = this;
		var control = self.getControl();
		var properties = self.properties;
		var mode = self.getMode();
		var template = self.renderFactory.getTemplate("image-noflash");
		var url = "";
		var containerHeight, containerRenderChildsSize = 0, containerContainersChildsSize = 0;
		var imgWidth = self.properties.width;  
		var imgHeight = self.properties.height;


		// Flash to define flash version
		self.properties.flashVersion = false;

		// Render template
		var html = $.fasttmpl(template, {
			xpath: bizagi.util.encodeXpath(self.getUploadXpath()),
			editable: properties.editable,
			url: self.properties.url,
			allowDelete: properties.allowDelete,
			mode: mode
		});

		$(".image-wrapper", control).empty().append(html);

		//If is not any image include, load the default properies of the controls
		if(mode == "design" || mode == "layout" || self.properties.url.length == 0) {

			setTimeout(function() {
				if(imgHeight == "auto") {

					//if null means that container is the form
					if(self.parent.properties.type == "grid") {
						containerHeight = $(control).height() + "px";
						bizagi.util.cssExtended($(".image-wrapper", control), 'width:100%!important');
					} else {
						var parent = (self.parent.properties.type === "panel") ? self.parent.parent : self.parent;
						var height = control.height();
						containerHeight = parent.container.height() - 17;
						var containerChildsSize = self.parent.getChildreCount();
						var containerChildsHeightSum = self.parent.getChildrenSumHeight("image");

						if(self.parent.properties.id == self.getFormContainer().properties.id) {
							containerHeight = 50;
						}
						else if(containerChildsSize > 1) {
							containerHeight = containerHeight - (containerChildsHeightSum - height);
						}
						$(".image-wrapper", control).height(containerHeight);
					}

					imgHeight = containerHeight;

				}

				$('a', control).css({
					width: imgWidth,
					height: imgHeight
				});

				$(".resizable_img", control).css({
					width: imgWidth,
					height: imgHeight
				});
			}, 150);

			if($(".resizable_img", control).hasClass('background-image')) {
				//Creates an image node to store the sample image, and resize it to the control required dimensions

				//Image url pattern
				var pattern = /url\(|\)|"|'/g;
				var baseImageURL = $(".resizable_img", control).css('background-image').replace(pattern, "");

				//Creates the image node with the base image URL
				var resizableImgNode = $('<img src=' + baseImageURL + '>');

				resizableImgNode.css({
					width: imgWidth,
					height: imgHeight
				});

				//Append the created node
				$(".resizable_img", control).append(resizableImgNode);

				//Reset the styles, and make room to the created image node
				$(".resizable_img", control).css({
					'background-image': 'none',
					'border-top-width': '0',
					'border-left-width': '0',
					'border-right-width': '0',
					'border-down-width': '0',
					'padding': '0'
				});
			}

			//Otherwise, set the styles to adjust the image in the center, regardless his dimesions
		} else {
			var isImageGreaterThanContainer = false;
			controlWidth = control.width();

			setTimeout(function() {
			    var isAuto = self.properties.isAutoWidth;

				if(isAuto && self.parent.properties.type === "grid") {
					if($(".img", control).width() < controlWidth) {
						imgWidth = $(".img", control).width();
					} else if($(".img", control).width() >= controlWidth) {
						imgWidth = controlWidth - 20;
						isImageGreaterThanContainer = true;
					}
					$('a', control).css({
						height: "auto"
					});
				}
				else {
					$('a', control).css({
						width: imgWidth,
						height: "auto"
					});
				}

				$(".img, .ui-bizagi-render-image-wrapper .image-file", control).css({
					width: imgWidth,
					height: "auto"
				});

				var wSize = 48;
				if ((self.properties.width + "").indexOf("px") !== -1) {
				    wSize = (self.properties.width + "").replace("px", "");
				}

				$(".ui-bizagi-render-image-wrapper .image-file", control).addClass('w-size-' + wSize);

				$("img", control).css("width", imgWidth);

				$("img", control).css("height", "auto");


				if(isAuto && Number($('a', control).css("width").slice(0, -2)) > Number($(".img", control).css("width").slice(0, -2))) {
					$('a', control).css({
						width: $(".img", control).css("width")
					});
				}
				if(isAuto && isImageGreaterThanContainer && self.parent.properties.type === "grid") {
					$('a', control).closest(".ui-bizagi-render").css("text-align", "left");
				}


			}, 50);

		}

		// Resolve a deferred after the postRender
		if(self.isPostRendered) self.isPostRendered.resolve();


	},

	/*
	 * isReadyToSave
	 */
	isReadyToSave: function() {
		var self = this;
		return self.ready();
	},

	/*
	 *   Template method to implement in each device to customize the render's behaviour to add handlers
	 */
	configureHandlers: function() {
		var self = this;
		var control = self.getControl();
		var properties = self.properties;

		// Call base
		self._super();

		self.deleteHandler();

		$(".ui-bizagi-render-image-wrapper", control).bizagiUpload({
			renderReference: this,
			dialogTemplate: self.renderFactory.getTemplate("image-dialog"),
			properties: {
				scriptData: self.buildAddParams(),
				url: properties.addUrl,
				xpath: properties.xpath,
				validExtensions: properties.validExtensions,
				maxSize: properties.maxSize
			},
			onUploadFileCompletedCallback: self.onUploadFileCompleted,
			dialogTitle: self.getResource("render-upload-link-label")
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

	},

	deleteHandler: function(){
		var self = this;
		var control = self.getControl();
		var properties = self.properties;
		$(".delete-button",control).bind("click", function(e) {
			e.stopPropagation();
			$.when(self.dataService.deleteImage({
				url: properties.deleteUrl,
				idRender: properties.id,
				xpath: properties.xpath,
				xpathContext: properties.xpathContext,
				idPageCache: properties.idPageCache,
				contexttype: properties.contexttype
			})).done(function () {
				var $imageWrapper = $(".ui-bizagi-render-image-wrapper", control).empty();
				var $emptyImage = $.tmpl(self.getTemplateItem());
				//$(".delete-button", control).remove();
				$imageWrapper.append($emptyImage);
				console.log("Deleted");
			});
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
			width: self.properties.width,
			height: self.properties.height
		});
	},

	renderReadOnly: function() {
		var self = this;
		return self.renderControl();
	},
	/*
	 *   Template method to implement in each device to customize each render after processed in read-only mode
	 */
	postRenderReadOnly: function() {
		var self = this;
		var control = self.getControl();
		var template = self.renderFactory.getTemplate("image-noflash");
		var mode = self.getMode();

		// Render template
		var html = $.fasttmpl(template, {
			xpath: bizagi.util.encodeXpath(self.getUploadXpath()),
			editable: false,
			url: self.properties.url,
			allowDelete: false,
			mode: mode
		});

		$(".ui-bizagi-render-upload-wrapper", control).empty().append(html);

		$("a,.img, .ui-bizagi-render-image-wrapper .image-file, .ui-bizagi-render-image-wrapper", control).css({
			width: self.properties.width,
			height: self.properties.height
		});
	},

	getTemplateItem: function() {
		var self = this;
		return self.renderFactory.getTemplate("image-item-noflash");
	},

	/*
	 *   Opens a dialog in order to upload file per file
	 */
	openUploadDialog: function() {
		var self = this;
		var properties = self.properties;
		var doc = window.document;

		var dialogBox = self.dialogBox = $("<div class='ui-bizagi-component-loading'/>");
		dialogBox.empty();
		dialogBox.appendTo("body", doc);

		// Define buttons
		var buttons = {};

		// Select button
		buttons[self.getResource("render-upload-dialog-select")] = function(e) {
			//e.stopPropagation();
			if(self.checkMaxSize() && self.checkFileTypes()) {
				$.when(self.processUploadFile()).done(function(data) {
					self.onUploadFileCompleted(data);
					self.closeUploadDialog();
				});
			}
		};

		// Cancel button
		buttons[self.getResource("text-cancel")] = function() {
			self.closeUploadDialog();
		};

		// Creates a dialog
		dialogBox.dialog({
			width: 500,
			height: 200,
			title: self.getResource("render-upload-link-label"),
			modal: true,
			buttons: buttons,
			close: function() {
				self.closeUploadDialog();
			},
			resizeStop: function(event, ui) {
				if(self.form) {
					self.form.resize(ui.size);
				}
			}
		});

		// Render template
		var dialogTemplate = self.renderFactory.getTemplate("image-dialog");
		$.tmpl(dialogTemplate, {
			scriptData: self.buildAddParams(),
			url: properties.addUrl,
			xpath: properties.xpath,
			validExtensions: properties.validExtensions.replace(";", ","),
			maxSize: properties.maxSize
		}).appendTo(dialogBox);
		$('.ui-bizagi-loading-message').remove();

	},

	/*
	 *   Close the upload dialog
	 */
	closeUploadDialog: function() {
		var self = this;
		self.dialogBox.dialog('destroy');
		self.dialogBox.remove();
	},

	/*
	 *   Handler to process server response after a file has been uploaded
	 */
	onUploadFileCompleted: function(renderReference, response) {
		var self = renderReference;
		var control = self.getControl();
		var imageWrapper = $(".ui-bizagi-render-image-wrapper", control);
		var result = JSON.parse(response);
		var imgWidth = 0;
		var controlWidth = control.width();
		var isImageLoaded = control.find(".img").size() > 0;
		var widthBase = control.find(".resizable_img").width();

		if (self.properties.isAutoWidth) {
			imgWidth = self.properties.type != "image" ? control.width() : "99%";
		} else {
			imgWidth = self.properties.width;
		}


		// Set width
		$(".uploadifyQueueItem", control).css({
			width: self.properties.width
		});

		if(result.type !== "error") {
			$.when(self.renderUploadItem()).done(function(htmlImage) {
				// Empty container and add new image
				$(imageWrapper).empty();
				$(imageWrapper).append(htmlImage);
				self.deleteHandler();

				// Trigger change
				self.triggerRenderChange();

				setTimeout(function() {
					var isImageGreaterThanContainer = false;
					var isAuto = self.properties.isAutoWidth;

					if(isAuto && self.parent.properties.type === "grid") {

						if($(".img", control).width() < controlWidth) {
							imgWidth = $(".img", control).width();
						} else if($(".img", control).width() >= controlWidth) {
							imgWidth = controlWidth - 20;
							isImageGreaterThanContainer = true;
						}

						if(!isImageLoaded) {
							$('a', control).closest("td").css("width", widthBase);
						}

						$('a', control).css({
							height: "auto"
						});

					}
					else {
						$('a', control).css({
							width: imgWidth,
							height: "auto"
						});
					}

					$(".img, .ui-bizagi-render-image-wrapper .image-file", control).css({
						width: imgWidth,
						height: "auto"
					});

					var wSize = 48;
					if ((self.properties.width + "").indexOf("px") !== -1) {
					    wSize = (self.properties.width + "").replace("px", "");
					}

					$(".ui-bizagi-render-image-wrapper .image-file", control).addClass('w-size-' + wSize);

					$("img", control).css("width", imgWidth);
					$("img", control).css("height", "auto");
					$('.image-wrapper', control).css("height", "auto");


					if(isAuto && Number($('a', control).css("width").slice(0, -2)) > Number($(".img", control).css("width").slice(0, -2))) {
						$('a', control).css({
							width: $(".img", control).css("width")
						});
					}
					if(self.parent.properties.type === "grid" && isAuto) {
						if(isImageGreaterThanContainer) {
							$('a', control).closest(".ui-bizagi-render").css("text-align", "left");
						} else {
							if(self.properties.columnAlign) {
								$('a', control).closest(".ui-bizagi-render").css("text-align", self.properties.columnAlign);
								$('.image-wrapper', control).css("text-align", self.properties.columnAlign);
							} else {
								$('a', control).closest(".ui-bizagi-render").css("text-align", "center");
							}
						}
					}

				}, 50);
				//Set Value
				self.setValue([true]);

			});
		} else {
			if(result.cause == "iframeW8") {
				self.getFormContainer().refreshForm();
			} else {
				// Show server error
				bizagi.showMessageBox(result.message);
			}
		}
	},

	/*
	 *   Build add params to send to the server
	 */
	buildAddParams: function() {
		var self = this,
			properties = self.properties,
			form = self.getFormContainer();

		var data = [];
		var action = "savefile";

		if(properties.isUserPreference) {
			action = "SAVEUSERIMAGE";
			data.push({key: self.Class.BA_CONTEXT_PARAMETER_PREFIX + "contexttype", value: "entity"});
			data.push({key: self.Class.BA_CONTEXT_PARAMETER_PREFIX + "surrogateKey", value: self.currentUser});
		}
		data.push({key: self.Class.BA_CONTEXT_PARAMETER_PREFIX + "xpath", value: self.getUploadXpath()});
		data.push({key: self.Class.BA_CONTEXT_PARAMETER_PREFIX + "idRender", value: properties.id});
		data.push({key: self.Class.BA_CONTEXT_PARAMETER_PREFIX + "xpathContext", value: properties.xpathContext});
		data.push({
			key: self.Class.BA_CONTEXT_PARAMETER_PREFIX + self.Class.BA_PAGE_CACHE,
			value: properties.idPageCache
		});
		data.push({key: self.Class.BA_ACTION_PARAMETER_PREFIX + "sessionId", value: form.properties.sessionId});
		data.push({key: self.Class.BA_CONTEXT_PARAMETER_PREFIX + "action", value: action});
		(properties.contexttype) ? data.push({
			key: self.Class.BA_CONTEXT_PARAMETER_PREFIX + "contexttype",
			value: properties.contexttype
		}) : "";

		try {
			(BIZAGI_SESSION_NAME != undefined) ? data.push({
				key: BIZAGI_SESSION_NAME,
				value: form.properties.sessionId
			}) : data.push({key: "JSESSIONID", value: form.properties.sessionId});
		} catch(e) {
			data.push({key: "JSESSIONID", value: form.properties.sessionId});
		}

		return data;
	},

	/*
	 *
	 */
	checkMaxSize: function() {
		var self = this;
		var properties = self.properties;
		var dialogBox = self.dialogBox;
		var fileControl = $("input[type=file]", dialogBox).get(0) || {};

		// Dont exist any fucking way to know file size in IEx, just skip this validation
		if(fileControl.files != undefined) {
			if(fileControl.files.length > 0) {
				if(fileControl.files[0].size > properties.maxSize) {
					self.showError(self.getResource("render-upload-alert-maxsize").replace("{0}", properties.maxSize));
					return false;
				}
				return true;
			}
			else {
				self.showError(self.getResource("render-required-upload").replace("#label#", ""));
				return false;
			}
		} else {
			if(bizagi.util.isIE()) {
				if(fileControl.value === "" || !fileControl.value) {
					self.showError(self.getResource("render-required-upload").replace("#label#", ""));
					return false;
				} else {
					return true;
				}
			} else {
				return true;
			}
		}
	},

	/*
	 *
	 */
	checkFileTypes: function() {
		var self = this;
		var properties = self.properties;
		var dialogBox = self.dialogBox;
		var file = $("input[type=file]", dialogBox).val();
		if(properties.validExtensions && properties.validExtensions.length > 0) {
			var validExtensions = properties.validExtensions.replaceAll("*.", "").split(";");
			if(!self.stringEndsWithValidExtension(file, validExtensions, true)) {
				self.showError(self.getResource("render-upload-allowed-extensions") + properties.validExtensions);
				return false;
			}
		}
		return true;
	},

	stringEndsWithValidExtension: function(stringToCheck, acceptableExtensionsArray, required) {
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
	},
	showError: function(message) {
		var self = this;
		var errorContainer = $("#alert-file-upload", self.dialogBox);

		// Empty container
		errorContainer.empty();
		errorContainer.show();

		errorContainer.html(message);
	},
	/*
	 *   Process an upload file into the server
	 */
	processUploadFile: function() {
		var self = this;
		var defer = new $.Deferred();
		var dialogBox = self.dialogBox;
		var uploadForm = $("form", dialogBox);
		var uploadIFrame = $("iframe", uploadForm);

		// When the iframe loads the user we need to evaluate the response and close the dialog
		var timeoutFn = function() {
			try {
				var response = "";
				if(uploadIFrame[0].contentWindow) {
					var iframeContent = bizagi.util.isIE8() ? $(uploadIFrame[0].contentWindow.document.body) : $(uploadIFrame[0].contentWindow.eval("document.body"));

					response = iframeContent.text();
					//response = $("pre", iframeContent).length == 0 ? iframeContent[0].innerHTML : $("pre", iframeContent)[0].innerHTML;
				}
				if(response.length > 0) {
					defer.resolve(response);
				} else {
					setTimeout(timeoutFn, 50);
				}
			} catch(e) {
				// Nothing to do, just close the window and show error message
				self.closeUploadDialog();
				window.alert(e.toString());
			}
		};
		// Execute the timed function in order to check when the response has arrived
		timeoutFn();

		// Submit the form
		uploadForm.submit();

		return defer.promise();
	}
});