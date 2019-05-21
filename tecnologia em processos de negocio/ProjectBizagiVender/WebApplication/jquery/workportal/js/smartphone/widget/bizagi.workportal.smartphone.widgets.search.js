/*
*   Name: BizAgi Workportal smartphones Search Controller
*   Author: oscaro (based on Edward Morales version)
*   Comments:
*   -   This script will provide base library for search cases
*/

// Auto extend
bizagi.workportal.widgets.search.extend('bizagi.workportal.widgets.search', {}, {
    postRender: function () {
        var self = this;
        var content = self.getContent();


        self.notifyNavigation(bizagi.localization.getResource("workportal-widget-navigation-search-results"));

        if (self.params.data.noresults) {
            $.tmpl(self.workportalFacade.getTemplate('search-details'), self.params.data).appendTo(content);
            return;
        }



        $.tmpl(self.workportalFacade.getTemplate('search-details'), self.params.data.cases, {
            isArray: self.isArray,
            isDate: self.isDate
        }).appendTo(content);

        $('.bz-wd-search-rows', content).bind("click", function (e) {
            e.preventDefault();
            e.stopPropagation();
            var idCase = $(this).data('bizagiIdcase') || "";

            self.notifyNavigation(idCase);
            self.publish('executeAction', {
                action: bizagi.workportal.actions.action.BIZAGI_WORKPORTAL_ACTION_ROUTING,
                idCase: idCase,
                eventAsTasks: true,
                onlyUserWorkItems: 'false'
            });

        });

        $('.bz-common-webkit-reset-ul', content).bind("click", function (e) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        });

        $('li[data-bizagi-idCase]', content).bind("click", function (e) {
            e.preventDefault();
            e.stopPropagation();
            var idCase = $(this).data('bizagiIdcase') || "";
            var idWorkItem = $(this).data('bizagiIdworkitem') || "";
            var idTask = $(this).data('bizagiIdtask') || "";
            var taskName = $(this).data('bizagiTaskname') || "";

	    self.notifyNavigation(taskName);
            self.publish('executeAction', {
                action: bizagi.workportal.actions.action.BIZAGI_WORKPORTAL_ACTION_ROUTING,
                idCase: idCase,
                idWorkItem: idWorkItem,
                idTask: idTask,
                eventAsTasks: true,
                onlyUserWorkItems: 'false'

            });
        });


    },


    /*
    copy from search desktop
    */
    isArray: function (value) {
        if (typeof (value) == 'object') {
            return true;
        } else {
            return false;
        }
    },

    isDate: function (value) {
        var state = false;
        try {
            var date = new Date(value);
            if (date.getYear() > 0) {
                state = true;
            }
        } catch (e) {
            state = false;
        }
        return state;
    },


    notifyNavigation: function (message) {
        var self = this;
        self.publish("notifiesNavigation", { message: message });
    }
});
