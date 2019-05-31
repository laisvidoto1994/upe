/*
 *   Name: BizAgi Master JavaScript
 *   Author: Diego Parra
 *   Comments:
 *   -   This script will create global definitions and constants available to all pages
 */

// Add support to Windows 8
if (typeof Windows != "undefined") {
    // WINDOWS 8 ONLY CODE

    // Fix append
    jQuery.fn.nonSecureAppend = jQuery.fn.append;
    jQuery.fn.append = function() {
        // Call original jquery method
        var _arguments = arguments;
        var self = this;
        var result = MSApp.execUnsafeLocalFunction(function() {
            return jQuery.fn.nonSecureAppend.apply(self, _arguments);
        });
        // Return original response
        return result;
    } 

    // Fix before
    jQuery.fn.nonSecureBefore = jQuery.fn.before;
    jQuery.fn.before = function() {
        // Call original jquery method
        var _arguments = arguments;
        var self = this;
        var result = MSApp.execUnsafeLocalFunction(function() {
            return jQuery.fn.nonSecureBefore.apply(self, _arguments);
        });
        // Return original response
        return result;
    }

    // Fix after
    jQuery.fn.nonSecureAfter = jQuery.fn.after;
    jQuery.fn.after = function () {
        // Call original jquery method
        var _arguments = arguments;
        var self = this;
        var result = MSApp.execUnsafeLocalFunction(function () {
            return jQuery.fn.nonSecureAfter.apply(self, _arguments);
        });
        // Return original response
        return result;
    }

    // Fix clean
    jQuery.nonSecureClean = jQuery.clean;
    jQuery.clean = function() {
        // Call original jquery method
        var _arguments = arguments;
        var self = this;
        var result = MSApp.execUnsafeLocalFunction(function() {
            return jQuery.nonSecureClean.apply(self, _arguments);
        });
        // Return original response
        return result;
    }

    // Fix replaceWith
    jQuery.nonSecurereplaceWith = jQuery.fn.replaceWith;
    jQuery.fn.replaceWith = function () {
        // Call original jquery method
        var _arguments = arguments;
        var self = this;
        var result = MSApp.execUnsafeLocalFunction(function () {
            return jQuery.nonSecurereplaceWith.apply(self, _arguments);
        });
        // Return original response
        return result;
    }

    // Fix insertBefore
    jQuery.nonSecureinsertBefore = jQuery.fn.insertBefore;
    jQuery.fn.insertBefore = function () {
        // Call original jquery method
        var _arguments = arguments;
        var self = this;
        var result = MSApp.execUnsafeLocalFunction(function () {
            return jQuery.nonSecureinsertBefore.apply(self, _arguments);
        });
        // Return original response
        return result;
    }

    // Fix buildFragment
    jQuery.nonSecurebuildFragment = jQuery.buildFragment;
    jQuery.buildFragment = function () {
        // Call original jquery method
        var _arguments = arguments;
        var self = this;
        var result = MSApp.execUnsafeLocalFunction(function () {
            return jQuery.nonSecurebuildFragment.apply(self, _arguments);
        });
        // Return original response
        return result;
    }
}

// Remove jQuery Sizzle selector cache feature, to avoid memory leaks
$.expr.cacheLength = 1;

// Bizagi initialization routine
function initBizagi() {
    if (bizagi.loader.initialized == false) {
        setTimeout(initBizagi, 100);
        return;
    }

    // Create or Define BizAgi namespace
    bizagi = (typeof(bizagi) !== "undefined") ? bizagi : {};

    // Redefine logging stuff
    bizagi.enableCustomizations = typeof(BIZAGI_ENABLE_CUSTOMIZATIONS) !== "undefined" ? BIZAGI_ENABLE_CUSTOMIZATIONS : true;
    bizagi.enableTrace = typeof(BIZAGI_ENABLE_LOG) !== "undefined" ? BIZAGI_ENABLE_LOG : true;
    bizagi.enableDebug = typeof(BIZAGI_ENABLE_LOG) !== "undefined" ? BIZAGI_ENABLE_LOG : false;
    bizagi.enableChrono = typeof (BIZAGI_ENABLE_LOG) !== "undefined" ? BIZAGI_ENABLE_LOG : true;
    bizagi.enableProfiler = typeof (BIZAGI_ENABLE_PROFILER) !== "undefined" ? BIZAGI_ENABLE_PROFILER : bizagi.readQueryString()["enableProfiler"] === "true"? true : false;
    bizagi.services.ajax.logSuccess = typeof(BIZAGI_ENABLE_LOG) !== "undefined" ? BIZAGI_ENABLE_LOG : true;
    bizagi.services.ajax.logSubmits = typeof (BIZAGI_ENABLE_LOG) !== "undefined" ? BIZAGI_ENABLE_LOG : true;
    bizagi.proxyPrefix = typeof (BIZAGI_PROXY_PREFIX) !== "undefined" ? BIZAGI_PROXY_PREFIX : "";
    bizagi.UserPreferencesUrl = typeof (BIZAGI_USER_PREFERENCES_PAGE) !== "undefined" ? BIZAGI_USER_PREFERENCES_PAGE : "";
    BIZAGI_PATH_TO_BASE = typeof (BIZAGI_PATH_TO_BASE) !== "undefined" ? BIZAGI_PATH_TO_BASE : "";

    // Set l10n settings
    bizagi.resourceDefinitionLocation = {
        "custom": bizagi.loader.getResource("l10n", "bizagi.custom.resources"),
        "default": bizagi.loader.getResource("l10n", "bizagi.resources.default"),
        "ja": bizagi.loader.getResource("l10n", "bizagi.resources.ja"),
        "en": bizagi.loader.getResource("l10n", "bizagi.resources.en-us"),
        "en-us": bizagi.loader.getResource("l10n", "bizagi.resources.en-us"),
        "es": bizagi.loader.getResource("l10n", "bizagi.resources.es"),
        "es-es": bizagi.loader.getResource("l10n", "bizagi.resources.es"),
        "en-mobile": bizagi.loader.getResource("l10n", "bizagi.resources.en-mobile")
    };
    // If it is a webpart we need to get the language first
    if (typeof isWebpart === 'boolean' && isWebpart === true)
        $.when($.read(bizagi.proxyPrefix + "Rest/Users/CurrentUser")).done(function (data) {
            assignLanguage(data.language);
        }).fail(function () {
            assignLanguage();
        });
        // Otherwise it has already detected the language
    else assignLanguage();

    bizagi.initialized = true;
}

function assignLanguage(defaultLanguage) {
    defaultLanguage = defaultLanguage || bizagi.readQueryString()["language"];
    defaultLanguage = defaultLanguage || (typeof(BIZAGI_LANGUAGE) !== "undefined" ? BIZAGI_LANGUAGE : null);
    defaultLanguage = defaultLanguage || "default";
    bizagi.language = defaultLanguage;

    // Set localization settings
    bizagi.localization = new bizagi.l10n(bizagi.resourceDefinitionLocation);
    bizagi.localization.setLanguage(bizagi.language);

    // Defines a global template service instance for general purposes
    bizagi.templateService = new bizagi.templates.services.service(bizagi.localization);

    // Check if browser is IE to include a special css
    if (bizagi.util.isIE && bizagi.util.isIE()) {
        bizagi.loader.loadFile({
            src: bizagi.getStyleSheet("common.ie7"),
            type: "css"
        });
    }

    // Set a global error handler
    window.onerror = function() {
        bizagi.logError("Uncaught error", {
            message: arguments[0],
            file: arguments[1],
            line: arguments[2]
        });
    };
}

// Added validation for modules using this javascript in common
if (!bizagi.initialized) {
    initBizagi();
}

// Compatibility for IE8 - Array methods
if (bizagi.util.isIE8 && bizagi.util.isIE8()) {
    if (!Array.isArray) {
        Array.isArray = function (obj) {
            return Object.prototype.toString.call(obj) === "[object Array]" ||
               (obj instanceof Array);
        };
    }
    if (!Array.prototype.forEach) {
        Array.prototype.forEach = function (block, thisObject) {
            var len = this.length >>> 0;
            for (var i = 0; i < len; i++) {
                if (i in this) {
                    block.call(thisObject, this[i], i, this);
                }
            }
        };
    }
    if (!Array.prototype.map) {
        Array.prototype.map = function (fun /*, thisp*/) {
            var len = this.length >>> 0;
            var res = new Array(len);
            var thisp = arguments[1];

            for (var i = 0; i < len; i++) {
                if (i in this) {
                    res[i] = fun.call(thisp, this[i], i, this);
                }
            }
            return res;
        };
    }
    if (!Array.prototype.filter) {
        Array.prototype.filter = function (block /*, thisp */) {
            var values = [];
            var thisp = arguments[1];
            for (var i = 0; i < this.length; i++) {
                if (block.call(thisp, this[i])) {
                    values.push(this[i]);
                }
            }
            return values;
        };
    }
    if (!Array.prototype.reduce) {
        Array.prototype.reduce = function (fun /*, initial*/) {
            var len = this.length >>> 0;
            var i = 0;

            // no value to return if no initial value and an empty array
            if (len === 0 && arguments.length === 1) throw new TypeError();

            if (arguments.length >= 2) {
                var rv = arguments[1];
            } else {
                do {
                    if (i in this) {
                        rv = this[i++];
                        break;
                    }
                    // if array contains no values, no initial value to return
                    if (++i >= len) throw new TypeError();
                } while (true);
            }
            for (; i < len; i++) {
                if (i in this) {
                    rv = fun.call(null, rv, this[i], i, this);
                }
            }
            return rv;
        };
    }
    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function (value /*, fromIndex */) {
            var length = this.length;
            var i = arguments[1] || 0;

            if (!length) return -1;
            if (i >= length) return -1;
            if (i < 0) i += length;

            for (; i < length; i++) {
                if (!Object.prototype.hasOwnProperty.call(this, i)) { continue }
                if (value === this[i]) return i;
            }
            return -1;
        };
    }

	/**
	 * Polyfill to implement Object.keys in older browsers IE<9
	 * Object.keys return an array with keys of the Object
	 * Useful to know length of object
	 */
    if (!Object.keys) {
        Object.keys = function (object) {
            var keys = [];
            for (var name in object) {
                if (Object.prototype.hasOwnProperty.call(object, name)) {
                    keys.push(name);
                }
            }
            return keys;
        };
    }
}