/*
 *   Name: BizAgi Desktop Render Layout Upload
 *   Author: Bizagi
 *   Comments:
 *   -   This script will define the upload on entity template
 */

bizagi.rendering.layoutUpload.extend("bizagi.rendering.layoutUpload", {}, {
    /**
     *   Template method to implement in each children to customize each control
     */
    renderControl: function () {
        var self = this,
            properties = self.properties,
            defer = $.Deferred();
        var mode = self.getMode();
        if (mode === "execution")
        {
            $.when(self.getValueFilesByData(bizagi.clone(properties))).done(function(properties, valueResult){
                self.properties = properties;
                self.files = valueResult.files;
                defer.resolve(self.getHTMLFiles(properties));
            });
        }
        else{
            self.files = [];
            defer.resolve(self.getHTMLFiles());
        }

        return defer.promise();
    },

    getHTMLFiles: function(){
        var self = this;
        self.filesCount = self.files.length;

        var template = self.renderFactory.getTemplate("layout-upload");

        // Render template
        var html = $.fasttmpl(template, {
            xpath: bizagi.util.encodeXpath(self.getUploadXpath()),
            noFiles: (self.filesCount == 0)
        });

        // Render current children
        var items = "";
        for (var i = 0; i < self.filesCount; i++) {
            var file = { id: self.files[i][0], fileName: self.files[i][1] };
            items += self.renderUploadItem(file);
        }
        html = self.replaceFilesHtml(html, items);
        return html;
    },


    /**
     *   Replaces a {{files}} tag in the container for the specified "replace" element
     */
    replaceFilesHtml: function (html, replace) {
        return html.replace("{{files}}", replace);
    },

    /**
     *   Renders a single upload item
     */
    renderUploadItem: function (file) {
        var self = this;
        var properties = self.properties;
        var mode = self.getMode();

        var template = self.renderFactory.getTemplate("layout-uploadItem");
        var url = self.buildItemUrl(file);

        // Don't render urls when not running in execution mode
        if (mode != "execution")
            url = "javascript:void(0);";

        return $.fasttmpl(template, {
            url: url,
            allowDelete: properties.allowDelete,
            filename: file.fileName,
            id: file.id,
            mode: mode,
            editable: properties.editable
        });
    },

    /**
     *   Builds the upload item url
     */
    buildItemUrl: function (file) {
        var self = this,
            properties = self.properties;

        var form = self.getFormContainer();

        return self.dataService.getUploadFileEntityUrl({
            isContextContainerWidgetRender: self.isContextContainerWidgetRender(),
            xpath: self.getUploadXpath(),
            fileId: file.id,
            idRender: form.properties.paramsRender.idRender || "undefined",
            xpathContext: properties.xpathContext,
            idPageCache: form.properties.paramsRender.idPageCache || "undefined",
            xpathActions: form.properties.paramsRender.xpathActions || "undefined",
            sessionId: form.properties.sessionId,
            surrogatekey: self.properties.value.surrogateKey,
            guidentity: self.properties.value.guid
        });
    }
});