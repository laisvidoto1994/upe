/**
 *
 * Created by RicardoPD on 10/27/2016.
 */

/**
 * The find() method returns a value in the array, if an element in the array satisfies the provided testing function. Otherwise undefined is returned.
 */
if (!Array.prototype.find) {
    Array.prototype.find = function(predicate) {
        if (this == null) {
            throw new TypeError('Array.prototype.find called on null or undefined');
        }
        if (typeof predicate !== 'function') {
            throw new TypeError('predicate must be a function');
        }
        var list = Object(this);
        var length = list.length >>> 0;
        var thisArg = arguments[1];
        var value;

        for (var i = 0; i < length; i++) {
            value = list[i];
            if (predicate.call(thisArg, value, i, list)) {
                return value;
            }
        }
        return undefined;
    };
}

/** Array reduce implementation as pollyfill from https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Objetos_globales/Array/reduce**/
if (!Array.prototype.reduce)
{
    Array.prototype.reduce = function(fun /*, inicial*/)
    {
        var longitud = this.length;
        if (typeof fun != "function")
            throw new TypeError();

        // no se devuelve ningún valor si no hay valor inicial y el array está vacío
        if (longitud == 0 && arguments.length == 1)
            throw new TypeError();

        var indice = 0;
        if (arguments.length >= 2)
        {
            var rv = arguments[1];
        }
        else
        {
            do
            {
                if (indice in this)
                {
                    rv = this[indice++];
                    break;
                }

                // si el array no contiene valores, no existe valor inicial a devolver
                if (++indice >= longitud)
                    throw new TypeError();
            }
            while (true);
        }

        for (; indice < longitud; indice++)
        {
            if (indice in this)
                rv = fun.call(null, rv, this[indice], indice, this);
        }

        return rv;
    };
}

/**
 * This code trigger the touch events for each item on the kendolistview used
 * in the activity feed.
 * */
(function($) {
    var  defaults = {NS: 'jquery.longclick-', delay: 400};

    $.fn.longTouchs = function(options) {
        var settings = $.extend(defaults, options);

        return $(this).on('mouseup touchend touchcancel touchmove', function(evt) {
            clearTimeout($(evt.currentTarget).data("longClickTimer"));
        }).on('mousedown touchstart', function(evt) {
            $(evt.currentTarget).data("longClick", false);
            $(evt.currentTarget).data("longClickTimer", setTimeout(function(elm) {
                $(elm).data("longClick", true);
                $(elm).trigger('longTouch');
            }, settings.delay, evt.currentTarget));
        }).on('click', function(evt) {
            if($(evt.currentTarget).data("longClick")){
                evt.stopImmediatePropagation();
            }
        });
    }
})(jQuery);