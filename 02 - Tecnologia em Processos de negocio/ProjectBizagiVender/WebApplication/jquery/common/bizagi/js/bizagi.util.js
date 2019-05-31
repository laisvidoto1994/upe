/*
*   Name: BizAgi Utils
*   Author: Diego Parra
*   Comments:
*   -   This class will provide misc helpers to all modules
*/

// Create or Define BizAgi namespace
bizagi = (typeof (bizagi) !== "undefined") ? bizagi : {};
bizagi.util = (typeof (bizagi.util) !== "undefined") ? bizagi.util : {};
bizagi.context = (typeof (bizagi.context) !== "undefined") ? bizagi.context : {};
bizagi.util.smartphone = (typeof (bizagi.util.smartphone) !== "undefined") ? bizagi.util.smartphone : {};
bizagi.util.tablet = (typeof (bizagi.util.tablet) !== "undefined") ? bizagi.util.tablet : {};
/*
*   Define mini-plugin to acceess iframe's boundaries
*/
(function ($) {
    $.fn.callInside = function (fx, args) {
        if ($(this)[0].tagName.toLowerCase() != "iframe")
            return null;
        // Don't execute the code when the content window is not ready yet    
        if ($(this)[0].contentWindow == null)
            return null;
        // Check if the iframe is cross domain
        try {
            // Evals the content
            $(this)[0].contentWindow.args = args;
        } catch (e) {
            // If an exception is thrown here this is a cross domain access
            return null;
        }

        if ($.browser.msie) {
            return $(this)[0].contentWindow.execScript('args = (this.window.args)?this.window.args:{}; insideFunction = ' + fx.toString() + '; insideFunction(args)');
        } else if ($.browser.webkit || $.browser.mozilla) {
            return $(this)[0].contentWindow.eval('args = window.args;insideFunction = ' + fx.toString() + '; insideFunction(args)');
        }
    };
})(jQuery);
(function ($) {
    $.fn.callInsidePopup = function (fx, args) {
        // This is window here
        var self = this;
        $(document).ready(function () {
            // Check if the iframe is cross domain
            try {
                // Evals the content
                $(self)[0].args = args;
            } catch (e) {
                // If an exception is thrown here this is a cross domain access
                return null;
            }

            if ($.browser.msie) {
                return $(self)[0].execScript('args = (this.window.args)?this.window.args:{}; insideFunction = ' + fx.toString() + '; insideFunction(args)');
            } else if ($.browser.webkit || $.browser.mozilla) {
                return $(self)[0].eval('args = window.args;insideFunction = ' + fx.toString() + '; insideFunction(args)');
            }

        });
    };
})(jQuery);
(function ($) {

    // add support for CSS functions for "setProperty" in ie8
    var isStyleFuncSupported = !!CSSStyleDeclaration.prototype.getPropertyValue;
    if (!isStyleFuncSupported) {
        CSSStyleDeclaration.prototype.getPropertyValue = function(a) {
            return this.getAttribute(a);
        };
        CSSStyleDeclaration.prototype.setProperty = function(styleName, value, priority) {
            this.setAttribute(styleName, value);
            var priority = typeof priority != 'undefined' ? priority : '';
            if (priority != '') {
                // Add priority manually
                var rule = new RegExp(RegExp.escape(styleName) + '\\s*:\\s*' + RegExp.escape(value) + '(\\s*;)?', 'gmi');
                this.cssText = this.cssText.replace(rule, styleName + ': ' + value + ' !' + priority + ';');
            }
        };

        CSSStyleDeclaration.prototype.removeProperty = function(a) {
            return this.removeAttribute(a);
        };

        CSSStyleDeclaration.prototype.getPropertyPriority = function(styleName) {
            var rule = new RegExp(RegExp.escape(styleName) + '\\s*:\\s*[^\\s]*\\s*!important(\\s*;)?', 'gmi');
            return rule.test(this.cssText) ? 'important' : '';
        };
    }

    // Escape regex chars with \
    RegExp.escape = function(text) {
        return text.replace( /[-[\]{}()*+?.,\\^$|#\s]/g , "\\$&");
    };

    // The style function
    jQuery.fn.style = function (styleName, value, priority) {
        // DOM node
        var node = this.get(0);
        // Ensure we have a DOM node 
        if (typeof node == 'undefined') {
            return;
        }
        // CSSStyleDeclaration
        var style = this.get(0).style;
        // Getter/Setter
        if (typeof styleName != 'undefined') {
            if (typeof value != 'undefined') {
                // Set style property
                var priority = typeof priority != 'undefined' ? priority : '';
                // Hack to IE8
                if (style.setProperty) {
                    style.setProperty(styleName, value, priority);
                } else {
                    style.setAttribute(styleName, value, priority);
                }
            } else {
                // Get style property

                return style.getPropertyValue(styleName);
            }
        } else {
            // Get CSSStyleDeclaration
            return style;
        }
    };
})(jQuery);

(function ($) {
    jQuery.nl2br = function (value) {
        return value.replace(/(\r\n|\n\r|\r|\n|\\r\\n|\\n\\r|\\r|\\n)/g, "<br>");
    };
})(jQuery);



(function ($) {
    jQuery.br2nl = function (value) {
        return value.replace(/\r\n|\r|\n|<br>|<br\/>/g, "\r");
    };
})(jQuery);

/**
*   Can be compare control between their intance value and existing value
*/
//TODO: DEPL- Please move this out of here, this is rendering logic, it must exists as a function for the render, and every erender could override its implementation
(function ($) {
    jQuery.controlValueIsChanged = function (control) {
        var self = control;
        var properties = self.properties;
        var value = self.getValue();
        var compareValue = properties.originalValue;
        var result = true;

        // Flag to force to collect data
        if ($.forceCollectData) {
            return true;
        }

        // Verify if control has been ready
        if (control.properties.type == "grid" && control.ready().state() == "pending") {
            return false;
        }

        if (properties.type == "combo" || properties.type == "queryCombo" || properties.type == "list" || properties.type == "queryList" || properties.type == "radio" || properties.type == "queryRadio" || properties.type == "queryState" || properties.type === "cascadingCombo") {
            if (value && value.length !== undefined)
                value = value[0];
            if (compareValue && compareValue.length !== undefined)
                compareValue = compareValue[0];
            value = value && value.id ? value.id : value;
            compareValue = compareValue && compareValue.id ? compareValue.id : compareValue;
            result = (compareValue == value) ? false : true;
        } else if (properties.type == "boolean" ||properties.type == "queryBoolean"||properties.type == "queryCheck") {
            result = (bizagi.util.parseBoolean(compareValue) == bizagi.util.parseBoolean(value)) ? false : true;
        } else if (properties.type == "searchNumber") {

            result = (value) ? true : false;
        } else if(properties.type === "date") {
            result = (new Date(compareValue).getTime()) !== (new Date(value).getTime());
        } else {
            result = (compareValue === value) ? false : true;
        }

        return result;
    };
})(jQuery);

(function ($) {
    jQuery.getMaxZindex = function () {
        var elm = $("*");
        var maxZindex = 1;

        $.each(elm, function (key, value) {
            var zindex = parseInt($(value).css("z-index"));
            if (zindex > maxZindex) {
                maxZindex = zindex + 1;
            }

        });

        return maxZindex;
    }
})(jQuery);

/**
 * Set the same max height to multiples divs
 */
(function ($) {
    jQuery.equalizeHeights = function (selector) {
        var heights = new Array();
        // Loop to get all element heights
        $(selector).each(function() {

            // Need to let sizes be whatever they want so no overflow on resize
            $(this).css('min-height', '0');
            $(this).css('max-height', 'none');
            $(this).css('height', 'auto');

            // Then add size (no units) to array
            heights.push($(this).outerHeight());
        });

        // Find max height of all elements
        var max = Math.max.apply( Math, heights );

        // Set all heights to max height
        $(selector).each(function() {
            $(this).css('height', max + 'px');
        });
    }
})(jQuery);

//TODO: DEPL - Move this to rendering
bizagi.util.autoSave = function() {
    var deferredSave = $.Deferred();

    //if attr data-event exist trigger event auto-save or resolve the deferred
    if (bizagi.util.detectDevice() !== "desktop"){
        if ($(document).data('auto-save')) {
            $(document).trigger('save-form', [deferredSave]);
        } else {
            deferredSave.resolve();
        }
    }
    else{
        if ($._data($(document)[0], 'events')["save-form"] && $._data($(document)[0], 'events')["save-form"].length > 0) {
            $(document).trigger('save-form', [deferredSave]);
        } else {
            deferredSave.resolve();
        }
    }
    return deferredSave.promise();
};

bizagi.util.md5 = function (message) {
    var CryptoJS = CryptoJS || function (s, p) { var m = {}, l = m.lib = {}, n = function () { }, r = l.Base = { extend: function (b) { n.prototype = this; var h = new n; b && h.mixIn(b); h.hasOwnProperty("init") || (h.init = function () { h.$super.init.apply(this, arguments) }); h.init.prototype = h; h.$super = this; return h }, create: function () { var b = this.extend(); b.init.apply(b, arguments); return b }, init: function () { }, mixIn: function (b) { for (var h in b) b.hasOwnProperty(h) && (this[h] = b[h]); b.hasOwnProperty("toString") && (this.toString = b.toString) }, clone: function () { return this.init.prototype.extend(this) } }, q = l.WordArray = r.extend({ init: function (b, h) { b = this.words = b || []; this.sigBytes = h != p ? h : 4 * b.length }, toString: function (b) { return (b || t).stringify(this) }, concat: function (b) { var h = this.words, a = b.words, j = this.sigBytes; b = b.sigBytes; this.clamp(); if (j % 4) for (var g = 0; g < b; g++) h[j + g >>> 2] |= (a[g >>> 2] >>> 24 - 8 * (g % 4) & 255) << 24 - 8 * ((j + g) % 4); else if (65535 < a.length) for (g = 0; g < b; g += 4) h[j + g >>> 2] = a[g >>> 2]; else h.push.apply(h, a); this.sigBytes += b; return this }, clamp: function () { var b = this.words, h = this.sigBytes; b[h >>> 2] &= 4294967295 << 32 - 8 * (h % 4); b.length = s.ceil(h / 4) }, clone: function () { var b = r.clone.call(this); b.words = this.words.slice(0); return b }, random: function (b) { for (var h = [], a = 0; a < b; a += 4) h.push(4294967296 * s.random() | 0); return new q.init(h, b) } }), v = m.enc = {}, t = v.Hex = { stringify: function (b) { var a = b.words; b = b.sigBytes; for (var g = [], j = 0; j < b; j++) { var k = a[j >>> 2] >>> 24 - 8 * (j % 4) & 255; g.push((k >>> 4).toString(16)); g.push((k & 15).toString(16)) } return g.join("") }, parse: function (b) { for (var a = b.length, g = [], j = 0; j < a; j += 2) g[j >>> 3] |= parseInt(b.substr(j, 2), 16) << 24 - 4 * (j % 8); return new q.init(g, a / 2) } }, a = v.Latin1 = { stringify: function (b) { var a = b.words; b = b.sigBytes; for (var g = [], j = 0; j < b; j++) g.push(String.fromCharCode(a[j >>> 2] >>> 24 - 8 * (j % 4) & 255)); return g.join("") }, parse: function (b) { for (var a = b.length, g = [], j = 0; j < a; j++) g[j >>> 2] |= (b.charCodeAt(j) & 255) << 24 - 8 * (j % 4); return new q.init(g, a) } }, u = v.Utf8 = { stringify: function (b) { try { return decodeURIComponent(escape(a.stringify(b))) } catch (g) { throw Error("Malformed UTF-8 data"); } }, parse: function (b) { return a.parse(unescape(encodeURIComponent(b))) } }, g = l.BufferedBlockAlgorithm = r.extend({ reset: function () { this._data = new q.init; this._nDataBytes = 0 }, _append: function (b) { "string" == typeof b && (b = u.parse(b)); this._data.concat(b); this._nDataBytes += b.sigBytes }, _process: function (b) { var a = this._data, g = a.words, j = a.sigBytes, k = this.blockSize, m = j / (4 * k), m = b ? s.ceil(m) : s.max((m | 0) - this._minBufferSize, 0); b = m * k; j = s.min(4 * b, j); if (b) { for (var l = 0; l < b; l += k) this._doProcessBlock(g, l); l = g.splice(0, b); a.sigBytes -= j } return new q.init(l, j) }, clone: function () { var b = r.clone.call(this); b._data = this._data.clone(); return b }, _minBufferSize: 0 }); l.Hasher = g.extend({ cfg: r.extend(), init: function (b) { this.cfg = this.cfg.extend(b); this.reset() }, reset: function () { g.reset.call(this); this._doReset() }, update: function (b) { this._append(b); this._process(); return this }, finalize: function (b) { b && this._append(b); return this._doFinalize() }, blockSize: 16, _createHelper: function (b) { return function (a, g) { return (new b.init(g)).finalize(a) } }, _createHmacHelper: function (b) { return function (a, g) { return (new k.HMAC.init(b, g)).finalize(a) } } }); var k = m.algo = {}; return m } (Math); (function (s) { function p(a, k, b, h, l, j, m) { a = a + (k & b | ~k & h) + l + m; return (a << j | a >>> 32 - j) + k } function m(a, k, b, h, l, j, m) { a = a + (k & h | b & ~h) + l + m; return (a << j | a >>> 32 - j) + k } function l(a, k, b, h, l, j, m) { a = a + (k ^ b ^ h) + l + m; return (a << j | a >>> 32 - j) + k } function n(a, k, b, h, l, j, m) { a = a + (b ^ (k | ~h)) + l + m; return (a << j | a >>> 32 - j) + k } for (var r = CryptoJS, q = r.lib, v = q.WordArray, t = q.Hasher, q = r.algo, a = [], u = 0; 64 > u; u++) a[u] = 4294967296 * s.abs(s.sin(u + 1)) | 0; q = q.MD5 = t.extend({ _doReset: function () { this._hash = new v.init([1732584193, 4023233417, 2562383102, 271733878]) }, _doProcessBlock: function (g, k) { for (var b = 0; 16 > b; b++) { var h = k + b, w = g[h]; g[h] = (w << 8 | w >>> 24) & 16711935 | (w << 24 | w >>> 8) & 4278255360 } var b = this._hash.words, h = g[k + 0], w = g[k + 1], j = g[k + 2], q = g[k + 3], r = g[k + 4], s = g[k + 5], t = g[k + 6], u = g[k + 7], v = g[k + 8], x = g[k + 9], y = g[k + 10], z = g[k + 11], A = g[k + 12], B = g[k + 13], C = g[k + 14], D = g[k + 15], c = b[0], d = b[1], e = b[2], f = b[3], c = p(c, d, e, f, h, 7, a[0]), f = p(f, c, d, e, w, 12, a[1]), e = p(e, f, c, d, j, 17, a[2]), d = p(d, e, f, c, q, 22, a[3]), c = p(c, d, e, f, r, 7, a[4]), f = p(f, c, d, e, s, 12, a[5]), e = p(e, f, c, d, t, 17, a[6]), d = p(d, e, f, c, u, 22, a[7]), c = p(c, d, e, f, v, 7, a[8]), f = p(f, c, d, e, x, 12, a[9]), e = p(e, f, c, d, y, 17, a[10]), d = p(d, e, f, c, z, 22, a[11]), c = p(c, d, e, f, A, 7, a[12]), f = p(f, c, d, e, B, 12, a[13]), e = p(e, f, c, d, C, 17, a[14]), d = p(d, e, f, c, D, 22, a[15]), c = m(c, d, e, f, w, 5, a[16]), f = m(f, c, d, e, t, 9, a[17]), e = m(e, f, c, d, z, 14, a[18]), d = m(d, e, f, c, h, 20, a[19]), c = m(c, d, e, f, s, 5, a[20]), f = m(f, c, d, e, y, 9, a[21]), e = m(e, f, c, d, D, 14, a[22]), d = m(d, e, f, c, r, 20, a[23]), c = m(c, d, e, f, x, 5, a[24]), f = m(f, c, d, e, C, 9, a[25]), e = m(e, f, c, d, q, 14, a[26]), d = m(d, e, f, c, v, 20, a[27]), c = m(c, d, e, f, B, 5, a[28]), f = m(f, c, d, e, j, 9, a[29]), e = m(e, f, c, d, u, 14, a[30]), d = m(d, e, f, c, A, 20, a[31]), c = l(c, d, e, f, s, 4, a[32]), f = l(f, c, d, e, v, 11, a[33]), e = l(e, f, c, d, z, 16, a[34]), d = l(d, e, f, c, C, 23, a[35]), c = l(c, d, e, f, w, 4, a[36]), f = l(f, c, d, e, r, 11, a[37]), e = l(e, f, c, d, u, 16, a[38]), d = l(d, e, f, c, y, 23, a[39]), c = l(c, d, e, f, B, 4, a[40]), f = l(f, c, d, e, h, 11, a[41]), e = l(e, f, c, d, q, 16, a[42]), d = l(d, e, f, c, t, 23, a[43]), c = l(c, d, e, f, x, 4, a[44]), f = l(f, c, d, e, A, 11, a[45]), e = l(e, f, c, d, D, 16, a[46]), d = l(d, e, f, c, j, 23, a[47]), c = n(c, d, e, f, h, 6, a[48]), f = n(f, c, d, e, u, 10, a[49]), e = n(e, f, c, d, C, 15, a[50]), d = n(d, e, f, c, s, 21, a[51]), c = n(c, d, e, f, A, 6, a[52]), f = n(f, c, d, e, q, 10, a[53]), e = n(e, f, c, d, y, 15, a[54]), d = n(d, e, f, c, w, 21, a[55]), c = n(c, d, e, f, v, 6, a[56]), f = n(f, c, d, e, D, 10, a[57]), e = n(e, f, c, d, t, 15, a[58]), d = n(d, e, f, c, B, 21, a[59]), c = n(c, d, e, f, r, 6, a[60]), f = n(f, c, d, e, z, 10, a[61]), e = n(e, f, c, d, j, 15, a[62]), d = n(d, e, f, c, x, 21, a[63]); b[0] = b[0] + c | 0; b[1] = b[1] + d | 0; b[2] = b[2] + e | 0; b[3] = b[3] + f | 0 }, _doFinalize: function () { var a = this._data, k = a.words, b = 8 * this._nDataBytes, h = 8 * a.sigBytes; k[h >>> 5] |= 128 << 24 - h % 32; var l = s.floor(b / 4294967296); k[(h + 64 >>> 9 << 4) + 15] = (l << 8 | l >>> 24) & 16711935 | (l << 24 | l >>> 8) & 4278255360; k[(h + 64 >>> 9 << 4) + 14] = (b << 8 | b >>> 24) & 16711935 | (b << 24 | b >>> 8) & 4278255360; a.sigBytes = 4 * (k.length + 1); this._process(); a = this._hash; k = a.words; for (b = 0; 4 > b; b++) h = k[b], k[b] = (h << 8 | h >>> 24) & 16711935 | (h << 24 | h >>> 8) & 4278255360; return a }, clone: function () { var a = t.clone.call(this); a._hash = this._hash.clone(); return a } }); r.MD5 = t._createHelper(q); r.HmacMD5 = t._createHmacHelper(q) })(Math);
    return CryptoJS.MD5(message).toString();
};

/*
*   Creates a replace all method that is left from the String Class
*/
bizagi.util.replaceAll = function (text, pcFrom, pcTo) {
    // Call the method located in bizagi.loader
    return bizagi.replaceAll(text, pcFrom, pcTo);
};
/*
*replaces global expressions regulars
*/
bizagi.util.replaceAllGlobalRegExp = function (text, pcFrom, pcTo) {
    var temp = text;

    var re = new RegExp(pcFrom, "g");
    temp = temp.replace(re, pcTo);

    return temp.toString();
};
// Also append it to the string class
String.prototype.replaceAll = function (pcFrom, pcTo) {
    return bizagi.util.replaceAll(this, pcFrom, pcTo);
};
// Capitalize a string
String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
};
// Add this (Create an starts with function) to the string prototype
String.prototype.startsWith = function (str) {
    return this.slice(0, str.length) == str;
};

// get Initials of a string/name
String.prototype.getInitials = function () {
    var initials = "";
    try{
        var removeRepeatSpaces = this.replace(/  +/g, ' ');
        var words = removeRepeatSpaces.split(' ');
        for (var i = 0; i < words.length; i += 1) {
            initials += words[i][0] || '';
            if(initials.length == 2){
                break;
            }
        }
    }
    catch(e){}

    return initials.toUpperCase();
};

Math.sign = Math.sign || function(x) {
    x = +x; // convert to a number
    if (x === 0 || isNaN(x)) {
        return x;
    }
    return x > 0 ? 1 : -1;
}

// Add a clone to the object prototype
bizagi.clone = function (obj) {
    return JSON.parse(JSON.encode(obj));
};
// Measures the pixel size of a string
bizagi.measureString = function (string, fontSize) {
    var test = $("<span/>").appendTo("body");
    test.text(string);
    if (fontSize)
        test.css("font-size", fontSize);
    var width = test.width();
    test.detach();
    return width;
};
/*
*   Creates a trim method 
*/
bizagi.util.trim = function (text) {
    if (typeof (text) === "undefined" || text == null)
        return text;
    // Call the method located in bizagi.loader
    return text.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
};
// Create an ends with function
String.prototype.endsWith = function (suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};
/*
* Method to detect iPad visitors
*/
bizagi.util.isIPad = function () {
    return (navigator.platform.indexOf("iPad") != -1);
};
/*
* Method to detect iPhone visitors
*/
bizagi.util.isIPhone = function () {
    return (navigator.userAgent.toLowerCase().indexOf("iphone") > -1);
};
/*
* Method to detect iPod visitors
*/
bizagi.util.isIPod = function () {
    return (navigator.userAgent.toLowerCase().indexOf("ipod") > -1);
};
/*
* Method to detect IE7 visitors
*/
bizagi.util.isIE7 = function () {
    return bizagi.util.isIE() && document.documentMode == 7;
};
/*
* Method to detect IE8 visitors
*/
bizagi.util.isIE8 = function () {
    return bizagi.util.isIE() && document.documentMode == 8;
};
/*
* Method to detect IE9 visitors
*/
bizagi.util.isIE9 = function () {
    return bizagi.util.isIE() && document.documentMode == 9;
};
/*
 * Method to detect IE10 visitors
 */
bizagi.util.isIE10 = function () {
    return bizagi.util.isIE() && document.documentMode == 10;
};
/*
 * Method to detect IE11 visitors
 */
bizagi.util.isIE11 = function () {
    return !!navigator.userAgent.match(/Trident\/7.0/) && !navigator.userAgent.match(/MSIE/i);
};
/*
 * Method to detect IE12 or Edge(Windows 10) visitors
 */
bizagi.util.isEdge = function () {
    if (/Edge\/*./i.test(navigator.userAgent)){
        return true;
    }
    return false;
};
/*
* Method to detect IE visitors
*/
bizagi.util.isIE = function () {
    return (navigator.appName.indexOf("Internet Explorer") > 0 || !!navigator.userAgent.match(/Trident/));
};
/*
* Get the specific version of IE 
*/
bizagi.util.getIEVersion = function () {
    var sAgent = window.navigator.userAgent;
    var indexMSIE = sAgent.indexOf("MSIE");
    var version = 0; 
    if (indexMSIE > 0) {
        version = parseInt(sAgent.substring(indexMSIE + 5, sAgent.indexOf(".", indexMSIE)));
    } else
        if (!!navigator.userAgent.match(/Trident/) || window.navigator.userAgent.indexOf("Edge") > -1) { // Condition Check IF IE 11 and or MS Edge
            version = 11;
        }
    return version;
};
/**
* Method to detect iOS version Higher than 5
*/
bizagi.util.isIphoneHigherIOS5 = function () {

    if (this.value != undefined)
        return this.value;
    return this.value = RegExp("OS\\s*(5|6|7|8)_*\\d").test(navigator.userAgent) && RegExp(" AppleWebKit/").test(navigator.userAgent);
};
/**
* Method to detect iOS version 5
*/
bizagi.util.isLessThanIOS5 = function () {
    if (navigator.userAgent.match(new RegExp(/CPU OS (1|2|3|4)/i))) {
        return true;
    } else {
        return false;
    }
};

bizagi.util.isIphoneAndLessIOS6 = function () {
    if (this.value != undefined)
        return this.value;
    return this.value = RegExp("OS\\s*(4|5|6)_*\\d").test(navigator.userAgent) && RegExp(" AppleWebKit/").test(navigator.userAgent);
};

bizagi.util.isString = function (value) {
    return Object.prototype.toString.apply(value) === "[object String]";
};

bizagi.util.isArray = function (value) {
    return Array.isArray(value);
};
bizagi.util.isNull = function (value) {
    return Object.prototype.toString.apply(value) === "[object Null]";
};

/*
*   Method to detect IE version
*/
bizagi.util.getInternetExplorerVersion = function () {
    if (!bizagi.util.isIE())
        return -1;
    return Number(document.documentMode);
};
/*  
*   Detect a device based on the width
*/
bizagi.util.detectDevice = function () {
    // Call the method located in bizagi.loader
    return bizagi.detectDevice();
};
bizagi.util.isTablet = function () {
    return bizagi.util.isIPad();
};
// Check if a string is number
bizagi.util.isNumeric = function (n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
};
// Check if a string is GUID
bizagi.util.isGUID = function (n) {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(n);
};
// Throw not implemented exception
bizagi.util.mustImplement = function (notImplementedMethod) {
    try {
        console.log("Not implemented exception: " + notImplementedMethod);
    } catch (exe) {//IE console variable not exist
    }
    //throw "You must implement " + notImplementedMethod;
};
// Encodes the xpath 
bizagi.util.encodeXpath = function (xpath) {
    if (bizagi.util.isEmpty(xpath) || typeof xpath.replaceAll === "undefined")
        return "";
    return xpath.replaceAll(".", "_").replaceAll("=", "_").replaceAll("[", "_").replaceAll("]", "_");
};
// Parses a value to return the correct boolean value
bizagi.util.parseBoolean = function (value) {
    if (value === undefined) {
        return null;
    }

    if (value === null) {
        return null;
    }

    if (value === '') {
        return null;
    }

    // Parse true values
    if (value === true || value === 1 || value.toString() === "true" || value === "1") {
        return true;
    }
    if (value.toString().toLowerCase() === "true") {
        return true;
    }

    // Parse false values
    if ((value !== null && value === false) || value === 0 || value.toString() === "false" || value === "0") {
        return false;
    }
    if (value.toString().toLowerCase() === "false") {
        return false;
    }

    return null;
};
/*
*   Checks if a given string is empty
*/
bizagi.util.isEmpty = function (value) {
    if (value === 0)
        return false;
    if (value === undefined ||
            value === null ||
            value === "") {

        return true;
    }

    if (typeof (value) === "Array") {
        return value.length == 0;
    }

    if (Object.prototype.toString.apply(value) === "[object Array]") {
        return value.length === 0;
    }

    if (Object.prototype.toString.apply(value) === "[object Object]") {
        if ($.isEmptyObject(value)) {
            return true;
        } else {
            return bizagi.util.isEmptyCombo(value);
        }
    }

    return false;
};

bizagi.util.isEmptyCombo = function (object) {
    if (Object.prototype.toString.apply(object) === "[object Object]") {
        var property, id = false, value = false, other = false;
        for (property in object) {
            if (object.hasOwnProperty(property)) {
                if (property === "id") {
                    id = true;
                } else {
                    if (property === "value") {
                        value = true;
                    } else {
                        other = true;
                    }
                }
                if (other) {
                    return false;
                }
            }
        }
        if (id) {
            if (object["id"] === "") {
                return true;
            } else {
                return false;
            }
        }
    }
    return undefined;
};

/**
* Decode data from encodeURI charset
*/
bizagi.util.decodeURI = function (value) {
    value = value || "";
    var finishDecoded = false;
    var decodedValue = value;
    var infinityControl;

    // Try to decode data value
    while (!finishDecoded) {
        try {
            infinityControl = decodeURI(decodedValue);
            if (bizagi.util.hasNonVisibleChars(infinityControl)) {
                decodedValue = value;
                break;
            }
            if (infinityControl == decodedValue) {
                finishDecoded = true;
            } else {
                decodedValue = infinityControl;
            }
        } catch (e) {
            finishDecoded = true;
        }
    }

    return decodedValue;
};

bizagi.util.hasNonVisibleChars = function (value) {
    value = value || "";
    var length = value.length;
    var i = 0, result = false, ch;
    for (; i < length; ) {
        ch = value.charCodeAt(i++);
        if (ch < 32 || ch > 126) {
            result = true;
            break;
        }
    }
    return result;
};

/* 
*   Converts a percent into a number
*/
bizagi.util.percent2Number = function (value) {
    return Number(String(value).replace("%", ""));
};
/*
*   Check if a object is empty
*/
bizagi.util.isObjectEmpty = function (obj) {
    if (obj.length > 0)
        return false;
    return true;
};
/*
*   Check if a map object is empty
*/
bizagi.util.isMapEmpty = function (map) {
    // First we validate a special case
    if (map.length == 1 && map[0].length == 0)
        return true;
    // Then we do normal validation
    for (var key in map) {
        if (map.hasOwnProperty(key)) {
            return false;
        }
    }
    return true;
};
/*
*   Replaces a matched selector in the container for the specified "replace" element
*/
bizagi.util.replaceSelector = function (container, selector, replace) {
    // Replace children tag
    var elementToReplace = $(selector, container);
    if (elementToReplace.length > 0) {
        elementToReplace.append(replace);
        elementToReplace.children().unwrap();
    }
};
/*
*   Determines if a control as a scrollbar 
*/
bizagi.util.hasScroll = function (el, direction) {
    if (el.length)
        el = el[0];
    direction = (direction === 'vertical') ? 'scrollTop' : 'scrollLeft';
    var result = !!el[direction];
    if (!result) {
        el[direction] = 1;
        result = !!el[direction];
        el[direction] = 0;
    }
    return result;
};

//TODO: DEPL - Rename this to areIdenticalObjects
bizagi.util.identicalObjects = function (obj1, obj2) {
    var self = this;

    if (typeof (obj1) !== typeof (obj2)) {
        return false;
    }

    if (typeof (obj1) === "function") {
        return obj1.toString() === obj2.toString();
    }

    if (obj1 instanceof Object && obj2 instanceof Object) {

        // Count properties
        if (bizagi.util.countProps(obj1) !== bizagi.util.countProps(obj2)) {
            return false;
        }

        var r = true;
        for (k in obj1) {
            r = bizagi.util.identicalObjects(obj1[k], obj2[k]);
            if (!r) {
                return false;
            }
        }
        return true;
    } else {
        return obj1 === obj2;
    }
};

bizagi.util.countProps = function (obj) {
    var count = 0;
    for (k in obj) {
        if (obj.hasOwnProperty(k)) {
            count++;
        }
    }
    return count;
};
/*
*   Determines if a element has visibility
*/
bizagi.util.isScrolledIntoView = function (elem, layout) {
    if (elem == undefined) {
        return false;
    }

    layout = layout || $(window);
    var scrollTop = layout.scrollTop();
    var elemTop = $(elem).offset().top;
    var elemBottom = elemTop + $(elem).height();
    var docViewBottom = scrollTop + $(layout).height();
    return ((elemBottom <= docViewBottom) && (elemTop >= scrollTop));
};
bizagi.util.centerElementIntoScroll = function (elem, layout) {
    if (elem == undefined) {
        return false;
    }

    layout = layout || $(window);
    var actualScroll = layout.scrollTop();
    var elementTop = $(elem).offset().top;
    var elementHeight = $(elem).height();
    var offset = 0;
    if (elementTop > 0) {
        offset = elementTop + elementHeight;
    } else {
        offset = elementTop - elementHeight;
    }
    var newTop = actualScroll + offset;
    layout.scrollTop(newTop);
};
/*
*   Encode a html string
*/
bizagi.util.encodeHtml = function (text) {
    if (text === undefined || text === null) {
        return "";
    }
    if (typeof (text) == "string") {
        return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
    return text;
};
/*
*   Read the location hash
*/
bizagi.util.getHashParams = function () {
    var params = window.location.hash.substring(1).split("#");
    return params;
};
/*
*   Loads a file on-demand
*/
bizagi.util.loadFile = function (params) {
    var defer = new $.Deferred();
    var url = params && params.src ? params.src : params;
    var type = params && params.type ? params.type : null;
    bizagi.loader.loadFile({
        src: url,
        type: type
    })
            .then(function () {
                defer.resolve();
            });
    return defer.promise();
};
/*
*   Initializes a webpart on-demand
*/
bizagi.util.initWebpart = function (webpart) {
    var defer = new $.Deferred();
    if (webpart.initialized) {
        // If already initialized resolve the deferred
        defer.resolve();
    } else {

        if (webpart.initializing) {
            $.when(webpart.loadingDeferred.promise())
                    .done(function () {
                        defer.resolve();
                    });
        } else {

            webpart.loadingDeferred = new $.Deferred();
            webpart.initializing = true;
            bizagi.loader.initWebpart(webpart, function () {

                // Resolve deferreds
                webpart.loadingDeferred.resolve();
                webpart.initializing = false;
                defer.resolve();
            });
        }
    }

    return defer.promise();
};
/*
*   Read the query string parameteres
*/
bizagi.util.getQueryString = function (url) {
    var params = {};
    url = url || window.location.href;
    var query = url.indexOf("?") > 0 ? url.substring(url.indexOf("?") + 1) : "";
    var pairs = query.split("&");
    for (var i = pairs.length - 1; i >= 0; i--) {
        var pos = pairs[i].indexOf('=');
        if (pos == -1)
            continue;
        var argname = pairs[i].substring(0, pos);
        var value = pairs[i].substring(pos + 1);
        params[argname] = unescape(value);
    }
    return params;
};
/*
*   Extend querystring
*/
bizagi.util.extendQueryString = function (url, additionalParams) {
    var plainUrl = url.indexOf("?") > 0 ? url.substring(0, url.indexOf("?")) : url;
    var existingParams = bizagi.util.getQueryString(url);
    var newParams = $.extend({}, existingParams, additionalParams);
    return plainUrl + "?" + $.param(newParams);
};
bizagi.util.getStackTrace = function () {
    var callstack = [];
    var isCallstackPopulated = false;
    try {
        i.dont.exist += 0; //doesn't exist- that's the point
    } catch (e) {
        if (e.stack) { //Firefox
            var lines = e.stack.split('\n');
            for (var i = 0, len = lines.length; i < len; i++) {
                if (lines[i].match(/^\s*[A-Za-z0-9\-_\$]+\(/)) {
                    callstack.push(lines[i]);
                }
            }
            //Remove call to printStackTrace()
            callstack.shift();
            isCallstackPopulated = true;
        }
        else if (window.opera && e.message) { //Opera
            var lines = e.message.split('\n');
            for (var i = 0, len = lines.length; i < len; i++) {
                if (lines[i].match(/^\s*[A-Za-z0-9\-_\$]+\(/)) {
                    var entry = lines[i];
                    //Append next line also since it has the file info
                    if (lines[i + 1]) {
                        entry += ' at ' + lines[i + 1];
                        i++;
                    }
                    callstack.push(entry);
                }
            }
            //Remove call to printStackTrace()
            callstack.shift();
            isCallstackPopulated = true;
        }
    }
    if (!isCallstackPopulated) { //IE and Safari
        var currentFunction = arguments.callee.caller;
        while (currentFunction) {
            var fn = currentFunction.toString();
            var fname = fn.substring(fn.indexOf("function") + 8, fn.indexOf('')) || 'anonymous';
            callstack.push(fname);
            currentFunction = currentFunction.caller;
        }
    }
    return callstack;
};
/*
*	highlight elements
*/
bizagi.util.highLightElement = function (el) {
    el.addClass('ui-highlight-control');
    $.when(
            setTimeout(function () {
                el.addClass('ui-highlight-off-control');
            }, 450)
            ).done(
            setTimeout(function () {
                el.removeClass('ui-highlight-control ui-highlight-off-control');
            }, 800));
}
/*
*	scroll to bottom
*/
bizagi.util.autoScrollBottom = function (el) {
    try {
        var elScrollHeight;
        elScrollHeight = el[0].scrollHeight;
        el.scrollTop(elScrollHeight);
    }
    catch (e) {
    }
}

/*create auto scroll with limit top and limit bottom */
bizagi.util.autoScrollInterval = { init: false };
bizagi.util.autoScroll = function (itemScroll, limitTop, limitBottom, idInterval) {
    var outSide = false;
    /* prevent a previous interval */
    clearInterval(bizagi.util.autoScrollInterval[idInterval]);
    bizagi.util.autoScrollInterval[idInterval] = 0;
    bizagi.util.autoScrollInterval['init'] = true;
    $('body').addClass('autoscroll');
    $('body.autoscroll').mousemove(function (event) {
        if (event.pageY < limitTop) {
            if (!outSide) {
                outSide = true;
                bizagi.util.autoScrollTopInterval(itemScroll, 'autoscroll', idInterval);
            }
        } else if (event.pageY > limitBottom) {
            if (!outSide) {
                outSide = true;
                bizagi.util.autoScrollBottomInterval(itemScroll, 'autoscroll', idInterval);
            }
        } else {
            clearInterval(bizagi.util.autoScrollInterval[idInterval]);
            outSide = false;
        }
    });
}
/*create auto scroll movement top */
bizagi.util.autoScrollTopInterval = function (itemScroll, classCSS, idInterval) {
    clearInterval(bizagi.util.autoScrollInterval[idInterval]);
    if (classCSS) {
        $('body').addClass(classCSS);
    }
    if (itemScroll.scrollTop() == 0) {
        clearInterval(bizagi.util.autoScrollInterval[idInterval]);
    } else {
        clearInterval(bizagi.util.autoScrollInterval[idInterval]);
        bizagi.util.autoScrollInterval[idInterval] = setInterval(function () {
            if (itemScroll.scrollTop() > 0) {
                itemScroll.scrollTop(itemScroll.scrollTop() - 40);
            } else {
                clearInterval(bizagi.util.autoScrollInterval[idInterval]);
            }
        }, 100);
    }
}

/*create auto scroll movement bottom */
bizagi.util.autoScrollBottomInterval = function (itemScroll, classCSS, idInterval) {
    clearInterval(bizagi.util.autoScrollInterval[idInterval]);
    if (classCSS) {
        $('body').addClass(classCSS);
    }
    var valueMaxScrollBottom = $(itemScroll)[0].scrollHeight - $(itemScroll).innerHeight();
    if (itemScroll.scrollTop() >= valueMaxScrollBottom) {
        clearInterval(bizagi.util.autoScrollInterval[idInterval]);
    } else {
        clearInterval(bizagi.util.autoScrollInterval[idInterval]);
        bizagi.util.autoScrollInterval[idInterval] = setInterval(function () {
            bizagi.util.autoScrollBottom($('html'));
            if (itemScroll.scrollTop() < valueMaxScrollBottom) {
                itemScroll.scrollTop(itemScroll.scrollTop() + 40);
            } else {
                clearInterval(bizagi.util.autoScrollInterval[idInterval]);
            }
        }, 100);
    }
};
/*remove auto scroll*/
bizagi.util.removeAutoScroll = function (classCSS, idInterval) {
    $('body.' + classCSS).unbind('mousemove').removeClass(classCSS);
    clearInterval(bizagi.util.autoScrollInterval[idInterval]);
    bizagi.util.autoScrollInterval.init = false;
};

bizagi.util.getMaxZIndex = function(selector){
    selector = selector || $("div,span");
    return Math.max.apply(null, $(selector).map(function(){
        var zIndex;
        return isNaN(zIndex = parseInt($(this).css("z-index"), 10)) ? 0 : zIndex;
    }));
};

/*
* Creates a native popup to open an url
*/
bizagi.showPopup = function (url, params, callbackFn) {
    var width = params.width || 1024;
    var height = params.height || 768;
    var top = $(window).height() / 2 - height / 2;
    var left = $(window).width() / 2 - width / 2;
    // Creates a popup window
    var newWindow = window.open(url, "", "width=" + width + ",height=" + height + ", top=" + top + ", left=" + left + ", Menubar=NO, Location=NO, Status=NO, scrollbars=YES");
    // Define args to call the function
    window.BAPopupWindow = newWindow;
    window.BAPopupCallback = callbackFn;
    // Define BACLoseWindow in this context, so the external content calls window.opener.BACloseWindow
    window.BACloseWindow = function (controls, submitForm) {
        // Close dialog
        window.BAPopupWindow.close();
        // Executes the callback to assign values and submit form (if requested)
        window.BAPopupCallback(controls, submitForm);
    };
};
/**
* Creates a native popup in quirks mode to open an url
* 
* @param url string page to open into popup
* @param params json {width,height,title,afterLoad}
*/
bizagi.showQuirksModePopup = function (url, params) {
    var quirksModePage = window.BIZAGI_PATH_TO_BASE + "quirks.html";
    var width = params.width || 1024;
    var height = params.height || 768;
    var top = $(window).height() / 2 - height / 2;
    var left = $(window).width() / 2 - width / 2;
    // Creates a popup window
    var newWindow = window.open(quirksModePage, "bizagiPopup", "width=" + width + ",height=" + height + ", top=" + top + ", left=" + left + ", Menubar=NO, Location=NO, Status=NO, scrollbars=YES");
    window.BAQuirksPopupWindow = newWindow;
    // Attempto to set a window title
    setTimeout(function () {
        try {
            newWindow.document.title = params.title;
        } catch (e) {
        }
    }, 50);
    // We use a hack to eval content inside the popup
    $(newWindow).callInsidePopup(function (windowParams) {

        var $ = windowParams.jQuery;
        var popupWindow = windowParams.popupWindow;
        popupWindow.quirksOnLoad = function () {
            var loadedBody = $("body", popupWindow.document);
            var iframe = $("iframe", loadedBody);
            // Remove waiting
            loadedBody.removeClass("ui-bizagi-loading-message");
            iframe.show();
            // Hacks the iframe
            // This event will fire each time the iframe change its location
            var afterLoad = windowParams.userParams.afterLoad;
            if (afterLoad && afterLoad != null) {
                var callbackParams = $.extend(windowParams.userParams, {
                    popupWindow: popupWindow
                });
                iframe.callInside(afterLoad, callbackParams);
            }
        };
        var loadingFunction = function () {
            var body = $("body", popupWindow.document);
            // Create the iframe inside the new window
            if (body.length > 0) {
                body.append("<iframe scrolling='yes' id='innerFrameContent' src='" + windowParams.url + "' style='width: 100%; height: 100%; display:none' frameborder='0' onload='quirksOnLoad();'></iframe>");
            } else {
                // Try again
                setTimeout(function () {
                    loadingFunction();
                }, 50);
            }
        };
        // Execute loading function
        loadingFunction();
    }, {
        jQuery: $,
        userParams: params,
        popupWindow: newWindow,
        url: url
    });
};
/*
*   Returns the resolved result from a promise when the promise has been executed already
*/
bizagi.resolveResult = function (promise) {
    var result;
    promise.done(function (data) {
        result = data;
    });
    return result;
};
/*
*   Creates a popup using overlay style
*/
bizagi.createPopup = function (params) {
    var popupName = params.name, onClose = params.onClose, popupHeader;
    var popupTitle = (params.title) ? params.title : '';
    var overlay = $('<div class="ui-widget-overlay ' + popupName + '-overlay" />');
    var popup = $('<div class="' + popupName + '-popup  ui-popup-modal"/>').appendTo(overlay);
    var closeButton = $('<div class="' + popupName + '-btn-close biz-btn-close"><i class="biz-icon ui-close-btn bz-studio bz-black bz-false_16x16_black"></i></div>').appendTo(popup);
    if (params.title) {
        popupHeader = $('<div class="' + popupName + '-popup-header ui-popup-header" ><h3>' + popupTitle + '</h3></div>').appendTo(popup);
    }

    var popupContent = $('<div class="' + popupName + '-popup-content" />').appendTo(popup);
    // Add to body
    popup.hide();
    if (params.additionalClass)
        popup.addClass(params.additionalClass);
    var container = params.container || "body";
    overlay.appendTo($(container, document));

    if (params.center) {
        // Resize popup to the center
        popup.css("top", (overlay.height() - popup.height()) / 2);
        popup.css("left", (overlay.width() - popup.width()) / 2);
    }
    popup.show();
    // Close handler
    var closeHandler = function (params) {
        overlay.detach();
        if (onClose)
            onClose(params);
    };
    closeButton.click(closeHandler);
    // Return a full independent object
    return {
        fullPopup: popup,
        overlay: overlay,
        content: popupContent,
        close: function (params) {
            closeHandler(params);
        }
    };
};
/*
* Create an Ok, Cancel popup using bizagi.createPopup()
*/

bizagi.createOkCancelPopup = function (params) {
    params.name = "popup-ok-cancel";
    var onOk = params.onOk, onCancel = params.onCancel;
    var popup = bizagi.createPopup(params);
    var container = $("<div></div>").addClass("container-okcancel-popup");
    var message = $("<div></div>").addClass("message-okcancel-popup ui-light-bevel-border biz-gradient-v");
    var buttonsContainer = $("<div></div>").addClass("buttonsContainer-okcancel-popup biz-actions-bar");
    message.text(params.message);
    message.appendTo(container);
    var buttonOk = $("<span></span>").addClass("ok-button-okcancel-popup editor-ui-button-actions biz-action-btn biz-btn");
    var buttonCancel = $("<span></span>").addClass("cancel-button-okcancel-popup editor-ui-button-actions biz-action-btn biz-btn");
    buttonOk.text(bizagi.localization.getResource("bizagi-editor-okcancel-ok"));
    buttonCancel.text(bizagi.localization.getResource("bizagi-editor-okcancel-cancel"));
    buttonOk.appendTo(buttonsContainer);
    buttonCancel.appendTo(buttonsContainer);
    buttonsContainer.appendTo(container);
    container.appendTo(popup.content);
    var okHandler = function () {
        popup.close();
        if (typeof (onOk) == "function") {
            onOk();
        }
    };
    buttonOk.click(okHandler);
    var cancelHandler = function () {
        popup.close();
        if (typeof (onCancel) == "function") {
            onCancel();
        }
    };
    buttonCancel.click(cancelHandler);
    return {
        close: function () {
            popup.close();
        },
        ok: function () {
            okHandler();
        },
        cancel: function () {
            cancelHandler();
        }
    };
};
/*
* Create an generic dialog
*/
bizagi.dialog = function (params) {

    var dialog = $("<div></div>").addClass("biz-dialog");
    var msg = $("<p></p>");
    msg.text(params.message || "");
    msg.appendTo(dialog);
    dialog.appendTo($("body", document));
    dialog.dialog({
        title: params.title,
        modal: true,
        buttons: params.buttons,
        close: function () {
            dialog.dialog("destroy");
        }
    });
};
/*
*   Close the quirks mode popup window
*/
bizagi.closeQuirksModePopup = function () {
    var quirksPopup = window.BAQuirksPopupWindow;
    window.BAQuirksPopupWindow = null;
    try {
        if (quirksPopup)
            quirksPopup.close();
    } catch (e) {
    }
};
/**
* Get css class definition to string
*/
bizagi.getStyle = function (style) {
    var pathName = location.href.replace("/default.aspx", "");
    var getFontFace = (style.match(/@/)) ? true : false;
    var matchFontFace = "@font-face";
    var getAllChildrens = (style.match(/\*/)) ? true : false;
    var matchStyles = new RegExp(style.replace("*", ""), "g");
    var stringCss = "";
    var css;
    if (style == "") {
        return "";
    }
    var awesomeBrowser = function (style) {
        for (var file = 0; file < document.styleSheets.length; file++) {
            css = document.styleSheets[file].rules || document.styleSheets[file].cssRules;
            if (css != null) {
                for (var key = 0; key < css.length; key++) {
                    if (document.styleSheets[file].href != null && (document.styleSheets[file].href.match(/less.css/g) == null || BIZAGI_ENVIRONMENT == "release")) {

                        var cssTextOriginal = (css[key].cssText) ? css[key].cssText : '';
                        // Get all matches
                        if (getAllChildrens) {
                            if (css[key].selectorText != undefined && css[key].selectorText.match(matchStyles) != null) {

                                if ($.browser.webkit) {
                                    stringCss += css[key].cssText.replace(/\(path\)/g, "");
                                } else if ($.browser.msie && $.browser.version == "8.0") {
                                    stringCss += css[key].style.cssText;
                                } else {
                                    stringCss += css[key].cssText.replace(/\(path\)/g, "../../jquery/workportal/css/desktop");
                                }
                            }
                        } else if (css[key].selectorText != undefined && css[key].selectorText == style) {
                            stringCss += css[key].cssText;
                        }

                        // Get @font-face
                        if (getFontFace) {
                            if (css[key] != undefined && cssTextOriginal != undefined) {
                                if (cssTextOriginal.indexOf(matchFontFace) != -1) {

                                    if ($.browser.webkit) {
                                        stringCss += cssTextOriginal.replace(/jquery\/workportal\/css\/desktop\//g, "").replace(/\(path\)/g, "");
                                    } else {
                                        stringCss += cssTextOriginal.replace(/\(path\)/g, "../../");
                                    }

                                }
                            }
                        }
                    }
                }
            }
        }
        return stringCss;
    };
    var suckBrowser = function (style) {
        if ($.browser.version == "8.0") {
            // That is crazy, but it has the same document.styleSheets structure to chrome and mozilla
            return awesomeBrowser(style);
        }
        var lastLevel;
        for (var file = 0; file < document.styleSheets.length; file++) {
            css = document.styleSheets[file].cssRules || document.styleSheets[file].rules;

            if (css != null) {
                for (var key = 0; key < css.length; key++) {
                    if (BIZAGI_ENVIRONMENT == "release") {
                        // Get all matches 
                        if (getAllChildrens) {
                            if (css[key].selectorText != undefined && css[key].selectorText.match(matchStyles) != null) {
                                stringCss += css[key].cssText.replace(/\(path\)/g, pathName + "/jquery/workportal/css/desktop");
                            } else if (css[key].selectorText != undefined && css[key].selectorText == style) {
                                stringCss += css[key].cssText.replace(/\(path\)/g, pathName + "/jquery/workportal/css/desktop");
                            }
                        }
                    } else if (css[key].href != null && css[key].href != undefined && css[key].href.match(/less.css/g) == null) {
                        // Get all matches 
                        lastLevel = css[key].styleSheet.cssRules || [];
                        for (var n = 0; n < lastLevel.length; n++) {
                            if (getAllChildrens) {
                                if ((lastLevel[n].selectorText != undefined || lastLevel[n].selectorText != null) && lastLevel[n].selectorText.match(matchStyles) != null) {
                                    //stringCss += lastLevel[n].cssText;
                                    stringCss += lastLevel[n].cssText.replace(/\(path\)/g, pathName + "/jquery/workportal/css/desktop");
                                }
                            } else if (lastLevel[n].selectorText != undefined && lastLevel[n].selectorText == style) {
                                // stringCss += lastLevel[n].cssText;
                                stringCss += lastLevel[n].cssText.replace(/\(path\)/g, pathName + "/jquery/workportal/css/desktop");
                            }
                        }
                    }
                }
            }
        }
        return stringCss;
    };
    var result = ($.browser.msie) ? suckBrowser(style) : awesomeBrowser(style);
    return result;
};
/**
* Set and retrieve Cookie
*/
bizagi.cookie = function (key, value, options) {
    // key and at least value given, set cookie...
    if (arguments.length > 1 && String(value) !== "[object Object]") {
        options = $.extend({}, options);
        if (value === null || value === undefined) {
            options.expires = -1;
        }

        if (typeof options.expires === 'number') {
            var days = options.expires, t = options.expires = new Date();
            t.setDate(t.getDate() + days);
        }

        value = String(value);
        return (document.cookie = [
            encodeURIComponent(key), '=',
            options.raw ? value : encodeURIComponent(value),
            options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
            options.path ? '; path=' + options.path : '',
            options.domain ? '; domain=' + options.domain : '',
            options.secure ? '; secure' : ''
        ].join(''));
    }

    // key and possibly options given, get cookie...
    options = value || {};
    var result, decode = options.raw ? function (s) {
        return s;
    } : decodeURIComponent;
    return (result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(document.cookie)) ? decode(result[1]) : null;
};
/**
* Returns a random integer between min and max
*/
bizagi.util.randomNumber = function (min, max) {
    min = min || 1;
    max = max || 10000000;
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Set global context values
 * @param params onject
 * @param reset boolean
 */
bizagi.util.setContext = function (params, reset) {
    params = params || {};
    reset = reset || false;
    if (reset) {
        bizagi.context = {};
    }
    $.each(params, function (key, value) {
        bizagi.context[key] = value;
    });

    // Fix camel case in idWorkItem Property
    bizagi.context["idWorkItem"] = bizagi.context["idWorkitem"];
};
/**
* Control recursive calls of setTimeout
* @param params json {name:name of call,call: function call}
* @return void
*/
bizagi.util.setInterval = function (params) {
    var _name = params.name || 'default';
    var _call = params.call || function () {
    };
    var _params = params.params || {};
    var _singleton = params.singleton || false;
    var _timeOut = params.timeout || 5000;
    var _maxIterations = params.iterations || 1000;
    var _context = params.context || "true;";
    // If callback its diferent to context, remove from hash
    var _killWhenExitContext = (params.hasOwnProperty('killWhenExitContext')) ? params.killWhenExitContext : true;
    bizagi.timeOut = bizagi.timeOut || {};
    if (bizagi.timeOut[_name] == undefined) {
        bizagi.timeOut[_name] = [];
    }

    // Check if singleton (run once)
    if (_singleton && bizagi.timeOut[_name] != undefined) {
        bizagi.timeOut[_name] = [];
    }


    bizagi.timeOut[_name].push({
        name: _name,
        params: _params,
        call: _call,
        singleton: _singleton,
        timeOut: _timeOut,
        iterations: 0,
        maxIterations: _maxIterations,
        context: _context,
        killWhenExitContext: _killWhenExitContext,
        itsRunning: false,
        timeInit: Math.round((new Date()).getTime())
    });
    var executeTimeOut = function () {
        $.each(bizagi.timeOut, function (k, v) {
            $.each(v, function (key, value) {
                var now = Math.round((new Date()).getTime());
                var actualIterations = Math.round((now - value.timeInit) / value.timeOut);
                bizagi.timeOut[value.name][key]['iterations'] = actualIterations;
                if (actualIterations < value.maxIterations) {
                    // Check context					
                    if (eval(value.context)) {
                        if (!value.itsRunning) {
                            if (value.params)
                            // Create a virtual function to IE
                                if ($.browser.msie) {
                                    var ieFunction = function () {
                                        return value.call(value.params);
                                    };
                                }

                            bizagi.timeOut[value.name][key]['pointer'] = ($.browser.msie) ? setInterval(ieFunction, value.timeOut, 'JavaScript') : setInterval(value.call, value.timeOut, value.params);
                            bizagi.timeOut[value.name][key]['itsRunning'] = true;
                        }
                    } else if (value.killWhenExitContext) {
                        bizagi.timeOut[value.name].splice(key, 1);
                        clearTimeout(value.pointer);
                    } else {
                        bizagi.timeOut[value.name][key]['itsRunning'] = false;
                        clearTimeout(value.pointer);
                    }
                } else {
                    // Cancel timeout and remove call from hash
                    clearTimeout(value.pointer);
                    bizagi.timeOut[value.name].splice(key, 1);
                }
            });
        });
    }

    if (!bizagi.timeOutRunning) {
        bizagi.timeOutRunning = true;
        setInterval(executeTimeOut, 1000);
    }
};
bizagi.util.isDate = function (value) {
    // type A) dd/mm/aaaa 
    // type B) aaaa/mm/dd
    // type C) aa/mm/dd

    var dateRegEx_typeA = /^\d{1,2}\/\d{1,2}\/\d{4}$/,
        dateRegEx_typeB = /^\d{4}\/\d{1,2}\/\d{1,2}$/,
        dateRegEx_typeC = /^\d{1,2}\/\d{1,2}\/\d{1,2}$/,
        timeRegEx = /^\d{1,2}:\d{2}(:\d{2})?(\s[aApP][mM])?$/,
        result = false,
        resultDate = false,
        hasTime = false,
        resultTime = false;

    value = value || '';

    var arrayDate = value.toString().split(" "),
        dateField,
        timeField;

    dateField = arrayDate[0];

    if (dateRegEx_typeA.test(dateField) || dateRegEx_typeB.test(dateField) || dateRegEx_typeC.test(dateField)) {
        resultDate = true;
    }

    if (arrayDate.length > 1) {
        
        timeField = arrayDate[1];

        hasTime = true;

        //Checks if AM/PM included in the time element
        if(arrayDate.length == 3)
            timeField = timeField + ' ' + arrayDate[2];
        
        if (timeRegEx.test(timeField)) 
            resultTime = true;
    }
    
    if(hasTime)
        result = resultDate && resultTime;
    else
        result = resultDate;
    
    return result;
};
/*
*   Encodes unicode characters into html
*/
bizagi.util.unicode2htmlencode = function (input) {
    // Shorten
    var natCCA = 'charCodeAt';
    input = input.replace(/\r\n/g, '\n');
    var i, b1, hex,
            len = input.length,
            htmlHex = '';
    for (i = 0; i < len; i++) {
        b1 = input[natCCA](i);
        hex = b1.toString(16);
        htmlHex += '&#x' + hex + ';';
    }
    return htmlHex;
};
/*
*   Gets the head element from the DOM
*/
bizagi.util.getHeadElement = function () {
    var hd = document.getElementsByTagName("head")[0];
    var docEl = document && document.documentElement;
    if (!hd) {
        hd = document.createElement("head");
        docEl.insertBefore(hd, docEl.firstChild);
    }
    // replace head so it runs fast next time.
    bizagi.util.getHeadElement = function () {
        return hd;
    };
    return hd;
};
/*
*   Loads a css text into the current document
*/
bizagi.util.loadStyle = function (styleText, layoutGuid) {

    var element = document.getElementById(layoutGuid);

    if (styleText && !element) { // less
        var css = document.createElement("style");
        css.type = "text/css";
        css.id = layoutGuid;
        if (css.styleSheet) { // IE
            css.styleSheet.cssText = styleText;
        } else {
            (function (node) {
                if (css.childNodes.length) {
                    if (css.firstChild.nodeValue !== node.nodeValue) {
                        css.replaceChild(node, css.firstChild);
                    }
                } else {
                    css.appendChild(node);
                }
            })(document.createTextNode(styleText));
        }
        bizagi.util.getHeadElement().appendChild(css);
    }
};

/*
*   Loads a css text of the icon widget into the current document
*/
bizagi.util.loadIconStyle = function (icon, userfieldname) {
    bizagi.log("bizagi.util.loadIconStyle");
    var css = document.createElement("style");
    css.type = "text/css";

    var cssText = ".mtool-item-image-" + userfieldname + " { background:url(data:image/png;base64," + icon + "); }";
    css.innerHTML = cssText;

    bizagi.util.getHeadElement().appendChild(css);
};

bizagi.util.formatDecimalAndMoneyCell = function (tableData, externalMoneyFormat) {
    var moneyFormat, decimalFormat, i, j;
    var externalDecimalFormat = {
        decimalSymbol: externalMoneyFormat.decimalSeparator,
        digitGroupSymbol: externalMoneyFormat.groupSeparator,
        roundToDecimalPlace: externalMoneyFormat.decimalDigits
    };
    var defaultMoneyFormat = {
        symbol: "€",
        decimalSeparator: ",",
        groupSeparator: ".",
        decimalDigits: "2"
    };
    var defaultDecimalFormat = {
        colorize: false,
        decimalSymbol: ".",
        digitGroupSymbol: ",",
        groupDigits: true,
        negativeFormat: "(%s%n)",
        positiveFormat: "%s%n",
        roundToDecimalPlace: "2",
        symbol: ""
    };

    moneyFormat = $.extend(defaultMoneyFormat, externalMoneyFormat);
    decimalFormat = $.extend(defaultDecimalFormat, externalDecimalFormat);

    for (i = 0; i < tableData.columnTitle.length; i++) {
        if (tableData.columnTitle[i].type.toUpperCase() == "MONEY") {
            for (j = 0; j < tableData.rows.length; j++) {
                tableData.rows[j].fields[i] = bizagi.util.formatMoney(tableData.rows[j].fields[i], moneyFormat);
            }
        }
        if (tableData.columnTitle[i].type.toUpperCase() == "FLOAT" || tableData.columnTitle[i].type.toUpperCase() == "REAL") {
            for (j = 0; j < tableData.rows.length; j++) {
                var numberValue = bizagi.util.formatDecimal(tableData.rows[j].fields[i], decimalFormat);
                //Gets rids of unnecessary zeros
                if (bizagi.override.removeTrailingZeros === true) {
                    var positive = true;
                    if (numberValue.toString().indexOf(")") != -1) {
                        positive = false;
                        numberValue = numberValue.replace("(", "").replace(")", "");
                    }
                    var re = new RegExp("("+BIZAGI_DEFAULT_CURRENCY_INFO.decimalSeparator+"\\d*?[1-9])0+$", "g");
                    numberValue = numberValue.replace(re, "$1");
                    re = new RegExp("\\"+BIZAGI_DEFAULT_CURRENCY_INFO.decimalSeparator+"0+$", "g");
                    numberValue = numberValue.replace(re, "");

                    if (!positive) numberValue = "(" + numberValue + ")";
                }
                tableData.rows[j].fields[i] = numberValue;
            }
        }
    }

    return tableData;
};


bizagi.util.formatBoolean = function (value) {
    var self = this;
    if (bizagi.util.parseBoolean(value) == true) {
        return bizagi.localization.getResource("render-boolean-yes");
    } else if (bizagi.util.parseBoolean(value) == false) {
        return bizagi.localization.getResource("render-boolean-no");
    } else {
        return "";
    }
};

bizagi.util.formatInvariantBoolean = function (htmlContent) {
    htmlContent = htmlContent || "";
    $(".formatBoolean", htmlContent).not(".formatted").each(function (index, element) {
        var $element = $(element);
        var content = $element.html();
        $element.addClass("formatted");
        try {
            var formatBoolean = bizagi.util.formatBoolean(content);
            $element.html(formatBoolean);
        } catch (e) {
            $element.html(content);
        }
    });
};

bizagi.util.formatDecimal = function (value, format) {
    var i = $("<i/>").text(value);
    i.formatCurrency(format);
    return i.text();
};

/*
* Format monetary cells
*/
bizagi.util.formatMonetaryCells = function (tableData, moneyFormat) {

    var defaultFormat = {
        symbol: "€",
        decimalSeparator: ",",
        groupSeparator: ".",
        decimalDigits: "2"
    };

    moneyFormat = moneyFormat || defaultFormat;

    for (var i = 0; i < tableData.columnTitle.length; i++) {
        if (tableData.columnTitle[i].type.toUpperCase() == "MONEY") {
            for (var j = 0; j < tableData.rows.length; j++) {
                tableData.rows[j].fields[i] = bizagi.util.formatMoney(tableData.rows[j].fields[i], moneyFormat);
            }
        }
    }

    return tableData;

};

/*
* Format monetary values, the format must have the structure of the next example:
*
* var defaultFormat = {
*        symbol: "€",
*        decimalSeparator: ",",
*        groupSeparator: ".",
*        decimalDigits: "2"
*    };
*/
bizagi.util.formatMoney = function (value, format) {
    var result = "",
        tmpResult = "",
        intSection = "",
        decimalSection = "",
        decimalResult = "",
        isNegative = (value<0);

    if(value == null){
        value = "";
    }

    value = value.toString();

    if (value.length >= 1) {
        var decimalDigitPosition = value.indexOf(".");

        if (decimalDigitPosition > 0) {
            value = bizagi.util.fixDecimalDigits(value, format.decimalDigits);
            intSection = value.substring(0, decimalDigitPosition).replace(/\D/g, '');
        } else {
            var zeroChar = "0";

            for (var i = 0; i < format.decimalDigits; i++) {
                decimalResult += zeroChar;
            }
            intSection = value.replace(/\D/g, '');
        }

        //take only the number characters removing other characters
        value = value.replace(/\D/g, '');
        //take the decimal section
        if (format.decimalDigits > 0) {
            decimalSection = decimalDigitPosition > 0 ? format.decimalSeparator + value.substring(value.length - format.decimalDigits, value.length) : format.decimalSeparator + decimalResult;
        } else {
            decimalSection = "";
        }
        //insert groupSeparators into int section
        if (intSection.length > 3) {
            var count = 0;

            //insert separator from end to begin
            for (var i = intSection.length - 1; i >= 0; i--) {
                if (count == 3) {
                    tmpResult += ".";
                    count = 0;
                }
                tmpResult += intSection[i];
                count += 1;
            }
            //revert the string to get the result value
            for (var i = tmpResult.length - 1; i >= 0; i--) {
                result += tmpResult[i];
            }
        } else {
            result = intSection;
        }

        //replace the correct group separator
        result = result.replaceAll(".", format.groupSeparator);
        //unify all sections and finish format
        if (isNegative) {
            var negativeFormat = bizagi.localization.getResource('numericFormat').negativeFormat;
            result = negativeFormat.replace("%s", format.symbol).replace("%n", result + decimalSection);
        }
        else {
            result = format.symbol + result + decimalSection;
        }

        return result;
    }
    else {
        return value;
    }


};

/*
    This method was created because the "toFixed()" JavaScript method in some cases round the numbers when it is not needed.
    Can return string or number.
*/
bizagi.util.fixDecimalDigits = function (value, decimalDigits) {
    var decimalDigitPosition,
        intSection,
        decimalSection;

    decimalDigitPosition = value.indexOf('.');
    intSection = value.substring(0, decimalDigitPosition);
    decimalSection = value.substring(decimalDigitPosition + 1, value.length);

    console.log(decimalDigitPosition, intSection, decimalSection);
    if (decimalDigits > decimalSection.length) {
        for (var i = decimalSection.length; i < decimalDigits; i++) {
            value += '0';
        }
    } else {
        value = parseFloat(value).toFixed(decimalDigits);
    }

    return value;

};

/*
 * Format html  money
 */
bizagi.util.formatInvariantMoney = function (htmlContent, moneyFormat) {
    htmlContent = htmlContent || "";
    var defaultFormat = {
        symbol: moneyFormat.symbol,
        decimalSeparator: moneyFormat.decimalSeparator || ",",
        groupSeparator: moneyFormat.groupSeparator || ".",
        decimalDigits: moneyFormat.decimalDigits || "2"
    };
    if(moneyFormat.allowDecimals === false){
        defaultFormat.decimalDigits = "0";
    }

    $(".formatMoney", htmlContent).not(".formated").each(function (index, elem) {
        var content = $(elem).html();
        $(elem).addClass("formated");
        try {
            var value = parseFloat(content);
            if(!isNaN(value)){
                var formatMoney = bizagi.util.formatMoney(value, defaultFormat);
                $(elem).html(formatMoney);
            }
        } catch (e) {
            // Restore the original content
            $(elem).html(content);
        }
    });
};

/*
 * Format html  number
 */
bizagi.util.formatInvariantNumber = function (htmlContent, numberFormat) {
    htmlContent = htmlContent || "";
    var decimalDigits = "2";
    if (numberFormat.decimalDigits == "0")
        decimalDigits = "0";
    else
        decimalDigits = numberFormat.decimalDigits || "2";

    var defaultFormat = {
        symbol: "",
        decimalSeparator: numberFormat.decimalSeparator || ",",
        groupSeparator: numberFormat.groupSeparator || numberFormat.thousands ? "." : "",
        decimalDigits: decimalDigits
    };
    $(".formatMoney", htmlContent).not(".formated").each(function (index, elem) {
        var content = $(elem).html();
        $(elem).addClass("formated");
        try {
            var value = parseFloat(content);
            if(!isNaN(value)){
                var formatNumber = bizagi.util.formatMoney(value, defaultFormat);
                if(numberFormat.percentage){
                    formatNumber = formatNumber.toString() + "%";
                }
                $(elem).html(formatNumber);
            }
        } catch (e) {
            // Restore the original content
            $(elem).html(content);
        }
    });
};

/*
* Format html with invariant date
*/
bizagi.util.formatInvariantDate = function (htmlContent, dateFormat) {
    htmlContent = htmlContent || "";
    dateFormat = dateFormat || "MM/dd/yyyy hh:mm:ss";
    $(".formatDate", htmlContent).not(".formated").each(function (index, elem) {
        var content = $(elem).html();
        $(elem).addClass("formated");
        try {
            var value = new Date(content);
            var formatDate = bizagi.util.dateFormatter.formatDate(value, dateFormat /*self.getResource("dateFormat")*/);
            $(elem).html(formatDate);
        } catch (e) {
            // Restore the original content
            $(elem).html(content);
        }
    });
};

/**
 * Return format date with resources from string invariant date. It use the format specified
 * @param stringDateInvariant, string invariant date
 */
bizagi.util.formatDateFromInvariantStringDate = function (stringInvariantDate){
    if(isValidDate(stringInvariantDate)){
        var dateTimeFormat = bizagi.localization.getResource("dateFormat") + ' ' + bizagi.localization.getResource("timeFormat");
        var value = new Date(stringInvariantDate);
        var formatDate = bizagi.util.dateFormatter.formatDate(value, dateTimeFormat);
        return formatDate;
    }
    return stringInvariantDate || "";
};

/**
 * Format value by dataType
 */

bizagi.util.formatValueByDataType = function(value, dataType){
    /**
     * Types Definedin Backend
     * None = 0,BigInt = 1,Int = 2,SmallInt = 3,TinyInt = 4,Boolean = 5,Decimal = 6,Numeric = 7,Money = 8,Float = 10,Real = 11,DateTime = 12,SmallDateTime = 13,
     Char = 14,VarChar = 15,Text = 16,Binary = 17,VarBinary = 18,Image = 19,Guid = 20,NChar = 21,NVarChar = 22,NText = 23,MxMBidirectionalRelationship = 24,
     MxMUnidirectionalRelationship = 25,EntityDisabled = 26,UserAuth = 27,MxMUnidirectionalRelationshipWithoutFilter = 28,OracleNumber = 29,
     Stakeholder = 30,ActivityItems = 31
     *
     * */
    var result = value;
    switch(dataType) {
        case "NText":
        case 23:
        case "Char":
        case 14:
        case "VarChar":
        case 15:
        case "Text":
        case 16:
            if (value && value.length > 30) {
                result = bizagi.util.replaceLineBreak(value);
            }
            break;
        case "Boolean":
        case 5:
        case "Binary":
        case 17:
            result = bizagi.util.formatBoolean(value);
            break;
        case "Int":
        case 2:
        case "BigInt":
        case 1:
        case "SmallInt":
        case 3:
        case "TinyInt":
        case 4:
        case "Numeric":
        case 7:
            result = value || "";
            break;
        case "Money":
        case 8:
            result = bizagi.util.formatMonetaryCell(value);
            break;
        case "Float":
        case 10:
        case "Real":
        case 11:
        case "Decimal":
        case 6:
            result = bizagi.util.formatDecimalCell(value);
            break;
        case "DateTime":
        case 12:
        case "SmallDateTime":
        case 13:
            result = bizagi.util.formatDateFromInvariantStringDate(value);
            break;
    }
    if(result == null){
        result = "";
    }
    return result;
}

/**
* Check if it is a valid date
*/
function isValidDate(params) {
    if (typeof (params) != "undefined" && params != null) {
        var parseDate = new Date(params);
        return !isNaN(parseDate.valueOf());
    } else return false;
}


/*
*   Defines a date time formatter that will be available globally
*/
bizagi.util.monthNames = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec');
bizagi.util.dayNames = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat');
bizagi.util.dateFormatter = new function () {
    this.LZ = function (x) {
        return (x < 0 || x > 9 ? "" : "0") + x;
    };
    /*
    *   isDate ( date_string, format_string )
    *   Returns true if date string matches format of format string and
    *   is a valid date. Else returns false.
    *   It is recommended that you trim whitespace around the value before
    *   passing it to this function, as whitespace is NOT ignored!
    */
    this.isDate = function (val, format) {
        var date = this.getDateFromFormat(val, format);
        if (date == 0) {
            return false;
        }
        return true;
    };

    this.getRelativeTime = function (date, dateFormat, onlyUnitsTime) {

        var self = this;
        var now = new Date();
        var time = (date instanceof Date) ? date : kendo.parseDate(date, dateFormat);
        var diff = now.getTime() - time.getTime();
        var timeDiff = getTimeDiffDescription(diff, 'year', 31536000000, onlyUnitsTime);

        if (!timeDiff) {
            timeDiff = getTimeDiffDescription(diff, 'month', 2628000000, onlyUnitsTime);
            if (!timeDiff) {
                timeDiff = getTimeDiffDescription(diff, 'week', 604800000, onlyUnitsTime);
                if (!timeDiff) {
                    timeDiff = getTimeDiffDescription(diff, 'day', 86400000, onlyUnitsTime);
                    if (!timeDiff) {
                        timeDiff = getTimeDiffDescription(diff, 'hour', 3600000, onlyUnitsTime);
                        if (!timeDiff) {
                            timeDiff = getTimeDiffDescription(diff, 'minute', 60000, onlyUnitsTime);
                            if (!timeDiff) {
                                if(onlyUnitsTime){
                                    if(diff === 0){
                                        timeDiff = getTimeDiffDescription(diff + 1, 'minute', 1, onlyUnitsTime);
                                    }
                                    else{
                                        timeDiff = getTimeDiffDescription(diff, 'minute', 1, onlyUnitsTime);
                                    }
                                }
                                else{
                                    timeDiff = getTimeDiffDescription(diff, 'second', 2000, onlyUnitsTime);
                                    if (!timeDiff) {
                                        timeDiff = bizagi.localization.getResource("workportal-relativetime-momentago");
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        return timeDiff;

        /*
        * Get Time Difference
        */
        function getTimeDiffDescription(diff, unit, timeDivisor, onlyUnitsTime) {
            var unitAmount = (diff / timeDivisor).toFixed(0);

            if (unitAmount > 0) {
                if(onlyUnitsTime){
                    return (unitAmount == 1 ? bizagi.localization.getResource("workportal-relativetime-" + unit).replace("%s", unitAmount) : bizagi.localization.getResource("workportal-relativetime-" + unit + "s").replace("%s", unitAmount));
                }
                else{
                    var resourceAgo = bizagi.localization.getResource("workportal-relativetime-ago");
                    return (unitAmount == 1 ? resourceAgo.replace("%s", bizagi.localization.getResource("workportal-relativetime-" + unit).replace("%s", unitAmount)) : resourceAgo.replace("%s", bizagi.localization.getResource("workportal-relativetime-" + unit + "s").replace("%s", unitAmount)));
                }

            } else {
                return null;
            }
         }
    };

    /*
    *   compareDates(date1,date1format,date2,date2format)
    *   Compare two date strings to see which is greater.
    *   Returns:
    *   1 if date1 is greater than date2
    *   0 if date2 is greater than date1 of if they are the same
    *  -1 if either of the dates is in an invalid format
    */
    this.compareDates = function (date1, dateformat1, date2, dateformat2) {
        var d1 = getDateFromFormat(date1, dateformat1);
        var d2 = getDateFromFormat(date2, dateformat2);
        if (d1 == 0 || d2 == 0) {
            return -1;
        }
        else if (d1 > d2) {
            return 1;
        }
        return 0;
    };
    /*
     *   getDifferenceBetweenDates(date1,date2, unit)
     *   Compare two date objects to see difference between them. The number result by unit specified.
     *
     *   Returns:
     *   Difference value between two dates.
     *   Message string if either of the dates is in an invalid format
     */
    this.getDifferenceBetweenDates = function (date1, date2, unit) {
        if(date1 instanceof Date && date1 instanceof Date){
            switch (unit){
                case "seconds":
                    return (date2.getTime() - date1.getTime())/1000;
                case "milliseconds":
                    return (date2.getTime() - date1.getTime());
                default:
                    return "unit is not Defined"
            }
        }
        else
        {
            return "one param not is Date"
        }

    };
    /*
    *   formatDate (date_object, format)
    *   Returns a date in the output format specified.
    *   The format string uses the same abbreviations as in getDateFromFormat()
    */
    this.formatDate = function (date, format, i18n) {
        // Check if date is valid
        if (!isValidDate(date) || date == 0) {
            return "";
        }

        var monthNames = bizagi.util.monthNames;
        var dayNames = bizagi.util.dayNames;
        format = format + "";
        var result = "";
        var i_format = 0;
        var c;
        var token;
        var y = date.getFullYear() + "";
        var M = date.getMonth() + 1;
        var d = date.getDate();
        var E = date.getDay();
        var H = date.getHours();
        var m = date.getMinutes();
        var s = date.getSeconds();
        var f = date.getMilliseconds();
        // Convert real date parts into formatted versions
        var value = new Object();

        if (i18n) {
            var months = i18n.monthNames.concat(i18n.monthNamesShort);
            var days = i18n.dayNames.concat(i18n.dayNamesShort);
            monthNames = monthNames.toString() === months.toString() ? monthNames : months;
            dayNames = dayNames.toString() === days.toString() ? dayNames : days;
        }

        if (y.length < 4 || (y.charAt(0) === "-" && y.length < 5)) {
            y = "" + (y - 0 + 1900);
        }
        value["y"] = "" + y;
        value["yyyy"] = y;
        value["yy"] = y.substring(2, 4);
        value["M"] = M;
        value["MM"] = this.LZ(M);
        value["MMM"] = monthNames[M + 11];
        value["MMMM"] = monthNames[M - 1];
        value["NNN"] = monthNames[M + 11];
        value["d"] = d;
        value["dd"] = this.LZ(d);
        value["ddd"] = dayNames[E + 7];
        value["dddd"] = dayNames[E];
        value["E"] = dayNames[E + 7];
        value["EE"] = dayNames[E];
        value["H"] = H;
        value["HH"] = this.LZ(H);
        value["tt"] = H < 12 ? "am" : "pm";
        value["TT"] = H < 12 ? "AM" : "PM";


        if (H == 0) {
            value["h"] = 12;
        }
        else if (H > 12) {
            value["h"] = H - 12;
        }
        else {
            value["h"] = H;
        }
        value["hh"] = this.LZ(value["h"]);
        if (H > 11) {
            value["K"] = H - 12;
        } else {
            value["K"] = H;
        }
        value["k"] = H + 1;
        value["KK"] = this.LZ(value["K"]);
        value["kk"] = this.LZ(value["k"]);
        if (H > 11) {
            value["a"] = "PM";
        }
        else {
            value["a"] = "AM";
        }
        value["m"] = m;
        value["mm"] = this.LZ(m);
        value["s"] = s;
        value["ss"] = this.LZ(s);
        value["FFF"] = f;

        while (i_format < format.length) {
            c = format.charAt(i_format);
            token = "";
            while ((format.charAt(i_format) == c) && (i_format < format.length)) {
                token += format.charAt(i_format++);
            }
            if (value[token] != null) {
                result = result + value[token];
            }
            else {
                result = result + token;
            }
        }
        return result;
    };
    /*
    *   getDateFromFormat( date_string , format_string )
    *
    *   This function takes a date string and a format string. It matches
    *   If the date string matches the format string, it returns the 
    *   getTime() of the date. If it does not match, it returns 0.
    */
    this.getDateFromFormat = function (val, format, i18n) {
        var monthNames = bizagi.util.monthNames;
        var dayNames = bizagi.util.dayNames;
        val = val + "";
        format = format + "";
        var i_val = 0;
        var i_format = 0;
        var c;
        var token;
        var x = 0, y = 0;
        var now = new Date();
        var year = now.getYear();
        var month = now.getMonth() + 1;
        var date = 1;
        var hh = now.getHours();
        var mm = now.getMinutes();
        var ss = now.getSeconds();
        var FFF = now.getMilliseconds();
        var ampm = "";

        if (i18n) {
            var months = i18n.monthNames.concat(i18n.monthNamesShort);
            var days = i18n.dayNames.concat(i18n.dayNamesShort);
            monthNames = monthNames.toString() === months.toString() ? monthNames : months;
            dayNames = dayNames.toString() === days.toString() ? dayNames : days;
        }

        while (i_format < format.length) {
            // Get next token from format string
            c = format.charAt(i_format);
            token = "";
            while ((format.charAt(i_format) == c) && (i_format < format.length)) {
                token += format.charAt(i_format++);
            }
            // Extract contents of value based on format token
            if (token == "yyyy" || token == "yy" || token == "y") {
                if (token == "yyyy") {
                    x = 4;
                    y = 4;
                }
                if (token == "yy") {
                    x = 2;
                    y = 2;
                }
                if (token == "y") {
                    x = 2;
                    y = 4;
                }
                year = _getInt(val, i_val, x, y);
                if (year == null) {
                    return 0;
                }
                i_val += year.length;
                if (year.length == 2) {
                    if (year > 70) {
                        year = 1900 + (year - 0);
                    }
                    else {
                        year = 2000 + (year - 0);
                    }
                }
            }
            else if (token == "MMMM" || token == "MMM" || token == "NNN") {
                month = 0;
                for (var i = 0; i < monthNames.length; i++) {
                    var month_name = monthNames[i];
                    if (val.substring(i_val, i_val + month_name.length).toLowerCase() == month_name.toLowerCase()) {
                        if (token == "MMMM" || token == "MMM" || (token == "NNN" && i > 11)) {
                            month = i + 1;
                            if (month > 12) {
                                month -= 12;
                            }
                            i_val += month_name.length;
                            break;
                        }
                    }
                }
                if ((month < 1) || (month > 12)) {
                    return 0;
                }
            }
            else if (token == "dddd" || token == "EE" || token == "E") {
                for (var j = 0; j < dayNames.length; j++) {
                    var day_name = dayNames[j];
                    if (val.substring(i_val, i_val + day_name.length).toLowerCase() == day_name.toLowerCase()) {
                        i_val += day_name.length;
                        break;
                    }
                }
            }
            else if (token == "MM" || token == "M") {
                month = _getInt(val, i_val, 1, 2);
                if (month == null || (month < 1) || (month > 12)) {
                    return 0;
                }
                i_val += month.length;
            }
            else if (token == "dd" || token == "d") {
                date = _getInt(val, i_val, 1, 2);
                if (date == null || (date < 1) || (date > 31)) {
                    return 0;
                }
                i_val += date.length;
            }
            else if (token == "hh" || token == "h") {
                hh = _getInt(val, i_val, token.length, 2);
                if (hh == null || (hh < 1) || (hh > 12)) {
                    return 0;
                }
                i_val += hh.length;
            }
            else if (token == "HH" || token == "H") {
                hh = _getInt(val, i_val, token.length, 2);
                if (hh == null || (hh < 0) || (hh > 23)) {
                    return 0;
                }
                i_val += hh.length;
            }
            else if (token == "KK" || token == "K") {
                hh = _getInt(val, i_val, token.length, 2);
                if (hh == null || (hh < 0) || (hh > 11)) {
                    return 0;
                }
                i_val += hh.length;
            }
            else if (token == "kk" || token == "k") {
                hh = _getInt(val, i_val, token.length, 2);
                if (hh == null || (hh < 1) || (hh > 24)) {
                    return 0;
                }
                i_val += hh.length;
                hh--;
            }
            else if (token == "mm" || token == "m") {
                mm = _getInt(val, i_val, token.length, 2);
                if (mm == null || (mm < 0) || (mm > 59)) {
                    return 0;
                }
                i_val += mm.length;
            }
            else if (token == "ss" || token == "s") {
                ss = _getInt(val, i_val, token.length, 2);
                if (ss == null || (ss < 0) || (ss > 59)) {
                    return 0;
                }
                i_val += ss.length;
            }
            else if (token == "FFF") {
                ff = _getInt(val, i_val, token.length, 3);
                if (ff == null || (ff < 0) || (ff > 999)) {
                    return 0;
                }
                i_val += ff.length;
            }
            else if (token == "a") {
                if (val.substring(i_val, i_val + 2).toLowerCase() == "am") {
                    ampm = "AM";
                }
                else if (val.substring(i_val, i_val + 2).toLowerCase() == "pm") {
                    ampm = "PM";
                }
                else {
                    return 0;
                }
                i_val += 2;
            }
            else {
                if (val.substring(i_val, i_val + token.length) != token) {
                    return 0;
                }
                else {
                    i_val += token.length;
                }
            }
        }

        // Is date valid for month?
        if (month == 2) {
            // Check for leap year
            if (((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0)) { // leap year
                if (date > 29) {
                    return 0;
                }
            }
            else {
                if (date > 28) {
                    return 0;
                }
            }
        }
        if ((month == 4) || (month == 6) || (month == 9) || (month == 11)) {
            if (date > 30) {
                return 0;
            }
        }
        // Correct hours value
        if (hh < 12 && ampm == "PM") {
            hh = hh - 0 + 12;
        }
        else if (hh > 11 && ampm == "AM") {
            hh -= 12;
        }
        var newdate = new Date(year, month - 1, date, hh, mm, ss);
        return newdate;
        /*
        *   Utility method for parsing in getDateFromFormat()
        */
        function _isInteger(_val) {
            var digits = "1234567890";
            for (var k = 0; k < _val.length; k++) {
                if (digits.indexOf(_val.charAt(k)) == -1) {
                    return false;
                }
            }
            return true;
        }
        ;
        /*
        *   Utility method for parsing in getDateFromFormat()
        */
        function _getInt(str, l, minlength, maxlength) {
            for (var m = maxlength; m >= minlength; m--) {
                var _token = str.substring(l, l + m);
                if (_token.length < minlength) {
                    return null;
                }
                if (_isInteger(_token)) {
                    return _token;
                }
            }
            return null;
        }
        ;
    };
    /*
    * parseDate( date_string [, prefer_euro_format] )
    *
    * This function takes a date string and tries to match it to a
    * number of possible date formats to get the value. It will try to
    * match against the following international formats, in this order:
    * y-M-d   MMM d, y   MMM d,y   y-MMM-d   d-MMM-y  MMM d
    * M/d/y   M-d-y      M.d.y     MMM-d     M/d      M-d
    * d/M/y   d-M-y      d.M.y     d-MMM     d/M      d-M
    * A second argument may be passed to instruct the method to search
    * for formats like d/M/y (european format) before M/d/y (American).
    * Returns a Date object or null if no patterns match.
    */
    this.parseDate = function (val) {
        var preferEuro = (arguments.length == 2) ? arguments[1] : false;
        var generalFormats = new Array('y-M-d', 'MMM d, y', 'MMM d,y', 'y-MMM-d', 'd-MMM-y', 'MMM d');
        var monthFirst = new Array('M/d/y', 'M-d-y', 'M.d.y', 'MMM-d', 'M/d', 'M-d');
        var dateFirst = new Array('d/M/y', 'd-M-y', 'd.M.y', 'd-MMM', 'd/M', 'd-M');
        var checkList = new Array(generalFormats, preferEuro ? dateFirst : monthFirst, preferEuro ? monthFirst : dateFirst);
        var d;
        for (var i = 0; i < checkList.length; i++) {
            var l = window[checkList[i]];
            for (var j = 0; j < l.length; j++) {
                d = getDateFromFormat(val, l[j]);
                if (d != 0) {
                    return new Date(d);
                }
            }
        }
        return null;
    };
    /*
    *   Method to analyze a time format and checks separator, and hour format, and seconds
    */
    this.analyzeTimeFormat = function (timeFormat) {
        var i = 0;
        var c;
        // Define return object
        var returnObj = {
            show24Hours: false,
            showSeconds: false,
            separator: ":"
        };
        // Analize format
        var token, lastToken = "";
        while (i < timeFormat.length) {
            // Get next token from format string
            c = timeFormat.charAt(i);
            token = "";
            while ((timeFormat.charAt(i) == c) && (i < timeFormat.length)) {
                token += timeFormat.charAt(i++);
            }

            // Extract contents of value based on format token
            if (token == "hh" || token == "h") {
                lastToken = token;
                returnObj.show24Hours = false;
            }
            else if (token == "HH" || token == "H") {
                lastToken = token;
                returnObj.show24Hours = true;
            }
            else if (token == "mm" || token == "m") {
                lastToken = token;
            }
            else if (token == "ss" || token == "s") {
                lastToken = token;
                returnObj.showSeconds = true;
            }
            else if (token == "a") {
                lastToken = token;
            }
            else {
                if (lastToken.toUpperCase() == "H" || lastToken.toUpperCase() == "HH") {
                    returnObj.separator = token;
                }
            }
        }

        return returnObj;
    };
    this.getDateFromInvariant = function (value, showTime) {
        value = (value == null) ? "" : value;
        value = (typeof value != "string") ? value.toString() : value;
        var INVARIANT_FORMAT = "MM/dd/yyyy" + (showTime ? " H:mm:ss" : "");
        if (showTime) {
            if (value && (value.toLowerCase().indexOf("am") > 0 || value.toLowerCase().indexOf("pm") > 0)) {
                INVARIANT_FORMAT = "MM/dd/yyyy h:mm:ss a";
            }
        }
        var date = bizagi.util.dateFormatter.getDateFromFormat(value, INVARIANT_FORMAT);
        // Also try to read the date with full format if the last instruction didn't success
        if (date == 0 && !showTime) {
            INVARIANT_FORMAT = "MM/dd/yyyy H:mm:ss";
            date = bizagi.util.dateFormatter.getDateFromFormat(value, INVARIANT_FORMAT);
        } else if (date == 0 && showTime && value != null && value != "") {
            INVARIANT_FORMAT = "MM/dd/yyyy";
            date = bizagi.util.dateFormatter.getDateFromFormat(value, INVARIANT_FORMAT);
            date.setHours(0, 0, 0, 0);
        }

        return date;
    };
    this.formatInvariant = function (date, showTime) {
        var INVARIANT_FORMAT = "MM/dd/yyyy" + (showTime ? " HH:mm:ss" : "");
        var formattedDate = bizagi.util.dateFormatter.formatDate(date, INVARIANT_FORMAT);
        return formattedDate;
    };
    this.getDateFromISO = function (value, showTime) {
        var ISO_FORMAT = "yyyy-MM-dd" + (showTime ? " HH:mm" : "");
        var date = bizagi.util.dateFormatter.getDateFromFormat(value, ISO_FORMAT);
        // If the date could not be parsed, try it out with seconds
        if (date == 0 && showTime) {
            ISO_FORMAT = "yyyy-MM-dd" + (showTime ? " HH:mm:ss" : "");
            date = bizagi.util.dateFormatter.getDateFromFormat(value, ISO_FORMAT);
        }

        // Also try to read the date with full format if the last instruction didn't success
        if (date == 0 && !showTime) {
            ISO_FORMAT = "yyyy-MM-dd HH:mm";
            date = bizagi.util.dateFormatter.getDateFromFormat(value, ISO_FORMAT);
            // If the date could not be parsed, try it out with seconds
            if (date == 0) {
                ISO_FORMAT = "yyyy-MM-dd HH:mm:ss";
                date = bizagi.util.dateFormatter.getDateFromFormat(value, ISO_FORMAT);
            }
        }

        return date;
    };
    this.formatISO = function (date, showTime) {
        var ISO_FORMAT = "yyyy-MM-dd" + (showTime ? " HH:mm" : "");
        var formattedDate = bizagi.util.dateFormatter.formatDate(date, ISO_FORMAT);
        return formattedDate;
    };
    this.sleep = function (delay) {
        // Delay in miliseconds
        var start = new Date().getTime();
        while (new Date().getTime() < start + delay) {
            // wait
        }
    };
    this.getDateFormatByDatePickerJqueryUI = function (){
        return bizagi.localization.getResource("dateFormat").replace("yyyy", "yy");
    }
};
/*
* Use localStorage in html5 verfiy supports and operations 
* http://dev.w3.org/html5/webstorage/#dom-storage-setitem
*/

bizagi.util.browserSupportLocalStorage = function () {
    try {
        return 'localStorage' in window && window['localStorage'] !== null;
    } catch (e) {
        return false;
    }
};
/*
*set the item  in the local storage
*/
bizagi.util.setItemLocalStorage = function (key, value) {
    if (bizagi.util.browserSupportLocalStorage()) {
        localStorage.setItem(key, value);
        return true;
    } else {
        return false;
    }
};
bizagi.util.getItemLocalStorage = function (key) {
    return localStorage.getItem(key);
};
bizagi.util.removeItemLocalStorage = function (key) {
    localStorage.removeItem(key);
};
bizagi.util.clearLocalStorage = function () {
    if (bizagi.util.browserSupportLocalStorage())
        localStorage.clear();
};
function printf(msg) {
    var args = Array.prototype.slice.call(arguments, 1), arg;
    return msg.replace(/(%[disv])/g, function (a, val) {
        arg = args.shift();
        if (arg !== undefined) {
            switch (val.charCodeAt(1)) {
                case 100:
                    return +arg; // d
                case 105:
                    return Math.round(+arg); // i
                case 115:
                    return String(arg); // s
                case 118:
                    return arg; // v
            }
        }
        return val;
    });
}


// Fix problem with console.log when we forgot to remove it
(function () {
    var environment = (typeof BIZAGI_ENVIRONMENT != "undefined") ? BIZAGI_ENVIRONMENT : "release";
    if (environment == 'debug') {
        if (typeof window.console != "object") {
            window.console = {
                log: function (msg) { /*Nothing to do*/
                }
            };
        }
    } else {
        if (typeof console != "object") {
            window.console = {
                log: function (msg) {/*Nothing to do*/
                }
            };
        } else if(bizagiConfig && !bizagiConfig.showConsoleLog){
            console.log = function (a) {/*Nothing to do*/
            };
        }
    }
})();

bizagi.util.smartphone.startLoading = function (container) {
    var elementToapply = container || $("body");
    elementToapply.append('<div class="bz-util-loading-container"> <div class="ui-bizagi-loading-icon bz-util-loading"></div>  </div>');
};
bizagi.util.smartphone.stopLoading = function (container) {
    var elementToapply = container || $("body");
    $(".bz-util-loading-container", elementToapply).remove();
};



/**
* determines whether the element in the browser supports the event we are looking for, eg 'paste', 'input', 'blur', etc. More info check modernizer.js.
* @param  {string|*}           eventName  is the name of an event to test for (e.g. "resize")
* @param  {(Object|string|*)=} element    is the element|document|window|tagName to test on
* @return {boolean}
*/
bizagi.util.isEventSupported = function (eventName, element) {
    var needsFallback = !('onblur' in document.documentElement);
    var isSupported;

    if (!eventName) {
        return false;
    }
    if (!element || typeof element === 'string') {
        element = document.createElement(element || 'div');
    }

    // Testing via the `in` operator is sufficient for modern browsers and IE.
    // When using `setAttribute`, IE skips "unload", WebKit skips "unload" and
    // "resize", whereas `in` "catches" those.
    eventName = 'on' + eventName;
    isSupported = eventName in element;

    // Fallback technique for old Firefox - bit.ly/event-detection
    if (!isSupported && needsFallback) {
        if (!element.setAttribute) {
            // Switch to generic element if it lacks `setAttribute`.
            // It could be the `document`, `window`, or something else.
            element = document.createElement('div');
        }
        if (element.setAttribute && element.removeAttribute) {
            element.setAttribute(eventName, '');
            isSupported = typeof element[eventName] === 'function';

            if (element[eventName] !== undefined) {
                // If property was created, "remove it" by setting value to `undefined`.
                element[eventName] = undefined;
            }
            element.removeAttribute(eventName);
        }
    }
    return isSupported;
};


/**
* Execute deferreds in order
* @example var a = new bizagiQueue(); a.add(function);
* 
*/
function bizagiQueue() {
    var self = this;
    var queue = [];

    self.add = function (callback) {
        queue.push({ callbacks: [callback] });
    };

    self.addParallel = function (callback) {
        if (queue.length == 0) {
            return self.add(callback);
        }

        // Put a parallel on last item
        var last = queue[queue.length - 1];
        last.callbacks.push(callback);
    };

    self.execute = function () {
        var starter = new $.Deferred();
        var promise = starter.promise();
        var queueLength = queue.length;
        for (var i = 0; i < queueLength; i++) {
            promise = promise.pipe(function () {
                var element = queue.shift();
                return $.when.apply($, $.map(element.callbacks, function (callback) {
                    // Function support
                    if (typeof (callback) == "function") {
                        return callback();
                    }
                    // Deferred support
                    return callback;
                }))
            });
        }

        starter.resolve();
        promise = promise.done(function () {
            // Reset queue
            queue = [];
        });

        return promise;
    };
}


/**
* Calculate circular dependencies 
* 
* @example var a = new bizagi.circularDependencies(); a.addNode('name',obj);
* a.resolve(node);
* 
*/
//TODO: DEPL - Check this because we agreed to a much simpler solution
bizagi.circularDependencies = function () {
    var circularDependencies = new Function();
    var self = circularDependencies.prototype;
    self.list = []; //[{ name: "root", obj: {}, nodeObj: {}, childs: {} }];
    self.lastNodeAdded; // Undefined reference

    self.addNode = function (name, obj) {
        var OBJ = JSON.encode(obj);
        var foundObjChildNode = _search(name, OBJ);
        if (foundObjChildNode) {
            var lastNode = self.lastNodeAdded || self.list[self.list.length - 1];
            lastNode.nodeObj.addChild(foundObjChildNode.nodeObj);
            self.lastNodeAdded = foundObjChildNode;
        } else {
            var node = new _addNode(name, OBJ);
            self.list.push({
                name: name,
                obj: OBJ,
                nodeObj: node,
                timeStamp: new Date().getTime()
            });
            return node;
        }
    };

    self.resolve = function (node, resolved, seen) {
        // if dont setted node variable, take the first one -> root
        node = node || _getFirstNodeWithChilds() || self.list[0].nodeObj;
        var resolveDependencies = new _resolve(node, resolved, seen);
        return resolveDependencies;
    };

    var _resetList = function () {
        self.list = [];
    };

    var _getFirstNodeWithChilds = function () {
        for (var i = 0; i < self.list.length; i++) {
            if (self.list[i].nodeObj.childs.length > 0) {
                return self.list[i].nodeObj;
            }
        }
        return (self.list.length > 0) ? self.list[0].nodeObj : {};
    };

    var _search = function (name, obj) {
        for (var i = 0; i < self.list.length; i++) {
            if (self.list[i].name == name) {
                // remove tag element
                var now = new Date().getTime();
                var timeToKeep = 1000; //milliseconds
                if ((self.list[i].timeStamp + timeToKeep) < now) {
                    //remove element from the list
                    self.list.splice(i, 1);
                } else if (self.list[i].obj == obj) {
                    return self.list[i];
                }
            }
        }
        return false;
    };

    var _addNode = (function (name, obj) {
        name = name || "";
        obj = obj || {};
        var node = function (name, obj) {
            this.name = name;
            this.obj = obj;
            this.childs = [];
        };
        var self = node.prototype;

        self.addChild = function (node) {
            this.childs.push(node);
        };

        return node;
    })();

    var _resolve = (function (node, resolved, seen) {
        var resolve = function (node, resolved, seen) {
            this.node = node || {};
            this.node.childs = this.node.childs || [];
            this.resolved = resolved || [];
            this.seen = seen || [];

            this.seen.push(this.node);

            for (var i = 0; i < this.node.childs.length; i++) {
                if (!self.hasObject(this.node.childs[i], this.resolved)) {
                    if (self.hasObject(this.node.childs[i], this.seen)) {
                        //throw new _error("error node:" + node.name + " -> " + node.childs[i].name);
                        _resetList();
                        var error = {
                            dependencyFrom: this.node.name,
                            dependencyFromObj: this.node.obj,
                            dependencyTo: this.node.childs[i].name,
                            dependencyToObj: this.node.childs[i].obj,
                            path: this.seen
                        };

                        return {
                            error: $.extend({
                                standardError: {
                                    status: "error",
                                    responseText: JSON.encode({ message: self.makeErrorMessage(error), type: "alert" })
                                },
                                multiactionError: {
                                    message: self.makeErrorMessage(error),
                                    type: "alert"
                                }
                            }, error)
                        };
                    } else {
                        return resolve(this.node.childs[i], this.resolved, this.seen);
                    }
                }
            }
            if (this.resolved) {
                this.resolved.push(this.node);
            }
        };

        var self = resolve.prototype;

        self.hasObject = function (toSearch, collection) {

            for (var i = 0; i < collection.length; i++) {
                if (collection[i].name == toSearch.name) {
                    return true;
                }
            }
            return false;
        };

        self.makeErrorMessage = function (error) {
            var messageTmpl = bizagi.localization.getResource("render-actions-loop-validation");

            return printf(messageTmpl, error.dependencyFrom, error.dependencyTo);

          /*  return {
                responseText: parsedMessage,
                message: parsedMessage,
                extraInfo: error
            };*/
        };

        return resolve;
    })();

    return self;
};

/**
* Apply css string style (one or more). It works to add or override a specific style even if it has !important
* 
* @example bizagi.util.cssExtended($('.myClass'), 'display:none!important;color:red');
* 
*/
bizagi.util.cssExtended = function (instance, options) {
    var cssToAdd = options.split(";");

    for (i = 0; i < cssToAdd.length; i++) {
        if (cssToAdd[i] != "") {
            bizagi.util.cssExtendedApplyChanges(instance, cssToAdd[i]);
        }
    }

};

/**
* Apply the style change 
* 
*/
bizagi.util.cssExtendedApplyChanges = function (instance, option) {

    for (var i = 0; i < instance.length; i++) {
        var $this = $(instance[i]);
        var attrToAdd = option.split(":")[0];

        if ($this.attr('style')) {
            var tmpStyle = $this.attr('style').split(";");
            var arrProperties = [];
            var resultProperties = "";

            for (j = 0; j < tmpStyle.length; j++) {
                var cssProperty = tmpStyle[j].split(":");

                if ($.trim(cssProperty[0]) != attrToAdd && $.trim(cssProperty[0]) != "") {
                    arrProperties.push(cssProperty[0] + ":" + cssProperty[1] + ";");
                }
                resultProperties = JSON.stringify(arrProperties).replace(/\","/g, ' ').replace(/\["/g, ' ').replace(/\"]/g, ' ');
            }

            resultProperties = resultProperties == "[]" ? "" : resultProperties;

            $this.attr('style', resultProperties + option + ";");
        } else if ($this.css(attrToAdd)) {
            var tmpStyle = $this.css(attrToAdd);
            var arrProperties = [];
            var resultProperties = "";

            arrProperties.push(option + ";");

            resultProperties = resultProperties == "[]" ? "" : resultProperties;

            $this.attr('style', resultProperties + option + ";");
        }
    }
};

/*
* Find element to make scroll top
*/
bizagi.util.scrollTop = function (canvas) {
    if (canvas && canvas[0]) {
        while (canvas[0].tagName !== "HTML" && canvas.css("overflow-y") != "scroll" && canvas.css("overflow-y") != "auto" && canvas.parent().length > 0) {
            canvas = canvas.parent();
        }
    }
    return canvas;
};

/*
* Sort a JSON array by attribute and order type (ascendant or descendant)
* example: data = [ {attr1:val1, attr2:val2} , {attr1:val3, attr2:val4 },... ]  , key = "attr2" , way = "asc"
*/
bizagi.util.sortJSON = function (data, key, way) {
    return data.sort(function (a, b) {
        var x = a[key];
        var y = b[key];
        if (way === 'asc') {
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        }
        if (way === 'desc') {
            return ((x > y) ? -1 : ((x < y) ? 1 : 0));
        }
    });
};

/*
* Reducir formato numérico a notación abrevidad (K:1000 - M:1000000 - B:1000000000)
*/
bizagi.util.shortNumber = function (number) {
    var newNumber = number.toString();
    var lenghtNumber = newNumber.length;

    if (lenghtNumber >= 4 && lenghtNumber < 7) {
        newNumber = '+' + newNumber.charAt(0) + 'K';
    } else if (lenghtNumber >= 7 && lenghtNumber < 10) {
        newNumber = '+' + newNumber.charAt(0) + 'M';
    } else if (lenghtNumber >= 10) {
        newNumber = '+' + newNumber.charAt(0) + 'B';
    }

    return '&nbsp;&nbsp;&nbsp;' + newNumber;
};

/*
* Aplicar formato salto de linea
*/
bizagi.util.replaceLineBreak = function (string) {
    return typeof string === "string" ? string.replace(/\r\n|\r|\n|<br>|<br\/>/g, "<br/>") : string;
};

/*
* Aplicar formato Tipo moneda
*/
bizagi.util.formatMonetaryCell = function (value) {
    return bizagi.util.formatMoney(value, BIZAGI_DEFAULT_CURRENCY_INFO);
};

/*
* Aplicar formato tipo decimal
*/
bizagi.util.formatDecimalCell = function(value) {
    var decimalFormat;
    var externalDecimalFormat = {
        decimalSymbol: BIZAGI_DEFAULT_CURRENCY_INFO.decimalSeparator,
        digitGroupSymbol: BIZAGI_DEFAULT_CURRENCY_INFO.groupSeparator,
        roundToDecimalPlace: BIZAGI_DEFAULT_CURRENCY_INFO.decimalDigits
    };
    var defaultDecimalFormat = {
        colorize: false,
        decimalSymbol: ".",
        digitGroupSymbol: ",",
        groupDigits: true,
        negativeFormat: "(%s%n)",
        positiveFormat: "%s%n",
        roundToDecimalPlace: "2",
        symbol: ""
    };
    decimalFormat = $.extend(defaultDecimalFormat, externalDecimalFormat);
    var numberValue = bizagi.util.formatDecimal(value, decimalFormat);
    if (bizagi.override.removeTrailingZeros === true) {
        var positive = true;
        if (numberValue.toString().indexOf(")") != -1) {
            positive = false;
            numberValue = numberValue.replace("(", "").replace(")", "");
        }
        var re = new RegExp("("+BIZAGI_DEFAULT_CURRENCY_INFO.decimalSeparator+"\\d*?[1-9])0+$", "g");
        numberValue = numberValue.replace(re, "$1");
        re = new RegExp("\\"+BIZAGI_DEFAULT_CURRENCY_INFO.decimalSeparator+"0+$", "g");
        numberValue = numberValue.replace(re, "");


        if (!positive) numberValue = "(" + numberValue + ")";
    }
    return numberValue;
};

/*
* Crea notificacion de corta duracion, principalmente uilizada en para los procesos offline
*/
bizagi.util.showNotification = function (params) {
    var params = params || {};
    var div_sync = $('<div id="sync-notification" class="bz-cm-icon"></div>').text(params.text || "");
    div_sync.appendTo($('body'));
    div_sync.fadeIn(1500, function () {
        div_sync.stop();
    });

    div_sync.fadeOut(2000, function () {
        div_sync.remove();
    });
};

/*
* Verificar el estado de la conexión
*/
bizagi.util.isModeOnline = function() {
    return typeof bizagi.context.isOfflineForm !== "undefined" && !bizagi.context.isOfflineForm;
};

bizagi.util.dispose = function (obj) {
    for (key in obj) {
        switch (typeof (obj[key])) {
            case "object":
                delete obj[key];
                break;
            case "function":
                obj[key] = null;
                delete obj[key];
                break;
        }
    }
};

bizagi.util.arrayEach = function (array, callback) {
    if (!!array) {
        if (Object.prototype.toString.apply(array) === "[object Array]" && Object.prototype.toString.apply(callback) === "[object Function]") {
            var index, value;
            for (index in array) {
                if (array.hasOwnProperty(index)) {
                    value = callback.call(array[index], index, array[index]);
                    if (value === false) {
                        return;
                    }
                }
            }
        } else {
            $.each(array, callback);
        }
    }
};

//remove all the character except the +, - and decimal point
bizagi.util.getStandardNotation = function(number, decimalSymbol){
    var plusCharacter = '+';
    var minusCharacter = '-';
    var decimalSymbol = decimalSymbol || '.';
    var expSymbol = 'e';
    var tmp = '';
    //remove all the character except the +, -, decimal point and the numbers
    var decimalNumber = false;
    var exponentialNumber = false;
    number = (number.length>0?number.toString().toLowerCase():'').replace(/ /g,'');
    for(var i = 0; i < number.length; i++){
        if((number[i] === plusCharacter || number[i] === minusCharacter) && (i === 0 || number[i-1] == expSymbol)){
            tmp += number[i];
        }else if(!isNaN(Number(number[i]))){
            tmp += number[i];
        }
        else if((number[i] === decimalSymbol) && !decimalNumber){
            tmp += number[i];
            decimalNumber = true;
        }
        else if((number[i] === expSymbol) && !exponentialNumber){
            tmp += number[i];
            exponentialNumber = true;
        }
    }
    return tmp;
};
//Return it in normalized scientific notation
bizagi.util.scientificNotationFormat = function(number, decimalSymbol, sdLimit, expMinLimit, expMaxLimit){
    decimalSymbol = decimalSymbol || '.';
    number = bizagi.util.getStandardNotation(number, decimalSymbol);
    sdLimit = ( sdLimit > 0 ) ? sdLimit : 38;
    expMinLimit = ( expMinLimit > 0 ) ? expMinLimit : -125;
    expMaxLimit = ( expMaxLimit > 0 ) ? expMaxLimit : 125;
    var expSimbol = 'e';
    var sNregex = new RegExp('[0-9]+(' + decimalSymbol + '[0-9]+)?(e[+-]?[0-9]+)?');
    var sNFormat = number.match(sNregex);

    //get que prefix
    var exp = 0;

    var prefix = number[0] === '-'? number[0]: '';
    var originalPointIndex = 0;

    number = number.replace(prefix, '');

    //if the number is not in scientific notation
    if(sNFormat && sNFormat[0] && sNFormat[2]){
        var tempParts = sNFormat[0]?(sNFormat[0].replace(sNFormat[2], '').split(decimalSymbol)):'';

        var significantDigits = '';
        var intPart = '';

        //calculate significant digits
        //remove zeros at the left
        tempParts[0] = tempParts[0].replace(/^0+/g,'');

        if (tempParts[0].length > 1){
            significantDigits = tempParts[0].slice(1);
            originalPointIndex = significantDigits.length;
            intPart = tempParts[0][0] || '';
            significantDigits = significantDigits.concat(sNFormat[1]||'');
        }
        else if (tempParts[0].length === 1){
            intPart = tempParts[0][0] || '';
            significantDigits = significantDigits.concat(tempParts[1]||'');
        }
        else{
            originalPointIndex = tempParts[1].length;
            tempParts[1] = tempParts[1].replace(/^0+/g,'');
            originalPointIndex = (tempParts[1].length - 1) - originalPointIndex;
            intPart = tempParts[1][0];
            significantDigits = tempParts[1].slice(1);
        }
        //remove . and zeros from significant digits
        significantDigits = significantDigits.replace(decimalSymbol, '').replace(/0+$/g,'');

        if(significantDigits.length >= sdLimit){
            significantDigits = significantDigits.slice(0, sdLimit-1);
        }
        exp = Number(sNFormat[2].replace(expSimbol, '')) + originalPointIndex;
        exp = (exp>expMaxLimit)?expMaxLimit:(exp<expMinLimit)?expMinLimit:exp;
        return prefix + intPart + (significantDigits?(decimalSymbol + significantDigits):'') + expSimbol + (exp>0?'+'+exp:exp);
    }
    else if(number){

        originalPointIndex = number.indexOf(decimalSymbol);
        var from = 0;
        var to = number.length-1;

        //remove decimal point
        number = number.replace(decimalSymbol, '');

        //from
        var i = from;
        while(!significantFlag){
            if(number[i]!== '0'&& number[i]!== decimalSymbol ){significantFlag = true;from = i;}
            else {i++;}
        }
        //to
        var significantFlag = false;
        var j = to;
        while(!significantFlag){
            if(number[j]!== '0'&& number[j]!== decimalSymbol && '-'){significantFlag = true; to = j + 1;}
            else {j--;}
        }
        to = to>sdLimit+from?sdLimit+from:to;
        if(originalPointIndex !== -1){
            //find significant digits
            var significantFlag = false;
            var significantDigits = number.slice(from, to);
            var pointIndex = from + 1;
            exp = originalPointIndex - pointIndex;
            if(significantDigits.length > 0 && !isNaN(Number(significantDigits[0]))){
                return prefix + significantDigits[0] + (significantDigits.length > 1? decimalSymbol + significantDigits.slice(1):'') + expSimbol + (exp>0?'+'+exp:exp);
            }
            else{ return '0';}

        }
        else{
            //Int numbers
            var firstDigit =  number.slice(from, from + 1);
            var restDigits =  number.slice(from + 1, number.length);
            exp = restDigits.length;
            restDigits = restDigits.replace(/0+$/g,'');
            if(restDigits.length > sdLimit){
                restDigits =  number.slice(from + 1, sdLimit + from);
            }
            if(Number(firstDigit)){
                return prefix + firstDigit + (restDigits.length > 0? decimalSymbol + restDigits: '') + expSimbol + (exp>0?'+'+exp:exp);
            }else{ return '0';}
        }
    }
    else{ return ''; }
};

/**
* Remove all backslashes that represent scape of characters
*/
bizagi.util.stripslashes = function (str) {
    return str.replace(/\\'/g, '\'').replace(/\"/g, '"').replace(/\\\\/g, '\\').replace(/\\0/g, '\0');
};

/*
* Validates if the text is a valid opening and closing tags, including classes
*/
bizagi.util.isHTMLValidText = function (text) {
    var ex = new RegExp(/<(.|\n)*?>/g);
    return ex.test(text);
};

bizagi.util.resetData = function () {
    var obj = JSON.parse(sessionStorage.getItem("bizagiAuthentication"));
    sessionStorage.removeItem("bizagiAuthentication");
    $.extend(obj, { isAuthenticate: "false" });
    sessionStorage.setItem("bizagiAuthentication", JSON.encode(obj));
};

bizagi.util.changeData = function (params) {
    var obj = JSON.parse(sessionStorage.getItem("bizagiAuthentication"));
    sessionStorage.removeItem("bizagiAuthentication");
    $.extend(obj, params);
    sessionStorage.setItem("bizagiAuthentication", JSON.encode(obj));
};

// ------------------------------------------------------------------------
// UTILS FOR MOBILE DEVICE
// ------------------------------------------------------------------------

bizagi.util.isMobileDevice = function() {
    var device = bizagi.detectDevice();

    return ([
        "smartphone_ios",
        "smartphone_ios_native",
        "smartphone_android",
        "tablet",
        "tablet_ios",
        "tablet_ios_native",
        "tablet_android"
    ].indexOf(device) > -1);
};

/** 
 * Verify mobile device type
 * @returns {} 
 */
bizagi.util.isTabletDevice = function () {
    var device = bizagi.util.detectDevice();

    return ([
        "tablet",
        "tablet_ios",
        "tablet_ios_native",
        "tablet_android"
    ].indexOf(device) > -1);
};

/**
 * Tablet android
 * @returns {} 
 */
bizagi.util.isAndroidTabletDevice = function () {
    var device = bizagi.util.detectDevice();

    return bizagi.util.isTabletDevice() && (device.indexOf("android") !== -1);
};

/**
 * Tablet iOS
 * @returns {} 
 */
bizagi.util.isiOSTabletDevice = function () {
    var device = bizagi.util.detectDevice();

    return bizagi.util.isTabletDevice() && !(device.indexOf("android") === -1);
};


/**
 * Verify mobile device type
 * @returns {}
 */
bizagi.util.isSmartphoneDevice = function () {
    var device = bizagi.util.detectDevice();

    return ([
        "smartphone_ios",
        "smartphone_ios_native",
        "smartphone_android"
    ].indexOf(device) > -1);
};


/**
 * Smartphone android
 * @returns {} 
 */
bizagi.util.isAndroidSmartphoneDevice = function () {
    var device = bizagi.util.detectDevice();

    return bizagi.util.isSmartphoneDevice() && (device.indexOf("android") !== -1);
};

/**
 * Smartphone iOS
 * @returns {} 
 */
bizagi.util.isiOSSmartphoneDevice = function () {
    var device = bizagi.util.detectDevice();

    return bizagi.util.isSmartphoneDevice() && (device.indexOf("ios") !== -1);
};

/**
 * Check is offline form
 * @param {} container 
 * @returns {} 
 */
bizagi.util.isOfflineForm = function(params) {
    if (!bizagi.util.isTabletDevice() || typeof (params) === "undefined")
        return false;

    var context = params.context || null;
    var container = params.container || null;

    var formContainer = container !== null
        ? container : (context !== null ? context.getFormContainer() : null);

    if (formContainer === null)
        return false;

    var formParams = formContainer.getParams() || {};
    var isOfflineForm = typeof (formParams.isOfflineForm) !== "undefined"
        && bizagi.util.parseBoolean(formParams.isOfflineForm);

    return isOfflineForm;
};

bizagi.util.detectAndroidVersion = function() {
    var indexAndroid = navigator.userAgent.toLowerCase().indexOf("android");
    var androidVersion = navigator.userAgent.toLowerCase().substring(indexAndroid + 8, indexAndroid + 13);
    androidVersion = androidVersion.replaceAll(".", "");
    return Number(androidVersion);
};

bizagi.util.getPathUrl = function(url) {
    var solvedUrl = "";
    var locationParts = location.pathname.split("/");
    var basePath = location.protocol + "//" + location.host;

    if (BIZAGI_PATH_TO_BASE[0] == "/") {
        solvedUrl = basePath + BIZAGI_PATH_TO_BASE + url;
    } else {
        var pathToBaseBackwards = BIZAGI_PATH_TO_BASE.split("../").length;
        for (var i = 0, l = locationParts.length; i < l - pathToBaseBackwards; i++) {
            basePath += locationParts[i] + "/";
        }

        basePath = basePath[basePath.length - 1] === "/" ? basePath : basePath + "/";
        solvedUrl = basePath + url;
    }
    return solvedUrl;
};

/**
 * Get Android version
 * @returns {} 
 */
bizagi.util.getAndroidVersion = function() {
	var userAgent = navigator.userAgent.toLowerCase();
	var match = userAgent.match(/android\s([0-9\.]*)/);

	return match ? parseFloat(match[1]) : false;
};

/**
 * Get image path to android device
 * @param {} image 
 * @returns {} 
 */
bizagi.util.mobileImagePath = function(image) {
    var dataImage = image;
    var version = bizagi.util.getAndroidVersion();

    if (!version)
        return dataImage;

    if (dataImage.substring(0, 21) === "content://com.android" && version <= 4.4) {
        var photoSplit = dataImage.split("%3A");
        if (photoSplit.length > 1) {
            dataImage = "content://media/external/images/media/" + photoSplit[1];
        } else {
            photoSplit = dataImage.split("/");
            dataImage = "content://media/external/images/media/" + photoSplit[photoSplit.length - 1];
        }
    }

    return dataImage;
};

/**
 * Validate resource 
 * @param {} resource resource name
 * @returns {} 
 */
bizagi.util.isValidResource = function (resource) {
    if (!bizagi.localization) return false;
    return (bizagi.localization.getResource(resource) !== resource);
};

/***
* Transform base64 image to blob
* @b64Data 
* @contentType 
* @sliceSize 
*/
bizagi.util.b64toBlob = function (b64Data, contentType, sliceSize) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        var slice = byteCharacters.slice(offset, offset + sliceSize);

        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        var byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, { type: contentType });
    return blob;
};

// ------------------------------------------------------------------------
// NATIVE-HYBRID ENVIRONMENT
// ------------------------------------------------------------------------

/** 
 * Verify the offline forms is enabled
 * @returns {} 
 */
bizagi.util.hasOfflineFormsEnabled = function() {
    return typeof (BIZAGI_ENABLE_OFFLINE_FORMS) !== "undefined"
        && bizagi.util.parseBoolean(BIZAGI_ENABLE_OFFLINE_FORMS) === true;
};

/**
 * 
 * Verify the flat design is enabled
 * @returns {} 
 */
bizagi.util.isFlatDesignEnabled = function () {
    // return bizagi.isFlatDesignEnabled();
    return typeof (BIZAGI_ENABLE_FLAT) !== "undefined" && bizagi.util.parseBoolean(BIZAGI_ENABLE_FLAT) === true;
};

/**
 * Validate the mobile grid is enabled
 * @returns {}
 */
bizagi.util.isMobileGridEnabled = function () {
    return typeof (BIZAGI_ENABLE_MOBILE_GRID) !== "undefined"
        && bizagi.util.parseBoolean(BIZAGI_ENABLE_MOBILE_GRID) === true;
};

/**
 * Validate the mobile grid is enabled
 * @returns {}
 */
bizagi.util.isNativeHeaderEnabled = function () {
    return typeof (NATIVE_HEADER_ENABLE) !== "undefined" &&
        bizagi.util.parseBoolean(NATIVE_HEADER_ENABLE) === true;
};

/**
 * Validate the Quick search is enabled
 * @returns {}
 */
bizagi.util.isQuickSearchEnabled = function () {
    return typeof (BIZAGI_ENABLE_QUICK_SEARCH) !== "undefined" &&
        bizagi.util.parseBoolean(BIZAGI_ENABLE_QUICK_SEARCH) === true;
};

/** 
 * Verify the OAuth2 is enabled
 * @returns {} 
 */
bizagi.util.isOAuth2Enabled = function () {
    // return bizagi.isOAuth2Enabled();
    return typeof (BIZAGI_AUTH_TYPE) !== "undefined" && BIZAGI_AUTH_TYPE === "OAuth";
};

/**
 * Get native component
 * @returns {}
 */
bizagi.util.getNativeComponent = function () {
    //return bizagi.getNativeComponent();
    return typeof (BIZAGI_NATIVE_COMPONENT) !== "undefined" ? BIZAGI_NATIVE_COMPONENT : "";
};

/**
 * Check server version
 * @returns {}
 */
bizagi.util.isVersionSupported = function () {
    var supported = true;

    if (typeof (BIZAGI_SERVER_VERSION) !== "undefined" && !bizagi.util.isEmpty(BIZAGI_SERVER_VERSION)) {
        var version = BIZAGI_SERVER_VERSION.match(/\d+\.\d+/);
        supported = version ? (parseFloat(version.shift()) >= 11.0) : true;
    }

    return supported;
};

/**
 * Cordova componet is supported
 * @returns {} 
 */
bizagi.util.isCordovaSupported = function () {
    return typeof (cordova) !== "undefined";
};

/**
 * Native plugin of Cordova is supported 
 * @returns {} 
 */
bizagi.util.isNativePluginSupported = function () {
    return typeof (bizagiapp) !== "undefined";
};

/**
 * Tablet native
 * @returns {} 
 */
bizagi.util.isTabletNativeSupported = function () {
    return typeof (bizagiapp) !== "undefined" && bizagi.util.isTabletDevice();
};

/**
 * Smartphone native
 * @returns {} 
 */
bizagi.util.isSmartphoneNativeSupported = function () {
    return typeof (bizagiapp) !== "undefined" && bizagi.util.isSmartphoneDevice();
};

/**
 * Enables accesory bar
 */
if (bizagi.util.isNativePluginSupported() && window.cordova && window.cordova.plugins.Keyboard) {
    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
}