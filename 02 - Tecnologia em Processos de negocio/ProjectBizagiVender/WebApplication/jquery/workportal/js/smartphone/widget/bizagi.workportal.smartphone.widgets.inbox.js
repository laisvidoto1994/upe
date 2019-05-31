/*
*   Name: BizAgi Workportal Smartphone Inbox Widget Controller
*   Author: Oscar Osorio
*   Comments: Provide Smartphone overrides to implement the inbox widget
*/

// Extends itself
bizagi.workportal.widgets.inbox.extend('bizagi.workportal.widgets.inbox', {}, {
    /*
    *   Renders the summary form inside a given container
    */
    renderSummaryForm: function (container) {
        var self = this;
        var def = new $.Deferred();

        var proxyPrefix = (typeof (self.dataService.serviceLocator.proxyPrefix) !== "undefined")
            ? self.dataService.serviceLocator.proxyPrefix : "";

        // Load render page
        var rendering = new bizagi.rendering.facade({ "proxyPrefix": proxyPrefix });

        // Executes rendering into render container
        rendering.execute({
            canvas: container,
            summaryForm: true,
            idCase: self.idCase
        });

        // Keep reference to rendering facade
        self.renderingFacade = rendering;

        // Resize layout
        setTimeout(function () {
            self.resizeLayout();
        }, 1000);

        // Resolve main deferred
        $.when(rendering.ready())
        .done(function () {
            def.resolve();
        });

        return def.promise();
    },

    /* POST RENDER ACTIONS
    =====================================================*/
    postRender: function () {
        var self = this;
        var context = self.getContent();
        self.params.taskState = self.params.taskState || "all";
        $.when(self.dataService.getInboxSummary())
        .done(function (summary) {
            $.when(self.renderProcesses(self.params.taskState, false)
              ).done(function () {

                  //TODO ADD apple properties for active this value
                  self.applyActionFromLocalStorage(self.getActionFromLocalStorage("inbox"));

              });
            self.enableFilters(summary);

        });

        self.notifiesNavigation(bizagi.localization.getResource("workportal-widget-navigation-inbox"));
    },
    //this realize for ios 4
    scrollTop: function () {
        setTimeout(function () { window.scrollTo(0, 0); }, 10);
    },

    /*
    *notify to suscribe the message in the header
    */
    notifiesNavigation: function (message) {
        var self = this;
        self.publish("notifiesNavigation", { message: message });
    },

    /**
    enable panel 
    ***************************************/
    enablePanel: function (index) {
        var self = this;
        var context = self.getContent();
        self.enablePanel.beforePanel = self.enablePanel.actualPanel;
        self.enablePanel.actualPanel = index;
        switch (index) {
            case "lworkflow":
                $("#ui-bz-wp-cases-list", context).removeClass("slide in reverse").addClass("slide out").hide(); //.hide();
                $("#ui-bz-wp-case-summary", context).removeClass("slide in reverse").addClass("slide out").hide();
                $("#bz-wp-container-workflow", context).show().removeClass("slide out reverse").addClass("slide in " +
                (self.enablePanel.beforePanel && self.enablePanel.beforePanel == "lcases") ? "reverse" : ""); //.show();reverse
                $(" #bz-wp-container-categories", context).removeClass("slide in reverse").addClass("slide out").hide();
                $(".bz-wp-container-fts").show().removeClass("slide out reverse").addClass("slide in");
                $(".bz-wp-summary-menu-bar-bottom.bz-wp-foother-static").hide();
                $("#ui-bz-wp-no-results", context).hide();
                break;
            case "lcases":
                $("#ui-bz-wp-cases-list", context).show().removeClass("slide out reverse").addClass("slide in"); //.show();
                $("#ui-bz-wp-case-summary", context).removeClass("slide in reverse").addClass("slide out").hide();
                $("#bz-wp-container-workflow", context).removeClass("slide in reverse").addClass("slide out").hide(); //.hide();
                $(" #bz-wp-container-categories", context).removeClass("slide in reverse").addClass("slide out").hide();
                $(".bz-wp-container-fts").show().removeClass("slide out reverse").addClass("slide in");
                $(".bz-wp-summary-menu-bar-bottom.bz-wp-foother-static").hide();
                $("#ui-bz-wp-no-results", context).hide();
                self.enableHomeBtn($("#ui-bz-wp-cases-list .container-left", context));
                self.enableFavorites();
                self.getMenu().nextSuscribe(self.idWorkflow + "lcases", [function (args) {
                    if (args.action == "back") {
                        self.getMenu().removeSuscriber(args.key, false);
                        $.event.special.inview.stopObserverandDestroy();
                        self.enablePanel("lworkflow");
                    }
                }, function (args) {
                    if (args.action == "back")
                        self.getMenu().changeContextualButtons("back", { visible: false });
                }]);

                break;
            case "lsummary":
                $("#ui-bz-wp-cases-list", context).removeClass("slide in reverse").addClass("slide out").hide();
                $("#ui-bz-wp-case-summary", context).show().removeClass("slide out reverse").addClass("slide in");
                $("#ui-bz-wp-case-summary", context).bind('webkitAnimationEnd', function () {
                    $("#ui-bz-wp-cases-list", context).removeClass("slide out").hide();
                    $(".bz-wp-summary-menu-bar-bottom.bz-wp-foother-static").show();
                    $("#ui-bz-wp-case-summary", context).unbind('webkitAnimationEnd');

                });
                $("#bz-wp-container-workflow", context).hide();
                $("#bz-wp-container-categories", context).hide();
                $("#bz-wp-container-categories", context).hide();
                $("#ui-bz-wp-no-results", context).hide();
                self.getMenu().nextSuscribe(self.idWorkflow + "lsummary", function (args) {
                    if (args.action == "back") {
                        self.getMenu().removeSuscriber(args.key, false);
                        $.event.special.inview.stopObserverandDestroy();
                        self.applyActionFromLocalStorage(self.getActionFromLocalStorage("inbox"));
                    }
                });

                break;

            case "hide":
                $("#ui-bz-wp-cases-list", context).hide();
                $("#ui-bz-wp-case-summary", context).hide();
                $("#bz-wp-container-workflow", context).hide();
                $(" #bz-wp-container-categories", context).hide();
                $("#ui-bz-wp-no-results", context).hide();
                break;
            case "noresults":
                $("#ui-bz-wp-cases-list", context).hide();
                $("#ui-bz-wp-case-summary", context).hide();
                $("#bz-wp-container-workflow", context).hide();
                $(" #bz-wp-container-categories", context).hide();
                $("#ui-bz-wp-no-results", context).show();

                break;

        }
        self.scrollTop();
    },
    /*
    RENDER ALL PROCESS (CATEGORY)
    ====================================================*/
    renderProcesses: function (taskState, onlyFavorites) {
        var self = this;
        var context = self.getContent();
        var deferred = $.Deferred();
        self.taskState = taskState;
        self.onlyFavorites = onlyFavorites;
        var processesTmpl = self.workportalFacade.getTemplate('inbox.container.category.elements');
        $.when(
    	    self.dataService.getAllProcesses({
    	        taskState: self.taskState,
    	        onlyFavorites: self.onlyFavorites
    	    })).done(function (processesData) {
    	        $('#bz-wp-container-categories-process', context).empty();
    	        $.tmpl(processesTmpl, processesData).appendTo('#bz-wp-container-categories-process');
    	        self.subscribeWorkflowSelection();
    	        self.enablePanel("lworkflow");
    	        deferred.resolve();
    	    });
        return deferred.promise();
    },
    /*
    Add events to workflow (categories)
    ***********************************/
    subscribeWorkflowSelection: function () {
        var self = this;
        var context = self.getContent();
        $('ul[data-category] li[data-id-workflow]', context).bind('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            var title = $(this).find(".workflow-name").html();

            var idWorkflow = $(this).data('id-workflow');
            var pageNumber = '1';
            //$('ul[data-category] li[data-id-workflow]', context).unbind("click");
            self.processCasesLists(idWorkflow, pageNumber, title);
            $.event.special.inview.startObserver();
        });
    },
    /*
    Suscribe delegate methods present in workcase(category) and cases
    *******************************************/
    processCasesLists: function (idWorkflow, pageNumber, title) {
        var self = this;
        var context = self.getContent();
        $("li.moreload", context).remove();
        var casesTmpl = self.workportalFacade.getTemplate('inbox.container.category.cases-list');
        var casesListContainer = $('#ui-bz-wp-cases-list ul.bz-wp-list-cases', context);
        self.page = pageNumber;
        self.idWorkflow = idWorkflow;
        var params = {
            'taskState': self.params.taskState || 'all',
            'idWorkflow': idWorkflow,
            'page': pageNumber,
            'onlyFavorites': self.onlyFavorites || false
        };
        $.when(self.dataService.getCasesByWorkflow(params)).done(function (casesData) {
            if (casesData.lstIdCases && casesData.lstIdCases.length == 0)
                return;
            (casesData.page == 1) ? casesListContainer.empty() : '';
            $.tmpl(casesTmpl, casesData).appendTo(casesListContainer);
            if (self.enablePanel.actualPanel != "lcases")
                self.enablePanel("lcases");
            self.totalPages = casesData.totalPages;
            self.suscribeCasesDelegatesMethods();
        });

        if (title)
            $(".bz-wp-cases-header >.container-right >span").html(title);

        self.setActionToLocalStorage("inbox", JSON.stringify(
        {
            "action": "processCasesLists",
            "params": {
                'idWorkflow': idWorkflow, 'page': (pageNumber >= 2) ? --pageNumber : 1, //pageNumber,
                'title': title
            },
            "callbackOthers": "$.event.special.inview.startObserver"

        }));

    },
    /*
    add events to list selection in the cases list
    *****************************************/
    suscribeCasesDelegatesMethods: function () {
        var self = this;
        var context = self.getContent();
        $("li.moreload >div", context).bind('inview', function (event, visible) {
            if (visible) {
                if (self.totalPages > self.page) {
                    self.processCasesLists(self.idWorkflow, parseInt(self.page) + 1);
                }
                $(this).unbind('inview');
                $(this).parent().hide();
            }
        });

        $.when(
           $('#ui-bz-wp-cases-list ul> li[data-id-case]', context).unbind("click")
              ).done(function () {
                  $('#ui-bz-wp-cases-list ul> li[data-id-case]', context).bind("click", function (e) {
                      e.preventDefault();
                      e.stopPropagation();
                      $.event.special.inview.stopObserverandDestroy();
                      var idCase = $(this).closest('li').data('id-case');
                      self.processCasesSummary(idCase);
                  });
              });
    },
    /*
    load the summary case
    **********************/
    processCasesSummary: function (idCase) {
        var self = this;
        var context = self.getContent();
        self.enablePanel("lsummary");
        var caseSummaryTmpl = self.workportalFacade.getTemplate('inbox.container.category.cases-summary');
        var caseSummaryContainer = $('#ui-bz-wp-case-summary', context);

        $.when(self.dataService.getCaseSummary({ 'idCase': idCase })).done(function (summaryData) {
            caseSummaryContainer.empty();
            $.tmpl(caseSummaryTmpl, summaryData).appendTo(caseSummaryContainer);
            self.suscribreEventMoreInformationSummary(idCase);

            self.enableHomeBtn($("#ui-bz-wp-case-summary .container-left", context));

        });
    },
    /*
    suscribe the event relationate whit the button + in the screen summary case 
    **************************************/
    suscribreEventMoreInformationSummary: function (idCase) {
        var self = this;
        self.idCaseActual = idCase;
        var context = self.getContent();
        $.event.special.inview.startObserver();

        $(".bz-wp-summary-activity-box[data-workitem-id][data-task-id]", context).bind("click", function () {
            var idWorkitem = $(this).data("workitem-id");
            var idTask = $(this).data("task-id");
            var activityName = $(this).find(".activity-name").html();
            self.renderCase(idTask, idWorkitem, idCase, activityName);
        });

        $(".bz-wp-summary-activity-box[data-workitem-id][data-task-id]", context).bind('inview', function (event, visible, topOrBottomOrBoth) {
            if (visible) {
                var idWorkitem = $(this).data("workitem-id");
                var idTask = $(this).data("task-id");
                $(".bz-work_case", context).removeData("workitem-id").removeData("task-id");
                $(".bz-work_case", context).data("workitem-id", idWorkitem)
                    .data("task-id", idTask)
                    .data("activity-name", $(this).find(".activity-name").html());
            }
        });

        //revisar si por inview se puede verificar que fraccion de porcentaje mayor se encuentra visible para saber cual buscar click
        $(".bz-work_case", context).unbind("click").bind("click", function () {
            var idWorkitem = $(this).data("workitem-id");
            var idTask = $(this).data("task-id");
            var activityName = $(this).data("activity-name");;
            self.renderCase(idTask, idWorkitem, idCase, activityName);
        });
    },

    getCaseFormsRenderVersion: function (idCase) {
        var self = this,
		defer = new $.Deferred();
        // Try get from parameters
        var formsVersion = 0;
        // Get from service
        $.when(self.dataService.getCaseFormsRenderVersion({
            idCase: idCase
        }))
			.done(function (data) {
			    formsVersion = parseInt(data.formsRenderVersion);
			    defer.resolve(formsVersion);
			});
        return defer.promise();
    },

    renderCase: function (idTask, idWorkitem, idCase, activityName) {
        var self = this;
        var context = self.getContent();
        $(context).unbind();
        $(".bz-wp-summary-activity-box[data-workitem-id][data-task-id]", context).unbind('inview');
        $(".bz-wp-summary-activity-box[data-workitem-id][data-task-id]", context).unbind("click");

        context.bind("activateWidget", function () {
            self.activeWidget();
            context.unbind("activateWidget");
        });

        $.when(self.getCaseFormsRenderVersion(idCase))
		 .done(function (formsVersion) {
		     bizagi.util.smartphone.startLoading();
		     var widgetFormVersionName = bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_RENDER;
		     if (formsVersion == 1) {
		         widgetFormVersionName = bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_OLDRENDERINTEGRATION;
		     }

		     /*
              var referrerParams = {
                            taskState: self.params.taskState,
                            idWorkItem: idWorkItem,
                            idCase: self.idCase,
                            onlyFavorites: self.onlyFavorites,
                            idWorkflow: self.idWorkflow,
                            referrer: bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_INBOX
                        }

                        $.extend(bizagi.referrerParams, bizagi.referrerParams, referrerParams);
                        self.publish("executeAction", {
                            action: bizagi.workportal.actions.action.BIZAGI_WORKPORTAL_ACTION_ROUTING,
                            idCase: self.idCase,
                            idWorkItem: idWorkItem
                        });
            */

		     // Shows render widget
		     self.publish("pushWidget", {
		         widgetName: widgetFormVersionName,
		         idCase: idCase,
		         idWorkitem: idWorkitem,
		         idTask: idTask,
		         message: activityName,
		         fromTask: idTask
		     });

		     /*    self.publish("executeAction", {
                     action: bizagi.workportal.actions.action.BIZAGI_WORKPORTAL_ACTION_ROUTING,
                     idCase: idCase,
                     idWorkitem: idWorkitem,
                     idTask: idTask,
                     message: activityName
                 });*/

		 });

        $.event.special.inview.stopObserverandDestroy();
        self.scrollTop();
        self.notifiesNavigation(activityName);
    },

    enableHomeBtn: function (div) {
        var self = this;
        var context = self.getContent();
        //for others events prevents double event attach
        $(".bz-cm-icon.bz-cm-ib ", context).unbind("click");

        $(div).click(function () {
            self.getMenu().notifyObservers("back");
            $(this).unbind("click");
        });

    },

    enableFilters: function (summary) {
        var self = this;
        self.params.summary = summary;
        //enable filters version 2
        var context = $(".bz-wp-container-fts", self.getContent());
        var container = context.find(">ul");

        $(container).find(">li").bind("click", function (event) {
            var taskState = $(this).data('taskstate');
            var label = $(this).data('value');
            $(container).starNotification({ starLabel: label, typeIcon: taskState });
            //requires upper case problem in server (bug)
            var matches = self.params.summary[taskState[0].toUpperCase() + taskState.slice(1)];
            //cuando sea 0 no se permite el click
            //if (matches == 0)
            //return;
            $(container).find(">li").removeClass("active");
            $(this).addClass("active");

            if (taskState == "nc") {
                self.getMenu().emptySuscribers();
                self.publish("changeWidget", {
                    widgetName: bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_NEWCASE
                });

            }
            else
                if (taskState == "Favorites") {
                    self.params.taskState = "all";
                    self.params.onlyFavorites = true;
                    // matches = 1;
                } else {
                    self.params.taskState = taskState;
                    self.params.onlyFavorites = false;
                }
            //todo:send email to core to change json response
            if ((matches === undefined || matches == 0) && taskState != "Favorites") {
                $(container).unbind("starNotification");
                self.enablePanel("noresults");
                bizagi.log("No results for filter");
            }
            else {
                self.renderProcesses(self.params.taskState, self.params.onlyFavorites);
            }
        });

    },

    activeWidget: function (arguments) {
        var self = this;
        self.suscribreEventMoreInformationSummary(self.idCaseActual);
        self.getMenu().changeContextualButtons("search");
        self.notifiesNavigation(bizagi.localization.getResource("workportal-widget-navigation-inbox"));
    },

    getMenu: function () {
        return this.menu;
    },


    setActionToLocalStorage: function (key, value) {
        bizagi.util.removeItemLocalStorage(key);
        bizagi.util.setItemLocalStorage(key, value);
    },

    getActionFromLocalStorage: function (key) {
        var self = this;
        return bizagi.util.getItemLocalStorage(key);
    },


    applyActionFromLocalStorage: function (object) {
        //activar atras para un inbox reset
        //create propertie for iphone to enable or disable local storage
        var self = this;
        if (object) {
            object = JSON.parse(object);
            var arrayVariables = [];
            for (var key in object.params) {
                arrayVariables.push(object.params[key]);
            }

            $.when(
               self[object.action].apply(self, arrayVariables)
            ).done(function () {
                if (object.callbackOthers)
                    eval(object.callbackOthers)();
                // bizagi.util.clearLocalStorage();

            });
        }
    },

    enableFavorites: function () {
        var self = this;
        var properties = self.properties;
        var context = self.getContent();
        $("#ui-bz-wp-cases-list .bz-wp-cases-container-header span.bz-cm-icon.bz-cm-ib", context).bind("click", function (event) {
            event.preventDefault();
            event.stopPropagation();
            var elementSelected = $(this);

            if (elementSelected.hasClass("favorite-false")) {

                var options = {
                    idObject: elementSelected.closest('li').data("id-case"),
                    favoriteType: 'CASES'
                };

                $.when(self.dataService.addFavorite(options)).done(function (response) {
                    elementSelected.closest('li').data('idfavorites', response['idFavorites']);
                });

                elementSelected.removeClass("favorite-false").addClass("favorite-true");
            }
            else {

                options = {
                    idObject: elementSelected.closest('li').data('idfavorites'),
                    favoriteType: 'CASES'
                };

                $.when(self.dataService.delFavorite(options)).done(function (response) {
                    elementSelected.closest('li').data('idfavorites', "");
                });

                elementSelected.removeClass("favorite-true").addClass("favorite-false");
            }



        });
    }


});