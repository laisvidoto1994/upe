//global variables
let dataIndex = null;
let myMap     = null;
//
let year1 = 2010;
let year2 = 2011;
//
let occCounts = null;

function getOccurrencesByState(y1, y2){
    let stateDim = dataIndex.dimension(function(item){
	return item.ocorrencia_uf;
    });
    let stateGroup = stateDim.group();
    let yearDim = dataIndex.dimension(function(item){
	return +item.ocorrencia_dia.slice(0,4);
    });

    var years = [y1, y2];
    let extent = [1000000,0];
    let yearData = {};
    for(var i = 0 ; i < 2 ; ++i){
	let year = years[i];
	yearDim.filter(year);
	let counts = stateGroup.all();
	let result = {};
	counts.forEach(function(item){
	    result[item.key] = item.value;
	});
	yearDim.filterAll();
	yearData[year] = result;
    }
    return yearData;
}

function getColor(d){
    return d > 20   ? '#b2182b' :
           d > 15    ? '#d6604d' :
           d > 10    ? '#f4a582' :
           d > 5    ? '#fddbc7' :
           d > -5   ? '#d1e5f0' :
           d > -10   ? '#92c5de' :
           d > -55   ? '#4393c3' :
           d > -20  ? '#2166ac' :
	'#2166ac';
}


function polygonStyle(feature) {
    let occByState1 = occCounts[year1];
    let occByState2 = occCounts[year2];

    function getStateColor(name){
	let d = occByState2[name] - occByState1[name];
	return getColor(d);
    };
    
    return {
        fillColor: "red",
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
            grades = [-20, -15, -10, -5, 5, 10, 15, 20],
            labels = [];

	// loop through our density intervals and generate a label with a colored square for each interval
	div.innerHTML = '<h3>Legenda</h3><br>'+year1+'<br>'
	for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
		'<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
		grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
	}
	div.innerHTML += ('<br>'+ year2)
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
createMap();

//
occCounts = getOccurrencesByState(year1,year2);

//
addStates();

//
addLegend();
