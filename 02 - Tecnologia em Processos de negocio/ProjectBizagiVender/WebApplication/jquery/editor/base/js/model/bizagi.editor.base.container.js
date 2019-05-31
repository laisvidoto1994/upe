/*
*   Name: BizAgi FormModeler Editor Container
*   Author: Alexander Mejia, Diego Parra
*   Comments:
*   -   This script will define basic stuff for Container
*/

bizagi.editor.base.element.extend("bizagi.editor.base.container", {},
// Extend from base element and container behaviour (multiple inheritance)
	$.extend({}, bizagi.editor.base.containerBehaviour, bizagi.editor.base.containerValidations, {

	    /*
	    *   Constructor for the container
	    *   Loads and initializes all its children
	    */
	    init: function (data, elementFactory, regenerateGuid) {

	        var self = this;
	        self.elements = [];

	        // Set the element type
	        self.elementType = "container";

	        // Call base
	        self._super(data, elementFactory, regenerateGuid);
	        
	        self.initialize(data, regenerateGuid);
	    },

	    initialize : function(data, regenerateGuid){
	        var self = this,
	            elements = self.elements;

	        if (data) {
	            if (data.elements) {
	                // Iterate for each element in the object
	                $.each(data.elements, function (i, element) {
	                    var child = self.elementFactory.createElement(element.type, element, regenerateGuid);

	                    // set parent
	                    child.setParent(self);

	                    // Add to internal collection
	                    elements.push(child);
	                });
	            }
	        }
	    },

	    /*
	    *   Returns if the container is ready or not
	    *   The container is ready when all its children are ready
	    */
	    ready: function () {
	        var self = this;

	        // Check if all children are ready, then resolve this deferred
	        return $.when.apply($, $.map(self.elements, function (item) { return item.ready(); }));
	    },

	    /*
	    *   Returns the JSON needed to render the element
	    */
	    getRenderingModel: function () {
	        var self = this;
	        var defer = $.Deferred();
	        var renderingModel = self._super();

	        $.when.apply($, $.map(this.elements, function (item) {
	            return item.getRenderingModel();
			}))
    	        .done(function () {
    	            var elements = $.makeArray(arguments);
    	            $.when(renderingModel)
        	            .done(function (result) {

        	                result.elements = elements;
        	                defer.resolve({ container: result });
        	            });
    	        });

	        return defer.promise();
	    },

	    /*
	    *   Get persistence model
	    */
	    getPersistenceModel: function () {
	        var self = this;
	        var result = this._super();

	        // Build children
	        result.elements = [];
	        $.each(self.elements, function (i, child) {
	            result.elements.push(child.getPersistenceModel());
	        });

	        return result;
	    },

	    /*
	    * Resolves control type
	    */
	    getControlType: function () {
	        return this.controlType;
	    },

	    /*
	    * Resolves control type
	    */
	    getFormParent: function () {
	        return this.parent.getFormParent();
	    },

	    /*
	    *  Returns the children
	    */
	    getChildren: function () {
	        var self = this;

	        return self.elements;
	    },


	    /*
	    *   Return the inherent validations
	    */
	    getInherentValidations: function (inherentValidations) {
	        var self = this;
	        inherentValidations = inherentValidations || [];
	        $.each(self.elements, function (i, child) {
	            child.getInherentValidations(inherentValidations);
	        });

	        return inherentValidations;
	    }
      
	}
));


