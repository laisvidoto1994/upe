
/**
 *   Name: Bizagi Workportal Desktop Dashboard Controller
 *   Author: Mauricio Sánchez - Alexander Mejia
 */
bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.dashboard", {

    data: {
        "home": [{
            type: "cases",
            title: "workportal-widget-dashboard-cases",
            items: [{
                "title": "workportal-widget-dashboard-pendings-title",
                "iconclass": "pendings-ico",
                "icon": "watch-pending-outline",
                "data": "pendings"
            }, {
                "title": "workportal-widget-dashboard-favorites-title",
                "iconclass": "star-ico",
                "icon": "star-outline",
                "data": "following"
            }]
        }]
    }

}, {
    /**
     *   Constructor
     */
    init: function(workportalFacade, dataService, params) {
        var self = this;

        // Call base
        self._super(workportalFacade, dataService, params);

        //Load templates
        self.loadTemplates({
            "dashboard": bizagi.getTemplate("bizagi.workportal.desktop.widget.dashboard").concat("#dashboard-wrapper")
        });
    },

    /**
     * Renders the template defined in the widget
     */
    renderContent: function() {
        var self = this,
            template;

        template = self.getTemplate("dashboard");
        self.content = template.render(self.getData());

        return self.content;

    },

    /**
     * returns data
     */
    getData: function() {
        var self = this,
            result = {},
            data = self.Class.data;


        var content = data.home.slice(0);

        result.home = $.map(content, function(item) {
            item.title = bizagi.localization.getResource(item.title);
            for (var i = 0, l = item.items.length; i < l; i++) {
                item.items[i].title = bizagi.localization.getResource(item.items[i].title);
            }
            return item;
        });

        return result;

    },

    /**
     * links events with handlers
     */
    postRender: function() {
        var self = this,
            $content = self.getContent();

        $content.closest(".wdg-dash-board").on("click", ".wdg-db-card", $.proxy(self.onShowCases, self));
        $(window).trigger("resize");
    },

    /**
     *
     */
    clean: function() {
        var self = this,
            $content = self.getContent();

        if ($content) {
            $content.closest(".wdg-dash-board").off("click", ".wdg-db-card");
        }
    },

    /**
     * Shows the cases related to action clicked
     */
    onShowCases: function(ev) {
        var self = this,
            $target = $(ev.target),
            $route = $target.closest(".wdg-db-card").data("route");

        var $title = $target.closest(".wdg-db-card").find(".wdg-db-title");

        self.pub("notify", {
            type: "CASES-TEMPLATE-VIEW",
            args: {
                histName: $.trim($title.text()),
                page: 1,
                level: 2,
                route: $route,
                idworkflow: ""
            }
        });
    }
});
bizagi.injector.register("bizagi.workportal.widgets.dashboard", ["workportalFacade", "dataService", bizagi.workportal.widgets.dashboard]);
