/*
*   Name: BizAgi FormModeler Editor Controller
*   Author: Alexander Mejia, Diego Parra
*   Comments:
*   -   This script will define basic stuff for main controller
*/
bizagi.editor.observableClass.extend("bizagi.editor.base.controller", {}, {

    /*
    *   Constructor, initialize all models
    */
    init: function (params) {
        var self = this;

        // Call base
        this._super();
        params = params || {};

        // Set a deferred to check if the controller is ready
        this.readyDefer = new $.Deferred();

        //Services
        this._ResourcesServices = bizagi.editor.base.services.resourcesServices;

        self.commandfactory = new bizagi.editor.commandfactory(this);
        self.undoCommandStack = [];
        self.redoCommandStack = [];
        self.copyFormatStack = [];
        self.selectedElements = {};

        // Create communication protocol
        self.communicationProtocol = bizagi.editor.communicationprotocol.factory;
        self.communicationProtocol.setContext(params.context);

        self.ctrlPressed = false;
        self.newForm = (params.data == undefined);

        // Set current context      
        self.context = params.context || "form";
        self.originalContext = bizagi.clone(self.context);
        self.contextInfo = { xpath: { xpath: { baxpath: { xpath: "", contextentity: params.contextentity, scopedefinition: params.scopedefinition}} },
            guid: null
        };

        self.baseContextInfo = bizagi.clone(self.contextInfo);

        // Set context entity type
        self.contextEntityType = (params.contextentitytype == 'enum') ? 'parameter' : params.contextentitytype;        

        // Set initial view
        self.xpathNavigatorView = bizagi.editor.component.xpathnavigator.model.view["onlyProcessEntity"];
        
        //Initialize all models
        setTimeout(function () {
            self.initModels(params);
        }, 200);
        
    },

    /*
    *   Initialize all models
    */
    initModels: function (params) {
        var self = this,
            definitions,
            xpathNavigatorInitialModel,
            layoutNavigatorModel,
            languages,
            hasLetters,
            flags,
            controlsDisabled;
        
        var availableLanguages = self.communicationProtocol.createProtocol({ protocol: "availablelanguages" });
        var controlsDefinitions = self.communicationProtocol.createProtocol({ protocol: "getcontrolsdefinitions" });
        var firstLoad = self.communicationProtocol.createProtocol({ protocol: "getfirstload" });
        var layoutDefinitions = self.communicationProtocol.createProtocol({ protocol: "getlayoutsdefinitions" });
        var verifyLetter = self.communicationProtocol.createProtocol({ protocol: "verifyletters" });
        var checkFlags = self.communicationProtocol.createProtocol({ protocol: "checkflags", flags: {
            "EnableCssClassProperty": true,
            "EnableShowAlwaysReverseAction": true,
            "EnableNextWithoutValidations": true,
            "UseOfflineForms": true

        }
        });
        var controlsDisabled = self.communicationProtocol.createProtocol({ protocol: "getcontrolsdisabled", context: self.context });
        var checkoutFormRequest = false;
        if (!self.isNewForm()) {
            checkoutFormRequest = self.communicationProtocol.createProtocol({ protocol: "checkoutform" }).processRequest();
        }

        // Read definitions and xpath navigator first load models
        $.when(controlsDefinitions.processRequest())
            .pipe(function (controlDefinitions) {
                definitions = controlDefinitions;
                return firstLoad.processRequest()
            })
            .pipe(function (firstLoad) {
                xpathNavigatorInitialModel = firstLoad;
                return layoutDefinitions.processRequest()
            })
            .pipe(function (layout) {
                layoutNavigatorModel = layout;
                return availableLanguages.processRequest()
            })
            .pipe(function (lang) {
                languages = lang;
                return verifyLetter.processRequest()
            })
            .pipe(function (letters) {
                hasLetters = letters;
                return checkFlags.processRequest()
            })
            .pipe(function (flgs) {
                flags = flgs;
                return controlsDisabled.processRequest()
            })
            .pipe(function (controlsDsbl) {
                controlsDisabled = controlsDsbl;
                return checkoutFormRequest
            })
            .done(function (statusForm) {

		        $.when(bizagi.localization.ready())
    		        .done(function () {
    		            // Initialize models
    		            var componentModels = self.componentModels = {};

    		            // holds a reference to controls
    		            var controls = componentModels["controls"] = new bizagi.editor.controls(definitions, $.extend(flags, hasLetters, controlsDisabled));

    		            bizagi = bizagi || {};
    		            bizagi.editor = bizagi.editor || {};
    		            bizagi.editor.flags = flags;

    		            //  Set status form
    		            statusForm = statusForm || {};
    		            self.isInCheckout = statusForm.isInCheckout;

    		            // Set User Information
    		            self.userInfo = statusForm.userInfo;

    		            if (!flags["EnableCssClassProperty"]) {
    		                controls.disableControlProperties("EnableCssClassProperty");
    		            }

    		            //controls.disabledControls($.extend(flags, hasLetters, controlsDisabled));

    		            params.isActivityForm = self.isFormContext() || self.isStartFormContext() ? bizagi.util.parseBoolean(params.isActivityForm) : false;

    		            // Rendering model
    		            self.model = new bizagi.editor.model({
    		                definitions: definitions,
    		                controls: controls,
    		                context: params.context,
    		                contextentity: params.contextentity,
    		                scopedefinition: params.scopedefinition,
    		                isActivityForm: params.isActivityForm,
    		                hasOfflineForm: params.hasOfflineForm,
    		                isOfflineAsOnline: params.isOfflineAsOnline,
    		                version: params.version,
    		                languages: languages,
    		                flags: flags
    		            });

    		            // Add model handler in order to refresh
    		            self.model.subscribe("refresh", function () { self.publish("refresh"); });

    		            // Add model handler in order to get the default displayName of element
    		            self.model.subscribe("getDefaultDisplayName", function (ev, args) { return self.publish("getDefaultDisplayName", args); });

    		            // Add model handler in order to get the defaultvalue property
    		            self.model.subscribe("getNodeInfo", function (ev, args) { return self.publish("getNodeInfo", args); });

    		            // Add model handler in order to get the current context
    		            self.model.subscribe("getContextXpath", function (ev, args) { return self.getContextXpath(args); });

    		            // Add model handler in order to find xpath attributes
    		            self.model.subscribe("findXpathAttributes", function (ev, args) { return self.publish("findXpathAttributes", args); });

    		            // Add model handler in order to refresh height of canvas
    		            self.model.subscribe("resizeHeigthCanvas", function (ev, args) { return self.publish("resizeHeigthCanvas", args); });

    		            // Add model handler in order to know if the current form is read only
    		            self.model.subscribe("isReadOnlyForm", function () { return self.isReadOnlyForm(); });

    		            // Add model handler in order to know the type of current context entity
    		            self.model.subscribe("getContextEntityType", function () { return self.getContextEntityType(); });

    		            // Add model handler in order to invoke a function of controller
    		            self.model.subscribe("getControllerInfo", function (ev, args) {
    		                if (args.type) {
    		                    if (typeof self[args.type] == "function") {
    		                        return self[args.type](args);
    		                    }
    		                }
    		            });

    		            // Add model handler in order to refresh an element on the form
    		            self.model.subscribe("refreshElement", function (ev, args) { return self.publish("refreshElement", args); });

    		            // Add model handler in order to know if the form is loaded
    		            self.model.subscribe("formIsLoaded", function (ev, args) { return self.publish("formIsLoaded", args); });

    		            var userFieldPromises = [];

    		            if (self.isFormContext() || self.isStartFormContext()) {

    		                // Loads userfields
    		                $.each(controls.controls, function (index, val) {
    		                    if (val.type && (val.type == 'userfield' || val.rendertype == "userfield")) {
    		                        userFieldPromises.push(self.loadUserfield(val));
    		                        self.loadIconUserField(val);
    		                    }
    		                });
    		            }

    		            // Component models
    		            componentModels["xpathNavigator"] = new bizagi.editor.component.xpathnavigator.model(xpathNavigatorInitialModel);
    		            componentModels["controlsNavigator"] = new bizagi.editor.component.controlsnavigator.model();
    		            componentModels["controlsNavigator"].subscribe("isContextEntityApplication", function () {
    		                return self.isContextEntityApplication();
    		            });
    		            componentModels["controlsNavigator"].subscribe("getContext", function () {
    		                return self.getContext();
    		            });

    		            componentModels["controlsNavigator"].processData(controls);
    		            componentModels["layoutNavigator"] = new bizagi.editor.component.layoutnavigator.model(layoutNavigatorModel);
    		            componentModels["ribbon"] = new bizagi.editor.component.ribbon.model(self.model.getRibbonModelData());

    		            self.processEntityId = componentModels["xpathNavigator"].getProcessEntityId();

    		            // Resolve ready deferred
                        
                        // Wait until all userfield definitions are loaded

    		            $.when.apply($, userFieldPromises)
                            .done(function () {
                                self.readyDefer.resolve();
                            });
    		            

    		        });
		    });
    },

    /*
    *   Load user field information
    */
    loadUserfield: function (userfieldDefinition) {
        var defer = $.Deferred();
        var requestInfo = {
            actiontype: 'GetUserfieldDependencies',
            parameters: [{ key: 'userfieldId', value: userfieldDefinition.guid }]
        }


        $.when(bizagi.editor.base.services.resourcesServices.getResource(requestInfo))
        .done(function (data) {
            try {

                var definition = data.result.parameters[0].value;

                try {
                    data = eval(definition);
                } catch (e) {
                    bizagi.log("Could not parse result userfield1 " + userfieldDefinition.name, e.message);
                }
                //data = JSON.parse(data);
                $.each(data, function (index, val) {
                    if (val.type == "js") {
                        try {
                            eval(val.content);
                        } catch (e) {
                            bizagi.log("Could not parse result userfield3 " + userfieldDefinition.name, e.message);
                        };
                    }
                    if (val.type == "css") {                       
                        bizagi.util.loadStyle(val.content, userfieldDefinition.guid);
                    }
                });

            } catch (e) { bizagi.log("Could not parse result userfield " + userfieldDefinition.name, e.message); };
        }).pipe(function () {
            defer.resolve();
        });
        return defer.promise();
    },

    /*
    *   Load user field icon
    */
    loadIconUserField: function (userfieldDefinition) {
        var defer = $.Deferred();
        userfieldDefinition.icon = defer.promise();

        var requestInfo = {
            actiontype: 'GetUserfieldIconDependencies',
            parameters: [
                { key: 'userfieldId', value: userfieldDefinition.guid },
                { key: 'density', value:'HDPI' },
                { key: 'size', value: 'SMALL' }
            ]
        }

        $.when(bizagi.editor.base.services.resourcesServices.getResource(requestInfo))
            .done(function (data) {
                var icon = data.result.parameters[0].value;

                bizagi.util.loadIconStyle(icon, userfieldDefinition.name);
                userfieldDefinition.icon = defer.resolve(icon);

            });
    },

    /*
    *   Checks if the controller is ready to work
    */
    ready: function () {
        return this.readyDefer.promise();
    },

    /*
    *   Create and execute a command in the model
    */
    executeCommand: function (args) {
        var self = this,
            command,
            canUndo;

        command = this.commandfactory.create(args);
        if (command) {
            // Now the commands can return async results
            return $.when(command.execute())
                    .pipe(function (success) {

                        if (success && !args.error) {
                            // Add success flag to arguments
                            args.success = true;

                            // Invoke callbacks
                            self.onCommandExecuted(args);

                            // Add to stack
                            canUndo = typeof (args.canUndo) !== "undefined" ? args.canUndo : true;
                            if (canUndo && command.arguments.command !== "getElementDesignProperty") {
                                self.undoCommandStack.push(command);
                                // delete item in stack redo
                                if (self.redoCommandStack.length > 0) {
                                    self.redoCommandStack.splice(0, self.redoCommandStack.splice.length);
                                }
                            }

                        } else {

                            // Set error flags
                            args.success = false;
                            args.result = { error: true, message: args.error };
                        }

                        return args.result;
                    });
        }
    },

    /*
    *   Publish command executed event to the view
    */
    onCommandExecuted: function (args) {
        this.publish("commandExecuted", args);
    },

    /*
    *   Check undo stack
    */
    hasUndo: function () {
        var self = this,
            undoStack;

        undoStack = (self.undoCommandStack.length > 0) ? true : false;

        return undoStack;

    },

    /*
    *   Undoes a command
    */
    undo: function () {
        var command,
            undoResult;

        command = this.undoCommandStack.pop();
        if (!command) return false;

        // Perform undo
        undoResult = command.undo();

        if (!undoResult) {
            this.undoCommandStack.push(command);
        } else {
            // Add to redo stack
            this.redoCommandStack.push(command);
        }

        return undoResult;
    },

    /*
    *   Check redo stack
    */
    hasRedo: function () {
        var self = this,
            redoStack;

        redoStack = (self.redoCommandStack.length > 0) ? true : false;

        return redoStack;

    },

    /*
    *   Redoes a command
    */
    redo: function () {

        var command,
            redoResult,
            args;

        command = this.redoCommandStack.pop();
        if (!command) return false;

        // Perform redo
        redoResult = command.redo();

        // Invoke callbacks
        args = $.extend({}, command.arguments, { redoed: true });
        this.onCommandExecuted(args);

        // Add to undo stack
        this.undoCommandStack.push(command);

        return redoResult;

    },

    /*
    *   Returns the controls model 
    */
    getControlsModel: function () {
        var self = this;
        return self.componentModels["controls"];
    },

    /*
    * This method return true if the context entity is Application
    */
    isContextEntityApplication: function () {
        var self = this;

        return self.contextEntityType == "application";
    },
    
    /*
    *   Returns the controls navigator model 
    */
    getControlsNavigatorModel: function () {
        var self = this;
        var context = self.context;
        return self.componentModels["controlsNavigator"].context[context];
    },

    /*
    * Returns the displayName assigned to the control
    */
    getControlDisplayName: function (controlName) {
        var self = this;
        return self.componentModels["controlsNavigator"].getControlDisplayName(controlName);
    },

    /*
    *   Returns the xpath navigator initial model 
    */
    getXpathNavigatorModel: function (params) {
        var self = this;
        params = params || {};
        var context = params.context;
        var model = self.componentModels["xpathNavigator"];


        // If context is defined we just should just check that path
        if (context != null) {
            if (context == "") return model;
            return model.getSubModel(context);
        }

        var contextInfo = self.contextInfo;
        return model.getSubModel(contextInfo.xpath);
    },
    
    /*
    * Gets current xpath navigator model for grid context
    */
    getXpathNavigatorModelGrid: function (params) {
        var self = this;
        params = params || {};
        var context = params.context;

        // If context is defined we just should just check that path
        if (context != null) {
            if (context == "") return self.xpathNavigatorModelGrid;
            return self.xpathNavigatorModelGrid.getSubModel(context);
        }

        return this.xpathNavigatorModelGrid;
    },

    /*
    *   Returns the layout navigator initial model 
    */
    getLayoutNavigatorModel: function () {
        var self = this;

        return self.componentModels["layoutNavigator"];
    },

    /*
    *   Returns the ribbon model 
    */
    getRibbonModel: function () {
        var self = this;

        return self.componentModels["ribbon"];
    },

    /*
    *   Returns the render model
    */
    getRenderingModel: function () {
        var self = this;

        return self.model.getRenderingModel();
    },

    /*
    *   Returns the persistence models
    */
    getPersistenceModel: function () {
        var self = this;

        return self.model.getPersistenceModel();
    },

    /*
    *   Returns the internal model
    */
    getModel: function () {
        var self = this;

        return self.model;
    },

    /*
    *   Get actions and validations model
    */
    getCommandsModel: function () {
        var self = this;
        var defer = new $.Deferred();
        $.when(self.model.getCommandsModel())
            .done(function (model) {
                self.commandsModel = bizagi.clone($.extend(model, {
                    flags: self.model.getFlags(),
                    isReadOnly: self.isReadOnlyForm()
                }));
                defer.resolve(self.commandsModel);
            });

        return defer.promise();
    },

    /*
    *  Get the configured flags
    */
    getFlags: function () {
        var self = this;
        return self.model.getFlags();
    },

    /*
    *   Get commands editor  model
    */
    getCommandsEditorModel: function () {
        var self = this;
        var defer = new $.Deferred();

        $.when(self.getCommandsModel())
            .done(function (model) {
                defer.resolve(new bizagi.editor.component.commandseditor.model(model));
            });

        return defer.promise();
    },

    /*
    * Check format stack
    */
    copyFormatHasElement: function () {
        return this.copyFormatStack.length > 0;
    },

    /*
    * Get format from stack
    */
    getCopyFormatElement: function () {

        return this.copyFormatStack[0];
    },

    /*
    * Returns true if the offline form is used as online
    */
    isOfflineAsOnline: function () {
        return this.model.checkOfflineAsOnline();
    },

    /*
    * Update the state of offlineAsOnline flag
    */
    setOfflineAsOnline: function (value) {
        this.model.updateOfflineAsOnline(value);
    },

    /*
    * Add format to stack
    */
    pushCopyFormat: function (property) {

        this.copyFormatStack.push(property);
    },

    /*
    * Get format from stack
    */
    popCopyFormat: function () {

        return this.copyFormatStack.pop();
    },

    /*
    *   Set actions and validations model
    *   Its not implemented via command, because we don't need to undo/redo this stuff
    */
    setCommandsModel: function (model) {
        var self = this;

        return self.model.setCommandsModel(model);
    },

    /*
    * Set originalModel
    */
    setOriginalModel: function (dataModel) {

        this.originalModel = (dataModel) ? dataModel : this.getPersistenceModel();
    },

    /*
    * Sets current xpath navigator model for grid context
    */
    setXpathNavigatorModelGrid: function (model) {
        this.xpathNavigatorModelGrid = model;
    },

    /*
    * This method sets the information of current user
    */
    setUserInfo: function (userInfo) {
        this.userInfo = userInfo;
    },

    /*
    *   Gets the current working context
    */
    getContext: function () {
        return this.context;
    },

    /*
    *   Gets the original working context
    */
    getOriginalContext: function () {
        return this.originalContext;
    },

    /*
    *   Gets the current context information object
    */
    getContextInfo: function () {
        var self = this;
        return {
            xpath: this.contextInfo.xpath,
            guid: this.contextInfo.guid || self.model.getGuid()
        };
    },


    /*
    * Builds xpath given the current context
    */
    getContextXpath: function (data) {
        var self = this;

        var xpath = data.xpath;

        if (self.isGridContext()) {
            var gridXpath = bizagi.editor.utilities.resolveComplexXpath(self.contextInfo.xpath);
            if (xpath) { return gridXpath + "." + xpath; }
            else { return gridXpath; }
        }
        else {
            return xpath;
        }
    },

    /*
    * This method returns the information of current user
    */
    getUserInfo: function () {
        return this.userInfo;
    },


    /*
    *   Changes the current context
    */
    changeContext: function (params) {
        this.context = params.context;
        if (params.context === "adhocgrid") {
            this.contextInfo.xpathAdhoc = params.xpathAdhoc || this.baseContextInfo.xpathAdhoc;
        } else {
            this.contextInfo.xpath = params.xpath || this.baseContextInfo.xpath;
        }
        this.contextInfo.guid = params.guid || this.baseContextInfo.guid;        
    },

    /*
    *   Checks if the controller is actually in a form context
    */
    isFormContext: function () {
        var self = this;

        return (self.context === "form");
    },

    /*
    *   Checks if the controller is actually in a template context
    */
    isTemplateContext: function () {
        var self = this;

        return (self.context === "template");
    },

    /*
    *   Checks if the controller is actually in a startform context
    */
    isStartFormContext: function () {
        var self = this;

        return (self.context === "startform");
    },

    /*
    *   Checks if the controller is actually in a adhocform context
    */
    isAdhocFormContext: function () {
        var self = this;

        return (self.context === "adhocform") || (self.context === "adhocgrid");
    },

    /*
    *   Checks if the controller is actually in an offlinecontext
    */
    isOfflineContext: function () {
        var self = this;

        return (self.context === "offlineform" || self.context === "offlinegrid");
    },

    /*
    *   Checks if the controller is actually in an offlineForm context
    */
    isOfflineFormContext: function () {
        var self = this;

        return (self.context === "offlineform" && bizagi.editor.flags["UseOfflineForms"]);
    },

    /*
    *   Checks if the controller is actually in a grid context
    */
    isGridContext: function () {
        var self = this;

        return (self.context === "grid" || self.context === "offlinegrid" || self.context === "adhocgrid");
    },

    /*
     *   Checks if the controller is actually in a grid context
     */
    searchDependencies: function (args) {
        var self = this;
        var commandResult = self.executeCommand({
            command: "searchDependencies",
            guids: args.guids,
            message: args.message
        });
        return commandResult;
    },

    /*
    *   Checks if the controller is actually in a searchform context
    */
    isSearchFormContext: function () {
        var self = this;

        return (self.context === "searchform");
    },

    /*
    *   Checks if the controller is actually in a queryform context
    */
    isQueryFormContext: function () {
        var self = this;

        return (self.context === "queryform");
    },

    /*
    *   Checks if the current model actually is an activityForm
    */
    isActivityForm: function () {
        var self = this;

        return self.model.checkActivityForm();
    },


    /*
    *   Checks if the current model actually has a opposite form defined
    */
    hasOfflineForm: function () {
        var self = this;

        return self.model.checkOfflineForm();
    },

    /*
    * This method returns true if the current form is read only 
    */
    isReadOnlyForm: function () {
        return this.isInCheckout;
    },

    /*
    * This method sets is the current form is read only or not
    */
    setReadOnlyFlag: function (readOnly) {
        this.isInCheckout = readOnly;
    },

    /*
    *   Checks if current form has changes
    */
    thereAreChangesInForm: function () {
        var self = this;

        return !bizagi.editor.utilities.objectEquals(self.originalModel, self.getPersistenceModel());
    },

    /*
    *   Toogle xpath navigator view
    */
    toogleXPathNavigatorView: function () {
        var self = this;

        self.xpathNavigatorView = (self.xpathNavigatorView === bizagi.editor.component.xpathnavigator.model.view["onlyProcessEntity"]) ?
                                  bizagi.editor.component.xpathnavigator.model.view["allView"] :
                                  bizagi.editor.component.xpathnavigator.model.view["onlyProcessEntity"];
    },

    /*
    *  Gets xpathNavigator view state
    */
    getXpathNavigatorView: function () {
        return this.xpathNavigatorView;
    },
    
    /*
    * Gets current processEntityId
    */
    getProcessEntityId: function () {
        return this.processEntityId;
    },

    /*
    * Adds element to array 
    */
    addSelectedElement: function (guid, args) {
        var self = this;

        self.selectedElements[guid] = args;
    },

    /*
    * Removes element to array
    */
    removeSelectedElement: function (guid) {
        var self = this;

        if (!guid) {
            self.selectedElements = {};
            return;
        }

        if (self.selectedElements[guid]) {
            delete self.selectedElements[guid];
        }

    },

    /*
    * Returns selected elements array
    */
    getSelectedElements: function (guid) {

        if (guid) { return this.selectedElements[guid]; }

        return this.selectedElements;
    },

    /*
    * Returns array with guids selected
    */
    getGuidsSelected: function () {
        var self = this;
        var guids = [];

        for (var guid in self.selectedElements) {
            guids.push(guid);
        }

        return guids;

    },

    /*
    * This method returns the type of current context entity
    */
    getContextEntityType: function () {
        return this.contextEntityType;
    },

    /*
    * Checks if there are two or more controls in selection
    */
    thereAreMultiselection: function () {
        var self = this;
        var length = 0;

        for (var guid in self.selectedElements) {
            length++;
        }

        return length > 1;
    },

    /*
    * Set flag newForm, this flag keeps the status form
    */
    setNewForm: function (newForm) {
        this.newForm = newForm;
    },

    /*
    *
    */
    setCtrlKey: function (state) {
        this.ctrlPressed = state;
    },

    /*
    *
    */
    isCtrlKeyPressed: function (state) {
        return this.ctrlPressed;
    },

    /*
    * Returns true if the current form is new
    */
    isNewForm: function () {
        return this.newForm;
    },

    /*
    * This method returns true if the current form support V&A
    */
    hasEnableCommandsEditor: function () {
        var self = this;

        if (self.context === "searchform" || self.context === "queryform") {
            return false;
        }

        return true;
    },

    /*
     * Sets the last inserted (from controls navigator) element's guid
     */
    setLastInsertedElement: function (guid) {
        this.lastInsertedElement = guid;
    },

    /*
     * Returns the last inserted (from controls navigator) element's guid
     */
    getLastInsertedElement: function () {
        return this.lastInsertedElement;
    }

})
