
/*
*   Name: BizAgi FormModeler Editor Render
*   Author: Alexander Mejia
*   Comments:
*   -   This script will define basic stuff for bizagi.editor.base.grid
*/

bizagi.editor.base.render.extend("bizagi.editor.base.grid", {
    relatedEntityType: {
        entityType: undefined
    }
},

// Extend from base element and container behaviour (multiple inheritance)
// special case, the grid has elemets(columns) but is a render
$.extend({}, bizagi.editor.base.containerBehaviour, bizagi.editor.base.containerValidations, {

    init: function (data, elementFactory, regenerateGuid) {
        var self = this;
        var elements = self.elements = [];

        // Call base
        this._super(data, elementFactory, regenerateGuid);

        // Build columns
        if (data) {
            if (data.elements) {
                // Iterate for each element in the object
                $.each(data.elements, function (i, element) {
                    var child = self.elementFactory.createColumnElement(element.type, element, regenerateGuid);
                    child.setParent(self);
                    elements.push(child);
                });
            }
        }
    },

    /*
    *   Returns the JSON needed to render the element 
    */
    getRenderingModel: function () {
        var self = this;
        var defer = $.Deferred();
        var renderingModel = self._super();

        $.when.apply($, $.map(self.elements, function (item) { return item.getRenderingModel(); }))
    	        .done(function () {
    	            var elements = $.makeArray(arguments);
    	            $.when(renderingModel)
        	            .done(function (result) {
        	                result.render.elements = elements;
        	                defer.resolve(result);
        	            });
    	        });

        return defer.promise();

    },

    /*
    *   Get persistence model
    */
    getPersistenceModel: function () {
        var self = this;
        var result = this._super();

        // Build children
        result.elements = [];
        $.each(self.elements, function (i, child) {
            result.elements.push(child.getPersistenceModel());
        });

        return result;
    },

    /*
    * Get grid column model
    */
    getGridColumnModel: function () {
        var self = this;
        var elements;
        var defer = $.Deferred();
        var result = this._super();

        $.when.apply($, $.map(self.elements, function (child) { return child.getGridColumnModel(); }))
            .done(function () {
                elements = arguments;
                $.when(result)
                    .done(function (data) {
                        data.elements = $.makeArray(elements);
                        defer.resolve(data);
                    });
            });

        return defer.promise();
    },

    /*
    * Restores to default displayName
    */
    restoreDefaultDisplayName: function () {
        var self = this;
        self._super();

        $.each(self.elements, function (i, child) {
            child.restoreDefaultDisplayName();
        });
    },

    /*
    * Remove all columns 
    */
    deleteColumns: function () {
        var self = this;

        self.elements = [];
    },

    /*
    * Returns false if the element is an attribute of a parametric entity
    */
    validAttributesAdministrables: function (xpath) {
        var self = this;
        var result = true;

        if (self.isEditable() && self.isParametricAttribute(xpath)) {
           
            var caption = (self.triggerGlobalHandler("getContextEntityType") == "parameter") ?
                            bizagi.localization.getResource("bizagi-editor-form-validation-parameter-attribute-parameter-entity") :
                            bizagi.localization.getResource("bizagi-editor-form-validation-parameter-attribute-entity");
            self.messageValidation = self.messageValidation || "";
            self.messageValidation += caption + "</br>";
            result = false;
        }

        return result;
    },

    validAttributesNoEditables: function () {
        var self = this;
        var defer = new $.Deferred();

        if (self.type == "adhocgrid") {
            defer.resolve(true);
            return defer.promise();
        }

        var xpath = self.resolveProperty('xpath');
        
        if (self.isEditable()) {

            var isSystemEntity = (self.triggerGlobalHandler("getContextEntityType") == "system");            
            var rootNode = self.triggerGlobalHandler("getNodeInfo", {root: true}) || {};

            if (isSystemEntity && rootNode.xpath == "WFUSER") {
                var caption = bizagi.localization.getResource("bizagi-editor-form-validation-attribute-no-administrable");
                self.messageValidation = self.messageValidation || "";
                self.messageValidation += caption + "</br>";

                defer.resolve(false);

            }
            else if(xpath) {
                function getEntityType() {

                    var getEntityTypeProtocol = bizagi.editor.communicationprotocol.factory.createProtocol({
                        protocol: 'getentitytype',
                        entityGuid: bizagi.editor.utilities.resolveRelatedEntityFromXpath(xpath)
                    });

                    return (self.Class.relatedEntityType.entityType != undefined) ? self.Class.relatedEntityType : getEntityTypeProtocol.processRequest();
                }

                $.when(getEntityType())
                    .done(function (data) {

                        self.Class.relatedEntityType.entityType = data.entityType;

                        var isParameter = (data.entityType === 'Parameter' || data.entityType === 'Enum');
                        if (isParameter) {
                            var caption = bizagi.localization.getResource("bizagi-editor-form-validation-attribute-no-editable");
                            self.messageValidation = self.messageValidation || "";
                            self.messageValidation += caption + "</br>";
                        }


                        defer.resolve(!isParameter);
                    });
            }
            else {
                defer.resolve(true);
            }
        } else {
            defer.resolve(true);
        }

        return defer.promise();
    }

})); 