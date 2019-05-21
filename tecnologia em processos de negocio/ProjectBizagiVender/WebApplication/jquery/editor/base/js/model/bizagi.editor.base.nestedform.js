
/*
*   Name: BizAgi FormModeler Editor Base Nested Form
*   Author: Alexander Mejia
*   Comments:
*   -   This script will define basic stuff for bizagi.editor.base.nestedform
*/

bizagi.editor.base.container.extend("bizagi.editor.base.nestedform", {}, {

    /*
    *   Constructor
    */
    init: function (data, elementFactory, regenerateGuid) {
        var self = this;

        // Call base
        self._super(data, elementFactory, regenerateGuid);

        // Set a ready deferred
        self.loadDeferred = new $.Deferred();
        self.elementFactory = elementFactory;

        // set flag, while the nested form is loaded 
        self.loading = true;
        self.message = "loading...";
        

        // Load inner elements
        self.loadNestedFormElements();
    },

    /*
    *   Load nested form elements from the host
    */
    loadNestedFormElements: function () {
        var self = this,
            loadFormProtocol;

        // Create protocol
        loadFormProtocol = bizagi.editor.communicationprotocol.factory.createProtocol({
            protocol: "loadform",
            form: self.properties.form
        });

        // Execute protocol
        $.when(loadFormProtocol.processRequest(), self.getFormDisplayName())
        .done(function (data, formInfo) {
            self.formdisplayName = formInfo.displayName;
            self.processNestedFormElements(data);
        });
    },

    /*
    *   Process nested form information
    */
    processNestedFormElements: function (data) {
        var self = this;

        if (data) {
            if (data.elements) {
                // Iterate for each element in the object
                $.each(data.elements, function (i, element) {
                    var child = self.elementFactory.createElement(element.type, element);
                    child.setParent(self);
                    self.elements.push(child);
                });
            }
        }

        // Resolve load deferred
        self.loadDeferred.resolve();

        // When loading is done trigger refresj
        $.when(self.ready())
        .done(function () {
            self.loading = false;
            $.when(self.getRenderingModel())
                .done(function (result) {
                    setTimeout(function () {
                        $.when(self.triggerGlobalHandler('formIsLoaded', null))
                            .done(function () {
                                self.triggerGlobalHandler("refreshElement", result);
                            });                        
                    }, 100);                    
                });                  
        });
    },

    /*
    *   Returns if the nested form is ready or not
    *   The nested form is ready when the load operationhas been finished
    */
    ready: function () {
        var self = this;
        var childrenReady = self._super();

        // Return ready when all the children are ready and load operation has been finished
        return $.when(childrenReady, self.loadDeferred);
    },

    /*
    *   Returns the JSON needed to render the element 
    */
    getRenderingModel: function () {
        var self = this;
        var defer = $.Deferred();

        $.when(this._super())
            .done(function (result) {
                result.container.properties.loading = self.loading;
                result.container.properties.message = self.message;
                defer.resolve(result);
            });

        return defer.promise();

    },

    /*
    *   Get persistence model
    *   Note: Don't return any children
    */
    getPersistenceModel: function () {
        var self = this,
            persistenceModel;

        persistenceModel = {
            elements: [],
            type: self.type,
            guid: self.guid,
            properties: self.filterDefaultValues(self.properties)
        };

        return persistenceModel;
    },


    /*
    *   Returns the JSON needed to render the element 
    */
    getRenderingProperties: function () {
        var self = this;
        var properties = self._super();

        if (!self.formdisplayName) {
            $.when(self.getFormDisplayName()).
                done(function (data) {
                    data = data || {};
                    self.formdisplayName = data.displayName;
                    properties.formDisplayName = data.displayName;
                });
        }


        properties.formDisplayName = self.formdisplayName;

        return properties;
    },

    /*
    * Returns the form displayName if it doesn't exist
    */
    getFormDisplayName: function () {
        var self = this;
        var properties = self.properties;
        var deferred = new $.Deferred();

        var displayNameProtocol = bizagi.editor.communicationprotocol.factory.createProtocol({
            protocol: "getformdisplayname",
            guid: bizagi.editor.utilities.resolveComplexReference(properties.form)
        });

        $.when(displayNameProtocol.processRequest()).
            done(function (data) {
                deferred.resolve(data);
            });

        return deferred.promise();
    },


    /*
    * Return displayName 
    */
    resolveDisplayNameProperty: function () {
        var self = this;
        return "Nested form : " + self.formdisplayName;
    },

    /*
    *
    */
    validAttributesAdministrables: function () {
        var self = this;
        var result = true;        

        if (self.isEditable()) {
            var xpath = bizagi.editor.utilities.resolveComplexXpath(self.properties["xpath"]) + ".";
            for (var i = 0, l = self.elements.length; i < l; i++) {
                result = result & self.elements[i].validAttributesAdministrables(xpath);
            }
        }

        return result;
    }
}) 