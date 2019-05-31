/*
*   Name: BizAgi Generic Page Widget Implementation
*   Author: Diego Parra
*   Comments:
*/


// Extends itself
bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.page", {}, {
    /*
    *   Returns the widget name
    */
    getWidgetName: function () {
        return bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_PAGE;
    },

    init: function (workportalFacade, dataService, params) {
        var self = this;

        // Call base
        self._super(workportalFacade, dataService, params);

        //Load templates
        self.loadTemplates({
            "page": bizagi.getTemplate("bizagi.workportal.desktop.widget.page").concat("#ui-bizagi-workportal-widget-page"),
            useNewEngine: false
        });
    },

    /*
    *   Renders the content for the current controller
    *   Returns a deferred because it has to load the current user
    */
    renderContent: function () {
        var self = this;

        var template = self.getTemplate("page");
        var content = self.content = $.tmpl(template, {});

        self.renderStaticForm(self.params);

        // Return content
        return content;
    },

    renderStaticForm: function (params) {
        var self = this;
        var canvas = self.getComponentContainer("render");
        var rendering = new bizagi.rendering.facade(params.context);

        // Executes rendering into render container
        params = params || {};
    	$.extend(params, {
    	    canvas: canvas 
    	    });
        
        rendering.execute(params);

        canvas.bind("close", function () {
            self.publish("closeCurrentDialog");            
        });
    }
});
