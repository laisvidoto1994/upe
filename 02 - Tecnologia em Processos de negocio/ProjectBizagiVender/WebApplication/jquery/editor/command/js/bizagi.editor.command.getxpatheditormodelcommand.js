/*
*   Name: Bizagi editor select xpath from entity command
*   Author: Rhony Pedraza
*   Comments:
*   -   This command retrieves the xpath submodel from an xpath
*
*   Arguments
*   -   guid
*/
bizagi.editor.notUndoableCommand.extend("bizagi.editor.getXpathEditorModelCommand", {}, {

    /*
    *   Fetchs the xpath tree submodel
    *   Returns a deferred in "args.result" because xpath subtree could be asyncronous
    */
    execute: function () {
        var self = this;
        var args = self.arguments;
        var element = this.model.getElement(this.arguments.guid);
        var defer = new $.Deferred();


        var xpathModel = (self.controller.isGridContext()) ? self.controller.getXpathNavigatorModelGrid() : self.controller.getXpathNavigatorModel();

        $.when(xpathModel)
            .done(function (model) {
                if (xpathModel.context != "adhocform") {
                    var xpath = element.properties.xpath;
                    var node = model.getNodeByXpath(bizagi.editor.utilities.resolveComplexXpath(xpath));

                    if (node && bizagi.util.parseBoolean(node.isScopeAttribute)) {
                        node.setScopeAttribute("false");
                        var newModel = model.getSubModel(xpath);
                        node.setScopeAttribute("true");
                    }
                    else {
                        newModel = model.getSubModel(xpath);
                    }
                } else {                    
                    var entity = self.resolveEditorParameter(args.editorParameters.entity, element);
                    if(args.editorParameters.entityContext){
                        var entityContext = self.resolveEditorParameter(args.editorParameters.entityContext, element);
                        newModel = model.getSubModelByEntity(entity, entityContext);
                    } else {
                        newModel = model.getSubModelByEntity(entity);
                    }
                }

                defer.resolve(newModel);
            });

        args.result = defer.promise();
        return true;

    },

    resolveEditorParameter: function (parameter, element) {
        parameter = parameter.substring(1, parameter.length - 1);
        parts = parameter.split(':');
        parts.shift();        
        return eval("element.properties." + parts.join('.'));
    }
});