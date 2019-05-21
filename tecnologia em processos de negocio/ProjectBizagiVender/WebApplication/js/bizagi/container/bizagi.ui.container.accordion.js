/*
* jQuery BizAgi Accordion Container Widget 0.1 
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

    $.ui.baseContainer.subclass('ui.accordionContainer', {
        /* Renders the container*/
        _render: function () {
            var self = this,
            properties = self.options.properties,
            container = self.element;
            
            // Add header layout
            $(">.ui-bizagi-container-accordionItem", container).each(function (i) {
                var accordionItem = $(this);
                accordionItem.properties = accordionItem.metadata({ type: 'attr', name: 'properties', single: 'bizagi' });
                accordionItem.attr("id", "ui-bizagi-accordion-" + accordionItem.properties.id);
                accordionItem.attr("ordinal", i);
                accordionItem.before('<h3><a href="#">' + accordionItem.properties.title + '</a></h3>');
            });

            // Enable accordeon
            container.accordion({
                autoHeight: false
            });

            // Process inner container layouts
            $(">.ui-bizagi-container-accordionItem", container).each(function (i) {
                var accordionItem = $(this);
                accordionItem.accordionItemContainer();
            });
        },

        /* Renders children layout */
        _renderChildren: function () {
            // Do nothing
        }
    });

})(jQuery);