
	/*
	@title: Test model form
	@authors: Alexander Mejia
	@date: 27-feb-12
	@description: This is the unit test for define the structure of model the rendering
	*/
	
	bizagi.loader.then( function() {
	
		module("model rendering test");
		
		test("The observable class is the parent class", function(){
			var observableClass = new bizagi.editor.observableClass();
			ok(!!observableClass["subscribe"], "observableClass contain subscribe function");
			ok(!!observableClass["publish"], "observableClass contain publish function");			
		});
		
		test("The element class", 3, function(){
			var element = new bizagi.editor.base.element();
			ok(!!element["subscribe"], "element contain subscribe function");
			ok(!!element["publish"], "element contain publish function");
			ok(!!element["properties"], "element contain properties property");
			
		});
		
		test("The render class", 4, function(){
			var render = new bizagi.editor.base.render();
			ok(!!render["subscribe"], "render contain subscribe function");
			ok(!!render["publish"], "render contain publish function");
			ok(!!render["render"], "render contain render object");
			ok(!!render.render.properties, "render contain render.properties object");					
		});
		
		test("The container class", 6, function(){
			var container = new bizagi.editor.base.container();
			ok(!!container["subscribe"], "container contain subscribe function");
			ok(!!container["publish"], "container contain publish function");
			ok(!!container["container"], "container contain container object");
			ok(!!container.container.properties, "container contain container.properties object");
			ok(!!container.container.elements, "container contain container.elements[] array");
			strictEqual(container.container.elements.length, 0, "El actual modelo no contiene elementos(renders)");
		});
				
		test("load stub file form data" , function(){
			// Ajax load
			/// Expected assertions in the test
			expect(7);
			stop();
			$.ajax({
				url : "jquery/editor/base/mocks/stub.dataform.json.txt",
				dataType : "text"
			}).done(function(json) {
				ok(!!json, "File loaded successfuly");
				var data = JSON.parse(json);
				console.debug(data);
				start();
				ok(!!data.form, "form exists");
				ok(data.form.elements.length == 15, "elements in the form 15");
				
				var container = new bizagi.editor.base.container(data, true);
				console.log("modelo de la forma");
				console.log(container);
				strictEqual(container.form.elements.length, 15, "El actual modelo contiene 15  elementos");
				strictEqual(container.form.elements[0].render.properties.id, 10000, "El Id del primer render es 10000");
				ok(!!container.form["properties"], "model contain properties property");
				ok(!!container.form.properties["id"], "model contain properties.id");
				
				
			});
			
			setTimeout(function() {
				start();
			}, 1000);
		});
		
		test("instance of model render, without data", function(){
			
			console.log("Instantiation of empty model");
			var container = new bizagi.editor.base.container({}, true);
			
			console.log(container);
			ok(!!container.form["elements"], "model contain elements array");
			ok(!!container.form["properties"], "model contain properties property");
			strictEqual(container.form.elements.length, 0, "the current model, does not contain elements");
						
		});
		
		test("check the funtion addElement", function(){
			var model = new bizagi.editor.base.container({}, true);
			ok(!!model["addElement"], "the model contain the function addElement");
			strictEqual(model.addElement.length,1, "The function addElement has one parameter");
		
		});
		
		test("check the functionality of addElement with empty form", function(){
			var model = new bizagi.editor.base.container({}, true);
			var render = new bizagi.editor.base.render();
			model.addElement(render);
			strictEqual(model.form.elements.length, 1, "The form contain to one element");			
		});
		
		
		test("check the functionality of addElement with data in form", function(){
			// Ajax load			
			expect(1);
			stop();
			$.ajax({
				url : "jquery/editor/base/mocks/stub.dataform.json.txt",
				dataType : "text"
			}).done(function(json) {				
				var data = JSON.parse(json);				
				start();								
				
				var model = new bizagi.editor.base.container(data, true);				
				var render = new bizagi.editor.base.render();
				model.addElement(render);
				strictEqual(model.form.elements.length, 16, "The form contain 16 elements");
				console.log("ADD ONE ELEMEN TO FORM");
				console.log(model);	
			});	

			setTimeout(function() {
				start();
			}, 1000);			
		});
		
	})
	