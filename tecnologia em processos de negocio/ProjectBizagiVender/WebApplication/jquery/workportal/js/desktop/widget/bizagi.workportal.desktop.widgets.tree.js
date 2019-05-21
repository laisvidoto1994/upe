/**
* Name: BizAgi Desktop Widget - Tree
* 
* @author Christian Collazos
*/


bizagi.workportal.widgets.tree.extend("bizagi.workportal.widgets.tree", {}, {
    
    init: function (workportalFacade, dataService, params) {
        var self = this;

        // Call base
        self._super(workportalFacade, dataService, params);

        //Load templates
        self.loadTemplates({
            "tree.wrapper": bizagi.getTemplate("bizagi.workportal.desktop.widgets.tree").concat("#ui-bizagi-workportal-widget-tree-wrapper"),
            "tree.content": bizagi.getTemplate("bizagi.workportal.desktop.widgets.tree").concat("#ui-bizagi-workportal-widget-tree-content"),
            useNewEngine: false
        });
    },

    renderContent: function () {
        var self = this;
        var template = self.getTemplate("tree.wrapper");
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
    },

    loadtemplates: function () {
        var self = this;

        //Template vars 
        self.decisionTableContent = self.getTemplate("tree.content");
    }
});