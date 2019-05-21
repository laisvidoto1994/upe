/*
 *   Name: BizAgi Desktop Render Form Link Extension
 *   Author: Diego Parra
 *   Comments:
 *   -   This script will redefine the link render class to adjust to desktop devices
 */

// Extends itself
bizagi.rendering.formLink.extend("bizagi.rendering.formLink", {}, {
    /*
    *   Template method to implement in each device to customize the render's behaviour to add handlers
    */
    configureHandlers: function () {
        var self = this,
            control = self.getControl(),
            link = $(".ui-bizagi-render-link", control),
            properties = self.properties;

        // Call base
        self._super();

        // Define dialog
        self.dialog = null;

        // Bind click event
        link.click(function () {
            // Open the link inside a dialog
            if (properties.hasentryrule) {
                var form = self.getFormContainer();

                $.when(form.saveForm()).done(function () {
                    self.submitCheckpointRequest();
                    self.openLinkRule("entryrule");
                });
            } else {
                self.openLink();
            }
        });
    },

    openLinkRule: function (property) {
        var self = this;
        var def = new $.Deferred();

        // save form data
        var form = self.getFormContainer();
        self.getPropertyValue(property, {})
            .done(function (dataRuleResp) {
                if (dataRuleResp.messages != null) {
                    var message = dataRuleResp.messages[0];
                    var form = self.getFormContainer();
                    form.validationController.showErrorMessage(message);
                    def.reject();
                } else {
                    if (property == "entryrule") self.openLink();
                }
                def.resolve();
            }).fail(function(error){
                def.reject();
            });

        return def.promise();
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
                self.getFormContainer().addErrorMessage(data.message);
                defer.reject(data);
            } else {
                defer.resolve(data);
            }
        }).fail(function (jqXHR, textStatus, errorThrown) {
            self.getFormContainer().addErrorMessage(jqXHR.message);
            defer.reject(jqXHR, textStatus, errorThrown);
        });

        return defer.promise();
    },

    /*
    *   Method to render non editable values
    */
    postRenderReadOnly: function () {
        var self = this,
            mode = self.getMode();

        if (mode == "execution") {
            self.configureHandlers();
        }
    },
    /*
   *   Submits a link save request for the displayed form
   *   Returns a deferred
   */
    submitSaveRequest: function (data, defClose) {
        var self = this,
                properties = self.properties;

        // Don't send request when the link is not editable
        if (properties.editable == false && !properties.value)
            return null;

        var xpath = self.getFormLinkXpath();
        return self.dataService.saveLinkForm({
            url: properties.saveUrl,
            idRender: properties.id,
            xpathContext: properties.xpathContext == undefined || properties.xpathContext == "" ? xpath : (xpath ? properties.xpathContext + "." + xpath : properties.xpathContext),
            submitData: data
        });
    },

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
        } else {
            def.resolve();
        }

        return def.promise();
    },
    /*
    *   Opens the link display form inside a dialog
    */
    openLink: function () {
        var self = this, data, options;
        var properties = self.properties;
        if (typeof (properties.canBeSaved) == "undefined") properties.canBeSaved = true;
        var form = self.getFormContainer();

        // When the link is not editable, then the form can't have save button
        if (properties.editable === false) properties.canBeSaved = false;

        if (form.properties.displayAsReadOnly) {
            properties.canBeSaved = false;
        }

        $.when(self.getFormContainer().properties.editable ? form.submitData() : undefined).done(function () {
            // Send edit request
            $.when(self.submitEditRequest()).done(function () {
                // Show dialog with new form after that
                self.dialog = new bizagi.rendering.dialog.form(self.dataService, self.renderFactory, {
                    showSaveButton: properties.canBeSaved,
                    maximized: properties.maximized,
                    title: properties.displayName,
                    orientation: properties.orientation || "ltr",
                    onSave: function (data) {
                        var def = new $.Deferred();

                        self.submitSaveRequest(data, def.promise()).done(function (result) {
                            var executeSubmitOnChange = true;
                            if (result && result.type == "validationMessages") {
                                executeSubmitOnChange = false;
                            }
                            if (properties.hasexitrule) {
                                self.closeExitRule().done(function () {
                                    if (executeSubmitOnChange) {
                                        def.resolve(result);
                                        self.submitCommitRequest();
                                        self.submitOnChange({});

                                        if (properties.hasentryrule)
                                            self.submitCommitRequest();
                                    }
                                }).fail(function(){
                                    def.reject();
                                });
                            } else if (executeSubmitOnChange) {
                                if (executeSubmitOnChange) {
                                    def.resolve(result);
                                    self.submitCommitRequest();
                                    self.submitOnChange({});

                                    if (properties.hasentryrule)
                                        self.submitCommitRequest();
                                }
                            }
                        });

                        return def.promise();
                    },
                    close: function () {
                    }
                });

                self.renderFormLinkDialog();
            });
        });
    },

    /*
    *   Render Dialog
    */
    renderFormLinkDialog: function () {

        var self = this;
        var properties = self.properties;
        // DiegoP: Commented the following lines because it was generating a side effect bug, and it was only intended for plans
        // The idea is that when we use plans, it opens a form link (of the parent activity), and the whole page must be optional (without required fields)
        // but now  when the there is a formlink inside the parent form; it's opening the target form  but the required fields are still required
        //var required = bizagi.util.parseBoolean(properties.required) !== null ? bizagi.util.parseBoolean(properties.required) : true;

        self.dialog.render({
            idRender: properties.id,
            xpathContext: self.getFormLinkXpathContext(),
            idPageCache: properties.idPageCache,
            recordXPath: self.getFormLinkXpath(),
            requestedForm: "linkform",
            editable: properties.editable,
            //required: required,
            url: properties.editPage
        }).fail(function () {
            // Sends a rollback request to delete checkpoints
            self.submitRollbackRequest();

            //Sends additional rollback request to delete checkpoint from entry rule
            if (properties.hasentryrule)
                self.submitRollbackRequest();
        });
    },

    getFormLinkXpathContext: function () {
        var self = this;
        var xpathContext = self.properties.xpathContext;
        var parentXpathContext = self.getXpathContext();
        if (parentXpathContext && xpathContext) {
            if (xpathContext.indexOf(parentXpathContext) === 0) {
                return xpathContext;
            } else {
                return parentXpathContext + "." + xpathContext;
            }
        } else {
            return xpathContext;
        }
    }
});
