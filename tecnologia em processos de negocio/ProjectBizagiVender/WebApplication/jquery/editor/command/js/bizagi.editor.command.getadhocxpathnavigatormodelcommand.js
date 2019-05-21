bizagi.editor.notUndoableCommand.extend("bizagi.editor.getAdhocXpathNavigatorModelCommand", {}, {

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
        $.when(self.controller.getAdhocXpathNavigatorModelGrid())
            .done(function (model) {
                defer.resolve(model); 
            });

        args.result = defer.promise();

        return true;

    }

});