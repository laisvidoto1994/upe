/*
 * @title : Base controller class
 * @author : Diego Parra
 * @date   : 08/08/2012
 * Comments:
 *     Defines a base class for all components
 *
 */

$.Controller("bizagi.editor.component.controller", {

    /*
    *   Constructor
    */
    init: function () {
        this.observableElement = $({});
        this.tmpl = {};
    },

    /*
    *   Allows consumers to subscribe from a component event
    */
    subscribe: function () {
        this.observableElement.bind.apply(this.observableElement, arguments);
    },

    /*
    *   Allows consumers to unsubscribe from acomponent event
    */
    unsubscribe: function () {
        this.observableElement.unbind.apply(this.observableElement, arguments);
    },

    /*
    *   Allows the component to publish events to consumers
    */
    publish: function () {
        this.observableElement.triggerHandler.apply(this.observableElement, arguments);
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
    }
});

