/*
* jQuery BizAgi Render Slider Widget 0.1 
* Copyright (c) http://www.bizagi.com
*
* Depends:
*	jquery.ui.core.js
*	jquery.ui.widget.js
*	jquery.ui.slider.js
*	jquery.metadata.js
*	bizagi.ui.i18n.js
*	bizagi.ui.render.base.js
*/
(function ($) {
    $.ui.baseRender.subclass('ui.sliderRender', {
        /* Renders the control*/
        _render: function () {
            var self = this,
            properties = self.options.properties,
            control = self.control;

            // Set control container to behave as a block
            control
                .addClass("ui-bizagi-render-display-block")
                .addClass("ui-bizagi-render-slider");

            // Fix for mozilla
            $(".ui-bizagi-control", self.element)
                .addClass("ui-bizagi-render-overflow-visible");

            // Define control settings & defaults
            var max = properties.max || 10;
            var min = properties.min || 0;
            var step = properties.step || 1;
            var initialValue = properties.value || 0;

            // Creates control
            self.sliderIndicatorLabel = $('<label class="ui-bizagi-render-slider-indicator-label"></label>')
                .text($.bizAgiResources["bizagi-ui-render-slider-indicator-label"]);

            self.sliderIndicatorValue = $('<label class="ui-bizagi-render-slider-indicator-value"/>')
                .text(initialValue);

            self.sliderControl = $('<div class="ui-bizagi-render-slider-control" />');

            self.control
                .append(self.sliderIndicatorLabel)
                .append(self.sliderIndicatorValue)
                .append(self.sliderControl);

            // Apply slider plugin
            self.sliderControl.slider({
                min: min,
                max: max,
                step: step,
                slide: function (event, ui) {
                    $(".ui-bizagi-render-slider-indicator-value", self.control).text(ui.value);

                    // Changes internal value
                    self._setInternalValue(ui.value);
                }
            });

            // Set value
            self._setValue(initialValue);
        },

        /* Internally sets the value */
        _setValue: function (value) {
            // Call base
            $.ui.baseRender.prototype._setValue.apply(this, arguments);

            // Set value in control
            if (value && properties.editable) {
                var self = this;
                self.sliderControl.slider('option', 'value', value);
            }
        }
    });

})(jQuery);