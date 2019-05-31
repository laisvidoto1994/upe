/*
* jQuery BizAgi Render Multi Search Widget 0.1 
* Copyright (c) http://www.bizagi.com
*
* Depends:
*	json2.js
*	jquery.ui.core.js
*	jquery.ui.widget.js
*	jquery.ui.autocomplete.js
*	jquery.ui.tokenlist.js
*	jquery.metadata.js
*	bizagi.ui.render.base.js
*	bizagi.ui.render.search.js
*/
(function ($) {

    $.ui.searchRender.subclass('ui.multisearchRender', {
        /* Renders the control*/
        _render: function () {
            var self = this,
            properties = self.options.properties,
            control = self.control;

            // Define control settings & defaults
            self.dataUrl = properties.dataUrl || DEFAULT_SEARCH_URL;

            // Set control container to behave as a block
            control.addClass("ui-bizagi-render-display-block");

            // Creates control
            self.input = $('<input class="ui-bizagi-render-search-multiple" type="text">')
                .appendTo(control);

            // Apply tokenList plugin
            self._applyTokenListPlugin(self.input);
        },

        /* Internally sets the value */
        _setValue: function (value) {
            var self = this,
                properties = self.options.properties;

            // Set value in control
            if (value && properties.editable) {
                var self = this;
                self.input.tokenlist("option", "items", value)
                self._setInternalValue(JSON.encode(value));
                self._setDisplayValue(value);
            }
        },

        /* Internally sets the value */
        _setInternalValue: function (value) {
            var self = this;

            // Call base
            $.ui.baseRender.prototype._setInternalValue.apply(this, arguments);

            // Decode json value to set display value
            var data = JSON.parse(value);
            var displayValues = [];
            for (i = 0; i < data.length; i++) {
                displayValues.push(data[i].text);
            }

            self._setDisplayValue("[" + displayValues.join(", ") + "]");
        },

        /* Apply tokenlist + autocomplete capabilities to a single input*/
        _applyTokenListPlugin: function (input) {
            var self = this,
            properties = self.options.properties;

            // Apply tokenlist
            input.tokenlist({
                items: properties.value,
                useAutocomplete: true,
                /* Validate function */
                validate: function (item) {
                    var data = $(self).data("suggestions");

                    // Verify current item belongs to data
                    if (data) {
                        var validData = [];
                        for (i = 0; i < data.length; i++) {
                            validData.push(data[i].id);
                        }

                        return $.inArray(item.id, validData) >= 0;
                    }
                    return false;
                },
                /* Control changing method*/
                change: function (e, items) {
                    // Build JSON array
                    var values = [];
                    for (i = 0; i < items.length; i++) {
                        values.push({ id: items[i].id, text: items[i].value });
                    }

                    // Set internal value
                    self._setInternalValue(JSON.encode(values));
                },
                /* Single item rendering method */
                renderTokenLabel: function (item) {
                    return item.value;
                },
                /* Method to check duplicates */
                isDuplicated: function (item, items) {
                    for (i = 0; i < items.length; i++) {
                        if (items[i].id == item.id)
                            return true;
                    }
                    return false;
                }
            })
            .each(function () {
                var tokenListInput = $(this).tokenlist('input');

                // Apply autocomplete for token
                self._applyAutocompletePlugin(tokenListInput);
            });
        },

        /* Returns the desired width for the suggestion menu*/
        _calculateSuggestionWidth: function () {
            var self = this;

            // Return full token list element width
            return $(".ui-tokenlist", self.element).width();
        },

        /* Set the value from the dialogs*/
        _setValueFromDialog: function (item) {
            var self = this;

            // Add value to token list
            self.input.tokenlist("add", [item], false, true);

            // Clear current value
            self.input.tokenlist('input').val("");
        }
    });

})(jQuery);