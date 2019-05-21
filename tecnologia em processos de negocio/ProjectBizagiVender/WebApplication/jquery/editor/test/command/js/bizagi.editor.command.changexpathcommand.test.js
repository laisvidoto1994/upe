
/*
	@title: Test command changeXpath
	@authors: David Montoya
	@date: 07-abr-12
	@description: This unit test will prove, the command changeXpath
	*/
	
	bizagi.loader.then( function() {
	    
	    module( "changeXpathCommand test" );
	    
	    test("change_xpath_command", 9, function(){	        
	        
	        var params,
	            command;
	        
	        params = { arguments: { data: "123" }, controller : {}, model: {} };
	        command = new bizagi.editor.changeXpathCommand( params );
	        
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
	    
	   test( "load controller and create a new instantiate of changeXpathCommand ", 11, function(){
	        
	        var controller,
	            addElementCommand,	            
	            parent,
	            guid,
	            changeXpathCommand;
	        
	        controller = new bizagi.editor.base.controller();	        
	        
	        addElementCommand = new bizagi.editor.addElementCommand( { arguments: {displayName : "demoDisplayName",  name: "label", type: "render", renderType: "label", xpath : "demo.label"}, controller: controller, model: controller.getRenderModel()}); 
	        addElementCommand.execute();	   
	        	        	        
	        strictEqual( controller.getRenderModel().form.elements.length, 1, "form has an element" );	       
	        strictEqual( controller.getRenderModel().form.elements[0].render.properties.xpath, "demo.label", "xpath added is demo.label" );

	        // store orginal guid for check when undo
	        guid = addElementCommand.properties.guid;

	        parent = controller.getRenderModel().form.properties.guid;
	        	        	        
	        changeXpathCommand =  new bizagi.editor.changeXpathCommand( { arguments: {position: 0, parent: parent, renderGuid : guid,  data: {  guid: guid, name: "text", xpath : "demo.text" } }, controller: controller, model: controller.getRenderModel()} );       
	        changeXpathCommand.execute();
	        
	        strictEqual( controller.getRenderModel().form.elements.length, 1, "there are an element in the model" );	        
	        strictEqual( controller.getRenderModel().form.elements[0].render.properties.xpath, "demo.text", "xpath changed from demo.label to demo.text" );
	        strictEqual( controller.getRenderModel().form.elements[0].render.properties.displayName, "text", "property displayName changed from demoDisplayName to text" );
	        	       	        	        
	        changeXpathCommand.undo();
	        
	        strictEqual( controller.getRenderModel().form.elements.length, 1, "undo: form has an element" );	        
	        strictEqual( controller.getRenderModel().form.elements[0].render.properties.xpath, "demo.label", "undo: xpath added is demo.label" );
	        // Peform this cje¡heck for enforce the undo command executed
	        strictEqual( controller.getRenderModel().form.elements[0].render.properties.guid, guid, "undo: property guid is reset" );

	        changeXpathCommand.execute();
	        
	        strictEqual( controller.getRenderModel().form.elements.length, 1, "there are an element in the model" );	        
	        strictEqual( controller.getRenderModel().form.elements[0].render.properties.xpath, "demo.text", "xpath changed from demo.label to demo.text" );
	        strictEqual( controller.getRenderModel().form.elements[0].render.properties.displayName, "text", "property displayName changed from demoDisplayName to text" );
		});
		
		
	});

