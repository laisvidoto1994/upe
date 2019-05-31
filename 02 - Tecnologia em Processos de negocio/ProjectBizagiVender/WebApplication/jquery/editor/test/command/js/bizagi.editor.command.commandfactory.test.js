
	/*
	@title: Test class commands factory
	@authors: Alexander Mejia
	@date: 28-feb-12
	@description: This unit test will prove, the commands factory			
	*/
    
    bizagi.loader.then( function() {
        module("class command factory");
        
        test("class", function(){
            var factory = new bizagi.editor.commandfactory({controller: "controller"});
            ok(!!factory["create"], "factory contain factory function");
            ok(!!factory.controller, "factory contain controller property"); 
            strictEqual(factory.create.length, 1, "the function create in factory class, accepts a parameter");                
        });
        
        test("throw exeption create function without command argument", function(){
	        raises(function(){			     
	             var factory = new bizagi.editor.commandfactory({controller: "controller"}); 
	             factory.create({model : "model"});
			}, "must throw error to pass, call create without command argument");			    
	    }) 
	    
	     test("throw exeption, call to create, without the corresponding command exists ", function(){
	        raises(function(){			     
	             var factory = new bizagi.editor.commandfactory({controller: "controller"}); 
	             factory.create({command : "addElement"});
			}, "must throw error to pass, call to create with command AddElement, but is not exists");			    
	    }) 
    
    });