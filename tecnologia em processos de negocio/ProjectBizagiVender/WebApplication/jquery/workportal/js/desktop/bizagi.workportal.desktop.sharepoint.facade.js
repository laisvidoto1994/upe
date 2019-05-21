/*
*   Name: BizAgi Tablet Workportal Facade
*   Author: Diego Parra
*   Comments:
*   -   This script will define a workportal facade to access to all components
*/

bizagi.workportal.desktop.facade.extend("bizagi.workportal.desktop.facade", {}, {
    init: function (workportal, dataService) {
        var self = this;
        // Call base
        self._super(workportal, dataService);
    }
});

