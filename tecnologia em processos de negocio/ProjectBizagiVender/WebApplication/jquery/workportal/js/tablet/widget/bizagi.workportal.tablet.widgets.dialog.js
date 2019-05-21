/*
*   Name: BizAgi Tablet Widget Dialog Implementation
*   Author: Diego Parra
*   Comments:
*   -   This script will shows a widget inside a modal dialog
*/

// Extends itself
$.Class.extend("bizagi.workportal.tablet.widgets.dialog", {        
    DIALOG_WIDTH: 800,
    DIALOG_HEIGHT: 550

}, {

    /* 
    *   Constructor
    */
    init: function (dataService, workportalFacade) {
        this.dataService = dataService;
        this.workportalFacade = workportalFacade;
    },

    /*
    *   Render the Widget
    *   Returns a deferred
    */
    renderWidget: function (params) {
        var self = this;
        var doc = window.document;
        var defer = new $.Deferred();
        var widget;

        // Creates widget
        $.when(
            self.workportalFacade.getWidget(params.widgetName, params)

        ).pipe(function (result) {
            // Renders widget    
            widget = result;
            return widget.render();

        }).done(function () {
            var content = widget.getContent();

            // Append content into a dialog
            self.dialogBox = $("<div />").append(content).appendTo("body", doc);

            // Create dialog box
            self.showDialogBox(self.dialogBox, params)
            .done(function (data) { defer.resolve(); });
        });

        // Return promise
        return defer.promise();
    },

    /*
    *   Shows the dialog box in the browser
    *   Returns a promise that the dialog will be closed
    */
    showDialogBox: function (dialogBox,params) {
        // Define buttons
        var defer = new $.Deferred();
        
    	// TODO: Place the next line to execute when the user closes the dialog box
        defer.resolve();
    	
    	// TODO: Implement this

        // Return promise
        return defer.promise();
    },
    
    /*
    *   Close dialog
    */
    close:function(){
        // TODO: Implement this
    }
});
