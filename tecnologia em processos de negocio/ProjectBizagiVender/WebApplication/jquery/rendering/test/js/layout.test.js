bizagi.loader.loadFile(
    "jquery/rendering/test/js/dummy/layout.mockjax.js"
)
.then(function () {
    // BEGIN SCRIPT
    var rendering = new bizagi.rendering.facade();
    rendering.execute();

    // END OF SCRIPT
});
