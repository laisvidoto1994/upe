/*
 *   Name: Bizagi Workportal Desktop  plan topmenu controller
 *   Author: Iván Ricardo Taimal Narváez
 */

bizagi.workportal.widgets.widget.extend('bizagi.workportal.widgets.plans.topmenu', {}, {

    init: function (workportalFacade, dataService, planCreate, params) {
        var self = this;
        self.params = params;
        // Call base
        self._super(workportalFacade, dataService, params);
        self.planCreate = planCreate;
        //Load templates
        self.loadTemplates({
            'plans.topmenu.wrapper': bizagi.getTemplate('bizagi.workportal.desktop.widget.decontextualized.plans.topmenu').concat('#plans-topmenu-wrapper')
        });
    },

    renderContent: function () {
        var self = this;
        var template = self.getTemplate('plans.topmenu.wrapper');
        self.content = template.render({});
        return self.content;
    },

    postRender: function () {
        var self = this;
        self.configureHandlers();
    },
    /**
     * Binds events to handles
     */
    configureHandlers: function () {
        var self = this,
            $content = self.getContent();
        $('.wdg-topmenu-add', $content).on('click', $.proxy(self.onClickAddPlan, self));
    },

    onClickAddPlan: function () {
        var self = this;

        self.planCreate.showPopupAddPlan(self.params, self.dataService, false);
        self.planCreate.unsub('planCreated');
        self.planCreate.sub('planCreated', function (ev, params) {
            var paramsNewPlan = params.paramsNewPlan;
            var histName = paramsNewPlan.name;
            if (paramsNewPlan.name.length > 28) {
                histName = paramsNewPlan.name.substring(0, 29) + '...';
            }
            self.params.radNumber = params.radNumber;
            self.params.showContextByMenuDashboard = 'PLANACTIVITIES';
            self.pub('notify', {
                type: 'PLANACTIVITIES',
                args: $.extend(self.params, {
                    plan: params.paramsNewPlan,
                    level: 2,
                    histName: histName
                })
            });
        });
    }


});

bizagi.injector.register('bizagi.workportal.widgets.plans.topmenu', ['workportalFacade', 'dataService', 'bizagi.workportal.widgets.project.plan.create', bizagi.workportal.widgets.plans.topmenu]);