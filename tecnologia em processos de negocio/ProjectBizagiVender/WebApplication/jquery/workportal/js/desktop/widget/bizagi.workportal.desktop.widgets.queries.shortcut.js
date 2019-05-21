/*
 *   Name: BizAgi Workportal Desktop stored queries shortcut
 *   Author: Iván Ricardo Taimal Narváez
 *   Comments:
 *   -   This script will provide behavior to stored queries shortcut
 */

// Auto extend
bizagi.workportal.widgets.queries.definition.extend("bizagi.workportal.widgets.queries.shortcut", {}, {

    init: function (workportalFacade, dataService, params) {
        var self = this;

        // Call base
        self._super(workportalFacade, dataService, params);

        //Load templates
        self.loadTemplates({
            "queries": bizagi.getTemplate("bizagi.workportal.desktop.widget.queries").concat("#ui-bizagi-workportal-widget-queries"),
            "queries-elements": bizagi.getTemplate("bizagi.workportal.desktop.widget.queries").concat("#ui-bizagi-workportal-widget-queries-elements"),
            "queries-empty-elements": bizagi.getTemplate("bizagi.workportal.desktop.widget.queries").concat("#ui-bizagi-workportal-widget-queries-empty-elements"),
            "queries-query-tree": bizagi.getTemplate("bizagi.workportal.desktop.widget.queries").concat("#ui-bizagi-workportal-widget-queries-query-tree"),
            "queries-query-confirm": bizagi.getTemplate("bizagi.workportal.desktop.widget.queries").concat("#ui-bizagi-workportal-widget-queries-confirm"),

            "queries-definition-elements": bizagi.getTemplate("bizagi.workportal.desktop.widget.queries").concat("#ui-bizagi-workportal-widget-queries-definition-elements"),
            "queries-flat-list": bizagi.getTemplate("bizagi.workportal.desktop.widget.queries").concat("#ui-bizagi-workportal-widget-queries-flat-list"),
            "queries-query-message-error": bizagi.getTemplate("bizagi.workportal.desktop.widget.queries").concat("#ui-bizagi-workportal-widget-queries-message-error"),

            "queries-shortcut": bizagi.getTemplate("bizagi.workportal.desktop.widget.queries.shortcut").concat("#ui-bizagi-workportal-widget-queries-shortcut"),
            "queries-shortcut-flat-list": bizagi.getTemplate("bizagi.workportal.desktop.widget.queries.shortcut").concat("#ui-bizagi-workportal-widget-queries-flat-list-shortcut"),
            "queries-shortcut-query-confirm": bizagi.getTemplate("bizagi.workportal.desktop.widget.queries.shortcut").concat("#ui-bizagi-workportal-widget-queries-confirm-shortcut"),
            "queries-shortcut-query-message-error": bizagi.getTemplate("bizagi.workportal.desktop.widget.queries.shortcut").concat("#ui-bizagi-workportal-widget-queries-message-error-shortcut"),
            useNewEngine: false
        });
    },

    /**
     *   To be overriden in each device to apply layouts
     */
    loadtemplates: function () {
        var self = this;
        self.flatListTemplate = self.getTemplate("queries-shortcut-flat-list");
        self.confirmTemplate = self.getTemplate("queries-shortcut-query-confirm");
        self.messageErrorTemplate = self.getTemplate("queries-shortcut-query-message-error");
    },
    postRender: function () {
        var self = this;
        var template = self.getTemplate("queries-shortcut");
        var content = self.content = $.tmpl(template);
        self.handleEvents();
        bizagi.workportal.widgets.queries.shortcut.instance = this;
    },

    handleEvents: function() {
        var self = this;
        $("#queryFormShortcutContainer").show();
        $("#queryFormShortcutContainer").click(function () {
            var queryFormShortcut =  $("#queryFormShortcut");
            var arrow = $(this).find("span");
            var isHidden = (queryFormShortcut.is(":hidden")) ? true : false;
            if (isHidden) {
                queryFormShortcut.show();
                arrow.removeClass("Right");
                arrow.addClass("Down");
                self.renderStoredQueries();
            } else {
                queryFormShortcut.hide();
                arrow.removeClass("Down");
                arrow.addClass("Right");
            }
        });
    },

    /**
     * Bind tree navigation
     */
    configureTreeNavigation: function () {
        var self = this;
        var categoryTree = $("#categoryTree", self.content);
        var queriesContainer = $("#queries-shortcut", self.content);
        $("li.storedQuery",queriesContainer).click(function () {
            var guid    =   $(this).data("guid");
            var id      =   $(this).data("id");
            var idNode =    $(this).data("idnode");
            var paramsStoredQuery;
            var result  =  $.grep(self.storedQueryForm, function(e){ return e.idNode == idNode; });
            if (result.length == 1) {
                paramsStoredQuery =   result[0];
                self.showQueryFormPopup({
                    "idStoredQuery": guid,
                    "idQuery":1,
                    "title": paramsStoredQuery.definition.name,
                    "paramsStoredQuery":paramsStoredQuery,
                    "queryFormAction":"execute",
                    "notMigratedUrl": paramsStoredQuery.notMigratedUrl ? paramsStoredQuery.notMigratedUrl.execute : ""
                });
            }
            self.currentPopup=undefined;
           // self.renderQueries();
        });

        // Bind for action elements (Edit and delete buttons)
        $(".bz-icon-pencil-outline", "#queries-shortcut").click(function (e) {
            var queryId = "-1";
            var guid = $(this).closest(".storedQuery").data("guid");
            var idStoredQuery = $(this).closest(".storedQuery").data("id");
            var idNode = $(this).closest(".storedQuery").data("idnode");
            var paramsStoredQuery;
            var result = $.grep(self.storedQueryForm, function (e) {
                return e.idNode == idNode;
            });
            if (result.length == 1) {
                paramsStoredQuery = result[0];
                self.showQueryFormPopup({
                    "queryFormAction": "edit",
                    "idStoredQuery": (idStoredQuery == "-1") ? "" : idStoredQuery,
                    "paramsStoredQuery": paramsStoredQuery,
                    "title": paramsStoredQuery.definition.name,
                    "notMigratedUrl": paramsStoredQuery.notMigratedUrl ? paramsStoredQuery.notMigratedUrl.edit : ""
                });
                bizagi.workportal.desktop.popup.closePopupInstance();
            }
        });

        $(".bz-icon-close", "#queries-shortcut .bz-shorcut__icons").click(function (e) {
            e.stopPropagation();
            var queryId = "-1";
            var guid = $(this).closest(".storedQuery").data("guid");
            var idStoredQuery = $(this).closest(".storedQuery").data("id");
            var idNode =   $(this).closest(".storedQuery").data("idnode");
            var confirmContent, paramsStoredQuery, confirmContentParams;

            var messageErrorForm    = self.getResource("workportal-widget-admin-entities-message-migrate");
            messageErrorForm        = messageErrorForm.replace("{build}", bizagi.loader.productBuildToAbout);

            var result = $.grep(self.storedQueryForm, function (e) {
                return e.idNode == idNode;
            });
            if (result.length == 1) {
                paramsStoredQuery = result[0];

                confirmContentParams ={
                    resizable: true,
                    modal: true,
                    title: self.getResource("workportal-widget-queries-confirm-title"),
                    buttons: []
                };

                var p_sessionId = bizagi.cookie("JSESSIONID");
                if(p_sessionId!==null && paramsStoredQuery.notMigratedUrl){
                    confirmContent = $.tmpl(self.messageErrorTemplate, { messageError: messageErrorForm });
                }
                else{
                    confirmContent = $.tmpl(self.confirmTemplate);

                    confirmContentParams.buttons = [
                        {
                            text: self.getResource("workportal-widget-queries-confirm-delete"),
                            click: function () {
                                $(this).dialog("close");
                                if (paramsStoredQuery.notMigratedUrl && paramsStoredQuery.notMigratedUrl["delete"]) {
                                    $.get("App/" + paramsStoredQuery.notMigratedUrl["delete"]);
                                }else{
                                    $.when(self.dataService.deleteStoredQueryForm({idStoredQueryForm: idStoredQuery})).done(function () {
                                        bizagi.workportal.desktop.popup.closePopupInstance();
                                        self.renderStoredQueries();
                                    });
                                }
                                self.renderStoredQueries();
                                bizagi.workportal.desktop.popup.closePopupInstance();
                            }
                        },
                        {
                            text: self.getResource("workportal-widget-queries-confirm-cancel"),
                            click: function () {
                                $(this).dialog("close");
                            }
                        }
                    ];
                }

                // Open dialog with confirm message
                $(confirmContent).dialog(confirmContentParams);
            }
        });
    },
    renderStoredQueries: function(params) {
        var self = this;
        var flatListTemplate = self.flatListTemplate;
        var queriesContainer = $("#queries-shortcut", self.content);
        var storedQueryFormContent;
        $.when(self.dataService.getStoredQueryFormList()).done(function (storedQueryForm) {
            self.storedQueryForm = storedQueryForm.storedQueryForms;
            storedQueryFormContent = $.tmpl(flatListTemplate, {storedQueryForm: self.storedQueryForm});
            storedQueryFormContent.appendTo(queriesContainer);
            self.configureTreeNavigation();
            if(self.storedQueryForm.length <= 0){
                $("#queryFormShortcutContainer").hide()
            }else{
                $("#queryFormShortcutContainer").show()
            }
        });
    }

});