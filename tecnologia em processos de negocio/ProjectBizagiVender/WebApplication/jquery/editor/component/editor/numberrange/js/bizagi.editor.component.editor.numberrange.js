/*
@title: Editor numberrange
@authors: Rhony Pedraza
@date: 06-jul-12
*/
bizagi.editor.component.editor(
    "bizagi.editor.component.editor.numberrange", {
        init: function (canvas, model, controller) {
            this._super(canvas, model, controller);
        },
        renderEditor: function (container, data) {
            var elEditor, self = this, allowdecimals;

            data.caption = data.caption || bizagi.localization.getResource("formmodeler-component-editor-numberrange-caption");
            self.data = data;
            self.container = container;

            self.setEditorParameters(data);
            data.value = data.value || { };

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
            var self = this;
            self.allowdecimals = data["editor-parameters"].allowdecimals.value;
            self.isOffline = data["editor-parameters"].isOffline || false;
        },


        /* Render Min Value UI Control */
        renderMinValue: function (elEditor) {
            var self = this, valuemin, typemin;
            self.data.min = { value: null, caption: bizagi.localization.getResource("formmodeler-component-editor-numberrange-min-caption"), style: 'min-value' };

            for (var prop in self.mapSubproperties) {
                if (self.mapSubproperties[prop]["name"].indexOf('min') !== -1) {
                    if (self.mapSubproperties[prop]["value"]) {
                        valuemin = self.mapSubproperties[prop]["value"];
                        typemin = (self.mapSubproperties[prop]["bas-type"] === "number") ? 'min' : self.mapSubproperties[prop]["name"].split(".")[1];
                        $.extend(self.data.min, { value: valuemin, type: typemin });
                        break;
                    }
                }
            }
            if (self.data.min.value === null) {
                $.extend(self.data.min, { value: null, type: 'min' });
            }

            self.data.min.style = 'numberrange-min-value';
            self.renderTypeEditor(elEditor, self.data.min);
        },

        /* 
        * Render Max Value UI Control
        */
        renderMaxValue: function (elEditor) {
            var self = this, valuemax, typemax;
            self.data.max = { value: null, caption: bizagi.localization.getResource("formmodeler-component-editor-numberrange-max-caption"), style: 'max-value' };

            for (var prop in self.mapSubproperties) {
                if (self.mapSubproperties[prop]["name"].indexOf('max') !== -1) {
                    if (self.mapSubproperties[prop]["value"]) {
                        valuemax = self.mapSubproperties[prop]["value"];
                        typemax = (self.mapSubproperties[prop]["bas-type"] === "number") ? 'max' : self.mapSubproperties[prop]["name"].split(".")[1];
                        $.extend(self.data.max, { value: valuemax, type: typemax });
                        break;
                    }
                }
            }

            if (self.data.max.value === null) {
                $.extend(self.data.max, { value: null, type: 'max' });
            }

            self.data.max.style = 'numberrange-max-value';
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
                    if (mapSubProperties[name]['bas-type'] === 'number') {
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

        /*
        * render editor
        */        
        renderTypeEditor: function (container, data) {
            var self = this, dataType, reference, dataValue;

            dataType = data.type;
            dataValue = data.value;

            $.extend(data, {isOffline : self.isOffline  });
            
            switch (dataType) {
                case "max":
                case "min":
                    var allowdecimalsstyle = (self.allowdecimals) ? " numberrange-show-time" : " numberrange-not-show-time";
                    var style = data.style.concat(allowdecimalsstyle);
                    var fixedvalue = (dataValue) ? dataValue : self.data.value[dataType];
                    $.extend(data, { style: style, fixedvalue: fixedvalue });

                    reference = self.renderDefaultNumber(container, data);

                    $('.numberrange-' + dataType + '-value .numberrange-number-value', reference).bind('blur', function () {

                        var el = $(this);
                        var value = el.val();

                        data.value = self.mapSubproperties["numberrange." + dataType].value = value;

                        self.validateAndPublish(data, el);
                    });

                    $('.numberrange-' + dataType + '-value .numberrange-number-value', reference).bind('keyup', function (event) {
                        if ((event.keyCode == 13) /*&& (value !== self.map["numberrange.min"].value)*/) {

                            var el = $(this);
                            var value = el.val();

                            data.value = self.mapSubproperties["numberrange." + dataType].value = value;

                            self.validateAndPublish(data, el);
                        }
                    });

                    break;
                case "maxrule":
                case "maxrule90":
                case "minrule":
                case "minrule90":
                    $.extend(data, { allowdecimals: self.allowdecimals });
                    data.rule = (dataValue) ? dataValue : self.data.value[dataType].rule;
                    self.renderDefaultRule(container, data);
                    break;
            }
        },

        /*
        *
        */
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

        /*
        *
        */
        renderDefaultNumber: function (container, data) {
            var elEditorDate;
            elEditorDate = $.tmpl(this.getTemplate("frame-number-fixed"), data);
            elEditorDate.appendTo(container);
            return elEditorDate;
        },

        /*
        *
        */
        renderDefaultRule: function (container, data) {
            var elEditorRule;
            if (data.value.displayName !== undefined) {
                if (data.value.displayName != "") {
                    $.extend(data, { nameRule: data.value.displayName });
                } else {
                    $.extend(data, { nameRule: bizagi.localization.getResource("formmodeler-component-editor-numberrange-rule") });
                }
            } else {
                $.extend(data, { nameRule: bizagi.localization.getResource("formmodeler-component-editor-numberrange-rule") });
            }
            elEditorRule = $.tmpl(this.getTemplate("frame-rule"), data);
            elEditorRule.appendTo(container);
            return elEditorRule;
        },

        /*
        *
        */
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

        /*
        *
        */
        publishFixedSubproperties: function (data, newValue) {
            var options, name, self = this, oldValue;

            name = 'numberrange.' + data.type;

            oldValue = self.retrieveOldValue(data.type);
            if (!self.data.value) {
                self.data.value = {};
            } else if (!self.data.value[name]) {
                self.data.value[name] = {};
            }
            self.data.value[name] = newValue;

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

        /*
        *
        */
        publishRuleSubproperties: function (type, newValue) {
            var options, name, self = this, oldValue;
            name = 'numberrange.' + type;

            var ruleType = (self.isRule90(type)) ? "rule90" : "rule";

            oldValue = self.retrieveOldValue(type);
            if (!self.data.value) {
                self.data.value = {};
            } else if (!self.data.value[name]) {
                self.data.value[name] = {};
            }
            self.data.value[name].rule = { baref: { ref: newValue} };


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

                var ruleValue = {};
                ruleValue[ruleType] = self.data.value[name].rule;

                options = {
                    typeEvent: bizagi.editor.component.properties.events.PROPERTIES_SELECT_EXPRESSION,
                    oldValue: oldValue,
                    data: ruleValue,
                    type: name,
                    id: this.element.closest(".bizagi_editor_component_properties").data("id"),
                    categorytype: "Scripting",
                    editor: "rule"
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

            if (self.data.value[type]) {
                if (self.data.value[type] != "") {
                    oldValue = self.data.value[type];
                } else if (self.data.value[type].rule) {
                    if (self.data.value[type].rule.baref.ref != "expression") {
                        oldValue = { rule: self.data.value[type].rule };
                    }
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
        isValidRange: function (value, type) {
            var self = this, result = false;
            var maxValue = (self.mapSubproperties["numberrange.max"].value) ? self.mapSubproperties["numberrange.max"].value : null;
            var minValue = (self.mapSubproperties["numberrange.min"].value) ? self.mapSubproperties["numberrange.min"].value : null;

            if (type == "min") {
                if (maxValue === null || maxValue === '') {
                    result = true;
                } else {
                    if (value === '') {
                        minValue = null;
                        result = true;
                    } else {
                        if (self.allowdecimals) {
                            if ((parseFloat(value) <= maxValue) || maxValue === '') {
                                result = true;
                            }
                        } else {
                            var compareMax = maxValue;
                            if (compareMax === '' || compareMax === undefined) {
                                result = true;
                            } else if (parseInt(value) <= parseInt(compareMax)) {
                                result = true;
                            }
                        }
                    }
                }
            } else {

                if (minValue === null || minValue === '') {
                    result = true;
                } else {
                    if (value === '') {
                        maxValue = null;
                        result = true;
                    } else {

                        if (self.allowdecimals) {
                            if ((parseFloat(value) >= minValue) || minValue === '') {
                                result = true;
                            }
                        } else {
                            var compareMin = minValue;
                            if (compareMin === '' || compareMin === undefined) {
                                result = true;
                            } else if (parseInt(value) >= parseInt(compareMin)) {
                                result = true;
                            }
                        }
                    }

                }
            }
            if (result === false) {
                self.error = bizagi.localization.getResource("formmodeler-component-editor-numberrange-error-range");
            }
            return result;
        },
        validateAndPublish: function (data, element) {
            var self = this;
            var regNumber, options;
            var value = data.value;
            var type = data.type;

            if (self.allowdecimals === true) {
                regNumber = /(^$)|(^-?(0|[1-9][0-9]*)(\.[0-9]+)?$)/;
                self.error = bizagi.localization.getResource("formmodeler-component-editor-numberrange-error-number");

            } else {
                regNumber = /(^$)|(^-?(0|[1-9][0-9]*)$)/;
                self.error = bizagi.localization.getResource("formmodeler-component-editor-numberrange-error-int");
            }

            if (regNumber.test(value) && self.isValidRange(value, type)) {

                self.hideError(element);

                self.publishFixedSubproperties(data, data.value);

            } else {
                self.showError(element, self.error);
                element.select();
            }
        },
        remove: function () {
            this.element.hide();
            this.element.empty();
        },
        loadTemplates: function () {
            var deferred = $.Deferred();
            $.when(
                this.loadTemplate("frame", bizagi.getTemplate("bizagi.editor.component.editor.numberrange").concat("#numberrange-frame")),
                this.loadTemplate("frame-number-fixed", bizagi.getTemplate("bizagi.editor.component.editor.numberrange").concat("#numberrange-frame-number-fixed")),
                this.loadTemplate("frame-rule", bizagi.getTemplate("bizagi.editor.component.editor.numberrange").concat("#numberrange-frame-rule"))
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

        "i.numberrange-rule-external click": function (el, event) {
            var self = this, name;
            var reference = el.closest('.ui-control-input');
            if (reference.hasClass('numberrange-min-value')) {
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
        ".numberrange-number-container .numberrange-image-rule-delete click": function (el, event) {
            var self = this, name;
            var reference = el.closest('.ui-control-input');
            if (reference.hasClass('numberrange-min-value')) {
                name = self.getMinRuleName();
            } else {
                name = self.getMaxRuleName();
            }

            self.publishRuleSubproperties(name, undefined);

        },
        ".numberrange-number-container .numberrange-image-fixed-delete click": function (el, event) {
            var self = this, options, name;
            var reference = el.closest('.ui-control-input');
            if (reference.hasClass('numberrange-min-value')) {
                name = 'min';
            } else {
                name = 'max';
            }

            var editFixed = $('.numberrange-number-value', reference);
            editFixed.val('');

            self.publishFixedSubproperties({ type: name }, undefined);
        },
        ".biz-ico.numberrange-image-rule-edit click": function (el, event) {
            var self = this, name;
            var reference = el.closest('.ui-control-input');
            if (reference.hasClass('numberrange-min-value')) {
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
        ".biz-ico.numberrange-image-fixed-edit click": function (el, event) {
            var self = this;
            var reference = el.closest('.ui-control-input');
            var editFixed = $('.numberrange-number-value', reference);
            editFixed.focus();
        },
        ".numberrange-rule-value .numberrange-button-value click": function (el, event) {
            var self = this, name;
            var reference = el.closest('.ui-control-input');
            if (reference.hasClass('numberrange-min-value')) {
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