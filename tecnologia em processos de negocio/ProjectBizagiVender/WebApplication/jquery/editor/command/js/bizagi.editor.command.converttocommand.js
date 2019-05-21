

/*
*   Name: BizAgi FormModeler Editor Convert To Command
*   Author: Alexander Mejia
*   Comments:
*   -   This script will define basic stuff for converttocommand
*
*   Arguments
*   -   guid
*   -   convertTo
*/

bizagi.editor.refreshableCommand.extend("bizagi.editor.convertToCommand", {}, {

    /*
    *   Perform convertTo
    */
    execute: function () {
        var self = this;
        var args = self.arguments;
        var element = self.model.getElement(args.guid);

        var useExternalData = false;
        if (self.needsExternalData(args.convertTo)) {
            // Validate element
            if (!self.validateElement(element, args.convertTo)) {
                args.canUndo = false;
                return false;
            }
            useExternalData = true;
            if (!self.precondition) {
                self.precondition = self.controller.publish("getExternalData", {
                    control: args.convertTo,
                    xpath: element.resolveProperty("xpath")
                });
            }
        }

        // After precondition is evaluated (can be async), the result is processed
        // This command returns an async result
        return $.when(self.precondition)
            .pipe(function (data) {
                if (useExternalData) { self.processControl({ control: args.convertTo, data: data }); }
                else { self.converToElement(); }
            }).pipe(function () {
                return true;
            });


    },

    /*
    *   Convert to element
    */
    converToElement: function () {
        var self = this;
        var args = self.arguments;
        var defer = $.Deferred();

        if (!self.data) {
            var commonProperties = self.getCommonProperties({ exclude: {} });
            var elements = self.getElements();
            self.convertToElement = self.createElement($.extend(commonProperties, { type: args.convertTo }), elements);
            self.controller.executeCommand({ command: "applyOverridesElement", element: self.convertToElement });
        }

        // Execute remove element by id command
        $.when(self.controller.executeCommand({ command: "removeElementById", guid: args.guid, canUndo: false, action: "convertTo" }))
            .done(function (data) {
                data = self.resolveData(data);
                self.controller.removeSelectedElement(args.guid);
                self.model.insertElement(data.position, data.parent.guid, self.convertToElement);
                self.data = data;
                self.controller.executeCommand({ command: "applyOverridesElement", element: self.data });
                defer.resolve();
            });

        return defer.promise();
    },

    /*
    *   Undo property change
    */
    undo: function () {
        var self = this;

        var guid = self.convertToElement.guid;

        // Execute remove element by id command
        self.controller.executeCommand({
            command: "removeElementById",
            guid: guid,
            action: "convertTo",
            canUndo: false
        });

        if ($.isArray(self.data.entities)) { self.insertCascadingCombo(); }
        else { self.model.insertElement(self.data.position, self.data.parent.guid, self.data); }

        return true;
    },

    /*
    *   Matchs properties between elements and return commons
    */
    getCommonProperties: function (params) {
        var self = this,
            args = self.arguments;

        var exclude = params.exclude || {};
        var controls = self.controller.getControlsModel();
        var element = self.model.getElement(args.guid);
        var propertiesElement = controls.getDesignProperties(element.type) || {};
        var propertiesConvertToElement = controls.getDesignProperties(args.convertTo) || {};
        var commonProperties = {};

        commonProperties["renderType"] = true;

        for (var key in propertiesElement) {
            if (!exclude[key]) {
                var elementProperty = propertiesElement[key];
                var convertToProperty = propertiesConvertToElement[key];

                if (elementProperty && convertToProperty && self.identicalProperties(elementProperty, convertToProperty)) {
                    commonProperties[key] = true;
                }
            }
        }


        return self.setValueConvertToProperties(element, commonProperties);
    },

    /*
    * Returns the child elements, only applies to containers and collections
    */
    getElements: function () {
        var self = this,
            args = self.arguments;

        var element = self.model.getElement(args.guid);

        if (!element)
            return undefined;

        if (!element.elements)
            return undefined;

        if (self.isContainer(element.type) || self.isCollection(element.type))
            return element.elements;

        return undefined;
    },

    /*
    * Returns true if the element is a container
    */
    isContainer: function (type) {
        return (type == "group" || type === "panel" || type === "tab");
    },

    /*
    * Returns true if the element is a collection
    */
    isCollection: function (type) {
        return (type == "grid" || type === "groupedgrid");
    },

    /*
    * Returns true is properties have same bastype
    */
    identicalProperties: function (elementProperty, convertToProperty) {
        var self = this;

        if (elementProperty["bas-type"] && convertToProperty["bas-type"]) {
            
            if (elementProperty.subproperties ^ convertToProperty.subproperties) {
                return false;
            } else {
                if (elementProperty.subproperties) {
                    return self.identicalSubproperties(elementProperty.subproperties, convertToProperty.subproperties);
                }
            }

            return elementProperty["bas-type"] === convertToProperty["bas-type"];
        }
        else { return false; }
    },

    identicalSubproperties: function (elementProperties, convertToProperties) {
        return bizagi.util.identicalObjects(elementProperties, convertToProperties);
    },

    /*
    *  Sets values convert to properties
    */
    setValueConvertToProperties: function (element, commonProperties) {
        var properties = element.properties;
        var convertToProperties = {};

        for (var key in commonProperties) {
            if (properties[key]) {
                convertToProperties[key] = bizagi.clone(properties[key]);
            }
        }

        return convertToProperties;
    },

    /*
    *   Check if an element type needs a wizard or not before being inserted
    */
    needsExternalData: function (type) {
        if (type == "cascadingcombo" || type == "querycascadingcombo" ) {
            return true;
        }
        return false;
    },

    /*
    *   Process control
    */
    processControl: function (params) {
        var self = this;

        if (params.control == "cascadingcombo" || params.control == "querycascadingcombo") { return self.processCascadingCombo(params.data); }

    },

    /*
    *   Process the cascading combo control special case
    */
    processCascadingCombo: function (entities) {
        var self = this,
            args = self.arguments;

        var defer = $.Deferred();

        // Check that the selected entity has set a parent entity
        if (entities.length < 2) {
            var message = bizagi.localization.getResource("bizagi-editor-form-validation-convertto-cascadingcombo");
            bizagi.showMessageBox(message, "Bizagi", "error", false);
            defer.resolve();
            return;
        }

        var commonProperties = self.getCommonProperties({ exclude: { displayName: 1, xpath: 1, data: 1} });

        $.when(self.controller.executeCommand({ command: "removeElementById", guid: args.guid, canUndo: false, action: "convertTo" }))
            .done(function (data) {
                data = self.resolveData(data);
                self.data = data;
                var parent = data.parent.guid || self.controller.getContextInfo().guid;
                var position = data.position;

                // Process result, create an element for each array entry
                var lastControlGuid;
                var lastElement;
                if (!self.cascadingComboElements) { self.cascadingComboElements = {}; }
                $.each(entities, function (i, entity) {

                    if (!self.cascadingComboElements[i]) {
                        // Create a new element if none has been provided
                        self.convertToElement = self.createElement($.extend(commonProperties, {
                            type: args.convertTo,
                            xpath: bizagi.editor.utilities.buildComplexXpath(entity.xpath, args.contextEntity, false, entity.id),
                            parentcombo: lastControlGuid,
                            parentrelation: (entity.parentRelation ? bizagi.editor.utilities.buildComplexXpath(entity.parentRelation, entity.id, false, entity.parentEntity) : undefined)
                        }));

                        self.cascadingComboElements[i] = self.convertToElement;
                    }
                    else { self.convertToElement = self.cascadingComboElements[i]; }

                    // Execute insert element command
                    self.controller.executeCommand({
                        command: "insertElement",
                        parent: parent,
                        element: self.convertToElement,
                        position: position + i,
                        canUndo: false
                    });

                    // Relate child combo to make deletion easy
                    if (lastElement != null) {
                        lastElement.setProperty("childcombo", self.convertToElement.guid);
                    }

                    // Save last control guid
                    lastControlGuid = self.convertToElement.guid;
                    lastElement = self.model.getElement(lastControlGuid);
                });

                defer.resolve();
            });

        defer.promise();
    },

    /*
    * Validate properties element
    */
    validateElement: function (element, control) {
        var self = this;
        var args = self.arguments;

        if (control === "cascadingcombo" || control === "querycascadingcombo") {
            var xpath = element && element.resolveProperty("xpath");
            if (typeof (xpath) !== "object") {
                bizagi.showMessageBox(bizagi.localization.getResource("bizagi-editor-wizard-cascadingcombo-invaliddatasource"), "Bizagi", "error", false);
                return false;
            }

            args.contextEntity = bizagi.editor.utilities.resolveContextEntityFromXpath(xpath);
        }

        return true;
    },

    /*
    *  Insert cascading combo elements
    */
    insertCascadingCombo: function () {
        var self = this;

        $.each(self.data.entities, function (i, entity) {
            self.model.insertElement(self.data.position + i, entity.parent.guid, entity);
        });

    },

    /*
    * Return element deleted
    */
    resolveData: function (data) {
        return $.isArray(data) ? data[0] : data;
    }


})
