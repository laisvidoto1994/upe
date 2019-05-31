
/*
*   Name: BizAgi Workportal Webpart Widget Controller
*   Author: Diego Parra
*   Comments:
*   -   This script will define a wrapper class to to load custom webparts
*/

bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.webpart", {}, {
    /*
    *   Returns the widget name
    */
    getWidgetName: function () {
        return bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_WEBPART;
    },


    /*
    *   Constructor
    */
    init: function (workportalFacade, dataService, params) {
        // Call base
        this._super(workportalFacade, dataService, params);

        // Set webpart 
        this.webpartName = params.webpart;
    },

    /*
    *   Renders the content for the current controller
    *   Returns a deferred because it has to load the current user
    */
    renderContent: function () {
        var self = this;
        var content = self.content = $("<div />");
        var workportal = self.getWorkportal();

        // Execute webpart
        workportal.executeWebpart($.extend(self.params,{
            canvas: content,
            webpart: self.webpartName
        }));

        return content;
    }
});