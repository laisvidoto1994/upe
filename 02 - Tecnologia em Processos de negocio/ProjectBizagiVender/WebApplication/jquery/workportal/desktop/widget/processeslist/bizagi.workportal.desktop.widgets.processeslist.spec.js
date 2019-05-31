describe("Widget desktop.widgets.processeslist", function () {
    checkWorkportalDependencies();
    var widget, dataService, workportalFacade, $content;
    var params = {
        "histName": "Pendientes",
        "page": 1,
        "level": 2,
        "route": "pendings",
        "idworkflow": ""
    };
    var processes = {
        "categories": [
            {
                "name": "Todos los procesos",
                "workflows": [
                    {
                        "name": "Todos los casos",
                        "path": "",
                        "category": "Todos los procesos",
                        "isFavorite": false,
                        "guidFavorite": "",
                        "idworkflow": "",
                        "guidWFClass": "",
                        "count": 62
                    }
                ]
            },
            {
                "name": "Processes",
                "workflows": [
                    {
                        "idworkflow": "9",
                        "guidWFClass": "7c159533-d7a2-4053-9bc0-53001ca6dfa4",
                        "name": "Create a Fitness Assesment Session",
                        "path": "App/Processes/",
                        "count": "1",
                        "isFavorite": "false",
                        "icon": "",
                        "category": "Processes",
                        "spriteUrl": "imagen.png",
                        "spritePosition": "0px 0px",
                        "guidFavorite": ""
                    },
                    {
                        "idworkflow": "5",
                        "guidWFClass": "6408c7ac-609f-4da7-96c5-54e978ca1791",
                        "name": "Create a Personal Session",
                        "path": "App/Processes/",
                        "count": "7",
                        "isFavorite": "false",
                        "icon": "",
                        "category": "Processes",
                        "spriteUrl": "imagen.png",
                        "spritePosition": "0px 0px",
                        "guidFavorite": ""
                    },
                    {
                        "idworkflow": "6",
                        "guidWFClass": "19c781fb-1e43-4717-978d-963787e70a4a",
                        "name": "Fitness Assessment",
                        "path": "App/Processes/",
                        "count": "21",
                        "isFavorite": "false",
                        "icon": "",
                        "category": "Processes",
                        "spriteUrl": "imagen.png",
                        "spritePosition": "0px 0px",
                        "guidFavorite": ""
                    },
                    {
                        "idworkflow": "11",
                        "guidWFClass": "24078df7-cc4b-4459-90f7-09a22980bfa1",
                        "name": "New Rutine",
                        "path": "App/Processes/",
                        "count": "1",
                        "isFavorite": "false",
                        "icon": "",
                        "category": "Processes",
                        "spriteUrl": "imagen.png",
                        "spritePosition": "0px 0px",
                        "guidFavorite": ""
                    },
                    {
                        "idworkflow": "12",
                        "guidWFClass": "2a331d74-0c92-4189-9d06-509c28b4e95f",
                        "name": "Schedule Nutrition Appointment",
                        "path": "App/Processes/",
                        "count": "1",
                        "isFavorite": "false",
                        "icon": "",
                        "category": "Processes",
                        "spriteUrl": "imagen.png",
                        "spritePosition": "0px 0px",
                        "guidFavorite": ""
                    },
                    {
                        "idworkflow": "3",
                        "guidWFClass": "ef88e796-81cf-4b9d-87d4-3bf958e4c28d",
                        "name": "Schedule personal trainer",
                        "path": "App/Processes/",
                        "count": "31",
                        "isFavorite": "false",
                        "icon": "",
                        "category": "Processes",
                        "spriteUrl": "imagen.png",
                        "spritePosition": "0px 0px",
                        "guidFavorite": ""
                    }
                ]
            }
        ]
    };

    var processesEmpty = {
        "categories": [
        ]
    };

    beforeEach(function(){
        dataService = bizagi.injector.get("dataService");
        workportalFacade = bizagi.injector.get("workportalFacade");
        widget = new bizagi.workportal.widgets.processeslist(workportalFacade, dataService, params);
    });

    it("Should define the Widget", function(){
        expect(dataService).toBeDefined();
        expect(workportalFacade).toBeDefined();
        expect(widget).toBeDefined();
    });

    describe("Behavior when there is data", function () {
        var promiseRender;
        beforeEach(function(){
            sinon.stub(dataService, "getAllProcesses", function(){
                var defer = new $.Deferred();
                defer.resolve(processes);
                return defer.promise();
            });

            var defer = new $.Deferred();
            promiseRender = defer.promise();

            $.when(widget.areTemplatedLoaded()).then(function(){
                return widget.render();
            }).done(function($content) {
                defer.resolve($content);
            });
        });

        afterEach(function(){
            dataService.getAllProcesses.restore();
        });

        it("Should display the processes list", function() {
            $.when(promiseRender).done( function ($content) {
                expect($content).not.toBe("");
                expect($content).toBeDefined();
            });
        });

        it("Should configure the handlers", function() {
            $.when(promiseRender).done( function ($content) {
                var events = $._data(widget.observableElement[0], "events");
                expect(events["GETIDWORKFLOW_FROM_PROCESSESLIST"]).toBeDefined();
                expect(events["GETHISTNAME_FROM_PROCESSESLIST"]).toBeDefined();
            });
        });

        it("Should get the correct data", function() {
            $.when(promiseRender).done( function ($content) {
                expect(widget.pub("GETIDWORKFLOW_FROM_PROCESSESLIST")).toBe(widget.getIdworkflow());
                expect(widget.pub("GETHISTNAME_FROM_PROCESSESLIST")).toBe(widget.getHistname());
            });
        });

        it("Should go to the case when clicking a collection", function() {
            $.when(promiseRender).done( function ($content) {
                sinon.spy(widget, "pubDeadLockDetection");
                var $process = $(".wdg-process-card", $content)[0];
                $($process).trigger("click");
                expect(widget.pubDeadLockDetection.called).toBe(true);
            });
        });

        it("Should detach the events", function() {
            $.when(promiseRender).done( function ($content) {
                widget.clean();
                var events = $._data(widget.observableElement[0], "events");
                expect(events).toBeUndefined();
            });
        });
    });
    describe("Behavior when there is no data", function () {
        var promiseRender;
        beforeEach(function(){
            sinon.spy(widget, "getEmptyDataMessage");
            sinon.stub(dataService, "getAllProcesses", function(){
                var defer = new $.Deferred();
                defer.resolve(processesEmpty);
                return defer.promise();
            });

            var defer = new $.Deferred();
            promiseRender = defer.promise();

            $.when(widget.areTemplatedLoaded()).then(function(){
                return widget.render();
            }).done(function($content) {
                defer.resolve($content);
            });
        });

        it("Should display the form empty message", function() {
            $.when(promiseRender).done( function ($content) {
                expect($content).not.toBe("");
                expect($content).toBeDefined();
                expect(widget.getEmptyDataMessage.called).toBe(true);
            });
        });
    });
});


