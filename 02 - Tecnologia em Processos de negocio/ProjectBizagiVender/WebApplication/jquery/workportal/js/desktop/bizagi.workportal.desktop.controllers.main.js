/*
*   Name: BizAgi Workportal Desktop Main Controller
*   Author: Diego Parra (based on  Edward Morales version)
*   Comments:
*   -   This script will override main controller class to apply custom stuff just for desktop device
*/

// Auto extend
bizagi.workportal.controllers.main.extend("bizagi.workportal.controllers.main", {}, {
	
	/*
    *   Constructor
    */
    init: function (workportalFacade, dataService) {
    	var self = this;
    	
    	// Call base
    	self._super(workportalFacade, dataService);
    	
    	// Subscribe to show old window event
        this.subscribe("showOldWindow", function(e, params){
            self.showOldWindow(params);
        });
    },
	
	 /*
    *   Renders the content for the current controller
    *
    */
    renderContent: function () {
    	var self = this;
    	
        // Check navigator compatibility
    	if (bizagi.util.isIE()) {
    	    var version = bizagi.util.getIEVersion(); 
    		if (version < 8) {
    			return self.renderIENotCompatibleTemplate();
    		}
    	}
    
        return self._super();
    },
	
	/*
	*   Render not compatible template
	*/
	renderIENotCompatibleTemplate: function () {
	    var self = this;
        var template = self.workportalFacade.getTemplate("workportal.notCompatibleIE");
	
        // Render content
        var content = self.content = $.tmpl(template, { url : BIZAGI_PATH_TO_BASE + "defaulthtml.aspx"});
		
		// Set resize layout event
        $(window).resize(function() {                
            self.resizeLayout();
        });
		
		return content;
	},

    /*
    *   To be overriden in each device to apply layouts
    */
    postRender: function(){ 
        // TODO: Apply logic here
    },

    /*
     *   Add dialog to dialogStack
     */
    addDialogToDialogStack: function(dialog){
        var self = this;
        // Add to stack
        bizagi.workportal.desktop.dialogStack = bizagi.workportal.desktop.dialogStack || [];
        bizagi.workportal.desktop.dialogStack.push(dialog);
    },

    /*
    *   Shows a widget inside a modal dialog
    *   Implement on each device
    */
    showDialogWidget: function(data){  
        var self = this;
        var dialog = new bizagi.workportal.desktop.widgets.dialog(self.dataService, self.workportalFacade);
        dialog.renderWidget(data);

        self.addDialogToDialogStack(dialog);

        return dialog;
    },
    
    /*
    *   Close the current modal dialog
    *   Implement on each device
    */
    closeCurrentDialog: function(params){  
        // Remove from
        bizagi.workportal.desktop.dialogStack = bizagi.workportal.desktop.dialogStack || [];
        if (bizagi.workportal.desktop.dialogStack.length > 0){
            var dialog = bizagi.workportal.desktop.dialogStack.pop();
            try {
                dialog.close();
            } catch(e) {
                //
            }
        }

    	// Close a quirks mode popup if opened
    	bizagi.closeQuirksModePopup();
    },

    /**
     *   Close all modal dialogs
     *   Implement on each device
     */
    closeAllDialogs: function(){
        bizagi.workportal.desktop.dialogStack = bizagi.workportal.desktop.dialogStack || [];
        if (bizagi.workportal.desktop.dialogStack.length > 0){
            for(iDialog = 0, iTotalDialog = bizagi.workportal.desktop.dialogStack.length; iDialog < iTotalDialog; iDialog++){
                var dialog = bizagi.workportal.desktop.dialogStack.pop();
                try {
                    dialog.close();
                } catch(e) {
                    //
                }
            }
        }
    },
    
    /*
    *   Popup a widget
    *   Implement on each device
    */
    popupWidget: function(params){  
        var self = this;
        var popup = new bizagi.workportal.desktop.widgets.popup(self.dataService, self.workportalFacade, params.options);
        popup.renderWidget(params);
        
        // Attach closed handler if present
        if (params.options && params.options.closed){
            $.when(popup.closed())
            .done(function(){
                // Executes callback
                params.options.closed();
            });
        }            
    },
	
	/*
	*   Shows an url inside a window popup
	*/
	showOldWindow: function (params) {
		// Call bizagi internal function
		var url = bizagi.util.extendQueryString(params.url, {referrer : "workportal" });
		bizagi.showQuirksModePopup(url, params.windowParameters);
    },
    
	cleanWidgets: function () {

	    this.workarea.cleanWidgets();

	    if (bizagi.workportal.desktop.popup) {
            if(bizagi.workportal.desktop.popup.instance) {
                if(bizagi.workportal.desktop.popup.instance.dontClose !== undefined) {
                    bizagi.workportal.desktop.popup.instance.dontClose = false;
                    bizagi.workportal.desktop.popup.instance.close();
                }
            } else {
                var innerDialog = $(".modal .complex-frame");
                if(innerDialog.length > 0) {
                    innerDialog.closest(".modal").remove();
                }
            }
        }
    },

    refreshQueryFormShortCut : function(){
        if(bizagi.workportal.widgets.queries.shortcut.instance)
            bizagi.workportal.widgets.queries.shortcut.instance.renderStoredQueries();
    }

});
