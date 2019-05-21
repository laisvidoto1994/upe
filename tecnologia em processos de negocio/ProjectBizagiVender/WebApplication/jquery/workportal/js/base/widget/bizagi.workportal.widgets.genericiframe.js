/*
*   Name: BizAgi Desktop Queries Dialog implementation
*   Author: Juan Pablo Crossley
*   Comments:
*   -   ???
*/


// Extends itself
bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.genericiframe", {}, {
    /*
    *   Returns the widget name
    */
    getWidgetName: function(){  
        return bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_GENERICIFRAME;
    },

    init: function (workportalFacade, dataService, params) {
        var self = this;

        // Call base
        self._super(workportalFacade, dataService, params);

        //Load templates
        self.loadTemplates({
            "genericiframe": bizagi.getTemplate("bizagi.workportal.desktop.widget.genericiframe"),
            useNewEngine: false
        });
    },

    /*
    *   Renders the content for the current controller
    *   Returns a deferred because it has to load the current user
    */
    renderContent: function () {
        var self = this;
        
        var template = self.getTemplate("genericiframe");
        var data = {
            widgetURL: self.params.widgetURL
        };
        var content = self.content = $.tmpl(template, data);
        
        // Return content
        return content;
    }
});
