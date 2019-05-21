/*
*   Name: BizAgi Smartphone Tab Container Extension
*   Author: Oscar Osorio
*   Comments:
*   -   This script will redefine the container class to adjust to Smartphone devices
*/

// Auto extend
bizagi.rendering.tab.extend("bizagi.rendering.tab", {}, {
    
    /* POST RENDER CONTAINER ACTIONS
    =================================================*/
    postRenderContainer: function(container) {
        var self = this;
        self._super(container);
        // Apply any plugin or custom code to implement smartphone tabs
        self.suscribeMethods();

    },

    suscribeMethods: function() {
        var self = this;
        var tab = self.container;
        //tabs
        if (self.activeTab != undefined && self.activeTab != null) {
            $(tab).bztabs({ activeTab: self.activeTab });
        } else {
            $(tab).bztabs({ enableFirst: true });
        }
    }
});
