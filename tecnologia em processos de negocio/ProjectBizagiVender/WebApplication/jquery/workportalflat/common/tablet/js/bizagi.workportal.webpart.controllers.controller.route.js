/*
*   Name: BizAgi Workportal Main Controller
*   Author: oo
*   Comments:
*   -   This script will define a base class to handle workportal layouts for any device
*/

bizagi.workportal.controllers.controller.extend("bizagi.workportal.controllers.controller", {}, {
    /**
    *   Constructor
    */
    init: function(workportalFacade, dataService) {
        this._super(workportalFacade, dataService, initialParams);
        this.setEvents();
    },

    setEvents: function() {
        var self = this;

        self.subscribe("createCase", self.createCase);
        self.subscribe("renderCase", self.renderCase);


    },

    createCase: function(params) {
    },

    renderCase: function(params) {
    }
});
