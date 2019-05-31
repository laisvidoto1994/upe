describe("Widget desktop.widgets.createcase", function () {
    var widget;
    var params = {
        "operation": "process",
        "guidObject": "eff59e3a-3bf6-45ae-acd6-5c9278ef79c0",
        "idObject": 13,
        "mapping": [{ xpath: "InscripcionAsignatura.Asignatura", surrogateKey: [251] }]
    };

    checkWorkportalDependencies();

    it("Environment has been defined", function (done) {
        widget = new bizagi.workportal.widgets.createcase(dependencies.workportalFacade, dependencies.dataService, params);

        $.when(widget.areTemplatedLoaded()).then( function () {
            return widget.renderContent();
        }).done(function ($content) {
            dependencies.canvas.empty();
            dependencies.canvas.append($content);

            expect($content).not.toBe("");
            expect($content).toBeDefined();

            done();
        });
    });

    it("Widget should have a _getRenderingFacade method", function () {
        expect(widget._getRenderingFacade()).toBeDefined();
    });

    describe("Getting the start form ", function () {
        beforeEach(function () {
            widget._processId = 13;
        });

        it("The start form should be rendered", function (done) {
            sinon.spy(widget, "_getServiceParams");

            $.when(widget.postRender()).done(function ($content) {
                expect($content).toBeDefined();
                expect($(".ui-bizagi-container-form", $content).length).toEqual(1);
                expect(widget._getServiceParams.called).toBe(true);
                widget._getServiceParams.restore();
                done();
            });
        });
        
        it("The form service should be called with the necessary parameters", function () {
            var serviceParams = widget._getServiceParams();

            expect(serviceParams["h_action"]).toEqual("LOADSTARTFORM");
            expect(serviceParams["h_idProcess"]).toEqual(widget._processId);
            expect(serviceParams["InscripcionAsignatura.Asignatura"]).toEqual("[251]");
        });
    });

    describe("Action type collection", function(){
        beforeEach(function () {
            widget._isMultiInstance = true;
        });

        it("the notation '[]' should be to add after the xpath, to indicate a collection", function(){
            var serviceParams = widget._getServiceParams();

            expect(serviceParams["h_action"]).toEqual("LOADSTARTFORM");
            expect(serviceParams["h_idProcess"]).toEqual(widget._processId);
        })

        afterEach(function() {
            widget._isMultiInstance = false;
        })
    });

    describe("Before start form is displayed", function(){
        var $canvas;
       
        beforeEach(function () {
            $canvas = widget._getCanvasForm();
        });

        it("Canvas should has a event handler linked", function(){
            var events = $._data($canvas[0], "events");
            
            expect(events["routing"]).toBeDefined();
        });

        it ("When routing event is invoked the handler onCaseCreated should be called", function(){
            spyOn(widget, "pub");
            $canvas.trigger("routing", {});

            expect(widget.pub).toHaveBeenCalled();
            expect(widget.pub).toHaveBeenCalledWith("closeDialog", {});
        });
    });

    describe("Getting the start form with parent case", function () {
        beforeEach(function () {
            widget._idParentCase = 1;
            widget._mappingstakeholders = true;
            widget._guidprocess = "eff59e3a-3bf6-45ae-acd6-5c9278ef79c0";
        });

        it("The start form should be rendered", function (done) {
            sinon.spy(widget, "_getServiceParams");

            $.when(widget.postRender()).done(function ($content) {
                expect($content).toBeDefined();
                expect($(".ui-bizagi-container-form", $content).length).toEqual(1);
                expect(widget._getServiceParams.called).toBe(true);
                widget._getServiceParams.restore();
                done();
            });
        });

        it("The form service should be called with the necessary parameters", function () {
            var serviceParams = widget._getServiceParams();

            expect(serviceParams["h_action"]).toEqual("LOADSTARTFORM");
            expect(serviceParams["h_idParentCase"]).toEqual(widget._idParentCase);
            expect(serviceParams["h_mappingstakeholders"]).toEqual(widget._mappingstakeholders);
            expect(serviceParams["h_guidprocess"]).toEqual(widget._guidprocess);
        });
    });
});
