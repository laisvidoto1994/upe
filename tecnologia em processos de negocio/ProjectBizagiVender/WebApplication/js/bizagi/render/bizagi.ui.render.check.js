/*
* jQuery BizAgi Render Check Widget 0.1 
* Copyright (c) http://www.bizagi.com
*
* Depends:
*	jquery.ui.core.js
*	jquery.ui.widget.js
*	jquery.metadata.js
*	bizagi.ui.render.base.js
*/
(function ($) {
    $.ui.baseRender.subclass('ui.checkRender', {
        /* Renders the control*/
        _render: function () {
            var self = this,
            properties = self.options.properties,
            control = self.control;

            // Set control container to behave as a block
            control.addClass("ui-bizagi-render-display-block");
            control.addClass("ui-bizagi-render-boolean-check");

            // Define control settings & defaults
            var initialValue = typeof (properties.value) == "undefined" ? properties.value : false;

            // Creates control
            var rnd = (new Date).getTime();
            self.input = $('<label for="check' + rnd + '" ><input class="ui-bizagi-render-boolean-check" type="checkbox" id="check' + rnd + '"/></label>')
                .appendTo(control);

            // Apply check plugin
            self.input.check();
            
            // Set value
            self._setValue(initialValue);

            // Bind change event
            self.input.bind("checkchange", function (evt, ui) {
                self._setInternalValue(ui.value);
            });
        },

        /* Internally sets the value */
        _setValue: function (value) {
            var self = this,
                properties = self.options.properties;

            // Call base
            $.ui.baseRender.prototype._setValue.apply(this, arguments);

            // Set value in control
            if (properties.editable) {
                var self = this;
                if (value) {
                    self.input.check("checkItem");
                } else {
                    self.input.check("uncheckItem");
                }                
            }
        },

        /* Returns the visible value*/
        _getDisplayValue: function (value) {
            var self = this;

            var value = self._getValue();
            if (value == true) {
                return $.bizAgiResources["bizagi-ui-render-boolean-yesno-yes"];
            }
            else {
                return $.bizAgiResources["bizagi-ui-render-boolean-yesno-no"];
            }
        }
    });

})(jQuery);