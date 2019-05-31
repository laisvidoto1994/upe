/*
*   Name: BizAgi Smartphone Widget Dialog Implementation
*   Author: oscaro
*   Comments:
*   -   This script will shows a widget inside a modal dialog
*/

// Extends itself
$.Class.extend("bizagi.workportal.smartphone.widgets.dialog", {        
    DIALOG_WIDTH: 300,
    DIALOG_HEIGHT: 400

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
            // register
            self.register(widget);
            return widget.render();

        }).done(function () {
            var content = widget.getContent();

            // Append content into a dialog
            // fix for SUITE-8970
            if(self.getResponseValues !== undefined && self.getResponseValuesParams !== undefined) {
                self.dialogBox = $("<div />").append(content);
            } else {
                self.dialogBox = $("<div />").append(content).appendTo("body", doc);
            }

            // Create dialog box
            self.showDialogBox(self.dialogBox, params)
            .done(function (data) { defer.resolve(); });
        });

        // Return promise
        return defer.promise();
    },
    
    register : function(widget) {
        var self = this;
        if(widget.registerCallback) {
            widget.registerCallback(self);
        }
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
        
        bizagi.workportal.smartphone.widgets.dialog.instance = this;
        
        // fix for SUITE-8711
        if(params.data !== undefined) {
            if(params.data.transitions !== undefined) {
                var container = $(".ui-bizagi-form", $("body"));
                if(container.length == 1) {
                    // fix for SUITE-8970
                    if(!(container.find(".complex-frame").length > 0)) {
                        container.append(dialogBox);
                    }
                }
            }
        }
    	
    	// TODO: Implement this

        // Return promise
        return defer.promise();
    },
    
    /*
    *   Close dialog
    */
    close:function(){
        var self = this;
        
        if(self.dontClose) return;

        self.dialogBox.remove();
        bizagi.workportal.smartphone.widgets.dialog.instance = null;
    }
});
