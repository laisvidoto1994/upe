
/*
*   Name: BizAgi Workportal Webpart helper
*   Author: oscaro
*   Comments:
*   -   This script will define helper functions that the webparts could use to reuse some logic
*/
/*
*   Static Methods to configure webparts
*/
bizagi = (typeof (bizagi) !== "undefined") ? bizagi : {};
bizagi.webparts = (typeof (bizagi.webparts) !== "undefined") ? bizagi.webparts : {};


$.Class.extend("bizagi.workportal.webpart.helper", {}, {
    /* 
    *   Constructor
    */
    init: function (webpart) {
        // Set data service
        this.dataService = webpart.dataService;

        // Set l10n service
        this.resources = webpart.resources;

        // Set workportal facade
        this.workportalFacade = webpart.workportalFacade;

        //Load Aditional templates
        this.templates = {};
    },
    /*  
    *   Returns the file url
    */
    getFileImage: function (files) {
        var self = this;

        if (!files || files.length == 0) return self.getEmptyFile();
        return files;
    },
    getFile: function (files) {
        var self = this;

        if (!files || files.length == 0) return self.getEmptyFile();
        return self.dataService.getFile(files[0]);
    },

    loadTemplate: function (template, templateDestination) {
        var self = this;

        // Go fetch the template
        return bizagi.templateService.getTemplate(templateDestination)
                .done(function (resolvedRemplate) {
                    self.templates[template] = resolvedRemplate;
                });
    },

    //beta Iframe
    isWebpartInIFrame: function () {
        try {
            return window.self !== window.top;
        } catch (e) {
            return true;
        }
    },
    //pending implement
    getFailServerErrorDeferred: function (a, b, c) { }
});


