var bizagi = bizagi || {};
bizagi.injector =  (function () {

    var maxRecursion = 20,
        isArray = function (arr) {
            return Object.prototype.toString.call(arr) === '[object Array]';
        };

    var container = {};
    var originalContainer = {};
    var containerInstances = {};

    var ERROR_RECURSION = 'Maximum recursion at ';
    var ERROR_REGISTRATION = 'Already registered.';
    var ERROR_ARRAY = 'Must pass array.';
    var ERROR_FUNCTION = 'Must pass function to invoke.';
    var ERROR_SERVICE = 'Service does not exist.';

    var get = function (name, level) {
        var wrapper = container[name];

        if ($.isNumeric(level)) {
            var lvl = level;
        }
        else if ($.type(level) === 'object') {
            var params = level;
        }

        lvl = lvl || 0;
        if (wrapper) {
            return wrapper(lvl, params);
        }
        throw ERROR_SERVICE + " " + name;
    };

    var getNewInstance = function (name, level) {
        container[name] = originalContainer[name];

        return get(name, level);
    };

    var invoke = function (fn, deps, instance, level, params) {
        var i = 0,
            args = [],
            lvl = level || 0;
        if (lvl > maxRecursion) {
            throw ERROR_RECURSION + lvl;
        }
        for (; i < deps.length; i += 1) {
            args.push(get(deps[i], lvl + 1));
        }

        if (params) {
            args.push(params);
        }

        return fn.apply(instance, args);
    };

    var register = function (name, annotatedArray, newInstance) {
        if (!isArray(annotatedArray)) {
            throw ERROR_ARRAY;
        }


        if (typeof annotatedArray[annotatedArray.length - 1] !== 'function') {
            throw ERROR_FUNCTION;
        }

        originalContainer[name] = container[name] = function (level, params) {
            var lvl = level || 0,
                Template = function () {},
                result = {},
                instance,
                fn = annotatedArray[annotatedArray.length - 1],
                deps = annotatedArray.length === 1 ? (annotatedArray[0].$$deps || []) :
                    annotatedArray.slice(0, annotatedArray.length - 1),
                injected;

            //If exist instance, dispose it
            if (containerInstances[name]) {
                if (typeof containerInstances[name].__proto__ != "undefined" && containerInstances[name].__proto__.hasOwnProperty('dispose')) {
                        containerInstances[name].dispose();
                }                    
            }

            Template.prototype = fn.prototype;
            instance = new Template();
            injected = invoke(fn, deps, instance, lvl + 1, params);
            result = injected || instance;
            if (!newInstance) {
                container[name] = function () {
                    return result;
                };
            }
            containerInstances[name] = result;
            return result;
        };
    };

    var isRegistered = function (name) {
        return container[name] ? true : false;
    };

    var registerInstance = function(name, instance){
        container[name] = function() {
            return instance
        }
    };

    return {
        get : get,
        getNewInstance: getNewInstance,
        register: register,
        registerInstance: registerInstance,
        isRegistered : isRegistered
    }

})();


