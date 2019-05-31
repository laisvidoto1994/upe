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
.loadFile( 
	bizagi.loader.getResource("js", "common.base.dev.jquery.mockjson")
)
.then(function () {
    // BEGIN OF SCRIPT

//    $.mockjax({
//        url: 'App/Render/RenderHandler.ashx',
//        proxy: 'jquery/rendering/test/data/performanceValidaciones.json.txt'
//    });
	  
	// Mock GetFormData.ashx
    $.mockjax({
        url: 'App/Render/RenderHandler.ashx',
        responseTime: 0,
        response: function () {
            this.responseText = $.mockJSON.generateFromTemplate({
                "form": {
                    "properties": { "id": 1, "xpathContext": "", "title": "Cycle 1", "buttons|1-1": [{ "action": "save", "text": "Save", "validate": "true", "submitData": "true", "refresh": "true"}] },
                    "elements|1-1": [
			            { "container": { "properties": { "id": "tab", "type": "tab" },
			                "elements|1-1": [
					            { "container": { "properties": { "id": "tabItem1", "type": "tabItem", "displayName": "Random Renders" },
					                "elements|1000-1000": [
						            { "render": { "properties": { "id||10001-10099": 0, "displayName|1-2": "@LOREM", "xpath": "@LOREM.@LOREM.@LOREM", "type": "text", "required": "true"}} }
					              ]
					            }
					            }
				            ]
			            }
			            }
		            ]
                }
            });
        }
    });

    // END OF SCRIPT
});
