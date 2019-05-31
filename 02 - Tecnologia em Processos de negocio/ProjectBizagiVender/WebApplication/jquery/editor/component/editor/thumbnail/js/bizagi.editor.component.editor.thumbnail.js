/*
@title: Editor BooleanRule Component
@authors: Rhony Pedraza
@date: 07-may-12
*/
bizagi.editor.component.editor(
    "bizagi.editor.component.editor.thumbnail", {
        init: function (canvas, model, controller) {
            this._super(canvas, model, controller);
        },
        renderEditor: function (container, data) {
            var self = this, elEditor, elPadreValues, elOption, elOptionValues, elProperties, lblRequired, i, firstSubproperty, secondSubproperty;

            //TODO: create styles when slef.inDropDown is true
            self.inDropDown = false;

            self.inputValue = data.value;
            self.minLimit = 32;
            self.maxLimit = 128;

            self.firstSubproperty = self.options.subproperties[0];
            self.secondSubproperty = self.options.subproperties[1];

            elEditor = $.tmpl(self.getTemplate("frame"), data);
            elValues = $.tmpl(self.getTemplate("values"), data);
            elCheck = $.tmpl(self.getTemplate("check"), data);

            self.mapSizes = self.mapForSizes(data);
            self.actualValue = self.retrieveValueObject(data);


            if (self.inDropDown) {
                elValues.insertAfter($('.thumbnail-group-container', elEditor));

                elOption = $.tmpl(self.getTemplate("option"), { name: self.actualValue.name, option: self.actualValue.label, value: { firstSubproperty: self.actualValue.value[self.firstSubproperty.property.name], secondSubproperty: self.actualValue.value[self.secondSubproperty.property.name]} });
                elOption.append(elCheck);

                $('.thumbnail-group-container', elEditor).append(elOption);
            } else {
                self.element.addClass('without-dropdown');
            }


            for (elProperties in self.mapSizes) {
                elOptionValues = $.tmpl(self.getTemplate("option"), { name: self.mapSizes[elProperties].name, option: self.mapSizes[elProperties].label, value: { firstSubproperty: self.mapSizes[elProperties].value[self.firstSubproperty.property.name], secondSubproperty: self.mapSizes[elProperties].value[self.secondSubproperty.property.name]} });
                elCheck = $.tmpl(self.getTemplate("check"), {});
                elOptionValues.append(elCheck);
                if (self.inDropDown) {
                    elOptionValues.append(elCheck);
                    $('.thumbnail-values', elEditor).append(elOptionValues);
                } else {
                    $('.thumbnail-group-container', elEditor).append(elOptionValues);

                }
                if (elProperties === "auto") {
                    $('.thumbnail-dimension', elOptionValues).remove();
                    $('.thumbnail-value', elOptionValues).css("margin-top","5px");
                }
            }

            elEditor.appendTo(container);

            lblRequired = $('label', elEditor);
            self.addRequired(lblRequired);

            if (self.inDropDown) {
                $('.thumbnail-values', elEditor).append(elOptionValues);
            } else {
                elPadreValues = $('.thumbnail-image-small-' + self.actualValue.name, self.element).closest('.biz-btn-vertical');
                elPadreValues.addClass('biz-btn-checked');
                elPadreValues.find('.thumbnail-image-icon-uncheck').toggleClass("thumbnail-image-icon-uncheck thumbnail-image-icon-check");
            }

        },
        retrieveValueObject: function (data) {
            var self = this, objectDataValue = {};
            var mapSize = self.mapSizes;

            if (self.secondSubproperty.property.value == -1) {
                objectDataValue = mapSize.auto;
            } else if (self.firstSubproperty.property.value <= self.minLimit) {
                objectDataValue = mapSize.small;
            } else if (self.secondSubproperty.property.value >= self.maxLimit) {
                objectDataValue = mapSize.large;
            } else  {
                objectDataValue = mapSize.medium;
            }

            return objectDataValue;

        },
        mapForSizes: function (data) {
            var self = this, thmb;
            var mapSize = { small: { label: bizagi.localization.getResource("formmodeler-component-editor-thumbnail-small"), value: {}, name: "Small" },
                medium: { label: bizagi.localization.getResource("formmodeler-component-editor-thumbnail-medium"), value: {}, name: "Medium" },
                large: { label: bizagi.localization.getResource("formmodeler-component-editor-thumbnail-large"), value: {}, name: "Large" },
                auto: { label: bizagi.localization.getResource("formmodeler-component-editor-thumbnail-auto"), value: {}, name: "Auto" }
            };

            mapSize.large.value[self.firstSubproperty.property.name] = "128";
            mapSize.large.value[self.secondSubproperty.property.name] = "128";

            mapSize.medium.value[self.firstSubproperty.property.name] = "64";
            mapSize.medium.value[self.secondSubproperty.property.name] = "64";

            mapSize.small.value[self.firstSubproperty.property.name] = "32";
            mapSize.small.value[self.secondSubproperty.property.name] = "32";

            mapSize.auto.value[self.firstSubproperty.property.name] = "-1";
            mapSize.auto.value[self.secondSubproperty.property.name] = "-1";

            if (data.value.width == -1) {
                thmb = "auto";
            } else if (data.value[self.firstSubproperty.name] <= self.minLimit) {
                thmb = "small";
            } else if (data.value[self.firstSubproperty.property.name] >= self.maxLimit) {
                thmb = "large";
            } else {
                thmb = "medium";
            }

            mapSize[thmb].selected = true;
            mapSize[thmb].value[self.firstSubproperty.property.name] = (data.value[self.firstSubproperty.property.name]) ? data.value[self.firstSubproperty.property.name] : mapSize[thmb].value[self.firstSubproperty.property.name];
            mapSize[thmb].value[self.secondSubproperty.property.name] = (data.value[self.secondSubproperty.property.name]) ? data.value[self.secondSubproperty.property.name] : mapSize[thmb].value[self.firstSubproperty.property.name];


            return mapSize;
        },
        remove: function () {
            this.element.hide();
            this.element.empty();
        },
        loadTemplates: function () {
            var deferred = new $.Deferred();
            $.when(
                this.loadTemplate("frame", bizagi.getTemplate("bizagi.editor.component.editor.thumbnail").concat("#thumbnail-frame")),
                this.loadTemplate("option", bizagi.getTemplate("bizagi.editor.component.editor.thumbnail").concat("#thumbnail-frame-option")),
                this.loadTemplate("values", bizagi.getTemplate("bizagi.editor.component.editor.thumbnail").concat("#thumbnail-frame-values")),
                this.loadTemplate("check", bizagi.getTemplate("bizagi.editor.component.editor.thumbnail").concat("#thumbnail-frame-check"))
                ).done(function () {
                    deferred.resolve();
                });
            return deferred.promise();
        },
        selectOption: function (el, event) {

            var self = this, firstSubproperty, secondSubproperty, newValueWidth, newValueHeight;

            $('.thumbnail-group', self.element).removeClass('biz-btn-checked');

            if (self.element.hasClass('without-dropdown')) {
                el.addClass('biz-btn-checked');

                $(".thumbnail-image-icon-check", self.element).removeClass("thumbnail-image-icon-check").addClass('thumbnail-image-icon-uncheck');
                $('.thumbnail-image-icon-uncheck', el).toggleClass('thumbnail-image-icon-uncheck thumbnail-image-icon-check');

                newValueWidth = el.data('firstsubproperty');
                newValueHeight = el.data('secondsubproperty');

            } else {
                el.parent().find(".thumbnail-group > i[class^=thumbnail-icon-small-]").removeClass("thumbnail-image-icon-check").addClass("thumbnail-image-icon-uncheck");
                $("i:eq(2)", el).toggleClass("thumbnail-image-small-uncheck thumbnail-image-small-check");

                newValueWidth = el.data('firstsubproperty');
                newValueHeight = el.data('secondsubproperty');

                $(".thumbnail-container > .thumbnail-group-container .thumbnail-group > i:eq(0)", self.element).removeClass().addClass("thumbnail-icon-small-" + value.toLowerCase());
                $(".thumbnail-container > .thumbnail-group-container .thumbnail-group > i:eq(1)", self.element).text(newValue);

                // publish

                $(".thumbnail-values", this.element).removeClass("thumbnail-open").addClass("thumbnail-close");
            }

            //self.controller.publish("propertyEditorChanged", { typeEvent: bizagi.editor.component.properties.events.PROPERTIES_CHANGE_PROPERTY, oldValue : self.inputValue, newValue : newValueWidth, data : newValue.toLowerCase(), type : self.options.name, id : self.element.closest(".bizagi_editor_component_properties").data("id")});

            var properties = [];
            properties.push({ property: self.firstSubproperty.property.name, value: newValueWidth });
            properties.push({ property: self.secondSubproperty.property.name, value: newValueHeight });

            self.controller.publish("propertyEditorChanged", {
                typeEvent: bizagi.editor.component.properties.events.PROPERTIES_CHANGE_MULTIPLE_PROPERTIES,
                properties: properties,
                id: this.element.closest(".bizagi_editor_component_properties").data("id")
            });

            self.inputValue = { width: newValueWidth, height: newValueHeight };
        },
        // hover in control
        ".thumbnail-container > .thumbnail-group-container mouseenter": function (el, event) {
            $(".thumbnail-image-normal-expand", this.element).removeClass("thumbnail-hidden").addClass("thumbnail-show");
            el.removeClass("thumbnail-collapsed").addClass("thumbnail-expanded");
        },
        // leave control
        ".thumbnail-container > .thumbnail-group-container mouseleave": function (el, event) {
            $(".thumbnail-image-normal-expand", this.element).removeClass("thumbnail-show").addClass("thumbnail-hidden");
            el.removeClass("thumbnail-expanded").addClass("thumbnail-collapsed");
        },
        // open options
        ".ui-editor:not(.without-dropdown) > .thumbnail-group-container click": function (el, event) {

            $(".thumbnail-values", this.element).slideDown(function () {
                $(this).removeClass("thumbnail-close").addClass("thumbnail-open");
                $(document).bind('mouseup', function () {
                    var container = $(".thumbnail-values");
                    if (container.has(event.target).length === 0) {
                        container.slideUp();
                    }
                })
            });
        },
        // select an option
        ".thumbnail-group-container .thumbnail-group click": function (el, event) {
            var self = this;
            if (!self.inDropDown) {
                self.selectOption(el, event);
            }
        },
        ".thumbnail-values > .thumbnail-group click": function (el, event) {
            var self = this;
            self.selectOption(el, event);
        },
        ".thumbnail-values mouseenter": function (el, event) {
            $(".thumbnail-container > .thumbnail-group-container .thumbnail-image-normal-expand", this.element).removeClass("thumbnail-hidden").addClass("thumbnail-show");
            $(".thumbnail-container > .thumbnail-group-container .thumbnail-group", this.element).removeClass("thumbnail-collapsed").addClass("thumbnail-expanded");
        },
        ".thumbnail-values mouseleave": function (el, event) {
            $(".thumbnail-container > .thumbnail-group-container .thumbnail-image-normal-expand").removeClass("thumbnail-show").addClass("thumbnail-hidden");
            $(".thumbnail-container > .thumbnail-group-container .thumbnail-group").removeClass("thumbnail-expanded").addClass("thumbnail-collapsed");
            el.removeClass("thumbnail-open").addClass("thumbnail-close");
        }
    }
    );