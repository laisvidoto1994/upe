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
    postRender: function() {
        var self = this;
        var control = self.getControl();
        var link = $(".ui-bizagi-render-link", control);

        // Bind click event
        link.click(function() {
            // Open the link inside a slideForm
            if(self.properties.hasentryrule) {
                var form = self.getFormContainer();
                $.when(form.saveForm()).done(function () {
                    self.submitCheckpointRequest().done(function () {
                        return self.openLinkRule("entryrule");
                    });
                });
            } else {
                self.openLink();
            }

        });

        if (!self.properties.editable) {
            self.element.addClass("bz-rn-read-only");
        }
    },

    /* OPENS LINK DISPLAY FORM INSIDE A DIALOG
    ===========================================*/
    openLink: function() {
        var self = this;
        // var form = self.getFormContainer();

        // Fixed multiple recursion of Formlinks inside Formlinks
        // var formParams = $.extend({}, form.params, self.getFormParams());

        // Send edit request
        $.when(self.submitEditRequest())
            .done(function() {
                bizagi.util.tablet.startLoading();
                //self.paintFormLink();

                $.when(self.paintFormLink()).done(function () {
                    bizagi.util.tablet.stopLoading();
                }).fail(function () { //Executes Rollback actionpaintForm
                    bizagi.util.tablet.startLoading();
                    self.rollbackForm();
                }).always(function () {
                bizagi.util.tablet.stopLoading();
            });

        }).always(function () {
            bizagi.util.tablet.stopLoading();
        });
    },

    /*
    *
    */
    openLinkRule: function (property) {
        var self = this;
        var def = new $.Deferred();

        bizagi.util.tablet.startLoading();

        self.getPropertyValue(property, {})
            .done(function (dataRuleResp) {
                if (dataRuleResp.messages) {
                    var message = dataRuleResp.messages[0];
                    var form = self.getFormContainer();
                    form.validationController.showErrorMessage(message);
                    def.reject();
                } else {
                    if (property == "entryrule") {
                        self.openLink();
                    }
                }
                def.resolve();
            }).fail(function(){
                def.reject();
            })
            .always(function () {
                bizagi.util.tablet.stopLoading();
            });
        return def.promise();
    },

    /*
    *   Method to render non editable values
    */
    postRenderReadOnly: function() {
        var self = this;

        // Execute the same as post-render
        self.postRender();
    },

    /*
    *
    */
    paintFormLink: function () {
        var self = this;
        var properties = self.properties;
        var form = self.getFormContainer();
        var formParams = self.getFormParams();

        var deferred = $.Deferred();

        // Instantiate slide form object
        var slideView = new bizagi.rendering.tablet.slide.view(self.dataService, self.renderFactory, {
            title: self.properties.displayName || "",
            container: form.container,
            navigation: self.getParams().navigation,
            showSaveButton: properties.editable,
            orientation: properties.orientation || "ltr",
            onSave: function(data) {
                // When the data is saved then
                return self.actionSave(data).then(function (result) {
                    //Process the result
                    return self.submitForm(result)
                        .done(function () {
                            deferred.resolve(result);
                        }).fail(function() {
                            deferred.reject();
                        });
                }).fail(function (result) {
                    deferred.reject(result);
                });
            },
            goBack: function(){
                self.rollbackForm();
            }
        });

        slideView.render({
            idRender: properties.id,
            xpathContext: properties.xpathContext,
            idPageCache: properties.idPageCache,
            recordXPath: self.getFormLinkXpath(),
            requestedForm: "linkform",
            editable: properties.editable,
            formParams: formParams,
            url: properties.editPage
        }).fail(function() {
            // Sends a rollback request to delete checkpoints
            deferred.reject();
        });

        return deferred.promise();
    },

    getPropertyValue: function (propertyName, params) {
        var self = this;
        var properties = self.properties;
        var defer = new $.Deferred();

        self.dataService.multiaction().getPropertyData({
            url: properties.dataUrl,
            xpath: properties.xpath,
            idRender: properties.id,
            xpathContext: properties.xpathContext,
            idPageCache: properties.idPageCache,
            property: propertyName,
            extra: params,
            dataType: params ? params.dataType : null
        }).done(function (data) {
            if (data.type == "error") {
                // Workflow engine error, we gotta show it with error
                var form = self.getFormContainer();
                form.validationController.showErrorMessage(data.message);
                defer.reject(data);
            } else {
                defer.resolve(data);
            }
        }).fail(function (jqXHR, textStatus, errorThrown) {
            // Add error messages
            var form = self.getFormContainer();
            form.validationController.showErrorMessage(jqXHR.message);
            defer.reject(jqXHR, textStatus, errorThrown);
        });

        return defer.promise();
    },

    /*
    *
    */
    actionSave: function (data) {
        var self = this;
        var deferred = $.Deferred();

        $.when(self.submitSaveRequest(data)).done(function (result) {
            try {
                if (result.type == "validationMessages") {
                    // Add validation messages
                    self.form.addValidationMessage(result.messages);
                } else if (result.type == "error") {
                    // Add error messages
                    deferred.reject(result);
                }

                deferred.resolve(result);
            } catch (ex) {
                deferred.reject({ noAction: true });
            }
        }).fail( function(data) {
            deferred.reject(data);
        });

        return deferred.promise();
    },

    /*
    *
    */
    submitSaveRequest: function (data) {
        var self = this;
        var properties = self.properties;

         // Don't send request when the link is not editable
         if (properties.editable === false && !properties.value) {
             return null;
         }

         var xpath = self.getFormLinkXpath();
         return self.dataService.saveLinkForm({
             url: properties.saveUrl,
             idRender: properties.id,
             xpathContext: properties.xpathContext === undefined || properties.xpathContext === "" ? xpath : (xpath ? properties.xpathContext + "." + xpath : properties.xpathContext),
             submitData: data
         });
    },

    /*
    *
    */
    submitForm: function(result) {
        var self = this;
        var deferred = $.Deferred();

        var executeSubmitOnChange = true;

        if (result && result.type == "validationMessages") {
            executeSubmitOnChange = false;
        }

        if (self.properties.hasexitrule) {
            self.closeExitRule().done(function () {
                if(executeSubmitOnChange) {
                    //All commits must be resolved before the submitOnChange is executed
                    self.submitCommitRequest().done(function () {
                        if(self.properties.hasentryrule){
                            self.submitCommitRequest().done(function(){
                                $.when(self.submitOnChange()).done(function(){
                                    deferred.resolve(result);
                                });
                            });
                        } else{
                            $.when(self.submitOnChange()).done(function(){
                                deferred.resolve(result);
                            });
                        }
                    });
                }
            }).fail(function(){
                deferred.reject();
            });

        } else if (executeSubmitOnChange) {
            if(executeSubmitOnChange) {
                //All commits must be resolved before the submitOnChange is executed
                self.submitCommitRequest().done(function () {
                    if(self.properties.hasentryrule){
                        self.submitCommitRequest().done(function(){
                            $.when(self.submitOnChange()).done(function(){
                                deferred.resolve(result);
                            });
                        });
                    } else {
                        $.when(self.submitOnChange()).done(function(){
                            deferred.resolve(result);
                        });
                    }
                }).fail( function() {
                    deferred.reject();
                });
            }
        }

        return deferred.promise();
    },

    /*
    *
    */
    closeExitRule: function () {
        var self = this;
        var properties = self.properties;
        var def = new $.Deferred();

        if (properties.hasexitrule) {
            $.when(self.openLinkRule("exitrule")).done(function (result) {
                def.resolve(result);
            }).fail(function(){
                def.reject();
            });
        }

        return def.promise();
    },

    /*
    *
    */
    rollbackForm: function () {
        var self = this;

        $.when(self.submitRollbackRequest()).done(function () {
                //Sends additional rollback request to delete checkpoint from entry rule
                if (self.properties.hasentryrule) {
                    self.submitRollbackRequest();
                }
            });    
        
    }
});