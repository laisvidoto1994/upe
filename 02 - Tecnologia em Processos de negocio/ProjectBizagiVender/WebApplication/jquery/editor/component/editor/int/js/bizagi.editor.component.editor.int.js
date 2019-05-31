/*
@title: Editor Rendertype Component
@authors: Rhony Pedraza / Ramiro Gomez
@date: 28-may-12
*/
bizagi.editor.component.editor(
    "bizagi.editor.component.editor.int", {
        init: function (canvas, model, controller) {
            this._super(canvas, model, controller);
        },
        renderEditor: function (container, data) {
            var self = this, elEditor, lblRequired, templateSuffix = "";

            if (data.value === undefined) {
                data.value = "";
            } else {
                if (data.value === null) {
                    data.value = "";
                }
            }

            self.inputValue = data.value;
            self.defaultValue = (data["default"] !== undefined && data["default"] !== null) ? data["default"] : "";

            self.suffix = "";
            if (data["editor-parameters"].hasOwnProperty("suffix")) {
                if (data["editor-parameters"].suffix != "") {
                    self.suffix = data["editor-parameters"].suffix;
                    templateSuffix = self.suffix + " ";
                }
            }

            elEditor = $.tmpl(this.getTemplate("frame"), $.extend({}, data, { templateSuffix: templateSuffix }));
            var elDefaultAction = $.tmpl(this.getTemplate("default"));
            elEditor.append(elDefaultAction);
            elEditor.appendTo(container);
            // "post-render"
            if (data["editor-parameters"].hasOwnProperty("placeholder-type")) {
                var type = data["editor-parameters"]["placeholder-type"];
                self.setPlaceholder(elEditor);
                // change max for default
                if (type == "default") {
                    if (self.defaultValue != "") {
                        self.options["editor-parameters"].max = parseInt(self.defaultValue);
                    }
                }
            }

            lblRequired = $('label', elEditor);
            self.addRequired(lblRequired);
        },
        setPlaceholder: function (container) {
            var self = this;
            var defaultValue = parseInt(self.defaultValue);
            var intValue = parseInt(self.options.value);
            var el = container.find("input");
            if (isNaN(intValue)) {
                if (!isNaN(defaultValue)) {
                    el.attr("placeholder", defaultValue);
                }
            } else {
                // previous validation
                if (defaultValue != -1 && intValue > defaultValue) {
                    // postRender
                    self.registerCallback(function () {
                        self.Error = bizagi.localization.getResource("formmodeler-component-editor-int-error-default") + defaultValue;
                        self.showError(el, self.Error);
                        el.select();
                    });
                }
            }
        },
        loadTemplates: function () {
            var deferred = new $.Deferred();
            $.when(
                this.loadTemplate("frame", bizagi.getTemplate("bizagi.editor.component.editor.int").concat("#int-frame")),
                this.loadTemplate("default", bizagi.getTemplate("bizagi.editor.component.editor.int").concat("#int-default-action"))
            ).done(function () {
                deferred.resolve();
            });
            return deferred.promise();
        },
        remove: function () {
            var self = this;
            self.element.hide();
            self.element.empty();
        },
        validate: function (el) {
            var self = this,
                element,
                elValue,
                isInt = false;

            element = $(el);
            elValue = element.val();

            if (isNaN(parseInt(elValue))) {
                isInt = false;
                if (elValue != "") {
                    if (!element.hasClass('error')) {
                        element.addClass('error');
                    }
                    self.Error = bizagi.localization.getResource("formmodeler-component-editor-int-error-integer");
                    self.showError(el, self.Error);
                    element.select();
                }
            } else if (self.isInt(elValue) && self.isInRange(elValue) && !isNaN(parseInt(elValue))) {
                element.removeClass('error');
                self.hideError(el);
                isInt = true;
            } else {
                if (!element.hasClass('error')) {
                    element.addClass('error');
                }

                self.showError(el, self.Error);
                element.select();
            }
            return isInt;

        },
        isInRange: function (value) {
            var self = this, result = true;
            var min = self.options["editor-parameters"].min;
            var max = self.options["editor-parameters"].max;
           

            var intValue = parseInt(value);
            if (min !== undefined && min !== null && min !== "") {
                if (!isNaN(parseInt(min))) {
                    if (intValue < parseInt(min)) {
                        self.Error = bizagi.localization.getResource("formmodeler-component-editor-int-error-rangemin");
                        result = false;
                    }
                }
            }
            if (max !== undefined && max !== null && max !== "") {
                if (!isNaN(parseInt(max))) {

                    if (parseInt(max) != -1 && intValue > parseInt(max)) {                       
                        self.Error = bizagi.localization.getResource("formmodeler-component-editor-int-error-rangemax");
                        result = false;
                    }
                }
            }
            return result;
        },
        isInt: function (val) {
            var self = this, regExp;

            regExp = RegExp("^[-+]?[0-9]+" + self.suffix + "$");
            self.Error = bizagi.localization.getResource("formmodeler-component-editor-int-error-integer");

            return regExp.test(val) || val == "";
        },
        "input[type='text'] blur": function (el, event) {
            var self = this, elValue, value;

            el.val($.trim(el.val()));
            value = el.val();

            if (self.suffix != "") {
                var regExp = RegExp("^[-+]?[0-9]+" + self.suffix + "$");
                if (!regExp.test(value)) {
                    if (/^[-+]?[0-9]+$/.test(value)) {
                        el.val(value + self.suffix);
                    }
                }
            }

            if (self.validate(el) || value == "") {
                elValue = parseInt(value);
                if (isNaN(elValue)) {
                    elValue = undefined;
                }
                this.controller.publish("propertyEditorChanged", {
                    oldValue: self.inputValue,
                    newValue: elValue,
                    type: self.options.name,
                    id: self.element.closest(".bizagi_editor_component_properties").data("id")
                });
            }
        },
        "input[type='text'] keydown": function (el, event) {
            var self = this, elValue, value;
            value = el.val();

            if (event.keyCode == 13) {
                el.val($.trim(el.val()));
                if (self.suffix != "") {
                    var regExp = RegExp("^[-+]?[0-9]+" + self.suffix + "$");
                    if (!regExp.test(value)) {
                        if (/^[-+]?[0-9]+$/.test(value)) {
                            el.val(value + self.suffix);
                        }
                    }
                }

                if (self.validate(el) || value == "") {
                    elValue = parseInt(value);
                    if (isNaN(elValue)) {
                        elValue = undefined;
                    }
                    this.controller.publish("propertyEditorChanged", {
                        oldValue: self.inputValue,
                        newValue: elValue,
                        type: self.options.name,
                        id: self.element.closest(".bizagi_editor_component_properties").data("id")
                    });
                }
            }
        },
        ".biz-ico.biz-ico-default click": function (el, event) {
            var self = this, options, element;
            element = self.element.find("input");
            element.val("");
            if (element.hasClass("error")) {
                element.removeClass("error");
                self.hideError(element);
            }

            options = {
                oldValue: self.inputValue,
                newValue: undefined,
                type: self.options.name,
                id: self.element.closest(".bizagi_editor_component_properties").data("id")
            }
            self.controller.publish("propertyEditorChanged", options);
        }
    }
);