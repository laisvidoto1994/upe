/*
 *   Name: BizAgi Workportal Release Widget Controller
 *   Author: Luis Cabarique LuisCE
 *   Comments:
 *   -   This script will define a base class to to define the release widget
 */

// Auto extend
bizagi.workportal.widgets.release.extend("bizagi.workportal.widgets.release", {}, {

    init: function (workportalFacade, dataService, params) {
        // Call base
        this._super(workportalFacade, dataService, params);
    },
    /*
     *   To be overriden in each device to apply layouts
     */
    postRender: function () {
        var self = this;
        self.content = self.getContent();

        $(document).unbind("attachEventElementToForm").bind("attachEventElementToForm", function (e, idWorkitem) {
            if ($(".ui-bizagi-workportal-workarea .ui-bizagi-container-children-form:first > div:last-child").length > 0) {
                $(".ui-bizagi-workportal-workarea .ui-bizagi-container-children-form:first > div:last-child").after(self.content);
            } else {
                $(".ui-bizagi-workportal-workarea .ui-bizagi-container-children-form:first").after(self.content);
            }
            self.actionRelease();
        });
    },

    actionRelease: function(){
        var self = this;
        $(self.content).click(function (e) {
            var buttons = [{ 'label': self.getResource("workportal-widget-dialog-box-release-ok"), 'action': 'resolve' }, { 'label': self.getResource("workportal-widget-dialog-box-release-cancel")}];
            $.when(bizagi.showConfirmationBox(self.getResource("workportal-widget-dialog-box-release"), self.getResource("render-actions-release"), '', buttons)).done(function () {
                bizagi.util.smartphone.startLoading();
                $.when(self.dataService.releaseActivity({
                    idCase: self.params.options.idCase,
                    idWorkItem: self.params.options.idWorkitem
                })).done(function (data) {
                    var status = (data && data.status) ? data.status : 'Error';
                    switch (status) {
                        case "Success":
                            self.publish("changeWidget", {
                                widgetName: bizagi.workportal.currentInboxView
                            });
                            break;
                        case "ConfigurationError":
                            bizagi.showMessageBox(self.getResource("workportal-widget-dialog-box-release-configuration-error-message").replace("{0}", self.params.options.idWorkitem), self.getResource("workportal-widget-dialog-box-release-error"), 'error', false);
                            break;
                        case "Error":
                        default:
                            bizagi.showMessageBox(self.getResource("workportal-widget-dialog-box-release-error-message").replace("{0}", self.params.options.idWorkitem), self.getResource("workportal-widget-dialog-box-release-error"), 'error', false);
                            break;
                    }
                    bizagi.util.smartphone.stopLoading();
                }).fail(function () {
                    var message = self.getResource("workportal-widget-dialog-box-release-error-message").replace("{0}", self.params.options.idWorkitem);
                    bizagi.showMessageBox(message, self.getResource("workportal-widget-dialog-box-release-error"), 'error', false);
                    bizagi.util.smartphone.stopLoading();
                });
            });
        });
    }
});
