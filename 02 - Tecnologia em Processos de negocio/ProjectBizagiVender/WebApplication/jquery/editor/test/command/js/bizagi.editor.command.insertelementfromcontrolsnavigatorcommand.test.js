/*
	@title: Test command InsertElementFromControlsNavigator
	@authors: Alexander Mejia
	@date: 14-mar-12
	@description: This unit test will prove, the command InsertElementFromControlsNavigator
	*/
	
	bizagi.loader.then( function() {
	    
	    module( "insertElementFromControlsNavigator test" );
	    
	    test("insert Element From Controls Navigator Command", function(){	        
	        
	        var params,
	            command;
	        
	        params = { arguments: { data: "123" }, controller : {}, model: {} };
	        command = new bizagi.editor.insertElementFromControlsNavigatorCommand(params);
	        
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
	    
	    test( "load controller and create a new instantiate of insertElementFromControlsNavigatorCommand " , function(){
	        
	        var controller,
	            command,	            
	            parent,
	            render,
	            insertElementFromControlsNavigator;
	        
	        controller = new bizagi.editor.base.controller();	        
	        
	        command = new bizagi.editor.addElementCommand( { arguments: { name: "label", type: "render"}, controller: controller, model: controller.getRenderModel()}); 
	        command.execute();	   
	        	        	        
	        parent = controller.getRenderModel().form.properties.guid;
	        	        	        
	        insertElementFromControlsNavigator =  new bizagi.editor.insertElementFromControlsNavigatorCommand( { arguments: { position: 0, parent: parent, data: { name: "text", type: "render" } }, controller: controller, model: controller.getRenderModel()} );       
	        insertElementFromControlsNavigator.execute();
	        	        
	        strictEqual( controller.getRenderModel().form.elements.length, 2, "there are two elements in the model" );	        
	        strictEqual( controller.getRenderModel().form.elements[0].render.properties.displayName, "text", "render text inserted in first position" );
	        strictEqual( controller.getRenderModel().form.elements[1].render.properties.displayName, "label", "render label inserted in second position" );
	        	       	        	        
	        insertElementFromControlsNavigator.undo();
	        
	        strictEqual( controller.getRenderModel().form.elements.length, 1, "there are a element in the model" );	        
	        strictEqual( controller.getRenderModel().form.elements[0].render.properties.displayName, "label", "render label in first position" );
	        
	        insertElementFromControlsNavigator.execute();
	        	        
	        strictEqual( controller.getRenderModel().form.elements.length, 2, "there are two elements in the model" );	        
	        strictEqual( controller.getRenderModel().form.elements[0].render.properties.displayName, "text", "render text inserted in first position" );
	        strictEqual( controller.getRenderModel().form.elements[1].render.properties.displayName, "label", "render label inserted in second position" );
	        	        	             	        			
		});
					    	    	    
	});

