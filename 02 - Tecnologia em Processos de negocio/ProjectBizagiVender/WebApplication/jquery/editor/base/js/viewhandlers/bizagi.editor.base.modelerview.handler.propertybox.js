/*
*   Name: BizAgi Form Modeler View Property Box Handler
*   Author: Alexander Mejia, Diego Parra (refactor)
*   Comments:
*   -   This script will handler modeler view property box handlers
*/
bizagi.editor.modelerView.extend("bizagi.editor.modelerView", {
    map: {
        "columnsearchlist" : "searchlist"
    }
}, {
    /*
    *   Draw the property box in the layout
    */
    drawPropertyBox: function (params) {
        var self = this;

        // Hide property box if there is another instance already
        if (self.propertyBox) self.hidePropertyBox();

        self.redrawPropertyBox = (params.redraw) ? params.redraw : false;

        self.propertyBox = new bizagi.editor.component.properties.presenter();
        self.propertyBox.subscribe("propertyChanged", function (event, args) { return self.onPropertiesChanged(args); });
        self.propertyBox.subscribe("getRenderElement", function (event, args) { return self.onGetRenderElement(args); });

        self.propertyBox.subscribe("destroy", function (event, args) { self.hidePropertyBox(args); });

        // For editor validations
        self.editorValidations = {};

        self.guid = params.guid || self.currentSelectedElement;
        self.formProperties = (params && params.formProperties) ? true : false;

        self.refreshPropertyBox();

    },

    /*
    *  refresh property box component
    */
    refreshPropertyBox: function () {
        var self = this;
        var model;

        if (!self.validElement()) {
            return;
        }

        // Fetch a new model
        if (self.formProperties) { model = self.executeCommand({ command: "getFormPropertiesModel", showValidations: self.validateForm }); }
        else if (self.guid) {
            if (self.controller.thereAreMultiselection()) {
                model = self.executeCommand({ command: "getMultiselectionProperties", showValidations: self.validateForm });
            }
            else {
                self.executeCommand({ command: "applyOverridesElement", guid: self.guid, overrides: { requiredProperties: true} });
                model = self.executeCommand({ command: "getPropertiesModel", guid: self.guid, showValidations: self.validateForm });
            }
        }
        else {
            if (self.propertyBox && self.propertyBox.propertyBox && self.propertyBox.propertyBox.element) {
                self.propertyBox.propertyBox.element.hide();
            }
            return;
        }

        // Render the component
        self.propertyBox.render({
            model: model,
            position: { left: 10, top: 135 },
            redraw: self.redrawPropertyBox
        });
    },

    /*
    *  Valid the current element
    */
    validElement: function () {
        var self = this;

        if (!self.propertyBox)
            return false;

        if (self.formProperties)
            return true;

        // Multiselection
	if ($.isArray(self.guid))
            return true;

        var elementProperties = self.executeCommand({ command: "getElementProperties", guid: self.guid });
        if (!elementProperties)
            return false;

        return true;
    },

    /*
    *   Executes when a property has been changed in the property box, 
    *   automatically calls a handler in this class for each action type, 
    *   ex. if the typeEvent is "ChangeProperty", then execute the method "performPropertyChange"
    */
    onPropertiesChanged: function (args) {
        var self = this;

        if (typeof self["perform" + args.typeEvent] === "function") {
            return self["perform" + args.typeEvent](args);
        }
    },

    /*
    *   Hide property box
    */
    hidePropertyBox: function () {
        var self = this;
        if (self.propertyBox) self.propertyBox.destroy();
        self.propertyBox = null;
    },


    /*
    *   Shows the xpath editor in the properties box
    */
    showXpathEditor: function (params) {
        var self = this;
        var properties = self.executeCommand({ command: "getElementProperties", guid: params.guid });

        if (typeof properties["xpath"] === "object") { self.changeXpathNavigatorView(properties.xpath); }

        var xpathEditorModel = params.model || self.controller.getXpathNavigatorModel({ context: params.context });
        // Fetch model (we can use a given model, else we need to fetch the main xpath model)
        $.when(xpathEditorModel)
        .done(function (model) {
            $.extend(model, { context: self.controller.getContext() });
            var presenter = new bizagi.editor.component.xpathnavigator.presenter({ model: model });
            var xpath = bizagi.editor.utilities.resolveProperty(properties, params.property);

            // fix for xpath-from-entity
            if (/^.*:+.*$/.test(xpath)) {
                xpath = undefined;
            }

            // Define handlers
            presenter.subscribe("nodeDoubleClick", function (_, xpathData) {
                self.changeXpathPropertyForElement(params.guid, params.property, xpathData);
                // Close control
                presenter.closePopup();
            });

            // Show xpath navigator and locate xpath
            presenter.renderPopup({
                position: params.position,
                xpath: xpath,
                filter: params.filter
            });
        });
    },

    /*
    *   Shows the multi xpath editor in the properties box
    */
    showMultiXpathEditor: function (params) {
        var self = this;
        var properties = self.executeCommand({ command: "getElementProperties", guid: params.guid });

        var xpathEditorModel = params.model || self.controller.getXpathNavigatorModel({ context: params.context });
        // Fetch model (we can use a given model, else we need to fetch the main xpath model)
        $.when(xpathEditorModel)
        .done(function (model) {
            $.extend(model, { context: self.controller.getContext() });
            var presenter = new bizagi.editor.component.xpathnavigator.presenter({ model: model });
            var xpath = bizagi.editor.utilities.resolveProperty(properties, params.property);

            // fix for xpath-from-entity
            if (/^.*:+.*$/.test(xpath)) {
                xpath = undefined;
            }

            // Define handlers
            presenter.subscribe("nodeDoubleClick", function (_, xpathData) {
                self.changeXpathMultiplePropertyForElement(params.guid, params.property, xpathData);
                // Close control
                presenter.closePopup();
            });

            // Show xpath navigator and locate xpath
            presenter.renderPopup({
                position: params.position,
                filter: params.filter,
                allowCollection: params.filter.allowCollections == undefined ? true : bizagi.util.parseBoolean(params.filter.allowCollections)
            });
        });
    },
    
    /*
    *   Executes a change xpath command in the model
    */
    changeXpathPropertyForElement: function (id, property, xpathData) {
        var self = this;

        // Exists in map
        if (self.editorValidations[id] !== undefined) {
            var valid = self.validateXpathChange(id, property, xpathData);
            if (!valid) return;
        }
        // Perform property change            
        var command = {
            command: "changeProperty",
            guid: id,
            property: property,
            value: bizagi.editor.utilities.buildComplexXpath(xpathData.xpath, xpathData.contextScope, xpathData.isScopeAttribute, xpathData.guidRelatedEntity),
            refreshProperties: true,
            removeDefaultDisplayName: true,
            renderTypeProperty: xpathData.nodeSubtype,
            validateForm: self.validateForm
        };

        // Add exclusive "validation" to the command ???
        if (self.editorValidations[id] && self.editorValidations[id].exclusive !== undefined) {
            command = $.extend({}, command, { exclusive: self.editorValidations[id].exclusive });
        }

        // Executes the command
        self.executeCommand(command);
    },

    /*
    *   Executes a change xpathmultiple command in the model
    */
    changeXpathMultiplePropertyForElement: function (id, property, xpathData) {
        var self = this;

        // Exists in map
        if (self.editorValidations[id] !== undefined) {
            var valid = self.validateXpathMultipleChange(id, property, xpathData);
            if (!valid) return;
        }

        var currentValue = self.executeCommand({ command: "getElementProperty", guid: id, property: property }) || [];
        var newValue = bizagi.editor.utilities.buildComplexXpath(xpathData.xpath, xpathData.contextScope, xpathData.isScopeAttribute, xpathData.guidRelatedEntity);

        //validate if new xpath exists in array
        var arrayHasNewValue = ($.grep(currentValue, function (e) { return newValue.xpath.baxpath.xpath == e.xpath.baxpath.xpath; })).length != 0 ? true : false;
        if (!arrayHasNewValue) {
            currentValue.push(newValue);
        } else {
            return;
        }

        // Perform property change            
        var command = {
            command: "changeProperty",
            guid: id,
            property: property,
            value: currentValue,
            refreshProperties: true,
            removeDefaultDisplayName: true,
            renderTypeProperty: xpathData.nodeSubtype,
            validateForm: self.validateForm
        };

        // Executes the command
        self.executeCommand(command);
    },
 
    /*************************************************************************************************** 
    *   EVENT TYPE HANDLERS
    *****************************************************************************************************/

    /*
    *   Perform change Property event
    */
    performPropertyChange: function (args, bRefreshProperties) {
        var self = this;

        var guids = [args.id];

        var refreshProperties = bRefreshProperties || args.refreshProperties;

        if (bizagi.editor.utilities.isGuidEmpty(args.id)) { guids = self.controller.getGuidsSelected(); }
        // Execute change property command
        self.executeCommand({ command: "changeProperty", guids: guids, property: args.type, value: args.newValue, exclusive: args.exclusive, refreshProperties: refreshProperties, validateForm: self.validateForm });


    },

    /*
    *   Perform change Layout event
    */
    performPropertyChangeLayout: function (args) {
        var self = this;

        self.executeCommand({ command: "changeLayout", guid: args.id, values: args.values });
    },

    /*
    *   Show rule selector
    */
    performShowRuleSelector: function (args) {
        var self = this;

        var rule = args.data;
        if (rule && self.isRule90(rule)) {
            var ruleDisplayNameProtocol = bizagi.editor.communicationprotocol.factory.createProtocol({ protocol: "getruledisplayname", rule: rule["rule90"] });
            $.when(ruleDisplayNameProtocol.processRequest())
            .done(function (data) {
                var message = bizagi.localization.getResource("formmodeler-message-rule90").replace("{0}", data.displayName);
                bizagi.showMessageBox(message);
                return;
            });
        }

        // Check if is necesary take a context 
        var properties = self.executeCommand({ command: "getElementProperties", guid: args.id, getContext: args.context });
        if (properties && properties.context) { var idcontextentity = properties.context; };

        var ruleExpresionProtocol = bizagi.editor.communicationprotocol.factory.createProtocol($.extend(args, { protocol: "ruleexpression", idcontextentity: idcontextentity }));

        // Execute select rule expression in BAS
        $.when(ruleExpresionProtocol.processRequest())
        .done(function (result) {
            if (result) {

                args.newValue = (result.isEmpty) ? undefined : result;
                self.performPropertyChange(args, true);
            }
        });
    },

    /*
    *   Perform show localization event
    */
    performShowLocalization: function (args) {
        var self = this;

        var property = self.executeCommand({ command: "getElementProperty", guid: args.id, property: args.type });

        if (typeof property != "object") {
            if (typeof property == "string") {
                property = bizagi.editor.utilities.buildComplexLocalizable(property, args.id, args.type);
            } else {
                property = bizagi.editor.utilities.buildComplexLocalizable("", args.id, args.type);
            }
        }
        //delete html tags to send this information to .net popup
        var helpTextBeforeTheChange = property.i18n["default"];
        property.i18n["default"] = $("<div/>").html(property.i18n["default"]).text();

        var multilenguageProtocol = bizagi.editor.communicationprotocol.factory.createProtocol({ protocol: "multilanguage", i18n: property });

        // Show localization form in BAS
        $.when(multilenguageProtocol.processRequest())
        .done(function (result) {
               //restart value help text
               property.i18n["default"] = helpTextBeforeTheChange;

               if (result) {
                result.i18n["default"] = helpTextBeforeTheChange;

                args.newValue = result;
                self.performPropertyChange(args, true);
            }
        });
    },

    /*
    *   Perform change multiple properties event
    */
    performChangeMultipleProperties: function (args) {
        var self = this;

        var guids = [args.id];

        if (bizagi.editor.utilities.isGuidEmpty(args.id)) { guids = self.controller.getGuidsSelected(); }

        self.executeCommand({ command: "changeMultipleProperties", properties: args.properties, guids: guids });
    },

    /*
    *   Show filter editor in BAS
    */
    performShowFilterEditor: function (args) {
        var self = this;


        if (args.type === "data.filter") {

            args.xpathNode = self.executeCommand({ command: "getXpathDataForElement", guid: args.id });
            var properties = self.executeCommand({ command: "getElementProperties", guid: args.id });

            // Call external component
            var filterProtocol = bizagi.editor.communicationprotocol.factory.createProtocol($.extend(args, { protocol: "loadfilter", idcontextentity: properties.context }));
            $.when(filterProtocol.processRequest())
                .done(function (result) {
                    if (result) {
                        args.newValue = (result.isEmpty) ? undefined : bizagi.editor.utilities.buildComplexFilter(result, args.xpathNode);
                        self.performPropertyChange(args, true);
                    }
                });

        }
    },

    /*
    *   Perform Show Rule Editor for default value
    */
    performShowRuleEditorForDefaultValue: function (args) {
        // TODO: Implement here
    },

    /*
    *   Shows xpath editor
    */
    performShowXPathEditor: function (args) {
        this.showXpathEditor({ guid: args.id, property: args.type, position: args.position });
    },

    /*
    *   Shows interface editor
    */
    performShowInterfaceEditor: function (args) {
        var self = this;
        var interfaceProtocol = bizagi.editor.communicationprotocol.factory.createProtocol($.extend(args, { protocol: "loadinterface" }));

        // Execute interface editor in BAS
        $.when(interfaceProtocol.processRequest())
        .done(function (result) {
            if (result) {
                args.newValue = result;
                self.performPropertyChange(args, true);
            }
        });
    },

    /*
    *   Show xpath editor from current xpath
    */
    performSelectXpathFromEntity: function (args) {
        var self = this;
        var options = {
            typeEditor: args.typeEditor,
            editorParameters: args.editorParameters
        };

        // Add validation
        if (args.editorParameters.types !== undefined) {
            self.editorValidations[args.id] = options;
        }

        $.when(self.executeCommand({ command: "getXpathEditorModel", guid: args.id, editorParameters: args.editorParameters }))
            .done(function (xpathModel) {
                $.when(xpathModel)
                    .done(function (model) {
                        var optionsXpath = {
                            guid: args.id,
                            property: args.type,
                            position: args.position,
                            model: model

                        };

                        if (args.editorParameters.types !== undefined) {
                            if ($.isArray(args.editorParameters.types)) {
                                $.extend(optionsXpath, {
                                    filter: {
                                        typeFilter: args.typeEditor,
                                        types: args.editorParameters.types
                                    }
                                });
                            }
                        }
                        self.showXpathEditor(optionsXpath);
                    });
            });

    },

    /*
    *   Show a xpath selector, and validate that a simple xpath has been chosen
    */
    performSelectXpathToSimple: function (args) {
        var self = this;
        var options = { typeEditor: args.typeEditor, editorParameters: args.editorParameters };

        if (args.exclusive !== undefined) {
            options = $.extend({}, options, { exclusive: args.exclusive });
        }

        // Add validation
        self.editorValidations[args.id] = options;

        // Show xpath editor
        this.showXpathEditor({
            guid: args.id,
            property: args.type,
            position: args.position,
            context: args.context,
            filter: {
                typeFilter: args.typeEditor,
                types: args.editorParameters.types
            }
        });
    },

    /*
    *   Show a xpath selector and validate that a xpath with related entity has been chosen
    */
    performSelectXpathToEntity: function (args) {
        var self = this;
        var properties = self.executeCommand({ command: "getElementProperties", guid: args.id });

        if (properties.type == "nestedform") {
            var title = bizagi.localization.getResource("formmodeler-component-editor-validation-xpath-title");
            var message = bizagi.localization.getResource("formmodeler-component-editor-validation-xpath-message");
            bizagi.showMessageBox(message, title, "warning", false);

        } else {
            // Add validation
            self.editorValidations[args.id] = { typeEditor: args.typeEditor };

            // Show xpath editor
            //self.showXpathEditor({ guid: args.id, property: args.type, position: args.position });
            self.showXpathEditor({
                guid: args.id,
                property: args.type,
                position: args.position,
                context: args.context,
                filter: {
                    typeFilter: args.typeEditor
                }
            });
        }
    },

    /*
    *   Show a xpath selector and validate that a collection has been chosen
    */
    performSelectXpathToCollection: function (args) {
        var self = this;

        // Add validation
        self.editorValidations[args.id] = { typeEditor: args.typeEditor };

        // Show xpath editor
        self.showXpathEditor({
            guid: args.id,
            property: args.type,
            position: args.position,
            context: args.context,
            filter: {
                typeFilter: args.typeEditor
            }
        });
    },

    /*
    *   Show a multi xpath selector, and validate that those xpath's has been chosen
    */
    performSelectMultiXpath: function (args) {
        var self = this;
        var options = { typeEditor: args.typeEditor, editorParameters: args.editorParameters };

        if (args.exclusive !== undefined) {
            options = $.extend({}, options, { exclusive: args.exclusive });
        }

        // Add validation
        self.editorValidations[args.id] = options;

        // Show xpath editor
        this.showMultiXpathEditor({
            guid: args.id,
            property: args.type,
            position: args.position,
            context: args.context,
            filter: {
                typeFilter: args.typeEditor,
                types: args.editorParameters.types,
                allowCollections: args.editorParameters.allowCollections
            }
        });
    },

    /*
    *   Show a multi xpath selector, and validate that those xpath's has been chosen
    */
    performSelectXpath: function (args) {
        var self = this;
                
        // Show xpath editor
        self.showXpathEditor({
            guid: args.id,
            property: args.type,
            position: args.position,
            context: args.context
            //filter: {
            //    typeFilter: args.typeEditor
            //}
        });
    },
    
    /*
    *   Show gid validations editor
    */
    performShowGridValidationsEditor: function (args) {
        var self = this;
        var gridProperties = self.executeCommand({ command: "getElementProperties", guid: args.id });

        if (typeof gridProperties.xpath === "object") {

            var loadGridValidationsProtocol = bizagi.editor.communicationprotocol.factory.createProtocol({
                protocol: "gridvalidations",
                guidRender: args.id,
                xpath: bizagi.editor.utilities.resolveComplexXpath(gridProperties.xpath),
                gridValidations: gridProperties.gridvalidations
            });

            // Show editor in BAS
            $.when(loadGridValidationsProtocol.processRequest())
            .done(function (validations) {
                if (validations) {
                    args.newValue = validations;
                    self.performPropertyChange(args, true);
                }
            });
        }
    },

    /*
    *   Selects a process
    */
    performSelectProcess: function (args) {
        var self = this;

        var SelectProcessProtocol = bizagi.editor.communicationprotocol.factory.createProtocol({
            protocol: "selectprocess",
            guidRender: args.id
        });

        // Show editor in BAS
        $.when(SelectProcessProtocol.processRequest())
            .done(function (validations) {
                if (validations) {
                    args.newValue = validations;
                    self.performPropertyChange(args, true);
                }
            });
    },

    /*
    *   Selects a form in the selector
    */
    performSelectFormOption: function (args) {
        var self = this,
            searchForm = [];

        var value = bizagi.editor.utilities.buildComplexReference(args.form);
        args.newValue = value;

        if (args.context && args.context === "searchform") {
            searchForm.push(value);
            args.newValue = searchForm;
        }

        self.performPropertyChange($.extend(args, { type: args.propertyName }), true);

        if (args.showForm) {
            self.executeCommand({ command: "updateModel", data: { actiontype: "ShowForm", guidrender: args.id, form: args.form} });
        }
    },

    /*
    *   Opens the current form in BAS
    */
    performSelectFormButton: function (args) {

        // if value is an array(serchForm) we taken the first element 
        if ($.isArray(args.value)) args.value = args.value[0];

        if (typeof args.value === "object") {
            var id = bizagi.editor.utilities.resolveComplexReference(args.value);
            if (id.length > 0) {
                // Prepare protocol and execute it
                var openFormProtocol = bizagi.editor.communicationprotocol.factory.createProtocol($.extend(args, { protocol: "openform", idform: id }));
                openFormProtocol.processRequest();
            }
        }
    },

    /*
     * Shows the wizard for create an new template
     */
    performShowWizardTemplates: function (args) {
        var self = this;
        var properties = self.executeCommand({ command: "getElementProperties", guid: args.id, canUndo: false });
        var model = self.controller.getModel();

        if (properties.xpath && typeof bizagi.editor.utilities.isObject(properties.xpath)) {
            var xpath = bizagi.editor.utilities.resolveComplexXpath(properties.xpath);
            var relatedEntity = bizagi.editor.utilities.resolveRelatedEntityFromXpath(properties.xpath);
            var model = self.controller.getModel();

            var showWizardTemplates = bizagi.editor.communicationprotocol.factory.createProtocol({
                protocol: "showwizardtemplates",
                xpath: xpath,
                relatedEntity: relatedEntity,
                guidControl: args.id,
                propertyName: args.propertyName,
                isScopeAttribute: model.publish("getNodeInfo", {
                    xpath: xpath,
                    callback: function (node) {
                        return node.isScopeAttribute;
                    }
                })
            });

            // Execute protocol
            $.when(showWizardTemplates.processRequest())
                .done(function () {
                    // Delete templates cache
                    delete bizagi.editor.component.properties.commands.selecttemplate.templatesPromise[relatedEntity];
                })
        }
    },

    /*
    *   Shows an editor for new form in BAS
    */
    performSelectFormNew: function (args) {
        var self = this;
        var properties = self.executeCommand({ command: "getElementProperties", guid: args.id, canUndo: false });
        var xpathIsRequired = self.executeCommand({ command: "propertyIsRequired", guid: args.id, property: "xpath" });
        var model = self.controller.getModel();        

        if ((properties.xpath && typeof properties.xpath === "object") || !xpathIsRequired) {

            var xpath = bizagi.editor.utilities.resolveComplexXpath(properties.xpath);
            var relatedEntity = bizagi.editor.utilities.resolveRelatedEntityFromXpath(properties.xpath);

            var createFormProtocol = bizagi.editor.communicationprotocol.factory.createProtocol({
                protocol: "createform",
                xpath: self.controller.getContextXpath({ xpath: xpath }),
                guid: args.id,
                propertyName: args.propertyName,
                context: args.context,
                relatedEntity: relatedEntity,
                isScopeAttribute: model.publish("getNodeInfo", { xpath: xpath, callback: function (node) { return node.isScopeAttribute; } }),
                showForm: args.showForm
            });

            // Execute protocol
            createFormProtocol.processRequest();
                
        }
    },

    /*
    *   Removes a form from the current property
    */
    performSelectFormNone: function (args) {
        var self = this;

        args.newValue = undefined;
        self.performPropertyChange($.extend(args, { type: args.propertyName }), true);
    },

    performSelectTemplateNone: function (args) {
        var self = this;

        args.newValue = undefined;
        self.performPropertyChange($.extend(args, { type: args.propertyName }), true);
    },

    performSelectTemplateDefault: function (args) {
        var self = this;

        args.newValue = args.value;
        self.performPropertyChange($.extend(args, { type: args.propertyName }), true);
    },

    performShowDocumentTemplatesEditor: function (args) {
        var self = this;

        var renderProperties = self.executeCommand({ command: "getElementProperties", guid: args.id });


        if (renderProperties.xpath && typeof renderProperties.xpath === "object") {
            var createFormProtocol = bizagi.editor.communicationprotocol.factory.createProtocol({
                protocol: "documenttemplates",
                groupmapping: renderProperties.groupmapping,
                append: renderProperties.append,
                xpath: bizagi.editor.utilities.resolveComplexXpath(renderProperties.xpath),
                idContextEntity: renderProperties.context
            });
            $.when(createFormProtocol.processRequest()).
                done(function (data) {
                    if (data) {
                        self.performPropertyChange({
                            id: args.id,
                            type: "groupmapping",
                            newValue: bizagi.editor.utilities.buildComplexReference(data)
                        });
                    }
                });
        }

    },

    /*
    * This method shows the wizard configuration for association control
    */
    performShowAssociationEditor: function (args) {
        var self = this;
        var renderProperties = self.executeCommand({ command: "getElementProperties", guid: args.id });

        var control = renderProperties.type;

        $.when(self.showControlWizard({ model: renderProperties, control:self.Class.map[control] || control }))
            .done(function (data) {
                if (data.success) {
                    self.executeCommand({ command: "updateAssociationModel", model: data.model, guid: args.id, control: control });
                }
                self.refreshPropertyBox();
            });
    },

    /*
    * This method loads the medatada required by the property
    */
    performLoadMetadata: function (args) {
        var self = this;

        var properties = self.executeCommand({ command: "getElementProperties", guid: args.id });

        var getMetadataProtocol = bizagi.editor.communicationprotocol.factory.createProtocol({
            protocol: "getmetadata",
            xpath: bizagi.editor.utilities.resolveComplexXpath(properties.xpath)
        });

        return getMetadataProtocol.processRequest();
    },

    /*************************************************************************************************** 
    *   HELPER METHODS
    *****************************************************************************************************/

    /*
    *   Validates if the xpath change is valid
    */
    validateXpathChange: function (id, property, xpathData) {
        var self = this;
        var nodeType = xpathData.nodeType;
        var nodeSubtype = xpathData.nodeSubtype;
        var error = false;
        var validation = self.editorValidations[id];
        var type = "N/A";
        var types;

        switch (validation.typeEditor) {
            case "xpathfromentity":
            case "xpathtosimple":
                types = validation.editorParameters.types;
                type = types.toString();

                var i;
                error = true;
                for (i = 0; i < types.length; i++) {
                    try {
                        if ($.inArray(nodeSubtype, bizagi.editor.component.xpathnavigator.equiv.rule["xpathtosimple"][types[i]]) != -1) {
                            error = false;
                            break;
                        }
                    } catch (e) {
                        bizagi.logError("Equiv Error", "renderType: " + nodeType + ", types: " + type);
                    }
                }
                break;
            case "xpathtocollection":
                if ($.inArray(nodeType, bizagi.editor.component.xpathnavigator.equiv.rule["xpathtocollection"]["xpathtocollection"]) == -1) {
                    error = true;
                }
                break;
            case "xpathtoentity":
                if (!xpathData.hasRelatedEntity || xpathData.guidRelatedEntity == "00000000-0000-0000-0000-000000000000" || nodeType == "collection") {
                    error = true;
                }
                break;
            case "xpathtoentitytemplate":
                break;
        }
        if (error) {
            var title = bizagi.localization.getResource("bizagi-editor-validation-xpath-title");
            var message = printf(bizagi.localization.getResource("bizagi-editor-validation-xpath-title-message"), validation.typeEditor, type, nodeType);

            bizagi.showMessageBox(message, title, "warning", false);
        }
        return !error;
    },

    /*
    *   Validates if the xpathmultiple change is valid
    */
    validateXpathMultipleChange: function (id, property, xpathData) {
        var self = this;
        var nodeType = xpathData.nodeType;
        var nodeSubtype = xpathData.nodeSubtype;
        var error = false;
        var validation = self.editorValidations[id];
        var type = "N/A";
        var types;

        types = validation.editorParameters.types;
        type = types.toString();

        var i;
        error = true;
        for (i = 0; i < types.length; i++) {
            try {
                if ($.inArray(nodeSubtype, bizagi.editor.component.xpathnavigator.equiv.rule["xpathmultiple"][types[i]]) != -1) {
                    error = false;
                    break;
                }
            } catch (e) {
                bizagi.logError("Equiv Error", "renderType: " + nodeType + ", types: " + type);
            }
        }

        if (error) {
            var title = bizagi.localization.getResource("bizagi-editor-validation-xpath-title");
            var message = printf(bizagi.localization.getResource("bizagi-editor-validation-xpath-title-message"), validation.typeEditor, type, nodeType);
            bizagi.showMessageBox(message, title, "warning", false);
        }
        return !error;
    },

    /*
    * Checks if rule type is rule90
    */
    isRule90: function (rule) {
        return (rule["rule90"]);
    }
});