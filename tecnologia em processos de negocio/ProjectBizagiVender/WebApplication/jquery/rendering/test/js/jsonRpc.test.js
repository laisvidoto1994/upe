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
	bizagi.getJavaScript("common.bizagi")
)
.then(function () {
    // Reference to global log
    var logContainer = $(".log");

    // Method to add a log
    function log(message) {
    	var item = $("<div />").addClass("logItem");
        item.text(message);
        logContainer.append(item);
    }
	
    // Mock SaveFormData.ashx
    $.mockjax({
        responseTime: 0,
        url: 'ajax/ClientHandler.ashx',
        response: function () {
        	this.responseText = '{"id": "1"}';
        }
    });

    // Get clients button
    $("#btnGetClients").click(function () {
        var clients = $.ajax({
            url: "ajax/ClientHandler.ashx",
            dataType: "json",
            type: "POST"
        });

        $.when(clients)
        .done(function (data) {
            log("Single clients call: " + JSON.encode(data));
        })
        .fail(function (jqXHR, statusText, error) {
            log("Single clients call failed: " + error);
        });
    });

    // Fail request button
    $("#btnGetProducts").click(function () {
        var products = $.ajax({
            url: "ajax/ProductHandler.ashx",
            dataType: "json",
            type: "POST"
        });

        $.when(products)
        .done(function (data) {
            log("Single products call: " + JSON.encode(data));
        })
        .fail(function (jqXHR, statusText, error) {
            log("Single products call failed: " + error);
        });
    });


    // Get products button
    $("#btnFail").click(function () {
        var failedRequest = $.ajax({
            url: "ajax/ErrorGeneratingHandler.ashx",
            dataType: "json",
            type: "POST"
        });

        $.when(failedRequest)
    .done(function (data) {
        log("Single (failed request) call: " + JSON.encode(data));
    })
    .fail(function (jqXHR, statusText, error) {
        log("Single (failed request) call failed: " + error);
    });
    });

    // Clear log
    $("#btnClearLog").click(function () {
        logContainer.empty();
    });

    // Change AJAX behaviour
    $("#chkEnableRPCBatch").change(function () {
        bizagi.services.ajax.enableBatch($("#chkEnableRPCBatch").prop("checked"));
    });

    // Change RPC timer
    $("#txtTimer").change(function () {
        bizagi.services.ajax.batchTimer = Number($("#txtTimer").val());
    });

    // Ajax prefilter to enable/disable globally rpc and fix urls
    $.ajaxPrefilter("json", function (options, originalOptions, jqXHR) {
        jqXHR.success(function (data) {
            if (options.triggerBatch) {
                log(JSON.encode(data));
            }
        });
    });

    // END OF SCRIPT
});
