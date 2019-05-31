/*
*   Name: BizAgi FormModeler Editor Get Properties Model Command
*   Author: Alexander Mejia
*   Comments:
*   -   This script will define basic stuff for get properties model command
*
*   Arguments
*   - guid
*/

// TODO: Refactor this
bizagi.editor.notUndoableCommand.extend("bizagi.editor.getPropertiesModelCommand", {}, {

    /*
    *   Executes the command, finds the element, and creates the property model in order to show the property box in the screen
    */
    execute: function () {
        var self = this;
        var args = self.arguments;
        var element = self.model.getElement(args.guid);

        // Get properties model
        var propertiesModel = self.getPropertiesModel(element);

        if (args.showValidations) {
            var validations = element.getFormValidations();
            if (validations) { propertiesModel.validations = bizagi.clone(validations); }
        }
        // Prepare result
        self.arguments.result = propertiesModel;
        return true;
    },

    /*
    *   Returns the properties model for the selected element
    */
    getPropertiesModel: function (element) {
        var self = this,
            propertiesModel, externalProperties;

        propertiesModel = element.getPropertiesModel();
        propertiesModel = self.resolveDependencies(propertiesModel);

        externalProperties = element.getPropertiesExternal();

        $.extend(propertiesModel, externalProperties);

        return propertiesModel;
    },

    // TODO: Simplify this method, too hard to understand
    resolveDependencies: function (model) {
        var self = this, tabs;

        // Se revisa cuántos renders llegan (se trabaja para el caso de un solo render)
        if (model.elements.length > 1) {
            // Aun no se sabe qué debe hacerse en este caso
            throw "No code for this case";
        } else {
            tabs = model.elements[0].tabs;
            self.map = {};
            self.generateElementMap(tabs, "");

            // Se resuelven las dependencias (iterando)
            self.resolveAllDependencies(model);

            // Se resuelven las dependencias puntuales
            self.resolveSpecificDependencies(model);
        }
        return model;
    },

    generateElementMap: function (elements, indexes) {
        var self = this, element, innerElements, newIndexes, labelIndexes, newIndexesMod;
        var i, map;
        map = self.map;
        for (i = 0; i < elements.length; i++) {
            labelIndexes = "";
            // se elige el elemento correcto para analizar
            if (elements[i].property !== undefined) {
                element = elements[i].property;
                if (element.subproperties !== undefined) {
                    labelIndexes = "(property.subproperties)";
                } else {
                    labelIndexes = "(property)";
                }
            } else {
                if (elements[i].group !== undefined) {
                    element = elements[i].group;
                    labelIndexes = "(group.elements)";
                } else {
                    if (elements[i].category !== undefined) {
                        element = elements[i].category;
                        labelIndexes = "(category)";
                    } else {
                        element = elements[i];
                        labelIndexes = "(elements)";
                    }
                }
            }

            newIndexes = indexes + "" + i + labelIndexes;

            // se almacena el valor en el mapa
            if (element.name !== undefined && element["bas-type"] !== undefined) {
                if (element.subproperties !== undefined) {
                    newIndexesMod = indexes + "" + i + "(property)";
                    map[element.name] = newIndexesMod;
                } else {
                    map[element.name] = newIndexes;
                }
            }

            // se revisan los subelementos
            if (element.elements !== undefined) {
                innerElements = element.elements;
            } else {
                if (element.subproperties !== undefined) {
                    innerElements = element.subproperties;
                } else {
                    innerElements = undefined;
                }

            }

            if (innerElements !== undefined) {
                if ($.isArray(innerElements)) {
                    if (innerElements.length > 0) {
                        self.generateElementMap(innerElements, newIndexes);
                    }
                }
            }
        }
    },

    resolveAllDependencies: function (model) {
        var self = this, tabs, tab, property, tabsLength, propertiesLength, i, j;
        // se resuelven las dependencias que deben iterarse por completo
        tabs = model.elements[0].tabs;
        tabsLength = tabs.length;
        // Iterate over tabs
        for (i = 0; i < tabsLength; i++) {
            tab = tabs[i];
            propertiesLength = tab.elements.length;
            // Iterate over properties
            for (j = 0; j < propertiesLength; j++) {
                property = tab.elements[j].property;
                if (property !== undefined) {
                    self.resolveEditorParametersRule(property, model);
                }
            }
        }
    },

    resolveEditorParametersRule: function (property, model) {
        var self = this;
        var attribute, params, rule, tokens, propertyFromUpdate;

        // Generalización del parseo de las reglas - desactivado momentaneamente
        //var rules = bizagi.editor.component.properties.hasRule(property);
        //if(rules !== undefined) {
        //self.processRules(rules, model);
        //}        

        if (property["editor-parameters"] !== undefined) {
            params = property["editor-parameters"];
            // Iterate over attributes in parameters
            for (attribute in params) {
                // search rule property in attribute
                if (params[attribute] && params[attribute].rule !== undefined) {
                    rule = params[attribute].rule;
                    // search <*> format
                    if (rule.search(/^<.*>$/) != -1) {
                        rule = rule.substring(1, rule.length - 1);
                        // parse
                        tokens = rule.split(":");
                        if (tokens.length > 1) {
                            if (tokens[0] == "design") {
                                propertyFromUpdate = tokens[1];
                                if (tokens[2] === undefined) {
                                    self.updateDependency(property.name, propertyFromUpdate, "editorParameters", model);
                                }
                            }
                        }
                    }
                }
            }
        }
    },

    processRules: function (rules, model) {
        var self = this;
        bizagi.editor.component.properties.processrules(rules, model, self.map);
    },

    updateDependency: function (toUpdate, fromUpdate, type, model) {
        var self = this;
        var value = self.getMapAttribute(fromUpdate, "value", model);

        if (typeof (value) !== "undefined") {
            if (value === false || value == "false") {
                value = false;
            } else {
                if (value === true || value == "true") {
                    value = true;
                } else {
                    throw "value is " + value;
                }
            }
        }

        self.setMapAttributeEditorParameter(toUpdate, fromUpdate, value, model);
    },

    surfModel: function (expression, number, model) {
        var value = undefined;
        var parts;
        parts = expression.split(".");
        if (parts.length > 1) {
            switch (parts[0]) {
                case "group":
                    if (parts[1] == "elements") {
                        value = model[number][parts[0]][parts[1]];
                    }
                    break;
                case "property":
                    if (parts[1] == "subproperties") {
                        value = model[number][parts[0]][parts[1]];
                    }
                    break;
            }
        } else {
            switch (expression) {
                case "elements":
                    value = model.elements[0].tabs[number][expression];
                    break;
                case "property":
                    value = model[number][expression];
                    break;
            }
        }
        return value;
    },

    setMapAttributeWithChangeProperty: function (name, attribute, value, model) {
        var self = this;
        self.setMapAttribute(name, attribute, value, model);
        self.controller.executeCommand({
            command: "changeProperty",
            guid: model.idRender,
            property: name,
            value: value,
            canUndo: false
        });
    },

    setMapAttribute: function (name, attribute, value, model) {
        var self = this, property;
        property = self.getPropertyFromMap(name, model);

        if (property) {
            property[attribute] = value;
        } else {
            throw "Error with the reference (set)";
        }
    },

    getMapAttribute: function (name, attribute, model) {
        var self = this, property, value;
        property = self.getPropertyFromMap(name, model);

        if (property) {
            value = property[attribute];
        } else {
            throw "Error with the reference (get)";
        }
        return value;
    },

    getPropertyFromMap: function (name, model) {
        var self = this, i, expression;
        var map = self.map;
        var stringMap = map[name];

        var numbers = stringMap.match(/\d+/g);
        var rules = stringMap.match(/\(([a-z]+|\.)+\)/g);

        var variable = model;

        for (i = 0; i < numbers.length && i < rules.length; i++) {
            expression = rules[i].substring(1, rules[i].length - 1);
            variable = self.surfModel(expression, numbers[i], variable);
        }

        return variable;
    },

    setMapAttributeEditorParameter: function (name, attribute, value, model) {
        var self = this, property;
        property = self.getPropertyFromMap(name, model);

        if (property) {
            property["editor-parameters"][attribute].value = value;
        } else {
            throw "Error with the reference for editor parameter (set)";
        }
    },

    resolveSpecificDependencies: function (model) {
        var self = this;

        // for datalist
        self.resolveDatalistSubproperties(model);
        self.resolveDependenciesFromXpathForCombos(model);
        self.resolveDependenciesFromXpathForSearch(model);
        self.resolveDependenciesFromXpathForGrid(model);

        // for xpath-to-collection renders
        if (self.getRenderType(model) === "grid") {
            self.updateFormsProperties(model);
        }
        if (self.getRenderType(model) === "groupedgrid") {
            self.updateGroupedGridProperties(model);
        }
        if (self.getRenderType(model) === "offlinegrid") {
            self.updateOfflineGridProperties(model);
        }

        if (self.getRenderType(model) === "collectionnavigator") {
            self.updateCollectionNavigatorProperties(model);
        }

        // for text and extended text
        if (self.getRenderType(model) === "text" || self.getRenderType(model) === "columntext") {
            self.updateText(model);
        }

        // for action Launcher control
        if (self.getRenderType(model) === "actionlauncher") {
            self.updateActionLauncher(model);
        }

        // for entity template control
        if (self.getRenderType(model) === "entitytemplate") {
            self.updateEntityTemplate(model);
        }

        // for decimals
        self.updateDecimalsForNumbers(model);

        // for advancedsearch and newrecords
        self.updateMultipleSearch(model);

        // for document templates allowgenerate
        self.resolveDocumentTemplatesButtonsVisibilityByAllowgenerate(model);

        //for document templates
        /* TODO: revisar ya que se bloquea la aplicacion al ejecutar este metodo */
        self.resolveBindingButtonVisibility(model);

        // for button
        self.resolveUserConfirmationMessageVisibility(model);

        // for columns
        self.resolveGroupProperties(model);
    },

    resolveDatalistSubproperties: function (model) {
        var self = this;
        var map = self.map, valueXpath, subproperties, subproperty, i;

        if (map["xpath"] !== undefined && map["data"] !== undefined) {
            valueXpath = self.getMapAttribute("xpath", "value", model);

            if (valueXpath !== null && typeof (valueXpath) === "object") {
                // delete notShow mark
                if (self.hasMapProperty("data", "notShow", model)) {
                    self.deleteMarkNotShow("data", model);
                }

                // get subproperties from datalist
                subproperties = self.getMapAttribute("data", "subproperties", model);
                for (i = 0; i < subproperties.length; i++) {
                    subproperty = subproperties[i].property;
                    self.resolveDatalistSubpropertiesRule(subproperty, valueXpath, model);
                }
            } else {
                // mark datalist
                self.insertMarkNotShow("data", model);
            }
        }
    },

    resolveDependenciesFromXpathForCombos: function (model) {
        var self = this, valueXpath;
        if (self.areThesePropertiesInMap(["xpath", "data.displayattrib", "data.additionalattrib", "data.sortattribute", "data.filter"])) {
            valueXpath = self.getMapAttribute("xpath", "value", model);
            if (valueXpath !== null && typeof (valueXpath) === "object") {
                self.deleteMarkNotShow("data.displayattrib", model);
                self.deleteMarkNotShow("data.additionalattrib", model);
                self.deleteMarkNotShow("data.sortattribute", model);
                self.deleteMarkNotShow("data.filter", model);
            } else {
                self.insertMarkNotShow("data.displayattrib", model);
                self.insertMarkNotShow("data.additionalattrib", model);
                self.insertMarkNotShow("data.sortattribute", model);
                self.insertMarkNotShow("data.filter", model);
            }
        }
    },

    resolveDependenciesFromXpathForSearch: function (model) {
        var self = this, valueXpath;
        if (self.areThesePropertiesInMap(["xpath", "searchforms", "data.displayattrib", "data.filter"])) {
            valueXpath = self.getMapAttribute("xpath", "value", model);
            if (valueXpath !== null && typeof (valueXpath) === "object") {
                self.deleteMarkNotShow("data.displayattrib", model);
                self.deleteMarkNotShow("data.filter", model);
            } else {
                self.insertMarkNotShow("data.displayattrib", model);
                self.insertMarkNotShow("data.filter", model);
            }
        }
    },

    resolveDependenciesFromXpathForGrid: function (model) {
        var self = this, valueXpath;
        if (self.areThesePropertiesInMap(["xpath", "gridvalidations", "data.sortattribute", "data.filter"])) {
            valueXpath = self.getMapAttribute("xpath", "value", model);
            if (valueXpath !== null && typeof (valueXpath) === "object") {
                self.deleteMarkNotShow("data.sortattribute", model);
                self.deleteMarkNotShow("data.filter", model);
                // sort
                if (self.areThesePropertiesInMap(["data.sortattribute", "data.sortorder"])) {
                    var value = self.getMapAttribute("data.sortattribute", "value", model);
                    if (value !== null && typeof (value) === "object") {
                        self.deleteMarkNotShow("data.sortorder", model);
                    } else {
                        self.insertMarkNotShow("data.sortorder", model);
                    }
                }
            } else {
                self.insertMarkNotShow("data.sortattribute", model);
                self.insertMarkNotShow("data.filter", model);
                if (self.areThesePropertiesInMap(["data.sortattribute", "data.sortorder"])) {
                    self.insertMarkNotShow("data.sortorder", model);
                }
            }
        }
    },

    resolveDocumentTemplatesButtonsVisibilityByAllowgenerate: function (model) {
        var self = this;
        if (self.areThesePropertiesInMap(["validate", "allowgenerate"])) {

            var valueAllowgenerate = self.getMapAttribute("allowgenerate", "value", model);

            if (valueAllowgenerate && self.hasMapProperty("validate", "notShow", model)) {
                self.deleteMarkNotShow("validate", model);
            } else if (!valueAllowgenerate) {
                self.insertMarkNotShow("validate", model);
                self.setMapAttributeWithChangeProperty("validate", "value", false, model);
            }
        }
    },

    resolveBindingButtonVisibility: function (model) {
        var self = this;
        var map = self.map, valueXpath;
        if (self.areThesePropertiesInMap(["xpath", "groupmapping"])) {
            valueXpath = self.getMapAttribute("xpath", "value", model);

            if (valueXpath !== null && typeof (valueXpath) === "object") {
                // delete notShow mark
                if (self.hasMapProperty("groupmapping", "notShow", model)) {
                    self.deleteMarkNotShow("groupmapping", model);
                }

            } else {
                // mark datalist
                self.insertMarkNotShow("groupmapping", model);
            }
        }
    },

    deleteMarkNotShow: function (name, model) {
        this.setMapAttribute(name, "notShow", undefined, model);
    },

    insertMarkNotShow: function (name, model) {
        this.setMapAttribute(name, "notShow", true, model);
    },

    resolveDatalistSubpropertiesRule: function (subproperty, valueXpath, model) {
        var self = this, rule, tokens;
        if (subproperty["user-editable"] == "true") {
            if (subproperty.value !== null && typeof (subproperty.value) == "string") {
                if (subproperty.value.search(/^<.*>$/) != -1) {
                    rule = subproperty.value.substring(1, subproperty.value.length - 1);
                    tokens = rule.split(":");
                    if (tokens[0] == "design" && tokens[1] == "xpath" && tokens[2] == "relatedentity") {
                        self.updateValueMapForSubproperty(subproperty.name, valueXpath, model);
                    }
                }
            }
        }
    },

    hasMapProperty: function (name, attribute, model) {
        var self = this, property;
        property = self.getPropertyFromMap(name, model);
        return property[attribute] !== undefined;
    },

    updateValueMapForSubproperty: function (name, valueXpath, model) {
        this.setMapAttribute(name, "value", valueXpath, model);
    },

    // resolve dependencies between subproperties in multiple
    updateMultipleSearch: function (model, map) {
        var self = this, value;
        if (self.areThesePropertiesInMap(["newrecords"])) {
            // newrecords
            value = self.getMapAttribute("newrecords", "value", model);
            if (self.isFalsifiable(value.allownew)) {
                self.insertMarkNotShow("newrecords.allownewform", model);
            } else {
                self.deleteMarkNotShow("newrecords.allownewform", model);
            }
        }
    },

    isFalsifiable: function (value) {
        var result = false;
        if (value === undefined || value === null || value === false || value == "false") {
            result = true;
        } else {
            if (value === true || value == "true") {
                result = false;
            }
        }
        return result;
    },

    // resolve dependencies between allowdecimals and numdecimals
    updateDecimalsForNumbers: function (model) {
        var self = this, value;
        if (self.areThesePropertiesInMap(["allowdecimals", "numdecimals"])) {
            // numdecimals
            value = self.getMapAttribute("allowdecimals", "value", model);
            if (self.isFalsifiable(value)) {
                self.insertMarkNotShow("numdecimals", model);
            } else {
                self.deleteMarkNotShow("numdecimals", model);
            }
        }
    },


    resolveUserConfirmationMessageVisibility: function (model) {
        var self = this;

        if (self.areThesePropertiesInMap(["userconfirmation.needsuserconfirmation"])) {
            // needsuserconfirmation
            value = self.getMapAttribute("userconfirmation.needsuserconfirmation", "value", model);
            if (self.isFalsifiable(value)) {
                self.insertMarkNotShow("userconfirmation.userconfirmationmessage", model);
            } else {
                self.deleteMarkNotShow("userconfirmation.userconfirmationmessage", model);
            }
        }
    },

    setMapAttributesWithChangeMultipleProperties: function (properties, model) {
        var self = this, i;
        for (i = 0; i < properties.length; i++) {
            self.setMapAttribute(properties[i].property, "value", properties[i].value, model);
        }
        self.controller.executeCommand({
            command: "changeMultipleProperties",
            properties: properties,
            guid: model.idRender
        });
    },

    updateInlineaddAndWithform: function (model) {
        var self = this;
        if (self.controller.mem === undefined) {
            self.controller.mem = {}; // contiene la memoria de las propiedades
            self.controller.mem[model.idRender] = {};
            self.controller.mem[model.idRender]["inlineadd"] = self.isFalsifiable(self.getMapAttribute("inlineadd", "value", model)) ? false : true;
            self.controller.mem[model.idRender]["add.withform"] = self.isFalsifiable(self.getMapAttribute("add.withform", "value", model)) ? false : true;
        } else {
            if (self.controller.mem[model.idRender] === undefined) {
                self.controller.mem[model.idRender] = {};
                self.controller.mem[model.idRender]["inlineadd"] = self.isFalsifiable(self.getMapAttribute("inlineadd", "value", model)) ? false : true;
                self.controller.mem[model.idRender]["add.withform"] = self.isFalsifiable(self.getMapAttribute("add.withform", "value", model)) ? false : true;
            }
        }
        if (self.controller.mem[model.idRender] !== undefined) {
            if (self.isFalsifiable(self.getMapAttribute("inlineadd", "value", model)) != self.isFalsifiable(self.controller.mem[model.idRender]["inlineadd"])) {
                if (self.isFalsifiable(self.getMapAttribute("inlineadd", "value", model))) {
                    self.setMapAttributesWithChangeMultipleProperties([{
                        property: "inlineadd",
                        value: false
                    }, {
                        property: "add.withform",
                        value: true
                    }
                    ], model);
                    self.controller.mem[model.idRender]["inlineadd"] = false;
                    self.controller.mem[model.idRender]["add.withform"] = true;
                } else {
                    self.setMapAttributesWithChangeMultipleProperties([{
                        property: "inlineadd",
                        value: true
                    }, {
                        property: "add.withform",
                        value: false
                    }
                    ], model);
                    self.controller.mem[model.idRender]["inlineadd"] = true;
                    self.controller.mem[model.idRender]["add.withform"] = false;
                }
            } else {
                if (self.isFalsifiable(self.getMapAttribute("add.withform", "value", model))) {
                    self.setMapAttributesWithChangeMultipleProperties([{
                        property: "inlineadd",
                        value: true
                    }, {
                        property: "add.withform",
                        value: false
                    }
                    ], model);
                    self.controller.mem[model.idRender]["inlineadd"] = true;
                    self.controller.mem[model.idRender]["add.withform"] = false;
                } else {
                    self.setMapAttributesWithChangeMultipleProperties([{
                        property: "inlineadd",
                        value: false
                    }, {
                        property: "add.withform",
                        value: true
                    }
                    ], model);
                    self.controller.mem[model.idRender]["inlineadd"] = false;
                    self.controller.mem[model.idRender]["add.withform"] = true;
                }
            }
        }
    },

    // resolve dependencies between add, edit, delete and detail
    updateFormsProperties: function (model) {
        var self = this, value;

        // add
        if (self.areThesePropertiesInMap(["allowadd", "add.addlabel", "inlineadd", "add.withform", "add.addform"])) {
            value = self.getMapAttribute("allowadd", "value", model);
            if (self.isFalsifiable(value)) {
                self.insertMarkNotShow("add.addlabel", model);
                self.insertMarkNotShow("inlineadd", model);
                self.insertMarkNotShow("add.withform", model);
                self.insertMarkNotShow("add.addform", model);
                self.insertMarkNotShow("add.validationrule", model);
                // set add.withform
                self.setMapAttribute("add.withform", "value", false, model);
            } else {
                self.deleteMarkNotShow("add.addlabel", model);
                self.deleteMarkNotShow("inlineadd", model);
                self.insertMarkNotShow("add.withform", model);
                self.deleteMarkNotShow("add.addform", model);
                self.deleteMarkNotShow("add.validationrule", model);
            }
            // rules between inlineadd and add.withform
            self.updateInlineaddAndWithform(model);

            if (self.areThesePropertiesInMap(["add.withform", "add.addform"])) {
                value = self.getMapAttribute("add.withform", "value", model);
                if (self.isFalsifiable(value)) {
                    self.insertMarkNotShow("add.addform", model);
                    self.insertMarkNotShow("add.validationrule", model);
                } else {
                    if (!self.isFalsifiable(self.getMapAttribute("allowadd", "value", model))) {
                        self.deleteMarkNotShow("add.addform", model);
                        self.deleteMarkNotShow("add.validationrule", model);
                    }
                }
            }
        }

        // delete
        if (self.areThesePropertiesInMap(["delete.allowdelete", "delete.deletelabel", "delete.validationrule"])) {
            // delete's subproperties
            value = self.getMapAttribute("delete.allowdelete", "value", model);
            if (self.isFalsifiable(value)) {
                self.insertMarkNotShow("delete.deletelabel", model);
                self.insertMarkNotShow("delete.validationrule", model);
            } else {
                self.deleteMarkNotShow("delete.deletelabel", model);
                self.deleteMarkNotShow("delete.validationrule", model);
            }
        }

        // edit
        if (self.areThesePropertiesInMap(["allowedit", "edit.editlabel", "edit.editform", "edit.validationrule", "edit.inlineedit"])) {
            value = self.getMapAttribute("allowedit", "value", model);
            if (self.isFalsifiable(value)) {
                self.insertMarkNotShow("edit.editlabel", model);
                self.insertMarkNotShow("edit.inlineedit", model);
                self.insertMarkNotShow("edit.withform", model);
                self.insertMarkNotShow("edit.editform", model);
                self.insertMarkNotShow("edit.validationrule", model);
                // set edit.withform
                self.setMapAttributeWithChangeProperty("edit.withform", "value", "false", model);
            } else {
                self.deleteMarkNotShow("edit.editlabel", model);
                self.deleteMarkNotShow("edit.inlineedit", model);
                self.insertMarkNotShow("edit.withform", model);
                self.deleteMarkNotShow("edit.editform", model);
                self.deleteMarkNotShow("edit.validationrule", model);
                // set edit.withform
                var editFormValue = self.getMapAttribute("edit.editform", "value", model);
                if (self.isFalsifiable(editFormValue) || $.isEmptyObject(editFormValue)) {
                    self.setMapAttributeWithChangeProperty("edit.withform", "value", "false", model);
                } else {
                    self.setMapAttributeWithChangeProperty("edit.withform", "value", "true", model);
                }
            }
        }

        // detail
        if (self.areThesePropertiesInMap(["allowdetail", "detail.detaillabel", "detail.detailform"])) {
            value = self.getMapAttribute("allowdetail", "value", model);
            if (self.isFalsifiable(value)) {
                self.insertMarkNotShow("detail.detaillabel", model);
                self.insertMarkNotShow("detail.detailform", model);
            } else {
                self.deleteMarkNotShow("detail.detaillabel", model);
                self.deleteMarkNotShow("detail.detailform", model);
            }
        }

        // totalize
        if (self.areThesePropertiesInMap(["totalize.operation"])) {
            value = self.getMapAttribute("totalize.operation", "value", model);
            // totalize subproperties
            if (bizagi.util.isEmpty(value)) {
                self.insertMarkNotShow("totalize.format", model);
            } else {
                self.deleteMarkNotShow("totalize.format", model);
            }
        }

    },

    /*
    * Resolve dependencies for offlinegrid control
    */
    updateOfflineGridProperties: function (model) {
        var self = this;

        //add
        if (self.areThesePropertiesInMap(["add.allowadd", "add.addlabel"])) {
            var value = self.getMapAttribute("add.allowadd", "value", model);
            if (self.isFalsifiable(value)) {
                self.insertMarkNotShow("add.addlabel", model);
            } else {
                self.deleteMarkNotShow("add.addlabel", model);
            }
        }

        //delete
        if (self.areThesePropertiesInMap(["delete.allowdelete", "delete.deletelabel"])) {
            value = self.getMapAttribute("delete.allowdelete", "value", model);
            if (self.isFalsifiable(value)) {
                self.insertMarkNotShow("delete.deletelabel", model);
            } else {
                self.deleteMarkNotShow("delete.deletelabel", model);
            }
        }
    },

    /*
    * Resolve dependencies for collection navigator control
    */
    updateCollectionNavigatorProperties: function (model) {
        var self = this, value;

        // add
        if (self.areThesePropertiesInMap(["allowadd", "add.inlineadd", "add.addform", "add.validationrule"])) {
            value = self.getMapAttribute("allowadd", "value", model);
            if (self.isFalsifiable(value)) {
                self.insertMarkNotShow("add.inlineadd", model);
                self.insertMarkNotShow("add.addform", model);
                self.insertMarkNotShow("add.validationrule", model);
            } else {
                self.deleteMarkNotShow("add.inlineadd", model);
                self.deleteMarkNotShow("add.addform", model);
                self.deleteMarkNotShow("add.validationrule", model);
            }

            if (!self.isFalsifiable(value)) {
                value = self.getMapAttribute("add.addform", "value", model);
                if (self.isFalsifiable(value)) {
                    self.insertMarkNotShow("add.validationrule", model);
                } else {
                    self.deleteMarkNotShow("add.validationrule", model);
                }
            }
        }

        // edit
        if (self.areThesePropertiesInMap(["allowedit", "edit.editform", "edit.inlineedit", "edit.validationrule"])) {
            value = self.getMapAttribute("allowedit", "value", model);
            if (self.isFalsifiable(value)) {
                self.insertMarkNotShow("edit.inlineedit", model);
                self.insertMarkNotShow("edit.editform", model);
                self.insertMarkNotShow("edit.validationrule", model);
            } else {
                self.deleteMarkNotShow("edit.inlineedit", model);
                self.deleteMarkNotShow("edit.editform", model);
                self.deleteMarkNotShow("edit.validationrule", model);
            }

            if (!self.isFalsifiable(value)) {
                value = self.getMapAttribute("edit.editform", "value", model);
                if (self.isFalsifiable(value)) {
                    self.insertMarkNotShow("edit.validationrule", model);
                } else {
                    self.deleteMarkNotShow("edit.validationrule", model);
                }
            }
        }

        //delete
        if (self.areThesePropertiesInMap(["delete.allowdelete", "delete.validationrule"])) {
            value = self.getMapAttribute("delete.allowdelete", "value", model);
            if (self.isFalsifiable(value)) {
                self.insertMarkNotShow("delete.validationrule", model);
            } else {
                self.deleteMarkNotShow("delete.validationrule", model);
            }
        }

        // detail
        if (self.areThesePropertiesInMap(["allowdetail", "detail.detailform"])) {
            value = self.getMapAttribute("allowdetail", "value", model);
            if (self.isFalsifiable(value)) {
                self.insertMarkNotShow("detail.detailform", model);
            } else {
                self.deleteMarkNotShow("detail.detailform", model);
            }
        }
        

        //Dependencies by xpath        
        if (self.areThesePropertiesInMap(["xpath", "data.sortattribute", "data.filter", "data.sortorder"])) {
            var valueXpath = self.getMapAttribute("xpath", "value", model);
            if (valueXpath !== null && typeof (valueXpath) === "object") {
                self.deleteMarkNotShow("data.sortattribute", model);
                self.deleteMarkNotShow("data.filter", model);

                // sort                
                value = self.getMapAttribute("data.sortattribute", "value", model);
                if (value !== null && typeof (value) === "object") {
                    self.deleteMarkNotShow("data.sortorder", model);
                } else {
                    self.insertMarkNotShow("data.sortorder", model);
                }

            } else {
                self.insertMarkNotShow("data.sortattribute", model);
                self.insertMarkNotShow("data.filter", model);
                self.insertMarkNotShow("data.sortorder", model);
            }
        }

    },


    updateGroupedGridProperties: function (model) {
        var self = this, value;

        // add
        if (self.areThesePropertiesInMap(["allowadd", "add.addform", "add.addlabel", "add.validationrule"])) {
            value = self.getMapAttribute("allowadd", "value", model);
            if (self.isFalsifiable(value)) {
                self.insertMarkNotShow("add.addform", model);
                self.insertMarkNotShow("add.addlabel", model);
                self.insertMarkNotShow("add.validationrule", model);
            } else {
                self.deleteMarkNotShow("add.addform", model);
                self.deleteMarkNotShow("add.addlabel", model);
                self.deleteMarkNotShow("add.validationrule", model);
            }

            if (!self.isFalsifiable(value)) {
                value = self.getMapAttribute("add.addform", "value", model);
                if (self.isFalsifiable(value)) {
                    self.insertMarkNotShow("add.validationrule", model);
                } else {
                    self.deleteMarkNotShow("add.validationrule", model);
                }
            }
        }

        // edit
        if (self.areThesePropertiesInMap(["allowedit", "edit.editform", "edit.editlabel", "edit.validationrule"])) {
            value = self.getMapAttribute("allowedit", "value", model);
            if (self.isFalsifiable(value)) {
                self.insertMarkNotShow("edit.editlabel", model);
                self.insertMarkNotShow("edit.editform", model);
                self.insertMarkNotShow("edit.validationrule", model);
            } else {
                self.deleteMarkNotShow("edit.editlabel", model);
                self.deleteMarkNotShow("edit.editform", model);
                self.deleteMarkNotShow("edit.validationrule", model);
            }

            if (!self.isFalsifiable(value)) {
                value = self.getMapAttribute("edit.editform", "value", model);
                if (self.isFalsifiable(value)) {
                    self.insertMarkNotShow("edit.validationrule", model);
                } else {
                    self.deleteMarkNotShow("edit.validationrule", model);
                }
            }
        }

    },

    updateText: function (model) {
        var self = this, value;
        if (self.areThesePropertiesInMap(["isextended", "autoextend"])) {
            value = self.getMapAttribute("isextended", "value", model);
            if (self.isFalsifiable(value)) {
                self.hideProperties(["autoextend"], model);
            } else {
                self.showProperties(["autoextend"], model);
            }
        }
    },

    updateActionLauncher: function (model) {
        var self = this, value;
        //allow search and select template
        if (self.areThesePropertiesInMap(["ishorizontal", "allowsearch", "selecttemplate"])) {
            fvalue = self.getMapAttribute("ishorizontal", "value", model);
            if (fvalue){
                self.hideProperties(["allowsearch"], model);
                self.showProperties(["selecttemplate"], model);
            }else{
                self.showProperties(["allowsearch"], model);
                self.hideProperties(["selecttemplate"], model);
            }
        }      
    },

    updateEntityTemplate: function (model) {
        var self = this, value;
        if (self.areThesePropertiesInMap(["allowactions", "xpathmultiple", "filter", "maxitems", "orientation"])) {//
            fvalue = self.getMapAttribute("allowactions", "value", model);
            if (fvalue) {
                self.showProperties(["xpathmultiple"], model);
                self.showProperties(["filter"], model);
                self.showProperties(["maxitems"], model);
                self.showProperties(["orientation"], model);
                self.showProperties(["format"], model);
            } else {
                self.hideProperties(["xpathmultiple"], model);
                self.hideProperties(["filter"], model);
                self.hideProperties(["maxitems"], model);
                self.hideProperties(["orientation"], model);
                self.hideProperties(["format"], model);
            }
        }

        if (self.areThesePropertiesInMap(["allowactions", "xpathmultiple"]))
        {
            if(self.getMapAttribute("allowactions", "value", model) === true){
                self.showProperties(["xpathmultiple"], model);
            }
            else{
                self.hideProperties(["xpathmultiple"], model);
            }
        }
    },


    /*
    */
    resolveGroupProperties: function (model) {
        var self = this;
        
        if (self.areThesePropertiesInMap(["groupby", "showcolumn", "displaytype"])) {
            var value = self.getMapAttribute("groupby", "value", model);
            if (self.isFalsifiable(value)) {
                self.hideProperties(["showcolumn"], model);
                self.hideProperties(["displaytype"], model);
            } 
            else {
                self.showProperties(["showcolumn"], model);
                self.showProperties(["displaytype"], model);
            }
        }
    },

    hideProperties: function (properties, model) {
        var self = this, i = 0, length = properties.length;
        for (; i < length; ) {
            self.insertMarkNotShow(properties[i++], model);
        }
    },

    showProperties: function (properties, model) {
        var self = this, i = 0, length = properties.length;
        for (; i < length; ) {
            self.deleteMarkNotShow(properties[i++], model);
        }
    },

    areThesePropertiesInMap: function (properties) {
        var self = this;
        var map = self.map;
        var result = true;
        var i;
        for (i = 0; i < properties.length; i++) {
            if (map[properties[i]] === undefined) {
                result = false;
                break;
            }
        }
        return result;
    },

    getRenderType: function (model) {
        return model.element.type;
    }
});
