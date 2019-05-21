angular.module('bizagi.services.module').factory('bizagi.services.collection', function ($q) {
    var service = new bizagi.workportal.services.service();
    var notifier = bizagi.injector.get('notifier');
    var processAction = bizagi.injector.get('processActionService');
    var actionService = bizagi.injector.get('actionService');
    var globalHandlersService = bizagi.injector.get('globalHandlersService');
    var widgetManager = bizagi.injector.get('widgetManager');

    var _getCollections = function () {
        var deferred = $q.defer();

        service.getUserStuff().done(function (collections) {
            deferred.resolve(collections);
        });

        return deferred.promise;
    };

    var _getCollectionInstances = function (params) {
        var deferred = $q.defer(),
            params = params;

        service.getCollectionEntityData(params).done(function (instances) {
            deferred.resolve({ instances: instances, reference: params });
        }).fail(function () {
            deferred.reject({ reference: params });
        });

        return deferred.promise;
    };

    var _getTemplateEngine = function () {
        var defer = new $.Deferred();

        bizagi.loader.start("rendering").then(function () {
            var params = {},
                renderDataService = new bizagi.render.services.service(params),
                renderFactory = new bizagi.rendering.desktop.factory(renderDataService);

            params.proxyPrefix = bizagi.RPproxyPrefix;

            $.when(renderFactory.initAsyncStuff())
                .done(function () {
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

    var _getEntityHtml = function (data, templateType) {
        var defer = new $.Deferred(),
            result = [];
        templateType = templateType ? templateType : "list";

        bizagi.loader.start("rendering").then(function () {
            $.when(_getTemplateEngine())
                .pipe(function (engine) {
                    return $.when.apply($, $.map(data.entities, function (entity) {
                        return engine.render($.extend(entity, { isDefaultTemplate: entity.surrogateKey == -1, templateType: templateType }));
                    }));
                })
                .done(function () {
                    var templates = $.makeArray(arguments),
                        entities = data.entities.length,
                        tmpl;

                    for (var i = 0; i < entities; i++) {
                        tmpl = (entities === 1) ? templates[i] : templates[i][0];
                        var currentTemplate = {
                            tmpl: tmpl,
                            html: {},
                            data: data[i]
                        };

                        currentTemplate.html[templateType] = $("<div>").append(tmpl).html()
                        result.push(currentTemplate);
                    }

                    defer.resolve(result);
                });
        });

        return defer.promise();
    };

    var _getEntityActions = function (entity) {
        var defer = new $.Deferred();

        $.when(actionService.getActionsData({
            guidEntity: entity.id,
            surrogateKey: entity.surrogateKey
        }))
		.done(function (actions) {
		    defer.resolve({ actions: actions, entity: entity });
		});

        return defer.promise();
    };

    var _gotoCollection = function (collection) {

        bizagi.services.projectDashboardContext = "TEMPLATEENGINE-VIEW"; bizagi.services.projectDashboardContext = "REFRESHALL";

        bizagi.loader.startAndThen("workportal").then(function () {

            $("#ui-bizagi-wp-application").remove();
            window.bizagiWorkportal.execute().then(function () {

                widgetManager.sub("homeportalReady", function () {
                    widgetManager.unsub("homeportalReady");


                    widgetManager._context = "home";
                    widgetManager._notifyChange({}, {
                        type: "TEMPLATEENGINE-VIEW",
                        args: {
                            filters: [],
                            fromActionLauncher: false,
                            histName: collection.displayName,
                            level: 1,
                            page: 1,
                            reference: collection.reference,
                            referenceType: collection.referenceType,
                            surrogateKey: collection.surrogateKey,
                            guidEntityCurrent: collection.entityId,
                            xpath: collection.xpath
                        }
                    });

                    $("#ui-bizagi-wp-project-homeportal-main,#ui-bizagi-wp-menu").show();
                });
            });
        });
    };

    return {
        getCollections: _getCollections,
        getEntityHtml: _getEntityHtml,
        getEntityActions: _getEntityActions,
        getCollectionInstances: _getCollectionInstances,
        gotoCollection: _gotoCollection
    };
});