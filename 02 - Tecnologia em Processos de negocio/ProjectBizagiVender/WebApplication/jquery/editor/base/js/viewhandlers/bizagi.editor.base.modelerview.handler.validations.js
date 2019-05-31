/*
*   Name: BizAgi Form Modeler View Validations Handlers
*   Author: ALexander Mejia
*   Comments:
*   -   This script will handler modeler view validations handlers
*/
bizagi.editor.modelerView.extend("bizagi.editor.modelerView", {}, {

    /*
    *  Validates form
    */
    processValidations: function (params) {
        var self = this;
        var defer = new $.Deferred();

        if (self.controller.isTemplateContext()) {
            return self.processTemplateValidations(params);
        }

        var result = self.executeCommand(
            {
                command: "formValidations",
                validations: [
                    "RequiredProperties",
                    "RequiredDependentProperties",
                    "SameXpath",
                    "ElementsInContainers",
                    "AttributesAdministrables",
                    "AttributesNoEditables"
                ],
                canRefresh: params.canRefresh
            });

        $.when(result)
            .done(function (data) {
                if (!$.isEmptyObject(data)) {

                    // turn on validate flag 
                    self.validateForm = true;
                    self.refreshRibbon();
                    $.extend(data, { showMessage: true });                   
                }
                defer.resolve(data);
            });        

        return defer.promise();
    },

    /*
    * Validates templates
    */
    processTemplateValidations: function(params){
        var self = this;

        var result = self.executeCommand(
            {
                command: "formValidations",
                validations: [],
                canRefresh: params.canRefresh
            });

        if (!$.isEmptyObject(result)) {

            // turn on validate flag 
            self.validateForm = true;
            self.refreshRibbon();
            $.extend(result, { showMessage: true });
        }

        return result;
    },

    removeValidations: function (params) {
        var self = this;

        // turn off validate flag 
        self.validateForm = false;
        self.executeCommand({ command: "removeValidationsInModel", canRefresh: params.canRefresh });

    }

})