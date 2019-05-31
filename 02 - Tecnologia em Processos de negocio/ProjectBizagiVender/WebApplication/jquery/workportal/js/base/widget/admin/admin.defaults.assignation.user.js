/**
* admin/ Defaults Assignation User
* 
* @author Liliana Fernandez Murcia
*/


bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.admin.defaults.assignation.user", {}, {
    /*
    *   Returns the widget name
    */
    getWidgetName: function () {
        return bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_ADMIN_DEFAULTS_ASSIGNATION_USER;
    },
    /*
    *   Renders the content for the current controller
    */
    renderContent: function () {
        var self = this;
        var template = self.getTemplate("defaults.assignation.user");
        var content;

        content = self.content = $.tmpl(template, {});
        self.loadtemplates();
        return content;
    },

    /*
    * this will be implemented on each device
    */
    loadtemplates: function () { }


});