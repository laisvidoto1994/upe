

	/*
	@title: Test controls class
	@authors: Alexander Mejia
	@date: 29-feb-12
	@description: This unit test will prove, the controls class (toolbar)	
	*/
	
	bizagi.loader.then( function() {
	    
	    module("controls class test");
	    
	    test("controls class", function(){	        
	        
	        var controls = new bizagi.editor.controls();
	        ok(!!controls["subscribe"], "controls contain subscribe function");
			ok(!!controls["publish"], "controls contain publish function");
			ok(!!controls["processData"], "controls contain processData function");			
			ok(!!controls["findControl"], "controls contain findControl function");
			strictEqual(controls.findControl.length, 1, "findControl receive a parameter");			
			strictEqual(controls.processData.length, 1, "processData receive a parameter");
			strictEqual(controls.controls.length, 0, "controls contain controls array");						
							    
	    });	
	    		    	    
	    test("throw exeption call findControl without parameters", function(){
	        raises(function(){
			     var controls = new bizagi.editor.controls();
			     controls.findControl();	             
			}, "must throw error to pass, call findControl without parameters");	
	    });
	    
	    test("throw exeption call findControl without controls loaded", function(){
	        raises(function(){
			     var controls = new bizagi.editor.controls();
			     controls.findControl('text');	             
			}, "must throw error to pass, call findControl without controls");	
	    });
	    
	    test("load controls test" , function(){
			// Ajax load
			/// Expected assertions in the test
			expect(6);
			stop();
			$.ajax({
				url : "jquery/editor/base/mocks/stub.renders.json.txt",
				dataType : "text"
			}).done(function(json) {
				ok(!!json, "File loaded successfuly");
				var data = JSON.parse(json);
				console.debug(data);
				start();
				
				ok(!!data.renders, "stub (renders) has controls");
				var controls = new bizagi.editor.controls(data);
				ok((controls.controls.length > 0), "there are elements in controls array");				
				strictEqual(controls.controls[0].render.name, "form", "the control form is loaded");
				strictEqual(controls.controls[1].render.name, "label", "the control label is loaded");
				
				var label = controls.findControl("label");
				strictEqual(label.name, "label", "the control label is loaded");
				console.log("METADATA CONTROL LABEL");
				console.log(label);
				
				/*
				ok(data.form.elements.length == 15, "elements in the form 15");
				
				var container = new bizagi.editor.base.container(data, true);
				console.log("modelo de la forma");
				console.log(container);
				strictEqual(container.form.elements.length, 15, "El actual modelo contiene 15  elementos");
				strictEqual(container.form.elements[0].render.properties.id, 10000, "El Id del primer render es 10000");
				ok(!!container.form["properties"], "model contain properties property");
				ok(!!container.form.properties["id"], "model contain properties.id");
				*/				
				
			});
			
			setTimeout(function() {
				start();
			}, 1000);
		});
	    
	    	    	    	     	    	    
	});
	
