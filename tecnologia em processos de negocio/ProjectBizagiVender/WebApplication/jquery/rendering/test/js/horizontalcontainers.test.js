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
        proxy: 'jquery/rendering/test/data/horizontalContainers.json.txt'
    });

    // END OF SCRIPT
})
.then(function () {
    // BEGIN SCRIPT
    var rendering = new bizagi.rendering.facade();
    rendering.execute();

    // END OF SCRIPT
});
