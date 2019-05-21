/*
*   Name: BizAgi FormModeler Search Result Edition Component Model
*   Author: Diego Parra 
*   Comments:
*   -   This script will define basic stuff for search result editor model 
*   
*   This model does not have insert, move, or delete methods because the model will be refreshing each time
*   in other words, this model onyl simplifies a given model, in order to render it   
*/

bizagi.editor.observableClass.extend("bizagi.editor.component.searchresulteditor.model", {}, {

    /*
    *   Constructor
    */
    init: function (searchResultModel) {
        var self = this;

        // Define variables
        self.dummyRows = 5;

        // Process model to add columns
        self.model = self.processModel(searchResultModel);
    },

    /*
    *   Updates internal model
    */
    update: function (searchResultModel) {
        var self = this;
        self.model = self.processModel(searchResultModel);
    },

    /*
    *   Process the model to populate columns array
    */
    processModel: function (searchResultModel) {
        var self = this;
        var model = { columns: [], rows: [], resultValidations: searchResultModel.resultValidations };
        if (!searchResultModel) return model;

        var modelResult = searchResultModel.model;
        // Add columns
        if (modelResult.length > 0) {
            for (var i = 0; i < modelResult.length; i++) {
                var element = modelResult[i];
                var values = [];

                // Add rows
                for (var j = 0; j < self.dummyRows; j++) {
                    values.push({
                        value: "value"
                    });
                }

                // Push into columns array
                model.columns.push({
                    guid: element.guid,
                    displayName: bizagi.editor.utilities.resolvei18n( element.properties.displayName ),
                    xpath: element.properties.xpath,
                    type: element.type,
                    values: values
                });
            }
        }

        return model;
    },

    /*
    *   Get model for rendering
    */
    getViewModel: function () {
        return this.model;
    }
});