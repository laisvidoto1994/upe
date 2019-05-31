/*
*   Name: BizAgi Workportal Folder Widget Controller
*   Author: Edward Morales
*   Comments:
*   -   This script will define a base class to to define the folders widget
*/

bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.folders", {}, {
    /*
    *   Returns the widget name
    */
    getWidgetName: function(){  
        return bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_FOLDERS;
    },
    
    init: function (workportalFacade, dataService, params) {
        var self = this;

        // Call base
        self._super(workportalFacade, dataService, params);

        //Load templates
        self.loadTemplates({
            "folders": bizagi.getTemplate("bizagi.workportal.desktop.widget.folders").concat("#ui-bizagi-workportal-widget-folders"),
            "folders-elements": bizagi.getTemplate("bizagi.workportal.desktop.widget.folders").concat("#ui-bizagi-workportal-widget-folders-elements"),
            "folders-empty-elements": bizagi.getTemplate("bizagi.workportal.desktop.widget.folders").concat("#ui-bizagi-workportal-widget-folders-empty-elements"),
            "folders-query-tree": bizagi.getTemplate("bizagi.workportal.desktop.widget.folders").concat("#ui-bizagi-workportal-widget-folders-query-tree"),
            "folders-query-confirm": bizagi.getTemplate("bizagi.workportal.desktop.widget.folders").concat("#ui-bizagi-workportal-widget-folders-confirm"),
            "folders-default": bizagi.getTemplate("bizagi.workportal.desktop.widget.folders").concat("#ui-bizagi-workportal-widget-folders-default"),
            "folders-input-new": bizagi.getTemplate("bizagi.workportal.desktop.widget.folders").concat("#ui-bizagi-workportal-widget-folders-input-new"),
            "folders-add-case": bizagi.getTemplate("bizagi.workportal.desktop.widget.folders").concat("#ui-bizagi-workportal-widget-folders-add-case"),
            "folders-elements-node": bizagi.getTemplate("bizagi.workportal.desktop.widget.folders").concat("#ui-bizagi-workportal-widget-folders-element-node"),
            "folders-query-edit": bizagi.getTemplate("bizagi.workportal.desktop.widget.folders").concat("#ui-bizagi-workportal-widget-folders-edit"),
            useNewEngine: false
        });
    },

    /*
    *   Renders the content for the current controller
    *   Returns a deferred because it has to load the current user
    */
    renderContent: function () {
        var self = this;
        var template = self.getTemplate("folders");
        var content = self.content = $.tmpl(template);
        
        return content;
    }
});
