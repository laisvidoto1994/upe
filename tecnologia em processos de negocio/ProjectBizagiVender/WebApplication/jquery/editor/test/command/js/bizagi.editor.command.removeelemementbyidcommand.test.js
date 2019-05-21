
/*
	@title: Test command RemoveElementById
	@authors: Alexander Mejia
	@date: 16-mar-12
	@description: This unit test will prove, the command removeElementById
	*/
	
	bizagi.loader.then( function() {
	    
	    module( "removeElementById test" );
	    
	    test( "remove Element By Id Command", function(){	        
	        var params,
	            command;
	        
	        params = { arguments: { data: "123" }, controller : {}, model: {} };
	        command = new bizagi.editor.removeElementByIdCommand( params );
	        
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
	    
	    test( "load controller and create a new instantiate of removeElementByIdCommand " , function(){
	        
	        var controller,
	            command1,
	            parentGroup,
	            element,
	            render,
	            insertElementCommand,
	            removeElementByIdCommand;
	            	            	            	            	        
	        controller = new bizagi.editor.base.controller();	        
	        
	        command1 = new bizagi.editor.addElementCommand( { arguments: { name: "group", type: "group" }, controller: controller, model: controller.getRenderModel() } ); 
	        command1.execute();
	        
	        parentGroup = controller.getRenderModel().form.elements[0].container.properties.guid;
	        
	        element = {
	            properties: {
	                displayName: "text",
	                type: "text"
	            }
	        }
	        
	        render = new bizagi.editor.base.render( element );
	        
	        insertElementCommand =  new bizagi.editor.insertElementCommand( { arguments: { position: 0, parent: parentGroup, element: render }, controller: controller, model: controller.getRenderModel() } );	               
	        insertElementCommand.execute();
	        
	        strictEqual( controller.getRenderModel().form.elements.length, 1, "element added to rendering" );
	        strictEqual( controller.getRenderModel().form.elements[0].container.elements.length, 1, "element added to group" );
	        	        	        	       	        	        
	        removeElementByIdCommand = new bizagi.editor.removeElementByIdCommand( { arguments: { guid: parentGroup }, controller: controller, model: controller.getRenderModel () } );
	        removeElementByIdCommand.execute();	        
	        
	        strictEqual( controller.getRenderModel().form.elements.length, 0, "element removed" );	        
	        removeElementByIdCommand.undo();
	        
	        strictEqual( controller.getRenderModel().form.elements.length, 1, "element added to rendering");
	        strictEqual( controller.getRenderModel().form.elements[0].container.elements.length, 1, "element added to group" );
	        
	        removeElementByIdCommand.execute();	        
	        strictEqual( controller.getRenderModel().form.elements.length, 0, "element removed" );	        
	        	        			
		});	
		
		test( "removeElementByIdCommand from form element" , function(){
	        
	        var controller,
	            command1,
	            parentGroup,
	            element,
	            render,
	            insertElementCommand,
	            removeElementByIdCommand;
	            	            	            	            	        
	        controller = new bizagi.editor.base.controller();	        
	        
	        command1 = new bizagi.editor.addElementCommand( { arguments: { name: "group", type: "group" }, controller: controller, model: controller.getRenderModel() } ); 
	        command1.execute();
	        
	        parentGroup = controller.getRenderModel().form.elements[0].container.properties.guid;
	        	       	        	        	        	       	        	        
	        removeElementByIdCommand = new bizagi.editor.removeElementByIdCommand( { arguments: {guid: parentGroup}, controller: controller, model: controller.getRenderModel () } );
	        removeElementByIdCommand.execute();	        
	        strictEqual( controller.getRenderModel().form.elements.length, 0, "element removed" );
	        
	        removeElementByIdCommand.undo();
	        
	        strictEqual( controller.getRenderModel().form.elements.length, 1, "element added to rendering");
	        strictEqual( controller.getRenderModel().form.elements[0].container.properties.type, "group", "group inserted" );
	        
	        removeElementByIdCommand.execute();	        
	        strictEqual( controller.getRenderModel().form.elements.length, 0, "element removed" );	        
	        	        			
		});
	    	    	    
	});
