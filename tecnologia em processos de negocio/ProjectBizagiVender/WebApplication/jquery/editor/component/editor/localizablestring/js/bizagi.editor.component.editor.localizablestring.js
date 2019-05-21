/*
@title: Editor Boolean Component
@authors: Alexander Mejia / Ramiro Gomez
@date: 14-jun-12
*/

bizagi.editor.component.editor(
    "bizagi.editor.component.editor.localizablestring", {

        init: function (canvas, model, controller) {
            this._super(canvas, model, controller);
            this.focus = null;
        },

        renderEditor: function (container, data) {
            var self = this, elEditor, elLocalization, temporal, lblRequired, params, regexp = /<\s*\w+[\S\s]*>/im, extend = {};

            if (!data.value) {
                self.defaultAttributeSelected = true;
                data.value = "";
            }

            if (regexp.test(data.value)) {
                $.extend(extend, { value: "HTML", html: true });
                self.isHTML = true;
            }

            params = self.parameters;

            self.inputValue = data.value;
            self.defaultValue = data["default"] ? data["default"] : "";

            self.localization = true;
            if (!$.isEmptyObject(params)) {
                if (bizagi.util.parseBoolean(params["show-attribute-default"])) {
                    self.defaultBindCaption = true;
                }
                if (bizagi.util.parseBoolean(params["show-richtext-editor"])) {
                    self.showRichtextEditor = true;
                }
            }

            elEditor = $.tmpl(self.getTemplate("frame"), $.extend({}, data, extend));
            elLocalization = $.tmpl(self.getTemplate("localization"));
            var elDefaultBindCaption = $.tmpl(self.getTemplate("defaultBindCaption"));

            if (self.showRichtextEditor) {
                $('.editor-localizablestring-input', elEditor).append($.tmpl(self.getTemplate("richtext")));
            }

            if (self.localization) {
                $('.editor-localizablestring-input', elEditor).append(elLocalization);
            };

            if (self.defaultBindCaption) {
                $('.editor-localizablestring-input', elEditor).append(elDefaultBindCaption);
                if (self.defaultAttributeSelected) {
                    $('.editor-localizablestring-default-bind', elEditor).addClass('bz-studio');
                    $('.editor-localizablestring-default-bind', elEditor).addClass('bz-checked_16x16_standard');
                }
            }

            elEditor.appendTo(container);

            lblRequired = $('label', elEditor);
            self.addRequired(lblRequired);

        },
        selectEditor: function () {
            var self = this;
            $("input", self.element).select();
        },

        loadTemplates: function () {
            var self = this, deferred;

            deferred = new $.Deferred();
            $.when(
                self.loadTemplate("frame", bizagi.getTemplate("bizagi.editor.component.editor.localizablestring").concat("#localizablestring-frame")),
                self.loadTemplate("localization", bizagi.getTemplate("bizagi.editor.component.editor.localizablestring").concat("#localizablestring-localization")),
                self.loadTemplate("richtext", bizagi.getTemplate("bizagi.editor.component.editor.localizablestring").concat("#localizablestring-richtext")),
                self.loadTemplate("richtext-editor", bizagi.getTemplate("bizagi.editor.component.editor.localizablestring").concat("#localizablestring-richtext-editor")),
                self.loadTemplate("defaultBindCaption", bizagi.getTemplate("bizagi.editor.component.editor.localizablestring").concat("#localizablestring-default-bind"))
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

        publishValue: function (value) {
            var self = this;
            self.options.value = value;

            var options = {
                typeEvent: bizagi.editor.component.properties.events.PROPERTIES_CHANGE_PROPERTY,
                oldValue: self.inputValue,
                newValue: value,
                type: self.options.name,
                id: self.element.closest(".bizagi_editor_component_properties").data("id")
            };

            if (self.options.hasOwnProperty("exclusive")) {
                options = $.extend({}, options, { exclusive: self.options.exclusive });
            }

            self.controller.publish("propertyEditorChanged", options);

            self.inputValue = value;
        },
        "input keyup": function (el, event) {
            var self = this, value = el.val() || "";

            if (el.hasClass("isHtml") && value !== "HTML") {
                el.removeClass("isHtml");
            }

            if ((event.keyCode == 13) && (value !== self.inputValue)) {
                self.publishValue(value);
            }
        },
        "input blur": function (el) {
            var self = this, localizationIcon, value, inputParent, richtextIcon;

            inputParent = self.element.find('input[type="text"]').parent();

            if (self.showRichtextEditor) {
                richtextIcon = self.element.find(".editor-localizablestring-richtext");
                richtextIcon.removeClass("ui-control-fadeIn");
            }

            localizationIcon = self.element.find('.editor-localizablestring-localization');
            localizationIcon.removeClass('ui-control-fadeIn');
            inputParent.toggleClass('ui-control-focus');

            value = el.val() || "";

            if (value !== self.inputValue) {
                if (value !== "HTML") {
                    self.publishValue(value);
                }
            }
        },
        "input focus": function () {
            var localizationIcon,
            richtextIcon,
            inputParent,
            self = this;

            if (self.showRichtextEditor) {
                richtextIcon = self.element.find(".editor-localizablestring-richtext");
                richtextIcon.addClass("ui-control-fadeIn");
            }

            localizationIcon = self.element.find('.editor-localizablestring-localization');
            inputParent = self.element.find('input[type="text"]').parent();

            localizationIcon.addClass('ui-control-fadeIn');
            inputParent.toggleClass('ui-control-focus');
        },
        ".editor-localizablestring-richtext click": function () {
            var self = this, popup, buttons;

            if (self.showRichtextEditor) {
                popup = self.popup = bizagi.createPopup({
                    name: "bz-fm-localizablestring-richtext",
                    container: "form-modeler",
                    center: true,
                    title: bizagi.localization.getResource("formmodeler-component-editor-localizablestring-richtext-title")
                });
                popup.content.append($.tmpl(self.getTemplate("richtext-editor")));

                content = $(".bz-fm-localizablestring-richtext-content", popup.content);
                buttons = $(".bz-fm-localizablestring-richtext-buttons", content);

                content.height(content.height() - buttons.height());

                $(".bz-fm-localizablestring-richtext-ok", buttons).click(function () {
                    var value = tinymce.activeEditor.getContent();
                    value = bizagi.util.trim(value);
                    if (value) {
                        value = "<span>" + value + "</span>";
                        self.publishValue(value);
                    }
                    popup.overlay.remove();
                });
                $(".bz-fm-localizablestring-richtext-cancel", buttons).click(function () {
                    popup.overlay.remove();
                });

                tinymce.remove();
                tinymce.init({
                    selector: "textarea#richtext-editor",
                    menubar: false,
                    resize: false,
                    "forced_root_block": false,
                    //plugins: [ "textcolor code" ],
                    //toolbar1: "bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | forecolor | code"
                    plugins: ["textcolor autoresize"],
                    toolbar1: "bold italic underline strikethrough | forecolor"
                });
                if (self.isHTML) {
                    tinymce.activeEditor.setContent(self.inputValue);
                }
            }
        },
        ".editor-localizablestring-localization mouseup": function () {
            var self = this;

            self.controller.publish("propertyEditorChanged", {
                typeEvent: bizagi.editor.component.properties.events.PROPERTIES_SHOW_LOCALIZATION,
                value: self.inputValue,
                oldValue: this.options.value,
                type: self.options.name,
                id: self.element.closest(".bizagi_editor_component_properties").data("id")
            });
        },
        ".editor-localizablestring-localization mouseenter": function (el, event) {
            el.addClass('editor_localizablestring_fadeIn');
        },
        ".editor-localizablestring-localization mouseleave": function (el, event) {
            el.removeClass('editor_localizablestring_fadeIn');
        },
        ".editor-localizablestring-default-bind click": function (el, event) {
            //TODO: Implement event
            var self = this;
            if (el.hasClass('bz-checked_16x16_standard')) {
                el.removeClass('bz-checked_16x16_standard');
                el.addClass('bz-check_16x16_standard');
            } else {
                el.removeClass('bz-check_16x16_standard');
                el.addClass('bz-checked_16x16_standard');
                self.publishValue();
            }
            console.log("clicked");
        }


    }
)    
