/*
*   Name: BizAgi Desktop Group Extension
*   Author: Diego Parra
*   Comments:
*   -   This script will redefine the group class to adjust to desktop devices
*/

// Auto extend
bizagi.rendering.group.extend("bizagi.rendering.group", {}, {

    /* 
    *   Template method to implement in each device to customize each container after processed
    */
    postRenderContainer: function (group) {
        var self = this;
        var properties = self.properties;
        var styleSufix = properties.orientation == "rtl" ? "-rtl" : "";

        // Call base
        self._super(group);

        var icon = $(".ui-icon", $(".ui-bizagi-container-group-header:first", self.container));

        // Define expanded property
        if (bizagi.util.parseBoolean(properties.collapse)) {
            properties.expanded = false;
            icon.addClass("ui-state-collapse" + styleSufix).removeClass("ui-state-expand" + styleSufix);
        } else {
            properties.expanded = true;
            icon.addClass("ui-state-expand" + styleSufix).removeClass("ui-state-collapse" + styleSufix);
        }
    },

    /*
    *   Template method to implement in each device to customize the container's behaviour to add handlers
    */
    configureHandlers: function () {
        var self = this;
        var properties = self.properties;
        var styleSufix = properties.orientation == "rtl" ? "-rtl" : "";
        var group = self.container;
        var icon;

        // Delegate event click
        var header = $(".ui-bizagi-container-group-header:first", group);
        $(header).click(function (e) {
            if (e.preventDefault) {
                e.preventDefault();
            }
            icon = $(".ui-icon", group);
            icon.toggleClass("ui-icon-triangle-1-s ui-icon-triangle-1-n");
            $(".ui-bizagi-container-group-wrapper:first", group).toggle();
            if (properties.expanded) {
                properties.expanded = false;
                icon.addClass("ui-state-collapse" + styleSufix).removeClass("ui-state-expand" + styleSufix);
            } else {
                properties.expanded = true;
                icon.addClass("ui-state-expand" + styleSufix).removeClass("ui-state-collapse" + styleSufix);
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
        var properties = self.properties;

        if (properties.expanded) {
            return true;
        } else {
            return false;
        }
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
        var header = $(".ui-bizagi-container-group-header:first", group);

        if (!self.isOpen()) {
            $(header).trigger("click");
        }
    },

    /* 
    *   Collapses group container 
    */
    collapse: function () {
        var self = this;
        var group = self.container;
        var header = $(".ui-bizagi-container-group-header:first", group);

        if (self.isOpen()) {
            $(header).trigger("click");
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
