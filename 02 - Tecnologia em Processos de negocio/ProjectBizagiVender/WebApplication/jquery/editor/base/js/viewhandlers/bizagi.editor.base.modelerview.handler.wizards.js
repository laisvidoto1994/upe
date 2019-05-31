            /*
*   Name: BizAgi Form Modeler Control Wizard Handlers
*   Author: Diego Parra
*   Comments:
*   -   This script will handler modeler view wizard control handlers
*/
bizagi.editor.modelerView.extend("bizagi.editor.modelerView", {}, {

    /*
    *   Shows a wizard for a control when needed
    */
    showControlWizard: function (params) {
        var self = this;

        // Create wizard presenter
        var wizardPresenter = self.wizardPresenter = new bizagi.editor.wizard.presenter();

        // Prepare params for each wizard
        self.prepareWizardParams(params);

        params.isGridContext = self.controller.isGridContext();
        if (params.isGridContext) params.gridContextXpath =  self.controller.getContextXpath({});

        // Renders wizard
        return wizardPresenter.show(params);
    },

    /*
    *   Prepare the wizard params for each control type 
    */
    prepareWizardParams: function (params) {
        var self = this;

        if (params.control == "cascadingcombo") {
            params.xpathModel = self.controller.getXpathNavigatorModel();
        }
        else if (params.control == "association") {
            self.wizardPresenter.subscribe("showXPathNavigatorEditor", function (ev, args) { return self.onShowXpathNavigatorEditor(args); });
            self.wizardPresenter.subscribe("getMultipleRelationship", function (ev, args) { return self.onGetMultipleRelationship(args); });
            self.wizardPresenter.subscribe("getXpathData", function (ev, args) { return self.onGetXpathData(args); });
            self.wizardPresenter.subscribe("setLocalization", function (ev, args) { return self.onSetLocalization(args); });
        }
        else if (params.control == "searchlist") {
            self.wizardPresenter.subscribe("showXPathNavigatorEditor", function (ev, args) { return self.onShowXpathNavigatorEditor(args); });
            self.wizardPresenter.subscribe("getMultipleRelationship", function (ev, args) { return self.onGetSimpleRelationship(args); });
            self.wizardPresenter.subscribe("getXpathData", function (ev, args) { return self.onGetXpathData(args); });
            self.wizardPresenter.subscribe("setLocalization", function (ev, args) { return self.onSetLocalization(args); });
            self.wizardPresenter.subscribe("changelabel", function (ev, args) { self.onElementChangeLabel(args); });
        }
    },

    /*************************************************************************************************** 
    *   EVENT TYPE HANDLERS
    *****************************************************************************************************/

    /*
    * Activates when an xpath is required
    */
    onShowXpathNavigatorEditor: function (args) {
        var self = this;
        var defer = new $.Deferred();
        var serviceXpathNavigator;

        self.editorValidations = self.editorValidations || { };
        var types = args.filter && args.filter.types;
        types = types || [];
        self.editorValidations[args.xpathProperty] = { typeEditor: args.typeEditor, editorParameters: { types: types} };

        (self.controller.isGridContext()) ? serviceXpathNavigator = self.controller.getXpathNavigatorModelGrid({ context: args.entity }) : serviceXpathNavigator = self.controller.getXpathNavigatorModel({ context: args.entity });

        // Fetch model (we can use a given model, else we need to fetch the main xpath model)
        $.when(serviceXpathNavigator)
            .done(function (model) {
                var presenter = new bizagi.editor.component.xpathnavigator.presenter({ model: model });

                // Define handlers
                presenter.subscribe("nodeDoubleClick", function (_, xpathData) {

                    var valid = self.validateXpathChange(args.xpathProperty, args.xpathProperty, xpathData);
                    if (!valid) return;
                    // Close control
                    presenter.closePopup();
                    defer.resolve(xpathData);
                });

                // Show xpath navigator and locate xpath
                presenter.renderPopup({
                    position: args.position,
                    filter: args.filter,
                    xpath: args.xpath,
                    allowCollection : args.allowCollection
                });
            });

        return defer.promise();
    },

    /*
    * Activates when a multiple relationship is required
    */
    onGetMultipleRelationship: function (args) {

        var leftEntityId = bizagi.editor.utilities.resolveRelatedEntityFromXpath(args.leftEntity);
        var rightEntityId = bizagi.editor.utilities.resolveRelatedEntityFromXpath(args.rightEntity);

        var multipleRelationship = bizagi.editor.communicationprotocol.factory.createProtocol({ protocol: "getmultiplerelationship", leftEntityId: leftEntityId, rightEntityId: rightEntityId });
        return multipleRelationship.processRequest();
    },

    /*
     * Activates when a multiple relationship is required
     */ 
    onGetSimpleRelationship: function (args) {

        var leftEntityId = bizagi.editor.utilities.resolveRelatedEntityFromXpath(args.leftEntity);
            
        var singleRelationship = bizagi.editor.communicationprotocol.factory.createProtocol({ protocol: "getmultiplerelationship", leftEntityId: leftEntityId});
        return singleRelationship.processRequest();
    },
            
    /*
    * Activates when a multiple relationship is required
    */
    onGetXpathData: function (args) {
        var self = this;
        var xpath = args.xpath;

        var xpathNavigatorModel = self.controller.getXpathNavigatorModel();
        return xpathNavigatorModel.getNodeByXpath(xpath);
    },

    /*
    * Activates when localization is required
    */
    onSetLocalization: function (args) {
        var self = this;
        var defer = new $.Deferred();
        var propertyValue = args.propertyValue;
        propertyValue = propertyValue || bizagi.editor.utilities.buildComplexLocalizable("", args.elementGuid, args.propertyName);
        var multilenguageProtocol = bizagi.editor.communicationprotocol.factory.createProtocol({ protocol: "multilanguage", i18n: propertyValue });

        // Show localization form in BAS
        $.when(multilenguageProtocol.processRequest())
        .done(function (result) {
            if (result) {
                defer.resolve(result);
            }
        });

        return defer.promise();
    },

    /*
     *   Activates when the element has its displayname changed
     */
    onElementChangeLabel: function (args) {
        var self = this;

        // Execute change property command
        self.executeCommand({
            command: "changeProperty",
            guid: args.guid,
            property: "displayName",
            value: args.value
        });
    }
});