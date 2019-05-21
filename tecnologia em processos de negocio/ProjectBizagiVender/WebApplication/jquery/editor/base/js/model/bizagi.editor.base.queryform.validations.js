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

bizagi.editor.base.queryFormValidations = {

    /*
    *   Returns false if any required property is empty 
    */
    validRequiredProperties: function () {
        return this._super();
    },

    /*
    *   Returns true, doesn't apply in queryforms
    */
    validRequiredDependentProperties: function () {
        return true;    
    },

    /*
    *   Returns true, doesn't apply in queryforms
    */
    validAttributesAdministrables: function () {
        return true;
    },

    /*
    *   Returns false if the container result hasn't elements
    */
    validElementsInContainer: function () {
        return this._super();
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

    