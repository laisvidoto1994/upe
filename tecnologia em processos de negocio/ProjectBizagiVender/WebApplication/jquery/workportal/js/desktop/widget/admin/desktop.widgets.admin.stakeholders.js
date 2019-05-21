/**
 * Admin module to manage Stakeholders
 * @author Andres Felipe Arenas Vargas, Ricardo Alirio Perez Diaz
 */
bizagi.workportal.widgets.admin.entities.extend("bizagi.workportal.widgets.admin.stakeholders", {}, {
    /**
     * Init constructor
     * @param workportalFacade The workportalFacade to access to all components
     * @param dataService The dataService for making requests
     * @param params Widget Description
     */
    init: function (workportalFacade, dataService, params) {
        var self = this;
        var templateName = "bizagi.workportal.desktop.widgets.admin.stakeholders";

        // Call base
        self._super(workportalFacade, dataService, params);
        self._referrer = "stakeholder";
        //Load templates
        self.loadTemplates({
            "admin.entity.wrapper": bizagi.getTemplate(templateName).concat("#ui-bizagi-workportal-widget-admin-stakeholder-wrapper"),
            "admin.stakeholder.panel.wrapper": bizagi.getTemplate(templateName).concat("#ui-bizagi-workportal-widget-admin-stakeholder-panel-wrapper"),
            "admin.stakeholder.list": bizagi.getTemplate(templateName).concat("#ui-bizagi-workportal-widget-admin-stakeholder-list"),
            "admin.stakeholder.error": bizagi.getTemplate(templateName).concat("#ui-bizagi-workportal-widget-admin-stakeholder-error"),
            useNewEngine: false
        });
    },
    /**
     * Load all the templates
     */
    loadtemplates: function () {
        var self = this;
        self.panelWrapper = $.tmpl(self.getTemplate("admin.stakeholder.panel.wrapper"));
        self.stakeholdersList = self.getTemplate("admin.stakeholder.list");
        self.stakeholdersError = self.getTemplate("admin.stakeholder.error");
    },
    /**
     * Renders the content for the current widget
     * Get the list of all parametric entities and display them in the Template
     * If there is an error, display a a message
     */
    postRender: function () {
        var self = this;
        var content = self.getContent();

        content.empty();
        $.when(self.dataService.getAdminStakeholdersList())
            .done( function (data) {
                if (data.length > 0) {
                    self.stakeholders = data;
                    var stakeholderListWrapper = $("#admin-stakeholder-list-wrapper", self.panelWrapper);

                    content.html(self.panelWrapper);
                    $.tmpl(self.stakeholdersList, {stakeholdersList: self.stakeholders}).appendTo(stakeholderListWrapper);
                    $("#stakeholdersList option:first", stakeholderListWrapper).attr('selected', 'selected');

                    self.configureHandlers();
                }
                else {
                    var notFoundMessage = self.getResource("workportal-general-first-line-no-records-found");
                    content.html($.tmpl(self.stakeholdersError, {errorMessage: notFoundMessage}));
                }
            })
            .fail( function (error) {
                self.stakeholders = undefined;
                var errorMessage = self.getResource("workportal-widget-admin-stakeholders-error");
                content.html($.tmpl(self.stakeholdersError, {errorMessage: errorMessage}));
            });
    },
    /**
     * Configure handlers
     */
    configureHandlers: function () {
        var self = this;
        var stakeholderListWrapper = $("#admin-stakeholder-list-wrapper", self.panelWrapper);

        //Catch the typed text in the search field and filter the stakeholder list
        $("#searchStakeholder", stakeholderListWrapper).keyup(function () {
            var includeOpt = false;
            var matchString = $(this).val().toLowerCase();

            $('#stakeholdersList option', stakeholderListWrapper).remove();
            $.each(self.stakeholders, function () {
                if (matchString.length > 1) {
                    if (this.displayName.toLowerCase().indexOf(matchString) != -1) {
                        includeOpt = true;
                    }
                }
                else {
                    includeOpt = true;
                }
                if (includeOpt) {
                    $("#stakeholdersList", stakeholderListWrapper).append($("<option>", {
                        value: this.guid,
                        text: this.displayName,
                        "data-allowAdd": this.allowAdd,
                        "data-allowEdit": this.allowEdit
                    }));
                    includeOpt = false;
                }
            });
        });
        // Stakeholderlist listener
        $("#stakeholdersList", stakeholderListWrapper).change(function () {
            self.drawSimpleGrid();
        }).trigger("change");
    },
    /**
     * Init the simple grid pluggin to display all the instances of the selected entity
     */
    drawSimpleGrid : function(){
        var self = this;
        var selectedEntity = self.getSelectedItem();
        if (selectedEntity.idDisplayForm && selectedEntity.idDisplayForm != "00000000-0000-0000-0000-000000000000") {
            var formParams = {
                guid: selectedEntity.guidEntity,
                guidForm: selectedEntity.idDisplayForm,
                isStakeholder: false
            };
            $.when(self.dataService.getAdminEntitiesForm(formParams))
                .done(function (responseFormDisplay) {
                    self.performSimpleGrid(responseFormDisplay);
                });
        }
        else {
            self.performSimpleGrid();
        }
    },

    performSimpleGrid: function (formDisplay) {
        var self = this;
        var selectedEntity = self.getSelectedItem();
        var simpleGridPlugginOptions = {
            allowAdd: selectedEntity.allowAdd,
            allowEdit: selectedEntity.allowEdit,
            displayName: selectedEntity.displayName,
            pageSize: 7,
            onDataBinding: function(args) {
                var def = $.Deferred();
                $.when(self.dataService.getAdminEntitiesRowData($.extend(args, {guidEntity: selectedEntity.guidEntity})))
                    .done(function (responseEntity) {
                        if(formDisplay){
                            var newResponseEntity = self.reshapeEntity(responseEntity, formDisplay);
                            def.resolve(newResponseEntity);
                        }else{
                            def.resolve(responseEntity);
                        }
                    })
                    .fail(function (error) {
                    var errorMessage = self.getResource("workportal-widget-admin-stakeholders-instances-error");
                    $("#admin-stakeholder-instances-wrapper",self.getContent()).html($.tmpl(self.stakeholdersError, {errorMessage: errorMessage}));
                });
                return def.promise();
            },
            onLoadFilter: function(args){
                if (args.type === "Entity") {
                    return self.dataService.getAdminEntityData(args);
                }
            },
            onAdd: function(e, args) {
                self.validateVersionForm(this, 'New');
            },
            onEdit: function(e, args) {
                self.validateVersionForm(args, 'Edit');
            },
            getResource: function(key) {
                self.getResource(key);
            }
        };

        $("#admin-stakeholder-instances-wrapper", self.panelWrapper).simpleGrid(self, simpleGridPlugginOptions).render();
    },
    /**
     * Return all the data of the selected item
     * @return {{guidEntity: *, displayName: *, allowAdd: boolean, allowEdit: boolean}}
     */
    getSelectedItem: function () {
        var self = this;
        var $selectedStakeholder = $('#stakeholdersList option:selected', self.panelWrapper);
        var params = {
            guidEntity: $selectedStakeholder.val(),
            displayName: $selectedStakeholder.text(),
            allowAdd: ($selectedStakeholder.attr("data-allowAdd").toLowerCase() === "true") ? true : false,
            allowEdit: ($selectedStakeholder.attr("data-allowEdit").toLowerCase() === "true") ? true : false,
            idDisplayForm: $selectedStakeholder.attr("data-idDisplayForm")
        };

        return params;
    },
    /**
     * Build the correct data to get the form based on the action {Edit, New}
     * If the action is:
     * - New: {guidEntity, guidForm}
     * - Edit: {surrogateKey, guidEntity, guidForm}
     * @param element The selected element
     * @param action The action to perform
     */
    validateVersionForm: function (element, action) {
        var self = this;
        var $selectedStakeholder = $('#stakeholdersList option:selected', self.panelWrapper);
        var stakeholder = self.stakeholders.find(function (e) {return e.guid === $selectedStakeholder.val()});
        var params = {
            guid: $selectedStakeholder.val(),
            isStakeholder: true
        };
        if (action === 'New') {
            params.guidForm = (typeof stakeholder.idAddForm !== "undefined") ? stakeholder.idAddForm : "00000000-0000-0000-0000-000000000000";
        }
        else if (action == 'Edit') {
            params.idRow = $(element).attr('data-idrowentity');
            params.guidForm = (typeof stakeholder.idEditForm !== "undefined") ? stakeholder.idEditForm : "00000000-0000-0000-0000-000000000000";
        }

        //Empty the canvas to render the form
        $('#detailEntity', self.panelWrapper).empty();
        if (params.guidForm === "00000000-0000-0000-0000-000000000000") {
            self.getFormEntity(params);
        }
        else {
            $.when(self.dataService.getAdminEntityMigrated(params.guidForm)).done(function (data) {
                if (data.result == 0 || data.result == 10) {
                    self.getFormEntity(params);
                }
                else {
                    if (data.result == -9) {
                        var errorMessage = self.getResource("workportal-widget-admin-stakeholders-instances-error");
                        $("#admin-stakeholder-instances-wrapper",self.getContent()).html($.tmpl(self.stakeholdersError, {errorMessage: errorMessage}));
                    }
                    else {
                        if (action == 'New') {
                            params.idRow = -1;
                        }
                        var url = 'App/Admin/Entity.aspx?giudEntity=' + params.guid + '&idSurrogateKey=' + params.idRow + '&referer=entityadmin&Action=' + action + '&idForm=' + params.idForm;
                        self.loadIframeForm(url, 'otherForm');
                    }
                }
            });
        }
    },
    /**
     * Collect the data changed in the form and save the values
     * @param formRender the Form Rendered
     */
    saveFormEntity: function (formRender) {
        var self = this;
        var defSave = $.Deferred();
        var params = self.getSelectedItem();
        var renderValues = {};

        formRender.collectRenderValues(renderValues);
        //Si se modifico el usuario asociado se debe validar que este no este asignado a otra instancia
        if (self.associatedUserHasChange(renderValues)) {
            $.when(self.dataService.getUserStakeholders({idUser: renderValues.associatedUser.id})).done(function (resp) {
                if (resp.length > 0) {
                    var alreadyAssociated = resp.find(function (e) {return e.idEntity === params.guidEntity});

                    if (typeof alreadyAssociated !== "undefined"){
                        var confirmationMsg = bizagi.localization.getResource("render-stakeholder-delete-associate-instance-other-user-confirm-msg");

                        $.when(bizagi.showConfirmationBox(confirmationMsg, "Bizagi", "warning")).done(function () {
                            self.submitFormData(formRender, renderValues, defSave);
                        }).fail(function () {
                            defSave.reject();
                        });
                    }
                    else {
                        self.submitFormData(formRender, renderValues, defSave);
                    }
                }
                else {
                    self.submitFormData(formRender, renderValues, defSave);
                }
            }).fail(function (formError) {
                bizagi.showMessageBox(formError.message);
                defSave.reject();
            });
        }
        else {
            self.submitFormData(formRender, renderValues, defSave);
        }

        return defSave.promise();
    },
    /**
     * Submit the data of the form and resolve de deferred
     * @param formRender the Form Rendered
     * @param renderValues the values of the form
     * @param defSave the deferred
     */
    submitFormData: function (formRender, renderValues, defSave) {
        var self = this;
        var serviceRender = new bizagi.render.services.service();

        $.when(serviceRender.multiactionService.submitData({
            action: "SAVE",
            contexttype: "entity",
            data: renderValues,
            surrogatekey: (typeof formRender.surrogatekey !== "undefined" ? formRender.surrogatekey : false),
            idPageCache: formRender.idPageCache
        })).done(function (formRender) {
            if (formRender.type == "success") {
                defSave.resolve(true);
            }
            else {
                defSave.reject();
            }
        }).fail(function (formError) {
            bizagi.showMessageBox(formError.message);
            defSave.reject();
        });
    },
    /**
     * Check if the associated user has changed. A user changes when:
     * - There is no selected associated user and the user search and select one
     * - There is an associated user and the user change it
     * @returns {boolean}
     */
    associatedUserHasChange: function (renderValues) {
        var self = this;
        var userChanged = false;

        if (typeof self._associatedUser !== "undefined" ) {
            if (typeof renderValues.associatedUser !== "undefined") {
                if (self._associatedUser.id !== renderValues.associatedUser.id) {
                    userChanged = true;
                }
            }
        }
        else {
            if (typeof renderValues.associatedUser !== "undefined") {
                userChanged = true;
            }
        }
        return userChanged;
    }
});
