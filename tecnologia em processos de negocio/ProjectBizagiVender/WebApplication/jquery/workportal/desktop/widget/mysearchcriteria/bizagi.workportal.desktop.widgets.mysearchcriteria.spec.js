﻿﻿﻿﻿describe("Widget desktop.widgets.mysearchcriteria", function () {
    checkWorkportalDependencies();
    var widget, workportalFacade, dataService, processActionService;

    beforeEach(function () {
        dataService = bizagi.injector.get("dataService");
        workportalFacade = bizagi.injector.get("workportalFacade");
        processActionService = bizagi.injector.get("processActionService");
        widget = new bizagi.workportal.widgets.mysearchcriteria(workportalFacade, dataService, processActionService, {});
    });

    it("Should define the Widget", function(){
        expect(dataService).toBeDefined();
        expect(workportalFacade).toBeDefined();
        expect(processActionService).toBeDefined();
        expect(widget).toBeDefined();
    });

    describe("Behavior initializing the widget", function () {
        var promiseRender;

        beforeEach(function () {
            var defer = new $.Deferred();
            promiseRender = defer.promise();

            $.when(widget.areTemplatedLoaded()).then(function(){
                return widget.render();
            }).done(function($content) {
                defer.resolve($content);
            });
        });

        it("Should render the content", function() {
            $.when(promiseRender).done( function ($content) {
                expect($content).not.toBe("");
                expect($content).toBeDefined();
            });
        });

        it("Should configure the handlers", function() {
            $.when(promiseRender).done( function ($content) {
                var widgetEvents = $._data(widget.observableElement[0], "events");
                var domEvents = $._data( $('.wdg-mysearchcriteria-content', $content)[0], "events" ).click;

                expect(widgetEvents).toBeDefined();
                expect(domEvents).toBeDefined();

                expect(domEvents.length).toBe(2);

                expect(widgetEvents["SEARCH-ENGINE-VIEW"]).toBeDefined();
                expect(domEvents[0].selector).toBe("div.wdg-mysearchcriteria-card span");
                expect(domEvents[1].selector).toBe("div.wdg-mysearchcriteria-card i");
            });
        });
    });

    describe("Behavior making a search", function () {
        var promiseRender;
        var searchParams = {
            "context": "SEARCH-ENGINE-VIEW",
            "data": {
                "widgets": {
                    "templates": {
                        "layout": "content",
                        "name": "bizagi.workportal.widgets.templates"
                    },
                    "paginator": {
                        "layout": "templates",
                        "name": "bizagi.workportal.widgets.paginator",
                        "canvas": "paginator"
                    },
                    "sortbar": {
                        "layout": "templates",
                        "name": "bizagi.workportal.widgets.sortbar",
                        "canvas": "sortbar"
                    },
                    "mysearchfilter": {
                        "layout": "templates",
                        "name": "bizagi.workportal.widgets.mysearchfilter",
                        "canvas": "mysearchfilter"
                    },
                    "sidebar": {
                        "layout": "leftsidebar",
                        "name": "bizagi.workportal.widgets.sidebar"
                    },
                    "mysearchcriteria": {
                        "layout": "sidebar",
                        "name": "bizagi.workportal.widgets.mysearchcriteria",
                        "canvas": "content1"
                    },
                    "rightSidebar": {
                        "layout": "contentrightsidebar",
                        "name": "bizagi.workportal.widgets.right.sidebar"
                    },
                    "empty1": {
                        "layout": "rightSidebar",
                        "name": "bizagi.workportal.widgets.dummy",
                        "canvas": "sidebarcontent1"
                    }
                },
                "nav": {
                    "level": 1
                },
                "belongs": {
                    "toLeftSidebarCD": false,
                    "toRightSidebarCD": false,
                    "toTaskSidebarCD": false
                },
                "level": 0
            },
            "type": "SEARCH-ENGINE-VIEW",
            "args": {
                "guidSearch": "5692210c-c54d-4e65-97c7-801dce3f551f",
                "guidForm": "ea39f757-3c25-49d6-b1d1-55d307b8001c",
                "guidEntity": "954a463f-00ed-44d1-87c6-d8862c14115a",
                "displayname": "Doctors",
                "metadataFilters": [
                    {
                        "xpath": "Specialty",
                        "searchType": "exact",
                        "value": [
                            1
                        ],
                        "id": "67c398ee-1a09-41a9-bc23-18e641b88ac0",
                        "rangeQuery": "none",
                        "displayValue": "Gynecologist",
                        "displayName": "Doctor's speciality"
                    },
                    {
                        "xpath": "associatedUser.fullName",
                        "searchType": "approx",
                        "value": "Cristopher",
                        "id": "2fbdd6ff-277f-4eec-93db-46af4dc0d356",
                        "displayValue": "Cristopher",
                        "displayName": "Doctor's name"
                    }
                ],
                "filters": [
                    {
                        "xpath": "Specialty",
                        "searchType": "exact",
                        "value": [
                            1
                        ]
                    },
                    {
                        "xpath": "associatedUser.fullName",
                        "searchType": "approx",
                        "value": "Cristopher"
                    }
                ],
                "page": 1,
                "pageSize": 10,
                "calculateFilters": true,
                "histName": "Doctors"
            }
        };
        var filters = [
            {
                "xpath": "Specialty",
                "searchType": "exact",
                "value": [
                    1
                ],
                "id": "67c398ee-1a09-41a9-bc23-18e641b88ac0",
                "rangeQuery": "none",
                "displayValue": "Gynecologist",
                "displayName": "Doctor's speciality"
            },
            {
                "xpath": "associatedUser.fullName",
                "searchType": "approx",
                "value": "Cristopher",
                "id": "2fbdd6ff-277f-4eec-93db-46af4dc0d356",
                "displayValue": "Cristopher",
                "displayName": "Doctor's name"
            },
            {
                "xpath": "DateTime",
                "searchType": "range",
                "value": {
                    "min": "12/01/2015",
                    "max": "12/01/2015"
                },
                "id": "9be1c3b1-b81b-42dc-a2b4-fb5bca55c941",
                "rangeQuery": "from",
                "displayValue": "12/1/2015",
                "displayName": "Date From"
            },
            {
                "xpath": "DateTime",
                "searchType": "range",
                "value": {
                    "min": "12/01/2015",
                    "max": "12/31/2015"
                },
                "id": "65264297-850f-4297-99ae-f1344222f98d",
                "rangeQuery": "to",
                "displayValue": "12/31/2015",
                "displayName": "Date To"
            }
        ];

        beforeEach(function () {
            var defer = new $.Deferred();
            promiseRender = defer.promise();

            $.when(widget.areTemplatedLoaded()).then(function(){
                return widget.render();
            }).done(function($content) {
                defer.resolve($content);
            });
        });

        it("Should process and render the search filters into criterias", function() {
            $.when(promiseRender).done( function ($content) {
                widget.pub("SEARCH-ENGINE-VIEW", searchParams);
                var $listContent = $(".wdg-mysearchcriteria-list", $content);

                expect($listContent).toBeDefined();
                expect($listContent.length).toBe(2);
            });
        });

        it("Should open the dialog with the queryform", function() {
            $.when(promiseRender).done( function ($content) {
                widget.pub("SEARCH-ENGINE-VIEW", searchParams);
                $("div.wdg-mysearchcriteria-card span:first", $content).trigger("click");
                expect($(".ui-dialog")).toBeDefined();
            });
        });

        it("Should pre process the filters and it´s values", function() {
            $.when(promiseRender).done( function ($content) {
                widget.pub("SEARCH-ENGINE-VIEW", searchParams);
                var processedValues = widget.preProcessValues(filters);
            });
        });

        it("Should remove the filters appllied", function() {
            $.when(promiseRender).done( function ($content) {
                sinon.spy(widget, "removeFilterApplied");
                sinon.spy(widget, "performQuery");

                widget.pub("SEARCH-ENGINE-VIEW", searchParams);

                var $listContent = $(".wdg-mysearchcriteria-list", $content);
                expect($listContent).toBeDefined();
                expect($listContent.length).toBe(2);

                var hompePortalWidget = new bizagi.workportal.widgets.homeportal(workportalFacade, dataService, {});
                $("div.wdg-mysearchcriteria-card i:first", $content).trigger("click");

                expect(widget.removeFilterApplied.calledWith("Specialty")).toBe(true);
                expect(widget.performQuery.called).toBe(true);
            });
        });
    });
});

