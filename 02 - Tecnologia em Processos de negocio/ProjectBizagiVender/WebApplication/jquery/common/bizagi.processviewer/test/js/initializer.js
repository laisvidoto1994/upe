var processviewerElement;
$(document).ready(function(){


$('.button-route').on("click", function(){
    $('.processviewer-container').processviewer('drawRoute',['48ffc223-ddf4-4fe8-b2e3-8c1e4f110a60','ed466707-12ee-4513-a96a-9869a5d41575','0877e3b6-3545-4dd3-9696-0877fa770116','63871c50-3a00-45b0-8afd-40d726ad9925','332ee9b6-2fb2-4ffb-bdc9-0bd594513138','41311143-3609-410b-8814-cc43402154f1','84361099-4111-4e8c-b873-010668a74184']);
});

$('.button-clear-route').on("click", function(){
    $('.processviewer-container').processviewer('clearRoute');
});

$('.button-select-shape').on("click", function(){
    $('.processviewer-container').processviewer('selectShape', '0877e3b6-3545-4dd3-9696-0877fa770116');
    $('.processviewer-container').processviewer('selectShape', '332ee9b6-2fb2-4ffb-bdc9-0bd594513138');
    $('.processviewer-container').processviewer('selectShape', '37265a4d-d7fb-4fda-9bab-7ef623a16181');
    $('.processviewer-container').processviewer('selectShape', '4feafed0-c1f5-4f32-a3f5-b6fbc8d3a6cc');
});

$('.button-unselect-shape').on("click", function(){
    $('.processviewer-container').processviewer('unSelectShape', '0877e3b6-3545-4dd3-9696-0877fa770116');
});

$('.button-unselect-shapes').on("click", function(){
    $('.processviewer-container').processviewer('unSelectAllShapes');
});

$('.button').on("click", function(){

    if(processviewerElement){
        processviewerElement.processviewer('destroy');
    }

    processviewerElement = $('.processviewer-container').processviewer({
        /*image:'img/SampleProcess.png',*/
        height:400,
        width:'auto',
        jsonBizagi:{
            processDefinition:'json/ProcessDefinition.json.txt',
            processGraphicsInfo: 'json/ProcessGraphicsInfo.json.txt'
        },
        template:'../tmpl/processviewer.tmpl.html',
        zoomRange: 5,
        unavailableImage: 'img/unavailable-image.jpg'
    });

});


$('.button-data').on("click", function(){

    if(processviewerElement){
        processviewerElement.processviewer('destroy');
    }
    
    console.log(processviewerElement);

    processviewerElement = $('.processviewer-container').processviewer({
        height:400,
        width:'100%',
        jsonBizagi:jsonLoadedBefore,
        template:'../tmpl/processviewer.tmpl.html',
        zoomRange: 5,
        unavailableImage: 'img/unavailable-image.jpg'
    });

});


$('.button-data-dario').on("click", function(){

    var webservide_definition = {url:'http://localhost/BizAgiR100x/Rest/Reports/Components/GetProcessDefinition', data:{processId:$('.data-id').val() || 1}};
    var webservide_graphic = {url:'http://localhost/BizAgiR100x/Rest/Reports/Components/GetProcessGraphicInfo', data:{processId:$('.data-id').val() || 1}};


    var jsonLoaded;
    $.when($.get(webservide_definition.url, webservide_definition.data), $.get(webservide_graphic.url, webservide_graphic.data)).done(function (a, b) {
                            
            jsonLoaded = {
                processDefinition: a[0],
                processGraphicsInfo: b[0]
            };

        processviewerElement = $('.processviewer-container').processviewer({
            height:300,
            width:'90%',
            jsonBizagi:jsonLoaded,
            template:'../tmpl/processviewer.tmpl.html',
            zoomRange: 5,
            unavailableImage: 'img/unavailable-image.jpg'
        });
    });



});


$('nav').hide();


var jsonLoadedBefore;
$.when($.get('json/ProcessDefinition.json.txt'), $.get('json/ProcessGraphicsInfo.json.txt')).done(function (a, b) {
                        
        jsonLoadedBefore = {
            processDefinition: $.parseJSON(a[0]),
            processGraphicsInfo: $.parseJSON(b[0])
        };

        $('nav').show();

});


var jsonLoadedBeforeDario;
$.when($.get('json/ProcessDefinition.darioes.json.txt'), $.get('json/ProcessGraphicsInfo.darioes.json.txt')).done(function (a, b) {
                        
        jsonLoadedBeforeDario = {
            processDefinition: $.parseJSON(a[0]),
            processGraphicsInfo: $.parseJSON(b[0])
        };

        $('nav').show();

});


$(document).on('hs.click',function(obj){
    console.log(obj);
});


$(document).on('hs.complete',function(obj){
    console.log(obj);

    processviewerElement.processviewer('drawRoute',['48ffc223-ddf4-4fe8-b2e3-8c1e4f110a60','ed466707-12ee-4513-a96a-9869a5d41575','0877e3b6-3545-4dd3-9696-0877fa770116','63871c50-3a00-45b0-8afd-40d726ad9925','332ee9b6-2fb2-4ffb-bdc9-0bd594513138','41311143-3609-410b-8814-cc43402154f1','84361099-4111-4e8c-b873-010668a74184']);
});

/*$(document).on('hs.error',function(obj){
    console.log(obj);
});*/

/*$(document).on('hs.mouseIn',function(obj){
    console.log(obj);
});


$(document).on('hs.mouseOut',function(obj){
    console.log(obj);
});*/
    
});



function getHotpots(num){
    var hs = [];
    for(var i=0; i<=num; i++){
        var hsUni = {
                        x:i*50,
                        y:0,
                        w:50,
                        h:50,
                        id:'id'+i,
                        css: 'rect task'
                    };
        if(i>10){
            hsUni.onClick = function(){
                            console.log('onClick');
                        };

            hsUni.onMouseOver = function(){
                            console.log('onMouseOver');
                        };

            hsUni.onMouseOut = function(){
                            console.log('onMouseOut');
                        };
        }

        hs.push(hsUni);
    }

    return hs;
}