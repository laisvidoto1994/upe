/*
* jQuery BizAgi Form Container Widget 0.1 
* Copyright (c) http://www.bizagi.com
*
* Depends:
*	jquery.ui.core.js
*	jquery.ui.widget.js
*	jquery.ui.button.js
*	jquery.metadata.js
*	bizagi.ui.container.base.js
*/
(function ($) {

    /* Set to true in order to debug*/
    var BIZAGI_COMMAND_THROW_ERROR = true;

    $.ui.baseContainer.subclass('ui.formContainer', {
        /* Renders the container*/
        _render: function () {
            var self = this,
            properties = self.options.properties,
            container = self.element;
        },

        _renderChildren: function () {
            var self = this,
                container = self.element,
                doc = this.ownerDocument;

            // Extract container metadata
            self.properties = container.metadata({ type: 'attr', name: 'properties', single: 'bizagi' });

            // Call base
            $.ui.baseContainer.prototype._renderChildren.apply(this, arguments);

            // Add style
            container.addClass("ui-widget-content");

            // Add buttons
            self._renderButtons();

            // Add validation box
            self.validating = false;
            self._renderValidationBox();

            //  Bind commands and validations rules
            if (self.properties.actions) {
                self._processActions(self.properties.actions);
            }

            if (self.properties.validations) {
                self._processValidations(self.properties.validations);
            }
        },

        /* PUBLIC METHODS*/

        /* Add a validation message*/
        addValidation: function (message, focus) {
            var self = this,
                container = self.element;

            var validationItem = $('<div class="ui-bizagi-container-form-validation-item ui-widget-content" />')
                                  .append('<span class="ui-icon ui-icon-circle-close" />')
                                  .append('<label>' + message + '</label>')
                                  .appendTo(self.validationsContent);

            var render = self.getRender(focus);
            if (render) {
                // Bind focus
                validationItem.click(function () {

                    render.baseRender("focus");
                });

                // Add error message
                render.baseRender("setValidationMessage", message);

                // Attach handler to perform validations after the render has been changed
                var renderChangeHandler = function (e, ui) {
                    // First hide and clear validation box
                    self.clearValidations();

                    // Run validations
                    self.validating = true;
                    self._doValidations();
                    self.validating = false;

                    // Attempt to hide if there are no validations
                    if ($(".ui-bizagi-container-form-validation-item", self.validationsContent).size() == 0) {
                        self.validationsContainer.fadeOut();
                    }
                }
                // Bind event
                if (!self.validating) render.baseRender("oneTimeEvent", "validate", renderChangeHandler);
            }
        },

        /* Clear all the validations*/
        clearValidations: function (message) {
            var self = this,
                container = self.element;

            self.validationsContent.empty();
        },

        /* Hide the validations box*/
        hideValidations: function () {
            var self = this,
                container = self.element;

            if ($(".ui-bizagi-container-form-validation-item", self.validationsContent).size() == 0) {
                self.validationsContainer.fadeOut();
            }
        },

        /* Show the validations box*/
        showValidations: function () {
            var self = this,
                container = self.element;

            self.validationsContainer.css("top", self._getValidationsTop() + $(window).scrollTop() + "px");
            self.validationsContainer.fadeIn();
        },

        /* Gets the first editable render */
        getRender: function (xpath) {
            var renderSearch;
            $("#" + encodeXpath(xpath), self.element).each(function (i) {
                var render = $(this).parents(".ui-bizagi-render:first");
                if (render.baseRender("option", "editable")) {
                    renderSearch = render;
                }
            });

            return renderSearch;
        },

        // Finds a collection of renders in the page
        getRenders: function (xpath) {
            var self = this,
                container = self.element;

            var renderSearch = [];
            $("#" + encodeXpath(xpath), container).each(function (i) {
                var render = $(this).parents(".ui-bizagi-render:first");
                renderSearch.push(render);
            });

            if (renderSearch.length == 0) return null;

            return renderSearch;
        },

        // Finds a container in the page
        getContainer: function (containerId) {
            var self = this,
                container = self.element;

            var containerSearch = $(".ui-bizagi-container[container-id=" + BIZAGI_CONTAINER_PREFIX + containerId + "]:first", container);

            if (containerSearch.length == 0) return null;
            return containerSearch;
        },



        /* Process a single action*/
        processAction: function (action) {
            var self = this;
            var dependencies = [];

            // Find dependencies to attach triggers
            for (var i = 0; i < action.dependencies.length; i++) {
                var renders = self.getRenders(action.dependencies[i]);
                if (renders) {
                    $.each(renders, function (i) {
                        var render = $(this);
                        dependencies.push(render);
                    });

                }
            }

            // Build anonymous function
            var fn = self._buildFunction(action.conditions, action.logicalOperator, action.commands);

            // Attach handlers
            $.each(dependencies, function (i) {
                var render = $(this);
                render.baseRender("bindEvent", "change", function (e, ui) {
                    // Call function
                    fn();
                });
            });
        },

        /* 
        Reloads a container or the full form with the content, and finally focuses on the triggering render
        */
        reloadContainer: function (containerId, content, focus) {
            var self = this;

            if (containerId == 'all') {
                // Reload all
                self.element.baseContainer("destroy");
                self.element.html(content);
                self.element.formContainer();

            } else {
                // Reload an specific container

                // Find container
                var container = self.getContainer(containerId);
                if (container == null) return;

                // Load content in memory
                var $content = $(content);

                // Clean container and copy from content
                container.baseContainer("destroy");
                container.empty();
                container.attr("id", $content.attr("id"));
                container.attr("class", $content.attr("class"));
                container.attr("style", "");
                container.show();
                container.attr("properties", $content.attr("properties"));
                container.html($content.html());

                // Apply plugin
                self._applyContainerPlugin(container);
            }

            // At the end return focus to this control
            var renders = self.getRenders(focus);
            if (renders && renders.length > 0) {
                renders[0].baseRender("focus");
            }
        },

        /* PRIVATE METHODS */

        /* Render all buttons*/
        _renderButtons: function () {
            var self = this,
                container = self.element;

            if (!container.properties.buttons) return;

            // Creates div container
            self.buttonInfo = $('<input type="hidden" id="h_button" name="h_button" />');
            self.buttonContainer = $('<div class="ui-bizagi-button-container" align="center">');


            // Render buttons from metadata
            for (var i = 0; i < container.properties.buttons.length; i++) {
                self._renderButton(container.properties.buttons[i]);
            }

            // Append to container
            container.append(self.buttonInfo)
                     .append(self.buttonContainer);

            // Bind button events
            $(".ui-bizagi-button-container input", container).each(function (i) {
                var button = $(this);

                button.click(function () {
                    // First hide and clear validation box
                    self.hideValidations();
                    self.clearValidations();

                    if (button.data("validate") == true) {

                        // If validations method returns false, don't submit the form
                        if (!self._doValidations())
                            return;
                    }
                    self.buttonInfo.val(button.attr("action"));
                    container.submit();
                });
            });
        },

        /* Render a single button */
        _renderButton: function (buttonData) {
            var self = this;

            // Adds button HTML
            var button = $('<input type="button" class="ui-bizagi-button ui-button-text"/>')
                .attr("value", buttonData.text)
                .attr("action", buttonData.action)
                .data("validate", buttonData.triggerValidations || false);

            var span = $('<span class="ui-button-text ui-button ui-widget ui-state-default ui-corner-all"></span>')
                .append(button)
                .appendTo(self.buttonContainer);
        },

        /* Render the validation messages box*/
        _renderValidationBox: function () {
            var self = this,
                container = self.element;

            // Creates element
            self.validationsContent = $('<div class="ui-bizagi-container-form-validations-content" />')
                                       .addClass("ui-widget-content");

            var header = $('<div class="ui-bizagi-container-form-validations-header" />')
                          .addClass("ui-widget-header ui-state-active")
                          .text($.bizAgiResources["bizagi-ui-form-validations-header-text"]);

            var headerButton = $('<span class="ui-bizagi-validation-box-button ui-icon" />')
                                .addClass("ui-icon-triangle-1-s")
                                .data("expanded", true)
                                .appendTo(header)
                                .click(function () {
                                    if (headerButton.data("expanded") == true) {
                                        // Collapse
                                        headerButton.removeClass("ui-icon-triangle-1-s");
                                        headerButton.addClass("ui-icon-triangle-1-n");
                                        headerButton.data("expanded", false);

                                        self.validationsContent.hide();
                                    } else {
                                        // Expand
                                        headerButton.removeClass("ui-icon-triangle-1-n");
                                        headerButton.addClass("ui-icon-triangle-1-s");
                                        headerButton.data("expanded", true);

                                        self.validationsContent.show();
                                    }

                                    var offset = self._getValidationsTop() + $(window).scrollTop() + "px";
                                    self.validationsContainer.animate({ top: offset }, { duration: 500, queue: false });
                                });

            self.validationsContainer = $('<div class="ui-bizagi-container-form-validations" />')
                                         .append(header)
                                         .append(self.validationsContent)
                                         .appendTo(container);

            // Set as floating
            $(window).bind("scroll resize", function () {
                if (self.validationsContainer.css("display") != "none") {
                    var offset = self._getValidationsTop() + $(window).scrollTop() + "px";
                    //self.validationsContainer.animate({ top: offset }, { duration: 500, queue: false });
                    self.validationsContainer.css({ top: offset });
                }
            });
        },

        _getValidationsTop: function () {
            var self = this;

            var elementHeight = self.validationsContainer.height();
            return elementTop = $(window).height() - elementHeight - 15;
        },

        /* Perform all validations*/
        _doValidations: function () {
            var self = this;

            // Run render validations
            var bRendersValid = self._validateRenders();

            // Run form validations
            var bFormValid = self._trigger("validate");

            // Show validations if invalid
            if (!bFormValid || !bRendersValid) {
                self.showValidations();
                return false;
            }

            return true;
        },

        /* Validate all renders in the container */
        _validateRenders: function () {
            var self = this;
            var invalidElements = [];

            // Do a check
            var bValid = self.isValid(invalidElements);
            if (!bValid) {
                for (var i = 0; i < invalidElements.length; i++) {
                    self.addValidation(invalidElements[i].message, invalidElements[i].xpath);
                }
            }

            return bValid;
        },

        /* Process all given  actions*/
        _processActions: function (actions) {
            var self = this;

            for (var i = 0; i < actions.length; i++) {
                self.processAction(actions[i]);
            }
        },

        /* Process all given validations*/
        _processValidations: function (validations) {
            var self = this;

            var fnValidations = self._buildAllValidations(validations);
            self.bindEvent("validate", function (e, ui) {
                return fnValidations();
            });
        },

        /* Creates a function to be executed when the button associated are clicked*/
        _buildAllValidations: function (validations) {
            var self = this;
            var sJSCode = "";
            for (var i = 0; i < validations.length; i++) {
                sJSCode += self._buildValidation(validations[i].conditions, validations[i].logicalOperator, validations[i].validationCommand);
            }

            // Build final function
            sStatement = "var baTmpFn = function(){\r\n var bValid = true;\r\n " + sJSCode + "\r\n return bValid;}; baTmpFn";

            // Return interpreted function
            return eval(sStatement);
        },

        /*
        * Creates the function to execute based on the action metadata
        */
        _buildFunction: function (conditions, logicalOperator, actions) {
            var self = this;

            var sJSCondition = "";
            var sJSAction = "";
            var sStatement = "";
            var sJSElseAction = "";
            var sLogicalOperator = conditions.length > 1 ? self._buildConditionOperator(logicalOperator) : "";

            // Build Condition
            for (var i = 0; i < conditions.length; i++) {
                sJSCondition += "( " + self._buildCondition(conditions[i]) + " ) " + (i < conditions.length - 1 ? sLogicalOperator : "");
            }

            // Build and execute actions
            for (var i = 0; i < actions.length; i++) {
                sJSAction += self._buildAction(actions[i]);
                sJSElseAction += self._buildRestoreAction(actions[i]);
            }

            // Build final function
            sStatement = "var baTmpFn = function(){ ";
            if (conditions.length > 0) {
                sStatement += "if (" + sJSCondition + "){ ";
            }

            sStatement += sJSAction;

            if (conditions.length > 0) {
                sStatement += " } else { " + sJSElseAction + " }";
            }

            sStatement += "}; baTmpFn";

            // Return interpreted function
            return eval(sStatement);
        },

        /* Creates the code to execute based on the validation metadata*/
        _buildValidation: function (conditions, logicalOperator, validationCommand) {
            var self = this;
            var sJSCondition = "";
            var sJSValidation = "";
            var sStatement = "";
            var sLogicalOperator = conditions.length > 1 ? self._buildConditionOperator(logicalOperator) : "";

            // Build Condition
            for (var i = 0; i < conditions.length; i++) {
                sJSCondition += "( " + self._buildCondition(conditions[i]) + " ) " + (i < conditions.length - 1 ? sLogicalOperator : "");
            }

            // Build Message
            var focus = validationCommand.focus || "";
            if (validationCommand.tokens)
                sJSValidation += "self._showValidation(' " + validationCommand.message + "', '" + focus + "', JSON.parse('" + JSON.encode(validationCommand.tokens) + "')); bValid = false;\r\n";
            else
                sJSValidation += "self._showValidation(' " + validationCommand.message + "', '" + focus + "'); bValid = false;\r\n";

            // Build final statement
            return "if (" + sJSCondition + "){\r\n " + sJSValidation + " \r\n}";
        },

        /* 
        * Returns the logical operator in JS
        * 1 = && (AND)
        * 2 = || (OR)
        */
        _buildConditionOperator: function (logicalOperator) {
            if (logicalOperator == 1) return " && ";
            if (logicalOperator == 2) return " || ";
        },

        /* 
        *   Returns the condition in JS
        *   Operators: 
        *       1. =    2. !=   3. <    4. <=   5. >    6. >=
        *       7. LIKE 8. IS NULL  9. IS NOT NULL  10. IS EMPTY    
        *       11. IS NOT EMPTY    12. IS TRUE     13. IS FALSE
        */
        _buildCondition: function (condition) {
            var self = this;
            var sXpath = "";
            var sArgument = "";
            var sJSCondition = "";
            var operator = condition.operator;

            // Build xpath
            sXpath = self._buildXpath(condition.xpath, condition.argumentType);

            // Build argument
            sArgument = self._buildArgument(condition.argument, condition.argumentType);

            // Build condition
            if (operator == 1) return sXpath + " == " + sArgument;
            if (operator == 2) return sXpath + " != " + sArgument;
            if (operator == 3) return sXpath + " < " + sArgument;
            if (operator == 4) return sXpath + " <= " + sArgument;
            if (operator == 5) return sXpath + " > " + sArgument;
            if (operator == 6) return sXpath + " >= " + sArgument;
            if (operator == 7) return sXpath + ".toString().indexOf(" + sArgument + ") > 0";
            if (operator == 8) return sXpath + " == null";
            if (operator == 9) return sXpath + " != null";
            if (operator == 10) return sXpath + ".toString().length == 0";
            if (operator == 11) return sXpath + ".toString().length > 0";
            if (operator == 12) return sXpath + " == true";
            if (operator == 13) return sXpath + " == false";

            // If there is another operator code throw exception
            throw new "There is no implementation for operator code " + operator;
        },

        /* 
        *   Returns the JS code to eval a xpath
        */
        _buildXpath: function (xpath, argumentType) {
            if (argumentType == 7) {
                return "self._evalXpath('" + xpath + "')";
            }
            return "self._evalXpath('" + xpath + "', " + argumentType + ")";
        },

        /* 
        *   Returns the JS code representing the argument
        *   Argument Type codes:
        *   1. text     2.boolean   3. number   4. date 
        *   5. color    6. entity   7. xpath,   8 . array
        */
        _buildArgument: function (argument, argumentType) {
            if (argumentType == 1) {
                // Text
                return "'" + argument.toString() + "'";
            }
            if (argumentType == 2) {
                // Boolean
                return (eval(argument) == true ? "true" : "false");
            }
            if (argumentType == 3) {
                // Number
                var number = new Number(argument);
                if (number == NaN) return "-99999999";
                return number.toString();
            }
            if (argumentType == 4) {
                //Date
                var date;
                if (!isDate(argument, BA_DEFAULT_DATE_FORMAT)) date = new Date(0);
                else date = getDateFromFormat(argument, BA_DEFAULT_DATE_FORMAT);

                return "'" + formatDate(date, BA_DEFAULT_DATE_FORMAT) + "'";
            }
            if (argumentType == 5) {
                // Color
                return "'" + argument.toString() + "'";
            }
            if (argumentType == 6) {
                // Entity value
                return argument.toString();
            }
            if (argumentType == 7) {
                // Xpath value
                return "self._evalXpath('" + argument.toString() + "')";
            }
            if (argumentType == 8) {
                // Xpath value
                return JSON.encode(argument);
            }
            if (argumentType == undefined) {
                return null;
            }

            // If there is another argument type code throw exception
            throw new "There is no implementation for argument type " + argumentType;
        },

        /*
        *   Returns the action JS
        *   Available commands:
        *   1.  Change Background (apply for renders and containers)
        *   2.  Change color (apply for renders)
        *   3.  Changes visibility (apply for renders and containers)
        *   4.  Changes editability (apply for renders)
        *   5.  Changes required value (apply for renders)
        *   6.  Changes the render value (apply for renders) 
        *   7.  Collapses the container (apply for groups) 
        *   8.  Changes active item in the container (apply for tab and accordeon)
        *   9.  Set renders as read only (apply just for containers)
        *   10. Changes the min value for a render (apply for date and numeric renders)
        *   11. Changes the max value for a render (apply for date and numeric renders)
        *   12. Executes a calculated field
        *   13. Refresh a field from the server
        *   14. Submit a field and refresh some renders or containers
        */
        _buildAction: function (action) {
            var self = this;
            var command = action.command;

            // Parse argument
            var argument = self._buildArgument(action.argument, action.argumentType);

            if (action.xpath && action.xpath.length > 0) {
                // Build render command
                if (command == 1) return "self._changeRenderBackground('" + action.xpath + "', " + argument + ");";
                if (command == 2) return "self._changeRenderForeground('" + action.xpath + "', " + argument + ");";
                if (command == 3) return "self._changeRenderVisibility('" + action.xpath + "', " + argument + ");";
                if (command == 4) return "self._changeRenderEditability('" + action.xpath + "', " + argument + ");";
                if (command == 5) return "self._changeRenderRequired('" + action.xpath + "', " + argument + ");";
                if (command == 6) return "self._changeRenderValue('" + action.xpath + "', " + argument + ");";
                if (command == 10) return "self._changeRenderMinValue('" + action.xpath + "', " + argument + ");";
                if (command == 11) return "self._changeRenderMaxValue('" + action.xpath + "', " + argument + ");";
                if (command == 12) return "self._executeCalculatedField('" + action.xpath + "');";
                if (command == 13) return "self._refreshValueFromAjax('" + action.xpath + "');";
                if (command == 14) return "self._submitRender('" + action.xpath + "', '" + argument + "');";

            } else {
                // Build container command
                if (command == 1) return "self._changeContainerBackground('" + action.container + "', " + argument + ");";
                if (command == 3) return "self._changeContainerVisibility('" + action.container + "', " + argument + ");";
                if (command == 7) return "self._toogleContainer('" + action.container + "', " + argument + ");";
                if (command == 8) return "self._changeActiveItem('" + action.container + "');";
                if (command == 9) return "self._changeContainerEditability('" + action.container + "', " + argument + ");";
            }
        },

        /* 
        *   Builds the JS command to restore the render when condition is not met
        */
        _buildRestoreAction: function (action) {
            var command = action.command;
            if (action.xpath && action.xpath.length > 0) {
                return "self._restoreRender('" + action.xpath + "', " + command + ");";
            } else {
                return "self._restoreContainer('" + action.container + "', " + command + ");";
            }
        },

        /* 
        *   Evals an xpath to find a render and return its value 
        */
        _evalXpath: function (xpath, argumentType) {
            var self = this;

            var renders = self.getRenders(xpath);
            if (renders == null) { if (BIZAGI_COMMAND_THROW_ERROR) { self._showRenderNotFoundError(xpath); } return null; }

            // Eval only an editable render
            $.each(renders, function (i) {
                var render = $(this);
                if (render.baseRender('option', 'editable')) {
                    renderToEval = render;
                }
            });

            var value = renderToEval.baseRender("option", "value");

            if (argumentType == undefined) {
                return value;
            }

            return eval(self._buildArgument(value, argumentType));
        },

        /* 
        *   Sets a new color for the background of the render
        */
        _changeRenderBackground: function (xpath, argument) {
            var self = this;
            var renders = self.getRenders(xpath);
            if (renders == null) { if (BIZAGI_COMMAND_THROW_ERROR) { self._showRenderNotFoundError(xpath); } return null; }

            $.each(renders, function (i) {
                var render = this;
                render.baseRender('changeBackgroundColor', argument);
            });
        },

        /* 
        *   Sets a new color for the foreground of the render
        */
        _changeRenderForeground: function (xpath, argument) {
            var self = this;
            var renders = self.getRenders(xpath);
            if (renders == null) { if (BIZAGI_COMMAND_THROW_ERROR) { self._showRenderNotFoundError(xpath); } return null; }

            $.each(renders, function (i) {
                var render = this;
                render.baseRender('changeColor', argument);
            });
        },

        /* 
        *   Changes the visibility of the render
        */
        _changeRenderVisibility: function (xpath, argument) {
            var self = this;
            var renders = self.getRenders(xpath);
            if (renders == null) { if (BIZAGI_COMMAND_THROW_ERROR) { self._showRenderNotFoundError(xpath); } return null; }

            $.each(renders, function (i) {
                var render = this;
                render.baseRender('changeVisibility', argument);
            });
        },

        /* 
        *   Changes the editability of the render
        */
        _changeRenderEditability: function (xpath, argument) {
            var self = this;
            var renders = self.getRenders(xpath);
            if (renders == null) { if (BIZAGI_COMMAND_THROW_ERROR) { self._showRenderNotFoundError(xpath); } return null; }

            $.each(renders, function (i) {
                var render = this;
                render.baseRender('changeEditability', argument);
            });
        },

        /* 
        *   Changes the required value of the render
        */
        _changeRenderRequired: function (xpath, argument) {
            var self = this;
            var renders = self.getRenders(xpath);
            if (renders == null) { if (BIZAGI_COMMAND_THROW_ERROR) { self._showRenderNotFoundError(xpath); } return null; }

            $.each(renders, function (i) {
                var render = this;
                render.baseRender('changeRequired', argument);
            });
        },

        /* 
        *   Changes the render internal value
        */
        _changeRenderValue: function (xpath, argument) {
            var self = this;
            var renders = self.getRenders(xpath);
            if (renders == null) { if (BIZAGI_COMMAND_THROW_ERROR) { self._showRenderNotFoundError(xpath); } return null; }

            $.each(renders, function (i) {
                var render = this;
                render.baseRender('option', 'value', argument);
            });
        },

        /* 
        *   Changes the render minimum value
        */
        _changeRenderMinValue: function (xpath, argument) {
            var self = this;
            var renders = self.getRenders(xpath);
            if (renders == null) { if (BIZAGI_COMMAND_THROW_ERROR) { self._showRenderNotFoundError(xpath); } return null; }

            $.each(renders, function (i) {
                var render = this;
                render.baseRender('changeMinValue', argument);
            });
        },

        /* 
        *   Changes the render max value
        */
        _changeRenderMaxValue: function (xpath, argument) {
            var self = this;
            var renders = self.getRenders(xpath);
            if (renders == null) { if (BIZAGI_COMMAND_THROW_ERROR) { self._showRenderNotFoundError(xpath); } return null; }

            $.each(renders, function (i) {
                var render = this;
                render.baseRender('changeMaxValue', argument);
            });
        },

        /* 
        *   Changes the render max value
        */
        _executeCalculatedField: function (renderId) {
            var self = this;
            var renders = self.getRenders(renderId);
            if (renders == null) { if (BIZAGI_COMMAND_THROW_ERROR) { self._showRenderNotFoundError(renderId); } return null; }

            $.each(renders, function (i) {
                var render = this;
                render.calculatedRender('runFormula');
            });
        },

        /* 
        *   Refresh the render internal value using ajax
        */
        _refreshValueFromAjax: function (xpath) {
            var self = this;
            var renders = self.getRenders(xpath);
            if (renders == null) { if (BIZAGI_COMMAND_THROW_ERROR) { self._showRenderNotFoundError(xpath); } return null; }

            $.each(renders, function (i) {
                var render = this;
                render.baseRender('refreshValueFromAjax');
            });
        },

        /* 
        *   Submit the given render and refresh dependencies after that
        */
        _submitRender: function (xpath, argument) {
            var self = this;
            var renders = self.getRenders(xpath);
            if (renders == null) { if (BIZAGI_COMMAND_THROW_ERROR) { self._showRenderNotFoundError(xpath); } return null; }

            $.each(renders, function (i) {
                var render = this;
                render.baseRender('submitRender', argument);
            });
        },

        /* 
        *   Restores render to original value
        *
        *   Available commands:
        *   1.  Change Background (apply for renders and containers)
        *   2.  Change color (apply for renders)
        *   3.  Changes visibility (apply for renders and containers)
        *   4.  Changes editability (apply for renders)
        *   5.  Changes required value (apply for renders)
        *   6.  Changes the render value (apply for renders) 
        *   7.  Collapses the container (apply for groups) 
        *   8.  Changes active item in the container (apply for tab and accordeon)
        *   9.  Set renders as read only (apply just for containers)
        */
        _restoreRender: function (xpath, command) {
            var self = this;
            var renders = self.getRenders(xpath);
            if (renders == null) { if (BIZAGI_COMMAND_THROW_ERROR) { self._showRenderNotFoundError(xpath); } return null; }

            $.each(renders, function (i) {
                var render = $(this);
                var properties = render.baseRender("option", "originalProperties");

                if (command == 1) self._changeRenderBackground(xpath, properties.backgroundColor || 'none');
                if (command == 2) self._changeRenderForeground(xpath, properties.color || 'none');
                if (command == 3) self._changeRenderVisibility(xpath, properties.visible != undefined ? properties.visible : true);
                if (command == 4) self._changeRenderEditability(xpath, properties.editable != undefined ? properties.editable : true);
                if (command == 5) self._changeRenderRequired(xpath, properties.required != undefined ? properties.required : false);
                // NOte: Command 6 does not have restoration
            })
        },

        /* 
        *   Restores container to original value
        *
        *   Available commands:
        *   1.  Change Background (apply for renders and containers)
        *   2.  Change color (apply for renders)
        *   3.  Changes visibility (apply for renders and containers)
        *   4.  Changes editability (apply for renders)
        *   5.  Changes required value (apply for renders)
        *   6.  Changes the render value (apply for renders) 
        *   7.  Collapses the container (apply for groups) 
        *   8.  Changes active item in the container (apply for tab and accordeon)
        *   9.  Set renders as read only (apply just for containers)
        */
        _restoreContainer: function (containerId, command) {
            var self = this;
            var container = self.getContainer(containerId);
            if (container == null) { if (BIZAGI_COMMAND_THROW_ERROR) { self._showContainerNotFoundError(xpath); } return null; }

            var properties = container.baseContainer("option", "originalProperties");
            if (command == 1) self._changeContainerBackground(containerId, properties.backgroundColor || 'none');
            if (command == 3) self._changeContainerVisibility(containerId, properties.visible != undefined ? properties.visible : true);
            if (command == 7) self._toogleContainer(containerId, true);
            // NOte: Command 8 does not have restoration
            if (command == 9) self._changeContainerEditability(containerId, properties.editable != undefined ? properties.editable : true);
        },

        /* 
        *   Helper function to detect metadata errors
        */
        _showRenderNotFoundError: function (xpath) {
            alert("Cannot find render in DOM: " + xpath);
        },

        /* 
        *   Helper function to detect metadata errors
        */
        _showContainerNotFoundError: function (containerId) {
            alert("Cannot find container in DOM: " + containerId);
        },

        /* 
        *   Changes container background color
        */
        _changeContainerBackground: function (containerId, argument) {
            var self = this;
            var container = self.getContainer(containerId);
            if (container == null) { if (BIZAGI_COMMAND_THROW_ERROR) { self._showContainerNotFoundError(containerId); } return null; }

            container.baseContainer('changeBackgroundColor', argument);
        },

        /* 
        *   Shows or hides a container
        */
        _changeContainerVisibility: function (containerId, argument) {
            var self = this;
            var container = self.getContainer(containerId);
            if (container == null) { if (BIZAGI_COMMAND_THROW_ERROR) { self._showContainerNotFoundError(containerId); } return null; }

            container.baseContainer('changeVisibility', argument);
        },

        /* 
        *   Expand or collapse a group container
        */
        _toogleContainer: function (containerId, argument) {
            var self = this;
            var container = self.getContainer(containerId);
            if (container == null) { if (BIZAGI_COMMAND_THROW_ERROR) { self._showContainerNotFoundError(containerId); } return null; }
            if (!container.hasClass("ui-bizagi-container-group")) return null;

            container.groupContainer('toogleContainer', argument);
        },

        /* 
        *   Select a determinate sub-container in a tab or an accordion
        */
        _changeActiveItem: function (containerId) {
            var self = this;
            var container = self.getContainer(containerId);
            if (container == null) { if (BIZAGI_COMMAND_THROW_ERROR) { self._showContainerNotFoundError(containerId); } return null; }

            container.baseContainer('setAsActiveContainer');
        },

        /* 
        *   Changes container editability
        */
        _changeContainerEditability: function (containerId, argument) {
            var self = this;
            var container = self.getContainer(containerId);
            if (container == null) { if (BIZAGI_COMMAND_THROW_ERROR) { self._showContainerNotFoundError(containerId); } return null; }

            container.baseContainer('changeEditability', argument);
        },

        /*
        *   Shows a validation to the user
        */
        _showValidation: function (message, focus, tokens) {
            var self = this;

            // Check tokens
            var sMessage = message;
            if (tokens) {
                for (var i = 0; i < tokens.length; i++) {
                    var renders = self.getRenders(tokens[i]);
                    if (renders && renders.length > 0) {
                        sMessage = sMessage.replaceAll("<" + tokens[i] + ">", "<strong>" + renders[0].baseRender("getValue") + "</strong>");
                    }
                }
            }

            self.addValidation(sMessage, focus);
        }

    });

})(jQuery);