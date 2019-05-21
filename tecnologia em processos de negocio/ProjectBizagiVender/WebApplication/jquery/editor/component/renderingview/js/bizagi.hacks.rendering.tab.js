/*
*   Name: BizAgi Form Modeler Tab Extension
*   Author: Diego Parra
*   Comments:
*   -   This script will redefine the tab class to adjust to form modeler
*/

bizagi.rendering.tab.original = $.extend(true, {}, bizagi.rendering.tab.prototype);
// Extends itself
$.extend(bizagi.rendering.tab.prototype, {

    /* 
    *   Template method to implement in each device to customize each container after processed
    */
    postRenderContainer: function (tab) {
        var self = this;
        var properties = self.properties;

        // Call original method
        bizagi.rendering.tab.original.postRenderContainer.apply(this, arguments);

        // If the current form is readonly return;
        if (self.isReadOnlyForm()) {
            return;
        }
        
        // Add handlers if the tab isn't contained in a nested form
        if (!self.isContainedInNestedForm() && !self.isContainedInCollectionNavigator()) {

            // Add handler
            $(".bz-render-tab-add", tab).click(function (ev) {
                ev.stopImmediatePropagation();
                // Publish addtab event to the view
                self.triggerGlobalHandler("addtab", { guid: properties.guid });
                return false;
            });

            // Assign tab headers to children
            $.each(self.children, function (i, tabItem) {
                var tabHeader = $("li[data-tab-guid=" + tabItem.properties.guid + "]", tab);
                tabItem.setTabHeader(tabHeader);
            });

            // Make headers sortable
            var header = $(".ui-tabs-nav", tab);
            header.sortable({
                items: "li[data-tab-guid]",
                revert: true,
                distance: 10,
                axis: "x",
                cursorAt: { top: -3, left: 0 },
                placeholder: "ui-bizagi-tab-placeholder",
                delay: 150,
                start: function (e, ui) { self.sortStart(e, ui); },
                tolerance: "pointer",
                stop: function (e, ui) { self.sortFinish(e, ui); }
            });

            // Remove keyboard interaction because generate a problem with the editable input
            var tabList = $(".ui-tabs-nav li", tab);
            tabList.unbind("keydown");
        }

        tab.data({
            guid: self.properties.guid,
            display: self.properties.displayName,
            type: self.properties.type
        });

        tab.on("tabsload", function (event, ui) {
             self.triggerGlobalHandler("controlRefreshCanvas", {});
        }).on("tabsactivate", function (event, ui) {
             self.triggerGlobalHandler("controlRefreshCanvas", {});
        });
    },

    /*
    *   Manages the drag start event when sorting the header tabs
    */
    sortStart: function (event, ui) {
        var self = this;

        var index = $(ui.item).parent().children("li[data-tab-guid]").not(".ui-bizagi-tab-placeholder").index(ui.item);
        ui.item.data("start-position", index);
        self.initialPosition = index;
        return true;
    },

    /*
    *   Manages the drag end event when sorting the header tabs
    */
    sortFinish: function (event, ui) {
        var self = this;
        var index = $(ui.item).parent().children("li[data-tab-guid]").not(".ui-bizagi-tab-placeholder").index(ui.item);

        // Trigger sort finish event
        self.triggerGlobalHandler("sortfinish", {
            source: {},
            initialPosition: ui.item.data("start-position") || self.initialPosition,
            finalPosition: index,
            sourceContainer: self.properties.guid,
            targetContainer: self.properties.guid
        });
        return true;
    }
})