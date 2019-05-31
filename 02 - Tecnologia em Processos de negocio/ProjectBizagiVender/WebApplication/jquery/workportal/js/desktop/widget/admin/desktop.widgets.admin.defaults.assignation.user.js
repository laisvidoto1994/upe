/**
*  Name: BizAgi Desktop Widget Defaults Assignation User
* 
* @author Liliana Fernandez
*/


bizagi.workportal.widgets.admin.defaults.assignation.user.extend("bizagi.workportal.widgets.admin.defaults.assignation.user", {}, {

    init: function (workportalFacade, dataService, params) {
        var self = this;

        // Call base
        self._super(workportalFacade, dataService, params);

        //Load templates
        self.loadTemplates({
            "defaults.assignation.user": bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.defaults.assignation.user").concat("#ui-bizagi-workportal-widget-admin-defaults-assignation-user"),
            "defaults.assignation.user.fields": bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.defaults.assignation.user").concat("#ui-bizagi-workportal-widget-admin-defaults-assignation-user-fields"),
            "defaults.assignation.user.search": bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.defaults.assignation.user").concat("#ui-bizagi-workportal-widget-admin-defaults-assignation-user-search"),
            useNewEngine: false
        });
    },

    loadtemplates: function () {
        var self = this;
        //Template vars 
        self.generalContent = self.getTemplate("defaults.assignation.user");
        self.fieldsContent = self.getTemplate("defaults.assignation.user.fields");
        self.searchContent = self.getTemplate("defaults.assignation.user.search");
    },

    postRender: function () {
        var self = this;
        self.maxElemShow = 10;
        self.maxPageToShow = 5;

        //load form data
        self.processNavigation = [];
        self.setupData();
    },

    /*
    * Setup form data
    */
    setupData: function () {
        var self = this;

        self.setupInitialData();
        self.setupProcessTree();
    },

    /*
    * Load form data
    */
    setupInitialData: function () {
        var self = this,
            content = self.getContent();

        self.processTree = "";

        //append fields to wrapper
        var fields = $.tmpl(self.fieldsContent, {});
        $("#defaults-assignation-user-home", content).append(fields);
        self.setupSearchusersButton();
    },

    /*
    * initialize the process tree widget
    */
    setupProcessTree: function () {
        var self = this;
        var content = self.getContent();

        bizagi.treeRoutSelected = [];
        $("#treeLinksId").remove(); 

        $("#processTree",content).bind("processSelected", function () {
            self.setupAssignationToProcess();
        });

        self.processTree = new bizagi.workportal.widgets.processtree(self.workportalFacade, self.dataService, $.extend(self.params, {
            canvas: $("#processTree", content)
        }));

        self.processTree.render();
    },

    /*
    * Call service 
    */
    setupAssignationToProcess: function () {
        var self = this;
        content = self.getContent();
        var params = {};

        var selectedProcessRoute = self.processTree.getTreeRouteSelected();
        if (selectedProcessRoute.length > 0) {
            params.idWfClass = selectedProcessRoute[0];    
        }
           $.when(self.dataService.getDefaultAssignationUserToProcess(params))
            .done(function (result) {
            $("#txtTextUserAssignation", content).val(result.user);
            });
    },

    /*
    * initialize the users search form widget
    */
    setupUsersSearchForm: function () {
        var self = this;
        var content = self.getContent();
        var def = $.Deferred();
        $("#defaults-assignation-user-home").hide();


        self.usersTable = new bizagi.workportal.widgets.userstable(self.workportalFacade, self.dataService, $.extend(self.params, {
            canvas: $("#dinamicContent", content),
            userLinkLabel: [bizagi.localization.getResource("workportal-widget-admin-defaults-assignation-select-link")],
            parentDef: def
        }));

        self.usersTable.render();

        $.when(def).done(function (userId, userName) {
            $("#dinamicContent", content).html("");
            $("#defaults-assignation-user-home", content).show();
            $("#txtTextUserAssignation", content).val(userName);
            self.selectedUserId = userId;
        });
    },

    saveAssignation: function () {
        var self = this;
        var content = self.getContent();
        var selectedProcessRoute = self.processTree.getTreeRouteSelected();

        var params = {
            idWfClass: (selectedProcessRoute.length > 0) ? selectedProcessRoute[0] : -1,
            idUser: ($("#txtTextUserAssignation", content).val() != "") ? self.selectedUserId : -1
        };

        if (params.idWfClass == -1) {
            bizagi.showMessageBox(bizagi.localization.getResource("workportal-widget-admin-defaults-assignation-assign-fail-select-process"), "Bizagi", "warning");
        }
        else if (params.idUser == -1){
            bizagi.showMessageBox(bizagi.localization.getResource("workportal-widget-admin-defaults-assignation-assign-fail-select-user"), "Bizagi", "warning");
        }
        else {
            $.when(self.dataService.setDefaultAssignationUserToProcess(params))
                .done(function (response) {
                    if (response.assigned === "true" || response.assigned === true) {
                        bizagi.showMessageBox(bizagi.localization.getResource("workportal-widget-admin-defaults-assignation-assign-ok"), "Bizagi", "warning");
                        $("#txtTextUserAssignation", content).val("");
                        self.setupProcessTree();
                    }
                    else{
                        bizagi.showMessageBox(bizagi.localization.getResource("workportal-widget-admin-defaults-assignation-assign-fail"), "Bizagi", "warning");
                    }
                })
                .fail(function (error) {
                    bizagi.showMessageBox(bizagi.localization.getResource("workportal-widget-admin-defaults-assignation-assign-fail"), "Bizagi", "warning");
                    $("#txtTextUserAssignation", content).val("");
                    self.setupProcessTree();
                    bizagi.log(error);
                });
        }
    },

    /****************** EVENTOS ***********************/


    setupSearchusersButton: function () {
        var self = this,
            content = self.getContent();

        $("#btn-searchUser", content).click(function () {
            self.setupUsersSearchForm();
        });

        $("#btn-clearUser", content).click(function () {
            $("#txtTextUserAssignation", content).val("");
        });

        $("#btn-saveUser", content).click(function () {
            self.saveAssignation();
        });
    }
});

 
