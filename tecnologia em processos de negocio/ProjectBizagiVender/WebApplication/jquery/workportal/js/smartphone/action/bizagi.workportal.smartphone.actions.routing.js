/*
*   Name: BizAgi Workportal routing Action
*   Author: oscaro
*   Comments:
*   -   This script will execute the search action
*/

bizagi.workportal.actions.action.extend("bizagi.workportal.actions.routing", {

}, {
    execute: function(params) {
        var self = this;
        self.project = bizagi.workportal.controllers.instances.main.project;
        self.params = params;

        $.when(self.dataService.getWorkitems({
            idCase: params.params.idCase,
            onlyUserWorkItems: true
        }))
            .done(function(data) {
                switch (data.workItems.length) {
                case 0:
                    //This process is finished 
                    self.showFinishMessage(params.params);
                    break;
                case 1:
                    self.publish("bz-show-render", { idWorkitem: data.workItems[0].idWorkItem, idCase: params.params.idCase });
                    break;
                default:
                    self.renderGateway(params.params);
                    break;
                }
            }).fail(function(msg) {
                self.manageError(msg);
            });
    },

    renderGateway: function(params) {
        // var def = new $.Deferred();
        var self = this;
        var content = self.getContent();

        if (params.showgateway && params.showgateway == false) {
            self.publish("bz-show-render", $.extend(params, { isRenderGateway: false }));
            //  def.resolve(false);
        }

        $.when(self.dataService.getWorkitems({
            idCase: params.idCase,
            onlyUserWorkItems: true
        })).done(function(data) {
            if (data.workItems.length == 0) {
                bizagi.util.smartphone.stopLoading();
                // def.resolve(true);
                return;
            }
            data.checkWorkItems = (data.workItems.length > 1) ? true : false;
            data.checkProcess = (data.subProcesses.length >= 1) ? true : false;
            var workItemsTemplate = bizagi.workportal.controllers.instances.main.workportalFacade.getTemplate("render.routing");
            var workItemsHtml = $.tmpl(workItemsTemplate, data);
            self.publish("popup", { html: workItemsHtml, callbackEvents: self.eventsPopUp, ref: self });
            bizagi.util.smartphone.stopLoading();
            // content.empty();
            //   def.resolve(true);
        });
        //  return def.promise();
    },

    eventsPopUp: function(element, parameters) {
        var self = parameters.ref;
        $("button", element).one("click", function(e) {
            var idWorkitem = e.target.dataset.idworkitem;
            var idCase = e.target.dataset.idcase;
            var idTask = e.target.dataset.idtask;
            var isadynch = e.target.dataset.isasynch;
            if (idCase && (idWorkitem || idTask)) {
                self.publish("bz-show-render", { idCase: idCase, idWorkitem: idWorkitem, idTask: idTask });
            }
            parameters.closepopup();
            $("button", element).off("click");
        });
    },

    showFinishMessage: function(params) {
        var self = this;
        alert(self.resources.getResource("render-without-globalform"));
        //navigate to inbox or back
    },

    publish: function(eventName, params) {
        this._super(eventName, $.extend(params, { project: this.project }));
    },

    manageError: function(params, defer) {
    }
});
