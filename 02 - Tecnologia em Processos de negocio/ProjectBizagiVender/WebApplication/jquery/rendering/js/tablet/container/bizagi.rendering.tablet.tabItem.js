/*
*   Name: BizAgi Tablet Panel Extension
*   Author: Diego Parra
*   Comments:
*   -   This script will redefine the container class to adjust to tablet devices
*/

// Auto extend
bizagi.rendering.tabItem.extend("bizagi.rendering.tabItem", {}, {
    /* 
    *   Change selected item 
    */
    setAsActiveContainer: function (argument) {
        var self = this;

        $.when(self.ready())
    	.done(function () {
    	    // Changes item
    	    var tabContainer = self.parent;
    	    tabContainer.container.tabs("option", "active", self.container.data("tab-counter"));
    	});
    },

    /* 
    *   Focus on container
    */
    focus: function () {
        var self = this;

        // Set this tab as an active container
        self.setAsActiveContainer();

        // Call base
        this._super();
    },
    /* 
    *   Hides / Show container 
    */
    changeVisibility: function (argument) {
        var self = this;
        var properties = self.properties;

        self._super(argument);

        var tabContainer = self.parent.container;
        var id = "ui-bizagi-tab-" + properties.id;
        var header = $("ul li[aria-controls = '" + id + "']", tabContainer);
        var activeTab = self.parent.getActiveTab();

        $.when(self.ready())
            .done(function () {
                // Hide - show the render
                if (properties.visible) {
                    header && header.show();
                    self.setAsActiveContainer();
                } else {
                    header && header.hide();
                }
            })
            .always(function () {
                tabContainer.tabs("option", "active", activeTab);
            });

    }
});
