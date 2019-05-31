/*
	@title: Test command ShowProperties
	@authors: Alexander Mejia
	@date: 12-mar-12
	@description: This unit test will prove, the command shoeProperties
	*/
	
	bizagi.loader.then( function() {
	    
	    module("show properties test");
	    
	    test("show properties Command", function(){	        
	        var params = {arguments: {data: "123"}, controller : {}, model: {}};
	        var command = new bizagi.editor.showPropertiesCommand(params);
	        ok(!!command["subscribe"], "command contain subscribe function");
			ok(!!command["publish"], "command contain publish function");
			ok(!!command.arguments, "command contain arguments property");
			ok(!!command.controller, "command contain controller property");
			ok(!!command.model, "command contain model property");
			ok(!!command["execute"], "command contain execute function");							    
			ok(!!command["undo"], "command contain undo function");							    
			ok(!!command["redo"], "command contain redo function");
			ok(!!command["validateArguments"], "command contain validateArguments function");										    
	    });
	    	   	    	    	    
	});

