describe("Widget desktop.widgets.paginator", function () {
    var widget;

    checkWorkportalDependencies();

    it("Environment has been defined", function (done) {
        widget = new bizagi.workportal.widgets.paginator(dependencies.workportalFacade, dependencies.dataService, {});

        $.when(widget.areTemplatedLoaded()).then( function () {
            return widget.renderContent();
        }).done(function ($content) {
            dependencies.canvas.empty();
            dependencies.canvas.append($content);
            widget.postRender();

            expect($content).not.toBe("");
            expect($content).toBeDefined();
            done();
        });
    });

    describe("behavior with only one page", function(){
        var $content = null;

        beforeEach(function() {
            widget.updateView(null, {
                args : {
                    totalRecords : 5,
                    totalPages : 1,
                    histName : "Cars",
                    currentPage : 1,
                    fact : 126985
                }
            });
            $content = widget.getContent();
        });

        it("Should have four options", function(){
            var controls = $content.find(".control-icon");
            expect(controls.length).toEqual(4);
        });

        it("Should have a label", function(){
            var $label = $content.find(".total-cases>span");
            expect($label.text()).toEqual("5 Cars");
        });

        it("The fastrewind option should be disabled", function(){
            var $fastrewind = $content.find(".control-icon.fastrewind-ico");
            expect($fastrewind.hasClass("ui-state-disabled")).toBe(true);
        });

        it("The rewind option should be disabled", function(){
            var $rewind = $content.find(".control-icon.rewind-ico");
            expect($rewind.hasClass("ui-state-disabled")).toBe(true);
        });

        it("The forward option should be disabled", function(){
            var $forward = $content.find(".control-icon.forward-ico");
            expect($forward.hasClass("ui-state-disabled")).toBe(true);
        });

        it("The fastforward option should be disabled", function(){
            var $fastforward = $content.find(".control-icon.fastforward-ico");
            expect($fastforward.hasClass("ui-state-disabled")).toBe(true);
        });

    });

    describe("behavior with two pages", function(){
        var $content = null;

        beforeEach(function() {
            widget.updateView(null, {
                args : {
                    totalRecords : 18,
                    totalPages : 2,
                    histName : "Cars",
                    currentPage : 1,
                    fact : 126985
                }
            });
            $content = widget.getContent();
        });

        it("The fastrewind option should be disabled", function(){
            var $fastrewind = $content.find(".control-icon.fastrewind-ico");
            expect($fastrewind.hasClass("ui-state-disabled")).toBe(true);
        });

        it("The rewind option should be disabled", function(){
            var $rewind = $content.find(".control-icon.rewind-ico");
            expect($rewind.hasClass("ui-state-disabled")).toBe(true);
        });

        it("The forward option should be enabled", function(){
            var $forward = $content.find(".control-icon.forward-ico");
            expect($forward.hasClass("ui-state-disabled")).toBe(false);
        });

        it("The fastforward option should be enabled", function(){
            var $fastforward = $content.find(".control-icon.fastforward-ico");
            expect($fastforward.hasClass("ui-state-disabled")).toBe(false);
        });
    });

    describe("behavior advancing to the next page", function() {
        var $forward = null;

        beforeEach(function () {
            // Initial State
            widget.updateView(null, {
                args: {
                    totalRecords: 28,
                    totalPages: 3,
                    histName: "Cars",
                    currentPage: 1,
                    fact: 126985
                }
            });
            $forward = widget.getContent().find(".control-icon.forward-ico");
        });

        it("Should go to the next page and should have all icons disable", function(){
            $forward.click();
            //Refresh view
            widget.updateView(null, {
                args: {
                    currentPage: widget.currentPage
                }
            });
            var $content = widget.getContent();
            var $fastrewind = $content.find(".control-icon.fastrewind-ico");
            var $rewind = $content.find(".control-icon.rewind-ico");
            var $fastforward = $content.find(".control-icon.fastforward-ico");

            // Check icons state
            expect($fastrewind.hasClass("ui-state-disabled")).toBe(false);
            expect($rewind.hasClass("ui-state-disabled")).toBe(false);
            expect($forward.hasClass("ui-state-disabled")).toBe(false);
            expect($fastforward.hasClass("ui-state-disabled")).toBe(false);

            // Check current page
            expect(widget.currentPage).toEqual(2);
        });

        it ("Should call the event notify", function(){
            spyOn(widget, "pub");
            $forward.click();
            expect(widget.pub).toHaveBeenCalled();
        });
    });

    describe("behavior advancing to the last page", function() {
        var $fastforward = null;

        beforeEach(function () {
            // Initial State
            widget.updateView(null, {
                args: {
                    totalRecords: 28,
                    totalPages: 3,
                    histName: "Cars",
                    currentPage: 1,
                    fact: 126985
                }
            });
            $fastforward = widget.getContent().find(".control-icon.fastforward-ico");
        });

        it("Should go to the last page and should have rewind icons disable", function(){
            $fastforward.click();
            //Refresh view
            widget.updateView(null, {
                args: {
                    currentPage: widget.currentPage
                }
            });
            var $content = widget.getContent();
            var $fastrewind = $content.find(".control-icon.fastrewind-ico");
            var $rewind = $content.find(".control-icon.rewind-ico");
            var $forward = $content.find(".control-icon.forward-ico");

            // Check icons state
            expect($fastrewind.hasClass("ui-state-disabled")).toBe(false);
            expect($rewind.hasClass("ui-state-disabled")).toBe(false);
            expect($forward.hasClass("ui-state-disabled")).toBe(true);

            // Check current page
            expect(widget.currentPage).toEqual(3);
        });

        it ("Should call the event notify", function(){
            spyOn(widget, "pub");
            $fastforward.click();
            expect(widget.pub).toHaveBeenCalled();
        });
    });

    describe("behavior rewinding to the previous page", function() {
        var $rewind = null;

        beforeEach(function () {
            // Initial State
            widget.updateView(null, {
                args: {
                    totalRecords: 18,
                    totalPages: 2,
                    histName: "Cars",
                    currentPage: 2,
                    fact: 126985
                }
            });
            $rewind = widget.getContent().find(".control-icon.rewind-ico");
        });

        it("Should go to the previous page and should have forward icons disable", function(){
            $rewind.click();
            //Refresh view
            widget.updateView(null, {
                args: {
                    currentPage: widget.currentPage
                }
            });
            var $content = widget.getContent();
            var $fastrewind = $content.find(".control-icon.fastrewind-ico");
            var $forward = $content.find(".control-icon.forward-ico");
            var $fastforward = $content.find(".control-icon.fastforward-ico");

            // Check icons state
            expect($fastrewind.hasClass("ui-state-disabled")).toBe(true);
            expect($rewind.hasClass("ui-state-disabled")).toBe(false);
            expect($forward.hasClass("ui-state-disabled")).toBe(false);
            expect($fastforward.hasClass("ui-state-disabled")).toBe(false);

            // Check current page
            expect(widget.currentPage).toEqual(1);
        });

        it ("Should call the event notify", function(){
            spyOn(widget, "pub");
            $rewind.click();
            expect(widget.pub).toHaveBeenCalled();
        });
    });


    describe("behavior rewinding to the first page", function() {
        var $fastrewind = null;

        beforeEach(function () {
            // Initial State
            widget.updateView(null, {
                args: {
                    totalRecords: 28,
                    totalPages: 3,
                    histName: "Cars",
                    currentPage: 3,
                    fact: 126985
                }
            });
            $fastrewind = widget.getContent().find(".control-icon.fastrewind-ico");
        });

        it("Should go to the first page and should have forward icons disable", function(){
            $fastrewind.click();
            //Refresh view
            widget.updateView(null, {
                args: {
                    currentPage: widget.currentPage
                }
            });
            var $content = widget.getContent();
            var $rewind = $content.find(".control-icon.rewind-ico");
            var $forward = $content.find(".control-icon.forward-ico");
            var $fastforward = $content.find(".control-icon.fastforward-ico");

            // Check icons state
            expect($fastrewind.hasClass("ui-state-disabled")).toBe(false);
            expect($rewind.hasClass("ui-state-disabled")).toBe(true);
            expect($forward.hasClass("ui-state-disabled")).toBe(false);
            expect($fastforward.hasClass("ui-state-disabled")).toBe(false);

            // Check current page
            expect(widget.currentPage).toEqual(1);
        });

        it ("Should call the event notify", function(){
            spyOn(widget, "pub");
            $fastrewind.click();
            expect(widget.pub).toHaveBeenCalled();
        });
    });

    describe("behavior rendering paginator without data (totalRecords = 0)", function(){
        var $content = null;
        beforeEach(function () {
            // Initial State
            widget.updateView(null, {
                args: {
                    totalRecords: 0,
                    totalPages: 1,
                    histName: "Cars",
                    currentPage: 1,
                    fact: 126985
                }
            });
            $content = widget.getContent();
        });

        it("Should disabled all options", function(){
            expect($content.find(".control-icon.fastrewind-ico").hasClass("ui-state-disabled")).toBe(true);
            expect($content.find(".control-icon.rewind-ico").hasClass("ui-state-disabled")).toBe(true);
            expect($content.find(".control-icon.forward-ico").hasClass("ui-state-disabled")).toBe(true);
            expect($content.find(".control-icon.fastforward-ico").hasClass("ui-state-disabled")).toBe(true);
        });

        it("Should have a label", function(){
            var $label = $content.find(".total-cases>span");
            expect($label.text()).toEqual("0 Cars");
        });
    });

    describe("behavior from Action Launcher with only an page", function(){
        var $content = null;

        beforeEach(function() {
            widget.updateView(null, {
                args : {
                    totalRecords : 5,
                    totalPages : 1,
                    histName : "Cars",
                    currentPage : 1,
                    fact : 126985,
                    fromActionLauncher: true
                }
            });

            $content = widget.getContent();
        });

        it("Should have four options", function(){
            var controls = $content.find(".control-icon");
            expect(controls.length).toEqual(4);
        });

        it("Should have a label", function(){
            var $label = $content.find(".total-cases>span");
            expect($label.text()).toEqual("5 Cars");
        });

        it("The fastrewind option should be disabled", function(){
            var $fastrewind = $content.find(".control-icon.fastrewind-ico");
            expect($fastrewind.hasClass("ui-state-disabled")).toBe(true);
        });

        it("The rewind option should be disabled", function(){
            var $rewind = $content.find(".control-icon.rewind-ico");
            expect($rewind.hasClass("ui-state-disabled")).toBe(true);
        });

        it("The forward option should be disabled", function(){
            var $forward = $content.find(".control-icon.forward-ico");
            expect($forward.hasClass("ui-state-disabled")).toBe(true);
        });

        it("The fastforward option should be disabled", function(){
            var $fastforward = $content.find(".control-icon.fastforward-ico");
            expect($fastforward.hasClass("ui-state-disabled")).toBe(true);
        });
    });

    describe("behavior from action launcher without data (totalRecords = 0)", function(){
        beforeEach(function () {
            // Initial State
            widget.updateView(null, {
                args: {
                    totalRecords: 0,
                    totalPages: 1,
                    histName: "Cars",
                    currentPage: 1,
                    fact: 126985,
                    fromActionLauncher: true
                }
            });
        });

        it("Should not have content", function(){
            var $content = widget.getContent();

            expect($("#paginator-container", $content[0]).length).toEqual(0);
        });
    })
});
