/*
*   @title : Search List Combo Wizard
* @author : Paola Herrera
* Comments:
*     Define the search list combo wizard
*/

bizagi.editor.wizard.base("bizagi.editor.wizard.searchlist", {

    /*
    *   Constructor
    */
    init: function (canvas, params) {
        params = params || {};

        // Call super
        this._super(canvas, params);

        // Set up the variables
        this.canvas = canvas;
        this.presenter = params.presenter;
        this.model = new bizagi.editor.wizard.searchlist.model(params.model, params.gridContextXpath);
    },

    /*
    *   Load all needed templates
    */
    loadTemplates: function () {
        // Define mapping
        var templateMap = {
            "wizard-container": (bizagi.getTemplate("bizagi.editor.wizard.searchlist") + "#wizard-container-searchlist")
        };

        // Fetch templates
        return this._super(templateMap);
    },

    /*
    *   Renders the wizard
    */
    renderWizard: function () {
        var self = this;
        var element = self.element;

        // Clear everything
        element.empty();

        // Wait for templates
        $.when(self.loadTemplates()).done(function () {

            //Render
            var content = self.getTemplate("wizard-container");
            $.tmpl(content, self.model.getViewModel()).appendTo(element);

        });
    },


    /*
    *   Refresh the wizard
    */
    refresh: function () {
        var self = this;

        self.render();
    },

    /*
    * This method updates the property in the model
    */
    updateProperty: function (value, displayValue, property) {
        return this.model.updateProperty(value, displayValue, property);
    },

    /*
    * This method returns the type of xpath to filter 
    */
    getFilterProperty: function (property) {
        return this.model.getFilter(property);
    },

    /*
    * This method returns the valid xpath types 
    */
    getFilterTypes: function (property) {
        return this.model.getFilterTypes(property);
    },

    /*
    *
    */
    getRelatedEntity: function (property) {
        return this.model.getRelatedEntity(property);
    },


    /*
    *
    */
    getPropertyValue: function (property) {
        return this.model.getPropertyValue(property);
    },
    /*
    *   Process finish button
    */
    processFinishButton: function () {
        var self = this;

        if (!self.model.isValid()) {
            bizagi.showMessageBox(bizagi.localization.getResource("bizagi-editor-wizard-searchlist-invalidmodel"), "Bizagi", "error", false);
            return;
        }

        $.when(self.relationshipIsValid())
            .done(function (data) {
                if (data.isValid) {
                    //self.presenter.publish("changelabel", { guid: self.model.elementGuid, value: data.leftfactname });
                    self.presenter.closePopup({ success: true, model: self.model.getPersistenceModel(data) });
                } else {
                    bizagi.showMessageBox(bizagi.localization.getResource("bizagi-editor-wizard-searchlist-invalidrelationship"), "Bizagi", "error", false);
                    return;
                }

            });
    },

    /*************************************************************************************************** 
    *   HELPER METHODS
    *****************************************************************************************************/

    /*
    * This method gets the current position of element
    */
    getOffsetElement: function (element) {
        var offset = element.offset();

        return {
            top: offset.top + element.outerHeight(true),
            left: offset.left
        };
    },

    /*
    * This method builds a complex xpath
    */
    buildComplexXpath: function (xpathData) {
        return bizagi.editor.utilities.buildComplexXpath(xpathData.xpath, xpathData.contextScope, xpathData.isScopeAttribute, xpathData.guidRelatedEntity);
    },

    /*
    *
    */
    resolveComplexXpath: function (xpath) {
        return bizagi.editor.utilities.resolveComplexXpath(xpath);
    },

    /*
     * Clear property value
     */
    clearPropertyValue: function (element) {
        var self = this;

        var xpathProperty = element.data("property");

        self.updateProperty(undefined, "", xpathProperty);
        self.refresh();
    },

    /*
    *
    */
    getMultipleRelationship: function (params) {
        var self = this;
        var defer = new $.Deferred();


        $.when(self.presenter.publish("getMultipleRelationship", params))
            .done(function (data) {
                defer.resolve();
            });


        return defer.promise();
    },

    /*
    * This method returns true if the entities (left ans rigth) have a multiple-multiple relationship
    */
    relationshipIsValid: function () {
        var self = this;
        var defer = new $.Deferred();
        var leftRelatedEntity = bizagi.editor.utilities.resolveRelatedEntityFromXpath(self.getPropertyValue("leftxpath"));
        var rightRelatedEntity = bizagi.editor.utilities.resolveRelatedEntityFromXpath(self.getPropertyValue("rightxpath"));

        $.when(self.presenter.publish("getMultipleRelationship", {
            leftEntity: self.getPropertyValue("leftxpath"),
            rightEntity: self.getPropertyValue("rightxpath")
        }))
            .done(function (data) {
                if (!data) {
                    defer.resolve(false);
                } else {
                    var leftfacts = data.leftfact;
                   
                    for (var i = 0, l = leftfacts.length; i < l; i++) {
                        var leftfact = leftfacts[i];
                        if ((leftfact.RightEntity.Guid == rightRelatedEntity)) {
                            defer.resolve({
                                isValid: true,
                                factxpath: leftfact.Name,
                                leftfactname: leftfact.Name
                            });
                            break;
                        }
                    }
                }

                defer.resolve(false);
            });

        return defer.promise();


    },

    /*************************************************************************************************** 
    *   EVENT HANDLERS
    *****************************************************************************************************/

    //xpath editor handler
    ".bizagi_editor_component_editor_xpath .bz-wizard-searchlist-editor-xpath click": function (element) {
        var self = this;
        var xpathElement = element.prev("input");
        var xpathProperty = element.data("property");
        var params = {};

        params.position = self.getOffsetElement(xpathElement, params);        
        var filter = undefined;
        if (self.getFilterProperty(xpathProperty)) {
            filter = {};
            filter.typeFilter = self.getFilterProperty(xpathProperty);
            params.typeEditor = filter.typeFilter;
            if (self.getFilterTypes(xpathProperty)) {
                filter.types = self.getFilterTypes(xpathProperty);
            }

        }
        params.filter = filter;
        params.entity = self.resolveComplexXpath(self.getRelatedEntity(xpathProperty));
        params.xpath = self.resolveComplexXpath(self.getPropertyValue(xpathProperty));
        params.xpathProperty = xpathProperty;
        params.allowCollection = true;

        $.when(self.presenter.publish("showXPathNavigatorEditor", params))
            .done(function (xpathData) {
                var value = self.buildComplexXpath(xpathData);
                self.updateProperty(value, self.resolveComplexXpath(value), xpathProperty);
                self.refresh();
            });
    },

    /*
    * Filter editor handler
    */
    ".filter-searchList-mainDiv-value click": function (element) {
        var self = this;

        var xpathProperty = element.data("property");
        var propertyValue = self.getPropertyValue(xpathProperty);
        var params = {};

        params.data = (propertyValue && propertyValue.bafilter) ? propertyValue : { bafilter: { filter: "filter"} };
        params.entity = self.resolveComplexXpath(self.getRelatedEntity(xpathProperty));
        params.xpathNode = self.presenter.publish("getXpathData", { xpath: params.entity });
        params.protocol = "loadfilter";

        var filterProtocol = bizagi.editor.communicationprotocol.factory.createProtocol(params);
        $.when(filterProtocol.processRequest())
            .done(function (result) {
                if (result) {
                    var value = (result.isEmpty) ? undefined : bizagi.editor.utilities.buildComplexFilter(result, params.xpathNode);
                    self.updateProperty(value, result, xpathProperty);
                    self.refresh();
                }
            });
    },

    /*
     * Filter editor handler
     */
    ".filter-searchList-mainDiv-rule click": function (element) {
        var self = this;

        var xpathProperty = element.data("property");
        var propertyValue = self.getPropertyValue(xpathProperty);
        var params = {};

        params.data = (propertyValue && propertyValue.rule) ? propertyValue : { rule: { baref: { ref: "expression"} } };
        params.categorytype = "scripting";
        params.protocol = "ruleexpression";

        var filterProtocol = bizagi.editor.communicationprotocol.factory.createProtocol(params);
        $.when(filterProtocol.processRequest())
            .done(function (result) {
                if (result) {
                    self.updateProperty(result, result.rule.displayName, xpathProperty);
                    self.refresh();
                }
            });
    },

    /*
     * Filter editor handler
     */
    ".filter-searchList-mainDiv-delete click": function (element) {
        var self = this;
        self.clearPropertyValue(element);
    },

    /*
     * Clear display adittional attribute  handler
     */
    ".biz-ico-default click": function (element) {
        var self = this;
        self.clearPropertyValue(element);
    },

    /*
    * Localization editor handler
    */
    ".editor-localizablestring-input input blur": function (element) {
        var self = this;
        var value = element.val();
        var propertyName = element.data("property");
        var propertyValue = self.getPropertyValue(propertyName);

        var localizationIcon = element.next(".editor-localizablestring-localization");
        var inputParent = element.parent();
        localizationIcon.removeClass('ui-control-fadeIn');
        inputParent.toggleClass('ui-control-focus');

        if (value.length > 0) {

            if (bizagi.editor.utilities.isObject(propertyValue)) {
                var language = bizagi.editorLanguage.key;
                if (language === "default") { propertyValue["i18n"]["default"] = value; }
                else { propertyValue["i18n"]["languages"][language] = value; }
                value = propertyValue;
            } else {
                value = bizagi.editor.utilities.buildComplexLocalizable(value, self.model.getElementGuid(), propertyName);
            }
            self.updateProperty(value, bizagi.editor.utilities.resolvei18n(value), propertyName);
            self.refresh();
        }
    },

    /*
    *
    */
    ".editor-localizablestring-input input focus": function (element) {

        var localizationIcon = element.next(".editor-localizablestring-localization");
        var inputParent = element.prev('input[type="text"]').parent();

        localizationIcon.addClass('ui-control-fadeIn');
        inputParent.toggleClass('ui-control-focus');
    },

    /*
    *
    */
    ".editor-localizablestring-input .editor-localizablestring-localization mouseenter": function (element) {
        element.addClass('editor_localizablestring_fadeIn');
    },

    /*
    *
    */
    ".editor-localizablestring-input .editor-localizablestring-localization mouseleave": function (element) {
        element.removeClass('editor_localizablestring_fadeIn');
    },

    /*
    *
    */
    ".editor-localizablestring-localization click": function (element) {
        var self = this;

        var input = element.prev("input");
        var propertyName = input.data("property");
        var propertyValue = self.getPropertyValue(propertyName);
        var elementGuid = self.model.getElementGuid();

        $.when(self.presenter.publish("setLocalization", { propertyName: propertyName, propertyValue: propertyValue, elementGuid: elementGuid }))
            .done(function (value) {
                self.updateProperty(value, bizagi.editor.utilities.resolvei18n(value), propertyName);
                self.refresh();
            });
    }
});

