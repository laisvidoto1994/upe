/*
*   Name: BizAgi Workportal Smart Folder Widget Controller
*   Author: Edward Morales
*   Comments:
*   -   This script will define a base class to to define the smart folders widget
*/

bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.smartfolders", {}, {
    /*
    *   Returns the widget name
    */
    getWidgetName: function () {
        return bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_FOLDERS;
    },

    init: function (workportalFacade, dataService, params) {
        var self = this;

        // Call base
        self._super(workportalFacade, dataService, params);

        //Load templates
        self.loadTemplates({
            "smartfolders": bizagi.getTemplate("bizagi.workportal.desktop.widget.smartfolders").concat("#ui-bizagi-workportal-widget-smartfolders"),
            "smartfolders-elements": bizagi.getTemplate("bizagi.workportal.desktop.widget.smartfolders").concat("#ui-bizagi-workportal-widget-smartfolders-elements"),
            "smartfolders-empty-elements": bizagi.getTemplate("bizagi.workportal.desktop.widget.smartfolders").concat("#ui-bizagi-workportal-widget-smartfolders-empty-elements"),
            "smartfolders-query-confirm": bizagi.getTemplate("bizagi.workportal.desktop.widget.smartfolders").concat("#ui-bizagi-workportal-widget-smartfolders-confirm"),
            "smartfolders-default": bizagi.getTemplate("bizagi.workportal.desktop.widget.smartfolders").concat("#ui-bizagi-workportal-widget-smartfolders-default"),
            "smartfolders-add-case": bizagi.getTemplate("bizagi.workportal.desktop.widget.smartfolders").concat("#ui-bizagi-workportal-widget-smartfolders-add-case"),
            "smartfolders-elements-node": bizagi.getTemplate("bizagi.workportal.desktop.widget.smartfolders").concat("#ui-bizagi-workportal-widget-smartfolders-element-node"),
            "smartfolders-query-tree": bizagi.getTemplate("bizagi.workportal.desktop.widget.smartfolders").concat("#ui-bizagi-workportal-widget-smartfolders-query-tree"),
            "smartfolders-query-edit": bizagi.getTemplate("bizagi.workportal.desktop.widget.smartfolders").concat("#ui-bizagi-workportal-widget-smartfolders-edit"),
            "smartfolders-input-new": bizagi.getTemplate("bizagi.workportal.desktop.widget.smartfolders").concat("#ui-bizagi-workportal-widget-smartfolders-input-new"),
            useNewEngine: false
        });
    },

    /*
    *   Renders the content for the current controller
    *   Returns a deferred because it has to load the current user
    */
    renderContent: function () {
        var self = this;
        var template = self.getTemplate("smartfolders");
        var content = self.content = $.tmpl(template);

        return content;
    }
});
