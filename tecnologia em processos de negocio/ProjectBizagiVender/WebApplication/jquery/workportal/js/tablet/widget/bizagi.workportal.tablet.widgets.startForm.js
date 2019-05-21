/*
 *   Name: BizAgi Workportal Tablet Render Widget Controller
 *   Author: Ricardo Pérez
 *   Comments: Provide tablet overrides to implement the StartForm widget
 */

// Auto extend
bizagi.workportal.widgets.render.extend('bizagi.workportal.widgets.render', {}, {
    /*
     *   Renders the form component of the widget
     */
    renderForm: function (params) {
        var self = this, resultRender;

        if (!params.withOutGlobalForm) {
            return self._super(params);
        } else {
            var errorTemplate = self.workportalFacade.getTemplate("info-message");
            var message = (params.messageForm !== "") ? params.messageForm : self.resources.getResource("render-without-globalform");

            if (typeof self.params != "undefined" && typeof self.params.isOfflineForm !== "undefined" && self.params.isOfflineForm == true) {
                message = self.resources.getResource("render-without-globalform-offline");
            }
            var errorHtml = $.tmpl(errorTemplate, {
                message: message
            });
            errorHtml.appendTo(self.getComponentContainer("render"));
            $(".ui-bizagi-info-message-button", errorHtml).click(function () {
                self.publish("changeWidget", {
                    widgetName: bizagi.workportal.currentInboxView,
                    inputtray: bizagi.util.getItemLocalStorage("inputtray")
                });
                self.publish("toggleProcessesColumn", {
                    show: true
                });
            });

            resultRender = $.Deferred();
            resultRender.fail();
        }

        self.resizeLayout();

        return resultRender;
    },

    /*  RENDER CONTENT OVERRIDE
     ==================================================*/
    renderContent: function () {
        var self = this;

        var result = self._super();
        return result;
    },




    /* POST RENDER ACTIONS
     =================================================*/
    postRender: function () {

        var self = this;

        var result = self._super();
        return result;
    }
});
