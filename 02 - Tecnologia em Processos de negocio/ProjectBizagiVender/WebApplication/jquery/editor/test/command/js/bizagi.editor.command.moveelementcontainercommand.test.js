
/*
	@title: Test command MoveElementContainer
	@authors: Alexander Mejia
	@date: 06-mar-12
	@description: This unit test will prove, the command MoveElementContainer
	*/
	
	bizagi.loader.then( function() {
	    
	    module( "MoveElementContainer test" );
	    

	    test( "move Element Container Command", function(){
	    
	        var params,
	            command;
	            	        
	        params = { arguments: { data: "123" }, controller : {}, model: {} };
	        command = new bizagi.editor.moveElementContainerCommand(params);
	        
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
	    
	    test( " load controller and create a new instantiate of moveElementContainerCommand " , function(){
	        
	        var controller,
	            command,
	            parent,	            
	            addElementCommand,
	            parentGroup,
	            moveElementContainerCommand;
	            	            	            	        
	        controller = new bizagi.editor.base.controller();	        	        
	        command = new bizagi.editor.addElementCommand(  {arguments: { name: "label", type: "render" }, controller: controller, model: controller.getRenderModel()} ); 
	        command.execute();
	        	   
	        parent = controller.getRenderModel().form.properties.guid;
	        
	        addElementCommand = new bizagi.editor.addElementCommand( {arguments: { name: "group", type: "group" }, controller: controller, model: controller.getRenderModel() } );
	        addElementCommand.execute();
	        parentGroup = controller.getRenderModel().form.elements[1].container.properties.guid;       
	        
	        strictEqual(controller.getRenderModel().form.elements[0].render.properties.displayName, "label", "render label inserted in first position");
	        strictEqual(controller.getRenderModel().form.elements[1].container.properties.displayName, "group", "container group inserted in second position");
	        strictEqual(controller.getRenderModel().form.elements.length, 2, "there are two elements in the model");
	        
	        moveElementContainerCommand = new bizagi.editor.moveElementContainerCommand( {arguments: { posIni: 0, posEnd: 0, parentSource: parent, parentTarget: parentGroup}, controller: controller, model: controller.getRenderModel()})
	        moveElementContainerCommand.execute();
	        
	        strictEqual(controller.getRenderModel().form.elements.length, 1, "there are an element in the model");
	        strictEqual(controller.getRenderModel().form.elements[0].container.elements[0].render.properties.displayName, "label", "render label is in first position");
	        strictEqual(controller.getRenderModel().form.elements[0].container.elements.length, 1, "there are a element in the horizontal container");
	        
	        moveElementContainerCommand.undo();
	        
	        strictEqual(controller.getRenderModel().form.elements[0].render.properties.displayName, "label", "render label inserted in first position");
	        strictEqual(controller.getRenderModel().form.elements[1].container.properties.displayName, "group", "container group inserted in second position");
	        strictEqual(controller.getRenderModel().form.elements.length, 2, "there are two elements in the model");
	        	        	             	        			
	   });	
				
	});
            