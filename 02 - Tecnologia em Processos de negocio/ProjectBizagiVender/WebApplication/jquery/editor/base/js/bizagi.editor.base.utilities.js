
// Function helper

Array.prototype.move = function (pos1, pos2) {
    // local variables
    var i, tmp;
    // cast input parameters to integers
    pos1 = parseInt(pos1, 10);
    pos2 = parseInt(pos2, 10);
    // if positions are different and inside array
    if (pos1 !== pos2 && 0 <= pos1 && pos1 <= this.length && 0 <= pos2 && pos2 <= this.length) {
        // save element from position 1
        tmp = this[pos1];
        // move element down and shift other elements up
        if (pos1 < pos2) {
            for (i = pos1; i < pos2; i++) {
                this[i] = this[i + 1];
            }
        }
        // move element up and shift other elements down
        else {
            for (i = pos1; i > pos2; i--) {
                this[i] = this[i - 1];
            }
        }
        // put element from position 1 to destination
        this[pos2] = tmp;
    }
};

/*
*   Name: BizAgi FormModeler Editor Utilities
*   Author: David Montoya
*   Comments:
*   -   This script will define utility static functions
*/
$.Class.extend("bizagi.editor.utilities", {

    /// Resolve the resource with the key resourceName using rendering
    resolveResource: function (resourceName) {
        var resourceValue = bizagi.localization.getResource(resourceName);
        ///If resourceName is undefined getResource return the same resourceName we need return undefined
        if (resourceValue === resourceName)
            resourceValue = undefined;
        return resourceValue;
    },


    /*
    *   Build the ref object used for persistence in the catalog
    */
    buildComplexReference: function (reference, displayName) {
        var complexRef = {},
            baref = {};

        if (typeof reference === "string") {
            baref.ref = reference;
            complexRef.baref = baref;
            if (displayName) { complexRef.displayName = displayName; }
            return complexRef;
        }
        return reference;
    },

    /*
    *   Resolves a complex reference into a single one
    */
    resolveComplexReference: function (reference) {
        if (bizagi.editor.utilities.isObject(reference)) return reference.baref.ref;
        return reference;
    },

    /*
    *   Build the xpath object used for persistence in the catalog
    */
    buildComplexXpath: function (xpath, context, isScopeAttribute, relatedEntity) {
        var complexXpath = {},
            baxpath = {};

        if (typeof xpath === "object" && xpath.xpath && xpath.xpath.baxpath) { return xpath; };

        if (typeof xpath === "string" && xpath.length > 0) {

            baxpath.xpath = xpath;

            if (!bizagi.editor.utilities.isGuidEmpty(context)) {
                if (isScopeAttribute === "true") {
                    baxpath.scopedefinition = context;
                } else {
                    baxpath.contextentity = context;
                }
            }

            complexXpath.baxpath = baxpath;
            relatedEntity = ((relatedEntity !== undefined && relatedEntity != "00000000-0000-0000-0000-000000000000") ? relatedEntity : undefined);
            return {
                xpath: complexXpath,
                relatedentity: bizagi.editor.utilities.buildComplexReference(relatedEntity)
            };
        }

    },

    /*
    *   Resolves a complex xpath into a single one
    */
    resolveComplexXpath: function (xpath) {
        if (bizagi.editor.utilities.isObject(xpath)) {
            return xpath.xpath.baxpath.xpath;
        }

        return xpath;
    },

    /*
    *   Resolves a context entity from complex xpath
    */
    resolveContextEntityFromXpath: function (xpath) {

        if (bizagi.editor.utilities.isObject(xpath)) {
            return xpath.xpath.baxpath.contextentity;
        }

    },

    /*
    *   Resolves a context entity from complex xpath
    */
    resolveScopeContextFromXpath: function (xpath) {

        if (bizagi.editor.utilities.isObject(xpath)) {
            return xpath.xpath.baxpath.scopedefinition;
        }

    },

    /*
    *   Resolves a related entity from complex xpath
    */
    resolveRelatedEntityFromXpath: function (xpath) {

        if (bizagi.editor.utilities.isObject(xpath) && xpath.relatedentity) {
            return xpath.relatedentity.baref.ref;
        }

        return null;
    },

    /*
    *   Get xpath object
    */
    getXpathObject: function (xpath) {
        if (!xpath) return xpath;
        if (bizagi.editor.utilities.isObject(xpath)) {
            return xpath.xpath;
        }
        // TODO: Temporal while subproperties defaults in columns are resolved
        if (typeof xpath === "string" && xpath.indexOf("<design") > -1) {
            return null;
        }

        throw "xpath parameter must be a complex xpath object";
    },

    /*
    *   Build the filter complex format
    */
    buildComplexFilter: function (filterExpression, xpathData) {
        var bafilter = { filter: filterExpression };

        if (xpathData.isScopeAttribute === "true") {
            bafilter.scopedefinition = xpathData.contextScope;
            bafilter.contextentity = xpathData.guidRelatedEntity;
        }
        else
        {
            bafilter.contextentity = xpathData.guidRelatedEntity;
        }
        // if ((filterExpression.indexOf("<") >= 0)) {
        bafilter.globalcontextentity = xpathData.contextScope;
        // }

        return { bafilter: bafilter };
    },

    /*
    *   Resolve a property filter
    */
    resolvefilterExpression: function (filterExpression) {

        if (bizagi.editor.utilities.isObject(filterExpression)) {
            if (filterExpression.rule && filterExpression.rule.displayName){
                return filterExpression.rule.displayName;
            }else if(filterExpression.rule){
                return filterExpression.rule.baref.ref;
            }

            if (filterExpression.bafilter)
                return filterExpression.bafilter.filter;
        }

        return filterExpression;

    },

    /*
    *   Resolve a property path
    */
    resolveProperty: function (obj, propertyPath) {
        var parts = propertyPath.split(".");
        var value = obj;
        for (var i = 0; i < parts.length; i++) {
            value = value[parts[i]];
            if (value === undefined) return undefined;
        }
        return value;
    },

    /*
    *   Assign a value to a property path
    */
    assignProperty: function (obj, propertyPath, value, exclusive) {
        var parts = propertyPath.split(".");
        var property = obj;
        var lastPart = parts[0];

        // if property value is exclusive then first delete this
        if (exclusive) {
            property[lastPart] = undefined;
            if (value === undefined) { return; }
        }

        if (parts.length > 1) {
            for (var i = 0; i < parts.length - 1; i++) {
                // We need to create a path when it is null
                if (bizagi.util.isEmpty(property[lastPart])) {
                    property[lastPart] = {};
                }
                property = property[lastPart];
                lastPart = parts[i + 1];
            }
        }
        // Assign the default value only when the current value is not empty, because we dont want to override persisted vaLues
        property[lastPart] = value;
    },

    /*
    *  objects comparison
    */
    objectEquals: function (obj1, obj2) {
        var self = this;

        if (typeof (obj1) !== typeof (obj2)) {
            return false;
        }

        if (typeof (obj1) === "function") {
            return obj1.toString() === obj2.toString();
        }

        if (obj1 instanceof Object && obj2 instanceof Object) {

            // Count properties
            if (bizagi.editor.utilities.countProps(obj1) !== bizagi.editor.utilities.countProps(obj2)) {
                return false;
            }

            var r = true;
            for (k in obj1) {
                r = bizagi.editor.utilities.objectEquals(obj1[k], obj2[k]);
                if (!r) {
                    return false;
                }
            }
            return true;
        } else {
            return obj1 === obj2;
        }
    },

    countProps: function (obj) {
        var count = 0;
        for (k in obj) {
            if (obj.hasOwnProperty(k)) {
                count++;
            }
        }
        return count;
    },

    /*
    *  Creates a localizable object
    */
    buildComplexLocalizable: function (data, guid, property) {
        var localizableModel = {},
            i18n = {};

        if (typeof data === "string") {
            i18n.languages = {};
            i18n["default"] = data;
            i18n.uri = guid + ":" + property;
            localizableModel.i18n = i18n;
            return localizableModel;
        }

        return data;
    },


    /*
    *   Resolves a complex reference into a single one
    */
    resolveComplexLocalizable: function (obj) {
        if (typeof obj === "object") return obj["i18n"]["default"];
        return obj;
    },

    /*
    *   Resolves a internal resource
    */
    resolveInternalResource: function (element) {

        if (!element) return "";
        if (typeof (element) == "string") return element;



        // Check if there is resource for the current language
        var language = bizagi.language.split("-").shift();

        var getValue = function (languages) {
            var result = false;
            if ($.isArray(languages) && languages.length > 0 && language.length > 0) {
                for (var i = 0, l = languages.length; i < l; i += 1) {
                    if (languages[i][language]) {
                        result = languages[i][language];
                        break;
                    }
                }
            }

            return result;
        };

        return getValue(element.languages) || element["default"];
    },

    /*
    *   Resolves a localizable object
    */
    resolvei18n: function (localizationObject) {

        var language = bizagi.editorLanguage.key;

        if (typeof (localizationObject) == "string") return localizationObject;

        if (language && language != "default") {
            var result = localizationObject.i18n.languages && localizationObject.i18n.languages[language];
            if (result) return result;
        }

        return localizationObject.i18n["default"];
    },

    /*  
    * Determines if a reference is an `Object`. Unlike `typeof` in JavaScript, `null`s are not
    * considered to be objects.
    */
    isObject: function (value) { return value != null && typeof value == 'object'; },

    /*
    * Determines is a value can be parsed to boolean
    */
    isBoolean: function (value) {

        if (value === undefined || value === null) {
            return false;
        }
        
        // Parse true values
        if (value === true || value.toString().toLowerCase() === "true") {
            return true;
        }

        // Parse false values
        if (value === false || value.toString().toLowerCase() === "false") {
            return true;
        }


        return false;
    },

    /*
    * checks if the guid is empty
    */
    isGuidEmpty: function (guid) {

        if (!guid) { return true; }
        if (guid === "00000000-0000-0000-0000-000000000000") { return true; }

        return false;
    },

    /*
    * Builds guid empty
    */
    getGuidEmpty: function () {
        return "00000000-0000-0000-0000-000000000000";
    }


}, {})