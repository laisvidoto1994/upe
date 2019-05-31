/**
 * Name: Bizagi Workportal Desktop Edit plan
 */

bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.project.plan.edit", {}, {
    /**
     * Constructor
     */
    init: function (workportalFacade, dataService, notifier, params) {
        var self = this;
        self.params = params;
        self.planToEdit;

        // Call base
        self._super(workportalFacade, dataService, params);
        self.notifier = notifier;

        //Load template
        self.loadTemplates({
            'plans.manager.popup.edit.plan': bizagi.getTemplate('bizagi.workportal.desktop.widgets.project.plan.edit').concat('#plans-manager-popup-edit-plan')
        });

        self.editDialogBox = {};
    },

    renderContent: function(){
        var self = this;
        self.content = $("<div></div>");
        return self.content;
    },

    postRender: function () {
        var self = this;
    },

    closeEditDialogBox: function () {
        var self = this;
        self.editDialogBox.elements.inputDueDate.datepicker("destroy");
        self.editDialogBox.formContent.dialog('destroy');
        self.editDialogBox.formContent.detach();
    },

    showPopup: function (params, dataService, planToEdit) {
        var self = this;
        self.planToEdit = planToEdit;
        self.initEditDialogBox(planToEdit);
        self.editDialogBox.elements.inputName.val(planToEdit.name);
        self.editDialogBox.elements.inputDesc.val(planToEdit.description);
        self.editDialogBox.elements.inputWaitForCompletion.prop( "checked", planToEdit.waitForCompletion);
        self.editDialogBox.elements.inputDueDate.datepicker();
        self.editDialogBox.elements.inputDueDate.datepicker("option", "dateFormat", bizagi.util.dateFormatter.getDateFormatByDatePickerJqueryUI());
        if(planToEdit.dueDate){
            self.editDialogBox.elements.inputDueDate.datepicker('setDate', new Date(planToEdit.dueDate));
        }
        self.editDialogBox.formContent.dialog({
            resizable: false,
            draggable: false,
            height: 'auto',
            width: '600px',
            modal: true,
            title: bizagi.localization.getResource('workportal-project-plan-editplan'),
            maximize: true,
            close: function (ev, ui) {
                self.editDialogBox.elements.inputDueDate.datepicker("destroy");
                self.editDialogBox.formContent.dialog('destroy');
                self.editDialogBox.formContent.detach();
            }
        });
    },

    initEditDialogBox: function (plan) {
        var self = this,
            editPlanTemplate = self.getTemplate('plans.manager.popup.edit.plan');
        self.editDialogBox.formContent = editPlanTemplate.render(plan);
        self.editDialogBox.elements = {
            inputName: $('#input-name-plan', self.editDialogBox.formContent),
            inputDesc: $('#input-desc-plan', self.editDialogBox.formContent),
            inputDueDate: $('#input-dueDate-plan', self.editDialogBox.formContent),
            inputWaitForCompletion: $('#input-waitForCompletion', self.editDialogBox.formContent),
            buttonSave: $('#button-accept-edit-plan', self.editDialogBox.formContent),
            buttonCancel: $('#button-cancel-edit-plan', self.editDialogBox.formContent)
        };
        self.editDialogBox.elements.buttonSave.on('click', $.proxy(self.saveEditedPlan, self));
        self.editDialogBox.elements.buttonCancel.on('click', $.proxy(self.closeEditDialogBox, self));
    },


    saveEditedPlan: function (event) {
        event.preventDefault();
        var self = this;
        if (self.validateEditDialogBoxParams()) {
            $.when(self.getParamsUpdatePlan()).done(function(updateParams){
                $.when(self.dataService.updatePlan(updateParams)).done(function () {
                    self.closeEditDialogBox();
                    self.pub('planEditedSuccess', {
                        paramsEditPlan: updateParams
                    });

                }).fail(function () {
                    self.pub('planEditedFailed');
                });
            });
        }
    },

    getParamsUpdatePlan: function(){
        var self = this;
        var defer = $.Deferred();
        var updateParams = {};
        updateParams = self.planToEdit;

        updateParams.name = self.editDialogBox.elements.inputName.val();
        updateParams.description = self.editDialogBox.elements.inputDesc.val();
        if(self.editDialogBox.elements.inputWaitForCompletion.length !== 0){
            updateParams.waitForCompletion = self.editDialogBox.elements.inputWaitForCompletion.prop("checked");
        }

        var dueDateRaw = self.editDialogBox.elements.inputDueDate.datepicker('getDate');
        if(dueDateRaw){
            var params = {
                idUser: bizagi.currentUser.idUser,
                date: dueDateRaw.getTime()
            };
            $.when(self.dataService.getEndHourWorkingByDate(params)).done(function (data) {
                updateParams.dueDate = data.dateTime;
                defer.resolve(updateParams);
            });
        }
        else{
            defer.resolve(updateParams);
        }

        return defer.promise();
    },


    validateEditDialogBoxParams: function () {
        var self = this;
        var name = self.editDialogBox.elements.inputName;
        if (name.val() && name.val() !== '') {
            return true;
        } else {
            var nameValidation = bizagi.localization.getResource('workportal-project-plan-popup-field-name-required');
            name.next().find('span').html(nameValidation);
            return false;
        }
    }
});

bizagi.injector.register('bizagi.workportal.widgets.project.plan.edit', ['workportalFacade', 'dataService', 'notifier', bizagi.workportal.widgets.project.plan.edit]);