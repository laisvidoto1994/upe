/*
 *   Name: Start Form Widget Controller
 *   Author: Fabian Moreno (based on Diego Parra version)
 *   Comments:
 *   -   This script will provide start form widget
 */

// Auto extend
bizagi.workportal.widgets.startForm.extend("bizagi.workportal.widgets.startForm", {}, {
    /*
    *   To be overriden in each device to apply layouts
    */

    postRender: function () {
        var self = this;
        var content = self.getContent();

        self.params.referrerParams = self.params.referrerParams || {};

        $("#ui-bizagi-wp-app-render-form-content", content).css("padding-left", "0px");
        $('.renderNavigation .back,.renderNavigation .next', content).hide();
    },
});

