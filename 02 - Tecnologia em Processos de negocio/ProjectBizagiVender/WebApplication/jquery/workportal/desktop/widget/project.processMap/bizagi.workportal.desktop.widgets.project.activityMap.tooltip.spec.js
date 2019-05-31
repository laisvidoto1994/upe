/**
 * Initialize processMap widget and test it
 * @author Andrés Fernando Muñoz
 */

describe("bizagi.workportal.widgets.project.activityMap.tooltip", function () {
    checkWorkportalDependencies();
    var widget;
    it("Environment has been defined", function (done) {
        var params = {};

        widget = new bizagi.workportal.widgets.project.activityMap.tooltip(dependencies.workportalFacade, dependencies.dataService, params);

        $.when(widget.areTemplatedLoaded())
            .pipe(function () { return widget.renderContent(); })
            .done(function ($content) {

                dependencies.canvas.empty();
                dependencies.canvas.append($content);

                expect($content).not.toBe("");
                widget.postRender();
                done();
            });
    });

    it("Activities are bound to DOM", function () {
        //Append activities to body
        var $activities = $('<div  class="ui-bizagi-wp-project-processmap-activity-map-content">'+
                                '<div class="activity-map-tooltip" data-guidWorkitem="00000-000001" data-idCase="2051" data-idWorkflow="5" style="background:red;height: 17px;margin-bottom: 8px;width: 80px;"></div>' +
                            '</div>');
        $("body").append($activities);
        var tooltipParams = {
            diagram: "activityMap",
            $container: $(".ui-bizagi-wp-project-processmap-activity-map-content"),
            tooltipClass: "bz-gq-activity-map-tooltip-wrapper",
            items: ".activity-map-tooltip"
        };

        widget.bindTooltip(tooltipParams);
        expect($(".ui-bizagi-wp-project-processmap-activity-map-content").length).toBe(1);
    });

    describe("Verify tooltip applied to activity map DOM elements", function () {
        it("Verify tooltip appears when mouse over", function (){
            // Mock the getActivitySummary service
            var service = widget.dataService;
            sinon.stub(service, 'getActivitySummary', function () {
                return {"assigneeName":"Adam Smith","assigneePhoto":"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","endDate":"04/02/2015 17:29:21","startDate":"03/02/2015 17:29:21","process":"Car Preventive Maintenance","idCase":2051};
            });
            sinon.spy(widget, "getActivityMapTooltipContent");

            var $activity = $(".activity-map-tooltip:first");
            $($activity).trigger("mouseover");

            expect(widget.getActivityMapTooltipContent.called).toBe(true);
        });

        it("Verify showGraphicQuery appears when process link is clicked", function (){
            sinon.spy(widget, 'showGraphicQuery');
            widget.onProcess({"idCase":2051,"idWorkflow":5}, null);
            expect(widget.showGraphicQuery.called).toBe(true);
            expect(widget.showGraphicQuery.calledWith({"idCase":2051,"idWorkflow":5})).toBe(true);
        });
    });

    describe("Verify widget data cached when getActivityMapTooltipContent function is called", function () {
        var $ui = {data: function(param){
            if(param == "guidWorkitem") return "00000-000001";
            if(param == "idCase") return "2051";
            if(param == "idWorkflow") return "5";
        }};

        beforeEach(function () {
            sinon.spy(widget, 'buildContent');
            sinon.spy(widget, 'appendToCache');
        });

        afterEach(function () {
            widget.buildContent.restore();
            widget.appendToCache.restore();

        });

        it("Verify data append to cache", function () {
            widget.cache = {};
            expect(widget.isCached("00000-000001")).toBe(false);
            widget.getActivityMapTooltipContent($ui);
            expect(widget.buildContent.called).toBe(true);
            expect(widget.appendToCache.called).toBe(true);
            expect(widget.isCached("00000-000001")).toBe(true);
        });

        it("Verify data not append to cache", function () {
            expect(widget.isCached("00000-000001")).toBe(true);
            widget.getActivityMapTooltipContent($ui);
            expect(widget.buildContent.called).toBe(true);
            expect(widget.appendToCache.called).toBe(false);
        });
    });

    it("Subporcess are bound to DOM", function () {
        //Append subprocess to body
        var $subprocess = $('<div class="ui-bizagi-wp-project-processmap-subprocess-content">' +
                                '<div class="subprocess-tooltip" style="width:40px; height:20px; background:blue; margin-bottom:5px;" data-guidworkitem="14f7c202-613f-4362-acff-ba22b430e2d7" data-idcase="2051" data-idworkflow="5" data-enddate ="03/02/2015 17:29:22" data-startdate="03/02/2015 17:29:21" data-process="Car Preventive Maintenance"></div>' +
                            '</div>');

        $("body").append($subprocess);
        var tooltipParams = {
            diagram: "subprocess",
            $container: $(".ui-bizagi-wp-project-processmap-subprocess-content"),
            tooltipClass: "bz-gq-subprocess-tooltip-wrapper",
            items: ".subprocess-tooltip"
        };

        widget.bindTooltip(tooltipParams);
        expect($(".ui-bizagi-wp-project-processmap-subprocess-content").length).toBe(1);
    });

    describe("Verify tooltip applied to subprocess DOM elements", function () {
        it("Verify tooltip appears when mouse over", function (){
            sinon.spy(widget, "getSubprocessTooltipContent");
            var $activity = $(".subprocess-tooltip:first");
            $($activity).trigger("mouseover");

            expect(widget.getSubprocessTooltipContent.called).toBe(true);
        });
    });
});
