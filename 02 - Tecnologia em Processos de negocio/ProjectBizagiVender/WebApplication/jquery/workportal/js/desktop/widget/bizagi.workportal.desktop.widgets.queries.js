/*
 *   Name: BizAgi Workportal Desktop New Case Widget Controller
 *   Author: Juan Pablo Crossley
 *   Comments:
 *   -   This script will provide desktop overrides to implement the new case widget
 */

// Auto extend
bizagi.workportal.widgets.queries.extend("bizagi.workportal.widgets.queries", {}, {

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
            useNewEngine: false
        });
    },

    /**
    *   To be overriden in each device to apply layouts
    */
    postRender: function () {
        var self = this;

        // Set bind event for last element
        self.configureTreeNavigation();

        // Bind back button
        self.configureBackButton();

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
        var template = self.getTemplate("queries-elements");
        var emptyTemplate = self.getTemplate("queries-empty-elements");
        var queriesContainer = $("#queries", content);
        var queryContent;
        var mergeData;

        $.when(self.dataService.getQueries({
            idElement: idParentQuery
        })).done(function (data) {

            queriesContainer.empty();

            // check if service have nodes
            data = data || {};

            if (data.length >= 1) {
                // Check if have appendElement
                if (appendElement != undefined) {
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
            queryContent.appendTo(queriesContainer);

            // set actions to rendered html 
            self.configureNavTree(queriesContainer);
        });
    },


    configureNavTree: function (queriesContainer) {
        var self = this;
        var confirm = self.getTemplate("queries-query-confirm");

        // Bind for list elements
        $("li", "#queries").click(function () {
            var idCube = $(this).children("#idCube").val();
            var queryId = $(this).children("#queryId").val();
            var prefix = $(this).children("#prefix").val();
            var nodesLength = $(this).children("#nodesLength").val();
            var idStoredQuery = $(this).children("#idStoredQuery").val();
            var id = $(this).children("#id").val();
            var queryDisplayName = $(this).children("#queryDisplayName").val();
            var headerTemplate = self.getTemplate("queries-query-tree");
            var categoryTree = $("#categoryTree");

            // If the node is not a query node then render the children            
            if (queryId == "-1") {
                // Is category
                // Append query header

                $.tmpl(headerTemplate, {
                    idParentQuery: id,
                    queryDisplayName: queryDisplayName
                }).appendTo(categoryTree);

                // Set bind event for last element
                self.configureTreeNavigation();

                // Render sub-categories
                self.renderQueries(id);
            } else if (nodesLength > 0) {
                // Is category with link

                // Add element for tree navigation
                $.tmpl(headerTemplate, {
                    idParentQuery: id,
                    queryDisplayName: queryDisplayName
                }).appendTo(categoryTree);

                // Set bind event for last element
                self.configureTreeNavigation();

                // Append this object to children
                self.renderQueries(id,
					[{
					    "queryDisplayName": queryDisplayName,
					    "idStoredQuery": idStoredQuery,
					    "id": id,
					    "idParent": '',
					    "queryId": queryId,
					    "prefix": prefix,
					    "nodes": [],
					    "idCube": $(this).data("idcube"),
					    "categoryWithLink": "true"
					}]
					);
            } else {
                // Is Process
                bizagi.workportal.desktop.popup.closePopupInstance();
                var title = this.data("queryDisplayName");
                self.showQueryFormPopup({
                    "idQuery": queryId,
                    "idStoredQuery": (idStoredQuery == "-1") ? "" : idStoredQuery,
                    "title": title,
                    "idCube": idCube
                });
            }
        });


        // Bind for action elements (Edit and delete buttons)
        $(".editButton", "#queries").click(function (e) {
            e.stopPropagation();

            var queryId = "-1";
            var idStoredQuery = $(this).parent().find("#idStoredQuery").val();

            self.showQueryFormPopup({
                "queryFormAction": "edit",
                "idQuery": queryId,
                "idStoredQuery": (idStoredQuery == "-1") ? "" : idStoredQuery,
                "title": $("#queryDisplayName", $(this).parent()).val()
            });
            bizagi.workportal.desktop.popup.closePopupInstance();
        });

        $(".deleteButton", "#queries").click(function (e) {
            e.stopPropagation();

            var queryId = "-1";
            var idStoredQuery = $(this).parent().find("#idStoredQuery").val();
            var prefix = $(this).parent().find("#prefix").val();
            var idCube = $(this).parent().find("#idCube").val();
            var content = $.tmpl(confirm);
            var url;

            if (prefix == "prefix_MyStoredQuery") {
                url = self.dataService.getUrl({
                    endPoint: "query-form-delete"
                }) + "?idStoredQueryDel=" + idStoredQuery + "&idQueryForm=" + queryId;
            } else if (prefix == "prefix_Cube") {
                url = self.dataService.getUrl({
                    endPoint: "query-form-delete-cube"
                });
            }

            // Open dialog with confirm message
            $(content).dialog({
                resizable: true,
                modal: true,
                title: self.getResource("workportal-widget-queries-confirm-title"),
                buttons: [
				{
				    text: self.getResource("workportal-widget-queries-confirm-delete"),
				    click: function () {
				        if (prefix == "prefix_MyStoredQuery") {
				            $.ajax({
				                url: url
				            });
				        } else if (prefix == "prefix_Cube") {
				            $.destroy(
				                url,
				                { idCube: idCube }
                            );
				        }

				        $(this).dialog("close");
				        bizagi.workportal.desktop.popup.closePopupInstance();
				    }
				},
				{
				    text: self.getResource("workportal-widget-queries-confirm-cancel"),
				    click: function () {
				        $(this).dialog("close");
				    }
				}
				]
            });
        });
    },

    /**
    *   Binds the back buttons so we can navigate back
    */
    configureBackButton: function () {
        var self = this;
        var content = self.getContent();
        var btnBack = $("#bt-back", content);
        var categoryTree = $("#categoryTree", content);

        // Bind click
        btnBack.click(function () {
            if ($("li", categoryTree).length > 1) {
                // Removes last child                    
                $("li:last-child", categoryTree).remove();
                var idParentQuery = $("li:last-child").children("#idParent").val();

                // Render Querie again
                self.renderQueries(idParentQuery);
            }
        });
    },

    /**
    * Bind tree navigation
    */
    configureTreeNavigation: function () {
        var self = this;
        var content = self.getContent();
        var categoryTree = $("#categoryTree", content);

        // Bind header events
        $("li:last-child", categoryTree).click(function () {
            // Remove all elements
            $(this).nextAll().remove();
            var idParent = $(this).children("#idParent").val();
            // Render query tree again
            self.renderQueries(idParent);
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

        var idQuery = arg.idQuery || "";
        var idStoredQuery = arg.idStoredQuery || "";
        var queryFormAction = arg.queryFormAction || "";
        var title = arg.title || "";
        var idCube = arg.idCube || "";

        // If the same popup is opened close it
        if (self.currentPopup == "queryform") {
            bizagi.workportal.desktop.popup.closePopupInstance();
            return;
        }

        // Shows a popup widget
        self.currentPopup = "queryform";
        self.publish("showDialogWidget", {
            widgetName: bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_QUERYFORM,
            idQueryForm: idQuery,
            idStoredQuery: idStoredQuery,
            queryFormAction: queryFormAction,
            idCube: idCube,
            modalParameters: {
                title: title,
                id: "Queries"
            }
        });
    }
});
