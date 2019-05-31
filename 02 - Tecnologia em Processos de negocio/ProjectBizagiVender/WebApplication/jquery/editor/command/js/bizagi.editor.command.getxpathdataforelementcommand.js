/*
*   Name: Bizagi editor select properties node from xpath model
*   Author: Alexander Mejia
*   Comments:
*   -   This command retrieves the properties of node from an xpath
*
*   Arguments
*   -   guid
*/
bizagi.editor.notUndoableCommand.extend("bizagi.editor.getXpathDataForElementCommand", {}, {

    /*
    *   Fetchs the properties of node in xpath model
    *   Returns a deferred in "args.result" because properties node xpath could be asyncronous
    */
    execute: function () {
        var self = this;
        var args = self.arguments;
        var element = this.model.getElement(this.arguments.guid);

        var xpath = bizagi.editor.utilities.resolveComplexXpath(element.properties.xpath);
        var xpathNavigatorModel = (self.controller.isGridContext()) ? self.controller.getXpathNavigatorModelGrid() : self.controller.getXpathNavigatorModel();
        
        args.result = xpathNavigatorModel.getNodeByXpath(xpath);
       
        return true;
    }

});