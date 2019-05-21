/*
@title: Editor defaultvalue
@authors: Rhony Pedraza
@date: 06-jul-12
*/
bizagi.editor.component.editor(
    "bizagi.editor.component.editor.defaultvalue", {

        /*
        * Constructor
        */
        init: function (canvas, model, controller) {
            this._super(canvas, model, controller);
        },

        /*
        * Process the information about of editor and render it
        */
        renderEditor: function (container, data) {
            var self = this;

            self.Error = "";
            self.setEditorParameters(data);

            if (!data.value) {
                data.value = self.getIntialValue();
            }

            if (data.value.fixedvalue !== undefined && data.value.fixedvalue !== "") {
                self.state = true;
            } else {
                if (!self.isEmptyRule(data.value)) {
                    self.state = false;
                } else {
                    data.value = self.getIntialValue();
                    self.state = true;
                }
            }

            self.state = self.state || self.isOffline;            
            
            var elEditor = $.tmpl(self.getTemplate("frame"), data);
            elEditor.appendTo(container);
            self.inputValue = data.value;

            if (self.type) {
                self.renderTypeEditor(elEditor, data);
            }
        },

        /*
        * Process the editor parameters
        */
        setEditorParameters: function (data) {
            var self = this;

            self.exclusive = (data["editor-parameters"].exclusive === undefined) ? false : true;
            self.isOffline = data["editor-parameters"].isOffline || false;
            self.type = data["editor-parameters"].type;

            data.isOffline = self.isOffline;
        },


        /*
        * Returns the initial value of property
        */
        getIntialValue: function () {
            var value = { fixedvalue: "" };
            value.rule = {
                baref: {
                    ref: "expression"
                }
            };

            return value;
        },

        retrieveHumanTime: function (date) {
            var hours = date.getHours();
            var minutes = date.getMinutes();
            hours = hours < 10 ? "0" + hours : hours;
            minutes = minutes < 10 ? "0" + minutes : minutes;
            return hours + ":" + minutes + ":00";
        },

        /*
        * Renders the editor depends of type
        */
        renderTypeEditor: function (container, data) {
            var self = this, options;
            switch (self.type) {
                case "date":
                    var showTime = (data["editor-parameters"].showtime.value === true) ? "defaultvalue-show-time" : "defaultvalue-not-show-time";
                    $.extend(data, { showTime: showTime });
                    self.renderDefaultDate(container, data);

                    // set plugin
                    if (data["editor-parameters"].showtime.value === true) {
                        $(".defaultvalue-date-container .defaultvalue-date-value", self.element).will_pickdate({
                            timePicker: true,
                            allowEmpty: true,
                            militaryTime: true,
                            inputOutputFormat: "m/d/Y H:i:s",
                            format: "m/d/Y H:i",
                            onSelect: function (date) {
                                date = $.datepicker.formatDate("mm/dd/yy", date) + " " + self.retrieveHumanTime(date);
                                options = {
                                    typeEvent: bizagi.editor.component.properties.events.PROPERTIES_CHANGE_PROPERTY,
                                    oldValue: self.inputValue,
                                    newValue: { fixedvalue: date },
                                    data: { fixedvalue: date },
                                    type: data.name,
                                    id: self.element.closest(".bizagi_editor_component_properties").data("id")
                                };
                                if (self.exclusive) {
                                    $.extend(options, { exclusive: true });
                                }
                                self.controller.publish("propertyEditorChanged", options);
                                self.inputValue = { fixedvalue: date };
                            }
                        });
                    } else {
                        $(".defaultvalue-date-container .defaultvalue-date-value", self.element).will_pickdate({
                            allowEmpty: true,
                            militaryTime: true,
                            inputOutputFormat: "m/d/Y",
                            format: "m/d/Y",
                            onSelect: function (date) {
                                date = $.datepicker.formatDate("mm/dd/yy", date);
                                options = {
                                    typeEvent: bizagi.editor.component.properties.events.PROPERTIES_CHANGE_PROPERTY,
                                    oldValue: self.inputValue,
                                    newValue: { fixedvalue: date },
                                    data: { fixedvalue: date },
                                    type: data.name,
                                    id: self.element.closest(".bizagi_editor_component_properties").data("id")
                                };
                                if (self.exclusive) {
                                    $.extend(options, { exclusive: true });
                                }
                                self.controller.publish("propertyEditorChanged", options);
                                self.inputValue = { fixedvalue: date };
                            }
                        });
                    }
                    break;
                case "number":
                    var allowDecimals = (data["editor-parameters"].allowdecimals.value === true) ? "defaultvalue-allowdecimals" : "defaultvalue-not-allowdecimals";
                    $.extend(data, { allowDecimals: allowDecimals });
                    this.renderDefaultNumber(container, data);
                    // validation
                    var regNumber;
                    if (data["editor-parameters"].allowdecimals.value === true) {
                        regNumber = /(^$)|(^-?(0|[1-9][0-9]*)\.[0-9]+$)/;
                        self.Error += bizagi.localization.getResource("formmodeler-component-editor-int-error-integer");
                    } else {
                        regNumber = /(^$)|(^-?(0|[1-9][0-9]*)$)/;
                        self.Error += bizagi.localization.getResource("formmodeler-component-editor-int-error-integer");
                    }

                    $(".defaultvalue-number-container .defaultvalue-number-value", self.element).keydown(function (event) {
                        if (event.keyCode == 13) {
                            if (regNumber.test($(this).val())) {
                                self.hideError($(this));
                                options = {
                                    typeEvent: bizagi.editor.component.properties.events.PROPERTIES_CHANGE_PROPERTY,
                                    oldValue: self.inputValue,
                                    newValue: { fixedvalue: $(this).val() },
                                    data: { fixedvalue: $(this).val() },
                                    type: data.name,
                                    id: self.element.closest(".bizagi_editor_component_properties").data("id")
                                };
                                if (self.exclusive) {
                                    $.extend(options, { exclusive: true });
                                }
                                self.controller.publish("propertyEditorChanged", options);
                                self.inputValue = { fixedvalue: $(this).val() };
                            } else {
                                self.showError($(this), self.Error);
                                $(this).select();
                            }
                        }
                    });

                    $(".defaultvalue-number-container .defaultvalue-number-value", self.element).blur(function (event) {
                        if (regNumber.test($(this).val())) {
                            self.hideError($(this));
                            options = {
                                typeEvent: bizagi.editor.component.properties.events.PROPERTIES_CHANGE_PROPERTY,
                                oldValue: self.inputValue,
                                newValue: { fixedvalue: $(this).val() },
                                data: { fixedvalue: $(this).val() },
                                type: data.name,
                                id: self.element.closest(".bizagi_editor_component_properties").data("id")
                            };
                            if (self.exclusive) {
                                $.extend(options, { exclusive: true });
                            }
                            self.controller.publish("propertyEditorChanged", options);
                            self.inputValue = { fixedvalue: $(this).val() };
                        } else {
                            self.showError($(this), self.Error);
                            $(this).select();
                        }
                    });
                    break;
                case "string":
                    this.renderDefaultString(container, data);

                    $(".defaultvalue-string-value", self.element).keydown(function (event) {
                        if (event.keyCode == 13) {
                            options = {
                                typeEvent: bizagi.editor.component.properties.events.PROPERTIES_CHANGE_PROPERTY,
                                oldValue: self.inputValue,
                                newValue: { fixedvalue: $(this).val() },
                                data: { fixedvalue: $(this).val() },
                                type: data.name,
                                id: self.element.closest(".bizagi_editor_component_properties").data("id")
                            };
                            if (self.exclusive) {
                                $.extend(options, { exclusive: true });
                            }
                            self.controller.publish("propertyEditorChanged", options);
                            self.inputValue = { fixedvalue: $(this).val() };
                        }
                    });

                    $(".defaultvalue-string-value", self.element).blur(function (event) {
                        options = {
                            typeEvent: bizagi.editor.component.properties.events.PROPERTIES_CHANGE_PROPERTY,
                            oldValue: self.inputValue,
                            newValue: { fixedvalue: $(this).val() },
                            data: { fixedvalue: $(this).val() },
                            type: data.name,
                            id: self.element.closest(".bizagi_editor_component_properties").data("id")
                        };
                        if (self.exclusive) {
                            $.extend(options, { exclusive: true });
                        }
                        self.controller.publish("propertyEditorChanged", options);
                        self.inputValue = { fixedvalue: $(this).val() };
                    });
                    break;
                case "boolean":
                    if (data.value.fixedvalue === undefined || data.value.fixedvalue === null) {
                        data.value.fixedvalue = "";
                    }
                    var booleanState, selectedYes = "", selectedNo = "";
                    if (data.value.fixedvalue === "") {
                        booleanState = "none";
                    } else {
                        booleanState = data.value;
                        if (data.value.fixedvalue === true || data.value.fixedvalue == "true") {
                            selectedYes = " selected";
                        } else {
                            selectedNo = " selected";
                        }
                    }
                    this.renderDefaultBoolean(container, $.extend(data, {
                        booleanState: booleanState.fixedvalue,
                        selectedYes: selectedYes,
                        selectedNo: selectedNo
                    }));

                    if (data.value.fixedvalue !== "") {
                        container.find(".defaultvalue-boolean-value").addClass("active");
                    }

                    $(".defaultvalue-boolean-value > .defaultvalue-boolean-button", self.element).click(function () {
                        options = {
                            typeEvent: bizagi.editor.component.properties.events.PROPERTIES_CHANGE_PROPERTY,
                            oldValue: self.inputValue,
                            type: data.name,
                            id: self.element.closest(".bizagi_editor_component_properties").data("id")
                        };

                        $(".defaultvalue-boolean-value > .defaultvalue-boolean-button", self.element).removeClass("selected");
                        $(this).addClass("selected");

                        if ($(this).hasClass("defaultvalue-boolean-button-yes")) {
                            $.extend(options, {
                                newValue: { fixedvalue: true },
                                data: { fixedvalue: true }
                            });
                            self.inputValue = { fixedvalue: true };
                        } else {
                            $.extend(options, {
                                newValue: { fixedvalue: false },
                                data: { fixedvalue: false }
                            });
                            self.inputValue = { fixedvalue: false };
                        }

                        if (self.exclusive) {
                            $.extend(options, { exclusive: true });
                        }
                        self.controller.publish("propertyEditorChanged", options);
                    });
                    break;
                case "rule":
                    this.renderDefaultRule(container, data);
                    break;
            }
        },
        renderDefaultDate: function (container, data) {
            var elEditorDate;
            elEditorDate = this.state ? $.tmpl(this.getTemplate("frame-date-fixed"), data) : this.renderRule(data);
            elEditorDate.appendTo(container);
        },
        renderDefaultNumber: function (container, data) {
            var elEditorNumber;
            elEditorNumber = this.state ? $.tmpl(this.getTemplate("frame-number-fixed"), data) : this.renderRule(data);
            elEditorNumber.appendTo(container);
        },
        renderDefaultString: function (container, data) {
            var elEditorString;
            elEditorString = this.state ? $.tmpl(this.getTemplate("frame-string-fixed"), data) : this.renderRule(data);
            elEditorString.appendTo(container);
        },
        renderDefaultBoolean: function (container, data) {
            var elEditorBoolean;
            elEditorBoolean = this.state ? $.tmpl(this.getTemplate("frame-boolean-fixed"), data) : this.renderRule(data);
            elEditorBoolean.appendTo(container);
        },
        renderDefaultRule: function (container, data) {
            var elEditorRule;
            elEditorRule = this.state ? $.tmpl(this.getTemplate("frame-onlyrule"), data) : this.renderRule(data);
            elEditorRule.appendTo(container);
        },
        renderRule: function (data) {
            var self = this;

            var rule = self.getRuleValue(data.value);

            if (rule.displayName !== undefined) {
                if (rule.displayName != "") {
                    $.extend(data, { nameRule: rule.displayName });
                } else {
                    $.extend(data, { nameRule: bizagi.localization.getResource("formmodeler-component-editor-defaultvalue-rule") });
                }
            } else {
                $.extend(data, { nameRule: bizagi.localization.getResource("formmodeler-component-editor-defaultvalue-rule") });
            }
            return $.tmpl(this.getTemplate("frame-rule"), data);
        },
        remove: function () {
            this.element.hide();
            this.element.empty();
        },
        loadTemplates: function () {
            var deferred = $.Deferred();
            $.when(
        this.loadTemplate("frame", bizagi.getTemplate("bizagi.editor.component.editor.defaultvalue").concat("#defaultvalue-frame")),
        this.loadTemplate("frame-date-fixed", bizagi.getTemplate("bizagi.editor.component.editor.defaultvalue").concat("#defaultvalue-frame-date-fixed")),
        this.loadTemplate("frame-number-fixed", bizagi.getTemplate("bizagi.editor.component.editor.defaultvalue").concat("#defaultvalue-frame-number-fixed")),
        this.loadTemplate("frame-string-fixed", bizagi.getTemplate("bizagi.editor.component.editor.defaultvalue").concat("#defaultvalue-frame-string-fixed")),
        this.loadTemplate("frame-boolean-fixed", bizagi.getTemplate("bizagi.editor.component.editor.defaultvalue").concat("#defaultvalue-frame-boolean-fixed")),
        this.loadTemplate("frame-rule", bizagi.getTemplate("bizagi.editor.component.editor.defaultvalue").concat("#defaultvalue-frame-rule")),
        this.loadTemplate("frame-onlyrule", bizagi.getTemplate("bizagi.editor.component.editor.defaultvalue").concat("#defaultvalue-frame-onlyrule"))
        ).done(function () {
            deferred.resolve();
        });
            return deferred.promise();
        },
        editCreateRule: function (el, event) {
            var self = this, oldValue, options;
            if (self.options.value.fixedvalue != "") {
                oldValue = { fixedvalue: self.options.value.fixedvalue };
            } else {
                if (!self.isEmptyRule(self.options["value"])) {
                    oldValue = self.options["value"];
                } else {
                    oldValue = { fixedvalue: "" };
                }
            }

            if (self.options.value === undefined ||
        self.options.value === null ||
        self.options.value.fixedvalue) {
                self.options.value = {
                    rule: {
                        baref: {
                            ref: "expression"
                        }
                    }
                };
            }

            options = {
                typeEvent: bizagi.editor.component.properties.events.PROPERTIES_SELECT_EXPRESSION,
                oldValue: oldValue,
                type: self.options.name,
                data: self.options["value"],
                id: self.element.closest(".bizagi_editor_component_properties").data("id"),
                categorytype: "Scripting"
            };
            if (self.exclusive) {
                $.extend(options, { exclusive: true });
            }
            self.controller.publish("propertyEditorChanged", options);
            self.inputValue = self.options.value;
        },

        /*
        * Return true if the rule is empty
        */
        isEmptyRule: function (value) {
            var self = this;

            var rule = self.getRuleValue(value);
            if (!rule) { return true; }

            return (rule["baref"].ref === "expression");
        },

        getRuleValue: function (value) {
            return value["rule"] || value["rule90"];
        },

        "i.defaultvalue-rule-external click": function (el, event) {
            var self = this;
            self.editCreateRule(el, event);
        },
        ".defaultvalue-rule-value .defaultvalue-image-rule-delete click": function (el, event) {
            var self = this, options;
            options = {
                typeEvent: bizagi.editor.component.properties.events.PROPERTIES_CHANGE_PROPERTY,
                oldValue: self.inputValue,
                newValue: undefined,
                data: undefined,
                type: self.options.name,
                id: self.element.closest(".bizagi_editor_component_properties").data("id")
            };
            if (self.exclusive) {
                $.extend(options, { exclusive: true });
            }
            self.controller.publish("propertyEditorChanged", options);

            self.element.find(".defaultvalue-container div").empty();
            self.options.value = {
                fixedvalue: "",
                rule: {
                    baref: {
                        ref: "expression"
                    }
                }
            };
            self.state = true;
            self.renderTypeEditor(self.element.find(".defaultvalue-container"), self.options);

        },
        ".defaultvalue-image-fixed-delete click": function (el, event) {
            var self = this, options, input;
            input = self.element.find("input");
            if (input.length > 0) {
                self.element.find("input").val("");
            } else {
                self.element.find(".defaultvalue-boolean-value").removeClass("active");
            }

            options = {
                typeEvent: bizagi.editor.component.properties.events.PROPERTIES_CHANGE_PROPERTY,
                oldValue: self.inputValue,
                newValue: undefined,
                data: undefined,
                type: self.options.name,
                id: self.element.closest(".bizagi_editor_component_properties").data("id")
            };
            if (self.exclusive) {
                $.extend(options, { exclusive: true });
            }
            self.controller.publish("propertyEditorChanged", options);
        },

        ".biz-complex-btn.defaultvalue-button-value click": function (el, event) {
            var self = this;

            var editFixed = $(".defaultvalue-" + self.type + "-value", self.element);

            if (editFixed.length > 0) {
                editFixed.addClass("active");
                editFixed.focus();
            } else {
                self.editCreateRule(el, event);
            }
        },

        ".biz-ico.defaultvalue-image-edit click": function (el, event) {
            var self = this;
            var editFixed;

            if (self.type === "rule") {
                editFixed = [];
            } else {
                editFixed = $(".defaultvalue-" + self.type + "-value", self.element);
            }

            if (editFixed.length > 0) {
                editFixed.addClass("active");
                editFixed.focus();
            } else {
                self.editCreateRule(el, event);
            }
        },
        ".defaultvalue-rule-value .defaultvalue-button-value click": function (el, event) {
            var self = this;
            if (self.type === "rule") {
                self.editCreateRule(el, event);
            }
        }
    }
);