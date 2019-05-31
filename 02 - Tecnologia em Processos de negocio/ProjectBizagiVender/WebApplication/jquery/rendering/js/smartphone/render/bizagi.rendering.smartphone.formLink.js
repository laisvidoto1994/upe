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
        var paramsRender = $.extend({}, self._params, { "proxyPrefix": this.dataService.serviceLocator.proxyPrefix, "context": this.dataService.serviceLocator.context });
        this.serviceLocator = new bizagi.render.services.context(paramsRender);
    },

    renderSingle: function () {
        var self = this;
        var properties = self.properties;
        var container = self.getContainerRender();
        var control = self.getControl();

        if (properties.displayType == "value") {
            //self.getLabel().hide();
            self.changeDisplayOption(properties.displayType);
        }
        self.originalElement = self.element;
        properties.orgiginalDisplayType = properties.displayType;
        properties.displayType = "normal";
        self.input = self.element = control.find("a");

        self._sendRelation = self.submitEditRequest;
        self._getData = self.dataService.getFormData;
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
            container.addClass("bz-command-not-edit");
        }
        else {
            container.addClass("bz-command-edit-inline");
        }


    },
    //para la grilla lo que se debe hacer es sobreescribir o crear los metodos params,sendrelation,getData
    renderEdition: function () {

        var self = this;
        var properties = self.properties;
        var container = self.getContainerRender();
        var control = self.getControl();
        var contextEdit = self.getContextEdit();
        var deferred = $.Deferred();
        self.inputEdition = $("<div class='ui-bizagi-component-loading'>").addClass('slideForm');



        $.when(self._sendRelation.apply(self))
           .done(function (response) {
               $.extend(self._params, { "proxyPrefix": self.serviceLocator.proxyPrefix });
               $.when(self._getData.call(self, self._params))
    	        .pipe(function (data) {
    	            if (self._params.editable == false) data.form.properties.editable = false;
    	            self.form = self.renderFactory.getContainer({
    	                type: "form",
    	                data: data.form
    	            });
    	            self.form.params = self.getFormContainer().getParams();

    	            //if (properties.disableProcessButons && properties.disableProcessButons == true) {
    	                jQuery.extend(self.form, {
    	                    processButtons: function () {
    	                        //not send information set in memory and save 

    	                        $.each(self.form.buttons, function (index, element) {
    	                            switch (element["ordinal"]) {
    	                                case 1: //next button will behave as a cancel button
    	                                    $(self.form.getButtons()[index]).click(function () {
    	                                        self.getMenu().notifyLastObserver("back");
    	                                    });
    	                                    self.form.getButtons()[index].innerHTML = bizagi.localization.getResource("Cancel");
    	                                    break;

    	                                default:
    	                                    $(self.form.getButtons()[index]).click(function () {
    	                                        self.getMenu().notifyLastObserver("buttom");
    	                                    });
    	                                    break;
    	                            }
    	                        });
    	                    }
    	                });
    	           // }
    	            return self.form.render();
    	        }, function (message) {
    	            /*** FAIL FILTER **/
    	            var errorTemplate = self.renderFactory.getCommonTemplate("form-error");
    	            $.tmpl(errorTemplate, { message: message }).appendTo(self.inputEdition);

    	        }
        ).done(function (element) {
            // Remove button container
            //  $(".ui-bizagi-button-container", element).detach();

            element.appendTo(self.inputEdition);

            // Publish an event to check if the form has been set in the DOM
            self.form.triggerHandler("ondomincluded");

            // Focus into first control
            // self.focusFirstControl(self.form, 150);

            // Attach a refresh handler to recreate all the form
            self.form.bind("refresh", function (_, refreshParams) {
                //TODO the parent who call this class implement redraw. see smartphone.grid _InternalRenderLinkForm
            });
            deferred.resolve();
            //  self.hideHeadersButtonEdit();

        });


           });

        return deferred.promise();

    },

    hideHeadersButtonEdit: function () {
        var self = this;
        var context = self.getContextEdit();
        var container = self.getContainerRender();
        var properties = self.properties;
        if (properties.hideLabel) {
            context.find(".bz-cn-label").hide();
        }
        //        $('.ui-bizagi-container-children-form', self.inputEdition)[0].appendChild(context.find(".ui-bizagi-container-button-edit")[0])
    },


    setDisplayValueEdit: function (value) { },
    actionSave: function (data) {
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

                        self.form.addErrorMessage(result.message);
                        deferred.reject({ noAction: true });
                    }
                } catch (ex) {

                }
            });

            deferred.resolve();

        }
        else {

            deferred.reject({ noAction: true });
        }

        return deferred.promise();

    },
    getMenu: function () {
        var params = this.getFormContainer().getParams();
        return params.menu;
    }


});