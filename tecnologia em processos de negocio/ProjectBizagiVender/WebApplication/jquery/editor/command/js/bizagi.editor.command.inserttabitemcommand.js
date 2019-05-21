
/*
*   Name: BizAgi FormModeler Editor Insert Tab Item Command
*   Author: Diego Parra
*   Comments:
*   -   This script will automate the tab addition
*/

bizagi.editor.refreshableCommand.extend("bizagi.editor.insertTabItemCommand", {}, {

    /*
    *   Adds a tab item in the last position
    */
    execute: function () {
        var self = this;
        var args = self.arguments;
        var tab = self.model.getElement(self.arguments.tab);
        self.arguments.position = tab.elements.length;

        self.arguments.canValidate = true;

        var type = (self.controller.isOfflineFormContext()) ? "offlinetabitem" : "tabitem";
        var tabIndex = "Tab " + (tab.elements.length + 1);
        var tabItem = self.createElement({ type: type, displayName: tabIndex });
        tabItem.properties.displayName = bizagi.editor.utilities.buildComplexLocalizable(tabIndex, tabItem.guid, "displayName");
        tab.addElement(tabItem);

        args.result = tabItem;

        return true;
    },

    /*
    *   Removes the added tab
    */
    undo: function () {
        var self = this;
        self.model.removeElement(self.arguments.position, self.arguments.tab);

        return true;
    }
})


