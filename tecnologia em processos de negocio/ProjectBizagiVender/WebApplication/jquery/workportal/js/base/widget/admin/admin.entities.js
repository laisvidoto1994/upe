/**
 * Admin module to manage entities {Parametrics, Stakeholders}
 * @author Andres Felipe Arenas Vargas, Ricardo Alirio Perez Diaz
 */
bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.admin.entities", {}, {
    /**
     * Renders the content for the current controller
     * @return {tmpl} The main template
     */
    renderContent: function () {
        var self = this;
        var template = self.getTemplate("admin.entity.wrapper");
        self.content = $.tmpl(template, {});

        self.loadtemplates();
        return self.content;
    },
    /**
     * Returns the widget name
     * @return {string} Widget name
     */
    getWidgetName: function () {
        return bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_ADMIN_ENTITIES;
    },
    /**
     * Load form  entity empty if params is just "guid" or with data if params is "guid" and "idRow"
     * @param params
     */
    getFormEntity: function (params) {
        var self = this;
        self.currentGuidForm = params.guidForm;
        self.currentIdRow = params.idRow;

        bizagi.loader.start("rendering").then(function () {
            var facade = new bizagi.rendering.facade();
            $.when(self.dataService.getAdminEntitiesForm(params)).done(function (responseForm) {
                //Modify JSON form with params necessary to widget
                responseForm.form.contextType = "entity";
                $.when(facade.execute({ "data": responseForm, "contexttype": "entity", "canvas": $("#detailEntity", self.panelWrapper), "isEntityForm": true }))
                    .done(function (formRender) {
                        if(self._referrer==="stakeholder") {
                            self._associatedUser = formRender.getRender("associatedUser")["value"];
                        }
                        if (params.idRow) {
                            formRender.surrogatekey = params.idRow
                        }
                        formRender.unbind("refresh");
                        formRender.bind("refresh", function (_, refreshParams) {
                            formRender.dispose();
                            self.configureRefresh(_, refreshParams);
                        });

                        formRender.internalSubmitOnChange = function (params) {
                            var def = $.Deferred();
                            $.when(self.internalSubmitOnChangeEntity(formRender))
                                .done(function (responseSave) {
                                    if (responseSave) {
                                        var params = self.getSelectedItem();
                                        params.idPageCache = formRender.idPageCache;
                                        params.guidForm = self.currentGuidForm;
                                        params.guid = params.guidEntity;
                                        params.idRow = self.currentIdRow;
                                        self.getFormEntity(params);
                                        def.resolve();
                                    }
                                })
                                .fail(function () {
                                    def.reject();
                                });
                            return def.promise();
                        }

                        formRender.processButton = function (buttonProperties) {
                            formRender.endLoading();
                            if (buttonProperties.action == 'save') {
                                if (formRender.validateForm()) {
                                    return $.when(self.saveFormEntity(formRender))
                                        .done(function (responseSave) {
                                            if (responseSave) {
                                                self.drawSimpleGrid(self.getSelectedItem());
                                            }
                                        });
                                }
                            }
                            else if (buttonProperties.action === 'cancel') {
                                self.drawSimpleGrid(self.getSelectedItem());
                            }
                        };
                    });
            });
        });
    },
    /**
     * InternalSubmitOnChangeEntity, used when searching a user in the form,
     * Temporaly submits the search result
     * @param formRender
     * @returns {*}
     */
    internalSubmitOnChangeEntity: function (formRender) {
        var self = this;
        var defSave = $.Deferred();
        var params = self.getSelectedItem();
        var serviceRender = new bizagi.render.services.service();
        var renderValues = {};

        formRender.collectRenderValues(renderValues);
        $.when(serviceRender.multiactionService.submitData({
            action: "SUBMITONCHANGE",
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
        return defSave.promise();
    }
});