/*
* jQuery BizAgi Render Combo Widget 0.1 
* Copyright (c) http://www.bizagi.com
*
* Depends:
*	jquery.ui.core.js
*	jquery.ui.widget.js
*	jquery.ui.combobox.js
*	jquery.metadata.js
*	bizagi.ui.render.base.js
*/
(function ($) {

    var DEFAULT_COMBO_URL = "AjaxController.aspx";

    $.ui.baseRender.subclass('ui.comboRender', {
        /* Renders the control*/
        _render: function () {
            var self = this,
            properties = self.options.properties,
            control = self.control;

            // Define control settings & defaults
            self.hasLocalData = properties.data || false;
            self.dataUrl = properties.dataUrl || DEFAULT_COMBO_URL;
            self.filter = properties.filter ? "filter=" + properties.filter : null;

            // Creates control
            self.innerElement = self._buildElement().appendTo(control);

            // Fill items
            self.fillItems();

            // Fix style
            var comboButton = $("button", control);
            comboButton.addClass("ui-bizagi-render-combo-button");

            // Attach change event
            self.innerElement.bind("comboboxselected", function (event, ui) {
                // Updates internal value
                self._setInternalValue(ui.item.val());

                // Trigger event
                self._trigger("select", window.event, { id: ui.item.val(), value: ui.item.text() });
            });
        },

        /* Fill items no matter if it is local or remote*/
        fillItems: function (extraFilter) {
            var self = this,
            properties = self.options.properties;

            if (self.hasLocalData) {
                self._fillItemsLocal(properties.data);

            } else {
                var finalFilter;

                if (self.filter && !extraFilter) finalFilter = self.filter;
                else if (!self.filter && extraFilter) finalFilter = extraFilter;
                else if (self.filter && extraFilter) finalFilter = finalFilter = self.filter + "&" + extraFilter;

                // Fill items
                self._fillItemsFromAjax(urlMergeQueryString(self.dataUrl, "propertyName=data&xpath=" + properties.xpath + "&idRender=" + properties.id), finalFilter);
            }
        },

        cleanInput: function () {
            var self = this;

            // Clean input
            $(".ui-autocomplete-input", self.element).val("");
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
                self.innerElement.combobox("select", value);
            }
        },

        /* Returns the visible value*/
        _getDisplayValue: function (value) {
            var self = this;

            // The inner element is a Html SELECT
            return self.innerElement.options[self.innerElement.val()].text();
        },

        /* Apply a plugin to customize the element*/
        _applyElementPlugin: function () {
            var self = this;
            // Apply select plugin
            self.innerElement.combobox();
        },

        /* Build internal element to be wrapped*/
        _buildElement: function () {
            return $('<select></select>');
        },

        /* Fills the data from ajax*/
        _fillItemsFromAjax: function (url, filter) {
            var self = this;
            if (filter) {
                url = url + "&" + filter;
            }

            // Clean data
            self._cleanData();

            // Retrieve data
            $.ajax({
                url: url,
                dataType: $.bizAgiCommunication.dataType,
                jsonp: $.bizAgiCommunication.jsonpParam,
                success: function (data) {
                    if (!data) return;
                    for (i = 0; i < data.length; i++) {
                        self._addItem(data[i].id, data[i].value, self.innerElement);
                    }

                    // Execute success method
                    self._ajaxSuccess();
                }
            });
        },

        /* Executes after the itmes has been filled*/
        _ajaxSuccess: function () {
            var self = this;

            // Apply plugin
            if (self.pluginApplied) return;
            self._applyElementPlugin();
            self.pluginApplied = true;
        },

        /* Fills the data from local properties*/
        _fillItemsLocal: function (data) {
            var self = this;

            // Check data
            if (!data) return;

            // Clean data
            self._cleanData();

            // Build combo
            for (i = 0; i < data.length; i++) {
                self._addItem(data[i].id, data[i].value, self.innerElement);
            }

            // Apply plugin
            if (self.pluginApplied) return;
            self._applyElementPlugin();
            self.pluginApplied = true;
        },

        /* Clean the data*/
        _cleanData: function () {
            var self = this;
            self.innerElement.empty();
        },

        /* Adds an item to the render*/
        _addItem: function (id, value, control) {
            var self = this;
            var item = $('<option />')
                .attr("value", id)
                .text(value);

            // Append to combo
            control.append(item);
        }
    });

    $.extend($.ui.comboRender, {
        version: "@VERSION",
        eventPrefix: "comborender"
    });

})(jQuery);