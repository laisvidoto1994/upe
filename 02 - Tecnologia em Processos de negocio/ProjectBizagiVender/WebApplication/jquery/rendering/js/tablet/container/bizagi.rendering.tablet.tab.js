/*
*   Name: BizAgi Tablet Tab Container Extension
*   Author: Diego Parra
*   Comments:
*   -   This script will redefine the container class to adjust to tablet devices
*/

// Auto extend
bizagi.rendering.tab.extend("bizagi.rendering.tab", {}, {

    /* POST RENDER CONTAINER ACTIONS
    =================================================*/
    postRenderContainer : function (tab) {
        var self = this;

        // Call base
        self._super(tab);
        // Apply tabs widget
        tab.tabs({
            active: self.activeTab,
            activate: function (event, ui) {
                // BUGFIX for grids inside tabs
                setTimeout(
            		function () {
            		    self.resize({ width: self.container.width(), height: self.container.height() });
            		}, 50
            	);
            },
            beforeActivate: function (event, ui) {
                self.triggerHandler("selected", { index: ui.newTab.index(), tab: self.children[ui.newTab.index()] });
                if (self.children[ui.newTab.index()]) {
                    self.children[ui.newTab.index()].activate();
                    self.activeTab = ui.newTab.index();
                }
            }
        });
        
        
    }
});
