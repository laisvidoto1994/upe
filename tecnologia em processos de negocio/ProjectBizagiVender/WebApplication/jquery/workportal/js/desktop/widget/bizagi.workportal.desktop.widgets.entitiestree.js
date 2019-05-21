/**
 * Name: BizAgi Desktop Widget Entities Tree
 * 
 * @author Christian Collazos
 */


bizagi.workportal.widgets.entitiestree.extend("bizagi.workportal.widgets.entitiestree", {}, {
    init: function (workportalFacade, dataService, params) {
        var self = this;

        // Call base
        self._super(workportalFacade, dataService, params);

        //Load templates
        self.loadTemplates({
            "EntitiesTree.wrapper": bizagi.getTemplate("bizagi.workportal.desktop.widgets.entitiestree").concat("#ui-bizagi-workportal-widget-entitiestree-wrapper"),
            "EntitiesTree.tree": bizagi.getTemplate("bizagi.workportal.desktop.widgets.entitiestree").concat("#ui-bizagi-workportal-widget-entitiestree"),
            useNewEngine: false
        });
    },

    renderContent: function () {
        var self = this;
        var content = "";

        // Override canvas if it has been defined
        if (self.params.canvas) {
            content = self.content = $(self.params.canvas);
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
        self.entitiesTreeTmpl = self.getTemplate("EntitiesTree.tree");
    },

    /*
    * Setup form data
    */
    setupData: function () {
        var self = this;
        self.treeRouteSelected = [];
        self.setupInitialData();
    },

    /*
    * Load form data
    */
    setupInitialData: function () {
        var self = this,
            content = self.getContent();
        var idWfClass=  $("#processTypeList").val();

        var pathNodeType = "";
        var idNode = "";
        var nodeDisplayPath = "";
        var nodePath = "";
        var params = { pathNodeType: pathNodeType, idNode: idNode, nodeDisplayPath: nodeDisplayPath, nodePath: nodePath, idWfClass:idWfClass };

        $.when(self.dataService.entityPathChildNodesAction(params)
            ).done(function (result) {
                var entitiesTree = $.tmpl(self.entitiesTreeTmpl, { items: result.nodes });
                content.append(entitiesTree);
                self.setTreeEvents(content);
            });

    },

    /*
    * manage tree behaviour
    */
    setTreeEvents: function (content) {
        var self = this;

        //when select a process
        $(".selectable", content).click(function () {

            var hasParent = true;
            var item = this;
            self.treeRouteSelected = {};
            self.treeRouteSelected.name = ($(item)[0].getAttribute("data-name-path"));
            self.treeRouteSelected.path = ($(item)[0].getAttribute("data-path"));

            $(".selectable").removeClass("biz-wp-entities-tree-selected");
            $(item).addClass("biz-wp-entities-tree-selected");


            //get the route selected            
            while (hasParent) {
                item = $(item).closest(".biz-wp-tree-list").parent().find("a").first();

                if (item.length == 0) {
                    hasParent = false;
                } else {
                    if (item[0].getAttribute("data-name-path") != "") {
                        self.treeRouteSelected.name = item[0].getAttribute("data-name-path") + "." + self.treeRouteSelected.name;
                    }
                    self.treeRouteSelected.path = item[0].getAttribute("data-path") + self.treeRouteSelected.path;
                }
            }

        });

        //when select a category
        $(".biz-wp-tree-expand-icon", content).click(function (e) {
            var itemSelected = this;
            var idItem = Number(itemSelected.getAttribute("data-id"));

            //when click a category remove the content to append the new content again and avoid repetition of data
            $(itemSelected).closest(".biz-wp-tree-node").find(".biz-wp-tree-list").html("");

            //when tree item is closed and can be expanded
            if ($(itemSelected).hasClass("biz-wp-tree-expand-icon")) {

                $(itemSelected).removeClass("biz-wp-tree-expand-icon");
                $(itemSelected).addClass("biz-wp-tree-collapse-icon");
               
                var nodeType = "";
                var nodeDisplayPath = "";
                var nodePath = "";
                var idWfClass = $("#processTypeList").val();
                var paramsChilds = { nodeType: nodeType, idNode: idItem, nodeDisplayPath: nodeDisplayPath, nodePath: nodePath, idWfClass: idWfClass };

                $.when(self.dataService.entityPathChildNodesAction(paramsChilds)
                ).done(function (result) {
                    var entitiesTree = $.tmpl(self.entitiesTreeTmpl, { items: result.nodes });

                    //load children and set events to them
                    $(itemSelected).closest(".biz-wp-tree-node").find(".biz-wp-tree-list").append(entitiesTree);
                    self.setTreeEvents($(itemSelected).closest(".biz-wp-tree-node").find(".biz-wp-tree-list"));
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