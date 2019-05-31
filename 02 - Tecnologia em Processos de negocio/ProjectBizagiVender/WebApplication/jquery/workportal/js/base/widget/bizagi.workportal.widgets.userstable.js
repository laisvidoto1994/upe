/**
* get users table
* 
* @author Christian Collazos
*/


bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.userstable", {}, {

    /*
    *   Returns the widget name
    */
    getWidgetName: function () {
        return bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_USERS_TABLE;
    },

    /*
    *   Renders the content for the current controller
    */
    renderContent: function () {
        var self = this;
        var template = self.getTemplate("usersTable.wrapper");
        var content;

        content = self.content = $.tmpl(template, {});

        return content;
    },

    /*
    * childs will implement this method
    */
    loadtemplates: function () { }
});