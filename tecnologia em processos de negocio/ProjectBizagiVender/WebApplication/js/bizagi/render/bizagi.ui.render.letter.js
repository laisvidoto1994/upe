/*
* jQuery BizAgi Render Letter Widget 0.1 
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
    var BIZAGI_LETTER_CONTENT_HANDLER = "ajax/AjaxLetterHandler.aspx";
    var BIZAGI_LETTER_PAGE = "misc/Letter.html";

    $.ui.baseRender.subclass('ui.letterRender', {
        /* Renders the control*/
        _render: function () {
            var self = this,
            properties = self.options.properties,
            control = self.control;

            // Define control settings & defaults
            self.url = properties.url || BIZAGI_LETTER_CONTENT_HANDLER;

            // Creates control
            self.button = $('<input class="ui-bizagi-render-button" type="button" />')
                .appendTo(control)
                .val($.bizAgiResources["bizagi-ui-render-letter-button"]);

            // Apply Button plugin
            self.button.button();

            // Bind click
            self.button.click(function () {
                self._showLetterPopup();
            });
        },

        /* Returns the visible value*/
        _getDisplayValue: function (value) {
            var self = this;

            return $.bizAgiResources["bizagi-ui-render-letter-display-value"];
        },

        /* Opens a popup with to show the letter content*/
        _showLetterPopup: function () {
            var self = this,
                properties = self.options.properties,
                doc = self.element.ownerDocument;

            var popupDialog = $('<div class="ui-bizagi-hidden" style="display:none"></div>')
            .appendTo("body", doc);

            popupDialog.load(BIZAGI_LETTER_PAGE, function () {
                if (self.saved == true) {
                    // Load from memory
                    self._setRTFContent(popupDialog, self.internalValue.val());

                } else {
                    // Load letter content from server
                    $.ajax({
                        url: urlMergeQueryString(self.url, "xpath=" + properties.xpath + "&idRender=" + properties.id),
                        dataType: $.bizAgiCommunication.dataType,
                        jsonp: $.bizAgiCommunication.jsonpParam,
                        success: function (data) {
                            self._setRTFContent(popupDialog, data.text);
                        },
                        error:function () {
                            self._setRTFContent(popupDialog, "");
                        }
                    });
                }
            });
        },

        /* Method that sets the content in the page*/
        _setRTFContent: function (popupDialog, data) {
            var self = this;
            var popupContainer = $(".ui-bizagi-container-letter", popupDialog);

            // Set rtf editor
            $("#ui-bizagi-rtfeditor").width(BIZAGI_RENDER_POPUP_WIDTH - 50);
            $("#ui-bizagi-rtfeditor").height(350);
            new nicEditor({
                iconsPath: 'css/other/images/nicEditorIcons.gif',
                fullPanel: true
            }).panelInstance('ui-bizagi-rtfeditor');

            // Set data
            nicEditors.findEditor("ui-bizagi-rtfeditor").setContent(data);

            // Do dialog
            popupContainer
            .width(BIZAGI_RENDER_POPUP_WIDTH - 100)
            .dialog({
                show: 'blind',
                width: BIZAGI_RENDER_POPUP_WIDTH,
                height: 550,
                title: 'Bizagi',
                modal: true,
                buttons: {
                    "Cerrar": function () {
                        popupContainer.dialog("close");
                    },
                    "Guardar": function () {
                        // Saves text
                        var html = nicEditors.findEditor("ui-bizagi-rtfeditor").getContent();
                        self._setInternalValue(html);
                        self.saved = true;
                        popupContainer.dialog("close");
                    }
                },
                close: function (ev, ui) {
                    popupContainer.dialog('destroy');
                    popupContainer.detach();
                }
            });
        }

    });

})(jQuery);