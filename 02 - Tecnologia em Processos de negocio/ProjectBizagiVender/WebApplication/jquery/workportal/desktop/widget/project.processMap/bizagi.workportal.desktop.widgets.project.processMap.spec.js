/**
 * Initialize processMap widget and test it
 * @author Andrés Fernando Muñoz
 */

describe("bizagi.workportal.widgets.project.processMap", function () {
    checkWorkportalDependencies();
    var widget, content;
    it("Environment has been defined", function (done) {
        var params = {};
        params.plan = {
            idActivitySelected: 'ABCDEFGHI',
            firstParent: {
                idCase: 123
            }
        };
        widget = new bizagi.workportal.widgets.project.processMap(dependencies.workportalFacade, dependencies.dataService, params);
        $.when(widget.areTemplatedLoaded())
           .done(function () {
               $.when(widget.renderContent()).done(function (html) {
                   dependencies.canvas.empty();
                   dependencies.canvas.append(html);
                   expect(html).not.toBe("");
                   expect(html).toBeDefined();
                   widget.postRender();
                   done();
               });
           });
    });

    describe("Changing diagram tabs behaviour", function () {
        beforeEach(function () {
            spyOn(widget.dataService, "getActivityMap").and.callFake(function(){
                return JSON.parse('{"processes":{"ef88e796-81cf-4b9d-87d4-3bf958e4c28d":"Schedule personal trainer"},"activities":[{"creationDate":"12/02/2015 09:44:04","name":"Schedule personal session","parentWorkItem":"31f19f94-1f35-445f-abf4-498908d7b4af","guidWorkitem":"a55fa3af-769d-4d20-b3cb-1a6d18674e0a","guidProcess":"ef88e796-81cf-4b9d-87d4-3bf958e4c28d","idCase":6421,"idWorkFlow":3}]}');
            });
            spyOn(widget.dataService, "getSubProcessMap").and.callFake(function(){
                return JSON.parse('[{"estimatedDate":"","finishDate":"12/02/2015 09:44:04","creationDate":"12/02/2015 09:44:04","guidCase":"84943223-dc20-4f3d-a652-6dfd5503d041","guidParentCase":null,"idCase":6421,"idWorkFlow":3,"name":"Schedule personal trainer"}]');
            });

        });
        it("Verify the process diagram tab", function (){
            var $tab = $(".ui-bizagi-wp-project-processmap-process-diagram", content);
            $($tab).trigger("click");
            var $container = $(".ui-bizagi-wp-project-processmap-process-diagram-content", content);
            expect($($container).length).toBe(1);
        });

        it("Verify the activity map tab", function (){
            var $tab = $(".ui-bizagi-wp-project-processmap-activity-map", content);
            $($tab).trigger("click");
            var $container = $(".ui-bizagi-wp-project-processmap-activity-map-content", content);
            expect($($container).length).toBe(1);
            expect(widget.dataService.getActivityMap).toHaveBeenCalled();
        });

        it("Verify the subprocess tab", function (){
            var $tab = $(".ui-bizagi-wp-project-processmap-subprocess", content);
            $($tab).trigger("click");
            var $container = $(".ui-bizagi-wp-project-processmap-subprocess-content", content);
            expect($($container).length).toBe(1);
            expect(widget.dataService.getSubProcessMap).toHaveBeenCalled();
        });
    });
});
