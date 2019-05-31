/*
* jQuery BizAgi Render Association Widget 0.1 
* Copyright (c) http://www.bizagi.com
*
* Depends:
*	jquery.ui.core.js
*	jquery.ui.widget.js
*	jquery.ui.draggable.js
*	jquery.ui.droppable.js
*	jquery.metadata.js
*	bizagi.ui.render.base.js
*/
(function ($) {
    $.ui.baseRender.subclass('ui.associationRender', {
        /* Renders the control*/
        _render: function () {
            var self = this,
            properties = self.options.properties,
            control = self.control;

            // Just apply display-type: value, align it to the left
            self.changeLabelAlign("left");
            self.changeDisplayType("vertical");

            // Make control to behave as a block container
            self.control.addClass("ui-bizagi-render-display-block");

            // Create variables to access items from each side
            self.panels = new Object();
            self.items = new Object();
            self.flip = false;

            // Build controls
            self.associationControl = self._renderAssociationControl(self.flip);
            self.associationControl.appendTo(control);
        },

        /* Internally sets the value */
        _setValue: function (value) {
            var self = this,
                properties = self.options.properties;

            // Call base
            $.ui.baseRender.prototype._setValue.apply(this, arguments);

            // Set value in control
            if (value && properties.editable) {
                var self = this;

                // Clear items
                for (var key in self.panels) {
                    var panel = self.panels[key];
                    $("ul", panel).empty();
                }

                // Process actual values
                if (value) {
                    if (typeof (value) == "string") {
                        value = JSON.parse(value);
                    }

                    for (i = 0; i < value.length; i++) {
                        var left = !self.flip ? value[i].left : value[i].right;
                        var right = !self.flip ? value[i].right : value[i].left;

                        // Locate panel
                        var panel = self.panels[left];
                        var newItem = self._renderAssociationItem(right, self.items[right], false);
                        $("ul", panel).append(newItem);
                    }
                }
            }
        },

        /* Draws the control depending the flip value*/
        _renderAssociationControl: function (flip) {
            var self = this,
                properties = self.options.properties;

            // Get data
            var leftData = !flip ? properties.leftData : properties.rightData;
            var rightData = !flip ? properties.rightData : properties.leftData;
            var leftLabel = !flip ? properties.leftLabel : properties.rightLabel;
            var rightLabel = !flip ? properties.rightLabel : properties.leftLabel;

            // Reset hashtables
            self.panels = new Object();
            self.items = new Object();

            // Build panels
            var leftPanel = self._renderLeftPanel(leftData, leftLabel);
            var rightPanel = self._renderRightPanel(rightData, rightLabel);
            var flipButton = self._renderFlipButton();

            // Arrange elements
            return $('"<div class="ui-bizagi-render-association"></div>"')
                .append(leftPanel)
                .append(flipButton)
                .append(rightPanel);
        },

        /* Draws the left panel*/
        _renderLeftPanel: function (leftData, leftLabel) {
            var self = this,
                properties = self.options.properties;

            // Build left panel
            var leftPanel = $('<div class="ui-bizagi-render-association-left"></div>');
            leftPanel.append('<h3 class="ui-bizagi-render-association-label ui-widget-header">' + leftLabel + '</h3>');

            // Build accordeon
            var leftAccordeon = $('<div class="ui-bizagi-render-association-left-accordeon"></div>').appendTo(leftPanel);
            for (i = 0; i < leftData.length; i++) {
                leftAccordeon.append('<h3><a href="#">' + leftData[i].value + '</a></h3>');
                var itemDiv = $('<div />')
                    .appendTo(leftAccordeon);

                // Draw panel
                var itemPanel = $('<div class="ui-bizagi-render-association-left-panel"><ul/></div>')
                    .appendTo(itemDiv)
                    .data("id", leftData[i].id);

                // Add to hashtable
                self.panels[leftData[i].id] = itemPanel;

                // Attach droppable interface
                itemPanel.droppable({
                    drop: function (event, ui) {
                        var ul = $("ul", $(this));
                        var id = ui.draggable.data("id")

                        // Check duplicates
                        var bFound = false;
                        $("li", ul).each(function () {
                            if ($(this).data("id") == id) {
                                bFound = true;
                            }
                        });

                        if (!bFound) {
                            var item = self._renderAssociationItem(id, ui.draggable.text(), false);
                            item.appendTo(ul);

                            // Save value
                            self._serializeAssociationControl();
                        }
                    }
                });
            }

            // Attach plugin
            leftAccordeon.accordion({
                autoHeight: false
            });

            return leftPanel;
        },

        /* Draws the right panel */
        _renderRightPanel: function (rightData, rightLabel) {
            var self = this,
                properties = self.options.properties;

            // Build right panel
            var rightPanel = $('<div class="ui-bizagi-render-association-right"></div>');
            rightPanel.append('<h3 class="ui-bizagi-render-association-label ui-widget-header">' + rightLabel + '</h3>');

            // Build right content
            var rightContent = $('<div class="ui-bizagi-render-association-right-content ui-widget-content"></div>');
            var ul = $('<ul></ul>');
            for (i = 0; i < rightData.length; i++) {
                var item = self._renderAssociationItem(rightData[i].id, rightData[i].value, true);
                item.appendTo(ul);

                self.items[rightData[i].id] = rightData[i].value;
            }
            rightContent.append(ul);
            rightPanel.append(rightContent);

            return rightPanel;
        },

        /* Draws the flip button*/
        _renderFlipButton: function () {
            var self = this,
                properties = self.options.properties;

            // Build flip button
            var flipButton = $('<div class="ui-bizagi-render-association-flip"></div>');

            // Set flipButton event
            self.bFlipping = false;
            flipButton.click(function () {
                if (self.bFlipping) return;
                self.bFlipping = true;

                // Detach control
                self.associationControl.detach();

                // Reverse the flag
                self.flip = !self.flip;

                // Re-draw association control, but flipped
                self.associationControl = self._renderAssociationControl(self.flip);
                self.associationControl.appendTo(self.control);

                self._setValue(self._getValue());

                self.bFlipping = false;
            });

            return flipButton;
        },

        /* Renders a single association item*/
        _renderAssociationItem: function (id, text, draggable) {
            var self = this;

            var item = $('<li class="ui-bizagi-render-association-item ui-widget-content">' + text + '</li>')
                .data("id", id);

            if (draggable) {
                // Set draggable
                item.draggable({
                    appendTo: 'body',
                    helper: 'clone'
                });
            } else {
                // Draw close button
                var deleteButton = $('<span class="ui-bizagi-render-association-item-delete ui-icon ui-icon-close"></span>')
                .appendTo(item)
                .click(function () {
                    item.fadeOut(300, function () {
                        item.detach();

                        // Save value
                        self._serializeAssociationControl();
                    });
                });
            }

            // Process mouse
            item
            .mouseover(function () {
                item.addClass("ui-state-highlight");
                $(".ui-bizagi-render-association-item-delete", $(this)).css("display", "block");
            })
            .mouseout(function () {
                item.removeClass("ui-state-highlight");
                $(".ui-bizagi-render-association-item-delete", $(this)).css("display", "none");
            });

            return item;
        },

        /*
        *   Serializes into a json [{left:1,right:1}, {left:1,right:2}, {left:1,right:3}, {left:2,right:1}, {left:3,right:2}]
        */
        _serializeAssociationControl: function () {
            var self = this;
            var flip = self.flip;
            var value = [];
            $(".ui-bizagi-render-association-left-panel", self.associationControl).each(function (i) {
                var panel = $(this);
                var panelId = panel.data("id");

                $(".ui-bizagi-render-association-item", panel).each(function (i) {
                    var item = $(this);
                    var itemId = item.data("id");

                    if (!flip) {
                        value.push({ left: panelId, right: itemId });
                    } else {
                        value.push({ left: itemId, right: panelId });
                    }
                });
            });

            // Set value also in html dom
            self._setInternalValue(JSON.encode(value));
        }
    });

})(jQuery);