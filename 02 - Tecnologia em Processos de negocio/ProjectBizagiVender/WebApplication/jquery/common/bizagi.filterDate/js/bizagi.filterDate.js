/*
 Document   : bizagi.filterDate
 Created on : May 21, 2015, 8:24:00 AM
 Author     : Andres Felipe Arenas Vargas
 Description: This script will define a base class to handle the filter of a date control
 */
(function($) {

    $.widget('filter.dateFilter', {
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
            var attribute = self.options.properties.attribute;

            self.returnObject = [
                {
                    properties: {
                        xpath: attribute + '@from',
                        type: 'date',
                        typeSearch: 'range',
                        rangeQuery: 'from'
                    }
                },
                {
                    properties: {
                        xpath: attribute + '@to',
                        type: 'date',
                        typeSearch: 'range',
                        rangeQuery: 'to'
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
                    if($(this).text() == options.getResource('workportal-general-button-label-apply')){
                        self._setValuesOfReturnObject();
                        self._setDisplayTitle(false);
                        options.onApply(self.returnObject, self.element);
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
                    from: {
                        name: options.getResource('bz-rp-components-time-from-label'),
                        type: 'text',
                        className: 'ui-bizagi-date-filter-from'
                    },
                    to: {
                        name: options.getResource('bz-rp-components-time-to-label'),
                        type: 'text',
                        className: 'ui-bizagi-date-filter-to'
                    },
                    buttons: {
                        type: 'contextMenuButtons' // Self structure - see _bindContextMenuButtons
                    }
                },
                events: {
                    show: function() {
                        self._disableApply();
                        self._setDisplayLabels();
                    },
                    hide: function() {
                        self._getFromControl().datepicker('hide');
                        self._getToControl().datepicker('hide');
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
        _bindHandlers: function (){
            var self = this;
            var $minDate = self._getFromControl();
            var $maxDate = self._getToControl();
            var minDate = new Date(self._getDateFromInvariant(self.options.properties.data.min));
            var maxDate = new Date(self._getDateFromInvariant(self.options.properties.data.max));
            var dateFormat = bizagi.util.dateFormatter.getDateFormatByDatePickerJqueryUI().toLowerCase();

            $minDate.datepicker({
                defaultDate: minDate,
                dateFormat: dateFormat,
                changeMonth: true,
                changeYear: true,
                numberOfMonths: 1,
                yearRange: '-100:+0',
                minDate: minDate,
                maxDate: maxDate,
                onClose: function(selectedDate) {
                    if(selectedDate) {
                        $maxDate.datepicker('option', 'minDate', selectedDate);
                        if($maxDate.datepicker("getDate")){
                            self._enableApply();
                        }
                    }
                    else{
                        self._disableApply();
                    }
                }
            });
            $maxDate.datepicker({
                defaultDate: maxDate,
                dateFormat: dateFormat,
                changeMonth: true,
                changeYear: true,
                numberOfMonths: 1,
                yearRange: '-100:+0',
                minDate: minDate,
                maxDate: maxDate,
                onSelect: function(selectedDate) {
                    if(selectedDate) {
                        $minDate.datepicker('option', 'maxDate', selectedDate);
                        if($minDate.datepicker("getDate")){
                            self._enableApply();
                        }
                    }
                    else{
                        self._disableApply();
                    }
                }
            });
        },

        /**
         *
         * @private
         */
        _resetValues: function (){
            var self = this;

            self._getFromControl().datepicker("setDate", null);
            self._getToControl().datepicker("setDate", null);
            self._setReturnObject();
            self._disableApply();
        },

        /**
         *
         * @private
         */
        _setValuesOfReturnObject: function (){
            var self = this;
            var minDate = self._getFromControl().datepicker("getDate"); //returns null when there is no date
            var maxDate = self._getToControl().datepicker("getDate"); //returns null when there is no date
            var dateFormatter = bizagi.util.dateFormatter;

            self.returnObject[0].value = (minDate !== null) ? dateFormatter.formatInvariant(minDate, false) : dateFormatter.formatInvariant(maxDate, false);
            self.returnObject[1].value = (maxDate !== null) ? dateFormatter.formatInvariant(maxDate, false) : dateFormatter.formatInvariant(minDate, false);
        },

        /**
         *
         * @param toDefault
         * @private
         */
        _setDisplayTitle: function (toDefault) {
            var self = this;
            var $displayTitleControl = $('.wgd-my-search-filter-pluggin span', self.element);
            var displayTitle = $displayTitleControl.text().split(':');

            if (toDefault) {
                self.filterValue = "";
                $displayTitleControl.text(displayTitle[0]);
            }
            else {
                var options = self.options;
                var minDateObj = self._getDateFromInvariant(self.returnObject[0].value);
                var maxDateObj = self._getDateFromInvariant(self.returnObject[1].value);

                self.filterValue =
                    self._formatDate(minDateObj, options.getResource("dateFormat")) + ' ' +
                    options.getResource('bz-rp-components-time-to-label') + ' ' +
                    self._formatDate(maxDateObj, options.getResource("dateFormat"));
                $displayTitleControl.text(displayTitle[0] + ': ' + self.filterValue);
            }

            $(".wgd-my-search-filter-pluggin .remove-filter", self.element).show();
        },

        /**
         *
         * @private
         */
        _setDisplayLabels: function (){
            var self = this;
            var options = self.options;
            var minDateObj = self._getDateFromInvariant(self.options.properties.data.min);
            var maxDateObj = self._getDateFromInvariant(self.options.properties.data.max);

            $('.ui-bizagi-date-filter-from span', self.$menuContext).text(
                options.getResource('bz-rp-components-time-from-label') + ' (' + self._formatDate(minDateObj, options.getResource("dateFormat")) + '):'
            );
            $('.ui-bizagi-date-filter-to span',  self.$menuContext).text(
                options.getResource('bz-rp-components-time-to-label') + ' (' + self._formatDate(maxDateObj, options.getResource("dateFormat")) + '):'
            );
        },

        /**
         *
         * @private
         */
        _enableApply: function () {
            var self = this;
            var $applyControl = $('#ui-bizagi-apply-filter', self.$menuContext);

            $applyControl.removeAttr('disabled');
            $applyControl.removeClass('ui-state-disabled');
        },

        /**
         *
         * @private
         */
        _disableApply: function () {
            var self = this;
            var $applyControl = $('#ui-bizagi-apply-filter', self.$menuContext);

            $applyControl.attr('disabled', 'disabled');
            $applyControl.addClass('ui-state-disabled');
        },

        /**
         *
         * @param dateObj
         * @param dateFormat
         * @private
         */
        _formatDate: function (dateObj, dateFormat) {
            return bizagi.util.dateFormatter.formatDate(dateObj, dateFormat);
        },

        /**
         *
         * @returns {*|HTMLElement}
         * @private
         */
        _getFromControl: function () {
            var self = this;
            return $('.ui-bizagi-date-filter-from input', self.$menuContext);
        },

        /**
         *
         * @returns {*|HTMLElement}
         * @private
         */
        _getToControl: function () {
            var self = this;
            return $('.ui-bizagi-date-filter-to input', self.$menuContext);
        },

        /**
         *
         * @param date
         * @param date
         * @private
         */
        _getDateFromInvariant: function (date) {
            return bizagi.util.dateFormatter.getDateFromInvariant(date);
        },

        /**
         *
         * @private
         */
        _removeFilter: function (){
            var self = this;
            self.options.onClear([self.returnObject[0].properties.xpath, self.returnObject[1].properties.xpath]);
            self._setDisplayTitle(true);
            self._resetValues();

            $(".wgd-my-search-filter-pluggin .remove-filter", self.element).hide();
        },

        /**
         *
         * @param data
         */
        setData: function(data){
            var self = this;
            self.options.properties.data = (Object.getOwnPropertyNames(data).length === 0) ? self.options.properties.data : data;

            var $minDate = self._getFromControl();
            var $maxDate = self._getToControl();
            var minDate = new Date(self._getDateFromInvariant(self.options.properties.data.min));
            var maxDate = new Date(self._getDateFromInvariant(self.options.properties.data.max));

            $minDate.datepicker('option', 'minDate', minDate);
            $minDate.datepicker('option', 'maxDate', maxDate);
            $maxDate.datepicker('option', 'minDate', minDate);
            $maxDate.datepicker('option', 'maxDate', maxDate);
        },

        /**
         *
         */
        destroy: function() {
            $(this.element).contextMenu("destroy");
            $.Widget.prototype.destroy.call(this);
        }
    });
})(jQuery);