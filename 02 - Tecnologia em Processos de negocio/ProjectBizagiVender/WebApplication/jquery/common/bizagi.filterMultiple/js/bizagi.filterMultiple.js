/**
 * Filter multiple plugin creates a tooltip control to show related entity information and select multiple values
 *
 * @author Andrés Fernando Muñoz
 */
(function($) {

    $.widget('filter.multiple', {
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
            self.isDefaultFilter = false;

            self._addButtonClearFilter();
            self._setReturnObject();
            self._bindContextMenuButtons();
            self._bindContextMenu();
            self._bindTooltip();
            self._bindDefaultFilter();
        },

        /**
         *
         * @private
         */
        _bindDefaultFilter: function () {
            var self = this;
            var data = self.options.data || [];
            var filtersText = ': ';
            var a, i = -1;

            while (a = data.defaultValues[++i]) {
                if (a.applied) {
                    self.isDefaultFilter = true;
                    self.returnObject.value.push({"id": a.id});
                    filtersText += a.displayName;
                }
            }

            if (self.isDefaultFilter) {
                var $displayNameControl = $('.wgd-my-search-filter-pluggin span', self.element);
                var displayText = $displayNameControl.text().split(':');

                $displayNameControl.text(displayText[0] + filtersText);
            }
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
            self.returnObject = {
                properties: {
                    xpath: self.options.properties.attribute,
                    type: "entity",
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
                        options.onApply([self.returnObject]);
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

            if(self.options.showButtonClearFilter !== true) {
                items["key"] = {
                    name: options.getResource("workportal-my-search-remove-filter"),
                    className: "ui-bizagi-clear-filters",
                    callback: function () {
                        self._removeFilter();
                        return true;// False -> To keep the context menu open
                    }
                };
            }
            items["container"] = {
                id: "checks_container_" + options.properties.attribute,
                type: "container"
            };
            items["buttons"] = {
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
            var options = self.options;
            var $opener = $(self.element);
            var id = "#" + $(".wgd-my-search-filter-pluggin", $opener).attr("id");
            var items = self._buildContextMenuItems();

            $opener.click(function(event) {
                if($(event.target).hasClass("remove-filter") && $(".wgd-my-search-filter-pluggin .remove-filter", self.element).is(":visible")){
                    self._removeFilter();
                }
                else{
                    $(id).contextMenu();
                }
            });

            $opener.contextMenu({
                selector: id,
                trigger: "none",
                items: items,
                events: {
                    show: function() {
                        var div = $("#checks_container_" + options.properties.attribute, self.$menuContext);

                        self._disableApply();
                        div.empty();

                        return $.when(options.setData()).done(function (data) {
                            var data = typeof data !== 'undefined' ? data.defaultValues : options.data.defaultValues;
                            var i = -1, a;

                            while (a = data[++i]) {
                                var id = self.returnObject.value.find(function (el) { return el.id == a.id; });
                                var checked = (id || a.applied ? "checked" : "");
                                if (a.id != '' && a.displayName != '' && (!self.isDefaultFilter || (self.isDefaultFilter && checked === "checked"))) {
                                    var checkbox = "<li>";
                                    checkbox += "<input data-displayname='" + a.displayName + "' type='checkbox' value='" + a.id + "'" + " " + checked + ">";
                                    checkbox += "<span class='context-menu-item-label-check'>" + a.displayName + "</span>";
                                    checkbox += "</li>";

                                    div.append(checkbox);
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
                            $container.append($("<div><label>" + value + "</label></div>"));
                        });
                        return $container;
                    }
                    else {
                        return "";
                    }
                }
            });
        },

        /**
         *
         * @private
         */
        _bindHandlers: function () {
            var self = this;

            $("input:checkbox", self.$menuContext).on("click", function (ev){
                ev.stopImmediatePropagation(); //stopping jquery click event handler to be call twice for a checkbox
                var $target = $(ev.target);
                var id = $target.attr("value");
                var isChecked = $target.is(':checked');

                if (isChecked) {
                    self.returnObject.value.push({"id": id});
                    self._enableApply();
                }
                else {
                    var val = self.returnObject.value.find(function (el) {return el.id == id;});
                    if (val) {
                        self.returnObject.value.splice(self.returnObject.value.indexOf(val), 1);
                    }
                    if (self.returnObject.value.length === 0) {
                        self._disableApply();
                    }
                    else {
                        self._enableApply();
                    }
                }
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
            var $displayNameControl = $(".wgd-my-search-filter-pluggin span", self.element);
            var displayText = $displayNameControl.text().split(":");
            var filtersText = displayText[0] + ": ";
            var cont = self.returnObject.value.length;
            self.filterValue = [];

            $("input:checked", self.$menuContext).each(function () {
                cont--;
                self.filterValue.push($(this).data("displayname"));
                filtersText = filtersText + $(this).data("displayname") + (cont == 0 ? '' : ", ");
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
            var $displayNameControl = $(".wgd-my-search-filter-pluggin span", self.element);
            var displayName = $displayNameControl.text().split(":");

            self.isDefaultFilter = false;
            self.filterValue = [];
            $displayNameControl.text(displayName[0]);
        },


        /**
         *
         * @private
         */
        _enableApply: function () {
            var self = this;
            var $applyControl = $("#ui-bizagi-apply-filter", self.$menuContext);

            $applyControl.removeAttr("disabled");
            $applyControl.removeClass("ui-state-disabled");
        },

        /**
         *
         * @private
         */
        _disableApply: function () {
            var self = this;
            var $applyControl = $("#ui-bizagi-apply-filter", self.$menuContext);

            $applyControl.attr("disabled", "disabled");
            $applyControl.addClass("ui-state-disabled");
        },

        /**
         *
         * @private
         */
        _removeFilter: function (){
            var self = this;
            self.options.onClear([self.returnObject.properties.xpath]);
            self._setDisplayNameToDefault();
            self._resetValue();
            $(".wgd-my-search-filter-pluggin .remove-filter", self.element).hide();
        },

        /**
         *
         * @param filterData
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