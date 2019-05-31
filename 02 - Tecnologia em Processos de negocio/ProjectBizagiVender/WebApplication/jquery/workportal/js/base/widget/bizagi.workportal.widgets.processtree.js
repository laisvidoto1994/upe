/**
 * Application / Categories and Process tree
 * 
 * @author Christian Collazos
 */


bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.processtree", {}, {
    
    /*
    *   Returns the widget name
    */
    getWidgetName: function () {
        return bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_PROCESS_TREE;
    },
    
    /*
    *   Renders the content for the current controller
    */
    renderContent: function () {
        var self = this;
        var template = self.getTemplate("processTree.links");
        var content;

        content = self.content = $.tmpl(template, {});

        return content;
    },

    /*
    * childs will implement this method
    */
    loadtemplates: function () { }
});