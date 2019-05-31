/*  
 *   Name: BizAgi Desktop Render list Extension
 *   Author: Iván Ricardo Taimal Narváez
 *   Comments:
 *   -   This script will redefine the list render class to adjust to desktop devices
 */

// Extends from base list
bizagi.rendering.checkList.extend("bizagi.rendering.checkList", {}, {

    /*
     *   Template method to implement in each device to customize each render after processed
     */
    postRender: function () {
        var self = this;
        var control = self.getControl();
        // Call base 
        this._super();
        // Set control container to behave as a block
        control.addClass("ui-bizagi-render-display-block");
        self.properties.unique = Math.ceil(Math.random() * 1000);
        // Apply plugin
        $(".ui-bizagi-render-checkList-label", self.checkListGroup).check();
    },

    /*
     *   Template method to implement in each device to customize the render's behaviour to add handlers
     */
    configureHandlers: function () {
        var self = this;
        // Call base
        self._super();
        // Bind change event
        if (!bizagi.util.isIE()) {
            // PLUGIN IMPLEMENTATION
            //todo: change bind type for IE
            $("input[type=checkbox]", self.checkListGroup).bind("change", function (evt, ui) {
                var itemId = $(this).data("item-guid");
                var checked = $(this).is(":checked");
                self.updateDisplay($(this),checked);
                self.onCheckListGroupChange(itemId, checked);
            });
        } else {
            // NON PLUGIN IMPLEMENTATION
            $("input[type=checkbox]", self.checkListGroup).bind("change", function (evt, ui) {
                var itemId = $(this).data("item-guid");
                var checked = $(this).is(":checked");
                self.updateDisplay($(this),checked);
                self.onCheckListGroupChange(itemId, checked);
            });
        }
    },

    updateDisplay: function (element,checked) {
        var self = this;
        var item = element.closest(".ui-bizagi-render-checkList-item");
        if (checked) {
            item.addClass('checked');
        } else {
            item.removeClass('checked');
        }
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

    /*
     *   Sets the value in the rendered control
     */
    clearDisplayValue: function () {
        var self = this;
        if (!bizagi.util.isIE()) {
            // PLUGIN IMPLEMENTATION
            $("input[type=checkbox]", self.checkListGroup).check("uncheckItem");
        }
        else {
            // NON PLUGIN IMPLEMENTATION
            $("input[type=checkbox]", self.checkListGroup).removeAttr("checked");
        }
    },

    setDisplayValue : function (value){
        var self = this;
    }

});
