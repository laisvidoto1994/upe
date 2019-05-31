/*
*   Name: BizAgi Render Document Generator
*   Author: Dario Estupiñan 
*   Comments:
*   -   This script will define basic stuff for document generator render
*/

bizagi.rendering.render.extend("bizagi.rendering.document", {}, {

    /*
    *   Update or init the element data
    */
    initializeData: function (data) {
        var self = this;
        // Call base
        this._super(data);

        var properties = this.properties;
        properties.validate = bizagi.util.parseBoolean(properties.validate) != null ? bizagi.util.parseBoolean(properties.validate) : false;

        if (properties.caption) {
            properties.caption = bizagi.util.trim(properties.caption);
            if (properties.caption.length == 0) {
                properties.caption = this.getResource("render-documentgenerator-button-label");
            }
        } else {
            properties.caption = this.getResource("render-documentgenerator-button-label");
        }
    },

    /*
    *   Template method to implement in each children to customize each control
    */
    renderControl: function () {
        var self = this;
        self.preRenderControl();

        var properties = self.properties;
        var mode = self.getMode();
        var noFiles = (properties.value) ? (properties.value.length == 0) : true;
        var downloadalldocuments = properties.downloadalldocuments = properties.downloadalldocuments ? properties.downloadalldocuments : false;
        var allowGenerate = properties.allowGenerate !== undefined ? properties.allowGenerate : true;
        var template = self.renderFactory.getTemplate(self.getTemplate());
        var items = "";
        var length = (properties.value) ? properties.value.length : 0;

        // Render template
        var html = self.getControlHtml(template, mode, downloadalldocuments, allowGenerate, properties, noFiles);

        // Render current children
        for (var i = 0; i < length; i++) {
            var file = { id: properties.value[i][0], fileName: properties.value[i][1] };
            var item = self.renderDocumentItem(file);
            items += item;
        }
        if (!noFiles && downloadalldocuments) {
            var downloadAlldocumentsLink = { fileName: self.getResource("render-document-downloadalldocuments") };
            var item = self.renderAllDocumentDownload(downloadAlldocumentsLink);
            items += item;
        }
        ;
        html = self.replaceFilesHtml(html, items);
        return html;
    },

    /*
    *   Template method to implement in each children to customize each control
    */
    getControlHtml: function (template, mode, downloadalldocuments, allowGenerate, properties, noFiles) {
        var self = this;

        return $.fasttmpl(template, {
            noActivateButton: false,
            editable: mode != "execution",
            downloadalldocuments: downloadalldocuments,
            required: properties.required,
            allowgenerate: allowGenerate,
            xpath: self.getXpath(properties.xpath),
            append: properties.append ? properties.append : false,
            caption: properties.caption,
            noFiles: noFiles,
            allowSendInMail: properties.allowSendInMail
        });
    },

    /*
    *   Template method to implement in each children to customize each control
    */
    getXpath: function (xpath) {
        return xpath;
    },

    /*
    *   Template method to implement in each children to customize each control
    */
    preRenderControl: function () {
    },

    /*
    *   Template method to implement in each children to customize each control
    */
    activateButton: function () {
        return true;
    },

    /*
    *   Returns the xpath to be used  
    */
    getDocumentXpath: function (xpath) {
        return xpath;
    },

    /*
    *   Returns the xpath to be used  
    */
    getContextXpath: function () {
        return this.properties.xpathContext;
    },

    /* 
    *   Renders a single document item 
    */
    renderDocumentItem: function (file) {
        var self = this;
        var properties = self.properties;
        var mode = self.getMode();

        var template = self.renderFactory.getTemplate(self.getTemplateItem());
        var url = self.buildItemUrl(file);

        // Don't render urls when not running in execution mode
        if (mode != "execution") url = "javascript:void(0);";

        var html = $.fasttmpl(template, {
            url: url,
            allowDelete: self.properties.allowDelete,
            filename: file.fileName,
            mode: mode,
            joined: false
        });

        return html;
    },

    /* 
    *   Builds the upload item url
    */
    buildItemUrl: function (file) {
        var self = this,
        properties = self.properties;

        var form = self.getFormContainer();

        return self.dataService.getUploadFileUrl({
            idRender: properties.id,
            xpath: self.getDocumentXpath(properties.xpath),
            xpathContext: self.getContextXpath(),
            idPageCache: properties.idPageCache,
            fileId: file.id,
            sessionId: self.getSessionId()
        });
    },

    /* 
    *   Builds the download all items item url
    */
    buildAllDocumentsUrl: function () {
        var self = this,
        properties = self.properties;

        var returnLink = self.dataService.getAllDocumentsDownloadUrl({
            xpath: self.getDocumentXpath(properties.xpath),
            xpathContext: self.getContextXpath(),
            idPageCache: properties.idPageCache,
            idCase: properties.caseId,
            idWorkItem: properties.workitemId,
            sessionId: self.getSessionId()
        });
        return returnLink;
    },

    /*
    *   Template method to implement in each device to customize each render after processed (Virtual method)
    */
    postRender: function () {
        // Call base
        self._super();
        
        return "<div></div>";
    },

    /*
    *   Template method to implement in each device to customize each render after processed in read-only mode
    */
    postRenderReadOnly: function () {
        var self = this;
        var mode = self.getMode();

        if (mode != "design") {
            var control = self.getControl();
            var htmlControl = self.renderControl();

            control.append(htmlControl);

            self.updateControlForPrintMode(control);

            // Execute the same as post-render
            self.postRender();
        }
    },

    /*
    *   Saves the form before the document generation
    */
    validateContainer: function () {
        var self = this;

        // Check if the form is valid, then generate
        var form = self.getFormContainer();
        return form.validateForm();
    },

    /*
    *   Saves the form before the document generation
    */
    save: function () {
        var self = this;
        var form = self.getFormContainer();
        return form.saveForm();
    },

    /*
    *   Replaces a {{files}} tag in the container for the specified "replace" element
    */
    replaceFilesHtml: function (html, replace) {
        return html.replace("{{files}}", replace);
    },

    /* 
    *  Method to determine if the render value can be sent to the server or not
    */
    canBeSent: function () {
        // This render cannot be sent because it is full ajax
        return false;
    },

    /* 
    *  Method to determine if the render value can be sent to the server or not
    */
    isValid: function (invalidElements) {
        var self = this,
            properties = self.properties,
            message;

        // Don't check non-editable renders
        if (bizagi.util.parseBoolean(properties.visible) == false) {
            return true;
        }
        // Don't check non-editable renders
        if (bizagi.util.parseBoolean(properties.editable) == false) {
            return true;
        }

        // Clear error message
        self.setValidationMessage("");

        // Check required
        if (properties.required && !properties.buttonExecuted) {
            if (self.value) {
                if (self.value.length > 0)
                    return true;
                message = self.getResource("render-document-required-text");
                invalidElements.push({ xpath: properties.xpath, message: message });
                return false;
            }
        }

        return true;
    },

    /*
    *   Template method to implement in each device to customize the render's behaviour to add handlers
    */
    configureHandlers: function () {
        var self = this;
        var control = self.getControl();
        var mode = self.getMode();
        // Call base
        self._super();

        // Attach handler
        var generateLink = $(".ui-bizagi-button-documentgenerator", control);
        if (mode == "execution") {
            generateLink.click(function (e) {
                if (e.isPropagationStopped()) return;
                e.stopPropagation();

                self.properties.buttonExecuted = true;

                if (self.properties.validate) {
                    // Check if the form is valid, then generate
                    var isValid = self.validateContainer();
                    if (isValid) {
                        self.documentTemplateGenerate();
                    }
                } else {
                    // Just generate the form
                    self.documentTemplateGenerate();
                }

                self.properties.buttonExecuted = false;
            });
        }

        // Configure preview handler
        $(".ui-bizagi-document-preview", control).click(function (e) {
            if (e.isPropagationStopped()) return;
            e.stopPropagation();

            self.showDocumentPreview($(this).data("url"), $(this).data("filename"));
        });

        // Configure preview handler
        $(".ui-bizagi-container-documents-item-delete", control).click(function (e) {
            if (e.isPropagationStopped()) return;
            e.stopPropagation();

            self.deleteDocumentTemplate($(this).data("filename"));
        });
    },

    /*
    *   Creates the event of generation of templates.
    */
    deleteDocumentTemplate: function (filename) {
        var self = this;
        var params = new Object();

        params.xpath = self.properties.xpath + "[fileName='" + filename + "']";
        params.idRender = self.properties.id;
        params.xpathContext = self.getContextXpath();
        params.idPageCache = self.properties.idPageCache;

        $.when(self.dataService.deleteUploadFile(params))
            .done(function () {
                $.when(self.dataService.multiaction().getPropertyData({
                    xpath: self.properties.xpath,
                    idRender: self.properties.id,
                    xpathContext: self.getContextXpath(),
                    idPageCache: self.properties.idPageCache,
                    property: "value"
                }))
                    .done(function (documents) {
                        // Redraw documents
                        self.redrawDocuments(documents, false, self.properties.downloadalldocuments);
                        self.value = documents;
                        self.configureHandlers();
                    });
            });
    },

    /*
    *   Creates the event of generation of templates.
    */
    documentTemplateGenerate: function () {
        var self = this;
        var properties = self.properties;
        self.startLoading();
        //Get the context xPath
        properties.xpathcontext = self.getContextXpath();
        properties.xpath = self.getDocumentXpath(properties.xpath);

        self.save()
            .done(function () {
                $.when(self.dataService.generateDocumentTemplate(properties))
                    .done(function () {
                        // Fetch again the value property 
                        $.when(self.dataService.multiaction().getPropertyData({
                            xpath: properties.xpath,
                            idRender: properties.id,
                            xpathContext: self.getContextXpath(),
                            idPageCache: properties.idPageCache,
                            property: "value"
                        }))
                        .done(function (documents) {
                            // Redraw documents
                            self.redrawDocuments(documents, false, properties.downloadalldocuments);
                            self.value = documents;
                            self.autoOpenDocuments();
                            self.configureHandlers();
                            // Finish loading
                            self.endLoading();
                        });

                    }).fail(function () {
                        self.showErrorMessage();
                    });
            }).fail(function (message) {
                // Add error messages 
                var form = self.getFormContainer();

                var messageText = message.responseText != undefined ? JSON.parse(message.responseText).message : message;
                form.addErrorMessage(messageText);
                form.endLoading();
                self.endLoading();

            });
    },

    /*
    *   Show the error message when something went wrong with the service.
    */
    showErrorMessage: function () {
        var self = this;
        var control = self.getControl();
        var renderErrorDiv = $(".ui-bizagi-div-error-container", control);
        var messageFailure = self.resources.getResource('render-upload-alert-maxsize').replace("{0}", BIZAGI_SETTINGS.UploadMaxFileSize);
        var errorTemplate = self.renderFactory.getCommonTemplate(self.getErrorTemplate());
        $.tmpl(errorTemplate, { message: messageFailure }).appendTo(renderErrorDiv).show();
        self.endLoading();
    },

    /*
    *   Shows the document if the flag is set. (virtual Function)
    */
    autoOpenDocuments: function () {
    },

    /*
    *   Template method to implement in each device to customize each render after processed (Virtual method)
    */
    showDocumentPreview: function (url, filename) {
    },

    /*
    * Identifies the extension of the file in a simpler way that ECM does
    */
    returnCssTypeFile: function (file) {

        if (file == undefined || file.lenght == 0) {
            return "ui-bizagi-document-upload-item-generic-file";
        }

        var extension = file.substr((file.lastIndexOf('.') + 1));
        switch (extension) {
            case 'docx':
                return "ui-bizagi-document-upload-item-doc";
            case 'pdf':
                return "ui-bizagi-document-upload-item-pdf";
            case 'xlsx':
                return "ui-bizagi-document-upload-item-xls";
            default:
                return "ui-bizagi-document-upload-item-generic-file";
        }
    },

    /*
    *   Redraw documents when needed
    */
    redrawDocuments: function (documents, noFiles, downloadalldocuments) {
        var self = this;
        var control = self.getControl();
        var documentContainer = $(".ui-bizagi-container-documents", control);
        // Clear current links
        documentContainer.empty();

        // Draw links again
        var html = "";
        for (var i = 0; i < documents.length; i++) {
            var file = { id: documents[i][0], fileName: documents[i][1] };
            var item = self.renderDocumentItem(file);
            html += item;
        }
        // Check if there are documents and the flag to download all are available to show the link.
        if (downloadalldocuments) {
            if (!noFiles && documents.length > 0) {
                var downloadAlldocumentsLink = { fileName: self.getResource("render-document-downloadalldocuments") };
                var item = self.renderAllDocumentDownload(downloadAlldocumentsLink);
                html += item;
            }
        }
        documentContainer.append(html);

        //Set value
        self.setValue(documents);
    },

    /*
    * This method must be implemented by the specific class of each device. (Virtual method)  
    */
    renderAllDocumentDownload: function (file) {
        var self = this;
        var properties = self.properties;
        var mode = self.getMode();

        var template = self.renderFactory.getTemplate(self.getTemplateItem());
        var url = self.buildAllDocumentsUrl(file);

        // Don't render urls when not running in execution mode
        if (mode != "execution") url = "javascript:void(0);";

        var html = $.fasttmpl(template, {
            url: url,
            allowDelete: properties.allowDelete,
            filename: file.fileName,
            mode: mode,
            joined: true
        });
        return self.removeDeleteButton(html);
    },

    removeDeleteButton: function (html) {
        var startIndex = html.indexOf("<span class=\"ui-bizagi-container-documents-item-delete");

        if (startIndex > 0) {
            var restOfWord = html.substring(startIndex);
            var finishIndex = restOfWord.indexOf("</span>") + 7;

            return html.substring(0, startIndex) + restOfWord.substring(finishIndex);
        }
        else
            return html;
    },

    getTemplate: function () {
        return "document";
    },

    getTemplateItem: function () {
        return "document-item";
    },

    getErrorTemplate: function () {
        return "form-error";
    }

});