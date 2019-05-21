/**
 * Name: Bizagi Workportal Desktop Create plan
 */

bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.project.plan.create", {}, {
   /**
    * Constructor
    */
   init: function (workportalFacade, dataService, notifier, params) {
      var self = this;
      self.params = params;
      self.contextualized;

      // Call base
      self._super(workportalFacade, dataService, params);
      self.notifier = notifier;

      //Load template
      self.loadTemplates({
         "plan-create": bizagi.getTemplate("bizagi.workportal.desktop.widgets.project.plan.create").concat("#plan-create")
      });

      self.dialogBox = {};
   },

   renderContent: function(){
      var self = this;
      self.content = $("<div></div>");
      return self.content;
   },

   postRender: function () {
      var self = this;
      self.initPlugins();
   },

   initPlugins: function () {
      var self = this,
         template = self.getTemplate('plan-create');
      self.dialogBox.formContent = template.render({});
      self.dialogBox.elements = {
         inputName: $('#input-name-plan', self.dialogBox.formContent),
         inputTemplate: $('#templates-plan', self.dialogBox.formContent),
         buttonSave: $('#button-accept-create-plan', self.dialogBox.formContent),
         buttonCancel: $('#button-cancel-create-plan', self.dialogBox.formContent)
      };
      self.dialogBox.elements.buttonSave.on('click', $.proxy(self.onClickSavePlan, self));
      self.dialogBox.elements.buttonCancel.on('click', $.proxy(self.closeDialogBox, self));

      self.notifier = bizagi.injector.get('notifier');
   },

   closeDialogBox: function () {
      var self = this;
      self.dialogBox.formContent.dialog('destroy');
      self.dialogBox.formContent.detach();
      self.dialogBox.templateGuid = '';
   },

   showPopupAddPlan: function (params, dataService, contextualized) {
      var self = this;
      self.params = params;
      self.dataService = dataService;
      self.contextualized = contextualized;
      self.content = $("<div></div>");
      self.initPlugins();

      self.dialogBox.elements.inputTemplate.html('');
      self.dataService.getTemplatesByParentWorkItem({parentWorkItem: params.guidWorkItem}).done(function (data) {
         var comboDataSource = {combo: [], id: 'templates'};
         comboDataSource.combo = data;
         self.dialogBox.elements.inputTemplate.uicombo({
            isEditable: false,
            data: comboDataSource,
            itemValue: function (obj) {
               return obj.id;
            },
            itemText: function (obj) {
               return obj.name;
            },
            onChange: function (obj) {
               var value = obj.ui.data('value');
               self.dialogBox.elements.inputTemplate.val(value);
               self.dialogBox.templateGuid = value;
            },css:'display: none'
         });

         self.dialogBox.elements.inputTemplate.keydown(function () {
            if (event.keyCode == 8 || event.keyCode == 46) {
               event.preventDefault();
               self.dialogBox.templateGuid = '';
               self.dialogBox.elements.inputTemplate.val('');
               $('input', self.dialogBox.elements.inputTemplate).val('');
            }
         });

         if(data.length > 0){
             $(".field-template", self.dialogBox.formContent).show();
         }
          else{
             $(".field-template", self.dialogBox.formContent).hide();
         }
      }).fail(function(){
         $(".field-template", self.dialogBox.formContent).hide();
      });
      self.dialogBox.formContent.dialog({
         resizable: false,
         draggable: false,
         height: 'auto',
         width: '600px',
         modal: true,
         title: bizagi.localization.getResource('workportal-project-plan-popup-title-add-plan'),
         maximize: false,
         close: function () {
            self.dialogBox.formContent.dialog('destroy');
            self.dialogBox.formContent.detach();
         }
      });
   },

   onClickSavePlan: function (event) {
      event.preventDefault();
      var self = this;
      if (self.validateParams()) {
         self.createNewPlan();
      }

   },

   createNewPlan: function () {
      var self = this;
      var parentWorkItemRaw = self.params.guidWorkItem || null;

      var paramsNewPlan = {
         idUserCreator: bizagi.currentUser.idUser,
         id: undefined,
         startDate: null,
         creationDate: null,
         parentWorkItem: parentWorkItemRaw,
         description: null,
         currentState: 'PENDING',
         name: self.dialogBox.elements.inputName.val(),
         waitForCompletion: true,
         dueDate: null,
         contextualized: self.contextualized,
         idTemplate: self.dialogBox.templateGuid
      };
      $.when(self.sendDataInsertPlan(paramsNewPlan)).then(function (response) {
         paramsNewPlan = $.extend(paramsNewPlan, {id: response.id});
         paramsNewPlan.activities = [];
         paramsNewPlan.users = [];

         //Set security menuDashboard
         var servicesPD = new bizagi.workportal.services.behaviors.projectDashboard(self.dataService);
         self.params.menuPlanDashboard = {};
         self.params.menuPlanDashboard.showCommentsOptionMenu =
             servicesPD.getMenuDashboardSecurity(bizagi.menuSecurity).isVisibleButtonComments;
         self.params.menuPlanDashboard.showFilesOptionMenu =
             servicesPD.getMenuDashboardSecurity(bizagi.menuSecurity).isVisibleButtonFiles;
         self.params.menuPlanDashboard.showTimeLineOptionMenu =
             servicesPD.getMenuDashboardSecurity(bizagi.menuSecurity).isVisibleButtonTimeLine;

          $.when(servicesPD.getRadNumberForPlanDashboard(paramsNewPlan.id, paramsNewPlan.contextualized)).done(function (responseRadNumber) {
              self.pub('planCreated', { paramsNewPlan: paramsNewPlan, radNumber: responseRadNumber});
              self.closeDialogBox();
              self.notifier.showSucessMessage(
                  printf(bizagi.localization.getResource('workportal-project-plan-created'), ''));
          });
      });
   },

   validateParams: function () {
      var self = this;
      var name = self.dialogBox.elements.inputName;
      if (name.val() && name.val() !== '') {
         return true;
      } else {
         var nameValidation = bizagi.localization.getResource('workportal-project-plan-popup-field-name-required');
         name.next().find('span').html(nameValidation);
         return false;
      }
   },

   sendDataInsertPlan: function (params) {
      var self = this;
      var defer = $.Deferred();
      $.when(self.dataService.postPlan(params)).always(function (response, responseText, xhr) {
         if (xhr.status === 201) {
            defer.resolve(response);
         }
         else {
            defer.reject();
         }
      });
      return defer.promise();
   }
});

bizagi.injector.register('bizagi.workportal.widgets.project.plan.create', ['workportalFacade', 'dataService', 'notifier', bizagi.workportal.widgets.project.plan.create]);
