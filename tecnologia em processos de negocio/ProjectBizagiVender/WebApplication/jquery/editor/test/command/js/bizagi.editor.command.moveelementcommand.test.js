/*
	@title: Test command MoveElement
	@authors: David Montoya
	@date: 01-mar-12
	@description: This unit test will prove, the command MoveElement
	*/
	
	bizagi.loader.then( function() {
	    
	    module("Move_Element_Command_test");
	    

	    test("move_Element_Command", function(){
	    	        
	        var params,
	            command;
	        
	        params = { arguments: { data: "123" }, controller : {}, model: {} };
	        var command = new bizagi.editor.moveElementCommand(params);
	        
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
	    
	    test( "Move_Element_Command", function(){	        
		   
		   expect(5);
	    	stop();
	    	$.ajax({
				url : "jquery/editor/base/mocks/stub.dataform.json.txt",
				dataType : "text"
	    	}).done( function( json ){
				ok( !!json, "renders loaded successfuly" );
				var renders = JSON.parse( json );
		        var model = new bizagi.editor.model( { modelRenders : new bizagi.editor.base.container( renders, true ), modelControls : "new bizagi.editor.controls(controls)" } );
				ok(!!model, "model created successfuly");
				start();

				var command = new bizagi.editor.moveElementCommand({arguments : {posIni : 0, posEnd : 1, parent: model.models["modelRenders"].form.properties.guid },  controller: "controller", model: model.models["modelRenders"]}); 
		        command.execute();
			    
			    strictEqual(model.models["modelRenders"].form.elements[1].render.properties.id, 10000, "the control in position 0 with id 10000 is moved to the position 1");
			    
			    command.undo();
			    strictEqual(model.models["modelRenders"].form.elements[0].render.properties.id, 10000, "the control in position 1 with id 10000 is moved to the position 0");
			    
			    command.execute();
			    strictEqual(model.models["modelRenders"].form.elements[1].render.properties.id, 10000, "the control in position 0 with id 10000 is moved to the position 1");
		        
	        });
			
			setTimeout(function() {
				start();
			}, 2000);

		});	
	    	    	    
	});
