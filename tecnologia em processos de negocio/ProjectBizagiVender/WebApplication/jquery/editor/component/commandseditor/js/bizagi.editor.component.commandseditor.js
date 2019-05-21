/*
@title: Commands Editor Component
@authors: Diego Parra
@date: 04-jul-12
*/
$.Controller(
    "bizagi.editor.component.commandseditor", {
        /*
        *   Initializes the class
        */
        init: function (canvas, model, controller) {
            this.canvas = canvas;
            this.model = model;
            this.controller = controller;
            this.tmpl = {};
        },


        /*
        *   Refresh the control
        */
        refresh: function () {
            var self = this;
            var element = self.element;

            // Retrieve current tab
            this.currentTab = $("#bz-fm-commandseditor-tabs", element).tabs("option", "selected");
            var parent = this.currentTab == 0 ? $(".bz-fm-commandseditor-actions").parent() : $(".bz-fm-commandseditor-validations").parent();
            this.scrollPosition = parent.scrollTop();

            // Render again
            this.render();
        },

        /*
        *   Renders the preview editor
        */
        render: function () {
            var self = this;
            var element = self.element;

            // Clear everything
            element.empty();

            // Wait for templates
            $.when(self.loadTemplates()).done(function () {

                // Render
                var mainTemplate = self.getTemplate("container");
                $.tmpl(mainTemplate, self.model.getReadOnlyModel()).appendTo(element);

                // Apply tabs plugin
                $("#bz-fm-commandseditor-tabs", element).tabs({
                    selected: self.currentTab
                });

                // Scroll to previous position
                if (self.scrollPosition) {
                    var parent = self.currentTab == 0 ? $(".bz-fm-commandseditor-actions").parent() : $(".bz-fm-commandseditor-validations").parent();
                    parent.scrollTop(self.scrollPosition);
                }

                // Changes enabled view
                self.changeEnabledView();

            });
        },

        changeEnabledView: function () {
            var self = this;
            var element = self.element;
            var liAction, disableElement, checkElement;

            var actions = self.model.actions;
            $.each(actions, function( key, value ) {
                if(value.enabled == false)
                {
                    liAction = "li[data-guid='" + value.guid + "']";
                    disableElement = element.find(liAction);
                    checkElement = $(".ui-comboBox-image-small-check" , disableElement);

                    self.disableActionsView(disableElement, checkElement);
                }
            });

            var validations = self.model.validations;
            $.each(validations, function( key, value ) {
                if(value.enabled == false)
                {
                    liAction = "li[data-guid='" + value.guid + "']";
                    disableElement = element.find(liAction);
                    checkElement = $(".ui-comboBox-image-small-check" , disableElement);

                    self.disableActionsView(disableElement, checkElement);
                }
            });

            self.updateEnabledAllChecked();
            self.initActionSearch();
            self.initValidationSearch();
            self.actionPositionHandlers();
            self.validationPositionHandlers();
            self.initTooltips();
        },

        disableActionsView: function (disableElement, checkElement) {
            var checkMessage = bizagi.localization.getResource("formmodeler-component-enable");
            var uncheckMessage = bizagi.localization.getResource("formmodeler-component-disable");
            var isChecked;

            checkElement.toggleClass("ui-comboBox-image-small-uncheck");
            checkElement.addClass("bz-point_16x16_standard");
            disableElement.toggleClass("bz-fm-commandseditor-component-disable");

            if(checkElement.hasClass("ui-comboBox-image-small-uncheck"))
            {

                checkElement.prop('title', checkMessage);
                isChecked = false;

                checkElement.removeClass("bz-point_16x16_standard");
                checkElement.addClass("bz-black");
                checkElement.addClass("bz-point_16x16_black");

            } else {

                checkElement.prop('title', uncheckMessage);
                isChecked = true;

                checkElement.removeClass("bz-black");
                checkElement.removeClass("bz-point_16x16_black");
                checkElement.addClass("bz-point_16x16_standard");

            }

            return isChecked;
        },

        initTooltips: function () {
            var self = this;
            var element = self.element;

            var edit = element.find(".bz-fm-commandseditor-icons-edit");
            var toDelete = element.find(".bz-fm-commandseditor-icons-delete");
            var toogle = element.find(".bz-fm-commandseditor-icons-toogle");
            var moveUp = element.find(".bz-fm-commandseditor-icons-action-move-up");
            var moveDown = element.find(".bz-fm-commandseditor-icons-action-move-down");

            edit.tooltip({ tooltipClass: 'ui-widget-content ui-propertybox-tooltip', position: { my: "left+15 center", at: "right center" }});
            toDelete.tooltip({ tooltipClass: 'ui-widget-content ui-propertybox-tooltip', position: { my: "left+15 center", at: "right center" } });
            toogle.tooltip({ tooltipClass: 'ui-widget-content ui-propertybox-tooltip', position: { my: "left+15 center", at: "right center" } });
            moveDown.tooltip({ tooltipClass: 'ui-widget-content ui-propertybox-tooltip', position: { my: "left+15 center", at: "right center" } });
            moveUp.tooltip({ tooltipClass: 'ui-widget-content ui-propertybox-tooltip', position: { my: "left+15 center", at: "right center" } });
        },

        updateEnabledAllChecked:function () {
            var self = this;
            var element = self.element;

            var buttonsAction = element.find(".bz-fm-commandseditor-action .ui-comboBox-image-small-check").length;
            var buttonsActionEnabled = element.find(".bz-fm-commandseditor-action .ui-comboBox-image-small-uncheck").length;
            var onOffToggleActions = $("#bz-fm-commandseditor-actions-enable-all");

            var buttonsValidation = element.find(".bz-fm-commandseditor-validation .ui-comboBox-image-small-check").length;
            var buttonsValidationEnabled = element.find(".bz-fm-commandseditor-validation .ui-comboBox-image-small-uncheck").length;
            var onOffToggleValidations = $("#bz-fm-commandseditor-validations-enable-all");

            (buttonsAction == buttonsActionEnabled)? onOffToggleActions.prop('checked', false) : onOffToggleActions.prop('checked', true);
            (buttonsValidation == buttonsValidationEnabled)? onOffToggleValidations.prop('checked', false) : onOffToggleValidations.prop('checked', true);
        },

        disableAllActionsView: function (currentActions, buttonsEnabled, enabledAll) {
            var checkMessage = bizagi.localization.getResource("formmodeler-component-enable");
            var uncheckMessage = bizagi.localization.getResource("formmodeler-component-disable");

            if(enabledAll)
            {
                buttonsEnabled.removeClass("bz-black");
                buttonsEnabled.removeClass("bz-point_16x16_black");
                buttonsEnabled.addClass("bz-point_16x16_standard");

                currentActions.removeClass("bz-fm-commandseditor-component-disable");
                buttonsEnabled.removeClass("ui-comboBox-image-small-uncheck");

                buttonsEnabled.prop('title', uncheckMessage);
            }
            else
            {
                buttonsEnabled.removeClass("bz-point_16x16_standard");
                buttonsEnabled.addClass("bz-black");
                buttonsEnabled.addClass("bz-point_16x16_black");

                currentActions.addClass("bz-fm-commandseditor-component-disable");
                buttonsEnabled.addClass("ui-comboBox-image-small-uncheck");
                buttonsEnabled.prop('title', checkMessage);
            }
        },

        // Selection handler
        ".bz-fm-commandseditor-action, .bz-fm-commandseditor-validation click": function (element) {
            var self = this;
            var container = self.element;
            $(".bz-fm-commandseditor-action, .bz-fm-commandseditor-validation", container).removeClass("bz-state-selected").removeClass("ui-state-active");
            element.addClass("bz-state-selected").addClass('ui-state-active');
        },

        // Action edition handler
        ".bz-fm-commandseditor-action .bz-fm-commandseditor-icons-edit click": function (element) {
            var self = this;
            var parent = element.closest(".bz-fm-commandseditor-action");
            var guid = parent.data("guid");
            self.controller.editAction(self.model, guid);
        },

        // Validation edition handler
        ".bz-fm-commandseditor-validation .bz-fm-commandseditor-icons-edit click": function (element) {
            var self = this;
            var parent = element.closest(".bz-fm-commandseditor-validation");
            var guid = parent.data("guid");
            self.controller.editValidation(self.model, guid);
        },

        // Action addition handler
        "#bz-fm-commandseditor-actions-editor .ui-widget-actions button click": function () {
            var self = this;
            self.controller.createAction(self.model);
        },

        // Validation addition handler
        "#bz-fm-commandseditor-validations-editor .ui-widget-actions button click": function () {
            var self = this;
            self.controller.createValidation(self.model);
        },

        // Action delete handler
        ".bz-fm-commandseditor-action .bz-fm-commandseditor-icons-delete click": function (element) {
            var self = this;
            $.when(bizagi.showConfirmationBox(bizagi.localization.getResource("formmodeler-component-delete-action-message"), "Bizagi", "warning"))
            .done(function () {
                var parent = element.closest(".bz-fm-commandseditor-action");
                var guid = parent.data("guid");

                // Delete the action in the model and refresh
                self.model.deleteAction(guid);
                self.refresh();
            });


        },

        // Action disabled handler
        ".bz-fm-commandseditor-action .ui-comboBox-image-small-check click": function (element) {
            var self = this;

            var isChecked = self.disableActionsView(element.parents("li"), element);
            self.updateEnabledAllChecked();

            var parent = element.closest(".bz-fm-commandseditor-action");
            var guid = parent.data("guid");
            self.model.changeActionStateEnabled(guid, isChecked);
        },

        // Action disabled all actions handler
        "#bz-fm-commandseditor-actions-enable-all click": function (elementHandler) {
            var self = this;
            var element = self.element;

            var currentActions = element.find(".bz-fm-commandseditor-action");
            var buttonsEnabled = element.find(".bz-fm-commandseditor-action .ui-comboBox-image-small-check");

            var enabledAll = elementHandler.is(':checked');
            self.disableAllActionsView(currentActions, buttonsEnabled, enabledAll);

            self.model.changeAllActionStateEnabled(enabledAll);
        },

        // Validation delete handler
        ".bz-fm-commandseditor-validation .bz-fm-commandseditor-icons-delete click": function (element) {
            var self = this;
            $.when(bizagi.showConfirmationBox(bizagi.localization.getResource("formmodeler-component-delete-validation-message"), "Bizagi", "warning"))
            .done(function () {
                var parent = element.closest(".bz-fm-commandseditor-validation");
                var guid = parent.data("guid");

                // Delete the validation in the model and refresh
                self.model.deleteValidation(guid);
                self.refresh();
                // Sets the second tab when validation is saved
                $("#bz-fm-commandseditor-tabs", self.element).tabs("option", "active", 1);
            });

        },

        // Validation disabled handler
        ".bz-fm-commandseditor-validation .ui-comboBox-image-small-check click": function (element) {
            var self = this;

            var isChecked = self.disableActionsView(element.parents("li"), element);
            self.updateEnabledAllChecked();

            var parent = element.closest(".bz-fm-commandseditor-validation");
            var guid = parent.data("guid");
            self.model.changeValidationStateEnabled(guid, isChecked);
        },

        // Action disabled all validations handler        
        "#bz-fm-commandseditor-validations-enable-all change": function (elementHandler) {
            var self = this;
            var element = self.element;

            var currentActions = element.find(".bz-fm-commandseditor-validation");
            var buttonsEnabled = element.find(".bz-fm-commandseditor-validation .ui-comboBox-image-small-check");

            var enabledAll = elementHandler.is(':checked');
            self.disableAllActionsView(currentActions, buttonsEnabled, enabledAll);

            self.model.changeAllValidationStateEnabled(enabledAll);
        },

        /*
        *   Load all the templates needed
        */
        loadTemplates: function () {
            var self = this;
            var defer = new $.Deferred();

            $.when(
                self.loadTemplate("container", bizagi.getTemplate("bizagi.editor.component.commandseditor").concat("#commands-editor-container"))
            ).done(function () {
                defer.resolve();
            });

            return defer.promise();
        },

        /*
        *   Load a single template
        */
        loadTemplate: function (name, path) {
            var self = this;
            var defer = new $.Deferred();
            if (self.tmpl[name]) {
                defer.resolve(self.tmpl[name]);
            } else {
                return bizagi.templateService.getTemplate(
                    path
                ).done(function (tmpl) {
                    self.tmpl[name] = tmpl;
                });
            }
            return defer.promise();
        },

        /*
        *   Gets a template
        */
        getTemplate: function (name) {
            if (this.tmpl[name]) {
                return this.tmpl[name];
            } else {
                return null;
            }
        },
        /*
         *   init Action Position Handlers
         */
        actionPositionHandlers: function(){
            var self = this;
            var element = self.element;
            var moveUp = element.find(".bz-fm-commandseditor-icons-action-move-up");
            var moveDown = element.find(".bz-fm-commandseditor-icons-action-move-down");

            moveUp.click(function() {
                var parent = $(this).closest(".bz-fm-commandseditor-action");
                var prev = $(parent).prev();
                var guid = $(parent).data("guid");
                self.model.moveActionUp(guid);
                $(parent).insertBefore(prev);
            });
            moveDown.click(function() {
                var parent = $(this).closest(".bz-fm-commandseditor-action");
                var next = $(parent).next();
                var guid = $(parent).data("guid");
                self.model.moveActionDown(guid);
                $(parent).insertAfter(next);
            });
        },

        /*
         *   init Validation Position Handlers
         */
        validationPositionHandlers: function(){
            var self = this;
            var element = self.element;
            var moveUp = element.find(".bz-fm-commandseditor-icons-validation-move-up");
            var moveDown = element.find(".bz-fm-commandseditor-icons-validation-move-down");
            moveDown.tooltip({ tooltipClass: 'ui-widget-content ui-propertybox-tooltip' });
            moveUp.tooltip({ tooltipClass: 'ui-widget-content ui-propertybox-tooltip' });
            moveUp.click(function() {
                var parent = $(this).closest(".bz-fm-commandseditor-validation");
                var prev = $(parent).prev();
                var guid = $(parent).data("guid");
                self.model.moveValidationUp(guid);
                $(parent).insertBefore(prev);
            });
            moveDown.click(function() {
                var parent = $(this).closest(".bz-fm-commandseditor-validation");
                var next = $(parent).next();
                var guid = $(parent).data("guid");
                self.model.moveValidationDown(guid);
                $(parent).insertAfter(next);
            });
        },
        /*
         *   init action search function
         */
        initActionSearch: function () {
            var self = this;
            var element = self.element;
            var textToSearch = element.find("#bz-fm-commandseditor-actions-text-to-search");
            var actionElements = element.find(".bz-fm-commandseditor-action");
            var includeCondition = element.find("#bz-fm-commandseditor-condition");
            var includeStatements = element.find("#bz-fm-commandseditor-statement");
            var includeElseStatements = element.find("#bz-fm-commandseditor-elsestatement");

            textToSearch.change(function () {
                self.showActionsFound(actionElements, textToSearch);
            });
            includeCondition.change(function () {
                self.showActionsFound(actionElements, textToSearch);
            });
            includeStatements.change(function () {
                self.showActionsFound(actionElements, textToSearch);
            });
            includeElseStatements.change(function () {
                self.showActionsFound(actionElements, textToSearch);
            });
        },


        /*
         *   init validation search function
         */
        initValidationSearch: function () {
            var self = this;
            var element = self.element;
            var validatioTextToSearch = element.find("#bz-fm-commandseditor-validations-text-to-search");
            var validationElements = element.find(".bz-fm-commandseditor-validation");
            validatioTextToSearch.change(function () {
                self.showValidationsFound(validationElements, validatioTextToSearch);
            });
        },


        /*
         *   show Found actions
         */
        showActionsFound: function (actionElements, textToSearch) {
            var self = this;
            var element = self.element;
            var includeCondition = element.find("#bz-fm-commandseditor-condition").is(':checked') || false;
            var includeStatements = element.find("#bz-fm-commandseditor-statement").is(':checked') || false;
            var includeElseStatements = element.find("#bz-fm-commandseditor-elsestatement").is(':checked') || false;


            var textToSearchValue = textToSearch.val();
            if (textToSearchValue.length > 2) {
                actionElements.hide();
                textToSearchValue = textToSearchValue.toUpperCase();
                //busqueda aproximada

                for (var i = 0; i < actionElements.length; i++) {
                    var textConditions = $(actionElements[i]).find("span.bz-fm-commandseditor-condition-xpath.biz-highlight-1-color");
                    var textStatements = $(actionElements[i]).find("[data-section='then']").find("span.bz-fm-commandseditor-statement-xpath.biz-highlight-1-color");
                    var textElseStatements = $(actionElements[i]).find("[data-section='else']").find("span.bz-fm-commandseditor-statement-xpath.biz-highlight-1-color");
                    //evaluate textConditions
                    if(includeCondition){
                        for (var j = 0; j < textConditions.length; j++) {
                            if ($(textConditions[j]).html().toUpperCase().indexOf(textToSearchValue) > -1) {
                                $(actionElements[i]).show();
                                break;
                            }
                        }
                    }
                    //evaluate textStatements
                    if(includeStatements){
                        for (var k = 0; k < textStatements.length; k++) {
                            if ($(textStatements[k]).html().toUpperCase().indexOf(textToSearchValue) > -1) {
                                $(actionElements[i]).show();
                                break;
                            }
                        }
                    }
                    //evaluate textElseStatements
                    if(includeElseStatements){
                        for (var l = 0; l < textElseStatements.length; l++) {
                            if ($(textElseStatements[l]).html().toUpperCase().indexOf(textToSearchValue) > -1) {
                                $(actionElements[i]).show();
                                break;
                            }
                        }
                    }
                }
            }
            else if (textToSearchValue === "") {
                actionElements.show();
            }
        },

        /*
         *   show Found actions
         */
        showValidationsFound: function (validationElements, textToSearch) {
            var self = this;
            var element = self.element;
            var textToSearchValue = textToSearch.val();
            if (textToSearchValue.length > 2) {
                validationElements.hide();
                textToSearchValue = textToSearchValue.toUpperCase();
                //busqueda aproximada

                for (var i = 0; i < validationElements.length; i++) {
                    var textConditions = $(validationElements[i]).find("span.bz-fm-commandseditor-condition-xpath.biz-highlight-1-color");
                    //evaluate textConditions
                    for (var j = 0; j < textConditions.length; j++) {
                        if ($(textConditions[j]).html().toUpperCase().indexOf(textToSearchValue) > -1) {
                            $(validationElements[i]).show();
                            break;
                        }
                    }
                }
            }
            else if (textToSearchValue === "") {
                validationElements.show();
            }
        }
    }
);