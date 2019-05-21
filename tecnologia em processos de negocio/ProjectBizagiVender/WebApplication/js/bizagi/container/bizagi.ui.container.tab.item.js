/*
* jQuery BizAgi Tab Item Container Widget 0.1 
* Copyright (c) http://www.bizagi.com
*
* Depends:
*	jquery.ui.core.js
*	jquery.ui.widget.js
*	jquery.ui.button.js
*	jquery.metadata.js
*	bizagi.ui.container.base.js
*/

(function ($) {

    $.ui.baseContainer.subclass('ui.tabItemContainer', {
        /* Renders the container*/
        _render: function () {
            var self = this,
                container = self.element,
                properties = self.options.properties;

            // Read Properties
            self.contentUrl = properties.contentUrl || "";

            // Call base
            $.ui.baseContainer.prototype._render.apply(this, arguments);

            // Process on-demand content
            if (self.contentUrl.length > 0) {

                // Creates selected handler code
                var tabItemSelectedHandler = function (e, ui) {
                    if (container.data("loaded") != true) {
                        container.baseContainer("destroy");
                        container.load(self.contentUrl, function () {
                            // Apply rendering
                            container.tabItemContainer();
                        });
                    }

                    // Set flag on
                    container.data("loaded", true);
                }

                // Bind selected event
                container.bind("selected", tabItemSelectedHandler);
            }
        },

        /* Change selected item */
        setAsActiveContainer: function (argument) {
            var self = this;
            var tabContainer = self.element.parent();

            // Changes item
            tabContainer.tabs("select", self.element.attr("id"));
        },

        /* Focus on container*/
        focus: function () {
            var self = this,
                container = self.element;

            self.setAsActiveContainer();

            // Call base
            $.ui.baseContainer.prototype.focus.apply(this, arguments);
        }
    });

})(jQuery);