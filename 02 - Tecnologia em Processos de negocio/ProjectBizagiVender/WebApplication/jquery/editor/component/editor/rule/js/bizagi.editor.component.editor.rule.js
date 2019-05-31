/*
@title: Editor rule
@authors: Rhony Pedraza
@date: 17-aug-12
*/
bizagi.editor.component.editor(
    "bizagi.editor.component.editor.rule", {
        init: function (canvas, model, controller) {
            this._super(canvas, model, controller);
        },
        renderEditor: function (container, data) {
            var self = this;            

            if (data.value === undefined) {
                data.value = {
                    baref: {
                        ref: "expression"
                    }
                };
            } else {
                if (data.value === null) {
                    data.value = {
                        baref: {
                            ref: "expression"
                        }

                    };
                }
            }

            self.subproperties = data.subproperties;
            self.inputValue = data.value;

            var name = data.name.replace(/\./gi, '-');
            data["title"] = bizagi.localization.getResource("formmodeler-component-editor-rule-validation-" + name);

            if (data["title"] === "formmodeler-component-editor-rule-validation-" + name) {
                data["title"] = "";
            }

            self.renderRuleEditor(container, data);
        },
        renderRuleEditor: function (container, data) {
            var elEditor, self = this;

            var ruleValue = self.getRuleValue(data["value"]);

            var baref = ruleValue ? ruleValue.baref : data.value.baref;
            if (baref.ref == "expression") {
                // if value is empty
                elEditor = $.tmpl(self.getTemplate("frame-empty"), data);
            } else {
                $.extend(data, { nameRule: "", title: "" });

                if (data.value.rule && data.value.rule.displayName !== undefined) {
                    if (data.value.rule.displayName != "") {
                        $.extend(data, { nameRule: data.value.rule.displayName });
                    } else {
                        $.extend(data, { nameRule: bizagi.localization.getResource("formmodeler-component-editor-rule-expression") });
                    }
                }
                else if (data.value.displayName !== undefined) {
                    if (data.value.displayName != "") {
                        $.extend(data, { nameRule: data.value.displayName });
                    } else {
                        $.extend(data, { nameRule: bizagi.localization.getResource("formmodeler-component-editor-rule-expression") });
                    }
                }
                else {
                    $.extend(data, { nameRule: bizagi.localization.getResource("formmodeler-component-editor-rule-expression") });
                }
                elEditor = $.tmpl(self.getTemplate("frame-rule"), data);
            }
            elEditor.appendTo(container);


            $('input.rule-value[title]', elEditor).tooltip({ tooltipClass: 'ui-widget-content ui-propertybox-tooltip ui-rule-editor-tooltip',
                position: {
                    my: "left top+10",
                    at: "left bottom"

                }
            });
            $('.rule-internal-container > .defaultvalue-button-value[title]', elEditor).tooltip({ tooltipClass: 'ui-widget-content ui-propertybox-tooltip ui-rule-editor-tooltip',
                position: {
                    my: "left top+10",
                    at: "left bottom"

                }
            });

        },
        remove: function () {
            this.element.hide();
            this.element.empty();
        },
        loadTemplates: function () {
            var deferred = $.Deferred();
            $.when(
                this.loadTemplate("frame-empty", bizagi.getTemplate("bizagi.editor.component.editor.rule").concat("#rule-frame-empty")),
                this.loadTemplate("frame-rule", bizagi.getTemplate("bizagi.editor.component.editor.rule").concat("#rule-frame-rule"))
            ).done(function () {
                deferred.resolve();
            });
            return deferred.promise();
        },
        createEditRule: function (el, event) {
            var self = this;

            var ruleType = (self.isRule90()) ? "rule90" : "rule";

            var ruleValue = {};
            ruleValue[ruleType] = self.options.value;

            if (ruleValue[ruleType].rule) { ruleValue[ruleType] = ruleValue[ruleType].rule; }

            var categoryType = self.model["editor-parameters"] ? self.model["editor-parameters"]["type"] : "Scripting";

            var options = {
                typeEvent: bizagi.editor.component.properties.events.PROPERTIES_SELECT_EXPRESSION,
                oldValue: self.inputValue,
                type: self.options.name,
                data: ruleValue,
                newValue: self.options.value,
                id: self.element.closest(".bizagi_editor_component_properties").data("id"),
                categorytype: categoryType || "Scripting",
                context: self.model["editor-parameters"] ? self.model["editor-parameters"]["context"] : undefined,
                editor: self.hasRuleSubproperty() ? "" : "rule"

            };

            if (self.options.hasOwnProperty("exclusive")) {
                options = $.extend({}, options, { exclusive: self.options.exclusive });
            }

            self.controller.publish("propertyEditorChanged", options);

            self.inputValue = self.options.value;
        },

        /*
        * Gets rule value
        */
        getRuleValue: function (value) {
            return (value["rule"] || value["rule90"]);
        },

        /*
        * Return true if property is rule90 type
        */
        isRule90: function () {
            var self = this;

            return (self.options.name.indexOf("90") >= 0);
        },

        /*
        * Retuns true if the property has a rule subproperty
        */
        hasRuleSubproperty: function () {
            var self = this;

            if (self.subproperties && $.isArray(self.subproperties)) {
                var ruleProperty = self.subproperties[0].property || {};
                return ruleProperty["bas-type"] ? ruleProperty["bas-type"] == "rule" : false;
            }

            return false;
        },

        "i.rule-external click": function (el, event) {
            var self = this;
            self.createEditRule(el, event);
        },
        ".biz-complex-btn.defaultvalue-button-value click": function (el, event) {
            var self = this;
            self.createEditRule(el, event);
        },
        ".rule-internal-container .rule-image-edit click": function (el, event) {
            var self = this;
            self.createEditRule(el, event);
        },
        ".rule-internal-container .rule-image-delete click": function (el, event) {
            var self = this;
            var options;
            self.element.find(".rule-container").empty();

            options = {
                typeEvent: bizagi.editor.component.properties.events.PROPERTIES_CHANGE_PROPERTY,
                oldValue: self.inputValue,
                newValue: undefined,
                data: undefined,
                type: self.options.name,
                id: self.element.closest(".bizagi_editor_component_properties").data("id")
            };
            if (self.options.hasOwnProperty("exclusive")) {
                $.extend(options, { exclusive: self.options.exclusive });
            }
            self.controller.publish("propertyEditorChanged", options);

            self.options.value = {

                baref: {
                    ref: "expression"
                }

            };
            self.renderRuleEditor(self.element.find(".rule-container"), self.options);
        }
    }
);