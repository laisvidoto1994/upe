/**
 * Created by RicardoPD on 5/15/2014.
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

describe('Test workportal loader', function() {

    it('Testing if was created workportal object', function(done) {

        window.jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

        loader.init({
            callback: function() {
                loader.start("workportalflat").then(function() {
                    loader.loadFile({ src: "jquery/workportalflat/testsuite/smartphone/data/mock.bizagi.json.js", coverage: false }).then(function() {
                        var workportal = new bizagi.workportal.facade({
                            proxyPrefix: ""
                        });

                        console.log("Finalizo ejecución de workportal");

                        bizagi.collection.set("workportal", workportal);

                        expect(typeof workportal).toEqual("object");

                        function initTests() {

                            if (typeof bizagi.localization === "undefined") {
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
                        };

                        initTests();
                    });
                });
            }
        });
    });
});
