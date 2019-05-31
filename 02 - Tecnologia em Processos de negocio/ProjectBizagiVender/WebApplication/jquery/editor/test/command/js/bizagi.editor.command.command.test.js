
	/*
	@title: Test base commands
	@authors: Alexander Mejia
	@date: 28-feb-12
	@description: This unit test will prove, the base classes for commands	
	*/
	
	bizagi.loader.then( function() {
	    
	    module("base command test");
	    
	    test("class command base", function(){	        
	        var params = {arguments: {data: "123"}, controller : {}, model: {}};
	        var commandbase = new bizagi.editor.command(params);
	        ok(!!commandbase["subscribe"], "commandbase contain subscribe function");
			ok(!!commandbase["publish"], "commandbase contain publish function");
			ok(!!commandbase.arguments, "commandbase contain arguments property");
			ok(!!commandbase.controller, "commandbase contain controller property");
			ok(!!commandbase.model, "commandbase contain model property");
			ok(!!commandbase["execute"], "commandbase contain execute function");							    
			ok(!!commandbase["undo"], "commandbase contain undo function");							    
			ok(!!commandbase["redo"], "commandbase contain redo function");
			ok(!!commandbase["validateArguments"], "commandbase contain validateArguments function");
			
							    
	    });	
	    	    
	    test("throw exeption command without arguments", function(){
	        raises(function(){
			     var params = {controller : {}, model: {}};
	             var commandbase = new bizagi.editor.command(params);    
			}, "must throw error to pass, Command instantiated without arguments");			    
	    })    	    	    
	});
	
