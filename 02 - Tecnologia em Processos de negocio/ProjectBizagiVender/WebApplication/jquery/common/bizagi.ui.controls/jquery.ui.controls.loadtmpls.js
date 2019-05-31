$.Class.extend("bizagi.ui.controls.tmplloader", {}, {

    init: function () {
        this.templates = [];
    },

    loadTemplates: function (tmpls) {

        var self = this;
        var templatesMap = tmpls || {};

        var defer = new $.Deferred();
        var arrPromises = [];

        $.each(templatesMap, function (key, template) {
            var promise = self.loadTemplate(key, template);
            arrPromises.push(promise);
        });

        $.when.apply($, arrPromises)
                .done(function () {
                    defer.resolve();
                });

        return defer.promise();
    },

    loadTemplate: function (name, path) {

        var self = this;
        var templates = self.templates;
        var defer = new $.Deferred();

        if (templates[name]) {
            defer.resolve();
        } else {
            return bizagi.templateService.getTemplate(path)
                    .done(function (tmpl) {
                        templates[name] = tmpl;
                    });
        }
        return defer.promise();
    },

    getTemplate: function (name) {

        var self = this;
        var templates = self.templates;

        if (templates[name]) {
            return templates[name];
        } else {
            return null;
        }
    }
});
