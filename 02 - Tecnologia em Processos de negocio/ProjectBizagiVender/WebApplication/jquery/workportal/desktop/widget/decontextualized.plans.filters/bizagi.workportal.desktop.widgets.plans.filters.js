/*
 *   Name: Bizagi Workportal Desktop  plan filters controller
 *   Author: Iván Ricardo Taimal Narváez
 */

bizagi.workportal.widgets.widget.extend('bizagi.workportal.widgets.plans.filters', {}, {


    init: function (workportalFacade, dataService, params) {
        var self = this;
        self.params = params;
        // Call base
        self._super(workportalFacade, dataService, params);

        self.plansLinks = bizagi.injector.get('bizagi.workportal.widgets.decontextualized.plans', params);

        //Load templates
        self.loadTemplates({
            'plans.filters.wrapper': bizagi.getTemplate('bizagi.workportal.desktop.widget.decontextualized.plans.filters').concat('#plans-filter-wrapper')
        });

    },


    renderContent: function () {
        var self = this,
            data,
            filteredData = {},
            template;
        template = self.getTemplate('plans.filters.wrapper');
        data = self.getData();
        filteredData.items = data.items;
        self.content = template.render(filteredData);

        return self.content;
    },


    postRender: function () {
        var self = this;
        self.configureHandlers();
    },

    setSelectedFilter: function(item){
        $(item).addClass("wdg-ftr-selected").siblings().removeClass("wdg-ftr-selected");
    },

    onLoadPlansView: function(event, params){
        var self = this;
        self.setSelectedFilter($(".wdg-plan-filter-card[data-data='" + params.args.planState + "']", self.content));
    },

    configureHandlers: function () {
        var self = this,
            $content = self.getContent();
        $('.wdg-plan-filter-card', $content).on('click', $.proxy(self.onClickFilter, self));
        self.sub('PLANS-VIEW', $.proxy(self.onLoadPlansView, self));
    },

    clean: function () {
        var self = this,
            $content = self.getContent();

        if ($content) {
            $('.wdg-plan-filter-card', $content).off('click');
        }
        self.unsub('PLANS-VIEW', $.proxy(self.onLoadPlansView, self));
    },


    getData: function () {
        var self = this;
        return self.plansLinks.getData();
    },

    onClickFilter: function (ev) {
        var self = this,
            target = $(ev.target).closest('.wdg-plan-filter-card'),
            title = target.data('title'),
            data = target.data('data'),
            icon = data.toLowerCase();

        self.setSelectedFilter(target);

        var args = {
            histName: title,
            planState: data,
            level: 1
        };
        self.pub('notify', {
            type: 'PLANS-VIEW',
            args: $.extend(self.params, args)
        });
    }


});

bizagi.injector.register('bizagi.workportal.widgets.plans.filters', ['workportalFacade', 'dataService', bizagi.workportal.widgets.plans.filters]);
