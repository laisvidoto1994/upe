//global variables
var myMap     = null;
var dataIndex = null;
var circles = [];
var classificacaoDim = null;
var classificacaoGrp = null;
var barChart = null;

function createMap(){
    // create map
    myMap = L.map("mapID").setView([-16.062969971128574,-52.91032791137696], 4);

    // map properties
    var tileURL = 'http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png';
    var tileLayerProperties = {
	maxZoom: 18,
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    };

    // create tile layer
    var tileLayer = L.tileLayer(tileURL, tileLayerProperties);

    
    // add tile layer to map
    tileLayer.addTo(myMap);
}

function getColor(d){
    if(d.ocorrencia_classificacao == "ACIDENTE"){
	return "#1b9e77";
    }
    else if(d.ocorrencia_classificacao == "INCIDENTE"){
	return "#d95f02";
    }
    else if(d.ocorrencia_classificacao == "INCIDENTE GRAVE"){
	return "#7570b3";
    }
}

function addPoints(){
    //
    circles.forEach(function(circle){
	circle.removeFrom(myMap);
    });
    circles = [];
    
    //
    dataIndex.allFiltered().forEach(function(item){
	var latitude  = +item.ocorrencia_latitude;
	var longitude = +item.ocorrencia_longitude;

        //
        var circle = L.circle([item.ocorrencia_latitude, item.ocorrencia_longitude], {
            color: getColor(item),
            fillColor: getColor(item),
            fillOpacity: 0.5,
            radius: 500
        });

	circle.bindPopup("ID: " + item.codigo_ocorrencia);
	
	circle.addTo(myMap);

	circles.push(circle);
    });
}

function addLegend(){
    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {

	var div = L.DomUtil.create('div', 'info legend');
	var classes = ["Incidente", "Incidente Grave", "Acidente"];   
        var colors = ["#d95f02", "#7570b3", "#1b9e77"];

	// 
	for (var i = 0; i < classes.length; i++) {
            div.innerHTML +=
		'<i style="background:' + colors[i] + '"></i> ' +
	 	classes[i] + '<br>';
	}

	return div;
    };

    legend.addTo(myMap);
}

function barSelectionChanged(selection){
    if(selection.size == 0){
	classificacaoDim.filterAll();
    }
    else{
	classificacaoDim.filter(function(d){
	    return selection.has(d);
	});
    }
    addPoints();
}

function addBarChart(){
    barChart = new RowChart("barChart",500,400);
    barChart.setSelectionChangeCallback(barSelectionChanged);
    updateBarChart();
}

function updateBarChart(){
    //
    var data = classificacaoGrp.all();
    //
    barChart.setData(data);
}

function updateMap(){
    //
    //
}

//
dataIndex = crossfilter(data);
classificacaoDim = dataIndex.dimension(function(item){
    return item["ocorrencia_classificacao"];
});
classificacaoGrp = classificacaoDim.group();

//
createMap();

//
addPoints();

//
addLegend();

//
addBarChart();
