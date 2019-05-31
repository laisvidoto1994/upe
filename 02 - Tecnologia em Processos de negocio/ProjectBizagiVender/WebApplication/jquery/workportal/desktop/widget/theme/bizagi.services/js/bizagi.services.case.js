angular.module('bizagi.services.module').factory('bizagi.services.case', function ($q) {
    var service = new bizagi.workportal.services.service();
    var notifier = bizagi.injector.get('notifier');
    var processAction = bizagi.injector.get('processActionService');
    var actionService = bizagi.injector.get('actionService');
    var globalHandlersService = bizagi.injector.get('globalHandlersService');
    var widgetManager = bizagi.injector.get('widgetManager');

    var _getClosedCases = function () {
        var deferred = $q.defer();
        service.getPendingsData().done(function (cases) {
            deferred.resolve(cases);
        });
        return deferred.promise;
    };

    var _getOpenedCases = function () {
        var deferred = $q.defer();
        service.getPendingsData().done(function (cases) {
            deferred.resolve(cases);
        });
        return deferred.promise;
    };

    var _gotoCase = function (currentCase) {
        var templateService = new bizagi.workportal.services.loadtemplates();

        $.when(templateService.loadTemplates({
            "homeportal": bizagi.getTemplate("bizagi.workportal.desktop.widget.homeportal").concat("#homeportal-frame"),
            useNewEngine: true
        })).done(function () {
            var template = templateService.getTemplate("homeportal");
            var content = template.render({});
            $(content).attr("data-bizagi-component", "workarea")
            $workarea = $("#ui-bizagi-wp-workarea");
            $workarea.remove("#ui-bizagi-wp-project-homeportal-main");
            $workarea.append(content);
            $workarea.find("#ui-bizagi-wp-project-homeportal-main").show();

            globalHandlersService.publish('executeAction', {
                action: bizagi.workportal.actions.action.BIZAGI_WORKPORTAL_ACTION_ROUTING,
                idCase: currentCase.data.id
            });
        });
    };

    var _getTemplateEngine = function () {
        var defer = new $.Deferred();

        bizagi.loader.start("rendering").then(function () {
            var params = {},
                renderDataService = new bizagi.render.services.service(params),
                renderFactory = new bizagi.rendering.desktop.factory(renderDataService);

            params.proxyPrefix = bizagi.RPproxyPrefix;

            $.when(renderFactory.initAsyncStuff()).done(function () {
                var templateEngine = new bizagi.templateEngine({
                    renderFactory: renderFactory,
                    cache: true,
                    router: templateEngine
                });

                defer.resolve(templateEngine);
            });
        });

        return defer.promise();
    };

    var _getCasesHtml = function (data) {
        var result = [],
           defer = new $.Deferred();

        bizagi.loader.start("rendering").then(function () {
            $.when(_getTemplateEngine())
                .pipe(function (engine) {
                    return $.when.apply($, $.map(data.entities, function (cases) {
                        return engine.render(cases);
                    }));
                })
                .done(function () {
                    var casesTemplates = $.makeArray(arguments),
                        idCases = [],
                        cases = data.entities.length;

                    for (var i = 0; i < cases; i++) {
                        var tmpl = (cases === 1) ? casesTemplates[i] : casesTemplates[i][0];
                        var caseData = data.entities[i];
                        result.push({
                            tmpl: tmpl,
                            html: $("<div>").append(tmpl).html(),
                            casetoolbarData: {
                                guidFavorite: data.entities[i].guidFavorite,
                                idcase: data.entities[i].idCase,
                                idWorkflow: data.entities[i].idWorkflow
                            },
                            actionData: {
                                guidEntity: data.guid,
                                idCase: data.idCase,
                                surrogateKey: data.surrogateKey
                            }
                        });

                        idCases.push(data.idCase);
                    }

                    defer.resolve(result);
                });
        });

        return defer.promise();
    };

    var _gotoPendingCases = function () {
        bizagi.services.projectDashboardContext = "REFRESHALL";

        bizagi.loader.startAndThen("workportal").then(function () {

            $("#ui-bizagi-wp-application").remove();
            window.bizagiWorkportal.execute().then(function () {
                
                widgetManager.sub("homeportalReady", function () {
                    widgetManager.unsub("homeportalReady");
                    var params = bizagi.injector.get('homeportal').params;

                    widgetManager._context = "home";
                    widgetManager._notifyChange({}, {
                        type: "CASES-TEMPLATE-VIEW",
                        args: {
                            histName: "Pendings",
                            page: 1,
                            level: 2,
                            route: 'pendings',
                            idworkflow: ''
                        }
                    });
                    $("#ui-bizagi-wp-project-homeportal-main,#ui-bizagi-wp-menu").show();
                });
            });
        });
    };

    var _gotoFollowingCases = function () {
        widgetManager._context = "home";
        widgetManager._notifyChange({}, {
            type: "CASES-TEMPLATE-VIEW",
            args: {
                histName: "Following",
                page: 1,
                level: 2,
                route: 'following',
                idworkflow: ''
            }
        });
    };

    return {
        getClosedCases: _getClosedCases,
        getOpenedCases: _getOpenedCases,
        getCasesHtml: _getCasesHtml,
        gotoCase: _gotoCase,
        gotoPendingCases: _gotoPendingCases,
        gotoFollowingCases: _gotoFollowingCases
    };
});