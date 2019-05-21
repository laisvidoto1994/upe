

	/*
	@title: Test model Controls Navigator
	@authors: Alexander Mejia
	@date: 28-feb-12
	@description: This unit test will prove, the model for Controls Navigator	
	*/
	
	bizagi.loader.then( function() {
	    
	    module("model Controls Navigator test");
	    
	    test("model Controls Navigator", 7, function(){	        
	    	        
	        var model = new bizagi.editor.component.controlsnavigator.model();
	        ok(!!model["subscribe"], "model contain subscribe function");
			ok(!!model["publish"], "model contain publish function");
			ok(!!model["processData"], "model contain processData function");
			ok(!!model["findGroup"], "model contain findGroup function");
			strictEqual(model.processData.length, 1, "the processData function receive a parameter");
			strictEqual(model.findGroup.length, 1, "the findGroup function receive a parameter");
			strictEqual(model.groups.length, 0, "model contain groups array");
																			    
	    });
	    
	    test("Intantiate Controls Navigator class with data" , function(){
			// Ajax load
			/// Expected assertions in the test
			expect(2);
			stop();
			$.ajax({
				url : "jquery/editor/base/mocks/stub.renders.json.txt",
				dataType : "text"
			}).done(function(json) {
				ok(!!json, "File loaded successfuly");
				var data = JSON.parse(json);
				console.debug(data);
				
				
				var controls = new bizagi.editor.controls(data)				
				var model = new bizagi.editor.component.controlsnavigator.model(controls);
				strictEqual(model.groups.length, 4, "the groups was created");
                                
                                start();
				
				
				/*
				ok(!!data.renders, "stub (renders) has controls");
				var controls = new bizagi.editor.controls(data);
				ok((controls.controls.length > 0), "there are elements in controls array");				
				strictEqual(controls.controls[0].render.name, "form", "the control form is loaded");
				strictEqual(controls.controls[1].render.name, "label", "the control label is loaded");
				
				var label = controls.findControl("label");
				strictEqual(label.name, "label", "the control label is loaded");
				console.log("METADATA CONTROL LABEL");
				console.log(label);
				*/
													
			});
			
			setTimeout(function() {
				start();
			}, 1000);
		});	
	    	    
	    
	});