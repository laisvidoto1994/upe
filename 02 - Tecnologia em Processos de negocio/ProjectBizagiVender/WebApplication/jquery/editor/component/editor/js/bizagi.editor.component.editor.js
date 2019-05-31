/*
@title: Editor Component
@authors: Rhony Pedraza / Ramiro Gomez
@date: 23-apr-12
*/
$.Controller(
    "bizagi.editor.component.editor", {
        init: function (canvas, model, controller) {
            this.canvas = canvas;
            this.model = model;
            this.controller = controller;
            this.tmpl = {};
            this.parameters = this.getParams();
        },
        render: function () {
            var self = this,
            deferred = new $.Deferred();
            self.element.empty();

            self.inline = false;
            self.callbacks = [];

            self.element.addClass('ui-editor');

            if ($.isEmptyObject(self.tmpl)) {

                $.when(
                    self.loadInitTemplates(),
                    self.loadTemplates()
                ).done(function () {

                 if (self.options.show) {
                        self.renderEditor(self.element, self.options);
                        self.addTooltipEditor();
                  }
                    deferred.resolve();
                });


            } else {
                self.renderEditor(self.element, self.options);
                self.addTooltipEditor();
                deferred.resolve();
            }

            return deferred.promise();
        },
        registerCallback: function (fn) {
            var self = this;
            self.callbacks.push(fn);
        },
        postRender: function () {
            var self = this, i;
            for (i = 0; i < self.callbacks.length; i++) {
                self.callbacks[i]();
            }
        },
        addTooltipEditor: function () {
            var self = this;
            $('i[title]', self.element).tooltip({ tooltipClass: 'ui-widget-content ui-propertybox-tooltip' });
            $('div[title]', self.element).tooltip({ tooltipClass: 'ui-widget-content ui-propertybox-tooltip' });
        },
        addRequired: function (el, data) {
            var self = this, opRequired = self.options.required;

            if (data) {
                opRequired = data.required;
            }

            if (bizagi.util.parseBoolean(opRequired)) {
                if (el.length > 0) {
                    var required = $(' <span class="biz-ico ui-bizagi-render-required bz-studio bz-required_16x16_standard"/>');
                    for (var i = 0; i < el.length; i++) {
                        if (!$(el[i]).hasClass('ui-required')) {
                            $(el[i]).addClass('ui-required');
                            $(el[i]).append(required);
                        }
                    }
                }
            }
        },
        loadTemplate: function (name, path) {
            var self = this,
                defer = new $.Deferred();

            if (self.tmpl.hasOwnProperty(name)) {
                defer.resolve(self.tmpl[name]);
            } else {
                return bizagi.templateService.getTemplate(
                    path
                ).done(function (tmpl) {
                    self.tmpl[name] = tmpl;
                });
            }
            return defer.promise();
        },
        loadInitTemplates: function () {
            var self = this,
            deferred = new $.Deferred();
            $.when(
                self.loadTemplate("error", bizagi.getTemplate("bizagi.editor.component.editor").concat("#validator-editor")),
                self.loadTemplate("multiple-error", bizagi.getTemplate("bizagi.editor.component.editor").concat("#validator-multiple-editor")),
                self.loadTemplate("multiple-error-item", bizagi.getTemplate("bizagi.editor.component.editor").concat("#validator-multiple-editor-item")),
                self.loadTemplate("modal", bizagi.getTemplate("bizagi.editor.component.editor").concat("#modal-editor")),
                self.loadTemplate("modal-actions", bizagi.getTemplate("bizagi.editor.component.editor").concat("#modal-actions-editor"))
            ).done(function () {
                deferred.resolve();
            });
            return deferred.promise();
        },
        getTemplate: function (name) {
            if (this.tmpl.hasOwnProperty(name)) {
                return this.tmpl[name];
            } else {
                return null;
            }
        },
        hideEditors: function () {
            var self = this;
            self.element.addClass('ui-control-select-editor-up');
            $('.bizagi_editor_component_properties').append('<div id="blockerProperties" class="blocker-properties ui-block-properties" style="display:none;"></div>');

            $('#blockerProperties').fadeIn();
            $('#blockerProperties').bind('click', function () {

                self.hideDialog();
                $(this).fadeOut(function () {
                    $(this).remove();
                });

            });
        },
        showEditors: function () {
            var self = this;
            self.element.removeClass('ui-control-select-editor-up');
            $('#blockerProperties').fadeOut(function () {
                $(this).remove();
            });
        },
        getParams: function () {
            var result = {}, editorParams = this.model["editor-parameters"], property;
            if (!$.isEmptyObject(editorParams)) {
                for (property in editorParams) {
                    if (editorParams.hasOwnProperty(property)) {
                        result[property] = editorParams[property];
                    }
                }
            }
            return result;
        },
        createDialog: function (content, actions) {
            var self = this, elPopUp, elPopUpActions, elStyleDialog;

            self.idDialogEditor = self.options.name + "_DialogModal_" + Math.floor(Math.random() * 10000000);

            elStyleDialog = self.options.name;

            self.elPopUp = elPopUp = $.tmpl(self.getTemplate("modal"), { caption: self.options.caption, id: self.idDialogEditor, style: elStyleDialog });
            elPopUpActions = $.tmpl(self.getTemplate("modal-actions"));

            elPopUp.addClass('ui-modal-as-dialog');

            elPopUp.append(elPopUpActions);
            self.element.addClass('editor_with_modal');

            elPopUp.find('.content-modal').append(content);
            elPopUp.find('.modal-editor-buttons').append(actions);
            elPopUp.hide();

            $('.ui-close-btn', elPopUp).click(function () {
                self.hideDialog();
            });

            return elPopUp;
        },
        showDialog: function (el) {
            var self = this, elPopUp, elContainer, deferred = $.Deferred(); ;

            elContainer = $('#bizagi_editor_component_properties');

            if ($("#" + self.idDialogEditor, elContainer).length <= 0) {
                elContainer.append(self.elPopUp);
            }

            elPopUp = $("#" + self.idDialogEditor, elContainer);
            self.dialogReference = elPopUp;

            self.dialogPosition = { clientY: event.clientY, offsetY: event.offsetY, top: el.position().top };

            self.hideEditors();

            $.when(
                self.updateDialogPosition('init')
            ).done(
                function () {
                    elPopUp.show("slide", { direction: "left" }, function () {
                        $(this).removeClass("ui-modal-close").addClass("ui-modal-open");
                        deferred.resolve();
                    });
                }
            );

            return deferred.promise();

        },
        updateDialogPosition: function (animated) {
            var self = this, pTop, elPopUp, mWidth, elContainer, screenHeight, marginRange, clientPos, newpTop, allTop, coord, animateCoord;


            elContainer = self.element.parent().parent();
            elPopUp = $("#" + self.idDialogEditor, elContainer);

            // TODO-REMOVEBODY: Check this out!
            screenHeight = $('body').height();
            marginRange = 20;

            clientPos = (self.dialogPosition.clientY + self.dialogPosition.offsetY);

            pTop = (clientPos - (elPopUp.height() / 2)) - elContainer.position().top; //el.position().top - (elPopUp.height()/2);
            mWidth = (parseFloat(self.element.parent().width()) * 2) + 'px';
            allTop = pTop + elPopUp.height() + elContainer.position().top;

            if (allTop > screenHeight) {
                newpTop = (pTop - (allTop - screenHeight)) - marginRange;
                elPopUp.find("[class*='ui-modal-arrow-']").css('top', '83%');
            } else {
                elPopUp.find("[class*='ui-modal-arrow-']").css('top', '43%');
                newpTop = pTop - marginRange;
            }

            if (animated !== 'init') {
                coord = { minWidth: mWidth };
                elPopUp.css(coord);
                animateCoord = { top: newpTop };

                if (!animated) {
                    elPopUp.css(animateCoord);
                } else {
                    elPopUp.animate(coord);
                }

            } else {
                coord = { top: newpTop, left: "100%", minWidth: mWidth };
                elPopUp.css(coord);
            }


        },
        hideDialog: function (callback) {
            var self = this, elPopUp, elContainer;
            elContainer = $('#bizagi_editor_component_properties');
            elPopUp = $("#" + self.idDialogEditor, elContainer);
            //elPopUp.addClass("editor-modal-close").removeClass("editor-modal-open");

            if (!elPopUp.hasClass("ui-modal-closing")) {
                elPopUp.addClass("ui-modal-closing");
                elPopUp.hide("slide", { direction: "left" }, 1000, function () {
                    $(this).addClass("ui-modal-close").removeClass("ui-modal-open").removeClass("ui-modal-closing");
                    self.showEditors();
                    if (callback) {
                        self.elPopUp.remove();
                        callback();
                    }
                });
            }
        },
        createValidateMessage: function (el, pos, message) {
            var self = this,
            elMessage,
            elMessageContainer,
            elMessageItem,
            idsMessages = [];

            if ($.isArray(message)) {

                elMessage = $.tmpl(self.getTemplate("multiple-error"), { typeMessage: 'error', style: 'bz-studio bz-warning-red_16x16_standard' });
                elMessageContainer = $('.editor-validator-message-error', elMessage);

                for (var i = 0; i < message.length; i++) {
                    elMessage.attr('id', 'bizagi_editor_validator_container-' + i);
                    elMessageItem = $.tmpl(self.getTemplate("multiple-error-item"), { typeMessage: 'error', message: message[i], style: 'bz-studio bz-warning-red_16x16_standard' });
                    elMessageContainer.append(elMessageItem);
                    idsMessages.push('bizagi_editor_validator_container-' + i);
                }
                el.data('error-msg', idsMessages);
                elMessage.addClass('ui-inline-error');
                elMessage.insertAfter(el);
                elMessage.fadeIn();

            } else {

                elMessage = $.tmpl(self.getTemplate("error"), { typeMessage: 'error', message: message, style: 'bz-studio bz-warning-red_16x16_standard' });
                elMessage.css({ left: pos.left, top: pos.top });

                var elMessageID = elMessage.attr('id') + '-' + self.options.name;
                elMessage.attr('id', elMessageID);

                el.data('error-msg', elMessage.attr('id'));
                $(el.parent()).append(elMessage);
                elMessage.fadeIn();
            }

        },
        showError: function (el, message) {
            var self = this,
            inputPosition,
            inputTop,
            inputLeft,
            inputNewPosition,
            elMessageID,
            elContext,
            elContainer;

            inputPosition = el.position();
            inputLeft = '0px';

            inputTop = (inputPosition.top + self.getRealHeight(el) + 2) + 'px';
            inputNewPosition = { left: inputLeft, top: inputTop };

            elMessageID = self.getValidateId(el);

            if (!elMessageID || typeof message === "object") {
                self.createValidateMessage(el, inputNewPosition, message);
            } else {
                elContext = $('#' + elMessageID);
                $('.editor-validator-message-error', elContext).html(message);
                elContext.css(inputNewPosition).fadeIn();
            }

        },
        hideError: function (el) {
            var self = this,
            elMessageId;

            elMessageId = self.getValidateId(self.element);

            $('#' + elMessageId).fadeOut(
                function () {
                    $(this).remove();
                }
            );
        },
        getValidateId: function (el) {
            var elMessage,
            elValidatorMessage,
            reference,
            returnId = false;

            reference = el.closest('.ui-editor');

            elValidatorMessage = $('.bizagi_editor_validator_container', reference);
            if (elValidatorMessage.length > 0) {
                returnId = elValidatorMessage.attr('id');
            }

            return returnId;
        },
        getRealHeight: function (el) {
            var valueHeight = 0,
                evProperties,
                elHeight;

            evProperties = ['padding-top', 'padding-bottom', 'margin-top', 'margin-bottom', 'border-top', 'border-bottom'];
            elHeight = $(el).height();
            // elOffsetTop = $(el).offset().top;

            for (var i = 0; i < evProperties.length; i++) {
                valueHeight += parseFloat($(el).css(evProperties[i]));
            };
            return valueHeight + elHeight;
        },

        highLightProperty: function (messages) {
            this.element.addClass("ui-editor-highlight");
            this.showError(this.element, messages);
        },


        // TODO: Extract these classes into single js files
        uiControls: {
            /*
            @author: Ramiro Gomez
            @date: 04-julio-12
            @Params : Object;
            {
            uiEditor:self, //Referencia al Editor
            uiContainer:$('.ui-control-editor',elEditor), //referencia al contenedor del uiControl
            uiValues:data.uiValues, //Valores del combo
            uiInline:self.inline, //true, false si se desea en linea con el label
            onChange:function(elValue, event){
            self.responseChangeCombo(elValue, event, self); //Funcion de respuesta / callback
            }
            }
            */
            comboBox: function (selector) {


                var self = this;
                /* Definicion de los valores por defecto */
                self.settings = {
                    uiPlaceHolderText: "",
                    uiValues: [
                        { label: 'true', value: 'true' },
                        { label: 'false', value: 'false' }
                        ],
                    uiInline: false,
                    onChange: function () { }
                };

                $.extend(self.settings, arguments[0]);

                self.editor = self.settings.uiEditor;

                self.update = function (args) {
                    var self = this;
                    self.methods.update(args);
                };

                self.getValue = function () {
                    var self = this;
                    return self.value;
                };

                self.getLabel = function () {
                    var self = this;
                    return self.label;
                };
                /* Definicion de los metodos para crear el uiControl para editores */
                self.methods = {
                    instance: this,
                    init: function () {
                        var self = this;

                        self.container = self.settings.uiContainer;

                        $.when(
                            self.methods.loadTemplates.apply(self)
                        ).done(function () {
                            self.methods.renderControl.apply(self);
                        });


                    },
                    loadTemplates: function () {
                        var self = this;

                        var deferred = new $.Deferred();
                        $.when(
                            self.editor.loadTemplate("comboSelector", bizagi.getTemplate("bizagi.editor.component.editor").concat("#comboBox-selector")),
                            self.editor.loadTemplate("comboValues", bizagi.getTemplate("bizagi.editor.component.editor").concat("#comboBox-values")),
                            self.editor.loadTemplate("comboOptions", bizagi.getTemplate("bizagi.editor.component.editor").concat("#comboBox-options"))
                        ).done(function () {
                            deferred.resolve();
                        });
                        return deferred.promise();
                    },
                    renderControl: function () {
                        try {
                            var self = this, elSettings, elContainer, elContainerCombo;

                            elSettings = self.settings;

                            elContainer = self.container;
                            elContainerCombo = (elContainer.hasClass('ui-control-editor')) ? elContainer : $('.ui-control-editor', elContainer);

                            /* se valida el valor para booleanos, string, null */

                            if (elSettings.hasOwnProperty('uiInitValue')) {
                                self.value = self.editor.uiControls.utils.validateValue(self.settings.uiInitValue);
                            } else {
                                self.value = self.editor.uiControls.utils.validateValue(self.editor.options.value);
                            }
                            /* Se validan las opciones del editor y se selecciona el correspondiente */
                            if (elSettings.uiPlaceHolderText.length > 0) {
                                var initOption = { label: elSettings.uiPlaceHolderText, value: "select" };
                                elSettings.uiValues.unshift(initOption);
                            }

                            self.options = self.editor.uiControls.utils.selectValueOption(self.value, elSettings.uiValues);

                            self.methods.asignValues.apply(self, [{ uiContainer: elContainerCombo}]);
                        } catch (e) {
                            bizagi.log(e.message, e, 'error');
                        }


                    },
                    asignValues: function (ui) {
                        var self = this, elSelector, elValues, elOptions, uiWidthIconVal, elValue, elUIComboBox, elOptionsProperty;

                        elUIComboBox = $('<div class="ui-bizagi-editor-uiControls-comboBox ui-control-input" tabindex="0"/>');
                        elValues = $.tmpl(self.editor.getTemplate("comboValues"), {});

                        for (var prop in self.options) {

                            elValue = self.options[prop]['value'];
                            elOptionsProperty = self.options[prop];



                            if (elOptionsProperty.hasOwnProperty('value')) {

                                if (!elOptionsProperty.hasOwnProperty('icon')) {
                                    elOptionsProperty.icon = elOptionsProperty.value;
                                }

                                elOptions = $.tmpl(self.editor.getTemplate("comboOptions"), elOptionsProperty);
                                $('[class*="-check"]', elOptions).toggleClass('ui-comboBox-image-small-check ui-comboBox-image-small-uncheck');

                                $('[class*="-check"]', elOptions).addClass('bz-black');
                                $('[class*="-check"]', elOptions).toggleClass('bz-point_16x16_standard bz-point_16x16_black');

                                $('.ui-comboBox-value', elOptions).data('value', elValue);

                                if (typeof elValue === 'string') {
                                    $('.ui-comboBox-value', elOptions).attr('data-value', elValue);
                                }

                                elOptions.bind('click', function () {
                                    self.methods.changeDropDown.apply(self, [{ ui: this, e: event}]);
                                });


                                if (elOptionsProperty.hasOwnProperty('tmpl')) {
                                    $('.ui-comboBox-value', elOptions).append(elOptionsProperty['tmpl']);
                                }

                                elValues.append(elOptions);

                                if (elOptionsProperty.hasOwnProperty('selected')) {
                                    $('[class*="-uncheck"]', elOptions).toggleClass('ui-comboBox-image-small-uncheck ui-comboBox-image-small-check');

                                    $('[class*="-uncheck"]', elOptions).removeClass('bz-black');
                                    $('[class*="-uncheck"]', elOptions).toggleClass('bz-point_16x16_black bz-point_16x16_standard');

                                    elSelector = $.tmpl(self.editor.getTemplate("comboSelector"), elOptionsProperty);
                                    $('.ui-comboBox-value', elSelector).data('value', elOptionsProperty['value']);
                                    $('.ui-comboBox-value', elSelector).data('label', elOptionsProperty['label']);

                                    self.value = elOptionsProperty['value'];
                                    self.label = elOptionsProperty['label'];
                                    if (elOptionsProperty.hasOwnProperty('tmpl')) {
                                        elSelector.append(elOptionsProperty['tmpl']);
                                    }
                                }


                            }
                        }

                        if (elSelector === undefined) {
                            elOptions = $('.ui-bizagi-editor-comboBox-option', elValues).eq(0);
                            $('[class*="-uncheck"]', elOptions).toggleClass('ui-comboBox-image-small-uncheck ui-comboBox-image-small-check');

                            $('[class*="-uncheck"]', elOptions).removeClass('bz-black');
                            $('[class*="-uncheck"]', elOptions).toggleClass('bz-point_16x16_black bz-point_16x16_standard');

                            elSelector = $.tmpl(self.editor.getTemplate("comboSelector"), self.options[0]);
                            $('.ui-comboBox-value', elSelector).data('value', self.options[0]['value']);
                            $('.ui-comboBox-value', elSelector).data('label', self.options[0]['label']);
                            self.value = self.options[0]['value'];
                            self.label = self.options[0]['label'];
                            if (self.options[0].hasOwnProperty('tmpl')) {
                                $('.ui-comboBox-selector-text', elSelector).append(self.options[0]['tmpl']);
                            }
                        }

                        if (self.settings.uiInitLabel) {
                            $('.ui-comboBox-value', elSelector).text(self.settings.uiInitLabel);
                        }

                        elSelector.bind('click', function () {
                            self.methods.changeDropDown.apply(self, [{ ui: this, e: event}]);
                        });

                        elValues.addClass('ui-comboBox-close');
                        elUIComboBox.append(elValues);
                        elUIComboBox.prepend(elSelector);
                        ui.uiContainer.append(elUIComboBox);

                        if (self.settings.hasOwnProperty('uiWidthIcon')) {
                            uiWidthIconVal = self.settings.uiWidthIcon;

                            $('[class*="ui-comboBox-image-large-"]', ui.uiContainer).toggleClass('biz-ico biz-ico-' + uiWidthIconVal);

                        }



                    },
                    update: function (newModel) {
                        var self = this.instance, elSettings = self.settings;

                        self.settings.uiValues = [];
                        self.settings.uiValues = newModel;

                        self.options = newModel;

                        this.changeDataCombo.apply(self, [elSettings]);
                    },
                    changeDataCombo: function (model) {
                        var self = this, elSettings, elContainerCombo;
                        /* se valida el valor para booleanos, string, null */
                        elSettings = self.settings;

                        if (elSettings.uiPlaceHolderText.length > 0) {
                            var initOption = { label: elSettings.uiPlaceHolderText, value: "select" };
                            model.uiValues.unshift(initOption);
                        }

                        $.extend(elSettings, model);

                        if (elSettings.hasOwnProperty('uiInitValue')) {
                            self.value = self.editor.uiControls.utils.validateValue(self.settings.uiInitValue);
                        } else {
                            self.value = self.editor.uiControls.utils.validateValue(self.editor.options.value);
                        }
                        /* Se validan las opciones del editor y se selecciona el correspondiente */
                        self.options = self.editor.uiControls.utils.selectValueOption(self.value, elSettings.uiValues);

                        elContainerCombo = (self.container.hasClass('ui-control-editor')) ? self.container : $('.ui-control-editor', self.container);
                        elContainerCombo.empty();
                        self.methods.asignValues.apply(self, [{ uiContainer: elContainerCombo}]);
                    },
                    changeDropDown: function (el) {
                        var settings = {}

                        $.extend(settings, el);

                        var self = $(settings.ui), elPadre, elDropDown, elSelector;

                        if (self.hasClass('ui-bizagi-editor-comboBox-option')) {
                            elPadre = self.parent().parent();
                        } else {
                            elPadre = self.parent();
                        }

                        elSelector = $('.ui-bizagi-editor-comboBox-selector', elPadre);
                        elDropDown = $('.ui-bizagi-editor-comboBox-dropDown', elPadre);

                        settings.uiSelector = elSelector;
                        settings.uiDropDown = elDropDown;

                        if (elDropDown.hasClass('ui-comboBox-close')) {
                            elDropDown.slideDown(function () {
                                $(this).addClass('ui-comboBox-open').removeClass('ui-comboBox-close');
                                $('.ui-comboBox-arrow-close', elSelector).addClass('ui-comboBox-arrow-open').removeClass('ui-comboBox-arrow-close');

                                $(document).bind('mouseup', function () {
                                    if (elDropDown.has(el.ui).length === 0) {
                                        elDropDown.slideUp(function () {
                                            $(this).addClass('ui-comboBox-close').removeClass('ui-comboBox-open');
                                            $('.ui-comboBox-arrow-open', elSelector).addClass('ui-comboBox-arrow-close').removeClass('ui-comboBox-arrow-open');
                                        });
                                    }
                                });

                            });
                        } else {
                            elDropDown.slideUp(function () {
                                $(this).addClass('ui-comboBox-close').removeClass('ui-comboBox-open');
                                $('.ui-comboBox-arrow-open', elSelector).addClass('ui-comboBox-arrow-close').removeClass('ui-comboBox-arrow-open');
                            });
                        }

                        if (!self.hasClass('ui-bizagi-editor-comboBox-selector')) {
                            this.methods.setValue.apply(this, [settings]);
                        }
                    },
                    setValue: function (el) {
                        var self = $(el.ui), elValue, elIcon, elValueText, elNewValueObj, elNewIconObj, elOptionSelected;

                        elIcon = $('[class*="ui-comboBox-image-large-"]', self);
                        elValue = $('.ui-comboBox-value', self).data('value');
                        elValueText = $('.ui-comboBox-value', self).text();

                        elNewValueObj = $('.ui-comboBox-value', el.uiSelector);
                        elNewIconObj = $('[class*="ui-comboBox-image-large-"]', el.uiSelector);

                        $('[class*="-check"]', el.uiDropDown).toggleClass('ui-comboBox-image-small-check ui-comboBox-image-small-uncheck');

                        $('[class*="-uncheck"]', el.uiDropDown).addClass('bz-black');

                        elOptionSelected = $('[data-value="' + elValue + '"]', el.uiDropDown);
                        $('[class*="-uncheck"]', elOptionSelected.parent()).toggleClass('ui-comboBox-image-small-uncheck ui-comboBox-image-small-check');

                        $('[class*="-check"]', elOptionSelected.parent()).removeClass('bz-black');

                        elNewValueObj.data('value', elValue);
                        elNewValueObj.data('label', elValueText);

                        elNewValueObj.text(elValueText);


                        elNewIconObj.attr('class', elIcon.attr('class'));

                        this.value = elValue;
                        this.label = elValueText;
                        this.settings.onChange(elValue, event);
                    }
                };

                if (self.methods[selector]) {
                    return self.methods[selector].apply(self, Array.prototype.slice.call(arguments, 1));
                } else if (typeof selector === 'object' || !selector || typeof selector === 'string') {
                    return self.methods.init.apply(self, arguments);
                } else {
                    $.error('Method ' + method + ' does not exist on bizagi.editor.component.editor.uiControls.comboBox');
                }
            },
            /*
            @author: Ramiro Gomez
            @date: 04-julio-12
            @Params : Object;
            {
            uiEditor:self, //Referencia al Editor
            uiContainer:$('.ui-control-editor',elEditor), //referencia al contenedor del uiControl
            uiValues:data.uiValues, //Valores del combo
            uiInline:self.inline, //true, false si se desea en linea con el label
            onChange:function(elValue, event){
            self.responseChangeCombo(elValue, event, self); //Funcion de respuesta / callback
            }
            }

            */
            booleanSwitch: function (selector) {

                var self = this;
                /* Definicion de los valores por defecto */
                self.settings = {
                    uiValues: [
                        { label: 'true', value: 'true' },
                        { label: 'false', value: 'false' }
                        ],
                    uiInline: false,
                    onChange: function () { }
                };

                $.extend(self.settings, arguments[0]);

                self.editor = self.settings.uiEditor;

                self.update = function (args) {
                    self.methods.update(args);
                };

                self.getValue = function () {
                    var self = this;
                    return self.value;
                };

                self.methods = {
                    instance: this,
                    init: function () {
                        var self = this;

                        $.when(
                            self.methods.loadTemplates.apply(self)
                        ).done(function () {
                            return self.methods.renderControl.apply(self);
                        });


                    },
                    loadTemplates: function () {
                        var self = this;

                        var deferred = new $.Deferred();
                        $.when(
                            self.editor.loadTemplate("booleanSwitchSelector", bizagi.getTemplate("bizagi.editor.component.editor").concat("#booleanSwitch-selector")),
                            self.editor.loadTemplate("booleanSwitchValues", bizagi.getTemplate("bizagi.editor.component.editor").concat("#booleanSwitch-values")),
                            self.editor.loadTemplate("booleanSwitchOptions", bizagi.getTemplate("bizagi.editor.component.editor").concat("#booleanSwitch-options"))
                        ).done(function () {
                            deferred.resolve();
                        });
                        return deferred.promise();
                    },
                    renderControl: function () {

                        var self = this, elSettings, elSelector, elValues, elOptions, elContainer, elContainerSwitch, elUIBooleanSwitch, elValuesContent;

                        elSettings = self.settings;
                        elContainer = self.container = self.settings.uiContainer;
                        elSelector = $.tmpl(self.editor.getTemplate("booleanSwitchSelector"), {});
                        elContainerSwitch = (elContainer.hasClass('ui-control-editor') && ($('.ui-bizagi-editor-uiControls-booleanSwitch', elContainer).length > 0)) ? $('.ui-bizagi-editor-uiControls-booleanSwitch', elContainer) : elContainer;
                        elUIBooleanSwitch = $('<div class="ui-bizagi-editor-uiControls-booleanSwitch ui-control-input biz-btn-horizontal" tabindex="0"/>');

                        elValues = $.tmpl(self.editor.getTemplate("booleanSwitchValues"), {});
                        elValuesContent = $('.ui-bizagi-editor-booleanSwitch-content', elValues);

                        /* se valida el valor para booleanos, string, null */
                        if (elSettings.hasOwnProperty('uiInitValue')) {
                            self.value = self.editor.uiControls.utils.validateValue(self.settings.uiInitValue);
                        } else {
                            self.value = self.editor.uiControls.utils.validateValue(self.editor.options.value);
                        }

                        /* Se validan las opciones del editor y se selecciona el correspondiente */
                        self.options = self.editor.uiControls.utils.selectValueOption(self.value, elSettings.uiValues);


                        for (var prop in self.options) {

                            if (self.options[prop].hasOwnProperty('value')) {

                                elOptions = $.tmpl(self.editor.getTemplate("booleanSwitchOptions"), self.options[prop]);
                                if (self.options[prop].hasOwnProperty('selected')) {
                                    elOptions.addClass('ui-booleanSwitch-selected');
                                } else {
                                    elOptions.addClass('ui-booleanSwitch-unselected');
                                }
                                elValuesContent.append(elOptions);
                            }
                        }

                        elUIBooleanSwitch.append(elValues);
                        elUIBooleanSwitch.append(elSelector);
                        elContainerSwitch.append(elUIBooleanSwitch);

                        elSettings.uiContainer = $('.ui-bizagi-editor-booleanSwitch-content', elContainerSwitch);
                        elSettings.uiSelector = $('.ui-bizagi-editor-booleanSwitch-selector', elContainerSwitch);

                        elContainerSwitch.bind('click', function () {
                            var elSettings = self.settings;
                            $.extend(elSettings, { ui: this, e: event });
                            self.methods.changeSwitch.apply(self, [elSettings]);
                        });

                        if (self.editor.inline) {
                            elContainerSwitch.addClass('ui-control-editor-inline');
                        }


                        $.extend(elSettings, { ui: null, e: null });
                        self.methods.changeSwitch.apply(self, [elSettings]);

                        return self;


                    },
                    update: function (newVal) {
                        var self = this.instance, elSettings = self.settings;

                        self.value = newVal;
                        $.extend(elSettings, { ui: null, e: null });
                        this.changeSwitch.apply(self, [elSettings]);
                    },
                    changeSwitch: function (el) {

                        var elSettings = el, self = this, validate = false, widthContainer, widthSelector, widthTotal;

                        widthContainer = parseFloat($(elSettings.uiContainer).width());
                        widthSelector = parseFloat($(elSettings.uiSelector).width());

                        if (self.editor.inline) {
                            widthTotal = '38';
                        } else {
                            widthTotal = widthContainer - widthSelector;
                        }

                        if (el.ui != null) {
                            self.value = !self.value;
                        }

                        if (!self.value) {
                            elSettings.animation = {
                                selector: { left: '0px', timer: 300 },
                                container: { left: '-100%', timer: 300 }
                            }
                        } else {
                            elSettings.animation = {
                                selector: { left: (widthTotal - 1) + 'px', timer: 300 },
                                container: { left: '0%', timer: 300 }
                            }
                        }


                        if (el.ui != null) {
                            self.methods.animateChange.apply(self, [elSettings]);
                        } else {
                            elSettings.uiSelector.css({ left: elSettings.animation.selector.left });
                            elSettings.uiContainer.css({ left: elSettings.animation.container.left });
                        }

                    },
                    animateChange: function (el) {

                        var self = this;

                        $(el.uiSelector).stop().animate({ left: el.animation.selector.left }, el.animation.selector.timer);

                        $(el.uiContainer).stop().animate({ left: el.animation.container.left }, el.animation.selector.timer, function () {


                            var selectores = $('[class*="selected"]', el.uiContainer);
                            selectores.removeClass('ui-booleanSwitch-selected').removeClass('ui-booleanSwitch-unselected');
                            selectores.each(function () {
                                if ($(this).data('value') == self.value) {
                                    $(this).addClass('ui-booleanSwitch-selected');
                                } else {
                                    $(this).addClass('ui-booleanSwitch-unselected');
                                }
                            });

                            self.methods.setValue.apply(self, [el]);
                        });
                    },
                    setValue: function (el) {
                        var self = $(el.ui), elValue;
                        elValue = $('.ui-booleanSwitch-selected', el.ui).data('value');

                        this.value = elValue;

                        this.settings.onChange(elValue, el.e);
                    }
                };



                if (self.methods[selector]) {
                    return self.methods[selector].apply(self, Array.prototype.slice.call(arguments, 1));
                } else if (typeof selector === 'object' || !selector || typeof selector === 'string') {
                    return self.methods.init.apply(self, arguments);
                } else {
                    $.error('Method ' + method + ' does not exist on bizagi.editor.component.editor.uiControls.booleanSwitch');
                }

            },
            iconMenu: {},
            groupUIControls: {},
            /*
            @author: Ramiro Gomez
            @date: 04-julio-12
            Metodos compartidos por los UIControls para serializar y seleccionar los valores strig y booleanos
            */
            utils: {
                validateValue: function (value) {
                    var elValue = value;

                    switch (value) {
                        case "true":
                        case true:
                            elValue = true;
                            break;

                        case "false":
                        case false:
                        case null:
                            elValue = false;
                            break;

                        default:
                            elValue = value;
                            break;
                    }

                    return elValue;
                },
                selectValueOption: function (value, options) {

                    var self = this;

                    for (var i = 0; i < options.length; i++) {

                        var selfValue = self.validateValue(options[i].value);
                        if (value === selfValue && (value != undefined || value != null)) {
                            options[i].selected = true;
                        }
                    }

                    return options;
                },
                hasHScrollBar: function (obj) {
                    return obj.get(0).scrollWidth > obj.width();
                }
            }
        }
    }
);