describe("bizagi.workportal.services.relatedusers", function () {
   checkWorkportalDependencies();
   var dataService, serviceRelatedUsers,
   assignedUsers = {"assignees":[{"Name":"Melissa Gold","idUser":"3","idWorkItem":"652","userName":"domain\\MelissaG","taskName":"Take Cytology","idTask":11,"isEvent":"false","isDelegator":"false"}]};
   var typesToAssignUsers = [
      {
         id: 1,
         typeName: "owner"
      },
      {
         id: 2,
         typeName: "assigned"
      },
      {
         id: 3,
         typeName: "owner"
      },
      {
         id: 3,
         typeName: "assigned"
      }
   ];

   beforeEach(function(){
      dataService = bizagi.injector.get("dataService");
      loadTemplatesService = bizagi.injector.get("loadTemplatesService");
   });

   it("dependencies should defined", function(){
      expect(dataService).toBeDefined();
      serviceRelatedUsers = new bizagi.workportal.services.relatedusers(dataService, loadTemplatesService);
   });

   describe("render", function () {
      var paramUsers;
      beforeEach(function () {
         spyOn(serviceRelatedUsers, "getUsersData").and.callFake(function(){
            var defer = $.Deferred();
            defer.resolve([]);
            return defer;
         });
         spyOn(serviceRelatedUsers.dataService, "getCaseAssignees").and.callFake(function(){
            var defer = $.Deferred();
            defer.resolve(assignedUsers);
            return defer;
         });
         spyOn(serviceRelatedUsers, "getCSVUserIds");
         spyOn(serviceRelatedUsers, "prepareData");
         spyOn(serviceRelatedUsers, "printUsers");
         spyOn(serviceRelatedUsers, "addEventHandlersTooltip");
      });

      it("Should get csv userids", function(){
         serviceRelatedUsers.render();
         expect(serviceRelatedUsers.getCSVUserIds).toHaveBeenCalled();
      });

      it("Should get users data", function () {
         serviceRelatedUsers.render();
         expect(serviceRelatedUsers.getUsersData).toHaveBeenCalled();
      });

      it("Should prepare data", function () {
         serviceRelatedUsers.render();
         expect(serviceRelatedUsers.prepareData).toHaveBeenCalled();
      });

      it("Should print users", function(){
         serviceRelatedUsers.render();
         expect(serviceRelatedUsers.printUsers).toHaveBeenCalled();
      });

      it("Should add Event Handlers to users for Tooltip", function(){
         serviceRelatedUsers.render();
         expect(serviceRelatedUsers.addEventHandlersTooltip).toHaveBeenCalled();
      });
   });

   describe("getCSVUserIds", function () {
      it("Should get a csv by data assigneda", function () {
         expect(serviceRelatedUsers.getCSVUserIds(assignedUsers.assignees, [{id: "34"}]).length).toBeGreaterThan(0);
      });
   });

   describe("getUsersData", function(){
      beforeEach(function(){
         spyOn(serviceRelatedUsers.dataService, "getUsersData").and.callFake(function(){
            var defer = $.Deferred();
            defer.resolve([]);
            return defer;
         });
      });

      it("Should call service", function(){
         serviceRelatedUsers.getUsersData();
         expect(serviceRelatedUsers.dataService.getUsersData).toHaveBeenCalled();
      });
   });


   describe("prepareData", function(){
      describe("when no data", function () {
         it("Should relatedUsers is array empty", function () {
            serviceRelatedUsers.prepareData();
            expect(serviceRelatedUsers.dataRelatedUsers.length).toBe(0);

            serviceRelatedUsers.prepareData([], [], assignedUsers);
            expect(serviceRelatedUsers.dataRelatedUsers.length).toBe(0);
         });
      });
      describe("when data have minimum a user", function () {
         beforeEach(function () {
            spyOn(serviceRelatedUsers, "prepareDataUser");
            spyOn(serviceRelatedUsers, "mergeTypesToAssignUsers");
         });

         it("Should prepare user data by a user", function () {
            serviceRelatedUsers.prepareData([1]);
            expect(serviceRelatedUsers.prepareDataUser.calls.count()).toBe(1);
         });

         it("Should prepare twice user data by 2 user", function () {
            serviceRelatedUsers.prepareData([1,2]);
            expect(serviceRelatedUsers.prepareDataUser.calls.count()).toBe(2);
         });

         it("Should prepare user three times data by 3 user", function () {
            serviceRelatedUsers.prepareData([1,2,3]);
            expect(serviceRelatedUsers.prepareDataUser.calls.count()).toBe(3);
         });

         /**Behavior*/
         it("Should get data extra to Users and merge typesToAsignedUsers", function () {
            serviceRelatedUsers.prepareData([1,2,3]);
            expect(serviceRelatedUsers.mergeTypesToAssignUsers).toHaveBeenCalled();
         });
      });
   });

   describe("mergeTypesToAssignUsers", function () {
      it("Should create a typeAssigned for every userAssigned", function () {
         var prevCountTypes = typesToAssignUsers.length;
         serviceRelatedUsers.mergeTypesToAssignUsers(typesToAssignUsers, assignedUsers);
         /*Because assignedUsers have a same user that typesToAssignUsers*/
         expect(typesToAssignUsers.length).toBe(4);
      });
   });

   describe("prepareDataUser", function () {
      var rawDataUser, response;
      beforeEach(function () {
         spyOn(serviceRelatedUsers, "assignUserTypes").and.callThrough();
         response = serviceRelatedUsers.prepareDataUser({
            id: 1,
            name: "Adam Smith"
         }, typesToAssignUsers, assignedUsers);
      });
      it("Should assign type users", function () {
         expect(serviceRelatedUsers.assignUserTypes).toHaveBeenCalled();
      });
      it("Should create new properties to user", function () {
         expect(response.initials).toBeDefined();
      });
   });

   describe("assignUserTypes", function () {
      describe("when userId have a type", function () {
         it("Should user have assigned type", function () {
            var typesUserResponse = serviceRelatedUsers.assignUserTypes("1", typesToAssignUsers);
            expect(typesUserResponse[0]).toBe("owner");
            expect(typesUserResponse.length).toBe(1);

            typesUserResponse = serviceRelatedUsers.assignUserTypes("2", typesToAssignUsers);
            expect(typesUserResponse[0]).toBe("assigned");
            expect(typesUserResponse.length).toBe(1);
         });
      });

      describe("When userId have two types", function () {
         it("Should user have two types", function () {
            var typesUserResponse = serviceRelatedUsers.assignUserTypes("3", typesToAssignUsers);
            expect(typesUserResponse[0]).toBe("owner");
            expect(typesUserResponse[1]).toBe("assigned");
            expect(typesUserResponse.length).toBe(2);
         });
      });

      describe("When userId dont have types", function () {
         it("Should user have not types", function () {
            var typesUserResponse = serviceRelatedUsers.assignUserTypes(4, typesToAssignUsers);
            expect(typesUserResponse.length).toBe(0);
         });
      });
   });

});