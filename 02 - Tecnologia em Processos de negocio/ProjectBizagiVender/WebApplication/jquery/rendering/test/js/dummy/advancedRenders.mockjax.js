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
        	
        	if (settings.data.h_action == "PROCESSPROPERTYVALUE") {
        		return {
						responseTime: 0,
						response: function() {
							this.responseText = $.mockJSON.generateFromTemplate(
								{
									"page": settings.data.p_page,
									"total": 4,
									"records": 40,
									"rows|10-10": [
										["@NUMBER@NUMBER@NUMBER", "@LOREM", "@LOREM", "@LOREM", "@LOREM", "@NUMBER@NUMBER@NUMBER@NUMBER@NUMBER"]
									]
                                }
								);
						}
        		};
        	} else if (settings.data.h_action == "ADDFILE") {
        		return {
						responseTime: 0,
						proxy: "jquery/rendering/test/ajax/UploadAddFile.ashx"
        		};
        		
        	} else {

        		if (settings.data.h_requestedForm === undefined) {
        			return {
        				responseTime: 0,
        				proxy: 'jquery/rendering/test/data/advanced/advancedRenders.json.txt'
        			};

        		} else if (settings.data.h_requestedForm === "addForm") {
        			return {
        				responseTime: 0,
        				proxy: 'jquery/rendering/test/data/advanced/clients.gridAddForm.json.txt'
        			};
        		} else if (settings.data.h_requestedForm === "editForm") {
        			return {
        				responseTime: 0,
        				proxy: 'jquery/rendering/test/data/advanced/clients.gridEditForm.json.txt'
        			};
        		}
        	}
        }

        return;
    });



    // Mock SaveFormData.ashx
    $.mockjax({
        responseTime: 0,
        url: 'ajax/SaveFormData.ashx',
        proxy: 'jquery/rendering/test/data/simpleRenders.saveAction.json.txt'
    });

    // Mock cities.ashx
    $.mockjax({
        responseTime: 0,
        url: 'ajax/cities.ashx',
        proxy: 'jquery/rendering/test/data/intermediate/colombia.cities.json.txt'
    });

    // Mock ajax/GetSearchFormData.aspx
    $.mockjax({
        responseTime: 0,
        url: 'ajax/GetBasicSearchForm.ashx',
        proxy: 'jquery/rendering/test/data/advanced/cities.searchBasic.json.txt'
    });
    $.mockjax({
        responseTime: 0,
        url: 'ajax/GetAdvancedSearchForm.ashx',
        proxy: 'jquery/rendering/test/data/advanced/cities.searchAdvanced.json.txt'
    });
    


    // Mock grid edition handlers
    $.mockjax({
        responseTime: 0,
        url: 'jquery/ajax/GridEditRow.ashx',
        responseText: {}
    });

    $.mockjax({
        responseTime: 0,
        url: 'jquery/ajax/GridSaveRow.ashx',
        responseText: {}
    });

    $.mockjax({
        responseTime: 0,
        url: 'jquery/ajax/GridAddRow.ashx',
        responseText: {id: 0}
    });

    $.mockjax({
        responseTime: 0,
        url: 'jquery/ajax/GridRollback.ashx',
        responseText: { id: 0 }
    });
    
    // END OF SCRIPT
});
