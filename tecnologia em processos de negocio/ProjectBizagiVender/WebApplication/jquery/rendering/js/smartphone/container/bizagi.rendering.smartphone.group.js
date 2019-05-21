/*
 *   Name: BizAgi Smartphones Group Extension
 *   Author: oscar osorio
 *   Comments:
 *   -   This script will redefine the group class to adjust to smartphones devices
 */

// Auto extend
bizagi.rendering.group.extend("bizagi.rendering.group", {}, {
    /* 
    *   Template method to implement in each device to customize each container after processed
    */
    postRenderContainer: function (group) {
        var self = this;
        var properties = self.properties;
        // Call base
        self._super(group);
        self.suscbribeOnTouch();

        if (properties.collapse) {
            $(".bz-rn-expand", self.container).toggleClass("bz-rn-expand-active bz-rn-expand-inactive");
            $(".childrenContainer", self.container).css("display", "none");
        }
    },

    /* 
    *   Expands group container 
    */
    expand: function () {
        var self = this;
        var group = self.container;

    },

    /* 
    *   Collapses group container 
    */
    collapse: function () {
        var self = this;
        var group = self.container;

    },

    /* 
    *   Expands or collapse the container 
    */
    toogleContainer: function (argument) {
        var self = this;

        if (argument) {
            self.expand();
        } else {
            self.collapse();
        }
    },

    suscbribeOnTouch: function () {
        var self = this;
        var properties = self.properties;
        var group = self.container;

        $(group).find(">div.headertitle").bind("click", function () {
            $(".bz-rn-expand", group).toggleClass("bz-rn-expand-active bz-rn-expand-inactive");
            $(".childrenContainer", group).fadeToggle("fast");
        });
        /* $(group).delegate("h1,arrow", "click", function () {
        $(".arrow", group).toggleClass("up down");
        $(".childrenContainer", group).fadeToggle("fast");
        });*/


    }


});
