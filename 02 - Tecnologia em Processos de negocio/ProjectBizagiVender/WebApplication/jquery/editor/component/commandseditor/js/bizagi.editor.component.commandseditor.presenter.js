/*
*   Name: Bizagi FormModeler Editor Commands Editor Presenter
*   Author: Diego Parra
*/
bizagi.editor.observableClass.extend("bizagi.editor.component.commandseditor.presenter", {}, {

    /*
    *   Initializes the presenter
    */
    init: function () {
        this._super();
    },

    /*
    *   Shows the commands editor inside a popup,
    *   also acts like an async method which resolves when the user closes this popup
    */
    show: function (data) {
        var self = this;
        var defer = new $.Deferred();

        var model = self.createModelFactory(data);

        // Create popup
        var popup = self.popup = bizagi.createPopup({
            name: "bz-fm-commandseditor",
            container: "form-modeler",
            title: bizagi.localization.getResource("formmodeler-component-commandseditor-displayname"),
            center: true,            
            onClose: function () {
                defer.resolve(model.getDataModel());
            }
        });

        // apply plugin
        self.configureDraggablePlugin(popup.fullPopup);

        // Create the editor        
        self.commandsEditor = new bizagi.editor.component.commandseditor(popup.content, model, self);
        self.commandsEditor.render();

        return defer.promise();
    },

    /*
    *   Creates a model, depending on the current context
    *   ex. form. offlineform, etc
    */
    createModelFactory: function (data) {
        var self = this;

        var context = self.publish("getContext");
        if (context === "form")
            return new bizagi.editor.component.commandseditor.model(data);
        else if (context === "offlineform")
            return new bizagi.editor.component.commandseditor.offline.model(data);
        else if (context === "queryform")
            return new bizagi.editor.component.commandseditor.offline.model(data);
        else if (context == "startform")
            return new bizagi.editor.component.commandseditor.model(data);
    },

    /*
    *   Creates a new action
    */
    createAction: function (model) {
        var self = this;

        // hide main popup
        self.hidePopup();

        var title = bizagi.localization.getResource("formmodeler-component-commandseditor-action-editor-title");
        var popup = bizagi.createPopup({
            name: "bz-fm-actionvalidationeditor",
            container: "form-modeler",
            title: title,
            center: true,            
            onClose: function () {
                self.showPopup();
            }
        });

        // apply plugin
        self.configureDraggablePlugin(popup.fullPopup);

        var action = model.createEmptyAction();
        var actionModel = self.createActionModelFactory(action, model);
        var editor = new bizagi.editor.component.actioneditor(popup.content, actionModel, self);
        editor.render();

        // Attach cancel handler
        editor.subscribe("cancel", function () {
            self.showPopup();
            // Close popup
            popup.close();
        });

        // Attach save handler
        editor.subscribe("save", function (ev, data) {
            // Update main model
            model.addAction(data.model.guid, data.model);

            self.showPopup();
            // Close popup and redraw main model
            popup.close();
            self.commandsEditor.refresh();
        });
    },

    /*
    *   Edit an action
    */
    editAction: function (model, guid) {
        var self = this;

        // hide main popup
        self.hidePopup();

        var popup = bizagi.createPopup({
            name: "bz-fm-actionvalidationeditor",
            container: "form-modeler",
            title: 'Edit action',
            center: true,            
            onClose: function () {
                self.showPopup();
            }
        });

        // apply plugin
        self.configureDraggablePlugin(popup.fullPopup);

        var action = bizagi.clone(model.getAction(guid));
        var actionModel = self.createActionModelFactory(action, model);
        var editor = new bizagi.editor.component.actioneditor(popup.content, actionModel, self);

        editor.render();

        // Attach cancel handler
        editor.subscribe("cancel", function () {
            self.showPopup();
            // Close popup
            popup.close();
        });

        // Attach save handler
        editor.subscribe("save", function (ev, data) {

            // Update main model
            model.updateAction(guid, data.model);

            self.showPopup();

            // Close popup and redraw main model
            popup.close();
            self.commandsEditor.refresh();
        });
    },

    /*
    * Creates a action model depending the current context
    */
    createActionModelFactory: function (action, model) {
        var self = this;

        var context = self.publish("getContext");
        if (context == "form")
            return new bizagi.editor.component.actioneditor.model(action, model);
        else if (context == "offlineform")
            return new bizagi.editor.component.actioneditor.offline.model(action, model);
        else if (context == "queryform")
            return new bizagi.editor.component.actioneditor.offline.model(action, model);
        if (context == "startform")
            return new bizagi.editor.component.actioneditor.model(action, model);

    },

    /*
    *   Creates a new validation
    */
    createValidation: function (model) {
        var self = this;

        // hide main popup
        self.hidePopup();

        var title = bizagi.localization.getResource("formmodeler-component-commandseditor-validation-editor-title");
        var popup = bizagi.createPopup({
            name: "bz-fm-actionvalidationeditor",
            container: "form-modeler",
            title: title,
            center: true,            
            onClose: function () {
                self.showPopup();
            }
        });

        // apply plugin
        self.configureDraggablePlugin(popup.fullPopup);

        var validation = model.createEmptyValidation();
        var validationModel = new bizagi.editor.component.validationeditor.model(validation, model);
        var editor = new bizagi.editor.component.validationeditor(popup.content, validationModel, self);
        editor.render();

        // Attach cancel handler
        editor.subscribe("cancel", function () {

            self.showPopup();

            // Close popup
            popup.close();
        });

        // Attach save handler
        editor.subscribe("save", function (ev, data) {
            // Update main model
            model.addValidation(data.model.guid, data.model);

            self.showPopup();

            // Close popup and redraw main model
            popup.close();
            self.commandsEditor.refresh();
            // Sets the second tab when validation is saved
            $("#bz-fm-commandseditor-tabs", self.commandsEditor.element).tabs("option", "active", 1);
        });
    },

    /*
    *   Edit a validation
    */
    editValidation: function (model, guid) {
        var self = this;

        // hide main popup
        self.hidePopup();

        var popup = bizagi.createPopup({
            name: "bz-fm-actionvalidationeditor",
            container: "form-modeler",
            title: 'Edit validation',
            center: true,            
            onClose: function () {
                self.showPopup();
            }
        });

        // apply plugin
        self.configureDraggablePlugin(popup.fullPopup);

        var validation = bizagi.clone(model.getValidation(guid));
        var validationModel = new bizagi.editor.component.validationeditor.model(validation, model);
        var editor = new bizagi.editor.component.validationeditor(popup.content, validationModel, self);
        editor.render();

        // Attach cancel handler
        editor.subscribe("cancel", function () {

            self.showPopup();

            // Close popup
            popup.close();
        });

        // Attach save handler
        editor.subscribe("save", function (ev, data) {
            // Update main model
            model.updateValidation(guid, data.model);

            self.showPopup();

            // Close popup and redraw main model
            popup.close();
            self.commandsEditor.refresh();
            // Sets the second tab when validation is saved
            $("#bz-fm-commandseditor-tabs", self.commandsEditor.element).tabs("option", "active", 1);
        });
    },

    /*
    *  hide the main popup.
    */
    hidePopup: function () {
        this.popup.fullPopup.hide();
    },

    /*
    * Display the main popup
    */
    showPopup: function () {
        this.popup.fullPopup.show();
    },

    /*
    * Apply draggable plugin to popup
    */
    configureDraggablePlugin: function (element) {
        element.draggable({
            containment: "#container-layout",
            delay: 100,
            distance: 5,
            handle: ".ui-popup-header"
        });
    }
});