/**
 * Document   : Bizagi Workportal Desktop My Search Filter Controller
 * Created on : May 20, 2015, 11:24:00 AM
 * Author     : Andrés Felipe Arenas Vargas
 */
bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.mysearchfilter", {

    /**
     *
     * @param workportalFacade
     * @param dataService
     * @param processActionService
     * @param params
     */
    init: function(workportalFacade, dataService, processActionService, params) {
        var self = this;
        self.params = {};
        self._super(workportalFacade, dataService, params);
        self.loadTemplates({
            "mysearchfilter": bizagi.getTemplate("bizagi.workportal.desktop.widget.mysearchfilter").concat("#mysearchfilter-wrapper"),
            "mysearchfilter-item": bizagi.getTemplate("bizagi.workportal.desktop.widget.mysearchfilter").concat("#mysearchfilter-item")
        }).done(function () {
            self.filterItem = self.getTemplate("mysearchfilter-item");
        });

        self.processActionService = processActionService;
        self.filtersApplied = [];
        self.filters = [];
    },

    /**
     *
     * @returns {*}
     */
    renderContent: function () {
        var self = this;
        self.content = self.getTemplate("mysearchfilter").render({});
        self.content.hide();
        return self.content;
    },

    /**
     *
     */
    postRender: function () {
        var self = this;
        self.configureHandlers();
    },

    /**
     * Asigna los parametros iniciales de la busqueda e inicializa los objetos
     * @param e
     * @param params
     */
    initializeMySearchFilter: function (e, params) {
        var self = this,
            $content = self.getContent();

        self.criteriaSearchApplied = (params.args.filters) ? bizagi.clone(params.args.filters) : [];
        self.filtersApplied = [];
        self.filterControlArray = [];
        self.orderBy = {};
        $(".mysearchfilter-list", $content).empty();
    },

    /**
     *
     */
    configureHandlers: function () {
        var self = this;
        self.sub("TEMPLATEENGINE-VIEW", $.proxy(self.initializeMySearchFilter, self));
        self.sub("SEARCH-ENGINE-VIEW", $.proxy(self.initializeMySearchFilter, self));
        self.sub("OPENCLOSE-MYSEARCHFILTER", $.proxy(self.toggleWidget, self));
        self.sub("CLOSE-MYSEARCHFILTER", $.proxy(self.openCloseWidget, self));
        self.sub("SET-FILTERS-DATA", $.proxy(self.setFiltersData, self));
        self.sub("SET-ORDERBY", $.proxy(self.setOrderBy, self));
        self.sub("SET-RECORDS", $.proxy(self.setRecordsPerPage, self));
    },

    /**
     *
     * @param ev
     * @param params
     */
    setFiltersData: function (ev, params) {
        var self = this;

        if (params.args.defaultFilterApplied) {
            params.args.filtersApplied = params.args.filtersApplied || [];
            var filtersAppliedWithProperties = params.args.filtersApplied.filter(function(filter){
                return typeof filter.properties !== "undefined";
            });
            self.filtersApplied = filtersAppliedWithProperties;
        }

        if (params.args.calculateFilters) {
            var $content = self.getContent();
            var $listContent = $(".mysearchfilter-list", $content);
            var filters = params.args.filters;
            var filtersAppliedCounter = params.args.filtersAppliedCounter;

            var i = -1, a, counter = 0;
            while (a = filters[++i]) {
                if (a.type != "Text" && a.type !== "Link" && a.data && ((a.data.defaultValues && a.data.defaultValues.length > 0) || (a.data.min && a.data.max))) {
                    counter++;
                    break;
                }
            }

            //Si no hay registros y no hay filtros oculta
            if (params.args.totalRecords === 0 && filtersAppliedCounter === 0) {
                self.openCloseWidget({show: false});
            }
            else if (counter === 0) {
                self.openCloseWidget({show: false});
            }
            else {
                self.openCloseWidget({show: true});
            }


            if (self.filterControlArray && self.filterControlArray.length === 0) {
                var i = -1, a;

                while (a = filters[++i]) {
                    a["tmplid"] = a.attribute.replace(".", "-"); //used in mysearchfilter.tmpl.html

                    var foundDefaultFilter = self.filtersApplied.filter(function(defaultFilter){
                        return defaultFilter.properties.type === a.type.toLowerCase() && defaultFilter.properties.xpath === a.tmplid
                    });

                    if(foundDefaultFilter.length > 0){
                        a.filterApplied = "filter-applied";
                    }
                    else{
                        a.filterApplied = "";
                    }
                    var filterItem = self.filterItem.render(a);

                    if (a.type !== "Text" && a.type !== "Link" && a.data && ((a.data.defaultValues && a.data.defaultValues.length > 0) || (a.data.min && a.data.max))) {
                        $listContent.append(filterItem);
                        self.buildFilter(filterItem, a);
                        if(a.filterApplied === "filter-applied"){
                            $(".remove-filter", filterItem).show();
                        }
                    }
                }
            }
            else if (self.filterControlArray && self.filterControlArray.length > 0) {
                var i = -1, a;
                while (a = self.filterControlArray[++i]) {
                    var filter = filters.find(function (el) {
                        return el.attribute === a.xpath;
                    });
                    if (filter) {
                        self.setFilterData(a, filter);
                    }
                }
            }
        }
        $(".filters-loading", self.content).hide();
    },

    /**
     *
     * @param e
     * @param params
     */
    toggleWidget: function (e, params) {
        var self = this;
        var $content = self.getContent();
        var status = $content.is(":visible");

        self.openCloseWidget({show: !status, $target:  params.args.target});
    },

    /**
     *
     * @param params
     */
    openCloseWidget: function (params) {
        var self = this,
            $content = self.getContent(),
            $target = params.$target || $("<div>");

        if (params.show){
            $target.addClass("opened");
            $content.show();
        }
        else{
            $target.removeClass("opened");
            $content.hide();
            $("button#ui-bizagi-cancel-filter").click();
        }
    },

    /**
     *
     * @param $element
     * @param filter
     */
    buildFilter: function ($element, filter) {
        var self = this;
        switch (filter.type) {
            case "Entity":
                self.buildFilterMultiple($element, filter);
                break;
            case "Number":
                self.buildFilterNumber($element, filter);
                break;
            case "Money":
                self.buildFilterMoney($element, filter);
                break;
            case "Datetime":
                self.buildFilterDate($element, filter);
                break;
            /*case "Text":
                self.buildFilterText($element, filter);
                break;*/
            case "Boolean":
                self.buildFilterBoolean($element, filter);
                break;

        }
    },

    /**
     *
     * @param filter
     * @param data
     */
    setFilterData: function (filter, filterData) {
        switch (filter.type) {
            case "Entity":
                filter.widget.multiple("setData", filterData.data);
                break;
            case "Number":
                filter.widget.number("setData", filterData.data);
                break;
            case "Money":
                filter.widget.money("setData", filterData.data);
                break;
            case "Datetime":
                filter.widget.dateFilter("setData", filterData.data);
                break;
            /*case "Text":
                filter.widget.textFilter("setData", data);
                break;*/
            case "Boolean":
                filter.widget.booleanFilter("setData", filterData.data);
                break;

        }
    },

    /*buildFilterText: function ($element, filter) {
        var self = this;
        var textFilter = $element.textFilter({
            properties: filter,
            onApply: function (data) {
                if (data.length !== 0) {
                    self.addFilterSelection(data);
                    self.triggerFilter({calculateFilters: true});
                }
            },
            onClear: function (xpaths) {
                self.removeFilterApplied(xpaths);
                self.triggerFilter({calculateFilters: true});
            },
            getResource: function (key) {
                return bizagi.localization.getResource(key);
            }
        });

        self.filterControlArray.push({type: filter.type, xpath: filter.attribute, widget: textFilter});
    },*/

    /**
     *
     * @param $element
     * @param filter
     */
    buildFilterMoney: function ($element, filter) {
        var self = this;

        var moneyFilter = $element.money({
            showButtonClearFilter: true,
            numericFormat: self.getResource("numericFormat"),
            properties: filter,
            data: filter.data,
            onApply: function (data, element) {
                self.addFilterSelection(data);
                self.triggerFilter({calculateFilters: true});
            },
            onClear: function (xpath) {
                self.removeFilterApplied(xpath);
                self.triggerFilter({calculateFilters: true});
            },
            getResource: function (key) {
                return bizagi.localization.getResource(key);
            }
        });

        self.filterControlArray.push({type: filter.type, xpath: filter.attribute, widget: moneyFilter});
    },

    /**
     *
     * @param $element
     * @param filter
     */
    buildFilterNumber: function ($element, filter) {
        var self = this;
        var numberFilter = $element.number({
            showButtonClearFilter: true,
            numericFormat: self.getResource("numericFormat"),
            properties: filter,
            data: filter.data,
            onApply: function (data, element) {
                if (data.length !== 0) {
                    self.addFilterSelection(data);
                    self.triggerFilter({calculateFilters: true});
                }
            },
            onClear: function (xpath) {
                self.removeFilterApplied(xpath);
                self.triggerFilter({calculateFilters: true});
            },
            getResource: function (key) {
                return bizagi.localization.getResource(key);
            }
        });

        self.filterControlArray.push({type: filter.type, xpath: filter.attribute, widget: numberFilter});
    },

    /**
     *
     * @param $element
     * @param filter
     */
    buildFilterDate: function ($element, filter) {
        var self = this;
        var dateFilter = $element.dateFilter({
            showButtonClearFilter: true,
            properties: filter,
            onApply: function (data, element) {
                self.addFilterSelection(data);
                self.triggerFilter({calculateFilters: true});
            },
            onClear: function (xpaths) {
                self.removeFilterApplied(xpaths);
                self.triggerFilter({calculateFilters: true});
            },
            getResource: function (key) {
                return self.getResource(key);
            }
        });

        self.filterControlArray.push({type: filter.type, xpath: filter.attribute, widget: dateFilter});
    },

    /**
     *
     * @param $element
     * @param filter
     */
    buildFilterMultiple: function ($element, filter) {
        var self = this;
        var multipleFilter = $element.multiple({
            showButtonClearFilter: true,
            properties: filter,
            data: filter.data,
            onApply: function (data, element) {
                self.addFilterSelection(data);
                self.triggerFilter({calculateFilters: true});
            },
            onClear: function (xpath) {
                self.removeFilterApplied(xpath);
                self.triggerFilter({calculateFilters: true});
            },
            getResource: function (key) {
                return bizagi.localization.getResource(key);
            }
        });

        self.filterControlArray.push({type: filter.type, xpath: filter.attribute, widget:multipleFilter});
    },

    /**
     *
     * @param $element
     * @param filter
     */
    buildFilterBoolean: function ($element, filter) {
        var self = this;
        var booleanFilter = $element.booleanFilter({
            showButtonClearFilter: true,
            properties: filter,
            data: filter.data,
            onApply: function (data, element) {
                self.addFilterSelection(data);
                self.triggerFilter({calculateFilters: true});
            },
            onClear: function (xpath) {
                self.removeFilterApplied(xpath);
                self.triggerFilter({calculateFilters: true});
            },
            getResource: function (key) {
                return bizagi.localization.getResource(key);
            }
        });

        self.filterControlArray.push({type: filter.type, xpath: filter.attribute, widget: booleanFilter});
    },

    /**
     *
     * @param data
     */
    addFilterSelection: function (data) {
        var self = this;
        $(".filters-loading", self.content).show();
        for (var i = 0, len = data.length ; i < len; i++) {
            self.removeFilterApplied([data[i].properties.xpath]);
            self.filtersApplied.push(data[i]);
        }
    },

    /**
     *
     * @param xpaths
     */
    removeFilterApplied: function (xpaths) {
        var self = this;

        $(".filters-loading", self.content).show();

        var i = -1, a;
        while(a = xpaths[++i]){
            var filter = self.filtersApplied.find(function (el) {
                return el.properties.xpath === a;
            });
            if (filter){
                self.filtersApplied.splice(self.filtersApplied.indexOf(filter), 1);
            }
        }
    },

    /**
     *
     * @param ev
     * @param params
     */
    setOrderBy: function (ev, params) {
        var self = this;
        self.orderBy = params.args;
        self.triggerFilter({calculateFilters: false});
    },

    setRecordsPerPage: function (ev, params) {
        var self = this;
        self.triggerFilter({ calculateFilters: false, pageSize: params.args && params.args.pageSize });
    },

    /**
     *
     * @param params
     */
    triggerFilter: function (params) {
        var self = this;
        var filtersToSend = self.criteriaSearchApplied ?  bizagi.clone(self.criteriaSearchApplied) : [];
        var searchAppliedCounter = filtersToSend.length;
        var filtersApplied = self.filtersApplied.slice();

        var i = -1, a;
        while(a = filtersApplied[++i]){
            self.dataService.defineFilterObject(a, filtersToSend);
        }

        var filtersAppliedCounter = filtersToSend.length - searchAppliedCounter;

        //Set sort in json to send
        if(self.orderBy.properties){
            self.dataService.defineFilterObject(self.orderBy, filtersToSend);
        }

        var filterParams = {
            type: "UPDATE-DATATEMPLATE-VIEW",
            args: {
                filters: filtersToSend,
                page: 1,
                level: 1,
                calculateFilters: params.calculateFilters || false,
                defaultFilterApplied: false,
                typeSearch: "filter",
                filtersAppliedCounter: filtersAppliedCounter,
                pageSize: params.pageSize || 10
            }
        };

        self.pub("notify", filterParams);
    }
});

bizagi.injector.register("bizagi.workportal.widgets.mysearchfilter", ["workportalFacade", "dataService", "processActionService", bizagi.workportal.widgets.mysearchfilter], false);