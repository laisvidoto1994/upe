/**
 * Name: BizAgi Desktop Widget Authentication Log Implementation
 * 
 * @author Christian Collazos
 */


bizagi.workportal.widgets.authentication.log.extend("bizagi.workportal.widgets.authentication.log", {}, {
    
    init: function (workportalFacade, dataService, params) {
        var self = this;

        // Call base
        self._super(workportalFacade, dataService, params);

        //Load templates
        self.loadTemplates({
            "authentication.log": bizagi.getTemplate("bizagi.workportal.desktop.widgets.authentication.log").concat("#ui-bizagi-workportal-widget-authentication-log"),
            "authentication.log.fields": bizagi.getTemplate("bizagi.workportal.desktop.widgets.authentication.log").concat("#ui-bizagi-workportal-widget-authentication-log-fields"),
            "authentication.log.button": bizagi.getTemplate("bizagi.workportal.desktop.widgets.authentication.log").concat("#ui-bizagi-workportal-widget-authentication-log-button"),
            "authentication.log.result": bizagi.getTemplate("bizagi.workportal.desktop.widgets.authentication.log").concat("#ui-bizagi-workportal-widget-authentication-log-result"),
            "authentication.log.pagination": bizagi.getTemplate("bizagi.workportal.desktop.widgets.authentication.log").concat("#ui-bizagi-workportal-widget-authentication-log-pagination"),
            useNewEngine: false
        });
    },

    postRender: function () {
        var self = this;
        self.maxElemShow = 10;
        self.maxPageToShow = 5;

        //Template vars
        self.generalContentTmpl = self.getTemplate("authentication.log");
        self.fieldsContentTmpl = self.getTemplate("authentication.log.fields");
        self.buttonContentTmpl = self.getTemplate("authentication.log.button");
        self.resultContentTmpl = self.getTemplate("authentication.log.result");
        self.paginationTmpl = self.getTemplate("authentication.log.pagination");

        //load form data
        self.setupInitialData();
    },

    /*
    * Load form fields and combo's data
    */
    setupInitialData: function () {
        var self = this,
            content = self.getContent();
        var params = [{ dataType: "domains" }, { dataType: "events" }, { dataType: "subEvents"}];

        $.when(self.dataService.getAuthenticationLogData(params[0]),
            self.dataService.getAuthenticationLogData(params[1]),
            self.dataService.getAuthenticationLogData(params[2])
        ).done(function (domainList, eventTypeList, subEvenTypesList) {

            self.eventTypeList = eventTypeList[0].response;
            self.subEventTypeList = subEvenTypesList[0].response;

            var fields = $.tmpl(self.fieldsContentTmpl, { domainList: domainList[0],
                eventTypeList: eventTypeList[0].response,
                subEvenTypes: subEvenTypesList[0].response
            });

            //append fields to wrapper
            content.append(fields);

            self.setupDatePicker();
            self.setupFooterButtons();

        }).fail(function (error) {
            bizagi.log(error);
        });
    },

    /*
    * Load dateTime plugin and apply to respective fields
    */
    setupDatePicker: function () {
        var self = this,
            content = self.getContent();

        $(".biz-wp-form-datepicker", content).datetimepicker({
            controlType: 'select',
            timeFormat: 'HH:mm'
        });

    },

    /*
    * Implement button behaviour
    */
    setupFooterButtons: function () {
        var self = this,
            content = self.getContent(),
            button = $.tmpl(self.buttonContentTmpl, {});

        content.append(button);

        var widgetButtonSet = $("#authentication-log-data-buttonset", content);

        $("#btn-authentication-search", widgetButtonSet).click(function (e) {
            //clean old results
            $(".biz-wp-table").remove();
            $("#biz-wp-table-summary-wrapper").remove();
            var validateData = self.validateData();
            if (!validateData.fieldsAreEmpty && validateData.errorMessage=="") {
                var params = {
                    action: "AuthLog",
                    domain: $("#domainList", content).val() != "none" ? $("#domainList", content).val() : "",
                    userName: $("#auth-log-user", content).val(),
                    dtFrom: $("#sinceDate", content).val(),
                    dtTo: $("#toDate", content).val(),
                    eventSubType: $("#subEventType", content).val() != self.subEventTypeList[0].displayName ? $("#subEventType", content).val() : "",
                    eventType: $("#eventType", content).val() != self.eventTypeList[0].displayName ? $("#eventType", content).val() : "",
                    pagSize: self.maxElemShow
                };

                self.findResults(content, params);
            } else {
                bizagi.showMessageBox(validateData.errorMessage, "Bizagi", "warning");
            }

        });
    },

    /*
    * Validate required fields
    */
    validateData: function () {
        var self = this,
            content = self.getContent(),
            validateResponse = {fieldsAreEmpty:false, errorMessage:"" },
            errorMessage = "",
            errorFieldName = "";


        if ($("#domainList", content).val() == "none" &&
            $("#auth-log-user", content).val() == "" &&
            $("#eventType", content).val() == self.eventTypeList[0].id &&
            $("#subEventType", content).val() == self.subEventTypeList[0].id &&
            $("#sinceDate", content).val() == "" &&
            $("#toDate", content).val() == "") {
            
            validateResponse.fieldsAreEmpty = true;
            validateResponse.errorMessage = bizagi.localization.getResource("workportal-widget-authentication-log-emptyfields-message");
        }
        else if ($("#sinceDate", content).val()!="" && !bizagi.util.isDate($("#sinceDate", content).val())) {
                errorFieldName = bizagi.localization.getResource("workportal-widget-authentication-log-datesince");
                errorMessage = bizagi.localization.getResource("workportal-general-invalid-date");
                errorMessage = errorMessage.replace("{0}", errorFieldName);
                validateResponse.errorMessage = errorMessage;
        }
        else if ($("#toDate", content).val()!="" && !bizagi.util.isDate($("#toDate", content).val())) {
                errorFieldName = bizagi.localization.getResource("workportal-widget-authentication-log-dateto");
                errorMessage = bizagi.localization.getResource("workportal-general-invalid-date");
                errorMessage = errorMessage.replace("{0}", errorFieldName);
                validateResponse.errorMessage = errorMessage;
        }

        return validateResponse;

    },

    /*
    * Find log results using the input data
    */
    findResults: function (content, params, pageToShow) {
        var self = this;

        //If there is not a page to Show, begins whith the fist one
        pageToShow ? params.pag = pageToShow : params.pag = 1;

        $.when(
             self.dataService.getAuthenticationLogResult(params)
        ).done(function (resultList) {

            //clean old results
            $(".biz-wp-table").remove();
            $("#biz-wp-table-summary-wrapper").remove();

            //Keep in track the total Records
            self.totalRecords = resultList.records;

            //keep in track the total pages
            self.totalPages = resultList.total;

            if (resultList.rows.length > 0) {
                var resultTemplate = $.tmpl(self.resultContentTmpl, { resultList: resultList.rows });
                content.append(resultTemplate);

                var pageToshow = (self.maxPageToShow > self.totalPages) ? self.totalPages : self.maxPageToShow;
                var summaryWrapper = $("#biz-wp-table-pager-wrapper");
                var pagerData = {};
                var paginationHtml;

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


        }).fail(function (error) {
            bizagi.log(error);
        });
    }


});