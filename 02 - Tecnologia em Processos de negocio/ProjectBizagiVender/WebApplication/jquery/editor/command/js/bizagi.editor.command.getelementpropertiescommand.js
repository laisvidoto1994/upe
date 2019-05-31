
/*
*   Name: BizAgi FormModeler Editor Get Element Properties Command
*   Author: Alexander Mejia
*   Comments:
*   -   This command will retrieve the properties for a desired element
*
*   Arguments
*   -   guid
*/

bizagi.editor.notUndoableCommand.extend("bizagi.editor.getElementPropertiesCommand", {}, {


    /*
    *   Gets the element properties for a given element guid
    */
    execute: function () {
        var self = this;
        var args = self.arguments;

        if (bizagi.editor.utilities.isGuidEmpty(args.guid)) {
            self.processMultiselect();
        } else {
            self.getElementProperties(args.guid);
        }

        return true;
    },

    searchContext: function (xpath, getContext) {
        var self = this;

        if (self.controller.isGridContext()) { return bizagi.editor.utilities.resolveContextEntityFromXpath(xpath); }
        if (getContext) { return bizagi.editor.utilities.resolveRelatedEntityFromXpath(xpath); }

    },


    getElementProperties: function (guid) {
        var self = this;
        var args = self.arguments;

        var element = self.model.getElement(guid);
        // Prepare result
        self.arguments.result = bizagi.clone(element.properties);

        // Add context element      
        if (element.properties.xpath) { $.extend(self.arguments.result, { context: self.searchContext(element.properties.xpath, args.getContext) }); }
    },

    /*
    *
    */
    processMultiselect: function () {
        var self = this;

        if (self.controller.isGridContext()) {
            var guids = self.controller.getGuidsSelected();
            self.getElementProperties(guids[0]);

        } else {
            self.arguments.result = null;
        }


    }
})

