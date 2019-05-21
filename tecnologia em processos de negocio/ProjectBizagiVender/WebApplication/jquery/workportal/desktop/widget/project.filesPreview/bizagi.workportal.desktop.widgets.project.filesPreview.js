/*
 *   Name: Bizagi Workportal Desktop Project File Preview
 *   Author: David Romero Estrada
 */

bizagi.workportal.widgets.project.base.extend("bizagi.workportal.widgets.project.filesPreview", {}, {
    /*
    *   Constructor
    */
    init: function (workportalFacade, dataService, notifier, params) {
        var self = this;

        //Regional
        self.datePickerRegional = bizagi.localization.getResource("datePickerRegional");

        self.dialogBox = {};

        // Call base
        self._super(workportalFacade, dataService, params);
        self.notifier = notifier;

        //Load templates
        self.loadTemplates({
            "project-filespreview-wrapper": bizagi.getTemplate("bizagi.workportal.desktop.widget.project.filesPreview").concat("#project-filespreview-wrapper"),
            "project-filespreview-preview": bizagi.getTemplate("bizagi.workportal.desktop.widget.project.filesPreview").concat("#project-filespreview-preview"),
            "project-filespreview-popup": bizagi.getTemplate("bizagi.workportal.desktop.widget.project.filesPreview").concat("#project-filespreview-popup"),
            "project-filespreview-thenumber": bizagi.getTemplate("bizagi.workportal.desktop.widget.project.filesPreview").concat("#project-filespreview-thenumber")
        });
    },

    /**
    * Renders the template defined in the widget
    */
    renderContent: function () {
        var self = this;
        var generalTmpl = self.getTemplate("project-filespreview-wrapper");

        self.content = generalTmpl.render();

        self.sub("SETFILESNUMBER", $.proxy(self.setFilesNumber, self));

        return self.content;
    },

    /**
    * links events with handlers
    */
    postRender: function () {
        var self = this;

        self.plugins.fileEdition = self.initPluginPopupEdition();

        self.form = {
            description: $("#ui-bizagi-wp-project-filespreview-popup-description", self.plugins.fileEdition),
            image: $(".ui-bizagi-wp-project-popupform-user-image", self.plugins.fileEdition),
            cancel: $("#ui-bizagi-wp-project-popupform-action-cancel", self.plugins.fileEdition),
            edit: $("#ui-bizagi-wp-project-popupform-action-editfile", self.plugins.fileEdition)
        };

        self.eventsHandler();
    },

    setFilesNumber: function (event, params) {
        var self = this;
        var parameters = params.args;

        if ($.isEmptyObject(self.currentFile) || parameters.mandatory) {
            var tmpl = self.getTemplate("project-filespreview-thenumber");
            var $filesNumber = tmpl.render({ filesNumber: parameters.filesNumber });
            self.currentFile = {};
            $("#ui-bizagi-wp-project-filespreview-wrapper", self.content).html($filesNumber);
        }
    },

    initPluginPopupEdition: function () {
        var self = this;
        var tmpl = self.getTemplate("project-filespreview-popup");

        self.dialogBox.formContent = tmpl.render();

        return self.dialogBox.formContent;
    },

    showPreview: function (event, params) {
        var self = this;
        var template = self.getTemplate("project-filespreview-preview");
        self.currentFile = params.args;

        var content = template.render($.extend(params.args,{idCurrentUser: bizagi.currentUser.idUser}));

        $("#ui-bizagi-wp-project-filespreview-wrapper", self.content).html(content);
        self.applyMenu();
    },

    setEditionData: function () {
        var self = this;
        self.form.description.val(self.currentFile.fileData.description);
        if(self.currentFile.userData.picture){
            self.form.image.prop("src", self.currentFile.userData.picture);
        }
    },

    eventsHandler: function () {
        var self = this;
        self.form.cancel.on("click", $.proxy(self.onResetFileForm, self));
        self.form.edit.on("click", $.proxy(self.onSaveEdition, self));
        self.sub("FILEPREVIEW", $.proxy(self.showPreview, self));
    },

    onSelectMenu: function (event, ui) {
        var self = this;
        if($(event.currentTarget).find("i").length === 0){
            var item = $(ui.item).data("item");
            switch (item) {
                case "edit":
                    self.onOpenEdition();
                    break;
                case "delete":
                    self.onDeleteFile();
                    break;
                case "download":
                    self.onDownloadFile();
                    break;
            }
        }
    },

    onDownloadFile: function () {
        var self = this;
        self.dataService.getDownloadAttachment(self.currentFile.fileData.attachment.guid, self.currentFile.fileData.name);
    },

    onOpenEdition: function () {
        var self = this;

        self.dialogBox.formContent.dialog({
            resizable: false,
            draggable: false,
            height: "auto",
            width: "650px",
            modal: true,
            title: bizagi.localization.getResource("workportal-project-files-editfile"),
            maximize: true,
            close: function () {
                self.onResetFileForm();
            }
        });

        self.setEditionData();
        self.form.description.focus();
    },

    onDeleteFile: function(){
        var self = this;
        $.when(bizagi.showConfirmationBox(bizagi.localization.getResource("workportal-project-file-querydelete"), "", "info")).done(function () {
            var params = {
                content: {
                    guid: self.currentFile.fileData.guid
                },
                attachmentsToDelete: [self.currentFile.fileData.attachment.guid]
            };

            $.when(self.dataService.deleteFile(params)).always(function (response) {
                if (response.status === 200 || response.status === 201 || response.status === undefined) {
                    self.pub("notify", {
                        type: "DELETEFILE",
                        args: {
                            guid: params.content.guid
                        }
                    });
                }
            });
        });
    },

    onSaveEdition: function () {
        var self = this;
        if (self.validateAddFileDescriptionForm(self.form.description)) {
            self.currentFile.fileData.description = self.form.description.val();

            var params = {
                "content": {
                    "guid": self.currentFile.fileData.guid,
                    "description": self.currentFile.fileData.description,
                    "attachment": self.currentFile.fileData.attachment,
                    "name": self.currentFile.fileData.name,
                    "date": self.currentFile.fileData.date,
                    "user": bizagi.currentUser.idUser,
                    "globalParent": self.currentFile.radNumber
                }
            };

            $.when(self.dataService.updateProjectFile(params)).always(function (response) {
                if (response.status === 200 || response.status === 201 || response.status === undefined) {
                    $("#ui-bizagi-wp-project-filespreview-description", self.content).text(params.content.description);

                    self.onResetFileForm();
                    self.notifier.showSucessMessage(
                       printf(bizagi.localization.getResource("workportal-project-files-editionsuccess"), ""));

                    self.pub("notify", {
                        type: "UPDATEFILE",
                        args: {
                            description: params.content.description,
                            guid: params.content.guid
                        }
                    });
                } else {
                    self.onResetFileForm();
                    self.notifier.showErrorMessage(
                       printf(bizagi.localization.getResource("workportal-general-error-generic"), ""));
                }
            });
        }
    },

    validateAddFileDescriptionForm: function($description){
        var result = false,
            $textAreadescription = $description ;
        if($textAreadescription.val().trim() === ""){
            var descriptionValidation = bizagi.localization.getResource("workportal-project-discussion-requireddescription");
            $textAreadescription.parent().next().find("span").html(descriptionValidation);
        }
        else{
            $textAreadescription.parent().next().find("span").empty();
            result = true;
        }
        return result;
    },

    onResetFileForm: function () {
        var self = this;
        self.form.description.parent().next().find("span").empty();
        self.dialogBox.formContent.dialog("destroy");
        self.dialogBox.formContent.detach();
    },

    applyMenu: function () {
        var self = this;

        $(".ui-bizagi-wp-project-filespreview-edit", self.content).menu({
            select: $.proxy(self.onSelectMenu, self)
        }).removeClass("ui-widget-content");
    },

    clean: function () {
        var self = this;

        self.plugins = {};
        self.form = {};
        self.currentFile = {};
        self.filesNumber = 0;
    }
});

bizagi.injector.register("bizagi.workportal.widgets.project.filesPreview", ["workportalFacade", "dataService", "notifier", bizagi.workportal.widgets.project.filesPreview]);