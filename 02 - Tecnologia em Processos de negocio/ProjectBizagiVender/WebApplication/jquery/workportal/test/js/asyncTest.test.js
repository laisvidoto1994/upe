bizagi.loader.loadFile(
    bizagi.getJavaScript("common.base.lib.jquery"),
    bizagi.getJavaScript("common.base.lib.json")
)
.then(function () {
    // BEGIN SCRIPT
	
	$("#btnStart").click(function() {
		doAjax();
    });

	$("#btnTest").click(function() {
		for (var i = 0; i < 4; i++) {
		    doAjax();
	    }
    });
	
	function doAjax() {
		var url = "../ajax/SimpleHandler.ashx";
		var rnd = Math.floor(Math.random() * 1000);
		return $.ajax({
                url: url,
				data: {number: rnd},
                type: "POST",
                dataType: "json"
            });
	}
	// END OF SCRIPT
});

