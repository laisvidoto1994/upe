/*
 * @title : Base controller class
 * @author : Diego Parra
 * @date   : 03/09/2013
 * Comments:
 *     Defines a base class for all report components
 *
 */

bizagi.reporting.observer.extend("bizagi.reporting.component.controller", {
    /*
    *   Constructor
    */
    init: function (canvas) {

        var self = this;

        // call base
        self._super();

        self.properties = {};
        self.tmpl = {};
        self.pstDeferred = $.Deferred();
        self.canvas = canvas;

        // set device
        self.device = bizagi.util.detectDevice();

        // Set l10n service 
        self.resources = bizagi.localization;

    },

    /*
    *   Helper to load templates
    */
    loadTemplate: function (name, path) {
        var self = this;
        var defer = new $.Deferred();
        if (self.tmpl[name]) {
            defer.resolve();
        } else {
            return bizagi.templateService.getTemplate(path)
                .done(function (tmpl) {
                    self.tmpl[name] = tmpl;
                });
        }
        return defer.promise();
    },

    /*
    *   Helper to dinamically load a map of templates
    */
    loadTemplates: function (templateMap) {
        var self = this;
        var defer = new $.Deferred();
        var arrPromises = [];
        $.each(templateMap, function (key, template) {
            var promise = self.loadTemplate(key, template);
            arrPromises.push(promise);
        });

        $.when.apply($, arrPromises)
            .done(function () {
                defer.resolve();
            });

        return defer.promise();
    },

    /*
    *   Helper to return a loaded template
    */
    getTemplate: function (name) {
        if (this.tmpl[name]) {
            return this.tmpl[name];
        } else {
            return null;
        }
    },

    /*
    *   Renders the templates and execute internal render
    */
    render: function (params) {

        var self = this;
        var deferred = $.Deferred();
        params = params || {};

        // Check options
        self.options = $.extend(self.options, params.options);

        $.when(self.internalRender()).done(function (content) {

            self.content = content;

            // Clear container
            self.canvas.empty();
            self.canvas.append(self.content);

            //Execute post render
            self.postRender(content);
        });

        return deferred;

    },

    /*
    * Internal Render
    */
    internalRender: function () {

        var self = this;

        //Load templates
        return $.when(self.loadTemplates()).pipe(function () {

            //render component and return its content
            return self.renderComponent();

        });

    },

    /*
    *   Templated render component
    */
    renderComponent: function () {
        bizagi.mustImplement("renderComponent");
    },

    /* 
    *   Returns the mapped resource 
    */
    getResource: function (key) {
        return this.resources.getResource(key);
    },

    /*
    *   Resolve Post Render
    */
    resolvePostRender: function () {

        //resolve post render deferred
        this.pstDeferred.resolve();
    }
});

