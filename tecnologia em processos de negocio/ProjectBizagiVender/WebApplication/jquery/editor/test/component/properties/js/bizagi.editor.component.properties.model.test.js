


	/*
	@title: Test model editor properties
	@authors: Alexander Mejia
	@date: 12-mar-12
	@description: This unit test will prove, the model for editor properties
	*/
	
	bizagi.loader.then( function() {
	    
	    module("model editor properties test");
	    
	    test("model editor properties", function(){	        
	    	        
	        var editorProperties = new bizagi.editor.component.properties.model();
	        ok(!!editorProperties["subscribe"], "editorProperties contain subscribe function");
			ok(!!editorProperties["publish"], "editorProperties contain publish function");						
																			    
	    });
	    
	    
	    test("Intantiate miniToolbas class with data" , function(){
			// Ajax load
			/// Expected assertions in the test
			expect(7);
			stop();
			$.ajax({
				url : "jquery/editor/base/mocks/stub.renders.json.txt",
				dataType : "text"
			}).done(function(json) {
				ok(!!json, "File loaded successfuly");
				var controls = JSON.parse(json);				
				start();
				
				var model = new bizagi.editor.model({ modelRenders : new bizagi.editor.base.container({}, true),
			                                                      modelControls : new bizagi.editor.controls(controls)});
			                                                      
			   ok(!!model.models["modelRenders"], "Model renders loaded...");                                                 
				
				  var element = {
                    properties: {                                
                        displayName: "label",                
                        type: "label"                 
                    }
                };                                
				
				model.models["modelRenders"].addElement(new bizagi.editor.base.render(element));				
				strictEqual(model.models["modelRenders"].form.elements.length, 1, "there are 1 element renderized");								
				var control = model.models["modelControls"].findControl(element.properties.type);				
				strictEqual(control.type, "render", "the selected element is a render");				
				var properties = model.models["modelRenders"].form.elements[0].render.properties;				
				var editorProperties = new bizagi.editor.component.properties.model({position: 10, definitionRender: control, propertiesRender: properties});
				ok(!!editorProperties["render"].position, "editorProperties render contain position property");					
				ok(!!editorProperties["render"], "editorProperties contain render object");	
				ok(!!editorProperties["propertiesRender"], "editorProperties contain propertiesRender object");				
				
					
				
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