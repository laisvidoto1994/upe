
/*
	@title: Test command Remove Element
	@authors: Alexander Mejia
	@date: 07-mar-12
	@description: This unit test will prove, the command removeElementCommand
	*/
	
	bizagi.loader.then( function() {
	    
	    module("RemoveElement test");
	    

	    test("remove Element Command", function(){	        
	        var params = {arguments: {data: "123"}, controller : {}, model: {}};
	        var command = new bizagi.editor.removeElementCommand(params);
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
	    
	    test("load controller and create a new instantiate of removeElemenCommand " , function(){
	        
	        var controller = new bizagi.editor.base.controller();
	        //controller.model = model;
	        
	        var command = new bizagi.editor.addElementCommand({arguments: {name: "label", type: "render"}, controller: controller, model: controller.getRenderModel()}); 
	        command.execute();
	        strictEqual(controller.getRenderModel().form.elements.length, 1, "there are an element in the model");
	        var parent = controller.getRenderModel().form.properties.guid;
	        
	        var removeElementCommand = new bizagi.editor.removeElementCommand({arguments: {position: 0, parent: parent}, controller: controller, model: controller.getRenderModel()});	       	        
	        removeElementCommand.execute();
	        strictEqual(controller.getRenderModel().form.elements.length, 0, "there aren't elements in the model");	
			
		});	
	});

