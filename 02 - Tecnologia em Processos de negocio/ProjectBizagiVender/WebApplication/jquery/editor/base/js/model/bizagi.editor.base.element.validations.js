/*
*   Name: BizAgi FormModeler Editor Element Validations
*   Author: Alexander Mejia
*   Comments:
*   -   This script will define validations code for the elements in order to keep
*       the element code clean
*/

// Make sure the namespaces exists
bizagi.editor = bizagi.editor || { };
bizagi.editor.base = bizagi.editor.base || { };

bizagi.editor.base.elementValidations = {

    /*
    *   Returns true if any required property is empty 
    */
    validRequiredProperties: function () {
        var self = this,
            result = true;

        self.formValidations = [];

        // clean messageValidation property
        self.messageValidation = "";

        // If the control isn't visible, don't execute this validation
        if (!self.isVisible()) {
            return result;
        }

        if (self.requiredProperties) {
            $.each(self.requiredProperties, function (key, _) {
                if (self.requiredProperties[key] && !self.resolveProperty(key) ) {
                    var caption = bizagi.localization.getResource("formmodeler-editor-contextmenu-caption-property-required").replace("{0}", self.propertyModel.getCaption(key));
                    self.messageValidation += caption + "</br>";
                    self.formValidations.push({ name: key, message: [caption] });
                    result = false;
                }
            });
        }


        return result;
    },

    /*
    *   Returns true if any required dependient property is empty 
    */
    validRequiredDependentProperties: function () {
        var self = this,
            result = true;

        self.formValidations = self.formValidations || [];
        self.messageValidation = self.messageValidation || "";


        // If the control isn't visible, don't execute this validation
        if (!self.isVisible()) {
            return result;
        }

        if (self.requiredDependentProperties) {
            $.each(self.requiredDependentProperties, function (key, dependency) {
                if (self.matchValue(dependency) && (self.resolveProperty(key) === undefined || self.resolveProperty(key) === null)) {
                    var caption = bizagi.localization.getResource("formmodeler-editor-contextmenu-caption-property-required").replace("{0}", self.propertyModel.getCaption(key)); ;
                    self.messageValidation += caption + "</br>";
                    self.formValidations.push({ name: key, message: [caption] });
                    result = false;
                }
            });
        }

        return result;
    },

    /*
    *   assigns the validation message
    */
    validSameXpath: function (xpath) {
        var self = this;

        var caption = bizagi.localization.getResource("bizagi-editor-form-validation-samexpath");
        if (typeof caption === "string") { caption = caption.replace("{0}", xpath); }
        else caption = "";

        self.messageValidation = self.messageValidation || "";
        self.messageValidation += caption + "</br>";

    },

    /*
    * Returns false if there are attributes of parameter entities with editable property in true 
    */
    validAttributesAdministrables: function (xpath) {
        var self = this,
            result = true;

        if (self.isEditable() && self.isParametricAttribute(xpath)) {
            if(self.type == "searchlist") return true;
            var caption = (self.triggerGlobalHandler("getContextEntityType") == "parameter") ?
                           bizagi.localization.getResource("bizagi-editor-form-validation-parameter-attribute-parameter-entity") :
                           bizagi.localization.getResource("bizagi-editor-form-validation-parameter-attribute-entity");
            self.messageValidation = self.messageValidation || "";
            self.messageValidation += caption + "</br>";
            result = false;
        }

        return result;
    },

    validLayoutPlaceholder: function(exclude) {
        var self = this,
           result = true;

        // If the control isn't visible, don't execute this validation
        if (!self.isVisible()) {
            return result;
        }

        if (self.type == 'layoutPlaceholder') {
            if ($.inArray(self.guid, exclude) == -1) {
                self.messageValidation = self.messageValidation || "";
                self.messageValidation += bizagi.localization.getResource("bizagi-editor-form-validation-layoutplaceholder") + "</br>";
                result = false;
            }
        }

        return result;
    },


    validAttributesNoEditables: function() {
        return true;
    },

    // ********************************* Helper Functions ******************************************
    // *********************************************************************************************

    /*
    * checks whether the property value matches
    */
    matchValue: function (dependency) {
        var self = this;

        var property = dependency.property;
        var value = self.resolveProperty(property);

        if (value && dependency.value == 'anyValue'){
            return true;
        }

        if (value !== undefined && value !== null) {
            return (value.toString() == dependency.value);
        }

        return false;

    }




};


