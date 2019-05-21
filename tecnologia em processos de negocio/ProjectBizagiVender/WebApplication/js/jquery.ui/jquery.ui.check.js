/*
* jQuery UI Check @VERSION
* Author: Diego Parra
* Based on http://www.filamentgroup.com/lab/accessible_custom_designed_checkbox_radio_button_inputs_styled_css_jquery/ plugin
* Copyright (c) 2010 (http://www.bizagi.com)
*
* Depends:
*  ui.core.js
*/
(function ($) {

    $.widget('ui.check', {
        _create: function () {
            var self = this,
                    element = this.element,
                    options = self.options;

            // Get the associated label using the input's id
            var label = this.element;
            var input = self.input = $("input[type=checkbox]", label);

            if (label.attr("for") != input.attr("id")) {
                alert("label and input element are not related in label:" + label.attr("id"));
                return;
            }

            // Wrap the input + label in a div 
            input.detach();
            label.wrap('<div class="ui-checkbox"></div>');
            input.insertBefore(label);

            // Necessary for browsers that don't support the :hover pseudo class on labels
            label.hover(
			        function () {
			            $(this).addClass('ui-checkbox-state-hover');
			            if (input.is(':checked')) {
			                $(this).addClass('ui-checkbox-state-checked');
			            }
			        },
			        function () {
			            $(this).removeClass('ui-checkbox-state-hover');
			        }
		        );

            // Bind custom event, trigger it, bind click,focus,blur events					
            input.bind('update', function () {
                if (input.is(':checked')) {
                    label.addClass('ui-checkbox-state-checked');
                } else {
                    label.removeClass('ui-checkbox-state-checked ui-checkbox-state-hover ui-checkbox-state-highlight');
                }

                // Trigger change event
                self._trigger("change", window.event, { value: input.is(':checked') });
            })
		    .trigger('update')
		    .click(function () {
		        $(this).trigger('update');
		    })
		    .focus(function () {
		        label.addClass('ui-checkbox-state-highlight');
		        if (input.is(':checked')) {
		            $(this).addClass('ui-checkbox-state-highlight');
		        }
		    })
		    .blur(function () {
		        label.removeClass('ui-checkbox-state-highlight');
		    });
        },

		checkItem: function () {
            var self = this;
            self.input.attr("checked", true);
            self.input.trigger('update');
        },

        uncheckItem: function () {
            var self = this;
            self.input.attr("checked", false);
            self.input.trigger('update');
        }
    });

    $.extend($.ui.check, {
        version: "@VERSION",
        eventPrefix: "check"
    });

})(jQuery);