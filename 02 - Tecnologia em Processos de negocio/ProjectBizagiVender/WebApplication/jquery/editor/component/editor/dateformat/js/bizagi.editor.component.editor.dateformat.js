/*
@title: Editor dateformat
@authors: Rhony Pedraza / Ramiro Gomez
@date: 22-jun-12
@update: 02-nov-2012
*/
bizagi.editor.component.editor(
    "bizagi.editor.component.editor.dateformat", {
        init: function (canvas, model, controller) {
            this._super(canvas, model, controller);
        },
        renderEditor: function (container, data) {

            var elEditor, elPopUpContent, elPopUpActions, elOkButton, elCancelButton, calculatedShowTime, values, isShortDateActive, lblRequired, self = this;

            self.showTime = data["editor-parameters"].showtime.value;
            calculatedShowTime = (data["editor-parameters"].showtime.value === true) ? "dateformat-show-time" : "dateformat-not-show-time";

            values = self.retrieveValues(data.value);

            $.extend(data, values, { showTime: calculatedShowTime });

            elEditor = $.tmpl(self.getTemplate("frame"), data);
            elEditor.appendTo(container);

            lblRequired = $('label', elEditor);
            self.addRequired(lblRequired);

            self.data = data;
            // saves input value
            self.inputValue = data.value;

            self.inline = true;


            // modal
            self.elPopUpContent = elPopUpContent = $.tmpl(self.getTemplate("modal-content"), data);
            self.elPopUpActions = elPopUpActions = $.tmpl(self.getTemplate("modal-actions-editor"), {});


            data.initValueDateFormat = data.initValueShortDate = false;

            if (values.valueDate === bizagi.localization.getResource("formmodeler-component-editor-dateformat-default-format")) {
                data.initValueDateFormat = true;
            }

            $('.dateformat-options-default-format-false', elPopUpContent).hide();
            $('.dateformat-options-short-date-false', elPopUpContent).hide();



            if (!self.showTime) {
                $('.dateformat-format .dateformat-modal-item', elPopUpContent).removeClass('dateformat-col2').addClass('dateformat-col1');
                $('.dateformat-modal-time-format', elPopUpContent).parent().hide();
            } else {
                $('.dateformat-format .dateformat-modal-item', elPopUpContent).removeClass('dateformat-col1').addClass('dateformat-col2');
                $('.dateformat-modal-time-format', elPopUpContent).parent().show();
            }

            //create a data from Maps self.formats
            self.createEditorDataSources(data);
            //create all Combos from self.data
            isShortDateActive = self.isShortDate(data);
            self.createEditorUIControls(data, elPopUpContent);

            if (self.showTime) {
                self.populate(self.showTime, { dateFormatSelected: values.valueDate, timeFormatSelected: values.valueTime });

            } else {
                self.populate(self.showTime, { dateFormatSelected: data.value });
            }

            //
            if (self.showTime) {
                $(".dateformat-modal-time", self.elPopUpContent).show();
            } else {
                $(".dateformat-modal-time", self.elPopUpContent).hide();
            }

            elOkButton = $('.biz-action-btn', elPopUpActions).eq(0);
            elCancelButton = $('.biz-action-btn', elPopUpActions).eq(1);
            elOkButton.click(function (event) { self.responseOkButton.apply(self, [elOkButton, event]); });
            elCancelButton.click(function (event) { self.responseCancelButton.apply(self, [elCancelButton, event]); });


            self.dialogReference = self.createDialog(self.elPopUpContent, self.elPopUpActions);
            if (isShortDateActive) {
                $('.dateformat-options-short-date-false', self.dialogReference).show();
            }

        },
        isShortDate: function (data) {
            var shortDate = { value: false, index: 0 };
            var shortDateSeparator = data.uiSelect.shortDateSeparator.uiValues;
            var valueDate = data.value;
            if (valueDate) {
                for (var i = 0; i < shortDateSeparator.length; i++) {
                    var inOf = valueDate.indexOf(shortDateSeparator[i].value);
                    if (inOf != -1) {
                        shortDate = { value: true, index: i };
                        break;
                    }
                }
            }

            $.extend(data, { shortDate: shortDate });

            return shortDate.value;
        },
        // Create UICOntrols
        createEditorUIControls: function (data, elPopUpContent) {
            var self = this;
            self.shortDateComboBox = new self.uiControls.comboBox(
            {
                uiEditor: self,
                uiContainer: $(".ui-control-editor.dateformat-short-date", elPopUpContent),
                uiInitValue: data.uiSelect.shortDateSeparator.uiValues[data.shortDate.index].value,
                uiValues: data.uiSelect.shortDateSeparator.uiValues,
                uiInline: self.inline,
                onChange: function (elValue, event) {
                    self.responseShortDateComboChange(elValue, event);
                }
            });

            self.dateFormatComboBox = new self.uiControls.comboBox(
            {
                uiEditor: self,
                uiContainer: $(".ui-control-editor.date-format", elPopUpContent),
                uiInitValue: data.value,
                uiValues: data.uiSelect.normalDateFormat.uiValues,
                uiInline: self.inline,
                onChange: function (elValue, event) {
                    //
                    self.responseDateFormatComboChange(elValue, event);
                }
            });

            self.timeFormatComboBox = new self.uiControls.comboBox(
            {
                uiEditor: self,
                uiContainer: $(".ui-control-editor.time-format", elPopUpContent),
                uiValues: data.uiSelect.timesDateFormat.uiValues,
                uiInline: self.inline,
                onChange: function (elValue, event) {
                    //
                    self.responseTimeFormatComboChange(elValue, event);
                }
            });
            /*
            UI Controls
            bizagi.editor.component.editor.uiControls.booleanSwitch
            */
            self.mySwitchDefaultFormat = new self.uiControls.booleanSwitch(
            {
                uiEditor: self,
                uiInitValue: data.initValueDateFormat,
                uiContainer: $('.dateformat-modal-default-format', elPopUpContent),
                uiValues: data.dateFormatUIValues.uiValues,
                uiInline: self.inline,
                onChange: function (elValue, event) {
                    self.responseChangeDefaultFormat(elValue, event, self);
                }
            });

            /*
            UI Controls
            bizagi.editor.component.editor.uiControls.booleanSwitch
            */
            self.mySwitchShortDate = new self.uiControls.booleanSwitch(
            {
                uiEditor: self,
                uiInitValue: data.shortDate.value,
                uiContainer: $('.dateformat-modal-short-date', elPopUpContent),
                uiValues: data.shortDateUIValues.uiValues,
                uiInline: self.inline,
                onChange: function (elValue, event) {
                    self.responseChangeShortDate(elValue, event, self);
                }
            });
        },
        // Generate a datasource for UIControls
        createEditorDataSources: function (data) {
            /* comboBox */
            $.extend(data, {
                "uiSelect": {
                    "shortDateSeparator": {
                        "uiValues":
                        [
                        { "label": "/", "value": "/", icon: "separator" },
                        { "label": ".", "value": ".", icon: "separator" },
                        { "label": "-", "value": "-", icon: "separator" }
                        ]
                    },
                    "shortDateFormat": {
                        "uiValues":
                        [
                        { "label": "M*d*yyyy", "value": "m*d*yy", "icon": "date" },
                        { "label": "M*d*yy", "value": "m*d*y", "icon": "date" },
                        { "label": "MM*dd*yy", "value": "mm*dd*y", "icon": "date" },
                        { "label": "MM*dd*yyyy", "value": "mm*dd*yy", "icon": "date" },
                        { "label": "yy*MM*dd", "value": "y*mm*dd", "icon": "date" },
                        { "label": "yyyy*MM*dd", "value": "yy*mm*dd", "icon": "date" },
                        { "label": "dd*MM*yyyy", "value": "dd*mm*yy", "icon": "date" },
                        { "label": "dd*MMM*yy", "value": "dd*M*y", "icon": "date" },
                        { "label": "dd*MM*yy", "value": "dd*mm*y", "icon": "date" }
                        ]
                    },
                    "normalDateFormat": {
                        "uiValues":
                        [
                        { "label": "dddd, MMMM dd, yyyy", "value": "DD, MM dd, yy", "icon": "date" },
                        { "label": "MMMM dd, yyyy", "value": "MM dd, yy", "icon": "date" },
                        { "label": "dddd, dd MMMM, yyyy", "value": "DD, dd MM, yy", "icon": "date" },
                        { "label": "dd MMMM, yyyy", "value": "dd MM, yy", "icon": "date" }
                        ]
                    },
                    "timesDateFormat": {
                        "uiValues":
                        [
                        { "label": "hh:mm:ss tt", "value": { "format": "hh:mm:ss tt", "ampm": true }, "icon": "hour" },
                        { "label": "h:mm:ss tt", "value": { "format": "h:mm:ss tt", "ampm": true }, "icon": "hour" },
                        { "label": "H:mm:ss", "value": { "format": "H:mm:ss", "ampm": false }, "icon": "hour" },
                        { "label": "HH:mm:ss", "value": { "format": "HH:mm:ss", "ampm": false }, "icon": "hour" }
                        ]
                    }
                }
            });

            /* booleanSwitch */
            $.extend(data, {
                dateFormatUIValues: {
                    uiValues:
                    [
                    { label: bizagi.localization.getResource("formmodeler-component-editor-dateformat-true"), value: "true" },
                    { label: bizagi.localization.getResource("formmodeler-component-editor-dateformat-false"), value: "false" }
                    ]
                },
                shortDateUIValues: {
                    uiValues:
                    [
                    { label: bizagi.localization.getResource("formmodeler-component-editor-dateformat-true"), value: "true" },
                    { label: bizagi.localization.getResource("formmodeler-component-editor-dateformat-false"), value: "false" }
                    ]
                }
            });

            return data;
        },
        // 
        responseShortDateComboChange: function () {
            var self = this, valueTime, valueDate;

            valueDate = self.dateFormatComboBox.value;

            if (self.showTime) {
                valueTime = self.timeFormatComboBox.value.format;
                self.populate(self.showTime, { dateFormatSelected: valueDate, timeFormatSelected: valueTime });
            } else {
                self.populate(self.showTime, { dateFormatSelected: valueDate });
            }
        },
        responseDateFormatComboChange: function () {
            var self = this, valueDate, valueTime;

            valueDate = self.dateFormatComboBox.label;

            if (self.showTime) {
                valueTime = self.timeFormatComboBox.value.format;
                self.populate(self.showTime, { dateFormatSelected: valueDate, timeFormatSelected: valueTime });
            } else {
                self.populate(self.showTime, { dateFormatSelected: valueDate });
            }
        },
        responseTimeFormatComboChange: function () {
            var self = this, valueDate, valueTime;

            valueTime = self.timeFormatComboBox.value.format;
            valueDate = self.dateFormatComboBox.label;

            self.populate(self.showTime, { dateFormatSelected: valueDate, timeFormatSelected: valueTime });
        },
        changeItems: function (state, classes, showTime, panel) {
            var self = this, i, classToRemove, classToAdd, arrowPosition;

            arrowPosition = $('[class*="ui-modal-arrow"]', self.element).position();
            if (arrowPosition) {
                $('[class*="ui-modal-arrow"]', self.element).css('top', arrowPosition.top);
            }

            if (state == "disabled") {
                classToRemove = "dateformat-enabled";
                classToAdd = "dateformat-disabled";
            } else {
                classToRemove = "dateformat-disabled";
                classToAdd = "dateformat-enabled";
            }

            panel = (panel) ? panel : '.empty';

            if (state == "disabled") {
                $(panel).slideUp({
                    step: function () {
                        self.updateDialogPosition(false);
                    }
                });
            }

            for (i = 0; i < classes.length; i++) {
                if (!showTime && classes[i] === "dateformat-modal-short-date-separator") { // not change short date separator
                    continue;
                } else {
                    $(".dateformat-modal ." + classes[i]).parent().removeClass(classToRemove).addClass(classToAdd);
                }
            }

            if (state === "enabled") {
                $(panel).slideDown(
                    { step: function () {
                        self.updateDialogPosition(false);
                    },
                        complete: function () {
                            $(this).css('overflow', 'visible');
                        }
                    });
            }

            /* if (self.showTime) {
            self.populate(self.showTime, { dateFormatSelected: values.valueDate, timeFormatSelected: values.valueTime });

            } else {
            self.populate(self.showTime, { dateFormatSelected: self.data.value });
            }*/
            self.createSampleInputText();
        },
        populate: function (showTime, params) {
            var self = this,
            separator,
            i,
            isShortDate,
            format,
            time,
            hasDateFormatSelected,
            dateFormatSelectDataSource,
            timeFormatSelectDataSource;

            isShortDate = self.mySwitchShortDate.getValue();
            hasDateFormatSelected = params.hasOwnProperty("dateFormatSelected");
            dateFormatSelectDataSource = [];

            if (isShortDate) {

                separator = self.shortDateComboBox.getValue();
                for (i = 0; i < self.data.uiSelect.shortDateFormat.uiValues.length; i++) {
                    format = {
                        label: self.data.uiSelect.shortDateFormat.uiValues[i].label.replace(/\*/g, separator),
                        value: self.data.uiSelect.shortDateFormat.uiValues[i].value.replace(/\*/g, separator),
                        icon: "date"
                    };

                    if (hasDateFormatSelected & format.label === params.dateFormatSelected) {
                        format.selected = "selected";
                    }
                    dateFormatSelectDataSource.push(format);
                }
                self.dateFormatComboBox.update(dateFormatSelectDataSource);

            } else {

                for (i = 0; i < self.data.uiSelect.normalDateFormat.uiValues.length; i++) {

                    format = {
                        label: self.data.uiSelect.normalDateFormat.uiValues[i].label,
                        value: self.data.uiSelect.normalDateFormat.uiValues[i].value,
                        icon: "date"
                    };

                    if (hasDateFormatSelected & format.label === params.dateFormatSelected) {
                        format.selected = "selected";
                    }

                    dateFormatSelectDataSource.push(format);
                }
                self.dateFormatComboBox.update(dateFormatSelectDataSource);

            }

            if (self.showTime) {
                timeFormatSelectDataSource = [];

                for (i = 0; i < self.data.uiSelect.timesDateFormat.uiValues.length; i++) {

                    time = {
                        label: self.data.uiSelect.timesDateFormat.uiValues[i].label,
                        value: self.data.uiSelect.timesDateFormat.uiValues[i].value,
                        icon: "date"
                    };

                    if (time.value.format === params.timeFormatSelected) {
                        time.selected = "selected";
                    }

                    timeFormatSelectDataSource.push(time);
                }
                self.timeFormatComboBox.update(timeFormatSelectDataSource);
            }

            self.createSampleInputText();

        },
        createSampleInputText: function () {
            var self = this, date, objectTime, valueTime, dateSampleInput;

            dateSampleInput = $(".dateformat-modal-date-sample", self.dialogReference);
            if (self.showTime) {

                date = new Date();
                objectTime = { hour: date.getHours(), minute: date.getMinutes(), second: date.getSeconds() };
                valueTime = self.timeFormatComboBox.getValue();
                dateSampleInput.text($.datepicker.formatDate(self.dateFormatComboBox.getValue(), date) + " " + $.datepicker.formatTime(valueTime.format, objectTime, { ampm: valueTime.ampm }));
            } else {
                date = new Date();
                dateSampleInput.text($.datepicker.formatDate(self.dateFormatComboBox.getValue(), date));
            }
        },
        retrieveValues: function (value) {
            var date, time, pos;
            if (value === null || value === undefined || value === "") {
                date = bizagi.localization.getResource("formmodeler-component-editor-dateformat-default-format");
                time = "";
            } else {
                pos = value.search(/h|H/);
                if (pos == -1) {
                    date = bizagi.util.trim(value.slice(0));
                    time = "";
                } else {
                    date = bizagi.util.trim(value.slice(0, pos));
                    time = value.slice(pos);
                }
            }
            return {
                valueDate: date,
                valueTime: time
            };
        },
        remove: function () {
            this.element.hide();
            this.element.empty();
        },
        loadTemplates: function () {
            var deferred = $.Deferred();
            $.when(
                this.loadTemplate("frame", bizagi.getTemplate("bizagi.editor.component.editor.dateformat").concat("#dateformat-frame")),
                this.loadTemplate("frame-options", bizagi.getTemplate("bizagi.editor.component.editor.dateformat").concat("#dateformat-frame-options")),
                this.loadTemplate("modal-content", bizagi.getTemplate("bizagi.editor.component.editor.dateformat").concat("#dateformat-modal")),
                this.loadTemplate("modal-actions-editor", bizagi.getTemplate("bizagi.editor.component.editor.dateformat").concat("#dateformat-modal-actions"))
                ).done(function () {
                    deferred.resolve();
                });
            return deferred.promise();
        },
        responseChangeDefaultFormat: function (elValue, event, self) {

            var classes, useShortDate, useDefaultFormat;

            useShortDate = elValue;

            if (!elValue) {
                useDefaultFormat = false;
            } else {
                useDefaultFormat = true;
            }

            if (self.showTime) {
                classes = [
                "dateformat-modal-short-date", "dateformat-modal-date-format",
                "dateformat-modal-time-format", "dateformat-modal-date-sample"
                ];
            } else {
                classes = ["dateformat-modal-short-date", "dateformat-modal-date-format", "dateformat-modal-date-sample"];
            }

            if (useShortDate) { classes.push("dateformat-modal-short-date-separator"); }

            if (useDefaultFormat) {
                self.changeItems("disabled", classes, self.showTime, '.dateformat-options-default-format-false');
            } else {
                self.changeItems("enabled", classes, self.showTime, '.dateformat-options-default-format-false');
            }
        },
        responseChangeShortDate: function (elValue, event, self) {

            if (elValue) {
                self.changeItems("enabled", ["dateformat-modal-short-date-separator"], self.showTime, '.dateformat-options-short-date-false');
            } else {
                self.changeItems("disabled", ["dateformat-modal-short-date-separator"], self.showTime, '.dateformat-options-short-date-false');
            }

            if (!elValue) {
                self.dateFormatComboBox.update(self.data.uiSelect.normalDateFormat.uiValues);
            } else {
                var  valueDate=self.dateFormatComboBox.getLabel();
                if (self.showTime) {
                    var valueTime = self.timeFormatComboBox.value.format;
                    self.populate(self.showTime, { dateFormatSelected: valueDate, timeFormatSelected: valueTime });
                } else {
                    self.populate(self.showTime, { dateFormatSelected: valueDate });
                }
            }

        },
        ".dateformat-fields > input click": function (el) {
            var self = this;
            self.openDialog(el);
        },
        ".dateformat-fields > i:eq(1) click": function (el) {
            var self = this;
            self.openDialog(el);
        },
        openDialog: function (el) {

            var self = this, values, initValueDateFormat;
            self.showDialog(el);
            values = self.retrieveValues(self.options.value);

            if (values.valueDate === bizagi.localization.getResource("formmodeler-component-editor-dateformat-default-format")) {
                initValueDateFormat = true;
            } else {
                initValueDateFormat = false;
            }

            self.mySwitchDefaultFormat.update(initValueDateFormat);
            self.responseChangeDefaultFormat(initValueDateFormat, null, self);
        },
        responseOkButton: function (el, event) {
            var self = this, date, time, valueDate, valueTime, dateFormatFieldValue;
            date = $(".dateformat-fields .dateformat-field-date", self.element);
            time = $(".dateformat-fields .dateformat-field-time", self.element);
            // reset
            date.val("");
            time.val("");

            dateFormatFieldValue = self.mySwitchDefaultFormat.getValue();

            this.hideDialog(function () {

                if (dateFormatFieldValue) {
                    date.val("Default Format");
                    self.controller.publish("propertyEditorChanged", { typeEvent: bizagi.editor.component.properties.events.PROPERTIES_CHANGE_PROPERTY, oldValue: self.inputValue, newValue: "", data: "", type: self.options.name, id: self.element.closest(".bizagi_editor_component_properties").data("id") });
                    self.inputValue = "";
                } else {
                    valueDate = self.dateFormatComboBox.getLabel();
                    var options;
                    if (self.showTime) {
                        valueTime = self.timeFormatComboBox.getValue();
                        date.val(valueDate);
                        time.val(valueTime.format);
                        self.controller.publish("propertyEditorChanged", { typeEvent: bizagi.editor.component.properties.events.PROPERTIES_CHANGE_PROPERTY, oldValue: self.inputValue, newValue: valueDate + " " + valueTime.format, data: valueDate + " " + valueTime.format, type: self.options.name, id: self.element.closest(".bizagi_editor_component_properties").data("id") });
                        self.inputValue = valueDate + " " + valueTime.format;
                    } else {
                        date.val(valueDate);
                        options = {
                            typeEvent: bizagi.editor.component.properties.events.PROPERTIES_CHANGE_PROPERTY,
                            oldValue: self.inputValue,
                            newValue: valueDate,
                            data: valueDate,
                            type: self.options.name,
                            id: self.element.closest(".bizagi_editor_component_properties").data("id")
                        };
                        self.controller.publish("propertyEditorChanged", options);
                        self.inputValue = valueDate;
                    }
                }
            });
        },
        responseCancelButton: function (el, event) {
            this.hideDialog();
        },

        ".editor-modal .header span:eq(0) click": function (el, event) {
            this.hideDialog();
        }
    }
);