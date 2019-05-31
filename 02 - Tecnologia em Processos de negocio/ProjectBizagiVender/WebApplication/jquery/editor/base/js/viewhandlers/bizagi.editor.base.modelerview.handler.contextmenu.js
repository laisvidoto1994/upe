/*
*   Name: BizAgi Form Modeler View Context Menu Handler
*   Author: Alexander Mejia
*   Comments:
*   -   This script will handler modeler view context menu handlers
*/
bizagi.editor.modelerView.extend("bizagi.editor.modelerView", {}, {
    /*
    *   Draws the context menu in the layout
    */
    drawContextMenu: function (params) {
        var self = this;

        // Define a command to fetch the model
        $.when(self.executeCommand({ command: "getConvertToModel", guid: params.guid })).
            done(function (convertToModel) {
                self.destroy();
                var model = self.executeCommand({ command: "getContextMenuModel", guid: params.guid, convertToModel: convertToModel });
                var presenter = self.contextmenu = new bizagi.editor.component.contextmenu.presenter({ model: model, guid: params.guid });

                // Add handlers
                presenter.subscribe("onItemClicked", function (event, args) {
                    self.onContextMenuItemClicked(presenter, args);
                });

                // Render and return 
                return presenter.render({ position: params.position });
            });
    },

    /*
    *   Process context menu clicks
    */
    onContextMenuItemClicked: function (presenter, args) {
        var self = this;

        // Close the property box
        self.hidePropertyBox();

        // Process automatic property changing
        if (args.property && args.value) {
            if (self.controller.isOfflineContext()) {
                // Execute change property
                self.executeCommand({ command: "changeProperty", guid: presenter.guid, property: args.property, value: args.value });

            } else if (typeof args.value === "object" && args.value.fixedvalue) {
                // Execute change property
                self.executeCommand({ command: "changeProperty", guid: presenter.guid, property: args.property, value: args.value });

            } else {

                // build complex reference
                args.value = bizagi.editor.utilities.buildComplexReference(args.value);

                // Show expression selector
                self.performShowRuleSelector({ type: args.property, id: presenter.guid, newValue: args.value, categorytype: "Boolean", data: args.value });
                //self.showExpressionSelector(args.property, presenter.guid);
            }
        }

        // Process manual actions
        if (args.action) {
            // Execute delete command
            if (args.action == "delete") self.executeCommand({ command: "removeElementById", guid: presenter.guid });
            // Execute rename command
            if (args.action == "rename") self.showElementLabelEditor(presenter.guid);
            // Ececute ConvertTo command
            if (args.action == "convertTo") self.executeCommand({ command: "convertTo", guid: presenter.guid, convertTo: args.value });
            // Excecute Show Properties
            if (args.action == "properties") self.showPropertyBox(presenter.guid);

        }
    },

    /*
    *   Show the expression selector and update the element
    */
    showExpressionSelector: function (property, guid) {
        var self = this;
        var model =  self.controller.getModel();
        var element = model.getElement(guid);
        var elemProperty = element.getProperty(property) || {};
        var args ={};
        args.data = elemProperty.rule || { rule: { baref: { ref: "expression" } } };
        args.type = property;
        args.categorytype = "Boolean";
        self.performShowRuleSelector(args);
    },

    /*
    *   Show the label editor and update the element
    */
    showElementLabelEditor: function (guid) {
        // TODO: Change this behaviour when performing rendering hacks refactor
        var element = this.formContainer.getRenderById(guid);
        if (element && element.showElementLabelEditor) {
            element.showElementLabelEditor();
        }
    },

    /*
    *   Show the properties box
    */
    showPropertyBox: function (guid) {
        var self = this;
        // TODO: Change this behaviour when performing rendering hacks refactor
        var element = $('[guid="' + guid + '"]');
        //TODO: check how to unselect all others renders 
        /*if(!element.hasClass('ui-state-active')){
        element.trigger('click');
        }else{*/
        self.drawPropertyBox({ guid: guid });
        /*}*/
    },

    /*
    * Destroy component if exists
    */
    destroy: function () {
        var self = this;

        self.contextmenu && self.contextmenu.destroy();

    }


});
