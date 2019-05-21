/*
*   Name: BizAgi Form Modeler View Xpath Handlers
*   Author: Diego Parra
*   Comments:
*   -   This script will handler modeler view command handlers after they have been executed in the model
*   
*   TIP: The view automatically queries for a <command>Executed function after the controller processed that command
*   Example: When the command "insertElement" has been executed, the method "insertElementExecuted" runs
*/
bizagi.editor.modelerView.extend("bizagi.editor.modelerView", {}, {

    /*
    *   Reacts when the change context has been performed, to refresh the xpath navigator with a new model
    */
    changeContextExecuted: function (result, args) {
        var self = this;

        // Refresh controls navigator
        self.refreshControlsNavigator();

        // Refresh xpath navigator
        self.refreshXpathNavigator({
            context: args.context
        });

        if (args.context == "grid" || args.context == "offlinegrid" || args.context == "adhocgrid") {
            // When in grid context, disable containers
            self.formContainer.disableSortablePlugin();
            self.disableLayoutTab();


        } if (args.context == "form" || args.context == "offlineform" || args.context == "adhocform") {
            // When in form context, enable layout tab
            self.enableLayoutTab();
        }
    },

    /*
    *   Reacts to update model command
    */
    updateModelExecuted: function (args) {
        var self = this;

        if (args.action === "CreateForm") {
            if (self.validateForm) { self.processValidations({ canRefresh: false }); }
            self.drawPropertyBox({ guid: args.guid });
        }
        else if (args.action === "CreateFormFromXpath") {
            self.reloadXpathNode({ id: args.idNode });
        }
        else if (args.action === "OpenWizardTemplates") {
            self.drawPropertyBox({ guid: args.guid });
        }
        else if (args.action === "OpenNestedForm") {
            self.showRenderingModel();
        }
    },

    /*
    *   Reacts to change property command
    */
    changePropertyExecuted: function (result, args) {
        var self = this,
            id = args.guid;

        if (args.property == 'xpath') {
            var element = self.controller.model.getElement(id);

            if (self.isGrid(element.type)) {
                element.deleteColumns && element.deleteColumns();
                self.render();
            }
        }

        if (args.property == 'showinprocesses') {
            if (args.value == false) {
                // Determine if the template is being used in any form
                var dependencyProtocol = bizagi.editor.communicationprotocol.factory.createProtocol({
                    protocol: "getdependency"
                });

                $.when(dependencyProtocol.processRequest())
                    .done(function (canBeChanged) {
                        
                        if (!canBeChanged) {
                            var message = bizagi.localization.getResource("templatedesigner-dependency");
                            $.when(
                                bizagi.showMessageBox(message),
                                self.controller.executeCommand({ command: "changeProperty", guid: args.guids[0], property: args.property, value: true })
                            )
                            .done(function () {
                                self.drawPropertyBox({ guid: args.guids[0], redraw: true });
                            });
                        }
                    });
               
            }
        }


        if (args.refreshProperties) {
            var guid = args.guid;
            if ($.isArray(args.guids)) { guid = args.guids[0]; }
            self.drawPropertyBox({ guid: guid, redraw: true });
        }
    },

    /*
    *   Reacts to change property command
    */
    changeMultiplePropertiesExecuted: function (result, args) {
        var self = this;

        if (args.refreshProperties) {
            self.drawPropertyBox({ guid: args.guid, redraw: true });
        }
    },

    /*
    *   Reacts to load widgets command
    */
    loadWidgetsExecuted: function () {
        var self = this;

        self.refreshControlsNavigator();
    },

    /*
    *   Reacts to form validations command
    */
    formValidationsExecuted: function (result) {
        var self = this;

        if (!$.isEmptyObject(result)) {
            // turn on validate flag 
            self.validateForm = true;
        }
    },

    isGrid: function (type) {
        return (type == "grid" || type === "groupedgrid");
    }

});