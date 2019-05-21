bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.casestemplate", {}, {
    /**
     * Constructor
     */
    init: function (workportalFacade, dataService, actionService, casetoolbar, usersCasesService, actionsEventsService, accumulatedcontext, params) {
        var self = this;

        // Call base
        self._super(workportalFacade, dataService, params);

        //Load templates
        self.loadTemplates({
            "casestemplate-container": bizagi.getTemplate("bizagi.workportal.desktop.widget.casestemplate").concat("#casestemplate-wrapper"),
            "casestemplate-item": bizagi.getTemplate("bizagi.workportal.desktop.widget.casestemplate").concat("#casestemplate-item"),
            "casestemplate-empty-data": bizagi.getTemplate("bizagi.workportal.desktop.widget.casestemplate").concat("#casestemplate-empty-message")
        });

        self.selectorCheckboxItems = ".casetemplate-box-check-selector input:checkbox";
        self.actionService = actionService;
        self.casetoolbar = casetoolbar;
        self.usersCasesService = usersCasesService;
        self.actionsEventsService = actionsEventsService;

        self.sequenceCall = 0;
        self.accumulatedcontext = accumulatedcontext;
    },

    /**
     * Renders the template defined in the widget
     */
    renderContent: function () {
        var self = this,
            templateContainer = self.getTemplate("casestemplate-container");

        self.content = templateContainer.render({});
        return self.content;
    },

    /**
     * links events with handlers
     */
    postRender: function () {
        var self = this,
            $content = self.getContent();

        self.sub("CASES-TEMPLATE-VIEW", $.proxy(self.updateCases, self));
        self.sub("UPDATE-DATATEMPLATE-VIEW", $.proxy(self.updateCases, self));
        self.sub("GET-COMMON-ACTIONS", $.proxy(self.getCommonActions, self));
        self.sub("SET-RECORDS", $.proxy(self.updateCases, self));
        self.sub("SET-VALUES", function (ev, params) { return self.setValues(params) });
        self.actionService.subscribe("onFormActionExecuted", $.proxy(self.onFormActionExecuted, self));
        self.actionService.subscribe("onFormRuleExecuted", $.proxy(self.onFormRuleExecuted, self));
        $content.find("#casestemplate-dataviewer-list").on("click", self.selectorCheckboxItems, $.proxy(self.onCaseChecked, self));

        //keep bar actions
        var heightBreadCrumb = $("#home-navbar").outerHeight();
        var heightMenu = $("#ui-bizagi-wp-menu").height() - heightBreadCrumb;
        $("#content-wrapper").scroll(function(){
            var sticky = $(".template-sticky-header-tools");
            var heightSticky = sticky.height();
            var scroll = $("#content-wrapper").scrollTop();

            if (scroll >= heightMenu) {
                sticky.addClass("fixed-header-tools");
                $(this).css("padding-top", (heightSticky) + "px");
            }
            else {
                sticky.removeClass("fixed-header-tools");
                $(this).css("padding-top", "");
            }
        });
    },

    /**
     * Detach events
     */
    clean: function () {
        var self = this,
            $content = self.getContent();

        self.checkAll = false;
        self.sequenceCall = 0;

        $("#content-wrapper").unbind("scroll");

        if ($content) {
            self.actionService.unsubscribe("onFormActionExecuted");
            self.actionService.unsubscribe("onFormRuleExecuted");
            self.unsub("CASES-TEMPLATE-VIEW");
            self.unsub("UPDATE-DATATEMPLATE-VIEW");
            self.unsub("GET-COMMON-ACTIONS");
            self.sub("SET-VALUES");
            $content.find("#casestemplate-dataviewer-list").off("click", self.selectorCheckboxItems);
        }
    },

    /**
     * Updates the cases list
     */
    updateCases : function(ev, data){
        var self = this,
            args = data.args,
            defer = new $.Deferred(),
            $dataViewList = $("#casestemplate-dataviewer-list", self.getContent());

        $dataViewList.empty();
        self.actionService.init();
        self.casesSelected = {};
        self.sequenceCall++;

        self.page = args.page || self.page;
        self.idworkflow = (args.idworkflow == undefined) ? self.idworkflow : args.idworkflow;
        self.route = args.route || self.route;
        self.filter = args.filter || self.filter;
        self.pageSize = args.pageSize || self.pageSize;

        (function (sequence) {
            $.when(self.getCasesData({ page: self.page, idworkflow: self.idworkflow, pageSize: self.pageSize }))
                .pipe(function (casesData) {
                    if (self.sequenceCall !== sequence) {
                        defer.resolve();
                        return [];
                    }
                    self.pub("notify", { type: "PAGINATOR-UPDATE", args: $.extend(casesData, args, { event: data.type }) });
                    return self.getCasesTemplates(casesData);
                })
                .done(function (templates) {
                    var casesLength = self.casesLength = templates.length,
                        templateString = casesLength > 0 ? "" : self.getEmptyDataMessage(),
                        $templateCase = null,
                        $elementsTmpl = $();

                    for (var i = 0, l = templates.length; i < l; i++) {
                        if (self.sequenceCall !== sequence) {
                            defer.resolve();
                            return;
                        }
                        $templateCase = self.renderCase(templates[i], false, sequence);
                        $elementsTmpl.push.apply($elementsTmpl, $templateCase);
                    }

                    if ($elementsTmpl.length > 0) {
                        $dataViewList.append($elementsTmpl);
                    }
                    else {
                        $dataViewList.append(templateString);
                    }

                    self.checkAll = false;

                    self.pub("notify", { type: "ENABLE-BATCHS-ACTIONS", args: { commonActions: self.setValues({ args: { value: self.checkAll } }) } });
                    defer.resolve(templates);

                });
        })(self.sequenceCall);

        return defer.promise();
    },

    /**
     * Renders the case with the decorators related
     * actions events and images
     */
    renderCase : function(caseData, isRefresh, sequence){
        var self = this,
            actionData = caseData.actionData,
            idCase = actionData.idCase,
            surrogateKey = actionData.surrogateKey,
            guidEntity = actionData.guidEntity,
            templateCase = self.getTemplate("casestemplate-item");
        var $templateCase = templateCase.render({
            idCase: idCase,
            guidEntity: guidEntity,
            surrogateKey: surrogateKey
        });

        $templateCase.find("#template").append(caseData.tmpl);

        // Set header
        setTimeout(function () {
            var $casetoolbar = self.casetoolbar.getCaseToolbar({ casetoolbarData: $.extend(caseData.casetoolbarData, {referrer: "CasesTemplate"}) });
            var $case = self.getContent().find("#casetemplate-box-wrapper-" + idCase + " .casetemplate-box-element");

            if (sequence === self.sequenceCall) {
                $case.append($casetoolbar);
            }
        }, 0);
        // Get Actions and events
        setTimeout(function () {
            var $footer = self.getContent().find("#casetemplate-box-wrapper-" + idCase + " .casetemplate-box-footer");

            $footer.startLoading({ delay: 0, overlay: true });
            $.when(self.actionService.getActionsView({
                    actionData: caseData.actionData,
                    loadEvents: true,
                    isRefresh: isRefresh
                }))
                .done(function (responseActions) {
                    var $actionsView = responseActions.actionsView;
                    var actionsData = responseActions.actionsData;
                    var $case = self.getContent()
                        .find("#casetemplate-box-wrapper-" + idCase + " .casetemplate-box-element .casetemplate-box-footer");
                    if ($actionsView && (sequence === self.sequenceCall)) {
                        $case.append($actionsView);
                        if(actionsData.length > 0 && self.getCheckBox($case).data("surrogatekey") != -1){
                            self.showCheckItem($case);
                            self.pub("notify", {
                                type: "SOME-ITEM-ALLOW-SELECT",
                                args: {}
                            });
                        }
                        else{
                            self.removeCheckItem($case);
                        }
                    }
                    else{
                        self.removeCheckItem($case);
                    }
                    $footer.endLoading();
                });
        }, 0);
        // Get cases assignees
        setTimeout(function () {
            $.when(self.usersCasesService.getAssignees(idCase))
                .done(function ($assignees) {
                    if ($assignees && (sequence === self.sequenceCall)) {
                        var $case = self.getContent()
                            .find("#casetemplate-box-wrapper-" + idCase + " .casetemplate-box-element .casetemplate-box-footer");
                        $case.append($assignees);
                    }
                });
        }, 0);

        return $templateCase;
    },

    /**
     * Get check item by case
     * @param $item
     */
    getCheckBox: function($item){
        var self = this;
        return $item.closest(".casetemplate-box-element").find(self.selectorCheckboxItems);
    },

    /**
     * Hide check item
     * @param $item
     */
    removeCheckItem: function($item){
        var self = this;
        self.getCheckBox($item).remove();
    },

    /**
     * Show checkbox
     * @param $item
     */
    showCheckItem: function($item){
        var self = this;
        self.getCheckBox($item).show();
    },

    /**
     * Process action was executed
     */
    onFormActionExecuted : function(ev, data){
        var self = this;
        data = data || {};

        if (data.refresh) {
            self.refreshCase(data.idCase);
        }
    },

    /**
     * Process action was executed
     */
    onFormRuleExecuted: function (ev, data) {
        var self = this;
        data = data || {};

        if (data.refresh) {
            self.refreshCase(data.idCase);
        }
    },

    /**
     * Refresh the case with the new data
     */
    refreshCase: function (idCase) {
        var self = this;

        var idBox = "#casetemplate-box-wrapper-" + idCase;
        var $templateBox = $(idBox);
        var isChecked = $templateBox
            .find(".casetemplate-box-check-selector > input")
            .is(":checked");

        $templateBox.startLoading({ delay: 250, overlay: true });

        $.when(self.getCasesData({ idCase: idCase }))
            .then(function (caseData) {
                return self.getCasesTemplates(caseData, true);
            })
            .done(function (caseTemplate) {
                var $templateCase = self.renderCase(caseTemplate[0], true, self.sequenceCall);

                $templateBox.replaceWith($templateCase);
                $templateBox.endLoading();

                // Restore checked value
                if (isChecked) {
                    $templateBox = $(idBox);
                    $templateBox.find(".casetemplate-box-check-selector > input").prop("checked", true);
                }
            });
    },

    /**
     * Gets the data related with the cases
     */
    getCasesData: function (params) {
        var self = this;

        if (self.route == "following") {
            return self.dataService.getActivitiesData(params);
        }

        if (self.route == "pendings") {
            return self.dataService.getPendingsData(params);
        }

        if ( self.route == "Green" ||
            self.route == "Yellow" ||
            self.route == "Red" ) {
            $.extend(params, { taskState: self.route });
            return self.dataService.getPendingsData(params);
        }
    },

    /**
     * Invokes the template engine, to gets the custom columns
     */
    getCasesTemplates : function(casesData, refreshCase){
        var self = this,
            result = [],
            defer = new $.Deferred();

            $.when(self.getTemplateEngine())
                .then(function (engine) {
                    return $.when.apply($, $.map(casesData.entities, function (cases) {
                        return engine.render(cases);
                    }));
                })
                .done(function () {
                    var casesTemplates = $.makeArray(arguments),
                        idCases = [],
                        cases = casesData.entities.length;

                    for (var i = 0; i < cases; i++) {
                        var tmpl = (cases === 1) ? casesTemplates[i] : casesTemplates[i][0];
                        var caseData = casesData.entities[i];
                        result.push({
                            tmpl: tmpl,
                            casetoolbarData: {
                                guidFavorite: casesData.entities[i].guidFavorite,
                                idcase: casesData.entities[i].idCase,
                                idWorkflow: casesData.entities[i].idWorkflow
                            },
                            actionData: {
                                guidEntity: caseData.guid,
                                idCase: caseData.idCase,
                                radNumber: caseData.radNumber,
                                surrogateKey: caseData.surrogateKey
                            }
                        });
                        idCases.push(caseData.idCase);
                    }

                    if (!refreshCase) {
                        self.usersCasesService.render(idCases);
                        self.actionsEventsService.render(idCases);
                    }

                    defer.resolve(result);
                });

        return defer.promise();
    },

    /**
     *  returns an instance of  the template engine
     */
    getTemplateEngine: function () {
        var self = this;

        if (self.templateEngine) {
            return self.templateEngine;
        }

        var params = {};

        params.proxyPrefix = bizagi.RPproxyPrefix;
        var renderDataService = new bizagi.render.services.service(params),
            renderFactory = new bizagi.rendering.desktop.factory(renderDataService),
            defer = new $.Deferred();

        $.when(renderFactory.initAsyncStuff())
            .done(function () {
                self.templateEngine = new bizagi.templateEngine({ renderFactory: renderFactory, cache: true, forcePersonalizedColumns: true });
                self.templateEngine.subscribe("onLoadDataNavigation", function (ev, params) {
                    var data = params.data || {};
                    var args = {
                        reference: data.reference,
                        surrogateKey: data.surrogateKey,
                        referenceType: data.referenceType,
                        fromActionLauncher: false,
                        histName: data.displayName,
                        guidEntityCurrent: data.guidEntityCurrent,
                        page: 1
                    };

                    if (typeof data.xpath !== "undefined" && data.xpath) {
                        args.xpath = data.xpath;
                    }

                    self.accumulatedcontext.clean();
                    self.pubDeadLockDetection("notify", {
                        type: "TEMPLATEENGINE-VIEW",
                        args: args
                    });
                });
                defer.resolve(self.templateEngine);
            });

        return defer.promise();
    },

    /**
     * Gets Message when there aren"t data
     */
    getEmptyDataMessage: function () {
        var self = this;
        var casestemplateEmptyData = self.getTemplate("casestemplate-empty-data");

        return casestemplateEmptyData.render()[0].outerHTML;
    },

    /**
     * Handler to hold the cases selected
     */
    onCaseChecked: function (ev) {
        var self = this,
            $target = $(ev.target),
            surrogateKey = $target.data("surrogatekey"),
            idCase = $target.data("idcase"),
            guidEntity = $target.data("guidentity"),
            isChecked = $target.is(":checked");

        self.casesSelected[idCase] = {
            surrogateKey: surrogateKey,
            guidEntity: guidEntity,
            idCase: idCase
        };

        if (!isChecked) {
            delete self.casesSelected[idCase];
        }
        self.pub("notify", { type: "ENABLE-BATCHS-ACTIONS", args: { commonActions: self.getCommonActions() } });

    },

    /**
     * Returns the common actions in the set of data
     */
    getCommonActions: function () {
        var self = this,
            model = {};

        model.actions = self.actionService.getCommonActions(self.casesSelected);
        model.surrogateKeys = [];
        model.parentsid = [];

        for (var idcase in self.casesSelected) {
            var data = self.casesSelected[idcase];
            if (data.surrogateKey !== -1) {
                model.surrogateKeys.push(data.surrogateKey);
                model.parentsid.push(data.idCase);
            }
        }

        model.guidEntity = (idcase !== undefined) ? self.casesSelected[idcase].guidEntity : "";

        if (model.surrogateKeys.length == 0) {
            self.checkAll = false;
            model.checkAll = false;
        }
        else if (model.surrogateKeys.length == self.casesLength) {
            self.checkAll = true;
            model.checkAll = true;
        }

        model.itemsSelected = self.casesSelected;

        return model;
    },

    /**
     * Set current value
     */
    setValues: function (params) {
        var self = this,
            $content = self.getContent(),
            args = params.args || {},
            isChecked = args.value;

        if ($content) {
            self.casesSelected = {};
            var $inputs = $content.find(self.selectorCheckboxItems);
            $.map($inputs, function (input) {
                $(input).prop("checked", isChecked);

                if (isChecked) {
                    var surrogateKey = $(input).data("surrogatekey"),
                        idCase = $(input).data("idcase"),
                        guidentity = $(input).data("guidentity");

                    self.casesSelected[idCase] = {
                        surrogateKey: surrogateKey,
                        guidEntity: guidentity,
                        idCase: idCase
                    };
                }
            });

            self.checkAll = isChecked;

            return self.getCommonActions();
        }
    }
});

bizagi.injector.register("bizagi.workportal.widgets.casestemplate", ["workportalFacade", "dataService", "actionService", "casetoolbar", "usersCasesService", "actionsEventsService", "accumulatedcontext", bizagi.workportal.widgets.casestemplate]);
