//global variables
let dataIndex = null;
let myMap1     = null;
let myMap2     = null;
let source = null;

function addLegends(){
    var maps = [myMap1, myMap2];

    maps.forEach(function(myMap){
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
    });
    
}

function coordinator(center, zoom, caller){
    if(caller == myMap1){
	if(source != myMap2){
	    console.log('move map2');
    	    myMap2.setView(center,zoom);
	}
    }
    else{
	if(source != myMap1){
	    console.log('move map1');
	    debugger
	    myMap1.setView(center,zoom);
	}
    }
}

function createMaps(){
    //
    //variables used to create the map    
    var mapID = "mapID";
    var tileURL = 'http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png';
    var tileLayerProperties = {
	maxZoom: 18,
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    };

    //
    myMap1 = L.map("map1").setView([-16.062969971128574,-52.91032791137696], 4);
    var tileLayer = L.tileLayer(tileURL, tileLayerProperties);
    tileLayer.addTo(myMap1);
    //
    myMap2 = L.map("map2").setView([-16.062969971128574,-52.91032791137696], 4);
    var tileLayer = L.tileLayer(tileURL, tileLayerProperties);
    tileLayer.addTo(myMap2);

    //
    myMap1.on('mousedown',function(e){
	source = myMap1;
    });
    myMap1.on('move',function(e){
	coordinator(e.target.getCenter(),e.target.getZoom(),myMap1);
    });

    myMap1.on('zoom',function(e){
	coordinator(e.target.getCenter(),e.target.getZoom(),myMap1);
    });

    //
    myMap2.on('mousedown',function(e){
	source = myMap2;
    });
    myMap2.on('move',function(e){
	coordinator(e.target.getCenter(),e.target.getZoom(),myMap2);
    });

    myMap2.on('zoom',function(e){
	coordinator(e.target.getCenter(),e.target.getZoom(),myMap2);
    });    
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
    let data1 = data.filter(function(item){
	return item.ocorrencia_dia.slice(0,4) == "2010";
    });
    
    data1.forEach(function(item){
	var latitude  = +item.ocorrencia_latitude;
	var longitude = +item.ocorrencia_longitude;

        //
        var circle = L.circle([item.ocorrencia_latitude, item.ocorrencia_longitude], {
            color: getColor(item),
            fillColor: getColor(item.ocorrencia_classificacao),
            fillOpacity: 0.5,
            radius: 500
        });
        
	circle.addTo(myMap1);
    });

    //
    let data2 = data.filter(function(item){
	return item.ocorrencia_dia.slice(0,4) == "2011";
    });
    
    data2.forEach(function(item){
	var latitude  = +item.ocorrencia_latitude;
	var longitude = +item.ocorrencia_longitude;

        //
        var circle = L.circle([item.ocorrencia_latitude, item.ocorrencia_longitude], {
            color: getColor(item),
            fillColor: getColor(item),
            fillOpacity: 0.5,
            radius: 500
        });
        
	circle.addTo(myMap2);
    });
}

//
dataIndex = crossfilter(data);

//
createMaps();

//
addPoints();

//
addLegends();
