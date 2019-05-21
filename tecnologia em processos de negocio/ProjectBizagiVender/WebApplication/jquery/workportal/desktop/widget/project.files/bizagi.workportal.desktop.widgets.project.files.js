/*
 *   Name: Bizagi Workportal Desktop Project Files Controller
 *   Author: David Romero Estrada
 */

bizagi.workportal.widgets.project.base.extend("bizagi.workportal.widgets.project.files", {}, {
    /**
    *   Constructor
    */
    init: function (workportalFacade, dataService, params) {

        var self = this;

        // Call base
        self._super(workportalFacade, dataService, params);

        self.plugins = {};
        self.prefixBase64 = "data:image/png;base64,";
        self.usersData = {};
        self.currentFilesList = [];
        self.fileDateInterval;

        //Load templates
        self.loadTemplates({
            "project-files": bizagi.getTemplate("bizagi.workportal.desktop.widget.project.files").concat("#project-files-wrapper"),
            "project-files-uploaditem": bizagi.getTemplate("bizagi.workportal.desktop.widget.project.files").concat("#project-files-uploaditem"),
            "project-files-list": bizagi.getTemplate("bizagi.workportal.desktop.widget.project.files").concat("#project-files-list"),
            "project-attachments": bizagi.getTemplate("bizagi.workportal.desktop.widgets.project.attachments").concat("#project-attachments")
        });
    },

    /**
    * Renders the template defined in the widget
    */
    renderContent: function () {
        var self = this;
        var templateHomeFiles = self.getTemplate("project-files");
        self.content = templateHomeFiles.render({ isOpen: !bizagi.util.parseBoolean(self.params.isClosedForAllUsers) });
        return self.content;
    },

    /**
    * Post render and links events with handlers
    */
    postRender: function () {
        var self = this;
        $.when(self.renderFilesList()).done(function () {
            self.plugins["uploadFiles"] = self.initializeUploadFiles();
            self.eventsHandler();
            self.restrictedEventsHandler();
        });
    },

    /**
    *   Render Files List
    */
    renderFilesList: function () {
        var self = this;
        var defer = $.Deferred();
        var filesLength = self.currentFilesList.length;
        var params = {
            globalParent: self.radNumber,
            dateTime: (!filesLength) ? self.getDateServer() : self.currentFilesList[filesLength - 1].date,
            count: 12
        };
        if(self.params.flowContext ==="FLOW-DECONTEXTUALIZED-PLANS"){
            params.globalParent = self.params.plan.id;
        }
        $.when(self.dataService.getFilesListByRadNumber(params)).done(function (files) {
            self.currentFilesList = self.currentFilesList.concat(files);

            self.renderFiles(files);

            defer.resolve();
        });

        return defer.promise();
    },

    /**
    * Render Files
    */
    renderFiles: function(files) {
        
        var self = this;

        var $content = self.getContent();
        var $showMoreWrapper = $("#project-files-showmore", $content);
        self.displayFileList(files, "append");
        self.updateRelativeTime();

        if (files.length) {
            self.setAdditionalData(files);
        }

        if (self.currentFilesList.length >= 12) {
            $showMoreWrapper.show();

            if (files.length < 12) {
                $("button", $showMoreWrapper).remove();
                $("#project-files-nomore", $showMoreWrapper).show();
            }
        }

        self.notifyFilesNumber(false);
    },

    /**
    * Render no files
    */
    renderNoFiles: function(){
        
        var self = this;
        var noFilesTmpl = self.workportalFacade.getTemplate("info-message");
        var message = self.resources.getResource("workportal-project-files-noavailable");

       /* self.disableSideBar();*/

        var $noFiles = $.tmpl(noFilesTmpl, {
            message: message
        });

        self.content.html($noFiles);
    },

    /**
    * Initialize upload files
    */
    initializeUploadFiles: function () {
        var self = this;
        var content = self.getContent();

        return $("#project-files-upload", content).kendoProjectAttachments({
            saveUrl: self.dataService.serviceLocator.getUrl("project-comments-uploadfiles"),
            template: self.getTemplate("project-attachments"),
            success: $.proxy(self.onSuccessFile, self),
            upload: $.proxy(self.addFileData, self),
            retry: $.proxy(self.onSaveFileData, self),
            enabled: true,
            extensions: self.supportFileExt,
            maxSize: self.uploadMaxFilesSize
        }).data("kendoProjectAttachments");
    },

    /**
    * Set Additional Data For Files
    */
    setAdditionalData: function (files) {

        var self = this;
        var thumbnails = [], users = [];

        for (var i = 0, length = files.length - 1; i <= length; i++) {
            users.push(files[i].user);
            thumbnails.push(files[i].attachment.guid);
        }

        self.setUserData(users.join());
        self.setThumbnails(thumbnails.join());
    },

    /**
    * Set User Data
    */
    setUserData: function (users) {
        var self = this;
        var $content = self.getContent();

        var params = {
            userIds: users,
            width: 50,
            height: 50
        };

        $.when(self.dataService.getUsersData(params)).done(function (users) {
            for (var i = 0, length = users.length - 1; i <= length; i++) {
                if(users[i].picture){
                    users[i].picture = self.prefixBase64 + users[i].picture;
                }
                self.usersData["id" + users[i].id] = users[i];
                $("#project-files-list .ui-bizagi-wp-project-files-user[data-userId=" + users[i].id + "]", $content).text(users[i].name);
            }
        });
    },

    /**
    * Get file list 
    */
    getFileInfoByGuid: function (guid) {
        var self = this;
        var file;
        for (var i = 0, length = self.currentFilesList.length; i < length; i++) {

            if (guid === self.currentFilesList[i].guid) {
                file = self.currentFilesList[i];
                i = length;
            }
        }
        return file;
    },

    /**
    * Set Thumbnails
    */
    setThumbnails: function (thumbnails) {
        var self = this;
        var $content = self.getContent();

        var params = {
            guids: thumbnails,
            width: 480,
            height: 150
        };

        $.when(self.dataService.getFilesThumbnails(params)).done(function (files) {
            var thumbnail, $wrapper, $img;

            $.each(files, function (guid, src) {
                guid = guid.toLowerCase();
                thumbnail = self.prefixBase64 + src;
                $wrapper = $("#project-files-list .ui-bizagi-wp-project-files-wrapitem[data-attchGuid=" + guid + "]", $content);
                $img = $(".ui-bizagi-wp-project-files-thumbnail", $wrapper);

                $img.prop("src", thumbnail);
                $(".ui-bizagi-wp-project-files-icon", $wrapper).remove();
                $img.css("display", "block");
            });
        });
    },

    /**
    * Set Preview
    */
    setFilePreview: function ($target, guidAttch, guidFile) {

        var self = this;
        var img = "";
        var params = {
            guids: [guidAttch].join(),
            width: 500,
            height: 500
        };

        $.when(self.dataService.getFilesThumbnails(params)).done(function (files) {
            var $userTag = $target.find(".ui-bizagi-wp-project-files-user");
            var userId = $userTag.data("userid");

            $.each(files, function (guid, src) {
                img = self.prefixBase64 + src;
            });

            self.pub("notify", {
                type: "FILEPREVIEW",
                args: {
                    radNumber: self.radNumber,
                    fileData: self.getFileInfoByGuid(guidFile),
                    userData: self.usersData["id" + userId],
                    isOpen: !bizagi.util.parseBoolean(self.params.isClosedForAllUsers),
                    img: img
                }
            });

            self.pub("notify", {
                type: "OPEN_RIGHT_SIDEBAR"
            });
        });
    },

    /**
    *  On Success File
    */
    onSuccessFile: function (event) {

        var self = this;
        var status = (event.XMLHttpRequest.response) ? JSON.parse(event.XMLHttpRequest.response) : {};

        if (!status.error) {
            self.onSaveFileData(event.files[0]);
        } else {
            self.plugins["uploadFiles"].onErrorFile(event);
        }
    },

    /**
    * On Save File Data
    */
    onSaveFileData: function (file) {

        var self = this;

        $.when(self.saveFileData(file)).done(function () {
            self.notifyFilesNumber();
            self.plugins["uploadFiles"].setStatus("SUCCESS", file.uid);
        }).fail(function () {
            self.plugins["uploadFiles"].setStatus("RETRY", file.uid);
        });
    },

    /**
     * Retry file
     * @param $target
     */
    onRetryFile: function ($target) {
        var self = this;
        var $file = $target.closest("li");
        var guid = $file.data("guid");

        var file = $.grep(self.currentFilesList, function (i) {
            return i.uid === guid;
        });

        self.onSaveFileData($file, file[0]);
    },

    /**
     * Add Guid to Files Data
     * @param event
     */
    addFileData: function (event) {
        var self = this;

        //add guid to send
        event.data = {
            guid: event.files[0].uid
        };
    },

    /**
     * Save Files
     * @param file
     * @return {*}
     */
    saveFileData: function (file) {

        var self = this;
        var defer = $.Deferred();

        var guid = Math.guid();
        var globalParent = self.radNumber ? self.radNumber.toString() : "";
        if (self.params.flowContext === "FLOW-DECONTEXTUALIZED-PLANS") {
            globalParent = self.params.plan.id;
        }

        var params = {
            "content": {
                "guid": guid,
                "description": "",
                "name": file.name,
                "attachment": {
                    "guid": file.uid,
                    "name": file.name
                },
                "date": self.getDateServer(),
                "user": bizagi.currentUser.idUser,
                "globalParent": globalParent
            },
            "attachmentsToCreate": [
                file.uid
            ]
        };

        self.currentFilesList.unshift(file);

        $.when(self.dataService.createProjectFile(params)).always(function (response) {
            if (response.status === 200 || response.status === 201 || response.status === undefined) {

                //extend file data
                $.extend(file, {
                    user: bizagi.currentUser.idUser,
                    userName: bizagi.currentUser.userName,
                    date: new Date().getTime(),
                    attachment: params.content.attachment,
                    guid: params.content.guid,
                    description: params.content.description
                });

                self.usersData["id" + bizagi.currentUser.idUser] = {
                    picture: bizagi.currentUser.photo,
                    name: bizagi.currentUser.userName,
                    id: bizagi.currentUser.idUser
                };

                self.displayFileList(file, "prepend");

                self.updateRelativeTime();
                self.setThumbnails(file.uid);

                defer.resolve();
            } else {

                defer.reject();
            }
        });

        return defer;
    },

    /**
     * Display File List
     * @param files
     * @param action
     */
    displayFileList: function (files, action) {
        var self = this;
        var tmpl = self.getTemplate("project-files-list");
        var files = files || self.currentFilesList;
        var content = self.getContent();
        var $filesList = tmpl.render({
            files: files
        });

        $("#project-files-list", content)[action]($filesList);
        $.equalizeHeights(".bz-card");
    },

    /**
     * Delete file
     * @param event
     * @param params
     */
    deleteFile: function(event, params){
        var self = this;

        var content = self.getContent();
        $("div[data-fileguid='" + params.args.guid + "']", content).remove();

        self.currentFilesList = self.currentFilesList.filter(function( file ) {
            return file.guid !== params.args.guid;
        });

        self.notifyFilesNumber(true);
    },

    /**
     * Update File Data
     * @param event
     * @param params
     */
    updateFileData: function (event, params) {

        var self = this;
        var file = self.getFileInfoByGuid(params.args.guid);

        file.description = params.args.description;
    },

    /**
    * Update relative time
    */
    updateRelativeTime: function () {

        var self = this;

        if (self.fileDateInterval) clearInterval(self.fileDateInterval);

        self.fileDateInterval = setInterval($.proxy(self.changeRelativeTime, self), "7000");
    },

    /**
    * Change Relative Time
    */
    changeRelativeTime: function () {

        var self = this;
        var $content = self.getContent();

        $("#project-files-list .ui-bizagi-wp-project-files-date", $content).each(function (i, item) {
            var dateTime = $(item).data("date");
            var relativeTime = bizagi.util.dateFormatter.getRelativeTime(new Date(dateTime), null, false);

            $(item).text(relativeTime);
        });
    },

    /**
     * Filter files by some criteria
     * @param event
     */
    onSelectFiles: function (event) {

        var self = this,
            bannedFiles = [],
            files = event.files;

        for (var i = files.length - 1; i >= 0; i--) {

            if (!self.isValidFile(files[i]).valid) {
                var bannedFile = files.splice(i, i + 1);
                bannedFiles.unshift(bannedFile[0]);
            }
        }

        if (bannedFiles.length > 0) {
            self.showFilesError(bannedFiles);
        }
    },

    /**
     * Reset widget
     */
    resetWidget: function () {

        var self = this;
        if(self.plugins["uploadFiles"]){
            self.plugins["uploadFiles"].close();
        }
        self.currentFilesList = [];
        clearInterval(self.fileDateInterval);
    },

    /**
    * Switch Events
    */
    switchFilesEvents: function (event) {

        event.stopPropagation();

        var self = this;
        
        var $target = $(event.target),
            $item = $target.closest(".ui-bizagi-wp-project-files-wrapitem");

        if($item.length) {
            
            var guidAttch = $item.data("attchguid"),
                guidFile = $item.data("fileguid");

            if ($target.hasClass("ui-bizagi-wp-project-files-file")) {
                var fileName = $target.text();

                self.dataService.getDownloadAttachment(guidAttch, fileName);
            } else{
                self.setFilePreview($item, guidAttch, guidFile);
            }
        
        } else if ($target.parent().prop("id") === "project-files-showmore") {
            self.renderFilesList();
        } else if ($target.prop("id") !== "project-files-upload") {
            self.notifyFilesNumber(true)
        }
         
    },

    /**
     * Show number files to right sidebar
     * @param mandatory
     */
    notifyFilesNumber: function(mandatory){
        var self = this;

        self.pub("notify", {
            type: "SETFILESNUMBER",
            args: {
                filesNumber: self.currentFilesList.length,
                mandatory: mandatory
            }
        });
    },

    /**
     * Restricted Event Handler
     */
    restrictedEventsHandler: function(){
        var self = this;
        self.content.on("click", $.proxy(self.switchFilesEvents, self));
    },

    /**
    *  Events Handler
    */
    eventsHandler: function () {

        var self = this;
        var $content = self.getContent();

        self.sub("changeProjectWidget", $.proxy(self.resetWidget, self));
        self.sub("UPDATEFILE", $.proxy(self.updateFileData, self));
        self.sub("DELETEFILE", $.proxy(self.deleteFile, self));

        $content.on("click", $.proxy(self.switchFilesEvents, self));
    },

    /**
    * Clean
    */
    clean: function(){
        var self = this;
        self.resetWidget();

        self.unsub("changeProjectWidget", $.proxy(self.resetWidget, self));
        self.unsub("UPDATEFILE", $.proxy(self.updateFileData, self));
        self.unsub("DELETEFILE", $.proxy(self.deleteFile, self));

        for (var i in self.plugins) {
            if (self.plugins[i])
                self.plugins[i].destroy();
        }

        clearInterval(self.fileDateInterval);
        self._super();
    }
});

bizagi.injector.register("bizagi.workportal.widgets.project.files", ["workportalFacade", "dataService", bizagi.workportal.widgets.project.files], true);