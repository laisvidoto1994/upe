/*
 *   Name: BizAgi Render Fileprint Class
 *   Author: Christian Collazos
 *   Comments:
 *   -   This script will define basic stuff for fileprint renders
 */

bizagi.rendering.render.extend("bizagi.rendering.fileprint", {}, {

    /*
    *   Update or init the element data
    */
    initializeData: function (data) {
        var self = this;
        // Call base
        this._super(data);

        // Fill default properties
        var properties = this.properties;
        properties.caption = (properties.caption && properties.caption != " ")? properties.caption : "render-fileprint-property-caption";

        // set default value from normal to value
        properties.displayType = "value";

        // Calculate layout properties
        this.calculateInitialLayoutProperties();

        // A button cannot be required
        properties.required = false;
    },
    /*
    *   Template method to implement in each children to customize each control
    */
    renderControl: function () {
        var self = this;
        var properties = self.properties;
        var template = self.renderFactory.getTemplate("fileprint");

        return $.fasttmpl(template, {
            caption: properties.caption
        });
    },
    /*
    *   Method to render non editable values
    */
    renderReadOnly: function () {
        var self = this;

        // Executes the same template than normal render
        return self.renderControl();
    },

    /*
    *   get the fileprint url
    */
    getFilePrintUrl: function (disposition) {
        var self = this;
        var properties = self.properties;

        return self.dataService.getFilePrintUrl({
            idRender: properties.id,
            xpathContext: properties.xpathContext || "",
            idPageCache: properties.idPageCache,
            disposition: disposition,
            sessionId: self.getSessionId()
        });

    },

    /*
    *   Refresh the current form
    */
    refreshForm: function () {
        var self = this;
        var properties = self.properties;

        var form = self.getFormContainer();
        form.refreshForm(properties.id);
    },

     /*
    *   Saves the form
    */
    saveForm: function () {
        var self = this;
        var form = self.getFormContainer();
        return form.saveForm();
    }
});