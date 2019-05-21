/*
@title: Editor daterange
@authors: Rhony Pedraza
@date: 06-jul-12
*/
bizagi.editor.component.editor(
    "bizagi.editor.component.editor.daterange", {
        /*
        * Constructor
        */
        init: function (canvas, model, controller) {
            this._super(canvas, model, controller);
        },
        
        renderEditor: function (container, data) {
            var elEditor, self = this;

            data.caption = data.caption || bizagi.localization.getResource("formmodeler-component-editor-daterange-caption");
            self.data = data;
            self.container = container;
            self.value = (data.value) ? bizagi.clone(data.value) : {};

            self.setEditorParameters(data);
            data.value = data.value || {};
                        
            elEditor = $.tmpl(self.getTemplate("frame"), data);
            elEditor.appendTo(container);
          
            self.inputValue = data.value;
            self.mapSubproperties = self.generateMapSubProperties(data);

            self.renderMinValue(elEditor);
            self.renderMaxValue(elEditor);
        },

        /*
        * Process the editor parameters
        */
        setEditorParameters: function (data) {
            self.showTime = (data["editor-parameters"].showtime.value === true) ? "daterange-show-time" : "daterange-not-show-time";
            self.showtime = data["editor-parameters"].showtime.value;
            self.isOffline = data["editor-parameters"].isOffline || false;
        },
        
        /* Render Min Value UI Control */
        renderMinValue: function (elEditor) {
            var self = this, valuemin, typemin;
            self.data.min = { value: null, caption: bizagi.localization.getResource("formmodeler-component-editor-daterange-min-caption"), style: 'min-value' };

            for (var prop in self.mapSubproperties) {
                if (self.mapSubproperties[prop]["name"].indexOf('min') !== -1) {
                    if (self.mapSubproperties[prop]["value"]) {
                        valuemin = self.mapSubproperties[prop]["value"];
                        typemin = (self.mapSubproperties[prop]["bas-type"] === "date") ? 'min' : self.mapSubproperties[prop]["name"].split(".")[1];
                        $.extend(self.data.min, { value: valuemin, type: typemin });
                        break;
                    }
                }
            }
            if (self.data.min.value === null) {
                $.extend(self.data.min, { value: null, type: 'min' });
            }

            self.data.min.style = 'daterange-min-value';
            self.renderTypeEditor(elEditor, self.data.min);
        },
        /* Render Max Value UI Control */
        renderMaxValue: function (elEditor) {
            var self = this, valuemax, typemax;
            self.data.max = { value: null, caption: bizagi.localization.getResource("formmodeler-component-editor-daterange-max-caption"), style: 'max-value' };

            for (var prop in self.mapSubproperties) {
                if (self.mapSubproperties[prop]["name"].indexOf('max') !== -1) {
                    if (self.mapSubproperties[prop]["value"]) {
                        valuemax = self.mapSubproperties[prop]["value"];
                        typemax = (self.mapSubproperties[prop]["bas-type"] === "date") ? 'max' : self.mapSubproperties[prop]["name"].split(".")[1];
                        $.extend(self.data.max, { value: valuemax, type: typemax });
                        break;
                    }
                }
            }

            if (self.data.max.value === null) {
                $.extend(self.data.max, { value: null, type: 'max' });
            }

            self.data.max.style = 'daterange-max-value';
            self.renderTypeEditor(elEditor, self.data.max);
        },
        /* 
        * Generate an editor map of subproperties 
        * min - minrule - max - maxrule
        */
        generateMapSubProperties: function (data) {
            var subPropertiesEditor = data["subproperties"],
                name;

            var mapSubProperties = {};
            for (var i = 0; i < subPropertiesEditor.length; i++) {
                name = subPropertiesEditor[i]['property']['name'];
                mapSubProperties[name] = subPropertiesEditor[i]['property'];

                if (mapSubProperties[name]["value"]) {
                    if (mapSubProperties[name]['bas-type'] === 'date') {
                        if (!mapSubProperties[name]["value"]) {
                            mapSubProperties[name]["value"] = null;
                        }
                    } else {
                        if (!mapSubProperties[name]["value"].baref.ref) {
                            mapSubProperties[name]["value"] = null;
                        }
                    }
                }
            }

            return mapSubProperties;

        },
        renderTypeEditor: function (container, data) {
            var self = this, dataType, reference, dataValue, element;

            dataType = data.type;
            dataValue = data.value;
            $.extend(data, { isOffline: self.isOffline });

            switch (dataType) {
                case "max":
                case "min":
                    var showTimestyle = (self.showtime) ? " daterange-show-time" : " daterange-not-show-time";
                    var style = data.style.concat(showTimestyle);
                    // prueba
                    //var fixedvalue = (dataValue) ? dataValue.fixedvalue : self.data.value[type].fixedvalue;
                    var fixedvalue = (dataValue) ? dataValue : self.value[dataType];
                    // prueba
                    $.extend(data, { style: style, fixedvalue: fixedvalue });

                    reference = self.renderDefaultDate(container, data);

                    // set plugin
                    if (self.showtime) {
                        $(".daterange-date-container .daterange-date-value", reference).will_pickdate({
                            timePicker: true,
                            allowEmpty: true,
                            militaryTime: true,
                            inputOutputFormat: "m/d/Y H:i:s",
                            format: "m/d/Y H:i",
                            onSelect: function (date) {
                                date = $.datepicker.formatDate("mm/dd/yy", date) + " " + self.retrieveHumanTime(date);
                                data.value = date;
                                element = $(".daterange-date-container .daterange-date-value", reference);
                                self.validateAndPublishFixedSubproperties(data, data.value, element);
                            }
                        });
                    } else {
                        $(".daterange-date-container .daterange-date-value", reference).will_pickdate({
                            allowEmpty: true,
                            militaryTime: true,
                            inputOutputFormat: "m/d/Y",
                            format: "m/d/Y",
                            onSelect: function (date) {
                                date = $.datepicker.formatDate("mm/dd/yy", date);
                                data.value = date;
                                element = $(".daterange-date-container .daterange-date-value", reference);
                                self.validateAndPublishFixedSubproperties(data, data.value, element);
                            }
                        });
                    }
                    break;
                case "maxrule":
                case "maxrule90":
                case "minrule":
                case "minrule90":
                    $.extend(data, { showTime: self.showTime });
                    data.rule = (dataValue) ? dataValue : self.value[dataType].rule;
                    self.renderDefaultRule(container, data);
                    break;
            }
        },
        redrawRenderEditor: function (container, property, newvalue) {
            var self = this, subPropertiesEditor = self.data["subproperties"];

            for (var i = 0; i < subPropertiesEditor.length; i++) {
                if (subPropertiesEditor[i]['property']['name'] === property) {
                    subPropertiesEditor[i]['property']['value'] = newvalue;
                    self.options.value[property.split(".")[1]] = newvalue;
                    break;
                }
            }

            self.renderEditor(container, self.data);
        },
        renderDefaultDate: function (container, data) {
            var elEditorDate, lblRequired, self = this;
            elEditorDate = $.tmpl(this.getTemplate("frame-date-fixed"), data);
            elEditorDate.appendTo(container);

            data.required = (self.mapSubproperties['daterange.' + data.type]['required'] === true) ? true : false;

            lblRequired = $('label', elEditorDate);
            self.addRequired(lblRequired, data);

            return elEditorDate;
        },
        renderDefaultRule: function (container, data) {
            var elEditorRule, lblRequired, self = this;
            if (data.value.displayName !== undefined) {
                if (data.value.displayName != "") {
                    $.extend(data, { nameRule: data.value.displayName });
                } else {
                    $.extend(data, { nameRule: bizagi.localization.getResource("formmodeler-component-editor-daterange-rule") });
                }
            } else {
                $.extend(data, { nameRule: bizagi.localization.getResource("formmodeler-component-editor-daterange-rule") });
            }
            elEditorRule = $.tmpl(this.getTemplate("frame-rule"), data);
            elEditorRule.appendTo(container);

            data.required = (self.mapSubproperties['daterange.' + data.type]['required'] === true) ? true : false;

            lblRequired = $('label', elEditorRule);
            self.addRequired(lblRequired, data);

            return elEditorRule;
        },
        retrieveExculsiveSubProperty: function (property) {
            var exclusive = null;

            switch (property) {
                case "maxrule":
                    exclusive = "max";
                    break;
                case "minrule":
                    exclusive = "min";
                    break;
                case "min":
                    exclusive = "minrule";
                    break;
                case "max":
                    exclusive = "maxrule";
                    break;
            }

            return exclusive;
        },

        validateAndPublishFixedSubproperties: function (data, newValue, element) {
            var self = this;

            if (self.isValidRange(newValue, data.type)) {
                self.hideError(element);
                self.mapSubproperties["daterange." + data.type].value = newValue;
                self.publishFixedSubproperties(data, newValue);
            } else {
                self.showError(element, self.error);
            }
        },

        isValidRange: function (value, type) {
            var self = this, result = false;
            var minValue = (self.mapSubproperties["daterange.min"].value) ? self.mapSubproperties["daterange.min"].value : null;
            var maxValue = (self.mapSubproperties["daterange.max"].value) ? self.mapSubproperties["daterange.max"].value : null;

            if (type == "min") {
                if (maxValue === null || maxValue == "") {
                    result = true;
                } else {
                    if (self.compareDate(maxValue, value) >= 0) {
                        result = true;
                    }
                }
            } else {
                if (minValue === null || minValue == "") {
                    result = true;
                } else {
                    if (self.compareDate(value, minValue) >= 0) {
                        result = true;
                    }
                }
            }

            if (result === false) {
                self.error = bizagi.localization.getResource("formmodeler-component-editor-daterange-error-range");
            }

            return result;
        },

        compareDate: function (dateLeft, dateRight) {
            var dateL = new Date(dateLeft);
            var dateR = new Date(dateRight);
            if (dateL.valueOf() == dateR.valueOf()) {
                return 0;
            } else {
                if (dateL.valueOf() > dateR.valueOf()) {
                    return 1;
                } else {
                    return -1;
                }
            }
        },

        publishFixedSubproperties: function (data, newValue) {
            var options, name, self = this;

            name = 'daterange.' + data.type;

            var oldValue = self.retrieveOldValue(data.type);
            if (!self.value) {
                self.value = {};
            } else if (!self.value[name]) {
                self.value[name] = {};
            }

            self.value[name] = newValue;

            options = {
                typeEvent: bizagi.editor.component.properties.events.PROPERTIES_CHANGE_PROPERTY,
                oldValue: oldValue,
                newValue: (newValue === undefined) ? undefined : newValue,
                data: (newValue === undefined) ? undefined : newValue,
                type: name,
                id: self.element.closest(".bizagi_editor_component_properties").data("id")
            };
            self.controller.publish("propertyEditorChanged", options);
        },
        publishRuleSubproperties: function (type, newValue) {
            var options, name, self = this;
            name = 'daterange.' + type;

            var ruleType = (self.isRule90(type)) ? "rule90" : "rule";

            var oldValue = self.retrieveOldValue(type);
            if (!self.value) {
                self.value = {};
            } else if (!self.value[name]) {
                self.value[name] = {};
            }

            if (newValue === undefined) {
                options = {
                    typeEvent: bizagi.editor.component.properties.events.PROPERTIES_CHANGE_PROPERTY,
                    oldValue: oldValue,
                    newValue: newValue,
                    data: newValue,
                    type: name,
                    id: self.element.closest(".bizagi_editor_component_properties").data("id")
                };
            } else {
                self.value[name].rule = { baref: { ref: newValue} };
                var ruleValue = {};
                ruleValue[ruleType] = self.value[name].rule;

                options = {
                    typeEvent: bizagi.editor.component.properties.events.PROPERTIES_SELECT_EXPRESSION,
                    oldValue: oldValue,
                    data: ruleValue,
                    type: name,
                    id: this.element.closest(".bizagi_editor_component_properties").data("id"),
                    categorytype: "Scripting",
                    editor : "rule"
                };
            }


            self.controller.publish("propertyEditorChanged", options);
            self.removeFixedExclusiveProperty(type);

            if (newValue === undefined) {
                self.element.empty();
                self.redrawRenderEditor(self.container, name, newValue);
            }

        },
        removeFixedExclusiveProperty: function (type) {
            var self = this, exclusive;
            exclusive = self.retrieveExculsiveSubProperty(type);
            self.publishFixedSubproperties({ type: exclusive }, undefined);
        },
        removeRuleExclusiveProperty: function (type) {
            var self = this, exclusive;
            exclusive = self.retrieveExculsiveSubProperty(type);
            self.publishRuleSubproperties(exclusive, undefined);
        },
        retrieveOldValue: function (type) {
            var self = this;
            var oldValue = '';

            if (self.value[type]) {
                if (self.value[type] != "") {
                    oldValue = self.value[type];
                } else if (self.value[type].rule.baref.ref != "expression") {
                    oldValue = { rule: self.value[type].rule };
                } else {
                    oldValue = "";
                }
            } else {
                oldValue = "";
            }

            return oldValue;
        },
        retrieveHumanTime: function (date) {
            var hours = date.getHours();
            var minutes = date.getMinutes();
            hours = hours < 10 ? "0" + hours : hours;
            minutes = minutes < 10 ? "0" + minutes : minutes;
            return hours + ":" + minutes + ":00";
        },
        remove: function () {
            this.element.hide();
            this.element.empty();
        },
        loadTemplates: function () {
            var deferred = $.Deferred();
            $.when(
                this.loadTemplate("frame", bizagi.getTemplate("bizagi.editor.component.editor.daterange").concat("#daterange-frame")),
                this.loadTemplate("frame-date-fixed", bizagi.getTemplate("bizagi.editor.component.editor.daterange").concat("#daterange-frame-date-fixed")),
                this.loadTemplate("frame-rule", bizagi.getTemplate("bizagi.editor.component.editor.daterange").concat("#daterange-frame-rule"))
            ).done(function () {
                deferred.resolve();
            });
            return deferred.promise();
        },

        /*
        *  Gets minrule name
        */
        getMinRuleName: function () {
            var self = this;

            var min = self.options["min"];
            return (min && min["rule"]) ? min["type"] : 'minrule';
        },

        /*
        * Gets maxrulename
        */
        getMaxRuleName: function () {
            var self = this;

            var max = self.options["max"];
            return (max && max["rule"]) ? max["type"] : 'maxrule';
        },

        /*
        * Returns true if is Rule90
        */
        isRule90: function (type) {
            return (type.indexOf("90") >= 0);
        },

        "i.daterange-rule-external click": function (el, event) {
            var self = this, name;
            var reference = el.closest('.ui-control-input');
            if (reference.hasClass('daterange-min-value')) {
                name = self.getMinRuleName();
            } else {
                name = self.getMaxRuleName();
            }

            if (self.options.value[name] !== undefined && self.options.value[name] !== null) {
                self.publishRuleSubproperties(name, self.options.value[name].baref.ref);
            } else {
                self.publishRuleSubproperties(name, 'expression');
            }
        },
        ".daterange-date-container .daterange-image-rule-delete click": function (el, event) {
            var self = this, name;
            var reference = el.closest('.ui-control-input');
            if (reference.hasClass('daterange-min-value')) {
                name = self.getMinRuleName();
            } else {
                name = self.getMaxRuleName();
            }

            self.publishRuleSubproperties(name, undefined);

        },
        ".daterange-date-container .daterange-image-fixed-delete click": function (el, event) {
            var self = this, options, name;
            var reference = el.closest('.ui-control-input');
            if (reference.hasClass('daterange-min-value')) {
                name = 'min';
            } else {
                name = 'max';
            }

            var editFixed = $('.daterange-date-value', reference);
            editFixed.val('');

            self.publishFixedSubproperties({ type: name }, undefined);
        },
        ".biz-ico.daterange-image-rule-edit click": function (el, event) {
            var self = this, name;
            var reference = el.closest('.ui-control-input');
            if (reference.hasClass('daterange-min-value')) {
                name = self.getMinRuleName();
            } else {
                name = self.getMaxRuleName();
            }

            if (self.options.value[name] !== undefined && self.options.value[name] !== null) {
                self.publishRuleSubproperties(name, self.options.value[name].baref.ref);
            } else {
                self.publishRuleSubproperties(name, 'expression');
            }
        },
        ".biz-ico.daterange-image-fixed-edit click": function (el, event) {
            var self = this;
            var reference = el.closest('.ui-control-input');
            var editFixed = $('.daterange-date-value', reference);
            editFixed.focus();
        },
        ".biz-complex-btn.daterange-button-value click": function (el, event) {
            var self = this;
            var reference = el.closest('.ui-control-input');
            var editFixed = $('.daterange-date-value', reference);
            editFixed.focus();
        },
        ".daterange-rule-value .daterange-button-value click": function (el, event) {
            var self = this, name;
            var reference = el.closest('.ui-control-input');
            if (reference.hasClass('daterange-min-value')) {
                name = self.getMinRuleName();
            } else {
                name = self.getMaxRuleName();
            }

            if (self.options.value[name] !== undefined && self.options.value[name] !== null) {
                self.publishRuleSubproperties(name, self.options.value[name].baref.ref);
            } else {
                self.publishRuleSubproperties(name, 'expression');
            }
        }
    }
);