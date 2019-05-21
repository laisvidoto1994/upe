/*
@title: Action Editor Component
@authors: Diego Parra
@date: 06-jul-12
*/
bizagi.editor.component.baseeditor(
    "bizagi.editor.component.actioneditor", {
        /*
        *   Initializes the class
        */
        init: function (canvas, model, controller) {
            this._super(canvas, model, controller);
        },

        // Statement command handler
        ".bz-fm-commandseditor-statement-command click": function (element) {
            var self = this;
            var guid = element.closest(".bz-fm-commandseditor-statement").data("guid");
            self.displayCommands(element, guid);
        },

        // Statement xpath handler
        ".bz-fm-commandseditor-statement-xpath click": function (element) {
            var self = this;
            var guid = element.closest(".bz-fm-commandseditor-statement").data("guid");
            self.displayStatementControls(element, guid);
        },

        // Statement argument handler
        ".bz-fm-commandseditor-statement-argument click": function (element) {
            var self = this;
            var guid = element.closest(".bz-fm-commandseditor-statement").data("guid");

            if (typeof self.model.isOpen == "undefined" || self.model.isOpen)
                self.displayStatementArgument(element, guid);

            self.model.isOpen = false;
            setTimeout(function () {
                self.model.isOpen = true;
            }, 1000);
        },

        // New statement handler
        ".bz-fm-commandseditor-statement-new click": function (element) {
            var self = this;
            var section = element.closest(".bz-fm-commandseditor-statements").data("section");
            self.model.addStatement(section);

            // Refresh view
            self.refresh();
        },

        // Delete statement handler
        ".bz-fm-commandseditor-statement .bz-fm-commandseditor-icons-delete click": function (element) {
            var self = this;
            var section = element.closest(".bz-fm-commandseditor-statements").data("section");
            var guid = element.closest(".bz-fm-commandseditor-statement").data("guid");
            self.model.removeStatement(guid, section);

            // Refresh view
            self.refresh();
        },

        // Else action handler
        ".bz-fm-commandseditor-statements-else-action click": function (element) {
            var self = this;
            self.displayElseActions(element);
        },

        // Context handlers
        ".bz-fm-commandseditor-context-control click": function (element) {
            var self = this;
            self.displayContextControls(element);
        },

        /*
        * Show context controls for action
        */
        displayContextControls: function (element) {
            var self = this;
            var isControlsList = true;
            var controls = self.model.getControls({
                appliesToRender: true,
                filterBy: ["collection"]
            });

            controls["Form"] = { label: "Form", type: "form", style: "bz-studio bz-forms_16x16_standard" };

            // Show list
            var list = self.displayList(controls, self.model.getContextAction().value, isControlsList);

            // Position list
            list.position({
                my: "left top",
                at: "left bottom",
                of: element,
                collision: "fit flip"
            });

            // Define a handler to select an item
            list.find("li").click(function () {
                var value = $(this).data("value");

                self.model.updateContext(value);

                // Refresh
                self.refresh();
                list.detach();
            });
        },


        /*
        *   Show xpath controls for statements
        */
        displayStatementControls: function (xpathControl, guid) {
            var self = this;
            var isControlsList = true;
            var currentValue = self.model.fullModel.resolveCommand(self.model.getStatement(guid));
            var command = self.model.getStatementCommand(guid);
            if (command == null) return; // Don't do anything because we need a command to display the controls

            // Fetch controls list
            var controls = self.model.getControls(command);

            // Show list
            var list = self.displayList(controls, currentValue, isControlsList);

            // Position list
            list.position({
                my: "left top",
                at: "left bottom",
                of: xpathControl,
                collision: "fit flip"
            });

            // Define a handler to select an item
            list.find("li").click(function () {
                var value = $(this).data("value");

                var property = self.model.getPropertyToUpdate(value);
                self.model.updateStatement(guid, property, value, (property !== "xpath"));

                //if button  belongs to flow activity
                self.model.updateButtonsStatement(guid,value);

                // Refresh
                self.refresh();
                list.detach();
            });
        },

        /*
        *   Show argument controls for statement
        */
        displayStatementArgument: function (argumentControl, guid) {
            var self = this;
            var argument = self.model.getStatement(guid).argument;
            var type = self.model.getStatementType(guid);
            var xpath = self.model.getStatement(guid).xpath;
            var editor;
            editor = self.getConstantEditor(argumentControl, argument, xpath, type);
            if (editor) {


                // Subscribe to change event
                editor.subscribe("valuechanged", function (e, item) {
                    self.model.updateStatement(guid, "argument", item.value);
                    self.model.updateStatement(guid, "argumentType", item.argumentType);
                    // Close the editor and refresh the view
                    editor.close();
                    self.refresh();
                });

                editor.render();
            }
        },

        /*
        *   Show command controls
        */
        displayCommands: function (commandControl, guid) {
            var self = this;
            var commands = self.model.getCommands(guid);
            var currentValue = self.model.getStatement(guid).command;

            // Show list
            var list = self.displayList(commands, currentValue);

            // Position list
            list.position({
                my: "left top",
                at: "left bottom",
                of: commandControl,
                collision: "fit flip"
            });

            // Define a handler to select an item
            list.find("li").click(function () {
                var value = $(this).data("value");

                self.model.updateStatement(guid, "command", value);
                var command = bizagi.editor.component.commandseditor.actioncommands.factory.createCommand({
                    command: value,
                    guid: guid,
                    model: self.model,
                    controller: self,
                    section: commandControl.closest(".bz-fm-commandseditor-statements").data("section")
                });
                if (command) {
                    command.execute();
                }

                // Refresh
                self.refresh();
                list.detach();
            });
        },

        /*
        *   Show else action controls
        */
        displayElseActions: function (elseActionControl) {
            var self = this;
            var elseActions = self.model.getElseActions();
            var currentValue = self.model.getElseAction();

            // Show list
            var list = self.displayList(elseActions, currentValue);

            // Position list
            list.position({
                my: "left top",
                at: "left bottom",
                of: elseActionControl,
                collision: "none"
            });

            // Define a handler to select an item
            list.find("li").click(function () {
                var value = $(this).data("value");

                self.model.updateElseAction(value);

                // Refresh
                self.refresh();
                list.detach();
            });
        },

        /*
        * Configure sortable plugin for actions commands
        */
        configureSortablePlugin: function () {
            var self = this;

            var container = $(".bz-fm-commandseditor-statements", self.element);

            // Define handlers
            container.bind("sortstart", function (ev, args) { self.onSortStart(args); });
            container.bind("sortstop", function (ev, args) { self.onSortFinish(args); });

            // Apply sortable plugin
            container.sortable({
                items: ".bz-fm-commandseditor-item",
                revert: false,
                distance: 10,
                cursorAt: { top: -3, left: 0 },
                placeholder: "ui-bizagi-placeholder",
                delay: 150
            }).disableSelection();

        },

        /*
        *   Manages sort start event
        */
        onSortStart: function (ui) {
            // Save drag position
            var index = $(ui.item).parent().children(".bz-fm-commandseditor-item").index(ui.item);
            ui.item.data("start-position", index);
        },

        /*
        *   Manages sort finish event
        */
        onSortFinish: function (ui) {
            var self = this;

            var finalPosition = $(ui.item).parent().children(".bz-fm-commandseditor-item").not(".ui-sortable-placeholder").index(ui.item),
                initialPosition = ui.item.data("start-position"),
                section = ui.item.closest(".bz-fm-commandseditor-statements").data("section");

            self.model.sortCommands({
                finalPosition: finalPosition,
                initialPosition: initialPosition,
                section: section
            });
        },

        /*  
        *   Load all the templates needed
        */
        loadTemplates: function () {
            var self = this;
            var defer = new $.Deferred();

            $.when(
                self.loadTemplate("container", bizagi.getTemplate("bizagi.editor.component.commandseditor").concat("#commands-editor-action")),
                self.loadTemplate("list", bizagi.getTemplate("bizagi.editor.component.commandseditor").concat("#commands-editor-list")),
                self.loadTemplate("controlslist", bizagi.getTemplate("bizagi.editor.component.commandseditor").concat("#commands-editor-controls-list")),
                self.loadTemplate("argument", bizagi.getTemplate("bizagi.editor.component.commandseditor").concat("#commands-editor-argument")),
                self.loadTemplate("boolean", bizagi.getTemplate("bizagi.editor.component.commandseditor").concat("#commands-editor-argument-boolean")),
                self.loadTemplate("string", bizagi.getTemplate("bizagi.editor.component.commandseditor").concat("#commands-editor-argument-string")),
                self.loadTemplate("textarea", bizagi.getTemplate("bizagi.editor.component.commandseditor").concat("#commands-editor-argument-textarea")),
                self.loadTemplate("date", bizagi.getTemplate("bizagi.editor.component.commandseditor").concat("#commands-editor-argument-date")),
                self.loadTemplate("number", bizagi.getTemplate("bizagi.editor.component.commandseditor").concat("#commands-editor-argument-number")),
                self.loadTemplate("color", bizagi.getTemplate("bizagi.editor.component.commandseditor").concat("#commands-editor-argument-color")),
                self.loadTemplate("rule", bizagi.getTemplate("bizagi.editor.component.commandseditor").concat("#commands-editor-argument-rule")),
                self.loadTemplate("interface", bizagi.getTemplate("bizagi.editor.component.commandseditor").concat("#commands-editor-argument-interface"))
            ).done(function () {
                defer.resolve();
            });

            return defer.promise();
        }
    }
);

