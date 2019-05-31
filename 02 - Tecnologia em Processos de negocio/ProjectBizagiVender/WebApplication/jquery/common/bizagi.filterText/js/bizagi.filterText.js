/*
 Document   : bizagi.filterMoney
 Created on : May 21, 2015, 8:24:00 AM
 Author     : Andr�s Felipe Arenas Vargas
 Description: This script will define a base class to handle the filter of a money control
 */
(function($) {

    $.widget('filter.textFilter', {
        options: {
            showButtonClearFilter: false,
            properties: {},
            onApply: function (data) {},
            onClear: function (xpath) {}
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
                        self._setValue();
                        self._setFilterToDisplayName();
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
            var $opener = $('.wgd-my-search-filter-pluggin', self.element);
            var id = '#' + $opener.attr('id');

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
                    key: {name: options.getResource('workportal-my-search-remove-filter'), className: 'ui-bizagi-clear-filters',
                        callback: function() {
                            self._removeFilter();

                            return true;// False -> To keep the context menu open
                        }
                    },
                    min: {name: options.getResource('workportal-my-search-text'), type: 'text', className: 'ui-bizagi-text-filter'},
                    buttons: {type: 'contextMenuButtons'}
                },
                events: {
                    show: function() {
                        self._disableApply();
                    },
                    hide: function() {
                    }
                }
            };

            if(self.options.showButtonClearFilter === true){
                paramsContextMenu.items.key = undefined;
            }

            $(self.element).contextMenu(paramsContextMenu);

        },

        /**
         *
         * @returns {*|HTMLElement}
         * @private
         */
        _getTextControl: function () {
            var self = this;

            return $('.ui-bizagi-text-filter input', self.$menuContext);
        },

        /**
         *
         * @private
         */
        _bindHandlers: function (){
            var self = this;

            self._getTextControl().keyup( function () {
                if($(this).val() && $(this).val().indexOf(' ') != 0)
                    self._enableApply();
                else
                    self._disableApply();
            });
        },

        /**
         *
         * @private
         */
        _setReturnObject: function () {
            var self = this;
            self.returnObject = {
                'properties': {
                    'xpath': self.options.properties.attribute,
                    'type': 'text',
                    'typeSearch': 'approx'
                }
            };
        },

        /**
         *
         * @private
         */
        _resetValue: function (){
            var self = this;

            self._setReturnObject();
            self._disableApply();
            self._getTextControl().val('');
        },

        /**
         *
         * @private
         */
        _setValue: function (){
            var self = this;
            var textValue = self._getTextControl().val();

            if (textValue){
                self.returnObject.value = textValue;
            }
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
         * @private
         */
        _setFilterToDisplayName: function () {
            var self = this;
            var $displayNameControl = $('.wgd-my-search-filter-pluggin span', self.element);
            var displayName = $displayNameControl.text().split(':');

            $displayNameControl.text(displayName[0] + ': ' + self.returnObject.value);

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

            $displayNameControl.text(displayName[0]);
        },

        /**
         *
         * @private
         */
        _removeFilter: function (){
            var self = this;
            self._resetValue();
            var xpaths = [self.returnObject.properties.xpath];
            self._setDisplayNameToDefault();
            self.options.onClear(xpaths);
            $(".wgd-my-search-filter-pluggin .remove-filter", self.element).hide();
        },


        /**
         *
         * @param data
         */
        setData: function(data){
            console.log(data);
        },

        /**
         *
         */
        destroy: function () {
            $(this.element).contextMenu( 'destroy' );
            $.Widget.prototype.destroy.call(this);
        }
    });
})(jQuery);