/**
 * Admin module to case massively reassign
 * 
 * @author David Nino, David Romero, Edward J Morales
 */


bizagi.workportal.widgets.admin.cases.extend("bizagi.workportal.widgets.admin.cases", {}, {

    init: function (workportalFacade, dataService, params) {
        var self = this;

        // Call base
        self._super(workportalFacade, dataService, params);

        //Load templates
        self.loadTemplates({
            "admin.cases": bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.cases").concat("#ui-bizagi-workportal-widget-admin-cases"),
            useNewEngine: false
        });
    },

    postRender: function () {
        var self = this;

        //Sets the maximun users to show at the user list form
        self.userTableConf = { pageSize: 10 };

        $.when(self.dataService.getOrganizationInfo("Skill"),
                self.dataService.getOrganizationInfo("Location"),
                self.dataService.getOrganizationInfo("Role")).done(function (skill, location, role) {

                    self.renderSearchCaseForm(role[0], skill[0], location[0]);

                });
    },
    /*
    * Process and display the Search Case form
    * @param user {string}        User field string in the application's current language
    * @param roles {string}      Roles field string in the application's current language 
    * @param locations {string}   Locations field string in the application's current language
    */
    renderSearchCaseForm: function (role, skill, location) {
        var self = this,
                content = self.getContent();

        //Template Vars
        var searchCasesTemplate = self.getTemplate("admin.search.cases");

        // Render Form
        $.tmpl(searchCasesTemplate, {
            skill: skill.profiles.length,
            role: role.profiles.length,
            location: location.profiles.length
       }).appendTo($("#form-search-cases", content));
 
        if (skill.profiles.length){
            self.skillInput = $("#skill-wrapper", content);
            self.skillInput.searchList({ list: skill.profiles, cases:[]});
        }

        if (role.profiles.length){
            self.roleInput = $("#role-wrapper", content);
            self.roleInput.searchList({ list: role.profiles, cases:[]});
        }

        if(location.profiles.length){
            self.locationInput = $("#location-wrapper", content);
            self.locationInput.searchList({ list: location.profiles, cases:[]});
        }        
        
        //Keeps the reference of the seach case form
        self.searchCasesForm = $(".admin-form-search-cases", content);

        self.searchCaseFormEventHandler();
    },
    /*
    * Process and display the Search User form
    * @param totalCases {Number}    Number of cases wich fits with the case seach parameters
    */
    renderSearchUserForm: function (totalCases) {

        var self = this,
                content = self.getContent();

        //Template Vars
        var searchUserTemplate = self.getTemplate("admin.search.users");

        // Render Form
        $.tmpl(searchUserTemplate).appendTo($("#form-search-users", content));

        $("#cases-found-message-wrapper .message", content).text(printf(self.resources.getResource("workportal-widget-admincase-casesfound"), totalCases));

        self.eventHandlerSearchUserForm();
    },
    /*
    * Show/Hide the Seach Case Form
    * @param value {Boolean}    If is true, show the seach case form, otherwise, hide it
    */
    showSearchCaseForm: function (value) {
        var self = this,
            content = self.getContent();

        if (value) {
            $("#form-search-cases", content).show();
            self.searchCasesForm.show();
        }
        else {
            $("#form-search-cases", content).hide();
        }
    },
    /*
    * Show/Hide the Seach User Form
    * @param value {Boolean}    If is true, show the seach user form, otherwise, hide it
    */
    showSearchUsersForm: function (value) {
        var self = this,
                content = self.getContent();

        if (value)
            self.renderSearchUserForm();
        else
            $("#form-search-users", content).html("");
    },
    /*
    * Add the required listeners for the button elements inside the Seach user Form
    */
    eventHandlerSearchUserForm: function () {

        var self = this,
                content = self.getContent();

        //Search user Form
        $("#search-user", content).bind('click', function (e) {
            e.preventDefault();
            var searchForm = $("#admin-form-search-users-wrapper", content);

            self.showConfirmAssignCasesForm(false);

            var params = {};

            params['userName'] = $("#txtSAMAccount", searchForm).val();
            params['fullname'] = $("#txtFullName", searchForm).val();
            params['domain'] = $("#txtDomain", searchForm).val();

            params['skills'] = $("#skill", content).val();
            params['locations'] = $("#location", content).val();
            params['roles'] = $("#role", content).val();


            self.showLoaderAtContainer($("#user-list-wrapper"));

            $.when(self.dataService.searchUsers(params)).done(function (result) {
                self.closeLoader();

                self.updateTotalUsersForm(result);
            });
        });

        $("#back-search-case-form", content).bind('click', function (e) {
            e.preventDefault();

            self.showSearchUsersForm(false);

            self.showSearchCaseForm(true);
        });


        $("#confirm-assign-cases", content).bind('click', function (e) {
            e.preventDefault();

            var searchForm = $("#admin-form-search-users-wrapper", content);
            var params = {};

            //Gets the selected element
            var selectedElement = $('#user-list-wrapper .user-list-item label', searchForm).filter('.ui-radio-state-checked').parent();
            var userList = [];
            var i = selectedElement.length;

            while(i-- > 0)
            {
                userList.push(Number($('input', selectedElement[i]).val()));
            }

            
            //params['user'] = $('input', selectedElement).val();

            params['user'] = userList;

            params['skills'] = self.getCasesSearchParams().skills;
            params['locations'] = self.getCasesSearchParams().locations;
            params['roles'] = self.getCasesSearchParams().roles;

            $.when(self.dataService.reassignCases(params)).done(function (response) {
                self.showConfirmAssignCasesMessage(true);
            }).fail(function (error) {
                //self.notificationController.showErrorMessage(error);
            });
        });

        $("#cancel-assign-cases", content).bind('click', function (e) {
            e.preventDefault();

            self.showConfirmAssignCasesForm(false);
        });

    },
    /*
    * Add the required listeners for the button elements inside the Seach Case Form
    */
    searchCaseFormEventHandler: function () {
        var self = this;
        var content = self.getContent();

        $("li[name=role], li[name=skill], li[name=location]", content).bind('click', function () {
            var span = $(this).find('span.ui-icon');

            (span.attr('data-state') == 'uncheck') ? span.attr('data-state', 'check') : span.attr('data-state', 'uncheck');
        });

        //Events for search case form
        $("#search-case", content).bind('click', function (e) {

            e.preventDefault();
            
            var skillList = (self.skillInput)?  self.skillInput.searchList("option", 'cases'): [];
            var roleList = (self.roleInput)?  self.roleInput.searchList("option", 'cases'): [];
            var locationList = (self.locationInput)?  self.locationInput.searchList("option", 'cases'): [];
            
            var params = { skills: skillList, locations: locationList, roles: roleList };

            self.searchCasesForm.hide();

            self.showLoaderAtContainer(self.searchCasesForm);

            $.when(self.dataService.getCasesByOrganization(params)).done(function (result) {

                //Removes the loader wherever it's located
                self.closeLoader();

                self.updateTotalCasesFound(params, result);
            });
        });
    },
    /*
    *   Add the loader in the desired container
    */
    //showLoaderAtContainer: function (container, nextChild) {
    showLoaderAtContainer: function (nextChild) {
        self.dialogBox = $("<div class='ui-bizagi-component-loading'/>");

        nextChild.after(self.dialogBox);
    },
    /*
    *   Removes the Loader wherever is located
    */
    closeLoader: function () {
        self.dialogBox.remove();
    },
    /*
    *   Stores the Case Search Parameters. It will used when the user confirms the massive case assign
    */
    setCasesSearchParams: function (params) {
        this.caseSearchParams = params;
    },
    /*
    *   Retrieve the Case Search Parameters. It will used when the user confirms the massive case assign
    */
    getCasesSearchParams: function (params) {
        return this.caseSearchParams;
    },
    /*
    * Validate the results of the case search parameters. If the total cases is more than 1, it will shows
    * the Search User Form, otherwise, It will display a message  awaring the user that there is not cases wich
    * fits with the cases seach parameters
    * @param params {Object}    Case seach parameters
    * @param result {Object}    Search case response, wich includes the total cases wich fits with the seach parameters
    */
    updateTotalCasesFound: function (params, result) {
        var self = this,
                content = self.getContent();

        //DOM Variables
        var casesFoundMessageWrapper = $("#no-cases-found-message-wrapper", content);

        //Bind the submited data
        self.setCasesSearchParams(params);

        if (result.totalCases > 0) {
            casesFoundMessageWrapper.hide();

            self.showSearchCaseForm(false);
            self.renderSearchUserForm(result.totalCases);
        }
        else {
            self.showSearchCaseForm(true);
            casesFoundMessageWrapper.show();
        }
    },
    /*
    * Validate the results of the case search parameters. If the total cases is more than 1, it will shows
    * the Search User Form, otherwise, It will display a message  awaring the user that there is not cases wich
    * fits with the cases seach parameters
    * @param result {Object}    Search case response, wich includes the total cases wich fits with the seach parameters
    */
    updateTotalUsersForm: function (result) {
        var self = this,
                content = self.getContent();

        //DOM Variables
        var userFoundMessageWrapper = $("#no-users-found-message-wrapper", content);

        if (result.users.length > 0) {
            userFoundMessageWrapper.hide();

            self.userList = { data: result.users };
            self.createPage(1);
        }
        else {
            userFoundMessageWrapper.show();
        }

    },
    /*
    * Create the page for the users searh result
    * @param pageNumber {Number}    Desired page to display
    */
    createPage: function (pageNumber) {
        var self = this,
                content = self.getContent();

        //DOM Variables
        var tableContent = $("#user-list-wrapper", content);

        //Template vars
        var tableUserTemplate = self.getTemplate("admin.table.users"),
                pagesLength = Math.ceil(self.userList.data.length / self.userTableConf.pageSize),
                pages = new Array(pagesLength);


        var users = [],
                i = self.userTableConf.pageSize * (pageNumber - 1),
                resultLength;

        //Calculates the remaining elements to paint
        if (self.userTableConf.pageSize + i <= self.userList.data.length) {
            resultLength = self.userTableConf.pageSize;
        }
        else {
            resultLength = self.userList.data.length - i;
        }

        $('.user-list-item', tableContent).remove();

        resultLength += i;

        //Hack for jquery tmpl
        for (var x = 0; x < pagesLength; x++) {
            pages[x] = x + 1;
        }

        //Creates an exact copy, and splice it to paint the desired elements
        users = [].concat(self.userList.data)
        users = users.splice(i, resultLength);

        var tableUsers = $.tmpl(tableUserTemplate, {
            users: users,
            pages: pages
        });

        tableContent.html(tableUsers);

        //Binds the elements event
        self.tableUsersHandlers();

        //Update the pager 
        self.updateTableUsersPager(pageNumber);

        $("ul").bizagiPagination({
            maxElemShow: 10,
            totalPages: pagesLength,
            actualPage: pageNumber,
            listElement: $("#user-list-footer-wrapper", content),
            clickCallBack: function (options) {
                self.createPage(options.page);
                self.showConfirmAssignCasesForm(false);
            }
        });
    },
    /*
    * Add the required handlers for the elements inside the user list
    *
    */
    tableUsersHandlers: function () {
        var self = this,
                content = self.getContent();

        //DOM Variables
        var userListWrapper = $('#user-list-wrapper', content);

        $('.user-list-item', userListWrapper).click(function (ev) {

            //Toggle the select class
            $('label', this).toggleClass('ui-radio-state-checked');

            //Checks if there is any element selecteced, to show the confirmation message
            var anyElementSelected =  $('.ui-radio label', userListWrapper).filter('.ui-radio-state-checked').length > 0;

            self.showConfirmAssignCasesForm(anyElementSelected);

            self.showConfirmAssignCasesMessage(!anyElementSelected);

        });


        $('.user-list-item', userListWrapper).hover(
            function () {
                if (!$(this).attr("data-value"))
                    $('label', this).addClass('ui-radio-state-hover');
            },
            function () {
                //if is not the current selected, removes the selected state
                if (!$(this).attr("data-value"))
                    $('label', this).removeClass('ui-radio-state-hover');
            }
        );


        // Add class to each even row
        $('tbody tr', userListWrapper).each(function () {
            if ($(this).index() % 2 < 1)
                $(this).addClass('biz-ui-even');
        });

        //Event for Pages
        /* $('#user-list-footer-wrapper span', userListWrapper).click(function(e) {
        if (!$(this).hasClass('current-page'))
        {
        self.createPage($(this).data('value'));

        self.showConfirmAssignCasesForm(false);
        }
        });*/
    },
    /*
    * Highlight the current page of the user list
    * @param params {Number}    Desired page to display
    */
    updateTableUsersPager: function (pageIndex) {
        var self = this,
                content = self.getContent(),
                userTable = $('#table', content);

        $('#user-list span[data-value=' + pageIndex + ']', userTable).addClass('current-page');
    },
    /*
    * Show/Hide the confirm assign cases form
    * @param value {Boolean}    if is true, display the form, otherwise, hide it
    */
    showConfirmAssignCasesForm: function (value) {
        var self = this, content = self.getContent();

        if (value) {
            $('#assing-cases-confirm-form-wrappper', content).show();
        }
        else {
            $('#assing-cases-confirm-form-wrappper', content).hide();
        }
    },
    /*
    * Show/Hide the confirm assign message, and show/hide the assign cases confirm form
    * @param value {Boolean}    if is true, display the form, otherwise, hide it
    */
    showConfirmAssignCasesMessage: function (value) {
        var self = this,
                content = self.getContent();

        if (value) {
            $('#assing-cases-confirm-form', content).hide();
            $('#assign-cases-message-wrapper', content).show();

        }
        else {
            $('#assing-cases-confirm-form', content).show();
            $('#assign-cases-message-wrapper', content).hide();
        }

        $("#users-found-message-wrapper", content).hide();
    }
});
