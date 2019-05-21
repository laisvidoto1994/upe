/*
 *   Name: BizAgi Render Form Link Class
 *   Author: Diego Parra
 *   Comments:
 *   -   This script will define basic stuff for form link renders
 */

bizagi.rendering.render.extend("bizagi.rendering.formLink", {}, {

    /*
    *   Update or init the element data
    */
    initializeData: function (data) {
        var self = this;
        // Call base
        this._super(data);

        // Set properties
        this.properties.displayType = "value";
        this.properties.maximized = bizagi.util.parseBoolean(this.properties.maximized) != null ? bizagi.util.parseBoolean(this.properties.maximized) : false;

        // Calculate layout properties
        this.calculateInitialLayoutProperties();
    },
    /*
    *   Template method to implement in each children to customize each control
    */
    renderControl: function () {
        var self = this;
        var properties = self.properties;
        var template = self.renderFactory.getTemplate("link");

        // Render template
        return $.fasttmpl(template, {
            id: properties.id,
            align: properties.valueAlign,
            displayName: properties.displayName,
            value: properties.value,
            likeButton: bizagi.util.parseBoolean(properties.likeButton) || false
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
    *   Template method to implement in each device to customize each render after processed in read-only mode
    */
    postRenderReadOnly: function () {
        var self = this;
        //if (self.properties.editable || self.properties.value) {
        self.configureHandlers();
        //}
    },
    /*
    *   Submits a edit request for a link display form
    *   Returns a deferred
    */
    submitEditRequest: function () {
        var self = this,
                properties = self.properties;

        // Don't send request when the link is not editable
        if (properties.editable == false && !properties.value)
            return null;

        return self.dataService.editLinkForm({
            url: properties.editUrl,
            idRender: properties.id,
            xpath: self.getFormLinkXpath(),
            xpathContext: properties.xpathContext,
            idPageCache: properties.idPageCache
        });
    },
    /*
    *   Submits a link save request for the displayed form
    *   Returns a deferred
    */
    submitSaveRequest: function (data) {
        var self = this,
                properties = self.properties;

        // Don't send request when the link is not editable
        if (properties.editable == false && !properties.value)
            return null;

        var xpath = self.getFormLinkXpath();
        return self.dataService.saveLinkForm({
            url: properties.saveUrl,
            idRender: properties.id,
            xpathContext: properties.xpathContext == undefined || properties.xpathContext == "" ? xpath : (xpath ? properties.xpathContext + "." + xpath : properties.xpathContext),
            submitData: data
        }).done(function (response) {
            var executeSubmitOnChange = true;
            if (response && response.type == "validationMessages") {
                executeSubmitOnChange = false;
            }
            if (executeSubmitOnChange) {
                self.submitOnChange({});
            }
        });
    },
    /*
    *   Submits a rollback request
    *   Returns a deferred when done
    */
    submitRollbackRequest: function () {
        var self = this,
                properties = self.properties;

        // Don't send request when the link is not editable
        if (properties.editable == false && !properties.value)
            return null;


        return self.dataService.rollbackLinkForm({
            url: properties.rollbackUrl,
            idRender: properties.id,
            xpath: self.getFormLinkXpath(),
            xpathContext: properties.xpathContext,
            idPageCache: properties.idPageCache
        });
    },
    /*
    *   Submits a commit request
    *   Returns a deferred when done
    */
    submitCommitRequest: function () {
        var self = this,
                properties = self.properties;

        // Don't send request when the link is not editable
        if (properties.editable == false && !properties.value)
            return null;


        return self.dataService.commitLinkForm({
            url: properties.commitUrl,
            idRender: properties.id,
            xpath: self.getFormLinkXpath(),
            xpathContext: properties.xpathContext,
            idPageCache: properties.idPageCache
        });
    },
    /*
    *   Submits a checkpoint request
    *   Returns a deferred when done
    */
    submitCheckpointRequest: function () {
        var self = this,
                properties = self.properties;

        // Don't send request when the link is not editable
        if (properties.editable == false && !properties.value)
            return null;


        return self.dataService.sendCheckpoint({
            url: properties.checkpointUrl,
            idRender: properties.id,
            xpath: self.getFormLinkXpath(),
            xpathContext: properties.xpathContext,
            idPageCache: properties.idPageCache
        });
    },
    /* 
    * Public method to determine if a value is valid or not
    */
    isValid: function (invalidElements) {
        // Automatically this render is valid, so we can't check a required link
    },
    /*
    *   Get Form Link xpath to use
    */
    getFormLinkXpath: function () {
        return this.properties.xpath;
    },
    /* 
    *  Method to determine if the render value can be sent to the server or not
    */
    canBeSent: function () {
        return false;
    },
    /*
    *   Sets the value in the rendered control
    */
    setDisplayValue: function (value) {
        // Don't do anything
    },
    /* Customizes render color*/
    changeColor: function (color) {
        var self = this;
        var control = self.getControl();
        var label = self.getLabel();
        
        if (control && label) {
            if (color != 'none') {
                self.getControl().find("a").css("color", color, "!important");

                if (typeof (self.getControl().find("a").style) == "function") {
                    self.getControl().find("a").style("color", color, "!important");
                }
            } else {
                self.getControl().find("a").css("color", "");

                if (typeof (self.getControl().find("a").style) == "function") {
                    self.getControl().find("a").style("color", "");
                }
            }
        }

        self._super(color);
    }

});

