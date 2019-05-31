/*
 *   Name: BizAgi Workportal Tablet Inbox grid Widget Controller
 *   Author: Diego Parra
 *   Comments:
 *   -   This script will provide tablet overrides to implement the inbox grid widget
 */

// Extends itself
bizagi.workportal.widgets.inboxGrid.extend("bizagi.workportal.widgets.inboxGrid", {}, {

    /*
    *   Constructor
    */
    init: function(workportalFacade, dataService, params) {
        // Call base
        this._super(workportalFacade, dataService, params);

        // Initialize global state namespace
        bizagi.workportal.state.inboxgrid = bizagi.workportal.state.inboxgrid || {};
    },

    /*
    *   Renders the summary form inside a given container
    */
    renderSummaryForm: function(container) {
        var self = this;

        var proxyPrefix = (typeof (self.dataService.serviceLocator.proxyPrefix) !== "undefined") ? self.dataService
            .serviceLocator.proxyPrefix : "";

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
    },

    postRender: function() {
        var self = this;
        var context = self.getContent();

        // Get current state variables
        var taskState = bizagi.workportal.state.inboxgrid.taskState || 'all';
        var idWorkflow = bizagi.workportal.state.inboxgrid.idWorkflow;
        var workflowName = bizagi.workportal.state.inboxgrid.workflowName;
        var pageNumber = bizagi.workportal.state.inboxgrid.pageNumber || 1;

        // Declare widget variables based on desktop
        self.taskState = taskState; // general taskState from tabs
        self.icoTaskState = ""; // real staskState from list cases
        self.idWorkflow = idWorkflow;
        self.idCase = 0;

        // Render processes/workflows
        self.renderProcessesByTaskState(taskState);

        // Subscribe delegate for workflow filtering by task state
        self.taskStateFilterSelection();

        // Handler for pages
        self.subscribePagerActions();

        // Handler for view control
        self.configureViewControl();
        self.popupOpened = false;

        bizagi.referrerParams = (self.params.restoreStatus) ? bizagi.referrerParams || {} : {};
        self.params.taskState = self.params.taskState || bizagi.referrerParams.taskState || taskState;


        /* Next lines based on desktop edition  for sumary footer numbers*/
        $.when(self.dataService.getInboxSummary())
            .done(function(summary) {
                self.updateSummary(summary);

                // Init with default task state
                self.changeTaskState(self.taskState);

                self.configureSummaryColumnSlider();
            });
        /* End lines based on desktop edition  for summary footer numbers*/

        // Handler column slider
        self.configureSlider();

        self.loadCasesGrid({
            idWorkflow: idWorkflow,
            pageNumber: pageNumber,
            workflowName: workflowName
        });

        // Use slider
        var showProcessesColumn = typeof (bizagi.workportal.state.inboxgrid.showProcessesColumn) !== "undefined"
            ? bizagi.workportal.state.inboxgrid.showProcessesColumn : true;
        self.toggleProcessesColumn(showProcessesColumn);
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
            $.tmpl(processesTmpl, processesData).appendTo('#process-column > div.scroll-content', context);

            // Set selected workflow
            $('.workflows-list > li[data-id-workflow=' + self.idWorkflow + ']', context).addClass('list-item-selected');

            // Bind handlers
            self.subscribeWorkflowSelection();


            // Click handler for favorites processes
            self.subscribeFavoritesProcesses();
        });
    },

    /* HANDLES TASK STATE SELECTION (FILTERS)
    =====================================================*/
    taskStateFilterSelection: function() {

        var self = this;
        var context = self.getContent();

        $('#process-filters', context).delegate('li', 'click', function() {

            //Empty case column and case actions containers
            $('#case-column-grid .scroll-content', context).empty();

            // Disable the default loading message
            $('.ui-bizagi-loading-icon', context).hide();

            $('#process-filters li', context)
                .removeClass('filter-active'); // Remove 'active' class for any previously selected filter

            var taskState = $(this).attr("data-task-state");;
            self.changeTaskState(taskState);

            // Hide pager
            $('.pager-container', context).hide();

            // New! Next two lines load the right column with the corresponding cases
            var params = {
                'idWorkflow': "",
                'workflowName': "",
                'pageNumber': '1'
            };
            self.loadCasesGrid(params);
        });
    },

    changeTaskState: function(taskState) {
        var self = this;
        var context = self.getContent();

        bizagi.workportal.state.inboxgrid.taskState = taskState;
        self.renderProcessesByTaskState(taskState);

        // Make current filter active
        $('#process-filters li', context)
            .removeClass('filter-active'); // Remove 'active' class for any previously selected filter
        $('#process-filters li[data-task-state=' + taskState + ']', context)
            .addClass('filter-active'); // Add the active class to selected item
    },


    /* RETURNS THE CURRENT SELECTED TASK STATE
    =====================================================*/
    getCurrentTaskState: function() {
        var self = this;
        var context = self.getContent();
        var currentTaskState = $('.filter-active button', context);

        if (currentTaskState.hasClass('filter-none')) {
            return 'all';
        }
        if (currentTaskState.hasClass('filter-red')) {
            return 'Red';
        }
        if (currentTaskState.hasClass('filter-yellow')) {
            return 'Yellow';
        }
        if (currentTaskState.hasClass('filter-green')) {
            return 'Green';
        }
        if (currentTaskState.hasClass('filter-starred')) {
            return 'Favorites';
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

    /* HANDLES WORKFLOW SELECTION
    =====================================================*/
    subscribeWorkflowSelection: function() {

        var self = this;
        var context = self.getContent();

        $('.workflows-list > li', context).bind('click', function(e) {

            e.preventDefault();
            e.stopPropagation();

            //Empty case column and summary column containers
            $('#case-column-grid div.scroll-content', context).empty();

            // Disable the default loading message
            //$('.ui-bizagi-loading-icon', context).hide();

            //Remove previous 'selected' class
            $('.workflows-list li', context).removeClass('list-item-selected')

            // Add 'selected' class
            $(this).addClass('list-item-selected');

            var params = {
                'idWorkflow': $(this).data('id-workflow'),
                'workflowName': $(this).find('.workflow-name').text(),
                'pageNumber': '1'
            };
            self.loadCasesGrid(params);

            // Hide cases pager if visible
            $('.pager-container', context).hide();

            // Hide processes column
            self.toggleProcessesColumn(false);
        });
    },

    /* FUNCTION TO UPDATE THE PAGER
    =====================================================*/
    updatePager: function(idWorkflow, workflowName, currentPage, totalPages) {

        var self = this;
        var context = self.getContent();

        // Cache jQuery selector
        var $pager = $('.pager-container', context);

        // Store the id workflow
        $pager.data('id-workflow', idWorkflow);
        $pager.data('workflow-name', workflowName);

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

        // Update page links
        self.subscribePagerActions();
        $pager.find(".current-page", context).focus();
    },

    loadCasesGrid: function(params) {
        var self = this;
        var context = self.getContent();

        // Get template
        var casesGridTmpl = self.workportalFacade.getTemplate('inbox-grid-cases');
        var casesGridContainer = $('#case-column-grid > div.scroll-content', context);

        var params = {
            'taskState': self.getCurrentTaskState(),
            'idWorkflow': params.idWorkflow,
            'page': params.pageNumber,
            'onlyFavorites': eval(self.onlyFavorites),
            'workflowName': params.workflowName,
            'order': params.order || "",
            'orderFieldName': params.orderFieldName || "",
            'orderType': params.orderType || "0"
        };
        var idWorkflow = params.idWorkflow;

        // Save current state in workflow state structure
        bizagi.workportal.state.inboxgrid.idWorkflow = params.idWorkflow;
        bizagi.workportal.state.inboxgrid.workflowName = params.workflowName;
        bizagi.workportal.state.inboxgrid.pageNumber = params.pageNumber;

        $.when(
            self.dataService.getCustomizedColumnsData(params)
        ).done(function(data) {
            //  Hack json data
            var i = 0;
            $(data.cases.columnTitle).each(function(key, value) {
                if (value.order == "T_idTask") {
                    $(data.cases.rows).each(function(key2, value2) {
                        if (!self.isArray(value2["fields"][i])) {
                            data["cases"]["rows"][key2]["fields"][i] = {
                                "workitems": [
                                    {
                                        "TaskName": value2["fields"][i],
                                        "State": data["cases"]["rows"][key2]["taskState"]
                                    }
                                ]
                            };
                        }
                    });
                }
                i++;
            });

            // Empty container
            casesGridContainer.empty();

            // Empty pager
            var pagerContainer = $('#pager-wrapper', context);
            pagerContainer.empty();

            if (pagerContainer.children().size() == 0) {
                // Append pager to container
                $('<div>', { 'id': 'cases-pager', 'data-id-workflow': params.idWorkflow }).appendTo(pagerContainer);
            }

            $('#cases-pager', context).empty();

            data.cases = bizagi.util.formatDecimalAndMoneyCell(data.cases, BIZAGI_DEFAULT_CURRENCY_INFO);

            // Render grid
            var workflowName = !bizagi.util.isEmpty(params.workflowName) ? "&nbsp;&gt;&nbsp;" + params.workflowName
                : "";
            $.tmpl(
                casesGridTmpl,
                $.extend(data.cases, { processName: workflowName }),
                {
                    'setFormat': self.formatValue,
                    'isArray': self.isArray,
                    'formatCategories': self.formatCategories,
                    'isDate': self.isDate,
                    'replaceLineBreak': bizagi.util.replaceLineBreak,
                    'formatMonetaryCell': bizagi.util.formatMonetaryCell,
                    'formatDecimalCell': bizagi.util.formatDecimalCell
                }
            ).appendTo(casesGridContainer);

            // Update pager
            self.updatePager(idWorkflow, params.workflowName, data.cases.page, data.cases.totalPages);

            // Update data-id-workflow
            $('#cases-pager', context).attr('data-id-workflow', params.idWorkflow);

            // Click handler for favorites cases
            self.subscribeFavoritesCases();

            // Set even style                        
            $("#ui-bizagi-wp-app-inbox-grid-cases tr:nth-child(even)", context).addClass("event");

            // Add click event for activities
            $(".ui-bizagi-wp-app-inbox-activity-name", context).click(function() {
                // Call routing action
                var idCase = $(this).find("#idCase").val();
                var idTask = $(this).find("#idTask").val();
                var idWorkItem = $(this).find("#idWorkItem").val();
                // Show back button
                $('#ui-bizagi-workportal-wrapper-back', context).show();
                // Hide view button
                $('#ui-bizagi-workportal-widget-view-options', context).hide();

                // fix for SUITE-9491
                if (idWorkItem) {
                    idWorkItem = "";
                }

                self.publish("executeAction", {
                    action: bizagi.workportal.actions.action.BIZAGI_WORKPORTAL_ACTION_ROUTING,
                    idCase: idCase,
                    idWorkItem: idWorkItem,
                    idTask: idTask
                });
            });

            // bind for sort columns
            $(".sortColumnsData", context).click(function() {
                self.loadCasesGrid({
                    idWorkflow: idWorkflow,
                    workflowName: params.workflowName,
                    orderFieldName: $(this).find("#orderFieldName").val(),
                    orderType: (($(this).find("#orderType").val() == 0) ? 1 : 0),
                    order: $(this).find("#order").val()
                });
            });

            // show routing
            $(".workonitRow.showDesc", context).click(function() {
                // Show back button
                $('#ui-bizagi-workportal-wrapper-back', context).show();
                // Hide view button
                $('#ui-bizagi-workportal-widget-view-options', context).hide();
                var baseulTask = $(this).parents("tr").find(".gridListWorkItems li");
                if (baseulTask.length == 1) {
                    baseulTask.find(".ui-bizagi-wp-app-inbox-activity-name").click();
                } else {
                    self.publish('executeAction', {
                        action: bizagi.workportal.actions.action.BIZAGI_WORKPORTAL_ACTION_ROUTING,
                        idCase: $(this).parents("td").first().find("#idCase").val()
                    });
                }

            });

            // Show processes column when we click on Inbox link
            $(".ui-bizagi-wp-app-inbox-processes-title", context).click(function() {
                self.toggleProcessesColumn(true);
            });

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
        $pager.undelegate('button', 'click').delegate('button', 'click', function() {

            // Empty summary column content
            $('#case-column-grid div.scroll-content', context).empty();

            // Hide loading message as it finished processing
            $('#summary-column .ui-bizagi-loading-icon', context).hide();

            var params = {
                'idWorkflow': $pager.data('id-workflow'),
                'pageNumber': $(this).prop('id'),
                'workflowName': $pager.data('workflow-name')
            };

            self.loadCasesGrid(params);
        });
    },

    /* HANDLER FOR FAVORITES CASES
    =====================================================*/
    subscribeFavoritesCases: function() {

        var self = this;
        var context = self.getContent();
        $('#case-column-grid', context).delegate(".ui-bizagi-wp-app-inbox-cases-start", "click", function(e) {
            e.stopPropagation();
            var favoriteOptions;
            var elmnt = this;
            $(elmnt).removeClass("ui-bizagi-wp-app-inbox-cases-start")
                .addClass("ui-bizagi-wp-app-inbox-cases-start-wait");

            // check if its favorite
            if ($(elmnt).parent().find("#isFavorite").val() == "false") {
                favoriteOptions = {
                    idObject: $(elmnt).parent().find("#idCase").val(),
                    favoriteType: "CASES"
                };
                $.when(
                    self.dataService.addFavorite(favoriteOptions)
                ).done(function(favoritesData) {
                    $(elmnt).parent().find("#guidFavorite").val(favoritesData["idFavorites"]);
                    $(elmnt).removeClass("off").addClass("on");
                    $(elmnt).parent().find("#isFavorite").val("true");
                    $(elmnt).removeClass("ui-bizagi-wp-app-inbox-cases-start-wait")
                        .addClass("ui-bizagi-wp-app-inbox-cases-start");
                });
            } else {
                favoriteOptions = {
                    idObject: $(elmnt).parent().find("#guidFavorite").val(),
                    favoriteType: "CASES"
                };
                $.when(
                    self.dataService.delFavorite(favoriteOptions)
                ).done(function(favoritesData) {
                    if (favoritesData["deleted"] == "true") {
                        $(elmnt).parent().find("#guidFavorite").val("");
                        $(elmnt).removeClass("on").addClass("off");
                        $(elmnt).parent().find("#isFavorite").val("false");
                        $(elmnt).removeClass("ui-bizagi-wp-app-inbox-cases-start-wait")
                            .addClass("ui-bizagi-wp-app-inbox-cases-start");
                    }
                });
            }
        });

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

    toggleProcessesColumn: function(show) {
        var self = this;
        var context = self.getContent();

        // Save state
        self.showProcessesColumn = bizagi.workportal.state.inboxgrid.showProcessesColumn = show;

        if (show) {
            $('#case-column-grid', context).removeClass('slide-render-column-to-left-grid');
            $('.scroll-content', context).addClass('slide-render-column-to-right-grid');
            $('#ui-bizagi-wp-app-inbox-grid-cases-container', context).addClass('slide-render-column-to-top-grid');
        } else {
            $('#case-column-grid', context).addClass('slide-render-column-to-left-grid');
            $('.scroll-content', context).removeClass('slide-render-column-to-right-grid');
            $('#ui-bizagi-wp-app-inbox-grid-cases-container', context).removeClass('slide-render-column-to-top-grid');
        }
    },


    /* HANDLER FOR VIEW CONTROL
    =====================================================*/
    configureViewControl: function() {
        var self = this;
        var context = self.getContent();
        var eyeIconBackground = $("#ui-bizagi-wp-app-inbox-bg-eye", context);
        var eyeIcon = $("#ui-bizagi-wp-app-inbox-bt-eye", context);

        // Bind view handler
        $('#ui-bizagi-wp-app-inbox-bt-eye').bind('click', function() {
            // If the popup is opened close it
            if (self.popupOpened) {
                bizagi.workportal.tablet.popup.closePopupInstance();
                return;
            }

            // Creates popup
            self.popupOpened = true;
            eyeIconBackground.removeClass("eye-focus-off");
            eyeIconBackground.addClass("eye-focus-on");

            //var popup = new bizagi.workportal.desktop.popup(self.dataService, self.workportalFacade, {
            var popup = new bizagi.workportal.tablet.popup(self.dataService, self.workportalFacade, {
                sourceElement: "#ui-bizagi-wp-app-inbox-bt-eye",
                offset: "-28 0",
                at: "left bottom",
                height: 60,
                width: 110
            });

            // Render popup
            var template = self.workportalFacade.getTemplate("inbox-common-header-view");
            popup.render($.tmpl(template));

            // Add class for improvement
            $('#viewDetailsEvent', context).closest('.modal').find('.selectarrow')
                .addClass('ui-bizagi-workportal-widget-view-options');

            // Checks for close signal to change the class again
            $.when(popup.closed())
                .done(function() {
                    self.popupOpened = false;
                    eyeIconBackground.removeClass("eye-focus-on");
                    eyeIconBackground.addClass("eye-focus-off");
                });

            // Details view
            var popupContent = popup.getContent();
            $("#viewDetailsEvent", popupContent).click(function() {
                self.publish("changeWidget", {
                    widgetName: bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_INBOX
                });
                popup.close();
            });

            // Grid view
            $("#viewGridEvent", popupContent).click(function() {
                self.publish("changeWidget", {
                    widgetName: bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_INBOX_GRID
                });
                popup.close();
            });
        });
    },

    /*
    *   Misc method to format cell values
    */
    formatRequest: function(value) {
        return value;
    },

    /**
    * Misc method to render categories
    */
    formatCategories: function(value) {
        return value;

    },

    isArray: function(value) {
        if (typeof (value) == 'object') {
            return true;
        } else {
            return false;
        }
    },

    isDate: function(value) {
        try {
            var date = new Date(value);
            if (date.getYear() > 0) {
                return true;
            }
        } catch (e) {
            return false;
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
            //bizagi.util.setItemLocalStorage("inputtray", "inbox");
            self.changeNetworkState();
        });
        $(document).on("offline.inbox", function() {
            self.dataService.online = false;
            //bizagi.util.setItemLocalStorage("inputtray", "true");            
            self.changeNetworkState();
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
    }
});