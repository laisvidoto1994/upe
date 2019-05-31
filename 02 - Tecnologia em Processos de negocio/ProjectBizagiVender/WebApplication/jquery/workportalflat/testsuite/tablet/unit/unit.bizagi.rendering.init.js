/**
 * Created by RicardoPD on 8/20/2014.
 */

var loader = bizagi.loader;
/**
 * Create collection of global objects
 */

bizagi.collection = (function (window) {
    window.objCollection = window.collection || {};
    return {
        set: function (name, obj) {
            name = name || '_';
            obj = obj || {};
            //console.log('set:' + name, obj);
            window.objCollection[name] = obj;
        },
        get: function (name) {
            if (!name) {
                return {};
            }
            //console.log('get:', name);
            return window.objCollection[name];
        },
        getAll: function () {
            return window.objCollection;
        }
    };
})(window);

loader.loadFile = function (params) {
    var build = "?build=" + this.build;
    if (arguments.length > 1) {

        for (var i = 0; i < arguments.length; i++) {
            this.loadFile(arguments[i]);
        }
        return this;
    }

    if (typeof (params) == "object" && params.length > 1) {

        for (var i = 0; i < params.length; i++) {
            this.loadFile(params[i]);
        }
        return this;
    }
    //Internet Explorer bug in case that is object, 1 element
    if (params[0] && typeof (params) == "object") {
        this.loadFile(params[0]);
        return this;
    }

    // Skip some files when in release mode
    var environment = typeof (params.environment) !== "undefined" ? params.environment : "release";
    if (environment != "release" && this.environment == "release") return this;

    var file = params && params.src ? params.src : params;
    var type = params && params.type ? params.type : "js";
    var prefix = this.useAbsolutePath ? this.basePath + this.getLocationPrefix() : "" + this.getLocationPrefix();

    // Remove build variable content if the url already has a build in the querystring
    if (file.indexOf(build) > 0) build = "";

    // Load each javascript via steal
    var wait;
    if (type == "css") {
        wait = typeof (params.wait) !== "undefined" ? params.wait : false;
        this.log("Loading css:" + file + " route to load:" + prefix + file + build);
        steal({
            id: prefix + file + build,
            src: prefix + file + build,
            type: "css",
            waits: wait
        });
    } else if (type == "js") {
        if (file.indexOf("renderingflat") !== -1) {
            file = file.replace('jquery/', 'base/');
        }
        wait = typeof (params.wait) !== "undefined" ? params.wait : true;
        this.log("Loading js:" + file + " route to load:" + prefix + file + build);

        // Enable javascript coverage
        var enableCoverage = (typeof BIZAGI_ENABLE_COVERAGE !== "undefined" && BIZAGI_ENABLE_COVERAGE) ? true : false;
        enableCoverage = typeof params.coverage !== "undefined"  ? params.coverage : enableCoverage;
        if (!enableCoverage) {
            steal.then({
                id: prefix + file + build,
                src: prefix + file + build,
                type: "js",
                waits: wait,
                onError: function (options) {
                    if (bizagi.loader.environment === "release") {
                        bizagi.log("Could not load file " + options.src, options, "error");
                    }
                    else {
                        alert("Could not load file " + options.src);
                    }
                    if (params.onError) params.onError();
                }
            });
        }
    }

    return this;
};

var dependencies = {};

describe('Test workportal-rendering loader', function() {

    it('Wait until globals are loaded', function(done) {
        loader.init({
            url: 'jquery/bizagi.module.definition.json.txt',
            callback: function() {
                function initTests() {
                    if (typeof bizagi.localization === 'undefined') {
                        setTimeout(initTests, 100);
                    } else {
                        if (typeof (BIZAGI_LOCAL_RESOURCES) !== "undefined" && BIZAGI_LOCAL_RESOURCES === true) {
                            bizagi.localization.ready().done(function() {
                                done();
                            });
                        } else {
                            $.when(bizagi.localization)
                                .done(function() {
                                    done();
                                });
                        }
                    }
                }

                initTests();
            }
        });
    });

    it('Testing if was created workportal object', function(done) {
        BIZAGI_ENABLE_COVERAGE = false;
        loader.start('renderingflat').then(function() {
            BIZAGI_ENABLE_COVERAGE = true;
            loader.loadFile({ src: 'jquery/workportalflat/testsuite/tablet/data/mock.bizagi.json.js', coverage: false }).then(function() {
                var workportal = new bizagi.workportal.facade({
                    proxyPrefix: ''
                });
                console.log('finalizo ejecución de workportal');

                bizagi.collection.set('workportal', workportal);

                expect(typeof workportal).toEqual('object');
                done();
            });
        });
    });

    it('Testing if was created rendering object', function (done) {
        var self = this;

        // Set localization settings
        bizagi.localization = new bizagi.l10n(bizagi.resourceDefinitionLocation);
        bizagi.localization.setLanguage(BIZAGI_LANGUAGE);

        // Defines a global template service instance for general purposes
        bizagi.templateService = new bizagi.templates.services.service(bizagi.localization);
        
        dependencies.canvas = $("body");
        dependencies.dataService = new bizagi.render.services.service({database: ""});
        dependencies.renderFactory = new bizagi.rendering.tablet.factory(dependencies.dataService);

        var containerProperties = {
            canvas: dependencies.canvas,
            renderFactory: dependencies.renderFactory,
            dataService: dependencies.dataService,
            idCase: 1000,
            data: {
                properties: {
                    "id": "03ADAA57-D934-4343-B524-38D71C4CD697",
                    "orientation": "ltr",
                    "useCustomButtons": false,
                    "xpathContext": ""
                },
                "sessionId": "4mjqjhgmypywwd000hpgglla",
                "pageCacheId": 1658724467
            }
        };

        dependencies.form = new bizagi.rendering.form(containerProperties);

        // Add property type to containerProperties form in the queryForm case
        //var containerProperties_queryForms =$.extend(true, {}, containerProperties);
        //containerProperties_queryForms.data.properties.type = "queryForm";

        //dependencies.queryForm = new bizagi.rendering.queryForm(containerProperties_queryForms );

        $.when(dependencies.renderFactory.initAsyncStuff()).done(function() {
            bizagi.collection.set("renderFactory", dependencies.renderFactory);
            bizagi.collection.set("dataService", dependencies.dataService);
            bizagi.collection.set("form", dependencies.form);
            //bizagi.collection.set("queryForm", dependencies.queryForm);
            bizagi.collection.set("canvas", dependencies.canvas);
            $.when(dependencies.form.render()).done(function() {
                dependencies.form.trigger("ondomincluded");
                done();
            });
        });
    });
});
