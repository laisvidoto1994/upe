/**
 *   Name: Bizagi Workportal Right Sidebar
 *   Author: Elkin Fernando Siabato Cruz
 */
bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.right.sidebar", {}, {

    /**
     *   Constructor
     */
    init: function (workportalFacade, dataService, behaviorCollapsiblePanels, params) {
        var self = this;
        self.behaviorCollapsiblePanels = behaviorCollapsiblePanels;

        // Call base
        self._super(workportalFacade, dataService, params);
        //Load templates
        self.loadTemplates({
            "right-sidebar": bizagi.getTemplate("bizagi.workportal.desktop.widget.right.sidebar").concat("#rightsidebar-wrapper")
        });
    },

    /**
     * Renders the template defined in the widget
     */
    renderContent: function () {
        var self = this;
        var template = self.getTemplate("right-sidebar");
        self.content = template.render({});

        return self.content;
    },

    /**
     *
     */
    postRender: function () {
        var self = this;

        if (self.params && self.params.contextsRightSidebarCaseDashboard) {
            self.params.contextsRightSidebarCaseDashboard.forEach(function (context) {
                self.sub(context, $.proxy(self.updateView, self));
            });
        }
    },

    /**
     *
     * @param event
     * @param params
     */
    updateView: function (event, params) {
        var self = this;

        self.enableOrDisableRightSidebar(params.context);
        self.eventsHandler();
    },

    /**
     *
     * @param event
     */
    onCollapsePanel: function(event) {
        var self = this;
        var $target = (event) ? $(event.currentTarget) : $("#project-collapse-rightpanel");
        var classSuffix = "-rightpanel";

        self.behaviorCollapsiblePanels.addClassesCollapseSideBar(self.content, classSuffix, false);

        if($target.closest(".ui-bizagi-wp-project-open-rightpanel").length > 0){
            self.pub("notify", {
                type: "EXPANDED_RIGHT_SIDEBAR"
            });
        }

        self.publish("openCloseSidebar");
    },

    /**
     *
     */
    disableSidebar: function(){
        $("#ui-bizagi-wp-project-homeportal-main").addClass("disabled-right-sidebar");
        $("#ui-bizagi-wp-project-homeportal-main").removeClass("enabled-right-sidebar");
    },

    /**
     *
     */
    enableSidebar: function(){
        $("#ui-bizagi-wp-project-homeportal-main").removeClass("disabled-right-sidebar");
        $("#ui-bizagi-wp-project-homeportal-main").addClass("enabled-right-sidebar");
    },

    /**
     *
     */
    openRightSidebar: function(){
        var self = this;
        self.behaviorCollapsiblePanels.addClassesCollapseSideBar(self.content, "-rightpanel", true);
    },

    /**
     *
     * @param currentContext
     */
    enableOrDisableRightSidebar: function(currentContext){
        var self = this;

        var setDisabledSidebar = false;
        self.params.contextsWithoutRightSidebarCaseDashboard.forEach(function(context){
            if(context === currentContext){
                self.disableSidebar();
                setDisabledSidebar = true;
            }
        });
        if(setDisabledSidebar === false){
            self.enableSidebar();
        }
    },

    /**
     * Configure event handlers
     */
    eventsHandler: function(){
        var self = this;
        $(".ui-bizagi-wp-project-panel-collapse", self.content).off("click", $.proxy(self.onCollapsePanel, self));
        $(".ui-bizagi-wp-project-panel-collapse", self.content).on("click", $.proxy(self.onCollapsePanel, self));

        self.sub("OPEN_RIGHT_SIDEBAR", $.proxy(self.openRightSidebar, self));
        self.sub("DISABLED_RIGHT_SIDEBAR", $.proxy(self.disableSidebar, self));
        self.sub("ENABLED_RIGHT_SIDEBAR", $.proxy(self.enableSidebar, self));
    },

    /**
     *
     */
    clean: function(){
        var self = this;
        if(self.params && self.params.contextsRightSidebarCaseDashboard){
            self.params.contextsRightSidebarCaseDashboard.forEach(function(context){
                self.unsub(context, $.proxy(self.updateView, self));
            });
        }
        $(".ui-bizagi-wp-project-panel-collapse", self.content).off("click", $.proxy(self.onCollapsePanel, self));

        self.unsub("OPEN_RIGHT_SIDEBAR", $.proxy(self.openRightSidebar, self));
        self.unsub("DISABLED_RIGHT_SIDEBAR", $.proxy(self.disableSidebar, self));
        self.unsub("ENABLED_RIGHT_SIDEBAR", $.proxy(self.enableSidebar, self));
    }

});

bizagi.injector.register("bizagi.workportal.widgets.right.sidebar", ["workportalFacade", "dataService", "behaviorCollapsiblePanels", bizagi.workportal.widgets.right.sidebar], true);