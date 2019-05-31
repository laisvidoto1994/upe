/**
 * Document templates widget, for uploading and updating created templates via Bizagi Studio
 * 
 * @author David Nino
 */


bizagi.workportal.widgets.admin.document.templates.extend("bizagi.workportal.widgets.admin.document.templates", {}, {
    init: function (workportalFacade, dataService, params) {
        var self = this;

        // Call base
        self._super(workportalFacade, dataService, params);

        //Load templates
        self.loadTemplates({
            "admin.document.templates": bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.document.templates").concat("#ui-bizagi-workportal-widget-admin-document-templates"),
            "admin.document.templates.upload.template": bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.document.templates").concat("#ui-bizagi-workportal-widget-admin-document-templates-upload-template"),
            "admin.document.templates.uploaded.templates.list": bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.document.templates").concat("#ui-bizagi-workportal-widget-admin-document-templates-uploaded-template-list"),
            useNewEngine: false
        });
    },

    postRender: function () {
        var self = this;

        //Template vars 
        self.uploadTemplateTmpl = self.getTemplate("admin.document.templates.upload.template");
        self.uploadedTemplatesTmpl = self.getTemplate("admin.document.templates.uploaded.templates.list");
        
        self.lockedInteractions = false;

        self.config =   { 
                            "maxSize": "31457280",
                            "validExtensions": ".bdt",
                            "xpath": "documentTemplates",
                            "uploadDialogTemplateName": "upload.template.dialog"
                        };


        self.renderUploadForm();

        self.initUploadedTemplates();
    },

    /*
    *
    */
    initUploadedTemplates: function() {
        
        var self = this,
            content = self.getContent();

        var uploadedTemplateListWrapper = $("#uploaded-template-list-wrapper", content);
        uploadedTemplateListWrapper.empty();

        $.when(self.dataService.storeDocumentTemplates()).done(function (data) {
            self.renderUploadedTemplates(data);
        });
    },

    /*
    *
    */
    renderUploadForm: function() {
        var self = this,
            content = self.getContent();

        var templateUploadFormWrapper = $("#template-upload-form-wrapper", content);

         // Render Form
        $.tmpl(self.uploadTemplateTmpl).appendTo(templateUploadFormWrapper);

        var proxyPrefix = (typeof (self.dataService.serviceLocator.proxyPrefix) != undefined) ? self.dataService.serviceLocator.proxyPrefix : "";
        bizagi.loader.start("rendering").then(function () {
            var facade = new bizagi.rendering.facade({ "proxyPrefix": proxyPrefix });
            self.dialogTemplate = facade.deviceFactory.cachedFactory.getTemplate(self.config["uploadDialogTemplateName"]);

            if(!self.dialogTemplate) {
                $.when( facade.deviceFactory.getRenderFactory()).done(function() {

                    self.dialogTemplate = facade.deviceFactory.cachedFactory.getTemplate(self.config["uploadDialogTemplateName"]);

                    self.addFormInteractions();
                });
            }
            else
                self.addFormInteractions();
        });


    },

    /*
    *
    */
    renderUploadedTemplates:function(data) {
        var self = this,
            content = self.getContent();

        var uploadedTemplateListWrapper = $("#uploaded-template-list-wrapper", content);

        uploadedTemplateListWrapper.empty();

         // Render Form
        $.tmpl(self.uploadedTemplatesTmpl, {documentTemplates : data.documentTemplate}).appendTo(uploadedTemplateListWrapper);

        $(".template-to-recover",uploadedTemplateListWrapper).click(function(e){
            e.preventDefault();

            if(!self.lockedInteractions){

                self.lockedInteractions = true;

                var params = {"Guid": $(e.currentTarget).data("guid")};

                $.when(self.dataService.restoreDocumentTemplates( params )).done(function(result){

                    self.lockedInteractions = false;

                    if(result.DocumentTemplateRestored){
                        self.initUploadedTemplates();

                        self.displayMessage(result);
                    }
                        
                })
            }            
        })
    },

    addFormInteractions: function() {

        var self = this,
            content = self.getContent();

        var properties = {};

        properties.addUrl = self.dataService.serviceLocator.getUrl("admin-document-templates-uploadDocumentTemplate");
        properties.xpath = self.config["xpath"];
        properties.idRender = "";
        properties.xpathContext = "";
        properties.idPageCache = "";
        properties.sessionId = "";
        properties.validExtensions = self.config["validExtensions"];
        properties.maxSize = self.config["maxSize"];
        properties.contexttype = "";
        properties.maxfiles = "1";
        properties.filesCount = "";

        var templateUploadFormWrapper = $("#template-upload-form-wrapper", content);

        $(".ui-bizagi-render-upload-wrapper", templateUploadFormWrapper).bizagiUpload({
            renderReference: this,
            dialogTemplate: self.dialogTemplate,
            properties: {
                url: properties.addUrl,
                xpath: properties.xpath,
                idRender: properties.idRender,
                xpathContext: properties.xpathContext,
                idPageCache: properties.idPageCache,
                idSession: properties.sessionId,
                validExtensions: properties.validExtensions,
                maxSize: properties.maxSize,
                contexttype: properties.contexttype
            },
            onUploadFileCompletedCallback: function(ref,data){ 
                                                                self.displayMessage(JSON.parse(data)); 
                                                                self.initUploadedTemplates();
                                                            },
            maxAllowedFiles: properties.maxfiles,
            uploadedFiles: properties.filesCount,
            dialogTitle: self.getResource("render-upload-link-label")
        });
    },

    displayMessage:function(messageData) {
        var self = this,
            content = self.getContent();

        var messageContainer = $("#message-container", content);

        messageContainer.show();

        if(messageData.DocumentTemplateRestored == true){

            $("#template-uploaded", messageContainer).hide();
            $("#template-recovered", messageContainer).show();
            $("#template-no-results", messageContainer).hide();
        }
        else
        {
            if(messageData.DocumentTemplateUploaded == true){
                $("#template-uploaded", messageContainer).show();
                $("#template-recovered", messageContainer).hide();
                $("#template-no-results", messageContainer).hide();

            }
            else{
                $("#template-uploaded", messageContainer).hide();
                $("#template-recovered", messageContainer).hide();
                $("#template-no-results", messageContainer).show();
            }
        }
    }
});