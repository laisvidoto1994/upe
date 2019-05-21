/*
*   Name: BizAgi Workportal Integration old render within new look and feel
*   Author: Edward Morales
*   Comments:
*   -   This script define base controller to integrate old render within new workportal
*/

bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.oldrenderintegration", {}, {

    /*
    *   Returns the widget name
    */
    getWidgetName: function(){
	return bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_OLDRENDERINTEGRATION;
    },

    /*
    *   Renders the content for the current controller
    *   Returns a deferred because it has to load the current user
    */
    renderContent: function () {
	var self = this;
	var template = self.getTemplate("integration-old-render");

	var data = {};
	data.url = self.params.url || "App/ListaDetalle/Detalle.aspx?PostBack=1&idCase="+ self.params.idCase +"&idWorkitem="+ self.params.idWorkitem +"&idTask="+self.params.idTask;

	// Render content
	var content = self.content = $.tmpl(template,data);

	// Set inbox view variable
	bizagi.workportal.currentInboxView = self.getWidgetName();

	return content;
    }
});
