/*
*   Name: BizAgi Desktop Queries Dialog implementation
*   Author: Juan Pablo Crossley
*   Comments:
*   -   ???
*/

// Extends itself
bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.queryform", {}, {
    /*
    *   Returns the widget name
    */
    getWidgetName: function () {
        return bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_QUERYFORM;
    },


    renderContent: function () {
        var self = this;
        if (bizagi.util.parseBoolean(bizagi.override.disableFrankensteinQueryForms) && !self.params.notMigratedUrl) {
            self.modifiedRender();
        }
        else {
            self.frankensteinRenderContent();
        }
    },

    modifiedRender: function () {
        var self = this;
        var template = self.getTemplate("queryform-wrapper");
        var content;
        content = self.content = $.tmpl(template, {});
        self.loadtemplates();
        return content;
    },

    /*
    * this will be implemented on each device
    */
    loadtemplates: function () { },

    /*
    *   Renders the content for the current controller
    *   Returns a deferred because it has to load the current user
    */
    frankensteinRenderContent: function () {
        var self = this;
        var template = self.getTemplate("queryform");
        var url = "";

        var idQueryForm = self.params.idQueryForm || "";
        var idStoredQuery = self.params.idStoredQuery || "";
        var idCube = self.params.idCube || "";

        // Define actions of queryform
        switch (self.params.queryFormAction) {
            case "edit":
                url = self.dataService.getUrl({
                    endPoint: "query-form-edit"
                }) + "?idStoredQuery=" + idStoredQuery + "&idQueryForm=" + idQueryForm;
                break;

            case "loadPrevious":
                url = "App/ListaDetalle/listaitems.aspx?" + self.dataService.lastQueryFullKey; //bizagi.referrerParams; //
                break;
            default:
                url = self.dataService.getUrl({
                    endPoint: "query-form"
                }) + "?idQueryForm=" + idQueryForm;
                // check children query
                url = (idStoredQuery != "") ? url + "&idStoredQuery=" + idStoredQuery : url;
                url = (idCube != "") ? url + "&idCube=" + idCube : url;
                break;
        }
        if (self.params.notMigratedUrl) {
            //url returned by the service with the operations and actions to execute
            url = 'App/' + self.params.notMigratedUrl;
        }

        //gets the content template adapted to use an iframe
        var content = self.content = $.tmpl(template,
        {
            queryFormURL: url
        });

        // Return content
        return content;
    }
});
