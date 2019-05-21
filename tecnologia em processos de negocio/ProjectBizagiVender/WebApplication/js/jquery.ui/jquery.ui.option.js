/*
* jQuery UI Option @VERSION
* Author: Diego Parra
* Based on http://www.filamentgroup.com/lab/accessible_custom_designed_checkbox_radio_button_inputs_styled_css_jquery/ plugin
* Copyright (c) 2010 (http://www.bizagi.com)
*
* Depends:
*  ui.core.js
*/
(function ($) {

    $.widget('ui.optiongroup', {
        _create: function () {
            var self = this,
                    element = this.element,
                    options = self.options;

            // Find all inputs in this set 
            var allInputs = $('input[type=radio]', element);

            // Skin each element
            $("label", element).each(function (i) {
                // Get the associated label using the input's id
                var label = $(this);
                var text = label.text();
                var input = $("input[type=radio]", label);

                if (label.attr("for") != input.attr("id")) {
                    alert("label and input element are not related in label:" + label.attr("id"));
                    return;
                }

                // Wrap the input + label in a div 
                input.detach();
                label.wrap('<div class="ui-radio"></div>');
                input.insertBefore(label);
                label.text(text);

                // Necessary for browsers that don't support the :hover pseudo class on labels
                label.hover(
			        function () {
			            $(this).addClass('ui-radio-state-hover');
			        },
			        function () {
			            $(this).removeClass('ui-radio-state-hover');
			        }
		        );

                // Bind custom event, trigger it, bind click,focus,blur events					
                input.bind('update', function () {
                    if ($(this).is(':checked')) {
                        allInputs.each(function () {
                            // Remove class from each label
                            $(this).next().removeClass('ui-radio-state-checked');
                        });

                        label.addClass('ui-radio-state-checked');

                    } else {
                        label.removeClass('ui-radio-state-checked ui-radio-state-hover ui-radio-state-highlight');
                    }

                    if ($(this).is(':checked')) {
                        // Trigger change event
                        self._trigger("change", window.event, { value: $(this).val(), text: label.text() });
                    }
                })
		        .trigger('update')
		        .click(function () {
		            $(this).trigger('update');
		        })
		        .focus(function () {
		            label.addClass('ui-radio-state-highlight');
		        })
		        .blur(function () {
		            label.removeClass('ui-radio-state-highlight');
		        });
            });
        }
    });

    $.extend($.ui.optionGroup, {
        version: "@VERSION",
        eventPrefix: "optiongroup"
    });

})(jQuery);