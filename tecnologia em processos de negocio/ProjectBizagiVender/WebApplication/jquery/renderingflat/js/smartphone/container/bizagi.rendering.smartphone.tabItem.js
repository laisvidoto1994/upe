/*
*   Name: BizAgi Smartphone Panel Extension
*   Author: Bizagi Mobile Team
*   Comments:
*   -   This script will redefine the container class to adjust to Smartphone devices
*/

// Auto extend
bizagi.rendering.tabItem.extend("bizagi.rendering.tabItem", {}, {
    /*
     *   Constructor
     */
    init: function (params) {
        var self = this;

        // Call base
        this._super(params);

        // Set tab ready deferred
        self.tabReadyDeferred = new $.Deferred();
        self.loadingDeferred = new $.Deferred();
        self.tabActiveDeferred = new $.Deferred();
    },
    /**
     * Change selected item
     *
     * @param {} argument
     * @returns {}
     */
    setAsActiveContainer: function (argument) {
        var self = this;

        $.when(self.ready()).done(function () {
            // Changes item
            var tabContainer = self.parent;
            if (tabContainer && tabContainer.container.tabs.hasOwnProperty("option")) {
                tabContainer.container.tabs("option", "active", self.container.data("tab-counter"));
            }
        });
    },

    /**
     * Focus on container
     *
     * @returns {}
     */
    focus: function () {
        var self = this;

        // Set this tab as an active container
        self.setAsActiveContainer();

        // Call base
        this._super();
    },

    /**
    *  Hides / Show container
    *
    * @param {} argument
    * @returns {}
    */
    changeVisibility: function (argument) {

        var self = this;
        var properties = self.properties;
        var tabContainer = self.parent.container;
        var activeTab = self.parent.getActiveTab();

        var id = "ui-bizagi-tab-" + properties.id;
        var header = $(".bz-wp-tabs-item[data-reference-tab='#" + id + "']", tabContainer);

        // Store in properties
        properties.visible = bizagi.util.parseBoolean(argument);

        $.when(self.ready())
            .done(function () {
                // Hide - show the render
                if (properties.visible) {
                    self.container.css("display", "");

                    self.setAsActiveContainer();

                    if (header && header.css("display", "none")) {
                        var headerShow = $("div[data-reference-tab='#" + id + "']", tabContainer);
                        headerShow && headerShow.css("display", "");
                    }
                } else {
                    self.container.hide();
                    if (header && header.css("display", "block")) {
                        var headerHide = $("div[data-reference-tab='#" + id + "']", tabContainer);
                        headerHide && headerHide.hide();
                    }
                }

            }).always(function () {
                if (tabContainer && tabContainer.tabs.hasOwnProperty("option")) {
                    tabContainer.tabs("option", "active", activeTab);
                }
                self.parent.checkPlusVisibility();
            });
    }
});
