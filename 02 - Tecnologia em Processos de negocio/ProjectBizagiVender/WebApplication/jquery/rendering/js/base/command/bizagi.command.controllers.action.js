/*
 *   Name: BizAgi Rendering Validation controller 
 *   Author: Diego Parra
 *   Comments:
 *   -   This script will parse and execute all the validations defined for the form
 */

bizagi.command.controllers.controller.extend("bizagi.command.controllers.action", {}, {
    /* 
    *   Constructor
    */
    init: function (form, actions) {
        var self = this;

        // Call base
        this._super(form);

        // Set a new hash containing all the dependencies subscribing the events
        self.globalDependencies = {};
        self.initialCallFunctions = {};
        self.initialCallFunctionsDeferred = new $.Deferred();

        // Build actions
        if (actions)
            self.buildActions(actions);

        // Keep references
        self.actions = actions;
        self.internalSubmitActions = {};

        // Set initial timer to trigger initial functions using a setTimeout, and distributing them in differente timespans
        self.initialCallTimeout = 25;
        self.initialCallIncrements = 25;
        self.actionsHistory = {};
        self.period = 50;
    },
    /*
    *   Adds an internal submit action to be executed with all the given rules
    */
    processInternalSubmitAction: function (xpath, action) {
        var self = this;

        // if the action is registered, don't add it again
        // only one internal submit action is allowed per control
        if (self.internalSubmitActions[xpath])
            return;

        // Add to hash and build it
        self.internalSubmitActions[xpath] = action;
        self.buildAction(action, true);
    },
    /* Process all given  actions*/
    buildActions: function (actions, dontExecute) {
        var self = this, i, len;
        var hashes = {};

        for (i = 0, len = actions.length; i < len; i++) {
            // If action is not "valid" we can omit that instruction
            try {
                var action = actions[i];
                var hash = bizagi.util.md5(JSON.stringify(action.conditions));
                var hashC = bizagi.util.md5(JSON.stringify(action.commands));
                if (hashes[hash]) {
                    if (hashes[hash].indexOf(hashC) === -1) {
                        // si la condicion es igual y los comandos diferentes
                        self.buildAction(action, dontExecute);
                        hashes[hash].push(hashC);
                    }
                } else {
                    self.buildAction(action, dontExecute);
                    hashes[hash] = [hashC];
                }
            } catch (e) {
                // Handle the exception
                if (e.message != "RenderNotFoundException") {
                    bizagi.logError("Action cannot be parsed: " + e.message, actions[i]);
                }
            }
        }
    },
    /*
    *   Remove all current handlers
    */
    unbindActions: function () {
        var self = this;

        // Remove all previous handlers
        $.each(self.globalDependencies, function (i, render) {
            render.unbind("renderchange.action");
        });
        self.globalDependencies = {};

        // Reset timers and collections
        $.each(self.initialCallFunctions, function (i, handle) {
            clearTimeout(handle);
        });
        self.initialCallFunctions = {};
    },
    /* 
    *   Re-execute actions, cleaning the handlers first
    */
    refreshActions: function (newActions) {
        var self = this;

        self.initialCallTimeout = 25;
        self.initialCallFunctions = {};

        newActions = newActions || [];

        // Build the actions again
        self.actions = self.actions.concat(newActions);
        self.buildActions(self.actions, true);

        // Build internal actions again
        $.each(self.internalSubmitActions, function (_, action) {
            try {
                self.buildAction(action, false);
            } catch (e) {
                // Handle the exception
                if (e.message != "RenderNotFoundException") {
                    bizagi.logError("Action cannot be parsed: " + e.message, action);
                }
            }
        });
    },
    /* Process a single action*/
    buildAction: function (action, dontExecute) {
        var self = this;
        var form = self.form;
        var dependencies = [];
        var dependenciesId = [];

        var isEnabled = (action.enabled != undefined ) ? action.enabled : true;

        if (!isEnabled) return;

        // If the condition operator is true, we gotta dig in the actions to check if it modifies a grid
        // To include an auto-dependency, so each time the grid is changed that condition will be executed
        if (action.conditions && action.conditions.operator == "true") {
            if (!action.dependencies)
                action.dependencies = [];
            $.each(action.commands, function (_, command) {
                var gridReference = self.searchGridReferenceInXpath(command.xpath);
                if (gridReference) {
                    var dependencyAlreadyAdded = false, j, len;
                    for (j = 0, len = action.dependencies; j < len; j++) {
                        if (action.dependencies[j] == gridReference)
                            dependencyAlreadyAdded = true;
                    }
                    if (!dependencyAlreadyAdded)
                        action.dependencies.push(gridReference);
                }
            });
        }

        function isValidDependency(type) {
            var notValid = ["groupedgrid", "collectionnavigator"];
            if (notValid.indexOf(type) === -1) {
                return true;
            } else {
                return false;
            }
        }


        // Find dependencies to attach triggers
        if (action.dependencies) {
            for (var i = 0; i < action.dependencies.length; i++) {
                if (typeof action.dependencies[i] != "undefined") {
                    var renders = form.getRenders(action.dependencies[i]);
                    if (renders.length == 0) {
                        var renderById = form.getRenderById(action.dependencies[i]);
                        renders = (renderById) ? [renderById] : null;
                    }

                    if (renders) {
                        $.each(renders, function (_, render) {
                            if ($.inArray(render.properties.id, dependenciesId) < 0) {
                                if (isValidDependency(render.properties.type)) {
                                    dependenciesId.push(render.properties.id);
                                    dependencies.push(render);
                                }
                            }
                        });

                    }
                }
            }
        }

        // Build anonymous function
        var fn = self.buildFunction(action.conditions, action.commands, action.elseCommands);

        // Attach handlers
        $.each(dependencies, function (_, render) {
            render.bind("renderchange.action", function (ev, args) {
                args = args || {};

                // Default changed argument to true
                args.changed = args.changed !== undefined ? args.changed : true;

                // If a grid action has been performed, try to filter it by column, to avoid execute all grid actions each time                
                if (args.column) {
                    for (var j = 0; j < action.gridColumns.length; j++) {
                        if (args.column == action.gridColumns[j]) {
                            // Call function
                            fn(self, args);
                            return;
                        }
                    }
                } else {
                    // Call function
                    fn(self, args);
                }
            });

            // Add to global dependencies hash
            self.globalDependencies[render.properties.id] = render;

            // If render is a grid ... trigger function at this point
            if (render.properties.type == 'grid') {
                dontExecute = true;

                // Search column dependencies
                action.gridColumns = [];
                self.searchGridColumns(action.conditions, action.gridColumns);
            }
        });

        // Check if it has to execute
        if (dontExecute)
            return;

        // Execute the action because it must execute when the page loads with pre-defined value
        // Create an async function to trigger it later
        var asyncFn = function (self) {

            var guid = Math.guid();
            // Create the timeout
            var handle = setTimeout(function () {
                try {
                    // TODO: Define render to set parameter to "fn" function
                    fn(self);
                    delete self.initialCallFunctions[guid];
                } catch (e) { };
            }, self.initialCallTimeout);

            // Save a reference
            self.initialCallFunctions[guid] = handle;
            self.initialCallTimeout += self.initialCallIncrements;
        };
        // Run it
        asyncFn(self);
    },
    /*
    * Creates the function to execute based on the action metadata
    */
    buildFunction: function (conditions, commands, elseCommands) {
        var self = this;

        var gridReference = self.searchForGridReference(conditions, commands);
        var bGridDetected = (gridReference != null) ? gridReference : false;
        var sJsCondition = "";
        var sJsAction = "";
        var sStatement;
        var sJsElseAction = "";
        var bAutomaticRestore = elseCommands ? false : true;
        var bCondition = conditions ? true : false;
        var i;

        // Build Condition
        if (bCondition) {
            sJsCondition += self.buildConditions(conditions, bGridDetected);
        }

        // Build and execute actions
        for (i = 0; i < commands.length; i++) {
            // Parse command
            var queueAction = self.isServerCommand(commands[i]) ? "addParallel" : "add";
            var command = self.buildCommand(commands[i], bGridDetected);

            // Check if command ending with semicolon and remove it
            command = (command.indexOf(";") >= 1) ? command.replace(";", "") : command;
            sJsAction += "actionQueue." + queueAction + "(function(){return " + command + " ;}); \r\n";

            if (bAutomaticRestore) {
                sJsElseAction += self.buildRestoreCommand(commands[i], bGridDetected);
            }
        }

        // Build non-automatic else commands
        if (!bAutomaticRestore) {
            for (i = 0; i < elseCommands.length; i++) {
                sJsElseAction += self.buildCommand(elseCommands[i], bGridDetected);
            }
        }

        // Build final function
        //sStatement = "var baTmpFn = function(self, i, column){ \r\n";
        sStatement = "var baTmpFn = function(self, params){ \r\n";
        sStatement += "params = params || {};\r\n";
        if (bGridDetected) {
            sStatement += "var i = params.key;\r\n";
            sStatement += "var column = params.column;\r\n";
        }
        if (bCondition) {
            sStatement += "if (" + sJsCondition + "){ \r\n";
        }

        // Creates defferreds
        sStatement += "var actionQueue = new bizagiQueue(); \r\n";
        sStatement += "if (params.render){params.render.startActionExecution();} \r\n";
        sStatement += sJsAction;
        sStatement += "actionQueue.execute().always(function(){ \r\n";
        sStatement += "if (params.render){ params.render.endActionExecution();} \r\n });\r\n";

        if (bCondition) {
            sStatement += "\r\n } ";
            if (sJsElseAction.length > 0) {
                sStatement += "else { \r\n" + sJsElseAction + " }\r\n";
            }
        }

        sStatement += "};\r\n";


        if (!bGridDetected) {
            sStatement += "baTmpFn";
        } else {
            var sGridStatement = "var baGridTmpFn = function(self, args){ \r\n";
            sGridStatement += "args = args || {};\r\n";
            sGridStatement += "if(args.surrogateKey === undefined){\r\n";
            sGridStatement += "\t var grid = self.form.getRender('" + gridReference + "');\r\n";
            sGridStatement += "\t var data = grid.getIndexes();\r\n";
            sGridStatement += "\t $.each(data, function(i, index) {\r\n";
            sGridStatement += "\t\t args.key = index; \r\n";
            sGridStatement += "\t\t baTmpFn(self, args);\r\n";
            sGridStatement += "\t });\r\n";
            sGridStatement += "} else {\r\n";
            sGridStatement += "\t args.key = args.surrogateKey; \r\n";
            sGridStatement += "\t baTmpFn(self, args );\r\n";
            sGridStatement += "}\r\n";
            sGridStatement += "};\r\n";
            sStatement += sGridStatement;
            sStatement += "baGridTmpFn";
        }

        // Return interpreted function
        return eval(sStatement);
    },
    /*
    *   This method checks if a command must be performed by the client, or by the server
    */
    isServerCommand: function (command) {
        var commandType = command.command;
        if (commandType == 'refresh' || commandType == 'submit-data' || commandType == 'execute-rule' || commandType == 'execute-interface' || commandType == 'execute-sap' || commandType == 'execute-connector' ) {
            return true;
        }

        return false;
    },

    isRecentAction: function (prefix, command) {
        var self = this;
        var tag = prefix + "@" + command;
        if (self.actionsHistory[tag] != null) {
            return true;
        }
        $.when(self.runAction(prefix, command)).done(function () {
            delete self.actionsHistory[tag];
            bizagi.log("resolve " + tag);
        });
        return false;
    },

    runAction: function (prefix, command) {
        var self = this;
        var tag = prefix + "@" + command;
        self.actionsHistory[tag] = new $.Deferred();
        setTimeout(self.actionsHistory[tag].resolve, self.period);
        return self.actionsHistory[tag].promise();
    },
    /*
    *   Builds the action JS
    */
    buildCommand: function (command, bGridDetected) {
        var self = this;

        // Define if a grid has been detected
        bGridDetected = bGridDetected || false;

        var gridReference = bGridDetected;

        // Parse argument
        var commandType = command.command;
        var detectedArgumentType = self.detectCommandArgumentType(command.argumentType, commandType);
        var argument = self.buildArgument(command.argument, detectedArgumentType, bGridDetected, command.xpathContext);
        var xpath = command.xpath;


        // If a render id is given, we use it with priority over only xpath
        if (command.renderId) {
            xpath = "id=" + command.renderId + "";
        }

        // Process grid xpaths
        if (bGridDetected && xpath) {
            xpath = xpath.replaceAll("[]", "[' + i + ']");
        }

        if ((command.xpath && command.xpath.length > 0) || (command.renderId && command.renderId.length > 0)) {
            // Build render command
            switch (commandType) {
                case 'background-color':
                    if (command.controlType === "activityFlowButton") {
                        return "self.changeButtonBackground('" + xpath + "', " + argument + ");";
                    }
                    else {
                        return "self.changeRenderBackground('" + xpath + "', " + argument + ");";
                    }
                    break;
                case 'forecolor':
                    if (command.controlType === "activityFlowButton") {
                        return "self.changeButtonForeground('" + xpath + "', " + argument + ");";
                    }
                    else {
                        return "self.changeRenderForeground('" + xpath + "', " + argument + ");";
                    }
                    break;
                case 'visible':
                    if (command.controlType === "activityFlowButton") {
                        return "self.changeButtonVisibility('" + xpath + "', " + argument + ");";
                    }
                    else {
                        return "self.changeRenderVisibility('" + xpath + "', " + argument + ");";
                    }
                    break;
                case 'readonly':
                    if (command.controlType === "activityFlowButton") {
                        return "self.changeButtonEditability('" + xpath + "', " + argument + ");";
                    }
                    else {
                        return "self.changeRenderEditability('" + xpath + "', " + argument + ");";
                    }
                    break;
                case 'required':
                    return "self.changeRenderRequired('" + xpath + "', " + argument + ");";
                    break;
                case 'set-value':
                    // Check specific argument type
                    if (bGridDetected && command.argumentType == "xpath" && command.xpathContext != "") {
                        // When we are going to evaluate a xpath is necessary add a xpathcontext if it exist
                        command.argument = command.xpathContext + "." + command.argument;
                        argument = self.buildArgument(command.argument, detectedArgumentType, bGridDetected);
                    }

                    return "self.changeRenderValue('" + xpath + "', " + argument + ");";
                    break;
                case 'set-min':
                    return "self.changeRenderMinValue('" + xpath + "', " + argument + ");";
                    break;
                case 'set-max':
                    return "self.changeRenderMaxValue('" + xpath + "', " + argument + ");";
                    break;
                case 'calculate':
                    return "self.executeCalculatedField('" + xpath + "');";
                    break;
                case 'submit-value':
                    return "self.submitRender('" + xpath + "', '" + argument + "');";
                    break;
                case 'clean-data':
                    return "self.cleanRenderData('" + xpath + "');";
                    break;

                // New Features                                        
                case 'refresh':
                    var commandGridDetected = self.searchForGridReferenceInCommand(command);
                    command.xpathContext = command.xpathContext || "";

                    if (commandGridDetected) {
                        return "self.refreshGridCell('" + xpath + "', " + "'" + command.xpathContext + "'" + ");";
                    } else {
                        return "self.refreshControl('" + xpath + "', " + "'" + command.xpathContext + "','" + commandType + "');";
                    }
                    break;
                case 'trigger-click':
                    return "self.triggerClick('" + xpath + "');";
                    break;


            }
        } else {
            // Build container command
            switch (commandType) {
                case 'background-color':
                    return "self.changeContainerBackground('" + command.container + "', " + argument + ");";
                    break;
                case 'visible':
                    return "self.changeContainerVisibility('" + command.container + "', " + argument + ");";
                    break;
                case 'collapse':
                    return "self.toogleContainer('" + command.container + "', " + !bizagi.util.parseBoolean(argument) + ");";
                    break;
                case 'set-active':
                    return "self.changeActiveItem('" + command.container + "');";
                    break;
                case 'readonly':
                    return "self.changeContainerEditability('" + command.container + "', " + bizagi.util.parseBoolean(argument) + ");";
                    break;

                // New Features                                        
                case 'refresh':
                    // Set prepare parameter to multiaction purposes 
                    command.xpathContext = command.xpathContext || "";
                    return "self.refreshContainer('" + command.container + "', " + "'" + command.xpathContext + "'" + ");";
                    break;
            }
        }

        // Global  actions without specific target
        if (commandType == 'submit-data') {
            return "self.submitFormData();";
        }

        if (commandType == 'execute-rule') {
            var ruleObj = command.argument || {};
            var guidRule = "";
            try {
                guidRule = JSON.parse(ruleObj).guid;
            } catch (e) {
            }

            var xpathContext = command.xpathContext || "";
            if (bGridDetected) {
                var xpathContextRow = gridReference + "[id=%s]";
                return "self.executeRule('" + guidRule + "', printf('" + xpathContextRow + "',i) ,'" + commandType + "');";
            } else {
                return "self.executeRule('" + guidRule + "','" + xpathContext + "','" + commandType + "');";
            }
        }

        if (commandType == 'execute-interface') {
            var interfaceObj = command.argument || {};
            var guidInterface = "";

            try {
                guidInterface = JSON.parse(interfaceObj).guid;
            } catch (e) {
            }

            xpathContext = command.xpathContext || "";
            if (bGridDetected) {
                xpathContextRow = gridReference + "[id=%s]";
                return "self.executeInterface('" + guidInterface + "', printf('" + xpathContextRow + "',i));";
            } else {
                return "self.executeInterface('" + guidInterface + "','" + xpathContext + "');";
            }
        }

        if (commandType == 'execute-sap') {
            var connectorObj = command.argument || {};
            var guidsap = "";

            try {
                guidsap = JSON.parse(connectorObj).guid;
            } catch (e) {
            }

            xpathContext = command.xpathContext || "";
            if (bGridDetected) {
                xpathContextRow = gridReference + "[id=%s]";
                return "self.executeSAPConnector('" + guidsap + "', printf('" + xpathContextRow + "',i));";
            } else {
                return "self.executeSAPConnector('" + guidsap + "','" + xpathContext + "');";
            }
        }

        if (commandType == 'execute-connector') {
            var connectorObj = command.argument || {};
            var guidConnector = "";

            try {
                guidConnector = JSON.parse(connectorObj).guid;
            } catch (e) {
            }

            xpathContext = command.xpathContext || "";
            if (bGridDetected) {
                xpathContextRow = gridReference + "[id=%s]";
                return "self.executeConnector('" + guidConnector + "', printf('" + xpathContextRow + "',i));";
            } else {
                return "self.executeConnector('" + guidConnector + "','" + xpathContext + "');";
            }
        }

        bizagi.log("There is no definition for commandType: " + commandType);
        return "";
    },
    /* 
    *   Builds the JS command to restore automatically a command when condition is not met
    */
    buildRestoreCommand: function (command, bGridDetected) {
        var xpath = command.xpath;
        var commandType = command.command;

        // Define if a grid has been detected
        bGridDetected = bGridDetected || false;

        // If a render id is given, we use it with priority over only xpath
        if (command.renderId) {
            xpath = "id=" + command.renderId + "";
        }

        // Process grid xpaths
        if (bGridDetected) {
            xpath = xpath.replaceAll("[]", "[' + i + ']");
        }

        // Build restore action
        if (xpath && xpath.length > 0) {
            return "self.restoreRender('" + xpath + "', '" + commandType + "');";
        } else {
            return "self.restoreContainer('" + command.container + "', '" + commandType + "');";
        }
    },
    /* 
    *   Detect the command argument type based on the command type
    */
    detectCommandArgumentType: function (argumentType, commandType) {
        if (argumentType === undefined) {
            return argumentType;

        } else if (argumentType == "const") {

            if (commandType == 'background-color')
                return 'color';
            if (commandType == 'forecolor')
                return 'color';
            if (commandType == 'visible')
                return 'boolean';
            if (commandType == 'readonly')
                return 'boolean';
            if (commandType == 'required')
                return 'boolean';
            if (commandType == 'set-value')
                return 'text';
            if (commandType == 'collapse')
                return 'boolean';
            if (commandType == 'set-active')
                return 'number';
            if (commandType == 'set-min')
                return 'text';
            if (commandType == 'set-max')
                return 'text';
            if (commandType == 'calculate')
                return undefined;
            if (commandType == 'refresh')
                return undefined;
            if (commandType == 'submit-value')
                return 'json';

        } else if (argumentType == "xpath" || argumentType == "entity") {
            return argumentType;
        }

        bizagi.log("There is no definition for commandType: " + commandType);
        return null;
    },
    /* 
    *   Builds the JS command to restore a render when condition is not met
    */
    restoreRender: function (xpath, commandType) {
        var self = this;
        var renders = self.getRenders(xpath);
        if (renders == null) {
            if (self.Class.THROW_ERROR) {
                self.showRenderNotFoundError(xpath);
            }
            return;
        }

        $.each(renders, function (i, render) {
            var properties = render.originalProperties;
            var textFormat = properties.textFormat || {};
            if (commandType == 'background-color')
                self.changeRenderBackground(xpath, textFormat.background || '');
            if (commandType == 'forecolor')
                self.changeRenderForeground(xpath, textFormat.color || 'none');
            if (commandType == 'visible')
                self.changeRenderVisibility(xpath, properties.visible != undefined ? properties.visible : true);
            if (commandType == 'readonly')
                self.changeRenderEditability(xpath, properties.editable != undefined ? properties.editable : true);
            if (commandType == 'required')
                self.changeRenderRequired(xpath, properties.required != undefined ? properties.required : false);
            // NOte: Command 6 does not have restoration
        });
    },
    /* 
    *   Builds the JS command to restore a container when condition is not met
    */
    restoreContainer: function (containerId, commandType) {
        var self = this;
        var form = self.form;
        var container = form.getContainer(containerId);
        if (container == null) {
            if (self.Class.THROW_ERROR) {
                self.showContainerNotFoundError(xpath);
            }
            return;
        }

        var properties = container.originalProperties;
        if (commandType == 'background-color')
            self.changeContainerBackground(containerId, properties.backgroundColor || 'none');
        if (commandType == 'visible')
            self.changeContainerVisibility(containerId, properties.visible != undefined ? properties.visible : true);
        if (commandType == 'collapse')
            self.toogleContainer(containerId, true);
        // NOte: Command 8 does not have restoration
        if (commandType == 'readonly')
            self.changeContainerEditability(containerId, properties.editable != undefined ? properties.editable : true);
    },
    /* 
    *   Sets a new color for the background of the render
    *   Applies also to grid cells!
    */
    changeRenderBackground: function (xpath, argument) {
        var self = this;
        var renders = self.getRenders(xpath);
        if (renders == null) {
            if (self.Class.THROW_ERROR) {
                self.showRenderNotFoundError(xpath);
            }
            return;
        }

        $.each(renders, function (i, render) {
            //Detects if is the grid component, and set the desired properties
            if (!self.isGridComponent(render, xpath)) {
                // Normal renders
                $.when(render.ready()).done(function () {
                    render.changeBackgroundColor(argument);
                });

            } else {
                // Grid renders
                var gridXpath = self.processGridXpath(xpath);
                $.when(render.ready()).done(function () {
                    if (!bizagi.util.isEmpty(gridXpath.index)) {
                        render.changeCellBackgroundColor(gridXpath.index, gridXpath.remainingXpath, argument);

                    } else {
                        var indexes = render.getIndexes(), j, lenIndex;
                        for (j = 0, lenIndex = indexes.length; j < lenIndex; j++) {
                            render.changeCellBackgroundColor(indexes[j], gridXpath.remainingXpath, argument);
                        }
                    }
                });
            }
        });
    },
    /*
     *   Sets a new color for the background of the button
     *   Applies also to grid cells!
     */
    changeButtonBackground: function (xpath, argument) {
        var self = this;
        var guid = xpath.substring(3);
        var element = self.form.getButton(guid);
        element.css("background-image", "none");
        element.addClass("ui-fast-transition");
        element[0].style.setProperty("background-color", argument, "important");
    },
    /* 
    *   Sets a new color for the foreground of the render
    */
    changeRenderForeground: function (xpath, argument) {
        var self = this;
        var renders = self.getRenders(xpath);
        if (renders == null) {
            if (self.Class.THROW_ERROR) {
                self.showRenderNotFoundError(xpath);
            }
            return;
        }

        $.each(renders, function (i, render) {
            //Detects if is the grid component, and set the desired properties
            if (!self.isGridComponent(render, xpath)) {
                // Normal renders
                $.when(render.ready()).done(function () {
                    render.changeColor(argument);
                });

            } else {
                // Grid renders
                var gridXpath = self.processGridXpath(xpath);
                $.when(render.ready()).done(function () {
                    if (!bizagi.util.isEmpty(gridXpath.index)) {
                        render.changeCellColor(gridXpath.index, gridXpath.remainingXpath, argument);

                    } else {
                        var indexes = render.getIndexes(), j, lenIndex;
                        for (j = 0, lenIndex = indexes.length; j < lenIndex; j++) {
                            render.changeCellColor(indexes[j], gridXpath.remainingXpath, argument);
                        }
                    }
                });
            }
        });
    },
    /*
     *   Sets a new color for the foreground of the render
     */
    changeButtonForeground: function (xpath, argument) {
        var self = this;
        var guid = xpath.substring(3);
        var element = self.form.getButton(guid);
        element.css("color", argument, "!important");
    },
    /* 
    *   Changes the visibility of the render
    */
    changeRenderVisibility: function (xpath, argument) {
        var self = this;
        var renders = self.getRenders(xpath);
        if (renders == null) {
            if (self.Class.THROW_ERROR) {
                self.showRenderNotFoundError(xpath);
            }
            return;
        }

        $.each(renders, function (i, render) {
            //Detects if is the grid component, and set the desired properties
            if (!self.isGridComponent(render, xpath)) {
                // Normal renders
                $.when(render.ready()).done(function () {
                    render.changeVisibility(argument);
                });
            } else {
                // Grid renders
                var gridXpath = self.processGridXpath(xpath);
                $.when(render.ready()).done(function () {
                    if (!bizagi.util.isEmpty(gridXpath.index)) {
                        render.changeCellVisibility(gridXpath.index, gridXpath.remainingXpath, argument);

                    } else {
                        var indexes = render.getIndexes(), j, lenIndex;
                        for (j = 0, lenIndex = indexes.length; j < lenIndex; j++) {
                            render.changeCellVisibility(indexes[j], gridXpath.remainingXpath, argument);
                        }
                    }
                });
            }
        });
    },
    /*
     *   Changes the visibility of the button
     */
    changeButtonVisibility: function (xpath, argument) {
        var self = this;
        var guid = xpath.substring(3);
        var element = self.form.getButton(guid);
        if (bizagi.util.parseBoolean(argument) == true) {
            element.show();
            element.css("display", "");
        } else {
            element.hide();
        }
    },
    /* 
    *   Changes the editability of the render
    */
    changeRenderEditability: function (xpath, argument) {
        var self = this;
        var renders = self.getRenders(xpath);
        if (renders == null) {
            if (self.Class.THROW_ERROR) {
                self.showRenderNotFoundError(xpath);
            }
            return;
        }

        $.each(renders, function (i, render) {
            // execute commands over valid renders
            if (self.isValidRender(render)) {
                //Detects if is the grid component, and set the desired properties
                if (!self.isGridComponent(render, xpath)) {
                    // Normal renders
                    $.when(render.ready()).done(function () {
                        render.changeEditability(argument);
                    });
                } else {
                    // Grid renders
                    var gridXpath = self.processGridXpath(xpath);
                    $.when(render.ready()).done(function () {
                        if (!bizagi.util.isEmpty(gridXpath.index)) {
                            render.changeCellEditability(gridXpath.index, gridXpath.remainingXpath, argument);

                        } else {
                            var indexes = render.getIndexes(), j, lenIndex;
                            for (j = 0, lenIndex = indexes.length; j < lenIndex; j++) {
                                render.changeCellEditability(indexes[j], gridXpath.remainingXpath, argument);
                            }
                        }
                    });
                }
            }
        });


    },
    /*
     *   Changes the editability of the button
     */
    changeButtonEditability: function (xpath, argument) {
        var self = this;
        var guid = xpath.substring(3);
        var element = self.form.getButton(guid);
        if (bizagi.util.parseBoolean(argument) == true) {
            element.removeAttr("disabled");
        } else {
            element.attr("disabled","disabled");
        }
    },
    /*
     *  trigger Click button
     */
    triggerClick: function (xpath) {
        var self = this;
        var guid = xpath.substring(3);
        var element = self.form.getButton(guid);
        element.trigger("click");
    },

    /* 
    *   Changes the required value of the render
    */
    changeRenderRequired: function (xpath, argument) {
        var self = this;
        var renders = self.getRenders(xpath);
        var rendersToEval = [];

        if (renders == null) {
            if (self.Class.THROW_ERROR) {
                self.showRenderNotFoundError(xpath);
            }
            return;
        }

        $.each(renders, function (i, render) {
            if (bizagi.util.parseBoolean(render.properties.editable)) {
                rendersToEval.push(render);
            }
        });

        if (rendersToEval.length === 0) {
            rendersToEval = renders;
        }

        $.each(rendersToEval, function (i, render) {
            // execute commands over valid renders
            if (self.isValidRender(render)) {
                //Detects if is the grid component, and set the desired properties
                if (!self.isGridComponent(render, xpath)) {
                    // Normal renders
                    $.when(render.ready()).done(function () {
                        render.changeRequired(argument);
                    });
                } else {
                    // Grid renders
                    var gridXpath = self.processGridXpath(xpath);
                    $.when(render.ready()).done(function () {
                        if (!bizagi.util.isEmpty(gridXpath.index)) {
                            render.changeCellRequired(gridXpath.index, gridXpath.remainingXpath, argument);

                        } else {
                            var indexes = render.getIndexes(), j, lenIndex;
                            for (j = 0, lenIndex = indexes.length; j < lenIndex; j++) {
                                render.changeCellRequired(indexes[j], gridXpath.remainingXpath, argument);
                            }
                        }
                    });
                }
            }
        });
    },
    /* 
    *   Changes the render internal value
    */
    changeRenderValue: function (xpath, argument) {
        var self = this;
        var renders = self.getRenders(xpath);
        if (renders == null) {
            if (self.Class.THROW_ERROR) {
                self.showRenderNotFoundError(xpath);
            }
            return;
        }

        // Eval only an editable render
        var rendersToEval = [];
        $.each(renders, function (i, render) {
            if (render.properties.editable) {
                rendersToEval.push(render);
            }
        });

        // If no render has been found skip editable validation
        if (rendersToEval.length == 0) {
            $.each(renders, function (i, render) {
                rendersToEval.push(render);
            });
        }

        $.each(rendersToEval, function (i, render) {
            //Detects if is the grid component, and set the desired properties
            if (!self.isGridComponent(render, xpath)) {
                // Normal renders
                $.when(render.ready()).done(function () {
                    if (render.asyncRenderDeferred) {
                        $.when(render.asyncRenderDeferred).done(function () {
                            render.setDisplayValue(argument);
                        });
                    } else {
                        render.setDisplayValue(argument);
                    }
                });
            } else {
                // Grid renders
                var gridXpath = self.processGridXpath(xpath);
                $.when(render.ready()).done(function () {
                    if (!bizagi.util.isEmpty(gridXpath.index)) {
                        render.changeCellValue(gridXpath.index, gridXpath.remainingXpath, argument);

                    } else {
                        var indexes = render.getIndexes(), j, lenIndex;
                        for (j = 0, lenIndex = indexes.length; j < lenIndex; j++) {
                            render.changeCellValue(indexes[j], gridXpath.remainingXpath, argument);
                        }
                    }
                });
            }
        });
    },
    /* 
    *   Changes the render minimum value
    */
    changeRenderMinValue: function (xpath, argument) {
        var self = this;
        var renders = self.getRenders(xpath);
        if (renders == null) {
            if (self.Class.THROW_ERROR) {
                self.showRenderNotFoundError(xpath);
            }
            return;
        }

        $.each(renders, function (i, render) {
            //Detects if is the grid component, and set the desired properties
            if (!self.isGridComponent(render, xpath)) {
                // Normal renders
                $.when(render.ready()).done(function () {
                    var renderType = render.properties.type;
                    if (renderType == "number" || renderType == "date" || renderType == "money") {
                        render.changeMinValue(argument);
                    }
                });

            } else {
                // Grid renders
                var gridXpath = self.processGridXpath(xpath);
                $.when(render.ready()).done(function () {
                    if (!bizagi.util.isEmpty(gridXpath.index)) {
                        render.changeCellMinValue(gridXpath.index, gridXpath.remainingXpath, argument);

                    } else {
                        var indexes = render.getIndexes(), j, lenIndex;
                        for (j = 0, lenIndex = indexes.length; j < lenIndex; j++) {
                            render.changeCellMinValue(indexes[j], gridXpath.remainingXpath, argument);
                        }
                    }
                });
            }
        });
    },
    /* 
    *   Changes the render max value
    */
    changeRenderMaxValue: function (xpath, argument) {
        var self = this;
        var renders = self.getRenders(xpath);
        if (renders == null) {
            if (self.Class.THROW_ERROR) {
                self.showRenderNotFoundError(xpath);
            }
            return;
        }

        $.each(renders, function (i, render) {
            //Detects if is the grid component, and set the desired properties
            if (!self.isGridComponent(render, xpath)) {
                // Normal renders
                $.when(render.ready()).done(function () {
                    render.changeMaxValue(argument);
                });

            } else {
                // Grid renders
                var gridXpath = self.processGridXpath(xpath);
                $.when(render.ready()).done(function () {
                    if (!bizagi.util.isEmpty(gridXpath.index)) {
                        render.changeCellMaxValue(gridXpath.index, gridXpath.remainingXpath, argument);

                    } else {
                        var indexes = render.getIndexes(), j, lenIndex;
                        for (j = 0, lenIndex = indexes.length; j < lenIndex; j++) {
                            render.changeCellMaxValue(indexes[j], gridXpath.remainingXpath, argument);
                        }
                    }
                });
            }
        });
    },
    /* 
    *   Changes the render max value
    */
    executeCalculatedField: function (xpath) {
        var self = this;
        var renders = self.getRenders(xpath);
        if (renders == null) {
            if (self.Class.THROW_ERROR) {
                self.showRenderNotFoundError(xpath);
            }
            return;
        }

        $.each(renders, function (i, render) {
            $.when(render.ready()).done(function () {
                render.runFormula();
            });
        });
    },
    /* 
    *   Refresh the render internal value using ajax
    */
    refreshControl: function (xpath, xpathContext, commandType) {
        var self = this;
        var renders = self.getRenders(xpath) || self.form.getContainer(xpath);
        var queue = new bizagiQueue();
        
        if (renders == null) {
            if (self.Class.THROW_ERROR) {
                self.showRenderNotFoundError(xpath);
            }
            return;
        }

        // Process matching renders
        $.each(renders, function (i, render) {
            queue.add(render.ready().pipe(function () {
                return render.refreshControl({xpath: xpath, xpathContext: xpathContext});
            }));
        });

        // Return queue deferred
        return queue.execute();
    },
    /* 
    *   Refresh the render internal value using ajax
    */
    refreshContainer: function (containerId, xpathContext) {
        var self = this;
        var container = self.form.getContainer(containerId);

        if (container == null) {
            if (self.Class.THROW_ERROR) {
                self.showRenderNotFoundError(containerId);
            }
            return;
        }

        return $.when(container.ready())
                .pipe(function () {
                    return container.refreshContainer({ xpathContext: xpathContext });
                });
    },
    /**
    * Refresh a cell of grid
    */
    refreshGridCell: function (xpath, xpathContext) {
        var self = this;
        var queue = new bizagiQueue();
        var def = new $.Deferred();
        var renders = self.getRenders(xpath) || self.form.getContainer(xpath);

        if (renders == null) {
            if (self.Class.THROW_ERROR) {
                self.showRenderNotFoundError(xpath);
            }
            return null;
        }

        // Eval only an editable render
        var rendersToEval = [];
        $.each(renders, function (i, render) {
            if (render.properties.editable) {
                rendersToEval.push(render);
                return false;
            }
        });

        // If no render has been found skip editable validation
        if (rendersToEval.length == 0) {
            $.each(renders, function (i, render) {
                rendersToEval.push(render);
                return false;
            });
        }

        if (rendersToEval.length === 0) {
            return;
        }

        // Check xpathContext of the form (addForm or editForm)
        if (self.form && self.form.properties.xpathContext !== "") {
            xpathContext = (xpathContext !== "") ? self.form.properties.xpathContext + "." + xpathContext : self.form.properties.xpathContext;
        }

        queue.add(def.promise());

        $.when.apply($, $.map(rendersToEval, function (grid) { grid.ready(); }))
            .done(function () {
                var len = rendersToEval.length;
                var internalQueue = new bizagiQueue();
                for (var i = 0; i < len; i++) {
                    var grid = rendersToEval[i];

                    var gridXpath = self.processGridXpath(xpath);
                    if (!bizagi.util.isEmpty(gridXpath.index)) {
                        // Process a specific row
                        internalQueue.add(grid.refreshCell({ key: gridXpath.index, column: gridXpath.remainingXpath, xpathContext: xpathContext }));
                    } else {
                        // Process all rows
                        var indexes = grid.getIndexes();
                        var lenIndex = indexes.length;
                        for (var j = 0; j < lenIndex; j++) {
                            internalQueue.addParallel(grid.refreshCell({ key: indexes[j], column: gridXpath.remainingXpath, xpathContext: xpathContext }));
                        }
                    }
                }

                $.when(internalQueue.execute())
                    .done(function () {
                        def.resolve();
                    });
            });


        return queue.execute();
    },
    /**
    * This function execute action to save all data of render, but
    * the server service dont execute any rule on the server
    */
    submitFormData: function (params) {
        var self = this;

        // For the submit action we need only the whole form to perform the server action
        var form = self.form;

        // Process the action
        return $.when(form.ready())
                .pipe(function () {
                    return form.submitData(params);
                });
    },
    /**
    * This function send a request to the server to execute a rule
    */
    executeRule: function (rule, xpathContext,commandType) {
        var self = this;
        // For the execute rule  action we need only the whole form to perform the server action
        var form = self.form;
        var prefix = rule + "." + xpathContext;
        if (self.isRecentAction(prefix, commandType)) {
            return;
        } else {
            // Process the action
            return $.when(form.ready())
                .pipe(function () {
                    return form.executeRule({rule: rule, xpathContext: xpathContext});
                });
        }
    },
    executeInterface: function (interface, xpathContext) {
        var self = this;
        // For the execute rule  action we need only the whole form to perform the server action
        var form = self.form;

        // Process the action
        return $.when(form.ready())
                .pipe(function () {
                    return form.executeInterface({ interface: interface, xpathContext: xpathContext });
                });
    },


    executeSAPConnector: function (guidsap, xpathContext) {
        var self = this;
        var form = self.form;
        return $.when(form.ready).pipe(function () {
            return form.executeSAPConnector({ guidsap: guidsap, xpathContext: xpathContext });
        });
    },

    executeConnector: function (guidConnector, xpathContext) {
        var self = this;
        var form = self.form;
        return $.when(form.ready).pipe(function () {
            return form.executeConnector({ guidConnector: guidConnector, xpathContext: xpathContext });
        });
    },
    /*
    *   Submit the given render and refresh dependencies after that
    */
    submitRender: function (xpath, argument) {
        var self = this;
        // For the submit action we need only one render to perform the server action
        var render = self.getRender(xpath);
        if (render == null) {
            if (self.Class.THROW_ERROR) {
                self.showRenderNotFoundError(xpath);
            }
            return;
        }

        // Process the action in the render
        return $.when(render.ready()).pipe(function () {
            return render.submitOnChange();
        });
    },
    /*
    * Cleans current value
    */
    cleanRenderData: function (xpath) {
        var self = this;
        var renders = self.getRenders(xpath);
        if (renders == null) {
            if (self.Class.THROW_ERROR) {
                self.showRenderNotFoundError(xpath);
            }
            return;
        }

        $.each(renders, function (i, render) {
            //Detects if is the grid component, and set the desired properties
            if (!self.isGridComponent(render, xpath)) {
                // Normal renders
                $.when(render.ready()).done(function () {
                    render.cleanData();
                    self.changeRenderRequired(xpath, render.properties.required != undefined ? render.properties.required : false);
                });
            } else {
                // Grid renders
                var gridXpath = self.processGridXpath(xpath);
                $.when(render.ready()).done(function () {
                    if (!bizagi.util.isEmpty(gridXpath.index)) {
                        render.cleanCellData(gridXpath.index, gridXpath.remainingXpath);
                    } else {
                        var indexes = render.getIndexes(), j, lenIndex;
                        for (j = 0, lenIndex = indexes.length; j < lenIndex; j++) {
                            render.cleanCellData(indexes[j], gridXpath.remainingXpath);
                        }
                    }
                });
            }
        });
    },
    /* 
    *   Changes container background color
    */
    changeContainerBackground: function (containerId, argument) {
        var self = this;
        var form = self.form;
        var container = form.getContainer(containerId);
        if (container == null) {
            if (self.Class.THROW_ERROR) {
                self.showContainerNotFoundError(containerId);
            }
            return;
        }

        $.when(container.ready()).done(function () {
            container.changeBackgroundColor(argument);
        });
    },
    /* 
    *   Shows or hides a container
    */
    changeContainerVisibility: function (containerId, argument) {
        var self = this;
        var form = self.form;
        var container = form.getContainer(containerId);
        if (container == null) {
            if (self.Class.THROW_ERROR) {
                self.showContainerNotFoundError(containerId);
            }
            return;
        }

        $.when(container.ready(true)).done(function () {
            container.changeVisibility(argument);
        });
    },
    /* 
    *   Expand or collapse a group container
    */
    toogleContainer: function (containerId, argument) {
        var self = this;
        var form = self.form;
        var container = form.getContainer(containerId);
        if (container == null) {
            if (self.Class.THROW_ERROR) {
                self.showContainerNotFoundError(containerId);
            }
            return;
        }
        if (container.properties.type != "group")
            return;

        $.when(container.ready()).done(function () {
            container.toogleContainer(argument);
        });
    },
    /* 
    *   Select a determinate sub-container in a tab or an accordion
    */
    changeActiveItem: function (containerId) {
        var self = this;
        var form = self.form;
        var container = form.getContainer(containerId);
        if (container == null) {
            if (self.Class.THROW_ERROR) {
                self.showContainerNotFoundError(containerId);
            }
            return;
        }
        if (container.properties.type == "tabItem") container.loadingDeferred.resolve();
        $.when(container.ready()).done(function () {
            container.setAsActiveContainer();
        });
    },
    /* 
    *   Changes container editability
    */
    changeContainerEditability: function (containerId, argument) {
        var self = this;
        var form = self.form;
        var container = form.getContainer(containerId);
        if (container == null) {
            if (self.Class.THROW_ERROR) {
                self.showContainerNotFoundError(containerId);
            }
            return;
        }

        $.when(container.ready()).done(function () {
            container.changeEditability(argument);
        });
    },
    /*
    *   Search for grid columns
    */
    searchGridColumns: function (condition, gridColumns) {
        var self = this;
        var column;
        if (typeof (condition) === "string" || typeof (condition) === "boolean")
            return null;
        if (condition.expressions) {
            var j, lenIndex;
            for (j = 0, lenIndex = condition.expressions.length; j < lenIndex; j++) {
                self.searchGridColumns(condition.expressions[j], gridColumns);
            }

        } else if (condition.simple) {
            return self.searchGridColumns(condition.simple, gridColumns);

        } else if (condition.complex) {
            return self.searchGridColumns(condition.complex, gridColumns);
        } else {
            var xpath = condition.xpath || condition.renderId;
            if (xpath) {
                // Check in condition.xpath
                if (xpath && xpath.indexOf("[]") > 0) {
                    column = xpath.substring(xpath.indexOf("[]") + 3);
                    gridColumns.push(column);
                }

                // Check in argument if argumentType is xpath
                if (condition.argumentType == 'xpath') {
                    if (condition.argument.indexOf("[]") > 0) {
                        column = condition.argument.substring(condition.argument.indexOf("[]") + 3);
                        gridColumns.push(column);
                    }
                }
            }
        }

        return null;
    },
    /**/

    isGridComponent: function (render, xpath) {
        return (render.properties.type == 'grid' && xpath.indexOf('[') >= 0);
    },
    /**/

    isValidRender: function (render) {
        var notValid = ["collectionnavigator"];
        if (notValid.indexOf(render.properties.type) === -1) {
            return true;
        }
        return false;
    }
});