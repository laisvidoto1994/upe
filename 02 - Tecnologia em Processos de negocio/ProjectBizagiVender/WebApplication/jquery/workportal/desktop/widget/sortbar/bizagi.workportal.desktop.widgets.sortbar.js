/**
 * Name: Bizagi Workportal Desktop Sort Bar Controller
 * Author: Danny Gonzalez
 */
bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.sortbar", {}, {
    /**
     * Constructor
     * @param workportalFacade
     * @param dataService
     * @param processActionService
     * @param accumulatedcontext
     * @param params
     */
    init: function (workportalFacade, dataService, processActionService, accumulatedcontext, params) {
        var self = this;

        // Call base
        self._super(workportalFacade, dataService, params);

        //Load templates
        self.loadTemplates({
            "sortbar": bizagi.getTemplate("bizagi.workportal.desktop.widget.sortbar").concat("#sortbar-wrapper"),
            "content": bizagi.getTemplate("bizagi.workportal.desktop.widget.sortbar").concat("#sortbar-content"),
            "right-content": bizagi.getTemplate("bizagi.workportal.desktop.widget.sortbar").concat("#sortbar-right"),
            "addButton": bizagi.getTemplate("bizagi.workportal.desktop.widget.sortbar").concat("#sortbar-content-add-button"),
            "sortMenu": bizagi.getTemplate("bizagi.workportal.desktop.widget.sortbar").concat("#sortbar-sort-menu"),
            "actions": bizagi.getTemplate("bizagi.workportal.desktop.widget.sortbar").concat("#sortbar-content-actions"),
            "recordsPerPage": bizagi.getTemplate("bizagi.workportal.desktop.widget.sortbar").concat("#sortbar-records-per-page"),
            "recordsMenu": bizagi.getTemplate("bizagi.workportal.desktop.widget.sortbar").concat("#sortbar-records-menu")
        });

        self.processActionService = processActionService;
        self.accumulatedcontext = accumulatedcontext;
    },

    /**
     * Renders the template defined in the widget
     */
    renderContent: function () {
        var self = this;
        var template = self.getTemplate("sortbar");
        self.content = template.render({ enableFilter: true });
        self.$checkAll = self.content.find(".sortbar-left-check-uncheck input");

        return self.content;
    },

    /**
     * links events with handlers
     */
    postRender: function () {
        var self = this;

        var template = self.getTemplate("right-content");
        self.configureHandlers();
        $(".sortbar-right", self.content).append(template.render());
        self.configureAfterPaintHandlers();
    },

    /**
     * Binds events to handles
     */
    configureHandlers: function () {
        var self = this,
            $content = self.getContent();

        self.sub("TEMPLATEENGINE-VIEW", $.proxy(self.initializeAndProcessFilterButton, self));
        self.sub("SEARCH-ENGINE-VIEW", $.proxy(self.initializeAndProcessFilterButton, self));
        self.sub("SET-FILTERS-DATA", $.proxy(self.setFiltersSortData, self));
        self.sub("HIDE-FILTER-BUTTONANDBAR", $.proxy(self.hideFilterButtonAndBar, self));
        self.sub("HIDE-SORT-BUTTONS", $.proxy(self.hideSortButtons, self));
        self.sub("ENABLE-BATCHS-ACTIONS", function(ev, args) { return self.enableBatchActions(args);});
        self.sub("UPDATE-COUNTER-FILTERS-APPLIED", function(ev, args) { return self.updateCounterByFilterApplied(args); });
        self.sub("CASES-TEMPLATE-VIEW", function(ev, args){ self.showingFiltering = false; self.setVisibleCheckAll(false); });
        self.sub("SOME-ITEM-ALLOW-SELECT", function(ev, args){ self.setVisibleCheckAll(true); });

        $content.find(".wgd-sortbar-add-button").tooltip();
        self.$checkAll.on("click", $.proxy(self.onCheckUncheck, self));
    },

    /**
     * Configure Handlers
     */
    configureAfterPaintHandlers: function () {
        var self = this,
            $content = self.getContent();

        // Show sort menu
        $content.find(".right-menu").on("click", function (ev) {
            self.showSortMenu(ev, $(this));
        });

        // Show records menu
        $content.find(".records-menu").on("click", function (ev) {
            self.showRecordsMenu(ev, $(this));
        });

        // Change sort type
        $content.find(".sortbar-az").on("click", function () {
            if(self.sortSelection.attribute) {
                self.setIconSortType($(this), self._sortType);

                self.pub("notify", { type: "SET-ORDERBY", args: {
                    properties:{
                        xpath: self.sortSelection.attribute,
                        orderType: self._sortType,
                        typeSearch: "none"
                    }
                }});
            }
        });
        // Show filter bar
        $content.find(".filter-icon").on("click", function () {
            self.pub("notify", { type: "OPENCLOSE-MYSEARCHFILTER", args: {guidSearch: self.params.guidSearch, target: $(this) }});
        });

        $(".remove-selected-items-collections", $content).on("click", $.proxy(self.onRemoveSelectedItemsCollections, self));
    },

    /**
     * Behavior visible sortbar
     */
    behaviorVisibleSortbar: function(){
        var self = this;
        if(self.showingFiltering || self.showingSorting || self.showingCheckAll || self._haveAddButton){
            self.setVisibleSortbar(true);
        }
        else{
            self.setVisibleSortbar(false);
        }
    },

    /**
     * Shor or hide sortbar
     * @param visible
     */
    setVisibleSortbar: function(visible){
        var self = this;
        var $content = self.getContent();
        if(visible){
            $content.show();
        }
        else{
            $content.hide();
        }
    },

    /**
     * Show or hide check input (select all)
     * @param visible
     */
    setVisibleCheckAll: function(visible){
        var self = this;
        if(visible){
            self.$checkAll.closest(".border-check-uncheck").show();
            self.showingCheckAll = true;
        }
        else{
            self.$checkAll.closest(".border-check-uncheck").hide();
            self.showingCheckAll = false;
        }
        self.behaviorVisibleSortbar();
    },

    /**
     * Show number items selected from data items (from casetemplate or entityTemplates)
     * @param numberCheckedItems
     */
    showSelectedItems: function(numberCheckedItems){
        var self = this;
        if(numberCheckedItems && numberCheckedItems > 0){
            self.content.addClass("there-are-actions");

            var keywordSelected = self.getResource("workportal-general-word-selected-singular");
            if(numberCheckedItems > 1){
                keywordSelected = self.getResource("workportal-general-word-selected-plural");
            }
            $(".actions-count-selected", self.content).text(numberCheckedItems + " " + keywordSelected + " ");
        }
        else{
            self.content.removeClass("there-are-actions");
        }
    },

    /**
     * Set icon descending or ascending
     * @param button represents icon ascending or descending
     * @param sortTypeBeforeChanged
     */
    setIconSortType: function(button, sortTypeBeforeChanged){
        var self = this;
        if (sortTypeBeforeChanged === "asc") {
            self._sortType ="desc";
            button.removeClass("bz-icon-order-ascendant-outline").addClass("bz-icon-order-descendant-outline");
        }
        else {
            self._sortType ="asc";
            button.removeClass("bz-icon-order-descendant-outline").addClass("bz-icon-order-ascendant-outline");
        }
    },

    /**
     *
     * @param event
     */
    onClickBatchAction: function(event){
        var self = this;
        var $buttonLI = $(event.target).closest("li");
        var guidAction = $buttonLI.data("guid");
        var action = self.getAction(guidAction);

        if(!self.requestsInProgressActionGuid[guidAction]){
            self.requestsInProgressActionGuid[guidAction] = true;

            self.addLoadingButtonAction($buttonLI);

            $.when(self.processActionService.executeBatchAction({
                action: action,
                commonActionsmodel: self.commonActionsmodel
            })).always(function(){
                $buttonLI.find(".wdg-tple-button").removeClass("state-loading");
                $buttonLI.find(".ui-bizagi-loading-button").remove();
                $buttonLI.find("i").show();

                self.requestsInProgressActionGuid[guidAction] = undefined;
            });
        }
    },

    /**
     * Add loading to button
     */
    addLoadingButtonAction: function($button){
        $button.find(".wdg-tple-button").addClass("state-loading");
        $button.find(".wdg-tple-button").prepend("<div class=\"ui-bizagi-loading-icon ui-bizagi-loading-button\"></div>").find("i").hide();
    },

    /**
     *
     */
    onRemoveSelectedItemsCollections: function(){
        var self = this;
        var commonActions = self.pub("notify", {type: "SET-VALUES", args: {value: false}})[0];
        self.enableBatchActions({ args: { commonActions: commonActions } });
    },

    /**
     * Show the sort menu
     * @param ev
     * @param $parent
     */
    showSortMenu: function (ev, $parent) {
        var self = this;
        var $content = self.getContent();
        var template = self.getTemplate("sortMenu");
        var tooltip = template.render({filters: self._filters}, {
            displayValue: function (val) {
                return val;
            }});

        if ($(".sortbar-box-menu", $parent).length) {
            $(".sortbar-box-menu", $parent).remove();
        }

        $parent.append(tooltip);
        tooltip.show("fast", function () {
            tooltip.click(function (e) {
                e.stopPropagation();
            });
            $(document).one("click", function () {
                tooltip.hide("fast");
                tooltip.remove();
            });
        });

        //Configure handler to each action
        $content.find(".sortbar-option").on("click", function (ev) {
            var data = $(ev.currentTarget).data();
            var sortSelection = self._filters[data.index];
            $content.find(".sortbar-az").removeClass("disabled");

            if(self.sortSelection != sortSelection) {
                self.sortSelection = sortSelection;
                $(".sortbar-selected", $parent).text(self.sortSelection.display.split(".").pop());
                self.pub("notify", { type: "SET-ORDERBY", args: {
                    properties:{
                        xpath: sortSelection.attribute,
                        orderType: self._sortType,
                        typeSearch: "none"
                    }
                }});
            }
            tooltip.hide("fast");
        });
    },

    showRecordsMenu: function (ev, $parent) {
        var self = this;
        var $content = self.getContent();
        var template = self.getTemplate("recordsMenu");
        var tooltip = template.render({});

        if ($(".sortbar-records-box-menu", $parent).length) {
            $(".sortbar-records-box-menu", $parent).remove();
        }

        $parent.append(tooltip);
        tooltip.show("fast", function () {
            tooltip.click(function (e) {
                e.stopPropagation();
            });
            $(document).one("click", function () {
                tooltip.hide("fast");
                tooltip.remove();
            });
        });

        //Configure handler to each action
        $content.find(".sortbar-records-option").on("click", function (ev) {

            var pageSize = Number(bizagi.util.trim(this.textContent));

            $(".sortbar-records-selected", $parent).text(pageSize);

            self.pub("notify", {
                type: "SET-RECORDS", args: {
                    pageSize: pageSize
                }
            });

            tooltip.hide("fast");
        });
    },

    /**
     * Asigna los parametros iniciales de la busqueda e inicializa los objetos
     * @param e
     * @param params
     */
    initializeAndProcessFilterButton: function (e, params) {
        var self = this;

        self.showingFiltering = false;
        self.setVisibleCheckAll(false);

        self.restoreOrderSelected();
        self.setIconSortType($(".sortbar-az", self.content), "desc");
        self.params = params.args;
        self.sortSelection = {};

        self.processAddButton(e, params);
    },

    /**
     *  Checks if the add button should be displayed
     */
    processAddButton: function (ev, params) {
        var self = this,
            $content = self.getContent(),
            args = params.args,
            action = args.action,
            $buttonContainer = $content.find(".sortbar-left .add-button");
        self._lastReferenceEntity = args.reference;
        $buttonContainer.children().remove();
        $(".wrapper-sortbar-actions", $content).remove();//Remove same time buttons batch actions
        self._haveAddButton = false;
        if (args.reference && args.referenceType !== "ENTITY") {
            $buttonContainer.startLoading({ delay: 0, overlay: true });
            self.dataService.getProcessAddAction(params).done(function (data) {
                if(self._lastReferenceEntity === data.referenceEntity){
                    if (typeof data !== "undefined" && Object.getOwnPropertyNames(data).length > 1 && data.guidEntity && data.id) {
                        self.renderButton($buttonContainer, data);
                    }
                }
            }).always(function () {
                $buttonContainer.endLoading();
            });
        }
        else if (action) {
            self.renderButton($buttonContainer, action);
        }
    },

    /**
     *
     */
    renderButton: function ($buttonContainer, action) {
        var self = this,
            template = self.getTemplate("addButton"),
            $addButton = template.render({ action: action });

        $buttonContainer.empty();
        $addButton.appendTo($buttonContainer);
        self._haveAddButton = true;
        self.behaviorVisibleSortbar();
        $addButton.on("click", function () { self.clickAddButton(action); });
    },

    /**
     * Click on add Proccess btn
     */
    clickAddButton: function (action) {
        var self = this;

        $.when(self.dataService.getMapping({
            guidEntity: action.guidEntity,
            accumulatedContext: self.accumulatedcontext.getContext({}),
            xpathContext: (action.type === "Process") ? action.xpathContext : ""
        })).done(function (mappingData) {
            if (action.type === "Process") {
                self.onExecuteProcess(action, mappingData);
            }
            else {
                self.onExecuteForm(action, mappingData);
            }
        });
    },

    /**
     * Check or uncheck all registers related, could be cases or data
     */
    onCheckUncheck: function(ev){
        var self = this;
        var $target = $(ev.target);
        var isChecked = $target.is(":checked");
        var commonActions = self.pub("notify", {type: "SET-VALUES", args: {value: isChecked}})[0];

        self.enableBatchActions({ args: { commonActions: commonActions } });
    },

    /**
     * Enabled / disables the batch actions. This method is called always update data
     */
    enableBatchActions: function (params) {
        var self = this;
        var args = params.args;
        var commonActionsModel = self.commonActionsmodel = args.commonActions;
        var actions = self.validActions(commonActionsModel.actions);
        if(actions.length > 0 || self._haveAddButton ){
            $(self.getContent()).show();
        }
        self.showBatchActions(actions, commonActionsModel, "batchAction");

        if (commonActionsModel.checkAll !== undefined) {
            self.$checkAll.prop("checked", commonActionsModel.checkAll);
        }
    },

    /**
     * Show batch actions
     * @param actions
     * @param commonActionsModel
     * @param typeActions
     */
    showBatchActions: function (actions, commonActionsModel, typeActions){
        var self = this;
        var $content = self.getContent();
        var template = self.getTemplate("actions");

        self.showSelectedItems(Object.keys(commonActionsModel.itemsSelected).length);

        var moreActions = actions.slice(3, 9999);

        var $actions = template.render({actions: actions.slice(0, 3), moreActions: moreActions, typeActions: typeActions});

        $(".wdg-tple-button.batchAction", self.content).off("click", $.proxy(self.onClickBatchAction, self));

        $(".wrapper-sortbar-actions", $content).remove();
        $(".sortbar-left .sortbar-menu", $content).append($actions);

        $(".wdg-tple-button.batchAction", self.content).on("click", $.proxy(self.onClickBatchAction, self));

        if(moreActions.length > 0){
            if(self.content.data('ui-tooltip')) {
                $(self.content).tooltip("destroy");
            }

            $(self.content).tooltip({
                tooltipClass: "sortbar-tooltip-more-actions",
                items: ".bz-actions-showmore",
                content: $(".template-box-tooltip", self.content).html(),
                open: function(event, ui)
                {
                    $(".wdg-tple-button.batchAction", ui.tooltip).on("click", $.proxy(self.onClickBatchAction, self));

                    var uiTooltip = $('div.ui-tooltip');

                    if (typeof(event.originalEvent) === 'undefined')
                    {
                        uiTooltip.remove();
                        return false;
                    }
                    var $id = $(ui.tooltip).attr('id');
                    // close any lingering tooltips
                    uiTooltip.not('#' + $id).remove();
                    // ajax function to pull in data and add it to the tooltip goes here

                    for(var keyActionGuid in self.requestsInProgressActionGuid){
                        if(self.requestsInProgressActionGuid[keyActionGuid]){
                            var $buttonAction = $("li[data-guid='" + keyActionGuid + "']", ui.tooltip);
                            self.addLoadingButtonAction($buttonAction);
                        }
                    }
                },
                close: function(event, ui)
                {
                    ui.tooltip.hover(function()
                        {
                            $(this).stop(true).fadeTo(400, 1);
                        },
                        function()
                        {
                            $(this).fadeOut('400', function()
                            {
                                $(".wdg-tple-button.batchAction", this).off("click", $.proxy(self.onClickBatchAction, self));
                                $(this).remove();
                            });
                        });
                }
            });
        }
    },

    /**
     * Define the data on order to show the sort options
     * @param ev
     * @param params
     */
    setFiltersSortData: function (ev, params) {
        var self = this;
        var filtersAppliedCounter = params.args.filtersAppliedCounter;
        var totalRecords = params.args.totalRecords;
        self._filters = params.args.calculateFilters ? params.args.filters : self._filters;

        if (params.args.calculateFilters) {
            var i = -1, a, filterCounter = 0, sortCounter = 0;
            while (a = self._filters[++i]) {
                if (a.type != "Text" && a.type !== "Link" && a.data && ((a.data.defaultValues && a.data.defaultValues.length > 0) || (a.data.min && a.data.max))) {
                    filterCounter++;
                }
                if (a.display !== "") {
                    sortCounter++;
                }
            }

            if (totalRecords > 0) {
                // Si existen filtros, muestre el boton
                if (filterCounter > 0) {
                    self.showFilterButton();
                }
                else {
                    self.hideFilterButton();
                }
                // Si existen filtros que tienen display name, muestre los botones de sort
                if (sortCounter > 0) {
                    self.showSortButtons();
                }
                else {
                    self.hideSortButtons();
                }
            }
            // Si no hay registros y ni se ha aplicado ningun filtro ocultar
            // los botones del sortbar
            else if (filtersAppliedCounter === 0) {
                self.hideFilterButton();
                self.hideSortButtons();
            }
        }
        self.updateCounter(filtersAppliedCounter);
    },

    /**
     * Show Filter Button
     */
    showFilterButton: function () {
        var self = this;
        $(".filter-icon", self.getContent()).show();
    },

    /**
     * Hide Filter Button
     */
    hideFilterButton: function () {
        var self = this;
        $(".filter-icon", self.getContent()).hide();
        self.showingFiltering = false;
        self.behaviorVisibleSortbar();
    },

    /**
     * Show Sort Buttons
     */
    showSortButtons: function () {
        var self = this;
        $(".sortbar-text", self.getContent()).show();
        $(".sortbar-icon", self.getContent()).show();
        $(".sortbar-az", self.getContent()).show();

        self.showingSorting = true;
        self.showingFiltering = true;
        self.behaviorVisibleSortbar();
    },

    /**
     * Hide Sort Buttons
     */
    hideSortButtons: function () {
        var self = this;
        var $sortbarIcon = $(".sortbar-az", self.getContent());

        // Restore initial settings
        $(".sortbar-text", self.getContent()).hide();

        $sortbarIcon.addClass("disabled");
        $sortbarIcon.removeClass("bz-icon-order-ascendant-outline");
        $sortbarIcon.removeClass("bz-icon-order-descendant-outline");
        $sortbarIcon.addClass("bz-icon-order-ascendant-outline");
        $sortbarIcon.hide();

        self.showingSorting = false;
        self.behaviorVisibleSortbar();
    },

    /**
     * Restore Order by Option
     */
    restoreOrderSelected: function(){
        var self = this;
        $(".sortbar-selected", self.getContent()).text(self.getResource("workportal-my-search-order-by"));
    },

    /**
     * Set number filters
     * @param params
     */
    updateCounterByFilterApplied: function(params){
        var self = this;
        if(params.args.filtersApplied){
            self.updateCounter(params.args.filtersApplied.length);
        }
    },

    /**
     *
     * @param counter
     */
    updateCounter: function (counter) {
        var self = this,
            $content = self.getContent(),
            $counter = $(".counter-filters-applied", $content);

        if (counter > 0) {
            $counter.html(counter);
            $counter.show();
        }
        else {
            $counter.hide();
        }
    },

    /**
     *
     */
    hideFilterButtonAndBar: function () {
        var self = this;
        self.showingFilter = false;
        $(".filter-icon", self.getContent()).hide();
        self.pub("notify", { type: "CLOSE-MYSEARCHFILTER", args: {"show": false, "$target": null}});
    },

    /**
     * Creates a new case, it could has start form or not
     */
    onExecuteProcess: function (action, mappingData) {
        var self = this;

        if (action.startForm) {
            action.hasStartForm = action.startForm;
        }

        $.when(self.processActionService.executeProcessAction({
            action: action,
            mappingData: mappingData
        })).done( function () {
            self.loadTemplateData(action);
        });
    },

    /**
     *
     * @param action
     */
    loadTemplateData: function (action) {
        var self = this;
        self.pub("notify", { type: "TEMPLATEENGINE-VIEW", args: {action: action, isRefresh: true}});
    },

    /**
     *
     */
    onExecuteForm: function (action, mappingData) {
        var self = this;

        $.when(self.processActionService.executeFormAction({
            action: action,
            mappingData: mappingData
        })).done(function (data) {
            if (data.refresh) {
                self.pub("notify", { type: "UPDATE-DATATEMPLATE-VIEW", args: { action: action, isRefresh: true, calculateFilters: true }});
            }
        });
    },

    /**
     * Returns the action required
     */
    getAction: function (guidAction) {
        var self = this;
        return self.commonActionsmodel.actions.filter( function (action) {
            return action.id == guidAction;
        })[0];
    },

    /**
     * Returns an array with the valid actions
     * @param actions
     * @return {*}
     */
    validActions: function (actions) {
        return $.grep(actions, function (action) {
            if (action.multiplicity == 2) { return true; }
            if (action.mode == "Collection") { return false; }
            if (action.type == "Form") { return false; }
            if (action.isEvent) { return false; }
            if (action.type == "Process" && action.hasStartForm) { return false; }
            return true;
        });
    },

    /**
     * Detach handlers
     */
    clean: function () {
        var self = this,
            $content = self.getContent();
        self.requestsInProgressActionGuid = {};

        if ($content) {
            self.unsub("TEMPLATEENGINE-VIEW");
            self.unsub("ENABLE-BATCHS-ACTIONS");
            self.unsub("SEARCH-ENGINE-VIEW");
            self.unsub("SET-FILTERS-DATA");
            self.unsub("HIDE-FILTER-BUTTONANDBAR");
            self.unsub("HIDE-SORT-BUTTONS");

            self.$checkAll.off("click");
            $content.find(".right-menu").off("click");
            $content.find(".sortbar-az").off("click");
            $content.find(".filter-icon").off("click");
            $content.find(".sortbar-action").off("click");
            $(".wdg-tple-button.batchAction", $content).off("click", $.proxy(self.onClickBatchAction, self));
            $(".remove-selected-items-collections", $content).off("click", $.proxy(self.onRemoveSelectedItemsCollections, self));
        }
    }

});

bizagi.injector.register("bizagi.workportal.widgets.sortbar", ["workportalFacade", "dataService", "processActionService", "accumulatedcontext", bizagi.workportal.widgets.sortbar]);
