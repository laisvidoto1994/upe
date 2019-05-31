/*
*   Name: BizAgi FormModeler Editor Container Validations
*   Author: Alexander Mejia
*   Comments:
*   -   This script will define validations code for the containers in order to keep
*       the container code clean
*/

// Make sure the namespaces exists
bizagi.editor = bizagi.editor || {};
bizagi.editor.base = bizagi.editor.base || {};

bizagi.editor.base.searchFormValidations = {

    /*
    *   Returns false if any required property is empty 
    */
    validRequiredProperties: function () {
        return this._super();
    },

    /*
    *   Returns true, doesn't apply in searchforms
    */
    validRequiredDependentProperties: function () {
        return true;
    },

    /*
    *   Returns true, doesn't apply in searchforms
    */
    validAttributesAdministrables: function () {
        return true;
    },

    /*
    *   Returns false if the container result hasn't elements
    */
    validElementsInContainer: function () {
        var self = this;
        var result = true;

        self.resultValidations = "";
        result = (self.result.length > 0);
        if (!result) {
            var caption = bizagi.localization.getResource("bizagi-editor-form-validation-elementsincontainer");
            if (typeof caption !== "string") { caption = ""; }
            self.resultValidations = caption;
        }

        return result;
    },
    /*
    *   Removes validations in controls
    */
    removeValidations: function () {
        var self = this;

        // call base method
        self._super();
        self.resultValidations = null;
    }

};

    