/**
Plugin to create WorkPortal Combos...

    var options = {
        data: {},
        css:'customCSS'
    };

    $('selector').uicombo(options);

    $(document).on("comboChange", function(obj){
        console.log(obj.message, obj.ui, obj.ui.val());
    });

@class $.fn.uicombo 
@constructor uicombo
**/
(function ($) {
    "use strict";
    $.fn.uicombo = function (options, params) {

        var plg = this;

        plg.config = {
            namespace: $.bizagi.ui.controls.uicombo.namespace,
            cssComponent: $.bizagi.ui.controls.uicombo.css,
            internalData: {}
        };

        plg.settings = {
            /**
            DataSource to create a uiRadio Control

            var data = [
            {   
            value:value,
            text:'combo'
            }
            ];

            @property data 
            @type Object
            @default "{}"
            **/
            data: {},
            ascombo: true,

            /**
            to disabled combo

            @property disabled 
            @type bool
            @default false
            */
            disabled: false,

            /**
            Make the combo searchable

            @property isSearchable 
            @type Boolean
            @default "false"
            **/
            isSearchable: false,
            /**
            Make the combo editable

            @property isEditable 
            @type Boolean
            @default "false"
            **/
            isEditable: false,
            nameTemplate: $.bizagi.ui.controls.uicombo.tmpl,
            nameSubTemplate: $.bizagi.ui.controls.uicombo.tmpl2,
            /**
            Function to set a initial value
                
            {value:1}

            @property initValue 
            @type Object
            @default "null"
            **/
            initValue: null,
            /**
            Function to modify values

            @property itemValue 
            @type Function
            @param {Object} Object with value
            @default "null"
            **/
            itemValue: null,
            /**
            Function to modify output text

            @property itemText 
            @type Function
            @param {Object} Object with text
            @default "null"
            **/
            itemText: null,
            css: '',
            orientation: 'biz-o-left',
            getTemplate: function (name) {
                return bizagi.getTemplate(name);
            },

            /**
            Function to initialize templates
            @type Function
            @return object
            **/
            initializeTemplates: function () {

                var self = this;
                var deferred = $.Deferred();
                var tmpl1 = self.nameTemplate;
                var tmpl2 = self.nameSubTemplate;

                return {
                    "combo": (bizagi.getTemplate(tmpl1)),
                    "list": (bizagi.getTemplate(tmpl2))
                };
            },

            /**
            Function exceute when combo is ready

            @property onComplete 
            @type Function
            @default "function(){}"
            **/
            onComplete: function () { },
            /**
            Function exceute when combo change

            @property onChange 
            @type Function
            @default "function(){}"
            **/
            onChange: function () { }
        };

        plg.methods = {
            init: function (op) {

                var self = $(this),
                    template = op.getTemplate(op.nameTemplate),
                    subTemplate = op.getTemplate(op.nameSubTemplate),
                    nData;

                //Util functions to detect ie browsers accurately                
                var isIE = function () {
                    return (navigator.appName.indexOf("Internet Explorer") > 0);
                };

                var isIE11 = function () {
                    return !!navigator.userAgent.match(/Trident\/7.0/) && !navigator.userAgent.match(/MSIE/i);
                };

                op.IE = isIE() ? true : (isIE11() ? true : undefined);

                self.attr('role', op.namespace);
                self.addClass(op.cssComponent);
                self.addClass(op.css);

                self.loader = new bizagi.ui.controls.tmplloader();

                $.when(self.loader.loadTemplates(op.initializeTemplates())).done(function () {

                    var a = self.loader.getTemplate("combo");
                    var b = self.loader.getTemplate("list");

                    plg.config.internalData = nData = op.data;

                    nData.isEditable = op.isEditable;
                    nData.disabled = op.disabled;

                    plg.config.subTemplateHTML = b;

                    var tmp = $.tmpl(a, op.data, {
                        itemValue: (op.itemValue) ? op.itemValue : plg.methods.itemValue,
                        itemText: (op.itemText) ? op.itemText : plg.methods.itemText
                    });

                    self.append(tmp);

                    plg.config.inputCombo = $('.biz-wp-combo-input', self);

                    tmp.find('.biz-wp-combo-option').each(function (index, value) {
                        if (op.data.combo[index].data) {
                            $.extend($(value).data(), op.data.combo[index].data);
                        }
                    });

                    plg.settings.onComplete.apply(self, []);

                    self.methods = plg.methods;
                    self.config = plg.config;
                    self.settings = plg.settings;

                    self.methods.configureHandlers.apply(self, []);


                    /**
                    Fired when a combo is created

                    @event comboCompleted 
                    @param {String} type comboCompleted
                    @param {String} message
                    @param {Date} time
                    @param {Object} Jquery Object HTML 
                    **/
                    $.event.trigger({
                        type: "comboCompleted",
                        message: "combo is Completed",
                        time: new Date(),
                        ui: self
                    });

                    if (plg.settings.initValue) {
                        var value = '',
                                text = '';

                        if (plg.settings.itemText) {
                            text = plg.settings.itemText(plg.settings.initValue);
                        } else {
                            text = plg.settings.initValue.text;
                        }

                        if (plg.settings.itemValue) {
                            value = plg.settings.itemValue(plg.settings.initValue);
                        } else {
                            value = plg.settings.initValue.value;
                        }

                        if (text === "") {
                            self.config.inputCombo.val('');
                        } else {
                            self.config.inputCombo.val(text);
                        }

                        plg.config.inputCombo.data('value', value);

                    }


                    /*     }).fail(function () {
                    $.error('No se pudo cargar el template para generar las tablas');
                    });*/
                });
            },

            getControl: function () {
                var self = this,
                    $control = $('.biz-wp-combo', self);

                return $control;
            },
            getData: function () {
                return plg.config.internalData;
            },
            findDataByValue: function (val) {
                var self = this,
                    result = -1,
                    i = 0;

                if (val !== undefined && val !== null) {
                    var compareValIn = (typeof val === 'object') ? val.join(" - ") : (typeof val === 'boolean') ? val.toString() : val,
                        compareVal = $.trim(compareValIn).substring(0, compareValIn.length).toLowerCase(),
                        selfData = self.getData();
                }

                return result;
            },
            /*
            *   Template method to implement in each device to customize the render's behaviour to add handlers
            */
            configureHandlers: function () {
                var self = this,
                    control = self.methods.getControl.apply(self, []);

                self.config.inputCombo.focus(function () {
                    //$(this).trigger('click');
                });

                self.config.inputCombo.blur(function () {
                    if (self.settings.isSearchable) {
                        self.methods.validateValueInDatasource();
                    }
                });

                self.config.inputCombo.click(function () {
                    var idDropdown = "dd-" + self.config.inputCombo.attr("id");
                    if ($("#" + idDropdown, control).length === 0) {
                        self.methods.comboDropDown.apply(self, []);
                    } else {
                        // Close combo if clicked twice 
                        self.methods.dropDownDestroy.apply(self, [$(idDropdown)]);
                    }
                    self.config.inputCombo.select();
                });
                // Bind clicks to fake UI in order to simulate select clicks
                $(".biz-wp-combo-btn", control).bind("click.combo", function () {
                    self.config.inputCombo.trigger("click").focus();
                });

                self.config.inputCombo.keyup(function (e) {
                    self.methods.keyUpFunction.apply(self, [e]);
                });

                self.config.inputCombo.keydown(function (e) {
                    self.methods.keyDownFunction.apply(self, [e]);
                });
            },
            /*
            *   Makes the combo drops down, also fetch the data first if the combo is set to load on demand
            */
            comboDropDown: function () {
                var self = this;

                $.when(self.methods.getData()).done(function (data) {
                    self.methods.internalComboDropDown.apply(self, [data]);
                });

            },
            /*
            *   Draws the mini-popup
            */
            internalComboDropDown: function (data) {
                $(".ui-select-dropdown.open").detach();
                var self = this, selectTmp, objSelected = {};
                /** temp templates **/
                var containerDropdown = $("<div class='ui-select-dropdown open'></div>");
                /* control reference */
                var containerControl = self.config.inputCombo.closest('.biz-wp-combo-data-container');
                var containerRender = containerControl.closest('.biz-wp-combo');
                var idDropdown = "dd-" + self.config.inputCombo.attr("id");
                var selectedValue = self.methods.findDataByValue(self.config.inputCombo.val());
                var scrollPosition = 0;

                data = data || self.properties.data;

                self.repositionInterval;

                var height = containerRender.css("height"),
                    selfControl = self.methods.getControl.apply(self, []);

                containerRender.addClass("ac-is-visible");

                containerRender.css("height", height);
                containerControl.addClass("ac-is-visible ac-clear-floats");

                containerDropdown.attr("id", idDropdown);

                selectTmp = $.tmpl(plg.config.subTemplateHTML, data, {
                    itemValue: (self.settings.itemValue) ? self.settings.itemValue : self.methods.itemValue,
                    itemText: (self.settings.itemText) ? self.settings.itemText : self.methods.itemText
                });
                var dropDown = containerDropdown.append(selectTmp);
                containerControl.append(dropDown);


                dropDown.position({
                    my: "left top",
                    at: "left bottom",
                    of: $(".biz-wp-combo-input", selfControl),
                    collision: "none"
                }).hide();

                dropDown.fadeIn();

                dropDown.width(selfControl.width());

                self.methods.recalculateComboOffset(dropDown, selfControl);

                dropDown.data('formWidth', containerControl.width());
                dropDown.data('parentCombo', selfControl);

                dropDown.addClass(self.settings.orientation);

                if (selectedValue !== -1) {
                    objSelected = $("li[data-value='" + selectedValue.id + "']", dropDown);
                    objSelected.addClass('ui-selected');
                    objSelected.addClass("active");
                    scrollPosition = parseInt(objSelected.position().top);
                    dropDown.scrollTop(scrollPosition);
                }

                dropDown.on("mouseup", "li", function (event) {

                    event.stopPropagation();

                    var dataValue = $(this).data('value').toString();

                    var value = (dataValue) ? $(this).data('value') : '';
                    var val = { value: value, text: $(this).text() };
                    self.methods.onComboItemSelected.apply(self, [val]);
                    self.config.inputCombo.focus();

                    // Animation effect
                    dropDown.fadeOut('slow', function () {
                        self.methods.dropDownDestroy.apply(self, [dropDown]);
                    });
                    $(document).unbind("click.closecombo");
                });

                // Stop bubbling outside the dropdown
                $.makeArray(dropDown, self.methods.getControl.apply(self, [])).bind('click', function (e) {
                    e.preventDefault();
                    return false;
                });

                /*fix for IE*/
                dropDown.bind('mousedown.closecombo', function () {
                    dropDown.attr('md', true);
                });

                // Handle dialog resizes
                // TODO: Change document handlers to "closest" ui-dialog -> ui-resizable-handle  handlers
                $(document).bind("mousedown.resizecombo", function (e) {
                    if ($(e.target).hasClass('ui-resizable-handle')) {
                        if (self.repositionInterval) {
                            clearInterval(self.repositionInterval);
                        }
                        self.repositionInterval = setInterval(function () {
                            self.methods.dropDownReposition.apply(self, [dropDown, containerControl]);
                        }, 10);
                    }
                });
                $(document).bind("mouseup.resizecombo", function (e) {
                    clearInterval(self.repositionInterval);
                    var tg = $(e.target);
                    if (!dropDown.attr('md')) { /* <-- fix for IE*/
                        if (!tg.hasClass('ui-select-dropdown')) {
                            self.methods.dropDownValidClose.apply(self, [tg, dropDown]);
                        }
                    } else {
                        dropDown.removeAttr('md');
                    }
                });

                $(document).on('mouseup.closecombo', function (e) {
                    var etarget;
                    if (self.settings.IE && e.currentTarget.activeElement) {
                        etarget = e.currentTarget.activeElement
                    } else {
                        etarget = e.target;
                    }

                    var tg = $(etarget);
                    if (!dropDown.attr('md')) {
                        if (!tg.hasClass('ui-select-dropdown')) {
                            self.methods.dropDownValidClose.apply(self, [tg, dropDown]);
                        }
                    } else {
                        dropDown.removeAttr('md');
                    }
                });

                $(window).bind('resize.resizecombo', function () {
                    if (self.repositionInterval) {
                        clearInterval(self.repositionInterval);
                    }

                    self.methods.dropDownReposition.apply(self, [dropDown, containerControl]);
                });

                $(document).one("click.closecombo", function (e) {
                    var tg = $(e.target);
                    if (!dropDown.attr('md')) {
                        self.methods.dropDownValidClose.apply(self, [tg, dropDown]);
                    } else {
                        dropDown.removeAttr('md');
                    }
                });

            },
            /*
            * validate when fire event form document and window
            */
            dropDownValidClose: function (target, dropDown) {
                var self = this;
                //   if (target.closest(".biz-wp-combo", self.element).length === 0) {
                dropDown.fadeOut('slow', function () {
                    self.methods.dropDownDestroy.apply(self, [dropDown]);
                });
                $(document).unbind("click.closecombo");
                //        }
            },
            /*
            * set a new dropdown position
            */
            dropDownReposition: function (dropDown, containerForm) {
                var self = this,
                    selfControl = self.methods.getControl.apply(self, []);
                if ((containerForm.width() != dropDown.data('formWidth'))) {

                    dropDown.width((selfControl.width() < 100) ? 100 : selfControl.width());

                    dropDown.position({
                        my: "left top",
                        at: "left bottom",
                        of: $(".biz-wp-combo-input", selfControl),
                        collision: "none"
                    });
                    dropDown.data('formWidth', containerForm.width());
                }
            },
            /*
            * destroy dropdown
            */
            dropDownDestroy: function (dropDown) {
                var self = this;
                var containerControl = self.config.inputCombo.closest('.ui-bizagi-control');
                var containerRender = containerControl.closest('.ui-bizagi-render');

                if (containerControl.hasClass("ac-is-visible")) {
                    containerControl.removeClass("ac-is-visible");
                }
                if (containerControl.hasClass("ac-clear-floats")) {
                    containerControl.removeClass("ac-clear-floats");
                }
                containerRender.css("height", "auto");
                if (containerRender.hasClass("ac-is-visible")) {
                    containerRender.removeClass("ac-is-visible");
                }

                dropDown.remove();
                $(document).unbind("mousedown.closecombo");
                $(document).unbind("mouseup.resizecombo");
                $(window).unbind('resize.resizecombo');
                $(window).unbind('mouseup.closecombo');
                (self.repositionInterval)
                clearInterval(self.repositionInterval);
            },
            validateValueInDatasource: function () {
                var self = this;
                var selected = plg.config.inputCombo.val();
                var valText = '';
                var selectedKey = self.findDataByValue(selected);


                if (!self.value) {
                    self.value = { id: '' };
                }

                if (selectedKey.id > 0) {
                    self.setValue({ id: selectedKey.id }, false);
                    self.setDisplayValue(selectedKey);
                } else if (selectedKey.id == "") {
                    if (self.value.id != selectedKey.id) {
                        self.setValue(selectedKey, false);
                    }
                    self.setDisplayValue(selectedKey);
                } else {
                    self.setDisplayValue(self.selectedValue);
                }
            },
            /*
            *   Keydown listener
            */
            keyDownFunction: function (e) {
                var self = this;
                var idDropdown = "dd-" + plg.config.inputCombo.attr("id");
                var dropDown = $("#" + idDropdown);
                var active = $("li.active", dropDown);

                e = e ? e : window.event;

                // Need to implement hiding select on "Escape" and "Enter".
                if (e.altKey || e.ctrlKey || e.metaKey) {
                    return 1;
                }


                if (dropDown.length === 0) {
                    self.methods.comboDropDown.apply(self, []);
                    dropDown = $("#" + idDropdown);
                }

                if (e.shiftKey && e.keyCode) {
                    dropDown.remove();
                    return 0;
                }

                if (27 == e.keyCode) {
                    self.methods.setDisplayValue.apply(self, [self.selectedValue]);
                    dropDown.remove();
                }

                if (9 == e.keyCode || 13 == e.keyCode) {
                    if (active.length > 0) {
                        self.config.inputCombo.val(active.text());
                    }
                    if (self.settings.isSearchable) {
                        self.methods.validateValueInDatasource();
                    } else {
                        self.methods.setValue.apply(self, [active.data('value')]);
                    }
                    dropDown.remove();
                    return 1;
                }

                if (e.keyCode == '38' || e.keyCode == '37') {
                    // up arrow
                    self.methods.selectPreviousElement.apply(self, [dropDown]);
                    return 0;
                }
                else if (e.keyCode == '40' || e.keyCode == '39') {
                    // down arrow
                    self.methods.selectNextElement.apply(self, [dropDown]);
                    return 0;
                }

                if (e.keyCode == 36) {
                    self.methods.selectFirstElement.apply(self, [dropDown]);
                    return 0;

                } else if (e.keyCode == 35) {
                    self.methods.selectLastElement.apply(self, [dropDown]);
                    return 0;

                }

                return 1;
            },
            /*
            *   KeyUp listener
            */
            keyUpFunction: function (e) {
                var self = this;
                var idDropdown = "dd-" + plg.config.inputCombo.attr("id");
                var dropDown = $("#" + idDropdown);

                e = e ? e : window.event;

                if (e.altKey || e.ctrlKey || e.metaKey || 50 == e.keyCode || 13 == e.keyCode || 9 == e.keyCode || 27 == e.keyCode || e.keyCode == '38' || e.keyCode == '40' || e.shiftKey && e.keyCode || e.keyCode == 36 || e.keyCode == 35 || e.keyCode == 33 || e.keyCode == 34) {
                    return 0;
                }

                if (dropDown.length === 0) {
                    self.methods.comboDropDown.apply(self, []);
                    dropDown = $("#" + idDropdown);
                }

                self.methods.selectItemByKeyUp.apply(self, []);

                return 1;
            },
            /*
            * Select letter by letter
            */
            selectItemByKeyUp: function () {
                var self = this, objSelected;

                var idDropdown = "dd-" + plg.config.inputCombo.attr("id");
                var dropDown = $("#" + idDropdown);


                $('.active', dropDown).removeClass('active');

                var selectedKey = (self.settings.isSearchable) ? self.methods.findDataByValue(plg.config.inputCombo.val()) : -1;

                if (selectedKey !== -1) {
                    objSelected = $("li[data-value='" + selectedKey.id + "']", dropDown);
                    objSelected.addClass("active");
                } else {
                    objSelected = $('li.ui-selected', dropDown);
                }

                if (dropDown.length > 0 && objSelected.length > 0) {
                    scrollPosition = parseInt(objSelected.position().top);
                    dropDown.scrollTop(scrollPosition);
                } else {
                    self.methods.setValue.apply(self, [self.selectedValue]);
                }
            },
            selectFirstElement: function (dropDown) {
                var self = this;
                var actual = $("li:first", dropDown);
                $('li', dropDown).removeClass("active");
                actual.addClass("active");
                scrollPosition = actual.position().top;
                dropDown.scrollTop(scrollPosition);

                plg.config.inputCombo.val($(actual).text());


            },
            selectLastElement: function (dropDown) {
                var self = this,
                    actual = $("li:last", dropDown);
                $('li', dropDown).removeClass("active");
                actual.addClass("active");
                scrollPosition = actual.position().top;
                dropDown.scrollTop(scrollPosition);

                plg.config.inputCombo.val($(actual).text());

            },
            /*
            * Handler key Up
            */
            selectPreviousElement: function (dropDown) {
                var self = this;
                var scrollPosition = 0;
                var actual = $("li.active", dropDown);

                if (actual.length === 0) {
                    actual = $("li:first", dropDown);
                }
                var previous = actual.prev();

                if (previous.length != 0) {
                    actual.removeClass("active");
                    $(previous).addClass("active");
                    scrollPosition = $(previous).position().top;

                    dropDown.scrollTop(scrollPosition);
                    plg.config.inputCombo.val($(previous).text());
                }

            },
            /*
            *Handler key Down
            */
            selectNextElement: function (dropDown) {
                var self = this;
                var scrollPosition = 0;
                var actual = $("li.active", dropDown);

                if (actual.length === 0) {
                    actual = $("li:first", dropDown);
                }
                var next = actual.next();

                if (next.length != 0) {
                    actual.removeClass("active");
                    $(next).addClass("active");
                    scrollPosition = $(next).position().top;

                    dropDown.scrollTop(scrollPosition);
                    plg.config.inputCombo.val($(next).text());
                }

            },
            /*
            *   Handler to react when a combo item is selected
            */
            onComboItemSelected: function (val) {
                var self = this;
                var valValue = val.value.toString();
                var selectedLabel = val.text || "";

                if (valValue === "") {
                    self.config.inputCombo.val(selectedLabel);
                } else {
                    self.config.inputCombo.val(selectedLabel);
                }

                self.methods.setValue.apply(self, [valValue]);
            },
            setValue: function (val) {
                var self = this;
                self.config.inputCombo.data('value', val);
                /**
                Fired when a combo change

                @event comboChange 
                @param {String} type comboChange
                @param {String} message 
                @param {Date} time 
                @param {Object} Jquery Object HTML 
                **/
                var control = self.config.inputCombo,
                        controlProperties = {
                            type: "comboChange",
                            message: "combo change",
                            time: new Date(),
                            ui: control
                        };

                plg.settings.onChange(controlProperties);

                $.event.trigger(controlProperties);
            },
            /*
            *   Sets the value in the rendered control
            */
            setDisplayValue: function (value) {
                var self = this;
                var comboValue = '';
                var comboValueValid = true;

                value = (plg.settings.itemValue) ? plg.settings.itemValue : plg.methods.itemValue;

                if (value !== null) {
                    plg.config.inputCombo.val(comboValue);
                } else if (value === null) {
                    plg.config.inputCombo.val(comboValue);
                }

            },
            /*
            *   Sets the value in the rendered control
            */
            clearDisplayValue: function () {
                var self = this;
                plg.config.inputCombo.val('');
                self.value = self.properties.value = self.selectedValue;
            },
            /*
            *   Returns the selected value in the template
            */
            getSelectedValue: function () {
                var self = this;
                return self.selectedValue;
            },
            recalculateComboOffset: function (dropDwn, objParent) {
                if (bizagi.util.isIE() && (bizagi.util.getInternetExplorerVersion() == 9)) {
                    if (dropDwn.width() !== objParent.width()) {
                        var offset = objParent.width() - dropDwn.width();
                        dropDwn.width(objParent.width() + offset);
                    }
                }
            },
            itemValue: function (obj) {
                var val = '';
                if (obj.itemValue) {
                    val = obj.itemValue(obj);
                } else {
                    if (typeof obj.value === 'string' || typeof obj.value === 'number') {
                        val = obj.value;
                    }
                }
                return val;
            },
            itemText: function (obj) {
                var val = '';
                if (obj.itemValue) {
                    val = obj.itemText(obj);
                } else {
                    if (typeof obj.text === 'string') {
                        val = obj.text;
                    }
                }
                return val;
            },
            /**
            * Destroy ComboBox
            *
            *   $('selector').uicombo('destroy');
            *
            * @method destroy
            * @return {Object} Jquery Empty Object
            */
            destroy: function (op) {
                var self = $(this);
                if (self.attr('role') === op.namespace) {
                    self.empty();
                } else {
                    $.error('No es posible eliminar un control con un namespace diferente: [role: ' + op.namespace + ']');
                }
            },
            /*
            *   Select the related item (syntax = {text:"item1", value:1})
            */
            selectItem: function (item) {
                var self = this;
                var control = $('.biz-wp-combo-input', self);                
                control.val(item.text);
                control.data('value', item.value);
            },
        };



        if (typeof options != 'object' && options) {

            $.extend(plg.settings, params, plg.config);
            return plg.methods[options].apply(this, [plg.settings]);

        } else if (typeof options === 'object' || !options || options === undefined) {

            $.extend(plg.settings, options, plg.config);
            return this.each(function () {
                plg.methods.init.apply(this, [plg.settings]);
            });

        } else {

            $.error('Method ' + options + ' does not exist on jQuery.combo');

        }

    };

    $.bizagi.ui.controls.uicombo.plugin = $.fn.uicombo;

} (jQuery));