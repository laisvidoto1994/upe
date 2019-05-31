/*
 *   Name: Bizagi Workportal Desktop Project Base
 *   Author: David Romero Estrada
 */

bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.project.base", {}, {

    /*
    * Initilize
    */
    init: function (workportalFacade, dataService, params) {

        var self = this;

        self.differenceMillisecondsServer = params.differenceMillisecondsServer;
        self.uploadMaxFilesSize = bizagi.currentUser.uploadMaxFileSize;
        self.supportFileExt = [
            ".jpg",
            ".pdf",
            ".txt",
            ".png",
            ".pptx",
            ".docx",
            ".gif",
            ".rtfx",
            ".xlsx",
            ".zip",
            ".rar"
        ];

        // Set radNumber
        self.radNumber = params.radNumber;

        // Call base
        self._super(workportalFacade, dataService, params);
    },

    renderContent: function () {
        var self = this;
        
        if (!self.differenceMillisecondsServer) {
            return $.when(self.dataService.getDateServer()).done(function (response) {
                self.differenceMillisecondsServer = bizagi.util.dateFormatter.getDifferenceBetweenDates(new Date(), new Date(response.date), "milliseconds");
            });
        }
    },
    /*
    * Calculate Server Date
    */
    getDateServer: function () {

        var dateLocal = new Date();
        
        return dateLocal.getTime() + this.differenceMillisecondsServer;
    },

    mergePropertiesActivitiesWithWorkitems: function(activities, workItems){
        activities.forEach(function(activity){
            var workItemFilter = workItems.filter(function(workItem){
                return workItem.guidActivity === activity.id;
            });
            if(workItemFilter.length > 0){
                $.extend(activity, {
                    startDate: workItemFilter[0].wiEntryDate || null,
                    finishDate: workItemFilter[0].wiSolutionDate || null,
                    idWorkItem: workItemFilter[0].idWorkItem,
                    workItemState: workItemFilter[0].workItemState,
                    idCase: workItemFilter[0].idCase,
                    estimatedFinishDate: workItemFilter[0].wiEstimatedSolutionDate || activity.estimatedFinishDate
                });
            }
        });
    }


});

bizagi.injector.register("bizagi.workportal.widgets.project.base", ["workportalFacade", "dataService", bizagi.workportal.widgets.project.base], true);