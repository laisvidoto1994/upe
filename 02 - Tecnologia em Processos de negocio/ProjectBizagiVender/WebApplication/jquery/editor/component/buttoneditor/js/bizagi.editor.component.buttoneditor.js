/*
@title: Search Result Edition Component
@authors: Diego Parra 
@date: 22-ene-13
*/

bizagi.editor.component.controller("bizagi.editor.component.buttoneditor", {
    /*
    *   Constructor
    */
    init: function (canvas, params) {
        params = params || {};

        // Call super
        this._super(canvas);

        // Set up the variables
        this.model = params.model;
        this.canvas = canvas;
        this.presenter = params.presenter;
        this.options = params.options;
        this.rendering = new bizagi.rendering.facade();       
    },

    /*
    *   Load all needed templates
    */
    loadTemplates: function () {
        // Define mapping
        var templateMap = {
            "buttoneditor": (bizagi.getTemplate("bizagi.editor.component.buttoneditor") + "#buttoneditor-container")
        };

        // Fetch templates
        return this._super(templateMap);
    },

    /*
    *   Refresh the view
    */
    refresh: function (options) {
        this.render(options);
    },

    /*
    *   Renders the view
    */
    render: function (params) {
        var self = this;
        params = params || {};

        // set read only state
        self.isReadOnly = (params.isReadOnly != "undefined") ? bizagi.util.parseBoolean(params.isReadOnly) : false;
        self.allowAddButtons = (params.allowAddButtons != "undefined") ? bizagi.util.parseBoolean(params.allowAddButtons) : false;
        
        // Check options
        self.options = $.extend(self.options, params.options);

        // Update model if a new button model has been supplied
        if (params.buttonModel) self.model.update(params.buttonModel);

        // Load templates and then render
        $.when(self.loadTemplates())
        .done(function () {
            // Render buttons from template
            if (!self.buttonEditor) {
                // Clear container 
                self.canvas.empty();
                var buttonEditor = self.buttonEditor = $.tmpl(self.getTemplate("buttoneditor"));
                buttonEditor.appendTo(self.canvas);
            }

            // Render buttons
            var buttonContainer = $("#bz-fm-buttoneditor-rendering", self.buttonEditor);
            self.renderButtons(buttonContainer);
        });
    },

    /*
    *   Render the buttons 
    */
    renderButtons: function (buttonEditor) {
        var self = this,
            buttons;
        
        // Set a timer to avoid multiple changes at renderButtons view
        if (bizagi.renderButtonsTimeout != null) {
            return;
        }

        bizagi.renderButtonsTimeout = setTimeout(function () {
            bizagi.renderButtonsTimeout = null;
        }, 200);


        // Render buttons using rendering engine
        self.rendering.update({
            mode: "design",
            canvas: buttonEditor,
            allowButtons: true,
            data: {
                properties: {},
                buttons: self.model.getViewModel()
            }
        });

        // Unwrap button container
        $.when(self.rendering.ready())
        .done(function () {

            var buttonContainer = $(".ui-bizagi-button-container", buttonEditor);
            var originalButtons = $(".ui-bizagi-button", buttonContainer);

            // Apply some adjustements from original rendering
            buttonContainer.unwrap();
            originalButtons.wrap("<span></span>");

            // Style add button
            $(".bz-fm-buttoneditor-add", buttonContainer).button();
            $(".bz-fm-buttoneditor-add .ui-button-text", buttonContainer).addClass("bz-fm-buttoneditor-add-icon");

            if (!self.isReadOnly && self.allowAddButtons) {

                // Style add button
                $(".bz-fm-buttoneditor-add", buttonContainer).button();
                $(".bz-fm-buttoneditor-add .ui-button-text", buttonContainer).addClass("bz-fm-buttoneditor-add-icon");

                // Add draggable style
                var containerButton = $(buttonContainer.children()[0]);

                containerButton.sortable({
                    items: containerButton.children().not(".bz-fm-avoid-sort"),
                    cancel: "textarea,select,option",
                    distance: 10,
                    axis: "x",
                    cursorAt: { top: -3, left: 0 },
                    placeholder: "ui-bizagi-button-placeholder bz-fm-avoid-sort",
                    delay: 150,
                    start: function (e, ui) { self.sortStart(e, ui); },
                    tolerance: "pointer",
                    stop: function (e, ui) { self.sortFinish(e, ui); }
                });

                // Activate state
                if (self.options.element) {
                    var guid = self.options.element.guid;
                    var element = $('input[data-guid="' + guid + '"]', buttonContainer);
                    if (element.length > 0) {
                        element.toggleClass("bz-state-active");
                        element = element.parent();
                        self.selectButton(element, guid);
                    }
                }
            } else {
                $(".bz-fm-avoid-sort", buttonContainer).hide();
            }
        });

        return buttonEditor;
    },

    /*
    *   Handles sort start event
    */
    sortStart: function (event, ui) {
        var self = this;

        var index = $(ui.item).parent().children().not(".bz-fm-avoid-sort").index(ui.item);
        ui.item.data("start-position", index);
        self.initialPosition = index;
        return true;
    },

    /*
    *   Handles sort end event
    */
    sortFinish: function (event, ui) {
        var self = this;
        var index = $(ui.item).parent().children().not(".bz-fm-avoid-sort").index(ui.item);

        // Trigger moveButton event
        self.presenter.publish("moveButton", {
            initialPosition: ui.item.data("start-position") || self.initialPosition,
            finalPosition: index
        });

        return true;
    },

    /*
    *   Selects a column in the editor
    */
    selectButton: function (element, guid) {
        var self = this;
        var offset = element.offset();

        // Publish an event so the modeler can react to
        self.presenter.publish("selectButton", {
            position: {
                top: offset.top,
                left: offset.left,
                width: element.outerWidth(),
                height: element.outerHeight()
            },
            element: element,
            guid: guid,
            type: "button"
        });
    },

    /*
    *   Unselects a column in the editor
    */
    unselectButton: function () {
        var self = this;

        // Publish an event so the modeler can react to
        self.presenter.publish("unselectButton");
    },

    /*************************************************************************************************** 
    *   EVENT HANDLERS
    *****************************************************************************************************/

    /*
    *   Handles button clicks to toggle selection
    */
    ".ui-bizagi-button click": function (element) {
        var self = this;

        if (self.isReadOnly) {
            return;
        }

        $(".ui-bizagi-render").not(element).removeClass("ui-state-active");
        $(".ui-bizagi-grid-cell").not(element).removeClass("ui-state-active");
        $(".ui-bizagi-container").removeClass("ui-bizagi-container-selected");

        // Select element
        element.toggleClass("bz-state-active");
        var isSelected = element.hasClass("bz-state-active");

        // Remove highlight to other elements
        $(".ui-bizagi-button", self.canvas).not(element).removeClass("bz-state-active");

        if (isSelected) {
            // Selects the button in the component
            self.selectButton(element.parent(), element.data("guid"));
        } else {
            self.unselectButton();
        }
    },

    /*
    *   Handles button adding click
    */
    ".bz-fm-buttoneditor-add click": function (element) {
        var self = this;

        // Publish an event so the modeler can react to
        self.presenter.publish("addButton");
    }
});