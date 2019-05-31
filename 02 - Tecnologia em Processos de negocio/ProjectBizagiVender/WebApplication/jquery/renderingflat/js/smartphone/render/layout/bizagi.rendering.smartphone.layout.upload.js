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

        $.when(self.getValueFilesByData(bizagi.clone(properties))).done(function(properties, valueResult){
            self.properties = properties;
            self.files = valueResult.files;
            defer.resolve(self.getHTMLFiles());
        });

        return defer.promise();
    },

    postRenderSingle: function () {
        var self = this;
        var control = self.getControl();

        //ios native behaviour, should open files through a webview
        if (bizagi.util.isNativePluginSupported()) {
            var filesLinkElements = control.find(".ui-bizagi-render-upload-item a");
            var hrefProperty = filesLinkElements.attr("href");
            filesLinkElements.removeAttr("href");
            filesLinkElements.attr("data-url", hrefProperty);

            filesLinkElements.on("click", function () {
                bizagiapp.openFileWebView({ "itemUrl": $(this).attr("data-url") });
            });
        }
    },

    getHTMLFiles: function(){
        var self = this;
        var files = $.map(self.files, function(el){
            var file = {"id": el[0], "filename": el[1]};
            file.url =  self.buildItemUrl(file);
            return file;
        });

        var template = self.renderFactory.getTemplate("layout-upload");
        return $.fasttmpl(template, {"files": files});
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