/**
 * Admin / processes
 * 
 * @author Christian Collazos
 */


bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.admin.processes", {}, {
    /*
    *   Returns the widget name
    */
    getWidgetName: function () {
        return bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_ADMIN_PROCESSES;
    },
    
    
    /*
    *   Renders the content for the current controller
    */
    renderContent: function () {
        var self = this,
            template = self.getTemplate("admin.processes.wrapper"),
            content;

        self.comboProcess = self.getTemplate("admin.processes.combo.process");
        self.processEditTmpl = self.getTemplate("admin.processes.proc.edit");
        self.taskEditTmpl = self.getTemplate("admin.processes.task.edit");
        
        content = self.content = $.tmpl(template, {});
        self.loadtemplates();
        return content;
    },
    
    /*
    * this will be implemented on each device
    */
    loadtemplates: function () { }


});