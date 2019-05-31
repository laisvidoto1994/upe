
/*
*   Name: BizAgi FormModeler Editor Render
*   Author: Alexander Mejia, Diego Parra
*   Comments:
*   -   This script will define basic stuff for element
*/

bizagi.editor.base.element.extend("bizagi.editor.base.render", {},
// Extend from base element and render behaviour (multiple inheritance)
	$.extend({}, bizagi.editor.base.renderBehaviour, {

	    /*  
	    *   Constructor for the container
	    *   Loads and initializes all its children
	    */
	    init: function (data, elementFactory, regenerateGuid) {
	        var self = this;

	        // Set the element type
	        self.elementType = "render";

	        // Call base
	        self._super(data, elementFactory, regenerateGuid);
	    },

	    /*
	    *   Returns the JSON needed to render the element 
	    */
	    getRenderingModel: function (category) {
	        var self = this;
	        category = category || "render";

	        return $.when(self._super())
    	            .pipe(function (model) {
    	                var result = {};
    	                result[category] = model;

    	                return result;
    	            });


	    },

	    /*
	    * Resolves control type
	    */
	    getControlType: function () {
	        return this.controlType || this.properties.renderType;
	    },

	    /*
	    * Gets atributes related to control
	    */
	    getControlAttributes: function () {
	        var self = this;
	        var defer = $.Deferred();

	        $.when(self.triggerGlobalHandler("findXpathAttributes", { element: self, xpath: self.properties.xpath })).
    	        done(function () {
    	            defer.resolve();
    	        });

	        return defer.promise();
	    },
	    
	    
	    /*
	    *   Return the inherent validations
	    */
	    getInherentValidations: function (inherentValidations) {
	        var self = this;
	        var properties = self.properties;
	        inherentValidations = inherentValidations || [];

	        if (properties.required && properties.required.fixedvalue == true) {
	            inherentValidations.push({
	                guid: Math.guid(),
	                conditions: { operator: "and", expressions: [{ simple: { operator: "is-empty", xpath: self.getXpath(properties.xpath)}}] },
	                validationCommand: { message: "The field " + self.resolveDisplayNameProperty() + " cannot be empty" },
	                inherent: true
	            });
	        }
	        if (properties.minValue) {
	            inherentValidations.push({
	                guid: Math.guid(),
	                conditions: { operator: "and", expressions: [{ simple: { operator: "is-less-than", xpath: self.getXpath(properties.xpath), argument: properties.minValue, argumentType: "const"}}] },
	                validationCommand: { message: "The field " + self.resolveDisplayNameProperty() + " cannot be less than " + properties.minValue },
	                inherent: true
	            });
	        }
	        if (properties.maxValue) {
	            inherentValidations.push({
	                guid: Math.guid(),
	                conditions: { operator: "and", expressions: [{ simple: { operator: "is-greater-than", xpath: self.getXpath(properties.xpath), argument: properties.maxValue, argumentType: "const"}}] },
	                validationCommand: { message: "The field " + self.resolveDisplayNameProperty() + " cannot be less than " + properties.maxValue },
	                inherent: true
	            });
	        }

	        return inherentValidations;
	    }
	}));

bizagi.editor.base.render.extend("bizagi.editor.render.generic", {}, {

    init: function (data, elementFactory) {
        var self = this;

        // Set the element type
        self.type = "label";

        // Call base
        this._super(data, elementFactory);
    },

    /*
    *   Extension method to add properties when creatin JSON for rendering
    */
    getRenderingProperties: function () {
        var self = this;
        var properties = self.properties;

        var result = this._super();
        result.type = "label";
        if (properties.displayName) {
            result.displayName = (typeof properties.displayName === "string") ? properties.displayName : properties.displayName.i18n["default"];
        }

        return result;
    }
});

bizagi.editor.base.render.extend("bizagi.editor.column.generic", {}, {

    init: function (data, elementFactory) {
        var self = this;

        // Set the element type
        self.type = "columnReadonly";

        // Call base
        this._super(data, elementFactory);
    },

    /*
    *   Extension method to add properties when creatin JSON for rendering
    */
    getRenderingProperties: function () {
        var self = this;
        var properties = self.properties;

        var result = this._super();
        result.type = "columnReadonly";
        if (properties.displayName) {
            result.displayName = (typeof properties.displayName === "string") ? properties.displayName : properties.displayName.i18n["default"];
        }

        return result;
    }

   
});

bizagi.editor.base.render.extend("bizagi.editor.base.actionlauncher", {}, {

	getPersistenceModel: function () {
		var self = this;

		var result = self._super();
		var properties = result.properties;

		properties.customxpath = "@KeyValue.Action_" + self.guid;

		return result;

	}

});

bizagi.editor.base.render.extend("bizagi.editor.base.polymorphiclauncher", {}, {

    getPersistenceModel: function () {
        var self = this;

        var result = self._super();
        var properties = result.properties;

        properties.customxpath = "@KeyValue.Constructor_" + self.guid;

        return result;

    }

});

bizagi.editor.base.render.extend("bizagi.editor.base.entitytemplate", {}, {

	getPersistenceModel: function () {
		var self = this;

		var result = self._super();
		var properties = result.properties;

		properties.customxpath = "@KeyValue.Action_" + self.guid;

		return result;

	}

});