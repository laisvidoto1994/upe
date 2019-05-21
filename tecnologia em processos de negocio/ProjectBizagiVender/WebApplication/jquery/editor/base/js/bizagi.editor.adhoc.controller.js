/*
*   Name: BizAgi FormModeler Editor Controller
*   Author: Alexander Mejia, Diego Parra
*   Comments:
*   -   This script will define basic stuff for main controller
*/
bizagi.editor.base.controller.extend("bizagi.editor.adhoc.controller", {}, {

    /*
    *   Initialize all models
    */
    initModels: function (params) {
        var self = this,
            definitions,
            xpathNavigatorInitialModel,
            layoutNavigatorModel,
            languages;

        self.adhocProcessId = params.adhocProcessId;

        var availableLanguages = self.communicationProtocol.createProtocol({ protocol: "availablelanguages" });
        var controlsDefinitions = self.communicationProtocol.createProtocol({ protocol: "getcontrolsdefinitions" });
        var firstLoad = self.communicationProtocol.createProtocol({ protocol: "getfirstload", adhocProcessId: params.adhocProcessId });
        var layoutDefinitions = self.communicationProtocol.createProtocol({ protocol: "getlayoutsdefinitions" });
        
        // Read definitions and xpath navigator first load models
        $.when(controlsDefinitions.processRequest())
            .pipe(function (controlDefinitions) {
                definitions = controlDefinitions;
                return firstLoad.processRequest()
            })
            .pipe(function (firstLoad) {
                xpathNavigatorInitialModel = firstLoad;
                xpathNavigatorInitialModel.context = "adhocform"
                return layoutDefinitions.processRequest()
            })
            .pipe(function (layout) {
                layoutNavigatorModel = layout;
                return availableLanguages.processRequest()
            })
            .done(function (lang) {
                languages = lang;

                $.when(bizagi.localization.ready())
    	            .done(function () {
    		            // Initialize models
    		            var componentModels = self.componentModels = {};

    		            // holds a reference to controls
    		            var controls = componentModels["controls"] = new bizagi.editor.controls(definitions);

    		            bizagi = bizagi || {};
    		            bizagi.editor = bizagi.editor || {};
    		            bizagi.editor.flags = {};
                        
    		            // Rendering model
    		            self.model = new bizagi.editor.model({
    		                definitions: definitions,
    		                controls: controls,
    		                context: params.context,
    		                contextentity: null,
    		                scopedefinition: null,
    		                isActivityForm: false,
    		                hasOfflineForm: false,
    		                isOfflineAsOnline: false,
    		                version: "1.0",
    		                languages: languages,
    		                flags: []
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

    		            // Resolve ready deferred
    		            self.readyDefer.resolve();
    	            });
            });
    },

    /*
    * Gets current xpath navigator model for grid context
    */
    getAdhocXpathNavigatorModelGrid: function () {
        var self = this;
        var defer = new $.Deferred();
        var getNodes = self.communicationProtocol.createProtocol({
            protocol: "getchildrennodes", node: {
                entityContext: "adhocgrid",
                guidRelatedEntity: self.adhocProcessId,
                xpathAdhoc: self.contextInfo.xpathAdhoc
            }
        });

        // Fetch children
        $.when(getNodes.processRequest()).done(function (data) {
            // Create model
            var subModel = new bizagi.editor.component.xpathnavigator.model(data);
            defer.resolve(subModel);
        });
        return defer.promise();
    }

})
