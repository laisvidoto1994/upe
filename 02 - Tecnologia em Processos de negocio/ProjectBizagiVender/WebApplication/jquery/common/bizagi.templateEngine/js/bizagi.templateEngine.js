﻿/**
 * Template Engine
 * @author Edward J Morales
 */
var loader = bizagi.loader;

/**
 * @param properties {renderFactory, cache,}
 * @type {Function}
 */
bizagi.templateEngine = (function (properties) {
    var self = this;
    self.properties = properties || {};
    self.errorMessage = "Critical Dependencies has not defined, please check it";
    self.observableElement = $({});
    self.templateQueue = {};

    //<editor-fold desc="Setters and Getters">
    /**
     * Initialize global properties of engine
     * @param properties
     */
    self.setProperties = function (properties) {
        properties = properties || {};
        // Merge parameters with new set of data
        self.properties = $.merge(self.properties, properties);
        // Set default values
        self.properties.cache = (typeof self.properties.cache == "undefined") ? true : self.properties.cache;
        // Create automatic data for template, dinamyc mock
        self.properties.autoGenerateData = properties.autoGenerateData || false;
        // Force to get personalized columns
        self.properties.forcePersonalizedColumns = self.properties.forcePersonalizedColumns || false;

    };
    /**
     * Set new data
     * @param data
     */
    self.setEntityData = function (data) {
        self.entityData = data || null;
    };

    /**
     * Set new template
     * @param guid
     */
    self.setEntityGuid = function (guid) {
        self.entityGuid = guid || null;
    };

    /**
     * Set new template
     * @param guid
     */
    self.setTemplateGuid = function (guid) {
        self.templateGuid = guid || null;
    };

    /**
     * Get entity Guid
     * @return {*|null}
     */
    self.getEntityGuid = function () {
        return self.entityGuid;
    };

    /**
     * Get template Guid
     * @return {*|null}
     */
    self.getTemplateGuid = function () {
        return self.templateGuid;
    };

    /**
     * Get Entity Data
     * @return {*|null}
     */
    self.getEntityData = function () {
        return self.entityData;
    };
    //</editor-fold>

    //<editor-fold desc="Private Methods">
    /**
     * Service tier: get entity template
     * @return {*}
     * @private
     * @param entityGuid
     * @param isDefaultTemplate
     * @param templateType
     * @param guidTemplate
     */
    self._serviceGetTemplate = function (entityGuid, isDefaultTemplate, templateType, guidTemplate) {
        return self.properties.renderFactory.dataService.multiaction().getTemplate({
            guid: entityGuid,
            templateGuid: guidTemplate,
            isDefaultTemplate: isDefaultTemplate,
            templateType: templateType,
            forcePersonalizedColumns: self.properties.forcePersonalizedColumns
        });
    };

    /**
     * Create a new form
     * @param template
     * @return {*}
     * @private
     * @param paramsRender
     */
    self._getRenderForm = function (template, paramsRender) {
        template = template || {};
        var def = new $.Deferred();

        if (!self._hasCriticalDependencies()) {
            def.reject(this.errorMessage);
        }

        $.when(self.properties.renderFactory.getContainer({
            type: "template",
            data: template.form,
            paramsRender: paramsRender
        })).done(function (container) {
            def.resolve(container);
        }).fail(function (error) {
            def.reject(error);
        });

        return def.promise();
    };

    /**
     * Check if all dependencies was registered
     * @return {boolean}
     * @private
     */
    self._hasCriticalDependencies = function () {
        if (!self.properties.renderFactory || !self.properties.renderFactory.dataService) {
            return false
        } else {
            return true;
        }
    };

    //</editor-fold>


    //<editor-fold desc="Template Cache">
    /**
     * Set element to cache
     * @param guid
     * @param template
     * @return {*}
     * @private
     * @param timestamp
     */
    self._setCacheItem = function (guid, template, timestamp){
        template.timestamp = timestamp;
        var parsedTemplate = JSON.encode(template);
        return bizagi.util.setItemLocalStorage(guid, parsedTemplate);
    };

    /**
     * Get element from cache
     * @param guid
     * @return {null}
     * @private
     * @param timestamp
     */
    self._getCacheItem = function (guid, timestamp) {
        var parsedTemplate = JSON.parse(bizagi.util.getItemLocalStorage(guid));
        if (parsedTemplate && parsedTemplate.timestamp == timestamp) {
            return parsedTemplate;
        }
        return null;
    };

    /**
     * Remove all data within cache
     */
    self.disposeCache = function () {
        bizagi.util.clearLocalStorage();
    };

    /**
     * Remove one element from cache
     * @param guid
     */
    self.disposeItem = function (guid) {
        bizagi.util.removeItemLocalStorage(guid);
    };
    //</editor-fold>


    /**
     * Get template
     * @param guid
     * @return {*}
     * @param isDefaultTemplate
     * @param timestamp
     * @param templateType
     * @param guidTemplate
     */
    self.getTemplate = function (guid, isDefaultTemplate, timestamp, templateType, guidTemplate) {
        guid = guid || self.getEntityGuid();
        var cacheGuid = (guidTemplate) ? guidTemplate : guid;
        var key = cacheGuid + "-" + templateType + "-" + isDefaultTemplate;

        if (typeof self.templateQueue[key] != 'undefined'){
            return self.templateQueue[key];
        }

        var def = new $.Deferred();
        var cachedTemplate = (self.properties.cache) ? self._getCacheItem(cacheGuid, timestamp) : null;

        if (cachedTemplate) {
            def.resolve(cachedTemplate);
        }
        else {
            // Calling REST and get template
            if (!self._hasCriticalDependencies()) {
                def.reject(self.errorMessage);
            }
            else {
                self.templateQueue[key] = def;

                $.when(self._serviceGetTemplate(guid, isDefaultTemplate, templateType, guidTemplate)).then(function (template) {
                    self._setCacheItem(cacheGuid, template, timestamp);
                    def.resolve(template);
                }).fail(function(error){
                    def.reject(error);
                }).always(function () {
                    delete self.templateQueue[key];
                });
            }
        }
        return def.promise();
    };


    /**
     * Render template with data set
     * @return {string}
     */
    self.render = function (entityData, paramsRender) {
        if(!entityData){
            return "";
        }

        var guid = entityData.guid || "";
        var timestamp = entityData.timestamp;
        var serviceDeferred = new $.Deferred();
        var templateType = entityData.templateType || "";
        var guidTemplate = entityData.guidTemplate || entityData.templateGuid;
        var isDefaultTemplate = (guidTemplate) ? false : true;

        //Set internals references
        self.setEntityData(entityData);
        self.setEntityGuid(guid);

        $.when(self.getTemplate(guid, isDefaultTemplate, timestamp, templateType, guidTemplate)).done(function (template) {
            $.when(self._getRenderForm(template, paramsRender)).done(function (formTemplate) {
                if (typeof formTemplate == "object" && formTemplate.error) {
                    serviceDeferred.resolve(formTemplate.error);
                } else {
                    var controls = [];

                    if (self.properties.autoGenerateData) {
                        // Redefine entityData.data
                        entityData.data = new bizagi.mockTemplateEngine(formTemplate).mock();
                    }

                    //Preprocess value to specific types: Example: LayoutImages and
                    $.each(entityData.data, function (key, value) {
                        //find all controls by xpath
                        var controlsFindit = formTemplate.getRendersByXpath(key) || formTemplate.getRenderById(key);
                        if (controlsFindit) {
                            if($.isArray(controlsFindit)){
                                for(iControl = 0, countControls = controlsFindit.length; iControl < countControls; iControl++){
                                    var auxValue = self.preProcessValue(entityData, controlsFindit[iControl].properties, value);
                                    controlsFindit[iControl].setValue(auxValue);
                                    controls.push(controlsFindit[iControl]);
                                }
                            }
                            else{
                                value = self.preProcessValue(entityData, control.properties, value);
                                control.setValue(value);
                                controls.push(control);
                            }
                        }
                    });

                    formTemplate.bind("globalHandler", function (ev, params) {
                        if (params.eventType == "DATA-NAVIGATION") {
                            params.data.surrogateKey = entityData.surrogateKey || entityData.surrogatedKey;
                            params.data.guidEntityCurrent = entityData.guid;
                            self.publish('onLoadDataNavigation', params);
                        }
                    });

                    $.when(formTemplate.render()).done(function (html) {
                        serviceDeferred.resolve(html, controls);
                    });
                }
            });
        }).fail(function (message) {
            serviceDeferred.reject(message);
        });
        return serviceDeferred.promise();
    };

    /**
     *
     * @param entityData
     * @param controlProperties
     * @param value
     * @returns {*}
     */
    self.preProcessValue = function (entityData, controlProperties, value) {
        if (controlProperties.type === "layoutImage" || controlProperties.type === "layoutUpload"){
            value = {
                value: value,
                surrogateKey: entityData.surrogateKey || entityData.surrogatedKey,
                guid: entityData.guid
            }
        }
        return value;
    };

    /**
     *
     */
    self.subscribe = function () {
        self.observableElement.on.apply(self.observableElement, arguments);
    };

    /**
     *
     */
    self.unsubscribe = function () {
        self.observableElement.off.apply(self.observableElement, arguments);
    };

    self.publish = function () {
        return self.observableElement.triggerHandler.apply(self.observableElement, arguments);
    };

    /**
     * Initialize constructor arguments
     */
    self.setProperties(properties);

    /**
     * Expose public interface
     */
    return {
        setEntityData: self.setEntityData,
        getEntityData: self.getEntityData,
        setEntityGuid: self.setEntityGuid,
        getEntityGuid: self.getEntityGuid,
        getTemplate: self.getTemplate,
        disposeCache: self.disposeCache,
        disposeItem: self.disposeItem,
        checkDependencies: self._hasCriticalDependencies,
        setProperties: self.setProperties,
        render: self.render,
        subscribe: self.subscribe,
        unsubscribe: self.unsubscribe,
        publish: self.publish
    };
});

/**
 * This function make a dinamyc data based on template
 * @type {Function}
 */
bizagi.mockTemplateEngine = (function(form) {
    var self = this;
    self.form = form || {};

    /**
     * Get list of controls that containt the form
     * @return {{}}
     * @private
     */
    self._getControls = function() {
        var self = this;
        var controls = {};
        if(self.form && self.form.rendersById) {
            $.each(self.form.rendersById, function(key,value){
                if(value.properties.type != "layout"){
                    controls[key] = value;
                }
            });
        }
        return controls;
    };

    /**
     * Create specific data to each type of control
     * @param controlType
     * @return {*}
     * @private
     */
    self._getDataMock = function(controlType) {
        switch(controlType) {
            case "layoutImage":
                return "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
                break;
            case "layoutLabel":
                return "Label";
                break;
            case "layoutText":
                return "Lorem";
                break;
            case "layoutDateTime":
                return "01/01/2000";
                break;
            default:
                return null;
                break;
        }
    };

    /**
     * Create data mock
     * @return {{}}
     * @private
     */
    self._mock = function() {
        var controls = self._getControls();
        var data = {};
        $.each(controls, function(key, value) {
            var type = value.properties.type;
            data[key] = self._getDataMock(type) || null;
        });
        return data;
    };

    /**
     * Public interface
     */
    return {
        mock: self._mock
    }
});
