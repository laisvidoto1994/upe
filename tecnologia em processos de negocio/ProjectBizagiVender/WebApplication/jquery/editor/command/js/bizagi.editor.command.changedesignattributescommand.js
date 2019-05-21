

/*
*   Name: BizAgi FormModeler Editor Change Design Attributes Command
*   Author: Manuel Mejia, Christian Collazos
*   Comments:
*   -   This script will define basic stuff for changeDesignAttributesCommand
*
*   Arguments
*   -   guid
*   -   property
*   -   attributes
*/

bizagi.editor.notUndoableCommand.extend("bizagi.editor.changeDesignAttributesCommand", {}, {

    /*
    *   update design attributes (editor parameters)
    */
    execute: function () {
        var self = this;
        var args = self.arguments;

        var element = self.model.getElement(args.guid);
        var designProperties = element.getIndexedProperties();
        var property = designProperties[args.property];

        if (property) {
            for (var attr in args.attributes) {
                property["editor-parameters"] = property["editor-parameters"] || {};
                property["editor-parameters"][attr] = args.attributes[attr];
            }
        }

    }

})


