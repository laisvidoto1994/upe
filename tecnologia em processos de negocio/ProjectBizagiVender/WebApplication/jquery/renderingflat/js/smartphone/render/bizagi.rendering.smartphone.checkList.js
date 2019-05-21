﻿/**
 *   Name: BizAgi Desktop Render list Extension
 *   Author: Iván Ricardo Taimal Narváez
 *   Comments:
 *   -   This script will redefine the list render class to adjust to desktop devices
 */

// Extends from base list
bizagi.rendering.checkList.extend("bizagi.rendering.checkList", {}, {

    /**
     *   Template method to implement in each device to customize each render after processed
     */
    postRenderSingle: function () {
        var self = this;
        var control = self.getControl();
        // Call base 
        this._super();
        // Set control container to behave as a block
        control.addClass("ui-bizagi-render-display-block");
        self.properties.unique = Math.ceil(Math.random() * 1000);
        // Apply plugin
        //$(".ui-bizagi-render-checkList-label", self.checkListGroup).check();
    },

    /**
     *   Template method to implement in each device to customize the render's behaviour to add handlers
     */
    configureHandlers: function () {
        var self = this;
        // Call base
        self._super();
        $("input[type=checkbox]", self.checkListGroup).bind("change", function (evt, ui) {
            var itemId = $(this).data("item-guid");
            var checked = false;
            if ($(this).hasClass("bz-check")) {
                $(this).removeClass("bz-check").addClass("bz-full-ball");
                checked = false;
            } else {
                $(this).removeClass("bz-full-ball").addClass("bz-check");
                checked = true;
            }

            self.onCheckListGroupChange(itemId, checked);
        });
    },

    onCheckListGroupChange: function (itemId, checked) {
        var self = this;
        var item;
        var items = $.grep(self.properties.items, function (element, index) {
            return element.guid === itemId;
        });
        if (items && items.length > 0) {
            item = items[0];
        }
        item.checked = checked;
    },

    /**
     *   Sets the value in the rendered control
     */
    clearDisplayValue: function () {
        var self = this;
        $("input[type=checkbox]", self.checkListGroup).removeAttr("checked");
    },

    setDisplayValue : function (value){
        var self = this;
    }
});
