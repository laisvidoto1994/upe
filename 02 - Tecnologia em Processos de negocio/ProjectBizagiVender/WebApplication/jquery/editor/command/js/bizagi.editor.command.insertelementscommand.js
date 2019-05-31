    
/*
*   Name: BizAgi FormModeler Editor Insert Elements Command
*   Author: Alexander Mejia
*   Comments:
*   -   This command inserts elements in the model
*
*   Command Arguments
*
*   - data  object MDBAS 
*   - 
*/

bizagi.editor.refreshableCommand.extend("bizagi.editor.insertElementsCommand", {}, {

    /*
    *   Adds the element in the model, using the arguments
    */
    execute: function () {
        var self = this,
            args = self.arguments,
            data = args.data || {};


        args.canValidate = true;

        if (!self.elements) {
            self.processData(data);
            self.actions = data.actions || [];
            self.validations = data.validations || [];
            self.buttons = data.buttons || [];
        }

        self.addElements();
        self.addActions();
        self.addValidations();
        self.addButtons();

        return true;
    },

    /*
    *   Creates elements
    */
    processData: function (data) {
        var self = this;
        self.elements = [];       
        var regenerateGuid = true;

        if (data && data.elements) {            
            var form = self.model.createElement("form", data, regenerateGuid);
            self.regenerateGuids(form, form.elements);
            self.elements = form.elements;
        }
    },

    /*
    * Iterate through all elements of the container, regenerating the element properties
    */
    regenerateGuids: function (model, elements) {
        var self = this;

        elements.forEach(function (element) {
            if (element.elementType == "container") {
                self.regenerateGuids(model, element.elements);
            }

            if (element.type == 'cascadingcombo') {
                self.processCascadingCombo(model, element)
            }
        });
    },

    /*
    * Regenerate Guids of the properties in the cascading combo properties
    */
    processCascadingCombo: function(model, element) {
        var self = this;

        var parentCombo = element.resolveProperty('parentcombo');
        var childCombo = element.resolveProperty('childcombo');

        if (parentCombo) {
            var parent = model.getElementByOldGuid(parentCombo);
            element.assignProperty('parentcombo', parent.guid);
        }

        if (childCombo) {
            var child = model.getElementByOldGuid(childCombo);
            element.assignProperty('childcombo', child.guid);
        }
    },

    /*
    *  Add elements to model
    */
    addElements: function () {
        var self = this;

        if (self.elements.length > 0) {
            for (var i = 0, l = self.elements.length; i < l; i += 1) {
                self.model.addElement(self.elements[i]);
            }
        }
    },

    /*
    * Removes elements
    */
    deleteElements: function () {
        var self = this;

        if (self.elements.length > 0) {
            for (var i = 0, l = self.elements.length; i < l; i += 1) {
                self.model.removeElementById(self.elements[i].guid);
            }
        }
    },

    /*
    *   Adds actions to model
    */
    addActions: function () {
        var self = this;

        if (self.actions.length > 0) {
            for (var i = 0, l = self.actions.length; i < l; i += 1) {
                self.model.addAction(self.actions[i]);
            }
        }
    },

    /*
    * Remove Actions
    */
    deleteActions: function () {
        var self = this;

        if (self.actions.length > 0) {
            for (var i = 0, l = self.actions.length; i < l; i += 1) {
                self.model.deleteAction(self.actions[i].guid);
            }
        }
    },

    /*
    * Adds validations to model
    */
    addValidations: function () {
        var self = this;

        if (self.validations.length > 0) {
            for (var i = 0, l = self.validations.length; i < l; i += 1) {
                self.model.addValidation(self.validations[i]);
            }
        }
    },

    /*
    * Removes validations
    */
    deleteValidations: function () {
        var self = this;

        if (self.validations.length > 0) {
            for (var i = 0, l = self.validations.length; i < l; i += 1) {
                self.model.deleteValidation(self.validations[i].guid);
            }
        }
    },

    /*
    * Adds custom buttons
    */
    addButtons: function () {
        var self = this;

        // Iterate for each element in the object
        $.each(self.buttons, function (index, element) {
            var button = self.model.createElement(element.type, element);
            self.model.addButton(button);
        });
    },

    /*
    * Removes custom buttons
    */
    deleteButtons: function () {
        var self = this;

        if (self.buttons.length > 0) {
            for (var i = 0, l = self.buttons.length; i < l; i += 1) {
                self.model.removeElementById(self.buttons[i].guid);
            }
        }
    },

    /*
    *   Undo last action
    */
    undo: function () {
        var self = this;

        self.deleteElements();
        self.deleteActions();
        self.deleteValidations();

        return true;
    }
});

