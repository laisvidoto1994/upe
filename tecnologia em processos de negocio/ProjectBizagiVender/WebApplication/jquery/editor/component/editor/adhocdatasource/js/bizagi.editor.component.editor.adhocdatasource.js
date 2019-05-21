bizagi.editor.component.editor(
    "bizagi.editor.component.editor.adhocdatasource", {
        init: function (canvas, model, controller) {
            this._super(canvas, model, controller);
            var self = this;
            self.controller = controller;
            self.canvas = canvas;
            self.adhocProcessId = model.adhocProcessId;
            self.adhocXpathValue = {};
            self.dialogBox = {};
        },
        renderEditor: function (container, data) {
            var elEditor, self = this, lblRequired;

            // Check readonly
            data.readonly = self.options["editor-parameters"].readonly || false;

            elEditor = $.tmpl(self.getTemplate("frame"), data);            

            elEditor.appendTo(container);

            lblRequired = $('label', elEditor);
            self.addRequired(lblRequired);

            self.adhocXpathInput = $(".adhoc-xpath-value", elEditor);

            self.showPredefinedValuesControl = data.showPredefinedValuesControl;
            self.showAdhocEntitiesControl = data.showAdhocEntitiesControl;

            $.when(self.getDataSources()).done(function (result) {
                self.bizagiEntitiesValues = result.bizagiEntities;
                self.adhocEntitiesValues = result.adhocEntities;
                if (data.value && data.value != null) {
                    if (data.value.guid) {
                        var currentValue = self.bizagiEntitiesValues.filter(function (entity) {
                            return entity.value === data.value.guid;
                        })[0];
                        if (currentValue == null) {
                            currentValue = self.adhocEntitiesValues.filter(function (entity) {
                                return entity.value === data.value.guid;
                            })[0];
                        }
                        if (currentValue == null) { //Predefined values in memory
                            if (!data.value.values) {
                                $.when(self.getPredefinedValues(data.adhocProcessId, data.value.property)).done(function (result) {
                                    data.value.values = result
                                    self.adhocXpathValue = data.value;                                    
                                });
                            } else {
                                self.adhocXpathValue = data.value;
                            }
                            self.adhocXpathInput.val("Predefined");
                        } else {
                            self.adhocXpathValue = currentValue;
                            self.adhocXpathInput.val(currentValue.label);
                        }
                    } else {                        
                        self.adhocXpathValue = data.value;
                        self.adhocXpathInput.val("Predefined");
                    }                    
                }
            });
            
        },
        loadTemplates: function () {
            var self = this,
            deferred = new $.Deferred();
            $.when(
                self.loadTemplate("frame", bizagi.getTemplate("bizagi.editor.component.editor.adhocdatasource").concat("#adhocdatasource-frame")),
                self.loadTemplate("close-popup", bizagi.getTemplate("bizagi.editor.component.editor.adhocdatasource").concat("#adhocdatasource-popup-close")),
                self.loadTemplate("popup-container", bizagi.getTemplate("bizagi.editor.component.editor.adhocdatasource").concat("#adhocdatasource-popup-container")),
                self.loadTemplate("predefined-values-popup", bizagi.getTemplate("bizagi.editor.component.editor.adhocdatasource").concat("#adhocdatasource-predefined-values-popup"))
            ).done(function () {
                deferred.resolve();
            });
            return deferred.promise();
        },
        initializeAutoComplete: function (element, data) {
            var self = this;                        
            element.autocomplete({
                minLength: 2,
                source: data,
                select: function (event, ui) {
                    var name = ui.item.label;
                    element.val(name);
                    var newValue = { guid: ui.item.value, type: "bizagi", values: null };
                    if (element[0].id == "adhoc-entity-input") {
                        newValue.type = "adhoc";                        
                    }

                    var options = {
                        typeEvent: bizagi.editor.component.properties.events.PROPERTIES_CHANGE_PROPERTY,
                        oldValue: self.adhocXpathValue,
                        newValue: newValue,
                        type: self.options.name,
                        refreshProperties: true,
                        removeDefaultDisplayName: true,
                        id: self.element.closest(".bizagi_editor_component_properties").data("id")
                    }
                    self.controller.publish("propertyEditorChanged", options);
                    self.adhocXpathInput.val(element.val());
                    self.adhocXpathValue = newValue;
                    self.closePopup();
                    return false;
                },
                focus: function () {
                    return false;
                },
                change: function (event, ui) {
                    if (ui.item === null) {
                        element.val(event.currentTarget.value);
                        var options = {
                            typeEvent: bizagi.editor.component.properties.events.PROPERTIES_CHANGE_PROPERTY,
                            oldValue: self.adhocXpathValue,
                            newValue: null,
                            type: self.options.name,                            
                            id: self.element.closest(".bizagi_editor_component_properties").data("id")
                        }
                        self.controller.publish("propertyEditorChanged", options);
                        self.adhocXpathInput.val(element.val());
                        self.adhocXpathValue = null;
                        self.closePopup();
                    }
                    return false;
                }
            });                            
        },
        getDataSource: function () {
            var self = this;
            var def = new $.Deferred();
            var getDataSchema = bizagi.editor.communicationprotocol.factory.createProtocol({ protocol: "getadhocdataschema", adhocProcessId: self.adhocProcessId });

            $.when(getDataSchema.processRequest()).done(function (data) {                
                var values = [];
                if (data.properties) {
                    $.each(data.properties, function (key, val) {
                        values.push({ label: val.name, value: val.name });
                    });
                }
                def.resolve(values);
            });

            return def.promise();
        },                     
        createXpathNavigatorCanvas: function () {
            var self = this;
            var overlay = self.overlay = $("<div />").addClass("bizagi_editor_xpathnavigator_overlay");            

            var xpathNavigatorElement = self.xpathNavigatorElement = $("<div />").addClass('bizagi_editor_component_xpathnavigator biz-work-panel biz-border-all biz-shadow-modal biz-border-color ui-corner-all');
            var closePopupButton = $.tmpl(this.getTemplate("close-popup"));
            $(".bizagi_editor_xpathnavigator_container-close-image", closePopupButton).on("click", function () {            
                self.closePopup();          
            }); 
            closePopupButton.appendTo(self.xpathNavigatorElement);

            // Arrange elements
            overlay.appendTo("form-modeler");
            xpathNavigatorElement.appendTo(overlay);

            // Prepare autoclose when clicking outside
            setTimeout(function () {
                // Capture all click elements inside the popup
                xpathNavigatorElement.click(function (e) {
                    e.stopPropagation();
                });

                // Make an overlay click, if the event bubbles up to here then the click was made outside popup boundaries
                $(overlay).one("click", function () {
                    self.closePopup();
                });
            }, 100);
        },
        calculateFloatingPosition: function (position) {
            var self = this;
            var overlayHeight = self.overlay.height();
            var canvasHeight = self.canvas.height();
            if (position.top + canvasHeight > overlayHeight) {
                position.top -= canvasHeight;
            }
            return position;
        },
        getDialogPosition: function (datasourceElement) {
            var offset = datasourceElement.offset();
            return {
                top: offset.top + datasourceElement.outerHeight(true),
                left: offset.left
            };
        },
        closePopup: function () {
            var self = this;
            self.xpathNavigatorElement.hide();
            self.controller.publish("close");
            if (self.adhocEntityInput) self.adhocEntityInput.autocomplete("destroy");
            if (self.bizagiEntityInput) self.bizagiEntityInput.autocomplete("destroy");
            setTimeout(function () {                
                self.overlay.detach();
            }, 200);          
        },
        getDataSources: function () {
            var self = this;
            var def = new $.Deferred();
            var getDataSources = bizagi.editor.communicationprotocol.factory.createProtocol({ protocol: "getadhocdatasources", adhocProcessId: self.adhocProcessId });

            $.when(getDataSources.processRequest()).done(function (data) {
                var result = {};
                var bizagiEntities = [];
                var adhocEntities = [];
                $.each(data, function (key, val) {
                    if (val.type === "bizagi") {
                        bizagiEntities.push({ label: val.entName, value: val.entId });
                    } else {
                        adhocEntities.push({ label: val.entName, value: val.entId });                        
                    }
                });
                result.bizagiEntities = bizagiEntities;
                result.adhocEntities = adhocEntities;               
                def.resolve(result);
            });

            return def.promise();
        },
        getPredefinedValues: function (processId, property) {
            var self = this;
            var def = new $.Deferred();
            var getPredefinedValues = bizagi.editor.communicationprotocol.factory.createProtocol({ protocol: "getpredefinedvalues", adhocProcessId: processId, property: property });

            $.when(getPredefinedValues.processRequest()).done(function (data) {                
                def.resolve(data);
            });

            return def.promise();
        },

        /*** Element Handlers ****/
        ".xpath-image-world click": function (el, event) {
            var self = this;
            //var xpathElement = self.xpathElement = self.element.find(".xpath-value");
            //var position = self.getDialogPosition(xpathElement);                       
            var position = self.getDialogPosition(self.adhocXpathInput);
            
            self.createXpathNavigatorCanvas();
     
            self.xpathNavigatorElement.css(self.calculateFloatingPosition(position));
            self.xpathNavigatorElement.show();
            self.xpathNavigatorElement.resizable({
                helper: "ui-resizable-helper",
                //minHeight: 200,
                minWidth: 250,
                start: function (event, ui) {
                    $(".ui-resizable-helper").css({ 'z-index': 1001 });
                },
                stop: function (event, ui) {
                }
            });

            var hasBizagiEntities = self.bizagiEntitiesValues.length > 0;
            var hasAdhocEntities = self.adhocEntitiesValues.length > 0;

            var elContainer = $.tmpl(self.getTemplate("popup-container"), {
                hasBizagiEntities: hasBizagiEntities,
                hasAdhocEntities: hasAdhocEntities,
                showPredefinedValuesControl: self.showPredefinedValuesControl,
                showAdhocEntitiesControl: self.showAdhocEntitiesControl
            });
            self.xpathNavigatorElement.append(elContainer);

            if (hasBizagiEntities) {
                self.bizagiEntityInput = $("#bizagi-entity-input", elContainer);
                var value = self.bizagiEntitiesValues.filter(function (entity) {
                    return entity.label === self.adhocXpathInput.val();
                })[0];
                self.bizagiEntityInput.val(value ? value.label : "");
                self.bizagiEntityInput.mousedown(function (event) {
                    $(event.target).focus();
                });
                self.initializeAutoComplete(self.bizagiEntityInput, self.bizagiEntitiesValues);
            }

            if (hasAdhocEntities) {
                self.adhocEntityInput = $("#adhoc-entity-input", elContainer);
                var value = self.adhocEntitiesValues.filter(function (entity) {
                    return entity.label === self.adhocXpathInput.val();
                })[0];
                self.adhocEntityInput.val(value ? value.label : "");
                self.adhocEntityInput.mousedown(function (event) {
                    $(event.target).focus();
                });
                self.initializeAutoComplete(self.adhocEntityInput, self.adhocEntitiesValues);
            }

            $("#predefinedValuesLink", elContainer).click(function () {
                self.showPredefinedValuesPopup();
            });
        },

        showPredefinedValuesPopup: function () {
            var self = this, template = self.getTemplate("predefined-values-popup");
            //self.dialogBox.data = [];
            self.dialogBox.formContent = $.tmpl(template);
            self.dialogBox.elements = {
                gridFields: $("#predefinedValuesGrid", self.dialogBox.formContent),
                buttonSave: $("#button-accept-predefined-values-form", self.dialogBox.formContent),
                buttonCancel: $("#button-cancel-predefined-values-form", self.dialogBox.formContent)
            };
            self.dialogBox.elements.buttonSave.on("click", $.proxy(self.onSavePredefinedValues, self));
            self.dialogBox.elements.buttonCancel.on("click", $.proxy(self.closeDialogBox, self));

            if (self.adhocXpathValue.values) {
                self.dialogBox.data = JSON.parse(self.adhocXpathValue.values);
            } else {
                self.dialogBox.data = [];
            }

            self.dialogBox.elements.gridFields.jsGrid({
                width: "100%",
                height: "200px",
                inserting: true,
                editing: true,
                sorting: false,
                paging: false,
                deleteConfirm: "Do you really want to delete this value?",
                autoload: true,

                controller: {
                    loadData: function (filter) {
                        return self.dialogBox.data;
                    },
                    insertItem: function (item) {                        
                        if (!item.key) item.key = Math.guid();
                        return item;
                    },
                    updateItem: function (item) {
                        return item;
                    }
                },
                fields: [                    
                    { name: "key", visible: false },
                    { name: "value", title: "value", type: "text", width: 200, validate: "required" },
                    { type: "control" }
                ]
            });

            self.dialogBox.formContent.dialog({
                resizable: false,
                draggable: false,
                height: "auto",
                width: "500px",
                modal: true,                
                title: bizagi.localization.getResource("Predefined Values"),
                maximize: false,
                close: function () {
                    self.dialogBox.formContent.dialog("destroy");
                    self.dialogBox.formContent.detach();
                }
            });
        },

        onSavePredefinedValues: function (event) {
            event.preventDefault();
            var self = this;            
            //var newValue = { guid: null, type: "predefined", values: JSON.stringify(self.dialogBox.data) };
            var newValue = {
                guid: self.adhocXpathValue.values ? self.adhocXpathValue.guid : Math.guid(),
                processguid: self.adhocProcessId,
                type: "predefined",
                values: JSON.stringify(self.dialogBox.data)
            };
            var options = {
                typeEvent: bizagi.editor.component.properties.events.PROPERTIES_CHANGE_PROPERTY,
                oldValue: self.adhocXpathValue,
                newValue: newValue,
                type: self.options.name,
                refreshProperties: true,
                removeDefaultDisplayName: true,
                id: self.element.closest(".bizagi_editor_component_properties").data("id")
            }
            self.controller.publish("propertyEditorChanged", options);
            self.adhocXpathInput.val("Predefined");
            self.adhocXpathValue = newValue;            
            self.closeDialogBox();
            self.closePopup();
        },

        closeDialogBox: function () {
            var self = this;
            self.dialogBox.elements.gridFields.jsGrid("destroy");
            self.dialogBox.formContent.dialog("destroy");
            self.dialogBox.formContent.detach();
        }
    }
);