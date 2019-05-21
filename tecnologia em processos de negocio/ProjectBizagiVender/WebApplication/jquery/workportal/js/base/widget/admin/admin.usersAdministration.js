/*
*   Name: BizAgi Workportal Graphic Query Widget
*   Author: David Romero
*   Comments:
*   -   This script renders the user administration
*/

bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.admin.usersAdministration", {}, {



    init: function (workportalFacade, dataService, params) {

        var self = this;

        //Pagination data
        self.maxRows = 18;
        self.maxPages = 10;
        self.currentPage = 1;
        self.orderType = "ASC";
        self.orderField = "";
        self.totalPages = 0;
        self.userData = {};
        self.allowCreation = true;

        self.userLinks = [
            {
                name: "edition",
                label: bizagi.localization.getResource("bz-rp-components-dimension-edit"),
                icon: "bz-icon-pencil-outline"
            },
            {
                name: "log",
                label: bizagi.localization.getResource("render-actions-log"),
                icon: "bz-icon-log-outline"
            }
        ];

        self._super(workportalFacade, dataService, params);

        //Load templates
        self.loadTemplates({
            "admin.users": bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.usersAdministration").concat("#ui-bizagi-workportal-widget-admin-users"),
            "admin.users.formbuttons": bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.usersAdministration").concat("#ui-bizagi-workportal-widget-admin-users-formbuttons"),
            "admin.users.log": bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.usersAdministration").concat("#ui-bizagi-workportal-widget-admin-users-log"),
            "admin.users.licenses": bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.usersAdministration").concat("#ui-bizagi-workportal-widget-admin-users-licenses"),
            "admin.users.email": bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.usersAdministration").concat("#ui-bizagi-workportal-widget-admin-users-email"),
            "admin.search.cases": bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.cases").concat("#ui-bizagi-workportal-widget-admin-search-cases"),
            "admin.search.users": bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.cases").concat("#ui-bizagi-workportal-widget-admin-search-users"),
            "admin.table.users": bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.cases").concat("#ui-bizagi-workportal-widget-admin-table-users"),
            useNewEngine: false
        });
    },

    /*
    *   Returns the widget name
    */
    getWidgetName: function () {
        return bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_ADMIN_USERS_ADMINISTRATION;
    },

    /*
    *   Renders the content for the current controller
    *   Returns a deferred because it has to load the current user
    */
    renderContent: function () {

        var self = this;
        var tmpl = self.getTemplate("admin.users");
        var content = self.content = $.tmpl(tmpl);

        return content;
    }
});
