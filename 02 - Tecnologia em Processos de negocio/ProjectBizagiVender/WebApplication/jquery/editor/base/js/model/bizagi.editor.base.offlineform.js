
/*
*   Name: BizAgi FormModeler Editor offlineForm
*   Author: Alexander Mejia
*   Comments:
*   -   This script will define basic stuff for offlineForm(model)
*/

bizagi.editor.base.form.extend("bizagi.editor.base.offlineform", {},

// Extend from container and search form behaviour (multiple inheritance)
	$.extend({}, bizagi.editor.base.formBehaviour, {

	    /*
	    *   Constructor
	    */
	    init: function (data, elementFactory) {
	        var self = this;
	        
	        // Call base
	        this._super(data, elementFactory);

	        // Set the element name
	        self.type = "offlineform";	       
	    }
	}
));