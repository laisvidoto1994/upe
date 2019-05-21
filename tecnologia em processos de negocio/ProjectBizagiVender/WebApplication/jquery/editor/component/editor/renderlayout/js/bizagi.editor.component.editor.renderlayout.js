/*
@title: Editor renderlayout
@authors: Rhony Pedraza /Ramiro Gomez /Paola Herrera
@date: 31-may-12
*/
bizagi.editor.component.editor(
    "bizagi.editor.component.editor.renderlayout", {
        listensTo: ["innerPropertyChange"]
    }, {
        init: function (canvas, model, controller) {
            this._super(canvas, model, controller);
        },

        renderEditor: function (container, data) {
            var elEditor, subpropertiesLength, subproperty, calculatedValues, names, self = this;

            self.properties = [];

            subpropertiesLength = data.subproperties.length;

            var pixelInitialValue = data.subproperties[2]?data.subproperties[2].property.value : null;
            var pixelInitialDefault = data.subproperties[2]?data.subproperties[2].property["default"]:null;
            (pixelInitialValue) ? self.layoutType = pixelInitialValue : self.layoutType = pixelInitialDefault;

            calculatedValues = self.calculateValues(data.subproperties).replace(/\%/gi, '');

            this.values = self.retrieveValues(calculatedValues);
            names = self.retrieveNames(data.subproperties);

            data.caption = data.caption || "Layout";

            $.extend(data, { calculatedValues: calculatedValues }, this.values, names);
            elEditor = $.tmpl(self.getTemplate("frame"), data);

            elEditor.find(".renderlayout-group").hide().addClass("renderlayout-close");

            for (var i = 0; i < subpropertiesLength; i++) {
                subproperty = data.subproperties[i].property;
                self.renderSubproperty(elEditor.find(".renderlayout-group"), subproperty);
            }
            elEditor.appendTo(container);

            // saves input value
            self.inputValue = [];

            if (self.layoutType == "pixels") {

                self.defaultLabelValue = data.subproperties[0].property["default"];
                self.defaultControlValue = data.subproperties[1].property["default"];
                self.defaultPixelValue = self.properties[0].options.value;
            }
            else{
                self.defaultLabelValue = self.properties[0].options.value;
                self.defaultControlValue = self.properties[1].options.value;
                self.defaultPixelValue = "";
            }

            self.inputValue.push(self.defaultLabelValue);
            self.inputValue.push(self.defaultControlValue);

            self.createDialogEditor(data);
        },

        createDialogEditor: function (data) {
            var self = this, elPopUpContent, elPopUpActions, elSplitterButton, elCloseButton, elCancelButton, elOkButton, elApplyButton;
            /** 
            CREACION DEL DIALOG DE EDICION DE PROPIEDADES 
            **/
            self.elPopUpContent = elPopUpContent = $.tmpl(self.getTemplate("content-popup"), data);
            elPopUpActions = $.tmpl(self.getTemplate("actions-popup"), data);


            $(".renderlayout-box1", elPopUpContent).text(self.defaultLabelValue + "%").attr("data-value", self.defaultLabelValue + "%");
            $(".renderlayout-box2", elPopUpContent).text(self.defaultControlValue + "%").attr("data-value", self.defaultControlValue + "%");
            $("#renderlayout-px-label", elPopUpContent).val(self.defaultPixelValue);

            elOkButton = $('.biz-action-btn', elPopUpActions).eq(1);
            elOkButton.click(function (event) { self.responseOkButton.apply(self, [elOkButton, event]); });

            elCancelButton = $('.biz-action-btn', elPopUpActions).eq(2);
            elCancelButton.click(function (event) { self.responseCancelButton.apply(self, [elCancelButton, event]); });

            elApplyButton = $('.biz-action-btn', elPopUpActions).eq(0);
            elApplyButton.click(function (event) { self.responseApplyButton.apply(self, [elApplyButton, event]); });

            elCloseButton = $('.biz-icon.ui-close-btn', elPopUpContent).eq(0);
            elCloseButton.click(function (event) { self.responseCloseButton.apply(self, [elCloseButton, event]); });

            /***/

            // calculate values in box
            elSplitterButton = $(".renderlayout-split", elPopUpContent);

            elSplitterButton.change(function () {
                var porcentaje1 = $(this).val();
                var porcentaje2 = 100 - porcentaje1;
                $(".renderlayout-box1", elPopUpContent).text(porcentaje1 + "%").attr("data-value", porcentaje1);
                $(".renderlayout-box2", elPopUpContent).text(porcentaje2 + "%").attr("data-value", porcentaje2);
            });

            self.createEditorUIControls(data, elPopUpContent);
            self.modalReference = self.createDialog(elPopUpContent, elPopUpActions);
        },

        renderSubproperty: function (container, data) {
            var elProperty, property;
            elProperty = $.tmpl(this.getTemplate("frame-property"), data);

            data.value = parseFloat(data.value);

            $.extend(data, { "editor-parameters": { suffix: "%", range: { min: 0, max: 100}} });

            property = new bizagi.editor.component.editor.int(elProperty, data, this.controller);

            this.properties.push(property);

            elProperty.appendTo(container);
            property.render();
        },

        calculateValues: function (subproperties) {
            var self = this;
            var subpropertiesLength, calculatedValues = "", i, defaultValues = [30, 70];
            (self.layoutType == "pixels") ?  subpropertiesLength = subproperties.length - 2 : subpropertiesLength = subproperties.length - 1;
            calculatedValues += "";
            for (i = 0; i < subpropertiesLength; i++) {
                if (subproperties[i].property.hasOwnProperty("value") & subproperties[i].property.value != null) {
                    calculatedValues += subproperties[i].property.value;
                } else {
                    if (subproperties[i].property.hasOwnProperty("default") & subproperties[i].property["default"] != null) {
                        calculatedValues += subproperties[i].property["default"];
                    } else {
                        calculatedValues += defaultValues[i];
                        subproperties[i].property.value = defaultValues[i];
                    }
                }
                if (i == subpropertiesLength - 1) {
                    calculatedValues += "";
                } else {
                    calculatedValues += ", ";
                }
            }
            calculatedValues += "";
            return calculatedValues;
        },

        retrieveValues: function (calculatedValues) {
            var values = calculatedValues.replace(/\[|\]|,/g, "").trim().split(" ");
            return { per1: values[0], per2: values[1] };
        },

        retrieveNames: function (subproperties) {
            var i, names = [], subpropertiesLength = subproperties.length;
            for (i = 0; i < subpropertiesLength; i++) {
                names[i] = subproperties[i].property.caption;
            }
            return { caption1: names[0], caption2: names[1] };
        },

        remove: function () {
            this.element.hide();
            this.element.empty();
        },

        loadTemplates: function () {
            var deferred = $.Deferred();
            $.when(
                this.loadTemplate("frame", bizagi.getTemplate("bizagi.editor.component.editor.renderlayout").concat("#renderlayout-frame")),
                this.loadTemplate("frame-property", bizagi.getTemplate("bizagi.editor.component.editor.renderlayout").concat("#renderlayout-frame-property")),
                this.loadTemplate("content-popup", bizagi.getTemplate("bizagi.editor.component.editor.renderlayout").concat("#renderlayout-frame-popup")),
                this.loadTemplate("actions-popup", bizagi.getTemplate("bizagi.editor.component.editor.renderlayout").concat("#renderlayout-frame-popup-actions"))
                ).done(function () {
                    deferred.resolve();
                });
            return deferred.promise();
        },

        responseCloseDialog: function () {
            this.element.empty();
            this.renderEditor(this.element, this.options);
        },

        /*
        *
        */
        ".renderlayout-value click": function (el) {
            this.showDialogBox(el);
        },
        /*
        *
        */
        ".renderlayout-data > .biz-ico.ui-control-modal click": function (el) {
            this.showDialogBox(el);
        },

        /*
        *
        */
        showDialogBox: function (el) {
            var self = this;
            self.showDialog(el).done(function () {
                // align splitter
                var splitter = $(".renderlayout-split", self.modalReference);
                var value = self.inputValue[0];
                splitter.val(value);
            });

            self.responseChangeDefaultFormat(self.layoutType, self.elPopUpContent);

            //Set pixel value only as number
            $("#renderlayout-px-label", self.modalReference).bind("keypress", function (e) {
                var unicode=e.charCode? e.charCode : e.keyCode
                if (unicode!=8){
                    if (unicode<48||unicode>57)
                        return false
                }
            });
        },

        responseCloseButton: function () { // close box
            var self = this;

            self.hideDialog();

            $(".renderlayout-box1", self.modalReference).attr("data-value", self.values.per1).text(self.values.per1 + "%");
            $(".renderlayout-box2", self.modalReference).attr("data-value", self.values.per2).text(self.values.per2 + "%");
        },

        responseOkButton: function () {
            var self = this;
            var LabelwidthPixel = $("#renderlayout-px-label", self.modalReference).val();

            if (!(self.myCombo.value == "pixels" && (LabelwidthPixel == "" || LabelwidthPixel == "NaN"))) {

                self.saveDataLayout();
                self.hideDialog(function () {
                    self.responseCloseDialog();
                });
            };
        },

        responseApplyButton: function () {
            var self = this;
            var LabelwidthPixel = $("#renderlayout-px-label", self.modalReference).val();

            if (!(self.myCombo.value == "pixels" && (LabelwidthPixel == "" || LabelwidthPixel == "NaN"))) {

                self.saveDataLayout();
            }
        },

        saveDataLayout: function () {
            var self = this, firstSubproperty, secondSubproperty, thirdSubproperty;

            firstSubproperty = self.options.subproperties[0];
            secondSubproperty = self.options.subproperties[1];
            thirdSubproperty = self.options.subproperties[2];

            self.layoutType = self.myCombo.value;

            if (self.layoutType == "pixels") {
                firstSubproperty.property.value = $("#renderlayout-px-label", self.modalReference).val();
                secondSubproperty.property.value = "1";
            }
            else {
                firstSubproperty.property.value = $(".renderlayout-box1", self.modalReference).attr("data-value");
                secondSubproperty.property.value = $(".renderlayout-box2", self.modalReference).attr("data-value");
            }

            thirdSubproperty.property.value = self.layoutType;

            var properties = [];
            properties.push({ property: firstSubproperty.property.name, value: firstSubproperty.property.value.replace(/\%/gi, '') });
            properties.push({ property: secondSubproperty.property.name, value: secondSubproperty.property.value.replace(/\%/gi, '') });
            properties.push({ property: thirdSubproperty.property.name, value: thirdSubproperty.property.value });

            self.controller.publish("propertyEditorChanged", {
                typeEvent: bizagi.editor.component.properties.events.PROPERTIES_CHANGE_MULTIPLE_PROPERTIES,
                properties: properties,
                id: this.element.closest(".bizagi_editor_component_properties").data("id")
            });
        },

        responseCancelButton: function () {
            var self = this;

            self.hideDialog();
            $(".renderlayout-box1", self.modalReference).attr("data-value", this.values.per1).text(this.values.per1 + "%");
            if (this.values.per2 != undefined) {
                $(".renderlayout-box2", self.modalReference).attr("data-value", this.values.per2).text(this.values.per2 + "%");
            }
        },

        responseChangeDefaultFormat: function (elValue, elPopUpContent) {
            var self = this;
            var percentageDiv = $(".renderlayout-names[data-id='percentageData']", self.modalReference);
            var pixelDiv = $(".renderlayout-names[data-id='pixelData']", self.modalReference);

            var itemsCombo = $(".ui-bizagi-editor-comboBox-option", elPopUpContent);
            var itemComboPorce = $(".biz-btn", itemsCombo[0]);
            var itemComboPixel = $(".biz-btn", itemsCombo[1]);
            var itemIcoPorce = $(".biz-ico", itemComboPorce);
            var itemIcoPixel = $(".biz-ico", itemComboPixel);

            var selectCombo = $(".ui-control-text-box, .ui-comboBox-selector-text", elPopUpContent);
            var selectComboi = $("i", selectCombo);
            var selectComboSpan = $("span", selectCombo);

            var porcentaje1 = self.values.per1;

            if (porcentaje1 > 100) {

                self.values.per1 = 50;
            }
            var porcentaje2 = 100 - porcentaje1;

            itemIcoPorce.removeClass();
            itemIcoPixel.removeClass();

            if (elValue == "pixels") {
                $('.renderlayout-separator', elPopUpContent).hide();

                selectComboi.removeClass("ui-comboBox-image-large-percentage biz-ico-0");
                selectComboi.addClass("ui-comboBox-image-large-pixels biz-ico-0");
                selectComboSpan.text(bizagi.localization.getResource("formmodeler-component-editor-renderLayout-pixels-format"));

                percentageDiv.addClass("renderlayout-px-active");
                pixelDiv.removeClass("renderlayout-px-active");

                itemIcoPorce.addClass("biz-ico ui-comboBox-image-small-uncheck bz-studio bz-black bz-point_16x16_black");
                itemIcoPixel.addClass("biz-ico ui-comboBox-image-small-check bz-studio bz-point_16x16_standard");

            } else {
                $('.renderlayout-separator', elPopUpContent).show();

                selectComboi.removeClass("ui-comboBox-image-large-pixels biz-ico-0");
                selectComboi.addClass("ui-comboBox-image-large-percentage biz-ico-0");
                selectComboSpan.text(bizagi.localization.getResource("formmodeler-component-editor-renderLayout-percentage-format"));

                percentageDiv.removeClass("renderlayout-px-active");

                if (porcentaje1 != "") {
                    self.values.per2 = porcentaje2;
                    $(".renderlayout-box2", elPopUpContent).text(porcentaje2 + "%").attr("data-value", porcentaje2);
                }
                pixelDiv.addClass("renderlayout-px-active");

                itemIcoPorce.addClass("biz-ico ui-comboBox-image-small-check bz-studio bz-point_16x16_standard");
                itemIcoPixel.addClass("biz-ico ui-comboBox-image-small-uncheck bz-studio bz-black bz-point_16x16_black");
            }
        },

        // Create UIControls
        createEditorUIControls: function (data, elPopUpContent) {
            var self = this;

            $.extend(data, {
                uiValues:
                    [
                        { label: bizagi.localization.getResource("formmodeler-component-editor-renderLayout-percentage-format"), value: "percentage" },
                        { label: bizagi.localization.getResource("formmodeler-component-editor-renderLayout-pixels-format"), value: "pixels" }
                    ]
            });

            self.myCombo = new self.uiControls.comboBox(
                {
                    uiWidthIcon: 0,
                    uiEditor: self,
                    uiInitValue: self.layoutType,
                    uiContainer: $('.renderLayout-modal-default-format', elPopUpContent),
                    uiValues: data.uiValues,
                    uiInline: self.inline,
                    onChange: function (elValue, event) {
                        self.responseChangeDefaultFormat(elValue, elPopUpContent);
                    }
                });
            }
        }
    );