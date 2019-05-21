/*
* jQuery UI MultiSelect @VERSION
* Author: David Romero
* Copyright (c) 2013 (http://www.bizagi.com)
*
* Depends:
*  ui.core.js
*/
(function ($) {

    $.widget('ui.multiSelect', {
        options: {
            list: [],
            label: "MyLabel",
            _dataItems: [],
            _config: {
                _template: $.bizagi.ui.controls.uimultiselect.tmpl,
                _cssClass: $.bizagi.ui.controls.uimultiselect.css,
                _namespace: $.bizagi.ui.controls.uimultiselect.namespace
            },
            SEARCH_MIN_LENGTH: 3
        },
        _create: function () {

            var self = this;
            var $element = self.element;

            self.options._dataItems = [];

            $.when(self._renderContent()).done(function (content) {

                $element.append(content);
                var $input = $element.find('input[type=text]');

                $input.autocomplete(
                    {
                        source: self._getDataSource(),
                        minLength: self.options.SEARCH_MIN_LENGTH,
                        messages:
                            {
                                noResults: null
                            },
                        select: function (event, ui) {
                            var value = $.grep(self.options.list, function (obj) {
                                return self._itemValue(obj) == ui.item.id;
                            });

                            self._prependElements(value[0]);
                        },
                        close: function () {
                            $input.val("");
                        }
                    });

                self._eventHandlers();
            });

        },
        getDataItems: function () {

            var self = this;
            return self.options._dataItems;

        },
        setList: function (list) {

            var self = this;
            self.options.list = list;

            self._refresh();
        },
        getList: function () {

            var self = this;
            return self.options.list;
        },
        _initializeTemplates: function () {

            var self = this;
            var tmpl = self.options._config._template;

            return {
                "multiselect": (bizagi.getTemplate(tmpl))
            };
        },
        _renderContent: function () {

            var self = this;
            var $element = self.element;
            var tmpl = self.options._config._template;
            var css = self.options._config._cssClass;
            var label = self.options.label;

            $element.addClass(css);
            self.loader = new bizagi.ui.controls.tmplloader();

            return $.when(self.loader.loadTemplates(self._initializeTemplates())).pipe(function () {
                var tmpl = self.loader.getTemplate("multiselect");
                return $.tmpl(tmpl, { label: label });
            });
        },
        _refresh: function () {

            var self = this;
            var $input = self.element.find('input[type=text]');

            $input.parent('li').siblings('li').remove();
            self.options._dataItems = [];
            $input.autocomplete("option", "source", self._getDataSource());
        },
        _getDataSource: function () {

            var self = this;
            var data = [];

            $.each(self.options.list, function (key, val) {
                data.push({ label: self._itemText(val), value: self._itemText(val), id: self._itemValue(val) });
            });

            return data;
        },
        _prependElements: function (value) {

            var self = this;
            var $element = self.element;
            var dataItems = self.options._dataItems;
            var $input = $element.find('input[type=text]');

            var n = $.grep(dataItems, function (obj) {
                return obj.value == self._itemValue(value);
            });

            if (!n.length) {
                dataItems.push({ text: self._itemText(value), value: self._itemValue(value) });
                $input.parent().before('<li class="selected-item" data-value="' + self._itemValue(value) + '"><label>' + self._itemText(value) + '</label><a class="closebutton"></a></li>');
                self._trigger('addItem');
            }

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
        _destroy: function () {

            var self = this;
            self.options._dataItems = [];
        },
        _eventHandlers: function () {

            var self = this;
            var $element = self.element;
            var $input = $element.find('input[type=text]');
            var dataItems = self.options._dataItems;

            $("ul", $element).on("click", "a.closebutton", function (event) {

                event.preventDefault();

                var value = $(event.target).closest("li").data('value');

                var position = $.map(dataItems, function (obj, i) {
                    if (obj.value == value) { return i; }
                });

                dataItems.splice(position[0], 1);
                $(this).parent().remove();

                self._trigger('removeItem');
            });

            $element.on("click", function (event) {
                $input.focus();
            });

            $input.on("keydown", function (event) {

                if (event.keyCode == 13) {

                    event.preventDefault();
                }

            });

        }
    });

})(jQuery);