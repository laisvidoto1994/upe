/*
* jQuery BizAgi Render Label Widget 0.1 
* Copyright (c) http://www.bizagi.com
*
* Depends:
*	jquery.ui.core.js
*	jquery.ui.widget.js
*	jquery.metadata.js
*	bizagi.ui.render.base.js
*/
(function ($) {
    $.ui.baseRender.subclass('ui.labelRender', {
        /* Renders the control*/
        _render: function () {
            var self = this,
            properties = self.options.properties,
            control = self.control;

            // Just apply display-type: label, align it to the left
            self.changeDisplayType("label");
            self.changeLabelAlign(properties.labelAlign || "left");
            self.label.addClass("ui-bizagi-render-label");
        }

    });

})(jQuery);