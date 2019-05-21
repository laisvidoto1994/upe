/*
*   Name: BizAgi Tablet Render Form Link Extension
*   Author: Oscar O
*   Comments:
*   -   This script will redefine the link render class to adjust to tablet devices
*/

// Extends itself
bizagi.rendering.formLink.extend("bizagi.rendering.formLink", {
    BA_ACTION_PARAMETER_PREFIX: "p_",
    BA_CONTEXT_PARAMETER_PREFIX: "h_",
    BA_PAGE_CACHE: "pageCacheId"
}, {
    init: function (params) {
        // Call base
        this._super(params);
        params.context = params.context || "workflow";
        var paramsRender = $.extend({}, this._params, { "proxyPrefix": this.dataService.serviceLocator.proxyPrefix, "context": this.dataService.serviceLocator.context });
        this.serviceLocator = new bizagi.render.services.context(paramsRender);
    },

    renderSingle: function () {
        var self = this;
        var properties = self.properties;
        var container = self.getContainerRender();
        var control = self.getControl();

        self.getArrowContainer().hide();

    if (properties.displayType === "value") {
      self.changeDisplayOption(properties.displayType);
    }
    self.originalElement = self.element;
    properties.orgiginalDisplayType = properties.displayType;
    properties.displayType = "normal";
    self.input = self.element = control.find("a");

        self._sendRelation = self.submitEditRequest;
        self._getData = self.dataService.getFormData;
        self._isRefreshForm = false;
        self._params = {
            idRender: properties.id,
            xpathContext: properties.xpathContext,
            idPageCache: properties.idPageCache,
            recordXPath: self.getFormLinkXpath(),
            requestedForm: "linkform",
            editable: properties.editable,
            url: properties.editPage
        };

        if (!properties.editable) {
            container.addClass("bz-rn-non-editable");
        } else {
            container.addClass("bz-command-edit-inline");
        }
    },

    //para la grilla lo que se debe hacer es sobreescribir o crear los metodos params,sendrelation,getData
    renderEdition: function () {
        var self = this;
        var properties = self.properties;

        self.container = self.getParams().navigation.createRenderContainer({ title: properties.displayName });
        self.inputEdition = self.container.element;

        if(self.properties.hasentryrule) {
            var form = self.getFormContainer();
            $.when(form.saveForm()).done(function () {
                self.submitCheckpointRequest().done(function () {
                    return self.openLinkRule("entryrule");
                });
            });
        } else {
            return self.openLink();
        }
    },

    openLink: function () {
        var self = this;

        //Renderiza de nuevo la forma, a travez de una promesa, asignandole el metodo Rollback en caso de cancelar la ultima transación
        return $.when(self._sendRelation.apply(self)).done(function () {
            bizagi.util.smartphone.startLoading();
            $.when(self.paintFormLink()).done(function () {
                bizagi.util.smartphone.stopLoading();
            }).fail(function () { //Executes Rollback action
                bizagi.util.smartphone.startLoading();
                self.rollbackForm();
            }).always(function () {
                bizagi.util.smartphone.stopLoading();
            });
        }).always(function () {
            bizagi.util.smartphone.stopLoading();
        });
    },

    openLinkRule: function (property) {
        var self = this;
        var def = new $.Deferred();

        bizagi.util.smartphone.startLoading();

        self.getPropertyValue(property, {})
            .done(function (dataRuleResp) {
                if (dataRuleResp.messages) {
                    var message = dataRuleResp.messages[0];
                    var form = self.getFormContainer();
                    form.validationController.showErrorMessage(message);
                    def.reject();
                } else {
                    if (property === "entryrule") {
                        self.openLink();
                    }
                }
                def.resolve();
            }).fail(function(){
                def.reject();
            })
            .always(function () {
                bizagi.util.smartphone.stopLoading();
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
            if (data.type === "error") {
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

    /**
     * postRenderEdition
     */
    postRenderEdit: function () {
    },

    /**
    *
    */
    paintFormLink: function () {
        var self = this;
        var deferred = $.Deferred();

        $.extend(self._params, { "proxyPrefix": self.serviceLocator.proxyPrefix });

        $.when(self._getData.call(self, self._params)).pipe(function (data) {
            if (self._params.recordXPath) {
                data.form.properties.recordXpath = self._params.recordXPath;
            }

            if (self._params.editable === false) {
                data.form.properties.editable = false;
            }

            // Grid
            if (self._params.hasOwnProperty("withAddForm") && self._params.withAddForm) {
                if (!data.form.elements || (data.form.elements && data.form.elements.length === 0)) {
                    self._params.hideSaveButton = true;
                }
            }

            self.form = self.renderFactory.getContainer({
                type: "form",
                data: data.form,
                navigation: self.getParams().navigation
            });

            self.form.params = self.getFormContainer().getParams();

            self.form.buttons = [
                $.extend(
                    self.form.buttons[0] || {},
                    {
                        "caption": bizagi.localization.getResource("render-form-dialog-box-save"),
                        "actions": ["submitData", "refresh"],
                        "submitData": true,
                        "refresh": true,
                        "ordinal": 0,
                        "action": "save",
                        "save": true,
                        "style": "",
                        // This callback avoid to call the default processButton in the form
                        callback: function(){
                            // When the data is saved then
                            self.actionSave().then(function (result) {
                                //Process the result
                                return self.submitForm(result)
                                    .done(function () {
                                        deferred.resolve(result);
                                    }).fail(function() {
                                        deferred.reject();
                                    }).always(function() {
                                        self.container.destroy();
                                    });
                            }).fail(function (result) {
                                deferred.reject(result);
                            });
                        }
                    }),
                $.extend(
                    self.form.buttons[1] || {},
                    {
                        "caption": bizagi.localization.getResource("render-form-dialog-box-close"),
                        "actions": ["submitData", "refresh"],
                        "submitData": true,
                        "refresh": true,
                        "ordinal": 1,
                        "action": "back",
                        "save": true,
                        "style": "",
                        //This callback avoid to call the default processButton in the form
                        callback: function () {
                            self.container.destroy();
                            deferred.reject();
                        }
                    })
            ];

            $.extend(self.form, {
                processButtons: function () {
                    //not send information set in memory and save
                    $.each(self.form.buttons, function (index, element) {
                        switch (element["ordinal"]) {
                            case 1: //next button will behave as a cancel button
                                $(self.form.getButtons()[index]).click(function () {
                                    self.container.destroy();
                                    deferred.reject();
                                });

                                self.form.getButtons()[index].innerHTML = bizagi.localization.getResource("render-form-dialog-box-close");

                                self.form.buttons[index].caption = bizagi.localization.getResource("render-form-dialog-box-close");
                                self.form.buttons[index].action = "back";
                                break;

                            default:
                                $(self.form.getButtons()[index]).click(function () {
                                   self.actionSave().then(function (result) {
                                    //Process the result
                                    return self.submitForm(result)
                                        .done(function () {
                                            deferred.resolve(result);
                                        }).fail(function() {
                                            deferred.reject();
                                        }).always(function() {
                                            self.container.destroy();
                                        });
                                    }).fail(function (result) {
                                        deferred.reject(result);
                                    });
                                });

                                if (self._params.hideSaveButton) {
                                    $(self.form.getButtons()[index]).hide();
                                }
                                break;
                        }
                    });
                }
            });

            return self.form.render();

        }, function (message) {
            // FAIL FILTER
            var errorTemplate = self.renderFactory.getCommonTemplate("form-error");
            $.tmpl(errorTemplate, { message: message }).appendTo(self.inputEdition);

            deferred.reject();
        }).done(function (element) {
            // Remove button container

            self.inputEdition.html(element);
            if (!self._isRefreshForm) {
                self.getParams().navigation.navigate(self.container.id);
            }

            self.getParams().navigation.setNavigationButtons(self.form);

            // Publish an event to check if the form has been set in the DOM
            self.form.triggerHandler("ondomincluded");

            // Attach a refresh handler to recreate all the form
            self.form.bind("refresh", function () {
                //TODO the parent who call this class implement redraw. see smartphone.grid _InternalRenderLinkForm
                self.inputEdition.empty();
                self._isRefreshForm = true;

                //Adds the events to capture the
                $.when(self.paintFormLink()).done(function () { })
                .fail(function () {
                    self.submitRollbackRequest();
                });
            });

            //Binds the view close event, and send the RollBack
            self.container.element.bind("close", function(){
                self.rollbackForm();
            });

        }).always(function () {
            bizagi.util.smartphone.stopLoading();
        });

        return deferred.promise();
    },

    hideHeadersButtonEdit: function () {
        var self = this;
        var context = self.getContextEdit();
        var properties = self.properties;

        if (properties.hideLabel) {
            context.find(".bz-cn-label").hide();
        }
    },

    setDisplayValueEdit: function () { },

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
                    } else{
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

    actionCancel: function () { },

    /*
    *
    */
    actionSave: function () {
        var self = this;
        var deferred = $.Deferred();

        if (self.form.validateForm()) {
            var data = {};
            self.form.collectRenderValues(data);

            // Add page cache for this form
            data.idPageCache = self.form.getPageCache();

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
        } else {
            deferred.reject({ noAction: true });
        }

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
    }
});