/*
*   Name: BizAgi Workportal Desktop Integration old render within new look and feel
*   Author: Edward Morales
*   Comments:
*   -   This script define base controller to integrate old render within new workportal
*/

// Extends itself
bizagi.workportal.widgets.oldrenderintegration.extend("bizagi.workportal.widgets.oldrenderintegration", {}, {

    /*
    *   Constructor
    */
    init: function (workportalFacade, dataService, params) {
        var self = this;

        // Call base
        self._super(workportalFacade, dataService, params);

        // Declare widget variables
        self.taskState = "all"; // general taskState from tabs
        self.icoTaskState=""; // real staskState from list cases
        self.idWorkflow = 0;
        self.idCase = 0;
    },

    /*
    *   To be overriden in each device to apply layouts
    */
    postRender: function () {
    }
});
