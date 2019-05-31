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

    $.mockjax({
        url: 'App/Render/RenderHandler.ashx',
        proxy: 'jquery/rendering/test/data/layout.json.txt'
    });

    // END OF SCRIPT
});
