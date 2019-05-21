/*
*   Name: BizAgi Tablet Render Form Link Extension
*   Author: Diego Parra
*   Comments:
*   -   This script will redefine the link render class to adjust to tablet devices
*/

// Extends itself
bizagi.rendering.formLink.extend("bizagi.rendering.formLink", {}, {

    /* POSTRENDER
    ===========================================*/
    postRender: function (element) {
        var self = this;
        var control = self.getControl();
        var link = $(".ui-bizagi-render-link", control);
        
        // Bind click event
        link.click(function(){
            // Open the link inside a slideForm
            self.openLink();
        });
    },
    
    /* OPENS LINK DISPLAY FORM INSIDE A DIALOG
    ===========================================*/
    openLink: function() {
        var self = this;
        var properties = self.properties;
        
        // Send edit request
        $.when(self.submitEditRequest())
        .done(function () {
            
            // Instantiate slide form object            
            var slideForm = new bizagi.rendering.tablet.slideForm(self.dataService, self.renderFactory, {                
                container : self.getFormContainer().container,
                showSaveButton: properties.editable,
            	onSave: function (data) {
                    return self.submitSaveRequest(data);
                }
            });
            
            slideForm.render({
                idRender: properties.id,
                xpathContext: properties.xpathContext,
                idPageCache: properties.idPageCache,
                recordXPath: self.getFormLinkXpath(),
                requestedForm: "linkform",
                editable: properties.editable,
                url: properties.editPage
            }).fail(function () {
                // Sends a rollback request to delete checkpoints
                self.submitRollbackRequest();
            });
        });
    },
    
    /*
    *   Method to render non editable values
    */
    postRenderReadOnly: function () {
        var self = this;
        
        // Execute the same as post-render
        self.postRender();
    }
});