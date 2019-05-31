/*
* jQuery BizAgi Render Rich Text Widget 0.1 
* Copyright (c) http://www.bizagi.com
*
* Depends:
*	jquery.ui.core.js
*	jquery.ui.widget.js
*	jquery.ui.button.js
*	jquery.ui.dialog.js
*	jquery.metadata.js
*	bizagi.ui.render.base.js
*	nicEdit.js
*/
(function ($) {
    var BIZAGI_RENDER_RTF_HEIGHT = 100;

    $.ui.baseRender.subclass('ui.richTextRender', {
        /* Renders the control*/
        _render: function () {
            var self = this,
            properties = self.options.properties,
            control = self.control;

            // Set control container to behave as a block
            control.addClass("ui-bizagi-render-display-block");

            // Creates control
            var elementId = "ui-bizagi-rtf-" + properties.xpath;
            self.textarea = $('<textarea class="ui-bizagi-render-richText" ></textarea>')
                .attr("id", elementId)
                .appendTo(control);

            // Apply plugin
            self.textarea.height(BIZAGI_RENDER_RTF_HEIGHT);
            var rtfEditor = new nicEditor({
                iconsPath: 'css/other/images/nicEditorIcons.gif',
                fullPanel: true
            }).panelInstance(elementId);

            // Fix widths
            $(">div", control).width("100%");
            control.mouseover(function () {
                $("div.nicEdit-main", control).width($(">div", control).first().width() - 25);
            });

            // Hide/Show toolbar
            $(".nicEdit-panel", control).hide();
            rtfEditor.addEvent('focus', function () {
                $(".nicEdit-panel", control).fadeIn();
            });
            rtfEditor.addEvent('blur', function () {
                $(".nicEdit-panel", control).fadeOut();

                // Update value
                self._setInternalValue(nicEditors.findEditor(elementId).getContent());
            });
        },

        /* Internally sets the value */
        _setValue: function (value) {
            var self = this,
                properties = self.options.properties;

            // Call base
            $.ui.baseRender.prototype._setValue.apply(this, arguments);

            // Set value in input
            if (value && properties.editable) {
                var self = this;
                var properties = self.options.properties;
                var elementId = "ui-bizagi-rtf-" + properties.xpath;
                nicEditors.findEditor(elementId).setContent(value);
            }
        },
        
         /* Returns the visible value*/
        _getDisplayValue: function (value) {
            var self = this;

            return $.bizAgiResources["bizagi-ui-render-rtf-display-value"];
        }

    });

})(jQuery);