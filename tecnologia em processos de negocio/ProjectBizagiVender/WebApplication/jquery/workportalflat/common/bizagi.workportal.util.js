bizagi = (typeof (bizagi) !== "undefined") ? bizagi : {};
bizagi.util = (typeof (bizagi.util) !== "undefined") ? bizagi.util : {};
bizagi.context = (typeof (bizagi.context) !== "undefined") ? bizagi.context : {};
bizagi.util.smartphone = (typeof (bizagi.util.smartphone) !== "undefined") ? bizagi.util.smartphone : {};
bizagi.util.tablet = (typeof (bizagi.util.tablet) !== "undefined") ? bizagi.util.tablet : {};
bizagi.util.mobility = (typeof (bizagi.util.mobility) !== "undefined") ? bizagi.util.mobility : {};

/*  
*   Detect a device based on the width
*/
bizagi.util.detectDevice = function () {
    // Call the method located in bizagi.loader
    return bizagi.detectDevice();
};

bizagi.util.isNull = function (value) {
    return Object.prototype.toString.apply(value) === "[object Null]";
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
        return $.isEmptyObject(value);
    }

    return false;
};

bizagi.loader.initWebpartOld = bizagi.loader.initWebpart;

bizagi.loader.initWebpart = function (webpart, device, callback) {
    var self = this;
    if (webpart != null) {
        if (!webpart.initialized) {
            if (webpart.devices) {
                if (typeof webpart.devices[device] !== 'undefined') {
                    bizagi.loader.initWebpartOld($.extend(webpart, webpart.devices[device]), callback);
                }
                else {
                    console.log("No existe la definicion del device " + device + " Para el webpart " + webpart.name);
                }
            }
            else {
                bizagi.loader.initWebpartOld(webpart, callback);
            }
        } else {
            steal.then(function () {
                // Invokes callback
                if (callback) callback();
            });
        }
    }

    return this;
};

/*
*   Initializes a webpart on-demand
*/
bizagi.util.initWebpart = function (webpart, device) {
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
            bizagi.loader.initWebpart(webpart, device, function () {

                // Resolve deferreds
                webpart.loadingDeferred.resolve();
                webpart.initializing = false;
                defer.resolve();
            });
        }
    }

    return defer.promise();
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
                var timeToKeep = 2000; //milliseconds
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
                        resolve(this.node.childs[i], this.resolved, this.seen);
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

            return {
                responseText: parsedMessage,
                message: parsedMessage,
                extraInfo: error
            };
        };

        return resolve;
    })();

    return self;
};

//TODO: DEPL - Move this to rendering
bizagi.util.autoSave = function () {

    var deferredSave = $.Deferred();

    //if attr data-event exist trigger event auto-save or resolve the deferred
    if ($(document).data('auto-save')) {

        $(document).trigger('save-form', [deferredSave]);
    } else {
        deferredSave.resolve();
    }

    return deferredSave.promise();

};

bizagi.util.isDate = function (value) {
    value = value || '';
    var state = false;
    var slash = (typeof value == 'string') ? value.split("/") : '';
    try {
        // Check format int/int/int
        if (slash.length == 3) {
            var date = new Date(value);
            if (date.getYear() > 0) {
                state = true;
            }
        }
    } catch (e) {
        state = false;
    }

    return state;
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

/*
* Aplicar formato salto de linea
*/
bizagi.util.replaceLineBreak = function (string) {
    return typeof string === "string" ? string.replace(/\r\n|\r|\n|<br>|<br\/>/g, "<br/>") : string;
};

/*
*   Creates a replace all method that is left from the String Class
*/
bizagi.util.replaceAll = function (text, pcFrom, pcTo) {
    // Call the method located in bizagi.loader
    return bizagi.replaceAll(text, pcFrom, pcTo);
};
// Also append it to the string class
String.prototype.replaceAll = function (pcFrom, pcTo) {
    return bizagi.util.replaceAll(this, pcFrom, pcTo);
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

bizagi.util.setContext = function (params, reset) {
    params = params || {};
    reset = reset || false;
    if (reset) {
        bizagi.context = {};
    }

    $.each(params, function (key, value) {
        bizagi.context[key] = value;
    });
}

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

(function ($) {
    jQuery.br2nl = function (value) {
        return value.replace(/\r\n|\r|\n|<br>|<br\/>/g, "\r");
    };
})(jQuery);

(function ($) {
    jQuery.nl2br = function (value) {
        return value.replace(/(\r\n|\n\r|\r|\n|\\r\\n|\\n\\r|\\r|\\n)/g, "<br>");
    };
})(jQuery);

// Check if a string is number
bizagi.util.isNumeric = function (n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
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

/**
 * CryptoJS MD5 
 * @param {} message 
 * @returns {} 
 */
bizagi.util.md5 = function (message) {
    // Code here will be linted with JSHint.
    /* jshint ignore:start */
    var CryptoJS = CryptoJS || function (s, p) { var m = {}, l = m.lib = {}, n = function () { }, r = l.Base = { extend: function (b) { n.prototype = this; var h = new n; b && h.mixIn(b); h.hasOwnProperty("init") || (h.init = function () { h.$super.init.apply(this, arguments) }); h.init.prototype = h; h.$super = this; return h }, create: function () { var b = this.extend(); b.init.apply(b, arguments); return b }, init: function () { }, mixIn: function (b) { for (var h in b) b.hasOwnProperty(h) && (this[h] = b[h]); b.hasOwnProperty("toString") && (this.toString = b.toString) }, clone: function () { return this.init.prototype.extend(this) } }, q = l.WordArray = r.extend({ init: function (b, h) { b = this.words = b || []; this.sigBytes = h != p ? h : 4 * b.length }, toString: function (b) { return (b || t).stringify(this) }, concat: function (b) { var h = this.words, a = b.words, j = this.sigBytes; b = b.sigBytes; this.clamp(); if (j % 4) for (var g = 0; g < b; g++) h[j + g >>> 2] |= (a[g >>> 2] >>> 24 - 8 * (g % 4) & 255) << 24 - 8 * ((j + g) % 4); else if (65535 < a.length) for (g = 0; g < b; g += 4) h[j + g >>> 2] = a[g >>> 2]; else h.push.apply(h, a); this.sigBytes += b; return this }, clamp: function () { var b = this.words, h = this.sigBytes; b[h >>> 2] &= 4294967295 << 32 - 8 * (h % 4); b.length = s.ceil(h / 4) }, clone: function () { var b = r.clone.call(this); b.words = this.words.slice(0); return b }, random: function (b) { for (var h = [], a = 0; a < b; a += 4) h.push(4294967296 * s.random() | 0); return new q.init(h, b) } }), v = m.enc = {}, t = v.Hex = { stringify: function (b) { var a = b.words; b = b.sigBytes; for (var g = [], j = 0; j < b; j++) { var k = a[j >>> 2] >>> 24 - 8 * (j % 4) & 255; g.push((k >>> 4).toString(16)); g.push((k & 15).toString(16)) } return g.join("") }, parse: function (b) { for (var a = b.length, g = [], j = 0; j < a; j += 2) g[j >>> 3] |= parseInt(b.substr(j, 2), 16) << 24 - 4 * (j % 8); return new q.init(g, a / 2) } }, a = v.Latin1 = { stringify: function (b) { var a = b.words; b = b.sigBytes; for (var g = [], j = 0; j < b; j++) g.push(String.fromCharCode(a[j >>> 2] >>> 24 - 8 * (j % 4) & 255)); return g.join("") }, parse: function (b) { for (var a = b.length, g = [], j = 0; j < a; j++) g[j >>> 2] |= (b.charCodeAt(j) & 255) << 24 - 8 * (j % 4); return new q.init(g, a) } }, u = v.Utf8 = { stringify: function (b) { try { return decodeURIComponent(escape(a.stringify(b))) } catch (g) { throw Error("Malformed UTF-8 data"); } }, parse: function (b) { return a.parse(unescape(encodeURIComponent(b))) } }, g = l.BufferedBlockAlgorithm = r.extend({ reset: function () { this._data = new q.init; this._nDataBytes = 0 }, _append: function (b) { "string" == typeof b && (b = u.parse(b)); this._data.concat(b); this._nDataBytes += b.sigBytes }, _process: function (b) { var a = this._data, g = a.words, j = a.sigBytes, k = this.blockSize, m = j / (4 * k), m = b ? s.ceil(m) : s.max((m | 0) - this._minBufferSize, 0); b = m * k; j = s.min(4 * b, j); if (b) { for (var l = 0; l < b; l += k) this._doProcessBlock(g, l); l = g.splice(0, b); a.sigBytes -= j } return new q.init(l, j) }, clone: function () { var b = r.clone.call(this); b._data = this._data.clone(); return b }, _minBufferSize: 0 }); l.Hasher = g.extend({ cfg: r.extend(), init: function (b) { this.cfg = this.cfg.extend(b); this.reset() }, reset: function () { g.reset.call(this); this._doReset() }, update: function (b) { this._append(b); this._process(); return this }, finalize: function (b) { b && this._append(b); return this._doFinalize() }, blockSize: 16, _createHelper: function (b) { return function (a, g) { return (new b.init(g)).finalize(a) } }, _createHmacHelper: function (b) { return function (a, g) { return (new k.HMAC.init(b, g)).finalize(a) } } }); var k = m.algo = {}; return m }(Math); (function (s) { function p(a, k, b, h, l, j, m) { a = a + (k & b | ~k & h) + l + m; return (a << j | a >>> 32 - j) + k } function m(a, k, b, h, l, j, m) { a = a + (k & h | b & ~h) + l + m; return (a << j | a >>> 32 - j) + k } function l(a, k, b, h, l, j, m) { a = a + (k ^ b ^ h) + l + m; return (a << j | a >>> 32 - j) + k } function n(a, k, b, h, l, j, m) { a = a + (b ^ (k | ~h)) + l + m; return (a << j | a >>> 32 - j) + k } for (var r = CryptoJS, q = r.lib, v = q.WordArray, t = q.Hasher, q = r.algo, a = [], u = 0; 64 > u; u++) a[u] = 4294967296 * s.abs(s.sin(u + 1)) | 0; q = q.MD5 = t.extend({ _doReset: function () { this._hash = new v.init([1732584193, 4023233417, 2562383102, 271733878]) }, _doProcessBlock: function (g, k) { for (var b = 0; 16 > b; b++) { var h = k + b, w = g[h]; g[h] = (w << 8 | w >>> 24) & 16711935 | (w << 24 | w >>> 8) & 4278255360 } var b = this._hash.words, h = g[k + 0], w = g[k + 1], j = g[k + 2], q = g[k + 3], r = g[k + 4], s = g[k + 5], t = g[k + 6], u = g[k + 7], v = g[k + 8], x = g[k + 9], y = g[k + 10], z = g[k + 11], A = g[k + 12], B = g[k + 13], C = g[k + 14], D = g[k + 15], c = b[0], d = b[1], e = b[2], f = b[3], c = p(c, d, e, f, h, 7, a[0]), f = p(f, c, d, e, w, 12, a[1]), e = p(e, f, c, d, j, 17, a[2]), d = p(d, e, f, c, q, 22, a[3]), c = p(c, d, e, f, r, 7, a[4]), f = p(f, c, d, e, s, 12, a[5]), e = p(e, f, c, d, t, 17, a[6]), d = p(d, e, f, c, u, 22, a[7]), c = p(c, d, e, f, v, 7, a[8]), f = p(f, c, d, e, x, 12, a[9]), e = p(e, f, c, d, y, 17, a[10]), d = p(d, e, f, c, z, 22, a[11]), c = p(c, d, e, f, A, 7, a[12]), f = p(f, c, d, e, B, 12, a[13]), e = p(e, f, c, d, C, 17, a[14]), d = p(d, e, f, c, D, 22, a[15]), c = m(c, d, e, f, w, 5, a[16]), f = m(f, c, d, e, t, 9, a[17]), e = m(e, f, c, d, z, 14, a[18]), d = m(d, e, f, c, h, 20, a[19]), c = m(c, d, e, f, s, 5, a[20]), f = m(f, c, d, e, y, 9, a[21]), e = m(e, f, c, d, D, 14, a[22]), d = m(d, e, f, c, r, 20, a[23]), c = m(c, d, e, f, x, 5, a[24]), f = m(f, c, d, e, C, 9, a[25]), e = m(e, f, c, d, q, 14, a[26]), d = m(d, e, f, c, v, 20, a[27]), c = m(c, d, e, f, B, 5, a[28]), f = m(f, c, d, e, j, 9, a[29]), e = m(e, f, c, d, u, 14, a[30]), d = m(d, e, f, c, A, 20, a[31]), c = l(c, d, e, f, s, 4, a[32]), f = l(f, c, d, e, v, 11, a[33]), e = l(e, f, c, d, z, 16, a[34]), d = l(d, e, f, c, C, 23, a[35]), c = l(c, d, e, f, w, 4, a[36]), f = l(f, c, d, e, r, 11, a[37]), e = l(e, f, c, d, u, 16, a[38]), d = l(d, e, f, c, y, 23, a[39]), c = l(c, d, e, f, B, 4, a[40]), f = l(f, c, d, e, h, 11, a[41]), e = l(e, f, c, d, q, 16, a[42]), d = l(d, e, f, c, t, 23, a[43]), c = l(c, d, e, f, x, 4, a[44]), f = l(f, c, d, e, A, 11, a[45]), e = l(e, f, c, d, D, 16, a[46]), d = l(d, e, f, c, j, 23, a[47]), c = n(c, d, e, f, h, 6, a[48]), f = n(f, c, d, e, u, 10, a[49]), e = n(e, f, c, d, C, 15, a[50]), d = n(d, e, f, c, s, 21, a[51]), c = n(c, d, e, f, A, 6, a[52]), f = n(f, c, d, e, q, 10, a[53]), e = n(e, f, c, d, y, 15, a[54]), d = n(d, e, f, c, w, 21, a[55]), c = n(c, d, e, f, v, 6, a[56]), f = n(f, c, d, e, D, 10, a[57]), e = n(e, f, c, d, t, 15, a[58]), d = n(d, e, f, c, B, 21, a[59]), c = n(c, d, e, f, r, 6, a[60]), f = n(f, c, d, e, z, 10, a[61]), e = n(e, f, c, d, j, 15, a[62]), d = n(d, e, f, c, x, 21, a[63]); b[0] = b[0] + c | 0; b[1] = b[1] + d | 0; b[2] = b[2] + e | 0; b[3] = b[3] + f | 0 }, _doFinalize: function () { var a = this._data, k = a.words, b = 8 * this._nDataBytes, h = 8 * a.sigBytes; k[h >>> 5] |= 128 << 24 - h % 32; var l = s.floor(b / 4294967296); k[(h + 64 >>> 9 << 4) + 15] = (l << 8 | l >>> 24) & 16711935 | (l << 24 | l >>> 8) & 4278255360; k[(h + 64 >>> 9 << 4) + 14] = (b << 8 | b >>> 24) & 16711935 | (b << 24 | b >>> 8) & 4278255360; a.sigBytes = 4 * (k.length + 1); this._process(); a = this._hash; k = a.words; for (b = 0; 4 > b; b++) h = k[b], k[b] = (h << 8 | h >>> 24) & 16711935 | (h << 24 | h >>> 8) & 4278255360; return a }, clone: function () { var a = t.clone.call(this); a._hash = this._hash.clone(); return a } }); r.MD5 = t._createHelper(q); r.HmacMD5 = t._createHmacHelper(q) })(Math);
    /* jshint ignore:end */
    return CryptoJS.MD5(message).toString();
};


/**
* Remove all backslashes that represent scape of characters
*/
bizagi.util.stripslashes = function (str) {
    return str.replace(/\\'/g, '\'').replace(/\"/g, '"').replace(/\\\\/g, '\\').replace(/\\0/g, '\0');
};

/*
*   get time ago
*/
bizagi.getTimeAgo = function (commentTime) {
    return $.timeago(new Date(commentTime));
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

bizagi.util.dispose = function (obj) {
    for (key in obj) {
        if (typeof (obj[key]) == "object") delete obj[key];
        if (typeof (obj[key]) == "function") { obj[key] = null; delete obj[key]; }
    }
};
/*
*   Data grouped
*/
bizagi.getGroupedData = function(date) {
    var groupedData = {};

    var actualDate = new Date();
    var actualYear = actualDate.getFullYear();
    var actualMonth = actualDate.getMonth();
    var actualDay = actualDate.getDate();

    date = bizagi.util.isDate(date) ? date : actualDate;

    var tmpDate = new Date(date);
    var tmpMonth = tmpDate.getMonth();
    var tmpYear = tmpDate.getFullYear();
    var tmpDay = tmpDate.getDate();

    var dateDiff = ((new Date(tmpYear, tmpMonth, tmpDay, 0, 0, 0) - new Date(actualYear, actualMonth, actualDay, 0, 0, 0)));

    if (dateDiff < 0) {
        groupedData.date = bizagi.util.dateFormatter.formatDate(new Date(tmpDate), "dd MMM");
        groupedData.type = bizagi.localization.getResource("workportal-taskfeed-overdue");
        groupedData.status = "red";
    } else {
        if (actualDay === tmpDay) {
            groupedData.date = bizagi.util.dateFormatter.formatDate(new Date(tmpDate), "hh:mm");
            groupedData.type = bizagi.localization.getResource("workportal-taskfeed-today");
            groupedData.status = "yellow";
        } else if ((actualDay + 1) === tmpDay) {
            groupedData.date = bizagi.util.dateFormatter.formatDate(new Date(tmpDate), "hh:mm");
            groupedData.type = bizagi.localization.getResource("workportal-taskfeed-tomorrow");
            groupedData.status = "yellow";
        } else {
            groupedData.date = bizagi.util.dateFormatter.formatDate(new Date(tmpDate), "dd MMM");
            groupedData.type = bizagi.localization.getResource("workportal-taskfeed-upcomming");
            groupedData.status = "green";
        }
    }

    return groupedData;
};

bizagi.util.getTaskStatus = function(date) {
    // Current date
    var actualDate = new Date();
    var actualMonth = actualDate.getMonth();
    var actualDay = actualDate.getDate();
    var actualYear = actualDate.getFullYear();

    // Solution date
    var solutionDate = date || "";
    if (!bizagi.util.isDate(solutionDate)) return "--";

    // Temporal date
    var tmpDate = new Date(solutionDate);
    var tmpDay = tmpDate.getDate();
    var tmpMonth = tmpDate.getMonth();
    var tmpYear = tmpDate.getFullYear();

    // Difference date
    var dateDiff = ((new Date(tmpYear, tmpMonth, tmpDay, 0, 0, 0)
        - new Date(actualYear, actualMonth, actualDay, 0, 0, 0)));

    if (dateDiff < 0) {
        return bizagi.util.dateFormatter.formatDate(new Date(solutionDate), "dd MMM");
    } else {
        if (actualMonth === tmpMonth && actualDay === tmpDay) {
            return bizagi.util.dateFormatter.formatDate(new Date(solutionDate), "hh:mm");
        } else if (actualMonth === tmpMonth && (actualDay + 1) === tmpDay) {
            return bizagi.util.dateFormatter.formatDate(new Date(solutionDate), "hh:mm");
        } else {
            return bizagi.util.dateFormatter.formatDate(new Date(solutionDate), "dd MMM");
        }
    }
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

bizagi.util.smartphone.startLoading = function () {
    bizagiLoader().start();
};

bizagi.util.smartphone.stopLoading = function () {
    bizagiLoader().stop();
};

/*
* Give format to data
*/
bizagi.util.formatDataType = function (value, dataType) {

    var parseValue = "";

    if (dataType === "NText" || dataType === "VarChar") {
        parseValue = "<div>" + bizagi.util.replaceLineBreak(value) + "</div>";
    } else if (dataType === "Boolean") {
        parseValue = bizagi.util.formatBoolean(value);
    } else if (dataType === "Int" || dataType === "BigInt" || dataType === "SmallInt" || dataType === "TinyInt") {
        parseValue = value;
    } else if (dataType === "Money") {
        parseValue = bizagi.util.formatMonetaryCell(value);
    } else if (dataType === "Float" || dataType === "Real") {
        parseValue = bizagi.util.formatDecimalCell(value);
    } else if (dataType === "DateTime") {
        parseValue = bizagi.util.dateFormatter.formatDate(new Date(value), bizagi.localization.getResource("dateFormat") + " " + bizagi.localization.getResource("timeFormat"));
    } else {
        parseValue = value;
    }

    return parseValue;
};

/*
*   Dar formato a la celda tipo DateTime
*/
bizagi.util.formatDateTime = function (value) {
    value = (value == null) ? "" : value;
    value = (typeof value != "string") ? value.toString() : value;
    if (Date.parse(value)) {
        var newDate = new Date(value);
        var date = ((newDate.getMonth() + 1) < 10 ? ("0" + (newDate.getMonth() + 1)) : (newDate.getMonth() + 1)) + "/" + ((newDate.getDate() < 10) ? ('0' + newDate.getDate()) : newDate.getDate()) + "/" + newDate.getFullYear();
        var time = (newDate.getHours() < 12 && value.toLowerCase().indexOf("pm") > 0 ? newDate.getHours() + 12 : newDate.getHours()) + ":" + (newDate.getMinutes() < 10 ? "0" + newDate.getMinutes() : newDate.getMinutes());

        return (date + " " + time);
    } else {
        return value;
    }
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
bizagi.util.formatDecimalCell = function (value) {
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
    var decimalFormat = $.extend(defaultDecimalFormat, externalDecimalFormat);
    return bizagi.util.formatDecimal(value, decimalFormat);
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
            decimalResult = "";

    if (value != undefined)
        value = value.toString();
    else
        value = "0";

    if (value.length >= 1) {
        var decimalDigitPosition = value.indexOf(".");

        if (decimalDigitPosition > 0) {
            value = parseFloat(value).toFixed(format.decimalDigits);
            intSection = value.substring(0, decimalDigitPosition);
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
        result = format.symbol + result + decimalSection;

        return result;
    } else {
        return value;
    }
};

bizagi.util.formatDecimal = function (value, format) {
    var i = $("<i/>").text(value);
    i.formatCurrency(format);
    return i.text();
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


(function ($) {

    $.fn.callInside = function (fx, args) {
        if ($(this)[0].tagName.toLowerCase() != "iframe") return null;
        // Don't execute the code when the content window is not ready yet    
        if ($(this)[0].contentWindow == null) return null;

        // Check if the iframe is cross domain
        try {
            // Evals the content
            $(this)[0].contentWindow.args = args;
        } catch (e) {
            // If an exception is thrown here this is a cross domain access
            return null;
        }

        return $(this)[0].contentWindow.eval('args = window.args;insideFunction = ' + fx.toString() + '; insideFunction(args)');
    };

})(jQuery);


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

/**
 * Syntax Highlight
 * @param {} json 
 * @returns {} 
 */
bizagi.util.syntaxHighlight = function (json) {
    if (typeof (json) == "undefined" || json == null) return "";

    json = json.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = "number";

        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = "key";
            } else {
                cls = "string";
            }
        } else if (/true|false/.test(match)) {
            cls = "boolean";
        } else if (/null/.test(match)) {
            cls = "null";
        }

        return "<span class='" + cls + "'>" + match + "</span>";
    });
};

/**
 * Convert String to Base64 Unicode
 * @param {} str 
 * @returns {} 
 */
bizagi.util.b64EncodeUnicode = function (string) {
    return btoa(encodeURIComponent(string).replace(/%([0-9A-F]{2})/g, function (match, p1) {
        return String.fromCharCode("0x" + p1);
    }));
};

/**
 * Return a function, that, as long as it continues to be invoked, will
 * not be triggered. The function will be called after it stops being 
 * called for 'wait' milliseconds. If 'immediate' is passed, trigger the 
 * function on the leading edge, instead of the trailing.
 * @param {} func 
 * @param {} wait 
 * @param {} immediate 
 * @returns {} 
 */
bizagi.util.debounce = function (func, wait, immediate) {
    var timeout;
    return function () {
        var context = this,
			args = arguments;
        var later = function () {
            timeout = null;
            if (!immediate) {
                func.apply(context, args);
            }
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait || 200);
        if (callNow) {
            func.apply(context, args);
        }
    };
};

/**
 * Read the query string parameteres 
 * @param {} url 
 * @returns {} 
 */
bizagi.util.getQueryString = function (url) {
    var params = {};
    url = url || window.location.href;
    var query = url.indexOf("?") > 0 ? url.substring(url.indexOf("?") + 1) : "";
    var pairs = query.split("&");
    for (var i = 0; i < pairs.length; i++) {
        var pos = pairs[i].indexOf('=');
        if (pos == -1)
            continue;
        var argname = pairs[i].substring(0, pos);
        var value = pairs[i].substring(pos + 1);
        params[argname] = unescape(value);
    }
    return params;
};
