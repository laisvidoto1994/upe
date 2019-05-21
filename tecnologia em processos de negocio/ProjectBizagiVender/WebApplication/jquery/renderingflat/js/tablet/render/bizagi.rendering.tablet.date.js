/**
*   Name: BizAgi Tablet Render Date Extension
*   Author: Cristian Olaya
*   Date: 2015-sep-29
*   Comments:
*   -   This script will redefine the Date render class to adjust to tablet devices
*/

// Extends itself
bizagi.rendering.date.extend("bizagi.rendering.date", {
    DEFAULT_PROPERTIES: {
        "maxYearsToDisplay": 100
    }
}, {
    /**
     *  Rendering the control
     * */
    initializeDateControl: function () {
        var self = this;        
        var control = self.getControl();        

        //Getting the input
        self.input = $(".bz-rn-date-control", control);
    },

    configureHandlers: function () {
    },

    renderReadOnly: function () {
        var self = this;
        var template = self.renderFactory.getTemplate("readonlyDate");

        return $.fasttmpl(template, {});
    },

    postRenderReadOnly: function () {
        var self = this;
        self._super();

        var control = self.getControl();

        $("i", control).addClass("bz-calendar-input");
        self.input = $("span", control);
    },
    /**
     * To configure the mobiscroll plugin
     * */
    postRender: function () {
        var self = this;

        self._super();

        //Initializing the control
        self.initializeDateControl();

        var inputControl = self.getDateControl();
        var controlElements = self.properties.showTime ? ["calendar", "time"] : ["calendar"];
        var defaultDateControl = self.getFormattedDate(self.properties.value, self.properties.showTime, true);
        var minDateControl = self.getFormattedDate(self.properties.minValue, false, false);
        var maxDateControl = self.getFormattedDate(self.properties.maxValue, false, false);
        var timeFormat = self.properties.showTime ? self.getTimeFormat() : "";

        //Adds a gap of years to show if the user doest not include min years
        if (isNaN(Date.parse(minDateControl))) {
            minDateControl = new Date();
            minDateControl.setFullYear(minDateControl.getFullYear() - self.Class.DEFAULT_PROPERTIES.maxYearsToDisplay);
        }

        //Adds a gap of years to show if the user doest not include min years
        if (isNaN(Date.parse(maxDateControl))) {
            maxDateControl = new Date();
            maxDateControl.setFullYear(maxDateControl.getFullYear() + self.Class.DEFAULT_PROPERTIES.maxYearsToDisplay);
        }

        $(".bz-calendar-input", self.control).click(function () {
            inputControl.click();
        });

        inputControl.mobiscroll().calendar({
            //theme: theme,
            mode: "mixed",       // Specify scroller mode like: mode: "mixed" or omit setting to use default
            display: "bottom", // Specify display mode like: display: "bottom" or omit setting to use default
            controls: controlElements,
            minDate: minDateControl,
            maxDate: maxDateControl,
            defaultValue: defaultDateControl,
            timeFormat: timeFormat,
            lang: bizagi.util.languages[BIZAGI_LANGUAGE] || "en",
            buttons: [
                "set",
                {
                    text: this.getResource("render-plugin-search-users-clear-button-name"),
                    handler: function (e, inst) {
                        self.date = undefined;
                        self.time = undefined;
                        self.timeS = undefined;
                        self.onChangeHandler(true);
                        inst.clear();
                    }
                },
                "cancel"
            ],
            onSelect: function (valueText, inst) {
                var data = inst.getVal();
                self.date = { "day": data.getDate(), "month": data.getMonth(), "year": data.getFullYear() };

                //Checks if its has time, and included it
                if (self.properties.showTime) {
                    self.time = { "hours": data.getHours(), "minutes": data.getMinutes() };
                    if (!self.is24h) {
                        self.timeS = inst.getValue().length > 5 && parseInt(inst.getValue()[5]) === 0 ? "am" : "pm";
                    }
                }

                self.onChangeHandler();
            }
        });

        // Bind event for change value
        inputControl.on("focus", function (e) {
            e.preventDefault();
            e.stopPropagation();

            if (bizagi.util.isCordovaSupported() && bizagi.detectDevice().indexOf("android") > 0) {
                cordova.plugins.Keyboard.disableScroll(true);
                cordova.plugins.Keyboard.close();
            }
        });

        //Set input displayValue if it has default value
        if (self.properties.displayValue === "" && self.properties.value) {
            var date = self.getFormattedDate(self.properties.value, self.properties.showTime, true, false);
            if (typeof (date) !== "undefined") {
                var displayValue = bizagi.util.dateFormatter.formatDate(date, self.properties.fullFormat);
                self.input.prop("value", displayValue);
            }
        }

        inputControl.attr("keyboard", "disable");
    },

    /**
     * Configure the timeformat
     * */
    getTimeFormat: function () {
        var self = this;

        if (self.properties.timeFormat.indexOf("H") !== -1 || self.properties.timeFormat.indexOf("HH") !== -1) {
            self.is24h = true;
            return "HH:ii";
        } else {
            self.is24h = false;
            return "hh:ii A";
        }
    },

    /**
     * Get Date whit the Invariant and ISO Format applied.
     * */
    getFormattedDate: function (date, showTime, inicializer) {
        var self = this;

        if (!date || bizagi.util.isObjectEmpty(date)) return;

        //There are some dates that haven't time,... actions and validations for example or when we have to put a initial value (default value without time),
        //in that cases we should identify the case and if the date haven't the time value, we have to add (00:00:00) it to can apply the format (getDateFromInvariant).
        var time = (showTime && (self.getTime() === "0:0" || inicializer)) ? " " + date.substr(date.length - 8, date.length) : "";

        var currentDate = (inicializer && showTime && time.split("/").length > 1) || (date.split(":").length === 1) ? date += " 00:00:00" : date;
        date = bizagi.util.dateFormatter.getDateFromInvariant(currentDate, showTime);

        var currentTime = showTime ? time !== "" ? time : " " + self.getTime() : " 00:00";
        var fullDateFormated = self.setHour(self.getFullFormatedDate(date, currentTime));

        fullDateFormated = bizagi.util.dateFormatter.getDateFromISO(fullDateFormated, true);

        return fullDateFormated;
    },

    /**
     * Sut the display value on input
     * */
    setDisplayValue: function (value) {
        var self = this;
        var properties = self.properties;
        var date = self.getFormattedDate(value, properties.showTime, false);
        var displayValue = self.preprocessDateValue(date);

        if (properties.editable === false) {
            // Render as simple value
            if (typeof (displayValue) === "string" || typeof (displayValue) === "number") {
                self.input.html(displayValue);
            }
        } else {
            self.input.prop("value", displayValue);
        }
    },

    /**
     * Get the DOM Control
     * */
    getDateControl: function () {
        var self = this;
        return $("input.bz-rn-date-control", self.getControl());
    },

    /**
     * Get Time from mobiscroll
     * */
    getTime: function () {
        var self = this;

        //Converting the time in 24h format.
        if (self.properties.showTime && (self.time && self.time["minutes"] !== "")) {
            var time = self.time["hours"] + ":" + self.time["minutes"];
            time += self.timeS;

            if (time.indexOf("am") != -1 && self.time["hours"] == 12) {
                time = time.replace("12", "0");
            }

            if (time.indexOf("pm") != -1 && self.time["hours"] < 12) {
                time = time.replace(self.time["hours"], (parseInt(self.time["hours"]) + 12));
            }

            return time.replace(/(am|pm)/, "");
        } else {
            return "";
        }
    },

    /**
     * Get Date from mobiscroll
     * */
    getDate: function () {
        var self = this;
        return (self.date && self.date["month"] !== "") ? self.date["year"] + "-" + (parseInt(self.date["month"]) + 1) + "-" + self.date["day"] : "";
    },

    /**
     * Set the control value when the control change
     */
    onChangeHandler: function (isClearButton) {
        var self = this;
        var properties = self.properties;
        var currentDate = self.getDate();
        var currentTime = (properties.showTime) ? " " + self.getTime() : " 0:00";

        // If curren date is empty reset actual value
        if ((currentDate === "" && !properties.showTime) || (currentDate === "" && currentTime === "") || (isClearButton)) {
            self.setValue("");
            self.input.prop("value", "");
            properties.displayValue = "";
        } else {
            var formatedFullDate = self.setHour(self.getFullFormatedDate(currentDate, currentTime));

            formatedFullDate = bizagi.util.dateFormatter.getDateFromISO(formatedFullDate, true);

            if (!formatedFullDate || formatedFullDate == 0) { return; }

            // Set date value
            self.setNewDateValue(formatedFullDate, properties.showTime);

            var displayValue = self.preprocessDateValue(formatedFullDate);
            properties.displayValue = displayValue;

            self.input.prop("value", self.properties.displayValue);
        }
    },

    /**
     * Apply the final format that will be showed on the input
     * */
    getFullFormatedDate: function (currentDate, currentTime) {
        var fullDate = "";

        if (currentDate.length > 0) {
            fullDate = currentDate;
        } else if (currentDate !== undefined) {
            fullDate = bizagi.util.dateFormatter.formatISO(currentDate, false);
        } else {
            fullDate = bizagi.util.dateFormatter.formatISO(new Date(), false);
        }

        fullDate += currentTime;
        var dateFromFormat = bizagi.util.dateFormatter.getDateFromFormat(fullDate, "yyyy-MM-dd H:m");

        return bizagi.util.dateFormatter.formatDate(dateFromFormat !== 0 ? dateFromFormat : currentDate, "yyyy-MM-dd H:mm:ss");
    },

    /**
     * Set the control value
     * */
    setNewDateValue: function (formatedFullDate, showTime) {
        var self = this;
        var value = formatedFullDate != "" ? bizagi.util.dateFormatter.formatInvariant(formatedFullDate, showTime) : "";
        self.setValue(value);
    },

    /**
     * Removing the time when be necesary
     * */
    applyDateFormat: function (date, showTime) {
        if (!showTime) {
            var initIndexTime = null;

            if (date.indexOf("00:00") != -1) {
                initIndexTime = date.indexOf("00:00");
            } else if (date.indexOf("0:00") != -1) {
                initIndexTime = date.indexOf("0:00");
            } else if (date.indexOf("12:00") != -1) {
                initIndexTime = date.indexOf("12:00");
            } else {
                initIndexTime = "-1";
            }

            var endIndexTime = initIndexTime + 8;
            date = initIndexTime === -1 ? date : date.replace(date.substring(initIndexTime, endIndexTime), "").replace(" am", "").replace(" pm", "");
        }

        return date;
    },

    /*
     *  Checks if the date could be localized using site language
     * */
    preprocessDateValue: function (date) {
        var self = this;
        var properties = self.properties;
        var displayValue;

        displayValue = bizagi.util.dateFormatter.formatDate(date, properties.fullFormat);

        return displayValue;
    },

    /**
     * Public method to determine if a value is valid or not
     */
    isValid: function (invalidElements) {
        var self = this;
        var properties = self.properties;
        var bValid = true;
        var value = self.getValue();

        if (value) {
            if (bizagi.util.parseBoolean(properties.editable)) {
                value = bizagi.util.dateFormatter.getDateFromInvariant(value);

                if (value !== 0) {
                    // Clear time for validations
                    value.setHours(0, 0, 0, 0);

                    // Check min value and max value
                    if (properties.minValue && typeof properties.minValue == "string") {
                        bValid = self.validateMinAndMaxValue(value, true, properties, invalidElements) ? false : bValid;
                    }

                    if (properties.maxValue && typeof properties.maxValue == "string") {
                        bValid = self.validateMinAndMaxValue(value, false, properties, invalidElements) ? false : bValid;
                    }
                }
            }
        }

        if (bizagi.util.parseBoolean(properties.editable)) {
            // Check required
            if (properties.required && self.hasValue()) {
                var control = self.getDateControl();

                if (control.length > 0 && control.val().length <= 0) {
                    bValid = self.showMandatoryMessage(properties, invalidElements);
                }
            } else if (properties.required && !self.hasValue()) {
                self.showMandatoryMessage(properties, invalidElements);
            }
        }

        return bValid;
    },

    /**
     * To validate the min and max values
     * */
    validateMinAndMaxValue: function (value, isMinValue, properties, invalidElements) {
        var vValue = bizagi.util.dateFormatter.getDateFromInvariant(isMinValue ? properties.minValue : properties.maxValue);
        vValue.setHours(0, 0, 0, 0);

        if ((isMinValue && value < vValue) || (!isMinValue && value > vValue)) {
            var formatedDate = bizagi.util.dateFormatter.formatDate(vValue, properties.fullFormat);
            var message = isMinValue ?
                this.getResource("render-date-minimum-validation").replaceAll("#label#", properties.displayName).replaceAll("#minValue#", formatedDate)
                : this.getResource("render-date-maximum-validation").replaceAll("#label#", properties.displayName).replaceAll("#maxValue#", formatedDate);

            invalidElements.push({ xpath: properties.xpath, message: message });
            return true;
        }

        return false;
    },

    /**
     * To show the mandatory values message
     * */
    showMandatoryMessage: function (properties, invalidElements) {
        var self = this;
        var message = self.getResource("render-required-text").replaceAll("#label#", properties.displayName);

        invalidElements.push({ xpath: properties.xpath, message: message });

        return false;
    },

    setHour: function (date) {
        return date.replace(" 0:", " 00:").replace(" 1:", " 01:").replace(" 2:", " 02:").replace(" 3:", " 03:").replace(" 4:", " 04:").replace(" 5:", " 05:").replace(" 6:", " 06:").replace(" 7:", " 07:").replace(" 8:", " 08:").replace(" 9:", " 09:");
    },

    clearDisplayValue: function () {
        var self = this;

        self.date = undefined;
        self.time = undefined;
        self.timeS = undefined;
        self.onChangeHandler(true);
    }
});