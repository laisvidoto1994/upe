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

         // Mock GetFormData.ashx
    $.mockjax(function (settings) {
        if (settings.url == 'App/Render/RenderHandler.ashx') {
        	
        	if (settings.data.h_action == "next") {
        		return {
						responseTime: 0,
						response: function() {
							this.responseText = {
							    "type" : "success", 
								"idCase" : "11554"
							};
						}
        		};
        	} else {

        		return {
                    responseTime: 0,
                    url: 'App/Render/RenderHandler.ashx',
                    proxy: 'jquery/rendering/test/data/simpleRenders.json.txt'
                };
        	}
        }

        return "";
    });
   
    // Mock SaveFormData.ashx
    $.mockjax({
        responseTime: 0,
        url: 'ajax/SaveFormData.ashx',
        proxy: 'jquery/rendering/test/data/simpleRenders.saveAction.json.txt'
    });

    // END OF SCRIPT
});
