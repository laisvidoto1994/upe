/*
*   Name: BizAgi Tablet Render Date Extension
*   Author: Diego Parra
*   Comments:
*   -   This script will redefine the Date render class to adjust to tablet devices
*/

// Extends itself
bizagi.rendering.date.extend("bizagi.rendering.date", {}, {


    postRender: function () {
        var self = this;

        //Call Base
        self._super();
        var dateControl = self.getDateControl();
        var timeControl = self.getTimeControl();

        $(dateControl).bind("click", function (e) {
            e.preventDefault();
            e.stopPropagation();
        });

        // Bind event for change value
        $(dateControl).bind("focusout", function (e) {
            self.onChangeHandler();
        });

        // Bind event for change value
        $(timeControl).bind("focusout", function (e) {
            self.onChangeHandler();
        });

        if (bizagi.detectDevice() == "tablet_android") {
            self.renderMobiscroll();
            $(dateControl).attr("type", "text");
            $(timeControl).attr("type", "text");
        }

    },

    /* GETS THE DATE CONTROL
    =====================================================*/
    getDateControl: function () {
        var self = this;
        return $(".ui-bizagi-render-date", self.getControl());
    },

    /* GETS THE TIME CONTROL
    =====================================================*/
    getTimeControl: function () {
        var self = this;
        return $(".ui-bizagi-render-time", self.getControl());
    },

    getMaxDateInvariant: function () {
        var self = this;
        var maxDate = null;

        if (self.properties.maxValue) {
            maxDate = bizagi.util.dateFormatter.getDateFromInvariant(self.properties.maxValue, self.properties.showTime);

            if(!self.properties.showTime)
                maxDate.setHours(23,59,59);

            return maxDate;
        } else {
            maxDate = new Date();
            maxDate.setYear(maxDate.getFullYear() + 100);

            maxDate.setHours(23,59,59);
            
            return maxDate;
        }
    },

    getMinDateInvariant: function () {
        var self = this;
        var minDate = null;

        if (self.properties.minValue) {
            minDate = bizagi.util.dateFormatter.getDateFromInvariant(self.properties.minValue, self.properties.showTime);

            if(!self.properties.showTime)
                minDate.setHours(0,0,0);

            return minDate;
        } else {
            minDate = new Date();
            minDate.setYear(minDate.getFullYear() - 100);

            minDate.setHours(0,0,0);

            return minDate;
        }
    },

    renderMobiscroll: function () {
        var self = this;

        var dateParams = { display: 'modal', cancelText: 'Clear', mode: 'mixed', theme: 'android-ics', preset: 'date', dateFormat: "mm/dd/yyyy", showOnFocus: 'true', width: 80, onClose: function (valueText, inst) { self.onClose(valueText, inst); }, onCancel: function (valueText, inst) { this.value = ""; self.onChangeHandler(); return true; } };

        var maxDate = self.getMaxDateInvariant();
        var minDate = self.getMinDateInvariant();

        dateParams.maxDate = maxDate;
        dateParams.minDate = minDate;

        self.getDateControl().scroller(dateParams);
        self.getTimeControl().scroller({ display: 'modal', cancelText: 'Clear', mode: 'mixed', theme: 'android-ics', preset: 'time', ampm: false, timeFormat: 'HH:ii:ss', seconds: true, showOnFocus: 'true', width: 80, onClose: function (valueText, inst) { self.onClose(valueText, inst); }, onCancel: function (valueText, inst) { this.value = ""; self.onChangeHandler(); return true; } });
    },

    onClose: function (valueText, inst) {
        var self = this;
        var contexttmp = self.getFormContainer().container.find("#container-items-edit");
        $(".ui-bizagi-container-button-edit .ui-bizagi-cancel-btn", contexttmp).click();
    },

    /* SETS THE VALUE IN THE RENDERED CONTROL
    =====================================================*/
    setDisplayValue: function (value) {
        var self = this;
        var properties = self.properties;
        var control = self.getControl();
        var $dateControl = self.getDateControl();
        var $timeControl = self.getTimeControl();

        // Call base
        this._super(value);

        // Set value in input
        if (value && properties.editable) {

            if (properties.showTime && value.length <= 10) {
                value += " 00:00:00";
            }

            var objDate = bizagi.util.dateFormatter.getDateFromInvariant(value, properties.showTime);

            // Assert that the date could be parsed
            bizagi.assert(objDate > 0, "The date could not be parsed", value);

            var year = objDate.getFullYear();
            var month = objDate.getMonth() + 1; // zero based
            var day = objDate.getDate();

            // Append 0 for values below 10
            if (month < 10) {
                month = '0' + month;
            }
            if (day < 10) {
                day = '0' + day;
            }

            var displayValue = bizagi.util.dateFormatter.formatDate(objDate, self.properties.fullFormat);

            // Set value in controls
            if (bizagi.detectDevice() == "tablet") {
                $dateControl.prop('value', year + '-' + month + '-' + day);
            } else {
                $dateControl.prop('value', displayValue);
            }

            // Display time if showtime is true
            if (properties.showTime) {
                var hour = objDate.getHours();
                var minutes = objDate.getMinutes();
                var seconds = objDate.getSeconds();

                if (hour < 10) {
                    hour = '0' + hour;
                }
                if (minutes < 10) {
                    minutes = '0' + minutes;
                }
                if (seconds < 10) {
                    seconds = '0' + seconds;
                }

                $timeControl.prop('value', hour + ':' + minutes + ':' + seconds);
            }
        }
        else {

            var displayValue = self.getDisplayValue();
            if (typeof (displayValue) == "string") {
                if (displayValue == "") {
                    displayValue = bizagi.util.dateFormatter.formatDate(bizagi.util.dateFormatter.getDateFromInvariant(self.value, self.properties.showTime),
                                                                        self.properties.fullFormat);
                }
                control.html(displayValue);
            }

        }

    },
    /* 
    *   Changes the render min value
    */
    changeMinValue: function (value) {
        var self = this,
        properties = self.properties;
        var dateControl = self.getDateControl();

        // Set value in control
        if (value && properties.editable) {
            properties.minValue = value;
            dateControl.datepicker("option", "minDate", bizagi.util.dateFormatter.getDateFromInvariant(value));
        }
    },

    /* 
    *   Changes the render max value
    */
    changeMaxValue: function (value) {
        var self = this,
        properties = self.properties;
        var dateControl = self.getDateControl();

        // Set value in control
        if (value && properties.editable) {
            properties.maxValue = value;
            dateControl.datepicker("option", "maxDate", bizagi.util.dateFormatter.getDateFromInvariant(value));
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
        var currentDate = dateControl.val();
        var currentTime = (properties.showTime && timeControl.val() != "") ? " " + timeControl.val() : " 00:00:00";

        // If curren date is empty reset actual value
        if ((currentDate == "" && !properties.showTime) || (currentDate == "" && timeControl.val() == "")) {
            self.setValue("");
            properties.displayValue = "";
        } else {
            // If no date selected then use the current date
            var fullDate = currentDate.length > 0 ? currentDate + currentTime : bizagi.util.dateFormatter.formatISO(new Date(), false) + currentTime;
            var maxDate = self.getMaxDateInvariant();
            var minDate = self.getMinDateInvariant();

            // Convert ISO date into date object
            fullDate = bizagi.util.dateFormatter.getDateFromISO(fullDate, true);
            if (!fullDate || fullDate == 0) {
                return;
            }

            //helps to improve the gap between the minDate and the selected date
            if(!properties.showTime){
                fullDate.setSeconds(1);
            }


            if (fullDate > maxDate || fullDate < minDate) {
                dateControl.parent().addClass("ui-bizagi-render-error");
                var message = bizagi.localization.getResource("workportal-general-invalid-date");
                message = message.replace("{0}", properties.displayName);
                message = message.replace("<strong>", "");
                message = message.replace("</strong>", "");
                dateControl.parent().attr("data-error", message);

                dateControl.prop('value', "");
                
            } else {
                dateControl.parent().removeClass("ui-bizagi-render-error");
                dateControl.parent().attr("data-error", "");

                // Set date value
                self.setValue(bizagi.util.dateFormatter.formatInvariant(fullDate, properties.showTime));

                // Set display value
                properties.displayValue = bizagi.util.dateFormatter.formatDate(fullDate, properties.fullFormat);

                if (bizagi.detectDevice() == "tablet_android") {
                    dateControl.prop('value', properties.displayValue);
                }
            }
        }
    }
});