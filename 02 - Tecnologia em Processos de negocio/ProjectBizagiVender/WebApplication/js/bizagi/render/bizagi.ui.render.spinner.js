/*
* jQuery BizAgi Render Spinner Widget 0.1
* Copyright (c) http://www.bizagi.com
*
* Depends:
*	jquery.ui.core.js
*	jquery.ui.widget.js
*	jquery.ui.spinner.js
*	jquery.metadata.js
*	bizagi.ui.render.base.js
*/
(function ($) {
    $.ui.baseRender.subclass('ui.spinnerRender', {
        /* Renders the control*/
        _render: function () {
            var self = this,
            properties = self.options.properties,
            control = self.control;

            // Define control settings & defaults
            var max = properties.max || null;
            var min = properties.min || null;
            var step = properties.step || 1;

            // Creates control
            self.input = $('<input class="ui-bizagi-render-spinner" type="text" />')
                .appendTo(control);

            // Set value
            self._setValue(properties.value);

            // Apply spinner plugin
            self.input.spinner({
                max: max,
                min: min,
                step: step
            });

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

            // Set value in control
            if (value && properties.editable) {
                var self = this;
                self.input.val(value);
            }
        }
    });

})(jQuery);