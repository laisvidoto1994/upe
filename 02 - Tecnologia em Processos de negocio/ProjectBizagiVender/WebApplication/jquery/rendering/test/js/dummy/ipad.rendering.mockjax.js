/*
*   Name: BizAgi Rendering Services Mockjax
*   Author: Diego Parra
*   Comments:
*   -   This class will create mockjax dummies to test rendering calls
*/

// Create namespace
$.bizagiServices = {};

// Dependency Management
bizagi.loader.loadFile( bizagi.getJavaScript("common.base.dev.jquery.mockjax"))
.loadFile( bizagi.getJavaScript("common.base.dev.jquery.mockjson"))
.then(function () {
    // BEGIN OF SCRIPT
	$.mockJSON.data.BIZAGI_RENDER_TYPE = ["combo", "text"];

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
			                "elements": [
					            { "container": { "properties": { "id": "TAB1", "type": "tabItem", "displayName": "TAB NO EDITABLE" },
					                "elements|10-10": [
					                	{ "container": { "properties": { "id": "group@LOREM", "type": "group", "displayName": "Random group @LOREM" },
					                	  "elements|10-10": [
					                	    { "render": { "properties": { "id||10001-10099": 0, "displayName|1-2": "@LOREM", "xpath": "simple.text", "type": "text", "editable": "false", "value|1-2": "@LOREM"}} }
					                	  ]
					                }}
					              ]
					            }},
					            { "container": { "properties": { "id": "TAB2", "type": "tabItem", "displayName": "TAB EDITABLE" },
					                "elements|10-10": [
					                	{ "container": { "properties": { "id": "group@LOREM", "type": "group", "displayName": "Random group @LOREM" },
					                	  "elements|10-10": [
					                	    { "render": { "properties": { "id||10001-10099": 0, "displayName|1-2": "@LOREM", "xpath": "simple.text@DIGIT@DIGIT", "type": "text", "editable": "true", "value|1-2": "@LOREM"}} }
					                	  ]
					                }}
					              ]
					            }},
					            { "container": { "properties": { "id": "TAB3", "type": "tabItem", "displayName": "TAB COMBOS" },
					                "elements|10-10": [
					                	{ "container": { "properties": { "id": "group@LOREM", "type": "group", "displayName": "Random group @LOREM" },
					                	  "elements|10-10": [
					                	    { "render": { "properties": { "id||10001-10099": 0, "displayName|1-2": "@LOREM", "xpath": "simple.combo@DIGIT@DIGIT", "type": "combo", "editable": "true", "data": [{"id":"1", "value":"America"}, {"id":"2", "value":"Europa"}]}} }
					                	  ]
					                }}
					              ]
					            }},
					            { "container": { "properties": { "id": "TAB4", "type": "tabItem", "displayName": "TAB TEXTAREA" },
					                "elements|10-10": [
					                	{ "container": { "properties": { "id": "group@LOREM", "type": "group", "displayName": "Random group @LOREM" },
					                	  "elements|10-10": [
					                	    { "render": { "properties": { "id||10001-10099": 0, "displayName|1-2": "@LOREM", "xpath": "simple.text@DIGIT@DIGIT", "type": "text", "editable": "true", "value|1-2": "@LOREM", "isExtended": "true"}} }
					                	  ]
					                }}
					              ]
					            }},
					            { "container": { "properties": { "id": "TAB5", "type": "tabItem", "displayName": "TAB COMBINADOS" },
					                "elements|10-10": [
					                	{ "container": { "properties": { "id": "group@LOREM", "type": "group", "displayName": "Random group @LOREM" },
					                	  "elements|10-20": [
					                	    { "render": { "properties": { "id||10001-10099": 0, "displayName|1-2": "@LOREM", "xpath": "simple.coso@DIGIT@DIGIT", "type": "@BIZAGI_RENDER_TYPE", "editable|0-1": "true", "value|1-2": "@LOREM", "isExtended|0-1": "true", "data": [{"id":"1", "value":"America"}, {"id":"2", "value":"Europa"}]}} }
					                	  ]
					                }}
					              ]
					            }}
				            ]
			            }
			            }
		            ]
                }
            });
        }
    });

    // Mock SaveFormData.ashx
    $.mockjax({
        url: 'ajax/SaveFormData.ashx',
        responseTime: 0,
        proxy: 'jquery/rendering/test/data/simpleRenders.saveAction.json.txt'
    });


    // END OF SCRIPT
});
