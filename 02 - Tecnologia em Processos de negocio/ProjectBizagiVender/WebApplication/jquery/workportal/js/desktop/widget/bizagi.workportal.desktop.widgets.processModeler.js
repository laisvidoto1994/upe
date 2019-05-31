/**
 * Name: BizAgi Desktop Widget Process Modeler View
 *
 * @author Diego Armando Monroy Barrera
 */


bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.processmodeler", {}, {
    init: function (workportalFacade, dataService, params) {
        var self = this;
        // Call base
        self._super(workportalFacade, dataService, params);

        //Load templates
        self.loadTemplates({
            "processModelerWrapper": bizagi.getTemplate("bizagi.workportal.desktop.widgets.processModeler").concat("#ui-bizagi-workportal-widget-processmodelerview-wrapper"),
            useNewEngine: false
        });
    },

    renderContent: function () {
        var self = this;
        var template = self.getTemplate("processModelerWrapper");
        self.content = $.tmpl(template, {});
        return self.content;
    },

    postRender: function () {
        var self = this;
        self.$processModelerCanvas = $("#canvas", self.content);
        self.modeler = new bizagi.bpmn.modeler.viewer();
        self.modeler.render( self.$processModelerCanvas );
    }
});