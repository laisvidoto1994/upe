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
        /*var properties = self.properties;*/

        // Call base
        self._super(group);
        self.subscribeOnTouch();
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

    subscribeOnTouch: function () {
        var self = this;
        var group = self.container;

        $(group).find(">div.headertitle").bind("click", function () {
            $(group).toggleClass("collapsed");
        });
    }
});
