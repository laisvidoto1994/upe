/*
*   Name: BizAgi Render Date Class
*   Author: Diego Parra
*   Comments:
*   -   This script will define basic stuff for date renders
*/

bizagi.rendering.render.extend("bizagi.rendering.date", {}, {

    /*
    *   Update or init the element data
    */
    initializeData: function (data) {
        var self = this;
        // Call base
        this._super(data);

        // Fill default properties
        var properties = this.properties;
        var dateFormat = this.getResource("dateFormat");
        var timeFormat = this.getResource("timeFormat");

        // We will hold here the value to display
        properties.displayValue = "";
        properties.showTime = properties.showTime !== undefined ? bizagi.util.parseBoolean(properties.showTime) : false;
        properties.dateFormat = properties.dateFormat || dateFormat;
        properties.timeFormat = properties.timeFormat || timeFormat;
        properties.fullFormat = properties.dateFormat;

        // Check if it has the showtime property
        if (properties.showTime) {
            if (properties.fullFormat.search(/[h|H]+/ig) === -1) {
                properties.fullFormat = properties.fullFormat + ' ' + properties.timeFormat;
            }
        }

        // Read always parameter from server in invariant format
        if (properties.value) {

            var date = bizagi.util.dateFormatter.getDateFromInvariant(properties.value, properties.showTime);
            // Format date to current format
            if (date != 0) {
                // Value must always hold the value with invariant format
                self.value = properties.value;
                var datePickerRegional = bizagi.localization.getResource("datePickerRegional");
                properties.displayValue = bizagi.util.dateFormatter.formatDate(date, properties.fullFormat, datePickerRegional);
            } else {
                self.value = null;
            }
        }
    },

    /*
    *   Template method to implement in each children to customize each control
    */
    renderControl: function () {
        var self = this;
        var properties = self.properties;
        var template = self.renderFactory.getTemplate("date");
        var indexDateTimeSeparation = properties.dateFormat.substring(0, properties.dateFormat.indexOf(":")).lastIndexOf(" ");
        // Render template
        var html = $.fasttmpl(template, {
            showTime: properties.showTime,
            value: properties.value,
            dateFormat: (indexDateTimeSeparation > 0) ? properties.dateFormat.substring(0, indexDateTimeSeparation) : properties.dateFormat,
            timeFormat: (properties.showTime && indexDateTimeSeparation > 0) ? properties.dateFormat.substring(indexDateTimeSeparation) : "",
            rtl: (properties.orientation == "rtl")
        });
        return html;
    },

    /*
    *   Template method to implement in each device to customize the render's behaviour to add handlers
    */
    configureHandlers: function () {
        var self = this;
        var properties = self.properties;

        // Set control references
        var dateControl = self.getDateControl();
        var timeControl = self.getTimeControl();

        // Set mask
        if (properties.mask) {
            dateControl.mask({
                mask: properties.mask
            });
        }

        // Attach change event
        dateControl.bind("change", function () {
            self.onChangeHandler();
        });
        if (properties.showTime) {
            timeControl.bind("change", function () {
                self.onChangeHandler();
            });
        }
    },

    /* 
    *   Formats the date time value to the hidden control
    */
    onChangeHandler: function () {
    },

    getDisplayValue: function (value) {
        var self = this;
        var properties = self.properties;
        var displayValue;

        if (!properties.displayValue && value) {
            var date = bizagi.util.dateFormatter.getDateFromInvariant(value, properties.showTime);
            var datePickerRegional = bizagi.localization.getResource("datePickerRegional");
            displayValue = bizagi.util.dateFormatter.formatDate(date, properties.fullFormat, datePickerRegional);
        } else {
            displayValue = "";
        }

        // We can return the display value isntance
        return properties.displayValue || displayValue || "";
    },

    /*
    *   Add the render data to the given collection in order to send data to the server
    */
    collectData: function (renderValues) {
        var self = this;
        var properties = self.properties;

        // Add the render value
        var xpath = properties.xpath;
        var value = self.getValue();

        if (self.controlValueIsChanged()) {
            // Filter by valid xpaths and valid values
            if (!bizagi.util.isEmpty(xpath)) {
                if (!bizagi.util.isEmpty(value)) {
                    // Formats the value in full invariant (with time) in order to send to the server
                    var date = bizagi.util.dateFormatter.getDateFromInvariant(value, properties.showTime);
                    if (typeof (date) != "undefined")
                        if (date !== 0) {
                            if (!properties.showTime) {
                                date.setHours(0, 0, 0, 0);
                            }
                            renderValues[properties.xpath] = bizagi.util.dateFormatter.formatInvariant(date, true);
                        }
                } else if (value === "") {
                    renderValues[properties.xpath] = "";
                }
            }

        }
    },

    /*
    *   Gets the date control
    */
    getDateControl: function () { },

    /*
    *   Gets the time control
    */
    getTimeControl: function () { },

    /* 
    * Public method to determine if a value is valid or not
    */
    isValid: function (invalidElements) {
        var self = this,
        properties = self.properties;

        // Call base
        var bValid = this._super(invalidElements);
        var value = self.getValue();
        if (value) {
            if (bizagi.util.parseBoolean(properties.editable) == true) {
                value = bizagi.util.dateFormatter.getDateFromInvariant(value);
                var message;

                // Check that we have a valid data
                if (value != 0) {
                    // Clear time for validations
                    value.setHours(0, 0, 0, 0);

                    // Check min value
                    if (properties.minValue && typeof properties.minValue == 'string') {

                        var minValue = bizagi.util.dateFormatter.getDateFromInvariant(properties.minValue);
                        minValue.setHours(0, 0, 0, 0);

                        if (value < minValue) {
                            message = this.getResource("render-date-minimum-validation").replaceAll("#label#", properties.displayName).replaceAll("#minValue#", bizagi.util.dateFormatter.formatDate(minValue, properties.fullFormat));
                            invalidElements.push({
                                xpath: properties.xpath,
                                message: message
                            });
                            bValid = false;
                        }
                    }
                    // Check max value
                    if (properties.maxValue && typeof properties.maxValue == 'string') {
                        var maxValue = bizagi.util.dateFormatter.getDateFromInvariant(properties.maxValue);
                        maxValue.setHours(0, 0, 0, 0);

                        if (value > maxValue) {
                            message = this.getResource("render-date-maximum-validation").replaceAll("#label#", properties.displayName).replaceAll("#maxValue#", bizagi.util.dateFormatter.formatDate(maxValue, properties.fullFormat));
                            invalidElements.push({
                                xpath: properties.xpath,
                                message: message
                            });
                            bValid = false;
                        }
                    }
                }
            }
        }

        // Check that both controls (data and time) are filled out
        if (properties.showTime) {
            if (bizagi.util.parseBoolean(properties.editable) == true) {
                // Check required
                if (properties.required && self.hasValue()) {

                    // Check both controls
                    var dateControl = self.getDateControl();
                    var timeControl = self.getTimeControl();

                    // If date is filled but time is not ... show validation
                    if (dateControl.length > 0 && timeControl.length > 0) {
                        if (dateControl.val().length > 0 && timeControl.val().length == 0) {
                            message = self.getResource("render-required-text").replaceAll("#label#", properties.displayName);
                            invalidElements.push({
                                xpath: properties.xpath,
                                message: message
                            });
                            return false;
                        }
                    }
                }
            }
        }

        return bValid;
    }

});
