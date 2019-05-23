//global variables
var myMap     = null;

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

function addPoints(){
    data.forEach(function(item){
	var latitude  = +item.ocorrencia_latitude;
	var longitude = +item.ocorrencia_longitude;

        //
        var circle = L.circle([item.ocorrencia_latitude, item.ocorrencia_longitude], {
            color: "red",
            fillColor: "red",
            fillOpacity: 0.5,
            radius: 500
        });
        
	circle.addTo(myMap);
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


//
createMap();

//
addPoints();

//
addLegend();
