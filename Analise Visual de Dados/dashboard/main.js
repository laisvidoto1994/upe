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

function addBarChart(){
    debugger
    var barChart = new RowChart("barChart",500,400);
}

//
createMap();

//
addPoints();

//
addBarChart();
