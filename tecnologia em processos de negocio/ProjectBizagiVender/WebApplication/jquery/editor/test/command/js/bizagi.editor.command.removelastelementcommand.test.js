/*
	@title: Test command removeElement
	@authors: Alexander Mejia
	@date: 01-mar-12
	@description: This unit test will prove, the command removeLastElement
	*/
	
	bizagi.loader.then( function() {
	    
	    module( "removeLastElement test" );
	    
	    test( "Remove Last Element Command", function(){	        
	        
	        var params,
	            command;
	        
	        params = { arguments: { data: "123" }, controller : {}, model: {} };
	        command = new bizagi.editor.removeLastElementCommand( params );
	        
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
	    
	    test( "load controller and create a new instantiate of removeLastElementCommand " , function(){
	        
	        var controller,
	            command,
	            removeLastElementCommand;
	            
	        
	        controller = new bizagi.editor.base.controller();	       
	        
	        command = new bizagi.editor.addElementCommand( { arguments: { name: "label", type: "render" }, controller: controller, model: controller.getRenderModel() } ); 
	        command.execute();
	        
	        strictEqual( controller.getRenderModel().form.elements.length, 1, "element added" );	        
	        strictEqual( controller.getRenderModel().form.elements[0].render.properties.type, "label", "form contain a label render" );
	        	        
	        removeLastElementCommand = new bizagi.editor.removeLastElementCommand( { arguments: { name: "label", type: "render" }, controller: controller, model: controller.getRenderModel() } );
	        removeLastElementCommand.execute();
	        	        	        
	        strictEqual( controller.getRenderModel().form.elements.length, 0, "Last element removed of model" );	
	        
	        removeLastElementCommand.undo();
	        
	        strictEqual( controller.getRenderModel().form.elements.length, 1, "element added" );	        	     
	        strictEqual( controller.getRenderModel().form.elements[0].render.properties.type, "label", "form contain a label render" );
	        
            removeLastElementCommand.execute();
	        	        	        
	        strictEqual( controller.getRenderModel().form.elements.length, 0, "Last element removed of model" );	
			
		});	
	    	    	    
	});

