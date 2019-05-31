/**
 *   Name: Bizagi Workportal Desktop Navigator Controller
 *   Author: Mauricio Sánchez - Alexander Mejia
 */
bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.navigator", {}, {
    /**
     *   Constructor
     */
    init: function (workportalFacade, dataService, accumulatedcontext, params) {
        var self = this;
        // Call base
        self._super(workportalFacade, dataService, params);
        self.flagDisplayDate = true;
        self.printFormCommand = new bizagi.workportal.command.printform(self.workportalFacade);
        self.fromClickBreadCrumb = false;
        self.caseLink = params.caseLink;
        //Load templates
        self.loadTemplates({
            "navigator": bizagi.getTemplate("bizagi.workportal.desktop.widget.navigator").concat("#navigator-wrapper"),
            "child": bizagi.getTemplate("bizagi.workportal.desktop.widget.navigator").concat("#navigator-child")
        });
        self.accumulatedcontext = accumulatedcontext;
    },

    /**
     * Renders the template defined in the widget
     */
    renderContent: function () {       
        var self = this;
        var template = self.getTemplate("navigator");
        self.content = template.render($.extend(self.getDataObj(), {security: bizagi.menuSecurity}));
        bizagi.navigator = bizagi.navigator || {info: {}};
        self.info = bizagi.navigator.info;
        self._level = Object.keys(self.info).length - 1;
        $(".navbar-print", self.content).on("click", $.proxy(self.printCase, self));
        $(".navbar-back", self.content).on("click", $.proxy(self.goToBack, self));
        return self.content;
    },
    /**
     * links events with handlers
     */
    postRender: function () {
        var self = this;
        var content = self.getContent();
        var $container = content.find("ul");
        self.sub("NAVIGATE", $.proxy(self.refresh, self));
        self.sub("UPDATE_LASTCRUMBPARAMS_INFO", $.proxy(self.updateLastCrumbParamsInfo, self));
        self.sub("NAVIGATOR_GETLEVEL", function(){
            return self.getLevel();
        });
        self.sub("NAVIGATOR_BACK", $.proxy(self.goToPreviousCrumb, self));
        $container.on("click", "li", $.proxy(self.crumbEvent, self));
    },

    getBreadCrumbInfo: function () {
        return bizagi.navigator.info;
    },

    setBreadCrumbInfo: function (info) {
        bizagi.navigator.info = info
    },

    drawBreadCrumb: function (breadCrumbInfo, showSteps) {
        var self = this;
        var template = self.getTemplate("navigator");
        $(self.content).find("ul").html('');
        if (showSteps) {
            for (var i = -1; i < Object.keys(breadCrumbInfo).length - 1; i += 1) {
                var crumbItem = breadCrumbInfo[i];
                crumbItem.surrogateKey = i;
                var crumbContent = self.drawCrumb(crumbItem);
                $(self.content).find("ul").append(crumbContent);
            }
        }
    },

    drawCrumb: function (itemCrumb) {
        var self = this;
        var name = itemCrumb.args.histName;
        var isPrincipalHome = false;
        var template = self.getTemplate("child");
        var child = template.render({
            surrogateKey: itemCrumb.surrogateKey,
            name: name,
            isPrincipalHome: isPrincipalHome
        });
        return child;
    },
    crumbEvent: function (event) {
        var self = this;
        var itemCrumb = self.info[$(event.target).data("surrogatekey")];
        self.goToCrumb(itemCrumb);
    },

    goToCrumb: function (crumb) {
        var self = this;
        if (crumb) {
            var args = crumb.args;
            var skipRefresh = false;
            var contextActivity = this.getParentContext(crumb.context);
            if (contextActivity == "TEMPLATEENGINE-VIEW" || contextActivity == "SEARCH-ENGINE-VIEW") {
                skipRefresh = true;
            }
            this.deleteRemainingCrumbs(crumb);
            self.pub("notify", {
                skipRefresh: skipRefresh,
                type: contextActivity,
                args: $.extend(args, {showContextByMenuDashboard: contextActivity})
            });
        }
    },

    goToPreviousCrumb: function () {
        var self = this;
        var pathSize = Object.keys(self.info).length;
        var crumbBack = self.info[pathSize - 3];
        if (!crumbBack) {
            crumbBack = self.info[pathSize - 2];
        }
        self.goToCrumb(crumbBack);
    },

    deleteRemainingCrumbs: function (itemCrumb) {
        var self = this;
        $.each(self.info, function (key, crumbItem) {
            if (itemCrumb.surrogateKey < parseInt(key, 10)) {
                delete self.info[key];
            }
        });
    },

    getParentContext: function (context) {        
        if (context === "OVERVIEW" || context === "COMMENTS" || context === "FILES" || context === "TIMELINE") {
            return "ACTIVITY";
        }
        else if (context === "ACTIVITYPLANOVERVIEW" || context === "ACTIVITYPLANCOMMENTS" || context === "ACTIVITYPLANFILES" || context === "ACTIVITYPLANTIMELINE") {
            return "ACTIVITYPLAN";
        }
        else if (context === "PLANSIDEBAR" || context === "EDITACTIVITY" || context === "PLANACTIVITIES" || context === "PLANCOMMENTS" || context === "PLANFILES" || context === "PLANTIMELINE") {
            return "PLANACTIVITIES";
        }
        return context;
    },

    resetBreadCrumb: function (params) {
        var self = this;
        self.info = {};
        self.info[-1] = self.copyDataObjectWithoutReference(params);
    },

    updateInfo: function (params) {
        var self = this;
        var pathSize = Object.keys(self.info).length;
        if(params.args.level && params.args.level < pathSize && params.args.level > 0){
            for(var j = params.args.level - 1; j < pathSize - 1; j += 1){
                delete self.info[j];
            }
            pathSize = params.args.level;
        }

        var lastCrumb = self.info[pathSize - 2];
        var secondLastCrumb = self.info[pathSize - 3];
        if (params.context == "HOME" || (params.context === "SEARCH-ENGINE-VIEW" && typeof params.args.reference === "undefined")) {//reset breadCrumb
            this.resetBreadCrumb(params);//clean breadcrumb and add new item with entity name
        }
        else if (params.context == "ACTIVITY" || params.context == "ACTIVITYPLAN") {
            if (secondLastCrumb && self.getParentContext(params.context) == self.getParentContext(secondLastCrumb.context)) {
                self.cleanBreadCumb(secondLastCrumb, params, 3);
            } else if (lastCrumb && self.getParentContext(params.context) == self.getParentContext(lastCrumb.context)) {
                self.cleanBreadCumb(lastCrumb, params, 2);
            } else {
                self.info[pathSize - 1] = self.copyDataObjectWithoutReference(params);
            }
        }
        else if (params.context == "TEMPLATEENGINE-VIEW" || params.context === "SEARCH-ENGINE-VIEW") {
            var firstCrumb = self.info[-1];
            if (firstCrumb && firstCrumb.context != "TEMPLATEENGINE-VIEW" &&
                firstCrumb.context != "SEARCH-ENGINE-VIEW" &&
                firstCrumb.context != "HOME") {
                self.info = {};
                pathSize = Object.keys(self.info).length;
                lastCrumb = null;
            }
            if (params.args.referenceType == "FACT" || params.args.referenceType == "VIRTUAL") {
                var factCrumbItem = self.hasGuidEntityInBreadCrumb(params.args.guidEntityCurrent);
                var newFactCrumbItem = self.copyDataObjectWithoutReference(params);
                if (params.args.level == 1) {
                    self.info = {};
                    self.info[-1] = newFactCrumbItem;
                }
                else if (lastCrumb && lastCrumb.args && lastCrumb.args.level == params.args.level) {
                    self.cleanBreadCumb(lastCrumb, params, 2);
                }else if (!factCrumbItem){
                    self.info[pathSize - 1] = newFactCrumbItem;
                }else{
                    newFactCrumbItem.surrogateKey = factCrumbItem.surrogateKey;
                    self.info[newFactCrumbItem.surrogateKey] = newFactCrumbItem;
                    self.deleteRemainingCrumbs(newFactCrumbItem);
                }
            } else  if(params.args.referenceType == "ENTITY"){
                if(params.args.eventType != "DATA-NAVIGATION" && !self.hasXpathInBreadCrumb(params.args.xpath) ){
                    self.info[pathSize - 1] = self.copyDataObjectWithoutReference(params);
                }
            }
        }
        else {
            if (lastCrumb && self.getParentContext(params.context) == self.getParentContext(lastCrumb.context)) {
                self.cleanBreadCumb(lastCrumb, params, 2);
            } else {
                self.info[pathSize - 1] = self.copyDataObjectWithoutReference(params);
            }
        }
        self.setBreadCrumbInfo(self.info);
    },

    updateLastCrumbParamsInfo: function (event, params){
        var self = this;
        var pathSize = Object.keys(self.info).length;
        if(pathSize > 0){
            $.extend(self.info[pathSize - 2].args, self.copyDataObjectWithoutReference(params.args));
        }
    },

    hasXpathInBreadCrumb: function (xpath) {
        var self = this;
        for (var i = -1; i < Object.keys(bizagi.navigator.info).length - 1; i += 1) {
            var crumbItem = bizagi.navigator.info[i];
            if (crumbItem.args.xpath == xpath) {
                return true;
            }
        }
        return false;
    },

   hasGuidEntityInBreadCrumb: function (guidEntity){
       var self = this;
       for (var i = -1; i < Object.keys(bizagi.navigator.info).length - 1; i += 1) {
           var crumbItem = bizagi.navigator.info[i];
           if (crumbItem.args.guidEntityCurrent == guidEntity) {
               return crumbItem;
           }
       }
       return false;
   },

    cleanBreadCumb: function (crumb, params, steps) {
        var self = this;
        var pathSize = Object.keys(self.info).length;
        crumb = self.copyDataObjectWithoutReference(params);
        self.info[pathSize - steps] = crumb;
        this.deleteRemainingCrumbs(crumb);
    },

    drawDateNavigator: function (params) {
        var self = this;
        var currentLevel = Object.keys(self.info).length;
        var showDateNavigator = (currentLevel == 1);
        if (params.args.showDateNavigator === false) {
            showDateNavigator = false;
        }
        self.onDisplayDate(showDateNavigator);
    },

    //Events for recalculate width of home-navbar (back, print, etc.)
    recalculateHomeNavbar: function (params) {
        var self = this;
        if (params.context != "TEMPLATEENGINE-VIEW" || params.context != "SEARCH-ENGINE-VIEW") {
            self.setWidthToNavigationPanel();
            $(window).resize(function () {
                self.setWidthToNavigationPanel();
            });
            self.subscribe("openCloseSidebar", function () {
                self.setWidthToNavigationPanel();
            });
            if(params.context == "HOME"){
                $("#ui-bizagi-wp-project-homeportal-main").addClass("disabled-right-sidebar");
                $("#ui-bizagi-wp-project-homeportal-main").removeClass("enabled-right-sidebar");
            }
        }
    },

    setWidthToNavigationPanel: function(){
        var self = this;
        var navigationPanel = self.content.parent();
        $(self.content, navigationPanel).width($(navigationPanel).width() + 60);
    },

    setEnabledLeftSidebar: function (params) {
        var self = this;
        if (params.data && params.data.belongs) {
            if (params.data.belongs.toLeftSidebarCD) {
                $("#ui-bizagi-wp-project-homeportal-main").addClass("enabledLeftSidebar");
            }
            else {
                $("#ui-bizagi-wp-project-homeportal-main").removeClass("enabledLeftSidebar");
            }
        }
    },

    setEnabledRightSidebar: function (params) {
        var self = this;
        if (params.data && params.data.belongs) {
            if (params.data.belongs.toRightSidebarCD) {
                $("#ui-bizagi-wp-project-homeportal-main").removeClass("disabled-right-sidebar");
                $("#ui-bizagi-wp-project-homeportal-main").addClass("enabled-right-sidebar");
            }
            else {
                $("#ui-bizagi-wp-project-homeportal-main").removeClass("enabled-right-sidebar");
                $("#ui-bizagi-wp-project-homeportal-main").addClass("disabled-right-sidebar");
            }
        }
    },

    //Show back button only in activity or plan context
    setEnabledBreadCrumb: function (params) {
        var self = this;
        if (params.context == "ACTIVITY" || params.context == "ACTIVITYPLAN") {
            self.setEnabledBackButton();
            $(".nav-items-ctn", self.content).hide();
            $(".nav-items-ctn", self.content).removeClass("toLeft");
            $(".nav-items-ctn", self.content).addClass("clearfix");
        }
        else {
            $(".navbar-back", self.content).hide();
            $(".nav-items-ctn", self.content).show();
            $(".nav-items-ctn", self.content).addClass("toLeft");
            $(".nav-items-ctn", self.content).removeClass("clearfix");
        }
    },

    /**
     * Hide back button if from caseLink, only one time.
     */
    setEnabledBackButton: function(){
        var self = this;
        if(self.caseLink === true){
            self.caseLink = false;
            $(".navbar-back", self.content).hide();
        }
        else{
            $(".navbar-back", self.content).show();
        }
    },

    /**
     * Return actual level.
     */
    getLevel: function () {
        var self = this;
        return Object.keys(self.info).length;
    },

    refresh: function (ev, params) {
        var self = this;
        var args = params.args || {};
        var data = params.data;
        self.params = params.args;
        this.recalculateHomeNavbar(params);
        this.setEnabledLeftSidebar(params);
        this.setEnabledRightSidebar(params);
        this.setEnabledBreadCrumb(params);
        if (params.context == "ACTIVITY" || params.context == "ACTIVITYPLAN") {
            params.args.histName = self.getActivityName(params);
        }

        self.setStateBarNavigator(params.context);

        if(!params.skipRefresh){
            if (params.args.histName && params.args.histName != "") {
                self.updateInfo(params);
            }
        }
        var showSteps =  params.args.eventType != "DATA-NAVIGATION";
        self.drawBreadCrumb(self.info,showSteps);
        self.drawDateNavigator(params);      
    },

    goToBack: function () {
        var self = this;
        if (bizagi && bizagi.referrerParams) {
            var widget = bizagi.referrerParams.referrer || bizagi.cookie('bizagiDefaultWidget');
            if (widget == "queryform") {
                widget = bizagi.workportal.currentInboxView || "inboxGrid";
            }
            // switch referer widget
            switch (widget) {
                case "inbox":
                    self.publish("changeWidget", {
                        widgetName: widget,
                        restoreStatus: true
                    });
                    break;
                case "inboxGrid":
                    self.publish("changeWidget", {
                        widgetName: widget,
                        restoreStatus: true
                    });
                    break;
                case "homeportal":
                    self.goToPreviousCrumb();
                    break;
                case "search":
                    self.publish("executeAction", {
                        action: bizagi.workportal.actions.action.BIZAGI_WORKPORTAL_ACTION_SEARCH,
                        radNumber: bizagi.referrerParams.radNumber || "",
                        page: bizagi.referrerParams.page || 1,
                        onlyUserWorkItems: false
                    });
                    break;
                case "queryform":
                    self.publish("showDialogWidget", {
                        widgetName: bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_QUERYFORM,
                        queryFormAction: "loadPrevious"
                    });
                    break;
                case "folders":
                    var url = bizagi.referrerParams.urlParameters + "&page=" + bizagi.referrerParams.page;
                    $.when(self.dataService.getCasesByFolder(url))
                        .done(function (data) {
                            data.customized = true;
                            data.urlParameters = bizagi.referrerParams.urlParameters;
                            // Define title of widget
                            data.title = bizagi.referrerParams.name;
                            // Set a flag here to tell the search widget that must show the ungroup case from folder (icon).
                            data.casesGroupedByFolder = true;
                            data.idFolder = bizagi.referrerParams.id;
                            self.publish("changeWidget", {
                                widgetName: bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_SEARCH,
                                data: data,
                                referrerParams: {}
                            });
                        });
                    break;
                default:
                    self.publish("changeWidget", {
                        widgetName: bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_INBOX,
                        restoreStatus: true
                    });
                    break;
            }
        }
    },

    getActivityName: function (params) {
        var activityName;
        var idWorkItem = params.args.idWorkitem;
        for (var i = 0; i < params.args.currentState.length; i++) {
            var state = params.args.currentState[i];
            if (state && state.idWorkItem == idWorkItem) {
                if (state.displayName) {
                    activityName = state.displayName;
                }
                else if (state.state) {
                    activityName = state.state;
                }
                break;
            }
        }
        return activityName;//+ '-' + params.args.radNumber;
    },

    /**
     *
     * @param event
     * @param params
     */
    setStateBarNavigator: function(context){
        var self = this;
        if (context == "ACTIVITY" || context == "ACTIVITYPLAN") {
            self.showButtonPrintForm(true);
            self.flagDisplayDate = false;
            self.onDisplayDate(false);
        }
        else {
            self.showButtonPrintForm(false);
            self.flagDisplayDate = true;
            self.onDisplayDate(true);
        }
    },

    getDataObj: function () {
        var self = this,
            regional = self.getResource("datePickerRegional"),
            currentDate = new Date(),
            currentDay = regional.dayNames[currentDate.getDay()],
            currentMonth = regional.monthNames[currentDate.getMonth()];

        return {
            "date": currentDay + ", " + currentMonth + " " + currentDate.getDate() + ", " + currentDate.getFullYear()
        };
    },

    /**
     * Copy object by value, not reference
     */
    copyDataObjectWithoutReference: function(params){
        return $.extend(true, {}, params);
    },
    /**
     *
     * @param show
     */
    showButtonPrintForm: function(show){
        var self = this;
        var $content = self.getContent();
        var $wrapperButtonPrint = $content.find(".navbar-print");

        if(show === true){
            $wrapperButtonPrint.show();
        }
        else{
            $wrapperButtonPrint.hide();
        }
    },

    /**
     *
     */
    printCase: function(){
        var self = this;
        var printParams = { idCase: self.params.idCase,
            idWorkitem: self.params.idWorkitem,
            idTask: self.params.idTask
        };

        self.printFormCommand.print(printParams);
    },

    /**
     * Hides the date displayed in the widget
     */
    onDisplayDate: function (show) {
        var self = this,
            $content = self.getContent(),
            $date = $content.find(".navbar-date");

        if (show && self.flagDisplayDate) {
            $date.show();
        }
        else {
            $date.hide();
        }
    },

    /**
     * Clean widget
     */
    clean : function() {
        var self = this;
        var $content = self.getContent();
        if ($content){
            var $container = $content.find("ul");

            self.unsub("UPDATE_LASTCRUMBPARAMS_INFO");
            self.unsub("NAVIGATE");
            self.unsub("NAVIGATOR_GETLEVEL");
            self.unsub("NAVIGATOR_BACK");
            $container.off("click", "li");

            $(".navbar-print", self.content).off("click", $.proxy(self.printCase, self));
        }
    }
});

bizagi.injector.register("bizagi.workportal.widgets.navigator", ["workportalFacade", "dataService", "accumulatedcontext", bizagi.workportal.widgets.navigator]);
