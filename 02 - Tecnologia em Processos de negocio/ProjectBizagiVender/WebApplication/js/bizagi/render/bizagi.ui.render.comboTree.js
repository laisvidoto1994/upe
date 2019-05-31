/*
* jQuery BizAgi Search Tree Widget 0.1 
* Copyright (c) http://www.bizagi.com
*
* Depends:
*	jquery.ui.core.js
*	jquery.ui.widget.js
*	jquery.ui.autocomplete.js
*	jquery.metadata.js
*	bizagi.ui.render.base.js
*	bizagi.ui.render.search.js
*/
(function ($) {

    $.ui.comboRender.subclass('ui.combotreeRender', {
        /* Renders the control*/
        _render: function () {
            var self = this,
            properties = self.options.properties,
            control = self.control;

            // Define control settings & defaults
            self.dataUrl = properties.dataUrl || DEFAULT_TREE_URL;
            self.filter = properties.filter ? "filter=" + properties.filter : null;
            if (properties.xpath)
                self.dataUrl = urlMergeQueryString(self.dataUrl, "xpath=" + properties.xpath);

            // Set control container to behave as a block
            control.addClass("ui-bizagi-render-display-block");

            // Creates control
            self._createCombo();

            // If there are no more data, the last value selected is the current value in the widget
            self.element.bind((self.widgetEventPrefix + "selected").toLowerCase(), function (e, ui) {
                // Updates internal value
                self._setInternalValue(JSON.encode(ui));

                // Trigger event
                self._trigger("select", window.event, ui);
            });
        },

        /* Internally sets the value */
        _setValue: function (value) {
            var self = this,
                control = self.control,
                properties = self.options.properties;

            // Call base
            self._setInternalValue(JSON.encode(value));

            // Set value in control
            if (value && properties.editable) {
                var self = this;

                // Verify paths to expand automatically
                var paths = (value.path + "").split(".");
                if (paths.length > 1) {
                    // Clear all combos
                    $(" .ui-bizagi-render-combo-tree", control).detach();

                    // Start loop
                    self._expandCombo(0, paths);
                }
            }
        },

        /* Helper function to expand combos in order to set the value*/
        _expandCombo: function (pathIndex, paths, parent) {
            var self = this;

            // Exit condition
            if (pathIndex >= paths.length) return;

            // Create combo
            if (pathIndex == 0) {
                combo = self._createCombo();
            } else {
                combo = self._createCombo(parent.id, parent.text, parent.path);
            }

            // Asynch check
            setTimeout(function () { self._tryExpandCombo(pathIndex, paths, combo, 0); }, 250);
        },

        _tryExpandCombo: function (pathIndex, paths, combo, attemptCount) {
            var self = this;
            // Check attempt count
            if (attemptCount == 20) return;
            attemptCount++;

            // Check if the combo has been filled
            if (combo[0].options.length == 0) {
                setTimeout(function () { self._tryExpandCombo(combo, attemptCount); }, 250);

            } else {
                // Locate element
                var option;
                for (var k = 0; k < combo[0].options.length; k++) {
                    if (combo[0].options[k].value == paths[pathIndex]) {
                        option = combo[0].options[k];
                        break;
                    }
                }

                // Check if the option has been found
                if (!option) return;

                parentId = $(option).val();
                parentDisplayValue = $(option).text();
                parentPath = $(option).attr("path");

                // Select element
                $(combo).combobox("select", parentId);

                // Expand combo
                self._expandCombo(pathIndex + 1, paths, { id: parentId, text: parentDisplayValue, path: parentPath });
            }

        },

        /* Creates each combo */
        _createCombo: function (parentId, parentDisplayValue, parentPath) {
            var self = this,
                control = self.control;

            // Creates control
            var comboWrapper = $('<div class="ui-bizagi-render-combo-tree" />').appendTo(control);
            var combo = self._buildElement().appendTo(comboWrapper);

            // Fill items
            var path = parentPath ? parentPath : null;
            var parent = { id: parentId, text: parentDisplayValue, path: path };
            self.fillComboData(combo, parent);

            // Apply select plugin
            combo.combobox();

            // Fix style
            var comboButton = $("button", control);
            comboButton.addClass("ui-bizagi-render-combo-button");

            // Attach change event
            combo.bind("comboboxselected", function (event, ui) {
                // Clear next combos
                comboWrapper.nextAll().detach();

                // Trigger internal event
                var selectedElement = { id: ui.item.val(), text: ui.item.text(), path: ui.item.attr("path") };
                self._trigger("selected", null, selectedElement);

                // Creates next combo
                self._createCombo(selectedElement.id, selectedElement.text, selectedElement.path);
            });

            return combo;
        },

        /* Fills the combo data */
        fillComboData: function (combo, parent) {
            var self = this;
            self._getChildData(parent.id, function (data) {
                if (!data || data.length == 0) {
                    combo.parent().detach();
                    return;
                }

                // Else fill combo data
                for (var i = 0; i < data.length; i++) {
                    var path = parent.path ? parent.path + "." + data[i].id : data[i].id;
                    self._addItem(data[i].id, data[i].value, path, combo);
                }

                return;
            });
        },

        /* Adds an item to the render*/
        _addItem: function (id, value, path, control) {
            var self = this;
            var item = $('<option />')
                .attr("value", id)
                .attr("id", id)
                .attr("path", path)
                .text(value);

            // Append to combo
            control.append(item);
        },

        /* Get the data for the children*/
        _getChildData: function (parent, callback) {
            var self = this;
            var url = self.dataUrl;
            if (self.filter) {
                url = urlMergeQueryString(url, "&" + self.filter);
            }
            if (parent) {
                url = urlMergeQueryString(url, "parent=" + parent);
            }

            // Retrieve data
            $.ajax({
                url: url,
                dataType: $.bizAgiCommunication.dataType,
                jsonp: $.bizAgiCommunication.jsonpParam,
                success: function (data) {
                    callback(data);
                }
            });
        }
    });

})(jQuery);