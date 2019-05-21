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

        // Remove loading class
        if (self.container) {
            // Create loading
            var loadingDiv = $('<div class="ui-bizagi-render-loading ui-bizagi-loading"></div>');
            self.container.append(loadingDiv);
        }
    },

    /*
    *   Ends waiting for async stuff
    */
    endLoading: function () {
        var self = this;

        // Remove loading class
        if (self.container) {
            self.container.find(".ui-bizagi-render-loading").detach();
        };
    }
    
    
});
