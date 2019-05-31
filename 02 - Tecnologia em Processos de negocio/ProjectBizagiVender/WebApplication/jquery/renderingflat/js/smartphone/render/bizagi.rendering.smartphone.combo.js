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
    * */
    renderReadOnly: function () {
        var self = this;
        var result = self._super();
        var template = self.renderFactory.getTemplate("readonlyCombo");
        return $.fasttmpl(template, {});
    },

    /**
     * Initilizing the combo control
     * */
    renderSingle: function () {
        var self = this;

        self._super();

        var properties = self.properties;
        var container = self.getContainerRender();
        var control = self.getControl();
        var params = {};

        // Flag to set or not the display value on cascading combos.
        self.showDisplayValue = false;

        // Getting the input
        self.input = $(".bz-rn-combo-control", control);
        if (properties.parentComboValue && properties.parentComboValue != null) {
            params[self.Class.BA_ACTION_PARAMETER_PREFIX + "parent"] = properties.parentComboValue;

            //If is a cascading combo, and has a parent and has its own value, then set the display value.
            self.showDisplayValue = self.parentCombo && self.parentCombo.value && self.parentCombo.value.value !== "" && self.properties.value && self.properties.value.value;
        }

        if (!properties.editable) {
            self.inputSpan = $('.bz-rn-text', control);
            container.addClass("bz-rn-non-editable bz-command-edit-inline");

            if (self.value != null) {
                self.inputSpan.text(self.value.value || self.value.id);
            }
        } else {
            if (typeof self.initialValueSet !== "undefined" && !self.initialValueSet) {
                $.when(self.renderCombo(params)).done(function (html) {
                    self.getControl().html(html);
                    self.input = self.combo = self.getControl();
                    self.configureCombo();
                    self.processLayout(false, self.properties.valueFormat || {});
                });
            } else {
                self.configureCombo();
            }
        }
    },

    /**
     * Postrender Method
     * */
    postRenderSingle: function () {
        var self = this;
        var properties = self.properties;
        var container = self.getContainerRender();

        if (properties.editable) {
            container.addClass("bz-command-edit-inline");
        }

        self._super();
    },

    renderEdition: function () { },

    /**
     * Setting the combo's handlers
     * */
    configureCombo: function () {
        var self = this;

        self.inputSpan = self.input.find(".bz-rn-cm-text-label");
        self.inputSpan.html($("option:selected", self.input).text());
        self.inputSpan.val($("option:selected", self.input).text());

        $(".bz-rn-container-combo", self.getControl()).unbind().bind("click", function () {
            //After click on input combo, remove focus of it.
            self.input.find(".bz-rn-combo-control").blur();
            $(self.input).blur();

            self.input.attr("keyboard", "disable");

            //Creating modal view
            self.processComboData(self.properties.data);
            var modalViewTemplate = kendo.template(self.renderFactory.getTemplate('comboModalView'), { useWithBlock: false });
            var modalView = $(bizagi.util.trim(modalViewTemplate({ 'items': self.properties.data, 'displayName': self.properties.displayName || "", "orientation": self.properties.orientation }))).clone();

            modalView.kendoMobileModalView({
                close: function () {
                    this.destroy();
                    this.element.remove();
                },
                useNativeScrolling: true,
                modal: false
            });

            self.configureModalViewHandlers(modalView);
            modalView.kendoMobileModalView("open");
        });

        //Setting the displayValue if is necesary
        if (self.showDisplayValue) {
            self.setDisplayValue(self.properties.value);
            self.showDisplayValue = false;
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

        if ((value.id != undefined) && ((typeof value.id === "number" && value.id !== null) || (typeof value.id === "string" && value.id.length > 0))) {
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
     * Configure the modalView Handlers for the new combo control
     * */
    configureModalViewHandlers: function (inputContainer) {
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

        self.list.find("li").bind("click", function () {
            self.list.find("li").filter(function () {
                if ($(this).hasClass("ui-selected")) {
                    return $(this);
                }
            }).removeClass("ui-selected");

            $(this).addClass("ui-selected");
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

    /**
     * Setting the selected element.
     * */
    setModalViewDisplayValue: function (value) {
        var self = this;
        var properties = self.properties;

        if (properties.editable && (value && typeof (value) !== "undefined" && value !== null) && value.id !== "") {
            self.list.find("#ui-bizagi-list-" + value.id).addClass("ui-selected");
        }
    },

    /**
     * Setting the display value.
     * */
    setDisplayValue: function (value) {
        var self = this;
        var properties = self.properties;
        var control = self.getControl();

        if (value && value.id) {
            // Check if the value is a json object
            if (value.id !== undefined) {
                self.validateValue(value);
                $("option[value='" + value.id + "']", control).prop("selected", true);
            } else {
                // If the value is the key then assign it
                $("option[value='" + value + "']", control).prop("selected", true);
            }
        }

        var valuers = value && typeof (value.value) !== "undefined" ? bizagi.rendering.combo.prototype.formatItem.call(self, value.value) : self.formatItem(value.value);

        if (properties.editable) {
            $(".bz-rn-combo-control", control).val(value.value);
            self.inputSpan.html(valuers);
            self.inputSpan.val(valuers);
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
    }
});