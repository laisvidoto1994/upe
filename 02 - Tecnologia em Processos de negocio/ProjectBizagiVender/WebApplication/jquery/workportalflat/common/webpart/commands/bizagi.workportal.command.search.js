/*
*   Name: BizAgi Workportal Search Command
*   Author: Richar Urbano - RicharU
*   Comments:
*   -   This script will define a common class to access the search capability
*/

$.Class("bizagi.workportal.command.search", {
    SEARCH_PAGE_SIZE: 30,
    SEARCH_DELAY: 700
}, {
    init: function (dataService) {
        var self = this;

        self.isTabletDevice = bizagi.util.isTabletDevice();
        self.enableOfflineForm = bizagi.util.hasOfflineFormsEnabled();

        self.dataService = dataService;
    },

    searchList: function (params) {
        var self = this;

        params = params || {};

        // Offline type of tray
        params.inputtray = bizagi.util.inputTray(self.dataService.online);

        var referrerParams = {
            radNumber: $.trim(params.query),
            idWorkflow: "",
            taskState: "all",
            onlyFavorites: false,
            order: "",
            numberOfFields: 2,
            orderFieldName: "",
            orderType: "0",
            page: params.page || 1,
            pageSize: self.Class.SEARCH_PAGE_SIZE,
            inputtray: params.inputtray ? params.inputtray : "inbox"
        };

        if (bizagi.util.isQuickSearchEnabled()) {
            return self.loadDataListBeta(referrerParams);
        } else {
            return self.loadDataList(referrerParams);
        }
    },

    /*
    *   Load data by server
    */
    loadDataList: function (params) {
        var self = this;

        return self.dataService.getCasesByWorkflow(params).done(function (data) {
            data.elements = [];
            var elements = [];

            if (data.totalPages === 0) {
                elements.push({ noResults: true, message: bizagi.localization.getResource("workportal-menu-search-found-no-cases") });
            }

            for (var counter = 0, length = data.rows.length; length > counter; counter++) {

                var tmpElement = data.rows[counter]["fields"];
                var radNumber = data.rows[counter].radnumber || data.rows[counter].id;
                var element = {};
                var solutionDateElement = tmpElement[tmpElement.length - 1];
                var resultElement = {};

                element.radNumber = radNumber;

                // Get solutionDate                
                if (typeof (solutionDateElement.Value) != "string") {

                    for (var i = 0, elementLength = solutionDateElement.Value.length; i < elementLength; i++) {
                        var dateValue = solutionDateElement.Value[i];
                        if (dateValue !== "" && typeof (dateValue) == "string") {
                            resultElement.solutionDate = dateValue;
                            break;
                        }
                    }
                } else {
                    resultElement.solutionDate = solutionDateElement.Value;
                }

                // Get format solutionDate
                resultElement.solutionDate = bizagi.util.getTaskStatus(resultElement.solutionDate);

                // Get process name
                for (var j = 0; j < tmpElement.length; j++) {
                    if (tmpElement[j].DisplayName === "Process") {
                        resultElement.processName = tmpElement[j].Value;
                        break;
                    }
                }

                // If not process name found, get the first row
                if (!resultElement.processName) {
                    resultElement.processName = tmpElement[0].Value;
                }

                // Get workItems data and build result element
                if (typeof (data.rows[counter].workitems) != "undefined") {

                    var dataRowWorkItems = data.rows[counter].workitems;
                    for (var counterCase = 0; dataRowWorkItems.length > counterCase; counterCase++) {
                        element[0] = data.rows[counter]["id"];
                        element[1] = dataRowWorkItems[counterCase]["idWorkItem"];
                        element[2] = dataRowWorkItems[counterCase]["idTask"];
                        element["state"] = dataRowWorkItems[counterCase]["State"].toLowerCase() || "gray";
                        element[5] = dataRowWorkItems[counterCase]["TaskName"] || bizagi.localization.getResource("webpart-cases-summary-without-name");
                        element[6] = [];
                        element[6][0] = [];
                        element[6][0] = [0, data.rows[counter]["id"]];

                        element[4] = resultElement.processName;
                        element[3] = resultElement.solutionDate;

                        // OfflineForm
                        if (self.isTabletDevice && data.rows[counter].isOfflineForm) {
                            element[7] = data.rows[counter].isOfflineForm;
                            element[8] = data.rows[counter].isOpen;
                        }

                        // Clone element to a new one, to avoid that final result stays with the last element repeated
                        var newObject = $.extend(true, {}, element);
                        elements.push(newObject);
                    }
                } else {

                    element[0] = data.rows[counter]["id"];
                    element[1] = element[2] = 0;
                    element[5] = bizagi.localization.getResource("webpart-cases-summary-without-name");
                    element["state"] = "gray";
                    element[6] = [];
                    element[6][0] = [];
                    element[6][0] = [0, data.rows[counter]["id"]];
                    element[4] = resultElement.processName;
                    element[3] = resultElement.solutionDate;

                    // OfflineForm
                    if (self.isTabletDevice && data.rows[counter].isOfflineForm) {
                        var grouped = bizagi.getGroupedData(tmpElement[3]);
                        element[7] = data.rows[counter].isOfflineForm;
                        element[8] = data.rows[counter].isOpen;
                        element["state"] = grouped.status;
                    }

                    elements.push(element);
                }
            }

            data.elements = elements;

            return data.elements;
        }).fail(function (msg) {
            var data = { "elements": [], "page": 1, "totalPages": 1 };

            data.elements.push({ noResults: true, message: bizagi.localization.getResource("workportal-menu-search-found-no-cases") });
            return data.elements;
        });
    },

    /*
    *   Load data by server
    */
    loadDataListBeta: function (params) {
        var self = this;

        return self.dataService.getCasesListBeta(params)
            .done(function (data) {
                if (data.elements.length === 0) {
                    data.elements.push({ noResults: true, message: bizagi.localization.getResource("workportal-menu-search-found-no-cases") });
                }
                return data.elements;
            }).fail(function (msg) {
                var data = { "elements": [], "page": 1, "totalPages": 1 };
                data.elements.push({ noResults: true, message: bizagi.localization.getResource("workportal-menu-search-found-no-cases") });
                return data.elements;
            });
    },

    /**
    *  Render the case
    */
    getCaseData: function (params) {
        var dataItem = params.dataItem;
        var data = {};

        if (dataItem && typeof (dataItem.noResults) === "undefined") {
            if (dataItem[1] !== -1 && dataItem[2] !== -1) {
                data.idCase = dataItem[0];
                data.idWorkitem = bizagi.util.isNumeric(dataItem[1]) ? dataItem[1] : 0;
                data.idTask = bizagi.util.isNumeric(dataItem[2]) ? dataItem[2] : 0;;
                data.displayName = dataItem[5] || dataItem[6];
                data.radNumber = dataItem["radNumber"];
                data.isOfflineForm = dataItem[7] === true || false;
                data.formsRenderVersion = dataItem[7] === true ? 2 : 0;
            } else {
                data.idCase = dataItem[0];
                data.displayName = dataItem[4] || dataItem[0];
            }
        }

        return data;
    }
});