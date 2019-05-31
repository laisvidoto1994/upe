/*
 * jQuery BizAgi Render Text Widget 0.1
 *
 * Copyright (c) http://www.bizagi.com
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 *	jquery.metadata.js
 *	bizagi.ui.render.base.js
 */
(function ($) {
    $.ui.baseRender.subclass('ui.textRender', {
        /* Renders the control*/
        _render: function () {
            var self = this,
            properties = self.options.properties,
            control = self.control;

            // Creates control
            self.input = $('<input class="ui-bizagi-render-text" type="text" />')
                .appendTo(control);

            // Check mask property
            if (properties.mask) {
                self.input.mask({ mask: properties.mask });
            }

            // Attach change event
            self.input.bind("change", function () {
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
            if (value != undefined && properties.editable) {
                var self = this;
                self.input.val(value);
            }
        },

        /* 
        * Public method to determine if a value is valid or not
        */
        isValid: function (invalidElements) {
            var self = this,
                properties = self.options.properties;

            // Call base
            var bValid = $.ui.baseRender.prototype.isValid.apply(this, arguments);
            var value = self._getValue().toString();

            // Check regular expression
            if (properties.regularExpression) {
                if (!value.match(new RegExp(properties.regularExpression.expression))) {
                    var message = properties.regularExpression.message;
                    invalidElements.push({ xpath: properties.xpath, message: message });
                    bValid = false;
                }
            }

            return false;
        }
    });

})(jQuery);