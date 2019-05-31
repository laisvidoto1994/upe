/**
 * Name: Bizagi Workportal Desktop templates Services
 * Author: Alexander Mejia
 * Note: Autoextend the facade of services to provide the services used in template widget
 */
bizagi.workportal.services.service.extend("bizagi.workportal.services.service", {}, {

    /**
     *
     * @param params
     * @returns {*}
     */
    getSearchData: function (params) {
        var self = this;
        // Call ajax and returns promise
        var urlSend = self.serviceLocator.getUrl("my-search-getData");
        urlSend = urlSend.replace("{guidSearch}", params.guidSearch);
        var filters = params.filters || [];

        var data = {
            filters: JSON.stringify(filters),
            pag : params.page || 1,
            calculateFilters: params.calculateFilters || false,
            pagSize: params.pageSize || 10
        };
        return $.read(urlSend, data).then(function (data) {
            return self.serializeEntityData(data);
        });
    },

    /**
     * Return an array with the collections or entity related to stakeholder entities
     * @param params
     */
    getCollectionEntityData: function (params) {
        var self = this, url;
        params = params || {};

        //TODO: Is necessary Refactor. This fix problem beacause sometimes send filters with other format
        var auxFilters;
        if(typeof params.filters !== "undefined"){
            auxFilters = params.filters.filter(function(filter){
                return typeof filter.properties === "undefined";
            });
        }

        var data = {
            templateType: (params.referenceType === "VIRTUAL" || params.referenceType === "FACT") ? "List" : "Content",
            surrogateKey: params.surrogateKey,
            pag: params.page || 1,
            pagSize: params.pageSize || 10,
            defaultFilterApplied: (typeof params.defaultFilterApplied !== "undefined") ? params.defaultFilterApplied : true,
            filters: JSON.stringify(auxFilters) || []
        };

        // VIRTUAL
        if (params.referenceType === "VIRTUAL") {
            url = self.serviceLocator.getUrl("data-navigation-handler-collection");
            data.reference = params.reference;
        }
        // ENTITY AND FACTS
        else {
            url = self.serviceLocator.getUrl("data-navigation-handler-entity");
            data.reference = params.guidEntityCurrent || params.entityId;
            data.xpath = params.xpath;
            data.collectionId = params.reference;
        }

        // Call ajax and returns promise
        return $.read(url, data).then(function (response) {
            return $.extend(self.serializeEntityData(response), {reference: params.reference});
        });
    },

    /**
     *
     * @param params
     */
    getFiltersEntityData: function (params) {
        var self = this;
        params = params || {};

        //TODO: Is necessary Refactor. This fix problem beacause sometimes send filters with other format
        var auxFilters;
        if(typeof params.filters !== "undefined"){
            auxFilters = params.filters.filter(function(filter){
                return typeof filter.properties === "undefined";
            });
        }

        var data = {
            reference: params.guidEntityCurrent,
            collectionId: params.reference,
            surrogateKey: params.surrogateKey,
            xpath: params.xpath,
            templateType: "List",
            defaultFilterApplied: params.defaultFilterApplied,
            filters: JSON.stringify(auxFilters)
        };

        // Call ajax and returns promise
        return $.read({
            url: self.serviceLocator.getUrl("data-navigation-handler-entity-filters"),
            data: data
        }).then(function(response){
            return $.extend(response, {reference: params.reference});
        });
    },

    /**
     * Get mapping of current action
     * @param params
     * @return {*}
     */
    getMapping: function (params) {
        var self = this;
        // Define data
        var data = {
            accumulatedContext: JSON.stringify(params.accumulatedContext),
            guidEntity: params.guidEntity
        };

        if (params.xpathContext) {
            data.xpathContext = params.xpathContext;
        }

        // Call ajax and returns promise
        return $.ajax({
            url: self.serviceLocator.getUrl("entities-handler-getMapping"),
            data: data,
            type: "POST",
            dataType: "json"
        });
    },

    /**
     * Validate if the action have start form
     * @param params
     */
    actionsHasStartForm: function (params) {
        var self = this;
        var data = {
            processId: params.processId
        };

        // Call ajax and returns promise
        return $.read({
            url: self.serviceLocator.getUrl("handler-validate-action-has-start-form"),
            data: data,
            batchRequest: true
        });
    },

    /**
     * Obtain the guid entity process and if have or not have start form
     * return {*}
     * @param params
     */
    actionCreateCase: function (params) {
        var self = this;
        var data = {
            processId: params.idProcess
        };

        if (params.entityMapping) {
            data.entityMapping = params.entityMapping;
        }

        if (params.parentCaseId) {
            data.parentCaseId = params.parentCaseId;
        }
        else {
            data.parentCaseId = 0;
        }

        // Call ajax and returns promise
        return $.create({
            url: self.serviceLocator.getUrl("handler-execute-action-start"),
            data: data
        });
    },

    /**
     *
     * @param params
     */
    getIdCasesOfProcessEntities: function (params) {
        params = params || {};
        var self = this;
        var ids = {
            ids: JSON.stringify(params)
        };

        // Call ajax and returns promise
        return $.ajax({
            url: self.serviceLocator.getUrl("process-handler-getIdCasesOfProcessEntities"),
            data: ids,
            type: "POST"
        });
    },

    /**
     * Get information about the process.
     * if it hasn't start process then the process is created
     * else the start form is displayed before to creation
     * @param params
     */
    createCase : function(params){
        var self = this;
        var data = {
            idProcess: params.idProcess,
            entityMapping: params.entityMapping
        };

        if (params.idParentCase){
            data.idParentCase = params.idParentCase;
        }

        return $.create({
            url: self.serviceLocator.getUrl("case-handler-startProcess"),
            data: data
        });
    },

    /**
     * Execute the rule linked to action
     * @param params
     */
    executeRule : function(params) {
        var self = this;
        var data = {
            surrogateKey: params.surrogateKey,
            entityId: params.entityId,
            ruleId: params.ruleId
        };

        return $.create({
            url: self.serviceLocator.getUrl("actions-handler-executeRule-simple"),
            data: data
        });
    },

    /**
     * Execute one rule to multiple actions
     * @param params
     */
    executeRuleMultiple : function(params){
        var self = this;
        var data = {
            surrogateKey: JSON.stringify(params.surrogateKey),
            entityId: params.entityId,
            ruleId: params.ruleId
        };

        return $.create({
            url: self.serviceLocator.getUrl("actions-handler-executeRule-multiple"),
            data: data
        });
    }
});