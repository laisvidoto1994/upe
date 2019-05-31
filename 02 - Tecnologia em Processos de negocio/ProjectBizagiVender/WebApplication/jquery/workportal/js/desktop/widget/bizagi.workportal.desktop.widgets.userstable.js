/**
* Name: BizAgi Desktop Widget Users Table
* 
* @author Christian Collazos
*/


bizagi.workportal.widgets.userstable.extend("bizagi.workportal.widgets.userstable", {}, {

    init: function (workportalFacade, dataService, params) {
        var self = this;
        self._super(workportalFacade, dataService, params);

        self.filterData = {};
        self.maxRows = 8;
        self.maxPages = 10;
        self.$canvas = params.canvas;
        self.users = [];
        self.totalPages = 0;
        self.currentPage = 1;
        self.orderType = "ASC";
        self.orderField = "";
        self.tableHeaders = [
            { "displayName": self.getResource("workportal-widget-usertable-id"), "fieldValue": "idUser" },
            { "displayName": self.getResource("workportal-widget-usertable-user"), "fieldValue": "fullName" },
            { "displayName": self.getResource("workportal-widget-usertable-name"), "fieldValue": "userName" },
            { "displayName": self.getResource("workportal-widget-usertable-domain"), "fieldValue": "domain" },
            { "displayName": self.getResource("workportal-widget-usertable-email"), "fieldValue": "contactEmail" },
            { "displayName": self.getResource("workportal-widget-usertable-active-assign"), "fieldValue": "enabledForAssignation" },
            { "displayName": self.getResource("workportal-widget-usertable-active"), "fieldValue": "enabled" }
        ];

        self.loadTemplates({
            "usersTable.wrapper": bizagi.getTemplate("bizagi.workportal.desktop.widgets.userstable").concat("#ui-bizagi-workportal-widget-usersTable-wrapper"),
            "usersTable.form": bizagi.getTemplate("bizagi.workportal.desktop.widgets.userstable").concat("#ui-bizagi-workportal-widget-usersTable-form"),
            "usersTable.table": bizagi.getTemplate("bizagi.workportal.desktop.widgets.userstable").concat("#ui-bizagi-workportal-widget-usersTable-table"),
            "usersTable.message": bizagi.getTemplate("bizagi.workportal.desktop.widgets.userstable").concat("#ui-bizagi-workportal-widget-usersTable-message"),
            useNewEngine: false
        });
    },

    renderContent: function () {
        var self = this;
        var template = self.getTemplate("usersTable.wrapper");
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

        //load form data
        self.setupData();
    },

    /*
    * Load template vars
    */
    loadtemplates: function () {
        var self = this;

        self.usersTableFormTmpl = self.getTemplate("usersTable.form");
        self.usersTableTmpl = self.getTemplate("usersTable.table");
        self.usersTableMessage = self.getTemplate("usersTable.message");
    },

    /*
    * Setup form data
    */
    setupData: function () {

        var self = this;

        $.when(self.dataService.getOrganizationsList()).done(function (rps) {

            var orgList = rps.response;

            var resultTemplate = $.tmpl(self.usersTableFormTmpl, { orgList: orgList.length });
            $("#biz-wp-userstable-wrapperform", self.content).html(resultTemplate);

            if (orgList.length) {
                orgList.unshift({ displayName: "----------------", id: "" });
                self.setupOrgCombo(resultTemplate, orgList);
            }

            self.setupEventsHandler();
            self.$canvas.trigger("completeUserForm");

        }).fail(function (error) {
            bizagi.log(error);
        });

    },

    /*
    * Setup organization combo
    */
    setupOrgCombo: function ($content, data) {

        var self = this;
        var $combo = $content.find("#biz-wp-usertable-org");

        $combo.uicombo({
            data: { combo: data },
            initValue: data[0],
            itemValue: function (item) {
                return item.id;
            },
            itemText: function (item) {
                return item.displayName;
            }
        });

    },

    /*
    * Implement main buttons behaviour
    */
    setupEventsHandler: function () {
        var self = this,
            content = self.getContent();
        var $userForm = $("#biz-wp-userstable-wrapperform form", content);

        $userForm.on("submit", function (e) {

            e.preventDefault();

            self.currentPage = 1;
            self.orderType = "ASC";
            self.orderField = "";

            self.filterData = {
                domain: this.elements[0].value,
                userName: this.elements[1].value,
                fullName: this.elements[2].value,
                organization: $(this.elements[3]).data('value'),
                pag: self.currentPage,
                pagSize: self.maxRows,
                orderField: self.orderField,
                orderType: self.orderType
            };

            self.getUsersTableData();

        });

        $userForm.on("reset", function (event) {

            event.preventDefault();

            $(this.elements[3]).data("value", "").val("----------------");
            this.elements[0].value = "";
            this.elements[1].value = "";
            this.elements[2].value = "";

            $("#biz-wp-userstable-wrapperlist", content).empty();
        });

    },

    /*
    * Clean Form
    */
    cleanForm: function () {

        var self = this,
        content = self.getContent();
        var $userForm = $("#biz-wp-userstable-wrapperform form", content);

        $userForm.trigger('reset');
    },

    /*
    * Excecute Query 
    */
    excecuteQuery: function () {

        var self = this;
        content = self.getContent();
        var $userForm = $("#biz-wp-userstable-wrapperform form", content);

        $userForm.trigger('submit');
    },

    /*
    * get users table data
    */
    getUsersTableData: function (params) {
        var self = this;

        var params = params || {};
        self.orderType = params.orderType || self.orderType;
        self.orderField = params.orderField || self.orderField;
        if(self.params.widgetName == "adminCaseSearch" || self.params.widgetName =="reassignCase"){
            $.when(self.dataService.getUsersForAssignation($.extend(self.filterData, params))).done(function (data) {
                self.fillUserInformation(data);

            }).fail(function (error) {
                bizagi.log(error);
            });

        }else{
        $.when(self.dataService.getUsersList($.extend(self.filterData, params))).done(function (data) {
            self.fillUserInformation(data);

        }).fail(function (error) {
            bizagi.log(error);
        });
        }

    },

    /*
    * if users returned show the table
    */
    showUsersTable: function () {

        var self = this;
        var $wrapperList = $("#biz-wp-userstable-wrapperlist", self.content);

        $wrapperList.empty();

        if (self.users.length > 0) {

            var pagination = (self.totalPages > 1) ? true : false;
            var pagesArray = self.getPagesArray();

            var links = self.params.userLinkLabel && Object.prototype.toString.apply(self.params.userLinkLabel) === "[object Array]" ? self.params.userLinkLabel : [self.params.userLinkLabel];

            var usersTableTmpl = $.tmpl(self.usersTableTmpl, { users: self.users, headers: self.tableHeaders, links: links, page: self.currentPage, pagination: pagination, pagesArray: pagesArray, orderField: self.orderField, orderType: self.orderType });
            $wrapperList.html(usersTableTmpl);

            self.setUpPagination();
            self.setUpSortColumnLinks();
        } else {

            var msg = bizagi.localization.getResource("workportal-widget-usertable-empty");
            $wrapperList.html($.tmpl(self.usersTableMessage, { message: msg }));
        }
    },

    /*
    * Get Pages
    */
    getPagesArray: function () {

        var self = this;
        var pagesToShow = (self.maxPages > self.totalPages) ? self.totalPages : self.maxPages;
        var aux = [];

        for (var a = 0; a < pagesToShow; a++) {
            aux.push(a + 1);
        }

        return aux;
    },

    /*
    * Set pagination
    */
    setUpPagination: function () {
        var self = this;
        var $pager = $("#biz-wp-userstable-pager ul", self.content);

        $pager.bizagiPagination({
            maxElemShow: self.maxRows,
            totalPages: self.totalPages,
            actualPage: self.currentPage,
            listElement: $pager,
            clickCallBack: function (options) {
                self.filterData.pag = self.currentPage = parseInt(options.page);
                self.getUsersTableData();
            }
        });

    },

    /*
    * assign click event to each column to order
    */
    setUpSortColumnLinks: function () {
        var self = this;

        $(".biz-wp-table-head th", self.content).click(function () {

            var orderField = $(this).data("orderfield");
            var orderType = $(this).data("ordertype");

            self.getUsersTableData({ "orderType": orderType, "orderField": orderField });
            self.assignEventReassign();
        });

    },

    assignEventReassign: function () {
        var self = this;

        $(".bizagi-wp-userstable-userlink", self.content).click(function (e) {
            if (self.params.parentDef) {
                self.params.parentDef.resolve(this.id, this.name);
                if (self.params.widgetName == "reassignCase" && bizagi.workportal.desktop.dialogStack.length > 0)
                    bizagi.workportal.desktop.dialogStack[bizagi.workportal.desktop.dialogStack.length - 1].dialogBox.on("dialogbeforeclose", function (event, ui) {
                        // Next variable specifies if is redirecting to inbox when the result status does not have errors.
                        if (self.resultStatus === true)
                            self.publish("changeWidget", {
                                widgetName: bizagi.workportal.currentInboxView
                            });
                    });
            } else {
                // publish excecutes twice when create a new instance of userstable
                self.$canvas.trigger("clickUserLink", { id: this.id, name: this.name, type: $(this).data("linkname") });
            }
        });
    },

    /*
    * sort table by a given column
    */
    sortUsersTableByColumn: function (data, column, orderType) {

        return bizagi.util.sortJSON(data, column, orderType);

    },
    fillUserInformation : function(data){
        var self = this;
        self.users = data.users;
        self.totalPages = data.total;

        self.showUsersTable();
        self.assignEventReassign();
    }
});