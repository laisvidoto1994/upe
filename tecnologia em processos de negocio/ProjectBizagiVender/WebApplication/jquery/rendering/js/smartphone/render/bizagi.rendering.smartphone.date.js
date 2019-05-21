/*
*   Name: BizAgi smartphone Render Date Extension
*   Author: Oscar O
*   Comments:
*   -   This script will redefine the Date render class to adjust to tablet devices
*/

//queda pendiente el max y min fecha por que no hay mocks o un caso con esa opcion disponible observar comentarios dice como se realizaria.

bizagi.rendering.date.extend("bizagi.rendering.date", {}, {



    renderSingle: function () {

        var self = this;
        var properties = self.properties;
        var container = self.getContainerRender();
        var control = self.getControl();
        var dateToShow = "";



        //the edition inline only available for ios 5 
        if (bizagi.util.isCordovaSupported() && properties.editable && bizagi.util.isIphoneHigherIOS5()) {

            dateToShow = $("<span></span>");
            dateToShow.appendTo(control);

            if (!properties.showTime) {

                container.addClass("bz-command-edit-inline");

                var dateTmpl = self.renderFactory.getTemplate("edition.date");

                self.input = self.input = (control.find("input").length == 0) ? $.tmpl(dateTmpl) : control;
                self.input = self.input.find("input");

                self.input.get(0).type = 'date';

                $(self.input).addClass("ui-bizagi-render-date-hide-input");
                if (properties.displayType != "reversed") {
                    $(self.input).css({ left: "45%" });
                }

                self.input.appendTo(control);
                $(self.input).bind("focusout", function (e) {
                    self.onChangeHandler();
                });

                $(self.input).change(function () {
                    var valueChanged = $(this).val();
                    if (valueChanged == "" || valueChanged == null) {
                        dateToShow = $("span", self.getControl());
                        dateToShow.html("");
                    }
                });

                return;

            }
        }


        var textTmpl = self.renderFactory.getTemplate("text");
        self.input = $.tmpl(textTmpl).appendTo(control);

        //if ios
        if (dateToShow != "") {
            $(control.find("input")).addClass("ui-bizagi-render-date-hide-input");
            if (properties.displayType != "reversed") {
                $(control.find("input")).css({ left: "45%" });
            }
        }


        if (!properties.editable) {
            container.addClass("bz-command-not-edit");
            self.input.attr('readonly', "readonly");
        }

    },

    setDisplayValue: function (value) {

        var self = this;
        var properties = self.properties;
        var control = self.getControl();


        var date = bizagi.util.dateFormatter.getDateFromInvariant(value, self.properties.showTime);
        var dateFormated = null;
        if (date != 0) {
            dateFormated = bizagi.util.dateFormatter.formatDate(date, properties.fullFormat);
        }
        self.input.html(dateFormated || value);
        self.input.val(dateFormated || value);
        self.setValue(value, false);


        if (bizagi.util.isCordovaSupported() && properties.editable && bizagi.detectDevice() == "smartphone_ios") {
            var objDate = bizagi.util.dateFormatter.getDateFromInvariant(value);
            var year = objDate.getFullYear();
            var month = objDate.getMonth() + 1;
            var day = objDate.getDate();
            var dateToShow = $("span", control);
            dateToShow.html(dateFormated || value);

            if (month < 10) {
                month = '0' + month;
            }

            if (day < 10) {
                day = '0' + day;
            }

            self.input.prop('value', year + '-' + month + '-' + day);
        }


    },

    getDateControl: function () {

        var self = this;
        var inputDate = $("<input/>");
        if (self.properties.showTime && !self.inputEdition) {
            inputDate.val(self.value.split(" ")[0]);
            return inputDate;
        } else if (!self.properties.showTime && !self.inputEdition) {
            inputDate.val(self.value);
            return inputDate;
        } else {
            return self.inputEdition.children(".ui-bizagi-render-edit-date");
        }

    },

    getTimeControl: function () {

        var self = this;
        var inputTime = $("<input/>");
        if (self.properties.showTime && !self.inputTime) {
            inputTime.val(self.value.split(" ")[1]);
            return inputTime;
        } else {
            return self.inputTime;
        }

    },

    getMaxDateInvariant: function () {
        var self = this;
        var maxDate = null;

        if (self.properties.maxValue) {
            maxDate = bizagi.util.dateFormatter.getDateFromInvariant(self.properties.maxValue, self.properties.showTime);
            return maxDate;
        } else {
            maxDate = new Date();
            maxDate.setYear(maxDate.getFullYear() + 100);
            return maxDate;
        }

    },

    getMinDateInvariant: function () {
        var self = this;
        var minDate = null;

        if (self.properties.minValue) {
            minDate = bizagi.util.dateFormatter.getDateFromInvariant(self.properties.minValue, self.properties.showTime);
            return minDate;
        } else {
            minDate = new Date();
            minDate.setYear(minDate.getFullYear() - 100);
            return minDate;
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

    renderEdition: function () {

        var self = this;
        var properties = self.properties;
        var container = self.getContainerRender();
        var control = self.getControl();
        var textTmpl = self.renderFactory.getTemplate("edition.date");
        var timeTmpl = self.renderFactory.getTemplate("edition.time");

        self.inputEdition = $.tmpl(textTmpl);

        self.inputTime = $.tmpl(timeTmpl);
        //endYear
        if (bizagi.util.isIphoneHigherIOS5()) {

            self.getDateControl().get(0).type = 'date';

            if (properties.showTime) {

                self.inputTime.appendTo(self.inputEdition);

            }

        } else {

            (properties.showTime) ? (presetType = 'datetime', widthtype = 60) : (presetType = 'date', widthtype = 80);

            var dateParams = { display: 'inline', endYear: (new Date().getFullYear() + 10), mode: 'mixed', theme: 'android-ics', preset: presetType, dateFormat: "mm/dd/yyyy", ampm: false, timeFormat: 'HH:ii:ss', seconds: true, showOnFocus: 'true', width: widthtype, onSelect: function (valueText, inst) { self.onSelect(valueText, inst); }, onClose: function (valueText, inst) { self.onClose(valueText, inst); } };
            var maxDate = self.getMaxDateInvariant();
            var minDate = self.getMinDateInvariant();

            dateParams.maxDate = maxDate;
            dateParams.minDate = minDate;

            self.getDateControl().scroller(dateParams);
            self.getDateControl().hide();
            self.getTimeControl().hide();
        }

    },

    setDisplayValueEdit: function (value) {

        var self = this;
        var properties = self.properties;
        var objDate = bizagi.util.dateFormatter.getDateFromInvariant(value);

        if (!bizagi.util.isIphoneHigherIOS5()) {

            self.getDateControl().scroller('setDate', objDate, true);

            // self.getDateControl().hide();

            /*maxDate	Date	null	 Maximum date that can be selected

            minDate	Date	null	 Minimum date that can be selected*/

        }

        else {

            var year = objDate.getFullYear();
            var month = objDate.getMonth() + 1; // zero based
            var day = objDate.getDate();

            if (month < 10) {
                month = '0' + month;
            }

            if (day < 10) {
                day = '0' + day;
            }

            self.getDateControl().prop('value', year + '-' + month + '-' + day);

            // min="2011-01-01" max="2015-12-31"

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

                self.getTimeControl().prop('value', hour + ':' + minutes + ':' + seconds);
            }

        }



    },

    onSelect: function (valueText, inst) {

        var self = this;

        self.setValue(valueText, false);

        self.input.html(valueText);
        self.input.val(valueText);
    },

    onClose: function (valueText, inst) {

        var self = this;

        var contexttmp = self.getFormContainer().container.find("#container-items-edit")

        $(".ui-bizagi-container-button-edit .ui-bizagi-cancel-btn", contexttmp).click();

    },

    actionSave: function () {

        var self = this;
        var properties = self.properties;

        if (bizagi.util.isIphoneHigherIOS5()) {

            var valueDate = self.getDateControl().val();
            var valueTime = self.getTimeControl();
            var currentTime = (properties.showTime && valueTime && valueTime.val() != "") ? " " + valueTime.val() : " 00:00:00";
            var fullDate = valueDate.length > 0 ? valueDate + currentTime : bizagi.util.dateFormatter.formatISO(new Date(), false) + currentTime;
            var dateToShow = $("span", self.getControl());

            fullDate = bizagi.util.dateFormatter.getDateFromISO(fullDate, true);

            self.setValue(bizagi.util.dateFormatter.formatInvariant(fullDate, properties.showTime));

            self.input.html(bizagi.util.dateFormatter.formatDate(fullDate, properties.fullFormat));
            self.input.val(bizagi.util.dateFormatter.formatDate(fullDate, properties.fullFormat));
            dateToShow.html(bizagi.util.dateFormatter.formatDate(fullDate, properties.fullFormat));
        }

        else {

            //replace for -

            var date = self.getDateControl().scroller('getDate');

            self.setValue(bizagi.util.dateFormatter.formatInvariant(date, properties.showTime));

            self.input.html(bizagi.util.dateFormatter.formatDate(date, properties.fullFormat)); //date);
            self.input.val(bizagi.util.dateFormatter.formatDate(date, properties.fullFormat));

            if (properties.showTime) {

                self.inputTime.val(bizagi.util.dateFormatter.formatDate(date, properties.timeFormat));

            }

            //self.getDateControl().val(bizagi.util.dateFormatter.formatDate(date, properties.fullFormat))

        }



        /* if (self.properties.submitOnChange)

        self.submitOnChange();*/



    },
    /*
    *   set the value when the control change only available for ios greather than 5
    */
    onChangeHandler: function () {
        var self = this;
        var properties = self.properties;
        var dateControl = self.input;

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

            if (fullDate > maxDate || fullDate < minDate) {
                dateControl.parent().addClass("ui-bizagi-render-error");
                var message = bizagi.localization.getResource("workportal-general-invalid-date");
                message = message.replace("{0}", properties.displayName);
                message = message.replace("<strong>", "");
                message = message.replace("</strong>", "");
                self.setValidationMessage(message);

                dateControl.prop('value', "");

                //set the span value
                var dateToShow = $("span", self.getControl());
                dateToShow.html("");

            } else {
                if (self.containerMessage) {
                    self.containerMessage.find("span").remove();
                }

                // Set date value
                self.setValue(bizagi.util.dateFormatter.formatInvariant(fullDate, false));

                // Set display value
                properties.displayValue = bizagi.util.dateFormatter.formatDate(fullDate, properties.fullFormat);

                //set the span value
                var dateToShow = $("span", self.getControl());
                dateToShow.html(bizagi.util.dateFormatter.formatDate(fullDate, properties.fullFormat));


                if (bizagi.detectDevice() == "tablet_android") {
                    dateControl.prop('value', properties.displayValue);
                }
            }
        }
    }


}); 