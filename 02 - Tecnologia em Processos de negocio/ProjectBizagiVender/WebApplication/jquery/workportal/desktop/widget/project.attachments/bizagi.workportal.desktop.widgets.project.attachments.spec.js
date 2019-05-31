/**
 * Unit Testing project.attachments
 *
 * @author Elkin Fernando Siabato Cruz
 */

describe("Plugin kendo project.attachments", function () {
    var plugin;
    it("enviroment has been defined", function(){
        bizagi.currentUser = {
            uploadMaxFileSize: 1000
        };

        var $wrapper = $("<div class='root'></div>");
        $wrapper.append("<div class='wrapper-attachment'></div>");
        $(".wrapper-attachment", $wrapper).append('<input type="file" name="file[]" class="ui-bizagi-wp-project-discussions-attachment-upload" multiple="false" accept=".jpg,.pdf,.txt,.png,.pptx,.docx,.gif,.rtfx,.xlsx,.zip,.rar">');
        plugin = $(".wrapper-attachment", $wrapper).kendoProjectAttachments({
            saveUrl: "/api/mock/save",
            template: {"markup":"    <ul class=\"k-upload-files k-reset\">        {{for files}}            <li class=\"k-file k-file-progress\" data-guid=\"{{:uid}}\">                <span class=\"k-progress\"></span>                <span class=\"k-filename\">{{>name}}</span>                <strong class=\"k-upload-status\">                    <span class=\"k-errormsg\"></span>                    <span class=\"k-upload-pct k-icon k-loading\"></span>                    <button type=\"button\" class=\"k-button k-button-bare k-upload-action\">                        <span class=\"k-icon k-cancel\" title=\"Cancel\"></span>                    </button>                </strong>            </li>        {{/for}}    </ul>","tmpls":[{"markup":"            <li class=\"k-file k-file-progress\" data-guid=\"{{:uid}}\">                <span class=\"k-progress\"></span>                <span class=\"k-filename\">{{>name}}</span>                <strong class=\"k-upload-status\">                    <span class=\"k-errormsg\"></span>                    <span class=\"k-upload-pct k-icon k-loading\"></span>                    <button type=\"button\" class=\"k-button k-button-bare k-upload-action\">                        <span class=\"k-icon k-cancel\" title=\"Cancel\"></span>                    </button>                </strong>            </li>        ","tmpls":[],"links":{},"tags":{},"bnds":[],"_is":"template","htmlTag":"li","tmplName":"#jquery/workportal/desktop/widget/project.attachments/project.attachments.tmpl.html?build=11.0.0.2260.0#project-attachments/for"}],"links":{},"tags":{},"bnds":[],"_is":"template","tmplName":"#jquery/workportal/desktop/widget/project.attachments/project.attachments.tmpl.html?build=11.0.0.2260.0#project-attachments","htmlTag":"ul"},
            success: function (event) {
                console.log("success");
            },
            upload: function(){console.log("upload")},
            dropZone: false,
            extensions: [".jpg", ".pdf", ".txt", ".png", ".pptx", ".docx", ".gif", ".rtfx", ".xlsx", ".zip", ".rar"],
            maxSize: 1048576
        }).data("kendoProjectAttachments");
    });

    describe("Functions", function(){
        describe("_onProgressFile", function () {
            describe("When percent is 100", function () {
                beforeEach(function () {
                    event = {
                        files: [
                            {
                                uid: "uid01"
                            }
                        ],
                        percentComplete: 100
                    };
                    spyOn($.fn, "hide");
                    plugin.__proto__.that = {
                        loadNotifier: {
                            element: $("<ul><li data-guid='uid01'></li></ul>")
                        }
                    };

                    spyOn(plugin.__proto__, "_getFileItemByUID");
                });

                it("Should hide icon upload", function () {
                    plugin.__proto__._onProgressFile(event);
                    expect($.fn.hide).toHaveBeenCalled();
                });
            });
        });
        describe("cancelFilesUpload", function () {
            beforeEach(function () {
                spyOn(plugin.__proto__, "close");
                plugin.__proto__.upload = {wrapper: $("<ul><li><div class='k-upload-action'></div></li></ul>")};
            });
            it("Should call close", function () {
                plugin.__proto__.cancelFilesUpload();
                expect(plugin.__proto__.close).toHaveBeenCalled();
            });
        });

        describe("_switchEvents", function(){
            beforeEach(function () {
                markup = $("<ul class=\"k-upload-files k-reset\"> <li class=\"k-file k-file-error\" data-guid=\"be6d73e4-3956-4570-a91a-b54e1df4ad32\"> <span class=\"k-progress\" style=\"width: 100%;\"></span> <span class=\"k-filename\">Bizagi FedEx Day.pdf</span> <strong class=\"k-upload-status\"> <span class=\"k-errormsg\">Ocurrió un error al cargar el archivo</span> <span class=\"k-icon k-warning\">100%</span> <button type=\"button\" class=\"k-button k-button-bare k-upload-action\"> <span class=\"k-icon k-cancel k-remove k-retry\" title=\"Cancel\"></span> </button> </strong> </li></ul>");
                plugin.__proto__.options.retry = function(){};
                plugin.__proto__._fileList = [{uid: "uid1"}];
                spyOn(plugin.__proto__.options, "retry");
            });

            it("Should be remove", function(){
                expect($(markup).find(".k-remove").length).toBe(1);
                plugin.__proto__._switchEvents({currentTarget: $(".k-remove", markup).parent()});
                expect($(markup).find(".k-remove").length).toBe(0);
            });

            it("Should be retry", function(){
                $(".k-remove", markup).removeClass("k-remove");
                plugin.__proto__._switchEvents({currentTarget: $(".k-retry", markup).parent()});
                expect(plugin.__proto__.options.retry).toHaveBeenCalled();
            });
            it("Should be cancel", function(){
                $(".k-remove", markup).removeClass("k-remove");
                $(".k-retry", markup).removeClass("k-retry");
                expect($(".k-cancel", markup).length).toBe(1);
                plugin.__proto__._switchEvents({currentTarget: $(".k-cancel", markup).parent()});
                expect($(".k-cancel", markup).length).toBe(0);
            });

        });
        describe("onErrorFile", function () {
            beforeEach(function () {
                spyOn(plugin.__proto__, "setStatus").and.callThrough();
                plugin.__proto__.loadNotifier = {
                    element: $("<div><div class=\"k-file-progress\"></div></div>")
                }
            });
            it("Should call setStatus", function () {
                plugin.__proto__.onErrorFile({files:[{size: 99998576, extension: "pdf"}]});
                expect(plugin.__proto__.setStatus).toHaveBeenCalled();
            });
        });

        describe("_onShowUploadNotifier", function () {
            beforeEach(function () {
                event = {
                    files: [
                        {
                            uid: "uid01"
                        }
                    ],
                    percentComplete: 100
                };
                plugin.__proto__.options.template = {
                    render: function(){

                    }
                };
                plugin.__proto__.loadNotifier = {
                    content: function(){},
                    wrapper: {
                        css: function(){}
                    },
                    open: function(){},
                    close: function(){}
                }
                spyOn(plugin.__proto__.loadNotifier, "open");
            });
            it("Should call open", function () {
                plugin.__proto__._onShowUploadNotifier(event);
                expect(plugin.__proto__.loadNotifier.open).toHaveBeenCalled();
            });
        });
        describe("_showNotificationCompleteUpload", function () {
            var mockMessage;
            describe("When upload throw error", function () {
                beforeEach(function () {
                    spyOn(plugin.__proto__, "_autoHideMessage");
                    mockMessage = $("<div class=\"project-attachments k-window-content k-content\" data-role= \"window\" style=\"max-height: 300px;\" tabindex=\"0\"> <ul class=\"k-upload-files k-reset\"> <li class=\"k-file k-file-error\" data-guid= \"3da5194d-627e-4617-9c66-df2e25d6db4b\"><span class=\"k-progress\" style=\"width: 100%;\"></span> <span class= \"k-filename\">python-wrapper.js</span> <strong class= \"k-upload-status\"><span class=\"k-errormsg\">Ocurri\u00f3 un error al cargar el archivo</span> <span class=\"k-icon k-warning\">100%</span> <button class=\"k-button k-button-bare k-upload-action\" type= \"button\"><strong class=\"k-upload-status\"><span class= \"k-icon k-cancel k-remove\" style=\"display: inline-block;\" title= \"Cancel\"></span></strong></button></strong></li> </ul> </div>");
                });
                it("Should dont hide message", function () {
                    plugin.__proto__._showNotificationCompleteUpload(mockMessage, 0);
                    expect(plugin.__proto__._autoHideMessage).not.toHaveBeenCalled();

                    plugin.__proto__._showNotificationCompleteUpload(mockMessage, 1);
                    expect(plugin.__proto__._autoHideMessage).not.toHaveBeenCalled();

                    plugin.__proto__._showNotificationCompleteUpload(mockMessage, 2);
                    expect(plugin.__proto__._autoHideMessage).not.toHaveBeenCalled();
                });
            });
            describe("When upload dont throw error", function () {
                beforeEach(function () {
                    spyOn(plugin.__proto__, "_autoHideMessage");
                });
                it("Should active auto hide message", function () {
                    mockMessage = $("<div class=\"project-attachments k-window-content k-content\" data-role= \"window\" style=\"max-height: 300px;\" tabindex=\"0\"> <ul class=\"k-upload-files k-reset\"> <li class=\"k-file k-file-success\" data-guid= \"3da5194d-627e-4617-9c66-df2e25d6db4b\"><span class=\"k-progress\" style=\"width: 100%;\"></span> <span class= \"k-filename\">python-wrapper.js</span> <strong class= \"k-upload-status\"><span class=\"k-errormsg\">Ocurri\u00f3 un error al cargar el archivo</span> <span class=\"k-icon k-warning\">100%</span> <button class=\"k-button k-button-bare k-upload-action\" type= \"button\"><strong class=\"k-upload-status\"><span class= \"k-icon k-cancel k-remove\" style=\"display: inline-block;\" title= \"Cancel\"></span></strong></button></strong></li> </ul> </div>");
                    plugin.__proto__._showNotificationCompleteUpload(mockMessage, 1);
                    expect(plugin.__proto__._autoHideMessage).toHaveBeenCalled();

                });
            });
        });
        describe("_autoHideMessage", function () {
            beforeEach(function () {
                spyOn(plugin.__proto__.loadNotifier, "close");
                jasmine.clock().install()
            });
            it("Should close message on 2 seconds", function () {
                mockMessage = $("<div class=\"project-attachments k-window-content k-content\" data-role= \"window\" style=\"max-height: 300px;\" tabindex=\"0\"> <ul class=\"k-upload-files k-reset\"> <li class=\"k-file k-file-success\" data-guid= \"3da5194d-627e-4617-9c66-df2e25d6db4b\"><span class=\"k-progress\" style=\"width: 100%;\"></span> <span class= \"k-filename\">python-wrapper.js</span> <strong class= \"k-upload-status\"><span class=\"k-errormsg\">Ocurri\u00f3 un error al cargar el archivo</span> <span class=\"k-icon k-warning\">100%</span> <button class=\"k-button k-button-bare k-upload-action\" type= \"button\"><strong class=\"k-upload-status\"><span class= \"k-icon k-cancel k-remove\" style=\"display: inline-block;\" title= \"Cancel\"></span></strong></button></strong></li> </ul> </div>");
                plugin.__proto__._autoHideMessage(mockMessage);
                jasmine.clock().tick(2001);
                expect(plugin.__proto__.loadNotifier.close).toHaveBeenCalled();
            });
            afterEach(function() {
                jasmine.clock().uninstall();
            });
        });
    });
});
