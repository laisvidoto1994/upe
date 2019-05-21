bizagi.workportal.services.loadtemplates = (function () {
    var self = this;

    // Define an object to hold the templates used in the widget
    self.tmpl = {};
    
    /*
    * Loads dinamically a set of templates
    */
    self.loadTemplates = function (templates) {
        var def = self.templatesDeferred = new $.Deferred(),
            tmplPromises = [];

        var useNewEngine = (templates.useNewEngine != undefined) ?  templates.useNewEngine : true;

        for (var name in templates) {
            if (name != "useNewEngine") {
                tmplPromises.push(
                    self.loadTemplate({
                        "name" : name,
                        "path" : templates[name],
                        "useNewEngine" :useNewEngine
                    })
                );
            }
        }

        $.when.apply($, tmplPromises)
            .done(function () {
                def.resolve();
            });

        return def.promise();
    };


    /*
    * Loads template 
    */
    self.loadTemplate =  function (data) {
        if (self.tmpl[data.name]) {
            return self.tmpl[data.name];
        } else {
            if (data.useNewEngine){
                return bizagi.templateService.getTemplateWidget(data.path)
                    .done(function (tmpl) {
                        self.tmpl[data.name] = tmpl;
                    });
            }

            return bizagi.templateService.getTemplate(data.path)
                .done(function (tmpl) {
                    self.tmpl[data.name] = tmpl;
                });

        }
    };

    /*
    * Gets template 
    */
    self.getTemplate = function (name) {
        if (self.tmpl.hasOwnProperty(name)) {
            return self.tmpl[name];
        }
        return null;

    }
    
    return {
        loadTemplates: self.loadTemplates,
        getTemplate: self.getTemplate
    }

});

bizagi.injector.register('loadTemplatesService', [bizagi.workportal.services.loadtemplates]);