/*
*   Name: BizAgi Workportal Tablet Inbox Widget Controller
*   Author: Andres Valencia
*   Comments: Provide tablet overrides to implement the inbox widget
*/

// Extends itself
bizagi.workportal.widgets.inbox.extend('bizagi.workportal.widgets.inbox', {}, {

    /*
    *   Constructor
    */
    init: function(workportalFacade, dataService, params) {
        var self = this;
        // Call base
        self._super(workportalFacade, dataService, params);

        // Initial inbox - drafts
        if (!self.dataService.online && typeof (params.inputtray) === "undefined") {
            params.inputtray = "true"; // Drafts
        }

        // Initialize global state namespace
        bizagi.workportal.state.inbox = bizagi.workportal.state.inbox || {};
        bizagi.workportal.state.inbox = $.extend(bizagi.workportal.state.inbox, { inputtray: params.inputtray });

        self.params = $.extend(self.params, { inputtray: params.inputtray || "inbox" });
        self.subscribe("toggleProcessesColumn", self.toggleProcessesColumn());
    },

    /* POST RENDER ACTIONS
    =====================================================*/
    postRender: function() {
        var self = this;

        // Get current state variables
        var taskState = bizagi.workportal.state.inbox.taskState || 'all';

        // Render processes/workflows
        self.renderProcessesByTaskState(taskState);


        bizagi.referrerParams = (self.params.restoreStatus) ? bizagi.referrerParams || {} : {};
        self.params.taskState = self.params.taskState || bizagi.referrerParams.taskState || taskState;

        /* Next lines based on desktop edition  for sumary footer numbers*/
        var summaryparams = null;
        if (self.params && (self.params.inputtray == "false" || self.params.inputtray == "true")) {
            summaryparams = self.params;

        }

        $.when(self.dataService.getInboxSummary(summaryparams))
            .done(function(summary) {
                self.updateSummary(summary);

                // Init with default task state
                self.changeTaskState(self.taskState);
                // Subscribe delegate for workflow filtering by task state
                self.taskStateFilterSelection();
                /* End lines based on desktop edition  for summary footer numbers*/
                self.configureSummaryColumnSlider();
                self.subscribePagerActions();
            });


        // Handler column slider
        self.configureSlider();

        // If the current state contains any idWorkflow, load it 
        var idWorkflow = bizagi.workportal.state.inbox.idWorkflow;
        var pageNumber = bizagi.workportal.state.inbox.pageNumber || 1;
        self.loadCasesList(idWorkflow, pageNumber);

        var showProcessesColumn = typeof (bizagi.workportal.state.inbox.showProcessesColumn) !== "undefined" ? bizagi
            .workportal.state.inbox.showProcessesColumn : true;
        self.toggleProcessesColumn(showProcessesColumn);
    },

    /* HANDLER FOR COLUMN SLIDER
    =====================================================*/
    configureSlider: function() {
        var self = this;
        var context = self.getContent();

        $('#summary-column-slider', context).bind('click', function() {
            self.toggleProcessesColumn(!self.showProcessesColumn);
        });
    },

    /*
    *   Updates inbox summary
    *   New! Function based on desktop edition
    */
    updateSummary: function(summary) {
        var self = this;
        var content = self.getContent();

        $(".ui-bizagi-wp-app-inbox-tab#red", content).find(".toolTip").html(bizagi.util.shortNumber(summary.Red));
        $(".ui-bizagi-wp-app-inbox-tab#green", content).find(".toolTip").html(bizagi.util.shortNumber(summary.Green));
        $(".ui-bizagi-wp-app-inbox-tab#yellow", content).find(".toolTip").html(bizagi.util.shortNumber(summary.Yellow));
    },


    /* RENDERS WORKFLOWS BY TASK STATE
    =====================================================*/
    renderProcessesByTaskState: function(taskState) {

        var self = this;
        var context = self.getContent();

        self.taskState = '';
        self.onlyFavorites = '';

        // Get the template
        var processesTmpl = self.workportalFacade.getTemplate('inbox.common.processes');

        // Update internal variable
        if (taskState == 'Favorites') {
            self.taskState = 'all';
            self.onlyFavorites = 'true';
        } else {
            self.taskState = taskState;
            self.onlyFavorites = '';
        }

        $.when(
            self.dataService.getAllProcesses({
                taskState: self.taskState,
                onlyFavorites: self.onlyFavorites,
                inputtray: self.params.inputtray || "inbox"
            })
        ).done(function(processesData) {
            //Empty container
            $('#process-column > div.scroll-content', context).empty();

            // Disable the default loading message
            $('.ui-bizagi-loading-icon', context).hide();

            // Bind data to template
            $('#process-column > div.scroll-content', context).append($.tmpl(processesTmpl, processesData));

            // Set selected workflow
            $('.workflows-list > li[data-id-workflow=' + self.idWorkflow + ']', context).addClass('list-item-selected');

            // Bind handlers
            self.subscribeWorkflowSelection();

            // Click handler for favorites processes
            self.subscribeFavoritesProcesses();
        });
    },

    /*
    *   Renders the summary form inside a given container
    */
    renderSummaryForm: function(container) {
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
        setTimeout(function() {
            self.resizeLayout();
        }, 1000);

        // Resolve main deferred
        $.when(rendering.ready())
            .done(function() {
                def.resolve();
            });

        return def.promise();
    },

    /* HANDLES TASK STATE SELECTION (FILTERS)
    =====================================================*/
    taskStateFilterSelection: function() {

        var self = this;
        var context = self.getContent();

        $('#process-filters', context).delegate('li', 'click', function(e) {
            e.preventDefault();

            //Empty case column and summary column containers
            $('#case-column .scroll-content, #summary-column .scroll-content', context).empty();

            // Hide cases pager if visible
            $('.pager-container', context).hide();

            // Disable the default loading message
            $('.ui-bizagi-loading-icon', context).hide();

            var taskState = $(this).attr("data-task-state");;
            self.changeTaskState(taskState);

            self.loadCasesList("", "1");

        });
    },

    /*
    *   Change task state
    */
    changeTaskState: function(taskState) {
        var self = this;
        var context = self.getContent();

        bizagi.workportal.state.inbox.taskState = taskState;
        self.renderProcessesByTaskState(taskState);

        // Make current filter active
        $('#process-filters li', context)
            .removeClass('filter-active'); // Remove 'active' class for any previously selected filter
        $('#process-filters li[data-task-state=' + taskState + ']', context)
            .addClass('filter-active'); // Add the active class to selected item
    },

    /* HANDLES WORKFLOW SELECTION
    =====================================================*/
    subscribeWorkflowSelection: function() {

        var self = this;
        var context = self.getContent();

        $('.workflows-list > li', context).bind('click', function(e) {

            e.preventDefault();
            e.stopPropagation();

            //Empty case column and summary column containers
            $('#case-column div.scroll-content, #summary-column div.scroll-content', context).empty();

            // Disable the default loading message
            $('#summary-column .ui-bizagi-loading-icon', context).hide();

            //Remove previous 'selected' class
            $('.workflows-list li', context).removeClass('list-item-selected')

            // in this context 'this' is the clicked li
            var idWorkflow = $(this).data('id-workflow');
            var pageNumber = '1';
            self.loadCasesList(idWorkflow, pageNumber);

            // Hide cases pager if visible
            $('.pager-container', context).hide();
        });
    },

    /*
    *   Load cases list
    */
    loadCasesList: function(idWorkflow, pageNumber) {
        var self = this;
        var context = self.getContent();
        var taskState = self.taskState;

        // Get template
        var casesTmpl = self.workportalFacade.getTemplate('inbox.common.case-list');
        var casesListContainer = $('#case-column > div.scroll-content', context);

        // Set selected workflow 
        self.idWorkflow = idWorkflow;
        $('.workflows-list > li[data-id-workflow=' + self.idWorkflow + ']', context).addClass('list-item-selected');

        // Save current state in workflow state structure
        bizagi.workportal.state.inbox.idWorkflow = idWorkflow;
        bizagi.workportal.state.inbox.pageNumber = pageNumber;

        var params = {
            'taskState': taskState,
            'idWorkflow': idWorkflow,
            'page': pageNumber,
            'onlyFavorites': eval(self.onlyFavorites),
            'inputtray': self.params.inputtray || "inbox"
        };

        $.when(self.dataService.getCasesByWorkflow(params)).done(function(casesData) {
            //Empty container
            casesListContainer.empty();

            // Bind data to template
            $.tmpl(casesTmpl, casesData, {
                'replaceLineBreak': bizagi.util.replaceLineBreak,
                'formatMonetaryCell': bizagi.util.formatMonetaryCell,
                'formatDecimalCell': bizagi.util.formatDecimalCell

            }).appendTo(casesListContainer);

            // Bind case item handler
            self.handleCaseSelection();

            // Bind handlers delete item
            self.subscribeDeleteSelectedCase(idWorkflow, casesData.page, casesData
                .totalPages); // TODO: Ubicación Handler

            // Click handler for favorites cases
            self.subscribeFavoritesCases();

            self.updatePager(idWorkflow, casesData.page, casesData.totalPages);
        });
    },

    /* SUBSCRIBE PAGER ACTIONS
    =====================================================*/
    subscribePagerActions: function() {

        var self = this;
        var context = self.getContent();

        // Cache jQuery selector
        var $pager = $('.pager-container', context);

        // Bind pager button actions
        $pager.delegate('button', 'click', function() {

            // Empty summary column content
            $('#case-column div.scroll-content, #summary-column .scroll-content', context).empty();

            // Hide loading message as it finished processing
            $('#summary-column .ui-bizagi-loading-icon', context).hide();

            var idWorkflow = $pager.data('id-workflow');
            var pageNumber = $(this).prop('id');

            self.loadCasesList(idWorkflow, pageNumber);
        });
    },


    /* FUNCTION TO UPDATE THE PAGER
    =====================================================*/
    updatePager: function(idWorkflow, currentPage, totalPages) {

        var self = this;
        var context = self.getContent();

        // Cache jQuery selector
        var $pager = $('.pager-container', context);

        // Store the id workflow
        $pager.data('id-workflow', idWorkflow);

        // Empty current pager
        $pager.empty();

        // Draw pager if there are more than 1 pages
        if (totalPages > 1) {

            // Show pager
            $pager.show();

            // Add pages to 'select'
            for (var i = 1; i <= totalPages; i++) {
                if (i == currentPage) {
                    $pager.append($('<button>').prop('id', i).prop('class', 'current-page').text(i));
                } else {
                    $pager.append($('<button>').prop('id', i).text(i));
                }
            }
        }
    },


    /* HANDLES CASE SELECTION
    =====================================================*/
    handleCaseSelection: function() {

        var self = this;
        var context = self.getContent();

        $('ul.cases-list > li', context).bind('click', function() {

            //Empty summary column containers
            $('#summary-column .scroll-content', context).empty();

            //Remove previous 'selected' class
            $('ul.cases-list > li', context).removeClass('list-item-selected');

            // Add 'selected' class
            $(this).closest('li').addClass('list-item-selected');

            var params = {};
            params.idCase = $(this).closest('li').data('id-case');
            params.isOfflineForm = $(this).closest('li').data('isofflineform');

            self.loadCaseSummary(params);

            // Slide case and summary column
            self.toggleProcessesColumn(false);

        });
    },

    /*
    *   Load case summary
    */
    loadCaseSummary: function(params) {
        var self = this;
        var context = self.getContent();

        // Get template
        var caseSummaryTmpl = self.workportalFacade.getTemplate('inbox.common.case-summary');
        var caseSummaryContainer = $('#summary-column .scroll-content', context);

        $.when(self.dataService.getCaseSummary(params)).done(function(summaryData) {
            //Empty container
            caseSummaryContainer.empty();

            if (params.isOfflineForm) {
                summaryData.caseNumber = summaryData.caseNumber || params.idCase;
            }

            // Bind data to template
            $.tmpl(caseSummaryTmpl, summaryData).appendTo(caseSummaryContainer);

            // Tabify case details
            $('#ui-bizagi-details-tabs', context).tabs({
                    activate: function(event, ui) {
                        var panel = (ui == undefined) ? 'formSummary' : ui.newPanel.selector.replace("#", "");
                        switch (panel) {
                        case 'tab-assignees':
                            if (cache['assignees'] == undefined) {
                                $.when(
                                    self.dataService.summaryAssigness({
                                        idCase: self.idCase
                                    })
                                ).done(function(assignees) {
                                    // Get template for tab-assignees
                                    self.caseSummaryTemplateAssigness = self.workportalFacade
                                        .getTemplate('inbox-common-case-summary-assignees');
                                    //self.caseSummaryTemplateAssigness = self.workportalFacade.getTemplate('inbox.common.case-summary');
                                    htmlContent = $.tmpl(self.caseSummaryTemplateAssigness, assignees);
                                    //htmlContent.appendTo($('#tab-assignees',caseSummaryContainer)); 
                                    htmlContent.appendTo($('#tab-assignees', context));
                                    cache['assignees'] = htmlContent;
                                });
                            }
                            break;
                        case 'tab-events':
                            if (cache['events'] == undefined) {
                                $.when(
                                    self.dataService.summaryCaseEvents({
                                        idCase: self.idCase
                                    })
                                ).done(function(events) {
                                    self.caseSummaryTemplateEvents = self.workportalFacade
                                        .getTemplate('inbox-common-case-summary-events');
                                    htmlContent = $.tmpl(self.caseSummaryTemplateEvents, events);
                                    htmlContent.appendTo($('#tab-events', context));
                                    cache['events'] = htmlContent;

                                    htmlContent.delegate('.summaryLink', 'click', function() {
                                        self.routingExecute($(this));
                                    });
                                });
                            }
                            break;
                        }

                    }
                }
            );

            var cache = {};
            var htmlContent = '';

            self.idCase = params.idCase;

            $('#ui-bizagi-details-tabs', context).trigger('tabsselect');

            // Bind next handlers...
            self.subscribeWorkOnItButtonClick();
        });
    },

    /* SUBSCRIBES 'Work on it' BUTTON CLICK
    =====================================================*/
    subscribeWorkOnItButtonClick: function() {

        var self = this;
        var context = self.getContent();

        $('.activity-box', context).delegate('input[type="button"]', 'click', function() {
            // Show Back Button
            bizagi.workportal.controllers.menu.prototype.showBackButton.call(this);

            var offlineForm = $(this).data("is-offline");
            self.publish('executeAction', {
                action: bizagi.workportal.actions.action.BIZAGI_WORKPORTAL_ACTION_ROUTING,
                idCase: $(this).data('id-case'),
                idWorkItem: $(this).data('id-workitem'),
                isOfflineForm: offlineForm,
                formsRenderVersion: (offlineForm == true) ? 2 : 0
            });
        });
    },

    /**
     * Change Network state
     * inbox | outbox (false) | drafts (true)
     */
    changeNetworkState: function() {
        var self = this;
        var inputTray = bizagi.util.getItemLocalStorage("inputtray");

        if (self.dataService.online) {
            self.status.removeClass("offline");
            self.status.addClass("online");
            self.status.text(self.getResource("workportal-offline-status-online"));

            if (inputTray != null && (inputTray === "true" || inputTray === "false")) {
                $("#submenu-button span.page-title").text(bizagi.localization.getResource("workportal-menu-inbox"));
                inputTray = "inbox";
                bizagi.util.setItemLocalStorage("inputtray", inputTray);
                self.publish("changeWidget", {
                    widgetName: bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_INBOX,
                    inputtray: inputTray
                });
            }
        } else {
            self.status.removeClass("online");
            self.status.addClass("offline");
            self.status.text(self.getResource("workportal-offline-status-offline"));

            if (inputTray != null && inputTray === "inbox") {
                $("#submenu-button span.page-title").text(bizagi.localization.getResource("workportal-menu-drafts"));
                inputTray = "true";
                bizagi.util.setItemLocalStorage("inputtray", inputTray);
                self.publish("changeWidget", {
                    widgetName: bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_INBOX,
                    inputtray: inputTray
                });
            }
        }
    },

    /* HANDLES SUMMARY COLUMN SLIDER // ONLINE OFFLINE NOTIFICATION
    =====================================================*/
    configureSummaryColumnSlider: function() {
        var self = this;
        var context = self.getContent();

        self.status = $(".bz-wp-status-notification", context);

        if (!self.dataService.online) {
            //self.setStatusOffline();
            self.changeNetworkState();
        }

        $(document).off("online.inbox");
        $(document).off("offline.inbox");
        $(document).on("online.inbox", function() {
            self.dataService.online = true;                        
            self.changeNetworkState();
        });
        $(document).on("offline.inbox", function() {
            self.dataService.online = false;                      
            self.changeNetworkState();
        });

    },

    toggleProcessesColumn: function(show) {
        var self = this;
        var context = self.getContent();

        // Save state
        self.showProcessesColumn = bizagi.workportal.state.inbox.showProcessesColumn = show;

        if (show) {
            $('#case-column', context).removeClass('slide-case-column-to-left');
            $('#summary-column', context).removeClass('slide-summary-column-to-left slide-summary-column-to-default');

        } else {
            $('#case-column', context).addClass('slide-case-column-to-left');
            $('#summary-column', context).addClass('slide-summary-column-to-left slide-summary-column-to-default');
        }
    },

    /* HANDLER FOR FAVORITES PROCESSES
    =====================================================*/
    subscribeFavoritesProcesses: function() {
        var self = this;
        var context = self.getContent();

        // Processes
        var processesContainer = $('#process-column', context);

        $('li > .icon.favorite-true, li > .icon.favorite-false', processesContainer).click(function(e) {
            e.stopPropagation();

            var icon = $(this);

            var isFavorite = icon.closest('li').attr('data-isfavorite');
            var options;

            if (isFavorite == "false") {
                options = {
                    idObject: icon.closest('li').attr('data-guidwfclass'),
                    favoriteType: 'WFCLASS'
                };
                $.when(
                    self.dataService.addFavorite(options)
                ).done(function(favoriteData) {
                    icon.attr('data-favorite-guidfavorite', favoriteData['idFavorites']);
                    icon.closest('li').attr('data-isfavorite', 'true');
                    icon.removeClass('favorite-false').addClass('favorite-true');
                });
            } else {
                options = {
                    idObject: icon.attr('data-favorite-guidfavorite'),
                    favoriteType: 'WFCLASS'
                };
                $.when(
                    self.dataService.delFavorite(options)
                ).done(function(favoriteData) {
                    icon.attr('data-favorite-guidfavorite', '')
                    icon.closest('li').attr('data-isfavorite', 'false');
                    icon.removeClass('favorite-true').addClass('favorite-false');
                });
            }
        });
    },

    /* HANDLER FOR FAVORITES CASES
    =====================================================*/
    subscribeFavoritesCases: function() {
        var self = this;
        var context = self.getContent();

        // Cases
        var casesContainer = $('#case-column', context);

        $('li .favorite-false, li .favorite-true', casesContainer).click(function(e) {
            e.stopPropagation();

            var icon = $(this);

            var isFavorite = icon.closest('li').attr('data-isfavorite');

            var options;
            if (isFavorite == "false") {
                options = {
                    idObject: icon.closest('li').attr('data-id-case'),
                    favoriteType: 'CASES'
                };
                $.when(
                    self.dataService.addFavorite(options)
                ).done(function(favoriteData) {
                    icon.closest('li').attr('data-favorite-guidfavorite', favoriteData['idFavorites']);
                    icon.closest('li').attr('data-isfavorite', 'true');
                    icon.removeClass('favorite-false').addClass('favorite-true');
                });
            } else {
                options = {
                    idObject: icon.closest('li').attr('data-favorite-guidfavorite'),
                    favoriteType: 'CASES'
                };
                $.when(
                    self.dataService.delFavorite(options)
                ).done(function(favoriteData) {
                    icon.closest('li').attr('data-favorite-guidfavorite', '');
                    icon.closest('li').attr('data-isfavorite', 'false');
                    icon.removeClass('favorite-true').addClass('favorite-false');
                });
            }
        });
    },


    /* HANDLES WORKFLOW SELECTION - DELETE
    =====================================================*/
    subscribeDeleteSelectedCase: function(idWorkflow, currentPage, totalPages) {
        var self = this;
        var context = self.getContent();

        $('.cases-list > li .erase-icon', context).unbind('click');
        $('.cases-list > li .erase-icon', context).bind('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            // in this context 'this' is the clicked 'erase-icon'
            var idCase = $(this).parent().parent().data('id-case');

            var confirmationMsg = bizagi.localization.getResource("workportal-widget-inbox-delete-case-title");
            $.when(bizagi.showConfirmationBox(confirmationMsg, "Bizagi", "warning"))
                .done(function() {
                    var params = { 'idCase': idCase };

                    $.when(self.dataService.deleteCase(params))
                        .done(function() {
                            idWorkflow = idWorkflow || "";
                            currentPage = currentPage || "1";
                            totalPages = totalPages || "1";

                            // Get current state variables
                            var taskState = bizagi.workportal.state.inbox.taskState || 'all';

                            if ($("#case-column").hasClass("slide-case-column-to-left")) {
                                // Hide Panel
                                $('#summary-column-slider').click();

                                //Empty case column and summary column containers
                                $('#case-column .scroll-content, #summary-column .scroll-content', context).empty();
                            }

                            // Render processes/workflows
                            self.renderProcessesByTaskState(taskState);

                            self.loadCasesList(idWorkflow, currentPage);

                            // self.updatePager(idWorkflow, currentPage, totalPages);
                        }).fail(function(error) {
                            bizagi.log(error);
                        });
                });
        });
    }
});