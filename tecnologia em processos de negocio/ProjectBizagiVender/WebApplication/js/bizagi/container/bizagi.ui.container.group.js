/*
* jQuery BizAgi Group Container Widget 0.1 
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

    $.ui.baseContainer.subclass('ui.groupContainer', {
        /* Renders the container*/
        _render: function () {
            var self = this,
            properties = self.options.properties,
            container = self.element;

            // Build group layout
            container.children().wrapAll('<div class="ui-bizagi-container-group-wrapper ui-widget-content"/>');
            container.data("expanded", true);

            // Add Header
            self.expandedIcon = "ui-icon-triangle-1-s";
            self.collapsedIcon = "ui-icon-triangle-1-e";
            self.icon = $('<span class="ui-icon"/>')
                    .addClass(self.expandedIcon);

            var header = $('<h3/>')
                    .addClass("ui-bizagi-container-group-header")
                    .addClass("ui-helper-reset")
                    .addClass("ui-state-active")
                    .addClass("ui-corner-top")
                    .append(self.icon)
                    .append('<a href="javascript:;">' + container.properties.title + '</a>')
                    .click(function () {
                        container.data("expanded", !container.data("expanded"));
                        if (container.data("expanded")) {
                            self._expand();
                        } else {
                            self._collapse();
                        }
                    })
                    .prependTo(container);

            // Draw children
            $(".ui-bizagi-container-group-wrapper", container).baseContainer();
        },

        /* Expands group container */
        _expand: function (bImmediate) {
            var self = this,
                container = self.element;

            $(".ui-icon", container).addClass(self.expandedIcon).removeClass(self.collapsedIcon);
            if (bImmediate == true)
                $(".ui-bizagi-container-group-wrapper").show();
            else
                $(".ui-bizagi-container-group-wrapper").slideDown();
        },

        /* Collapses group container */
        _collapse: function (bImmediate) {
            var self = this,
                container = self.element;

            $(".ui-icon", container).addClass(self.collapsedIcon).removeClass(self.expandedIcon);
            if (bImmediate == true)
                $(".ui-bizagi-container-group-wrapper").hide();
            else
                $(".ui-bizagi-container-group-wrapper").slideUp();
        },

        /* Renders children layout */
        _renderChildren: function () {
            // Do nothing
        },

        /* Expands or collapse the container */
        toogleContainer: function (argument, bImmediate) {
            var self = this,
                container = self.element;

            if (argument == true) self._expand(bImmediate);
            else self._collapse(bImmediate);
        },

        /* Changes editability */
        changeEditability: function (argument) {
            var self = this,
                properties = self.options.properties,
                container = self.element;

            $(".ui-bizagi-container-group-wrapper", container).baseContainer("changeEditability", argument);
        },

        /* Focus on container*/
        focus: function () {
            var self = this,
                container = self.element;

            self.toogleContainer(true, true);

            // Call base
            $.ui.baseContainer.prototype.focus.apply(this, arguments);
        }
    });

})(jQuery);