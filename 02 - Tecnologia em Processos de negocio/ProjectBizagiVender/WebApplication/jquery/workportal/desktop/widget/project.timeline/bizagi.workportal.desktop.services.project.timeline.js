/*
 *   Name: Bizagi Workportal Desktop Timeline Services
 *   Author: Diego Parra
 */

bizagi.workportal.services.service.extend("bizagi.workportal.services.service", {}, {        

    getTimeLineActivities: function (radNumber) {
        var self = this;
        var url = self.serviceLocator.getUrl("project-timeline-events-get");
        return $.read({
            url: encodeURI(url.replace("{idCase}", radNumber)),
            dataType: "json",
            contentType: "application/json"
        });
        /*return {
            events: [
                {
                    type: "activity",
                    displayName: "Patient arrival",
                    idCase: 1501,
                    idWorkitem: 12345,
                    status: "closed",
                    assignee: 4,
                    date: 1452595460
                },
                {
                    type: "activity",
                    displayName: "Initial scanning",
                    idCase: 1501,
                    idWorkitem: 12345,
                    status: "closed",
                    assignee: 1,
                    date: 1452595460
                },
                {
                    type: "activity",
                    displayName: "Urgency Reception",
                    idCase: 1501,
                    idWorkitem: 12345,
                    status: "closed",
                    assignee: 1,
                    date: 1452595460
                },
                {
                    type: "activity",
                    displayName: "Doctor Revision",
                    idCase: 1501,
                    idWorkitem: 12345,
                    status: "closed",
                    assignee: 2,
                    date: 1452595460
                },
                {
                    type: "event",
                    displayName: "Broken bone detected",
                    idCase: 1501,
                    idWorkitem: 12345,
                    status: "closed",
                    assignee: 1,
                    date: 1452595460
                },
                {
                    type: "planactivity",
                    displayName: "Perform x-ray scanning",
                    idCase: 1501,
                    idWorkitem: 12345,
                    status: "open",
                    containsMoreAssignees: true,
                    date: 1452625200
                },
                {
                    type: "activity",
                    displayName: "Patient arrival",
                    idCase: 1501,
                    idWorkitem: 12345,
                    status: "closed",
                    assignee: 1,
                    date: 1452595460
                },
                {
                    type: "activity",
                    displayName: "Initial scanning",
                    idCase: 1501,
                    idWorkitem: 12345,
                    status: "closed",
                    assignee: 1,
                    date: 1452595460
                },
                {
                    type: "activity",
                    displayName: "Urgency Reception",
                    idCase: 1501,
                    idWorkitem: 12345,
                    status: "closed",
                    assignee: 1,
                    date: 1452595460
                },
                {
                    type: "activity",
                    displayName: "Doctor Revision",
                    idCase: 1501,
                    idWorkitem: 12345,
                    status: "closed",
                    assignee: 2,
                    date: 1452595460
                },
                {
                    type: "event",
                    displayName: "Broken bone detected",
                    idCase: 1501,
                    idWorkitem: 12345,
                    status: "closed",
                    assignee: 1,
                    date: 1452595460
                },
                {
                    type: "planactivity",
                    displayName: "Perform x-ray scanning",
                    idCase: 1501,
                    idWorkitem: 12345,
                    status: "open",
                    containsMoreAssignees: true,
                    date: 1452625200
                },
                {
                    type: "activity",
                    displayName: "Patient arrival",
                    idCase: 1501,
                    idWorkitem: 12345,
                    status: "closed",
                    assignee: 1,
                    date: 1452595460
                },
                {
                    type: "activity",
                    displayName: "Initial scanning",
                    idCase: 1501,
                    idWorkitem: 12345,
                    status: "closed",
                    assignee: 1,
                    date: 1452595460
                },
                {
                    type: "activity",
                    displayName: "Urgency Reception",
                    idCase: 1501,
                    idWorkitem: 12345,
                    status: "closed",
                    assignee: 1,
                    date: 1452595460
                },
                {
                    type: "activity",
                    displayName: "Doctor Revision",
                    idCase: 1501,
                    idWorkitem: 12345,
                    status: "closed",
                    assignee: 2,
                    date: 1452595460
                },
                {
                    type: "event",
                    displayName: "Broken bone detected",
                    idCase: 1501,
                    idWorkitem: 12345,
                    status: "closed",
                    assignee: 1,
                    date: 1452595460
                },
                {
                    type: "planactivity",
                    displayName: "Perform x-ray scanning",
                    idCase: 1501,
                    idWorkitem: 12345,
                    status: "open",
                    containsMoreAssignees: true,
                    date: 1452625200
                },
                {
                    type: "activity",
                    displayName: "Patient arrival",
                    idCase: 1501,
                    idWorkitem: 12345,
                    status: "closed",
                    assignee: 1,
                    date: 1452595460
                },
                {
                    type: "activity",
                    displayName: "Initial scanning",
                    idCase: 1501,
                    idWorkitem: 12345,
                    status: "closed",
                    assignee: 1,
                    date: 1452595460
                },
                {
                    type: "activity",
                    displayName: "Urgency Reception",
                    idCase: 1501,
                    idWorkitem: 12345,
                    status: "closed",
                    assignee: 1,
                    date: 1452595460
                },
                {
                    type: "activity",
                    displayName: "Doctor Revision",
                    idCase: 1501,
                    idWorkitem: 12345,
                    status: "closed",
                    assignee: 2,
                    date: 1452595460
                },
                {
                    type: "event",
                    displayName: "Broken bone detected",
                    idCase: 1501,
                    idWorkitem: 12345,
                    status: "closed",
                    assignee: 1,
                    date: 1452595460
                },
                {
                    type: "planactivity",
                    displayName: "Perform x-ray scanning",
                    idCase: 1501,
                    idWorkitem: 12345,
                    status: "open",
                    containsMoreAssignees: true,
                    date: 1452625200
                }
            ]
        };*/
    },

    getAssigneePicture: function (idUserList) {
        var self = this;
        var params = {
            userIds: idUserList.join(),
            width: 50,
            height: 50
        };

        var url = self.serviceLocator.getUrl("project-users-get");

        return $.read({
            url: url,
            data: params,
            dataType: "json"
        });
    },

    getAssignees: function(idWorkitem) {
        var self = this;
        var url = self.serviceLocator.getUrl("project-workitem-assignees");
        return $.read({
            url: url.replace("{idWorkitem}", idWorkitem),
            dataType: "json",
            contentType: "application/json"
        });
    }
    
});
