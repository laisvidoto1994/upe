/*
 Document   : bizagi.filterNumber
 Created on : May 21, 2015, 8:24:00 AM
 Author     : Andres Felipe Arenas Vargas
 Description: This script will define a base class to handle the filter of a number control
 */
(function($) {

    $.widget('filter.number', {
        options: {
            showButtonClearFilter: false,
            properties: {},
            onApply: function (data) {},
            onClear: function (xpaths) {},
            setData: function (){}
        },

        /**
         *
         * @private
         */
        _create: function() {
            var self = this;
            self.numericFormat = bizagi.clone(bizagi.localization.getResource("numericFormat"));

            self._addButtonClearFilter();
            self._setReturnObject();
            self._bindContextMenuButtons();
            self._bindContextMenu();
            self._bindTooltip();
            self._bindHandlers();
        },

        /**
         *
         * @private
         */
        _addButtonClearFilter: function () {
            var self = this;
            if(self.options.showButtonClearFilter){
                var btnRemoveFilter = "<i class='bz-icon bz-icon-10 bz-icon-close-outline bz-wp-btn-icon-hover-effect remove-filter' title='" +
                    bizagi.localization.getResource("workportal-my-search-remove-filter") + "' style='display:none;'></i>";
                $(".wgd-my-search-filter-pluggin", self.element).append(btnRemoveFilter);
            }
        },

        /**
         *
         * @private
         */
        _setReturnObject: function () {
            var self = this;

            self.returnObject = [
                {
                    properties: {
                        xpath: self.options.properties.attribute + "@from",
                        type: "number",
                        typeSearch: "range",
                        rangeQuery: "from"
                    }
                },
                {
                    properties: {
                        xpath: self.options.properties.attribute + "@to",
                        type: "number",
                        typeSearch: "range",
                        rangeQuery: "to"
                    }
                }
            ];
        },

        /**
         *
         * @private
         */
        _bindContextMenuButtons: function () {
            var self = this;
            var options = self.options;

            $.contextMenu.types.contextMenuButtons = function(item, opt, root) {
                self.$menuContext = root.$menu;
                var htmlButtons = '<div class="ui-bizagi-filter-buttons">';
                htmlButtons += '<button id="ui-bizagi-cancel-filter" class="bz-wp-btn bz-wp-btn-link" type="button">' + options.getResource('workportal-general-button-label-cancel') + '</button>';
                htmlButtons += '<button id="ui-bizagi-apply-filter" class="bz-wp-btn bz-wp-btn-primary" type="button">' + options.getResource('workportal-general-button-label-apply') + '</button>';
                htmlButtons += '<div>';

                $(htmlButtons).appendTo(this).on('click', 'button', function() {
                    if ($(this).text() == options.getResource('workportal-general-button-label-apply')) {
                        self._setValue();
                        self._addFilterToDisplayName();
                        options.onApply(self.returnObject);
                    }
                    root.$menu.trigger('contextmenu:hide');// hide the menu
                });
            };
        },

        /**
         *
         * @private
         */
        _bindContextMenu: function () {
            var self = this;
            var options = self.options;
            var $opener = $(self.element);
            var id = '#' + $('.wgd-my-search-filter-pluggin', $opener).attr('id');

            $opener.on('click', function(event) {
                if($(event.target).hasClass("remove-filter") && $(".wgd-my-search-filter-pluggin .remove-filter", self.element).is(":visible")){
                    self._removeFilter();
                }
                else{
                    $(id).contextMenu();
                }
            });

            var paramsContextMenu = {
                selector: id,
                trigger: 'none',
                items: {
                    key: {
                        name: options.getResource('workportal-my-search-remove-filter'),
                        className: 'ui-bizagi-clear-filters',
                        callback: function() {
                            self._removeFilter();

                            return true;// False -> To keep the context menu open
                        }
                    },
                    min: {
                        name: options.getResource('bz-rp-components-time-from-label'),
                        type: 'text',
                        className: 'ui-bizagi-number-filter-min'
                    },
                    max: {
                        name: options.getResource('bz-rp-components-time-to-label'),
                        type: 'text',
                        className: 'ui-bizagi-number-filter-max'
                    },
                    notification: {
                        name: options.getResource('workportal-my-search-limit-notification'),
                        className: 'ui-bizagi-number-filter-notification'
                    },
                    buttons: {
                        type: 'contextMenuButtons' // Self structure - see _bindContextMenuButtons
                    }
                },
                events: {
                    show: function() {
                        return $.when(self.options.setData()).done(function (data) {
                            var $input = $('<input type="text">');
                            self.options.data = (typeof data !== 'undefined') ? data : self.options.data;

                            $input.val(self.options.data.min);
                            $input.formatCurrency(self._getFormatOptions());
                            $(".ui-bizagi-number-filter-min span", self.$menuContext).html(options.getResource('bz-rp-components-time-from-label') + " (<span class='select-value'>" +  $input.val() + "</span>):");

                            $input.val(self.options.data.max);
                            $input.formatCurrency(self._getFormatOptions());
                            $(".ui-bizagi-number-filter-max span", self.$menuContext).html(options.getResource('bz-rp-components-time-to-label') + " (<span class='select-value'>" +  $input.val() + "</span>):");

                            self._enableNotification(false);

                            var $minValue = $('.ui-bizagi-number-filter-min .select-value', self.$menuContext);
                            var $maxValue = $('.ui-bizagi-number-filter-max .select-value', self.$menuContext);
                            $minValue.on('click', $.proxy(self._onClickMinValue, self));
                            $maxValue.on('click', $.proxy(self._onClickMaxValue, self));

                        });
                    },
                    hide: function() {
                        self.removeHandlersValuesMinMax();
                    }
                }
            };

            if(self.options.showButtonClearFilter === true){
                paramsContextMenu.items.key = undefined;
            }

            $opener.contextMenu(paramsContextMenu);

        },

        /**
         *
         * @private
         */
        _bindTooltip: function (){
            var self = this;
            $(self.element).tooltip({
                items: "#" + $("div", self.element).attr("id"),
                content: function () {
                    return self.filterValue;
                }
            });
        },

        /**
         *
         * @private
         */
        _setDisplayValue: function (){
            var self = this;
            var min = (typeof(self.returnObject[0].value) === "undefined") ? "" : self.returnObject[0].value ;
            var max = (typeof(self.returnObject[1].value) === "undefined") ? "" : self.returnObject[1].value ;

            $('.ui-bizagi-number-filter-min input', self.$menuContext).val(min);
            $('.ui-bizagi-number-filter-max input', self.$menuContext).val(max);
            $('.ui-bizagi-number-filter-min input', self.$menuContext).formatCurrency(self._getFormatOptions());
            $('.ui-bizagi-number-filter-max input', self.$menuContext).formatCurrency(self._getFormatOptions());
        },

        /**
         *
         * @private
         */
        _setFormatValue: function($input){
            var self = this;

            var value = self._getObjectValueByString($input.val());

            if(value !== 0){
                $input.val(value);
                $input.formatCurrency(self._getFormatOptions());
            }
        },

        /**
         *
         * @private
         * @param stringValue
         * @return {*}
         * @param asFloatType
         */
        _getObjectValueByString: function(stringValue, asFloatType){
            var self = this;

            var value = stringValue,
                regexString = "/[" + self.numericFormat.symbol + self.numericFormat.digitGroupSymbol + "]/g",
                regex = eval(regexString);

            value = value.replace(regex, "");
            if(asFloatType){
                value = value.replace(",", ".");
                value = parseFloat(value);
            }

            return value;
        },

        /**
         *
         * @private
         */
        _addFilterToDisplayName: function () {
            var self = this;
            var minVal = $('.ui-bizagi-number-filter-min input', self.$menuContext).val();
            var maxVal = $('.ui-bizagi-number-filter-max input', self.$menuContext).val();
            var $displayNameControl = $('.wgd-my-search-filter-pluggin span', self.element);
            var displayName = $displayNameControl.text().split(':');

            self.filterValue =  minVal + ' ' + self.options.getResource('bz-rp-components-time-to-label') + ' ' + maxVal;
            $displayNameControl.text(displayName[0] + ': ' + self.filterValue);

            $(".wgd-my-search-filter-pluggin .remove-filter", self.element).show();
        },

        /**
         *
         * @private
         */
        _setDisplayNameToDefault: function () {
            var self = this;
            var $displayNameControl = $('.wgd-my-search-filter-pluggin span', self.element);
            var displayName = $displayNameControl.text().split(':');

            self.filterValue = "";
            $displayNameControl.text(displayName[0]);
        },

        /**
         *
         * @private
         */
        _setValue: function () {
            var self = this;
            var minVal = self._getObjectValueByString($(".ui-bizagi-number-filter-min input", self.$menuContext).val(), true);
            var maxVal = self._getObjectValueByString($(".ui-bizagi-number-filter-max input", self.$menuContext).val(), true);

            self.returnObject[0].value = (minVal === '') ? maxVal : minVal;
            self.returnObject[1].value = (maxVal === '') ? minVal : maxVal;
        },

        /**
         *
         * @private
         */
        _resetValue: function () {
            var self = this;

            self._setReturnObject();
            $('.ui-bizagi-number-filter-min input', self.$menuContext).val('');
            $('.ui-bizagi-number-filter-max input', self.$menuContext).val('');
        },

        /**
         *
         * @private
         */
        _bindHandlers: function (){
            var self = this;
            var options = self.options;
            var $minControl = $('.ui-bizagi-number-filter-min input', self.$menuContext);
            var $maxControl = $('.ui-bizagi-number-filter-max input', self.$menuContext);


            $minControl.keyup(function() {
                if ($(this).val()) {
                    var maxVal = self._getObjectValueByString($(".ui-bizagi-number-filter-max input", self.$menuContext).val(), true);
                    var minVal = self._getObjectValueByString($(this).val(), true);
                    var isLowerLimitInvalid = isNaN(minVal) ? true : minVal < parseFloat(options.data.min);
                    var isUpperLimitInvalid = isNaN(maxVal) ? true : maxVal > parseFloat(options.data.max);
                    var isRangeInvalid = minVal > maxVal;

                    self._checkNotification(isLowerLimitInvalid, isUpperLimitInvalid, isRangeInvalid);
                    self._setFormatValue($(this));
                }
            });

            $maxControl.keyup(function() {
                if ($(this).val()) {
                    var maxVal = self._getObjectValueByString($(this).val(), true);
                    var minVal = self._getObjectValueByString($(".ui-bizagi-number-filter-min input", self.$menuContext).val(), true);
                    var isLowerLimitInvalid = isNaN(minVal) ? true : minVal < parseFloat(options.data.min);
                    var isUpperLimitInvalid = isNaN(maxVal) ? true : maxVal > parseFloat(options.data.max);
                    var isRangeInvalid = minVal > maxVal;

                    self._checkNotification(isLowerLimitInvalid, isUpperLimitInvalid, isRangeInvalid);
                    self._setFormatValue($(this));
                }
            });
        },

        /**
         *
         * @private
         * @param event
         */
        _onClickMinValue: function(event){
            var self = this;
            var $minControl = $('.ui-bizagi-number-filter-min input', self.$menuContext);
            $minControl.val($(event.target).text());
            $minControl.keyup();
        },

        /**
         *
         * @param event
         * @private
         */
        _onClickMaxValue: function(event){
            var self = this;
            var $maxControl = $('.ui-bizagi-number-filter-max input', self.$menuContext);
            $maxControl.val($(event.target).text());
            $maxControl.keyup();
        },

        /**
         *
         * @param isLowerLimitInvalid
         * @param isUpperLimitInvalid
         * @param isRangeInvalid
         * @private
         */
        _checkNotification: function (isLowerLimitInvalid, isUpperLimitInvalid, isRangeInvalid) {
            var self = this;
            var options = self.options;

            if ((isRangeInvalid || isLowerLimitInvalid || isUpperLimitInvalid)){
                var notification = options.getResource('workportal-my-search-limit-notification');
                if (isLowerLimitInvalid) {
                    notification = options.getResource('workportal-my-search-lower-limit-notification');
                }
                else if(isUpperLimitInvalid) {
                    notification = options.getResource('workportal-my-search-upper-limit-notification');
                }
                else if (isRangeInvalid) {
                    notification = options.getResource('workportal-my-search-max-min-notification');
                }
                self._enableNotification(true, notification);
            }
            else{
                self._disableNotification();
            }
        },

        /**
         *
         * @param showLabel
         * @param notification
         * @private
         */
        _enableNotification: function (showLabel, notification) {
            var self = this;

            if(showLabel){
                $(".ui-bizagi-number-filter-notification span", self.$menuContext).text(notification);
                $(".ui-bizagi-number-filter-notification", self.$menuContext).show();
            }
            else{
                $(".ui-bizagi-number-filter-notification", self.$menuContext).hide();
            }
            $("#ui-bizagi-apply-filter", self.$menuContext).attr("disabled", "disabled");
            $("#ui-bizagi-apply-filter", self.$menuContext).addClass("ui-state-disabled");
        },

        /**
         *
         * @private
         */
        _disableNotification: function () {
            var self = this;

            $(".ui-bizagi-number-filter-notification", self.$menuContext).hide();
            $("#ui-bizagi-apply-filter", self.$menuContext).removeAttr("disabled");
            $("#ui-bizagi-apply-filter", self.$menuContext).removeClass("ui-state-disabled");
        },

        /**
         *
         * @returns {{symbol: string, roundToDecimalPlace: number, eventOnDecimalsEntered: boolean}}
         * @private
         */
        _getFormatOptions: function (){
            var self = this;
            return formatOptions = {
                symbol: '',
                roundToDecimalPlace: -1,
                eventOnDecimalsEntered: true,
                digitGroupSymbol: self.numericFormat.digitGroupSymbol,
                decimalSymbol: self.numericFormat.decimalSymbol
            };
        },

        /**
         *
         * @private
         */
        _removeFilter: function (){
            var self = this;
            self._resetValue();
            self._enableNotification(false);
            self._setDisplayNameToDefault();
            self.options.onClear([self.returnObject[0].properties.xpath, self.returnObject[1].properties.xpath]);
            $(".wgd-my-search-filter-pluggin .remove-filter", self.element).hide();
        },


        /**
         *
         * @param data
         */
        setData: function(data){
            var self = this;

            self.options.data = (Object.getOwnPropertyNames(data).length === 0) ? self.options.data : data;
        },


        /**
         * Remove min and max handlers
         */
        removeHandlersValuesMinMax: function(){
            var self = this;
            var $minValue = $('.ui-bizagi-number-filter-min .select-value', self.$menuContext);
            var $maxValue = $('.ui-bizagi-number-filter-max .select-value', self.$menuContext);
            $minValue.off('click', $.proxy(self._onClickMinValue, self));
            $maxValue.off('click', $.proxy(self._onClickMaxValue, self));
        },

        destroy: function() {
            var self = this;
            self.removeHandlersValuesMinMax();
            $(this.element).contextMenu("destroy");
            $.Widget.prototype.destroy.call(this);
        }
    });
})(jQuery);