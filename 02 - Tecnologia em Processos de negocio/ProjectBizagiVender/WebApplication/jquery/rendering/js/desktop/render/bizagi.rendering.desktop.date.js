/*
 *   Name: BizAgi Desktop Render Date Extension
 *   Author: Diego Parra
 *   Comments:
 *   -   This script will redefine the Date render class to adjust to desktop devices
 */

// Extends itself
bizagi.rendering.date.extend("bizagi.rendering.date", {}, {
    /*
     *   Update or init the element data
     */
    initializeData: function (data) {
        var self = this;
        self.i18n = bizagi.localization.getResource("datePickerRegional");
        // Call base
        this._super(data);

        // Fill default properties
        var properties = this.properties;

        // Fix dateFormat for datepicker  
        var dateFormat = self.getDateFormat(properties.dateFormat);
        // properties.dateFormat = dateFormat.datePickerFormat;
        properties.datePickerFormat = dateFormat.datePickerFormat;
        properties.timePickerFormat = dateFormat.timePickerFormat;
    },
    /**
     * Translate standar date format to jquery date picker
     *
     */
    getDateFormat: function (format) {
        var datePickerFormat = format;
        var timePickerFormat = undefined;
        var init;

        var properties = this.properties;

        if (format.search("h") != -1 || format.search("H") != -1) {
            if (format.search("h") != -1) {
                init = format.search("h");
            } else {
                init = format.search("H");
            }
            datePickerFormat = format.substring(0, init - 1);
            timePickerFormat = format.substr(init);
        }

        // Fix month
        if (datePickerFormat.indexOf("MMMM") >= 0) {
            datePickerFormat = datePickerFormat.replaceAll("MMMM", "MM");

        } else if (datePickerFormat.indexOf("MMM") >= 0) {
            // Month name short
            datePickerFormat = datePickerFormat.replaceAll("MMM", "M");
        } else if (datePickerFormat.indexOf("MM") >= 0) {
            // Month two digits
            datePickerFormat = datePickerFormat.replaceAll("MM", "mm");
        } else if (datePickerFormat.indexOf("M") >= 0) {
            // Month one digits
            datePickerFormat = datePickerFormat.replaceAll("M", "m");
        }

        // Fix years
        if (datePickerFormat.search("yyyy") != -1) {
            datePickerFormat = datePickerFormat.replaceAll("yyyy", "yy");
        } else {
            if (datePickerFormat.search("yy") != -1) {
                datePickerFormat = datePickerFormat.replaceAll("yy", "y");
            }
        }
        datePickerFormat = datePickerFormat.replaceAll("dddd", "DD"); // Fix days

        return {
            'datePickerFormat': datePickerFormat,
            'timePickerFormat': timePickerFormat
        };
    },

    getElementsToStylize:function(context){
        return $(context).children();
    },

    getTimePickerFormat: function (timeFormat) {
        var i = 0;
        var c;

        // Define return object
        var returnObj = {
            show24Hours: false,
            showSeconds: false,
            showZeroInHour: true, // True to show 0 when hour < 10
            separator: ":"
        };

        // Analize format
        var token, lastToken = "";
        while (i < timeFormat.length) {
            // Get next token from format string
            c = timeFormat.charAt(i);
            token = "";
            while ((timeFormat.charAt(i) == c) && (i < timeFormat.length)) {
                token += timeFormat.charAt(i++);
            }

            // Extract contents of value based on format token
            if (token == "hh" || token == "h") {
                lastToken = token;
                returnObj.show24Hours = false;
                returnObj.showZeroInHour = token == 'h' ? false : true;
            }
            else if (token == "HH" || token == "H") {
                lastToken = token;
                returnObj.show24Hours = true;
                returnObj.showZeroInHour = token == 'H' ? false : true;
            }
            else if (token == "mm" || token == "m") {
                lastToken = token;
            }
            else if (token == "ss" || token == "s") {
                lastToken = token;
                returnObj.showSeconds = true;
            }
            else if (token == "a") {
                lastToken = token;
            }
            else if (lastToken.toUpperCase() == "H" || lastToken.toUpperCase() == "HH") {
                returnObj.separator = token;
            }
            else if (lastToken.toUpperCase() == "S" || lastToken.toUpperCase() == "SS") {
                lastToken = token;
                returnObj.ampmPrefix = token;
            }
        }

        return returnObj;
    },
    /*
     *   Template method to implement in each device to customize each render after processed
     */
    postRender: function () {
        var self = this;
        var properties = self.properties;
        var timeControl = self.getTimeControl();
        var dateControl = self.getDateControl();
        var dateContainer = dateControl.parent();
        // Call base 
        this._super();
        var maxUndefinedYear = parseInt(new Date().getFullYear() + 200).toString();
        var minUndefinedYear = parseInt(new Date().getFullYear() - 200).toString();
        if (typeof (properties.maxValue) == "undefined") properties.maxValue = "12/31/" + maxUndefinedYear + " 00:00:00";  //Current year + 200 IE or 9999
        if (typeof (properties.minValue) == "undefined") properties.minValue = "01/01/" + minUndefinedYear + " 00:00:00"; //Current year - 200 IE or 1753 for SQL Server compat
        // Apply timeEntry plugin
        if (properties.showTime) {
            if (self.getMode() == "execution")
                window.setTimeout(function () {
                    if (dateControl.parent() && timeControl.parent()) {
                        // Width adjustment when timecontrol is present
                        var ctrlWidth = (properties.helpText.length > 0) ? "47%" : "54%";
                        if (self.grid) ctrlWidth = "63%";
                        dateControl.parent().width(ctrlWidth);
                        // RTL adjustments when timecontrol is present
                        if (properties.orientation == "rtl") {
                            self.getTimeControl().css("paddingLeft", "0px");
                            self.getTimeControl().css("paddingRight", "4px");
                        }
                        timeControl.width("65px");
                    }
                }, 0);
            var timeFormatProperties;

            if (properties.timePickerFormat !== undefined) {
                timeFormatProperties = self.getTimePickerFormat(properties.timePickerFormat);
            } else {
                timeFormatProperties = bizagi.util.dateFormatter.analyzeTimeFormat(properties.timeFormat);
            }
            timeControl.timeEntry({
                spinnerTexts: [
                    this.getResource("render-timeentry-now"),
                    this.getResource("render-timeentry-previous-field"),
                    this.getResource("render-timeentry-next-field"),
                    this.getResource("render-timeentry-increment"),
                    this.getResource("render-timeentry-decrement")
                ],
                showSeconds: timeFormatProperties.showSeconds,
                show24Hours: timeFormatProperties.show24Hours,
                separator: timeFormatProperties.separator,
                ampmPrefix: timeFormatProperties.ampmPrefix || "",
                useMouseWheel: (self.getMode() == "execution"),
                showZeroInHour: timeFormatProperties.showZeroInHour
            });

            // DEPL: Fix plugin without touching it
            // The plugin is setting the image as an inline style, 
            // that means that we can't set it in the css files,
            // so we remove the inline style, and the css will do the rest
            $(".timeEntry_control", timeControl)
                .css("height", "")
                .css("width", "")
                .css("display", "")
                .css("background-color", "")
                .css("background-image", "")
                .css("background-position", "")
                .css("background-repeat", "");
        }
    },
    /*
     *   Template method to implement in each device to customize the render's behaviour to add handlers
     */
    configureHandlers: function () {
        var self = this;
        var properties = self.properties;
        var dateControl = self.getDateControl();
        var dateIcon = self.getDateIcon();
        var initYear = 100;
        var endYear = 30;
        if (!isNaN(Date.parse(properties.minValue))) {
            initYear = (new Date).getFullYear() - $.datepicker.parseDate("mm/dd/yy", properties.minValue).getFullYear() || 100;
        }

        if (!isNaN(Date.parse(properties.maxValue))) {
            endYear = $.datepicker.parseDate("mm/dd/yy", properties.maxValue).getFullYear() - (new Date).getFullYear() || 100;
        }

        // Call base
        self._super();

        // Set datepicker i18n
        $.datepicker.setDefaults(self.i18n);

        var options = {
            firstDay: bizagi.override.firstDay || 0,
            yearRange: "c-" + initYear + ":c+" + endYear,
            dateFormat: properties.datePickerFormat,
            changeYear: true,
            changeMonth: true,
            shortYearCutoff: (typeof BIZAGI_DEFAULT_DATETIME_INFO != "undefined" && typeof BIZAGI_DEFAULT_DATETIME_INFO.twoDigitYearMaxDelta != "undefined") ? "+" + BIZAGI_DEFAULT_DATETIME_INFO.twoDigitYearMaxDelta : "+50",
            beforeShow: function () {
                // Set min & max value
                self.properties.editable = true;
                self.changeMinValue(self.properties.minValue);
                self.changeMaxValue(self.properties.maxValue);
                self.setDisplayValue(self.getValue());
            }
        };

        if (bizagi.util.isIE()) {
            options = $.extend(options, {
                onSelect: function () {
                    self.getLabel().focus();
                    $(this).change();
                }
            });
        }

        // Apply datepicker & mask plugin
        dateControl.datepicker(options);

        // Bind to change event to detect if the user clears the text
        dateControl.bind("change", function () {
            var value = dateControl.val();
            if (bizagi.util.isEmpty(value)) {
                self.setValue("");
            }
            else if (value.match(/\d{5,}/))
                self.setDisplayValue(self.getDisplayValue());
            else {
                if (bizagi.util.dateFormatter.getDateFromFormat(value, self.properties.dateFormat.substring(0, (self.properties.dateFormat.search("h|H") != -1) ? self.properties.dateFormat.search("h|H") - 1 : self.properties.dateFormat.length), self.i18n) == 0) {
                    self.setValue("");
                    dateControl.val("");
                }
            }
        });

        //set the focus on the input when the icon is clicked
        dateIcon.bind("click", function () {
            dateControl.focus();
        });
        // For rtl adjustments 
        if (properties.orientation == "rtl") {
            $(".ui-bizagi-wp-app-icon-date").css("right", "auto");
            $(".ui-bizagi-wp-app-icon-date").css("left", "7px");
        }
    },
    /*
     *   Template method to implement in each device to customize the render's behaviour when rendering in design mode
     */
    configureDesignView: function () {
        var self = this;
        var properties = self.properties;
        var control = self.getControl();

        if (properties.showTime) {
            control.find(".timeEntry_control").unbind("mousedown");
            control.find(".timeEntry_control").unbind("mouseup");
            control.find(".timeEntry_control").unbind("mouseover");
            control.find(".timeEntry_control").unbind("mousemove");
        }
    },
    /*
     *   Gets the date control
     */
    getDateControl: function () {
        var self = this;
        self.dateControl = $(".ui-bizagi-render-date", self.getControl());
        return self.dateControl;
    },
    /*
     *   Gets the date icon
     */
    getDateIcon: function () {
        var self = this;
        self.dateIcon = $(".ui-bizagi-wp-app-icon-date", self.getControl());
        return self.dateIcon;
    },
    /*
     *   Gets the time control
     */
    getTimeControl: function () {
        var self = this;
        self.timeControl = $(".ui-bizagi-render-time", self.getControl());
        return self.timeControl;
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

            dateControl.datepicker("option", "minDate", new Date(value));
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
     *   Sets the value in the rendered control
     */
    setDisplayValue: function (value) {
        var self = this;
        var properties = self.properties;
        var dateControl = self.getDateControl();
        var timeControl = self.getTimeControl();

        if (bizagi.util.isNumeric(value) && value !== 0) {
            value = bizagi.util.dateFormatter.formatInvariant(new Date(value));
        }

        // Call base
        this._super(value);

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
                    var INVARIANT_FORMAT = "MM/dd/yyyy H:mm:ss";
                    if (typeof value == "string") {
                        if (value.length == INVARIANT_FORMAT.length || value.length == (INVARIANT_FORMAT.length + 1)) {
                            dateObj = bizagi.util.dateFormatter.getDateFromInvariant(value, true);
                        } else {
                            dateObj = bizagi.util.dateFormatter.getDateFromInvariant(value);
                            dateObj.setHours(0, 0, 0, 0);
                        }
                    } else {
                        dateObj = bizagi.util.dateFormatter.getDateFromInvariant(value, true);
                    }
                } else {
                    dateObj = bizagi.util.dateFormatter.getDateFromInvariant(value);
                    // dateObj = bizagi.util.dateFormatter.getDateFromFormat(value, properties.dateFormat);
                }

            }

            // Assert that the date could be parsed
            bizagi.assert(dateObj != 0, "The date could not be parsed", value);

            // Just set the value in the input for performance, when initializing the view
            if (self.internalSetInitialValueFlag) {
                if (self.getMode() === "execution") {
                    dateControl.datepicker('setDate', dateObj);
                    timeControl.timeEntry("setTime", dateObj);
                }
                window.setTimeout(function () {
                    self.checkIcon();
                }, 0);
                return;
            }

            // Set data in controls
            dateControl.datepicker('setDate', dateObj);
            if (properties.showTime) {
                timeControl.timeEntry("setTime", dateObj);
            }

            // Set display value
            properties.displayValue = bizagi.util.dateFormatter.formatDate(dateObj, properties.fullFormat, self.i18n);
            self.checkIcon();
        }
        self.autoWidthTimeControlByValue(timeControl, 75);
    },

    // Checks large texts in order to hide the calendar icon or not
    checkIcon: function () {
        var self = this;
        var dateControl = self.getDateControl();
        if (self.getFormContainer())
            if (self.getFormContainer().mode == "execution") {
                var displayValue = self.getDateControl().val();
                if (dateControl.width() > 0 && dateControl.width() < 190)
                    if (displayValue.length > 15) {
                        self.dateIcon.hide();
                        dateControl.css('padding', '1px 5px 1px 4px');
                    } else {
                        self.dateIcon.show();
                        var currPadding = $("input", self.getControl()).css('paddingRight').replace("px", "");
                        if (currPadding > 20 || currPadding == 5)
                            dateControl.css('paddingRight', "22px");
                    }
            }
    },

    removeValidations: function () {
        var self = this;
        var form = self.getFormContainer().parent || self.getFormContainer();
        form.clearValidationMessages();
    },

    /*
     *   Focus on the current element
     */
    focus: function (time) {
        var self = this,
            dateControl = self.getDateControl();

        // Call base
        this._super(time);
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

        if (properties.showTime && timeControl.length > 0) {
            var currentTime = timeControl.timeEntry('getTime');

            // Merge
            if (currentTime) {
                // If no date has been selected then we need to create a new one to hold the time
                if (currentDate == null)
                    currentDate = new Date();
            }
            else if (currentDate != null) {
                currentTime = new Date(0, 0, 0, 0, 0, 0, 0);
                timeControl.timeEntry("setTime", "12:00:00 AM");
            }

            currentDate.setHours(currentTime.getHours());
            currentDate.setMinutes(currentTime.getMinutes());
            currentDate.setSeconds(currentTime.getSeconds());
        }

        if (!currentDate || currentDate == 0) {
            self.checkIcon();
            return;
        }
        //Attemp set the value of the datepicker control. If not valid go back to the previous.
        var previousValue = self.value;

        //sets the value with the current format date, changed to use the same displayValue method
        self.setValue(bizagi.util.dateFormatter.formatInvariant(currentDate, properties.showTime));
        //self.setValue(bizagi.util.dateFormatter.formatDate(currentDate, properties.fullFormat));
        var value = self.getValue();
        var objDate = bizagi.util.dateFormatter.getDateFromInvariant(value, true);
        if (typeof (timeControl.val()) != "undefined")
            if (timeControl.val().length == 0) {
                timeControl.timeEntry("setTime", objDate);
            }

        if (dateControl.val().length > 0) {
            if (!properties.showTime || (properties.showTime && timeControl.val().length > 0)) {
                if (!self.isValid([])) {
                    var oldVal = self.dateControl.val();
                    //self.setValue(previousValue);
                    self.setValue("");
                    //self.setDisplayValue(previousValue);
                    self.setDisplayValue("");
                    self.dateControl.val("");
                    var xPath = self.properties.xpath;
                    var message = bizagi.localization.getResource("workportal-general-invalid-date");
                    message = message.replace("{0}", xPath);
                    if (typeof (self.getFormContainer().validationController) == "undefined") self.getFormContainer().validationController = new bizagi.command.controllers.validation(self.getFormContainer(), self.validations);
                    var validationController = self.getFormContainer().validationController || self.getFormContainer().parent.validationController;
                    self.removeValidations();
                    validationController.showValidationMessage(message + " " + oldVal + ""/*, xPath*/);
                    return;
                }
            } else {
                self.setValue(previousValue);
                self.setDisplayValue(previousValue);
            }
        }

        // Set display value
        properties.displayValue = bizagi.util.dateFormatter.formatDate(currentDate, properties.fullFormat, self.i18n);
        self.checkIcon();
        self.autoWidthTimeControlByValue(timeControl, 75);
    },

    /**
     *  Clean control before to refreshed it
     */
    afterToRefresh: function () {
        var self = this;
        var dateControl = self.getDateControl();

        // Run validates
        var errors = [];
        self.isValid(errors);
        // If find errors, date has to be empty
        if (errors.length > 0)
            self.setValue("");
    },

    /**
     * Set auto width control by value
     */
    autoWidthTimeControlByValue: function (control, minWidth){
        setTimeout(function(){
            //Adjust width control time, no minor to minWidth
            //character * size * numberCharacters + tool time
            try {
                var calculatedWidth = parseInt(control.css('font-size').replace('px','')) * 0.8 * control.val().length + 25;
                if(calculatedWidth > minWidth){
                    control.style('width', (calculatedWidth).toString() + 'px', 'important');
                }
            }
            catch(err) {}
        }, 100);

    }
});
