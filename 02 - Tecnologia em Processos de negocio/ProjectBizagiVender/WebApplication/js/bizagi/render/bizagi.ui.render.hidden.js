/*
* jQuery BizAgi Render Hidden Widget 0.1 
* Copyright (c) http://www.bizagi.com
*
* Depends:
*	jquery.ui.core.js
*	jquery.ui.widget.js
*	jquery.metadata.js
*	bizagi.ui.render.base.js
*/
(function ($) {
    $.ui.baseRender.subclass('ui.hiddenRender', {
        /* Renders the control*/
        _render: function () {
            var self = this,
            properties = self.options.properties,
            control = self.control;

            // Just apply display-type: value
            self.changeDisplayType("value");

            // Hide full row
            self.element.hide();
        },

        /* Renders the read only version of the control*/
        _renderReadOnly: function () {
            var self = this,
            properties = self.options.properties,
            control = self.control;

            // Just apply display-type: value
            self.changeDisplayType("value");

            // Hide full row
            self.element.hide();
        }



    });

})(jQuery);