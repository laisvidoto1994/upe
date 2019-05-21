/*
*   Name: BizAgi Form Container Class
*   Author: Diego Parra
*   Comments:
*   -   This script will define a form container class that defines basic stuff regarding the device
*/

bizagi.rendering.container.extend("bizagi.rendering.form", {}, {
    /*
    *   Constructor
    */
    init: function (params) {
        var self = this;
        var data = params.data;
        var device = bizagi.util.detectDevice();

        // Creates a hashtable to maintain references by id
        self.rendersById = {};
        self.rendersByXpath = {};
        self.rendersByType = {};

        // Set page cache id
        self.idPageCache = data.pageCacheId;

        // Set default mode
        self.mode = params.mode || "execution";
        self.focus = params.focus;

        // Set rendering params
        self.params = params;

        // Call base
        this._super(params);

        // Define confirmation message 
        var message = "";

        if (device !== "desktop") {
            message = this.getResource("render-form-user-confirmation-message").replace(/<br(\/| \/)>/g, "\n");
        } else {
            message = this.getResource("render-form-user-confirmation-message");
        }

        // Default properties
        var properties = self.properties;
        properties.sessionId = data.sessionId;
        properties.displayAsReadOnly = bizagi.util.parseBoolean(data.displayAsReadOnly) || false;
        properties.userConfirmationMessage = properties.userConfirmationMessage || message;
        properties.orientation = properties.orientation || "ltr";
        properties.hasRule = bizagi.util.parseBoolean(properties.hasRule) || false;
        properties.contexttype = params.contexttype || "";
        properties.paramsRender = params.paramsRender || {};
        properties.processPath = params.data.processPath ? params.data.processPath.replaceAll("/", "  &rsaquo;  ") : "";
        properties.breadCrumb = params.data.processPath ? params.data.processPath.split("/") : [];

        // Set validations & actions
        this.validations = data.validations;
        this.actions = data.actions;

        // Initialize buttons
        self.initializeButtons(data);

        // Define transitions to Complex Gateway
        if (data.transitions) {
            self.transitions = data.transitions;
        }

    },
    /*
    *   Initializes button metadata
    */
    initializeButtons: function (data) {
        var self = this;

        self.buttons = [];

        // Process buttons
        if (data.buttons) {
            $.each(data.buttons, function (i, item) {
                var button = item.button.properties;

                // Process caption
                button.caption = !bizagi.util.isEmpty(button.caption)
                    && self.getResource(button.caption) != button.caption
                    ? self.getResource(button.caption) : button.caption;

                // Process actions
                if (button.actions) {
                    $.each(button.actions, function (i, action) {
                        button[action] = true;
                    });
                }

                // Add other properties
                button.ordinal = i;
                button.action = button.next ? "next" : button.submitData ? "save" : button.cancel
                    ? "cancel" : button.back ? "back" : button.createnewcase ? "createnewcase" : button.validate ? "validate": "";

                // Explicit add save operation
                button.save = (button.action == "save");

                // Add inherent behaviours
                if (button.next || button.back) {
                    button.routing = true;
                }
                if (button.hasRule) {
                    button.executeRule = true;
                }

                // Prepare button style
                button.style = self.buildButtonStyle(button);

                // Add to button array
                if(self.properties.orientation === "rtl" && !self.properties.useCustomButtons){
                    self.buttons.unshift(button);
                }
                else{
                    self.buttons.push(button);
                }

            });
        }
    },
    /*
    *   Get the original params used to fetch the form
    */
    getParams: function () {
        return this.params;
    },

    setParam: function (property, value) {
        if (this.params) {
            this.params[property] = value;
        }
    },

    /*
    *   Get current rendering mode
    */
    getMode: function () {
        return this.mode;
    },
    /*
    *   Get the custom handlers set for this execution
    */
    getCustomHandlers: function () {
        var self = this;
        if (self.params) {
            return self.params.customHandlers;
        }
    },
    /*
    * Method to index renders
    */
    registerRender: function (render) {
        var self = this;

        self.rendersById[render.properties.id] = render;
        if (render.properties.xpath) {
            if (!self.rendersByXpath[render.properties.xpath]) {
                self.rendersByXpath[render.properties.xpath] = [];
            }
            self.rendersByXpath[render.properties.xpath].push(render);
        }

        if (!self.rendersByType[render.properties.type]) {
            self.rendersByType[render.properties.type] = [];
        }
        self.rendersByType[render.properties.type].push(render);
    },
    /*
    * Method to unregister render
    */
    unregisterRender: function (render) {
        var self = this;

        if (self.rendersById[render.properties.id]) {
            delete self.rendersById[render.properties.id];
        }

        if (render.properties.xpath) {
            if ($.isArray(self.rendersByXpath[render.properties.xpath])
                && self.rendersByXpath[render.properties.xpath].length > 1) {
                for (var i = 0, l = self.rendersByXpath[render.properties.xpath].length; i < l; i++) {
                    var element = self.rendersByXpath[render.properties.xpath][i];
                    if (element.properties.id === render.properties.id) {
                        self.rendersByXpath[render.properties.xpath].splice(i, 1);
                        break;
                    }
                }
            } else {
                delete self.rendersByXpath[render.properties.xpath];
            }
        }

        // Unregister from renders by type
        if (render.properties.type) {
            var listRendesByType = self.getRenderByType(render.properties.type);
            var listRendesByTypeLength = listRendesByType.length;
            var renderKey = render.properties.id || render.properties.xpath;

            for (var i = 0; i < listRendesByTypeLength; i++) {
                var listRender = listRendesByType[i];
                if ((typeof listRender.properties.id != "undefined" && listRender.properties.id == renderKey) ||
                (typeof listRender.properties.xpath != "undefined" && listRender.properties.xpath == renderKey)) {
                    // Unregister element
                    self.rendersByType[render.properties.type].splice(i, 1);
                    break;
                }
            }
        }
    },
    /*
    * Method to access a render by id
    */
    getRenderById: function (id) {
        var self = this;

        return self.rendersById[id];
    },
    /*
    *   Method to find all the renders matching an xpath inside the container
    */
    getRenders: function (xpath) {
        var self = this;

        // Remove [] filters for grid columns xpaths to fully identify the grid as the xpath target
        if (xpath && xpath.indexOf)
            if (xpath.indexOf("[") > 0) {
                xpath = xpath.substring(0, xpath.indexOf("["));
            }

        return self.rendersByXpath[xpath] ? self.rendersByXpath[xpath] : [];
    },
    /**
    * Get all render with the same type
    */
    getRenderByType: function (type) {
        var self = this;

        // Check that type is defined
        if (typeof type == "string" && type.length > 0) {
            // Search controls by type
            return (self.rendersByType[type]) ? self.rendersByType[type] : [];
        }
        return [];
    },

    /*
    *   Build the container html
    */
    renderContainer: function () {
        var self = this;
        var properties = this.properties;
        var template = self.renderFactory.getTemplate("form");
        var idCase = "";
        
        // Render the form
        var html = $.fasttmpl(template, {
            buttons: self.buttons,
            transitions: self.transitions,
            uniqueId: properties.uniqueId,
            helptext: properties.helpText,
            mode: self.getMode(),
            queryForm: self.getFormType() == "queryForm",
            summaryForm: self.params.summaryForm || false,
            globalForm: self.properties.displayAsReadOnly || false,
            // activityForm: self.properties.xpathContext != "",
            idCase: idCase,
            displayName: self.params.displayName || idCase,
            processPath: properties.processPath,
            breadCrumb: properties.breadCrumb,
            orientation: properties.orientation
        });

        // Render children
        html = self.replaceChildrenHtml(html, self.renderChildrenHtml());
        return html;
    },
    /*
    *   Process the html rendering object
    */
    postRenderContainer: function (form) {
        var self = this;
        var mode = self.getMode();

        // Add a mode class
        form.addClass("ui-bizagi-rendering-mode-" + mode);

        // Call base
        this._super(form);
    },
    /*
    *   Template method to implement in each device to customize the container's behaviour to add handlers
    */
    configureHandlers: function () {
        var self = this;
        var complexGatewayContainer;
        var form = self.container;

        if (form.length > 1) {
            $(form).each(function () {
                if ($(this).hasClass('ui-bizagi-container-complexgateway')) {
                    complexGatewayContainer = this;
                }
            });
        } else {
            complexGatewayContainer = $(".ui-bizagi-container-complexgateway", form);
        }

        // activeTransitions is used to store ids of activities in Complex Gateway
        self.activeTransitions = {};

        // Process buttons
        self.processButtons(form);
        // Check for dom included event
        self.bind("ondomincluded", function (e, mainForm) {
            // Creates validation controller after the form is ready
            self.validationController = new bizagi.command.controllers.validation(self, self.validations, mainForm);
            // Creates action controller after the form is ready
            self.actionController = new bizagi.command.controllers.action(self, self.actions);

            // Resolve this deferred to start executing DOM dependant plugins
            self.readyDeferred.resolve();
        });

        // Set events for complex gateway interface
        $(complexGatewayContainer).find(".ui-checkbox").bind("click", function () {
            var checkboxLabel = $("label", this);

            var transitionId = checkboxLabel.data("value") || "";
            if (typeof self.activeTransitions[transitionId] == "undefined") {
                self.activeTransitions[transitionId] = false;
            }

            if (bizagi.util.parseBoolean(checkboxLabel.data("checked"))) {
                // Uncheck element
                checkboxLabel.removeClass("ui-checkbox-state-checked");
                checkboxLabel.removeClass("bz-check").addClass("bz-full-ball");
                checkboxLabel.data("checked", false);
                self.activeTransitions[transitionId] = false;
            } else {
                // Check element
                checkboxLabel.addClass("ui-checkbox-state-checked");
                checkboxLabel.addClass("bz-mo-icon").addClass("bz-check").removeClass("bz-full-ball");
                checkboxLabel.data("checked", true);
                self.activeTransitions[transitionId] = true;
            }
        });       
    },
    /*
    *   Template method to implement in each device to customize the render's behaviour when rendering in design mode
    */
    configureDesignView: function () {
        var self = this;
        var form = self.container;

        // Check for dom included event
        self.bind("ondomincluded", function () {
            // Resolve this deferred to start executing DOM dependant plugins
            self.readyDeferred.resolve();
        });
    },
    /*
    *   Format form buttons to allow further customization
    */
    buildButtonStyle: function (button) {
        var self = this;
        var style = {};
        if (button.format) {
            if (button.format.size) {
                if (button.format.size != "0") {
                    var newFontSize = (100 + Number(button.format.size) * 10) + "%";
                    style["font-size"] = newFontSize + " !important";
                }
            }
            if (button.format.bold) {
                style["font-weight"] = "bold !important";
                if (bizagi.util.isIE()) {
                    style["font-family"] = "'Open Sans', 'Helvetica Neue', Arial, Helvetica, sans-serif !important";
                }
            }
            if (button.format.italic) {
                style["font-style"] = "italic !important";
            }
            if (button.format.underline || button.format.strikethru) {
                var strikethru = bizagi.util.parseBoolean(button.format.strikethru) ? "line-through " : "";
                var underline = bizagi.util.parseBoolean(button.format.underline) ? "underline " : "";
                style["text-decoration"] = strikethru + underline + " !important";
            }
            if (button.format.background) {
                style["background-color"] = button.format.background + " !important";
                style["background-image"] = "none !important";
            }
            if (button.format.color) {
                style["color"] = button.format.color + " !important";
            }
        }

        var strStyle = "";
        for (key in style) {
            strStyle += key + ":" + style[key] + ";";
        }
        return strStyle;
    },
    /*
    *   Returns the in-memory processed element
    *   Returns a promise
    */
    render: function () {
        var self = this;

        // Creates a deferred, so we can check when form has been included in dom
        if (!self.readyDeferred)
            self.readyDeferred = new $.Deferred();

        // Call base
        var result = this._super();

        return result;
    },
    /*
    *   Sets a promise that the form will be included in the DOM
    *   so we can apply some tedious plugins that require that
    */
    ready: function () {
        var self = this;

        return self.readyDeferred.promise();
    },
    /*
    *   Returns the xpath context of the element
    */
    getXpathContext: function () {
        return this.properties.xpathContext || "";
    },
    /*
    *  Return context type, when the parent form is entity
    */
    getContextType: function () {
        return this.properties.contexttype || "";
    },

    /*
    * Return the endpoint action, when the form will be refresh
    */
    getEndPointAction: function () {
        var self = this,
            properties = self.properties;

        if (properties.formtype == "startform")
            return "LOADSTARTFORM";

        return undefined;

    },

    /*
    *   Returns the page cache id for the element
    */
    getPageCache: function () {
        return this.idPageCache;
    },
    /*
    *   Returns the form containing the element
    */
    getFormContainer: function () {

        return this;
    },
    /*
    *   Method to process button actions in the form
    */
    processButtons: function () {
        var self = this;
        var buttons = self.getButtons();

        // Don't process buttons if they are undefined in the template
        if (!buttons || buttons.length == 0) {
            return;
        }

        // Attach a handler for each button
        buttons.on("click", function (e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            self.startLoading();
            var button = $(this);
            var ordinal = button.attr("ordinal");
            var buttonProperties = self.buttons[ordinal];

            self.lastActionButton = buttonProperties;

            // Execute button
            //QAF-1418 - add setTimeout
            setTimeout(function () {
                $.when(self.processButton(buttonProperties)).always(function () {
                    self.processDefer = undefined;
                    self.endLoading();
                })
            }, 100);
        });
    },
    /*
    * Execute codes just before sending information to server
    */
    preProcessButton: function (buttonProperties) {
        return true;
    },
    /*
    * Execute codes just after sending information to server
    */
    postProcessButton: function (responses, buttonProperties) {
        return true; // true means continue
    },
    /*
    *   Executes a single button action
    */
    processButton: function(buttonProperties) {
        var self = this;
        var defer = $.Deferred();
        var properties = self.properties;
        if (!buttonProperties.routing) {
            bizagi.chrono.initAndStart("submitForm");
        }
        bizagi.chrono.init("waiting");

        // First hide and clear validation box
        self.validationController.clearValidationMessages();

        // Resolve asynchronous tabItems
        var form = self.getFormContainer();
        var asyncTabsDef = $.Deferred();
        var getAllTabs = form.getRenderByType("tabItem");
        var getAllTabsLength = getAllTabs.length;

        form.innerTabsLoading = true;

        // Check
        for (var i = 0; i < getAllTabsLength; i++) {
            var render = getAllTabs[i];
            // Resolve internal deferred
            if (render.loadingDeferred && render.parent.container) {
                render.loadingDeferred.resolve();
            }
        }

        delete form.innerTabsLoading;
        // Resolve task deferred
        asyncTabsDef.resolve();


        $.when(self.ready(), asyncTabsDef.promise()).done(function() {
            // Validate the form
            var valid = bizagi.util.parseBoolean(buttonProperties.validate)
                ? self.validationController.performValidations() : true;
            if (valid) {

                if (buttonProperties.action === "save" || buttonProperties.action == "next"
                    || buttonProperties.action == "back" || buttonProperties.action == "createnewcase") {
                    $(document).data('auto-save', '');
                }

                // Check for user confirmation if configured and the button is configured to enroute
                if (bizagi.util.parseBoolean(self.properties.needsUserConfirmation) && bizagi.util.parseBoolean(buttonProperties.routing)) {
                    self.endLoading();
                    $.when(bizagi.showConfirmationBox(properties.userConfirmationMessage, null, false)).done(function () {
                        // Submits the form
                        if (self.preProcessButton(buttonProperties)) {
                            //Trigger the event after ProcessButton
                            self.triggerGlobalHandler("renderActionButton", buttonProperties);
                            $.when(self.submitForm(buttonProperties)).done(function(){
                                defer.resolve();
                            });
                        }
                    });

                } else {
                    if (self.preProcessButton(buttonProperties)) {
                        //Trigger the event after ProcessButton
                        self.triggerGlobalHandler("renderActionButton", buttonProperties);
                        $.when(self.submitForm(buttonProperties)).done(function(){
                            $(document).trigger("FORMACTION",buttonProperties);
                            defer.resolve();
                        }).fail(function () {
                            defer.reject(arguments);
                        });
                    }
                }

            } else {

                self.endLoading();
                if (buttonProperties.submitData) {
                    $.when(self.submitData()).done(function(){
                        defer.reject();
                    });
                }

                self.validationController.expandNotificationBox();
            }

            var customHandler = self.getCustomHandler("afterFormButtonClick");
            if (customHandler) {
                customHandler(buttonProperties);
            }
        });

        return defer.promise();
    },
    /*
    *   Public method to perform validations externally
    */
    validateForm: function () {
        var self = this;

        // First hide and clear validation box
        self.validationController.clearValidationMessages();

        // Validate the form
        return self.validationController.performValidations();
    },
    /*
    *   Submits all the form to the server and returns a deferred to check when the process finishes
    */
    saveForm: function () {
        var self = this;        

        // Check is offline form        
        var isOfflineForm = bizagi.util.isOfflineForm({ context: self });

        // Collect data
        var data = self.collectRenderValuesForSubmit();

        // Check if there are deferreds to wait
        var deferredsToWait = null;
        if (data.deferreds) {
            deferredsToWait = $.when.apply($, data.deferreds);
            delete data.deferreds;
        }

        // Wait for deferreds
        return $.when(deferredsToWait).pipe(function () {
            self.startLoading();

            // Submit the form
            return self.dataService.submitData({
                action: "SAVE",
                data: data,
                idCase: self.params.idCase,
                xpathContext: self.properties.xpathContext,
                idPageCache: self.properties.idPageCache,
                isOfflineForm: isOfflineForm || false
            }).pipe(function() {
                self.endLoading();
            });
        });
    },
    /*
    *   Creates a json array with key values to send to the server
    */
    submitForm: function(buttonProperties) {
        var self = this;
        var defer = $.Deferred();
	
        // Check is offline form                
        var isOfflineForm = bizagi.util.isOfflineForm({ context: self });

        $.when(self.isReadyToSave())
            .done(function() {
                if (isOfflineForm) {
                    self.internalSubmitFormOffline(buttonProperties);
                    return;
                }
                $.when(self.internalSubmitForm(buttonProperties)).done(function() {
                    defer.resolve();
                }).fail(function () {
                    defer.reject(arguments);
                });

            }).fail(function() {
                self.endLoading();
                bizagi.log("The form is not saved, no changes were found");
                defer.reject();
            });
        return defer.promise();
    },
    checkWidgetsData: function () {
        //
    },
    isComplexGatewayPainted: function () {
        return false;
    },

    /**
     * Get last action button
     * @returns {*}
     */
    getLastActionButton: function(){
        var self = this;
        return self.lastActionButton;
    },

    /**
     * Internal - Creates a json array with key values to send to the database
     * @param {} buttonProperties 
     * @returns {} 
     */
    internalSubmitFormOffline: function(buttonProperties) {
        var self = this;        
        var message = "";
        var data;

        // Check is offline form                
        var isOfflineForm = bizagi.util.isOfflineForm({ context: self });

        if (isOfflineForm && (self.properties && !self.properties.idPageCache)) {
            self.properties.idPageCache = "";
        }

        // Fill data hash
        if (buttonProperties.submitData || buttonProperties.executeRule) {
            // Collect data
            data = self.collectRenderValuesForSubmit();
        }

        if (self.transitions) {
            var transitions = [];
            $.each(this.activeTransitions, function(key, value) {
                (value) ? transitions.push(key) : "";
            });

            if (bizagi.util.countProps(transitions) == 0) {
                bizagi.showMessageBox(bizagi.localization.getResource("render-widget-complexgateway-path"),
                    bizagi.localization.getResource("render-widget-complexgateway-error"), "info", false);
                self.endLoading();
                return "";
            }
        }

        $.when(self.dataService.submitData({
            action: buttonProperties.action,
            data: data,
            xpathContext: self.properties.xpathContext,
            idPageCache: self.properties.idPageCache,
            prepare: true,
            transitions: transitions || "",
            idCase: self.params.idCase,
            idWorkitem: self.params.idWorkitem,
            isOfflineForm: isOfflineForm || false
        })).done(function(responses) {

            if (!self.postProcessButton(responses, buttonProperties)) {
                return;
            }

            if (buttonProperties.routing) {
                self.triggerHandler("routing", {
                    offlineAction: buttonProperties.action,
                    idCase: self.params.idCase,
                    idWorkitem: self.params.idWorkitem
                });

                $(document).trigger("tryPushData.offline");
            } else {
                message = bizagi.util.isValidResource("workportal-mobile-offline-form-successful")
                    ? bizagi.localization.getResource("workportal-mobile-offline-form-successful")
                    : "Saved";

                bizagi.util.showNotification({ text: message, type: "success" });
            }

        }).fail(function(error) {
            message = bizagi.util.isValidResource("workportal-mobile-offline-successful-fail")
                ? bizagi.localization.getResource("workportal-mobile-offline-successful-fail")
                : "Not saved";

            bizagi.util.showNotification({ text: message, type: "error" });
        });
    },

    /*
    *   Internal - Creates a json array with key values to send to the server
    */
    internalSubmitForm: function (buttonProperties) {
        var self = this;
        var defer = $.Deferred();
        var data;

        // Fill data hash
        if (buttonProperties.submitData || buttonProperties.executeRule || buttonProperties.createnewcase) {
            // Collect data
            data = self.collectRenderValuesForSubmit();
        }

        // Start asynchronous operation
        $.when(self.startLoading()).done(function () {
            $('html, body').animate({ scrollTop: $('.ui-bizagi-loading-icon') }, 'slow');
        });

        var submitDataAction = null, executeButtonAction = null, performAction = null;

        // Prepare actions
        if (buttonProperties.executeRule) {  // When the button has to execute any rule (MUST SUBMIT DATA BEFORE ALWAYS)
            submitDataAction = self.dataService.submitData({
                action: "SUBMITDATA",
                data: data,
                xpathContext: self.properties.xpathContext,
                idPageCache: self.properties.idPageCache,
                prepare: true
            });
            submitDataAction.tag = "submitData";

            // Reset data because when an execute rule operation has been performed, it saved already all the data
            data = {};
            executeButtonAction = self.dataService.executeButton({
                idRender: buttonProperties.id,
                xpathContext: self.properties.xpathContext || "",
                idPageCache: self.properties.idPageCache,
                prepare: true
            });
            executeButtonAction.tag = "executeRule";
        }

        if (buttonProperties.next || buttonProperties.back || buttonProperties.save
            || buttonProperties.createnewcase) { // When the button has to do next or back

            // Verify transitions
            if (self.transitions) {
                var transitions = [];
                $.each(this.activeTransitions, function(key, value) {
                    (value) ? transitions.push(key) : "";
                });

                if (bizagi.util.countProps(transitions) == 0) {
                    bizagi.showMessageBox(bizagi.localization.getResource("render-widget-complexgateway-path"), bizagi
                        .localization.getResource("render-widget-complexgateway-error"), "info", false);
                    self.endLoading();
                    return "";
                }
            }

            performAction = self.dataService.submitData({
                action: buttonProperties.action,
                forcePlanCompletion: buttonProperties.forcePlanCompletion,
                data: data,
                xpathContext: self.properties.xpathContext,
                idPageCache: self.properties.idPageCache,
                prepare: true,
                transitions: transitions || "",
                contexttype : self.properties.contextType,
                surrogatekey : self.properties.surrogateKey
            });
            performAction.tag = "performAction";
        }

        // Assemble the actions
        var actions = [];

        if (executeButtonAction) {
            actions.push(submitDataAction);
            actions.push(executeButtonAction);
        }

        if (performAction) {
            actions.push(performAction);
        }

        // Execute the batch
        bizagi.chrono.initAndStart("submitForm-ajax");
        $.when(self.dataService.multiaction().execute({ actions: actions })).done(function (responses) {
            bizagi.chrono.stop("submitForm-ajax");
            // End asynchronous operation
            self.endLoading();

            // Find validations
            var bHasValidations;
            $.each(responses, function (i, response) {
                if (response.result.type == "validationMessages") {
                    // Something went wrong, we gotta display messages in notifications grid
                    self.addValidationMessage(response.result.messages);
                    bHasValidations = true;
                }
            });

            if (!bHasValidations) {
                // Everything went ok .. succesfully response from the server
                if (!self.postProcessButton(responses, buttonProperties)) {
                    return;
                }

                // After successfully response refresh the form
                if (buttonProperties.refresh) {
                    self.refreshForm();
                }

                // If needs routing publish an event
                if (buttonProperties.routing) {
                    self.triggerHandler("routing", {
                        idCase: self.params.idCase
                    });
                }

                // Create case
                if (buttonProperties.createnewcase) {
                    if (responses.length > 0) {
                        self.triggerHandler("routing", {
                            idCase: responses[0].result.IdCase,
                            caseNumber: responses[0].result.CaseNumber
                        });
                    }
                }
            }
            defer.resolve();
        }).fail(function (_, _, response) {
            if (response && response.error && (response.error.errorType === "WaitForCompletionPlanException" || 
                response.error.errorType === "InvalidPlanStateException" || response.error.errorType === "CustomMessageException")) {
                self.endLoading();
                $.when(bizagi.showConfirmationBox(bizagi.localization.getResource(response.error.message), null, false)).then(function () {
                    return $.when(self.internalSubmitForm($.extend({}, buttonProperties, {forcePlanCompletion: true})));
                }).done(function(){
                    defer.resolve();
                }).fail(function(){
                    defer.reject();
                });
            } else {
                self.failHandler(response);
                defer.reject(response);
            }
        });
        return defer.promise();
    },

    /*
    *   Add a validation message to the form
    */
    addValidationMessage: function (validationMessage, focus, icon, itemAdditionalClass, autofocus) {
        var self = this;

        if (!self.validationController) {
            self.validationController = new bizagi.command.controllers.validation(self);
        }

        if (typeof (validationMessage) == "string") {
            self.validationController.showValidationMessage(validationMessage, focus, icon, itemAdditionalClass);
        } else {
            $.each(validationMessage, function (i, message) {
                self.validationController.showValidationMessage(message);
            });
        }
        self.validationController.expandNotificationBox(autofocus);
    },
    /*
    *   Public method to perform validations externally
    */
    clearValidationMessages: function () {
        var self = this;

        // First hide and clear validation box
        if (self.validationController) {
            self.validationController.clearValidationMessages();
        }

    },
    /*
    *   Add an error message to the form
    */
    addErrorMessage: function (errorMessage) {
        var self = this;

        self.validationController.showErrorMessage(errorMessage);
        self.validationController.expandNotificationBox();
    },
    /*
    *   Refresh the current form
    */
    refreshForm: function (focus) {
        var self = this;
        var properties = self.properties;
        var deferred = $.Deferred();

        focus = focus || self.getFocus();

        // Normalize new focus structure if not present
        if (focus && !focus.id) {
            focus = {
                id: focus
            };
        }

        var options = {
            idCase: self.params.idCase || "",
            idWorkitem: self.params.idWorkitem || "",
            idTask: self.params.idTask || "",
            focus: focus,
            selectedTabs: self.getSelectedTabs(),
            xpathContext: properties.xpathContext,
            idPageCache: properties.idPageCache,
            isRefresh: true,
            contextType: self.getContextType() || "",
            action: self.getEndPointAction(),
            idStartScope: self.properties.idStartScope || ""
        };

        // Notify the refresh event so the consumer takes the decision about what to do
        self.startLoading();
        $.when(self.triggerHandler("refresh", options)).done(function () {
            self.endLoading();
            deferred.resolve();
        }).fail(function () {
            self.endLoading();
            deferred.reject();
        });
        return deferred.promise();
    },
    /*
    *   Get opened tabs configuration
    */
    getSelectedTabs: function () {
        var self = this;
        var tabContainers = self.getElementsByType("tab");
        var tabs = $.map(tabContainers, function (tabContainer) {
            return { tab: tabContainer.properties.id, selected: tabContainer.activeTab };
        });
        var selectedTabs = {};
        for (var i = 0, length = tabs.length; i < length; i++) {
            selectedTabs[tabs[i].tab] = tabs[i].selected;
        }
        return selectedTabs;
    },
    /*
    *   Template method to get the buttons objects
    */
    getButtons: function () {
    },
    /*
    *   Adds an action on the fly to process the submit on change
    */
    addSubmitAction: function (xpath, action) {
        var self = this;
        self.actionController.processInternalSubmitAction(xpath, action);
    },
    /**
    *   Adds an overlay to the form, and sets a waiting message
    *
    *   @argument {bool} delay Apply delay
    */
    startLoading: function () {
        var self = this;
        var waitingTemplate = self.renderFactory.getTemplate("form-waiting");

        if (self.waitingOverlay && self.waitingMessage)
            return;

        // This hack is only for desktop
        if (!bizagi.util.isTabletDevice()) {
            // Detect canvas parent with scroll
            var isSharePoint = (self.params.context == "sharepoint" && typeof Windows === "undefined");
            var canvas = self.params.canvas;
            if (isSharePoint) {
                canvas = bizagi.util.scrollTop(canvas);

                if (!!!canvas.context) {
                    canvas = $("body", $(document));
                }
            } else {
                canvas = $("body", $(document));
            }

            // Configures overlay
            var size = this.getSize();
            var position = this.getOffset();
            if (size.height == $(window).height()) {
                position.top = 0;
            }
            self.waitingOverlay = $('<div class="ui-widget-overlay" />').appendTo(canvas);
            self.waitingMessage = $.tmpl(waitingTemplate).appendTo(canvas);
            self.waitingOverlay.css({
                "height": "100%",
                "width": "100%",
                "min-height": size.height,
                "min-width": size.width
            });
            self.waitingMessage.css({
                "top": (position.top + Math.ceil((size.height - self.waitingMessage.outerHeight()) / 2)) + "px",
                "left": (Math.ceil((size.width - self.waitingMessage.outerWidth()) / 2)) + "px"
            });
            canvas.css("position", "relative");

        } else {
            // Configures overlay
            self.waitingOverlay = $('<div class="ui-widget-overlay" />').appendTo("body", $(document));
            self.waitingMessage = $.tmpl(waitingTemplate).appendTo("body", $(document));
        }
    },
    /*
    *   Removes the overlay and restores the form edition
    */
    endLoading: function () {
        var self = this;
        if (self.waitingOverlay && self.waitingMessage) {
            self.waitingOverlay.remove();
            self.waitingMessage.remove();
            self.waitingOverlay = null;
            self.waitingMessage = null;

            var canvas = self.params.canvas;

            if (canvas != undefined)
                canvas.css("position", "");
        }
    },
    /*
    *   Get the focused render in the current request
    */
    getFocusedElement: function () {
        var self = this;
        return self.focus;
    },
    /*
    *   Set the focused render in the current request
    */
    setFocusedElement: function (focus) {
        var self = this;
        self.focus = focus;
    },
    /*
    *   Publish a global event that the facade will replicate
    */
    triggerGlobalHandler: function (eventType, data) {
        return this.triggerHandler("globalHandler", { eventType: eventType, data: data });
    },
    /*
    *   Generic handler to attach fail workflow for some operations
    */
    failHandler: function (error) {
        var self = this;

        // Check if the error is in multiaction format
        try {
            error = JSON.parse(error);
        } catch (e) {
        }
        if (error.length && error.length > 1) error = error[0];
        if (error.error) error = error.error

        // Handle normal messages
        if (typeof error == "object" && error.message) {
            if(error.errorType === "WaitForCompletionPlanException" || error.errorType === "InvalidPlanStateException" || error.errorType === "CustomMessageException"){
               error = bizagi.localization.getResource(error.message);
            }
            else{
                error = error.message;
            }

        } else if (typeof error == "string") {
            // Parse to json
            try {
                var errorJson = JSON.parse(error);
                if(errorJson.errorType === "WaitForCompletionPlanException" || errorJson.errorType === "InvalidPlanStateException" || error.errorType === "CustomMessageException"){
                    errorJson.message = bizagi.localization.getResource(errorJson.message);
                }
                error = errorJson.message;
            } catch (e) {
            }
        }

        // Workflow engine error, we gotta show it with error
        self.addErrorMessage(error);
        self.endLoading();
    },
    /* 
    *   Resizes the element
    */
    resize: function (size) {
        // Just save the size, for reference
        this.setSize(size);
    },
    /*
    *   Sets the internal size for the form
    */
    setSize: function (size) {
        this.size = size;
    },
    /*
    *   Gets the internal size for the form
    */
    getSize: function () {
        if (this.size) {
            return this.size;
        }
        var canvas = (this.params.canvas) ? this.params.canvas : this.getFormContainer().container;

        var canvasWidth = canvas.width();
        var canvasHeight = canvas.height();

        return {
            width: canvasWidth,
            height: canvasHeight
        };
    },
    getOffset: function () {
        var canvas = this.getFormContainer().container;

        return canvas.offset();
    },
    /**
    * This function execute action to save all data of render, but
    * the server service dont execute any rule on the server
    */
    submitData: function (args) {
        var self = this;        
	
        // Collect data
        var data = self.collectRenderValuesForSubmit();

        // Check is offline form        
        var isOfflineForm = bizagi.util.isOfflineForm({ context: self });

        if (isOfflineForm && (self.properties && !self.properties.idPageCache)) {
            self.properties.idPageCache = "";
        }

        // Mark data collected as original values
        $.each(data, function (key, value) {
            var renders = self.getRenders(key);
            $.each(renders, function (i, render) {
                render.updateOriginalValue();
            });
        });

        // Don't do anything if there is no data
        if ($.isEmptyObject(data)) {
            return;
        }
        
        // Call the service
        return $.when(self.dataService.multiaction().submitData({
            action: "SUBMITDATA",
            data: data,
            idPageCache: self.properties.idPageCache,
            xpathContext: self.properties.xpathContext,
            contexttype: self.properties.contexttype || ""
        })).fail(function (message) {
            message = self.processFailMessage(message);
        });
    },
    /**
    * This function send a request to the server to execute a rule
    */
    executeRule: function (args) {
        var self = this;
        var properties = self.properties;
        var xpathContext = args.xpathContext;

        if (properties.xpathContext != "") {
            // Concat inheritance context
            xpathContext = (xpathContext != "") ? properties.xpathContext + "." + xpathContext : properties.xpathContext;
        }


        // Perform the service
        return $.when(self.dataService.multiaction().executeRule({
            idPageCache: properties.idPageCache,
            rule: args.rule,
            xpathContext: xpathContext,
            contexttype: self.properties.contexttype || ""
        })).done(function (message) {
            // Check for validation messages
            self.getFormContainer().clearValidationMessages();
            if (message && message.type == "validationMessages") {
                self.getFormContainer().addValidationMessage.apply(self, [message.messages, undefined, undefined, undefined, false]);
            }

        }).fail(function (message) {
            message = self.processFailMessage(message);
        });
    },
    /**
    * This function send a request to the server to execute an interface
    */
    executeInterface: function (args) {
        var self = this;
        var properties = self.properties;
        var xpathContext = args.xpathContext;

        if (properties.xpathContext != "") {
            // Concat inheritance context
            xpathContext = (xpathContext != "") ? properties.xpathContext + "." + xpathContext : properties.xpathContext;
        }

        // Perform the service
        return $.when(self.dataService.multiaction().executeInterface({
            idPageCache: properties.idPageCache,
            interface: args.interface,
            xpathContext: xpathContext,
            contexttype: self.properties.contexttype || ""
        })).done(function (message) {
            // Check for validation messages
            self.getFormContainer().clearValidationMessages();
            if (message && message.type == "validationMessages") {
                self.getFormContainer().addValidationMessage(message.messages);
            }

        }).fail(function (message) {
            message = self.processFailMessage(message);
        });
    },
    executeSAPConnector: function (args) {
        var self = this;
        var properties = self.properties;
        var xpathContext = args.xpathContext;

        if (properties.xpathContext != "") {
            // Concat inheritance context
            xpathContext = (xpathContext != "") ? properties.xpathContext + "." + xpathContext : properties.xpathContext;
        }

        // Perform the service
        return $.when(self.dataService.multiaction().executeSAPConnector({
            idPageCache: properties.idPageCache,
            guidsap: args.guidsap,
            xpathContext: xpathContext,
            contexttype: self.properties.contexttype || ""
        })).done(function (message) {
            // Check for validation messages
            self.getFormContainer().clearValidationMessages();
            if (message && message.type == "validationMessages") {
                self.getFormContainer().addValidationMessage(message.messages);
            }

        }).fail(function (message) {
            message = self.processFailMessage(message);
        });

    },

    executeConnector: function (args) {
        var self = this;
        var properties = self.properties;
        var xpathContext = args.xpathContext;

        if (properties.xpathContext != "") {
            // Concat inheritance context
            xpathContext = (xpathContext != "") ? properties.xpathContext + "." + xpathContext : properties
                .xpathContext;
        }

        // Perform the service
        return $.when(self.dataService.multiaction().executeConnector({
            idPageCache: properties.idPageCache,
            guidConnector: args.guidConnector,
            xpathContext: xpathContext,
            contexttype: self.properties.contexttype || ""
        })).done(function (message) {
            // Check for validation messages
            self.getFormContainer().clearValidationMessages();
            if (message && message.type == "validationMessages") {
                self.getFormContainer().addValidationMessage(message.messages);
            }

        }).fail(function (message) {
            message = self.processFailMessage(message);
        });

    },

    /*
    *   Re-binds pending actions that could not be set because the renders did not exist when the form loaded
    */
    refreshActions: function (actions) {
        var self = this;
        self.actionController.refreshActions(actions);
    },
    /*
    *   Re-binds pending actions that could not be set because the renders did not exist when the form loaded
    */
    removeActions: function () {
        var self = this;
        self.actionController.unbindActions();
    },
    /*
    *   Iterate through all renders and collect the data to send, then update original values for each render
    */
    collectRenderValuesForSubmit: function (data) {
        var self = this;
        data = data || {};

        // Collect data
        self.collectRenderValues(data);

        // Mark data collected as original values
        $.each(data, function (key, value) {
            var renders = self.getRenders(key);
            $.each(renders, function (i, render) {
                render.updateOriginalValue();
            });
        });

        return data;
    },

    /**
    *
    * @param params {data, bRefreshForm,properties}
    * @returns {*}
    */
    internalSubmitOnChange: function (params) {
        params = params || {};
        var self = this, idCase;
        var properties = params.properties;
        // var form = self.getFormContainer();
        var defer = new $.Deferred();
        var data = params.data || {};
        var bRefreshForm = typeof (params.bRefreshForm) != "undefined" ? params.bRefreshForm : true;
        var notCollect = params.notCollect ? params.notCollect : undefined;

        // Collect data
        if (!(notCollect && !$.isEmptyObject(data))) {
            self.collectRenderValuesForSubmit(data);
        }
        self.startLoading();

        //idCase = self.getCacheIdCase();

        var deferredsToWait = null;
        if (data.deferreds) {
            deferredsToWait = $.when.apply($, data.deferreds);
            delete data.deferreds;
        }

        $.when(deferredsToWait).then(function () {
            // Submit the form
            self.dataService.submitData({
                action: "SUBMITONCHANGE",
                data: data,
                idRender: properties.id,
                xpath: properties.xpath,
                xpathContext: self.properties.xpathContext,
                idPageCache: properties.idPageCache,
                contexttype: properties.contexttype
            }).done(function (response) {
                // Cancel previous multiactions and process property value
                self.cancelPreviousRequest();
                // After successfully response refresh the form
                self.endLoading();
                // If response message has error in validation, do not refresh the form
                // and show validation message
                if (response && response.type == "validationMessages") {
                    if (typeof self.clearValidationMessages == "function") {
                        self.clearValidationMessages();
                    }

                    self.addValidationMessage(response.messages);
                    defer.resolve();
                } else if (bRefreshForm) {
                    var focusIdentifier = {
                        id: properties.id,
                        xpath: properties.xpath
                    };
                    if (properties.idCase !== undefined) {
                        $.extend(focusIdentifier, {
                            idCaseObject: bizagi.cache.idCaseObject
                        });
                    }
                    if (response.IdScope) {
                        self.properties.idStartScope = response.IdScope;
                    }
                    $.when(self.refreshForm(focusIdentifier)).done(function() {
                        defer.resolve();
                    }).fail(function() {
                        defer.resolve();
                    });
                } else {
                    defer.resolve();
                }
            }).fail(function(message) {
                self.endLoading();
                var objMessage = JSON.parse((typeof message == 'object' && message.responseText) ? message.responseText : {}) || {};
                var strMessage = objMessage.message || message;
                // Clear previous validations
                self.validationController.clearValidationMessages();
                if (objMessage.type == "alert") {
                    self.validationController.showAlertMessage(strMessage);
                } else {
                    self.validationController.showErrorMessage(strMessage);
                }
                defer.resolve();
            });
        });

        return defer.promise();
    },

    cancelPreviousRequest: function () {
        if (bizagi.multiactionConnection && bizagi.multiactionConnection.length) {
            var length = bizagi.multiactionConnection.length;
            var i = 0, connection;
            for (; i < length; i++) {
                connection = bizagi.multiactionConnection.pop();
                if (connection && connection.abort) {
                    bizagi.showErrorAlertDialog = false;
                    connection.abort();
                }
            }
        }
    },

    dispose: function () {
        var self = this;
        self.endLoading();

        setTimeout(function () {
            if (self.params) {
                delete self.params.canvas;
            }
            delete self.params;
            delete self.control;
            if (self.validationController) {
                self.unbind("rendervalidate");
                delete self.validationController;
            }

            if (self.actionController) {
                self.actionController.unbindActions();
                delete self.actionController;
            }
        }, bizagi.override.disposeTime || 50);

        // Call base
        self._super();
    },
    getButton: function (guid) {
        var self = this;
        return $(".ui-bizagi-button[data-id='"+guid+"']",self.container);
    }
});
