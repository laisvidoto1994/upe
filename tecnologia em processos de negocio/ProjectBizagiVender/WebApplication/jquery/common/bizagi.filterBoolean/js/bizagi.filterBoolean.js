/**
 * Filter multiple plugin creates a tooltip control to show related entity information and select multiple values
 *
 * @author Andr�s Fernando Mu�oz
 */
(function($) {

    $.widget('filter.booleanFilter', {
        options: {
            showButtonClearFilter: false,
            properties: {},
            onApply: function (data) {},
            onClear: function (xpath) {},
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
            self.returnObject =
            {
                properties: {
                    xpath: self.options.properties.attribute,
                    type: "boolean",
                    typeSearch: "exact"
                },
                value: []
            };
        },

        /**
         *
         * @private
         */
        _bindContextMenuButtons: function () {
            var self = this;
            var options = self.options;

            $.contextMenu.types.container = function (item, opt, root) {
                $('<div id="'+item.id+'" class="menu-container"></div>').appendTo(this);
            };

            $.contextMenu.types.contextMenuButtons = function(item, opt, root) {
                self.$menuContext = root.$menu;
                var htmlButtons = '<div class="ui-bizagi-filter-buttons">';
                htmlButtons += '<button id="ui-bizagi-cancel-filter" class="bz-wp-btn bz-wp-btn-link type="button">' + options.getResource('workportal-general-button-label-cancel') + '</button>';
                htmlButtons += '<button id="ui-bizagi-apply-filter" class="bz-wp-btn bz-wp-btn-primary" type="button" disabled>' + options.getResource('workportal-general-button-label-apply') + '</button>';
                htmlButtons += '<div>';

                $(htmlButtons).appendTo(this).on('click', 'button', function() {
                    if ($(this).text() == options.getResource('workportal-general-button-label-apply')) {
                        self._addFilterToDisplayName();
                        options.onApply([self.returnObject], self.element);
                    }
                    root.$menu.trigger('contextmenu:hide');// hide the menu
                });
            };
        },

        /**
         *
         * @returns {{}}
         * @private
         */
        _buildContextMenuItems: function () {
            var self = this;
            var options = self.options;
            var items = {};

            if(self.options.showButtonClearFilter !== true){
                items['key'] = {
                    name: options.getResource('workportal-my-search-remove-filter'),
                    className: 'ui-bizagi-clear-filters',
                    callback: function() {
                        self._removeFilter();
                        return true;// False -> To keep the context menu open
                    }};
            }
            items['container'] = {
                'id': 'checks_container',
                type: 'container'
            };
            items['buttons'] = {
                type: "contextMenuButtons"
            };

            return items;
        },

        /**
         *
         * @private
         */
        _bindContextMenu: function () {
            var self = this;
            var $opener = $(self.element);
            var id = '#' + $('.wgd-my-search-filter-pluggin', $opener).attr('id');
            var items = self._buildContextMenuItems();

            $opener.on('click', function(event) {
                if($(event.target).hasClass("remove-filter") && $(".wgd-my-search-filter-pluggin .remove-filter", self.element).is(":visible")){
                    self._removeFilter();
                }
                else{
                    $(id).contextMenu();
                }
            });

            $opener.contextMenu({
                selector: id,
                trigger: 'none',
                items: items,
                events: {
                    show: function() {
                        self._disableApply();
                        var div = $('#checks_container', self.$menuContext);
                        div.empty();
                        return $.when(self.options.setData()).done(function (data) {
                            var data = typeof data !== 'undefined' ? data.defaultValues : self.options.data.defaultValues;
                            var i = -1, a;

                            while(a = data[++i]){
                                var id = (self.returnObject.value === a.id);
                                if(a.id != '' && a.displayName != '') {
                                    div.append('<li><input data-displayname="' + a.displayName + '" type="radio" name="boolFilter" value="' + a.id + '" ' + (id ? 'checked' : '') + '><span class="context-menu-item-label-check">' + self.parseBoolean(a.displayName) + '</span></li>');
                                }
                            }
                            self._bindHandlers();
                        });
                    },
                    hide: function() {
                    }
                }
            });

        },

        /**
         *
         * @private
         */
        _bindTooltip: function (){
            var self = this;
            self.filterValue = self.filterValue || [];
            $(self.element).tooltip({
                items: "#" + $("div", self.element).attr("id"),
                content: function () {
                    if(self.filterValue.length !== 0){
                        var $container = $("<div>");
                        $.each(self.filterValue, function( index, value ) {
                            $container.append($('<div><label>' + self.parseBoolean(value) + '</label></div>'));
                        });
                        return $container;
                    }
                    else{
                        return "";
                    }
                }
            });
        },

        parseBoolean: function(value){
            var valueToLocalize = bizagi.clone(value);
            switch(valueToLocalize.toLowerCase()){
                case "not specified":
                    valueToLocalize = bizagi.localization.getResource("workportal-general-value-undefined");
                    break;
                default:
                    valueToLocalize = bizagi.util.formatBoolean(valueToLocalize);
                    break;
            }
            return valueToLocalize;
        },

        /**
         *
         * @private
         */
        _bindHandlers: function () {
            var self = this;

            $('input:radio', self.$menuContext).on('click', function (ev){
                ev.stopImmediatePropagation(); //stopping jquery click event handler to be call twice for a checkbox
                var $target = $(ev.target);

                self.returnObject.value = $target.attr("value");
                self._enableApply();
            });

        },

        /**
         *
         * @private
         */
        _resetValue: function (){
            var self = this;
            self.returnObject.value = [];
        },

        /**
         *
         * @private
         */
        _addFilterToDisplayName: function () {
            var self = this;
            var $displayNameControl = $('.wgd-my-search-filter-pluggin span', self.element);
            var displayText = $displayNameControl.text().split(':');
            var filtersText = displayText[0] + ': ';
            self.filterValue = [];

            $("input:checked", self.$menuContext).each(function () {
                self.filterValue.push($(this).data("displayname"));
                filtersText = filtersText + self.parseBoolean($(this).data('displayname'));
            });

            $displayNameControl.text(filtersText);

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

            self.filterValue = [];
            $displayNameControl.text(displayName[0]);
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
        _removeFilter: function (){
            var self = this;
            var xpath = self.returnObject.properties.xpath;
            self.options.onClear([xpath]);
            self._setDisplayNameToDefault();
            self._resetValue();

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
         *
         */
        destroy: function() {
            $(this.element).contextMenu("destroy");
            $.Widget.prototype.destroy.call(this);
        }
    });
})(jQuery);