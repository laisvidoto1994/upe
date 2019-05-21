/*
*   Name: BizAgi Tab Item Container Class
*   Author: Diego Parra
*   Comments:
*   -   This script will define a tab item class for all devices
*/

bizagi.rendering.container.extend("bizagi.rendering.tabItem", {}, {

    /*
    *   Render the container layout
    */
    renderContainer: function () {
        var self = this;
        var properties = this.properties;
        var template = self.renderFactory.getTemplate("tabItem");

        // Render the tabItem
        var html = $.fasttmpl(template, {
            id: properties.id,
            uniqueId: properties.uniqueId,
            counter: properties.counter
        });

        // Render content
        html = self.renderTabContent(html);

        return html;
    },

    /*
    * Renders the tab content
    */
    renderTabContent: function (html) {
        var self = this;

        // Render children
        return self.replaceChildrenHtml(html, self.renderChildrenHtml());
    },

    /*
    *   Fires when the tab is selected 
    */
    activate: function () {
        var self = this;
        self.active = true;
    },

    /*  
    *   Return the current focuses container
    */
    getFocus: function () {
        var self = this;
        var focus = self._super();
        if (bizagi.util.isEmpty(focus) && self.active) {
            focus = self.properties.id;
        }

        return focus;
    },

    /*
    *   Return true if this tab contains the active focused element
    */
    containsFocusedElement: function () {
        var self = this;
        var focus = self.getFormContainer().getFocusedElement();
        if (focus) {
            
            // Locate element
            if (focus.xpath) {
                // Search by xpath and id
                var elements = self.getFormContainer().getRenders(focus.xpath);
                var element;
                $.each(elements, function (i, item) {
                    // Just select editable control
                    if (item.properties.id == focus.id && item.properties.editable) {
                        element = item;
                    }
                });
            } else {
                // Search just using id
                var element = self.getFormContainer().getContainer(focus) || self.getFormContainer().getRenderById(focus);
            }

            // Search element parent
            if (element) {
                while (element.parent) {
                    if (element.properties.id == self.properties.id ||
                        element.parent.properties.id == self.properties.id) return true;
                    element = element.parent;
                }
            }
        }

        return false;
    }

});

