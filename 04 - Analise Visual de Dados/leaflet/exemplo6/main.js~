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

//
createMap();
