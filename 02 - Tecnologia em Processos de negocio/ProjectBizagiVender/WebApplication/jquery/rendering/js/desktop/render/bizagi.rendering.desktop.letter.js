/*
*   Name: BizAgi Desktop Render Letter Extension
*   Author: Diego Parra
*   Comments:
*   -   This script will redefine the letter render class to adjust to desktop devices
*/

// Extends itself
bizagi.rendering.letter.extend("bizagi.rendering.letter", {}, {
    
    /*
    *   Template method to implement in each device to customize each render after processed
    */
    postRender: function () {
        var self = this;
        var control = self.getControl();
        var button = $(":button", control);
        
        // Stylize button
        button.button();
    },
	
    /*
    *   Template method to implement in each device to customize the render's behaviour to add handlers
    */
	configureHandlers: function () { 
		var self = this;
		var control = self.getControl();
        var button = $(":button", control);
		
		// Call base
		self._super();
		
		// Bind event
        button.click(function(){
            // Save the form prior opening the dialog
            $.when(self.saveForm()).done(function(){
                // Show letter dialog
                self.showLetterDialog();
            });
        });
	},	
    
    /*
    *   Method to render non editable values
    */
    postRenderReadOnly: function () {
        
    },
	
    /*
    *   Template method to implement in each device to customize the render's behaviour to add handlers when the control is readonly
    */
    configureHandlersReadOnly: function () {
    	var self = this;
        var control = self.getControl();
        var properties = self.properties;
        var url = self.dataService.getLetterNotEditableUrl({
            idRender: properties.id,
            xpath: self.getXpath(),
            xpathContext: self.getContextXpath(),
        	idPageCache: properties.idPageCache
        });
    	
    	 // Bind click
        $(".ui-bizagi-render-letter-readonly", control).click(function(){
            // Save the form prior opening the link
            $.when(self.saveForm()).done(function(){
                $.when(self.getCanGenerateLetter())
	            .done(function (wasGenerated) {
	                // Save content in server
	                if (wasGenerated && bizagi.util.parseBoolean(wasGenerated.canGenerate))
	                    // Open the url in a new window
	                    window.open(url);
	                else {
	                    bizagi.showMessageBox(bizagi.localization.getResource("render-letter-not-generated")); 
	                }
	            });
		        
            });
        });
    },
    
    /*
    *   Shows letter dialog
    */
    showLetterDialog: function(){
        var self = this;
        var dialog = new bizagi.rendering.dialog.letter(self.dataService, self.renderFactory);

        $.when(self.getCanGenerateLetter())
	    .done(function (wasGenerated) {
	        // Save content in server
	        if (wasGenerated && bizagi.util.parseBoolean(wasGenerated.canGenerate))
	            $.when(self.getLetterContent())
                .pipe(function (content) {
                    return dialog.render(content);
                }).done(function (newContent) {

                    // Save content in server
                    self.saveLetterContent(newContent);
                });
	        else {
	            bizagi.showMessageBox(bizagi.localization.getResource("render-letter-not-generated"));
	        }
	    });
    }
    
});
