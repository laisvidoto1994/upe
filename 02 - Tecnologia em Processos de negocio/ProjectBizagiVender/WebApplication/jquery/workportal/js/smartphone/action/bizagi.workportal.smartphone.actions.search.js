/*
*   Name: BizAgi Workportal Search Action
*   Author: oscaro
*   Comments:
*   -   This script will execute the search action
*/

bizagi.workportal.actions.action.extend("bizagi.workportal.actions.search", {

}, {

/*
    execute: function (params) {
        bizagi.util.smartphone.startLoading();

        var self = this;
        self.project = bizagi.workportal.controllers.instances.main.project;
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
            page: params.page || 1
        };
        // Loads case workitems
        $.when(
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
		    data.IsOpen = false

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
    },



    showSearch: function (data, parameters) {
        var self = this;
        bizagi.util.smartphone.stopLoading();
        var html = $.tmpl(bizagi.workportal.controllers.instances.main.workportalFacade.getTemplate("menu.search.results"), data.cases, { isArray: self.isArray, isDate: self.isDate });
        bizagi.workportal.controllers.instances.main.menu.showResults(self.assignEvents(html));
    },

    assignEvents: function (html) {

        $(html).one("click", ".bz-wd-search-rows", function (e) {
            e.preventDefault();
            e.stopPropagation();
            var idCase = $(this).data('bizagiIdcase') || "";
            
            bizagi.workportal.controllers.instances.main.menu.closeMenu();
            bizagi.workportal.controllers.instances.main.menu.publish('executeAction', {
                action: bizagi.workportal.actions.action.BIZAGI_WORKPORTAL_ACTION_ROUTING,
                params: { idCase: idCase,
                    eventAsTasks: true,
                    onlyUserWorkItems: 'false'
                }
            });

        });

        $(html).one("click", "li[data-bizagi-idCase]", function (e) {
            e.preventDefault();
            e.stopPropagation();
            var idCase = $(this).data('bizagiIdcase') || "";
            var idWorkItem = $(this).data('bizagiIdworkitem') || "";
            var idTask = $(this).data('bizagiIdtask') || "";

            bizagi.workportal.controllers.instances.main.menu.closeMenu();
            bizagi.workportal.controllers.instances.main.menu.publish('executeAction', {
                action: bizagi.workportal.actions.action.BIZAGI_WORKPORTAL_ACTION_ROUTING,
                params: { idCase: idCase,
                    idWorkItem: idWorkItem,
                    idTask: idTask,
                    eventAsTasks: true,
                    onlyUserWorkItems: 'false'
                }

            });
        });


        return html;
    },

    showNoResults: function (referrerParams) {
        bizagi.util.smartphone.stopLoading();
        alert(bizagi.localization.getResource("workportal-menu-search-found-no-cases"));
    }*/
});
