/**
 * This module manage graphical diagram of process diagram
 *
 * @author Andrés Fernando Muñoz
 */
bizagi.workportal.widgets.graphicquery.extend("bizagi.workportal.widgets.project.processDiagram.helper", {}, {
	/**
	 * Set Height for process viewer
	 * @Overriden
	 */
	getPVHeight: function () {
		var self = this;
		var defaultHeight = $(window).height() - 50;
		var canvasPst = self.$header.height() + 180;
		var cntHeight = $(".ui-bizagi-wp-project-tab-content").height();
		var cntHeight = cntHeight || defaultHeight;
		return cntHeight - canvasPst;
	}
});
