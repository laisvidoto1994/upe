
/*
*   Name: BizAgi FormModeler Editor Form
*   Author: Diego Parra
*   Comments:
*   -   This script will define basic stuff for Search Form(model)
*/

bizagi.editor.base.container.extend("bizagi.editor.base.searchform", {},

    // Extend from container and search form behaviour (multiple inheritance)
	$.extend({}, bizagi.editor.base.searchFormBehaviour, bizagi.editor.base.searchFormValidations, {

	    /*
	    *   Constructor
	    */
	    init: function (data, elementFactory, regenerateGuid) {
	        var self = this;

	        // Set the element name
	        self.type = "searchform";	       
	        
	        // Call base
	        this._super(data, elementFactory, regenerateGuid);

	        self.contextentity = data.contextentity,
            self.scopedefinition = data.scopedefinition;
	        self.version = data.version;

	        // Define result model
	        self.result = [];

	        if (data.result) {
	            // Iterate for each element in the object
	            $.each(data.result, function (i, element) {
	                var child = self.elementFactory.createElement(element.type, element);
	                child.setParent(self);

	                // Add to internal collection
	                self.result.push(child);
	            });
	        }

	    },

	    /*
	    * Resolves control type
	    */
	    getFormParent: function () {
	        return this;
	    },

	    /*
	    *   Returns the JSON needed to render the element 
	    */
	    getRenderingModel: function () {
	        var defer = $.Deferred();
	        var childrenReady = this._super();

	        $.when(childrenReady)
            .done(function (result) {
					// By default, its necessary define a form like a "form" not searchForm
					if(result.container && result.container.properties){
						result.container.properties.type = "form";
					}
                defer.resolve({ form: result.container });
            });

	        return defer.promise();
	    },

	    /*
	    *   Get persistence model
	    */
	    getPersistenceModel: function () {
	        var self = this;
	        var model = this._super();
	        model = $.extend(model, {
	            result: self.getSearchResultPersistenceModel(),
	            resultValidations: self.resultValidations
	        });

	        model.contextentity = (typeof self.contextentity === "string") ? bizagi.editor.utilities.buildComplexReference(self.contextentity) : self.contextentity;
	        model.scopedefinition = (typeof self.scopedefinition === "string") ? bizagi.editor.utilities.buildComplexReference(self.scopedefinition) : self.scopedefinition;
	        model.version = self.version;
	        return model;
	    },

	    /*
	    *   Builds the search result persistence model
	    */
	    getSearchResultPersistenceModel: function () {
	        var self = this;
	        var result = [];

	        // Build children
	        $.each(self.result, function (i, child) {
	            result.push(child.getPersistenceModel());
	        });

	        return result;
	    },

	    /*
	    *   Builds the search result rendering model
	    */
	    getSearchResultRenderingModel: function () {
	        var self = this;
	        var defer = $.Deferred();
	        $.when.apply($, $.map(self.result, function (child) { return child.getGridColumnModel(); }))
    	        .done(function () {
    	            defer.resolve({ result: $.makeArray(arguments), resultValidations: self.resultValidations} );
    	        });
	        return defer.promise();
	    },

	    resolveDisplayNameProperty: function () {
	        var self = this;


	        if (self.resolveProperty("displayName")) {
	            return self.resolveI18nProperty("displayName");
	        }
	        else { return undefined; }

	    },

	    /*
	    *   function dummy,  doesn't apply in searchforms
	    */
	    getMapXpath: function (model, hash) {
	        return;
	    },

	    /*
       *   function dummy,  doesn't apply in searchforms
       */
	    getMapControls: function (model, hash) {
	        return;
	    },

	    /*
	    *   Publish a global event that the view will replicate
	    */
	    triggerGlobalHandler: function (eventType, data) {
	        var self = this;

	        return self.publish(eventType, data);
	    }
	}
));