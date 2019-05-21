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
                (self.options.orientation == "rtl") ? label.wrap('<div class="ui-radio ui-bizagi-rtl"></div>') : label.wrap('<div class="ui-radio"></div>');
                // Wrap the input + label in a div 
                (self.options.orientation == "rtl") ? input.insertAfter(label) : input.insertBefore(label);
                label.text(text);

                // Necessary for browsers that don't support the :hover pseudo class on labels
                label.hover(
			        function () {
			            $(this).addClass('ui-radio-state-hover');
			        },
			        function () {
			            $(this).removeClass('ui-radio-state-hover');
			        }
		        ).click(function(){
		            var checked = input.prop("checked");
		            input.prop("checked", !checked);
		            !checked ? input.attr("checked", "checked") : input.removeAttr("checked");
		            // Alignment fix on Click
		            if (bizagi.util.isIE()) window.setTimeout(function () {
		                label.css("display", "inline-block");
		                $(".ui-bizagi-rtl table .ui-bizagi-render-boolean-yesno .ui-radio input").css("height", "1px");
		            }, 0);
		        });

                // Bind custom event, trigger it, bind click,focus,blur events					
                input.bind('update', function () {
                    if ($(this).is(':checked')) {
                        allInputs.each(function () {
                            // Remove class from each label
                            var next = (self.options.orientation == "rtl") ? $(this).prev() : $(this).next();
                            next.removeClass('ui-radio-state-checked');
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
		            // Alignment fix on Click
		            if (bizagi.util.isIE()) window.setTimeout(function () {
		                label.css("display", "inline-block");
		                $(".ui-bizagi-rtl table .ui-bizagi-render-boolean-yesno .ui-radio input").css("height", "1px");
		            }, 0);
		        })
		        .focus(function () {
		            label.addClass('ui-radio-state-highlight');
		        })
		        .blur(function () {
		            label.removeClass('ui-radio-state-highlight');
		        });
            });
        },

        setValue: function (value) {
            var self = this,
                    element = this.element,
                    options = self.options;

            // Find all inputs in this set 
            var allInputs = $('input[type=radio]', element);

            $.each(allInputs, function (i) {
                var option = $(this);
                if (option.val() == value) {
                    option.prop("checked", true);
                    option.attr("checked", "checked");
                    option.trigger("update");
                }
            });
        }
    });

    $.extend($.ui.optionGroup, {
        version: "@VERSION",
        eventPrefix: "optiongroup"
    });

})(jQuery);