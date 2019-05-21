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
        proxy: 'jquery/rendering/test/data/misc/miscData.json.txt'
    });
    
    $.mockjax({
        responseTime: 0,
        url: 'App/Render/LetterHandler.ashx',
        dataType: 'html',
        proxy: 'jquery/rendering/test/data/misc/LetterDummy.html'
    });
    
    $.mockjax(function (settings) {
        if (settings.url.indexOf('ajax/SaveLetter.ashx') > -1) {
            return {
                responseTime: 0,
                proxy: 'jquery/rendering/test/data/misc/SaveLetterDummy.html'
            };
        }
    });
    
    
    // END OF SCRIPT
});
