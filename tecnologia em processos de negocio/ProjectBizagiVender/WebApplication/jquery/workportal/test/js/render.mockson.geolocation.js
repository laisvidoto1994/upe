BIZAGI_DISABLE_MOCKS = typeof (BIZAGI_DISABLE_MOCKS) !== "undefined" ? BIZAGI_DISABLE_MOCKS : false;

bizagi.loader.loadFile(
    bizagi.getJavaScript("common.base.dev.jquery.mockjax"),
    bizagi.getJavaScript("common.base.dev.jquery.mockjson")
    )
.then(function () {
    // DUMMIES
    $.mockjax(function (settings) {
        if (BIZAGI_DISABLE_MOCKS) return;
        if (settings.dataType == "json") {

            /*
            *   MENU MOCKS
            */
            //            if (settings.url == 'Rest/Users/CurrentUser') {
            //                return {
            //                    responseTime: BIZAGI_RESPONSE_TIME,
            //                    mockjson: "jquery/workportal/test/data/geolocalizationcase.txt"
            //                };
            //            }
            if (settings.url == 'Rest/Handlers/Render') {
                return {
                    mockjson: "jquery/workportal/test/data/geolocalizationcase.txt"
                };
            }

        }
    });
});