/*
@title: Editor BooleanRule Component
@authors: Rhony Pedraza
@date: 07-may-12
*/
bizagi.editor.component.editor(
    "bizagi.editor.component.editor.horizontalalign", {
        init: function (canvas, model, controller) {
            this._super(canvas, model, controller);
        },
        renderEditor: function (container, data) {
            var self = this, elEditor, elPadreValues, elOption, elOptionValues, elProperties, lblRequired, i, elTitle, elOptionVal, counterProp, elOptionIcon, elOptionNewIcon;
            var tooltipRight, tooltipLeft, tooltipCenter, tooltipJustify;

            //TODO: create styles when slef.inDropDown is true
            self.inDropDown = false;

            self.inputValue = data.value;
            
            if (data.name == "columntitlealign") {
                tooltipRight = bizagi.localization.getResource("formmodeler-component-editor-columntitlealign-align-right");
                tooltipLeft = bizagi.localization.getResource("formmodeler-component-editor-columntitlealign-align-left");
                tooltipCenter = bizagi.localization.getResource("formmodeler-component-editor-columntitlealign-align-center");
                tooltipJustify = bizagi.localization.getResource("formmodeler-component-editor-columntitlealign-align-justify");

            } else if (data.name == "columnalign") {
                tooltipRight = bizagi.localization.getResource("formmodeler-component-editor-columnalign-align-right");
                tooltipLeft = bizagi.localization.getResource("formmodeler-component-editor-columnalign-align-left");
                tooltipCenter = bizagi.localization.getResource("formmodeler-component-editor-columnalign-align-center");
                tooltipJustify = bizagi.localization.getResource("formmodeler-component-editor-columnalign-align-justify");

            } else {
                tooltipRight = bizagi.localization.getResource("formmodeler-component-editor-horizontalalign-align-right");
                tooltipLeft = bizagi.localization.getResource("formmodeler-component-editor-horizontalalign-align-left");
                tooltipCenter = bizagi.localization.getResource("formmodeler-component-editor-horizontalalign-align-center");
                tooltipJustify = bizagi.localization.getResource("formmodeler-component-editor-horizontalalign-align-justify");
            }

            $.extend(data, {
                labelValues:
                                {
                                    optionRight: tooltipRight,
                                    optionLeft: tooltipLeft,
                                    optionCenter: tooltipCenter,
                                    optionJustify: tooltipJustify
                                },
                iconValues: [
                                    "right",
                                    "left",
                                    "center",
                                    "justify"
                ],
                iconsNew: [
                                    "bz-studio bz-text-align-right_16x16_standard",
                                    "bz-studio bz-text-align-left_16x16_standard",
                                    "bz-studio bz-text-align-center_16x16_standard",
                                    "bz-studio bz-text-align-justify_16x16_standard"
                ]

            });

            elEditor = $.tmpl(self.getTemplate("frame"), data);
            var elValues = $.tmpl(self.getTemplate("values"), data);
            var elCheck = $.tmpl(self.getTemplate("check"), data);

            if (self.inDropDown) {
                elValues.insertAfter($('.horizontalalign-group-container', elEditor));




                counterProp = 0;
                for (elProperties in data.labelValues) {
                    if (data.value === data.labelValues[elProperties]) {
                        elOptionIcon = data.iconValues[counterProp];
                        break;
                    }
                    counterProp++;
                }

                elOption = $.tmpl(self.getTemplate("option"), { option: data.value, icon: elOptionIcon });
                elOption.append(elCheck);

                $('.horizontalalign-group-container', elEditor).append(elOption);
            } else {
                self.element.addClass('without-dropdown');
            }


            counterProp = 0;
            for (elProperties in data.labelValues) {
                elOptionVal = data.labelValues[elProperties].toLowerCase();
                elOptionIcon = data.iconValues[counterProp];
                elOptionNewIcon = data.iconsNew[counterProp];
                elTitle = bizagi.localization.getResource(data.labelValues[elProperties]);
                elOptionValues = $.tmpl(self.getTemplate("option"), { option: elOptionVal, title: elTitle, icon: elOptionIcon, newIcon: elOptionNewIcon });
                elCheck = $.tmpl(self.getTemplate("check"), {});
                elOptionValues.append(elCheck);
                if (self.inDropDown) {
                    elOptionValues.append(elCheck);
                    $('.horizontalalign-values', elEditor).append(elOptionValues);
                } else {
                    $('.horizontalalign-group-container', elEditor).append(elOptionValues);
                }
                counterProp++;
            }

            elEditor.appendTo(container);

            lblRequired = $('label', elEditor);
            self.addRequired(lblRequired);

            if (self.inDropDown) {
                $('.horizontalalign-values', elEditor).append(elOptionValues);
            } else {

                data.value = (data.value == 'default') ? 'left' : data.value;

                elPadreValues = $('.horizontalalign-image-small-' + data.value.toLowerCase(), self.element).parent();
                elPadreValues.addClass('biz-btn-checked');
                elPadreValues.find('.horizontalalign-image-icon-uncheck').toggleClass("horizontalalign-image-icon-uncheck horizontalalign-image-icon-check");
            }


            $('.horizontalalign-group', elEditor).tooltip({ tooltipClass: 'ui-widget-content ui-propertybox-tooltip ui-horizontalalign-tooltip',
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
            var deferred = new $.Deferred();
            $.when(
                this.loadTemplate("frame", bizagi.getTemplate("bizagi.editor.component.editor.horizontalalign").concat("#horizontalalign-frame")),
                this.loadTemplate("option", bizagi.getTemplate("bizagi.editor.component.editor.horizontalalign").concat("#horizontalalign-frame-option")),
                this.loadTemplate("values", bizagi.getTemplate("bizagi.editor.component.editor.horizontalalign").concat("#horizontalalign-frame-values")),
                this.loadTemplate("check", bizagi.getTemplate("bizagi.editor.component.editor.horizontalalign").concat("#horizontalalign-frame-check"))
            ).done(function () {
                deferred.resolve();
            });
            return deferred.promise();
        },
        selectOption: function (el, event) {

            var self = this, newValue;

            $('.horizontalalign-group', self.element).removeClass('biz-btn-checked');

            if (self.element.hasClass('without-dropdown')) {
                el.addClass('biz-btn-checked');

                $(".horizontalalign-image-icon-check", self.element).removeClass("horizontalalign-image-icon-check").addClass('horizontalalign-image-icon-uncheck');
                $('.horizontalalign-image-icon-uncheck', el).toggleClass('horizontalalign-image-icon-uncheck horizontalalign-image-icon-check');

                newValue = el.find("i:eq(1)").data('value');

            } else {
                el.parent().find(".horizontalalign-group > i[class^=horizontalalign-icon-small-]").removeClass("horizontalalign-image-icon-check").addClass("horizontalalign-image-icon-uncheck");
                $("i:eq(2)", el).toggleClass("horizontalalign-image-small-uncheck horizontalalign-image-small-check");

                newValue = el.find("i:eq(1)").data('value');

                $(".horizontalalign-container > .horizontalalign-group-container .horizontalalign-group > i:eq(0)", self.element).removeClass().addClass("horizontalalign-icon-small-" + value.toLowerCase());
                $(".horizontalalign-container > .horizontalalign-group-container .horizontalalign-group > i:eq(1)", self.element).text(newValue);

                // publish

                $(".horizontalalign-values", this.element).removeClass("horizontalalign-open").addClass("horizontalalign-close");
            }

            self.controller.publish("propertyEditorChanged", { typeEvent: bizagi.editor.component.properties.events.PROPERTIES_CHANGE_PROPERTY, oldValue: self.inputValue, newValue: newValue.toLowerCase(), data: newValue.toLowerCase(), type: self.options.name, id: self.element.closest(".bizagi_editor_component_properties").data("id") });
            self.inputValue = newValue.toLowerCase();
        },
        // hover in control
        /*".horizontalalign-container > .horizontalalign-group-container mouseenter" : function(el, event) {
        $(".horizontalalign-image-normal-expand", this.element).removeClass("horizontalalign-hidden").addClass("horizontalalign-show");
        el.removeClass("horizontalalign-collapsed").addClass("horizontalalign-expanded");
        },
        // leave control
        ".horizontalalign-container > .horizontalalign-group-container mouseleave" : function(el, event) {
        $(".horizontalalign-image-normal-expand", this.element).removeClass("horizontalalign-show").addClass("horizontalalign-hidden");
        el.removeClass("horizontalalign-expanded").addClass("horizontalalign-collapsed");
        },*/
        // open options
        /*".horizontalalign-container > .horizontalalign-group-container click" : function(el, event) {
            
        $(".horizontalalign-values", this.element).slideDown(function(){
        $(this).removeClass("horizontalalign-close").addClass("horizontalalign-open");
        $(document).bind('mouseup',function(){
        var container = $(".horizontalalign-values");
        if (container.has(event.target).length === 0)
        {
        container.slideUp();
        }
        })
        });
        },*/
        // select an option
        ".horizontalalign-group click": function (el, event) {
            var self = this;
            self.selectOption(el, event);
        },
        ".horizontalalign-values > .horizontalalign-group click": function (el, event) {
            var self = this;
            self.selectOption(el, event);
        },
        ".horizontalalign-values mouseenter": function (el, event) {
            $(".horizontalalign-container > .horizontalalign-group-container .horizontalalign-image-normal-expand", this.element).removeClass("horizontalalign-hidden").addClass("horizontalalign-show");
            $(".horizontalalign-container > .horizontalalign-group-container .horizontalalign-group", this.element).removeClass("horizontalalign-collapsed").addClass("horizontalalign-expanded");
        },
        ".horizontalalign-values mouseleave": function (el, event) {
            $(".horizontalalign-container > .horizontalalign-group-container .horizontalalign-image-normal-expand").removeClass("horizontalalign-show").addClass("horizontalalign-hidden");
            $(".horizontalalign-container > .horizontalalign-group-container .horizontalalign-group").removeClass("horizontalalign-expanded").addClass("horizontalalign-collapsed");
            el.removeClass("horizontalalign-open").addClass("horizontalalign-close");
        }
    }
);