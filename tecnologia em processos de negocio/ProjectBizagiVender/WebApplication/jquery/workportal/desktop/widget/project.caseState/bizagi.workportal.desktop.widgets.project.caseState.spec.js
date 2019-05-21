/**
 * Unit Testing bizagi.workportal.widgets.project.caseState
 *
 * @author Elkin Fernando Siabato Cruz
 */

describe("Widget bizagi.workportal.widgets.project.caseState", function () {
   var widget,
      workportalFacade,
      dataService;

   it("Environment has been defined", function(){
      workportalFacade = bizagi.injector.get("workportalFacade");
      dataService = bizagi.injector.get("dataService");
   });

   it("Render Widget", function (done) {
      var params = {};
      widget = new bizagi.workportal.widgets.project.caseState(workportalFacade, dataService, params);
      widget.contextsSidebarActivity = ["ACTIVITY", "OVERVIEW", "COMMENTS", "FILES", "PROCESSMAP", "LOG", "PLANCREATE"];
      $.when(widget.areTemplatedLoaded()).done(function(){
         $.when(widget.renderContent()).done(function () {
            widget.postRender();
            done();
         });
      });
   });

   describe("Functions:", function () {
      describe("updateView", function () {
         beforeEach(function () {
            spyOn(widget, "showCaseNumber").and.callThrough();
            params = {
               args: {"idCase":6421,"idWorkflow":3,"idWorkitem":11458,"idTask":5,"eventAsTasks":false,"onlyUserWorkItems":"true","formsRenderVersion":2,"referrer":"inboxGrid","isComplex":false,"isOfflineForm":false,"hasWorkItems":true,"hasGlobalForm":"false","widgetName":"projectDashboard","radNumber":"6421","supportNav":true,"contextsWithoutLeftSidebarCaseDashboard":["HOME","TEMPLATEENGINE-VIEW","ENTITY-ENGINE-VIEW","SEARCH-ENGINE-VIEW","CASES-TEMPLATE-VIEW","PLANS-VIEW","REFRESHALL"],"contextsLeftSidebarCaseDashboard":["ACTIVITY","OVERVIEW","COMMENTS","FILES","PROCESSMAP","LOG","PLANCREATE","PLANOVERVIEW","PLANACTIVITIES","PLANFILES","PLANCOMMENTS","PLANSIDEBAR","EDITACTIVITY","ACTIVITYPLAN","ACTIVITYPLANCREATE","ACTIVITYPLANOVERVIEW","ACTIVITYPLANCOMMENTS","ACTIVITYPLANFILES","ACTIVITYPLANPROCESSMAP","ACTIVITYPLANLOG"],"contextsWithoutRightSidebarCaseDashboard":["HOME","TEMPLATEENGINE-VIEW","ENTITY-ENGINE-VIEW","SEARCH-ENGINE-VIEW","CASES-TEMPLATE-VIEW","PLANS-VIEW","REFRESHALL"],"contextsRightSidebarCaseDashboard":["ACTIVITY","OVERVIEW","COMMENTS","FILES","PROCESSMAP","LOG","PLANCREATE","PLANOVERVIEW","PLANACTIVITIES","PLANFILES","PLANCOMMENTS","PLANSIDEBAR","EDITACTIVITY","ACTIVITYPLAN","ACTIVITYPLANCREATE","ACTIVITYPLANOVERVIEW","ACTIVITYPLANCOMMENTS","ACTIVITYPLANFILES","ACTIVITYPLANPROCESSMAP","ACTIVITYPLANLOG"],"caseNumber":"6421","process":"Schedule personal trainer","processPath":"App > Processes > Schedule personal trainer","creationDate":"12/02/2015 09:44","estimatedSolutionDate":"05/31/2027 19:00","solutionDate":"12/02/2015 09:44","isOpen":"true","idParentCase":-1,"radNumberParentCase":"","isFavorite":"true","guidFavorite":"c77dfbe7-f1a0-4698-8067-10c8f1f8c2db","parentDisplayName":"","canAccesToParentProcess":"false","isDelegatedCase":"false","isAborted":"false","hasComments":"false","countEvents":1,"countSubProcesses":0,"countAssigness":2,"helpUrl":"","currentState":[{"assignToCurrentUser":"true","estimatedSolutionDate":"05/31/2027 19:00","isEvent":"true","allowReleaseActivity":true,"idTask":77,"state":"Cancel","colorState":"Green","helpUrl":"","tskDescription":"","idWorkItem":"11459","allowsReassign":"true","entryDateWorkItem":"12/02/2015 14:44","guidWorkItem":"fc3c8a23-5972-48c6-8758-57740a2036b4"},{"assignToCurrentUser":"true","estimatedSolutionDate":"12/02/2015 09:44","isEvent":"false","allowReleaseActivity":false,"idTask":5,"state":"Schedule personal session","colorState":"Red","helpUrl":"","tskDescription":"","idWorkItem":"11458","allowsReassign":"false","entryDateWorkItem":"12/02/2015 14:44","guidWorkItem":"a55fa3af-769d-4d20-b3cb-1a6d18674e0a"}],"caseDescription":"","createdBy":{"userName":"AJones","Name":"Addison Jones","userId":207},"contextualized":true,"createdByName":"Addison Jones","createdByUserName":"AJones","showWorkOnIt":true,"showEvents":true,"showParentProcess":false,"parentProcess":{"displayName":"","idCase":-1},"isClosed":false,"showAssignees":true,"showSubProcess":false,"showForm":false,"allowsReassign":"false","currentStateTypes":["(see object with key 1)"],"showActivities":true,"differenceMillisecondsServer":-30,"plan":{},"guidWorkItem":"a55fa3af-769d-4d20-b3cb-1a6d18674e0a","planChild":{"id":"5af5efde-9b08-41b4-9fcc-58ffddbaac5d"},"menuDashboard":{"showFormOverview":false,"showPlanOptionMenu":true,"showFormActivity":true,"contextFormActivityOptionMenu":"ACTIVITY","contextPlanOptionMenu":"PLANACTIVITIES"},"histName":"Schedule personal session","level":0,"showContextByMenuDashboard":"ACTIVITY"}
            };
            spyOn(widget.dataService, "getEffectiveDuration").and.callFake(function(){
               return {
                  minutes: 123
               }
            });
         });
         it("Should call ", function (done) {
            bizagi.currentUser = {
               idUser: 123
            };
            widget.datePickerRegional = {"closeText":"Cerrar","prevText":"Ant","nextText":"Sig","currentText":"Hoy","weekHeader":"Sm","firstDay":"1","dateFormat":"dd/mm/yy","isrtl":false,"showMonthAfterYear":false,"yearSuffix":"","monthNames":["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"],"monthNamesShort":["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"],"dayNames":["Domingo","Lunes","Martes","Miercoles","Jueves","Viernes","Sábado"],"dayNamesShort":["Dom","Lun","Mar","Mié","Juv","Vie","Sáb"],"dayNamesMin":["Do","Lu","Ma","Mi","Ju","Vi","Sá"]};
            widget.updateView({}, params);
            expect(widget.showCaseNumber).toHaveBeenCalled();
            done();
         });
      });

      describe("onClickFavorite", function () {
         beforeEach(function () {
            spyOn(widget.dataService, "addFavorite").and.callFake(function(){
               return {idFavorites: "GUIDFAVORITE"};
            });
            spyOn(widget.dataService, "delFavorite");
         });
         it("Should call service deleteFavorite and addFavorite", function () {
            $(".case-summary-favorite", widget.getContent()).click();
            expect(widget.dataService.delFavorite).toHaveBeenCalled();
            $(".case-summary-favorite", widget.getContent()).addClass("bz-icon-star-outline");
            $(".case-summary-favorite", widget.getContent()).click();
            expect(widget.dataService.addFavorite).toHaveBeenCalled();
         });
      });

      describe("onSelectMenu", function () {
         beforeEach(function () {
            event = {
               currentTarget: '<div></div>'
            };

            ui = {
               item: $('<li class="ui-menu-item" role="presentation"> <a href="javascript:void(0);" aria-haspopup="true" id="ui-id-2" class="ui-corner-all ui-state-active" tabindex="-1" role="menuitem"><span class="ui-menu-icon ui-icon ui-icon-carat-1-e"></span><i class="bz-icon bz-icon-16 bz-icon-cog-outline"></i></a> <ul class="ui-menu ui-widget ui-widget-content ui-corner-all" role="menu" aria-expanded="true" style="display: block; position: relative; top: -21px; left: -150px;"> <li id="bt-case-action-reassing" class="ui-menu-item" style="" data-item="reassing"> <a href="javascript:void(0);" class="">Reasignar</a> </li><li id="bt-case-action-release" class="ui-menu-item" style="" data-item="release"> <a href="javascript:void(0);">Liberar</a> </li></ul> </li>')
            }
         });
         describe("reassing", function () {
            beforeEach(function () {
               spyOn(widget, "publish");
            });
            it("Should call publish event showDialogWidget", function () {
               $(ui.item).data("item", "reassing");
               widget.onSelectMenu(event, ui);
               expect(widget.publish).toHaveBeenCalled();
            });
         });
         describe("release", function () {
            beforeEach(function () {
               spyOn(widget.releaseDialogBox.formContent, "dialog").and.callThrough();
            });
            it("Should open popup", function () {
               $(ui.item).data("item", "release");
               widget.onSelectMenu(event, ui);
               expect(widget.releaseDialogBox.formContent.dialog).toHaveBeenCalled();
            });
         });
      });
      describe("onClickAcceptRelease", function () {
         describe("when service result Success", function () {
            beforeEach(function () {
               spyOn(widget, "publish");
               spyOn(widget.dataService, "releaseActivity").and.callFake(function(){
                  return {status: "Success"};
               });
            });
            it("Should call releaseActivity", function () {
               widget.onClickAcceptRelease();
               expect(widget.dataService.releaseActivity).toHaveBeenCalled();
               expect(widget.publish).toHaveBeenCalled();
            });
         });

         describe("when service result ConfigurationError", function () {
            beforeEach(function () {
               spyOn(bizagi, "showMessageBox");
               spyOn(widget.dataService, "releaseActivity").and.callFake(function(){
                  return {status: "ConfigurationError"};
               });
               spyOn(widget.releaseDialogBox.formContent, "dialog");
               spyOn(widget.releaseDialogBox.formContent, "detach");
            });
            it("Should call releaseActivity", function () {
               widget.onClickAcceptRelease();
               expect(widget.dataService.releaseActivity).toHaveBeenCalled();
               expect(bizagi.showMessageBox).toHaveBeenCalled();
            });
         });

         describe("when service result OtherValue", function () {
            beforeEach(function () {
               spyOn(bizagi, "showMessageBox");
               spyOn(widget.dataService, "releaseActivity").and.callFake(function(){
                  return {status: "OtherValue"};
               });
               spyOn(widget.releaseDialogBox.formContent, "dialog");
               spyOn(widget.releaseDialogBox.formContent, "detach");
            });
            it("Should call releaseActivity", function () {
               widget.onClickAcceptRelease();
               expect(widget.dataService.releaseActivity).toHaveBeenCalled();
               expect(bizagi.showMessageBox).toHaveBeenCalled();
            });
         });
      });
      describe("clean", function () {
         beforeEach(function () {
            spyOn(widget, "unsub");
         });
         it("Should call unsub", function () {
            widget.clean();
            expect(widget.unsub).toHaveBeenCalled();
         });
      });
   });
});
