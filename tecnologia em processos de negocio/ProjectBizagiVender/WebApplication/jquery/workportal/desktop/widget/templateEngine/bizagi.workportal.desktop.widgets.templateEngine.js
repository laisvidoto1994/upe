/**
 * This widget show information of entities using Template engine
 */
bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.templates", {}, {
    /**
     * Constructor
     * @param workportalFacade
     * @param dataService
     * @param actionService
     * @param accumulatedcontext
     * @param processActionService
     * @param params
     * @param casetoolbar
     * @param usersCasesService
     * @param actionsEventsService
     */
	init: function(workportalFacade, dataService, actionService, casetoolbar, usersCasesService, actionsEventsService, accumulatedcontext, processActionService, params) {
		var self = this;

		// Call base
		self._super(workportalFacade, dataService, params);

		//Load templates
		self.loadTemplates({
			"templateEngine": bizagi.getTemplate("bizagi.workportal.desktop.widget.templateEngine").concat("#templateengine-wrapper"),
			"templateEngineElement": bizagi.getTemplate("bizagi.workportal.desktop.widget.templateEngine").concat("#templateengine-wrapper-element"),
			"templateEngineTooltip": bizagi.getTemplate("bizagi.workportal.desktop.widget.templateEngine").concat("#templateengine-wrapper-tooltip"),
			"templateEmptyData": bizagi.getTemplate("bizagi.workportal.desktop.widget.templateEngine").concat("#templateengine-empty-message")
		});

		//Private fields
        self.selectorCheckboxItems = ".template-box-header input:checkbox";
		self.actionService = actionService;
		self.casetoolbar = casetoolbar;
		self.usersCasesService = usersCasesService;
		self.actionsEventsService = actionsEventsService;
		self.processActionService = processActionService;
		self.accumulatedcontext = accumulatedcontext;
		self._currentPage = 1;
		self.entitiesSelected = {};
	},

	/**
	 * Renders the template defined in the widget
	 * @return {*}
	 */
	renderContent: function() {
		var self = this;
		var template = self.getTemplate("templateEngine");
		self.content = template.render({});

		return self.content;
	},

	/**
	 * links events with handlers
	 */
	postRender: function() {
		var self = this;
        self.configureHandlers();
	},

    /**
     * configure Handlers
     */
    configureHandlers: function () {
        var self = this;
        var $content = self.getContent();

        $content.find("#template-dataviewer-list").on("click", self.selectorCheckboxItems, $.proxy(self.onEntityChecked, self));

        self.sub("GET-COMMON-ACTIONS", $.proxy(self.getCommonActions, self));

        self.sub("TEMPLATEENGINE-VIEW", function(ev, params) {
            self.params.event = "TEMPLATEENGINE-VIEW";
            return self.updateData(params);
        });

        self.sub("SEARCH-ENGINE-VIEW", function(ev, params) {
            self.params.event = "SEARCH-ENGINE-VIEW";
            return self.updateData(params);
        });

        self.sub("UPDATE-DATATEMPLATE-VIEW", function(ev, params) {
            return self.updateData(params);
        });

        self.sub("SET-VALUES", function(ev, params) {
            return self.setValues(params);
        });

        self.actionService.subscribe("onFormActionExecuted", $.proxy(self.onFormActionExecuted, self));
        self.processActionService.subscribe("onFormRuleExecuted", $.proxy(self.onFormRuleExecuted, self));

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
     * Gets entity data and inject it in the defined template
     * @param params
     * @return {*}
     */
    updateData: function(params) {
        var self = this;
        var args = params.args || {};
        var defer = new $.Deferred();

        // Clean the displayed data before getting the new one
        var $dataViewList = $("#template-dataviewer-list", self.getContent());
        $dataViewList.empty();

        self.actionService.init();
        self.entitiesSelected = {};

        self._referrer = args.guidSearch ? "search" : args.referenceType ? "dataNavigation" : self._referrer;
        self._page = args.page || self._page;
        self._totalRecords = args.totalRecords;
        self._filters = args.filters || self._filters;
        self._guidSearch = args.guidSearch || self._guidSearch;
        self._fromActionLauncher = (typeof args.fromActionLauncher !== "undefined") ? args.fromActionLauncher : self._fromActionLauncher;
        self._reference = args.reference || self._reference || "";
        self._surrogateKey = args.surrogateKey || self._surrogateKey;
        self._referenceType = args.referenceType || self._referenceType;
        self._xpath = args.xpath || self._xpath;
        self._guidEntityCurrent = args.guidEntityCurrent || self._guidEntityCurrent;
        self._pageSize = args.pageSize || self._pageSize;

        // Get entity data
        var entityDataParams = {
            guidSearch: self._guidSearch,
            fromActionLauncher: self._fromActionLauncher,
            reference: self._reference,
            surrogateKey: self._surrogateKey,
            referenceType: self._referenceType,
            page: self._page,
            filters: self._filters,
            filtersAppliedCounter: args.filtersAppliedCounter,
            totalRecords: self._totalRecords,
            calculateFilters: typeof args.calculateFilters === "undefined" ?  true : args.calculateFilters,
            defaultFilterApplied: (typeof args.defaultFilterApplied !== "undefined") ? args.defaultFilterApplied : true,
            xpath: self._xpath,
            guidEntityCurrent: self._guidEntityCurrent,
            pageSize: self._pageSize
        };

        $.when(self.getEntityData(entityDataParams)).then(function(data) {
            var deferProcessEntities = $.Deferred();
            if(data && data.reference === self._reference){
                //clone args, because bizagi.navigator.info is referenced to args
                self.pub("notify", {type: "PAGINATOR-UPDATE", args: $.extend(bizagi.clone(args), data, {event: params.type})});
                $.when(self.processEntities($.extend(data, { referenceType: self._referenceType }))).done(function(response){
                    deferProcessEntities.resolve(response, data.reference);
                });
            }
            else{
                deferProcessEntities.reject();
            }
            return deferProcessEntities.promise();

        }).done(function(entitiesData, reference) {
            if(reference === self._reference) {
                self.checkAll = false; //When updateData always uncheck all
                $.when(self.renderEntities(entitiesData, args)).done(function () {
                    self.pub("notify", {
                        type: "ENABLE-BATCHS-ACTIONS",
                        args: {commonActions: self.setValues({args: {value: self.checkAll}})}
                    });
                    defer.resolve(entitiesData);
                });
            }
        });

        return defer.promise();
    },

    /**
     * returns an instance of  the template engine
     * @return {*}
     */
    getTemplateEngine: function() {
        var self = this;

        if (self.templateEngine) {
            return self.templateEngine;
        }

        var renderDataService = new bizagi.render.services.service({proxyPrefix: bizagi.RPproxyPrefix});
        var renderFactory = new bizagi.rendering.desktop.factory(renderDataService);
        var defer = new $.Deferred();

        $.when(renderFactory.initAsyncStuff()).done( function() {
            self.templateEngine = new bizagi.templateEngine({
                renderFactory: renderFactory,
                cache: true,
                router: self.router
            });

            self.templateEngine.subscribe("onLoadDataNavigation", function(ev, params) {
                var data = params.data || {};
                var args = {
                    reference: data.reference,
                    surrogateKey: data.surrogateKey,
                    referenceType: data.referenceType,
                    histName: data.displayName,
                    guidEntityCurrent: data.guidEntityCurrent,
                    filters: [],
                    page: 1,
                    calculateFilters: true
                };

                if (typeof data.xpath !== "undefined" && data.xpath) {
                    args.xpath = data.xpath;
                }

                self.accumulatedcontext.addContext({ "entityGuid": params.data.guidEntityCurrent, "surrogateKey": [params.data.surrogateKey] });

                var getLevelNavigator = self.pub("notify", {type: "NAVIGATOR_GETLEVEL"});
                var currentLevelNavigator = getLevelNavigator && getLevelNavigator.length > 0 ? parseInt(getLevelNavigator[0]) : 1;

                self.pub("notify", {
                    type: data.contextEvent,
                    args: $.extend(args, {level: currentLevelNavigator + 1})
                });
            });
            defer.resolve(self.templateEngine);
        });
        return defer.promise();
    },

    /**
     * Gets the data related to entity
     * @param params
     * @return {*}
     */
    getEntityData: function (params) {
        var self = this;
        var appliedFilters =  params.filters;
        var filtersAppliedCounter = params.filtersAppliedCounter;
        var calculateFilters = params.calculateFilters;

        if (self._referrer === "search") {
            return self.dataService.getSearchData(params).then(function (data) {
                self.setFiltersData(data.filters, appliedFilters, filtersAppliedCounter, data.totalRecords, calculateFilters, null);
                return $.extend(data, {reference: params.reference});
            });
        }
        else {
            return self.dataService.getCollectionEntityData(params).then(function (data) {
                if(self._reference === data.reference){
                    var totalRecords = data.totalRecords;

                    if (totalRecords > 0) {
                        var referenceType = params.referenceType;
                        if (referenceType === "FACT") {
                            self.dataService.getFiltersEntityData(params).then(function (filtersData) {
                                if(self._reference === filtersData.reference){
                                    self.processFiltersData(filtersData, appliedFilters, filtersAppliedCounter, totalRecords, calculateFilters, params.defaultFilterApplied);
                                    self.updateCounterFiltersApplied(appliedFilters);
                                }
                            }).fail( function () {
                                self.hideSortBar();
                            });
                        }
                        else {
                            self.hideSortBar();
                        }
                    }
                    // There is no data but there is an applied filter
                    else if (filtersAppliedCounter > 0) {
                        self.setFiltersData([], appliedFilters, filtersAppliedCounter, totalRecords, false, null);
                        self.updateCounterFiltersApplied(appliedFilters);
                    }
                    else {
                        self.hideSortBar();
                    }
                    return $.extend(data, {reference: params.reference});
                }
            });
        }
    },

    /**
     *
     */
    hideSortBar: function () {
        var self = this;

        self.pub("notify", { type: "HIDE-SORT-BUTTONS", args: {}});
        self.pub("notify", { type: "HIDE-FILTER-BUTTONANDBAR", args: {}});
    },

    /**
     *
     * @param filtersData
     * @param appliedFilters
     * @param filtersAppliedCounter
     * @param totalRecords
     * @param calculateFilters
     * @param defaultFilterApplied
     */
    processFiltersData: function (filtersData, appliedFilters, filtersAppliedCounter, totalRecords, calculateFilters, defaultFilterApplied) {
        var self = this;

        if (defaultFilterApplied) {
            var appliedFilter = {
                properties: {xpath: "", type: "entity", typeSearch: "exact"},
                value: []
            };
            var a, i = -1, count = 0;
            while (a = filtersData[++i]) {
                var data = a.data;
                if (a.type === "Entity") {
                    var b, j = -1;
                    while (b = data.defaultValues[++j]) {
                        if (b.applied) {
                            appliedFilter.properties.xpath = a.attribute;
                            appliedFilter.value.push({"id": b.id});
                            count++;
                        }
                    }
                }
            }
            if (count > 0) {
                appliedFilters.push(appliedFilter);
            }
            filtersAppliedCounter = (typeof filtersAppliedCounter !== "undefined") ? filtersAppliedCounter + count : count;
            self.setFiltersData(filtersData, appliedFilters, filtersAppliedCounter, totalRecords, calculateFilters, defaultFilterApplied);
        }
        else {
            self.setFiltersData(filtersData, [], filtersAppliedCounter, totalRecords, calculateFilters, null);
        }
    },

    /**
     *
     * @param filters
     * @param filtersApplied
     * @param filtersAppliedCounter
     * @param totalRecords
     * @param calculateFilters
     * @param defaultFilterApplied
     */
    setFiltersData: function (filters, filtersApplied, filtersAppliedCounter, totalRecords, calculateFilters, defaultFilterApplied) {
        var self = this;
        var args = {
            filters: filters || [],
            filtersApplied: filtersApplied,
            filtersAppliedCounter: filtersAppliedCounter || 0,
            totalRecords: totalRecords || 0,
            calculateFilters: calculateFilters || false
        };

        if (defaultFilterApplied) {
            args.defaultFilterApplied = defaultFilterApplied;
        }

        self.pub("notify", {
            type: "SET-FILTERS-DATA",
            args: args
        });
    },

    /**
     * Renders each entity and return a promise, it will be resolved when all entities has been procesed
     * @param data
     * @return {*}
     */
    processEntities: function(data) {
        var self = this;
        var result = [];
        var processEntities = [];
        var defer = new $.Deferred();
        var templateType = (data.referenceType === "ENTITY") ? "Content" : "List";

        if(data.reference === self._reference){
            bizagi.loader.start("rendering").then( function () {
                $.when(self.getTemplateEngine()).then(
                    $.proxy(function(engine){
                        return $.when.apply($, $.map(data.entities, $.proxy(function(entity) {
                            processEntities.push({ surrogateKey: entity.surrogateKey, entityId: entity.guid });

                            var entityData = $.extend(entity, { isDefaultTemplate: entity.guidTemplate === null, templateType: templateType });
                            var paramsRender = {contextEvent: this.params.event};
                            return engine.render(entityData, paramsRender);
                        }, this)));
                    }, self)
                ).done( function() {
                    var templates = $.makeArray(arguments);
                    var tmpl;

                    for (var i = 0, l = data.entities.length; i < l; i++) {
                        tmpl = (l === 1) ? templates[i] : templates[i][0];
                        result.push({tmpl: tmpl, data: data.entities[i]});
                    }

                    //dont repeat request with the same params
                    var requestRepeat = false;
                    if(typeof self.idCasesOfProcessEntitiesPromise !== "undefined" &&
                        self.idCasesOfProcessEntitiesPromise.state() === "pending" &&
                        self.lastParamsSendit &&
                        JSON.stringify(processEntities) === self.lastParamsSendit
                    ){
                        defer.reject();
                        requestRepeat = true;
                    }

                    if(!requestRepeat){
                        // Promesa que retorna id de casos (cuando la entidad es una entidad de proceso) y sera utilizada después
                        // al renderizar el TMPL - ver renderEntities
                        self.lastParamsSendit = JSON.stringify(processEntities);
                        self.idCasesOfProcessEntitiesPromise = self.dataService.getIdCasesOfProcessEntities(processEntities);
                        $.when(self.idCasesOfProcessEntitiesPromise).done(function(){
                            defer.resolve(result);
                        });
                    }
                });
            });
        }
        else{
            defer.reject();
        }

        return defer.promise();
    },

    /**
     * Gets entity data and inject it in the defined template
     * @param entitiesData
     * @param args
     */
    renderEntities: function (entitiesData, args) {
        var self = this;
        var generalDefer = $.Deferred();
        var collectionDeferreds = [];
        var $dataViewList = $("#template-dataviewer-list", self.getContent());
        var entitiesLength = self.entitiesLength = entitiesData.length;
        var $elementsTmpl = $();

        for (var i = 0; i < entitiesLength; i++) {
            var $template = self.renderTemplate(entitiesData[i], false, args);
            $elementsTmpl.push.apply($elementsTmpl, $template);
        }

        if ($elementsTmpl.length > 0) {
            $dataViewList.append($elementsTmpl);
            // Dado que la respuesta de este servicio se puede demorar, primero se renderiza todas las entidades
            // y despues se busca cuales de ellas son entidades de proceso
            collectionDeferreds.push(self.getIdCasesOfProcessEntities(entitiesData, args.fromActionLauncher, $dataViewList));
            $.when.apply($, collectionDeferreds).done(function(){
                generalDefer.resolve();
            });
        }
        else {
            $dataViewList.append(self.getEmptyDataMessage());
            generalDefer.resolve();
        }

        return generalDefer.promise();
    },

    /**
     * returns the template for the current entity
     * @param entity
     * @param isRefresh
     * @param params
     * @return {*}
     */
    renderTemplate: function(entity, isRefresh, params) {
        var self = this;
        var entityData = entity.data || {};
        var surrogateKey = entityData.surrogateKey;
        var guidEntity = entityData.guid;
        var fromActionLauncher = params.fromActionLauncher;

        //Render card tmpl with data
        var $templateData = self.getTemplate("templateEngineElement").render({
            fromActionLauncher: fromActionLauncher,
            guidEntity: guidEntity,
            isChecked: self.checkAll,
            surrogateKey: surrogateKey
        });
        //Render entity tmpl in card tmpl
        $templateData.find("#template").append(entity.tmpl);

        return $templateData;
    },

    /**
     * Get IdCases Of Process Entities and get actions and events
     */
    getIdCasesOfProcessEntities: function (entitiesData, fromActionLauncher, content) {
        var self = this;
        var generalDefer = $.Deferred();

        if(typeof self.collectionGetActionsDeferred === "undefined"){
            self.collectionGetActionsDeferred = [];
        }

        self.idCasesOfProcessEntitiesPromise.then( function (response) {
            var idCases = [];
            var a, i = -1;
            while (a = response[++i]) {
                var idCase = a.caseId;
                if (typeof idCase !== "undefined" && idCase > 0) {
                    var entity = entitiesData.find( function (el) {
                       return el.data.surrogateKey === a.surrogateKey;
                    });

                    if (typeof entity !== "undefined") {
                        var data = entity.data || {};
                        var $cardWrapper = $("#template-box-wrapper-" + data.surrogateKey, content);
                        var $casetoolbar = self.casetoolbar.getCaseToolbar({ casetoolbarData: { idcase: idCase, referrer: "RenderTemplate"}});

                        $(".template-box-header .casetoolbar", $cardWrapper).append($casetoolbar);
                        $(self.selectorCheckboxItems, $cardWrapper).data("caseid", idCase);
                        idCases.push(idCase);
                        $.extend(data, {idCase: idCase});
                    }
                }
            }
            self.actionsEventsService.render(idCases);
        }).always( function () {
            var i = -1, e;
            var countRequest = Object.keys(entitiesData).length;
            if(self.collectionGetActionsDeferred.length > 0){
                self.collectionGetActionsDeferred = [];
            }
            while (e = entitiesData[++i]) {
                var data = e.data || {};
                self.collectionGetActionsDeferred.push(self.getEntityActionsAndEvents(fromActionLauncher, false, data.guidEntity, data.surrogateKey, data.idCase));
            }
            $.when.apply($, self.collectionGetActionsDeferred).done(function () {
                generalDefer.resolve();
                self.collectionGetActionsDeferred = [];
            });


        });
        return generalDefer.promise();
    },

    /**
     * Get Entity Actions and Events
     * @param fromActionLauncher
     * @param guidEntity
     * @param surrogateKey
     * @param idCase
     * @param isRefresh
     */
    getEntityActionsAndEvents: function (fromActionLauncher, isRefresh, guidEntity, surrogateKey, idCase) {
        var self = this;
        var defer = $.Deferred();
        var content = self.getContent();

        // Get Actions and Events only if it does not come from actionlauncher
        if(!fromActionLauncher) {
            setTimeout( function() {
                var $footer = content.find("#template-box-wrapper-" + surrogateKey + " .template-box-footer");
                var params = {
                    actionData: {
                        guidEntity: guidEntity,
                        surrogateKey: surrogateKey
                    },
                    loadEvents: false,
                    isRefresh: isRefresh
                };

                // If there is idCase then loadEvents
                if (typeof idCase !== "undefined" && idCase > 0) {
                    params.actionData.idCase = idCase;
                    params.loadEvents = true;
                }
                // Render loading
                $footer.startLoading({delay: 0, overlay: true});
                // Get actions and events
                $.when(self.actionService.getActionsView(params)).done($.proxy(function (reference, responseActions) {
                    var $actionsView = responseActions.actionsView;
                    var actionsData = responseActions.actionsData;

                    if(reference === self._reference){
                        var $item = content.find("#template-box-wrapper-" + surrogateKey + " .template-box-element .template-box-footer");
                        if ($actionsView) {
                            $item.empty().append($actionsView);

                            if(actionsData.length > 0 && self.getCheckBox($item).data("surrogatekey") != -1){
                                self.showCheckItem($item);
                                self.pub("notify", {
                                    type: "SOME-ITEM-ALLOW-SELECT",
                                    args: {}
                                });
                            }
                            else{
                                self.removeCheckItem($item);
                            }
                        }
                        else{
                            self.removeCheckItem($item);
                        }
                        $footer.endLoading();
                        defer.resolve();
                    }
                }, self, bizagi.clone(self._reference)));
            }, 0);
        }
        return defer.promise();
    },

    /**
     * Get check item by case
     * @param $item
     */
    getCheckBox: function($item){
        var self = this;
        return $item.closest(".template-box-element").find(self.selectorCheckboxItems);
    },

    /**
     * Hide check item
     * @param $item
     */
    removeCheckItem: function($item){
        var self = this;
        self.getCheckBox($item).after("<div></div>").remove();//Add div because CSS with flex
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
	 * Returns the model
	 * @return {{}}
	 */
	getCommonActions: function() {
		var self = this;
		var model = {};

		model.actions = self.actionService.getCommonActions(self.entitiesSelected);
		model.surrogateKeys = [];
		model.checkAll = undefined;

		for (var surrogateKey in self.entitiesSelected) {
			model.surrogateKeys.push(surrogateKey);
		}
		model.guidEntity = (surrogateKey !== undefined) ? self.entitiesSelected[surrogateKey].guidEntity : "";

		if (model.surrogateKeys.length === 0) {
			self.checkAll = false;
			model.checkAll = false;
		}
        else if (model.surrogateKeys.length == self.entitiesLength) {
			self.checkAll = true;
			model.checkAll = true;
		}
        else if(model.surrogateKeys.length !== self.entitiesLength){
            self.checkAll = false;
            model.checkAll = false;
        }

        model.itemsSelected = self.entitiesSelected;

		return model;
	},

	/**
	 * Handler to hold the entities selected
	 * @param ev
	 */
	onEntityChecked: function(ev) {
		var self = this;
		var $target = $(ev.target);
		var surrogateKey = $target.data("surrogatekey");
		var guidentity = $target.data("guidentity");
		var isChecked = $target.is(":checked");
        var caseId = $target.data("caseid");
        var params = {
            surrogateKey: surrogateKey,
            guidEntity: guidentity
        };

        if (typeof caseId !== "undefined" && caseId > 0) {
            params.idCase = caseId;
        }

		self.entitiesSelected[surrogateKey] = params;

		if(!isChecked) {
			delete self.entitiesSelected[surrogateKey];
		}

		self.pub("notify", {type: "ENABLE-BATCHS-ACTIONS", args: {commonActions: self.getCommonActions()}});
	},

	/**
	 * Set current value
	 * @param params
	 * @return {*}
	 */
	setValues: function(params) {
		var self = this;
		var $content = self.getContent();
		var args = params.args || {};
		var isChecked = args.value;

		if($content) {
			self.entitiesSelected = {};
			var $inputs = $content.find(self.selectorCheckboxItems);

			$.map($inputs, function(input) {
				$(input).prop("checked", isChecked);

				if(isChecked) {
					var surrogateKey = $(input).data("surrogatekey"),
						guidentity = $(input).data("guidentity"),
                        idCase = $(input).data("caseid");

					self.entitiesSelected[surrogateKey] = {
						surrogateKey: surrogateKey,
						guidEntity: guidentity,
                        idCase: idCase
					};
				}
			});

			self.checkAll = isChecked;

			return self.getCommonActions();
		}
	},

	/**
	 *
	 * @param ev
	 * @param params
	 */
	onFormActionExecuted: function(ev, params) {
		var self = this;

		if(params.refresh) {
			self.refreshRegister(params);
		}
	},

	/**
	 *
	 * @param ev
	 * @param params
	 */
	onFormRuleExecuted: function(ev, params) {
		var self = this;

		if(params.refresh) {
			self.refreshRegister(params.action);
		}
	},

	/**
	 * Gets data of current register and update it
	 * @param params
	 */
	refreshRegister: function(params) {
		var self = this;
		if (self._referrer == "search") {
			self.updateData({args: {calculateFilters: false}});
		}
		else if (self._referrer == "dataNavigation") {
            // It is necessary to send calculateFilters = true so when the data is modified the min and max of
            // each filter is recalculated
            self.updateData({args: {
                calculateFilters: true
            }});
		}
        else {
			// Get element to refresh
			var idBox = "#template-box-wrapper-" + params.surrogateKey;
			var $templateBox = $(idBox);
			var isChecked = $templateBox.find(".template-box-header > input:checkbox").is(":checked");

			var filters = {
				operator: "",
				filters: [{
					key: "id",
					value: params.surrogateKey
				}]
			};

			$templateBox.startLoading({delay: 250, overlay: true});

			$.when(self.getEntityData({
			    reference: params.reference,
			    surrogateKey: params.surrogateKey,
			    referenceType: params.referenceType,
			    xpath: params.xpath,
			    guidEntityCurrent: params.guidEntityCurrent,
				page: self._page,
				filters: filters
			})).then( function (data) {
                return self.processEntities(data);
            }).done( function (result) {
                var renderedTemplate = self.renderTemplate(result[0], true, params);
                $templateBox.replaceWith(renderedTemplate);
                $templateBox.endLoading();
                // Restore checked value
                if (isChecked) {
                    $templateBox = $(idBox);
                    $templateBox.find(".template-box-header > input").prop("checked", true);
                }
            }).always( function() {
                $templateBox.endLoading();
            });
		}
	},

    /**
     *
     */
    router: function() {
    },

    /**
     * Gets Message when there aren't data
     * @return {*}
     */
    getEmptyDataMessage: function() {
        var self = this;
        var emptyTemplate = self.getTemplate("templateEmptyData");

        return emptyTemplate.render()[0].outerHTML;
    },

    /**
     *
     * @param filtersApplied
     */
    updateCounterFiltersApplied: function(filtersApplied){
        var self = this;
        var counterFilterParams = {
            type: "UPDATE-COUNTER-FILTERS-APPLIED",
            args: {
                filtersApplied: filtersApplied
            }
        };
        self.pub("notify", counterFilterParams);
    },

    /**
     * Detach events
     */
    clean: function() {
        var self = this;
        var $content = self.getContent();

        self._currentPage = 1;
        self.checkAll = false;

        $("#content-wrapper").unbind("scroll");

        if($content) {
            $content.find("#template-dataviewer-list").off("click", self.selectorCheckboxItems);
            self.unsub("TEMPLATEENGINE-VIEW");
            self.unsub("SEARCH-ENGINE-VIEW");
            self.unsub("UPDATE-DATATEMPLATE-VIEW");
            self.unsub("GET-COMMON-ACTIONS");
            self.unsub("SET-VALUES");
            self.actionService.unsubscribe("onFormActionExecuted");
            self.processActionService.unsubscribe("onFormRuleExecuted");
        }
    }
});

bizagi.injector.register("bizagi.workportal.widgets.templates", ["workportalFacade", "dataService", "actionService", "casetoolbar", "usersCasesService", "actionsEventsService","accumulatedcontext", "processActionService", bizagi.workportal.widgets.templates]);