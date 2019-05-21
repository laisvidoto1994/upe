/**
 *   Name: Bizagi Workportal Desktop Filter Cases Widget
 *   Author: Elkin Fernando Siabato Cruz
 */
bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.filtercases", {}, {

    /**
     *   Constructor
     */
    init: function (workportalFacade, dataService, params) {
        var self = this;

        // Call base
        self._super(workportalFacade, dataService, params);

        self.lastIdworkflow;

        //Load templates
        self.loadTemplates({
            "filtercases": bizagi.getTemplate("bizagi.workportal.desktop.widget.filtercases").concat("#filtercases-wrapper")
        });
    },

    /**
     * Renders the template defined in the widget
     */
    renderContent: function (event, params) {
        var self = this;
        var template = self.getTemplate("filtercases");
        self.content = template.render({});
        return self.content;
    },

    /**
     * links events with handlers
     */
    postRender: function (event, params) {
        var self = this;
        var $contentWidget = self.getContent();
        $("li.ui-bizagi-wp-app-inbox-tab", $contentWidget).on("click", $.proxy(self.onClickButtonFilter, self));
        self.sub("CASES-TEMPLATE-VIEW", $.proxy(self.updateUI, self));
    },

    /**
     *
     * @param event
     */
    onClickButtonFilter: function(event){
        var self = this;
        var $target = $(event.currentTarget);

        if(!$target.hasClass("active")){
            var auxDescriptionColorResourceName = "workportal-widget-inboxcommon-filter-";
            var route = $target.attr("id");
            var idworkflow = self.pub("notify", { type: "GETIDWORKFLOW_FROM_PROCESSESLIST"})[0];
            var histName;

            $target.addClass("active").siblings().removeClass("active");

            if(route === "pendings"){
                histName = self.pub("notify", { type: "GETHISTNAME_FROM_PROCESSESLIST"})[0];
            }
            else{
                var resourceLocalization = auxDescriptionColorResourceName + route.toLowerCase();
                histName = bizagi.localization.getResource(resourceLocalization);
            }

            self.lastIdworkflow = idworkflow;

            self.pub("notify", {
                type: "CASES-TEMPLATE-VIEW",
                args : {
                    histName: histName,
                    page: 1,
                    refreshLastItemBreadcrumb: false,
                    route : route,
                    idworkflow : idworkflow || ""
                }
            });

        }
    },

    /**
     *
     * @param event
     * @param params
     */
    updateUI: function(event, params){
        var self = this;

        if(params.args.route === "following"){
            $(self.content).hide();
        }
        else{
            $(self.content).show();
        }
        if(params.args.idworkflow != (self.lastIdworkflow || "")){
            $(".ui-bizagi-wp-app-inbox-tab:first-child").addClass("active").siblings().removeClass("active");
        }
    },

    /**
     *
     */
    clean: function(){
        var self = this;
        self.unsub("CASES-TEMPLATE-VIEW");
    }
});

bizagi.injector.register("bizagi.workportal.widgets.filtercases", ["workportalFacade", "dataService", bizagi.workportal.widgets.filtercases]);