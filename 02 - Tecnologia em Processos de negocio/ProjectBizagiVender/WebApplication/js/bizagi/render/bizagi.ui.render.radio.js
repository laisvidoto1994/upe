/*
* jQuery BizAgi Render Radio Widget 0.1 
* Copyright (c) http://www.bizagi.com
*
* Depends:
*	jquery.ui.core.js
*	jquery.ui.widget.js
*	jquery.ui.combobox.js
*	jquery.ui.option.js
*	jquery.metadata.js
*	bizagi.ui.render.base.js
*	bizagi.ui.render.combo.js
*/
(function ($) {

    $.ui.comboRender.subclass('ui.radioRender', {
        /* Renders the control*/
        _render: function () {
            var self = this,
            properties = self.options.properties,
            control = self.control;

            // Set control container to behave as a block
            control
                .addClass("ui-bizagi-render-display-block")
                .addClass("ui-bizagi-render-radio-container");

            // Render combo normally
            $.ui.comboRender.prototype._render.apply(this, arguments);
        },

        /* Build internal element to be wrapped*/
        _buildElement: function () {
            return $('<span class="ui-bizagi-render-radio"></span>');
        },

        /* Adds an item to the render*/
        _addItem: function (id, value, control) {
            var self = this,
            properties = self.options.properties;

            // Create controls
            var radioName = "radio-" + properties.xpath;
            var radioId = radioName + "-" + id;
            var radioItem = $('<span class="ui-bizagi-render-radio-item"></span>');
            var radio = $('<label for="' + radioId + '" ><input name="' + radioName + '" id="' + radioId + '" type="radio" value="' + id + '">' + value + '</label>');

            // Add to container
            radioItem.append(radio);
            control.append(radioItem);
        },

        /* Apply a plugin to customize the element*/
        _applyElementPlugin: function () {
            var self = this;
            
            // Apply optiongroup plugin
            self.innerElement.optiongroup();

            // Bind change event
            self.innerElement.bind("optiongroupchange", function (evt, ui) {
                self._setInternalValue(ui.value);
                self._setInternalValue(ui.text);
            });
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