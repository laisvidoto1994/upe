/*
 *   Name: BizAgi smartphone Render option select
 *   Author: CristianO
 *   Date: 29/10/2015
 *   Comments:
 *   -   Render a single input with a modal view, this modal view contain a
 *       selectable list.
 */

// Extends itself
bizagi.rendering.combo.extend("bizagi.rendering.combo", {
}, {

    /*
    *
    */
    renderReadOnly: function () {
        var self = this;
        var template = self.renderFactory.getTemplate("readonlyCombo");
        return $.fasttmpl(template, {});
    },

    /**
     * Initilizing the combo control
     * */
    initializeCombo: function () {
        var self = this;
        var properties = self.properties;
        var control = self.getControl();
        var container = self.getRenderedElement();
        var params = {};

        //Getting the input
        self.input = $(".bz-rn-combo-control", control);
        if (properties.parentComboValue && properties.parentComboValue != null) {
            params[self.Class.BA_ACTION_PARAMETER_PREFIX + "parent"] = properties.parentComboValue;
        }

        if (!properties.editable) {
            //if isn't a editable control, then show a non editable textbox
            var textTmpl = self.renderFactory.getTemplate("text");
            self.input = $.tmpl(textTmpl, {}).appendTo(control);

            //Add styles class
            container.addClass("bz-command-not-edit");
            self.input.attr("readonly", "readonly");

            if (self.input) {
                self.inputSpan = $('.bz-rn-text', control);

                if (self.value != null) {
                    self.inputSpan.text(self.value.value || self.value.id);
                }
            }
        } else {
            if (typeof self.initialValueSet !== "undefined" && !self.initialValueSet) {
                $.when(self.renderCombo(params)).done(function (html) {
                    self.getControl().html(html);
                    self.input = self.combo = self.getControl();
                    self.configureCombo();
                });
            } else {
                self.configureCombo();
            }
        }
    },

    /**
     * Postrender Method
     * */
    postRender: function () {
        var self = this;

        //Initialicing the control
        self.initializeCombo();

        var properties = self.properties;
        var container = self.getRenderedElement();

        if (properties.editable) {
            container.addClass("bz-command-edit-inline");
        }

        self.configureHelpText();
        self._super();
        self.processLayout(false, self.properties.valueFormat || {});
    },

    /*
    *
    */
    postRenderReadOnly: function () {
        var self = this;
        var control = self.getControl();
        var item = self.getValue();
        var template;

        //self._super();

        control.closest(".ui-bizagi-render").addClass("bz-rn-read-only");
        self.inputSpan = $(".bz-rn-text", control);

        if (item) {
            if (item.value != null && typeof item.value == "boolean") {
                if (bizagi.util.parseBoolean(item.value) == true) {
                    item.value = this.getResource("render-boolean-yes");
                } else if (bizagi.util.parseBoolean(item.value) == false) {
                    item.value = this.getResource("render-boolean-no");
                }
            }
            // Returns the cached value from the properties to avoid server side fetching
            (self.getResource("render-combo-empty-value") == item.value || self.getResource("render-combo-empty-selection") == item.value) ? self.inputSpan.text("") : self.inputSpan.text(self.formatItem(item.value));
        } else {
            self.inputSpan.text("");
        }
    },

    /**
     * Setting the combo's handlers
     * */
    configureCombo: function() {
        var self = this;

        self.inputSpan = self.input.find(".bz-rn-cm-text-label");
        self.inputSpan.html($("option:selected", self.input).text());
        self.inputSpan.val($("option:selected", self.input).text());

        $(".bz-rn-container-combo", self.control).unbind().bind("click", function() {
            //After click on input combo, remove focus of it.
            self.input.find(".bz-rn-combo-control").blur();
            $(self.input).blur();

            self.input.attr("keyboard", "disable");

            //Creating modal view
            self.processComboData(self.properties.data);
            var modalViewTemplate = kendo.template(self.renderFactory.getTemplate('comboModalView'), { useWithBlock: false });
            var modalView = $(bizagi.util.trim(modalViewTemplate({ 'items': self.properties.data, 'displayName': self.properties.displayName || "", "orientation": self.properties.orientation }))).clone();

            modalView.kendoMobileModalView({
                close: function() {
                    this.destroy();
                    this.element.remove();
                },
                useNativeScrolling: true,
                modal: false
            });

            self.configureModalViewHandlers(modalView);
            modalView.kendoMobileModalView("open");
            modalView.closest(".k-animation-container").addClass("bz-rn-new-modalview-position");
        });

        //Setting the Display Value
        /**
         * Case 1: Is a cascading combo and all combos have values (when form is rendering or the form is saved)
         * Case 2: Is a cascading combo and in the parent combo was selected a new value
         * Case 3: Is a normal combo.
         * */
        if (self.initializingCascadingCombo && self.properties.value) {
            self.onComboChange(self.properties.value);
            self.setDisplayValue(self.properties.value);
        } else if (self.initializingCascadingCombo != undefined && !self.initializingCascadingCombo && self.parentCombo && self.parentCombo.properties.previousValue
                && self.parentCombo.properties.value.value != (self.parentCombo.properties.previousValue.value || self.parentCombo.properties.previousValue[0].value)) {
            self.setDisplayValue({ id: "", value: "-------------" });
        } else if (self.initializingCascadingCombo != undefined && !self.initializingCascadingCombo && self.properties.value) {
            self.setDisplayValue(self.properties.value);
        } else if (self.properties.value) {
            self.setDisplayValue(self.properties.value);
        }
    },

    /**
     * Configure the modalView Handlers for the new combo control.
     * */
    configureModalViewHandlers: function(inputContainer){
        var self = this;

        var closeModalViewPromise = new $.Deferred();

        //getting combo list elements
        var container = inputContainer.find(".bz-wp-modalview-results-list li");

        //Hide the clear text icon
        inputContainer.find(".bz-wp-modalview-header-cancel-search").hide(500);

        inputContainer.delegate("#ui-bizagi-cancel-button", "click", function () {
            closeModalViewPromise.reject();
            inputContainer.data("kendoMobileModalView").close();
        });

        //Filtering list
        inputContainer.find(".bz-wp-modalview-header-input-search").bind('change keypress  keyup change', function () {
            self.filterList(this.value, container, inputContainer);
        });

        //Cleaning list
        inputContainer.find(".bz-wp-modalview-header-cancel-search").bind("click", function () {
            self.filterList("", container, inputContainer);
            inputContainer.find(".bz-wp-modalview-header-input-search").val("");
            $(this).hide(500);
        });

        //Configuring list as a selectable element
        self.list = $(".bz-wp-modalview-results-list", inputContainer);
        self.setModalViewDisplayValue(self.properties.value || false);

        self.inputSpan = inputContainer.find(".bz-rn-cm-text-label");
        self.inputSpan.html($("li.ui-selected", self.list).text());
        self.inputSpan.val($("li.ui-selected", self.list).text());

        //Setting the initial selected display value
        self.list.find("li").bind("click", function () {
            var selectedElements = self.list.find(".ui-state-active");
            self._newSelectedElement = this;

            selectedElements.each(function (index, element) {
                if (self._newSelectedElement.id !== element.id) {
                    $(element).removeClass("ui-state-focus ui-selected ui-state-active");
                }
            });

            $(this).addClass("ui-state-focus ui-selected ui-state-active");

            self.input.blur();
            $(".bz-wp-modalview-header-input-search", inputContainer).blur();
        });

        inputContainer.delegate(".ui-bizagi-apply-button", "click", function () {
            closeModalViewPromise.resolve();
            inputContainer.data("kendoMobileModalView").close();
        });

        inputContainer.find(".bz-wp-modalview-close").bind("click", function () {
            closeModalViewPromise.reject();
            inputContainer.data("kendoMobileModalView").close();
        });

        $.when(closeModalViewPromise).done(function () {
            var selected = $("li.ui-selected", self.list);
            var value = $(selected).data("value");
            var label = $(selected).text();

            //Update internal value
            var newValue = { id: value, value: label };

            self.setValue(newValue);
            self.selectedValue = newValue.value;
            self.setDisplayValue(newValue);
            self.changeCombo(newValue.value, newValue);
        }).fail(function () {
        });
    },

    /**
     * Filtering list of elements
     * */
    filterList: function (search, $li, inputContainer) {
        if (search !== "") {
            inputContainer.find(".bz-wp-modalview-header-cancel-search").show(500);
        } else {
            inputContainer.find(".bz-wp-modalview-header-cancel-search").hide(500);
        }

        $li.filter(function () {
            var stringContainer = $(this).text().toUpperCase();
            var stringToSearch = search.toUpperCase();

            if (stringContainer.indexOf(stringToSearch) >= 0) {
                return $(this);
            } else {
                $(this).hide();
            }
        }).show();
    },

    actionSave: function () {
        var self = this;
        var selected = this.inputEdition.find(".bz-rn-combo-selected");
        var valueItem = selected.find(">div >span").html();
        var valueObjet = { id: selected.attr("id"), value: valueItem };
        self.changeCombo(valueItem, valueObjet);
    },

    /**
     * Setting the selected element.
     * */
    setModalViewDisplayValue: function (value) {
        var self = this;
        var properties = self.properties;

        if (self.list && properties.editable && (typeof (value) !== "undefined") && value !== null && value.id !== "") {
            self.list.find("#ui-bizagi-list-" + value.id)
            .addClass("ui-state-focus ui-selected ui-state-active");
        }
    },

    processComboData: function(data){
        var self = this;

        data.forEach(function(value){
            self.validateValue(value);
        });
    },

    validateValue: function(value){
        var self = this;

        if (!bizagi.util.isEmpty(value) && ((typeof (value.id) !== "undefined") && 
        ((typeof value.id === "number" && value.id !== null) || 
            (typeof value.id === "string" && value.id.length > 0)))) {
            var translated = false;//When the parametric entity have a boolean attribute
            if (value.value !== null && typeof value.value === "boolean") {
                translated = true;
                if (bizagi.util.parseBoolean(value.value) === true) {
                    value.value = bizagi.localization.getResource("render-boolean-yes");
                } else if (bizagi.util.parseBoolean(value.value) === false) {
                    value.value = bizagi.localization.getResource("render-boolean-no");
                }
            } else if (value.value != null && typeof value.value === "object") {
                for (var i = 0; i < value.value.length; i++) {
                    if (value.value[i] != null && typeof (value.value[i]) === "boolean") {
                        if (bizagi.util.parseBoolean(value.value[i]) === true) {
                            value.value[i] = bizagi.localization.getResource("render-boolean-yes");
                        } else if (bizagi.util.parseBoolean(value.value[i]) === false) {
                            value.value[i] = bizagi.localization.getResource("render-boolean-no");
                        }
                    }
                }
            }
        }
    },

    /**
     * Setting the display value.
     * */
    setDisplayValue: function (value) {
        var self = this;
        var properties = self.properties;
        var control = self.getControl();

        self.validateValue(value);

        var valuers = value && typeof (value.value) !== "undefined" ? bizagi.rendering.combo.prototype.formatItem.call(self, value.value) : self.formatItem(value.value);

        if (properties.editable) {
            if (value) {
                $(".bz-rn-combo-control", control).val(value.value);
                self.inputSpan.html(valuers);
                self.inputSpan.val(valuers);
            }            
        } else {
            self.inputSpan.text(valuers);
        }
    },

    /**
     * Change event on cascading combos.
     * */
    changeCombo: function (valueItem, valueObjet) {
        var self = this;

        self.setValue(valueObjet);
        self.selectedValue = valueItem;
        self.trigger("selectElement", valueObjet);
        self.inputSpan.html(valueItem);
        self.inputSpan.val(valueItem);
    },

    /**
     * Getting the templates
     * */
    getTemplateName: function () {
        return "combo";
    },

    /**
     * Getting the templates
     * */
    getTemplateEditionName: function () {
        return "edition.combo";
    }
});