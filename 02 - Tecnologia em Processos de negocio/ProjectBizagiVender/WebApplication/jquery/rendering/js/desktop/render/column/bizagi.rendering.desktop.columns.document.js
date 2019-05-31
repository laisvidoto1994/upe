/*
*   Name: BizAgi Desktop Render Document Generator Extension
*   Author: Mauricio Gonzalez
*   Comments:
*   -   This script will redefine the document generator render class to adjust to desktop devices
*/

// Extends itself
bizagi.rendering.columns.column.extend("bizagi.rendering.columns.document", {}, {


    /*
    *   Apply custom overrides to each decorated instance
    */
    applyOverrides: function (decorated) {
        var self = this;
        var mode = self.getMode();
        self._super(decorated);

        decorated.getControlHtml = self.getControlHtml;

        if (mode != "design") {
            self.surrogateKey = decorated.surrogateKey;
            decorated.getXpath = this.getXpath;
            decorated.getDocumentXpath = this.getDocumentXpath;
            decorated.getContextXpath = this.getContextXpath;
            decorated.documentTemplateGenerate = this.documentTemplateGenerate;
            decorated.preRenderControl = this.preRenderControl;
            decorated.deleteDocumentTemplate = this.deleteDocumentTemplate;
            decorated.getTemplateItem = this.getTemplateItem;
            decorated.properties.xpathContext = self.getContextXpath();
        }
    },

    getTemplateItem: function () {
        return "document-column-item";
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
        properties.buttonExecuted = true;

        var grid = self.parent;

        $.when(grid.submitOnChange("", false))
            .done(function () {
                $.when(self.dataService.generateDocumentTemplate(properties))
                    .done(function (response) {
                        $.when(grid.refresh())
                            .done(function () {
                                self.autoOpenDocuments();
                            });

                        self.endLoading();
                    }).fail(function () {
                        self.showErrorMessage();
                        self.endLoading();
                    });
            }).fail(function (message) {
                // Add error messages 
                self.getFormContainer().addErrorMessage(message);
                self.endLoading();
            });

        properties.buttonExecuted = false;
    },

    /*
    *   Template method to implement in each children to customize each control
    */
    getControlHtml: function (template, mode, downloadalldocuments, allowGenerate, properties, noFiles) {
        var self = this;
        var isInlineRow = true;

        for (var i = 0; i < self.parent.properties.data.rows.length; i++) {
            if (self.parent.properties.data.rows[i][0] == self.surrogateKey) {
                isInlineRow = false;
                break;
            }
        }

        var html = $.fasttmpl(template, {
            noActivateButton: isInlineRow,
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

        return html.replace("ui-bizagi-document-upload-item-design", "ui-bizagi-document-upload-item-design-column");
    },

    /*
    *   Apply custom overrides to each decorated instance
    */
    getXpath: function (xpath) {
        var xpathPath = xpath;
        var index = xpathPath.indexOf(this.grid.properties.xpath);

        if (index != -1) {
            xpathPath = xpathPath.substr(index + this.grid.properties.xpath.length + 1);
        }

        return this.grid.properties.xpath + "[id=" + this.surrogateKey + "]." + xpathPath;
    },

    /*
    *   Returns the xpath to be used  
    */
    getDocumentXpath: function (xpath) {
        var xpathPath = xpath;
        var index = xpathPath.indexOf(this.grid.properties.xpath);

        if (index != -1) {
            xpathPath = xpathPath.substr(index + this.grid.properties.xpath.length + 1);
        }

        return xpathPath;
    },

    /*
    *   Post process the element after it has been rendered
    */
    postRenderReadOnly: function (surrogateKey, cell, tableCell) {
        // Call base
        this._super(surrogateKey, cell, tableCell);
    },

    /*
    *   Returns the xpath to be used  
    */
    getContextXpath: function () {
        var self = this; 
        var form = self.getFormContainer();
        var xpathContext = (form.properties.xpathContext)? form.properties.xpathContext + "." :  "";
        return xpathContext + this.grid.properties.xpath + "[id=" + this.surrogateKey + "]";
    },

    /*
    *   Template method to implement in each children to customize each control
    */
    preRenderControl: function () {
        var self = this;

        if (self.value != undefined && self.properties.value != undefined) {
            self.properties.value = self.value;
        }
    },

    /*
    *   Creates the event of generation of templates.
    */
    deleteDocumentTemplate: function (filename) {
        var self = this;
        var grid = self.parent;
        var params = new Object();

        params.xpath = self.properties.xpath + "[fileName='" + filename + "']";
        params.idRender = self.properties.id;
        params.xpathContext = self.getContextXpath();
        params.idPageCache = self.properties.idPageCache;

        $.when(self.dataService.deleteUploadFile(params))
            .done(function () {
                grid.refresh();
            });
    }
});
