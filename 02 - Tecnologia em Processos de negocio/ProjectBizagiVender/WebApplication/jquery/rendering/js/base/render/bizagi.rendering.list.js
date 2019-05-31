/*
*   Name: BizAgi Render List Class
*   Author: Diego Parra
*   Comments:
*   -   This script will define basic stuff for list renders
*/

bizagi.rendering.combo.extend("bizagi.rendering.list", {}, {

    /*
    *   Update or init the element data
    */
    initializeData: function (data) {
        var self = this;
        // Call base
        this._super(data);

        // Fill default properties
        var properties = this.properties;
    	properties.listSize = properties.listSize || 0;
    },

	
	/*
    *   Gets the template used by the combo render
    *   can be overriden in subclasses to reuse logic and just change the template
    */
    getTemplateName: function () {
        return "list";
    },
	
	/*
    *   Determines if we need to show the current data regardless if it belongs to data or not
    *   Can be overriden to change behaviour
    */
    showCurrentData: function () {
        return false;
    }

});