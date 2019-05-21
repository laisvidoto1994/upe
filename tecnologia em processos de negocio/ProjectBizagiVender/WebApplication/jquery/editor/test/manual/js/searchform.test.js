 // Loads the definition file
var editor;
$.when(bizagi.form.modeler.createForm({ context: "searchform" }))
.done(function (_editor) {
    editor = _editor;
});
                	
// Custom stuff
$("#floating-buttons").hover(function() {
    $("#floating-buttons").css("opacity", "1");
}, function() {
    $("#floating-buttons").css("opacity", "0.1");
});
$("#btnLoad").click(function() {
    // Open a dialog
    var popup = $("#json-code-editor");
    popup.dialog({
        title: "Type the JSON code ...",
        height: 800,
        width: 800,
        modal: true, 
        buttons: [
	        {   text: "Load",
                click: function(){
            	    var code = popup.find("textarea").val();
                	
                	try {
                	    code = JSON.parse(code);
                	} catch(e) {
                		code = null;
                		alert("Invalid JSON!");
                	}
                	
                	if (code) editor.load(code);
                	popup.dialog("close");
                }
            }
        ],
	    close: function () {
		    popup.dialog("destroy");	
	    }
    });
});	

$("#btnSave").click(function() {
    // Open a dialog
    var popup = $("#json-code-editor");
	var code = JSON.encode(editor.save());
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

  
 
 
 

