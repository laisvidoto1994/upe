
/*
 *   Name: BizAgi Desktop Render Yes-No Extension
 *   Author: Diego Parra
 *   Comments:
 *   -   This script will redefine the Yes-No render class to adjust to desktop devices
 */

// Extends itself
bizagi.rendering.searchList.extend("bizagi.rendering.searchList", {

}, {
    /**
     * RenderSingle Method
     * */
    renderSingle: function () {
        var self = this;

        self._super();
    },

    /**
     * Postrender Method
     * */
    postRenderSingle: function () {
        var self = this;

        self._super();
    }
});
