/**
 * Admin / Cases Search
 * 
 * @author Christian Collazos
 */


bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.admin.caseSearch", {}, {
    /*
    *   Returns the widget name
    */
    getWidgetName: function () {
        return bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_ADMIN_CASE_SEARCH;
    },

    /*
    *   Renders the content for the current controller
    */
    renderContent: function () {
        var self = this;
        var template = self.getTemplate("admin.case.search");
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