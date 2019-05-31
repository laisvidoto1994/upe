

describe("Widget desktop.widgets.dashboard", function () {
    checkWorkportalDependencies();
    var widget, params;
    var localization;
    beforeEach(function(){

        localization = sinon.stub(bizagi.localization, 'getResource');

        localization
            .withArgs('workportal-widget-dashboard-favorites-title')
            .returns('Activities');
    });

    afterEach(function(){
        bizagi.localization.getResource.restore();
    });

    it("Environment has been defined", function (done) {
        params = {};
        widget = new bizagi.workportal.widgets.dashboard(dependencies.workportalFacade, dependencies.dataService, params);

        $.when(widget.areTemplatedLoaded())
            .pipe(function () { return widget.renderContent(); })
            .done(function ($content) {

                dependencies.canvas.empty();
                dependencies.canvas.append($content);

                expect($content).not.toBe("");
                expect($content).toBeDefined();

                widget.postRender();

                done();
            });
    });

    it("Should have one main panels", function () {
        var $content = widget.getContent();
        var panels = $content.find("[id|='row']");
        console.log("panels", panels.length);
        expect(panels.length).toEqual(1);

    });

    it("Metrics panel should have 1 categories", function () {
        var $content = widget.getContent();
        var categories = $content.find("[id|='row']");
        expect(categories.length).toBeGreaterThan(0);
    });

    it("Cases panel should have 3 categories", function () {
        var $content = widget.getContent();
        var categories = $content.find('#row-cases>div');
        expect(categories.length).toBeGreaterThan(1);
    });

    describe("structure data", function () {
        var data = {};

        beforeEach(function () {
            data = widget.getData();
        });

        it("should be an attribute called home", function () {
            expect(data.home).toBeDefined();
            expect($.isArray(data.home)).toBe(true);
            expect(data.home.length).toEqual(1);
        });

        it("Each section should have three properties [type, title, items]", function () {
            var metrics = data.home[0];
            expect(metrics.hasOwnProperty('type')).toBe(true);
            expect(metrics.hasOwnProperty('title')).toBe(true);
            expect(metrics.hasOwnProperty('items')).toBe(true);
        });

        it("Items property should be an array", function () {
            var items = data.home[0].items;
            expect($.isArray(items)).toBe(true);
        });

        it("Each object in items should have an structure defined", function () {
            var objectItem = data.home[0].items[0];
            expect(objectItem.hasOwnProperty('title')).toBe(true);
            expect(objectItem.hasOwnProperty('iconclass')).toBe(true);
            expect(objectItem.hasOwnProperty('icon')).toBe(true);
        });
    });

    describe('Cases is clicked', function(){

        it('An event should be linked for each kind of case', function(){
            var $content = widget.getContent();

            var $mainPanel = $content.closest('.wdg-dash-board');
            var events = $._data($mainPanel[0], 'events');

            expect(events.click).toBeDefined();
        });

        it('when myActivities is clicked, should change the current context', function(){
            sinon.spy(widget, 'pub');

            var $content = widget.getContent();
            var favoritesCard = $($content.find('.wdg-db-card'));
            favoritesCard.trigger('click');
            expect(widget.pub.called).toBe(true);

            widget.pub.restore();

        });
    });

});
