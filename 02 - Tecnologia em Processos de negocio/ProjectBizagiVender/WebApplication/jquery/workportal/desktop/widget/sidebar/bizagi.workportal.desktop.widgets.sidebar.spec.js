describe("Widget desktop.widgets.sidebar", function () {
    var widget;
    var $content = null;

    checkWorkportalDependencies();

    it("Environment has been defined", function (done) {
        widget = new bizagi.workportal.widgets.sidebar(dependencies.workportalFacade, dependencies.dataService, {});

        $.when(widget.areTemplatedLoaded()).then(function () {
            return widget.renderContent();
        }).done(function ($content) {
            dependencies.canvas.empty();
            dependencies.canvas.append($content);

            expect($content).not.toBe("");
            expect($content).toBeDefined();

            done();
        });
    });

    describe("Check the HTML render", function(){
        var $sidebarcontent;
        var $bannerfootersidebar;

        beforeEach(function () {
            widget.postRender();
            $content = widget.getContent();
            $sidebarcontent = $content.find('#sidebarcontent');
            $bannerfootersidebar = $content.find('.bannerfootersidebar');
        });

        it("Check that sidebarcontent is present", function(){
            expect($content.find('#sidebarcontent').length).toEqual(1);
        });

        it("Check if sidebar-content class has defined", function(){
            expect($content.find('#sidebarcontent').hasClass('sidebar-content')).toBe(true);
        });
    });
});