/*
*   Name: BizAgi User Field render Desktop Extension
*   Author: Diego Parra
*   Comments:
*   -   This script will define the basic behaviour for userfields
*/

// Auto-extension
bizagi.rendering.basicUserField.extend("bizagi.rendering.basicUserField", {}, {
	/*
	* Shows a jquery dialog
	*/
    showDialog: function(url, params) {
        var self = this;
        var formDialog = $("<div class='iframeContent'><iframe scrolling='yes' id='innerFrameContent' src='" + url + "' style='width:100%;height:100%;border:0'  /></div>");
        var iframe = $("#innerFrameContent", formDialog);
        
        // The following procedure adds the "closeWindow" function, this will serve as callback from the
        // window, also it's going to serve as brigde to update data back into bizagi fields.
        iframe.load(function(){
            iframe.callInside(function(params){
                // This script will execute inside the iframe context
                this.BACloseWindow = function(controls, submitForm){
                    // close dialog
                    params.formDialog.dialog("close");
                    
                    // Executes the callback to assign values and submit form (if requested)
                    params.formDialog.callback(controls, submitForm);
                };
                
            }, {
               formDialog : formDialog,
               container: self
            });
            // Callback function which will update the values in bizagi
            formDialog.callback = function(controls, submitForm) {
                $.each(controls, function(index,item) {
                    if (!item.xpath) {
                       bizagi.showMessageBox('Error calling closeWindow, the xpath was not defined.', 'Userfield error');
                    }
                    if (!item.value) {
                       bizagi.showMessageBox('Error calling closeWindow, the value was not defined.', 'Userfield error');
                    }
                    
                    self.getFormContainer().getRender(item.xpath).setDisplayValue(item.value);
                });
                // If the closeWindow was call with "submitForm" then execute the submit on change
                if (submitForm) {
                    self.submitOnChange();
                }
            };
        });
        formDialog.dialog({height: params.height, width: params.width, title: params.title});
    },
	
	/*
	*   Shows a browser popup
	*/
	showPopup: function (url, params) {
		var self = this; 
		// Callback function which will update the values in bizagi
        var callbackFn = function(controls, submitForm) {
            $.each(controls, function(index,item) {
                if (!item.xpath) {
                   bizagi.showMessageBox('Error calling closeWindow, the xpath was not defined.', 'Userfield error');
                }
                if (!item.value) {
                   bizagi.showMessageBox('Error calling closeWindow, the value was not defined.', 'Userfield error');
                }
                
                self.getFormContainer().getRender(item.xpath).setDisplayValue(item.value);
            });
            // If the closeWindow was call with "submitForm" then execute the submit on change
            if (submitForm) {
                self.submitOnChange();
            }
        };

		bizagi.showPopup(url, params, callbackFn);
	}
});

/*
*   Default implementation for user fields
*/
bizagi.rendering.basicUserField.extend("bizagi.rendering.defaultUserField", {}, {

    /*
    *   Template method to implement in each device to customize each render after processed
    */
    getEditableControl: function () {
        var self = this;
        var control = self.getControl();
        var properties = self.properties;
        var controlName = properties.control;
        self.input = $("<label>Userfield: " + controlName + " not found</label>").appendTo(control);
    },
    
    /*
	*  Dont send the data to the server
	*/
	collectData: function (renderValues) {
	},
	
    getDisplayValue: function() {
        var self = this;
        var properties = self.properties;
        var controlName = properties.control;
        return "Userfield: " + controlName + " not found";
    },
    
    getReadonlyControl: function() {
        var self = this;
        var control = self.getControl();
        var properties = self.properties;
        var controlName = properties.control;
        var mycontrol = $("<label>Userfield: " + controlName + " not found</label>").appendTo(control);
        return mycontrol;
    }
});