
/*
	@title: Test command InsertElement
	@authors: Alexander Mejia
	@date: 07-mar-12
	@description: This unit test will prove, the command insertElement
	*/
	
	bizagi.loader.then( function() {
	    
	    module("InsertElement test");
	    

	    test("insert Element Command", function(){	        
	        var params = {arguments: {data: "123"}, controller : {}, model: {}};
	        var command = new bizagi.editor.insertElementCommand(params);
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
	    
	     test("load controller and create a new instantiate of insertElementCommand " , function(){
	        
	        var controller = new bizagi.editor.base.controller();
	        //controller.model = model;
	        
	        var command = new bizagi.editor.addElementCommand({arguments: {name: "label", type: "render"}, controller: controller, model: controller.getRenderModel()}); 
	        command.execute();	   
	        
	        var element = {
	            properties: {
	                displayName: "text",
	                type: "text"
	            }
	        }
	        
	        var parent = controller.getRenderModel().form.properties.guid;
	        var render = new bizagi.editor.base.render(element);
	        
	        
	        var insertElementCommand =  new bizagi.editor.insertElementCommand({arguments: {position: 0, parent: parent, element: render}, controller: controller, model: controller.getRenderModel()});       
	        insertElementCommand.execute();
	        
	        strictEqual(controller.getRenderModel().form.elements[0].render.properties.displayName, "text", "render text inserted in first position");
	        strictEqual(controller.getRenderModel().form.elements.length, 2, "there are two elements in the model");
	        
	        insertElementCommand.undo();
	        
	        strictEqual(controller.getRenderModel().form.elements[0].render.properties.type, "label", "undo: render label is in first position again");
	        strictEqual(controller.getRenderModel().form.elements.length, 1, "undo: there are an element in the model");
	        
	        insertElementCommand.execute();
	        
	        strictEqual(controller.getRenderModel().form.elements[0].render.properties.displayName, "text", "render text inserted in first position");
	        strictEqual(controller.getRenderModel().form.elements.length, 2, "there are two elements in the model");
	        	        	             	        			
		});	 	    
	});

