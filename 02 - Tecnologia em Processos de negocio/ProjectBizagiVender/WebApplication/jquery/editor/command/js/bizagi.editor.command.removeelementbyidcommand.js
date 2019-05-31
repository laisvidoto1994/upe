
/*
*   Name: BizAgi FormModeler Editor Remove Element By Id Command
*   Author: Alexander Mejia
*   Comments:
*   -   This script will define basic stuff for removeelementbyidcommand
*
*   Arguments
*   - guid
*/

bizagi.editor.refreshableCommand.extend("bizagi.editor.removeElementByIdCommand", {}, {

    /*
    *   Removes the element with the specified guid
    */
    execute: function () {
        var self = this;
        var args = self.arguments;

        self.data = [];
        self.tabBackup = [];
        if (!$.isArray(args.guids) && typeof args.guid == "string") {
            args.guids = [args.guid];
        }

        // This command is called for other commands
        // if the call was made by convertToCommand this validation doesn't run
        if (args.action !== "convertTo" &&
             self.type !== "nestedForm" &&
             self.controller.hasEnableCommandsEditor()) {

            var commandResult = self.resolveResult(self.controller.executeCommand({
                command: "searchDependencies",
                guids: args.guids
            }));
            if (!commandResult.result) { return false; }
        }

        for (var i = 0; i < args.guids.length; i++) {

            var element = self.model.getElement(args.guids[i]);

            if (!element) { continue; }

            self.type = element.type;

            var contextInfo = self.controller.getContextInfo();
            var parent = element.parent ? self.model.getElement(element.parent.guid) : self.model.getElement(contextInfo.guid);

            args.canValidate = true;

            // Evaluate special cases
            if (element.type == "cascadingcombo" || element.type == "querycascadingcombo") {
                self.data.push(self.removeCascadingCombo(element));
            }
            else {
                // Perform the element remove
                self.data.push(self.model.removeElementById(args.guids[i]));
            }

            // Remove tab container when there are no tab childs
            if (parent.type == "tab" && parent.elements.length == 0) {
                // Save backup
                self.tabBackup.push({
                    parent: parent.parent.guid,
                    data: parent,
                    guid: parent.guid,
                    position: parent.position
                });

                // Remove tab container
                self.model.removeElementById(parent.guid);
            }

            self.removeElementSelected();

        }

        args.result = self.data;

        return true;
    },

    /*
    *   Undoes the remove command
    */
    undo: function () {
        var self = this;

        // Restore tab container if it was deleted
        if (self.tabBackup.length > 0) {
            for (var i = self.tabBackup.length - 1; i >= 0; i--) {
                self.model.insertElement(self.tabBackup[i].position, self.tabBackup[i].parent, self.tabBackup[i].data);
                for (var j = self.data.length - 1; j >= 0; j--) {
                    self.model.insertElement(self.data[j].position, self.data[j].parent.guid, self.data[j]);
                }
            }
        } else {
            // Restore element
            if ($.isArray(self.data)) {
                for (i = self.data.length - 1; i >= 0; i--) {
                    if (self.data[i].entities) {
                        self.insertCascadingCombo(i);
                    } else {
                        self.model.insertElement(self.data[i].position, self.data[i].parent.guid, self.data[i]);
                    }
                }
            } else {
                if (self.type == "cascadingcombo" || self.type == "querycascadingcombo") {
                    self.insertCascadingCombo();
                } else {
                    self.model.insertElement(self.data.position, self.data.parent.guid, self.data);
                }
            }
        }

        return true;
    },

    /*
    *  Remove a cascading combo element
    */
    removeCascadingCombo: function (element) {
        var self = this;
        var combo = element;
        var elementsToDelete = [];
        var entities = [];
        var position = 0;
        var parent = {};

        // Go to the parent combo element
        while (combo.getProperty("parentcombo") != null) {
            var parentComboGuid = combo.getProperty("parentcombo");
            combo = self.model.getElement(parentComboGuid);
        }

        // Fill elements to delete collection
        elementsToDelete.push(combo);
        while (combo.getProperty("childcombo") != null) {
            var childComboGuid = combo.getProperty("childcombo");
            combo = self.model.getElement(childComboGuid);
            elementsToDelete.push(combo);
        }

        // Remove elements
        for (var i = 0; i < elementsToDelete.length; i++) {
            entities.push(self.model.removeElementById(elementsToDelete[i].guid));
            if (i === 0) { position = entities[i].position; parent = entities[i].parent; }
            else if (entities[i].position < position) { position = entities[i].position; }

        }

        return { position: position, parent: parent, entities: entities };
    },

    /*
    *  Insert cascading combo elements
    */
    insertCascadingCombo: function (index) {
        var self = this;

        if (index === undefined) {
            $.each(self.data.entities, function (i, entity) {
                self.model.insertElement(self.data.position + i, entity.parent.guid, entity);
            });
        } else {
            $.each(self.data[index].entities, function (i, entity) {
                self.model.insertElement(self.data[index].position + i, entity.parent.guid, entity);
            });
        }

    },

    /*
    * Removes element selected
    */
    removeElementSelected: function () {
        var self = this;
        
        self.controller.removeSelectedElement();        
    }


})
