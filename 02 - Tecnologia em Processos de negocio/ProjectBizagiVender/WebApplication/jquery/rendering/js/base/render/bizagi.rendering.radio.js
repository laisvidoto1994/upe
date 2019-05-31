/*
*   Name: BizAgi Render Radio Class
*   Author: Diego Parra
*   Comments:
*   -   This script will define basic stuff for radio renders
*/

bizagi.rendering.combo.extend("bizagi.rendering.radio", {}, {

    /*
    *   Update or init the element data
    */
    initializeData: function (data) {
        var self = this;
        // Call base
        this._super(data);

        // Fill default properties
        var properties = this.properties;
        properties.horizontal = bizagi.util.parseBoolean(properties.horizontal) || false;
        
        // Set a random identifier to fix a problem when using radio buttons inside grids and the plugin mismatch the elements because all of them have the same name
        properties.unique = bizagi.util.randomNumber(1000,1000000);//Math.ceil(Math.random() * 1000);
    },
    
    /*
    *   Gets the template used by the combo render
    *   can be overriden in subclasses to reuse logic and just change the template
    */
    getTemplateName: function () {
        return "radio";
    },
	
	/*
    *   Determines if we need to show the empty node or not
    *   Can be overriden to change behaviour
    */
    showEmpty: function () {
        return false;
    },
	
	/*
    *   Determines if we need to show the current data regardless if it belongs to data or not
    *   Can be overriden to change behaviour
    */
    showCurrentData: function () {
        return false;
    },

    
    /*
    *   Adds custom parameters to process the template
    */
    getTemplateParams: function(){ 
        var self = this;
        var properties = self.properties;
        
        return {
            vertical: !properties.horizontal
        };
    },

    /*
    * Cleans current data
    */
    cleanData: function () {
        var self = this;
        var value = { id: "", label: "" };
        var selectedItem = self.element.find(".ui-radio-state-checked");

        selectedItem.removeClass("ui-radio-state-checked");
        self.setDisplayValue(value);
        self.setValue(value, false);
        self.clearDisplayValue();
    }

});

