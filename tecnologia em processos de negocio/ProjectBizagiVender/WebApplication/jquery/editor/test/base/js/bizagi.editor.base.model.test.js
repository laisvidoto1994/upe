
	/*
	@title: Test main model
	@authors: Alexander Mejia
	@date: 28-feb-12
	@description: This unit test will prove, the main model	
	*/
	
	bizagi.loader.then( function() {
	    
	    module("main_model_test");
	    
	    test("main model test", function(){	        
	        	        
	        var model = new bizagi.editor.model({modelRenders: "Model Renders", modelControls: "Model Controls", modelXpathNavigator : "Model Xpath Navigator"});
	        ok(!!model["subscribe"], "model contain subscribe function");
			ok(!!model["publish"], "model contain publish function");
			ok(!!model.models["modelRenders"], "model contain modelRenders property");
			ok(!!model.models["modelControls"], "model contain modelControls property");
			ok(!!model.models["modelXpathNavigator"], "model contain modelXpathNavigator property");
									
																						    
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
				ok(!!json, "controls loaded successfuly");
				var controls = JSON.parse(json);
				
				$.ajax({
				    url : "jquery/editor/base/mocks/stub.dataform.json.txt",
				    dataType : "text"
			    }).done(function(json) {
			        ok(!!json, "renders loaded successfuly");
			        var renders = JSON.parse(json);
				    $.ajax({
				        url : "jquery/editor/component/xpathnavigator/mocks/stub.xpathnavigator.firstload.json.txt",
				        dataType : "text"
			        }).done(function(jsonXpath) {
    			        ok(!!jsonXpath, "Xpath nodes loaded successfuly");
    			        var xpathNodes = JSON.parse(jsonXpath);
			            start();
			        var model = new bizagi.editor.model({ modelRenders : new bizagi.editor.base.container(renders, true),
			                                                 modelControls : new bizagi.editor.controls(controls),
			                                                 modelXpathNavigator : new bizagi.editor.component.xpathnavigator.model(xpathNodes)  });
			            var label = model.models["modelControls"].findControl("label");
			            strictEqual(label.name, "label", "the control label is loaded");
			            strictEqual(model.models["modelMiniToolbar"].minitoolbar.groups.length, 4, "the minitoolbar is composed of 4 groups");
			            strictEqual(model.models["modelXpathNavigator"].nodes[0].nodes.length, 3, "the xpath navigator client is composed of 3 items");
			        });																									
		        });																									
				
			});
			
			setTimeout(function() {
				start();
			}, 2000);
		});
	    
	
	    
	    
	    
	        	    	    
	});
	

