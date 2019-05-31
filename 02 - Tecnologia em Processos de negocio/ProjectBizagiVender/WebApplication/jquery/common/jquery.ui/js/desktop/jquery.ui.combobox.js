/*
* Code from jquery ui autocomplete page
*/
(function ($) {
    $.widget("ui.combobox", {
        _create: function () {
            var self = this;
            var select = this.element.hide();
            var input = $("<input>")
					.insertAfter(select)
					.autocomplete({
					    source: function (request, response) {
					        var matcher = new RegExp(request.term, "i");
					        response(select.children("option").map(function () {
					            var text = $(this).text();
					            if (this.value && (!request.term || matcher.test(text)))
					                var label = text;
					            if (request.term.length > 0) {
					                text.replace(new RegExp("(?![^&;]+;)(?!<[^<>]*)(" + $.ui.autocomplete.escapeRegex(request.term) + ")(?![^<>]*>)(?![^&;]+;)", "gi"), "<strong>$1</strong>");
					            }
					            return {
					                id: this.value,
					                label: label,
					                value: text
					            };
					        }));
					    },
					    delay: 0,
					    change: autocompletechange,
					    select: autocompletechange,
					    minLength: 0
					})
					.addClass("ui-widget ui-widget-content ui-corner-left");

            self.input = input;

            $("<button type=\"button\">&nbsp;</button>")
				.attr("tabIndex", -1)
				.attr("title", "Show All Items")
				.insertAfter(input)
				.button({
				    icons: {
				        primary: "ui-icon-triangle-1-s"
				    },
				    text: false
				}).removeClass("ui-corner-all")
				.addClass("ui-corner-right ui-button-icon")
                .click(function () {
                    // close if already visible
                    if (input.autocomplete("widget").is(":visible")) {
                        input.autocomplete("close");
                        return false;
                    }
                    // pass empty string as value to search for, displaying all results
                    input.width(input.width() + $(this).width());
                    input.autocomplete("search", "");
                    input.width(input.width() - $(this).width());
                    input.focus();

                    return false;
                });

            input.next("button").children("span").last().removeClass("ui-button-text");

            // Bind blur event
            input.change(function () {
                var bValid = false;
                // Validates input
                $("option", select).each(function (i) {
                    if ($(this).text() == input.val())
                        bValid = true;
                });

                if (!bValid) {
                    // Clears input
                    input.val("");
                }
            });

            function autocompletechange(event, ui) {
                if (!ui.item) {
                    // remove invalid value, as it didn't match anything
                    $(this).val("");
                    return false;
                }
                select.val(ui.item.id);
                self._trigger("selected", event, {
                    item: select.find("[value='" + ui.item.id + "']")
                });
            }
        },

        select: function (value) {
            var self = this;
            var select = this.element;

            select.val(value);

            // Validates input
            $("option", select).each(function (i) {
                if ($(this).val() == value)
                    self.input.val($(this).text());
            });
        }
    });

})(jQuery);
