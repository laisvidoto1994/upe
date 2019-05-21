/*
* @title : Cascading Combo Wizard
* @author : Diego Parra 
* @date   : 08/11/12 
* Comments:
*     Define the cascading combo wizard
*/

bizagi.editor.wizard.base("bizagi.editor.wizard.cascadingcombo", {

    /*
    *   Constructor
    */
    init: function (canvas, params) {
        params = params || {};

        // Call super
        this._super(canvas, params);

        // Set up the variables
        this.canvas = canvas;
        this.presenter = params.presenter;
    },

    /*
    *   Load all needed templates
    */
    loadTemplates: function () {
        // Define mapping
        var templateMap = {
            "wizard-container": (bizagi.getTemplate("bizagi.editor.wizard.cascadingcombo") + "#wizard-container")
        };

        // Fetch templates
        return this._super(templateMap);
    },

    /*
    *   Renders the wizard
    */
    renderWizard: function () {
        var self = this;
        var content = $.tmpl(self.getTemplate("wizard-container"), {});

        // Draw xpath selector
        self.drawXpathNavigator(content);

        // Add to popup
        content.appendTo(self.canvas);
    },

    /*
    *   Draws the xpath navigator component in the layout
    */
    drawXpathNavigator: function (content) {
        var self = this;

        // Define canvas
        var canvas = $(".bz-fm-wizard-cascadingcombo-xpath span", content);
        $.when(self.params.xpathModel)
        .done(function (model) {
            var presenter = new bizagi.editor.component.xpathnavigator.presenter({ canvas: canvas, model: model });

            // Define handlers
            presenter.subscribe("nodeClick", function (e, node) { self.onNodeClick(node); });
            presenter.subscribe("nodeDoubleClick", function (e, node) { self.onNodeDoubleClick(node); });

            presenter.render({
                allowDrag: false,
                filter: {
                    typeFilter: "xpathtoentity"
                }
            });
        });
    },

    /*
    *   Process finish button
    */
    processFinishButton: function () {
        var self = this;

        if (self.selectedNode == null) {
            bizagi.showMessageBox(bizagi.localization.getResource("bizagi-editor-wizard-cascadingcombo-nodatasource"), "Bizagi", "error", false);
            return;
        }

        if (self.selectedNode.nodeType == "entity-application") {
            bizagi.showMessageBox(bizagi.localization.getResource("bizagi-editor-wizard-cascadingcombo-invaliddatasource"), "Bizagi", "error", false);
            return;
        }

        self.presenter.closePopup({
            success: true,
            xpath: self.selectedNode.xpath,
            displayName: self.selectedNode.displayName,
            contextEntity: self.selectedNode.contextScope,
            guidRelatedEntity: self.selectedNode.guidRelatedEntity
        });
    },

    /*************************************************************************************************** 
    *   EVENT HANDLERS
    *****************************************************************************************************/

    onNodeClick: function (node) {
        var self = this;
        self.selectedNode = node;
    },

    onNodeDoubleClick: function (node) {
        var self = this;
        self.selectedNode = node;

        // Simulate finish
        self.processFinishButton();
    }

});

