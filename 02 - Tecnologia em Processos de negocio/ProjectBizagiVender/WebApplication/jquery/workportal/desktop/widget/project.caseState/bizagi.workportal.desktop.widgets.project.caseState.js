/*
 *   Name: Bizagi Workportal Desktop Project Case State Controller
 *   Author: Elkin Fernando Siabato Cruz
 */

bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.project.caseState", {}, {
    /*
     *   Constructor
     */
    init: function (workportalFacade, dataService, params) {
        var self = this;

        // Call base
        self._super(workportalFacade, dataService, params);

        self.contextsSidebarActivity = params.contextsSidebarActivity;

        //Regional
        self.datePickerRegional = bizagi.localization.getResource("datePickerRegional");

        //Load templates
        self.loadTemplates({
            "project-caseState": bizagi.getTemplate("bizagi.workportal.desktop.widget.project.caseState").concat("#project-caseState-wrapper"),
            "project-caseState-popup-release": bizagi.getTemplate("bizagi.workportal.desktop.widget.project.caseState").concat("#project-caseState-popup-release"),
            "project-caseState-remaining": bizagi.getTemplate("bizagi.workportal.desktop.widget.project.caseState").concat("#project-caseState-remaining")
        });

        self.releaseDialogBox = {};
    },

    /**
     * Renders the template defined in the widget
     */
    renderContent: function () {
        var self = this;
        self.content = $("<div></div>");

        self.releaseDialogBox.formContent = self.getTemplate("project-caseState-popup-release").render({});

        return self.content;
    },

    /*
     * links events with handlers
     */
    postRender: function () {
        var self = this;
        var cntxtSidebarActivity =   self.contextsSidebarActivity || [];
        //Handlers
        cntxtSidebarActivity.forEach(function(context){
            self.sub(context, $.proxy(self.updateView, self));
        });

        self.plugins = {};
        self.plugins.popupRelease = {
            form: {
                buttonAccept: $("#button-accept-release", self.releaseDialogBox.formContent),
                buttonCancel: $("#button-cancel-release", self.releaseDialogBox.formContent)
            }
        };

        self.plugins.popupRelease.form.buttonAccept.on("click", $.proxy(self.onClickAcceptRelease, self));
        self.plugins.popupRelease.form.buttonCancel.on("click", $.proxy(self.onClickCancelRelease, self));

    },

    /**
     * Update view when load case
     * @param event
     * @param params
     */
    updateView: function (event, params) {
        var self = this;
        $.extend(self.params, params.args);
        var args = params.args;
        self.getContent().empty();

        var argsTemplate = {};

        //is Favorite Case
        argsTemplate.isFavoriteCase = "off";
        if (args.isFavorite && JSON.parse(args.isFavorite)) {
            argsTemplate.isFavoriteCase = "bz-icon-star";
        }
        else{
            argsTemplate.isFavoriteCase = "bz-icon-star-outline";
        }

        self.showCaseNumber(args, argsTemplate);

        //Begin Calculated Remaining Date
        if(args.creationDate){
            var INVARIANT_FORMAT = "MM/dd/yyyy H:mm";
            var creationDate = args.creationDate;
            var creationDateObject = bizagi.util.dateFormatter.getDateFromFormat(creationDate, INVARIANT_FORMAT);
            argsTemplate.creationDateFormat = self.getFormattedDate(creationDateObject);

            var solutionDateObject = bizagi.util.dateFormatter.getDateFromFormat(args.solutionDate, INVARIANT_FORMAT);
            argsTemplate.solutionDateFormat = self.getFormattedDate(solutionDateObject);

            var currentDate = new Date();
            self.calculateDataForTemplate(argsTemplate, creationDateObject, currentDate, solutionDateObject, args);
        }
        $(self.getContent()).on( "click", ".show-diagram-case", function () {
            self.showGraphicQuery({ idCase: self.params.idCaseForGraphicQuery || self.params.idCase, idWorkflow: self.params.idWorkflow });
        });

    },

    /**
     * Calculate percent bar
     * @param argsTemplate
     * @param creationDateObject
     * @param currentDate
     * @param solutionDateObject
     * @param args
     */
    calculateDataForTemplate: function(argsTemplate, creationDateObject, currentDate, solutionDateObject, args){
        var self = this;
        var $content = self.getContent();

        var paramsEffectiveDuration = {};
        paramsEffectiveDuration.idUser = bizagi.currentUser.idUser;
        if(bizagi.util.parseBoolean(args.isOpen)){
            paramsEffectiveDuration.fromDate = creationDateObject.getTime();
            paramsEffectiveDuration.toDate = currentDate.getTime();
        }
        else{
            paramsEffectiveDuration.fromDate = solutionDateObject.getTime();
            paramsEffectiveDuration.toDate = currentDate.getTime();
        }

        $.when(self.callGetEffectiveDuration(paramsEffectiveDuration)).done(function(differenceCreationToCurrent){
               var relativeTime = bizagi.util.dateFormatter.getRelativeTime(new Date(Date.now() - (differenceCreationToCurrent.minutes * (1000 * 60)) ), null, false);
               if(bizagi.util.parseBoolean(args.isOpen)){
                   argsTemplate.relativeTimeState = bizagi.localization.getResource("workportal-project-case-state-opened").replace("%s", relativeTime);
                   argsTemplate.colorStateCase = "Opened";
               }
               else{
                   argsTemplate.relativeTimeState = bizagi.localization.getResource("workportal-project-case-state-closed").replace("%s", relativeTime);
                   argsTemplate.colorStateCase = "Closed";
               }

               argsTemplate.percentCompleteBar = 100;
               argsTemplate.isOpen = bizagi.util.parseBoolean(args.isOpen);
               //Update widget
               var contentTemplate = self.getTemplate("project-caseState-remaining");
               contentTemplate
                  .render($.extend(args, argsTemplate))
                  .appendTo($("#ui-bizagi-remaining",$content));

               //When activity is terminated , the service dont response currentState
               if(args.currentState.length > 0){
                   self.initilizeActionMenu(args.currentState);
               }
           });
    },

    /**
     * Show case number
     * @param args
     * @param argsTemplate
     */
    showCaseNumber: function (args, argsTemplate) {
        var self = this;
        var $content = self.getContent();
        var contentTemplate = self.getTemplate("project-caseState");
        contentTemplate
                .render($.extend(args, argsTemplate, {security: bizagi.menuSecurity}))
                .appendTo($content);
        //Handle events
        $(".case-summary-favorite", $content).on("click", $.proxy(self.onClickFavorite, self));
        // Set back and next case navigation
        $(".case-summary-back", self.content).on("click", $.proxy(self.goToCase, self, 'back'));
        $(".case-summary-next", self.content).on("click", $.proxy(self.goToCase, self, 'next'));
        self.showBackNextNavigation();
    },

    /**
     * Get Format date
     * @param dateObj
     * @returns {string}
     */
    getFormattedDate: function (dateObj) {
        var self = this;
        var monthsNames = self.datePickerRegional.monthNames;
        var shortMonth = dateObj.getMonth();
        return monthsNames[shortMonth] + " " + $.datepicker.formatDate("dd", dateObj);
    },

    /***
     * Events
     */
    onClickFavorite: function (event) {
        event.preventDefault();
        var self = this;
        var favoriteOptions = {};
        if ($(event.target).hasClass("bz-icon-star-outline")) {
            favoriteOptions = {
                idObject: self.params.idCase,
                favoriteType: "CASES"
            };
            $.when(self.dataService.addFavorite(favoriteOptions)).done(function (favoritesData) {
                self.params.guidFavorite = favoritesData.idFavorites;
                $(event.target).removeClass("bz-icon-star-outline");
                $(event.target).addClass("bz-icon-star");
            });
        }
        else {
            favoriteOptions = {
                idObject: self.params.guidFavorite,
                favoriteType: "CASES"
            };
            $.when(self.dataService.delFavorite(favoriteOptions)).done(function () {
                $(event.target).addClass("bz-icon-star-outline");
                $(event.target).removeClass("bz-icon-star");
            });
        }
    },

    /**
     * Initialize action menu
     * @param currentState
     * @returns {*}
     */
    initilizeActionMenu: function (currentState) {
        var self = this;
        var allowsReassign = bizagi.util.parseBoolean(currentState[0].allowsReassign) || false;
        var allowReleaseActivity = bizagi.util.parseBoolean(currentState[0].allowReleaseActivity) || false;

        var btReassing = $("#bt-case-action-reassing", self.content);
        var btRelease = $("#bt-case-action-release", self.content);

        if (allowsReassign) {
            btReassing.show();
        }
        if (allowReleaseActivity) {
            btRelease.show();
        }
        if (allowsReassign || allowReleaseActivity) {
            $(".ui-bizagi-wp-project-plan-action-menu", self.content).show();
            $(".ui-bizagi-wp-project-plan-action-menu", self.content).menu({
                select: $.proxy(self.onSelectMenu, self)
            }).removeClass("ui-widget-content");
        }
    },

    /**
     Events
     */
    onSelectMenu: function (event, ui) {
        var self = this;
        if($(event.currentTarget).find("i").length === 0){
            var item = $(ui.item).data("item");
            switch (item) {
                case "reassing":
                    self.onClickMenuReasign();
                    break;
                case "release":
                    self.onClickMenuRelease();
                    break;
            }
        }
    },

    /**
     * Executed when user reasign case
     */
    onClickMenuReasign: function () {
        var self = this;
        var idCase = self.params.idCase;
        var idWorkItem = self.params.idWorkitem;

        $.when(self.publish("showDialogWidget", {
            widgetName: bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_REASSIGN_CASE,
            data: {
                "idCase": idCase,
                "idWorkItem": idWorkItem
            },
            closeVisible: false,
            maximize: true,
            modalParameters: {
                title: bizagi.localization.getResource("render-actions-reassign"),
                width: "910px",
                id: "CaseAdmin"
            }
        }));
    },

    /**
     * Triggered when select option from contextual menu
     */
    onClickMenuRelease: function () {
        var self = this;
        self.releaseDialogBox.formContent.dialog({
            resizable: false,
            draggable: false,
            height: "auto",
            width: "660px",
            modal: true,
            title: bizagi.localization.getResource("workportal-widget-dialog-box-release-ok"),
            maximize: true,
            close: function () {
                self.releaseDialogBox.formContent.dialog("destroy");
                self.releaseDialogBox.formContent.detach();
            }
        });
    },


    /**
     * Triggered when user click over accept button
     */
    onClickAcceptRelease: function () {
        var self = this;
        var params = {
            idCase: self.params.idCase,
            idWorkItem: self.params.idWorkitem
        };
        $.when(self.dataService.releaseActivity(params)).done(function (data) {
            var status = data.status ? data.status : "";
            var message;
            switch (status) {
                case "Success":
                    //go to inbox
                    self.publish("changeWidget", {
                        widgetName: bizagi.workportal.currentInboxView
                    });
                    break;

                case "ConfigurationError":
                    message = self.getResource("workportal-widget-dialog-box-release-configuration-error-message").replace("{0}", params.idWorkItem);
                    bizagi.showMessageBox(message, self.getResource("workportal-widget-dialog-box-release-error"), "error", false);
                    break;

                default:
                    message = self.getResource("workportal-widget-dialog-box-release-error-message").replace("{0}", params.idWorkItem);
                    bizagi.showMessageBox(message, self.getResource("workportal-widget-dialog-box-release-error"), "error", false);
                    break;
            }
        }).fail(function () {
            var message = self.getResource("workportal-widget-dialog-box-release-error-message").replace("{0}", params.idWorkItem);
            bizagi.showMessageBox(message, self.getResource("workportal-widget-dialog-box-release-error"), "error", false);
        });
        self.releaseDialogBox.formContent.dialog("destroy");
        self.releaseDialogBox.formContent.detach();
    },

    /**
     * Close dialog release case
     */
    onClickCancelRelease: function () {
        var self = this;
        self.releaseDialogBox.formContent.dialog("destroy");
        self.releaseDialogBox.formContent.detach();
    },

    /**
     * Call service effective duration by schedule work
     * @param params
     * @return {*}
     */
    callGetEffectiveDuration: function(params){
        var self = this;
        var d = $.Deferred();

        if(params.fromDate){
            $.when(
               self.dataService.getEffectiveDuration(params)
            ).done(function (data) {
                   d.resolve(data);
               });
        }
        else{
            d.resolve(null);
        }

        return d.promise();
    },

    /**
     * Clean plugins and events
     */
    clean: function () {
        var self = this;
        $(".show-diagram-case", self.getContent()).off();
        var cntxtSidebarActivity = self.contextsSidebarActivity || [];
        this.params = {};
        cntxtSidebarActivity.forEach(function(context){
            self.unsub(context, $.proxy(self.updateView, self));
        });
    },

    goToCase: function(action){
        var self = this;
        var idCase = (action == 'back' ? self.getBackCase() : self.getNextCase());
        if (idCase > 0) {
            self.publish("executeAction", {
                action: bizagi.workportal.actions.action.BIZAGI_WORKPORTAL_ACTION_ROUTING,
                idCase: idCase
            });
        }
    },

    getListKey: function () {
        var self = this;
        bizagi.lstIdCases = bizagi.lstIdCases || {};
        if (bizagi.lstIdCases.length > 1) {
            for (var i = 0; i < bizagi.lstIdCases.length; i++) {
                if (self.params.idCase == bizagi.lstIdCases[i]) {
                    return i;
                }
            }
        }
        return -1;
    },

    getNextCase: function () {
        var self = this;
        var nextIdCase = 0;
        var key = self.getListKey();

        // Check if last element
        if (bizagi.lstIdCases.length == (key + 1) || bizagi.lstIdCases.length == 1) {
            nextIdCase = -1;
        } else {
            nextIdCase = bizagi.lstIdCases[key + 1];
        }

        return nextIdCase;
    },

    getBackCase: function () {
        var self = this;
        var prevIdCase = 0;
        var key = self.getListKey();

        // Check if first element
        if (key == 0) {
            prevIdCase = -1;
        } else {
            prevIdCase = bizagi.lstIdCases[key - 1] || -1;
        }

        return prevIdCase;
    },

    showBackNextNavigation: function(){
        var self = this;
        var nextCase = self.getNextCase();
        var backCase = self.getBackCase();
        nextCase <= 0 ? $(".case-summary-next").hide() : $(".case-summary-next").show();
        backCase <= 0 ? $(".case-summary-back").hide() : $(".case-summary-back").show();

        if (nextCase <= 0 && backCase <= 0) {
            $(".content-right-sidebar").removeClass("bz-state-number--active-case");
            $(".bz-case-navigation").hide();
        }
        else {
            $(".content-right-sidebar").addClass("bz-state-number--active-case");
            $(".bz-case-navigation").show();
        }
    }
});

bizagi.injector.register("bizagi.workportal.widgets.project.caseState", ["workportalFacade", "dataService", bizagi.workportal.widgets.project.caseState]);
