
/*
*   Name: BizAgi Form Modeler Group Extension
*   Author: Ivan Avila
*   Comments:
*   -   This script will redefine the group class to adjust to form modeler
*/

// Auto extend
bizagi.rendering.date.original = $.extend(true, {}, bizagi.rendering.date.prototype);
$.extend(bizagi.rendering.date.prototype, {
    /* 
    *   Template method to implement in each device to customize each container after processed
    */
    setDisplayValue: function (value) {
        var self = this;

        // Call original method
        bizagi.rendering.date.original.setDisplayValue.apply(this, arguments);
       
        //Apply format
        var properties = self.properties;
        var dateControl = self.getDateControl().parent();
        var inputPlaceholder = $(".ui-bizagi-render-date", dateControl);

        if (properties.valueFormat.color && properties.valueFormat.color.length > 0) {
            var nameNewClass = "bz-" + properties.valueFormat.color.replace('#', '') + "-placeholder";
            var fullNewClass = "." + nameNewClass + "::-webkit-input-placeholder{color:" + properties.valueFormat.color + "}";
            bizagi.util.loadStyle(fullNewClass, nameNewClass);
            inputPlaceholder.addClass(nameNewClass);
        }

        if (properties.valueFormat.strikethru && properties.valueFormat.underline) {
            inputPlaceholder.addClass("biz-modify-placeholder-through-underline");
        } else {
            inputPlaceholder.removeClass("biz-modify-placeholder-through-underline");

            if (properties.valueFormat.strikethru) {
                inputPlaceholder.addClass("biz-modify-placeholder-through");
            } else {
                inputPlaceholder.removeClass("biz-modify-placeholder-through");
            }

            if (properties.valueFormat.underline) {
                inputPlaceholder.addClass("biz-modify-placeholder-underline");
            } else {
                inputPlaceholder.removeClass("biz-modify-placeholder-underline");
            }
        }

    }
})