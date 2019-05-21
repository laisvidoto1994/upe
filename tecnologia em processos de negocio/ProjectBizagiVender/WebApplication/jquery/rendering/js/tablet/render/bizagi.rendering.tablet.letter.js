/*
*   Name: BizAgi Tablet Render Letter Extension
*   Author: Diego Parra
*   Comments:
*   -   This script will redefine the letter render class to adjust to tablet devices
*/

// Extends itself
bizagi.rendering.letter.extend("bizagi.rendering.letter", {}, {
    /*
    *   Constructor
    */
    init: function (params) {
        // Call base
        this._super(params);

        // Fill default properties
        var properties = this.properties;

        // Fix required
        // No letter can be required on the iPad, 
    	// NOTE: We must implement something to warn the user that there is an editable letter that must be filled in the PC version
    	properties.required = false;
    
    }
});
