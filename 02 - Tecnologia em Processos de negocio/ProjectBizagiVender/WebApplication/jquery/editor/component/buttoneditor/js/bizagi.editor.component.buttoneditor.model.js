/*
*   Name: BizAgi FormModeler Button Edition Component Model
*   Author: Diego Parra 
*   Comments:
*   -   This script will define basic stuff for button editor model 
*   
*   This model does not have insert, move, or delete methods because the model will be refreshing each time
*   in other words, this model onyl simplifies a given model, in order to render it   
*/

bizagi.editor.observableClass.extend("bizagi.editor.component.buttoneditor.model", {}, {

    /*
    *   Constructor
    */
    init: function (buttonModel) {
        var self = this;

        // Process model to add columns
        self.model = self.processModel(buttonModel);
    },

    /*
    *   Updates internal model
    */
    update: function (buttonModel) {
        var self = this;
        self.model = self.processModel(buttonModel);
    },

    /*
    *   Process the model to populate columns array
    */
    processModel: function (buttonModel) {
        var self = this;
        var model = buttonModel;

        return model;
    },

    /*
    *   Get model for rendering
    */
    getViewModel: function () {
        return this.model;
    }
});