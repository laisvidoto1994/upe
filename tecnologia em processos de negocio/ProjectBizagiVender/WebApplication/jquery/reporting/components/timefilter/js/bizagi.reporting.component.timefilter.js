/*
* @title : Process filter component
* @author : David Romero
* @date   : 18/09/2013
* Comments:
*     Defines a base class for all report components
*
*/

bizagi.reporting.component.controller("bizagi.reporting.component.timefilter", {

    /*
    *   Constructor
    */
    init: function (canvas, properties) {

        // Call super
        this._super(canvas);

        //Set properties
        this.properties = properties;

        this.date = this.getInitialDateRange(properties.time);

        //Render component
        this.render();
    },

    /*
    *   Initialize date range
    */
    getInitialDateRange: function (time) {

        var currentDate = new Date();

        var end = currentDate;
        var start = new Date(currentDate.getFullYear() - 3, 0, 1);
        var min = (time.dateFrom) ? bizagi.util.dateFormatter.getDateFromInvariant(time.dateFrom, false) : new Date(currentDate.getFullYear(), 0, 1);
        var max = (time.dateTo) ? bizagi.util.dateFormatter.getDateFromInvariant(time.dateTo, false) : end;

        return {
            range: { from: start, to: end },
            values: { min: min, max: max }
        };
    },

    /*
    *   Load all needed templates
    */
    loadTemplates: function () {

        // Define mapping
        var templateMap = {
            "timefilter": (bizagi.getTemplate("bizagi.reporting.component.timefilter") + "#bz-rp-filters-time"),
            "datebuttons": (bizagi.getTemplate("bizagi.reporting.component.timefilter") + "#bz-rp-filters-time-buttons")
        };

        // Fetch templates
        return this._super(templateMap);
    },

    /*
    *   Templated render component
    */
    renderComponent: function () {
        var self = this;
        var template = self.getTemplate("timefilter");

        var content = $.tmpl(template);
        return content;
    },

    /*
    *   After Render is loaded execute some actions
    */
    postRender: function () {
        var self = this;


        //Load date pickers and resolve the post render
        $.when(self.loadDatePickers(), self.loadDateButtons(), self.loadDateSlider()).done(function () {

            self.resolvePostRender();

        });

    },

    /*
    *   Load date pickers
    */
    loadDatePickers: function () {

        var self = this;
        var format = self.getDateFormat(self.properties.dateFormat);

        //Get datepicker elements
        self.$elementStart = $("#bz-rp-filters-time-start", self.canvas);
        self.$elementEnd = $("#bz-rp-filters-time-end", self.canvas);

        self.$elementStart.datepicker({
            dateFormat: format,
            defaultDate: self.date.values.min,
            minDate: self.date.range.from,
            maxDate: self.date.range.to,
            shortYearCutoff: (typeof BIZAGI_DEFAULT_DATETIME_INFO != "undefined") ? "+" + BIZAGI_DEFAULT_DATETIME_INFO.twoDigitYearMaxDelta : "+10",
            changeYear: true,
            changeMonth: true,
            onSelect: function () { self.selectPicker(); }
        });

        self.$elementEnd.datepicker({
            dateFormat: format,
            defaultDate: self.date.values.max,
            minDate: self.date.values.min,
            maxDate: self.date.range.to,
            shortYearCutoff: (typeof BIZAGI_DEFAULT_DATETIME_INFO != "undefined") ? "+" + BIZAGI_DEFAULT_DATETIME_INFO.twoDigitYearMaxDelta : "+10",
            changeYear: true,
            changeMonth: true,
            onSelect: function () { self.selectPicker(); }
        });

        //Set fields values
        self.$elementStart.val(bizagi.util.dateFormatter.formatDate(self.date.values.min, self.properties.dateFormat));
        self.$elementEnd.val(bizagi.util.dateFormatter.formatDate(self.date.values.max, self.properties.dateFormat));
    },

    /*
    * Load date buttons to selected dates by month, day and year
    */
    loadDateButtons: function () {

        var self = this;
        var tmpl = self.getTemplate("datebuttons");
        var $container = $(".bz-rp-filters-time-buttons-container", self.content);

        var dates = {
            day: self.getResource("reports-general-day").slice(0, 1),
            month: self.getResource("reports-general-month").slice(0, 1),
            year: self.getResource("reports-general-year").slice(0, 1)
        };


        $container.append($.tmpl(tmpl, dates));

        //apply events
        $container.on('click', '.bz-rp-filters-time-buttons-list li', function () {
            $.proxy(self.setDateRange($(this)), self);
        });
    },

    /*
    *    Load date slider
    */
    loadDateSlider: function () {

        var self = this;

        self.dateSlider = $("#bz-rp-filters-time-slider", self.canvas);

        self.dateSlider.dateRangeSlider({
            bounds: { min: self.date.range.from, max: self.date.range.to },
            defaultValues: { min: self.date.values.min, max: self.date.values.max },
            formatter: function (val) {
                return bizagi.util.dateFormatter.formatDate(val, self.properties.dateFormat);
            }
        });

        self.dateSlider.bind("userValuesChanged", function (e, data) { self.changeSlider(e, data); });
    },

    /*
    *   Translate standar date format to jquery date picker 
    */
    getDateFormat: function (format) {

        var datePickerFormat = format;
        var init;

        if (format.search("h") != -1 || format.search("H") != -1) {
            if (format.search("h") != -1) {
                init = format.search("h");
            } else {
                init = format.search("H");
            }
            datePickerFormat = format.substring(0, init - 1);
        }

        // Fix month
        if (datePickerFormat.indexOf("MMMM") >= 0) {
            datePickerFormat = datePickerFormat.replaceAll("MMMM", "MM");

        } else if (datePickerFormat.indexOf("MMM") >= 0) {
            // Month name short
            datePickerFormat = datePickerFormat.replaceAll("MMM", "M");
        } else if (datePickerFormat.indexOf("MM") >= 0) {
            // Month two digits
            datePickerFormat = datePickerFormat.replaceAll("MM", "m");
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
        datePickerFormat = datePickerFormat.replaceAll("dddd", "DD");

        return datePickerFormat;
    },

    /*
    *   Get value
    */
    getValue: function () {
        var self = this;
        var from = bizagi.util.dateFormatter.formatInvariant(self.date.values.min, false);
        var to = bizagi.util.dateFormatter.formatInvariant(self.date.values.max, false);

        return { time: { dateFrom: from, dateTo: to} };
    },

    /*
    *   Set value
    */
    setValue: function (min, max) {
        var self = this;

        //Set min and max values
        self.$elementEnd.datepicker("option", "minDate", min);
        self.$elementStart.datepicker("option", "maxDate", max);

        //Update date model values
        self.date.values.min = min;
        self.date.values.max = max;

        //Update default values
        self.$elementStart.datepicker("option", "defaultDate", min);
        self.$elementEnd.datepicker("option", "defaultDate", max);

        //Set fields values
        self.$elementStart.val(bizagi.util.dateFormatter.formatDate(min, self.properties.dateFormat));
        self.$elementEnd.val(bizagi.util.dateFormatter.formatDate(max, self.properties.dateFormat));

        //Set date slider values
        self.dateSlider.dateRangeSlider("values", min, max);

        // Publish an event
        self.publish("filterbytime", self.getValue());
    },

    /*
    *   E V E N T  H A N D L E R S
    */
    selectPicker: function () {

        var self = this;

        var endDate = self.$elementEnd.datepicker("getDate"),
            startDate = self.$elementStart.datepicker("getDate");

        self.setValue(startDate, endDate);

    },

    changeSlider: function (e, data) {

        var self = this;
        var min = data.values.min;
        var max = data.values.max;

        self.setValue(min, max);
    },

    /*
    * Events for date buttons
    */
    setDateRange: function ($element) {

        var self = this;
        var num = $element.data('value').split("-");
        var dateTo = new Date();
        var dateFrom = new Date();

        switch (num[1]) {
            case "day":
                dateFrom.setDate(dateTo.getDate() - parseInt(num[0]));
                break;
            case "month":
                dateFrom.setMonth(dateTo.getMonth() - parseInt(num[0]));
                break;
            case "year":
                dateFrom.setFullYear(dateTo.getFullYear() - parseInt(num[0]));
                break;
        }

        self.setValue(dateFrom, dateTo);
    }

});