/*
* jQuery BizAgi Tab Container Widget 0.1 
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

    $.ui.baseContainer.subclass('ui.tabContainer', {
        /* Renders the container*/
        _render: function () {
            var self = this,
            properties = self.options.properties,
            container = self.element;

            // Add header layout
            var html = "<ul>";

            $(">.ui-bizagi-container-tab", container).each(function (i) {
                var tab = $(this);
                tab.addClass("ui-corner-all");
                tab.properties = tab.metadata({ type: 'attr', name: 'properties', single: 'bizagi' });
                tab.attr("id", "ui-bizagi-tab-" + tab.properties.id);

                html += '<li><a href="#ui-bizagi-tab-' + tab.properties.id + '" title="' + tab.properties.id + '">' + tab.properties.title + '</a></li>';
            });
            html += "</ul>";
            container.prepend(html);

            // Enable tabs
            container.tabs({
                show: function (event, ui) {
                    // Trigger selected event on tab item
                    $(ui.panel).trigger("selected");

                    // BUGFIX for grids
                    $(".ui-bizagi-render", container).each(function (i) {
                        var render = $(this);
                        $(".ui-bizagi-render-grid", render).each(function (j) {
                            render.gridRender("resize");
                        });
                    });
                }
            });

            // Process tab layouts
            $(">.ui-bizagi-container-tab", container).each(function (i) {
                var tab = $(this);
                tab.tabItemContainer();
            });
        },

        /* Renders children layout */
        _renderChildren: function () {
            // Do nothing
        }
    });

})(jQuery);