bizagi.loader.loadFile(
    bizagi.getJavaScript("common.base.lib.jquery"),
	bizagi.getJavaScript("common.base.lib.json"),
    bizagi.getJavaScript("common.base.dev.jquery.mockjax"),
    bizagi.getJavaScript("common.base.dev.jquery.mockjson"),
	bizagi.getJavaScript("common.base.lib.jquery.class"),
	bizagi.getJavaScript("common.jquery.ui.desktop"),
    bizagi.getJavaScript("common.bizagi.services.ajax"),
	bizagi.getJavaScript("common.bizagi.services.service"),
	bizagi.getJavaScript("common.bizagi.template.services.service"),
	bizagi.getJavaScript("common.bizagi.l10n"),
	bizagi.getJavaScript("common.bizagi.notifications"),
	bizagi.getJavaScript("common.bizagi.logging"),
	bizagi.getJavaScript("common.bizagi.messaging"),
	bizagi.getJavaScript("common.bizagi.util"),
	bizagi.getJavaScript("common.bizagi"),
	bizagi.getJavaScript("bizagi.render.services.endPoints"),
	bizagi.getJavaScript("bizagi.render.services.context"),
	bizagi.getJavaScript("bizagi.render.services.service"),
	"jquery/rendering/test/js/dummy/basicData.mockjax.js"
)
.then(function () {
    // BEGIN SCRIPT

    // Creates a service instance
    var service = new bizagi.render.services.service();

    // Call get form data service
    var data = service.getFormData();

    // END OF SCRIPT
});
