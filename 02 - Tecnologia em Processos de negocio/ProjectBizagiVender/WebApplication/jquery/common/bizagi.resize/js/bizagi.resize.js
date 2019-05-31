/*
*   Name: BizAgi Resize Wrapper
*   Author: Juan Pablo Manrique
*   Comments:
*   -   This script will define a base class to handle a div resize event
*   -   allow the resize event in div element
*/

// Create or Define BizAgi namespace
bizagi = (typeof (bizagi) !== "undefined") ? bizagi : {};
bizagi.resize = [];

bizagi.resize.attachEvent = document.attachEvent;

if (!bizagi.resize.attachEvent) {
    var requestFrame = (function () {
        var raf = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame ||
					function (fn) { return window.setTimeout(fn, 20); };
        return function (fn) { return raf(fn); };
    })();

    var cancelFrame = (function () {
        var cancel = window.cancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame ||
					   window.clearTimeout;
        return function (id) { return cancel(id); };
    })();

    function resetTriggers(element) {
        var triggers = element.__resizeTriggers__,
				        expand = triggers.firstElementChild,
				        contract = triggers.lastElementChild,
				        expandChild = expand.firstElementChild;
        contract.scrollLeft = contract.scrollWidth;
        contract.scrollTop = contract.scrollHeight;
        expandChild.style.width = expand.offsetWidth + 1 + 'px';
        expandChild.style.height = expand.offsetHeight + 1 + 'px';
        expand.scrollLeft = expand.scrollWidth;
        expand.scrollTop = expand.scrollHeight;
    };

    function checkTriggers(element) {
        return element.offsetWidth != element.__resizeLast__.width ||
				        element.offsetHeight != element.__resizeLast__.height;
    }

    function scrollListener(e) {
        var element = this;
        resetTriggers(this);
        if (this.__resizeRAF__) cancelFrame(this.__resizeRAF__);
        this.__resizeRAF__ = requestFrame(function () {
            if (checkTriggers(element)) {
                element.__resizeLast__.width = element.offsetWidth;
                element.__resizeLast__.height = element.offsetHeight;
                element.__resizeListeners__.forEach(function (fn) {
                    fn.call(element, e);
                });
            }
        });
    };
}

window.bizagi.addResizeListener = function (element, fn) {
    if (bizagi.resize.attachEvent) element.attachEvent('resize', fn);
    else {
        if (!element.__resizeTriggers__) {
            if (getComputedStyle(element).position == 'static') element.style.position = 'relative';
            element.__resizeLast__ = {};
            element.__resizeListeners__ = [];
            (element.__resizeTriggers__ = document.createElement('div')).className = 'resize-triggers';
            element.__resizeTriggers__.innerHTML = '<div class="expand-trigger"><div></div></div>' +
													   '<div class="contract-trigger"></div>';
            element.appendChild(element.__resizeTriggers__);
            resetTriggers(element);
            element.addEventListener('scroll', scrollListener, true);
        }
        element.__resizeListeners__.push(fn);
    }
};

window.bizagi.removeResizeListener = function (element, fn) {
    if (bizagi.resize.attachEvent) element.detachEvent('resize', fn);
    else {
        element.__resizeListeners__.splice(element.__resizeListeners__.indexOf(fn), 1);
        if (!element.__resizeListeners__.length) {
            element.removeEventListener('scroll', scrollListener);
            element.__resizeTriggers__ = !element.removeChild(element.__resizeTriggers__);
        }
    }
}
