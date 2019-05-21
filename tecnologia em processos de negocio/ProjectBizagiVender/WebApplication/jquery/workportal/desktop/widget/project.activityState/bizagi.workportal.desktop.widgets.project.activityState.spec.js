/**
 * Unit Testing bizagi.workportal.desktop.widgets.project.activityState
 *
 * @author Elkin Fernando Siabato Cruz
 */

describe("Widget bizagi.workportal.desktop.widgets.project.activityState", function () {
   checkWorkportalDependencies();
   var widget,
      workportalFacade,
      dataService;

   beforeEach(function(){
      bizagi.currentUser = bizagi.currentUser || {};
      bizagi.currentUser.idUser = 1;
   });

   it("Environment has been defined", function(){
      workportalFacade = bizagi.injector.get("workportalFacade");
      dataService = bizagi.injector.get("dataService");
   });
   it("Render Widget", function (done) {
      var params = {};
      widget = new bizagi.workportal.widgets.project.activityState(workportalFacade, dataService, params);

      widget.contextsSidebarActivity = ["ACTIVITY", "OVERVIEW", "COMMENTS", "FILES", "PROCESSMAP", "LOG", "PLANCREATE"];
      widget.datePickerRegional = JSON.parse("{\"closeText\":\"Cerrar\",\"prevText\":\"Ant\",\"nextText\":\"Sig\",\"currentText\":\"Hoy\",\"weekHeader\":\"Sm\",\"firstDay\":\"1\",\"dateFormat\":\"dd/mm/yy\",\"isrtl\":false,\"showMonthAfterYear\":false,\"yearSuffix\":\"\",\"monthNames\":[\"Enero\",\"Febrero\",\"Marzo\",\"Abril\",\"Mayo\",\"Junio\",\"Julio\",\"Agosto\",\"Septiembre\",\"Octubre\",\"Noviembre\",\"Diciembre\"],\"monthNamesShort\":[\"Ene\",\"Feb\",\"Mar\",\"Abr\",\"May\",\"Jun\",\"Jul\",\"Ago\",\"Sep\",\"Oct\",\"Nov\",\"Dic\"],\"dayNames\":[\"Domingo\",\"Lunes\",\"Martes\",\"Miercoles\",\"Jueves\",\"Viernes\",\"Sábado\"],\"dayNamesShort\":[\"Dom\",\"Lun\",\"Mar\",\"Mié\",\"Juv\",\"Vie\",\"Sáb\"],\"dayNamesMin\":[\"Do\",\"Lu\",\"Ma\",\"Mi\",\"Ju\",\"Vi\",\"Sá\"]}");

      $.when(widget.areTemplatedLoaded()).done(function(){
         $.when(widget.renderContent()).done(function (html) {
            dependencies.canvas.empty();
            dependencies.canvas.append(html);
            widget.postRender();
            done();
         });
      });
   });

   describe("Functions", function(){
      it("updateView", function(){
         var params = {
            args: {currentState: [{}]}
         };
         widget.updateView({}, params);
      });

      it("callGetEffectiveDuration should be call service getEffectiveDuration", function(){
         jasmine.clock().install();

         var params = {fromDate: 1449001141936};
         spyOn(widget.dataService, "getEffectiveDuration").and.callFake(function(){
            return {};
         });
         widget.callGetEffectiveDuration(params);

         jasmine.clock().tick(201);

         expect(widget.dataService.getEffectiveDuration).toHaveBeenCalledWith(params);

         jasmine.clock().uninstall();
      });

      describe("function calculateDataForTemplate", function(){
         var currentWorkitem = {}, argsTemplate = {}, creationDateObject = {}, currentDate = {}, estimatedSolutionDateObject = {};
         beforeEach(function(){
            currentWorkitem = JSON.parse("{\"assignToCurrentUser\":\"true\",\"estimatedSolutionDate\":\"11/26/2015 09:08\",\"isEvent\":\"false\",\"allowReleaseActivity\":false,\"idTask\":75,\"state\":\"activitprocess without begin form myself\",\"colorState\":\"Red\",\"helpUrl\":\"\",\"tskDescription\":\"\",\"idWorkItem\":10466,\"allowsReassign\":\"false\",\"entryDateWorkItem\":\"11/26/2015 09:08\",\"guidWorkItem\":\"268c4d7d-4fbe-4e4b-abeb-8778a47acc15\"}");
            argsTemplate = JSON.parse("{\"activityName\":\"activitprocess without begin form myself\",\"activityIsEvent\":false,\"initDateFormat\":\"Noviembre 26\",\"estimatedSolutionDateFormat\":\"\"}");
            creationDateObject = new Date(Date.now() - 200000000);//some days before
            currentDate = new Date();
            estimatedSolutionDateObject = new Date(Date.now() - 200000000);//some days before

            spyOn(widget, "callGetEffectiveDuration").and.callFake(function(params){
               return {minutes: params.toDate - params.fromDate};
            });

            spyOn(widget, "getTemplate").and.callFake(function(){
               return {
                  render: function(){
                     return {
                        appendTo: function(){}
                     };
                  }
               };
            });
         });
         it("Should be call twice service callGetEffectiveDuration", function(){
            widget.calculateDataForTemplate(currentWorkitem, argsTemplate, creationDateObject, currentDate, estimatedSolutionDateObject);
            expect(widget.callGetEffectiveDuration.calls.count()).toEqual(2);
         });

         describe("When there is difference on creation and estimate time", function(){
            var creationDateObject = {}, estimatedSolutionDateObject = {};
            beforeEach(function(){
               creationDateObject = new Date(Date.now() - 200000000);//some days before
               estimatedSolutionDateObject = new Date(Date.now() - 100000000);//some days before
               spyOn(bizagi.localization, "getResource").and.callFake(function(){
                  return "value-resource";
               });
               spyOn(bizagi.util.dateFormatter, "getRelativeTime").and.callFake(function(){
                  return "";
               });
            });
            it("Should be get resouce 'exceeded'", function(){
               widget.calculateDataForTemplate(currentWorkitem, argsTemplate, creationDateObject, currentDate, estimatedSolutionDateObject);
               expect(bizagi.localization.getResource).toHaveBeenCalled();
            });
         });
      });

      describe("function getColorAndPercentBar", function(){
         describe("When percent < 33", function(){
            it("Should be red", function(){
               expect(widget.getColorAndPercentBar(100, 90).color).toBe("Red");
            });
         });
         describe("When percent < 66 and >=33", function(){
            it("Should be Yellow", function(){
               expect(widget.getColorAndPercentBar(100, 50).color).toBe("Yellow");
            });
         });
         describe("When percent >= 66", function(){
            it("Should be Green", function(){
               expect(widget.getColorAndPercentBar(100, 10).color).toBe("Green");
            });
         });
      });

      describe("function clean", function(){
         beforeEach(function(){
            spyOn(widget, "unsub");
         });
         it("Should be unsub events by context", function(){
            widget.clean();
            expect(widget.unsub).toHaveBeenCalled();
            expect(widget.unsub.calls.count()).toBe(7);
         });
      });
   });

});
