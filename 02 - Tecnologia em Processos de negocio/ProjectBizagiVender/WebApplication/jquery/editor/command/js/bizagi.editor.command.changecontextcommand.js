
/*
*   Name: BizAgi FormModeler Editor Change Context Command
*   Author: Alexander Mejia
*   Comments:
*   -   This command performs a context change in the application
*
*   Arguments
*   - context
*   - guid
*/

bizagi.editor.refreshableCommand.extend("bizagi.editor.changeContextCommand", {}, {
    
    /*
    *   Returns true if the command can be undone
    */
    canUndo: function () { return false; },

    /*
    *   Performs a context change in the controller
    */
    execute: function () {
        var self = this;
        var args = self.arguments;

        // Change context in the controller
        var element = args.guid ? self.model.getElement(args.guid) : null;
        var contextXpath = (element && element.properties.xpath)
            ? element.properties.xpath :
            (args.context === "grid" || args.context === "offlinegrid" || args.context === "adhocgrid") ? "none" : null;

        var options = {
            context: args.context,
            guid: args.guid
        };
        if(args.context === "adhocgrid") {
            options.xpathAdhoc = element.properties.xpathAdhoc.xpath;
        } else {
            options.xpath = contextXpath;
        }
                
        self.controller.changeContext(options);

        return true;
    }


})
