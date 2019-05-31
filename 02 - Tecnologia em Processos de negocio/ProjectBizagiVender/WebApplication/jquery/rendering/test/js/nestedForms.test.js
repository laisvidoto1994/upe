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
        proxy: 'jquery/rendering/test/data/nestedForms.json.txt'
    });
    
    var rendering = new bizagi.rendering.facade();
    rendering.execute();
    // END OF SCRIPT
});
