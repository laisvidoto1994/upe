var bizagi=bizagi||{};bizagi.injector=function(){var u=20,f=function(n){return Object.prototype.toString.call(n)==="[object Array]"},n={},r={},t={},e="Maximum recursion at ",o="Must pass array.",s="Must pass function to invoke.",h="Service does not exist.",i=function(t,i){var u=n[t],r,f;if($.isNumeric(i)?r=i:$.type(i)==="object"&&(f=i),r=r||0,u)return u(r,f);throw h+" "+t;},c=function(t,u){return n[t]=r[t],i(t,u)},l=function(n,t,r,f,o){var s=0,h=[],c=f||0;if(c>u)throw e+c;for(;s<t.length;s+=1)h.push(i(t[s],c+1));return o&&h.push(o),n.apply(r,h)},a=function(i,u,e){if(!f(u))throw o;if(typeof u[u.length-1]!="function")throw s;r[i]=n[i]=function(r,f){var v=r||0,h=function(){},o={},s,c=u[u.length-1],y=u.length===1?u[0].$$deps||[]:u.slice(0,u.length-1),a;return t[i]&&typeof t[i].__proto__!="undefined"&&t[i].__proto__.hasOwnProperty("dispose")&&t[i].dispose(),h.prototype=c.prototype,s=new h,a=l(c,y,s,v+1,f),o=a||s,e||(n[i]=function(){return o}),t[i]=o,o}},v=function(t){return n[t]?!0:!1},y=function(t,i){n[t]=function(){return i}};return{get:i,getNewInstance:c,register:a,registerInstance:y,isRegistered:v}}();
// pouchdb.nightly - 2013-11-15T17:22:49

(function() {
 // BEGIN Math.uuid.js

/*!
Math.uuid.js (v1.4)
http://www.broofa.com
mailto:robert@broofa.com

Copyright (c) 2010 Robert Kieffer
Dual licensed under the MIT and GPL licenses.
*/

/*
 * Generate a random uuid.
 *
 * USAGE: Math.uuid(length, radix)
 *   length - the desired number of characters
 *   radix  - the number of allowable values for each character.
 *
 * EXAMPLES:
 *   // No arguments  - returns RFC4122, version 4 ID
 *   >>> Math.uuid()
 *   "92329D39-6F5C-4520-ABFC-AAB64544E172"
 *
 *   // One argument - returns ID of the specified length
 *   >>> Math.uuid(15)     // 15 character ID (default base=62)
 *   "VcydxgltxrVZSTV"
 *
 *   // Two arguments - returns ID of the specified length, and radix. (Radix must be <= 62)
 *   >>> Math.uuid(8, 2)  // 8 character ID (base=2)
 *   "01001010"
 *   >>> Math.uuid(8, 10) // 8 character ID (base=10)
 *   "47473046"
 *   >>> Math.uuid(8, 16) // 8 character ID (base=16)
 *   "098F4D35"
 */
var uuid;

(function() {

  var CHARS = (
    '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
    'abcdefghijklmnopqrstuvwxyz'
    ).split('');

  uuid = function uuid_inner(len, radix) {
    var chars = CHARS;
    var uuidInner = [];
    var i;

    radix = radix || chars.length;

    if (len) {
      // Compact form
      for (i = 0; i < len; i++) uuidInner[i] = chars[0 | Math.random()*radix];
    } else {
      // rfc4122, version 4 form
      var r;

      // rfc4122 requires these characters
      uuidInner[8] = uuidInner[13] = uuidInner[18] = uuidInner[23] = '-';
      uuidInner[14] = '4';

      // Fill in random data.  At i==19 set the high bits of clock sequence as
      // per rfc4122, sec. 4.1.5
      for (i = 0; i < 36; i++) {
        if (!uuidInner[i]) {
          r = 0 | Math.random()*16;
          uuidInner[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
        }
      }
    }

    return uuidInner.join('');
  };

})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = uuid;
}

/**
*
*  MD5 (Message-Digest Algorithm)
*
*  For original source see http://www.webtoolkit.info/
*  Download: 15.02.2009 from http://www.webtoolkit.info/javascript-md5.html
*
*  Licensed under CC-BY 2.0 License
*  (http://creativecommons.org/licenses/by/2.0/uk/)
*
**/

var Crypto = {};

(function() {
  Crypto.MD5 = function(string) {

    function RotateLeft(lValue, iShiftBits) {
      return (lValue<<iShiftBits) | (lValue>>>(32-iShiftBits));
    }

    function AddUnsigned(lX,lY) {
      var lX4,lY4,lX8,lY8,lResult;
      lX8 = (lX & 0x80000000);
      lY8 = (lY & 0x80000000);
      lX4 = (lX & 0x40000000);
      lY4 = (lY & 0x40000000);
      lResult = (lX & 0x3FFFFFFF)+(lY & 0x3FFFFFFF);
      if (lX4 & lY4) {
        return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
      }
      if (lX4 | lY4) {
        if (lResult & 0x40000000) {
          return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
        } else {
          return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
        }
      } else {
        return (lResult ^ lX8 ^ lY8);
      }
    }

    function F(x,y,z) { return (x & y) | ((~x) & z); }
    function G(x,y,z) { return (x & z) | (y & (~z)); }
    function H(x,y,z) { return (x ^ y ^ z); }
    function I(x,y,z) { return (y ^ (x | (~z))); }

    function FF(a,b,c,d,x,s,ac) {
      a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
      return AddUnsigned(RotateLeft(a, s), b);
    };

    function GG(a,b,c,d,x,s,ac) {
      a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
      return AddUnsigned(RotateLeft(a, s), b);
    };

    function HH(a,b,c,d,x,s,ac) {
      a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
      return AddUnsigned(RotateLeft(a, s), b);
    };

    function II(a,b,c,d,x,s,ac) {
      a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
      return AddUnsigned(RotateLeft(a, s), b);
    };

    function ConvertToWordArray(string) {
      var lWordCount;
      var lMessageLength = string.length;
      var lNumberOfWords_temp1=lMessageLength + 8;
      var lNumberOfWords_temp2=(lNumberOfWords_temp1-(lNumberOfWords_temp1 % 64))/64;
      var lNumberOfWords = (lNumberOfWords_temp2+1)*16;
      var lWordArray=Array(lNumberOfWords-1);
      var lBytePosition = 0;
      var lByteCount = 0;
      while ( lByteCount < lMessageLength ) {
        lWordCount = (lByteCount-(lByteCount % 4))/4;
        lBytePosition = (lByteCount % 4)*8;
        lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount)<<lBytePosition));
        lByteCount++;
      }
      lWordCount = (lByteCount-(lByteCount % 4))/4;
      lBytePosition = (lByteCount % 4)*8;
      lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80<<lBytePosition);
      lWordArray[lNumberOfWords-2] = lMessageLength<<3;
      lWordArray[lNumberOfWords-1] = lMessageLength>>>29;
      return lWordArray;
    };

    function WordToHex(lValue) {
      var WordToHexValue="",WordToHexValue_temp="",lByte,lCount;
      for (lCount = 0;lCount<=3;lCount++) {
        lByte = (lValue>>>(lCount*8)) & 255;
        WordToHexValue_temp = "0" + lByte.toString(16);
        WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length-2,2);
      }
      return WordToHexValue;
    };

    //**	function Utf8Encode(string) removed. Aready defined in pidcrypt_utils.js

    var x=Array();
    var k,AA,BB,CC,DD,a,b,c,d;
    var S11=7, S12=12, S13=17, S14=22;
    var S21=5, S22=9 , S23=14, S24=20;
    var S31=4, S32=11, S33=16, S34=23;
    var S41=6, S42=10, S43=15, S44=21;

    //	string = Utf8Encode(string); #function call removed

    x = ConvertToWordArray(string);

    a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;

    for (k=0;k<x.length;k+=16) {
      AA=a; BB=b; CC=c; DD=d;
      a=FF(a,b,c,d,x[k+0], S11,0xD76AA478);
      d=FF(d,a,b,c,x[k+1], S12,0xE8C7B756);
      c=FF(c,d,a,b,x[k+2], S13,0x242070DB);
      b=FF(b,c,d,a,x[k+3], S14,0xC1BDCEEE);
      a=FF(a,b,c,d,x[k+4], S11,0xF57C0FAF);
      d=FF(d,a,b,c,x[k+5], S12,0x4787C62A);
      c=FF(c,d,a,b,x[k+6], S13,0xA8304613);
      b=FF(b,c,d,a,x[k+7], S14,0xFD469501);
      a=FF(a,b,c,d,x[k+8], S11,0x698098D8);
      d=FF(d,a,b,c,x[k+9], S12,0x8B44F7AF);
      c=FF(c,d,a,b,x[k+10],S13,0xFFFF5BB1);
      b=FF(b,c,d,a,x[k+11],S14,0x895CD7BE);
      a=FF(a,b,c,d,x[k+12],S11,0x6B901122);
      d=FF(d,a,b,c,x[k+13],S12,0xFD987193);
      c=FF(c,d,a,b,x[k+14],S13,0xA679438E);
      b=FF(b,c,d,a,x[k+15],S14,0x49B40821);
      a=GG(a,b,c,d,x[k+1], S21,0xF61E2562);
      d=GG(d,a,b,c,x[k+6], S22,0xC040B340);
      c=GG(c,d,a,b,x[k+11],S23,0x265E5A51);
      b=GG(b,c,d,a,x[k+0], S24,0xE9B6C7AA);
      a=GG(a,b,c,d,x[k+5], S21,0xD62F105D);
      d=GG(d,a,b,c,x[k+10],S22,0x2441453);
      c=GG(c,d,a,b,x[k+15],S23,0xD8A1E681);
      b=GG(b,c,d,a,x[k+4], S24,0xE7D3FBC8);
      a=GG(a,b,c,d,x[k+9], S21,0x21E1CDE6);
      d=GG(d,a,b,c,x[k+14],S22,0xC33707D6);
      c=GG(c,d,a,b,x[k+3], S23,0xF4D50D87);
      b=GG(b,c,d,a,x[k+8], S24,0x455A14ED);
      a=GG(a,b,c,d,x[k+13],S21,0xA9E3E905);
      d=GG(d,a,b,c,x[k+2], S22,0xFCEFA3F8);
      c=GG(c,d,a,b,x[k+7], S23,0x676F02D9);
      b=GG(b,c,d,a,x[k+12],S24,0x8D2A4C8A);
      a=HH(a,b,c,d,x[k+5], S31,0xFFFA3942);
      d=HH(d,a,b,c,x[k+8], S32,0x8771F681);
      c=HH(c,d,a,b,x[k+11],S33,0x6D9D6122);
      b=HH(b,c,d,a,x[k+14],S34,0xFDE5380C);
      a=HH(a,b,c,d,x[k+1], S31,0xA4BEEA44);
      d=HH(d,a,b,c,x[k+4], S32,0x4BDECFA9);
      c=HH(c,d,a,b,x[k+7], S33,0xF6BB4B60);
      b=HH(b,c,d,a,x[k+10],S34,0xBEBFBC70);
      a=HH(a,b,c,d,x[k+13],S31,0x289B7EC6);
      d=HH(d,a,b,c,x[k+0], S32,0xEAA127FA);
      c=HH(c,d,a,b,x[k+3], S33,0xD4EF3085);
      b=HH(b,c,d,a,x[k+6], S34,0x4881D05);
      a=HH(a,b,c,d,x[k+9], S31,0xD9D4D039);
      d=HH(d,a,b,c,x[k+12],S32,0xE6DB99E5);
      c=HH(c,d,a,b,x[k+15],S33,0x1FA27CF8);
      b=HH(b,c,d,a,x[k+2], S34,0xC4AC5665);
      a=II(a,b,c,d,x[k+0], S41,0xF4292244);
      d=II(d,a,b,c,x[k+7], S42,0x432AFF97);
      c=II(c,d,a,b,x[k+14],S43,0xAB9423A7);
      b=II(b,c,d,a,x[k+5], S44,0xFC93A039);
      a=II(a,b,c,d,x[k+12],S41,0x655B59C3);
      d=II(d,a,b,c,x[k+3], S42,0x8F0CCC92);
      c=II(c,d,a,b,x[k+10],S43,0xFFEFF47D);
      b=II(b,c,d,a,x[k+1], S44,0x85845DD1);
      a=II(a,b,c,d,x[k+8], S41,0x6FA87E4F);
      d=II(d,a,b,c,x[k+15],S42,0xFE2CE6E0);
      c=II(c,d,a,b,x[k+6], S43,0xA3014314);
      b=II(b,c,d,a,x[k+13],S44,0x4E0811A1);
      a=II(a,b,c,d,x[k+4], S41,0xF7537E82);
      d=II(d,a,b,c,x[k+11],S42,0xBD3AF235);
      c=II(c,d,a,b,x[k+2], S43,0x2AD7D2BB);
      b=II(b,c,d,a,x[k+9], S44,0xEB86D391);
      a=AddUnsigned(a,AA);
      b=AddUnsigned(b,BB);
      c=AddUnsigned(c,CC);
      d=AddUnsigned(d,DD);
    }
    var temp = WordToHex(a)+WordToHex(b)+WordToHex(c)+WordToHex(d);
    return temp.toLowerCase();
  }
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Crypto;
}
//Abstracts constructing a Blob object, so it also works in older
//browsers that don't support the native Blob constructor. (i.e.
//old QtWebKit versions, at least).
function createBlob(parts, properties) {
  parts = parts || [];
  properties = properties || {};
  try {
    return new Blob(parts, properties);
  } catch (e) {
    if (e.name !== "TypeError") {
      throw(e);
    }
    var BlobBuilder = window.BlobBuilder || window.MSBlobBuilder || window.MozBlobBuilder || window.WebKitBlobBuilder;
    var builder = new BlobBuilder();
    for (var i = 0; i < parts.length; i += 1) {
      builder.append(parts[i]);
    }
    return builder.getBlob(properties.type);
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = createBlob;
}

//----------------------------------------------------------------------
//
// ECMAScript 5 Polyfills
//  from www.calocomrmen./polyfill/
//
//----------------------------------------------------------------------

//----------------------------------------------------------------------
// ES5 15.2 Object Objects
//----------------------------------------------------------------------



// ES 15.2.3.6 Object.defineProperty ( O, P, Attributes )
// Partial support for most common case - getters, setters, and values
(function() {
  if (!Object.defineProperty ||
      !(function () { try { Object.defineProperty({}, 'x', {}); return true; } catch (e) { return false; } } ())) {
    var orig = Object.defineProperty;
    Object.defineProperty = function (o, prop, desc) {
      "use strict";

      // In IE8 try built-in implementation for defining properties on DOM prototypes.
      if (orig) { try { return orig(o, prop, desc); } catch (e) {} }

      if (o !== Object(o)) { throw new TypeError("Object.defineProperty called on non-object"); }
      if (Object.prototype.__defineGetter__ && ('get' in desc)) {
        Object.prototype.__defineGetter__.call(o, prop, desc.get);
      }
      if (Object.prototype.__defineSetter__ && ('set' in desc)) {
        Object.prototype.__defineSetter__.call(o, prop, desc.set);
      }
      if ('value' in desc) {
        o[prop] = desc.value;
      }
      return o;
    };
  }
}());



// ES5 15.2.3.14 Object.keys ( O )
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Object/keys
if (!Object.keys) {
  Object.keys = function (o) {
    if (o !== Object(o)) { throw new TypeError('Object.keys called on non-object'); }
    var ret = [], p;
    for (p in o) {
      if (Object.prototype.hasOwnProperty.call(o, p)) {
        ret.push(p);
      }
    }
    return ret;
  };
}

//----------------------------------------------------------------------
// ES5 15.4 Array Objects
//----------------------------------------------------------------------



// ES5 15.4.4.18 Array.prototype.forEach ( callbackfn [ , thisArg ] )
// From https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/forEach
if (!Array.prototype.forEach) {
  Array.prototype.forEach = function (fun /*, thisp */) {
    "use strict";

    if (this === void 0 || this === null) { throw new TypeError(); }

    var t = Object(this);
    var len = t.length >>> 0;
    if (typeof fun !== "function") { throw new TypeError(); }

    var thisp = arguments[1], i;
    for (i = 0; i < len; i++) {
      if (i in t) {
        fun.call(thisp, t[i], i, t);
      }
    }
  };
}


// ES5 15.4.4.19 Array.prototype.map ( callbackfn [ , thisArg ] )
// From https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/Map
if (!Array.prototype.map) {
  Array.prototype.map = function (fun /*, thisp */) {
    "use strict";

    if (this === void 0 || this === null) { throw new TypeError(); }

    var t = Object(this);
    var len = t.length >>> 0;
    if (typeof fun !== "function") { throw new TypeError(); }

    var res = []; res.length = len;
    var thisp = arguments[1], i;
    for (i = 0; i < len; i++) {
      if (i in t) {
        res[i] = fun.call(thisp, t[i], i, t);
      }
    }

    return res;
  };
}


// Extends method
// (taken from http://code.jquery.com/jquery-1.9.0.js)
// Populate the class2type map
var class2type = {};

var types = ["Boolean", "Number", "String", "Function", "Array", "Date", "RegExp", "Object", "Error"];
for (var i = 0; i < types.length; i++) {
  var typename = types[i];
  class2type[ "[object " + typename + "]" ] = typename.toLowerCase();
}

var core_toString = class2type.toString;
var core_hasOwn = class2type.hasOwnProperty;

var type = function(obj) {
  if (obj === null) {
    return String( obj );
  }
  return typeof obj === "object" || typeof obj === "function" ?
    class2type[core_toString.call(obj)] || "object" :
    typeof obj;
};

var isWindow = function(obj) {
  return obj !== null && obj === obj.window;
};

var isPlainObject = function( obj ) {
  // Must be an Object.
  // Because of IE, we also have to check the presence of the constructor property.
  // Make sure that DOM nodes and window objects don't pass through, as well
  if ( !obj || type(obj) !== "object" || obj.nodeType || isWindow( obj ) ) {
    return false;
  }

  try {
    // Not own constructor property must be Object
    if ( obj.constructor &&
      !core_hasOwn.call(obj, "constructor") &&
      !core_hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
      return false;
    }
  } catch ( e ) {
    // IE8,9 Will throw exceptions on certain host objects #9897
    return false;
  }

  // Own properties are enumerated firstly, so to speed up,
  // if last one is own, then all properties are own.

  var key;
  for ( key in obj ) {}

  return key === undefined || core_hasOwn.call( obj, key );
};

var isFunction = function(obj) {
  return type(obj) === "function";
};

var isArray = Array.isArray || function(obj) {
  return type(obj) === "array";
};

var extend = function() {
  var options, name, src, copy, copyIsArray, clone,
    target = arguments[0] || {},
    i = 1,
    length = arguments.length,
    deep = false;

  // Handle a deep copy situation
  if ( typeof target === "boolean" ) {
    deep = target;
    target = arguments[1] || {};
    // skip the boolean and the target
    i = 2;
  }

  // Handle case when target is a string or something (possible in deep copy)
  if ( typeof target !== "object" && !isFunction(target) ) {
    target = {};
  }

  // extend jQuery itself if only one argument is passed
  if ( length === i ) {
    target = this;
    --i;
  }

  for ( ; i < length; i++ ) {
    // Only deal with non-null/undefined values
    if ((options = arguments[ i ]) != null) {
      // Extend the base object
      for ( name in options ) {
        src = target[ name ];
        copy = options[ name ];

        // Prevent never-ending loop
        if ( target === copy ) {
          continue;
        }

        // Recurse if we're merging plain objects or arrays
        if ( deep && copy && ( isPlainObject(copy) || (copyIsArray = isArray(copy)) ) ) {
          if ( copyIsArray ) {
            copyIsArray = false;
            clone = src && isArray(src) ? src : [];

          } else {
            clone = src && isPlainObject(src) ? src : {};
          }

          // Never move original objects, clone them
          target[ name ] = extend( deep, clone, copy );

        // Don't bring in undefined values
        } else if ( copy !== undefined ) {
          if (!(isArray(options) && isFunction(copy))) {
            target[ name ] = copy;
          }
        }
      }
    }
  }

  // Return the modified object
  return target;
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = extend;
}

var request;
var extend;
var createBlob;

if (typeof module !== 'undefined' && module.exports) {
  request = require('request');
  extend = require('./extend.js');
  createBlob = require('./blob.js');
}

var ajax = function ajax(options, callback) {

  if (typeof options === "function") {
    callback = options;
    options = {};
  }

  var call = function(fun) {
    var args = Array.prototype.slice.call(arguments, 1);
    if (typeof fun === typeof Function) {
      fun.apply(this, args);
    }
  };

  var defaultOptions = {
    method : "GET",
    headers: {},
    json: true,
    processData: true,
    timeout: 10000
  };

  options = extend(true, defaultOptions, options);

  var onSuccess = function(obj, resp, cb){
    if (!options.binary && !options.json && options.processData &&
        typeof obj !== 'string') {
      obj = JSON.stringify(obj);
    } else if (!options.binary && options.json && typeof obj === 'string') {
      try {
        obj = JSON.parse(obj);
      } catch (e) {
        // Probably a malformed JSON from server
        call(cb, e);
        return;
      }
    }
    call(cb, null, obj, resp);
  };

  var onError = function(err, cb){
    var errParsed;
    var errObj = {status: err.status};
    try {
      errParsed = JSON.parse(err.responseText);
      //would prefer not to have a try/catch clause
      errObj = extend(true, {}, errObj, errParsed);
    } catch(e) {}
    call(cb, errObj);
  };

  if (typeof window !== 'undefined' && window.XMLHttpRequest) {
    var timer, timedout = false;
    var xhr = new XMLHttpRequest();

    xhr.open(options.method, options.url);
    xhr.withCredentials = true;

    if (options.json) {
      options.headers.Accept = 'application/json';
      options.headers['Content-Type'] = options.headers['Content-Type'] ||
        'application/json';
      if (options.body && options.processData && typeof options.body !== "string") {
        options.body = JSON.stringify(options.body);
      }
    }

    if (options.binary) {
      xhr.responseType = 'arraybuffer';
    }

    function createCookie(name,value,days) {
      if (days) {
	var date = new Date();
	date.setTime(date.getTime()+(days*24*60*60*1000));
	var expires = "; expires="+date.toGMTString();
      } else {
        var expires = "";
      }
      document.cookie = name+"="+value+expires+"; path=/";
    }

    for (var key in options.headers) {
      if (key === 'Cookie') {
        var cookie = options.headers[key].split('=');
        createCookie(cookie[0], cookie[1], 10);
      } else {
        xhr.setRequestHeader(key, options.headers[key]);
      }
    }

    if (!("body" in options)) {
      options.body = null;
    }

    var abortReq = function() {
      timedout=true;
      xhr.abort();
      call(onError, xhr, callback);
    };

    xhr.onreadystatechange = function() {
      if (xhr.readyState !== 4 || timedout) {
        return;
      }
      clearTimeout(timer);
      if (xhr.status >= 200 && xhr.status < 300) {
        var data;
        if (options.binary) {
          data = createBlob([xhr.response || ''], {
            type: xhr.getResponseHeader('Content-Type')
          });
        } else {
          data = xhr.responseText;
        }
        call(onSuccess, data, xhr, callback);
      } else {
         call(onError, xhr, callback);
      }
    };

    if (options.timeout > 0) {
      timer = setTimeout(abortReq, options.timeout);
    }
    xhr.send(options.body);
    return {abort:abortReq};

  } else {

    if (options.json) {
      if (!options.binary) {
        options.headers.Accept = 'application/json';
      }
      options.headers['Content-Type'] = options.headers['Content-Type'] ||
        'application/json';
    }

    if (options.binary) {
      options.encoding = null;
      options.json = false;
    }

    if (!options.processData) {
      options.json = false;
    }

    return request(options, function(err, response, body) {
      if (err) {
        err.status = response ? response.statusCode : 400;
        return call(onError, err, callback);
      }

      var content_type = response.headers['content-type'];
      var data = (body || '');

      // CouchDB doesn't always return the right content-type for JSON data, so
      // we check for ^{ and }$ (ignoring leading/trailing whitespace)
      if (!options.binary && (options.json || !options.processData) &&
          typeof data !== 'object' &&
          (/json/.test(content_type) ||
           (/^[\s]*\{/.test(data) && /\}[\s]*$/.test(data)))) {
        data = JSON.parse(data);
      }

      if (response.statusCode >= 200 && response.statusCode < 300) {
        call(onSuccess, data, response, callback);
      }
      else {
        if (options.binary) {
          data = JSON.parse(data.toString());
        }
        data.status = response.statusCode;
        call(callback, data);
      }
    });
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = ajax;
}

/*globals PouchAdapter: true, PouchUtils: true */

"use strict";

var PouchUtils;

if (typeof module !== 'undefined' && module.exports) {
  PouchUtils = require('./pouch.utils.js');
}

var Pouch = function Pouch(name, opts, callback) {

  if (!(this instanceof Pouch)) {
    return new Pouch(name, opts, callback);
  }

  if (typeof opts === 'function' || typeof opts === 'undefined') {
    callback = opts;
    opts = {};
  }

  if (typeof name === 'object') {
    opts = name;
    name = undefined;
  }

  if (typeof callback === 'undefined') {
    callback = function() {};
  }

  var backend = Pouch.parseAdapter(opts.name || name);
  opts.originalName = name;
  opts.name = opts.name || backend.name;
  opts.adapter = opts.adapter || backend.adapter;

  if (!Pouch.adapters[opts.adapter]) {
    throw 'Adapter is missing';
  }

  if (!Pouch.adapters[opts.adapter].valid()) {
    throw 'Invalid Adapter';
  }

  var adapter = new PouchAdapter(opts, function(err, db) {
    if (err) {
      if (callback) {
        callback(err);
      }
      return;
    }

    for (var plugin in Pouch.plugins) {
      // In future these will likely need to be async to allow the plugin
      // to initialise
      var pluginObj = Pouch.plugins[plugin](db);
      for (var api in pluginObj) {
        // We let things like the http adapter use its own implementation
        // as it shares a lot of code
        if (!(api in db)) {
          db[api] = pluginObj[api];
        }
      }
    }
    db.taskqueue.ready(true);
    db.taskqueue.execute(db);
    callback(null, db);
  });
  for (var j in adapter) {
    this[j] = adapter[j];
  }
  for (var plugin in Pouch.plugins) {
    // In future these will likely need to be async to allow the plugin
    // to initialise
    var pluginObj = Pouch.plugins[plugin](this);
    for (var api in pluginObj) {
      // We let things like the http adapter use its own implementation
      // as it shares a lot of code
      if (!(api in this)) {
        this[api] = pluginObj[api];
      }
    }
  }
};

Pouch.DEBUG = false;
Pouch.openReqList = {};
Pouch.adapters = {};
Pouch.plugins = {};

Pouch.prefix = '_pouch_';

Pouch.parseAdapter = function(name) {
  var match = name.match(/([a-z\-]*):\/\/(.*)/);
  var adapter;
  if (match) {
    // the http adapter expects the fully qualified name
    name = /http(s?)/.test(match[1]) ? match[1] + '://' + match[2] : match[2];
    adapter = match[1];
    if (!Pouch.adapters[adapter].valid()) {
      throw 'Invalid adapter';
    }
    return {name: name, adapter: match[1]};
  }

  var preferredAdapters = ['idb', 'leveldb', 'websql'];
  for (var i = 0; i < preferredAdapters.length; ++i) {
    if (preferredAdapters[i] in Pouch.adapters) {
      adapter = Pouch.adapters[preferredAdapters[i]];
      var use_prefix = 'use_prefix' in adapter ? adapter.use_prefix : true;

      return {
        name: use_prefix ? Pouch.prefix + name : name,
        adapter: preferredAdapters[i]
      };
    }
  }

  throw 'No valid adapter found';
};

Pouch.destroy = function(name, opts, callback) {
  if (typeof opts === 'function' || typeof opts === 'undefined') {
    callback = opts;
    opts = {};
  }

  if (typeof name === 'object') {
    opts = name;
    name = undefined;
  }

  if (typeof callback === 'undefined') {
    callback = function() {};
  }
  var backend = Pouch.parseAdapter(opts.name || name);

  var cb = function(err, response) {
    if (err) {
      callback(err);
      return;
    }

    for (var plugin in Pouch.plugins) {
      Pouch.plugins[plugin]._delete(backend.name);
    }
    if (Pouch.DEBUG) {
      console.log(backend.name + ': Delete Database');
    }

    // call destroy method of the particular adaptor
    Pouch.adapters[backend.adapter].destroy(backend.name, opts, callback);
  };

  // remove Pouch from allDBs
  Pouch.removeFromAllDbs(backend, cb);
};

Pouch.removeFromAllDbs = function(opts, callback) {
  // Only execute function if flag is enabled
  if (!Pouch.enableAllDbs) {
    callback();
    return;
  }

  // skip http and https adaptors for allDbs
  var adapter = opts.adapter;
  if (adapter === "http" || adapter === "https") {
    callback();
    return;
  }

  // remove db from Pouch.ALL_DBS
  new Pouch(Pouch.allDBName(opts.adapter), function(err, db) {
    if (err) {
      // don't fail when allDbs fail
      console.error(err);
      callback();
      return;
    }
    // check if db has been registered in Pouch.ALL_DBS
    var dbname = Pouch.dbName(opts.adapter, opts.name);
    db.get(dbname, function(err, doc) {
      if (err) {
        callback();
      } else {
        db.remove(doc, function(err, response) {
          if (err) {
            console.error(err);
          }
          callback();
        });
      }
    });
  });

};

Pouch.adapter = function (id, obj) {
  if (obj.valid()) {
    Pouch.adapters[id] = obj;
  }
};

Pouch.plugin = function(id, obj) {
  Pouch.plugins[id] = obj;
};

// flag to toggle allDbs (off by default)
Pouch.enableAllDbs = false;

// name of database used to keep track of databases
Pouch.ALL_DBS = "_allDbs";
Pouch.dbName = function(adapter, name) {
  return [adapter, "-", name].join('');
};
Pouch.realDBName = function(adapter, name) {
  return [adapter, "://", name].join('');
};
Pouch.allDBName = function(adapter) {
  return [adapter, "://", Pouch.prefix + Pouch.ALL_DBS].join('');
};

Pouch.open = function(opts, callback) {
  // Only register pouch with allDbs if flag is enabled
  if (!Pouch.enableAllDbs) {
    callback();
    return;
  }

  var adapter = opts.adapter;
  // skip http and https adaptors for allDbs
  if (adapter === "http" || adapter === "https") {
    callback();
    return;
  }

  new Pouch(Pouch.allDBName(adapter), function(err, db) {
    if (err) {
      // don't fail when allDb registration fails
      console.error(err);
      callback();
      return;
    }

    // check if db has been registered in Pouch.ALL_DBS
    var dbname = Pouch.dbName(adapter, opts.name);
    db.get(dbname, function(err, response) {
      if (err && err.status === 404) {
        db.put({
          _id: dbname,
          dbname: opts.originalName
        }, function(err) {
            if (err) {
                console.error(err);
            }

            callback();
        });
      } else {
        callback();
      }
    });
  });
};

Pouch.allDbs = function(callback) {
  var accumulate = function(adapters, all_dbs) {
    if (adapters.length === 0) {
      // remove duplicates
      var result = [];
      all_dbs.forEach(function(doc) {
        var exists = result.some(function(db) {
          return db.id === doc.id;
        });

        if (!exists) {
          result.push(doc);
        }
      });

      // return an array of dbname
      callback(null, result.map(function(row) {
          return row.doc.dbname;
      }));
      return;
    }

    var adapter = adapters.shift();

    // skip http and https adaptors for allDbs
    if (adapter === "http" || adapter === "https") {
      accumulate(adapters, all_dbs);
      return;
    }

    new Pouch(Pouch.allDBName(adapter), function(err, db) {
      if (err) {
        callback(err);
        return;
      }
      db.allDocs({include_docs: true}, function(err, response) {
        if (err) {
          callback(err);
          return;
        }

        // append from current adapter rows
        all_dbs.unshift.apply(all_dbs, response.rows);

        // code to clear allDbs.
        // response.rows.forEach(function(row) {
        //   db.remove(row.doc, function() {
        //     console.log(arguments);
        //   });
        // });

        // recurse
        accumulate(adapters, all_dbs);
      });
    });
  };
  var adapters = Object.keys(Pouch.adapters);
  accumulate(adapters, []);
};

/*
  Examples:

  >>> Pouch.uuids()
  "92329D39-6F5C-4520-ABFC-AAB64544E172"]

  >>> Pouch.uuids(10, {length: 32, radix: 5})
  [ '04422200002240221333300140323100',
    '02304411022101001312440440020110',
    '41432430322114143303343433433030',
    '21234330022303431304443100330401',
    '23044133434242034101422131301213',
    '43142032223224403322031032232041',
    '41121132424023141101403324200330',
    '00341042023103204342124004122342',
    '01001141433040113422403034004214',
    '30221232324132303123433131020020' ]
 */
Pouch.uuids = function (count, options) {

  if (typeof(options) !== 'object') {
    options = {};
  }

  var length = options.length;
  var radix = options.radix;
  var uuids = [];

  while (uuids.push(PouchUtils.uuid(length, radix)) < count) { }

  return uuids;
};

// Give back one UUID
Pouch.uuid = function (options) {
  return Pouch.uuids(1, options)[0];
};

// Enumerate errors, add the status code so we can reflect the HTTP api
// in future
Pouch.Errors = {
  MISSING_BULK_DOCS: {
    status: 400,
    error: 'bad_request',
    reason: "Missing JSON list of 'docs'"
  },
  MISSING_DOC: {
    status: 404,
    error: 'not_found',
    reason: 'missing'
  },
  REV_CONFLICT: {
    status: 409,
    error: 'conflict',
    reason: 'Document update conflict'
  },
  INVALID_ID: {
    status: 400,
    error: 'invalid_id',
    reason: '_id field must contain a string'
  },
  MISSING_ID: {
    status: 412,
    error: 'missing_id',
    reason: '_id is required for puts'
  },
  RESERVED_ID: {
    status: 400,
    error: 'bad_request',
    reason: 'Only reserved document ids may start with underscore.'
  },
  NOT_OPEN: {
    status: 412,
    error: 'precondition_failed',
    reason: 'Database not open so cannot close'
  },
  UNKNOWN_ERROR: {
    status: 500,
    error: 'unknown_error',
    reason: 'Database encountered an unknown error'
  },
  BAD_ARG: {
    status: 500,
    error: 'badarg',
    reason: 'Some query argument is invalid'
  },
  INVALID_REQUEST: {
    status: 400,
    error: 'invalid_request',
    reason: 'Request was invalid'
  },
  QUERY_PARSE_ERROR: {
    status: 400,
    error: 'query_parse_error',
    reason: 'Some query parameter is invalid'
  },
  DOC_VALIDATION: {
    status: 500,
    error: 'doc_validation',
    reason: 'Bad special document member'
  },
  BAD_REQUEST: {
    status: 400,
    error: 'bad_request',
    reason: 'Something wrong with the request'
  },
  NOT_AN_OBJECT: {
    status: 400,
    error: 'bad_request',
    reason: 'Document must be a JSON object'
  },
  DB_MISSING: {
    status: 404,
    error: 'not_found',
    reason: 'Database not found'
  }
};

Pouch.error = function(error, reason) {
  return PouchUtils.extend({}, error, {reason: reason});
};

if (typeof module !== 'undefined' && module.exports) {
  global.Pouch = Pouch;
  global.PouchDB = Pouch;
  module.exports = Pouch;
  Pouch.replicate = require('./pouch.replicate.js').replicate;
  var PouchAdapter = require('./pouch.adapter.js');
  require('./adapters/pouch.http.js');
  require('./adapters/pouch.idb.js');
  require('./adapters/pouch.websql.js');
  require('./adapters/pouch.leveldb.js');
  require('./plugins/pouchdb.mapreduce.js');
} else {
  window.Pouch = Pouch;
  window.PouchDB = Pouch;
}

'use strict';

var pouchCollate = function(a, b) {
  var ai = collationIndex(a);
  var bi = collationIndex(b);
  if ((ai - bi) !== 0) {
    return ai - bi;
  }
  if (a === null) {
    return 0;
  }
  if (typeof a === 'number') {
    return a - b;
  }
  if (typeof a === 'boolean') {
    return a < b ? -1 : 1;
  }
  if (typeof a === 'string') {
    return stringCollate(a, b);
  }
  if (Array.isArray(a)) {
    return arrayCollate(a, b);
  }
  if (typeof a === 'object') {
    return objectCollate(a, b);
  }
};

var stringCollate = function(a, b) {
  // See: https://github.com/daleharvey/pouchdb/issues/40
  // This is incompatible with the CouchDB implementation, but its the
  // best we can do for now
  return (a === b) ? 0 : ((a > b) ? 1 : -1);
};

var objectCollate = function(a, b) {
  var ak = Object.keys(a), bk = Object.keys(b);
  var len = Math.min(ak.length, bk.length);
  for (var i = 0; i < len; i++) {
    // First sort the keys
    var sort = pouchCollate(ak[i], bk[i]);
    if (sort !== 0) {
      return sort;
    }
    // if the keys are equal sort the values
    sort = pouchCollate(a[ak[i]], b[bk[i]]);
    if (sort !== 0) {
      return sort;
    }

  }
  return (ak.length === bk.length) ? 0 :
    (ak.length > bk.length) ? 1 : -1;
};

var arrayCollate = function(a, b) {
  var len = Math.min(a.length, b.length);
  for (var i = 0; i < len; i++) {
    var sort = pouchCollate(a[i], b[i]);
    if (sort !== 0) {
      return sort;
    }
  }
  return (a.length === b.length) ? 0 :
    (a.length > b.length) ? 1 : -1;
};

// The collation is defined by erlangs ordered terms
// the atoms null, true, false come first, then numbers, strings,
// arrays, then objects
var collationIndex = function(x) {
  var id = ['boolean', 'number', 'string', 'object'];
  if (id.indexOf(typeof x) !== -1) {
    if (x === null) {
      return 1;
    }
    return id.indexOf(typeof x) + 2;
  }
  if (Array.isArray(x)) {
    return 4.5;
  }
};

// a few hacks to get things in the right place for node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = pouchCollate;
}


'use strict';

var extend;
if (typeof module !== 'undefined' && module.exports) {
  extend = require('./deps/extend');
}


// for a better overview of what this is doing, read:
// https://github.com/apache/couchdb/blob/master/src/couchdb/couch_key_tree.erl
//
// But for a quick intro, CouchDB uses a revision tree to store a documents
// history, A -> B -> C, when a document has conflicts, that is a branch in the
// tree, A -> (B1 | B2 -> C), We store these as a nested array in the format
//
// KeyTree = [Path ... ]
// Path = {pos: position_from_root, ids: Tree}
// Tree = [Key, Opts, [Tree, ...]], in particular single node: [Key, []]

// Turn a path as a flat array into a tree with a single branch
function pathToTree(path) {
  var doc = path.shift();
  var root = [doc.id, doc.opts, []];
  var leaf = root;
  var nleaf;

  while (path.length) {
    doc = path.shift();
    nleaf = [doc.id, doc.opts, []];
    leaf[2].push(nleaf);
    leaf = nleaf;
  }
  return root;
}

// Merge two trees together
// The roots of tree1 and tree2 must be the same revision
function mergeTree(in_tree1, in_tree2) {
  var queue = [{tree1: in_tree1, tree2: in_tree2}];
  var conflicts = false;
  while (queue.length > 0) {
    var item = queue.pop();
    var tree1 = item.tree1;
    var tree2 = item.tree2;

    if (tree1[1].status || tree2[1].status) {
      tree1[1].status = (tree1[1].status ===  'available' ||
                         tree2[1].status === 'available') ? 'available' : 'missing';
    }

    for (var i = 0; i < tree2[2].length; i++) {
      if (!tree1[2][0]) {
        conflicts = 'new_leaf';
        tree1[2][0] = tree2[2][i];
        continue;
      }

      var merged = false;
      for (var j = 0; j < tree1[2].length; j++) {
        if (tree1[2][j][0] === tree2[2][i][0]) {
          queue.push({tree1: tree1[2][j], tree2: tree2[2][i]});
          merged = true;
        }
      }
      if (!merged) {
        conflicts = 'new_branch';
        tree1[2].push(tree2[2][i]);
        tree1[2].sort();
      }
    }
  }
  return {conflicts: conflicts, tree: in_tree1};
}

function doMerge(tree, path, dontExpand) {
  var restree = [];
  var conflicts = false;
  var merged = false;
  var res, branch;

  if (!tree.length) {
    return {tree: [path], conflicts: 'new_leaf'};
  }

  tree.forEach(function(branch) {
    if (branch.pos === path.pos && branch.ids[0] === path.ids[0]) {
      // Paths start at the same position and have the same root, so they need
      // merged
      res = mergeTree(branch.ids, path.ids);
      restree.push({pos: branch.pos, ids: res.tree});
      conflicts = conflicts || res.conflicts;
      merged = true;
    } else if (dontExpand !== true) {
      // The paths start at a different position, take the earliest path and
      // traverse up until it as at the same point from root as the path we want to
      // merge.  If the keys match we return the longer path with the other merged
      // After stemming we dont want to expand the trees

      var t1 = branch.pos < path.pos ? branch : path;
      var t2 = branch.pos < path.pos ? path : branch;
      var diff = t2.pos - t1.pos;

      var candidateParents = [];

      var trees = [];
      trees.push({ids: t1.ids, diff: diff, parent: null, parentIdx: null});
      while (trees.length > 0) {
        var item = trees.pop();
        if (item.diff === 0) {
          if (item.ids[0] === t2.ids[0]) {
            candidateParents.push(item);
          }
          continue;
        }
        if (!item.ids) {
          continue;
        }
        /*jshint loopfunc:true */
        item.ids[2].forEach(function(el, idx) {
          trees.push({ids: el, diff: item.diff-1, parent: item.ids, parentIdx: idx});
        });
      }

      var el = candidateParents[0];

      if (!el) {
        restree.push(branch);
      } else {
        res = mergeTree(el.ids, t2.ids);
        el.parent[2][el.parentIdx] = res.tree;
        restree.push({pos: t1.pos, ids: t1.ids});
        conflicts = conflicts || res.conflicts;
        merged = true;
      }
    } else {
      restree.push(branch);
    }
  });

  // We didnt find
  if (!merged) {
    restree.push(path);
  }

  restree.sort(function(a, b) {
    return a.pos - b.pos;
  });

  return {
    tree: restree,
    conflicts: conflicts || 'internal_node'
  };
}

// To ensure we dont grow the revision tree infinitely, we stem old revisions
function stem(tree, depth) {
  // First we break out the tree into a complete list of root to leaf paths,
  // we cut off the start of the path and generate a new set of flat trees
  var stemmedPaths = PouchMerge.rootToLeaf(tree).map(function(path) {
    var stemmed = path.ids.slice(-depth);
    return {
      pos: path.pos + (path.ids.length - stemmed.length),
      ids: pathToTree(stemmed)
    };
  });
  // Then we remerge all those flat trees together, ensuring that we dont
  // connect trees that would go beyond the depth limit
  return stemmedPaths.reduce(function(prev, current, i, arr) {
    return doMerge(prev, current, true).tree;
  }, [stemmedPaths.shift()]);
}

var PouchMerge = {};

PouchMerge.merge = function(tree, path, depth) {
  // Ugh, nicer way to not modify arguments in place?
  tree = extend(true, [], tree);
  path = extend(true, {}, path);
  var newTree = doMerge(tree, path);
  return {
    tree: stem(newTree.tree, depth),
    conflicts: newTree.conflicts
  };
};

// We fetch all leafs of the revision tree, and sort them based on tree length
// and whether they were deleted, undeleted documents with the longest revision
// tree (most edits) win
// The final sort algorithm is slightly documented in a sidebar here:
// http://guide.couchdb.org/draft/conflicts.html
PouchMerge.winningRev = function(metadata) {
  var leafs = [];
  PouchMerge.traverseRevTree(metadata.rev_tree,
                              function(isLeaf, pos, id, something, opts) {
    if (isLeaf) {
      leafs.push({pos: pos, id: id, deleted: !!opts.deleted});
    }
  });
  leafs.sort(function(a, b) {
    if (a.deleted !== b.deleted) {
      return a.deleted > b.deleted ? 1 : -1;
    }
    if (a.pos !== b.pos) {
      return b.pos - a.pos;
    }
    return a.id < b.id ? 1 : -1;
  });

  return leafs[0].pos + '-' + leafs[0].id;
};

// Pretty much all below can be combined into a higher order function to
// traverse revisions
// The return value from the callback will be passed as context to all
// children of that node
PouchMerge.traverseRevTree = function(revs, callback) {
  var toVisit = [];

  revs.forEach(function(tree) {
    toVisit.push({pos: tree.pos, ids: tree.ids});
  });
  while (toVisit.length > 0) {
    var node = toVisit.pop();
    var pos = node.pos;
    var tree = node.ids;
    var newCtx = callback(tree[2].length === 0, pos, tree[0], node.ctx, tree[1]);
    /*jshint loopfunc: true */
    tree[2].forEach(function(branch) {
      toVisit.push({pos: pos+1, ids: branch, ctx: newCtx});
    });
  }
};

PouchMerge.collectLeaves = function(revs) {
  var leaves = [];
  PouchMerge.traverseRevTree(revs, function(isLeaf, pos, id, acc, opts) {
    if (isLeaf) {
      leaves.unshift({rev: pos + "-" + id, pos: pos, opts: opts});
    }
  });
  leaves.sort(function(a, b) {
    return b.pos - a.pos;
  });
  leaves.map(function(leaf) { delete leaf.pos; });
  return leaves;
};

// returns revs of all conflicts that is leaves such that
// 1. are not deleted and
// 2. are different than winning revision
PouchMerge.collectConflicts = function(metadata) {
  var win = PouchMerge.winningRev(metadata);
  var leaves = PouchMerge.collectLeaves(metadata.rev_tree);
  var conflicts = [];
  leaves.forEach(function(leaf) {
    if (leaf.rev !== win && !leaf.opts.deleted) {
      conflicts.push(leaf.rev);
    }
  });
  return conflicts;
};

PouchMerge.rootToLeaf = function(tree) {
  var paths = [];
  PouchMerge.traverseRevTree(tree, function(isLeaf, pos, id, history, opts) {
    history = history ? history.slice(0) : [];
    history.push({id: id, opts: opts});
    if (isLeaf) {
      var rootPos = pos + 1 - history.length;
      paths.unshift({pos: rootPos, ids: history});
    }
    return history;
  });
  return paths;
};

// a few hacks to get things in the right place for node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PouchMerge;
}
/*globals PouchUtils: true */

'use strict';

var PouchUtils;

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Pouch;
  PouchUtils = require('./pouch.utils.js');
}

// We create a basic promise so the caller can cancel the replication possibly
// before we have actually started listening to changes etc
var Promise = function() {
  var that = this;
  this.cancelled = false;
  this.cancel = function() {
    that.cancelled = true;
  };
};

// The RequestManager ensures that only one database request is active at
// at time, it ensures we dont max out simultaneous HTTP requests and makes
// the replication process easier to reason about
var RequestManager = function(promise) {

  var queue = [];
  var api = {};
  var processing = false;

  // Add a new request to the queue, if we arent currently processing anything
  // then process it immediately
  api.enqueue = function(fun, args) {
    queue.push({fun: fun, args: args});
    if (!processing) {
      api.process();
    }
  };

  // Process the next request
  api.process = function() {
    if (processing || !queue.length || promise.cancelled) {
      return;
    }
    processing = true;
    var task = queue.shift();
    task.fun.apply(null, task.args);
  };

  // We need to be notified whenever a request is complete to process
  // the next request
  api.notifyRequestComplete = function() {
    processing = false;
    api.process();
  };

  return api;
};

// TODO: check CouchDB's replication id generation, generate a unique id particular
// to this replication
var genReplicationId = function(src, target, opts) {
  var filterFun = opts.filter ? opts.filter.toString() : '';
  return '_local/' + PouchUtils.Crypto.MD5(src.id() + target.id() + filterFun);
};

// A checkpoint lets us restart replications from when they were last cancelled
var fetchCheckpoint = function(src, target, id, callback) {
  target.get(id, function(err, targetDoc) {
    if (err && err.status === 404) {
      callback(null, 0);
    } else {
      src.get(id, function(err, sourceDoc) {
        if (err && err.status === 404 || targetDoc.last_seq !== sourceDoc.last_seq) {
          callback(null, 0);
        } else {
          callback(null, sourceDoc.last_seq);
        }
      });
    }
  });
};

var writeCheckpoint = function(src, target, id, checkpoint, callback) {
  var updateCheckpoint = function (db, callback) {
    db.get(id, function(err, doc) {
      if (err && err.status === 404) {
          doc = {_id: id};
      }
      doc.last_seq = checkpoint;
      db.put(doc, callback);
    });
  };
  updateCheckpoint(target, function(err, doc) {
    updateCheckpoint(src, function(err, doc) {
      callback();
    });
  });
};

function replicate(src, target, opts, promise) {

  var requests = new RequestManager(promise);
  var writeQueue = [];
  var repId = genReplicationId(src, target, opts);
  var results = [];
  var completed = false;
  var pendingRevs = 0;
  var last_seq = 0;
  var continuous = opts.continuous || false;
  var doc_ids = opts.doc_ids;
  var result = {
    ok: true,
    start_time: new Date(),
    docs_read: 0,
    docs_written: 0
  };

  function docsWritten(err, res, len) {
    if (opts.onChange) {
      for (var i = 0; i < len; i++) {
        /*jshint validthis:true */
        opts.onChange.apply(this, [result]);
      }
    }
    pendingRevs -= len;
    result.docs_written += len;

    writeCheckpoint(src, target, repId, last_seq, function(err, res) {
      requests.notifyRequestComplete();
      isCompleted();
    });
  }

  function writeDocs() {
    if (!writeQueue.length) {
      return requests.notifyRequestComplete();
    }
    var len = writeQueue.length;
    target.bulkDocs({docs: writeQueue}, {new_edits: false}, function(err, res) {
      docsWritten(err, res, len);
    });
    writeQueue = [];
  }

  function eachRev(id, rev) {
    src.get(id, {revs: true, rev: rev, attachments: true}, function(err, doc) {
      result.docs_read++;
      requests.notifyRequestComplete();
      writeQueue.push(doc);
      requests.enqueue(writeDocs);
    });
  }

  function onRevsDiff(diffCounts) {
    return function (err, diffs) {
      requests.notifyRequestComplete();
      if (err) {
        if (continuous) {
          promise.cancel();
        }
        PouchUtils.call(opts.complete, err, null);
        return;
      }

      // We already have all diffs passed in `diffCounts`
      if (Object.keys(diffs).length === 0) {
        for (var docid in diffCounts) {
          pendingRevs -= diffCounts[docid];
        }
        isCompleted();
        return;
      }

      var _enqueuer = function (rev) {
        requests.enqueue(eachRev, [id, rev]);
      };

      for (var id in diffs) {
        var diffsAlreadyHere = diffCounts[id] - diffs[id].missing.length;
        pendingRevs -= diffsAlreadyHere;
        diffs[id].missing.forEach(_enqueuer);
      }
    };
  }

  function fetchRevsDiff(diff, diffCounts) {
    target.revsDiff(diff, onRevsDiff(diffCounts));
  }

  function onChange(change) {
    last_seq = change.seq;
    results.push(change);
    var diff = {};
    diff[change.id] = change.changes.map(function(x) { return x.rev; });
    var counts = {};
    counts[change.id] = change.changes.length;
    pendingRevs += change.changes.length;
    requests.enqueue(fetchRevsDiff, [diff, counts]);
  }

  function complete() {
    completed = true;
    isCompleted();
  }

  function isCompleted() {
    if (completed && pendingRevs === 0) {
      result.end_time = new Date();
      PouchUtils.call(opts.complete, null, result);
    }
  }

  fetchCheckpoint(src, target, repId, function(err, checkpoint) {

    if (err) {
      return PouchUtils.call(opts.complete, err);
    }

    last_seq = checkpoint;

    // Was the replication cancelled by the caller before it had a chance
    // to start. Shouldnt we be calling complete?
    if (promise.cancelled) {
      return;
    }

    var repOpts = {
      continuous: continuous,
      since: last_seq,
      style: 'all_docs',
      onChange: onChange,
      complete: complete,
      doc_ids: doc_ids
    };

    if (opts.filter) {
      repOpts.filter = opts.filter;
    }

    if (opts.query_params) {
      repOpts.query_params = opts.query_params;
    }

    var changes = src.changes(repOpts);

    if (opts.continuous) {
      var cancel = promise.cancel;
      promise.cancel = function() {
        cancel();
        changes.cancel();
      };
    }
  });

}

function toPouch(db, callback) {
  if (typeof db === 'string') {
    return new Pouch(db, callback);
  }
  callback(null, db);
}

Pouch.replicate = function(src, target, opts, callback) {
  if (opts instanceof Function) {
    callback = opts;
    opts = {};
  }
  if (opts === undefined) {
    opts = {};
  }
  if (!opts.complete) {
    opts.complete = callback;
  }
  var replicateRet = new Promise();
  toPouch(src, function(err, src) {
    if (err) {
      return PouchUtils.call(callback, err);
    }
    toPouch(target, function(err, target) {
      if (err) {
        return PouchUtils.call(callback, err);
      }
      if (opts.server) {
        if (typeof src.replicateOnServer !== 'function') {
          return PouchUtils.call(callback, { error: 'Server replication not supported for ' + src.type() + ' adapter' });
        }
        if (src.type() !== target.type()) {
          return PouchUtils.call(callback, { error: 'Server replication for different adapter types (' + src.type() + ' and ' + target.type() + ') is not supported' });
        }
        src.replicateOnServer(target, opts, replicateRet);
      } else {
        replicate(src, target, opts, replicateRet);
      }
    });
  });
  return replicateRet;
};

/*jshint strict: false */
/*global Buffer: true, escape: true, module, window, Crypto */
/*global chrome, extend, ajax, createBlob, btoa, atob, uuid, require, PouchMerge: true */

var PouchUtils = {};

if (typeof module !== 'undefined' && module.exports) {
  PouchMerge = require('./pouch.merge.js');
  PouchUtils.extend = require('./deps/extend');
  PouchUtils.ajax = require('./deps/ajax');
  PouchUtils.createBlob = require('./deps/blob');
  PouchUtils.uuid = require('./deps/uuid');
  PouchUtils.Crypto = require('./deps/md5.js');
} else {
  PouchUtils.Crypto = Crypto;
  PouchUtils.extend = extend;
  PouchUtils.ajax = ajax;
  PouchUtils.createBlob = createBlob;
  PouchUtils.uuid = uuid;
}

// List of top level reserved words for doc
var reservedWords = [
  '_id',
  '_rev',
  '_attachments',
  '_deleted',
  '_revisions',
  '_revs_info',
  '_conflicts',
  '_deleted_conflicts',
  '_local_seq',
  '_rev_tree'
];

// Determine id an ID is valid
//   - invalid IDs begin with an underescore that does not begin '_design' or '_local'
//   - any other string value is a valid id
var isValidId = function(id) {
  if (/^_/.test(id)) {
    return (/^_(design|local)/).test(id);
  }
  return true;
};

var isChromeApp = function(){
  return (typeof chrome !== "undefined" &&
          typeof chrome.storage !== "undefined" &&
          typeof chrome.storage.local !== "undefined");
};

// Pretty dumb name for a function, just wraps callback calls so we dont
// to if (callback) callback() everywhere
PouchUtils.call = function(fun) {
  if (typeof fun === typeof Function) {
    var args = Array.prototype.slice.call(arguments, 1);
    fun.apply(this, args);
  }
};

PouchUtils.isLocalId = function(id) {
  return (/^_local/).test(id);
};

// check if a specific revision of a doc has been deleted
//  - metadata: the metadata object from the doc store
//  - rev: (optional) the revision to check. defaults to winning revision
PouchUtils.isDeleted = function(metadata, rev) {
  if (!rev) {
    rev = PouchMerge.winningRev(metadata);
  }
  if (rev.indexOf('-') >= 0) {
    rev = rev.split('-')[1];
  }
  var deleted = false;
  PouchMerge.traverseRevTree(metadata.rev_tree, function(isLeaf, pos, id, acc, opts) {
    if (id === rev) {
      deleted = !!opts.deleted;
    }
  });

  return deleted;
};

PouchUtils.filterChange = function(opts) {
  return function(change) {
    var req = {};
    var hasFilter = opts.filter && typeof opts.filter === 'function';

    req.query = opts.query_params;
    if (opts.filter && hasFilter && !opts.filter.call(this, change.doc, req)) {
      return false;
    }
    if (opts.doc_ids && opts.doc_ids.indexOf(change.id) === -1) {
      return false;
    }
    if (!opts.include_docs) {
      delete change.doc;
    } else {
      for (var att in change.doc._attachments) {
        change.doc._attachments[att].stub = true;
      }
    }
    return true;
  };
};

PouchUtils.processChanges = function(opts, changes, last_seq) {
  // TODO: we should try to filter and limit as soon as possible
  changes = changes.filter(PouchUtils.filterChange(opts));
  if (opts.limit) {
    if (opts.limit < changes.length) {
      changes.length = opts.limit;
    }
  }
  changes.forEach(function(change){
    PouchUtils.call(opts.onChange, change);
  });
  PouchUtils.call(opts.complete, null, {results: changes, last_seq: last_seq});
};

// Preprocess documents, parse their revisions, assign an id and a
// revision for new writes that are missing them, etc
PouchUtils.parseDoc = function(doc, newEdits) {
  var error = null;
  var nRevNum;
  var newRevId;
  var revInfo;
  var opts = {status: 'available'};
  if (doc._deleted) {
    opts.deleted = true;
  }

  if (newEdits) {
    if (!doc._id) {
      doc._id = Pouch.uuid();
    }
    newRevId = Pouch.uuid({length: 32, radix: 16}).toLowerCase();
    if (doc._rev) {
      revInfo = /^(\d+)-(.+)$/.exec(doc._rev);
      if (!revInfo) {
        throw "invalid value for property '_rev'";
      }
      doc._rev_tree = [{
        pos: parseInt(revInfo[1], 10),
        ids: [revInfo[2], {status: 'missing'}, [[newRevId, opts, []]]]
      }];
      nRevNum = parseInt(revInfo[1], 10) + 1;
    } else {
      doc._rev_tree = [{
        pos: 1,
        ids : [newRevId, opts, []]
      }];
      nRevNum = 1;
    }
  } else {
    if (doc._revisions) {
      doc._rev_tree = [{
        pos: doc._revisions.start - doc._revisions.ids.length + 1,
        ids: doc._revisions.ids.reduce(function(acc, x) {
          if (acc === null) {
            return [x, opts, []];
          } else {
            return [x, {status: 'missing'}, [acc]];
          }
        }, null)
      }];
      nRevNum = doc._revisions.start;
      newRevId = doc._revisions.ids[0];
    }
    if (!doc._rev_tree) {
      revInfo = /^(\d+)-(.+)$/.exec(doc._rev);
      if (!revInfo) {
        return Pouch.Errors.BAD_ARG;
      }
      nRevNum = parseInt(revInfo[1], 10);
      newRevId = revInfo[2];
      doc._rev_tree = [{
        pos: parseInt(revInfo[1], 10),
        ids: [revInfo[2], opts, []]
      }];
    }
  }

  if (typeof doc._id !== 'string') {
    error = Pouch.Errors.INVALID_ID;
  }
  else if (!isValidId(doc._id)) {
    error = Pouch.Errors.RESERVED_ID;
  }

  for (var key in doc) {
    if (doc.hasOwnProperty(key) && key[0] === '_' && reservedWords.indexOf(key) === -1) {
      error = PouchUtils.extend({}, Pouch.Errors.DOC_VALIDATION);
      error.reason += ': ' + key;
    }
  }

  doc._id = decodeURIComponent(doc._id);
  doc._rev = [nRevNum, newRevId].join('-');

  if (error) {
    return error;
  }

  return Object.keys(doc).reduce(function(acc, key) {
    if (/^_/.test(key) && key !== '_attachments') {
      acc.metadata[key.slice(1)] = doc[key];
    } else {
      acc.data[key] = doc[key];
    }
    return acc;
  }, {metadata : {}, data : {}});
};

PouchUtils.isCordova = function(){
  return (typeof cordova !== "undefined" ||
          typeof PhoneGap !== "undefined" ||
          typeof phonegap !== "undefined");
};

PouchUtils.Changes = function() {

  var api = {};
  var listeners = {};

  if (isChromeApp()){
    chrome.storage.onChanged.addListener(function(e){
      // make sure it's event addressed to us
      if (e.db_name != null) {
        api.notify(e.db_name.newValue);//object only has oldValue, newValue members
      }
    });
  } else if (typeof window !== 'undefined') {
    window.addEventListener("storage", function(e) {
      api.notify(e.key);
    });
  }

  api.addListener = function(db_name, id, db, opts) {
    if (!listeners[db_name]) {
      listeners[db_name] = {};
    }
    listeners[db_name][id] = {
      db: db,
      opts: opts
    };
  };

  api.removeListener = function(db_name, id) {
    if (listeners[db_name]) {
      delete listeners[db_name][id];
    }
  };

  api.clearListeners = function(db_name) {
    delete listeners[db_name];
  };

  api.notifyLocalWindows = function(db_name){
    //do a useless change on a storage thing
    //in order to get other windows's listeners to activate
    if (!isChromeApp()){
      localStorage[db_name] = (localStorage[db_name] === "a") ? "b" : "a";
    } else {
      chrome.storage.local.set({db_name: db_name});
    }
  };

  api.notify = function(db_name) {
    if (!listeners[db_name]) { return; }

    Object.keys(listeners[db_name]).forEach(function (i) {
      var opts = listeners[db_name][i].opts;
      listeners[db_name][i].db.changes({
        include_docs: opts.include_docs,
        conflicts: opts.conflicts,
        continuous: false,
        descending: false,
        filter: opts.filter,
        since: opts.since,
        query_params: opts.query_params,
        onChange: function(c) {
          if (c.seq > opts.since && !opts.cancelled) {
            opts.since = c.seq;
            PouchUtils.call(opts.onChange, c);
          }
        }
      });
    });
  };

  return api;
};

if (typeof window === 'undefined' || !('atob' in window)) {
  PouchUtils.atob = function(str) {
    var base64 = new Buffer(str, 'base64');
    // Node.js will just skip the characters it can't encode instead of
    // throwing and exception
    if (base64.toString('base64') !== str) {
      throw("Cannot base64 encode full string");
    }
    return base64.toString('binary');
  };
} else {
  PouchUtils.atob = function(str) {
    return atob(str);
  };
}

if (typeof window === 'undefined' || !('btoa' in window)) {
  PouchUtils.btoa = function(str) {
    return new Buffer(str, 'binary').toString('base64');
  };
} else {
  PouchUtils.btoa = function(str) {
    return btoa(str);
  };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = PouchUtils;
}

/*globals Pouch: true, cordova, PouchUtils: true, PouchMerge */

"use strict";

var PouchAdapter;
var PouchUtils;

if (typeof module !== 'undefined' && module.exports) {
  PouchUtils = require('./pouch.utils.js');
}

var call = PouchUtils.call;

/*
 * A generic pouch adapter
 */

// returns first element of arr satisfying callback predicate
function arrayFirst(arr, callback) {
  for (var i = 0; i < arr.length; i++) {
    if (callback(arr[i], i) === true) {
      return arr[i];
    }
  }
  return false;
}

// Wrapper for functions that call the bulkdocs api with a single doc,
// if the first result is an error, return an error
function yankError(callback) {
  return function(err, results) {
    if (err || results[0].error) {
      call(callback, err || results[0]);
    } else {
      call(callback, null, results[0]);
    }
  };
}

// for every node in a revision tree computes its distance from the closest
// leaf
function computeHeight(revs) {
  var height = {};
  var edges = [];
  PouchMerge.traverseRevTree(revs, function(isLeaf, pos, id, prnt) {
    var rev = pos + "-" + id;
    if (isLeaf) {
      height[rev] = 0;
    }
    if (prnt !== undefined) {
      edges.push({from: prnt, to: rev});
    }
    return rev;
  });

  edges.reverse();
  edges.forEach(function(edge) {
    if (height[edge.from] === undefined) {
      height[edge.from] = 1 + height[edge.to];
    } else {
      height[edge.from] = Math.min(height[edge.from], 1 + height[edge.to]);
    }
  });
  return height;
}

PouchAdapter = function(opts, callback) {

  var api = {};

  var customApi = Pouch.adapters[opts.adapter](opts, function(err, db) {
    if (err) {
      if (callback) {
        callback(err);
      }
      return;
    }

    for (var j in api) {
      if (!db.hasOwnProperty(j)) {
        db[j] = api[j];
      }
    }

    // Don't call Pouch.open for ALL_DBS
    // Pouch.open saves the db's name into ALL_DBS
    if (opts.name === Pouch.prefix + Pouch.ALL_DBS) {
      callback(err, db);
    } else {
      Pouch.open(opts, function(err) {
        callback(err, db);
      });
    }
  });

  var auto_compaction = (opts.auto_compaction === true);

  // wraps a callback with a function that runs compaction after each edit
  var autoCompact = function(callback) {
    if (!auto_compaction) {
      return callback;
    }
    return function(err, res) {
      if (err) {
        call(callback, err);
      } else {
        var count = res.length;
        var decCount = function() {
          count--;
          if (!count) {
            call(callback, null, res);
          }
        };
        res.forEach(function(doc) {
          if (doc.ok) {
            // TODO: we need better error handling
            compactDocument(doc.id, 1, decCount);
          } else {
            decCount();
          }
        });
      }
    };
  };

  api.post = function (doc, opts, callback) {
    if (typeof opts === 'function') {
      callback = opts;
      opts = {};
    }
    if (typeof doc !== 'object' || Array.isArray(doc)) {
      return call(callback, Pouch.Errors.NOT_AN_OBJECT);
    }
    return customApi.bulkDocs({docs: [doc]}, opts,
        autoCompact(yankError(callback)));
  };

  api.put = function(doc, opts, callback) {
    if (typeof opts === 'function') {
      callback = opts;
      opts = {};
    }
    if (typeof doc !== 'object') {
      return call(callback, Pouch.Errors.NOT_AN_OBJECT);
    }
    if (!('_id' in doc)) {
      return call(callback, Pouch.Errors.MISSING_ID);
    }
    return customApi.bulkDocs({docs: [doc]}, opts,
        autoCompact(yankError(callback)));
  };

  api.putAttachment = function (docId, attachmentId, rev, blob, type, callback) {
    if (!api.taskqueue.ready()) {
      api.taskqueue.addTask('putAttachment', arguments);
      return;
    }
    if (typeof type === 'function') {
      callback = type;
      type = blob;
      blob = rev;
      rev = null;
    }
    if (typeof type === 'undefined') {
      type = blob;
      blob = rev;
      rev = null;
    }

    function createAttachment(doc) {
      doc._attachments = doc._attachments || {};
      doc._attachments[attachmentId] = {
        content_type: type,
        data: blob
      };
      api.put(doc, callback);
    }

    api.get(docId, function(err, doc) {
      // create new doc
      if (err && err.error === Pouch.Errors.MISSING_DOC.error) {
        createAttachment({_id: docId});
        return;
      }
      if (err) {
        call(callback, err);
        return;
      }

      if (doc._rev !== rev) {
        call(callback, Pouch.Errors.REV_CONFLICT);
        return;
      }

      createAttachment(doc);
    });
  };

  api.removeAttachment = function (docId, attachmentId, rev, callback) {
    api.get(docId, function(err, obj) {
      if (err) {
        call(callback, err);
        return;
      }
      if (obj._rev !== rev) {
        call(callback, Pouch.Errors.REV_CONFLICT);
        return;
      }
      if (!obj._attachments) {
        return call(callback, null);
      }
      delete obj._attachments[attachmentId];
      if (Object.keys(obj._attachments).length === 0){
        delete obj._attachments;
      }
      api.put(obj, callback);
    });
  };

  api.remove = function (doc, opts, callback) {
    if (typeof opts === 'function') {
      callback = opts;
      opts = {};
    }
    if (opts === undefined) {
      opts = {};
    }
    opts.was_delete = true;
    var newDoc = {_id: doc._id, _rev: doc._rev};
    newDoc._deleted = true;
    return customApi.bulkDocs({docs: [newDoc]}, opts, yankError(callback));
  };

  api.revsDiff = function (req, opts, callback) {
    if (typeof opts === 'function') {
      callback = opts;
      opts = {};
    }
    var ids = Object.keys(req);
    var count = 0;
    var missing = {};

    function addToMissing(id, revId) {
      if (!missing[id]) {
        missing[id] = {missing: []};
      }
      missing[id].missing.push(revId);
    }

    function processDoc(id, rev_tree) {
      // Is this fast enough? Maybe we should switch to a set simulated by a map
      var missingForId = req[id].slice(0);
      PouchMerge.traverseRevTree(rev_tree, function(isLeaf, pos, revHash, ctx,
        opts) {
          var rev = pos + '-' + revHash;
          var idx = missingForId.indexOf(rev);
          if (idx === -1) {
            return;
          }

          missingForId.splice(idx, 1);
          if (opts.status !== 'available') {
            addToMissing(id, rev);
          }
      });

      // Traversing the tree is synchronous, so now `missingForId` contains
      // revisions that were not found in the tree
      missingForId.forEach(function(rev) {
        addToMissing(id, rev);
      });
    }

    ids.map(function(id) {
      customApi._getRevisionTree(id, function(err, rev_tree) {
        if (err && err.error === 'not_found' && err.reason === 'missing') {
          missing[id] = {missing: req[id]};
        } else if (err) {
          return call(callback, err);
        } else {
          processDoc(id, rev_tree);
        }

        if (++count === ids.length) {
          return call(callback, null, missing);
        }
      });
    });
  };

  // compact one document and fire callback
  // by compacting we mean removing all revisions which
  // are further from the leaf in revision tree than max_height
  var compactDocument = function(docId, max_height, callback) {
    customApi._getRevisionTree(docId, function(err, rev_tree){
      if (err) {
        return call(callback);
      }
      var height = computeHeight(rev_tree);
      var candidates = [];
      var revs = [];
      Object.keys(height).forEach(function(rev) {
        if (height[rev] > max_height) {
          candidates.push(rev);
        }
      });

      PouchMerge.traverseRevTree(rev_tree, function(isLeaf, pos, revHash, ctx, opts) {
        var rev = pos + '-' + revHash;
        if (opts.status === 'available' && candidates.indexOf(rev) !== -1) {
          opts.status = 'missing';
          revs.push(rev);
        }
      });
      customApi._doCompaction(docId, rev_tree, revs, callback);
    });
  };

  // compact the whole database using single document
  // compaction
  api.compact = function(opts, callback) {
    if (typeof opts === 'function') {
      callback = opts;
      opts = {};
    }
    api.changes({complete: function(err, res) {
      if (err) {
        call(callback); // TODO: silently fail
        return;
      }
      var count = res.results.length;
      if (!count) {
        call(callback);
        return;
      }
      res.results.forEach(function(row) {
        compactDocument(row.id, 0, function() {
          count--;
          if (!count) {
            call(callback);
          }
        });
      });
    }});
  };

  /* Begin api wrappers. Specific functionality to storage belongs in the _[method] */
  api.get = function (id, opts, callback) {
    if (!api.taskqueue.ready()) {
      api.taskqueue.addTask('get', arguments);
      return;
    }
    if (typeof opts === 'function') {
      callback = opts;
      opts = {};
    }

    var leaves = [];
    function finishOpenRevs() {
      var result = [];
      var count = leaves.length;
      if (!count) {
        return call(callback, null, result);
      }
      // order with open_revs is unspecified
      leaves.forEach(function(leaf){
        api.get(id, {rev: leaf, revs: opts.revs}, function(err, doc){
          if (!err) {
            result.push({ok: doc});
          } else {
            result.push({missing: leaf});
          }
          count--;
          if(!count) {
            call(callback, null, result);
          }
        });
      });
    }

    if (opts.open_revs) {
      if (opts.open_revs === "all") {
        customApi._getRevisionTree(id, function(err, rev_tree){
          if (err) {
            // if there's no such document we should treat this
            // situation the same way as if revision tree was empty
            rev_tree = [];
          }
          leaves = PouchMerge.collectLeaves(rev_tree).map(function(leaf){
            return leaf.rev;
          });
          finishOpenRevs();
        });
      } else {
        if (Array.isArray(opts.open_revs)) {
          leaves = opts.open_revs;
          for (var i = 0; i < leaves.length; i++) {
            var l = leaves[i];
            // looks like it's the only thing couchdb checks
            if (!(typeof(l) === "string" && /^\d+-/.test(l))) {
              return call(callback, Pouch.error(Pouch.Errors.BAD_REQUEST,
                "Invalid rev format" ));
            }
          }
          finishOpenRevs();
        } else {
          return call(callback, Pouch.error(Pouch.Errors.UNKNOWN_ERROR,
            'function_clause'));
        }
      }
      return; // open_revs does not like other options
    }

    return customApi._get(id, opts, function(err, result) {
      if (err) {
        return call(callback, err);
      }

      var doc = result.doc;
      var metadata = result.metadata;
      var ctx = result.ctx;

      if (opts.conflicts) {
        var conflicts = PouchMerge.collectConflicts(metadata);
        if (conflicts.length) {
          doc._conflicts = conflicts;
        }
      }

      if (opts.revs || opts.revs_info) {
        var paths = PouchMerge.rootToLeaf(metadata.rev_tree);
        var path = arrayFirst(paths, function(arr) {
          return arr.ids.map(function(x) { return x.id; })
            .indexOf(doc._rev.split('-')[1]) !== -1;
        });

        path.ids.splice(path.ids.map(function(x) {return x.id;})
                        .indexOf(doc._rev.split('-')[1]) + 1);
        path.ids.reverse();

        if (opts.revs) {
          doc._revisions = {
            start: (path.pos + path.ids.length) - 1,
            ids: path.ids.map(function(rev) {
              return rev.id;
            })
          };
        }
        if (opts.revs_info) {
          var pos =  path.pos + path.ids.length;
          doc._revs_info = path.ids.map(function(rev) {
            pos--;
            return {
              rev: pos + '-' + rev.id,
              status: rev.opts.status
            };
          });
        }
      }

      if (opts.local_seq) {
        doc._local_seq = result.metadata.seq;
      }

      if (opts.attachments && doc._attachments) {
        var attachments = doc._attachments;
        var count = Object.keys(attachments).length;
        if (count === 0) {
          return call(callback, null, doc);
        }
        Object.keys(attachments).forEach(function(key) {
          customApi._getAttachment(attachments[key], {encode: true, ctx: ctx}, function(err, data) {
            doc._attachments[key].data = data;
            if (!--count){
              call(callback, null, doc);
            }
          });
        });
      } else {
        if (doc._attachments){
          for (var key in doc._attachments) {
            doc._attachments[key].stub = true;
          }
        }
        call(callback, null, doc);
      }
    });
  };

  api.getAttachment = function(docId, attachmentId, opts, callback) {
    if (!api.taskqueue.ready()) {
      api.taskqueue.addTask('getAttachment', arguments);
      return;
    }
    if (opts instanceof Function) {
      callback = opts;
      opts = {};
    }
    customApi._get(docId, opts, function(err, res) {
      if (err) {
        return call(callback, err);
      }
      if (res.doc._attachments && res.doc._attachments[attachmentId]) {
        opts.ctx = res.ctx;
        customApi._getAttachment(res.doc._attachments[attachmentId], opts, callback);
      } else {
        return call(callback, Pouch.Errors.MISSING_DOC);
      }
    });
  };

  api.allDocs = function(opts, callback) {
    if (!api.taskqueue.ready()) {
      api.taskqueue.addTask('allDocs', arguments);
      return;
    }
    if (typeof opts === 'function') {
      callback = opts;
      opts = {};
    }
    if ('keys' in opts) {
      if ('startkey' in opts) {
        call(callback, Pouch.error(Pouch.Errors.QUERY_PARSE_ERROR,
          'Query parameter `start_key` is not compatible with multi-get'
        ));
        return;
      }
      if ('endkey' in opts) {
        call(callback, Pouch.error(Pouch.Errors.QUERY_PARSE_ERROR,
          'Query parameter `end_key` is not compatible with multi-get'
        ));
        return;
      }
    }
    if (typeof opts.skip === 'undefined') {
      opts.skip = 0;
    }

    return customApi._allDocs(opts, callback);
  };

  api.changes = function(opts) {
    if (!api.taskqueue.ready()) {
      var task = api.taskqueue.addTask('changes', arguments);
      return {
        cancel: function() {
          if (task.task) {
            return task.task.cancel();
          }
          if (Pouch.DEBUG) {
            console.log('Cancel Changes Feed');
          }
          task.parameters[0].aborted = true;
        }
      };
    }
    opts = PouchUtils.extend(true, {}, opts);

    if (!opts.since) {
      opts.since = 0;
    }
    if (opts.since === 'latest') {
      var changes;
      api.info(function (err, info) {
        if (!opts.aborted) {
          opts.since = info.update_seq  - 1;
          api.changes(opts);
        }
      });
      // Return a method to cancel this method from processing any more
      return {
        cancel: function() {
          if (changes) {
            return changes.cancel();
          }
          if (Pouch.DEBUG) {
            console.log('Cancel Changes Feed');
          }
          opts.aborted = true;
        }
      };
    }

    if (!('descending' in opts)) {
      opts.descending = false;
    }

    // 0 and 1 should return 1 document
    opts.limit = opts.limit === 0 ? 1 : opts.limit;
    return customApi._changes(opts);
  };

  api.close = function(callback) {
    if (!api.taskqueue.ready()) {
      api.taskqueue.addTask('close', arguments);
      return;
    }
    return customApi._close(callback);
  };

  api.info = function(callback) {
    if (!api.taskqueue.ready()) {
      api.taskqueue.addTask('info', arguments);
      return;
    }
    return customApi._info(callback);
  };

  api.id = function() {
    return customApi._id();
  };

  api.type = function() {
    return (typeof customApi._type === 'function') ? customApi._type() : opts.adapter;
  };

  api.bulkDocs = function(req, opts, callback) {
    if (!api.taskqueue.ready()) {
      api.taskqueue.addTask('bulkDocs', arguments);
      return;
    }
    if (typeof opts === 'function') {
      callback = opts;
      opts = {};
    }
    if (!opts) {
      opts = {};
    } else {
      opts = PouchUtils.extend(true, {}, opts);
    }

    if (!req || !req.docs || req.docs.length < 1) {
      return call(callback, Pouch.Errors.MISSING_BULK_DOCS);
    }

    if (!Array.isArray(req.docs)) {
      return call(callback, Pouch.Errors.QUERY_PARSE_ERROR);
    }

    for (var i = 0; i < req.docs.length; ++i) {
      if (typeof req.docs[i] !== 'object' || Array.isArray(req.docs[i])) {
        return call(callback, Pouch.Errors.NOT_AN_OBJECT);
      }
    }

    req = PouchUtils.extend(true, {}, req);
    if (!('new_edits' in opts)) {
      opts.new_edits = true;
    }

    return customApi._bulkDocs(req, opts, autoCompact(callback));
  };

  /* End Wrappers */
  var taskqueue = {};

  taskqueue.ready = false;
  taskqueue.queue = [];

  api.taskqueue = {};

  api.taskqueue.execute = function (db) {
    if (taskqueue.ready) {
      taskqueue.queue.forEach(function(d) {
        d.task = db[d.name].apply(null, d.parameters);
      });
    }
  };

  api.taskqueue.ready = function() {
    if (arguments.length === 0) {
      return taskqueue.ready;
    }
    taskqueue.ready = arguments[0];
  };

  api.taskqueue.addTask = function(name, parameters) {
    var task = { name: name, parameters: parameters };
    taskqueue.queue.push(task);
    return task;
  };

  api.replicate = {};

  api.replicate.from = function (url, opts, callback) {
    if (typeof opts === 'function') {
      callback = opts;
      opts = {};
    }
    return Pouch.replicate(url, customApi, opts, callback);
  };

  api.replicate.to = function (dbName, opts, callback) {
    if (typeof opts === 'function') {
      callback = opts;
      opts = {};
    }
    return Pouch.replicate(customApi, dbName, opts, callback);
  };

  for (var j in api) {
    if (!customApi.hasOwnProperty(j)) {
      customApi[j] = api[j];
    }
  }

  // Http adapter can skip setup so we force the db to be ready and execute any jobs
  if (opts.skipSetup) {
    api.taskqueue.ready(true);
    api.taskqueue.execute(api);
  }

  if (PouchUtils.isCordova()) {
    //to inform websql adapter that we can use api
    cordova.fireWindowEvent(opts.name + "_pouch", {});
  }
  return customApi;
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = PouchAdapter;
}

/*globals Pouch: true, PouchUtils: true, require, console */

"use strict";

var PouchUtils;

if (typeof module !== 'undefined' && module.exports) {
  Pouch = require('../pouch.js');
  PouchUtils = require('../pouch.utils.js');
}



var HTTP_TIMEOUT = 10000;

// parseUri 1.2.2
// (c) Steven Levithan <stevenlevithan.com>
// MIT License
function parseUri (str) {
  var o = parseUri.options;
  var m = o.parser[o.strictMode ? "strict" : "loose"].exec(str);
  var uri = {};
  var i = 14;

  while (i--) {
    uri[o.key[i]] = m[i] || "";
  }

  uri[o.q.name] = {};
  uri[o.key[12]].replace(o.q.parser, function ($0, $1, $2) {
    if ($1) {
      uri[o.q.name][$1] = $2;
    }
  });

  return uri;
}

function encodeDocId(id) {
  if (/^_design/.test(id)) {
    return id;
  }
  return encodeURIComponent(id);
}

parseUri.options = {
  strictMode: false,
  key: ["source","protocol","authority","userInfo","user","password","host",
        "port","relative","path","directory","file","query","anchor"],
  q:   {
    name:   "queryKey",
    parser: /(?:^|&)([^&=]*)=?([^&]*)/g
  },
  parser: {
    strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
    loose:  /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
  }
};

// Get all the information you possibly can about the URI given by name and
// return it as a suitable object.
function getHost(name, opts) {
  // If the given name contains "http:"
  if (/http(s?):/.test(name)) {
    // Prase the URI into all its little bits
    var uri = parseUri(name);

    // Store the fact that it is a remote URI
    uri.remote = true;

    // Store the user and password as a separate auth object
    if (uri.user || uri.password) {
      uri.auth = {username: uri.user, password: uri.password};
    }

    // Split the path part of the URI into parts using '/' as the delimiter
    // after removing any leading '/' and any trailing '/'
    var parts = uri.path.replace(/(^\/|\/$)/g, '').split('/');

    // Store the first part as the database name and remove it from the parts
    // array
    uri.db = parts.pop();

    // Restore the path by joining all the remaining parts (all the parts
    // except for the database name) with '/'s
    uri.path = parts.join('/');
    opts = opts || {};
    uri.headers = opts.headers || {};
    
    if (opts.auth || uri.auth) { 
      var nAuth = opts.auth || uri.auth;
      var token = PouchUtils.btoa(nAuth.username + ':' + nAuth.password);
      uri.headers.Authorization = 'Basic ' + token; 
    }

    if (opts.headers) {
      uri.headers = opts.headers;
    }

    return uri;
  }

  // If the given name does not contain 'http:' then return a very basic object
  // with no host, the current path, the given name as the database name and no
  // username/password
  return {host: '', path: '/', db: name, auth: false};
}

// Generate a URL with the host data given by opts and the given path
function genDBUrl(opts, path) {
  // If the host is remote
  if (opts.remote) {
    // If the host already has a path, then we need to have a path delimiter
    // Otherwise, the path delimiter is the empty string
    var pathDel = !opts.path ? '' : '/';

    // Return the URL made up of all the host's information and the given path
    return opts.protocol + '://' + opts.host + ':' + opts.port + '/' +
      opts.path + pathDel + opts.db + '/' + path;
  }

  // If the host is not remote, then return the URL made up of just the
  // database name and the given path
  return '/' + opts.db + '/' + path;
}

// Generate a URL with the host data given by opts and the given path
function genUrl(opts, path) {
  if (opts.remote) {
    // If the host already has a path, then we need to have a path delimiter
    // Otherwise, the path delimiter is the empty string
    var pathDel = !opts.path ? '' : '/';

    // If the host already has a path, then we need to have a path delimiter
    // Otherwise, the path delimiter is the empty string
    return opts.protocol + '://' + opts.host + ':' + opts.port + '/' + opts.path + pathDel + path;
  }

  return '/' + path;
}

// Implements the PouchDB API for dealing with CouchDB instances over HTTP
function HttpPouch(opts, callback) {

  // Parse the URI given by opts.name into an easy-to-use object
  var host = getHost(opts.name, opts);

  // Generate the database URL based on the host
  var db_url = genDBUrl(host, '');

  // The functions that will be publically available for HttpPouch
  var api = {};
  var ajaxOpts = opts.ajax || {};
  function ajax(options, callback) {
    return PouchUtils.ajax(PouchUtils.extend({}, ajaxOpts, options), callback);
  }
  var uuids = {
    list: [],
    get: function(opts, callback) {
      if (typeof opts === 'function') {
        callback = opts;
        opts = {count: 10};
      }
      var cb = function(err, body) {
        if (err || !('uuids' in body)) {
          PouchUtils.call(callback, err || Pouch.Errors.UNKNOWN_ERROR);
        } else {
          uuids.list = uuids.list.concat(body.uuids);
          PouchUtils.call(callback, null, "OK");
        }
      };
      var params = '?count=' + opts.count;
      ajax({
        headers: host.headers,
        method: 'GET',
        url: genUrl(host, '_uuids') + params
      }, cb);
    }
  };

  // Create a new CouchDB database based on the given opts
  var createDB = function(){
    ajax({headers: host.headers, method: 'PUT', url: db_url}, function(err, ret) {
      // If we get an "Unauthorized" error
      if (err && err.status === 401) {
        // Test if the database already exists
        ajax({headers: host.headers, method: 'HEAD', url: db_url}, function (err, ret) {
          // If there is still an error
          if (err) {
            // Give the error to the callback to deal with
            PouchUtils.call(callback, err);
          } else {
            // Continue as if there had been no errors
            PouchUtils.call(callback, null, api);
          }
        });
        // If there were no errros or if the only error is "Precondition Failed"
        // (note: "Precondition Failed" occurs when we try to create a database
        // that already exists)
      } else if (!err || err.status === 412) {
        // Continue as if there had been no errors
        PouchUtils.call(callback, null, api);
      } else {
        PouchUtils.call(callback, Pouch.Errors.UNKNOWN_ERROR);
      }
    });
  };
  if (!opts.skipSetup) {
    ajax({headers: host.headers, method: 'GET', url: db_url}, function(err, ret) {
      //check if the db exists
      if (err) {
        if (err.status === 404) {
          //if it doesn't, create it
          createDB();
        } else {
          PouchUtils.call(callback, err);
        }
      } else {
        //go do stuff with the db
        PouchUtils.call(callback, null, api);
      }
    });
  }

  api.type = function() {
    return 'http';
  };

  // The HttpPouch's ID is its URL
  api.id = function() {
    return genDBUrl(host, '');
  };

  api.request = function(options, callback) {
    if (!api.taskqueue.ready()) {
      api.taskqueue.addTask('request', arguments);
      return;
    }
    options.headers = host.headers;
    options.url = genDBUrl(host, options.url);
    ajax(options, callback);
  };

  // Sends a POST request to the host calling the couchdb _compact function
  //    version: The version of CouchDB it is running
  api.compact = function(opts, callback) {
    if (!api.taskqueue.ready()) {
      api.taskqueue.addTask('compact', arguments);
      return;
    }
    if (typeof opts === 'function') {
      callback = opts;
      opts = {};
    }
    ajax({
      headers: host.headers,
      url: genDBUrl(host, '_compact'),
      method: 'POST'
    }, function() {
      function ping() {
        api.info(function(err, res) {
          if (!res.compact_running) {
            PouchUtils.call(callback, null);
          } else {
            setTimeout(ping, opts.interval || 200);
          }
        });
      }
      // Ping the http if it's finished compaction
      if (typeof callback === "function") {
        ping();
      }
    });
  };

  // Calls GET on the host, which gets back a JSON string containing
  //    couchdb: A welcome string
  //    version: The version of CouchDB it is running
  api.info = function(callback) {
    if (!api.taskqueue.ready()) {
      api.taskqueue.addTask('info', arguments);
      return;
    }
    ajax({
      headers: host.headers,
      method:'GET',
      url: genDBUrl(host, '')
    }, callback);
  };

  // Get the document with the given id from the database given by host.
  // The id could be solely the _id in the database, or it may be a
  // _design/ID or _local/ID path
  api.get = function(id, opts, callback) {
    if (!api.taskqueue.ready()) {
      api.taskqueue.addTask('get', arguments);
      return;
    }
    // If no options were given, set the callback to the second parameter
    if (typeof opts === 'function') {
      callback = opts;
      opts = {};
    }

    if (opts.auto_encode === undefined) {
      opts.auto_encode = true;
    }

    // List of parameters to add to the GET request
    var params = [];

    // If it exists, add the opts.revs value to the list of parameters.
    // If revs=true then the resulting JSON will include a field
    // _revisions containing an array of the revision IDs.
    if (opts.revs) {
      params.push('revs=true');
    }

    // If it exists, add the opts.revs_info value to the list of parameters.
    // If revs_info=true then the resulting JSON will include the field
    // _revs_info containing an array of objects in which each object
    // representing an available revision.
    if (opts.revs_info) {
      params.push('revs_info=true');
    }

    if (opts.local_seq) {
      params.push('local_seq=true');
    }
    // If it exists, add the opts.open_revs value to the list of parameters.
    // If open_revs=all then the resulting JSON will include all the leaf
    // revisions. If open_revs=["rev1", "rev2",...] then the resulting JSON
    // will contain an array of objects containing data of all revisions
    if (opts.open_revs) {
      if (opts.open_revs !== "all") {
        opts.open_revs = JSON.stringify(opts.open_revs);
      }
      params.push('open_revs=' + opts.open_revs);
    }

    // If it exists, add the opts.attachments value to the list of parameters.
    // If attachments=true the resulting JSON will include the base64-encoded
    // contents in the "data" property of each attachment.
    if (opts.attachments) {
      params.push('attachments=true');
    }

    // If it exists, add the opts.rev value to the list of parameters.
    // If rev is given a revision number then get the specified revision.
    if (opts.rev) {
      params.push('rev=' + opts.rev);
    }

    // If it exists, add the opts.conflicts value to the list of parameters.
    // If conflicts=true then the resulting JSON will include the field
    // _conflicts containing all the conflicting revisions.
    if (opts.conflicts) {
      params.push('conflicts=' + opts.conflicts);
    }

    // Format the list of parameters into a valid URI query string
    params = params.join('&');
    params = params === '' ? '' : '?' + params;

    if (opts.auto_encode) {
      id = encodeDocId(id);
    }

    // Set the options for the ajax call
    var options = {
      headers: host.headers,
      method: 'GET',
      url: genDBUrl(host, id + params)
    };

    // If the given id contains at least one '/' and the part before the '/'
    // is NOT "_design" and is NOT "_local"
    // OR
    // If the given id contains at least two '/' and the part before the first
    // '/' is "_design".
    // TODO This second condition seems strange since if parts[0] === '_design'
    // then we already know that parts[0] !== '_local'.
    var parts = id.split('/');
    if ((parts.length > 1 && parts[0] !== '_design' && parts[0] !== '_local') ||
        (parts.length > 2 && parts[0] === '_design' && parts[0] !== '_local')) {
      // Binary is expected back from the server
      options.binary = true;
    }

    // Get the document
    ajax(options, function(err, doc, xhr) {
      // If the document does not exist, send an error to the callback
      if (err) {
        return PouchUtils.call(callback, err);
      }

      // Send the document to the callback
      PouchUtils.call(callback, null, doc, xhr);
    });
  };

  // Delete the document given by doc from the database given by host.
  api.remove = function(doc, opts, callback) {
    if (!api.taskqueue.ready()) {
      api.taskqueue.addTask('remove', arguments);
      return;
    }
    // If no options were given, set the callback to be the second parameter
    if (typeof opts === 'function') {
      callback = opts;
      opts = {};
    }

    // Delete the document
    ajax({
      headers: host.headers,
      method:'DELETE',
      url: genDBUrl(host, encodeDocId(doc._id)) + '?rev=' + doc._rev
    }, callback);
  };

  // Get the attachment
  api.getAttachment = function(docId, attachmentId, opts, callback) {
    if (typeof opts === 'function') {
      callback = opts;
      opts = {};
    }
    if (opts.auto_encode === undefined) {
      opts.auto_encode = true;
    }
    if (opts.auto_encode) {
      docId = encodeDocId(docId);
    }
    opts.auto_encode = false;
    api.get(docId + '/' + attachmentId, opts, callback);
  };

  // Remove the attachment given by the id and rev
  api.removeAttachment = function(docId, attachmentId, rev, callback) {
    if (!api.taskqueue.ready()) {
      api.taskqueue.addTask('removeAttachment', arguments);
      return;
    }
    ajax({
      headers: host.headers,
      method: 'DELETE',
      url: genDBUrl(host, encodeDocId(docId) + '/' + attachmentId) + '?rev=' + rev
    }, callback);
  };

  // Add the attachment given by blob and its contentType property
  // to the document with the given id, the revision given by rev, and
  // add it to the database given by host.
  api.putAttachment = function(docId, attachmentId, rev, blob, type, callback) {
    if (!api.taskqueue.ready()) {
      api.taskqueue.addTask('putAttachment', arguments);
      return;
    }
    if (typeof type === 'function') {
      callback = type;
      type = blob;
      blob = rev;
      rev = null;
    }
    if (typeof type === 'undefined') {
      type = blob;
      blob = rev;
      rev = null;
    }
    var id = encodeDocId(docId) + '/' + attachmentId;
    var url = genDBUrl(host, id);
    if (rev) {
      url += '?rev=' + rev;
    }

    var opts = {
      headers: host.headers,
      method:'PUT',
      url: url,
      processData: false,
      body: blob,
      timeout: 60000
    };
    opts.headers['Content-Type'] = type;
    // Add the attachment
    ajax(opts, callback);
  };

  // Add the document given by doc (in JSON string format) to the database
  // given by host. This fails if the doc has no _id field.
  api.put = function(doc, opts, callback) {
    if (!api.taskqueue.ready()) {
      api.taskqueue.addTask('put', arguments);
      return;
    }
    // If no options were given, set the callback to be the second parameter
    if (typeof opts === 'function') {
      callback = opts;
      opts = {};
    }
    if (typeof doc !== 'object') {
      return PouchUtils.call(callback, Pouch.Errors.NOT_AN_OBJECT);
    }
    if (!('_id' in doc)) {
      return PouchUtils.call(callback, Pouch.Errors.MISSING_ID);
    }

    // List of parameter to add to the PUT request
    var params = [];

    // If it exists, add the opts.new_edits value to the list of parameters.
    // If new_edits = false then the database will NOT assign this document a
    // new revision number
    if (opts && typeof opts.new_edits !== 'undefined') {
      params.push('new_edits=' + opts.new_edits);
    }

    // Format the list of parameters into a valid URI query string
    params = params.join('&');
    if (params !== '') {
      params = '?' + params;
    }

    // Add the document
    ajax({
      headers: host.headers,
      method: 'PUT',
      url: genDBUrl(host, encodeDocId(doc._id)) + params,
      body: doc
    }, callback);
  };

  // Add the document given by doc (in JSON string format) to the database
  // given by host. This does not assume that doc is a new document (i.e. does not
  // have a _id or a _rev field.
  api.post = function(doc, opts, callback) {
    if (!api.taskqueue.ready()) {
      api.taskqueue.addTask('post', arguments);
      return;
    }
    // If no options were given, set the callback to be the second parameter
    if (typeof opts === 'function') {
      callback = opts;
      opts = {};
    }
    if (typeof doc !== 'object') {
      return PouchUtils.call(callback, Pouch.Errors.NOT_AN_OBJECT);
    }
    if (! ("_id" in doc)) {
      if (uuids.list.length > 0) {
        doc._id = uuids.list.pop();
        api.put(doc, opts, callback);
      }else {
        uuids.get(function(err, resp) {
          if (err) {
            return PouchUtils.call(callback, Pouch.Errors.UNKNOWN_ERROR);
          }
          doc._id = uuids.list.pop();
          api.put(doc, opts, callback);
        });
      }
    } else {
      api.put(doc, opts, callback);
    }
  };

  // Update/create multiple documents given by req in the database
  // given by host.
  api.bulkDocs = function(req, opts, callback) {
    if (!api.taskqueue.ready()) {
      api.taskqueue.addTask('bulkDocs', arguments);
      return;
    }
    // If no options were given, set the callback to be the second parameter
    if (typeof opts === 'function') {
      callback = opts;
      opts = {};
    }
    if (!opts) {
      opts = {};
    }

    // If opts.new_edits exists add it to the document data to be
    // send to the database.
    // If new_edits=false then it prevents the database from creating
    // new revision numbers for the documents. Instead it just uses
    // the old ones. This is used in database replication.
    if (typeof opts.new_edits !== 'undefined') {
      req.new_edits = opts.new_edits;
    }

    // Update/create the documents
    ajax({
      headers: host.headers,
      method:'POST',
      url: genDBUrl(host, '_bulk_docs'),
      body: req
    }, callback);
  };

  // Get a listing of the documents in the database given
  // by host and ordered by increasing id.
  api.allDocs = function(opts, callback) {
    // If no options were given, set the callback to be the second parameter
    if (!api.taskqueue.ready()) {
      api.taskqueue.addTask('allDocs', arguments);
      return;
    }
    if (typeof opts === 'function') {
      callback = opts;
      opts = {};
    }

    // List of parameters to add to the GET request
    var params = [];
    var body;
    var method = 'GET';

    // TODO I don't see conflicts as a valid parameter for a
    // _all_docs request (see http://wiki.apache.org/couchdb/HTTP_Document_API#all_docs)
    if (opts.conflicts) {
      params.push('conflicts=true');
    }

    // If opts.descending is truthy add it to params
    if (opts.descending) {
      params.push('descending=true');
    }

    // If opts.include_docs exists, add the include_docs value to the
    // list of parameters.
    // If include_docs=true then include the associated document with each
    // result.
    if (opts.include_docs) {
      params.push('include_docs=true');
    }

    // If opts.startkey exists, add the startkey value to the list of
    // parameters.
    // If startkey is given then the returned list of documents will
    // start with the document whose id is startkey.
    if (opts.startkey) {
      params.push('startkey=' +
                  encodeURIComponent(JSON.stringify(opts.startkey)));
    }

    // If opts.endkey exists, add the endkey value to the list of parameters.
    // If endkey is given then the returned list of docuemnts will
    // end with the document whose id is endkey.
    if (opts.endkey) {
      params.push('endkey=' + encodeURIComponent(JSON.stringify(opts.endkey)));
    }

    // If opts.limit exists, add the limit value to the parameter list.
    if (opts.limit) {
      params.push('limit=' + opts.limit);
    }

    if (typeof opts.skip !== 'undefined') {
      params.push('skip=' + opts.skip);
    }

    // Format the list of parameters into a valid URI query string
    params = params.join('&');
    if (params !== '') {
      params = '?' + params;
    }

    // If keys are supplied, issue a POST request to circumvent GET query string limits
    // see http://wiki.apache.org/couchdb/HTTP_view_API#Querying_Options
    if (typeof opts.keys !== 'undefined') {
      method = 'POST';
      body = JSON.stringify({keys:opts.keys});
    }

    // Get the document listing
    ajax({
      headers: host.headers,
      method: method,
      url: genDBUrl(host, '_all_docs' + params),
      body: body
    }, callback);
  };

  // Get a list of changes made to documents in the database given by host.
  // TODO According to the README, there should be two other methods here,
  // api.changes.addListener and api.changes.removeListener.
  api.changes = function(opts) {

    // We internally page the results of a changes request, this means
    // if there is a large set of changes to be returned we can start
    // processing them quicker instead of waiting on the entire
    // set of changes to return and attempting to process them at once
    var CHANGES_LIMIT = 25;

    if (!api.taskqueue.ready()) {
      var task = api.taskqueue.addTask('changes', arguments);
      return {
        cancel: function() {
          if (task.task) {
            return task.task.cancel();
          }
          if (Pouch.DEBUG) {
            console.log(db_url + ': Cancel Changes Feed');
          }
          task.parameters[0].aborted = true;
        }
      };
    }
    
    if (opts.since === 'latest') {
      var changes;
      api.info(function (err, info) {
        if (!opts.aborted) {
          opts.since = info.update_seq;
          changes = api.changes(opts);
        }
      });
      // Return a method to cancel this method from processing any more
      return {
        cancel: function() {
          if (changes) {
            return changes.cancel();
          }
          if (Pouch.DEBUG) {
            console.log(db_url + ': Cancel Changes Feed');
          }
          opts.aborted = true;
        }
      };
    }

    if (Pouch.DEBUG) {
      console.log(db_url + ': Start Changes Feed: continuous=' + opts.continuous);
    }

    var params = {};
    var limit = (typeof opts.limit !== 'undefined') ? opts.limit : false;
    if (limit === 0) {
      limit = 1;
    }
    //
    var leftToFetch = limit;

    if (opts.style) {
      params.style = opts.style;
    }

    if (opts.include_docs || opts.filter && typeof opts.filter === 'function') {
      params.include_docs = true;
    }

    if (opts.continuous) {
      params.feed = 'longpoll';
    }

    if (opts.conflicts) {
      params.conflicts = true;
    }

    if (opts.descending) {
      params.descending = true;
    }

    if (opts.filter && typeof opts.filter === 'string') {
      params.filter = opts.filter;
    }

    // If opts.query_params exists, pass it through to the changes request.
    // These parameters may be used by the filter on the source database.
    if (opts.query_params && typeof opts.query_params === 'object') {
      for (var param_name in opts.query_params) {
        if (opts.query_params.hasOwnProperty(param_name)) {
          params[param_name] = opts.query_params[param_name];
        }
      }
    }

    var xhr;
    var lastFetchedSeq;
    var remoteLastSeq;
    var pagingCount;

    // Get all the changes starting wtih the one immediately after the
    // sequence number given by since.
    var fetch = function(since, callback) {
      params.since = since;
      if (!opts.continuous && !pagingCount) {
        pagingCount = remoteLastSeq;
      }
      params.limit = (!limit || leftToFetch > CHANGES_LIMIT) ?
        CHANGES_LIMIT : leftToFetch;

      var paramStr = '?' + Object.keys(params).map(function(k) {
        return k + '=' + params[k];
      }).join('&');

      // Set the options for the ajax call
      var xhrOpts = {
        headers: host.headers, method:'GET',
        url: genDBUrl(host, '_changes' + paramStr),
        // _changes can take a long time to generate, especially when filtered
        timeout: null
      };
      lastFetchedSeq = since;

      if (opts.aborted) {
        return;
      }

      // Get the changes
      xhr = ajax(xhrOpts, callback);
    };

    // If opts.since exists, get all the changes from the sequence
    // number given by opts.since. Otherwise, get all the changes
    // from the sequence number 0.
    var fetchTimeout = 10;
    var fetchRetryCount = 0;

    var results = {results: []};

    var fetched = function(err, res) {
      // If the result of the ajax call (res) contains changes (res.results)
      if (res && res.results) {
        results.last_seq = res.last_seq;
        // For each change
        var req = {};
        req.query = opts.query_params;
        res.results = res.results.filter(function(c) {
          leftToFetch--;
          var ret = PouchUtils.filterChange(opts)(c);
          if (ret) {
            results.results.push(c);
            PouchUtils.call(opts.onChange, c);
          }
          return ret;
        });
      }

      // The changes feed may have timed out with no results
      // if so reuse last update sequence
      if (res && res.last_seq) {
        lastFetchedSeq = res.last_seq;
      }

      var resultsLength = res && res.results.length || 0;

      pagingCount -= CHANGES_LIMIT;

      var finished = (limit && leftToFetch <= 0) ||
        (res && !resultsLength && pagingCount <= 0) ||
        (resultsLength && res.last_seq === remoteLastSeq) ||
        (opts.descending && lastFetchedSeq !== 0);

      if (opts.continuous || !finished) {
        // Increase retry delay exponentially as long as errors persist
        if (err) {
          fetchRetryCount += 1;
        } else {
          fetchRetryCount = 0;
        }
        var timeoutMultiplier = 1 << fetchRetryCount;
        var retryWait = fetchTimeout * timeoutMultiplier;
        var maximumWait = opts.maximumWait || 30000;

        if (retryWait > maximumWait) {
          PouchUtils.call(opts.complete, err || Pouch.Errors.UNKNOWN_ERROR, null);
        }

        // Queue a call to fetch again with the newest sequence number
        setTimeout(function() { fetch(lastFetchedSeq, fetched); }, retryWait);
      } else {
        // We're done, call the callback
        PouchUtils.call(opts.complete, null, results);
      }
    };

    // If we arent doing a continuous changes request we need to know
    // the current update_seq so we know when to stop processing the
    // changes
    if (opts.continuous) {
      fetch(opts.since || 0, fetched);
    } else {
      api.info(function(err, res) {
        if (err) {
          return PouchUtils.call(opts.complete, err);
        }
        remoteLastSeq = res.update_seq;
        fetch(opts.since || 0, fetched);
      });
    }

    // Return a method to cancel this method from processing any more
    return {
      cancel: function() {
        if (Pouch.DEBUG) {
          console.log(db_url + ': Cancel Changes Feed');
        }
        opts.aborted = true;
        xhr.abort();
      }
    };
  };

  // Given a set of document/revision IDs (given by req), tets the subset of
  // those that do NOT correspond to revisions stored in the database.
  // See http://wiki.apache.org/couchdb/HttpPostRevsDiff
  api.revsDiff = function(req, opts, callback) {
    if (!api.taskqueue.ready()) {
      api.taskqueue.addTask('revsDiff', arguments);
      return;
    }
    // If no options were given, set the callback to be the second parameter
    if (typeof opts === 'function') {
      callback = opts;
      opts = {};
    }

    // Get the missing document/revision IDs
    ajax({
      headers: host.headers,
      method:'POST',
      url: genDBUrl(host, '_revs_diff'),
      body: req
    }, function(err, res) {
      PouchUtils.call(callback, err, res);
    });
  };

  api.close = function(callback) {
    if (!api.taskqueue.ready()) {
      api.taskqueue.addTask('close', arguments);
      return;
    }
    PouchUtils.call(callback, null);
  };

  api.replicateOnServer = function(target, opts, promise) {
    if (!api.taskqueue.ready()) {
      api.taskqueue.addTask('replicateOnServer', arguments);
      return promise;
    }
    
    var targetHost = getHost(target.id());
    var params = {
      source: host.db,
      target: targetHost.protocol === host.protocol && targetHost.authority === host.authority ? targetHost.db : targetHost.source
    };

    if (opts.continuous) {
      params.continuous = true;
    }

    if (opts.create_target) {
      params.create_target = true;
    }

    if (opts.doc_ids) {
      params.doc_ids = opts.doc_ids;
    }

    if (opts.filter && typeof opts.filter === 'string') {
      params.filter = opts.filter;
    }

    if (opts.query_params) {
      params.query_params = opts.query_params;
    }

    var result = {};
    var repOpts = {
      headers: host.headers,
      method: 'POST',
      url: host.protocol + '://' + host.host + (host.port === 80 ? '' : (':' + host.port)) + '/_replicate',
      body: params
    };
    var xhr;
    promise.cancel = function() {
      this.cancelled = true;
      if (xhr && !result.ok) {
        xhr.abort();
      }
      if (result._local_id) {
        repOpts.body = {
          replication_id: result._local_id
        };
      }
      repOpts.body.cancel = true;
      ajax(repOpts, function(err, resp, xhr) {
        // If the replication cancel request fails, send an error to the callback
        if (err) {
          return PouchUtils.call(callback, err);
        }
        // Send the replication cancel result to the complete callback
        PouchUtils.call(opts.complete, null, result, xhr);
      });
    };

    if (promise.cancelled) {
      return;
    }

    xhr = ajax(repOpts, function(err, resp, xhr) {
      // If the replication fails, send an error to the callback
      if (err) {
        return PouchUtils.call(callback, err);
      }

      result.ok = true;

      // Provided by CouchDB from 1.2.0 onward to cancel replication
      if (resp._local_id) {
        result._local_id = resp._local_id;
      }

      // Send the replication result to the complete callback
      PouchUtils.call(opts.complete, null, resp, xhr);
    });
  };

  return api;
}

// Delete the HttpPouch specified by the given name.
HttpPouch.destroy = function(name, opts, callback) {
  var host = getHost(name, opts);
  opts = opts || {};
  if (typeof opts === 'function') {
    callback = opts;
    opts = {};
  }
  opts.headers = host.headers;
  opts.method = 'DELETE';
  opts.url = genDBUrl(host, '');
  PouchUtils.ajax(opts, callback);
};

// HttpPouch is a valid adapter.
HttpPouch.valid = function() {
  return true;
};

// Set HttpPouch to be the adapter used with the http scheme.
Pouch.adapter('http', HttpPouch);
Pouch.adapter('https', HttpPouch);

/*globals PouchUtils: true, PouchMerge */

'use strict';

var PouchUtils;

if (typeof module !== 'undefined' && module.exports) {
  PouchUtils = require('../pouch.utils.js');
}

var idbError = function(callback) {
  return function(event) {
    PouchUtils.call(callback, {
      status: 500,
      error: event.type,
      reason: event.target
    });
  };
};

var IdbPouch = function(opts, callback) {

  // IndexedDB requires a versioned database structure, this is going to make
  // it hard to dynamically create object stores if we needed to for things
  // like views
  var POUCH_VERSION = 1;

  // The object stores created for each database
  // DOC_STORE stores the document meta data, its revision history and state
  var DOC_STORE = 'document-store';
  // BY_SEQ_STORE stores a particular version of a document, keyed by its
  // sequence id
  var BY_SEQ_STORE = 'by-sequence';
  // Where we store attachments
  var ATTACH_STORE = 'attach-store';
  // Where we store meta data
  var META_STORE = 'meta-store';
  // Where we detect blob support
  var DETECT_BLOB_SUPPORT_STORE = 'detect-blob-support';


  var name = opts.name;
  var req = window.indexedDB.open(name, POUCH_VERSION);

  if (Pouch.openReqList) {
    Pouch.openReqList[name] = req;
  }

  var blobSupport = null;

  var instanceId = null;
  var api = {};
  var idb = null;

  if (Pouch.DEBUG) {
    console.log(name + ': Open Database');
  }

  req.onupgradeneeded = function(e) {
    var db = e.target.result;
    var currentVersion = e.oldVersion;
    while (currentVersion !== e.newVersion) {
      if (currentVersion === 0) {
        createSchema(db);
      }
      currentVersion++;
    }
  };

  function createSchema(db) {
    db.createObjectStore(DOC_STORE, {keyPath : 'id'})
      .createIndex('seq', 'seq', {unique: true});
    db.createObjectStore(BY_SEQ_STORE, {autoIncrement : true})
      .createIndex('_doc_id_rev', '_doc_id_rev', {unique: true});
    db.createObjectStore(ATTACH_STORE, {keyPath: 'digest'});
    db.createObjectStore(META_STORE, {keyPath: 'id', autoIncrement: false});
    db.createObjectStore(DETECT_BLOB_SUPPORT_STORE);
  }

  // From http://stackoverflow.com/questions/14967647/encode-decode-image-with-base64-breaks-image (2013-04-21)
  function fixBinary(bin) {
    var length = bin.length;
    var buf = new ArrayBuffer(length);
    var arr = new Uint8Array(buf);
    for (var i = 0; i < length; i++) {
      arr[i] = bin.charCodeAt(i);
    }
    return buf;
  }

  req.onsuccess = function(e) {

    idb = e.target.result;

    var txn = idb.transaction([META_STORE, DETECT_BLOB_SUPPORT_STORE],
                              'readwrite');

    idb.onversionchange = function() {
      idb.close();
    };

    // polyfill the new onupgradeneeded api for chrome. can get rid of when
    // saucelabs moves to chrome 23
    if (idb.setVersion && Number(idb.version) !== POUCH_VERSION) {
      var versionReq = idb.setVersion(POUCH_VERSION);
      versionReq.onsuccess = function(evt) {
        function setVersionComplete() {
          req.onsuccess(e);
        }
        evt.target.result.oncomplete = setVersionComplete;
        req.onupgradeneeded(e);
      };
      return;
    }

    var req = txn.objectStore(META_STORE).get(META_STORE);

    req.onsuccess = function(e) {
      var meta = e.target.result || {id: META_STORE};
      if (name + '_id' in meta) {
        instanceId = meta[name + '_id'];
      } else {
        instanceId = Pouch.uuid();
        meta[name + '_id'] = instanceId;
        txn.objectStore(META_STORE).put(meta);
      }

      // detect blob support
      try {
        txn.objectStore(DETECT_BLOB_SUPPORT_STORE).put(PouchUtils.createBlob(), "key");
        blobSupport = true;
      } catch (err) {
        blobSupport = false;
      } finally {
        PouchUtils.call(callback, null, api);
      }
    };
  };

  req.onerror = idbError(callback);

  api.type = function() {
    return 'idb';
  };

  // Each database needs a unique id so that we can store the sequence
  // checkpoint without having other databases confuse itself.
  api.id = function idb_id() {
    return instanceId;
  };

  api._bulkDocs = function idb_bulkDocs(req, opts, callback) {
    var newEdits = opts.new_edits;
    var userDocs = req.docs;
    // Parse the docs, give them a sequence number for the result
    var docInfos = userDocs.map(function(doc, i) {
      var newDoc = PouchUtils.parseDoc(doc, newEdits);
      newDoc._bulk_seq = i;
      return newDoc;
    });

    var docInfoErrors = docInfos.filter(function(docInfo) {
      return docInfo.error;
    });
    if (docInfoErrors.length) {
      return PouchUtils.call(callback, docInfoErrors[0]);
    }

    var results = [];
    var docsWritten = 0;

    function writeMetaData(e) {
      var meta = e.target.result;
      meta.updateSeq = (meta.updateSeq || 0) + docsWritten;
      txn.objectStore(META_STORE).put(meta);
    }

    function processDocs() {
      if (!docInfos.length) {
        txn.objectStore(META_STORE).get(META_STORE).onsuccess = writeMetaData;
        return;
      }
      var currentDoc = docInfos.shift();
      var req = txn.objectStore(DOC_STORE).get(currentDoc.metadata.id);
      req.onsuccess = function process_docRead(event) {
        var oldDoc = event.target.result;
        if (!oldDoc) {
          insertDoc(currentDoc);
        } else {
          updateDoc(oldDoc, currentDoc);
        }
      };
    }

    function complete(event) {
      var aresults = [];
      results.sort(sortByBulkSeq);
      results.forEach(function(result) {
        delete result._bulk_seq;
        if (result.error) {
          aresults.push(result);
          return;
        }
        var metadata = result.metadata;
        var rev = PouchMerge.winningRev(metadata);

        aresults.push({
          ok: true,
          id: metadata.id,
          rev: rev
        });

        if (PouchUtils.isLocalId(metadata.id)) {
          return;
        }

        IdbPouch.Changes.notify(name);
        IdbPouch.Changes.notifyLocalWindows(name);
      });
      PouchUtils.call(callback, null, aresults);
    }

    function preprocessAttachment(att, finish) {
      if (att.stub) {
        return finish();
      }
      if (typeof att.data === 'string') {
        var data;
        try {
          data = atob(att.data);
        } catch (e) {
          var err = Pouch.error(Pouch.Errors.BAD_ARG,
                                "Attachments need to be base64 encoded");
          return PouchUtils.call(callback, err);
        }
        att.digest = 'md5-' + PouchUtils.Crypto.MD5(data);
        if (blobSupport) {
          var type = att.content_type;
          data = fixBinary(data);
          att.data = PouchUtils.createBlob([data], {type: type});
        }
        return finish();
      }
      var reader = new FileReader();
      reader.onloadend = function(e) {
        att.digest = 'md5-' + PouchUtils.Crypto.MD5(this.result);
        if (!blobSupport) {
          att.data = btoa(this.result);
        }
        finish();
      };
      reader.readAsBinaryString(att.data);
    }

    function preprocessAttachments(callback) {
      if (!docInfos.length) {
        return callback();
      }

      var docv = 0;
      docInfos.forEach(function(docInfo) {
        var attachments = docInfo.data && docInfo.data._attachments ?
          Object.keys(docInfo.data._attachments) : [];

        if (!attachments.length) {
          return done();
        }

        var recv = 0;
        function attachmentProcessed() {
          recv++;
          if (recv === attachments.length) {
            done();
          }
        }

        for (var key in docInfo.data._attachments) {
          preprocessAttachment(docInfo.data._attachments[key], attachmentProcessed);
        }
      });

      function done() {
        docv++;
        if (docInfos.length === docv) {
          callback();
        }
      }
    }

    function writeDoc(docInfo, callback) {
      var err = null;
      var recv = 0;
      docInfo.data._id = docInfo.metadata.id;
      docInfo.data._rev = docInfo.metadata.rev;

      docsWritten++;

      if (PouchUtils.isDeleted(docInfo.metadata, docInfo.metadata.rev)) {
        docInfo.data._deleted = true;
      }

      var attachments = docInfo.data._attachments ?
        Object.keys(docInfo.data._attachments) : [];

      function collectResults(attachmentErr) {
        if (!err) {
          if (attachmentErr) {
            err = attachmentErr;
            PouchUtils.call(callback, err);
          } else if (recv === attachments.length) {
            finish();
          }
        }
      }

      function attachmentSaved(err) {
        recv++;
        collectResults(err);
      }

      for (var key in docInfo.data._attachments) {
        if (!docInfo.data._attachments[key].stub) {
          var data = docInfo.data._attachments[key].data;
          delete docInfo.data._attachments[key].data;
          var digest = docInfo.data._attachments[key].digest;
          saveAttachment(docInfo, digest, data, attachmentSaved);
        } else {
          recv++;
          collectResults();
        }
      }

      function finish() {
        docInfo.data._doc_id_rev = docInfo.data._id + "::" + docInfo.data._rev;
        var dataReq = txn.objectStore(BY_SEQ_STORE).put(docInfo.data);
        dataReq.onsuccess = function(e) {
          if (Pouch.DEBUG) {
            console.log(name + ': Wrote Document ', docInfo.metadata.id);
          }
          docInfo.metadata.seq = e.target.result;
          // Current _rev is calculated from _rev_tree on read
          delete docInfo.metadata.rev;
          var metaDataReq = txn.objectStore(DOC_STORE).put(docInfo.metadata);
          metaDataReq.onsuccess = function() {
            results.push(docInfo);
            PouchUtils.call(callback);
          };
        };
      }

      if (!attachments.length) {
        finish();
      }
    }

    function updateDoc(oldDoc, docInfo) {
      var merged = PouchMerge.merge(oldDoc.rev_tree, docInfo.metadata.rev_tree[0], 1000);
      var wasPreviouslyDeleted = PouchUtils.isDeleted(oldDoc);
      var inConflict = (wasPreviouslyDeleted &&
                        PouchUtils.isDeleted(docInfo.metadata)) ||
        (!wasPreviouslyDeleted && newEdits && merged.conflicts !== 'new_leaf');

      if (inConflict) {
        results.push(makeErr(Pouch.Errors.REV_CONFLICT, docInfo._bulk_seq));
        return processDocs();
      }

      docInfo.metadata.rev_tree = merged.tree;
      writeDoc(docInfo, processDocs);
    }

    function insertDoc(docInfo) {
      // Cant insert new deleted documents
      if ('was_delete' in opts && PouchUtils.isDeleted(docInfo.metadata)) {
        results.push(Pouch.Errors.MISSING_DOC);
        return processDocs();
      }
      writeDoc(docInfo, processDocs);
    }

    // Insert sequence number into the error so we can sort later
    function makeErr(err, seq) {
      err._bulk_seq = seq;
      return err;
    }

    function saveAttachment(docInfo, digest, data, callback) {
      var objectStore = txn.objectStore(ATTACH_STORE);
      var getReq = objectStore.get(digest).onsuccess = function(e) {
        var originalRefs = e.target.result && e.target.result.refs || {};
        var ref = [docInfo.metadata.id, docInfo.metadata.rev].join('@');
        var newAtt = {
          digest: digest,
          body: data,
          refs: originalRefs
        };
        newAtt.refs[ref] = true;
        var putReq = objectStore.put(newAtt).onsuccess = function(e) {
          PouchUtils.call(callback);
        };
      };
    }

    var txn;
    preprocessAttachments(function() {
      txn = idb.transaction([DOC_STORE, BY_SEQ_STORE, ATTACH_STORE, META_STORE],
                            'readwrite');
      txn.onerror = idbError(callback);
      txn.ontimeout = idbError(callback);
      txn.oncomplete = complete;

      processDocs();
    });
  };

  function sortByBulkSeq(a, b) {
    return a._bulk_seq - b._bulk_seq;
  }

  // First we look up the metadata in the ids database, then we fetch the
  // current revision(s) from the by sequence store
  api._get = function idb_get(id, opts, callback) {
    var doc;
    var metadata;
    var err;
    var txn;
    if (opts.ctx) {
      txn = opts.ctx;
    } else {
      txn = idb.transaction([DOC_STORE, BY_SEQ_STORE, ATTACH_STORE], 'readonly');
    }

    function finish(){
      PouchUtils.call(callback, err, {doc: doc, metadata: metadata, ctx: txn});
    }

    txn.objectStore(DOC_STORE).get(id).onsuccess = function(e) {
      metadata = e.target.result;
      // we can determine the result here if:
      // 1. there is no such document
      // 2. the document is deleted and we don't ask about specific rev
      // When we ask with opts.rev we expect the answer to be either
      // doc (possibly with _deleted=true) or missing error
      if (!metadata) {
        err = Pouch.Errors.MISSING_DOC;
        return finish();
      }
      if (PouchUtils.isDeleted(metadata) && !opts.rev) {
        err = Pouch.error(Pouch.Errors.MISSING_DOC, "deleted");
        return finish();
      }

      var rev = PouchMerge.winningRev(metadata);
      var key = metadata.id + '::' + (opts.rev ? opts.rev : rev);
      var index = txn.objectStore(BY_SEQ_STORE).index('_doc_id_rev');

      index.get(key).onsuccess = function(e) {
        doc = e.target.result;
        if(doc && doc._doc_id_rev) {
          delete(doc._doc_id_rev);
        }
        if (!doc) {
          err = Pouch.Errors.MISSING_DOC;
          return finish();
        }
        finish();
      };
    };
  };

  api._getAttachment = function(attachment, opts, callback) {
    var result;
    var txn;
    if (opts.ctx) {
      txn = opts.ctx;
    } else {
      txn = idb.transaction([DOC_STORE, BY_SEQ_STORE, ATTACH_STORE], 'readonly');
    }
    var digest = attachment.digest;
    var type = attachment.content_type;

    txn.objectStore(ATTACH_STORE).get(digest).onsuccess = function(e) {
      var data = e.target.result.body;
      if (opts.encode) {
        if (blobSupport) {
          var reader = new FileReader();
          reader.onloadend = function(e) {
            result = btoa(this.result);
            PouchUtils.call(callback, null, result);
          };
          reader.readAsBinaryString(data);
        } else {
          result = data;
          PouchUtils.call(callback, null, result);
        }
      } else {
        if (blobSupport) {
          result = data;
        } else {
          data = fixBinary(atob(data));
          result = PouchUtils.createBlob([data], {type: type});
        }
        PouchUtils.call(callback, null, result);
      }
    };
  };

  api._allDocs = function idb_allDocs(opts, callback) {
    var start = 'startkey' in opts ? opts.startkey : false;
    var end = 'endkey' in opts ? opts.endkey : false;

    var descending = 'descending' in opts ? opts.descending : false;
    descending = descending ? 'prev' : null;

    var keyRange = start && end ? window.IDBKeyRange.bound(start, end)
      : start ? window.IDBKeyRange.lowerBound(start)
      : end ? window.IDBKeyRange.upperBound(end) : null;

    var transaction = idb.transaction([DOC_STORE, BY_SEQ_STORE], 'readonly');
    transaction.oncomplete = function() {
      if ('keys' in opts) {
        opts.keys.forEach(function(key) {
          if (key in resultsMap) {
            results.push(resultsMap[key]);
          } else {
            results.push({"key": key, "error": "not_found"});
          }
        });
        if (opts.descending) {
          results.reverse();
        }
      }
      PouchUtils.call(callback, null, {
        total_rows: results.length,
        offset: opts.skip,
        rows: ('limit' in opts) ? results.slice(opts.skip, opts.limit + opts.skip) :
          (opts.skip > 0) ? results.slice(opts.skip) : results
      });
    };

    var oStore = transaction.objectStore(DOC_STORE);
    var oCursor = descending ? oStore.openCursor(keyRange, descending)
      : oStore.openCursor(keyRange);
    var results = [];
    var resultsMap = {};
    oCursor.onsuccess = function(e) {
      if (!e.target.result) {
        return;
      }
      var cursor = e.target.result;
      var metadata = cursor.value;
      // If opts.keys is set we want to filter here only those docs with
      // key in opts.keys. With no performance tests it is difficult to
      // guess if iteration with filter is faster than many single requests
      function allDocsInner(metadata, data) {
        if (PouchUtils.isLocalId(metadata.id)) {
          return cursor['continue']();
        }
        var doc = {
          id: metadata.id,
          key: metadata.id,
          value: {
            rev: PouchMerge.winningRev(metadata)
          }
        };
        if (opts.include_docs) {
          doc.doc = data;
          doc.doc._rev = PouchMerge.winningRev(metadata);
          if (doc.doc._doc_id_rev) {
              delete(doc.doc._doc_id_rev);
          }
          if (opts.conflicts) {
            doc.doc._conflicts = PouchMerge.collectConflicts(metadata);
          }
          for (var att in doc.doc._attachments) {
            doc.doc._attachments[att].stub = true;
          }
        }
        if ('keys' in opts) {
          if (opts.keys.indexOf(metadata.id) > -1) {
            if (PouchUtils.isDeleted(metadata)) {
              doc.value.deleted = true;
              doc.doc = null;
            }
            resultsMap[doc.id] = doc;
          }
        } else {
          if (!PouchUtils.isDeleted(metadata)) {
            results.push(doc);
          }
        }
        cursor['continue']();
      }

      if (!opts.include_docs) {
        allDocsInner(metadata);
      } else {
        var index = transaction.objectStore(BY_SEQ_STORE).index('_doc_id_rev');
        var mainRev = PouchMerge.winningRev(metadata);
        var key = metadata.id + "::" + mainRev;
        index.get(key).onsuccess = function(event) {
          allDocsInner(cursor.value, event.target.result);
        };
      }
    };
  };

  api._info = function idb_info(callback) {
    var count = 0;
    var update_seq = 0;
    var txn = idb.transaction([DOC_STORE, META_STORE], 'readonly');

    function fetchUpdateSeq(e) {
      update_seq = e.target.result && e.target.result.updateSeq || 0;
    }

    function countDocs(e) {
      var cursor = e.target.result;
      if (!cursor) {
        txn.objectStore(META_STORE).get(META_STORE).onsuccess = fetchUpdateSeq;
        return;
      }
      if (cursor.value.deleted !== true) {
        count++;
      }
      cursor['continue']();
    }

    txn.oncomplete = function() {
      callback(null, {
        db_name: name,
        doc_count: count,
        update_seq: update_seq
      });
    };

    txn.objectStore(DOC_STORE).openCursor().onsuccess = countDocs;
  };

  api._changes = function idb_changes(opts) {
    if (Pouch.DEBUG) {
      console.log(name + ': Start Changes Feed: continuous=' + opts.continuous);
    }

    if (opts.continuous) {
      var id = name + ':' + Pouch.uuid();
      opts.cancelled = false;
      IdbPouch.Changes.addListener(name, id, api, opts);
      IdbPouch.Changes.notify(name);
      return {
        cancel: function() {
          if (Pouch.DEBUG) {
            console.log(name + ': Cancel Changes Feed');
          }
          opts.cancelled = true;
          IdbPouch.Changes.removeListener(name, id);
        }
      };
    }

    var descending = opts.descending ? 'prev' : null;
    var last_seq = 0;

    // Ignore the `since` parameter when `descending` is true
    opts.since = opts.since && !descending ? opts.since : 0;

    var results = [], resultIndices = {}, dedupResults = [];
    var txn;

    function fetchChanges() {
      txn = idb.transaction([DOC_STORE, BY_SEQ_STORE]);
      txn.oncomplete = onTxnComplete;

      var req;

      if (descending) {
        req = txn.objectStore(BY_SEQ_STORE)
            .openCursor(window.IDBKeyRange.lowerBound(opts.since, true), descending);
      } else {
        req = txn.objectStore(BY_SEQ_STORE)
            .openCursor(window.IDBKeyRange.lowerBound(opts.since, true));
      }

      req.onsuccess = onsuccess;
      req.onerror = onerror;
    }

    if (opts.filter && typeof opts.filter === 'string') {
      var filterName = opts.filter.split('/');
      api.get('_design/' + filterName[0], function(err, ddoc) {
        /*jshint evil: true */
        var filter = eval('(function() { return ' +
                          ddoc.filters[filterName[1]] + ' })()');
        opts.filter = filter;
        fetchChanges();
      });
    } else {
      fetchChanges();
    }

    function onsuccess(event) {
      if (!event.target.result) {
        // Filter out null results casued by deduping
        for (var i = 0, l = results.length; i < l; i++ ) {
          var result = results[i];
          if (result) {
            dedupResults.push(result);
          }
        }
        return false;
      }

      var cursor = event.target.result;

      // Try to pre-emptively dedup to save us a bunch of idb calls
      var changeId = cursor.value._id;
      var changeIdIndex = resultIndices[changeId];
      if (changeIdIndex !== undefined) {
        results[changeIdIndex].seq = cursor.key;
        // update so it has the later sequence number
        results.push(results[changeIdIndex]);
        results[changeIdIndex] = null;
        resultIndices[changeId] = results.length - 1;
        return cursor['continue']();
      }

      var index = txn.objectStore(DOC_STORE);
      index.get(cursor.value._id).onsuccess = function(event) {
        var metadata = event.target.result;
        if (PouchUtils.isLocalId(metadata.id)) {
          return cursor['continue']();
        }

        if(last_seq < metadata.seq){
          last_seq = metadata.seq;
        }

        var mainRev = PouchMerge.winningRev(metadata);
        var key = metadata.id + "::" + mainRev;
        var index = txn.objectStore(BY_SEQ_STORE).index('_doc_id_rev');
        index.get(key).onsuccess = function(docevent) {
          var doc = docevent.target.result;
          delete doc['_doc_id_rev'];
          var changeList = [{rev: mainRev}];
          if (opts.style === 'all_docs') {
            changeList = PouchMerge.collectLeaves(metadata.rev_tree)
              .map(function(x) { return {rev: x.rev}; });
          }
          var change = {
            id: metadata.id,
            seq: cursor.key,
            changes: changeList,
            doc: doc
          };

          if (PouchUtils.isDeleted(metadata, mainRev)) {
            change.deleted = true;
          }
          if (opts.conflicts) {
            change.doc._conflicts = PouchMerge.collectConflicts(metadata);
          }

          // Dedupe the changes feed
          var changeId = change.id, changeIdIndex = resultIndices[changeId];
          if (changeIdIndex !== undefined) {
            results[changeIdIndex] = null;
          }
          results.push(change);
          resultIndices[changeId] = results.length - 1;
          cursor['continue']();
        };
      };
    }

    function onTxnComplete() {
      PouchUtils.processChanges(opts, dedupResults, last_seq);
    }

    function onerror(error) {
      // TODO: shouldn't we pass some params here?
      PouchUtils.call(opts.complete);
    }
  };

  api._close = function(callback) {
    if (idb === null) {
      return PouchUtils.call(callback, Pouch.Errors.NOT_OPEN);
    }

    // https://developer.mozilla.org/en-US/docs/IndexedDB/IDBDatabase#close
    // "Returns immediately and closes the connection in a separate thread..."
    idb.close();
    PouchUtils.call(callback, null);
  };

  api._getRevisionTree = function(docId, callback) {
    var txn = idb.transaction([DOC_STORE], 'readonly');
    var req = txn.objectStore(DOC_STORE).get(docId);
    req.onsuccess = function (event) {
      var doc = event.target.result;
      if (!doc) {
        PouchUtils.call(callback, Pouch.Errors.MISSING_DOC);
      } else {
        PouchUtils.call(callback, null, doc.rev_tree);
      }
    };
  };

  // This function removes revisions of document docId
  // which are listed in revs and sets this document
  // revision to to rev_tree
  api._doCompaction = function(docId, rev_tree, revs, callback) {
    var txn = idb.transaction([DOC_STORE, BY_SEQ_STORE], 'readwrite');

    var index = txn.objectStore(DOC_STORE);
    index.get(docId).onsuccess = function(event) {
      var metadata = event.target.result;
      metadata.rev_tree = rev_tree;

      var count = revs.length;
      revs.forEach(function(rev) {
        var index = txn.objectStore(BY_SEQ_STORE).index('_doc_id_rev');
        var key = docId + "::" + rev;
        index.getKey(key).onsuccess = function(e) {
          var seq = e.target.result;
          if (!seq) {
            return;
          }
          var req = txn.objectStore(BY_SEQ_STORE)['delete'](seq);

          count--;
          if (!count) {
            txn.objectStore(DOC_STORE).put(metadata);
          }
        };
      });
    };
    txn.oncomplete = function() {
      PouchUtils.call(callback);
    };
  };

  return api;
};

IdbPouch.valid = function idb_valid() {
  return typeof window !== 'undefined' && !!window.indexedDB;
};

IdbPouch.destroy = function idb_destroy(name, opts, callback) {
  if (Pouch.DEBUG) {
    console.log(name + ': Delete Database');
  }
  IdbPouch.Changes.clearListeners(name);

  //Close open request for "name" database to fix ie delay.
  if (Pouch.openReqList[name] && Pouch.openReqList[name].result) {
    Pouch.openReqList[name].result.close();
  }
  var req = window.indexedDB.deleteDatabase(name);

  req.onsuccess = function() {
    //Remove open request from the list.
    if (Pouch.openReqList[name]) {
      Pouch.openReqList[name] = null;
    }
    PouchUtils.call(callback, null);
  };

  req.onerror = idbError(callback);
};

IdbPouch.Changes = new PouchUtils.Changes();

Pouch.adapter('idb', IdbPouch);

/*globals PouchUtils: true, PouchMerge */

'use strict';

var PouchUtils;

if (typeof module !== 'undefined' && module.exports) {
  PouchUtils = require('../pouch.utils.js');
}

function quote(str) {
  return "'" + str + "'";
}

var POUCH_VERSION = 1;
var POUCH_SIZE = 5 * 1024 * 1024;

// The object stores created for each database
// DOC_STORE stores the document meta data, its revision history and state
var DOC_STORE = quote('document-store');
// BY_SEQ_STORE stores a particular version of a document, keyed by its
// sequence id
var BY_SEQ_STORE = quote('by-sequence');
// Where we store attachments
var ATTACH_STORE = quote('attach-store');
var META_STORE = quote('metadata-store');

var unknownError = function(callback) {
  return function(event) {
    PouchUtils.call(callback, {
      status: 500,
      error: event.type,
      reason: event.target
    });
  };
};

var webSqlPouch = function(opts, callback) {

  var api = {};
  var instanceId = null;
  var name = opts.name;

  var db = openDatabase(name, POUCH_VERSION, name, POUCH_SIZE);
  if (!db) {
    return PouchUtils.call(callback, Pouch.Errors.UNKNOWN_ERROR);
  }

  function dbCreated() {
    callback(null, api);
  }

  function setup(){
    db.transaction(function (tx) {
      var meta = 'CREATE TABLE IF NOT EXISTS ' + META_STORE +
        ' (update_seq, dbid)';
      var attach = 'CREATE TABLE IF NOT EXISTS ' + ATTACH_STORE +
        ' (digest, json, body BLOB)';
      var doc = 'CREATE TABLE IF NOT EXISTS ' + DOC_STORE +
        ' (id unique, seq, json, winningseq)';
      var seq = 'CREATE TABLE IF NOT EXISTS ' + BY_SEQ_STORE +
        ' (seq INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, doc_id_rev UNIQUE, json)';

      tx.executeSql(attach);
      tx.executeSql(doc);
      tx.executeSql(seq);
      tx.executeSql(meta);

      var updateseq = 'SELECT update_seq FROM ' + META_STORE;
      tx.executeSql(updateseq, [], function(tx, result) {
        if (!result.rows.length) {
          var initSeq = 'INSERT INTO ' + META_STORE + ' (update_seq) VALUES (?)';
          tx.executeSql(initSeq, [0]);
          return;
        }
      });

      var dbid = 'SELECT dbid FROM ' + META_STORE + ' WHERE dbid IS NOT NULL';
      tx.executeSql(dbid, [], function(tx, result) {
        if (!result.rows.length) {
          var initDb = 'UPDATE ' + META_STORE + ' SET dbid=?';
          instanceId = Pouch.uuid();
          tx.executeSql(initDb, [instanceId]);
          return;
        }
        instanceId = result.rows.item(0).dbid;
      });
    }, unknownError(callback), dbCreated);
  }
  if (PouchUtils.isCordova() && typeof window !== 'undefined') {
    //to wait until custom api is made in pouch.adapters before doing setup
    window.addEventListener(name + '_pouch', function cordova_init() {
      window.removeEventListener(name + '_pouch', cordova_init, false);
      setup();
    }, false);
  } else {
    setup();
  }


  api.type = function() {
    return 'websql';
  };

  api.id = function() {
    return instanceId;
  };

  api._info = function(callback) {
    db.transaction(function(tx) {
      var sql = 'SELECT COUNT(id) AS count FROM ' + DOC_STORE;
      tx.executeSql(sql, [], function(tx, result) {
        var doc_count = result.rows.item(0).count;
        var updateseq = 'SELECT update_seq FROM ' + META_STORE;
        tx.executeSql(updateseq, [], function(tx, result) {
          var update_seq = result.rows.item(0).update_seq;
          callback(null, {
            db_name: name,
            doc_count: doc_count,
            update_seq: update_seq
          });
        });
      });
    });
  };

  api._bulkDocs = function idb_bulkDocs(req, opts, callback) {

    var newEdits = opts.new_edits;
    var userDocs = req.docs;
    var docsWritten = 0;

    // Parse the docs, give them a sequence number for the result
    var docInfos = userDocs.map(function(doc, i) {
      var newDoc = PouchUtils.parseDoc(doc, newEdits);
      newDoc._bulk_seq = i;
      return newDoc;
    });

    var docInfoErrors = docInfos.filter(function(docInfo) {
      return docInfo.error;
    });
    if (docInfoErrors.length) {
      return PouchUtils.call(callback, docInfoErrors[0]);
    }

    var tx;
    var results = [];
    var fetchedDocs = {};

    function sortByBulkSeq(a, b) {
      return a._bulk_seq - b._bulk_seq;
    }

    function complete(event) {
      var aresults = [];
      results.sort(sortByBulkSeq);
      results.forEach(function(result) {
        delete result._bulk_seq;
        if (result.error) {
          aresults.push(result);
          return;
        }
        var metadata = result.metadata;
        var rev = PouchMerge.winningRev(metadata);

        aresults.push({
          ok: true,
          id: metadata.id,
          rev: rev
        });

        if (PouchUtils.isLocalId(metadata.id)) {
          return;
        }

        docsWritten++;

        webSqlPouch.Changes.notify(name);
        webSqlPouch.Changes.notifyLocalWindows(name);
      });

      var updateseq = 'SELECT update_seq FROM ' + META_STORE;
      tx.executeSql(updateseq, [], function(tx, result) {
        var update_seq = result.rows.item(0).update_seq + docsWritten;
        var sql = 'UPDATE ' + META_STORE + ' SET update_seq=?';
        tx.executeSql(sql, [update_seq], function() {
          PouchUtils.call(callback, null, aresults);
        });
      });
    }

    function preprocessAttachment(att, finish) {
      if (att.stub) {
        return finish();
      }
      if (typeof att.data === 'string') {
        try {
          att.data = atob(att.data);
        } catch (e) {
          var err = Pouch.error(Pouch.Errors.BAD_ARG,
                                "Attachments need to be base64 encoded");
          return PouchUtils.call(callback, err);
        }
        att.digest = 'md5-' + PouchUtils.Crypto.MD5(att.data);
        return finish();
      }
      var reader = new FileReader();
      reader.onloadend = function(e) {
        att.data = this.result;
        att.digest = 'md5-' + PouchUtils.Crypto.MD5(this.result);
        finish();
      };
      reader.readAsBinaryString(att.data);
    }

    function preprocessAttachments(callback) {
      if (!docInfos.length) {
        return callback();
      }

      var docv = 0;
      var recv = 0;

      docInfos.forEach(function(docInfo) {
        var attachments = docInfo.data && docInfo.data._attachments ?
          Object.keys(docInfo.data._attachments) : [];

        if (!attachments.length) {
          return done();
        }

        function processedAttachment() {
          recv++;
          if (recv === attachments.length) {
            done();
          }
        }

        for (var key in docInfo.data._attachments) {
          preprocessAttachment(docInfo.data._attachments[key], processedAttachment);
        }
      });

      function done() {
        docv++;
        if (docInfos.length === docv) {
          callback();
        }
      }
    }

    function writeDoc(docInfo, callback, isUpdate) {

      function finish() {
        var data = docInfo.data;
        var sql = 'INSERT INTO ' + BY_SEQ_STORE + ' (doc_id_rev, json) VALUES (?, ?);';
        tx.executeSql(sql, [data._id + "::" + data._rev,
                            JSON.stringify(data)], dataWritten);
      }

      function collectResults(attachmentErr) {
        if (!err) {
          if (attachmentErr) {
            err = attachmentErr;
            PouchUtils.call(callback, err);
          } else if (recv === attachments.length) {
            finish();
          }
        }
      }

      var err = null;
      var recv = 0;

      docInfo.data._id = docInfo.metadata.id;
      docInfo.data._rev = docInfo.metadata.rev;

      if (PouchUtils.isDeleted(docInfo.metadata, docInfo.metadata.rev)) {
        docInfo.data._deleted = true;
      }

      var attachments = docInfo.data._attachments ?
        Object.keys(docInfo.data._attachments) : [];

      function attachmentSaved(err) {
        recv++;
        collectResults(err);
      }

      for (var key in docInfo.data._attachments) {
        if (!docInfo.data._attachments[key].stub) {
          var data = docInfo.data._attachments[key].data;
          delete docInfo.data._attachments[key].data;
          var digest = docInfo.data._attachments[key].digest;
          saveAttachment(docInfo, digest, data, attachmentSaved);
        } else {
          recv++;
          collectResults();
        }
      }

      if (!attachments.length) {
        finish();
      }

      function dataWritten(tx, result) {
        var seq = docInfo.metadata.seq = result.insertId;
        delete docInfo.metadata.rev;

        var mainRev = PouchMerge.winningRev(docInfo.metadata);

        var sql = isUpdate ?
          'UPDATE ' + DOC_STORE + ' SET seq=?, json=?, winningseq=(SELECT seq FROM ' +
          BY_SEQ_STORE + ' WHERE doc_id_rev=?) WHERE id=?' :
          'INSERT INTO ' + DOC_STORE + ' (id, seq, winningseq, json) VALUES (?, ?, ?, ?);';
        var metadataStr = JSON.stringify(docInfo.metadata);
        var key = docInfo.metadata.id + "::" + mainRev;
        var params = isUpdate ?
          [seq, metadataStr, key, docInfo.metadata.id] :
          [docInfo.metadata.id, seq, seq, metadataStr];
        tx.executeSql(sql, params, function(tx, result) {
          results.push(docInfo);
          PouchUtils.call(callback, null);
        });
      }
    }

    function updateDoc(oldDoc, docInfo) {
      var merged = PouchMerge.merge(oldDoc.rev_tree, docInfo.metadata.rev_tree[0], 1000);
      var inConflict = (PouchUtils.isDeleted(oldDoc) &&
                        PouchUtils.isDeleted(docInfo.metadata)) ||
        (!PouchUtils.isDeleted(oldDoc) &&
         newEdits && merged.conflicts !== 'new_leaf');

      if (inConflict) {
        results.push(makeErr(Pouch.Errors.REV_CONFLICT, docInfo._bulk_seq));
        return processDocs();
      }

      docInfo.metadata.rev_tree = merged.tree;
      writeDoc(docInfo, processDocs, true);
    }

    function insertDoc(docInfo) {
      // Cant insert new deleted documents
      if ('was_delete' in opts && PouchUtils.isDeleted(docInfo.metadata)) {
        results.push(Pouch.Errors.MISSING_DOC);
        return processDocs();
      }
      writeDoc(docInfo, processDocs, false);
    }

    function processDocs() {
      if (!docInfos.length) {
        return complete();
      }
      var currentDoc = docInfos.shift();
      var id = currentDoc.metadata.id;
      if (id in fetchedDocs) {
        updateDoc(fetchedDocs[id], currentDoc);
      } else {
        // if we have newEdits=false then we can update the same
        // document twice in a single bulk docs call
        fetchedDocs[id] = currentDoc.metadata;
        insertDoc(currentDoc);
      }
    }

    // Insert sequence number into the error so we can sort later
    function makeErr(err, seq) {
      err._bulk_seq = seq;
      return err;
    }

    function saveAttachment(docInfo, digest, data, callback) {
      var ref = [docInfo.metadata.id, docInfo.metadata.rev].join('@');
      var newAtt = {digest: digest};
      var sql = 'SELECT digest, json FROM ' + ATTACH_STORE + ' WHERE digest=?';
      tx.executeSql(sql, [digest], function(tx, result) {
        if (!result.rows.length) {
          newAtt.refs = {};
          newAtt.refs[ref] = true;
          sql = 'INSERT INTO ' + ATTACH_STORE + '(digest, json, body) VALUES (?, ?, ?)';
          tx.executeSql(sql, [digest, JSON.stringify(newAtt), data], function() {
            PouchUtils.call(callback, null);
          });
        } else {
          newAtt.refs = JSON.parse(result.rows.item(0).json).refs;
          sql = 'UPDATE ' + ATTACH_STORE + ' SET json=?, body=? WHERE digest=?';
          tx.executeSql(sql, [JSON.stringify(newAtt), data, digest], function() {
            PouchUtils.call(callback, null);
          });
        }
      });
    }

    function metadataFetched(tx, results) {
      for (var j=0; j<results.rows.length; j++) {
        var row = results.rows.item(j);
        fetchedDocs[row.id] = JSON.parse(row.json);
      }
      processDocs();
    }

    preprocessAttachments(function() {
      db.transaction(function(txn) {
        tx = txn;
        var ids = '(' + docInfos.map(function(d) {
          return quote(d.metadata.id);
        }).join(',') + ')';
        var sql = 'SELECT * FROM ' + DOC_STORE + ' WHERE id IN ' + ids;
        tx.executeSql(sql, [], metadataFetched);
      }, unknownError(callback));
    });
  };

  api._get = function(id, opts, callback) {
    var doc;
    var metadata;
    var err;
    if (!opts.ctx) {
      db.transaction(function(txn) {
        opts.ctx = txn;
        api._get(id, opts, callback);
      });
      return;
    }
    var tx = opts.ctx;

    function finish() {
      PouchUtils.call(callback, err, {doc: doc, metadata: metadata, ctx: tx});
    }

    var sql = 'SELECT * FROM ' + DOC_STORE + ' WHERE id=?';
    tx.executeSql(sql, [id], function(a, results) {
      if (!results.rows.length) {
        err = Pouch.Errors.MISSING_DOC;
        return finish();
      }
      metadata = JSON.parse(results.rows.item(0).json);
      if (PouchUtils.isDeleted(metadata) && !opts.rev) {
        err = Pouch.error(Pouch.Errors.MISSING_DOC, "deleted");
        return finish();
      }

      var rev = PouchMerge.winningRev(metadata);
      var key = opts.rev ? opts.rev : rev;
      key = metadata.id + '::' + key;
      var sql = 'SELECT * FROM ' + BY_SEQ_STORE + ' WHERE doc_id_rev=?';
      tx.executeSql(sql, [key], function(tx, results) {
        if (!results.rows.length) {
          err = Pouch.Errors.MISSING_DOC;
          return finish();
        }
        doc = JSON.parse(results.rows.item(0).json);

        finish();
      });
    });
  };

  function makeRevs(arr) {
    return arr.map(function(x) { return {rev: x.rev}; });
  }

  api._allDocs = function(opts, callback) {
    var results = [];
    var resultsMap = {};
    var start = 'startkey' in opts ? opts.startkey : false;
    var end = 'endkey' in opts ? opts.endkey : false;
    var descending = 'descending' in opts ? opts.descending : false;
    var sql = 'SELECT ' + DOC_STORE + '.id, ' + BY_SEQ_STORE + '.seq, ' +
      BY_SEQ_STORE + '.json AS data, ' + DOC_STORE + '.json AS metadata FROM ' +
      BY_SEQ_STORE + ' JOIN ' + DOC_STORE + ' ON ' + BY_SEQ_STORE + '.seq = ' +
      DOC_STORE + '.winningseq';

    if ('keys' in opts) {
      sql += ' WHERE ' + DOC_STORE + '.id IN (' + opts.keys.map(function(key){
        return quote(key);
      }).join(',') + ')';
    } else {
      if (start) {
        sql += ' WHERE ' + DOC_STORE + '.id >= "' + start + '"';
      }
      if (end) {
        sql += (start ? ' AND ' : ' WHERE ') + DOC_STORE + '.id <= "' + end + '"';
      }
      sql += ' ORDER BY ' + DOC_STORE + '.id ' + (descending ? 'DESC' : 'ASC');
    }

    db.transaction(function(tx) {
      tx.executeSql(sql, [], function(tx, result) {
        for (var i = 0, l = result.rows.length; i < l; i++ ) {
          var doc = result.rows.item(i);
          var metadata = JSON.parse(doc.metadata);
          var data = JSON.parse(doc.data);
          if (!(PouchUtils.isLocalId(metadata.id))) {
            doc = {
              id: metadata.id,
              key: metadata.id,
              value: {rev: PouchMerge.winningRev(metadata)}
            };
            if (opts.include_docs) {
              doc.doc = data;
              doc.doc._rev = PouchMerge.winningRev(metadata);
              if (opts.conflicts) {
                doc.doc._conflicts = PouchMerge.collectConflicts(metadata);
              }
              for (var att in doc.doc._attachments) {
                doc.doc._attachments[att].stub = true;
              }
            }
            if ('keys' in opts) {
              if (opts.keys.indexOf(metadata.id) > -1) {
                if (PouchUtils.isDeleted(metadata)) {
                  doc.value.deleted = true;
                  doc.doc = null;
                }
                resultsMap[doc.id] = doc;
              }
            } else {
              if(!PouchUtils.isDeleted(metadata)) {
                results.push(doc);
              }
            }
          }
        }
      });
    }, unknownError(callback), function() {
      if ('keys' in opts) {
        opts.keys.forEach(function(key) {
          if (key in resultsMap) {
            results.push(resultsMap[key]);
          } else {
            results.push({"key": key, "error": "not_found"});
          }
        });
        if (opts.descending) {
          results.reverse();
        }
      }
      PouchUtils.call(callback, null, {
        total_rows: results.length,
        offset: opts.skip,
        rows: ('limit' in opts) ? results.slice(opts.skip, opts.limit + opts.skip) :
          (opts.skip > 0) ? results.slice(opts.skip) : results
      });
    });
  };

  api._changes = function idb_changes(opts) {

    if (Pouch.DEBUG) {
      console.log(name + ': Start Changes Feed: continuous=' + opts.continuous);
    }

    if (opts.continuous) {
      var id = name + ':' + Pouch.uuid();
      opts.cancelled = false;
      webSqlPouch.Changes.addListener(name, id, api, opts);
      webSqlPouch.Changes.notify(name);
      return {
        cancel: function() {
          if (Pouch.DEBUG) {
            console.log(name + ': Cancel Changes Feed');
          }
          opts.cancelled = true;
          webSqlPouch.Changes.removeListener(name, id);
        }
      };
    }

    var descending = opts.descending;

    // Ignore the `since` parameter when `descending` is true
    opts.since = opts.since && !descending ? opts.since : 0;

    var results = [];
    var txn;

    function fetchChanges() {
      var sql = 'SELECT ' + DOC_STORE + '.id, ' + BY_SEQ_STORE + '.seq, ' +
        BY_SEQ_STORE + '.json AS data, ' + DOC_STORE + '.json AS metadata FROM ' +
        BY_SEQ_STORE + ' JOIN ' + DOC_STORE + ' ON ' + BY_SEQ_STORE + '.seq = ' +
        DOC_STORE + '.winningseq WHERE ' + DOC_STORE + '.seq > ' + opts.since +
        ' ORDER BY ' + DOC_STORE + '.seq ' + (descending ? 'DESC' : 'ASC');

      db.transaction(function(tx) {
        tx.executeSql(sql, [], function(tx, result) {
          var last_seq = 0;
          for (var i = 0, l = result.rows.length; i < l; i++ ) {
            var res = result.rows.item(i);
            var metadata = JSON.parse(res.metadata);
            if (!PouchUtils.isLocalId(metadata.id)) {
              if (last_seq < res.seq) {
                last_seq = res.seq;
              }
              var doc = JSON.parse(res.data);
              var mainRev = doc._rev;
              var changeList = [{rev: mainRev}];
              if (opts.style === 'all_docs') {
                changeList = makeRevs(PouchMerge.collectLeaves(metadata.rev_tree));
              }
              var change = {
                id: metadata.id,
                seq: res.seq,
                changes: changeList,
                doc: doc
              };
              if (PouchUtils.isDeleted(metadata, mainRev)) {
                change.deleted = true;
              }
              if (opts.conflicts) {
                change.doc._conflicts = PouchMerge.collectConflicts(metadata);
              }
              results.push(change);
            }
          }
          PouchUtils.processChanges(opts, results, last_seq);
        });
      });
    }

    if (opts.filter && typeof opts.filter === 'string') {
      var filterName = opts.filter.split('/');
      api.get('_design/' + filterName[0], function(err, ddoc) {
        /*jshint evil: true */
        var filter = eval('(function() { return ' +
                          ddoc.filters[filterName[1]] + ' })()');
        opts.filter = filter;
        fetchChanges();
      });
    } else {
      fetchChanges();
    }
  };

  api._close = function(callback) {
    //WebSQL databases do not need to be closed
    PouchUtils.call(callback, null);
  };

  api._getAttachment = function(attachment, opts, callback) {
    var res;
    var tx = opts.ctx;
    var digest = attachment.digest;
    var type = attachment.content_type;
    var sql = 'SELECT body FROM ' + ATTACH_STORE + ' WHERE digest=?';
    tx.executeSql(sql, [digest], function(tx, result) {
      var data = result.rows.item(0).body;
      if (opts.encode) {
        res = btoa(data);
      } else {
        res = PouchUtils.createBlob([data], {type: type});
      }
      PouchUtils.call(callback, null, res);
    });
  };

  api._getRevisionTree = function(docId, callback) {
    db.transaction(function (tx) {
      var sql = 'SELECT json AS metadata FROM ' + DOC_STORE + ' WHERE id = ?';
      tx.executeSql(sql, [docId], function(tx, result) {
        if (!result.rows.length) {
          PouchUtils.call(callback, Pouch.Errors.MISSING_DOC);
        } else {
          var data = JSON.parse(result.rows.item(0).metadata);
          PouchUtils.call(callback, null, data.rev_tree);
        }
      });
    });
  };

  api._doCompaction = function(docId, rev_tree, revs, callback) {
    db.transaction(function (tx) {
      var sql = 'SELECT json AS metadata FROM ' + DOC_STORE + ' WHERE id = ?';
      tx.executeSql(sql, [docId], function(tx, result) {
        if (!result.rows.length) {
          return PouchUtils.call(callback);
        }
        var metadata = JSON.parse(result.rows.item(0).metadata);
        metadata.rev_tree = rev_tree;

        var sql = 'DELETE FROM ' + BY_SEQ_STORE + ' WHERE doc_id_rev IN (' +
          revs.map(function(rev){return quote(docId + '::' + rev);}).join(',') + ')';

        tx.executeSql(sql, [], function(tx, result) {
          var sql = 'UPDATE ' + DOC_STORE + ' SET json = ? WHERE id = ?';

          tx.executeSql(sql, [JSON.stringify(metadata), docId], function(tx, result) {
            callback();
          });
        });
      });
    });
  };

  return api;
};

webSqlPouch.valid = function() {
  return typeof window !== 'undefined' && !!window.openDatabase;
};

webSqlPouch.destroy = function(name, opts, callback) {
  var db = openDatabase(name, POUCH_VERSION, name, POUCH_SIZE);
  db.transaction(function (tx) {
    tx.executeSql('DROP TABLE IF EXISTS ' + DOC_STORE, []);
    tx.executeSql('DROP TABLE IF EXISTS ' + BY_SEQ_STORE, []);
    tx.executeSql('DROP TABLE IF EXISTS ' + ATTACH_STORE, []);
    tx.executeSql('DROP TABLE IF EXISTS ' + META_STORE, []);
  }, unknownError(callback), function() {
    PouchUtils.call(callback, null);
  });
};

webSqlPouch.Changes = new PouchUtils.Changes();

Pouch.adapter('websql', webSqlPouch);

/*global Pouch: true, pouchCollate: true */

"use strict";

var pouchCollate;
if (typeof module !== 'undefined' && module.exports) {
  pouchCollate = require('../pouch.collate.js');
}

// This is the first implementation of a basic plugin, we register the
// plugin object with pouch and it is mixin'd to each database created
// (regardless of adapter), adapters can override plugins by providing
// their own implementation. functions on the plugin object that start
// with _ are reserved function that are called by pouchdb for special
// notifications.

// If we wanted to store incremental views we can do it here by listening
// to the changes feed (keeping track of our last update_seq between page loads)
// and storing the result of the map function (possibly using the upcoming
// extracted adapter functions)

var MapReduce = function(db) {

  function viewQuery(fun, options) {
    if (!options.complete) {
      return;
    }

    if (!options.skip) {
      options.skip = 0;
    }

    if (!fun.reduce) {
      options.reduce = false;
    }

    function sum(values) {
      return values.reduce(function(a, b) { return a + b; }, 0);
    }

    var builtInReduce = {
      "_sum": function(keys, values){
        return sum(values);
      },

      "_count": function(keys, values, rereduce){
        if (rereduce){
          return sum(values);
        } else {
          return values.length;
        }
      },

      "_stats": function(keys, values, rereduce) {
        return {
          'sum': sum(values),
          'min': Math.min.apply(null, values),
          'max': Math.max.apply(null, values),
          'count': values.length,
          'sumsqr': (function(){
            var _sumsqr = 0;
            for(var idx in values) {
              if (typeof values[idx] === 'number') {
              _sumsqr += values[idx] * values[idx];
              }
            }
            return _sumsqr;
          })()
        };
      }
    };

    var results = [];
    var current = null;
    var num_started= 0;
    var completed= false;

    var emit = function(key, val) {
      var viewRow = {
        id: current.doc._id,
        key: key,
        value: val
      };

      if (options.startkey && pouchCollate(key, options.startkey) < 0) return;
      if (options.endkey && pouchCollate(key, options.endkey) > 0) return;
      if (options.key && pouchCollate(key, options.key) !== 0) return;

      num_started++;
      if (options.include_docs) {
        //in this special case, join on _id (issue #106)
        if (val && typeof val === 'object' && val._id){
          db.get(val._id,
              function(_, joined_doc){
                if (joined_doc) {
                  viewRow.doc = joined_doc;
                }
                results.push(viewRow);
                checkComplete();
              });
          return;
        } else {
          viewRow.doc = current.doc;
        }
      }
      results.push(viewRow);
    };

    // ugly way to make sure references to 'emit' in map/reduce bind to the
    // above emit
    eval('fun.map = ' + fun.map.toString() + ';');
    if (fun.reduce) {
      if (builtInReduce[fun.reduce]) {
        fun.reduce = builtInReduce[fun.reduce];
      }

      eval('fun.reduce = ' + fun.reduce.toString() + ';');
    }

    //only proceed once all documents are mapped and joined
    var checkComplete= function(){
      if (completed && results.length == num_started){
        results.sort(function(a, b) {
          return pouchCollate(a.key, b.key);
        });
        if (options.descending) {
          results.reverse();
        }
        if (options.reduce === false) {
          return options.complete(null, {
            total_rows: results.length,
            offset: options.skip,
            rows: ('limit' in options) ? results.slice(options.skip, options.limit + options.skip) :
              (options.skip > 0) ? results.slice(options.skip) : results
          });
        }

        var groups = [];
        results.forEach(function(e) {
          var last = groups[groups.length-1] || null;
          if (last && pouchCollate(last.key[0][0], e.key) === 0) {
            last.key.push([e.key, e.id]);
            last.value.push(e.value);
            return;
          }
          groups.push({key: [[e.key, e.id]], value: [e.value]});
        });
        groups.forEach(function(e) {
          e.value = fun.reduce(e.key, e.value);
          e.value = (typeof e.value === 'undefined') ? null : e.value;
          e.key = e.key[0][0];
        });

        options.complete(null, {
          total_rows: groups.length,
          offset: options.skip,
          rows: ('limit' in options) ? groups.slice(options.skip, options.limit + options.skip) :
            (options.skip > 0) ? groups.slice(options.skip) : groups
        });
      }
    };

    db.changes({
      conflicts: true,
      include_docs: true,
      onChange: function(doc) {
        if (!('deleted' in doc)) {
          current = {doc: doc.doc};
          fun.map.call(this, doc.doc);
        }
      },
      complete: function() {
        completed= true;
        checkComplete();
      }
    });
  }

  function httpQuery(fun, opts, callback) {

    // List of parameters to add to the PUT request
    var params = [];
    var body = undefined;
    var method = 'GET';

    // If opts.reduce exists and is defined, then add it to the list
    // of parameters.
    // If reduce=false then the results are that of only the map function
    // not the final result of map and reduce.
    if (typeof opts.reduce !== 'undefined') {
      params.push('reduce=' + opts.reduce);
    }
    if (typeof opts.include_docs !== 'undefined') {
      params.push('include_docs=' + opts.include_docs);
    }
    if (typeof opts.limit !== 'undefined') {
      params.push('limit=' + opts.limit);
    }
    if (typeof opts.descending !== 'undefined') {
      params.push('descending=' + opts.descending);
    }
    if (typeof opts.startkey !== 'undefined') {
      params.push('startkey=' + encodeURIComponent(JSON.stringify(opts.startkey)));
    }
    if (typeof opts.endkey !== 'undefined') {
      params.push('endkey=' + encodeURIComponent(JSON.stringify(opts.endkey)));
    }
    if (typeof opts.key !== 'undefined') {
      params.push('key=' + encodeURIComponent(JSON.stringify(opts.key)));
    }
    if (typeof opts.group !== 'undefined') {
      params.push('group=' + opts.group);
    }
    if (typeof opts.group_level !== 'undefined') {
      params.push('group_level=' + opts.group_level);
    }
    if (typeof opts.skip !== 'undefined') {
      params.push('skip=' + opts.skip);
    }

    // If keys are supplied, issue a POST request to circumvent GET query string limits
    // see http://wiki.apache.org/couchdb/HTTP_view_API#Querying_Options
    if (typeof opts.keys !== 'undefined') {
      method = 'POST';
      body = JSON.stringify({keys:opts.keys});
    }

    // Format the list of parameters into a valid URI query string
    params = params.join('&');
    params = params === '' ? '' : '?' + params;

    // We are referencing a query defined in the design doc
    if (typeof fun === 'string') {
      var parts = fun.split('/');
      db.request({
        method: method,
        url: '_design/' + parts[0] + '/_view/' + parts[1] + params,
        body: body
      }, callback);
      return;
    }

    // We are using a temporary view, terrible for performance but good for testing
    var queryObject = JSON.parse(JSON.stringify(fun, function(key, val) {
      if (typeof val === 'function') {
        return val + ''; // implicitly `toString` it
      }
      return val;
    }));

    db.request({
      method:'POST',
      url: '_temp_view' + params,
      body: queryObject
    }, callback);
  }

  function query(fun, opts, callback) {
    if (typeof opts === 'function') {
      callback = opts;
      opts = {};
    }

    if (callback) {
      opts.complete = callback;
    }

    if (db.type() === 'http') {
	  if (typeof fun === 'function'){
	    return httpQuery({map: fun}, opts, callback);
	  }
	  return httpQuery(fun, opts, callback);
    }

    if (typeof fun === 'object') {
      return viewQuery(fun, opts);
    }

    if (typeof fun === 'function') {
      return viewQuery({map: fun}, opts);
    }

    var parts = fun.split('/');
    db.get('_design/' + parts[0], function(err, doc) {
      if (err) {
        if (callback) callback(err);
        return;
      }

      if (!doc.views[parts[1]]) {
        if (callback) callback({ error: 'not_found', reason: 'missing_named_view' });
        return;
      }

      viewQuery({
        map: doc.views[parts[1]].map,
        reduce: doc.views[parts[1]].reduce
      }, opts);
    });
  }

  return {'query': query};
};

// Deletion is a noop since we dont store the results of the view
MapReduce._delete = function() { };

Pouch.plugin('mapreduce', MapReduce);

 })(this);
(function(n,t){function kt(n){var t=n.length,r=i.type(n);return i.isWindow(n)?!1:n.nodeType===1&&t?!0:r==="array"||r!=="function"&&(t===0||typeof t=="number"&&t>0&&t-1 in n)}function wu(n){var t=dt[n]={};return i.each(n.match(h)||[],function(n,i){t[i]=!0}),t}function c(){Object.defineProperty(this.cache={},0,{get:function(){return{}}});this.expando=i.expando+Math.random()}function yi(n,i,r){var u;if(r===t&&n.nodeType===1)if(u="data-"+i.replace(vi,"-$1").toLowerCase(),r=n.getAttribute(u),typeof r=="string"){try{r=r==="true"?!0:r==="false"?!1:r==="null"?null:+r+""===r?+r:ai.test(r)?JSON.parse(r):r}catch(e){}f.set(n,i,r)}else r=t;return r}function ht(){return!0}function p(){return!1}function ki(){try{return u.activeElement}catch(n){}}function gi(n,t){while((n=n[t])&&n.nodeType!==1);return n}function nr(n,t,r){if(i.isFunction(t))return i.grep(n,function(n,i){return!!t.call(n,i,n)!==r});if(t.nodeType)return i.grep(n,function(n){return n===t!==r});if(typeof t=="string"){if(tf.test(t))return i.filter(t,n,r);t=i.filter(t,n)}return i.grep(n,function(n){return et.call(t,n)>=0!==r})}function fr(n,t){return i.nodeName(n,"table")&&i.nodeName(t.nodeType===1?t:t.firstChild,"tr")?n.getElementsByTagName("tbody")[0]||n.appendChild(n.ownerDocument.createElement("tbody")):n}function hf(n){return n.type=(n.getAttribute("type")!==null)+"/"+n.type,n}function cf(n){var t=of.exec(n.type);return t?n.type=t[1]:n.removeAttribute("type"),n}function ni(n,t){for(var u=n.length,i=0;i<u;i++)r.set(n[i],"globalEval",!t||r.get(t[i],"globalEval"))}function er(n,t){var e,c,o,h,s,l,a,u;if(t.nodeType===1){if(r.hasData(n)&&(h=r.access(n),s=i.extend({},h),u=h.events,r.set(t,s),u)){delete s.handle;s.events={};for(o in u)for(e=0,c=u[o].length;e<c;e++)i.event.add(t,o,u[o][e])}f.hasData(n)&&(l=f.access(n),a=i.extend({},l),f.set(t,a))}}function s(n,r){var u=n.getElementsByTagName?n.getElementsByTagName(r||"*"):n.querySelectorAll?n.querySelectorAll(r||"*"):[];return r===t||r&&i.nodeName(n,r)?i.merge([n],u):u}function lf(n,t){var i=t.nodeName.toLowerCase();i==="input"&&rr.test(n.type)?t.checked=n.checked:(i==="input"||i==="textarea")&&(t.defaultValue=n.defaultValue)}function lr(n,t){if(t in n)return t;for(var r=t.charAt(0).toUpperCase()+t.slice(1),u=t,i=cr.length;i--;)if(t=cr[i]+r,t in n)return t;return u}function d(n,t){return n=t||n,i.css(n,"display")==="none"||!i.contains(n.ownerDocument,n)}function ct(t){return n.getComputedStyle(t,null)}function ar(n,t){for(var e,u,s,o=[],f=0,h=n.length;f<h;f++)(u=n[f],u.style)&&(o[f]=r.get(u,"olddisplay"),e=u.style.display,t?(o[f]||e!=="none"||(u.style.display=""),u.style.display===""&&d(u)&&(o[f]=r.access(u,"olddisplay",wf(u.nodeName)))):o[f]||(s=d(u),(e&&e!=="none"||!s)&&r.set(u,"olddisplay",s?e:i.css(u,"display"))));for(f=0;f<h;f++)(u=n[f],u.style)&&(t&&u.style.display!=="none"&&u.style.display!==""||(u.style.display=t?o[f]||"":"none"));return n}function vr(n,t,i){var r=vf.exec(t);return r?Math.max(0,r[1]-(i||0))+(r[2]||"px"):t}function yr(n,t,r,u,f){for(var e=r===(u?"border":"content")?4:t==="width"?1:0,o=0;e<4;e+=2)r==="margin"&&(o+=i.css(n,r+v[e],!0,f)),u?(r==="content"&&(o-=i.css(n,"padding"+v[e],!0,f)),r!=="margin"&&(o-=i.css(n,"border"+v[e]+"Width",!0,f))):(o+=i.css(n,"padding"+v[e],!0,f),r!=="padding"&&(o+=i.css(n,"border"+v[e]+"Width",!0,f)));return o}function pr(n,t,r){var e=!0,u=t==="width"?n.offsetWidth:n.offsetHeight,f=ct(n),o=i.support.boxSizing&&i.css(n,"boxSizing",!1,f)==="border-box";if(u<=0||u==null){if(u=w(n,t,f),(u<0||u==null)&&(u=n.style[t]),ti.test(u))return u;e=o&&(i.support.boxSizingReliable||u===n.style[t]);u=parseFloat(u)||0}return u+yr(n,t,r||(o?"border":"content"),e,f)+"px"}function wf(n){var r=u,t=sr[n];return t||(t=wr(n,r),t!=="none"&&t||(k=(k||i("<iframe frameborder='0' width='0' height='0'/>").css("cssText","display:block !important")).appendTo(r.documentElement),r=(k[0].contentWindow||k[0].contentDocument).document,r.write("<!doctype html><html><body>"),r.close(),t=wr(n,r),k.detach()),sr[n]=t),t}function wr(n,t){var r=i(t.createElement(n)).appendTo(t.body),u=i.css(r[0],"display");return r.remove(),u}function ii(n,t,r,u){var f;if(i.isArray(t))i.each(t,function(t,i){r||kf.test(n)?u(n,i):ii(n+"["+(typeof i=="object"?t:"")+"]",i,r,u)});else if(r||i.type(t)!=="object")u(n,t);else for(f in t)ii(n+"["+f+"]",t[f],r,u)}function iu(n){return function(t,r){typeof t!="string"&&(r=t,t="*");var u,f=0,e=t.toLowerCase().match(h)||[];if(i.isFunction(r))while(u=e[f++])u[0]==="+"?(u=u.slice(1)||"*",(n[u]=n[u]||[]).unshift(r)):(n[u]=n[u]||[]).push(r)}}function ru(n,t,r,u){function e(s){var h;return f[s]=!0,i.each(n[s]||[],function(n,i){var s=i(t,r,u);if(typeof s!="string"||o||f[s]){if(o)return!(h=s)}else return t.dataTypes.unshift(s),e(s),!1}),h}var f={},o=n===fi;return e(t.dataTypes[0])||!f["*"]&&e("*")}function ei(n,r){var u,f,e=i.ajaxSettings.flatOptions||{};for(u in r)r[u]!==t&&((e[u]?n:f||(f={}))[u]=r[u]);return f&&i.extend(!0,n,f),n}function ue(n,i,r){for(var o,f,e,s,h=n.contents,u=n.dataTypes;u[0]==="*";)u.shift(),o===t&&(o=n.mimeType||i.getResponseHeader("Content-Type"));if(o)for(f in h)if(h[f]&&h[f].test(o)){u.unshift(f);break}if(u[0]in r)e=u[0];else{for(f in r){if(!u[0]||n.converters[f+" "+u[0]]){e=f;break}s||(s=f)}e=e||s}if(e)return e!==u[0]&&u.unshift(e),r[e]}function fe(n,t,i,r){var h,u,f,s,e,o={},c=n.dataTypes.slice();if(c[1])for(f in n.converters)o[f.toLowerCase()]=n.converters[f];for(u=c.shift();u;)if(n.responseFields[u]&&(i[n.responseFields[u]]=t),!e&&r&&n.dataFilter&&(t=n.dataFilter(t,n.dataType)),e=u,u=c.shift(),u)if(u==="*")u=e;else if(e!=="*"&&e!==u){if(f=o[e+" "+u]||o["* "+u],!f)for(h in o)if(s=h.split(" "),s[1]===u&&(f=o[e+" "+s[0]]||o["* "+s[0]],f)){f===!0?f=o[h]:o[h]!==!0&&(u=s[0],c.unshift(s[1]));break}if(f!==!0)if(f&&n.throws)t=f(t);else try{t=f(t)}catch(l){return{state:"parsererror",error:f?l:"No conversion from "+e+" to "+u}}}return{state:"success",data:t}}function uu(){return setTimeout(function(){b=t}),b=i.now()}function le(n,t){i.each(t,function(t,i){for(var u=(tt[t]||[]).concat(tt["*"]),r=0,f=u.length;r<f;r++)if(u[r].call(n,t,i))return})}function fu(n,t,r){var e,o,s=0,l=vt.length,f=i.Deferred().always(function(){delete c.elem}),c=function(){if(o)return!1;for(var s=b||uu(),t=Math.max(0,u.startTime+u.duration-s),h=t/u.duration||0,i=1-h,r=0,e=u.tweens.length;r<e;r++)u.tweens[r].run(i);return f.notifyWith(n,[u,i,t]),i<1&&e?t:(f.resolveWith(n,[u]),!1)},u=f.promise({elem:n,props:i.extend({},t),opts:i.extend(!0,{specialEasing:{}},r),originalProperties:t,originalOptions:r,startTime:b||uu(),duration:r.duration,tweens:[],createTween:function(t,r){var f=i.Tween(n,u.opts,t,r,u.opts.specialEasing[t]||u.opts.easing);return u.tweens.push(f),f},stop:function(t){var i=0,r=t?u.tweens.length:0;if(o)return this;for(o=!0;i<r;i++)u.tweens[i].run(1);return t?f.resolveWith(n,[u,t]):f.rejectWith(n,[u,t]),this}}),h=u.props;for(ae(h,u.opts.specialEasing);s<l;s++)if(e=vt[s].call(u,n,h,u.opts),e)return e;return le(u,h),i.isFunction(u.opts.start)&&u.opts.start.call(n,u),i.fx.timer(i.extend(c,{elem:n,anim:u,queue:u.opts.queue})),u.progress(u.opts.progress).done(u.opts.done,u.opts.complete).fail(u.opts.fail).always(u.opts.always)}function ae(n,t){var r,f,e,u,o;for(r in n)if(f=i.camelCase(r),e=t[f],u=n[r],i.isArray(u)&&(e=u[1],u=n[r]=u[0]),r!==f&&(n[f]=u,delete n[r]),o=i.cssHooks[f],o&&"expand"in o){u=o.expand(u);delete n[f];for(r in u)r in n||(n[r]=u[r],t[r]=e)}else t[f]=e}function ve(n,u,f){var s,o,v,p,e,w,y,h,g,a=this,c=n.style,b={},k=[],l=n.nodeType&&d(n);f.queue||(h=i._queueHooks(n,"fx"),h.unqueued==null&&(h.unqueued=0,g=h.empty.fire,h.empty.fire=function(){h.unqueued||g()}),h.unqueued++,a.always(function(){a.always(function(){h.unqueued--;i.queue(n,"fx").length||h.empty.fire()})}));n.nodeType===1&&("height"in u||"width"in u)&&(f.overflow=[c.overflow,c.overflowX,c.overflowY],i.css(n,"display")==="inline"&&i.css(n,"float")==="none"&&(c.display="inline-block"));f.overflow&&(c.overflow="hidden",a.always(function(){c.overflow=f.overflow[0];c.overflowX=f.overflow[1];c.overflowY=f.overflow[2]}));e=r.get(n,"fxshow");for(s in u)if(v=u[s],se.exec(v)){if(delete u[s],w=w||v==="toggle",v===(l?"hide":"show"))if(v==="show"&&e!==t&&e[s]!==t)l=!0;else continue;k.push(s)}if(p=k.length,p)for(e=r.get(n,"fxshow")||r.access(n,"fxshow",{}),("hidden"in e)&&(l=e.hidden),w&&(e.hidden=!l),l?i(n).show():a.done(function(){i(n).hide()}),a.done(function(){var t;r.remove(n,"fxshow");for(t in b)i.style(n,t,b[t])}),s=0;s<p;s++)o=k[s],y=a.createTween(o,l?e[o]:0),b[o]=e[o]||i.style(n,o),o in e||(e[o]=y.start,l&&(y.end=y.start,y.start=o==="width"||o==="height"?1:0))}function e(n,t,i,r,u){return new e.prototype.init(n,t,i,r,u)}function yt(n,t){var r,i={height:n},u=0;for(t=t?1:0;u<4;u+=2-t)r=v[u],i["margin"+r]=i["padding"+r]=n;return t&&(i.opacity=i.width=n),i}function eu(n){return i.isWindow(n)?n:n.nodeType===9&&n.defaultView}var si,it,rt=typeof t,ou=n.location,u=n.document,hi=u.documentElement,su=n.jQuery,hu=n.$,ut={},ft=[],pt="2.0.0",ci=ft.concat,wt=ft.push,a=ft.slice,et=ft.indexOf,cu=ut.toString,bt=ut.hasOwnProperty,lu=pt.trim,i=function(n,t){return new i.fn.init(n,t,si)},ot=/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,h=/\S+/g,au=/^(?:(<[\w\W]+>)[^>]*|#([\w-]*))$/,li=/^<(\w+)\s*\/?>(?:<\/\1>|)$/,vu=/^-ms-/,yu=/-([\da-z])/gi,pu=function(n,t){return t.toUpperCase()},st=function(){u.removeEventListener("DOMContentLoaded",st,!1);n.removeEventListener("load",st,!1);i.ready()},dt,f,r,ai,vi,oi,lt;i.fn=i.prototype={jquery:pt,constructor:i,init:function(n,r,f){var e,o;if(!n)return this;if(typeof n=="string"){if(e=n.charAt(0)==="<"&&n.charAt(n.length-1)===">"&&n.length>=3?[null,n,null]:au.exec(n),e&&(e[1]||!r)){if(e[1]){if(r=r instanceof i?r[0]:r,i.merge(this,i.parseHTML(e[1],r&&r.nodeType?r.ownerDocument||r:u,!0)),li.test(e[1])&&i.isPlainObject(r))for(e in r)i.isFunction(this[e])?this[e](r[e]):this.attr(e,r[e]);return this}return o=u.getElementById(e[2]),o&&o.parentNode&&(this.length=1,this[0]=o),this.context=u,this.selector=n,this}return!r||r.jquery?(r||f).find(n):this.constructor(r).find(n)}return n.nodeType?(this.context=this[0]=n,this.length=1,this):i.isFunction(n)?f.ready(n):(n.selector!==t&&(this.selector=n.selector,this.context=n.context),i.makeArray(n,this))},selector:"",length:0,toArray:function(){return a.call(this)},get:function(n){return n==null?this.toArray():n<0?this[this.length+n]:this[n]},pushStack:function(n){var t=i.merge(this.constructor(),n);return t.prevObject=this,t.context=this.context,t},each:function(n,t){return i.each(this,n,t)},ready:function(n){return i.ready.promise().done(n),this},slice:function(){return this.pushStack(a.apply(this,arguments))},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},eq:function(n){var i=this.length,t=+n+(n<0?i:0);return this.pushStack(t>=0&&t<i?[this[t]]:[])},map:function(n){return this.pushStack(i.map(this,function(t,i){return n.call(t,i,t)}))},end:function(){return this.prevObject||this.constructor(null)},push:wt,sort:[].sort,splice:[].splice};i.fn.init.prototype=i.fn;i.extend=i.fn.extend=function(){var o,e,u,r,s,h,n=arguments[0]||{},f=1,l=arguments.length,c=!1;for(typeof n=="boolean"&&(c=n,n=arguments[1]||{},f=2),typeof n=="object"||i.isFunction(n)||(n={}),l===f&&(n=this,--f);f<l;f++)if((o=arguments[f])!=null)for(e in o)(u=n[e],r=o[e],n!==r)&&(c&&r&&(i.isPlainObject(r)||(s=i.isArray(r)))?(s?(s=!1,h=u&&i.isArray(u)?u:[]):h=u&&i.isPlainObject(u)?u:{},n[e]=i.extend(c,h,r)):r!==t&&(n[e]=r));return n};i.extend({expando:"jQuery"+(pt+Math.random()).replace(/\D/g,""),noConflict:function(t){return n.$===i&&(n.$=hu),t&&n.jQuery===i&&(n.jQuery=su),i},isReady:!1,readyWait:1,holdReady:function(n){n?i.readyWait++:i.ready(!0)},ready:function(n){(n===!0?--i.readyWait:i.isReady)||(i.isReady=!0,n!==!0&&--i.readyWait>0)||(it.resolveWith(u,[i]),i.fn.trigger&&i(u).trigger("ready").off("ready"))},isFunction:function(n){return i.type(n)==="function"},isArray:Array.isArray,isWindow:function(n){return n!=null&&n===n.window},isNumeric:function(n){return!isNaN(parseFloat(n))&&isFinite(n)},type:function(n){return n==null?String(n):typeof n=="object"||typeof n=="function"?ut[cu.call(n)]||"object":typeof n},isPlainObject:function(n){if(i.type(n)!=="object"||n.nodeType||i.isWindow(n))return!1;try{if(n.constructor&&!bt.call(n.constructor.prototype,"isPrototypeOf"))return!1}catch(t){return!1}return!0},isEmptyObject:function(n){for(var t in n)return!1;return!0},error:function(n){throw new Error(n);},parseHTML:function(n,t,r){if(!n||typeof n!="string")return null;typeof t=="boolean"&&(r=t,t=!1);t=t||u;var f=li.exec(n),e=!r&&[];return f?[t.createElement(f[1])]:(f=i.buildFragment([n],t,e),e&&i(e).remove(),i.merge([],f.childNodes))},parseJSON:JSON.parse,parseXML:function(n){var r,u;if(!n||typeof n!="string")return null;try{u=new DOMParser;r=u.parseFromString(n,"text/xml")}catch(f){r=t}return(!r||r.getElementsByTagName("parsererror").length)&&i.error("Invalid XML: "+n),r},noop:function(){},globalEval:function(n){var t,r=eval;n=i.trim(n);n&&(n.indexOf("use strict")===1?(t=u.createElement("script"),t.text=n,u.head.appendChild(t).parentNode.removeChild(t)):r(n))},camelCase:function(n){return n.replace(vu,"ms-").replace(yu,pu)},nodeName:function(n,t){return n.nodeName&&n.nodeName.toLowerCase()===t.toLowerCase()},each:function(n,t,i){var u,r=0,f=n.length,e=kt(n);if(i){if(e){for(;r<f;r++)if(u=t.apply(n[r],i),u===!1)break}else for(r in n)if(u=t.apply(n[r],i),u===!1)break}else if(e){for(;r<f;r++)if(u=t.call(n[r],r,n[r]),u===!1)break}else for(r in n)if(u=t.call(n[r],r,n[r]),u===!1)break;return n},trim:function(n){return n==null?"":lu.call(n)},makeArray:function(n,t){var r=t||[];return n!=null&&(kt(Object(n))?i.merge(r,typeof n=="string"?[n]:n):wt.call(r,n)),r},inArray:function(n,t,i){return t==null?-1:et.call(t,n,i)},merge:function(n,i){var f=i.length,u=n.length,r=0;if(typeof f=="number")for(;r<f;r++)n[u++]=i[r];else while(i[r]!==t)n[u++]=i[r++];return n.length=u,n},grep:function(n,t,i){var u,f=[],r=0,e=n.length;for(i=!!i;r<e;r++)u=!!t(n[r],r),i!==u&&f.push(n[r]);return f},map:function(n,t,i){var u,r=0,e=n.length,o=kt(n),f=[];if(o)for(;r<e;r++)u=t(n[r],r,i),u!=null&&(f[f.length]=u);else for(r in n)u=t(n[r],r,i),u!=null&&(f[f.length]=u);return ci.apply([],f)},guid:1,proxy:function(n,r){var f,e,u;return(typeof r=="string"&&(f=n[r],r=n,n=f),!i.isFunction(n))?t:(e=a.call(arguments,2),u=function(){return n.apply(r||this,e.concat(a.call(arguments)))},u.guid=n.guid=n.guid||i.guid++,u)},access:function(n,r,u,f,e,o,s){var h=0,l=n.length,c=u==null;if(i.type(u)==="object"){e=!0;for(h in u)i.access(n,r,h,u[h],!0,o,s)}else if(f!==t&&(e=!0,i.isFunction(f)||(s=!0),c&&(s?(r.call(n,f),r=null):(c=r,r=function(n,t,r){return c.call(i(n),r)})),r))for(;h<l;h++)r(n[h],u,s?f:f.call(n[h],h,r(n[h],u)));return e?n:c?r.call(n):l?r(n[0],u):o},now:Date.now,swap:function(n,t,i,r){var f,u,e={};for(u in t)e[u]=n.style[u],n.style[u]=t[u];f=i.apply(n,r||[]);for(u in t)n.style[u]=e[u];return f}});i.ready.promise=function(t){return it||(it=i.Deferred(),u.readyState==="complete"?setTimeout(i.ready):(u.addEventListener("DOMContentLoaded",st,!1),n.addEventListener("load",st,!1))),it.promise(t)};i.each("Boolean Number String Function Array Date RegExp Object Error".split(" "),function(n,t){ut["[object "+t+"]"]=t.toLowerCase()});si=i(u),function(n,t){function ii(n){return fr.test(n+"")}function ri(){var n,t=[];return n=function(i,u){return t.push(i+=" ")>r.cacheLength&&delete n[t.shift()],n[i]=u}}function l(n){return n[o]=!0,n}function v(n){var t=s.createElement("div");try{return!!n(t)}catch(i){return!1}finally{t.parentNode&&t.parentNode.removeChild(t);t=null}}function u(n,t,i,r){var p,u,f,a,w,v,k,l,g,d;if((t?t.ownerDocument||t:y)!==s&&ft(t),t=t||s,i=i||[],!n||typeof n!="string")return i;if((a=t.nodeType)!==1&&a!==9)return[];if(c&&!r){if(p=er.exec(n))if(f=p[1]){if(a===9)if(u=t.getElementById(f),u&&u.parentNode){if(u.id===f)return i.push(u),i}else return i;else if(t.ownerDocument&&(u=t.ownerDocument.getElementById(f))&&ot(t,u)&&u.id===f)return i.push(u),i}else{if(p[2])return b.apply(i,t.getElementsByTagName(n)),i;if((f=p[3])&&e.getElementsByClassName&&t.getElementsByClassName)return b.apply(i,t.getElementsByClassName(f)),i}if(e.qsa&&(!h||!h.test(n))){if(l=k=o,g=t,d=a===9&&n,a===1&&t.nodeName.toLowerCase()!=="object"){for(v=wt(n),(k=t.getAttribute("id"))?l=k.replace(hr,"\\$&"):t.setAttribute("id",l),l="[id='"+l+"'] ",w=v.length;w--;)v[w]=l+bt(v[w]);g=ti.test(n)&&t.parentNode||t;d=v.join(",")}if(d)try{return b.apply(i,g.querySelectorAll(d)),i}catch(nt){}finally{k||t.removeAttribute("id")}}}return wr(n.replace(yt,"$1"),t,i,r)}function wi(n,t){var i=t&&n,r=i&&(~t.sourceIndex||ai)-(~n.sourceIndex||ai);if(r)return r;if(i)while(i=i.nextSibling)if(i===t)return-1;return n?1:-1}function cr(n,i,r){var u;return r?t:(u=n.getAttributeNode(i))&&u.specified?u.value:n[i]===!0?i.toLowerCase():null}function lr(n,i,r){var u;return r?t:u=n.getAttribute(i,i.toLowerCase()==="type"?1:2)}function ar(n){return function(t){var i=t.nodeName.toLowerCase();return i==="input"&&t.type===n}}function vr(n){return function(t){var i=t.nodeName.toLowerCase();return(i==="input"||i==="button")&&t.type===n}}function rt(n){return l(function(t){return t=+t,l(function(i,r){for(var u,f=n([],i.length,t),e=f.length;e--;)i[u=f[e]]&&(i[u]=!(r[u]=i[u]))})})}function wt(n,t){var e,f,s,o,i,h,c,l=ci[n+" "];if(l)return t?0:l.slice(0);for(i=n,h=[],c=r.preFilter;i;){(!e||(f=nr.exec(i)))&&(f&&(i=i.slice(f[0].length)||i),h.push(s=[]));e=!1;(f=tr.exec(i))&&(e=f.shift(),s.push({value:e,type:f[0].replace(yt," ")}),i=i.slice(e.length));for(o in r.filter)(f=pt[o].exec(i))&&(!c[o]||(f=c[o](f)))&&(e=f.shift(),s.push({value:e,type:o,matches:f}),i=i.slice(e.length));if(!e)break}return t?i.length:i?u.error(n):ci(n,h).slice(0)}function bt(n){for(var t=0,r=n.length,i="";t<r;t++)i+=n[t].value;return i}function ui(n,t,i){var r=t.dir,u=i&&r==="parentNode",f=ki++;return t.first?function(t,i,f){while(t=t[r])if(t.nodeType===1||u)return n(t,i,f)}:function(t,i,e){var h,s,c,l=p+" "+f;if(e){while(t=t[r])if((t.nodeType===1||u)&&n(t,i,e))return!0}else while(t=t[r])if(t.nodeType===1||u)if(c=t[o]||(t[o]={}),(s=c[r])&&s[0]===l){if((h=s[1])===!0||h===ht)return h===!0}else if(s=c[r]=[l],s[1]=n(t,i,e)||ht,s[1]===!0)return!0}}function fi(n){return n.length>1?function(t,i,r){for(var u=n.length;u--;)if(!n[u](t,i,r))return!1;return!0}:n[0]}function kt(n,t,i,r,u){for(var e,o=[],f=0,s=n.length,h=t!=null;f<s;f++)(e=n[f])&&(!i||i(e,r,u))&&(o.push(e),h&&t.push(f));return o}function ei(n,t,i,r,u,f){return r&&!r[o]&&(r=ei(r)),u&&!u[o]&&(u=ei(u,f)),l(function(f,e,o,s){var l,c,a,p=[],y=[],w=e.length,k=f||pr(t||"*",o.nodeType?[o]:o,[]),v=n&&(f||!t)?kt(k,p,n,o,s):k,h=i?u||(f?n:w||r)?[]:e:v;if(i&&i(v,h,o,s),r)for(l=kt(h,y),r(l,[],o,s),c=l.length;c--;)(a=l[c])&&(h[y[c]]=!(v[y[c]]=a));if(f){if(u||n){if(u){for(l=[],c=h.length;c--;)(a=h[c])&&l.push(v[c]=a);u(null,h=[],l,s)}for(c=h.length;c--;)(a=h[c])&&(l=u?it.call(f,a):p[c])>-1&&(f[l]=!(e[l]=a))}}else h=kt(h===e?h.splice(w,h.length):h),u?u(null,e,h,s):b.apply(e,h)})}function oi(n){for(var s,u,i,e=n.length,h=r.relative[n[0].type],c=h||r.relative[" "],t=h?1:0,l=ui(function(n){return n===s},c,!0),a=ui(function(n){return it.call(s,n)>-1},c,!0),f=[function(n,t,i){return!h&&(i||t!==lt)||((s=t).nodeType?l(n,t,i):a(n,t,i))}];t<e;t++)if(u=r.relative[n[t].type])f=[ui(fi(f),u)];else{if(u=r.filter[n[t].type].apply(null,n[t].matches),u[o]){for(i=++t;i<e;i++)if(r.relative[n[i].type])break;return ei(t>1&&fi(f),t>1&&bt(n.slice(0,t-1)).replace(yt,"$1"),u,t<i&&oi(n.slice(t,i)),i<e&&oi(n=n.slice(i)),i<e&&bt(n))}f.push(u)}return fi(f)}function yr(n,t){var f=0,i=t.length>0,e=n.length>0,o=function(o,h,c,l,a){var y,g,k,w=[],d=0,v="0",nt=o&&[],tt=a!=null,it=lt,ut=o||e&&r.find.TAG("*",a&&h.parentNode||h),rt=p+=it==null?1:Math.random()||.1;for(tt&&(lt=h!==s&&h,ht=f);(y=ut[v])!=null;v++){if(e&&y){for(g=0;k=n[g++];)if(k(y,h,c)){l.push(y);break}tt&&(p=rt,ht=++f)}i&&((y=!k&&y)&&d--,o&&nt.push(y))}if(d+=v,i&&v!==d){for(g=0;k=t[g++];)k(nt,w,h,c);if(o){if(d>0)while(v--)nt[v]||w[v]||(w[v]=di.call(l));w=kt(w)}b.apply(l,w);tt&&!o&&w.length>0&&d+t.length>1&&u.uniqueSort(l)}return tt&&(p=rt,lt=it),nt};return i?l(o):o}function pr(n,t,i){for(var r=0,f=t.length;r<f;r++)u(n,t[r],i);return i}function wr(n,t,i,u){var o,f,e,h,l,s=wt(n);if(!u&&s.length===1){if(f=s[0]=s[0].slice(0),f.length>2&&(e=f[0]).type==="ID"&&t.nodeType===9&&c&&r.relative[f[1].type]){if(t=(r.find.ID(e.matches[0].replace(k,d),t)||[])[0],!t)return i;n=n.slice(f.shift().value.length)}for(o=pt.needsContext.test(n)?0:f.length;o--;){if(e=f[o],r.relative[h=e.type])break;if((l=r.find[h])&&(u=l(e.matches[0].replace(k,d),ti.test(f[0].type)&&t.parentNode||t))){if(f.splice(o,1),n=u.length&&bt(f),!n)return b.apply(i,u),i;break}}}return dt(n,s)(u,t,!c,i,ti.test(n)),i}function bi(){}var ut,ht,r,ct,si,dt,lt,g,ft,s,a,c,h,nt,at,ot,o="sizzle"+-new Date,y=n.document,e={},p=0,ki=0,hi=ri(),ci=ri(),li=ri(),st=!1,vt=function(){return 0},tt=typeof t,ai=-2147483648,w=[],di=w.pop,gi=w.push,b=w.push,vi=w.slice,it=w.indexOf||function(n){for(var t=0,i=this.length;t<i;t++)if(this[t]===n)return t;return-1},gt="checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",f="[\\x20\\t\\r\\n\\f]",et="(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",yi=et.replace("w","w#"),pi="\\["+f+"*("+et+")"+f+"*(?:([*^$|!~]?=)"+f+"*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|("+yi+")|)|)"+f+"*\\]",ni=":("+et+")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|"+pi.replace(3,8)+")*)|.*)\\)|)",yt=new RegExp("^"+f+"+|((?:^|[^\\\\])(?:\\\\.)*)"+f+"+$","g"),nr=new RegExp("^"+f+"*,"+f+"*"),tr=new RegExp("^"+f+"*([>+~]|"+f+")"+f+"*"),ti=new RegExp(f+"*[+~]"),ir=new RegExp("="+f+"*([^\\]'\"]*)"+f+"*\\]","g"),rr=new RegExp(ni),ur=new RegExp("^"+yi+"$"),pt={ID:new RegExp("^#("+et+")"),CLASS:new RegExp("^\\.("+et+")"),TAG:new RegExp("^("+et.replace("w","w*")+")"),ATTR:new RegExp("^"+pi),PSEUDO:new RegExp("^"+ni),CHILD:new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\("+f+"*(even|odd|(([+-]|)(\\d*)n|)"+f+"*(?:([+-]|)"+f+"*(\\d+)|))"+f+"*\\)|)","i"),boolean:new RegExp("^(?:"+gt+")$","i"),needsContext:new RegExp("^"+f+"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\("+f+"*((?:-\\d)?\\d*)"+f+"*\\)|)(?=[^-]|$)","i")},fr=/^[^{]+\{\s*\[native \w/,er=/^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,or=/^(?:input|select|textarea|button)$/i,sr=/^h\d$/i,hr=/'|\\/g,k=/\\([\da-fA-F]{1,6}[\x20\t\r\n\f]?|.)/g,d=function(n,t){var i="0x"+t-65536;return i!==i?t:i<0?String.fromCharCode(i+65536):String.fromCharCode(i>>10|55296,i&1023|56320)};try{b.apply(w=vi.call(y.childNodes),y.childNodes);w[y.childNodes.length].nodeType}catch(br){b={apply:w.length?function(n,t){gi.apply(n,vi.call(t))}:function(n,t){for(var i=n.length,r=0;n[i++]=t[r++];);n.length=i-1}}}si=u.isXML=function(n){var t=n&&(n.ownerDocument||n).documentElement;return t?t.nodeName!=="HTML":!1};ft=u.setDocument=function(n){var i=n?n.ownerDocument||n:y;return i===s||i.nodeType!==9||!i.documentElement?s:(s=i,a=i.documentElement,c=!si(i),e.getElementsByTagName=v(function(n){return n.appendChild(i.createComment("")),!n.getElementsByTagName("*").length}),e.attributes=v(function(n){return n.className="i",!n.getAttribute("className")}),e.getElementsByClassName=v(function(n){return n.innerHTML="<div class='a'><\/div><div class='a i'><\/div>",n.firstChild.className="i",n.getElementsByClassName("i").length===2}),e.sortDetached=v(function(n){return n.compareDocumentPosition(s.createElement("div"))&1}),e.getById=v(function(n){return a.appendChild(n).id=o,!i.getElementsByName||!i.getElementsByName(o).length}),e.getById?(r.find.ID=function(n,t){if(typeof t.getElementById!==tt&&c){var i=t.getElementById(n);return i&&i.parentNode?[i]:[]}},r.filter.ID=function(n){var t=n.replace(k,d);return function(n){return n.getAttribute("id")===t}}):(r.find.ID=function(n,i){if(typeof i.getElementById!==tt&&c){var r=i.getElementById(n);return r?r.id===n||typeof r.getAttributeNode!==tt&&r.getAttributeNode("id").value===n?[r]:t:[]}},r.filter.ID=function(n){var t=n.replace(k,d);return function(n){var i=typeof n.getAttributeNode!==tt&&n.getAttributeNode("id");return i&&i.value===t}}),r.find.TAG=e.getElementsByTagName?function(n,t){if(typeof t.getElementsByTagName!==tt)return t.getElementsByTagName(n)}:function(n,t){var i,r=[],f=0,u=t.getElementsByTagName(n);if(n==="*"){while(i=u[f++])i.nodeType===1&&r.push(i);return r}return u},r.find.CLASS=e.getElementsByClassName&&function(n,t){if(typeof t.getElementsByClassName!==tt&&c)return t.getElementsByClassName(n)},nt=[],h=[],(e.qsa=ii(i.querySelectorAll))&&(v(function(n){n.innerHTML="<select><option selected=''><\/option><\/select>";n.querySelectorAll("[selected]").length||h.push("\\["+f+"*(?:value|"+gt+")");n.querySelectorAll(":checked").length||h.push(":checked")}),v(function(n){var t=s.createElement("input");t.setAttribute("type","hidden");n.appendChild(t).setAttribute("t","");n.querySelectorAll("[t^='']").length&&h.push("[*^$]="+f+"*(?:''|\"\")");n.querySelectorAll(":enabled").length||h.push(":enabled",":disabled");n.querySelectorAll("*,:x");h.push(",.*:")})),(e.matchesSelector=ii(at=a.webkitMatchesSelector||a.mozMatchesSelector||a.oMatchesSelector||a.msMatchesSelector))&&v(function(n){e.disconnectedMatch=at.call(n,"div");at.call(n,"[s!='']:x");nt.push("!=",ni)}),h=h.length&&new RegExp(h.join("|")),nt=nt.length&&new RegExp(nt.join("|")),ot=ii(a.contains)||a.compareDocumentPosition?function(n,t){var r=n.nodeType===9?n.documentElement:n,i=t&&t.parentNode;return n===i||!!(i&&i.nodeType===1&&(r.contains?r.contains(i):n.compareDocumentPosition&&n.compareDocumentPosition(i)&16))}:function(n,t){if(t)while(t=t.parentNode)if(t===n)return!0;return!1},vt=a.compareDocumentPosition?function(n,t){if(n===t)return st=!0,0;var r=t.compareDocumentPosition&&n.compareDocumentPosition&&n.compareDocumentPosition(t);return r?r&1||!e.sortDetached&&t.compareDocumentPosition(n)===r?n===i||ot(y,n)?-1:t===i||ot(y,t)?1:g?it.call(g,n)-it.call(g,t):0:r&4?-1:1:n.compareDocumentPosition?-1:1}:function(n,t){var r,u=0,o=n.parentNode,s=t.parentNode,f=[n],e=[t];if(n===t)return st=!0,0;if(o&&s){if(o===s)return wi(n,t)}else return n===i?-1:t===i?1:o?-1:s?1:g?it.call(g,n)-it.call(g,t):0;for(r=n;r=r.parentNode;)f.unshift(r);for(r=t;r=r.parentNode;)e.unshift(r);while(f[u]===e[u])u++;return u?wi(f[u],e[u]):f[u]===y?-1:e[u]===y?1:0},s)};u.matches=function(n,t){return u(n,null,null,t)};u.matchesSelector=function(n,t){if((n.ownerDocument||n)!==s&&ft(n),t=t.replace(ir,"='$1']"),e.matchesSelector&&c&&(!nt||!nt.test(t))&&(!h||!h.test(t)))try{var i=at.call(n,t);if(i||e.disconnectedMatch||n.document&&n.document.nodeType!==11)return i}catch(r){}return u(t,s,null,[n]).length>0};u.contains=function(n,t){return(n.ownerDocument||n)!==s&&ft(n),ot(n,t)};u.attr=function(n,i){(n.ownerDocument||n)!==s&&ft(n);var f=r.attrHandle[i.toLowerCase()],u=f&&f(n,i,!c);return u===t?e.attributes||!c?n.getAttribute(i):(u=n.getAttributeNode(i))&&u.specified?u.value:null:u};u.error=function(n){throw new Error("Syntax error, unrecognized expression: "+n);};u.uniqueSort=function(n){var r,u=[],t=0,i=0;if(st=!e.detectDuplicates,g=!e.sortStable&&n.slice(0),n.sort(vt),st){while(r=n[i++])r===n[i]&&(t=u.push(i));while(t--)n.splice(u[t],1)}return n};ct=u.getText=function(n){var r,i="",u=0,t=n.nodeType;if(t){if(t===1||t===9||t===11){if(typeof n.textContent=="string")return n.textContent;for(n=n.firstChild;n;n=n.nextSibling)i+=ct(n)}else if(t===3||t===4)return n.nodeValue}else for(;r=n[u];u++)i+=ct(r);return i};r=u.selectors={cacheLength:50,createPseudo:l,match:pt,attrHandle:{},find:{},relative:{">":{dir:"parentNode",first:!0}," ":{dir:"parentNode"},"+":{dir:"previousSibling",first:!0},"~":{dir:"previousSibling"}},preFilter:{ATTR:function(n){return n[1]=n[1].replace(k,d),n[3]=(n[4]||n[5]||"").replace(k,d),n[2]==="~="&&(n[3]=" "+n[3]+" "),n.slice(0,4)},CHILD:function(n){return n[1]=n[1].toLowerCase(),n[1].slice(0,3)==="nth"?(n[3]||u.error(n[0]),n[4]=+(n[4]?n[5]+(n[6]||1):2*(n[3]==="even"||n[3]==="odd")),n[5]=+(n[7]+n[8]||n[3]==="odd")):n[3]&&u.error(n[0]),n},PSEUDO:function(n){var i,t=!n[5]&&n[2];return pt.CHILD.test(n[0])?null:(n[4]?n[2]=n[4]:t&&rr.test(t)&&(i=wt(t,!0))&&(i=t.indexOf(")",t.length-i)-t.length)&&(n[0]=n[0].slice(0,i),n[2]=t.slice(0,i)),n.slice(0,3))}},filter:{TAG:function(n){var t=n.replace(k,d).toLowerCase();return n==="*"?function(){return!0}:function(n){return n.nodeName&&n.nodeName.toLowerCase()===t}},CLASS:function(n){var t=hi[n+" "];return t||(t=new RegExp("(^|"+f+")"+n+"("+f+"|$)"))&&hi(n,function(n){return t.test(typeof n.className=="string"&&n.className||typeof n.getAttribute!==tt&&n.getAttribute("class")||"")})},ATTR:function(n,t,i){return function(r){var f=u.attr(r,n);return f==null?t==="!=":t?(f+="",t==="="?f===i:t==="!="?f!==i:t==="^="?i&&f.indexOf(i)===0:t==="*="?i&&f.indexOf(i)>-1:t==="$="?i&&f.slice(-i.length)===i:t==="~="?(" "+f+" ").indexOf(i)>-1:t==="|="?f===i||f.slice(0,i.length+1)===i+"-":!1):!0}},CHILD:function(n,t,i,r,u){var s=n.slice(0,3)!=="nth",e=n.slice(-4)!=="last",f=t==="of-type";return r===1&&u===0?function(n){return!!n.parentNode}:function(t,i,h){var a,k,c,l,v,w,b=s!==e?"nextSibling":"previousSibling",y=t.parentNode,g=f&&t.nodeName.toLowerCase(),d=!h&&!f;if(y){if(s){while(b){for(c=t;c=c[b];)if(f?c.nodeName.toLowerCase()===g:c.nodeType===1)return!1;w=b=n==="only"&&!w&&"nextSibling"}return!0}if(w=[e?y.firstChild:y.lastChild],e&&d){for(k=y[o]||(y[o]={}),a=k[n]||[],v=a[0]===p&&a[1],l=a[0]===p&&a[2],c=v&&y.childNodes[v];c=++v&&c&&c[b]||(l=v=0)||w.pop();)if(c.nodeType===1&&++l&&c===t){k[n]=[p,v,l];break}}else if(d&&(a=(t[o]||(t[o]={}))[n])&&a[0]===p)l=a[1];else while(c=++v&&c&&c[b]||(l=v=0)||w.pop())if((f?c.nodeName.toLowerCase()===g:c.nodeType===1)&&++l&&(d&&((c[o]||(c[o]={}))[n]=[p,l]),c===t))break;return l-=u,l===r||l%r==0&&l/r>=0}}},PSEUDO:function(n,t){var f,i=r.pseudos[n]||r.setFilters[n.toLowerCase()]||u.error("unsupported pseudo: "+n);return i[o]?i(t):i.length>1?(f=[n,n,"",t],r.setFilters.hasOwnProperty(n.toLowerCase())?l(function(n,r){for(var u,f=i(n,t),e=f.length;e--;)u=it.call(n,f[e]),n[u]=!(r[u]=f[e])}):function(n){return i(n,0,f)}):i}},pseudos:{not:l(function(n){var i=[],r=[],t=dt(n.replace(yt,"$1"));return t[o]?l(function(n,i,r,u){for(var e,o=t(n,null,u,[]),f=n.length;f--;)(e=o[f])&&(n[f]=!(i[f]=e))}):function(n,u,f){return i[0]=n,t(i,null,f,r),!r.pop()}}),has:l(function(n){return function(t){return u(n,t).length>0}}),contains:l(function(n){return function(t){return(t.textContent||t.innerText||ct(t)).indexOf(n)>-1}}),lang:l(function(n){return ur.test(n||"")||u.error("unsupported lang: "+n),n=n.replace(k,d).toLowerCase(),function(t){var i;do if(i=c?t.lang:t.getAttribute("xml:lang")||t.getAttribute("lang"))return i=i.toLowerCase(),i===n||i.indexOf(n+"-")===0;while((t=t.parentNode)&&t.nodeType===1);return!1}}),target:function(t){var i=n.location&&n.location.hash;return i&&i.slice(1)===t.id},root:function(n){return n===a},focus:function(n){return n===s.activeElement&&(!s.hasFocus||s.hasFocus())&&!!(n.type||n.href||~n.tabIndex)},enabled:function(n){return n.disabled===!1},disabled:function(n){return n.disabled===!0},checked:function(n){var t=n.nodeName.toLowerCase();return t==="input"&&!!n.checked||t==="option"&&!!n.selected},selected:function(n){return n.parentNode&&n.parentNode.selectedIndex,n.selected===!0},empty:function(n){for(n=n.firstChild;n;n=n.nextSibling)if(n.nodeName>"@"||n.nodeType===3||n.nodeType===4)return!1;return!0},parent:function(n){return!r.pseudos.empty(n)},header:function(n){return sr.test(n.nodeName)},input:function(n){return or.test(n.nodeName)},button:function(n){var t=n.nodeName.toLowerCase();return t==="input"&&n.type==="button"||t==="button"},text:function(n){var t;return n.nodeName.toLowerCase()==="input"&&n.type==="text"&&((t=n.getAttribute("type"))==null||t.toLowerCase()===n.type)},first:rt(function(){return[0]}),last:rt(function(n,t){return[t-1]}),eq:rt(function(n,t,i){return[i<0?i+t:i]}),even:rt(function(n,t){for(var i=0;i<t;i+=2)n.push(i);return n}),odd:rt(function(n,t){for(var i=1;i<t;i+=2)n.push(i);return n}),lt:rt(function(n,t,i){for(var r=i<0?i+t:i;--r>=0;)n.push(r);return n}),gt:rt(function(n,t,i){for(var r=i<0?i+t:i;++r<t;)n.push(r);return n})}};for(ut in{radio:!0,checkbox:!0,file:!0,password:!0,image:!0})r.pseudos[ut]=ar(ut);for(ut in{submit:!0,reset:!0})r.pseudos[ut]=vr(ut);dt=u.compile=function(n,t){var r,u=[],f=[],i=li[n+" "];if(!i){for(t||(t=wt(n)),r=t.length;r--;)i=oi(t[r]),i[o]?u.push(i):f.push(i);i=li(n,yr(f,u))}return i};r.pseudos.nth=r.pseudos.eq;bi.prototype=r.filters=r.pseudos;r.setFilters=new bi;e.sortStable=o.split("").sort(vt).join("")===o;ft();[0,0].sort(vt);e.detectDuplicates=st;v(function(n){if(n.innerHTML="<a href='#'><\/a>",n.firstChild.getAttribute("href")!=="#")for(var t="type|href|height|width".split("|"),i=t.length;i--;)r.attrHandle[t[i]]=lr});v(function(n){if(n.getAttribute("disabled")!=null)for(var t=gt.split("|"),i=t.length;i--;)r.attrHandle[t[i]]=cr});i.find=u;i.expr=u.selectors;i.expr[":"]=i.expr.pseudos;i.unique=u.uniqueSort;i.text=u.getText;i.isXMLDoc=u.isXML;i.contains=u.contains}(n);dt={};i.Callbacks=function(n){n=typeof n=="string"?dt[n]||wu(n):i.extend({},n);var f,c,s,l,e,o,r=[],u=!n.once&&[],a=function(t){for(f=n.memory&&t,c=!0,o=l||0,l=0,e=r.length,s=!0;r&&o<e;o++)if(r[o].apply(t[0],t[1])===!1&&n.stopOnFalse){f=!1;break}s=!1;r&&(u?u.length&&a(u.shift()):f?r=[]:h.disable())},h={add:function(){if(r){var t=r.length;(function u(t){i.each(t,function(t,f){var e=i.type(f);e==="function"?n.unique&&h.has(f)||r.push(f):f&&f.length&&e!=="string"&&u(f)})})(arguments);s?e=r.length:f&&(l=t,a(f))}return this},remove:function(){return r&&i.each(arguments,function(n,t){for(var u;(u=i.inArray(t,r,u))>-1;)r.splice(u,1),s&&(u<=e&&e--,u<=o&&o--)}),this},has:function(n){return n?i.inArray(n,r)>-1:!!(r&&r.length)},empty:function(){return r=[],e=0,this},disable:function(){return r=u=f=t,this},disabled:function(){return!r},lock:function(){return u=t,f||h.disable(),this},locked:function(){return!u},fireWith:function(n,t){return t=t||[],t=[n,t.slice?t.slice():t],r&&(!c||u)&&(s?u.push(t):a(t)),this},fire:function(){return h.fireWith(this,arguments),this},fired:function(){return!!c}};return h};i.extend({Deferred:function(n){var u=[["resolve","done",i.Callbacks("once memory"),"resolved"],["reject","fail",i.Callbacks("once memory"),"rejected"],["notify","progress",i.Callbacks("memory")]],f="pending",r={state:function(){return f},always:function(){return t.done(arguments).fail(arguments),this},then:function(){var n=arguments;return i.Deferred(function(f){i.each(u,function(u,e){var s=e[0],o=i.isFunction(n[u])&&n[u];t[e[1]](function(){var n=o&&o.apply(this,arguments);n&&i.isFunction(n.promise)?n.promise().done(f.resolve).fail(f.reject).progress(f.notify):f[s+"With"](this===r?f.promise():this,o?[n]:arguments)})});n=null}).promise()},promise:function(n){return n!=null?i.extend(n,r):r}},t={};return r.pipe=r.then,i.each(u,function(n,i){var e=i[2],o=i[3];r[i[1]]=e.add;o&&e.add(function(){f=o},u[n^1][2].disable,u[2][2].lock);t[i[0]]=function(){return t[i[0]+"With"](this===t?r:this,arguments),this};t[i[0]+"With"]=e.fireWith}),r.promise(t),n&&n.call(t,t),t},when:function(n){var t=0,u=a.call(arguments),r=u.length,e=r!==1||n&&i.isFunction(n.promise)?r:0,f=e===1?n:i.Deferred(),h=function(n,t,i){return function(r){t[n]=this;i[n]=arguments.length>1?a.call(arguments):r;i===o?f.notifyWith(t,i):--e||f.resolveWith(t,i)}},o,c,s;if(r>1)for(o=new Array(r),c=new Array(r),s=new Array(r);t<r;t++)u[t]&&i.isFunction(u[t].promise)?u[t].promise().done(h(t,s,u)).fail(f.reject).progress(h(t,c,o)):--e;return e||f.resolveWith(s,u),f.promise()}});i.support=function(t){var r=u.createElement("input"),e=u.createDocumentFragment(),f=u.createElement("div"),o=u.createElement("select"),s=o.appendChild(u.createElement("option"));return r.type?(r.type="checkbox",t.checkOn=r.value!=="",t.optSelected=s.selected,t.reliableMarginRight=!0,t.boxSizingReliable=!0,t.pixelPosition=!1,r.checked=!0,t.noCloneChecked=r.cloneNode(!0).checked,o.disabled=!0,t.optDisabled=!s.disabled,r=u.createElement("input"),r.value="t",r.type="radio",t.radioValue=r.value==="t",r.setAttribute("checked","t"),r.setAttribute("name","t"),e.appendChild(r),t.checkClone=e.cloneNode(!0).cloneNode(!0).lastChild.checked,t.focusinBubbles="onfocusin"in n,f.style.backgroundClip="content-box",f.cloneNode(!0).style.backgroundClip="",t.clearCloneStyle=f.style.backgroundClip==="content-box",i(function(){var o,r,e=u.getElementsByTagName("body")[0];e&&(o=u.createElement("div"),o.style.cssText="border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px",e.appendChild(o).appendChild(f),f.innerHTML="",f.style.cssText="-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%",i.swap(e,e.style.zoom!=null?{zoom:1}:{},function(){t.boxSizing=f.offsetWidth===4}),n.getComputedStyle&&(t.pixelPosition=(n.getComputedStyle(f,null)||{}).top!=="1%",t.boxSizingReliable=(n.getComputedStyle(f,null)||{width:"4px"}).width==="4px",r=f.appendChild(u.createElement("div")),r.style.cssText=f.style.cssText="padding:0;margin:0;border:0;display:block;-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box",r.style.marginRight=r.style.width="0",f.style.width="1px",t.reliableMarginRight=!parseFloat((n.getComputedStyle(r,null)||{}).marginRight)),e.removeChild(o))}),t):t}({});ai=/(?:\{[\s\S]*\}|\[[\s\S]*\])$/;vi=/([A-Z])/g;c.uid=1;c.accepts=function(n){return n.nodeType?n.nodeType===1||n.nodeType===9:!0};c.prototype={key:function(n){if(!c.accepts(n))return 0;var r={},t=n[this.expando];if(!t){t=c.uid++;try{r[this.expando]={value:t};Object.defineProperties(n,r)}catch(u){r[this.expando]=t;i.extend(n,r)}}return this.cache[t]||(this.cache[t]={}),t},set:function(n,t,r){var u,e=this.key(n),f=this.cache[e];if(typeof t=="string")f[t]=r;else if(i.isEmptyObject(f))this.cache[e]=t;else for(u in t)f[u]=t[u]},get:function(n,i){var r=this.cache[this.key(n)];return i===t?r:r[i]},access:function(n,i,r){return i===t||i&&typeof i=="string"&&r===t?this.get(n,i):(this.set(n,i,r),r!==t?r:i)},remove:function(n,r){var f,u,o=this.key(n),e=this.cache[o];if(r===t)this.cache[o]={};else for(i.isArray(r)?u=r.concat(r.map(i.camelCase)):(r in e)?u=[r]:(u=i.camelCase(r),u=u in e?[u]:u.match(h)||[]),f=u.length;f--;)delete e[u[f]]},hasData:function(n){return!i.isEmptyObject(this.cache[n[this.expando]]||{})},discard:function(n){delete this.cache[this.key(n)]}};f=new c;r=new c;i.extend({acceptData:c.accepts,hasData:function(n){return f.hasData(n)||r.hasData(n)},data:function(n,t,i){return f.access(n,t,i)},removeData:function(n,t){f.remove(n,t)},_data:function(n,t,i){return r.access(n,t,i)},_removeData:function(n,t){r.remove(n,t)}});i.fn.extend({data:function(n,u){var s,o,e=this[0],h=0,c=null;if(n===t){if(this.length&&(c=f.get(e),e.nodeType===1&&!r.get(e,"hasDataAttrs"))){for(s=e.attributes;h<s.length;h++)o=s[h].name,o.indexOf("data-")===0&&(o=i.camelCase(o.substring(5)),yi(e,o,c[o]));r.set(e,"hasDataAttrs",!0)}return c}return typeof n=="object"?this.each(function(){f.set(this,n)}):i.access(this,function(r){var u,o=i.camelCase(n);if(e&&r===t)return(u=f.get(e,n),u!==t)?u:(u=f.get(e,o),u!==t)?u:(u=yi(e,o,t),u!==t)?u:void 0;this.each(function(){var i=f.get(this,o);f.set(this,o,r);n.indexOf("-")!==-1&&i!==t&&f.set(this,n,r)})},null,u,arguments.length>1,null,!0)},removeData:function(n){return this.each(function(){f.remove(this,n)})}});i.extend({queue:function(n,t,u){var f;if(n)return t=(t||"fx")+"queue",f=r.get(n,t),u&&(!f||i.isArray(u)?f=r.access(n,t,i.makeArray(u)):f.push(u)),f||[]},dequeue:function(n,t){t=t||"fx";var f=i.queue(n,t),e=f.length,r=f.shift(),u=i._queueHooks(n,t),o=function(){i.dequeue(n,t)};r==="inprogress"&&(r=f.shift(),e--);u.cur=r;r&&(t==="fx"&&f.unshift("inprogress"),delete u.stop,r.call(n,o,u));!e&&u&&u.empty.fire()},_queueHooks:function(n,t){var u=t+"queueHooks";return r.get(n,u)||r.access(n,u,{empty:i.Callbacks("once memory").add(function(){r.remove(n,[t+"queue",u])})})}});i.fn.extend({queue:function(n,r){var u=2;return(typeof n!="string"&&(r=n,n="fx",u--),arguments.length<u)?i.queue(this[0],n):r===t?this:this.each(function(){var t=i.queue(this,n,r);i._queueHooks(this,n);n==="fx"&&t[0]!=="inprogress"&&i.dequeue(this,n)})},dequeue:function(n){return this.each(function(){i.dequeue(this,n)})},delay:function(n,t){return n=i.fx?i.fx.speeds[n]||n:n,t=t||"fx",this.queue(t,function(t,i){var r=setTimeout(t,n);i.stop=function(){clearTimeout(r)}})},clearQueue:function(n){return this.queue(n||"fx",[])},promise:function(n,u){var f,o=1,s=i.Deferred(),e=this,h=this.length,c=function(){--o||s.resolveWith(e,[e])};for(typeof n!="string"&&(u=n,n=t),n=n||"fx";h--;)f=r.get(e[h],n+"queueHooks"),f&&f.empty&&(o++,f.empty.add(c));return c(),s.promise(u)}});var bu,pi,gt=/[\t\r\n]/g,ku=/\r/g,du=/^(?:input|select|textarea|button)$/i;i.fn.extend({attr:function(n,t){return i.access(this,i.attr,n,t,arguments.length>1)},removeAttr:function(n){return this.each(function(){i.removeAttr(this,n)})},prop:function(n,t){return i.access(this,i.prop,n,t,arguments.length>1)},removeProp:function(n){return this.each(function(){delete this[i.propFix[n]||n]})},addClass:function(n){var e,t,r,u,o,f=0,s=this.length,c=typeof n=="string"&&n;if(i.isFunction(n))return this.each(function(t){i(this).addClass(n.call(this,t,this.className))});if(c)for(e=(n||"").match(h)||[];f<s;f++)if(t=this[f],r=t.nodeType===1&&(t.className?(" "+t.className+" ").replace(gt," "):" "),r){for(o=0;u=e[o++];)r.indexOf(" "+u+" ")<0&&(r+=u+" ");t.className=i.trim(r)}return this},removeClass:function(n){var e,r,t,u,o,f=0,s=this.length,c=arguments.length===0||typeof n=="string"&&n;if(i.isFunction(n))return this.each(function(t){i(this).removeClass(n.call(this,t,this.className))});if(c)for(e=(n||"").match(h)||[];f<s;f++)if(r=this[f],t=r.nodeType===1&&(r.className?(" "+r.className+" ").replace(gt," "):""),t){for(o=0;u=e[o++];)while(t.indexOf(" "+u+" ")>=0)t=t.replace(" "+u+" "," ");r.className=n?i.trim(t):""}return this},toggleClass:function(n,t){var u=typeof n,f=typeof t=="boolean";return i.isFunction(n)?this.each(function(r){i(this).toggleClass(n.call(this,r,this.className,t),t)}):this.each(function(){if(u==="string")for(var e,c=0,s=i(this),o=t,l=n.match(h)||[];e=l[c++];)o=f?o:!s.hasClass(e),s[o?"addClass":"removeClass"](e);else(u===rt||u==="boolean")&&(this.className&&r.set(this,"__className__",this.className),this.className=this.className||n===!1?"":r.get(this,"__className__")||"")})},hasClass:function(n){for(var i=" "+n+" ",t=0,r=this.length;t<r;t++)if(this[t].nodeType===1&&(" "+this[t].className+" ").replace(gt," ").indexOf(i)>=0)return!0;return!1},val:function(n){var r,u,e,f=this[0];return arguments.length?(e=i.isFunction(n),this.each(function(u){var f,o=i(this);this.nodeType===1&&(f=e?n.call(this,u,o.val()):n,f==null?f="":typeof f=="number"?f+="":i.isArray(f)&&(f=i.map(f,function(n){return n==null?"":n+""})),r=i.valHooks[this.type]||i.valHooks[this.nodeName.toLowerCase()],r&&"set"in r&&r.set(this,f,"value")!==t||(this.value=f))})):f?(r=i.valHooks[f.type]||i.valHooks[f.nodeName.toLowerCase()],r&&"get"in r&&(u=r.get(f,"value"))!==t)?u:(u=f.value,typeof u=="string"?u.replace(ku,""):u==null?"":u):void 0}});i.extend({valHooks:{option:{get:function(n){var t=n.attributes.value;return!t||t.specified?n.value:n.text}},select:{get:function(n){for(var e,t,o=n.options,r=n.selectedIndex,u=n.type==="select-one"||r<0,s=u?null:[],h=u?r+1:o.length,f=r<0?h:u?r:0;f<h;f++)if(t=o[f],(t.selected||f===r)&&(i.support.optDisabled?!t.disabled:t.getAttribute("disabled")===null)&&(!t.parentNode.disabled||!i.nodeName(t.parentNode,"optgroup"))){if(e=i(t).val(),u)return e;s.push(e)}return s},set:function(n,t){for(var u,r,f=n.options,e=i.makeArray(t),o=f.length;o--;)r=f[o],(r.selected=i.inArray(i(r).val(),e)>=0)&&(u=!0);return u||(n.selectedIndex=-1),e}}},attr:function(n,r,u){var f,e,o=n.nodeType;if(n&&o!==3&&o!==8&&o!==2){if(typeof n.getAttribute===rt)return i.prop(n,r,u);if(o===1&&i.isXMLDoc(n)||(r=r.toLowerCase(),f=i.attrHooks[r]||(i.expr.match.boolean.test(r)?pi:bu)),u!==t)if(u===null)i.removeAttr(n,r);else return f&&"set"in f&&(e=f.set(n,u,r))!==t?e:(n.setAttribute(r,u+""),u);else return f&&"get"in f&&(e=f.get(n,r))!==null?e:(e=i.find.attr(n,r),e==null?t:e)}},removeAttr:function(n,t){var r,u,e=0,f=t&&t.match(h);if(f&&n.nodeType===1)while(r=f[e++])u=i.propFix[r]||r,i.expr.match.boolean.test(r)&&(n[u]=!1),n.removeAttribute(r)},attrHooks:{type:{set:function(n,t){if(!i.support.radioValue&&t==="radio"&&i.nodeName(n,"input")){var r=n.value;return n.setAttribute("type",t),r&&(n.value=r),t}}}},propFix:{"for":"htmlFor","class":"className"},prop:function(n,r,u){var e,f,s,o=n.nodeType;if(n&&o!==3&&o!==8&&o!==2)return s=o!==1||!i.isXMLDoc(n),s&&(r=i.propFix[r]||r,f=i.propHooks[r]),u!==t?f&&"set"in f&&(e=f.set(n,u,r))!==t?e:n[r]=u:f&&"get"in f&&(e=f.get(n,r))!==null?e:n[r]},propHooks:{tabIndex:{get:function(n){return n.hasAttribute("tabindex")||du.test(n.nodeName)||n.href?n.tabIndex:-1}}}});pi={set:function(n,t,r){return t===!1?i.removeAttr(n,r):n.setAttribute(r,r),r}};i.each(i.expr.match.boolean.source.match(/\w+/g),function(n,r){var u=i.expr.attrHandle[r]||i.find.attr;i.expr.attrHandle[r]=function(n,r,f){var e=i.expr.attrHandle[r],o=f?t:(i.expr.attrHandle[r]=t)!=u(n,r,f)?r.toLowerCase():null;return i.expr.attrHandle[r]=e,o}});i.support.optSelected||(i.propHooks.selected={get:function(n){var t=n.parentNode;return t&&t.parentNode&&t.parentNode.selectedIndex,null}});i.each(["tabIndex","readOnly","maxLength","cellSpacing","cellPadding","rowSpan","colSpan","useMap","frameBorder","contentEditable"],function(){i.propFix[this.toLowerCase()]=this});i.each(["radio","checkbox"],function(){i.valHooks[this]={set:function(n,t){if(i.isArray(t))return n.checked=i.inArray(i(n).val(),t)>=0}};i.support.checkOn||(i.valHooks[this].get=function(n){return n.getAttribute("value")===null?"on":n.value})});var gu=/^key/,nf=/^(?:mouse|contextmenu)|click/,wi=/^(?:focusinfocus|focusoutblur)$/,bi=/^([^.]*)(?:\.(.+)|)$/;i.event={global:{},add:function(n,u,f,e,o){var p,l,b,w,k,a,c,v,s,d,g,y=r.get(n);if(y){for(f.handler&&(p=f,f=p.handler,o=p.selector),f.guid||(f.guid=i.guid++),(w=y.events)||(w=y.events={}),(l=y.handle)||(l=y.handle=function(n){return typeof i!==rt&&(!n||i.event.triggered!==n.type)?i.event.dispatch.apply(l.elem,arguments):t},l.elem=n),u=(u||"").match(h)||[""],k=u.length;k--;)(b=bi.exec(u[k])||[],s=g=b[1],d=(b[2]||"").split(".").sort(),s)&&(c=i.event.special[s]||{},s=(o?c.delegateType:c.bindType)||s,c=i.event.special[s]||{},a=i.extend({type:s,origType:g,data:e,handler:f,guid:f.guid,selector:o,needsContext:o&&i.expr.match.needsContext.test(o),namespace:d.join(".")},p),(v=w[s])||(v=w[s]=[],v.delegateCount=0,c.setup&&c.setup.call(n,e,d,l)!==!1||n.addEventListener&&n.addEventListener(s,l,!1)),c.add&&(c.add.call(n,a),a.handler.guid||(a.handler.guid=f.guid)),o?v.splice(v.delegateCount++,0,a):v.push(a),i.event.global[s]=!0);n=null}},remove:function(n,t,u,f,e){var p,k,c,v,w,s,l,a,o,b,d,y=r.hasData(n)&&r.get(n);if(y&&(v=y.events)){for(t=(t||"").match(h)||[""],w=t.length;w--;){if(c=bi.exec(t[w])||[],o=d=c[1],b=(c[2]||"").split(".").sort(),!o){for(o in v)i.event.remove(n,o+t[w],u,f,!0);continue}for(l=i.event.special[o]||{},o=(f?l.delegateType:l.bindType)||o,a=v[o]||[],c=c[2]&&new RegExp("(^|\\.)"+b.join("\\.(?:.*\\.|)")+"(\\.|$)"),k=p=a.length;p--;)s=a[p],(e||d===s.origType)&&(!u||u.guid===s.guid)&&(!c||c.test(s.namespace))&&(!f||f===s.selector||f==="**"&&s.selector)&&(a.splice(p,1),s.selector&&a.delegateCount--,l.remove&&l.remove.call(n,s));k&&!a.length&&(l.teardown&&l.teardown.call(n,b,y.handle)!==!1||i.removeEvent(n,o,y.handle),delete v[o])}i.isEmptyObject(v)&&(delete y.handle,r.remove(n,"events"))}},trigger:function(f,e,o,s){var b,h,l,k,v,y,a,w=[o||u],c=bt.call(f,"type")?f.type:f,p=bt.call(f,"namespace")?f.namespace.split("."):[];if((h=l=o=o||u,o.nodeType!==3&&o.nodeType!==8)&&!wi.test(c+i.event.triggered)&&(c.indexOf(".")>=0&&(p=c.split("."),c=p.shift(),p.sort()),v=c.indexOf(":")<0&&"on"+c,f=f[i.expando]?f:new i.Event(c,typeof f=="object"&&f),f.isTrigger=s?2:3,f.namespace=p.join("."),f.namespace_re=f.namespace?new RegExp("(^|\\.)"+p.join("\\.(?:.*\\.|)")+"(\\.|$)"):null,f.result=t,f.target||(f.target=o),e=e==null?[f]:i.makeArray(e,[f]),a=i.event.special[c]||{},s||!a.trigger||a.trigger.apply(o,e)!==!1)){if(!s&&!a.noBubble&&!i.isWindow(o)){for(k=a.delegateType||c,wi.test(k+c)||(h=h.parentNode);h;h=h.parentNode)w.push(h),l=h;l===(o.ownerDocument||u)&&w.push(l.defaultView||l.parentWindow||n)}for(b=0;(h=w[b++])&&!f.isPropagationStopped();)f.type=b>1?k:a.bindType||c,y=(r.get(h,"events")||{})[f.type]&&r.get(h,"handle"),y&&y.apply(h,e),y=v&&h[v],y&&i.acceptData(h)&&y.apply&&y.apply(h,e)===!1&&f.preventDefault();return f.type=c,s||f.isDefaultPrevented()||(!a._default||a._default.apply(w.pop(),e)===!1)&&i.acceptData(o)&&v&&i.isFunction(o[c])&&!i.isWindow(o)&&(l=o[v],l&&(o[v]=null),i.event.triggered=c,o[c](),i.event.triggered=t,l&&(o[v]=l)),f.result}},dispatch:function(n){n=i.event.fix(n);var s,h,o,f,u,c=[],l=a.call(arguments),v=(r.get(this,"events")||{})[n.type]||[],e=i.event.special[n.type]||{};if(l[0]=n,n.delegateTarget=this,!e.preDispatch||e.preDispatch.call(this,n)!==!1){for(c=i.event.handlers.call(this,n,v),s=0;(f=c[s++])&&!n.isPropagationStopped();)for(n.currentTarget=f.elem,h=0;(u=f.handlers[h++])&&!n.isImmediatePropagationStopped();)(!n.namespace_re||n.namespace_re.test(u.namespace))&&(n.handleObj=u,n.data=u.data,o=((i.event.special[u.origType]||{}).handle||u.handler).apply(f.elem,l),o!==t&&(n.result=o)===!1&&(n.preventDefault(),n.stopPropagation()));return e.postDispatch&&e.postDispatch.call(this,n),n.result}},handlers:function(n,r){var o,f,e,s,c=[],h=r.delegateCount,u=n.target;if(h&&u.nodeType&&(!n.button||n.type!=="click"))for(;u!==this;u=u.parentNode||this)if(u.disabled!==!0||n.type!=="click"){for(f=[],o=0;o<h;o++)s=r[o],e=s.selector+" ",f[e]===t&&(f[e]=s.needsContext?i(e,this).index(u)>=0:i.find(e,this,null,[u]).length),f[e]&&f.push(s);f.length&&c.push({elem:u,handlers:f})}return h<r.length&&c.push({elem:this,handlers:r.slice(h)}),c},props:"altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),fixHooks:{},keyHooks:{props:"char charCode key keyCode".split(" "),filter:function(n,t){return n.which==null&&(n.which=t.charCode!=null?t.charCode:t.keyCode),n}},mouseHooks:{props:"button buttons clientX clientY offsetX offsetY pageX pageY screenX screenY toElement".split(" "),filter:function(n,i){var o,r,f,e=i.button;return n.pageX==null&&i.clientX!=null&&(o=n.target.ownerDocument||u,r=o.documentElement,f=o.body,n.pageX=i.clientX+(r&&r.scrollLeft||f&&f.scrollLeft||0)-(r&&r.clientLeft||f&&f.clientLeft||0),n.pageY=i.clientY+(r&&r.scrollTop||f&&f.scrollTop||0)-(r&&r.clientTop||f&&f.clientTop||0)),n.which||e===t||(n.which=e&1?1:e&2?3:e&4?2:0),n}},fix:function(n){if(n[i.expando])return n;var u,f,e,r=n.type,o=n,t=this.fixHooks[r];for(t||(this.fixHooks[r]=t=nf.test(r)?this.mouseHooks:gu.test(r)?this.keyHooks:{}),e=t.props?this.props.concat(t.props):this.props,n=new i.Event(o),u=e.length;u--;)f=e[u],n[f]=o[f];return n.target.nodeType===3&&(n.target=n.target.parentNode),t.filter?t.filter(n,o):n},special:{load:{noBubble:!0},focus:{trigger:function(){if(this!==ki()&&this.focus)return this.focus(),!1},delegateType:"focusin"},blur:{trigger:function(){if(this===ki()&&this.blur)return this.blur(),!1},delegateType:"focusout"},click:{trigger:function(){if(this.type==="checkbox"&&this.click&&i.nodeName(this,"input"))return this.click(),!1},_default:function(n){return i.nodeName(n.target,"a")}},beforeunload:{postDispatch:function(n){n.result!==t&&(n.originalEvent.returnValue=n.result)}}},simulate:function(n,t,r,u){var f=i.extend(new i.Event,r,{type:n,isSimulated:!0,originalEvent:{}});u?i.event.trigger(f,null,t):i.event.dispatch.call(t,f);f.isDefaultPrevented()&&r.preventDefault()}};i.removeEvent=function(n,t,i){n.removeEventListener&&n.removeEventListener(t,i,!1)};i.Event=function(n,t){if(!(this instanceof i.Event))return new i.Event(n,t);n&&n.type?(this.originalEvent=n,this.type=n.type,this.isDefaultPrevented=n.defaultPrevented||n.getPreventDefault&&n.getPreventDefault()?ht:p):this.type=n;t&&i.extend(this,t);this.timeStamp=n&&n.timeStamp||i.now();this[i.expando]=!0};i.Event.prototype={isDefaultPrevented:p,isPropagationStopped:p,isImmediatePropagationStopped:p,preventDefault:function(){var n=this.originalEvent;this.isDefaultPrevented=ht;n&&n.preventDefault&&n.preventDefault()},stopPropagation:function(){var n=this.originalEvent;this.isPropagationStopped=ht;n&&n.stopPropagation&&n.stopPropagation()},stopImmediatePropagation:function(){this.isImmediatePropagationStopped=ht;this.stopPropagation()}};i.each({mouseenter:"mouseover",mouseleave:"mouseout"},function(n,t){i.event.special[n]={delegateType:t,bindType:t,handle:function(n){var u,f=this,r=n.relatedTarget,e=n.handleObj;return r&&(r===f||i.contains(f,r))||(n.type=e.origType,u=e.handler.apply(this,arguments),n.type=t),u}}});i.support.focusinBubbles||i.each({focus:"focusin",blur:"focusout"},function(n,t){var r=0,f=function(n){i.event.simulate(t,n.target,i.event.fix(n),!0)};i.event.special[t]={setup:function(){r++==0&&u.addEventListener(n,f,!0)},teardown:function(){--r==0&&u.removeEventListener(n,f,!0)}}});i.fn.extend({on:function(n,r,u,f,e){var o,s;if(typeof n=="object"){typeof r!="string"&&(u=u||r,r=t);for(s in n)this.on(s,r,u,n[s],e);return this}if(u==null&&f==null?(f=r,u=r=t):f==null&&(typeof r=="string"?(f=u,u=t):(f=u,u=r,r=t)),f===!1)f=p;else if(!f)return this;return e===1&&(o=f,f=function(n){return i().off(n),o.apply(this,arguments)},f.guid=o.guid||(o.guid=i.guid++)),this.each(function(){i.event.add(this,n,f,u,r)})},one:function(n,t,i,r){return this.on(n,t,i,r,1)},off:function(n,r,u){var f,e;if(n&&n.preventDefault&&n.handleObj)return f=n.handleObj,i(n.delegateTarget).off(f.namespace?f.origType+"."+f.namespace:f.origType,f.selector,f.handler),this;if(typeof n=="object"){for(e in n)this.off(e,r,n[e]);return this}return(r===!1||typeof r=="function")&&(u=r,r=t),u===!1&&(u=p),this.each(function(){i.event.remove(this,n,u,r)})},trigger:function(n,t){return this.each(function(){i.event.trigger(n,t,this)})},triggerHandler:function(n,t){var r=this[0];if(r)return i.event.trigger(n,t,r,!0)}});var tf=/^.[^:#\[\.,]*$/,di=i.expr.match.needsContext,rf={children:!0,contents:!0,next:!0,prev:!0};i.fn.extend({find:function(n){var f,r,t,u=this.length;if(typeof n!="string")return f=this,this.pushStack(i(n).filter(function(){for(t=0;t<u;t++)if(i.contains(f[t],this))return!0}));for(r=[],t=0;t<u;t++)i.find(n,this[t],r);return r=this.pushStack(u>1?i.unique(r):r),r.selector=(this.selector?this.selector+" ":"")+n,r},has:function(n){var t=i(n,this),r=t.length;return this.filter(function(){for(var n=0;n<r;n++)if(i.contains(this,t[n]))return!0})},not:function(n){return this.pushStack(nr(this,n||[],!0))},filter:function(n){return this.pushStack(nr(this,n||[],!1))},is:function(n){return!!n&&(typeof n=="string"?di.test(n)?i(n,this.context).index(this[0])>=0:i.filter(n,this).length>0:this.filter(n).length>0)},closest:function(n,t){for(var r,f=0,o=this.length,u=[],e=di.test(n)||typeof n!="string"?i(n,t||this.context):0;f<o;f++)for(r=this[f];r&&r!==t;r=r.parentNode)if(r.nodeType<11&&(e?e.index(r)>-1:r.nodeType===1&&i.find.matchesSelector(r,n))){r=u.push(r);break}return this.pushStack(u.length>1?i.unique(u):u)},index:function(n){return n?typeof n=="string"?et.call(i(n),this[0]):et.call(this,n.jquery?n[0]:n):this[0]&&this[0].parentNode?this.first().prevAll().length:-1},add:function(n,t){var r=typeof n=="string"?i(n,t):i.makeArray(n&&n.nodeType?[n]:n),u=i.merge(this.get(),r);return this.pushStack(i.unique(u))},addBack:function(n){return this.add(n==null?this.prevObject:this.prevObject.filter(n))}});i.each({parent:function(n){var t=n.parentNode;return t&&t.nodeType!==11?t:null},parents:function(n){return i.dir(n,"parentNode")},parentsUntil:function(n,t,r){return i.dir(n,"parentNode",r)},next:function(n){return gi(n,"nextSibling")},prev:function(n){return gi(n,"previousSibling")},nextAll:function(n){return i.dir(n,"nextSibling")},prevAll:function(n){return i.dir(n,"previousSibling")},nextUntil:function(n,t,r){return i.dir(n,"nextSibling",r)},prevUntil:function(n,t,r){return i.dir(n,"previousSibling",r)},siblings:function(n){return i.sibling((n.parentNode||{}).firstChild,n)},children:function(n){return i.sibling(n.firstChild)},contents:function(n){return i.nodeName(n,"iframe")?n.contentDocument||n.contentWindow.document:i.merge([],n.childNodes)}},function(n,t){i.fn[n]=function(r,u){var f=i.map(this,t,r);return n.slice(-5)!=="Until"&&(u=r),u&&typeof u=="string"&&(f=i.filter(u,f)),this.length>1&&(rf[n]||i.unique(f),n[0]==="p"&&f.reverse()),this.pushStack(f)}});i.extend({filter:function(n,t,r){var u=t[0];return r&&(n=":not("+n+")"),t.length===1&&u.nodeType===1?i.find.matchesSelector(u,n)?[u]:[]:i.find.matches(n,i.grep(t,function(n){return n.nodeType===1}))},dir:function(n,r,u){for(var f=[],e=u!==t;(n=n[r])&&n.nodeType!==9;)if(n.nodeType===1){if(e&&i(n).is(u))break;f.push(n)}return f},sibling:function(n,t){for(var i=[];n;n=n.nextSibling)n.nodeType===1&&n!==t&&i.push(n);return i}});var tr=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,ir=/<([\w:]+)/,uf=/<|&#?\w+;/,ff=/<(?:script|style|link)/i,rr=/^(?:checkbox|radio)$/i,ef=/checked\s*(?:[^=]|=\s*.checked.)/i,ur=/^$|\/(?:java|ecma)script/i,of=/^true\/(.*)/,sf=/^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,o={option:[1,"<select multiple='multiple'>","<\/select>"],thead:[1,"<table>","<\/table>"],tr:[2,"<table><tbody>","<\/tbody><\/table>"],td:[3,"<table><tbody><tr>","<\/tr><\/tbody><\/table>"],_default:[0,"",""]};o.optgroup=o.option;o.tbody=o.tfoot=o.colgroup=o.caption=o.col=o.thead;o.th=o.td;i.fn.extend({text:function(n){return i.access(this,function(n){return n===t?i.text(this):this.empty().append((this[0]&&this[0].ownerDocument||u).createTextNode(n))},null,n,arguments.length)},append:function(){return this.domManip(arguments,function(n){if(this.nodeType===1||this.nodeType===11||this.nodeType===9){var t=fr(this,n);t.appendChild(n)}})},prepend:function(){return this.domManip(arguments,function(n){if(this.nodeType===1||this.nodeType===11||this.nodeType===9){var t=fr(this,n);t.insertBefore(n,t.firstChild)}})},before:function(){return this.domManip(arguments,function(n){this.parentNode&&this.parentNode.insertBefore(n,this)})},after:function(){return this.domManip(arguments,function(n){this.parentNode&&this.parentNode.insertBefore(n,this.nextSibling)})},remove:function(n,t){for(var r,f=n?i.filter(n,this):this,u=0;(r=f[u])!=null;u++)t||r.nodeType!==1||i.cleanData(s(r)),r.parentNode&&(t&&i.contains(r.ownerDocument,r)&&ni(s(r,"script")),r.parentNode.removeChild(r));return this},empty:function(){for(var n,t=0;(n=this[t])!=null;t++)n.nodeType===1&&(i.cleanData(s(n,!1)),n.textContent="");return this},clone:function(n,t){return n=n==null?!1:n,t=t==null?n:t,this.map(function(){return i.clone(this,n,t)})},html:function(n){return i.access(this,function(n){var r=this[0]||{},u=0,f=this.length;if(n===t&&r.nodeType===1)return r.innerHTML;if(typeof n=="string"&&!ff.test(n)&&!o[(ir.exec(n)||["",""])[1].toLowerCase()]){n=n.replace(tr,"<$1><\/$2>");try{for(;u<f;u++)r=this[u]||{},r.nodeType===1&&(i.cleanData(s(r,!1)),r.innerHTML=n);r=0}catch(e){}}r&&this.empty().append(n)},null,n,arguments.length)},replaceWith:function(){var t=i.map(this,function(n){return[n.nextSibling,n.parentNode]}),n=0;return this.domManip(arguments,function(r){var f=t[n++],u=t[n++];u&&(i(this).remove(),u.insertBefore(r,f))},!0),n?this:this.remove()},detach:function(n){return this.remove(n,!0)},domManip:function(n,t,u){n=ci.apply([],n);var h,v,o,c,f,y,e=0,l=this.length,w=this,b=l-1,a=n[0],p=i.isFunction(a);if(p||!(l<=1||typeof a!="string"||i.support.checkClone||!ef.test(a)))return this.each(function(i){var r=w.eq(i);p&&(n[0]=a.call(this,i,r.html()));r.domManip(n,t,u)});if(l&&(h=i.buildFragment(n,this[0].ownerDocument,!1,!u&&this),v=h.firstChild,h.childNodes.length===1&&(h=v),v)){for(o=i.map(s(h,"script"),hf),c=o.length;e<l;e++)f=h,e!==b&&(f=i.clone(f,!0,!0),c&&i.merge(o,s(f,"script"))),t.call(this[e],f,e);if(c)for(y=o[o.length-1].ownerDocument,i.map(o,cf),e=0;e<c;e++)f=o[e],ur.test(f.type||"")&&!r.access(f,"globalEval")&&i.contains(y,f)&&(f.src?i._evalUrl(f.src):i.globalEval(f.textContent.replace(sf,"")))}return this}});i.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(n,t){i.fn[n]=function(n){for(var u,f=[],e=i(n),o=e.length-1,r=0;r<=o;r++)u=r===o?this:this.clone(!0),i(e[r])[t](u),wt.apply(f,u.get());return this.pushStack(f)}});i.extend({clone:function(n,t,r){var u,h,e,f,o=n.cloneNode(!0),c=i.contains(n.ownerDocument,n);if(!i.support.noCloneChecked&&(n.nodeType===1||n.nodeType===11)&&!i.isXMLDoc(n))for(f=s(o),e=s(n),u=0,h=e.length;u<h;u++)lf(e[u],f[u]);if(t)if(r)for(e=e||s(n),f=f||s(o),u=0,h=e.length;u<h;u++)er(e[u],f[u]);else er(n,o);return f=s(o,"script"),f.length>0&&ni(f,!c&&s(n,"script")),o},buildFragment:function(n,t,r,u){for(var f,e,y,l,p,a,h=0,w=n.length,c=t.createDocumentFragment(),v=[];h<w;h++)if(f=n[h],f||f===0)if(i.type(f)==="object")i.merge(v,f.nodeType?[f]:f);else if(uf.test(f)){for(e=e||c.appendChild(t.createElement("div")),y=(ir.exec(f)||["",""])[1].toLowerCase(),l=o[y]||o._default,e.innerHTML=l[1]+f.replace(tr,"<$1><\/$2>")+l[2],a=l[0];a--;)e=e.firstChild;i.merge(v,e.childNodes);e=c.firstChild;e.textContent=""}else v.push(t.createTextNode(f));for(c.textContent="",h=0;f=v[h++];)if((!u||i.inArray(f,u)===-1)&&(p=i.contains(f.ownerDocument,f),e=s(c.appendChild(f),"script"),p&&ni(e),r))for(a=0;f=e[a++];)ur.test(f.type||"")&&r.push(f);return c},cleanData:function(n){for(var u,t,e,s=n.length,o=0,h=i.event.special;o<s;o++){if(t=n[o],i.acceptData(t)&&(u=r.access(t),u))for(e in u.events)h[e]?i.event.remove(t,e):i.removeEvent(t,e,u.handle);f.discard(t);r.discard(t)}},_evalUrl:function(n){return i.ajax({url:n,type:"GET",dataType:"text",async:!1,global:!1,success:i.globalEval})}});i.fn.extend({wrapAll:function(n){var t;return i.isFunction(n)?this.each(function(t){i(this).wrapAll(n.call(this,t))}):(this[0]&&(t=i(n,this[0].ownerDocument).eq(0).clone(!0),this[0].parentNode&&t.insertBefore(this[0]),t.map(function(){for(var n=this;n.firstElementChild;)n=n.firstElementChild;return n}).append(this)),this)},wrapInner:function(n){return i.isFunction(n)?this.each(function(t){i(this).wrapInner(n.call(this,t))}):this.each(function(){var t=i(this),r=t.contents();r.length?r.wrapAll(n):t.append(n)})},wrap:function(n){var t=i.isFunction(n);return this.each(function(r){i(this).wrapAll(t?n.call(this,r):n)})},unwrap:function(){return this.parent().each(function(){i.nodeName(this,"body")||i(this).replaceWith(this.childNodes)}).end()}});var w,k,af=/^(none|table(?!-c[ea]).+)/,or=/^margin/,vf=new RegExp("^("+ot+")(.*)$","i"),ti=new RegExp("^("+ot+")(?!px)[a-z%]+$","i"),yf=new RegExp("^([+-])=("+ot+")","i"),sr={BODY:"block"},pf={position:"absolute",visibility:"hidden",display:"block"},hr={letterSpacing:0,fontWeight:400},v=["Top","Right","Bottom","Left"],cr=["Webkit","O","Moz","ms"];i.fn.extend({css:function(n,r){return i.access(this,function(n,r,u){var e,o,s={},f=0;if(i.isArray(r)){for(e=ct(n),o=r.length;f<o;f++)s[r[f]]=i.css(n,r[f],!1,e);return s}return u!==t?i.style(n,r,u):i.css(n,r)},n,r,arguments.length>1)},show:function(){return ar(this,!0)},hide:function(){return ar(this)},toggle:function(n){var t=typeof n=="boolean";return this.each(function(){(t?n:d(this))?i(this).show():i(this).hide()})}});i.extend({cssHooks:{opacity:{get:function(n,t){if(t){var i=w(n,"opacity");return i===""?"1":i}}}},cssNumber:{columnCount:!0,fillOpacity:!0,fontWeight:!0,lineHeight:!0,opacity:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{float:"cssFloat"},style:function(n,r,u,f){if(n&&n.nodeType!==3&&n.nodeType!==8&&n.style){var o,s,e,h=i.camelCase(r),c=n.style;if(r=i.cssProps[h]||(i.cssProps[h]=lr(c,h)),e=i.cssHooks[r]||i.cssHooks[h],u!==t){if(s=typeof u,s==="string"&&(o=yf.exec(u))&&(u=(o[1]+1)*o[2]+parseFloat(i.css(n,r)),s="number"),u==null||s==="number"&&isNaN(u))return;s!=="number"||i.cssNumber[h]||(u+="px");i.support.clearCloneStyle||u!==""||r.indexOf("background")!==0||(c[r]="inherit");e&&"set"in e&&(u=e.set(n,u,f))===t||(c[r]=u)}else return e&&"get"in e&&(o=e.get(n,!1,f))!==t?o:c[r]}},css:function(n,r,u,f){var e,h,o,s=i.camelCase(r);return(r=i.cssProps[s]||(i.cssProps[s]=lr(n.style,s)),o=i.cssHooks[r]||i.cssHooks[s],o&&"get"in o&&(e=o.get(n,!0,u)),e===t&&(e=w(n,r,f)),e==="normal"&&r in hr&&(e=hr[r]),u===""||u)?(h=parseFloat(e),u===!0||i.isNumeric(h)?h||0:e):e}});w=function(n,r,u){var s,h,c,o=u||ct(n),e=o?o.getPropertyValue(r)||o[r]:t,f=n.style;return o&&(e!==""||i.contains(n.ownerDocument,n)||(e=i.style(n,r)),ti.test(e)&&or.test(r)&&(s=f.width,h=f.minWidth,c=f.maxWidth,f.minWidth=f.maxWidth=f.width=e,e=o.width,f.width=s,f.minWidth=h,f.maxWidth=c)),e};i.each(["height","width"],function(n,t){i.cssHooks[t]={get:function(n,r,u){if(r)return n.offsetWidth===0&&af.test(i.css(n,"display"))?i.swap(n,pf,function(){return pr(n,t,u)}):pr(n,t,u)},set:function(n,r,u){var f=u&&ct(n);return vr(n,r,u?yr(n,t,u,i.support.boxSizing&&i.css(n,"boxSizing",!1,f)==="border-box",f):0)}}});i(function(){i.support.reliableMarginRight||(i.cssHooks.marginRight={get:function(n,t){if(t)return i.swap(n,{display:"inline-block"},w,[n,"marginRight"])}});!i.support.pixelPosition&&i.fn.position&&i.each(["top","left"],function(n,t){i.cssHooks[t]={get:function(n,r){if(r)return r=w(n,t),ti.test(r)?i(n).position()[t]+"px":r}}})});i.expr&&i.expr.filters&&(i.expr.filters.hidden=function(n){return n.offsetWidth<=0&&n.offsetHeight<=0},i.expr.filters.visible=function(n){return!i.expr.filters.hidden(n)});i.each({margin:"",padding:"",border:"Width"},function(n,t){i.cssHooks[n+t]={expand:function(i){for(var r=0,f={},u=typeof i=="string"?i.split(" "):[i];r<4;r++)f[n+v[r]+t]=u[r]||u[r-2]||u[0];return f}};or.test(n)||(i.cssHooks[n+t].set=vr)});var bf=/%20/g,kf=/\[\]$/,br=/\r?\n/g,df=/^(?:submit|button|image|reset|file)$/i,gf=/^(?:input|select|textarea|keygen)/i;i.fn.extend({serialize:function(){return i.param(this.serializeArray())},serializeArray:function(){return this.map(function(){var n=i.prop(this,"elements");return n?i.makeArray(n):this}).filter(function(){var n=this.type;return this.name&&!i(this).is(":disabled")&&gf.test(this.nodeName)&&!df.test(n)&&(this.checked||!rr.test(n))}).map(function(n,t){var r=i(this).val();return r==null?null:i.isArray(r)?i.map(r,function(n){return{name:t.name,value:n.replace(br,"\r\n")}}):{name:t.name,value:r.replace(br,"\r\n")}}).get()}});i.param=function(n,r){var u,f=[],e=function(n,t){t=i.isFunction(t)?t():t==null?"":t;f[f.length]=encodeURIComponent(n)+"="+encodeURIComponent(t)};if(r===t&&(r=i.ajaxSettings&&i.ajaxSettings.traditional),i.isArray(n)||n.jquery&&!i.isPlainObject(n))i.each(n,function(){e(this.name,this.value)});else for(u in n)ii(u,n[u],r,e);return f.join("&").replace(bf,"+")};i.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "),function(n,t){i.fn[t]=function(n,i){return arguments.length>0?this.on(t,null,n,i):this.trigger(t)}});i.fn.extend({hover:function(n,t){return this.mouseenter(n).mouseleave(t||n)},bind:function(n,t,i){return this.on(n,null,t,i)},unbind:function(n,t){return this.off(n,null,t)},delegate:function(n,t,i,r){return this.on(t,n,i,r)},undelegate:function(n,t,i){return arguments.length===1?this.off(n,"**"):this.off(t,n||"**",i)}});var y,l,ri=i.now(),ui=/\?/,ne=/#.*$/,kr=/([?&])_=[^&]*/,te=/^(.*?):[ \t]*([^\r\n]*)$/mg,ie=/^(?:GET|HEAD)$/,re=/^\/\//,dr=/^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,gr=i.fn.load,nu={},fi={},tu="*/".concat("*");try{l=ou.href}catch(ye){l=u.createElement("a");l.href="";l=l.href}y=dr.exec(l.toLowerCase())||[];i.fn.load=function(n,r,u){if(typeof n!="string"&&gr)return gr.apply(this,arguments);var f,s,h,e=this,o=n.indexOf(" ");return o>=0&&(f=n.slice(o),n=n.slice(0,o)),i.isFunction(r)?(u=r,r=t):r&&typeof r=="object"&&(s="POST"),e.length>0&&i.ajax({url:n,type:s,dataType:"html",data:r}).done(function(n){h=arguments;e.html(f?i("<div>").append(i.parseHTML(n)).find(f):n)}).complete(u&&function(n,t){e.each(u,h||[n.responseText,t,n])}),this};i.each(["ajaxStart","ajaxStop","ajaxComplete","ajaxError","ajaxSuccess","ajaxSend"],function(n,t){i.fn[t]=function(n){return this.on(t,n)}});i.extend({active:0,lastModified:{},etag:{},ajaxSettings:{url:l,type:"GET",isLocal:/^(?:about|app|app-storage|.+-extension|file|res|widget):$/.test(y[1]),global:!0,processData:!0,async:!0,contentType:"application/x-www-form-urlencoded; charset=UTF-8",accepts:{"*":tu,text:"text/plain",html:"text/html",xml:"application/xml, text/xml",json:"application/json, text/javascript"},contents:{xml:/xml/,html:/html/,json:/json/},responseFields:{xml:"responseXML",text:"responseText",json:"responseJSON"},converters:{"* text":String,"text html":!0,"text json":i.parseJSON,"text xml":i.parseXML},flatOptions:{url:!0,context:!0}},ajaxSetup:function(n,t){return t?ei(ei(n,i.ajaxSettings),t):ei(i.ajaxSettings,n)},ajaxPrefilter:iu(nu),ajaxTransport:iu(fi),ajax:function(n,r){function k(n,r,h,l){var v,rt,k,y,w,a=r;o!==2&&(o=2,g&&clearTimeout(g),c=t,d=l||"",f.readyState=n>0?4:0,v=n>=200&&n<300||n===304,h&&(y=ue(u,f,h)),y=fe(u,y,f,v),v?(u.ifModified&&(w=f.getResponseHeader("Last-Modified"),w&&(i.lastModified[e]=w),w=f.getResponseHeader("etag"),w&&(i.etag[e]=w)),n===204?a="nocontent":n===304?a="notmodified":(a=y.state,rt=y.data,k=y.error,v=!k)):(k=a,(n||!a)&&(a="error",n<0&&(n=0))),f.status=n,f.statusText=(r||a)+"",v?tt.resolveWith(s,[rt,a,f]):tt.rejectWith(s,[f,a,k]),f.statusCode(b),b=t,p&&nt.trigger(v?"ajaxSuccess":"ajaxError",[f,u,v?rt:k]),it.fireWith(s,[f,a]),p&&(nt.trigger("ajaxComplete",[f,u]),--i.active||i.event.trigger("ajaxStop")))}typeof n=="object"&&(r=n,n=t);r=r||{};var c,e,d,w,g,a,p,v,u=i.ajaxSetup({},r),s=u.context||u,nt=u.context&&(s.nodeType||s.jquery)?i(s):i.event,tt=i.Deferred(),it=i.Callbacks("once memory"),b=u.statusCode||{},rt={},ut={},o=0,ft="canceled",f={readyState:0,getResponseHeader:function(n){var t;if(o===2){if(!w)for(w={};t=te.exec(d);)w[t[1].toLowerCase()]=t[2];t=w[n.toLowerCase()]}return t==null?null:t},getAllResponseHeaders:function(){return o===2?d:null},setRequestHeader:function(n,t){var i=n.toLowerCase();return o||(n=ut[i]=ut[i]||n,rt[n]=t),this},overrideMimeType:function(n){return o||(u.mimeType=n),this},statusCode:function(n){var t;if(n)if(o<2)for(t in n)b[t]=[b[t],n[t]];else f.always(n[f.status]);return this},abort:function(n){var t=n||ft;return c&&c.abort(t),k(0,t),this}};if(tt.promise(f).complete=it.add,f.success=f.done,f.error=f.fail,u.url=((n||u.url||l)+"").replace(ne,"").replace(re,y[1]+"//"),u.type=r.method||r.type||u.method||u.type,u.dataTypes=i.trim(u.dataType||"*").toLowerCase().match(h)||[""],u.crossDomain==null&&(a=dr.exec(u.url.toLowerCase()),u.crossDomain=!!(a&&(a[1]!==y[1]||a[2]!==y[2]||(a[3]||(a[1]==="http:"?"80":"443"))!==(y[3]||(y[1]==="http:"?"80":"443"))))),u.data&&u.processData&&typeof u.data!="string"&&(u.data=i.param(u.data,u.traditional)),ru(nu,u,r,f),o===2)return f;p=u.global;p&&i.active++==0&&i.event.trigger("ajaxStart");u.type=u.type.toUpperCase();u.hasContent=!ie.test(u.type);e=u.url;u.hasContent||(u.data&&(e=u.url+=(ui.test(e)?"&":"?")+u.data,delete u.data),u.cache===!1&&(u.url=kr.test(e)?e.replace(kr,"$1_="+ri++):e+(ui.test(e)?"&":"?")+"_="+ri++));u.ifModified&&(i.lastModified[e]&&f.setRequestHeader("If-Modified-Since",i.lastModified[e]),i.etag[e]&&f.setRequestHeader("If-None-Match",i.etag[e]));(u.data&&u.hasContent&&u.contentType!==!1||r.contentType)&&f.setRequestHeader("Content-Type",u.contentType);f.setRequestHeader("Accept",u.dataTypes[0]&&u.accepts[u.dataTypes[0]]?u.accepts[u.dataTypes[0]]+(u.dataTypes[0]!=="*"?", "+tu+"; q=0.01":""):u.accepts["*"]);for(v in u.headers)f.setRequestHeader(v,u.headers[v]);if(u.beforeSend&&(u.beforeSend.call(s,f,u)===!1||o===2))return f.abort();ft="abort";for(v in{success:1,error:1,complete:1})f[v](u[v]);if(c=ru(fi,u,r,f),c){f.readyState=1;p&&nt.trigger("ajaxSend",[f,u]);u.async&&u.timeout>0&&(g=setTimeout(function(){f.abort("timeout")},u.timeout));try{o=1;c.send(rt,k)}catch(et){if(o<2)k(-1,et);else throw et;}}else k(-1,"No Transport");return f},getJSON:function(n,t,r){return i.get(n,t,r,"json")},getScript:function(n,r){return i.get(n,t,r,"script")}});i.each(["get","post"],function(n,r){i[r]=function(n,u,f,e){return i.isFunction(u)&&(e=e||f,f=u,u=t),i.ajax({url:n,type:r,dataType:e,data:u,success:f})}});i.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/(?:java|ecma)script/},converters:{"text script":function(n){return i.globalEval(n),n}}});i.ajaxPrefilter("script",function(n){n.cache===t&&(n.cache=!1);n.crossDomain&&(n.type="GET")});i.ajaxTransport("script",function(n){if(n.crossDomain){var r,t;return{send:function(f,e){r=i("<script>").prop({async:!0,charset:n.scriptCharset,src:n.url}).on("load error",t=function(n){r.remove();t=null;n&&e(n.type==="error"?404:200,n.type)});u.head.appendChild(r[0])},abort:function(){t&&t()}}}});oi=[];lt=/(=)\?(?=&|$)|\?\?/;i.ajaxSetup({jsonp:"callback",jsonpCallback:function(){var n=oi.pop()||i.expando+"_"+ri++;return this[n]=!0,n}});i.ajaxPrefilter("json jsonp",function(r,u,f){var e,s,o,h=r.jsonp!==!1&&(lt.test(r.url)?"url":typeof r.data=="string"&&!(r.contentType||"").indexOf("application/x-www-form-urlencoded")&&lt.test(r.data)&&"data");if(h||r.dataTypes[0]==="jsonp")return e=r.jsonpCallback=i.isFunction(r.jsonpCallback)?r.jsonpCallback():r.jsonpCallback,h?r[h]=r[h].replace(lt,"$1"+e):r.jsonp!==!1&&(r.url+=(ui.test(r.url)?"&":"?")+r.jsonp+"="+e),r.converters["script json"]=function(){return o||i.error(e+" was not called"),o[0]},r.dataTypes[0]="json",s=n[e],n[e]=function(){o=arguments},f.always(function(){n[e]=s;r[e]&&(r.jsonpCallback=u.jsonpCallback,oi.push(e));o&&i.isFunction(s)&&s(o[0]);o=s=t}),"script"});i.ajaxSettings.xhr=function(){try{return new XMLHttpRequest}catch(n){}};var g=i.ajaxSettings.xhr(),ee={0:200,1223:204},oe=0,nt={};if(n.ActiveXObject)i(n).on("unload",function(){for(var n in nt)nt[n]();nt=t});i.support.cors=!!g&&"withCredentials"in g;i.support.ajax=g=!!g;i.ajaxTransport(function(n){var r;if(i.support.cors||g&&!n.crossDomain)return{send:function(i,u){var e,o,f=n.xhr();if(f.open(n.type,n.url,n.async,n.username,n.password),n.xhrFields)for(e in n.xhrFields)f[e]=n.xhrFields[e];n.mimeType&&f.overrideMimeType&&f.overrideMimeType(n.mimeType);n.crossDomain||i["X-Requested-With"]||(i["X-Requested-With"]="XMLHttpRequest");for(e in i)f.setRequestHeader(e,i[e]);r=function(n){return function(){r&&(delete nt[o],r=f.onload=f.onerror=null,n==="abort"?f.abort():n==="error"?u(f.status||404,f.statusText):u(ee[f.status]||f.status,f.statusText,typeof f.responseText=="string"?{text:f.responseText}:t,f.getAllResponseHeaders()))}};f.onload=r();f.onerror=r("error");r=nt[o=oe++]=r("abort");f.send(n.hasContent&&n.data||null)},abort:function(){r&&r()}}});var b,at,se=/^(?:toggle|show|hide)$/,he=new RegExp("^(?:([+-])=|)("+ot+")([a-z%]*)$","i"),ce=/queueHooks$/,vt=[ve],tt={"*":[function(n,t){var o,s,r=this.createTween(n,t),e=he.exec(t),h=r.cur(),u=+h||0,f=1,c=20;if(e){if(o=+e[2],s=e[3]||(i.cssNumber[n]?"":"px"),s!=="px"&&u){u=i.css(r.elem,n,!0)||o||1;do f=f||".5",u=u/f,i.style(r.elem,n,u+s);while(f!==(f=r.cur()/h)&&f!==1&&--c)}r.unit=s;r.start=u;r.end=e[1]?u+(e[1]+1)*o:o}return r}]};i.Animation=i.extend(fu,{tweener:function(n,t){i.isFunction(n)?(t=n,n=["*"]):n=n.split(" ");for(var r,u=0,f=n.length;u<f;u++)r=n[u],tt[r]=tt[r]||[],tt[r].unshift(t)},prefilter:function(n,t){t?vt.unshift(n):vt.push(n)}});i.Tween=e;e.prototype={constructor:e,init:function(n,t,r,u,f,e){this.elem=n;this.prop=r;this.easing=f||"swing";this.options=t;this.start=this.now=this.cur();this.end=u;this.unit=e||(i.cssNumber[r]?"":"px")},cur:function(){var n=e.propHooks[this.prop];return n&&n.get?n.get(this):e.propHooks._default.get(this)},run:function(n){var t,r=e.propHooks[this.prop];return this.pos=this.options.duration?t=i.easing[this.easing](n,this.options.duration*n,0,1,this.options.duration):t=n,this.now=(this.end-this.start)*t+this.start,this.options.step&&this.options.step.call(this.elem,this.now,this),r&&r.set?r.set(this):e.propHooks._default.set(this),this}};e.prototype.init.prototype=e.prototype;e.propHooks={_default:{get:function(n){var t;return n.elem[n.prop]!=null&&(!n.elem.style||n.elem.style[n.prop]==null)?n.elem[n.prop]:(t=i.css(n.elem,n.prop,""),!t||t==="auto"?0:t)},set:function(n){i.fx.step[n.prop]?i.fx.step[n.prop](n):n.elem.style&&(n.elem.style[i.cssProps[n.prop]]!=null||i.cssHooks[n.prop])?i.style(n.elem,n.prop,n.now+n.unit):n.elem[n.prop]=n.now}}};e.propHooks.scrollTop=e.propHooks.scrollLeft={set:function(n){n.elem.nodeType&&n.elem.parentNode&&(n.elem[n.prop]=n.now)}};i.each(["toggle","show","hide"],function(n,t){var r=i.fn[t];i.fn[t]=function(n,i,u){return n==null||typeof n=="boolean"?r.apply(this,arguments):this.animate(yt(t,!0),n,i,u)}});i.fn.extend({fadeTo:function(n,t,i,r){return this.filter(d).css("opacity",0).show().end().animate({opacity:t},n,i,r)},animate:function(n,t,u,f){var s=i.isEmptyObject(n),o=i.speed(t,u,f),e=function(){var t=fu(this,i.extend({},n),o);e.finish=function(){t.stop(!0)};(s||r.get(this,"finish"))&&t.stop(!0)};return e.finish=e,s||o.queue===!1?this.each(e):this.queue(o.queue,e)},stop:function(n,u,f){var e=function(n){var t=n.stop;delete n.stop;t(f)};return typeof n!="string"&&(f=u,u=n,n=t),u&&n!==!1&&this.queue(n||"fx",[]),this.each(function(){var s=!0,t=n!=null&&n+"queueHooks",o=i.timers,u=r.get(this);if(t)u[t]&&u[t].stop&&e(u[t]);else for(t in u)u[t]&&u[t].stop&&ce.test(t)&&e(u[t]);for(t=o.length;t--;)o[t].elem===this&&(n==null||o[t].queue===n)&&(o[t].anim.stop(f),s=!1,o.splice(t,1));(s||!f)&&i.dequeue(this,n)})},finish:function(n){return n!==!1&&(n=n||"fx"),this.each(function(){var t,e=r.get(this),u=e[n+"queue"],o=e[n+"queueHooks"],f=i.timers,s=u?u.length:0;for(e.finish=!0,i.queue(this,n,[]),o&&o.cur&&o.cur.finish&&o.cur.finish.call(this),t=f.length;t--;)f[t].elem===this&&f[t].queue===n&&(f[t].anim.stop(!0),f.splice(t,1));for(t=0;t<s;t++)u[t]&&u[t].finish&&u[t].finish.call(this);delete e.finish})}});i.each({slideDown:yt("show"),slideUp:yt("hide"),slideToggle:yt("toggle"),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(n,t){i.fn[n]=function(n,i,r){return this.animate(t,n,i,r)}});i.speed=function(n,t,r){var u=n&&typeof n=="object"?i.extend({},n):{complete:r||!r&&t||i.isFunction(n)&&n,duration:n,easing:r&&t||t&&!i.isFunction(t)&&t};return u.duration=i.fx.off?0:typeof u.duration=="number"?u.duration:u.duration in i.fx.speeds?i.fx.speeds[u.duration]:i.fx.speeds._default,(u.queue==null||u.queue===!0)&&(u.queue="fx"),u.old=u.complete,u.complete=function(){i.isFunction(u.old)&&u.old.call(this);u.queue&&i.dequeue(this,u.queue)},u};i.easing={linear:function(n){return n},swing:function(n){return.5-Math.cos(n*Math.PI)/2}};i.timers=[];i.fx=e.prototype.init;i.fx.tick=function(){var u,n=i.timers,r=0;for(b=i.now();r<n.length;r++)u=n[r],u()||n[r]!==u||n.splice(r--,1);n.length||i.fx.stop();b=t};i.fx.timer=function(n){n()&&i.timers.push(n)&&i.fx.start()};i.fx.interval=13;i.fx.start=function(){at||(at=setInterval(i.fx.tick,i.fx.interval))};i.fx.stop=function(){clearInterval(at);at=null};i.fx.speeds={slow:600,fast:200,_default:400};i.fx.step={};i.expr&&i.expr.filters&&(i.expr.filters.animated=function(n){return i.grep(i.timers,function(t){return n===t.elem}).length});i.fn.offset=function(n){if(arguments.length)return n===t?this:this.each(function(t){i.offset.setOffset(this,n,t)});var u,e,r=this[0],f={top:0,left:0},o=r&&r.ownerDocument;if(o)return(u=o.documentElement,!i.contains(u,r))?f:(typeof r.getBoundingClientRect!==rt&&(f=r.getBoundingClientRect()),e=eu(o),{top:f.top+e.pageYOffset-u.clientTop,left:f.left+e.pageXOffset-u.clientLeft})};i.offset={setOffset:function(n,t,r){var e,o,s,h,u,c,v,l=i.css(n,"position"),a=i(n),f={};l==="static"&&(n.style.position="relative");u=a.offset();s=i.css(n,"top");c=i.css(n,"left");v=(l==="absolute"||l==="fixed")&&(s+c).indexOf("auto")>-1;v?(e=a.position(),h=e.top,o=e.left):(h=parseFloat(s)||0,o=parseFloat(c)||0);i.isFunction(t)&&(t=t.call(n,r,u));t.top!=null&&(f.top=t.top-u.top+h);t.left!=null&&(f.left=t.left-u.left+o);"using"in t?t.using.call(n,f):a.css(f)}};i.fn.extend({position:function(){if(this[0]){var n,r,u=this[0],t={top:0,left:0};return i.css(u,"position")==="fixed"?r=u.getBoundingClientRect():(n=this.offsetParent(),r=this.offset(),i.nodeName(n[0],"html")||(t=n.offset()),t.top+=i.css(n[0],"borderTopWidth",!0),t.left+=i.css(n[0],"borderLeftWidth",!0)),{top:r.top-t.top-i.css(u,"marginTop",!0),left:r.left-t.left-i.css(u,"marginLeft",!0)}}},offsetParent:function(){return this.map(function(){for(var n=this.offsetParent||hi;n&&!i.nodeName(n,"html")&&i.css(n,"position")==="static";)n=n.offsetParent;return n||hi})}});i.each({scrollLeft:"pageXOffset",scrollTop:"pageYOffset"},function(r,u){var f="pageYOffset"===u;i.fn[r]=function(e){return i.access(this,function(i,r,e){var o=eu(i);if(e===t)return o?o[u]:i[r];o?o.scrollTo(f?n.pageXOffset:e,f?e:n.pageYOffset):i[r]=e},r,e,arguments.length,null)}});i.each({Height:"height",Width:"width"},function(n,r){i.each({padding:"inner"+n,content:r,"":"outer"+n},function(u,f){i.fn[f]=function(f,e){var o=arguments.length&&(u||typeof f!="boolean"),s=u||(f===!0||e===!0?"margin":"border");return i.access(this,function(r,u,f){var e;return i.isWindow(r)?r.document.documentElement["client"+n]:r.nodeType===9?(e=r.documentElement,Math.max(r.body["scroll"+n],e["scroll"+n],r.body["offset"+n],e["offset"+n],e["client"+n])):f===t?i.css(r,u,s):i.style(r,u,f,s)},r,o?f:t,o,null)}})});i.fn.size=function(){return this.length};i.fn.andSelf=i.fn.addBack;typeof module=="object"&&typeof module.exports=="object"?module.exports=i:typeof define=="function"&&define.amd&&define("jquery",[],function(){return i});typeof n=="object"&&typeof n.document=="object"&&(n.jQuery=n.$=i)})(window);
(function(){return;var t,n})();
window.Prototype&&(delete Object.prototype.toJSON,delete Array.prototype.toJSON,delete Hash.prototype.toJSON,delete String.prototype.toJSON);this.JSON||(this.JSON={}),function(){function i(n){return n<10?"0"+n:n}function o(n){return e.lastIndex=0,e.test(n)?'"'+n.replace(e,function(n){var t=s[n];return typeof t=="string"?t:"\\u"+("0000"+n.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+n+'"'}function u(i,f){var c,l,s,a,v=n,h,e=f[i];typeof t=="function"&&(e=t.call(f,i,e));switch(typeof e){case"string":return o(e);case"number":return isFinite(e)?String(e):"null";case"boolean":case"null":return String(e);case"object":if(!e)return"null";if(n+=r,h=[],Object.prototype.toString.apply(e)==="[object Array]"){for(a=e.length,c=0;c<a;c+=1)h[c]=u(c,e)||"null";return s=h.length===0?"[]":n?"[\n"+n+h.join(",\n"+n)+"\n"+v+"]":"["+h.join(",")+"]",n=v,s}if(t&&typeof t=="object")for(a=t.length,c=0;c<a;c+=1)l=t[c],typeof l=="string"&&(s=u(l,e),s&&h.push(o(l)+(n?": ":":")+s));else for(l in e)Object.hasOwnProperty.call(e,l)&&(s=u(l,e),s&&h.push(o(l)+(n?": ":":")+s));return s=h.length===0?"{}":n?"{\n"+n+h.join(",\n"+n)+"\n"+v+"}":"{"+h.join(",")+"}",n=v,s}}typeof Date.prototype.toJSON!="function"&&(Date.prototype.toJSON=function(){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+i(this.getUTCMonth()+1)+"-"+i(this.getUTCDate())+"T"+i(this.getUTCHours())+":"+i(this.getUTCMinutes())+":"+i(this.getUTCSeconds())+"Z":null},String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(){return this.valueOf()});var f=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,e=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,n,r,s={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},t;typeof JSON.encode!="function"&&(JSON.encode=function(i,f,e){var o;if(n="",r="",typeof e=="number")for(o=0;o<e;o+=1)r+=" ";else typeof e=="string"&&(r=e);if(t=f,f&&typeof f!="function"&&(typeof f!="object"||typeof f.length!="number"))throw new Error("JSON.encode");return u("",{"":i})});typeof JSON.parse!="function"&&(JSON.parse=function(n,t){function r(n,i){var f,e,u=n[i];if(u&&typeof u=="object")for(f in u)Object.hasOwnProperty.call(u,f)&&(e=r(u,f),e!==undefined?u[f]=e:delete u[f]);return t.call(n,i,u)}var i;if(n=String(n),f.lastIndex=0,f.test(n)&&(n=n.replace(f,function(n){return"\\u"+("0000"+n.charCodeAt(0).toString(16)).slice(-4)})),/^[\],:{}\s]*$/.test(n.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,"")))return i=eval("("+n+")"),typeof t=="function"?r({"":i},""):i;throw new SyntaxError("JSON.parse");})}();
(function(n){var t={undHash:/_|-/,colons:/::/,words:/([A-Z]+)([A-Z][a-z])/g,lowUp:/([a-z\d])([A-Z])/g,dash:/([a-z\d])([A-Z])/g,replacer:/\{([^\}]+)\}/g,dot:/\./},u=function(n,t,i){return n[t]||i&&(n[t]={})},f=function(n){var t=typeof n;return t&&(t=="function"||t=="object")},e=function(i,r,e){var h=i?i.split(t.dot):[],l=h.length,a=n.isArray(r)?r:[r||window],o,c,s,v=0;if(l==0)return a[0];while(o=a[v++]){for(s=0;s<l-1&&f(o);s++)o=u(o,h[s],e);if(f(o)&&(c=u(o,h[s],e),c!==undefined))return e===!1&&delete o[h[s]],c}},r=n.String=n.extend(n.String||{},{getObject:e,capitalize:function(n){return n.charAt(0).toUpperCase()+n.substr(1)},camelize:function(n){return n=r.classize(n),n.charAt(0).toLowerCase()+n.substr(1)},classize:function(n,i){for(var u=n.split(t.undHash),f=0;f<u.length;f++)u[f]=r.capitalize(u[f]);return u.join(i||"")},niceName:function(){r.classize(parts[i]," ")},underscore:function(n){return n.replace(t.colons,"/").replace(t.words,"$1_$2").replace(t.lowUp,"$1_$2").replace(t.dash,"_").toLowerCase()},sub:function(n,i,r){var u=[];return u.push(n.replace(t.replacer,function(n,t){var f=e(t,i,typeof r=="boolean"?!r:r),o=typeof f;return(o==="object"||o==="function")&&o!==null?(u.push(f),""):""+f})),u.length<=1?u[0]:u}})})(jQuery),function(n){var i=!1,f=n.makeArray,e=n.isFunction,r=n.isArray,u=n.extend,o=function(n,t){return n.concat(f(t))},h=/xyz/.test(function(){xyz})?/\b_super\b/:/.*/,s=function(n,t,i){i=i||n;for(var r in n)i[r]=e(n[r])&&e(t[r])&&h.test(n[r])?function(n,i){return function(){var u=this._super,r;return this._super=t[n],r=i.apply(this,arguments),this._super=u,r}}(r,n[r]):n[r]},t=n.Class=function(){arguments.length&&t.extend.apply(t,arguments)};u(t,{callback:function(n){var i=f(arguments),t;return n=i.shift(),r(n)||(n=[n]),t=this,function(){for(var u=o(i,arguments),s,h=n.length,e=0,f;e<h;e++)(f=n[e],f)&&(s=typeof f=="string",s&&t._set_called&&(t.called=f),u=(s?t[f]:f).apply(t,u||[]),e<h-1&&(u=!r(u)||u._use_call?[u]:u));return u}},getObject:n.String.getObject,newInstance:function(){var n=this.rawInstance(),t;return n.setup&&(t=n.setup.apply(n,arguments)),n.init&&n.init.apply(n,r(t)?t:arguments),n},setup:function(n){return this.defaults=u(!0,{},n.defaults,this.defaults),arguments},rawInstance:function(){i=!0;var n=new this;return i=!1,n},extend:function(n,r,f){function e(){if(!i)return this.constructor!==e&&arguments.length?arguments.callee.extend.apply(arguments.callee,arguments):this.Class.newInstance.apply(this.Class,arguments)}var l,a,h,v,b,c,w;typeof n!="string"&&(f=r,r=n,n=null);f||(f=r,r=null);f=f||{};l=this;a=this.prototype;i=!0;c=new this;i=!1;s(f,a,c);for(h in this)this.hasOwnProperty(h)&&(e[h]=this[h]);if(s(r,this,e),n){var y=n.split(/\./),v=y.pop(),p=t.getObject(y.join("."),window,!0),b=p;p[v]=e}return u(e,{prototype:c,namespace:b,shortName:v,constructor:e,fullName:n}),e.prototype.Class=e.prototype.constructor=e,w=e.setup.apply(e,o([l],arguments)),e.init&&e.init.apply(e,w||[]),e}});t.prototype.callback=t.callback}(jQuery);
(function(n){n()})(function(){return!function(n,t,i){function nt(){}function lr(n,t){if(t)return"'"+n.split("'").join("\\'").split('\\"').join('\\\\\\"').replace(/\n/g,"\\n").replace(/\r/g,"\\r").replace(/\t/g,"\\t")+"'";var i=n.charAt(0),r=n.substring(1);return"="===i?"+("+r+")+":":"===i?"+$kendoHtmlEncode("+r+")+":";"+n+";$kendoOutput+="}function f(n,t,i){return n+="",t=t||2,i=t-n.length,i?ai[t].substring(0,i)+n:n}function gt(n){var u=n.css(r.support.transitions.css+"box-shadow")||n.css("box-shadow"),t=u?u.match(ou)||[0,0,0,0,0]:[0,0,0,0,0],i=a.max(+t[3],+(t[4]||0));return{left:-t[1]+i,right:+t[1]+i,bottom:+t[2]+i}}function ar(t,i){var s,r,f,e,h,c,o,l,v=u.browser,y="rtl"==t.css("direction");return t.parent().hasClass("k-animation-container")?(o=t.parent(".k-animation-container"),l=o[0].style,o.is(":hidden")&&o.show(),s=et.test(l.width)||et.test(l.height),s||o.css({width:t.outerWidth(),height:t.outerHeight(),boxSizing:"content-box",mozBoxSizing:"content-box",webkitBoxSizing:"content-box"})):(r=gt(t),f=t[0].style.width,e=t[0].style.height,h=et.test(f),c=et.test(e),v.opera&&(r.left=r.right=r.bottom=5),s=h||c,!h&&(!i||i&&f)&&(f=t.outerWidth()),!c&&(!i||i&&e)&&(e=t.outerHeight()),t.wrap(n("<div/>").addClass("k-animation-container").css({width:f,height:e,marginLeft:r.left*(y?1:-1),paddingLeft:r.left,paddingRight:r.right,paddingBottom:r.bottom})),s&&t.css({width:"100%",height:"100%",boxSizing:"border-box",mozBoxSizing:"border-box",webkitBoxSizing:"border-box"})),v.msie&&a.floor(v.version)<=7&&(t.css({zoom:1}),t.children(".k-menu").width(t.width())),t.parent()}function ht(n){for(var t=1,i=arguments.length,t=1;i>t;t++)ni(n,arguments[t]);return n}function ni(n,t){var u,i,e,f,o,s=r.data.ObservableArray,h=r.data.LazyObservableArray,c=r.data.DataSource,l=r.data.HierarchicalDataSource;for(u in t)i=t[u],e=typeof i,f=e===d&&null!==i?i.constructor:null,f&&f!==Array&&f!==s&&f!==h&&f!==c&&f!==l?i instanceof Date?n[u]=new Date(i.getTime()):g(i.clone)?n[u]=i.clone():(o=n[u],n[u]=typeof o===d?o||{}:{},ni(n[u],i)):e!==st&&(n[u]=i);return n}function ct(n,t,r){for(var u in t)if(t.hasOwnProperty(u)&&t[u].test(n))return u;return r!==i?r:n}function vr(n){return n.replace(/([a-z][A-Z])/g,function(n){return n.charAt(0)+"-"+n.charAt(1).toLowerCase()})}function ti(n){return n.replace(/\-(\w)/g,function(n,t){return t.toUpperCase()})}function yr(t,i){var u,f={};return document.defaultView&&document.defaultView.getComputedStyle?(u=document.defaultView.getComputedStyle(t,""),i&&n.each(i,function(n,t){f[t]=u.getPropertyValue(t)})):(u=t.currentStyle,i&&n.each(i,function(n,t){f[t]=u[ti(t)]})),r.size(f)||(f=u),f}function pr(n){var t,i=0;for(t in n)n.hasOwnProperty(t)&&"toJSON"!=t&&i++;return i}function wr(n,i,r){i||(i="offset");var f=n[i]();return u.browser.msie&&(u.pointers||u.msPointers)&&!r&&(f.top-=t.pageYOffset-document.documentElement.scrollTop,f.left-=t.pageXOffset-document.documentElement.scrollLeft),f}function br(n){var t={};return rt("string"==typeof n?n.split(" "):n,function(n){t[n]=this}),t}function kr(n){return new r.effects.Element(n)}function dr(n,t,i,r){return typeof n===o&&(g(t)&&(r=t,t=400,i=!1),g(i)&&(r=i,i=!1),typeof t===sr&&(i=t,t=400),n={effects:n,duration:t,reverse:i,complete:r}),h({effects:{},duration:400,reverse:!1,init:ut,teardown:ut,hide:!1},n,{completeCallback:n.complete,complete:ut})}function ii(t,i,r,u,f){for(var e,o=0,s=t.length;s>o;o++)e=n(t[o]),e.queue(function(){w.promise(e,dr(i,r,u,f))});return t}function gr(n,t,i,r){return t&&(t=t.split(" "),rt(t,function(t,i){n.toggleClass(i,r)})),n}function nu(n){return(""+n).replace(yi,"&amp;").replace(pi,"&lt;").replace(ki,"&gt;").replace(wi,"&quot;").replace(bi,"&#39;")}function lt(n,t){var u;return 0===t.indexOf("data")&&(t=t.substring(4),t=t.charAt(0).toLowerCase()+t.substring(1)),t=t.replace(rr,"-$1"),u=n.getAttribute("data-"+r.ns+t),null===u?u=i:"null"===u?u=null:"true"===u?u=!0:"false"===u?u=!1:su.test(u)?u=parseFloat(u):tr.test(u)&&!ir.test(u)&&(u=Function("return ("+u+")")()),u}function ri(t,u){var e,f,o={};for(e in u)f=lt(t,e),f!==i&&(nr.test(e)&&(f=r.template(n("#"+f).html())),o[e]=f);return o}function tu(t,i){return n.contains(t,i)?-1:1}function iu(){var t=n(this);return n.inArray(t.attr("data-"+r.ns+"role"),["slider","rangeslider"])>-1||t.is(":visible")}function ru(n,t){var i=n.nodeName.toLowerCase();return(/input|select|textarea|button|object/.test(i)?!n.disabled:"a"===i?n.href||t:t)&&uu(n)}function uu(t){return!n(t).parents().addBack().filter(function(){return"hidden"===n.css(this,"visibility")||n.expr.filters.hidden(this)}).length}function s(n,t){return new s.fn.init(n,t)}var p,g,ui,fi,tt,ei,oi,si,hi,ci,li,ai,vi,w,yi,pi,wi,bi,ki,at,di,gi,b,vt,nr,tr,ir,rr,yt,pt,wt,ur,e,k,fr,bt,it,er,or,v,r=t.kendo=t.kendo||{cultures:{}},h=n.extend,rt=n.each,fu=n.isArray,kt=n.proxy,ut=n.noop,a=Math,ft=t.JSON||{},u={},et=/%/,eu=/\{(\d+)(:[^\}]+)?\}/g,ou=/(\d+(?:\.?)\d*)px\s*(\d+(?:\.?)\d*)px\s*(\d+(?:\.?)\d*)px\s*(\d+)?/i,su=/^(\+|-?)\d+(\.?)\d*$/,c="function",o="string",y="number",d="object",ot="null",sr="boolean",st="undefined",hr={},cr={},dt=[].slice,l=t.Globalize;r.version="2014.3.1411";nt.extend=function(n){var t,r,u=function(){},f=this,i=n&&n.init?n.init:function(){f.apply(this,arguments)};u.prototype=f.prototype;r=i.fn=i.prototype=new u;for(t in n)r[t]=null!=n[t]&&n[t].constructor===Object?h(!0,{},u.prototype[t],n[t]):n[t];return r.constructor=i,i.extend=f.extend,i};nt.prototype._initOptions=function(n){this.options=ht({},this.options,n)};g=r.isFunction=function(n){return"function"==typeof n};ui=function(){this._defaultPrevented=!0};fi=function(){return this._defaultPrevented===!0};tt=nt.extend({init:function(){this._events={}},bind:function(n,t,r){var u,h,s,f,l,e=this,a=typeof n===o?[n]:n,v=typeof t===c;if(t===i){for(u in n)e.bind(u,n[u]);return e}for(u=0,h=a.length;h>u;u++)n=a[u],f=v?t:t[n],f&&(r&&(s=f,f=function(){e.unbind(n,f);s.apply(e,arguments)},f.original=s),l=e._events[n]=e._events[n]||[],l.push(f));return e},one:function(n,t){return this.bind(n,t,!0)},first:function(n,t){for(var r,e,u=this,s=typeof n===o?[n]:n,h=typeof t===c,i=0,f=s.length;f>i;i++)n=s[i],r=h?t:t[n],r&&(e=u._events[n]=u._events[n]||[],e.unshift(r));return u},trigger:function(n,t){var r,f,u=this,i=u._events[n];if(i){for(t=t||{},t.sender=u,t._defaultPrevented=!1,t.preventDefault=ui,t.isDefaultPrevented=fi,i=i.slice(),r=0,f=i.length;f>r;r++)i[r].call(u,t);return t._defaultPrevented===!0}return!1},unbind:function(n,t){var r,f=this,u=f._events[n];if(n===i)f._events={};else if(u)if(t)for(r=u.length-1;r>=0;r--)(u[r]===t||u[r].original===t)&&u.splice(r,1);else f._events[n]=[];return f}});ei=/^\w+/;oi=/\$\{([^}]*)\}/g;si=/\\\}/g;hi=/__CURLY__/g;ci=/\\#/g;li=/__SHARP__/g;ai=["","0","00","000","0000"];p={paramName:"data",useWithBlock:!0,render:function(n,t){for(var u="",i=0,r=t.length;r>i;i++)u+=n(t[i]);return u},compile:function(n,t){var e,f,u,o=h({},this,t),s=o.paramName,l=s.match(ei)[0],c=o.useWithBlock,i="var $kendoOutput, $kendoHtmlEncode = kendo.htmlEncode;";if(g(n))return n;for(i+=c?"with("+s+"){":"",i+="$kendoOutput=",f=n.replace(si,"__CURLY__").replace(oi,"#=$kendoHtmlEncode($1)#").replace(hi,"}").replace(ci,"__SHARP__").split("#"),u=0;f.length>u;u++)i+=lr(f[u],u%2==0);i+=c?";}":";";i+="return $kendoOutput;";i=i.replace(li,"#");try{return e=Function(l,i),e._slotCount=Math.floor(f.length/2),e}catch(a){throw Error(r.format("Invalid template:'{0}' Generated code:'{1}'",n,i));}}},function(){function u(n){return e.lastIndex=0,e.test(n)?'"'+n.replace(e,function(n){var t=s[n];return typeof t===o?t:"\\u"+("0000"+n.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+n+'"'}function i(f,e){var l,p,a,b,v,w,k=n,s=e[f];if(s&&typeof s===d&&typeof s.toJSON===c&&(s=s.toJSON(f)),typeof t===c&&(s=t.call(e,f,s)),w=typeof s,w===o)return u(s);if(w===y)return isFinite(s)?s+"":ot;if(w===sr||w===ot)return s+"";if(w===d){if(!s)return ot;if(n+=r,v=[],"[object Array]"===h.apply(s)){for(b=s.length,l=0;b>l;l++)v[l]=i(l,s)||ot;return a=0===v.length?"[]":n?"[\n"+n+v.join(",\n"+n)+"\n"+k+"]":"["+v.join(",")+"]",n=k,a}if(t&&typeof t===d)for(b=t.length,l=0;b>l;l++)typeof t[l]===o&&(p=t[l],a=i(p,s),a&&v.push(u(p)+(n?": ":":")+a));else for(p in s)Object.hasOwnProperty.call(s,p)&&(a=i(p,s),a&&v.push(u(p)+(n?": ":":")+a));return a=0===v.length?"{}":n?"{\n"+n+v.join(",\n"+n)+"\n"+k+"}":"{"+v.join(",")+"}",n=k,a}}var n,r,t,e=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,s={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},h={}.toString;typeof Date.prototype.toJSON!==c&&(Date.prototype.toJSON=function(){var n=this;return isFinite(n.valueOf())?f(n.getUTCFullYear(),4)+"-"+f(n.getUTCMonth()+1)+"-"+f(n.getUTCDate())+"T"+f(n.getUTCHours())+":"+f(n.getUTCMinutes())+":"+f(n.getUTCSeconds())+"Z":null},String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(){return this.valueOf()});typeof ft.stringify!==c&&(ft.stringify=function(u,f,e){var s;if(n="",r="",typeof e===y)for(s=0;e>s;s+=1)r+=" ";else typeof e===o&&(r=e);if(t=f,f&&typeof f!==c&&(typeof f!==d||typeof f.length!==y))throw Error("JSON.stringify");return i("",{"":u})})}(),function(){function p(n){if(n){if(n.numberFormat)return n;if(typeof n===o){var t=r.cultures;return t[n]||t[n.split("-")[0]]||null}return null}return null}function w(n){return n&&(n=p(n)),n||r.cultures.current}function d(n){n.groupSizes=n.groupSize;n.percent.groupSizes=n.percent.groupSize;n.currency.groupSizes=n.currency.groupSize}function g(n,t,r){r=w(r);var u=r.calendars.standard,e=u.days,o=u.months;return t=u.patterns[t]||t,t.replace(tt,function(t){var s,r,h;return"d"===t?r=n.getDate():"dd"===t?r=f(n.getDate()):"ddd"===t?r=e.namesAbbr[n.getDay()]:"dddd"===t?r=e.names[n.getDay()]:"M"===t?r=n.getMonth()+1:"MM"===t?r=f(n.getMonth()+1):"MMM"===t?r=o.namesAbbr[n.getMonth()]:"MMMM"===t?r=o.names[n.getMonth()]:"yy"===t?r=f(n.getFullYear()%100):"yyyy"===t?r=f(n.getFullYear(),4):"h"===t?r=n.getHours()%12||12:"hh"===t?r=f(n.getHours()%12||12):"H"===t?r=n.getHours():"HH"===t?r=f(n.getHours()):"m"===t?r=n.getMinutes():"mm"===t?r=f(n.getMinutes()):"s"===t?r=n.getSeconds():"ss"===t?r=f(n.getSeconds()):"f"===t?r=a.floor(n.getMilliseconds()/100):"ff"===t?(r=n.getMilliseconds(),r>99&&(r=a.floor(r/10)),r=f(r)):"fff"===t?r=f(n.getMilliseconds(),3):"tt"===t?r=n.getHours()<12?u.AM[0]:u.PM[0]:"zzz"===t?(s=n.getTimezoneOffset(),h=0>s,r=(""+a.abs(s/60)).split(".")[0],s=a.abs(s)-60*r,r=(h?"+":"-")+f(r),r+=":"+f(s)):("zz"===t||"z"===t)&&(r=n.getTimezoneOffset()/60,h=0>r,r=(""+a.abs(r)).split(".")[0],r=(h?"+":"-")+("zz"===t?f(r):r)),r!==i?r:t.slice(1,t.length-1)})}function nt(n,r,f){f=w(f);var vt,ft,ot,yt,bt,b,p,nt,ei,o,tt,d,kt,ri,g,a,l,pt,dt,ui,gt,fi,ct,c=f.numberFormat,st=c.groupSize[0],lt=c[v],wt=c[u],at=c.decimals,ni=c.pattern[0],ti=[],et=0>n,ii=t,y=t,ht=-1;if(n===i)return t;if(!isFinite(n))return n;if(!r)return f.name.length?n.toLocaleString():""+n;if(bt=it.exec(r)){if(r=bt[1].toLowerCase(),ft="c"===r,ot="p"===r,(ft||ot)&&(c=ft?c.currency:c.percent,st=c.groupSize[0],lt=c[v],wt=c[u],at=c.decimals,vt=c.symbol,ni=c.pattern[et?0:1]),yt=bt[2],yt&&(at=+yt),"e"===r)return yt?n.toExponential(at):n.toExponential();if(ot&&(n*=100),n=e(n,at),et=0>n,n=n.split(u),b=n[0],p=n[1],et&&(b=b.substring(1)),y=b,nt=b.length,nt>=st)for(y=t,o=0;nt>o;o++)o>0&&(nt-o)%st==0&&(y+=lt),y+=b.charAt(o);if(p&&(y+=wt+p),"n"===r&&!et)return y;for(n=t,o=0,tt=ni.length;tt>o;o++)d=ni.charAt(o),n+="n"===d?y:"$"===d||"%"===d?vt:d;return n}if(et&&(n=-n),(r.indexOf("'")>-1||r.indexOf('"')>-1||r.indexOf("\\")>-1)&&(r=r.replace(rt,function(n){var t=n.charAt(0).replace("\\",""),i=n.slice(1).replace(t,"");return ti.push(i),k})),r=r.split(";"),et&&r[1])r=r[1],ri=!0;else if(0===n){if(r=r[2]||r[0],-1==r.indexOf(s)&&-1==r.indexOf(h))return r}else r=r[0];if(ui=r.indexOf("%"),gt=r.indexOf("$"),ot=-1!=ui,ft=-1!=gt,ot&&(n*=100),ft&&"\\"===r[gt-1]&&(r=r.split("\\").join(""),ft=!1),(ft||ot)&&(c=ft?c.currency:c.percent,st=c.groupSize[0],lt=c[v],wt=c[u],at=c.decimals,vt=c.symbol),kt=r.indexOf(v)>-1,kt&&(r=r.replace(ut,t)),g=r.indexOf(u),tt=r.length,-1!=g?(p=(""+n).split("e"),p=p[1]?e(n,Math.abs(p[1])):p[0],p=p.split(u)[1]||t,l=r.lastIndexOf(h)-g,a=r.lastIndexOf(s)-g,pt=l>-1,dt=a>-1,o=p.length,pt||dt||(r=r.substring(0,g)+r.substring(g+1),tt=r.length,g=-1,o=0),pt&&l>a?o=l:a>l&&(dt&&o>a?o=a:pt&&l>o&&(o=l)),o>-1&&(n=e(n,o))):n=e(n),a=r.indexOf(s),fi=l=r.indexOf(h),ht=-1==a&&-1!=l?l:-1!=a&&-1==l?a:a>l?l:a,a=r.lastIndexOf(s),l=r.lastIndexOf(h),ct=-1==a&&-1!=l?l:-1!=a&&-1==l?a:a>l?a:l,ht==tt&&(ct=ht),-1!=ht){if(y=(""+n).split(u),b=y[0],p=y[1]||t,nt=b.length,ei=p.length,et&&-1*n>=0&&(et=!1),kt)if(nt===st&&g-fi>nt)b=lt+b;else if(nt>st){for(y=t,o=0;nt>o;o++)o>0&&(nt-o)%st==0&&(y+=lt),y+=b.charAt(o);b=y}for(n=r.substring(0,ht),et&&!ri&&(n+="-"),o=ht;tt>o;o++){if(d=r.charAt(o),-1==g){if(nt>ct-o){n+=b;break}}else if(-1!=l&&o>l&&(ii=t),nt>=g-o&&g-o>-1&&(n+=b,o=g),g===o){n+=(p?wt:t)+p;o+=ct-g+1;continue}d===h?(n+=d,ii=d):d===s&&(n+=ii)}if(ct>=ht&&(n+=r.substring(ct+1)),ft||ot){for(y=t,o=0,tt=n.length;tt>o;o++)d=n.charAt(o),y+="$"===d||"%"===d?vt:d;n=y}if(tt=ti.length)for(o=0;tt>o;o++)n=n.replace(k,ti[o])}return n}var e,c,tt=/dddd|ddd|dd|d|MMMM|MMM|MM|M|yyyy|yy|HH|H|hh|h|mm|m|fff|ff|f|tt|ss|s|zzz|zz|z|"[^"]*"|'[^']*'/g,it=/^(n|c|p|e)(\d*)$/i,rt=/(\\.)|(['][^']*[']?)|(["][^"]*["]?)/g,ut=/\,/g,t="",u=".",v=",",s="#",h="0",k="??",b="en-US",ft={}.toString;r.cultures["en-US"]={name:b,numberFormat:{pattern:["-n"],decimals:2,",":",",".":".",groupSize:[3],percent:{pattern:["-n %","n %"],decimals:2,",":",",".":".",groupSize:[3],symbol:"%"},currency:{pattern:["($n)","$n"],decimals:2,",":",",".":".",groupSize:[3],symbol:"$"}},calendars:{standard:{days:{names:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],namesAbbr:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],namesShort:["Su","Mo","Tu","We","Th","Fr","Sa"]},months:{names:["January","February","March","April","May","June","July","August","September","October","November","December"],namesAbbr:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]},AM:["AM","am","AM"],PM:["PM","pm","PM"],patterns:{d:"M/d/yyyy",D:"dddd, MMMM dd, yyyy",F:"dddd, MMMM dd, yyyy h:mm:ss tt",g:"M/d/yyyy h:mm tt",G:"M/d/yyyy h:mm:ss tt",m:"MMMM dd",M:"MMMM dd",s:"yyyy'-'MM'-'ddTHH':'mm':'ss",t:"h:mm tt",T:"h:mm:ss tt",u:"yyyy'-'MM'-'dd HH':'mm':'ss'Z'",y:"MMMM, yyyy",Y:"MMMM, yyyy"},"/":"/",":":":",firstDay:0,twoDigitYearMax:2029}}};r.culture=function(n){var t,u=r.cultures;return n===i?u.current:(t=p(n)||u[b],t.calendar=t.calendars.standard,u.current=t,l&&!l.load&&d(t.numberFormat),i)};r.findCulture=p;r.getCulture=w;r.culture(b);e=function(n,t){return t=t||0,n=(""+n).split("e"),n=Math.round(+(n[0]+"e"+(n[1]?+n[1]+t:t))),n=(""+n).split("e"),n=+(n[0]+"e"+(n[1]?+n[1]-t:-t)),n.toFixed(t)};c=function(n,t,r){if(t){if("[object Date]"===ft.call(n))return g(n,t,r);if(typeof n===y)return nt(n,t,r)}return n!==i?n:""};l&&!l.load&&(c=function(t,i,r){return n.isPlainObject(r)&&(r=r.name),l.format(t,i,r)});r.format=function(n){var t=arguments;return n.replace(eu,function(n,i,r){var u=t[parseInt(i,10)+1];return c(u,r?r.substring(1):"")})};r._extractFormat=function(n){return"{0:"===n.slice(0,3)&&(n=n.slice(3,n.length-1)),n};r._activeElement=function(){try{return document.activeElement}catch(n){return document.documentElement.activeElement}};r._round=e;r.toString=c}(),function(){function t(n,t,i){return!(n>=t&&i>=n)}function c(n){return n.charAt(0)}function u(t){return n.map(t,c)}function a(n,t){t||23!==n.getHours()||n.setHours(n.getHours()+2)}function v(n){for(var t=0,r=n.length,i=[];r>t;t++)i[t]=(n[t]+"").toLowerCase();return i}function f(n){var t,i={};for(t in n)i[t]=v(n[t]);return i}function p(n,r,e){if(!n)return null;var l,o,dt,yt,pt,wt,ft,ht,ct,p,g,gt,ot,w=function(n){for(var t=0;r[ut]===n;)t++,ut++;return t>0&&(ut-=1),t},tt=function(t){var r=s[t]||RegExp("^\\d{1,"+t+"}"),i=n.substr(y,t).match(r);return i?(i=i[0],y+=i.length,parseInt(i,10)):null},lt=function(t,i){for(var f,e,r,u=0,o=t.length;o>u;u++)if(f=t[u],e=f.length,r=n.substr(y,e),i&&(r=r.toLowerCase()),r==f)return y+=e,u+1;return null},at=function(){var t=!1;return n.charAt(y)===r[ut]&&(y++,t=!0),t},v=e.calendars.standard,c=null,it=null,b=null,h=null,rt=null,et=null,nt=null,ut=0,y=0,bt=!1,kt=new Date,vt=v.twoDigitYearMax||2029,st=kt.getFullYear();for(r||(r="d"),yt=v.patterns[r],yt&&(r=yt),r=r.split(""),dt=r.length;dt>ut;ut++)if(l=r[ut],bt)"'"===l?bt=!1:at();else if("d"===l){if(o=w("d"),v._lowerDays||(v._lowerDays=f(v.days)),b=3>o?tt(2):lt(v._lowerDays[3==o?"namesAbbr":"names"],!0),null===b||t(b,1,31))return null}else if("M"===l){if(o=w("M"),v._lowerMonths||(v._lowerMonths=f(v.months)),it=3>o?tt(2):lt(v._lowerMonths[3==o?"namesAbbr":"names"],!0),null===it||t(it,1,12))return null;it-=1}else if("y"===l){if(o=w("y"),c=tt(o),null===c)return null;2==o&&("string"==typeof vt&&(vt=st+parseInt(vt,10)),c=st-st%100+c,c>vt&&(c-=100))}else if("h"===l){if(w("h"),h=tt(2),12==h&&(h=0),null===h||t(h,0,11))return null}else if("H"===l){if(w("H"),h=tt(2),null===h||t(h,0,23))return null}else if("m"===l){if(w("m"),rt=tt(2),null===rt||t(rt,0,59))return null}else if("s"===l){if(w("s"),et=tt(2),null===et||t(et,0,59))return null}else if("f"===l){if(o=w("f"),ot=n.substr(y,o).match(s[3]),nt=tt(o),null!==nt&&(ot=ot[0].length,3>ot&&(nt*=Math.pow(10,3-ot)),o>3&&(nt=parseInt((""+nt).substring(0,3),10))),null===nt||t(nt,0,999))return null}else if("t"===l){if(o=w("t"),ht=v.AM,ct=v.PM,1===o&&(ht=u(ht),ct=u(ct)),pt=lt(ct),!pt&&!lt(ht))return null}else if("z"===l){if(wt=!0,o=w("z"),"Z"===n.substr(y,1)){at();continue}if((ft=n.substr(y,6).match(o>2?d:k),!ft)||(ft=ft[0].split(":"),p=ft[0],g=ft[1],!g&&p.length>3&&(y=p.length-2,g=p.substring(y),p=p.substring(0,y)),p=parseInt(p,10),t(p,-12,13))||o>2&&(g=parseInt(g,10),isNaN(g)||t(g,0,59)))return null}else if("'"===l)bt=!0,at();else if(!at())return null;return gt=null!==h||null!==rt||et||null,null===c&&null===it&&null===b&&gt?(c=st,it=kt.getMonth(),b=kt.getDate()):(null===c&&(c=st),null===b&&(b=1)),pt&&12>h&&(h+=12),wt?(p&&(h+=-p),g&&(rt+=-g),n=new Date(Date.UTC(c,it,b,h,rt,et,nt))):(n=new Date(c,it,b,h,rt,et,nt),a(n,h)),100>c&&n.setFullYear(c),n.getDate()!==b&&wt===i?null:n}function w(n){var t="-"===n.substr(0,1)?-1:1;return n=n.substring(1),n=60*parseInt(n.substr(0,2),10)+parseInt(n.substring(2),10),t*n}var e=/\u00A0/g,b=/[eE][\-+]?[0-9]+/,k=/[+|\-]\d{1,2}/,d=/[+|\-]\d{1,2}:?\d{2}/,g=/^\/Date\((.*?)\)\/$/,nt=/[+-]\d*/,o=["G","g","d","F","D","y","m","T","t"],s={2:/^\d{1,2}/,3:/^\d{1,3}/,4:/^\d{4}/},h={}.toString;r.parseDate=function(n,t,i){var f,u,s,c,e;if("[object Date]"===h.call(n))return n;if(f=0,u=null,n&&0===n.indexOf("/D")&&(u=g.exec(n)))return u=u[1],e=nt.exec(u.substring(1)),u=new Date(parseInt(u,10)),e&&(e=w(e[0]),u=r.timezone.apply(u,0),u=r.timezone.convert(u,0,-1*e)),u;if(i=r.getCulture(i),!t){for(t=[],c=i.calendar.patterns,s=o.length;s>f;f++)t[f]=c[o[f]];f=0;t=["yyyy/MM/dd HH:mm:ss","yyyy/MM/dd HH:mm","yyyy/MM/dd","ddd MMM dd yyyy HH:mm:ss","yyyy-MM-ddTHH:mm:ss.fffffffzzz","yyyy-MM-ddTHH:mm:ss.fffzzz","yyyy-MM-ddTHH:mm:sszzz","yyyy-MM-ddTHH:mm:ss.fffffff","yyyy-MM-ddTHH:mm:ss.fff","yyyy-MM-ddTHH:mmzzz","yyyy-MM-ddTHH:mmzz","yyyy-MM-ddTHH:mm:ss","yyyy-MM-ddTHH:mm","yyyy-MM-dd HH:mm:ss","yyyy-MM-dd HH:mm","yyyy-MM-dd","HH:mm:ss","HH:mm"].concat(t)}for(t=fu(t)?t:[t],s=t.length;s>f;f++)if(u=p(n,t[f],i))return u;return u};r.parseInt=function(n,t){var i=r.parseFloat(n,t);return i&&(i=0|i),i};r.parseFloat=function(n,t,i){if(!n&&0!==n)return null;if(typeof n===y)return n;n=""+n;t=r.getCulture(t);var f,h,u=t.numberFormat,c=u.percent,l=u.currency,s=l.symbol,a=c.symbol,o=n.indexOf("-");return b.test(n)?(n=parseFloat(n.replace(u["."],".")),isNaN(n)&&(n=null),n):o>0?null:(o=o>-1,n.indexOf(s)>-1||i&&i.toLowerCase().indexOf("c")>-1?(u=l,f=u.pattern[0].replace("$",s).split("n"),n.indexOf(f[0])>-1&&n.indexOf(f[1])>-1&&(n=n.replace(f[0],"").replace(f[1],""),o=!0)):n.indexOf(a)>-1&&(h=!0,u=c,s=a),n=n.replace("-","").replace(s,"").replace(e," ").split(u[","].replace(e," ")).join("").replace(u["."],"."),n=parseFloat(n),isNaN(n)?n=null:o&&(n*=-1),n&&h&&(n/=100),n)};l&&!l.load&&(r.parseDate=function(n,t,i){return"[object Date]"===h.call(n)?n:l.parseDate(n,t,i)},r.parseFloat=function(t,r){return typeof t===y?t:t===i||null===t?null:(n.isPlainObject(r)&&(r=r.name),t=l.parseFloat(t,r),isNaN(t)?null:t)})}(),function(){var h,s,c,e,f,r,l;u._scrollbar=i;u.scrollbar=function(n){if(isNaN(u._scrollbar)||n){var i,t=document.createElement("div");return t.style.cssText="overflow:scroll;overflow-x:hidden;zoom:1;clear:both;display:block",t.innerHTML="&nbsp;",document.body.appendChild(t),u._scrollbar=i=t.offsetWidth-t.scrollWidth,document.body.removeChild(t),i}return u._scrollbar};u.isRtl=function(t){return n(t).closest(".k-rtl").length>0};h=document.createElement("table");try{h.innerHTML="<tr><td><\/td><\/tr>";u.tbodyInnerHtml=!0}catch(a){u.tbodyInnerHtml=!1}u.touch="ontouchstart"in t;u.msPointers=t.MSPointerEvent;u.pointers=t.PointerEvent;s=u.transitions=!1;c=u.transforms=!1;e="HTMLElement"in t?HTMLElement.prototype:[];u.hasHW3D="WebKitCSSMatrix"in t&&"m11"in new t.WebKitCSSMatrix||"MozPerspective"in document.documentElement.style||"msPerspective"in document.documentElement.style;rt(["Moz","webkit","O","ms"],function(){var n,t=""+this,r=typeof h.style[t+"Transition"]===o;return r||typeof h.style[t+"Transform"]===o?(n=t.toLowerCase(),c={css:"ms"!=n?"-"+n+"-":"",prefix:t,event:"o"===n||"webkit"===n?n:""},r&&(s=c,s.event=s.event?s.event+"TransitionEnd":"transitionend"),!1):i});h=null;u.transforms=c;u.transitions=s;u.devicePixelRatio=t.devicePixelRatio===i?1:t.devicePixelRatio;try{u.screenWidth=t.outerWidth||t.screen?t.screen.availWidth:t.innerWidth;u.screenHeight=t.outerHeight||t.screen?t.screen.availHeight:t.innerHeight}catch(a){u.screenWidth=t.screen.availWidth;u.screenHeight=t.screen.availHeight}u.detectOS=function(n){var f,r,i=!1,e=[],s=!/mobile safari/i.test(n),o={wp:/(Windows Phone(?: OS)?)\s(\d+)\.(\d+(\.\d+)?)/,fire:/(Silk)\/(\d+)\.(\d+(\.\d+)?)/,android:/(Android|Android.*(?:Opera|Firefox).*?\/)\s*(\d+)\.(\d+(\.\d+)?)/,iphone:/(iPhone|iPod).*OS\s+(\d+)[\._]([\d\._]+)/,ipad:/(iPad).*OS\s+(\d+)[\._]([\d_]+)/,meego:/(MeeGo).+NokiaBrowser\/(\d+)\.([\d\._]+)/,webos:/(webOS)\/(\d+)\.(\d+(\.\d+)?)/,blackberry:/(BlackBerry|BB10).*?Version\/(\d+)\.(\d+(\.\d+)?)/,playbook:/(PlayBook).*?Tablet\s*OS\s*(\d+)\.(\d+(\.\d+)?)/,windows:/(MSIE)\s+(\d+)\.(\d+(\.\d+)?)/,tizen:/(tizen).*?Version\/(\d+)\.(\d+(\.\d+)?)/i,sailfish:/(sailfish).*rv:(\d+)\.(\d+(\.\d+)?).*firefox/i,ffos:/(Mobile).*rv:(\d+)\.(\d+(\.\d+)?).*Firefox/},h={ios:/^i(phone|pad|pod)$/i,android:/^android|fire$/i,blackberry:/^blackberry|playbook/i,windows:/windows/,wp:/wp/,flat:/sailfish|ffos|tizen/i,meego:/meego/},c={tablet:/playbook|ipad|fire/i},l={omini:/Opera\sMini/i,omobile:/Opera\sMobi/i,firefox:/Firefox|Fennec/i,mobilesafari:/version\/.*safari/i,ie:/MSIE|Windows\sPhone/i,chrome:/chrome|crios/i,webkit:/webkit/i};for(r in o)if(o.hasOwnProperty(r)&&(e=n.match(o[r]))){if("windows"==r&&"plugins"in navigator)return!1;i={};i.device=r;i.tablet=ct(r,c,!1);i.browser=ct(n,l,"default");i.name=ct(r,h);i[i.name]=!0;i.majorVersion=e[2];i.minorVersion=e[3].replace("_",".");f=i.minorVersion.replace(".","").substr(0,2);i.flatVersion=i.majorVersion+f+Array(3-(3>f.length?f.length:2)).join("0");i.cordova=typeof t.PhoneGap!==st||typeof t.cordova!==st;i.appMode=t.navigator.standalone||/file|local|wmapp/.test(t.location.protocol)||i.cordova;i.android&&(1.5>u.devicePixelRatio&&400>i.flatVersion||s)&&(u.screenWidth>800||u.screenHeight>800)&&(i.tablet=r);break}return i};f=u.mobileOS=u.detectOS(navigator.userAgent);u.wpDevicePixelRatio=f.wp?screen.width/320:0;u.kineticScrollNeeded=f&&(u.touch||u.msPointers||u.pointers);u.hasNativeScrolling=!1;(f.ios||f.android&&f.majorVersion>2||f.wp)&&(u.hasNativeScrolling=f);u.mouseAndTouchPresent=u.touch&&!(u.mobileOS.ios||u.mobileOS.android);u.detectBrowser=function(n){var i,t=!1,r=[],u={webkit:/(chrome)[ \/]([\w.]+)/i,safari:/(webkit)[ \/]([\w.]+)/i,opera:/(opera)(?:.*version|)[ \/]([\w.]+)/i,msie:/(msie\s|trident.*? rv:)([\w.]+)/i,mozilla:/(mozilla)(?:.*? rv:([\w.]+)|)/i};for(i in u)if(u.hasOwnProperty(i)&&(r=n.match(u[i]))){t={};t[i]=!0;t[r[1].toLowerCase().split(" ")[0].split("/")[0]]=!0;t.version=parseInt(document.documentMode||r[2],10);break}return t};u.browser=u.detectBrowser(navigator.userAgent);u.zoomLevel=function(){try{return u.touch?document.documentElement.clientWidth/t.innerWidth:u.browser.msie&&u.browser.version>=10?(top||t).document.documentElement.offsetWidth/(top||t).innerWidth:1}catch(n){return 1}};u.cssBorderSpacing=i!==document.documentElement.style.borderSpacing&&!(u.browser.msie&&8>u.browser.version),function(t){var i="",r=n(document.documentElement),f=parseInt(t.version,10);t.msie?i="ie":t.mozilla?i="ff":t.safari?i="safari":t.webkit?i="webkit":t.opera&&(i="opera");i&&(i="k-"+i+" k-"+i+f);u.mobileOS&&(i+=" k-mobile");r.addClass(i)}(u.browser);u.eventCapture=document.documentElement.addEventListener;r=document.createElement("input");u.placeholder="placeholder"in r;u.propertyChangeEvent="onpropertychange"in r;u.input=function(){for(var n,i=["number","date","time","month","week","datetime","datetime-local"],e=i.length,u="test",f={},t=0;e>t;t++)n=i[t],r.setAttribute("type",n),r.value=u,f[n.replace("-","")]="text"!==r.type&&r.value!==u;return f}();r.style.cssText="float:left;";u.cssFloat=!!r.style.cssFloat;r=null;u.stableSort=function(){for(var t=[{index:0,field:"b"}],n=1;513>n;n++)t.push({index:n,field:"a"});return t.sort(function(n,t){return n.field>t.field?1:t.field>n.field?-1:0}),1===t[0].index}();u.matchesSelector=e.webkitMatchesSelector||e.mozMatchesSelector||e.msMatchesSelector||e.oMatchesSelector||e.matchesSelector||e.matches||function(t){for(var i=document.querySelectorAll?(this.parentNode||document).querySelectorAll(t)||[]:n(t),r=i.length;r--;)if(i[r]==this)return!0;return!1};u.pushState=t.history&&t.history.pushState;l=document.documentMode;u.hashChange="onhashchange"in t&&!(u.browser.msie&&(!l||8>=l))}();vi={left:{reverse:"right"},right:{reverse:"left"},down:{reverse:"up"},up:{reverse:"down"},top:{reverse:"bottom"},bottom:{reverse:"top"},"in":{reverse:"out"},out:{reverse:"in"}};w={};n.extend(w,{enabled:!0,Element:function(t){this.element=n(t)},promise:function(n,t){n.is(":visible")||n.css({display:n.data("olddisplay")||"block"}).css("display");t.hide&&n.data("olddisplay",n.css("display")).hide();t.init&&t.init();t.completeCallback&&t.completeCallback(n);n.dequeue()},disable:function(){this.enabled=!1;this.promise=this.promiseShim},enable:function(){this.enabled=!0;this.promise=this.animatedPromise}});w.promiseShim=w.promise;"kendoAnimate"in n.fn||h(n.fn,{kendoStop:function(n,t){return this.stop(n,t)},kendoAnimate:function(n,t,i,r){return ii(this,n,t,i,r)},kendoAddClass:function(n,t){return r.toggleClass(this,n,t,!0)},kendoRemoveClass:function(n,t){return r.toggleClass(this,n,t,!1)},kendoToggleClass:function(n,t,i){return r.toggleClass(this,n,t,i)}});yi=/&/g;pi=/</g;wi=/"/g;bi=/'/g;ki=/>/g;at=function(n){return n.target};u.touch&&(at=function(n){var t="originalEvent"in n?n.originalEvent.changedTouches:"changedTouches"in n?n.changedTouches:null;return t?document.elementFromPoint(t[0].clientX,t[0].clientY):n.target},rt(["swipe","swipeLeft","swipeRight","swipeUp","swipeDown","doubleTap","tap"],function(t,i){n.fn[i]=function(n){return this.bind(i,n)}}));u.touch?u.mobileOS?(u.mousedown="touchstart",u.mouseup="touchend",u.mousemove="touchmove",u.mousecancel="touchcancel",u.click="touchend",u.resize="orientationchange"):(u.mousedown="mousedown touchstart",u.mouseup="mouseup touchend",u.mousemove="mousemove touchmove",u.mousecancel="mouseleave touchcancel",u.click="click",u.resize="resize"):u.pointers?(u.mousemove="pointermove",u.mousedown="pointerdown",u.mouseup="pointerup",u.mousecancel="pointercancel",u.click="pointerup",u.resize="orientationchange resize"):u.msPointers?(u.mousemove="MSPointerMove",u.mousedown="MSPointerDown",u.mouseup="MSPointerUp",u.mousecancel="MSPointerCancel",u.click="MSPointerUp",u.resize="orientationchange resize"):(u.mousemove="mousemove",u.mousedown="mousedown",u.mouseup="mouseup",u.mousecancel="mouseleave",u.click="click",u.resize="resize");di=function(n,t){for(var r,i,o=t||"d",e=1,u=0,f=n.length;f>u;u++)i=n[u],""!==i&&(r=i.indexOf("["),0!==r&&(-1==r?i="."+i:(e++,i="."+i.substring(0,r)+" || {})"+i.substring(r))),e++,o+=i+(f-1>u?" || {})":")"));return Array(e).join("(")+o};gi=/^([a-z]+:)?\/\//i;h(r,{ui:r.ui||{},fx:r.fx||kr,effects:r.effects||w,mobile:r.mobile||{},data:r.data||{},dataviz:r.dataviz||{},keys:{INSERT:45,DELETE:46,BACKSPACE:8,TAB:9,ENTER:13,ESC:27,LEFT:37,UP:38,RIGHT:39,DOWN:40,END:35,HOME:36,SPACEBAR:32,PAGEUP:33,PAGEDOWN:34,F2:113,F10:121,F12:123,NUMPAD_PLUS:107,NUMPAD_MINUS:109,NUMPAD_DOT:110},support:r.support||u,animate:r.animate||ii,ns:"",attr:function(n){return"data-"+r.ns+n},getShadows:gt,wrap:ar,deepExtend:ht,getComputedStyles:yr,size:pr,toCamelCase:ti,toHyphens:vr,getOffset:r.getOffset||wr,parseEffects:r.parseEffects||br,toggleClass:r.toggleClass||gr,directions:r.directions||vi,Observable:tt,Class:nt,Template:p,template:kt(p.compile,p),render:kt(p.render,p),stringify:kt(ft.stringify,ft),eventTarget:at,htmlEncode:nu,isLocalUrl:function(n){return n&&!gi.test(n)},expr:function(n,t,i){return n=n||"",typeof t==o&&(i=t,t=!1),i=i||"d",n&&"["!==n.charAt(0)&&(n="."+n),n=t?di(n.split("."),i):i+n},getter:function(n,t){var i=n+t;return hr[i]=hr[i]||Function("d","return "+r.expr(n,t))},setter:function(n){return cr[n]=cr[n]||Function("d,value",r.expr(n)+"=value")},accessor:function(n){return{get:r.getter(n),set:r.setter(n)}},guid:function(){for(var t,i="",n=0;32>n;n++)t=16*a.random()|0,(8==n||12==n||16==n||20==n)&&(i+="-"),i+=(12==n?4:16==n?3&t|8:t).toString(16);return i},roleSelector:function(n){return n.replace(/(\S+)/g,"["+r.attr("role")+"=$1],").slice(0,-1)},directiveSelector:function(n){var t,i=n.split(" ");if(i)for(t=0;i.length>t;t++)"view"!=i[t]&&(i[t]=i[t].replace(/(\w*)(view|bar|strip|over)$/,"$1-$2"));return i.join(" ").replace(/(\S+)/g,"kendo-mobile-$1,").slice(0,-1)},triggeredByInput:function(n){return/^(label|input|textarea|select)$/i.test(n.target.tagName)},logToConsole:function(n){var u=t.console;!r.suppressLog&&i!==u&&u.log&&u.log(n)}});b=tt.extend({init:function(n,t){var u,i=this;i.element=r.jQuery(n).handler(i);i.angular("init",t);tt.fn.init.call(i);u=t?t.dataSource:null;u&&(t=h({},t,{dataSource:{}}));t=i.options=h(!0,{},i.options,t);u&&(t.dataSource=u);i.element.attr(r.attr("role"))||i.element.attr(r.attr("role"),(t.name||"").toLowerCase());i.element.data("kendo"+t.prefix+t.name,i);i.bind(i.events,t)},events:[],options:{prefix:""},_hasBindingTarget:function(){return!!this.element[0].kendoBindingTarget},_tabindex:function(n){n=n||this.wrapper;var i=this.element,t="tabindex",r=n.attr(t)||i.attr(t);i.removeAttr(t);n.attr(t,isNaN(r)?0:r)},setOptions:function(t){this._setEvents(t);n.extend(this.options,t)},_setEvents:function(n){for(var i,t=this,r=0,u=t.events.length;u>r;r++)i=t.events[r],t.options[i]&&n[i]&&t.unbind(i,t.options[i]);t.bind(t.events,n)},resize:function(n){var t=this.getSize(),i=this._size;(n||!i||t.width!==i.width||t.height!==i.height)&&(this._size=t,this._resize(t),this.trigger("resize",t))},getSize:function(){return r.dimensions(this.element)},size:function(n){return n?(this.setSize(n),i):this.getSize()},setSize:n.noop,_resize:n.noop,destroy:function(){var n=this;n.element.removeData("kendo"+n.options.prefix+n.options.name);n.element.removeData("handler");n.unbind()},angular:function(){}});vt=b.extend({dataItems:function(){return this.dataSource.flatView()},_angularItems:function(t){var i=this;i.angular(t,function(){return{elements:i.items(),data:n.map(i.dataItems(),function(n){return{dataItem:n}})}})}});r.dimensions=function(n,t){var i=n[0];return t&&n.css(t),{width:i.offsetWidth,height:i.offsetHeight}};r.notify=ut;nr=/template$/i;tr=/^\s*(?:\{(?:.|\r\n|\n)*\}|\[(?:.|\r\n|\n)*\])\s*$/;ir=/^\{(\d+)(:[^\}]+)?\}|^\[[A-Za-z_]*\]$/;rr=/([A-Z])/g;r.initWidget=function(u,f,e){var h,p,s,v,d,c,w,l,b,g,y,k,a;if(e?e.roles&&(e=e.roles):e=r.ui.roles,u=u.nodeType?u:u[0],c=u.getAttribute("data-"+r.ns+"role")){b=-1===c.indexOf(".");s=b?e[c]:r.getter(c)(t);y=n(u).data();k=s?"kendo"+s.fn.options.prefix+s.fn.options.name:"";g=b?RegExp("^kendo.*"+c+"$","i"):RegExp("^"+k+"$","i");for(a in y)if(a.match(g)){if(a!==k)return y[a];h=y[a]}if(s){for(l=lt(u,"dataSource"),f=n.extend({},ri(u,s.fn.options),f),l&&(f.dataSource=typeof l===o?r.getter(l)(t):l),v=0,d=s.fn.events.length;d>v;v++)p=s.fn.events[v],w=lt(u,p),w!==i&&(f[p]=r.getter(w)(t));return h?n.isEmptyObject(f)||h.setOptions(f):h=new s(u,f),h}}};r.rolesFromNamespaces=function(n){var t,i,u=[];for(n[0]||(n=[r.ui,r.dataviz.ui]),t=0,i=n.length;i>t;t++)u[t]=n[t].roles;return h.apply(null,[{}].concat(u.reverse()))};r.init=function(t){var i=r.rolesFromNamespaces(dt.call(arguments,1));n(t).find("[data-"+r.ns+"role]").addBack().each(function(){r.initWidget(this,{},i)})};r.destroy=function(t){n(t).find("[data-"+r.ns+"role]").addBack().each(function(){var t,i=n(this).data();for(t in i)0===t.indexOf("kendo")&&typeof i[t].destroy===c&&i[t].destroy()})};r.resize=function(t,i){var u,f=n(t).find("[data-"+r.ns+"role]").addBack().filter(iu);f.length&&(u=n.makeArray(f),u.sort(tu),n.each(u,function(){var t=r.widgetInstance(n(this));t&&t.resize(i)}))};r.parseOptions=ri;h(r.ui,{Widget:b,DataBoundWidget:vt,roles:{},progress:function(t,i){var f,o,s,e,u=t.find(".k-loading-mask"),h=r.support,c=h.browser;i?u.length||(f=h.isRtl(t),o=f?"right":"left",e=t.scrollLeft(),s=c.webkit&&f?t[0].scrollWidth-t.width()-2*e:0,u=n("<div class='k-loading-mask'><span class='k-loading-text'>Loading...<\/span><div class='k-loading-image'/><div class='k-loading-color'/><\/div>").width("100%").height("100%").css("top",t.scrollTop()).css(o,Math.abs(e)+s).prependTo(t)):u&&u.remove()},plugin:function(t,u,f){var s,e=t.fn.options.name;u=u||r.ui;f=f||"";u[e]=t;u.roles[e.toLowerCase()]=t;s="getKendo"+f+e;e="kendo"+f+e;n.fn[e]=function(u){var f,s=this;return typeof u===o?(f=dt.call(arguments,1),this.each(function(){var t,o,h=n.data(this,e);if(!h)throw Error(r.format("Cannot call method '{0}' of {1} before it is initialized",u,e));if(t=h[u],typeof t!==c)throw Error(r.format("Cannot find method '{0}' of {1}",u,e));return o=t.apply(h,f),o!==i?(s=o,!1):i})):this.each(function(){new t(this,u)}),s};n.fn[e].widget=t;n.fn[s]=function(){return this.data(e)}}});yt={bind:function(){return this},nullObject:!0,options:{}};pt=b.extend({init:function(n,t){b.fn.init.call(this,n,t);this.element.autoApplyNS();this.wrapper=this.element;this.element.addClass("km-widget")},destroy:function(){b.fn.destroy.call(this);this.element.kendoDestroy()},options:{prefix:"Mobile"},events:[],view:function(){var n=this.element.closest(r.roleSelector("view splitview modalview drawer"));return r.widgetInstance(n,r.mobile.ui)||yt},viewHasNativeScrolling:function(){var n=this.view();return n&&n.options.useNativeScrolling},container:function(){var n=this.element.closest(r.roleSelector("view layout modalview drawer splitview"));return r.widgetInstance(n.eq(0),r.mobile.ui)||yt}});h(r.mobile,{init:function(n){r.init(n,r.mobile.ui,r.ui,r.dataviz.ui)},appLevelNativeScrolling:function(){return r.mobile.application&&r.mobile.application.options&&r.mobile.application.options.useNativeScrolling},roles:{},ui:{Widget:pt,DataBoundWidget:vt.extend(pt.prototype),roles:{},plugin:function(n){r.ui.plugin(n,r.mobile.ui,"Mobile")}}});ht(r.dataviz,{init:function(n){r.init(n,r.dataviz.ui)},ui:{roles:{},themes:{},views:[],plugin:function(n){r.ui.plugin(n,r.dataviz.ui)}},roles:{}});r.touchScroller=function(t,i){return n(t).map(function(t,f){return f=n(f),u.kineticScrollNeeded&&r.mobile.ui.Scroller&&!f.data("kendoMobileScroller")?(f.kendoMobileScroller(i),f.data("kendoMobileScroller")):!1})[0]};r.preventDefault=function(n){n.preventDefault()};r.widgetInstance=function(n,i){var f,o,s,h,u=n.data(r.ns+"role"),e=[];if(u){if("content"===u&&(u="scroller"),i)if(i[0])for(f=0,o=i.length;o>f;f++)e.push(i[f].roles[u]);else e.push(i.roles[u]);else e=[r.ui.roles[u],r.dataviz.ui.roles[u],r.mobile.ui.roles[u]];for(u.indexOf(".")>=0&&(e=[r.getter(u)(t)]),f=0,o=e.length;o>f;f++)if(s=e[f],s&&(h=n.data("kendo"+s.fn.options.prefix+s.fn.options.name)))return h}};r.onResize=function(i){var r=i;return u.mobileOS.android&&(r=function(){setTimeout(i,600)}),n(t).on(u.resize,r),r};r.unbindResize=function(i){n(t).off(u.resize,i)};r.attrValue=function(n,t){return n.data(r.ns+t)};r.days={Sunday:0,Monday:1,Tuesday:2,Wednesday:3,Thursday:4,Friday:5,Saturday:6};n.extend(n.expr[":"],{kendoFocusable:function(t){var i=n.attr(t,"tabindex");return ru(t,!isNaN(i)&&i>-1)}});wt=["mousedown","mousemove","mouseenter","mouseleave","mouseover","mouseout","mouseup","click"];ur="label, input, [data-rel=external]";e={setupMouseMute:function(){var i,t=0,r=wt.length,f=document.documentElement;if(!e.mouseTrap&&u.eventCapture)for(e.mouseTrap=!0,e.bustClick=!1,e.captureMouse=!1,i=function(t){e.captureMouse&&("click"===t.type?e.bustClick&&!n(t.target).is(ur)&&(t.preventDefault(),t.stopPropagation()):t.stopPropagation())};r>t;t++)f.addEventListener(wt[t],i,!0)},muteMouse:function(n){e.captureMouse=!0;n.data.bustClick&&(e.bustClick=!0);clearTimeout(e.mouseTrapTimeoutID)},unMuteMouse:function(){clearTimeout(e.mouseTrapTimeoutID);e.mouseTrapTimeoutID=setTimeout(function(){e.captureMouse=!1;e.bustClick=!1},400)}};k={down:"touchstart mousedown",move:"mousemove touchmove",up:"mouseup touchend touchcancel",cancel:"mouseleave touchcancel"};u.touch&&(u.mobileOS.ios||u.mobileOS.android)?k={down:"touchstart",move:"touchmove",up:"touchend touchcancel",cancel:"touchcancel"}:u.pointers?k={down:"pointerdown",move:"pointermove",up:"pointerup",cancel:"pointercancel pointerleave"}:u.msPointers&&(k={down:"MSPointerDown",move:"MSPointerMove",up:"MSPointerUp",cancel:"MSPointerCancel MSPointerLeave"});!u.msPointers||"onmspointerenter"in t||n.each({MSPointerEnter:"MSPointerOver",MSPointerLeave:"MSPointerOut"},function(t,i){n.event.special[t]={delegateType:i,bindType:i,handle:function(t){var u,f=this,r=t.relatedTarget,e=t.handleObj;return(!r||r!==f&&!n.contains(f,r))&&(t.type=e.origType,u=e.handler.apply(this,arguments),t.type=i),u}}});fr=function(n){return k[n]||n};bt=/([^ ]+)/g;r.applyEventMap=function(n,t){return n=n.replace(bt,fr),t&&(n=n.replace(bt,"$1."+t)),n};it=n.fn.on;h(!0,s,n);s.fn=s.prototype=new n;s.fn.constructor=s;s.fn.init=function(t,i){return i&&i instanceof n&&!(i instanceof s)&&(i=s(i)),n.fn.init.call(this,t,i,er)};s.fn.init.prototype=s.fn;er=s(document);h(s.fn,{handler:function(n){return this.data("handler",n),this},autoApplyNS:function(n){return this.data("kendoNS",n||r.guid()),this},on:function(){var s,n,i,f,h,c,t=this,l=t.data("kendoNS");return 1===arguments.length?it.call(t,arguments[0]):(s=t,n=dt.call(arguments),typeof n[n.length-1]===st&&n.pop(),i=n[n.length-1],f=r.applyEventMap(n[0],l),u.mouseAndTouchPresent&&f.search(/mouse|click/)>-1&&this[0]!==document.documentElement&&(e.setupMouseMute(),h=2===n.length?null:n[1],c=f.indexOf("click")>-1&&f.indexOf("touchend")>-1,it.call(this,{touchstart:e.muteMouse,touchend:e.unMuteMouse},h,{bustClick:c})),typeof i===o&&(s=t.data("handler"),i=s[i],n[n.length-1]=function(n){i.call(s,n)}),n[0]=f,it.apply(t,n),t)},kendoDestroy:function(n){return n=n||this.data("kendoNS"),n&&this.off("."+n),this}});r.jQuery=s;r.eventMap=k;r.timezone=function(){function t(t,i){var r,o,s,c=i[3],e=i[4],f=i[5],h=i[8];return h||(i[8]=h={}),h[t]?h[t]:(isNaN(e)?0===e.indexOf("last")?(r=new Date(Date.UTC(t,n[c]+1,1,f[0]-24,f[1],f[2],0)),o=u[e.substr(4,3)],s=r.getUTCDay(),r.setUTCDate(r.getUTCDate()+o-s-(o>s?7:0))):e.indexOf(">=")>=0&&(r=new Date(Date.UTC(t,n[c],e.substr(5),f[0],f[1],f[2],0)),o=u[e.substr(0,3)],s=r.getUTCDay(),r.setUTCDate(r.getUTCDate()+o-s+(s>o?7:0))):r=new Date(Date.UTC(t,n[c],e,f[0],f[1],f[2],0)),h[t]=r)}function f(n,i,r){var f,e,u,o;return(i=i[r])?(u=new Date(n).getUTCFullYear(),i=jQuery.grep(i,function(n){var i=n[0],t=n[1];return u>=i&&(t>=u||i==u&&"only"==t||"max"==t)}),i.push(n),i.sort(function(n,i){return"number"!=typeof n&&(n=+t(u,n)),"number"!=typeof i&&(i=+t(u,i)),n-i}),o=i[jQuery.inArray(n,i)-1]||i[i.length-1],isNaN(o)?o:null):(f=r.split(":"),e=0,f.length>1&&(e=60*f[0]+ +f[1]),[-1e6,"max","-","Jan",1,[0,0,0],e,"-"])}function e(n,t,i){var u,f,e,r=t[i];if("string"==typeof r&&(r=t[r]),!r)throw Error('Timezone "'+i+'" is either incorrect, or kendo.timezones.min.js is not included.');for(u=r.length-1;u>=0&&(f=r[u][3],!(f&&n>f));u--);if(e=r[u+1],!e)throw Error('Timezone "'+i+'" not found on '+n+".");return e}function i(n,t,i,r){typeof n!=y&&(n=Date.UTC(n.getFullYear(),n.getMonth(),n.getDate(),n.getHours(),n.getMinutes(),n.getSeconds(),n.getMilliseconds()));var u=e(n,t,r);return{zone:u,rule:f(n,i,u[1])}}function s(n,t){var u,f,e;return"Etc/UTC"==t||"Etc/GMT"==t?0:(u=i(n,this.zones,this.rules,t),f=u.zone,e=u.rule,r.parseFloat(e?f[0]-e[6]:f[0]))}function h(n,t){var f=i(n,this.zones,this.rules,t),e=f.zone,r=f.rule,u=e[2];return u.indexOf("/")>=0?u.split("/")[r&&+r[6]?1:0]:u.indexOf("%s")>=0?u.replace("%s",r&&"-"!=r[7]?r[7]:""):u}function c(n,t,i){var r,u;return typeof t==o&&(t=this.offset(n,t)),typeof i==o&&(i=this.offset(n,i)),r=n.getTimezoneOffset(),n=new Date(n.getTime()+6e4*(t-i)),u=n.getTimezoneOffset(),new Date(n.getTime()+6e4*(u-r))}function l(n,t){return this.convert(n,n.getTimezoneOffset(),t)}function a(n,t){return this.convert(n,t,n.getTimezoneOffset())}function v(n){return this.apply(new Date(n),"Etc/UTC")}var n={Jan:0,Feb:1,Mar:2,Apr:3,May:4,Jun:5,Jul:6,Aug:7,Sep:8,Oct:9,Nov:10,Dec:11},u={Sun:0,Mon:1,Tue:2,Wed:3,Thu:4,Fri:5,Sat:6};return{zones:{},rules:{},offset:s,convert:c,apply:l,remove:a,abbr:h,toLocalDate:v}}();r.date=function(){function t(n,t){return 0===t&&23===n.getHours()?(n.setHours(n.getHours()+2),!0):!1}function e(n,i,r){var u=n.getHours();r=r||1;i=(i-n.getDay()+7*r)%7;n.setDate(n.getDate()+i);t(n,u)}function c(n,t,i){return n=new Date(n),e(n,t,i),n}function o(n){return new Date(n.getFullYear(),n.getMonth(),1)}function l(n){var t=new Date(n.getFullYear(),n.getMonth()+1,0),i=o(n),r=Math.abs(t.getTimezoneOffset()-i.getTimezoneOffset());return r&&t.setHours(i.getHours()+r/60),t}function i(n){return n=new Date(n.getFullYear(),n.getMonth(),n.getDate(),0,0,0),t(n,0),n}function a(n){return Date.UTC(n.getFullYear(),n.getMonth(),n.getDate(),n.getHours(),n.getMinutes(),n.getSeconds(),n.getMilliseconds())}function r(n){return n.getTime()-i(n)}function v(t,i,u){var f,e=r(i),o=r(u);return t&&e!=o?(i>=u&&(u+=n),f=r(t),e>f&&(f+=n),e>o&&(o+=n),f>=e&&o>=f):!0}function y(t,i,r){var u,e=i.getTime(),f=r.getTime();return e>=f&&(f+=n),u=t.getTime(),u>=e&&f>=u}function u(i,r){var u=i.getHours();return i=new Date(i),s(i,r*n),t(i,u),i}function s(n,t,i){var r,u=n.getTimezoneOffset();n.setTime(n.getTime()+t);i||(r=n.getTimezoneOffset()-u,n.setTime(n.getTime()+r*f))}function h(){return i(new Date)}function p(n){return i(n).getTime()==h().getTime()}function w(n){var t=new Date(1980,1,1,0,0,0);return n&&t.setHours(n.getHours(),n.getMinutes(),n.getSeconds(),n.getMilliseconds()),t}var f=6e4,n=864e5;return{adjustDST:t,dayOfWeek:c,setDayOfWeek:e,getDate:i,isInDateRange:y,isInTimeRange:v,isToday:p,nextDay:function(n){return u(n,1)},previousDay:function(n){return u(n,-1)},toUtcTime:a,MS_PER_DAY:n,MS_PER_HOUR:60*f,MS_PER_MINUTE:f,setTime:s,addDays:u,today:h,toInvariantTime:w,firstDayOfMonth:o,lastDayOfMonth:l,getMilliseconds:r}}();r.stripWhitespace=function(n){var t,u,i;if(document.createNodeIterator)for(t=document.createNodeIterator(n,NodeFilter.SHOW_TEXT,function(t){return t.parentNode==n?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT},!1);t.nextNode();)t.referenceNode&&!t.referenceNode.textContent.trim()&&t.referenceNode.parentNode.removeChild(t.referenceNode);else for(u=0;n.childNodes.length>u;u++)i=n.childNodes[u],3!=i.nodeType||/\S/.test(i.nodeValue)||(n.removeChild(i),u--),1==i.nodeType&&r.stripWhitespace(i)};or=t.requestAnimationFrame||t.webkitRequestAnimationFrame||t.mozRequestAnimationFrame||t.oRequestAnimationFrame||t.msRequestAnimationFrame||function(n){setTimeout(n,1e3/60)};r.animationFrame=function(n){or.call(t,n)};v=[];r.queueAnimation=function(n){v[v.length]=n;1===v.length&&r.runNextAnimation()};r.runNextAnimation=function(){r.animationFrame(function(){v[0]&&(v.shift()(),v[0]&&r.runNextAnimation())})};r.parseQueryStringParams=function(n){for(var u=n.split("?")[1]||"",r={},i=u.split(/&|=/),f=i.length,t=0;f>t;t+=2)""!==i[t]&&(r[decodeURIComponent(i[t])]=decodeURIComponent(i[t+1]));return r};r.elementUnderCursor=function(n){return document.elementFromPoint(n.x.client,n.y.client)};r.wheelDeltaY=function(n){var r,t=n.originalEvent,u=t.wheelDeltaY;return t.wheelDelta?(u===i||u)&&(r=t.wheelDelta):t.detail&&t.axis===t.VERTICAL_AXIS&&(r=10*-t.detail),r};r.throttle=function(n,t){var r,u,f=0;return!t||0>=t?n:(u=function(){function u(){n.apply(o,s);f=+new Date}var o=this,e=+new Date-f,s=arguments;return f?(r&&clearTimeout(r),e>t?u():r=setTimeout(u,t-e),i):u()},u.cancel=function(){clearTimeout(r)},u)};r.caret=function(t,r,u){var f,e,o,h,s=r!==i;if(u===i&&(u=r),t[0]&&(t=t[0]),!s||!t.disabled){try{t.selectionStart!==i?s?(t.focus(),t.setSelectionRange(r,u)):r=[t.selectionStart,t.selectionEnd]:document.selection&&(n(t).is(":visible")&&t.focus(),f=t.createTextRange(),s?(f.collapse(!0),f.moveStart("character",r),f.moveEnd("character",u-r),f.select()):(e=f.duplicate(),f.moveToBookmark(document.selection.createRange().getBookmark()),e.setEndPoint("EndToStart",f),o=e.text.length,h=o+f.text.length,r=[o,h]))}catch(c){r=[]}return r}};r.compileMobileDirective=function(n,i){var u=t.angular;return n.attr("data-"+r.ns+"role",n[0].tagName.toLowerCase().replace("kendo-mobile-","").replace("-","")),u.element(n).injector().invoke(["$compile",function(t){var r=u.element(n).scope();i&&i(r);t(n)(r);/^\$(digest|apply)$/.test(r.$$phase)||r.$digest()}]),r.widgetInstance(n,r.mobile.ui)};r.antiForgeryTokens=function(){var t={},r=n("meta[name=csrf-token]").attr("content"),u=n("meta[name=csrf-param]").attr("content");return n("input[name^='__RequestVerificationToken']").each(function(){t[this.name]=this.value}),u!==i&&r!==i&&(t[u]=r),t},function(){function u(t,i,u){var o,e,s=n("<form>").attr({action:u,method:"POST"}),f=r.antiForgeryTokens();f.fileName=i;o=t.split(";base64,");f.contentType=o[0].replace("data:","");f.base64=o[1];for(e in f)f.hasOwnProperty(e)&&n("<input>").attr({value:f[e],name:e,type:"hidden"}).appendTo(s);s.appendTo("body").submit().remove()}function f(n,t){var u,e,r,f,i,o=n;if("string"==typeof n){for(u=n.split(";base64,"),e=u[0],r=atob(u[1]),f=new Uint8Array(r.length),i=0;r.length>i;i++)f[i]=r.charCodeAt(i);o=new Blob([f.buffer],{type:e})}navigator.msSaveBlob(o,t)}function e(n,r){t.Blob&&n instanceof Blob&&(n=URL.createObjectURL(n));i.download=r;i.href=n;var u=document.createEvent("MouseEvents");u.initMouseEvent("click",!0,!1,t,0,0,0,0,0,!1,!1,!1,!1,0,null);i.dispatchEvent(u)}var i=document.createElement("a"),o="download"in i;r.saveAs=function(n){var t=u;n.forceProxy||(o?t=e:navigator.msSaveBlob&&(t=f));t(n.dataURI,n.fileName,n.proxyURL)}}()}(jQuery,window),function(n,t){function yt(n){return parseInt(n,10)}function l(n,t){return yt(n.css(t))}function li(n){var t,i=[];for(t in n)i.push(t);return i}function rt(n){for(var t in n)-1!=ht.indexOf(t)&&-1==d.indexOf(t)&&delete n[t];return n}function ut(n,t){var r,i,u,e,o=[],h={};for(i in t)r=i.toLowerCase(),e=f&&-1!=ht.indexOf(r),!w.hasHW3D&&e&&-1==d.indexOf(r)?delete t[i]:(u=t[i],e?o.push(i+"("+u+")"):h[i]=u);return o.length&&(h[s]=o.join(" ")),h}function pt(n,t){var u,i,r;return f?(u=n.css(s),u==ir?"scale"==t?1:0:(i=u.match(RegExp(t+"\\s*\\(([\\d\\w\\.]+)")),r=0,i?r=yt(i[1]):(i=u.match(wi)||[0,0,0,0,0],t=t.toLowerCase(),bi.test(t)?r=parseFloat(i[3]/i[2]):"translatey"==t?r=parseFloat(i[4]/i[2]):"scale"==t?r=parseFloat(i[2]):"rotate"==t&&(r=parseFloat(Math.atan2(i[2],i[1])))),r)):parseFloat(n.css(t))}function ft(n){return n.charAt(0).toUpperCase()+n.substring(1)}function e(n,t){var i=h.extend(t),u=i.prototype.directions;r[ft(n)]=i;r.Element.prototype[n]=function(n,t,r,u){return new i(this.element,n,t,r,u)};a(u,function(t,u){r.Element.prototype[n+ft(u)]=function(n,t,r){return new i(this.element,u,n,t,r)}})}function wt(n,i,r,u){e(n,{directions:dt,startValue:function(n){return this._startValue=n,this},endValue:function(n){return this._endValue=n,this},shouldHide:function(){return this._shouldHide},prepare:function(n,f){var e,o,h=this,c="out"===this._direction,s=h.element.data(i),l=!(isNaN(s)||s==r);e=l?s:t!==this._startValue?this._startValue:c?r:u;o=t!==this._endValue?this._endValue:c?u:r;this._reverse?(n[i]=o,f[i]=e):(n[i]=e,f[i]=o);h._shouldHide=f[i]===u}})}function bt(n,t){var r=i.directions[t].vertical,u=n[r?nt:lt]()/2+"px";return ni[t].replace("$size",u)}var kt,et,h,p,dt,gt,ni,ti,ot,ii,k,st,i=window.kendo,r=i.effects,a=n.each,u=n.extend,ai=n.proxy,w=i.support,vi=w.browser,f=w.transforms,o=w.transitions,yi={scale:0,scalex:0,scaley:0,scale3d:0},pi={translate:0,translatex:0,translatey:0,translate3d:0},ri=t!==document.documentElement.style.zoom&&!f,wi=/matrix3?d?\s*\(.*,\s*([\d\.\-]+)\w*?,\s*([\d\.\-]+)\w*?,\s*([\d\.\-]+)\w*?,\s*([\d\.\-]+)\w*?/i,ui=/^(-?[\d\.\-]+)?[\w\s]*,?\s*(-?[\d\.\-]+)?[\w\s]*/i,bi=/translatex?$/i,ki=/(zoom|fade|expand)(\w+)/,fi=/(zoom|fade|expand)/,di=/[xy]$/i,ht=["perspective","rotate","rotatex","rotatey","rotatez","rotate3d","scale","scalex","scaley","scalez","scale3d","skew","skewx","skewy","translate","translatex","translatey","translatez","translate3d","matrix","matrix3d"],d=["rotate","scale","scalex","scaley","skew","skewx","skewy","translate","translatex","translatey","matrix"],gi={rotate:"deg",scale:"",skew:"px",translate:"px"},g=f.css,nr=Math.round,tr="",b="px",ir="none",ct="auto",lt="width",nt="height",ei="hidden",at="origin",oi="abortId",tt="overflow",v="translate",it="position",si="completeCallback",y=g+"transition",s=g+"transform",rr=g+"backface-visibility",hi=g+"perspective",vt="1500px",ci="perspective("+vt+")",c={left:{reverse:"right",property:"left",transition:"translatex",vertical:!1,modifier:-1},right:{reverse:"left",property:"left",transition:"translatex",vertical:!1,modifier:1},down:{reverse:"up",property:"top",transition:"translatey",vertical:!0,modifier:1},up:{reverse:"down",property:"top",transition:"translatey",vertical:!0,modifier:-1},top:{reverse:"bottom"},bottom:{reverse:"top"},"in":{reverse:"out",modifier:-1},out:{reverse:"in",modifier:1},vertical:{reverse:"vertical"},horizontal:{reverse:"horizontal"}};i.directions=c;u(n.fn,{kendoStop:function(n,t){return o?r.stopQueue(this,n||!1,t||!1):this.stop(n,t)}});f&&!o&&(a(d,function(i,r){n.fn[r]=function(i){if(t===i)return pt(this,r);var u=n(this)[0],f=r+"("+i+gi[r.replace(di,"")]+")";return-1==u.style.cssText.indexOf(s)?n(this).css(s,f):u.style.cssText=u.style.cssText.replace(RegExp(r+"\\(.*?\\)","i"),f),this};n.fx.step[r]=function(t){n(t.elem)[r](t.now)}}),kt=n.fx.prototype.cur,n.fx.prototype.cur=function(){return-1!=d.indexOf(this.prop)?parseFloat(n(this.elem)[this.prop]()):kt.apply(this,arguments)});i.toggleClass=function(n,t,i,r){return t&&(t=t.split(" "),o&&(i=u({exclusive:"all",duration:400,ease:"ease-out"},i),n.css(y,i.exclusive+" "+i.duration+"ms "+i.ease),setTimeout(function(){n.css(y,"").css(nt)},i.duration)),a(t,function(t,i){n.toggleClass(i,r)})),n};i.parseEffects=function(n,t){var i={};return"string"==typeof n?a(n.split(" "),function(n,r){var o=!fi.test(r),s=r.replace(ki,function(n,t,i){return t+":"+i.toLowerCase()}),u=s.split(":"),f=u[1],e={};u.length>1&&(e.direction=t&&o?c[f].reverse:f);i[u[0]]=e}):a(n,function(n){var r=this.direction;r&&t&&!fi.test(n)&&(this.direction=c[r].reverse);i[n]=this}),i};o&&u(r,{transition:function(t,i,r){var h,f,c,e,l=0,a=t.data("keys")||[];r=u({duration:200,ease:"ease-out",complete:null,exclusive:"all"},r);c=!1;e=function(){c||(c=!0,f&&(clearTimeout(f),f=null),t.removeData(oi).dequeue().css(y,"").css(y),r.complete.call(t))};r.duration=n.fx?n.fx.speeds[r.duration]||r.duration:r.duration;h=ut(t,i);n.merge(a,li(h));t.data("keys",n.unique(a)).height();t.css(y,r.exclusive+" "+r.duration+"ms "+r.ease).css(y);t.css(h).css(s);o.event&&(t.one(o.event,e),0!==r.duration&&(l=500));f=setTimeout(e,r.duration+l);t.data(oi,f);t.data(si,e)},stopQueue:function(n,t,r){var u,f=n.data("keys"),e=!r&&f,o=n.data(si);return e&&(u=i.getComputedStyles(n[0],f)),o&&o(),e&&n.css(u),n.removeData("keys").stop(t)}});et=i.Class.extend({init:function(n,t){var i=this;i.element=n;i.effects=[];i.options=t;i.restore=[]},run:function(t){var l,h,v,p,w,k,d,a=this,g=t.length,c=a.element,i=a.options,b=n.Deferred(),e={},y={};for(a.effects=t,b.then(n.proxy(a,"complete")),c.data("animating",!0),h=0;g>h;h++)for(l=t[h],l.setReverse(i.reverse),l.setOptions(i),a.addRestoreProperties(l.restore),l.prepare(e,y),w=l.children(),v=0,k=w.length;k>v;v++)w[v].duration(i.duration).run();for(d in i.effects)u(y,i.effects[d].properties);for(c.is(":visible")||u(e,{display:c.data("olddisplay")||"block"}),f&&!i.reset&&(p=c.data("targetTransform"),p&&(e=u(p,e))),e=ut(c,e),f&&!o&&(e=rt(e)),c.css(e).css(s),h=0;g>h;h++)t[h].setup();return i.init&&i.init(),c.data("targetTransform",y),r.animate(c,y,u({},i,{complete:b.resolve})),b.promise()},stop:function(){n(this.element).kendoStop(!0,!0)},addRestoreProperties:function(n){for(var t,i=this.element,r=0,u=n.length;u>r;r++)t=n[r],this.restore.push(t),i.data(t)||i.data(t,i.css(t))},restoreCallback:function(){for(var t,r=this.element,n=0,i=this.restore.length;i>n;n++)t=this.restore[n],r.css(t,r.data(t))},complete:function(){var i=this,r=0,t=i.element,u=i.options,e=i.effects,o=e.length;for(t.removeData("animating").dequeue(),u.hide&&t.data("olddisplay",t.css("display")).hide(),this.restoreCallback(),ri&&!f&&setTimeout(n.proxy(this,"restoreCallback"),0);o>r;r++)e[r].teardown();u.completeCallback&&u.completeCallback(t)}});r.promise=function(n,t){var u,s,f,e=[],h=new et(n,t),o=i.parseEffects(t.effects);t.effects=o;for(f in o)u=r[ft(f)],u&&(s=new u(n,o[f].direction),e.push(s));e[0]?h.run(e):(n.is(":visible")||n.css({display:n.data("olddisplay")||"block"}).css("display"),t.init&&t.init(),n.dequeue(),h.complete())};u(r,{animate:function(i,e,s){var h=s.transition!==!1;delete s.transition;o&&"transition"in r&&h?r.transition(i,e,s):f?i.animate(rt(e),{queue:!1,show:!1,hide:!1,duration:s.duration,complete:s.complete}):i.each(function(){var i=n(this),r={};a(ht,function(n,o){var c,s,p,w,h,a,y,b=e?e[o]+" ":null;b&&(s=e,o in yi&&e[o]!==t?(c=b.match(ui),f&&u(s,{scale:+c[0]})):o in pi&&e[o]!==t&&(p=i.css(it),w="absolute"==p||"fixed"==p,i.data(v)||(w?i.data(v,{top:l(i,"top")||0,left:l(i,"left")||0,bottom:l(i,"bottom"),right:l(i,"right")}):i.data(v,{top:l(i,"marginTop")||0,left:l(i,"marginLeft")||0})),h=i.data(v),c=b.match(ui),c&&(a=o==v+"y"?0:+c[1],y=o==v+"y"?+c[1]:+c[2],w?(isNaN(h.right)?isNaN(a)||u(s,{left:h.left+a}):isNaN(a)||u(s,{right:h.right-a}),isNaN(h.bottom)?isNaN(y)||u(s,{top:h.top+y}):isNaN(y)||u(s,{bottom:h.bottom-y})):(isNaN(a)||u(s,{marginLeft:h.left+a}),isNaN(y)||u(s,{marginTop:h.top+y})))),!f&&"scale"!=o&&o in s&&delete s[o],s&&u(r,s))});vi.msie&&delete r.scale;i.animate(r,{queue:!1,show:!1,hide:!1,duration:s.duration,complete:s.complete})})}});r.animatedPromise=r.promise;h=i.Class.extend({init:function(n,t){var i=this;i.element=n;i._direction=t;i.options={};i._additionalEffects=[];i.restore||(i.restore=[])},reverse:function(){return this._reverse=!0,this.run()},play:function(){return this._reverse=!1,this.run()},add:function(n){return this._additionalEffects.push(n),this},direction:function(n){return this._direction=n,this},duration:function(n){return this._duration=n,this},compositeRun:function(){var n=this,t=new et(n.element,{reverse:n._reverse,duration:n._duration}),i=n._additionalEffects.concat([n]);return t.run(i)},run:function(){if(this._additionalEffects&&this._additionalEffects[0])return this.compositeRun();var c,l,e=this,t=e.element,h=0,y=e.restore,w=y.length,a=n.Deferred(),i={},v={},p=e.children(),b=p.length;for(a.then(n.proxy(e,"_complete")),t.data("animating",!0),h=0;w>h;h++)c=y[h],t.data(c)||t.data(c,t.css(c));for(h=0;b>h;h++)p[h].duration(e._duration).run();return e.prepare(i,v),t.is(":visible")||u(i,{display:t.data("olddisplay")||"block"}),f&&(l=t.data("targetTransform"),l&&(i=u(l,i))),i=ut(t,i),f&&!o&&(i=rt(i)),t.css(i).css(s),e.setup(),t.data("targetTransform",v),r.animate(t,v,{duration:e._duration,complete:a.resolve}),a.promise()},stop:function(){for(var t=0,i=this.children(),r=i.length,t=0;r>t;t++)i[t].stop();return n(this.element).kendoStop(!0,!0),this},restoreCallback:function(){for(var t,r=this.element,n=0,i=this.restore.length;i>n;n++)t=this.restore[n],r.css(t,r.data(t))},_complete:function(){var t=this,i=t.element;i.removeData("animating").dequeue();t.restoreCallback();t.shouldHide()&&i.data("olddisplay",i.css("display")).hide();ri&&!f&&setTimeout(n.proxy(t,"restoreCallback"),0);t.teardown()},setOptions:function(n){u(!0,this.options,n)},children:function(){return[]},shouldHide:n.noop,setup:n.noop,prepare:n.noop,teardown:n.noop,directions:[],setReverse:function(n){return this._reverse=n,this}});p=["left","right","up","down"];dt=["in","out"];e("slideIn",{directions:p,divisor:function(n){return this.options.divisor=n,this},prepare:function(n,t){var u,r=this,e=r.element,i=c[r._direction],h=-i.modifier*(i.vertical?e.outerHeight():e.outerWidth()),o=h/(r.options&&r.options.divisor||1)+b,s="0px";r._reverse&&(u=n,n=t,t=u);f?(n[i.transition]=o,t[i.transition]=s):(n[i.property]=o,t[i.property]=s)}});e("tile",{directions:p,init:function(n,t,i){h.prototype.init.call(this,n,t);this.options={previous:i}},previousDivisor:function(n){return this.options.previousDivisor=n,this},children:function(){var n=this,t=n._reverse,r=n.options.previous,e=n.options.previousDivisor||1,u=n._direction,f=[i.fx(n.element).slideIn(u).setReverse(t)];return r&&f.push(i.fx(r).slideIn(c[u].reverse).divisor(e).setReverse(!t)),f}});wt("fade","opacity",1,0);wt("zoom","scale",1,.01);e("slideMargin",{prepare:function(n,t){var r,u=this,i=u.element,f=u.options,o=i.data(at),s=f.offset,e=u._reverse;e||null!==o||i.data(at,parseFloat(i.css("margin-"+f.axis)));r=i.data(at)||0;t["margin-"+f.axis]=e?r:r+s}});e("slideTo",{prepare:function(n,t){var u=this,e=u.element,o=u.options,i=o.offset.split(","),r=u._reverse;f?(t.translatex=r?0:i[0],t.translatey=r?0:i[1]):(t.left=r?0:i[0],t.top=r?0:i[1]);e.css("left")}});e("expand",{directions:["horizontal","vertical"],restore:[tt],prepare:function(n,i){var f=this,e=f.element,o=f.options,s=f._reverse,r="vertical"===f._direction?nt:lt,h=e[0].style[r],c=e.data(r),u=parseFloat(c||h),l=nr(e.css(r,ct)[r]());n.overflow=ei;u=o&&o.reset?l||u:u||l;i[r]=(s?0:u)+b;n[r]=(s?u:0)+b;c===t&&e.data(r,h)},shouldHide:function(){return this._reverse},teardown:function(){var t=this,i=t.element,n="vertical"===t._direction?nt:lt,r=i.data(n);(r==ct||r===tr)&&setTimeout(function(){i.css(n,ct).css(n)},0)}});gt={position:"absolute",marginLeft:0,marginTop:0,scale:1};e("transfer",{init:function(n,t){this.element=n;this.options={target:t};this.restore=[]},setup:function(){this.element.appendTo(document.body)},prepare:function(n,t){var e=this,i=e.element,f=r.box(i),o=r.box(e.options.target),l=pt(i,"scale"),h=r.fillScale(o,f),c=r.transformOrigin(o,f);u(n,gt);t.scale=1;i.css(s,"scale(1)").css(s);i.css(s,"scale("+l+")");n.top=f.top;n.left=f.left;n.transformOrigin=c.x+b+" "+c.y+b;e._reverse?n.scale=h:t.scale=h}});ni={top:"rect(auto auto $size auto)",bottom:"rect($size auto auto auto)",left:"rect(auto $size auto auto)",right:"rect(auto auto auto $size)"};ti={top:{start:"rotatex(0deg)",end:"rotatex(180deg)"},bottom:{start:"rotatex(-180deg)",end:"rotatex(0deg)"},left:{start:"rotatey(0deg)",end:"rotatey(-180deg)"},right:{start:"rotatey(180deg)",end:"rotatey(0deg)"}};e("turningPage",{directions:p,init:function(n,t,i){h.prototype.init.call(this,n,t);this._container=i},prepare:function(n,t){var r=this,f=r._reverse,e=f?c[r._direction].reverse:r._direction,u=ti[e];n.zIndex=1;r._clipInHalf&&(n.clip=bt(r._container,i.directions[e].reverse));n[rr]=ei;t[s]=ci+(f?u.start:u.end);n[s]=ci+(f?u.end:u.start)},setup:function(){this._container.append(this.element)},face:function(n){return this._face=n,this},shouldHide:function(){var n=this,t=n._reverse,i=n._face;return t&&!i||!t&&i},clipInHalf:function(n){return this._clipInHalf=n,this},temporary:function(){return this.element.addClass("temp-page"),this}});e("staticPage",{directions:p,init:function(n,t,i){h.prototype.init.call(this,n,t);this._container=i},restore:["clip"],prepare:function(n,t){var i=this,r=i._reverse?c[i._direction].reverse:i._direction;n.clip=bt(i._container,r);n.opacity=.999;t.opacity=1},shouldHide:function(){var n=this,t=n._reverse,i=n._face;return t&&!i||!t&&i},face:function(n){return this._face=n,this}});e("pageturn",{directions:["horizontal","vertical"],init:function(n,t,i,r){h.prototype.init.call(this,n,t);this.options={};this.options.face=i;this.options.back=r},children:function(){var o,r=this,u=r.options,n="horizontal"===r._direction?"left":"top",f=i.directions[n].reverse,t=r._reverse,s=u.face.clone(!0).removeAttr("id"),h=u.back.clone(!0).removeAttr("id"),e=r.element;return t&&(o=n,n=f,f=o),[i.fx(u.face).staticPage(n,e).face(!0).setReverse(t),i.fx(u.back).staticPage(f,e).setReverse(t),i.fx(s).turningPage(n,e).face(!0).clipInHalf(!0).temporary().setReverse(t),i.fx(h).turningPage(f,e).clipInHalf(!0).temporary().setReverse(t)]},prepare:function(n,t){n[hi]=vt;n.transformStyle="preserve-3d";n.opacity=.999;t.opacity=1},teardown:function(){this.element.find(".temp-page").remove()}});e("flip",{directions:["horizontal","vertical"],init:function(n,t,i,r){h.prototype.init.call(this,n,t);this.options={};this.options.face=i;this.options.back=r},children:function(){var f,n=this,e=n.options,t="horizontal"===n._direction?"left":"top",r=i.directions[t].reverse,u=n._reverse,o=n.element;return u&&(f=t,t=r,r=f),[i.fx(e.face).turningPage(t,o).face(!0).setReverse(u),i.fx(e.back).turningPage(r,o).setReverse(u)]},prepare:function(n){n[hi]=vt;n.transformStyle="preserve-3d"}});ot=!w.mobileOS.android;ii=".km-touch-scrollbar, .km-actionsheet-wrapper";e("replace",{_before:n.noop,_after:n.noop,init:function(t,i,r){h.prototype.init.call(this,t);this._previous=n(i);this._transitionClass=r},duration:function(){throw Error("The replace effect does not support duration setting; the effect duration may be customized through the transition class rule");},beforeTransition:function(n){return this._before=n,this},afterTransition:function(n){return this._after=n,this},_both:function(){return n().add(this._element).add(this._previous)},_containerClass:function(){var t=this._direction,n="k-fx k-fx-start k-fx-"+this._transitionClass;return t&&(n+=" k-fx-"+t),this._reverse&&(n+=" k-fx-reverse"),n},complete:function(t){if(!(!this.deferred||t&&n(t.target).is(ii))){var i=this.container;i.removeClass("k-fx-end").removeClass(this._containerClass()).off(o.event,this.completeProxy);this._previous.hide().removeClass("k-fx-current");this.element.removeClass("k-fx-next");ot&&i.css(tt,"");this.isAbsolute||this._both().css(it,"");this.deferred.resolve();delete this.deferred}},run:function(){if(this._additionalEffects&&this._additionalEffects[0])return this.compositeRun();var s,u=this,r=u.element,f=u._previous,t=r.parents().filter(f.parents()).first(),h=u._both(),e=n.Deferred(),c=r.css(it);return t.length||(t=r.parent()),this.container=t,this.deferred=e,this.isAbsolute="absolute"==c,this.isAbsolute||h.css(it,"absolute"),ot&&(s=t.css(tt),t.css(tt,"hidden")),o?(r.addClass("k-fx-hidden"),t.addClass(this._containerClass()),this.completeProxy=n.proxy(this,"complete"),t.on(o.event,this.completeProxy),i.animationFrame(function(){r.removeClass("k-fx-hidden").addClass("k-fx-next");f.css("display","").addClass("k-fx-current");u._before(f,r);i.animationFrame(function(){t.removeClass("k-fx-start").addClass("k-fx-end");u._after(f,r)})})):this.complete(),e.promise()},stop:function(){this.complete()}});k=i.Class.extend({init:function(){var n=this;n._tickProxy=ai(n._tick,n);n._started=!1},tick:n.noop,done:n.noop,onEnd:n.noop,onCancel:n.noop,start:function(){this.enabled()&&(this.done()?this.onEnd():(this._started=!0,i.animationFrame(this._tickProxy)))},enabled:function(){return!0},cancel:function(){this._started=!1;this.onCancel()},_tick:function(){var n=this;n._started&&(n.tick(),n.done()?(n._started=!1,n.onEnd()):i.animationFrame(n._tickProxy))}});st=k.extend({init:function(n){var t=this;u(t,n);k.fn.init.call(t)},done:function(){return this.timePassed()>=this.duration},timePassed:function(){return Math.min(this.duration,new Date-this.startDate)},moveTo:function(n){var t=this,i=t.movable;t.initial=i[t.axis];t.delta=n.location-t.initial;t.duration="number"==typeof n.duration?n.duration:300;t.tick=t._easeProxy(n.ease);t.startDate=new Date;t.start()},_easeProxy:function(n){var t=this;return function(){t.movable.moveAxis(t.axis,n(t.timePassed(),t.initial,t.delta,t.duration))}}});u(st,{easeOutExpo:function(n,t,i,r){return n==r?t+i:i*(-Math.pow(2,-10*n/r)+1)+t},easeOutBack:function(n,t,i,r,u){return u=1.70158,i*((n=n/r-1)*n*((u+1)*n+u)+1)+t}});r.Animation=k;r.Transition=st;r.createEffect=e;r.box=function(t){t=n(t);var i=t.offset();return i.width=t.outerWidth(),i.height=t.outerHeight(),i};r.transformOrigin=function(n,t){var i=(n.left-t.left)*t.width/(t.width-n.width),r=(n.top-t.top)*t.height/(t.height-n.height);return{x:isNaN(i)?0:i,y:isNaN(r)?0:r}};r.fillScale=function(n,t){return Math.min(n.width/t.width,n.height/t.height)};r.fitScale=function(n,t){return Math.max(n.width/t.width,n.height/t.height)}}(window.kendo.jQuery),function(n,t){function u(r,e){for(var h,v,o,a,c,w,y=[],k=r.logic||"and",b=r.filters,l=0,p=b.length;p>l;l++)r=b[l],h=r.field,c=r.value,a=r.operator,r.filters?r=u(r,e):(w=r.ignoreCase,h=h.replace(/\./g,"/"),r=f[a],e&&(r=s[a]),r&&c!==t&&(v=n.type(c),"string"===v?(o="'{1}'",c=c.replace(/'/g,"''"),w===!0&&(h="tolower("+h+")")):o="date"===v?e?"{1:yyyy-MM-ddTHH:mm:ss+00:00}":"datetime'{1:yyyy-MM-ddTHH:mm:ss}'":"{1}",r.length>3?"substringof"!==r?o="{0}({2},"+o+")":(o="{0}("+o+",{2})","doesnotcontain"===a&&(e?(o="{0}({2},'{1}') eq -1",r="indexof"):o+=" eq false")):o="{2} {0} "+o,r=i.format(o,r,c,h))),y.push(r);return r=y.join(" "+k+" "),y.length>1&&(r="("+r+")"),r}function o(n){for(var t in n)0===t.indexOf("@odata")&&delete n[t]}var i=window.kendo,r=n.extend,f={eq:"eq",neq:"ne",gt:"gt",gte:"ge",lt:"lt",lte:"le",contains:"substringof",doesnotcontain:"substringof",endswith:"endswith",startswith:"startswith"},s=r({},f,{contains:"contains"}),e={pageSize:n.noop,page:n.noop,filter:function(n,t,i){t&&(n.$filter=u(t,i))},sort:function(t,i){var r=n.map(i,function(n){var t=n.field.replace(/\./g,"/");return"desc"===n.dir&&(t+=" desc"),t}).join(",");r&&(t.$orderby=r)},skip:function(n,t){t&&(n.$skip=t)},take:function(n,t){t&&(n.$top=t)}},h={read:{dataType:"jsonp"}};r(!0,i.data,{schemas:{odata:{type:"json",data:function(n){return n.d.results||[n.d]},total:"d.__count"}},transports:{odata:{read:{cache:!0,dataType:"jsonp",jsonp:"$callback"},update:{cache:!0,dataType:"json",contentType:"application/json",type:"PUT"},create:{cache:!0,dataType:"json",contentType:"application/json",type:"POST"},destroy:{cache:!0,dataType:"json",type:"DELETE"},parameterMap:function(n,t,r){var f,s,u,o;if(n=n||{},t=t||"read",o=(this.options||h)[t],o=o?o.dataType:"json","read"===t){f={$inlinecount:"allpages"};"json"!=o&&(f.$format="json");for(u in n)e[u]?e[u](f,n[u],r):f[u]=n[u]}else{if("json"!==o)throw Error("Only json dataType can be used for "+t+" operation.");if("destroy"!==t){for(u in n)s=n[u],"number"==typeof s&&(n[u]=s+"");f=i.stringify(n)}}return f}}}});r(!0,i.data,{schemas:{"odata-v4":{type:"json",data:function(t){return t=n.extend({},t),o(t),t.value?t.value:[t]},total:function(n){return n["@odata.count"]}}},transports:{"odata-v4":{read:{cache:!0,dataType:"json"},update:{cache:!0,dataType:"json",contentType:"application/json;IEEE754Compatible=true",type:"PUT"},create:{cache:!0,dataType:"json",contentType:"application/json;IEEE754Compatible=true",type:"POST"},destroy:{cache:!0,dataType:"json",type:"DELETE"},parameterMap:function(n,t){var r=i.data.transports.odata.parameterMap(n,t,!0);return"read"==t&&(r.$count=!0,delete r.$inlinecount),r}}}})}(window.kendo.jQuery),function(n,t){var i=window.kendo,r=n.isArray,u=n.isPlainObject,o=n.map,s=n.each,f=n.extend,h=i.getter,c=i.Class,e=c.extend({init:function(n){var y,a,v,p,t=this,h=n.total,e=n.model,w=n.parse,c=n.errors,b=n.serialize,l=n.data;e&&(u(e)&&(y=n.modelBase||i.data.Model,e.fields&&s(e.fields,function(n,i){i=u(i)&&i.field?f(i,{field:t.getter(i.field)}):{field:t.getter(i)};e.fields[n]=i}),a=e.id,a&&(v={},v[t.xpathToMember(a,!0)]={field:t.getter(a)},e.fields=f(v,e.fields),e.id=t.xpathToMember(a)),e=y.define(e)),t.model=e);h&&("string"==typeof h?(h=t.getter(h),t.total=function(n){return parseInt(h(n),10)}):"function"==typeof h&&(t.total=h));c&&("string"==typeof c?(c=t.getter(c),t.errors=function(n){return c(n)||null}):"function"==typeof c&&(t.errors=c));l&&("string"==typeof l?(l=t.xpathToMember(l),t.data=function(n){var u,i=t.evaluate(n,l);return i=r(i)?i:[i],t.model&&e.fields?(u=new t.model,o(i,function(n){if(n){var t,i={};for(t in e.fields)i[t]=u._parse(t,e.fields[t].field(n));return i}})):i}):"function"==typeof l&&(t.data=l));"function"==typeof w&&(p=t.parse,t.parse=function(n){var i=w.call(t,n);return p.call(t,i)});"function"==typeof b&&(t.serialize=b)},total:function(n){return this.data(n).length},errors:function(n){return n?n.errors:null},serialize:function(n){return n},parseDOM:function(n){for(var e,i,o,h,u,c,f={},l=n.attributes,a=l.length,s=0;a>s;s++)c=l[s],f["@"+c.nodeName]=c.nodeValue;for(i=n.firstChild;i;i=i.nextSibling)o=i.nodeType,3===o||4===o?f["#text"]=i.nodeValue:1===o&&(e=this.parseDOM(i),h=i.nodeName,u=f[h],r(u)?u.push(e):u=u!==t?[u,e]:e,f[h]=u);return f},evaluate:function(n,t){for(var e,u,o,i,f,s=t.split(".");e=s.shift();)if(n=n[e],r(n)){for(u=[],t=s.join("."),f=0,o=n.length;o>f;f++)i=this.evaluate(n[f],t),i=r(i)?i:[i],u.push.apply(u,i);return u}return n},parse:function(t){var i,r,u={};return i=t.documentElement||n.parseXML(t).documentElement,r=this.parseDOM(i),u[i.nodeName]=r,u},xpathToMember:function(n,t){return n?(n=n.replace(/^\//,"").replace(/\//g,"."),n.indexOf("@")>=0?n.replace(/\.?(@.*)/,t?"$1":'["$1"]'):n.indexOf("text()")>=0?n.replace(/(\.?text\(\))/,t?"#text":'["#text"]'):n):""},getter:function(n){return h(this.xpathToMember(n),!0)}});n.extend(!0,i.data,{XmlDataReader:e,readers:{xml:e}})}(window.kendo.jQuery),function(n,t){function bt(n,t,i,u){return function(f){var o,e={};for(o in f)e[o]=f[o];e.field=u?i+"."+f.field:i;t==r&&n._notifyChange&&n._notifyChange(e);n.trigger(t,e)}}function vi(t,i){if(t===i)return!0;var u,r=n.type(t),f=n.type(i);if(r!==f)return!1;if("date"===r)return t.getTime()===i.getTime();if("object"!==r&&"array"!==r)return!1;for(u in t)if(!vi(t[u],i[u]))return!1;return!0}function dr(n,t){var i;for(var r in n)if((i=n[r],b(i)&&i.field&&i.field===t)||i===t)return i;return null}function u(n){this.data=n||[]}function rt(n,i){if(n){var r=typeof n===s?{field:n,dir:i}:n,u=l(r)?r:r!==t?[r]:[];return ou(u,function(n){return!!n.dir})}}function yi(n){var i,f,r,t,u=n.filters;if(u)for(i=0,f=u.length;f>i;i++)r=u[i],t=r.operator,t&&typeof t===s&&(r.operator=cr[t.toLowerCase()]||t),yi(r)}function ot(n){return n&&!tt(n)?((l(n)||!n.filters)&&(n={logic:"and",filters:l(n)?n:[n]}),yi(n),n):t}function gr(n){return l(n)?n:[n]}function ut(n,i){var r=typeof n===s?{field:n,dir:i}:n,u=l(r)?r:r!==t?[r]:[];return ti(u,function(n){return{field:n.field,dir:n.dir||"asc",aggregates:n.aggregates}})}function nu(n,t){return n&&n.getTime&&t&&t.getTime?n.getTime()===t.getTime():n===t}function tu(n,t,r,u,f,e){var h,c,s,l,o;for(t=t||[],l=t.length,h=0;l>h;h++)c=t[h],s=c.aggregate,o=c.field,n[o]=n[o]||{},e[o]=e[o]||{},e[o][s]=e[o][s]||{},n[o][s]=lr[s.toLowerCase()](n[o][s],r,i.accessor(o),u,f,e[o][s])}function c(n){return"number"==typeof n&&!isNaN(n)}function st(n){return n&&n.getTime}function iu(n){for(var i=n.length,r=Array(i),t=0;i>t;t++)r[t]=n[t].toJSON();return r}function ru(n,t,i,r,u){for(var e,f,o,s=0,h=n.length;h>s;s++){e=n[s];for(f in t)o=u[f],o&&o!==f&&(e[o]=t[f](e),delete e[f])}}function pi(n,t,i,r,u){for(var e,f,o,s=0,h=n.length;h>s;s++){e=n[s];for(f in t)e[f]=i._parse(f,t[f](e)),o=u[f],o&&o!==f&&delete e[o]}}function wi(n,t,i,r,u){for(var f,o,e=0,s=n.length;s>e;e++)f=n[e],o=r[f.field],o&&o!=f.field&&(f.field=o),f.value=i._parse(f.field,f.value),f.hasSubgroups?wi(f.items,t,i,r,u):pi(f.items,t,i,r,u)}function kt(n,t,i,r,u,f){return function(e){return e=n(e),e&&!tt(r)&&("[object Array]"===pt.call(e)||e instanceof y||(e=[e]),i(e,r,new t,u,f)),e||[]}}function dt(n,t,i,r){for(var f,u,o,e=0;t.length&&r&&(f=t[e],u=f.items,o=u.length,n&&n.field===f.field&&n.value===f.value?(n.hasSubgroups&&n.items.length?dt(n.items[n.items.length-1],f.items,i,r):(u=u.slice(i,i+r),n.items=n.items.concat(u)),t.splice(e--,1)):f.hasSubgroups&&u.length?dt(f,u,i,r):(u=u.slice(i,i+r),f.items=u,f.items.length||t.splice(e--,1)),0===u.length?i-=o:(i=0,r-=u.length),!(++e>=t.length)););t.length>e&&t.splice(e,t.length-e)}function gt(n){for(var f,i,r,u=[],t=0,e=n.length;e>t;t++)if(r=n.at(t),r.hasSubgroups)u=u.concat(gt(r.items));else for(f=r.items,i=0;f.length>i;i++)u.push(f.at(i));return u}function bi(n,t){var r,u,i;if(t)for(r=0,u=n.length;u>r;r++)i=n.at(r),i.hasSubgroups?bi(i.items,t):i.items=new wt(i.items,t)}function ki(n,t){for(var i=0,r=n.length;r>i;i++)if(n[i].hasSubgroups){if(ki(n[i].items,t))return!0}else if(t(n[i].items,n[i]))return!0}function uu(n,t,i,r){for(var u=0;n.length>u&&n[u].data!==t&&!di(n[u].data,i,r);u++);}function di(n,t,i){for(var r=0,u=n.length;u>r;r++){if(n[r]&&n[r].hasSubgroups)return di(n[r].items,t,i);if(n[r]===t||n[r]===i)return n[r]=i,!0}}function gi(n,i,r,u,f){for(var e,s,o=0,h=n.length;h>o;o++)if(e=n[o],e&&!(e instanceof u))if(e.hasSubgroups===t||f){for(s=0;i.length>s;s++)if(i[s]===e){n[o]=i.at(s);uu(r,i,e,n[o]);break}}else gi(e.items,i,r,u,f)}function nr(n,t){for(var r,i=0,u=n.length;u>i;i++)if(r=n.at(i),r.uid==t.uid)return n.splice(i,1),r}function ni(n,t){for(var i,u,r=n.length-1,f=0;r>=f;r--)u=n[r],i={value:t.get(u.field),field:u.field,items:i?[i]:[t],hasSubgroups:!!i,aggregates:{}};return i}function tr(n,t){return t?rr(n,function(n){return n.uid?n.uid==t.uid:n[t.idField]===t.id}):-1}function ir(n,t){return t?rr(n,function(n){return n.uid==t.uid}):-1}function rr(n,t){for(var i=0,r=n.length;r>i;i++)if(t(n[i]))return i;return-1}function ur(n,t){var i,r;return n&&!tt(n)?(i=n[t],r=b(i)?i.from||i.field||t:n[t]||t,a(r)?t:r):t}function fr(n,t){var r,f,u,i={};for(u in n)"filters"!==u&&(i[u]=n[u]);if(n.filters)for(i.filters=[],r=0,f=n.filters.length;f>r;r++)i.filters[r]=fr(n.filters[r],t);else i.field=ur(t.fields,i.field);return i}function ht(n,t){for(var i,u,f,o=[],r=0,e=n.length;e>r;r++){i={};u=n[r];for(f in u)i[f]=u[f];i.field=ur(t.fields,i.field);i.aggregates&&l(i.aggregates)&&(i.aggregates=ht(i.aggregates,t));o.push(i)}return o}function fu(t,i){for(var e,u,r,s=n(t)[0].children,h=[],c=i[0],l=i[1],f=0,o=s.length;o>f;f++)e={},r=s[f],r.disabled||(e[c.field]=r.text,u=r.attributes.value,u=u&&u.specified?r.value:r.text,e[l.field]=u,h.push(e));return h}function eu(t,i){for(var r,h,f,e,o,c=n(t)[0].tBodies[0],l=c?c.rows:[],v=i.length,a=[],u=0,s=l.length;s>u;u++){for(f={},o=!0,h=l[u].cells,r=0;v>r;r++)e=h[r],"th"!==e.nodeName.toLowerCase()&&(o=!1,f[i[r].field]=e.innerHTML);o||a.push(f)}return a}function er(n){return function(){var t=this._data,i=h.fn[n].apply(this,yt.call(arguments));return this._data!=t&&this._attachBubbleHandlers(),i}}function or(t,i){function s(n,t){return n.filter(t).add(n.find(t))}for(var r,f,h,o,c,u,a=n(t).children(),v=[],b=i[0].field,y=i[1]&&i[1].field,p=i[2]&&i[2].field,w=i[3]&&i[3].field,e=0,l=a.length;l>e;e++)r={_loaded:!0},f=a.eq(e),o=f[0].firstChild,u=f.children(),t=u.filter("ul"),u=u.filter(":not(ul)"),h=f.attr("data-id"),h&&(r.id=h),o&&(r[b]=3==o.nodeType?o.nodeValue:u.text()),y&&(r[y]=s(u,"a").attr("href")),w&&(r[w]=s(u,"img").attr("src")),p&&(c=s(u,".k-sprite").prop("className"),r[p]=c&&n.trim(c.replace("k-sprite",""))),t.length&&(r.items=or(t.eq(0),i)),"true"==f.attr("data-hasChildren")&&(r.hasChildren=!0),v.push(r);return v}var ti,ct,sr,hr,cr,lr,ii,ri,nt,ui,h,fi,ei,w,oi,ar,e=n.extend,v=n.proxy,b=n.isPlainObject,tt=n.isEmptyObject,l=n.isArray,ou=n.grep,si=n.ajax,hi=n.each,k=n.noop,i=window.kendo,a=i.isFunction,d=i.Observable,lt=i.Class,s="string",ci="function",vr="create",yr="read",pr="update",wr="destroy",r="change",br="sync",li="get",g="error",ft="requestStart",ai="progress",it="requestEnd",su=[vr,yr,pr,wr],et=function(n){return n},at=i.getter,vt=i.stringify,f=Math,hu=[].push,cu=[].join,lu=[].pop,au=[].splice,vu=[].shift,yt=[].slice,yu=[].unshift,pt={}.toString,pu=i.support.stableSort,wu=/^\/Date\((.*?)\)\/$/,bu=/(\r+|\n+)/g,ku=/(?=['\\])/g,y=d.extend({init:function(n,t){var i=this;i.type=t||o;d.fn.init.call(i);i.length=n.length;i.wrapAll(n,i)},at:function(n){return this[n]},toJSON:function(){for(var t,i=this.length,r=Array(i),n=0;i>n;n++)t=this[n],t instanceof o&&(t=t.toJSON()),r[n]=t;return r},parent:k,wrapAll:function(n,t){var i,r,u=this,f=function(){return u};for(t=t||[],i=0,r=n.length;r>i;i++)t[i]=u.wrap(n[i],f);return t},wrap:function(n,t){var u,i=this;return null!==n&&"[object Object]"===pt.call(n)&&(u=n instanceof i.type||n instanceof p,u||(n=n instanceof o?n.toJSON():n,n=new i.type(n)),n.parent=t,n.bind(r,function(n){i.trigger(r,{field:n.field,node:n.node,index:n.index,items:n.items||[this],action:n.node?n.action||"itemloaded":"itemchange"})})),n},push:function(){var n,i=this.length,t=this.wrapAll(arguments);return n=hu.apply(this,t),this.trigger(r,{action:"add",index:i,items:t}),n},slice:yt,sort:[].sort,join:cu,pop:function(){var n=this.length,t=lu.apply(this);return n&&this.trigger(r,{action:"remove",index:n-1,items:[t]}),t},splice:function(n,t,i){var u,f,e,o=this.wrapAll(yt.call(arguments,2));if(u=au.apply(this,[n,t].concat(o)),u.length)for(this.trigger(r,{action:"remove",index:n,items:u}),f=0,e=u.length;e>f;f++)u[f].children&&u[f].unbind(r);return i&&this.trigger(r,{action:"add",index:n,items:o}),u},shift:function(){var t=this.length,n=vu.apply(this);return t&&this.trigger(r,{action:"remove",index:0,items:[n]}),n},unshift:function(){var n,t=this.wrapAll(arguments);return n=yu.apply(this,t),this.trigger(r,{action:"add",index:0,items:t}),n},indexOf:function(n){for(var r=this,t=0,i=r.length;i>t;t++)if(r[t]===n)return t;return-1},forEach:function(n){for(var t=0,i=this.length;i>t;t++)n(this[t],t,this)},map:function(n){for(var t=0,i=[],r=this.length;r>t;t++)i[t]=n(this[t],t,this);return i},filter:function(n){for(var i,t=0,r=[],u=this.length;u>t;t++)i=this[t],n(i,t,this)&&(r[r.length]=i);return r},find:function(n){for(var i,t=0,r=this.length;r>t;t++)if(i=this[t],n(i,t,this))return i},every:function(n){for(var i,t=0,r=this.length;r>t;t++)if(i=this[t],!n(i,t,this))return!1;return!0},some:function(n){for(var i,t=0,r=this.length;r>t;t++)if(i=this[t],n(i,t,this))return!0;return!1},remove:function(n){var t=this.indexOf(n);-1!==t&&this.splice(t,1)},empty:function(){this.splice(0,this.length)}}),wt=y.extend({init:function(n,t){d.fn.init.call(this);this.type=t||o;for(var i=0;n.length>i;i++)this[i]=n[i];this.length=i;this._parent=v(function(){return this},this)},at:function(n){var t=this[n];return t instanceof this.type?t.parent=this._parent:t=this[n]=this.wrap(t,this._parent),t}}),o=d.extend({init:function(n){var t,r,u=this,f=function(){return u};d.fn.init.call(this);for(r in n)t=n[r],"object"==typeof t&&t&&!t.getTime&&"_"!=r.charAt(0)&&(t=u.wrap(t,r,f)),u[r]=t;u.uid=i.guid()},shouldSerialize:function(n){return this.hasOwnProperty(n)&&"_events"!==n&&typeof this[n]!==ci&&"uid"!==n},forEach:function(n){for(var t in this)this.shouldSerialize(t)&&n(this[t],t)},toJSON:function(){var n,t,i={};for(t in this)this.shouldSerialize(t)&&(n=this[t],(n instanceof o||n instanceof y)&&(n=n.toJSON()),i[t]=n);return i},get:function(n){var r,t=this;return t.trigger(li,{field:n}),r="this"===n?t:i.getter(n,!0)(t)},_set:function(n,t){var r,u,f,s=this,e=n.indexOf(".")>=0;if(e)for(r=n.split("."),u="";r.length>1;){if(u+=r.shift(),f=i.getter(u,!0)(s),f instanceof o)return f.set(r.join("."),t),e;u+="."}return i.setter(n)(s,t),e},set:function(n,t){var u=this,f=n.indexOf(".")>=0,e=i.getter(n,!0)(u);e!==t&&(u.trigger("set",{field:n,value:t})||(f||(t=u.wrap(t,n,function(){return u})),(!u._set(n,t)||n.indexOf("(")>=0||n.indexOf("[")>=0)&&u.trigger(r,{field:n})))},parent:k,wrap:function(n,t,i){var u,f,s=this,e=pt.call(n);return null==n||"[object Object]"!==e&&"[object Array]"!==e||(u=n instanceof y,f=n instanceof h,"[object Object]"!==e||f||u?("[object Array]"===e||u||f)&&(u||f||(n=new y(n)),n.parent()!=i()&&n.bind(r,bt(s,r,t,!1))):(n instanceof o||(n=new o(n)),n.parent()!=i()&&(n.bind(li,bt(s,li,t,!0)),n.bind(r,bt(s,r,t,!0)))),n.parent=i),n}}),kr={number:function(n){return i.parseFloat(n)},date:function(n){return i.parseDate(n)},boolean:function(n){return typeof n===s?"true"===n.toLowerCase():null!=n?!!n:n},string:function(n){return null!=n?n+"":n},"default":function(n){return n}},du={string:"",number:0,date:new Date,boolean:!1,"default":""},p=o.extend({init:function(i){var u,f,r=this;if((!i||n.isEmptyObject(i))&&(i=n.extend({},r.defaults,i),r._initializers))for(u=0;r._initializers.length>u;u++)f=r._initializers[u],i[f]=r.defaults[f]();o.fn.init.call(r,i);r.dirty=!1;r.idField&&(r.id=r.get(r.idField),r.id===t&&(r.id=r._defaultId))},shouldSerialize:function(n){return o.fn.shouldSerialize.call(this,n)&&"uid"!==n&&!("id"!==this.idField&&"id"===n)&&"dirty"!==n&&"_accessors"!==n},_parse:function(n,t){var i,u=this,f=n,r=u.fields||{};return n=r[n],n||(n=dr(r,f)),n&&(i=n.parse,!i&&n.type&&(i=kr[n.type.toLowerCase()])),i?i(t):t},_notifyChange:function(n){var t=n.action;("add"==t||"remove"==t)&&(this.dirty=!0)},editable:function(n){return n=(this.fields||{})[n],n?n.editable!==!1:!0},set:function(n,t,i){var r=this;r.editable(n)&&(t=r._parse(n,t),vi(t,r.get(n))||(r.dirty=!0,o.fn.set.call(r,n,t,i)))},accept:function(n){var i,r,t=this,u=function(){return t};for(i in n)r=n[i],"_"!=i.charAt(0)&&(r=t.wrap(n[i],i,u)),t._set(i,r);t.idField&&(t.id=t.get(t.idField));t.dirty=!1},isNew:function(){return this.id===this._defaultId}});p.define=function(n,i){i===t&&(i=n,n=p);var o,f,u,v,h,l,b,c,r=e({defaults:{}},i),y={},a=r.id,w=[];if(a&&(r.idField=a),r.id&&delete r.id,a&&(r.defaults[a]=r._defaultId=""),"[object Array]"===pt.call(r.fields)){for(l=0,b=r.fields.length;b>l;l++)u=r.fields[l],typeof u===s?y[u]={}:u.field&&(y[u.field]=u);r.fields=y}for(f in r.fields)u=r.fields[f],v=u.type||"default",h=null,c=f,f=typeof u.field===s?u.field:f,u.nullable||(h=r.defaults[c!==f?c:f]=u.defaultValue!==t?u.defaultValue:du[v.toLowerCase()],"function"==typeof h&&w.push(f)),i.id===f&&(r._defaultId=h),r.defaults[c!==f?c:f]=h,u.parse=u.parse||kr[v];return w.length>0&&(r._initializers=w),o=n.extend(r),o.define=function(n){return p.define(o,n)},r.fields&&(o.fields=r.fields,o.idField=r.idField),o};ct={selector:function(n){return a(n)?n:at(n)},compare:function(n){var t=this.selector(n);return function(n,i){return n=t(n),i=t(i),null==n&&null==i?0:null==n?-1:null==i?1:n.localeCompare?n.localeCompare(i):n>i?1:i>n?-1:0}},create:function(n){var t=n.compare||this.compare(n.field);return"desc"==n.dir?function(n,i){return t(i,n,!0)}:t},combine:function(n){return function(t,i){for(var u=n[0](t,i),r=1,f=n.length;f>r;r++)u=u||n[r](t,i);return u}}};sr=e({},ct,{asc:function(n){var t=this.selector(n);return function(n,i){var r=t(n),u=t(i);return r&&r.getTime&&u&&u.getTime&&(r=r.getTime(),u=u.getTime()),r===u?n.__position-i.__position:null==r?-1:null==u?1:r.localeCompare?r.localeCompare(u):r>u?1:-1}},desc:function(n){var t=this.selector(n);return function(n,i){var u=t(n),r=t(i);return u&&u.getTime&&r&&r.getTime&&(u=u.getTime(),r=r.getTime()),u===r?n.__position-i.__position:null==u?1:null==r?-1:r.localeCompare?r.localeCompare(u):r>u?1:-1}},create:function(n){return this[n.dir](n.field)}});ti=function(n,t){for(var r=n.length,u=Array(r),i=0;r>i;i++)u[i]=t(n[i],i,n);return u};hr=function(){function t(n){return n.replace(ku,"\\").replace(bu,"")}function n(n,i,r,u){var f;return null!=r&&(typeof r===s&&(r=t(r),f=wu.exec(r),f?r=new Date(+f[1]):u?(r="'"+r.toLowerCase()+"'",i="("+i+" || '').toLowerCase()"):r="'"+r+"'"),r.getTime&&(i="("+i+"?"+i+".getTime():"+i+")",r=r.getTime())),i+" "+n+" "+r}return{eq:function(t,i,r){return n("==",t,i,r)},neq:function(t,i,r){return n("!=",t,i,r)},gt:function(t,i,r){return n(">",t,i,r)},gte:function(t,i,r){return n(">=",t,i,r)},lt:function(t,i,r){return n("<",t,i,r)},lte:function(t,i,r){return n("<=",t,i,r)},startswith:function(n,i,r){return r&&(n="("+n+" || '').toLowerCase()",i&&(i=i.toLowerCase())),i&&(i=t(i)),n+".lastIndexOf('"+i+"', 0) == 0"},endswith:function(n,i,r){return r&&(n="("+n+" || '').toLowerCase()",i&&(i=i.toLowerCase())),i&&(i=t(i)),n+".indexOf('"+i+"', "+n+".length - "+(i||"").length+") >= 0"},contains:function(n,i,r){return r&&(n="("+n+" || '').toLowerCase()",i&&(i=i.toLowerCase())),i&&(i=t(i)),n+".indexOf('"+i+"') >= 0"},doesnotcontain:function(n,i,r){return r&&(n="("+n+" || '').toLowerCase()",i&&(i=i.toLowerCase())),i&&(i=t(i)),n+".indexOf('"+i+"') == -1"}}}();u.filterExpr=function(n){for(var r,f,h,c,a=[],e=[],o=[],v=n.filters,s=0,l=v.length;l>s;s++)r=v[s],h=r.field,c=r.operator,r.filters?(f=u.filterExpr(r),r=f.expression.replace(/__o\[(\d+)\]/g,function(n,t){return t=+t,"__o["+(o.length+t)+"]"}).replace(/__f\[(\d+)\]/g,function(n,t){return t=+t,"__f["+(e.length+t)+"]"}),o.push.apply(o,f.operators),e.push.apply(e,f.fields)):(typeof h===ci?(f="__f["+e.length+"](d)",e.push(h)):f=i.expr(h),typeof c===ci?(r="__o["+o.length+"]("+f+", "+r.value+")",o.push(c)):r=hr[(c||"eq").toLowerCase()](f,r.value,r.ignoreCase!==t?r.ignoreCase:!0)),a.push(r);return{expression:"("+a.join({and:" && ",or:" || "}[n.logic])+")",fields:e,operators:o}};cr={"==":"eq",equals:"eq",isequalto:"eq",equalto:"eq",equal:"eq","!=":"neq",ne:"neq",notequals:"neq",isnotequalto:"neq",notequalto:"neq",notequal:"neq","<":"lt",islessthan:"lt",lessthan:"lt",less:"lt","<=":"lte",le:"lte",islessthanorequalto:"lte",lessthanequal:"lte",">":"gt",isgreaterthan:"gt",greaterthan:"gt",greater:"gt",">=":"gte",isgreaterthanorequalto:"gte",greaterthanequal:"gte",ge:"gte",notsubstringof:"doesnotcontain"};u.normalizeFilter=ot;u.prototype={toArray:function(){return this.data},range:function(n,t){return new u(this.data.slice(n,n+t))},skip:function(n){return new u(this.data.slice(n))},take:function(n){return new u(this.data.slice(0,n))},select:function(n){return new u(ti(this.data,n))},order:function(n,t){var i={dir:t};return n&&(n.compare?i.compare=n.compare:i.field=n),new u(this.data.slice(0).sort(ct.create(i)))},orderBy:function(n){return this.order(n,"asc")},orderByDescending:function(n){return this.order(n,"desc")},sort:function(n,t,i){var r,f,u=rt(n,t),e=[];if(i=i||ct,u.length){for(r=0,f=u.length;f>r;r++)e.push(i.create(u[r]));return this.orderBy({compare:i.combine(e)})}return this},filter:function(n){var t,r,s,i,h,f,e,o,c=this.data,l=[];if(n=ot(n),!n||0===n.filters.length)return this;for(i=u.filterExpr(n),f=i.fields,e=i.operators,h=o=Function("d, __f, __o","return "+i.expression),(f.length||e.length)&&(o=function(n){return h(n,f,e)}),t=0,s=c.length;s>t;t++)r=c[t],o(r)&&l.push(r);return new u(l)},group:function(n,t){n=ut(n||[]);t=t||this.data;var i,f=this,r=new u(f.data);return n.length>0&&(i=n[0],r=r.groupBy(i).select(function(r){var f=new u(t).filter([{field:r.field,operator:"eq",value:r.value,ignoreCase:!1}]);return{field:r.field,value:r.value,items:n.length>1?new u(r.items).group(n.slice(1),f.toArray()).toArray():r.items,hasSubgroups:n.length>1,aggregates:f.aggregate(i.aggregates)}})),r},groupBy:function(n){if(tt(n)||!this.data.length)return new u([]);for(var o,s,t=n.field,h=this._sortForGrouping(t,n.dir||"asc"),l=i.accessor(t),f=l.get(h[0],t),e={field:t,value:f,items:[]},a=[e],r=0,c=h.length;c>r;r++)o=h[r],s=l.get(o,t),nu(f,s)||(f=s,e={field:t,value:f,items:[]},a.push(e)),e.items.push(o);return new u(a)},_sortForGrouping:function(n,t){var i,f,r=this.data;if(!pu){for(i=0,f=r.length;f>i;i++)r[i].__position=i;for(r=new u(r).sort(n,t,sr).toArray(),i=0,f=r.length;f>i;i++)delete r[i].__position;return r}return this.sort(n,t).toArray()},aggregate:function(n){var t,i,r={},u={};if(n&&n.length)for(t=0,i=this.data.length;i>t;t++)tu(r,n,this.data[t],t,i,u);return r}};lr={sum:function(n,t,i){var r=i.get(t);return c(n)?c(r)&&(n+=r):n=r,n},count:function(n){return(n||0)+1},average:function(n,i,r,u,f,e){var o=r.get(i);return e.count===t&&(e.count=0),c(n)?c(o)&&(n+=o):n=o,c(o)&&e.count++,u==f-1&&c(n)&&(n/=e.count),n},max:function(n,t,i){var r=i.get(t);return c(n)||st(n)||(n=r),r>n&&(c(r)||st(r))&&(n=r),n},min:function(n,t,i){var r=i.get(t);return c(n)||st(n)||(n=r),n>r&&(c(r)||st(r))&&(n=r),n}};u.process=function(n,i){i=i||{};var e,r=new u(n),f=i.group,o=ut(f||[]).concat(rt(i.sort||[])),s=i.filterCallback,h=i.filter,c=i.skip,l=i.take;return h&&(r=r.filter(h),s&&(r=s(r)),e=r.toArray().length),o&&(r=r.sort(o),f&&(n=r.toArray())),c!==t&&l!==t&&(r=r.range(c,l)),f&&(r=r.group(f,n)),{total:e,data:r.toArray()}};ii=lt.extend({init:function(n){this.data=n.data},read:function(n){n.success(this.data)},update:function(n){n.success(n.data)},create:function(n){n.success(n.data)},destroy:function(n){n.success(n.data)}});ri=lt.extend({init:function(n){var i,t=this;n=t.options=e({},t.options,n);hi(su,function(t,i){typeof n[i]===s&&(n[i]={url:n[i]})});t.cache=n.cache?nt.create(n.cache):{find:k,add:k};i=n.parameterMap;a(n.push)&&(t.push=n.push);t.push||(t.push=et);t.parameterMap=a(i)?i:function(n){var t={};return hi(n,function(n,r){n in i&&(n=i[n],b(n)&&(r=n.value(r),n=n.key));t[n]=r}),t}},options:{parameterMap:et},create:function(n){return si(this.setup(n,vr))},read:function(i){var r,o,u,f=this,e=f.cache;i=f.setup(i,yr);r=i.success||k;o=i.error||k;u=e.find(i.data);u!==t?r(u):(i.success=function(n){e.add(i.data,n);r(n)},n.ajax(i))},update:function(n){return si(this.setup(n,pr))},destroy:function(n){return si(this.setup(n,wr))},setup:function(n,t){n=n||{};var r,u=this,i=u.options[t],f=a(i.data)?i.data(n.data):i.data;return n=e(!0,{},i,n),r=e(!0,{},f,n.data),n.data=u.parameterMap(r,t),a(n.url)&&(n.url=n.url(r)),n}});nt=lt.extend({init:function(){this._store={}},add:function(n,i){n!==t&&(this._store[vt(n)]=i)},find:function(n){return this._store[vt(n)]},clear:function(){this._store={}},remove:function(n){delete this._store[vt(n)]}});nt.create=function(n){var t={inmemory:function(){return new nt}};return b(n)&&a(n.find)?n:n===!0?new nt:t[n]()};ui=lt.extend({init:function(n){var l,e,i,y,o,w,k,u,h,a,f,c,r,t=this;n=n||{};for(l in n)e=n[l],t[l]=typeof e===s?at(e):e;y=n.modelBase||p;b(t.model)&&(t.model=i=y.define(t.model));o=v(t.data,t);t._dataAccessFunction=o;t.model&&(w=v(t.groups,t),k=v(t.serialize,t),u={},h={},a={},f={},c=!1,i=t.model,i.fields&&(hi(i.fields,function(n,t){var i;r=n;b(t)&&t.field?r=t.field:typeof t===s&&(r=t);b(t)&&t.from&&(i=t.from);c=c||i&&i!==n||r!==n;h[n]=at(i||r);a[n]=at(n);u[i||r]=n;f[n]=i||r}),!n.serialize&&c&&(t.serialize=kt(k,i,ru,a,u,f))),t._dataAccessFunction=o,t.data=kt(o,i,pi,h,u,f),t.groups=kt(w,i,wi,h,u,f))},errors:function(n){return n?n.errors:null},parse:et,data:et,total:function(n){return n.length},groups:et,aggregates:function(){return{}},serialize:function(n){return n}});h=d.extend({init:function(n){var s,o,f,u=this;n&&(o=n.data);n=u.options=e({},u.options,n);u._map={};u._prefetch={};u._data=[];u._pristineData=[];u._ranges=[];u._view=[];u._pristineTotal=0;u._destroyed=[];u._pageSize=n.pageSize;u._page=n.page||(n.pageSize?1:t);u._sort=rt(n.sort);u._filter=ot(n.filter);u._group=ut(n.group);u._aggregate=n.aggregate;u._total=n.total;u._shouldDetachObservableParents=!0;d.fn.init.call(u);u.transport=fi.create(n,o);a(u.transport.push)&&u.transport.push({pushCreate:v(u._pushCreate,u),pushUpdate:v(u._pushUpdate,u),pushDestroy:v(u._pushDestroy,u)});null!=n.offlineStorage&&("string"==typeof n.offlineStorage?(f=n.offlineStorage,u._storage={getItem:function(){return JSON.parse(localStorage.getItem(f))},setItem:function(n){localStorage.setItem(f,vt(n))}}):u._storage=n.offlineStorage);u.reader=new i.data.readers[n.schema.type||"json"](n.schema);s=u.reader.model||{};u._detachObservableParents();u._data=u._observe(u._data);u._online=!0;u.bind(["push",g,r,ft,br,it,ai],n)},options:{data:null,schema:{modelBase:p},offlineStorage:null,serverSorting:!1,serverPaging:!1,serverFiltering:!1,serverGrouping:!1,serverAggregates:!1,batch:!1},online:function(i){return i!==t?this._online!=i&&(this._online=i,i)?this.sync():n.Deferred().resolve().promise():this._online},offlineData:function(n){return null==this.options.offlineStorage?null:n!==t?this._storage.setItem(n):this._storage.getItem()||{}},_isServerGrouped:function(){var n=this.group()||[];return this.options.serverGrouping&&n.length},_pushCreate:function(n){this._push(n,"pushCreate")},_pushUpdate:function(n){this._push(n,"pushUpdate")},_pushDestroy:function(n){this._push(n,"pushDestroy")},_push:function(n,t){var i=this._readData(n);i||(i=n);this[t](i)},_flatData:function(n,t){if(n){if(this._isServerGrouped())return gt(n);if(!t)for(var i=0;n.length>i;i++)n.at(i)}return n},parent:k,get:function(n){for(var i=this._flatData(this._data),t=0,r=i.length;r>t;t++)if(i[t].id==n)return i[t]},getByUid:function(n){var t,r,i=this._flatData(this._data);if(i)for(t=0,r=i.length;r>t;t++)if(i[t].uid==n)return i[t]},indexOf:function(n){return ir(this._data,n)},at:function(n){return this._data.at(n)},data:function(n){var r,i=this;if(n===t){if(i._data)for(r=0;i._data.length>r;r++)i._data.at(r);return i._data}i._detachObservableParents();i._data=this._observe(n);i._pristineData=n.slice(0);i._storeData();i._ranges=[];i.trigger("reset");i._addRange(i._data);i._total=i._data.length;i._pristineTotal=i._total;i._process(i._data)},view:function(n){return n===t?this._view:(this._view=this._observeView(n),t)},_observeView:function(n){var i,t=this;return gi(n,t._data,t._ranges,t.reader.model||o,t._isServerGrouped()),i=new wt(n,t.reader.model),i.parent=function(){return t.parent()},i},flatView:function(){var n=this.group()||[];return n.length?gt(this._view):this._view},add:function(n){return this.insert(this._data.length,n)},_createNewModel:function(n){return this.reader.model?new this.reader.model(n):n instanceof o?n:new o(n)},insert:function(n,t){return t||(t=n,n=0),t instanceof p||(t=this._createNewModel(t)),this._isServerGrouped()?this._data.splice(n,0,ni(this.group(),t)):this._data.splice(n,0,t),t},pushCreate:function(n){var t,f,i,e,u,r;l(n)||(n=[n]);t=[];f=this.options.autoSync;this.options.autoSync=!1;try{for(i=0;n.length>i;i++)e=n[i],u=this.add(e),t.push(u),r=u.toJSON(),this._isServerGrouped()&&(r=ni(this.group(),r)),this._pristineData.push(r)}finally{this.options.autoSync=f}t.length&&this.trigger("push",{type:"create",items:t})},pushUpdate:function(n){var u,f,i,e,t;for(l(n)||(n=[n]),u=[],f=0;n.length>f;f++)i=n[f],e=this._createNewModel(i),t=this.get(e.id),t?(u.push(t),t.accept(i),t.trigger(r),this._updatePristineForModel(t,i)):this.pushCreate(i);u.length&&this.trigger("push",{type:"update",items:u})},pushDestroy:function(n){var t=this._removeItems(n);t.length&&this.trigger("push",{type:"destroy",items:t})},_removeItems:function(n){var i,f,t,e,r,u;l(n)||(n=[n]);i=[];f=this.options.autoSync;this.options.autoSync=!1;try{for(t=0;n.length>t;t++)e=n[t],r=this._createNewModel(e),u=!1,this._eachItem(this._data,function(n){for(var f,t=0;n.length>t;t++)if(f=n.at(t),f.id===r.id){i.push(f);n.splice(t,1);u=!0;break}}),u&&(this._removePristineForModel(r),this._destroyed.pop())}finally{this.options.autoSync=f}return i},remove:function(n){var i,r=this,u=r._isServerGrouped();return this._eachItem(r._data,function(f){return i=nr(f,n),i&&u?(i.isNew&&i.isNew()||r._destroyed.push(i),!0):t}),this._removeModelFromRanges(n),this._updateRangesLength(),n},sync:function(){var r,e,i,t=this,o=[],s=[],h=t._destroyed,u=t._flatData(t._data),f=n.Deferred().resolve().promise();if(t.online()){if(!t.reader.model)return f;for(r=0,e=u.length;e>r;r++)u[r].isNew()?o.push(u[r]):u[r].dirty&&s.push(u[r]);i=[];i.push.apply(i,t._send("create",o));i.push.apply(i,t._send("update",s));i.push.apply(i,t._send("destroy",h));f=n.when.apply(null,i).then(function(){for(var n=0,i=arguments.length;i>n;n++)t._accept(arguments[n]);t._storeData(!0);t._change({action:"sync"});t.trigger(br)})}else t._storeData(!0),t._change({action:"sync"});return f},cancelChanges:function(n){var t=this;n instanceof i.data.Model?t._cancelModel(n):(t._destroyed=[],t._detachObservableParents(),t._data=t._observe(t._pristineData),t.options.serverPaging&&(t._total=t._pristineTotal),t._ranges=[],t._addRange(t._data),t._change())},hasChanges:function(){var n,i,t=this._data;if(this._destroyed.length)return!0;for(n=0,i=t.length;i>n;n++)if(t[n].isNew&&t[n].isNew()||t[n].dirty)return!0;return!1},_accept:function(t){var o,r=this,f=t.models,i=t.response,u=0,s=r._isServerGrouped(),h=r._pristineData,e=t.type;if(r.trigger(it,{response:i,type:e}),i&&!tt(i)){if(i=r.reader.parse(i),r._handleCustomErrors(i))return;i=r.reader.data(i);l(i)||(i=[i])}else i=n.map(f,function(n){return n.toJSON()});for("destroy"===e&&(r._destroyed=[]),u=0,o=f.length;o>u;u++)"destroy"!==e?(f[u].accept(i[u]),"create"===e?h.push(s?ni(r.group(),f[u]):i[u]):"update"===e&&r._updatePristineForModel(f[u],i[u])):r._removePristineForModel(f[u])},_updatePristineForModel:function(n,t){this._executeOnPristineForModel(n,function(n,r){i.deepExtend(r[n],t)})},_executeOnPristineForModel:function(n,i){this._eachPristineItem(function(r){var u=tr(r,n);return u>-1?(i(u,r),!0):t})},_removePristineForModel:function(n){this._executeOnPristineForModel(n,function(n,t){t.splice(n,1)})},_readData:function(n){var t=this._isServerGrouped()?this.reader.groups:this.reader.data;return t.call(this.reader,n)},_eachPristineItem:function(n){this._eachItem(this._pristineData,n)},_eachItem:function(n,t){n&&n.length&&(this._isServerGrouped()?ki(n,t):t(n))},_pristineForModel:function(n){var r,i,u=function(u){return i=tr(u,n),i>-1?(r=u[i],!0):t};return this._eachPristineItem(u),r},_cancelModel:function(n){var t=this._pristineForModel(n);this._eachItem(this._data,function(i){var r=ir(i,n);r>=0&&(!t||n.isNew()&&!t.__state__?i.splice(r,1):i[r].accept(t))})},_promise:function(t,i,r){var u=this;return n.Deferred(function(n){u.trigger(ft,{type:r});u.transport[r].call(u.transport,e({success:function(t){n.resolve({response:t,models:i,type:r})},error:function(t,i,r){n.reject(t);u.error(t,i,r)}},t))}).promise()},_send:function(n,t){var i,f,r=this,u=[],e=r.reader.serialize(iu(t));if(r.options.batch)t.length&&u.push(r._promise({data:{models:e}},t,n));else for(i=0,f=t.length;f>i;i++)u.push(r._promise({data:e[i]},[t[i]],n));return u},read:function(t){var i=this,u=i._params(t),r=n.Deferred();return i._queueRequest(u,function(){var n=i.trigger(ft,{type:"read"});n?(i._dequeueRequest(),r.resolve(n)):(i.trigger(ai),i._ranges=[],i.trigger("reset"),i.online()?i.transport.read({data:u,success:function(n){i.success(n);r.resolve()},error:function(){var n=yt.call(arguments);i.error.apply(i,n);r.reject.apply(r,n)}}):null!=i.options.offlineStorage&&(i.success(i.offlineData()),r.resolve()))}),r.promise()},_readAggregates:function(n){return this.reader.aggregates(n)},success:function(n){var f,r,u,e,i=this,o=i.options;if(i.trigger(it,{response:n,type:"read"}),i.online()){if(n=i.reader.parse(n),i._handleCustomErrors(n))return i._dequeueRequest(),t;i._total=i.reader.total(n);i._aggregate&&o.serverAggregates&&(i._aggregateResult=i._readAggregates(n));n=i._readData(n)}else{for(n=i._readData(n),f=[],r=0;n.length>r;r++)u=n[r],e=u.__state__,"destroy"==e?this._destroyed.push(this._createNewModel(u)):f.push(u);n=f;i._total=n.length}i._pristineTotal=i._total;i._pristineData=n.slice(0);i._detachObservableParents();i._data=i._observe(n);null!=i.options.offlineStorage&&i._eachItem(i._data,function(n){for(var i,t=0;n.length>t;t++)i=n.at(t),"update"==i.__state__&&(i.dirty=!0)});i._storeData();i._addRange(i._data);i._process(i._data);i._dequeueRequest()},_detachObservableParents:function(){if(this._data&&this._shouldDetachObservableParents)for(var n=0;this._data.length>n;n++)this._data[n].parent&&(this._data[n].parent=k)},_storeData:function(n){function u(n){for(var t,i,o=[],r=0;n.length>r;r++)t=n.at(r),i=t.toJSON(),f&&t.items?i.items=u(t.items):(i.uid=t.uid,e&&(t.isNew()?i.__state__="create":t.dirty&&(i.__state__="update"))),o.push(i);return o}var t,i,r,f=this._isServerGrouped(),e=this.reader.model;if(null!=this.options.offlineStorage){for(t=u(this._data),i=0;this._destroyed.length>i;i++)r=this._destroyed[i].toJSON(),r.__state__="destroy",t.push(r);this.offlineData(t);n&&(this._pristineData=t)}},_addRange:function(n){var t=this,i=t._skip||0,r=i+t._flatData(n,!0).length;t._ranges.push({start:i,end:r,data:n});t._ranges.sort(function(n,t){return n.start-t.start})},error:function(n,t,i){this._dequeueRequest();this.trigger(it,{});this.trigger(g,{xhr:n,status:t,errorThrown:i})},_params:function(n){var t=this,i=e({take:t.take(),skip:t.skip(),page:t.page(),pageSize:t.pageSize(),sort:t._sort,filter:t._filter,group:t._group,aggregate:t._aggregate},n);return t.options.serverPaging||(delete i.take,delete i.skip,delete i.page,delete i.pageSize),t.options.serverGrouping?t.reader.model&&i.group&&(i.group=ht(i.group,t.reader.model)):delete i.group,t.options.serverFiltering?t.reader.model&&i.filter&&(i.filter=fr(i.filter,t.reader.model)):delete i.filter,t.options.serverSorting?t.reader.model&&i.sort&&(i.sort=ht(i.sort,t.reader.model)):delete i.sort,t.options.serverAggregates?t.reader.model&&i.aggregate&&(i.aggregate=ht(i.aggregate,t.reader.model)):delete i.aggregate,i},_queueRequest:function(n,i){var r=this;r._requestInProgress?r._pending={callback:v(i,r),options:n}:(r._requestInProgress=!0,r._pending=t,i())},_dequeueRequest:function(){var n=this;n._requestInProgress=!1;n._pending&&n._queueRequest(n._pending.options,n._pending.callback)},_handleCustomErrors:function(n){if(this.reader.errors){var t=this.reader.errors(n);if(t)return this.trigger(g,{xhr:null,status:"customerror",errorThrown:"custom error",errors:t}),!0}return!1},_observe:function(n){var u,t=this,i=t.reader.model,f=!1;return t._shouldDetachObservableParents=!0,i&&n.length&&(f=!(n[0]instanceof i)),n instanceof y?(t._shouldDetachObservableParents=!1,f&&(n.type=t.reader.model,n.wrapAll(n,n))):(u=t.pageSize()&&!t.options.serverPaging?wt:y,n=new u(n,t.reader.model),n.parent=function(){return t.parent()}),t._isServerGrouped()&&bi(n,i),t._changeHandler&&t._data&&t._data instanceof y?t._data.unbind(r,t._changeHandler):t._changeHandler=v(t._change,t),n.bind(r,t._changeHandler)},_change:function(n){var u,f,r,t=this,i=n?n.action:"";if("remove"===i)for(u=0,f=n.items.length;f>u;u++)n.items[u].isNew&&n.items[u].isNew()||t._destroyed.push(n.items[u]);!t.options.autoSync||"add"!==i&&"remove"!==i&&"itemchange"!==i?(r=parseInt(t._total,10),c(t._total)||(r=parseInt(t._pristineTotal,10)),"add"===i?r+=n.items.length:"remove"===i?r-=n.items.length:"itemchange"===i||"sync"===i||t.options.serverPaging?"sync"===i&&(r=t._pristineTotal=parseInt(t._total,10)):r=t._pristineTotal,t._total=r,t._process(t._data,n)):t.sync()},_calculateAggregates:function(n,t){t=t||{};var i=new u(n),f=t.aggregate,r=t.filter;return r&&(i=i.filter(r)),i.aggregate(f)},_process:function(n,i){var e,u=this,f={};u.options.serverPaging!==!0&&(f.skip=u._skip,f.take=u._take||u._pageSize,f.skip===t&&u._page!==t&&u._pageSize!==t&&(f.skip=(u._page-1)*u._pageSize));u.options.serverSorting!==!0&&(f.sort=u._sort);u.options.serverFiltering!==!0&&(f.filter=u._filter);u.options.serverGrouping!==!0&&(f.group=u._group);u.options.serverAggregates!==!0&&(f.aggregate=u._aggregate,u._aggregateResult=u._calculateAggregates(n,f));e=u._queryProcess(n,f);u.view(e.data);e.total===t||u.options.serverFiltering||(u._total=e.total);i=i||{};i.items=i.items||u._view;u.trigger(r,i)},_queryProcess:function(n,t){return u.process(n,t)},_mergeState:function(n){var i=this;return n!==t&&(i._pageSize=n.pageSize,i._page=n.page,i._sort=n.sort,i._filter=n.filter,i._group=n.group,i._aggregate=n.aggregate,i._skip=n.skip,i._take=n.take,i._skip===t&&(i._skip=i.skip(),n.skip=i.skip()),i._take===t&&i._pageSize!==t&&(i._take=i._pageSize,n.take=i._take),n.sort&&(i._sort=n.sort=rt(n.sort)),n.filter&&(i._filter=n.filter=ot(n.filter)),n.group&&(i._group=n.group=ut(n.group)),n.aggregate&&(i._aggregate=n.aggregate=gr(n.aggregate))),n},query:function(i){var u,f,e=this.options.serverSorting||this.options.serverPaging||this.options.serverFiltering||this.options.serverGrouping||this.options.serverAggregates;return e||(this._data===t||0===this._data.length)&&!this._destroyed.length?this.read(this._mergeState(i)):(f=this.trigger(ft,{type:"read"}),f||(this.trigger(ai),u=this._queryProcess(this._data,this._mergeState(i)),this.options.serverFiltering||(this._total=u.total!==t?u.total:this._data.length),this._aggregateResult=this._calculateAggregates(this._data,i),this.view(u.data),this.trigger(it,{}),this.trigger(r,{items:u.data})),n.Deferred().resolve(f).promise())},fetch:function(n){var t=this,i=function(i){i!==!0&&a(n)&&n.call(t)};return this._query().then(i)},_query:function(n){var t=this;return t.query(e({},{page:t.page(),pageSize:t.pageSize(),sort:t.sort(),filter:t.filter(),group:t.group(),aggregate:t.aggregate()},n))},next:function(n){var i=this,r=i.page(),u=i.total();return n=n||{},!r||u&&r+1>i.totalPages()?t:(i._skip=r*i.take(),r+=1,n.page=r,i._query(n),r)},prev:function(n){var i=this,r=i.page();return n=n||{},r&&1!==r?(i._skip=i._skip-i.take(),r-=1,n.page=r,i._query(n),r):t},page:function(n){var r,i=this;return n!==t?(n=f.max(f.min(f.max(n,1),i.totalPages()),1),i._query({page:n}),t):(r=i.skip(),r!==t?f.round((r||0)/(i.take()||1))+1:t)},pageSize:function(n){var i=this;return n!==t?(i._query({pageSize:n,page:1}),t):i.take()},sort:function(n){var i=this;return n!==t?(i._query({sort:n}),t):i._sort},filter:function(n){var i=this;return n===t?i._filter:(i._query({filter:n,page:1}),t)},group:function(n){var i=this;return n!==t?(i._query({group:n}),t):i._group},total:function(){return parseInt(this._total||0,10)},aggregate:function(n){var i=this;return n!==t?(i._query({aggregate:n}),t):i._aggregate},aggregates:function(){return this._aggregateResult},totalPages:function(){var n=this,t=n.pageSize()||n.total();return f.ceil((n.total()||0)/t)},inRange:function(n,t){var i=this,r=f.min(n+t,i.total());return!i.options.serverPaging&&i._data.length>0?!0:i._findRange(n,r).length>0},lastRange:function(){var n=this._ranges;return n[n.length-1]||{start:0,end:0,data:[]}},firstItemUid:function(){var n=this._ranges;return n.length&&n[0].data.length&&n[0].data[0].uid},enableRequestsInProgress:function(){this._skipRequestsInProgress=!1},range:function(n,i){var r,e,u,o,s,h,c,l;if(n=f.min(n||0,this.total()),r=this,e=f.max(f.floor(n/i),0)*i,u=f.min(e+i,r.total()),r._skipRequestsInProgress=!1,o=r._findRange(n,f.min(n+i,r.total())),o.length){r._skipRequestsInProgress=!0;r._pending=t;r._skip=n>r.skip()?f.min(u,(r.totalPages()-1)*r.take()):e;r._take=i;s=r.options.serverPaging;h=r.options.serverSorting;c=r.options.serverFiltering;l=r.options.serverAggregates;try{r.options.serverPaging=!0;r._isServerGrouped()||r.group()&&r.group().length||(r.options.serverSorting=!0);r.options.serverFiltering=!0;r.options.serverPaging=!0;r.options.serverAggregates=!0;s&&(r._detachObservableParents(),r._data=o=r._observe(o));r._process(o)}finally{r.options.serverPaging=s;r.options.serverSorting=h;r.options.serverFiltering=c;r.options.serverAggregates=l}}else i!==t&&(r._rangeExists(e,u)?n>e&&r.prefetch(u,i,function(){r.range(n,i)}):r.prefetch(e,i,function(){n>e&&u<r.total()&&!r._rangeExists(u,f.min(u+i,r.total()))?r.prefetch(u,i,function(){r.range(n,i)}):r.range(n,i)}))},_findRange:function(n,i){for(var r,s,h,c,y,l,a,v,f,k,u=this,w=u._ranges,b=[],o=u.options,d=o.serverSorting||o.serverPaging||o.serverFiltering||o.serverGrouping||o.serverAggregates,e=0,p=w.length;p>e;e++)if(r=w[e],n>=r.start&&r.end>=n){for(f=0,s=e;p>s;s++)if(r=w[s],v=u._flatData(r.data,!0),v.length&&n+f>=r.start&&(y=r.data,l=r.end,d||(k=ut(u.group()||[]).concat(rt(u.sort()||[])),a=u._queryProcess(r.data,{sort:k,filter:u.filter()}),v=y=a.data,a.total!==t&&(l=a.total)),h=0,n+f>r.start&&(h=n+f-r.start),c=v.length,l>i&&(c-=l-i),f+=c-h,b=u._mergeGroups(b,y,h,c),r.end>=i&&f==i-n))return b;break}return[]},_mergeGroups:function(n,t,i,r){if(this._isServerGrouped()){var u,f=t.toJSON();return n.length&&(u=n[n.length-1]),dt(u,f,i,r),n.concat(f)}return n.concat(t.slice(i,r))},skip:function(){var n=this;return n._skip===t?n._page!==t?(n._page-1)*(n.take()||1):t:n._skip},take:function(){return this._take||this._pageSize},_prefetchSuccessHandler:function(n,t,i){var u=this;return function(f){var o,h,s,c=!1,e={start:n,end:t,data:[]};if(u._dequeueRequest(),u.trigger(it,{response:f,type:"read"}),f=u.reader.parse(f),s=u._readData(f),s.length){for(o=0,h=u._ranges.length;h>o;o++)if(u._ranges[o].start===n){c=!0;e=u._ranges[o];break}c||u._ranges.push(e)}e.data=u._observe(s);e.end=e.start+u._flatData(e.data,!0).length;u._ranges.sort(function(n,t){return n.start-t.start});u._total=u.reader.total(f);u._skipRequestsInProgress||(i&&s.length?i():u.trigger(r,{}))}},prefetch:function(n,t,i){var r=this,u=f.min(n+t,r.total()),e={take:t,skip:n,page:n/t+1,pageSize:t,sort:r._sort,filter:r._filter,group:r._group,aggregate:r._aggregate};r._rangeExists(n,u)?i&&i():(clearTimeout(r._timeout),r._timeout=setTimeout(function(){r._queueRequest(e,function(){r.trigger(ft,{type:"read"})?r._dequeueRequest():r.transport.read({data:r._params(e),success:r._prefetchSuccessHandler(n,u,i)})})},100))},_rangeExists:function(n,t){for(var f=this,r=f._ranges,i=0,u=r.length;u>i;i++)if(n>=r[i].start&&r[i].end>=t)return!0;return!1},_removeModelFromRanges:function(n){for(var i,r,u,t=0,f=this._ranges.length;f>t&&(u=this._ranges[t],this._eachItem(u.data,function(t){i=nr(t,n);i&&(r=!0)}),!r);t++);},_updateRangesLength:function(){for(var n,i,u=0,t=0,r=this._ranges.length;r>t;t++)n=this._ranges[t],n.start=n.start-u,i=this._flatData(n.data,!0).length,u=n.end-i,n.end=n.start+i}});fi={};fi.create=function(n,t){var u,r=n.transport;return r?(r.read=typeof r.read===s?{url:r.read}:r.read,n.type&&(i.data.transports=i.data.transports||{},i.data.schemas=i.data.schemas||{},i.data.transports[n.type]&&!b(i.data.transports[n.type])?u=new i.data.transports[n.type](e(r,{data:t})):r=e(!0,{},i.data.transports[n.type],r),n.schema=e(!0,{},i.data.schemas[n.type],n.schema)),u||(u=a(r.read)?r:new ri(r))):u=new ii({data:n.data||[]}),u};h.create=function(n){(l(n)||n instanceof y)&&(n={data:n});var u,a,f,t=n||{},o=t.data,r=t.fields,s=t.table,v=t.select,c={};if(o||!r||t.transport||(s?o=eu(s,r):v&&(o=fu(v,r))),i.data.Model&&r&&(!t.schema||!t.schema.model)){for(u=0,a=r.length;a>u;u++)f=r[u],f.type&&(c[f.field]=f);tt(c)||(t.schema=e(!0,t.schema,{model:{fields:c}}))}return t.data=o,s=null,t.table=null,t instanceof h?t:new h(t)};ei=p.define({idField:"id",init:function(n){var t=this,r=t.hasChildren||n&&n.hasChildren,f="items",u={};i.data.Model.fn.init.call(t,n);typeof t.children===s&&(f=t.children);u={schema:{data:f,model:{hasChildren:r,id:t.idField,fields:t.fields}}};typeof t.children!==s&&e(u,t.children);u.data=n;r||(r=u.schema.data);typeof r===s&&(r=i.getter(r));a(r)&&(t.hasChildren=!!r.call(t,t));t._childrenOptions=u;t.hasChildren&&t._initChildren();t._loaded=!(!n||!n[f]&&!n._loaded)},_initChildren:function(){var t,i,u,n=this;n.children instanceof w||(t=n.children=new w(n._childrenOptions),i=t.transport,u=i.parameterMap,i.parameterMap=function(t,i){return t[n.idField||"id"]=n.id,u&&(t=u(t,i)),t},t.parent=function(){return n},t.bind(r,function(t){t.node=t.node||n;n.trigger(r,t)}),t.bind(g,function(t){var i=n.parent();i&&(t.node=t.node||n,i.trigger(g,t))}),n._updateChildrenField())},append:function(n){this._initChildren();this.loaded(!0);this.children.add(n)},hasChildren:!1,level:function(){for(var n=this.parentNode(),t=0;n&&n.parentNode;)t++,n=n.parentNode?n.parentNode():null;return t},_updateChildrenField:function(){var n=this._childrenOptions.schema.data;this[n||"items"]=this.children.data()},_childrenLoaded:function(){this._loaded=!0;this._updateChildrenField()},load:function(){var i,u,f={},e="_query";return this.hasChildren?(this._initChildren(),i=this.children,f[this.idField||"id"]=this.id,this._loaded||(i._data=t,e="read"),i.one(r,v(this._childrenLoaded,this)),u=i[e](f)):this.loaded(!0),u||n.Deferred().resolve().promise()},parentNode:function(){var n=this.parent();return n.parent()},loaded:function(n){return n===t?this._loaded:(this._loaded=n,t)},shouldSerialize:function(n){return p.fn.shouldSerialize.call(this,n)&&"children"!==n&&"_loaded"!==n&&"hasChildren"!==n&&"_childrenOptions"!==n}});w=h.extend({init:function(n){var t=ei.define({children:n});h.fn.init.call(this,e(!0,{},{schema:{modelBase:t,model:t}},n));this._attachBubbleHandlers()},_attachBubbleHandlers:function(){var n=this;n._data.bind(g,function(t){n.trigger(g,t)})},remove:function(n){var r,t=n.parentNode(),i=this;return t&&t._initChildren&&(i=t.children),r=h.fn.remove.call(i,n),t&&!i.data().length&&(t.hasChildren=!1),r},success:er("success"),data:er("data"),insert:function(n,t){var i=this.parent();return i&&i._initChildren&&(i.hasChildren=!0,i._initChildren()),h.fn.insert.call(this,n,t)},_find:function(n,t){var i,e,r,u,f;if(r=h.fn[n].call(this,t))return r;if(u=this._flatData(this._data))for(i=0,e=u.length;e>i;i++)if(f=u[i].children,f instanceof w&&(r=f[n](t)))return r},get:function(n){return this._find("get",n)},getByUid:function(n){return this._find("getByUid",n)}});w.create=function(n){n=n&&n.push?{data:n}:n;var t=n||{},i=t.data,r=t.fields,u=t.list;return i&&i._dataSource?i._dataSource:(i||!r||t.transport||u&&(i=or(u,r)),t.data=i,t instanceof w?t:new w(t))};oi=i.Observable.extend({init:function(n,t,r){i.Observable.fn.init.call(this);this._prefetching=!1;this.dataSource=n;this.prefetch=!r;var u=this;n.bind("change",function(){u._change()});n.bind("reset",function(){u._reset()});this._syncWithDataSource();this.setViewSize(t)},setViewSize:function(n){this.viewSize=n;this._recalculate()},at:function(n){var i=this.pageSize,r=!0;return n>=this.total()?(this.trigger("endreached",{index:n}),null):this.useRanges?this.useRanges?((this.dataOffset>n||n>=this.skip+i)&&(r=this.range(Math.floor(n/i)*i)),n===this.prefetchThreshold&&this._prefetch(),n===this.midPageThreshold?this.range(this.nextMidRange,!0):n===this.nextPageThreshold?this.range(this.nextFullRange):n===this.pullBackThreshold&&this.range(this.offset===this.skip?this.previousMidRange:this.previousFullRange),r?this.dataSource.at(n-this.dataOffset):(this.trigger("endreached",{index:n}),null)):t:this.dataSource.view()[n]},indexOf:function(n){return this.dataSource.data().indexOf(n)+this.dataOffset},total:function(){return parseInt(this.dataSource.total(),10)},next:function(){var n=this,t=n.pageSize,i=n.skip-n.viewSize+t,r=f.max(f.floor(i/t),0)*t;this.offset=i;this.dataSource.prefetch(r,t,function(){n._goToRange(i,!0)})},range:function(n,t){if(this.offset===n)return!0;var r=this,i=this.pageSize,u=f.max(f.floor(n/i),0)*i,e=this.dataSource;return t&&(u+=i),e.inRange(n,i)?(this.offset=n,this._recalculate(),this._goToRange(n),!0):this.prefetch?(e.prefetch(u,i,function(){r.offset=n;r._recalculate();r._goToRange(n,!0)}),!1):!0},syncDataSource:function(){var n=this.offset;this.offset=null;this.range(n)},destroy:function(){this.unbind()},_prefetch:function(){var i=this,n=this.pageSize,t=this.skip+n,r=this.dataSource;r.inRange(t,n)||this._prefetching||!this.prefetch||(this._prefetching=!0,this.trigger("prefetching",{skip:t,take:n}),r.prefetch(t,n,function(){i._prefetching=!1;i.trigger("prefetched",{skip:t,take:n})}))},_goToRange:function(n,t){this.offset===n&&(this.dataOffset=n,this._expanding=t,this.dataSource.range(n,this.pageSize),this.dataSource.enableRequestsInProgress())},_reset:function(){this._syncPending=!0},_change:function(){var n=this.dataSource;this.length=this.useRanges?n.lastRange().end:n.view().length;this._syncPending&&(this._syncWithDataSource(),this._recalculate(),this._syncPending=!1,this.trigger("reset",{offset:this.offset}));this.trigger("resize");this._expanding&&this.trigger("expand");delete this._expanding},_syncWithDataSource:function(){var n=this.dataSource;this._firstItemUid=n.firstItemUid();this.dataOffset=this.offset=n.skip()||0;this.pageSize=n.pageSize();this.useRanges=n.options.serverPaging},_recalculate:function(){var t=this.pageSize,r=this.offset,i=this.viewSize,n=Math.ceil(r/t)*t;this.skip=n;this.midPageThreshold=n+t-1;this.nextPageThreshold=n+i-1;this.prefetchThreshold=n+Math.floor(t/3*2);this.pullBackThreshold=this.offset-1;this.nextMidRange=n+t-i;this.nextFullRange=n;this.previousMidRange=r-i;this.previousFullRange=n-t}});ar=i.Observable.extend({init:function(n,t){var r=this;i.Observable.fn.init.call(r);this.dataSource=n;this.batchSize=t;this._total=0;this.buffer=new oi(n,3*t);this.buffer.bind({endreached:function(n){r.trigger("endreached",{index:n.index})},prefetching:function(n){r.trigger("prefetching",{skip:n.skip,take:n.take})},prefetched:function(n){r.trigger("prefetched",{skip:n.skip,take:n.take})},reset:function(){r._total=0;r.trigger("reset")},resize:function(){r._total=Math.ceil(this.length/r.batchSize);r.trigger("resize",{total:r.total(),offset:this.offset})}})},syncDataSource:function(){this.buffer.syncDataSource()},at:function(n){var u,i,r=this.buffer,f=n*this.batchSize,o=this.batchSize,e=[];for(r.offset>f&&r.at(r.offset-1),i=0;o>i&&(u=r.at(f+i),u!==t);i++)e.push(u);return e},total:function(){return this._total},destroy:function(){this.buffer.destroy();this.unbind()}});e(!0,i.data,{readers:{json:ui},Query:u,DataSource:h,HierarchicalDataSource:w,Node:ei,ObservableObject:o,ObservableArray:y,LazyObservableArray:wt,LocalTransport:ii,RemoteTransport:ri,Cache:nt,DataReader:ui,Model:p,Buffer:oi,BatchBuffer:ar})}(window.kendo.jQuery),function(n){var t=kendo.data.RemoteTransport.extend({init:function(n){var t,r=n&&n.signalr?n.signalr:{},i=r.promise;if(!i)throw Error('The "promise" option must be set.');if("function"!=typeof i.done||"function"!=typeof i.fail)throw Error('The "promise" option must be a Promise.');if(this.promise=i,t=r.hub,!t)throw Error('The "hub" option must be set.');if("function"!=typeof t.on||"function"!=typeof t.invoke)throw Error('The "hub" option is not a valid SignalR hub proxy.');this.hub=t;kendo.data.RemoteTransport.fn.init.call(this,n)},push:function(n){var t=this.options.signalr.client||{};t.create&&this.hub.on(t.create,n.pushCreate);t.update&&this.hub.on(t.update,n.pushUpdate);t.destroy&&this.hub.on(t.destroy,n.pushDestroy)},_crud:function(t,i){var r,u,e=this.hub,f=this.options.signalr.server;if(!f||!f[i])throw Error(kendo.format('The "server.{0}" option must be set.',i));r=[f[i]];u=this.parameterMap(t.data,i);n.isEmptyObject(u)||r.push(u);this.promise.done(function(){e.invoke.apply(e,r).done(t.success).fail(t.error)})},read:function(n){this._crud(n,"read")},create:function(n){this._crud(n,"create")},update:function(n){this._crud(n,"update")},destroy:function(n){this._crud(n,"destroy")}});n.extend(!0,kendo.data,{transports:{signalr:t}})}(window.kendo.jQuery),function(n,t){function w(t,u,f){return r.extend({init:function(n,t,i){var u=this;r.fn.init.call(u,n.element[0],t,i);u.widget=n;u._dataBinding=c(u.dataBinding,u);u._dataBound=c(u.dataBound,u);u._itemChange=c(u.itemChange,u)},itemChange:function(n){l(n.item[0],n.data,this._ns(n.ns),[n.data].concat(this.bindings[t]._parents()))},dataBinding:function(n){for(var u=this.widget,r=n.removedItems||u.items(),t=0,i=r.length;i>t;t++)y(r[t])},_ns:function(t){t=t||i.ui;var r=[i.ui,i.dataviz.ui,i.mobile.ui];return r.splice(n.inArray(t,r),1),r.unshift(t),i.rolesFromNamespaces(r)},dataBound:function(n){var i,f,r,e,o=this.widget,s=n.addedItems||o.items(),h=o[u];if(h.group()||[],s.length)for(r=n.addedDataItems||h.flatView(),e=this.bindings[t]._parents(),i=0,f=r.length;f>i;i++)l(s[i],r[i],this._ns(n.ns),[r[i]].concat(e))},refresh:function(n){var r,o=this,e=o.widget;n=n||{};n.action||(o.destroy(),e.bind("dataBinding",o._dataBinding),e.bind("dataBound",o._dataBound),e.bind("itemChange",o._itemChange),r=o.bindings[t].get(),e[u]instanceof i.data.DataSource&&e[u]!=r&&(r instanceof i.data.DataSource?e[f](r):r&&r._dataSource?e[f](r._dataSource):e[u].data(r)))},destroy:function(){var n=this.widget;n.unbind("dataBinding",this._dataBinding);n.unbind("dataBound",this._dataBound);n.unbind("itemChange",this._itemChange)}})}function vt(n,r){var u=i.initWidget(n,{},r);return u?new et(u):t}function nt(n){var i,e,r,u,o,t,f,s={};for(f=n.match(ot),i=0,e=f.length;e>i;i++)r=f[i],u=r.indexOf(":"),o=r.substring(0,u),t=r.substring(u+1),"{"==t.charAt(0)&&(t=nt(t)),s[o]=t;return s}function v(n,t,i){var r,u={};for(r in n)u[r]=new i(t,n[r]);return u}function l(n,t,r,u){var s,o,c,w=n.getAttribute("data-"+i.ns+"role"),e=n.getAttribute("data-"+i.ns+"bind"),y=n.children,p=[],b=!0,a={};if(u=u||[t],(w||e)&&it(n),w&&(c=vt(n,r)),e&&(e=nt(e.replace(st,"")),c||(a=i.parseOptions(n,{textField:"",valueField:"",template:"",valueUpdate:f,valuePrimitive:!1,autoBind:!0}),a.roles=r,c=new d(n,a)),c.source=t,o=v(e,u,h),a.template&&(o.template=new ft(u,"",a.template)),o.click&&(e.events=e.events||{},e.events.click=e.click,o.click.destroy(),delete o.click),o.source&&(b=!1),e.attr&&(o.attr=v(e.attr,u,h)),e.style&&(o.style=v(e.style,u,h)),e.events&&(o.events=v(e.events,u,ut)),c.bind(o)),c&&(n.kendoBindingTarget=c),b&&y){for(s=0;y.length>s;s++)p[s]=y[s];for(s=0;p.length>s;s++)l(p[s],t,r,u)}}function tt(t,r){var u,e,f,o=i.rolesFromNamespaces([].slice.call(arguments,2));for(r=i.observable(r),t=n(t),u=0,e=t.length;e>u;u++)f=t[u],1===f.nodeType&&l(f,r,o)}function it(n){var t=n.kendoBindingTarget;t&&(t.destroy(),at?delete n.kendoBindingTarget:n.removeAttribute?n.removeAttribute("kendoBindingTarget"):n.kendoBindingTarget=null)}function y(n){it(n);rt(n)}function rt(n){var t,r,i=n.children;if(i)for(t=0,r=i.length;r>t;t++)y(i[t])}function yt(t){var i,r;for(t=n(t),i=0,r=t.length;r>i;i++)y(t[i])}function pt(n,t){var i=n.element,r=i[0].kendoBindingTarget;r&&tt(i,r.source,t)}var b,h,ut,ft,r,k,d,et,ot,st,i=window.kendo,g=i.Observable,s=i.data.ObservableObject,e=i.data.ObservableArray,ht={}.toString,u={},ct=i.Class,c=n.proxy,o="value",p="source",lt="events",a="checked",at=!0,f="change";!function(){var n=document.createElement("a");n.innerText!==t?b="innerText":n.textContent!==t&&(b="textContent");try{delete n.test}catch(i){at=!1}}();h=g.extend({init:function(n,t){var i=this;g.fn.init.call(i);i.source=n[0];i.parents=n;i.path=t;i.dependencies={};i.dependencies[t]=!0;i.observable=i.source instanceof g;i._access=function(n){i.dependencies[n.field]=!0};i.observable&&(i._change=function(n){i.change(n)},i.source.bind(f,i._change))},_parents:function(){var i,t=this.parents,r=this.get();return r&&"function"==typeof r.parent&&(i=r.parent(),n.inArray(i,t)<0&&(t=[i].concat(t))),t},change:function(n){var r,t,u=n.field,i=this;if("this"===i.path)i.trigger(f,n);else for(r in i.dependencies)if(0===r.indexOf(u)&&(t=r.charAt(u.length),!t||"."===t||"["===t)){i.trigger(f,n);break}},start:function(n){n.bind("get",this._access)},stop:function(n){n.unbind("get",this._access)},get:function(){var i=this,n=i.source,e=0,u=i.path,r=n;if(!i.observable)return r;for(i.start(i.source),r=n.get(u);r===t&&n;)n=i.parents[++e],n instanceof s&&(r=n.get(u));if(r===t)for(n=i.source;r===t&&n;)n=n.parent(),n instanceof s&&(r=n.get(u));return"function"==typeof r&&(e=u.lastIndexOf("."),e>0&&(n=n.get(u.substring(0,e))),i.start(n),r=n!==i.source?r.call(n,i.source):r.call(n),i.stop(n)),n&&n!==i.source&&(i.currentSource=n,n.unbind(f,i._change).bind(f,i._change)),i.stop(i.source),r},set:function(n){var t=this.currentSource||this.source,r=i.getter(this.path)(t);"function"==typeof r?t!==this.source?r.call(t,this.source,n):r.call(t,n):t.set(this.path,n)},destroy:function(){this.observable&&(this.source.unbind(f,this._change),this.currentSource&&this.currentSource.unbind(f,this._change));this.unbind()}});ut=h.extend({get:function(){for(var n=this.source,i=this.path,r=0,t=n.get(i);!t&&n;)n=this.parents[++r],n instanceof s&&(t=n.get(i));return c(t,n)}});ft=h.extend({init:function(n,t,i){var r=this;h.fn.init.call(r,n,t);r.template=i},render:function(n){var t;return this.start(this.source),t=i.render(this.template,n),this.stop(this.source),t}});r=ct.extend({init:function(n,t,i){this.element=n;this.bindings=t;this.options=i},bind:function(n,t){var i=this;n=t?n[t]:n;n.bind(f,function(n){i.refresh(t||n)});i.refresh(t)},destroy:function(){}});u.attr=r.extend({refresh:function(n){this.element.setAttribute(n,this.bindings.attr[n].get())}});u.style=r.extend({refresh:function(n){this.element.style[n]=this.bindings.style[n].get()||""}});u.enabled=r.extend({refresh:function(){this.bindings.enabled.get()?this.element.removeAttribute("disabled"):this.element.setAttribute("disabled","disabled")}});u.readonly=r.extend({refresh:function(){this.bindings.readonly.get()?this.element.setAttribute("readonly","readonly"):this.element.removeAttribute("readonly")}});u.disabled=r.extend({refresh:function(){this.bindings.disabled.get()?this.element.setAttribute("disabled","disabled"):this.element.removeAttribute("disabled")}});u.events=r.extend({init:function(n,t,i){r.fn.init.call(this,n,t,i);this.handlers={}},refresh:function(t){var r=n(this.element),u=this.bindings.events[t],i=this.handlers[t];i&&r.off(t,i);i=this.handlers[t]=u.get();r.on(t,u.source,i)},destroy:function(){var t,i=n(this.element);for(t in this.handlers)i.off(t,this.handlers[t])}});u.text=r.extend({refresh:function(){var n=this.bindings.text.get();null==n&&(n="");this.element[b]=n}});u.visible=r.extend({refresh:function(){this.element.style.display=this.bindings.visible.get()?"":"none"}});u.invisible=r.extend({refresh:function(){this.element.style.display=this.bindings.invisible.get()?"none":""}});u.html=r.extend({refresh:function(){this.element.innerHTML=this.bindings.html.get()}});u.value=r.extend({init:function(t,i,u){r.fn.init.call(this,t,i,u);this._change=c(this.change,this);this.eventName=u.valueUpdate||f;n(this.element).on(this.eventName,this._change);this._initChange=!1},change:function(){var n,t;this._initChange=this.eventName!=f;n=this.element.value;t=this.element.type;"date"==t?n=i.parseDate(n,"yyyy-MM-dd"):"datetime-local"==t?n=i.parseDate(n,["yyyy-MM-ddTHH:mm:ss","yyyy-MM-ddTHH:mm"]):"number"==t&&(n=i.parseFloat(n));this.bindings[o].set(n);this._initChange=!1},refresh:function(){var n,t;this._initChange||(n=this.bindings[o].get(),null==n&&(n=""),t=this.element.type,"date"==t?n=i.toString(n,"yyyy-MM-dd"):"datetime-local"==t&&(n=i.toString(n,"yyyy-MM-ddTHH:mm:ss")),this.element.value=n);this._initChange=!1},destroy:function(){n(this.element).off(this.eventName,this._change)}});u.source=r.extend({init:function(n,t,u){r.fn.init.call(this,n,t,u);var f=this.bindings.source.get();f instanceof i.data.DataSource&&u.autoBind!==!1&&f.fetch()},refresh:function(n){var t=this,r=t.bindings.source.get();r instanceof e||r instanceof i.data.DataSource?(n=n||{},"add"==n.action?t.add(n.index,n.items):"remove"==n.action?t.remove(n.index,n.items):"itemchange"!=n.action&&t.render()):t.render()},container:function(){var n=this.element;return"table"==n.nodeName.toLowerCase()&&(n.tBodies[0]||n.appendChild(document.createElement("tbody")),n=n.tBodies[0]),n},template:function(){var n=this.options,t=n.template,r=this.container().nodeName.toLowerCase();return t||(t="select"==r?n.valueField||n.textField?i.format('<option value="#:{0}#">#:{1}#<\/option>',n.valueField||n.textField,n.textField||n.valueField):"<option>#:data#<\/option>":"tbody"==r?"<tr><td>#:data#<\/td><\/tr>":"ul"==r||"ol"==r?"<li>#:data#<\/li>":"#:data#",t=i.template(t)),t},add:function(t,r){var s,u,h,f,e=this.container(),o=e.cloneNode(!1),c=e.children[t];if(n(o).html(i.render(this.template(),r)),o.children.length)for(s=this.bindings.source._parents(),u=0,h=r.length;h>u;u++)f=o.children[0],e.insertBefore(f,c||null),l(f,r[u],this.options.roles,[r[u]].concat(s))},remove:function(n,t){for(var r,u=this.container(),i=0;t.length>i;i++)r=u.children[n],y(r),u.removeChild(r)},render:function(){var f,r,o,t=this.bindings.source.get(),u=this.container(),s=this.template();if(t instanceof i.data.DataSource&&(t=t.view()),t instanceof e||"[object Array]"===ht.call(t)||(t=[t]),this.bindings.template){if(rt(u),n(u).html(this.bindings.template.render(t)),u.children.length)for(f=this.bindings.source._parents(),r=0,o=t.length;o>r;r++)l(u.children[r],t[r],this.options.roles,[t[r]].concat(f))}else n(u).html(i.render(s,t))}});u.input={checked:r.extend({init:function(t,i,u){r.fn.init.call(this,t,i,u);this._change=c(this.change,this);n(this.element).change(this._change)},change:function(){var t,i,r=this.element,n=this.value();"radio"==r.type?this.bindings[a].set(n):"checkbox"==r.type&&(t=this.bindings[a].get(),t instanceof e?(n=this.element.value,"on"!==n&&"off"!==n&&(i=t.indexOf(n),i>-1?t.splice(i,1):t.push(n))):this.bindings[a].set(n))},refresh:function(){var n=this.bindings[a].get(),i=n,t=this.element;"checkbox"==t.type?(i instanceof e&&(n=this.element.value,i.indexOf(n)>=0&&(n=!0)),t.checked=n===!0):"radio"==t.type&&null!=n&&t.value===""+n&&(t.checked=!0)},value:function(){var n=this.element,t=n.value;return"checkbox"==n.type&&(t=n.checked),t},destroy:function(){n(this.element).off(f,this._change)}})};u.select={value:r.extend({init:function(t,i,u){r.fn.init.call(this,t,i,u);this._change=c(this.change,this);n(this.element).change(this._change)},change:function(){for(var u,h,c,n,f=[],v=this.element,a=this.options.valueField||this.options.textField,y=this.options.valuePrimitive,r=0,l=v.options.length;l>r;r++)h=v.options[r],h.selected&&(n=h.attributes.value,n=n&&n.specified?h.value:h.text,f.push(n));if(a)for(u=this.bindings.source.get(),u instanceof i.data.DataSource&&(u=u.view()),c=0;f.length>c;c++)for(r=0,l=u.length;l>r;r++)if(u[r].get(a)==f[c]){f[c]=u[r];break}n=this.bindings[o].get();n instanceof e?n.splice.apply(n,[0,n.length].concat(f)):this.bindings[o].set(y||!(n instanceof s||null===n||n===t)&&a?f[0].get(a):f[0])},refresh:function(){var t,i,r,h=this.element,u=h.options,n=this.bindings[o].get(),f=n,c=this.options.valueField||this.options.textField,l=!1;for(f instanceof e||(f=new e([n])),h.selectedIndex=-1,r=0;f.length>r;r++)for(n=f[r],c&&n instanceof s&&(n=n.get(c)),t=0;u.length>t;t++)i=u[t].value,""===i&&""!==n&&(i=u[t].text),i==n&&(u[t].selected=!0,l=!0)},destroy:function(){n(this.element).off(f,this._change)}})};u.widget={events:r.extend({init:function(n,t,i){r.fn.init.call(this,n.element[0],t,i);this.widget=n;this.handlers={}},refresh:function(n){var i=this.bindings.events[n],t=this.handlers[n];t&&this.widget.unbind(n,t);t=i.get();this.handlers[n]=function(n){n.data=i.source;t(n);n.data===i.source&&delete n.data};this.widget.bind(n,this.handlers[n])},destroy:function(){for(var n in this.handlers)this.widget.unbind(n,this.handlers[n])}}),checked:r.extend({init:function(n,t,i){r.fn.init.call(this,n.element[0],t,i);this.widget=n;this._change=c(this.change,this);this.widget.bind(f,this._change)},change:function(){this.bindings[a].set(this.value())},refresh:function(){this.widget.check(this.bindings[a].get()===!0)},value:function(){var t=this.element,n=t.value;return("on"==n||"off"==n)&&(n=t.checked),n},destroy:function(){this.widget.unbind(f,this._change)}}),visible:r.extend({init:function(n,t,i){r.fn.init.call(this,n.element[0],t,i);this.widget=n},refresh:function(){var n=this.bindings.visible.get();this.widget.wrapper[0].style.display=n?"":"none"}}),invisible:r.extend({init:function(n,t,i){r.fn.init.call(this,n.element[0],t,i);this.widget=n},refresh:function(){var n=this.bindings.invisible.get();this.widget.wrapper[0].style.display=n?"none":""}}),enabled:r.extend({init:function(n,t,i){r.fn.init.call(this,n.element[0],t,i);this.widget=n},refresh:function(){this.widget.enable&&this.widget.enable(this.bindings.enabled.get())}}),disabled:r.extend({init:function(n,t,i){r.fn.init.call(this,n.element[0],t,i);this.widget=n},refresh:function(){this.widget.enable&&this.widget.enable(!this.bindings.disabled.get())}}),source:w("source","dataSource","setDataSource"),value:r.extend({init:function(t,i,u){r.fn.init.call(this,t.element[0],i,u);this.widget=t;this._change=n.proxy(this.change,this);this.widget.first(f,this._change);var o=this.bindings.value.get();this._valueIsObservableObject=!u.valuePrimitive&&(null==o||o instanceof s);this._valueIsObservableArray=o instanceof e;this._initChange=!1},change:function(){var u,c,f,e,o,l,r,n=this.widget.value(),s=this.options.dataValueField||this.options.dataTextField,a="[object Array]"===ht.call(n),h=this._valueIsObservableObject,t=[];if(this._initChange=!0,s)if(this.bindings.source&&(r=this.bindings.source.get()),""===n&&(h||this.options.valuePrimitive))n=null;else{for((!r||r instanceof i.data.DataSource)&&(r=this.widget.dataSource.view()),a&&(c=n.length,t=n.slice(0)),o=0,l=r.length;l>o;o++)if(f=r[o],e=f.get(s),a){for(u=0;c>u;u++)if(e==t[u]){t[u]=f;break}}else if(e==n){n=h?f:e;break}t[0]&&(n=this._valueIsObservableArray?t:h||!s?t[0]:t[0].get(s))}this.bindings.value.set(n);this._initChange=!1},refresh:function(){if(!this._initChange){var u,r=this.options.dataValueField||this.options.dataTextField,n=this.bindings.value.get(),i=0,f=[];if(n===t&&(n=null),r)if(n instanceof e){for(u=n.length;u>i;i++)f[i]=n[i].get(r);n=f}else n instanceof s&&(n=n.get(r));this.widget.value(n)}this._initChange=!1},destroy:function(){this.widget.unbind(f,this._change)}}),gantt:{dependencies:w("dependencies","dependencies","setDependenciesDataSource")},multiselect:{value:r.extend({init:function(t,i,u){r.fn.init.call(this,t.element[0],i,u);this.widget=t;this._change=n.proxy(this.change,this);this.widget.first(f,this._change);this._initChange=!1},change:function(){var c,a,s,u,r,l,y,h,v,f=this,i=f.bindings[o].get(),p=f.options.valuePrimitive,n=p?f.widget.value():f.widget.dataItems(),w=this.options.dataValueField||this.options.dataTextField;if(n=n.slice(0),f._initChange=!0,i instanceof e){for(c=[],a=n.length,s=0,u=0,r=i[s],l=!1;r!==t;){for(v=!1,u=0;a>u;u++)if(p?l=n[u]==r:(h=n[u],h=h.get?h.get(w):h,l=h==(r.get?r.get(w):r)),l){n.splice(u,1);a-=1;v=!0;break}v?s+=1:(c.push(r),k(i,s,1),y=s);r=i[s]}k(i,i.length,0,n);c.length&&i.trigger("change",{action:"remove",items:c,index:y});n.length&&i.trigger("change",{action:"add",items:n,index:i.length-1})}else f.bindings[o].set(n);f._initChange=!1},refresh:function(){if(!this._initChange){var f,i,u=this.options.dataValueField||this.options.dataTextField,n=this.bindings.value.get(),r=0,o=[];if(n===t&&(n=null),u)if(n instanceof e){for(f=n.length;f>r;r++)i=n[r],o[r]=i.get?i.get(u):i;n=o}else n instanceof s&&(n=n.get(u));this.widget.value(n)}},destroy:function(){this.widget.unbind(f,this._change)}})},scheduler:{source:w("source","dataSource","setDataSource").extend({dataBound:function(n){var t,r,i,u,f=this.widget,e=n.addedItems||f.items();if(e.length)for(i=n.addedDataItems||f.dataItems(),u=this.bindings.source._parents(),t=0,r=i.length;r>t;t++)l(e[t],i[t],this._ns(n.ns),[i[t]].concat(u))}})}};k=function(n,t,i,r){var u,s,o,f,e;if(r=r||[],i=i||0,u=r.length,s=n.length,o=[].slice.call(n,t+i),f=o.length,u){for(u=t+u,e=0;u>t;t++)n[t]=r[e],e++;n.length=u}else if(i)for(n.length=t,i+=t;i>t;)delete n[--i];if(f){for(f=t+f,e=0;f>t;t++)n[t]=o[e],e++;n.length=f}for(t=n.length;s>t;)delete n[t],t++};d=ct.extend({init:function(n,t){this.target=n;this.options=t;this.toDestroy=[]},bind:function(n){var t,r,f,e,s=this.target.nodeName.toLowerCase(),i=u[s]||{};for(t in n)t==o?r=!0:t==p?f=!0:t==lt?e=!0:this.applyBinding(t,n,i);f&&this.applyBinding(p,n,i);r&&this.applyBinding(o,n,i);e&&this.applyBinding(lt,n,i)},applyBinding:function(n,t,i){var e,r=i[n]||u[n],o=this.toDestroy,f=t[n];if(r)if(r=new r(this.target,t,this.options),o.push(r),f instanceof h)r.bind(f),o.push(f);else for(e in f)r.bind(f,e),o.push(f[e]);else if("template"!==n)throw Error("The "+n+" binding is not supported by the "+this.target.nodeName.toLowerCase()+" element");},destroy:function(){for(var i=this.toDestroy,n=0,t=i.length;t>n;n++)i[n].destroy()}});et=d.extend({bind:function(n){var t,i=this,f=!1,e=!1,r=u.widget[i.target.options.name.toLowerCase()]||{};for(t in n)t==o?f=!0:t==p?e=!0:i.applyBinding(t,n,r);e&&i.applyBinding(p,n,r);f&&i.applyBinding(o,n,r)},applyBinding:function(n,t,i){var e,r=i[n]||u.widget[n],o=this.toDestroy,f=t[n];if(!r)throw Error("The "+n+" binding is not supported by the "+this.target.options.name+" widget");if(r=new r(this.target,t,this.target.options),o.push(r),f instanceof h)r.bind(f),o.push(f);else for(e in f)r.bind(f,e),o.push(f[e])}});ot=/[A-Za-z0-9_\-]+:(\{([^}]*)\}|[^,}]+)/g;st=/\s/g;i.unbind=yt;i.bind=tt;i.data.binders=u;i.data.Binder=r;i.notify=pt;i.observable=function(n){return n instanceof s||(n=new s(n)),n};i.observableHierarchy=function(n){function r(n){for(var i,t=0;n.length>t;t++)n[t]._initChildren(),i=n[t].children,i.fetch(),n[t].items=i.data(),r(n[t].items)}var t=i.data.HierarchicalDataSource.create(n);return t.fetch(),r(t.data()),t._data._dataSource=t,t._data}}(window.kendo.jQuery),function(n){function p(i){var r,u=t.ui.validator.ruleResolvers||{},f={};for(r in u)n.extend(!0,f,u[r].resolve(i));return f}function w(n){return n.replace(/&amp/g,"&amp;").replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&lt;/g,"<").replace(/&gt;/g,">")}function b(n){return n=(n+"").split("."),n.length>1?n[1].length:0}function k(t){return n(n.parseHTML?n.parseHTML(t):t)}function d(i,r){for(var u,o,e=n(),f=0,s=i.length;s>f;f++)u=i[f],g.test(u.className)&&(o=u.getAttribute(t.attr("for")),o===r&&(e=e.add(u)));return e}var o,t=window.kendo,f=t.ui.Widget,i=".kendoValidator",r="k-invalid-msg",g=RegExp(r,"i"),nt="k-invalid",tt=/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i,it=/^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i,u=":input:not(:button,[type=submit],[type=reset],[disabled],[readonly])",s=":checkbox:not([disabled],[readonly])",e="[type=number],[type=range]",h="blur",c="name",l="form",a="novalidate",rt=n.proxy,v=function(n,t){return"string"==typeof t&&(t=RegExp("^(?:"+t+")$")),t.test(n)},y=function(n,t,i){var r=n.val();return n.filter(t).length&&""!==r?v(r,i):!0},ut=function(n,t){return n.length?null!=n[0].attributes[t]:!1};t.ui.validator||(t.ui.validator={rules:{},messages:{}});o=f.extend({init:function(i,r){var e=this,o=p(i),h="["+t.attr("validate")+"!=false]";r=r||{};r.rules=n.extend({},t.ui.validator.rules,o.rules,r.rules);r.messages=n.extend({},t.ui.validator.messages,o.messages,r.messages);f.fn.init.call(e,i,r);e._errorTemplate=t.template(e.options.errorTemplate);e.element.is(l)&&e.element.attr(a,a);e._inputSelector=u+h;e._checkboxSelector=s+h;e._errors={};e._attachEvents();e._isValidated=!1},events:["validate","change"],options:{name:"Validator",errorTemplate:'<span class="k-widget k-tooltip k-tooltip-validation"><span class="k-icon k-warning"> <\/span> #=message#<\/span>',messages:{required:"{0} is required",pattern:"{0} is not valid",min:"{0} should be greater than or equal to {1}",max:"{0} should be smaller than or equal to {1}",step:"{0} is not valid",email:"{0} is not valid email",url:"{0} is not valid URL",date:"{0} is not valid date"},rules:{required:function(n){var i=n.filter("[type=checkbox]").length&&!n.is(":checked"),t=n.val();return!(ut(n,"required")&&(""===t||!t||i))},pattern:function(n){return n.filter("[type=text],[type=email],[type=url],[type=tel],[type=search],[type=password]").filter("[pattern]").length&&""!==n.val()?v(n.val(),n.attr("pattern")):!0},min:function(n){if(n.filter(e+",["+t.attr("type")+"=number]").filter("[min]").length&&""!==n.val()){var i=parseFloat(n.attr("min"))||0,r=t.parseFloat(n.val());return r>=i}return!0},max:function(n){if(n.filter(e+",["+t.attr("type")+"=number]").filter("[max]").length&&""!==n.val()){var i=parseFloat(n.attr("max"))||0,r=t.parseFloat(n.val());return i>=r}return!0},step:function(n){if(n.filter(e+",["+t.attr("type")+"=number]").filter("[step]").length&&""!==n.val()){var i,f=parseFloat(n.attr("min"))||0,r=parseFloat(n.attr("step"))||1,o=parseFloat(n.val()),u=b(r);return u?(i=Math.pow(10,u),Math.floor((o-f)*i)%(r*i)/Math.pow(100,u)==0):(o-f)%r==0}return!0},email:function(n){return y(n,"[type=email],["+t.attr("type")+"=email]",tt)},url:function(n){return y(n,"[type=url],["+t.attr("type")+"=url]",it)},date:function(n){return n.filter("[type^=date],["+t.attr("type")+"=date]").length&&""!==n.val()?null!==t.parseDate(n.val(),n.attr(t.attr("format"))):!0}},validateOnBlur:!0},destroy:function(){f.fn.destroy.call(this);this.element.off(i)},value:function(){return this._isValidated?0===this.errors().length:!1},_submit:function(n){return this.validate()?!0:(n.stopPropagation(),n.stopImmediatePropagation(),n.preventDefault(),!1)},_checkElement:function(n){var t=this.value();this.validateInput(n);this.value()!==t&&this.trigger("change")},_attachEvents:function(){var t=this;t.element.is(l)&&t.element.on("submit"+i,rt(t._submit,t));t.options.validateOnBlur&&(t.element.is(u)?(t.element.on(h+i,function(){t._checkElement(t.element)}),t.element.is(s)&&t.element.on("click"+i,function(){t._checkElement(t.element)})):(t.element.on(h+i,t._inputSelector,function(){t._checkElement(n(this))}),t.element.on("click"+i,t._checkboxSelector,function(){t._checkElement(n(this))})))},validate:function(){var i,t,f,r,n=!1,e=this.value();if(this._errors={},this.element.is(u))n=this.validateInput(this.element);else{for(r=!1,i=this.element.find(this._inputSelector),t=0,f=i.length;f>t;t++)this.validateInput(i.eq(t))||(r=!0);n=!r}return this.trigger("validate",{valid:n}),e!==n&&this.trigger("change"),n},validateInput:function(i){var u,l,s,o,a,f,v,h,e;return i=n(i),this._isValidated=!0,u=this,l=u._errorTemplate,s=u._checkValidity(i),o=s.valid,a="."+r,f=i.attr(c)||"",v=u._findMessageContainer(f).add(i.next(a).filter(function(){var i=n(this);return i.filter("["+t.attr("for")+"]").length?i.attr(t.attr("for"))===f:!0})).hide(),i.removeAttr("aria-invalid"),o?delete u._errors[f]:(h=u._extractMessage(i,s.key),u._errors[f]=h,e=k(l({message:w(h)})),u._decorateMessageContainer(e,f),v.replaceWith(e).length||e.insertAfter(i),e.show(),i.attr("aria-invalid",!0)),i.toggleClass(nt,!o),o},hideMessages:function(){var i=this,t="."+r,n=i.element;n.is(u)?n.next(t).hide():n.find(t).hide()},_findMessageContainer:function(i){for(var f,o=t.ui.validator.messageLocators,r=n(),u=0,e=this.element.length;e>u;u++)r=r.add(d(this.element[u].getElementsByTagName("*"),i));for(f in o)r=r.add(o[f].locate(this.element,i));return r},_decorateMessageContainer:function(n,i){var u,f=t.ui.validator.messageLocators;n.addClass(r).attr(t.attr("for"),i||"");for(u in f)f[u].decorate(n,i);n.attr("role","alert")},_extractMessage:function(n,i){var u=this,r=u.options.messages[i],f=n.attr(c);return r=t.isFunction(r)?r(n):r,t.format(n.attr(t.attr(i+"-msg"))||n.attr("validationMessage")||n.attr("title")||r||"",f,n.attr(i))},_checkValidity:function(n){var t,i=this.options.rules;for(t in i)if(!i[t].call(this,n))return{valid:!1,key:t};return{valid:!0}},errors:function(){var n,t=[],i=this._errors;for(n in i)t.push(i[n]);return t}});t.ui.plugin(o)}(window.kendo.jQuery),function(n,t){function e(n,t){if(!t)return n;n+"/"===t&&(n=t);var i=RegExp("^"+t,"i");return i.test(n)||(n=t+"/"+n),r.protocol+"//"+(r.host+"/"+n).replace(/\/\/+/g,"/")}function c(n){return n?"#!":"#"}function l(n){var t=r.href;return"#!"===n&&t.indexOf("#")>-1&&t.indexOf("#!")<0?null:t.split(n)[1]||""}function o(n,t){return 0===t.indexOf(n)?t.substr(n.length).replace(/\/\//g,"/"):t}function k(n){return n.replace(/^(#)?/,"#")}function d(n){return n.replace(/^(#(!)?)?/,"#!")}var i=window.kendo,f="change",g="back",a="same",v=i.support,r=window.location,u=window.history,nt=50,y=i.support.browser.msie,tt=/^#*/,s=window.document,h=i.Class.extend({back:function(){y?setTimeout(function(){u.back()}):u.back()},forward:function(){y?setTimeout(function(){u.forward()}):u.forward()},length:function(){return u.length},replaceLocation:function(n){r.replace(n)}}),p=h.extend({init:function(n){this.root=n},navigate:function(n){u.pushState({},s.title,e(n,this.root))},replace:function(n){u.replaceState({},s.title,e(n,this.root))},normalize:function(n){return o(this.root,n)},current:function(){var n=r.pathname;return r.search&&(n+=r.search),o(this.root,n)},change:function(t){n(window).bind("popstate.kendo",t)},stop:function(){n(window).unbind("popstate.kendo")},normalizeCurrent:function(n){var t,i=n.root,f=r.pathname,o=l(c(n.hashBang));i===f+"/"&&(t=i);i===f&&o&&(t=e(o.replace(tt,""),i));t&&u.pushState({},s.title,t)}}),w=h.extend({init:function(n){this._id=i.guid();this.prefix=c(n);this.fix=n?d:k},navigate:function(n){r.hash=this.fix(n)},replace:function(n){this.replaceLocation(this.fix(n))},normalize:function(n){return n.indexOf(this.prefix)<0?n:n.split(this.prefix)[1]},change:function(t){v.hashChange?n(window).on("hashchange."+this._id,t):this._interval=setInterval(t,nt)},stop:function(){n(window).off("hashchange."+this._id);clearInterval(this._interval)},current:function(){return l(this.prefix)},normalizeCurrent:function(n){var i=r.pathname,t=n.root;return n.pushState&&t!==i?(this.replaceLocation(t+this.prefix+o(t,i)),!0):!1}}),b=i.Observable.extend({start:function(t){if(t=t||{},this.bind([f,g,a],t),!this._started){this._started=!0;t.root=t.root||"/";var r,i=this.createAdapter(t);i.normalizeCurrent(t)||(r=i.current(),n.extend(this,{adapter:i,root:t.root,historyLength:i.length(),current:r,locations:[r]}),i.change(n.proxy(this,"_checkUrl")))}},createAdapter:function(n){return v.pushState&&n.pushState?new p(n.root):new w(n.hashBang)},stop:function(){this._started&&(this.adapter.stop(),this.unbind(f),this._started=!1)},change:function(n){this.bind(f,n)},replace:function(n,t){this._navigate(n,t,function(t){t.replace(n);this.locations[this.locations.length-1]=this.current})},navigate:function(n,i){return"#:back"===n?(this.backCalled=!0,this.adapter.back(),t):(this._navigate(n,i,function(t){t.navigate(n);this.locations.push(this.current)}),t)},_navigate:function(n,i,r){var u=this.adapter;return n=u.normalize(n),this.current===n||this.current===decodeURIComponent(n)?(this.trigger(a),t):((i||!this.trigger(f,{url:n}))&&(this.current=n,r.call(this,u),this.historyLength=u.length()),t)},_checkUrl:function(){var i=this.adapter,n=i.current(),e=i.length(),o=this.historyLength===e,r=n===this.locations[this.locations.length-2]&&o,s=this.backCalled,u=this.current;return null===n||this.current===n||this.current===decodeURIComponent(n)?!0:(this.historyLength=e,this.backCalled=!1,this.current=n,r&&this.trigger("back",{url:u,to:n})?(i.forward(),this.current=u,t):this.trigger(f,{url:n,backButtonPressed:!s})?(r?i.forward():(i.back(),this.historyLength--),this.current=u,t):(r?this.locations.pop():this.locations.push(n),t))}});i.History=b;i.History.HistoryAdapter=h;i.History.HashAdapter=w;i.History.PushStateAdapter=p;i.absoluteURL=e;i.history=new b}(window.kendo.jQuery),function(){function h(n,t){return t?n:"([^/]+)"}function c(n,t){return RegExp("^"+n.replace(y,"\\$&").replace(l,"(?:$1)?").replace(a,h).replace(v,"(.*?)")+"$",t?"i":"")}function u(n){return n.replace(/(\?.*)|(#.*)/g,"")}var n=window.kendo,t=n.history,f=n.Observable,e="init",o="routeMissing",i="change",s="back",r="same",l=/\((.*?)\)/g,a=/(\(\?)?:\w+/g,v=/\*\w+/g,y=/[\-{}\[\]+?.,\\\^$|#\s]/g,p=n.Class.extend({init:function(n,t,i){n instanceof RegExp||(n=c(n,i));this.route=n;this._callback=t},callback:function(t){var i,f,r=0,e=n.parseQueryStringParams(t);for(t=u(t),i=this.route.exec(t).slice(1),f=i.length;f>r;r++)void 0!==i[r]&&(i[r]=decodeURIComponent(i[r]));i.push(e);this._callback.apply(null,i)},worksWith:function(n){return this.route.test(u(n))?(this.callback(n),!0):!1}}),w=f.extend({init:function(n){n||(n={});f.fn.init.call(this);this.routes=[];this.pushState=n.pushState;this.hashBang=n.hashBang;this.root=n.root;this.ignoreCase=n.ignoreCase!==!1;this.bind([e,o,i,r],n)},destroy:function(){t.unbind(i,this._urlChangedProxy);t.unbind(r,this._sameProxy);t.unbind(s,this._backProxy);this.unbind()},start:function(){var i,n=this,f=function(){n._same()},r=function(t){n._back(t)},u=function(t){n._urlChanged(t)};t.start({same:f,change:u,back:r,pushState:n.pushState,hashBang:n.hashBang,root:n.root});i={url:t.current||"/",preventDefault:$.noop};n.trigger(e,i)||n._urlChanged(i);this._urlChangedProxy=u;this._backProxy=r},route:function(n,t){this.routes.push(new p(n,t,this.ignoreCase))},navigate:function(t,i){n.history.navigate(t,i)},replace:function(t,i){n.history.replace(t,i)},_back:function(n){this.trigger(s,{url:n.url,to:n.to})&&n.preventDefault()},_same:function(){this.trigger(r)},_urlChanged:function(t){var u,f,e,s,r=t.url;if(r||(r="/"),this.trigger(i,{url:t.url,params:n.parseQueryStringParams(t.url),backButtonPressed:t.backButtonPressed}))return void t.preventDefault();for(u=0,f=this.routes,s=f.length;s>u;u++)if(e=f[u],e.worksWith(r))return;this.trigger(o,{url:r,params:n.parseQueryStringParams(r),backButtonPressed:t.backButtonPressed})&&t.preventDefault()}});n.Router=w}(),function(n){function l(n){if(!n)return{};var t=n.match(k)||[];return{type:t[1],direction:t[3],reverse:"reverse"===t[5]}}var t=window.kendo,i=t.Observable,a="SCRIPT",u="init",f="show",e="hide",o="transitionStart",s="transitionEnd",v="attach",y="detach",p=/unrecognized expression/,r=i.extend({init:function(n,r){var h=this;r=r||{};i.fn.init.call(h);h.content=n;h.id=t.guid();h.tagName=r.tagName||"div";h.model=r.model;h._wrap=r.wrap!==!1;this._evalTemplate=r.evalTemplate||!1;h._fragments={};h.bind([u,f,e,o,s],r)},render:function(i){var r=this,e=!r.element;return e&&(r.element=r._createElement()),i&&n(i).append(r.element),e&&(t.bind(r.element,r.model),r.trigger(u)),i&&(r._eachFragment(v),r.trigger(f)),r.element},clone:function(){return new h(this)},triggerBeforeShow:function(){return!0},showStart:function(){this.element.css("display","")},showEnd:function(){},hideStart:function(){},hideEnd:function(){this.hide()},beforeTransition:function(n){this.trigger(o,{type:n})},afterTransition:function(n){this.trigger(s,{type:n})},hide:function(){this._eachFragment(y);this.element.detach();this.trigger(e)},destroy:function(){var n=this.element;n&&(t.unbind(n),t.destroy(n),n.remove())},fragments:function(t){n.extend(this._fragments,t)},_eachFragment:function(n){for(var t in this._fragments)this._fragments[t][n](this,t)},_createElement:function(){var u,i,r=this,f="<"+r.tagName+" />";try{i=n(document.getElementById(r.content)||r.content);i[0].tagName===a&&(i=i.html())}catch(e){p.test(e.message)&&(i=r.content)}return"string"==typeof i?(i=i.replace(/^\s+|\s+$/g,""),r._evalTemplate&&(i=t.template(i)(r.model||{})),u=n(f).append(i),r._wrap||(u=u.contents())):(u=i,r._evalTemplate&&u.html(t.template(u.html())(r.model||{})),r._wrap&&(u=u.wrapAll(f).parent())),u}}),h=t.Class.extend({init:function(t){n.extend(this,{element:t.element.clone(!0),transition:t.transition,id:t.id});t.element.parent().append(this.element)},hideStart:n.noop,hideEnd:function(){this.element.remove()},beforeTransition:n.noop,afterTransition:n.noop}),w=r.extend({init:function(n,t){r.fn.init.call(this,n,t);this.containers={}},container:function(n){var t=this.containers[n];return t||(t=this._createContainer(n),this.containers[n]=t),t},showIn:function(n,t,i){this.container(n).show(t,i)},_createContainer:function(n){var r,t=this.render(),i=t.find(n);if(!i.length&&t.is(n)){if(!t.is(n))throw Error("can't find a container with the specified "+n+" selector");i=t}return r=new c(i),r.bind("accepted",function(n){n.view.render(i)}),r}}),b=r.extend({attach:function(n,t){n.element.find(t).replaceWith(this.render())},detach:function(){}}),k=/^(\w+)(:(\w+))?( (\w+))?$/,c=i.extend({init:function(n){i.fn.init.call(this);this.container=n;this.history=[];this.view=null;this.running=!1},after:function(){this.running=!1;this.trigger("complete",{view:this.view});this.trigger("after")},end:function(){this.view.showEnd();this.previous.hideEnd();this.after()},show:function(n,i,r){if(!n.triggerBeforeShow())return this.trigger("after"),!1;r=r||n.id;var u=this,f=n===u.view?n.clone():u.view,e=u.history,c=e[e.length-2]||{},h=c.id===r,o=i||(h?e[e.length-1].transition:n.transition),s=l(o);return u.running&&u.effect.stop(),"none"===o&&(o=null),u.trigger("accepted",{view:n}),u.view=n,u.previous=f,u.running=!0,h?e.pop():e.push({id:r,transition:o}),f?(f.hideStart(),o&&t.effects.enabled?(n.element.addClass("k-fx-hidden"),n.showStart(),h&&!i&&(s.reverse=!s.reverse),u.effect=t.fx(n.element).replace(f.element,s.type).beforeTransition(function(){n.beforeTransition("show");f.beforeTransition("hide")}).afterTransition(function(){n.afterTransition("show");f.afterTransition("hide")}).direction(s.direction).setReverse(s.reverse),u.effect.run().then(function(){u.end()})):(n.showStart(),u.end()),!0):(n.showStart(),n.showEnd(),u.after(),!0)}});t.ViewContainer=c;t.Fragment=b;t.Layout=w;t.View=r;t.ViewClone=h}(window.kendo.jQuery),function(n){function c(n,t){var i=n.x.location,r=n.y.location,u=t.x.location,f=t.y.location,e=i-u,o=r-f;return{center:{x:(i+u)/2,y:(r+f)/2},distance:Math.sqrt(e*e+o*o)}}function e(n){var s,f,t,r=[],u=n.originalEvent,e=n.currentTarget,o=0;if(n.api)r.push({id:2,event:n,target:n.target,currentTarget:n.target,location:n,type:"api"});else if(n.type.match(/touch/))for(f=u?u.changedTouches:[],s=f.length;s>o;o++)t=f[o],r.push({location:t,event:n,target:t.target,currentTarget:e,id:t.identifier,type:"touch"});else r.push(i.pointers||i.msPointers?{location:u,event:n,target:n.target,currentTarget:e,id:u.pointerId,type:"pointer"}:{id:1,event:n,target:n.target,currentTarget:e,location:n,type:"mouse"});return r}function l(n){for(var r=t.eventMap.up.split(" "),i=0,u=r.length;u>i;i++)n(r[i])}var t=window.kendo,i=t.support,et=window.document,a=t.Class,v=t.Observable,u=n.now,f=n.extend,y=i.mobileOS,ot=y&&y.android,p=800,w=i.browser.msie?5:0,b="press",k="hold",d="select",g="start",o="move",s="end",nt="cancel",h="tap",tt="release",st="gesturestart",it="gesturechange",rt="gestureend",ut="gesturetap",ht={api:0,touch:0,mouse:9,pointer:9},ct=!i.touch||i.mouseAndTouchPresent,ft=a.extend({init:function(n,t){var i=this;i.axis=n;i._updateLocationData(t);i.startLocation=i.location;i.velocity=i.delta=0;i.timeStamp=u()},move:function(n){var t=this,i=n["page"+t.axis],r=u(),f=r-t.timeStamp||1;(i||!ot)&&(t.delta=i-t.location,t._updateLocationData(n),t.initialDelta=i-t.startLocation,t.velocity=t.delta/f,t.timeStamp=r)},_updateLocationData:function(n){var t=this,i=t.axis;t.location=n["page"+i];t.client=n["client"+i];t.screen=n["screen"+i]}}),lt=a.extend({init:function(n,t,i){f(this,{x:new ft("X",i.location),y:new ft("Y",i.location),type:i.type,threshold:n.threshold||ht[i.type],userEvents:n,target:t,currentTarget:i.currentTarget,initialTouch:i.target,id:i.id,pressEvent:i,_moved:!1,_finished:!1})},press:function(){this._holdTimeout=setTimeout(n.proxy(this,"_hold"),this.userEvents.minHold);this._trigger(b,this.pressEvent)},_hold:function(){this._trigger(k,this.pressEvent)},move:function(n){var t=this;if(!t._finished){if(t.x.move(n.location),t.y.move(n.location),!t._moved){if(t._withinIgnoreThreshold())return;if(r.current&&r.current!==t.userEvents)return t.dispose();t._start(n)}t._finished||t._trigger(o,n)}},end:function(n){var t=this;t.endTime=u();t._finished||(t._finished=!0,t._trigger(tt,n),t._moved?t._trigger(s,n):t._trigger(h,n),clearTimeout(t._holdTimeout),t.dispose())},dispose:function(){var i=this.userEvents,t=i.touches;this._finished=!0;this.pressEvent=null;clearTimeout(this._holdTimeout);t.splice(n.inArray(this,t),1)},skip:function(){this.dispose()},cancel:function(){this.dispose()},isMoved:function(){return this._moved},_start:function(n){clearTimeout(this._holdTimeout);this.startTime=u();this._moved=!0;this._trigger(g,n)},_trigger:function(n,t){var i=this,r=t.event,u={touch:i,x:i.x,y:i.y,target:i.target,event:r};i.userEvents.notify(n,u)&&r.preventDefault()},_withinIgnoreThreshold:function(){var n=this.x.initialDelta,t=this.y.initialDelta;return Math.sqrt(n*n+t*t)<=this.threshold}}),r=v.extend({init:function(r,u){var a,y,ft,e=this,c=t.guid();u=u||{};a=e.filter=u.filter;e.threshold=u.threshold||w;e.minHold=u.minHold||p;e.touches=[];e._maxTouches=u.multiTouch?2:1;e.allowSelection=u.allowSelection;e.captureUpIfMoved=u.captureUpIfMoved;e.eventNS=c;r=n(r).handler(e);v.fn.init.call(e);f(e,{element:r,surface:n(u.global&&ct?et.documentElement:u.surface||r),stopPropagation:u.stopPropagation,pressed:!1});e.surface.handler(e).on(t.applyEventMap("move",c),"_move").on(t.applyEventMap("up cancel",c),"_end");r.on(t.applyEventMap("down",c),a,"_start");(i.pointers||i.msPointers)&&r.css("-ms-touch-action","pinch-zoom double-tap-zoom");u.preventDragEvent&&r.on(t.applyEventMap("dragstart",c),t.preventDefault);r.on(t.applyEventMap("mousedown",c),a,{root:r},"_select");e.captureUpIfMoved&&i.eventCapture&&(y=e.surface[0],ft=n.proxy(e.preventIfMoving,e),l(function(n){y.addEventListener(n,ft,!0)}));e.bind([b,k,h,g,o,s,tt,nt,st,it,rt,ut,d],u)},preventIfMoving:function(n){this._isMoved()&&n.preventDefault()},destroy:function(){var t,n=this;n._destroyed||(n._destroyed=!0,n.captureUpIfMoved&&i.eventCapture&&(t=n.surface[0],l(function(i){t.removeEventListener(i,n.preventIfMoving)})),n.element.kendoDestroy(n.eventNS),n.surface.kendoDestroy(n.eventNS),n.element.removeData("handler"),n.surface.removeData("handler"),n._disposeAll(),n.unbind(),delete n.surface,delete n.element,delete n.currentTarget)},capture:function(){r.current=this},cancel:function(){this._disposeAll();this.trigger(nt)},notify:function(n,t){var r=this,i=r.touches;if(this._isMultiTouch()){switch(n){case o:n=it;break;case s:n=rt;break;case h:n=ut}f(t,{touches:i},c(i[0],i[1]))}return this.trigger(n,f(t,{type:n}))},press:function(n,t,i){this._apiCall("_start",n,t,i)},move:function(n,t){this._apiCall("_move",n,t)},end:function(n,t){this._apiCall("_end",n,t)},_isMultiTouch:function(){return this.touches.length>1},_maxTouchesReached:function(){return this.touches.length>=this._maxTouches},_disposeAll:function(){for(var n=this.touches;n.length>0;)n.pop().dispose()},_isMoved:function(){return n.grep(this.touches,function(n){return n.isMoved()}).length},_select:function(n){(!this.allowSelection||this.trigger(d,{event:n}))&&n.preventDefault()},_start:function(t){var f,u,i=this,o=0,c=i.filter,s=e(t),l=s.length,h=t.which;if(!(h&&h>1||i._maxTouchesReached()))for(r.current=null,i.currentTarget=t.currentTarget,i.stopPropagation&&t.stopPropagation();l>o&&!i._maxTouchesReached();o++)u=s[o],f=c?n(u.currentTarget):i.element,f.length&&(u=new lt(i,f,u),i.touches.push(u),u.press(),i._isMultiTouch()&&i.notify("gesturestart",{}))},_move:function(n){this._eachTouch("move",n)},_end:function(n){this._eachTouch("end",n)},_eachTouch:function(n,t){for(var r,u,f,c=this,o={},s=e(t),h=c.touches,i=0;h.length>i;i++)r=h[i],o[r.id]=r;for(i=0;s.length>i;i++)u=s[i],f=o[u.id],f&&f[n](u)},_apiCall:function(t,i,r,u){this[t]({api:!0,pageX:i,pageY:r,clientX:i,clientY:r,target:n(u||this.element)[0],stopPropagation:n.noop,preventDefault:n.noop})}});r.defaultThreshold=function(n){w=n};r.minHold=function(n){p=n};t.getTouches=e;t.touchDelta=c;t.UserEvents=r}(window.kendo.jQuery),function(n,t){function wt(t,i){try{return n.contains(t,i)||t==i}catch(r){return!1}}function a(n,t){return parseInt(n.css(t),10)||0}function nt(n,t){return Math.min(Math.max(n,t.min),t.max)}function tt(n,t){var i=k(n),r=i.left+a(n,"borderLeftWidth")+a(n,"paddingLeft"),u=i.top+a(n,"borderTopWidth")+a(n,"paddingTop"),f=r+n.width()-t.outerWidth(!0),e=u+n.height()-t.outerHeight(!0);return{x:{min:r,max:f},y:{min:u,max:e}}}function bt(n,i,r){for(var f,e,u=0,o=i&&i.length,s=r&&r.length;n&&n.parentNode;){for(u=0;o>u;u++)if(f=i[u],f.element[0]===n)return{target:f,targetElement:n};for(u=0;s>u;u++)if(e=r[u],w.matchesSelector.call(n,e.options.filter))return{target:e,targetElement:n};n=n.parentNode}return t}function it(n,t){var i,u=t.options.group,r=n[u];if(o.fn.destroy.call(t),r.length>1){for(i=0;r.length>i;i++)if(r[i]==t){r.splice(i,1);break}}else r.length=0,delete n[u]}var f,p,rt,c,ut,ft,i=window.kendo,w=i.support,b=window.document,kt=i.Class,o=i.ui.Widget,e=i.Observable,dt=i.UserEvents,u=n.proxy,r=n.extend,k=i.getOffset,v={},s={},h={},d=i.elementUnderCursor,et="keyup",l="change",ot="dragstart",st="hold",ht="drag",ct="dragend",lt="dragcancel",at="hintDestroyed",g="dragenter",y="dragleave",vt="drop",gt=e.extend({init:function(t,r){var f=this,o=t[0];f.capture=!1;o.addEventListener?(n.each(i.eventMap.down.split(" "),function(){o.addEventListener(this,u(f._press,f),!0)}),n.each(i.eventMap.up.split(" "),function(){o.addEventListener(this,u(f._release,f),!0)})):(n.each(i.eventMap.down.split(" "),function(){o.attachEvent(this,u(f._press,f))}),n.each(i.eventMap.up.split(" "),function(){o.attachEvent(this,u(f._release,f))}));e.fn.init.call(f);f.bind(["press","release"],r||{})},captureNext:function(){this.capture=!0},cancelCapture:function(){this.capture=!1},_press:function(n){var t=this;t.trigger("press");t.capture&&n.preventDefault()},_release:function(n){var t=this;t.trigger("release");t.capture&&(n.preventDefault(),t.cancelCapture())}}),yt=e.extend({init:function(t){var i=this;e.fn.init.call(i);i.forcedEnabled=!1;n.extend(i,t);i.scale=1;i.horizontal?(i.measure="offsetWidth",i.scrollSize="scrollWidth",i.axis="x"):(i.measure="offsetHeight",i.scrollSize="scrollHeight",i.axis="y")},makeVirtual:function(){n.extend(this,{virtual:!0,forcedEnabled:!0,_virtualMin:0,_virtualMax:0})},virtualSize:function(n,t){(this._virtualMin!==n||this._virtualMax!==t)&&(this._virtualMin=n,this._virtualMax=t,this.update())},outOfBounds:function(n){return n>this.max||this.min>n},forceEnabled:function(){this.forcedEnabled=!0},getSize:function(){return this.container[0][this.measure]},getTotal:function(){return this.element[0][this.scrollSize]},rescale:function(n){this.scale=n},update:function(n){var t=this,u=t.virtual?t._virtualMax:t.getTotal(),r=u*t.scale,i=t.getSize();(0!==u||t.forcedEnabled)&&(t.max=t.virtual?-t._virtualMin:0,t.size=i,t.total=r,t.min=Math.min(t.max,i-r),t.minScale=i/u,t.centerOffset=(r-i)/2,t.enabled=t.forcedEnabled||r>i,n||t.trigger(l,t))}}),ni=e.extend({init:function(n){var t=this;e.fn.init.call(t);t.x=new yt(r({horizontal:!0},n));t.y=new yt(r({horizontal:!1},n));t.container=n.container;t.forcedMinScale=n.minScale;t.maxScale=n.maxScale||100;t.bind(l,n)},rescale:function(n){this.x.rescale(n);this.y.rescale(n);this.refresh()},centerCoordinates:function(){return{x:Math.min(0,-this.x.centerOffset),y:Math.min(0,-this.y.centerOffset)}},refresh:function(){var n=this;n.x.update();n.y.update();n.enabled=n.x.enabled||n.y.enabled;n.minScale=n.forcedMinScale||Math.min(n.x.minScale,n.y.minScale);n.fitScale=Math.max(n.x.minScale,n.y.minScale);n.trigger(l)}}),pt=e.extend({init:function(n){var t=this;r(t,n);e.fn.init.call(t)},outOfBounds:function(){return this.dimension.outOfBounds(this.movable[this.axis])},dragMove:function(n){var t=this,i=t.dimension,r=t.axis,u=t.movable,f=u[r]+n;i.enabled&&((i.min>f&&0>n||f>i.max&&n>0)&&(n*=t.resistance),u.translateAxis(r,n),t.trigger(l,t))}}),ti=kt.extend({init:function(n){var u,f,e,i,t=this;r(t,{elastic:!0},n);e=t.elastic?.5:0;i=t.movable;t.x=u=new pt({axis:"x",dimension:t.dimensions.x,resistance:e,movable:i});t.y=f=new pt({axis:"y",dimension:t.dimensions.y,resistance:e,movable:i});t.userEvents.bind(["move","end","gesturestart","gesturechange"],{gesturestart:function(n){t.gesture=n;t.offset=t.dimensions.container.offset()},gesturechange:function(n){var e,o,s,h=t.gesture,c=h.center,l=n.center,r=n.distance/h.distance,v=t.dimensions.minScale,a=t.dimensions.maxScale;v>=i.scale&&1>r&&(r+=.8*(1-r));i.scale*r>=a&&(r=a/i.scale);o=i.x+t.offset.left;s=i.y+t.offset.top;e={x:(o-c.x)*r+l.x-o,y:(s-c.y)*r+l.y-s};i.scaleWith(r);u.dragMove(e.x);f.dragMove(e.y);t.dimensions.rescale(i.scale);t.gesture=n;n.preventDefault()},move:function(n){n.event.target.tagName.match(/textarea|input/i)||(u.dimension.enabled||f.dimension.enabled?(u.dragMove(n.x.delta),f.dragMove(n.y.delta),n.preventDefault()):n.touch.skip())},end:function(n){n.preventDefault()}})}}),ii=w.transitions.prefix+"Transform";p=w.hasHW3D?function(n,t,i){return"translate3d("+n+"px,"+t+"px,0) scale("+i+")"}:function(n,t,i){return"translate("+n+"px,"+t+"px) scale("+i+")"};rt=e.extend({init:function(t){var i=this;e.fn.init.call(i);i.element=n(t);i.element[0].style.webkitTransformOrigin="left top";i.x=0;i.y=0;i.scale=1;i._saveCoordinates(p(i.x,i.y,i.scale))},translateAxis:function(n,t){this[n]+=t;this.refresh()},scaleTo:function(n){this.scale=n;this.refresh()},scaleWith:function(n){this.scale*=n;this.refresh()},translate:function(n){this.x+=n.x;this.y+=n.y;this.refresh()},moveAxis:function(n,t){this[n]=t;this.refresh()},moveTo:function(n){r(this,n);this.refresh()},refresh:function(){var t,n=this,r=n.x,u=n.y;n.round&&(r=Math.round(r),u=Math.round(u));t=p(r,u,n.scale);t!=n.coordinates&&(i.support.browser.msie&&10>i.support.browser.version?(n.element[0].style.position="absolute",n.element[0].style.left=n.x+"px",n.element[0].style.top=n.y+"px"):n.element[0].style[ii]=t,n._saveCoordinates(t),n.trigger(l))},_saveCoordinates:function(n){this.coordinates=n}});c=o.extend({init:function(n,t){var i,r=this;o.fn.init.call(r,n,t);i=r.options.group;i in s?s[i].push(r):s[i]=[r]},events:[g,y,vt],options:{name:"DropTarget",group:"default"},destroy:function(){it(s,this)},_trigger:function(n,i){var u=this,f=v[u.options.group];return f?u.trigger(n,r({},i.event,{draggable:f,dropTarget:i.dropTarget})):t},_over:function(n){this._trigger(g,n)},_out:function(n){this._trigger(y,n)},_drop:function(n){var t=this,i=v[t.options.group];i&&(i.dropped=!t._trigger(vt,n))}});c.destroyGroup=function(n){var t,i=s[n]||h[n];if(i){for(t=0;i.length>t;t++)o.fn.destroy.call(i[t]);i.length=0;delete s[n];delete h[n]}};c._cache=s;ut=c.extend({init:function(n,t){var i,r=this;o.fn.init.call(r,n,t);i=r.options.group;i in h?h[i].push(r):h[i]=[r]},destroy:function(){it(h,this)},options:{name:"DropTargetArea",group:"default",filter:null}});ft=o.extend({init:function(n,t){var i=this;o.fn.init.call(i,n,t);i._activated=!1;i.userEvents=new dt(i.element,{global:!0,allowSelection:!0,filter:i.options.filter,threshold:i.options.distance,start:u(i._start,i),hold:u(i._hold,i),move:u(i._drag,i),end:u(i._end,i),cancel:u(i._cancel,i),select:u(i._select,i)});i._afterEndHandler=u(i._afterEnd,i);i._captureEscape=u(i._captureEscape,i)},events:[st,ot,ht,ct,lt,at],options:{name:"Draggable",distance:i.support.touch?0:5,group:"default",cursorOffset:null,axis:null,container:null,filter:null,ignore:null,holdToDrag:!1,dropped:!1},cancelHold:function(){this._activated=!1},_captureEscape:function(n){var t=this;n.keyCode===i.keys.ESC&&(t._trigger(lt,{event:n}),t.userEvents.cancel())},_updateHint:function(t){var i,r=this,o=r.options,u=r.boundaries,e=o.axis,f=r.options.cursorOffset;f?i={left:t.x.location+f.left,top:t.y.location+f.top}:(r.hintOffset.left+=t.x.delta,r.hintOffset.top+=t.y.delta,i=n.extend({},r.hintOffset));u&&(i.top=nt(i.top,u.y),i.left=nt(i.left,u.x));"x"===e?delete i.top:"y"===e&&delete i.left;r.hint.css(i)},_shouldIgnoreTarget:function(t){var i=this.options.ignore;return i&&n(t).is(i)},_select:function(n){this._shouldIgnoreTarget(n.event.target)||n.preventDefault()},_start:function(r){var f,u=this,e=u.options,s=e.container,o=e.hint;return this._shouldIgnoreTarget(r.touch.initialTouch)||e.holdToDrag&&!u._activated?(u.userEvents.cancel(),t):(u.currentTarget=r.target,u.currentTargetOffset=k(u.currentTarget),o&&(u.hint&&u.hint.stop(!0,!0).remove(),u.hint=i.isFunction(o)?n(o.call(u,u.currentTarget)):o,f=k(u.currentTarget),u.hintOffset=f,u.hint.css({position:"absolute",zIndex:2e4,left:f.left,top:f.top}).appendTo(b.body),u.angular("compile",function(){return u.hint.removeAttr("ng-repeat"),{elements:u.hint.get(),scopeFrom:r.target}})),v[e.group]=u,u.dropped=!1,s&&(u.boundaries=tt(s,u.hint)),u._trigger(ot,r)&&(u.userEvents.cancel(),u._afterEnd()),u.userEvents.capture(),n(b).on(et,u._captureEscape),t)},_hold:function(n){this.currentTarget=n.target;this._trigger(st,n)?this.userEvents.cancel():this._activated=!0},_drag:function(i){var u=this;i.preventDefault();u._withDropTarget(i,function(u,e){if(!u)return f&&(f._trigger(y,r(i,{dropTarget:n(f.targetElement)})),f=null),t;if(f){if(e===f.targetElement)return;f._trigger(y,r(i,{dropTarget:n(f.targetElement)}))}u._trigger(g,r(i,{dropTarget:n(e)}));f=r(u,{targetElement:e})});u._trigger(ht,r(i,{dropTarget:f}));u.hint&&u._updateHint(i)},_end:function(t){var i=this;i._withDropTarget(t,function(i,u){i&&(i._drop(r({},t,{dropTarget:n(u)})),f=null)});i._trigger(ct,t);i._cancel(t.event)},_cancel:function(){var n=this;n._activated=!1;n.hint&&!n.dropped?setTimeout(function(){n.hint.stop(!0,!0).animate(n.currentTargetOffset,"fast",n._afterEndHandler)},0):n._afterEnd()},_trigger:function(n,t){var i=this;return i.trigger(n,r({},t.event,{x:t.x,y:t.y,currentTarget:i.currentTarget,dropTarget:t.dropTarget}))},_withDropTarget:function(n,t){var i,u,r=this,o=r.options,f=s[o.group],e=h[o.group];(f&&f.length||e&&e.length)&&(i=d(n),r.hint&&wt(r.hint[0],i)&&(r.hint.hide(),i=d(n),i||(i=d(n)),r.hint.show()),u=bt(i,f,e),u?t(u.target,u.targetElement):t())},destroy:function(){var n=this;o.fn.destroy.call(n);n._afterEnd();n.userEvents.destroy();n.currentTarget=null},_afterEnd:function(){var t=this;t.hint&&t.hint.remove();delete v[t.options.group];t.trigger("destroy");t.trigger(at);n(b).off(et,t._captureEscape)}});i.ui.plugin(c);i.ui.plugin(ut);i.ui.plugin(ft);i.TapCapture=gt;i.containerBoundaries=tt;r(i.ui,{Pane:ti,PaneDimensions:ni,Movable:rt})}(window.kendo.jQuery),function(n){function y(t,i){return t===i||n.contains(t,i)}var t=window.kendo,rt=t.ui,p=rt.Widget,f=t.support,r=t.getOffset,w="open",b="close",ut="deactivate",ft="activate",u="center",et="left",s="right",k="top",h="bottom",d="absolute",ot="hidden",c="body",g="location",e="position",st="visible",ht="effects",ct="k-state-active",l="k-state-border",at=/k-state-border-(\w+)/,lt=".k-picker-wrap, .k-dropdown-wrap, .k-link",vt="down",nt=n(document.documentElement),tt=n(window),a="scroll",v="resize scroll",yt=f.transitions.css,pt=yt+"transform",i=n.extend,o=".kendoPopup",it=["font-size","font-family","font-stretch","font-style","font-weight","line-height"],wt=p.extend({init:function(r,u){var e,f=this;u=u||{};u.isRtl&&(u.origin=u.origin||h+" "+s,u.position=u.position||k+" "+s);p.fn.init.call(f,r,u);r=f.element;u=f.options;f.collisions=u.collision?u.collision.split(" "):[];f.downEvent=t.applyEventMap(vt,t.guid());1===f.collisions.length&&f.collisions.push(f.collisions[0]);e=n(f.options.anchor).closest(".k-popup,.k-group").filter(":not([class^=km-])");u.appendTo=n(n(u.appendTo)[0]||e[0]||c);f.element.hide().addClass("k-popup k-group k-reset").toggleClass("k-rtl",!!u.isRtl).css({position:d}).appendTo(u.appendTo).on("mouseenter"+o,function(){f._hovered=!0}).on("mouseleave"+o,function(){f._hovered=!1});f.wrapper=n();u.animation===!1&&(u.animation={open:{effects:{}},close:{hide:!0,effects:{}}});i(u.animation.open,{complete:function(){f.wrapper.css({overflow:st});f._activated=!0;f._trigger(ft)}});i(u.animation.close,{complete:function(){f._animationClose()}});f._mousedownProxy=function(n){f._mousedown(n)};f._resizeProxy=function(n){f._resize(n)};u.toggleTarget&&n(u.toggleTarget).on(u.toggleEvent+o,n.proxy(f.toggle,f))},events:[w,ft,b,ut],options:{name:"Popup",toggleEvent:"click",origin:h+" "+et,position:k+" "+et,anchor:c,appendTo:null,collision:"flip fit",viewport:window,copyAnchorStyles:!0,autosize:!1,modal:!1,adjustSize:{width:0,height:0},animation:{open:{effects:"slideIn:down",transition:!0,duration:200},close:{duration:100,hide:!0}}},_animationClose:function(){var r,u,f,e,i=this,o=i.options;i.wrapper.hide();r=i.wrapper.data(g);u=n(o.anchor);r&&i.wrapper.css(r);o.anchor!=c&&(f=((u.attr("class")||"").match(at)||["","down"])[1],e=l+"-"+f,u.removeClass(e).children(lt).removeClass(ct).removeClass(e),i.element.removeClass(l+"-"+t.directions[f].reverse));i._closing=!1;i._trigger(ut)},destroy:function(){var u,i=this,r=i.options,f=i.element.off(o);p.fn.destroy.call(i);r.toggleTarget&&n(r.toggleTarget).off(o);r.modal||(nt.unbind(i.downEvent,i._mousedownProxy),i._scrollableParents().unbind(a,i._resizeProxy),tt.unbind(v,i._resizeProxy));t.destroy(i.element.children());f.removeData();r.appendTo[0]===document.body&&(u=f.parent(".k-animation-container"),u[0]?u.remove():f.remove())},open:function(r,u){var s,p,g,o=this,ut={isFixed:!isNaN(parseInt(u,10)),x:r,y:u},h=o.element,y=o.options,b="down",rt=n(y.anchor),ft=h[0]&&h.hasClass("km-widget");if(!o.visible()){if(y.copyAnchorStyles&&(ft&&"font-size"==it[0]&&it.shift(),h.css(t.getComputedStyles(rt[0],it))),h.data("animating")||o._trigger(w))return;o._activated=!1;y.modal||(nt.unbind(o.downEvent,o._mousedownProxy).bind(o.downEvent,o._mousedownProxy),f.mobileOS.ios||f.mobileOS.android||(o._scrollableParents().unbind(a,o._resizeProxy).bind(a,o._resizeProxy),tt.unbind(v,o._resizeProxy).bind(v,o._resizeProxy)));o.wrapper=p=t.wrap(h,y.autosize).css({overflow:ot,display:"block",position:d});f.mobileOS.android&&p.css(pt,"translatez(0)");p.css(e);n(y.appendTo)[0]==document.body&&p.css(k,"-10000px");s=i(!0,{},y.animation.open);o.flipped=o._position(ut);s.effects=t.parseEffects(s.effects,o.flipped);b=s.effects.slideIn?s.effects.slideIn.direction:b;y.anchor!=c&&(g=l+"-"+b,h.addClass(l+"-"+t.directions[b].reverse),rt.addClass(g).children(lt).addClass(ct).addClass(g));h.data(ht,s.effects).kendoStop(!0).kendoAnimate(s)}},toggle:function(){var n=this;n[n.visible()?b:w]()},visible:function(){return this.element.is(":"+st)},close:function(r){var s,f,e,o,u=this,h=u.options;if(u.visible()){if(s=u.wrapper[0]?u.wrapper:t.wrap(u.element).hide(),u._closing||u._trigger(b))return;u.element.find(".k-popup").each(function(){var i=n(this),t=i.data("kendoPopup");t&&t.close(r)});nt.unbind(u.downEvent,u._mousedownProxy);u._scrollableParents().unbind(a,u._resizeProxy);tt.unbind(v,u._resizeProxy);r?f={hide:!0,effects:{}}:(f=i(!0,{},h.animation.close),e=u.element.data(ht),o=f.effects,!o&&!t.size(o)&&e&&t.size(e)&&(f.effects=e,f.reverse=!0),u._closing=!0);u.element.kendoStop(!0);s.css({overflow:ot});u.element.kendoAnimate(f)}},_trigger:function(n){return this.trigger(n,{type:n})},_resize:function(n){var t=this;"resize"===n.type?(clearTimeout(t._resizeTimeout),t._resizeTimeout=setTimeout(function(){t._position();t._resizeTimeout=null},50)):(!t._hovered||t._activated&&t.element.hasClass("k-list-container"))&&t.close()},_mousedown:function(i){var u=this,s=u.element[0],e=u.options,h=n(e.anchor)[0],o=e.toggleTarget,f=t.eventTarget(i),r=n(f).closest(".k-popup"),c=r.parent().parent(".km-shim").length;r=r[0];(c||!r||r===u.element[0])&&"popover"!==n(i.target).closest("a").data("rel")&&(y(s,f)||y(h,f)||o&&y(n(o)[0],f)||u.close())},_fit:function(n,t,i){var r=0;return n+t>i&&(r=i-(n+t)),0>n&&(r=-n),r},_flip:function(n,t,i,r,f,e,o){var s=0;return o=o||t,e!==f&&e!==u&&f!==u&&(n+o>r&&(s+=-(i+t)),0>n+s&&(s+=i+t)),s},_scrollableParents:function(){return n(this.options.anchor).parentsUntil("body").filter(function(n,i){var r=t.getComputedStyles(i,["overflow"]);return"visible"!=r.overflow})},_position:function(t){var nt,c,st,w,h,ht,a,s,tt,it,o=this,rt=o.element.css(e,""),u=o.wrapper,v=o.options,y=n(v.viewport),ct=y.offset(),l=n(v.anchor),ut=v.origin.toLowerCase().split(" "),ft=v.position.toLowerCase().split(" "),b=o.collisions,p=f.zoomLevel(),k=10002,lt=!!(y[0]==window&&window.innerWidth&&1.02>=p),et=0,at=lt?window.innerWidth:y.width(),vt=lt?window.innerHeight:y.height(),ot=l.parents().filter(u.siblings());if(ot[0])if(c=Math.max(+ot.css("zIndex"),0))k=c+10;else for(nt=l.parentsUntil(ot),st=nt.length;st>et;et++)c=+n(nt[et]).css("zIndex"),c&&c>k&&(k=c+10);return u.css("zIndex",k),u.css(t&&t.isFixed?{left:t.x,top:t.y}:o._align(ut,ft)),w=r(u,e,l[0]===u.offsetParent()[0]),h=r(u),ht=l.offsetParent().parent(".k-animation-container,.k-popup,.k-group"),ht.length&&(w=r(u,e,!0),h=r(u)),y[0]===window?(h.top-=window.pageYOffset||document.documentElement.scrollTop||0,h.left-=window.pageXOffset||document.documentElement.scrollLeft||0):(h.top-=ct.top,h.left-=ct.left),o.wrapper.data(g)||u.data(g,i({},w)),a=i({},h),s=i({},w),tt=v.adjustSize,"fit"===b[0]&&(s.top+=o._fit(a.top,u.outerHeight()+tt.height,vt/p)),"fit"===b[1]&&(s.left+=o._fit(a.left,u.outerWidth()+tt.width,at/p)),it=i({},s),"flip"===b[0]&&(s.top+=o._flip(a.top,rt.outerHeight(),l.outerHeight(),vt/p,ut[0],ft[0],u.outerHeight())),"flip"===b[1]&&(s.left+=o._flip(a.left,rt.outerWidth(),l.outerWidth(),at/p,ut[1],ft[1],u.outerWidth())),rt.css(e,d),u.css(s),s.left!=it.left||s.top!=it.top},_align:function(t,i){var c,l=this,v=l.wrapper,a=n(l.options.anchor),y=t[0],p=t[1],w=i[0],b=i[1],k=r(a),d=n(l.options.appendTo),g=v.outerWidth(),nt=v.outerHeight(),tt=a.outerWidth(),it=a.outerHeight(),f=k.top,e=k.left,o=Math.round;return d[0]!=document.body&&(c=r(d),f-=c.top,e-=c.left),y===h&&(f+=it),y===u&&(f+=o(it/2)),w===h&&(f-=nt),w===u&&(f-=o(nt/2)),p===s&&(e+=tt),p===u&&(e+=o(tt/2)),b===s&&(e-=g),b===u&&(e-=o(g/2)),{top:f,left:e}}});rt.plugin(wt)}(window.kendo.jQuery),function(n){var i=window.kendo,u=i.ui.Widget,r=n.proxy,t=Math.abs,f=20,e=i.Class.extend({init:function(r,u,f){f=n.extend({minXDelta:30,maxYDelta:20,maxDuration:1e3},f);new i.UserEvents(r,{surface:f.surface,allowSelection:!0,start:function(n){2*t(n.x.velocity)>=t(n.y.velocity)&&n.sender.capture()},move:function(n){var i=n.touch,r=n.event.timeStamp-i.startTime,e=i.x.initialDelta>0?"right":"left";t(i.x.initialDelta)>=f.minXDelta&&t(i.y.initialDelta)<f.maxYDelta&&f.maxDuration>r&&(u({direction:e,touch:i,target:i.target}),i.cancel())}})}}),o=u.extend({init:function(n,t){function e(n){return function(t){f._triggerTouch(n,t)}}function o(n){return function(t){f.trigger(n,{touches:t.touches,distance:t.distance,center:t.center,event:t.event})}}var f=this;u.fn.init.call(f,n,t);t=f.options;n=f.element;f.wrapper=n;f.events=new i.UserEvents(n,{filter:t.filter,surface:t.surface,minHold:t.minHold,multiTouch:t.multiTouch,allowSelection:!0,press:e("touchstart"),hold:e("hold"),tap:r(f,"_tap"),gesturestart:o("gesturestart"),gesturechange:o("gesturechange"),gestureend:o("gestureend")});t.enableSwipe?(f.events.bind("start",r(f,"_swipestart")),f.events.bind("move",r(f,"_swipemove"))):(f.events.bind("start",r(f,"_dragstart")),f.events.bind("move",e("drag")),f.events.bind("end",e("dragend")));i.notify(f)},events:["touchstart","dragstart","drag","dragend","tap","doubletap","hold","swipe","gesturestart","gesturechange","gestureend"],options:{name:"Touch",surface:null,global:!1,multiTouch:!1,enableSwipe:!1,minXDelta:30,maxYDelta:20,maxDuration:1e3,minHold:800,doubleTapTimeout:800},cancel:function(){this.events.cancel()},_triggerTouch:function(n,t){this.trigger(n,{touch:t.touch,event:t.event})&&t.preventDefault()},_tap:function(n){var t=this,r=t.lastTap,u=n.touch;r&&t.options.doubleTapTimeout>u.endTime-r.endTime&&i.touchDelta(u,r).distance<f?(t._triggerTouch("doubletap",n),t.lastTap=null):(t._triggerTouch("tap",n),t.lastTap=u)},_dragstart:function(n){this._triggerTouch("dragstart",n)},_swipestart:function(n){2*t(n.x.velocity)>=t(n.y.velocity)&&n.sender.capture()},_swipemove:function(n){var u=this,r=u.options,i=n.touch,f=n.event.timeStamp-i.startTime,e=i.x.initialDelta>0?"right":"left";t(i.x.initialDelta)>=r.minXDelta&&t(i.y.initialDelta)<r.maxYDelta&&r.maxDuration>f&&(u.trigger("swipe",{direction:e,touch:n.touch}),i.cancel())}});window.jQuery.fn.kendoMobileSwipe=function(n,t){this.each(function(){new e(this,n,t)})};i.ui.plugin(o)}(window.kendo.jQuery),function(n,t){var i=window.kendo,d=i.mobile,l=i.effects,a=d.ui,r=n.proxy,f=n.extend,o=a.Widget,g=i.Class,v=i.ui.Movable,nt=i.ui.Pane,tt=i.ui.PaneDimensions,y=l.Transition,e=l.Animation,u=Math.abs,it=500,rt=.7,ut=.96,ft=10,p=55,w=.5,b=5,h="km-scroller-release",c="km-scroller-refresh",s="change",k="scroll",et=2,ot=e.extend({init:function(n){var t=this;e.fn.init.call(t);f(t,n);t.userEvents.bind("gestureend",r(t.start,t));t.tapCapture.bind("press",r(t.cancel,t))},enabled:function(){return this.dimensions.minScale>this.movable.scale},done:function(){return.01>this.dimensions.minScale-this.movable.scale},tick:function(){var n=this.movable;n.scaleWith(1.1);this.dimensions.rescale(n.scale)},onEnd:function(){var n=this.movable;n.scaleTo(this.dimensions.minScale);this.dimensions.rescale(n.scale)}}),st=e.extend({init:function(n){var t=this;e.fn.init.call(t);f(t,n,{transition:new y({axis:n.axis,movable:n.movable,onEnd:function(){t._end()}})});t.tapCapture.bind("press",function(){t.cancel()});t.userEvents.bind("end",r(t.start,t));t.userEvents.bind("gestureend",r(t.start,t));t.userEvents.bind("tap",r(t.onEnd,t))},onCancel:function(){this.transition.cancel()},freeze:function(n){var t=this;t.cancel();t._moveTo(n)},onEnd:function(){var n=this;n.paneAxis.outOfBounds()?n._snapBack():n._end()},done:function(){return u(this.velocity)<1},start:function(n){var i,t=this;t.dimension.enabled&&(t.paneAxis.outOfBounds()?t._snapBack():(i=n.touch.id===et?0:n.touch[t.axis].velocity,t.velocity=Math.max(Math.min(i*t.velocityMultiplier,p),-p),t.tapCapture.captureNext(),e.fn.start.call(t)))},tick:function(){var n=this,i=n.dimension,r=n.paneAxis.outOfBounds()?w:n.friction,u=n.velocity*=r,t=n.movable[n.axis]+u;!n.elastic&&i.outOfBounds(t)&&(t=Math.max(Math.min(t,i.max),i.min),n.velocity=0);n.movable.moveAxis(n.axis,t)},_end:function(){this.tapCapture.cancelCapture();this.end()},_snapBack:function(){var n=this,t=n.dimension,i=n.movable[n.axis]>t.max?t.max:t.min;n._moveTo(i)},_moveTo:function(n){this.transition.moveTo({location:n,duration:it,ease:y.easeOutExpo})}}),ht=e.extend({init:function(n){var t=this;i.effects.Animation.fn.init.call(this);f(t,n,{origin:{},destination:{},offset:{}})},tick:function(){this._updateCoordinates();this.moveTo(this.origin)},done:function(){return u(this.offset.y)<b&&u(this.offset.x)<b},onEnd:function(){this.moveTo(this.destination);this.callback&&this.callback.call()},setCoordinates:function(n,t){this.offset={};this.origin=n;this.destination=t},setCallback:function(n){n&&i.isFunction(n)?this.callback=n:n=t},_updateCoordinates:function(){this.offset={x:(this.destination.x-this.origin.x)/4,y:(this.destination.y-this.origin.y)/4};this.origin={y:this.origin.y+this.offset.y,x:this.origin.x+this.offset.x}}}),ct=g.extend({init:function(t){var i=this,e="x"===t.axis,u=n('<div class="km-touch-scrollbar km-'+(e?"horizontal":"vertical")+'-scrollbar" />');f(i,t,{element:u,elementSize:0,movable:new v(u),scrollMovable:t.movable,alwaysVisible:t.alwaysVisible,size:e?"width":"height"});i.scrollMovable.bind(s,r(i.refresh,i));i.container.append(u);t.alwaysVisible&&i.show()},refresh:function(){var n=this,f=n.axis,e=n.dimension,r=e.size,o=n.scrollMovable,u=r/e.total,t=Math.round(-o[f]*u),i=Math.round(r*u);u>=1?this.element.css("display","none"):this.element.css("display","");t+i>r?i=r-t:0>t&&(i+=t,t=0);n.elementSize!=i&&(n.element.css(n.size,i+"px"),n.elementSize=i);n.movable.moveAxis(f,t)},show:function(){this.element.css({opacity:rt,visibility:"visible"})},hide:function(){this.alwaysVisible||this.element.css({opacity:0})}}),lt=o.extend({init:function(e,h){var p,w,a,l,b,y,d,g,it,c=this;return o.fn.init.call(c,e,h),e=c.element,(c._native=c.options.useNative&&i.support.hasNativeScrolling)?(e.addClass("km-native-scroller").prepend('<div class="km-scroll-header"/>'),f(c,{scrollElement:e,fixedContainer:e.children().first()}),t):(e.css("overflow","hidden").addClass("km-scroll-wrapper").wrapInner('<div class="km-scroll-container"/>').prepend('<div class="km-scroll-header"/>'),p=e.children().eq(1),w=new i.TapCapture(e),a=new v(p),l=new tt({element:p,container:e,forcedEnabled:c.options.zoom}),b=this.options.avoidScrolling,y=new i.UserEvents(e,{allowSelection:!0,preventDragEvent:!0,captureUpIfMoved:!0,multiTouch:c.options.zoom,start:function(t){l.refresh();var i=u(t.x.velocity),r=u(t.y.velocity),f=2*i>=r,e=n.contains(c.fixedContainer[0],t.event.target),o=2*r>=i;!e&&!b(t)&&c.enabled&&(l.x.enabled&&f||l.y.enabled&&o)?y.capture():y.cancel()}}),d=new nt({movable:a,dimensions:l,userEvents:y,elastic:c.options.elastic}),g=new ot({movable:a,dimensions:l,userEvents:y,tapCapture:w}),it=new ht({moveTo:function(n){c.scrollTo(n.x,n.y)}}),a.bind(s,function(){c.scrollTop=-a.y;c.scrollLeft=-a.x;c.trigger(k,{scrollTop:c.scrollTop,scrollLeft:c.scrollLeft})}),c.options.mousewheelScrolling&&e.on("DOMMouseScroll mousewheel",r(this,"_wheelScroll")),f(c,{movable:a,dimensions:l,zoomSnapBack:g,animatedScroller:it,userEvents:y,pane:d,tapCapture:w,pulled:!1,enabled:!0,scrollElement:p,scrollTop:0,scrollLeft:0,fixedContainer:e.children().first()}),c._initAxis("x"),c._initAxis("y"),c._wheelEnd=function(){c._wheel=!1;c.userEvents.end(0,c._wheelY)},l.refresh(),c.options.pullToRefresh&&c._initPullToRefresh(),t)},_wheelScroll:function(n){this._wheel||(this._wheel=!0,this._wheelY=0,this.userEvents.press(0,this._wheelY));clearTimeout(this._wheelTimeout);this._wheelTimeout=setTimeout(this._wheelEnd,50);var t=i.wheelDeltaY(n);t&&(this._wheelY+=t,this.userEvents.move(0,this._wheelY));n.preventDefault()},makeVirtual:function(){this.dimensions.y.makeVirtual()},virtualSize:function(n,t){this.dimensions.y.virtualSize(n,t)},height:function(){return this.dimensions.y.size},scrollHeight:function(){return this.scrollElement[0].scrollHeight},scrollWidth:function(){return this.scrollElement[0].scrollWidth},options:{name:"Scroller",zoom:!1,pullOffset:140,visibleScrollHints:!1,elastic:!0,useNative:!1,mousewheelScrolling:!0,avoidScrolling:function(){return!1},pullToRefresh:!1,messages:{pullTemplate:"Pull to refresh",releaseTemplate:"Release to refresh",refreshTemplate:"Refreshing"}},events:["pull",k,"resize"],_resize:function(){this._native||this.contentResized()},setOptions:function(n){var t=this;o.fn.setOptions.call(t,n);n.pullToRefresh&&t._initPullToRefresh()},reset:function(){this._native?this.scrollElement.scrollTop(0):(this.movable.moveTo({x:0,y:0}),this._scale(1))},contentResized:function(){this.dimensions.refresh();this.pane.x.outOfBounds()&&this.movable.moveAxis("x",this.dimensions.x.min);this.pane.y.outOfBounds()&&this.movable.moveAxis("y",this.dimensions.y.min)},zoomOut:function(){var n=this.dimensions;n.refresh();this._scale(n.fitScale);this.movable.moveTo(n.centerCoordinates())},enable:function(){this.enabled=!0},disable:function(){this.enabled=!1},scrollTo:function(n,t){this._native?(this.scrollElement.scrollLeft(u(n)),this.scrollElement.scrollTop(u(t))):(this.dimensions.refresh(),this.movable.moveTo({x:n,y:t}))},animatedScrollTo:function(n,t,i){var r,u;this._native?this.scrollTo(n,t):(r={x:this.movable.x,y:this.movable.y},u={x:n,y:t},this.animatedScroller.setCoordinates(r,u),this.animatedScroller.setCallback(i),this.animatedScroller.start())},pullHandled:function(){var n=this;n.refreshHint.removeClass(c);n.hintContainer.html(n.pullTemplate({}));n.yinertia.onEnd();n.xinertia.onEnd();n.userEvents.cancel()},destroy:function(){o.fn.destroy.call(this);this.userEvents&&this.userEvents.destroy()},_scale:function(n){this.dimensions.rescale(n);this.movable.scaleTo(n)},_initPullToRefresh:function(){var n=this;n.dimensions.y.forceEnabled();n.pullTemplate=i.template(n.options.messages.pullTemplate);n.releaseTemplate=i.template(n.options.messages.releaseTemplate);n.refreshTemplate=i.template(n.options.messages.refreshTemplate);n.scrollElement.prepend('<span class="km-scroller-pull"><span class="km-icon"><\/span><span class="km-loading-left"><\/span><span class="km-loading-right"><\/span><span class="km-template">'+n.pullTemplate({})+"<\/span><\/span>");n.refreshHint=n.scrollElement.children().first();n.hintContainer=n.refreshHint.children(".km-template");n.pane.y.bind("change",r(n._paneChange,n));n.userEvents.bind("end",r(n._dragEnd,n))},_dragEnd:function(){var n=this;n.pulled&&(n.pulled=!1,n.refreshHint.removeClass(h).addClass(c),n.hintContainer.html(n.refreshTemplate({})),n.yinertia.freeze(n.options.pullOffset/2),n.trigger("pull"))},_paneChange:function(){var n=this;n.movable.y/w>n.options.pullOffset?n.pulled||(n.pulled=!0,n.refreshHint.removeClass(c).addClass(h),n.hintContainer.html(n.releaseTemplate({}))):n.pulled&&(n.pulled=!1,n.refreshHint.removeClass(h),n.hintContainer.html(n.pullTemplate({})))},_initAxis:function(n){var t=this,u=t.movable,i=t.dimensions[n],e=t.tapCapture,f=t.pane[n],r=new ct({axis:n,movable:u,dimension:i,container:t.element,alwaysVisible:t.options.visibleScrollHints});i.bind(s,function(){r.refresh()});f.bind(s,function(){r.show()});t[n+"inertia"]=new st({axis:n,paneAxis:f,movable:u,tapCapture:e,userEvents:t.userEvents,dimension:i,elastic:t.options.elastic,friction:t.options.friction||ut,velocityMultiplier:t.options.velocityMultiplier||ft,end:function(){r.hide();t.trigger("scrollEnd",{axis:n,scrollTop:t.scrollTop,scrollLeft:t.scrollLeft})}})}});a.plugin(lt)}(window.kendo.jQuery),function(n,t){function v(n){for(var e=n.find(r("popover")),o=u.roles,t=0,f=e.length;f>t;t++)i.initWidget(e[t],{},o)}function y(n){i.triggeredByInput(n)||n.preventDefault()}function p(t){t.each(function(){i.initWidget(n(this),{},u.roles)})}var i=window.kendo,f=i.mobile,u=f.ui,c=i.attr,e=u.Widget,ct=i.ViewClone,o="init",lt='<div style="height: 100%; width: 100%; position: absolute; top: 0; left: 0; z-index: 20000; display: none" />',w="beforeShow",s="show",b="afterShow",k="beforeHide",d="transitionEnd",g="transitionStart",h="hide",nt="destroy",tt=i.attrValue,r=i.roleSelector,it=i.directiveSelector,l=i.compileMobileDirective,at=e.extend({init:function(t,i){e.fn.init.call(this,t,i);this.params={};n.extend(this,i);this.transition=this.transition||this.defaultTransition;this._id();this.options.$angular?this._overlay():(this._layout(),this._overlay(),this._scroller(),this._model())},events:[o,w,s,b,k,h,nt,g,d],options:{name:"View",title:"",layout:null,getLayout:n.noop,reload:!1,transition:"",defaultTransition:"",useNativeScrolling:!1,stretch:!1,zoom:!1,model:null,modelScope:window,scroller:{},initWidgets:!0},enable:function(n){t===n&&(n=!0);n?this.overlay.hide():this.overlay.show()},destroy:function(){this.layout&&this.layout.detach(this);this.trigger(nt);e.fn.destroy.call(this);this.scroller&&this.scroller.destroy();this.options.$angular&&this.element.scope().$destroy();i.destroy(this.element)},purge:function(){this.destroy();this.element.remove()},triggerBeforeShow:function(){return this.trigger(w,{view:this})?!1:!0},showStart:function(){var n=this.element;n.css("display","");this.inited?this._invokeNgController():(this.inited=!0,this.trigger(o,{view:this}));this.layout&&this.layout.attach(this);this._padIfNativeScrolling();this.trigger(s,{view:this});i.resize(n)},showEnd:function(){this.trigger(b,{view:this});this._padIfNativeScrolling()},hideStart:function(){this.trigger(k,{view:this})},hideEnd:function(){var n=this;n.element.hide();n.trigger(h,{view:n});n.layout&&n.layout.trigger(h,{view:n,layout:n.layout})},beforeTransition:function(n){this.trigger(g,{type:n})},afterTransition:function(n){this.trigger(d,{type:n})},_padIfNativeScrolling:function(){if(f.appLevelNativeScrolling()){var t=i.support.mobileOS&&i.support.mobileOS.android,n=f.application.skin()||"",r=f.application.os.android||n.indexOf("android")>-1,u="flat"===n||n.indexOf("material")>-1,e=!t&&!r||u?"header":"footer",o=!t&&!r||u?"footer":"header";this.content.css({paddingTop:this[e].height(),paddingBottom:this[o].height()})}},contentElement:function(){var n=this;return n.options.stretch?n.content:n.scrollerContent},clone:function(){return new ct(this)},_scroller:function(){var t=this;f.appLevelNativeScrolling()||(t.options.stretch?t.content.addClass("km-stretched-view"):(t.content.kendoMobileScroller(n.extend(t.options.scroller,{zoom:t.options.zoom,useNative:t.options.useNativeScrolling})),t.scroller=t.content.data("kendoMobileScroller"),t.scrollerContent=t.scroller.scrollElement),i.support.kineticScrollNeeded&&(n(t.element).on("touchmove",".km-header",y),t.options.useNativeScrolling||n(t.element).on("touchmove",".km-content",y)))},_model:function(){var n=this,r=n.element,t=n.options.model;"string"==typeof t&&(t=i.getter(t)(n.options.modelScope));n.model=t;v(r);n.element.css("display","");n.options.initWidgets&&(t?i.bind(r,t,u,i.ui,i.dataviz.ui):f.init(r.children()));n.element.css("display","none")},_id:function(){var n=this.element,t=n.attr("id")||"";this.id=tt(n,"url")||"#"+t;"#"==this.id&&(this.id=i.guid(),n.attr("id",this.id))},_layout:function(){var t=r("content"),n=this.element;n.addClass("km-view");this.header=n.children(r("header")).addClass("km-header");this.footer=n.children(r("footer")).addClass("km-footer");n.children(t)[0]||n.wrapInner("<div "+c("role")+'="content"><\/div>');this.content=n.children(r("content")).addClass("km-content");this.element.prepend(this.header).append(this.footer);this.layout=this.options.getLayout(this.layout);this.layout&&this.layout.setup(this)},_overlay:function(){this.overlay=n(lt).appendTo(this.element)},_invokeNgController:function(){var i,t,r;this.options.$angular&&(i=this.element.controller(),t=this.element.scope(),i&&(r=n.proxy(this,"_callController",i,t),/^\$(digest|apply)$/.test(t.$$phase)?r():t.$apply(r)))},_callController:function(n,t){this.element.injector().invoke(n.constructor,n,{$scope:t})}}),vt=e.extend({init:function(n,t){e.fn.init.call(this,n,t);n=this.element;this.header=n.children(this._locate("header")).addClass("km-header");this.footer=n.children(this._locate("footer")).addClass("km-footer");this.elements=this.header.add(this.footer);v(n);this.options.$angular||i.mobile.init(this.element.children());this.element.detach();this.trigger(o,{layout:this})},_locate:function(n){return this.options.$angular?it(n):r(n)},options:{name:"Layout",id:null,platform:null},events:[o,s,h],setup:function(n){n.header[0]||(n.header=this.header);n.footer[0]||(n.footer=this.footer)},detach:function(n){var t=this;n.header===t.header&&t.header[0]&&n.element.prepend(t.header.detach()[0].cloneNode(!0));n.footer===t.footer&&t.footer.length&&n.element.append(t.footer.detach()[0].cloneNode(!0))},attach:function(n){var t=this,i=t.currentView;i&&t.detach(i);n.header===t.header&&(t.header.detach(),n.element.children(r("header")).remove(),n.element.prepend(t.header));n.footer===t.footer&&(t.footer.detach(),n.element.children(r("footer")).remove(),n.element.append(t.footer));t.trigger(s,{layout:t,view:n});t.currentView=n}}),rt=i.Observable,yt=/<body[^>]*>(([\u000a\u000d\u2028\u2029]|.)*)<\/body>/i,ut="loadStart",ft="loadComplete",et="showStart",ot="sameViewRequested",st="viewShow",ht="viewTypeDetermined",a="after",pt=rt.extend({init:function(t){var e,o,u,f,r=this;if(rt.fn.init.call(r),n.extend(r,t),r.sandbox=n("<div />"),u=r.container,e=r._hideViews(u),r.rootView=e.first(),!r.rootView[0]&&t.rootNeeded)throw o=u[0]==i.mobile.application.element[0]?'Your kendo mobile application element does not contain any direct child elements with data-role="view" attribute set. Make sure that you instantiate the mobile application using the correct container.':'Your pane element does not contain any direct child elements with data-role="view" attribute set.',Error(o);r.layouts={};r.viewContainer=new i.ViewContainer(r.container);r.viewContainer.bind("accepted",function(n){n.view.params=r.params});r.viewContainer.bind("complete",function(n){r.trigger(st,{view:n.view})});r.viewContainer.bind(a,function(){r.trigger(a)});this.getLayoutProxy=n.proxy(this,"_getLayout");r._setupLayouts(u);f=u.children(r._locate("modalview drawer"));r.$angular?f.each(function(t,i){l(n(i),function(){})}):p(f);this.bind(this.events,t)},events:[et,a,st,ut,ft,ot,ht],destroy:function(){i.destroy(this.container);for(var n in this.layouts)this.layouts[n].destroy()},view:function(){return this.viewContainer.view},showView:function(n,t,r){if(n=n.replace(RegExp("^"+this.remoteViewURLPrefix),""),""===n&&this.remoteViewURLPrefix&&(n="/"),n.replace(/^#/,"")===this.url)return this.trigger(ot),!1;this.trigger(et);var u=this,o=function(i){return u.viewContainer.show(i,t,n)},e=u._findViewElement(n),f=i.widgetInstance(e);return u.url=n.replace(/^#/,""),u.params=r,f&&f.reload&&(f.purge(),e=[]),this.trigger(ht,{remote:0===e.length,url:n}),e[0]?(f||(f=u._createView(e)),o(f)):(this.serverNavigation?location.href=n:u._loadView(n,o),!0)},append:function(n,t){var u,f,r,i=this.sandbox,e=(t||"").split("?")[0],o=this.container;return yt.test(n)&&(n=RegExp.$1),i[0].innerHTML=n,o.append(i.children("script, style")),u=this._hideViews(i),r=u.first(),r.length||(u=r=i.wrapInner("<div data-role=view />").children()),e&&r.hide().attr(c("url"),e),this._setupLayouts(i),f=i.children(this._locate("modalview drawer")),o.append(i.children(this._locate("layout modalview drawer")).add(u)),p(f),this._createView(r)},_locate:function(n){return this.$angular?it(n):r(n)},_findViewElement:function(n){var i,t=n.split("?")[0];return t?(i=this.container.children("["+c("url")+"='"+t+"']"),i[0]||-1!==t.indexOf("/")||(i=this.container.children("#"===t.charAt(0)?t:"#"+t)),i):this.rootView},_createView:function(n){if(this.$angular){var t=this;return l(n,function(n){n.viewOptions={defaultTransition:t.transition,loader:t.loader,container:t.container,getLayout:t.getLayoutProxy}})}return i.initWidget(n,{defaultTransition:this.transition,loader:this.loader,container:this.container,getLayout:this.getLayoutProxy,modelScope:this.modelScope,reload:tt(n,"reload")},u.roles)},_getLayout:function(n){return""===n?null:n?this.layouts[n]:this.layouts[this.layout]},_loadView:function(t,r){this._xhr&&this._xhr.abort();this.trigger(ut);this._xhr=n.get(i.absoluteURL(t,this.remoteViewURLPrefix),"html").always(n.proxy(this,"_xhrComplete",r,t))},_xhrComplete:function(n,t,i){var r=!0;if("object"==typeof i&&0===i.status){if(!(i.responseText&&i.responseText.length>0))return;r=!0;i=i.responseText}this.trigger(ft);r&&n(this.append(i,t))},_hideViews:function(n){return n.children(this._locate("view splitview")).hide()},_setupLayouts:function(t){var r,e=this;t.children(e._locate("layout")).each(function(){r=e.$angular?l(n(this)):i.initWidget(n(this),{},u.roles);var t=r.options.platform;t&&t!==f.application.os.name?r.destroy():e.layouts[r.options.id]=r})}});i.mobile.ViewEngine=pt;u.plugin(at);u.plugin(vt)}(window.kendo.jQuery),function(n){var t=window.kendo,i=t.mobile.ui,r=i.Widget,u=n.map(t.eventMap,function(n){return n}).join(" ").split(" "),f=r.extend({init:function(t,i){var u=this,f=n('<div class="km-loader"><span class="km-loading km-spin"><\/span><span class="km-loading-left"><\/span><span class="km-loading-right"><\/span><\/div>');r.fn.init.call(u,f,i);u.container=t;u.captureEvents=!1;u._attachCapture();f.append(u.options.loading).hide().appendTo(t)},options:{name:"Loader",loading:"<h1>Loading...<\/h1>",timeout:100},show:function(){var n=this;clearTimeout(n._loading);n.options.loading!==!1&&(n.captureEvents=!0,n._loading=setTimeout(function(){n.element.show()},n.options.timeout))},hide:function(){this.captureEvents=!1;clearTimeout(this._loading);this.element.hide()},changeMessage:function(n){this.options.loading=n;this.element.find(">h1").html(n)},transition:function(){this.captureEvents=!0;this.container.css("pointer-events","none")},transitionDone:function(){this.captureEvents=!1;this.container.css("pointer-events","")},_attachCapture:function(){function i(n){t.captureEvents&&n.preventDefault()}var n,t=this;for(t.captureEvents=!1,n=0;u.length>n;n++)t.container[0].addEventListener(u[n],i,!0)}});i.plugin(f)}(window.kendo.jQuery),function(n,t){var i=window.kendo,f=i.mobile,r=i.roleSelector,u=f.ui,o=u.Widget,g=f.ViewEngine,a=u.View,nt=f.ui.Loader,v="external",s="href",y="#!",p="navigate",w="viewShow",h="sameViewRequested",c=i.support.mobileOS,b=c.ios&&!c.appMode&&c.flatVersion>=700,tt=/popover|actionsheet|modalview|drawer/,it="#:back",e=i.attrValue,k="button backbutton detailbutton listview-link",d="tab",l=o.extend({init:function(n,t){var r=this;o.fn.init.call(r,n,t);t=r.options;n=r.element;n.addClass("km-pane");r.options.collapsible&&n.addClass("km-collapsible-pane");this.history=[];this.historyCallback=function(n,t,i){var u=r.transition;return r.transition=null,b&&i&&(u="none"),r.viewEngine.showView(n,u,t)};this._historyNavigate=function(n){if(n===it){if(1===r.history.length)return;r.history.pop();n=r.history[r.history.length-1]}else r.history.push(n);r.historyCallback(n,i.parseQueryStringParams(n))};this._historyReplace=function(n){var t=i.parseQueryStringParams(n);r.history[r.history.length-1]=n;r.historyCallback(n,t)};r.loader=new nt(n,{loading:r.options.loading});r.viewEngine=new g({container:n,transition:t.transition,modelScope:t.modelScope,rootNeeded:!t.initial,serverNavigation:t.serverNavigation,remoteViewURLPrefix:t.root||"",layout:t.layout,$angular:t.$angular,loader:r.loader,showStart:function(){r.loader.transition();r.closeActiveDialogs()},after:function(){r.loader.transitionDone()},viewShow:function(n){r.trigger(w,n)},loadStart:function(){r.loader.show()},loadComplete:function(){r.loader.hide()},sameViewRequested:function(){r.trigger(h)},viewTypeDetermined:function(n){n.remote&&r.options.serverNavigation||r.trigger(p,{url:n.url})}});this._setPortraitWidth();i.onResize(function(){r._setPortraitWidth()});r._setupAppLinks()},closeActiveDialogs:function(){var t=this.element.find(r("actionsheet popover modalview")).filter(":visible");t.each(function(){i.widgetInstance(n(this),u).close()})},navigateToInitial:function(){var n=this.options.initial;n&&this.navigate(n)},options:{name:"Pane",portraitWidth:"",transition:"",layout:"",collapsible:!1,initial:null,modelScope:window,loading:"<h1>Loading...<\/h1>"},events:[p,w,h],append:function(n){return this.viewEngine.append(n)},destroy:function(){o.fn.destroy.call(this);this.viewEngine.destroy();this.userEvents.destroy()},navigate:function(n,t){n instanceof a&&(n=n.id);this.transition=t;this._historyNavigate(n)},replace:function(n,t){n instanceof a&&(n=n.id);this.transition=t;this._historyReplace(n)},bindToRouter:function(n){var t=this,r=this.history,u=this.viewEngine;n.bind("init",function(t){var f,e=t.url,o=n.pushState?e:"/";u.rootView.attr(i.attr("url"),o);f=r.length;"/"===e&&f&&(n.navigate(r[f-1],!0),t.preventDefault())});n.bind("routeMissing",function(n){t.historyCallback(n.url,n.params,n.backButtonPressed)||n.preventDefault()});n.bind("same",function(){t.trigger(h)});t._historyNavigate=function(t){n.navigate(t)};t._historyReplace=function(t){n.replace(t)}},hideLoading:function(){this.loader.hide()},showLoading:function(){this.loader.show()},changeLoadingMessage:function(n){this.loader.changeMessage(n)},view:function(){return this.viewEngine.view()},_setPortraitWidth:function(){var n,t=this.options.portraitWidth;t&&(n=i.mobile.application.element.is(".km-vertical")?t:"auto",this.element.css("width",n))},_setupAppLinks:function(){var n=this;this.element.handler(this).on("down",r(d),"_mouseup").on("click",r(d+" "+k),"_appLinkClick");this.userEvents=new i.UserEvents(this.element,{filter:r(k),tap:function(t){t.event.currentTarget=t.touch.currentTarget;n._mouseup(t.event)}});this.element.css("-ms-touch-action","")},_appLinkClick:function(t){var i=n(t.currentTarget).attr("href"),r=i&&"#"!==i[0]&&this.options.serverNavigation;r||e(n(t.currentTarget),"rel")==v||t.preventDefault()},_mouseup:function(r){if(!(r.which>1||r.isDefaultPrevented())){var l=this,o=n(r.currentTarget),p=e(o,"transition"),c=e(o,"rel")||"",a=e(o,"target"),h=o.attr(s),w=b&&0===o[0].offsetHeight,k=h&&"#"!==h[0]&&this.options.serverNavigation;w||k||c===v||t===h||h===y||(o.attr(s,y),setTimeout(function(){o.attr(s,h)}),c.match(tt)?(i.widgetInstance(n(h),u).openFor(o),("actionsheet"===c||"drawer"===c)&&r.stopPropagation()):("_top"===a?l=f.application.pane:a&&(l=n("#"+a).data("kendoMobilePane")),l.navigate(h,p)),r.preventDefault())}}});l.wrap=function(n){n.is(r("view"))||(n=n.wrap("<div data-"+i.ns+'role="view" data-stretch="true"><\/div>').parent());var u=n.wrap('<div class="km-pane-wrapper"><div><\/div><\/div>').parent(),t=new l(u);return t.navigate(""),t};u.plugin(l)}(window.kendo.jQuery),function(n){var r=window.kendo,s=r.mobile,i=s.ui,u="hide",f="open",e="close",h='<div class="km-popup-wrapper" />',c='<div class="km-popup-arrow" />',l='<div class="km-popup-overlay" />',a="km-up km-down km-left km-right",t=i.Widget,v={down:{origin:"bottom center",position:"top center"},up:{origin:"top center",position:"bottom center"},left:{origin:"center left",position:"center right",collision:"fit flip"},right:{origin:"center right",position:"center left",collision:"fit flip"}},y={animation:{open:{effects:"fade:in",duration:0},close:{effects:"fade:out",duration:400}}},p={horizontal:{offset:"top",size:"height"},vertical:{offset:"left",size:"width"}},w={up:"down",down:"up",left:"right",right:"left"},o=t.extend({init:function(i,f){var a,w,e=this,b=i.closest(".km-modalview-wrapper"),o=i.closest(".km-root").children(".km-pane").first(),s=b[0]?b:o;f.viewport?o=f.viewport:o[0]||(o=window);f.container?s=f.container:s[0]||(s=document.body);a={viewport:o,copyAnchorStyles:!1,autosize:!0,open:function(){e.overlay.show()},activate:n.proxy(e._activate,e),deactivate:function(){e.overlay.hide();e._apiCall||e.trigger(u);e._apiCall=!1}};t.fn.init.call(e,i,f);i=e.element;f=e.options;i.wrap(h).addClass("km-popup").show();w=e.options.direction.match(/left|right/)?"horizontal":"vertical";e.dimensions=p[w];e.wrapper=i.parent().css({width:f.width,height:f.height}).addClass("km-popup-wrapper km-"+f.direction).hide();e.arrow=n(c).prependTo(e.wrapper).hide();e.overlay=n(l).appendTo(s).hide();a.appendTo=e.overlay;f.className&&e.overlay.addClass(f.className);e.popup=new r.ui.Popup(e.wrapper,n.extend(!0,a,y,v[f.direction]))},options:{name:"Popup",width:240,height:"",direction:"down",container:null,viewport:null},events:[u],show:function(t){this.popup.options.anchor=n(t);this.popup.open()},hide:function(){this._apiCall=!0;this.popup.close()},destroy:function(){t.fn.destroy.call(this);this.popup.destroy();this.overlay.remove()},target:function(){return this.popup.options.anchor},_activate:function(){var t=this,e=t.options.direction,i=t.dimensions,u=i.offset,f=t.popup,o=f.options.anchor,c=n(o).offset(),l=n(f.element).offset(),v=f.flipped?w[e]:e,s=2*t.arrow[i.size](),h=t.element[i.size]()-t.arrow[i.size](),y=n(o)[i.size](),r=c[u]-l[u]+y/2;s>r&&(r=s);r>h&&(r=h);t.wrapper.removeClass(a).addClass("km-"+v);t.arrow.css(u,r).show()}}),b=t.extend({init:function(u,f){var h,s=this;s.initialOpen=!1;t.fn.init.call(s,u,f);h=n.extend({className:"km-popover-root",hide:function(){s.trigger(e)}},this.options.popup);s.popup=new o(s.element,h);s.popup.overlay.on("move",function(n){n.target==s.popup.overlay[0]&&n.preventDefault()});s.pane=new i.Pane(s.element,n.extend(this.options.pane,{$angular:this.options.$angular}));s.pane.navigateToInitial();r.notify(s,i)},options:{name:"PopOver",popup:{},pane:{}},events:[f,e],open:function(n){this.popup.show(n);this.initialOpen?this.pane.view()._invokeNgController():(this.pane.navigate(""),this.popup.popup._position(),this.initialOpen=!0)},openFor:function(n){this.open(n);this.trigger(f,{target:this.popup.target()})},close:function(){this.popup.hide()},destroy:function(){t.fn.destroy.call(this);this.pane.destroy();this.popup.destroy();r.destroy(this.element)}});i.plugin(o);i.plugin(b)}(window.kendo.jQuery),function(n,t){var i=window.kendo,u=i.mobile.ui,e=i.ui.Popup,o='<div class="km-shim"/>',f="hide",r=u.Widget,s=r.extend({init:function(t,u){var s=this,h=i.mobile.application,y=i.support.mobileOS,l=h?h.os.name:y?y.name:"ios",a="ios"===l||"wp"===l||(h?h.os.skin:!1),v="blackberry"===l,p=u.align||(a?"bottom center":v?"center right":"center center"),w=u.position||(a?"bottom center":v?"center right":"center center"),b=u.effect||(a?"slideIn:up":v?"slideIn:left":"fade:in"),c=n(o).handler(s).hide();r.fn.init.call(s,t,u);s.shim=c;t=s.element;u=s.options;u.className&&s.shim.addClass(u.className);u.modal||s.shim.on("up","_hide");(h?h.element:n(document.body)).append(c);s.popup=new e(s.element,{anchor:c,modal:!0,appendTo:c,origin:p,position:w,animation:{open:{effects:b,duration:u.duration},close:{duration:u.duration}},close:function(n){var t=!1;s._apiCall||(t=s.trigger(f));t&&n.preventDefault();s._apiCall=!1},deactivate:function(){c.hide()},open:function(){c.show()}});i.notify(s)},events:[f],options:{name:"Shim",modal:!1,align:t,position:t,effect:t,duration:200},show:function(){this.popup.open()},hide:function(){this._apiCall=!0;this.popup.close()},destroy:function(){r.fn.destroy.call(this);this.shim.kendoDestroy();this.popup.destroy();this.shim.remove()},_hide:function(t){t&&n.contains(this.shim.children().children(".k-popup")[0],t.target)||this.popup.close()}});u.plugin(s)}(window.kendo.jQuery),function(n){var o=window.kendo,t=o.mobile.ui,s=t.Shim,r=t.Widget,u="beforeOpen",f="open",i="close",e="init",h='<div class="km-modalview-wrapper" />',c=t.View.extend({init:function(n,t){var i=this;r.fn.init.call(i,n,t);i._id();i._wrap();i._shim();this.options.$angular||(i._layout(),i._scroller(),i._model());i.element.css("display","");i.trigger(e)},events:[e,u,f,i],options:{name:"ModalView",modal:!0,width:null,height:null},destroy:function(){r.fn.destroy.call(this);this.shim.destroy()},open:function(t){var i=this;i.target=n(t);i.shim.show();i._invokeNgController();i.trigger("show",{view:i})},openFor:function(n){this.trigger(u,{target:n})||(this.open(n),this.trigger(f,{target:n}))},close:function(){this.element.is(":visible")&&!this.trigger(i)&&this.shim.hide()},_wrap:function(){var r,t,i=this,n=i.element,u=i.options;r=n[0].style.width||"auto";t=n[0].style.height||"auto";n.addClass("km-modalview").wrap(h);i.wrapper=n.parent().css({width:u.width||r||300,height:u.height||t||300}).addClass("auto"==t?" km-auto-height":"");n.css({width:"",height:""})},_shim:function(){var n=this;n.shim=new s(n.wrapper,{modal:n.options.modal,position:"center center",align:"center center",effect:"fade:in",className:"km-modalview-root",hide:function(t){n.trigger(i)&&t.preventDefault()}})}});t.plugin(c)}(window.kendo.jQuery),function(n,t){var i=window.kendo,o=i.mobile,f=i.support.mobileOS,s=i.effects.Transition,h=i.roleSelector,u="x",e=o.ui,p=!(f.ios&&7==f.majorVersion&&!f.appMode),c="beforeShow",l="init",a="show",v="hide",y="afterHide",w={enable:n.noop},r=e.View.extend({init:function(t,r){var s,f,e,u,c;if(n(t).parent().prepend(t),o.ui.Widget.fn.init.call(this,t,r),this.options.$angular||(this._layout(),this._scroller()),this._model(),s=this.element.closest(h("pane")).data("kendoMobilePane"))this.pane=s,this.pane.bind("viewShow",function(n){u._viewShow(n)}),this.pane.bind("sameViewRequested",function(){u.hide()}),f=this.userEvents=new i.UserEvents(s.element,{filter:h("view splitview"),allowSelection:!0});else{if(this.currentView=w,e=n(this.options.container),!e)throw Error("The drawer needs a container configuration option set.");f=this.userEvents=new i.UserEvents(e,{allowSelection:!0});this._attachTransition(e)}u=this;c=function(n){u.visible&&(u.hide(),n.preventDefault())};this.options.swipeToOpen&&p?(f.bind("press",function(){u.transition.cancel()}),f.bind("start",function(n){u._start(n)}),f.bind("move",function(n){u._update(n)}),f.bind("end",function(n){u._end(n)}),f.bind("tap",c)):f.bind("press",c);this.leftPositioned="left"===this.options.position;this.visible=!1;this.element.hide().addClass("km-drawer").addClass(this.leftPositioned?"km-left-drawer":"km-right-drawer");this.trigger(l)},options:{name:"Drawer",position:"left",views:[],swipeToOpenViews:[],swipeToOpen:!0,title:"",container:null},events:[c,v,y,l,a],show:function(){this._activate()&&this._show()},hide:function(){this.currentView&&(this.currentView.enable(),r.current=null,this._moveViewTo(0),this.trigger(v,{view:this}))},openFor:function(){this.visible?this.hide():this.show()},destroy:function(){e.View.fn.destroy.call(this);this.userEvents.destroy()},_activate:function(){if(this.visible)return!0;var n=this._currentViewIncludedIn(this.options.views);return!n||this.trigger(c,{view:this})?!1:(this._setAsCurrent(),this.element.show(),this.trigger(a,{view:this}),this._invokeNgController(),!0)},_currentViewIncludedIn:function(t){if(!this.pane||!t.length)return!0;var i=this.pane.view();return n.inArray(i.id.replace("#",""),t)>-1||n.inArray(i.element.attr("id"),t)>-1},_show:function(){this.currentView.enable(!1);this.visible=!0;var n=this.element.width();this.leftPositioned||(n=-n);this._moveViewTo(n)},_setAsCurrent:function(){r.last!==this&&(r.last&&r.last.element.hide(),this.element.show());r.last=this;r.current=this},_moveViewTo:function(n){this.userEvents.cancel();this.transition.moveTo({location:n,duration:400,ease:s.easeOutExpo})},_viewShow:function(n){return this.currentView&&this.currentView.enable(),this.currentView===n.view?(this.hide(),t):(this.currentView=n.view,this._attachTransition(n.view.element),t)},_attachTransition:function(n){var t=this,r=this.movable,f=r&&r.x;this.transition&&(this.transition.cancel(),this.movable.moveAxis("x",0));r=this.movable=new i.ui.Movable(n);this.transition=new s({axis:u,movable:this.movable,onEnd:function(){0===r[u]&&(n[0].style.cssText="",t.element.hide(),t.trigger(y),t.visible=!1)}});f&&(n.addClass("k-fx-hidden"),i.animationFrame(function(){n.removeClass("k-fx-hidden");t.movable.moveAxis(u,f);t.hide()}))},_start:function(n){var u,f,s,h,e,o=n.sender;return Math.abs(n.x.velocity)<Math.abs(n.y.velocity)||i.triggeredByInput(n.event)||!this._currentViewIncludedIn(this.options.swipeToOpenViews)?(o.cancel(),t):(u=this.leftPositioned,f=this.visible,s=u&&f||!u&&!r.current,h=!u&&f||u&&!r.current,e=0>n.x.velocity,(s&&e||h&&!e)&&this._activate()?(o.capture(),t):(o.cancel(),t))},_update:function(n){var t,r=this.movable,i=r.x+n.x.delta;t=this.leftPositioned?Math.min(Math.max(0,i),this.element.width()):Math.max(Math.min(0,i),-this.element.width());this.movable.moveAxis(u,t);n.event.preventDefault();n.event.stopPropagation()},_end:function(n){var r,t=n.x.velocity,u=Math.abs(this.movable.x)>this.element.width()/2,i=.8;r=this.leftPositioned?t>-i&&(t>i||u):i>t&&(-i>t||u);r?this._show():this.hide()}});e.plugin(r)}(window.kendo.jQuery),function(n){var t=window.kendo,i=t.mobile.ui,r=i.Widget,u="<div class='km-expanded-pane-shim' />",f=i.View,e=f.extend({init:function(f,e){var s,h,o=this;r.fn.init.call(o,f,e);f=o.element;n.extend(o,e);o._id();o.options.$angular?o._overlay():(o._layout(),o._overlay());o._style();h=f.children(o._locate("modalview"));o.options.$angular?h.each(function(i,r){t.compileMobileDirective(n(r))}):t.mobile.init(h);o.panes=[];o._paramsHistory=[];o.options.$angular?o.element.children(t.directiveSelector("pane")).each(function(){s=t.compileMobileDirective(n(this));o.panes.push(s)}):o.content.children(t.roleSelector("pane")).each(function(){s=t.initWidget(this,{},i.roles);o.panes.push(s)});o.expandedPaneShim=n(u).appendTo(o.element);o._shimUserEvents=new t.UserEvents(o.expandedPaneShim,{tap:function(){o.collapsePanes()}})},_locate:function(n){return this.options.$angular?t.directiveSelector(n):t.roleSelector(n)},options:{name:"SplitView",style:"horizontal"},expandPanes:function(){this.element.addClass("km-expanded-splitview")},collapsePanes:function(){this.element.removeClass("km-expanded-splitview")},_layout:function(){var n=this,i=n.element;n.transition=t.attrValue(i,"transition");t.mobile.ui.View.prototype._layout.call(this);t.mobile.init(this.header.add(this.footer));n.element.addClass("km-splitview");n.content.addClass("km-split-content")},_style:function(){var t,i=this.options.style,r=this.element;i&&(t=i.split(" "),n.each(t,function(){r.addClass("km-split-"+this)}))},showStart:function(){var t=this;t.element.css("display","");t.inited||(t.inited=!0,n.each(t.panes,function(){this.options.initial?this.navigateToInitial():this.navigate("")}),t.trigger("init",{view:t}));t.trigger("show",{view:t})}});i.plugin(e)}(window.kendo.jQuery),function(n,t){function tt(n,t){var r=[];return i&&r.push("km-on-"+i.name),r.push(n.skin?"km-"+n.skin:"ios"==n.name&&n.majorVersion>6?"km-ios7":"km-"+n.name),("ios"==n.name&&7>n.majorVersion||"ios"!=n.name)&&r.push("km-"+n.name+n.majorVersion),r.push("km-"+n.majorVersion),r.push("km-m"+(n.minorVersion?n.minorVersion[0]:0)),n.variant&&(n.skin&&n.skin===n.name||!n.skin||n.setDefaultPlatform===!1)&&r.push("km-"+(n.skin?n.skin:n.name)+"-"+n.variant),n.cordova&&r.push("km-cordova"),r.push(n.appMode?"km-app":"km-web"),t&&t.statusBarStyle&&r.push("km-"+t.statusBarStyle+"-status-bar"),r.join(" ")}function it(t){return"km-wp-"+(t.noVariantSet?0===parseInt(n("<div style='background: Background' />").css("background-color").split(",")[1],10)?"dark":"light":t.variant+" km-wp-"+t.variant+"-force")}function h(n){return i.wp?"-kendo-landscape"==n.css("animation-name"):Math.abs(window.orientation)/90==1}function y(n){return h(n)?et:ft}function p(n){n.parent().addBack().css("min-height",window.innerHeight)}function w(){n("meta[name=viewport]").remove();e.append(d({height:", width=device-width"+(h()?", height="+window.innerHeight+"px":f.mobileOS.flatVersion>=600&&700>f.mobileOS.flatVersion?", height="+window.innerWidth+"px":", height=device-height")}))}var r=window.kendo,c=r.mobile,f=r.support,l=c.ui.Widget,rt=c.ui.Pane,ut="ios7",i=f.mobileOS,a="blackberry"==i.device&&i.flatVersion>=600&&1e3>i.flatVersion&&i.appMode,ft="km-vertical",v="chrome"===i.browser,b=i.ios&&i.flatVersion>=700&&800>i.flatVersion&&(i.appMode||v),o=Math.abs(window.orientation)/90==1,et="km-horizontal",k={ios7:{ios:!0,browser:"default",device:"iphone",flatVersion:"700",majorVersion:"7",minorVersion:"0.0",name:"ios",tablet:!1},ios:{ios:!0,browser:"default",device:"iphone",flatVersion:"612",majorVersion:"6",minorVersion:"1.2",name:"ios",tablet:!1},android:{android:!0,browser:"default",device:"android",flatVersion:"442",majorVersion:"4",minorVersion:"4.2",name:"android",tablet:!1},blackberry:{blackberry:!0,browser:"default",device:"blackberry",flatVersion:"710",majorVersion:"7",minorVersion:"1.0",name:"blackberry",tablet:!1},meego:{meego:!0,browser:"default",device:"meego",flatVersion:"850",majorVersion:"8",minorVersion:"5.0",name:"meego",tablet:!1},wp:{wp:!0,browser:"default",device:"wp",flatVersion:"800",majorVersion:"8",minorVersion:"0.0",name:"wp",tablet:!1}},d=r.template('<meta content="initial-scale=1.0, maximum-scale=1.0, user-scalable=no#=data.height#" name="viewport" />',{usedWithBlock:!1}),ot=r.template('<meta name="apple-mobile-web-app-capable" content="#= data.webAppCapable === false ? \'no\' : \'yes\' #" /> <meta name="apple-mobile-web-app-status-bar-style" content="#=data.statusBarStyle#" /> <meta name="msapplication-tap-highlight" content="no" /> ',{usedWithBlock:!1}),st=r.template("<style>.km-view { clip: rect(0 #= data.width #px #= data.height #px 0); }<\/style>",{usedWithBlock:!1}),ht=i.android&&"chrome"!=i.browser||i.blackberry,ct=d({height:""}),lt=r.template('<link rel="apple-touch-icon'+(i.android?"-precomposed":"")+'" # if(data.size) { # sizes="#=data.size#" #}# href="#=data.icon#" />',{usedWithBlock:!1}),at=("iphone"==i.device||"ipod"==i.device)&&7>i.majorVersion,vt=("iphone"==i.device||"ipod"==i.device)&&i.majorVersion>=7,yt=vt?"none":null,pt="mobilesafari"==i.browser?60:0,s=20,wt=n(window),u=window.screen,e=n("head"),g="init",bt=n.proxy,nt=l.extend({init:function(t,i){c.application=this;n(n.proxy(this,"bootstrap",t,i))},bootstrap:function(t,i){var f,u,e;t=n(t);t[0]||(t=n(document.body));l.fn.init.call(this,t,i);this.element.removeAttr("data-"+r.ns+"role");this._setupPlatform();this._attachMeta();this._setupElementClass();this._attachHideBarHandlers();f=n.extend({},this.options);delete f.name;u=this;e=function(){u.pane=new rt(u.element,f);u.pane.navigateToInitial();u.options.updateDocumentTitle&&u._setupDocumentTitle();u._startHistory();u.trigger(g)};this.options.$angular?setTimeout(e):e()},options:{name:"Application",hideAddressBar:!0,browserHistory:!0,historyTransition:yt,modelScope:window,statusBarStyle:"black",transition:"",platform:null,skin:null,updateDocumentTitle:!0,useNativeScrolling:!1},events:[g],navigate:function(n,t){this.pane.navigate(n,t)},replace:function(n,t){this.pane.replace(n,t)},scroller:function(){return this.view().scroller},hideLoading:function(){if(!this.pane)throw Error("The mobile application instance is not fully instantiated. Please consider activating loading in the application init event handler.");this.pane.hideLoading()},showLoading:function(){if(!this.pane)throw Error("The mobile application instance is not fully instantiated. Please consider activating loading in the application init event handler.");this.pane.showLoading()},changeLoadingMessage:function(n){if(!this.pane)throw Error("The mobile application instance is not fully instantiated. Please consider changing the message in the application init event handler.");this.pane.changeLoadingMessage(n)},view:function(){return this.pane.view()},skin:function(n){var t=this;return arguments.length?(t.options.skin=n||"",t.element[0].className="km-pane",t._setupPlatform(),t._setupElementClass(),t.options.skin):t.options.skin},destroy:function(){l.fn.destroy.call(this);this.pane.destroy();this.router.destroy()},_setupPlatform:function(){var t=this,f=t.options.platform,e=t.options.skin,u=[],r=i||k[ut];f&&(r.setDefaultPlatform=!0,"string"==typeof f?(u=f.split("-"),r=n.extend({variant:u[1]},r,k[u[0]])):r=f);e&&(u=e.split("-"),i||(r.setDefaultPlatform=!1),r=n.extend({},r,{skin:u[0],variant:u[1]}));r.variant||(r.noVariantSet=!0,r.variant="dark");t.os=r;t.osCssClass=tt(t.os,t.options);"wp"==r.name&&(t.refreshBackgroundColorProxy||(t.refreshBackgroundColorProxy=n.proxy(function(){(t.os.variant&&t.os.skin&&t.os.skin===t.os.name||!t.os.skin)&&t.element.removeClass("km-wp-dark km-wp-light km-wp-dark-force km-wp-light-force").addClass(it(t.os))},t)),n(document).off("visibilitychange",t.refreshBackgroundColorProxy),n(document).off("resume",t.refreshBackgroundColorProxy),r.skin||(t.element.parent().css("overflow","hidden"),n(document).on("visibilitychange",t.refreshBackgroundColorProxy),n(document).on("resume",t.refreshBackgroundColorProxy),t.refreshBackgroundColorProxy()))},_startHistory:function(){this.options.browserHistory?(this.router=new r.Router({pushState:this.options.pushState,root:this.options.root,hashBang:this.options.hashBang}),this.pane.bindToRouter(this.router),this.router.start()):this.options.initial||this.pane.navigate("")},_resizeToScreenHeight:function(){var t,i=n("meta[name=apple-mobile-web-app-status-bar-style]").attr("content").match(/black-translucent|hidden/),r=this.element;t=v?window.innerHeight:h(r)?i?o?u.availWidth+s:u.availWidth:o?u.availWidth:u.availWidth-s:i?o?u.availHeight:u.availHeight+s:o?u.availHeight-s:u.availHeight;r.height(t)},_setupElementClass:function(){var u,i=this,t=i.element;t.parent().addClass("km-root km-"+(i.os.tablet?"tablet":"phone"));t.addClass(i.osCssClass+" "+y(t));this.options.useNativeScrolling&&t.parent().addClass("km-native-scrolling");v&&t.addClass("km-ios-chrome");f.wpDevicePixelRatio&&t.parent().css("font-size",f.wpDevicePixelRatio+"em");a&&w();i.options.useNativeScrolling?t.parent().addClass("km-native-scrolling"):ht&&(u=(screen.availWidth>screen.availHeight?screen.availWidth:screen.availHeight)+200,n(st({width:u,height:u})).appendTo(e));b&&i._resizeToScreenHeight();r.onResize(function(){t.removeClass("km-horizontal km-vertical").addClass(y(t));i.options.useNativeScrolling&&p(t);b&&i._resizeToScreenHeight();a&&w();r.resize(t)})},_clearExistingMeta:function(){e.find("meta").filter("[name|='apple-mobile-web-app'],[name|='msapplication-tap'],[name='viewport']").remove()},_attachMeta:function(){var t,i=this.options,n=i.icon;if(this._clearExistingMeta(),a||e.prepend(ct),e.prepend(ot(i)),n){"string"==typeof n&&(n={"":n});for(t in n)e.prepend(lt({icon:n[t],size:t}))}i.useNativeScrolling&&p(this.element)},_attachHideBarHandlers:function(){var n=this,t=bt(n,"_hideBar");!f.mobileOS.appMode&&n.options.hideAddressBar&&at&&!n.options.useNativeScrolling&&(n._initialHeight={},wt.on("load",t),r.onResize(function(){setTimeout(window.scrollTo,0,0,1)}))},_setupDocumentTitle:function(){var n=this,i=document.title;n.pane.bind("viewShow",function(n){var r=n.view.title;document.title=r!==t?r:i})},_hideBar:function(){var t=this,i=t.element;i.height(r.support.transforms.css+"calc(100% + "+pt+"px)");n(window).trigger(r.support.resize)}});r.mobile.Application=nt;r.ui.plugin(nt,r.mobile,"Mobile")}(window.kendo.jQuery),function(n){var t=window.kendo,h=t.support,i=t.mobile.ui,c=i.Shim,l=i.Popup,r=i.Widget,u="open",f="close",e="command",o="li>a",a="actionsheetContext",v='<div class="km-actionsheet-wrapper" />',s=t.template('<li class="km-actionsheet-cancel"><a href="\\#">#:cancel#<\/a><\/li>'),y=r.extend({init:function(u,f){var w,p,a,e=this,y=h.mobileOS;r.fn.init.call(e,u,f);f=e.options;a=f.type;u=e.element;p="auto"===a?y&&y.tablet:"tablet"===a;w=p?l:c;f.cancelTemplate&&(s=t.template(f.cancelTemplate));u.addClass("km-actionsheet").append(s({cancel:e.options.cancel})).wrap(v).on("up",o,"_click").on("click",o,t.preventDefault);e.view().bind("destroy",function(){e.destroy()});e.wrapper=u.parent().addClass(a?" km-actionsheet-"+a:"");e.shim=new w(e.wrapper,n.extend({modal:y.ios&&7>y.majorVersion,className:"km-actionsheet-root"},e.options.popup));e._closeProxy=n.proxy(e,"_close");e.shim.bind("hide",e._closeProxy);p&&t.onResize(e._closeProxy);t.notify(e,i)},events:[u,f,e],options:{name:"ActionSheet",cancel:"Cancel",type:"auto",popup:{height:"auto"}},open:function(t,i){var r=this;r.target=n(t);r.context=i;r.shim.show(t)},close:function(){this.context=this.target=null;this.shim.hide()},openFor:function(n){var t=this,i=n.data(a);t.open(n,i);t.trigger(u,{target:n,context:i})},destroy:function(){r.fn.destroy.call(this);t.unbindResize(this._closeProxy);this.shim.destroy()},_click:function(i){var u,r,f,o;i.isDefaultPrevented()||(u=n(i.currentTarget),r=u.data("action"),r&&(f={target:this.target,context:this.context},o=this.options.$angular,o?this.element.injector().get("$parse")(r)(o[0])(f):t.getter(r)(window)(f)),this.trigger(e,{target:this.target,context:this.context,currentTarget:u}),i.preventDefault(),this._close())},_close:function(n){this.trigger(f)?n.preventDefault():this.close()}});i.plugin(y)}(window.kendo.jQuery),function(n,t){function f(t,i,r){n(i.target).closest(".km-button,.km-detail").toggleClass("km-state-active",r);c&&t.deactivateTimeoutID&&(clearTimeout(t.deactivateTimeoutID),t.deactivateTimeoutID=0)}function s(t){return n('<span class="km-badge">'+t+"<\/span>")}var e=window.kendo,a=e.mobile,r=a.ui,o=r.Widget,v=e.support,h=v.mobileOS,c=h.android&&h.flatVersion>=300,l="click",u="disabled",y="km-state-disabled",i=o.extend({init:function(n,t){var i=this;o.fn.init.call(i,n,t);i._wrap();i._style();i.options.enable=i.options.enable&&!i.element.attr(u);i.enable(i.options.enable);i._userEvents=new e.UserEvents(i.element,{press:function(n){i._activate(n)},tap:function(n){i._release(n)},release:function(n){f(i,n,!1)}});c&&i.element.on("move",function(n){i._timeoutDeactivate(n)})},destroy:function(){o.fn.destroy.call(this);this._userEvents.destroy()},events:[l],options:{name:"Button",icon:"",style:"",badge:"",enable:!0},badge:function(n){var t=this.badgeElement=this.badgeElement||s(n).appendTo(this.element);return n||0===n?(t.html(n),this):n===!1?(t.empty().remove(),this.badgeElement=!1,this):t.html()},enable:function(n){var i=this.element;t===n&&(n=!0);this.options.enable=n;n?i.removeAttr(u):i.attr(u,u);i.toggleClass(y,!n)},_timeoutDeactivate:function(n){this.deactivateTimeoutID||(this.deactivateTimeoutID=setTimeout(f,500,this,n,!1))},_activate:function(n){var t=document.activeElement,i=t?t.nodeName:"";this.options.enable&&(f(this,n,!0),("INPUT"==i||"TEXTAREA"==i)&&t.blur())},_release:function(i){var r=this;if(!(i.which>1))return r.options.enable?(r.trigger(l,{target:n(i.target),button:r.element})&&i.preventDefault(),t):(i.preventDefault(),t)},_style:function(){var t,i=this.options.style,r=this.element;i&&(t=i.split(" "),n.each(t,function(){r.addClass("km-"+this)}))},_wrap:function(){var i=this,f=i.options.icon,r=i.options.badge,e='<span class="km-icon km-'+f,t=i.element.addClass("km-button"),u=t.children("span:not(.km-icon)").addClass("km-text"),o=t.find("img").addClass("km-image");!u[0]&&t.html()&&(u=t.wrapInner('<span class="km-text" />').children("span.km-text"));!o[0]&&f&&(u[0]||(e+=" km-notext"),i.iconElement=t.prepend(n(e+'" />')));(r||0===r)&&(i.badgeElement=s(r).appendTo(t))}}),p=i.extend({options:{name:"BackButton",style:"back"},init:function(n,r){var u=this;i.fn.init.call(u,n,r);t===u.element.attr("href")&&u.element.attr("href","#:back")}}),w=i.extend({options:{name:"DetailButton",style:""},init:function(n,t){i.fn.init.call(this,n,t)},_style:function(){var t,i=this.options.style+" detail",r=this.element;i&&(t=i.split(" "),n.each(t,function(){r.addClass("km-"+this)}))},_wrap:function(){var i=this,r=i.options.icon,u='<span class="km-icon km-'+r,t=i.element,f=t.children("span"),e=t.find("img").addClass("km-image");!e[0]&&r&&(f[0]||(u+=" km-notext"),t.prepend(n(u+'" />')))}});r.plugin(i);r.plugin(p);r.plugin(w)}(window.kendo.jQuery),function(n,t){function f(t){return n('<span class="km-badge">'+t+"<\/span>")}var u=window.kendo,e=u.mobile.ui,o=e.Widget,i="km-state-active",r="km-state-disabled",s="select",h="li:not(."+i+")",c=o.extend({init:function(n,t){var i=this;o.fn.init.call(i,n,t);i.element.addClass("km-buttongroup").find("li").each(i._button);i.element.on(i.options.selectOn,h,"_select");i._enable=!0;i.select(i.options.index);i.options.enable||(i._enable=!1,i.wrapper.addClass(r))},events:[s],options:{name:"ButtonGroup",selectOn:"down",index:-1,enable:!0},current:function(){return this.element.find("."+i)},select:function(u){var f=this,e=-1;u!==t&&-1!==u&&f._enable&&!n(u).is("."+r)&&(f.current().removeClass(i),"number"==typeof u?(e=u,u=n(f.element[0].children[u])):u.nodeType&&(u=n(u),e=u.index()),u.addClass(i),f.selectedIndex=e)},badge:function(t,i){var r,u=this.element;return isNaN(t)||(t=u.children().get(t)),t=u.find(t),r=n(t.children(".km-badge")[0]||f(i).appendTo(t)),i||0===i?(r.html(i),this):i===!1?(r.empty().remove(),this):r.html()},enable:function(n){var i=this.wrapper;t===n&&(n=!0);n?i.removeClass(r):i.addClass(r);this._enable=this.options.enable=n},_button:function(){var t=n(this).addClass("km-button"),e=u.attrValue(t,"icon"),i=u.attrValue(t,"badge"),r=t.children("span"),o=t.find("img").addClass("km-image");r[0]||(r=t.wrapInner("<span/>").children("span"));r.addClass("km-text");!o[0]&&e&&t.prepend(n('<span class="km-icon km-'+e+'"/>'));(i||0===i)&&f(i).appendTo(t)},_select:function(n){n.which>1||n.isDefaultPrevented()||!this._enable||(this.select(n.currentTarget),this.trigger(s,{index:this.selectedIndex}))}});e.plugin(c)}(window.kendo.jQuery),function(n,t){function ht(){return this.nodeType===vt.TEXT_NODE&&this.nodeValue.match(ti)}function f(n,t){t&&!n[0].querySelector(".km-icon")&&n.prepend('<span class="km-icon km-'+t+'"/>')}function ct(n){f(n,u(n,"icon"));f(n,u(n.children(wt),"icon"))}function lt(n){var t=n.parent(),r=n.add(t.children(i.roleSelector("detailbutton"))),e=t.contents().not(r).not(ht);e.length||(n.addClass("km-listview-link").attr(i.attr("role"),"listview-link"),f(n,u(t,"icon")),f(n,u(n,"icon")))}function at(n){if(n[0].querySelector("input[type=checkbox],input[type=radio]")){var t=n.parent();t.contents().not(n).not(function(){return 3==this.nodeType})[0]||(n.addClass("km-listview-label"),n.children("[type=checkbox],[type=radio]").addClass("km-widget km-icon km-check"))}}function h(t,i){n(t).css("transform","translate3d(0px, "+i+"px, 0px)")}var b,c,l,k,d,g,nt,tt,i=window.kendo,vt=window.Node,a=i.mobile,r=a.ui,yt=i.data.DataSource,v=r.DataBoundWidget,pt=".km-list > li, > li:not(.km-group-container)",it=".km-listview-link, .km-listview-label",wt="["+i.attr("icon")+"]",e=n.proxy,u=i.attrValue,o="km-group-title",bt="km-state-active",kt='<div class="'+o+'"><div class="km-text"><\/div><\/div>',dt=i.template('<li><div class="'+o+'"><div class="km-text">#= this.headerTemplate(data) #<\/div><\/div><ul>#= kendo.render(this.template, data.items)#<\/ul><\/li>'),gt='<div class="km-listview-wrapper" />',ni=i.template('<form class="km-filter-form"><div class="km-filter-wrap"><input type="search" placeholder="#=placeholder#"/><a href="\\#" class="km-filter-reset" title="Clear"><span class="km-icon km-clear"><\/span><span class="km-text">Clear<\/span><\/a><\/div><\/form>'),s=".kendoMobileListView",rt="styled",y="dataBound",ut="dataBinding",p="itemChange",w="click",ft="change",et="progress",ot="function",ti=/^\s+$/,ii=/button/,ri=i.Class.extend({init:function(n){var i,t,r=n.scroller();r&&(this.options=n.options,this.element=n.element,this.scroller=n.scroller(),this._shouldFixHeaders(),i=this,t=function(){i._cacheHeaders()},n.bind("resize",t),n.bind(rt,t),n.bind(y,t),r.bind("scroll",function(n){i._fixHeader(n)}))},_fixHeader:function(t){if(this.fixedHeaders){var i,f,r,u=0,e=this.scroller,o=this.headers,s=t.scrollTop;do{if(i=o[u++],!i){r=n("<div />");break}f=i.offset;r=i.header}while(f+1>s);this.currentHeader!=u&&(e.fixedContainer.html(r.clone()),this.currentHeader=u)}},_shouldFixHeaders:function(){this.fixedHeaders="group"===this.options.type&&this.options.fixedHeaders},_cacheHeaders:function(){if(this._shouldFixHeaders(),this.fixedHeaders){var t=[],i=this.scroller.scrollTop;this.element.find("."+o).each(function(r,u){u=n(u);t.unshift({offset:u.position().top+i,header:u})});this.headers=t;this._fixHeader({scrollTop:i})}}}),ui=function(){return{page:1}},fi=i.Class.extend({init:function(n){var t=this,i=n.options,r=n.scroller(),u=i.pullParameters||ui;this.listView=n;this.scroller=r;n.bind("_dataSource",function(n){t.setDataSource(n.dataSource)});r.setOptions({pullToRefresh:!0,pull:function(){t._pulled||(t._pulled=!0,t.dataSource.read(u.call(n,t._first)))},messages:{pullTemplate:i.messages.pullTemplate,releaseTemplate:i.messages.releaseTemplate,refreshTemplate:i.messages.refreshTemplate}})},setDataSource:function(n){var t=this;this._first=n.view()[0];this.dataSource=n;n.bind("change",function(){t._change()});n.bind("error",function(){t._change()})},_change:function(){var n,t=this.scroller,i=this.dataSource;this._pulled&&t.pullHandled();(this._pulled||!this._first)&&(n=i.view(),n[0]&&(this._first=n[0]));this._pulled=!1}}),st=i.Observable.extend({init:function(n){var t=this;i.Observable.fn.init.call(t);t.buffer=n.buffer;t.height=n.height;t.item=n.item;t.items=[];t.footer=n.footer;t.buffer.bind("reset",function(){t.refresh()})},refresh:function(){for(var u,f,t,i,r=this.buffer,n=this.items,e=!1;n.length;)n.pop().destroy();for(this.offset=r.offset,u=this.item,i=0;r.viewSize>i;i++){if(i===r.total()){e=!0;break}t=u(this.content(this.offset+n.length));t.below(f);f=t;n.push(t)}this.itemCount=n.length;this.trigger("reset");this._resize();e&&this.trigger("endReached")},totalHeight:function(){if(!this.items[0])return 0;var n=this,t=n.items,r=t[0].top,i=t[t.length-1].bottom,u=(i-r)/n.itemCount,f=n.buffer.length-n.offset-n.itemCount;return(this.footer?this.footer.height:0)+i+f*u},batchUpdate:function(n){var i,r,u=this.height(),t=this.items,f=this.offset;if(t[0]){if(this.lastDirection)for(;t[t.length-1].bottom>n+2*u&&0!==this.offset;)this.offset--,i=t.pop(),i.update(this.content(this.offset)),i.above(t[0]),t.unshift(i);else for(;n-u>t[0].top;){if(r=this.offset+this.itemCount,r===this.buffer.total()){this.trigger("endReached");break}if(r===this.buffer.length)break;i=t.shift();i.update(this.content(this.offset+this.itemCount));i.below(t[t.length-1]);t.push(i);this.offset++}f!==this.offset&&this._resize()}},update:function(n){var i,e,o,u,f=this,t=this.items,s=this.height(),a=this.itemCount,r=s/2,h=(this.lastTop||0)>n,c=n-r,l=n+s+r;t[0]&&(this.lastTop=n,this.lastDirection=h,h?t[0].top>c&&t[t.length-1].bottom>l+r&&this.offset>0&&(this.offset--,i=t.pop(),e=t[0],i.update(this.content(this.offset)),t.unshift(i),i.above(e),f._resize()):l>t[t.length-1].bottom&&c-r>t[0].top&&(u=this.offset+a,u===this.buffer.total()?this.trigger("endReached"):u!==this.buffer.length&&(i=t.shift(),o=t[t.length-1],t.push(i),i.update(this.content(this.offset+this.itemCount)),f.offset++,i.below(o),f._resize())))},content:function(n){return this.buffer.at(n)},destroy:function(){this.unbind()},_resize:function(){var n=this.items,t=0,i=0,r=n[0],u=n[n.length-1];r&&(t=r.top,i=u.bottom);this.trigger("resize",{top:t,bottom:i});this.footer&&this.footer.below(u)}});i.mobile.ui.VirtualList=st;b=i.Class.extend({init:function(t,i){var r=t.append([i],!0)[0],u=r.offsetHeight;n.extend(this,{top:0,element:r,listView:t,height:u,bottom:u})},update:function(n){this.element=this.listView.setDataItem(this.element,n)},above:function(n){n&&(this.height=this.element.offsetHeight,this.top=n.top-this.height,this.bottom=n.top,h(this.element,this.top))},below:function(n){n&&(this.height=this.element.offsetHeight,this.top=n.bottom,this.bottom=this.top+this.height,h(this.element,this.top))},destroy:function(){i.destroy(this.element);n(this.element).remove()}});c='<div><span class="km-icon"><\/span><span class="km-loading-left"><\/span><span class="km-loading-right"><\/span><\/div>';l=i.Class.extend({init:function(t){this.element=n('<li class="km-load-more km-scroller-refresh" style="display: none"><\/li>').appendTo(t.element);this._loadIcon=n(c).appendTo(this.element)},enable:function(){this.element.show();this.height=this.element.outerHeight(!0)},disable:function(){this.element.hide();this.height=0},below:function(n){n&&(this.top=n.bottom,this.bottom=this.height+this.top,h(this.element,this.top))}});k=l.extend({init:function(t,i){this._loadIcon=n(c).hide();this._loadButton=n('<a class="km-load">'+t.options.messages.loadMoreText+"<\/a>").hide();this.element=n('<li class="km-load-more" style="display: none"><\/li>').append(this._loadIcon).append(this._loadButton).appendTo(t.element);var r=this;this._loadButton.kendoMobileButton().data("kendoMobileButton").bind("click",function(){r._hideShowButton();i.next()});i.bind("resize",function(){r._showLoadButton()});this.height=this.element.outerHeight(!0);this.disable()},_hideShowButton:function(){this._loadButton.hide();this.element.addClass("km-scroller-refresh");this._loadIcon.css("display","block")},_showLoadButton:function(){this._loadButton.show();this.element.removeClass("km-scroller-refresh");this._loadIcon.hide()}});d=i.Class.extend({init:function(n){var t=this;this.chromeHeight=n.wrapper.children().not(n.element).outerHeight()||0;this.listView=n;this.scroller=n.scroller();this.options=n.options;n.bind("_dataSource",function(n){t.setDataSource(n.dataSource,n.empty)});n.bind("resize",function(){t.list.items.length&&(t.scroller.reset(),t.buffer.range(0),t.list.refresh())});this.scroller.makeVirtual();this.scroller.bind("scroll",function(n){t.list.update(n.scrollTop)});this.scroller.bind("scrollEnd",function(n){t.list.batchUpdate(n.scrollTop)})},destroy:function(){this.list.unbind();this.buffer.unbind()},setDataSource:function(t,r){var s,f,o,u,h=this,a=this.options,e=this.listView,c=e.scroller(),v=a.loadMore;if(this.dataSource=t,s=t.pageSize()||a.virtualViewSize,!s&&!r)throw Error("the DataSource does not have page size configured. Page Size setting is mandatory for the mobile listview virtual scrolling to work as expected.");this.buffer&&this.buffer.destroy();f=new i.data.Buffer(t,Math.floor(s/2),v);o=v?new k(e,f):new l(e);this.list&&this.list.destroy();u=new st({buffer:f,footer:o,item:function(n){return new b(e,n)},height:function(){return c.height()}});u.bind("resize",function(){h.updateScrollerSize();e.updateSize()});u.bind("reset",function(){h.footer.enable()});u.bind("endReached",function(){o.disable();h.updateScrollerSize()});f.bind("expand",function(){u.lastDirection=!1;u.batchUpdate(c.scrollTop)});n.extend(this,{buffer:f,scroller:c,list:u,footer:o})},updateScrollerSize:function(){this.scroller.virtualSize(0,this.list.totalHeight()+this.chromeHeight)},refresh:function(){this.list.refresh()},reset:function(){this.buffer.range(0);this.list.refresh()}});g=i.Class.extend({init:function(n){var t,i=this;this.listView=n;this.options=n.options;t=this;this._refreshHandler=function(n){t.refresh(n)};this._progressHandler=function(){n.showLoading()};n.bind("_dataSource",function(n){i.setDataSource(n.dataSource)})},destroy:function(){this._unbindDataSource()},reset:function(){},refresh:function(n){var h,c,s,l,v,p,a,f=n&&n.action,u=n&&n.items,i=this.listView,w=this.dataSource,b=this.options.appendOnRefresh,e=w.view(),k=w.group(),o=k&&k[0];return"itemchange"===f?(h=i.findByDataItem(u)[0],h&&i.setDataItem(h,u[0]),t):(v="add"===f&&!o||b&&!i._filter,p="remove"===f&&!o,v?c=[]:p&&(c=i.findByDataItem(u)),i.trigger(ut,{action:f||"rebind",items:u,removedItems:c,index:n&&n.index})?(this._shouldShowLoading()&&i.hideLoading(),t):("add"!==f||o?"remove"!==f||o?o?i.replaceGrouped(e):b&&!i._filter?(s=i.prepend(e),l=e):i.replace(e):(s=[],i.remove(u)):(a=e.indexOf(u[0]),a>-1&&(s=i.insertAt(u,a),l=u)),this._shouldShowLoading()&&i.hideLoading(),i.trigger(y,{ns:r,addedItems:s,addedDataItems:l}),t))},setDataSource:function(n){this.dataSource&&this._unbindDataSource();this.dataSource=n;n.bind(ft,this._refreshHandler);this._shouldShowLoading()&&this.dataSource.bind(et,this._progressHandler)},_unbindDataSource:function(){this.dataSource.unbind(ft,this._refreshHandler).unbind(et,this._progressHandler)},_shouldShowLoading:function(){var n=this.options;return!n.pullToRefresh&&!n.loadMore&&!n.endlessScroll}});nt=i.Class.extend({init:function(n){var i=this,t=n.options.filterable,r="change paste";this.listView=n;this.options=t;n.element.before(ni({placeholder:t.placeholder||"Search..."}));t.autoFilter!==!1&&(r+=" keyup");this.element=n.wrapper.find(".km-search-form");this.searchInput=n.wrapper.find("input[type=search]").closest("form").on("submit"+s,function(n){n.preventDefault()}).end().on("focus"+s,function(){i._oldFilter=i.searchInput.val()}).on(r.split(" ").join(s+" ")+s,e(this._filterChange,this));this.clearButton=n.wrapper.find(".km-filter-reset").on(w,e(this,"_clearFilter")).hide()},_search:function(n){this._filter=!0;this.clearButton[n?"show":"hide"]();this.listView.dataSource.filter(n)},_filterChange:function(n){var t=this;"paste"==n.type&&this.options.autoFilter!==!1?setTimeout(function(){t._applyFilter()},1):this._applyFilter()},_applyFilter:function(){var t=this.options,n=this.searchInput.val(),i=n.length?{field:t.field,operator:t.operator||"startsWith",ignoreCase:t.ignoreCase,value:n}:null;n!==this._oldFilter&&(this._oldFilter=n,this._search(i))},_clearFilter:function(n){this.searchInput.val("");this._search(null);n.preventDefault()}});tt=v.extend({init:function(n,t){var u=this;v.fn.init.call(this,n,t);n=this.element;t=this.options;t.scrollTreshold&&(t.scrollThreshold=t.scrollTreshold);n.on("down",it,"_highlight").on("move up cancel",it,"_dim");this._userEvents=new i.UserEvents(n,{filter:pt,allowSelection:!0,tap:function(n){u._click(n)}});n.css("-ms-touch-action","auto");n.wrap(gt);this.wrapper=this.element.parent();this._headerFixer=new ri(this);this._itemsCache={};this._templates();this.virtual=t.endlessScroll||t.loadMore;this._style();this.options.filterable&&(this._filter=new nt(this));this._itemBinder=this.virtual?new d(this):new g(this);this.options.pullToRefresh&&(this._pullToRefreshHandler=new fi(this));this.setDataSource(t.dataSource);this._enhanceItems(this.items());i.notify(this,r)},events:[w,ut,y,p],options:{name:"ListView",style:"",type:"flat",autoBind:!0,fixedHeaders:!1,template:"#:data#",headerTemplate:'<span class="km-text">#:value#<\/span>',appendOnRefresh:!1,loadMore:!1,endlessScroll:!1,scrollThreshold:30,pullToRefresh:!1,messages:{loadMoreText:"Press to load more",pullTemplate:"Pull to refresh",releaseTemplate:"Release to refresh",refreshTemplate:"Refreshing"},pullOffset:140,filterable:!1,virtualViewSize:null},refresh:function(){this._itemBinder.refresh()},reset:function(){this._itemBinder.reset()},setDataSource:function(n){var t=!n;this.dataSource=yt.create(n);this.trigger("_dataSource",{dataSource:this.dataSource,empty:t});this.options.autoBind&&!t&&(this.items().remove(),this.dataSource.fetch())},destroy:function(){v.fn.destroy.call(this);i.destroy(this.element);this._userEvents.destroy();this._itemBinder&&this._itemBinder.destroy();this.element.unwrap();delete this.element;delete this.wrapper;delete this._userEvents},items:function(){return"group"===this.options.type?this.element.find(".km-list").children():this.element.children().not(".km-load-more")},scroller:function(){return this._scrollerInstance||(this._scrollerInstance=this.element.closest(".km-scroll-wrapper").data("kendoMobileScroller")),this._scrollerInstance},showLoading:function(){var n=this.view();n&&n.loader&&n.loader.show()},hideLoading:function(){var n=this.view();n&&n.loader&&n.loader.hide()},insertAt:function(n,t,i){var u=this;return u._renderItems(n,function(f){if(0===t?u.element.prepend(f):-1===t?u.element.append(f):u.items().eq(t-1).after(f),i)for(var e=0;f.length>e;e++)u.trigger(p,{item:f.eq(e),data:n[e],ns:r})})},append:function(n,t){return this.insertAt(n,-1,t)},prepend:function(n,t){return this.insertAt(n,0,t)},replace:function(n){return this.options.type="flat",this._angularItems("cleanup"),this.element.empty(),this._style(),this.insertAt(n,0)},replaceGrouped:function(t){this.options.type="group";this._angularItems("cleanup");this.element.empty();var r=n(i.render(this.groupTemplate,t));this._enhanceItems(r.children("ul").children("li"));this.element.append(r);a.init(r);this._style();this._angularItems("compile")},remove:function(n){var t=this.findByDataItem(n);this.angular("cleanup",function(){return{elements:t}});i.destroy(t);t.remove()},findByDataItem:function(n){for(var u=[],t=0,r=n.length;r>t;t++)u[t]="[data-"+i.ns+"uid="+n[t].uid+"]";return this.element.find(u.join(","))},setDataItem:function(t,u){var f=this,e=function(e){var o=n(e[0]);i.destroy(t);n(t).replaceWith(o);f.trigger(p,{item:o,data:u,ns:r})};return this._renderItems([u],e)[0]},updateSize:function(){this._size=this.getSize()},_renderItems:function(t,r){var u=n(i.render(this.template,t));return this.angular("compile",function(){return{elements:u,data:t.map(function(n){return{dataItem:n}})}}),r(u),a.init(u),this._enhanceItems(u),u},_dim:function(n){this._toggle(n,!1)},_highlight:function(n){this._toggle(n,!0)},_toggle:function(t,i){if(!(t.which>1)){var r=n(t.currentTarget),f=r.parent(),e=u(r,"role")||"",o=!e.match(ii),s=t.isDefaultPrevented();o&&f.toggleClass(bt,i&&!s)}},_templates:function(){var n=this.options.template,t=this.options.headerTemplate,u={},r={};typeof n===ot&&(u.template=n,n="#=this.template(data)#");this.template=e(i.template('<li data-uid="#=arguments[0].uid || ""#">'+n+"<\/li>"),u);r.template=this.template;typeof t===ot&&(r._headerTemplate=t,t="#=this._headerTemplate(data)#");r.headerTemplate=i.template(t);this.groupTemplate=e(dt,r)},_click:function(t){if(!(t.event.which>1||t.event.isDefaultPrevented())){var u,f=t.target,e=n(t.event.target),s=e.closest(i.roleSelector("button","detailbutton","backbutton")),h=i.widgetInstance(s,r),o=f.attr(i.attr("uid"));o&&(u=this.dataSource.getByUid(o));this.trigger(w,{target:e,item:f,dataItem:u,button:h})&&t.preventDefault()}},_styleGroups:function(){var t=this.element.children();t.children("ul").addClass("km-list");t.each(function(){var i=n(this),t=i.contents().first();i.addClass("km-group-container");t.is("ul")||t.is("div."+o)||t.wrap(kt)})},_style:function(){var r=this.options,n="group"===r.type,i=this.element,t="inset"===r.style;i.addClass("km-listview").toggleClass("km-list",!n).toggleClass("km-virtual-list",this.virtual).toggleClass("km-listinset",!n&&t).toggleClass("km-listgroup",n&&!t).toggleClass("km-listgroupinset",n&&t);i.parents(".km-listview")[0]||i.closest(".km-content").toggleClass("km-insetcontent",t);n&&this._styleGroups();this.trigger(rt)},_enhanceItems:function(t){t.each(function(){var t,r=n(this),i=!1;r.children().each(function(){t=n(this);t.is("a")?(lt(t),i=!0):t.is("label")&&(at(t),i=!0)});i||ct(r)})}});r.plugin(tt)}(window.kendo.jQuery),function(n,t){function u(r,u){var f=u.find("["+i.attr("align")+"="+r+"]");return f[0]?n('<div class="km-'+r+'item" />').append(f).prependTo(u):t}function f(t){var r=t.siblings(),u=!!t.children("ul")[0],f=!!r[0]&&""===n.trim(t.text()),e=i.mobile.application&&i.mobile.application.element.is(".km-android");t.prevAll().toggleClass("km-absolute",u);t.toggleClass("km-show-title",f);t.toggleClass("km-fill-title",f&&!n.trim(t.html()));t.toggleClass("km-no-title",u);t.toggleClass("km-hide-title",e&&!r.children().is(":visible"))}var i=window.kendo,o=i.mobile,e=o.ui,r=e.Widget,s=r.extend({init:function(t,i){var f=this;r.fn.init.call(f,t,i);t=f.element;f.container().bind("show",n.proxy(this,"refresh"));t.addClass("km-navbar").wrapInner(n('<div class="km-view-title km-show-title" />'));f.leftElement=u("left",t);f.rightElement=u("right",t);f.centerElement=t.find(".km-view-title")},options:{name:"NavBar"},title:function(n){this.element.find(i.roleSelector("view-title")).text(n);f(this.centerElement)},refresh:function(n){var t=n.view;t.options.title?this.title(t.options.title):f(this.centerElement)},destroy:function(){r.fn.destroy.call(this);i.destroy(this.element)}});e.plugin(s)}(window.kendo.jQuery),function(n,t){var y,p,w,b,k,e,d,it,i=window.kendo,lt=i.mobile,rt=lt.ui,r=n.proxy,s=i.effects.Transition,at=i.ui.Pane,vt=i.ui.PaneDimensions,g=rt.DataBoundWidget,ut=i.data.DataSource,yt=i.data.Buffer,pt=i.data.BatchBuffer,o=Math,h=o.abs,c=o.ceil,ft=o.round,wt=o.max,bt=o.min,et=o.floor,u="change",l="changing",f="refresh",nt="km-current-page",ot="km-virtual-page",st="function",tt="itemChange",ht="cleanup",kt=3,dt=-1,gt=0,ni=1,a=-1,ti=0,v=1,ct=i.Class.extend({init:function(t){var i=this,e=n("<ol class='km-pages'/>");t.element.append(e);this._changeProxy=r(i,"_change");this._refreshProxy=r(i,"_refresh");t.bind(u,this._changeProxy);t.bind(f,this._refreshProxy);n.extend(i,{element:e,scrollView:t})},items:function(){return this.element.children()},_refresh:function(n){for(var i="",t=0;n.pageCount>t;t++)i+="<li/>";this.element.html(i);this.items().eq(n.page).addClass(nt)},_change:function(n){this.items().removeClass(nt).eq(n.page).addClass(nt)},destroy:function(){this.scrollView.unbind(u,this._changeProxy);this.scrollView.unbind(f,this._refreshProxy);this.element.remove()}});i.mobile.ui.ScrollViewPager=ct;y="transitionEnd";p="dragStart";w="dragEnd";b=i.Observable.extend({init:function(t,r){var o,l,e,c,a,v,f=this;i.Observable.fn.init.call(this);this.element=t;this.container=t.parent();o=new i.ui.Movable(f.element);l=new s({axis:"x",movable:o,onEnd:function(){f.trigger(y)}});e=new i.UserEvents(t,{start:function(n){2*h(n.x.velocity)>=h(n.y.velocity)?e.capture():e.cancel();f.trigger(p,n);l.cancel()},allowSelection:!0,end:function(n){f.trigger(w,n)}});c=new vt({element:f.element,container:f.container});a=c.x;a.bind(u,function(){f.trigger(u)});v=new at({dimensions:c,userEvents:e,movable:o,elastic:!0});n.extend(f,{duration:r&&r.duration||1,movable:o,transition:l,userEvents:e,dimensions:c,dimension:a,pane:v});this.bind([y,p,w,u],r)},size:function(){return{width:this.dimensions.x.getSize(),height:this.dimensions.y.getSize()}},total:function(){return this.dimension.getTotal()},offset:function(){return-this.movable.x},updateDimension:function(){this.dimension.update(!0)},refresh:function(){this.dimensions.refresh()},moveTo:function(n){this.movable.moveAxis("x",-n)},transitionTo:function(n,t,i){i?this.moveTo(-n):this.transition.moveTo({location:n,duration:this.duration,ease:t})}});i.mobile.ui.ScrollViewElasticPane=b;k=i.Observable.extend({init:function(n,t,r){var u=this;i.Observable.fn.init.call(this);u.element=n;u.pane=t;u._getPages();this.page=0;this.pageSize=r.pageSize||1;this.contentHeight=r.contentHeight;this.enablePager=r.enablePager},scrollTo:function(n,t){this.page=n;this.pane.transitionTo(-n*this.pane.size().width,s.easeOutExpo,t)},paneMoved:function(n,t,i,r){var o,f,u=this,e=u.pane,l=e.size().width*u.pageSize,h=ft,y=t?s.easeOutBack:s.easeOutExpo;n===a?h=c:n===v&&(h=et);f=h(e.offset()/l);o=wt(u.minSnap,bt(-f*l,u.maxSnap));f!=u.page&&i&&i({currentPage:u.page,nextPage:f})&&(o=-u.page*e.size().width);e.transitionTo(o,y,r)},updatePage:function(){var n=this.pane,t=ft(n.offset()/n.size().width);return t!=this.page?(this.page=t,!0):!1},forcePageUpdate:function(){return this.updatePage()},resizeTo:function(n){var t,r,u=this.pane,i=n.width;this.pageElements.width(i);"100%"===this.contentHeight&&(t=this.element.parent().height(),this.enablePager===!0&&(r=this.element.parent().find("ol.km-pages"),r.length&&(t-=r.outerHeight(!0))),this.element.css("height",t),this.pageElements.css("height",t));u.updateDimension();this._paged||(this.page=et(u.offset()/i));this.scrollTo(this.page,!0);this.pageCount=c(u.total()/i);this.minSnap=-(this.pageCount-1)*i;this.maxSnap=0},_getPages:function(){this.pageElements=this.element.find(i.roleSelector("page"));this._paged=this.pageElements.length>0}});i.mobile.ui.ScrollViewContent=k;e=i.Observable.extend({init:function(n,t,r){var u=this;i.Observable.fn.init.call(this);u.element=n;u.pane=t;u.options=r;u._templates();u.page=r.page||0;u.pages=[];u._initPages();u.resizeTo(u.pane.size());u.pane.dimension.forceEnabled()},setDataSource:function(n){this.dataSource=ut.create(n);this._buffer();this._pendingPageRefresh=!1;this._pendingWidgetRefresh=!1},_viewShow:function(){var n=this;n._pendingWidgetRefresh&&(setTimeout(function(){n._resetPages()},0),n._pendingWidgetRefresh=!1)},_buffer:function(){var n=this.options.itemsPerPage;this.buffer&&this.buffer.destroy();this.buffer=n>1?new pt(this.dataSource,n):new yt(this.dataSource,3*n);this._resizeProxy=r(this,"_onResize");this._resetProxy=r(this,"_onReset");this._endReachedProxy=r(this,"_onEndReached");this.buffer.bind({resize:this._resizeProxy,reset:this._resetProxy,endreached:this._endReachedProxy})},_templates:function(){var n=this.options.template,t=this.options.emptyTemplate,u={},f={};typeof n===st&&(u.template=n,n="#=this.template(data)#");this.template=r(i.template(n),u);typeof t===st&&(f.emptyTemplate=t,t="#=this.emptyTemplate(data)#");this.emptyTemplate=r(i.template(t),f)},_initPages:function(){for(var t,i=this.pages,r=this.element,n=0;kt>n;n++)t=new d(r),i.push(t);this.pane.updateDimension()},resizeTo:function(n){for(var t,u,i=this.pages,f=this.pane,r=0;i.length>r;r++)i[r].setWidth(n.width);"auto"===this.options.contentHeight?this.element.css("height",this.pages[1].element.height()):"100%"===this.options.contentHeight&&(t=this.element.parent().height(),this.options.enablePager===!0&&(u=this.element.parent().find("ol.km-pages"),u.length&&(t-=u.outerHeight(!0))),this.element.css("height",t),i[0].element.css("height",t),i[1].element.css("height",t),i[2].element.css("height",t));f.updateDimension();this._repositionPages();this.width=n.width},scrollTo:function(n){var t,i=this.buffer;i.syncDataSource();t=i.at(n);t&&(this._updatePagesContent(n),this.page=n)},paneMoved:function(n,t,r,u){var o,f=this,h=f.pane,y=h.size().width,s=h.offset(),c=Math.abs(s)>=y/3,p=t?i.effects.Transition.easeOutBack:i.effects.Transition.easeOutExpo,l=f.page+2>f.buffer.total(),e=0;n===v?0!==f.page&&(e=-1):n!==a||l?s>0&&c&&!l?e=1:0>s&&c&&0!==f.page&&(e=-1):e=1;o=f.page;e&&(o=e>0?o+1:o-1);r&&r({currentPage:f.page,nextPage:o})&&(e=0);0===e?f._cancelMove(p,u):-1===e?f._moveBackward(u):1===e&&f._moveForward(u)},updatePage:function(){var n=this.pages;return 0===this.pane.offset()?!1:(this.pane.offset()>0?(n.push(this.pages.shift()),this.page++,this.setPageContent(n[2],this.page+1)):(n.unshift(this.pages.pop()),this.page--,this.setPageContent(n[0],this.page-1)),this._repositionPages(),this._resetMovable(),!0)},forcePageUpdate:function(){var n=this.pane.offset(),t=3*this.pane.size().width/4;return h(n)>t?this.updatePage():!1},_resetMovable:function(){this.pane.moveTo(0)},_moveForward:function(n){this.pane.transitionTo(-this.width,i.effects.Transition.easeOutExpo,n)},_moveBackward:function(n){this.pane.transitionTo(this.width,i.effects.Transition.easeOutExpo,n)},_cancelMove:function(n,t){this.pane.transitionTo(0,n,t)},_resetPages:function(){this.page=this.options.page||0;this._updatePagesContent(this.page);this._repositionPages();this.trigger("reset")},_onResize:function(){this.pageCount=c(this.dataSource.total()/this.options.itemsPerPage);this._pendingPageRefresh&&(this._updatePagesContent(this.page),this._pendingPageRefresh=!1);this.trigger("resize")},_onReset:function(){this.pageCount=c(this.dataSource.total()/this.options.itemsPerPage);this._resetPages()},_onEndReached:function(){this._pendingPageRefresh=!0},_repositionPages:function(){var n=this.pages;n[0].position(dt);n[1].position(gt);n[2].position(ni)},_updatePagesContent:function(n){var t=this.pages,i=n||0;this.setPageContent(t[0],i-1);this.setPageContent(t[1],i);this.setPageContent(t[2],i+1)},setPageContent:function(t,r){var f=this.buffer,e=this.template,o=this.emptyTemplate,u=null;r>=0&&(u=f.at(r),n.isArray(u)&&!u.length&&(u=null));this.trigger(ht,{item:t.element});t.content(null!==u?e(u):o({}));i.mobile.init(t.element);this.trigger(tt,{item:t.element,data:u,ns:i.mobile.ui})}});i.mobile.ui.VirtualScrollViewContent=e;d=i.Class.extend({init:function(t){this.element=n("<div class='"+ot+"'><\/div>");this.width=t.width();this.element.width(this.width);t.append(this.element)},content:function(n){this.element.html(n)},position:function(n){this.element.css("transform","translate3d("+this.width*n+"px, 0, 0)")},setWidth:function(n){this.width=n;this.element.width(n)}});i.mobile.ui.VirtualPage=d;it=g.extend({init:function(n,t){var h,o,s,u=this;g.fn.init.call(u,n,t);t=u.options;n=u.element;i.stripWhitespace(n[0]);n.wrapInner("<div/>").addClass("km-scrollview");this.options.enablePager&&(this.pager=new ct(this));u.inner=n.children().first();u.page=0;u.inner.css("height",t.contentHeight);u.pane=new b(u.inner,{duration:this.options.duration,transitionEnd:r(this,"_transitionEnd"),dragStart:r(this,"_dragStart"),dragEnd:r(this,"_dragEnd"),change:r(this,f)});u.bind("resize",function(){u.pane.refresh()});u.page=t.page;h=0===this.inner.children().length;o=h?new e(u.inner,u.pane,t):new k(u.inner,u.pane,t);o.page=u.page;o.bind("reset",function(){u._syncWithContent();u.trigger(f,{pageCount:o.pageCount,page:o.page})});o.bind("resize",function(){u.trigger(f,{pageCount:o.pageCount,page:o.page})});o.bind(tt,function(n){u.trigger(tt,n);u.angular("compile",function(){return{elements:n.item,data:[{dataItem:n.data}]}})});o.bind(ht,function(n){u.angular("cleanup",function(){return{elements:n.item}})});u._content=o;u.setDataSource(t.dataSource);s=u.container();s.nullObject?(u.viewInit(),u.viewShow()):s.bind("show",r(this,"viewShow")).bind("init",r(this,"viewInit"))},options:{name:"ScrollView",page:0,duration:400,velocityThreshold:.8,contentHeight:"auto",pageSize:1,itemsPerPage:1,bounceVelocityThreshold:1.6,enablePager:!0,autoBind:!0,template:"",emptyTemplate:""},events:[l,u,f],destroy:function(){g.fn.destroy.call(this);i.destroy(this.element)},viewInit:function(){this.options.autoBind&&this._content.scrollTo(this._content.page,!0)},viewShow:function(){this.pane.refresh()},refresh:function(){var n=this._content;n.resizeTo(this.pane.size());this.page=n.page;this.trigger(f,{pageCount:n.pageCount,page:n.page})},content:function(n){this.element.children().first().html(n);this._content._getPages();this.pane.refresh()},value:function(n){var i=this.dataSource;return n?(this.scrollTo(i.indexOf(n),!0),t):i.at(this.page)},scrollTo:function(n,t){this._content.scrollTo(n,t);this._syncWithContent()},prev:function(){var n=this,i=n.page-1;n._content instanceof e?n._content.paneMoved(v,t,function(t){return n.trigger(l,t)}):i>-1&&n.scrollTo(i)},next:function(){var n=this,i=n.page+1;n._content instanceof e?n._content.paneMoved(a,t,function(t){return n.trigger(l,t)}):n._content.pageCount>i&&n.scrollTo(i)},setDataSource:function(n){if(this._content instanceof e){var t=!n;this.dataSource=ut.create(n);this._content.setDataSource(this.dataSource);this.options.autoBind&&!t&&this.dataSource.fetch()}},items:function(){return this.element.find("."+ot)},_syncWithContent:function(){var n,i,r=this._content.pages,f=this._content.buffer;this.page=this._content.page;n=f?f.at(this.page):t;n instanceof Array||(n=[n]);i=r?r[1].element:t;this.trigger(u,{page:this.page,element:i,data:n})},_dragStart:function(){this._content.forcePageUpdate()&&this._syncWithContent()},_dragEnd:function(n){var u=this,t=n.x.velocity,r=this.options.velocityThreshold,i=ti,f=h(t)>this.options.bounceVelocityThreshold;t>r?i=v:-r>t&&(i=a);this._content.paneMoved(i,f,function(n){return u.trigger(l,n)})},_transitionEnd:function(){this._content.updatePage()&&this._syncWithContent()}});rt.plugin(it)}(window.kendo.jQuery),function(n,t){function a(n,t,i){return Math.max(t,Math.min(i,n))}var i=window.kendo,o=i.mobile.ui,u=o.Widget,v=i.support,s="change",h="km-switch-on",c="km-switch-off",f="margin-left",l="km-state-active",y="km-state-disabled",r="disabled",p=v.transitions.css+"transform",e=n.proxy,w='<span class="km-switch km-widget">        <span class="km-switch-wrapper"><span class="km-switch-background"><\/span><\/span>         <span class="km-switch-container"><span class="km-switch-handle" >             <span class="km-switch-label-on">{0}<\/span>             <span class="km-switch-label-off">{1}<\/span>         <\/span>     <\/span>',b=u.extend({init:function(t,e){var s,o=this;u.fn.init.call(o,t,e);e=o.options;o.wrapper=n(i.format(w,e.onLabel,e.offLabel));o.handle=o.wrapper.find(".km-switch-handle");o.background=o.wrapper.find(".km-switch-background");o.wrapper.insertBefore(o.element).prepend(o.element);o._drag();o.origin=parseInt(o.background.css(f),10);o.constrain=0;o.snapPoint=0;t=o.element[0];t.type="checkbox";o._animateBackground=!0;s=o.options.checked;null===s&&(s=t.checked);o.check(s);o.options.enable=o.options.enable&&!o.element.attr(r);o.enable(o.options.enable);o.refresh();i.notify(o,i.mobile.ui)},refresh:function(){var n=this,t=n.handle.outerWidth(!0);n.width=n.wrapper.width();n.constrain=n.width-t;n.snapPoint=n.constrain/2;"number"!=typeof n.origin&&(n.origin=parseInt(n.background.css(f),10));n.background.data("origin",n.origin);n.check(n.element[0].checked)},events:[s],options:{name:"Switch",onLabel:"on",offLabel:"off",checked:null,enable:!0},check:function(n){var i=this,r=i.element[0];return n===t?r.checked:(i._position(n?i.constrain:0),r.checked=n,i.wrapper.toggleClass(h,n).toggleClass(c,!n),t)},value:function(){return this.check.apply(this,arguments)},destroy:function(){u.fn.destroy.call(this);this.userEvents.destroy()},toggle:function(){var n=this;n.check(!n.element[0].checked)},enable:function(n){var i=this.element,u=this.wrapper;t===n&&(n=!0);this.options.enable=n;n?i.removeAttr(r):i.attr(r,r);u.toggleClass(y,!n)},_resize:function(){this.refresh()},_move:function(n){var t=this;n.preventDefault();t._position(a(t.position+n.x.delta,0,t.width-t.handle.outerWidth(!0)))},_position:function(n){var t=this;t.position=n;t.handle.css(p,"translatex("+n+"px)");t._animateBackground&&t.background.css(f,t.origin+n)},_start:function(){this.options.enable?(this.userEvents.capture(),this.handle.addClass(l)):this.userEvents.cancel()},_stop:function(){var n=this;n.handle.removeClass(l);n._toggle(n.position>n.snapPoint)},_toggle:function(n){var r,t=this,e=t.handle,u=t.element[0],o=u.checked,f=i.mobile.application&&i.mobile.application.os.wp?100:200;t.wrapper.toggleClass(h,n).toggleClass(c,!n);t.position=r=n*t.constrain;t._animateBackground&&t.background.kendoStop(!0,!0).kendoAnimate({effects:"slideMargin",offset:r,reset:!0,reverse:!n,axis:"left",duration:f});e.kendoStop(!0,!0).kendoAnimate({effects:"slideTo",duration:f,offset:r+"px,0",reset:!0,complete:function(){o!==n&&(u.checked=n,t.trigger(s,{checked:n}))}})},_drag:function(){var n=this;n.userEvents=new i.UserEvents(n.wrapper,{tap:function(){n.options.enable&&n._toggle(!n.element[0].checked)},start:e(n._start,n),move:e(n._move,n),end:e(n._stop,n)})}});o.plugin(b)}(window.kendo.jQuery),function(n){function r(t){return n('<span class="km-badge">'+t+"<\/span>")}var t=window.kendo,u=t.mobile.ui,f=u.Widget,i="km-state-active",e="select",o=f.extend({init:function(t,r){var u=this;f.fn.init.call(u,t,r);u.container().bind("show",n.proxy(this,"refresh"));u.element.addClass("km-tabstrip").find("a").each(u._buildButton).eq(u.options.selectedIndex).addClass(i);u.element.on("down","a","_release")},events:[e],switchTo:function(t){var i,r,u=this.element.find("a"),f=0,e=u.length;if(!isNaN(t))return this._setActiveItem(u.eq(t)),!0;for(;e>f;f++)if(i=u[f],r=i.href.replace(/(\#.+)(\?.+)$/,"$1"),-1!==r.indexOf(t,r.length-t.length))return this._setActiveItem(n(i)),!0;return!1},switchByFullUrl:function(n){var t;t=this.element.find("a[href$='"+n+"']");this._setActiveItem(t)},clear:function(){this.currentItem().removeClass(i)},currentItem:function(){return this.element.children("."+i)},badge:function(t,i){var u,f=this.element;return isNaN(t)||(t=f.children().get(t)),t=f.find(t),u=n(t.find(".km-badge")[0]||r(i).insertAfter(t.children(".km-icon"))),i||0===i?(u.html(i),this):i===!1?(u.empty().remove(),this):u.html()},_release:function(t){if(!(t.which>1)){var i=this,r=n(t.currentTarget);r[0]!==i.currentItem()[0]&&(i.trigger(e,{item:r})?t.preventDefault():i._setActiveItem(r))}},_setActiveItem:function(n){n[0]&&(this.clear(),n.addClass(i))},_buildButton:function(){var i=n(this),o=t.attrValue(i,"icon"),u=t.attrValue(i,"badge"),f=i.find("img"),e=n('<span class="km-icon"/>');i.addClass("km-button").attr(t.attr("role"),"tab").contents().not(f).wrapAll('<span class="km-text"/>');f[0]?f.addClass("km-image").prependTo(i):(i.prepend(e),o&&(e.addClass("km-"+o),(u||0===u)&&r(u).insertAfter(e)))},refresh:function(n){var i=n.view.element.attr(t.attr("url"));!this.switchTo(n.view.id)&&i&&this.switchTo(i)},options:{name:"TabStrip",selectedIndex:0,enable:!0}});u.plugin(o)}(window.kendo.jQuery),function(n,t,i){"use strict";function ft(n){var t=e;try{return e=function(n){return n()},n()}finally{e=t}}function v(n,r,u,f){r[u]=t.copy(n.$eval(f));r[u]===i&&f.match(/^\w*$/)&&c.warn(u+" attribute resolved to undefined. Maybe you meant to use a string literal like: '"+f+"'?")}function u(r,u,f,o,s,h){function p(){var p,b,e,h,c,k,y,i,tt;return f.kRebind&&(p=n(n(u)[0].cloneNode(!0))),b=o.replace(/^kendo/,""),e=t.extend({},f.defaultOptions,r.$eval(f.kOptions||f.options)),(h=n(u)[o])?(c=h.widget.prototype.options,k=h.widget.prototype.events,n.each(f,function(n,t){var f,o,i,u;"source"!==n&&"kDataSource"!==n&&(f="data"+n.charAt(0).toUpperCase()+n.slice(1),0===n.indexOf("on")&&(o=n.replace(/^on./,function(n){return n.charAt(2).toLowerCase()}),k.indexOf(o)>-1&&(e[o]=t)),c.hasOwnProperty(f)?v(r,e,f,t):c.hasOwnProperty(n)&&!nt[n]?v(r,e,n,t):g[n]||(i=n.match(/^k(On)?([A-Z].*)/),i&&(u=i[2].charAt(0).toLowerCase()+i[2].slice(1),i[1]&&"kOnLabel"!=n?e[u]=t:("kOnLabel"==n&&(u="onLabel"),v(r,e,u,t)))))}),y=f.kDataSource||f.source,y&&(e.dataSource=d(r,u,b,y)),e.$angular=[r],u.is("select")&&!function(t){if(t.length>0){var i=n(t[0]);!/\S/.test(i.text())&&/^\?/.test(i.val())&&i.remove()}}(u[0].options),i=h.call(u,l=e).data(o),et(i,r,f,o,s),r.$emit("kendoWidgetCreated",i),tt=ct(r,i),f.kRebind&&at(i,r,u,p,f.kRebind,tt),f.kNgModel&&ht(i,r,f.kNgModel),a&&st(i,r,u,a,w),i&&lt(i,u),i):(window.console.error("Could not find: "+o),null)}var a,w,b,y,c=f.kNgDelay,k=r.$eval(c);return h=h||[],a=h[0],w=h[1],c&&!k?(b=r.$root||r,y=function(){var n=r.$watch(c,function(t,i){t!==i&&(n(),u.removeAttr(f.$attr.kNgDelay),c=null,e(p))})},/^\$(digest|apply)$/.test(b.$$phase)?y():r.$apply(y),i):p()}function et(n,t,i,r,u){if(i[u]){var f=s(i[u]).assign;if(!f)throw Error(u+" attribute used but expression in it is not assignable: "+i[r]);f(t,n)}}function ot(n){return/checkbox|radio/i.test(n.attr("type"))?n.prop("checked"):n.val()}function p(n){return tt.test(n[0].tagName)}function st(n,t,r,u,f){var h,s,c,e;n.value&&(h=p(r)?function(){return ot(r)}:function(){return n.value()},u.$render=function(){var t=u.$viewValue;t===i&&(t=u.$modelValue);setTimeout(function(){n&&n.value(t)},0)},s=!1,p(r)&&r.on("change",function(){s=!0}),c=function(n){return function(){var i;s||(s=!1,n&&f&&(i=f.$pristine),u.$setViewValue(h()),n&&(u.$setPristine(),i&&f.$setPristine()),o(t))}},n.first("change",c(!1)),n.first("dataBound",c(!0)),e=h(),e!=u.$viewValue&&(u.$isEmpty(u.$viewValue)?null!=e&&""!==e&&e!=u.$viewValue&&u.$setViewValue(e):n.value(u.$viewValue)),u.$setPristine())}function ht(n,t,r){var f,e,u;return"function"!=typeof n.value?(c.warn("k-ng-model specified on a widget that does not have the value() method: "+n.options.name),i):(f=s(r),e=f.assign,u=!1,n.$angular_setLogicValue(f(t)),t.$apply(function(){var f=function(t,r){t===i&&(t=null);u||t!==r&&n.$angular_setLogicValue(t)};kendo.ui.MultiSelect&&n instanceof kendo.ui.MultiSelect?t.$watchCollection(r,f):t.$watch(r,f)}),n.first("change",function(){u=!0;t.$apply(function(){e(t,n.$angular_getLogicValue())});u=!1}),i)}function ct(n,t){var i=n.$on("$destroy",function(){i();t&&(t.element&&(t=b(t.element),t&&t.destroy()),t=null)});return i}function lt(t,i){function f(){u.disconnect()}function e(){u.observe(n(i)[0],{attributes:!0})}var r,u;window.MutationObserver&&t.wrapper&&(r=[].slice.call(n(i)[0].classList),u=new MutationObserver(function(i){f();t&&(i.forEach(function(i){var u,f=n(t.wrapper)[0];switch(i.attributeName){case"class":u=[].slice.call(i.target.classList);u.forEach(function(n){r.indexOf(n)<0&&(f.classList.add(n),kendo.ui.ComboBox&&t instanceof kendo.ui.ComboBox&&t.input[0].classList.add(n))});r.forEach(function(n){u.indexOf(n)<0&&(f.classList.remove(n),kendo.ui.ComboBox&&t instanceof kendo.ui.ComboBox&&t.input[0].classList.remove(n))});r=u;break;case"disabled":"function"==typeof t.enable&&t.enable(!n(i.target).attr("disabled"));break;case"readonly":"function"==typeof t.readonly&&t.readonly(!!n(i.target).attr("readonly"))}}),e())}),e(),t.first("destroy",f))}function at(t,i,r,u,f,e){var s=i.$watch(f,function(f,o){var h,c,l;f!==o&&(s(),h=n(t.wrapper)[0],c=n(t.element)[0],l=r.injector().get("$compile"),t.destroy(),e&&e(),t=null,h&&c&&(h.parentNode.replaceChild(c,h),n(r).replaceWith(u)),l(u)(i))},!0);o(i)}function w(n,i){function e(n,t){f.directive(n,["directiveFactory",function(i){return i.create(t,n)}])}var o,u,s,h,r=i?"Mobile":"";r+=n.fn.options.name;o=r;u="kendo"+r.charAt(0)+r.substr(1).toLowerCase();r="kendo"+r;s=r.replace(/([A-Z])/g,"-$1");-1==rt.indexOf(r.replace("kendo",""))&&(h=r===u?[r]:[r,u],t.forEach(h,function(n){f.directive(n,function(){return{restrict:"E",replace:!0,template:function(n){var t=it[o]||"div";return"<"+t+" "+s+">"+n.html()+"<\/"+t+">"}}})}));y.indexOf(r.replace("kendo",""))>-1||(e(r,r),u!=r&&e(u,r))}function b(t){return t=n(t),kendo.widgetInstance(t,kendo.ui)||kendo.widgetInstance(t,kendo.mobile.ui)||kendo.widgetInstance(t,kendo.dataviz.ui)}function o(n,t){var i=n.$root||n,r=/^\$(digest|apply)$/.test(i.$$phase);t?r?t():i.$apply(t):r||i.$digest()}function vt(t,i){t.$destroy();i&&n(i).removeData("$scope").removeData("$isolateScope").removeData("$isolateScopeNoTemplate").removeClass("ng-scope")}function r(i,u,f){var o,e,s;if(n.isArray(i))return t.forEach(i,function(n){r(n,u,f)});if("string"==typeof i){for(o=i.split("."),e=kendo;e&&o.length>0;)e=e[o.shift()];if(!e)return a.push([i,u,f]),!1;i=e.prototype}return s=i[u],i[u]=function(){var n=this,t=arguments;return f.apply({self:n,next:function(){return s.apply(n,arguments.length>0?arguments:t)}},t)},!0}var f,h,s,e,k,c,l,d,g,nt,tt,it,rt,y,a,ut;t&&(f=t.module("kendo.directives",[]),h=t.injector(["ng"]),s=h.get("$parse"),e=h.get("$timeout"),c=h.get("$log"),d=function(){var t={TreeList:"TreeListDataSource",TreeView:"HierarchicalDataSource",Scheduler:"SchedulerDataSource",PanelBar:"$PLAIN",Menu:"$PLAIN",ContextMenu:"$PLAIN"},n=function(n,t){return"$PLAIN"==t?n:kendo.data[t].create(n)};return function(i,r,u,f){var e=t[u]||"DataSource",o=n(i.$eval(f),e);return i.$watch(f,function(t,i){var f,u;t!==i&&(f=n(t,e),u=b(r),u&&"function"==typeof u.setDataSource&&u.setDataSource(f))}),o}}(),g={kDataSource:!0,kOptions:!0,kRebind:!0,kNgModel:!0,kNgDelay:!0},nt={name:!0,title:!0,style:!0},tt=/^(input|select|textarea)$/i,f.factory("directiveFactory",["$compile",function(t){var r,i=0,f=!1;return k=t,r=function(t,r){return{restrict:"AC",require:["?ngModel","^?form"],scope:!1,controller:["$scope","$attrs","$element",function(n,t){this.template=function(n,i){t[n]=kendo.stringify(i)}}],link:function(o,s,h,c){var l=n(s),a=t.replace(/([A-Z])/g,"-$1"),v="hidden"!==l.css("visibility");l.attr(a,l.attr("data-"+a));l[0].removeAttribute("data-"+a);v&&l.css("visibility","hidden");++i;e(function(){v&&l.css("visibility","");var e=u(o,s,h,t,r,c);e&&(--i,0===i&&(o.$emit("kendoRendered"),f||(f=!0,n("form").each(function(){var t=n(this).controller("form");t&&t.$setPristine()}))))})}}},{create:r}}]),it={Editor:"textarea",NumericTextBox:"input",DatePicker:"input",DateTimePicker:"input",TimePicker:"input",AutoComplete:"input",ColorPicker:"input",MaskedTextBox:"input",MultiSelect:"input",Upload:"input",Validator:"form",Button:"button",MobileButton:"a",MobileBackButton:"a",MobileDetailButton:"a",ListView:"ul",MobileListView:"ul",TreeView:"ul",Menu:"ul",ContextMenu:"ul",ActionSheet:"ul"},rt=["MobileView","MobileLayout","MobileSplitView","MobilePane","MobileModalView"],y=["MobileApplication","MobileView","MobileModalView","MobileLayout","MobileActionSheet","MobileDrawer","MobileSplitView","MobilePane","MobileScrollView","MobilePopOver"],t.forEach(["MobileNavBar","MobileButton","MobileBackButton","MobileDetailButton","MobileTabStrip","MobileScrollView","MobileScroller"],function(n){y.push(n);n="kendo"+n;f.directive(n,function(){return{restrict:"A",link:function(t,i,r){u(t,i,r,n,n)}}})}),function(){function n(n){return function(i){t.forEach(i,function(t){t.fn&&t.fn.options&&t.fn.options.name&&/^[A-Z]/.test(t.fn.options.name)&&w(t,n)})}}t.forEach([kendo.ui,kendo.dataviz&&kendo.dataviz.ui],n(!1));t.forEach([kendo.mobile&&kendo.mobile.ui],n(!0))}(),a=[],r(kendo.ui,"plugin",function(t,i,u){this.next();a=n.grep(a,function(n){return!r.apply(null,n)});w(t,"Mobile"==u)}),r(["ui.Widget","mobile.ui.Widget"],"angular",function(r,u){var f,e=this.self;return"init"==r?(!u&&l&&(u=l),l=null,u&&u.$angular&&(e.$angular_scope=u.$angular[0],e.$angular_init(e.element,u)),i):(f=e.$angular_scope,f&&ft(function(){var h,l,s=u(),c=s.elements,a=s.data;if(c.length>0)switch(r){case"cleanup":t.forEach(c,function(n){var i=t.element(n).scope();i&&i!==f&&i.$$kendoScope&&vt(i,n)});break;case"compile":h=e.element.injector();l=h?h.get("$compile"):k;t.forEach(c,function(r,u){var e,o;s.scopeFrom?e=t.element(s.scopeFrom).scope():(o=a&&a[u],o!==i&&(e=n.extend(f.$new(),o),e.$$kendoScope=!0));l(r)(e||f)});o(f)}}),i)}),r("ui.Widget","$angular_getLogicValue",function(){return this.self.value()}),r("ui.Widget","$angular_setLogicValue",function(n){this.self.value(n)}),r("ui.Select","$angular_getLogicValue",function(){var n=this.self.dataItem();return n?this.self.options.valuePrimitive?n[this.self.options.dataValueField]:n.toJSON():null}),r("ui.Select","$angular_setLogicValue",function(n){var i=this.self,t=i.options,r=t.dataValueField;r&&!t.valuePrimitive&&(n=null!=n?n[t.dataValueField||t.dataTextField]:null);i.value(n)}),r("ui.MultiSelect","$angular_getLogicValue",function(){var t=this.self.dataItems().slice(0),i=this.self.options.dataValueField;return i&&this.self.options.valuePrimitive&&(t=n.map(t,function(n){return n[i]})),t}),r("ui.MultiSelect","$angular_setLogicValue",function(t){null==t&&(t=[]);var i=this.self,r=i.options.dataValueField;r&&!i.options.valuePrimitive&&(t=n.map(t,function(n){return n[r]}));i.value(t)}),r("ui.AutoComplete","$angular_getLogicValue",function(){for(var t,u,i,r=this.self.options,e=this.self.value().split(r.separator),h=r.valuePrimitive,o=this.self.dataSource.data(),s=[],n=0,f=o.length;f>n;n++)for(t=o[n],u=r.dataTextField?t[r.dataTextField]:t,i=0;e.length>i;i++)if(u===e[i]){s.push(h?u:t.toJSON());break}return s}),r("ui.AutoComplete","$angular_setLogicValue",function(t){null==t&&(t=[]);var i=this.self,r=i.options.dataTextField;r&&!i.options.valuePrimitive&&(t=n.map(t,function(n){return n[r]}));i.value(t)}),r("ui.Widget","$angular_init",function(t,i){var o,e,r,u,f=this.self;if(i&&!n.isArray(i))for(o=f.$angular_scope,e=f.events.length;--e>=0;)r=f.events[e],u=i[r],u&&"string"==typeof u&&(i[r]=f.$angular_makeEventHandler(r,o,u))}),r("ui.Widget","$angular_makeEventHandler",function(n,t,i){return i=s(i),function(n){o(t,function(){i(t,{kendoEvent:n})})}}),r(["ui.Grid","ui.ListView","ui.TreeView"],"$angular_makeEventHandler",function(n,i,r){return"change"!=n?this.next():(r=s(r),function(n){var c,y,f,s,l,a,e,p,h,w=n.sender,v=w.options,u={kendoEvent:n};for(t.isString(v.selectable)&&(c=-1!==v.selectable.indexOf("cell"),y=-1!==v.selectable.indexOf("multiple")),f=u.selected=this.select(),s=u.data=[],l=u.columns=[],e=0;f.length>e;e++)p=c?f[e].parentNode:f[e],h=w.dataItem(p),c?(t.element.inArray(h,s)<0&&s.push(h),a=t.element(f[e]).index(),t.element.inArray(a,l)<0&&l.push(a)):s.push(h);y||(u.dataItem=u.data=s[0],u.selected=f[0]);o(i,function(){r(i,u)})})}),r("ui.Grid","$angular_init",function(r,u){if(this.next(),u.columns){var f=n.extend({},kendo.Template,u.templateSettings);t.forEach(u.columns,function(n){!n.field||n.template||n.format||n.values||n.encoded!==i&&!n.encoded||(n.template="<span ng-bind='"+kendo.expr(n.field,"dataItem")+"'>#: "+kendo.expr(n.field,f.paramName)+"#<\/span>")})}}),r("mobile.ui.ButtonGroup","value",function(n){var t=this.self;return null!=n&&(t.select(t.element.children("li.km-button").eq(n)),t.trigger("change"),t.trigger("select",{index:t.selectedIndex})),t.selectedIndex}),r("mobile.ui.ButtonGroup","_select",function(){this.next();this.self.trigger("change")}),f.directive("kendoMobileApplication",function(){return{terminal:!0,link:function(n,t,i){u(n,t,i,"kendoMobileApplication","kendoMobileApplication")}}}).directive("kendoMobileView",function(){return{scope:!0,link:{pre:function(n,t,i){i.defaultOptions=n.viewOptions;i._instance=u(n,t,i,"kendoMobileView","kendoMobileView")},post:function(n,t,i){i._instance._layout();i._instance._scroller()}}}}).directive("kendoMobileDrawer",function(){return{scope:!0,link:{pre:function(n,t,i){i.defaultOptions=n.viewOptions;i._instance=u(n,t,i,"kendoMobileDrawer","kendoMobileDrawer")},post:function(n,t,i){i._instance._layout();i._instance._scroller()}}}}).directive("kendoMobileModalView",function(){return{scope:!0,link:{pre:function(n,t,i){i.defaultOptions=n.viewOptions;i._instance=u(n,t,i,"kendoMobileModalView","kendoMobileModalView")},post:function(n,t,i){i._instance._layout();i._instance._scroller()}}}}).directive("kendoMobileSplitView",function(){return{terminal:!0,link:{pre:function(n,t,i){i.defaultOptions=n.viewOptions;i._instance=u(n,t,i,"kendoMobileSplitView","kendoMobileSplitView")},post:function(n,t,i){i._instance._layout()}}}}).directive("kendoMobilePane",function(){return{terminal:!0,link:{pre:function(n,t,i){i.defaultOptions=n.viewOptions;u(n,t,i,"kendoMobilePane","kendoMobilePane")}}}}).directive("kendoMobileLayout",function(){return{link:{pre:function(n,t,i){u(n,t,i,"kendoMobileLayout","kendoMobileLayout")}}}}).directive("kendoMobileActionSheet",function(){return{restrict:"A",link:function(t,i,r){i.find("a[k-action]").each(function(){n(this).attr("data-"+kendo.ns+"action",n(this).attr("k-action"))});u(t,i,r,"kendoMobileActionSheet","kendoMobileActionSheet")}}}).directive("kendoMobilePopOver",function(){return{terminal:!0,link:{pre:function(n,t,i){i.defaultOptions=n.viewOptions;u(n,t,i,"kendoMobilePopOver","kendoMobilePopOver")}}}}).directive("kendoViewTitle",function(){return{restrict:"E",replace:!0,template:function(n){return"<span data-"+kendo.ns+"role='view-title'>"+n.html()+"<\/span>"}}}).directive("kendoMobileHeader",function(){return{restrict:"E",link:function(n,t){t.addClass("km-header").attr("data-role","header")}}}).directive("kendoMobileFooter",function(){return{restrict:"E",link:function(n,t){t.addClass("km-footer").attr("data-role","footer")}}}).directive("kendoMobileScrollViewPage",function(){return{restrict:"E",replace:!0,template:function(n){return"<div data-"+kendo.ns+"role='page'>"+n.html()+"<\/div>"}}}),t.forEach(["align","icon","rel","transition","actionsheetContext"],function(n){var t="k"+n.slice(0,1).toUpperCase()+n.slice(1);f.directive(t,function(){return{restrict:"A",priority:2,link:function(i,r,u){r.attr(kendo.attr(kendo.toHyphens(n)),i.$eval(u[t]))}}})}),ut={TreeMap:["Template"],MobileListView:["HeaderTemplate","Template"],MobileScrollView:["EmptyTemplate","Template"],Grid:["AltRowTemplate","DetailTemplate","RowTemplate"],ListView:["EditTemplate","Template","AltTemplate"],Pager:["SelectTemplate","LinkTemplate"],PivotGrid:["ColumnHeaderTemplate","DataCellTemplate","RowHeaderTemplate"],Scheduler:["AllDayEventTemplate","DateHeaderTemplate","EventTemplate","MajorTimeHeaderTemplate","MinorTimeHeaderTemplate"],TreeView:["Template"],Validator:["ErrorTemplate"]},function(){var n={};t.forEach(ut,function(i,r){t.forEach(i,function(t){n[t]||(n[t]=[]);n[t].push("?^^kendo"+r)})});t.forEach(n,function(n,t){var i="k"+t,r=kendo.toHyphens(i);f.directive(i,function(){return{restrict:"A",require:n,terminal:!0,compile:function(t,u){if(""===u[i]){t.removeAttr(r);var f=t[0].outerHTML;return function(u,e,o,s){for(var h;!h&&s.length;)h=s.shift();h?(h.template(i,f),t.remove()):c.warn(r+" without a matching parent widget found. It can be one of the following: "+n.join(", "))}}}}})})}())}(window.kendo.jQuery,window.angular),window.kendo},typeof define=="function"&&define.amd?define:function(n,t){t()});
(function(n){function t(n){return{url:n[0],data:n.length>=2?n[1]:undefined,success:n.length>=3?n[2]:undefined,error:n.length>=4?n[3]:undefined}}function i(t){var i={dataType:"json"};return arguments.length===1&&typeof arguments[0]!="string"?(i=n.extend(i,t),"url"in i&&("data"in i&&(i.url=typeof i.data=="object"&&i.data.guid?i.url.replace("{guid}",i.data.guid):r(i.url,i.data)),bizagi.override.forceBatchRequest&&i.url.indexOf("Api/")>-1&&i.url.indexOf("Api/Batch")==-1&&(i.batchRequest=!0,i.fromRestLib=!0))):(n.isFunction(data)&&(error=success,success=data,data=null),t=r(t,data),i=n.extend(i,{url:t,data:data,cache:!0,success:function(n,t,r){success&&success.call(i.context||i,n,u(r),r)},error:function(n){error&&error.call(i.context||i,n,u(n))}})),i}function r(n,t){var i,r,u;for(i in t)u=t[i],r=n.replace("{"+i+"}",u),r!=n&&(n=r,delete t[i]);return n}function u(t){var i={},r=n.trim(t.getAllResponseHeaders());return n.each(r.split("\n"),function(t,r){if(r.length){var u=r.match(/^([\w\-]+):(.*)/);u.length===3&&(i[u[1]]=n.trim(u[2]))}}),t.responseHeaders=i,i}n.support.cors=!0;var f=n.ajax;n.restSetup={methodParam:"_method",useMethodOverride:!1,verbs:{create:"POST",update:"PUT",destroy:"DELETE"}};n(document).ready(function(){n.restSetup.csrfParam=n.restSetup.csrfParam||n("meta[name=csrf-param]").attr("content");n.restSetup.csrfToken=n.restSetup.csrfToken||n("meta[name=csrf-token]").attr("content")});n.read=function(r){r.url||(r=t(arguments));var u=i(r);return u.type="GET",u.crossDomain="true",u.xhrFields={withCredentials:!0},n.ajax(u)};n.create=function(r){r.url||(r=t(arguments));var u=i(r);return u.type=n.restSetup.verbs.create,u.crossDomain="true",u.xhrFields={withCredentials:!0},n.ajax(u)};n.update=function(r){r.url||(r=t(arguments));var u=i(r);return u.type=n.restSetup.verbs.update,u.crossDomain="true",u.xhrFields={withCredentials:!0},n.ajax(u)};n.destroy=function(r){r.url||(r=t(arguments));var u=i(r);return u.type=n.restSetup.verbs.destroy,u.crossDomain="true",u.xhrFields={withCredentials:!0},n.ajax(u)}})(jQuery);
bizagi.override.enableFolder=!1;bizagi.enableCustomizations=!0;bizagi.override.enableSmartFolders=!1;bizagi.override.enableListOfRecentProcesses=!1;bizagi.override.enableCustomizeReports=!1;bizagi.override.enableMultipleCasesReassigment=!1;bizagi.override.enableAsyncECMUploadJobs=!1;bizagi.override.enablePrintFromEditForm=!1;bizagi.enableDebug=!1;bizagi.enableTrace=!1;bizagi.override.detectCircularDependencies=!1;bizagi.override.disableFrankensteinQueryForms=!1;bizagi.override.enableE2EInterface=!1;bizagi.override.showAssignees=!0;bizagi.override.disposeTime=50;bizagi.override.enableBatchRequest=!0;bizagi.override.forceBatchRequest=!1;bizagi.override.showAssignees=!0;bizagi.override.enableMySearch=!0;bizagi.override.enableSecurityCaseDashBoard=!1;bizagi.override.enableMfb=!1;bizagi.override.enableRateUS=!1;bizagi.override.webpartsChunk=!1;
(function(n,t){function i(t,i){var u,f,e,o=t.nodeName.toLowerCase();return"area"===o?(u=t.parentNode,f=u.name,!t.href||!f||u.nodeName.toLowerCase()!=="map")?!1:(e=n("img[usemap=#"+f+"]")[0],!!e&&r(e)):(/input|select|textarea|button|object/.test(o)?!t.disabled:"a"===o?t.href||i:i)&&r(t)}function r(t){return n.expr.filters.visible(t)&&!n(t).parents().addBack().filter(function(){return n.css(this,"visibility")==="hidden"}).length}var u=0,f=/^ui-id-\d+$/;n.ui=n.ui||{};n.extend(n.ui,{version:"1.10.2",keyCode:{BACKSPACE:8,COMMA:188,DELETE:46,DOWN:40,END:35,ENTER:13,ESCAPE:27,HOME:36,LEFT:37,NUMPAD_ADD:107,NUMPAD_DECIMAL:110,NUMPAD_DIVIDE:111,NUMPAD_ENTER:108,NUMPAD_MULTIPLY:106,NUMPAD_SUBTRACT:109,PAGE_DOWN:34,PAGE_UP:33,PERIOD:190,RIGHT:39,SPACE:32,TAB:9,UP:38}});n.fn.extend({focus:function(t){return function(i,r){return typeof i=="number"?this.each(function(){var t=this;setTimeout(function(){n(t).focus();r&&r.call(t)},i)}):t.apply(this,arguments)}}(n.fn.focus),scrollParent:function(){var t;return t=n.ui.ie&&/(static|relative)/.test(this.css("position"))||/absolute/.test(this.css("position"))?this.parents().filter(function(){return/(relative|absolute|fixed)/.test(n.css(this,"position"))&&/(auto|scroll)/.test(n.css(this,"overflow")+n.css(this,"overflow-y")+n.css(this,"overflow-x"))}).eq(0):this.parents().filter(function(){return/(auto|scroll)/.test(n.css(this,"overflow")+n.css(this,"overflow-y")+n.css(this,"overflow-x"))}).eq(0),/fixed/.test(this.css("position"))||!t.length?n(document):t},zIndex:function(i){if(i!==t)return this.css("zIndex",i);if(this.length)for(var r=n(this[0]),u,f;r.length&&r[0]!==document;){if(u=r.css("position"),(u==="absolute"||u==="relative"||u==="fixed")&&(f=parseInt(r.css("zIndex"),10),!isNaN(f)&&f!==0))return f;r=r.parent()}return 0},uniqueId:function(){return this.each(function(){this.id||(this.id="ui-id-"+ ++u)})},removeUniqueId:function(){return this.each(function(){f.test(this.id)&&n(this).removeAttr("id")})}});n.extend(n.expr[":"],{data:n.expr.createPseudo?n.expr.createPseudo(function(t){return function(i){return!!n.data(i,t)}}):function(t,i,r){return!!n.data(t,r[3])},focusable:function(t){return i(t,!isNaN(n.attr(t,"tabindex")))},tabbable:function(t){var r=n.attr(t,"tabindex"),u=isNaN(r);return(u||r>=0)&&i(t,!u)}});n("<a>").outerWidth(1).jquery||n.each(["Width","Height"],function(i,r){function e(t,i,r,u){return n.each(o,function(){i-=parseFloat(n.css(t,"padding"+this))||0;r&&(i-=parseFloat(n.css(t,"border"+this+"Width"))||0);u&&(i-=parseFloat(n.css(t,"margin"+this))||0)}),i}var o=r==="Width"?["Left","Right"]:["Top","Bottom"],u=r.toLowerCase(),f={innerWidth:n.fn.innerWidth,innerHeight:n.fn.innerHeight,outerWidth:n.fn.outerWidth,outerHeight:n.fn.outerHeight};n.fn["inner"+r]=function(i){return i===t?f["inner"+r].call(this):this.each(function(){n(this).css(u,e(this,i)+"px")})};n.fn["outer"+r]=function(t,i){return typeof t!="number"?f["outer"+r].call(this,t):this.each(function(){n(this).css(u,e(this,t,!0,i)+"px")})}});n.fn.addBack||(n.fn.addBack=function(n){return this.add(n==null?this.prevObject:this.prevObject.filter(n))});n("<a>").data("a-b","a").removeData("a-b").data("a-b")&&(n.fn.removeData=function(t){return function(i){return arguments.length?t.call(this,n.camelCase(i)):t.call(this)}}(n.fn.removeData));n.ui.ie=!!/msie [\w.]+/.exec(navigator.userAgent.toLowerCase());n.support.selectstart="onselectstart"in document.createElement("div");n.fn.extend({disableSelection:function(){return this.bind((n.support.selectstart?"selectstart":"mousedown")+".ui-disableSelection",function(n){n.preventDefault()})},enableSelection:function(){return this.unbind(".ui-disableSelection")}});n.extend(n.ui,{plugin:{add:function(t,i,r){var u,f=n.ui[t].prototype;for(u in r)f.plugins[u]=f.plugins[u]||[],f.plugins[u].push([i,r[u]])},call:function(n,t,i){var r,u=n.plugins[t];if(u&&n.element[0].parentNode&&n.element[0].parentNode.nodeType!==11)for(r=0;r<u.length;r++)n.options[u[r][0]]&&u[r][1].apply(n.element,i)}},hasScroll:function(t,i){if(n(t).css("overflow")==="hidden")return!1;var r=i&&i==="left"?"scrollLeft":"scrollTop",u=!1;return t[r]>0?!0:(t[r]=1,u=t[r]>0,t[r]=0,u)}})})(jQuery),function(n,t){var r=0,i=Array.prototype.slice,u=n.cleanData;n.cleanData=function(t){for(var i=0,r;(r=t[i])!=null;i++)try{n(r).triggerHandler("remove")}catch(f){}u(t)};n.widget=function(t,i,r){var s,f,u,o,h={},e=t.split(".")[0];t=t.split(".")[1];s=e+"-"+t;r||(r=i,i=n.Widget);n.expr[":"][s.toLowerCase()]=function(t){return!!n.data(t,s)};n[e]=n[e]||{};f=n[e][t];u=n[e][t]=function(n,t){if(!this._createWidget)return new u(n,t);arguments.length&&this._createWidget(n,t)};n.extend(u,f,{version:r.version,_proto:n.extend({},r),_childConstructors:[]});o=new i;o.options=n.widget.extend({},o.options);n.each(r,function(t,r){if(!n.isFunction(r)){h[t]=r;return}h[t]=function(){var n=function(){return i.prototype[t].apply(this,arguments)},u=function(n){return i.prototype[t].apply(this,n)};return function(){var i=this._super,f=this._superApply,t;return this._super=n,this._superApply=u,t=r.apply(this,arguments),this._super=i,this._superApply=f,t}}()});u.prototype=n.widget.extend(o,{widgetEventPrefix:f?o.widgetEventPrefix:t},h,{constructor:u,namespace:e,widgetName:t,widgetFullName:s});f?(n.each(f._childConstructors,function(t,i){var r=i.prototype;n.widget(r.namespace+"."+r.widgetName,u,i._proto)}),delete f._childConstructors):i._childConstructors.push(u);n.widget.bridge(t,u)};n.widget.extend=function(r){for(var o=i.call(arguments,1),e=0,s=o.length,u,f;e<s;e++)for(u in o[e])f=o[e][u],o[e].hasOwnProperty(u)&&f!==t&&(r[u]=n.isPlainObject(f)?n.isPlainObject(r[u])?n.widget.extend({},r[u],f):n.widget.extend({},f):f);return r};n.widget.bridge=function(r,u){var f=u.prototype.widgetFullName||r;n.fn[r]=function(e){var h=typeof e=="string",o=i.call(arguments,1),s=this;return e=!h&&o.length?n.widget.extend.apply(null,[e].concat(o)):e,h?this.each(function(){var i,u=n.data(this,f);return u?!n.isFunction(u[e])||e.charAt(0)==="_"?n.error("no such method '"+e+"' for "+r+" widget instance"):(i=u[e].apply(u,o),i!==u&&i!==t?(s=i&&i.jquery?s.pushStack(i.get()):i,!1):void 0):n.error("cannot call methods on "+r+" prior to initialization; attempted to call method '"+e+"'")}):this.each(function(){var t=n.data(this,f);t?t.option(e||{})._init():n.data(this,f,new u(e,this))}),s}};n.Widget=function(){};n.Widget._childConstructors=[];n.Widget.prototype={widgetName:"widget",widgetEventPrefix:"",defaultElement:"<div>",options:{disabled:!1,create:null},_createWidget:function(t,i){i=n(i||this.defaultElement||this)[0];this.element=n(i);this.uuid=r++;this.eventNamespace="."+this.widgetName+this.uuid;this.options=n.widget.extend({},this.options,this._getCreateOptions(),t);this.bindings=n();this.hoverable=n();this.focusable=n();i!==this&&(n.data(i,this.widgetFullName,this),this._on(!0,this.element,{remove:function(n){n.target===i&&this.destroy()}}),this.document=n(i.style?i.ownerDocument:i.document||i),this.window=n(this.document[0].defaultView||this.document[0].parentWindow));this._create();this._trigger("create",null,this._getCreateEventData());this._init()},_getCreateOptions:n.noop,_getCreateEventData:n.noop,_create:n.noop,_init:n.noop,destroy:function(){this._destroy();this.element.unbind(this.eventNamespace).removeData(this.widgetName).removeData(this.widgetFullName).removeData(n.camelCase(this.widgetFullName));this.widget().unbind(this.eventNamespace).removeAttr("aria-disabled").removeClass(this.widgetFullName+"-disabled ui-state-disabled");this.bindings.unbind(this.eventNamespace);this.hoverable.removeClass("ui-state-hover");this.focusable.removeClass("ui-state-focus")},_destroy:n.noop,widget:function(){return this.element},option:function(i,r){var o=i,u,f,e;if(arguments.length===0)return n.widget.extend({},this.options);if(typeof i=="string")if(o={},u=i.split("."),i=u.shift(),u.length){for(f=o[i]=n.widget.extend({},this.options[i]),e=0;e<u.length-1;e++)f[u[e]]=f[u[e]]||{},f=f[u[e]];if(i=u.pop(),r===t)return f[i]===t?null:f[i];f[i]=r}else{if(r===t)return this.options[i]===t?null:this.options[i];o[i]=r}return this._setOptions(o),this},_setOptions:function(n){for(var t in n)this._setOption(t,n[t]);return this},_setOption:function(n,t){return this.options[n]=t,n==="disabled"&&(this.widget().toggleClass(this.widgetFullName+"-disabled ui-state-disabled",!!t).attr("aria-disabled",t),this.hoverable.removeClass("ui-state-hover"),this.focusable.removeClass("ui-state-focus")),this},enable:function(){return this._setOption("disabled",!1)},disable:function(){return this._setOption("disabled",!0)},_on:function(t,i,r){var f,u=this;typeof t!="boolean"&&(r=i,i=t,t=!1);r?(i=f=n(i),this.bindings=this.bindings.add(i)):(r=i,i=this.element,f=this.widget());n.each(r,function(r,e){function o(){if(t||u.options.disabled!==!0&&!n(this).hasClass("ui-state-disabled"))return(typeof e=="string"?u[e]:e).apply(u,arguments)}typeof e!="string"&&(o.guid=e.guid=e.guid||o.guid||n.guid++);var s=r.match(/^(\w+)\s*(.*)$/),h=s[1]+u.eventNamespace,c=s[2];c?f.delegate(c,h,o):i.bind(h,o)})},_off:function(n,t){t=(t||"").split(" ").join(this.eventNamespace+" ")+this.eventNamespace;n.unbind(t).undelegate(t)},_delay:function(n,t){function r(){return(typeof n=="string"?i[n]:n).apply(i,arguments)}var i=this;return setTimeout(r,t||0)},_hoverable:function(t){this.hoverable=this.hoverable.add(t);this._on(t,{mouseenter:function(t){n(t.currentTarget).addClass("ui-state-hover")},mouseleave:function(t){n(t.currentTarget).removeClass("ui-state-hover")}})},_focusable:function(t){this.focusable=this.focusable.add(t);this._on(t,{focusin:function(t){n(t.currentTarget).addClass("ui-state-focus")},focusout:function(t){n(t.currentTarget).removeClass("ui-state-focus")}})},_trigger:function(t,i,r){var u,f,e=this.options[t];if(r=r||{},i=n.Event(i),i.type=(t===this.widgetEventPrefix?t:this.widgetEventPrefix+t).toLowerCase(),i.target=this.element[0],f=i.originalEvent,f)for(u in f)u in i||(i[u]=f[u]);return this.element.trigger(i,r),!(n.isFunction(e)&&e.apply(this.element[0],[i].concat(r))===!1||i.isDefaultPrevented())}};n.each({show:"fadeIn",hide:"fadeOut"},function(t,i){n.Widget.prototype["_"+t]=function(r,u,f){typeof u=="string"&&(u={effect:u});var o,e=u?u===!0||typeof u=="number"?i:u.effect||i:t;u=u||{};typeof u=="number"&&(u={duration:u});o=!n.isEmptyObject(u);u.complete=f;u.delay&&r.delay(u.delay);o&&n.effects&&n.effects.effect[e]?r[t](u):e!==t&&r[e]?r[e](u.duration,u.easing,f):r.queue(function(i){n(this)[t]();f&&f.call(r[0]);i()})}})}(jQuery),function(n){var t=!1;n(document).mouseup(function(){t=!1});n.widget("ui.mouse",{version:"1.10.2",options:{cancel:"input,textarea,button,select,option",distance:1,delay:0},_mouseInit:function(){var t=this;this.element.bind("mousedown."+this.widgetName,function(n){return t._mouseDown(n)}).bind("click."+this.widgetName,function(i){if(!0===n.data(i.target,t.widgetName+".preventClickEvent"))return n.removeData(i.target,t.widgetName+".preventClickEvent"),i.stopImmediatePropagation(),!1});this.started=!1},_mouseDestroy:function(){this.element.unbind("."+this.widgetName);this._mouseMoveDelegate&&n(document).unbind("mousemove."+this.widgetName,this._mouseMoveDelegate).unbind("mouseup."+this.widgetName,this._mouseUpDelegate)},_mouseDown:function(i){if(!t){this._mouseStarted&&this._mouseUp(i);this._mouseDownEvent=i;var r=this,u=i.which===1,f=typeof this.options.cancel=="string"&&i.target.nodeName?n(i.target).closest(this.options.cancel).length:!1;return!u||f||!this._mouseCapture(i)?!0:(this.mouseDelayMet=!this.options.delay,this.mouseDelayMet||(this._mouseDelayTimer=setTimeout(function(){r.mouseDelayMet=!0},this.options.delay)),this._mouseDistanceMet(i)&&this._mouseDelayMet(i)&&(this._mouseStarted=this._mouseStart(i)!==!1,!this._mouseStarted))?(i.preventDefault(),!0):(!0===n.data(i.target,this.widgetName+".preventClickEvent")&&n.removeData(i.target,this.widgetName+".preventClickEvent"),this._mouseMoveDelegate=function(n){return r._mouseMove(n)},this._mouseUpDelegate=function(n){return r._mouseUp(n)},n(document).bind("mousemove."+this.widgetName,this._mouseMoveDelegate).bind("mouseup."+this.widgetName,this._mouseUpDelegate),i.preventDefault(),t=!0,!0)}},_mouseMove:function(t){return n.ui.ie&&(!document.documentMode||document.documentMode<9)&&!t.button?this._mouseUp(t):this._mouseStarted?(this._mouseDrag(t),t.preventDefault()):(this._mouseDistanceMet(t)&&this._mouseDelayMet(t)&&(this._mouseStarted=this._mouseStart(this._mouseDownEvent,t)!==!1,this._mouseStarted?this._mouseDrag(t):this._mouseUp(t)),!this._mouseStarted)},_mouseUp:function(t){return n(document).unbind("mousemove."+this.widgetName,this._mouseMoveDelegate).unbind("mouseup."+this.widgetName,this._mouseUpDelegate),this._mouseStarted&&(this._mouseStarted=!1,t.target===this._mouseDownEvent.target&&n.data(t.target,this.widgetName+".preventClickEvent",!0),this._mouseStop(t)),!1},_mouseDistanceMet:function(n){return Math.max(Math.abs(this._mouseDownEvent.pageX-n.pageX),Math.abs(this._mouseDownEvent.pageY-n.pageY))>=this.options.distance},_mouseDelayMet:function(){return this.mouseDelayMet},_mouseStart:function(){},_mouseDrag:function(){},_mouseStop:function(){},_mouseCapture:function(){return!0}})}(jQuery),function(n){n.widget("ui.draggable",n.ui.mouse,{version:"1.10.2",widgetEventPrefix:"drag",options:{addClasses:!0,appendTo:"parent",axis:!1,connectToSortable:!1,containment:!1,cursor:"auto",cursorAt:!1,grid:!1,handle:!1,helper:"original",iframeFix:!1,opacity:!1,refreshPositions:!1,revert:!1,revertDuration:500,scope:"default",scroll:!0,scrollSensitivity:20,scrollSpeed:20,snap:!1,snapMode:"both",snapTolerance:20,stack:!1,zIndex:!1,drag:null,start:null,stop:null},_create:function(){this.options.helper!=="original"||/^(?:r|a|f)/.test(this.element.css("position"))||(this.element[0].style.position="relative");this.options.addClasses&&this.element.addClass("ui-draggable");this.options.disabled&&this.element.addClass("ui-draggable-disabled");this._mouseInit()},_destroy:function(){this.element.removeClass("ui-draggable ui-draggable-dragging ui-draggable-disabled");this._mouseDestroy()},_mouseCapture:function(t){var i=this.options;return this.helper||i.disabled||n(t.target).closest(".ui-resizable-handle").length>0?!1:(this.handle=this._getHandle(t),!this.handle)?!1:(n(i.iframeFix===!0?"iframe":i.iframeFix).each(function(){n("<div class='ui-draggable-iframeFix' style='background: #fff;'><\/div>").css({width:this.offsetWidth+"px",height:this.offsetHeight+"px",position:"absolute",opacity:"0.001",zIndex:1e3}).css(n(this).offset()).appendTo("body")}),!0)},_mouseStart:function(t){var i=this.options;return(this.helper=this._createHelper(t),this.helper.addClass("ui-draggable-dragging"),this._cacheHelperProportions(),n.ui.ddmanager&&(n.ui.ddmanager.current=this),this._cacheMargins(),this.cssPosition=this.helper.css("position"),this.scrollParent=this.helper.scrollParent(),this.offset=this.positionAbs=this.element.offset(),this.offset={top:this.offset.top-this.margins.top,left:this.offset.left-this.margins.left},n.extend(this.offset,{click:{left:t.pageX-this.offset.left,top:t.pageY-this.offset.top},parent:this._getParentOffset(),relative:this._getRelativeOffset()}),this.originalPosition=this.position=this._generatePosition(t),this.originalPageX=t.pageX,this.originalPageY=t.pageY,i.cursorAt&&this._adjustOffsetFromHelper(i.cursorAt),i.containment&&this._setContainment(),this._trigger("start",t)===!1)?(this._clear(),!1):(this._cacheHelperProportions(),n.ui.ddmanager&&!i.dropBehaviour&&n.ui.ddmanager.prepareOffsets(this,t),this._mouseDrag(t,!0),n.ui.ddmanager&&n.ui.ddmanager.dragStart(this,t),!0)},_mouseDrag:function(t,i){if(this.position=this._generatePosition(t),this.positionAbs=this._convertPositionTo("absolute"),!i){var r=this._uiHash();if(this._trigger("drag",t,r)===!1)return this._mouseUp({}),!1;this.position=r.position}return this.options.axis&&this.options.axis==="y"||(this.helper[0].style.left=this.position.left+"px"),this.options.axis&&this.options.axis==="x"||(this.helper[0].style.top=this.position.top+"px"),n.ui.ddmanager&&n.ui.ddmanager.drag(this,t),!1},_mouseStop:function(t){var i,u=this,f=!1,r=!1;for(n.ui.ddmanager&&!this.options.dropBehaviour&&(r=n.ui.ddmanager.drop(this,t)),this.dropped&&(r=this.dropped,this.dropped=!1),i=this.element[0];i&&(i=i.parentNode);)i===document&&(f=!0);return!f&&this.options.helper==="original"?!1:(this.options.revert==="invalid"&&!r||this.options.revert==="valid"&&r||this.options.revert===!0||n.isFunction(this.options.revert)&&this.options.revert.call(this.element,r)?n(this.helper).animate(this.originalPosition,parseInt(this.options.revertDuration,10),function(){u._trigger("stop",t)!==!1&&u._clear()}):this._trigger("stop",t)!==!1&&this._clear(),!1)},_mouseUp:function(t){return n("div.ui-draggable-iframeFix").each(function(){this.parentNode.removeChild(this)}),n.ui.ddmanager&&n.ui.ddmanager.dragStop(this,t),n.ui.mouse.prototype._mouseUp.call(this,t)},cancel:function(){return this.helper.is(".ui-draggable-dragging")?this._mouseUp({}):this._clear(),this},_getHandle:function(t){return this.options.handle?!!n(t.target).closest(this.element.find(this.options.handle)).length:!0},_createHelper:function(t){var r=this.options,i=n.isFunction(r.helper)?n(r.helper.apply(this.element[0],[t])):r.helper==="clone"?this.element.clone().removeAttr("id"):this.element;return i.parents("body").length||i.appendTo(r.appendTo==="parent"?this.element[0].parentNode:r.appendTo),i[0]===this.element[0]||/(fixed|absolute)/.test(i.css("position"))||i.css("position","absolute"),i},_adjustOffsetFromHelper:function(t){typeof t=="string"&&(t=t.split(" "));n.isArray(t)&&(t={left:+t[0],top:+t[1]||0});"left"in t&&(this.offset.click.left=t.left+this.margins.left);"right"in t&&(this.offset.click.left=this.helperProportions.width-t.right+this.margins.left);"top"in t&&(this.offset.click.top=t.top+this.margins.top);"bottom"in t&&(this.offset.click.top=this.helperProportions.height-t.bottom+this.margins.top)},_getParentOffset:function(){this.offsetParent=this.helper.offsetParent();var t=this.offsetParent.offset();return this.cssPosition==="absolute"&&this.scrollParent[0]!==document&&n.contains(this.scrollParent[0],this.offsetParent[0])&&(t.left+=this.scrollParent.scrollLeft(),t.top+=this.scrollParent.scrollTop()),(this.offsetParent[0]===document.body||this.offsetParent[0].tagName&&this.offsetParent[0].tagName.toLowerCase()==="html"&&n.ui.ie)&&(t={top:0,left:0}),{top:t.top+(parseInt(this.offsetParent.css("borderTopWidth"),10)||0),left:t.left+(parseInt(this.offsetParent.css("borderLeftWidth"),10)||0)}},_getRelativeOffset:function(){if(this.cssPosition==="relative"){var n=this.element.position();return{top:n.top-(parseInt(this.helper.css("top"),10)||0)+this.scrollParent.scrollTop(),left:n.left-(parseInt(this.helper.css("left"),10)||0)+this.scrollParent.scrollLeft()}}return{top:0,left:0}},_cacheMargins:function(){this.margins={left:parseInt(this.element.css("marginLeft"),10)||0,top:parseInt(this.element.css("marginTop"),10)||0,right:parseInt(this.element.css("marginRight"),10)||0,bottom:parseInt(this.element.css("marginBottom"),10)||0}},_cacheHelperProportions:function(){this.helperProportions={width:this.helper.outerWidth(),height:this.helper.outerHeight()}},_setContainment:function(){var r,u,t,i=this.options;if(i.containment==="parent"&&(i.containment=this.helper[0].parentNode),(i.containment==="document"||i.containment==="window")&&(this.containment=[i.containment==="document"?0:n(window).scrollLeft()-this.offset.relative.left-this.offset.parent.left,i.containment==="document"?0:n(window).scrollTop()-this.offset.relative.top-this.offset.parent.top,(i.containment==="document"?0:n(window).scrollLeft())+n(i.containment==="document"?document:window).width()-this.helperProportions.width-this.margins.left,(i.containment==="document"?0:n(window).scrollTop())+(n(i.containment==="document"?document:window).height()||document.body.parentNode.scrollHeight)-this.helperProportions.height-this.margins.top]),/^(document|window|parent)$/.test(i.containment)||i.containment.constructor===Array)i.containment.constructor===Array&&(this.containment=i.containment);else{if(u=n(i.containment),t=u[0],!t)return;r=n(t).css("overflow")!=="hidden";this.containment=[(parseInt(n(t).css("borderLeftWidth"),10)||0)+(parseInt(n(t).css("paddingLeft"),10)||0),(parseInt(n(t).css("borderTopWidth"),10)||0)+(parseInt(n(t).css("paddingTop"),10)||0),(r?Math.max(t.scrollWidth,t.offsetWidth):t.offsetWidth)-(parseInt(n(t).css("borderRightWidth"),10)||0)-(parseInt(n(t).css("paddingRight"),10)||0)-this.helperProportions.width-this.margins.left-this.margins.right,(r?Math.max(t.scrollHeight,t.offsetHeight):t.offsetHeight)-(parseInt(n(t).css("borderBottomWidth"),10)||0)-(parseInt(n(t).css("paddingBottom"),10)||0)-this.helperProportions.height-this.margins.top-this.margins.bottom];this.relative_container=u}},_convertPositionTo:function(t,i){i||(i=this.position);var r=t==="absolute"?1:-1,u=this.cssPosition==="absolute"&&!(this.scrollParent[0]!==document&&n.contains(this.scrollParent[0],this.offsetParent[0]))?this.offsetParent:this.scrollParent,f=/(html|body)/i.test(u[0].tagName);return{top:i.top+this.offset.relative.top*r+this.offset.parent.top*r-(this.cssPosition==="fixed"?-this.scrollParent.scrollTop():f?0:u.scrollTop())*r,left:i.left+this.offset.relative.left*r+this.offset.parent.left*r-(this.cssPosition==="fixed"?-this.scrollParent.scrollLeft():f?0:u.scrollLeft())*r}},_generatePosition:function(t){var i,e,u,f,r=this.options,h=this.cssPosition==="absolute"&&!(this.scrollParent[0]!==document&&n.contains(this.scrollParent[0],this.offsetParent[0]))?this.offsetParent:this.scrollParent,c=/(html|body)/i.test(h[0].tagName),o=t.pageX,s=t.pageY;return this.originalPosition&&(this.containment&&(this.relative_container?(e=this.relative_container.offset(),i=[this.containment[0]+e.left,this.containment[1]+e.top,this.containment[2]+e.left,this.containment[3]+e.top]):i=this.containment,t.pageX-this.offset.click.left<i[0]&&(o=i[0]+this.offset.click.left),t.pageY-this.offset.click.top<i[1]&&(s=i[1]+this.offset.click.top),t.pageX-this.offset.click.left>i[2]&&(o=i[2]+this.offset.click.left),t.pageY-this.offset.click.top>i[3]&&(s=i[3]+this.offset.click.top)),r.grid&&(u=r.grid[1]?this.originalPageY+Math.round((s-this.originalPageY)/r.grid[1])*r.grid[1]:this.originalPageY,s=i?u-this.offset.click.top>=i[1]||u-this.offset.click.top>i[3]?u:u-this.offset.click.top>=i[1]?u-r.grid[1]:u+r.grid[1]:u,f=r.grid[0]?this.originalPageX+Math.round((o-this.originalPageX)/r.grid[0])*r.grid[0]:this.originalPageX,o=i?f-this.offset.click.left>=i[0]||f-this.offset.click.left>i[2]?f:f-this.offset.click.left>=i[0]?f-r.grid[0]:f+r.grid[0]:f)),{top:s-this.offset.click.top-this.offset.relative.top-this.offset.parent.top+(this.cssPosition==="fixed"?-this.scrollParent.scrollTop():c?0:h.scrollTop()),left:o-this.offset.click.left-this.offset.relative.left-this.offset.parent.left+(this.cssPosition==="fixed"?-this.scrollParent.scrollLeft():c?0:h.scrollLeft())}},_clear:function(){this.helper.removeClass("ui-draggable-dragging");this.helper[0]===this.element[0]||this.cancelHelperRemoval||this.helper.remove();this.helper=null;this.cancelHelperRemoval=!1},_trigger:function(t,i,r){return r=r||this._uiHash(),n.ui.plugin.call(this,t,[i,r]),t==="drag"&&(this.positionAbs=this._convertPositionTo("absolute")),n.Widget.prototype._trigger.call(this,t,i,r)},plugins:{},_uiHash:function(){return{helper:this.helper,position:this.position,originalPosition:this.originalPosition,offset:this.positionAbs}}});n.ui.plugin.add("draggable","connectToSortable",{start:function(t,i){var r=n(this).data("ui-draggable"),u=r.options,f=n.extend({},i,{item:r.element});r.sortables=[];n(u.connectToSortable).each(function(){var i=n.data(this,"ui-sortable");i&&!i.options.disabled&&(r.sortables.push({instance:i,shouldRevert:i.options.revert}),i.refreshPositions(),i._trigger("activate",t,f))})},stop:function(t,i){var r=n(this).data("ui-draggable"),u=n.extend({},i,{item:r.element});n.each(r.sortables,function(){this.instance.isOver?(this.instance.isOver=0,r.cancelHelperRemoval=!0,this.instance.cancelHelperRemoval=!1,this.shouldRevert&&(this.instance.options.revert=this.shouldRevert),this.instance._mouseStop(t),this.instance.options.helper=this.instance.options._helper,r.options.helper==="original"&&this.instance.currentItem.css({top:"auto",left:"auto"})):(this.instance.cancelHelperRemoval=!1,this.instance._trigger("deactivate",t,u))})},drag:function(t,i){var r=n(this).data("ui-draggable"),u=this;n.each(r.sortables,function(){var f=!1,e=this;this.instance.positionAbs=r.positionAbs;this.instance.helperProportions=r.helperProportions;this.instance.offset.click=r.offset.click;this.instance._intersectsWith(this.instance.containerCache)&&(f=!0,n.each(r.sortables,function(){return this.instance.positionAbs=r.positionAbs,this.instance.helperProportions=r.helperProportions,this.instance.offset.click=r.offset.click,this!==e&&this.instance._intersectsWith(this.instance.containerCache)&&n.contains(e.instance.element[0],this.instance.element[0])&&(f=!1),f}));f?(this.instance.isOver||(this.instance.isOver=1,this.instance.currentItem=n(u).clone().removeAttr("id").appendTo(this.instance.element).data("ui-sortable-item",!0),this.instance.options._helper=this.instance.options.helper,this.instance.options.helper=function(){return i.helper[0]},t.target=this.instance.currentItem[0],this.instance._mouseCapture(t,!0),this.instance._mouseStart(t,!0,!0),this.instance.offset.click.top=r.offset.click.top,this.instance.offset.click.left=r.offset.click.left,this.instance.offset.parent.left-=r.offset.parent.left-this.instance.offset.parent.left,this.instance.offset.parent.top-=r.offset.parent.top-this.instance.offset.parent.top,r._trigger("toSortable",t),r.dropped=this.instance.element,r.currentItem=r.element,this.instance.fromOutside=r),this.instance.currentItem&&this.instance._mouseDrag(t)):this.instance.isOver&&(this.instance.isOver=0,this.instance.cancelHelperRemoval=!0,this.instance.options.revert=!1,this.instance._trigger("out",t,this.instance._uiHash(this.instance)),this.instance._mouseStop(t,!0),this.instance.options.helper=this.instance.options._helper,this.instance.currentItem.remove(),this.instance.placeholder&&this.instance.placeholder.remove(),r._trigger("fromSortable",t),r.dropped=!1)})}});n.ui.plugin.add("draggable","cursor",{start:function(){var t=n("body"),i=n(this).data("ui-draggable").options;t.css("cursor")&&(i._cursor=t.css("cursor"));t.css("cursor",i.cursor)},stop:function(){var t=n(this).data("ui-draggable").options;t._cursor&&n("body").css("cursor",t._cursor)}});n.ui.plugin.add("draggable","opacity",{start:function(t,i){var r=n(i.helper),u=n(this).data("ui-draggable").options;r.css("opacity")&&(u._opacity=r.css("opacity"));r.css("opacity",u.opacity)},stop:function(t,i){var r=n(this).data("ui-draggable").options;r._opacity&&n(i.helper).css("opacity",r._opacity)}});n.ui.plugin.add("draggable","scroll",{start:function(){var t=n(this).data("ui-draggable");t.scrollParent[0]!==document&&t.scrollParent[0].tagName!=="HTML"&&(t.overflowOffset=t.scrollParent.offset())},drag:function(t){var r=n(this).data("ui-draggable"),i=r.options,u=!1;r.scrollParent[0]!==document&&r.scrollParent[0].tagName!=="HTML"?(i.axis&&i.axis==="x"||(r.overflowOffset.top+r.scrollParent[0].offsetHeight-t.pageY<i.scrollSensitivity?r.scrollParent[0].scrollTop=u=r.scrollParent[0].scrollTop+i.scrollSpeed:t.pageY-r.overflowOffset.top<i.scrollSensitivity&&(r.scrollParent[0].scrollTop=u=r.scrollParent[0].scrollTop-i.scrollSpeed)),i.axis&&i.axis==="y"||(r.overflowOffset.left+r.scrollParent[0].offsetWidth-t.pageX<i.scrollSensitivity?r.scrollParent[0].scrollLeft=u=r.scrollParent[0].scrollLeft+i.scrollSpeed:t.pageX-r.overflowOffset.left<i.scrollSensitivity&&(r.scrollParent[0].scrollLeft=u=r.scrollParent[0].scrollLeft-i.scrollSpeed))):(i.axis&&i.axis==="x"||(t.pageY-n(document).scrollTop()<i.scrollSensitivity?u=n(document).scrollTop(n(document).scrollTop()-i.scrollSpeed):n(window).height()-(t.pageY-n(document).scrollTop())<i.scrollSensitivity&&(u=n(document).scrollTop(n(document).scrollTop()+i.scrollSpeed))),i.axis&&i.axis==="y"||(t.pageX-n(document).scrollLeft()<i.scrollSensitivity?u=n(document).scrollLeft(n(document).scrollLeft()-i.scrollSpeed):n(window).width()-(t.pageX-n(document).scrollLeft())<i.scrollSensitivity&&(u=n(document).scrollLeft(n(document).scrollLeft()+i.scrollSpeed))));u!==!1&&n.ui.ddmanager&&!i.dropBehaviour&&n.ui.ddmanager.prepareOffsets(r,t)}});n.ui.plugin.add("draggable","snap",{start:function(){var t=n(this).data("ui-draggable"),i=t.options;t.snapElements=[];n(i.snap.constructor!==String?i.snap.items||":data(ui-draggable)":i.snap).each(function(){var i=n(this),r=i.offset();this!==t.element[0]&&t.snapElements.push({item:this,width:i.outerWidth(),height:i.outerHeight(),top:r.top,left:r.left})})},drag:function(t,i){for(var c,l,a,v,e,s,o,h,k,r=n(this).data("ui-draggable"),d=r.options,u=d.snapTolerance,y=i.offset.left,w=y+r.helperProportions.width,p=i.offset.top,b=p+r.helperProportions.height,f=r.snapElements.length-1;f>=0;f--){if(e=r.snapElements[f].left,s=e+r.snapElements[f].width,o=r.snapElements[f].top,h=o+r.snapElements[f].height,!(e-u<y&&y<s+u&&o-u<p&&p<h+u||e-u<y&&y<s+u&&o-u<b&&b<h+u||e-u<w&&w<s+u&&o-u<p&&p<h+u||e-u<w&&w<s+u&&o-u<b&&b<h+u)){r.snapElements[f].snapping&&r.options.snap.release&&r.options.snap.release.call(r.element,t,n.extend(r._uiHash(),{snapItem:r.snapElements[f].item}));r.snapElements[f].snapping=!1;continue}d.snapMode!=="inner"&&(c=Math.abs(o-b)<=u,l=Math.abs(h-p)<=u,a=Math.abs(e-w)<=u,v=Math.abs(s-y)<=u,c&&(i.position.top=r._convertPositionTo("relative",{top:o-r.helperProportions.height,left:0}).top-r.margins.top),l&&(i.position.top=r._convertPositionTo("relative",{top:h,left:0}).top-r.margins.top),a&&(i.position.left=r._convertPositionTo("relative",{top:0,left:e-r.helperProportions.width}).left-r.margins.left),v&&(i.position.left=r._convertPositionTo("relative",{top:0,left:s}).left-r.margins.left));k=c||l||a||v;d.snapMode!=="outer"&&(c=Math.abs(o-p)<=u,l=Math.abs(h-b)<=u,a=Math.abs(e-y)<=u,v=Math.abs(s-w)<=u,c&&(i.position.top=r._convertPositionTo("relative",{top:o,left:0}).top-r.margins.top),l&&(i.position.top=r._convertPositionTo("relative",{top:h-r.helperProportions.height,left:0}).top-r.margins.top),a&&(i.position.left=r._convertPositionTo("relative",{top:0,left:e}).left-r.margins.left),v&&(i.position.left=r._convertPositionTo("relative",{top:0,left:s-r.helperProportions.width}).left-r.margins.left));!r.snapElements[f].snapping&&(c||l||a||v||k)&&r.options.snap.snap&&r.options.snap.snap.call(r.element,t,n.extend(r._uiHash(),{snapItem:r.snapElements[f].item}));r.snapElements[f].snapping=c||l||a||v||k}}});n.ui.plugin.add("draggable","stack",{start:function(){var i,r=this.data("ui-draggable").options,t=n.makeArray(n(r.stack)).sort(function(t,i){return(parseInt(n(t).css("zIndex"),10)||0)-(parseInt(n(i).css("zIndex"),10)||0)});t.length&&(i=parseInt(n(t[0]).css("zIndex"),10)||0,n(t).each(function(t){n(this).css("zIndex",i+t)}),this.css("zIndex",i+t.length))}});n.ui.plugin.add("draggable","zIndex",{start:function(t,i){var r=n(i.helper),u=n(this).data("ui-draggable").options;r.css("zIndex")&&(u._zIndex=r.css("zIndex"));r.css("zIndex",u.zIndex)},stop:function(t,i){var r=n(this).data("ui-draggable").options;r._zIndex&&n(i.helper).css("zIndex",r._zIndex)}})}(jQuery),function(n){function t(n,t,i){return n>t&&n<t+i}n.widget("ui.droppable",{version:"1.10.2",widgetEventPrefix:"drop",options:{accept:"*",activeClass:!1,addClasses:!0,greedy:!1,hoverClass:!1,scope:"default",tolerance:"intersect",activate:null,deactivate:null,drop:null,out:null,over:null},_create:function(){var t=this.options,i=t.accept;this.isover=!1;this.isout=!0;this.accept=n.isFunction(i)?i:function(n){return n.is(i)};this.proportions={width:this.element[0].offsetWidth,height:this.element[0].offsetHeight};n.ui.ddmanager.droppables[t.scope]=n.ui.ddmanager.droppables[t.scope]||[];n.ui.ddmanager.droppables[t.scope].push(this);t.addClasses&&this.element.addClass("ui-droppable")},_destroy:function(){for(var t=0,i=n.ui.ddmanager.droppables[this.options.scope];t<i.length;t++)i[t]===this&&i.splice(t,1);this.element.removeClass("ui-droppable ui-droppable-disabled")},_setOption:function(t,i){t==="accept"&&(this.accept=n.isFunction(i)?i:function(n){return n.is(i)});n.Widget.prototype._setOption.apply(this,arguments)},_activate:function(t){var i=n.ui.ddmanager.current;this.options.activeClass&&this.element.addClass(this.options.activeClass);i&&this._trigger("activate",t,this.ui(i))},_deactivate:function(t){var i=n.ui.ddmanager.current;this.options.activeClass&&this.element.removeClass(this.options.activeClass);i&&this._trigger("deactivate",t,this.ui(i))},_over:function(t){var i=n.ui.ddmanager.current;i&&(i.currentItem||i.element)[0]!==this.element[0]&&this.accept.call(this.element[0],i.currentItem||i.element)&&(this.options.hoverClass&&this.element.addClass(this.options.hoverClass),this._trigger("over",t,this.ui(i)))},_out:function(t){var i=n.ui.ddmanager.current;i&&(i.currentItem||i.element)[0]!==this.element[0]&&this.accept.call(this.element[0],i.currentItem||i.element)&&(this.options.hoverClass&&this.element.removeClass(this.options.hoverClass),this._trigger("out",t,this.ui(i)))},_drop:function(t,i){var r=i||n.ui.ddmanager.current,u=!1;return!r||(r.currentItem||r.element)[0]===this.element[0]?!1:(this.element.find(":data(ui-droppable)").not(".ui-draggable-dragging").each(function(){var t=n.data(this,"ui-droppable");if(t.options.greedy&&!t.options.disabled&&t.options.scope===r.options.scope&&t.accept.call(t.element[0],r.currentItem||r.element)&&n.ui.intersect(r,n.extend(t,{offset:t.element.offset()}),t.options.tolerance))return u=!0,!1}),u)?!1:this.accept.call(this.element[0],r.currentItem||r.element)?(this.options.activeClass&&this.element.removeClass(this.options.activeClass),this.options.hoverClass&&this.element.removeClass(this.options.hoverClass),this._trigger("drop",t,this.ui(r)),this.element):!1},ui:function(n){return{draggable:n.currentItem||n.element,helper:n.helper,position:n.position,offset:n.positionAbs}}});n.ui.intersect=function(n,i,r){if(!i.offset)return!1;var a,v,e=(n.positionAbs||n.position.absolute).left,s=e+n.helperProportions.width,o=(n.positionAbs||n.position.absolute).top,h=o+n.helperProportions.height,u=i.offset.left,c=u+i.proportions.width,f=i.offset.top,l=f+i.proportions.height;switch(r){case"fit":return u<=e&&s<=c&&f<=o&&h<=l;case"intersect":return u<e+n.helperProportions.width/2&&s-n.helperProportions.width/2<c&&f<o+n.helperProportions.height/2&&h-n.helperProportions.height/2<l;case"pointer":return a=(n.positionAbs||n.position.absolute).left+(n.clickOffset||n.offset.click).left,v=(n.positionAbs||n.position.absolute).top+(n.clickOffset||n.offset.click).top,t(v,f,i.proportions.height)&&t(a,u,i.proportions.width);case"touch":return(o>=f&&o<=l||h>=f&&h<=l||o<f&&h>l)&&(e>=u&&e<=c||s>=u&&s<=c||e<u&&s>c);default:return!1}};n.ui.ddmanager={current:null,droppables:{"default":[]},prepareOffsets:function(t,i){var r,f,u=n.ui.ddmanager.droppables[t.options.scope]||[],o=i?i.type:null,e=(t.currentItem||t.element).find(":data(ui-droppable)").addBack();n:for(r=0;r<u.length;r++)if(!u[r].options.disabled&&(!t||u[r].accept.call(u[r].element[0],t.currentItem||t.element))){for(f=0;f<e.length;f++)if(e[f]===u[r].element[0]){u[r].proportions.height=0;continue n}(u[r].visible=u[r].element.css("display")!=="none",u[r].visible)&&(o==="mousedown"&&u[r]._activate.call(u[r],i),u[r].offset=u[r].element.offset(),u[r].proportions={width:u[r].element[0].offsetWidth,height:u[r].element[0].offsetHeight})}},drop:function(t,i){var r=!1;return n.each((n.ui.ddmanager.droppables[t.options.scope]||[]).slice(),function(){this.options&&(!this.options.disabled&&this.visible&&n.ui.intersect(t,this,this.options.tolerance)&&(r=this._drop.call(this,i)||r),!this.options.disabled&&this.visible&&this.accept.call(this.element[0],t.currentItem||t.element)&&(this.isout=!0,this.isover=!1,this._deactivate.call(this,i)))}),r},dragStart:function(t,i){t.element.parentsUntil("body").bind("scroll.droppable",function(){t.options.refreshPositions||n.ui.ddmanager.prepareOffsets(t,i)})},drag:function(t,i){t.options.refreshPositions&&n.ui.ddmanager.prepareOffsets(t,i);n.each(n.ui.ddmanager.droppables[t.options.scope]||[],function(){if(!this.options.disabled&&!this.greedyChild&&this.visible){var r,e,f,o=n.ui.intersect(t,this,this.options.tolerance),u=!o&&this.isover?"isout":o&&!this.isover?"isover":null;u&&(this.options.greedy&&(e=this.options.scope,f=this.element.parents(":data(ui-droppable)").filter(function(){return n.data(this,"ui-droppable").options.scope===e}),f.length&&(r=n.data(f[0],"ui-droppable"),r.greedyChild=u==="isover")),r&&u==="isover"&&(r.isover=!1,r.isout=!0,r._out.call(r,i)),this[u]=!0,this[u==="isout"?"isover":"isout"]=!1,this[u==="isover"?"_over":"_out"].call(this,i),r&&u==="isout"&&(r.isout=!1,r.isover=!0,r._over.call(r,i)))}})},dragStop:function(t,i){t.element.parentsUntil("body").unbind("scroll.droppable");t.options.refreshPositions||n.ui.ddmanager.prepareOffsets(t,i)}}}(jQuery),function(n){function i(n){return parseInt(n,10)||0}function t(n){return!isNaN(parseInt(n,10))}n.widget("ui.resizable",n.ui.mouse,{version:"1.10.2",widgetEventPrefix:"resize",options:{alsoResize:!1,animate:!1,animateDuration:"slow",animateEasing:"swing",aspectRatio:!1,autoHide:!1,containment:!1,ghost:!1,grid:!1,handles:"e,s,se",helper:!1,maxHeight:null,maxWidth:null,minHeight:10,minWidth:10,zIndex:90,resize:null,start:null,stop:null},_create:function(){var e,f,r,i,o,u=this,t=this.options;if(this.element.addClass("ui-resizable"),n.extend(this,{_aspectRatio:!!t.aspectRatio,aspectRatio:t.aspectRatio,originalElement:this.element,_proportionallyResizeElements:[],_helper:t.helper||t.ghost||t.animate?t.helper||"ui-resizable-helper":null}),this.element[0].nodeName.match(/canvas|textarea|input|select|button|img/i)&&(this.element.wrap(n("<div class='ui-wrapper' style='overflow: hidden;'><\/div>").css({position:this.element.css("position"),width:this.element.outerWidth(),height:this.element.outerHeight(),top:this.element.css("top"),left:this.element.css("left")})),this.element=this.element.parent().data("ui-resizable",this.element.data("ui-resizable")),this.elementIsWrapper=!0,this.element.css({marginLeft:this.originalElement.css("marginLeft"),marginTop:this.originalElement.css("marginTop"),marginRight:this.originalElement.css("marginRight"),marginBottom:this.originalElement.css("marginBottom")}),this.originalElement.css({marginLeft:0,marginTop:0,marginRight:0,marginBottom:0}),this.originalResizeStyle=this.originalElement.css("resize"),this.originalElement.css("resize","none"),this._proportionallyResizeElements.push(this.originalElement.css({position:"static",zoom:1,display:"block"})),this.originalElement.css({margin:this.originalElement.css("margin")}),this._proportionallyResize()),this.handles=t.handles||(n(".ui-resizable-handle",this.element).length?{n:".ui-resizable-n",e:".ui-resizable-e",s:".ui-resizable-s",w:".ui-resizable-w",se:".ui-resizable-se",sw:".ui-resizable-sw",ne:".ui-resizable-ne",nw:".ui-resizable-nw"}:"e,s,se"),this.handles.constructor===String)for(this.handles==="all"&&(this.handles="n,e,s,w,se,sw,ne,nw"),e=this.handles.split(","),this.handles={},f=0;f<e.length;f++)r=n.trim(e[f]),o="ui-resizable-"+r,i=n("<div class='ui-resizable-handle "+o+"'><\/div>"),i.css({zIndex:t.zIndex}),"se"===r&&i.addClass("ui-icon ui-icon-gripsmall-diagonal-se"),this.handles[r]=".ui-resizable-"+r,this.element.append(i);this._renderAxis=function(t){var i,r,u,f;t=t||this.element;for(i in this.handles)this.handles[i].constructor===String&&(this.handles[i]=n(this.handles[i],this.element).show()),this.elementIsWrapper&&this.originalElement[0].nodeName.match(/textarea|input|select|button/i)&&(r=n(this.handles[i],this.element),f=/sw|ne|nw|se|n|s/.test(i)?r.outerHeight():r.outerWidth(),u=["padding",/ne|nw|n/.test(i)?"Top":/se|sw|s/.test(i)?"Bottom":/^e$/.test(i)?"Right":"Left"].join(""),t.css(u,f),this._proportionallyResize()),!n(this.handles[i]).length};this._renderAxis(this.element);this._handles=n(".ui-resizable-handle",this.element).disableSelection();this._handles.mouseover(function(){u.resizing||(this.className&&(i=this.className.match(/ui-resizable-(se|sw|ne|nw|n|e|s|w)/i)),u.axis=i&&i[1]?i[1]:"se")});t.autoHide&&(this._handles.hide(),n(this.element).addClass("ui-resizable-autohide").mouseenter(function(){t.disabled||(n(this).removeClass("ui-resizable-autohide"),u._handles.show())}).mouseleave(function(){t.disabled||u.resizing||(n(this).addClass("ui-resizable-autohide"),u._handles.hide())}));this._mouseInit()},_destroy:function(){this._mouseDestroy();var t,i=function(t){n(t).removeClass("ui-resizable ui-resizable-disabled ui-resizable-resizing").removeData("resizable").removeData("ui-resizable").unbind(".resizable").find(".ui-resizable-handle").remove()};return this.elementIsWrapper&&(i(this.element),t=this.element,this.originalElement.css({position:t.css("position"),width:t.outerWidth(),height:t.outerHeight(),top:t.css("top"),left:t.css("left")}).insertAfter(t),t.remove()),this.originalElement.css("resize",this.originalResizeStyle),i(this.originalElement),this},_mouseCapture:function(t){var r,i,u=!1;for(r in this.handles)i=n(this.handles[r])[0],(i===t.target||n.contains(i,t.target))&&(u=!0);return!this.options.disabled&&u},_mouseStart:function(t){var f,e,o,u=this.options,s=this.element.position(),r=this.element;return this.resizing=!0,/absolute/.test(r.css("position"))?r.css({position:"absolute",top:r.css("top"),left:r.css("left")}):r.is(".ui-draggable")&&r.css({position:"absolute",top:s.top,left:s.left}),this._renderProxy(),f=i(this.helper.css("left")),e=i(this.helper.css("top")),u.containment&&(f+=n(u.containment).scrollLeft()||0,e+=n(u.containment).scrollTop()||0),this.offset=this.helper.offset(),this.position={left:f,top:e},this.size=this._helper?{width:r.outerWidth(),height:r.outerHeight()}:{width:r.width(),height:r.height()},this.originalSize=this._helper?{width:r.outerWidth(),height:r.outerHeight()}:{width:r.width(),height:r.height()},this.originalPosition={left:f,top:e},this.sizeDiff={width:r.outerWidth()-r.width(),height:r.outerHeight()-r.height()},this.originalMousePosition={left:t.pageX,top:t.pageY},this.aspectRatio=typeof u.aspectRatio=="number"?u.aspectRatio:this.originalSize.width/this.originalSize.height||1,o=n(".ui-resizable-"+this.axis).css("cursor"),n("body").css("cursor",o==="auto"?this.axis+"-resize":o),r.addClass("ui-resizable-resizing"),this._propagate("start",t),!0},_mouseDrag:function(t){var i,e=this.helper,r={},u=this.originalMousePosition,o=this.axis,s=this.position.top,h=this.position.left,c=this.size.width,l=this.size.height,a=t.pageX-u.left||0,v=t.pageY-u.top||0,f=this._change[o];return f?(i=f.apply(this,[t,a,v]),this._updateVirtualBoundaries(t.shiftKey),(this._aspectRatio||t.shiftKey)&&(i=this._updateRatio(i,t)),i=this._respectSize(i,t),this._updateCache(i),this._propagate("resize",t),this.position.top!==s&&(r.top=this.position.top+"px"),this.position.left!==h&&(r.left=this.position.left+"px"),this.size.width!==c&&(r.width=this.size.width+"px"),this.size.height!==l&&(r.height=this.size.height+"px"),e.css(r),!this._helper&&this._proportionallyResizeElements.length&&this._proportionallyResize(),n.isEmptyObject(r)||this._trigger("resize",t,this.ui()),!1):!1},_mouseStop:function(t){this.resizing=!1;var r,u,f,e,o,s,h,c=this.options,i=this;return this._helper&&(r=this._proportionallyResizeElements,u=r.length&&/textarea/i.test(r[0].nodeName),f=u&&n.ui.hasScroll(r[0],"left")?0:i.sizeDiff.height,e=u?0:i.sizeDiff.width,o={width:i.helper.width()-e,height:i.helper.height()-f},s=parseInt(i.element.css("left"),10)+(i.position.left-i.originalPosition.left)||null,h=parseInt(i.element.css("top"),10)+(i.position.top-i.originalPosition.top)||null,c.animate||this.element.css(n.extend(o,{top:h,left:s})),i.helper.height(i.size.height),i.helper.width(i.size.width),this._helper&&!c.animate&&this._proportionallyResize()),n("body").css("cursor","auto"),this.element.removeClass("ui-resizable-resizing"),this._propagate("stop",t),this._helper&&this.helper.remove(),!1},_updateVirtualBoundaries:function(n){var u,f,e,o,i,r=this.options;i={minWidth:t(r.minWidth)?r.minWidth:0,maxWidth:t(r.maxWidth)?r.maxWidth:Infinity,minHeight:t(r.minHeight)?r.minHeight:0,maxHeight:t(r.maxHeight)?r.maxHeight:Infinity};(this._aspectRatio||n)&&(u=i.minHeight*this.aspectRatio,e=i.minWidth/this.aspectRatio,f=i.maxHeight*this.aspectRatio,o=i.maxWidth/this.aspectRatio,u>i.minWidth&&(i.minWidth=u),e>i.minHeight&&(i.minHeight=e),f<i.maxWidth&&(i.maxWidth=f),o<i.maxHeight&&(i.maxHeight=o));this._vBoundaries=i},_updateCache:function(n){this.offset=this.helper.offset();t(n.left)&&(this.position.left=n.left);t(n.top)&&(this.position.top=n.top);t(n.height)&&(this.size.height=n.height);t(n.width)&&(this.size.width=n.width)},_updateRatio:function(n){var i=this.position,r=this.size,u=this.axis;return t(n.height)?n.width=n.height*this.aspectRatio:t(n.width)&&(n.height=n.width/this.aspectRatio),u==="sw"&&(n.left=i.left+(r.width-n.width),n.top=null),u==="nw"&&(n.top=i.top+(r.height-n.height),n.left=i.left+(r.width-n.width)),n},_respectSize:function(n){var i=this._vBoundaries,r=this.axis,u=t(n.width)&&i.maxWidth&&i.maxWidth<n.width,f=t(n.height)&&i.maxHeight&&i.maxHeight<n.height,e=t(n.width)&&i.minWidth&&i.minWidth>n.width,o=t(n.height)&&i.minHeight&&i.minHeight>n.height,s=this.originalPosition.left+this.originalSize.width,h=this.position.top+this.size.height,c=/sw|nw|w/.test(r),l=/nw|ne|n/.test(r);return e&&(n.width=i.minWidth),o&&(n.height=i.minHeight),u&&(n.width=i.maxWidth),f&&(n.height=i.maxHeight),e&&c&&(n.left=s-i.minWidth),u&&c&&(n.left=s-i.maxWidth),o&&l&&(n.top=h-i.minHeight),f&&l&&(n.top=h-i.maxHeight),n.width||n.height||n.left||!n.top?n.width||n.height||n.top||!n.left||(n.left=null):n.top=null,n},_proportionallyResize:function(){if(this._proportionallyResizeElements.length)for(var t,r,u,n,f=this.helper||this.element,i=0;i<this._proportionallyResizeElements.length;i++){if(n=this._proportionallyResizeElements[i],!this.borderDif)for(this.borderDif=[],r=[n.css("borderTopWidth"),n.css("borderRightWidth"),n.css("borderBottomWidth"),n.css("borderLeftWidth")],u=[n.css("paddingTop"),n.css("paddingRight"),n.css("paddingBottom"),n.css("paddingLeft")],t=0;t<r.length;t++)this.borderDif[t]=(parseInt(r[t],10)||0)+(parseInt(u[t],10)||0);n.css({height:f.height()-this.borderDif[0]-this.borderDif[2]||0,width:f.width()-this.borderDif[1]-this.borderDif[3]||0})}},_renderProxy:function(){var t=this.element,i=this.options;this.elementOffset=t.offset();this._helper?(this.helper=this.helper||n("<div style='overflow:hidden;'><\/div>"),this.helper.addClass(this._helper).css({width:this.element.outerWidth()-1,height:this.element.outerHeight()-1,position:"absolute",left:this.elementOffset.left+"px",top:this.elementOffset.top+"px",zIndex:++i.zIndex}),this.helper.appendTo("body").disableSelection()):this.helper=this.element},_change:{e:function(n,t){return{width:this.originalSize.width+t}},w:function(n,t){var i=this.originalSize,r=this.originalPosition;return{left:r.left+t,width:i.width-t}},n:function(n,t,i){var r=this.originalSize,u=this.originalPosition;return{top:u.top+i,height:r.height-i}},s:function(n,t,i){return{height:this.originalSize.height+i}},se:function(t,i,r){return n.extend(this._change.s.apply(this,arguments),this._change.e.apply(this,[t,i,r]))},sw:function(t,i,r){return n.extend(this._change.s.apply(this,arguments),this._change.w.apply(this,[t,i,r]))},ne:function(t,i,r){return n.extend(this._change.n.apply(this,arguments),this._change.e.apply(this,[t,i,r]))},nw:function(t,i,r){return n.extend(this._change.n.apply(this,arguments),this._change.w.apply(this,[t,i,r]))}},_propagate:function(t,i){n.ui.plugin.call(this,t,[i,this.ui()]);t!=="resize"&&this._trigger(t,i,this.ui())},plugins:{},ui:function(){return{originalElement:this.originalElement,element:this.element,helper:this.helper,position:this.position,size:this.size,originalSize:this.originalSize,originalPosition:this.originalPosition}}});n.ui.plugin.add("resizable","animate",{stop:function(t){var i=n(this).data("ui-resizable"),u=i.options,r=i._proportionallyResizeElements,f=r.length&&/textarea/i.test(r[0].nodeName),s=f&&n.ui.hasScroll(r[0],"left")?0:i.sizeDiff.height,h=f?0:i.sizeDiff.width,c={width:i.size.width-h,height:i.size.height-s},e=parseInt(i.element.css("left"),10)+(i.position.left-i.originalPosition.left)||null,o=parseInt(i.element.css("top"),10)+(i.position.top-i.originalPosition.top)||null;i.element.animate(n.extend(c,o&&e?{top:o,left:e}:{}),{duration:u.animateDuration,easing:u.animateEasing,step:function(){var u={width:parseInt(i.element.css("width"),10),height:parseInt(i.element.css("height"),10),top:parseInt(i.element.css("top"),10),left:parseInt(i.element.css("left"),10)};r&&r.length&&n(r[0]).css({width:u.width,height:u.height});i._updateCache(u);i._propagate("resize",t)}})}});n.ui.plugin.add("resizable","containment",{start:function(){var u,e,o,s,h,c,l,t=n(this).data("ui-resizable"),a=t.options,v=t.element,f=a.containment,r=f instanceof n?f.get(0):/parent/.test(f)?v.parent().get(0):f;r&&(t.containerElement=n(r),/document/.test(f)||f===document?(t.containerOffset={left:0,top:0},t.containerPosition={left:0,top:0},t.parentData={element:n(document),left:0,top:0,width:n(document).width(),height:n(document).height()||document.body.parentNode.scrollHeight}):(u=n(r),e=[],n(["Top","Right","Left","Bottom"]).each(function(n,t){e[n]=i(u.css("padding"+t))}),t.containerOffset=u.offset(),t.containerPosition=u.position(),t.containerSize={height:u.innerHeight()-e[3],width:u.innerWidth()-e[1]},o=t.containerOffset,s=t.containerSize.height,h=t.containerSize.width,c=n.ui.hasScroll(r,"left")?r.scrollWidth:h,l=n.ui.hasScroll(r)?r.scrollHeight:s,t.parentData={element:r,left:o.left,top:o.top,width:c,height:l}))},resize:function(t){var f,o,s,h,i=n(this).data("ui-resizable"),a=i.options,r=i.containerOffset,c=i.position,e=i._aspectRatio||t.shiftKey,u={top:0,left:0},l=i.containerElement;l[0]!==document&&/static/.test(l.css("position"))&&(u=r);c.left<(i._helper?r.left:0)&&(i.size.width=i.size.width+(i._helper?i.position.left-r.left:i.position.left-u.left),e&&(i.size.height=i.size.width/i.aspectRatio),i.position.left=a.helper?r.left:0);c.top<(i._helper?r.top:0)&&(i.size.height=i.size.height+(i._helper?i.position.top-r.top:i.position.top),e&&(i.size.width=i.size.height*i.aspectRatio),i.position.top=i._helper?r.top:0);i.offset.left=i.parentData.left+i.position.left;i.offset.top=i.parentData.top+i.position.top;f=Math.abs((i._helper?i.offset.left-u.left:i.offset.left-u.left)+i.sizeDiff.width);o=Math.abs((i._helper?i.offset.top-u.top:i.offset.top-r.top)+i.sizeDiff.height);s=i.containerElement.get(0)===i.element.parent().get(0);h=/relative|absolute/.test(i.containerElement.css("position"));s&&h&&(f-=i.parentData.left);f+i.size.width>=i.parentData.width&&(i.size.width=i.parentData.width-f,e&&(i.size.height=i.size.width/i.aspectRatio));o+i.size.height>=i.parentData.height&&(i.size.height=i.parentData.height-o,e&&(i.size.width=i.size.height*i.aspectRatio))},stop:function(){var t=n(this).data("ui-resizable"),r=t.options,u=t.containerOffset,f=t.containerPosition,e=t.containerElement,i=n(t.helper),o=i.offset(),s=i.outerWidth()-t.sizeDiff.width,h=i.outerHeight()-t.sizeDiff.height;t._helper&&!r.animate&&/relative/.test(e.css("position"))&&n(this).css({left:o.left-f.left-u.left,width:s,height:h});t._helper&&!r.animate&&/static/.test(e.css("position"))&&n(this).css({left:o.left-f.left-u.left,width:s,height:h})}});n.ui.plugin.add("resizable","alsoResize",{start:function(){var r=n(this).data("ui-resizable"),t=r.options,i=function(t){n(t).each(function(){var t=n(this);t.data("ui-resizable-alsoresize",{width:parseInt(t.width(),10),height:parseInt(t.height(),10),left:parseInt(t.css("left"),10),top:parseInt(t.css("top"),10)})})};typeof t.alsoResize!="object"||t.alsoResize.parentNode?i(t.alsoResize):t.alsoResize.length?(t.alsoResize=t.alsoResize[0],i(t.alsoResize)):n.each(t.alsoResize,function(n){i(n)})},resize:function(t,i){var r=n(this).data("ui-resizable"),u=r.options,f=r.originalSize,e=r.originalPosition,s={height:r.size.height-f.height||0,width:r.size.width-f.width||0,top:r.position.top-e.top||0,left:r.position.left-e.left||0},o=function(t,r){n(t).each(function(){var t=n(this),f=n(this).data("ui-resizable-alsoresize"),u={},e=r&&r.length?r:t.parents(i.originalElement[0]).length?["width","height"]:["width","height","top","left"];n.each(e,function(n,t){var i=(f[t]||0)+(s[t]||0);i&&i>=0&&(u[t]=i||null)});t.css(u)})};typeof u.alsoResize!="object"||u.alsoResize.nodeType?o(u.alsoResize):n.each(u.alsoResize,function(n,t){o(n,t)})},stop:function(){n(this).removeData("resizable-alsoresize")}});n.ui.plugin.add("resizable","ghost",{start:function(){var t=n(this).data("ui-resizable"),i=t.options,r=t.size;t.ghost=t.originalElement.clone();t.ghost.css({opacity:.25,display:"block",position:"relative",height:r.height,width:r.width,margin:0,left:0,top:0}).addClass("ui-resizable-ghost").addClass(typeof i.ghost=="string"?i.ghost:"");t.ghost.appendTo(t.helper)},resize:function(){var t=n(this).data("ui-resizable");t.ghost&&t.ghost.css({position:"relative",height:t.size.height,width:t.size.width})},stop:function(){var t=n(this).data("ui-resizable");t.ghost&&t.helper&&t.helper.get(0).removeChild(t.ghost.get(0))}});n.ui.plugin.add("resizable","grid",{resize:function(){var t=n(this).data("ui-resizable"),i=t.options,v=t.size,f=t.originalSize,e=t.originalPosition,h=t.axis,c=typeof i.grid=="number"?[i.grid,i.grid]:i.grid,o=c[0]||1,s=c[1]||1,l=Math.round((v.width-f.width)/o)*o,a=Math.round((v.height-f.height)/s)*s,r=f.width+l,u=f.height+a,y=i.maxWidth&&i.maxWidth<r,p=i.maxHeight&&i.maxHeight<u,w=i.minWidth&&i.minWidth>r,b=i.minHeight&&i.minHeight>u;i.grid=c;w&&(r=r+o);b&&(u=u+s);y&&(r=r-o);p&&(u=u-s);/^(se|s|e)$/.test(h)?(t.size.width=r,t.size.height=u):/^(ne)$/.test(h)?(t.size.width=r,t.size.height=u,t.position.top=e.top-a):/^(sw)$/.test(h)?(t.size.width=r,t.size.height=u,t.position.left=e.left-l):(t.size.width=r,t.size.height=u,t.position.top=e.top-a,t.position.left=e.left-l)}})}(jQuery),function(n){n.widget("ui.selectable",n.ui.mouse,{version:"1.10.2",options:{appendTo:"body",autoRefresh:!0,distance:0,filter:"*",tolerance:"touch",selected:null,selecting:null,start:null,stop:null,unselected:null,unselecting:null},_create:function(){var t,i=this;this.element.addClass("ui-selectable");this.dragged=!1;this.refresh=function(){t=n(i.options.filter,i.element[0]);t.addClass("ui-selectee");t.each(function(){var t=n(this),i=t.offset();n.data(this,"selectable-item",{element:this,$element:t,left:i.left,top:i.top,right:i.left+t.outerWidth(),bottom:i.top+t.outerHeight(),startselected:!1,selected:t.hasClass("ui-selected"),selecting:t.hasClass("ui-selecting"),unselecting:t.hasClass("ui-unselecting")})})};this.refresh();this.selectees=t.addClass("ui-selectee");this._mouseInit();this.helper=n("<div class='ui-selectable-helper'><\/div>")},_destroy:function(){this.selectees.removeClass("ui-selectee").removeData("selectable-item");this.element.removeClass("ui-selectable ui-selectable-disabled");this._mouseDestroy()},_mouseStart:function(t){var i=this,r=this.options;(this.opos=[t.pageX,t.pageY],this.options.disabled)||(this.selectees=n(r.filter,this.element[0]),this._trigger("start",t),n(r.appendTo).append(this.helper),this.helper.css({left:t.pageX,top:t.pageY,width:0,height:0}),r.autoRefresh&&this.refresh(),this.selectees.filter(".ui-selected").each(function(){var r=n.data(this,"selectable-item");r.startselected=!0;t.metaKey||t.ctrlKey||(r.$element.removeClass("ui-selected"),r.selected=!1,r.$element.addClass("ui-unselecting"),r.unselecting=!0,i._trigger("unselecting",t,{unselecting:r.element}))}),n(t.target).parents().addBack().each(function(){var u,r=n.data(this,"selectable-item");if(r)return u=!t.metaKey&&!t.ctrlKey||!r.$element.hasClass("ui-selected"),r.$element.removeClass(u?"ui-unselecting":"ui-selected").addClass(u?"ui-selecting":"ui-unselecting"),r.unselecting=!u,r.selecting=u,r.selected=u,u?i._trigger("selecting",t,{selecting:r.element}):i._trigger("unselecting",t,{unselecting:r.element}),!1}))},_mouseDrag:function(t){if(this.dragged=!0,!this.options.disabled){var e,o=this,s=this.options,i=this.opos[0],r=this.opos[1],u=t.pageX,f=t.pageY;return i>u&&(e=u,u=i,i=e),r>f&&(e=f,f=r,r=e),this.helper.css({left:i,top:r,width:u-i,height:f-r}),this.selectees.each(function(){var e=n.data(this,"selectable-item"),h=!1;e&&e.element!==o.element[0]&&(s.tolerance==="touch"?h=!(e.left>u||e.right<i||e.top>f||e.bottom<r):s.tolerance==="fit"&&(h=e.left>i&&e.right<u&&e.top>r&&e.bottom<f),h?(e.selected&&(e.$element.removeClass("ui-selected"),e.selected=!1),e.unselecting&&(e.$element.removeClass("ui-unselecting"),e.unselecting=!1),e.selecting||(e.$element.addClass("ui-selecting"),e.selecting=!0,o._trigger("selecting",t,{selecting:e.element}))):(e.selecting&&((t.metaKey||t.ctrlKey)&&e.startselected?(e.$element.removeClass("ui-selecting"),e.selecting=!1,e.$element.addClass("ui-selected"),e.selected=!0):(e.$element.removeClass("ui-selecting"),e.selecting=!1,e.startselected&&(e.$element.addClass("ui-unselecting"),e.unselecting=!0),o._trigger("unselecting",t,{unselecting:e.element}))),e.selected&&(t.metaKey||t.ctrlKey||e.startselected||(e.$element.removeClass("ui-selected"),e.selected=!1,e.$element.addClass("ui-unselecting"),e.unselecting=!0,o._trigger("unselecting",t,{unselecting:e.element})))))}),!1}},_mouseStop:function(t){var i=this;return this.dragged=!1,n(".ui-unselecting",this.element[0]).each(function(){var r=n.data(this,"selectable-item");r.$element.removeClass("ui-unselecting");r.unselecting=!1;r.startselected=!1;i._trigger("unselected",t,{unselected:r.element})}),n(".ui-selecting",this.element[0]).each(function(){var r=n.data(this,"selectable-item");r.$element.removeClass("ui-selecting").addClass("ui-selected");r.selecting=!1;r.selected=!0;r.startselected=!0;i._trigger("selected",t,{selected:r.element})}),this._trigger("stop",t),this.helper.remove(),!1}})}(jQuery),function(n){function t(n,t,i){return n>t&&n<t+i}function i(n){return/left|right/.test(n.css("float"))||/inline|table-cell/.test(n.css("display"))}n.widget("ui.sortable",n.ui.mouse,{version:"1.10.2",widgetEventPrefix:"sort",ready:!1,options:{appendTo:"parent",axis:!1,connectWith:!1,containment:!1,cursor:"auto",cursorAt:!1,dropOnEmpty:!0,forcePlaceholderSize:!1,forceHelperSize:!1,grid:!1,handle:!1,helper:"original",items:"> *",opacity:!1,placeholder:!1,revert:!1,scroll:!0,scrollSensitivity:20,scrollSpeed:20,scope:"default",tolerance:"intersect",zIndex:1e3,activate:null,beforeStop:null,change:null,deactivate:null,out:null,over:null,receive:null,remove:null,sort:null,start:null,stop:null,update:null},_create:function(){var n=this.options;this.containerCache={};this.element.addClass("ui-sortable");this.refresh();this.floating=this.items.length?n.axis==="x"||i(this.items[0].item):!1;this.offset=this.element.offset();this._mouseInit();this.ready=!0},_destroy:function(){this.element.removeClass("ui-sortable ui-sortable-disabled");this._mouseDestroy();for(var n=this.items.length-1;n>=0;n--)this.items[n].item.removeData(this.widgetName+"-item");return this},_setOption:function(t,i){t==="disabled"?(this.options[t]=i,this.widget().toggleClass("ui-sortable-disabled",!!i)):n.Widget.prototype._setOption.apply(this,arguments)},_mouseCapture:function(t,i){var r=null,f=!1,u=this;return this.reverting?!1:this.options.disabled||this.options.type==="static"?!1:(this._refreshItems(t),n(t.target).parents().each(function(){if(n.data(this,u.widgetName+"-item")===u)return r=n(this),!1}),n.data(t.target,u.widgetName+"-item")===u&&(r=n(t.target)),!r)?!1:this.options.handle&&!i&&(n(this.options.handle,r).find("*").addBack().each(function(){this===t.target&&(f=!0)}),!f)?!1:(this.currentItem=r,this._removeCurrentsFromItems(),!0)},_mouseStart:function(t,i,r){var f,e,u=this.options;if(this.currentContainer=this,this.refreshPositions(),this.helper=this._createHelper(t),this._cacheHelperProportions(),this._cacheMargins(),this.scrollParent=this.helper.scrollParent(),this.offset=this.currentItem.offset(),this.offset={top:this.offset.top-this.margins.top,left:this.offset.left-this.margins.left},n.extend(this.offset,{click:{left:t.pageX-this.offset.left,top:t.pageY-this.offset.top},parent:this._getParentOffset(),relative:this._getRelativeOffset()}),this.helper.css("position","absolute"),this.cssPosition=this.helper.css("position"),this.originalPosition=this._generatePosition(t),this.originalPageX=t.pageX,this.originalPageY=t.pageY,u.cursorAt&&this._adjustOffsetFromHelper(u.cursorAt),this.domPosition={prev:this.currentItem.prev()[0],parent:this.currentItem.parent()[0]},this.helper[0]!==this.currentItem[0]&&this.currentItem.hide(),this._createPlaceholder(),u.containment&&this._setContainment(),u.cursor&&u.cursor!=="auto"&&(e=this.document.find("body"),this.storedCursor=e.css("cursor"),e.css("cursor",u.cursor),this.storedStylesheet=n("<style>*{ cursor: "+u.cursor+" !important; }<\/style>").appendTo(e)),u.opacity&&(this.helper.css("opacity")&&(this._storedOpacity=this.helper.css("opacity")),this.helper.css("opacity",u.opacity)),u.zIndex&&(this.helper.css("zIndex")&&(this._storedZIndex=this.helper.css("zIndex")),this.helper.css("zIndex",u.zIndex)),this.scrollParent[0]!==document&&this.scrollParent[0].tagName!=="HTML"&&(this.overflowOffset=this.scrollParent.offset()),this._trigger("start",t,this._uiHash()),this._preserveHelperProportions||this._cacheHelperProportions(),!r)for(f=this.containers.length-1;f>=0;f--)this.containers[f]._trigger("activate",t,this._uiHash(this));return n.ui.ddmanager&&(n.ui.ddmanager.current=this),n.ui.ddmanager&&!u.dropBehaviour&&n.ui.ddmanager.prepareOffsets(this,t),this.dragging=!0,this.helper.addClass("ui-sortable-helper"),this._mouseDrag(t),!0},_mouseDrag:function(t){var e,u,f,o,i=this.options,r=!1;for(this.position=this._generatePosition(t),this.positionAbs=this._convertPositionTo("absolute"),this.lastPositionAbs||(this.lastPositionAbs=this.positionAbs),this.options.scroll&&(this.scrollParent[0]!==document&&this.scrollParent[0].tagName!=="HTML"?(this.overflowOffset.top+this.scrollParent[0].offsetHeight-t.pageY<i.scrollSensitivity?this.scrollParent[0].scrollTop=r=this.scrollParent[0].scrollTop+i.scrollSpeed:t.pageY-this.overflowOffset.top<i.scrollSensitivity&&(this.scrollParent[0].scrollTop=r=this.scrollParent[0].scrollTop-i.scrollSpeed),this.overflowOffset.left+this.scrollParent[0].offsetWidth-t.pageX<i.scrollSensitivity?this.scrollParent[0].scrollLeft=r=this.scrollParent[0].scrollLeft+i.scrollSpeed:t.pageX-this.overflowOffset.left<i.scrollSensitivity&&(this.scrollParent[0].scrollLeft=r=this.scrollParent[0].scrollLeft-i.scrollSpeed)):(t.pageY-n(document).scrollTop()<i.scrollSensitivity?r=n(document).scrollTop(n(document).scrollTop()-i.scrollSpeed):n(window).height()-(t.pageY-n(document).scrollTop())<i.scrollSensitivity&&(r=n(document).scrollTop(n(document).scrollTop()+i.scrollSpeed)),t.pageX-n(document).scrollLeft()<i.scrollSensitivity?r=n(document).scrollLeft(n(document).scrollLeft()-i.scrollSpeed):n(window).width()-(t.pageX-n(document).scrollLeft())<i.scrollSensitivity&&(r=n(document).scrollLeft(n(document).scrollLeft()+i.scrollSpeed))),r!==!1&&n.ui.ddmanager&&!i.dropBehaviour&&n.ui.ddmanager.prepareOffsets(this,t)),this.positionAbs=this._convertPositionTo("absolute"),this.options.axis&&this.options.axis==="y"||(this.helper[0].style.left=this.position.left+"px"),this.options.axis&&this.options.axis==="x"||(this.helper[0].style.top=this.position.top+"px"),e=this.items.length-1;e>=0;e--)if((u=this.items[e],f=u.item[0],o=this._intersectsWithPointer(u),o)&&u.instance===this.currentContainer&&f!==this.currentItem[0]&&this.placeholder[o===1?"next":"prev"]()[0]!==f&&!n.contains(this.placeholder[0],f)&&(this.options.type==="semi-dynamic"?!n.contains(this.element[0],f):!0)){if(this.direction=o===1?"down":"up",this.options.tolerance==="pointer"||this._intersectsWithSides(u))this._rearrange(t,u);else break;this._trigger("change",t,this._uiHash());break}return this._contactContainers(t),n.ui.ddmanager&&n.ui.ddmanager.drag(this,t),this._trigger("sort",t,this._uiHash()),this.lastPositionAbs=this.positionAbs,!1},_mouseStop:function(t,i){if(t){if(n.ui.ddmanager&&!this.options.dropBehaviour&&n.ui.ddmanager.drop(this,t),this.options.revert){var e=this,f=this.placeholder.offset(),r=this.options.axis,u={};r&&r!=="x"||(u.left=f.left-this.offset.parent.left-this.margins.left+(this.offsetParent[0]===document.body?0:this.offsetParent[0].scrollLeft));r&&r!=="y"||(u.top=f.top-this.offset.parent.top-this.margins.top+(this.offsetParent[0]===document.body?0:this.offsetParent[0].scrollTop));this.reverting=!0;n(this.helper).animate(u,parseInt(this.options.revert,10)||500,function(){e._clear(t)})}else this._clear(t,i);return!1}},cancel:function(){if(this.dragging){this._mouseUp({target:null});this.options.helper==="original"?this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper"):this.currentItem.show();for(var t=this.containers.length-1;t>=0;t--)this.containers[t]._trigger("deactivate",null,this._uiHash(this)),this.containers[t].containerCache.over&&(this.containers[t]._trigger("out",null,this._uiHash(this)),this.containers[t].containerCache.over=0)}return this.placeholder&&(this.placeholder[0].parentNode&&this.placeholder[0].parentNode.removeChild(this.placeholder[0]),this.options.helper!=="original"&&this.helper&&this.helper[0].parentNode&&this.helper.remove(),n.extend(this,{helper:null,dragging:!1,reverting:!1,_noFinalSort:null}),this.domPosition.prev?n(this.domPosition.prev).after(this.currentItem):n(this.domPosition.parent).prepend(this.currentItem)),this},serialize:function(t){var r=this._getItemsAsjQuery(t&&t.connected),i=[];return t=t||{},n(r).each(function(){var r=(n(t.item||this).attr(t.attribute||"id")||"").match(t.expression||/(.+)[\-=_](.+)/);r&&i.push((t.key||r[1]+"[]")+"="+(t.key&&t.expression?r[1]:r[2]))}),!i.length&&t.key&&i.push(t.key+"="),i.join("&")},toArray:function(t){var r=this._getItemsAsjQuery(t&&t.connected),i=[];return t=t||{},r.each(function(){i.push(n(t.item||this).attr(t.attribute||"id")||"")}),i},_intersectsWith:function(n){var t=this.positionAbs.left,h=t+this.helperProportions.width,i=this.positionAbs.top,c=i+this.helperProportions.height,r=n.left,f=r+n.width,u=n.top,e=u+n.height,o=this.offset.click.top,s=this.offset.click.left,l=i+o>u&&i+o<e&&t+s>r&&t+s<f;return this.options.tolerance==="pointer"||this.options.forcePointerForContainers||this.options.tolerance!=="pointer"&&this.helperProportions[this.floating?"width":"height"]>n[this.floating?"width":"height"]?l:r<t+this.helperProportions.width/2&&h-this.helperProportions.width/2<f&&u<i+this.helperProportions.height/2&&c-this.helperProportions.height/2<e},_intersectsWithPointer:function(n){var u=this.options.axis==="x"||t(this.positionAbs.top+this.offset.click.top,n.top,n.height),f=this.options.axis==="y"||t(this.positionAbs.left+this.offset.click.left,n.left,n.width),e=u&&f,i=this._getDragVerticalDirection(),r=this._getDragHorizontalDirection();return e?this.floating?r&&r==="right"||i==="down"?2:1:i&&(i==="down"?2:1):!1},_intersectsWithSides:function(n){var u=t(this.positionAbs.top+this.offset.click.top,n.top+n.height/2,n.height),f=t(this.positionAbs.left+this.offset.click.left,n.left+n.width/2,n.width),i=this._getDragVerticalDirection(),r=this._getDragHorizontalDirection();return this.floating&&r?r==="right"&&f||r==="left"&&!f:i&&(i==="down"&&u||i==="up"&&!u)},_getDragVerticalDirection:function(){var n=this.positionAbs.top-this.lastPositionAbs.top;return n!==0&&(n>0?"down":"up")},_getDragHorizontalDirection:function(){var n=this.positionAbs.left-this.lastPositionAbs.left;return n!==0&&(n>0?"right":"left")},refresh:function(n){return this._refreshItems(n),this.refreshPositions(),this},_connectWith:function(){var n=this.options;return n.connectWith.constructor===String?[n.connectWith]:n.connectWith},_getItemsAsjQuery:function(t){var r,u,e,i,s=[],f=[],o=this._connectWith();if(o&&t)for(r=o.length-1;r>=0;r--)for(e=n(o[r]),u=e.length-1;u>=0;u--)i=n.data(e[u],this.widgetFullName),i&&i!==this&&!i.options.disabled&&f.push([n.isFunction(i.options.items)?i.options.items.call(i.element):n(i.options.items,i.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"),i]);for(f.push([n.isFunction(this.options.items)?this.options.items.call(this.element,null,{options:this.options,item:this.currentItem}):n(this.options.items,this.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"),this]),r=f.length-1;r>=0;r--)f[r][0].each(function(){s.push(this)});return n(s)},_removeCurrentsFromItems:function(){var t=this.currentItem.find(":data("+this.widgetName+"-item)");this.items=n.grep(this.items,function(n){for(var i=0;i<t.length;i++)if(t[i]===n.item[0])return!1;return!0})},_refreshItems:function(t){this.items=[];this.containers=[this];var r,u,e,i,o,s,h,l,a=this.items,f=[[n.isFunction(this.options.items)?this.options.items.call(this.element[0],t,{item:this.currentItem}):n(this.options.items,this.element),this]],c=this._connectWith();if(c&&this.ready)for(r=c.length-1;r>=0;r--)for(e=n(c[r]),u=e.length-1;u>=0;u--)i=n.data(e[u],this.widgetFullName),i&&i!==this&&!i.options.disabled&&(f.push([n.isFunction(i.options.items)?i.options.items.call(i.element[0],t,{item:this.currentItem}):n(i.options.items,i.element),i]),this.containers.push(i));for(r=f.length-1;r>=0;r--)for(o=f[r][1],s=f[r][0],u=0,l=s.length;u<l;u++)h=n(s[u]),h.data(this.widgetName+"-item",o),a.push({item:h,instance:o,width:0,height:0,left:0,top:0})},refreshPositions:function(t){this.offsetParent&&this.helper&&(this.offset.parent=this._getParentOffset());for(var r,f,u,i=this.items.length-1;i>=0;i--)(r=this.items[i],r.instance!==this.currentContainer&&this.currentContainer&&r.item[0]!==this.currentItem[0])||(f=this.options.toleranceElement?n(this.options.toleranceElement,r.item):r.item,t||(r.width=f.outerWidth(),r.height=f.outerHeight()),u=f.offset(),r.left=u.left,r.top=u.top);if(this.options.custom&&this.options.custom.refreshContainers)this.options.custom.refreshContainers.call(this);else for(i=this.containers.length-1;i>=0;i--)u=this.containers[i].element.offset(),this.containers[i].containerCache.left=u.left,this.containers[i].containerCache.top=u.top,this.containers[i].containerCache.width=this.containers[i].element.outerWidth(),this.containers[i].containerCache.height=this.containers[i].element.outerHeight();return this},_createPlaceholder:function(t){t=t||this;var r,i=t.options;i.placeholder&&i.placeholder.constructor!==String||(r=i.placeholder,i.placeholder={element:function(){var u=t.currentItem[0].nodeName.toLowerCase(),i=n(t.document[0].createElement(u)).addClass(r||t.currentItem[0].className+" ui-sortable-placeholder").removeClass("ui-sortable-helper");return u==="tr"?i.append("<td colspan='99'>&#160;<\/td>"):u==="img"&&i.attr("src",t.currentItem.attr("src")),r||i.css("visibility","hidden"),i},update:function(n,u){(!r||i.forcePlaceholderSize)&&(u.height()||u.height(t.currentItem.innerHeight()-parseInt(t.currentItem.css("paddingTop")||0,10)-parseInt(t.currentItem.css("paddingBottom")||0,10)),u.width()||u.width(t.currentItem.innerWidth()-parseInt(t.currentItem.css("paddingLeft")||0,10)-parseInt(t.currentItem.css("paddingRight")||0,10)))}});t.placeholder=n(i.placeholder.element.call(t.element,t.currentItem));t.currentItem.after(t.placeholder);i.placeholder.update(t,t.placeholder)},_contactContainers:function(r){for(var f,v,s,l,y,h,o,p,a,c=null,e=null,u=this.containers.length-1;u>=0;u--)if(!n.contains(this.currentItem[0],this.containers[u].element[0]))if(this._intersectsWith(this.containers[u].containerCache)){if(c&&n.contains(this.containers[u].element[0],c.element[0]))continue;c=this.containers[u];e=u}else this.containers[u].containerCache.over&&(this.containers[u]._trigger("out",r,this._uiHash(this)),this.containers[u].containerCache.over=0);if(c)if(this.containers.length===1)this.containers[e].containerCache.over||(this.containers[e]._trigger("over",r,this._uiHash(this)),this.containers[e].containerCache.over=1);else{for(v=1e4,s=null,a=c.floating||i(this.currentItem),l=a?"left":"top",y=a?"width":"height",h=this.positionAbs[l]+this.offset.click[l],f=this.items.length-1;f>=0;f--)n.contains(this.containers[e].element[0],this.items[f].item[0])&&this.items[f].item[0]!==this.currentItem[0]&&(!a||t(this.positionAbs.top+this.offset.click.top,this.items[f].top,this.items[f].height))&&(o=this.items[f].item.offset()[l],p=!1,Math.abs(o-h)>Math.abs(o+this.items[f][y]-h)&&(p=!0,o+=this.items[f][y]),Math.abs(o-h)<v&&(v=Math.abs(o-h),s=this.items[f],this.direction=p?"up":"down"));if(!s&&!this.options.dropOnEmpty)return;if(this.currentContainer===this.containers[e])return;s?this._rearrange(r,s,null,!0):this._rearrange(r,null,this.containers[e].element,!0);this._trigger("change",r,this._uiHash());this.containers[e]._trigger("change",r,this._uiHash(this));this.currentContainer=this.containers[e];this.options.placeholder.update(this.currentContainer,this.placeholder);this.containers[e]._trigger("over",r,this._uiHash(this));this.containers[e].containerCache.over=1}},_createHelper:function(t){var r=this.options,i=n.isFunction(r.helper)?n(r.helper.apply(this.element[0],[t,this.currentItem])):r.helper==="clone"?this.currentItem.clone():this.currentItem;return i.parents("body").length||n(r.appendTo!=="parent"?r.appendTo:this.currentItem[0].parentNode)[0].appendChild(i[0]),i[0]===this.currentItem[0]&&(this._storedCSS={width:this.currentItem[0].style.width,height:this.currentItem[0].style.height,position:this.currentItem.css("position"),top:this.currentItem.css("top"),left:this.currentItem.css("left")}),(!i[0].style.width||r.forceHelperSize)&&i.width(this.currentItem.width()),(!i[0].style.height||r.forceHelperSize)&&i.height(this.currentItem.height()),i},_adjustOffsetFromHelper:function(t){typeof t=="string"&&(t=t.split(" "));n.isArray(t)&&(t={left:+t[0],top:+t[1]||0});"left"in t&&(this.offset.click.left=t.left+this.margins.left);"right"in t&&(this.offset.click.left=this.helperProportions.width-t.right+this.margins.left);"top"in t&&(this.offset.click.top=t.top+this.margins.top);"bottom"in t&&(this.offset.click.top=this.helperProportions.height-t.bottom+this.margins.top)},_getParentOffset:function(){this.offsetParent=this.helper.offsetParent();var t=this.offsetParent.offset();return this.cssPosition==="absolute"&&this.scrollParent[0]!==document&&n.contains(this.scrollParent[0],this.offsetParent[0])&&(t.left+=this.scrollParent.scrollLeft(),t.top+=this.scrollParent.scrollTop()),(this.offsetParent[0]===document.body||this.offsetParent[0].tagName&&this.offsetParent[0].tagName.toLowerCase()==="html"&&n.ui.ie)&&(t={top:0,left:0}),{top:t.top+(parseInt(this.offsetParent.css("borderTopWidth"),10)||0),left:t.left+(parseInt(this.offsetParent.css("borderLeftWidth"),10)||0)}},_getRelativeOffset:function(){if(this.cssPosition==="relative"){var n=this.currentItem.position();return{top:n.top-(parseInt(this.helper.css("top"),10)||0)+this.scrollParent.scrollTop(),left:n.left-(parseInt(this.helper.css("left"),10)||0)+this.scrollParent.scrollLeft()}}return{top:0,left:0}},_cacheMargins:function(){this.margins={left:parseInt(this.currentItem.css("marginLeft"),10)||0,top:parseInt(this.currentItem.css("marginTop"),10)||0}},_cacheHelperProportions:function(){this.helperProportions={width:this.helper.outerWidth(),height:this.helper.outerHeight()}},_setContainment:function(){var t,r,u,i=this.options;i.containment==="parent"&&(i.containment=this.helper[0].parentNode);(i.containment==="document"||i.containment==="window")&&(this.containment=[0-this.offset.relative.left-this.offset.parent.left,0-this.offset.relative.top-this.offset.parent.top,n(i.containment==="document"?document:window).width()-this.helperProportions.width-this.margins.left,(n(i.containment==="document"?document:window).height()||document.body.parentNode.scrollHeight)-this.helperProportions.height-this.margins.top]);/^(document|window|parent)$/.test(i.containment)||(t=n(i.containment)[0],r=n(i.containment).offset(),u=n(t).css("overflow")!=="hidden",this.containment=[r.left+(parseInt(n(t).css("borderLeftWidth"),10)||0)+(parseInt(n(t).css("paddingLeft"),10)||0)-this.margins.left,r.top+(parseInt(n(t).css("borderTopWidth"),10)||0)+(parseInt(n(t).css("paddingTop"),10)||0)-this.margins.top,r.left+(u?Math.max(t.scrollWidth,t.offsetWidth):t.offsetWidth)-(parseInt(n(t).css("borderLeftWidth"),10)||0)-(parseInt(n(t).css("paddingRight"),10)||0)-this.helperProportions.width-this.margins.left,r.top+(u?Math.max(t.scrollHeight,t.offsetHeight):t.offsetHeight)-(parseInt(n(t).css("borderTopWidth"),10)||0)-(parseInt(n(t).css("paddingBottom"),10)||0)-this.helperProportions.height-this.margins.top])},_convertPositionTo:function(t,i){i||(i=this.position);var r=t==="absolute"?1:-1,u=this.cssPosition==="absolute"&&!(this.scrollParent[0]!==document&&n.contains(this.scrollParent[0],this.offsetParent[0]))?this.offsetParent:this.scrollParent,f=/(html|body)/i.test(u[0].tagName);return{top:i.top+this.offset.relative.top*r+this.offset.parent.top*r-(this.cssPosition==="fixed"?-this.scrollParent.scrollTop():f?0:u.scrollTop())*r,left:i.left+this.offset.relative.left*r+this.offset.parent.left*r-(this.cssPosition==="fixed"?-this.scrollParent.scrollLeft():f?0:u.scrollLeft())*r}},_generatePosition:function(t){var r,u,i=this.options,f=t.pageX,e=t.pageY,o=this.cssPosition==="absolute"&&!(this.scrollParent[0]!==document&&n.contains(this.scrollParent[0],this.offsetParent[0]))?this.offsetParent:this.scrollParent,s=/(html|body)/i.test(o[0].tagName);return this.cssPosition!=="relative"||this.scrollParent[0]!==document&&this.scrollParent[0]!==this.offsetParent[0]||(this.offset.relative=this._getRelativeOffset()),this.originalPosition&&(this.containment&&(t.pageX-this.offset.click.left<this.containment[0]&&(f=this.containment[0]+this.offset.click.left),t.pageY-this.offset.click.top<this.containment[1]&&(e=this.containment[1]+this.offset.click.top),t.pageX-this.offset.click.left>this.containment[2]&&(f=this.containment[2]+this.offset.click.left),t.pageY-this.offset.click.top>this.containment[3]&&(e=this.containment[3]+this.offset.click.top)),i.grid&&(r=this.originalPageY+Math.round((e-this.originalPageY)/i.grid[1])*i.grid[1],e=this.containment?r-this.offset.click.top>=this.containment[1]&&r-this.offset.click.top<=this.containment[3]?r:r-this.offset.click.top>=this.containment[1]?r-i.grid[1]:r+i.grid[1]:r,u=this.originalPageX+Math.round((f-this.originalPageX)/i.grid[0])*i.grid[0],f=this.containment?u-this.offset.click.left>=this.containment[0]&&u-this.offset.click.left<=this.containment[2]?u:u-this.offset.click.left>=this.containment[0]?u-i.grid[0]:u+i.grid[0]:u)),{top:e-this.offset.click.top-this.offset.relative.top-this.offset.parent.top+(this.cssPosition==="fixed"?-this.scrollParent.scrollTop():s?0:o.scrollTop()),left:f-this.offset.click.left-this.offset.relative.left-this.offset.parent.left+(this.cssPosition==="fixed"?-this.scrollParent.scrollLeft():s?0:o.scrollLeft())}},_rearrange:function(n,t,i,r){i?i[0].appendChild(this.placeholder[0]):t.item[0].parentNode.insertBefore(this.placeholder[0],this.direction==="down"?t.item[0]:t.item[0].nextSibling);this.counter=this.counter?++this.counter:1;var u=this.counter;this._delay(function(){u===this.counter&&this.refreshPositions(!r)})},_clear:function(n,t){this.reverting=!1;var i,r=[];if(!this._noFinalSort&&this.currentItem.parent().length&&this.placeholder.before(this.currentItem),this._noFinalSort=null,this.helper[0]===this.currentItem[0]){for(i in this._storedCSS)(this._storedCSS[i]==="auto"||this._storedCSS[i]==="static")&&(this._storedCSS[i]="");this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper")}else this.currentItem.show();for(this.fromOutside&&!t&&r.push(function(n){this._trigger("receive",n,this._uiHash(this.fromOutside))}),(this.fromOutside||this.domPosition.prev!==this.currentItem.prev().not(".ui-sortable-helper")[0]||this.domPosition.parent!==this.currentItem.parent()[0])&&!t&&r.push(function(n){this._trigger("update",n,this._uiHash())}),this!==this.currentContainer&&(t||(r.push(function(n){this._trigger("remove",n,this._uiHash())}),r.push(function(n){return function(t){n._trigger("receive",t,this._uiHash(this))}}.call(this,this.currentContainer)),r.push(function(n){return function(t){n._trigger("update",t,this._uiHash(this))}}.call(this,this.currentContainer)))),i=this.containers.length-1;i>=0;i--)t||r.push(function(n){return function(t){n._trigger("deactivate",t,this._uiHash(this))}}.call(this,this.containers[i])),this.containers[i].containerCache.over&&(r.push(function(n){return function(t){n._trigger("out",t,this._uiHash(this))}}.call(this,this.containers[i])),this.containers[i].containerCache.over=0);if(this.storedCursor&&(this.document.find("body").css("cursor",this.storedCursor),this.storedStylesheet.remove()),this._storedOpacity&&this.helper.css("opacity",this._storedOpacity),this._storedZIndex&&this.helper.css("zIndex",this._storedZIndex==="auto"?"":this._storedZIndex),this.dragging=!1,this.cancelHelperRemoval){if(!t){for(this._trigger("beforeStop",n,this._uiHash()),i=0;i<r.length;i++)r[i].call(this,n);this._trigger("stop",n,this._uiHash())}return this.fromOutside=!1,!1}if(t||this._trigger("beforeStop",n,this._uiHash()),this.placeholder[0].parentNode.removeChild(this.placeholder[0]),this.helper[0]!==this.currentItem[0]&&this.helper.remove(),this.helper=null,!t){for(i=0;i<r.length;i++)r[i].call(this,n);this._trigger("stop",n,this._uiHash())}return this.fromOutside=!1,!0},_trigger:function(){n.Widget.prototype._trigger.apply(this,arguments)===!1&&this.cancel()},_uiHash:function(t){var i=t||this;return{helper:i.helper,placeholder:i.placeholder||n([]),position:i.position,originalPosition:i.originalPosition,offset:i.positionAbs,item:i.currentItem,sender:t?t.element:null}}})}(jQuery),function(n,t){var i="ui-effects-";n.effects={effect:{}},function(n,t){function e(n,t,i){var r=s[t.type]||{};return n==null?i||!t.def?null:t.def:(n=r.floor?~~n:parseFloat(n),isNaN(n))?t.def:r.mod?(n+r.mod)%r.mod:0>n?0:r.max<n?r.max:n}function l(t){var e=i(),o=e._rgba=[];return(t=t.toLowerCase(),r(v,function(n,i){var r,s=i.re.exec(t),h=s&&i.parse(s),f=i.space||"rgba";if(h)return r=e[f](h),e[u[f].cache]=r[u[f].cache],o=e._rgba=r._rgba,!1}),o.length)?(o.join()==="0,0,0,0"&&n.extend(o,f.transparent),e):f[t]}function o(n,t,i){return(i=(i+1)%1,i*6<1)?n+(t-n)*i*6:i*2<1?t:i*3<2?n+(t-n)*(2/3-i)*6:n}var a=/^([\-+])=\s*(\d+\.?\d*)/,v=[{re:/rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,parse:function(n){return[n[1],n[2],n[3],n[4]]}},{re:/rgba?\(\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,parse:function(n){return[n[1]*2.55,n[2]*2.55,n[3]*2.55,n[4]]}},{re:/#([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})/,parse:function(n){return[parseInt(n[1],16),parseInt(n[2],16),parseInt(n[3],16)]}},{re:/#([a-f0-9])([a-f0-9])([a-f0-9])/,parse:function(n){return[parseInt(n[1]+n[1],16),parseInt(n[2]+n[2],16),parseInt(n[3]+n[3],16)]}},{re:/hsla?\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,space:"hsla",parse:function(n){return[n[1],n[2]/100,n[3]/100,n[4]]}}],i=n.Color=function(t,i,r,u){return new n.Color.fn.parse(t,i,r,u)},u={rgba:{props:{red:{idx:0,type:"byte"},green:{idx:1,type:"byte"},blue:{idx:2,type:"byte"}}},hsla:{props:{hue:{idx:0,type:"degrees"},saturation:{idx:1,type:"percent"},lightness:{idx:2,type:"percent"}}}},s={byte:{floor:!0,max:255},percent:{max:1},degrees:{mod:360,floor:!0}},h=i.support={},c=n("<p>")[0],f,r=n.each;c.style.cssText="background-color:rgba(1,1,1,.5)";h.rgba=c.style.backgroundColor.indexOf("rgba")>-1;r(u,function(n,t){t.cache="_"+n;t.props.alpha={idx:3,type:"percent",def:1}});i.fn=n.extend(i.prototype,{parse:function(o,s,h,c){if(o===t)return this._rgba=[null,null,null,null],this;(o.jquery||o.nodeType)&&(o=n(o).css(s),s=t);var a=this,v=n.type(o),y=this._rgba=[];return(s!==t&&(o=[o,s,h,c],v="array"),v==="string")?this.parse(l(o)||f._default):v==="array"?(r(u.rgba.props,function(n,t){y[t.idx]=e(o[t.idx],t)}),this):v==="object"?(o instanceof i?r(u,function(n,t){o[t.cache]&&(a[t.cache]=o[t.cache].slice())}):r(u,function(t,i){var u=i.cache;r(i.props,function(n,t){if(!a[u]&&i.to){if(n==="alpha"||o[n]==null)return;a[u]=i.to(a._rgba)}a[u][t.idx]=e(o[n],t,!0)});a[u]&&n.inArray(null,a[u].slice(0,3))<0&&(a[u][3]=1,i.from&&(a._rgba=i.from(a[u])))}),this):void 0},is:function(n){var e=i(n),t=!0,f=this;return r(u,function(n,i){var o,u=e[i.cache];return u&&(o=f[i.cache]||i.to&&i.to(f._rgba)||[],r(i.props,function(n,i){if(u[i.idx]!=null)return t=u[i.idx]===o[i.idx]})),t}),t},_space:function(){var n=[],t=this;return r(u,function(i,r){t[r.cache]&&n.push(i)}),n.pop()},transition:function(n,t){var f=i(n),c=f._space(),o=u[c],l=this.alpha()===0?i("transparent"):this,a=l[o.cache]||o.to(l._rgba),h=a.slice();return f=f[o.cache],r(o.props,function(n,i){var c=i.idx,r=a[c],u=f[c],o=s[i.type]||{};u!==null&&(r===null?h[c]=u:(o.mod&&(u-r>o.mod/2?r+=o.mod:r-u>o.mod/2&&(r-=o.mod)),h[c]=e((u-r)*t+r,i)))}),this[c](h)},blend:function(t){if(this._rgba[3]===1)return this;var r=this._rgba.slice(),u=r.pop(),f=i(t)._rgba;return i(n.map(r,function(n,t){return(1-u)*f[t]+u*n}))},toRgbaString:function(){var i="rgba(",t=n.map(this._rgba,function(n,t){return n==null?t>2?1:0:n});return t[3]===1&&(t.pop(),i="rgb("),i+t.join()+")"},toHslaString:function(){var i="hsla(",t=n.map(this.hsla(),function(n,t){return n==null&&(n=t>2?1:0),t&&t<3&&(n=Math.round(n*100)+"%"),n});return t[3]===1&&(t.pop(),i="hsl("),i+t.join()+")"},toHexString:function(t){var i=this._rgba.slice(),r=i.pop();return t&&i.push(~~(r*255)),"#"+n.map(i,function(n){return n=(n||0).toString(16),n.length===1?"0"+n:n}).join("")},toString:function(){return this._rgba[3]===0?"transparent":this.toRgbaString()}});i.fn.parse.prototype=i.fn;u.hsla.to=function(n){if(n[0]==null||n[1]==null||n[2]==null)return[null,null,null,n[3]];var i=n[0]/255,r=n[1]/255,f=n[2]/255,s=n[3],u=Math.max(i,r,f),e=Math.min(i,r,f),t=u-e,o=u+e,h=o*.5,c,l;return c=e===u?0:i===u?60*(r-f)/t+360:r===u?60*(f-i)/t+120:60*(i-r)/t+240,l=t===0?0:h<=.5?t/o:t/(2-o),[Math.round(c)%360,l,h,s==null?1:s]};u.hsla.from=function(n){if(n[0]==null||n[1]==null||n[2]==null)return[null,null,null,n[3]];var r=n[0]/360,u=n[1],t=n[2],e=n[3],i=t<=.5?t*(1+u):t+u-t*u,f=2*t-i;return[Math.round(o(f,i,r+1/3)*255),Math.round(o(f,i,r)*255),Math.round(o(f,i,r-1/3)*255),e]};r(u,function(u,f){var s=f.props,o=f.cache,h=f.to,c=f.from;i.fn[u]=function(u){if(h&&!this[o]&&(this[o]=h(this._rgba)),u===t)return this[o].slice();var l,a=n.type(u),v=a==="array"||a==="object"?u:arguments,f=this[o].slice();return r(s,function(n,t){var i=v[a==="object"?n:t.idx];i==null&&(i=f[t.idx]);f[t.idx]=e(i,t)}),c?(l=i(c(f)),l[o]=f,l):i(f)};r(s,function(t,r){i.fn[t]||(i.fn[t]=function(i){var f=n.type(i),h=t==="alpha"?this._hsla?"hsla":"rgba":u,o=this[h](),s=o[r.idx],e;return f==="undefined"?s:(f==="function"&&(i=i.call(this,s),f=n.type(i)),i==null&&r.empty)?this:(f==="string"&&(e=a.exec(i),e&&(i=s+parseFloat(e[2])*(e[1]==="+"?1:-1))),o[r.idx]=i,this[h](o))})})});i.hook=function(t){var u=t.split(" ");r(u,function(t,r){n.cssHooks[r]={set:function(t,u){var o,f,e="";if(u!=="transparent"&&(n.type(u)!=="string"||(o=l(u)))){if(u=i(o||u),!h.rgba&&u._rgba[3]!==1){for(f=r==="backgroundColor"?t.parentNode:t;(e===""||e==="transparent")&&f&&f.style;)try{e=n.css(f,"backgroundColor");f=f.parentNode}catch(s){}u=u.blend(e&&e!=="transparent"?e:"_default")}u=u.toRgbaString()}try{t.style[r]=u}catch(s){}}};n.fx.step[r]=function(t){t.colorInit||(t.start=i(t.elem,r),t.end=i(t.end),t.colorInit=!0);n.cssHooks[r].set(t.elem,t.start.transition(t.end,t.pos))}})};i.hook("backgroundColor borderBottomColor borderLeftColor borderRightColor borderTopColor color columnRuleColor outlineColor textDecorationColor textEmphasisColor");n.cssHooks.borderColor={expand:function(n){var t={};return r(["Top","Right","Bottom","Left"],function(i,r){t["border"+r+"Color"]=n}),t}};f=n.Color.names={aqua:"#00ffff",black:"#000000",blue:"#0000ff",fuchsia:"#ff00ff",gray:"#808080",green:"#008000",lime:"#00ff00",maroon:"#800000",navy:"#000080",olive:"#808000",purple:"#800080",red:"#ff0000",silver:"#c0c0c0",teal:"#008080",white:"#ffffff",yellow:"#ffff00",transparent:[null,null,null,0],_default:"#ffffff"}}(jQuery),function(){function i(t){var r,u,i=t.ownerDocument.defaultView?t.ownerDocument.defaultView.getComputedStyle(t,null):t.currentStyle,f={};if(i&&i.length&&i[0]&&i[i[0]])for(u=i.length;u--;)r=i[u],typeof i[r]=="string"&&(f[n.camelCase(r)]=i[r]);else for(r in i)typeof i[r]=="string"&&(f[r]=i[r]);return f}function f(t,i){var e={},r,f;for(r in i)f=i[r],t[r]!==f&&(u[r]||(n.fx.step[r]||!isNaN(parseFloat(f)))&&(e[r]=f));return e}var r=["add","remove","toggle"],u={border:1,borderBottom:1,borderColor:1,borderLeft:1,borderRight:1,borderTop:1,borderWidth:1,margin:1,padding:1};n.each(["borderLeftStyle","borderRightStyle","borderBottomStyle","borderTopStyle"],function(t,i){n.fx.step[i]=function(n){(n.end==="none"||n.setAttr)&&(n.pos!==1||n.setAttr)||(jQuery.style(n.elem,i,n.end),n.setAttr=!0)}});n.fn.addBack||(n.fn.addBack=function(n){return this.add(n==null?this.prevObject:this.prevObject.filter(n))});n.effects.animateClass=function(t,u,e,o){var s=n.speed(u,e,o);return this.queue(function(){var e=n(this),h=e.attr("class")||"",o,u=s.children?e.find("*").addBack():e;u=u.map(function(){var t=n(this);return{el:t,start:i(this)}});o=function(){n.each(r,function(n,i){t[i]&&e[i+"Class"](t[i])})};o();u=u.map(function(){return this.end=i(this.el[0]),this.diff=f(this.start,this.end),this});e.attr("class",h);u=u.map(function(){var i=this,t=n.Deferred(),r=n.extend({},s,{queue:!1,complete:function(){t.resolve(i)}});return this.el.animate(this.diff,r),t.promise()});n.when.apply(n,u.get()).done(function(){o();n.each(arguments,function(){var t=this.el;n.each(this.diff,function(n){t.css(n,"")})});s.complete.call(e[0])})})};n.fn.extend({addClass:function(t){return function(i,r,u,f){return r?n.effects.animateClass.call(this,{add:i},r,u,f):t.apply(this,arguments)}}(n.fn.addClass),removeClass:function(t){return function(i,r,u,f){return arguments.length>1?n.effects.animateClass.call(this,{remove:i},r,u,f):t.apply(this,arguments)}}(n.fn.removeClass),toggleClass:function(i){return function(r,u,f,e,o){return typeof u=="boolean"||u===t?f?n.effects.animateClass.call(this,u?{add:r}:{remove:r},f,e,o):i.apply(this,arguments):n.effects.animateClass.call(this,{toggle:r},u,f,e)}}(n.fn.toggleClass),switchClass:function(t,i,r,u,f){return n.effects.animateClass.call(this,{add:i,remove:t},r,u,f)}})}(),function(){function r(t,i,r,u){return n.isPlainObject(t)&&(i=t,t=t.effect),t={effect:t},i==null&&(i={}),n.isFunction(i)&&(u=i,r=null,i={}),(typeof i=="number"||n.fx.speeds[i])&&(u=r,r=i,i={}),n.isFunction(r)&&(u=r,r=null),i&&n.extend(t,i),r=r||i.duration,t.duration=n.fx.off?0:typeof r=="number"?r:r in n.fx.speeds?n.fx.speeds[r]:n.fx.speeds._default,t.complete=u||i.complete,t}function u(t){return!t||typeof t=="number"||n.fx.speeds[t]?!0:typeof t=="string"&&!n.effects.effect[t]?!0:n.isFunction(t)?!0:typeof t=="object"&&!t.effect?!0:!1}n.extend(n.effects,{version:"1.10.2",save:function(n,t){for(var r=0;r<t.length;r++)t[r]!==null&&n.data(i+t[r],n[0].style[t[r]])},restore:function(n,r){for(var f,u=0;u<r.length;u++)r[u]!==null&&(f=n.data(i+r[u]),f===t&&(f=""),n.css(r[u],f))},setMode:function(n,t){return t==="toggle"&&(t=n.is(":hidden")?"show":"hide"),t},getBaseline:function(n,t){var i,r;switch(n[0]){case"top":i=0;break;case"middle":i=.5;break;case"bottom":i=1;break;default:i=n[0]/t.height}switch(n[1]){case"left":r=0;break;case"center":r=.5;break;case"right":r=1;break;default:r=n[1]/t.width}return{x:r,y:i}},createWrapper:function(t){if(t.parent().is(".ui-effects-wrapper"))return t.parent();var i={width:t.outerWidth(!0),height:t.outerHeight(!0),float:t.css("float")},u=n("<div><\/div>").addClass("ui-effects-wrapper").css({fontSize:"100%",background:"transparent",border:"none",margin:0,padding:0}),f={width:t.width(),height:t.height()},r=document.activeElement;try{r.id}catch(e){r=document.body}return t.wrap(u),(t[0]===r||n.contains(t[0],r))&&n(r).focus(),u=t.parent(),t.css("position")==="static"?(u.css({position:"relative"}),t.css({position:"relative"})):(n.extend(i,{position:t.css("position"),zIndex:t.css("z-index")}),n.each(["top","left","bottom","right"],function(n,r){i[r]=t.css(r);isNaN(parseInt(i[r],10))&&(i[r]="auto")}),t.css({position:"relative",top:0,left:0,right:"auto",bottom:"auto"})),t.css(f),u.css(i).show()},removeWrapper:function(t){var i=document.activeElement;return t.parent().is(".ui-effects-wrapper")&&(t.parent().replaceWith(t),(t[0]===i||n.contains(t[0],i))&&n(i).focus()),t},setTransition:function(t,i,r,u){return u=u||{},n.each(i,function(n,i){var f=t.cssUnit(i);f[0]>0&&(u[i]=f[0]*r+f[1])}),u}});n.fn.extend({effect:function(){function e(i){function o(){n.isFunction(e)&&e.call(r[0]);n.isFunction(i)&&i()}var r=n(this),e=t.complete,u=t.mode;(r.is(":hidden")?u==="hide":u==="show")?(r[u](),o()):f.call(r[0],t,o)}var t=r.apply(this,arguments),i=t.mode,u=t.queue,f=n.effects.effect[t.effect];return n.fx.off||!f?i?this[i](t.duration,t.complete):this.each(function(){t.complete&&t.complete.call(this)}):u===!1?this.each(e):this.queue(u||"fx",e)},show:function(n){return function(t){if(u(t))return n.apply(this,arguments);var i=r.apply(this,arguments);return i.mode="show",this.effect.call(this,i)}}(n.fn.show),hide:function(n){return function(t){if(u(t))return n.apply(this,arguments);var i=r.apply(this,arguments);return i.mode="hide",this.effect.call(this,i)}}(n.fn.hide),toggle:function(n){return function(t){if(u(t)||typeof t=="boolean")return n.apply(this,arguments);var i=r.apply(this,arguments);return i.mode="toggle",this.effect.call(this,i)}}(n.fn.toggle),cssUnit:function(t){var i=this.css(t),r=[];return n.each(["em","px","%","pt"],function(n,t){i.indexOf(t)>0&&(r=[parseFloat(i),t])}),r}})}(),function(){var t={};n.each(["Quad","Cubic","Quart","Quint","Expo"],function(n,i){t[i]=function(t){return Math.pow(t,n+2)}});n.extend(t,{Sine:function(n){return 1-Math.cos(n*Math.PI/2)},Circ:function(n){return 1-Math.sqrt(1-n*n)},Elastic:function(n){return n===0||n===1?n:-Math.pow(2,8*(n-1))*Math.sin(((n-1)*80-7.5)*Math.PI/15)},Back:function(n){return n*n*(3*n-2)},Bounce:function(n){for(var t,i=4;n<((t=Math.pow(2,--i))-1)/11;);return 1/Math.pow(4,3-i)-7.5625*Math.pow((t*3-2)/22-n,2)}});n.each(t,function(t,i){n.easing["easeIn"+t]=i;n.easing["easeOut"+t]=function(n){return 1-i(1-n)};n.easing["easeInOut"+t]=function(n){return n<.5?i(n*2)/2:1-i(n*-2+2)/2}})}()}(jQuery),function(n){var r=0,t={},i={};t.height=t.paddingTop=t.paddingBottom=t.borderTopWidth=t.borderBottomWidth="hide";i.height=i.paddingTop=i.paddingBottom=i.borderTopWidth=i.borderBottomWidth="show";n.widget("ui.accordion",{version:"1.10.2",options:{active:0,animate:{},collapsible:!1,event:"click",header:"> li > :first-child,> :not(li):even",heightStyle:"auto",icons:{activeHeader:"ui-icon-triangle-1-s",header:"ui-icon-triangle-1-e"},activate:null,beforeActivate:null},_create:function(){var t=this.options;this.prevShow=this.prevHide=n();this.element.addClass("ui-accordion ui-widget ui-helper-reset").attr("role","tablist");t.collapsible||t.active!==!1&&t.active!=null||(t.active=0);this._processPanels();t.active<0&&(t.active+=this.headers.length);this._refresh()},_getCreateEventData:function(){return{header:this.active,panel:this.active.length?this.active.next():n(),content:this.active.length?this.active.next():n()}},_createIcons:function(){var t=this.options.icons;t&&(n("<span>").addClass("ui-accordion-header-icon ui-icon "+t.header).prependTo(this.headers),this.active.children(".ui-accordion-header-icon").removeClass(t.header).addClass(t.activeHeader),this.headers.addClass("ui-accordion-icons"))},_destroyIcons:function(){this.headers.removeClass("ui-accordion-icons").children(".ui-accordion-header-icon").remove()},_destroy:function(){var n;this.element.removeClass("ui-accordion ui-widget ui-helper-reset").removeAttr("role");this.headers.removeClass("ui-accordion-header ui-accordion-header-active ui-helper-reset ui-state-default ui-corner-all ui-state-active ui-state-disabled ui-corner-top").removeAttr("role").removeAttr("aria-selected").removeAttr("aria-controls").removeAttr("tabIndex").each(function(){/^ui-accordion/.test(this.id)&&this.removeAttribute("id")});this._destroyIcons();n=this.headers.next().css("display","").removeAttr("role").removeAttr("aria-expanded").removeAttr("aria-hidden").removeAttr("aria-labelledby").removeClass("ui-helper-reset ui-widget-content ui-corner-bottom ui-accordion-content ui-accordion-content-active ui-state-disabled").each(function(){/^ui-accordion/.test(this.id)&&this.removeAttribute("id")});this.options.heightStyle!=="content"&&n.css("height","")},_setOption:function(n,t){if(n==="active"){this._activate(t);return}n==="event"&&(this.options.event&&this._off(this.headers,this.options.event),this._setupEvents(t));this._super(n,t);n!=="collapsible"||t||this.options.active!==!1||this._activate(0);n==="icons"&&(this._destroyIcons(),t&&this._createIcons());n==="disabled"&&this.headers.add(this.headers.next()).toggleClass("ui-state-disabled",!!t)},_keydown:function(t){if(!t.altKey&&!t.ctrlKey){var i=n.ui.keyCode,u=this.headers.length,f=this.headers.index(t.target),r=!1;switch(t.keyCode){case i.RIGHT:case i.DOWN:r=this.headers[(f+1)%u];break;case i.LEFT:case i.UP:r=this.headers[(f-1+u)%u];break;case i.SPACE:case i.ENTER:this._eventHandler(t);break;case i.HOME:r=this.headers[0];break;case i.END:r=this.headers[u-1]}r&&(n(t.target).attr("tabIndex",-1),n(r).attr("tabIndex",0),r.focus(),t.preventDefault())}},_panelKeyDown:function(t){t.keyCode===n.ui.keyCode.UP&&t.ctrlKey&&n(t.currentTarget).prev().focus()},refresh:function(){var t=this.options;this._processPanels();(t.active!==!1||t.collapsible!==!0)&&this.headers.length||(t.active=!1,this.active=n());t.active===!1?this._activate(0):this.active.length&&!n.contains(this.element[0],this.active[0])?this.headers.length===this.headers.find(".ui-state-disabled").length?(t.active=!1,this.active=n()):this._activate(Math.max(0,t.active-1)):t.active=this.headers.index(this.active);this._destroyIcons();this._refresh()},_processPanels:function(){this.headers=this.element.find(this.options.header).addClass("ui-accordion-header ui-helper-reset ui-state-default ui-corner-all");this.headers.next().addClass("ui-accordion-content ui-helper-reset ui-widget-content ui-corner-bottom").filter(":not(.ui-accordion-content-active)").hide()},_refresh:function(){var t,i=this.options,u=i.heightStyle,e=this.element.parent(),f=this.accordionId="ui-accordion-"+(this.element.attr("id")||++r);this.active=this._findActive(i.active).addClass("ui-accordion-header-active ui-state-active ui-corner-top").removeClass("ui-corner-all");this.active.next().addClass("ui-accordion-content-active").show();this.headers.attr("role","tab").each(function(t){var i=n(this),r=i.attr("id"),e=i.next(),u=e.attr("id");r||(r=f+"-header-"+t,i.attr("id",r));u||(u=f+"-panel-"+t,e.attr("id",u));i.attr("aria-controls",u);e.attr("aria-labelledby",r)}).next().attr("role","tabpanel");this.headers.not(this.active).attr({"aria-selected":"false",tabIndex:-1}).next().attr({"aria-expanded":"false","aria-hidden":"true"}).hide();this.active.length?this.active.attr({"aria-selected":"true",tabIndex:0}).next().attr({"aria-expanded":"true","aria-hidden":"false"}):this.headers.eq(0).attr("tabIndex",0);this._createIcons();this._setupEvents(i.event);u==="fill"?(t=e.height(),this.element.siblings(":visible").each(function(){var i=n(this),r=i.css("position");r!=="absolute"&&r!=="fixed"&&(t-=i.outerHeight(!0))}),this.headers.each(function(){t-=n(this).outerHeight(!0)}),this.headers.next().each(function(){n(this).height(Math.max(0,t-n(this).innerHeight()+n(this).height()))}).css("overflow","auto")):u==="auto"&&(t=0,this.headers.next().each(function(){t=Math.max(t,n(this).css("height","").height())}).height(t))},_activate:function(t){var i=this._findActive(t)[0];i!==this.active[0]&&(i=i||this.active[0],this._eventHandler({target:i,currentTarget:i,preventDefault:n.noop}))},_findActive:function(t){return typeof t=="number"?this.headers.eq(t):n()},_setupEvents:function(t){var i={keydown:"_keydown"};t&&n.each(t.split(" "),function(n,t){i[t]="_eventHandler"});this._off(this.headers.add(this.headers.next()));this._on(this.headers,i);this._on(this.headers.next(),{keydown:"_panelKeyDown"});this._hoverable(this.headers);this._focusable(this.headers)},_eventHandler:function(t){var i=this.options,u=this.active,r=n(t.currentTarget),f=r[0]===u[0],e=f&&i.collapsible,s=e?n():r.next(),h=u.next(),o={oldHeader:u,oldPanel:h,newHeader:e?n():r,newPanel:s};(t.preventDefault(),(!f||i.collapsible)&&this._trigger("beforeActivate",t,o)!==!1)&&(i.active=e?!1:this.headers.index(r),this.active=f?n():r,this._toggle(o),u.removeClass("ui-accordion-header-active ui-state-active"),i.icons&&u.children(".ui-accordion-header-icon").removeClass(i.icons.activeHeader).addClass(i.icons.header),f||(r.removeClass("ui-corner-all").addClass("ui-accordion-header-active ui-state-active ui-corner-top"),i.icons&&r.children(".ui-accordion-header-icon").removeClass(i.icons.header).addClass(i.icons.activeHeader),r.next().addClass("ui-accordion-content-active")))},_toggle:function(t){var r=t.newPanel,i=this.prevShow.length?this.prevShow:t.oldPanel;this.prevShow.add(this.prevHide).stop(!0,!0);this.prevShow=r;this.prevHide=i;this.options.animate?this._animate(r,i,t):(i.hide(),r.show(),this._toggleComplete(t));i.attr({"aria-expanded":"false","aria-hidden":"true"});i.prev().attr("aria-selected","false");r.length&&i.length?i.prev().attr("tabIndex",-1):r.length&&this.headers.filter(function(){return n(this).attr("tabIndex")===0}).attr("tabIndex",-1);r.attr({"aria-expanded":"true","aria-hidden":"false"}).prev().attr({"aria-selected":"true",tabIndex:0})},_animate:function(n,r,u){var l,f,e,a=this,h=0,v=n.length&&(!r.length||n.index()<r.index()),s=this.options.animate||{},o=v&&s.down||s,c=function(){a._toggleComplete(u)};if(typeof o=="number"&&(e=o),typeof o=="string"&&(f=o),f=f||o.easing||s.easing,e=e||o.duration||s.duration,!r.length)return n.animate(i,e,f,c);if(!n.length)return r.animate(t,e,f,c);l=n.show().outerHeight();r.animate(t,{duration:e,easing:f,step:function(n,t){t.now=Math.round(n)}});n.hide().animate(i,{duration:e,easing:f,complete:c,step:function(n,t){t.now=Math.round(n);t.prop!=="height"?h+=t.now:a.options.heightStyle!=="content"&&(t.now=Math.round(l-r.outerHeight()-h),h=0)}})},_toggleComplete:function(n){var t=n.oldPanel;t.removeClass("ui-accordion-content-active").prev().removeClass("ui-corner-top").addClass("ui-corner-all");t.length&&(t.parent()[0].className=t.parent()[0].className);this._trigger("activate",null,n)}})}(jQuery),function(n){var t=0;n.widget("ui.autocomplete",{version:"1.10.2",defaultElement:"<input>",options:{appendTo:null,autoFocus:!1,delay:300,minLength:1,position:{my:"left top",at:"left bottom",collision:"none"},source:null,change:null,close:null,focus:null,open:null,response:null,search:null,select:null},pending:0,_create:function(){var t,i,r,u=this.element[0].nodeName.toLowerCase(),f=u==="textarea",e=u==="input";this.isMultiLine=f?!0:e?!1:this.element.prop("isContentEditable");this.valueMethod=this.element[f||e?"val":"text"];this.isNewMenu=!0;this.element.addClass("ui-autocomplete-input").attr("autocomplete","off");this._on(this.element,{keydown:function(u){if(this.element.prop("readOnly")){t=!0;r=!0;i=!0;return}t=!1;r=!1;i=!1;var f=n.ui.keyCode;switch(u.keyCode){case f.PAGE_UP:t=!0;this._move("previousPage",u);break;case f.PAGE_DOWN:t=!0;this._move("nextPage",u);break;case f.UP:t=!0;this._keyEvent("previous",u);break;case f.DOWN:t=!0;this._keyEvent("next",u);break;case f.ENTER:case f.NUMPAD_ENTER:this.menu.active&&(t=!0,u.preventDefault(),this.menu.select(u));break;case f.TAB:this.menu.active&&this.menu.select(u);break;case f.ESCAPE:this.menu.element.is(":visible")&&(this._value(this.term),this.close(u),u.preventDefault());break;default:i=!0;this._searchTimeout(u)}},keypress:function(r){if(t){t=!1;r.preventDefault();return}if(!i){var u=n.ui.keyCode;switch(r.keyCode){case u.PAGE_UP:this._move("previousPage",r);break;case u.PAGE_DOWN:this._move("nextPage",r);break;case u.UP:this._keyEvent("previous",r);break;case u.DOWN:this._keyEvent("next",r)}}},input:function(n){if(r){r=!1;n.preventDefault();return}this._searchTimeout(n)},focus:function(){this.selectedItem=null;this.previous=this._value()},blur:function(n){if(this.cancelBlur){delete this.cancelBlur;return}clearTimeout(this.searching);this.close(n);this._change(n)}});this._initSource();this.menu=n("<ul>").addClass("ui-autocomplete ui-front").appendTo(this._appendTo()).menu({input:n(),role:null}).hide().data("ui-menu");this._on(this.menu.element,{mousedown:function(t){t.preventDefault();this.cancelBlur=!0;this._delay(function(){delete this.cancelBlur});var i=this.menu.element[0];n(t.target).closest(".ui-menu-item").length||this._delay(function(){var t=this;this.document.one("mousedown",function(r){r.target===t.element[0]||r.target===i||n.contains(i,r.target)||t.close()})})},menufocus:function(t,i){if(this.isNewMenu&&(this.isNewMenu=!1,t.originalEvent&&/^mouse/.test(t.originalEvent.type))){this.menu.blur();this.document.one("mousemove",function(){n(t.target).trigger(t.originalEvent)});return}var r=i.item.data("ui-autocomplete-item");!1!==this._trigger("focus",t,{item:r})?t.originalEvent&&/^key/.test(t.originalEvent.type)&&this._value(r.value):this.liveRegion.text(r.value)},menuselect:function(n,t){var i=t.item.data("ui-autocomplete-item"),r=this.previous;this.element[0]!==this.document[0].activeElement&&(this.element.focus(),this.previous=r,this._delay(function(){this.previous=r;this.selectedItem=i}));!1!==this._trigger("select",n,{item:i})&&this._value(i.value);this.term=this._value();this.close(n);this.selectedItem=i}});this.liveRegion=n("<span>",{role:"status","aria-live":"polite"}).addClass("ui-helper-hidden-accessible").insertAfter(this.element);this._on(this.window,{beforeunload:function(){this.element.removeAttr("autocomplete")}})},_destroy:function(){clearTimeout(this.searching);this.element.removeClass("ui-autocomplete-input").removeAttr("autocomplete");this.menu.element.remove();this.liveRegion.remove()},_setOption:function(n,t){this._super(n,t);n==="source"&&this._initSource();n==="appendTo"&&this.menu.element.appendTo(this._appendTo());n==="disabled"&&t&&this.xhr&&this.xhr.abort()},_appendTo:function(){var t=this.options.appendTo;return t&&(t=t.jquery||t.nodeType?n(t):this.document.find(t).eq(0)),t||(t=this.element.closest(".ui-front")),t.length||(t=this.document[0].body),t},_initSource:function(){var i,r,t=this;n.isArray(this.options.source)?(i=this.options.source,this.source=function(t,r){r(n.ui.autocomplete.filter(i,t.term))}):typeof this.options.source=="string"?(r=this.options.source,this.source=function(i,u){t.xhr&&t.xhr.abort();t.xhr=n.ajax({url:r,data:i,dataType:"json",success:function(n){u(n)},error:function(){u([])}})}):this.source=this.options.source},_searchTimeout:function(n){clearTimeout(this.searching);this.searching=this._delay(function(){this.term!==this._value()&&(this.selectedItem=null,this.search(null,n))},this.options.delay)},search:function(n,t){return(n=n!=null?n:this._value(),this.term=this._value(),n.length<this.options.minLength)?this.close(t):this._trigger("search",t)===!1?void 0:this._search(n)},_search:function(n){this.pending++;this.element.addClass("ui-autocomplete-loading");this.cancelSearch=!1;this.source({term:n},this._response())},_response:function(){var n=this,i=++t;return function(r){i===t&&n.__response(r);n.pending--;n.pending||n.element.removeClass("ui-autocomplete-loading")}},__response:function(n){n&&(n=this._normalize(n));this._trigger("response",null,{content:n});!this.options.disabled&&n&&n.length&&!this.cancelSearch?(this._suggest(n),this._trigger("open")):this._close()},close:function(n){this.cancelSearch=!0;this._close(n)},_close:function(n){this.menu.element.is(":visible")&&(this.menu.element.hide(),this.menu.blur(),this.isNewMenu=!0,this._trigger("close",n))},_change:function(n){this.previous!==this._value()&&this._trigger("change",n,{item:this.selectedItem})},_normalize:function(t){return t.length&&t[0].label&&t[0].value?t:n.map(t,function(t){return typeof t=="string"?{label:t,value:t}:n.extend({label:t.label||t.value,value:t.value||t.label},t)})},_suggest:function(t){var i=this.menu.element.empty();this._renderMenu(i,t);this.isNewMenu=!0;this.menu.refresh();i.show();this._resizeMenu();i.position(n.extend({of:this.element},this.options.position));this.options.autoFocus&&this.menu.next()},_resizeMenu:function(){var n=this.menu.element;n.outerWidth(Math.max(n.width("").outerWidth()+1,this.element.outerWidth()))},_renderMenu:function(t,i){var r=this;n.each(i,function(n,i){r._renderItemData(t,i)})},_renderItemData:function(n,t){return this._renderItem(n,t).data("ui-autocomplete-item",t)},_renderItem:function(t,i){return n("<li>").append(n("<a>").text(i.label)).appendTo(t)},_move:function(n,t){if(!this.menu.element.is(":visible")){this.search(null,t);return}if(this.menu.isFirstItem()&&/^previous/.test(n)||this.menu.isLastItem()&&/^next/.test(n)){this._value(this.term);this.menu.blur();return}this.menu[n](t)},widget:function(){return this.menu.element},_value:function(){return this.valueMethod.apply(this.element,arguments)},_keyEvent:function(n,t){(!this.isMultiLine||this.menu.element.is(":visible"))&&(this._move(n,t),t.preventDefault())}});n.extend(n.ui.autocomplete,{escapeRegex:function(n){return n.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g,"\\$&")},filter:function(t,i){var r=new RegExp(n.ui.autocomplete.escapeRegex(i),"i");return n.grep(t,function(n){return r.test(n.label||n.value||n)})}});n.widget("ui.autocomplete",n.ui.autocomplete,{options:{messages:{noResults:"No search results.",results:function(n){return n+(n>1?" results are":" result is")+" available, use up and down arrow keys to navigate."}}},__response:function(n){var t;(this._superApply(arguments),this.options.disabled||this.cancelSearch)||(t=n&&n.length?this.options.messages.results(n.length):this.options.messages.noResults,this.liveRegion.text(t))}})}(jQuery),function(n){var i,r,u,t,f="ui-button ui-widget ui-state-default ui-corner-all",s="ui-state-hover ui-state-active ",e="ui-button-icons-only ui-button-icon-only ui-button-text-icons ui-button-text-icon-primary ui-button-text-icon-secondary ui-button-text-only",h=function(){var t=n(this).find(":ui-button");setTimeout(function(){t.button("refresh")},1)},o=function(t){var i=t.name,r=t.form,u=n([]);return i&&(i=i.replace(/'/g,"\\'"),u=r?n(r).find("[name='"+i+"']"):n("[name='"+i+"']",t.ownerDocument).filter(function(){return!this.form})),u};n.widget("ui.button",{version:"1.10.2",defaultElement:"<button>",options:{disabled:null,text:!0,label:null,icons:{primary:null,secondary:null}},_create:function(){this.element.closest("form").unbind("reset"+this.eventNamespace).bind("reset"+this.eventNamespace,h);typeof this.options.disabled!="boolean"?this.options.disabled=!!this.element.prop("disabled"):this.element.prop("disabled",this.options.disabled);this._determineButtonType();this.hasTitle=!!this.buttonElement.attr("title");var s=this,e=this.options,c=this.type==="checkbox"||this.type==="radio",a=c?"":"ui-state-active",l="ui-state-focus";e.label===null&&(e.label=this.type==="input"?this.buttonElement.val():this.buttonElement.html());this._hoverable(this.buttonElement);this.buttonElement.addClass(f).attr("role","button").bind("mouseenter"+this.eventNamespace,function(){e.disabled||this===i&&n(this).addClass("ui-state-active")}).bind("mouseleave"+this.eventNamespace,function(){e.disabled||n(this).removeClass(a)}).bind("click"+this.eventNamespace,function(n){e.disabled&&(n.preventDefault(),n.stopImmediatePropagation())});this.element.bind("focus"+this.eventNamespace,function(){s.buttonElement.addClass(l)}).bind("blur"+this.eventNamespace,function(){s.buttonElement.removeClass(l)});c&&(this.element.bind("change"+this.eventNamespace,function(){t||s.refresh()}),this.buttonElement.bind("mousedown"+this.eventNamespace,function(n){e.disabled||(t=!1,r=n.pageX,u=n.pageY)}).bind("mouseup"+this.eventNamespace,function(n){e.disabled||(r!==n.pageX||u!==n.pageY)&&(t=!0)}));this.type==="checkbox"?this.buttonElement.bind("click"+this.eventNamespace,function(){if(e.disabled||t)return!1}):this.type==="radio"?this.buttonElement.bind("click"+this.eventNamespace,function(){if(e.disabled||t)return!1;n(this).addClass("ui-state-active");s.buttonElement.attr("aria-pressed","true");var i=s.element[0];o(i).not(i).map(function(){return n(this).button("widget")[0]}).removeClass("ui-state-active").attr("aria-pressed","false")}):(this.buttonElement.bind("mousedown"+this.eventNamespace,function(){if(e.disabled)return!1;n(this).addClass("ui-state-active");i=this;s.document.one("mouseup",function(){i=null})}).bind("mouseup"+this.eventNamespace,function(){if(e.disabled)return!1;n(this).removeClass("ui-state-active")}).bind("keydown"+this.eventNamespace,function(t){if(e.disabled)return!1;(t.keyCode===n.ui.keyCode.SPACE||t.keyCode===n.ui.keyCode.ENTER)&&n(this).addClass("ui-state-active")}).bind("keyup"+this.eventNamespace+" blur"+this.eventNamespace,function(){n(this).removeClass("ui-state-active")}),this.buttonElement.is("a")&&this.buttonElement.keyup(function(t){t.keyCode===n.ui.keyCode.SPACE&&n(this).click()}));this._setOption("disabled",e.disabled);this._resetButton()},_determineButtonType:function(){var n,t,i;this.type=this.element.is("[type=checkbox]")?"checkbox":this.element.is("[type=radio]")?"radio":this.element.is("input")?"input":"button";this.type==="checkbox"||this.type==="radio"?(n=this.element.parents().last(),t="label[for='"+this.element.attr("id")+"']",this.buttonElement=n.find(t),this.buttonElement.length||(n=n.length?n.siblings():this.element.siblings(),this.buttonElement=n.filter(t),this.buttonElement.length||(this.buttonElement=n.find(t))),this.element.addClass("ui-helper-hidden-accessible"),i=this.element.is(":checked"),i&&this.buttonElement.addClass("ui-state-active"),this.buttonElement.prop("aria-pressed",i)):this.buttonElement=this.element},widget:function(){return this.buttonElement},_destroy:function(){this.element.removeClass("ui-helper-hidden-accessible");this.buttonElement.removeClass(f+" "+s+" "+e).removeAttr("role").removeAttr("aria-pressed").html(this.buttonElement.find(".ui-button-text").html());this.hasTitle||this.buttonElement.removeAttr("title")},_setOption:function(n,t){if(this._super(n,t),n==="disabled"){t?this.element.prop("disabled",!0):this.element.prop("disabled",!1);return}this._resetButton()},refresh:function(){var t=this.element.is("input, button")?this.element.is(":disabled"):this.element.hasClass("ui-button-disabled");t!==this.options.disabled&&this._setOption("disabled",t);this.type==="radio"?o(this.element[0]).each(function(){n(this).is(":checked")?n(this).button("widget").addClass("ui-state-active").attr("aria-pressed","true"):n(this).button("widget").removeClass("ui-state-active").attr("aria-pressed","false")}):this.type==="checkbox"&&(this.element.is(":checked")?this.buttonElement.addClass("ui-state-active").attr("aria-pressed","true"):this.buttonElement.removeClass("ui-state-active").attr("aria-pressed","false"))},_resetButton:function(){if(this.type==="input"){this.options.label&&this.element.val(this.options.label);return}var i=this.buttonElement.removeClass(e),f=n("<span><\/span>",this.document[0]).addClass("ui-button-text").html(this.options.label).appendTo(i.empty()).text(),t=this.options.icons,u=t.primary&&t.secondary,r=[];t.primary||t.secondary?(this.options.text&&r.push("ui-button-text-icon"+(u?"s":t.primary?"-primary":"-secondary")),t.primary&&i.prepend("<span class='ui-button-icon-primary ui-icon "+t.primary+"'><\/span>"),t.secondary&&i.append("<span class='ui-button-icon-secondary ui-icon "+t.secondary+"'><\/span>"),this.options.text||(r.push(u?"ui-button-icons-only":"ui-button-icon-only"),this.hasTitle||i.attr("title",n.trim(f)))):r.push("ui-button-text-only");i.addClass(r.join(" "))}});n.widget("ui.buttonset",{version:"1.10.2",options:{items:"button, input[type=button], input[type=submit], input[type=reset], input[type=checkbox], input[type=radio], a, :data(ui-button)"},_create:function(){this.element.addClass("ui-buttonset")},_init:function(){this.refresh()},_setOption:function(n,t){n==="disabled"&&this.buttons.button("option",n,t);this._super(n,t)},refresh:function(){var t=this.element.css("direction")==="rtl";this.buttons=this.element.find(this.options.items).filter(":ui-button").button("refresh").end().not(":ui-button").button().end().map(function(){return n(this).button("widget")[0]}).removeClass("ui-corner-all ui-corner-left ui-corner-right").filter(":first").addClass(t?"ui-corner-right":"ui-corner-left").end().filter(":last").addClass(t?"ui-corner-left":"ui-corner-right").end().end()},_destroy:function(){this.element.removeClass("ui-buttonset");this.buttons.map(function(){return n(this).button("widget")[0]}).removeClass("ui-corner-left ui-corner-right").end().button("destroy")}})}(jQuery),function(n,t){function e(){this._curInst=null;this._keyEvent=!1;this._disabledInputs=[];this._datepickerShowing=!1;this._inDialog=!1;this._mainDivId="ui-datepicker-div";this._inlineClass="ui-datepicker-inline";this._appendClass="ui-datepicker-append";this._triggerClass="ui-datepicker-trigger";this._dialogClass="ui-datepicker-dialog";this._disableClass="ui-datepicker-disabled";this._unselectableClass="ui-datepicker-unselectable";this._currentClass="ui-datepicker-current-day";this._dayOverClass="ui-datepicker-days-cell-over";this.regional=[];this.regional[""]={closeText:"Done",prevText:"Prev",nextText:"Next",currentText:"Today",monthNames:["January","February","March","April","May","June","July","August","September","October","November","December"],monthNamesShort:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],dayNames:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],dayNamesShort:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],dayNamesMin:["Su","Mo","Tu","We","Th","Fr","Sa"],weekHeader:"Wk",dateFormat:"mm/dd/yy",firstDay:0,isRTL:!1,showMonthAfterYear:!1,yearSuffix:""};this._defaults={showOn:"focus",showAnim:"fadeIn",showOptions:{},defaultDate:null,appendText:"",buttonText:"...",buttonImage:"",buttonImageOnly:!1,hideIfNoPrevNext:!1,navigationAsDateFormat:!1,gotoCurrent:!1,changeMonth:!1,changeYear:!1,yearRange:"c-10:c+10",showOtherMonths:!1,selectOtherMonths:!1,showWeek:!1,calculateWeek:this.iso8601Week,shortYearCutoff:"+10",minDate:null,maxDate:null,duration:"fast",beforeShowDay:null,beforeShow:null,onSelect:null,onChangeMonthYear:null,onClose:null,numberOfMonths:1,showCurrentAtPos:0,stepMonths:1,stepBigMonths:12,altField:"",altFormat:"",constrainInput:!0,showButtonPanel:!1,autoSize:!1,disabled:!1};n.extend(this._defaults,this.regional[""]);this.dpDiv=o(n("<div id='"+this._mainDivId+"' class='ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all'><\/div>"))}function o(t){var i="button, .ui-datepicker-prev, .ui-datepicker-next, .ui-datepicker-calendar td a";return t.delegate(i,"mouseout",function(){n(this).removeClass("ui-state-hover");this.className.indexOf("ui-datepicker-prev")!==-1&&n(this).removeClass("ui-datepicker-prev-hover");this.className.indexOf("ui-datepicker-next")!==-1&&n(this).removeClass("ui-datepicker-next-hover")}).delegate(i,"mouseover",function(){n.datepicker._isDisabledDatepicker(f.inline?t.parent()[0]:f.input[0])||(n(this).parents(".ui-datepicker-calendar").find("a").removeClass("ui-state-hover"),n(this).addClass("ui-state-hover"),this.className.indexOf("ui-datepicker-prev")!==-1&&n(this).addClass("ui-datepicker-prev-hover"),this.className.indexOf("ui-datepicker-next")!==-1&&n(this).addClass("ui-datepicker-next-hover"))})}function u(t,i){n.extend(t,i);for(var r in i)i[r]==null&&(t[r]=i[r]);return t}n.extend(n.ui,{datepicker:{version:"1.10.2"}});var i="datepicker",r=(new Date).getTime(),f;n.extend(e.prototype,{markerClassName:"hasDatepicker",maxRows:4,_widgetDatepicker:function(){return this.dpDiv},setDefaults:function(n){return u(this._defaults,n||{}),this},_attachDatepicker:function(t,i){var r,f,u;r=t.nodeName.toLowerCase();f=r==="div"||r==="span";t.id||(this.uuid+=1,t.id="dp"+this.uuid);u=this._newInst(n(t),f);u.settings=n.extend({},i||{});r==="input"?this._connectDatepicker(t,u):f&&this._inlineDatepicker(t,u)},_newInst:function(t,i){var r=t[0].id.replace(/([^A-Za-z0-9_\-])/g,"\\\\$1");return{id:r,input:t,selectedDay:0,selectedMonth:0,selectedYear:0,drawMonth:0,drawYear:0,inline:i,dpDiv:i?o(n("<div class='"+this._inlineClass+" ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all'><\/div>")):this.dpDiv}},_connectDatepicker:function(t,r){var u=n(t);(r.append=n([]),r.trigger=n([]),u.hasClass(this.markerClassName))||(this._attachments(u,r),u.addClass(this.markerClassName).keydown(this._doKeyDown).keypress(this._doKeyPress).keyup(this._doKeyUp),this._autoSize(r),n.data(t,i,r),r.settings.disabled&&this._disableDatepicker(t))},_attachments:function(t,i){var u,r,f,e=this._get(i,"appendText"),o=this._get(i,"isRTL");i.append&&i.append.remove();e&&(i.append=n("<span class='"+this._appendClass+"'>"+e+"<\/span>"),t[o?"before":"after"](i.append));t.unbind("focus",this._showDatepicker);i.trigger&&i.trigger.remove();u=this._get(i,"showOn");(u==="focus"||u==="both")&&t.focus(this._showDatepicker);(u==="button"||u==="both")&&(r=this._get(i,"buttonText"),f=this._get(i,"buttonImage"),i.trigger=n(this._get(i,"buttonImageOnly")?n("<img/>").addClass(this._triggerClass).attr({src:f,alt:r,title:r}):n("<button type='button'><\/button>").addClass(this._triggerClass).html(f?n("<img/>").attr({src:f,alt:r,title:r}):r)),t[o?"before":"after"](i.trigger),i.trigger.click(function(){return n.datepicker._datepickerShowing&&n.datepicker._lastInput===t[0]?n.datepicker._hideDatepicker():n.datepicker._datepickerShowing&&n.datepicker._lastInput!==t[0]?(n.datepicker._hideDatepicker(),n.datepicker._showDatepicker(t[0])):n.datepicker._showDatepicker(t[0]),!1}))},_autoSize:function(n){if(this._get(n,"autoSize")&&!n.inline){var r,u,f,t,i=new Date(2009,11,20),e=this._get(n,"dateFormat");e.match(/[DM]/)&&(r=function(n){for(u=0,f=0,t=0;t<n.length;t++)n[t].length>u&&(u=n[t].length,f=t);return f},i.setMonth(r(this._get(n,e.match(/MM/)?"monthNames":"monthNamesShort"))),i.setDate(r(this._get(n,e.match(/DD/)?"dayNames":"dayNamesShort"))+20-i.getDay()));n.input.attr("size",this._formatDate(n,i).length)}},_inlineDatepicker:function(t,r){var u=n(t);u.hasClass(this.markerClassName)||(u.addClass(this.markerClassName).append(r.dpDiv),n.data(t,i,r),this._setDate(r,this._getDefaultDate(r),!0),this._updateDatepicker(r),this._updateAlternate(r),r.settings.disabled&&this._disableDatepicker(t),r.dpDiv.css("display","block"))},_dialogDatepicker:function(t,r,f,e,o){var h,c,l,a,v,s=this._dialogInst;return s||(this.uuid+=1,h="dp"+this.uuid,this._dialogInput=n("<input type='text' id='"+h+"' style='position: absolute; top: -100px; width: 0px;'/>"),this._dialogInput.keydown(this._doKeyDown),n("body").append(this._dialogInput),s=this._dialogInst=this._newInst(this._dialogInput,!1),s.settings={},n.data(this._dialogInput[0],i,s)),u(s.settings,e||{}),r=r&&r.constructor===Date?this._formatDate(s,r):r,this._dialogInput.val(r),this._pos=o?o.length?o:[o.pageX,o.pageY]:null,this._pos||(c=document.documentElement.clientWidth,l=document.documentElement.clientHeight,a=document.documentElement.scrollLeft||document.body.scrollLeft,v=document.documentElement.scrollTop||document.body.scrollTop,this._pos=[c/2-100+a,l/2-150+v]),this._dialogInput.css("left",this._pos[0]+20+"px").css("top",this._pos[1]+"px"),s.settings.onSelect=f,this._inDialog=!0,this.dpDiv.addClass(this._dialogClass),this._showDatepicker(this._dialogInput[0]),n.blockUI&&n.blockUI(this.dpDiv),n.data(this._dialogInput[0],i,s),this},_destroyDatepicker:function(t){var r,u=n(t),f=n.data(t,i);u.hasClass(this.markerClassName)&&(r=t.nodeName.toLowerCase(),n.removeData(t,i),r==="input"?(f.append.remove(),f.trigger.remove(),u.removeClass(this.markerClassName).unbind("focus",this._showDatepicker).unbind("keydown",this._doKeyDown).unbind("keypress",this._doKeyPress).unbind("keyup",this._doKeyUp)):(r==="div"||r==="span")&&u.removeClass(this.markerClassName).empty())},_enableDatepicker:function(t){var r,u,f=n(t),e=n.data(t,i);f.hasClass(this.markerClassName)&&(r=t.nodeName.toLowerCase(),r==="input"?(t.disabled=!1,e.trigger.filter("button").each(function(){this.disabled=!1}).end().filter("img").css({opacity:"1.0",cursor:""})):(r==="div"||r==="span")&&(u=f.children("."+this._inlineClass),u.children().removeClass("ui-state-disabled"),u.find("select.ui-datepicker-month, select.ui-datepicker-year").prop("disabled",!1)),this._disabledInputs=n.map(this._disabledInputs,function(n){return n===t?null:n}))},_disableDatepicker:function(t){var r,u,f=n(t),e=n.data(t,i);f.hasClass(this.markerClassName)&&(r=t.nodeName.toLowerCase(),r==="input"?(t.disabled=!0,e.trigger.filter("button").each(function(){this.disabled=!0}).end().filter("img").css({opacity:"0.5",cursor:"default"})):(r==="div"||r==="span")&&(u=f.children("."+this._inlineClass),u.children().addClass("ui-state-disabled"),u.find("select.ui-datepicker-month, select.ui-datepicker-year").prop("disabled",!0)),this._disabledInputs=n.map(this._disabledInputs,function(n){return n===t?null:n}),this._disabledInputs[this._disabledInputs.length]=t)},_isDisabledDatepicker:function(n){if(!n)return!1;for(var t=0;t<this._disabledInputs.length;t++)if(this._disabledInputs[t]===n)return!0;return!1},_getInst:function(t){try{return n.data(t,i)}catch(r){throw"Missing instance data for this datepicker";}},_optionDatepicker:function(i,r,f){var o,c,s,h,e=this._getInst(i);if(arguments.length===2&&typeof r=="string")return r==="defaults"?n.extend({},n.datepicker._defaults):e?r==="all"?n.extend({},e.settings):this._get(e,r):null;o=r||{};typeof r=="string"&&(o={},o[r]=f);e&&(this._curInst===e&&this._hideDatepicker(),c=this._getDateDatepicker(i,!0),s=this._getMinMaxDate(e,"min"),h=this._getMinMaxDate(e,"max"),u(e.settings,o),s!==null&&o.dateFormat!==t&&o.minDate===t&&(e.settings.minDate=this._formatDate(e,s)),h!==null&&o.dateFormat!==t&&o.maxDate===t&&(e.settings.maxDate=this._formatDate(e,h)),"disabled"in o&&(o.disabled?this._disableDatepicker(i):this._enableDatepicker(i)),this._attachments(n(i),e),this._autoSize(e),this._setDate(e,c),this._updateAlternate(e),this._updateDatepicker(e))},_changeDatepicker:function(n,t,i){this._optionDatepicker(n,t,i)},_refreshDatepicker:function(n){var t=this._getInst(n);t&&this._updateDatepicker(t)},_setDateDatepicker:function(n,t){var i=this._getInst(n);i&&(this._setDate(i,t),this._updateDatepicker(i),this._updateAlternate(i))},_getDateDatepicker:function(n,t){var i=this._getInst(n);return i&&!i.inline&&this._setDateFromField(i,t),i?this._getDate(i):null},_doKeyDown:function(t){var u,e,f,i=n.datepicker._getInst(t.target),r=!0,o=i.dpDiv.is(".ui-datepicker-rtl");if(i._keyEvent=!0,n.datepicker._datepickerShowing)switch(t.keyCode){case 9:n.datepicker._hideDatepicker();r=!1;break;case 13:return f=n("td."+n.datepicker._dayOverClass+":not(."+n.datepicker._currentClass+")",i.dpDiv),f[0]&&n.datepicker._selectDay(t.target,i.selectedMonth,i.selectedYear,f[0]),u=n.datepicker._get(i,"onSelect"),u?(e=n.datepicker._formatDate(i),u.apply(i.input?i.input[0]:null,[e,i])):n.datepicker._hideDatepicker(),!1;case 27:n.datepicker._hideDatepicker();break;case 33:n.datepicker._adjustDate(t.target,t.ctrlKey?-n.datepicker._get(i,"stepBigMonths"):-n.datepicker._get(i,"stepMonths"),"M");break;case 34:n.datepicker._adjustDate(t.target,t.ctrlKey?+n.datepicker._get(i,"stepBigMonths"):+n.datepicker._get(i,"stepMonths"),"M");break;case 35:(t.ctrlKey||t.metaKey)&&n.datepicker._clearDate(t.target);r=t.ctrlKey||t.metaKey;break;case 36:(t.ctrlKey||t.metaKey)&&n.datepicker._gotoToday(t.target);r=t.ctrlKey||t.metaKey;break;case 37:(t.ctrlKey||t.metaKey)&&n.datepicker._adjustDate(t.target,o?1:-1,"D");r=t.ctrlKey||t.metaKey;t.originalEvent.altKey&&n.datepicker._adjustDate(t.target,t.ctrlKey?-n.datepicker._get(i,"stepBigMonths"):-n.datepicker._get(i,"stepMonths"),"M");break;case 38:(t.ctrlKey||t.metaKey)&&n.datepicker._adjustDate(t.target,-7,"D");r=t.ctrlKey||t.metaKey;break;case 39:(t.ctrlKey||t.metaKey)&&n.datepicker._adjustDate(t.target,o?-1:1,"D");r=t.ctrlKey||t.metaKey;t.originalEvent.altKey&&n.datepicker._adjustDate(t.target,t.ctrlKey?+n.datepicker._get(i,"stepBigMonths"):+n.datepicker._get(i,"stepMonths"),"M");break;case 40:(t.ctrlKey||t.metaKey)&&n.datepicker._adjustDate(t.target,7,"D");r=t.ctrlKey||t.metaKey;break;default:r=!1}else t.keyCode===36&&t.ctrlKey?n.datepicker._showDatepicker(this):r=!1;r&&(t.preventDefault(),t.stopPropagation())},_doKeyPress:function(t){var i,r,u=n.datepicker._getInst(t.target);if(n.datepicker._get(u,"constrainInput"))return i=n.datepicker._possibleChars(n.datepicker._get(u,"dateFormat")),r=String.fromCharCode(t.charCode==null?t.keyCode:t.charCode),t.ctrlKey||t.metaKey||r<" "||!i||i.indexOf(r)>-1},_doKeyUp:function(t){var r,i=n.datepicker._getInst(t.target);if(i.input.val()!==i.lastVal)try{r=n.datepicker.parseDate(n.datepicker._get(i,"dateFormat"),i.input?i.input.val():null,n.datepicker._getFormatConfig(i));r&&(n.datepicker._setDateFromField(i),n.datepicker._updateAlternate(i),n.datepicker._updateDatepicker(i))}catch(u){}return!0},_showDatepicker:function(t){if(t=t.target||t,t.nodeName.toLowerCase()!=="input"&&(t=n("input",t.parentNode)[0]),!n.datepicker._isDisabledDatepicker(t)&&n.datepicker._lastInput!==t){var i,o,s,r,f,e,h;(i=n.datepicker._getInst(t),n.datepicker._curInst&&n.datepicker._curInst!==i&&(n.datepicker._curInst.dpDiv.stop(!0,!0),i&&n.datepicker._datepickerShowing&&n.datepicker._hideDatepicker(n.datepicker._curInst.input[0])),o=n.datepicker._get(i,"beforeShow"),s=o?o.apply(t,[t,i]):{},s!==!1)&&(u(i.settings,s),i.lastVal=null,n.datepicker._lastInput=t,n.datepicker._setDateFromField(i),n.datepicker._inDialog&&(t.value=""),n.datepicker._pos||(n.datepicker._pos=n.datepicker._findPos(t),n.datepicker._pos[1]+=t.offsetHeight),r=!1,n(t).parents().each(function(){return r|=n(this).css("position")==="fixed",!r}),f={left:n.datepicker._pos[0],top:n.datepicker._pos[1]},n.datepicker._pos=null,i.dpDiv.empty(),i.dpDiv.css({position:"absolute",display:"block",top:"-1000px"}),n.datepicker._updateDatepicker(i),f=n.datepicker._checkOffset(i,f,r),i.dpDiv.css({position:n.datepicker._inDialog&&n.blockUI?"static":r?"fixed":"absolute",display:"none",left:f.left+"px",top:f.top+"px"}),i.inline||(e=n.datepicker._get(i,"showAnim"),h=n.datepicker._get(i,"duration"),i.dpDiv.zIndex(n(t).zIndex()+1),n.datepicker._datepickerShowing=!0,n.effects&&n.effects.effect[e]?i.dpDiv.show(e,n.datepicker._get(i,"showOptions"),h):i.dpDiv[e||"show"](e?h:null),i.input.is(":visible")&&!i.input.is(":disabled")&&i.input.focus(),n.datepicker._curInst=i))}},_updateDatepicker:function(t){this.maxRows=4;f=t;t.dpDiv.empty().append(this._generateHTML(t));this._attachHandlers(t);t.dpDiv.find("."+this._dayOverClass+" a").mouseover();var i,r=this._getNumberOfMonths(t),u=r[1];t.dpDiv.removeClass("ui-datepicker-multi-2 ui-datepicker-multi-3 ui-datepicker-multi-4").width("");u>1&&t.dpDiv.addClass("ui-datepicker-multi-"+u).css("width",17*u+"em");t.dpDiv[(r[0]!==1||r[1]!==1?"add":"remove")+"Class"]("ui-datepicker-multi");t.dpDiv[(this._get(t,"isRTL")?"add":"remove")+"Class"]("ui-datepicker-rtl");t===n.datepicker._curInst&&n.datepicker._datepickerShowing&&t.input&&t.input.is(":visible")&&!t.input.is(":disabled")&&t.input[0]!==document.activeElement&&t.input.focus();t.yearshtml&&(i=t.yearshtml,setTimeout(function(){i===t.yearshtml&&t.yearshtml&&t.dpDiv.find("select.ui-datepicker-year:first").replaceWith(t.yearshtml);i=t.yearshtml=null},0))},_getBorders:function(n){var t=function(n){return{thin:1,medium:2,thick:3}[n]||n};return[parseFloat(t(n.css("border-left-width"))),parseFloat(t(n.css("border-top-width")))]},_checkOffset:function(t,i,r){var u=t.dpDiv.outerWidth(),f=t.dpDiv.outerHeight(),h=t.input?t.input.outerWidth():0,o=t.input?t.input.outerHeight():0,e=document.documentElement.clientWidth+(r?0:n(document).scrollLeft()),s=document.documentElement.clientHeight+(r?0:n(document).scrollTop());return i.left-=this._get(t,"isRTL")?u-h:0,i.left-=r&&i.left===t.input.offset().left?n(document).scrollLeft():0,i.top-=r&&i.top===t.input.offset().top+o?n(document).scrollTop():0,i.left-=Math.min(i.left,i.left+u>e&&e>u?Math.abs(i.left+u-e):0),i.top-=Math.min(i.top,i.top+f>s&&s>f?Math.abs(f+o):0),i},_findPos:function(t){for(var i,r=this._getInst(t),u=this._get(r,"isRTL");t&&(t.type==="hidden"||t.nodeType!==1||n.expr.filters.hidden(t));)t=t[u?"previousSibling":"nextSibling"];return i=n(t).offset(),[i.left,i.top]},_hideDatepicker:function(t){var u,e,f,o,r=this._curInst;r&&(!t||r===n.data(t,i))&&this._datepickerShowing&&(u=this._get(r,"showAnim"),e=this._get(r,"duration"),f=function(){n.datepicker._tidyDialog(r)},n.effects&&(n.effects.effect[u]||n.effects[u])?r.dpDiv.hide(u,n.datepicker._get(r,"showOptions"),e,f):r.dpDiv[u==="slideDown"?"slideUp":u==="fadeIn"?"fadeOut":"hide"](u?e:null,f),u||f(),this._datepickerShowing=!1,o=this._get(r,"onClose"),o&&o.apply(r.input?r.input[0]:null,[r.input?r.input.val():"",r]),this._lastInput=null,this._inDialog&&(this._dialogInput.css({position:"absolute",left:"0",top:"-100px"}),n.blockUI&&(n.unblockUI(),n("body").append(this.dpDiv))),this._inDialog=!1)},_tidyDialog:function(n){n.dpDiv.removeClass(this._dialogClass).unbind(".ui-datepicker-calendar")},_checkExternalClick:function(t){if(n.datepicker._curInst){var i=n(t.target),r=n.datepicker._getInst(i[0]);(i[0].id===n.datepicker._mainDivId||i.parents("#"+n.datepicker._mainDivId).length!==0||i.hasClass(n.datepicker.markerClassName)||i.closest("."+n.datepicker._triggerClass).length||!n.datepicker._datepickerShowing||n.datepicker._inDialog&&n.blockUI)&&(!i.hasClass(n.datepicker.markerClassName)||n.datepicker._curInst===r)||n.datepicker._hideDatepicker()}},_adjustDate:function(t,i,r){var f=n(t),u=this._getInst(f[0]);this._isDisabledDatepicker(f[0])||(this._adjustInstDate(u,i+(r==="M"?this._get(u,"showCurrentAtPos"):0),r),this._updateDatepicker(u))},_gotoToday:function(t){var r,u=n(t),i=this._getInst(u[0]);this._get(i,"gotoCurrent")&&i.currentDay?(i.selectedDay=i.currentDay,i.drawMonth=i.selectedMonth=i.currentMonth,i.drawYear=i.selectedYear=i.currentYear):(r=new Date,i.selectedDay=r.getDate(),i.drawMonth=i.selectedMonth=r.getMonth(),i.drawYear=i.selectedYear=r.getFullYear());this._notifyChange(i);this._adjustDate(u)},_selectMonthYear:function(t,i,r){var f=n(t),u=this._getInst(f[0]);u["selected"+(r==="M"?"Month":"Year")]=u["draw"+(r==="M"?"Month":"Year")]=parseInt(i.options[i.selectedIndex].value,10);this._notifyChange(u);this._adjustDate(f)},_selectDay:function(t,i,r,u){var f,e=n(t);n(u).hasClass(this._unselectableClass)||this._isDisabledDatepicker(e[0])||(f=this._getInst(e[0]),f.selectedDay=f.currentDay=n("a",u).html(),f.selectedMonth=f.currentMonth=i,f.selectedYear=f.currentYear=r,this._selectDate(t,this._formatDate(f,f.currentDay,f.currentMonth,f.currentYear)))},_clearDate:function(t){var i=n(t);this._selectDate(i,"")},_selectDate:function(t,i){var u,f=n(t),r=this._getInst(f[0]);i=i!=null?i:this._formatDate(r);r.input&&r.input.val(i);this._updateAlternate(r);u=this._get(r,"onSelect");u?u.apply(r.input?r.input[0]:null,[i,r]):r.input&&r.input.trigger("change");r.inline?this._updateDatepicker(r):(this._hideDatepicker(),this._lastInput=r.input[0],typeof r.input[0]!="object"&&r.input.focus(),this._lastInput=null)},_updateAlternate:function(t){var i,r,u,f=this._get(t,"altField");f&&(i=this._get(t,"altFormat")||this._get(t,"dateFormat"),r=this._getDate(t),u=this.formatDate(i,r,this._getFormatConfig(t)),n(f).each(function(){n(this).val(u)}))},noWeekends:function(n){var t=n.getDay();return[t>0&&t<6,""]},iso8601Week:function(n){var i,t=new Date(n.getTime());return t.setDate(t.getDate()+4-(t.getDay()||7)),i=t.getTime(),t.setMonth(0),t.setDate(1),Math.floor(Math.round((i-t)/864e5)/7)+1},parseDate:function(t,i,r){if(t==null||i==null)throw"Invalid arguments";if(i=typeof i=="object"?i.toString():i+"",i==="")return null;for(var a,v,f=0,y=(r?r.shortYearCutoff:null)||this._defaults.shortYearCutoff,d=typeof y!="string"?y:(new Date).getFullYear()%100+parseInt(y,10),g=(r?r.dayNamesShort:null)||this._defaults.dayNamesShort,nt=(r?r.dayNames:null)||this._defaults.dayNames,tt=(r?r.monthNamesShort:null)||this._defaults.monthNamesShort,it=(r?r.monthNames:null)||this._defaults.monthNames,e=-1,s=-1,h=-1,p=-1,w=!1,u,l=function(n){var i=o+1<t.length&&t.charAt(o+1)===n;return i&&o++,i},c=function(n){var r=l(n),u=n==="@"?14:n==="!"?20:n==="y"&&r?4:n==="o"?3:2,e=new RegExp("^\\d{1,"+u+"}"),t=i.substring(f).match(e);if(!t)throw"Missing number at position "+f;return f+=t[0].length,parseInt(t[0],10)},k=function(t,r,u){var e=-1,o=n.map(l(t)?u:r,function(n,t){return[[t,n]]}).sort(function(n,t){return-(n[1].length-t[1].length)});if(n.each(o,function(n,t){var r=t[1];if(i.substr(f,r.length).toLowerCase()===r.toLowerCase())return e=t[0],f+=r.length,!1}),e!==-1)return e+1;throw"Unknown name at position "+f;},b=function(){if(i.charAt(f)!==t.charAt(o))throw"Unexpected literal at position "+f;f++},o=0;o<t.length;o++)if(w)t.charAt(o)!=="'"||l("'")?b():w=!1;else switch(t.charAt(o)){case"d":h=c("d");break;case"D":k("D",g,nt);break;case"o":p=c("o");break;case"m":s=c("m");break;case"M":s=k("M",tt,it);break;case"y":e=c("y");break;case"@":u=new Date(c("@"));e=u.getFullYear();s=u.getMonth()+1;h=u.getDate();break;case"!":u=new Date((c("!")-this._ticksTo1970)/1e4);e=u.getFullYear();s=u.getMonth()+1;h=u.getDate();break;case"'":l("'")?b():w=!0;break;default:b()}if(f<i.length&&(v=i.substr(f),!/^\s+/.test(v)))throw"Extra/unparsed characters found in date: "+v;if(e===-1?e=(new Date).getFullYear():e<100&&(e+=(new Date).getFullYear()-(new Date).getFullYear()%100+(e<=d?0:-100)),p>-1){s=1;h=p;do{if(a=this._getDaysInMonth(e,s-1),h<=a)break;s++;h-=a}while(1)}if(u=this._daylightSavingAdjust(new Date(e,s-1,h)),u.getFullYear()!==e||u.getMonth()+1!==s||u.getDate()!==h)throw"Invalid date";return u},ATOM:"yy-mm-dd",COOKIE:"D, dd M yy",ISO_8601:"yy-mm-dd",RFC_822:"D, d M y",RFC_850:"DD, dd-M-y",RFC_1036:"D, d M y",RFC_1123:"D, d M yy",RFC_2822:"D, d M yy",RSS:"D, d M y",TICKS:"!",TIMESTAMP:"@",W3C:"yy-mm-dd",_ticksTo1970:(718685+Math.floor(1970/4)-Math.floor(1970/100)+Math.floor(1970/400))*864e9,formatDate:function(n,t,i){if(!t)return"";var u,h=(i?i.dayNamesShort:null)||this._defaults.dayNamesShort,c=(i?i.dayNames:null)||this._defaults.dayNames,l=(i?i.monthNamesShort:null)||this._defaults.monthNamesShort,a=(i?i.monthNames:null)||this._defaults.monthNames,f=function(t){var i=u+1<n.length&&n.charAt(u+1)===t;return i&&u++,i},e=function(n,t,i){var r=""+t;if(f(n))while(r.length<i)r="0"+r;return r},s=function(n,t,i,r){return f(n)?r[t]:i[t]},r="",o=!1;if(t)for(u=0;u<n.length;u++)if(o)n.charAt(u)!=="'"||f("'")?r+=n.charAt(u):o=!1;else switch(n.charAt(u)){case"d":r+=e("d",t.getDate(),2);break;case"D":r+=s("D",t.getDay(),h,c);break;case"o":r+=e("o",Math.round((new Date(t.getFullYear(),t.getMonth(),t.getDate()).getTime()-new Date(t.getFullYear(),0,0).getTime())/864e5),3);break;case"m":r+=e("m",t.getMonth()+1,2);break;case"M":r+=s("M",t.getMonth(),l,a);break;case"y":r+=f("y")?t.getFullYear():(t.getYear()%100<10?"0":"")+t.getYear()%100;break;case"@":r+=t.getTime();break;case"!":r+=t.getTime()*1e4+this._ticksTo1970;break;case"'":f("'")?r+="'":o=!0;break;default:r+=n.charAt(u)}return r},_possibleChars:function(n){for(var i="",r=!1,u=function(i){var r=t+1<n.length&&n.charAt(t+1)===i;return r&&t++,r},t=0;t<n.length;t++)if(r)n.charAt(t)!=="'"||u("'")?i+=n.charAt(t):r=!1;else switch(n.charAt(t)){case"d":case"m":case"y":case"@":i+="0123456789";break;case"D":case"M":return null;case"'":u("'")?i+="'":r=!0;break;default:i+=n.charAt(t)}return i},_get:function(n,i){return n.settings[i]!==t?n.settings[i]:this._defaults[i]},_setDateFromField:function(n,t){if(n.input.val()!==n.lastVal){var f=this._get(n,"dateFormat"),r=n.lastVal=n.input?n.input.val():null,u=this._getDefaultDate(n),i=u,e=this._getFormatConfig(n);try{i=this.parseDate(f,r,e)||u}catch(o){r=t?"":r}n.selectedDay=i.getDate();n.drawMonth=n.selectedMonth=i.getMonth();n.drawYear=n.selectedYear=i.getFullYear();n.currentDay=r?i.getDate():0;n.currentMonth=r?i.getMonth():0;n.currentYear=r?i.getFullYear():0;this._adjustInstDate(n)}},_getDefaultDate:function(n){return this._restrictMinMax(n,this._determineDate(n,this._get(n,"defaultDate"),new Date))},_determineDate:function(t,i,r){var f=function(n){var t=new Date;return t.setDate(t.getDate()+n),t},e=function(i){try{return n.datepicker.parseDate(n.datepicker._get(t,"dateFormat"),i,n.datepicker._getFormatConfig(t))}catch(h){}for(var o=(i.toLowerCase().match(/^c/)?n.datepicker._getDate(t):null)||new Date,f=o.getFullYear(),e=o.getMonth(),r=o.getDate(),s=/([+\-]?[0-9]+)\s*(d|D|w|W|m|M|y|Y)?/g,u=s.exec(i);u;){switch(u[2]||"d"){case"d":case"D":r+=parseInt(u[1],10);break;case"w":case"W":r+=parseInt(u[1],10)*7;break;case"m":case"M":e+=parseInt(u[1],10);r=Math.min(r,n.datepicker._getDaysInMonth(f,e));break;case"y":case"Y":f+=parseInt(u[1],10);r=Math.min(r,n.datepicker._getDaysInMonth(f,e))}u=s.exec(i)}return new Date(f,e,r)},u=i==null||i===""?r:typeof i=="string"?e(i):typeof i=="number"?isNaN(i)?r:f(i):new Date(i.getTime());return u=u&&u.toString()==="Invalid Date"?r:u,u&&(u.setHours(0),u.setMinutes(0),u.setSeconds(0),u.setMilliseconds(0)),this._daylightSavingAdjust(u)},_daylightSavingAdjust:function(n){return n?(n.setHours(n.getHours()>12?n.getHours()+2:0),n):null},_setDate:function(n,t,i){var u=!t,f=n.selectedMonth,e=n.selectedYear,r=this._restrictMinMax(n,this._determineDate(n,t,new Date));n.selectedDay=n.currentDay=r.getDate();n.drawMonth=n.selectedMonth=n.currentMonth=r.getMonth();n.drawYear=n.selectedYear=n.currentYear=r.getFullYear();f===n.selectedMonth&&e===n.selectedYear||i||this._notifyChange(n);this._adjustInstDate(n);n.input&&n.input.val(u?"":this._formatDate(n))},_getDate:function(n){return!n.currentYear||n.input&&n.input.val()===""?null:this._daylightSavingAdjust(new Date(n.currentYear,n.currentMonth,n.currentDay))},_attachHandlers:function(t){var u=this._get(t,"stepMonths"),i="#"+t.id.replace(/\\\\/g,"\\");t.dpDiv.find("[data-handler]").map(function(){var t={prev:function(){window["DP_jQuery_"+r].datepicker._adjustDate(i,-u,"M")},next:function(){window["DP_jQuery_"+r].datepicker._adjustDate(i,+u,"M")},hide:function(){window["DP_jQuery_"+r].datepicker._hideDatepicker()},today:function(){window["DP_jQuery_"+r].datepicker._gotoToday(i)},selectDay:function(){return window["DP_jQuery_"+r].datepicker._selectDay(i,+this.getAttribute("data-month"),+this.getAttribute("data-year"),this),!1},selectMonth:function(){return window["DP_jQuery_"+r].datepicker._selectMonthYear(i,this,"M"),!1},selectYear:function(){return window["DP_jQuery_"+r].datepicker._selectMonthYear(i,this,"Y"),!1}};n(this).bind(this.getAttribute("data-event"),t[this.getAttribute("data-handler")])})},_generateHTML:function(n){var b,s,rt,h,ut,k,ft,et,ri,c,ot,ui,fi,ei,oi,st,g,si,ht,nt,f,y,ct,p,lt,l,u,at,vt,yt,pt,tt,wt,i,bt,kt,d,a,it,dt=new Date,gt=this._daylightSavingAdjust(new Date(dt.getFullYear(),dt.getMonth(),dt.getDate())),e=this._get(n,"isRTL"),li=this._get(n,"showButtonPanel"),hi=this._get(n,"hideIfNoPrevNext"),ni=this._get(n,"navigationAsDateFormat"),o=this._getNumberOfMonths(n),ai=this._get(n,"showCurrentAtPos"),ci=this._get(n,"stepMonths"),ti=o[0]!==1||o[1]!==1,ii=this._daylightSavingAdjust(n.currentDay?new Date(n.currentYear,n.currentMonth,n.currentDay):new Date(9999,9,9)),w=this._getMinMaxDate(n,"min"),v=this._getMinMaxDate(n,"max"),t=n.drawMonth-ai,r=n.drawYear;if(t<0&&(t+=12,r--),v)for(b=this._daylightSavingAdjust(new Date(v.getFullYear(),v.getMonth()-o[0]*o[1]+1,v.getDate())),b=w&&b<w?w:b;this._daylightSavingAdjust(new Date(r,t,1))>b;)t--,t<0&&(t=11,r--);for(n.drawMonth=t,n.drawYear=r,s=this._get(n,"prevText"),s=ni?this.formatDate(s,this._daylightSavingAdjust(new Date(r,t-ci,1)),this._getFormatConfig(n)):s,rt=this._canAdjustMonth(n,-1,r,t)?"<a class='ui-datepicker-prev ui-corner-all' data-handler='prev' data-event='click' title='"+s+"'><span class='ui-icon ui-icon-circle-triangle-"+(e?"e":"w")+"'>"+s+"<\/span><\/a>":hi?"":"<a class='ui-datepicker-prev ui-corner-all ui-state-disabled' title='"+s+"'><span class='ui-icon ui-icon-circle-triangle-"+(e?"e":"w")+"'>"+s+"<\/span><\/a>",h=this._get(n,"nextText"),h=ni?this.formatDate(h,this._daylightSavingAdjust(new Date(r,t+ci,1)),this._getFormatConfig(n)):h,ut=this._canAdjustMonth(n,1,r,t)?"<a class='ui-datepicker-next ui-corner-all' data-handler='next' data-event='click' title='"+h+"'><span class='ui-icon ui-icon-circle-triangle-"+(e?"w":"e")+"'>"+h+"<\/span><\/a>":hi?"":"<a class='ui-datepicker-next ui-corner-all ui-state-disabled' title='"+h+"'><span class='ui-icon ui-icon-circle-triangle-"+(e?"w":"e")+"'>"+h+"<\/span><\/a>",k=this._get(n,"currentText"),ft=this._get(n,"gotoCurrent")&&n.currentDay?ii:gt,k=ni?this.formatDate(k,ft,this._getFormatConfig(n)):k,et=n.inline?"":"<button type='button' class='ui-datepicker-close ui-state-default ui-priority-primary ui-corner-all' data-handler='hide' data-event='click'>"+this._get(n,"closeText")+"<\/button>",ri=li?"<div class='ui-datepicker-buttonpane ui-widget-content'>"+(e?et:"")+(this._isInRange(n,ft)?"<button type='button' class='ui-datepicker-current ui-state-default ui-priority-secondary ui-corner-all' data-handler='today' data-event='click'>"+k+"<\/button>":"")+(e?"":et)+"<\/div>":"",c=parseInt(this._get(n,"firstDay"),10),c=isNaN(c)?0:c,ot=this._get(n,"showWeek"),ui=this._get(n,"dayNames"),fi=this._get(n,"dayNamesMin"),ei=this._get(n,"monthNames"),oi=this._get(n,"monthNamesShort"),st=this._get(n,"beforeShowDay"),g=this._get(n,"showOtherMonths"),si=this._get(n,"selectOtherMonths"),ht=this._getDefaultDate(n),nt="",f,y=0;y<o[0];y++){for(ct="",this.maxRows=4,p=0;p<o[1];p++){if(lt=this._daylightSavingAdjust(new Date(r,t,n.selectedDay)),l=" ui-corner-all",u="",ti){if(u+="<div class='ui-datepicker-group",o[1]>1)switch(p){case 0:u+=" ui-datepicker-group-first";l=" ui-corner-"+(e?"right":"left");break;case o[1]-1:u+=" ui-datepicker-group-last";l=" ui-corner-"+(e?"left":"right");break;default:u+=" ui-datepicker-group-middle";l=""}u+="'>"}for(u+="<div class='ui-datepicker-header ui-widget-header ui-helper-clearfix"+l+"'>"+(/all|left/.test(l)&&y===0?e?ut:rt:"")+(/all|right/.test(l)&&y===0?e?rt:ut:"")+this._generateMonthYearHeader(n,t,r,w,v,y>0||p>0,ei,oi)+"<\/div><table class='ui-datepicker-calendar'><thead><tr>",at=ot?"<th class='ui-datepicker-week-col'>"+this._get(n,"weekHeader")+"<\/th>":"",f=0;f<7;f++)vt=(f+c)%7,at+="<th"+((f+c+6)%7>=5?" class='ui-datepicker-week-end'":"")+"><span title='"+ui[vt]+"'>"+fi[vt]+"<\/span><\/th>";for(u+=at+"<\/tr><\/thead><tbody>",yt=this._getDaysInMonth(r,t),r===n.selectedYear&&t===n.selectedMonth&&(n.selectedDay=Math.min(n.selectedDay,yt)),pt=(this._getFirstDayOfMonth(r,t)-c+7)%7,tt=Math.ceil((pt+yt)/7),wt=ti?this.maxRows>tt?this.maxRows:tt:tt,this.maxRows=wt,i=this._daylightSavingAdjust(new Date(r,t,1-pt)),bt=0;bt<wt;bt++){for(u+="<tr>",kt=ot?"<td class='ui-datepicker-week-col'>"+this._get(n,"calculateWeek")(i)+"<\/td>":"",f=0;f<7;f++)d=st?st.apply(n.input?n.input[0]:null,[i]):[!0,""],a=i.getMonth()!==t,it=a&&!si||!d[0]||w&&i<w||v&&i>v,kt+="<td class='"+((f+c+6)%7>=5?" ui-datepicker-week-end":"")+(a?" ui-datepicker-other-month":"")+(i.getTime()===lt.getTime()&&t===n.selectedMonth&&n._keyEvent||ht.getTime()===i.getTime()&&ht.getTime()===lt.getTime()?" "+this._dayOverClass:"")+(it?" "+this._unselectableClass+" ui-state-disabled":"")+(a&&!g?"":" "+d[1]+(i.getTime()===ii.getTime()?" "+this._currentClass:"")+(i.getTime()===gt.getTime()?" ui-datepicker-today":""))+"'"+((!a||g)&&d[2]?" title='"+d[2].replace(/'/g,"&#39;")+"'":"")+(it?"":" data-handler='selectDay' data-event='click' data-month='"+i.getMonth()+"' data-year='"+i.getFullYear()+"'")+">"+(a&&!g?"&#xa0;":it?"<span class='ui-state-default'>"+i.getDate()+"<\/span>":"<a class='ui-state-default"+(i.getTime()===gt.getTime()?" ui-state-highlight":"")+(i.getTime()===ii.getTime()?" ui-state-active":"")+(a?" ui-priority-secondary":"")+"' href='#'>"+i.getDate()+"<\/a>")+"<\/td>",i.setDate(i.getDate()+1),i=this._daylightSavingAdjust(i);u+=kt+"<\/tr>"}t++;t>11&&(t=0,r++);u+="<\/tbody><\/table>"+(ti?"<\/div>"+(o[0]>0&&p===o[1]-1?"<div class='ui-datepicker-row-break'><\/div>":""):"");ct+=u}nt+=ct}return nt+=ri,n._keyEvent=!1,nt},_generateMonthYearHeader:function(n,t,i,r,u,f,e,o){var k,d,h,v,y,p,s,a,w=this._get(n,"changeMonth"),b=this._get(n,"changeYear"),g=this._get(n,"showMonthAfterYear"),c="<div class='ui-datepicker-title'>",l="";if(f||!w)l+="<span class='ui-datepicker-month'>"+e[t]+"<\/span>";else{for(k=r&&r.getFullYear()===i,d=u&&u.getFullYear()===i,l+="<select class='ui-datepicker-month' data-handler='selectMonth' data-event='change'>",h=0;h<12;h++)(!k||h>=r.getMonth())&&(!d||h<=u.getMonth())&&(l+="<option value='"+h+"'"+(h===t?" selected='selected'":"")+">"+o[h]+"<\/option>");l+="<\/select>"}if(g||(c+=l+(f||!(w&&b)?"&#xa0;":"")),!n.yearshtml)if(n.yearshtml="",f||!b)c+="<span class='ui-datepicker-year'>"+i+"<\/span>";else{for(v=this._get(n,"yearRange").split(":"),y=(new Date).getFullYear(),p=function(n){var t=n.match(/c[+\-].*/)?i+parseInt(n.substring(1),10):n.match(/[+\-].*/)?y+parseInt(n,10):parseInt(n,10);return isNaN(t)?y:t},s=p(v[0]),a=Math.max(s,p(v[1]||"")),s=r?Math.max(s,r.getFullYear()):s,a=u?Math.min(a,u.getFullYear()):a,n.yearshtml+="<select class='ui-datepicker-year' data-handler='selectYear' data-event='change'>";s<=a;s++)n.yearshtml+="<option value='"+s+"'"+(s===i?" selected='selected'":"")+">"+s+"<\/option>";n.yearshtml+="<\/select>";c+=n.yearshtml;n.yearshtml=null}return c+=this._get(n,"yearSuffix"),g&&(c+=(f||!(w&&b)?"&#xa0;":"")+l),c+"<\/div>"},_adjustInstDate:function(n,t,i){var u=n.drawYear+(i==="Y"?t:0),f=n.drawMonth+(i==="M"?t:0),e=Math.min(n.selectedDay,this._getDaysInMonth(u,f))+(i==="D"?t:0),r=this._restrictMinMax(n,this._daylightSavingAdjust(new Date(u,f,e)));n.selectedDay=r.getDate();n.drawMonth=n.selectedMonth=r.getMonth();n.drawYear=n.selectedYear=r.getFullYear();(i==="M"||i==="Y")&&this._notifyChange(n)},_restrictMinMax:function(n,t){var i=this._getMinMaxDate(n,"min"),r=this._getMinMaxDate(n,"max"),u=i&&t<i?i:t;return r&&u>r?r:u},_notifyChange:function(n){var t=this._get(n,"onChangeMonthYear");t&&t.apply(n.input?n.input[0]:null,[n.selectedYear,n.selectedMonth+1,n])},_getNumberOfMonths:function(n){var t=this._get(n,"numberOfMonths");return t==null?[1,1]:typeof t=="number"?[1,t]:t},_getMinMaxDate:function(n,t){return this._determineDate(n,this._get(n,t+"Date"),null)},_getDaysInMonth:function(n,t){return 32-this._daylightSavingAdjust(new Date(n,t,32)).getDate()},_getFirstDayOfMonth:function(n,t){return new Date(n,t,1).getDay()},_canAdjustMonth:function(n,t,i,r){var f=this._getNumberOfMonths(n),u=this._daylightSavingAdjust(new Date(i,r+(t<0?t:f[0]*f[1]),1));return t<0&&u.setDate(this._getDaysInMonth(u.getFullYear(),u.getMonth())),this._isInRange(n,u)},_isInRange:function(n,t){var i,f,e=this._getMinMaxDate(n,"min"),o=this._getMinMaxDate(n,"max"),r=null,u=null,s=this._get(n,"yearRange");return s&&(i=s.split(":"),f=(new Date).getFullYear(),r=parseInt(i[0],10),u=parseInt(i[1],10),i[0].match(/[+\-].*/)&&(r+=f),i[1].match(/[+\-].*/)&&(u+=f)),(!e||t.getTime()>=e.getTime())&&(!o||t.getTime()<=o.getTime())&&(!r||t.getFullYear()>=r)&&(!u||t.getFullYear()<=u)},_getFormatConfig:function(n){var t=this._get(n,"shortYearCutoff");return t=typeof t!="string"?t:(new Date).getFullYear()%100+parseInt(t,10),{shortYearCutoff:t,dayNamesShort:this._get(n,"dayNamesShort"),dayNames:this._get(n,"dayNames"),monthNamesShort:this._get(n,"monthNamesShort"),monthNames:this._get(n,"monthNames")}},_formatDate:function(n,t,i,r){t||(n.currentDay=n.selectedDay,n.currentMonth=n.selectedMonth,n.currentYear=n.selectedYear);var u=t?typeof t=="object"?t:this._daylightSavingAdjust(new Date(r,i,t)):this._daylightSavingAdjust(new Date(n.currentYear,n.currentMonth,n.currentDay));return this.formatDate(this._get(n,"dateFormat"),u,this._getFormatConfig(n))}});n.fn.datepicker=function(t){if(!this.length)return this;n.datepicker.initialized||(n(document).mousedown(n.datepicker._checkExternalClick),n.datepicker.initialized=!0);n("#"+n.datepicker._mainDivId).length===0&&n("body").append(n.datepicker.dpDiv);var i=Array.prototype.slice.call(arguments,1);return typeof t=="string"&&(t==="isDisabled"||t==="getDate"||t==="widget")?n.datepicker["_"+t+"Datepicker"].apply(n.datepicker,[this[0]].concat(i)):t==="option"&&arguments.length===2&&typeof arguments[1]=="string"?n.datepicker["_"+t+"Datepicker"].apply(n.datepicker,[this[0]].concat(i)):this.each(function(){typeof t=="string"?n.datepicker["_"+t+"Datepicker"].apply(n.datepicker,[this].concat(i)):n.datepicker._attachDatepicker(this,t)})};n.datepicker=new e;n.datepicker.initialized=!1;n.datepicker.uuid=(new Date).getTime();n.datepicker.version="1.10.2";window["DP_jQuery_"+r]=n}(jQuery),function(n){var t={buttons:!0,height:!0,maxHeight:!0,maxWidth:!0,minHeight:!0,minWidth:!0,width:!0},i={maxHeight:!0,maxWidth:!0,minHeight:!0,minWidth:!0};n.widget("ui.dialog",{version:"1.10.2",options:{appendTo:"body",autoOpen:!0,buttons:[],closeOnEscape:!0,closeText:"close",dialogClass:"",draggable:!0,hide:null,height:"auto",maxHeight:null,maxWidth:null,minHeight:150,minWidth:150,modal:!1,position:{my:"center",at:"center",of:window,collision:"fit",using:function(t){var i=n(this).css(t).offset().top;i<0&&n(this).css("top",t.top-i)}},resizable:!0,show:null,title:null,width:300,beforeClose:null,close:null,drag:null,dragStart:null,dragStop:null,focus:null,open:null,resize:null,resizeStart:null,resizeStop:null},_create:function(){this.originalCss={display:this.element[0].style.display,width:this.element[0].style.width,minHeight:this.element[0].style.minHeight,maxHeight:this.element[0].style.maxHeight,height:this.element[0].style.height};this.originalPosition={parent:this.element.parent(),index:this.element.parent().children().index(this.element)};this.originalTitle=this.element.attr("title");this.options.title=this.options.title||this.originalTitle;this._createWrapper();this.element.show().removeAttr("title").addClass("ui-dialog-content ui-widget-content").appendTo(this.uiDialog);this._createTitlebar();this._createButtonPane();this.options.draggable&&n.fn.draggable&&this._makeDraggable();this.options.resizable&&n.fn.resizable&&this._makeResizable();this._isOpen=!1},_init:function(){this.options.autoOpen&&this.open()},_appendTo:function(){var t=this.options.appendTo;return t&&(t.jquery||t.nodeType)?n(t):this.document.find(t||"body").eq(0)},_destroy:function(){var n,t=this.originalPosition;this._destroyOverlay();this.element.removeUniqueId().removeClass("ui-dialog-content ui-widget-content").css(this.originalCss).detach();this.uiDialog.stop(!0,!0).remove();this.originalTitle&&this.element.attr("title",this.originalTitle);n=t.parent.children().eq(t.index);n.length&&n[0]!==this.element[0]?n.before(this.element):t.parent.append(this.element)},widget:function(){return this.uiDialog},disable:n.noop,enable:n.noop,close:function(t){var i=this;this._isOpen&&this._trigger("beforeClose",t)!==!1&&(this._isOpen=!1,this._destroyOverlay(),this.opener.filter(":focusable").focus().length||n(this.document[0].activeElement).blur(),this._hide(this.uiDialog,this.options.hide,function(){i._trigger("close",t)}))},isOpen:function(){return this._isOpen},moveToTop:function(){this._moveToTop()},_moveToTop:function(n,t){var i=!!this.uiDialog.nextAll(":visible").insertBefore(this.uiDialog).length;return i&&!t&&this._trigger("focus",n),i},open:function(){var t=this;if(this._isOpen){this._moveToTop()&&this._focusTabbable();return}this._isOpen=!0;this.opener=n(this.document[0].activeElement);this._size();this._position();this._createOverlay();this._moveToTop(null,!0);this._show(this.uiDialog,this.options.show,function(){t._focusTabbable();t._trigger("focus")});this._trigger("open")},_focusTabbable:function(){var n=this.element.find("[autofocus]");n.length||(n=this.element.find(":tabbable"));n.length||(n=this.uiDialogButtonPane.find(":tabbable"));n.length||(n=this.uiDialogTitlebarClose.filter(":tabbable"));n.length||(n=this.uiDialog);n.eq(0).focus()},_keepFocus:function(t){function i(){var t=this.document[0].activeElement,i=this.uiDialog[0]===t||n.contains(this.uiDialog[0],t);i||this._focusTabbable()}t.preventDefault();i.call(this);this._delay(i)},_createWrapper:function(){this.uiDialog=n("<div>").addClass("ui-dialog ui-widget ui-widget-content ui-corner-all ui-front "+this.options.dialogClass).hide().attr({tabIndex:-1,role:"dialog"}).appendTo(this._appendTo());this._on(this.uiDialog,{keydown:function(t){if(this.options.closeOnEscape&&!t.isDefaultPrevented()&&t.keyCode&&t.keyCode===n.ui.keyCode.ESCAPE){t.preventDefault();this.close(t);return}if(t.keyCode===n.ui.keyCode.TAB){var i=this.uiDialog.find(":tabbable"),r=i.filter(":first"),u=i.filter(":last");t.target!==u[0]&&t.target!==this.uiDialog[0]||t.shiftKey?(t.target===r[0]||t.target===this.uiDialog[0])&&t.shiftKey&&(u.focus(1),t.preventDefault()):(r.focus(1),t.preventDefault())}},mousedown:function(n){this._moveToTop(n)&&this._focusTabbable()}});this.element.find("[aria-describedby]").length||this.uiDialog.attr({"aria-describedby":this.element.uniqueId().attr("id")})},_createTitlebar:function(){var t;this.uiDialogTitlebar=n("<div>").addClass("ui-dialog-titlebar ui-widget-header ui-corner-all ui-helper-clearfix").prependTo(this.uiDialog);this._on(this.uiDialogTitlebar,{mousedown:function(t){n(t.target).closest(".ui-dialog-titlebar-close")||this.uiDialog.focus()}});this.uiDialogTitlebarClose=n("<button><\/button>").button({label:this.options.closeText,icons:{primary:"ui-icon-closethick"},text:!1}).addClass("ui-dialog-titlebar-close").appendTo(this.uiDialogTitlebar);this._on(this.uiDialogTitlebarClose,{click:function(n){n.preventDefault();this.close(n)}});t=n("<span>").uniqueId().addClass("ui-dialog-title").prependTo(this.uiDialogTitlebar);this._title(t);this.uiDialog.attr({"aria-labelledby":t.attr("id")})},_title:function(n){this.options.title||n.html("&#160;");n.text(this.options.title)},_createButtonPane:function(){this.uiDialogButtonPane=n("<div>").addClass("ui-dialog-buttonpane ui-widget-content ui-helper-clearfix");this.uiButtonSet=n("<div>").addClass("ui-dialog-buttonset").appendTo(this.uiDialogButtonPane);this._createButtons()},_createButtons:function(){var i=this,t=this.options.buttons;if(this.uiDialogButtonPane.remove(),this.uiButtonSet.empty(),n.isEmptyObject(t)||n.isArray(t)&&!t.length){this.uiDialog.removeClass("ui-dialog-buttons");return}n.each(t,function(t,r){var u,f;r=n.isFunction(r)?{click:r,text:t}:r;r=n.extend({type:"button"},r);u=r.click;r.click=function(){u.apply(i.element[0],arguments)};f={icons:r.icons,text:r.showText};delete r.icons;delete r.showText;n("<button><\/button>",r).button(f).appendTo(i.uiButtonSet)});this.uiDialog.addClass("ui-dialog-buttons");this.uiDialogButtonPane.appendTo(this.uiDialog)},_makeDraggable:function(){function i(n){return{position:n.position,offset:n.offset}}var t=this,r=this.options;this.uiDialog.draggable({cancel:".ui-dialog-content, .ui-dialog-titlebar-close",handle:".ui-dialog-titlebar",containment:"document",start:function(r,u){n(this).addClass("ui-dialog-dragging");t._blockFrames();t._trigger("dragStart",r,i(u))},drag:function(n,r){t._trigger("drag",n,i(r))},stop:function(u,f){r.position=[f.position.left-t.document.scrollLeft(),f.position.top-t.document.scrollTop()];n(this).removeClass("ui-dialog-dragging");t._unblockFrames();t._trigger("dragStop",u,i(f))}})},_makeResizable:function(){function r(n){return{originalPosition:n.originalPosition,originalSize:n.originalSize,position:n.position,size:n.size}}var i=this,t=this.options,u=t.resizable,f=this.uiDialog.css("position"),e=typeof u=="string"?u:"n,e,s,w,se,sw,ne,nw";this.uiDialog.resizable({cancel:".ui-dialog-content",containment:"document",alsoResize:this.element,maxWidth:t.maxWidth,maxHeight:t.maxHeight,minWidth:t.minWidth,minHeight:this._minHeight(),handles:e,start:function(t,u){n(this).addClass("ui-dialog-resizing");i._blockFrames();i._trigger("resizeStart",t,r(u))},resize:function(n,t){i._trigger("resize",n,r(t))},stop:function(u,f){t.height=n(this).height();t.width=n(this).width();n(this).removeClass("ui-dialog-resizing");i._unblockFrames();i._trigger("resizeStop",u,r(f))}}).css("position",f)},_minHeight:function(){var n=this.options;return n.height==="auto"?n.minHeight:Math.min(n.minHeight,n.height)},_position:function(){var n=this.uiDialog.is(":visible");n||this.uiDialog.show();this.uiDialog.position(this.options.position);n||this.uiDialog.hide()},_setOptions:function(r){var e=this,u=!1,f={};n.each(r,function(n,r){e._setOption(n,r);n in t&&(u=!0);n in i&&(f[n]=r)});u&&(this._size(),this._position());this.uiDialog.is(":data(ui-resizable)")&&this.uiDialog.resizable("option",f)},_setOption:function(n,t){var u,r,i=this.uiDialog;(n==="dialogClass"&&i.removeClass(this.options.dialogClass).addClass(t),n!=="disabled")&&(this._super(n,t),n==="appendTo"&&this.uiDialog.appendTo(this._appendTo()),n==="buttons"&&this._createButtons(),n==="closeText"&&this.uiDialogTitlebarClose.button({label:""+t}),n==="draggable"&&(u=i.is(":data(ui-draggable)"),u&&!t&&i.draggable("destroy"),!u&&t&&this._makeDraggable()),n==="position"&&this._position(),n==="resizable"&&(r=i.is(":data(ui-resizable)"),r&&!t&&i.resizable("destroy"),r&&typeof t=="string"&&i.resizable("option","handles",t),r||t===!1||this._makeResizable()),n==="title"&&this._title(this.uiDialogTitlebar.find(".ui-dialog-title")))},_size:function(){var t,i,r,n=this.options;this.element.show().css({width:"auto",minHeight:0,maxHeight:"none",height:0});n.minWidth>n.width&&(n.width=n.minWidth);t=this.uiDialog.css({height:"auto",width:n.width}).outerHeight();i=Math.max(0,n.minHeight-t);r=typeof n.maxHeight=="number"?Math.max(0,n.maxHeight-t):"none";n.height==="auto"?this.element.css({minHeight:i,maxHeight:r,height:"auto"}):this.element.height(Math.max(0,n.height-t));this.uiDialog.is(":data(ui-resizable)")&&this.uiDialog.resizable("option","minHeight",this._minHeight())},_blockFrames:function(){this.iframeBlocks=this.document.find("iframe").map(function(){var t=n(this);return n("<div>").css({position:"absolute",width:t.outerWidth(),height:t.outerHeight()}).appendTo(t.parent()).offset(t.offset())[0]})},_unblockFrames:function(){this.iframeBlocks&&(this.iframeBlocks.remove(),delete this.iframeBlocks)},_allowInteraction:function(t){return n(t.target).closest(".ui-dialog").length?!0:!!n(t.target).closest(".ui-datepicker").length},_createOverlay:function(){if(this.options.modal){var t=this,i=this.widgetFullName;n.ui.dialog.overlayInstances||this._delay(function(){n.ui.dialog.overlayInstances&&this.document.bind("focusin.dialog",function(r){t._allowInteraction(r)||(r.preventDefault(),n(".ui-dialog:visible:last .ui-dialog-content").data(i)._focusTabbable())})});this.overlay=n("<div>").addClass("ui-widget-overlay ui-front").appendTo(this._appendTo());this._on(this.overlay,{mousedown:"_keepFocus"});n.ui.dialog.overlayInstances++}},_destroyOverlay:function(){this.options.modal&&this.overlay&&(n.ui.dialog.overlayInstances--,n.ui.dialog.overlayInstances||this.document.unbind("focusin.dialog"),this.overlay.remove(),this.overlay=null)}});n.ui.dialog.overlayInstances=0;n.uiBackCompat!==!1&&n.widget("ui.dialog",n.ui.dialog,{_position:function(){var t=this.options.position,i=[],r=[0,0],u;t?((typeof t=="string"||typeof t=="object"&&"0"in t)&&(i=t.split?t.split(" "):[t[0],t[1]],i.length===1&&(i[1]=i[0]),n.each(["left","top"],function(n,t){+i[n]===i[n]&&(r[n]=i[n],i[n]=t)}),t={my:i[0]+(r[0]<0?r[0]:"+"+r[0])+" "+i[1]+(r[1]<0?r[1]:"+"+r[1]),at:i.join(" ")}),t=n.extend({},n.ui.dialog.prototype.options.position,t)):t=n.ui.dialog.prototype.options.position;u=this.uiDialog.is(":visible");u||this.uiDialog.show();this.uiDialog.position(t);u||this.uiDialog.hide()}})}(jQuery),function(n){var t=/up|down|vertical/,i=/up|left|vertical|horizontal/;n.effects.effect.blind=function(r,u){var f=n(this),c=["position","top","bottom","left","right","height","width"],p=n.effects.setMode(f,r.mode||"hide"),w=r.direction||"up",o=t.test(w),l=o?"height":"width",a=o?"top":"left",b=i.test(w),v={},y=p==="show",e,s,h;f.parent().is(".ui-effects-wrapper")?n.effects.save(f.parent(),c):n.effects.save(f,c);f.show();e=n.effects.createWrapper(f).css({overflow:"hidden"});s=e[l]();h=parseFloat(e.css(a))||0;v[l]=y?s:0;b||(f.css(o?"bottom":"right",0).css(o?"top":"left","auto").css({position:"absolute"}),v[a]=y?h:s+h);y&&(e.css(l,0),b||e.css(a,h+s));e.animate(v,{duration:r.duration,easing:r.easing,queue:!1,complete:function(){p==="hide"&&f.hide();n.effects.restore(f,c);n.effects.removeWrapper(f);u()}})}}(jQuery),function(n){n.effects.effect.bounce=function(t,i){var r=n(this),v=["position","top","bottom","left","right","height","width"],k=n.effects.setMode(r,t.mode||"effect"),f=k==="hide",y=k==="show",h=t.direction||"up",u=t.distance,p=t.times||5,d=p*2+(y||f?1:0),c=t.duration/d,l=t.easing,e=h==="up"||h==="down"?"top":"left",w=h==="up"||h==="left",b,o,s,a=r.queue(),g=a.length;for((y||f)&&v.push("opacity"),n.effects.save(r,v),r.show(),n.effects.createWrapper(r),u||(u=r[e==="top"?"outerHeight":"outerWidth"]()/3),y&&(s={opacity:1},s[e]=0,r.css("opacity",0).css(e,w?-u*2:u*2).animate(s,c,l)),f&&(u=u/Math.pow(2,p-1)),s={},s[e]=0,b=0;b<p;b++)o={},o[e]=(w?"-=":"+=")+u,r.animate(o,c,l).animate(s,c,l),u=f?u*2:u/2;f&&(o={opacity:0},o[e]=(w?"-=":"+=")+u,r.animate(o,c,l));r.queue(function(){f&&r.hide();n.effects.restore(r,v);n.effects.removeWrapper(r);i()});g>1&&a.splice.apply(a,[1,0].concat(a.splice(g,d+1)));r.dequeue()}}(jQuery),function(n){n.effects.effect.clip=function(t,i){var r=n(this),h=["position","top","bottom","left","right","height","width"],v=n.effects.setMode(r,t.mode||"hide"),f=v==="show",y=t.direction||"vertical",c=y==="vertical",o=c?"height":"width",l=c?"top":"left",s={},a,u,e;n.effects.save(r,h);r.show();a=n.effects.createWrapper(r).css({overflow:"hidden"});u=r[0].tagName==="IMG"?a:r;e=u[o]();f&&(u.css(o,0),u.css(l,e/2));s[o]=f?e:0;s[l]=f?0:e/2;u.animate(s,{queue:!1,duration:t.duration,easing:t.easing,complete:function(){f||r.hide();n.effects.restore(r,h);n.effects.removeWrapper(r);i()}})}}(jQuery),function(n){n.effects.effect.drop=function(t,i){var r=n(this),h=["position","top","bottom","left","right","opacity","height","width"],c=n.effects.setMode(r,t.mode||"hide"),e=c==="show",u=t.direction||"left",o=u==="up"||u==="down"?"top":"left",s=u==="up"||u==="left"?"pos":"neg",l={opacity:e?1:0},f;n.effects.save(r,h);r.show();n.effects.createWrapper(r);f=t.distance||r[o==="top"?"outerHeight":"outerWidth"](!0)/2;e&&r.css("opacity",0).css(o,s==="pos"?-f:f);l[o]=(e?s==="pos"?"+=":"-=":s==="pos"?"-=":"+=")+f;r.animate(l,{queue:!1,duration:t.duration,easing:t.easing,complete:function(){c==="hide"&&r.hide();n.effects.restore(r,h);n.effects.removeWrapper(r);i()}})}}(jQuery),function(n){n.effects.effect.explode=function(t,i){function k(){l.push(this);l.length===o*c&&d()}function d(){r.css({visibility:"visible"});n(l).remove();u||r.hide();i()}for(var o=t.pieces?Math.round(Math.sqrt(t.pieces)):3,c=o,r=n(this),b=n.effects.setMode(r,t.mode||"hide"),u=b==="show",w=r.show().css("visibility","hidden").offset(),s=Math.ceil(r.outerWidth()/c),h=Math.ceil(r.outerHeight()/o),l=[],e,a,v,y,p,f=0;f<o;f++)for(v=w.top+f*h,p=f-(o-1)/2,e=0;e<c;e++)a=w.left+e*s,y=e-(c-1)/2,r.clone().appendTo("body").wrap("<div><\/div>").css({position:"absolute",visibility:"visible",left:-e*s,top:-f*h}).parent().addClass("ui-effects-explode").css({position:"absolute",overflow:"hidden",width:s,height:h,left:a+(u?y*s:0),top:v+(u?p*h:0),opacity:u?0:1}).animate({left:a+(u?0:y*s),top:v+(u?0:p*h),opacity:u?1:0},t.duration||500,t.easing,k)}}(jQuery),function(n){n.effects.effect.fade=function(t,i){var r=n(this),u=n.effects.setMode(r,t.mode||"toggle");r.animate({opacity:u},{queue:!1,duration:t.duration,easing:t.easing,complete:i})}}(jQuery),function(n){n.effects.effect.fold=function(t,i){var r=n(this),s=["position","top","bottom","left","right","height","width"],h=n.effects.setMode(r,t.mode||"hide"),e=h==="show",c=h==="hide",f=t.size||15,l=/([0-9]+)%/.exec(f),a=!!t.horizFirst,v=e!==a,y=v?["width","height"]:["height","width"],p=t.duration/2,u,o,w={},b={};n.effects.save(r,s);r.show();u=n.effects.createWrapper(r).css({overflow:"hidden"});o=v?[u.width(),u.height()]:[u.height(),u.width()];l&&(f=parseInt(l[1],10)/100*o[c?0:1]);e&&u.css(a?{height:0,width:f}:{height:f,width:0});w[y[0]]=e?o[0]:f;b[y[1]]=e?o[1]:0;u.animate(w,p,t.easing).animate(b,p,t.easing,function(){c&&r.hide();n.effects.restore(r,s);n.effects.removeWrapper(r);i()})}}(jQuery),function(n){n.effects.effect.highlight=function(t,i){var r=n(this),u=["backgroundImage","backgroundColor","opacity"],f=n.effects.setMode(r,t.mode||"show"),e={backgroundColor:r.css("backgroundColor")};f==="hide"&&(e.opacity=0);n.effects.save(r,u);r.show().css({backgroundImage:"none",backgroundColor:t.color||"#ffff99"}).animate(e,{queue:!1,duration:t.duration,easing:t.easing,complete:function(){f==="hide"&&r.hide();n.effects.restore(r,u);i()}})}}(jQuery),function(n){n.effects.effect.pulsate=function(t,i){var r=n(this),e=n.effects.setMode(r,t.mode||"show"),h=e==="show",a=e==="hide",v=h||e==="hide",o=(t.times||5)*2+(v?1:0),c=t.duration/o,u=0,f=r.queue(),l=f.length,s;for((h||!r.is(":visible"))&&(r.css("opacity",0).show(),u=1),s=1;s<o;s++)r.animate({opacity:u},c,t.easing),u=1-u;r.animate({opacity:u},c,t.easing);r.queue(function(){a&&r.hide();i()});l>1&&f.splice.apply(f,[1,0].concat(f.splice(l,o+1)));r.dequeue()}}(jQuery),function(n){n.effects.effect.puff=function(t,i){var r=n(this),e=n.effects.setMode(r,t.mode||"hide"),o=e==="hide",s=parseInt(t.percent,10)||150,f=s/100,u={height:r.height(),width:r.width(),outerHeight:r.outerHeight(),outerWidth:r.outerWidth()};n.extend(t,{effect:"scale",queue:!1,fade:!0,mode:e,complete:i,percent:o?s:100,from:o?u:{height:u.height*f,width:u.width*f,outerHeight:u.outerHeight*f,outerWidth:u.outerWidth*f}});r.effect(t)};n.effects.effect.scale=function(t,i){var u=n(this),r=n.extend(!0,{},t),f=n.effects.setMode(u,t.mode||"effect"),s=parseInt(t.percent,10)||(parseInt(t.percent,10)===0?0:f==="hide"?0:100),h=t.direction||"both",c=t.origin,e={height:u.height(),width:u.width(),outerHeight:u.outerHeight(),outerWidth:u.outerWidth()},o={y:h!=="horizontal"?s/100:1,x:h!=="vertical"?s/100:1};r.effect="size";r.queue=!1;r.complete=i;f!=="effect"&&(r.origin=c||["middle","center"],r.restore=!0);r.from=t.from||(f==="show"?{height:0,width:0,outerHeight:0,outerWidth:0}:e);r.to={height:e.height*o.y,width:e.width*o.x,outerHeight:e.outerHeight*o.y,outerWidth:e.outerWidth*o.x};r.fade&&(f==="show"&&(r.from.opacity=0,r.to.opacity=1),f==="hide"&&(r.from.opacity=1,r.to.opacity=0));u.effect(r)};n.effects.effect.size=function(t,i){var f,l,u,r=n(this),w=["position","top","bottom","left","right","width","height","overflow","opacity"],a=["width","height","overflow"],v=["fontSize"],e=["borderTopWidth","borderBottomWidth","paddingTop","paddingBottom"],o=["borderLeftWidth","borderRightWidth","paddingLeft","paddingRight"],h=n.effects.setMode(r,t.mode||"effect"),y=t.restore||h!=="effect",c=t.scale||"both",b=t.origin||["middle","center"],k=r.css("position"),s=y?w:["position","top","bottom","left","right","overflow","opacity"],p={height:0,width:0,outerHeight:0,outerWidth:0};h==="show"&&r.show();f={height:r.height(),width:r.width(),outerHeight:r.outerHeight(),outerWidth:r.outerWidth()};t.mode==="toggle"&&h==="show"?(r.from=t.to||p,r.to=t.from||f):(r.from=t.from||(h==="show"?p:f),r.to=t.to||(h==="hide"?p:f));u={from:{y:r.from.height/f.height,x:r.from.width/f.width},to:{y:r.to.height/f.height,x:r.to.width/f.width}};(c==="box"||c==="both")&&(u.from.y!==u.to.y&&(s=s.concat(e),r.from=n.effects.setTransition(r,e,u.from.y,r.from),r.to=n.effects.setTransition(r,e,u.to.y,r.to)),u.from.x!==u.to.x&&(s=s.concat(o),r.from=n.effects.setTransition(r,o,u.from.x,r.from),r.to=n.effects.setTransition(r,o,u.to.x,r.to)));(c==="content"||c==="both")&&u.from.y!==u.to.y&&(s=s.concat(v).concat(a),r.from=n.effects.setTransition(r,v,u.from.y,r.from),r.to=n.effects.setTransition(r,v,u.to.y,r.to));n.effects.save(r,s);r.show();n.effects.createWrapper(r);r.css("overflow","hidden").css(r.from);b&&(l=n.effects.getBaseline(b,f),r.from.top=(f.outerHeight-r.outerHeight())*l.y,r.from.left=(f.outerWidth-r.outerWidth())*l.x,r.to.top=(f.outerHeight-r.to.outerHeight)*l.y,r.to.left=(f.outerWidth-r.to.outerWidth)*l.x);r.css(r.from);(c==="content"||c==="both")&&(e=e.concat(["marginTop","marginBottom"]).concat(v),o=o.concat(["marginLeft","marginRight"]),a=w.concat(e).concat(o),r.find("*[width]").each(function(){var i=n(this),r={height:i.height(),width:i.width(),outerHeight:i.outerHeight(),outerWidth:i.outerWidth()};y&&n.effects.save(i,a);i.from={height:r.height*u.from.y,width:r.width*u.from.x,outerHeight:r.outerHeight*u.from.y,outerWidth:r.outerWidth*u.from.x};i.to={height:r.height*u.to.y,width:r.width*u.to.x,outerHeight:r.height*u.to.y,outerWidth:r.width*u.to.x};u.from.y!==u.to.y&&(i.from=n.effects.setTransition(i,e,u.from.y,i.from),i.to=n.effects.setTransition(i,e,u.to.y,i.to));u.from.x!==u.to.x&&(i.from=n.effects.setTransition(i,o,u.from.x,i.from),i.to=n.effects.setTransition(i,o,u.to.x,i.to));i.css(i.from);i.animate(i.to,t.duration,t.easing,function(){y&&n.effects.restore(i,a)})}));r.animate(r.to,{queue:!1,duration:t.duration,easing:t.easing,complete:function(){r.to.opacity===0&&r.css("opacity",r.from.opacity);h==="hide"&&r.hide();n.effects.restore(r,s);y||(k==="static"?r.css({position:"relative",top:r.to.top,left:r.to.left}):n.each(["top","left"],function(n,t){r.css(t,function(t,i){var f=parseInt(i,10),u=n?r.to.left:r.to.top;return i==="auto"?u+"px":f+u+"px"})}));n.effects.removeWrapper(r);i()}})}}(jQuery),function(n){n.effects.effect.shake=function(t,i){var r=n(this),v=["position","top","bottom","left","right","height","width"],k=n.effects.setMode(r,t.mode||"effect"),f=t.direction||"left",o=t.distance||20,y=t.times||3,p=y*2+1,u=Math.round(t.duration/p),s=f==="up"||f==="down"?"top":"left",h=f==="up"||f==="left",c={},l={},w={},a,e=r.queue(),b=e.length;for(n.effects.save(r,v),r.show(),n.effects.createWrapper(r),c[s]=(h?"-=":"+=")+o,l[s]=(h?"+=":"-=")+o*2,w[s]=(h?"-=":"+=")+o*2,r.animate(c,u,t.easing),a=1;a<y;a++)r.animate(l,u,t.easing).animate(w,u,t.easing);r.animate(l,u,t.easing).animate(c,u/2,t.easing).queue(function(){k==="hide"&&r.hide();n.effects.restore(r,v);n.effects.removeWrapper(r);i()});b>1&&e.splice.apply(e,[1,0].concat(e.splice(b,p+1)));r.dequeue()}}(jQuery),function(n){n.effects.effect.slide=function(t,i){var r=n(this),s=["position","top","bottom","left","right","width","height"],h=n.effects.setMode(r,t.mode||"show"),c=h==="show",f=t.direction||"left",e=f==="up"||f==="down"?"top":"left",o=f==="up"||f==="left",u,l={};n.effects.save(r,s);r.show();u=t.distance||r[e==="top"?"outerHeight":"outerWidth"](!0);n.effects.createWrapper(r).css({overflow:"hidden"});c&&r.css(e,o?isNaN(u)?"-"+u:-u:u);l[e]=(c?o?"+=":"-=":o?"-=":"+=")+u;r.animate(l,{queue:!1,duration:t.duration,easing:t.easing,complete:function(){h==="hide"&&r.hide();n.effects.restore(r,s);n.effects.removeWrapper(r);i()}})}}(jQuery),function(n){n.effects.effect.transfer=function(t,i){var u=n(this),r=n(t.to),f=r.css("position")==="fixed",e=n("body"),o=f?e.scrollTop():0,s=f?e.scrollLeft():0,h=r.offset(),l={top:h.top-o,left:h.left-s,height:r.innerHeight(),width:r.innerWidth()},c=u.offset(),a=n("<div class='ui-effects-transfer'><\/div>").appendTo(document.body).addClass(t.className).css({top:c.top-o,left:c.left-s,height:u.innerHeight(),width:u.innerWidth(),position:f?"fixed":"absolute"}).animate(l,t.duration,t.easing,function(){a.remove();i()})}}(jQuery),function(n){n.widget("ui.menu",{version:"1.10.2",defaultElement:"<ul>",delay:300,options:{icons:{submenu:"ui-icon-carat-1-e"},menus:"ul",position:{my:"left top",at:"right top"},role:"menu",blur:null,focus:null,select:null},_create:function(){this.activeMenu=this.element;this.mouseHandled=!1;this.element.uniqueId().addClass("ui-menu ui-widget ui-widget-content ui-corner-all").toggleClass("ui-menu-icons",!!this.element.find(".ui-icon").length).attr({role:this.options.role,tabIndex:0}).bind("click"+this.eventNamespace,n.proxy(function(n){this.options.disabled&&n.preventDefault()},this));this.options.disabled&&this.element.addClass("ui-state-disabled").attr("aria-disabled","true");this._on({"mousedown .ui-menu-item > a":function(n){n.preventDefault()},"click .ui-state-disabled > a":function(n){n.preventDefault()},"click .ui-menu-item:has(a)":function(t){var i=n(t.target).closest(".ui-menu-item");!this.mouseHandled&&i.not(".ui-state-disabled").length&&(this.mouseHandled=!0,this.select(t),i.has(".ui-menu").length?this.expand(t):this.element.is(":focus")||(this.element.trigger("focus",[!0]),this.active&&this.active.parents(".ui-menu").length===1&&clearTimeout(this.timer)))},"mouseenter .ui-menu-item":function(t){var i=n(t.currentTarget);i.siblings().children(".ui-state-active").removeClass("ui-state-active");this.focus(t,i)},mouseleave:"collapseAll","mouseleave .ui-menu":"collapseAll",focus:function(n,t){var i=this.active||this.element.children(".ui-menu-item").eq(0);t||this.focus(n,i)},blur:function(t){this._delay(function(){n.contains(this.element[0],this.document[0].activeElement)||this.collapseAll(t)})},keydown:"_keydown"});this.refresh();this._on(this.document,{click:function(t){n(t.target).closest(".ui-menu").length||this.collapseAll(t);this.mouseHandled=!1}})},_destroy:function(){this.element.removeAttr("aria-activedescendant").find(".ui-menu").addBack().removeClass("ui-menu ui-widget ui-widget-content ui-corner-all ui-menu-icons").removeAttr("role").removeAttr("tabIndex").removeAttr("aria-labelledby").removeAttr("aria-expanded").removeAttr("aria-hidden").removeAttr("aria-disabled").removeUniqueId().show();this.element.find(".ui-menu-item").removeClass("ui-menu-item").removeAttr("role").removeAttr("aria-disabled").children("a").removeUniqueId().removeClass("ui-corner-all ui-state-hover").removeAttr("tabIndex").removeAttr("role").removeAttr("aria-haspopup").children().each(function(){var t=n(this);t.data("ui-menu-submenu-carat")&&t.remove()});this.element.find(".ui-menu-divider").removeClass("ui-menu-divider ui-widget-content")},_keydown:function(t){function s(n){return n.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g,"\\$&")}var i,f,r,e,u,o=!0;switch(t.keyCode){case n.ui.keyCode.PAGE_UP:this.previousPage(t);break;case n.ui.keyCode.PAGE_DOWN:this.nextPage(t);break;case n.ui.keyCode.HOME:this._move("first","first",t);break;case n.ui.keyCode.END:this._move("last","last",t);break;case n.ui.keyCode.UP:this.previous(t);break;case n.ui.keyCode.DOWN:this.next(t);break;case n.ui.keyCode.LEFT:this.collapse(t);break;case n.ui.keyCode.RIGHT:this.active&&!this.active.is(".ui-state-disabled")&&this.expand(t);break;case n.ui.keyCode.ENTER:case n.ui.keyCode.SPACE:this._activate(t);break;case n.ui.keyCode.ESCAPE:this.collapse(t);break;default:o=!1;f=this.previousFilter||"";r=String.fromCharCode(t.keyCode);e=!1;clearTimeout(this.filterTimer);r===f?e=!0:r=f+r;u=new RegExp("^"+s(r),"i");i=this.activeMenu.children(".ui-menu-item").filter(function(){return u.test(n(this).children("a").text())});i=e&&i.index(this.active.next())!==-1?this.active.nextAll(".ui-menu-item"):i;i.length||(r=String.fromCharCode(t.keyCode),u=new RegExp("^"+s(r),"i"),i=this.activeMenu.children(".ui-menu-item").filter(function(){return u.test(n(this).children("a").text())}));i.length?(this.focus(t,i),i.length>1?(this.previousFilter=r,this.filterTimer=this._delay(function(){delete this.previousFilter},1e3)):delete this.previousFilter):delete this.previousFilter}o&&t.preventDefault()},_activate:function(n){this.active.is(".ui-state-disabled")||(this.active.children("a[aria-haspopup='true']").length?this.expand(n):this.select(n))},refresh:function(){var t,r=this.options.icons.submenu,i=this.element.find(this.options.menus);i.filter(":not(.ui-menu)").addClass("ui-menu ui-widget ui-widget-content ui-corner-all").hide().attr({role:this.options.role,"aria-hidden":"true","aria-expanded":"false"}).each(function(){var t=n(this),i=t.prev("a"),u=n("<span>").addClass("ui-menu-icon ui-icon "+r).data("ui-menu-submenu-carat",!0);i.attr("aria-haspopup","true").prepend(u);t.attr("aria-labelledby",i.attr("id"))});t=i.add(this.element);t.children(":not(.ui-menu-item):has(a)").addClass("ui-menu-item").attr("role","presentation").children("a").uniqueId().addClass("ui-corner-all").attr({tabIndex:-1,role:this._itemRole()});t.children(":not(.ui-menu-item)").each(function(){var t=n(this);/[^\-\u2014\u2013\s]/.test(t.text())||t.addClass("ui-widget-content ui-menu-divider")});t.children(".ui-state-disabled").attr("aria-disabled","true");this.active&&!n.contains(this.element[0],this.active[0])&&this.blur()},_itemRole:function(){return{menu:"menuitem",listbox:"option"}[this.options.role]},_setOption:function(n,t){n==="icons"&&this.element.find(".ui-menu-icon").removeClass(this.options.icons.submenu).addClass(t.submenu);this._super(n,t)},focus:function(n,t){var i,r;this.blur(n,n&&n.type==="focus");this._scrollIntoView(t);this.active=t.first();r=this.active.children("a").addClass("ui-state-focus");this.options.role&&this.element.attr("aria-activedescendant",r.attr("id"));this.active.parent().closest(".ui-menu-item").children("a:first").addClass("ui-state-active");n&&n.type==="keydown"?this._close():this.timer=this._delay(function(){this._close()},this.delay);i=t.children(".ui-menu");i.length&&/^mouse/.test(n.type)&&this._startOpening(i);this.activeMenu=t.parent();this._trigger("focus",n,{item:t})},_scrollIntoView:function(t){var e,o,i,r,u,f;this._hasScroll()&&(e=parseFloat(n.css(this.activeMenu[0],"borderTopWidth"))||0,o=parseFloat(n.css(this.activeMenu[0],"paddingTop"))||0,i=t.offset().top-this.activeMenu.offset().top-e-o,r=this.activeMenu.scrollTop(),u=this.activeMenu.height(),f=t.height(),i<0?this.activeMenu.scrollTop(r+i):i+f>u&&this.activeMenu.scrollTop(r+i-u+f))},blur:function(n,t){(t||clearTimeout(this.timer),this.active)&&(this.active.children("a").removeClass("ui-state-focus"),this.active=null,this._trigger("blur",n,{item:this.active}))},_startOpening:function(n){(clearTimeout(this.timer),n.attr("aria-hidden")==="true")&&(this.timer=this._delay(function(){this._close();this._open(n)},this.delay))},_open:function(t){var i=n.extend({of:this.active},this.options.position);clearTimeout(this.timer);this.element.find(".ui-menu").not(t.parents(".ui-menu")).hide().attr("aria-hidden","true");t.show().removeAttr("aria-hidden").attr("aria-expanded","true").position(i)},collapseAll:function(t,i){clearTimeout(this.timer);this.timer=this._delay(function(){var r=i?this.element:n(t&&t.target).closest(this.element.find(".ui-menu"));r.length||(r=this.element);this._close(r);this.blur(t);this.activeMenu=r},this.delay)},_close:function(n){n||(n=this.active?this.active.parent():this.element);n.find(".ui-menu").hide().attr("aria-hidden","true").attr("aria-expanded","false").end().find("a.ui-state-active").removeClass("ui-state-active")},collapse:function(n){var t=this.active&&this.active.parent().closest(".ui-menu-item",this.element);t&&t.length&&(this._close(),this.focus(n,t))},expand:function(n){var t=this.active&&this.active.children(".ui-menu ").children(".ui-menu-item").first();t&&t.length&&(this._open(t.parent()),this._delay(function(){this.focus(n,t)}))},next:function(n){this._move("next","first",n)},previous:function(n){this._move("prev","last",n)},isFirstItem:function(){return this.active&&!this.active.prevAll(".ui-menu-item").length},isLastItem:function(){return this.active&&!this.active.nextAll(".ui-menu-item").length},_move:function(n,t,i){var r;this.active&&(r=n==="first"||n==="last"?this.active[n==="first"?"prevAll":"nextAll"](".ui-menu-item").eq(-1):this.active[n+"All"](".ui-menu-item").eq(0));r&&r.length&&this.active||(r=this.activeMenu.children(".ui-menu-item")[t]());this.focus(i,r)},nextPage:function(t){var i,r,u;if(!this.active){this.next(t);return}this.isLastItem()||(this._hasScroll()?(r=this.active.offset().top,u=this.element.height(),this.active.nextAll(".ui-menu-item").each(function(){return i=n(this),i.offset().top-r-u<0}),this.focus(t,i)):this.focus(t,this.activeMenu.children(".ui-menu-item")[this.active?"last":"first"]()))},previousPage:function(t){var i,r,u;if(!this.active){this.next(t);return}this.isFirstItem()||(this._hasScroll()?(r=this.active.offset().top,u=this.element.height(),this.active.prevAll(".ui-menu-item").each(function(){return i=n(this),i.offset().top-r+u>0}),this.focus(t,i)):this.focus(t,this.activeMenu.children(".ui-menu-item").first()))},_hasScroll:function(){return this.element.outerHeight()<this.element.prop("scrollHeight")},select:function(t){this.active=this.active||n(t.target).closest(".ui-menu-item");var i={item:this.active};this.active.has(".ui-menu").length||this.collapseAll(t,!0);this._trigger("select",t,i)}})}(jQuery),function(n,t){function a(n,t,i){return[parseFloat(n[0])*(l.test(n[0])?t/100:1),parseFloat(n[1])*(l.test(n[1])?i/100:1)]}function u(t,i){return parseInt(n.css(t,i),10)||0}function y(t){var i=t[0];return i.nodeType===9?{width:t.width(),height:t.height(),offset:{top:0,left:0}}:n.isWindow(i)?{width:t.width(),height:t.height(),offset:{top:t.scrollTop(),left:t.scrollLeft()}}:i.preventDefault?{width:0,height:0,offset:{top:i.pageY,left:i.pageX}}:{width:t.outerWidth(),height:t.outerHeight(),offset:t.offset()}}n.ui=n.ui||{};var f,r=Math.max,i=Math.abs,e=Math.round,o=/left|center|right/,s=/top|center|bottom/,h=/[\+\-]\d+(\.[\d]+)?%?/,c=/^\w+/,l=/%$/,v=n.fn.position;n.position={scrollbarWidth:function(){if(f!==t)return f;var u,r,i=n("<div style='display:block;width:50px;height:50px;overflow:hidden;'><div style='height:100px;width:auto;'><\/div><\/div>"),e=i.children()[0];return n("body").append(i),u=e.offsetWidth,i.css("overflow","scroll"),r=e.offsetWidth,u===r&&(r=i[0].clientWidth),i.remove(),f=u-r},getScrollInfo:function(t){var i=t.isWindow?"":t.element.css("overflow-x"),r=t.isWindow?"":t.element.css("overflow-y"),u=i==="scroll"||i==="auto"&&t.width<t.element[0].scrollWidth,f=r==="scroll"||r==="auto"&&t.height<t.element[0].scrollHeight;return{width:f?n.position.scrollbarWidth():0,height:u?n.position.scrollbarWidth():0}},getWithinInfo:function(t){var i=n(t||window),r=n.isWindow(i[0]);return{element:i,isWindow:r,offset:i.offset()||{left:0,top:0},scrollLeft:i.scrollLeft(),scrollTop:i.scrollTop(),width:r?i.width():i.outerWidth(),height:r?i.height():i.outerHeight()}}};n.fn.position=function(t){if(!t||!t.of)return v.apply(this,arguments);t=n.extend({},t);var b,f,l,w,p,d,g=n(t.of),tt=n.position.getWithinInfo(t.within),it=n.position.getScrollInfo(tt),k=(t.collision||"flip").split(" "),nt={};return d=y(g),g[0].preventDefault&&(t.at="left top"),f=d.width,l=d.height,w=d.offset,p=n.extend({},w),n.each(["my","at"],function(){var n=(t[this]||"").split(" "),i,r;n.length===1&&(n=o.test(n[0])?n.concat(["center"]):s.test(n[0])?["center"].concat(n):["center","center"]);n[0]=o.test(n[0])?n[0]:"center";n[1]=s.test(n[1])?n[1]:"center";i=h.exec(n[0]);r=h.exec(n[1]);nt[this]=[i?i[0]:0,r?r[0]:0];t[this]=[c.exec(n[0])[0],c.exec(n[1])[0]]}),k.length===1&&(k[1]=k[0]),t.at[0]==="right"?p.left+=f:t.at[0]==="center"&&(p.left+=f/2),t.at[1]==="bottom"?p.top+=l:t.at[1]==="center"&&(p.top+=l/2),b=a(nt.at,f,l),p.left+=b[0],p.top+=b[1],this.each(function(){var y,d,s=n(this),h=s.outerWidth(),c=s.outerHeight(),rt=u(this,"marginLeft"),ut=u(this,"marginTop"),ft=h+rt+u(this,"marginRight")+it.width,et=c+ut+u(this,"marginBottom")+it.height,o=n.extend({},p),v=a(nt.my,s.outerWidth(),s.outerHeight());t.my[0]==="right"?o.left-=h:t.my[0]==="center"&&(o.left-=h/2);t.my[1]==="bottom"?o.top-=c:t.my[1]==="center"&&(o.top-=c/2);o.left+=v[0];o.top+=v[1];n.support.offsetFractions||(o.left=e(o.left),o.top=e(o.top));y={marginLeft:rt,marginTop:ut};n.each(["left","top"],function(i,r){n.ui.position[k[i]]&&n.ui.position[k[i]][r](o,{targetWidth:f,targetHeight:l,elemWidth:h,elemHeight:c,collisionPosition:y,collisionWidth:ft,collisionHeight:et,offset:[b[0]+v[0],b[1]+v[1]],my:t.my,at:t.at,within:tt,elem:s})});t.using&&(d=function(n){var u=w.left-o.left,v=u+f-h,e=w.top-o.top,y=e+l-c,a={target:{element:g,left:w.left,top:w.top,width:f,height:l},element:{element:s,left:o.left,top:o.top,width:h,height:c},horizontal:v<0?"left":u>0?"right":"center",vertical:y<0?"top":e>0?"bottom":"middle"};f<h&&i(u+v)<f&&(a.horizontal="center");l<c&&i(e+y)<l&&(a.vertical="middle");a.important=r(i(u),i(v))>r(i(e),i(y))?"horizontal":"vertical";t.using.call(this,n,a)});s.offset(n.extend(o,{using:d}))})};n.ui.position={fit:{left:function(n,t){var e=t.within,u=e.isWindow?e.scrollLeft:e.offset.left,o=e.width,s=n.left-t.collisionPosition.marginLeft,i=u-s,f=s+t.collisionWidth-o-u,h;t.collisionWidth>o?i>0&&f<=0?(h=n.left+i+t.collisionWidth-o-u,n.left+=i-h):n.left=f>0&&i<=0?u:i>f?u+o-t.collisionWidth:u:i>0?n.left+=i:f>0?n.left-=f:n.left=r(n.left-s,n.left)},top:function(n,t){var o=t.within,u=o.isWindow?o.scrollTop:o.offset.top,e=t.within.height,s=n.top-t.collisionPosition.marginTop,i=u-s,f=s+t.collisionHeight-e-u,h;t.collisionHeight>e?i>0&&f<=0?(h=n.top+i+t.collisionHeight-e-u,n.top+=i-h):n.top=f>0&&i<=0?u:i>f?u+e-t.collisionHeight:u:i>0?n.top+=i:f>0?n.top-=f:n.top=r(n.top-s,n.top)}},flip:{left:function(n,t){var r=t.within,y=r.offset.left+r.scrollLeft,c=r.width,o=r.isWindow?r.scrollLeft:r.offset.left,l=n.left-t.collisionPosition.marginLeft,a=l-o,v=l+t.collisionWidth-c-o,u=t.my[0]==="left"?-t.elemWidth:t.my[0]==="right"?t.elemWidth:0,f=t.at[0]==="left"?t.targetWidth:t.at[0]==="right"?-t.targetWidth:0,e=-2*t.offset[0],s,h;a<0?(s=n.left+u+f+e+t.collisionWidth-c-y,(s<0||s<i(a))&&(n.left+=u+f+e)):v>0&&(h=n.left-t.collisionPosition.marginLeft+u+f+e-o,(h>0||i(h)<v)&&(n.left+=u+f+e))},top:function(n,t){var r=t.within,y=r.offset.top+r.scrollTop,a=r.height,o=r.isWindow?r.scrollTop:r.offset.top,v=n.top-t.collisionPosition.marginTop,s=v-o,h=v+t.collisionHeight-a-o,p=t.my[1]==="top",u=p?-t.elemHeight:t.my[1]==="bottom"?t.elemHeight:0,f=t.at[1]==="top"?t.targetHeight:t.at[1]==="bottom"?-t.targetHeight:0,e=-2*t.offset[1],c,l;s<0?(l=n.top+u+f+e+t.collisionHeight-a-y,n.top+u+f+e>s&&(l<0||l<i(s))&&(n.top+=u+f+e)):h>0&&(c=n.top-t.collisionPosition.marginTop+u+f+e-o,n.top+u+f+e>h&&(c>0||i(c)<h)&&(n.top+=u+f+e))}},flipfit:{left:function(){n.ui.position.flip.left.apply(this,arguments);n.ui.position.fit.left.apply(this,arguments)},top:function(){n.ui.position.flip.top.apply(this,arguments);n.ui.position.fit.top.apply(this,arguments)}}},function(){var t,i,r,u,f,e=document.getElementsByTagName("body")[0],o=document.createElement("div");t=document.createElement(e?"div":"body");r={visibility:"hidden",width:0,height:0,border:0,margin:0,background:"none"};e&&n.extend(r,{position:"absolute",left:"-1000px",top:"-1000px"});for(f in r)t.style[f]=r[f];t.appendChild(o);i=e||document.documentElement;i.insertBefore(t,i.firstChild);o.style.cssText="position: absolute; left: 10.7432222px;";u=n(o).offset().left;n.support.offsetFractions=u>10&&u<11;t.innerHTML="";i.removeChild(t)}()}(jQuery),function(n,t){n.widget("ui.progressbar",{version:"1.10.2",options:{max:100,value:0,change:null,complete:null},min:0,_create:function(){this.oldValue=this.options.value=this._constrainedValue();this.element.addClass("ui-progressbar ui-widget ui-widget-content ui-corner-all").attr({role:"progressbar","aria-valuemin":this.min});this.valueDiv=n("<div class='ui-progressbar-value ui-widget-header ui-corner-left'><\/div>").appendTo(this.element);this._refreshValue()},_destroy:function(){this.element.removeClass("ui-progressbar ui-widget ui-widget-content ui-corner-all").removeAttr("role").removeAttr("aria-valuemin").removeAttr("aria-valuemax").removeAttr("aria-valuenow");this.valueDiv.remove()},value:function(n){if(n===t)return this.options.value;this.options.value=this._constrainedValue(n);this._refreshValue()},_constrainedValue:function(n){return n===t&&(n=this.options.value),this.indeterminate=n===!1,typeof n!="number"&&(n=0),this.indeterminate?!1:Math.min(this.options.max,Math.max(this.min,n))},_setOptions:function(n){var t=n.value;delete n.value;this._super(n);this.options.value=this._constrainedValue(t);this._refreshValue()},_setOption:function(n,t){n==="max"&&(t=Math.max(this.min,t));this._super(n,t)},_percentage:function(){return this.indeterminate?100:100*(this.options.value-this.min)/(this.options.max-this.min)},_refreshValue:function(){var t=this.options.value,i=this._percentage();this.valueDiv.toggle(this.indeterminate||t>this.min).toggleClass("ui-corner-right",t===this.options.max).width(i.toFixed(0)+"%");this.element.toggleClass("ui-progressbar-indeterminate",this.indeterminate);this.indeterminate?(this.element.removeAttr("aria-valuenow"),this.overlayDiv||(this.overlayDiv=n("<div class='ui-progressbar-overlay'><\/div>").appendTo(this.valueDiv))):(this.element.attr({"aria-valuemax":this.options.max,"aria-valuenow":t}),this.overlayDiv&&(this.overlayDiv.remove(),this.overlayDiv=null));this.oldValue!==t&&(this.oldValue=t,this._trigger("change"));t===this.options.max&&this._trigger("complete")}})}(jQuery),function(n){var t=5;n.widget("ui.slider",n.ui.mouse,{version:"1.10.2",widgetEventPrefix:"slide",options:{animate:!1,distance:0,max:100,min:0,orientation:"horizontal",range:!1,step:1,value:0,values:null,change:null,slide:null,start:null,stop:null},_create:function(){this._keySliding=!1;this._mouseSliding=!1;this._animateOff=!0;this._handleIndex=null;this._detectOrientation();this._mouseInit();this.element.addClass("ui-slider ui-slider-"+this.orientation+" ui-widget ui-widget-content ui-corner-all");this._refresh();this._setOption("disabled",this.options.disabled);this._animateOff=!1},_refresh:function(){this._createRange();this._createHandles();this._setupEvents();this._refreshValue()},_createHandles:function(){var r,i,u=this.options,t=this.element.find(".ui-slider-handle").addClass("ui-state-default ui-corner-all"),f=[];for(i=u.values&&u.values.length||1,t.length>i&&(t.slice(i).remove(),t=t.slice(0,i)),r=t.length;r<i;r++)f.push("<a class='ui-slider-handle ui-state-default ui-corner-all' href='#'><\/a>");this.handles=t.add(n(f.join("")).appendTo(this.element));this.handle=this.handles.eq(0);this.handles.each(function(t){n(this).data("ui-slider-handle-index",t)})},_createRange:function(){var t=this.options,i="";t.range?(t.range===!0&&(t.values?t.values.length&&t.values.length!==2?t.values=[t.values[0],t.values[0]]:n.isArray(t.values)&&(t.values=t.values.slice(0)):t.values=[this._valueMin(),this._valueMin()]),this.range&&this.range.length?this.range.removeClass("ui-slider-range-min ui-slider-range-max").css({left:"",bottom:""}):(this.range=n("<div><\/div>").appendTo(this.element),i="ui-slider-range ui-widget-header ui-corner-all"),this.range.addClass(i+(t.range==="min"||t.range==="max"?" ui-slider-range-"+t.range:""))):this.range=n([])},_setupEvents:function(){var n=this.handles.add(this.range).filter("a");this._off(n);this._on(n,this._handleEvents);this._hoverable(n);this._focusable(n)},_destroy:function(){this.handles.remove();this.range.remove();this.element.removeClass("ui-slider ui-slider-horizontal ui-slider-vertical ui-widget ui-widget-content ui-corner-all");this._mouseDestroy()},_mouseCapture:function(t){var s,f,r,i,u,h,e,c,o=this,l=this.options;return l.disabled?!1:(this.elementSize={width:this.element.outerWidth(),height:this.element.outerHeight()},this.elementOffset=this.element.offset(),s={x:t.pageX,y:t.pageY},f=this._normValueFromMouse(s),r=this._valueMax()-this._valueMin()+1,this.handles.each(function(t){var e=Math.abs(f-o.values(t));(r>e||r===e&&(t===o._lastChangedValue||o.values(t)===l.min))&&(r=e,i=n(this),u=t)}),h=this._start(t,u),h===!1)?!1:(this._mouseSliding=!0,this._handleIndex=u,i.addClass("ui-state-active").focus(),e=i.offset(),c=!n(t.target).parents().addBack().is(".ui-slider-handle"),this._clickOffset=c?{left:0,top:0}:{left:t.pageX-e.left-i.width()/2,top:t.pageY-e.top-i.height()/2-(parseInt(i.css("borderTopWidth"),10)||0)-(parseInt(i.css("borderBottomWidth"),10)||0)+(parseInt(i.css("marginTop"),10)||0)},this.handles.hasClass("ui-state-hover")||this._slide(t,u,f),this._animateOff=!0,!0)},_mouseStart:function(){return!0},_mouseDrag:function(n){var t={x:n.pageX,y:n.pageY},i=this._normValueFromMouse(t);return this._slide(n,this._handleIndex,i),!1},_mouseStop:function(n){return this.handles.removeClass("ui-state-active"),this._mouseSliding=!1,this._stop(n,this._handleIndex),this._change(n,this._handleIndex),this._handleIndex=null,this._clickOffset=null,this._animateOff=!1,!1},_detectOrientation:function(){this.orientation=this.options.orientation==="vertical"?"vertical":"horizontal"},_normValueFromMouse:function(n){var i,r,t,u,f;return this.orientation==="horizontal"?(i=this.elementSize.width,r=n.x-this.elementOffset.left-(this._clickOffset?this._clickOffset.left:0)):(i=this.elementSize.height,r=n.y-this.elementOffset.top-(this._clickOffset?this._clickOffset.top:0)),t=r/i,t>1&&(t=1),t<0&&(t=0),this.orientation==="vertical"&&(t=1-t),u=this._valueMax()-this._valueMin(),f=this._valueMin()+t*u,this._trimAlignValue(f)},_start:function(n,t){var i={handle:this.handles[t],value:this.value()};return this.options.values&&this.options.values.length&&(i.value=this.values(t),i.values=this.values()),this._trigger("start",n,i)},_slide:function(n,t,i){var r,f,u;this.options.values&&this.options.values.length?(r=this.values(t?0:1),this.options.values.length===2&&this.options.range===!0&&(t===0&&i>r||t===1&&i<r)&&(i=r),i!==this.values(t)&&(f=this.values(),f[t]=i,u=this._trigger("slide",n,{handle:this.handles[t],value:i,values:f}),r=this.values(t?0:1),u!==!1&&this.values(t,i,!0))):i!==this.value()&&(u=this._trigger("slide",n,{handle:this.handles[t],value:i}),u!==!1&&this.value(i))},_stop:function(n,t){var i={handle:this.handles[t],value:this.value()};this.options.values&&this.options.values.length&&(i.value=this.values(t),i.values=this.values());this._trigger("stop",n,i)},_change:function(n,t){if(!this._keySliding&&!this._mouseSliding){var i={handle:this.handles[t],value:this.value()};this.options.values&&this.options.values.length&&(i.value=this.values(t),i.values=this.values());this._lastChangedValue=t;this._trigger("change",n,i)}},value:function(n){if(arguments.length){this.options.value=this._trimAlignValue(n);this._refreshValue();this._change(null,0);return}return this._value()},values:function(t,i){var u,f,r;if(arguments.length>1){this.options.values[t]=this._trimAlignValue(i);this._refreshValue();this._change(null,t);return}if(arguments.length)if(n.isArray(arguments[0])){for(u=this.options.values,f=arguments[0],r=0;r<u.length;r+=1)u[r]=this._trimAlignValue(f[r]),this._change(null,r);this._refreshValue()}else return this.options.values&&this.options.values.length?this._values(t):this.value();else return this._values()},_setOption:function(t,i){var r,u=0;t==="range"&&this.options.range===!0&&(i==="min"?(this.options.value=this._values(0),this.options.values=null):i==="max"&&(this.options.value=this._values(this.options.values.length-1),this.options.values=null));n.isArray(this.options.values)&&(u=this.options.values.length);n.Widget.prototype._setOption.apply(this,arguments);switch(t){case"orientation":this._detectOrientation();this.element.removeClass("ui-slider-horizontal ui-slider-vertical").addClass("ui-slider-"+this.orientation);this._refreshValue();break;case"value":this._animateOff=!0;this._refreshValue();this._change(null,0);this._animateOff=!1;break;case"values":for(this._animateOff=!0,this._refreshValue(),r=0;r<u;r+=1)this._change(null,r);this._animateOff=!1;break;case"min":case"max":this._animateOff=!0;this._refreshValue();this._animateOff=!1;break;case"range":this._animateOff=!0;this._refresh();this._animateOff=!1}},_value:function(){var n=this.options.value;return this._trimAlignValue(n)},_values:function(n){var r,t,i;if(arguments.length)return r=this.options.values[n],this._trimAlignValue(r);if(this.options.values&&this.options.values.length){for(t=this.options.values.slice(),i=0;i<t.length;i+=1)t[i]=this._trimAlignValue(t[i]);return t}return[]},_trimAlignValue:function(n){if(n<=this._valueMin())return this._valueMin();if(n>=this._valueMax())return this._valueMax();var t=this.options.step>0?this.options.step:1,i=(n-this._valueMin())%t,r=n-i;return Math.abs(i)*2>=t&&(r+=i>0?t:-t),parseFloat(r.toFixed(5))},_valueMin:function(){return this.options.min},_valueMax:function(){return this.options.max},_refreshValue:function(){var s,t,c,f,h,e=this.options.range,i=this.options,r=this,u=this._animateOff?!1:i.animate,o={};this.options.values&&this.options.values.length?this.handles.each(function(f){t=(r.values(f)-r._valueMin())/(r._valueMax()-r._valueMin())*100;o[r.orientation==="horizontal"?"left":"bottom"]=t+"%";n(this).stop(1,1)[u?"animate":"css"](o,i.animate);r.options.range===!0&&(r.orientation==="horizontal"?(f===0&&r.range.stop(1,1)[u?"animate":"css"]({left:t+"%"},i.animate),f===1&&r.range[u?"animate":"css"]({width:t-s+"%"},{queue:!1,duration:i.animate})):(f===0&&r.range.stop(1,1)[u?"animate":"css"]({bottom:t+"%"},i.animate),f===1&&r.range[u?"animate":"css"]({height:t-s+"%"},{queue:!1,duration:i.animate})));s=t}):(c=this.value(),f=this._valueMin(),h=this._valueMax(),t=h!==f?(c-f)/(h-f)*100:0,o[this.orientation==="horizontal"?"left":"bottom"]=t+"%",this.handle.stop(1,1)[u?"animate":"css"](o,i.animate),e==="min"&&this.orientation==="horizontal"&&this.range.stop(1,1)[u?"animate":"css"]({width:t+"%"},i.animate),e==="max"&&this.orientation==="horizontal"&&this.range[u?"animate":"css"]({width:100-t+"%"},{queue:!1,duration:i.animate}),e==="min"&&this.orientation==="vertical"&&this.range.stop(1,1)[u?"animate":"css"]({height:t+"%"},i.animate),e==="max"&&this.orientation==="vertical"&&this.range[u?"animate":"css"]({height:100-t+"%"},{queue:!1,duration:i.animate}))},_handleEvents:{keydown:function(i){var o,u,r,f,e=n(i.target).data("ui-slider-handle-index");switch(i.keyCode){case n.ui.keyCode.HOME:case n.ui.keyCode.END:case n.ui.keyCode.PAGE_UP:case n.ui.keyCode.PAGE_DOWN:case n.ui.keyCode.UP:case n.ui.keyCode.RIGHT:case n.ui.keyCode.DOWN:case n.ui.keyCode.LEFT:if(i.preventDefault(),!this._keySliding&&(this._keySliding=!0,n(i.target).addClass("ui-state-active"),o=this._start(i,e),o===!1))return}f=this.options.step;u=this.options.values&&this.options.values.length?r=this.values(e):r=this.value();switch(i.keyCode){case n.ui.keyCode.HOME:r=this._valueMin();break;case n.ui.keyCode.END:r=this._valueMax();break;case n.ui.keyCode.PAGE_UP:r=this._trimAlignValue(u+(this._valueMax()-this._valueMin())/t);break;case n.ui.keyCode.PAGE_DOWN:r=this._trimAlignValue(u-(this._valueMax()-this._valueMin())/t);break;case n.ui.keyCode.UP:case n.ui.keyCode.RIGHT:if(u===this._valueMax())return;r=this._trimAlignValue(u+f);break;case n.ui.keyCode.DOWN:case n.ui.keyCode.LEFT:if(u===this._valueMin())return;r=this._trimAlignValue(u-f)}this._slide(i,e,r)},click:function(n){n.preventDefault()},keyup:function(t){var i=n(t.target).data("ui-slider-handle-index");this._keySliding&&(this._keySliding=!1,this._stop(t,i),this._change(t,i),n(t.target).removeClass("ui-state-active"))}}})}(jQuery),function(n){function t(n){return function(){var t=this.element.val();n.apply(this,arguments);this._refresh();t!==this.element.val()&&this._trigger("change")}}n.widget("ui.spinner",{version:"1.10.2",defaultElement:"<input>",widgetEventPrefix:"spin",options:{culture:null,icons:{down:"ui-icon-triangle-1-s",up:"ui-icon-triangle-1-n"},incremental:!0,max:null,min:null,numberFormat:null,page:10,step:1,change:null,spin:null,start:null,stop:null},_create:function(){this._setOption("max",this.options.max);this._setOption("min",this.options.min);this._setOption("step",this.options.step);this._value(this.element.val(),!0);this._draw();this._on(this._events);this._refresh();this._on(this.window,{beforeunload:function(){this.element.removeAttr("autocomplete")}})},_getCreateOptions:function(){var t={},i=this.element;return n.each(["min","max","step"],function(n,r){var u=i.attr(r);u!==undefined&&u.length&&(t[r]=u)}),t},_events:{keydown:function(n){this._start(n)&&this._keydown(n)&&n.preventDefault()},keyup:"_stop",focus:function(){this.previous=this.element.val()},blur:function(n){if(this.cancelBlur){delete this.cancelBlur;return}this._stop();this._refresh();this.previous!==this.element.val()&&this._trigger("change",n)},mousewheel:function(n,t){if(t){if(!this.spinning&&!this._start(n))return!1;this._spin((t>0?1:-1)*this.options.step,n);clearTimeout(this.mousewheelTimer);this.mousewheelTimer=this._delay(function(){this.spinning&&this._stop(n)},100);n.preventDefault()}},"mousedown .ui-spinner-button":function(t){function r(){var n=this.element[0]===this.document[0].activeElement;n||(this.element.focus(),this.previous=i,this._delay(function(){this.previous=i}))}var i;(i=this.element[0]===this.document[0].activeElement?this.previous:this.element.val(),t.preventDefault(),r.call(this),this.cancelBlur=!0,this._delay(function(){delete this.cancelBlur;r.call(this)}),this._start(t)!==!1)&&this._repeat(null,n(t.currentTarget).hasClass("ui-spinner-up")?1:-1,t)},"mouseup .ui-spinner-button":"_stop","mouseenter .ui-spinner-button":function(t){if(n(t.currentTarget).hasClass("ui-state-active")){if(this._start(t)===!1)return!1;this._repeat(null,n(t.currentTarget).hasClass("ui-spinner-up")?1:-1,t)}},"mouseleave .ui-spinner-button":"_stop"},_draw:function(){var n=this.uiSpinner=this.element.addClass("ui-spinner-input").attr("autocomplete","off").wrap(this._uiSpinnerHtml()).parent().append(this._buttonHtml());this.element.attr("role","spinbutton");this.buttons=n.find(".ui-spinner-button").attr("tabIndex",-1).button().removeClass("ui-corner-all");this.buttons.height()>Math.ceil(n.height()*.5)&&n.height()>0&&n.height(n.height());this.options.disabled&&this.disable()},_keydown:function(t){var r=this.options,i=n.ui.keyCode;switch(t.keyCode){case i.UP:return this._repeat(null,1,t),!0;case i.DOWN:return this._repeat(null,-1,t),!0;case i.PAGE_UP:return this._repeat(null,r.page,t),!0;case i.PAGE_DOWN:return this._repeat(null,-r.page,t),!0}return!1},_uiSpinnerHtml:function(){return"<span class='ui-spinner ui-widget ui-widget-content ui-corner-all'><\/span>"},_buttonHtml:function(){return"<a class='ui-spinner-button ui-spinner-up ui-corner-tr'><span class='ui-icon "+this.options.icons.up+"'>&#9650;<\/span><\/a><a class='ui-spinner-button ui-spinner-down ui-corner-br'><span class='ui-icon "+this.options.icons.down+"'>&#9660;<\/span><\/a>"},_start:function(n){return!this.spinning&&this._trigger("start",n)===!1?!1:(this.counter||(this.counter=1),this.spinning=!0,!0)},_repeat:function(n,t,i){n=n||500;clearTimeout(this.timer);this.timer=this._delay(function(){this._repeat(40,t,i)},n);this._spin(t*this.options.step,i)},_spin:function(n,t){var i=this.value()||0;this.counter||(this.counter=1);i=this._adjustValue(i+n*this._increment(this.counter));this.spinning&&this._trigger("spin",t,{value:i})===!1||(this._value(i),this.counter++)},_increment:function(t){var i=this.options.incremental;return i?n.isFunction(i)?i(t):Math.floor(t*t*t/5e4-t*t/500+17*t/200+1):1},_precision:function(){var n=this._precisionOf(this.options.step);return this.options.min!==null&&(n=Math.max(n,this._precisionOf(this.options.min))),n},_precisionOf:function(n){var t=n.toString(),i=t.indexOf(".");return i===-1?0:t.length-i-1},_adjustValue:function(n){var r,i,t=this.options;return(r=t.min!==null?t.min:0,i=n-r,i=Math.round(i/t.step)*t.step,n=r+i,n=parseFloat(n.toFixed(this._precision())),t.max!==null&&n>t.max)?t.max:t.min!==null&&n<t.min?t.min:n},_stop:function(n){this.spinning&&(clearTimeout(this.timer),clearTimeout(this.mousewheelTimer),this.counter=0,this.spinning=!1,this._trigger("stop",n))},_setOption:function(n,t){if(n==="culture"||n==="numberFormat"){var i=this._parse(this.element.val());this.options[n]=t;this.element.val(this._format(i));return}(n==="max"||n==="min"||n==="step")&&typeof t=="string"&&(t=this._parse(t));n==="icons"&&(this.buttons.first().find(".ui-icon").removeClass(this.options.icons.up).addClass(t.up),this.buttons.last().find(".ui-icon").removeClass(this.options.icons.down).addClass(t.down));this._super(n,t);n==="disabled"&&(t?(this.element.prop("disabled",!0),this.buttons.button("disable")):(this.element.prop("disabled",!1),this.buttons.button("enable")))},_setOptions:t(function(n){this._super(n);this._value(this.element.val())}),_parse:function(n){return typeof n=="string"&&n!==""&&(n=window.Globalize&&this.options.numberFormat?Globalize.parseFloat(n,10,this.options.culture):+n),n===""||isNaN(n)?null:n},_format:function(n){return n===""?"":window.Globalize&&this.options.numberFormat?Globalize.format(n,this.options.numberFormat,this.options.culture):n},_refresh:function(){this.element.attr({"aria-valuemin":this.options.min,"aria-valuemax":this.options.max,"aria-valuenow":this._parse(this.element.val())})},_value:function(n,t){var i;n!==""&&(i=this._parse(n),i!==null&&(t||(i=this._adjustValue(i)),n=this._format(i)));this.element.val(n);this._refresh()},_destroy:function(){this.element.removeClass("ui-spinner-input").prop("disabled",!1).removeAttr("autocomplete").removeAttr("role").removeAttr("aria-valuemin").removeAttr("aria-valuemax").removeAttr("aria-valuenow");this.uiSpinner.replaceWith(this.element)},stepUp:t(function(n){this._stepUp(n)}),_stepUp:function(n){this._start()&&(this._spin((n||1)*this.options.step),this._stop())},stepDown:t(function(n){this._stepDown(n)}),_stepDown:function(n){this._start()&&(this._spin((n||1)*-this.options.step),this._stop())},pageUp:t(function(n){this._stepUp((n||1)*this.options.page)}),pageDown:t(function(n){this._stepDown((n||1)*this.options.page)}),value:function(n){if(!arguments.length)return this._parse(this.element.val());t(this._value).call(this,n)},widget:function(){return this.uiSpinner}})}(jQuery),function(n,t){function f(){return++u}function r(n){return n.hash.length>1&&decodeURIComponent(n.href.replace(i,""))===decodeURIComponent(location.href.replace(i,""))}var u=0,i=/#.*$/;n.widget("ui.tabs",{version:"1.10.2",delay:300,options:{active:null,collapsible:!1,event:"click",heightStyle:"content",hide:null,show:null,activate:null,beforeActivate:null,beforeLoad:null,load:null},_create:function(){var i=this,t=this.options;this.running=!1;this.element.addClass("ui-tabs ui-widget ui-widget-content ui-corner-all").toggleClass("ui-tabs-collapsible",t.collapsible).delegate(".ui-tabs-nav > li","mousedown"+this.eventNamespace,function(t){n(this).is(".ui-state-disabled")&&t.preventDefault()}).delegate(".ui-tabs-anchor","focus"+this.eventNamespace,function(){n(this).closest("li").is(".ui-state-disabled")&&this.blur()});this._processTabs();t.active=this._initialActive();n.isArray(t.disabled)&&(t.disabled=n.unique(t.disabled.concat(n.map(this.tabs.filter(".ui-state-disabled"),function(n){return i.tabs.index(n)}))).sort());this.active=this.options.active!==!1&&this.anchors.length?this._findActive(t.active):n();this._refresh();this.active.length&&this.load(t.active)},_initialActive:function(){var t=this.options.active,i=this.options.collapsible,r=location.hash.substring(1);return t===null&&(r&&this.tabs.each(function(i,u){if(n(u).attr("aria-controls")===r)return t=i,!1}),t===null&&(t=this.tabs.index(this.tabs.filter(".ui-tabs-active"))),(t===null||t===-1)&&(t=this.tabs.length?0:!1)),t!==!1&&(t=this.tabs.index(this.tabs.eq(t)),t===-1&&(t=i?!1:0)),!i&&t===!1&&this.anchors.length&&(t=0),t},_getCreateEventData:function(){return{tab:this.active,panel:this.active.length?this._getPanelForTab(this.active):n()}},_tabKeydown:function(t){var r=n(this.document[0].activeElement).closest("li"),i=this.tabs.index(r),u=!0;if(!this._handlePageNav(t)){switch(t.keyCode){case n.ui.keyCode.RIGHT:case n.ui.keyCode.DOWN:i++;break;case n.ui.keyCode.UP:case n.ui.keyCode.LEFT:u=!1;i--;break;case n.ui.keyCode.END:i=this.anchors.length-1;break;case n.ui.keyCode.HOME:i=0;break;case n.ui.keyCode.SPACE:t.preventDefault();clearTimeout(this.activating);this._activate(i);return;case n.ui.keyCode.ENTER:t.preventDefault();clearTimeout(this.activating);this._activate(i===this.options.active?!1:i);return;default:return}t.preventDefault();clearTimeout(this.activating);i=this._focusNextTab(i,u);t.ctrlKey||(r.attr("aria-selected","false"),this.tabs.eq(i).attr("aria-selected","true"),this.activating=this._delay(function(){this.option("active",i)},this.delay))}},_panelKeydown:function(t){this._handlePageNav(t)||t.ctrlKey&&t.keyCode===n.ui.keyCode.UP&&(t.preventDefault(),this.active.focus())},_handlePageNav:function(t){return t.altKey&&t.keyCode===n.ui.keyCode.PAGE_UP?(this._activate(this._focusNextTab(this.options.active-1,!1)),!0):t.altKey&&t.keyCode===n.ui.keyCode.PAGE_DOWN?(this._activate(this._focusNextTab(this.options.active+1,!0)),!0):void 0},_findNextTab:function(t,i){function u(){return t>r&&(t=0),t<0&&(t=r),t}for(var r=this.tabs.length-1;n.inArray(u(),this.options.disabled)!==-1;)t=i?t+1:t-1;return t},_focusNextTab:function(n,t){return n=this._findNextTab(n,t),this.tabs.eq(n).focus(),n},_setOption:function(n,t){if(n==="active"){this._activate(t);return}if(n==="disabled"){this._setupDisabled(t);return}this._super(n,t);n==="collapsible"&&(this.element.toggleClass("ui-tabs-collapsible",t),t||this.options.active!==!1||this._activate(0));n==="event"&&this._setupEvents(t);n==="heightStyle"&&this._setupHeightStyle(t)},_tabId:function(n){return n.attr("aria-controls")||"ui-tabs-"+f()},_sanitizeSelector:function(n){return n?n.replace(/[!"$%&'()*+,.\/:;<=>?@\[\]\^`{|}~]/g,"\\$&"):""},refresh:function(){var t=this.options,i=this.tablist.children(":has(a[href])");t.disabled=n.map(i.filter(".ui-state-disabled"),function(n){return i.index(n)});this._processTabs();t.active!==!1&&this.anchors.length?this.active.length&&!n.contains(this.tablist[0],this.active[0])?this.tabs.length===t.disabled.length?(t.active=!1,this.active=n()):this._activate(this._findNextTab(Math.max(0,t.active-1),!1)):t.active=this.tabs.index(this.active):(t.active=!1,this.active=n());this._refresh()},_refresh:function(){this._setupDisabled(this.options.disabled);this._setupEvents(this.options.event);this._setupHeightStyle(this.options.heightStyle);this.tabs.not(this.active).attr({"aria-selected":"false",tabIndex:-1});this.panels.not(this._getPanelForTab(this.active)).hide().attr({"aria-expanded":"false","aria-hidden":"true"});this.active.length?(this.active.addClass("ui-tabs-active ui-state-active").attr({"aria-selected":"true",tabIndex:0}),this._getPanelForTab(this.active).show().attr({"aria-expanded":"true","aria-hidden":"false"})):this.tabs.eq(0).attr("tabIndex",0)},_processTabs:function(){var t=this;this.tablist=this._getList().addClass("ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all").attr("role","tablist");this.tabs=this.tablist.find("> li:has(a[href])").addClass("ui-state-default ui-corner-top").attr({role:"tab",tabIndex:-1});this.anchors=this.tabs.map(function(){return n("a",this)[0]}).addClass("ui-tabs-anchor").attr({role:"presentation",tabIndex:-1});this.panels=n();this.anchors.each(function(i,u){var e,f,s,h=n(u).uniqueId().attr("id"),o=n(u).closest("li"),c=o.attr("aria-controls");r(u)?(e=u.hash,f=t.element.find(t._sanitizeSelector(e))):(s=t._tabId(o),e="#"+s,f=t.element.find(e),f.length||(f=t._createPanel(s),f.insertAfter(t.panels[i-1]||t.tablist)),f.attr("aria-live","polite"));f.length&&(t.panels=t.panels.add(f));c&&o.data("ui-tabs-aria-controls",c);o.attr({"aria-controls":e.substring(1),"aria-labelledby":h});f.attr("aria-labelledby",h)});this.panels.addClass("ui-tabs-panel ui-widget-content ui-corner-bottom").attr("role","tabpanel")},_getList:function(){return this.element.find("ol,ul").eq(0)},_createPanel:function(t){return n("<div>").attr("id",t).addClass("ui-tabs-panel ui-widget-content ui-corner-bottom").data("ui-tabs-destroy",!0)},_setupDisabled:function(t){n.isArray(t)&&(t.length?t.length===this.anchors.length&&(t=!0):t=!1);for(var i=0,r;r=this.tabs[i];i++)t===!0||n.inArray(i,t)!==-1?n(r).addClass("ui-state-disabled").attr("aria-disabled","true"):n(r).removeClass("ui-state-disabled").removeAttr("aria-disabled");this.options.disabled=t},_setupEvents:function(t){var i={click:function(n){n.preventDefault()}};t&&n.each(t.split(" "),function(n,t){i[t]="_eventHandler"});this._off(this.anchors.add(this.tabs).add(this.panels));this._on(this.anchors,i);this._on(this.tabs,{keydown:"_tabKeydown"});this._on(this.panels,{keydown:"_panelKeydown"});this._focusable(this.tabs);this._hoverable(this.tabs)},_setupHeightStyle:function(t){var i,r=this.element.parent();t==="fill"?(i=r.height(),i-=this.element.outerHeight()-this.element.height(),this.element.siblings(":visible").each(function(){var t=n(this),r=t.css("position");r!=="absolute"&&r!=="fixed"&&(i-=t.outerHeight(!0))}),this.element.children().not(this.panels).each(function(){i-=n(this).outerHeight(!0)}),this.panels.each(function(){n(this).height(Math.max(0,i-n(this).innerHeight()+n(this).height()))}).css("overflow","auto")):t==="auto"&&(i=0,this.panels.each(function(){i=Math.max(i,n(this).height("").height())}).height(i))},_eventHandler:function(t){var u=this.options,r=this.active,c=n(t.currentTarget),i=c.closest("li"),f=i[0]===r[0],e=f&&u.collapsible,o=e?n():this._getPanelForTab(i),s=r.length?this._getPanelForTab(r):n(),h={oldTab:r,oldPanel:s,newTab:e?n():i,newPanel:o};(t.preventDefault(),i.hasClass("ui-state-disabled")||i.hasClass("ui-tabs-loading")||this.running||f&&!u.collapsible||this._trigger("beforeActivate",t,h)===!1)||(u.active=e?!1:this.tabs.index(i),this.active=f?n():i,this.xhr&&this.xhr.abort(),s.length||o.length||n.error("jQuery UI Tabs: Mismatching fragment identifier."),o.length&&this.load(this.tabs.index(i),t),this._toggle(t,h))},_toggle:function(t,i){function e(){u.running=!1;u._trigger("activate",t,i)}function o(){i.newTab.closest("li").addClass("ui-tabs-active ui-state-active");r.length&&u.options.show?u._show(r,u.options.show,e):(r.show(),e())}var u=this,r=i.newPanel,f=i.oldPanel;this.running=!0;f.length&&this.options.hide?this._hide(f,this.options.hide,function(){i.oldTab.closest("li").removeClass("ui-tabs-active ui-state-active");o()}):(i.oldTab.closest("li").removeClass("ui-tabs-active ui-state-active"),f.hide(),o());f.attr({"aria-expanded":"false","aria-hidden":"true"});i.oldTab.attr("aria-selected","false");r.length&&f.length?i.oldTab.attr("tabIndex",-1):r.length&&this.tabs.filter(function(){return n(this).attr("tabIndex")===0}).attr("tabIndex",-1);r.attr({"aria-expanded":"true","aria-hidden":"false"});i.newTab.attr({"aria-selected":"true",tabIndex:0})},_activate:function(t){var r,i=this._findActive(t);i[0]!==this.active[0]&&(i.length||(i=this.active),r=i.find(".ui-tabs-anchor")[0],this._eventHandler({target:r,currentTarget:r,preventDefault:n.noop}))},_findActive:function(t){return t===!1?n():this.tabs.eq(t)},_getIndex:function(n){return typeof n=="string"&&(n=this.anchors.index(this.anchors.filter("[href$='"+n+"']"))),n},_destroy:function(){this.xhr&&this.xhr.abort();this.element.removeClass("ui-tabs ui-widget ui-widget-content ui-corner-all ui-tabs-collapsible");this.tablist.removeClass("ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all").removeAttr("role");this.anchors.removeClass("ui-tabs-anchor").removeAttr("role").removeAttr("tabIndex").removeUniqueId();this.tabs.add(this.panels).each(function(){n.data(this,"ui-tabs-destroy")?n(this).remove():n(this).removeClass("ui-state-default ui-state-active ui-state-disabled ui-corner-top ui-corner-bottom ui-widget-content ui-tabs-active ui-tabs-panel").removeAttr("tabIndex").removeAttr("aria-live").removeAttr("aria-busy").removeAttr("aria-selected").removeAttr("aria-labelledby").removeAttr("aria-hidden").removeAttr("aria-expanded").removeAttr("role")});this.tabs.each(function(){var t=n(this),i=t.data("ui-tabs-aria-controls");i?t.attr("aria-controls",i).removeData("ui-tabs-aria-controls"):t.removeAttr("aria-controls")});this.panels.show();this.options.heightStyle!=="content"&&this.panels.css("height","")},enable:function(i){var r=this.options.disabled;r!==!1&&(i===t?r=!1:(i=this._getIndex(i),r=n.isArray(r)?n.map(r,function(n){return n!==i?n:null}):n.map(this.tabs,function(n,t){return t!==i?t:null})),this._setupDisabled(r))},disable:function(i){var r=this.options.disabled;if(r!==!0){if(i===t)r=!0;else{if(i=this._getIndex(i),n.inArray(i,r)!==-1)return;r=n.isArray(r)?n.merge([i],r).sort():[i]}this._setupDisabled(r)}},load:function(t,i){t=this._getIndex(t);var f=this,u=this.tabs.eq(t),o=u.find(".ui-tabs-anchor"),e=this._getPanelForTab(u),s={tab:u,panel:e};r(o[0])||(this.xhr=n.ajax(this._ajaxSettings(o,i,s)),this.xhr&&this.xhr.statusText!=="canceled"&&(u.addClass("ui-tabs-loading"),e.attr("aria-busy","true"),this.xhr.success(function(n){setTimeout(function(){e.html(n);f._trigger("load",i,s)},1)}).complete(function(n,t){setTimeout(function(){t==="abort"&&f.panels.stop(!1,!0);u.removeClass("ui-tabs-loading");e.removeAttr("aria-busy");n===f.xhr&&delete f.xhr},1)})))},_ajaxSettings:function(t,i,r){var u=this;return{url:t.attr("href"),beforeSend:function(t,f){return u._trigger("beforeLoad",i,n.extend({jqXHR:t,ajaxSettings:f},r))}}},_getPanelForTab:function(t){var i=n(t).attr("aria-controls");return this.element.find(this._sanitizeSelector("#"+i))}})}(jQuery),function(n){function i(t,i){var r=(t.attr("aria-describedby")||"").split(/\s+/);r.push(i);t.data("ui-tooltip-id",i).attr("aria-describedby",n.trim(r.join(" ")))}function r(t){var u=t.data("ui-tooltip-id"),i=(t.attr("aria-describedby")||"").split(/\s+/),r=n.inArray(u,i);r!==-1&&i.splice(r,1);t.removeData("ui-tooltip-id");i=n.trim(i.join(" "));i?t.attr("aria-describedby",i):t.removeAttr("aria-describedby")}var t=0;n.widget("ui.tooltip",{version:"1.10.2",options:{content:function(){var t=n(this).attr("title")||"";return n("<a>").text(t).html()},hide:!0,items:"[title]:not([disabled])",position:{my:"left top+15",at:"left bottom",collision:"flipfit flip"},show:!0,tooltipClass:null,track:!1,close:null,open:null},_create:function(){this._on({mouseover:"open",focusin:"open"});this.tooltips={};this.parents={};this.options.disabled&&this._disable()},_setOption:function(t,i){var r=this;if(t==="disabled"){this[i?"_disable":"_enable"]();this.options[t]=i;return}this._super(t,i);t==="content"&&n.each(this.tooltips,function(n,t){r._updateContent(t)})},_disable:function(){var t=this;n.each(this.tooltips,function(i,r){var u=n.Event("blur");u.target=u.currentTarget=r[0];t.close(u,!0)});this.element.find(this.options.items).addBack().each(function(){var t=n(this);t.is("[title]")&&t.data("ui-tooltip-title",t.attr("title")).attr("title","")})},_enable:function(){this.element.find(this.options.items).addBack().each(function(){var t=n(this);t.data("ui-tooltip-title")&&t.attr("title",t.data("ui-tooltip-title"))})},open:function(t){var r=this,i=n(t?t.target:this.element).closest(this.options.items);i.length&&!i.data("ui-tooltip-id")&&(i.attr("title")&&i.data("ui-tooltip-title",i.attr("title")),i.data("ui-tooltip-open",!0),t&&t.type==="mouseover"&&i.parents().each(function(){var t=n(this),i;t.data("ui-tooltip-open")&&(i=n.Event("blur"),i.target=i.currentTarget=this,r.close(i,!0));t.attr("title")&&(t.uniqueId(),r.parents[this.id]={element:this,title:t.attr("title")},t.attr("title",""))}),this._updateContent(i,t))},_updateContent:function(n,t){var i,r=this.options.content,u=this,f=t?t.type:null;if(typeof r=="string")return this._open(t,n,r);i=r.call(n[0],function(i){n.data("ui-tooltip-open")&&u._delay(function(){t&&(t.type=f);this._open(t,n,i)})});i&&this._open(t,n,i)},_open:function(t,r,u){function s(n){(o.of=n,f.is(":hidden"))||f.position(o)}var f,e,h,o=n.extend({},this.options.position);if(u){if(f=this._find(r),f.length){f.find(".ui-tooltip-content").html(u);return}r.is("[title]")&&(t&&t.type==="mouseover"?r.attr("title",""):r.removeAttr("title"));f=this._tooltip(r);i(r,f.attr("id"));f.find(".ui-tooltip-content").html(u);this.options.track&&t&&/^mouse/.test(t.type)?(this._on(this.document,{mousemove:s}),s(t)):f.position(n.extend({of:r},this.options.position));f.hide();this._show(f,this.options.show);this.options.show&&this.options.show.delay&&(h=this.delayedShow=setInterval(function(){f.is(":visible")&&(s(o.of),clearInterval(h))},n.fx.interval));this._trigger("open",t,{tooltip:f});e={keyup:function(t){if(t.keyCode===n.ui.keyCode.ESCAPE){var i=n.Event(t);i.currentTarget=r[0];this.close(i,!0)}},remove:function(){this._removeTooltip(f)}};t&&t.type!=="mouseover"||(e.mouseleave="close");t&&t.type!=="focusin"||(e.focusout="close");this._on(!0,r,e)}},close:function(t){var f=this,i=n(t?t.currentTarget:this.element),u=this._find(i);this.closing||(clearInterval(this.delayedShow),i.data("ui-tooltip-title")&&i.attr("title",i.data("ui-tooltip-title")),r(i),u.stop(!0),this._hide(u,this.options.hide,function(){f._removeTooltip(n(this))}),i.removeData("ui-tooltip-open"),this._off(i,"mouseleave focusout keyup"),i[0]!==this.element[0]&&this._off(i,"remove"),this._off(this.document,"mousemove"),t&&t.type==="mouseleave"&&n.each(this.parents,function(t,i){n(i.element).attr("title",i.title);delete f.parents[t]}),this.closing=!0,this._trigger("close",t,{tooltip:u}),this.closing=!1)},_tooltip:function(i){var u="ui-tooltip-"+t++,r=n("<div>").attr({id:u,role:"tooltip"}).addClass("ui-tooltip ui-widget ui-corner-all ui-widget-content "+(this.options.tooltipClass||""));return n("<div>").addClass("ui-tooltip-content").appendTo(r),r.appendTo(this.document[0].body),this.tooltips[u]=i,r},_find:function(t){var i=t.data("ui-tooltip-id");return i?n("#"+i):n()},_removeTooltip:function(n){n.remove();delete this.tooltips[n.attr("id")]},_destroy:function(){var t=this;n.each(this.tooltips,function(i,r){var u=n.Event("blur");u.target=u.currentTarget=r[0];t.close(u,!0);n("#"+i).remove();r.data("ui-tooltip-title")&&(r.attr("title",r.data("ui-tooltip-title")),r.removeData("ui-tooltip-title"))})}})}(jQuery);
(function(n){n.widget("ui.selectable",n.ui.mouse,{options:{closest:!0,filter:"> *",keyboard:!0,lasso:{cancel:":input,option",delay:0,distance:1,tolerance:"touch",appendTo:"body"}},_init:function(){var t=this;this.items=n(this.options.filter,this.element);this.element.addClass("ui-selectable ui-widget");this.currentFocus=this.items.eq(0).attr("tabindex",0);this.refresh(1);this.element.disableSelection();this.options.lasso&&(this.options.lasso!==!0&&n.extend(this.options,this.options.lasso),this._mouseInit());this.element.bind("mousedown.selectable",function(i){if(!t.options.disabled){var r=t._targetIsItem(i.target);if(r)return t._selection.length>1&&n(r).hasClass("ui-selected")?t._listenForMouseUp=1:t._mouseSelect(i,r)===!0?!0:void 0}}).bind("mouseup.selectable",function(n){if(t._listenForMouseUp){t._listenForMouseUp=0;var i=t._targetIsItem(n.target);if(i&&t._mouseSelect(n,i)===!0)return!0}}).bind("focus.selectable",function(){t.options.disabled||t.currentFocus.addClass("ui-state-focus")}).bind("blur.selectable",function(){t.options.disabled||t.currentFocus.removeClass("ui-state-focus")}).bind("keydown.selectable",function(i){if(!t.options.keyboard||t.options.disabled||t._trigger("beforeselect",i)===!1)return!0;i.keyCode==n.ui.keyCode.DOWN&&(t.options.closest?t.selectClosest("down",i):t.next(i),i.preventDefault());i.keyCode==n.ui.keyCode.RIGHT&&(t.options.closest?t.selectClosest("right",i):t.next(i),i.preventDefault());i.keyCode==n.ui.keyCode.UP&&(t.options.closest?t.selectClosest("up",i):t.previous(i),i.preventDefault());i.keyCode==n.ui.keyCode.LEFT&&(t.options.closest?t.selectClosest("left",i):t.previous(i),i.preventDefault());(i.ctrlKey||i.metaKey)&&(i.keyCode==n.ui.keyCode.SPACE&&(t._toggleSelection(t.currentFocus,i),i.preventDefault()),i.keyCode==65&&(t.select("*"),i.preventDefault()))});this.helper=n(document.createElement("div")).addClass("ui-selectable-lasso")},selectClosest:function(t,i){var r=[/(down|right)/.test(t)?1e4:-1e4,null],u=1e4,f=this.currentFocus.data("selectable-item"),e,o;return(this.items.not(this.currentFocus).filter(":visible").each(function(){var o=n(this),i=o.data("selectable-item"),e={x:Math.abs(f.left-i.left)+Math.abs(i.left+this.offsetWidth-(f.left+this.offsetWidth)),y:Math.abs(f.top-i.top)+Math.abs(i.top+this.offsetHeight-(f.top+this.offsetHeight))};switch(t){case"up":f.top>i.top&&i.top>=r[0]&&(i.top!=r[0]||e.x<u)&&(r=[i.top,o],u=e.x);break;case"down":f.top<i.top&&i.top<=r[0]&&(i.top!=r[0]||e.x<u)&&(r=[i.top,o],u=e.x);break;case"left":f.left>i.left&&i.left>=r[0]&&(i.left!=r[0]||e.y<u)&&(r=[i.left,o],u=e.y);break;case"right":f.left<i.left&&i.left<=r[0]&&(i.left!=r[0]||e.y<u)&&(r=[i.left,o],u=e.y)}}),!r[1])?!1:(e=this.items.index(this.currentFocus[0]),o=this.items.index(r[1]),this._selectAdjacent(i,o-e))},destroy:function(){this.items.removeClass("ui-selectable-item ui-selected ui-state-active");this.element.removeClass("ui-selectable ui-selectable-disabled ui-widget").removeData("selectable").unbind(".selectable");this._mouseDestroy();this._selection=[];this._previousSelection=[]},_mouseCapture:function(n){return this.clickedOnItem=this._targetIsItem(n.target),!0},_mouseStart:function(t){var r=this,u=this.options,i;if(this.opos=[t.pageX,t.pageY],!u.disabled)for(this.refresh(1),this._trigger("start",t,this._uiHash()),this._previousSelection=this._selection.slice(),this.helper.appendTo("body").css({zIndex:100,position:"absolute",left:t.clientX,top:t.clientY,width:0,height:0}),i=this._selection.length-1;i>=0;i--)t.metaKey||t.ctrlKey?this!=r.clickedOnItem&&(n(this._selection[i]).data("selectable-item").startSelected=!0):r._removeFromSelection(n(this._selection[i]),t)},_mouseDrag:function(t){var e=this,o=this.options,s;if(!o.disabled){var i=this.opos[0],r=this.opos[1],u=t.pageX,f=t.pageY;return i>u&&(s=u,u=i,i=s),r>f&&(s=f,f=r,r=s),this.helper.css({left:i,top:r,width:u-i,height:f-r}),this.items.each(function(){var s=n.data(this,"selectable-item"),h;s&&s.element!=e.element[0]&&(h=!1,o.lasso&&o.lasso.tolerance=="touch"?h=!(s.left>u||s.right<i||s.top>f||s.bottom<r):o.lasso&&o.lasso.tolerance=="fit"&&(h=s.left>i&&s.right<u&&s.top>r&&s.bottom<f),h?s.startSelected?e._removeFromSelection(n(this),t):e._addToSelection(n(this),t):s.startSelected?e._addToSelection(n(this),t):e._removeFromSelection(n(this),t))}),!1}},_mouseStop:function(t){for(var e,f,o,r=[],u=[],i=0;i<this._selection.length;i++){for(e=!1,f=0;f<this._previousSelection.length;f++)this._selection[i][0]==this._previousSelection[f][0]&&(e=!0);e||r.push(this._selection[i])}for(i=this._previousSelection.length-1;i>=0;i--)this._previousSelection[i].data("selectable-item").selected||u.push(this._previousSelection[i]);return r=n(n.map(r,function(n){return n[0]})),u=n(n.map(u,function(n){return n[0]})),o=n.extend(this._uiHash(),{added:r||[],removed:u||[]}),this._trigger("stop",t,o),(r&&r.length||u&&u.length)&&this._trigger("change",t,o),this.helper.remove(),!1},_mouseSelect:function(n,t){if(this._trigger("beforeselect",n)===!1)return!0;this._select(n,t);this.element[0].focus();n.preventDefault()},_targetIsItem:function(t){var i=n(t).parents().addBack().filter(":data(selectable-item)");return i.length&&i},_selection:[],_endSelection:function(t,i){var r=this._triggerDeselection(t),u;i&&i.length&&this._trigger("select",t,this._uiHash(i,"added"));(i&&i.length||r&&r.length)&&(u=n.extend(this._uiHash(),{added:i||[],removed:r||[]}),this._trigger("change",t,u))},_triggerDeselection:function(t){for(var u,i=[],r=this._previousSelection.length-1;r>=0;r--)u=this._previousSelection[r].data("selectable-item"),u&&u.selected||i.push(this._previousSelection[r]);return this._previousSelection=[],i=n(n.map(i,function(n){return n[0]})),i.length&&this._trigger("deselect",t,this._uiHash(i,"removed")),i},_clearSelection:function(t){for(var r=[],i=this._selection.length-1;i>=0;i--)t&&this._selection[i].data("selectable-item").selected&&r.push(this._selection[i]),this._selection[i].removeClass("ui-selected ui-state-active"),this._selection[i].data("selectable-item").selected=!1;this._previousSelection=this._selection.slice();this._selection=[];t&&r.length&&this._trigger("deselect",t,this._uiHash(n(n.map(r,function(n){return n[0]})),"removed"))},_toggleSelection:function(n,t){var i=n.data("selectable-item").selected;return i?this._removeFromSelection(n,t):this._addToSelection(n),!i},_addToSelection:function(t,i){return!t.data("selectable-item")||t.data("selectable-item").selected?null:(this._selection.push(t),this.latestSelection=t,t.addClass("ui-selected ui-state-active"),t.data("selectable-item").selected=!0,i&&this._trigger("select",i,n.extend({lasso:!0},this._uiHash(t))),t)},_removeFromSelection:function(t,i){for(var r=0;r<this._selection.length;r++)if(this._selection[r][0]==t[0]){this._selection[r].removeClass("ui-selected ui-state-active");this._selection[r].data("selectable-item").selected=!1;this._selection.splice(r,1);i&&this._trigger("deselect",i,this._uiHash(n(t),"removed"));break}},_updateSelectionMouse:function(t){var r=[],u,i,f;if(t&&t.shiftKey){for(this._clearSelection(),u=this.items.index(this.latestWithoutModifier[0])>this.items.index(this.currentFocus[0])?-1:1,i=this.latestWithoutModifier.data("selectable-item").selected?this.items.eq(this.items.index(this.latestWithoutModifier[0])+u):this.latestWithoutModifier;i.length&&i[0]!=this.currentFocus[0];)i[0]==this.previousFocus[0]?this._addToSelection(i):r.push(this._addToSelection(i)),i=this.items.eq(this.items.index(i[0])+u);r.push(this._addToSelection(this.currentFocus))}else t&&(t.metaKey||t.ctrlKey)?(f=this._toggleSelection(this.currentFocus,t),f&&r.push(this.currentFocus)):(this._clearSelection(),r.push(this._addToSelection(this.currentFocus)),this.latestWithoutModifier=this.currentFocus);return n(n.map(r,function(n){return n[0]}))},_updateSelection:function(t,i){var u=[],f,r;if(t&&t.shiftKey)if(this.currentFocus.data("selectable-item").selected)this._removeFromSelection(this.previousFocus,t);else{if(f=this.items.index(this.latestSelection[0])>this.items.index(this.currentFocus[0])?1:-1,!this.previousFocus.data("selectable-item").selected)for(r=i==f?this.items.eq(this.items.index(this.previousFocus[0])+f):this.previousFocus;r.length&&!r.data("selectable-item").selected;)u.push(this._addToSelection(r)),r=this.items.eq(this.items.index(r[0])+f);u.push(this._addToSelection(this.currentFocus))}else{if(t&&(t.metaKey||t.ctrlKey))return;this._clearSelection(t);u.push(this._addToSelection(this.currentFocus));this.latestWithoutModifier=this.currentFocus}return n(n.map(u,function(n){if(n)return n[0]}))},_select:function(t,i){this.previousFocus=this.currentFocus.attr("tabindex",-1);this.currentFocus=n(i).attr("tabindex",0);this.previousFocus.removeClass("ui-state-focus");this.currentFocus.addClass("ui-state-focus");var r=this._updateSelectionMouse(t);this._endSelection(t,r)},_selectAdjacent:function(n,t){var i=this.items.eq(this.items.index(this.currentFocus[0])+t),r;i.length&&(this.previousFocus=this.currentFocus.attr("tabindex",-1),this.currentFocus=i.attr("tabindex",0),this.previousFocus.removeClass("ui-state-focus"),this.currentFocus.addClass("ui-state-focus"),this._previousSelection=this._selection.slice(),r=this._updateSelection(n,t),this._endSelection(n,r))},previous:function(n){this._selectAdjacent(n,-1)},next:function(n){this._selectAdjacent(n,1)},refresh:function(t){var u=this.options,r=this,i;if(this.items=n(u.filter,this.element),this.items.addClass("ui-selectable-item"),this.items.each(function(){var t=n(this),i=t.offset();r.currentFocus&&r.currentFocus[0]!=this&&t.attr("tabindex",-1);n.data(this,"selectable-item",{left:i.left,top:i.top,right:i.left+t.width(),bottom:i.top+t.height(),startSelected:!1,selected:t.hasClass("ui-selected")})}),!t){for(this._previousSelection=this._selection.slice(),this._selection=[],i=0;i<this._previousSelection.length;i++)this._previousSelection[i][0].parentNode&&this._selection.push(this._previousSelection[i]);this._endSelection()}},select:function(t){if(t=isNaN(parseInt(t))?n(t,this.element):this.items.eq(t),t.length){this._clearSelection();var r=[],i=this;t.each(function(t){t==0&&(i.previousFocus=i.currentFocus.attr("tabindex",-1),i.currentFocus=n(this).attr("tabindex",0),i.previousFocus.removeClass("ui-state-focus"),i.currentFocus.addClass("ui-state-focus"));r.push(i._addToSelection(n(this)))});this._endSelection(window.event,n(n.map(r,function(n){return n?n[0]:!1})))}},deselect:function(t){if(t||this._clearSelection(!0),t=isNaN(parseInt(t))?n(t,this.element):this.items.eq(t),t.length){this._previousSelection=this._selection.slice();var i=this;t.each(function(){i._removeFromSelection(n(this))});this._endSelection(event)}},_uiHash:function(t,i){var r={previousFocus:this.previousFocus,currentFocus:this.currentFocus,selection:n(n.map(this._selection,function(n){return n[0]}))};return i&&(r[i]=t),r}})})(jQuery);
String.prototype.replaceMultiple=function(n){var t=this,n=n||{};return $.each(n,function(i){t=t.replace(new RegExp("\\{"+i+"\\}","gm"),n[i])}),t};Math.guid=function(){var n=(new Date).getTime();return window.performance&&typeof window.performance.now=="function"&&(n+=performance.now()),"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(t){var i=(n+Math.random()*16)%16|0;return n=Math.floor(n/16),(t=="x"?i:i&3|8).toString(16)})};var batchRequest=function(n){var t=this;return t.intervalLap=400,t.queueOfRequest=[],t.queueToDistpatch=[],t.options={boundary:"batch_"+Math.guid(),newLine:"\r\n",endPoint:"/"},t.options=$.extend(t.options,n),t.addBatchRequest=function(n,i,r,u){var f=Math.guid();i.fromRestLib&&(i=i.data);t.queueOfRequest.push({guid:f,options:n,originalOptions:i,deferred:r,jqXHR:u})},t.getHeadersToString=function(n){n=n||{};var i="";return $.each(n,function(n,r){i+=n+": "+r+t.options.newLine}),i},t.parseUrl=function(n){n=n||"";n=n.replace("./","/");var t=location.pathname.split("/").reduce(function(n,t,i,r){return i+1<r.length&&n.push(t),n},[]).join("/");return n=t+n,n.replace("//","/")},t.tryParseURL=function(n,t){try{return t.url=new URL(n),!0}catch(i){return!1}},t.getRequestHeaders=function(n){var i="",r={url:undefined},u,f,e;return t.tryParseURL(n.originalOptions.url,r)&&(n.originalOptions.url=n.originalOptions.url.replace(r.url.origin,"")),u=JSON.stringify(n.originalOptions),u=='""'&&(u=""),f=Array("*","/","*").join(""),i+="--{boundary}{newLine}",i+="Content-Type: {contentType}{newLine}{newLine}",i+="{method} {url} {protocol}{newLine}",i+="Host: {host}{newLine}",i+="X-Request-ID: {requestId}{newLine}",i+="{originalHeaders}",i+="content-length: {contentLength}{newLine}",i+="{newLine}{data}{newLine}",e={newLine:t.options.newLine,boundary:t.options.boundary,contentType:"application/http; msgtype=request",method:n.options.type,url:r.url?n.options.url.replace(r.url.origin,""):t.parseUrl(n.options.url),protocol:"HTTP/1.1",accept:n.options.headers&&n.options.headers.Accept?n.options.headers.Accept:f,requestId:Math.guid(),originalHeaders:t.getHeadersToString(n.options.headers),contentLength:u.length,host:r.url?r.url.host:location.host,data:u},i.replaceMultiple(e)},t.buildBatchRequest=function(){for(var i,n="";i=t.queueOfRequest.shift();)t.queueToDistpatch.push(i),n+=t.getRequestHeaders(i);return n&&(n+="--{boundary}--{newLine}".replaceMultiple({newLine:t.options.newLine,boundary:t.options.boundary})),n},t.parseResponse=function(n){var t=function(n){var t=/(HTTP\/1\.1) (\d{3}) (\w{1,})/g.exec(n);return{code:t[2],codeMessage:t[3]}},i=function(n){for(var r=/([A-Z]{1}[\w|-]{1,}):[ \t]*([^\r\n]*)$/mg,t,i={};t=r.exec(n);)i[t[1].toLowerCase()]=t[2];return i},r=function(n){for(var r={},u=n.split(/^\s*$/gm),f=u.length,t,i=f-1;i>0;i--)try{t=bizagi.util.trim(u[i]);t!=""&&(t.charAt(0)=="["||t.charAt(0)=="{")&&(JSON.parse(t),r=t)}catch(e){}return r};return{status:t(n),headers:i(n),data:r(n)}},t.processResponses=function(n,i){var u,f=[],r=n.split(i);for(r.shift(),r.pop();u=r.shift();)f.push(t.parseResponse(u));return f},t.getBoundary=function(n){var i=n.getResponseHeader("Content-Type"),t=/boundary=(.*)/g.exec(i);return t=t.length>0?t[1]:"",t=t.replace(/\"/g,""),"--"+t},t.execute=function(){var n=t.buildBatchRequest();n&&$.when($.ajax(t.options.endPoint,{method:"POST",contentType:'multipart/mixed; boundary="'+t.options.boundary+'"',data:n})).done(function(n,i,r){for(var f,s=t.getBoundary(r),h=t.processResponses(n,s),u,o,e;f=h.shift();){u=t.queueToDistpatch.shift();try{o=typeof u.options.converters["text "+u.options.dataType]=="function"?u.options.converters["text "+u.options.dataType]:u.options.converters["* text"];e=o(f.data)}catch(c){e=f.data}switch(f.status.code){case"200":case"201":u.jqXHR.getAllResponseHeaders=function(){return t.getHeadersToString(u.options.headers)};u.jqXHR.getResponseHeader=function(n){return u.options.headers[n]};u.deferred.resolve(e,i,u.jqXHR);break;case"400":case"401":case"404":case"500":u.deferred.reject(u.jqXHR,f.status.code,e);break;default:u.deferred.reject("Status code "+f.status.code+" is unrecognized")}}})},t.stop=function(){window.clearInterval(t.interval)},window.setInterval(function(){t.queueOfRequest&&(t.execute(),t.options.boundary="batch_"+Math.guid())},t.intervalLap),{add:t.addBatchRequest,execute:t.execute,getInterval:t.interval,stop:t.stop}};
var jqOAuth=function(n){this.options={};this.data={};this.intercept=!1;this.refreshing=!1;this.buffer=[];this.currentRequests=[];this._resetOptions();this._setupInterceptor();$.extend(this.options,n);this._hasStoredData()?(this._getStoredData(),this.hasAccessToken()&&this.login(this.data.access_token,this.data.refresh_token)):(this._resetData(),this._updateStorage());typeof n.csrfToken!="undefined"&&n.csrfToken!==null&&this._setCsrfHeader()};jqOAuth.prototype.getAccessToken=function(){return this.data.access_token};jqOAuth.prototype.getRefreshToken=function(){return this.data.refresh_token};jqOAuth.prototype.hasAccessToken=function(){return this.data.access_token!==null};jqOAuth.prototype.logout=function(){this._resetData();this._updateStorage();this._deactivateInterceptor();this._removeAjaxHeader("Authorization");this._fireEvent("logout")};jqOAuth.prototype.login=function(n,t){this.setAccessToken(n,t);this._activateInterceptor();this._fireEvent("login")};jqOAuth.prototype.setAccessToken=function(n,t){this.data.access_token=n;this.data.refresh_token=t;this._setAuthorizationHeader();this._updateStorage()};jqOAuth.prototype.setCsrfToken=function(n){this.options.csrfToken=n;this._setCsrfHeader()};jqOAuth.prototype._activateInterceptor=function(){this.intercept=!0};jqOAuth.prototype._addToBuffer=function(n,t){this.buffer.push({deferred:t,settings:n})};jqOAuth.prototype._clearBuffer=function(){this.buffer=[]};jqOAuth.prototype._deactivateInterceptor=function(){this.intercept=!1};jqOAuth.prototype._fireBuffer=function(){for(var t=this,i,r=[],n=0,u=this.buffer.length;n<u;n++)i=this.buffer[n].deferred,this.buffer[n].settings.refreshRetry=!0,this.buffer[n].settings.headers.Authorization=$.ajaxSettings.headers.Authorization,r.push($.ajax(this.buffer[n].settings).then(i.resolve,i.reject));this._clearBuffer();$.when.apply($,r).done(function(){t._setRefreshingFlag(!1)}).fail(function(){t._setRefreshingFlag(!1);t.logout()})};jqOAuth.prototype._fireEvent=function(n){if(this._hasEvent(n))return this.options.events[n]()};jqOAuth.prototype._getStoredData=function(){$.extend(this.data,JSON.parse(localStorage.getItem(this.options.tokenName)))};jqOAuth.prototype._hasEvent=function(n){return this.options.events[n]!==undefined&&typeof this.options.events[n]=="function"};jqOAuth.prototype._hasStoredData=function(){return typeof localStorage.getItem(this.options.tokenName)!="undefined"&&localStorage.getItem(this.options.tokenName)!==null};jqOAuth.prototype._isAjaxHeadersInitialized=function(){return $.ajaxSettings.headers!==undefined};jqOAuth.prototype._removeAjaxHeader=function(n){if(!this._isAjaxHeadersInitialized())return!0;$.ajaxSettings.headers[n]=undefined};jqOAuth.prototype._removeAllAjaxHeaders=function(){this._removeAjaxHeader("Authorization");this._removeAjaxHeader("X-CSRF-Token")};jqOAuth.prototype._resetData=function(){this.data={access_token:null,refresh_token:null}};jqOAuth.prototype._resetOptions=function(){this.options={bufferInterval:25,bufferWaitLimit:500,csrfToken:null,events:{},tokenName:"jquery.oauth"};this._removeAllAjaxHeaders()};jqOAuth.prototype._setAjaxHeader=function(n,t){this._isAjaxHeadersInitialized()||($.ajaxSettings.headers={});$.ajaxSettings.headers[n]=t};jqOAuth.prototype._setAuthorizationHeader=function(){this._setAjaxHeader("Authorization","Bearer "+this.data.access_token)};jqOAuth.prototype._setCsrfHeader=function(){this._setAjaxHeader("X-CSRF-Token",this.options.csrfToken)};jqOAuth.prototype._setRefreshingFlag=function(n){this.refreshing=n};jqOAuth.prototype._setupInterceptor=function(){var n=this;$.ajaxPrefilter(function(t,i,r){if(t.refreshRetry!==!0){var u=$.Deferred();return n.currentRequests.push(t.url),r.always(function(){n.currentRequests.splice($.inArray(t.url,n.currentRequests),1)}),r.done(u.resolve),r.fail(function(){var i=Array.prototype.slice.call(arguments);n.intercept&&r.status===401&&n._hasEvent("tokenExpiration")?(n._addToBuffer(t,u),n.refreshing||(n._setRefreshingFlag(!0),n._fireEvent("tokenExpiration").done(function(){var t=0;n.interval=setInterval(function(){t+=n.options.bufferInterval;(n.currentRequests.length===0||t>=n.options.bufferWaitLimit)&&(clearInterval(n.interval),n._fireBuffer())},n.options.bufferInterval)}).fail(function(){n.logout()}))):u.rejectWith(r,i)}),u.promise(r)}})};jqOAuth.prototype._updateStorage=function(){this.data.access_token!==null&&typeof this.data.access_token!="undefined"?localStorage.setItem(this.options.tokenName,JSON.stringify(this.data)):localStorage.removeItem(this.options.tokenName)};
var bizagiConfig=bizagiConfig||{},Oauth2_Credentials,authorization;bizagi=typeof bizagi!="undefined"?bizagi:{};bizagi.services=typeof bizagi.services!="undefined"?bizagi.services:{};bizagi.services.ajax=typeof bizagi.services.ajax!="undefined"?bizagi.services.ajax:{};bizagi.log=bizagi.log||new Function;bizagi.assert=bizagi.assert||new Function;bizagi.services.ajax.useAbsolutePath=typeof BIZAGI_USE_ABSOLUTE_PATH!="undefined"?BIZAGI_USE_ABSOLUTE_PATH:!1;bizagi.services.ajax.pathToBase=bizagi.services.ajax.useAbsolutePath?bizagi.loader.getLocationPrefix():typeof BIZAGI_PATH_TO_BASE!="undefined"?BIZAGI_PATH_TO_BASE:"";bizagi.services.ajax.loginPage=bizagi.services.ajax.pathToBase||"default.htm";bizagi.services.ajax.errorPage=bizagi.services.ajax.pathToBase+"error.html";bizagi.services.ajax.logEnabled=!0;bizagi.services.ajax.logSuccess=!0;bizagi.services.ajax.logSubmits=!0;bizagi.services.ajax.logFail=!0;bizagi.services.ajax.batch={};bizagi.services.ajax.batchCount=0;bizagi.services.ajax.batchTimer=100;bizagi.services.ajax.batchTimeoutInstance=null;bizagiConfig.proxyPrefix=bizagiConfig.proxyPrefix?bizagiConfig.proxyPrefix:typeof BIZAGI_PROXY_PREFIX!="undefined"?BIZAGI_PROXY_PREFIX:"";bizagi.services.batchRequest=new batchRequest({endPoint:bizagiConfig.proxyPrefix+"Api/Batch"});bizagi.services.redirectToLoginPage=function(){typeof bizagi.services.ajax.loginPage=="string"?(sessionStorage.removeItem("bizagiAuthentication"),localStorage.getItem("clientLog")!="true"&&(window.location=bizagi.services.ajax.loginPage)):bizagi.services.ajax.loginPage()};$.ajaxTransport("json",function(n){if(bizagi.override.enableBatchRequest&&n.batchRequest)return{send:function(t){n.headers=t},abort:function(){}}});$.ajaxTransport("+binary",function(n,t,i){if(window.FormData&&(n.dataType&&n.dataType=="binary"||n.data&&(window.ArrayBuffer&&n.data instanceof ArrayBuffer||window.Blob&&n.data instanceof Blob)))return{send:function(t,i){var r=new XMLHttpRequest,f=n.url,e=n.type,o=n.async||!0,s=n.responseType||"blob",h=n.data||null,c=n.username||null,l=n.password||null,u;r.addEventListener("load",function(){var t={};t[n.dataType]=r.response;i(r.status,r.statusText,t,r.getAllResponseHeaders())});r.open(e,f,o,c,l);for(u in t)r.setRequestHeader(u,t[u]);r.responseType=s;r.send(h)},abort:function(){i.abort()}}});$.ajaxPrefilter(function(n,t,i){if(n=n||{},bizagi.override.enableBatchRequest&&n.batchRequest&&bizagi.services.batchRequest){var r=$.Deferred();r.promise(i);bizagi.services.batchRequest.add(n,t,r,i)}});$.ajaxPrefilter("*",function(n,t,i){var u=n.rpcEnabled!==undefined?n.rpcEnabled:bizagi.services.ajax.rpcEnabled,r;(n.triggerBatch||!u)&&(r=n.url.indexOf("http")==0?n.url:bizagi.services.ajax.pathToBase+n.url,n.url=r,n.dataType!="json"||n.cache||(n.cache=!1),bizagi.services.ajax.logEnabled&&(bizagi.services.ajax.logSubmits&&r.indexOf("tmpl")==-1&&r.indexOf("resources.json")==-1&&bizagi.log("Sending data to "+r,n.data,"success"),n.crossDomain==!0&&(n.xhrFields={withCredentials:!0}),i.done(function(n){bizagi.services.ajax.logSuccess&&r.indexOf("tmpl")==-1&&r.indexOf("resources.json")==-1&&bizagi.log(r+" succeded",n,"success")}).fail(function(t,i,u){bizagi.log("Sent data to"+r,n.data,"error");bizagi.services.ajax.logFail&&(typeof u=="object"&&u.name=="SyntaxError"?bizagi.log(r+" failed - syntax error",arguments[0].responseText,"error"):bizagi.log(r+" failed",u,"error"))})));return});bizagi.services.ajax.parseJSON=function(n){var t={},r,i;n=n?n:"{}";n=n.replace(/(\r\n|\n|\r)/gm,"");try{t=$.parseJSON(n)}catch(u){try{t=$.parseJSON(n.replace(/\x1d/g,"."))}catch(f){t.type="error";t.code=u.errorCode;t.message=n}}return(t.type&&t.type=="error"||t.status&&t.status=="error"||t.http_status_code&&t.http_status_code==401)&&(t.code=="AUTH_ERROR"||t.code=="AUTHENTICATION_ERROR"||t.message=="AUTHENTICATION_ERROR"||t.http_status_code==401?bizagi.services.redirectToLoginPage():t.code=="FED_AUTHENTICATION_ERROR"?typeof bizagi.services.ajax.loginPage=="string"?(sessionStorage.setItem("FED_AUTHENTICATION_ERROR",!0),window.location=t.message):bizagi.services.ajax.loginPage():t.code=="AUTHENTICATION_USER_NOT_FOUND"?window.location=bizagi.services.ajax.errorPage+"?message="+t.message+"&type="+t.type:t.http_status_code&&t.http_status_code==401&&(r=t.code?t.code:t.error?t.error:"AuthenticationError",i=t.message?t.message:t.error_description?t.error_description:"Authentication Configuration Error",window.location=bizagi.services.ajax.errorPage+"?message="+i+"&type="+r),t.code=="licenseError"&&(window.location=bizagi.services.ajax.errorPage+"?message="+t.message+"&type="+t.type),i=(t.code&&t.code!="UNKNOWN_ERROR"?t.code+": ":"")+(t.message?""+t.message:""),jQuery.error(i)),localStorage.setItem("clientLog","false"),t};$.ajaxSetup({converters:{"text json":bizagi.services.ajax.parseJSON},complete:function(n){if(n.status===401){if(n.responseJSON&&n.responseJSON.validationMethod==="implicitPrincipalInjection")return;bizagi.services.redirectToLoginPage()}}});typeof jqOAuth!="undefined"&&bizagi.isOAuth2Enabled()&&($.ajaxSetup({converters:{"text json":function(n){var t={},i;n=n?n:"{}";n=n.replace(/(\r\n|\n|\r)/gm,"");try{t=$.parseJSON(n)}catch(r){try{t=$.parseJSON(n.replace(/\x1d/g,"."))}catch(u){t.type="error";t.code=r.errorCode;t.message=n}}return(t.type&&t.type=="error"||t.status&&t.status=="error")&&(i=(t.code&&t.code!="UNKNOWN_ERROR"?t.code+": ":"")+(t.message?""+t.message:""),jQuery.error(i)),localStorage.setItem("clientLog","false"),t}},complete:function(){}}),Oauth2_Credentials={client_id:"2a80addc628db6f12788ed842f873260066c9d6c",client_secret:"672b11ff612225ff018b87252d8d3a1116ecc574",redirect_uri:"bz:oauth:2.0:server:mobiletitlebarbrowser"},authorization=btoa(Oauth2_Credentials.client_id+":"+Oauth2_Credentials.client_secret),bizagi.authentication=bizagi.authentication||{},bizagi.authentication.oauth=new jqOAuth({events:{logout:function(){},login:function(){},tokenExpiration:function(){var n=bizagi.getNativeComponent(),t;return bizagi.util.isNativePluginSupported()&&n!=="tablet"?(t=$.Deferred(),bizagiapp.setAccessToken(bizagi.authentication.oauth.getAccessToken(),bizagi.authentication.oauth.getRefreshToken(),n,function(n){var i=jQuery.parseJSON(n);bizagi.authentication.oauth.setAccessToken(i.accessToken,i.refreshToken);t.resolve()}),t.promise()):$.ajax({type:"POST",url:BIZAGI_PROXY_PREFIX+"oauth2/server/token",headers:{Authorization:"Basic "+authorization},data:{grant_type:"refresh_token",scope:"login api",refresh_token:bizagi.authentication.oauth.getRefreshToken()}}).then(function(t){bizagi.util.isNativePluginSupported()&&n==="tablet"&&bizagiapp.setAccessToken(t.access_token,t.refresh_token,n);bizagi.authentication.oauth.setAccessToken(t.access_token,t.refresh_token)})}}}),bizagi.authentication.resetToken=function(n,t){this.oauth.setAccessToken(n,t);bizagi.util.isNativePluginSupported()&&bizagiapp.setAccessToken(n,t)});typeof jQuery.browser!="undefined"&&jQuery.browser.msie&&window.XDomainRequest&&(document.documentMode==7||document.documentMode==8||document.documentMode==9)&&(jQuery.support.cors=!0);
$.Class.extend("bizagi.services.service",{},{init:function(){},getServerResourceDictionary:function(){var n="",t;return typeof bizagiConfig!="undefined"&&bizagiConfig.proxyPrefix?n=bizagiConfig.proxyPrefix:typeof BIZAGI_PROXY_PREFIX!="undefined"&&(n=BIZAGI_PROXY_PREFIX),t=typeof BIZAGI_LANGUAGE=="undefined"?bizagi.language:BIZAGI_LANGUAGE,$.ajax({url:n+"Rest/Multilanguage/Client?cultureName="+t+"&version="+bizagi.loader.version,rpcEnabled:!1,cache:!0,dataType:"json",async:!0})},getResourceDictionary:function(n){return $.ajax({url:n,rpcEnabled:!1,dataType:"json",async:!0})}});
$.Class.extend("bizagi.templates.services.service",{customTemplateFile:bizagi.loader.getResource("tmpl","bizagi.overrides."+bizagi.detectDevice()+".custom.templates"),cachedFiles:{},cachedTemplates:{},customTemplates:{}},{init:function(n){this.localization=n;this.cssRegex=/{{css "(.+)"}}/g;this.loadingFileDeferred={}},loadCustomTemplates:function(){var t=this,n=new $.Deferred;return $.when(this.getTemplateFile(this.Class.customTemplateFile)).done(function(i){var r=$("<div />").html(i),u=$("script",r);$.each(u,function(n,i){i=$(i);t.Class.customTemplates[i.attr("id")]=i.html()});n.resolve()}),n.promise()},getTemplate:function(n,t){var i=this,r=!1,u;return n=n.replace(/([^#]*#)([^#]*#)([^#]*)/g,"$1$3"),n=n.replace(/([a-zA-Z_\/.-=]*)#([a-zA-Z_\/.-]*)\?(build=[a-zA-Z0-9.]*)/g,"$1?$3#$2"),bizagi.enableCustomizations&&(u=i.getHash(n),i.Class.customTemplates[u]&&(r=!0)),r||bizagi.loader.environment!=="release"?this.internalGetTemplate(n,t).pipe(function(n){return n}):this.getTemplateForRelease(n,t).pipe(function(n){return n})},getTemplateWidget:function(n,t){var i=this,r=!1,u;return n=n.replace(/([^#]*#)([^#]*#)([^#]*)/g,"$1$3"),n=n.replace(/([a-zA-Z_\/.-=]*)#([a-zA-Z_\/.-]*)\?(build=[a-zA-Z0-9.]*)/g,"$1?$3#$2"),bizagi.enableCustomizations&&(u=i.getHash(n),i.Class.customTemplates[u]&&(r=!0)),r||bizagi.loader.environment!=="release"?this.internalGetTemplate(n,t).pipe(function(n){return n}):this.getTemplateForRelease(n,t).then(function(n){return n})},getTemplateWebpart:function(n,t){return n=n.replace(/([^#]*#)([^#]*#)([^#]*)/g,"$1$3"),n=n.replace(/([a-zA-Z_\/.-=]*)#([a-zA-Z_\/.-]*)\?(build=[a-zA-Z0-9.]*)/g,"$1?$3#$2"),this.internalGetTemplate(n,t).pipe(function(n){return n})},getTemplateForRelease:function(n,t){var i=this,f=$.Deferred(),r,u,e;return i.containsHash(n)?(r=i.getUrlWithoutHashes(n),u=i.getHash(n)):(r=n,u=""),e=i.Class.cachedTemplates[r],e?f.resolve(i.processAndReturnTemplate(r,u,t)):$.when(i.loadTemplateFileForRelease(r)).done(function(){f.resolve(i.processAndReturnTemplate(r,u,t))}),f.promise()},loadTemplateFileForRelease:function(n){var t=this,i=$.Deferred();return t.Class.cachedTemplates[n]?t.Class.cachedTemplates[n]:t.loadingFileDeferred[n]?($.when(t.loadingFileDeferred[n]).done(function(){i.resolve(t.Class.cachedTemplates[n])}),i.promise()):(t.loadingFileDeferred[n]=$.Deferred(),$.when($.ajax({url:n,dataType:"text"}),t.localization.ready()).done(function(r){r||i.reject("");typeof r!="string"&&(r=JSON.parse(r[0]));t.Class.cachedTemplates[n]=r;var u,e,f;for(u in r)r.hasOwnProperty(u)&&(e=r[u],f=t.localization.translate(e),f=f.replace(t.cssRegex,""),t.Class.cachedTemplates[n][u]=f);t.loadingFileDeferred[n].resolve();i.resolve(r)}),i.promise())},processAndReturnTemplate:function(n,t,i){var u=this,r=u.Class.cachedTemplates[i];if(!r)if(r=u.Class.cachedTemplates[n][t],r)u.Class.cachedTemplates[i]=r;else throw"template "+r+"doesn't exist";return r},internalGetTemplate:function(n,t){var i=this,r=new $.Deferred,e=this.Class.cachedTemplates[t],u,f;if(e)r.resolve(e);else if(i.containsHash(n)){if(u=i.getUrlWithoutHashes(n),f=i.getHash(n),i.Class.customTemplates[u]&&i.Class.customTemplates[u][t])return r.resolve(i.Class.customTemplates[f]),r.promise();$.when(i.getTemplatePart(u,f,t)).done(function(n){i.Class.cachedTemplates[t]=n;r.resolve(n)})}else $.when(i.getTemplateFile(n)).done(function(n){i.Class.cachedTemplates[t]=n;r.resolve(n)});return r.promise()},getTemplatePart:function(n,t){var i=this,r=new $.Deferred;return $.when(i.loadingTemplatePartExecution).done(function(){i.loadingTemplatePart=!0;i.loadingTemplatePartExecution=new $.Deferred;$.when(i.getTemplateFile(n)).done(function(u){var e=$("<div />").html(u),f=$("#"+t,e);BIZAGI_ENVIRONMENT==="debug"&&f.length===0&&console.warn("No template part ("+t+") found in content for:"+n);u=f.html();i.loadingTemplatePartExecution.resolve();i.loadingTemplatePart=!0;r.resolve(u)})}),r.promise()},getTemplateFile:function(n){var t=this,i=this.Class.cachedFiles[n];return i?i:$.when($.ajax({url:n,dataType:"text"}),t.localization.ready()).pipe(function(i){if(!i)return"";typeof i!="string"&&(i=i[0]);var r=t.localization.translate(i),u=r.match(t.cssRegex);return u&&$.each(u,function(n,i){var r=i.replace(t.cssRegex,"$1");bizagi.loader.loadFile({src:r,type:"css",environment:"debug"})}),r=r.replace(t.cssRegex,""),t.Class.cachedFiles[n]=typeof r=="string"?r:r[0].outerHTML,r})},containsHash:function(n){return n.indexOf("#")!==-1},getHash:function(n){return n.substring(n.indexOf("#")+1,n.length)},getUrlWithoutHashes:function(n){return n.substring(0,n.indexOf("#"))}});jQuery.fn.fastEmpty=function(){this.children().remove();var n=$(this);n.hasClass("ui-bizagi-component-loading")&&n.loadingMessage()};jQuery.fasttmpl=function(n,t){if(typeof n=="undefined")return"";n=n.replace(/(\n*)|(\r*)|(\t*)/g,"");n=n.replace(/\s+/g," ");var i=kendo.template(n,{useWithBlock:!1}),r=i(t);return r.replace(/>\s*</g,"><").trim()};jQuery.tmpl=function(n,t){return $(jQuery.fasttmpl(n,t))};jQuery.cacheTemplate=function(n,t){return jQuery.fasttmpl(bizagi.templates.services.service.cachedTemplates[n],t)};
bizagi=typeof bizagi!="undefined"?bizagi:{};bizagi.util=typeof bizagi.util!="undefined"?bizagi.util:{};$.Class.extend("bizagi.l10n",{templateRegex:/%{([\w-{}$.]+)}/,templateSubExpressionRegex:/[$]{([\w.]+)}/g},{init:function(n){this.resourceLocationDefinition=n;this.service=new bizagi.services.service;this.dictionaries={};this.dictionary={};this.readyDeferred=null;this.enableCustomizations=typeof bizagi.enableCustomizations!="undefined"?bizagi.enableCustomizations:typeof BIZAGI_ENABLE_CUSTOMIZATIONS!="undefined"?BIZAGI_ENABLE_CUSTOMIZATIONS:!0;this.defaultDatetimeInfo=typeof BIZAGI_DEFAULT_DATETIME_INFO!="undefined"?BIZAGI_DEFAULT_DATETIME_INFO:!1},setLanguage:function(n){var t=this;t.language=n;t.readyDeferred=new $.Deferred;$.when(t._getDictionary(n)).done(function(n){if(t.dictionary=n,t.defaultDatetimeInfo&&(t.defaultDatetimeInfo.shortDateFormat&&t.overrideSpecificResource("dateFormat",t.defaultDatetimeInfo.shortDateFormat),t.defaultDatetimeInfo.timeFormat&&t.overrideSpecificResource("timeFormat",t.defaultDatetimeInfo.timeFormat)),t.enableCustomizations){if(t.resourceLocationDefinition.custom){var i=typeof BIZAGI_LOCAL_RESOURCES!="undefined"&&BIZAGI_LOCAL_RESOURCES?t.service.getResourceDictionary:t.service.getServerResourceDictionary;i===t.service.getServerResourceDictionary&&BIZAGI_LANGUAGE===t.language?t.readyDeferred.resolve():i(t.resourceLocationDefinition.custom).done(function(n){t.enableCustomizations&&t.overrideResources(n);t.readyDeferred.resolve()})}}else t.readyDeferred.resolve()})},loadLanguageExtension:function(n){var t=this,i;return t.language=n,t.readyDeferred=new $.Deferred,i=t.getLanguageFromCulture(n),typeof t.resourceLocationDefinition[i.toLowerCase()]=="undefined"&&(i="default"),t.service.getResourceDictionary(t.resourceLocationDefinition[i.toLowerCase()]).done(function(i){t.dictionaries[n.toLowerCase()]=t.dictionaries[n.toLowerCase()]||{};$.extend(t.dictionaries[n.toLowerCase()],i);t.readyDeferred.resolve()}).fail(function(t,i,r){alert("Can't load localization file for language: "+n+", "+i+" - "+r)}),t.readyDeferred.promise()},getLanguageFromCulture:function(n){return n.indexOf("-")!==-1?n.split("-")[0]:n},resolvei18n:function(n){if(!n)return"";if(typeof n=="string")return n;if(this.language&&this.language!="default"){var t=n.i18n["default"].languages[this.language];if(t)return t}return n.i18n["default"]},getResource:function(n){var t=this;return t.dictionary[n]==null?n:t.dictionary[n]},setResource:function(n,t){var i=this;n&&n!=""&&(i.dictionary[n]=t)},getMessageFromLocalization:function(n,t,i,r){var o=this,u="",e,f;if(t=="error"){if(r)u=n;else if(n=n.toLowerCase(),u=bizagi.localization.getResource("workportal-general-error-"+n),u=="workportal-general-error-"+n&&(e=bizagi.localization.getResource("workportal-general-error-generic"),e==="workportal-general-error-generic"&&(u="The request could not be completed.")),i)for(f=0;f<i.length;f++)u=u.replace("{"+f+"}",i[f])}else u=bizagi.localization.getResource(n);return u},translate:function(n){var f=this,t,i,r,u;do t=this.Class.templateRegex.exec(n),t&&(i=t[1],i.indexOf("$")==-1?n=n.replaceAll(t[0],f.getResource(i)):(r=this.Class.templateSubExpressionRegex.exec(i),r||(u=/[$]{([\w.]+)}/g,r=u.exec(i)),n=n.replaceAll(t[0],"{{resource "+r[1]+"}}")));while(t!=null);return n},overrideResources:function(n){var t=this,u=t._getUserLanguage(t.language),i=n[u];for(var r in i)t.dictionary[r]=i[r]},overrideSpecificResource:function(n,t){var i=this;n=n||"nodefined";t=t||"";i.dictionary[n]=t},_getDictionary:function(n){var t=this,i=new $.Deferred,r,u;return(n=n.toLowerCase(),t.dictionaries[n]!=null)?t.dictionaries[n]:(r=t._getUserLanguage(n),u=typeof BIZAGI_LOCAL_RESOURCES!="undefined"&&BIZAGI_LOCAL_RESOURCES?t.service.getResourceDictionary:t.service.getServerResourceDictionary,u(t.resourceLocationDefinition[r]).done(function(r){t.dictionaries[n]=r;i.resolve(r)}).fail(function(t,i,r){typeof t.responseJSON=="undefined"&&t.status===0&&t.statusText==="error"&&r===""?console.log("Can't load localization file for language: "+n+", "+i+" - "+r):alert("Can't load localization file for language: "+n+", "+i+" - "+r)}),i.promise())},_getUserLanguage:function(n){var u=this,t=n.toLowerCase(),r,i;if(u.resourceLocationDefinition[t]==null&&t.length>0)for(r=t.split("-"),i=r.length-1;i>=0;i--)if(u.resourceLocationDefinition[r[i]]!=null){t=r[i];break}return(t.length==0||u.resourceLocationDefinition[t]==null)&&(bizagi.log("No resource definition location has been given for language :"+n+", loading default language"),t="default"),t},ready:function(){var n=this;return n.readyDeferred.promise()}});
bizagi=bizagi||{};bizagi.l10n=bizagi.l10n||{};bizagi.l10n.extend("bizagi.l10n",{},{_getDictionary:function(n){var t=this,i=new $.Deferred;return(n=n.toLowerCase(),t.dictionaries[n])?t.dictionaries[n]:(t._super(n).always(function(){t._loadMobileLocalDictionary(n).always(function(){i.resolve(t.dictionaries[n])})}),i.promise())},_loadMobileLocalDictionary:function(n){var t=this,i=new $.Deferred,r,u;return n=n.toLowerCase(),r=t._getUserLanguage(n),u=r.toLowerCase().replace(/([^a-z]+)/g,"-").split("-").shift(),t.service.getResourceDictionary("jquery/resources/mobile/bizagi.resources."+u+".json.txt?build="+bizagi.loader.build).done(function(r){t.dictionaries[n]=$.extend(r,t.dictionaries[n]);i.resolve(t.dictionaries[n])}).fail(function(){t.service.getResourceDictionary("jquery/resources/mobile/bizagi.resources.en.json.txt?build="+bizagi.loader.build).done(function(i){t.dictionaries[n]=$.extend(i,t.dictionaries[n])}).fail(function(t,i,r){console.log("Can't load mobile localization file for language: "+n+", "+i+" - "+r)}).always(function(){i.resolve(t.dictionaries[n])})}),i.promise()},getResource:function(n,t){var i=this;return i.dictionary[n]===undefined?t!==undefined?t:n:i.dictionary[n]}});
bizagi=typeof bizagi!="undefined"?bizagi:{};bizagi.chrono=typeof bizagi.chrono!="undefined"?bizagi.chrono:{};bizagi.enableTrace=!0;bizagi.enableDebug=!1;bizagi.enableChrono=!1;bizagi.log=function(n,t,i){function e(){var n=$("<div />").appendTo($("body",u)),t=typeof bizagi.detectDevice!="undefined"?bizagi.detectDevice():bizagi.util.detectDevice();return n.bizagi_notifications({headerAdditionalClass:"ui-bizagi-log-container-header",containerAdditionalClass:"ui-bizagi-notifications-container ui-bizagi-log-container",itemIcon:"ui-icon-info",title:"Debugging Log",location:"top",device:t,sendEnabled:bizagi.util.isCordovaSupported()}),n.bind("itemClick",function(n,t){var i,r,f;($(".bz-render-popup-log").remove(),t.data&&!bizagi.util.isEmpty(t.data))&&(i=$("<div class='bz-render-popup-log' />").appendTo($("body"),u),r=$("<pre class='bz-render-popup-json' readonly=true />"),r.height("90%"),r.width("100%"),f=bizagi.util.syntaxHighlight(typeof t.data=="string"?t.data:JSON.stringify(t.data,null,2)),r.html(f),i.html(r),i.dialog({width:640,height:480,modal:!0,title:"Object Hierarchy",close:function(){i.dialog("destroy");i.detach()}}))}),n}function o(n){return(n=n||"bz-workonit default",n==="info")?"bz-information-icon "+n:n==="warning"?"bz-warning-icon "+n:n==="error"?"bz-minus "+n:n==="timer"?"bz-counterclock-input "+n:n==="success"?"bz-check-symbol "+n:n}var u=window.document,r,f;if(bizagi.enableTrace){if(bizagi.logContainer===undefined&&(bizagi.logContainer=$(".ui-bizagi-log-container",u),bizagi.logContainer.length===0&&(bizagi.logContainer=e(),bizagi.util.removeItemLocalStorage("bizagi.mobility.trace"),bizagi.util.setItemLocalStorage("bizagi.mobility.trace",[]))),t)try{t=JSON.parse(JSON.encode(t))}catch(s){t={}}n=n||"";r=n.replace(BIZAGI_PATH_TO_BASE,"");bizagi.logContainer.bizagi_notifications("addNotification",r,t,o(i));r.indexOf("Rest/Multilanguage/Client")===-1&&(f=bizagi.util.getItemLocalStorage("bizagi.mobility.trace")?JSON.parse(bizagi.util.getItemLocalStorage("bizagi.mobility.trace")):[],f.push([r,t]),bizagi.util.setItemLocalStorage("bizagi.mobility.trace",JSON.stringify(f)))}};bizagi.assert=function(n,t,i){n||bizagi.log(t,i,"error")};bizagi.logError=function(n,t){bizagi.log(n,t,"error")};bizagi.debug=function(n,t){bizagi.enableDebug&&bizagi.log(n,t,"info")};bizagi.getLogInstance=function(){return bizagi.logContainer};bizagi.chrono.init=function(n){n?bizagi.chronos[n]={millis:0,timestamp:0}:bizagi.chronos={}};bizagi.chrono.start=function(n,t){bizagi.enableChrono&&((t=t!==undefined?t:!1,bizagi.chronos[n]=bizagi.chronos[n]||{millis:0,timestamp:0},bizagi.chronos[n].running)||(bizagi.chronos[n].timestamp=(new Date).getTime(),bizagi.chronos[n].profiling=bizagi.enableProfiler&&t,bizagi.chronos[n].running=!0,bizagi.enableProfiler&&t&&(console.time(n),console.timeStamp(n),console.profile(n))))};bizagi.chrono.initAndStart=function(n){bizagi.chrono.init(n);bizagi.chrono.start(n)};bizagi.chrono.stop=function(n){if(bizagi.enableChrono&&(bizagi.chronos[n]=bizagi.chronos[n]||{millis:0,timestamp:0},bizagi.chronos[n].running)){var t=(new Date).getTime()-bizagi.chronos[n].timestamp;bizagi.chronos[n].millis=bizagi.chronos[n].millis+t;bizagi.chronos[n].running=!1;bizagi.chronos[n].profiling&&(console.timeEnd(n),console.timeStamp(n+"end"),console.profileEnd(n))}};bizagi.chrono.stopAndLog=function(n){bizagi.chronos[n]&&bizagi.chronos[n].running&&bizagi.chrono.stop(n);bizagi.chrono.log(n)};bizagi.chrono.log=function(n){bizagi.chronos[n]&&bizagi.enableChrono&&console.log("Timer "+n+": "+bizagi.chronos[n].millis+"ms")};bizagi.chrono.logTimers=function(){if(bizagi.enableChrono)for(key in bizagi.chronos)bizagi.chrono.log(key)};bizagi.chrono.init();
bizagi=typeof bizagi!="undefined"?bizagi:{};bizagi.showConfirmationBox=function(n,t,i,r,u){var l=window.document,f=new $.Deferred,s,o,h,e,c;if(u=u||{},t=t||bizagi.localization.getResource("confirmation-box-title"),i=bizagi.util.isEmpty(i)!=null?i:!0,bizagi.util.isMobileDevice())if(o=[],h=[],bizagi.util.isCordovaSupported()&&typeof r!="undefined"){if(r.length>0){for(e=0;e<r.length;e++)o[e]=r[e].label,h[e]=r[e].action;s=function(n){n--;h[n]==="resolve"?f.resolve():h[n]==="reject"&&f.reject()}}else s=function(n){n===1?f.resolve():n===2&&f.reject()},o=[bizagi.localization.getResource("confirmation-savebox-save"),bizagi.localization.getResource("confirmation-savebox-dontsave"),bizagi.localization.getResource("confirmation-savebox-cancel")];navigator.notification.confirm(n,s,t,o)}else bizagi.util.isCordovaSupported()?(s=function(n){n===1?f.resolve():n===2&&f.reject()},o=[bizagi.localization.getResource("confirmation-box-ok"),bizagi.localization.getResource("confirmation-box-cancel")],navigator.notification.confirm(n,s,t,o)):window.confirm(n.replace(/(<([^>]+)>)/ig,""))?f.resolve():f.reject();else c=bizagi.getTemplate("common.bizagi.desktop.dialog-confirmation"),$.when(bizagi.templateService.getTemplate(c)).then(function(r){var e=$.tmpl(r,{message:n,showIcon:i}).appendTo("body",l),o={};o[bizagi.localization.getResource("confirmation-box-ok")]=function(){e.dialog("close");f.resolve()};o[bizagi.localization.getResource("confirmation-box-cancel")]=function(){e.dialog("close");f.reject()};e.dialog({dialogClass:u.dialogClass||"bz-ui-common-dialog",resizable:!1,minHeight:u.minHeight||140,minWidth:u.minWidth||300,width:u.width||"auto",modal:!0,allowmaximize:!1,title:t,buttons:o,close:function(){e.dialog("destroy");e.detach()}})});return f.promise()};bizagi.showSaveBox=function(n,t,i,r){var o=window.document,u=new $.Deferred,s=r==="rtl"?!0:!1,f,e;return t=t||bizagi.localization.getResource("confirmation-box-title"),i=bizagi.util.isEmpty(i)!=null?i:!0,bizagi.util.isMobileDevice()?bizagi.util.isCordovaSupported()?(f=[bizagi.localization.getResource("confirmation-savebox-save"),bizagi.localization.getResource("confirmation-savebox-dontsave"),bizagi.localization.getResource("confirmation-savebox-cancel")],navigator.notification.confirm(n,function(n){n===0||n===1?u.resolve():n===2&&u.reject()},t,f)):window.confirm(n.replace(/(<([^>]+)>)/ig,""))?u.resolve():u.reject():(e=bizagi.getTemplate("common.bizagi.desktop.dialog-confirmation"),$.when(bizagi.templateService.getTemplate(e)).then(function(r){var f=$.tmpl(r,{message:n,showIcon:i}).appendTo("body",o),e=[];e[0]={text:bizagi.localization.getResource("confirmation-savebox-save"),click:function(){f.dialog("close");u.resolve()}};e[1]={text:bizagi.localization.getResource("confirmation-savebox-dontsave"),click:function(){f.dialog("close");u.reject()}};e[2]={text:bizagi.localization.getResource("confirmation-savebox-cancel"),click:function(){f.dialog("close");u.reject("cancel")}};s&&e.reverse();f.dialog({resizable:!1,minHeight:140,width:400,modal:!0,allowmaximize:!1,title:t,buttons:e,close:function(){f.dialog("destroy");f.detach()}})})),u.promise()};bizagi.showMessageBox=function(n,t,i,r){var e=window.document,u=new $.Deferred,f;return i=i||"info",t=t||"Bizagi",r=typeof r=="boolean"?r:!0,bizagi.util.isMobileDevice()?(bizagi.util.isCordovaSupported()?navigator.notification.alert(n.replace(/(<([^>]+)>)/ig,""),function(){},"Bizagi","Ok"):window.alert(n.replace(/(<([^>]+)>)/ig,"")),u.resolve()):(f=bizagi.getTemplate("common.bizagi.desktop.dialog-message"),$.when(bizagi.templateService.getTemplate(f)).then(function(r){var f=$.tmpl(r,{message:n,icon:bizagi.getIcon(i)}).appendTo("body",e),o={};o[bizagi.localization.getResource("confirmation-box-ok")]=function(){f.dialog("close");u.resolve()};f.dialog({modal:!0,title:t,height:"auto",resizable:!1,maximize:!1,draggable:!1,buttons:o,close:function(){f.dialog("destroy");f.detach()}})})),u.promise()};bizagi.getIcon=function(n){return(n=n||"ui-icon-bullet",n==="info")?"ui-icon-info":n==="warning"?"ui-icon-alert":n==="error"?"ui-icon-circle-close":n==="success"?"ui-icon-check":n};
(function(n){n.notifier={};n.notifier.options={position:"",class_name:"",fade_in_speed:"medium",fade_out_speed:1e3,time:3e3};n.notifier.add=function(n){try{return t.add(n||{})}catch(r){var i="Notifier Error: "+r;typeof console!="undefined"&&console.error?console.error(i,n):alert(i)}};n.notifier.remove=function(n,i){t.removeSpecific(n,i||{})};n.notifier.removeAll=function(n){t.stop(n||{})};var t={position:"",fade_in_speed:"",fade_out_speed:"",time:"",_custom_timer:0,_item_count:0,_is_setup:0,_tpl_close:'<div class="notifier-close km-button"><span class="bz-mo-icon bz-cancel"><\/span><\/div>',_tpl_item:'<div id="notifier-item-[[number]]" class="notifier-item-wrapper [[item_class]]" style="display:none"><div class="notifier-item">[[image]]<div class="[[class_name]]"><span class="notifier-title">[[username]]<\/span><p>[[text]]<\/p><\/div>[[close]]<\/div>[[progress]]<\/div>',_tpl_progress:'<div class="progress-bar"><\/div>',_tpl_wrap:'<div id="notifier-notice-wrapper"><\/div>',add:function(i){var r,e,u;if(i.title===""&&i.text==="")throw'You need to fill out the params: "title" or "text", one at least';this._is_setup||this._runSetup();var h=i.title||"",c=i.text||"",o=i.image||"",f=i.sticky||!1,l=i.class_name||n.notifier.options.class_name,a=n.notifier.options.position,s=i.time||"";this._verifyWrapper();this._item_count++;r=this._item_count;e=this._tpl_item;n(["before_open","after_open","before_close","after_close"]).each(function(u,f){t["_"+f+"_"+r]=n.isFunction(i[f])?i[f]:function(){}});this._custom_timer=0;s&&(this._custom_timer=s);var v=o!=""?'<img src="'+o+'" class="notifier-image" />':"",y=o!=""?"notifier-with-image":"notifier-without-image",p=f?"":this._tpl_progress;return(e=this._str_replace(["[[username]]","[[text]]","[[close]]","[[image]]","[[number]]","[[class_name]]","[[item_class]]","[[progress]]"],[h,c,this._tpl_close,v,this._item_count,y,l,p],e),this["_before_open_"+r]()===!1)?!1:(n("#notifier-notice-wrapper").addClass(a).append(e),u=n("#notifier-item-"+this._item_count),u.fadeIn(this.fade_in_speed,function(){t["_after_open_"+r](n(this))}),f||this._setFadeTimer(u,r),n(u).bind("mouseenter mouseleave",function(i){i.type=="mouseenter"?f||t._restoreItemIfFading(n(this),r):f||t._setFadeTimer(n(this),r);t._hoverState(n(this),i.type)}),n(u).find(".notifier-close").click(function(){var i=n(u).attr("id").split("-")[2];t.removeSpecific(i,{},n(u),!0)}),r)},_countRemoveWrapper:function(t,i,r){i.remove();this["_after_close_"+t](i,r);n(".notifier-item-wrapper").length==0&&n("#notifier-notice-wrapper").remove()},_fade:function(n,i,r,u){var r=r||{},f=typeof r.fade!="undefined"?r.fade:!0;fade_out_speed=r.speed||this.fade_out_speed;manual_close=u;this["_before_close_"+i](n,manual_close);u&&n.unbind("mouseenter mouseleave");f?n.animate({opacity:0},fade_out_speed,function(){n.animate({height:0},300,function(){t._countRemoveWrapper(i,n,manual_close)})}):this._countRemoveWrapper(i,n)},_hoverState:function(n,t){t=="mouseenter"?n.find(".progress-bar").hide():n.find(".progress-bar").show()},removeSpecific:function(t,i,r,u){if(!r)var r=n("#notifier-item-"+t);this._fade(r,t,i||{},u)},_restoreItemIfFading:function(n,t){clearTimeout(this["_int_id_"+t]);clearInterval(this["_interval_id_"+t]);n.stop().css({opacity:"",height:""})},_runSetup:function(){for(opt in n.notifier.options)this[opt]=n.notifier.options[opt];this._is_setup=1},_setFadeTimer:function(i,r){var f=this,u=this._custom_timer?this._custom_timer:this.time,e=(new Date).getTime(),o=e+u,s=n(".progress-bar",i);this["_interval_id_"+r]=setInterval(function(){var n=(o-(new Date).getTime())*100/u;s.width(n+"%")},10);this["_int_id_"+r]=setTimeout(function(){t._fade(i,r);clearInterval(f["_interval_id_"+r])},u)},stop:function(t){var r=n.isFunction(t.before_close)?t.before_close:function(){},u=n.isFunction(t.after_close)?t.after_close:function(){},i=n("#notifier-notice-wrapper");r(i);i.fadeOut(function(){n(this).remove();u()})},_str_replace:function(n,t,i,r){var f=0,e=0,o="",c="",l=0,a=0,h=[].concat(n),s=[].concat(t),u=i,v=s instanceof Array,y=u instanceof Array;for(u=[].concat(u),r&&(this.window[r]=0),f=0,l=u.length;f<l;f++)if(u[f]!=="")for(e=0,a=h.length;e<a;e++)o=u[f]+"",c=v?s[e]!==undefined?s[e]:"":s[0],u[f]=o.split(h[e]).join(c),r&&u[f]!==o&&(this.window[r]+=(o.length-u[f].length)/h[e].length);return y?u:u[0]},_verifyWrapper:function(){n("#notifier-notice-wrapper").length==0&&n("body").append(this._tpl_wrap)}}})(jQuery);
(function(n){n.fn.actionSheet=function(t){function f(){function n(){return Math.floor((1+Math.random())*65536).toString(16).substring(1)}return(n()+n()+"-"+n()+"-4"+n().substr(0,3)+"-"+n()+"-"+n()+n()+n()).toLowerCase()}var i=this,e={setDataToShow:function(){},actionClicked:function(){},cancelClicked:function(){},actions:[],titleLabel:null,cancelLabel:bizagi.localization.getResource("text-cancel")||"Cancel"},r=n.extend(e,t||{}),u;return i.guid=f(),i.template="<ul id='actionsheet-#=data.id#' class='bz-actionsheet #if(data.isCaseFolder){#bz-rn-case-folder#}#' data-cancel='#=data.cancelLabel#'>\t# if(data.titleLabel){#\t\t<li class='km-actionsheet-title bz-actionsheet-title'><span>#=data.titleLabel#<span><\/li>\t# } #\t# for(var i = 0; i < data.actions.length; i++){#\t\t<li class='bz-render-as-option #if(i === data.actions.length-1){#bz-render-last-child#}#'>\t\t\t<a #if(data.actions[i].guid !== 'back'){#\t\t\t\t\tdata-bz-ordinal='#= data.actions[i].guid #'\t\t\t\t#} else {#\t\t\t\t\tdata-bz-ordinal='-1'\t\t\t\t#} #>#= data.actions[i].displayName #               #if(data.isCaseFolder){#                   <span class='bz-rn-action-sheet-icons #=data.actions[i].icon#'><\/span>               #}#\t\t\t<\/a>\t\t<\/li>\t#}#<\/ul>",u={init:function(){u.bindElements()},bindElements:function(){i.unbind("click.actionSheet").bind("click.actionSheet",u.showActionSheet)},showActionSheet:function(t){t.preventDefault();t.stopPropagation();n.when(r.setDataToShow(t)).done(function(t){var u,o,s,e;if(t=typeof t!="undefined"?t:r.actions,t.length>0){for(n.each(n(".bz-actionsheet","body"),function(t,i){n(i).data("kendoMobileActionSheet").destroy()}),o=-1;u=t[++o];)typeof u.guid=="undefined"&&(u.guid=f());s=kendo.template(i.template,{useWithBlock:!1});n("body").append(s({id:i.guid,actions:t,titleLabel:r.titleLabel,cancelLabel:r.cancelLabel,isCaseFolder:r.isCaseFolder}));e=n("#actionsheet-"+i.guid).kendoMobileActionSheet({type:"phone",close:function(n){r.cancelClicked(n);this.destroy();this.element.remove()}});n("a[data-bz-ordinal]",e).kendoMobileButton({click:function(n){var i=t.find(function(t){return t.guid===n.button.data("bz-ordinal")});r.actionClicked(i)}});n(e).data("kendoMobileActionSheet").open()}})},getGUID:function(){return i.guid}},u.init(),u}})(jQuery);
(function(n){n.fn.mfb=function(t){"use strict";function f(n,t,i){for(var r=0,u=n.length;r<u;r++)n[r].addEventListener(t,i,!1)}function c(f){for(i=f.target;i&&!i.getAttribute(t.toggleMethod);)if(i=i.parentNode,!i)return;if(u=i.getAttribute(t.menuState)===t.isOpen?t.isClosed:t.isOpen,t.activePrincipalButton&&u!=="open"){var e=t.buttons[0];t.click&&t.click(f,n.extend(e,{principal:!0}),this)}u!=="open"||r.opened?r.element.remove():r.element.appendTo(i).bind("click",function(){this.remove();r.opened=!1;i.setAttribute(t.menuState,"close")});r.opened=!r.opened;i.setAttribute(t.menuState,u)}function l(i){var r=n(this).data("index"),u=t.buttons[r];n(".mfb-component__overlay",h).click();t.click&&(i.preventDefault(),t.click(i,n.extend(u,{principal:!1}),this))}function a(n){t.click&&(n.preventDefault(),t.click(n,{principal:!0},this))}var h=this,r={element:n("<div class='mfb-component__overlay'><\/div>"),opened:!1},o,i,u,s,e;t=t||{};t.buttons=t.buttons||[];t.activePrincipalButton=t.activePrincipalButton||!1;t.placement=typeof t.placement!="undefined"?["mfb-component--tl","mfb-component--tr","mfb-component--bl","mfb-component--br"].indexOf(t.placement)!=-1?t.placement:"mfb-component--br":"mfb-component--br";t.efect=typeof t.efect!="undefined"?["mfb-zoomin","mfb-slidein","mfb-slidein-spring","mfb-fountain"].indexOf(t.efect)!=-1?t.efect:"mfb-slidein":"mfb-slidein";t.clickHoverOpt=t.clickHoverOpt||"click";t.toggleMethod=t.toggleMethod||"data-mfb-toggle";t.menuState=t.menuState||"data-mfb-state";t.menuStateValue=t.menuStateValue||"closed";t.isOpen=t.isOpen||"open";t.isClosed=t.isClosed||"closed";t.mainButtonClass=t.mainButtonClass||"mfb-component__button--main";t.restingIcon=t.restingIcon||"plus";t.activeIcon=t.activeIcon||"cross";n("["+t.toggleMethod+"='"+t.clickHoverOpt+"'] ."+t.mainButtonClass,this).remove();o='<ul class="#: data.placement # #: data.efect #" #: data.toggleMethod #="#: data.clickHoverOpt #" #: data.menuState#="#: data.menuStateValue #">   <li class="mfb-component__wrap">      #if (data.activePrincipalButton && data.buttons.length >= 2){#       <a #if(typeof data.buttons[0].label !== "undefined"){# data-mfb-label="#: data.buttons[0].label #"#}# class="mfb-component__button--main">           <i class="mfb-component__main-icon--resting mfb-icon-font bz-#:data.restingIcon#"><\/i><i class="mfb-component__main-icon--active mfb-icon-font bz-#:data.buttons[0].icon#"><\/i>       <\/a>       #}else{#       <a #if(typeof data.label !== "undefined"){# data-mfb-label="#: data.label #"#}# class="mfb-component__button--main">           <i class="mfb-component__main-icon--resting mfb-icon-font bz-#:data.restingIcon#"><\/i><i class="mfb-component__main-icon--active mfb-icon-font bz-#:data.activeIcon#"><\/i>       <\/a>       #}#       # if(data.buttons.length > 0){#       <ul class="mfb-component__list">           #for(var i = (data.activePrincipalButton ? 1 : 0), len = data.buttons.length; i< len;i++){#           <li>               <a href="#: data.buttons[i].link #" data-index="#: i#" #if(typeof data.buttons[i].label !== "undefined"){# data-mfb-label="#: data.buttons[i].label #"#}# class="mfb-component__button--child">                  <i class="mfb-component__child-icon mfb-icon-font bz-#: data.buttons[i].icon #"><\/i>               <\/a>           <\/li>           #}#       <\/ul>       #}#   <\/li><\/ul>';s=kendo.template(o,{useWithBlock:!1});e=s(t);t.position=="prepend"?this.prepend(e):this.append(e);t.buttons.length>0?f(n("["+t.toggleMethod+"='"+t.clickHoverOpt+"'] ."+t.mainButtonClass,this),"click",c):f(n("["+t.toggleMethod+"='"+t.clickHoverOpt+"'] ."+t.mainButtonClass,this),"click",a);f(n(".mfb-component__button--child",this),"click",l)}})(jQuery);
(function(n){n.bizagiLoader=function(n){var t={loaderInstanceVisible:!1,loaderStopped:!1,errorMessageShown:!1};return $.extend(t,t,n),{start:function(){var n,i;$(".km-loader").css("display","none");n=bizagi.util.getItemLocalStorage("loader");t.selector?t.innerLoader?$(t.selector).append('<div class="innerLoader"><\/div>'):kendo.ui.progress($(t.selector),!0):(n&&n!="NaN"?(n=Number(n)+1,bizagi.util.setItemLocalStorage("loader",n)):(i=$(".k-loading-mask").css("display")=="block"?2:1,bizagi.util.setItemLocalStorage("loader",i),$(".k-loading-mask").css("display")==="block"&&$(".k-loading-mask").css("display","none")),kendo.ui.progress($("body"),!0));setTimeout(function(){var n=Number(bizagi.util.getItemLocalStorage("loader"));(n>=1||$(".k-loading-mask").size()>=1)&&($(".km-loader").css("display","none"),t.selector&&(t.innerLoader?$(t.selector).find(".innerLoader").remove():kendo.ui.progress($(t.selector),!1)),kendo.ui.progress($("body"),!1),t.errorMessageShown=!0,localStorage.removeItem("loader"))},2e4)},stop:function(){var n=Number(bizagi.util.getItemLocalStorage("loader"));if(t.selector&&(t.innerLoader?$(t.selector).find(".innerLoader").remove():kendo.ui.progress($(t.selector),!1)),n<=1){t.loaderStopped=!0;$(".km-loader").css("display","none");$(".k-loading-mask").css("display","none");kendo.ui.progress($(".km-flat"),!1);localStorage.removeItem("loader");return}n-=1;bizagi.util.setItemLocalStorage("loader",n)},startInnerLoader:function(n){$(n).addClass("innerLoaderContainer");bizagiLoader({selector:n,innerLoader:!0}).start()},stopInnerLoader:function(n){$(n).removeClass("innerLoaderContainer");bizagiLoader({selector:n,innerLoader:!0}).stop()}}}})(this);
(function(n){n.fn.uitags=function(t,i){function u(i,u){var f=new n.Deferred;return n.when(t.loadTemplate(i,bizagi.getTemplate(r.config.nameTemplate).concat(u))).done(function(){f.resolve(t.getTemplate(i))}),f.promise()}var r=this,f;return i=i||{},r.temporalElements={},r.config={nameTemplate:"bizagi.ui.controls.tags.template",cssComponent:"bizagi.ui.controls.tags"},f={init:function(t,i){var r=this;r.input=t;r.tags=i.dataSource||[];n.when(u("bizagi.inputTags.container","#ui-bz-mobile-uitags-control"),u("bizagi.inputTags.modalView","#ui-bz-wp-popup-uitags-control"),u("bizagi.inputTags.modalView.default","#ui-bz-wp-uitags-control-modalview-auxiliary-templates"),u("bizagi.imputTags.container.default","#ui-bz-wp-uitags-control-input-auxiliary-templates")).then(function(t,u,f,e){r.inputTags=t;r.modalViewTags=u;r.defaultModalViewTags=f;r.defaultInputTags=e;r.input.html(n.tmpl(r.inputTags,{value:i.value||[]}));r.configureInputHandlers();r.configureModalView(".bz-rn-last-child")})},configureModalView:function(t){var i=this,r=t===""?i.input:n(t,i.input);r.unbind().bind("click",function(){var u=n("ul li.bz-rn-regular-element",i.input),f=[],t,s,r;for(i.temporalElements={},t=0;t<u.length;t++){var e=n(u[t]).data("guid"),o=n("label",n(u[t])).text(),h={guid:e,tag:o};f.push(h);i.addTemporalElement(e,o,!1)}s=i.modalViewTags;r=n.tmpl(s,{items:f,orientation:""}).clone();r.kendoMobileModalView({close:function(){this.destroy();this.element.remove()},useNativeScrolling:!0,modal:!1});i.configureModalViewHandlers(r);r.kendoMobileModalView("open")})},configureModalViewHandlers:function(t){var i=this,r=new n.Deferred;t.find(".bz-wp-uitagsplugin-cancel-icon-list").hide(500);t.find(".bz-wp-uitagsplugin-add-icon-list").hide(500);t.find(".input-filter-results-on-uitagsplugin").bind("keypress keyup",function(){this.value!==""?(t.find(".bz-wp-uitagsplugin-cancel-icon-list").show(500),t.find(".bz-wp-uitagsplugin-add-icon-list").show(500)):(t.find(".bz-wp-uitagsplugin-cancel-icon-list").hide(500),t.find(".bz-wp-uitagsplugin-add-icon-list").hide(500));i.searchValue(this.value,t)}).focus(function(){t.find(".filter-searchlist-modal-view-tags").addClass("searching")}).blur(function(){t.find(".filter-searchlist-modal-view-tags").removeClass("searching")});t.find(".bz-wp-uitagsplugin-cancel-icon-list").bind("click",function(){i.showNoResultsMessage(t);t.find(".input-filter-results-on-uitagsplugin").val("");n(this).hide(500);t.find(".bz-wp-uitagsplugin-add-icon-list").hide(500)});t.find(".bz-wp-uitagsplugin-add-icon-list").bind("click",function(){n(this).hide(500);t.find(".bz-wp-uitagsplugin-cancel-icon-list").hide(500);var r=t.find(".input-filter-results-on-uitagsplugin").val();i.appendFoundItem(r,n(".filter-uitags-modal-view-tags",t),!1);t.find(".input-filter-results-on-uitagsplugin").val("")});t.delegate("#ui-bizagi-apply-button-uitags","click",function(){r.resolve();t.data("kendoMobileModalView").close()});t.find(".bz-wp-search-on-uitags-back-icon-list").bind("click",function(){r.reject();t.data("kendoMobileModalView").close()});t.find(".filter-uitags-modal-view-tags").on("click",".bz-rn-remove-tag-on-uitags",function(){i.removeItem(n(this),!0);var r=t.find(".input-filter-results-on-uitagsplugin").val();i.searchValue(r,t)});n.when(r).done(function(){i.addNewValuesToInput();i.temporalElements={}}).fail(function(){i.temporalElements={}})},searchValue:function(t,i){var r=this;bizagiLoader({selector:".bz-rn-new-modalview-content-styles"}).start();n.when(r.showResults(t,i)).always(function(){bizagiLoader({selector:".bz-rn-new-modalview-content-styles"}).stop()})},showResults:function(t,i){var r=this,u=r.tags.filter(function(n){return n.tag.indexOf(t)!==-1}),f;u.length===0?r.showNoResultsMessage(i):(n("#ui-bizagi-wp-filter-results-uitags-wrapper ul li",i).remove(),f=n("li",n.tmpl(r.defaultModalViewTags,{template:"sugestions",items:u})),f.appendTo(n("#ui-bizagi-wp-filter-results-uitags-wrapper ul",i)),r.modalViewList=n(".ui-bizagi-render-list-elements",i),r.modalViewList.find("li").unbind().bind("click",function(){r.appendFoundItem(this,n(".filter-uitags-modal-view-tags",i),!0);n(this).siblings().length===0&&r.showNoResultsMessage(i);n(this).remove()}))},showNoResultsMessage:function(t){var i=this,r=bizagi.localization.getResource("workportal-widget-inboxcommon-no-results-found"),u=n("li",n.tmpl(i.defaultModalViewTags,{template:"modalViewDefaultMessage",message:r}));n("#ui-bizagi-wp-filter-results-uitags-wrapper ul li",t).remove();u.appendTo(n("#ui-bizagi-wp-filter-results-uitags-wrapper ul",t))},removeItem:function(t,i){var u=this,f=t.parent(),r=t.closest(".bz-rn-container-uitags"),e;r.length===0&&(r=t.closest(".filter-uitags-modal-view-tags"));i?delete u.temporalElements[f.data("id")]:delete f;f.remove();r.find("li").length<=1&&!i?(n(".bz-rn-click-to-add-span",r).removeClass("hidden"),u.configureModalView(".bz-rn-last-child")):r.find("li").length===0&&i&&(e=n.tmpl(u.defaultModalViewTags,{template:"modalViewDefaultValue"}).clone(),n("li",e).appendTo(n("ul",r)))},appendFoundItem:function(t,i,r){var f=this,u="",e="",a=n.map(n("li",i),function(t){return n(t).data("guid")}),o=[],s,l,h,c;r?(u=n(t).data("guid"),e=n("label",t).text()):(o=f.tags.filter(function(n){return n.tag==t})[0],o?(u=o.guid,e=o.tag,s=n("[data-guid='"+u+"']",f.modalViewList),s.siblings().length===0&&(l=n("#ui-bizagi-wp-filter-results-uitags-wrapper ul li",f.modalViewList.parents()),f.showNoResultsMessage(l)),s.remove()):(u=Math.guid(),e=t));a.indexOf(u)==-1&&(h=n("li",n.tmpl(f.defaultModalViewTags,{template:"fullElement",guid:u,tag:e}).clone()),c=n("li:last",i),c.hasClass("bz-rn-any-element")?(c.remove(),n("ul",i).prepend(h)):n("ul",i).prepend(h),f.addTemporalElement(u,e,!1))},getTagsElements:function(){for(var i=n("ul li.bz-rn-regular-element",r.input),u=[],t=0;t<i.length;t++){var f=n(i[t]).data("guid"),e=n("label",n(i[t])).text(),o={guid:f,tag:e};u.push(o)}return u},addNewValuesToInput:function(){var t=this,i=[],r;n.each(t.temporalElements,function(n,t){i.push(t.obj)});n("ul li",t.input).remove();r=n("li",n.tmpl(t.defaultInputTags,{template:"inputContainer",value:i}).clone());r.appendTo(n("ul",t.input));n("ul",t.input).unbind();n(".bz-rn-last-child",t.input).unbind();t.configureModalView(".bz-rn-last-child");t.configureInputHandlers()},configureInputHandlers:function(){var t=this;t.input.on("click",".bz-rn-remove-tag-on-uitags",function(){t.removeItem(n(this))})},addTemporalElement:function(n,t,i){var r=this;r.temporalElements[n]&&delete r.temporalElements[n];r.temporalElements[n]={obj:{guid:n,tag:t},remove:i}}},f.init(r,i),f}})($);
(function(n){n.widget("ui.bizagi_notifications",{options:{containerAdditionalClass:"",headerAdditionalClass:"",contentAdditionalClass:"",itemAdditionalClass:"",itemIcon:"ui-icon-alert",title:"Notifications",minimized:!0,clearEnabled:!0,sendEnabled:!1,location:"bottom",device:"desktop"},_init:function(){var i=this,t=i.options,u=i.element,f,r,e,o,s;i.counter=0;u.addClass(t.containerAdditionalClass).addClass("ui-bizagi-notifications-container");t.orientation=="rtl"&&u.addClass("ui-bizagi-notification-reverse");u.addClass(t.minimized?"ui-bizagi-state-collapsed":"ui-bizagi-state-expanded");f=n("<div><\/div>").addClass("ui-bizagi-notifications-content").addClass(t.contentAdditionalClass).addClass("ui-widget-content");r=n("<div><\/div>").addClass("ui-bizagi-notifications-header").addClass(t.headerAdditionalClass).addClass("ui-widget-header").addClass("ui-state-active");t.device!=="desktop"?r.data("expanded",!t.minimized).html("<label>"+t.title+"<\/label>"):r.data("expanded",!t.minimized).text(t.title);r.mouseenter(function(){u.addClass("ui-bizagi-state-hover")});r.mouseleave(function(){u.removeClass("ui-bizagi-state-hover")});i.expandedIcon=t.location==="bottom"?"bz-icon-expanded":"bz-icon-collapsed";i.collapsedIcon=t.location==="bottom"?"bz-icon-collapsed":"bz-icon-expanded";t.device==="desktop"?i.headerButton=n("<span />").addClass("ui-bizagi-notifications-box-button").addClass("ui-icon").addClass(t.minimized?i.collapsedIcon:i.expandedIcon).appendTo(r).click(function(){i.onHeaderClick()}):(r.click(function(){i.onHeaderClick()}),i.headerButton=n("<span />").addClass("ui-bizagi-notifications-box-button").addClass("ui-icon").addClass(t.minimized?i.collapsedIcon:i.expandedIcon).appendTo(r));e=n("<span />").addClass("ui-bizagi-notifications-close-button").appendTo(r);n("<span />").addClass("bz-mo-icon").addClass("bz-cancel").appendTo(e);t.clearEnabled&&(o=n("<span />").addClass("ui-bizagi-notifications-clear-button").appendTo(r).click(function(){i.clearAll(!1)}),n("<span />").addClass("bz-mo-icon").addClass("bz-trash-icon").appendTo(o));t.sendEnabled&&(s=n("<span />").addClass("ui-bizagi-notifications-send-button").appendTo(r).click(function(){i.sendMail()}),n("<span />").addClass("bz-mo-icon").addClass("bz-send").appendTo(s));u.append(r).append(f);t.location=="bottom"&&u.addClass("ui-bizagi-notifications-container-bottom");t.minimized&&f.hide();i.content=f;i.header=r},addNotification:function(t,i,r,u,f){var o;if(t&&t.replace){var e=this,s=e.options,h=e.element,c=e.batchMode?e.batchContent:e.content;r=r||s.itemIcon;u=u||s.itemAdditionalClass;typeof t!="string"&&(t=t.toString());t=bizagi.util.encodeHtml(t.replace(/<(\/?(?:STRONG|FONT))>/gi,"#$1!#"));t=t.replace(/#(\/?(?:STRONG|FONT))!#/gi,"<$1>");t=t.replace(/\n|\r/g,"<br/>");o=n("<div class='ui-bizagi-notification-item "+u+" ui-widget-content'><span class='bz-mo-icon "+r+"' /><label>"+t+"<\/label><\/div>").appendTo(c);!e.batchMode&&e._hasScrollBar()&&o[0].scrollIntoView();o.bind("click",function(){h.triggerHandler("itemClick",{data:i});f&&f({data:i})});e.batchMode||e.show();e.counter++}},clearAll:function(n){var t=this,i=t.content;n=n===undefined?!0:n;bizagi.util.removeItemLocalStorage("bizagi.mobility.trace");i.empty();t.counter=0;n?t.hide():t.show()},sendMail:function(){var n=bizagi.util.getItemLocalStorage("bizagi.mobility.trace");if(!n){bizagi.showMessageBox(bizagi.localization.getResource("bz-rp-nodata"),"Error");return}bizagi.util.isCordovaSupported()&&window.plugin.email.isAvailable(function(t){if(!t){bizagi.showMessageBox("The e-mail service is currently not available.","Error");return}var i="base64:bizagi-mobile-log.txt//"+bizagi.util.b64EncodeUnicode(n);cordova.plugins.email.open({subject:"Bizagi Mobile - Log Report",body:"<p>A log file has been attached<\/p><br /><p> Powered by Bizagi Mobile Application<\/p><br />",isHtml:!0,attachments:[i]})})},show:function(){var n=this,t=n.element;n.isContentVisible()||t.fadeIn()},hide:function(){var n=this,t=n.element;n.isContentVisible()&&t.hide()},count:function(){var n=this,t=n.content;return t.children().size()},_hasScrollBar:function(){var n=this,t=n.content;return n.isContentVisible()?bizagi.util.hasScroll(t,"vertical"):!1},onHeaderClick:function(){var n=this;n.isExpanded()?n.collapse():n.expand()},isExpanded:function(){var n=this,t=n.header;return t.data("expanded")===!0},collapse:function(){var n=this,t=n.element,i=n.headerButton,r=n.header;i.removeClass(n.expandedIcon);i.addClass(n.collapsedIcon);r.data("expanded",!1);t.removeClass("ui-bizagi-state-expanded");t.addClass("ui-bizagi-state-collapsed");n.content.hide()},expand:function(){var n=this,t=n.element,i=n.headerButton,r=n.header;i.removeClass(n.collapsedIcon);i.addClass(n.expandedIcon);r.data("expanded",!0);t.removeClass("ui-bizagi-state-collapsed");t.addClass("ui-bizagi-state-expanded");n.content.show()},autoFocusFirstError:function(){var t=this,i=t.content;window.setTimeout(function(){n("div:first",i).click()},9e3)},initBatch:function(){var t=this;t.batchMode=!0;t.batchContent=n("<div><\/div>")},endBatch:function(){var n=this;n.batchMode=!1;n.batchContent.children().appendTo(n.content);n.batchContent.detach();n.batchContent=null;n.content.children().length>0&&n.show()},isContentVisible:function(){var n=this,t=n.content,i=n.element;return i.length>0&&i.css("display")!="none"&&t.length>0&&t.css("display")!="none"}})})(jQuery);
var loader=bizagi.loader;bizagi.templateEngine=function(n){var t=this;return t.properties=n||{},t.errorMessage="Critical Dependencies has not defined, please check it",t.observableElement=$({}),t.templateQueue={},t.setProperties=function(n){n=n||{};t.properties=$.merge(t.properties,n);t.properties.cache=typeof t.properties.cache=="undefined"?!0:t.properties.cache;t.properties.autoGenerateData=n.autoGenerateData||!1;t.properties.forcePersonalizedColumns=t.properties.forcePersonalizedColumns||!1},t.setEntityData=function(n){t.entityData=n||null},t.setEntityGuid=function(n){t.entityGuid=n||null},t.setTemplateGuid=function(n){t.templateGuid=n||null},t.getEntityGuid=function(){return t.entityGuid},t.getTemplateGuid=function(){return t.templateGuid},t.getEntityData=function(){return t.entityData},t._serviceGetTemplate=function(n,i,r,u){return t.properties.renderFactory.dataService.multiaction().getTemplate({guid:n,templateGuid:u,isDefaultTemplate:i,templateType:r,forcePersonalizedColumns:t.properties.forcePersonalizedColumns})},t._getRenderForm=function(n,i){n=n||{};var r=new $.Deferred;return t._hasCriticalDependencies()||r.reject(this.errorMessage),$.when(t.properties.renderFactory.getContainer({type:"template",data:n.form,paramsRender:i})).done(function(n){r.resolve(n)}).fail(function(n){r.reject(n)}),r.promise()},t._hasCriticalDependencies=function(){return t.properties.renderFactory&&t.properties.renderFactory.dataService?!0:!1},t._setCacheItem=function(n,t,i){t.timestamp=i;var r=JSON.encode(t);return bizagi.util.setItemLocalStorage(n,r)},t._getCacheItem=function(n,t){var i=JSON.parse(bizagi.util.getItemLocalStorage(n));return i&&i.timestamp==t?i:null},t.disposeCache=function(){bizagi.util.clearLocalStorage()},t.disposeItem=function(n){bizagi.util.removeItemLocalStorage(n)},t.getTemplate=function(n,i,r,u,f){var s,o,e,h;return(n=n||t.getEntityGuid(),s=f?f:n,o=s+"-"+u+"-"+i,typeof t.templateQueue[o]!="undefined")?t.templateQueue[o]:(e=new $.Deferred,h=t.properties.cache?t._getCacheItem(s,r):null,h?e.resolve(h):t._hasCriticalDependencies()?(t.templateQueue[o]=e,$.when(t._serviceGetTemplate(n,i,u,f)).then(function(n){t._setCacheItem(s,n,r);e.resolve(n)}).fail(function(n){e.reject(n)}).always(function(){delete t.templateQueue[o]})):e.reject(t.errorMessage),e.promise())},t.render=function(n,i){if(!n)return"";var u=n.guid||"",e=n.timestamp,r=new $.Deferred,o=n.templateType||"",f=n.guidTemplate||n.templateGuid,s=f?!1:!0;return t.setEntityData(n),t.setEntityGuid(u),$.when(t.getTemplate(u,s,e,o,f)).done(function(u){$.when(t._getRenderForm(u,i)).done(function(i){if(typeof i=="object"&&i.error)r.resolve(i.error);else{var u=[];t.properties.autoGenerateData&&(n.data=new bizagi.mockTemplateEngine(i).mock());$.each(n.data,function(r,f){var e=i.getRendersByXpath(r)||i.getRenderById(r),o;if(e)if($.isArray(e))for(iControl=0,countControls=e.length;iControl<countControls;iControl++)o=t.preProcessValue(n,e[iControl].properties,f),e[iControl].setValue(o),u.push(e[iControl]);else f=t.preProcessValue(n,control.properties,f),control.setValue(f),u.push(control)});i.bind("globalHandler",function(i,r){r.eventType=="DATA-NAVIGATION"&&(r.data.surrogateKey=n.surrogateKey||n.surrogatedKey,r.data.guidEntityCurrent=n.guid,t.publish("onLoadDataNavigation",r))});$.when(i.render()).done(function(n){r.resolve(n,u)})}})}).fail(function(n){r.reject(n)}),r.promise()},t.preProcessValue=function(n,t,i){return(t.type==="layoutImage"||t.type==="layoutUpload")&&(i={value:i,surrogateKey:n.surrogateKey||n.surrogatedKey,guid:n.guid}),i},t.subscribe=function(){t.observableElement.on.apply(t.observableElement,arguments)},t.unsubscribe=function(){t.observableElement.off.apply(t.observableElement,arguments)},t.publish=function(){return t.observableElement.triggerHandler.apply(t.observableElement,arguments)},t.setProperties(n),{setEntityData:t.setEntityData,getEntityData:t.getEntityData,setEntityGuid:t.setEntityGuid,getEntityGuid:t.getEntityGuid,getTemplate:t.getTemplate,disposeCache:t.disposeCache,disposeItem:t.disposeItem,checkDependencies:t._hasCriticalDependencies,setProperties:t.setProperties,render:t.render,subscribe:t.subscribe,unsubscribe:t.unsubscribe,publish:t.publish}};bizagi.mockTemplateEngine=function(n){var t=this;return t.form=n||{},t._getControls=function(){var n=this,t={};return n.form&&n.form.rendersById&&$.each(n.form.rendersById,function(n,i){i.properties.type!="layout"&&(t[n]=i)}),t},t._getDataMock=function(n){switch(n){case"layoutImage":return"R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";case"layoutLabel":return"Label";case"layoutText":return"Lorem";case"layoutDateTime":return"01/01/2000";default:return null}},t._mock=function(){var i=t._getControls(),n={};return $.each(i,function(i,r){var u=r.properties.type;n[i]=t._getDataMock(u)||null}),n},{mock:t._mock}};
function initBizagi(){if(bizagi.loader.initialized==!1){setTimeout(initBizagi,100);return}bizagi=typeof bizagi!="undefined"?bizagi:{};bizagi.enableCustomizations=typeof BIZAGI_ENABLE_CUSTOMIZATIONS!="undefined"?BIZAGI_ENABLE_CUSTOMIZATIONS:!0;bizagi.enableTrace=typeof BIZAGI_ENABLE_LOG!="undefined"?BIZAGI_ENABLE_LOG:!0;bizagi.enableDebug=typeof BIZAGI_ENABLE_LOG!="undefined"?BIZAGI_ENABLE_LOG:!1;bizagi.enableChrono=typeof BIZAGI_ENABLE_LOG!="undefined"?BIZAGI_ENABLE_LOG:!0;bizagi.enableProfiler=typeof BIZAGI_ENABLE_PROFILER!="undefined"?BIZAGI_ENABLE_PROFILER:bizagi.readQueryString().enableProfiler==="true"?!0:!1;bizagi.services.ajax.logSuccess=typeof BIZAGI_ENABLE_LOG!="undefined"?BIZAGI_ENABLE_LOG:!0;bizagi.services.ajax.logSubmits=typeof BIZAGI_ENABLE_LOG!="undefined"?BIZAGI_ENABLE_LOG:!0;bizagi.proxyPrefix=typeof BIZAGI_PROXY_PREFIX!="undefined"?BIZAGI_PROXY_PREFIX:"";bizagi.UserPreferencesUrl=typeof BIZAGI_USER_PREFERENCES_PAGE!="undefined"?BIZAGI_USER_PREFERENCES_PAGE:"";BIZAGI_PATH_TO_BASE=typeof BIZAGI_PATH_TO_BASE!="undefined"?BIZAGI_PATH_TO_BASE:"";bizagi.resourceDefinitionLocation={custom:bizagi.loader.getResource("l10n","bizagi.custom.resources"),"default":bizagi.loader.getResource("l10n","bizagi.resources.default"),ja:bizagi.loader.getResource("l10n","bizagi.resources.ja"),en:bizagi.loader.getResource("l10n","bizagi.resources.en-us"),"en-us":bizagi.loader.getResource("l10n","bizagi.resources.en-us"),es:bizagi.loader.getResource("l10n","bizagi.resources.es"),"es-es":bizagi.loader.getResource("l10n","bizagi.resources.es"),"en-mobile":bizagi.loader.getResource("l10n","bizagi.resources.en-mobile")};typeof isWebpart=="boolean"&&isWebpart===!0?$.when($.read(bizagi.proxyPrefix+"Rest/Users/CurrentUser")).done(function(n){assignLanguage(n.language)}).fail(function(){assignLanguage()}):assignLanguage();bizagi.initialized=!0}function assignLanguage(n){n=n||bizagi.readQueryString().language;n=n||(typeof BIZAGI_LANGUAGE!="undefined"?BIZAGI_LANGUAGE:null);n=n||"default";bizagi.language=n;bizagi.localization=new bizagi.l10n(bizagi.resourceDefinitionLocation);bizagi.localization.setLanguage(bizagi.language);bizagi.templateService=new bizagi.templates.services.service(bizagi.localization);bizagi.util.isIE&&bizagi.util.isIE()&&bizagi.loader.loadFile({src:bizagi.getStyleSheet("common.ie7"),type:"css"});window.onerror=function(){bizagi.logError("Uncaught error",{message:arguments[0],file:arguments[1],line:arguments[2]})}}typeof Windows!="undefined"&&(jQuery.fn.nonSecureAppend=jQuery.fn.append,jQuery.fn.append=function(){var n=arguments,t=this;return MSApp.execUnsafeLocalFunction(function(){return jQuery.fn.nonSecureAppend.apply(t,n)})},jQuery.fn.nonSecureBefore=jQuery.fn.before,jQuery.fn.before=function(){var n=arguments,t=this;return MSApp.execUnsafeLocalFunction(function(){return jQuery.fn.nonSecureBefore.apply(t,n)})},jQuery.fn.nonSecureAfter=jQuery.fn.after,jQuery.fn.after=function(){var n=arguments,t=this;return MSApp.execUnsafeLocalFunction(function(){return jQuery.fn.nonSecureAfter.apply(t,n)})},jQuery.nonSecureClean=jQuery.clean,jQuery.clean=function(){var n=arguments,t=this;return MSApp.execUnsafeLocalFunction(function(){return jQuery.nonSecureClean.apply(t,n)})},jQuery.nonSecurereplaceWith=jQuery.fn.replaceWith,jQuery.fn.replaceWith=function(){var n=arguments,t=this;return MSApp.execUnsafeLocalFunction(function(){return jQuery.nonSecurereplaceWith.apply(t,n)})},jQuery.nonSecureinsertBefore=jQuery.fn.insertBefore,jQuery.fn.insertBefore=function(){var n=arguments,t=this;return MSApp.execUnsafeLocalFunction(function(){return jQuery.nonSecureinsertBefore.apply(t,n)})},jQuery.nonSecurebuildFragment=jQuery.buildFragment,jQuery.buildFragment=function(){var n=arguments,t=this;return MSApp.execUnsafeLocalFunction(function(){return jQuery.nonSecurebuildFragment.apply(t,n)})});$.expr.cacheLength=1;bizagi.initialized||initBizagi();bizagi.util.isIE8&&bizagi.util.isIE8()&&(Array.isArray||(Array.isArray=function(n){return Object.prototype.toString.call(n)==="[object Array]"||n instanceof Array}),Array.prototype.forEach||(Array.prototype.forEach=function(n,t){for(var r=this.length>>>0,i=0;i<r;i++)i in this&&n.call(t,this[i],i,this)}),Array.prototype.map||(Array.prototype.map=function(n){for(var i=this.length>>>0,r=new Array(i),u=arguments[1],t=0;t<i;t++)t in this&&(r[t]=n.call(u,this[t],t,this));return r}),Array.prototype.filter||(Array.prototype.filter=function(n){for(var i=[],r=arguments[1],t=0;t<this.length;t++)n.call(r,this[t])&&i.push(this[t]);return i}),Array.prototype.reduce||(Array.prototype.reduce=function(n){var r=this.length>>>0,t=0,i;if(r===0&&arguments.length===1)throw new TypeError;if(arguments.length>=2)i=arguments[1];else do{if(t in this){i=this[t++];break}if(++t>=r)throw new TypeError;}while(1);for(;t<r;t++)t in this&&(i=n.call(null,i,this[t],t,this));return i}),Array.prototype.indexOf||(Array.prototype.indexOf=function(n){var i=this.length,t=arguments[1]||0;if(!i||t>=i)return-1;for(t<0&&(t+=i);t<i;t++)if(Object.prototype.hasOwnProperty.call(this,t)&&n===this[t])return t;return-1}),Object.keys||(Object.keys=function(n){var t=[];for(var i in n)Object.prototype.hasOwnProperty.call(n,i)&&t.push(i);return t}));
Array.prototype.find||(Array.prototype.find=function(n){var t;if(this==null)throw new TypeError("Array.prototype.find called on null or undefined");if(typeof n!="function")throw new TypeError("predicate must be a function");var i=Object(this),u=i.length>>>0,f=arguments[1],r;for(t=0;t<u;t++)if(r=i[t],n.call(f,r,t,i))return r;return undefined});Array.prototype.reduce||(Array.prototype.reduce=function(n){var r=this.length,t,i;if(typeof n!="function")throw new TypeError;if(r==0&&arguments.length==1)throw new TypeError;if(t=0,arguments.length>=2)i=arguments[1];else do{if(t in this){i=this[t++];break}if(++t>=r)throw new TypeError;}while(1);for(;t<r;t++)t in this&&(i=n.call(null,i,this[t],t,this));return i}),function(n){var t={NS:"jquery.longclick-",delay:400};n.fn.longTouchs=function(i){var r=n.extend(t,i);return n(this).on("mouseup touchend touchcancel touchmove",function(t){clearTimeout(n(t.currentTarget).data("longClickTimer"))}).on("mousedown touchstart",function(t){n(t.currentTarget).data("longClick",!1);n(t.currentTarget).data("longClickTimer",setTimeout(function(t){n(t).data("longClick",!0);n(t).trigger("longTouch")},r.delay,t.currentTarget))}).on("click",function(t){n(t.currentTarget).data("longClick")&&t.stopImmediatePropagation()})}}(jQuery);
function isValidDate(n){if(typeof n!="undefined"){var t=new Date(n);return!isNaN(t.valueOf())}return!1}bizagi=typeof bizagi!="undefined"?bizagi:{};bizagi.util=typeof bizagi.util!="undefined"?bizagi.util:{};bizagi.util.smartphone=typeof bizagi.util.smartphone!="undefined"?bizagi.util.smartphone:{};bizagi.util.tablet=typeof bizagi.util.tablet!="undefined"?bizagi.util.tablet:{};bizagi.util.mobility=typeof bizagi.util.mobility!="undefined"?bizagi.util.mobility:{};bizagi.util.cases=typeof bizagi.util.cases!="undefined"?bizagi.util.cases:{};bizagi.util.cases.getStatusTimeLabel=function(n){var t={},r=new Date,e=r.getFullYear(),o=r.getMonth(),u=r.getDate();n=bizagi.util.isDate(n)?n:r;var i=new Date(n),s=i.getMonth(),h=i.getFullYear(),f=i.getDate(),c=new Date(h,s,f,0,0,0)-new Date(e,o,u,0,0,0);return c<0?(t.date=bizagi.util.dateFormatter.formatDate(new Date(i),"dd MMM"),t.type=bizagi.localization.getResource("workportal-taskfeed-overdue"),t.status="red"):u==f?(t.date=bizagi.util.dateFormatter.formatDate(new Date(i),"hh:mm"),t.type=bizagi.localization.getResource("workportal-taskfeed-today"),t.status="yellow"):u+1==f?(t.date=bizagi.util.dateFormatter.formatDate(new Date(i),"hh:mm"),t.type=bizagi.localization.getResource("workportal-taskfeed-tomorrow"),t.status="yellow"):(t.date=bizagi.util.dateFormatter.formatDate(new Date(i),"dd MMM"),t.type=bizagi.localization.getResource("workportal-taskfeed-upcomming"),t.status="green"),t};bizagi.util.detectDevice=function(){return bizagi.detectDevice()};bizagi.util.isMobileDevice=function(){var n=bizagi.detectDevice();return["smartphone_ios","smartphone_ios_native","smartphone_android","tablet","tablet_ios","tablet_ios_native","tablet_android"].indexOf(n)>-1};bizagi.util.isTabletDevice=function(){var n=bizagi.util.detectDevice();return["tablet","tablet_ios","tablet_ios_native","tablet_android"].indexOf(n)>-1};bizagi.util.isAndroidTabletDevice=function(){var n=bizagi.util.detectDevice();return bizagi.util.isTabletDevice()&&n.indexOf("android")!==-1};bizagi.util.isiOSTabletDevice=function(){var n=bizagi.util.detectDevice();return bizagi.util.isTabletDevice()&&n.indexOf("android")===-1};bizagi.util.isSmartphoneDevice=function(){var n=bizagi.util.detectDevice();return["smartphone_ios","smartphone_ios_native","smartphone_android"].indexOf(n)>-1};bizagi.util.isAndroidSmartphoneDevice=function(){var n=bizagi.util.detectDevice();return bizagi.util.isSmartphoneDevice()&&n.indexOf("android")!==-1};bizagi.util.isiOSSmartphoneDevice=function(){var n=bizagi.util.detectDevice();return bizagi.util.isSmartphoneDevice()&&n.indexOf("ios")!==-1};bizagi.util.formatECMDownloadURL=function(n){var t,i,r;return bizagi.util.isMobileBrowser()?(t=bizagi.loader.getPathUrl(n),i=bizagi.loader.getPathUrl(""),t.indexOf(i)!==-1?n:(r=bizagi.loader.getPathUrl("/"),t.replace(r,i))):n};bizagi.util.getAndroidVersion=function(){var t=navigator.userAgent.toLowerCase(),n=t.match(/android\s([0-9\.]*)/);return n?parseFloat(n[1]):!1};bizagi.util.isMobileBrowser=function(){var n=!1;return function(t){(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(t)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(t.substr(0,4)))&&(n=!0)}(navigator.userAgent||navigator.vendor||window.opera),n};bizagi.util.setKendoViewTitle=function(n,t){if(typeof n!="undefined"){var i=$(".km-navbar",n.header).data("kendoMobileNavBar");i&&(i.title(t),n.options.title=n.title=t)}};bizagi.util.processFailMessage=function(n){var t=n||{};try{t=typeof t=="string"?JSON.parse(t):t;t=t.responseText||t.message||t}catch(i){t=n}return t};bizagi.util.isValidResource=function(n){return bizagi.localization?bizagi.localization.getResource(n)!==n:!1};bizagi.util.media={uploadFile:function(n){var t=new $.Deferred,i=new FormData,r;return $.each(n.data,function(n,t){i.append(n,t)}),window.resolveLocalFileSystemURL(n.dataFile,function(u){u.file(function(r){var u=new FileReader;u.onloadend=function(){var u=new Blob([this.result],{type:r.type});i.append(n.data.h_xpath,u,r.name);$.ajax({url:n.properties.addUrl,type:"POST",contentType:!1,processData:!1,data:i}).done(function(n){t.resolve({response:n})}).fail(function(n){t.reject(n)})};u.readAsArrayBuffer(r)},r)},r),r=function(n){console.log("error uploading files",n)},t.promise()},checkFileTypes:function(n,t,i){var f=new RegExp("^.*\\.("+i.join("|")+")$","i"),r,u;return f.test(n.name)?t.validExtensions&&t.validExtensions.length>0&&(r=t.validExtensions.replaceAll("*.","").split(";"),!this.stringEndsWithValidExtension(n.name,r,!0))?(u=bizagi.localization.getResource("render-upload-allowed-extensions"),bizagi.showMessageBox(u+" "+t.validExtensions),!1):!0:(bizagi.showMessageBox(bizagi.localization.getResource("render-upload-error-extensions")),!1)},checkMaxSizeFile:function(n,t){return typeof t.maxSize=="undefined"||t.maxSize==null||t.maxSize===""?!0:typeof n!="undefined"?n.size===0?(bizagi.showMessageBox(bizagi.localization.getResource("render-upload-error-file-empty").replace("%s",n.name)),!1):n.size>=t.maxSize?(bizagi.showMessageBox(bizagi.localization.getResource("render-upload-alert-maxsize").replace("{0}",t.maxSize)),!1):!0:(bizagi.showMessageBox(bizagi.localization.getResource("render-required-upload").replace("#label#",t.displayName)),!1)},stringEndsWithValidExtension:function(n,t,i){if(i===!1&&n.length===0)return!0;for(var r=0,u=t.length;r<u;r++)if(t[r]==="*"||n.toLowerCase().endsWith(t[r].toLowerCase()))return!0;return!1},getImagePath:function(n){var t=n,r=bizagi.util.getAndroidVersion(),i;return r?(t.substring(0,21)==="content://com.android"&&r<=4.4&&(i=t.split("%3A"),i.length>1?t="content://media/external/images/media/"+i[1]:(i=t.split("/"),t="content://media/external/images/media/"+i[i.length-1])),t):t},checkMaxSize:function(n,t){var i=new $.Deferred;return(typeof t.maxSize=="undefined"||t.maxSize===null||t.maxSize==="")&&i.resolve(),window.resolveLocalFileSystemURL(n,function(n){n.file(function(n){n.size>=t.maxSize?(bizagi.showMessageBox(bizagi.localization.getResource("render-upload-alert-maxsize").replace("{0}",t.maxSize),"Error"),i.reject()):i.resolve(n)})}),i.promise()},checkMaxSizeVideo:function(n,t){var i=new $.Deferred,r=n[0].size;return(typeof t.maxSize=="undefined"||t.maxSize==null||t.maxSize==="")&&i.resolve(),r>=t.maxSize?(bizagi.showMessageBox(bizagi.localization.getResource("render-upload-alert-maxsize").replace("{0}",t.maxSize),"Error"),i.reject()):i.resolve(),i.promise()},hasExtension:function(n){if(!n)return!1;var t=bizagi.util.media.getFileExtension(n);return!bizagi.util.isEmpty(t)},getFileName:function(n){if(!n)return"";var t=n.substr(n.lastIndexOf("/")+1);return t?t:""},getFileExtension:function(n){if(!n)return"";var t=bizagi.util.media.getFileName(n),i=/[.]/.exec(t)?/[^.]+$/.exec(t):null;return i?"."+i.shift():""},getNativePath:function(n){var t=new $.Deferred,i=bizagi.util.detectDevice();return i.indexOf("android")&&!bizagi.util.media.hasExtension(n)&&bizagi.util.isCordovaSupported()?window.FilePath.resolveNativePath(n,function(n){t.resolve(n)},function(){t.reject(n)}):t.resolve(n),t.promise()},getFileDataInfo:function(n){return $.when(bizagi.util.media.getNativePath(n)).then(function(n){return{url:n,name:bizagi.util.media.getFileName(n),extension:bizagi.util.media.getFileExtension(n)}})},getImageResolution:function(n){var t={width:0,height:0};switch(n){case 1:t.width=320;t.height=240;break;case 2:t.width=640;t.height=480;break;case 3:t.width=1280;t.height=960}return t},fileAPISupported:function(){var t,n;if(this.fileAPISupportedResult===undefined){if(navigator.userAgent.match(/(Android (1.0|1.1|1.5|1.6|2.0|2.1))|(Windows Phone (OS 7|8.0))|(XBLWP)|(ZuneWP)|(w(eb)?OSBrowser)|(webOS)|(Kindle\/(1.0|2.0|2.5|3.0))/)||(t=bizagi.util.getAndroidVersion(),t&&t<5))return this.fileAPISupportedResult=!1,this.fileAPISupportedResult;n=document.createElement("input");n.type="file";n.style.display="none";document.getElementsByTagName("body")[0].appendChild(n);this.fileAPISupportedResult=!n.disabled;n.parentNode.removeChild(n)}return this.fileAPISupportedResult},downloadFile:function(n,t){if(bizagi.util.isNativePluginSupported())bizagiapp.openFileWebView({itemUrl:n});else if(bizagi.util.isCordovaSupported()&&cordova.plugins.fileOpener2){var i=function(t){cordova.plugins.fileOpener2.open(t.localURL,t.type,{error:function(i){var r=i.message,u;if(i.status===9){u=bizagi.localization.getResource("render-upload-error-no-file-opener").replace("%s",t.name);r=bizagi.util.isValidResource("render-upload-error-no-file-opener")?u:'There is no application set to open the document "'+t.name+'".';bizagi.showConfirmationBox(r,bizagi.localization.getResource("workportal-widget-admin-language-widget-download"),"",[{label:bizagi.localization.getResource("workportal-widget-admin-language-widget-download"),action:"resolve"},{label:bizagi.localization.getResource("confirmation-savebox-cancel"),action:"reject"}]).done(function(){window.open(n,"_system","location=yes")});return}bizagi.showMessageBox(r,"Error")},success:function(){bizagi.log("Success showed file "+t.name)}})},r=function(n){n.file(function(n){i(n)},function(n){console.error("Error in FileEntry.file",n)})},u=function(n,t){n.createWriter(function(i){i.onwriteend=function(){console.log("Successful file write...");r(n)};i.onerror=function(n){console.log("Failed file write: "+n.toString())};t||(t=new Blob(["some file data"],{type:"text/plain"}));i.write(t)})},f=function(n,t,i){$.ajax({url:i,type:"GET",dataType:"binary",processData:!1,success:function(i){n.getFile(t,{create:!0,exclusive:!1},function(n){u(n,i)},function(n){console.log("Error getFile",n)})}})},e=cordova.file.externalDataDirectory||cordova.file.dataDirectory||cordova.file.cacheDirectory;window.resolveLocalFileSystemURL(encodeURI(e),function(i){t||(t=n.split("/").pop().replace(/([\?#&]+)/g,"/").split("/").shift()||"downloaded-file");f(i,t,n)},function(n){bizagi.log("Error loading dir entry...",n)})}else window.open(n,"_system")}};bizagi.util.benchmack=function(n,t){var r=Math.pow(10,3),i;for(window.console.time(n),i=0;i<r;i++)t();window.console.timeEnd(n)};bizagi.util.languages={es:"es","es-ES":"es","es-AR":"es","es-BO":"es","es-Cl":"es","es-CO":"es","es-CR":"es","es-DO":"es","es-EC":"es","es-SV":"es","es-GT":"es","es-HN":"es","es-MX":"es","es-NI":"es","es-PA":"es","es-PY":"es","es-PR":"es","es-PE":"es","es-US":"es","es-UY":"es","es-VE":"es",en:"en-US","en-AU":"en-US","en-BZ":"en-US","en-CA":"en-US","en-029":"en-US","en-IN":"en-US","en-IE":"en-US","en-JM":"en-US","en-MY":"en-US","en-NZ":"en-US","en-PH":"en-US","en-SG":"en-US","en-ZA":"en-US","en-TT":"en-US","en-GB":"en-US","en-US":"en-US","en-ZW":"en-US",de:"de","de-AT":"de","de-DE":"de","de-LI":"de","de-LU":"de","de-CH":"de",fr:"fr","fr-BE":"fr","fr-CA":"fr","fr-LU":"fr","fr-MC":"fr","fr-CH":"fr","fr-FR":"fr",it:"it","it-IT":"it","it-CH":"it",ja:"ja","ja-JA":"ja","ja-JP":"ja",nl:"nl","nl-NL":"nl","nl-BE":"nl",pt:"pt-PT","pt-BR":"pt-PT","pt-PT":"pt-PT",ru:"ru","ru-RU":"ru",cs:"cs","cs-CZ":"cs",ar:"ar","ar-DZ":"ar","ar-BH":"ar","ar-EG":"ar","ar-IQ":"ar","ar-JO":"ar","ar-KW":"ar","ar-LB":"ar","ar-LY":"ar","ar-MA":"ar","ar-OM":"ar","ar-QA":"ar","ar-SA":"ar","ar-SY":"ar","ar-TN":"ar","ar-AE":"ar","ar-YE":"ar",zh:"zh","zh-HK":"zh","zh-MO":"zh","zh-CN":"zh","zh-Hans":"zh","zh-SG":"zh","zh-TW":"zh","zh-Hant":"zh"};bizagi.util.localeDate=function(n,t,i){if(typeof $.mobiscroll.i18n[i]!="undefined"){t.indexOf("tt")!==-1&&(t=t.replace("tt","a"));t.indexOf("MM")!==-1&&(t.indexOf("MMMM")!==-1?t=t.replace("MMMM","MM"):t.indexOf("MM")!==-1&&(t=t.replace("MM","mm")));t.indexOf("dddd")!==-1&&(t=t.replace("dddd","DD"));var r=$.mobiscroll.formatDate(t,n,$.mobiscroll.i18n[i]);return bizagi.util.convertHexNCR2Char(r)}return n};bizagi.util.convertHexNCR2Char=function(n){return n.replace(/&#x([A-Fa-f0-9]{1,6});/g,function(n,t){return bizagi.util.hex2char(t)})};bizagi.util.hex2char=function(n){var i="",t=parseInt(n,16);return t<=65535?i+=String.fromCharCode(t):t<=1114111?(t-=65536,i+=String.fromCharCode(55296|t>>10)+String.fromCharCode(56320|t&1023)):i+="hex2Char error: Code point out of range",i};bizagi.util.parseBoolean=function(n){return n===undefined?null:n===null?null:n===""?null:n===!0||n===1||n.toString()==="true"?!0:n.toString().toLowerCase()==="true"?!0:n!==null&&n===!1||n===0||n.toString()==="false"?!1:n.toString().toLowerCase()==="false"?!1:null};bizagi.util.monthNames=["January","February","March","April","May","June","July","August","September","October","November","December","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];bizagi.util.dayNames=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sun","Mon","Tue","Wed","Thu","Fri","Sat"];bizagi.util.dateFormatter=new function(){this.LZ=function(n){return(n<0||n>9?"":"0")+n};this.isDate=function(n,t){var i=this.getDateFromFormat(n,t);return i==0?!1:!0};this.getRelativeTime=function(n,t,i){function f(n,t,i,r){var u=(n/i).toFixed(0),f;return u>0?r?u==1?bizagi.localization.getResource("workportal-relativetime-"+t).replace("%s",u):bizagi.localization.getResource("workportal-relativetime-"+t+"s").replace("%s",u):(f=bizagi.localization.getResource("workportal-relativetime-ago"),u==1?f.replace("%s",bizagi.localization.getResource("workportal-relativetime-"+t).replace("%s",u)):f.replace("%s",bizagi.localization.getResource("workportal-relativetime-"+t+"s").replace("%s",u))):null}var s=this,e=new Date,o=n instanceof Date?n:kendo.parseDate(n,t),u=e.getTime()-o.getTime(),r=f(u,"year",31536e6,i);return r||(r=f(u,"month",2628e6,i),r||(r=f(u,"week",6048e5,i),r||(r=f(u,"day",864e5,i),r||(r=f(u,"hour",36e5,i),r||(r=f(u,"minute",6e4,i),r||(i?r=u===0?f(u+1,"minute",1,i):f(u,"minute",1,i):(r=f(u,"second",2e3,i),r||(r=bizagi.localization.getResource("workportal-relativetime-momentago"))))))))),r};this.compareDates=function(n,t,i,r){var u=getDateFromFormat(n,t),f=getDateFromFormat(i,r);return u==0||f==0?-1:u>f?1:0};this.getDifferenceBetweenDates=function(n,t,i){if(n instanceof Date&&n instanceof Date)switch(i){case"seconds":return(t.getTime()-n.getTime())/1e3;case"milliseconds":return t.getTime()-n.getTime();default:return"unit is not Defined"}else return"one param not is Date"};this.formatDate=function(n,t,i){var o,f,v,y;if(!isValidDate(n)||n==0)return"";o=bizagi.util.monthNames;f=bizagi.util.dayNames;t=t+"";var l="",s=0,p,h,e=n.getFullYear()+"",c=n.getMonth()+1,w=n.getDate(),a=n.getDay(),u=n.getHours(),b=n.getMinutes(),k=n.getSeconds(),d=n.getMilliseconds(),r={};for(bizagi.util.isValidResource("datePickerRegional")&&(i=bizagi.localization.getResource("datePickerRegional")),i&&(v=i.monthNames.concat(i.monthNamesShort),y=i.dayNames.concat(i.dayNamesShort),o=o.toString()===v.toString()?o:v,f=f.toString()===y.toString()?f:y),(e.length<4||e.charAt(0)==="-"&&e.length<5)&&(e=""+(+e+1900)),r.y=""+e,r.yyyy=e,r.yy=e.substring(2,4),r.M=c,r.MM=this.LZ(c),r.MMM=o[c+11],r.MMMM=o[c-1],r.NNN=o[c+11],r.d=w,r.dd=this.LZ(w),r.ddd=f[a+7],r.dddd=f[a],r.E=f[a+7],r.EE=f[a],r.H=u,r.HH=this.LZ(u),r.tt=u<12?"am":"pm",r.TT=u<12?"AM":"PM",r.h=u==0?12:u>12?u-12:u,r.hh=this.LZ(r.h),r.K=u>11?u-12:u,r.k=u+1,r.KK=this.LZ(r.K),r.kk=this.LZ(r.k),r.a=u>11?"PM":"AM",r.m=b,r.mm=this.LZ(b),r.s=k,r.ss=this.LZ(k),r.FFF=d;s<t.length;){for(p=t.charAt(s),h="";t.charAt(s)==p&&s<t.length;)h+=t.charAt(s++);l=r[h]!=null?l+r[h]:l+h}return l};this.getDateFromFormat=function(n,t,i){function ft(n){for(var i="1234567890",t=0;t<n.length;t++)if(i.indexOf(n.charAt(t))==-1)return!1;return!0}function s(n,t,i,r){for(var f,u=r;u>=i;u--){if(f=n.substring(t,t+u),f.length<i)return null;if(ft(f))return f}return null}var y=bizagi.util.monthNames,p=bizagi.util.dayNames,it,rt,v,g,nt,tt;n=n+"";t=t+"";var u=0,w=0,ut,r,b=0,k=0,c=new Date,o=c.getYear(),e=c.getMonth()+1,h=1,f=c.getHours(),l=c.getMinutes(),a=c.getSeconds(),et=c.getMilliseconds(),d="";for(bizagi.util.isValidResource("datePickerRegional")&&(i=bizagi.localization.getResource("datePickerRegional")),i&&(it=i.monthNames.concat(i.monthNamesShort),rt=i.dayNames.concat(i.dayNamesShort),y=y.toString()===it.toString()?y:it,p=p.toString()===rt.toString()?p:rt);w<t.length;){for(ut=t.charAt(w),r="";t.charAt(w)==ut&&w<t.length;)r+=t.charAt(w++);if(r=="yyyy"||r=="yy"||r=="y"){if(r=="yyyy"&&(b=4,k=4),r=="yy"&&(b=2,k=2),r=="y"&&(b=2,k=4),o=s(n,u,b,k),o==null)return 0;u+=o.length;o.length==2&&(o=o>70?1900+ +o:2e3+ +o)}else if(r=="MMMM"||r=="MMM"||r=="NNN"){for(e=0,v=0;v<y.length;v++)if(g=y[v],n.substring(u,u+g.length).toLowerCase()==g.toLowerCase()&&(r=="MMMM"||r=="MMM"||r=="NNN"&&v>11)){e=v+1;e>12&&(e-=12);u+=g.length;break}if(e<1||e>12)return 0}else if(r=="dddd"||r=="EE"||r=="E"){for(nt=0;nt<p.length;nt++)if(tt=p[nt],n.substring(u,u+tt.length).toLowerCase()==tt.toLowerCase()){u+=tt.length;break}}else if(r=="MM"||r=="M"){if(e=s(n,u,1,2),e==null||e<1||e>12)return 0;u+=e.length}else if(r=="dd"||r=="d"){if(h=s(n,u,1,2),h==null||h<1||h>31)return 0;u+=h.length}else if(r=="hh"||r=="h"){if(f=s(n,u,r.length,2),f==null||f<1||f>12)return 0;u+=f.length}else if(r=="HH"||r=="H"){if(f=s(n,u,r.length,2),f==null||f<0||f>23)return 0;u+=f.length}else if(r=="KK"||r=="K"){if(f=s(n,u,r.length,2),f==null||f<0||f>11)return 0;u+=f.length}else if(r=="kk"||r=="k"){if(f=s(n,u,r.length,2),f==null||f<1||f>24)return 0;u+=f.length;f--}else if(r=="mm"||r=="m"){if(l=s(n,u,r.length,2),l==null||l<0||l>59)return 0;u+=l.length}else if(r=="ss"||r=="s"){if(a=s(n,u,r.length,2),a==null||a<0||a>59)return 0;u+=a.length}else if(r=="FFF"){if(ff=s(n,u,r.length,3),ff==null||ff<0||ff>999)return 0;u+=ff.length}else if(r=="a"){if(n.substring(u,u+2).toLowerCase()=="am")d="AM";else if(n.substring(u,u+2).toLowerCase()=="pm")d="PM";else return 0;u+=2}else{if(n.substring(u,u+r.length)!=r)return 0;u+=r.length}}if(e==2)if(o%4==0&&o%100!=0||o%400==0){if(h>29)return 0}else if(h>28)return 0;return(e==4||e==6||e==9||e==11)&&h>30?0:(f<12&&d=="PM"?f=+f+12:f>11&&d=="AM"&&(f-=12),new Date(o,e-1,h,f,l,a))};this.parseDate=function(n){for(var u,t,f=arguments.length==2?arguments[1]:!1,e=["M/d/y","M-d-y","M.d.y","MMM-d","M/d","M-d"],o=["d/M/y","d-M-y","d.M.y","d-MMM","d/M","d-M"],s=[["y-M-d","MMM d, y","MMM d,y","y-MMM-d","d-MMM-y","MMM d"],f?o:e,f?e:o],i,r=0;r<s.length;r++)for(u=window[s[r]],t=0;t<u.length;t++)if(i=getDateFromFormat(n,u[t]),i!=0)return new Date(i);return null};this.analyzeTimeFormat=function(n){for(var r=0,f,u={show24Hours:!1,showSeconds:!1,separator:":"},t,i="";r<n.length;){for(f=n.charAt(r),t="";n.charAt(r)==f&&r<n.length;)t+=n.charAt(r++);t=="hh"||t=="h"?(i=t,u.show24Hours=!1):t=="HH"||t=="H"?(i=t,u.show24Hours=!0):t=="mm"||t=="m"?i=t:t=="ss"||t=="s"?(i=t,u.showSeconds=!0):t=="a"?i=t:(i.toUpperCase()=="H"||i.toUpperCase()=="HH")&&(u.separator=t)}return u};this.getDateFromInvariant=function(n,t){var i,r;return n=n==null?"":n,n=typeof n!="string"?n.toString():n,i="MM/dd/yyyy"+(t?" H:mm:ss":""),t&&n&&(n.toLowerCase().indexOf("am")>0||n.toLowerCase().indexOf("pm")>0)&&(i="MM/dd/yyyy h:mm:ss a"),r=bizagi.util.dateFormatter.getDateFromFormat(n,i),r!=0||t?r==0&&t&&n!=null&&n!=""&&(i="MM/dd/yyyy",r=bizagi.util.dateFormatter.getDateFromFormat(n,i),r.setHours(0,0,0,0)):(i="MM/dd/yyyy H:mm:ss",r=bizagi.util.dateFormatter.getDateFromFormat(n,i)),r};this.formatInvariant=function(n,t){var i="MM/dd/yyyy"+(t?" HH:mm:ss":"");return bizagi.util.dateFormatter.formatDate(n,i)};this.getDateFromISO=function(n,t){var i="yyyy-MM-dd"+(t?" HH:mm":""),r=bizagi.util.dateFormatter.getDateFromFormat(n,i);return r==0&&t&&(i="yyyy-MM-dd"+(t?" HH:mm:ss":""),r=bizagi.util.dateFormatter.getDateFromFormat(n,i)),r!=0||t||(i="yyyy-MM-dd HH:mm",r=bizagi.util.dateFormatter.getDateFromFormat(n,i),r==0&&(i="yyyy-MM-dd HH:mm:ss",r=bizagi.util.dateFormatter.getDateFromFormat(n,i))),r};this.formatISO=function(n,t){var i="yyyy-MM-dd"+(t?" HH:mm":"");return bizagi.util.dateFormatter.formatDate(n,i)};this.sleep=function(n){for(var t=(new Date).getTime();(new Date).getTime()<t+n;);};this.getDateFormatByDatePickerJqueryUI=function(){return bizagi.localization.getResource("dateFormat").replace("yyyy","yy")}};bizagi.util.uniqueID=function(){return Math.floor(Math.random()*+new Date).toString()};bizagi.util.showNotification=function(n){function f(n){switch(n){case"info":return n+" bz-information-icon";case"warning":return n+" bz-ontime-normal";case"error":return n+" bz-overdue-normal";case"success":return n+" bz-upcoming-normal";default:return n+" bz-workonit"}}n=n||{};var r=window.document,i=n.type||"default",u=kendo.template("<div id='#=data.id#' class='sync-notification-offline-container bz-mo-icon #=data.icon#'>    <span class='sync-notification-offline-title #=data.type#'>#=data.title#<\/span><\/div>",{useWithBlock:!1}),t=$(u({id:Math.floor(Date.now()/1e3),icon:f(i),type:i,title:n.text||""}));t.appendTo($("body",r));typeof bizagi.kendoMobileApplication!="undefined"&&bizagiLoader().stop();t.fadeIn(1500,function(){t.stop()});t.fadeOut(2e3,function(){t.remove()})};bizagi.util.isOfflineForm=function(n){var t,f;if(!bizagi.util.isTabletDevice()||typeof n=="undefined")return!1;var i=n.context||null,r=n.container||null,u=r!==null?r:i!==null?i.getFormContainer():null;return u===null?!1:(t=u.getParams()||{},f=typeof t.isOfflineForm!="undefined"&&bizagi.util.parseBoolean(t.isOfflineForm),f)};bizagi.util.inputTray=function(n){var t="inbox";return bizagi.util.isTabletDevice()&&bizagi.util.hasOfflineFormsEnabled()?(t=bizagi.util.getItemLocalStorage("inputtray"),t==null?n?"inbox":"true":!n&&t==="inbox"?"true":t):t};bizagi.util.isAndroid=function(){return navigator.userAgent.toLowerCase().indexOf("android")>-1};Date.prototype.toISOStringHM||function(){function n(n){return n<10?"0"+n:n}Date.prototype.toISOStringHM=function(){var t=this.getTimezoneOffset(),i=t>=0;return t=i?t:t*-1,this.getFullYear()+"-"+n(this.getMonth()+1)+"-"+n(this.getDate())+"T"+n(this.getHours())+":"+n(this.getMinutes())+":"+n(this.getSeconds())+(i?"-":"+")+n((t/60).toFixed(0))+":"+n(t%60)}}();String.prototype.startsWith||(String.prototype.startsWith=function(n,t){return t=t||0,this.indexOf(n,t)===t});String.prototype.endsWith||(String.prototype.endsWith=function(n,t){var i=this.toString(),r;return(typeof t!="number"||!isFinite(t)||Math.floor(t)!==t||t>i.length)&&(t=i.length),t-=n.length,r=i.indexOf(n,t),r!==-1&&r===t});[].find||(Array.prototype.find=function(n){var t;if(this==null)throw new TypeError("Array.prototype.find called on null or undefined");if(typeof n!="function")throw new TypeError("predicate must be a function");var i=Object(this),u=i.length>>>0,f=arguments[1],r;for(t=0;t<u;t++)if(r=i[t],n.call(f,r,t,i))return r;return undefined});bizagi.version={compare:function(n,t){for(var r=(n+"").split("."),u=(t+"").split("."),i=0,f=Math.max(r.length,u.length);i<f;i++){if(r[i]&&!u[i]&&parseInt(r[i])>0||parseInt(r[i])>parseInt(u[i]))return 1;if(u[i]&&!r[i]&&parseInt(u[i])>0||parseInt(r[i])<parseInt(u[i]))return-1}return 0},scope:{actual:function(){return"1.0.0"},validate:function(n,t){return t&&bizagi.loader.channel?n&&t===bizagi.loader.channel:n},equalsTo:function(n,t){var i=bizagi.version.compare(this.actual(),n)==0;return this.validate(i,t)},notEqualsTo:function(n,t){var i=bizagi.version.compare(this.actual(),n)!=0;return t&&console.warn('The parameter "channel" will be ignored. Please be carefull.'),this.validate(i)},greaterThan:function(n,t){var i=bizagi.version.compare(this.actual(),n)>0;return this.validate(i,t)},lessThan:function(n,t){var i=bizagi.version.compare(this.actual(),n)<0;return this.validate(i,t)},greaterThanOrEqualsTo:function(n,t){var i=bizagi.version.compare(this.actual(),n)>=0;return this.validate(i,t)},lessThanOrEqualsTo:function(n,t){var i=bizagi.version.compare(this.actual(),n)<=0;return this.validate(i,t)},between:function(n,t,i){var r,u;return bizagi.version.compare(n,t)==1&&(r=n,n=t,t=r),u=bizagi.version.compare(this.actual(),n)>0&&bizagi.version.compare(this.actual(),t)<0,this.validate(u,i)},notBetween:function(n,t,i){return i&&console.warn('The parameter "channel" will be ignored. Please be carefull.'),!this.between(n,t)},betweenOrEqualsTo:function(n,t,i){var r,u;return bizagi.version.compare(n,t)==1&&(r=n,n=t,t=r),u=bizagi.version.compare(this.actual(),n)>=0&&bizagi.version.compare(this.actual(),t)<=0,this.validate(u,i)},notBetweenOrEqualsTo:function(n,t,i){return i&&console.warn('The parameter "channel" will be ignored. Please be carefull.'),!this.betweenOrEqualsTo(n,t)}}};bizagi.version.server=$.extend({},bizagi.version.scope,{actual:function(){return typeof BIZAGI_SERVER_VERSION!="undefined"&&!bizagi.util.isEmpty(BIZAGI_SERVER_VERSION)?BIZAGI_SERVER_VERSION:bizagi.loader.version}});bizagi.version.client=$.extend({},bizagi.version.scope,{actual:function(){return bizagi.loader.version}});bizagi.util.hasOfflineFormsEnabled=function(){return typeof BIZAGI_ENABLE_OFFLINE_FORMS!="undefined"&&bizagi.util.parseBoolean(BIZAGI_ENABLE_OFFLINE_FORMS)===!0};bizagi.util.isFlatDesignEnabled=function(){return typeof BIZAGI_ENABLE_FLAT!="undefined"&&bizagi.util.parseBoolean(BIZAGI_ENABLE_FLAT)===!0};bizagi.util.isMobileGridEnabled=function(){return typeof BIZAGI_ENABLE_MOBILE_GRID!="undefined"&&bizagi.util.parseBoolean(BIZAGI_ENABLE_MOBILE_GRID)===!0};bizagi.util.isNativeHeaderEnabled=function(){return typeof NATIVE_HEADER_ENABLE!="undefined"&&bizagi.util.parseBoolean(NATIVE_HEADER_ENABLE)===!0};bizagi.util.isQuickSearchEnabled=function(){return typeof BIZAGI_ENABLE_QUICK_SEARCH!="undefined"&&bizagi.util.parseBoolean(BIZAGI_ENABLE_QUICK_SEARCH)===!0};bizagi.util.isOAuth2Enabled=function(){return typeof BIZAGI_AUTH_TYPE!="undefined"&&BIZAGI_AUTH_TYPE==="OAuth"};bizagi.util.getNativeComponent=function(){return typeof BIZAGI_NATIVE_COMPONENT!="undefined"?BIZAGI_NATIVE_COMPONENT:""};bizagi.util.isVersionSupported=function(){var t=!0,n;return typeof BIZAGI_SERVER_VERSION=="undefined"||bizagi.util.isEmpty(BIZAGI_SERVER_VERSION)||(n=BIZAGI_SERVER_VERSION.match(/\d+\.\d+/),t=n?parseFloat(n.shift())>=11:!0),t};bizagi.util.getChannelType=function(){return typeof BIZAGI_SERVER_CHANNEL!="undefined"&&!bizagi.util.isEmpty(BIZAGI_SERVER_CHANNEL)?BIZAGI_SERVER_CHANNEL:bizagi.loader.channel||""};bizagi.util.isCordovaSupported=function(){return typeof cordova!="undefined"};bizagi.util.isNativePluginSupported=function(){return typeof bizagiapp!="undefined"};bizagi.util.isTabletNativeSupported=function(){return typeof bizagiapp!="undefined"&&bizagi.util.isTabletDevice()};bizagi.util.isSmartphoneNativeSupported=function(){return typeof bizagiapp!="undefined"&&bizagi.util.isSmartphoneDevice()};bizagi.util.isIE=function(){return navigator.appName.indexOf("Internet Explorer")>0||!!navigator.userAgent.match(/Trident/)};bizagi.util.isIE8=function(){return bizagi.util.isIE()&&document.documentMode==8};bizagi.util.isIE9=function(){return bizagi.util.isIE()&&document.documentMode==9};bizagi.util.isIE10=function(){return bizagi.util.isIE()&&document.documentMode==10};bizagi.util.isIE11=function(){return!!navigator.userAgent.match(/Trident\/7.0/)&&!navigator.userAgent.match(/MSIE/i)};bizagi.util.isIphoneHigherIOS5=function(){return this.value!=undefined?this.value:this.value=RegExp("OS\\s*(5|6|7|8)_*\\d").test(navigator.userAgent)&&RegExp(" AppleWebKit/").test(navigator.userAgent)};bizagi.util.isLessThanIOS5=function(){return navigator.userAgent.match(new RegExp(/CPU OS (1|2|3|4)/i))?!0:!1};bizagi.util.isIphoneAndLessIOS6=function(){return this.value!=undefined?this.value:this.value=RegExp("OS\\s*(4|5|6)_*\\d").test(navigator.userAgent)&&RegExp(" AppleWebKit/").test(navigator.userAgent)};bizagi.util.getInternetExplorerVersion=function(){return bizagi.util.isIE()?Number(document.documentMode):-1};bizagi.util.decodeURI=function(n){n=n||"";for(var i=!1,t=n,r;!i;)try{r=decodeURI(t);r==t?i=!0:t=r}catch(u){i=!0}return t};bizagi.util.hasScroll=function(n,t){n.length&&(n=n[0]);t=t==="vertical"?"scrollTop":"scrollLeft";var i=!!n[t];return i||(n[t]=1,i=!!n[t],n[t]=0),i};bizagi.util.isNativePluginSupported()&&window.cordova&&window.cordova.plugins.Keyboard&&cordova.plugins.Keyboard.hideKeyboardAccessoryBar(!1);
(function(n,t){function u(n){for(var i in n)if(l[n[i]]!==t)return!0;return!1}function f(i,u,f){var e=i;return"object"==typeof u?i.each(function(){r[this.id]&&r[this.id].destroy();new n.mobiscroll.classes[u.component||"Scroller"](this,u)}):("string"==typeof u&&i.each(function(){var n;if((n=r[this.id])&&n[u]&&(n=n[u].apply(this,Array.prototype.slice.call(f,1)),n!==t))return e=n,!1}),e)}function h(n){if(e.tapped&&!n.tap)return n.stopPropagation(),n.preventDefault(),!1}var e,c=+new Date,r={},i=n.extend,l=document.createElement("modernizr").style,o=u(["perspectiveProperty","WebkitPerspective","MozPerspective","OPerspective","msPerspective"]),a=u(["flex","msFlex","WebkitBoxDirection"]),s=function(){var n=["Webkit","Moz","O","ms"];for(var t in n)if(u([n[t]+"Transform"]))return"-"+n[t].toLowerCase()+"-";return""}(),v=s.replace(/^\-/,"").replace(/\-$/,"").replace("moz","Moz");n.fn.mobiscroll=function(t){return i(this,n.mobiscroll.components),f(this,t,arguments)};e=n.mobiscroll=n.mobiscroll||{version:"2.16.1",util:{prefix:s,jsPrefix:v,has3d:o,hasFlex:a,testTouch:function(t,i){if("touchstart"==t.type)n(i).attr("data-touch","1");else if(n(i).attr("data-touch"))return n(i).removeAttr("data-touch"),!1;return!0},objectToArray:function(n){var t=[];for(var i in n)t.push(n[i]);return t},arrayToObject:function(n){var i={},t;if(n)for(t=0;t<n.length;t++)i[n[t]]=n[t];return i},isNumeric:function(n){return 0<=n-parseFloat(n)},isString:function(n){return"string"==typeof n},getCoord:function(n,t,i){var r=n.originalEvent||n,t=(i?"client":"page")+t;return r.changedTouches?r.changedTouches[0][t]:n[t]},getPosition:function(i,r){var f=window.getComputedStyle?getComputedStyle(i[0]):i[0].style,u,e;return o?(n.each(["t","webkitT","MozT","OT","msT"],function(n,i){if(f[i+"ransform"]!==t)return u=f[i+"ransform"],!1}),u=u.split(")")[0].split(", "),e=r?u[13]||u[5]:u[12]||u[4]):e=r?f.top.replace("px",""):f.left.replace("px",""),e},constrain:function(n,t,i){return Math.max(t,Math.min(n,i))},vibrate:function(n){"vibrate"in navigator&&navigator.vibrate(n||50)}},tapped:0,autoTheme:"mobiscroll",presets:{scroller:{},numpad:{},listview:{},menustrip:{}},themes:{form:{},frame:{},listview:{},menustrip:{}},i18n:{},instances:r,classes:{},components:{},defaults:{context:"body",mousewheel:!0,vibrate:!0},setDefaults:function(n){i(this.defaults,n)},presetShort:function(n,r,u){this.components[n]=function(e){return f(this,i(e,{component:r,preset:!1===u?t:n}),arguments)}}};n.mobiscroll.classes.Base=function(t,u){var a,s,e,v,o,l,h=n.mobiscroll,f=this;f.settings={};f._presetLoad=function(){};f._init=function(n){e=f.settings;i(u,n);f._hasDef&&(l=h.defaults);i(e,f._defaults,l,u);f._hasTheme&&(o=e.theme,"auto"!=o&&o||(o=h.autoTheme),"default"==o&&(o="mobiscroll"),u.theme=o,v=h.themes[f._class][o]);f._hasLang&&(a=h.i18n[e.lang]);f._hasTheme&&f.trigger("onThemeLoad",[a,u]);i(e,v,a,l,u);f._hasPreset&&(f._presetLoad(e),s=h.presets[f._class][e.preset])&&(s=s.call(t,f),i(e,s,u))};f._destroy=function(){f.trigger("onDestroy",[]);delete r[t.id];f=null};f.trigger=function(i,r){var e;return r.push(f),n.each([l,v,s,u],function(n,u){u&&u[i]&&(e=u[i].apply(t,r))}),e};f.option=function(n,t){var i={};"object"==typeof n?i=n:i[n]=t;f.init(i)};f.getInst=function(){return f};u=u||{};t.id||(t.id="mobiscroll"+ ++c);r[t.id]=f};document.addEventListener&&n.each(["mouseover","mousedown","mouseup","click"],function(n,t){document.addEventListener(t,h,!0)})})(jQuery),function(n){n.mobiscroll.i18n.de={setText:"OK",cancelText:"Abbrechen",clearText:"Löschen",selectedText:"ausgewählt",dateFormat:"dd.mm.yy",dateOrder:"ddmmyy",dayNames:"Sonntag,Montag,Dienstag,Mittwoch,Donnerstag,Freitag,Samstag".split(","),dayNamesShort:"So,Mo,Di,Mi,Do,Fr,Sa".split(","),dayNamesMin:"S,M,D,M,D,F,S".split(","),dayText:"Tag",delimiter:".",hourText:"Stunde",minuteText:"Minuten",monthNames:"Januar,Februar,März,April,Mai,Juni,Juli,August,September,Oktober,November,Dezember".split(","),monthNamesShort:"Jan,Feb,Mär,Apr,Mai,Jun,Jul,Aug,Sep,Okt,Nov,Dez".split(","),monthText:"Monat",secText:"Sekunden",timeFormat:"HH:ii",timeWheels:"HHii",yearText:"Jahr",nowText:"Jetzt",pmText:"nachm.",amText:"vorm.",firstDay:1,dateText:"Datum",timeText:"Zeit",calendarText:"Kalender",closeText:"Schließen",fromText:"Von",toText:"Um",wholeText:"Ganze Zahl",fractionText:"Bruchzahl",unitText:"Maßeinheit",labels:"Jahre,Monate,Tage,Stunden,Minuten,Sekunden,".split(","),labelsShort:"Yrs,Mths,Days,Hrs,Mins,Secs,".split(","),startText:"Starten",stopText:"Stoppen",resetText:"Zurücksetzen",lapText:"Lap",hideText:"Ausblenden",backText:"Zurück",undoText:"Rückgängig machen",offText:"Aus",onText:"Ein"}}(jQuery),function(n){n.mobiscroll.i18n.es={setText:"Aceptar",cancelText:"Cancelar",clearText:"Claro",selectedText:"seleccionado",selectedPluralText:"seleccionados",dateFormat:"dd/mm/yy",dateOrder:"ddmmyy",dayNames:"Domingo,Lunes,Martes,Mi&#xE9;rcoles,Jueves,Viernes,S&#xE1;bado".split(","),dayNamesShort:"Do,Lu,Ma,Mi,Ju,Vi,S&#xE1;".split(","),dayNamesMin:"D,L,M,M,J,V,S".split(","),dayText:"D&#237;a",hourText:"Horas",minuteText:"Minutos",monthNames:"Enero,Febrero,Marzo,Abril,Mayo,Junio,Julio,Agosto,Septiembre,Octubre,Noviembre,Diciembre".split(","),monthNamesShort:"Ene,Feb,Mar,Abr,May,Jun,Jul,Ago,Sep,Oct,Nov,Dic".split(","),monthText:"Mes",secText:"Segundos",timeFormat:"HH:ii",timeWheels:"HHii",yearText:"A&ntilde;o",nowText:"Ahora",pmText:"pm",amText:"am",dateText:"Fecha",timeText:"Tiempo",calendarText:"Calendario",closeText:"Cerrar",fromText:"Iniciar",toText:"Final",wholeText:"Entero",fractionText:"Fracción",unitText:"Unidad",labels:"Años,Meses,Días,Horas,Minutos,Segundos,".split(","),labelsShort:"Yrs,Mths,Days,Hrs,Mins,Secs,".split(","),startText:"Iniciar",stopText:"Deténgase",resetText:"Reinicializar",lapText:"Lap",hideText:"Esconder",backText:"Espalda",undoText:"Deshacer",offText:"No",onText:"Sí"}}(jQuery),function(n){n.mobiscroll.i18n.fr={setText:"Terminer",cancelText:"Annuler",clearText:"Effacer",selectedText:"sélectionné",selectedPluralText:"sélectionnés",dateFormat:"dd/mm/yy",dateOrder:"ddmmyy",dayNames:"&#68;imanche,Lundi,Mardi,Mercredi,Jeudi,Vendredi,Samedi".split(","),dayNamesShort:"&#68;im.,Lun.,Mar.,Mer.,Jeu.,Ven.,Sam.".split(","),dayNamesMin:"&#68;,L,M,M,J,V,S".split(","),dayText:"Jour",monthText:"Mois",monthNames:"Janvier,Février,Mars,Avril,Mai,Juin,Juillet,Août,Septembre,Octobre,Novembre,Décembre".split(","),monthNamesShort:"Janv.,Févr.,Mars,Avril,Mai,Juin,Juil.,Août,Sept.,Oct.,Nov.,Déc.".split(","),hourText:"Heures",minuteText:"Minutes",secText:"Secondes",timeFormat:"HH:ii",timeWheels:"HHii",yearText:"Année",nowText:"Maintenant",pmText:"après-midi",amText:"avant-midi",firstDay:1,dateText:"Date",timeText:"Heure",calendarText:"Calendrier",closeText:"Fermer",fromText:"Démarrer",toText:"Fin",wholeText:"Entier",fractionText:"Fraction",unitText:"Unité",labels:"Ans,Mois,Jours,Heures,Minutes,Secondes,".split(","),labelsShort:"Yrs,Mths,Days,Hrs,Mins,Secs,".split(","),startText:"Démarrer",stopText:"Arrêter",resetText:"Réinitialiser",lapText:"Lap",hideText:"Cachez",backText:"Arrière",undoText:"Défaire",offText:"Non",onText:"Oui"}}(jQuery),function(n){n.mobiscroll.i18n.it={setText:"OK",cancelText:"Annulla",clearText:"Chiarire",selectedText:"selezionato",selectedPluralText:"selezionati",dateFormat:"dd-mm-yyyy",dateOrder:"ddmmyy",dayNames:"Domenica,Luned&Igrave;,Merted&Igrave;,Mercoled&Igrave;,Gioved&Igrave;,Venerd&Igrave;,Sabato".split(","),dayNamesShort:"Do,Lu,Ma,Me,Gi,Ve,Sa".split(","),dayNamesMin:"D,L,M,M,G,V,S".split(","),dayText:"Giorno",hourText:"Ore",minuteText:"Minuti",monthNames:"Gennaio,Febbraio,Marzo,Aprile,Maggio,Giugno,Luglio,Agosto,Settembre,Ottobre,Novembre,Dicembre".split(","),monthNamesShort:"Gen,Feb,Mar,Apr,Mag,Giu,Lug,Ago,Set,Ott,Nov,Dic".split(","),monthText:"Mese",secText:"Secondi",timeFormat:"HH:ii",timeWheels:"HHii",yearText:"Anno",nowText:"Ora",pmText:"pm",amText:"am",firstDay:1,dateText:"Data",timeText:"Volta",calendarText:"Calendario",closeText:"Chiudere",fromText:"Inizio",toText:"Fine",wholeText:"Intero",fractionText:"Frazione",unitText:"Unità",labels:"Anni,Mesi,Giorni,Ore,Minuti,Secondi,".split(","),labelsShort:"Yrs,Mths,Days,Hrs,Mins,Secs,".split(","),startText:"Inizio",stopText:"Arresto",resetText:"Ripristina",lapText:"Lap",hideText:"Nascondi",backText:"Indietro",undoText:"Annulla",offText:"Via",onText:"Su"}}(jQuery),function(n){n.mobiscroll.i18n.zh={setText:"确定",cancelText:"取消",clearText:"明确",selectedText:"选",dateFormat:"yy/mm/dd",dateOrder:"yymmdd",dayNames:"周日,周一,周二,周三,周四,周五,周六".split(","),dayNamesShort:"日,一,二,三,四,五,六".split(","),dayNamesMin:"日,一,二,三,四,五,六".split(","),dayText:"日",hourText:"时",minuteText:"分",monthNames:"1月,2月,3月,4月,5月,6月,7月,8月,9月,10月,11月,12月".split(","),monthNamesShort:"一,二,三,四,五,六,七,八,九,十,十一,十二".split(","),monthText:"月",secText:"秒",timeFormat:"HH:ii",timeWheels:"HHii",yearText:"年",nowText:"当前",pmText:"下午",amText:"上午",dateText:"日",timeText:"时间",calendarText:"日历",closeText:"关闭",fromText:"开始时间",toText:"结束时间",wholeText:"合计",fractionText:"分数",unitText:"单位",labels:"年,月,日,小时,分钟,秒,".split(","),labelsShort:"年,月,日,点,分,秒,".split(","),startText:"开始",stopText:"停止",resetText:"重置",lapText:"圈",hideText:"隐藏",backText:"背部",undoText:"复原",offText:"关闭",onText:"开启"}}(jQuery),function(n){n.mobiscroll.i18n.nl={setText:"Instellen",cancelText:"Annuleren",clearText:"Duidelijk",selectedText:"gekozen",dateFormat:"dd/mm/yy",dateOrder:"ddmmyy",dayNames:"zondag,maandag,Dinsdag,Woensdag,Donderdag,Vrijdag,Zaterdag".split(","),dayNamesShort:"zo,ma,di,wo,do,vr,za".split(","),dayNamesMin:"z,m,d,w,d,v,z".split(","),dayText:"Dag",hourText:"Uur",minuteText:"Minuten",monthNames:"januari,februari,maart,april,mei,juni,juli,augustus,september,oktober,november,december".split(","),monthNamesShort:"jan,feb,mrt,apr,mei,jun,jul,aug,sep,okt,nov,dec".split(","),monthText:"Maand",secText:"Seconden",timeFormat:"HH:ii",timeWheels:"HHii",yearText:"Jaar",nowText:"Nu",pmText:"pm",amText:"am",firstDay:1,dateText:"Datum",timeText:"Tijd",calendarText:"Kalender",closeText:"Sluiten",fromText:"Start",toText:"Einde",wholeText:"geheel",fractionText:"fractie",unitText:"eenheid",labels:"Jaren,Maanden,Dagen,Uren,Minuten,Seconden,".split(","),labelsShort:"j,m,d,u,min,sec,".split(","),startText:"Start",stopText:"Stop",resetText:"Reset",lapText:"Ronde",hideText:"Verbergen",backText:"Terug",undoText:"Onged. maken",offText:"Uit",onText:"Aan"}}(jQuery),function(n){n.mobiscroll.i18n.ar={rtl:!0,setText:"workportal-general-button-label-ok",cancelText:"workportal-general-button-label-cancel",clearText:"workportal-widget-query-form-clear-button",selectedText:"workportal-widget-query-form-selected",dateFormat:"dd/mm/yy",dateOrder:"ddmmyy",dayNames:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],dayNamesShort:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],dayNamesMin:["S","M","T","W","T","F","S"],dayText:"Day",hourText:"Hours",minuteText:"Minutes",monthNames:["January","February","March","April","May","June","July","August","September","October","November","December"],monthNamesShort:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],monthText:"Month",secText:"Seconds",amText:"am",pmText:"pm",timeFormat:"hh:ii A",timeWheels:"hhiiA",yearText:"Year",nowText:"Now",firstDay:0,dateText:"Date",timeText:"workportal-project-plan-time-title",calendarText:"?????",closeText:"workportal-case-dialog-box-close",todayText:"Today",prevMonthText:"Previous Month",nextMonthText:"Next Month",prevYearText:"Previous Year",nextYearText:"Next Year",eventText:"event",eventsText:"events",fromText:"Start",toText:"End",wholeText:"Whole",fractionText:"Fraction",unitText:"Unit",delimiter:"/",decimalSeparator:".",thousandsSeparator:",",labels:["Years","Months","Days","Hours","Minutes","Seconds",""],labelsShort:["Yrs","Mths","Days","Hrs","Mins","Secs",""],startText:"Start",stopText:"Stop",resetText:"Reset",lapText:"Lap",hideText:"Hide",backText:"Back",undoText:"Undo"}}(jQuery),function(n){n.mobiscroll.i18n.nl={setText:"Instellen",cancelText:"Annuleren",clearText:"Duidelijk",selectedText:"gekozen",dateFormat:"dd/mm/yy",dateOrder:"ddmmyy",dayNames:"zondag,maandag,Dinsdag,Woensdag,Donderdag,Vrijdag,Zaterdag".split(","),dayNamesShort:"zo,ma,di,wo,do,vr,za".split(","),dayNamesMin:"z,m,d,w,d,v,z".split(","),dayText:"Dag",hourText:"Uur",minuteText:"Minuten",monthNames:"januari,februari,maart,april,mei,juni,juli,augustus,september,oktober,november,december".split(","),monthNamesShort:"jan,feb,mrt,apr,mei,jun,jul,aug,sep,okt,nov,dec".split(","),monthText:"Maand",secText:"Seconden",timeFormat:"HH:ii",timeWheels:"HHii",yearText:"Jaar",nowText:"Nu",pmText:"pm",amText:"am",firstDay:1,dateText:"Datum",timeText:"Tijd",calendarText:"Kalender",closeText:"Sluiten",fromText:"Start",toText:"Einde",wholeText:"geheel",fractionText:"fractie",unitText:"eenheid",labels:"Jaren,Maanden,Dagen,Uren,Minuten,Seconden,".split(","),labelsShort:"j,m,d,u,min,sec,".split(","),startText:"Start",stopText:"Stop",resetText:"Reset",lapText:"Ronde",hideText:"Verbergen",backText:"Terug",undoText:"Onged. maken",offText:"Uit",onText:"Aan"}}(jQuery),function(n){n.mobiscroll.i18n.ja={setText:"セット",cancelText:"キャンセル",clearText:"クリア",selectedText:"選択",dateFormat:"yy年mm月dd日",dateOrder:"yymmdd",dayNames:"日,月,火,水,木,金,土".split(","),dayNamesShort:"日,月,火,水,木,金,土".split(","),dayNamesMin:"日,月,火,水,木,金,土".split(","),dayText:"日",hourText:"時",minuteText:"分",monthNames:"1月,2月,3月,4月,5月,6月,7月,8月,9月,10月,11月,12月".split(","),monthNamesShort:"1月,2月,3月,4月,5月,6月,7月,8月,9月,10月,11月,12月".split(","),monthText:"月",secText:"秒",timeFormat:"HH:ii",timeWheels:"HHii",yearText:"年",nowText:"今",pmText:"午後",amText:"午前",yearSuffix:"年",monthSuffix:"月",daySuffix:"日",dateText:"日付",timeText:"時間",calendarText:"カレンダー",closeText:"クローズ",fromText:"開始",toText:"終わり",wholeText:"全数",fractionText:"分数",unitText:"単位",labels:"年間,月間,日間,時間,分,秒,".split(","),labelsShort:"年間,月間,日間,時間,分,秒,".split(","),startText:"開始",stopText:"停止",resetText:"リセット",lapText:"ラップ",hideText:"隠す",backText:"バック",undoText:"アンドゥ"}}(jQuery),function(n){n.mobiscroll.i18n["pt-PT"]={setText:"Seleccionar",cancelText:"Cancelar",clearText:"Claro",selectedText:"selecionado",selectedPluralText:"selecionados",dateFormat:"dd-mm-yy",dateOrder:"ddMMyy",dayNames:"Domingo,Segunda-feira,Terça-feira,Quarta-feira,Quinta-feira,Sexta-feira,S&aacute;bado".split(","),dayNamesShort:"Dom,Seg,Ter,Qua,Qui,Sex,S&aacute;b".split(","),dayNamesMin:"D,S,T,Q,Q,S,S".split(","),dayText:"Dia",hourText:"Horas",minuteText:"Minutos",monthNames:"Janeiro,Fevereiro,Mar&ccedil;o,Abril,Maio,Junho,Julho,Agosto,Setembro,Outubro,Novembro,Dezembro".split(","),monthNamesShort:"Jan,Fev,Mar,Abr,Mai,Jun,Jul,Ago,Set,Out,Nov,Dez".split(","),monthText:"M&ecirc;s",secText:"Segundo",timeFormat:"HH:ii:ss",timeWheels:"HHiiss",yearText:"Ano",nowText:"Actualizar",pmText:"da tarde",amText:"da manhã",firstDay:1,dateText:"Data",timeText:"Tempo",calendarText:"Calend&aacute;rio",closeText:"Fechar",fromText:"In&iacute;cio",toText:"Fim",wholeText:"Inteiro",fractionText:"Frac&ccedil;&atilde;o",unitText:"Unidade",labels:"Anos,Meses,Dias,Horas,Minutos,Segundos,".split(","),labelsShort:"Ano,M&ecirc;s,Dia,Hora,Min,Seg,".split(","),startText:"Come&ccedil;ar",stopText:"Parar",resetText:"Reinicializar",lapText:"Lap",hideText:"Esconder",backText:"De volta",undoText:"Anular",offText:"Desl",onText:"Lig"}}(jQuery),function(n){n.mobiscroll.i18n.pl={setText:"Zestaw",cancelText:"Anuluj",clearText:"Oczyścić",selectedText:"wybór",dateFormat:"yy-mm-dd",dateOrder:"ddmmy",dayNames:"Niedziela,Poniedziałek,Wtorek,Środa,Czwartek,Piątek,Sobota".split(","),dayNamesShort:"Niedz.,Pon.,Wt.,Śr.,Czw.,Pt.,Sob.".split(","),dayNamesMin:"N,P,W,Ś,C,P,S".split(","),dayText:"Dzień",hourText:"Godziny",minuteText:"Minuty",monthNames:"Styczeń,Luty,Marzec,Kwiecień,Maj,Czerwiec,Lipiec,Sierpień,Wrzesień,Październik,Listopad,Grudzień".split(","),monthNamesShort:"Sty,Lut,Mar,Kwi,Maj,Cze,Lip,Sie,Wrz,Paź,Lis,Gru".split(","),monthText:"Miesiąc",secText:"Sekundy",timeFormat:"HH:ii",timeWheels:"HHii",yearText:"Rok",nowText:"Teraz",amText:"rano",pmText:"po południu",firstDay:1,dateText:"Data",timeText:"Czas",calendarText:"Kalendarz",closeText:"Zakończenie",fromText:"Rozpoczęcie",toText:"Koniec",wholeText:"Cały",fractionText:"Ułamek",unitText:"Jednostka",labels:"Lata,Miesiąc,Dni,Godziny,Minuty,Sekundy,".split(","),labelsShort:"R,M,Dz,Godz,Min,Sek,".split(","),startText:"Rozpoczęcie",stopText:"Zatrzymać",resetText:"Zresetować",lapText:"Zakładka",hideText:"Ukryć",backText:"Z powrotem",undoText:"Cofnij",offText:"Wył",onText:"Wł"}}(jQuery),function(n){n.mobiscroll.i18n["ru-RU"]=n.mobiscroll.i18n.ru={setText:"Установить",cancelText:"Отмена",clearText:"Очистить",selectedText:"Выбрать",dateFormat:"dd.mm.yy",dateOrder:"ddmmyy",dayNames:"воскресенье,понедельник,вторник,среда,четверг,пятница,суббота".split(","),dayNamesShort:"вс,пн,вт,ср,чт,пт,сб".split(","),dayNamesMin:"в,п,в,с,ч,п,с".split(","),dayText:"День",delimiter:".",hourText:"Час",minuteText:"Минут",monthNames:"Январь,Февраль,Март,Апрель,Май,Июнь,Июль,Август,Сентябрь,Октябрь,Ноябрь,Декабрь".split(","),monthNamesShort:"Янв,Фев,Мар,Апр,Май,Июн,Июл,Авг,Сен,Окт,Ноя,Дек".split(","),monthText:"Месяц",secText:"Секунд",timeFormat:"HH:ii",timeWheels:"HHii",yearText:"Год",nowText:"Сейчас",amText:"До полудня",pmText:"После полудня",firstDay:1,dateText:"Дата",timeText:"Время",calendarText:"Календарь",closeText:"Закрыть",fromText:"Начало",toText:"Конец",wholeText:"Целое",fractionText:"Дробное",unitText:"Единица",labels:"Лет,Месяцев,Дней,Часов,Минут,Секунд,".split(","),labelsShort:"Лет,Мес,Дн,Час,Мин,Сек,".split(","),startText:"Старт",stopText:"Стоп",resetText:"Сбросить",lapText:"Круг",hideText:"Скрыть",backText:"назад",undoText:"аннулировать",offText:"O",onText:"I"}}(jQuery),function(n,t,i,r){var o,s,u=n.mobiscroll,e=u.util,l=e.jsPrefix,a=e.has3d,h=e.getCoord,v=e.constrain,c=e.isString,y=/android [1-3]/i.test(navigator.userAgent),e=/(iphone|ipod|ipad).* os 8_/i.test(navigator.userAgent),f=function(){},p=function(n){n.preventDefault()};u.classes.Frame=function(e,w,b){function ci(t){if(et&&et.removeClass("dwb-a"),et=n(this),et.hasClass("dwb-d")||et.hasClass("dwb-nhl")||et.addClass("dwb-a"),"mousedown"===t.type)n(i).on("mouseup",yt)}function yt(t){et&&(et.removeClass("dwb-a"),et=null);"mouseup"===t.type&&n(i).off("mouseup",yt)}function gt(n){13==n.keyCode?k.select():27==n.keyCode&&k.cancel()}function ni(t){var i,f,e,u=d.focusOnClose;k._markupRemove();g.remove();o&&!t&&setTimeout(function(){if(u===r||!0===u){s=!0;i=o[0];e=i.type;f=i.value;try{i.type="button"}catch(t){}o.focus();i.type=e;i.value=f}else u&&n(u).focus()},200);k._isVisible=!1;rt("onHide",[])}function ti(n){clearTimeout(hi[n.type]);hi[n.type]=setTimeout(function(){var t="scroll"==n.type;(!t||vt)&&k.position(!t)},200)}function ii(n){n.target.nodeType&&!tt[0].contains(n.target)&&tt.focus()}function pt(t,r){t&&t();n(i.activeElement).is("input,textarea")&&n(i.activeElement).blur();o=r;k.show();setTimeout(function(){s=!1},300)}var wt,st,ri,g,ui,lt,tt,it,bt,ht,et,ft,rt,kt,nt,ct,ot,at,dt,d,vt,fi,ei,oi,k=this,ut=n(e),si=[],hi={};u.classes.Base.call(this,e,w,!0);k.position=function(t){var h,o,u,c,l,a,b,y,s,ft,p=0,w=0,e,f;s={};e=Math.min(it[0].innerWidth||it.innerWidth(),lt.width());f=it[0].innerHeight||it.innerHeight();ei===e&&oi===f&&t||dt||((k._isFullScreen||/top|bottom/.test(d.display))&&tt.width(e),!1!==rt("onPosition",[g,e,f])&&nt)&&(o=it.scrollLeft(),t=it.scrollTop(),c=d.anchor===r?ut:n(d.anchor),k._isLiquid&&"liquid"!==d.layout&&(400>e?g.addClass("dw-liq"):g.removeClass("dw-liq")),!k._isFullScreen&&/modal|bubble/.test(d.display)&&(bt.width(""),n(".mbsc-w-p",g).each(function(){h=n(this).outerWidth(!0);p+=h;w=h>w?h:w}),h=p>e?w:p,bt.width(h+1).css("white-space",p>e?"":"nowrap")),ct=tt.outerWidth(),ot=tt.outerHeight(!0),vt=ot<=f&&ct<=e,k.scrollLock=vt,"modal"==d.display?(o=Math.max(0,o+(e-ct)/2),u=t+(f-ot)/2):"bubble"==d.display?(ft=!0,y=n(".dw-arrw-i",g),u=c.offset(),a=Math.abs(st.offset().top-u.top),b=Math.abs(st.offset().left-u.left),l=c.outerWidth(),c=c.outerHeight(),o=v(b-(tt.outerWidth(!0)-l)/2,o+3,o+e-ct-3),u=a-ot,u<t||a>t+f?(tt.removeClass("dw-bubble-top").addClass("dw-bubble-bottom"),u=a+c):tt.removeClass("dw-bubble-bottom").addClass("dw-bubble-top"),y=y.outerWidth(),l=v(b+l/2-(o+(ct-y)/2),0,y),n(".dw-arr",g).css({left:l})):"top"==d.display?u=t:"bottom"==d.display&&(u=t+f-ot),u=0>u?0:u,s.top=u,s.left=o,tt.css(s),lt.height(0),s=Math.max(u+ot,"body"==d.context?n(i).height():st[0].scrollHeight),lt.css({height:s}),ft&&(u+ot>t+f||a>t+f)&&(dt=!0,setTimeout(function(){dt=!1},300),it.scrollTop(Math.min(u+ot-f,s-f))),ei=e,oi=f)};k.attachShow=function(n,t){if(si.push({readOnly:n.prop("readonly"),el:n}),"inline"!==d.display){if(fi&&n.is("input"))n.prop("readonly",!0).on("mousedown.dw",function(n){n.preventDefault()});if(d.showOnFocus)n.on("focus.dw",function(){s||pt(t,n)});d.showOnTap&&(n.on("keydown.dw",function(i){(32==i.keyCode||13==i.keyCode)&&(i.preventDefault(),i.stopPropagation(),pt(t,n))}),k.tap(n,function(){pt(t,n)}))}};k.select=function(){nt&&!1===k.hide(!1,"set")||(k._fillValue(),rt("onSelect",[k._value]))};k.cancel=function(){nt&&!1===k.hide(!1,"cancel")||rt("onCancel",[k._value])};k.clear=function(){rt("onClear",[g]);nt&&!k.live&&k.hide(!1,"clear");k.setVal(null,!0)};k.enable=function(){d.disabled=!1;k._isInput&&ut.prop("disabled",!1)};k.disable=function(){d.disabled=!0;k._isInput&&ut.prop("disabled",!0)};k.show=function(i,f){var e;if(!d.disabled&&!k._isVisible){if(k._readValue(),rt("onBeforeShow",[]),ft=y?!1:d.animate,!1!==ft&&("top"==d.display&&(ft="slidedown"),"bottom"==d.display&&(ft="slideup")),e='<div lang="'+d.lang+'" class="mbsc-'+d.theme+(d.baseTheme?" mbsc-"+d.baseTheme:"")+" dw-"+d.display+" "+(d.cssClass||"")+(k._isLiquid?" dw-liq":"")+(y?" mbsc-old":"")+(kt?"":" dw-nobtn")+'"><div class="dw-persp">'+(nt?'<div class="dwo"><\/div>':"")+"<div"+(nt?' role="dialog" tabindex="-1"':"")+' class="dw'+(d.rtl?" dw-rtl":" dw-ltr")+'">'+("bubble"===d.display?'<div class="dw-arrw"><div class="dw-arrw-i"><div class="dw-arr"><\/div><\/div><\/div>':"")+'<div class="dwwr"><div aria-live="assertive" class="dw-aria dw-hidden"><\/div>'+(d.headerText?'<div class="dwv">'+(c(d.headerText)?d.headerText:"")+"<\/div>":"")+'<div class="dwcc">',e+=k._generateContent(),e+="<\/div>",kt&&(e+='<div class="dwbc">',n.each(ht,function(n,t){t=c(t)?k.buttons[t]:t;t.handler==="set"&&(t.parentClass="dwb-s");t.handler==="cancel"&&(t.parentClass="dwb-c");e=e+("<div"+(d.btnWidth?' style="width:'+100/ht.length+'%"':"")+' class="dwbw '+(t.parentClass||"")+'"><div tabindex="0" role="button" class="dwb'+n+" dwb-e "+(t.cssClass===r?d.btnClass:t.cssClass)+(t.icon?" mbsc-ic mbsc-ic-"+t.icon:"")+'">'+(t.text||"")+"<\/div><\/div>")}),e+="<\/div>"),e+="<\/div><\/div><\/div><\/div>",g=n(e),lt=n(".dw-persp",g),ui=n(".dwo",g),bt=n(".dwwr",g),ri=n(".dwv",g),tt=n(".dw",g),wt=n(".dw-aria",g),k._markup=g,k._header=ri,k._isVisible=!0,at="orientationchange resize",k._markupReady(g),rt("onMarkupReady",[g]),nt){n(t).on("keydown",gt);if(d.scrollLock)g.on("touchmove mousewheel wheel",function(n){vt&&n.preventDefault()});"Moz"!==l&&n("input,select,button",st).each(function(){this.disabled||n(this).addClass("dwtd").prop("disabled",!0)});u.activeInstance&&u.activeInstance.hide();at+=" scroll";u.activeInstance=k;g.appendTo(st);it.on("focusin",ii);a&&ft&&!i&&g.addClass("dw-in dw-trans").on("webkitAnimationEnd animationend",function(){g.off("webkitAnimationEnd animationend").removeClass("dw-in dw-trans").find(".dw").removeClass("dw-"+ft);f||tt.focus();k.ariaMessage(d.ariaMessage)}).find(".dw").addClass("dw-"+ft)}else ut.is("div")&&!k._hasContent?ut.html(g):g.insertAfter(ut);k._markupInserted(g);rt("onMarkupInserted",[g]);k.position();it.on(at,ti);g.on("selectstart mousedown",p).on("click",".dwb-e",p).on("keydown",".dwb-e",function(t){t.keyCode==32&&(t.preventDefault(),t.stopPropagation(),n(this).click())}).on("keydown",function(t){if(t.keyCode==32)t.preventDefault();else if(t.keyCode==9&&nt){var i=g.find('[tabindex="0"]').filter(function(){return this.offsetWidth>0||this.offsetHeight>0}),f=i.index(n(":focus",g)),r=i.length-1,u=0;t.shiftKey&&(r=0,u=-1);f===r&&(i.eq(u).focus(),t.preventDefault())}});n("input,select,textarea",g).on("selectstart mousedown",function(n){n.stopPropagation()}).on("keydown",function(n){n.keyCode==32&&n.stopPropagation()});n.each(ht,function(t,i){k.tap(n(".dwb"+t,g),function(n){i=c(i)?k.buttons[i]:i;(c(i.handler)?k.handlers[i.handler]:i.handler).call(this,n,k)},!0)});d.closeOnOverlay&&k.tap(ui,function(){k.cancel()});nt&&!ft&&(f||tt.focus(),k.ariaMessage(d.ariaMessage));g.on("touchstart mousedown",".dwb-e",ci).on("touchend",".dwb-e",yt);k._attachEvents(g);rt("onShow",[g,k._tempValue])}};k.hide=function(i,r,f){if(!k._isVisible||!f&&!k._isValid&&"set"==r||!f&&!1===rt("onClose",[k._tempValue,r]))return!1;if(g){if("Moz"!==l&&n(".dwtd",st).each(function(){n(this).prop("disabled",!1).removeClass("dwtd")}),a&&nt&&ft&&!i&&!g.hasClass("dw-trans"))g.addClass("dw-out dw-trans").find(".dw").addClass("dw-"+ft).on("webkitAnimationEnd animationend",function(){ni(i)});else ni(i);it.off(at,ti).off("focusin",ii)}nt&&(n(t).off("keydown",gt),delete u.activeInstance)};k.ariaMessage=function(n){wt.html("");setTimeout(function(){wt.html(n)},100)};k.isVisible=function(){return k._isVisible};k.setVal=f;k._generateContent=f;k._attachEvents=f;k._readValue=f;k._fillValue=f;k._markupReady=f;k._markupInserted=f;k._markupRemove=f;k._processSettings=f;k._presetLoad=function(n){n.buttons=n.buttons||("inline"!==n.display?["set","cancel"]:[]);n.headerText=n.headerText===r?"inline"!==n.display?"{value}":!1:n.headerText};k.tap=function(n,t,i){var f,e,r;if(d.tap)n.on("touchstart.dw",function(n){i&&n.preventDefault();f=h(n,"X");e=h(n,"Y");r=!1}).on("touchmove.dw",function(n){(!r&&20<Math.abs(h(n,"X")-f)||20<Math.abs(h(n,"Y")-e))&&(r=!0)}).on("touchend.dw",function(n){r||(n.preventDefault(),t.call(this,n));u.tapped++;setTimeout(function(){u.tapped--},500)});n.on("click.dw",function(n){n.preventDefault();t.call(this,n)})};k.destroy=function(){k.hide(!0,!1,!0);n.each(si,function(n,t){t.el.off(".dw").prop("readonly",t.readOnly)});k._destroy()};k.init=function(i){k._init(i);k._isLiquid="liquid"===(d.layout||(/top|bottom/.test(d.display)?"liquid":""));k._processSettings();ut.off(".dw");ht=d.buttons||[];nt="inline"!==d.display;fi=d.showOnFocus||d.showOnTap;it=n("body"==d.context?t:d.context);st=n(d.context);k.context=it;k.live=!0;n.each(ht,function(n,t){if("ok"==t||"set"==t||"set"==t.handler)return k.live=!1});k.buttons.set={text:d.setText,handler:"set"};k.buttons.cancel={text:k.live?d.closeText:d.cancelText,handler:"cancel"};k.buttons.clear={text:d.clearText,handler:"clear"};k._isInput=ut.is("input");kt=0<ht.length;k._isVisible&&k.hide(!0,!1,!0);rt("onInit",[]);nt?(k._readValue(),k._hasContent||k.attachShow(ut)):k.show();ut.on("change.dw",function(){k._preventChange||k.setVal(ut.val(),!0,!1);k._preventChange=!1})};k.buttons={};k.handlers={set:k.select,cancel:k.cancel,clear:k.clear};k._value=null;k._isValid=!0;k._isVisible=!1;d=k.settings;rt=k.trigger;b||k.init(w)};u.classes.Frame.prototype._defaults={lang:"en",setText:"Set",selectedText:"Selected",closeText:"Close",cancelText:"Cancel",clearText:"Clear",disabled:!1,closeOnOverlay:!0,showOnFocus:!1,showOnTap:!0,display:"modal",scrollLock:!0,tap:!0,btnClass:"dwb",btnWidth:!0,focusOnClose:!e};u.themes.frame.mobiscroll={rows:5,showLabel:!1,headerText:!1,btnWidth:!1,selectedLineHeight:!0,selectedLineBorder:1,dateOrder:"MMddyy",weekDays:"min",checkIcon:"ion-ios7-checkmark-empty",btnPlusClass:"mbsc-ic mbsc-ic-arrow-down5",btnMinusClass:"mbsc-ic mbsc-ic-arrow-up5",btnCalPrevClass:"mbsc-ic mbsc-ic-arrow-left5",btnCalNextClass:"mbsc-ic mbsc-ic-arrow-right5"};n(t).on("focus",function(){o&&(s=!0)})}(jQuery,window,document),function(n,t,i,r){var e,t=n.mobiscroll,o=t.classes,u=t.util,h=u.jsPrefix,c=u.has3d,s=u.hasFlex,l=u.getCoord,f=u.constrain,a=u.testTouch;t.presetShort("scroller","Scroller",!1);o.Scroller=function(t,v,y){function yi(t){if(a(t,this)&&!e&&!ut&&!st&&!ri(this)&&(t.preventDefault(),t.stopPropagation(),e=!0,ht="clickpick"!=w.mode,tt=n(".dw-ul",this),yt(tt),lt=(kt=ot[k]!==r)?Math.round(-u.getPosition(tt,!0)/b):vt[k],it=l(t,"Y"),vi=new Date,g=it,ft(tt,k,lt,.001),ht&&tt.closest(".dwwl").addClass("dwa"),"mousedown"===t.type))n(i).on("mousemove",gt).on("mouseup",ni)}function gt(n){e&&ht&&(n.preventDefault(),n.stopPropagation(),g=l(n,"Y"),3<Math.abs(g-it)||kt)&&(ft(tt,k,f(lt+(it-g)/b,d-1,nt+1)),kt=!0)}function ni(t){var s,o;if(e){var r=new Date-vi,s=f(Math.round(lt+(it-g)/b),d-1,nt+1),h=s,u,l=tt.offset().top;if(t.stopPropagation(),e=!1,"mouseup"===t.type&&n(i).off("mousemove",gt).off("mouseup",ni),c&&300>r?(u=(g-it)/r,r=u*u/w.speedUnit,0>g-it&&(r=-r)):r=g-it,kt)h=f(Math.round(lt-r/b),d,nt),r=u?Math.max(.1,Math.abs((h-s)/u)*w.timeUnit):.1;else if(s=Math.floor((g-l)/b),o=n(n(".dw-li",tt)[s]),u=o.hasClass("dw-v"),l=ht,r=.1,!1!==et("onValueTap",[o])&&u?h=s:l=!0,l&&u&&(o.addClass("dw-hl"),setTimeout(function(){o.removeClass("dw-hl")},100)),!ct&&(!0===w.confirmOnTap||w.confirmOnTap[k])&&o.hasClass("dw-sel")){p.select();return}ht&&wt(tt,k,h,0,r,!0)}}function pi(t){if(st=n(this),a(t,this)&&ii(t,st.closest(".dwwl"),st.hasClass("dwwbp")?ci:li),"mousedown"===t.type)n(i).on("mouseup",ti)}function ti(t){st=null;ut&&(clearInterval(dt),ut=!1);"mouseup"===t.type&&n(i).off("mouseup",ti)}function wi(t){38==t.keyCode?ii(t,n(this),li):40==t.keyCode&&ii(t,n(this),ci)}function bi(){ut&&(clearInterval(dt),ut=!1)}function ki(t){if(!ri(this)){t.preventDefault();var t=t.originalEvent||t,r=t.deltaY||t.wheelDelta||t.detail,i=n(".dw-ul",this);yt(i);ft(i,k,f(((0>r?-20:20)-fi[k])/b,d-1,nt+1));clearTimeout(ai);ai=setTimeout(function(){wt(i,k,Math.round(vt[k]),0<r?1:2,.1)},200)}}function ii(n,t,i){if(n.stopPropagation(),n.preventDefault(),!ut&&!ri(t)&&!t.hasClass("dwa")){ut=!0;var r=t.find(".dw-ul");yt(r);clearInterval(dt);dt=setInterval(function(){i(r)},w.delay);i(r)}}function ri(t){return n.isArray(w.readonly)?(t=n(".dwwl",rt).index(t),w.readonly[t]):w.readonly}function oi(t){var i='<div class="dw-bf">',t=ei[t],r=1,u=t.labels||[],f=t.values||[],e=t.keys||f;return n.each(f,function(n,t){0==r%20&&(i+='<\/div><div class="dw-bf">');i+='<div role="option" aria-selected="false" class="dw-li dw-v" data-val="'+e[n]+'"'+(u[n]?' aria-label="'+u[n]+'"':"")+' style="height:'+b+"px;line-height:"+b+'px;"><div class="dw-i"'+(1<at?' style="line-height:'+Math.round(b/at)+"px;font-size:"+Math.round(.8*(b/at))+'px;"':"")+">"+t+"<\/div><\/div>";r++}),i+="<\/div>"}function yt(t){ct=t.closest(".dwwl").hasClass("dwwms");d=n(".dw-li",t).index(n(ct?".dw-li":".dw-v",t).eq(0));nt=Math.max(d,n(".dw-li",t).index(n(ct?".dw-li":".dw-v",t).eq(-1))-(ct?w.rows-("scroller"==w.mode?1:3):0));k=n(".dw-ul",rt).index(t)}function di(n){var i=w.headerText;return i?"function"==typeof i?i.call(t,n):i.replace(/\{value\}/i,n):""}function si(n,t){clearTimeout(ot[t]);delete ot[t];n.closest(".dwwl").removeClass("dwa")}function ft(n,t,i,r,f){var e=-i*b,o=n[0].style;e==fi[t]&&ot[t]||(fi[t]=e,c?(o[h+"Transition"]=u.prefix+"transform "+(r?r.toFixed(3):0)+"s ease-out",o[h+"Transform"]="translate3d(0,"+e+"px,0)"):o.top=e+"px",ot[t]&&si(n,t),r&&f&&(n.closest(".dwwl").addClass("dwa"),ot[t]=setTimeout(function(){si(n,t)},1e3*r)),vt[t]=i)}function hi(t,i,r,u,e){var o=n('.dw-li[data-val="'+t+'"]',i),c=n(".dw-li",i),t=c.index(o),a=c.length;if(u)yt(i);else if(!o.hasClass("dw-v")){for(var l=o,s=0,h=0;0<=t-s&&!l.hasClass("dw-v");)s++,l=c.eq(t-s);for(;t+h<a&&!o.hasClass("dw-v");)h++,o=c.eq(t+h);(h<s&&h&&2!==r||!s||0>t-s||1==r)&&o.hasClass("dw-v")?t+=h:(o=l,t-=s)}return r=o.hasClass("dw-sel"),e&&(u||(n(".dw-sel",i).removeAttr("aria-selected"),o.attr("aria-selected","true")),n(".dw-sel",i).removeClass("dw-sel"),o.addClass("dw-sel")),{selected:r,v:u?f(t,d,nt):t,val:o.hasClass("dw-v")||u?o.attr("data-val"):null}}function pt(t,i,u,f,e){!1!==et("validate",[rt,i,t,f])&&(n(".dw-ul",rt).each(function(u){var s=n(this),o=s.closest(".dwwl").hasClass("dwwms"),h=u==i||i===r,o=hi(p._tempWheelArray[u],s,f,o,!0);(!o.selected||h)&&(p._tempWheelArray[u]=o.val,ft(s,u,o.v,h?t:.1,h?e:!1))}),et("onValidated",[]),p._tempValue=w.formatValue(p._tempWheelArray,p),p.live&&(p._hasValue=u||p._hasValue,bt(u,u,0,!0)),p._header.html(di(p._tempValue)),u&&et("onChange",[p._tempValue]))}function wt(t,i,r,u,e,o){r=f(r,d,nt);p._tempWheelArray[i]=n(".dw-li",t).eq(r).attr("data-val");ft(t,i,r,e,o);setTimeout(function(){pt(e,i,!0,u,o)},10)}function ci(n){var t=vt[k]+1;wt(n,k,t>nt?d:t,1,.1)}function li(n){var t=vt[k]-1;wt(n,k,t<d?nt:t,2,.1)}function bt(n,t,i,r,u){p._isVisible&&!r&&pt(i);p._tempValue=w.formatValue(p._tempWheelArray,p);u||(p._wheelArray=p._tempWheelArray.slice(0),p._value=p._hasValue?p._tempValue:null);n&&(et("onValueFill",[p._hasValue?p._tempValue:"",t]),p._isInput&&ui.val(p._hasValue?p._tempValue:""),t&&(p._preventChange=!0,ui.change()))}var rt,st,ht,b,ct,w,ai,et,ut,kt,it,vi,g,lt,d,nt,tt,k,at,dt,p=this,ui=n(t),ot={},vt={},fi={},ei=[];o.Frame.call(this,t,v,!0);p.setVal=p._setVal=function(i,u,f,e,o){p._hasValue=null!==i&&i!==r;p._tempWheelArray=n.isArray(i)?i.slice(0):w.parseValue.call(t,i,p)||[];bt(u,f===r?u:f,o,!1,e)};p.getVal=p._getVal=function(n){return n=p._hasValue||n?p[n?"_tempValue":"_value"]:null,u.isNumeric(n)?+n:n};p.setArrayVal=p.setVal;p.getArrayVal=function(n){return n?p._tempWheelArray:p._wheelArray};p.setValue=function(n,t,i,r,u){p.setVal(n,t,u,r,i)};p.getValue=p.getArrayVal;p.changeWheel=function(t,i,u){if(rt){var f=0,e=t.length;n.each(w.wheels,function(o,s){return n.each(s,function(o,s){if(-1<n.inArray(f,t)&&(ei[f]=s,n(".dw-ul",rt).eq(f).html(oi(f)),e--,!e))return p.position(),pt(i,r,u),!1;f++}),e?void 0:!1})}};p.getValidCell=hi;p.scroll=ft;p._generateContent=function(){var u,i="",t=0;return n.each(w.wheels,function(f,e){i+='<div class="mbsc-w-p dwc'+("scroller"!=w.mode?" dwpm":" dwsc")+(w.showLabel?"":" dwhl")+'"><div class="dwwc"'+(w.maxWidth?"":' style="max-width:600px;"')+">"+(s?"":'<table class="dw-tbl" cellpadding="0" cellspacing="0"><tr>');n.each(e,function(n,f){ei[t]=f;u=f.label!==r?f.label:n;i+="<"+(s?"div":"td")+' class="dwfl" style="'+(w.fixedWidth?"width:"+(w.fixedWidth[t]||w.fixedWidth)+"px;":(w.minWidth?"min-width:"+(w.minWidth[t]||w.minWidth)+"px;":"min-width:"+w.width+"px;")+(w.maxWidth?"max-width:"+(w.maxWidth[t]||w.maxWidth)+"px;":""))+'"><div class="dwwl dwwl'+t+(f.multiple?" dwwms":"")+'">'+("scroller"!=w.mode?'<div class="dwb-e dwwb dwwbp '+(w.btnPlusClass||"")+'" style="height:'+b+"px;line-height:"+b+'px;"><span>+<\/span><\/div><div class="dwb-e dwwb dwwbm '+(w.btnMinusClass||"")+'" style="height:'+b+"px;line-height:"+b+'px;"><span>&ndash;<\/span><\/div>':"")+'<div class="dwl">'+u+'<\/div><div tabindex="0" aria-live="off" aria-label="'+u+'" role="listbox" class="dwww"><div class="dww" style="height:'+w.rows*b+'px;"><div class="dw-ul" style="margin-top:'+(f.multiple?"scroller"==w.mode?0:b:w.rows/2*b-b/2)+'px;">';i+=oi(t)+'<\/div><\/div><div class="dwwo"><\/div><\/div><div class="dwwol"'+(w.selectedLineHeight?' style="height:'+b+"px;margin-top:-"+(b/2+(w.selectedLineBorder||0))+'px;"':"")+"><\/div><\/div>"+(s?"<\/div>":"<\/td>");t++});i+=(s?"":"<\/tr><\/table>")+"<\/div><\/div>"}),i};p._attachEvents=function(n){n.on("keydown",".dwwl",wi).on("keyup",".dwwl",bi).on("touchstart mousedown",".dwwl",yi).on("touchmove",".dwwl",gt).on("touchend",".dwwl",ni).on("touchstart mousedown",".dwwb",pi).on("touchend",".dwwb",ti);if(w.mousewheel)n.on("wheel mousewheel",".dwwl",ki)};p._markupReady=function(n){rt=n;pt()};p._fillValue=function(){p._hasValue=!0;bt(!0,!0,0,!0)};p._readValue=function(){var n=ui.val()||"";""!==n&&(p._hasValue=!0);p._tempWheelArray=p._hasValue&&p._wheelArray?p._wheelArray.slice(0):w.parseValue.call(t,n,p)||[];bt()};p._processSettings=function(){w=p.settings;et=p.trigger;b=w.height;at=w.multiline;p._isLiquid="liquid"===(w.layout||(/top|bottom/.test(w.display)&&1==w.wheels.length?"liquid":""));w.formatResult&&(w.formatValue=w.formatResult);1<at&&(w.cssClass=(w.cssClass||"")+" dw-ml");"scroller"!=w.mode&&(w.rows=Math.max(3,w.rows))};p._selectedValues={};y||p.init(v)};o.Scroller.prototype={_hasDef:!0,_hasTheme:!0,_hasLang:!0,_hasPreset:!0,_class:"scroller",_defaults:n.extend({},o.Frame.prototype._defaults,{minWidth:80,height:40,rows:3,multiline:1,delay:300,readonly:!1,showLabel:!0,confirmOnTap:!0,wheels:[],mode:"scroller",preset:"",speedUnit:.0012,timeUnit:.08,formatValue:function(n){return n.join(" ")},parseValue:function(t,i){var e=[],o=[],s=0,u,f;return null!==t&&t!==r&&(e=(t+"").split(" ")),n.each(i.settings.wheels,function(t,i){n.each(i,function(t,i){f=i.keys||i.values;u=f[0];n.each(f,function(n,t){if(e[s]==t)return u=t,!1});o.push(u);s++})}),o}})};t.themes.scroller=t.themes.frame}(jQuery,window,document),function(n){var t=n.mobiscroll;t.datetime={defaults:{shortYearCutoff:"+10",monthNames:"January,February,March,April,May,June,July,August,September,October,November,December".split(","),monthNamesShort:"Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec".split(","),dayNames:"Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday".split(","),dayNamesShort:"Sun,Mon,Tue,Wed,Thu,Fri,Sat".split(","),dayNamesMin:"S,M,T,W,T,F,S".split(","),amText:"am",pmText:"pm",getYear:function(n){return n.getFullYear()},getMonth:function(n){return n.getMonth()},getDay:function(n){return n.getDate()},getDate:function(n,t,i,r,u,f,e){return new Date(n,t,i,r||0,u||0,f||0,e||0)},getMaxDayOfMonth:function(n,t){return 32-new Date(n,t,32).getDate()},getWeekNumber:function(n){n=new Date(n);n.setHours(0,0,0);n.setDate(n.getDate()+4-(n.getDay()||7));var t=new Date(n.getFullYear(),0,1);return Math.ceil(((n-t)/864e5+1)/7)}},formatDate:function(i,r,u){if(!r)return null;for(var u=n.extend({},t.datetime.defaults,u),h=function(n){for(var t=0;e+1<i.length&&i.charAt(e+1)==n;)t++,e++;return t},s=function(n,t,i){if(t=""+t,h(n))for(;t.length<i;)t="0"+t;return t},l=function(n,t,i,r){return h(n)?r[t]:i[t]},o,f="",c=!1,e=0;e<i.length;e++)if(c)"'"==i.charAt(e)&&!h("'")?c=!1:f+=i.charAt(e);else switch(i.charAt(e)){case"d":f+=s("d",u.getDay(r),2);break;case"D":f+=l("D",r.getDay(),u.dayNamesShort,u.dayNames);break;case"o":f+=s("o",(r.getTime()-new Date(r.getFullYear(),0,0).getTime())/864e5,3);break;case"m":f+=s("m",u.getMonth(r)+1,2);break;case"M":f+=l("M",u.getMonth(r),u.monthNamesShort,u.monthNames);break;case"y":o=u.getYear(r);f+=h("y")?o:(10>o%100?"0":"")+o%100;break;case"h":o=r.getHours();f+=s("h",12<o?o-12:0===o?12:o,2);break;case"H":f+=s("H",r.getHours(),2);break;case"i":f+=s("i",r.getMinutes(),2);break;case"s":f+=s("s",r.getSeconds(),2);break;case"a":f+=11<r.getHours()?u.pmText:u.amText;break;case"A":f+=11<r.getHours()?u.pmText.toUpperCase():u.amText.toUpperCase();break;case"'":h("'")?f+="'":c=!0;break;default:f+=i.charAt(e)}return f},parseDate:function(i,r,u){var u=n.extend({},t.datetime.defaults,u),s=u.defaultValue||new Date;if(!i||!r)return s;if(r.getTime)return r;for(var r="object"==typeof r?r.toString():r+"",a=u.shortYearCutoff,h=u.getYear(s),c=u.getMonth(s)+1,v=u.getDay(s),b=-1,f=s.getHours(),d=s.getMinutes(),g=0,y=-1,k=!1,p=function(n){return(n=o+1<i.length&&i.charAt(o+1)==n)&&o++,n},e=function(n){return(p(n),n=r.substr(l).match(RegExp("^\\d{1,"+("@"==n?14:"!"==n?20:"y"==n?4:"o"==n?3:2)+"}")),!n)?0:(l+=n[0].length,parseInt(n[0],10))},w=function(n,t,i){for(n=p(n)?i:t,t=0;t<n.length;t++)if(r.substr(l,n[t].length).toLowerCase()==n[t].toLowerCase())return l+=n[t].length,t+1;return 0},l=0,o=0;o<i.length;o++)if(k)"'"==i.charAt(o)&&!p("'")?k=!1:l++;else switch(i.charAt(o)){case"d":v=e("d");break;case"D":w("D",u.dayNamesShort,u.dayNames);break;case"o":b=e("o");break;case"m":c=e("m");break;case"M":c=w("M",u.monthNamesShort,u.monthNames);break;case"y":h=e("y");break;case"H":f=e("H");break;case"h":f=e("h");break;case"i":d=e("i");break;case"s":g=e("s");break;case"a":y=w("a",[u.amText,u.pmText],[u.amText,u.pmText])-1;break;case"A":y=w("A",[u.amText,u.pmText],[u.amText,u.pmText])-1;break;case"'":p("'")?l++:k=!0;break;default:l++}if(100>h&&(h+=(new Date).getFullYear()-(new Date).getFullYear()%100+(h<=("string"!=typeof a?a:(new Date).getFullYear()%100+parseInt(a,10))?0:-100)),-1<b){c=1;v=b;do{if(a=32-new Date(h,c-1,32).getDate(),v<=a)break;c++;v-=a}while(1)}return f=u.getDate(h,c-1,v,-1==y?f:y&&12>f?f+12:!y&&12==f?0:f,d,g),u.getYear(f)!=h||u.getMonth(f)+1!=c||u.getDay(f)!=v?s:f}};t.formatDate=t.datetime.formatDate;t.parseDate=t.datetime.parseDate}(jQuery),function(n,t,i,r){var u=n.mobiscroll,e=u.presets.scroller,f=u.util,o=f.has3d,h=f.jsPrefix,s=f.testTouch,c={controls:["calendar"],firstDay:0,weekDays:"short",maxMonthWidth:170,months:1,preMonths:1,highlight:!0,swipe:!0,liveSwipe:!0,divergentDayChange:!0,quickNav:!0,navigation:"yearMonth",dateText:"Date",timeText:"Time",calendarText:"Calendar",todayText:"Today",prevMonthText:"Previous Month",nextMonthText:"Next Month",prevYearText:"Previous Year",nextYearText:"Next Year",btnCalPrevClass:"mbsc-ic mbsc-ic-arrow-left6",btnCalNextClass:"mbsc-ic mbsc-ic-arrow-right6"};e.calbase=function(t){function yr(t,i,r){var s,e,u,o,f={},h=b+sr;return t&&n.each(t,function(n,t){if(s=t.d||t.start||t,e=s+"",t.start&&t.end)for(o=new Date(t.start);o<=t.end;)u=new Date(o.getFullYear(),o.getMonth(),o.getDate()),f[u]=f[u]||[],f[u].push(t),o.setDate(o.getDate()+1);else if(s.getTime)u=new Date(s.getFullYear(),s.getMonth(),s.getDate()),f[u]=f[u]||[],f[u].push(t);else if(e.match(/w/i)){var v=+e.replace("w",""),c=0,a=l.getDate(i,r-b-k,1).getDay();for(1<l.firstDay-a+1&&(c=7),st=0;st<5*ht;st++)u=l.getDate(i,r-b-k,7*st-c-a+1+v),f[u]=f[u]||[],f[u].push(t)}else if(e=e.split("/"),e[1])11<=r+h&&(u=l.getDate(i+1,e[0]-1,e[1]),f[u]=f[u]||[],f[u].push(t)),1>=r-h&&(u=l.getDate(i-1,e[0]-1,e[1]),f[u]=f[u]||[],f[u].push(t)),u=l.getDate(i,e[0]-1,e[1]),f[u]=f[u]||[],f[u].push(t);else for(st=0;st<ht;st++)u=l.getDate(i,r-b-k+st,e[0]),f[u]=f[u]||[],f[u].push(t)}),f}function au(n,i){tf=yr(l.invalid,n,i);nf=yr(l.valid,n,i);t.onGenMonth(n,i)}function vu(n,t,i,r,u,f,e){var o='<div class="dw-cal-h dw-cal-sc-c dw-cal-'+n+"-c "+(l.calendarClass||"")+'"><div class="dw-cal-sc"><div class="dw-cal-sc-p"><div class="dw-cal-sc-tbl"><div class="dw-cal-sc-row">';for(a=1;a<=t;a++)o=12>=a||a>i?o+'<div class="dw-cal-sc-m-cell dw-cal-sc-cell dw-cal-sc-empty"><div class="dw-i">&nbsp;<\/div><\/div>':o+('<div tabindex="0" role="button"'+(f?' aria-label="'+f[a-13]+'"':"")+' class="dwb-e dwb-nhl dw-cal-sc-m-cell dw-cal-sc-cell dw-cal-'+n+'-s" data-val='+(r+a-13)+'><div class="dw-i dw-cal-sc-tbl"><div class="dw-cal-sc-cell">'+(e?e[a-13]:r+a-13+u)+"<\/div><\/div><\/div>"),a<t&&(0==a%12?o+='<\/div><\/div><\/div><div class="dw-cal-sc-p" style="'+(lt?"top":gt?"right":"left")+":"+100*Math.round(a/12)+'%"><div class="dw-cal-sc-tbl"><div class="dw-cal-sc-row">':0==a%3&&(o+='<\/div><div class="dw-cal-sc-row">'));return o+"<\/div><\/div><\/div><\/div><\/div>"}function bi(i,u){var f,s,e,v,w,c,b,k,y,d,p,it,g,h,a=1,rt=0;f=l.getDate(i,u,1);var ut=l.getYear(f),nt=l.getMonth(f),o=null===l.defaultValue&&!t._hasValue?null:t.getDate(!0),ft=l.getDate(ut,nt,1).getDay(),tt='<div class="dw-cal-table">',et='<div class="dw-week-nr-c">';for(1<l.firstDay-ft+1&&(rt=7),h=0;42>h;h++)g=h+l.firstDay-rt,f=l.getDate(ut,nt,g-ft+1),s=f.getFullYear(),e=f.getMonth(),v=f.getDate(),w=l.getMonth(f),c=l.getDay(f),it=l.getMaxDayOfMonth(s,e),b=s+"-"+e+"-"+v,e=n.extend({valid:f<new Date(pi.getFullYear(),pi.getMonth(),pi.getDate())||f>ru?!1:tf[f]===r||nf[f]!==r,selected:o&&o.getFullYear()===s&&o.getMonth()===e&&o.getDate()===v},t.getDayProps(f,o)),k=e.valid,y=e.selected,s=e.cssClass,d=f.getTime()===(new Date).setHours(0,0,0,0),p=w!==nt,uf[b]=e,0==h%7&&(tt+=(h?"<\/div>":"")+'<div class="dw-cal-row'+(l.highlight&&o&&0<=o-f&&6048e5>o-f?" dw-cal-week-hl":"")+'">'),wi&&1==f.getDay()&&("month"==wi&&p&&1<a?a=1==v?1:2:"year"==wi&&(a=l.getWeekNumber(f)),et+='<div class="dw-week-nr"><div class="dw-week-nr-i">'+a+"<\/div><\/div>",a++),tt+='<div role="button" tabindex="-1" aria-label="'+(d?l.todayText+", ":"")+l.dayNames[f.getDay()]+", "+l.monthNames[w]+" "+c+" "+(e.ariaLabel?", "+e.ariaLabel:"")+'"'+(p&&!hr?' aria-hidden="true"':"")+(y?' aria-selected="true"':"")+(k?"":' aria-disabled="true"')+' data-day="'+g%7+'" data-full="'+b+'"class="dw-cal-day '+(d?" dw-cal-today":"")+(l.dayClass||"")+(y?" dw-sel":"")+(s?" "+s:"")+(1==c?" dw-cal-day-first":"")+(c==it?" dw-cal-day-last":"")+(p?" dw-cal-day-diff":"")+(k?" dw-cal-day-v dwb-e dwb-nhl":" dw-cal-day-inv")+'"><div class="dw-i '+(y?si:"")+" "+(l.innerDayClass||"")+'"><div class="dw-cal-day-fg">'+c+"<\/div>"+(e.markup||"")+'<div class="dw-cal-day-frame"><\/div><\/div><\/div>';return tt+("<\/div><\/div>"+et+"<\/div>")}function pr(t,i,r){var u=l.getDate(t,i,1),f=l.getYear(u),u=l.getMonth(u),e=f+hu;if(ni){if(oi&&oi.removeClass("dw-sel").removeAttr("aria-selected").find(".dw-i").removeClass(si),cr&&cr.removeClass("dw-sel").removeAttr("aria-selected").find(".dw-i").removeClass(si),oi=n('.dw-cal-year-s[data-val="'+f+'"]',v).addClass("dw-sel").attr("aria-selected","true"),cr=n('.dw-cal-month-s[data-val="'+u+'"]',v).addClass("dw-sel").attr("aria-selected","true"),oi.find(".dw-i").addClass(si),cr.find(".dw-i").addClass(si),ct&&ct.scroll(oi,r),n(".dw-cal-month-s",v).removeClass("dwb-d"),f===yi)for(a=0;a<du;a++)n('.dw-cal-month-s[data-val="'+a+'"]',v).addClass("dwb-d");if(f===or)for(a=gu+1;12>=a;a++)n('.dw-cal-month-s[data-val="'+a+'"]',v).addClass("dwb-d")}for(1==vi.length&&vi.attr("aria-label",f).html(e),a=0;a<w;++a)u=l.getDate(t,i-k+a,1),f=l.getYear(u),u=l.getMonth(u),e=f+hu,n(iu[a]).attr("aria-label",l.monthNames[u]+(li?"":" "+f)).html((!li&&er<fr?e+" ":"")+ur[u]+(!li&&er>fr?" "+e:"")),1<vi.length&&n(vi[a]).html(e);l.getDate(t,i-k-1,1)<rt?di(n(".dw-cal-prev-m",v)):ki(n(".dw-cal-prev-m",v));l.getDate(t,i+w-k,1)>ut?di(n(".dw-cal-next-m",v)):ki(n(".dw-cal-next-m",v));l.getDate(t,i,1).getFullYear()<=rt.getFullYear()?di(n(".dw-cal-prev-y",v)):ki(n(".dw-cal-prev-y",v));l.getDate(t,i,1).getFullYear()>=ut.getFullYear()?di(n(".dw-cal-next-y",v)):ki(n(".dw-cal-next-y",v))}function ki(n){n.removeClass(sf).find(".dw-cal-btn-txt").removeAttr("aria-disabled")}function di(n){n.addClass(sf).find(".dw-cal-btn-txt").attr("aria-disabled","true")}function wr(i,r){if(et&&("calendar"===vt||r)){var o,f,e=l.getDate(p,y,1),u=Math.abs(12*(l.getYear(i)-l.getYear(e))+l.getMonth(i)-l.getMonth(e));t.needsSlide&&u&&(p=l.getYear(i),y=l.getMonth(i),i>e?(f=u>b-k+w-1,y-=f?0:u-b,o="next"):i<e&&(f=u>b+k,y+=f?0:u-b,o="prev"),pt(p,y,o,Math.min(u,b),f,!0));r||(t.trigger("onDayHighlight",[i]),l.highlight&&(n(".dw-sel .dw-i",tt).removeClass(si),n(".dw-sel",tt).removeClass("dw-sel").removeAttr("aria-selected"),n(".dw-cal-week-hl",tt).removeClass("dw-cal-week-hl"),(null!==l.defaultValue||t._hasValue)&&n('.dw-cal-day[data-full="'+i.getFullYear()+"-"+i.getMonth()+"-"+i.getDate()+'"]',tt).addClass("dw-sel").attr("aria-selected","true").find(".dw-i").addClass(si).closest(".dw-cal-row").addClass("dw-cal-week-hl")));t.needsSlide=!0}}function gi(n,i){for(au(n,i),a=0;a<ht;a++)d[a].html(bi(n,i-k-b+a));pu();t.needsRefresh=!1}function yu(t,i,r){var u=b,f=b;if(r){for(;f&&l.getDate(t,i+u+w-k-1,1)>ut;)f--;for(;u&&l.getDate(t,i-f-k,1)<rt;)u--}n.extend(ui.settings,{contSize:w*g,snap:g,minScroll:at-(gt?u:f)*g,maxScroll:at+(gt?f:u)*g});ui.refresh()}function pu(){wi&&ku.html(n(".dw-week-nr-c",d[b]).html());n(".dw-cal-slide-a .dw-cal-day",ri).attr("tabindex",0)}function pt(i,r,u,f,e,o,s){if(i&&ar.push({y:i,m:r,dir:u,slideNr:f,load:e,active:o,callback:s}),!hi){var h=ar.shift(),i=h.y,r=h.m,u="next"===h.dir,f=h.slideNr,e=h.load,o=h.active,s=h.callback||eu,h=l.getDate(i,r,1),i=l.getYear(h),r=l.getMonth(h);if(hi=!0,t.changing=!0,t.trigger("onMonthChange",[i,r]),au(i,r),e)for(a=0;a<w;a++)d[u?ht-w+a:a].html(bi(i,r-k+a));o&&lr.addClass("dw-cal-slide-a");setTimeout(function(){t.ariaMessage(l.monthNames[r]+" "+i);pr(i,r,200);at=u?at-g*f*ci:at+g*f*ci;ui.scroll(at,bt?200:0,function(){setTimeout(function(){var o;if(d.length){if(lr.removeClass("dw-cal-slide-a").attr("aria-hidden","true"),u)for(o=d.splice(0,f),a=0;a<f;a++)d.push(o[a]),br(d[d.length-1],+d[d.length-2].data("curr")+100*ci);else for(o=d.splice(ht-f,f),a=f-1;0<=a;a--)d.unshift(o[a]),br(d[0],+d[1].data("curr")-100*ci);for(a=0;a<f;a++)d[u?ht-f+a:a].html(bi(i,r-k-b+a+(u?ht-f:0))),e&&d[u?a:ht-f+a].html(bi(i,r-k-b+a+(u?0:ht-f)));for(a=0;a<w;a++)d[b+a].addClass("dw-cal-slide-a").removeAttr("aria-hidden");yu(i,r,!0);hi=!1}ar.length?setTimeout(function(){pt()},10):(p=i,y=r,t.changing=!1,n(".dw-cal-day",ri).attr("tabindex",-1),pu(),t.needsRefresh&&t.isVisible()&&et&&gi(p,y),t.trigger("onMonthLoaded",[i,r]),s())},bt?0:200)})},10)}}function hf(){var u=n(this),f=t.live,r=t.getDate(!0),e=u.attr("data-full"),i=e.split("-"),i=new Date(i[0],i[1],i[2]),r=new Date(i.getFullYear(),i.getMonth(),i.getDate(),r.getHours(),r.getMinutes(),r.getSeconds()),o=u.hasClass("dw-sel");(hr||!u.hasClass("dw-cal-day-diff"))&&!1!==t.trigger("onDayChange",[n.extend(uf[e],{date:r,cell:this,selected:o})])&&(t.needsSlide=!1,tu=!0,t.setDate(r,f,.2,!f,!0),l.divergentDayChange&&(ot=!0,i<l.getDate(p,y-k,1)?dr():i>l.getDate(p,y-k+w,0)&&kr(),ot=!1))}function br(n,t){n.data("curr",t);o?n[0].style[h+"Transform"]="translate3d("+(lt?"0,"+t+"%,":t+"%,0,")+"0)":n[0].style[lt?"top":"left"]=t+"%"}function kr(){ot&&l.getDate(p,y+w-k,1)<=ut&&pt(p,++y,"next",1,!1,!0,kr)}function dr(){ot&&l.getDate(p,y-k-1,1)>=rt&&pt(p,--y,"prev",1,!1,!0,dr)}function wu(n){ot&&l.getDate(p,y,1)<=l.getDate(l.getYear(ut)-1,l.getMonth(ut)-sr,1)?pt(++p,y,"next",b,!0,!0,function(){wu(n)}):ot&&!n.hasClass("dwb-d")&&pt(l.getYear(ut),l.getMonth(ut)-sr,"next",b,!0,!0)}function bu(n){ot&&l.getDate(p,y,1)>=l.getDate(l.getYear(rt)+1,l.getMonth(rt)+k,1)?pt(--p,y,"prev",b,!0,!0,function(){bu(n)}):ot&&!n.hasClass("dwb-d")&&pt(l.getYear(rt),l.getMonth(rt)+k,"prev",b,!0,!0)}function nr(n,i){n.hasClass("dw-cal-v")||(n.addClass("dw-cal-v"+(i?"":" dw-cal-p-in")).removeClass("dw-cal-p-out dw-cal-h"),t.trigger("onSelectShow",[]))}function ti(n,t){n.hasClass("dw-cal-v")&&n.removeClass("dw-cal-v dw-cal-p-in").addClass("dw-cal-h"+(t?"":" dw-cal-p-out"))}function tr(n,t){(t||n).hasClass("dw-cal-v")?ti(n):nr(n)}function gr(){n(this).removeClass("dw-cal-p-out dw-cal-p-in")}var ii,a,st,nu,ir,v,ai,tt,ri,g,at,tu,et,it,rr,ku,wt,bt,ur,ui,fi,iu,fr,vi,er,yi,or,du,gu,rt,ut,pi,ru,dt,p,y,uu,fu,nf,tf,ei,vt,hi,ot,w,ht,sr,k,hr,ct,oi,cr,rf=this,lr=[],d=[],ar=[],nt={},uf={},eu=function(){},cf=n.extend({},t.settings),l=n.extend(t.settings,c,cf),lf="full"==l.weekDays?"":"min"==l.weekDays?"Min":"Short",wi=l.weekCounter,ff=l.layout||(/top|bottom/.test(l.display)?"liquid":""),kt="liquid"==ff&&"bubble"!==l.display,ef="modal"==l.display,gt=l.rtl,ci=gt?-1:1,of=kt?null:l.calendarWidth,lt="vertical"==l.swipeDirection,ni=l.quickNav,b=l.preMonths,li="yearMonth"==l.navigation,ou=l.controls.join(","),vr=(!0===l.tabs||!1!==l.tabs&&kt)&&1<l.controls.length,su=!vr&&l.tabs===r&&!kt&&1<l.controls.length,hu=l.yearSuffix||"",si=l.activeClass||"",cu="dw-sel "+(l.activeTabClass||""),lu=l.activeTabInnerClass||"",sf="dwb-d "+(l.disabledClass||""),yt="",ft="";if(ou.match(/calendar/)?et=!0:ni=!1,ou.match(/date/)&&(nt.date=1),ou.match(/time/)&&(nt.time=1),et&&nt.date&&(vr=!0,su=!1),l.layout=ff,l.preset=(nt.date||et?"date":"")+(nt.time?"time":""),"inline"==l.display)n(this).closest('[data-role="page"]').on("pageshow",function(){t.position()});return t.changing=!1,t.needsRefresh=!1,t.needsSlide=!0,t.getDayProps=eu,t.onGenMonth=eu,t.prepareObj=yr,t.refresh=function(){t.changing?t.needsRefresh=!0:t.isVisible()&&et&&gi(p,y)},t.navigate=function(n,i){var r,u,f=t.isVisible();i&&f?wr(n,!0):(r=l.getYear(n),u=l.getMonth(n),f&&(r!=p||u!=y)&&(t.trigger("onMonthChange",[r,u]),pr(r,u),gi(r,u)),p=r,y=u)},t.showMonthView=function(){ni&&!bt&&(ti(ft,!0),ti(yt,!0),nr(wt,!0),bt=!0)},nu=e.datetime.call(this,t),fr=l.dateOrder.search(/m/i),er=l.dateOrder.search(/y/i),n.extend(nu,{ariaMessage:l.calendarText,onMarkupReady:function(e){var c,h,si="";if(v=e,ai=l.display=="inline"?n(this).is("div")?n(this):n(this).parent():t.context,dt=t.getDate(!0),p||(p=l.getYear(dt),y=l.getMonth(dt)),at=0,rr=!0,hi=!1,ur=l.monthNames,vt="calendar",l.minDate?(rt=new Date(l.minDate.getFullYear(),l.minDate.getMonth(),1),pi=l.minDate):pi=rt=new Date(l.startYear,0,1),l.maxDate?(ut=new Date(l.maxDate.getFullYear(),l.maxDate.getMonth(),1),ru=l.maxDate):ru=ut=new Date(l.endYear,11,31,23,59,59),e.addClass("dw-calendar"+(o?"":" dw-cal-no3d")),ir=n(".dw",e),ei=n(".dwcc",e),nt.date?nt.date=n(".dwc",v).eq(0):et&&n(".dwc",v).eq(0).addClass("dwc-hh"),nt.time&&(nt.time=n(".dwc",v).eq(1)),et){for(w=l.months=="auto"?Math.max(1,Math.min(3,Math.floor((of||ai[0].innerWidth||ai.innerWidth())/280))):l.months,ht=w+2*b,sr=Math.floor(w/2),k=Math.round(w/2)-1,hr=l.showDivergentDays===r?w<2:l.showDivergentDays,lt=lt&&w<2,h='<div class="dw-cal-btnw"><div class="'+(gt?"dw-cal-next-m":"dw-cal-prev-m")+' dw-cal-prev dw-cal-btn dwb dwb-e"><div role="button" tabindex="0" class="dw-cal-btn-txt '+(l.btnCalPrevClass||"")+'" aria-label="'+l.prevMonthText+'"><\/div><\/div>',a=0;a<w;++a)h=h+('<div class="dw-cal-btnw-m" style="width: '+100/w+'%"><span role="button" class="dw-cal-month"><\/span><\/div>');for(h=h+('<div class="'+(gt?"dw-cal-prev-m":"dw-cal-next-m")+' dw-cal-next dw-cal-btn dwb dwb-e"><div role="button" tabindex="0" class="dw-cal-btn-txt '+(l.btnCalNextClass||"")+'" aria-label="'+l.nextMonthText+'"><\/div><\/div><\/div>'),li&&(si='<div class="dw-cal-btnw"><div class="'+(gt?"dw-cal-next-y":"dw-cal-prev-y")+' dw-cal-prev dw-cal-btn dwb dwb-e"><div role="button" tabindex="0" class="dw-cal-btn-txt '+(l.btnCalPrevClass||"")+'" aria-label="'+l.prevYearText+'"><\/div><\/div><span role="button" class="dw-cal-year"><\/span><div class="'+(gt?"dw-cal-prev-y":"dw-cal-next-y")+' dw-cal-next dw-cal-btn dwb dwb-e"><div role="button" tabindex="0" class="dw-cal-btn-txt '+(l.btnCalNextClass||"")+'" aria-label="'+l.nextYearText+'"><\/div><\/div><\/div>'),ni&&(yi=l.getYear(rt),or=l.getYear(ut),du=l.getMonth(rt),gu=l.getMonth(ut),fu=Math.ceil((or-yi+1)/12)+2,yt=vu("month",36,24,0,"",l.monthNames,l.monthNamesShort),ft=vu("year",fu*12,or-yi+13,yi,hu)),it='<div class="mbsc-w-p dw-cal-c"><div class="dw-cal '+(w>1?" dw-cal-multi ":"")+(wi?" dw-weeks ":"")+(hr?"":" dw-hide-diff ")+(l.calendarClass||"")+'"><div class="dw-cal-header"><div class="dw-cal-btnc '+(li?"dw-cal-btnc-ym":"dw-cal-btnc-m")+'">'+(er<fr||w>1?si+h:h+si)+'<\/div><\/div><div class="dw-cal-body"><div class="dw-cal-m-c dw-cal-v"><div class="dw-cal-days-c">',st=0;st<w;++st){for(it=it+('<div aria-hidden="true" class="dw-cal-days" style="width: '+100/w+'%"><table cellpadding="0" cellspacing="0"><tr>'),a=0;a<7;a++)it=it+("<th>"+l["dayNames"+lf][(a+l.firstDay)%7]+"<\/th>");it=it+"<\/tr><\/table><\/div>"}for(it=it+('<\/div><div class="dw-cal-anim-c '+(l.calendarClass||"")+'"><div class="dw-week-nrs-c '+(l.weekNrClass||"")+'"><div class="dw-week-nrs"><\/div><\/div><div class="dw-cal-anim">'),a=0;a<w+2*b;a++)it=it+'<div class="dw-cal-slide" aria-hidden="true"><\/div>';it=it+("<\/div><\/div><\/div>"+yt+ft+"<\/div><\/div><\/div>");nt.calendar=n(it)}if(n.each(l.controls,function(t,i){nt[i]=n('<div class="dw-cal-pnl" id="'+(rf.id+"_dw_pnl_"+t)+'"><\/div>').append(n('<div class="dw-cal-pnl-i"><\/div>').append(nt[i])).appendTo(ei)}),c='<div class="dw-cal-tabs"><ul role="tablist">',n.each(l.controls,function(n,t){nt[t]&&(c=c+('<li role="tab" aria-controls="'+(rf.id+"_dw_pnl_"+n)+'" class="dw-cal-tab '+(n?"":cu)+'" data-control="'+t+'"><a href="#" class="dwb-e dwb-nhl dw-i '+(n?"":lu)+'">'+l[t+"Text"]+"<\/a><\/li>"))}),c=c+"<\/ul><\/div>",ei.before(c),tt=n(".dw-cal-anim-c",v),ri=n(".dw-cal-anim",tt),ku=n(".dw-week-nrs",tt),et){for(bt=!0,lr=n(".dw-cal-slide",ri).each(function(t,i){d.push(n(i))}),lr.slice(b,b+w).addClass("dw-cal-slide-a").removeAttr("aria-hidden"),a=0;a<ht;a++)br(d[a],100*(a-b)*ci);gi(p,y);ui=new u.classes.ScrollView(tt[0],{axis:lt?"Y":"X",easing:"",contSize:0,snap:1,maxSnapScroll:b,moveElement:ri,mousewheel:l.mousewheel,swipe:l.swipe,liveSwipe:l.liveSwipe,time:200,lock:!0,onScrollStart:function(n,i){i.settings.scrollLock=t.scrollLock},onScrollEnd:function(n){(n=Math.round((n-at)/g)*ci)&&pt(p,y-n,n>0?"prev":"next",n>0?n:-n)}})}if(iu=n(".dw-cal-month",v),vi=n(".dw-cal-year",v),wt=n(".dw-cal-m-c",v),ni){wt.on("webkitAnimationEnd animationend",gr);yt=n(".dw-cal-month-c",v).on("webkitAnimationEnd animationend",gr);ft=n(".dw-cal-year-c",v).on("webkitAnimationEnd animationend",gr);n(".dw-cal-sc-p",v);uu={axis:lt?"Y":"X",contSize:0,snap:1,maxSnapScroll:1,rtl:l.rtl,mousewheel:l.mousewheel,swipe:l.swipe,liveSwipe:l.liveSwipe,time:200};ct=new u.classes.ScrollView(ft[0],uu);fi=new u.classes.ScrollView(yt[0],uu)}setTimeout(function(){t.tap(tt,function(t){t=n(t.target);hi||ui.scrolled||(t=t.closest(".dw-cal-day",this),t.hasClass("dw-cal-day-v")&&hf.call(t[0]))});n(".dw-cal-btn",v).on("touchstart mousedown keydown",function(t){var r=n(this);if(t.type!=="keydown"?(t.preventDefault(),t=s(t,this)):t=t.keyCode===32,!ot&&t&&!r.hasClass("dwb-d")){ot=!0;r.hasClass("dw-cal-prev-m")?dr():r.hasClass("dw-cal-next-m")?kr():r.hasClass("dw-cal-prev-y")?bu(r):r.hasClass("dw-cal-next-y")&&wu(r);n(i).on("mouseup.dwbtn",function(){n(i).off(".dwbtn");ot=!1})}}).on("touchend touchcancel keyup",function(){ot=!1});n(".dw-cal-tab",v).on("touchstart click",function(i){var r=n(this);s(i,this)&&!r.hasClass("dw-sel")&&(vt=r.attr("data-control"),n(".dw-cal-pnl",v).removeClass("dw-cal-p-in").addClass("dw-cal-pnl-h"),n(".dw-cal-tab",v).removeClass(cu).removeAttr("aria-selected").find(".dw-i").removeClass(lu),r.addClass(cu).attr("aria-selected","true").find(".dw-i").addClass(lu),nt[vt].removeClass("dw-cal-pnl-h").addClass("dw-cal-p-in"),vt==="calendar"?(ii=t.getDate(!0),(ii.getFullYear()!==dt.getFullYear()||ii.getMonth()!==dt.getMonth()||ii.getDate()!==dt.getDate())&&wr(ii)):(dt=t.getDate(!0),t.setDate(dt,!1,0,!0)),t.showMonthView(),t.trigger("onTabChange",[vt]))});ni&&(t.tap(n(".dw-cal-month",v),function(){ft.hasClass("dw-cal-v")||(tr(wt),bt=wt.hasClass("dw-cal-v"));tr(yt);ti(ft)}),t.tap(n(".dw-cal-year",v),function(){ft.hasClass("dw-cal-v")||ct.scroll(oi);yt.hasClass("dw-cal-v")||(tr(wt),bt=wt.hasClass("dw-cal-v"));tr(ft);ti(yt)}),t.tap(n(".dw-cal-month-s",v),function(){fi.scrolled||n(this).hasClass("dwb-d")||t.navigate(l.getDate(p,n(this).attr("data-val"),1))}),t.tap(n(".dw-cal-year-s",v),function(){ct.scrolled||(ii=l.getDate(n(this).attr("data-val"),y,1),t.navigate(new Date(f.constrain(ii,rt,ut))))}),t.tap(ft,function(){ct.scrolled||(ti(ft),nr(wt),bt=!0)}),t.tap(yt,function(){fi.scrolled||(ti(yt),nr(wt),bt=!0)}))},300);kt?e.addClass("dw-cal-liq"):n(".dw-cal",v).width(of||280*w);l.calendarHeight&&n(".dw-cal-anim-c",v).height(l.calendarHeight)},onShow:function(){et&&(pr(p,y),t.trigger("onMonthLoaded",[p,y]))},onPosition:function(i,r,u){var h,o,f,s=0,e=0,c=0;if(kt&&(ef&&tt.height(""),ei.height(""),ri.width("")),g&&(f=g),(g=Math.round(Math.round(parseInt(tt.css(lt?"height":"width")))/w))&&(v.removeClass("mbsc-cal-m mbsc-cal-l"),g>1024?v.addClass("mbsc-cal-l"):g>640&&v.addClass("mbsc-cal-m")),(vr&&(rr||kt)||su)&&(n(".dw-cal-pnl",v).removeClass("dw-cal-pnl-h"),n.each(nt,function(n,t){h=t.outerWidth();s=Math.max(s,h);e=Math.max(e,t.outerHeight());c=c+h}),vr||su&&c>(ai[0].innerWidth||ai.innerWidth())?(o=!0,vt=n(".dw-cal-tabs .dw-sel",v).attr("data-control"),ir.addClass("dw-cal-tabbed")):(vt="calendar",e=s="",ir.removeClass("dw-cal-tabbed"),ei.css({width:"",height:""}))),kt&&ef&&(t._isFullScreen=!0,o&&et&&ei.height(nt.calendar.outerHeight()),i=ir.outerHeight(),u>=i&&tt.height(u-i+tt.outerHeight()),et&&(e=Math.max(e,nt.calendar.outerHeight()))),o&&(ei.css({width:kt?"":s,height:e}),g=Math.round(Math.round(parseInt(tt.css(lt?"height":"width")))/w)),g){if(ri[lt?"height":"width"](g),g!==f){if(li)for(ur=l.maxMonthWidth>n(".dw-cal-btnw-m",v).width()?l.monthNamesShort:l.monthNames,a=0;a<w;++a)n(iu[a]).text(ur[l.getMonth(l.getDate(p,y-k+a,1))]);ni&&(u=ft[lt?"height":"width"](),n.extend(ct.settings,{contSize:u,snap:u,minScroll:(2-fu)*u,maxScroll:-u}),n.extend(fi.settings,{contSize:u,snap:u,minScroll:-u,maxScroll:-u}),ct.refresh(),fi.refresh(),ft.hasClass("dw-cal-v")&&ct.scroll(oi));kt&&!rr&&f&&(u=at/f,at=u*g);yu(p,y,!f)}}else g=f;o&&(n(".dw-cal-pnl",v).addClass("dw-cal-pnl-h"),nt[vt].removeClass("dw-cal-pnl-h"));t.trigger("onCalResize",[]);rr=!1},onHide:function(){ar=[];d=[];y=p=vt=null;hi=!0;g=0;ui&&ui.destroy();ni&&ct&&fi&&(ct.destroy(),fi.destroy())},onValidated:function(){var i,r,n;if(r=t.getDate(!0),tu)i="calendar";else for(n in t.order)n&&t.order[n]===a&&(i=/mdy/.test(n)?"date":"time");t.trigger("onSetDate",[{date:r,control:i}]);wr(r);tu=!1}}),nu}}(jQuery,window,document),function(n,t){var e=n.mobiscroll,o=e.classes,i=e.util,r=i.constrain,s=i.jsPrefix,v=i.prefix,h=i.has3d,u=i.getCoord,y=i.getPosition,p=i.testTouch,f=i.isNumeric,w=i.isString,c="webkitTransitionEnd transitionend",l=window.requestAnimationFrame||function(n){n()},a=window.cancelAnimationFrame||function(){};o.ScrollView=function(i,e,b){function li(t){if((!k.lock||!ri)&&p(t,this)&&!wt){if("mousedown"==t.type&&t.preventDefault(),rt&&rt.removeClass("mbsc-btn-a"),yt=!1,rt=n(t.target).closest(".mbsc-btn-e",this),rt.length&&!rt.hasClass("mbsc-btn-d")&&(yt=!0,ei=setTimeout(function(){rt.addClass("mbsc-btn-a")},100)),wt=!0,pt=!1,d.scrolled=ri,hi=u(t,"X"),ki=u(t,"Y"),si=hi,g=vt=ti=0,bi=new Date,bt=+y(ut,it)||0,ni(bt,1),"mousedown"===t.type)n(document).on("mousemove",dt).on("mouseup",gt);fi("onScrollStart",[ft])}}function dt(n){wt&&(si=u(n,"X"),pi=u(n,"Y"),ti=si-hi,vt=pi-ki,g=it?vt:ti,yt&&(5<Math.abs(vt)||5<Math.abs(ti))&&(clearTimeout(ei),rt.removeClass("mbsc-btn-a"),yt=!1),!pt&&5<Math.abs(g)&&(d.scrolled=!0,k.liveSwipe&&!ht&&(ht=!0,ui=l(ai))),it||k.scrollLock?n.preventDefault():d.scrolled?n.preventDefault():7<Math.abs(vt)&&(pt=!0,d.scrolled=!0,lt.trigger("touchend")))}function ai(){st&&(g=r(g,-nt*st,nt*st));ni(r(bt+g,ot-oi,et+oi));ht=!1}function gt(t){if(wt){var i;i=new Date-bi;a(ui);ht=!1;!pt&&d.scrolled&&(k.momentum&&h&&300>i&&(i=g/i,g=Math.max(Math.abs(g),i*i/k.speedUnit)*(0>g?-1:1)),yi(g));yt&&(clearTimeout(ei),rt.addClass("mbsc-btn-a"),setTimeout(function(){rt.removeClass("mbsc-btn-a")},100),!pt&&!d.scrolled&&fi("onBtnTap",[rt]));"mouseup"==t.type&&n(document).off("mousemove",dt).off("mouseup",gt);wt=!1}}function vi(n){n=n.originalEvent||n;(g=it?n.deltaY||n.wheelDelta||n.detail:n.deltaX)&&(n.preventDefault(),g=0>g?20:-20,bt=ft,ht||(ht=!0,ui=l(ai)),clearTimeout(wi),wi=setTimeout(function(){a(ui);ht=!1;yi(g)},200))}function yi(n){var t;if(st&&(n=r(n,-nt*st,nt*st)),ct=Math.round((bt+n)/nt),t=r(ct*nt,ot,et),tt){if(0>n){for(n=tt.length-1;0<=n;n--)if(Math.abs(t)+at>=tt[n].breakpoint){ct=n;ci=2;t=tt[n].snap2;break}}else if(0<=n)for(n=0;n<tt.length;n++)if(Math.abs(t)<=tt[n].breakpoint){ct=n;ci=1;t=tt[n].snap1;break}t=r(t,ot,et)}ni(t,k.time||(ft<ot||ft>et?200:Math.max(200,Math.abs(t-ft)*k.timeUnit)),function(){fi("onScrollEnd",[ft])})}function ni(n,t,i){var r=function(){ri=!1;i&&i()};if(ri=!0,h)if(kt[s+"Transition"]=t?v+"transform "+Math.round(t)+"ms "+k.easing:"",kt[s+"Transform"]="translate3d("+(it?"0,"+n+"px,":n+"px,0,")+"0)",ft!=n&&t){if(t)ut.on(c,function(n){n.target===ut[0]&&(ut.off(c),kt[s+"Transition"]="",r())})}else r();else setTimeout(r,t||0),kt[ii]=n+"px";ft=n}var rt,ei,at,ti,vt,g,ii,oi,si,pi,yt,et,st,ot,pt,wt,ri,ui,ht,wi,nt,tt,bt,bi,hi,ki,kt,ut,fi,it,d=this,ft=0,ct=0,ci=1,k=e,lt=n(i);o.Base.call(this,i,e,!0);d.scrolled=!1;d.scroll=function(t,u,e){t=f(t)?Math.round(t/nt)*nt:Math.ceil((n(t,i).length?Math.round(ut.offset()[ii]-n(t,i).offset()[ii]):ft)/nt)*nt;ct=Math.round(t/nt);ni(r(t,ot,et),u,e)};d.refresh=function(){var n;at=k.contSize===t?it?lt.height():lt.width():k.contSize;ot=k.minScroll===t?it?at-ut.height():at-ut.width():k.minScroll;et=k.maxScroll===t?0:k.maxScroll;!it&&k.rtl&&(n=et,et=-ot,ot=-n);w(k.snap)&&(tt=[],ut.find(k.snap).each(function(){var n=it?this.offsetTop:this.offsetLeft,t=it?this.offsetHeight:this.offsetWidth;tt.push({breakpoint:n+t/2,snap1:-n,snap2:at-n-t})}));nt=f(k.snap)?k.snap:1;st=k.snap?k.maxSnapScroll:0;oi=k.elastic?f(k.snap)?nt:f(k.elastic)?k.elastic:0:0;d.scroll(k.snap?tt?tt[ct]["snap"+ci]:ct*nt:ft)};d.init=function(n){if(d._init(n),ii=(it="Y"==k.axis)?"top":"left",ut=k.moveElement||lt.children().eq(0),kt=ut[0].style,d.refresh(),k.swipe)lt.on("touchstart mousedown",li).on("touchmove",dt).on("touchend touchcancel",gt);if(k.mousewheel)lt.on("wheel mousewheel",vi);i.addEventListener&&i.addEventListener("click",function(n){d.scrolled&&(n.stopPropagation(),n.preventDefault())},!0)};d.destroy=function(){lt.off("touchstart mousedown",li).off("touchmove",dt).off("touchend touchcancel",gt).off("wheel mousewheel",vi);d._destroy()};k=d.settings;fi=d.trigger;b||d.init(e)};o.ScrollView.prototype={_class:"scrollview",_defaults:{speedUnit:.0022,timeUnit:.8,axis:"Y",easing:"ease-out",swipe:!0,liveSwipe:!0,momentum:!0,elastic:!0}};e.presetShort("scrollview","ScrollView",!1)}(jQuery),function(n,t){var r=n.mobiscroll,i=r.datetime,u=new Date,f={startYear:u.getFullYear()-100,endYear:u.getFullYear()+1,separator:" ",dateFormat:"mm/dd/yy",dateOrder:"mmddy",timeWheels:"hhiiA",timeFormat:"hh:ii A",dayText:"Day",monthText:"Month",yearText:"Year",hourText:"Hours",minuteText:"Minutes",ampmText:"&nbsp;",secText:"Seconds",nowText:"Now"},e=function(u){function v(n,i,r){return a[i]!==t?+n[a[i]]:gt[i]!==t?gt[i]:r!==t?r:pt[i](pi)}function nt(n,t,i,r){n.push({values:i,keys:t,label:r})}function tt(n,t,i,r){return Math.min(r,Math.floor(n/t)*t+i)}function ot(n){if(null===n)return n;var t=v(n,"y"),i=v(n,"m"),u=Math.min(v(n,"d",1),e.getMaxDayOfMonth(t,i)),r=v(n,"h",0);return e.getDate(t,i,u,v(n,"a",0)?r+12:r,v(n,"i",0),v(n,"s",0),v(n,"u",0))}function ai(n,t){var i,r,f=!1,u=!1,e=0,o=0;if(y=ot(yt(y)),d=ot(yt(d)),vt(n))return n;if(n<y&&(n=y),n>d&&(n=d),r=i=n,2!==t)for(f=vt(i);!f&&i<d;)i=new Date(i.getTime()+864e5),f=vt(i),e++;if(1!==t)for(u=vt(r);!u&&r>y;)r=new Date(r.getTime()-864e5),u=vt(r),o++;return 1===t&&f?i:2===t&&u?r:o<=e&&u?r:i}function vt(n){return n<y||n>d?!1:ri(n,bt)?!0:ri(n,wt)?!1:!0}function ri(n,t){var r,u,i;if(t)for(u=0;u<t.length;u++)if(r=t[u],i=r+"",!r.start)if(r.getTime){if(n.getFullYear()==r.getFullYear()&&n.getMonth()==r.getMonth()&&n.getDate()==r.getDate())return!0}else if(i.match(/w/i)){if(i=+i.replace("w",""),i==n.getDay())return!0}else if(i=i.split("/"),i[1]){if(i[0]-1==n.getMonth()&&i[1]==n.getDate())return!0}else if(i[0]==n.getDate())return!0;return!1}function ui(n,t,i,r,u,f,o){var l,c,s;if(n)for(l=0;l<n.length;l++)if(c=n[l],s=c+"",!c.start)if(c.getTime)e.getYear(c)==t&&e.getMonth(c)==i&&(f[e.getDay(c)-1]=o);else if(s.match(/w/i))for(s=+s.replace("w",""),h=s-r;h<u;h+=7)0<=h&&(f[h]=o);else s=s.split("/"),s[1]?s[0]-1==i&&(f[s[1]-1]=o):f[s[0]-1]=o}function fi(i,r,u,f,o,s,h,c,l){var d,et,nt,v,y,it,ut,p,w,a,ot,st,yt,pt,ct,wt,bt,vt,gt={},ft={h:at,i:g,s:ni,a:1},kt=e.getDate(o,s,h),k=["a","h","i","s"];i&&(n.each(i,function(n,t){t.start&&(t.apply=!1,d=t.d,et=d+"",nt=et.split("/"),d&&(d.getTime&&o==e.getYear(d)&&s==e.getMonth(d)&&h==e.getDay(d)||!et.match(/w/i)&&(nt[1]&&h==nt[1]&&s==nt[0]-1||!nt[1]&&h==nt[0])||et.match(/w/i)&&kt.getDay()==+et.replace("w","")))&&(t.apply=!0,gt[kt]=!0)}),n.each(i,function(i,f){if(ot=pt=yt=0,st=t,ut=it=!0,ct=!1,f.start&&(f.apply||!f.d&&!gt[kt])){for(v=f.start.split(":"),y=f.end.split(":"),a=0;3>a;a++)v[a]===t&&(v[a]=0),y[a]===t&&(y[a]=59),v[a]=+v[a],y[a]=+y[a];for(v.unshift(11<v[0]?1:0),y.unshift(11<y[0]?1:0),lt&&(12<=v[1]&&(v[1]-=12),12<=y[1]&&(y[1]-=12)),a=0;a<r;a++)rt[a]!==t&&(p=tt(v[a],ft[k[a]],ht[k[a]],b[k[a]]),w=tt(y[a],ft[k[a]],ht[k[a]],b[k[a]]),vt=bt=wt=0,lt&&1==a&&(wt=v[0]?12:0,bt=y[0]?12:0,vt=rt[0]?12:0),it||(p=0),ut||(w=b[k[a]]),(it||ut)&&p+wt<rt[a]+vt&&rt[a]+vt<w+bt&&(ct=!0),rt[a]!=p&&(it=!1),rt[a]!=w&&(ut=!1));if(!l)for(a=r+1;4>a;a++)0<v[a]&&(yt=ft[u]),y[a]<b[k[a]]&&(pt=ft[u]);ct||(p=tt(v[r],ft[u],ht[u],b[u])+yt,w=tt(y[r],ft[u],ht[u],b[u])-pt,it&&(ot=0>p?0:p>b[u]?n(".dw-li",c).length:dt(c,p)+0),ut&&(st=0>w?0:w>b[u]?n(".dw-li",c).length:dt(c,w)+1));(it||ut||ct)&&(l?n(".dw-li",c).slice(ot,st).addClass("dw-v"):n(".dw-li",c).slice(ot,st).removeClass("dw-v"))}}))}function dt(t,i){return n(".dw-li",t).index(n('.dw-li[data-val="'+i+'"]',t))}function yt(i,r){var u=[];return null===i||i===t?i:(n.each("y,m,d,a,h,i,s,u".split(","),function(n,f){a[f]!==t&&(u[a[f]]=pt[f](i));r&&(gt[f]=pt[f](i))}),u)}function ei(n){var r,i,t,u=[];if(n){for(r=0;r<n.length;r++)if(i=n[r],i.start&&i.start.getTime)for(t=new Date(i.start);t<=i.end;)u.push(new Date(t.getFullYear(),t.getMonth(),t.getDate())),t.setDate(t.getDate()+1);else u.push(i);return u}return n}var s=n(this),it={},p,w;if(s.is("input")){switch(s.attr("type")){case"date":p="yy-mm-dd";break;case"datetime":p="yy-mm-ddTHH:ii:ssZ";break;case"datetime-local":p="yy-mm-ddTHH:ii:ss";break;case"month":p="yy-mm";it.dateOrder="mmyy";break;case"time":p="HH:ii:ss"}w=s.attr("min");s=s.attr("max");w&&(it.minDate=i.parseDate(p,w));s&&(it.maxDate=i.parseDate(p,s))}var o,h,c,l,st,oi,si,ht,b,w=n.extend({},u.settings),e=n.extend(u.settings,r.datetime.defaults,f,it,w),k=0,rt=[],it=[],ut=[],a={},gt={},pt={y:function(n){return e.getYear(n)},m:function(n){return e.getMonth(n)},d:function(n){return e.getDay(n)},h:function(n){return n=n.getHours(),n=lt&&12<=n?n-12:n,tt(n,at,kt,hi)},i:function(n){return tt(n.getMinutes(),g,et,ci)},s:function(n){return tt(n.getSeconds(),ni,ii,li)},u:function(n){return n.getMilliseconds()},a:function(n){return yi&&11<n.getHours()?1:0}},wt=e.invalid,bt=e.valid,w=e.preset,ct=e.dateOrder,ft=e.timeWheels,vi=ct.match(/D/),yi=ft.match(/a/i),lt=ft.match(/h/),ti="datetime"==w?e.dateFormat+e.separator+e.timeFormat:"time"==w?e.timeFormat:e.dateFormat,pi=new Date,s=e.steps||{},at=s.hour||e.stepHour||1,g=s.minute||e.stepMinute||1,ni=s.second||e.stepSecond||1,s=s.zeroBased,y=e.minDate||new Date(e.startYear,0,1),d=e.maxDate||new Date(e.endYear,11,31,23,59,59),kt=s?0:y.getHours()%at,et=s?0:y.getMinutes()%g,ii=s?0:y.getSeconds()%ni,hi=Math.floor(((lt?11:23)-kt)/at)*at+kt,ci=Math.floor((59-et)/g)*g+et,li=Math.floor((59-et)/g)*g+et;if(p=p||ti,w.match(/date/i)){for(n.each(["y","m","d"],function(n,t){o=ct.search(RegExp(t,"i"));-1<o&&ut.push({o:o,v:t})}),ut.sort(function(n,t){return n.o>t.o?1:-1}),n.each(ut,function(n,t){a[t.v]=n}),s=[],h=0;3>h;h++)if(h==a.y){for(k++,l=[],c=[],st=e.getYear(y),oi=e.getYear(d),o=st;o<=oi;o++)c.push(o),l.push((ct.match(/yy/i)?o:(o+"").substr(2,2))+(e.yearSuffix||""));nt(s,c,l,e.yearText)}else if(h==a.m){for(k++,l=[],c=[],o=0;12>o;o++)st=ct.replace(/[dy]/gi,"").replace(/mm/,(9>o?"0"+(o+1):o+1)+(e.monthSuffix||"")).replace(/m/,o+1+(e.monthSuffix||"")),c.push(o),l.push(st.match(/MM/)?st.replace(/MM/,'<span class="dw-mon">'+e.monthNames[o]+"<\/span>"):st.replace(/M/,'<span class="dw-mon">'+e.monthNamesShort[o]+"<\/span>"));nt(s,c,l,e.monthText)}else if(h==a.d){for(k++,l=[],c=[],o=1;32>o;o++)c.push(o),l.push((ct.match(/dd/i)&&10>o?"0"+o:o)+(e.daySuffix||""));nt(s,c,l,e.dayText)}it.push(s)}if(w.match(/time/i)){for(si=!0,ut=[],n.each(["h","i","s","a"],function(n,t){n=ft.search(RegExp(t,"i"));-1<n&&ut.push({o:n,v:t})}),ut.sort(function(n,t){return n.o>t.o?1:-1}),n.each(ut,function(n,t){a[t.v]=k+n}),s=[],h=k;h<k+4;h++)if(h==a.h){for(k++,l=[],c=[],o=kt;o<(lt?12:24);o+=at)c.push(o),l.push(lt&&0===o?12:ft.match(/hh/i)&&10>o?"0"+o:o);nt(s,c,l,e.hourText)}else if(h==a.i){for(k++,l=[],c=[],o=et;60>o;o+=g)c.push(o),l.push(ft.match(/ii/)&&10>o?"0"+o:o);nt(s,c,l,e.minuteText)}else if(h==a.s){for(k++,l=[],c=[],o=ii;60>o;o+=ni)c.push(o),l.push(ft.match(/ss/)&&10>o?"0"+o:o);nt(s,c,l,e.secText)}else h==a.a&&(k++,w=ft.match(/A/),nt(s,[0,1],w?[e.amText.toUpperCase(),e.pmText.toUpperCase()]:[e.amText,e.pmText],e.ampmText));it.push(s)}return u.getVal=function(n){return u._hasValue||n?ot(u.getArrayVal(n)):null},u.setDate=function(n,t,i,r,f){u.setArrayVal(yt(n),t,f,r,i)},u.getDate=u.getVal,u.format=ti,u.order=a,u.handlers.now=function(){u.setDate(new Date,!1,.3,!0,!0)},u.buttons.now={text:e.nowText,handler:"now"},wt=ei(wt),bt=ei(bt),ht={y:y.getFullYear(),m:0,d:1,h:kt,i:et,s:ii,a:0},b={y:d.getFullYear(),m:11,d:31,h:hi,i:ci,s:li,a:1},{wheels:it,headerText:e.headerText?function(){return i.formatDate(ti,ot(u.getArrayVal(!0)),e)}:!1,formatValue:function(n){return i.formatDate(p,ot(n),e)},parseValue:function(n){return n||(gt={}),yt(n?i.parseDate(p,n,e):e.defaultValue||new Date,!!n&&!!n.getTime)},validate:function(i,r,f,o){var r=ai(ot(u.getArrayVal(!0)),o),s=yt(r),h=v(s,"y"),c=v(s,"m"),l=!0,p=!0;n.each("y,m,d,a,h,i,s".split(","),function(r,u){var nt,tt;if(a[u]!==t){var o=ht[u],f=b[u],g=31,w=v(s,u),k=n(".dw-ul",i).eq(a[u]);u=="d"&&(f=g=e.getMaxDayOfMonth(h,c),vi&&n(".dw-li",k).each(function(){var i=n(this),t=i.data("val"),r=e.getDate(h,c,t).getDay(),t=ct.replace(/[my]/gi,"").replace(/dd/,(t<10?"0"+t:t)+(e.daySuffix||"")).replace(/d/,t+(e.daySuffix||""));n(".dw-i",i).html(t.match(/DD/)?t.replace(/DD/,'<span class="dw-day">'+e.dayNames[r]+"<\/span>"):t.replace(/D/,'<span class="dw-day">'+e.dayNamesShort[r]+"<\/span>"))}));l&&y&&(o=pt[u](y));p&&d&&(f=pt[u](d));u!="y"&&(nt=dt(k,o),tt=dt(k,f),n(".dw-li",k).removeClass("dw-v").slice(nt,tt+1).addClass("dw-v"),u=="d"&&n(".dw-li",k).removeClass("dw-h").slice(g).addClass("dw-h"));w<o&&(w=o);w>f&&(w=f);l&&(l=w==o);p&&(p=w==f);u=="d"&&(o=e.getDate(h,c,1).getDay(),f={},ui(wt,h,c,o,g,f,1),ui(bt,h,c,o,g,f,0),n.each(f,function(t,i){i&&n(".dw-li",k).eq(t).removeClass("dw-v")}))}});si&&n.each(["a","h","i","s"],function(r,f){var y=v(s,f),l=v(s,"d"),e=n(".dw-ul",i).eq(a[f]);a[f]!==t&&(fi(wt,r,f,s,h,c,l,e,0),fi(bt,r,f,s,h,c,l,e,1),rt[r]=+u.getValidCell(y,e,o).val)});u._tempWheelArray=s}}};n.each(["date","time","datetime"],function(n,t){r.presets.scroller[t]=e})}(jQuery),function(n,t,i,r){var f=n.mobiscroll,u=n.extend,s=f.util,e=f.datetime,o=f.presets.scroller,h={labelsShort:"Yrs,Mths,Days,Hrs,Mins,Secs".split(","),fromText:"Start",toText:"End",eventText:"event",eventsText:"events"};f.presetShort("calendar");o.calendar=function(i){function wt(i){if(i){if(at[i])return at[i];var u=n('<div style="background-color:'+i+';"><\/div>').appendTo("body"),r=(t.getComputedStyle?getComputedStyle(u[0]):u[0].style).backgroundColor.replace(/rgb|rgba|\(|\)|\s/g,"").split(","),r=130<.299*r[0]+.587*r[1]+.114*r[2]?"#000":"#fff";return u.remove(),at[i]=r}}function bt(n){return n.sort(function(n,t){var i=n.d||n.start,r=t.d||t.start,i=i.getTime?n.start&&n.end&&n.start.toDateString()!==n.end.toDateString()?1:i.getTime():0,r=r.getTime?t.start&&t.end&&t.start.toDateString()!==t.end.toDateString()?1:r.getTime():0;return i-r})}function kt(t){var r=n(".dw-cal-c",it).outerHeight();var f=t.outerHeight(),e=t.outerWidth(),u=t.offset().top-n(".dw-cal-c",it).offset().top,i=2>t.closest(".dw-cal-row").index();r=y.addClass("dw-cal-events-t").css({top:i?u+f:"0",bottom:i?"0":r-u}).addClass("dw-cal-events-v").height();y.css(i?"bottom":"top","auto").removeClass("dw-cal-events-t");ot.css("max-height",r);rt.refresh();rt.scroll(0);i?y.addClass("dw-cal-events-b"):y.removeClass("dw-cal-events-b");n(".dw-cal-events-arr",y).css("left",t.offset().left-y.offset().left+e/2)}function dt(t,r){var o=d[t],s,h,l,u,a,e;o&&(e='<ul class="dw-cal-event-list">',k=r,r.addClass(ii).find(".dw-i").addClass(ct),r.hasClass(vt)&&r.attr("data-hl","true").removeClass(vt),bt(o),n.each(o,function(n,t){var p,w,i;if(u=t.d||t.start,a=t.start&&t.end&&t.start.toDateString()!==t.end.toDateString(),l=t.color,wt(l),h=s="",u.getTime&&(s=f.datetime.formatDate((a?"MM d yy ":"")+c.timeFormat,u)),t.end&&(h=f.datetime.formatDate((a?"MM d yy ":"")+c.timeFormat,t.end)),p=e,w='<li role="button" aria-label="'+t.text+(s?", "+c.fromText+" "+s:"")+(h?", "+c.toText+" "+h:"")+'" class="dw-cal-event"><div class="dw-cal-event-color" style="'+(l?"background:"+l+";":"")+'"><\/div><div class="dw-cal-event-text">'+(u.getTime&&!a?'<div class="dw-cal-event-time">'+f.datetime.formatDate(c.timeFormat,u)+"<\/div>":"")+t.text+"<\/div>",t.start&&t.end){i=c.labelsShort;var o=Math.abs(t.end-t.start)/1e3,v=o/60,y=v/60,r=y/24,b=r/365;i='<div class="dw-cal-event-dur">'+(45>o&&Math.round(o)+" "+i[5].toLowerCase()||45>v&&Math.round(v)+" "+i[4].toLowerCase()||24>y&&Math.round(y)+" "+i[3].toLowerCase()||30>r&&Math.round(r)+" "+i[2].toLowerCase()||365>r&&Math.round(r/30)+" "+i[1].toLowerCase()||Math.round(b)+" "+i[0].toLowerCase())+"<\/div>"}else i="";e=p+(w+i+"<\/li>")}),e+="<\/ul>",lt.html(e),kt(k),i.tap(n(".dw-cal-event",lt),function(r){rt.scrolled||i.trigger("onEventSelect",[r,o[n(this).index()],t])}),st=!0,i.trigger("onEventBubbleShow",[k,y]))}function tt(){y&&y.removeClass("dw-cal-events-v");k&&(k.removeClass(ii).find(".dw-i").removeClass(ct),k.attr("data-hl")&&k.removeAttr("data-hl").addClass(vt));st=!1}function g(n){return new Date(n.getFullYear(),n.getMonth(),n.getDate())}function gt(n){if(l={},n&&n.length)for(p=0;p<n.length;p++)l[g(n[p])]=n[p]}function b(){a&&tt();i.refresh()}var et,it,y,k,d,rt,ot,lt,st,ni,p,ht,ti,nt,ut,at={};nt=u({},i.settings);var c=u(i.settings,h,nt),ii="dw-sel dw-cal-day-ev",vt="dw-cal-day-hl",ct=c.activeClass||"",v=c.multiSelect||"week"==c.selectType,yt=c.markedDisplay,ft=!0===c.events||!0===c.markedText,pt=0,l={},a=n.isArray(c.events),w=a?u(!0,[],c.events):[];if(nt=o.calbase.call(this,i),et=u({},nt),ni=c.firstSelectDay===r?c.firstDay:c.firstSelectDay,c.selectedValues)for(p=0;p<c.selectedValues.length;p++)l[g(c.selectedValues[p])]=c.selectedValues[p];return a&&n.each(w,function(n,t){t._id===r&&(t._id=pt++)}),i.onGenMonth=function(n,t){d=i.prepareObj(w,n,t);ht=i.prepareObj(c.marked,n,t)},i.getDayProps=function(t){for(var h=v?l[t]!==r:a?t.getTime()===(new Date).setHours(0,0,0,0):r,u=ht[t]?ht[t][0]:!1,i=d[t]?d[t][0]:!1,e=u||i,u=u.text||(i?d[t].length+" "+(1<d[t].length?c.eventsText:c.eventText):0),i=ht[t]||d[t]||[],f=e.color,y=ft&&u?wt(f):"",o="",s='<div class="dw-cal-day-m"'+(f?' style="background-color:'+f+";border-color:"+f+" "+f+' transparent transparent"':"")+"><\/div>",t=0;t<i.length;t++)i[t].icon&&(o+='<span class="mbsc-ic mbsc-ic-'+i[t].icon+'"'+(i[t].text?"":i[t].color?' style="color:'+i[t].color+';"':"")+"><\/span>\n");if("bottom"==yt){for(s='<div class="dw-cal-day-m"><div class="dw-cal-day-m-t">',t=0;t<i.length;t++)s+='<div class="dw-cal-day-m-c"'+(i[t].color?' style="background:'+i[t].color+';"':"")+"><\/div>";s+="<\/div><\/div>"}return{marked:e,selected:a?!1:h,cssClass:a&&h?"dw-cal-day-hl":e?"dw-cal-day-marked":"",ariaLabel:ft||a?u:"",markup:ft&&u?'<div class="dw-cal-day-txt-c"><div class="dw-cal-day-txt '+(c.eventTextClass||"")+'" title="'+n("<div>"+u+"<\/div>").text()+'"'+(f?' style="background:'+f+";color:"+y+';text-shadow:none;"':"")+">"+o+u+"<\/div><\/div>":ft&&o?'<div class="dw-cal-day-ic-c">'+o+"<\/div>":e?s:""}},i.addValue=function(n){l[g(n)]=n;b()},i.removeValue=function(n){delete l[g(n)];b()},i.setVal=function(n,t,r,u,f){v&&(gt(n),n=n?n[0]:null);i.setDate(n,t,f,u,r);b()},i.getVal=function(n){return v?s.objectToArray(l):i.getDate(n)},i.setValues=function(n,t){i.setDate(n?n[0]:null,t);gt(n);b()},i.getValues=function(){return v?i.getVal():[i.getDate()]},a&&(i.addEvent=function(t){var i=[],t=u(!0,[],n.isArray(t)?t:[t]);return n.each(t,function(n,t){t._id===r&&(t._id=pt++);w.push(t);i.push(t._id)}),b(),i},i.removeEvent=function(t){t=n.isArray(t)?t:[t];n.each(t,function(t,i){n.each(w,function(n,t){if(t._id===i)return w.splice(n,1),!1})});b()},i.getEvents=function(n){var t;return n?(n.setHours(0,0,0,0),t=i.prepareObj(w,n.getFullYear(),n.getMonth()),t[n]?bt(t[n]):[]):w},i.setEvents=function(t){var i=[];return w=u(!0,[],t),n.each(w,function(n,t){t._id===r&&(t._id=pt++);i.push(t._id)}),b(),i}),u(nt,{highlight:!v&&!a,divergentDayChange:!v&&!a,buttons:a&&"inline"!==c.display?["cancel"]:c.buttons,parseValue:function(n){var t,r;if(v&&n){for(l={},n=n.split(","),t=0;t<n.length;t++)r=e.parseDate(i.format,n[t].replace(/^\s+|\s+$/g,""),c),l[g(r)]=r;n=n[0]}return et.parseValue.call(this,n)},formatValue:function(n){var t,r=[];if(v){for(t in l)r.push(e.formatDate(i.format,l[t],c));return r.join(", ")}return et.formatValue.call(this,n)},onClear:function(){v&&(l={},i.refresh())},onBeforeShow:function(){a&&(c.headerText=!1);c.closeOnSelect&&(c.divergentDayChange=!1);c.counter&&v&&(c.headerText=function(){var t=0,i=c.selectType=="week"?7:1;return n.each(l,function(){t++}),t=Math.round(t/i),t+" "+(t>1?c.selectedPluralText||c.selectedText:c.selectedText)})},onMarkupReady:function(t){et.onMarkupReady.call(this,t);it=t;v&&(n(".dwv",t).attr("aria-live","off"),ti=u({},l));ft&&n(".dw-cal",t).addClass("dw-cal-ev");yt&&n(".dw-cal",t).addClass("dw-cal-m-"+yt);a&&(t.addClass("dw-cal-em"),y=n('<div class="dw-cal-events '+(c.eventBubbleClass||"")+'"><div class="dw-cal-events-arr"><\/div><div class="dw-cal-events-i"><div class="dw-cal-events-sc"><\/div><\/div><\/div>').appendTo(n(".dw-cal-c",t)),ot=n(".dw-cal-events-i",y),lt=n(".dw-cal-events-sc",y),rt=new f.classes.ScrollView(ot[0]),st=!1,i.tap(ot,function(){rt.scrolled||tt()}))},onMonthChange:function(){a&&tt()},onSelectShow:function(){a&&tt()},onMonthLoaded:function(){ut&&(dt(ut.d,n('.dw-cal-day-v[data-full="'+ut.full+'"]:not(.dw-cal-day-diff)',it)),ut=!1)},onDayChange:function(t){var s=t.date,r=g(s),e=n(t.cell),t=t.selected,u,o,f;if(a)tt(),e.hasClass("dw-cal-day-ev")||setTimeout(function(){i.changing?ut={d:r,full:e.attr("data-full")}:dt(r,e)},10);else if(v)if(c.selectType=="week"){for(f=r.getDay()-ni,f=f<0?7+f:f,c.multiSelect||(l={}),u=0;u<7;u++)o=new Date(r.getFullYear(),r.getMonth(),r.getDate()-f+u),t?delete l[o]:l[o]=o;b()}else u=n('.dw-cal .dw-cal-day[data-full="'+e.attr("data-full")+'"]',it),t?(u.removeClass("dw-sel").removeAttr("aria-selected").find(".dw-i").removeClass(ct),delete l[r]):(u.addClass("dw-sel").attr("aria-selected","true").find(".dw-i").addClass(ct),l[r]=r);if(!a&&!c.multiSelect&&c.closeOnSelect&&c.display!=="inline")return i.needsSlide=!1,i.setDate(s),i.select(),!1},onCalResize:function(){st&&kt(k)},onCancel:function(){!i.live&&v&&(l=u({},ti))}}),nt}}(jQuery,window,document);var kendo=kendo||{data:{binders:{source:{extend:function(){}}},Binder:{extend:function(){}}}},mobiscroll=mobiscroll||{};mobiscroll.kendo={},function(n){mobiscroll.kendo.preventUpdate={};mobiscroll.kendo.getMobiBinder=function(t,i,r,u,f,e){function o(t,i,r){mobiscroll.kendo.preventUpdate[n(r).attr("id")]=!0;t.set(n(r).mobiscroll("getVal"));delete mobiscroll.kendo.preventUpdate[n(r).attr("id")]}function s(t,i){mobiscroll.kendo.preventUpdate[n(t).attr("id")]||n(t).mobiscroll("setVal",i,!0,!1)}function h(r,u,e){kendo.data.Binder.fn.init.call(this,r,u,e);var e=mobiscroll.kendo.getMobiInitObject(r,u,t,i,f),o=this;n(o.element).on("change",function(){o.change(u,r)}).mobiscroll(e)}return r||(r=s),u||(u=o),e||(e=h),{init:e,refresh:function(n){var i=this.bindings[t].get();r(this.element,i,n?n.action:void 0)},change:function(n,i){u(this.bindings[t],n,i)}}};mobiscroll.kendo.getMobiInitObject=function(t,i,r,u,f){var t=n(t).data("mobiscroll-options"),e={};return t&&(e=new Function("$root","return "+t)(i[r].parents[0])),n.extend(!0,"string"==typeof u?{preset:u}:u,e,f||{})};kendo.data.binders["mobiscroll-scroller"]=kendo.data.Binder.extend(mobiscroll.kendo.getMobiBinder("mobiscroll-scroller","scroller"))}(jQuery),function(n){var i,t,u,r=n.mobiscroll,f=r.themes;t=navigator.userAgent.match(/Android|iPhone|iPad|iPod|Windows|Windows Phone|MSIE/i);/Android/i.test(t)?(i="android-holo",t=navigator.userAgent.match(/Android\s+([\d\.]+)/i))&&(t=t[0].replace("Android ",""),i=5<=t.split(".")[0]?"material":4<=t.split(".")[0]?"android-holo":"android"):/iPhone/i.test(t)||/iPad/i.test(t)||/iPod/i.test(t)?(i="ios",t=navigator.userAgent.match(/OS\s+([\d\_]+)/i))&&(t=t[0].replace(/_/g,".").replace("OS ",""),i="7"<=t?"ios":"ios-classic"):(/Windows/i.test(t)||/MSIE/i.test(t)||/Windows Phone/i.test(t))&&(i="wp");n.each(f,function(t,f){return n.each(f,function(n,t){if(t.baseTheme==i)return r.autoTheme=n,u=!0,!1;n==i&&(r.autoTheme=n)}),u?!1:void 0})}(jQuery),function(n){kendo.data.binders["mobiscroll-calendar"]=kendo.data.Binder.extend(mobiscroll.kendo.getMobiBinder("mobiscroll-calendar","calendar"));kendo.data.binders["mobiscroll-event-calendar"]=kendo.data.Binder.extend(mobiscroll.kendo.getMobiBinder("mobiscroll-event-calendar","calendar",function(t,i){if(void 0!==i){var r=n(t);r.mobiscroll("setEvents",i);r.val(r.mobiscroll("getInst")._value)}},function(){},{events:[]}))}(jQuery);
(function(n){n.mobiscroll.i18n.ar={rtl:!0,setText:"workportal-general-button-label-ok",cancelText:"workportal-general-button-label-cancel",clearText:"workportal-widget-query-form-clear-button",selectedText:"workportal-widget-query-form-selected",dateFormat:"dd/mm/yy",dateOrder:"ddmmyy",dayNames:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],dayNamesShort:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],dayNamesMin:["S","M","T","W","T","F","S"],dayText:"reports-general-day",hourText:"workportal-hours",minuteText:"bz-rp-sensorsedt-formfield-minute",monthNames:["January","February","March","April","May","June","July","August","September","October","November","December"],monthNamesShort:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],monthText:"reports-general-month",secText:"ثواني",amText:"am",pmText:"pm",timeFormat:"hh:ii A",timeWheels:"hhiiA",yearText:"reports-general-year",nowText:"render-timeentry-now",firstDay:0,dateText:"workportal-widget-activity-log-table-details-title-date",timeText:"workportal-project-plan-time-title",calendarText:"workportal-widget-admin-users-requests-table-titles-date",closeText:"workportal-case-dialog-box-close",todayText:"workportal-taskfeed-today",prevMonthText:"Previous Month",nextMonthText:"Next Month",prevYearText:"Previous Year",nextYearText:"Next Year",eventText:"workportal-project-user-event",eventsText:"workportal-project-events-title",fromText:"workportal-project-plan-action-execute-plan",toText:"workportal-widget-admin-users-titles-To-text",wholeText:"كامل",fractionText:"جزء",unitText:"وحدة",delimiter:"/",decimalSeparator:".",thousandsSeparator:",",labels:["Years","Months","Days","Hours","Minutes","Seconds",""],labelsShort:["Yrs","Mths","Days","Hrs","Mins","Secs",""],startText:"workportal-project-plan-action-execute-plan",stopText:"توقف",resetText:"workportal-widget-admin-language-widget-reset",lapText:"Lap",hideText:"إخفاء",backText:"الى الخلف",undoText:"فك"};$.mobiscroll.i18n.en=$.mobiscroll.i18n["en-US"]={rtl:!1,setText:"Set",cancelText:"Cancel",clearText:"Clear",selectedText:"selected",dateFormat:"dd/mm/yy",dateOrder:"ddmmyy",dayNames:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],dayNamesShort:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],dayNamesMin:["S","M","T","W","T","F","S"],dayText:"Day",hourText:"Hours",minuteText:"Minutes",monthNames:["January","February","March","April","May","June","July","August","September","October","November","December"],monthNamesShort:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],monthText:"Month",secText:"Seconds",amText:"am",pmText:"pm",timeFormat:"hh:ii A",timeWheels:"hhiiA",yearText:"Year",nowText:"Now",firstDay:0,dateText:"Date",timeText:"Time",calendarText:"Calendar",closeText:"Close",todayText:"Today",prevMonthText:"Previous Month",nextMonthText:"Next Month",prevYearText:"Previous Year",nextYearText:"Next Year",eventText:"event",eventsText:"events",fromText:"Start",toText:"End",wholeText:"Whole",fractionText:"Fraction",unitText:"Unit",delimiter:"/",decimalSeparator:".",thousandsSeparator:",",labels:["Years","Months","Days","Hours","Minutes","Seconds",""],labelsShort:["Yrs","Mths","Days","Hrs","Mins","Secs",""],startText:"Start",stopText:"Stop",resetText:"Reset",lapText:"Lap",hideText:"Hide",backText:"Back",undoText:"Undo"}})(jQuery);
