/*
*   Name: BizAgi Desktop Panel Extension
*   Author: Diego Parra
*   Comments:
*   -   This script will redefine the container class to adjust to desktop devices
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


    /* 
    *   Resizes the container to adjust it to the container
    */
    resize: function (size) {
        var self = this,
            container = self.container;
        var width = container.width();

        // Set a timeout to resize the tab only when the tab is visible
        // Will try only ten times to avoid infinite cycles
        var counter = 0;
        var resizeTimeout = function () {
            if (counter > 10) return;
            if (container.is(":visible")) {
                $.each(self.children, function (i, child) {
                    child.resize({ width: width });
                });
            } else {
                counter++;
                setTimeout(resizeTimeout, 200);
            }
        };
        $.when(self.ready()).done(function () {
            resizeTimeout();
        });
    },

    /* 
    *   Change selected item 
    */
    setAsActiveContainer: function (argument) {
        var self = this;

        $.when(self.ready())
    	.done(function () {
    	    // Changes item
    	    var tabContainer = self.parent;
    	    if (tabContainer.container.data("ui-tabs")) {
    	        tabContainer.container.tabs("option", "active", self.container.data("tab-counter"));
    	    }            

    	});
    },

    /*
    *   Fires when the tab is selected manually
    */
    activate: function () {
        var self = this;

        self._super();
        if (self.loadingDeferred) self.loadingDeferred.resolve();
    },


    /*
    *   Fires when the tab is visible
    */
    visibleTab: function () {
        var self = this;
        if (self.tabActiveDeferred) self.tabActiveDeferred.resolve();
    },

    /* 
    *   Focus on container
    */
    focus: function () {
        var self = this;

        // Activate the tab if it hasn't been loaded
        self.activate();

        // Set this tab as an active container
        self.setAsActiveContainer();

        // Call base
        this._super();
    },

    /*
    * Renders the tab content
    */
    renderTabContent: function (html) {
        var self = this;
        var properties = this.properties;

        var form = self.getFormContainer();

        // Render children
        if (properties.loadOnDemand === undefined || properties.loadOnDemand == false || form.innerTabsLoading) {
            html = self.replaceChildrenHtml(html, self.renderChildrenHtml());
            self.tabReadyDeferred.resolve();
            self.tabActiveDeferred.resolve();
            return html;

        } else {
            // Defer execution for a while to improve first tab pkerformance
            self.startLoading();

            // Start a timeout, when the timeout finishes, it resolves the deferred therefore loading the tab
            if (self.getMode() == "execution") {
                setTimeout(function () {
                    if (self.loadingDeferred) {
                        self.loadingDeferred.resolve();
                    }
                }, 10500);
            }

            $.when(self.loadingDeferred.promise())
    		.done(function () {
    		    if (!self.isDisposed()) {
    		        self.replaceChildrenTag(self.container, self.renderChildrenHtml());
    		        self.postRenderContainer(self.container);
    		        self.endLoading();

    		        // Resolve tab deferred when tab is ready
    		        self.tabReadyDeferred.resolve();
    		        self.tabActiveDeferred.resolve();
    		    } else {
    		        // Reject tab deferred when tab is not valid
    		        self.tabReadyDeferred.reject();
    		        self.tabActiveDeferred.reject();
    		    }
    		});

            // Set a div in order to asynchonously resolve this
            html = self.replaceChildrenHtml(html, '<div class="children"/>');
            return html;
        }
    },

    /*
    *   Returns promise to hold any execution until the content is ready
    */
    ready: function (argument) {
        var self = this;

        if (bizagi.util.parseBoolean(argument) && self.container && self.container.length) {
            if (self.loadingDeferred) {
                self.loadingDeferred.resolve();
            }
            $.when(self.tabReadyDeferred.promise()).done(function () {
                self.activate();
            });
        }

        if (bizagi.util.parseBoolean(argument)) {
            if (!(self.container && self.container.length)) {
                var id = setInterval(function () {
                    if (self.container && self.container.length) {
                        clearInterval(id);
                        if (self.loadingDeferred) {
                            self.loadingDeferred.resolve();
                        }
                    }
                }, 50);
            }
        }

        // Merge promises
        return $.when(
    		        self.tabReadyDeferred.promise(),
    		        self.parent.ready(),
                   	self.tabActiveDeferred.promise()
    		   );
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
                    if (self.getMode() === "execution") {
                        header && header.hide();
                    }
                }
            })
            .always(function () {
                if (tabContainer.data("ui-tabs")) {
                    tabContainer.tabs("option", "active", activeTab);
                }
            });

    },

    afterToRefresh: function () {
        var self = this;

        self._super();
        $(self.parent.container).tabs("refresh");
    }

});
