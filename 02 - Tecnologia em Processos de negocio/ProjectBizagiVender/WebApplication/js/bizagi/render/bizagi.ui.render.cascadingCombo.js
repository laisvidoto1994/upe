/*
* jQuery BizAgi Render Cascading Combo Widget 0.1 
* Copyright (c) http://www.bizagi.com
*
* Depends:
*	jquery.ui.core.js
*	jquery.ui.widget.js
*	jquery.ui.combobox.js
*	jquery.metadata.js
*	bizagi.ui.render.base.js
*	bizagi.ui.render.combo.js
*/
(function ($) {

    $.ui.comboRender.subclass('ui.cascadingComboRender', {
        /* Renders the control*/
        _render: function () {
            var self = this,
            properties = self.options.properties,
            control = self.control;

            // Render combo normally
            $.ui.comboRender.prototype._render.apply(this, arguments);

            // Apply plugin (because it just execute when the combo has items)
            if (!self.pluginApplied) {
                self._applyElementPlugin();
                self.pluginApplied = true;
            }

            // Select next combo
            var nextRender = self.element.next();

            // Check it exists
            if (nextRender && nextRender.length > 0) {
                // Extract metadata
                nextRender.properties = nextRender.metadata({ type: 'attr', name: 'properties', single: 'bizagi' });

                // Check it is a cascading combo
                if (nextRender.properties.type == "cascadingCombo" && nextRender.properties.xpath == properties.xpath) {

                    // Change internal id & name, because this is not the last combo
                    self.internalValue.attr("id", "");
                    self.internalValue.attr("name", "");

                    // When this combo is selected we need to make the other combo to auto fill with an extra filter
                    self.element.bind(self.widgetName.toLowerCase() + "select", function (event, item) {
                        nextRender.cascadingComboRender("fillItems", "parent=" + item.id);

                        // Clear next input
                        nextRender.cascadingComboRender("cleanInput");
                    });
                }
            }
        }
    });

})(jQuery);