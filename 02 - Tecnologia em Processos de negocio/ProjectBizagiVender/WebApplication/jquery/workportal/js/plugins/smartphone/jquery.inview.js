
(function ($) {
    var inviewObjects = {}, viewportSize, viewportOffset,
      d = document, w = window, documentElement = d.documentElement, expando = $.expando, observerinterval = [];

    $.event.special.inview = {
        add: function (data) {
            inviewObjects[data.guid + "-" + this[expando]] = { data: data, $element: $(this) };
        },

        remove: function (data) {
            try { delete inviewObjects[data.guid + "-" + this[expando]]; } catch (e) { }
        },
        startObserver: function () {
            observerinterval.push(setInterval(checkInView, 500));
        },
        stopObserverandDestroy: function () {
            $.when($.each(observerinterval, function (index, value) {
                window.clearInterval(value);
            })).done(function () { observerinterval = []; inviewObjects = {}; });
        },
        resetObserver: function () {
            $.event.special.inview.stopObserverandDestroy();
            $.event.special.inview.startObserver();
        
         }
    };

    function getViewportSize() {
        var mode, domObject, size = { height: w.innerHeight, width: w.innerWidth };

        // if this is correct then return it. iPad has compat Mode, so will
        // go into check clientHeight/clientWidth (which has the wrong value).
        if (!size.height) {
            mode = d.compatMode;
            if (mode || !$.support.boxModel) { // IE, Gecko
                domObject = mode === 'CSS1Compat' ?
          documentElement : // Standards
          d.body; // Quirks
                size = {
                    height: domObject.clientHeight,
                    width: domObject.clientWidth
                };
            }
        }

        return size;
    }

    function getViewportOffset() {
        return {
            top: w.pageYOffset || documentElement.scrollTop || d.body.scrollTop,
            left: w.pageXOffset || documentElement.scrollLeft || d.body.scrollLeft
        };
    }

    function checkInView() {
        var $elements = $(), elementsLength, i = 0;

        $.each(inviewObjects, function (i, inviewObject) {
            var selector = inviewObject.data.selector,
          $element = inviewObject.$element;
            $elements = $elements.add(selector ? $element.find(selector) : $element);
        });

        elementsLength = $elements.length;
        if (elementsLength) {
            viewportSize = viewportSize || getViewportSize();
            viewportOffset = viewportOffset || getViewportOffset();

            for (; i < elementsLength; i++) {
                // Ignore elements that are not in the DOM tree
                if (!$.contains(documentElement, $elements[i])) {
                    continue;
                }

                var $element = $($elements[i]),
            elementSize = { height: $element.height(), width: $element.width() },
            elementOffset = $element.offset(),
            inView = $element.data('inview'),
            visiblePartX,
            visiblePartY,
            visiblePartsMerged;

                // Don't ask me why because I haven't figured out yet:
                // viewportOffset and viewportSize are sometimes suddenly null in Firefox 5.
                // Even though it sounds weird:
                // It seems that the execution of this function is interferred by the onresize/onscroll event
                // where viewportOffset and viewportSize are unset
                if (!viewportOffset || !viewportSize) {
                    return;
                }

                if (elementOffset.top + elementSize.height > viewportOffset.top &&
            elementOffset.top < viewportOffset.top + viewportSize.height &&
            elementOffset.left + elementSize.width > viewportOffset.left &&
            elementOffset.left < viewportOffset.left + viewportSize.width) {
                    visiblePartX = (viewportOffset.left > elementOffset.left ?
            'right' : (viewportOffset.left + viewportSize.width) < (elementOffset.left + elementSize.width) ?
            'left' : 'both');
                    visiblePartY = (viewportOffset.top > elementOffset.top ?
            'bottom' : (viewportOffset.top + viewportSize.height) < (elementOffset.top + elementSize.height) ?
            'top' : 'both');
                    visiblePartsMerged = visiblePartX + "-" + visiblePartY;
                    if (!inView || inView !== visiblePartsMerged) {
                        $element.data('inview', visiblePartsMerged).trigger('inview', [true, visiblePartX, visiblePartY]);
                    }
                } else if (inView) {
                    $element.data('inview', false).trigger('inview', [false]);
                }
            }
        }
    }

    $(w).bind("scroll resize", function () {
        viewportSize = viewportOffset = null;
    });

    // Use setInterval in order to also make sure this captures elements within
    // "overflow:scroll" elements or elements that appeared in the dom tree due to
    // dom manipulation and reflow
    // old: $(window).scroll(checkInView);
    //
    // By the way, iOS (iPad, iPhone, ...) seems to not execute, or at least delays
    // intervals while the user scrolls. Therefore the inview event might fire a bit late there
    // setInterval(checkInView, 250);
})(jQuery);


/**
* author Christopher Blum
*    - based on the idea of Remy Sharp, http://remysharp.com/2009/01/26/element-in-view-event-plugin/
*    - forked from http://github.com/zuk/jquery.inview/
*/
/*(function ($) {
    function getViewportHeight() {
        var height = window.innerHeight; // Safari, Opera
        var mode = document.compatMode;

        if ((mode || !$.support.boxModel)) { // IE, Gecko
            height = (mode == 'CSS1Compat') ?
            document.documentElement.clientHeight : // Standards
            document.body.clientHeight; // Quirks
        }

        return height;
    }

    $(window).scroll(function () {
        var vpH = getViewportHeight(),
            scrolltop = (document.documentElement.scrollTop ?
                document.documentElement.scrollTop :
                document.body.scrollTop),
            elems = [];

        // naughty, but this is how it knows which elements to check for
       $.each($.cache, function () {
            if (this.events && this.events.inview) {
                elems.push(this.handle.elem);
            }
        });

        if (elems.length) {
            $(elems).each(function () {
                var $el = $(this),
                    top = $el.offset().top,
                    height = $el.height(),
                    inview = $el.data('inview') || false;

                if (scrolltop > (top + height) || scrolltop + vpH < top) {
                    if (inview) {
                        $el.data('inview', false);
                        $el.trigger('inview', [false]);
                    }
                } else if (scrolltop < (top + height)) {
                    if (!inview) {
                        $el.data('inview', true);
                        $el.trigger('inview', [true]);
                    }
                }
            });
        }
    });

    // kick the event to pick up any elements already in view.
    // note however, this only works if the plugin is included after the elements are bound to 'inview'
    $(function () {
        $(window).scroll();
    });
})(jQuery);*/