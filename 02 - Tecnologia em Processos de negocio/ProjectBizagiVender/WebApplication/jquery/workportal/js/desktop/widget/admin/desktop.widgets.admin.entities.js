﻿﻿﻿/**
 * Admin module to manage entities
 * @author Andres Felipe Arenas Vargas, Ricardo Alirio Perez Diaz
 */
bizagi.workportal.widgets.admin.entities.extend("bizagi.workportal.widgets.admin.entities", {}, {
    /**
     * Init constructor
     * @param workportalFacade The workportalFacade to access to all components
     * @param dataService The dataService for making requests
     * @param params Widget Description
     */
    init: function (workportalFacade, dataService, params) {
        var self = this;
        var templateName = "bizagi.workportal.desktop.widgets.admin.entities";

        // Call base
        self._super(workportalFacade, dataService, params);
        self._referrer = "entity";
        //Load templates
        self.loadTemplates({
            "admin.entity.wrapper": bizagi.getTemplate(templateName).concat("#ui-bizagi-workportal-widget-admin-entity-wrapper"),
            "admin.entity.panel.wrapper": bizagi.getTemplate(templateName).concat("#ui-bizagi-workportal-widget-admin-entity-panel-wrapper"),
            "admin.entity.list": bizagi.getTemplate(templateName).concat("#ui-bizagi-workportal-widget-admin-entity-list"),
            "admin.entity.error": bizagi.getTemplate(templateName).concat("#ui-bizagi-workportal-widget-admin-entity-error"),
            useNewEngine: false
        });
    },
    /**
     * Load all the templates
     */
    loadtemplates: function () {
        var self = this;
        self.panelWrapper = $.tmpl(self.getTemplate("admin.entity.panel.wrapper"));
        self.entitiesList = self.getTemplate("admin.entity.list");
        self.entitiesError = self.getTemplate("admin.entity.error");
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
        $.when(self.dataService.getAdminEntitiesList())
            .done( function (data) {
                if (data.length > 0) {
                    self.entities = data;
                    var entityListWrapper = $("#admin-entity-list-wrapper", self.panelWrapper);

                    content.html(self.panelWrapper);
                    $.tmpl(self.entitiesList, {entitiesList: self.entities}).appendTo(entityListWrapper);
                    $("#entitiesList option:first", entityListWrapper).attr('selected', 'selected');

                    self.configureHandlers();
                }
                else {
                    var notFoundMessage = self.getResource("workportal-general-first-line-no-records-found");
                    content.html($.tmpl(self.entitiesError, {errorMessage: notFoundMessage}));
                }
            })
            .fail( function (error) {
                self.entities = undefined;
                var errorMessage = self.getResource("workportal-widget-admin-entities-error");
                content.html($.tmpl(self.entitiesError, {errorMessage: errorMessage}));
            });
    },
    /**
     * Configure handlers
     */
    configureHandlers: function () {
        var self = this;
        var entityListWrapper = $("#admin-entity-list-wrapper", self.panelWrapper);

        //Catch the typed text in the search field and filter the entities list
        $("#searchEntity", entityListWrapper).keyup(function () {
            var includeOpt = false;
            var matchString = $(this).val().toLowerCase();

            $('#entitiesList option', entityListWrapper).remove();
            $.each(self.entities, function () {
                if (matchString.length > 1) {
                    if (this.displayName.toLowerCase().indexOf(matchString) != -1) {
                        includeOpt = true;
                    }
                }
                else {
                    includeOpt = true;
                }
                if (includeOpt) {
                    $("#entitiesList", entityListWrapper).append($("<option>", {
                        value: this.guid,
                        text: this.displayName,
                        "data-allowAdd": this.allowAdd,
                        "data-allowEdit": this.allowEdit
                    }));
                    includeOpt = false;
                }
            });
        });
        // EntitiesList listener
        $("#entitiesList", entityListWrapper).change(function () {
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
                    self.performSimpleGrid(selectedEntity,responseFormDisplay);
                });
        }
        else {
            self.performSimpleGrid(selectedEntity);
        }
    },

    /**
     * Process entity form
     * @param content
     * @param responseEntity
     * @param responseFormDisplay
     */
    resolveEntityForm: function (responseEntity) {
        var self = this;
        var def = new $.Deferred();
        var newResponseEntity = {};
        var responseFormDisplay;

        /**
         * Get render elements within a form
         * @param elements
         * @return {Array}
         */
        var getRenderElements = function (elements) {
            var result = [];
            elements = elements || {};

            $.each(elements, function (key, value) {
                if (value.container) {
                    result.push.apply(result, getRenderElements(value.container.elements));
                } else {
                    result.push(value.render.properties);
                }
            });

            return result;
        };

        var headerIsAnEntity = function (header) {
            var entity = "";
            // Search xpath within responseEntity object and check if it is an entity
            $.each(responseEntity.header, function (key, value) {
                if (value.fieldValue == header.xpath && value.entity) {
                    entity = value.entity;
                }
            });

            return entity;
        };
        /**
         * Create headers from a form
         * @param elements
         * @return {Array}
         */
        var getFormHeaders = function (elements) {
            var result = [];
            elements = getRenderElements(elements || {});

            $.each(elements, function (key, value) {
                var attributeType = value.dataType;
                var entity = headerIsAnEntity(value);
                var headerProperties = {};
                switch (value.type) {
                    case "upload":
                        attributeType = 1002;
                        break;
                    case "image":
                        attributeType = 1003;
                        break;
                }

                headerProperties = $.extend(value, {
                    "fieldValue": value.xpath,
                    "attributeType": attributeType
                });

                if (entity) {
                    headerProperties.entity = entity;
                }

                result.push(headerProperties);
            });

            return result;
        };

        /**
         * Get all values of a render controls
         * @param surrogatedKeys
         * @return {*}
         */
        var getFormDataRows = function (surrogatedKeys) {
            var def = new $.Deferred();
            var dataRows = [];
            var queueForms = [];
            var selectedEntity = self.getSelectedItem();
            var formParams = {
                guid: selectedEntity.guidEntity,
                guidForm: selectedEntity.idDisplayForm,
                isStakeholder: false
            };
            surrogatedKeys = surrogatedKeys || [];

            // If there are not surrogatedKeys, call  getAdminEntitiesForm service
            // without idRow, just for get headers
            if (surrogatedKeys.length == 0) {
                $.when(self.dataService.getAdminEntitiesForm(formParams)).done(function (result) {
                    if (!responseFormDisplay) {
                        responseFormDisplay = result;
                    }
                    // Resolve empty array of rows
                    def.resolve([]);
                });
            } else {
                $.each(surrogatedKeys, function (key, value) {
                    formParams.idRow = value;
                    queueForms.push(self.dataService.getAdminEntitiesForm(formParams));
                });
                // Resolve Queue of deferreds
                $.when.apply($, queueForms).done(function () {
                    $.map(queueForms, function (response, key) {
                        var responseForm = response.responseJSON;
                        if (!responseFormDisplay) {
                            responseFormDisplay = responseForm;
                        }
                        var elements = getRenderElements(responseForm.form.elements);
                        //Add surrogated key as a first element
                        var surrogatedKey = surrogatedKeys[key];
                        var values = [surrogatedKey];

                        $.each(elements, function (elmKey, elmValue) {
                            var value = elmValue.value;
                            switch (elmValue.type) {
                                case "image":
                                case "upload":
                                    value = "...";
                                    break;
                                case "boolean":
                                    value = (elmValue.value) ? "X" : "";
                                    break;
                                case "combo":
                                    if( typeof elmValue.value == "object" && elmValue.value.length > 0 ){
                                        if(typeof elmValue.value[0].value == "object" ){
                                            value = elmValue.value[0].value.join(",");
                                        }else{
                                            value = elmValue.value[0].value;
                                        }
                                    }else{
                                        value = ""
                                    }
                                    break;
                            }
                            values.push(value);
                        });

                        dataRows.push(values);

                        if (dataRows.length == surrogatedKeys.length) {
                            def.resolve(dataRows);
                        }
                    });
                });
            }
            return def.promise();
        };

        /**
         * Get all surrogated keys
         * @param entityObj
         * @return {Array}
         */
        var getSurrogatedKeys = function (entityObj) {
            var surrogatedKeys = [];
            entityObj = entityObj || {};
            if (entityObj.row) {
                $.each(entityObj.row, function (key, value) {
                    // Always the first element is a surrogated key
                    surrogatedKeys.push(value[0]);
                });
            }
            return surrogatedKeys;
        };

        var setFieldValueHeaders = function (headers,headersFieldValue){
            if(headers.length != headersFieldValue.length)
                return; //In case not consistent data

            headers.forEach(function(h,i){
                h.fieldValue =  headersFieldValue[i].fieldValue;
            });
            return headers;
        };

        var surrogatedKeys = getSurrogatedKeys(responseEntity);

        $.when(getFormDataRows(surrogatedKeys)).done(function (dataRows) {
            // Add surrogatedkey header
            var headers = [responseEntity.header[0]];
            headers.push.apply(headers, getFormHeaders(responseFormDisplay.form.elements));
            headers = setFieldValueHeaders(headers ,responseEntity.header);
            newResponseEntity = {
                header: headers,
                entity: responseEntity.entity,
                row: dataRows,
                total:responseEntity.total,
                page: responseEntity.page,
                records: responseEntity.records
            };
           // self.renderTableEntity(content, params, newResponseEntity);
            def.resolve(newResponseEntity);
        });
        return def.promise();
    },

    performSimpleGrid: function (selectedEntity,formDisplay) {
        var self = this;
        var simpleGridPlugginOptions = {
            allowAdd: selectedEntity.allowAdd,
            allowEdit: selectedEntity.allowEdit,
            displayName: selectedEntity.displayName,
            pageSize: 10,
            onDataBinding: function(args) {
                var def = $.Deferred();
                $.when(self.dataService.getAdminEntitiesRowData($.extend(args,  {guidEntity: selectedEntity.guidEntity})))
                    .done(function (responseEntity) {
                        if(selectedEntity.guidEntity != self.getSelectedItem().guidEntity)
                            return;
                        if(formDisplay){
                            responseEntity.relatedEntity = selectedEntity.guidEntity;
                            var oldResponse = self.reshapeEntity(responseEntity, formDisplay);
                           $.when(self.resolveEntityForm(responseEntity)).done(function(newResponseEntity){
                                def.resolve(newResponseEntity);
                           });
                        }else{
                            def.resolve(responseEntity);
                        }
                    })
                    .fail(function (error) {
                        var errorMessage = self.getResource("workportal-widget-admin-entities-instances-error");
                        $("#admin-entity-instances-wrapper", self.getContent()).html($.tmpl(self.entitiesError, {errorMessage: errorMessage}));
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
        $("#admin-entity-instances-wrapper", self.panelWrapper).simpleGrid(self, simpleGridPlugginOptions).render();
    },
    /**
     * Return all the data of the selected item
     * @return {{guidEntity: *, displayName: *, allowAdd: boolean, allowEdit: boolean}}
     */
    getSelectedItem: function () {
        var self = this;
        var $selectedEntity = $('#entitiesList option:selected', self.panelWrapper);
        var params = {
            guidEntity: $selectedEntity.val(),
            displayName: $selectedEntity.text(),
            allowAdd: ($selectedEntity.attr("data-allowAdd").toLowerCase() === "true") ? true : false,
            allowEdit: ($selectedEntity.attr("data-allowEdit").toLowerCase() === "true") ? true : false,
            idDisplayForm: $selectedEntity.attr("data-idDisplayForm")
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
        var $selectedEntity = $('#entitiesList option:selected', self.panelWrapper);
        var entity = self.entities.find(function (e) {return e.guid === $selectedEntity.val()});
        var params = {
            guid: $selectedEntity.val()
        };
        if (action === 'New') {
            params.guidForm = (typeof entity.idAddForm !== "undefined") ? entity.idAddForm : "00000000-0000-0000-0000-000000000000";
        }
        else if (action == 'Edit') {
            params.idRow = $(element).attr('data-idrowentity');
            params.guidForm = (typeof entity.idEditForm !== "undefined") ? entity.idEditForm : "00000000-0000-0000-0000-000000000000";
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
                        var errorMessage = self.getResource("workportal-widget-admin-entities-instances-error");
                        $("#admin-entity-instances-wrapper", self.getContent()).html($.tmpl(self.entitiesError, {errorMessage: errorMessage}));
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
        var serviceRender = new bizagi.render.services.service();
        var renderValues = {};

        formRender.collectRenderValues(renderValues);
        $.when(serviceRender.multiactionService.submitData({
            action: "SAVE",
            contexttype: "entity",
            data: renderValues,
            surrogatekey: (typeof formRender.surrogatekey !== "undefined") ? formRender.surrogatekey : false,
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
    },

    //remove elements of the table if exist a display form
    reshapeEntity: function (responseEntity, formDisplay) {
        var self = this;
        var newResponseEntity = {};
        newResponseEntity.entity = responseEntity.entity;
        newResponseEntity.page = responseEntity.page;
        newResponseEntity.records = responseEntity.records;
        newResponseEntity.total = responseEntity.total;
        newResponseEntity.header =[];
        newResponseEntity.row = [];
        var indexElementsAdd = [];
        $.each(formDisplay.form.elements, function (kF, vF) {
            self.mergeFormAndTable(vF, newResponseEntity, indexElementsAdd, responseEntity);
        });
        indexElementsAdd.push(responseEntity.header.length - 1);
        var desabledElement = responseEntity.header.slice(-1).pop();
        newResponseEntity.header.push(desabledElement);
        //validate if first element responseEntity exist in newResponseEntity else add becouse is subrrogate key
       if (indexElementsAdd.indexOf(0) == -1) {
            responseEntity.header[0].dataType = -11;
            var firstElement = responseEntity.header[0];
            newResponseEntity.header.unshift(firstElement);
            indexElementsAdd.unshift(0);
        }

        var indexAdd = 0;
        $.each(responseEntity.row, function (k, v) {
            var newDataRow = [];
            for (var i = 0; i < indexElementsAdd.length; i++) {
                indexAdd = indexElementsAdd[i];
                newDataRow[i] = v[indexAdd];
            }
            newResponseEntity.row[k] = newDataRow;
        });
        return newResponseEntity;
    },

    renderTable: function (element, newResponseEntity, indexElementsAdd, responseEntity) {
        var self = this;
        if (element.container) {
            for (var i = 0; i < element.container.elements.length; i++) {
                self.renderTable(element.container.elements[i], newResponseEntity, indexElementsAdd, responseEntity);
            }
        }
        else {
            $.each(responseEntity.header, function (index, header) {
                if (element.render.properties.xpath) {
                    if (element.render.properties.xpath.toUpperCase() == header.fieldValue.toUpperCase()) {
                        //newResponseEntity.header.push(vE);

                        newResponseEntity.header.push($.extend(element.render.properties, header));
                        indexElementsAdd.push(index);
                    }
                }
            });
        }
    },

    mergeFormAndTable: function (element, newResponseEntity, indexElementsAdd, responseEntity) {
        var self = this;
        if (element.container) {
            for (var i = 0; i < element.container.elements.length; i++) {
                self.renderTable(element.container.elements[i], newResponseEntity, indexElementsAdd, responseEntity);
            }
        }
        else {
            $.each(responseEntity.header, function (index, header) {
                if (element.render.properties.xpath) {
                    if (element.render.properties.xpath.toUpperCase() == header.fieldValue.toUpperCase()) {
                        //newResponseEntity.header.push(header);
                        newResponseEntity.header.push($.extend(header,element.render.properties));
                        indexElementsAdd.push(index);
                    }
                }
            });
        }
    }
});
