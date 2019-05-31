/*
*   Name: Bizagi editor get xpath navigator model
*   Author: Alexander Mejia
*   Comments:
*   -   This command retrieves the model for xpathNavigator component
*
*   Arguments
*   -   view (viewAll || onlyProcessEntity)
*/
bizagi.editor.notUndoableCommand.extend("bizagi.editor.getXpathNavigatorModelCommand", {}, {

    /*
    *   Fetchs the main model anf the gets submodel
    *   Returns a deferred in "args.result" because xpath subtree could be asyncronous
    */
    execute: function () {
        var self = this;
        var args = self.arguments;
        var defer = new $.Deferred();


        // Changes context of current view in xpathNavigator component
        if (args.toogleView) { self.controller.toogleXPathNavigatorView(); }

        // This could be a deferred so callers must treat the result from this command using WHEN / DONE
        $.when(self.controller.getXpathNavigatorModel())
            .done(function (model) {
                if ($.isPlainObject(model)) { defer.resolve(model); }
                else if (self.controller.isGridContext()) { defer.resolve(model); } 
                else {
                    var view = self.controller.getXpathNavigatorView();
                    (view === bizagi.editor.component.xpathnavigator.model.view["onlyProcessEntity"]) ?
                        model.getProcessEntityModel() :
                        model.getAllModel();
                    defer.resolve(model);
                }
            });

        args.result = defer.promise();

        return true;

    }

});