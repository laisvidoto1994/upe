/*
	@title: Test command ChangeProperty
	@authors: Alexander Mejia
	@date: 13-mar-12
	@description: This unit test will prove, the command changeProperty
	*/
	
	bizagi.loader.then( function() {
	    
	    module( "changeProperty test" );
	    
	    test( "change Property Command", function(){	        
	        
	        var params,
	            command;
	            
	        params = { arguments: { data: "123" }, controller : {}, model: {} };
	        command = new bizagi.editor.changePropertyCommand( params );
	        
	        ok( !!command["subscribe"], "command contain subscribe function" );
			ok( !!command["publish"], "command contain publish function" );
			ok( !!command.arguments, "command contain arguments property" );
			ok( !!command.controller, "command contain controller property" );
			ok( !!command.model, "command contain model property" );
			ok( !!command["execute"], "command contain execute function" );							    
			ok( !!command["undo"], "command contain undo function" );							    
			ok( !!command["redo"], "command contain redo function" );
			ok( !!command["validateArguments"], "command contain validateArguments function " );										    
	    });
	    
	    test( "load controller and create a new instantiate of changePropertyCommand " , function(){
	        
	        var controller,
	            command,
	            id,
	            changePropertyCommand;
	        
	        controller = new bizagi.editor.base.controller();	        
	        
	        command = new bizagi.editor.addElementCommand( {arguments: { name: "label", type: "render"}, controller: controller, model: controller.getRenderModel()}); 
	        command.execute();	        
	        
	        strictEqual(controller.getRenderModel().form.elements[0].render.properties.displayName, "label", "displayName current is LABEL");
	        
	        id = controller.getRenderModel().form.elements[0].render.properties.guid; 
	        	        
	        changePropertyCommand = new bizagi.editor.changePropertyCommand( {arguments: { id: id, property: "displayName", newValue: "EDITORES", oldValue: "label" }, controller: controller, model: controller.getRenderModel() } ); 
	        
	        changePropertyCommand.execute();	        
	        strictEqual( controller.getRenderModel().form.elements[0].render.properties.displayName, "EDITORES", "changePropertyCommand was executed" );
	        
	        changePropertyCommand.undo();
	        strictEqual( controller.getRenderModel().form.elements[0].render.properties.displayName, "label", "undo was executed" );
	        
	        changePropertyCommand.execute();	        
	        strictEqual( controller.getRenderModel().form.elements[0].render.properties.displayName, "EDITORES", "changePropertyCommand was executed" );
			
		});	
	    	    	    
	});

