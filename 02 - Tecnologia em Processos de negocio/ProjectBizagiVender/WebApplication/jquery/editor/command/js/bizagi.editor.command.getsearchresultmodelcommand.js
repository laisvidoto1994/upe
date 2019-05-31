/*
*   Name: BizAgi FormModeler Editor Get Search Result Model Command
*   Author: Alexander Mejia
*   Comments:
*   -   This command will retrieve the search result model from the current search form
*
*/

bizagi.editor.notUndoableCommand.extend("bizagi.editor.getSearchResultModelCommand", {}, {

    /*
    *   Return the search result model from the current search form
    */
    execute: function () {
        var self = this;
        var defer = $.Deferred();

        if (!self.controller.isSearchFormContext()) {
            throw "bizagi.editor.getSearchResultModelCommand - To use this command you must be in the searchform context";
        }

        // Define result
        $.when(self.model.getSearchResultRenderingModel())
            .done(function (model) {
                defer.resolve({ model: bizagi.clone(model.result), resultValidations: model.resultValidations });
            });
        
        self.arguments.result = defer.promise();

        return true;
    }
});