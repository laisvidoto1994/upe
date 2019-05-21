/*
* jQuery BizAgi Render List Widget 0.1 
* Copyright (c) http://www.bizagi.com
*
* Depends:
*	jquery.ui.core.js
*	jquery.ui.widget.js
*	jquery.ui.selectable.js
*	jquery.ui.combobox.js
*	jquery.metadata.js
*	bizagi.ui.render.base.js
*	bizagi.ui.render.combo.js
*/
(function ($) {

    $.ui.comboRender.subclass('ui.listRender', {
        /* Renders the control*/
        _render: function () {
            var self = this,
            properties = self.options.properties,
            control = self.control;

            // Set control container to behave as a block
            control
                .addClass("ui-bizagi-render-display-block")
                .addClass("ui-bizagi-render-list-container");

            // Render combo normally
            $.ui.comboRender.prototype._render.apply(this, arguments);
        },
        
        /* Build internal element to be wrapped*/
        _buildElement: function () {
            return $('<ul class="ui-bizagi-render-list"></ul>');
        },
         
        /* Adds an item to the render*/
        _addItem: function (id, value, control) {
            var self = this;
            var item = $('<li />')
                .attr("value", id)
                .text(value);

            // Append to combo
            control.append(item);
        },
        
        /* Apply a plugin to customize the element*/ 
        _applyElementPlugin: function(){
            var self = this;
            // Apply select plugin
            self.innerElement.selectable({
                change: function (event, ui) {
                    self._setInternalValue(ui.selection[0].value);
                    self._setDisplayValue(ui.selection[0].text);
                }
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