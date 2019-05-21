/*
*   Name: BizAgi Desktop Render Date Extension
*   Author: Ricardo Pérez
*   Comments:
*   -   This script will redefine the Date render class to adjust to desktop devices
*/

// Extends itself
bizagi.rendering.date.extend("bizagi.rendering.date", {}, {
    /*
    *   Template method to implement in each device to customize each render after processed
    */
    postRender: function () {
        var self = this;
        var properties = self.properties;
        self.getTimeControl().css("display", "none");
        var control = self.getControl();
        var timepicker_div = document.createElement("div");
        timepicker_div.className = "ui-bizagi-render-time-picker";

        // Call base 
        this._super();

        // Apply timeEntry plugin
        if (properties.showTime) {

            var timeFormatProperties;

            if (properties.timePickerFormat !== undefined) {
                timeFormatProperties = self.getTimePickerFormat(properties.timePickerFormat);
            } else {
                timeFormatProperties = bizagi.util.dateFormatter.analyzeTimeFormat(properties.timeFormat);
            }

            control.append(timepicker_div);
            self.timePicker = new WinJS.UI.TimePicker(timepicker_div, { clock: (timeFormatProperties.show24Hours ? "24HourClock" : "12HourClock"), disabled: (typeof properties.editable != "undefined" ? !properties.editable : true) });
            self.timePicker.addEventListener("change", function () { self.onChangeHandler(); });

            //fix the "AM" "PM" display values (sometimes they come as "" and ".")
            var timeElement = $(".win-timepicker-period", self.getControl());
            if (timeElement[0]) {
                var timeElemAm = $("option", timeElement)[0];
                var timeElemPm = $("option", timeElement)[1];

                if (timeElemAm) {
                    $(timeElemAm).html("AM");
                }
                if (timeElemPm) {
                    $(timeElemPm).html("PM");
                }
            }
        }
    },
    /*
    *   Sets the value in the rendered control
    */
    setDisplayValue: function (value) {
        var self = this;
        var properties = self.properties;
        // Call base
        self._super(value);

        // Set value in input
        if (value && properties.editable) {
            var dateObj;
            if (properties.timePickerFormat !== undefined) {
                if (self.getMode() != "execution") {
                    dateObj = bizagi.util.dateFormatter.getDateFromInvariant(value);
                } else {
                    dateObj = bizagi.util.dateFormatter.getDateFromInvariant(value, true);
                }
            } else {
                if (properties.showTime) {
                    dateObj = bizagi.util.dateFormatter.getDateFromInvariant(value, true);
                } else {
                    dateObj = bizagi.util.dateFormatter.getDateFromInvariant(value);
                }

            }

            // Assert that the date could be parsed
            bizagi.assert(dateObj != 0, "The date could not be parsed", value);

            if (properties.showTime) {
                self.timePicker.current = dateObj;
            }
        }
    },
    /* 
    *   Formats the date time value to the hidden control
    */
    onChangeHandler: function () {
        var self = this;
        var properties = self.properties;
        var dateControl = self.getDateControl();
        var timeControl = self.getTimeControl();
        var currentDate = dateControl.datepicker('getDate');

        if (properties.showTime) {
            var currentTime = self.timePicker.current;
            timeControl.val(bizagi.util.dateFormatter.formatDate(currentTime, properties.timePickerFormat ? properties.timePickerFormat : properties.timeFormat));

            // Merge
            if (currentTime) {
                // If no date has been selected then we need to create a new one to hold the time
                if (currentDate == null)
                    currentDate = new Date();

                currentDate.setHours(currentTime.getHours());
                currentDate.setMinutes(currentTime.getMinutes());
                currentDate.setSeconds(currentTime.getSeconds());
            }
        }

        if (!currentDate || currentDate == 0)
            return;

        if (dateControl.val() == "") {
            dateControl.val(bizagi.util.dateFormatter.formatDate(currentDate, properties.dateFormat));
        }

        //Attemp set the value of the datepicker control. If not valid go back to the previous.
        var previousValue = self.value;
        self.setValue(bizagi.util.dateFormatter.formatInvariant(currentDate, properties.showTime));
        if (!self.isValid([])) {
            self.setValue(previousValue);
            self.setDisplayValue(previousValue);
        }

        // Set display value
        properties.displayValue = bizagi.util.dateFormatter.formatDate(currentDate, properties.fullFormat);
    }
});
