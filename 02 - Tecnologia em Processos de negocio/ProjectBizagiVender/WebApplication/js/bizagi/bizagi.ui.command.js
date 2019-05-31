/// <reference path="jquery.js" />

/*
* BizAgi Form Rules Plugin
* * Load metadata to use dynamic rules to apply in runtime, also build validations
* http://www.visionsoftware.com.co
* 
*/

(function ($) {
    // private closure;  <% /*debug*/ if (false) { %>  
    $ = jQuery;
    // <% } /*end debug*/ %> 

    /* Set to true in order to debug*/
    var BIZAGI_COMMAND_THROW_ERROR = true;

    $.fn.applyBizagiCommands = function (options) {

        // Implementation start here
        var self = this;
        var doc = this.ownerDocument;

        // Extract container metadata
        self.properties = self.metadata({ type: 'attr', name: 'properties', single: 'bizagi' });

        // <main section>
        if (self.properties.actions) {
            processActions(self.properties.actions);
        }

        if (self.properties.validations) {
            processValidations(self.properties.validations);
        }
        // </main section>

        /* Process all actions*/
        function processActions(actions) {
            for (var i = 0; i < actions.length; i++) {
                processAction(actions[i]);
            }
        }

        /* Process all validations*/
        function processValidations(validations) {
            var fnValidations = buildAllValidations(validations);
            self.baseContainer("bindEvent", "validate", function (e, ui) {
                return fnValidations();
            });
        }

        /* Creates a function to be executed when the button associated are clicked*/
        function buildAllValidations(validations) {
            var sJSCode = "";
            for (var i = 0; i < validations.length; i++) {
                sJSCode += buildValidation(validations[i].conditions, validations[i].logicalOperator, validations[i].validationCommand);
            }

            // Build final function
            sStatement = "var baTmpFn = function(){\r\n var bValid = true;\r\n " + sJSCode + "\r\n return bValid;}; baTmpFn";

            // Return interpreted function
            return eval(sStatement);
        }

        /* Process a single action*/
        function processAction(action) {
            var dependencies = [];

            // Find dependencies to attach triggers
            for (var i = 0; i < action.dependencies.length; i++) {
                var renders = getRender(action.dependencies[i])
                if (renders) {
                    $.each(renders, function (i) {
                        var render = $(this);
                        dependencies.push(render);
                    });

                }
            }

            // Build anonymous function
            var fn = buildFunction(action.conditions, action.logicalOperator, action.commands);

            // Attach handlers
            $.each(dependencies, function (i) {
                var render = $(this);
                render.baseRender("bindEvent", "change", function (e, ui) {
                    // Call function
                    fn();
                });
            });
        }


        // Finds a render in the page
        function getRender(xpath) {
            var renderSearch = [];
            $("#" + encodeXpath(xpath), self).each(function (i) {
                var render = $(this).parents(".ui-bizagi-render:first");
                renderSearch.push(render);
            });

            if (renderSearch.length == 0) return null;

            return renderSearch;
        }

        // Finds a container in the page
        function getContainer(containerId) {
            var containerSearch = $(".ui-bizagi-container[container-id=" + BIZAGI_CONTAINER_PREFIX + containerId + "]:first", self);

            if (containerSearch.length == 0) return null;
            return containerSearch;
        }

        /*
        * Creates the function to execute based on the action metadata
        */
        function buildFunction(conditions, logicalOperator, actions) {
            var sJSCondition = "";
            var sJSAction = "";
            var sStatement = "";
            var sJSElseAction = "";
            var sLogicalOperator = conditions.length > 1 ? buildConditionOperator(logicalOperator) : "";

            // Build Condition
            for (var i = 0; i < conditions.length; i++) {
                sJSCondition += "( " + buildCondition(conditions[i]) + " ) " + (i < conditions.length - 1 ? sLogicalOperator : "");
            }

            // Build and execute actions
            for (var i = 0; i < actions.length; i++) {
                sJSAction += buildAction(actions[i]);
                sJSElseAction += buildRestoreAction(actions[i]);
            }

            // Build final function
            sStatement = "var baTmpFn = function(){ if (" + sJSCondition + "){ " + sJSAction + " } else { " + sJSElseAction + " } }; baTmpFn";

            // Return interpreted function
            return eval(sStatement);
        }

        /* Creates the code to execute based on the validation metadata*/
        function buildValidation(conditions, logicalOperator, validationCommand) {
            var sJSCondition = "";
            var sJSValidation = "";
            var sStatement = "";
            var sLogicalOperator = conditions.length > 1 ? buildConditionOperator(logicalOperator) : "";

            // Build Condition
            for (var i = 0; i < conditions.length; i++) {
                sJSCondition += "( " + buildCondition(conditions[i]) + " ) " + (i < conditions.length - 1 ? sLogicalOperator : "");
            }

            // Build Message
            var focus = validationCommand.focus || "";
            if (validationCommand.tokens)
                sJSValidation += "showValidation(' " + validationCommand.message + "', '" + focus + "', JSON.parse('" + JSON.encode(validationCommand.tokens) + "')); bValid = false;\r\n";
            else
                sJSValidation += "showValidation(' " + validationCommand.message + "', '" + focus + "'); bValid = false;\r\n";

            // Build final statement
            return "if (" + sJSCondition + "){\r\n " + sJSValidation + " \r\n}";
        }

        /* 
        * Returns the logical operator in JS
        * 1 = && (AND)
        * 2 = || (OR)
        */
        function buildConditionOperator(logicalOperator) {
            if (logicalOperator == 1) return " && ";
            if (logicalOperator == 2) return " || ";
        }

        /* 
        *   Returns the condition in JS
        
        *   Operators: 
        *       1. =    2. !=   3. <    4. <=   5. >    6. >=
        *       7. LIKE 8. IS NULL  9. IS NOT NULL  10. IS EMPTY    
        *       11. IS NOT EMPTY    12. IS TRUE     13. IS FALSE
        */
        function buildCondition(condition) {
            var sXpath = "";
            var sArgument = "";
            var sJSCondition = "";
            var operator = condition.operator;

            // Build xpath
            sXpath = buildXpath(condition.xpath, condition.argumentType);

            // Build argument
            sArgument = buildArgument(condition.argument, condition.argumentType);

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
        }

        /* 
        *   Returns the JS code to eval a xpath
        */
        function buildXpath(xpath, argumentType) {
            if (argumentType == 7) {
                return "evalXpath('" + xpath + "')";
            }
            return "evalXpath('" + xpath + "', " + argumentType + ")";
        }

        /* 
        *   Returns the JS code representing the argument
        *   Argument Type codes:
        *   1. text     2.boolean   3. number   4. date 
        *   5. color    6. entity   7. xpath
        */
        function buildArgument(argument, argumentType) {
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
                return "evalXpath('" + argument.toString() + "')";
            }
            if (argumentType == undefined) {
                return null;
            }

            // If there is another argument type code throw exception
            throw new "There is no implementation for argument type " + argumentType;
        }

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
        */
        function buildAction(action) {
            var command = action.command;

            // Parse argument
            var argument = buildArgument(action.argument, action.argumentType);

            if (action.xpath && action.xpath.length > 0) {
                // Build render command
                if (command == 1) return "changeRenderBackground('" + action.xpath + "', " + argument + ");";
                if (command == 2) return "changeRenderForeground('" + action.xpath + "', " + argument + ");";
                if (command == 3) return "changeRenderVisibility('" + action.xpath + "', " + argument + ");";
                if (command == 4) return "changeRenderEditability('" + action.xpath + "', " + argument + ");";
                if (command == 5) return "changeRenderRequired('" + action.xpath + "', " + argument + ");";
                if (command == 6) return "changeRenderValue('" + action.xpath + "', " + argument + ");";
                if (command == 10) return "changeRenderMinValue('" + action.xpath + "', " + argument + ");";
                if (command == 11) return "changeRenderMaxValue('" + action.xpath + "', " + argument + ");";

            } else {
                // Build container command
                if (command == 1) return "changeContainerBackground('" + action.container + "', " + argument + ");";
                if (command == 3) return "changeContainerVisibility('" + action.container + "', " + argument + ");";
                if (command == 7) return "toogleContainer('" + action.container + "', " + argument + ");";
                if (command == 8) return "changeActiveItem('" + action.container + "');";
                if (command == 9) return "changeContainerEditability('" + action.container + "', " + argument + ");";
            }
        }

        /* 
        *   Builds the JS command to restore the render when condition is not met
        */
        function buildRestoreAction(action) {
            var command = action.command;
            if (action.xpath && action.xpath.length > 0) {
                return "restoreRender('" + action.xpath + "', " + command + ");";
            } else {
                return "restoreContainer('" + action.container + "', " + command + ");";
            }
        }

        /* 
        *   Evals an xpath to find a render and return its value 
        */
        function evalXpath(xpath, argumentType) {
            var renders = getRender(xpath);
            if (renders == null) { if (BIZAGI_COMMAND_THROW_ERROR) { showRenderNotFoundError(xpath); } return null; }

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

            return eval(buildArgument(value, argumentType));
        }

        /* 
        *   Sets a new color for the background of the render
        */
        function changeRenderBackground(xpath, argument) {
            var renders = getRender(xpath);
            if (renders == null) { if (BIZAGI_COMMAND_THROW_ERROR) { showRenderNotFoundError(xpath); } return null; }

            $.each(renders, function (i) {
                var render = this;
                render.baseRender('changeBackgroundColor', argument);
            });
        }

        /* 
        *   Sets a new color for the foreground of the render
        */
        function changeRenderForeground(xpath, argument) {
            var renders = getRender(xpath);
            if (renders == null) { if (BIZAGI_COMMAND_THROW_ERROR) { showRenderNotFoundError(xpath); } return null; }

            $.each(renders, function (i) {
                var render = this;
                render.baseRender('changeColor', argument);
            });
        }

        /* 
        *   Changes the visibility of the render
        */
        function changeRenderVisibility(xpath, argument) {
            var renders = getRender(xpath);
            if (renders == null) { if (BIZAGI_COMMAND_THROW_ERROR) { showRenderNotFoundError(xpath); } return null; }

            $.each(renders, function (i) {
                var render = this;
                render.baseRender('changeVisibility', argument);
            });
        }

        /* 
        *   Changes the editability of the render
        */
        function changeRenderEditability(xpath, argument) {
            var renders = getRender(xpath);
            if (renders == null) { if (BIZAGI_COMMAND_THROW_ERROR) { showRenderNotFoundError(xpath); } return null; }

            $.each(renders, function (i) {
                var render = this;
                render.baseRender('changeEditability', argument);
            });
        }

        /* 
        *   Changes the required value of the render
        */
        function changeRenderRequired(xpath, argument) {
            var renders = getRender(xpath);
            if (renders == null) { if (BIZAGI_COMMAND_THROW_ERROR) { showRenderNotFoundError(xpath); } return null; }

            $.each(renders, function (i) {
                var render = this;
                render.baseRender('changeRequired', argument);
            });
        }

        /* 
        *   Changes the render internal value
        */
        function changeRenderValue(xpath, argument) {
            var renders = getRender(xpath);
            if (renders == null) { if (BIZAGI_COMMAND_THROW_ERROR) { showRenderNotFoundError(xpath); } return null; }

            $.each(renders, function (i) {
                var render = this;
                render.baseRender('option', 'value', argument);
            });
        }

        /* 
        *   Changes the render minimum value
        */
        function changeRenderMinValue(xpath, argument) {
            var renders = getRender(xpath);
            if (renders == null) { if (BIZAGI_COMMAND_THROW_ERROR) { showRenderNotFoundError(xpath); } return null; }

            $.each(renders, function (i) {
                var render = this;
                render.baseRender('changeMinValue', argument);
            });
        }

        /* 
        *   Changes the render max value
        */
        function changeRenderMaxValue(xpath, argument) {
            var renders = getRender(xpath);
            if (renders == null) { if (BIZAGI_COMMAND_THROW_ERROR) { showRenderNotFoundError(xpath); } return null; }

            $.each(renders, function (i) {
                var render = this;
                render.baseRender('changeMaxValue', argument);
            });
        }

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
        function restoreRender(xpath, command) {
            var renders = getRender(xpath);
            if (renders == null) { if (BIZAGI_COMMAND_THROW_ERROR) { showRenderNotFoundError(xpath); } return null; }

            $.each(renders, function (i) {
                var render = $(this);
                var properties = render.baseRender("option", "originalProperties");

                if (command == 1) changeRenderBackground(xpath, properties.backgroundColor || 'none');
                if (command == 2) changeRenderForeground(xpath, properties.color || 'none');
                if (command == 3) changeRenderVisibility(xpath, properties.visible != undefined ? properties.visible : true);
                if (command == 4) changeRenderEditability(xpath, properties.editable != undefined ? properties.editable : true);
                if (command == 5) changeRenderRequired(xpath, properties.required != undefined ? properties.required : false);
                // NOte: Command 6 does not have restoration
            })
        }

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
        function restoreContainer(containerId, command) {
            var container = getContainer(containerId);
            if (container == null) { if (BIZAGI_COMMAND_THROW_ERROR) { showContainerNotFoundError(xpath); } return null; }

            var properties = container.baseContainer("option", "originalProperties");
            if (command == 1) changeContainerBackground(containerId, properties.backgroundColor || 'none');
            if (command == 3) changeContainerVisibility(containerId, properties.visible != undefined ? properties.visible : true);
            if (command == 7) toogleContainer(containerId, true);
            // NOte: Command 8 does not have restoration
            if (command == 9) changeContainerEditability(containerId, properties.editable != undefined ? properties.editable : true);
        }

        /* 
        *   Helper function to detect metadata errors
        */
        function showRenderNotFoundError(xpath) {
            alert("Cannot find render in DOM: " + xpath);
        }

        /* 
        *   Helper function to detect metadata errors
        */
        function showContainerNotFoundError(containerId) {
            alert("Cannot find container in DOM: " + containerId);
        }

        /* 
        *   Changes container background color
        */
        function changeContainerBackground(containerId, argument) {
            var container = getContainer(containerId);
            if (container == null) { if (BIZAGI_COMMAND_THROW_ERROR) { showContainerNotFoundError(containerId); } return null; }

            container.baseContainer('changeBackgroundColor', argument);
        }

        /* 
        *   Shows or hides a container
        */
        function changeContainerVisibility(containerId, argument) {
            var container = getContainer(containerId);
            if (container == null) { if (BIZAGI_COMMAND_THROW_ERROR) { showContainerNotFoundError(containerId); } return null; }

            container.baseContainer('changeVisibility', argument);
        }

        /* 
        *   Expand or collapse a group container
        */
        function toogleContainer(containerId, argument) {
            var container = getContainer(containerId);
            if (container == null) { if (BIZAGI_COMMAND_THROW_ERROR) { showContainerNotFoundError(containerId); } return null; }
            if (!container.hasClass("ui-bizagi-container-group")) return null;

            container.groupContainer('toogleContainer', argument);
        }

        /* 
        *   Select a determinate sub-container in a tab or an accordion
        */
        function changeActiveItem(containerId) {
            var container = getContainer(containerId);
            if (container == null) { if (BIZAGI_COMMAND_THROW_ERROR) { showContainerNotFoundError(containerId); } return null; }

            container.baseContainer('setAsActiveContainer');
        }

        /* 
        *   Changes container editability
        */
        function changeContainerEditability(containerId, argument) {
            var container = getContainer(containerId);
            if (container == null) { if (BIZAGI_COMMAND_THROW_ERROR) { showContainerNotFoundError(containerId); } return null; }

            container.baseContainer('changeEditability', argument);
        }

        /*
        *   Shows a validation to the user
        */
        function showValidation(message, focus, tokens) {
            // Check tokens
            var sMessage = message;
            if (tokens) {
                for (var i = 0; i < tokens.length; i++) {
                    var renders = getRender(tokens[i]);
                    if (renders && renders.length > 0) {
                        sMessage = sMessage.replaceAll("<" + tokens[i] + ">", "<strong>" + renders[0].baseRender("getValue") + "</strong>");
                    }
                }
            }

            self.formContainer("addValidation", sMessage, focus);
        }
    };
})(jQuery); 
