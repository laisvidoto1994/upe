/**
 *   Name: Bizagi Workportal Desktop Processes list controller
 *   Author: Danny Gonzalez
 */
bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.processeslist", {}, {

    /**
     * Constructor
     * @param workportalFacade instance of facade, mandatory
     * @param dataService instance of service tier, mandatory
     * @param params extra params, its not mandatory
     */
    init: function (workportalFacade, dataService, params) {
        var self = this;
        self.params = params;
        // Call base
        self._super(workportalFacade, dataService, params);

        self.idworkflow = params.idworkflow; //Save current idworkflow
        self.histName = params.histName; //Save current histName

        //Load templates
        self.loadTemplates({
            "processeslist": bizagi.getTemplate("bizagi.workportal.desktop.widget.processeslist").concat("#processeslist-wrapper"),
            "processeslistEmptyData": bizagi.getTemplate("bizagi.workportal.desktop.widget.processeslist").concat("#processeslist-empty-message")
        });
    },

    /**
     * Renders the template defined in the widget
     * @return {string} html
     */
    renderContent: function () {
        var self = this,
            template = self.getTemplate("processeslist");

        return $.when(self.getData()).done(function(data){
            self.content = data.length > 0 ? template.render({ processes: data }) : self.getEmptyDataMessage().render({});
            self.setSelectedList($(".wdg-process-card:first", self.getContent()));
        });
    },

    /**
     * links events with handlers
     */
    postRender: function () {
        var self = this;
        self.configureHandlers();

        self.sub("GETIDWORKFLOW_FROM_PROCESSESLIST", function(){
            return self.getIdworkflow();
        });
        self.sub("GETHISTNAME_FROM_PROCESSESLIST", function(){
            return self.getHistname();
        });
    },

    /**
     * Binds events to handles
     */
    configureHandlers: function () {
        var self = this,
            $content = self.getContent();
        $(".wdg-process-card", $content).on("click", $.proxy(self.onClickProcess, self));
    },

    /**
     * Call to all processes in my activities
     * @return {object} data
     */
    getData: function () {
        var self = this,
            $args = {},
            $route = self.params.route;

        switch ($route) {
            case "pendings":
                $args = {
                    "taskState": "all",
                    "myPendings": true
                };
                break;
            case "following":
                $args = {
                    "taskState": "all",
                    "myActivities": true,
                    "onlyFavorites": true
                };
                break;
            case "Green":
            case "Red":
            case "Yellow":
                $args = {
                    "taskState": $route
                };
                break;
        }
        return self.dataService.getAllProcesses($args).then(function (data) {
            return self.getInfoToProcessesList(data);
        });
    },

    /**
     * Organize all data to processes in my activities
     * @param data
     * @returns {{cases}}
     */
    getInfoToProcessesList: function (data) {
        var allProcesses = data.categories,
            processes = [],
            cases = [];

        for (var i = 0, l = allProcesses.length; i < l; i++) {
            processes = allProcesses[i].workflows;
            for (var j = 0, k = processes.length; j < k; j++) {
                cases.push({
                    process: processes[j].name,
                    idworkflow: processes[j].idworkflow
                });
            }
        }
        return cases;
    },

    /**
     * event listener for each action in the processes list
     * @param ev
     */
    onClickProcess: function (ev) {
        var self = this,
            params = bizagi.clone(self.params),
            $target = $(ev.target).closest(".wdg-process-card");
        self.setSelectedList($target);

        self.idworkflow = $target.data("idworkflow");
        self.histName = $target.data("title");

        self.pubDeadLockDetection("notify", {
            type: "CASES-TEMPLATE-VIEW",
            args: $.extend(params, {
                histName: self.histName,
                level: 3,
                idworkflow: self.idworkflow
            })
        });
    },

    /**
     *
     * @returns {*}
     */
    getIdworkflow: function (){
        var self = this;
        return self.idworkflow;
    },

    /**
     *
     * @returns {*}
     */
    getHistname: function(){
        var self = this;
        return self.histName;
    },

    /**
     *
     * @param item
     */
    setSelectedList: function(item){
        var self = this;
        $(item).addClass("wdg-plst-selected").siblings().removeClass("wdg-plst-selected");
    },

    /**
     * Gets Message when there are not data
      * @returns {processeslistEmptyData}
     */
     getEmptyDataMessage: function () {
        var self = this,
            processeslistEmptyData = self.getTemplate("processeslistEmptyData");

        return processeslistEmptyData;
    },

    /**
     * Detach handlers
     */
    clean: function () {
        var self = this,
            $content = self.getContent();

        if ($content) {
            $(".wdg-process-card", $content).off("click");
        }

        self.unsub("GETIDWORKFLOW_FROM_PROCESSESLIST");
        self.unsub("GETHISTNAME_FROM_PROCESSESLIST");
    }
});

bizagi.injector.register("bizagi.workportal.widgets.processeslist", ["workportalFacade", "dataService", bizagi.workportal.widgets.processeslist], true);