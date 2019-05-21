/*
@title: Editor textformat
@authors: Rhony Pedraza
@date: 13-jul-12
*/
bizagi.editor.component.editor(
    "bizagi.editor.component.editor.textformat", {
        init: function (canvas, model, controller) {
            this._super(canvas, model, controller);
        },
        renderEditor: function (container, data) {
            var elEditor, self = this, i, subpropertiesLength = data.subproperties.length, valueFontSize;

            self.values = {};
            self.palette = [
                ['transparent'],
                ['ffffff', '000000', 'eeece1', '1f497d', '4f81bd', 'c0504d', '9bbb59', '8064a2', '4bacc6', 'f79646'],
                ['f2f2f2', '7f7f7f', 'ddd9c3', 'c6d9f0', 'dbe5f1', 'f2dcdb', 'ebf1dd', 'e5e0ec', 'dbeef3', 'fdeada'],
                ['d8d8d8', '595959', 'c4bd97', '8db3e2', 'b8cce4', 'e5b9b7', 'd7e3bc', 'ccc1d9', 'b7dde8', 'fbd5b5'],
                ['bfbfbf', '3f3f3f', '938953', '548dd4', '95b3d7', 'd99694', 'c3d69b', 'b2a2c7', '92cddc', 'fac08f'],
                ['a5a5a5', '262626', '494429', '17365d', '366092', '953734', '76923c', '5f497a', '31859b', 'e36c09'],
                ['7f7f7f', '0c0c0c', '1d1b10', '0f243e', '244061', '632423', '4f6128', '3f3151', '205867', '974806'],
                ['c00000', 'ff0000', 'ffc000', 'ffff00', '92d050', '00b050', '00b0f0', '0070c0', '002060', '7030a0']
            ];

            elEditor = $.tmpl(self.getTemplate("frame"), data);

            // Render subproperties and set a map with the initial values
            for (i = 0; i < subpropertiesLength; i++) {
                self.values[data.subproperties[i].property.name] = data.subproperties[i].property.value;
                self.renderSubproperty(elEditor, data.subproperties[i].property);
            }
            self.initialValues = bizagi.clone(self.values);

            elEditor.appendTo(container);

            // set right font and set relative value
            self.setFontSize(data.subproperties);

            // initial values
            valueFontSize = self.retrieveValueFontSize(data.subproperties);
            if (bizagi.util.isEmpty(valueFontSize)) {
                self.refFontSize = parseInt($(".textformat-preview", this.element).css("font-size"));
            } else {
                if (/^(\+[1-9][0-9]*|0|-[1-9][0-9]*)$/.test(valueFontSize)) {
                    self.refFontSize = self.calculateFontSize(valueFontSize);
                } else {
                    throw "FontSize value error.";
                }
            }
        },
        closeSp: function (element, e) {
            var tg = $(e.target),
                tgElement = $(".sp-container", $("body"));
            if (tg.closest(tgElement).length === 0) {
                element.spectrum("hide");
                $(document).unbind("mousedown.closesp");
            }
        },
        setFontSize: function (subproperties) {
            var i, value, text, num, self = this;
            for (i = 0; i < subproperties.length; i++) {
                var subPropertyName = subproperties[i].property.name.split(".").pop();
                if (subPropertyName == "size") {
                    value = subproperties[i].property.value;
                    if (value === null || value === undefined) {
                        value = "0";
                    } else {
                        if (/^(\+[1-9][0-9]*|0|-[1-9][0-9]*)$/.test(value)) {
                            text = $(".textformat-preview", this.element);
                            if (value != "0") {
                                num = parseInt(value.toString().substr(1));

                                // for postRender
                                self.registerCallback(function () {
                                    if (/^\+.*$/.test(value)) {
                                        text.css({ "font-size": (parseInt(text.css("font-size")) + num) + "px" });
                                    } else {
                                        text.css({ "font-size": (parseInt(text.css("font-size")) - num) + "px" });
                                    }
                                });
                            }
                        }
                    }
                    // set relative value
                    $(".textformat-size-value", this.element).text(value);
                    break;
                }
            }
        },
        calculateFontSize: function (valueFontSize) {
            var value, num, self = this;
            var ref = parseInt($(".textformat-preview", self.element).css("font-size"));
            if (valueFontSize == "0") {
                value = ref;
            } else {
                num = parseInt(valueFontSize.toString().substr(1));
                if (/^\+.*$/.test(valueFontSize)) {
                    value = ref - num;
                } else {
                    value = ref + num;
                }
            }
            return value;
        },
        retrieveValueFontSize: function (subproperties) {
            var i, value = null;
            for (i = 0; i < subproperties.length; i++) {
                var subPropertyName = subproperties[i].property.name.split(".").pop();
                if (subPropertyName == "size") {
                    value = subproperties[i].property.value;
                    break;
                }
            }
            return value;
        },
        renderSubproperty: function (container, property) {
            var self = this;
            var elSubproperty, selected, text = $(".textformat-preview", container);
            var propertyName = property.name.split(".").pop();
            switch (propertyName) {
                case "bold":
                    selected = (property.value === null) ? "" : (property.value === true || property.value == "true") ? " selected" : "";
                    (selected == "") ? text.removeClass("bold") : text.addClass("bold");
                    elSubproperty = $.tmpl(this.getTemplate("bold"), { selected: selected, property: this.options.name });
                    elSubproperty.appendTo(container.find(".textformat-actions"));
                    break;
                case "italic":
                    selected = (property.value === null) ? "" : (property.value === true || property.value == "true") ? " selected" : "";
                    (selected == "") ? text.removeClass("italic") : text.addClass("italic");
                    elSubproperty = $.tmpl(this.getTemplate("italic"), { selected: selected, property: this.options.name });
                    elSubproperty.appendTo(container.find(".textformat-actions"));
                    break;
                case "underline":
                    selected = (property.value === null) ? "" : (property.value === true || property.value == "true") ? " selected" : "";
                    (selected == "") ? text.removeClass("underline") : text.addClass("underline");
                    elSubproperty = $.tmpl(this.getTemplate("underline"), { selected: selected, property: this.options.name });
                    elSubproperty.appendTo(container.find(".textformat-actions"));
                    break;
                case "strikethru":
                    selected = (property.value === null) ? "" : (property.value === true || property.value == "true") ? " selected" : "";
                    (selected == "") ? text.removeClass("strikeout") : text.addClass("strikeout");
                    elSubproperty = $.tmpl(this.getTemplate("strikeout"), { selected: selected, property: this.options.name });
                    elSubproperty.appendTo(container.find(".textformat-actions"));
                    break;
                case "color":
                    elSubproperty = $.tmpl(this.getTemplate("font"), {property: this.options.name});
                    elSubproperty.appendTo(container.find(".textformat-actions"));

                    if (property.value) {
                        property.value = property.value.toLowerCase();
                        text.css({ color: property.value });
                    }

                    $("input.textformat-image-font", container).spectrum({
                        color: property.value,
                        showPaletteOnly: true,
                        palette: self.palette,
                        change: function (color) {
                            var publishColor,
                               colorStr = color.toRgbString();

                            if (colorStr === 'rgba(0, 0, 0, 0)') {
                                publishColor = '';
                            } else {
                                publishColor = color.toHexString();
                            }

                            $(".textformat-preview", container).css({
                                color: publishColor
                            });
                            // Update value
                            self.changeProperty(property.name, publishColor);
                        },
                        beforeShow: function (color) {
                            // Autoclose when clicking outside                            
                            $(document).bind("mousedown.closesp", function (e) { self.closeSp($("input.textformat-image-font", container), e) });
                            return true;
                        }
                    });

                    $(".sp-preview", container).addClass('biz-ico bz-studio bz-format-text-letter-a_16x16_standard');
                    
                    $(".sp-replacer", container).find('.sp-dd').remove();
                    break;
                case "background":
                    elSubproperty = $.tmpl(this.getTemplate("background"), { property: this.options.name });
                    elSubproperty.appendTo(container.find(".textformat-actions"));

                    if (property.value) {
                        property.value = property.value.toLowerCase();
                        text.css({ "background-color": property.value });
                    } else {
                        property.value = "transparent";
                        text.css({ "background-color": "transparent" });
                    }

                    $("input.textformat-image-background", container).spectrum({
                        color: property.value,
                        showPaletteOnly: true,
                        preferredFormat: "rgb",
                        palette: self.palette,
                        change: function (color) {

                            var publishColor,
                                colorStr = color.toRgbString();

                            if (colorStr === 'rgba(0, 0, 0, 0)') {
                                publishColor = '';
                            } else {
                                publishColor = color.toHexString();
                            }

                            $(".textformat-preview", container).css({
                                "background-color": publishColor
                            });
                            // Update value
                            self.changeProperty(property.name, publishColor);
                        },
                        beforeShow: function (color) {                            
                            // Autoclose when clicking outside
                            $(document).bind("mousedown.closesp", function (e) { self.closeSp($("input.textformat-image-background", container), e) });
                            return true;
                        }
                    });

                    $(".sp-preview", container).addClass('biz-ico bz-studio bz-format-text-color-background_16x16_standard');

                    $(".sp-replacer", container).find('.sp-dd').remove();

                    break;
                case "size":
                    elSubproperty = $.tmpl(this.getTemplate("size"), { property: this.options.name });
                    elSubproperty.appendTo(container.find(".textformat-actions"));
                    break;
            }
        },
        resetSubproperty: function (subproperty) {
            var text = $(".textformat-preview", this.element);
            var propertyName = subproperty.split(".").pop();
            switch (propertyName) {
                case "bold":
                    $(".textformat-actions .textformat-image-bold").removeClass("selected");
                    text.removeClass("bold");
                    break;
                case "italic":
                    $(".textformat-actions .textformat-image-italic").removeClass("selected");
                    text.removeClass("italic");
                    break;
                case "underline":
                    $(".textformat-actions .textformat-image-underline").removeClass("selected");
                    text.removeClass("underline");
                    break;
                case "strikethru":
                    $(".textformat-actions .textformat-image-strikeout").removeClass("selected");
                    text.removeClass("strikeout");
                    break;
                case "color":
                    $("input.textformat-image-font", this.element).spectrum("set", "black");
                    text.css("color", "black");
                    break;
                case "background":
                    $("input.textformat-image-background", this.element).spectrum("set", "");
                    text.css("background-color", "");
                    break;
                case "size":
                    text.css("font-size", this.refFontSize + "px");
                    $(".textformat-size-value", this.element).text("0");
                    break;
            }
        },
        remove: function () {
            this.element.hide();
            this.element.empty();
        },
        loadTemplates: function () {
            var deferred = $.Deferred();
            $.when(
                this.loadTemplate("frame", bizagi.getTemplate("bizagi.editor.component.editor.textformat").concat("#textformat-frame")),
                this.loadTemplate("bold", bizagi.getTemplate("bizagi.editor.component.editor.textformat").concat("#textformat-frame-bold")),
                this.loadTemplate("italic", bizagi.getTemplate("bizagi.editor.component.editor.textformat").concat("#textformat-frame-italic")),
                this.loadTemplate("underline", bizagi.getTemplate("bizagi.editor.component.editor.textformat").concat("#textformat-frame-underline")),
                this.loadTemplate("strikeout", bizagi.getTemplate("bizagi.editor.component.editor.textformat").concat("#textformat-frame-strikeout")),
                this.loadTemplate("font", bizagi.getTemplate("bizagi.editor.component.editor.textformat").concat("#textformat-frame-font")),
                this.loadTemplate("background", bizagi.getTemplate("bizagi.editor.component.editor.textformat").concat("#textformat-frame-background")),
                this.loadTemplate("size", bizagi.getTemplate("bizagi.editor.component.editor.textformat").concat("#textformat-frame-size"))
            ).done(function () {
                deferred.resolve();
            });
            return deferred.promise();
        },

        /*
        *   Changes the property in the map, and fires the event to update the view
        */
        changeProperty: function (subproperty, value) {
            var options;
            this.values[subproperty] = value;

            options = {
                typeEvent: bizagi.editor.component.properties.events.PROPERTIES_CHANGE_PROPERTY,
                oldValue: this.initialValues[subproperty],
                newValue: value,
                type: subproperty,
                id: this.element.closest(".bizagi_editor_component_properties").data("id")
            };

            this.controller.publish("propertyEditorChanged", options);
        },

        publishReset: function () {
            var options, text = $(".textformat-preview", this.element);

            $(".textformat-actions .textformat-image-bold").removeClass("selected");
            text.removeClass("bold");

            $(".textformat-actions .textformat-image-italic").removeClass("selected");
            text.removeClass("italic");

            $(".textformat-actions .textformat-image-strikeout").removeClass("selected");
            text.removeClass("strikeout");

            $(".textformat-actions .textformat-image-underline").removeClass("selected");
            text.removeClass("underline");

            $("input.textformat-image-background", this.element).spectrum("set", "");
            text.css("background-color", "");

            $("input.textformat-image-font", this.element).spectrum("set", "black");
            text.css("color", "black");

            text.css("font-size", "17px");
            $(".textformat-size-value", this.element).text("0");

            options = {
                typeEvent: bizagi.editor.component.properties.events.PROPERTIES_CHANGE_PROPERTY,
                oldValue: this.initialValues,
                newValue: this.initialValues,
                type: this.options.name,
                id: this.element.closest(".bizagi_editor_component_properties").data("id")
            };

            this.controller.publish("propertyEditorChanged", options);
        },

        ".textformat-actions i.textformat-primary-control click": function (el) {
            var text;
            var style = el.data("preview-style");
            var property = el.data("property");

            // Toogle icon
            el.toggleClass("selected");

            // Refresh preview
            text = $(".textformat-preview", this.element);
            text.toggleClass(style);

            // Update value
            this.changeProperty(property, !this.values[property]);

        },
        ".textformat-actions i.textformat-tertiary-control click": function (el) {
            var text = $(".textformat-preview", this.element);
            var size = $(".textformat-size-value", this.element);
            var property = el.data("property");
            var value, change = true;
            if (el.hasClass("textformat-image-size-plus")) {
                value = parseInt(size.text());
                value++;
                if(value <= 20) {
                    text.css({"font-size": (parseInt(text.css("font-size")) + 1) + "px"});
                    size.text(value > 0 ? "+" + value : value);
                } else {
                    change = false;
                }
            } else {
                value = parseInt(size.text());
                value--;
                if(value >= -9) {
                    text.css({"font-size": (parseInt(text.css("font-size")) - 1) + "px"});
                    size.text(value > 0 ? "+" + value : value);
                } else {
                    change = false;
                }
                
            }

            // Update value
            if(change) {
            this.changeProperty(property, value > 0 ? "+" + value : value);
            }
        },
        ".textformat-image-reset click": function () {
            this.publishReset();
        }
    }
);