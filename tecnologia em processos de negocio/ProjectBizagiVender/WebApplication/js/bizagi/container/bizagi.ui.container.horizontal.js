/*
* jQuery BizAgi Horizontal Container Widget 0.1 
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

    $.ui.baseContainer.subclass('ui.horizontalContainer', {
        /* Renders the container*/
        _render: function () {
            var self = this,
            properties = self.options.properties,
            container = self.element;

            // Recalculate always
            var iCount = container.children(".ui-bizagi-render, .ui-bizagi-container-panel").size();

            // Process each child
            container.children(".ui-bizagi-render, .ui-bizagi-container-panel").each(function (i) {

                var element = $(this);

                // Extract metadata
                element.properties = element.metadata({ type: 'attr', name: 'properties', single: 'bizagi' });

                // Process width
                var renderWidth = element.properties.width;
                if (renderWidth == null || renderWidth.length == 0) {
                    // Set default size
                    renderWidth = 100 / iCount;
                } else {
                    // Set custom size
                    renderWidth = percent2Number(renderWidth);
                }

                // Set width
                if (i != (iCount - 1)) {
                    element.width(renderWidth + "%");
                } else {
                    element.width((renderWidth - 1.00) + "%");
                }
            });

            // Set class for all renders
            $(">.ui-bizagi-render, >.ui-bizagi-container", container).last().addClass("ui-bizagi-render-last");
        }
    });

})(jQuery);