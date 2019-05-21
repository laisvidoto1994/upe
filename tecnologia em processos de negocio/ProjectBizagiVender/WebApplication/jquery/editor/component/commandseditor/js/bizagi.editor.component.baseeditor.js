/*
@title: Base Editor Component for actions and validations
@authors: Diego Parra
@date: 06-jul-12
*/
bizagi.editor.component.controller(
    "bizagi.editor.component.baseeditor", {
        /*
        *   Initializes the class
        */
        init: function (canvas, model, controller) {
            // Call base
            this._super();

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
            
            var editor = $(".bz-fm-actionvalidationeditor", self.element);
            self.scrollPosition = editor.scrollTop();

            self.render();
        },

        /*
        *   Renders the preview editor
        */
        render: function () {
            var self = this;
            var element = self.element;

            // Clear everything
            element.empty();

            $.when(self.loadTemplates()).done(function () {
                // Render
                var mainTemplate = self.getTemplate("container");
                $.tmpl(mainTemplate, self.model.getViewModel()).appendTo(element);
                self.configureSortablePlugin();

                // Scroll to previous position
                if (self.scrollPosition) {
                    var editor = $(".bz-fm-actionvalidationeditor", self.element);
                    editor.scrollTop(self.scrollPosition);
                }
            });
        },

        // Logic Operator handlers
        ".bz-fm-commandseditor-condition-logicOperator click": function (element) {
            var self = this;
            var parentExpression = element.data("parent-expression");
            self.displayLogicOperators(element, parentExpression);
        },

        // Xpath handlers
        ".bz-fm-commandseditor-condition-xpath click": function (element) {
            var self = this;
            var guid = element.closest(".bz-fm-commandseditor-condition").data("guid");
            self.displayExpressionControls(element, guid);
        },

        // Operator handlers
        ".bz-fm-commandseditor-condition-operator click": function (element) {
            var self = this;
            var guid = element.closest(".bz-fm-commandseditor-condition").data("guid");
            self.displayOperators(element, guid);
        },

        // Argument handlers
        ".bz-fm-commandseditor-condition-argument click": function (element) {
            var self = this;
            var guid = element.closest(".bz-fm-commandseditor-condition").data("guid");
            self.displayExpressionArgument(element, guid);
        },

        // New condition handler
        ".bz-fm-commandseditor-condition-new click": function (element) {
            var self = this;
            var parentExpression = element.closest(".bz-fm-commandseditor-button-bar").data("complex-guid");
            self.model.addExpression(parentExpression);

            // Refresh view
            self.refresh();
        },

        // New complex condition handler
        ".bz-fm-commandseditor-btn-complex click": function (element) {
            var self = this;
            var parentExpression = element.closest(".bz-fm-commandseditor-button-bar").data("complex-guid");
            self.model.addComplexExpression(parentExpression);

            // Refresh view
            self.refresh();
            return false;
        },


        // Delete condition handler
        ".bz-fm-commandseditor-condition .bz-fm-commandseditor-icons-delete click": function (element) {
            var self = this;
            var parentExpression = element.closest(".bz-fm-commandseditor-complex").closest(".bz-fm-commandseditor-condition").data("guid");
            var guid = element.closest(".bz-fm-commandseditor-condition").data("guid");
            self.model.removeExpression(guid, parentExpression);

            // Refresh view
            self.refresh();
        },


        // Ok button handler
        ".bz-fm-commandseditor-button-ok click": function () {
            var self = this;
            var result = self.model.validate();
            if (!result.isValid) {
                // Model invalid, then refresh and show errors
                self.refresh();
                var message = (result.message) ? result.message : bizagi.localization.getResource("formmodeler-component-commandseditor-validate-requiredfields");
                bizagi.showMessageBox(message, "Bizagi", "error", false);
            } else {
                // Model valid, then save
                self.publish("save", { model: self.model.getData() });
            }
        },

        // Cancel button handler
        ".bz-fm-commandseditor-button-cancel click": function () {
            var self = this;
            self.publish("cancel", { model: self.model });
        },


        /*
        *   Show xpath controls for expressions
        */
        displayExpressionControls: function (xpathControl, guid) {
            var self = this;
            var isControlsList = true;
            var controls = self.model.getControls({
                appliesToRender: true,
                exclude: ["undefined","activityFlowButton"],
                checkContext: true
            });

            var currentValue = self.model.fullModel.resolveCommand(self.model.getExpression(guid));

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
                self.model.updateExpression(guid, property, value, (property != "xpath"));

                // Refresh
                self.refresh();
                list.detach();
            });
        },

        /*
        *   Show operator controls
        */
        displayOperators: function (operatorControl, guid) {
            var self = this;
            var operators = self.model.getOperators(guid);
            var currentValue = self.model.getExpression(guid).operator;

            // Show list
            var list = self.displayList(operators, currentValue);

            // Position list
            list.position({
                my: "left top",
                at: "left bottom",
                of: operatorControl,
                collision: "fit flip"
            });

            // Define a handler to select an item
            list.find("li").click(function () {
                var value = $(this).data("value");

                self.model.updateExpression(guid, "operator", value);

                // Refresh
                self.refresh();
                list.detach();
            });
        },

        /*
        *   Show logic operator controls
        */
        displayLogicOperators: function (logicOperatorControl, parentGuid) {
            var self = this;
            var operators = self.model.getLogicOperators();
            var currentValue = self.model.getLogicOperator(parentGuid);

            // Show list
            var list = self.displayList(operators, currentValue);

            // Position list
            list.position({
                my: "left top",
                at: "left bottom",
                of: logicOperatorControl,
                collision: "none"
            });

            // Define a handler to select an item
            list.find("li").click(function () {
                var value = $(this).data("value");

                self.model.updateLogicOperator(parentGuid, value);

                // Refresh
                self.refresh();
                list.detach();
            });
        },

        /*
        *   Show argument controls for expression
        */
        displayExpressionArgument: function (argumentControl, guid) {
            var self = this;
            var argument = self.model.getExpression(guid).argument;
            var type = self.model.getExpressionType(guid);
            var xpath = self.model.getExpression(guid).xpath;
            var editor;
            editor = self.getConstantEditor(argumentControl, argument, xpath, type);
            if (editor) {
                editor.render();

                // Subscribe to change event
                editor.subscribe("valuechanged", function (e, item) {
                    self.model.updateExpression(guid, "argument", item.value);
                    self.model.updateExpression(guid, "argumentType", item.argumentType);
                    // Close the editor and refresh the view
                    editor.close();
                    self.refresh();
                });
            }
        },

        /*
        *   Return the editor to be used
        */
        getConstantEditor: function (argumentControl, argument, xpath, type) {
            var self = this;
            var params = {
                templates: self.tmpl,
                element: argumentControl,
                xpath: xpath,
                value: argument,
                mainEditor: this
            };

            if (type == "boolean") {
                return new bizagi.editor.component.constantargument.boolean(params);
            }
            if (type == "string") {
                return new bizagi.editor.component.constantargument.string(params);
            }
            if (type == "date") {
                return new bizagi.editor.component.constantargument.date(params);
            }
            if (type == "number") {
                return new bizagi.editor.component.constantargument.number(params);
            }
            if (type == "entity") {
                return new bizagi.editor.component.constantargument.entity(params);
            }
            if (type == "color") {
                return new bizagi.editor.component.constantargument.color(params);
            }
            if (type == "rule") {
                return new bizagi.editor.component.constantargument.rule(params);
            }
            if (type == "interface") {
                return new bizagi.editor.component.constantargument.interface(params);
            }
            if (type == "sap") {
                return new bizagi.editor.component.constantargument.sap(params);
            }
            if (type == "connector") {
                return new bizagi.editor.component.constantargument.connector(params);
            }
            return null;
        },

        /*
        *   Display a list using the supplied data
        */
        displayList: function (hash, currentValue, controlsList) {
            var self = this;
            var listTemplate = controlsList ? self.getTemplate("controlslist") : self.getTemplate("list");

            var list = $.tmpl(listTemplate, {
                list: hash,
                currentValue: currentValue
            });

            list.appendTo("form-modeler", document);

            // Define handler to close the item
            setTimeout(function () {
                // Capture all click elements inside the popup
                list.click(function (e) {
                    e.stopPropagation();
                });

                // Make a document click, if the event bubbles up to here then the click was made outside popup boundaries
                $(document).one("click", function () {
                    list.detach();
                });
            }, 100);

            return list;
        },
       
        
        /*
        *
        */
        configureSortablePlugin: function () {
            // This method is implemented in the inherited classes    
        },

        /*  
        *   Load all the templates needed
        */
        loadTemplates: function () {
            // This method is implemented in the inherited classes  
        }
    }
);

/*
*   Define editors
*/
/* BASE*/
    bizagi.editor.observableClass.extend("bizagi.editor.component.constantargument.editor", {}, {
        /*
        *   Constructor
        */
        init: function (params) {
            // Call base
            this._super();

            // Initialize variables
            this.templates = params.templates;
            this.element = params.element;
            this.xpath = params.xpath;
            this.value = params.value;
            this.mainEditor = params.mainEditor;
            this.model = params.mainEditor.model;
            this.displayXpathControls = true;
        },

        /*
        *   Renders the editor
        */
        render: function () {
            var self = this;
            var template = self.templates["argument"];
            var editor = self.editor = $.tmpl(template);
            editor.appendTo($("form-modeler", document));

            // Render control
            var wrapper = $(".bz-fm-commandseditor-argument-editor", editor);
            $.when(self.internalRender(wrapper))
            .done(function (control) {
                self.control = control;
            });

            if (self.displayXpathControls) {
                // Add xpath handler click
                editor.find(".bz-fm-commandseditor-argument-xpath").click(function () {
                    self.displayControls($(this));
                });
            } else {
                editor.find(".bz-fm-commandseditor-argument-xpath").hide();
            }
        },

        /*
        *   Display xpath controls
        */
        displayControls: function (element) {
            var self = this;
            var xpathControl = self.model.getControl(self.xpath);
            var argumentControl = self.model.getControl(self.value);
            var isControlsList = true;
            var filterBy = [];

            if (xpathControl) filterBy.push(xpathControl.type);

            var controlsOptions = {
                appliesToRender: true,
                filterBy: filterBy
            };

            if (xpathControl.relatedEntity) {
                $.extend(controlsOptions, { filterByRelatedEntity: true, relatedEntity: xpathControl.relatedEntity });
            }

            // Get controls
            var controls = self.model.getControls(controlsOptions);

            // Show list
            var list = self.controlsList = self.mainEditor.displayList(controls, (argumentControl ? argumentControl.xpath : null), isControlsList);

            // Position list
            list.position({
                my: "right top",
                at: "right bottom",
                offset: "4 0",
                of: element,
                collision: "none"
            });

            // Define a handler to select an item
            list.find("li").click(function () {
                var value = $(this).data("value");

                self.changeValue(value, "xpath");
            });

            // Define handler to close the item
            setTimeout(function () {
                // Capture all click elements inside the popup
                list.click(function (e) {
                    e.stopPropagation();
                });

                // Make a document click, if the event bubbles up to here then the click was made outside popup boundaries
                $(document).one("click", function () {
                    list.detach();
                });
            }, 100);

        },

        /*
        *   Floats the element above of the original control
        */
        floatElement: function () {
            var self = this;
            var editor = self.editor;

            // Position control
            editor.position({
                my: "left top",
                at: "left top",
                of: self.element,
                offset: " 0 -6"
            });

            // Define handler to close the item
            setTimeout(function () {
                // Capture all click elements inside the popup
                editor.click(function (e) {
                    e.stopPropagation();
                });

                // Make a document click, if the event bubbles up to here then the click was made outside popup boundaries
                $(document).one("click", function () {
                    self.close();
                });
            }, 100);

            // Hide original element
            self.element.hide();
        },

        /*
        *   Changes the value and notify the controller
        */
        changeValue: function (newValue, argumentType) {
            var self = this;
            argumentType = argumentType || "const";
            self.publish("valuechanged", { value: newValue, argumentType: argumentType });
        },

        /*
        *   launches the localizable editor and notify the controller
        */
        localizableEditor: function (newValue) {
            var self = this;

            self.publish("launchLocalizableEditor", { value: newValue });
        },

        /*
        *   Removes the editor
        */
        close: function () {
            var self = this;

            // Remove document handler
            $(document).unbind("click");

            // Remove control
            if (self.editor) self.editor.detach();
            if (self.controlsList) self.controlsList.detach();
            self.element.show();
        }
    });

/* BOOLEAN*/
bizagi.editor.component.constantargument.editor.extend("bizagi.editor.component.constantargument.boolean", {}, {

    /*
    *   Renders the boolean edition control
    */
    internalRender: function (wrapper) {
        var self = this;
        var template = self.templates["boolean"];
        var control = $.tmpl(template, { value: self.value });
        control.appendTo(wrapper);

        // Float element
        self.floatElement();

        // Add handlers
        control.find("span").click(function () {
            var value = bizagi.util.parseBoolean($(this).data("value"));
            self.changeValue(value);
        });

        return control;
    }
});

/* STRING */
bizagi.editor.component.constantargument.editor.extend("bizagi.editor.component.constantargument.string", {}, {

    /*
    *   Renders the string edition control
    */
    internalRender: function (wrapper) {
        var self = this;
        var template = self.templates["string"];
        var control = $.tmpl(template, { value: self.value });
        control.appendTo(wrapper);

        // Float element
        self.floatElement();

        var input = control.find("input");
        input.focus();

        // Add handlers
        input.change(function () {
            input.unbind("change");
            var value = $(this).val();
            if (value.length == 0) value = null;
            self.changeValue(value);
        });
        input.keyup(function (ev) {
            if (ev.which == 13) {
                var value = $(this).val();
                if (value.length == 0) value = null;
                self.changeValue(value);
            }
        });

        return control;
    }
});

/* TEXTAREA */
bizagi.editor.component.constantargument.editor.extend("bizagi.editor.component.constantargument.textarea", {}, {

    /*
    *   Constructor
    */
    init: function (params) {
        // Call base
        this._super(params);

        // Initialize variables
        this.displayXpathControls = false;
    },
    /*
    *   Renders the string edition control
    */
    internalRender: function (wrapper) {
        var self = this;
        var template = self.templates["textarea"];
        var control = $.tmpl(template, { value: self.value });
        control.appendTo(wrapper);

        // Float element
        self.floatElement();

        var textarea = control.find("textarea");
        textarea.focus();

        // Add handlers
        
        textarea.keyup(function (ev) {
            if (ev.which == 13) {
                var value = $(this).val();
                if (value.length == 0) value = null;
                self.changeValue(value);
            }
        });

        self.bindChangeEventElement(textarea);
        
        var icon = control.find("i");
        
        // Add handlers
        icon.bind("click", function (e) {
           
            self.localizableEditor(textarea.val());
        });


        // when entering the icon area, we need to disable the change event on the textarea element,
        // in order to activate the click event icon, otherwise this event is never executed
        icon.bind("mouseenter", function () {
            textarea.unbind("change");
        });

        // leaving the area of the icon, the change event on the textarea element is enabled
        icon.bind("mouseleave", function () {
            self.bindChangeEventElement(textarea);    
        });


        return control;
    },

    /*
    *  binds change event to HTML element
    */
    bindChangeEventElement: function (element) {
        var self = this;

        // Add handlers
        element.bind("change", function (e) {
            var value = $(this).val();
            if (value.length == 0) value = null;
            self.changeValue(value);
        });
    }


});


/* DATE */
bizagi.editor.component.constantargument.editor.extend("bizagi.editor.component.constantargument.date", {}, {

    /*
    *   Renders the string edition control
    */
    internalRender: function (wrapper) {
        var self = this;
        var template = self.templates["date"];
        var control = self.dateControl = $.tmpl(template, { value: self.value });
        control.appendTo(wrapper);

        // Float element
        self.floatElement();

        // Parse date
        var date;
        try { date = bizagi.util.dateFormatter.getDateFromInvariant(self.value, false); } catch (e) { date = null; }

        var dateControl = control.find("div");
        dateControl.datepicker({
            defaultDate: date,
            onSelect: function (dateText, inst) {
                var value = dateText;
                if (value.length == 0) value = null;
                self.changeValue(value);
            }
        });

        return control;
    },


    /*
    *   Display xpath controls
    */
    displayControls: function (element) {
        var self = this;
        self._super(element);

        // Opaque date control
        if (self.dateControl) self.dateControl.css("opacity", 0.2);
    }
});

/* NUMBER */
bizagi.editor.component.constantargument.editor.extend("bizagi.editor.component.constantargument.number", {}, {

    /*
    *   Renders the string edition control
    */
    internalRender: function (wrapper) {
        var self = this;
        var template = self.templates["number"];
        var formattedValue = self.formatValue(self.value);
        var control = $.tmpl(template, { value: formattedValue });
        control.appendTo(wrapper);

        // Float element
        self.floatElement();

        var input = control.find("input");
        input.numeric(".");
        input.focus();

        // Add handlers
        input.change(function () {
            input.unbind("change");
            var value = $(this).val();
            if (value.length == 0) value = null;
            self.changeValue(value);
        });
        input.keyup(function (ev) {
            if (ev.which == 13) {
                var value = $(this).val();
                if (value.length == 0) value = null;
                self.changeValue(value);
            }
        });

        return control;
    },

    /*
    *   Format the current value
    */
    formatValue: function () {
        var self = this;

        // Workaround to get the display value by the format currency plugin, because it requires a control
        var label = $('<label/>').html(self.value || 0);
        return label.asNumber();
    }
});

/* ENTITY */
bizagi.editor.component.constantargument.editor.extend("bizagi.editor.component.constantargument.entity", {}, {

    /*
    *   Renders the string edition control
    */
    internalRender: function (wrapper) {
        var self = this;
        var defer = new $.Deferred();

        var protocol = bizagi.editor.communicationprotocol.factory.createProtocol({
            protocol: "relatedentity",
            xpath: bizagi.editor.utilities.resolveComplexXpath(self.xpath)
        });

        $.when(protocol.processRequest())
        .done(function (values) {
            var listTemplate = self.templates["list"];
            var argument = self.value ? (self.value.value || self.value) : null;

            var control = self.entityList = $.tmpl(listTemplate, {
                list: values,
                currentValue: argument
            });

            control.appendTo(wrapper);

            // Float element
            self.floatElement();

            // Define a handler to select an item
            control.find("li").click(function () {
                var value = $(this).data("value");
                var label = $(this).text();
                self.changeValue({ value: value, label: label }, "entity");
            });

            defer.resolve(control);
        });


        return defer.promise();
    },

    /*
    *   Display xpath controls
    */
    displayControls: function (element) {
        var self = this;
        self._super(element);

        // Opaque other list
        if (self.entityList) self.entityList.css("opacity", 0.2);
    }
});

/* COLOR */
bizagi.editor.component.constantargument.editor.extend("bizagi.editor.component.constantargument.color", {}, {

    /*
    *   Constructor
    */
    init: function (params) {
        // Call base
        this._super(params);

        // Initialize variables
        this.displayXpathControls = false;
    },

    /*
    *   Renders the string edition control
    */
    internalRender: function (wrapper) {
        var self = this;
        var template = self.templates["color"];
        var control = $.tmpl(template, { value: self.value });
        control.appendTo(wrapper);

        // Apply plugin
        // TODO: Configure palette
        control.find("input").spectrum({
            flat: true,
            color: self.value,
            preferredFormat: "hex",
            showInput: true,
            cancelResponse: function(params){
                params.flat = false;
                control.find("input").spectrum('destroy');
                control.closest('.bz-fm-commandseditor-argument').remove();
                self.element.show();
            },
            showPalette : true ,
            palette: [["black", "white", "red", "orange"], ["yellow", "green", "blue", "purple"]],
            chooseText: bizagi.localization.getResource('formmodeler-component-commandseditor-ok'),
            cancelText: bizagi.localization.getResource('formmodeler-component-commandseditor-cancel'),
            change: function (color) {
                var value = color.toName() || "#" + color.toHex();
                self.changeValue(value);
            }
        });

        // Float element
        self.floatElement();

        return control;
    }
});

/* RULE*/
bizagi.editor.component.constantargument.editor.extend("bizagi.editor.component.constantargument.rule", {}, {

    /*
    *   Renders the rule edition control
    */
    render : function() {
        var self = this;
        var model = self.model;
        var value = { rule: { baref: { ref: "expression"}} };

        if (bizagi.editor.utilities.isObject(self.value)) {
            if (bizagi.editor.utilities.isObject(self.value.rule)) {
                 value = { rule: self.value.rule };
            }
            else if (self.value.guid) {
                 value = { rule: { baref: { ref: self.value.guid}} };
            }
         }

         var xpathContext = null;

         if (model.isGridContext()) {
             var context = model.getContextAction().value;
             xpathContext = model.getControl(context).baxpath;
         }

         var protocol = bizagi.editor.communicationprotocol.factory.createProtocol({
             protocol: "ruleexpression",
             categorytype: "Scripting",
             type: "executerule",
             idcontextentity: xpathContext ? bizagi.editor.utilities.resolveRelatedEntityFromXpath(xpathContext) : null,
             data: value,
             editor : "rule"    
         });

         $.when(protocol.processRequest()).
            done(function (data) {

                if (data) {                   
                    var label = data.displayName;
                    delete data.displayName;

                    self.changeValue({ rule: data, label: label });                    
                }
            });
    }

});

/* INTERFACE */
bizagi.editor.component.constantargument.editor.extend("bizagi.editor.component.constantargument.interface", {}, {

    /*
    * Renders the interface edition control
    */
    render: function () {
        var self = this;
        var model = self.model;
        var value = { interface: { baref: { ref: "expression"}} };

        if (bizagi.editor.utilities.isObject(self.value)) {
            if (bizagi.editor.utilities.isObject(self.value.interface)) {
                value = { interface: self.value.interface };
            }
            else if (self.value.guid) {
                value = { interface: { baref: { ref: self.value.guid}} };
            }
        }

        var xpathContext = null;

        if (model.isGridContext()) {
            var context = model.getContextAction().value;
            xpathContext = model.getControl(context).baxpath;
        }       

        var protocol = bizagi.editor.communicationprotocol.factory.createProtocol({
            protocol: "loadinterface",
            type: "executerule",
            idcontextentity: xpathContext ? bizagi.editor.utilities.resolveRelatedEntityFromXpath(xpathContext) : null,
            idscopedefinition: xpathContext ? bizagi.editor.utilities.resolveContextEntityFromXpath(xpathContext) : null,
            data: value
        });

        $.when(protocol.processRequest()).
            done(function (data) {

                if (data) {
                    var label = data.displayName || "Interface";
                    delete data.displayName;

                    self.changeValue({ interface: data, label: label });

                }
            });
    }
});


/* SAP */
bizagi.editor.component.constantargument.editor.extend("bizagi.editor.component.constantargument.sap", {}, {

    /*
    * Renders the sap edition control
    */
    render: function () {
        var self = this;
        var model = self.model;
        var value = { interface: { baref: { ref: "expression"}} };

        if (bizagi.editor.utilities.isObject(self.value)) {
            if (bizagi.editor.utilities.isObject(self.value.interface)) {
                value = { interface: self.value.interface };
            }
            else if (self.value.guid) {
                value = { interface: { baref: { ref: self.value.guid}} };
            }
        }

        var xpathContext = null;

        if (model.isGridContext()) {
            var context = model.getContextAction().value;
            xpathContext = model.getControl(context).baxpath;
        }

        var protocol = bizagi.editor.communicationprotocol.factory.createProtocol({
            protocol: "loadsapinterface",
            type: "rule",
            idcontextentity: xpathContext ? bizagi.editor.utilities.resolveRelatedEntityFromXpath(xpathContext) : null,
            idscopedefinition: xpathContext ? bizagi.editor.utilities.resolveContextEntityFromXpath(xpathContext) : null,
            data: value
        });

        $.when(protocol.processRequest()).
        done(function (data) {

            if (data) {
                var label = data.displayName || "sap interface";
                delete data.displayName;

                self.changeValue({ interface: data, label: label });

            }
        });
    }
});


/* CONNECTOR */
bizagi.editor.component.constantargument.editor.extend("bizagi.editor.component.constantargument.connector", {}, {

    /*
    * Renders the sap edition control
    */
    render: function () {
        var self = this;
        var model = self.model;
        var value = { connector: { baref: { ref: "expression" } } };

        if (bizagi.editor.utilities.isObject(self.value)) {
            if (bizagi.editor.utilities.isObject(self.value.connector)) {
                value = { connector: self.value.connector };
            }
            else if (self.value.guid) {
                value = { connector: { baref: { ref: self.value.guid } } };
            }
        }

        var xpathContext = null;

        if (model.isGridContext()) {
            var context = model.getContextAction().value;
            xpathContext = model.getControl(context).baxpath;
        }

        var protocol = bizagi.editor.communicationprotocol.factory.createProtocol({
            protocol: "loadconnectorinterface",
            type: "rule",
            idcontextentity: xpathContext ? bizagi.editor.utilities.resolveRelatedEntityFromXpath(xpathContext) : null,
            idscopedefinition: xpathContext ? bizagi.editor.utilities.resolveContextEntityFromXpath(xpathContext) : null,
            data: value
        });

        $.when(protocol.processRequest()).
        done(function (data) {

            if (data) {
                var label = data.displayName || "connector interface";
                delete data.displayName;

                self.changeValue({ connector: data, label: label });

            }
        });
    }
});