var templateEditor;

$.when(bizagi.form.modeler.createForm({
    contextentity: '0d89ef75-d1f6-44af-bdc6-35443b8ddc74',
    scopedefinition: '2bce6192-0786-42c5-9d75-55a41a9fdd5f',
    version: '1.0',
    isActivityForm: false,
    context: 'template',
    data: {
        contextentity: { baref: {ref : '0d89ef75-d1f6-44af-bdc6-35443b8ddc74'}},
        elements: [{
            guid: "a7f4bed4-a0db-4667-99fc-ac5394b7dab5",
            properties: {
                guid: "",
                html: "<!-- Template:3 | type:Detail | 24.06.2015 - html --><div class='bz-tmpl-detail-3 bz-tpl'> <h3 class='bz-tpl-list-title bz-tpl-placeholder'>{{placeholder:Title}}</h3> <div class='bz-containter-template'> <div class='bz-tpl-container-image'> <ul class='col-md-12 bz-tpl-list'> <li class='clearfix'> <h4 class='bz-tpl-header bz-tpl-placeholder'>{{placeholder:Header}}</h4> </li> {{repeater}} {{repeater:item}} <li class='clearfix'> <div class='bz-tpl-list-img bz-tpl-img' >{{placeholder:image}}</div> </li> {{/repeater:item}} {{/repeater}} </ul> </div> <div class='bz-info-container'> <div class='row-fluid'> <ul class='col-sm-6 bz-tpl-list'> <li class='clearfix'> <h4 class='bz-tpl-header bz-tpl-placeholder'>{{placeholder:Header}}</h4> </li> {{repeater}} {{repeater:item}} <li class='clearfix'> <div class='row'> <label class='col-sm-4 bz-tpl-list-term bz-tpl-placeholder'>{{placeholder:label}}</label> <span class='col-sm-6 bz-tpl-list-desc bz-tpl-placeholder'>{{placeholder}}</span> </div> </li> {{/repeater:item}} {{/repeater}} </ul> <ul class='col-sm-6 bz-tpl-list'> <li class='clearfix'> <h4 class='bz-tpl-header bz-tpl-placeholder'>{{placeholder:Header}}</h4> </li> {{repeater}} {{repeater:item}} <li class='clearfix'> <div class='row'> <label class='col-sm-4 bz-tpl-list-term bz-tpl-placeholder'>{{placeholder:label}}</label> <span class='col-sm-6 bz-tpl-list-desc bz-tpl-placeholder'>{{placeholder}}</span> </div> </li> {{/repeater:item}} {{/repeater}} </ul> </div> </div> </div> </div> <footer class='bz-tpl-footer row-fluid bz-tpl-placeholder'>{{placeholder:Footer}}</footer> </div><!--/ Template Detail 3 - html -->",
                css: {
                    desktop: ".bz-tmpl-detail-3.bz-tpl{padding:1em 2em}.bz-tmpl-detail-3 .bz-tpl-header{font-size:1.2em;font-weight:700;display:block;width:100%;clear:both}.bz-tmpl-detail-3 .bz-tpl-list-img img{display:block;width:100%;height:auto}.bz-tmpl-detail-3 .bz-tpl-list-img{float:left;margin-right:1.4em}.bz-tmpl-detail-3 .bz-tpl-bd{overflow:hidden}.bz-tmpl-detail-3 .bz-tpl-list-title{font-size:1.2em;margin:.2em 0 .4em;padding-bottom:8px;border-bottom:1px solid #C1C3C3}.bz-tmpl-detail-3 .bz-tpl-list{padding:0;list-style:none}.bz-tmpl-detail-3 .bz-tpl-list>li{margin-bottom:.4em}.bz-tmpl-detail-3 .bz-tpl-list-inline>li{float:left;padding-right:4px}.bz-tmpl-detail-3 .bz-tpl-list-term{float:left;min-width:25%;margin-right:1em;font-weight:700}.bz-tmpl-detail-3 .bz-tpl-footer{font-size:13px;font-weight:400;color:#C1C3C3} .bz-info-container {position:absolute; padding-left:300px; width:100%} .bz-containter-template {overflow: hidden; position: relative;} .bz-tmpl-detail-3 .bz-tpl-container-image .bz-tpl-list > li:not(:first-child):not(:nth-child(2)) {width:80px; display:inline-block;} .bz-tmpl-detail-3 .bz-tpl-container-image .bz-tpl-list > li .bz-tpl-img {margin:0} .bz-tmpl-detail-3 .bz-tpl-container-image .bz-tpl-list > li:not(:first-child):not(:nth-child(2)) .ui-bizagi-render-layout.ui-droppable.ui-draggable {height: 80px; width: 80px; text-align:center}  @media (max-width: 1350px) { } @media (max-width: 900px) { .bz-containter-template .bz-tpl-container-image {float: none; display: block; overflow: hidden; margin: 0 auto;} .bz-info-container{position: relative;padding-left: 0;} }",
                    tablet: ".bz-tpl-img-txt h3.bz-tpl-header{color: #787878;font-size: 20px;font-weight: lighter}.bz-tpl-img-txt .ui-bizagi-render-layout-image-wrapper{margin-left: auto;margin-right: auto;text-align: center}.bz-tpl-img-txt .bz-tpl-img{float: right;width: 30%}.bz-tpl-img-txt .bz-tpl-img img{max-width: 130px;width: 100%;margin-top: 5px}.bz-tpl-img-txt .template-container:after{content: ' ';display: table;clear: both}.bz-tpl-img-txt .bz-tpl-data{overflow: auto}.bz-tpl-img-txt ul{padding-left: 10px;list-style: none;margin: 0}.bz-tpl-img-txt li{margin: 5px;max-height: 30px}.bz-tpl-img-txt li:after{clear: both;content: ' ';display: table}.bz-tpl-img-txt label.bz-tpl-label{float: left;width: 30%;text-align: right;padding-right: 25px;color: #787878;padding: 5px 5px 0 5px}.bz-tpl-img-txt div.bz-tpl-text{width: 70%;float: right;background-color: #E8EEF4;padding: 5px;color: #195891}",
                    mobile: ".bz-tpl-img-txt h3.bz-tpl-header{color: #787878;font-size: 20px;font-weight: lighter}.bz-tpl-img-txt .ui-bizagi-render-layout-image-wrapper{margin-left: auto;margin-right: auto;text-align: center}.bz-tpl-img-txt .bz-tpl-img{float: left}.bz-tpl-img-txt .bz-tpl-img img{max-width: 200px;width: 100%}.bz-tpl-img-txt .template-container:after{content: ' ';display: table;clear: both}.bz-tpl-img-txt .bz-tpl-data{overflow: hidden}.bz-tpl-img-txt ul{padding-left: 10px;list-style: none;margin: 0}.bz-tpl-img-txt li{margin: 5px}.bz-tpl-img-txt label.bz-tpl-label{display: block;width: 100%;color: #787878;font-weight: lighter;font-size: 14px;line-height: 22px}.bz-tpl-img-txt div.bz-tpl-text{width: 100%;display: block;background-color: #E8EEF4;padding: 5px;color: #195891;font-size: 12px;line-height: normal}"
                }
            },
            type: "layout"
        }],
        type: "template",
        properties: {
            enable: true,
            layoutguid: "d4f3bf88-9e4e-4d07-a981-1741598753cf",
            showinhome: true,
            showinprocesses: true,
            templatetype: "List"

        }
    }
    
    //html : '<div class=\"bz-tpl-img-txt\"><h3 class=\"bz-tpl-header\">{{placeholder:title}}</h3><div class=\"bz-tpl-data\"><ul>{{repeater}}{{repeater:item}}<li><label class=\"bz-tpl-label\">{{placeholder:label}}</label><div class=\"bz-tpl-text\">{{placeholder}}</div></li>{{/repeater:item}}{{repeater:item}}<li><label class=\"bz-tpl-label\">{{placeholder:label}}</label><div class=\"bz-tpl-text\">{{placeholder}}</div></li>{{/repeater:item}}{{/repeater}}</ul></div></div>',    
}))
    .done(function (instance) {
        templateEditor = instance;
    });

// Custom stuff
$("#floating-buttons").hover(function () {
    $("#floating-buttons").css("opacity", "1");
}, function () {
    $("#floating-buttons").css("opacity", "0.1");
});
$("#btnLoad").click(function () {
    // Open a dialog
    var popup = $("#json-code-editor");
    popup.dialog({
        title: "Type the JSON code ...",
        height: 800,
        width: 800,
        modal: true,
        buttons: [
	        {
	            text: "Load",
	            click: function () {
	                var code = popup.find("textarea").val();

	                try {
	                    code = JSON.parse(code);
	                } catch (e) {
	                    code = null;
	                    alert("Invalid JSON!");
	                }

	                if (code) templateEditor.load(code);
	                popup.dialog("close");
	            }
	        }
        ],
        close: function () {
            popup.dialog("destroy");
        }
    });
});

$("#btnSave").click(function () {
    // Open a dialog
    var popup = $("#json-code-editor");
    var code = JSON.encode(templateEditor.save());
    popup.find("textarea").val(code)
    popup.dialog({
        title: "This is the code for the form ...",
        height: 800,
        width: 800,
        modal: true,
        close: function () {
            popup.dialog("destroy");
        }
    });
});

