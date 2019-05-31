/*
@title: Validation Editor Component
@authors: Diego Parra
@date: 17-jul-12
*/
bizagi.editor.component.baseeditor(
    "bizagi.editor.component.validationeditor", {
        /*
        *   Initializes the class
        */
        init: function (canvas, model, controller) {
            this._super(canvas, model, controller);
        },

        // Message handler
        ".bz-fm-commandseditor-message-argument click": function (element) {
            var self = this;
            self.displayMessageControl(element);
        },


        /*
        *   Show message edition control
        */
        displayMessageControl: function (messageControl) {
            var self = this;
            var message = self.model.getMessage();
            var editor = new bizagi.editor.component.constantargument.textarea({
                templates: self.tmpl,
                element: messageControl,
                value: message,
                mainEditor: this
            });
            editor.render();
            editor.subscribe("valuechanged", function (e, item) {
                var value = item.value;
                self.model.updateMessage(value);

                // Close the editor and refresh the view
                editor.close();
                self.refresh();
            });
            
            editor.subscribe("launchLocalizableEditor", function (e, params) {

                var localizableEditor = bizagi.editor.communicationprotocol.factory.createProtocol({
                    protocol: "multilanguage",
                    i18n: self.model.getMessage()
                });

                // Launches editor
                $.when(localizableEditor.processRequest())
                    .done(function (localization) {

                        localization["i18n"]["default"] = params.value;
                        self.model.updateMessage(localization);

                        // Close the editor and refresh the view
                        editor.close();
                        self.refresh();
                    });

            });
        },

        /*  
        *   Load all the templates needed
        */
        loadTemplates: function () {
            var self = this;
            var defer = new $.Deferred();

            $.when(
                self.loadTemplate("container", bizagi.getTemplate("bizagi.editor.component.commandseditor").concat("#commands-editor-validation")),
                self.loadTemplate("list", bizagi.getTemplate("bizagi.editor.component.commandseditor").concat("#commands-editor-list")),
                self.loadTemplate("controlslist", bizagi.getTemplate("bizagi.editor.component.commandseditor").concat("#commands-editor-controls-list")),
                self.loadTemplate("argument", bizagi.getTemplate("bizagi.editor.component.commandseditor").concat("#commands-editor-argument")),
                self.loadTemplate("boolean", bizagi.getTemplate("bizagi.editor.component.commandseditor").concat("#commands-editor-argument-boolean")),
                self.loadTemplate("string", bizagi.getTemplate("bizagi.editor.component.commandseditor").concat("#commands-editor-argument-string")),
                self.loadTemplate("textarea", bizagi.getTemplate("bizagi.editor.component.commandseditor").concat("#commands-editor-argument-textarea")),
                self.loadTemplate("date", bizagi.getTemplate("bizagi.editor.component.commandseditor").concat("#commands-editor-argument-date")),
                self.loadTemplate("number", bizagi.getTemplate("bizagi.editor.component.commandseditor").concat("#commands-editor-argument-number")),
                self.loadTemplate("color", bizagi.getTemplate("bizagi.editor.component.commandseditor").concat("#commands-editor-argument-color"))

            ).done(function () {
                defer.resolve();
            });

            return defer.promise();
        }
    }
);

