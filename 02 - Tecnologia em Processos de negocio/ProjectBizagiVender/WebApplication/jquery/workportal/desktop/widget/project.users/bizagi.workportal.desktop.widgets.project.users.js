/*
 *   Name: Bizagi Workportal Desktop Project Users Controller
 *   Author: Elkin Fernando Siabato Cruz
 */

bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.project.users", {}, {
    /*
     *   Constructor
     */
    init: function (workportalFacade, dataService, relatedusers, params) {
        var self = this;
        self.relatedusers = relatedusers;

        // Call base
        self._super(workportalFacade, dataService, params);

        self.contextsSidebarActivity = params.contextsSidebarActivity;

        self.plugins = {};
        self.users = [];

        //Load templates
        self.loadTemplates({
            "project-users": bizagi.getTemplate("bizagi.workportal.desktop.widget.project.users").concat("#project-users-main")
        });
    },

    /*
     * Renders the template defined in the widget
     */
    renderContent: function () {
        var self = this;
        self.content = $("<div></div>");
        return self.content;
    },

    /*
     * links events with handlers
     */
    postRender: function () {
        var self = this;

        //Handlers
        self.contextsSidebarActivity.forEach(function(context){
            self.sub(context, $.proxy(self.updateView, self));
        });
    },

    updateView: function (event, params) {
        var self = this,
            args = params.args,
            $content = self.getContent().empty();

        var contentTemplate = self.getTemplate("project-users");
        contentTemplate.render().appendTo($content);

        var typesAssignUser = [{
            id: args.createdBy.userId,
            typeName: "owner"
        }];
        self.relatedusers.render(self.content, ".relatedusers-wrapper", args.idCase, typesAssignUser);
    },

    clean: function () {
        var self = this;
        self.contextsSidebarActivity.forEach(function(context){
            self.unsub(context, $.proxy(self.updateView, self));
        });
    }
});

bizagi.injector.register("bizagi.workportal.widgets.project.users", ["workportalFacade", "dataService", "relatedusers", bizagi.workportal.widgets.project.users]);