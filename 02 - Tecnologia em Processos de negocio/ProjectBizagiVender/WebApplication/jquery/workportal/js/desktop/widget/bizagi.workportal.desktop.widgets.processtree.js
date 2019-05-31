/**
 * Name: BizAgi Desktop Widget Process Tree
 * 
 * @author Christian Collazos
 */


bizagi.workportal.widgets.processtree.extend("bizagi.workportal.widgets.processtree", {}, {
    init: function (workportalFacade, dataService, params) {
        var self = this;

        // Call base
        self._super(workportalFacade, dataService, params);

        //Load templates
        self.loadTemplates({
            "processTree.links": bizagi.getTemplate("bizagi.workportal.desktop.widgets.processtree").concat("#ui-bizagi-workportal-widget-processTree-links"),
            "processTree.wrapper": bizagi.getTemplate("bizagi.workportal.desktop.widgets.processtree").concat("#ui-bizagi-workportal-widget-processTree-wrapper"),
            "processTree": bizagi.getTemplate("bizagi.workportal.desktop.widgets.processtree").concat("#ui-bizagi-workportal-widget-processTree"),
            "processTree.selected": bizagi.getTemplate("bizagi.workportal.desktop.widgets.processtree").concat("#ui-bizagi-workportal-widget-processTree-selected"),
            useNewEngine: false
        });
    },

    renderContent: function () {
        var self = this;
        var template = self.getTemplate("processTree.links");
        var content;

        content = self.content = $.tmpl(template, {});

        // Override canvas if it has been defined
        if (self.params.canvas) {
            content = $(self.params.canvas).append(content);
        }

        return content;
    },

    postRender: function () {
        var self = this;

        //load templates
        self.loadtemplates();
        //load initial data
        self.setupData();
    },

    /*
    * Load template vars
    */
    loadtemplates: function () {
        var self = this;
        self.applicationTreeWrapperTmpl = self.getTemplate("processTree.wrapper");
        self.applicationTreeTmpl = self.getTemplate("processTree");
        self.applicationTreeSelectedTmpl = self.getTemplate("processTree.selected");
    },

    /*
    * Setup form data
    */
    setupData: function () {
        var self = this;
        self.treeRouteSelected = [];

        $.when(self.setupInitialData()).done(function () {
            self.setupLinks();
        });
    },

    /*
    * Load form data
    */
    setupInitialData: function () {
        var self = this,
            content = self.getContent(),
            def = $.Deferred();

        self.treeRouteSelected = [];

        //append tree to wrapper
        $.when($.tmpl(self.applicationTreeWrapperTmpl, {}), $.tmpl(self.applicationTreeSelectedTmpl, {})).done(function (treeWrapper, processSelected) {
            content.append(treeWrapper);
            content.append(processSelected);
            def.resolve();
        });
        return def.promise();
    },

    /*
    * Implement links behaviour
    */
    setupLinks: function () {
        var self = this,
            content = self.getContent();

        var params = { action: "Applications" };


        $("#allAppsLink", content).click(function (e) {

            $("#allAppsLinkSelected").addClass("biz-wp-tree-selected-option");
            $("#selectAppLinkSelected").removeClass("biz-wp-tree-selected-option");
            $("#selectAppLinkSelected").addClass("biz-wp-tree-not-selected-option");

            $("#applicationsTree").css("display", "none");
            $("#searchInLabel").html(bizagi.localization.getResource("workportal-widget-processTree-all-applications"));
            self.treeRouteSelected = [];
            
        });

        $("#selectAppLink", content).click(function (e) {
            $.when(self.dataService.getApplicationCategoriesList(params)).done(function (applicationList) {

                $("#selectAppLinkSelected").addClass("biz-wp-tree-selected-option");
                $("#allAppsLinkSelected").removeClass("biz-wp-tree-selected-option");
                $("#allAppsLinkSelected").addClass("biz-wp-tree-not-selected-option");

                var appTree = $.tmpl(self.applicationTreeTmpl, { type: applicationList.type, items: applicationList.items });
                $("#applicationsTree", content).html("");
                $("#applicationsTree", content).css("display", "inline-block");
                $("#applicationsTree", content).append(appTree);

                //manage events
                self.setTreeEvents(null, content);

            }).fail(function (error) {
                bizagi.log(error);
            });
        });
    },

    /*
    * manage tree behaviour
    */
    setTreeEvents: function (idApp, content) {
        var self = this;

        //when select a process
        $(".biz-wp-tree-process", content).click(function () {

            var parentType = "";
            var selectedRoute = [];
            var selectedRouteText = "";
            var item = this;
            self.treeRouteSelected = [];
            self.treeRouteSelected.push($(this)[0].getAttribute("data-id"));

            //get the route (app / category / process) selected            
            while (parentType != "app") {
                item = $(item).closest(".biz-wp-tree-list").parent().find("label").first();
                parentType = item[0].getAttribute("data-name");
                selectedRoute.push(item.html());
                self.treeRouteSelected.push(item[0].getAttribute("data-id"));
            }

            for (var i = selectedRoute.length - 1; i >= 0; i--) {
                selectedRouteText += selectedRoute[i] + " > ";
            }

            selectedRouteText += $(this).html();
            
            //resolve deferred to let parent do something when user select any process
            if (self.params.parentDef) {
                self.params.parentDef.resolve();
            }
            $(self.params.canvas).trigger("processSelected", 1);
            
            //update search in label with the selection
            $("#searchInLabel").html(selectedRouteText);
            $("#applicationsTree").css("display", "none");
        });

        //when select a category
        $(".biz-wp-tree-expand-icon", content).click(function (e) {
            var itemSelected = this;
            var idItem = Number(itemSelected.getAttribute("data-id"));
            var idParent = "";

            //when click a category remove the content to append the new content again and avoid repetition of data
            $(itemSelected).closest(".biz-wp-tree-node").find(".biz-wp-tree-list").html("");

            //when tree item is closed and can be expanded
            if ($(itemSelected).hasClass("biz-wp-tree-expand-icon")) {

                $(itemSelected).removeClass("biz-wp-tree-expand-icon");
                $(itemSelected).addClass("biz-wp-tree-collapse-icon");

                if (idApp == null || itemSelected.getAttribute("name") === "app") {
                    idApp = idItem;
                } else {
                    idParent = idItem;
                }

                var params = {
                    action: "getCategories",
                    idApp: idApp,
                    idCategory: idParent,
                    filterStartEvent: false
                };

                $.when(self.dataService.getApplicationCategoriesList(params)
                ).done(function (categoriesList) {
                    //load children and set events to them
                    var appTree = $.tmpl(self.applicationTreeTmpl, { type: categoriesList.type, items: categoriesList.processes });
                    $(itemSelected).closest(".biz-wp-tree-node").find(".biz-wp-tree-list").append(appTree);
                    self.setTreeEvents(idApp, $(itemSelected).closest(".biz-wp-tree-node").find(".biz-wp-tree-list"));

                }).fail(function (error) {
                    bizagi.log(error);
                });
            }
            //when tree item is open and can be closed
            else {
                $(itemSelected).removeClass("biz-wp-tree-collapse-icon");
                $(itemSelected).addClass("biz-wp-tree-expand-icon");
            }
        });
    },

    /*
    * Returns the app, category and process selected
    */
    getTreeRouteSelected: function () {
        var self = this;
        return self.treeRouteSelected;
    }

});