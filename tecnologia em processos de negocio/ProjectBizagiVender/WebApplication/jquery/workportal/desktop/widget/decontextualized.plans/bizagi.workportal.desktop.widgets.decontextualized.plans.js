/*
 *   Name: Bizagi Workportal Desktop descontextualized plans Controller
 *   Author: Iván Ricardo Taimal Narváez
 */

bizagi.workportal.widgets.widget.extend('bizagi.workportal.widgets.decontextualized.plans', {
    data: {
        title: 'workportal-widget-dashboard-decontextualized-plans-title',
        items: [
            {
                'title': 'workportal-widget-dashboard-decontextualized-plans-pendings-title',
                'description': 'workportal-widget-dashboard-decontextualized-plans-pendings-description',
                'iconclass': 'star-ico',
                'icon': 'pending',
                'data': 'PENDING'
            },
            {
                'title': 'workportal-widget-dashboard-decontextualized-plans-running-title',
                'description': 'workportal-widget-dashboard-decontextualized-plans-running-description',
                'iconclass': 'star-ico',
                'icon': 'executing',
                'data': 'EXECUTING'
            },
            {
                'title': 'workportal-widget-dashboard-decontextualized-plans-completed-title',
                'description': 'workportal-widget-dashboard-decontextualized-plans-completed-description',
                'iconclass': 'star-ico',
                'icon': 'closed',
                'data': 'CLOSED'
            }
        ]
    }
}, {
    /**
     *   Constructor
     * @param workportalFacade
     * @param dataService
     * @param params
     */
    init: function (workportalFacade, dataService, params) {
        var self = this;

        // Call base
        self._super(workportalFacade, dataService, params);

        //Load templates
        self.loadTemplates({
            'decontextualized.plans': bizagi.getTemplate('bizagi.workportal.desktop.widget.decontextualized.plans').concat('#plans-wrapper')
        });
    },

    /**
     * Renders the template defined in the widget
     * @return {*}
     */
    renderContent: function () {
        var self = this,
            template,
            data,
            filteredData = {};
        template = self.getTemplate("decontextualized.plans");

        if(bizagi.menuSecurity.Plans){
            data = self.getData();
            filteredData.title = data.title;
            self.content = template.render(data);
        }
        else{
            self.content = $("<div></div>")
        }

        return self.content;
    },

    /**
     * links events with handlers
     */
    postRender: function () {
        var self = this,
            $content = self.getContent();
        $.when(self.getServerDateDifference()).then(function (resolveGetDateServer) {});
        $('.wdg-plans-card', $content).on('click', $.proxy(self.onClickCard, self));
    },

    /**
     * Gets data, Fact entities related with stakeholders
     * @return {{}}
     */
    getData: function () {
        var self = this,
            result = {},
            data = self.Class.data;
        result.items = $.map(data.items, function (item) {
            item.title = bizagi.localization.getResource(item.title);
            item.description = bizagi.localization.getResource(item.description);
            return item;
        });
        result.title = bizagi.localization.getResource(data.title);
        return result;
    },


    /**
     * Raises the execution of templates for the entity selected
     * @param ev
     */
    onClickCard: function (ev) {
        var self = this,
            target = $(ev.target).closest('.wdg-plans-card'),
            title = target.data('title'),
            data = target.data('data');
        var args = {
            histName: title,
            planState: data,
            flowContext: 'FLOW-DECONTEXTUALIZED-PLANS',
            isOpen: true,//TODO  fix state for decontextualized plans,
            level:1
        };
        self.pub('notify', {
            type: 'PLANS-VIEW',
            args: $.extend(self.params,args)
        });
    },

    /**
     *
     * @returns {*}
     */
    getServerDateDifference: function () {
        var self = this;
        return self.dataService.getDateServer().done(function (response) {
            self.params.differenceMillisecondsServer = bizagi.util.dateFormatter.getDifferenceBetweenDates(new Date(), new Date(response.date), 'milliseconds');
        });
    },

    /**
     * Detach events linked
     */
    clean: function () {
        var self = this,
           $content = self.getContent();

        if ($content) {
            $('.wdg-plans-card', $content).off('click');
        }
    }
});

bizagi.injector.register('bizagi.workportal.widgets.decontextualized.plans', ['workportalFacade', 'dataService', bizagi.workportal.widgets.decontextualized.plans]);
