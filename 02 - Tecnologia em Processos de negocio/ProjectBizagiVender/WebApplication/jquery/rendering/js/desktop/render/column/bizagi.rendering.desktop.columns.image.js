/*
 *   Name: BizAgi Desktop Text Column Decorator Extension
 *   Author: Diego Parra
 *   Comments:
 *   -   This script will redefine the image column decorator class to adjust to desktop devices
 */

// Extends from column
bizagi.rendering.columns.column.extend("bizagi.rendering.columns.image", {}, {
    /*
    *   Apply custom overrides to each decorated instance
    */
    applyOverrides: function (decorated) {
        var self = this;
        var properties = self.properties;
        var mode = self.getMode();
        this._super(decorated);


        // Hacks the upload render to add features
        decorated.getUploadXpath = this.getUploadXpath;

        // hack apply upload plugin method in order to execute it only when the control is inserted in the DOM
        var originalApplyUploadPlugin = decorated.applyUploadPlugin;
        if (decorated.properties.flashVersion) {
            decorated.applyUploadPlugin = function () {
                var uploadRender = this,
                        control = uploadRender.getControl();
                originalApplyUploadPlugin.apply(decorated, arguments);
                control.undelegate(".ui-bizagi-render-upload-item", "mouseover");
                control.undelegate(".ui-bizagi-render-upload-item", "mouseout");
                $(".ui-bizagi-render-upload-icon", control).css("display", "inline-block");

                // fix to firefox and chrome
                $(".ui-bizagi-render-upload-wrapper object", control).css({
                    position: 'relative'
                });
            };
        }


        // Hack renderControl and post render to avoid processing when using inline add
        var originalRenderControl = decorated.renderControl;
        var originalInternalPostRender = decorated.internalPostRender;
        //var originalPostRender = decorated.postRender;
        decorated.renderControl = function () {
            return "";
        };
        decorated.internalPostRender = function () {
            var control = decorated.getControl();

            // Check if its new row
            if (control.parents("tr").data("new-row")) {
                // Show message:  Please save record before to upload a file
                control.html(bizagi.localization.getResource('render-grid-column-upload-mandatory-key'));

                //Set the column with this attribute, so when the control is evaluated in isValid(), validated
                //also if it is required, and belongs from a new row
                self.isNewRow = true;
            } else {

                self.isNewRow = false;

                $.when(originalRenderControl.apply(decorated, arguments)).done(function (html) {
                    if (control.hasClass("ui-bizagi-render-control") ||
                        control.hasClass("ui-bizagi-cell-readonly")) {
                        control.append(html);
                        originalInternalPostRender.apply(decorated, arguments);
                    }
                });
            }
        };
        
        decorated.buildAddParams = function () {
            var self = this,
                properties = self.properties,
                form = self.getFormContainer();

            var data = [];

            data.push({ key: self.Class.BA_CONTEXT_PARAMETER_PREFIX + "xpath", value: properties.xpath });
            data.push({ key: self.Class.BA_CONTEXT_PARAMETER_PREFIX + "idRender", value: properties.id });
            data.push({ key: self.Class.BA_CONTEXT_PARAMETER_PREFIX + "xpathContext", value: properties.xpathContext });
            data.push({ key: self.Class.BA_CONTEXT_PARAMETER_PREFIX + self.Class.BA_PAGE_CACHE, value: properties.idPageCache });
            data.push({ key: self.Class.BA_ACTION_PARAMETER_PREFIX + "sessionId", value: form.properties.sessionId });
            data.push({ key: self.Class.BA_CONTEXT_PARAMETER_PREFIX + "action", value: 'savefile' });
            (properties.contexttype) ? data.push({ key: self.Class.BA_CONTEXT_PARAMETER_PREFIX + "contexttype", value: properties.contexttype }) : "";

            try {
                (BIZAGI_SESSION_NAME != undefined) ? data.push({ key: BIZAGI_SESSION_NAME, value: form.properties.sessionId }) : data.push({ key: "JSESSIONID", value: form.properties.sessionId });
            } catch (e) {
                data.push({ key: "JSESSIONID", value: form.properties.sessionId });
            }

            return data;
        };



        // Change xpath context
        if (mode == "execution") {
            decorated.properties.xpathContext = properties.xpathContext.length > 0 ?
                    properties.xpathContext + "." + self.grid.properties.xpath + "[id=" + decorated.surrogateKey + "]" :
                    self.grid.properties.xpath + "[id=" + decorated.surrogateKey + "]";
        }
    },
    /*
    *   Returns the xpath to be used  
    */
    getUploadXpath: function () {
        return this.grid.properties.xpath + "[id=" + this.surrogateKey + "]." + this.properties.xpath;
    }

});
