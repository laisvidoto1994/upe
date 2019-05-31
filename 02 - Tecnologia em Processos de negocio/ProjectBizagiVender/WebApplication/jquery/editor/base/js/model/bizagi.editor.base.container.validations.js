/*
*   Name: BizAgi FormModeler Editor Container Behaviour
*   Author: Alexander Mejia, Diego Parra
*   Comments:
*   -   This script will define validations code for the containers in order to keep
*       the container code clean
*/

// Make sure the namespaces exists
bizagi.editor = bizagi.editor || { };
bizagi.editor.base = bizagi.editor.base || { };

bizagi.editor.base.containerValidations = {

    /*
    *   Returns false if any required property is empty 
    */
    validRequiredProperties: function () {
        var self = this;

        // call base method
        var result = self._super();

        $.each(self.elements, function (i, child) {
            result = result & child.validRequiredProperties();
        });

        return result;
    },

    /*
    *   Returns false if any required dependient property is empty 
    */
    validRequiredDependentProperties: function () {
        var self = this;

        // call base 
        var result = self._super();

        $.each(self.elements, function (i, child) {
            result = result & child.validRequiredDependentProperties();
        });

        return result;

    },


    /*
    *   Returns false if the container hasn't elements
    */
    validElementsInContainer: function () {
        var self = this;
        var result = true;

        if (self.isEditable()) {
            if (self.isContainerToValidate()) {

                result = (self.elements.length > 0);
                if (!result) {
                    var caption = (self.type === "grid") ? bizagi.localization.getResource("bizagi-editor-form-validation-elementsingrid")
                        : bizagi.localization.getResource("bizagi-editor-form-validation-elementsincontainer");
                    if (typeof caption !== "string") { caption = ""; }

                    self.messageValidation = self.messageValidation || "";
                    self.messageValidation += caption + "</br>";
                }
            }

            $.each(self.elements, function (i, child) {

                // The grid is a especial case, although is a render has elements
                if (typeof child.validElementsInContainer === "function") {
                    result = result & child.validElementsInContainer();
                }
            });
        }

        return result;
    },

    /*
    * Returns false if there are attributes of parameter entities with editable property in true 
    */
    validAttributesAdministrables: function () {
        var self = this;
        var result = true;

        if (self.isEditable()) {            
            for (var i = 0, l = self.elements.length; i < l; i++) {                
                result = result & self.elements[i].validAttributesAdministrables();
            }
        }

        return result;
    },

    /*
    * Checks if is a container to validate
    */
    isContainerToValidate: function () {
        var self = this;

        var type = self.type;

        return (type === "group" || type === "tabitem" || type === "grid" || type === "contentpanel");
    },

    /*
    * Returns false if there are layoutplaceholder controls without the parameters assigned
    */
    validLayoutPlaceholder: function (exclude) {
        var self = this;
        var result = true;
        
        for (var i = 0, l = self.elements.length; i < l; i++) {
            result = result & self.elements[i].validLayoutPlaceholder(exclude);
        }
                
        return result;
    },

    /*
    * Returns false if there are editables controls when this aren't allowed
    */
    validAttributesNoEditables: function () {
        var self = this;
        var defer = $.Deferred();       
        
        if (this.elements.length > 0) {
            $.when.apply($, $.map(this.elements, function (item) {
                return item.validAttributesNoEditables();
            }))
                .done(function () {
                    var answers = $.makeArray(arguments);
                    var result = answers.filter(function (item) {
                        return !item;
                    }).length > 0

                    defer.resolve(!result);
                });
        }
        else {
            defer.resolve(true);
        }
                
        return defer.promise();
    },

    /*
    *   Removes validations in controls
    */
    removeValidations: function () {
        var self = this;

        // call base method
        self._super();

        $.each(self.elements, function (i, child) {
            child.removeValidations();
        });

    }

};

    