/**
 *   Name: Bizagi Workportal Service Related Users
 *   Author: Elkin Fernando Siabato Cruz
 *
 *   Summary: This widget, show related users the tesks
 */
bizagi.workportal.services.relatedusers = function(dataService, loadTemplatesService){
   var self = this;
   self.init = function(){
      self.auxNoRepeatTypesUser = {};
      self.dataRelatedUsers = [];
   }
   self.init();
   self.dataService = dataService;
   self.idCase;
   self.content;
   self.hashTypesUser = {
      "assigned": bizagi.localization.getResource("workportal-project-user-assigned"),
      "owner": bizagi.localization.getResource("workportal-project-user-owner")
   };

   //load Templates
   loadTemplatesService.loadTemplates({
      "relatedUsersTemplate": bizagi.getTemplate("bizagi.workportal.services.relatedusers").concat("#relatedusers-wrapper"),
      "relatedUserTooltip": bizagi.getTemplate("bizagi.workportal.services.relatedusers").concat("#related-user-tooltip")
   });

   /**
    * Render all users with funcionality tooltip
    */
   self.render = function(wrapper, selector, idCase, typesToAssignUsers){
      self.init();
      self.$wrapper = wrapper;
      self.selector = selector;
      self.idCase = idCase;

      self.dataService.getCaseAssignees({idCase: idCase}).done( function(dataAssignedUser) {
         var csvUserIds = self.getCSVUserIds(dataAssignedUser.assignees, typesToAssignUsers);
         $.when(self.getUsersData(csvUserIds)).done( function(rawData) {
            self.prepareData(rawData, typesToAssignUsers, dataAssignedUser);
            self.printUsers(self.dataRelatedUsers);
            self.addEventHandlersTooltip();
         });
      });
   };

   /**
    *
    * @param assignees
    * @param typesToAssignUsers
    * @returns {*}
    */
   self.getCSVUserIds = function(assignees, typesToAssignUsers){
      var arrayIdsUsers = $.map(assignees, function (itemUser) {
         return itemUser.idUser;
      });
      arrayIdsUsers.unshift(typesToAssignUsers[0].id);
      return arrayIdsUsers.join(",");
   };

   /**
    * Get data users with service
    */
   self.getUsersData = function (csvUserIds) {
      var self = this;
      var defer = $.Deferred();
      var params = {
         userIds: csvUserIds,
         width: 50,
         height: 50
      };

      self.dataService.getUsersData(params).done(function (response) {
         defer.resolve(response);
      }).fail(function(){
         defer.resolve([]);
      });

      return defer.promise();
   };

   /**
    * Organize users data for render template
    */
   self.prepareData = function(rawUsersData, typesToAssignUsers, dataAssignedUser){
      var dataProcessed = [];
      if (rawUsersData) {
         self.mergeTypesToAssignUsers(typesToAssignUsers, dataAssignedUser);
         for (var i = 0, j = rawUsersData.length; i < j; i++) {
            var user = self.prepareDataUser(rawUsersData[i], typesToAssignUsers, dataAssignedUser);
            dataProcessed.push(user);
         }
      }
      self.dataRelatedUsers = dataProcessed;
   };

   /**
    *
    * @param typesToAssignUsers
    * @param dataAssignedUser
    */
   self.mergeTypesToAssignUsers = function(typesToAssignUsers, dataAssignedUser){
      for (var i = 0, totalDataAssigned = dataAssignedUser.assignees.length; i < totalDataAssigned; i++) {
         //Using the hash, validate no repeat elements on typesToAssignUsers
         var temp = self.auxNoRepeatTypesUser[dataAssignedUser.assignees[i].idUser.toString() + "assigned"];
         if (typeof temp === "undefined") {
            self.auxNoRepeatTypesUser[dataAssignedUser.assignees[i].idUser.toString() + "assigned"] = "";
            typesToAssignUsers.push({
               id: dataAssignedUser.assignees[i].idUser || -1,
               typeName: "assigned"
            });
         }
      }
   };

   /**
    * Render template users
    */
   self.printUsers = function(){
      self.content = loadTemplatesService.getTemplate("relatedUsersTemplate").render({users: self.dataRelatedUsers});

      $("span, li", self.content).removeClass("nodisplay");
      $(self.selector, self.$wrapper).html(self.content);
   };

   /**
    * Prepare data by user
    */
   self.prepareDataUser = function(rawDataUser, typesToAssignUsers, dataAssignedUsers){
      var id = rawDataUser.id;
      var user = {
         id: id,
         name: rawDataUser.name,
         initials: rawDataUser.name.getInitials(),
         picture: (rawDataUser.picture) ? "data:image/png;base64," + rawDataUser.picture : undefined,
         types: self.assignUserTypes(id.toString(), typesToAssignUsers),
         tasks: self.getTasksUser(dataAssignedUsers, id.toString())
      };

      user.typesString = $.map(user.types, function(type) {
         return self.hashTypesUser[type];
      }).join(",");

      return user;
   };

   /**
    *
    * @param dataAssignedUsers
    * @param idUser
    * @returns {Array}
    */
   self.getTasksUser = function(dataAssignedUsers, idUser){
      var tasks = [];
      var dataAssignedUser = dataAssignedUsers.assignees.filter(function(user){
         return user.idUser.toString() === idUser;
      });

      for (var i = 0, total = dataAssignedUser.length; i < total; i += 1) {
         tasks.push({
            taskType: bizagi.util.parseBoolean(dataAssignedUser[i].isEvent) ? bizagi.localization.getResource("workportal-project-user-event"): bizagi.localization.getResource("workportal-project-user-task"),
            taskName: dataAssignedUser[i].taskName
         });
      }
      return tasks;
   };

   /**
    *
    * @param userId
    * @param typesToAssignUsers
    * @returns {Array}
    */
   self.assignUserTypes = function(userId, typesToAssignUsers){
      var typesUser = [];

      for (var i = 0, totalTypeUser = typesToAssignUsers.length;i < totalTypeUser; i += 1){
         if (userId === typesToAssignUsers[i].id.toString()) {
            typesUser.push(typesToAssignUsers[i].typeName);
         }
      }

      return typesUser;
   };

   /**
    * Add event handler for tooltip
    */
   self.addEventHandlersTooltip = function(){
      $("ul", self.content).tooltip({
         items: "li",
         content: function() {
            var userId = $(this).data("userid");
            var userSelected = self.dataRelatedUsers.filter(function(user){
               return user.id === userId;
            })[0];

            return loadTemplatesService.getTemplate("relatedUserTooltip").render(userSelected);
         }
      });
   };
};

bizagi.injector.register("relatedusers", ["dataService", 'loadTemplatesService', bizagi.workportal.services.relatedusers], true);