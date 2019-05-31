/*
*   Name: BizAgi Smartphone Container Extension
*   Author: Diego Parra
*   Comments:
*   -   This script will redefine the container class to adjust to smartphone devices
*/

// Extends itself
bizagi.rendering.container.extend("bizagi.rendering.container", {}, {
    getMenu: function () {
        var params = this.getFormContainer().getParams();
        return params.menu;
    },

    /*
     *   Starts waiting signal for async stuff
     */
    startLoading: function () {
        var self = this;
        var element = self.container;
        if (element) {
            element.startLoading({ delay: 250, overlay: true });
        }
    },

    /*
     *   Ends waiting for async stuff
     */
    endLoading: function () {
        var self = this;

        var element = self.container;
        if (element) {
            element.endLoading();
        }
    }
    
    
});
