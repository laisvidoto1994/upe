
/*
*   Name: BizAgi FormModeler Editor startForm
*   Author: Alexander Mejia
*   Comments:
*   -   This script will define basic stuff for startForm(model)
*/

bizagi.editor.base.form.extend("bizagi.editor.base.startform", {},

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
	        self.type = "startform";
          

	    },
	
	    getPersistenceModel: function() {
	        var self = this;

	        //Set displayName property if the startForm is new
	        if (self.triggerGlobalHandler("getControllerInfo", { type: "isNewForm" })) {
	            var property = "displayName";

	            if (!self.resolveProperty(property)) {
	                var resource = bizagi.editor.utilities.resolveResource("bizagi-editor-startform-display-name");
	                var value = bizagi.editor.utilities.buildComplexLocalizable(resource, self.guid, property);

	                self.assignProperty(property, value);
	            }
	        }

	        // Call base
	        return self._super();


	    },


	    /*
	    * Create default buttons
	    */
	    createDefaultButtons: function () {
	        var self = this;
	        self.buttons = [];
	        var createButtonGuid = Math.guid();
	        var createButton = self.elementFactory.createElement("formbutton", {
	            guid: createButtonGuid,
	            properties: {
	                caption: bizagi.editor.utilities.buildComplexLocalizable(bizagi.localization.getResource("render-form-button-create"), createButtonGuid, "caption"),
	                actions: ["validate", "createnewcase"]
	            }
	        });
            
	        createButton.setParent(self);
	        self.buttons.push(createButton);
	    },

	    /*
	    * Override hasCustomButtons function of base form
	    */
	    hasCustomButtons: function () {
	        return true;
	    }
	}
));