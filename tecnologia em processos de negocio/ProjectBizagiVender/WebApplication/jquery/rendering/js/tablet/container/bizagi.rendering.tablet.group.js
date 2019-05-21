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

        if (self.properties.collapse) {
            // Adds the no-animation parameter
            self.collapse(false);
        }

        // Define expanded property
        properties.expanded = self.properties.collapse;

        // Delegate event click
        $(group).find("> h1, > .arrow").bind("click", function () {
            if (self.isOpen()) {
                self.collapse(true);
            } else {
                self.expand(true);
            }
        });
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
    expand: function (isAnimated) {
        var self = this;
        var group = self.container;

        $(".arrow", group).removeClass('down');
        $(".arrow", group).addClass('up');

        if (isAnimated) {
            $(".childrenContainer", group).fadeToggle("fast");
        } else {
            $(".childrenContainer", group).show();
        }
    },

    /* 
     *   Collapses group container 
     */
    collapse: function (isAnimated) {
        var self = this;
        var group = self.container;

        $(".arrow", group).removeClass("up");
        $(".arrow", group).addClass("down");

        if (isAnimated) {
            $(".childrenContainer", group).fadeToggle("fast");
        } else {
            $(".childrenContainer", group).hide();
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
    }
});
