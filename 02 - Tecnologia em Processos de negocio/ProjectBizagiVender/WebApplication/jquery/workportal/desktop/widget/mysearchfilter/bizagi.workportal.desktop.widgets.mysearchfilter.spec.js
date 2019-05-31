describe("Widget bizagi.workportal.desktop.widgets.mysearchfilter", function () {
    checkWorkportalDependencies();
    var widget, workportalFacade, dataService, processActionService;
    var params = {};
    var searchEngineParams = {
        "context": "SEARCH-ENGINE-VIEW",
        "args": {
            "guidSearch": "5692210c-c54d-4e65-97c7-801dce3f551f",
            "guidForm": "ea39f757-3c25-49d6-b1d1-55d307b8001c",
            "guidEntity": "954a463f-00ed-44d1-87c6-d8862c14115a",
            "displayname": "Doctors",
            "metadataFilters": [],
            "filters": [],
            "page": 1,
            "pageSize": 10,
            "calculateFilters": true,
            "histName": "Doctors"
        }
    };
    var setFilterParams = {
        "type": "SET-FILTERS-DATA",
        "args": {
            "filters": [
                {
                    "attribute": "associatedUser.fullName",
                    "display": "32fde23c-7597-4c4c-ac96-4bd2fed9d653:DisplayName",
                    "type": "Text",
                    "data": {}
                },
                {
                    "attribute": "Age",
                    "display": "Age",
                    "type": "Number",
                    "data": {
                        "min": "30",
                        "max": "40"
                    }
                },
                {
                    "attribute": "associatedUser.enabled",
                    "display": "Enabled",
                    "type": "Boolean",
                    "data": {
                        "defaultValues": [
                            {
                                "id": "1",
                                "displayName": "True"
                            },
                            {
                                "id": "2",
                                "displayName": "False"
                            }
                        ]
                    }
                },
                {
                    "attribute": "Sex",
                    "display": "Sex",
                    "type": "Entity",
                    "data": {
                        "defaultValues": [
                            {
                                "id": "1",
                                "displayName": "Male"
                            },
                            {
                                "id": "2",
                                "displayName": "Female"
                            }
                        ]
                    }
                },
                {
                    "attribute": "Price",
                    "display": "Precio",
                    "type": "Money",
                    "data": {
                        "min": "1000",
                        "max": "2000"
                    }
                },
                {
                    "attribute": "Datetime",
                    "display": "Date",
                    "type": "Datetime",
                    "data": {
                        "defaultValues": [
                            {
                                "id": "1",
                                "displayName": "Date"
                            }
                        ],
                        "min": "8/18/2015",
                        "max": "8/19/2015"
                    }
                }
            ],
            "filtersApplied": [],
            "filtersAppliedCounter": 0,
            "totalRecords": 8,
            "calculateFilters": true
        },
        "context": "SET-FILTERS-DATA"
    };
    var setFiltersAppliedParams = {
        "type": "SET-FILTERS-DATA",
        "args": {
            "filters": [
                {
                    "attribute": "associatedUser.fullName",
                    "display": "32fde23c-7597-4c4c-ac96-4bd2fed9d653:DisplayName",
                    "type": "Text",
                    "data": {}
                },
                {
                    "attribute": "Age",
                    "display": "Age",
                    "type": "Number",
                    "data": {
                        "min": "30",
                        "max": "40"
                    }
                },
                {
                    "attribute": "associatedUser.enabled",
                    "display": "Enabled",
                    "type": "Boolean",
                    "data": {
                        "defaultValues": [
                            {
                                "id": "1",
                                "displayName": "True"
                            },
                            {
                                "id": "2",
                                "displayName": "False"
                            }
                        ]
                    }
                },
                {
                    "attribute": "Sex",
                    "display": "Sex",
                    "type": "Entity",
                    "data": {
                        "defaultValues": [
                            {
                                "id": "1",
                                "displayName": "Male"
                            },
                            {
                                "id": "2",
                                "displayName": "Female"
                            }
                        ]
                    }
                },
                {
                    "attribute": "Price",
                    "display": "Precio",
                    "type": "Money",
                    "data": {
                        "min": "1000",
                        "max": "2000"
                    }
                },
                {
                    "attribute": "Datetime",
                    "display": "Date",
                    "type": "Datetime",
                    "data": {
                        "defaultValues": [
                            {
                                "id": "1",
                                "displayName": "Date"
                            }
                        ],
                        "min": "8/18/2015",
                        "max": "8/19/2015"
                    }
                }
            ],
            "filtersApplied": [
                {
                    "xpath": "Sex",
                    "searchType": "exact",
                    "value": [
                        1
                    ]
                },
                {
                    "xpath": "DateTime",
                    "searchType": "range",
                    "value": {
                        "min": "8/18/2015",
                        "max": "8/19/2015"
                    }
                }
            ],
            "filtersAppliedCounter": 2,
            "totalRecords": 8,
            "calculateFilters": true
        },
        "context": "SET-FILTERS-DATA"
    };
    var toggleParams = {
        "type": "OPENCLOSE-MYSEARCHFILTER",
        "args": {
            "guidSearch": "dbf13648-6b43-4355-b102-8d63abc63e1a",
            "target": null
        },
        "context": "OPENCLOSE-MYSEARCHFILTER"
    };
    var sortParams = {
        "type": "SET-ORDERBY",
        "args": {
            "properties": {
                "xpath": "DateTime",
                "orderType": "asc",
                "typeSearch": "none"
            }
        },
        "context": "SET-ORDERBY"
    };

    beforeEach(function () {
        workportalFacade = bizagi.injector.get("workportalFacade");
        dataService = bizagi.injector.get("dataService");
        processActionService = bizagi.injector.get("processActionService");
        widget = new bizagi.workportal.widgets.mysearchfilter(workportalFacade, dataService, processActionService, params);
    });

    it("Should define the Widget", function(){
        expect(dataService).toBeDefined();
        expect(workportalFacade).toBeDefined();
        expect(processActionService).toBeDefined();
        expect(widget).toBeDefined();
    });

    describe("Behavior when mysearchfilter is initialize", function(){
        var promiseRender;

        beforeEach(function(){
            var defer = new $.Deferred();
            promiseRender = defer.promise();

            $.when(widget.areTemplatedLoaded()).then(function(){
                return widget.render();
            }).done(function($content) {
                defer.resolve($content);
            });
        });

        it("Should render the bar", function() {
            $.when(promiseRender).done( function ($content) {
                expect($content).not.toBe("");
                expect($content).toBeDefined();
            });
        });

        it("Should define the events", function() {
            $.when(promiseRender).done( function ($content) {
                var events = $._data(widget.observableElement[0], "events");

                expect(events["TEMPLATEENGINE-VIEW"]).toBeDefined();
                expect(events["SEARCH-ENGINE-VIEW"]).toBeDefined();
                expect(events["OPENCLOSE-MYSEARCHFILTER"]).toBeDefined();
                expect(events["SET-FILTERS-DATA"]).toBeDefined();
                expect(events["SET-ORDERBY"]).toBeDefined();
            });
        });

        it("Should toggle the widget", function() {
            $.when(promiseRender).done( function ($content) {
                widget.pub("TEMPLATEENGINE-VIEW", searchEngineParams);
                widget.pub("SET-FILTERS-DATA", setFilterParams);

                expect($content.css("display")).toBe("block");
                widget.openCloseWidget({"show": false, "$target": null});
                expect($content.css("display")).toBe("none");
                widget.pub("OPENCLOSE-MYSEARCHFILTER", toggleParams);
            });
        });

        it("Should define the filters to show and its data", function() {
            $.when(promiseRender).done( function ($content) {
                // Init the widget
                widget.pub("TEMPLATEENGINE-VIEW", searchEngineParams);

                // Check that the data was initialice
                expect(widget.criteriaSearchApplied.length).toBe(0);
                expect(widget.filtersApplied.length).toBe(0);
                expect(widget.filterControlArray.length).toBe(0);
                expect(widget.orderBy).toBeDefined();

                // Set filters
                widget.pub("SET-FILTERS-DATA", setFilterParams);

                // Check that the filters was rendered
                var $listContent = $(".mysearchfilter-list", widget.getContent());
                expect($listContent.length).toBe(1);
                expect($(".wgd-my-search-filter", $listContent).length).toBe(5);
                expect(widget.filterControlArray.length).toBe(5);

                // Check each filter
                expect($(".wgd-my-search-filter:nth-child(1)", $listContent).data("type")).toBe("Number");
                expect($(".wgd-my-search-filter:nth-child(1)", $listContent).data("attribute")).toBe("Age");
                expect($(".wgd-my-search-filter:nth-child(2)", $listContent).data("type")).toBe("Boolean");
                expect($(".wgd-my-search-filter:nth-child(2)", $listContent).data("attribute")).toBe("associatedUser.enabled");
                expect($(".wgd-my-search-filter:nth-child(3)", $listContent).data("type")).toBe("Entity");
                expect($(".wgd-my-search-filter:nth-child(3)", $listContent).data("attribute")).toBe("Sex");
                expect($(".wgd-my-search-filter:nth-child(4)", $listContent).data("type")).toBe("Money");
                expect($(".wgd-my-search-filter:nth-child(4)", $listContent).data("attribute")).toBe("Price");
                expect($(".wgd-my-search-filter:nth-child(5)", $listContent).data("type")).toBe("Datetime");
                expect($(".wgd-my-search-filter:nth-child(5)", $listContent).data("attribute")).toBe("Datetime");
            });
        });

        it("Should apply the filter and remove a filter applied", function() {
            $.when(promiseRender).done( function ($content) {
                widget.pub("TEMPLATEENGINE-VIEW", searchEngineParams);
                widget.pub("SET-FILTERS-DATA", setFilterParams);

                var dateFilter = [
                    {
                        "properties": {
                            "xpath": "DateTime@from",
                            "type": "date",
                            "typeSearch": "range",
                            "rangeQuery": "from"
                        },
                        "value": "8/18/2015"
                    },
                    {
                        "properties": {
                            "xpath": "DateTime@to",
                            "type": "date",
                            "typeSearch": "range",
                            "rangeQuery": "to"
                        },
                        "value": "8/19/2015"
                    }
                ];

                var entityFilter = [
                    {
                        "properties": {
                            "xpath": "Sex",
                            "type": "entity",
                            "typeSearch": "exact"
                        },
                        "value": [
                            {
                                "id": "1"
                            }
                        ]
                    }
                ];

                // Apply date filter and trigger the filter
                widget.addFilterSelection(dateFilter);
                widget.triggerFilter({calculateFilters: true});

                // Check that the filter was applied and the data was not altered
                expect(widget.filtersApplied.length).toBe(dateFilter.length);
                expect(widget.filtersApplied[0].properties.xpath).toBe(dateFilter[0].properties.xpath);
                expect(widget.filtersApplied[1].properties.xpath).toBe(dateFilter[1].properties.xpath);
                expect(widget.filterControlArray.length).toBe(5);
                expect(widget.orderBy).toBeDefined();

                // Apply entity filter and trigger the filter
                widget.addFilterSelection(entityFilter);
                widget.triggerFilter({calculateFilters: true});

                // Check that the filter was applied and the data was not altered
                expect(widget.filtersApplied.length).toBe(dateFilter.length + entityFilter.length);
                expect(widget.filtersApplied[2].properties.xpath).toBe(entityFilter[0].properties.xpath);
                expect(widget.filterControlArray.length).toBe(5);
                expect(widget.orderBy).toBeDefined();

                // Trigger set filters data
                widget.pub("SET-FILTERS-DATA", setFiltersAppliedParams);

                // Remove filter applied
                widget.removeFilterApplied(["Sex"]);
                widget.triggerFilter({calculateFilters: true});

                // Check that the filter was removed and the data was not altered
                expect(widget.filtersApplied.length).toBe(2);
                expect(widget.filterControlArray.length).toBe(5);
                expect(widget.orderBy).toBeDefined();

                // Remove filter applied
                widget.removeFilterApplied(["DateTime@from","DateTime@to"]);
                widget.triggerFilter({calculateFilters: true});

                // Check that the filter was removed and the data was not altered
                expect(widget.filtersApplied.length).toBe(0);
                expect(widget.filterControlArray.length).toBe(5);
                expect(widget.orderBy).toBeDefined();

                // Trigger set filters data
                widget.pub("SET-FILTERS-DATA", setFilterParams);
            });
        });

        it("Should define sort the data", function() {
            $.when(promiseRender).done( function ($content) {
                widget.pub("TEMPLATEENGINE-VIEW", searchEngineParams);
                widget.pub("SET-FILTERS-DATA", setFilterParams);

                sinon.spy(widget, "triggerFilter");

                widget.pub("SET-ORDERBY", sortParams);

                expect(widget.triggerFilter.called).toBe(true);

                // Check that the sort was applied and the data was not altered
                expect(widget.filtersApplied.length).toBe(0);
                expect(widget.filterControlArray.length).toBe(5);

                // Check that sort was applied correctly
                expect(widget.orderBy).toBeDefined();
                expect(widget.orderBy.properties.xpath).toBe(sortParams.args.properties.xpath);
                expect(widget.orderBy.properties.orderType).toBe(sortParams.args.properties.orderType);
            });
        });
    });
});
