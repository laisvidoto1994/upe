/*
*   Name: BizAgi Form Modeler Collection Navigator Extension
*   Author: Alexander Mejia
*   Date: 02-12-213
*   Comments:
*   -   This script will redefine the collection navigator class to adjust to form modeler
*/
bizagi.rendering.collectionnavigator.original = $.extend(true, {}, bizagi.rendering.collectionnavigator.prototype);
$.extend(bizagi.rendering.collectionnavigator.prototype, {

    /* 
    *   Template method to implement in each device to customize each container after processed
    */
    postRender: function () {
        var self = this;

        // Call original method
        bizagi.rendering.collectionnavigator.original.postRender.apply(this, arguments);
               
        $.when(self.isRendered())
            .done(function () {
                var properties = self.properties;
                var control = self.getControl();
                var canvas = control.find(".bz-collectionnavigator-navigationform");
               
                if (properties.navigationform) {
                    setTimeout(function () {
                        self.triggerGlobalHandler("refreshControl", {
                            guid: properties.guid,
                            canvas: canvas
                        });
                    }, 0);
                }
            });        
    }

})