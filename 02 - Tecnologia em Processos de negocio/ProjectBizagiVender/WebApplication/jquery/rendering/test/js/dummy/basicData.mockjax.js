/*
*   Name: BizAgi Rendering Services Mockjax
*   Author: Diego Parra
*   Comments:
*   -   This class will create mockjax dummies to test rendering calls
*/

// Create namespace
$.bizagiServices = {};

bizagi.loader.loadFile( 
    bizagi.loader.getResource("js", "common.base.dev.jquery.mockjax")
)
.then(function () {
    // BEGIN OF SCRIPT

    $.mockjax({
        url: 'App/Render/RenderHandler.ashx',
        proxy: 'jquery/rendering/test/data/basicData.json.txt'
    });

    // END OF SCRIPT
});
