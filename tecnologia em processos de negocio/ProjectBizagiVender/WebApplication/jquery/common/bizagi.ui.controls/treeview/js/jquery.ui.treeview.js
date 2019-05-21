
/**
Plugin to create WorkPortal treeviews...

var options = {
data: {},
};

$('selector').uitreeview(options);

@class $.fn.uitreeview 
@constructor uitreeview
**/

/*
* jQuery UI MultiSelect @VERSION
* Author: David Romero
* Copyright (c) 2013 (http://www.bizagi.com)
*
* Depends:
*  ui.core.js
*/
(function ($) {

    $.widget('ui.treeview', {
        options: {
            list: [],
            defaults: [],
            _dataItems: [],
            _config: {
                _template: $.bizagi.ui.controls.uitreeview.tmpl,
                _cssClass: $.bizagi.ui.controls.uitreeview.css,
                _namespace: $.bizagi.ui.controls.uitreeview.namespace
            },
            SEARCH_MAX_LENGTH: 1
        },
        _create: function () {

            var self = this;
            var element = self.element;
            var css = self.options._config._cssClass;

            self.options._dataItems = [];

            if (self.options.defaults.length) self._setDefaults();

            element.addClass(css);

            self.loader = new bizagi.ui.controls.tmplloader();

            $.when(self.loader.loadTemplates(self._initializeTemplates())).done(function () {

                element.append(self._renderContent());
                self._eventHandlers();

            });
        },
        _eventHandlers: function () {

            var self = this, $items = $(".biz-ui-controls-tree-item", self.element);

            $items.on('click', ".biz-ui-controls-treeview-row:first-child", function (event) {

                var $element = $(this);
                var $target = $(event.target);

                if ($target.is('i.biz-ui-controls-treeview-subitems')) {

                    self._slideSubItems($element);

                } else {

                    if (!$target.is('input[type=checkbox]')) {

                        var $checkbox = $target.siblings("input[type=checkbox]");
                        ($checkbox.prop('checked')) ? $checkbox.prop('checked', false) : $checkbox.prop('checked', true);
                    }

                    $element.toggleClass("biz-ui-controls-uitreeview-items-active");
                    self._setValue($element);
                }

                event.stopPropagation();
            });
        },
        _slideSubItems: function ($element) {

            var $subitems = $element.siblings("ul");
            $subitems.slideToggle(300);
        },
        _setValue: function ($element) {

            var self = this;
            var dataItems = self.options._dataItems;
            var value = $element.data("value");
            var text = $element.data("text");

            if ($element.hasClass("biz-ui-controls-uitreeview-items-active")) {

                dataItems.push({ text: text, value: value });
            } else {

                var position = $.map(dataItems, function (obj, i) {
                    if (obj.value == value) { return i; }
                });

                dataItems.splice(position[0], 1);
            };

            self._trigger('checkItem');
        },
        getDataItems: function () {

            var self = this;
            return self.options._dataItems;
        },
        setList: function (list) {

            var self = this;
            self.options.list = list;
            self.options._dataItems = [];

            self._refresh();
        },
        getList: function () {

            var self = this;
            return self.options.list;
        },
        _refresh: function () {

            var self = this;

            self.element.empty().append(self._renderContent());
            self._eventHandlers();
        },
        _renderContent: function () {

            var self = this;
            var list = self.options.list;
            var itemsTemplate = self.loader.getTemplate("items");

            return $.tmpl(itemsTemplate, { list: list }, {
                itemValue: $.proxy(self._itemValue, self),
                itemText: $.proxy(self._itemText, self),
                renderSubItems: $.proxy(self._renderSubItems, self),
                setDefaults: $.proxy(self._setDefaults, self)
            });

        },
        _initializeTemplates: function () {

            var self = this;
            var tmpl = self.options._config._template;

            return {
                "items": (bizagi.getTemplate(tmpl) + "#bizagi-ui-controls-uitreeview-items"),
                "subitems": (bizagi.getTemplate(tmpl) + "#bizagi-ui-controls-uitreeview-subitems")
            };
        },
        _renderSubItems: function (obj) {

            var self = this;

            var subItemsTemplate = self.loader.getTemplate("subitems");

            var tmp = $.tmpl(subItemsTemplate, obj, {
                itemValue: $.proxy(self._itemValue, self),
                itemText: $.proxy(self._itemText, self),
                renderSubItems: $.proxy(self._renderSubItems, self),
                setDefaults: $.proxy(self._setDefaults, self)
            });

            return tmp.html();
        },
        _destroy: function () {

            var self = this;
            self.options._dataItems = [];
        },
        _itemValue: function (obj) {

            var self = this;
            var val = '';
            if (self.options.itemValue) {
                val = self.options.itemValue(obj);
            } else {
                if (typeof obj.value === 'string' || typeof obj.value === 'number') {
                    val = obj.value;
                }
            }
            return val;
        },
        _itemText: function (obj) {

            var self = this;
            var val = '';
            if (self.options.itemText) {
                val = self.options.itemText(obj);
            } else {
                if (typeof obj.text === 'string') {
                    val = obj.text;
                }
            }
            return val;
        },
        _setDefaults: function (obj) {

            var self = this;
            var defaults = self.options.defaults;
            var list = self.options.list;

            var text = self._itemText(obj);
            var value = self._itemValue(obj);

            self.options._dataItems.push({ text: text, value: value });

            return "";
        }

    });

})(jQuery);