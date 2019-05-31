
/*
*   Name: BizAgi FormModeler Editor Update Model Command
*   Author: Alezander Mejia
*   Comments:
*   -   This script will define basic stuff for updatemodelcommand

*   Arguments
*   - basResponse
*   -
*/

bizagi.editor.notUndoableCommand.extend("bizagi.editor.updateModelCommand", {}, {

    /*
    *   Executes the command
    */
    execute: function () {
        var self = this,
            args = self.arguments;

        if (args.data.actiontype === "OpenNestedForm") {
            self.processNestedFormAction();
        } else if (args.data.actiontype === "CreateForm") {
            self.processCreateFormAction();
        } else if (args.data.actiontype === "CreateFormFromXpath") {
            self.processCreateFormFromXpathAction();
        } else if (args.data.actiontype === "ShowForm") {
            self.processShowForm();
        } else if (args.data.actiontype === "OpenWizardTemplates") {            
            self.processWizardTemplates();
        }


        return true;
    },

    /*
    *  Process elements in nested form
    */
    processNestedFormAction: function () {
        var self = this,
            args = self.arguments;

        var model = args.data.json;
        var guid = args.data.guidrender;

        if (model && guid) {

            var element = self.model.getElement(guid);
            var children = self.processData(model, element);
            element.elements = (children.length > 0) ? children : element.elements;
        }

        args.result = { action: args.data.actiontype };
    },

    /*
    *  Finds an elements in model
    */
    findElementInModel: function (guid) {
        var self = this,
            element;

        element = self.model.getElement(guid);

        return element;
    },

    /*
    * Receives a model with the elements to be processed
    */
    processData: function (modelToUpdate, parent) {
        var self = this,
            children = [];

        if (modelToUpdate.elements) {
            // Iterate for each element in the object
            $.each(modelToUpdate.elements, function (i, element) {
                var child = self.model.createElement(element.type, element);
                child.setParent(parent);
                children.push(child);
            });
        }

        return children;
    },

    /*
    *  Updates model with the reference of the template created
    */
    processWizardTemplates: function () {
        var self = this,
            args = self.arguments,
            data = args.data,
            propertyName = data.propertyName,
            guid = data.guidControl,
            guidTemplate = bizagi.editor.utilities.buildComplexReference(data.guidTemplate);
               
        self.model.changeProperty(guid, propertyName, guidTemplate);
        self.model.changeProperty(guid, 'templatetype', 'template');

        args.result = {
            action: data.actiontype,
            guid: guid
        };
    },

    /*
    *  Updates model with the reference of the form created
    */
    processCreateFormAction: function () {
        var self = this,
            args = self.arguments,
            data = args.data;

        var searchForms = [];

        var propertyName = data.propertyname;
        var guid = data.guidrender;
        var idform = bizagi.editor.utilities.buildComplexReference(data.idform);

        if (data.context && data.context === "searchform") {
            searchForms.push(idform);
            self.model.changeProperty(guid, propertyName, searchForms);
        } else {
            self.model.changeProperty(guid, propertyName, idform);
        }

        if (bizagi.util.parseBoolean(data.showForm)) {
            self.processShowForm();
        }
        args.result = { action: data.actiontype, guid: guid };
    },

    /*
    * add the form to the appropiate node in xpathNavigator
    */
    processCreateFormFromXpathAction: function () {
        var self = this,
            args = self.arguments;

        args.result = { action: args.data.actiontype, idNode: args.data.guidForm };
    },

    /*
    * Show elements in form related
    */
    processShowForm: function () {
        var self = this,
            args = self.arguments,
            data = args.data;

        var element = self.model.getElement(data.guidrender);
        args.refresh = true;
        element.loadForm();

        args.result = { action: data.actiontype };
    }

})
