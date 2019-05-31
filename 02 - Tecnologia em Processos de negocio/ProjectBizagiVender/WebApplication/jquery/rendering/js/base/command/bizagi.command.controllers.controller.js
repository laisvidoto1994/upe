/*
 *   Name: BizAgi Rendering Command controller 
 *   Author: Diego Parra
 *   Comments:
 *   -   This script will define basic stuff for action and validation controllers
 */

$.Class.extend("bizagi.command.controllers.controller", {
    /* 
    *   Set to true in order to debug
    */
    THROW_ERROR: true

}, {
    /*  
    *   Constructor
    */
    init: function (form) {
        this.form = form;
        this.dateFormat = form.getResource("dateFormat");
    },
    /*
    *   Returns the condition in JS
    */
    buildConditions: function (conditions, bGridDetected, bCheckEditability) {
        var self = this;
        var operator = conditions.expressions && conditions.expressions.length > 1 ? self.buildConditionOperator(conditions.operator) : conditions.operator;

        // Define if a grid has been detected
        bGridDetected = bGridDetected || false;
        bCheckEditability = bCheckEditability || false;

        //  Validate trtue and false conditions
        if (operator == "true")
            return "true";
        if (operator == "false")
            return "false";

        var sJsCondition = "";

        for (var i = 0; i < conditions.expressions.length; i++) {
            var expression = conditions.expressions[i];

            if (expression.simple) {
                sJsCondition += self.buildSimpleCondition(expression.simple, bGridDetected, bCheckEditability);

            } else if (expression.complex) {
                sJsCondition += "(" + self.buildConditions(expression.complex, bGridDetected, bCheckEditability) + ") ";
            }

            // Adds operator
            sJsCondition += (i < conditions.expressions.length - 1 ? operator : "");
        }

        return sJsCondition;
    },
    /*
    *   Builds the condition operator
    */
    buildConditionOperator: function (conditionsOperator) {
        if (conditionsOperator == "and")
            return " && ";
        if (conditionsOperator == "or")
            return " || ";
        return conditionsOperator;
    },
    /*
    *   Builds a simple condition
    */
    buildSimpleCondition: function (condition, bGridDetected, bCheckEditability) {
        var self = this;
        var sXpath;
        var xpath;
        var sArgument = "";
        var operator = condition.operator;
        var ensureValueJs = "";
        var ensureEditable = "";

        // Define if a grid has been detected
        bGridDetected = bGridDetected || false;
        bCheckEditability = bCheckEditability || false;

        // List of controls excluded to editability validation
        // Just keep empty the value of element
        var excludeEditabilityRule = { "boolean": "" };
        var control = condition.xpath || condition.renderId;

        var detectedArgumentType = self.detectConditionArgumentType(control, condition.argumentType);

        // Build xpath
        sXpath = self.buildXpath(control, detectedArgumentType, bGridDetected);
        if (detectedArgumentType != "boolean") {
            ensureValueJs += "!bizagi.util.isEmpty(" + sXpath + ") && ";
        }

        // Check if the render is editable, only when the parameter is provided
        if (bCheckEditability && control && control.length > 0 && !excludeEditabilityRule.hasOwnProperty(detectedArgumentType)) {
            ensureEditable = "self.isVisible('" + control + "') && self.isEditable('" + control + "') && ";
        }

        // Build argument
        if (!bizagi.util.isEmpty(condition.argument)) {
            sArgument = self.buildArgument(condition.argument, detectedArgumentType, bGridDetected);

            // If the argument is xpath it must be filled to for some operators
            if (detectedArgumentType == "xpath") {
                ensureValueJs += "!bizagi.util.isEmpty(" + sArgument + ") && ";
            }

        } else if (condition.argument === "") {
            // Also check the case when the argument is empty
            sArgument = "\"\"";
        }

        // Build condition

        if (operator == "includes") {
            return ensureEditable + ensureValueJs + "self.includes(" + sXpath + "," + sArgument + ") ";
        }
        //if (operator == "changes") return "true";
        if (operator == "changes") {
            return "self.isChanged(" + sXpath + ", params.changed)";
        }
        if (operator == "equals")
            return ensureEditable + ensureValueJs + sXpath + " == " + sArgument;
        if (operator == "not-equals")
            return ensureEditable + sXpath + " != " + sArgument;
        if (operator == "less-than")
            return ensureEditable + ensureValueJs + sXpath + " < " + sArgument;
        if (operator == "less-equals-than")
            return ensureEditable + ensureValueJs + sXpath + " <= " + sArgument;
        if (operator == "greater-than")
            return ensureEditable + ensureValueJs + sXpath + " > " + sArgument;
        if (operator == "greater-equals-than")
            return ensureEditable + ensureValueJs + sXpath + " >= " + sArgument;
        if (operator == "like")
            return ensureEditable + ensureValueJs + sXpath + ".toString().indexOf(" + sArgument + ") >= 0 ";
        if (operator == "is-empty") {
            if (detectedArgumentType != "entity") {
                return ensureEditable + "bizagi.util.isEmpty(" + sXpath + ")";
            } else {
                return ensureEditable + "(" + sXpath + " == 0 || bizagi.util.isEmpty(" + sXpath + "))";
            }
        }
        if (operator == "is-not-empty") {
            if (detectedArgumentType != "entity") {
                return ensureEditable + "!bizagi.util.isEmpty(" + sXpath + ")";
            } else {
                return ensureEditable + "(" + sXpath + " != 0 && !bizagi.util.isEmpty(" + sXpath + "))";
            }
        }
        if (operator == "is-true")
            return ensureEditable + "( " + sXpath + " == true || " + sXpath + " == 'true' )";
        if (operator == "is-false")
            return ensureEditable + "( " + sXpath + " == false || " + sXpath + " == 'false' || " + sXpath + " == 'False' )";
        if (operator == "does-not-contain")
            return ensureEditable + ensureValueJs + sXpath + ".toString().indexOf(" + sArgument + ") < 0 ";
        if (operator == "contains")
            return ensureEditable + ensureValueJs + sXpath + ".toString().indexOf(" + sArgument + ") >= 0 ";
        if (operator == "begins-with")
            return ensureEditable + ensureValueJs + sXpath + ".toString().startsWith(" + sArgument + ") == true ";
        if (operator == "does-not-begins-with")
            return ensureEditable + ensureValueJs + sXpath + ".toString().startsWith(" + sArgument + ") == false ";
        if (operator == "file-uploaded") {
            xpath = control;
            if (bGridDetected && xpath) {
                xpath = xpath.replaceAll("[]", "[' + i + ']");
            }
            return ensureEditable + "self.isFileUploaded('" + xpath + "') ";
        }
        if (operator == "file-not-uploaded") {
            xpath = control;
            if (bGridDetected && xpath) {
                xpath = xpath.replaceAll("[]", "[' + i + ']");
            }
            return ensureEditable + "!self.isFileUploaded('" + xpath + "') ";
        }
        if (operator == "is-invalid-email")
            return ensureEditable + "!self.isValidEmail(" + sXpath + ") ";
        if (operator == "letter-edited")
            return "false"; //TODO
        if (operator == "letter-not-edited")
            return "false"; //TODO
        if (operator == "cell-change")
            return "column == " + sArgument;

        if (operator == "on-press") {
            if (bGridDetected) {
                var id = self.buildXpath(control, "id", bGridDetected);
                return "self.isGridButtonPressed(" + id + ", params.pressed)";
            } else {
                return "self.isButtonPressed('" + control + "', params.pressed)";
            }
        }

        // ondelete behavior on grid control  
        if (operator == 'on-deleted-row') {
            xpath = control || "";
            return "self.onDeletedGridRow('" + xpath + "', params.rowDeleted)";
        }

        // If there is another operator code throw exception
        throw new "There is no implementation for operator code " + operator;
    },
    /*
    *   Detects the argument type based on the render
    */
    detectConditionArgumentType: function (control, argumentType) {
        var self = this;

        if (argumentType === undefined || argumentType == "const") {

            // Search render
            var form = self.form;
            var render = form.getRender(control) || form.getRenderById(control);

            // Check if exists the render
            if (render == null) {
                throw new Error("RenderNotFoundException in method detectConditionArgumentType of bizagi.command.controllers.controller");
            }

            // Check if the render is a grid
            if (render.properties.type == "grid") {
                var gridXpath = self.processGridXpath(control);

                if (gridXpath.remainingXpath === "") {
                    // The target is the grid
                    return "xpath";
                } else {
                    render = render.getColumn(gridXpath.remainingXpath);
                    if (render == null) {
                        throw new Error("RenderNotFoundException in method detectConditionArgumentType of bizagi.command.controllers.controller");
                    }
                }
            }

            var dataType = render.properties.dataType;
            var renderType = render.properties.type;

            if (self.isRelatedEntityRender(renderType)) {
                return 'entity';
            }

            // Number
            if (dataType == 1 || dataType == 2 || dataType == 3 ||
                dataType == 4 || dataType == 6 || dataType == 7 ||
                dataType == 10 || dataType == 11) {

                return 'number';
            }

            // Money
            if (dataType == 8) {

                return 'money';
            }

            // Date
            if (dataType == 12 || dataType == 13) {
                if (render.properties.showTime == true) {
                    return 'datetime';
                } else {
                    return 'date';
                }
            }

            // Boolean
            if (dataType == 5) {

                return 'boolean';
            }

            // Button
            if (renderType == "button") {
                return "button";
            }

            // Default
            return 'text';

        } else if (argumentType == "xpath" || argumentType == "function" || argumentType == "entity") {
            return argumentType;
        }

        // Default return text
        return 'text';
    },
    /*
    *   Detects if a render type must be binded to a xpath with related entity
    */
    isRelatedEntityRender: function (renderType) {
        if (renderType == "combo" ||
            renderType == "cascadingCombo" ||
            renderType == "list" ||
            renderType == "radio" ||
            renderType == "search" ||
            renderType == "searchCombo" ||
            renderType == "columnCombo") {
            return true;
        }

        return false;
    },
    buildXpath: function (xpath, argumentType, bGridDetected) {
        var self = this;

        // Define if a grid has been detected
        bGridDetected = bGridDetected || false;

        // Process grid xpaths
        if (bGridDetected) {
            xpath = xpath.replaceAll("[]", "[' + i + ']");
        }

        if (argumentType == 'xpath' && !bGridDetected) {
            return "self.evalXpath('" + xpath + "', '" + self.detectConditionArgumentType(xpath, "const") + "')";
        } else if (argumentType == 'id') {
            return "'" + xpath + "'";
        } else if (argumentType == 'function') {
            var xpathArgumentType = self.detectConditionArgumentType(xpath, "const");
            return "self.evalXpath('" + xpath + "', '" + xpathArgumentType + "')";
        }

        return "self.evalXpath('" + xpath + "', '" + argumentType + "')";
    },
    buildArgument: function (argument, argumentType, bGridDetected, xpathContext) {
        var self = this;
        var number;

        // Define if a grid has been detected
        bGridDetected = bGridDetected || false;

        if (argumentType == 'text') {
            // Text
            argument = (argument == null) ? "" : argument;
            argument = (typeof argument != 'string') ? argument.toString() : argument;
            if (argument.indexOf("'") != -1)
                argument = argument.replaceAll("'", "\\'");

            // Remove line breaks because they will fail with the eval command
            if (argument.indexOf("\n") != -1)
                argument = argument.replaceAll("\n", "");

            return "'" + argument.toString() + "'";
        }
        if (argumentType == 'boolean') {
            // Boolean
            if (typeof (argument) == "string") {
                return (eval(argument.toLowerCase()) == true ? "true" : "false");
            } else {
                return (eval(argument) == true ? "true" : "false");
            }
        }
        if (argumentType == 'number') {
            // Number
            number = new Number(argument);
            if (number == NaN)
                return "-99999999";
            return number.toString();
        }
        if (argumentType == 'money') {
            // MONEY
            number = new Number(argument);
            if (number == NaN)
                return "-99999999";
            return number.toString();
        }
        if (argumentType == 'date') {
            //Date
            var date = bizagi.util.dateFormatter.getDateFromInvariant(argument);
            if (!date || date == 0)
                date = new Date(0);

            // Remove time
            date.setHours(0, 0, 0, 0);

            return "bizagi.util.dateFormatter.getDateFromInvariant('" + bizagi.util.dateFormatter.formatInvariant(date) + "').getTime()";
        }
        if (argumentType == 'datetime') {
            //Date
            var date = bizagi.util.dateFormatter.getDateFromInvariant(argument);
            if (!date || date == 0)
                date = new Date(0);


            // Remove time, to ensure  hour validation wih 00:00 when the control includes showTime
            date.setHours(0, 0, 0, 0);

            return "bizagi.util.dateFormatter.getDateFromInvariant('" + bizagi.util.dateFormatter.formatInvariant(date, true) + "').getTime()";
        }
        if (argumentType == 'color') {
            // Color
            return "'" + argument.toString() + "'";
        }
        if (argumentType == 'entity') {

            if (bizagi.util.isEmpty(argument)) {
                return null;
            }
            try {
                argument = typeof (argument) != "object" ? JSON.parse(argument) : argument;
            } catch (e) {
                argument = argument || {};
            }


            // Entity value
            var result = argument.id || argument;
            return JSON.stringify(result);
        }
        if (argumentType == 'xpath') {
            // Xpath value
            var xpath = argument.toString();

            // Process grid xpaths
            if (bGridDetected) {
                xpath = xpath.replaceAll("[]", "[' + i + ']");
            }

            if (xpathContext) {
                xpath = xpathContext + "." + xpath;
            }

            return self.buildXpath(xpath, argumentType, bGridDetected);
        }
        if (argumentType == 'json') {
            // Xpath value
            return JSON.encode(argument);
        }
        if (argumentType == 'function') {
            if (argument == "BANow") {
                return "self.getCurrentDate()";
            }
            // If there is another function type code throw exception
            throw "There is no implementation for function " + argument;
        }

        if (argumentType == undefined) {
            return null;
        }

        // If there is another argument type code throw exception
        throw "There is no implementation for argument type " + argumentType;
    },
    /*
    *   Evals if an xpath is editable
    */
    isEditable: function (xpath) {
        var self = this;
        // For the submit action we need only one render to perform the server action
        var render = self.getRender(xpath);
        if (render == null) {
            if (self.Class.THROW_ERROR) {
                self.showRenderNotFoundError(xpath);
            }
            return;
        }

        return render.properties.editable;
    },

    isVisible: function (xpath) {
        var self = this;

        var render = self.getRender(xpath);
        if (render == null) {
            if (self.Class.THROW_ERROR) {
                self.showRenderNotFoundError(xpath);
            }
            return;
        }

        if (render.properties.visible) {
            return self.isParentVisible(render.parent);
        } else {
            return false;
        }
    },

    isParentVisible: function (render) {
        var self = this;
        if (render.parent) {
            if (render.properties.visible) {
                return self.isParentVisible(render.parent);
            } else {
                return false;
            }
        } else {
            return render.properties.visible;
        }
    },

    /* 
    *   Evals an xpath to find a render and return its value
    */
    evalXpath: function (xpath, argumentType) {
        var self = this, i, renderToEval;

        var renders = self.getRenders(xpath);
        if (renders == null) {
            if (self.Class.THROW_ERROR) {
                self.showRenderNotFoundError(xpath);
            }
            return null;
        }

        var rendersToEval = [];
        $.each(renders, function (i, render) {
            if (render.properties.editable) {
                rendersToEval.push(render);
            }
        });

        // If no render has been found skip editable validation
        if (rendersToEval.length === 0) {
            $.each(renders, function (i, render) {
                rendersToEval.push(render);
            });
        }

        i = 0;
        while (i < rendersToEval.length) {
            renderToEval = rendersToEval[i++];
            var bIsGrid = (renderToEval.properties.type == 'grid');
            if (!bIsGrid) {
                // Normal renders
                var value = renderToEval.getValue();

                if (argumentType === undefined ||
                argumentType === "undefined") {
                    return value;
                }

                // If the render is a combo and the value is null return 0 for validations and actions
                if (renderToEval.properties.type == "combo" ||
                renderToEval.properties.type == "list" ||
                renderToEval.properties.type == "cascadingCombo" ||
                renderToEval.properties.type == "search" ||
                renderToEval.properties.type == "radio") {

                    if (bizagi.util.isEmpty(value) || value.id == "") {
                        value = 0;
                    }
                }

                if (renderToEval.properties.type == "comboSelected") {
                    return (typeof value === "string") ? JSON.parse(value).value : value;
                }

                if (bizagi.util.isEmpty(value)) {
                    // If the render is a check and the value is null return false for validations and actions
                    if (renderToEval.properties.type == "boolean" &&
                    renderToEval.properties.display == "check") {
                        return false;
                    }

                    if (bizagi.util.isEmpty(value)) {
                        // If the render is a check and the value is null return false for validations and actions
                        if (renderToEval.properties.type == "boolean" &&
                        renderToEval.properties.display == "check") {
                            return false;
                        }
                    }

                    return value;
                }

                return eval(self.buildArgument(value, argumentType));
            } else {

                // Grid renders
                var gridXpath = self.processGridXpath(xpath);

                // Return the value
                var gridColumn = renderToEval.getColumn(gridXpath.remainingXpath);

                if (!gridColumn) {
                    continue;
                }

                var cellValue = renderToEval.getCellCurrentValue(gridXpath.index, gridXpath.remainingXpath);

                if (gridColumn.properties.type == "columnRadio") {
                    if (cellValue) {
                        if (cellValue.length > 0 && cellValue[0].length > 0)
                            cellValue = cellValue[0][0];
                        else
                            cellValue = cellValue.id;
                    }
                    else
                        cellValue = 0;
                }

                if (gridColumn.properties.type == "columnCombo") {
                    cellValue = (cellValue && cellValue.id) ? cellValue.id : 0;
                }

                if (gridColumn.properties.type == "columnSearch") {
                    cellValue = (cellValue && cellValue.id) ? cellValue.id : 0;
                }

                // Parse empty values
                if (bizagi.util.isEmpty(cellValue)) {
                    // If the render is a boolean return false for actions
                    if (argumentType == "boolean") {
                        if (gridColumn.properties.display == "check") {
                            return false;
                        } else {
                            return null;
                        }
                    }
                }

                // Parse boolean and non-empty date types
                if ((argumentType == "boolean") || (argumentType == "date" && !bizagi.util.isEmpty(self.getRender(xpath, argumentType).value))) {
                    return eval(self.buildArgument(cellValue, argumentType));
                }

                return cellValue;
            }

            throw "There is no a valid render for xpath " + xpath;
        }


    },
    /*
    *   Check if the upload render has any files uploaded
    */
    isFileUploaded: function (xpath) {
        var self = this;

        var value = self.evalXpath(xpath);

        if (value && value.length) {
            if (value.length > 0)
                return true;
        }

        return false;
    },
    /*
    *   Check if a render has a valid email value
    */
    isValidEmail: function (value) {
        var regex = /^([a-zA-Z0-9\u0430-\u044F'&#*:._-]|&#39;)+@[a-zA-Z0-9\u0430-\u044F.-]+\.[a-zA-Z\u0430-\u044F]+$/gi;
        if (value && value.match(new RegExp(regex))) {
            return true;
        }
        return false;
    },
    /**
    * Compare two elements, data of html and renderId to action
    */
    isButtonPressed: function (control, pressed) {
        // Check if the control is a button
        var render = this.getRenderById(control);
        if (render === null || render.properties.type != "button") return false;

        return pressed;
    },
    /*
    * Compare two elements, data of html and renderId to action
    */
    isGridButtonPressed: function (control, pressed) {
        // Check if the control is a button
        var arrGridXpath = this.processGridXpath(control);
        var gridXpath = arrGridXpath.gridXpath;
        var render = this.getRender(gridXpath);
        var column = arrGridXpath.remainingXpath || "";


        if (pressed && render && render.columns) {
            $.each(render.columns, function (key, value) {
                if ((value.properties.xpath === column || value.properties.id === column) && value.properties.type === "columnButton") {
                    pressed = true;
                }
            });
        }
        return pressed;
    },

    /**
    * Check if a control has been changed
    */
    isChanged: function (value, isChanged) {
        if (value === undefined || value === null) {
            return false;
        }
        return isChanged;
    },

    /**
    * Check if a control has the item
    */
    includes: function (value, argument) {
        if (typeof value == "undefined" || value === null) {
            return false;
        }
        if (typeof argument == "undefined" || argument === null) {
            return false;
        }
        var inArray = $.grep(value, function (e) {
            return e.id == argument;
        });
        if (inArray.length > 0) {
            return true;
        }
        return false
    },

    /**
    *  Check if the grid has been deleted a row
    */
    onDeletedGridRow: function (xpath, rowDeleted) {
        var self = this;
        var grid = self.getRender(xpath) || {};

        if (grid && rowDeleted) {
            return true;
        } else {
            return false;
        }
    },

    /*
    *   Wrapper for get renders, return null if no renders have been found
    */
    getRenders: function (xpath) {
        var self = this,
            form = self.form,
            regex = /id=([\w-]+)/gi;
        var renders = null;

        // Check if the xpath is an id
        var idMatches = regex.exec(xpath);
        if (idMatches && idMatches.length > 1) {
            var render = self.getRenderById(idMatches[1]);
            if (render) {
                if (render.length == 0)
                    return null;
                else {
                    renders = [];
                    renders.push(render);
                    return renders;
                }
            } else {
                return null;
            }

        }

        renders = form.getRenders(xpath);
        if (renders.length == 0)
            return null;
        return renders;
    },
    /*
    *   Wrapper for get only one editable render
    */
    getRender: function (xpath) {
        var self = this,
            form = self.form;

        return form.getRender(xpath);
    },
    /*
    *   Wrapper to get a render by id
    */
    getRenderById: function (id) {
        var self = this,
            form = self.form;

        return form.getRenderById(id);
    },
    /* 
    *   Helper function to detect metadata errors
    */
    showRenderNotFoundError: function (xpath) {
        bizagi.debug("Cannot find render in DOM: " + xpath);
    },
    /* 
    *   Helper function to detect metadata errors
    */
    showContainerNotFoundError: function (containerId) {
        bizagi.debug("Cannot find container in DOM: " + containerId);
    },
    /*
    *   Returns the current date
    */
    getCurrentDate: function () {
        var currentDate = new Date();

        // Remove time
        currentDate.setHours(0, 0, 0, 0);
        return currentDate;
    },
    /*
    *   Return the grid xpath parts
    */
    processGridXpath: function (xpath) {

        // Eval using regular expressions
        var regex = new RegExp(/([\w\.]*)\[(\d*)\]\.([\w\.|\w-\.]*)/g);
        var matches = regex.exec(xpath);
        var index, remainingXpath, gridXpath;
        if (matches) {
            gridXpath = matches[1];
            index = matches[2];
            remainingXpath = matches[3];
        } else {
            index = "";
            remainingXpath = "";
        }

        return { xpath: xpath, index: index, remainingXpath: remainingXpath, gridXpath: gridXpath };
    },
    /*
    *   Check if an action/validation contains reference to a grid
    */
    searchForGridReference: function (conditions, commands) {
        var self = this;
        var i;
        // Check in conditions
        if (conditions) {
            return self.searchGridReferenceInCondition(conditions);
        }

        // Check in commands
        if (commands) {
            for (i in commands) {
                var command = commands[i];
                return self.searchForGridReferenceInCommand(command);
            }
        }

        return null;
    },
    /*
     *   Check if an action/validation contains reference to a grid
     */
    searchForGridReferenceInCommand: function(command){
        if (command.xpath && command.xpath.indexOf("[]") > 0) {
            return command.xpath.substring(0, command.xpath.indexOf("[]"));
        }

        // Check in argument if argumentType is xpath
        if (command.argumentType == 'xpath') {
            if (command.argument.indexOf("[]") > 0) {
                return command.argument.substring(0, command.argument.indexOf("[]"));
            }
        }
    },

    /*
    *   Check if a condition contains reference to a grid
    */
    searchGridReferenceInCondition: function (condition) {
        var self = this;
        var bGridReferenceFound;
        if (typeof (condition) === "string" || typeof (condition) === "boolean")
            return null;
        if (condition.expressions) {
            for (i in condition.expressions) {
                bGridReferenceFound = self.searchGridReferenceInCondition(condition.expressions[i]);
                if (bGridReferenceFound)
                    return bGridReferenceFound;
            }

        } else if (condition.simple) {
            return self.searchGridReferenceInCondition(condition.simple);

        } else if (condition.complex) {
            return self.searchGridReferenceInCondition(condition.complex);
        } else {
            // Looking for grid reference within xpath
            if (condition.xpath || condition.renderId) {
                // Check in condition.xpath
                bGridReferenceFound = self.searchGridReferenceInXpath(condition.xpath) || self.searchGridReferenceInXpath(condition.renderId);
                if (bGridReferenceFound)
                    return bGridReferenceFound;

                // Check in argument if argumentType is xpath
                if (condition.argumentType == 'xpath') {
                    bGridReferenceFound = self.searchGridReferenceInXpath(condition.argument);
                    if (bGridReferenceFound)
                        return bGridReferenceFound;

                }

            }
        }

        return null;
    },
    /*
    *   Check if a xpath contains a grid reference
    */
    searchGridReferenceInXpath: function (xpath) {
        // Check in condition.xpath
        if (xpath && xpath.indexOf("[]") > 0) {
            return xpath.substring(0, xpath.indexOf("[]"));
        }
        return null;
    },
    getGridControl: function (xpath, surrogateKey) {
        var self = this;
        var remainingXpath = self.processGridXpath(xpath).remainingXpath;
        var grid = self.getRender(xpath);
        var column = grid.getControlCell(surrogateKey, remainingXpath);

        return column;

    }

});
