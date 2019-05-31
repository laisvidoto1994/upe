/*
* jQuery BizAgi Render Link Widget 0.1 
* Copyright (c) http://www.bizagi.com
*
* Depends:
*	jquery.ui.core.js
*	jquery.ui.widget.js
*	jquery.metadata.js
*	bizagi.ui.render.base.js
*/
(function ($) {
    $.ui.baseRender.subclass('ui.linkRender', {
        /* Renders the control*/
        _render: function () {
            var self = this,
            properties = self.options.properties,
            control = self.control;

            // Define control settings & defaults

            // Creates control
            self.anchor = $('<a/>')
                .attr("href", properties.href)
                .text(properties.title)
                .appendTo(control);
        }
    });

})(jQuery);