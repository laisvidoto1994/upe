bizagi.loader.loadFile(
    "jquery/rendering/test/js/dummy/ipad.rendering.mockjax.js"
)
.then(function () {
    // BEGIN SCRIPT
    
    var rendering = new bizagi.rendering.facade();
    rendering.execute({
        canvas: $(".page")		
    });

    // END OF SCRIPT
});
