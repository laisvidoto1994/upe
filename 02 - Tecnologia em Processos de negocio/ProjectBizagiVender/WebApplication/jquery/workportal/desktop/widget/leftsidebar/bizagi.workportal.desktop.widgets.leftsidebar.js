/**
 *   Name: Bizagi Workportal Left Sidebar
 *   Author: Elkin Fernando Siabato Cruz
 */
bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.left.sidebar", {}, {

    /**
     *   Constructor
     */
    init: function (workportalFacade, dataService, behaviorCollapsiblePanels, params) {
        var self = this;

        // Call base
        self._super(workportalFacade, dataService, params);
        self.behaviorCollapsiblePanels = behaviorCollapsiblePanels;
        //Load templates
        self.loadTemplates({
            "left-sidebar": bizagi.getTemplate("bizagi.workportal.desktop.widget.left.sidebar").concat("#leftsidebar-wrapper")
        });

    },

    /**
     * Renders the template defined in the widget
     */
    renderContent: function () {
        var self = this;
        var template = self.getTemplate("left-sidebar");
        self.content = template.render({});

        return self.content;
    },

    /**
     *
     */
    postRender: function () {
        var self = this;
        self.eventsHandler();
    },

    /**
     * Configure event handlers
     */
    eventsHandler: function(){
        var self = this;
        $(".ui-bizagi-wp-project-panel-collapse", self.content).on("click", $.proxy(self.onCollapsePanel, self));
    },

    /**
     *
     * @param event
     */
    onCollapsePanel: function(event) {
        var self = this;
        var $target = (event) ? $(event.currentTarget) : $("#project-collapse-leftpanel");
        var classSuffix = ($target.prop("id") === "project-collapse-rightpanel") ? "-rightpanel" : "-leftpanel";

        self.behaviorCollapsiblePanels.addClassesCollapseSideBar(self.content, classSuffix, false);

        self.publish("openCloseSidebar");
    },

    /**
     *
     */
    clean: function(){
        var self = this;
        $(".ui-bizagi-wp-project-panel-collapse", self.content).off("click", $.proxy(self.onCollapsePanel, self));
    }

});

bizagi.injector.register("bizagi.workportal.widgets.left.sidebar", ["workportalFacade", "dataService", "behaviorCollapsiblePanels", bizagi.workportal.widgets.left.sidebar], true);