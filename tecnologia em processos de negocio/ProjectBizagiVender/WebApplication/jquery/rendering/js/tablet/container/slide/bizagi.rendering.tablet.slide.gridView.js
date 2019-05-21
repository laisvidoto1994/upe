/*
*   Name: BizAgi Tablet slide grid view implementation
*   Author: Diego Parra
*   Comments:
*   -   Serves as an slide view that will show hidden columns for a grid
*/

// Extends itself
$.Class.extend('bizagi.rendering.tablet.slide.gridView', {}, {

    /* CONSTRUCTOR
    =====================================================*/
    init: function (dataService, renderFactory, slideFormParams) {

        var self = this;

        // Define instance variables
        this.dataService = dataService;
        this.renderFactory = renderFactory;
        this.slideFormDeferred = new $.Deferred();
        this.slideFormParams = slideFormParams || {};

        // Create container    	
        self.slideForm = $('<div>').addClass('slideForm');

        // Apply slide plugin
        self.applySlidePlugin(self.slideForm)
		.done(function (data) {
		    self.slideFormDeferred.resolve(data);
		})
		.fail(
		    function () {
		        self.slideFormDeferred.reject();
		    });
    },

    /*
    *   Shows the slideForm form container in the browser
    *   Returns a promise that the dialog will be closed
    */
    applySlidePlugin: function (slideForm) {
        var self = this;
        var dfd = new $.Deferred();

        // Create buttons object
        var slideOptions = { buttons: [] };

        // Add cancel button by default
        slideOptions.buttons.push({
            text: bizagi.localization.getResource("workportal-case-dialog-box-close"),
            click: function () {
                // Close slide

                slideForm.slideContent("close");

                // Detach slideForm
                slideForm.parent().detach();

                //reject defered
                dfd.reject();
            }
        });

        // Add save button if the form is editable
        if (self.slideFormParams.allowEdition == true) {
            slideOptions.buttons.push({
                text: bizagi.localization.getResource("render-form-dialog-box-save"),
                click: function () {
                    // Close slide
                    slideForm.slideContent("close");

                    // Detach slideForm
                    slideForm.parent().detach();

                    // Resolve deferred with form data
                    var data = {};
                    self.form.collectRenderValues(data);
                    dfd.resolve(data);
                }
            });
        }

        // Apply dialog plugin
        slideOptions = $.extend(slideOptions, this.slideFormParams);
        slideForm.slideContent(slideOptions);

        // Moves scrolling to the top 
        if (this.slideForm.parent().parent()) this.slideForm.parent().parent().scrollTop("0");

        // Return promise
        return dfd.promise();
    },

    /*
    *   Render the grid view form
    *   The params are the same that will be send to the ajax service
    *   Returns a deferred
    */
    render: function (params) {
        var self = this;

        // Fill content
        self.renderSlideForm(self.slideForm, params);

        // Return promise
        return self.slideFormDeferred.promise();
    },

    /* RENDERS slideForm
    =====================================================*/
    renderSlideForm: function (slideForm, params) {

        var self = this;
        var data = self.transformData(params);

        // Clear slideForm, because the refresh method could call this method again
        slideForm.empty();

        // Load template and data
        self.form = self.renderFactory.getContainer({
            type: "form",
            data: data.form
        });

        $.when(self.form.render())
        .done(function (element) {

            // Append form  in the dialog
            element.appendTo(slideForm);

            // Publish an event to check if the form has been set in the DOM
            self.form.triggerHandler("ondomincluded");

            // Remove default form buttons
            $('.slideForm .ui-bizagi-button-container input:button').remove();
        });
    },

    /*  
    *   Transform data into a JSON standard rendering format
    */
    transformData: function (params) {
        var self = this;
        var row = params.row;
        var columns = params.columns;

        // Set xpath context
        var xpathContext = params.xpathContext.length > 0 ? params.xpathContext + "." + params.xpath + "[" + params.row[0] + "]" : params.xpath + "[id=" + params.row[0] + "]";

        var data = {
            type: "form",
            form: {
                elements: [],
                pageCacheId: params.pageCacheId,
                sessionId: params.sessionId,
                properties: {
                    xpathContext: xpathContext
                },
                actions: self.transformActions(params.xpath, params.actions),
                validations: self.transformValidations(params.xpath, params.validations)
            }
        };

        $.each(row, function (i, item) {

            // Skip first data (key not need to be rendered)
            if (i > 0) {
                var element = { render: { properties: $.extend({}, columns[i - 1].properties)} };

                // Hack properties
                element.render.properties.type = self.mapRenderType(element.render.properties.type);
                element.render.properties.displayType = 'both';
                if (self.slideFormParams.allowEdition == false) element.render.properties.editable = false;
                element.render.properties.value = self.mapValue(element.render.properties.type, item);
                if (element.render.properties.recalculate) element.render.properties.data = null;

                // Check columnVisible property
                if (typeof (element.render.properties.columnVisible) != "undefined") {
                    element.render.properties.visible = element.render.properties.columnVisible;
                }

                // Fix upload columns
                if (element.render.properties.type == "upload") {
                    element.render.properties.isColumn = true;
                }

                // Add element
                data.form.elements.push(element);
            }
        });

        return data;
    },

    /*  
    *   Map column renderType into normal render
    */
    mapRenderType: function (type) {
        type = type.substring(6, type.length);

        //some exceptions
        if (type == "FormLink") {
            return "formLink";
        }
        
        type = type.toLowerCase();
        return type;
    },

    /*
    *   Method to traslate grid values into render values
    */
    mapValue: function (type, value) {
        if (type == "combo" || type == "radio") {
            if (value && value.length > 0) {

                // Transform the value property
                return [{
                    id: value[0][0],
                    value: value[0].length > 2 ? $.grep(value[0], function (item, i) { return i != 0; }) : value[0][1]
                }];

            } else {
                return null;
            }
        }

        // Else: Don't do anything
        return value;
    },

    /*
    *   Parse form actions into just grid form actions
    */
    transformActions: function (xpath, actions) {
        var self = this;
        var gridActions = [];
        if (bizagi.util.isEmpty(actions)) return gridActions;
        $.each(actions, function (i, action) {
            var bDependencyFound = false;
            for (var i = 0; i < action.dependencies.length; i++) {
                if (action.dependencies[i].indexOf(xpath) != -1) {
                    bDependencyFound = true;
                }
            }

            if (bDependencyFound) {
                var newAction = JSON.parse(JSON.encode(action));

                // Replace dependencies
                for (var i = 0; i < newAction.dependencies.length; i++) {
                    newAction.dependencies[i] = newAction.dependencies[i].replaceAll(xpath + "[].", "");
                }

                // Replace conditions
                self.transformConditions(xpath, newAction.conditions);

                // Replace commands
                self.transformCommands(xpath, newAction.commands);
                self.transformCommands(xpath, newAction.elseCommands);

                // Add to grid actions
                gridActions.push(newAction);
            }
        });

        return gridActions;
    },

    /*
    *   Parse form validations into just grid form validations
    */
    transformValidations: function (xpath, validations) {
        var self = this;
        var gridValidations = [];
        if (bizagi.util.isEmpty(validations)) return gridValidations;
        $.each(validations, function (i, validation) {
            var newValidation = JSON.parse(JSON.encode(validation));

            // Replace conditions
            self.transformConditions(xpath, newValidation.conditions);

            // Add to grid actions
            gridValidations.push(newValidation);

        });

        return gridValidations;
    },

    /*
    *   Parse a single condition or a complex condition in order to prepare a grid action/validation
    */
    transformConditions: function (xpath, condition) {
        var self = this;

        if (condition.expressions) {
            for (i in condition.expressions) {
                self.transformConditions(xpath, condition.expressions[i]);
            }

        } else if (condition.simple) {
            self.transformConditions(xpath, condition.simple);

        } else if (condition.complex) {
            self.transformConditions(xpath, condition.complex);

        } else {
            if (condition.xpath) {
                condition.xpath = condition.xpath.replaceAll(xpath + "[].", "");
                if (condition.argumentType == 'xpath') {
                    condition.argument = condition.argument.replaceAll(xpath + "[].", "");
                }
            }
        }
    },

    /*
    *   Parse a command action to prepare a grid action
    */
    transformCommands: function (xpath, commands) {
        var self = this;
        var refreshIndex = null;
        if (commands == null || commands.length == 0) return;
        for (var i = 0; i < commands.length; i++) {
            if (commands[i].command == "refresh") {
                refreshIndex = i;
            }
            else {
                if (commands[i].xpath) {
                    commands[i].xpath = commands[i].xpath.replaceAll(xpath + "[].", "");
                }
                if (commands[i].argumentType == 'xpath') {
                    commands[i].argument = commands[i].argument.replaceAll(xpath + "[].", "");
                }
            }
        }
        if (refreshIndex != null) {
            commands.splice(i, 1);
        }
    }

});