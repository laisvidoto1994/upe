﻿﻿/**
 * Admin module to manage adhoc entities (parametrics)
 * @author Jose Aranzazu
 */
bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.admin.adhoc.entities", {}, {
    /**
     * Init constructor
     * @param workportalFacade The workportalFacade to access to all components
     * @param dataService The dataService for making requests
     * @param params Widget Description
     */
    init: function (workportalFacade, dataService, params) {
        var self = this;

        // Call base
        self._super(workportalFacade, dataService, params);

        self.dialogBox = {};

        self.entities = [];        

        self.entityMap = {};
        self.parametricEntityMap = {};
        self.masterEntityMap = {};

        self.entityInstancesMap = {};

        self.attribTypes = [
            {
                name: "Common Type",
                options: [
                    { value: { id: 15, type: 15 }, label: "VarChar" },
                    { value: { id: 6, type: 6 }, label: "Decimal" },
                    { value: { id: 7, type: 7 }, label: "Numeric" },
                    { value: { id: 8, type: 8 }, label: "Money" },
                    { value: { id: 5, type: 5 }, label: "Boolean" },
                    { value: { id: 12, type: 12 }, label: "DateTime" }
                ]
            }
        ];        

        var templateName = "bizagi.workportal.desktop.widgets.admin.adhoc.entities";

        self.initializeJSGrid();        

        self.notifier = bizagi.injector.get("notifier");

        //Load templates
        self.loadTemplates({
            "admin.adhoc.entity.wrapper": bizagi.getTemplate(templateName).concat("#ui-bizagi-workportal-widget-admin-adhoc-entity-wrapper"),
            "admin.adhoc.entity.panel.wrapper": bizagi.getTemplate(templateName).concat("#ui-bizagi-workportal-widget-admin-adhoc-entity-panel-wrapper"),
            "admin.adhoc.entity.list": bizagi.getTemplate(templateName).concat("#ui-bizagi-workportal-widget-admin-adhoc-entity-list"),
            "admin.adhoc.entity.error": bizagi.getTemplate(templateName).concat("#ui-bizagi-workportal-widget-admin-adhoc-entity-error"),
            "admin.adhoc.entity.nodata": bizagi.getTemplate(templateName).concat("#ui-bizagi-workportal-widget-admin-adhoc-entity-nodata"),
            "admin.adhoc.entity.form": bizagi.getTemplate(templateName).concat("#adhoc-entity-form-popup"),
            "admin.adhoc.entity.form.attribtype": bizagi.getTemplate(templateName).concat("#adhoc-entity-form-attribtype"),
            "admin.adhoc.entity.form.displayattrib": bizagi.getTemplate(templateName).concat("#adhoc-entity-form-displayattrib"),
            useNewEngine: false
        });
    },

    /*
	 *   Returns the widget name
	 */
    getWidgetName: function () {
        return bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_ADMIN_ADHOC_ENTITIES;
    },

    /*
	 *   Renders the content for the current controller
	 */
    renderContent: function () {
        var self = this;
        var tmpl = self.getTemplate("admin.adhoc.entity.wrapper");
        var content = self.content = $.tmpl(tmpl);
        return content;
    },

    /**
     * Renders the content for the current widget
     * Get the list of all parametric entities and display them in the Template
     * If there is an error, display a a message
     */
    postRender: function () {
        var self = this;        

        self.panelWrapper = $.tmpl(self.getTemplate("admin.adhoc.entity.panel.wrapper"));
        self.entitiesList = self.getTemplate("admin.adhoc.entity.list");
        self.entitiesError = self.getTemplate("admin.adhoc.entity.error");
        self.entitiesNoData = self.getTemplate("admin.adhoc.entity.nodata");

        var content = self.getContent();
        content.empty();
        
        $.when(self.dataService.getAdhocEntitiesList())
            .done( function (data) {
                if (data.length > 0) {                    
                    self.createEntityMap(data);
                    self.renderEntitiesListPanel();
                }
                else {
                    var notFoundMessage = self.getResource("workportal-general-first-line-no-records-found");                    
                    var noDataTemplate = $.tmpl(self.entitiesNoData, { errorMessage: notFoundMessage });
                    $("#entityNoData", noDataTemplate).click(function () {
                        self.showAdhocEntityForm();
                    });
                    content.html(noDataTemplate);                    
                }
            })
            .fail( function (error) {
                self.entityMap = undefined;
                var errorMessage = self.getResource("workportal-widget-admin-entities-error");
                content.html($.tmpl(self.entitiesError, {errorMessage: errorMessage}));
            });
    },

    renderEntitiesListPanel: function(entity){
        var self = this;
        var content = self.getContent();
        var entityListWrapper = $("#admin-entity-list-wrapper", self.panelWrapper);        
        entityListWrapper.empty();
        content.html(self.panelWrapper);
        var parametrics = $.map(self.parametricEntityMap, function (v) { return v; });
        var masters = $.map(self.masterEntityMap, function (v) { return v; });
        $.tmpl(self.entitiesList, { parametricEntityList: parametrics, masterEntityList: masters }).appendTo(entityListWrapper);
        if (entity) {
            $("#entitiesList option[value=" + entity + "]", entityListWrapper).attr('selected', 'selected');            
        } else {
            $("#entitiesList option:first", entityListWrapper).attr('selected', 'selected');
        }
        self.configureHandlers();
    },

    /**
     * Configure handlers
     */
    configureHandlers: function () {
        var self = this;
        var entityListWrapper = $("#admin-entity-list-wrapper", self.panelWrapper);
        var entityInstancesWrapper = $("#admin-entity-instances-wrapper", self.panelWrapper);

        //Catch the typed text in the search field and filter the entities list
        $("#searchEntity", entityListWrapper).keyup(function () {
            var includeOpt = false;
            var matchString = $(this).val().toLowerCase();

            $('#entitiesList option', entityListWrapper).remove();
            $.each(self.entityMap, function () {
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
                        value: this.id,
                        text: this.displayName
                    }));
                    includeOpt = false;
                }
            });
        });
        // EntitiesList listener
        $("#entitiesList", entityListWrapper).change(function () {
            self.setCurrentEntity();
            self.performSimpleGrid();
        }).trigger("change");

        $("#adhocEntityAdd", entityListWrapper).click(function () {            
            self.showAdhocEntityForm(true);
        });

        $("#adhocEntityEdit", entityInstancesWrapper).click(function () {
            self.showAdhocEntityForm();
        });
    },

    performSimpleGrid: function () {
        var self = this        

        //$("#jsGrid", self.panelWrapper).empty();
        $("#jsGrid", self.panelWrapper).jsGrid("destroy");

        $.when(self.buildColumnsToGrid(self.currentEntity)).done(function (columns) {
            $("#jsGrid", self.panelWrapper).jsGrid({
                width: "100%",
                height: "460px",

                inserting: self.currentEntity.entityType == 1 ? false : true,
                editing: self.currentEntity.entityType == 1 ? false : true,
                sorting: false,
                paging: true,
                autoload: true,

                //data: clients,
                controller: {
                    loadData: function () {
                        var def = $.Deferred();

                        $.when(self.dataService.getAdhocEntityInstances(self.currentEntity.id))
                        .done(function (response) {
                            def.resolve(response);
                        })
                        .fail(function (error) {
                            var errorMessage = self.getResource("workportal-widget-admin-entities-instances-error");
                            $("#admin-entity-instances-wrapper", self.getContent()).html($.tmpl(self.entitiesError, { errorMessage: errorMessage }));
                        });
                        return def.promise();
                    },
                    insertItem: function (item) {
                        self.saveAdhocEntityInstance($.extend(true, {}, item), true);
                        return item;
                    },
                    updateItem: function (item) {
                        self.saveAdhocEntityInstance($.extend(true, {}, item), false);
                        return item;
                    }
                },

                fields: columns
            });
        });

        $("#pager").on("change", function () {
            var page = parseInt($(this).val(), 10);
            $("#jsGrid").jsGrid("openPage", page);
        });
    },

    saveAdhocEntityInstance: function (data, isNew) {
        var self = this;
        var instance = {};
        if (isNew) {
            instance.id = Math.guid();
        } else {
            instance.id = data.id;
            delete data.id;            
        }
        instance.disabled = data.disabled;        
        delete data.disabled;
        instance.data = JSON.stringify(data);
        $.when(self.dataService.saveAdhocEntityInstance({ entityId: self.currentEntity.id, isNew: isNew, instance: instance }))
        .done(function () {
            self.notifier.showSucessMessage(printf(bizagi.localization.getResource("workportal-adhoc-entity-instance-save"), ""));
            
        })
        .fail(function (error) {
            var errorMessage = self.getResource("workportal-widget-admin-entities-instances-error");
            $("#admin-entity-instances-wrapper", self.getContent()).html($.tmpl(self.entitiesError, { errorMessage: errorMessage }));
        });        
    },

    buildColumnsToGrid: function (selectedEntity) {        
        var self = this;
        var def = new $.Deferred()
        var queue = new bizagiQueue();
        if (selectedEntity.gridColumns) return selectedEntity.gridColumns;
        if (!selectedEntity.attributes || selectedEntity.attributes.length == 0) return [];
        var fields = [];
        for (i = 0; i < selectedEntity.attributes.length; i++) {
            var newField = {
                guid: selectedEntity.attributes[i].attribGuid,
                name: selectedEntity.attributes[i].name,
                title: selectedEntity.attributes[i].displayName
            };
            if (selectedEntity.attributes[i].width) {
                newField.width = selectedEntity.attributes[i].size;
            }
            if (selectedEntity.attributes[i].required) {
                newField.validate = "required";
            }
            switch (selectedEntity.attributes[i].attribType.type) {
                case 15: //String
                    newField.type = "text";
                    
                    break;
                case 7: //Numeric
                    newField.type = "number";
                    
                    break;
                case 5: //Boolean
                    newField.type = "checkbox";
                    
                    break;
                case 12: //DateTime
                    newField.type = "datetime";
                    
                    break;
                case 8: //Money
                    newField.type = "money";
                    
                    break;
                case 6: //Decimal
                    newField.type = "float";
                    
                    break;
                case 25: //Entity                                        
                    //var entityId = selectedEntity.attributes[i].attribType.relatedEntity;
                    //if (selectedEntity.entityType == 21) {//Parametric                        
                        if (self.entityInstancesMap[selectedEntity.attributes[i].attribType.relatedEntity]) {
                            self.buildEntityField(self.entityInstancesMap[selectedEntity.attributes[i].attribType.relatedEntity], selectedEntity.attributes[i].attribType.relatedEntity, "bizagi");
                        } else {
                            queue.add($.when(self.getEntityValues("bizagi", selectedEntity.attributes[i].attribType.relatedEntity)).done(function (result) {
                                self.entityInstancesMap[result[0].value.entity] = result;
                                self.buildEntityField(result, result[0].value.entity, "bizagi");
                            }));
                        }
                    /*} else {
                        self.buildEntityField(null, selectedEntity.attributes[i].attribType.relatedEntity, "bizagi");
                    }*/
                    newField.type = "bizagientity" + selectedEntity.attributes[i].attribType.relatedEntity;
                    break;
                case 36: //Entity                                        
                    //var adhocEntityId = selectedEntity.attributes[i].attribType.relatedEntity;
                    //if (selectedEntity.entityType == 21) {                        
                        if (self.entityInstancesMap[selectedEntity.attributes[i].attribType.relatedEntity]) {
                            self.buildEntityField(self.entityInstancesMap[selectedEntity.attributes[i].attribType.relatedEntity], selectedEntity.attributes[i].attribType.relatedEntity, "adhoc");
                        } else {
                            queue.add($.when(self.getEntityValues("adhoc", selectedEntity.attributes[i].attribType.relatedEntity)).done(function (result) {
                                self.entityInstancesMap[result[0].value.entity] = result;
                                self.buildEntityField(result, result[0].value.entity, "adhoc");
                            }));
                        }
                    /*} else {
                        self.buildEntityField(null, selectedEntity.attributes[i].attribType.relatedEntity, "adhoc");
                    }*/
                    newField.type = "adhocentity" + selectedEntity.attributes[i].attribType.relatedEntity;
                    break;
                default:
                    text = "text";
            }
            fields.push(newField);
        }
        fields.push({ name: "disabled", title: self.getResource("workportal-adhoc-entity-instance-col-disabled"), type: "checkbox", width: 50 });
        if (selectedEntity.entityType == 21) fields.push({ type: "control", deleteButton: false });
        fields.push({ name: "id", visible: false });
        selectedEntity.gridColumns = fields;
        //return fields;

        $.when(queue.execute()).done(function(){
            def.resolve(fields);
        })
        
        return def.promise();
    },

    setCurrentEntity: function () {
        var self = this;
        var selectedEntity = $('#entitiesList option:selected', self.panelWrapper);
        self.currentEntity = self.entityMap[selectedEntity.val()];        
    },     

    showAdhocEntityForm: function (isNew) {
        var self = this, template = self.getTemplate("admin.adhoc.entity.form");        
        self.dialogBox.formContent = $.tmpl(template);
        self.dialogBox.elements = {
            inputName: $("#input-name-adhoc-entity", self.dialogBox.formContent),
            inputDisplayName: $("#input-displayname-adhoc-entity", self.dialogBox.formContent),
            inputDesc: $("#input-desc-adhoc-entity", self.dialogBox.formContent),
            selectType: $("#entType", self.dialogBox.formContent),
            gridFields: $("#entityFieldsGrid", self.dialogBox.formContent),            
            buttonSave: $("#button-accept-adhoc-entity-form", self.dialogBox.formContent),
            buttonCancel: $("#button-cancel-adhoc-entity-form", self.dialogBox.formContent)
        };
        self.dialogBox.elements.buttonSave.on("click", $.proxy(self.onSaveAdhocEntity, self));
        self.dialogBox.elements.buttonCancel.on("click", $.proxy(self.closeDialogBox, self));        

        if (!isNew && self.currentEntity) {
            self.dialogBox.data = self.currentEntity.attributes ? $.extend(true, [], self.currentEntity.attributes) : [];
            self.dialogBox.adhocEntityGuid = self.currentEntity.id;
            self.dialogBox.elements.inputName.val(self.currentEntity.name);
            self.dialogBox.elements.inputDisplayName.val(self.currentEntity.displayName);
            self.dialogBox.elements.inputDesc.val(self.currentEntity.description);
            $("option[value=" + self.currentEntity.entityType + "]", self.dialogBox.elements.selectType).attr('selected', 'selected');
            self.refreshAttribListControl(self.currentEntity.displayAttrib);
        } else {
            self.dialogBox.data = [];
            self.dialogBox.adhocEntityGuid = Math.guid();
            self.dialogBox.isNew = true;
            self.refreshAttribListControl();
        }        

        self.dialogBox.elements.gridFields.jsGrid({
            width: "100%",
            height: "200px",

            inserting: true,
            editing: true,
            sorting: false,
            paging: false,
            deleteConfirm: "Do you really want to delete this field?",
            autoload: true,

            controller: {
                loadData: function(filter) { 
                    return self.dialogBox.data;
                },
                insertItem: function (item) {                    
                    if (!item.attribGuid) item.attribGuid = Math.guid();
                    return item;
                },
                updateItem: function (item) {                    
                    return item;
                },
                deleteItem: function (item) {
                    
                }
            },

            onItemInserted: function (args) {
                self.refreshAttribListControl($("#attribsList", self.dialogBox.formContent).val());
            },

            onItemUpdated: function (args) {
                self.refreshAttribListControl($("#attribsList", self.dialogBox.formContent).val());
            },

            onItemDeleted: function (args) {
                self.refreshAttribListControl($("#attribsList", self.dialogBox.formContent).val());
            },

            fields: [
                { name: "attribGuid", visible: false },
                { name: "name", title: self.getResource("workportal-adhoc-entity-form-attrib-name"), type: "text", width: 150, validate: "required" },
                { name: "displayName", title: self.getResource("workportal-adhoc-entity-form-attrib-display-name"), type: "text", width: 150 },                
                { name: "attribType", title: self.getResource("workportal-adhoc-entity-form-attrib-type"), type: "customselect", width: 150, validate: "required" },
                { name: "size", title: self.getResource("workportal-adhoc-entity-form-attrib-size"), type: "number", width: 70 },
                { name: "required", title: self.getResource("workportal-adhoc-entity-form-attrib-required"), type: "checkbox", width: 60 },
                { type: "control" }
            ]
        });        

        self.dialogBox.formContent.dialog({
            resizable: false,
            draggable: false,
            height: "auto",
            width: "700px",
            modal: true,
            //title: bizagi.localization.getResource("workportal-adhoc-entity-create-popup-title"),
            title: bizagi.localization.getResource("Crear Entidad"),
            maximize: false,
            close: function () {
                self.dialogBox.formContent.dialog("destroy");
                self.dialogBox.formContent.detach();
            }
        });
    },

    closeDialogBox: function () {
        var self = this;
        self.dialogBox.elements.gridFields.jsGrid("destroy");
        self.dialogBox.formContent.dialog("destroy");
        self.dialogBox.formContent.detach();        
    },

    onSaveAdhocEntity: function (event) {
        event.preventDefault();
        var self = this;
        if (self.validateParams()) {
            var paramsNewEntity = {
                id: self.dialogBox.adhocEntityGuid,
                name: self.dialogBox.elements.inputName.val(),
                displayName: self.dialogBox.elements.inputDisplayName.val(),
                description: self.dialogBox.elements.inputDesc.val(),
                displayAttrib: $("#attribsList", self.dialogBox.formContent).val(),
                entityType: self.dialogBox.elements.selectType.val(),
                attributes: self.dialogBox.data
            };
            $.when(self.dataService.saveAdhocEntity(paramsNewEntity)).done(function () {
                self.entityMap[paramsNewEntity.id] = paramsNewEntity;
                if (paramsNewEntity.entityType == 1) // Master
                    self.masterEntityMap[paramsNewEntity.id] = paramsNewEntity;
                else // Parametric
                    self.parametricEntityMap[paramsNewEntity.id] = paramsNewEntity;
                self.closeDialogBox();                
                self.notifier.showSucessMessage(printf(bizagi.localization.getResource("workportal-adhoc-entity-form-save"), ""));
                self.renderEntitiesListPanel(paramsNewEntity.id);
                self.setAttribTypes();
            }).fail(function (error) {
                bizagi.log(error);
            });
        }
    },

    createEntityMap: function (entities) {
        var self = this;       
        $.each(entities, function (i, val) {
            self.entityMap[val.id] = val;
            if (val.entityType == 1) {
                self.masterEntityMap[val.id] = val;
            } else {
                self.parametricEntityMap[val.id] = val;
            }
        });        
    },

    validateParams: function () {
        var self = this;
        var name = self.dialogBox.elements.inputName;
        if (name.val() && name.val() !== "") {
            return true;
        } else {
            var nameValidation = bizagi.localization.getResource("workportal-general-error-field-required");
            nameValidation = nameValidation.replace("{0}", "Name");
            name.next().find("span").html(nameValidation);
            return false;
        }
    },        

    initializeJSGrid: function () {
        var self = this;
        self.buildDateTimeField();
        self.buildMoneyField();
        self.buildFloatField();
        self.buildCustomSelectField();
        self.setAttribTypes();                
    },

    setAttribTypes: function () {
        var self = this;
        $.when(self.getEntities()).done(function (result) {
            self.attribTypes.push({ name: "Bizagi Entities", options: result.bizagiEntities })
            self.attribTypes.push({ name: "Adhoc Entities", options: result.adhocEntities })
        });
    },

    getEntities: function() {
        var self = this;
        var def = new $.Deferred();
        $.when(self.dataService.getAllEntities()).done(function (data) {
            var result = {};
            var bizagiEntities = [];
            var adhocEntities = [];
            $.each(data, function (key, val) {
                if (val.type === "bizagi") {
                    bizagiEntities.push({ value: { id: val.entId, type: 25, relatedEntity: val.entId }, label: val.entName });
                } else {
                    adhocEntities.push({ value: { id: val.entId, type: 36, relatedEntity: val.entId }, label: val.entName });
                }
            });
            result.bizagiEntities = bizagiEntities;
            result.adhocEntities = adhocEntities;
            def.resolve(result);
        });
        return def.promise();
    },

    getEntityValues: function(context, entityId){
        var self = this;
        var def = new $.Deferred();
        $.when(self.dataService.getEntityValues(context, entityId)).done(function (data) {
            var instances = [];            
            $.each(data, function (key, val) {
                instances.push({ value: val.id, label: val.displayValue });
            });
            def.resolve(instances);
        });
        return def.promise();
    },

    buildCustomSelectField: function () {
        var self = this;
        var customSelectField = function (config) {
            jsGrid.Field.call(this, config);
        };

        customSelectField.prototype = new jsGrid.Field({
            itemTemplate: function (value) {
                var id = "";
                if (value) {
                    var id = value.type == 25 || value.type == 36 ? value.relatedEntity : value.type;
                }
                var selectedOption = self.getSelectedAttribType(id);
                return selectedOption ? selectedOption.label : "";
            },

            insertTemplate: function (value, item) {
                var element = $.tmpl(self.getTemplate("admin.adhoc.entity.form.attribtype"), { categories: self.attribTypes, selectedValue: 15 });
                return this._insertCustomSelect = element;
            },

            editTemplate: function (value, item) {
                var selectedValue = value.type == 25 || value.type == 36 ? value.relatedEntity : value.type;
                var element = $.tmpl(self.getTemplate("admin.adhoc.entity.form.attribtype"), { categories: self.attribTypes, selectedValue: selectedValue });
                return this._editCustomSelect = element;
            },

            insertValue: function () {
                var selectedOption = self.getSelectedAttribType(this._insertCustomSelect.find(":selected").data("id"));
                return selectedOption.value;
            },

            editValue: function () {
                var selectedOption = self.getSelectedAttribType(this._editCustomSelect.find(":selected").data("id"));
                return selectedOption.value;
            }
        });

        jsGrid.fields.customselect = customSelectField;
    },

    buildDateTimeField: function () {
        var dateField = function (config) {
            jsGrid.Field.call(this, config);
        };

        dateField.prototype = new jsGrid.Field({
            sorter: function (date1, date2) {
                return new Date(date1) - new Date(date2);
            },

            itemTemplate: function (value) {
                return new Date(value).toDateString();
            },

            insertTemplate: function (value, item) {
                return this._insertPicker = $("<input>").datepicker({ defaultDate: new Date() });
            },

            editTemplate: function (value, item) {
                return this._editPicker = $("<input>").datepicker().datepicker("setDate", new Date(value));
            },

            insertValue: function () {
                return this._insertPicker.datepicker("getDate").toISOString();
            },

            editValue: function () {
                return this._editPicker.datepicker("getDate").toISOString();
            }
        });

        jsGrid.fields.datetime = dateField;
    },

    buildMoneyField: function () {
        var moneyField = function MoneyField(config) {
            jsGrid.NumberField.call(this, config);
        }

        moneyField.prototype = new jsGrid.NumberField({

            itemTemplate: function(value) {
                return "$" + parseFloat(value).toLocaleString();
            },

            filterValue: function() {
                return parseFloat(this.filterControl.val() || 0);
            },

            insertValue: function() {
                return parseFloat(this.insertControl.val() || 0);
            },

            editValue: function() {
                return parseFloat(this.editControl.val() || 0);
            }

        });

        jsGrid.fields.money = moneyField;
    },

    buildFloatField: function () {
        var floatField = function FloatNumberField(config) {
            jsGrid.NumberField.call(this, config);
        }

        floatField.prototype = new jsGrid.NumberField({

            filterValue: function () {
                return parseFloat(this.filterControl.val());
            },

            insertValue: function () {
                return parseFloat(this.insertControl.val());
            },

            editValue: function () {
                return parseFloat(this.editControl.val());
            }
        });

        jsGrid.fields.float = floatField;
    },

    buildEntityField: function (data, entityId, type) {
        var self = this;
        var entityField = function EntityField(config) {
            jsGrid.Field.call(this, config);
        }

        entityField.prototype = new jsGrid.Field({

            itemTemplate: function (value) {
                //if (data && value) {
                if (value) {
                    var selectedInstance = data.filter(function (instance) {
                        return instance.value.key === value.key;
                    })[0];
                    return selectedInstance ? selectedInstance.label : "";
                } else {
                    //return value ? value.value : "";
                    return "";
                }
            },

            insertTemplate: function (value) {
                var element = $("<input>");
                self.initializeAutoComplete(element, data);
                return this._insertAutoComplete = element;
            },

            editTemplate: function (value) {
                var element = $("<input>");
                if (value) {
                    var selectedInstance = data.filter(function (instance) {
                        return instance.value.key === value.key;
                    })[0];                    
                    element.val(selectedInstance ? selectedInstance.label : "");
                }
                self.initializeAutoComplete(element, data);
                return this._editAutoComplete = element;
            },

            insertValue: function () {
                return this._insertAutoComplete.data("entityValue");
            },

            editValue: function () {
                return this._editAutoComplete.data("entityValue");
            }
        });

        jsGrid.fields[type + "entity" + entityId] = entityField;
    },

    initializeAutoComplete: function (element, data) {
        var self = this;
        element.autocomplete({
            minLength: 2,
            source: data,
            select: function (event, ui) {
                var name = ui.item.label;
                element.val(name);
                //self.selectedRowEntityValue = ui.item.value;
                element.data("entityValue", ui.item.value);
                return false;
            },
            focus: function () {
                return false;
            },
            change: function (event, ui) {
                if (ui.item === null) {
                    element.val(event.currentTarget.value);
                    //self.selectedRowEntityValue = null;
                    element.data("entityValue", null);
                }
                return false;
            }
        });
    },

    getSelectedAttribType: function (id){
        var self = this;
        var selectedOption;
        $.each(self.attribTypes, function (i, val) {
            var result = val.options.filter(function (type) {
                return type.value.id === id;
            })[0];
            if (result) {
                selectedOption = result;
                return false;
            };
        });
        return selectedOption;
    },

    refreshAttribListControl: function (displayAttrib) {
        var self = this;
        var selectedAttrib = "";
        var attribSelectWrapper = $("#adhoc-entity-displayattrib-wrapper", self.dialogBox.formContent);
        var attribsSelectTemplate = $.tmpl(self.getTemplate("admin.adhoc.entity.form.displayattrib"), { attribsList: self.dialogBox.data });
        attribSelectWrapper.empty();
        attribSelectWrapper.html(attribsSelectTemplate);
        var element = $("#attribsList option[value=" + displayAttrib + "]", attribSelectWrapper);
        if (displayAttrib && element[0]) {
            element.attr('selected', 'selected');
        } else {
            $("#attribsList option:first", attribSelectWrapper).attr('selected', 'selected');
        }
    }
});
