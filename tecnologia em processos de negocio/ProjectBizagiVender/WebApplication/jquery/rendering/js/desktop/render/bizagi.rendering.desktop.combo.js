/*
*   Name: BizAgi Desktop Render Yes-No Extension
*   Author: Diego Parra
*   Comments:
*   -   This script will redefine the Yes-No render class to adjust to desktop devices
*/

bizagi.rendering.combo.extend("bizagi.rendering.combo", {}, {
    /*
    *   Update or init the element data
    */
    initializeData: function (data) {
        var self = this;
        // Call base
        this._super(data);

        // Fill default properties
        var properties = this.properties;

        // ON desktop implementation we will load the async combos on demand
        properties.loadOnDemand = true;
    },
    /*
    *   Template method to implement in each device to customize each render after processed
    */
    postRender: function () {
        var self = this;
        var inputCombo = self.inputCombo = $(".ui-selectmenu-value", self.getControl());
        self.selectedValue = self.properties.value;

        // Call base
        this._super();
    },

    /*
    *   Template method to implement in each device to customize the render's behaviour to add handlers
    */
    configureHandlers: function () {
        var self = this;
        var control = self.getControl();

        self.inputCombo.focus(function () {
            $(this).select();
        });

        self.inputCombo.click(function () {
            var idDropdown = "dd-" + self.inputCombo.attr("id");
            if ($("#" + idDropdown, self.getControl().parent()).length === 0) {
                self.comboDropDown();
            } else {
                // Close combo if clicked twice 
                self.dropDownDestroy($("#" + idDropdown));
            }
            self.inputCombo.focus();
        });

        // Bind clicks to fake UI in order to simulate select clicks
        if ($(".ui-selectmenu-btn", self.control).length > 1 && typeof (window.addEventListener) != "undefined")
            $(".ui-selectmenu-btn", self.control)[0].addEventListener("click", function () {
                self.inputCombo[0].click();
            });
        else
        $(".ui-selectmenu-btn", self.control).bind("click.combo", function () {
            self.inputCombo.trigger("click");
        });

        self.inputCombo.keyup(function (e) {
            self.keyUpFunction(e);
        });

        self.inputCombo.keydown(function (e) {
            self.keyDownFunction(e);
        });

        self.inputCombo.blur(function (e) {
            self.setDisplayValue(self.value);
        });

        // Call base
        self._super();
    },
    /*
    *   Makes the combo drops down, also fetch the data first if the combo is set to load on demand
    */
    comboDropDown: function () {
        var self = this;

        self.showLoadingData();

        $.when(self.getData()).done(function (data) {
            self.hideLoadingData();
            try {
                self.internalComboDropDown(data);

                if (typeof Windows != "undefined" && self.grid) {
                    $(self.grid.element).find(".bz-rn-grid-data-wraper").css("overflow", "hidden");
                }
            } catch (e) {
                bizagi.log(e.message);
            }
        });

    },
    /*
    *   Show loading message
    */
    showLoadingData: function () {
        var self = this;
        var body = $("body", document);
        var loading = self.loading = $("<div class='ui-select-dropdown open loading'><ul><li class='ui-bizagi-render-loading ui-bizagi-loading'></li></ul></div>");
        // Add width
        loading.css("width", self.inputCombo.outerWidth() + "px");
        $("li", loading).css({ padding: 0, margin: 0 });
        loading.css("overflow", "hidden");
        loading.appendTo(body);
        loading.position({
            my: "left top",
            at: "left bottom",
            of: self.inputCombo,
            collision: "none flip"
        });
    },
    /*
    *   Remove loading message
    */
    hideLoadingData: function () {
        var self = this;
        self.loading.remove();
    },
    /*
    *   Draws the mini-popup
    */
    internalComboDropDown: function (data) {
        $(".ui-select-dropdown.open").remove();
        var self = this, selectTmp = {}, objSelected = {};
        /** temp templates **/
        var tempCombo = "<ul>{{each datasource}}{{if typeof hidden == 'undefined'}}<li data-value='${id}'>${value}</li>{{/if}}{{/each}}</ul>";
        var containerDropdown = $("<div class='ui-select-dropdown open'></div>");
        /* control reference */
        var containerControl = self.inputCombo.closest('.ui-bizagi-control');
        var containerRender = containerControl.closest('.ui-bizagi-render');
        var idDropdown = "dd-" + self.inputCombo.attr("id");
        var selectedValue = self.findDataByValue(self.inputCombo.val());
        var scrollPosition = 0;
        var orientation = (self.properties.orientation === 'rtl') ? 'ui-bizagi-rtl' : '';

        //fix for QA-507 only IE
        if (navigator.userAgent.indexOf('MSIE') !== -1 || navigator.appVersion.indexOf('Trident/') > 0) {
            var contFormScroll = containerRender.closest(".ui-dialog-content");
            if (contFormScroll.length > 0) {
                contFormScroll.css('overflow-y', 'hidden');
            }
        }
        data = data || self.properties.data;

        self.properties.data = data;

        self.repositionInterval;
        var height = containerRender.css("height");
        containerRender.addClass("ac-is-visible");
        // fix for SUITE-9458
        containerRender.css("height", height);
        containerControl.addClass("ac-is-visible ac-clear-floats");

        containerDropdown.attr("id", idDropdown);

        for (var i = 0; i < data.length; i++) {
            if (data[i].value !== null && typeof (data[i].value) == "boolean") {
                if (bizagi.util.parseBoolean(data[i].value) == true) {
                    data[i].value = this.getResource("render-boolean-yes");

                } else if (bizagi.util.parseBoolean(data[i].value) == false) {
                    data[i].value = this.getResource("render-boolean-no");
                }
            }
        }

        if (data.length > 1000) {
            selectTmp = self.getResource("render-combo-too-many-elements");
        } else {
            selectTmp = $.tmpl(tempCombo, { datasource: data });
        }
        var dropDwn = containerDropdown.append(selectTmp);
        containerControl.append(dropDwn);
        var objParent = $(".ui-selectmenu", self.control);
        $(dropDwn).find("li:last-child").css("padding-bottom", "13px");

        dropDwn.width(objParent.width());

        dropDwn.position({
            my: "left top",
            at: "left bottom",
            of: $(".ui-selectmenu", self.control),
            collision: "fit"
        }).hide();

        //dropDwn.fadeIn();
        dropDwn.show();
        //fix for QA-507 only IE
        if (navigator.userAgent.indexOf('MSIE') !== -1 || navigator.appVersion.indexOf('Trident/') > 0) {
            if (contFormScroll.length > 0) {
                contFormScroll.css('overflow-y', 'auto');
            }
        }

        //SUITE 9379 - ComboBox offset in resizing when the combobox is opened
        self.recalculateComboOffset(dropDwn, objParent);

        dropDwn.data('formWidth', containerControl.width());
        dropDwn.data('parentCombo', self.control);

        dropDwn.addClass(orientation);

        if ((selectedValue !== -1) && ($("li", dropDwn).length > 0)) {

            //Checks if the selected element is empty string, it's normal for cascading combos
            if (selectedValue && selectedValue.id == '')
                objSelected = $("li[data-value='']", dropDwn);
            else
                objSelected = $("li[data-value='" + selectedValue.id + "']", dropDwn);

            if (objSelected.length != 0) {
                objSelected.addClass('ui-selected');
                objSelected.addClass("active");
                scrollPosition = parseInt(objSelected.position().top);
                dropDwn.scrollTop(scrollPosition);
            }
        }

        dropDwn.delegate("li", "click", function () {
            var valId = ($(this).data('value')) ? $(this).data('value') : '';
            var val = { id: valId, value: $(this).text() };

            //Prevents stores the value twice when the element seached match with the clicked
            //It helps to keep track the last selected
            var id = self.getValue();
            id = id && id.id ? id.id : 0;
            if (val.id !== id) {
                self.onComboItemSelected(val);
            } else {
                if (val.value !== self.inputCombo.val()) {
                    self.setDisplayValue({ value: val.value });
                }
            }

            //'select' will stand at first character of the string, 'focus' will stand at the last character of the string
            self.inputCombo.select();

            // Animation effect
            /*dropDwn.fadeOut('slow', function () {
            self.dropDownDestroy(dropDwn);
            });*/
            dropDwn.hide();
            self.dropDownDestroy(dropDwn);

            $(document).unbind("click.closecombo");
        });

        // Stop bubbling outside the dropdown
        $.makeArray(dropDwn, self.getControl()).bind('click', function (e) {
            e.preventDefault();
            return false;
        });

        /*fix for IE*/
        dropDwn.bind('mousedown.closecombo', function () {
            dropDwn.attr('md', true);
        });


        /* THE FOLLOWING HANDLERS ARE REMOVED TEMPORALLY BECAUSE THEY ARE GENERATING A MEMORY LEAK*/
        /*
        // Handle dialog resizes
        // TODO: Change document handlers to "closest" ui-dialog -> ui-resizable-handle  handlers
        $(document).bind("mousedown.resizecombo", function (e) {
        if ($(e.target).hasClass('ui-resizable-handle')) {
        if (self.repositionInterval) {
        clearInterval(self.repositionInterval);
        }
        self.repositionInterval = setInterval(function () {
        self.dropDownReposition(dropDwn, containerControl);
        }, 10);
        }
        });
        $(document).bind("mouseup.resizecombo", function (e) {
        clearInterval(self.repositionInterval);
        var tg = $(e.target);
        if (!dropDwn.attr('md')) { // <-- fix for IE
        if (!tg.hasClass('ui-select-dropdown') && !bizagi.util.isIE10() && !bizagi.util.isIE11()) {
        self.dropDownValidClose(tg, dropDwn);
        }
        } else {
        dropDwn.removeAttr('md');
        }
        });

        if (typeof Windows == "undefined") {
        $(window).bind('mouseup.closecombo', function (e) {
        var tg = $(e.target);
        if (!dropDwn.attr('md')) { // <-- fix for IE
        if (!tg.hasClass('ui-select-dropdown') && !bizagi.util.isIE10() && !bizagi.util.isIE11()) {
        self.dropDownValidClose(tg, dropDwn);
        }
        } else {
        dropDwn.removeAttr('md');
        }
        });
        }

        $(window).bind('resize.resizecombo', function () {
        if (self.repositionInterval) {
        clearInterval(self.repositionInterval);
        }

        self.dropDownReposition(dropDwn, containerControl);
        });
        */

        $(document).one("click.closecombo", function (e) {
            var tg = $(e.target);
            if (!dropDwn.attr('md')) { /* <-- fix for IE*/
                self.dropDownValidClose(tg, dropDwn);
            } else {
                dropDwn.removeAttr('md');
            }
        });

    },
    /*
    * validate when fire event form document and window
    */
    dropDownValidClose: function (target, dropDown) {
        var self = this;
        //   if (target.closest(".ui-selectmenu", self.element).length === 0) {
        //        dropDown.fadeOut('slow', function () {
        //            self.dropDownDestroy(dropDown);
        //        });
        dropDown.hide();
        self.dropDownDestroy(dropDown);
        $(document).unbind("click.closecombo");
        //        }
    },
    /*
    * set a new dropdown position
    */
    dropDownReposition: function (dropDown, containerForm) {
        var self = this;
        if ((containerForm.width() != dropDown.data('formWidth'))) {

            var objParent = $(".ui-selectmenu", self.control);
            dropDown.width((self.control.width() < 100) ? 100 : objParent.width());

            var control = dropDown.data('parentCombo') || objParent;
            dropDown.position({
                my: "left top",
                at: "left bottom",
                of: $(".ui-selectmenu-value", control),
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
        var containerControl = self.inputCombo.closest('.ui-bizagi-control');
        var containerRender = containerControl.closest('.ui-bizagi-render');

        // fix for SUITE-9507
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
        if (self.repositionInterval) {
            clearInterval(self.repositionInterval);
        }

        if (typeof Windows != "undefined" && self.grid) {
            $(self.grid.element).find(".bz-rn-grid-data-wraper").css("overflow", "auto");
        }
    },
    /*
    *   
    */

    validateValueInDatasource: function (triggerEvents, isKeyByKey) {
        var self = this;
        var selected = self.inputCombo.val();
        var valText = '';
        var selectedKey = self.findDataByValue(selected, isKeyByKey);


        if (!self.value) {
            self.value = { id: '' };
        }

        if (selectedKey.id > 0) {
            if (!triggerEvents) {
                self.setValue({ id: selectedKey.id }, false);
                self.setDisplayValue(selectedKey);
            }
            else {
                self.setValue({ id: selectedKey.id });
                self.setDisplayValue(selectedKey);
            }
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
        var idDropdown = "dd-" + self.inputCombo.attr("id");
        var dropDown = $("#" + idDropdown);
        var active = $("li.active", dropDown);

        e = e ? e : window.event;

        // Need to implement hiding select on "Escape" and "Enter".
        if (e.altKey || e.ctrlKey || e.metaKey) {
            return 1;
        }

        if (dropDown.length === 0 && !self.properties.data) {
            self.comboDropDown(self.combo);
            dropDown = $("#" + idDropdown);
        }

        //Tab or Shift + Tab
        if (e.shiftKey && (e.keyCode == 9) || (e.keyCode == 9)) {
            if (active.length > 0) {
                self.inputCombo.val(active.text());
            }
            self.focusDependant = true;
            self.validateValueInDatasource(true, true);
            dropDown.remove();
            return 1;
            //return 0;
        }

        if (27 == e.keyCode) {
            self.setDisplayValue(self.selectedValue);
            dropDown.remove();
        }

        if (9 == e.keyCode || 13 == e.keyCode) {
            if (active.length > 0) {
                self.inputCombo.val(active.text());
            }
            self.validateValueInDatasource(true, true);
            dropDown.remove();
            return 1;
        }

        if (e.keyCode == '38' || e.keyCode == '37') {
            // up arrow
            self.selectPreviousElement(dropDown);
            return 0;
        }
        else if (e.keyCode == '40' || e.keyCode == '39') {
            // down arrow
            self.selectNextElement(dropDown);
            return 0;
        }


        /*if(e.keyCode == 34){
        self.selectPageDownElement(dropDown);
        return 0;
         
        }else if(e.keyCode ==33){
        self.selectPageUpElement(dropDown);
        return 0;
         
        }*/


        if (e.keyCode == 36) {
            self.selectFirstElement(dropDown);
            return 0;

        } else if (e.keyCode == 35) {
            self.selectLastElement(dropDown);
            return 0;

        }

        return 1;
    },
    /*
    *   KeyUp listener
    */
    keyUpFunction: function (e) {
        var self = this;
        var idDropdown = "dd-" + self.inputCombo.attr("id");
        var dropDown = $("#" + idDropdown);

        e = e ? e : window.event;

        if (e.altKey || e.ctrlKey || e.metaKey || 50 == e.keyCode || 13 == e.keyCode || 9 == e.keyCode || 27 == e.keyCode || (e.shiftKey || e.keyCode == 16) || e.keyCode == 36 || e.keyCode == 35 || e.keyCode == 33 || e.keyCode == 34) {
            return 0;
        }

        if (dropDown.length === 0) {
            self.comboDropDown(self.combo);
            dropDown = $("#" + idDropdown);
        }

        self.selectItemByKeyUp();

        return 1;
    },
    /*
    * Select letter by letter
    */
    selectItemByKeyUp: function () {
        var self = this, objSelected;

        var idDropdown = "dd-" + self.inputCombo.attr("id");
        var dropDown = $("#" + idDropdown);


        $('.active', dropDown).removeClass('active');

        var selectedKey = self.findDataByValue(self.inputCombo.val(), true);
        if (selectedKey !== -1) {
            objSelected = $("li[data-value='" + selectedKey.id + "']", dropDown);
            objSelected.addClass("active");
        } else {
            objSelected = $('li.ui-selected', dropDown);
        }

        if (dropDown.length > 0 && objSelected.length > 0) {
            scrollPosition = parseInt(objSelected.position().top);
            dropDown.scrollTop(scrollPosition);
        }
    },
    selectFirstElement: function (dropDown) {
        var self = this;
        var actual = $("li:first", dropDown);
        $('li', dropDown).removeClass("active");
        actual.addClass("active");
        scrollPosition = actual.position().top;
        dropDown.scrollTop(scrollPosition);

        self.inputCombo.val($(actual).text());


    },
    selectLastElement: function (dropDown) {
        var self = this;
        var actual = $("li:last", dropDown);
        $('li', dropDown).removeClass("active");
        actual.addClass("active");
        scrollPosition = actual.position().top;
        dropDown.scrollTop(scrollPosition);

        self.inputCombo.val($(actual).text());

    },
    /*selectPageDownElement:function(dropDown){
    var self = this;
    scrollPosition = dropDown.scrollTop() + $(dropDown).height();
    var lista  = $('li');
     
    for(var i=0; i<lista.length; i++){
    var element = $(lista[i]);
    var top = element.position().top;
    if(top >= scrollPosition){
    $('li',dropDown).removeClass("active");
    top = (element.prev().length > 0) ? element.prev().position().top : element.position().top;
    (element.prev().length > 0) ? element.prev().addClass("active") : element.addClass("active");
    dropDown.scrollTop(top);
    break;
    }
    }
     
    },
    selectPageUpElement:function(dropDown){
    var self = this;
    scrollPosition = dropDown.scrollTop();
    var lista  = $('li');
     
    for(var i=0; i<lista.length; i++){
    var element = $(lista[i]);
    var top = element.position().top;
    if(scrollPosition >= top){
    $('li',dropDown).removeClass("active");
    top = (element.prev().length > 0) ? element.prev().position().top : element.position().top;
    (element.prev().length > 0) ? element.prev().addClass("active") : element.addClass("active");
    dropDown.scrollTop(top);
    break;
    }
    }
     
    },*/
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
        /*continuous*/
        /*if(previous.length === 0){
        previous = $("li:last",dropDown);
        }*/
        if (previous.length != 0) {
            actual.removeClass("active");
            $(previous).addClass("active");
            scrollPosition = $(previous).position().top;

            dropDown.scrollTop(scrollPosition);
            self.inputCombo.val($(previous).text());
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
        /*continuous*/
        /*if(next.length === 0){
        next = $("li:first",dropDown);
        }*/
        if (next.length != 0) {
            actual.removeClass("active");
            $(next).addClass("active");
            scrollPosition = $(next).position().top;

            dropDown.scrollTop(scrollPosition);
            self.inputCombo.val($(next).text());
        }

    },
    /*
    *   Handler to react when a combo item is selected
    */
    onComboItemSelected: function (val) {
        var self = this;
        var selectedId = val.id || "";
        var selectedLabel = val.value || "";

        self.properties.originalValue = self.getValue();

        if (selectedId === "") {
            self.inputCombo.val('');
        } else {
            self.inputCombo.val(selectedLabel);
        }

        self.setValue({ id: selectedId });
        self.setDisplayValue({ value: selectedLabel });
    },
    /*
    *   Sets the value in the rendered control
    */
    setDisplayValue: function (value) {
        var self = this;
        var properties = self.properties;
        var comboValue = '';
        var comboValueValid = true;
        var control;

        if (properties.editable && value !== null) {
            // If set display value were assigned from render action
            if (typeof value === "object" && value.label !== undefined) {
                comboValue = self.findDataById(value.value).value || value.label;
                self.setValue({ id: value.value, value: value.label });
            } else {
                if (typeof value === "number" || typeof value === "string" || value.id) {
                    if (value.id) {
                        var translated = false;//When the parametric entity have a boolean attribute
                        if (value.value != null && typeof value.value == "boolean") {
                            translated = true;
                            if (bizagi.util.parseBoolean(value.value) == true) {
                                value.value = this.getResource("render-boolean-yes");

                            } else if (bizagi.util.parseBoolean(value.value) == false) {
                                value.value = this.getResource("render-boolean-no");
                            }
                        } else if (value.value != null && typeof value.value == "object") {
                            for (var i = 0; i < value.value.length; i++) {
                                if (value.value[i] != null && typeof (value.value[i]) == "boolean") {
                                    if (bizagi.util.parseBoolean(value.value[i]) == true) {
                                        value.value[i] = this.getResource("render-boolean-yes");

                                    } else if (bizagi.util.parseBoolean(value.value[i]) == false) {
                                        value.value[i] = this.getResource("render-boolean-no");
                                    }
                                }
                            }
                        }
                        if(translated){
                            comboValue = value.value;
                        }
                        else{
                            comboValue = self.findDataById(value.id).value || value.value;
                        }
                    } else {
                        comboValue = self.findDataById(Number(value)).value || value.label;
                    }
                } else {
                    comboValue = (typeof value.value == 'object') ? value.value.join(" - ") : value.value;
                }

                if (properties.hasLocalData || properties.remoteDataLoaded) {
                    comboValueValid = self.findDataByValue(comboValue);
                    if (comboValueValid === -1) {
                        comboValue = '';
                    }
                }

                if (value && value.id) {
                    // Check if the value is a json object
                    if ((value.id != undefined) && ((typeof value.id == 'number' && value.id > 0) || (typeof value.id == 'string' && value.id.length > 0))) {
                        if (self.value.id != value.id) {
                            self.setValue({ id: value.id });
                        }
                    } else {
                        if (self.value.id != value) {
                            self.setValue({ id: value });
                        }
                    }
                }
            }
            if ($.isArray(comboValue)) {
                comboValue = comboValue.join(" - ");
            }
            if (self.inputCombo) {
                self.inputCombo.val(comboValue);
            } else {
                control = $(".ui-selectmenu-value", self.getControl());
                control && control.val(comboValue);
            }

        } else {
            if (!properties.editable && value !== null) {
                if (typeof value === "number" || typeof value === "string") {
                    comboValue = self.findDataById(Number(value)).value;
                    control = self.getControl();
                    control.text(self.formatItem(comboValue));
                } else {
                    if (typeof value === "object") {
                        if (bizagi.util.isNumeric(value.id)) {
                            self.setValue({ id: value.id, value: value.value });
                            self.control.text(value.value);
                        } else {
                            self.setValue({ id: value.value, value: value.label });
                            self.control.text(value.label);
                        }
                    }
                }
            } else {
                if (value === null && properties.editable) {
                    var emptySelection = self.getResource("render-combo-empty-selection");
                    self.inputCombo.val(emptySelection);
                } else {
                    if (value === null && !properties.editable) {
                        self.getControl().text("");
                    }
                }
            }
        }
    },
    /*
    *   Sets the value in the rendered control
    */
    clearDisplayValue: function () {
        var self = this;
        var control = self.getControl();
        if (self.inputCombo) {
            var emptySelection = self.getResource("render-combo-empty-selection");
            self.inputCombo.val(emptySelection);
        }else if (!self.properties.editable) {
            $(control).html("<label class='readonly-control'></label>");
        }
        self.value = self.properties.value = self.selectedValue;
    },
    /*
    * Cleans current data
    */
    cleanData: function () {
        var self = this;
        self.value = self.properties.value = self.selectedValue = { id: "", value: "" };
        self.clearDisplayValue();
    },
    /*
    *   Returns the selected value in the template
    */
    getSelectedValue: function () {
        var self = this;
        return self.selectedValue;
    },
    /*
    *   Find elements within a data source
    */
    findDataById: function (id) {
        var self = this;
        var result = {};
        if (self.properties.data) {
            $.each(self.properties.data, function (key, value) {
                if (value.id == id) {
                    result = value;
                }
            });
        }

        return result;

    },
    /*
    *
    */
    findDataByValue: function (val, keyByKey) {
        var self = this;
        var result = -1;

        if ((val !== undefined && val !== null) && (self.properties.data != undefined)) {
            if (keyByKey) {

                var i = -1;
                var dataLength = self.properties.data.length - 1;
                var value;

                var tvalue,
                    nValue;

                var compareValIn,
                    compareVal;

                while (i++ < dataLength) {
                    value = self.properties.data[i];

                    compareValIn = (typeof val == 'object') ? val.join(" - ") : (typeof val === 'boolean') ? val.toString() : val;
                    compareVal = $.trim(compareValIn).substring(0, compareValIn.length).toLowerCase();

                    if (typeof value === 'object' && typeof value.value === 'object') {
                        tvalue = (typeof value.value == 'object') ? value.value.join(" - ") : value.value;
                    } else {
                        tvalue = $.trim(value.value);
                    }

                    nValue = String(tvalue).toLowerCase();

                    //Find the first ocurrence, without writing the complete element
                    if (nValue.indexOf(compareVal) != -1) {
                        result = { id: value.id, value: value.value };
                        i = dataLength;
                    }
                }
            }
            else {
                if (self.getValue()) {
                    result = self.getValue();
                    if (!result.value) {
                        result.value = self.inputCombo.val();
                    }
                }
            }
        }

        return result;
    },
    setValue: function (val, triggerEvents) {
        var self = this;

        if (val === null) {
            val = { id: "" };
        }

        if (!!val) {
            var id = typeof val === "object" ? val.id || "" : typeof val === "number" || typeof val === "string" ? self.getValueFromData(val) : "";
            var label = val.value || self.findDataById(id).value || "";

            self.selectedValue = { id: id, value: label };
            this._super(self.selectedValue, triggerEvents);
        }
    },

    getValueFromData: function(dataValue){
        var self = this;
        var value = Number(dataValue);
        if(isNaN(value)){
            value = dataValue;
        }
        return value;
    },

    recalculateComboOffset: function (dropDwn, objParent) {
        if (bizagi.util.isIE() && (bizagi.util.getInternetExplorerVersion() == 9)) {
            if (dropDwn.width() !== objParent.width()) {
                var offset = objParent.width() - dropDwn.width();
                dropDwn.width(objParent.width() + offset);
            }
        }
    }
});

// We override original select menu refresh position method to adjust custom stuff
var originalRefreshPositionMethod = $.ui.selectmenu.prototype._refreshPosition;
$.ui.selectmenu.prototype._refreshPosition = function () {
    // Set initial heigth to zero
    this.list.height(0);

    // Call original method
    var result = originalRefreshPositionMethod.apply(this, arguments);

    // Return original response
    this.list.css("width", this.newelement.width() + "px");
    return result;
};
