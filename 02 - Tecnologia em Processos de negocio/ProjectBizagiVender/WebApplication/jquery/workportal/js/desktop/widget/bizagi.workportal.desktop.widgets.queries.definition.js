/*
*   Name: BizAgi Workportal Desktop New Case Widget Controller
*   Author: Juan Pablo Crossley
*   Comments:
*   -   This script will provide desktop overrides to implement the new case widget
*/

// Auto extend
bizagi.workportal.widgets.queries.extend("bizagi.workportal.widgets.queries.definition", {}, {

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

            useNewEngine: false
        });
    },

    /**
    *   To be overriden in each device to apply layouts
    */
    loadtemplates: function () {
        var self = this;
        self.mainTemplate = self.getTemplate("queries-definition-elements");
        self.emptyTemplate = self.getTemplate("queries-empty-elements");
        self.flatListTemplate = self.getTemplate("queries-flat-list");
        self.confirmTemplate = self.getTemplate("queries-query-confirm");
        self.messageErrorTemplate = self.getTemplate("queries-query-message-error");
    },

    postRender: function () {
        var self = this;
        // Set bind event for last element
        self.configureTreeNavigation("#queries");
        // Render base categories
        self.renderQueries();
        // set vertical scroll
        self.scrollVertical({
            "autohide": false
        });
    },

    /**
    * Render List categories for each idCategory
    */
    renderQueries: function (idParentQuery, appendElement) {
        var self = this;
        var content = self.getContent();
        var template = self.mainTemplate;
        var emptyTemplate = self.emptyTemplate;
        var queriesContainer = $("#queries", content);
        var queryContent;
        var mergeData;

        $.when(self.dataService.getQueriesDefinitions({
            idNode: idParentQuery
        })).done(function (data) {

            queriesContainer.empty();

            // check if service have nodes
            data = data || {};

            if (data.length >= 1) {
                // Check if have appendElement
                if (appendElement !== undefined) {
                    mergeData = $.merge(appendElement, data);
                } else {
                    mergeData = data;
                }

                queryContent = $.tmpl(template, mergeData, {
                    checkChildNode: self.checkChildNode
                });
            } else {
                queryContent = $.tmpl(emptyTemplate, mergeData);
            }

            //if ((typeof idParentQuery === "undefined" || idParentQuery === "-1") && bizagi.util.parseBoolean(bizagi.override.disableFrankensteinQueryForms)) {
            if ((typeof idParentQuery === "undefined" || idParentQuery === "-1")) {
                $.when(self.dataService.getStoredQueryFormList()).done(function (storedQueryForm) {
                    queryContent.appendTo(queriesContainer);
                    if (storedQueryForm.storedQueryForms.length > 0) {
                        var stored = $.tmpl(template, {
                            queryType: "-2",
                            queryDisplayName: self.getResource("workportal-widget-queries-stored-query-forms"),
                            nodes: [],
                            guidForm: "stored"
                        });
                        var allQueries = $.merge(queryContent, stored);
                        
                        allQueries.appendTo(queriesContainer);
                        self.storedQueryForm = storedQueryForm.storedQueryForms;

                    }
                    self.configureNavTree(queriesContainer);
                });
            }

            else {
                queryContent.appendTo(queriesContainer);
            }

            // set actions to rendered html 
            self.configureNavTree(queriesContainer);
        });
    },

    /**
    * Render List stored query Form
    */
    renderStoredQueries: function () {
        var self = this;
        var content = self.getContent();
        var flatListTemplate = self.flatListTemplate;
        var queriesContainer = $("#queries", content);
        var storedQueryFormContent;
        storedQueryFormContent = $.tmpl(flatListTemplate, { storedQueryForm: self.storedQueryForm });
        storedQueryFormContent.appendTo(queriesContainer);
    },

    configureNavTree: function (queriesContainer) {
        var self = this;
        var confirm = self.getTemplate("queries-query-confirm");

        // Bind for list elements
        $("li", "#queries").click(function () {
            var idNode = $(this).children("#idNode").val();
            var guidQueryForm = $(this).children("#guidQueryForm").val();
            var guidForm = $(this).children("#guidForm").val();
            var guidContext = $(this).children("#guidContext").val();
            var queryType = $(this).children("#queryType").val();
            var nodesLength = $(this).children("#nodesLength").val();
            var queryDisplayName = $(this).children("#queryDisplayName").val();
            var headerTemplate = self.getTemplate("queries-query-tree");
            var categoryTree = $("#categoryTree");
            var notMigratedUrl = $(this).children("#notMigratedUrl").val();

            if (queryType == "-2") {
                self.renderStoredQueries();
                $.tmpl(headerTemplate, {
                    idParentQuery: "-2",
                    queryDisplayName: queryDisplayName
                }).appendTo(categoryTree);
                self.configureTreeNavigation("#queries");
            }
            else if (nodesLength > 0) {
                // Is category with link
                // Add element for tree navigation
                $.tmpl(headerTemplate, {
                    idParentQuery: idNode,
                    queryDisplayName: queryDisplayName
                }).appendTo(categoryTree);
                // Set bind event for last element
                self.configureTreeNavigation("#queries");
                self.renderQueries(idNode);
            } else {
                // Is Process
                bizagi.workportal.desktop.popup.closePopupInstance();
                var title = $("#queryDisplayName", this).val();
                self.showQueryFormPopup({
                    "guidForm": guidForm,
                    "guidEntity": guidContext,
                    "title": title,
                    "queryFormAction": "renderQueryForm",
                    "queryType": queryType,
                    "notMigratedUrl": notMigratedUrl
                });
            }
        });

        $(".deleteGAButton").click(function (e) {
            e.stopPropagation();
            var  confirmContent = $.tmpl(self.confirmTemplate);
            var  confirmContentParams ={
                resizable: true,
                modal: true,
                title: self.getResource("workportal-widget-queries-confirm-title"),
                buttons: []
            };
            var notMigratedUrlDelete= $("#notMigratedUrlDelete",$(this).parent()).val();

            confirmContentParams.buttons = [
                {
                    text: self.getResource("workportal-widget-queries-confirm-delete"),
                    click: function () {
                        $(this).dialog("close");
                        //checks if it should use the url based method to delete the query
                        if (notMigratedUrlDelete) {
                            $.destroy(notMigratedUrlDelete);
                        }
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
            $(confirmContent).dialog(confirmContentParams);

        });
    },

    /**
    * Bind tree navigation
    */
    configureTreeNavigation: function (container) {
        var self = this;
        var content = self.getContent();
        var categoryTree = $("#categoryTree", content);
        var queriesContainer = $(container, content);
        // Bind header events
        $("li:last-child", categoryTree).click(function () {
            // Remove all elements
            $(this).nextAll().remove();
            var idParent = $(this).children("#idParent").val();
            // Render query tree again
            if (idParent == "-2") {
                self.renderStoredQueries();
            } else {
                self.renderQueries(idParent);
            }
        });

        $("li.storedQuery", queriesContainer).click(function () {
            var guid = $(this).data("guid");
            var id = $(this).data("id");
            var idNode = $(this).data("idnode");
            var paramsStoredQuery;
            var result = $.grep(self.storedQueryForm, function (e) {
                return e.idNode == idNode;
            });
            if (result.length == 1) {
                paramsStoredQuery = result[0];

                self.showQueryFormPopup({
                    "idStoredQuery": guid,
                    "idQuery": 1,
                    "title": paramsStoredQuery.definition.name,
                    "paramsStoredQuery": paramsStoredQuery,
                    "queryFormAction": "execute",
                    "notMigratedUrl": paramsStoredQuery.notMigratedUrl ? paramsStoredQuery.notMigratedUrl.execute : ""
                });
            }
        });

        // Bind for action elements (Edit and delete buttons)
        $(".editButton", container).click(function (e) {
            e.stopPropagation();
            var queryId = "-1";
            var guid = $(this).parent().data("guid");
            var idStoredQuery = $(this).parent().data("id");
            var idNode = $(this).parent().data("idnode");
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
        $(".deleteButton", container).click(function (e) {
            e.stopPropagation();
            var queryId = "-1";
            var guid = $(this).parent().data("guid");
            var idStoredQuery = $(this).parent().data("id");
            var idNode =    $(this).parent().data("idnode");
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
                                //checks if it should use the url based method to delete the query
                                if (paramsStoredQuery.notMigratedUrl && paramsStoredQuery.notMigratedUrl["delete"]) {
                                    $.get("App/" + paramsStoredQuery.notMigratedUrl["delete"]);
                                } else {
                                    self.dataService.deleteStoredQueryForm({ idStoredQueryForm: idStoredQuery });
                                }
                                bizagi.workportal.desktop.popup.closePopupInstance();
                                self.publish("refreshQueryFormShortCut");
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

    scrollVertical: function () {
        var self = this;
        var content = self.getContent();
        $("#queries", content).bizagiScrollbar({
            "autohide": false
        });
    },

    /*
    *   Show new case popup to create a case
    */
    showQueryFormPopup: function (arg) {
        var self = this;
        var queryFormAction = arg.queryFormAction || "";
        var title = arg.title || "";
        var queryType = arg.queryType || "";
        var guidForm = arg.guidForm || "";
        var guidEntity = arg.guidEntity || "";
        var paramsStoredQuery = arg.paramsStoredQuery || {};
        // If the same popup is opened close it
        if (self.currentPopup == "queryform") {
            bizagi.workportal.desktop.popup.closePopupInstance();
            return;
        }
        // Shows a popup widget
        self.currentPopup = "queryform";
        self.publish("showDialogWidget", {
            widgetName: bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_QUERYFORM,
            queryFormAction: queryFormAction,
            queryType: queryType,
            paramsStoredQuery: paramsStoredQuery,
            modalParameters: {
                title: title,
                id: "Queries"
            },
            closeVisible: false,
            guidForm: guidForm,
            guidEntity: guidEntity,
            notMigratedUrl: arg.notMigratedUrl || "",
            maximizeOnly: true,
            editQueryForm: function(params){
                self.currentPopup=undefined;
                self.showPopUpEditQueryForm(params);

            },
            executeQueryForm: function(params){
                self.currentPopup=undefined;
                self.showPopUpResultsQueryForm(params);
            }
        });
    },

    showPopUpEditQueryForm: function(params) {
        var self = this;
        var content = self.getContent();

        $.when(self.dataService.getStoredQueryFormList()).done(function (storedQueryForm) {
            self.storedQueryForm = storedQueryForm.storedQueryForms;
            self.publish("refreshQueryFormShortCut");
            if ( params && params.response ) {
                var idQueryForm = params.response;
                self.editQueryForm(idQueryForm);
            }
        });
    },

    showPopUpResultsQueryForm: function(params){
        var self = this;
        var content = self.getContent();

        $.when(self.dataService.getStoredQueryFormList()).done(function (storedQueryForm) {
            self.storedQueryForm = storedQueryForm.storedQueryForms;
            self.publish("refreshQueryFormShortCut");
            if ( params && params.response ) {
                var idQueryForm = params.response;
                self.executeQueryForm(idQueryForm);
            }
        });
    },

    editQueryForm : function(idQueryForm){
        var self = this;
        var paramsStoredQuery = self.getParamsStoredQuery(idQueryForm);
        if (paramsStoredQuery.length == 1) {
            paramsStoredQuery = paramsStoredQuery[0];
            self.showQueryFormPopup({
                "queryFormAction": "edit",
                "idStoredQuery": (idQueryForm == "-1") ? "" : idQueryForm,
                "paramsStoredQuery": paramsStoredQuery,
                "title": paramsStoredQuery.definition.name,
                "notMigratedUrl": paramsStoredQuery.notMigratedUrl ? paramsStoredQuery.notMigratedUrl.edit : ""
            });
        }
    },
    executeQueryForm: function(idQueryForm){
        var self = this;
        var paramsStoredQuery = self.getParamsStoredQuery(idQueryForm);
        if (paramsStoredQuery.length == 1) {
            paramsStoredQuery = paramsStoredQuery[0];
            self.showQueryFormPopup({
                "idStoredQuery": paramsStoredQuery.guid,
                "idQuery": 1,
                "title": paramsStoredQuery.definition.name,
                "paramsStoredQuery": paramsStoredQuery,
                "queryFormAction": "execute",
                "notMigratedUrl": paramsStoredQuery.notMigratedUrl ? paramsStoredQuery.notMigratedUrl.execute : ""
            });
        }
    },

    getParamsStoredQuery: function(idQueryForm){
        var self = this;
        return  $.grep(self.storedQueryForm, function (e) {
            return e.id == idQueryForm;
        });
    }
});
