/*
	@title: Test command AddElement
	@authors: Alexander Mejia
	@date: 28-feb-12
	@description: This unit test will prove, the command addElement
	*/
	
	bizagi.loader.then( function() {
	    
	    module( "addElement test" );
	    
	    test("add Element Command", function(){	        
	        
	        var params,
	            command;
	        
	        params = { arguments: { data: "123" }, controller : {}, model: {} };
	        command = new bizagi.editor.addElementCommand(params);
	        
	        ok( !!command["subscribe"], "command contain subscribe function" );
			ok( !!command["publish"], "command contain publish function" );
			ok( !!command.arguments, "command contain arguments property" );
			ok( !!command.controller, "command contain controller property" );
			ok( !!command.model, "command contain model property" );
			ok( !!command["execute"], "command contain execute function" );							    
			ok( !!command["undo"], "command contain undo function" );							    
			ok( !!command["redo"], "command contain redo function" );
			ok( !!command["validateArguments"], "command contain validateArguments function" );										    
	    });
	    
	    test( "load controller and create a new instantiate of addElementCommand " , function(){
	        
	        var controller,
	            command;
	        
	        controller = new bizagi.editor.base.controller();	       	        
	        command = new bizagi.editor.addElementCommand( { arguments: { name: "label", type: "render" }, controller: controller, model: controller.getRenderModel() } ); 	        
	        command.execute();
	        
	        strictEqual( controller.getRenderModel().form.elements.length, 1, "element added to rendering" );	        	        
	        strictEqual( controller.getRenderModel().form.elements[0].render.properties.type, "label", "label control was added to form" );
	        
	        command.undo();
	        
	        strictEqual( controller.getRenderModel().form.elements.length, 0, "undo executed" );	
	        
	        command.execute();
	        
	        strictEqual( controller.getRenderModel().form.elements.length, 1, "element added to rendering" );	        
	        strictEqual( controller.getRenderModel().form.elements[0].render.properties.type, "label", "label control was added to form" );
	        			
		});	
	    	    	    
	});
