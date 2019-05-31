/*
* jQuery UI SearchList @VERSION
* Author: David Romero
* Copyright (c) 2013 (http://www.bizagi.com)
*
* Depends:
*  ui.core.js
*/
(function ($) {

    $.widget('ui.searchList', {

        options: {
            list: [],
            cases: [],
            SEARCH_MAX_LENGTH: 1
        },
        _create: function () {

            var self = this;
            var element = self.element;
            var cases = self.options.cases;
            var input = element.find('input[type=text]');

            input.autocomplete(
            {
                source: self._getLabels(),
                minLength: 0,
                messages:
                {
                    noResults: null
                },
                select: function (event, ui) {
                    var value = $.map(self.options.list, function (obj) {
                        if (obj.displayName == ui.item.value) return obj;
                    });

                    self._prependCases(value[0]);
                    self._eventRemove();
                },
                close: function () {
                    input.val("");
                }
            });

            element.on("click", function (event) {
                input.focus();
            });

            input.on("keydown", function (event) {

                if (event.keyCode == 8 || event.keyCode == 46) {

                    var lastElement = element.find('li').not(":last").last();

                    if ($(this).val().length == 0 && lastElement.hasClass('selected')) {

                        var closeButton = lastElement.find('a.closebutton');
                        closeButton.trigger('click');
                        $(this).blur().focus();
                
                    } else if ($(this).val().length == 0) {

                        $(lastElement).addClass('selected');
                        $(this).blur().focus();
                    }
                }

                if (event.keyCode == 13) {

                    event.preventDefault();
                }

            })
        },
        _getLabels: function () {

            var self = this;
            var labels = [];

            $.each(self.options.list, function (key, value) {
                labels.push(value.displayName);
            });

            return labels;
        },
        _prependCases: function (value) {

            var self = this;
            var element = self.element;
            var cases = self.options.cases;
            var input = element.find('input[type=text]');

            if ($.inArray(value.id, cases) < 0) {
                cases.push(value.id);
                input.parent().before('<li class="selected-case" data-case-value="' + value.id + '"><label>' + value.displayName + '</label><a class="closebutton"></a></li>');
            }

        },
        _eventRemove: function () {

            var self = this;
            var element = self.element;
            var cases = self.options.cases;
            var elementRemove = element.find('a.closebutton');

            elementRemove.off('click').on('click', function (e) {
                e.preventDefault();

                var value = $(this).parent().data('case-value');
                cases.splice($.inArray(value, cases), 1);
                $(this).parent().remove();
            });

        }
    });

})(jQuery);