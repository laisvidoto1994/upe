/*
 *   Name: Bizagi Workportal Desktop Discussions Services
 *   Author: Elkin Fernando Siabato Cruz
 */

bizagi.workportal.services.service.extend("bizagi.workportal.services.service", {}, {

    /*FILES*/
    createProjectFile: function (params) {

        var self = this;
        var url = self.serviceLocator.getUrl("project-files-upload");

        return $.create({
            url: url,
            data: JSON.stringify(params),
            dataType: "json",
            contentType: "application/json"
        });
    },

    /*
    * Update Project File
    */
    updateProjectFile: function (params) {

        var self = this;
        var url = self.serviceLocator.getUrl("project-files-upload");

        return $.update({
            url: url,
            data: JSON.stringify(params),
            dataType: "json",
            contentType: "application/json"
        });
    },

    /**
     * Delete file
     * @param data
     * @returns {*}
     */
    deleteFile: function(data){
        var self = this;
        var url = self.serviceLocator.getUrl("project-resource-action");
        return $.destroy({
            url: url.replace("{typeResource}", "Attachment"),
            data: JSON.stringify(data),
            dataType: "json",
            contentType: "application/json"
        });

    },

    /*
    * Get Files Thumbnails
    */
    getFilesThumbnails: function (params) {

        var self = this;
        var url = self.serviceLocator.getUrl("project-files-thumbnails");
        return $.read({
            url: url,
            data: params,
            dataType: "json",
            contentType: "application/json"
        });
    },

    /*
    * Get files list
    */
    getFilesListByRadNumber: function (params) {

        var self = this;
        var url = self.serviceLocator.getUrl("project-files-list");

        return $.read({
            url: url,
            data: params,
            dataType: "json",
            contentType: "application/json"
        });
    }

});