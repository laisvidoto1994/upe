/**
 * Name: BizAgi Render Layout DateTime Class
 * Author: Andres Fernando Muñoz
 * Comments:
 * - This script will define basic stuff for text renders inside templates
 */

bizagi.rendering.layoutRender.extend("bizagi.rendering.layoutDateTime", {}, {
    /**
     * Constructor
     */
    init: function (params) {
        // Call base
        this._super(params);
    },

    /**
     *
     * @param data
     */
    initializeData: function (data) {
        var self = this;
        // Call base
        self._super(data);

        // Fill default properties
        var properties = self.properties;
        var dateFormat = self.getResource("dateFormat");
        var timeFormat = self.getResource("timeFormat");

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
        else{
            var indexHour = properties.fullFormat.search(/[h|H]+/ig);
            if (indexHour !== -1) {
                properties.fullFormat = properties.fullFormat.substring(0, indexHour - 1);
            }
        }

        // Read always parameter from server in invariant format
        if (properties.value) {
            var date = bizagi.util.dateFormatter.getDateFromInvariant(properties.value, properties.showTime);

            // Format date to current format
            if (date != 0) {
                var datePickerRegional = bizagi.localization.getResource("datePickerRegional");
                self.value = properties.value; // Value must always hold the value with invariant format
                properties.displayValue = bizagi.util.dateFormatter.formatDate(date, properties.fullFormat, datePickerRegional);
            }
            else {
                self.value = null;
            }
        }
        else {
            self.value = null;
            properties.value = "";
            properties.displayValue = "";
        }
    },

    /**
     * Template method to implement in each children to customize each control
     */
    renderControl: function () {
        var self = this;
        var template = self.renderFactory.getTemplate("layout-date-time");
        var value = (self.properties.value === null || self.properties.value === "") ?  "" : self.properties.value;

        // Render template
        return $.fasttmpl(template, {value: value});
    },

    /**
     * Sets the value in the rendered control
     */
    setDisplayValue: function (value) {
        var self = this, dateObj;
        var properties = self.properties;
        var dateControl = self.getDateControl();
        var INVARIANT_FORMAT = "MM/dd/yyyy H:mm:ss";
        self.i18n = bizagi.localization.getResource("datePickerRegional");

        if (value.length == INVARIANT_FORMAT.length || value.length == (INVARIANT_FORMAT.length + 1)) {
            dateObj = bizagi.util.dateFormatter.getDateFromInvariant(value, true);
        }
        else {
            dateObj = bizagi.util.dateFormatter.getDateFromInvariant(value);
            if (dateObj && !isNaN(Date.parse(dateObj)) && !$.isNumeric(dateObj)) {
                dateObj.setHours(0, 0, 0, 0);
            }

        }
        // Set value in input
        if (value && !isNaN(Date.parse(value))) {
            var formattedDateTime = bizagi.util.dateFormatter.formatDate(dateObj, properties.fullFormat, self.i18n);
            dateControl.text(formattedDateTime);
        }
    },

    /**
     * Gets the date control
     */
    getDateControl: function () {
        var self = this;
        self.dateControl = $(".ui-bizagi-render-date-time", self.getControl());
        return self.dateControl;
    }
});