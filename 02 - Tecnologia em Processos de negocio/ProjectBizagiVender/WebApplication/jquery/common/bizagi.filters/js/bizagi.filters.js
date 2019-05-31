/**
 *   Author: Alexander Mejia
 *   Comments:
 *   -   This widget will implement a custom filter for bizagi workportal module
 */
(function ($) {
    $.widget("ui.bizagi_filters", {
        options: {
            type: 1,
            parent: "",
            data: {},
            entity: false,
            dataService: null,
            templates: {
                filterWrapper: "",
                filterString: "",
                filterNumber: "",
                filterDate: "",
                filterBoolean: ""
            },
            // Se comentan los filtros porque queryengine no tiene soporte sobre los mismos. Descomentar a la espera de que se soporten
            operators: {
                "equals": { label: "workportal-widget-filter-operators-equals-to", appliesTo: ["Text", "Number", "Integer", "DateTime", "Boolean", "RelatedEntity", "Entity", "Currency"], operator: "=" },
                //"not-equals": { label: "workportal-widget-filter-operators-different-to", appliesTo: ["Text", "Number", "Integer", "DateTime", "Entity", "Currency", "Boolean"], operator: "!=" },
                "like": { label: "workportal-widget-filter-operators-like", appliesTo: ["Text", "TextExtended"], operator: "LIKE" },
                "is-null": { label: "workportal-widget-filter-operators-is-null", appliesTo: ["Text", "TextExtended", "Number", "Integer", "DateTime", "Boolean", "Entity", "Currency"], isUnary: true, operator: "IS NULL" },
                //"is-not-null": { label: "workportal-widget-filter-operators-is-not-null", appliesTo: ["Text", "Number", "Integer", "DateTime", "Boolean", "Entity", "Currency"], isUnary: true, operator: "IS NOT NULL" },
                //"less-than": { label: "workportal-widget-filter-operators-less-than", appliesTo: ["Number", "Integer", "DateTime", "Currency"], operator: "<" },
                "less-equals-than": { label: "workportal-widget-filter-operators-less-or-equal-than", appliesTo: ["Number", "Integer", "DateTime", "Currency"], operator: "<=" },
                //"greater-than": { label: "workportal-widget-filter-operators-greater-than", appliesTo: ["Number", "Integer", "DateTime", "Currency"], operator: ">" },
                "greater-equals-than": { label: "workportal-widget-filter-operators-greater-or-equal-than", appliesTo: ["Number", "Integer", "DateTime", "Currency"], operator: ">=" }
            },
            // callbacks
            change: null
        },

        //Test
        testPrivateFunction: function (nameFunction, params) {
            var self = this;
            self[nameFunction].call(self, params);
        },

        /**
         * Constructor
         */
        _create: function () {
            var self = this;

            self._on(self.element, {
                "click": function () {
                    self.buildFilter();
                }
            });
        },

        /**
         * Builds the filter with operators and control to input data
         */
        buildFilter: function () {
            var self = this,
                templates = self.options.templates;

            self.filterType = self.getFilterType();

            if ($.isFunction(self["build" + self.filterType + "Filter"])) {

                var $filter = self.$filter = $.tmpl(templates.filterWrapper);
                $filter.appendTo("body", document);

                // Define handler to close the item
                setTimeout(function () {
                    // Capture all click elements inside the popup
                    $filter.click(function (e) {
                        e.stopPropagation();
                    });

                    // Make a document click, if the event bubbles up to here then the click was made outside popup boundaries
                    $(document).one("click", function (ev) {
                        // Given that the previous event is to general, it is necessary to specify that the user do the click outside the jquery date picker
                        if ($(ev.target).closest("#ui-datepicker-div").length === 0 && $(ev.target).closest(".ui-datepicker-header").length === 0) {
                            $filter.remove();
                        }
                    });
                }, 100);

                // Add Operators
                self.addOperators($filter);
                self.configureHandlers($filter);

                // Add Control
                self["build" + self.filterType + "Filter"]($filter);

                // Locate the widget
                $filter.css(self.getPosition());
            }
        },

        /**
         * Configure handlers for different elements of the component
         */
        configureHandlers: function ($filter) {
            var self = this;

            $filter.find("#biz-column-filter-buttons").on("click", ".biz-column-filter-button", function (ev) {
                var $target = $(ev.target),
                    $button = $target.closest("button"),
                    data = self.options.data,
                    buttonType = $button.data("button");

                if (buttonType == "apply") {
                    self.applyFilter(data);
                }
                else if (buttonType == "clear") {
                    self.options.data = {};
                    self._trigger("change", "", {});
                }

                $filter.remove();
            });
        },

        applyFilter: function(data){
            var self = this;
            if(data.key === "is-null"){
                data.value = undefined;
            }
            if(data.key === "is-null" || (data.key !== "is-null" && typeof data.value !== "undefined" && data.value !== null ) ){
                self._trigger("change", "", data);
            }
        },

        /**
         * Adds operators related with the type of control
         */
        addOperators: function ($filter) {
            var self = this;
            var $operators = $filter.find("#biz-column-filter-operators");
            var operatorsData = self.getOperators();
            var initialValue = self.getInitialValue(operatorsData);

            $operators.uicombo({
                data: { combo: operatorsData },
                initValue: initialValue,
                itemValue: function (item) {
                    return item.id;
                },
                itemText: function (item) {
                    return item.displayName;
                },
                onChange: function (obj) {
                    self.setControlVisibility(obj.ui.data("value"));
                    self.update({ operator: self.getOperator(obj.ui.data("value")) });
                    self.update({ key: obj.ui.data("value") });

                    if(obj.ui.data("value") === "is-null"){
                        self.enableButton("filter");
                    }
                    else{
                        var $inputTextControl = self.$filter.find("#biz-column-filter-control input[type=text]");
                        if($inputTextControl.length > 0 && $inputTextControl.val().length === 0){
                            self.disableButton("filter");
                        }
                    }
                }
            });
        },

        /**
         * Returns the initial operator
         */
        getInitialValue: function (operatorsData) {
            var self = this;
            var data = self.options.data;

            if (data) {
                for (var i = 0, l = operatorsData.length; i < l; i++) {
                    var item = operatorsData[i];
                    if (item.id == data.key) {
                        self.setControlVisibility(item.id);
                        return item;
                    }
                }
            }

            self.setControlVisibility(operatorsData[0].id);
            self.update({ operator: self.getOperator(operatorsData[0].id) });
            self.update({ key: operatorsData[0].id });

            return operatorsData[0];
        },

        /**
         * Returns the properties to locate the filter
         */
        getPosition: function () {
            var self = this;
            var $parent = self.options.parent;
            var offset = $parent.offset();

            return {
                "top": offset.top + $parent.height(),
                "left": offset.left
            };
        },

        /**
         * This method returns the type of filter to build
         */
        getFilterType: function () {
            var self = this;
            var type = self.options.type;

            if (self.options.entity){
                return "RelatedEntity";
            }

            if (type == 15 || type == 14 || type == 16 || type == 21 || type == 22) {
                return "Text";
            }

            if (type == 23) {
                return "TextExtended";
            }

            if (type == 1 || type == 2 || type == 3 || type == 4) {
                return (self.options.entity)? "Entity" : "Integer";
            }

            if (type == 6 || type == 7 || type == 10 || type == 11) {
                return "Number";
            }
            if (type == 12 || type == 13) {
                return "DateTime";
            }
            if (type == 5) {
                return "Boolean";
            }
            if (type == 8) {
                return "Currency";
            }
        },

        validateLimitsNumbersByType: function(type, value){
            var min, max, response = {};
            /**
             * Types Definedin Backend
             * None = 0,BigInt = 1,Int = 2,SmallInt = 3,TinyInt = 4,Boolean = 5,Decimal = 6,Numeric = 7,Money = 8,Float = 10,Real = 11,DateTime = 12,SmallDateTime = 13,
            Char = 14,VarChar = 15,Text = 16,Binary = 17,VarBinary = 18,Image = 19,Guid = 20,NChar = 21,NVarChar = 22,NText = 23,MxMBidirectionalRelationship = 24,
            MxMUnidirectionalRelationship = 25,EntityDisabled = 26,UserAuth = 27,MxMUnidirectionalRelationshipWithoutFilter = 28,OracleNumber = 29,
            Stakeholder = 30,ActivityItems = 31
            */
            switch(type) {
                case 1:
                    min = -9007199254740992;
                    max = min * -1;
                    break;
                case 2:
                case 7:
                case 29:
                    min = -2147483647;
                    max = min * -1;
                    break;
                case 3:
                    min = -32767;
                    max = min * -1;
                    break;
                case 4:
                    min = 0;
                    max = 255;
                    break;
                case 6:
                case 8:
                    min = -922337203685477;
                    max = min * -1;
                    break;
                case 10:
                    min = -999999999999999;
                    max = min * -1;
                    break;
                case 11:
                    min = -9999999;
                    max = min * -1;
                    break;
                default:
                    min = -2147483647;
                    max = min * -1;
                    break;
            }
            if(typeof value !== "undefined"){
                response.result = value >= min && value <= max;
                response.maxValue = max;
                response.sign = Math.sign(value);
            }
            response.message = bizagi.localization.getResource("workportal-widget-filter-validator-between-values").
                replace("{0}", min).replace("{1}", max);
            return response;
        },

        /**
         * Configure the number control
         */
        buildCurrencyFilter: function ($filter) {
            var self = this;
            var data = self.options.data || {};
            var templates = self.options.templates;

            var $control = $filter.find("#biz-column-filter-control");
            $control.append($.tmpl(templates.filterNumber, {
                value: data.value || 0,
                title: self.validateLimitsNumbersByType(self.options.type).message
            }));

            var $input = $control.find("input");

            $input.numeric(bizagi.currentUser.decimalSeparator);

            var numericFormat = bizagi.clone(bizagi.localization.getResource("numericFormat"));
            if((typeof (bizagi.currentUser.symbol) != "undefined")){
                numericFormat.symbol = bizagi.currentUser.symbol;
            }
            $input.formatCurrency(numericFormat);

            var collectDataValue = function($input){
                var value = $input.val(),
                    regexString = "/[" + numericFormat.symbol + numericFormat.digitGroupSymbol + "]/g",
                    regex = eval(regexString);

                value = value.replace(regex, "");

                var auxInput = $("<input>").attr({
                    type: "text",
                    value: value
                });

                //validate number and set max value if it exceeds limits
                var validationNumber = self.validateLimitsNumbersByType(self.options.type, auxInput.asNumber());
                if(!validationNumber.result && value !== 0){
                    value = validationNumber.maxValue * validationNumber.sign;
                    $input.val(value);
                    $input.formatCurrency(numericFormat);
                }

                if (value.length === 0) {
                    value = null;
                }
                return value;
            }

            var updateValue = function () {
                var value = collectDataValue($input);
                self.update({ value: parseFloat(value.toString().replace(",", ".")) });
            };

            updateValue();//Because the format set automatically value

            $.proxy(self.configureHandlerInputTypeText($input, $filter, data, updateValue), self);
        },

        /**
         * Configure the Entity control
         */
        buildEntityFilter: function ($filter) {
            var self = this;
            var data = self.options.data;
            var dataService = self.options.dataService;

            var $control = $filter.find("#biz-column-filter-control");
            $control.startLoading({ delay: 0, overlay: true });

            var processEntityData = function (entityData) {

                if (entityData && entityData.length > 0) {
                    var initialValue = getInitialValue(entityData);
                    $control.uicombo({
                        data: { combo: entityData },
                        initValue: initialValue,
                        itemValue: function (item) {
                            return item.id;
                        },
                        itemText: function (item) {
                            return item.displayAttrib;
                        },
                        onChange: function (obj) {
                            var auxValue = obj.ui.data("value");
                            if($.isNumeric(entityData[0].id)){
                                auxValue = parseInt(auxValue);
                            }
                            self.update({ value: auxValue });
                        }
                    });
                }
                else {
                    $control.text("No data");
                    self.disableButton("filter");
                }
            };

            var getInitialValue = function (entityData) {
                if (data && data.value) {
                    for (var i = 0, l = entityData.length; i < l; i++) {
                        var item = entityData[i];
                        if (item.id == data.value) {
                            self.update({ value: item.id });
                            return item;
                        }
                    }
                }

                var auxValue = entityData[0].id;
                if($.isNumeric(entityData[0].id)){
                    auxValue = parseInt(auxValue);
                }
                self.update({ value: auxValue });
                return entityData[0];
            };

            $.when(dataService.getAdminEntityData({ idEntity: self.options.entity }))
                .done(processEntityData)
                .always(function () {
                    $control.endLoading();
                });
        },

        /**
         * Configure the Related Entity
         */
        buildRelatedEntityFilter: function ($filter) {
            //This method is necessary because is necessary a new method for each new type and specific filters type
            var self = this;
            self.buildEntityFilter($filter);
        },

        /**
         * Configure the datetime control
         */
        buildDateTimeFilter: function ($filter) {
            var self = this;
            var data = self.options.data || {};
            var templates = self.options.templates;
            var dateFormat = bizagi.util.dateFormatter.getDateFormatByDatePickerJqueryUI().toLowerCase();
            var $control = $filter.find("#biz-column-filter-control");
            $control.append($.tmpl(templates.filterDate, { value: data.value }));

            // Parse date
            var date = null;

            if (data.value) {
                try {
                    date = new Date(data.value);
                    self.enableButton("filter");
                }
                catch (e) {
                    date = null;
                    self.disableButton("filter");
                }
            }
            else{
                self.disableButton("filter");
            }

            var $dateControl = $control.find("input");
            $dateControl.datepicker({
                //defaultDate: date,
                dateFormat: dateFormat,
                changeMonth: true,
                changeYear: true,
                numberOfMonths: 1,
                yearRange: "-100:+0",
                onSelect: function (dateText, inst) {
                    if (dateText) {
                        var date = new Date((inst.currentMonth + 1) + "/" + (inst.currentDay) + "/" + (inst.currentYear));
                        var value = bizagi.util.dateFormatter.formatInvariant(date, false);
                        self.update({ value: value });
                        self.enableButton("filter");
                    }
                }
            });
        },

        /**
         * Configure the datetime control
         */
        buildBooleanFilter: function ($filter) {
            var self = this;
            var data = self.options.data || {};
            var templates = self.options.templates;

            var $control = $filter.find("#biz-column-filter-control");
            $control.append($.tmpl(templates.filterBoolean, { value: data.value }));

            $control.optiongroup();

            if (data && data.value !== undefined) {
                $control.optiongroup("setValue", data.value.toString());
            }

            // Bind change event
            $control.on("optiongroupchange", function (evt, ui) {
                var value = bizagi.util.parseBoolean(ui.value);
                self.update({ value: value });
            });

        },

        /**
         * Configure the number control
         */
        buildIntegerFilter: function ($filter) {
            var self = this;
            var data = self.options.data || {};
            var templates = self.options.templates;

            var $control = $filter.find("#biz-column-filter-control");
            $control.append($.tmpl(templates.filterNumber, {
                value: data.value || 0,
                title: self.validateLimitsNumbersByType(self.options.type).message
            }));

            var $input = $control.find("input");
            $input.numeric();
            var numericFormat = bizagi.clone(bizagi.localization.getResource("numericFormat"));

            $input.formatCurrency($.extend(numericFormat, { symbol: "", decimalDigits: 0, roundToDecimalPlace: -1 }));

            var updateValue = function () {
                var value = $input.val(),
                    regexString = "/[" + numericFormat.digitGroupSymbol + "]/g",
                    regex = eval(regexString);

                value = value.replace(regex, "");

                var auxInput = $("<input>").attr({
                    type: "text",
                    value: value
                });

                //validate number and set max value if it exceeds limits
                var validationNumber = self.validateLimitsNumbersByType(self.options.type, auxInput.asNumber());
                if(!validationNumber.result && value !== 0){
                    value = validationNumber.maxValue * validationNumber.sign;
                    $input.val(value);
                }

                if (value.length === 0) {
                    value = null;
                }
                self.update({ value: parseInt(value, 10) });
            };

            $.proxy(self.configureHandlerInputTypeText($input, $filter, data, updateValue), self);
        },


        /**
         * Configure the number control
         */
        buildNumberFilter: function ($filter) {
            var self = this;
            var data = self.options.data || {};
            var templates = self.options.templates;

            var $control = $filter.find("#biz-column-filter-control");
            $control.append($.tmpl(templates.filterNumber, {
                value: data.value || 0,
                title: self.validateLimitsNumbersByType(self.options.type).message
            }));

            var $input = $control.find("input");
            $input.numeric(bizagi.currentUser.decimalSeparator);

            var numericFormat = bizagi.clone(bizagi.localization.getResource("numericFormat"));

            $input.formatCurrency($.extend(numericFormat, { symbol: "" }));

            var updateValue = function () {
                var value = $input.val(),
                    regexString = "/[" + numericFormat.digitGroupSymbol + "]/g",
                    regex = eval(regexString);

                value = value.replace(regex, "");

                var auxInput = $("<input>").attr({
                    type: "text",
                    value: value.replace(",", ".")
                });

                //validate number and set max value if it exceeds limits
                var validationNumber = self.validateLimitsNumbersByType(self.options.type, auxInput.asNumber());
                if(!validationNumber.result && value !== 0){
                    value = validationNumber.maxValue * validationNumber.sign;
                    $input.val(value);
                }

                if (value.length === 0) {
                    value = null;
                }
                self.update({ value: parseFloat(value.toString().replace(",", ".")) });
            };

            $.proxy(self.configureHandlerInputTypeText($input, $filter, data, updateValue), self);
        },

        /**
         * Configure the text control
         */
        buildTextFilter: function ($filter) {
            var self = this;
            var data = self.options.data || {};
            var templates = self.options.templates;

            var $control = $filter.find("#biz-column-filter-control");
            $control.append($.tmpl(templates.filterString, { value: data.value }));

            var $input = $control.find("input");

            var updateValue = function () {
                var value = $input.val();
                if (value.length === 0) {
                    value = null;
                }
                self.update({ value: value });
            };

            self.configureHandlerInputTypeText($input, $filter, data, updateValue);
        },

        /**
         * Configure the text control extended
         */
        buildTextExtendedFilter: function ($filter) {
            //This method is necessary because is necessary a new method for each new type
            var self = this;
            self.buildTextFilter($filter);
        },

        /**
         *   trigger a callback/event
         */
        update: function (newValue) {
            var self = this;
            var data = self.options.data;

            $.extend(data, newValue);
        },

        /**
         * returns an array of operators availables for the current type
         */
        getOperators: function () {
            var self = this;
            var operators = self.options.operators;
            var filterType = self.filterType;
            var result = [];

            for (var oper in operators) {
                var operator = operators[oper];
                if ($.inArray(filterType, operator.appliesTo) >= 0) {
                    result.push({
                        displayName: bizagi.localization.getResource(operator.label),
                        id: oper
                    });
                }
            }

            return result;
        },

        /**
         * Returns current operator
         */
        getOperator: function (item) {
            var self = this;
            var operators = self.options.operators;

            return operators[item].operator;
        },

        /**
         * Configure handlers input type text
         * @param $input
         */
        configureHandlerInputTypeText: function($input, $filter, data, updateValue){
            var self = this;
            $input.focus();

            $input.keyup(function (ev) {
                if($input.val().trim().length > 0){
                    self.enableButton("filter");
                    if (ev.which == 13) {
                        updateValue();
                        self._trigger("change", "", data);
                        $filter.remove();
                    }
                }
                else{
                    self.disableButton("filter");
                }
            });

            $input.change(function () {
                if($input.val().length > 0) {
                    updateValue();
                }
            });

            if($input.val().trim().length > 0){
                self.enableButton("filter");
            }
            else{
                self.disableButton("filter");
            }

        },

        /**
         * Hide or show the control, according to type of operator
         */
        setControlVisibility: function (operator) {
            var self = this;
            var operators = self.options.operators;
            var $control = self.$filter.find("#biz-column-filter-control");

            if (operators[operator]) {
                var isUnary = (operators[operator].isUnary === undefined) ? false : operators[operator].isUnary;
                (isUnary) ? $control.hide() : $control.show();
            }
        },

        /**
         * Disable button
         */
        disableButton: function (which) {
            var self = this;
            var buttons = self.$filter.find("#biz-column-filter-buttons  > .ui-bizagi-filter-buttons > button");

            if (which == "filter") {
                $(buttons[0]).attr("disabled", "disabled").addClass("ui-state-disabled");

            }
            else if (which == "clear") {
                $(buttons[1]).attr("disabled", "disabled").addClass("ui-state-disabled");
            }
        },

        /**
         * Enable button
         */
        enableButton: function (which) {
            var self = this;
            var buttons = self.$filter.find("#biz-column-filter-buttons  > .ui-bizagi-filter-buttons > button");

            if (which == "filter") {
                $(buttons[0]).prop("disabled", false).removeClass("ui-state-disabled");

            }
            else if (which == "clear") {
                $(buttons[1]).prop("disabled", false).removeClass("ui-state-disabled");
            }
        }
    });
})(jQuery);