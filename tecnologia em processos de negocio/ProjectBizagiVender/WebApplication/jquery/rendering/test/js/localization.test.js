bizagi.loader.loadFile(
    bizagi.getJavaScript("common.base.lib.jquery"),
	bizagi.getJavaScript("common.base.lib.json"),
    bizagi.getJavaScript("common.base.dev.jquery.mockjax"),
    bizagi.getJavaScript("common.base.dev.jquery.mockjson"),
	bizagi.getJavaScript("common.base.lib.jquery.class"),
	bizagi.getJavaScript("common.base.lib.jquery.tmpl"),
	bizagi.getJavaScript("common.jquery.ui.desktop"),
    bizagi.getJavaScript("common.bizagi.services.ajax"),
	bizagi.getJavaScript("common.bizagi.services.service"),
	bizagi.getJavaScript("common.bizagi.template.services.service"),
	bizagi.getJavaScript("common.bizagi.l10n"),
	bizagi.getJavaScript("common.bizagi.notifications"),
	bizagi.getJavaScript("common.bizagi.logging"),
	bizagi.getJavaScript("common.bizagi.messaging"),
	bizagi.getJavaScript("common.bizagi.util"),
	bizagi.getJavaScript("common.bizagi")
)
.then(function () {
    // BEGIN SCRIPT
    var workarea = $(".workarea");
    var cmbLanguages = $("#cmbLanguages");

    // Define localization
    var resourceDefinitionLocation = {
        "default": "jquery/rendering/test/resources/bizagi.resources.json",
        "es-co": "jquery/rendering/test/resources/bizagi.resources.es-co.json"
    };

    var localization = new bizagi.l10n(resourceDefinitionLocation);

    // Bind combo handler
    cmbLanguages.change(function () {
        render(cmbLanguages.val());
    });

    // render on default language
    render();

    // Method to render in any language
    function render(language) {
        // Set predefined language
        language = language || "default";
        localization.setLanguage(language);

        // clear workarea
        workarea.empty();

        // Fetch data
        var data = $.ajax({
            url: "jquery/rendering/test/data/data.json.txt",
            dataType: "json"
        });

        data.fail(function () {
            alert("failed data!: " + arguments[2]);
        });

        // Fetch template
        var template = $.ajax({
            url: "jquery/rendering/test/templates/client.tmpl",
            dataType: "text"
        });

        template.fail(function () {
            alert("failed template!: " + arguments[2]);
        });

        // Render
        $.when(data, template).done(function (data, template) {

            // Localize template
            var localizedTemplate = localization.translate(template[0]);

            // Render template
            $(localizedTemplate).tmpl(data[0]).appendTo(workarea);
        });
    }

    // END OF SCRIPT
});
