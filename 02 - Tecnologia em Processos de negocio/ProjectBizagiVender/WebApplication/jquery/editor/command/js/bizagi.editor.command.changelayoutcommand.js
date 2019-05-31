

/*
*   Name: BizAgi FormModeler Editor Change Layout Command
*   Author: Alexander Mejia
*   Comments:
*   -   This script will define basic stuff for changelayoutcommand
*
*   Arguments
*   -   guid
*   -   values
*/

bizagi.editor.refreshableCommand.extend("bizagi.editor.changeLayoutCommand", {}, {

    /*
    *   Perform property change
    */
    execute: function () {
        var self = this;
        var args = self.arguments;
        var element = self.model.getElement(args.guid);

        // Save original value for redo
        if (!self.originalValue) {

            self.originalValue = bizagi.clone(element.getProperty("layout"));
        }

        element.assignProperty("layout", { elements: args.values });
        
        /*
        var layout = element.getProperty("layout");
        if (layout) { layout["elements"] = args.values; }}
        */

        for (var i = 0, l = args.values.length; i < l; i += 1) {
            var panel = element.elements[i];
            panel.assignProperty("width", args.values[i].width);
        }

        return true;
    },

    /*
    *   Undo property change
    */
    undo: function () {
        var self = this,
            args = self.arguments;

        var element = self.model.getElement(args.guid);
        element.assignProperty("layout", self.originalValue);

        for (var i = 0, l = self.originalValue.elements.length; i < l; i += 1) {
            var panel = element.elements[i];
            panel.assignProperty("width", self.originalValue.elements[i].width);
        }

        return true;
    }



})
