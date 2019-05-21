//global variables
var myMap     = null;

let stateCoordinates = {
    AC: [ -8.77, -70.55]
  , AL: [ -9.71, -35.73]
  , AM: [ -3.07, -61.66]
  , AP: [  1.41, -51.77]
  , BA: [-12.96, -38.51]
  , CE: [ -3.71, -38.54]
  , DF: [-15.83, -47.86]
  , ES: [-19.19, -40.34]
  , GO: [-16.64, -49.31]
  , MA: [ -2.55, -44.30]
  , MT: [-12.64, -55.42]
  , MS: [-20.51, -54.54]
  , MG: [-18.10, -44.38]
  , PA: [ -5.53, -52.29]
  , PB: [ -7.06, -35.55]
  , PR: [-24.89, -51.55]
  , PE: [ -8.28, -35.07]
  , PI: [ -8.28, -43.68]
  , RJ: [-22.84, -43.15]
  , RN: [ -5.22, -36.52]
  , RO: [-11.22, -62.80]
  , RS: [-30.01, -51.22]
  , RR: [  1.89, -61.22]
  , SC: [-27.33, -49.44]
  , SE: [-10.90, -37.07]
  , SP: [-23.55, -46.64]
  , TO: [-10.25, -48.25]
};

function getColor(d){
    if(d == "ACIDENTE"){
	return "#1b9e77";
    }
    else if(d == "INCIDENTE"){
	return "#d95f02";
    }
    else if(d == "INCIDENTE GRAVE"){
	return "#7570b3";
    }
}

function getOccurrencesByState(){
    let stateDim = dataIndex.dimension(function(item){
	return [item.ocorrencia_uf, item.ocorrencia_classificacao];
    });
    let stateGroup = stateDim.group();
    let countData = stateGroup.all();
    //
    let yearData = [];
    for(let key in stateCoordinates){	
	yearData[key] = [];
	for(var i = 0 ; i < countData.length ; ++i){
	    if(countData[i].key[0] == key){
		var classificacao = countData[i].key[1];
		yearData[key].push({'num':countData[i].value,
				    'color':getColor(classificacao),
				    'label':classificacao});
	    }
	}
    }
    return yearData;
}

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

function addGlyphs(){
    var stateData = getOccurrencesByState();
    for(var state in stateCoordinates){
    	var coordinates = stateCoordinates[state];

    	L.pie([coordinates[0], coordinates[1]], stateData[state]).addTo(myMap);
    }
}

//
dataIndex = crossfilter(data);

//
createMap();

//
addGlyphs();

//
addLegend();
