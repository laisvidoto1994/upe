
/*
*   Name: BizAgi FormModeler Editor Layout Render
*   Author: Alexander Mejia
*   Comments:
*   -   This script will define basic stuff for layout.render
*/

bizagi.editor.base.element.extend("bizagi.editor.base.renderLayout", {}, {

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
	    var self = this,            
	        category = category || "render";

	    return $.when(self._super())
    	        .pipe(function (model) {                    
    	            model.properties.value = self.getValue();
    	            var result = {};
    	            result[category] = model;

    	            return result;
    	        });
	},

    /*
    *   Get persistence model
    */
	getPersistenceModel: function () {
	    var self = this;

	    var result = {
	        type: self.type,
	        guid: self.guid,
	        properties: self.filterDefaultValues(self.properties)
	    };
	   
	    return result;
	},
	   
    /*
    * Returns the design value
    */
	getValue: function () {
	    var self = this,
            properties = self.properties;
	    
	    var xpath = properties.link || properties.xpath;
	    var displayName = properties.displayName;


	    if (xpath) {	        
	        return self.getDesignValue(xpath);
	    }
         
	    if (displayName != undefined) {
	        return bizagi.editor.utilities.resolvei18n(displayName);
	    }

	    if (properties.type) {

	        var type = properties.type.replace(/[:\s]*/g, '').toLowerCase();
	        if (type == 'label' || type == 'value') {
	            type = 'drophere';
	        }

	        return bizagi.localization.getResource("bizagi-editor-templates-labels-controls-" + type);
	    }

	},

    /*
    * Returns true if the element has a value 
    */
	hasValue: function () {
	    var self = this,
            properties = self.properties;

	    var xpath = properties.link || properties.xpath;
	    if (xpath) { return true; }
	    if (properties.displayName != undefined) { return true; }
	    
	    return false;
	},
	

	/*
	* Resolves control type
	*/
	getControlType: function () {
	    return this.controlType;
	},

    /*
    * returns the design value, related with each type
    */
	getDesignValue: function (xpath) {
	    var self = this,
            type = self.type;

	    var arrayXpath = xpath.xpath.baxpath.xpath.split(".");
	    var name = "";
	    if (arrayXpath.length > 1) {
	        name = arrayXpath[arrayXpath.length - 1];
	    } else {
	        name = bizagi.editor.utilities.resolveComplexXpath(xpath);
	    }

	    return name;
	},

    /*
    * Returns true if the control is visible in the layout
    */
	isVisible: function () {
	    var self = this;

	    return !self.resolveProperty('hide');
	}
		
});
