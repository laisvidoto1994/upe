
/*
*   Name: BizAgi FormModeler Editor Base Collection Navigator
*   Author: Alexander Mejia
*   Comments:
*   -   This script will define basic stuff for bizagi.editor.base.collectionnavigator
*/

bizagi.editor.base.render.extend("bizagi.editor.base.collectionnavigator", {}, {

    /*
    *   Constructor
    */
    init: function (data, elementFactory, regenerateGuid) {
        var self = this;

        self.validateData(data);

        // Call base
        self._super(data, elementFactory, regenerateGuid);

        // Set up the variables       
        self.elementFactory = elementFactory;
        self.form = null;
        self.defer = new $.Deferred();

        // Load navigation form
        if (self.properties.navigationform) { self.loadForm(); }
    },

    /*
    *   Load nested form elements from the host
    */
    loadForm: function () {
        var self = this,
            loadFormProtocol;

        // Create protocol
        loadFormProtocol = bizagi.editor.communicationprotocol.factory.createProtocol({
            protocol: "loadform",
            form: self.properties.navigationform
        });

        // Execute protocol
        $.when(loadFormProtocol.processRequest())
        .done(function (data) {

            self.form = self.elementFactory.createElement("form", data);
            self.form.subscribe("getDefaultDisplayName", function (ev, args) { return self.triggerGlobalHandler("getDefaultDisplayName", args); });
            self.defer.resolve();
        });
    },

    /*
    * render the navigation form
    */
    refreshControl: function (args) {
        var self = this;
        var canvas = args.canvas;

        $.when(self.form.getRenderingModel()).
            done(function (renderingModel) {
                self.addRenderingModelProperties(renderingModel);
                var facade = self.getRenderingFacade();
                $.when(facade.execute({
                    mode: "design",
                    canvas: canvas,
                    data: renderingModel
                }))
                    .done(function () {                        
                        self.triggerGlobalHandler("resizeHeigthCanvas");
                    });
            });

    },

    /*
    *   Returns the JSON needed to render the element 
    */
    getRenderingModel: function () {
        var self = this;
        var defer = $.Deferred();

        $.when(this._super())
            .done(function (result) {
                result.render.properties.navigationform = self.properties.navigationform;
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
    * Returns an instance of rendering facade 
    */
    getRenderingFacade: function () {
        var self = this;

        self.rendering = self.rendering || new bizagi.rendering.facade();
        return self.rendering;
    },

    /*
    * Adds properties to rendering model
    */
    addRenderingModelProperties: function (renderingModel) {
        var form = renderingModel.form;
        var properties = form.properties;

        // Add isNavigatorProperty
        properties.isNavigationForm = true;

        return renderingModel;
    },

    /*
    * This control can have children elements.. these are processed in execution time
    * for this reason the attribute elements in MDBAS is null.
    * if in data exists the attribute elements (converTo Action) this doesn't apply
    */
    validateData: function (data) {
        if (data.elements)
            delete data.elements;
    }

}) 