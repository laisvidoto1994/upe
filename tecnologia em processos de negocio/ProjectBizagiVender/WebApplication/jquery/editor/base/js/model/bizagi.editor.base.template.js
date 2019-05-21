/*
*   Name: BizAgi FormModeler Editor template
*   Author: Alexander Mejia
*   Comments:
*   -   This script will define basic stuff for template(model)
*/

bizagi.editor.base.form.extend("bizagi.editor.base.template", {}, {

	/*
	*   Constructor
	*/
	init: function (data, elementFactory, regenerateGuid) {
	    var self = this;
	    
	    // Call base
	    this._super(data, elementFactory, regenerateGuid);	       
	    	    
	    // Set the element name
	    self.type = "template";
	    	   	    
	},
   

	/*
	* Resolves control type
	*/
	getFormParent: function () {
	    return this;
	},

	getLayout: function () {
        // threre is only an element a layout
	    return this.elements[0];
	}
});