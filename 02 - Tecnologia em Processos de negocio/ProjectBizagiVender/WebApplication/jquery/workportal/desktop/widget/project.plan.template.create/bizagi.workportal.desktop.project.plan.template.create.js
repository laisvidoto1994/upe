/**
 * Name: Bizagi Workportal Desktop Create plan template
 */

bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.project.plan.template.create", {}, {
    /**
     * Constructor
     */
    init: function (workportalFacade, dataService, params) {
        var self = this;
        self.params = params;
        self.contextualized;
        self.idPlanSelected;

        // Call base
        self._super(workportalFacade, dataService, params);

        //Load template
        self.loadTemplates({
            "plan-template-create": bizagi.getTemplate("bizagi.workportal.desktop.widgets.project.plan.template.create").concat("#plan-template-create")
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
            template = self.getTemplate('plan-template-create');
        self.dialogBox.formContent = template.render({});
        self.dialogBox.elements = {
            inputName: $('#input-name-template', self.dialogBox.formContent),
            buttonSave: $('#button-accept-create-template', self.dialogBox.formContent),
            buttonCancel: $('#button-cancel-create-template', self.dialogBox.formContent)
        };
        self.dialogBox.elements.buttonSave.on('click', $.proxy(self.onClickSaveTemplate, self));
        self.dialogBox.elements.buttonCancel.on('click', $.proxy(self.closeDialogBox, self));
    },

    closeDialogBox: function () {
        var self = this;
        self.dialogBox.formContent.dialog('destroy');
        self.dialogBox.formContent.detach();
    },

    showPopupAddTemplatePlan: function (params, dataService, contextualized, idPlanSelected) {
        var self = this;
        self.params = params;
        self.dataService = dataService;
        self.contextualized = contextualized;
        self.idPlanSelected = idPlanSelected;
        self.content = $("<div></div>");
        self.initPlugins();

        self.dialogBox.formContent.dialog({
            resizable: false,
            draggable: false,
            height: 'auto',
            width: '600px',
            modal: true,
            title: bizagi.localization.getResource('workportal-project-plan-action-popup-save-as-template'),
            maximize: false,
            close: function (ev, ui) {
                self.dialogBox.formContent.dialog('destroy');
                self.dialogBox.formContent.detach();
            }
        });
    },

    onClickSaveTemplate: function (event) {
        event.preventDefault();
        var self = this;

        if (self.validateSaveDialogBoxParams()) {
            var params = {
                idPlan: self.idPlanSelected,
                name: self.dialogBox.elements.inputName.val()
            };
            $.when(self.dataService.createTemplateByPlan(params)).done(function () {
                self.closeDialogBox();
                self.pub('planTemplateCreatedSuccess', {});
            }).fail(function () {
                self.pub('planTemplateCreatedFailed', {});
            });
        }

    },

    validateSaveDialogBoxParams: function () {
        var self = this;
        var name = self.dialogBox.elements.inputName;
        if (name.val() && name.val() !== '') {
            return true;
        } else {
            var nameValidation = bizagi.localization.getResource('workportal-project-plan-popup-field-name-required');
            name.next().find('span').html(nameValidation);
            return false;
        }
    }
});

bizagi.injector.register('bizagi.workportal.widgets.project.plan.template.create', ['workportalFacade', 'dataService', bizagi.workportal.widgets.project.plan.template.create]);