/*
*   Name: BizAgi Tablet Tab Container Extension
*   Author: Bizagi Mobile Team
*   Comments:
*   -   This script will redefine the container class to adjust to tablet devices
*/

// Auto extend
bizagi.rendering.tab.extend("bizagi.rendering.tab", {
    VISIBLE_TABS: 4
}, {

    /* POST RENDER CONTAINER ACTIONS
    =================================================*/
    postRenderContainer: function (tab) {
        var self = this;
        self._super(tab);

        // Apply any plugin or custom code to implement smartphone tabs
        self.suscribeMethods();
    },

    suscribeMethods: function () {
        var self = this;
        var tab = self.container;

        //tabs
        $(tab).bztabs({
            activeTab: (self.activeTab !== undefined && self.activeTab !== null) ? self.activeTab : 0,
            tabNumber: self.Class.VISIBLE_TABS,
            domIncluded: self.ready(),
            activate: function (event, ui) {
                self.activeTab = $(event.currentTarget) ? $(event.currentTarget).data("index") : 0;

                var index = self.activeTab;
                var form = self.getFormContainer();
                var selectedTab = {};
                selectedTab[self.children[index].parent.properties.id] = index;
                form.setParam("selectedTabs", selectedTab);
            }
        });
    },

    /**
     * Checks the visibility of the plus icon after partial refresh of itemTabs
     */
    checkPlusVisibility: function () {
        var self = this;
        var visible_tabs = $(".bz-header_select > .bz-wp-tabs-ui:not(:hidden)", self.container);
        if(visible_tabs.length <= self.Class.VISIBLE_TABS){
            $(".bz-wp-tabs-arrow-container.show-pluss", self.container).hide();
        }
        else{
            $(".bz-wp-tabs-arrow-container.show-pluss", self.container).show();
        }
    }
});
