/**
* admin/ User Licenses
* 
* @author Liliana Fernandez Murcia
*/


bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.admin.user.licenses", {}, {
    /*
    *   Returns the widget name
    */
    getWidgetName: function () {
        return bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_ADMIN_USER_LICENSES;
    },
    /*
    *   Renders the content for the current controller
    */
    renderContent: function () {
        var self = this;
        var template = self.getTemplate("user.licenses");
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