/*
*   Name: BizAgi Render Letter Class
*   Author: Diego Parra
*   Comments:
*   -   This script will define basic stuff for letter renders
*/

bizagi.rendering.render.extend("bizagi.rendering.letter", {}, {

    /*
    *   Update or init the element data
    */
    initializeData: function (data) {
        var self = this;
        // Call base
        this._super(data);

        // Create a variable to check if the letter has been opened when editable
        this.letterOpened = false;
    },


    /*
    *   Template method to implement in each children to customize each control
    */
    renderControl: function () {
        var self = this;
        var template = self.renderFactory.getTemplate("letter");

        // Render template
        return $.fasttmpl(template);
    },


    /*
    *   Method to render non editable values
    */
    renderReadOnly: function () {
        var self = this;
        var template = self.renderFactory.getTemplate("letter.readonly");

        // Render template
        return $.fasttmpl(template);
    },

    /*
    *   Returns the letter content from the server
    */
    getLetterContent: function () {
        var self = this;
        var properties = self.properties;

        // Set flag to true
        self.letterOpened = true;

        return self.dataService.getLetterContent({
            url: properties.getUrl,
            idRender: properties.id,
            xpath: self.getXpath(),
            xpathContext: self.getContextXpath(),
            idPageCache: properties.idPageCache
        });
    },

    /*
    *   Sends the content to the server in order to save
    */
    saveLetterContent: function (content) {
        var self = this;
        var properties = self.properties;

        return self.dataService.saveLetterContent({
            url: properties.saveUrl,
            idRender: properties.id,
            xpath: self.getXpath(),
            xpathContext: self.getContextXpath(),
            idPageCache: properties.idPageCache,
            content: content
        });
    },


    /*
    *   Returns the letter content from the server
    */
    getCanGenerateLetter: function () {
        var self = this;
        var properties = self.properties;

        return self.dataService.getCanGenerateLetter({
            idRender: properties.id,
            xpath: self.getXpath(),
            xpathContext: self.getContextXpath(),
            idPageCache: properties.idPageCache
        });
    },

    /*
    *   Saves the form
    */
    saveForm: function () {
        var self = this;
        var form = self.getFormContainer();
        return form.saveForm();
    },

    isValid: function (invalidElements) {
        var self = this,
            properties = self.properties,
            message;

        // Don't check non-editable renders
        if (bizagi.util.parseBoolean(properties.visible) == false) {
            return true;
        }
        // Don't check non-editable renders
        if (bizagi.util.parseBoolean(properties.editable) == false) {
            return true;
        }

        // Clear error message
        self.setValidationMessage("");

        // Check required
        if (properties.required) {
            if (self.letterOpened == false) {
                message = self.getResource("render-letter-required-text").replaceAll("#label#", properties.displayName);
                invalidElements.push({ xpath: properties.xpath, message: message });
                return false;
            }
        }

        return true;
    },

    /*
    * Returns the current xpath
    */
    getXpath: function () {
        return this.properties.xpath;
    },

    /*
    * Returns the current context xpath
    */
    getContextXpath: function () {
        return this.properties.xpathContext;
    }

});

