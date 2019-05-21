/**
 * Admin module to case massively reassign
 * 
 * @author David Nino, David Romero, Edward J Morales
 */


bizagi.workportal.widgets.activity.log.extend("bizagi.workportal.widgets.activity.log", {}, {
    init: function (workportalFacade, dataService, params) {
        var self = this;

        self.totalPages = 0;
        self.maxRows = 10;
        self.maxPages = 10;
        self.currentPage = 1;

        // Call base
        self._super(workportalFacade, dataService, params);

        //Load templates
        self.loadTemplates({
            "activity.log": bizagi.getTemplate("bizagi.workportal.desktop.widgets.activity.log").concat("#ui-bizagi-workportal-widget-activity-log"),
            "activity.log.general.content": bizagi.getTemplate("bizagi.workportal.desktop.widgets.activity.log").concat("#ui-bizagi-workportal-widget-activity-log-general-content"),
            "activity.log.header": bizagi.getTemplate("bizagi.workportal.desktop.widgets.activity.log").concat("#ui-bizagi-workportal-widget-activity-log-header"),
            "activity.log.detail.header": bizagi.getTemplate("bizagi.workportal.desktop.widgets.activity.log").concat("#ui-bizagi-workportal-widget-activity-log-detail-header"),
            "activity.log.detail.content": bizagi.getTemplate("bizagi.workportal.desktop.widgets.activity.log").concat("#ui-bizagi-workportal-widget-activity-log-detail-content"),
            useNewEngine: false
        });
    },
    postRender: function () {
        var self = this;

        //Template vars
        self.generalContentTmpl = self.getTemplate("activity.log.general.content");
        self.generalHeaderContentTmpl = self.getTemplate("activity.log.header");

        self.detailHeaderTmpl = self.getTemplate("activity.log.detail.header");
        self.detailContentTmpl = self.getTemplate("activity.log.detail.content");

        //Set the keys for each type of log, the service for the general table, and detail table
        self.logCategories = {
            ACTIVITIES: { id: "ActivityLog", serviceMethod: "getActivityLog", detailServiceMethod: "getActivityDetailLog", selectedDetailId: 0 },
            ENTITIES: { id: "EntityLog", serviceMethod: "getEntityLog", detailServiceMethod: "getEntityDetailLog", selectedDetailId: 0 },
            USERS: { id: "UserLog", serviceMethod: "getUserLog", detailServiceMethod: "getUserDetailLog", selectedDetailId: 0 },
            ADMINISTRATION: { id: "AdminLog", serviceMethod: "getAdminLog" }
        };

        //Sets the containers id
        self.containtersID = {
            GENERAL: "general",
            DETAIL: "detail"
        };

        //Creates an instance of render Services
        var proxyPrefix = (typeof (self.dataService.serviceLocator.proxyPrefix) != undefined) ? self.dataService.serviceLocator.proxyPrefix : "";
        var renderServices = new bizagi.render.services.service({ "proxyPrefix": proxyPrefix });

        //Gets the case number using the caseId
        renderServices.getCaseNumber({
            idCase: self.idCase
        }).done(function (response) {
            var caseNumber = response.caseNumber;
            self.caseNumber = caseNumber ? caseNumber : self.idCase;

            self.initWidget();
        });

    },

    /*
    *   Init the widgets building each separated element
    */
    initWidget: function () {

        var self = this;

        //Hides the "no results" message container
        self.displayNoResults(false);

        //set up the header
        self.setupHeader();
    },

    /*
    *   Setup the header using the results from the service supported log types
    */
    setupHeader: function () {
        var self = this;
        content = self.getContent();

        var headerWrapper = $("#activity-log-data-header-wrapper", content);

        $.when(self.dataService.supportedLogTypes()).done(function (supportedLogTypesData) {

            //update the log types with the supported ones
            $.tmpl(self.generalHeaderContentTmpl, { supportedLogTypes: supportedLogTypesData.Supported }).appendTo(headerWrapper);

            //Find the first supported log type
            var available = self.getFirstAvailableLogTypes(supportedLogTypesData.Supported);

            //Reset  current page
            self.currentPage = 1;

            //Sends the object with the available log type
            self.getActivityLogByCategory(self.logCategories[available]);

            //Add the click events from the elements in the header
            self.bindHeaderElementInteraction($("#LnkActivities", self.content), self.logCategories.ACTIVITIES);
            self.bindHeaderElementInteraction($("#LnkEntities", self.content), self.logCategories.ENTITIES);
            self.bindHeaderElementInteraction($("#LnkUsers", self.content), self.logCategories.USERS);
            self.bindHeaderElementInteraction($("#LnkAdmin", self.content), self.logCategories.ADMINISTRATION);
        }).fail(function (error) { });
    },

    /*
    * Uses the supported log types data, finds the first element wich is available
    */
    getFirstAvailableLogTypes: function (supportedLogTypesData) {
        var self = this;
        for (var att in self.logCategories) {
            for (var x in supportedLogTypesData) {
                if (self.logCategories[att].id == x && (supportedLogTypesData[x] == "true" || supportedLogTypesData[x] == true)) {
                    return att;
                }
            }
        }

        return "";
    },

    /*
    *   Bind the element interaction with the category which it belongs
    *   @param element (Object) DOM element which is going to be added the click event
    *   @param categoryObj (Object) Log Categories object which have the required elements to call the services and create the template
    */
    bindHeaderElementInteraction: function (element, categoryObj) {
        var self = this;

        element.click(function () {
            if (!$(this).hasClass('active')) {

                $(".active", self.content).removeClass('active');

                $(this).addClass('active');

                self.currentPage = 1;
                self.getActivityLogByCategory(categoryObj);
            }
        });
    },

    /*
    *   Using the categoryOjb, get the service method and call the service to retrieve the log
    *   @param categoryObj (Object) Log Categories object which have the required elements to call the services and create the template
    */
    getActivityLogByCategory: function (categoryObj) {
        var self = this;

        var params = {};

        self.selectedCategoryObj = ($.isEmptyObject(categoryObj)) ? self.selectedCategoryObj : $.extend({}, categoryObj);

        params = { idCase: self.idCase, idActualPage: self.currentPage, pageSize: self.maxRows };

        var generalWrapper = $("#activity-log-data-general-wrapper", content);
        generalWrapper.addClass("ui-bizagi-component-loading");

        $.when(self.dataService[self.selectedCategoryObj.serviceMethod](params)).done(function (result) {
            self.totalPages = result.total;
            self.generalActivityDataValidator(result);
        }).fail(function (error) {
            bizagi.showErrorAlertDialog = false;
            bizagi.showMessageBox(JSON.parse(error.responseText).message, "Bizagi", "Error");
        });
    },

    /*
    *   Validate the info gathered from the log service, and pre-render to show it in the required way
    *   @param data (Object) Result from the log service
    */
    generalActivityDataValidator: function (data) {
        var self = this,
            content = self.getContent();

        var generalWrapper = $("#activity-log-data-general-wrapper", content);

        if (data.rows) {

            if (self.selectedCategoryObj.id == self.logCategories.ADMINISTRATION.id) {

                var i = data.rows.length, result;

                while (i-- > 0) {
                    if (data.rows[i][3].indexOf("-->") !== -1) {
                        result = [].concat(data.rows[i][3].split("-->")[0].split(":").concat(data.rows[i][3].split("-->")[1].split(": :")));
                    } else {
                        result = [].concat(data.rows[i][3].split("-->")[0].split(":"));
                    }

                    data.rows[i][3] = [].concat(result);
                }
            }

            //Stores the current data
            self.currentLogData = [].concat(data.rows);
        } else {
            self.currentLogData = [];
        }

        self.renderContentByCategory();
    },

    /*
    *   Render the content from the selected log category
    */
    renderContentByCategory: function () {
        var self = this,
            content = self.getContent();

        var generalWrapper = $("#activity-log-data-general-wrapper", content);

        var detailWrapper = $("#activity-log-data-detail-wrapper", content);


        //Removes the loading class
        generalWrapper.removeClass("ui-bizagi-component-loading");

        //Clean the content
        generalWrapper.empty();

        self.switchContent(self.containtersID.GENERAL);

        //Get data for pagination
        var pagData = self.getPaginationData();

        // Render Form
        $.tmpl(self.generalContentTmpl, { logCategory: self.selectedCategoryObj.id, idCase: self.caseNumber, logItems: self.currentLogData, pagData: pagData }).appendTo(generalWrapper);

        self.setUpPagination($("#biz-wp-activitylog-category-pager ul", self.content), "getActivityLogByCategory");

        //Show/hide the no-result message
        if (self.currentLogData.length > 0) {
            self.displayNoResults(false);
            $(".activity-log-table", generalWrapper).show();
        }
        else {
            self.displayNoResults(true);
            $(".activity-log-table", generalWrapper).hide();
        }

        //Add Interactions
        $(".detail-item", generalWrapper).click(function (e) {
            e.preventDefault();

            //Stores the Log  Item Index
            self.selectedLogItemIndex = $($(e.currentTarget).closest("tr")[0]).index() - 1;

            //reset current page
            self.currentPage = 1;

            self.preprocessDetailRender($(this));
        });

        $(".listHeaderLinks", generalWrapper).click(function (e) {
            e.preventDefault();
        });
    },

    /*
    * Get Pagination Data
    */
    getPaginationData: function () {

        var self = this;
        var pagination = (self.totalPages > 1) ? true : false;

        var pagData = {
            page: self.currentPage,
            pagesArray: [],
            pagination: pagination
        };

        var pagesToShow = (self.maxPages > self.totalPages) ? self.totalPages : self.maxPages;

        for (var a = 0; a < pagesToShow; a++) {
            pagData.pagesArray.push(a + 1);
        }

        return pagData;
    },

    /*
    * SetUp Pagination
    */
    setUpPagination: function ($pager, method) {

        var self = this;

        $pager.bizagiPagination({
            maxElemShow: self.maxRows,
            totalPages: self.totalPages,
            actualPage: self.currentPage,
            listElement: $pager,
            clickCallBack: function (options) {
                self.currentPage = parseInt(options.page);
                self[method]({}, $pager);
            }
        });
    },

    /*
    *   Render the content from the selected log item
    */
    preprocessDetailRender: function (selectedElement) {

        var self = this,
            content = self.getContent();

        var params = self.getDetailRenderParams(selectedElement);

        //Checks if the selected category have the detail service, and invokes it
        if (self.selectedCategoryObj.detailServiceMethod) {
            $.when(self.dataService[self.selectedCategoryObj.detailServiceMethod](params)).done(function (result) {

                self.totalPages = result.total;

                self.switchContent(self.containtersID.DETAIL);

                //Current Log Data
                if (result.rows) {
                    self.currentDetailLogData = [].concat(result.rows);
                }
                else {
                    self.currentDetailLogData = [];
                }

                self.renderLogDetail(result);

            }).fail(function (error) { });
        }
    },
    
    /*
    * Get Detail Render Params
    */
    getDetailRenderParams: function (selectedElement) {

        var self = this;
        var params, selectedDetailId;

        switch (self.selectedCategoryObj.id) {
            case self.logCategories.ACTIVITIES.id:

                if ($.isEmptyObject(selectedElement)) {
                    selectedDetailId = self.logCategories.ACTIVITIES.selectedDetailId;
                } else {
                    self.logCategories.ACTIVITIES.selectedDetailId = selectedDetailId = selectedElement.attr('data-id');
                }

                params = { idCase: self.idCase, idWorkItemFrom: selectedDetailId };

                break;

            case self.logCategories.ENTITIES.id:

                if ($.isEmptyObject(selectedElement)) {
                    selectedDetailId = self.logCategories.ENTITIES.selectedDetailId;
                } else {
                    self.logCategories.ENTITIES.selectedDetailId = selectedDetailId = selectedElement.attr('data-id');
                }

                params = { idCase: self.idCase, idEntity: selectedDetailId };

                break;

            case self.logCategories.USERS.id:

                if ($.isEmptyObject(selectedElement)) {
                    selectedDetailId = self.logCategories.USERS.selectedDetailId;
                } else {
                    self.logCategories.USERS.selectedDetailId = selectedDetailId = selectedElement.attr('data-id');
                }

                params = { idCase: self.idCase, idUser: selectedDetailId };

                break;
        }

        $.extend(params, { idActualPage: self.currentPage, pageSize: self.maxRows });

        return params;
    },

    /*
    *   Render the detail from the selected log item
    */
    renderLogDetail: function (selectedElementData) {
        var self = this,
            content = self.getContent();

        //Template Vars
        var detailWrapper = $("#activity-log-data-detail-wrapper", content);

        //empty previous content
        detailWrapper.empty();

        //removes the loading class
        detailWrapper.removeClass("ui-bizagi-component-loading");

        //render the detail content, including headers and table
        $.when(self.renderDetailContent()).done(function () {
            var logFilterWrapper = $("#log-filter-wrapper", content);

            //Show/hide the no-result message
            self.showDetailResultMessage();

            //Add the interaction handlers
            $("#back-general-content", detailWrapper).click(function (e) {
                e.preventDefault();
                self.displayNoResults(false);
                self.switchContent(self.containtersID.GENERAL);
            });

            $("#apply-filter", logFilterWrapper).click(function (e) {
                e.preventDefault();

                self.currentPage = 1;
                self.applyDetailFilter();
            });

            $("#remove-filter", logFilterWrapper).click(function (e) {
                e.preventDefault();

                //Clean the filter inputs
                $("input", logFilterWrapper).val("");

                self.currentPage = 1;
                self.applyDetailFilter();
            });

            $(".listHeaderLinks", detailWrapper).click(function (e) {
                e.preventDefault();
            });
        });
    },

    /*
    * Show detail result message 
    */
    showDetailResultMessage: function () {

        var self = this;
        var $detailWrapper = $("#activity-log-data-detail-wrapper", self.getContent());

        if (self.currentDetailLogData.length > 0) {
            self.displayNoResults(false);
            $(".activity-log-table", $detailWrapper).show();
        }
        else {
            self.displayNoResults(true);
            $(".activity-log-table", $detailWrapper).hide();
        }
    },

    /*
    * Apply detail filter
    */
    applyDetailFilter: function () {

        var self = this;
        var params = self.getFilterParams(), content = self.getContent();

        //Checks if the selected category have the detail service, and invokes it
        if (self.selectedCategoryObj.detailServiceMethod) {
            $.when(self.dataService[self.selectedCategoryObj.detailServiceMethod](params)).done(function (result) {

                self.totalPages = result.total;

                //Current Log Data
                if (result.rows) {
                    self.currentDetailLogData = [].concat(result.rows);
                } else {
                    self.currentDetailLogData = [];
                }

                //Get data for pagination
                var pagData = self.getPaginationData();
                var renderedTmpl = $.tmpl(self.detailContentTmpl, { logCategory: self.selectedCategoryObj.id, title: self.selectedCategoryObj.title, detailItems: self.currentDetailLogData, pagData: pagData });

                //Remove table
                $("#bz-workportal-activitylog-detailcontent-wrapper", content).remove();
                $(renderedTmpl).insertAfter("#activity-log-data-detail-header-wrapper", content);

                //Show/hide the no-result message
                self.showDetailResultMessage();

                //Set up pagination
                self.setUpPagination($("#biz-wp-activitylog-detail-pager ul", content), "applyDetailFilter");
            });
        }

    },

    /*
    * Get params for the filter
    */
    getFilterParams: function () {

        var self = this,
            content = self.getContent(),
            $logFilterWrapper = $("#log-filter-wrapper", content),
            params = self.getDetailRenderParams(),
            userFullName, attribDisplayName, entDisplayName;

        if (self.selectedCategoryObj.id == self.logCategories.ENTITIES.id) {
            userFullName = $("#filterUser", $logFilterWrapper).val().toLowerCase();
        } else if (self.selectedCategoryObj.id == self.logCategories.USERS.id) {
            entDisplayName = $("#filterEntity", $logFilterWrapper).val().toLowerCase();
        }

        attribDisplayName = $("#filterAttribute", $logFilterWrapper).val().toLowerCase();

        $.extend(params, { userFullName: userFullName, attribDisplayName: attribDisplayName, entDisplayName: entDisplayName });

        return params;
    },

    /*
    *   Renders the detail info from the selected log item
    *   return (Object) returns the promise after processing and attaching to the DOM the detail from the selected log item
    */
    renderDetailContent: function () {
        var self = this,
            content = self.getContent(),
            def = $.Deferred();

        //DOM Vars
        var detailWrapper = $("#activity-log-data-detail-wrapper", content);

        //Get data for pagination
        var pagData = self.getPaginationData();

        //append tree to wrapper
        $.when($.tmpl(self.detailHeaderTmpl, { logCategory: self.selectedCategoryObj.id, idCase: self.caseNumber, data: self.currentLogData[self.selectedLogItemIndex] }),
                $.tmpl(self.detailContentTmpl, { logCategory: self.selectedCategoryObj.id, title: self.selectedCategoryObj.title, detailItems: self.currentDetailLogData, pagData: pagData })
                 ).done(function (detailHeaderResult, detailContentResult) {

                     detailWrapper.append(detailHeaderResult);
                     (detailContentResult).insertAfter("#activity-log-data-detail-header-wrapper", detailWrapper);

                     //set up pagination
                     self.setUpPagination($("#biz-wp-activitylog-detail-pager ul", self.content), "preprocessDetailRender");

                     def.resolve();
                 });

        return def.promise();
    },

    /*
    *   Switch the view from general view, and detail
    *   @param (string) contentToDisplay : Specifies wich element want to display, the DETAIL view or GENERAL
    */
    switchContent: function (contentToDisplay) {
        var self = this,
            content = self.getContent();

        var generalWrapper = $("#activity-log-data-general-wrapper", content),
            detailWrapper = $("#activity-log-data-detail-wrapper", content);


        if (self.containtersID.DETAIL == contentToDisplay) {
            generalWrapper.hide();

            detailWrapper.show();
        } else {
            generalWrapper.show();

            detailWrapper.hide();
        }
    },

    /*
    * Display the "no result" message
    */
    displayNoResults: function (value) {
        var self = this,
            content = self.getContent();

        if (value)
            $("#activity-log-no-results", content).show();
        else
            $("#activity-log-no-results", content).hide();
    }
});

bizagi.injector.register('bizagi.workportal.widgets.activity.log', ['workportalFacade', 'dataService', bizagi.workportal.widgets.activity.log], true);