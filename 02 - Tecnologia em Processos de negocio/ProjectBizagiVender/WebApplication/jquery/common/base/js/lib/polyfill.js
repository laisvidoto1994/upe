

/**
 * Polyfill isArray, for IE8
 *
 * @param value
 * @return {boolean}
 */
if (!Array.isArray) {
	Array.isArray = function(arg) {
		return Object.prototype.toString.call(arg) === '[object Array]';
	};
}



// Implement indexOf in IE8
if (!Array.prototype.indexOf) {
	Array.prototype.indexOf = function (searchElement /*, fromIndex */) {
		"use strict";
		if (this == null) {
			throw new TypeError();
		}
		var t = Object(this);
		var len = t.length >>> 0;
		if (len === 0) {
			return -1;
		}
		var n = 0;
		if (arguments.length > 1) {
			n = Number(arguments[1]);
			if (n != n) { // shortcut for verifying if it's NaN
				n = 0;
			} else if (n != 0 && n != Infinity && n != -Infinity) {
				n = (n > 0 || -1) * Math.floor(Math.abs(n));
			}
		}
		if (n >= len) {
			return -1;
		}
		var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
		for (; k < len; k++) {
			if (k in t && t[k] === searchElement) {
				return k;
			}
		}
		return -1;
	};
}



/**
 *
 * @returns {Number}Implement totilizer into array
 */

// Implement average
Array.prototype.avg = function () {
	var sum = 0, j = 0;
	for (var i = 0; i < this.length, isFinite(this[i]); i++) {
		sum += parseFloat(this[i]);
		++j;
	}
	return j ? sum / j : 0;
};

Array.prototype.sum = function () {
	var sum = 0;
	for (var i = 0; i < this.length, isFinite(this[i]); i++) {
		sum += parseFloat(this[i]);
	}
	return sum;
};

Array.prototype.min = function () {
	var min = 0;
	for (var i = 0; i < this.length, isFinite(this[i]); i++) {
		if (min > this[i]) {
			min = this[i];
		}
	}
	return min;
};

Array.prototype.max = function () {
	var max = 0;
	for (var i = 0; i < this.length, isFinite(this[i]); i++) {
		if (max < this[i]) {
			max = this[i];
		}
	}
	return max;
};

Array.prototype.move = function (old_index, new_index) {
	if (new_index >= this.length) {
		var k = new_index - this.length;
		while ((k--) + 1) {
			this.push(undefined);
		}
	}
	this.splice(new_index, 0, this.splice(old_index, 1)[0]);
};

Array.prototype.count = function () {
	return this.length || 0;
};

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
 * Create multi replace within a string
 * @param map
 * @return {String}
 */
String.prototype.replaceMultiple = function(map){
	var string = this, key, map = map || {};
	$.each(map, function(key, value){
		string = string.replace(new RegExp('\\{' + key + '\\}', 'gm'), map[key]);
	});

	return string
};


/**
 * Create a GUID
 * @return {string}
 */
Math.guid = function () {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
		var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
		return v.toString(16);
	});
};

/**
 * PlaceHolder
 */
!function(a){"function"==typeof define&&define.amd?define(["jquery"],a):a("object"==typeof module&&module.exports?require("jquery"):jQuery)}(function(a){function b(b){var c={},d=/^jQuery\d+$/;return a.each(b.attributes,function(a,b){b.specified&&!d.test(b.name)&&(c[b.name]=b.value)}),c}function c(b,c){var d=this,f=a(d);if(d.value==f.attr("placeholder")&&f.hasClass(m.customClass))if(f.data("placeholder-password")){if(f=f.hide().nextAll('input[type="password"]:first').show().attr("id",f.removeAttr("id").data("placeholder-id")),b===!0)return f[0].value=c;f.focus()}else d.value="",f.removeClass(m.customClass),d==e()&&d.select()}function d(){var d,e=this,f=a(e),g=this.id;if(""===e.value){if("password"===e.type){if(!f.data("placeholder-textinput")){try{d=f.clone().attr({type:"text"})}catch(h){d=a("<input>").attr(a.extend(b(this),{type:"text"}))}d.removeAttr("name").data({"placeholder-password":f,"placeholder-id":g}).bind("focus.placeholder",c),f.data({"placeholder-textinput":d,"placeholder-id":g}).before(d)}f=f.removeAttr("id").hide().prevAll('input[type="text"]:first').attr("id",g).show()}f.addClass(m.customClass),f[0].value=f.attr("placeholder")}else f.removeClass(m.customClass)}function e(){try{return document.activeElement}catch(a){}}var f,g,h="[object OperaMini]"==Object.prototype.toString.call(window.operamini),i="placeholder"in document.createElement("input")&&!h,j="placeholder"in document.createElement("textarea")&&!h,k=a.valHooks,l=a.propHooks;if(i&&j)g=a.fn.placeholder=function(){return this},g.input=g.textarea=!0;else{var m={};g=a.fn.placeholder=function(b){var e={customClass:"placeholder"};m=a.extend({},e,b);var f=this;return f.filter((i?"textarea":":input")+"[placeholder]").not("."+m.customClass).bind({"focus.placeholder":c,"blur.placeholder":d}).data("placeholder-enabled",!0).trigger("blur.placeholder"),f},g.input=i,g.textarea=j,f={get:function(b){var c=a(b),d=c.data("placeholder-password");return d?d[0].value:c.data("placeholder-enabled")&&c.hasClass(m.customClass)?"":b.value},set:function(b,f){var g=a(b),h=g.data("placeholder-password");return h?h[0].value=f:g.data("placeholder-enabled")?(""===f?(b.value=f,b!=e()&&d.call(b)):g.hasClass(m.customClass)?c.call(b,!0,f)||(b.value=f):b.value=f,g):b.value=f}},i||(k.input=f,l.value=f),j||(k.textarea=f,l.value=f),a(function(){a(document).delegate("form","submit.placeholder",function(){var b=a("."+m.customClass,this).each(c);setTimeout(function(){b.each(d)},10)})}),a(window).bind("beforeunload.placeholder",function(){a("."+m.customClass).each(function(){this.value=""})})}});
/**
 * jamesallardice.github.io/Placeholders.js
 */
!function(a){"use strict";function b(){}function c(){try{return document.activeElement}catch(a){}}function d(a,b){for(var c=0,d=a.length;d>c;c++)if(a[c]===b)return!0;return!1}function e(a,b,c){return a.addEventListener?a.addEventListener(b,c,!1):a.attachEvent?a.attachEvent("on"+b,c):void 0}function f(a,b){var c;a.createTextRange?(c=a.createTextRange(),c.move("character",b),c.select()):a.selectionStart&&(a.focus(),a.setSelectionRange(b,b))}function g(a,b){try{return a.type=b,!0}catch(c){return!1}}function h(a,b){if(a&&a.getAttribute(B))b(a);else for(var c,d=a?a.getElementsByTagName("input"):N,e=a?a.getElementsByTagName("textarea"):O,f=d?d.length:0,g=e?e.length:0,h=f+g,i=0;h>i;i++)c=f>i?d[i]:e[i-f],b(c)}function i(a){h(a,k)}function j(a){h(a,l)}function k(a,b){var c=!!b&&a.value!==b,d=a.value===a.getAttribute(B);if((c||d)&&"true"===a.getAttribute(C)){a.removeAttribute(C),a.value=a.value.replace(a.getAttribute(B),""),a.className=a.className.replace(A,"");var e=a.getAttribute(I);parseInt(e,10)>=0&&(a.setAttribute("maxLength",e),a.removeAttribute(I));var f=a.getAttribute(D);return f&&(a.type=f),!0}return!1}function l(a){var b=a.getAttribute(B);if(""===a.value&&b){a.setAttribute(C,"true"),a.value=b,a.className+=" "+z;var c=a.getAttribute(I);c||(a.setAttribute(I,a.maxLength),a.removeAttribute("maxLength"));var d=a.getAttribute(D);return d?a.type="text":"password"===a.type&&g(a,"text")&&a.setAttribute(D,"password"),!0}return!1}function m(a){return function(){P&&a.value===a.getAttribute(B)&&"true"===a.getAttribute(C)?f(a,0):k(a)}}function n(a){return function(){l(a)}}function o(a){return function(){i(a)}}function p(a){return function(b){return v=a.value,"true"===a.getAttribute(C)&&v===a.getAttribute(B)&&d(x,b.keyCode)?(b.preventDefault&&b.preventDefault(),!1):void 0}}function q(a){return function(){k(a,v),""===a.value&&(a.blur(),f(a,0))}}function r(a){return function(){a===c()&&a.value===a.getAttribute(B)&&"true"===a.getAttribute(C)&&f(a,0)}}function s(a){var b=a.form;b&&"string"==typeof b&&(b=document.getElementById(b),b.getAttribute(E)||(e(b,"submit",o(b)),b.setAttribute(E,"true"))),e(a,"focus",m(a)),e(a,"blur",n(a)),P&&(e(a,"keydown",p(a)),e(a,"keyup",q(a)),e(a,"click",r(a))),a.setAttribute(F,"true"),a.setAttribute(B,T),(P||a!==c())&&l(a)}var t=document.createElement("input"),u=void 0!==t.placeholder;if(a.Placeholders={nativeSupport:u,disable:u?b:i,enable:u?b:j},!u){var v,w=["text","search","url","tel","email","password","number","textarea"],x=[27,33,34,35,36,37,38,39,40,8,46],y="#ccc",z="placeholdersjs",A=new RegExp("(?:^|\\s)"+z+"(?!\\S)"),B="data-placeholder-value",C="data-placeholder-active",D="data-placeholder-type",E="data-placeholder-submit",F="data-placeholder-bound",G="data-placeholder-focus",H="data-placeholder-live",I="data-placeholder-maxlength",J=100,K=document.getElementsByTagName("head")[0],L=document.documentElement,M=a.Placeholders,N=document.getElementsByTagName("input"),O=document.getElementsByTagName("textarea"),P="false"===L.getAttribute(G),Q="false"!==L.getAttribute(H),R=document.createElement("style");R.type="text/css";var S=document.createTextNode("."+z+" {color:"+y+";}");R.styleSheet?R.styleSheet.cssText=S.nodeValue:R.appendChild(S),K.insertBefore(R,K.firstChild);for(var T,U,V=0,W=N.length+O.length;W>V;V++)U=V<N.length?N[V]:O[V-N.length],T=U.attributes.placeholder,T&&(T=T.nodeValue,T&&d(w,U.type)&&s(U));var X=setInterval(function(){for(var a=0,b=N.length+O.length;b>a;a++)U=a<N.length?N[a]:O[a-N.length],T=U.attributes.placeholder,T?(T=T.nodeValue,T&&d(w,U.type)&&(U.getAttribute(F)||s(U),(T!==U.getAttribute(B)||"password"===U.type&&!U.getAttribute(D))&&("password"===U.type&&!U.getAttribute(D)&&g(U,"text")&&U.setAttribute(D,"password"),U.value===U.getAttribute(B)&&(U.value=T),U.setAttribute(B,T)))):U.getAttribute(C)&&(k(U),U.removeAttribute(B));Q||clearInterval(X)},J);e(a,"beforeunload",function(){M.disable()})}}(this);

/**
 * Implementation of Client internet connection calculation
 */
var networkSpeed = function(){
	var clientNetwork = {};
	var networkLatency = performance.timing.responseEnd - performance.timing.fetchStart;
	var speedConnection = {
		"GPRS": {speed: "50kb/s", throughput:50000, latency: 500},
		"Regular 2G": {speed: "250kb/s",throughput:250000, latency: 300},
		"Good 2G": {speed: "450Kb/s", throughput: 450000, latency: 150},
		"Regular 3G": {speed: "750Kb/s", throughput: 750000, latency: 100},
		"Good 3G": {speed: "1Mb/s", throughput: 1000000, latency: 40},
		"Regular 4G": {speed: "4Mb/s", throughput: 4000000, latency: 20},
		"DSL": {speed: "2Mb/s", throughput: 2000000, latency: 18},
		"WiFi": {speed: "30Mb/s", throughput: 30000000, latency: 2},
		"Gigabit": {speed: "100Mb/s", throughput: 100000000, latency: 1}
	};

	$.each(speedConnection, function(key, value){
		if(networkLatency > value.latency && !clientNetwork.type){
			clientNetwork = value;
			clientNetwork.type = key;
		}
	});

	return clientNetwork;
};

/**
 * Calculate for download client network speed test
 * @param dataSize Bytes
 * @param networkThroughput bps Bits per second
 * @return {number} Seconds
 */
var getEstimatedTimeByNetworkSpeed = function(dataSize, networkThroughput){
	dataSize = dataSize || 1;
	dataSizeBits = dataSize * 8;
	networkThroughput = networkThroughput || 1;
	var timeout = parseInt(dataSizeBits / networkThroughput);

	return timeout;
};
