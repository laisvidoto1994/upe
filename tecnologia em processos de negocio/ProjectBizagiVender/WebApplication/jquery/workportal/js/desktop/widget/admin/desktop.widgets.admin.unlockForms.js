/**
 * Name: BizAgi Desktop Widget Administration unlokForms
 *
 * @author Cristian Olaya
 */

bizagi.workportal.widgets.admin.unlockForms.extend("bizagi.workportal.widgets.admin.unlockForms", {}, {
    init: function (workportalFacade, dataService, params) {
        // Call base
        this._super(workportalFacade, dataService, params);

        var self = this;
        self.selectedFormAdmin = [];

        self.columnsID = {
            "formName": "I_formName",
            "userName": "I_userName",
            "userfullName": "I_userfullName"
        };
    },

    loadtemplates: function () {
        var self = this;

        //Template vars
        self.generalContentTmpl = self.workportalFacade.getTemplate("admin.unlock.forms");
        self.buttonContentTmpl = self.workportalFacade.getTemplate("admin.unlock.forms.button");
        self.resultContentTmpl = self.workportalFacade.getTemplate("admin.unlock.forms.result");
        self.paginationTmpl = self.workportalFacade.getTemplate("admin.unlock.forms.pagination");
    },

    postRender: function () {
        var self = this;

        self.defaultMaxRows = 10;
        self.maxElemShow = self.defaultMaxRows;
        self.maxPageToShow = 5;

        //load form data
        self.setupData();
    },

    /*
     * Setup form data
     */
    setupData: function () {
        var self = this;

        self.setupInitialData();
        self.setupMainButtons();
    },

    /*
     * Load form data
     */
    setupInitialData: function () {
        var self = this,
            content = self.getContent(),
            fields;

        //append fields to wrapper*/
        fields = $.tmpl(self.resultContentTmpl, {});
        content.append(fields);

        var numberResults =  parseInt($("#resultsNumber").val(),0);
        self.maxElemShow = (bizagi.util.isNumeric(numberResults)) ? numberResults: self.defaultMaxRows;

        var params = {
            h_action: "getLockForms",
            I_ProcessState: "Running",
            I_Users: "ALL",
            orderType: 1,
            order: "",
            orderField: "",
            I_USERNAME: $("#userNameInput").val(),
            I_USERFULLNAME: $("#userFullNameInput").val(),
            I_FORMNAME: $("#formName").val(),
            PageSize: self.maxElemShow
        };

        self.searchParams = params;
        self.findResults(content, params);
    },

    /*
     * Finding all forms
     */
    findResults: function (content, params, pageToShow) {
        var self = this;

        self.content = content;
        self.params = params;
        self.pageToShow = pageToShow;

        //If there is not a page to Show, begins whith the fist one
        params.Page = pageToShow ? pageToShow : 1;

        $.when(
            self.dataService.getAdminLockedFormsList(self.params)
        ).done(function (resultList) {

                self.renderListForms(resultList, self.content, self. params, self.pageToShow);

            }).fail(function (error) {
                bizagi.log(error);
            });
    },

    /*
     * updating and getting all forms
     */
    updateResults: function (content, params, pageToShow) {
        var self = this;

        self.content = content;
        self.params = params;
        self.pageToShow = pageToShow;

        //If there is not a page to Show, begins whith the fist one
        params.Page = pageToShow ? pageToShow : 1;

        $.when(
            self.dataService.updateAdminLockedFormsList(self.params)
        ).done(function (resp) {
                if(resp.result==="OK"){

                    $.when(
                        self.dataService.getAdminLockedFormsList(self.params)
                    ).done(function (resultList) {

                            self.renderListForms(resultList, self.content, self. params, self.pageToShow);

                        }).fail(function (error) {
                            bizagi.log(error);
                        });
                }
            }).fail(function (error) {
                bizagi.log(error);
            });
    },

    /*
     * Render Result forms
     */
    renderListForms:function(resultList, content, params, pageToShow){
        var self = this;

        //clean old results
        $("#generalTitle").show();
        $(".biz-wp-table").remove();

        //keep in track the total pages
        self.totalPages = resultList.total;

        if (resultList.rows.length > 0) {

            self.showUnlockFormsResultFrame(content, resultList);
            self.setupActionsButton(content);

            var pageToshow = (self.maxPageToShow > self.totalPages) ? self.totalPages : self.maxPageToShow;
            var summaryWrapper = $("#biz-wp-table-pager-wrapper"),
                pagerData = {},
                paginationHtml;

            // show or hide "load more" button
            pagerData.pagination = (self.totalPages > 1) ? true : false;
            pagerData.page = resultList.page;
            pagerData.pages = {};

            for (var i = 1; i <= pageToshow; i++) {
                pagerData["pages"][i] = {
                    "pageNumber": i
                };
            }

            //load and append the paginator to the result table
            paginationHtml = $.tmpl(self.paginationTmpl, pagerData).html();
            summaryWrapper.append(paginationHtml);

            //add data and behaviour to pager
            $("ul").bizagiPagination({
                maxElemShow: self.maxElemShow,
                totalPages: self.totalPages,
                actualPage: resultList.page,
                listElement: $("#biz-wp-table-pager-wrapper"),
                clickCallBack: function (options) {
                    self.findResults(content, params, options.page);
                }
            });
        } else {
            bizagi.showMessageBox(bizagi.localization.getResource("workportal-widget-authentication-log-none"), "Bizagi", "warning");
        }
    },

    /*
     * Show forms in result frames
     */
    showUnlockFormsResultFrame: function (content, resultList) {
        var self = this;

        var processedItems = self.preprocessResultList(resultList.headers, resultList);

        if(self.selectedFormAdmin.length>0){
            $("#btn-admin-unlock-forms").attr("disabled",false);
        }else{
            $("#btn-admin-unlock-forms").attr("disabled",true);
        }

        var resultTemplate = $.tmpl(self.resultContentTmpl, {
            headers: resultList.headers,
            rows: processedItems
        });

        $("#dinamicContent", content).html(resultTemplate);
        $("#generalTitle").html(bizagi.localization.getResource("workportal-widget-adminunlockforms-table-title"));

        self.setupActivitiesLink(content);
        self.selectedItemsPersistence(content);
    },

    selectedItemsPersistence: function(content)
    {
        var self = this;

        $.each(self.selectedFormAdmin, function (index, value) {
            item = "input:checkbox[name=FormAdmin][value=" + value + "]";
            $(item, content).prop( "checked", true );
        });
    },

    /*
     *
     */
    preprocessResultList: function (headers, resultList) {
        var self = this;

        var processedItems = [],
            length = resultList.rows.length,
            i = 0;

        for (; i < length; i++) {
            processedItems.push(self.processResultItem(headers, resultList.rows[i]));
        }

        return processedItems;
    },

    /*
     * Process each result item
     */
    processResultItem: function (headers, rowItem) {
        var self = this;

        var rowItemData = rowItem.data,
            idForm = rowItem.idForm,
            idWorkflow = rowItem.idWorkFlow,
            isSubProcess = rowItem.isSubprocess;

        var resultArray = [],
            firstRowItem = [];

        var j = -1,
            columnIndex = 0;

        while (j++ < headers.length - 1) {
            switch (headers[j].fieldName) {

                case self.columnsID.formName:
                    //Insert form name
                    firstRowItem.push({
                        id: "idWorkItem",
                        value: rowItemData[columnIndex]
                    });

                    columnIndex++;
                    break;

                case self.columnsID.userName:
                case self.columnsID.userfullName:
                    //Insert process name
                    firstRowItem.push({
                        id: "idWorkItem",
                        value: rowItemData[columnIndex]
                    });

                    columnIndex++;
                    break;

                default:
                    break;
            }
        };

        firstRowItem.push({
            id: "checkFormAdmin",
            value: idForm,
            isSubProcess: isSubProcess
        });

        //Insert the first row element
        resultArray.push({
            attr: "first_row",
            data: firstRowItem
        });

        return {
            data: resultArray
        };
    },

    //******************************** EVENTS ********************************//

    /*
     * Implement main buttons behaviour
     */
    setupMainButtons: function () {
        var self = this,
            content = self.getContent(),
            buttons = $.tmpl(self.buttonContentTmpl, {});

        content.append(buttons);

        var widgetButtonSet = $("#unlock-forms-log-data-buttonset", content);

        $("#btn-admin-unlock-forms", widgetButtonSet).click(function (e) {

            var numberResults = parseInt($("#resultsNumber").val(),0);
            self.maxElemShow = (bizagi.util.isNumeric(numberResults)) ?numberResults : self.defaultMaxRows;

            var params = {
                h_action: "setUnlockForms",
                I_ProcessState: "Running",
                I_Users: "ALL",
                orderType: 1,
                order: "",
                orderField: "",
                I_USERNAME: $("#userNameInput").val(),
                I_USERFULLNAME: $("#userFullNameInput").val(),
                I_FORMNAME: $("#formName").val(),
                formsToUnlock: self.selectedFormAdmin,
                PageSize: self.maxElemShow
            };

            self.searchParams = params;
            self.updateResults(content, params);
            self.selectedFormAdmin = [];
        });
    },

    /*
     * Implement actions buttons behaviour
     */
    setupActionsButton: function (content) {
        var self = this;

        $("input:checkbox[name=FormAdmin]", content).click(function (event) {
            var valueSelected = $(this).val();
            ($(this).is(":checked")) ?  self.selectedFormAdmin.push(valueSelected): self.selectedFormAdmin.splice( $.inArray(valueSelected, self.selectedFormAdmin), 1 );

            if(self.selectedFormAdmin.length>0){
                $("#btn-admin-unlock-forms").attr("disabled",false);
            }else{
                $("#btn-admin-unlock-forms").attr("disabled",true);
            }
        });
    },

    /*
     * Manage sorting events
     */
    setupActivitiesLink: function (content) {
        var self = this;

        // Add click event to column header
        $(".forms-column-header", content).click(function () {
            var columnOrderId = $(this)[0].getAttribute("data-columnorder");
            var columnOrderBy = $(this)[0].getAttribute("data-ordertype");
            var columnOrderName = $(this)[0].getAttribute("data-columnOrderName");

            if (columnOrderBy == "1") {
                columnOrderBy = 0;
            } else {
                columnOrderBy = 1;
            }

            self.searchParams.order = columnOrderId;
            self.searchParams.orderType = columnOrderBy;
            self.searchParams.orderField = columnOrderName;
            self.findResults(content, self.searchParams, self.searchParams.Page);
        });
    }
});