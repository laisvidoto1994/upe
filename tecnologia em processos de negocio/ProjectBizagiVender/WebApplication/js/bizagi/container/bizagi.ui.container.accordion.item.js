/*
* jQuery BizAgi Accordion Item Container Widget 0.1 
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

    $.ui.baseContainer.subclass('ui.accordionItemContainer', {
        /* Change selected item */
        setAsActiveContainer: function (argument) {
            var self = this;
            var accordionContainer = self.element.parent();

            // Changes item
            accordionContainer.accordion("activate", Number(self.element.attr("ordinal")));
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