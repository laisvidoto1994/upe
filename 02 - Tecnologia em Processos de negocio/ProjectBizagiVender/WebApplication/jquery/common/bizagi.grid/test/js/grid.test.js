$(document).ready(function() {
	
	// Mock the request
	// Mock GetFormData.ashx
    $.mockjax(function (settings) {
        if (settings.url == 'jquery/common/bizagi.grid/test/ajax/ClientProxyHandler.ashx') {
    		return {
    			responseTime: 0,
    			response: function() {
    				this.responseText = $.mockJSON.generateFromTemplate(
    					{
    						"page": settings.data.p_page,
    						"total": 10,
    						"records": 40,
    						"rows|10-10": [
    							["@NUMBER@NUMBER@NUMBER", "@LOREM", "@LOREM", "@LOREM", "@LOREM", "@NUMBER@NUMBER@NUMBER@NUMBER@NUMBER"]
    						]
    					}
                    );
    			}
    		};
        }
    	if (settings.url == 'jquery/common/bizagi.grid/test/ajax/GridEmptyHandler.ashx') {
    		return {
    			responseTime: 0,
    			response: function() {
    				this.responseText = $.mockJSON.generateFromTemplate(
    					{
    						"page": settings.data.p_page,
    						"total": 1,
    						"records": 0,
    						"rows": []
    					}
                    );
    			}
    		};
        }

    	return;
    });

    // Load localization stuff
	bizagi.resourceDefinitionLocation = {
        "default":  "jquery/resources/bizagi.resources.json.txt"
    };
	bizagi.language = (typeof (BIZAGI_LANGUAGE) !== "undefined") ? (BIZAGI_LANGUAGE != "" ? BIZAGI_LANGUAGE : "default") : "default";

    // Set localization settings
    bizagi.localization = new bizagi.l10n(bizagi.resourceDefinitionLocation);
    bizagi.localization.setLanguage(bizagi.language);

    // Defines a global template service instance for general purposes
    bizagi.templateService = new bizagi.templates.services.service(bizagi.localization);
	
	// Define templates
	var baseTemplate = getTemplateFile();
	var gridTemplate = {   
	    grid: baseTemplate + "#ui-bizagi-grid",
		waiting: baseTemplate + "#ui-bizagi-grid-waiting",
		table: baseTemplate + "#ui-bizagi-grid-table",
		emptyTable: baseTemplate + "#ui-bizagi-grid-table-empty",
		column: baseTemplate + "#ui-bizagi-grid-column",
		specialColumn: baseTemplate + "#ui-bizagi-grid-column-special",
		row: baseTemplate + "#ui-bizagi-grid-row",
		rowButtons: baseTemplate + "#ui-bizagi-grid-row-buttons",
		cell: baseTemplate + "#ui-bizagi-grid-cell",
		specialCell: baseTemplate + "#ui-bizagi-grid-cell-special",
		pager: baseTemplate + "#ui-bizagi-grid-pager",
		buttons: baseTemplate + "#ui-bizagi-grid-buttons"
	};

	var resolvedTemplates = { };
	var loadTemplate = function(template, templateDestination) {

		// Go fetch the template
		return bizagi.templateService.getTemplate(templateDestination)
			.done(function(resolvedRemplate) {
				resolvedTemplates[template] = resolvedRemplate;
			});
	};
	
	// Define columns
	var columns = [{   
		    name: "Id",
			index: 0,
		    key: true,
		    hidden: true
	    }, {   
		    name: "ciudad_nombre",
	    	label: "Ciudad",
			index: 1
	    }, {   
		    name: "ciudad_departamento_nombre",
	    	label: "Departamento",
			index: 2
	    }, {   
		    name: "ciudad_pais_nombre",
	    	label: "Pais",
			index: 3
	    }
	];
	
	// Load templates
	$.when(
        loadTemplate("grid", gridTemplate.grid),
		loadTemplate("waiting", gridTemplate.waiting),
		loadTemplate("table", gridTemplate.table),
		loadTemplate("emptyTable", gridTemplate.emptyTable),
		loadTemplate("column", gridTemplate.column),
		loadTemplate("specialColumn", gridTemplate.specialColumn),
		loadTemplate("row", gridTemplate.row),
		loadTemplate("rowButtons", gridTemplate.rowButtons),
		loadTemplate("cell", gridTemplate.cell),
		loadTemplate("specialCell", gridTemplate.specialCell),
		loadTemplate("pager", gridTemplate.pager),
		loadTemplate("buttons", gridTemplate.buttons)
    )
	.done(function() {
        
		// Apply grid plugin
		applyPlugin("#normalGrid", columns, resolvedTemplates);
		applyPlugin("#emptyGrid", columns, resolvedTemplates);
		
		// Set the data
		updateGrid("#normalGrid");
		updateGrid("#emptyGrid");
	});
	
	function loadData(selector, page, sortBy, sortType) {
		var dataHandler = selector == "#normalGrid" ? "jquery/common/bizagi.grid/test/ajax/ClientProxyHandler.ashx": "jquery/test/grid/ajax/GridEmptyHandler.ashx"; 
		
		// Define defaults
		page = page || 1;
		sortBy = sortBy || "id";
		sortType = sortType || "asc";
		var sort = sortBy + " " + sortType;
		
		return $.ajax({
			url: dataHandler,
			data: {
				p_sort: sort,
				p_page: page,
				p_rows: 10
			},
			dataType: "json",
			type: "POST"
		});
	}
	
	function updateGrid(selector, page, sortBy, sortType) {
		$.when(loadData(selector, page, sortBy, sortType))
		.done(function(data) {
			setData(selector, data);
		});
	}
	
	function log(message) {
		$("<div>" + message + "</div>").appendTo("#normalGridLog");
	}
	
	function getTemplateFile() {
		return BIZAGI_DEVICE == "desktop" ? "jquery/rendering/tmpl/desktop/grid/bizagi.grid.tmpl.html" : "jquery/rendering/tmpl/tablet/grid/bizagi.grid.tmpl.html";
	}
	
	function applyPlugin(selector, columns, resolvedTemplates) {
		var template =  {
		    grid: resolvedTemplates["grid"],
		    waiting: resolvedTemplates["waiting"],
		    table: resolvedTemplates["table"],
	    	emptyTable: resolvedTemplates["emptyTable"],
		    column: resolvedTemplates["column"],
			specialColumn: resolvedTemplates["specialColumn"],
		    row: resolvedTemplates["row"],
		    rowButtons: resolvedTemplates["rowButtons"],
		    cell: resolvedTemplates["cell"],
			specialCell: resolvedTemplates["specialCell"],
		    pager: resolvedTemplates["pager"],
		    buttons: resolvedTemplates["buttons"]
	    };
		
		if (BIZAGI_DEVICE == "desktop") {
			// Apply grid plugin
		    $(selector).bizagi_grid_desktop({
		        columns: columns,
			    template: template,
			    pageRequested: function (ui) {
				    updateGrid(selector, ui.page, ui.sortBy, ui.sortType);
			    },
			    sortRequested: function (ui) {
				    updateGrid(selector, ui.page, ui.sortBy, ui.sortType);
			    },
			    rowSelected: function (ui) {
				    log("Selected row with key " + ui.key);
			    },
			    rowUnselected: function (ui) {
				    log("Un-Selected row with key " + ui.key);
			    }
            });
		} else {
			// Apply grid plugin
		    $(selector).bizagi_grid_tablet({
		    	maxColumns: 2,
		        columns: columns,
			    template: template,
			    pageRequested: function (ui) {
				    updateGrid(ui.page, ui.sortBy, ui.sortType);
			    },
			    sortRequested: function (ui) {
				    updateGrid(ui.page, ui.sortBy, ui.sortType);
			    },
			    rowSelected: function (ui) {
				    log("Selected row with key " + ui.key);
			    },
			    rowUnselected: function (ui) {
				    log("Un-Selected row with key " + ui.key);
			    },
		    	addRow: function (ui) {
				    log("Add row");
			    },
		    	editRow: function (ui) {
				    log("edit row with key " + ui.key);
			    },
                deleteRow: function (ui) {
				    log("delete row with key " + ui.key);
			    }
		    		
            });
		}
	}
	
	function setData(selector, data) {
		if (BIZAGI_DEVICE == "desktop") {
			$(selector).bizagi_grid_desktop("setData", data);
		} else {
			$(selector).bizagi_grid_tablet("setData", data);
		}
	}

});
