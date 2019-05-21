/*
* jQuery BizAgi Panel Container Widget 0.1 
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

    $.ui.baseContainer.subclass('ui.panelContainer', {
        /* Renders the container*/
        _render: function () {
            var self = this,
            properties = self.options.properties,
            container = self.element;

            // Set title
            if (properties.title) {
                self.title = $('<h3/>')
                        .text(properties.title)
                        .prependTo(container);
            }

            // Set height
            if (properties.height) {
                container.height(properties.height);
            }
        }

    });

})(jQuery);