
/*
 *   Name: BizAgi Workportal Widget Project Attachments
 *   Author: David Romero Estrada
 *   Comments:
 *   -   This script will define the framework API to manage attachments
 */

 (function ($) {

     // shorten references to variables. this is better for uglification 
     var kendo = window.kendo,
      ui = kendo.ui,
      Widget = ui.Widget;

     var ProjectAttachments = Widget.extend({

         init: function (element, options) {

             var that = this;

             // base call to initialize widget
             Widget.fn.init.call(that, element, options);

             that._maxFilesSize = (bizagi.currentUser.uploadMaxFileSize > that.options.maxFilesSize) ? bizagi.currentUser.uploadMaxFileSize : that.options.maxFilesSize;
             that._fileList = [];
             that._onlyValidateServerFileExtension = options.onlyValidateServerFileExtension || true;
             that._supportFileExt = options.extensions;
             that._uploadMaxFilesSize = options.maxSize;
             that.upload = that._initUpload();
             that.loadNotifier = that._initLoadNotifier();
             that.notification = that._initNotification();

             that._eventsHandler();

             that._initLocalization(that.options.localization);
         },

         options: {
             name: "ProjectAttachments",
             wrapper: $("<div class=\"project-attachments\"></div>"),
             multiple: true,
             dropZone: true,
             maxFilesSize: 25000000,
             enabled: true,
             localization: {}
         },

         _initUpload: function () {

             var that = this,
              options = that.options,
              localization = options.localization || {},
              auxNumberFilesSuccess = 0;

             that._initLocalization(localization);

             return this.element.kendoUpload({
                 async: {
                     saveUrl: options.saveUrl,
                     autoUpload: true
                 },
                 select: function (event) {
                     that._filterMaxFilesSize(event);
                     auxNumberFilesSuccess = 0;
                 },
                 complete: function(){
                     var interval = setInterval(function(){
                        if( that.loadNotifier.wrapper.find("li.k-file-progress").length === 0){
                            that._showNotificationCompleteUpload(that.loadNotifier.wrapper, auxNumberFilesSuccess);
                            clearInterval(interval);
                        }
                     }, 300);
                 },
                 upload: options.upload,
                 progress: function (event) {
                     that._onProgressFile(event);
                 },
                 success: function (event) {
                     that._fileList.push(event.files[0]);
                     auxNumberFilesSuccess += 1;
                     options.success(event);
                 },
                 error: function (event) {
                     that.onErrorFile(event);
                 },
                 localization: {
                     select: localization.selectFiles,
                     dropFilesHere: localization.dropFilesHere
                 },
                 multiple: options.multiple,
                 enabled: options.enabled,
                 dropZone: options.dropZone,
                 showFileList: false
             }).data("kendoUpload");

         },

         _initNotification: function(){
             return $("<div></div>").kendoNotification({
                 position: {
                     pinned: true
                 }
             }).data("kendoNotification");
         },

         _initLoadNotifier: function () {

             var that = this,
                    localization = that.options.localization,
                    $wrapper = that.options.wrapper;

             return $wrapper.kendoWindow({
                 title: localization.notifierTitle,
                 actions: ["Close"],
                 animation: {
                     open: {
                         duration: 100
                     },
                     close: {
                         duration: 100
                     }
                 },
                 open: function() {
                     this.wrapper.addClass("project-attachments-wrapper-window");
                 },
                 visible: false,
                 resizable: false,
                 draggable: false,
                 maxHeight: "300px",
                 minWidth: "430px"
             }).data("kendoWindow");

         },

         _initLocalization: function(objectOptionsLocalization){
             var that = this;
             var optionsLocalizationByDefault = {
                 selectFiles: bizagi.localization.getResource("workportal-project-attachments-addfiles"),
                 notifierTitle: bizagi.localization.getResource("workportal-project-attachments-notifiertitle"),
                 errorUpload: bizagi.localization.getResource("workportal-project-attachments-file-error-type"),
                 errorSecurity: bizagi.localization.getResource("workportal-project-attachments-blockedext"),
                 errorSize: bizagi.localization.getResource("workportal-project-attachments-blockedsize"),
                 errorMaxFilesSize: bizagi.localization.getResource("workportal-project-discussion-maxfilessize").replace("%s", (that._maxSize / 1000000)),
                 dropFilesHere: bizagi.localization.getResource("workportal-project-attachments-drophere"),
                 cancel: bizagi.localization.getResource("workportal-widget-reports-confirm-cancel"),
                 retry: bizagi.localization.getResource("workportal-project-attachments-retry"),
                 close: bizagi.localization.getResource("workportal-widget-dialog-box-close")
             };

             $.extend(objectOptionsLocalization, optionsLocalizationByDefault);
         },

         _onProgressFile: function (event) {

             var that = this;
             var $file = that._getFileItemByUID(event.files[0].uid);
             var percent = event.percentComplete;

             $(".k-progress", $file).css({
                 width: percent + "%"
             });

             $(".k-upload-pct", $file).removeClass("k-icon k-loading").text(percent + "%");

             if (percent === 100){ $(".k-upload-action .k-icon", $file).hide(); }
         },

         _onShowUploadNotifier: function (event) {

             var that = this,
                files = event.files,
                template = that.options.template;

             that.loadNotifier.content(template.render({ files: files }));
             that.loadNotifier.wrapper.css({
                 top: "auto",
                 left: "auto",
                 bottom: "1em",
                 right: "1em"
             });

             that.loadNotifier.open();
         },

        _showNotificationCompleteUpload: function(wrapperMessage, auxNumberFilesSuccess){
            var that = this;
            if( wrapperMessage.find("li.k-file-success").length === auxNumberFilesSuccess && wrapperMessage.find("li.k-file-error").length === 0)
            {
                that._autoHideMessage(wrapperMessage);
            }
        },

         _autoHideMessage: function(wrapperMessage){
             var that = this;
             setTimeout(function(){
                 wrapperMessage.fadeOut(function(){
                     that.loadNotifier.close();
                 });
             }, 2000);
         },

         _onCancelFile: function ($target) {
             var that = this,
                 $fileWrapper = $target.closest("li"),
                 $uploadWrapper = that.upload.wrapper,
                 guid = $fileWrapper.data("guid");

             $uploadWrapper.find("li[data-uid=" + guid + "] .k-upload-action").trigger("click");
             $fileWrapper.remove();
         },

         _onRemoveFile: function ($target) {
             var $fileWrapper = $target.closest("li");
             $fileWrapper.remove();
         },

         _onRetryFile: function ($target) {
             var that = this;
             var $file = $target.closest("li");
             var guid = $file.data("guid");
             var file = $.grep(that._fileList, function (i) {
                 return i.uid === guid;
             });

             that.options.retry(file[0]);
         },

         onErrorFile: function (event) {

             var that = this,
             localization = that.options.localization,
             file = event.files[0],
             validation = that._isValidFile(file);
             var message = (validation.message !== "") ? validation.message : localization.errorUpload;

             that.setStatus("ERROR", file.uid, message);
         },

         _isValidFile: function (file) {

             var that = this,
             localization = that.options.localization,
             valid = true,
             message = "";

             if (file.size > that._uploadMaxFilesSize) {
                 message = localization.errorSize;
                 valid = false;
             }

             if(!that._onlyValidateServerFileExtension){
                 if ($.inArray(file.extension, that._supportFileExt) === -1) {
                     message = localization.errorSecurity;
                     valid = false;
                 }
             }

             return {
                 valid: valid,
                 message: message
             };
         },

         _filterMaxFilesSize: function (event) {
            
            var that = this;
            var total = 0;

            for (var i = 0, length = event.files.length; i < length; i++){
                total += event.files[i].size;
            }
            
            if (total > that._maxFilesSize) {
                that._notifySizeExceeded();
                event.preventDefault();
            } else {
                that._onShowUploadNotifier(event);
            }
         },

         _notifySizeExceeded: function(){
         
             var that = this;

             that.notification.show(that.options.localization.errorMaxFilesSize, "error");
         },

         _getFileItemByUID: function (uid) {
             var that = this;
             return $("li[data-guid=" + uid + "]", that.loadNotifier.element);
         },

         _switchEvents: function (event) {
             var that = this;
             var $target = $(".k-icon", event.currentTarget);
             if ($target.hasClass("k-update") || $target.hasClass("k-remove")) {
                 that._onRemoveFile($target);
             } else if ($target.hasClass("k-retry")) {
                 that._onRetryFile($target);
             } else if ($target.hasClass("k-cancel")) {
                 that._onCancelFile($target);
             }
         },

         _eventsHandler: function () {
             var that = this;

             that.loadNotifier.element.on("click", "button.k-upload-action", function (event) {
                 that._switchEvents(event);
             });
         },

         cancelFilesUpload: function(){
             var that = this;
             var $uploadWrapper = that.upload.wrapper;

             $uploadWrapper.find("li .k-upload-action").trigger("click");
             that.close();
         },

         close: function () {
             this.loadNotifier.close();
         },

         destroy: function () {
             this.loadNotifier.destroy();
             this.upload.destroy();
         },

         setStatus: function (status, uid, message) {

             var $file = this._getFileItemByUID(uid),
                 localization = this.options.localization;

             switch (status) {
                 case "SUCCESS":
                     $file.removeClass("k-file-progress k-file-error").addClass("k-file-success");
                     $(".k-upload-action .k-icon", $file).removeClass("k-cancel k-i-refresh k-retry").addClass("k-update").prop("title", localization.close).show();
                     $(".k-errormsg", $file).text("");
                     break;
                 case "ERROR":
                     $file.removeClass("k-file-progress").addClass("k-file-error");
                     $(".k-upload-action .k-icon", $file).removeClass("k-i-refresh k-retry").addClass("k-remove").show();
                     $(".k-upload-status .k-upload-pct", $file).removeClass("k-upload-pct k-loading").addClass("k-icon k-warning");
                     $(".k-errormsg", $file).text(message).prop("title", message);
                     break;
                 case "RETRY":
                     $file.removeClass("k-file-progress").addClass("k-file-error");
                     $(".k-upload-status .k-upload-pct", $file).removeClass("k-upload-pct k-loading").addClass("k-warning").text("");
                     $(".k-upload-action .k-icon", $file).removeClass("k-cancel k-remove").addClass("k-i-refresh k-retry").prop("title", localization.retry).show();
                     $(".k-errormsg", $file).text(localization.errorUpload).prop("title", localization.errorUploadiis);
                     break;
             }
         }

     });

     ui.plugin(ProjectAttachments);
 })(jQuery);