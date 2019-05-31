/*
 *   Name: BizAgi Tab Container Class
 *   Author: Diego Parra
 *   Comments:
 *   -   This script will define a tab container class for all devices
 */

bizagi.rendering.container.extend("bizagi.rendering.tab", {}, {

    /*
     *   Constructor
     */
    initializeData: function(params) {
        var self = this;

        // Call base
        this._super(params);

        // Default properties
        var properties = self.properties;
        properties.helpText = properties.helpText || properties.displayName;

        // Extend css property
        properties.cssclass = properties.cssclass || "";
    },

    /*
     *   Render the container layout
     */
    renderContainer: function() {
        var self = this;
        var properties = this.properties;
        var tabItems = $.map(self.children, function(child, key) {
            child.properties.counter = key;
            return child.properties;
        });
        var template = self.renderFactory.getTemplate("tab");
        var mode = self.getMode();

        // Render the tab
        var html = $.fasttmpl(template, {
            id: properties.id,
            tabs: tabItems,
            mode: mode,
            editable: properties.editable,
            tabOrientation: properties.orientation,
            uniqueId: properties.uniqueId,
            cssclass: properties.cssclass
        });

        // Get active container based on focus
        var activeTab = self.activeTab = self.getActiveTab();

        // Render children
        for (var i = 0, length = self.children.length; i < length; i++) {
            // Load on demand other tabs besides the first one
            self.children[i].properties.loadOnDemand = (i != activeTab);
        }
        html = self.replaceChildrenHtml(html, self.renderChildrenHtml());
        return html;
    },

    /*
     *   Return the active tab containing the focus, or the first tab
     */
    getActiveTab: function() {
        var self = this;
        var properties = self.properties;
        var formParams = this.getFormContainer().getParams();
        var mode = self.getMode();

        if (mode === "execution") {
            if (!formParams.isRefresh && properties.activeTab) {
                self.getFormContainer().setFocusedElement(properties.activeTab);
            }
        }

        var selectedTabs = formParams && formParams.selectedTabs ? formParams.selectedTabs : {};

        // Fetch from selected tabs collection
        if (selectedTabs[self.properties.id] >= 0) {
            return selectedTabs[self.properties.id];
        }

        // Check for focused elements
        for (var i = 0, length = self.children.length; i < length; i++) {
            // Load on demand other tabs besides the first one
            if (self.children[i].containsFocusedElement()) return i;
        }
        return 0;
    }
});
