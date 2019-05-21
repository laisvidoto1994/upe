bizagi.editor.base.form.extend("bizagi.editor.base.adhocform", {},

// Extend from container and adhoc form behaviour (multiple inheritance)
	$.extend({}, bizagi.editor.base.formBehaviour, {

	    /*
	    *   Constructor
	    */
	    init: function (data, elementFactory) {
	        var self = this;
	        
	        // Call base
	        this._super(data, elementFactory);

	        // Set the element name
	        self.type = "adhocform";	       
	    }
	}
));