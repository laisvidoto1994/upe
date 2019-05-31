/*
@title: Editor (general) resizer
@authors: Christian Collazos
@date: 24-jul-13
*/
bizagi.editor.component.editor(
    "bizagi.editor.component.editor.resizer", {
        init: function (canvas, model, controller) {
            this._super(canvas, model, controller);
        },
        renderEditor: function (container, data) {
            var elEditor, self = this, xpathValue, lblRequired, widthValue, measureType = "auto";
            var width = self.model.value;
            var editorParameters = data["editor-parameters"];
            self.editorParameters = editorParameters;

            elEditor = $.tmpl(self.getTemplate("horizontalResize"), data);
            elEditor.appendTo(container);

            if (width != "auto") {
                //get the number part of width (if width is 40px widthValue will be '40')
                widthValue = parseInt(width).toString();
                measureType = width.substring(widthValue.length, width.length);
                elEditor.find("#resizeWidth").val(width);
            }

            if (!editorParameters.isWidthColumnEditable) {
                elEditor.find("#resizeWidth").attr("readonly", true);
                self.Error = bizagi.localization.getResource("formmodeler-component-editor-resizer-error-editable");
                self.showErrorMessage(elEditor.find("#resizeWidth"), self.Error);
                setTimeout(function () {
                    $("#bizagi_editor_validator_container-columnwidth").css("top", 25);
                }, 100);
            }

            self.widthValue = widthValue;
            self.measureType = measureType;


        },

        loadTemplates: function () {
            var deferred = $.Deferred();
            $.when(
                this.loadTemplate("horizontalResize", bizagi.getTemplate("bizagi.editor.component.editor.resizer").concat("#resizer-horizontal"))
            ).done(function () {
                deferred.resolve();
            });
            return deferred.promise();
        },

        changeSize: function (value) {

            this.controller.publish("propertyEditorChanged", {
                typeEvent: bizagi.editor.component.properties.events.PROPERTIES_CHANGE_PROPERTY,
                newValue: value,
                type: this.options.name,
                id: this.element.closest(".bizagi_editor_component_properties").data("id")
            });

        },

        validateSize: function (el, value) {

            var self = this;
            var widthValue = parseInt(value).toString();

            if (value == "auto" || value == "") {
                return true;
            }
            else if (isNaN(widthValue)) {
                self.Error = bizagi.localization.getResource("formmodeler-component-editor-resizer-error-format");
                self.showErrorMessage(el, self.Error);
                return false;
            } else {

                var measureType = value.substring(widthValue.length, value.length);

                if (measureType != "px" && measureType != "%") {
                    self.Error = bizagi.localization.getResource("formmodeler-component-editor-resizer-error-format");
                    self.showErrorMessage(el, self.Error);
                    return false;

                } else if (Number(widthValue) < 1 && measureType == "px") {

                    self.Error = bizagi.localization.getResource("formmodeler-component-editor-resizer-error-minimum");
                    self.showErrorMessage(el, self.Error);
                    return false;

                } else if (Number(widthValue) > 100 && measureType == "%") {

                    self.Error = bizagi.localization.getResource("formmodeler-component-editor-resizer-error-percent");
                    self.showErrorMessage(el, self.Error);
                    return false;
                } else if (measureType == "%" && Number(widthValue) > self.editorParameters.percentMaxWidth) {
                    self.Error = bizagi.localization.getResource("formmodeler-component-editor-resizer-error-percent-available");                    
                    if (typeof self.Error === "string") { self.Error = self.Error.replace("{0}", self.editorParameters.percentMaxWidth); }
                    else caption = "";    

                    self.showErrorMessage(el, self.Error);
                    return false;
                }
            }
            return true;
        },

        showErrorMessage: function (el, msg) {
            var self = this;
            var element = $(el);

            if (!element.hasClass('error')) {
                element.addClass('error');
            }

            self.showError(el, msg);
            element.select();
        },

        applyColumnWidth: function (el, e) {
            var self = this;
            var value = $(el).val();
            var oldValue = self.model.value.width;
            var valueToSend = value == "" ? "auto" : value;

            //validate min value
            if (self.validateSize(el, value)) {
                self.changeSize(valueToSend);
            } else {
                value = "";
            }

            $("#resizeWidth").val(value);
        },

        // change input size
        "input blur": function (el, e) {
            var self = this;

            self.applyColumnWidth(el, e);
        },

        "input keydown": function (el, e) {
            var self = this;

            if (event.keyCode == 13) {
                self.applyColumnWidth(el, e);
            }
        }


    });