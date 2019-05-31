/**
 *
 * Created by RicardoPD on 2/1/2017.
 */

$.Class.extend("bizagi.login.factory", {}, {
    /*
     *   Constructor
     */
    init: function () {
        this.templates = [];
    },

    /*
     *   Load all the templates used in the workportal
     */
    loadTemplates: function () {
    },
    /*
     *   Load one template and save it internally
     */
    loadTemplate: function (template, templateDestination) {
        var self = this;
        // Go fetch the template
        return bizagi.templateService.getTemplate(templateDestination)
            .done(function (resolvedTemplate) {
                self.templates[template] = resolvedTemplate;
            });
    },

    /*
     *   Method to fetch templates from a private dictionary
     */
    getTemplate: function (template) {
        return this.templates[template];
    }
});
