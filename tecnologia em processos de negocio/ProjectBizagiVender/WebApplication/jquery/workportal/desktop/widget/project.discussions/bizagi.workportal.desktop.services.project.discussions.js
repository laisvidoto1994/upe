/*
 *   Name: Bizagi Workportal Desktop Discussions Services
 *   Author: Elkin Fernando Siabato Cruz
 */

bizagi.workportal.services.service.extend("bizagi.workportal.services.service", {}, {
    /*DISCUSSION*/
    getDiscussionsData: function (dataForm) {
        var self = this;
        var url = self.serviceLocator.getUrl("project-resource-get");

        return $.read({
            batchRequest: true,
            url: url,
            data: dataForm,
            dataType: "json"
        }).pipe(function(response){
            return response;
        });
    },

    postDiscussion: function (data) {
        var self = this;
        var url = self.serviceLocator.getUrl("project-resource-action");
        return $.create({
            url: url.replace("{typeResource}", "Discussion"),
            data: JSON.stringify(data),
            dataType: "json",
            contentType: "application/json"
        });
    },

    postTag: function (data) {
        var self = this;
        var url = self.serviceLocator.getUrl("project-resource-action");
        return $.create({
            url: url.replace("{typeResource}", "Tag"),
            data: JSON.stringify(data),
            dataType: "json",
            contentType: "application/json"
        });
    },

    deleteTag: function(data){
        var self = this;
        var url = self.serviceLocator.getUrl("project-resource-delete");
        url = url.replace("{typeResource}", "Tag");
        url = url.replace("{idResource}", data.idTag);
        return $.destroy({
            url: url,
            data: JSON.stringify(data),
            dataType: "json",
            contentType: "application/json"
        });
    },

    /*COMMENTS*/
    getCommentsData: function (data) {
        var self = this;
        var url = self.serviceLocator.getUrl("project-comments-get");

        return $.read({
            batchRequest: true,
            url: url,
            data: data,
            dataType: "json",
            contentType: "application/json"
        }).pipe(function(response){
            return response;
        });
    },

    getCommentsCountByParent: function (idParent) {
        var self = this;

        var data = {};
        data.idParent = idParent;

        var urlRest = self.serviceLocator.getUrl("project-comments-count-by-parent");

        return $.read({
            url: urlRest,
            data: data,
            dataType: "json",
            contentType: "application/json"
        });
    },

    postComment: function (data) {
        var self = this;
        var url = self.serviceLocator.getUrl("project-resource-action");

        return $.create({
            url: url.replace("{typeResource}", "Comment"),
            data: JSON.stringify(data),
            dataType: "json",
            contentType: "application/json"
        });
    },

    deleteComment: function(data){
        var self = this;
        var url = self.serviceLocator.getUrl("project-resource-action");
        return $.destroy({
            url: url.replace("{typeResource}", "Comment"),
            data: JSON.stringify(data),
            dataType: "json",
            contentType: "application/json"
        });
    },

    editDiscussion: function (data) {
        var self = this;
        var url = self.serviceLocator.getUrl("project-resource-action");
        return $.update({
            url: url.replace("{typeResource}", "Discussion"),
            data: JSON.stringify(data),
            dataType: "json",
            contentType: "application/json"
        });
    },

    //ATTACHMENTS
    getDownloadAttachment: function (guidAttachment) {
        var self = this;
        var url = self.serviceLocator.getUrl("project-attachment-download");
        url = url.replace("{Attachment}", guidAttachment);

        $("#project-dashboard-download").prop("src", url);
    }
});