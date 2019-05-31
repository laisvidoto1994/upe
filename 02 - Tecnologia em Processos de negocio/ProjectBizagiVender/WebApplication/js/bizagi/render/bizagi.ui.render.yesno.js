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
    $.ui.baseRender.subclass('ui.yesNoRender', {
        /* Renders the control*/
        _render: function () {
            var self = this,
            properties = self.options.properties,
            control = self.control;

            // Set control container to behave as a block
            control.addClass("ui-bizagi-render-display-block");
            control.addClass("ui-bizagi-render-boolean-yesno");

            // Define control settings & defaults
            var initialValue = typeof (properties.value) == "undefined" ? properties.value : null;

            // Creates control
            var rnd = (new Date).getTime();
            self.yesInput = $('<label for="radio' + rnd + 'yes" ><input name="radio' + rnd + '" class="ui-bizagi-render-boolean-radio" type="radio" id="radio' + rnd + 'yes" value=true /></label>')
                .append($.bizAgiResources["bizagi-ui-render-boolean-yesno-yes"])
                .appendTo(control);

            self.noInput = $('<label for="radio' + rnd + 'no" ><input name="radio' + rnd + '" class="ui-bizagi-render-boolean-radio" type="radio" id="radio' + rnd + 'no" value=false /></label>')
                .append($.bizAgiResources["bizagi-ui-render-boolean-yesno-no"])
                .appendTo(control);

            // Apply check plugin
            control.optiongroup();

            // Set value
            self._setValue(initialValue);

            // Bind change event
            control.bind("optiongroupchange", function (evt, ui) {
                self._setInternalValue(ui.value);
                self._setDisplayValue(ui.text);
            });
        },

        /* Internally sets the value */
        _setValue: function (value) {
            var self = this,
                properties = self.options.properties;

            // Call base
            $.ui.baseRender.prototype._setValue.apply(this, arguments);

            // Set value in control
            if (value != null && properties.editable) {
                var self = this;
                if (value == true) {
                    self.yesInput.attr("checked", true);
                    self.noInput.attr("checked", false);
                    self._setDisplayValue($.bizAgiResources["bizagi-ui-render-boolean-yesno-yes"]);
                } else if (value == true) {
                    self.noInput.attr("checked", true);
                    self.yesInput.attr("checked", false);
                    self._setDisplayValue($.bizAgiResources["bizagi-ui-render-boolean-yesno-no"]);
                }
            }
        },

        /* Internally sets the display value */
        _setDisplayValue: function (value) {
            var self = this;
            $(self).data("displayValue", value);
        },
        /* Internally gets the display value */
        _getDisplayValue: function () {
            var self = this;
            return $(self).data("displayValue");
        }
    });

})(jQuery);