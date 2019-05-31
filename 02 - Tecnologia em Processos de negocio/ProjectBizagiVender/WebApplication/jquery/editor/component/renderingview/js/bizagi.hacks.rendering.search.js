/*
*   Name: BizAgi Form Modeler Tab Extension
*   Author: Alexander Mejia
*   Comments:
*   -   This script will redefine the search class to adjust to form modeler
*/

bizagi.rendering.search.original = $.extend(true, {}, bizagi.rendering.search.prototype);
// Extends itself
$.extend(bizagi.rendering.search.prototype, {

    /*
    *   Template method to implement in each device to customize each render after processed
    */
    postRender: function () {
        var self = this;

        // Call original method
        bizagi.rendering.search.original.postRender.apply(this, arguments);

        // If the current form is readonly return;
        if (self.isReadOnlyForm()) {
            return;
        }

        if (self.advancedSearch && !self.isContainedInNestedForm()) {
            self.advancedSearch.click(function (ev) {
                ev.stopPropagation();
                // Publish showSearchForm event to the view
                self.triggerGlobalHandler("showsearchform", {
                    guid: self.properties.guid
                });
            });
        }
    }
})