/*
*   Name: BizAgi Tablet Group Extension
*   Author: Edward Morales
*   Comments:
*   -   This script will redefine the group class to adjust to tablet devices
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

        group = self.container;

        // Define expanded property
        properties.expanded = true;

        self.subscribeOnTouch();
    },

    /**
    * Check if group its open
    * 
    * @return boolean
    */
    isOpen: function () {
        var self = this;
        var group = self.container;

        return ($(".childrenContainer", group).is(":visible")) ? true : false;
    },

    /* Focus on container*/
    focus: function () {
        var self = this;

        // Expand container
        self.expand();

        // Call base
        this._super();
    },

    /* 
    *   Expands group container 
    */
    expand: function () {
        var self = this;
        var group = self.container;

        if (!self.isOpen()) {
            $("h1", group).trigger("click");
        }
    },

    /* 
    *   Collapses group container 
    */
    collapse: function () {
        var self = this;
        var group = self.container;

        if (self.isOpen()) {
            $("h1", group).trigger("click");
        }
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

        // Delegate event click
        $(group).find(">div.headertitle").bind("click", function () {
            $(group).toggleClass("collapsed");
        });
    }
});