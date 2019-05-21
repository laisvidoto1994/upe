/*
*   Name: BizAgi Rendering Services Mockjax
*   Author: Diego Parra
*   Comments:
*   -   This class will create mockjax dummies to test rendering calls
*/

// Create namespace
$.bizagiServices = {};

// Dependency Management
bizagi.loader.loadFile( 
	bizagi.loader.getResource("js", "common.base.dev.jquery.mockjax")
)
.loadFile( 
	bizagi.loader.getResource("js", "common.base.dev.jquery.mockjson")
)
.then(function () {
    // BEGIN OF SCRIPT

    // Mock GetFormData.ashx
    $.mockjax({
        responseTime: 0,
        url: 'App/Render/RenderHandler.ashx',
        proxy: 'jquery/rendering/test/data/intermediate/intermediateRenders.json.txt'
    });

    // Mock SaveFormData.ashx
    $.mockjax({
        responseTime: 0,
        url: 'ajax/SaveFormData.ashx',
        proxy: 'jquery/rendering/test/data/simpleRenders.saveAction.json.txt'
    });

    // Mock custom handlers
    $.mockjax({
        responseTime: 0,
        url: 'ajax/continents.ashx',
        proxy: 'jquery/rendering/test/data/intermediate/continents.json.txt'
    });


    $.mockjax(function (settings) {
        // COUNTRIES
        if (settings.url == 'ajax/countries.ashx') {

            if (settings.data.p_parent == "1") {
                return {
                    responseTime: 0,
                    proxy: 'jquery/rendering/test/data/intermediate/america.countries.json.txt'
                };

            } else if (settings.data.p_parent == "2") {
                return {
                    responseTime: 0,
                    proxy: 'jquery/rendering/test/data/intermediate/europa.countries.json.txt'
                };

            } else {
                return {
                    responseTime: 0,
                    proxy: 'jquery/rendering/test/data/intermediate/america.countries.json.txt'
                };
            }
        }

        // CITIES
        if (settings.url == 'ajax/cities.ashx') {

            if (settings.data.p_parent == "1") {
                return {
                    responseTime: 0,
                    proxy: 'jquery/rendering/test/data/intermediate/colombia.cities.json.txt'
                };

            } else if (settings.data.p_parent == "2") {
                return {
                    responseTime: 0,
                    proxy: 'jquery/rendering/test/data/intermediate/peru.cities.json.txt'
                };

            } else if (settings.data.p_parent == "3") {
                return {
                    responseTime: 0,
                    proxy: 'jquery/rendering/test/data/intermediate/venezuela.cities.json.txt'
                };
            } else if (settings.data.p_parent == "0") {
                return {
                    responseTime: 0,
                    response: []
                };
            } else {
                return {
                    responseTime: 0,
                    proxy: 'jquery/rendering/test/data/intermediate/colombia.cities.json.txt'
                };
            }
        }
        
        if (settings.url == 'ajax/countries2.ashx') {
            return {
                responseTime: 0,
                proxy: 'jquery/rendering/test/data/intermediate/countriesWithAdditional.json.txt'
            };
        }


        return;
    });

    // END OF SCRIPT
});
