/*
* jQuery BizAgi Render Extended Text Widget 0.1
*
* Copyright (c) http://www.bizagi.com
*
* Depends:
*	jquery.ui.core.js
*	jquery.ui.widget.js
*	jquery.metadata.js
*	jquery.elastic.js
*	bizagi.util.js
*	bizagi.ui.render.base.js
*/
(function ($) {
    $.ui.baseRender.subclass('ui.extendedTextRender', {
        /* Renders the control*/
        _render: function () {
            var self = this,
            properties = self.options.properties,
            control = self.control;

            // Creates control
            self.textArea = $('<textarea class="ui-bizagi-render-text-extended" ></textarea>')
                .appendTo(control);

            // Apply elastic plugin
            self.textArea.elastic();

            // Set value
            self._setValue(properties.value);

            // Attach change event
            self.textArea.bind("change", function () {
                // Updates internal value
                self._setInternalValue($(this).val());
            });
        },

        /* Internally sets the value */
        _setValue: function (value) {
            var self = this,
                properties = self.options.properties;

            // Call base
            $.ui.baseRender.prototype._setValue.apply(this, arguments);

            // Set value in input
            if (value && properties.editable) {
                var self = this;
                self.textArea.text(value.replaceAll("\n", "&#13"));
            }
        }
    });

})(jQuery);