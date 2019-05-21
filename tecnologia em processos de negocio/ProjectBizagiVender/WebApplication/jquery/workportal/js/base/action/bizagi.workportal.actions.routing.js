/*
 *   Name: BizAgi Workportal Routing Action
 *   Author: Diego Parra && Edward Morales
 *   Comments:
 *   - This script will execute the routing action to determine what to do in the workportal
 *   - This class has been refactored based on jira story DRAGON-4943
 */

bizagi.workportal.actions.action.extend("bizagi.workportal.actions.routing", {}, {

    /*
    *   Executes the action
    *   Could return a deferred
    */
    execute: function (params) {
        var self = this;
        self.params = params || {};
        /* New implementation of routing*/

        $.when(self.dataService.routing.getRoute(params)).done(function (route) {
            var deferredDialogOpened =  $.Deferred();
            route = route || {};

            if (self.params.isOfflineForm != "undefined" && self.params.isOfflineForm == true) {
                route.moduleParams = $.extend(route.moduleParams, { formsRenderVersion: self.params.formsRenderVersion, isOfflineForm: self.params.isOfflineForm, idCase: self.params.idCase, idWorkitem: self.params.idWorkitem, guid: self.params.guid }) || {};
            }
            else {
                route.moduleParams = route.moduleParams || {};
            }

            switch (route.module) {

                case bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_RENDER:
                case bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_OLDRENDERINTEGRATION:
                case bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_ASYNC:
                    self.publish("changeWidget",route.moduleParams);
                    self.publish("closeAllDialogs");
                    break;
                case bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_PROJECT_DASHBOARD:
                    var data = $.extend(params, route.moduleParams);
                    bizagi.util.setContext(data);
                    self.publish("changeWidget", route.moduleParams);
                    self.publish("closeAllDialogs");
                    break;

                case bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_START_FORM:
                    var parameters = {
                        title: self.getResource("workportal-widget-newcase-title"),
                        width: 850,
                        height: 750,
                        refreshInbox: false,
                        onClose: route.moduleParams.onClose,
                        dialogOpened : deferredDialogOpened

                    };
                    self.publish("showDialogWidget", {
                        widgetName: route.module,
                        data: route.moduleParams.data,
                        modalParameters: parameters,
                        closeVisible: false,
                        dialogClass : "ui-bizagi-start-form-dialog"
                    });

                    deferredDialogOpened.promise().done(function(response) {
                        self.publish("onWidgetIncludedInDOM");
                        response.widgetReference.postRender();
                    });
                    
                    break;
                case bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_ROUTING:

                    var parameters = {
                        title: self.getResource("workportal-widget-routing-window-selector"),
                        width: 670,
                        height: 450,
                        refreshInbox: false,
                        onClose: route.moduleParams.onClose
                    };

                    if (self.isThereAsync(route.moduleParams.data)) {
                        self.asyncWidget(route.moduleParams);
                    } else {
                        self.publish("showDialogWidget", {
                            widgetName: route.module,
                            data: route.moduleParams.data,
                            modalParameters: parameters,
                            onClose: parameters.onClose
                        });
                    }
                    break;
            }

        });
    },

    /*
    * Search for async workitems
    */
    isThereAsync: function (data) {
        var workitems = data.workItems, wi, index = 0;
        var length = workitems.length, result = false;
        if (length > 0) {
            for (; index < length;) {
                wi = workitems[index++];
                if (wi.isAsynch === "true") {
                    result = result || [];
                    result.push(wi);
                }
            }
        }
        return result;
    },

    asyncWidget: function (params) {
        var self = this;
        params.widgetName = "async";
        self.publish("changeWidget", params);
    }
});

