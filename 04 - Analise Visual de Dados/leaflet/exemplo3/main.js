//global variables
var dataIndex = null;
var myMap     = null;

function getOccurrencesByState(){
    let stateDim = dataIndex.dimension(function(item){
	return item.ocorrencia_uf;
    });
    let stateGroup = stateDim.group();
    let stateCounts = stateGroup.all();
    
    //
    for(var i = 0 ; i < stateCounts.length ; ++i){
	var count = stateCounts[i];
	for(var j = 0 ; j < statesGeometry.features.length ; ++j){
	    var feature = statesGeometry.features[j];
	    if(feature.properties.UF == count.key){
		feature.properties.count = count.value;
	    }
	}
    }
}

function getColor(d){
	return d > 1000 ? '#990000' :
           d > 500  ? '#d7301f' :
           d > 200  ? '#ef6548' :
           d > 100  ? '#fc8d59' :
           d > 50   ? '#fdbb84' :
           d > 20   ? '#fdd49e' :
           d > 10   ? '#fee8c8' :
            '#fff7ec';
}


function polygonStyle(feature) {
    
    return {
        fillColor: getColor(feature.properties.count),
        weight: 2,
        opacity: 1,
        color: 'white',
        fillOpacity: 0.7
    };
}

function addStates(){
    let layer = L.geoJson(statesGeometry,
			  {style:polygonStyle}).addTo(myMap);
}


function addLegend(){
    var legend = L.control({position: 'bottomright'});
    legend.onAdd = function (map) {

	var div = L.DomUtil.create('div', 'info legend'),
            grades = [0, 10, 20, 50, 100, 200, 500, 1000],
            labels = [];

	// loop through our density intervals and generate a label with a colored square for each interval
	for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
		'<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
		grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
	}

	return div;
    };

    legend.addTo(myMap);
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

//
dataIndex = crossfilter(data);

//
getOccurrencesByState();

//
createMap();

//
addStates();

//
addLegend();
