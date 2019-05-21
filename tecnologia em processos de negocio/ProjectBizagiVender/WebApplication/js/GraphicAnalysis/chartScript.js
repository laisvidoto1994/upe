
	var m_ChartWidth = 550;
	var m_ChartHeight = 400;
	var m_PieWidth = 300;
	var m_PieHeight = 300;
	var m_PiesPerRow = 3;
	var m_UseGrid = false;
	var m_dataTable = null;
	var m_DefaultChartType = 'MSColumn3D';
	var m_SeparatorColumns = 0;
	var m_ChartType = null;//'MSColumn3D';
	var m_PieChartType = 'Pie2D';
	
	//Replace month names for every column of type month if any
	function replaceMonthNames(dataTable){
		for (var jColumn = 0; jColumn < dataTable.Columns.length; jColumn++){
			var sColumnName = dataTable.Columns[jColumn].ColumnName;
			if (sColumnName.indexOf('_Y') > -1 || sColumnName.indexOf('_Q') > -1 || sColumnName.indexOf('_M') > -1 || sColumnName.indexOf('_D') > -1){
				dataTable.Columns[jColumn].DataType = "String";
				
				if (sColumnName.indexOf('_M') > -1)
					for(var iRow = 0; iRow < dataTable.Rows.length; iRow++){
						dataTable.Rows[iRow][jColumn] = htResources.get("MONTH" + dataTable.Rows[iRow][jColumn]);
					}
			}
		}
		//m_dataTable = dataTable;
		return dataTable;
	}

	//javascript doesn't understand the comma symbol
	function replaceDecimalPoint(dataTable){
		for (var jColumn = dataTable.ExtendedProperties["LastSelectedDimension"]; jColumn < dataTable.Columns.length; jColumn++){
			if (dataTable.Columns[jColumn].DataType == "Double")
				for(var iRow = 0; iRow < dataTable.Rows.length; iRow++){
					if (dataTable.Rows[iRow][jColumn].indexOf(',') > -1)
						dataTable.Rows[iRow][jColumn] = dataTable.Rows[iRow][jColumn].replace(',', '.');
				}
		}
		
		return dataTable;
	}

	//Converts JSON string into a DOM Object
	function getDataTable(sData){
		if (!m_dataTable){
			m_dataTable = getNewDataTable(sData);
		}
		return m_dataTable;
	}

	function getNewDataTable(sData){
	    var dataTable = null;

	    var expression = new RegExp(/(\r\n|\n|\r)/gm);
	    var strDataNoSpaces = sData.replace(expression, "");

	    dataTable = eval(" (" + strDataNoSpaces + ")");
		dataTable = replaceMonthNames(dataTable);
		dataTable = replaceDecimalPoint(dataTable);
		return dataTable;
	}
			
	// get the datatable like an xml document for fusioncharts input in MultiSeries charts
	function GetDataTableAsXML(dataTable)
	{
		try
		{
			var div = document.createElement("div");
			
			//Generate the XML data for it
			var chart = document.createElement("chart");
			var lastSelectedDimensionColumn = parseInt(dataTable.ExtendedProperties["LastSelectedDimension"]);

			//Build Categories
			var categories = document.createElement("categories");
			for (var iRow = 0; iRow < dataTable.Rows.length; iRow++){
				
				//Show vLines
				if (bShowSeparator){
					if (!m_SeparatorColumns)
						m_SeparatorColumns = 2;
					for(var jColumn = 0; jColumn < m_SeparatorColumns/*lastSelectedDimensionColumn*/; jColumn++){					
						if (iRow > 0){
							var iColor = 200 * (jColumn  / lastSelectedDimensionColumn);
							if (dataTable.Rows[iRow][jColumn] != dataTable.Rows[iRow - 1][jColumn]){
								var vLine = document.createElement("vLine");
								vLine.setAttribute("color",getAColor(0, 0, 0));

								if (jColumn > 0){
									vLine.setAttribute("dashed" , "1");
									vLine.setAttribute("dashLen" , jColumn  * 8);
									vLine.setAttribute("dashGap" ,  jColumn * 5);
									vLine.setAttribute("alpha" ,  30 + 100 - (jColumn * 100 / lastSelectedDimensionColumn));
								}
								vLine.setAttribute("thickness" , (m_SeparatorColumns - jColumn));
								categories.appendChild(vLine);
								break;
							}
						}
					}
				}

				var category = document.createElement("category");
				if (dataTable.Rows[iRow][lastSelectedDimensionColumn]){
					category.setAttribute("name", dataTable.Rows[iRow][lastSelectedDimensionColumn]);
					category.setAttribute("hoverText", dataTable.Rows[iRow][lastSelectedDimensionColumn]);
				}
				else{
					category.setAttribute("name", ' ');
				}
				categories.appendChild(category);
			}
			//alert(categories.outerHTML);
			chart.appendChild(categories);

			//Build Datasets, every measure column
			for (var jColumn = lastSelectedDimensionColumn+1; jColumn < dataTable.Columns.length; jColumn++){
				var dataset = document.createElement("dataset");		
				dataset.setAttribute("seriesname", getFriendlyName(dataTable.Columns[jColumn].ColumnName) );
				dataset.setAttribute("showValue", "1");
				//var iColor = 256 * jColumn/lastSelectedDimensionColumn;
				//dataset.setAttribute("color", getAColor(iColor, iColor, iColor));
				
				for (var iRow = 0; iRow < dataTable.Rows.length; iRow++){
					var setvalue = document.createElement("set");
					if (dataTable.Rows[iRow][jColumn]){
						//setvalue.setAttribute("value", dataTable.Rows[iRow][jColumn]);
						var sValue = dataTable.Rows[iRow][jColumn];
						sValue = sValue.replace(',', '.');
						setvalue.setAttribute("value", sValue);
					}
					else
						setvalue.setAttribute("value", ' ');
					setvalue.setAttribute("link", "javascript:zoom(" + jColumn + ");");
					
					var sTip = getFullName(dataTable, lastSelectedDimensionColumn, jColumn, iRow);
					setvalue.setAttribute("toolText" , sTip);
					
					dataset.appendChild(setvalue);
				}
				chart.appendChild(dataset);
			}
									
			var caption = getFullTitle(dataTable, lastSelectedDimensionColumn, ' - '); //+ getFriendlyName(dataTable.Columns[dataTable.ExtendedProperties["LastSelectedDimension"]].ColumnName);
			if(dataTable.ExtendedProperties["QFCaption"].length > 0)
				chart.setAttribute("caption", dataTable.ExtendedProperties["QFCaption"]);
			chart.setAttribute("subcaption", caption);
			
			//chart.setAttribute("xAxisName", "test");
			//chart.setAttribute("yAxisName", "test");
			chart.setAttribute("showValues", "0");
			chart.setAttribute("palette", "1");
			chart.setAttribute("bgColor", "FFFFFF,FFFFFF");
			chart.setAttribute("canvasBgColor", "FFFFFF,FFFFFF");
			chart.setAttribute("canvasBaseColor", "FFFFFF,FFFFFF");

			chart.setAttribute("legendBgColor", "FFFFFF");
			chart.setAttribute("useRoundEdges", "1");
			chart.setAttribute("legendBorderAlpha", "0");
			
			//chart.setAttribute('showAlternateVGridColor', '1');
			//chart.setAttribute('alternateVGridColor', 'D9E5F1');
			//chart.setAttribute('alternateVGridAlpha', '100');
			chart.setAttribute('numVDivlines', dataTable.Rows.length - 1);
			chart.setAttribute('lineThickness', '2');
			 chart.setAttribute('xAxisName', getFriendlyName(dataTable.Columns[dataTable.ExtendedProperties["LastSelectedDimension"]].ColumnName));
			
			
			
			//fix for displaying labels
			if (dataTable.Rows.length > 10 && dataTable.Rows.length <= 30){ //labelDisplay='ROTATE' - 'Stagger'   slantLabels='1' 
				chart.setAttribute("labelDisplay", "ROTATE");
				chart.setAttribute("slantLabels", "1");
			}

/*
			var styles = document.createElement("styles");
			var definition = document.createElement("definition");
			var style = document.createElement("stylexx");  //bug on IE, must be "style", but on appendChild is changed to upper "STYLE", chart can't understand this :S
			var application = document.createElement("application");
			
			style.setAttribute('name', 'LegendStyle');
			style.setAttribute('type', 'font');
			//style.setAttribute('isHTML', '1');
			style.setAttribute('size', '11');
			style.setAttribute('color', '639ACE');
			style.setAttribute('bold', '1');
			definition.appendChild(style);
			styles.appendChild(definition);

			var apply = document.createElement("apply");
			apply.setAttribute('toObject', 'Legend');
			apply.setAttribute('styles', 'LegendStyle');
			application.appendChild(apply);

			styles.appendChild(application);
			chart.appendChild(styles);
*/
			div.appendChild(chart);
			div.setAttribute("id", "mainchartXML");
			//debug(div);
			return div;
		}
		catch (Exception)
		{
			return "";
		}
	}

	// get the datatable like an xml document for fusioncharts input in  Single Series charts
	function GetDataColumnAsXML(dataTable, column)
	{
		try
		{
			var div = document.createElement("div");

			//Generate the XML data for it
			var chart = document.createElement("chart");
			var lastSelectedDimensionColumn = parseInt(dataTable.ExtendedProperties["LastSelectedDimension"]);

			var fSum = 0.0;
			for (var iRow = 0; iRow < dataTable.Rows.length; iRow++){
				if (!isNaN(parseFloat(dataTable.Rows[iRow][column])))
					fSum = fSum + parseFloat(dataTable.Rows[iRow][column]);
			}

			//Build Dataset, for the measure 
			for (var iRow = 0; iRow < dataTable.Rows.length; iRow++){
				var setvalue = document.createElement("set");
			
				if (dataTable.Rows[iRow][column]){
					//setvalue.setAttribute("value", dataTable.Rows[iRow][column]);					
					var sValue = dataTable.Rows[iRow][column];
					sValue = sValue.replace(',', '.');
					setvalue.setAttribute("value", sValue);
					
					if (dataTable.Rows[iRow][lastSelectedDimensionColumn]){
						setvalue.setAttribute("label", dataTable.Rows[iRow][lastSelectedDimensionColumn] );
					}
					else
						setvalue.setAttribute("label", ' ');
					
					var sTip = getFullName(dataTable, lastSelectedDimensionColumn, column, iRow);
					if (!isNaN(parseFloat(dataTable.Rows[iRow][column])))
						sTip = sTip + "\n" + (parseFloat(dataTable.Rows[iRow][column]) * 100 / fSum).toFixed(2) + " %25";
						
					setvalue.setAttribute("toolText", sTip );
				}
				
				chart.appendChild(setvalue);
			}
			//chart.setAttribute("caption", getFriendlyName( dataTable.Columns[column].ColumnName ));
			var sTitle = getFullTitle(dataTable, lastSelectedDimensionColumn) + "\n" + getFriendlyName( dataTable.Columns[column].ColumnName );
			chart.setAttribute("caption", sTitle);
			
			chart.setAttribute("palette", "1");
			chart.setAttribute("bgColor", "EBEBEB");
			chart.setAttribute("showPercentageValues", "1");
			chart.setAttribute("showPercentInToolTip", "1");
			chart.setAttribute("animation", "1");
			chart.setAttribute("formatNumberScale", "0");
			chart.setAttribute("pieSliceDepth", "10");
			chart.setAttribute("enableSmartLabels", "1");
			chart.setAttribute("use3DLighting", "1");
		
			//return chart;
			div.appendChild(chart);
			return div;
		}
		catch (Exception)
		{
			return "";
		}
	}

	function getFullName(dataTable, lastSelectedDimensionColumn, jColumn, iRow){
		var sFullName = "";
		for (var iColumn = 0; iColumn <= lastSelectedDimensionColumn; iColumn++){
			sFullName = sFullName + getFriendlyName(dataTable.Columns[iColumn].ColumnName) + ": " + dataTable.Rows[iRow][iColumn] + "\n";
		}
		sFullName = sFullName + getFriendlyName(dataTable.Columns[jColumn].ColumnName) +": " + dataTable.Rows[iRow][jColumn];
		return sFullName;
	}

	function getFullTitle(dataTable, lastSelectedDimensionColumn, sSeparator){
		var sFullTitle = "";
		if (!sSeparator)
			sSeparator = "\n";
		for (var iColumn = 0; iColumn <= lastSelectedDimensionColumn; iColumn++){
			sFullTitle = sFullTitle + getFriendlyName(dataTable.Columns[iColumn].ColumnName)  
			if (iColumn < lastSelectedDimensionColumn)
				sFullTitle = sFullTitle + sSeparator;
		}
		return sFullTitle;
	}

	//Clicking on a column a new modal window is displayed to show the pie for the given column
	function zoom(column){
		var frm = document.getElementById("mainchartdiv");
		var idSWF = "swfzoomdiv" + column;
		var div = document.getElementById("zoomdiv" + column);
		var xmlData = document.getElementById("h_pie" + column).value;
		
		div = document.getElementById("zoomdiv" + column);
		
		if (div){
			//check if window already exists
			var win = document.getElementById('window_id' + column);
			if (win)
				return;
			else{
				div.style.visibility = "hidden";
				div.style.display = "none";
			}
		}
		else{
			div = document.createElement("div");
			div.id = "zoomdiv" + column;
			div.style.backgroundColor="#F0F0F0";
		}
		
		div.innerHTML = "";
		div.style.height = m_PieHeight + "px";
		div.style.width = m_PieWidth + "px";
		div.style.zIndex = 100;
		div.style.visibility = "visible";
		div.style.display = "block";
		frm.appendChild(div);

		var pieChart = new FusionCharts("../../Charts/Pie2D.swf", idSWF, m_PieWidth, m_PieHeight, "0", "0");
		pieChart.setDataXML(xmlData);
		pieChart.render(div.id);
		
		var dataTable = getDataTable();
		var sTitle = getFriendlyName(dataTable.Columns[column].ColumnName);
		ShowBAZoomWindow(sTitle , column, m_PieWidth, m_PieHeight);
	}

	//creates a new modal window to display the pie
	function ShowBAZoomWindow(sWindowTitle, iColumn, sWidth, sHeight, oAsyncMethod)
	{
			BADialog = new Window('window_id' + iColumn, { title: sWindowTitle, width:sWidth, height:sHeight , resizable: false, hideEffect:Element.hide, showEffect:Element.show, destroyOnClose: true});
			BADialog.setContent('zoomdiv' + iColumn, true, true);
			BADialog.showCenter(false);
			if (!addedObserver){
				addOnDestroyObserver();
				addedObserver = true;
			}
	}

	var addedObserver = false;
	function addOnDestroyObserver(){
				myObserver = {
					onDestroy: function(eventName, win) {
						var id = win.getId().replace(/window_id/,"");
						//alert("destroying : " +  id + " : " + eventName);
						var div = document.getElementById('zoomdiv' + id);
						if (div){
							div.style.visibility = "hidden";
							div.style.display = "none";
							var objects = div.getElementsByTagName("OBJECT");
							for (var i=0; i < objects.length; i++) {
								objects[i].style.display = 'none';
								for (var x in objects[i]) {
									if (typeof objects[i][x] == 'function') {
										objects[i][x] = function(){};
									}
								}
							}
							div.innerHTML = "";
						}
					}
				}
				Windows.addObserver(myObserver);
	}

	//if the last selected dimension is of the datetime type, then the default chart type must be set to line, for any other type it is set to Column3D
	function setDefaultChartType(){
		var dataTable = getDataTable();
		var sColumnName = dataTable.Columns[dataTable.ExtendedProperties["LastSelectedDimension"]].ColumnName;

		if (sColumnName.indexOf('_Y') > -1 || sColumnName.indexOf('_Q') > -1 || sColumnName.indexOf('_M') > -1 || sColumnName.indexOf('_D') > -1){
				m_DefaultChartType = "MSLine";
		}
		else{
				m_DefaultChartType = 'MSColumn3D';
		}
		
		if (dataTable.Rows.length > 30){
			if (m_DefaultChartType.indexOf("StackedColumn") >= 0){
				m_DefaultChartType = "ScrollStackedColumn2D";
			}
			else if (m_DefaultChartType.indexOf("Column") >= 0){
				m_DefaultChartType = "ScrollColumn2D";
			}
			else if (m_DefaultChartType.indexOf("Line") >= 0){
				m_DefaultChartType = "ScrollLine2D";
			}
			else if (m_DefaultChartType.indexOf("Area") >= 0){
				m_DefaultChartType = "ScrollArea2D";
			}
		}
	}
	
	//Create a new chart with the default type
	function createChart(){
		setDefaultChartType();
		var chart1 = new FusionCharts("../../Charts/" + m_DefaultChartType + ".swf", "mainchart", m_ChartWidth, m_ChartHeight, "0", "0");
		chart1.setDataXML(document.frm.h_mainchartXML.value);
		chart1.render("mainchartdiv");
		mainchartdiv.style.zIndex = 100;
	}

	//Change from a chart type to another
	function changeChartType(chartType){
		ChangeTab(0);
			
		if (!chartType)
			chartType = m_ChartType ? m_ChartType : m_DefaultChartType;
		else if (m_ChartType == chartType)
			return;

		var dataTable = getDataTable();
		if (dataTable.Rows.length > 30){
			if (chartType.indexOf("StackedColumn") >= 0){
				chartType = "ScrollStackedColumn2D";
			}
			else if (chartType.indexOf("Column") >= 0){
				chartType = "ScrollColumn2D";
			}
			else if (chartType.indexOf("Line") >= 0){
				chartType = "ScrollLine2D";
			}
			else if (chartType.indexOf("Area") >= 0){
				chartType = "ScrollArea2D";
			}
		}

		m_ChartType = chartType;

		var mainchartdiv = document.getElementById("mainchartdiv");
		//infosoftglobal.FusionChartsUtil.cleanupSWFs();
		clearDiv(mainchartdiv);

		var chart1 = new FusionCharts("../../Charts/" + m_ChartType + ".swf", "mainchart", m_ChartWidth, m_ChartHeight, "0", "0");
		chart1.setDataXML(document.frm.h_mainchartXML.value);
		chart1.render("mainchartdiv");
		mainchartdiv.style.zIndex = 100;
	}

	//Change from a chart type to another
	function changePieChartType(chartType){
		ChangeTab(1);
		if (m_PieChartType == chartType)
			return;

		m_PieChartType = chartType;
		if (m_PieChartType == "Pie2D" || m_PieChartType == "Pie3D" || m_PieChartType == "Doughnut2D" || m_PieChartType == "Doughnut3D"){
			createPieCharts(m_PieChartType);
		}
	}

	//Creates a new pie chart for every column.
	function createPieCharts(type){
		var dataContainer = document.getElementById("piedatadiv");
		var chartContainer = document.getElementById('piechartdiv');
		clearDiv(chartContainer);
		
		var dataTable = getDataTable(document.frm.h_jsondata.value);
		if (!dataContainer){
			alert("Data container not found, div 'piedatadiv'");
		}
		else{
			var lastSelectedDimension = parseInt(dataTable.ExtendedProperties["LastSelectedDimension"]);
			var table = document.createElement("table");
			var counter = 0;
			var row = null;

			var containerWidth = chartContainer.style.width.replace('px', '');
			var containerHeight = chartContainer.style.height.replace('px', '');
			var iLowerSize = containerHeight;
			if (containerHeight > containerWidth)
				iLowerSize = containerWidth;
			
			var iMeasuresAggCount = dataTable.Columns.length - lastSelectedDimension - 1;
			m_PieHeight = (containerWidth / m_PiesPerRow) - 15;
			m_PieWidth = (containerWidth / m_PiesPerRow	) - 15;

			for (var jColumn = lastSelectedDimension + 1; jColumn < dataTable.Columns.length; jColumn++){		
				var cell = document.createElement("td");
				
				cell.style.width = m_PieWidth;
				cell.style.height = m_PieHeight;
				cell.style.align = "center";
					
				var div = document.createElement("div");
				div.id = "piediv" + jColumn;
				cell.appendChild(div);

				if(m_UseGrid){
					var divGrid = document.createElement("div");
					divGrid.id = "gridpiediv" + jColumn;
					cell.appendChild(divGrid);
				}
									
				if (!row || counter % m_PiesPerRow == 0){
					row = document.createElement("tr");
					table.appendChild(row);
				}
				row.appendChild(cell);
				counter++
			}
			table.style.height = counter/m_PiesPerRow * m_PieHeight;
			table.style.cellSpacing = "10px";
			table.style.cellPadding = "30px";
			table.style.width = "100%";
			
			if (document.all)
				chartContainer.innerHTML = table.outerHTML;
			else
				chartContainer.appendChild(table);
		
			for (var jColumn = lastSelectedDimension + 1; jColumn < dataTable.Columns.length; jColumn++){		
				var idSWF = "piediv" + jColumn;
				var pieChart = new FusionCharts("../../Charts/" + type + ".swf", idSWF, m_ChartWidth, m_ChartHeight, "0", "0");
				var xmlData = document.getElementById("h_pie" + jColumn).value;
				pieChart.setDataXML(xmlData);
				pieChart.render(idSWF);

				if (m_UseGrid){
					var pieGrid = new FusionCharts("../../Charts/SSGrid.swf", "grid" + idSWF, m_PieWidth, m_PieHeight, "0", "0");
					pieGrid.setDataXML(xmlData);
					pieGrid.render("grid" + idSWF);
				}
			}
		}
	}

	//clear the container div
	function clearDiv(div){
		if (div){
			div.innerHTML = "";	
		}
	}

	//Builds the main chart XML
	function fillChartXML(iSeparatorColumns){
		//var xml = document.getElementById('debug');
		
		if(iSeparatorColumns)
			m_SeparatorColumns = iSeparatorColumns;

		var dataTable = getDataTable(document.frm.h_jsondata.value);
		var chartXML = GetDataTableAsXML(dataTable);

		var hidden = document.getElementById("h_mainchartXML");
		hidden.value = chartXML.innerHTML;
		hidden.value = hidden.value.replace(/\"/g,'\'');
		hidden.value = hidden.value.replace(/stylexx/g, "style");
		hidden.value = hidden.value.replace(/&amp;/g,'');
		
		//alert(hidden.value);
		//	xml.value = hidden.value;
	}

	//Create the pie's xml for rendering on detail or zoom
	function fillPieChartsXML(){
			
		var dataTable = getDataTable(document.frm.h_jsondata.value);
		var lastSelectedDimension = parseInt(dataTable.ExtendedProperties["LastSelectedDimension"]);

		var dataContainer = document.getElementById("piedatadiv");
		clearDiv(dataContainer);
		
		
		for (var jColumn = lastSelectedDimension + 1; jColumn < dataTable.Columns.length; jColumn++){
			var measureData = GetDataColumnAsXML(dataTable, jColumn);

			var hiddenData = getOrCreateHidden("h_pie" + jColumn);
			hiddenData.value = measureData.innerHTML.replace(/\"/g,'\'');
			
			//The pie chart does not support this special characters
			hiddenData.value = hiddenData.value.replace(/Á/g,'');
			hiddenData.value = hiddenData.value.replace(/É/g,'');
			hiddenData.value = hiddenData.value.replace(/Í/g,'');
			hiddenData.value = hiddenData.value.replace(/Ó/g,'');
			hiddenData.value = hiddenData.value.replace(/Ú/g,'');
			hiddenData.value = hiddenData.value.replace(/Ã/g,'');
			hiddenData.value = hiddenData.value.replace(/Õ/g,'');
			hiddenData.value = hiddenData.value.replace(/Ç/g,'');
			hiddenData.value = hiddenData.value.replace(/&/g,'');
			
			hiddenData.value = hiddenData.value.replace(/á/g,'');
			hiddenData.value = hiddenData.value.replace(/é/g,'');
			hiddenData.value = hiddenData.value.replace(/í/g,'');
			hiddenData.value = hiddenData.value.replace(/ó/g,'');
			hiddenData.value = hiddenData.value.replace(/ú/g,'');
			hiddenData.value = hiddenData.value.replace(/ã/g,'');
			hiddenData.value = hiddenData.value.replace(/õ/g,'');
			hiddenData.value = hiddenData.value.replace(/ç/g,'');

			dataContainer.appendChild(hiddenData);
		}

		//debug
		//var tableCode = document.getElementById('debug');
		//tableCode.value = dataContainer.innerHTML;
		//alert(dataContainer.innerHTML);
	}

	//for debugging purposes only
	function viewTableCode(griddiv){
			var tableCode = document.getElementById('tableRendered');
			tableCode.value = griddiv.innerHTML;
	}
	
	//for debugging purposes only
	function viewChartXML(){
			var tableCode = document.getElementById('tableRendered');
			var test = GetDataTableAsXML(getDataTable(document.frm.h_jsondata.value));

			var hidden = document.getElementById("h_mainchartXML");
			hidden.value = test.innerHTML;
			hidden.value = hidden.value.replace(/\"/g,'\'');
			tableCode.value = hidden.value;
	}

	function getOrCreateHidden(name){
		var hiddenData = document.getElementById(name);
		if (!hiddenData){
			hiddenData = document.createElement("input");
			hiddenData.type = "hidden";
			hiddenData.name = name;
			hiddenData.id = name;
			hiddenData.setAttribute("name", name);
			hiddenData.setAttribute("id", name);
		}
		return hiddenData;
	}

	//for debugging purposes only
	function viewPieChartsXML(){
			
		var dataTable = getDataTable(document.frm.h_jsondata.value);
		var lastSelectedDimension = parseInt(dataTable.ExtendedProperties["LastSelectedDimension"]);
				
		var dataContainer = document.getElementById("piedatadiv");
		clearDiv(dataContainer);
		
		
		for (var jColumn = lastSelectedDimension + 1; jColumn < dataTable.Columns.length; jColumn++){
			var measureData = GetDataColumnAsXML(dataTable, jColumn);

			var hiddenData = getOrCreateHidden("h_pie" + jColumn);
			hiddenData.value = measureData.innerHTML.replace(/\"/g,'\'');
			dataContainer.appendChild(hiddenData);				
		}
		
		//debug
		var tableCode = document.getElementById('tableRendered');
		tableCode.value = dataContainer.innerHTML;			
		//alert(dataContainer.innerHTML);
	}
	
	//gets a Color
	function getAColor(bg_red, bg_green, bg_blue){
		bg_RGB=NumToHexString(bg_red);
		bg_RGB+=NumToHexString(bg_green);
		bg_RGB+=NumToHexString(bg_blue);

		return bg_RGB;
	}
	
	//gets a Random Color
	function getColor(){
		var bg_red=Math.floor(256*Math.random());
		var bg_green=Math.floor(256*Math.random());
		var bg_blue=Math.floor(256*Math.random());

		bg_RGB=NumToHexString(bg_red);
		bg_RGB+=NumToHexString(bg_green);
		bg_RGB+=NumToHexString(bg_blue);

		return bg_RGB;
	}
	
	//converts a int number into his hex number representation
	function NumToHexString(hexnumber) {
		// takes a number as sole argument, returns the hex value.
		// the return value at leats two places long by adding zero
		//  NumToHexString(10)="0a".
		var hexstring="";
		var hexchar;
		var hexones;
		var i=0;

		hexnumber=Math.floor(hexnumber);
		while (hexnumber != 0) {
			i++;
			hexones=hexnumber % 16;
			hexnumber -= hexones;
			hexnumber /= 16;

			if (hexones>9) {
			if (hexones==10) hexchar="a";
			if (hexones==11) hexchar="b";
			if (hexones==12) hexchar="c";
			if (hexones==13) hexchar="d";
			if (hexones==14) hexchar="e";
			if (hexones==15) hexchar="f";
			}
			else hexchar=hexones;

			hexstring = hexchar + hexstring;
		}

		for (;i<2;i++) {
			hexstring="0"+hexstring;
		}

		return hexstring;
	}