/*
* jQuery BizAgi Render Date Widget 0.1
* Copyright (c) http://www.bizagi.com
*
* Depends:
*	jquery.ui.core.js
*	jquery.ui.widget.js
*	jquery.ui.datepicker.js
*	jquery.ui.mask.js
*	jquery.metadata.js
*	jquery.timeentry.js
*	bizagi.ui.render.base.js
*/
(function ($) {
    $.ui.baseRender.subclass('ui.dateRender', {
        /* Renders the control*/
        _render: function () {
            var self = this,
            properties = self.options.properties,
            control = self.control;

            // Define control settings & defaults
            self.showTime = properties.showTime || false;
            self.mask = properties.mask || '##/##/####';
            self.dateFormat = properties.dateFormat || BA_DEFAULT_DATE_FORMAT;
            self.fullFormat = self.dateFormat;
            if (self.showTime) {
                self.fullFormat = self.fullFormat + ' ' + BA_DEFAULT_TIME_FORMAT;
            }

            // Fix dateFormat for datepicker
            self.dateFormat = self.dateFormat.replaceAll("M", "m"); // Fix months
            self.dateFormat = self.dateFormat.replaceAll("yyyy", "yy"); // Fix years

            // Creates control
            self.dateInput = $('<input type="text" class="ui-bizagi-render-date"/>')
                .appendTo(control);

            // Draw time control
            if (self.showTime) {
                self.timeInput = $('<input type="text" class="ui-bizagi-render-time"/>')
                    .appendTo(control);
            }

            // Set value
            self._setValue(properties.value);

            // Apply datepicker & mask plugin
            self.dateInput.datepicker({
                dateFormat: self.dateFormat
            });

            // Set min & max value
            self.changeMinValue(properties.minValue);
            self.changeMaxValue(properties.maxValue);

            // Set mask
            self.dateInput.mask({ mask: self.mask });

            // Apply timeEntry plugin
            if (self.showTime) {
                self.timeInput.timeEntry({
                    spinnerImage: "css/other/images/timerEntrySpinner.png"
                });
            }

            // Attach change event
            self.dateInput.bind("change", onChangeHandler);
            if (self.showTime) {
                self.timeInput.bind("change", onChangeHandler);
            }

            /* Formats the date time value to the hidden control*/
            function onChangeHandler() {
                var currentDate = getDateFromFormat(self.dateInput.val(), self.fullFormat);
                if (!currentDate || currentDate == 0)
                    return;
                
                if (self.showTime) {
                    var currentTime = self.timeInput.timeEntry('getTime');

                    // Merge
                    if (currentTime) {
                        currentDate.setHours(currentTime.getHours());
                        currentDate.setMinutes(currentTime.getMinutes());
                        currentDate.setSeconds(currentTime.getSeconds());
                    }
                }

                // Set formatted value
                self._setInternalValue(formatDate(currentDate, self.fullFormat));
            }
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
                self.dateInput.datepicker("setDate", getDateFromFormat(value, self.fullFormat));

                if (self.showTime) {
                    self.timeInput.timeEntry("setTime", getDateFromFormat(value, self.fullFormat));
                }
            }
        },

        /* Changes the render min value*/
        changeMinValue: function (value) {
            var self = this,
                properties = self.options.properties;

            // Set value in control
            if (value && properties.editable) {
                var self = this;
                properties.minValue = value;
                self.dateInput.datepicker("option", "minDate", getDateFromFormat(value, self.fullFormat));
            }
        },

        /* Changes the render max value*/
        changeMaxValue: function (value) {
            var self = this,
                properties = self.options.properties;

            // Set value in control
            if (value && properties.editable) {
                var self = this;
                properties.maxValue = value;
                self.dateInput.datepicker("option", "maxDate", getDateFromFormat(value, self.fullFormat));
            }
        }
    });

})(jQuery);