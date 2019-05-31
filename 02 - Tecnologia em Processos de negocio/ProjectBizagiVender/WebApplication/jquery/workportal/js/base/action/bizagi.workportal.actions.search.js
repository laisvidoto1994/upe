/*
*   Name: BizAgi Workportal Search Action
*   Author: Edward Morales
*   Comments:
*   -   This script will execute the search action
*/

bizagi.workportal.actions.action.extend("bizagi.workportal.actions.search", {}, {

    /*
    *   Executes the action
    *   Could return a deferred
    */
    execute: function (params) {
        var self = this;
        // Set params reference
        self.params = params;

        // Referer parameters for render actions
        var referrerParams = {
            radNumber: $.trim(params.radNumber),
            idWorkflow: "",
            taskState: "all",
            // Filter by favorites  only when we are searching all processes and favorites
            onlyFavorites: false,
            // Sort and order parameters
            order: "",
            orderFieldName: "",
            orderType: "0",
            page: params.page || 1,
			group: (bizagiConfig.groupByCaseNumber)?"T_RADNUMBER":null
        };

        // Loads case workitems
        $.when(
        //self.dataService.searchCases(referrerParams)
			self.dataService.getCustomizedColumnsData(referrerParams)
			)
		.done(function (data) {
		    bizagi.lstIdCases = data.cases.lstIdCases;
		    //  Hack json data :(
		    var i = 0;
		    $(data.cases.columnTitle).each(function (key, value) {
		        if (value.order == "T_idTask") {
		            $(data.cases.rows).each(function (key2, value2) {
		                if (!self.isArray(value2["fields"][i])) {
		                    data["cases"]["rows"][key2]["fields"][i] = {
		                        "workitems": [{
		                            "TaskName": value2["fields"][i],
		                            "State": data["cases"]["rows"][key2]["taskState"]
		                        }]
		                    };
		                }
		            });
		        }
		        i++;
		    });
		    // Define radnumber for render actions bottons 
		    bizagi.referrerParams = bizagi.referrerParams || {};
		    bizagi.referrerParams.radNumber = params.radNumber;
		    bizagi.referrerParams.page = params.page || 1;
		    data.IsFavorite = false;
		    data.IsOpen = false;
		    bizagi.referrerParams.referrer = bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_SEARCH;
		    //bizagi.referrerParams.referrer = bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_INBOX_GRID;
		    // one result
		    if (data.cases.lstIdCases.length == 0) {
		        //show no results found
		        self.showNoResults(referrerParams);
		    } else if (data.cases.rows.length == 1) {

		        self.showSearch(data, params);


		    } else if (data.cases.rows.length >= 1) {
		        self.showSearch(data, referrerParams);
		    }
		});
    },

    /*
    *   Shows search results
    */
    showSearch: function (data, parameters) {
        var self = this;
        // Shows a dialog widget
        bizagi.referrerParams.requestGlobalForm = true;

        // define params to back button
        bizagi.referrerParams.referrerBackButton = bizagi.context.widget || bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_INBOX_GRID

        self.publish("changeWidget", {
            widgetName: bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_SEARCH,
            data: data,
            referrerParams: parameters
        });

        if (bizagi.detectDevice() == "tablet" || bizagi.detectDevice() == "tablet_ios" || bizagi.detectDevice() == "tablet_android") {
            $("#menu-items #search").trigger("closePopUp");
        }
        
        // Simulate a click on the button after a successful search
        //  $('#menu-toggler').trigger('click');

    },

    showNoResults: function (referrerParams) {
        var self = this;
        var originarlColor = $("#menuQuery").css("color");

        $("#menuQuery").css("color", "#f88f88");
        setTimeout(function () {
            $("#menuQuery").css("color", originarlColor);
        }, 5000);

        if (bizagi.detectDevice() == "smartphone_ios" || bizagi.detectDevice() == "smartphone_android") {
            self.showSearch({ "noresults": referrerParams.radNumber }, referrerParams);
        }

    },

    /*
    *   Show process
    */
    redirectToProcess: function (idCase) {
        var self = this;
        // Executes routing action
        self.publish("executeAction", {
            action: bizagi.workportal.actions.action.BIZAGI_WORKPORTAL_ACTION_ROUTING,
            idCase: idCase,
            onlyUserWorkItems: "false"
        });
    },
    /*
    *   Misc method to format cell values
    */
    formatRequest: function (value) {
        return value;
    },
    /**
    * Misc method to render categories
    */
    formatCategories: function (value) {
        return value;
    },
    isArray: function (value) {
        if (typeof (value) == 'object') {
            return true;
        } else {
            return false;
        }
    },
    isDate: function (value) {
        value = value || '';
        var state = false;
        var slash = (typeof value == 'string') ? value.split("/") : '';
        try {
            // Check format int/int/int
            if (slash.length == 3) {
                var date = new Date(value);
                if (date.getYear() > 0) {
                    state = true;
                }
            }
        } catch (e) {
            state = false;
        }

        return state;
    }
});
