
	/*
	@title: Demo of how test can be implemented
	@authors: RhonyP, ManuelMG, DavidM
	@date: 25-feb-12
	@description: This is a demo for define how can be the test structure in JS using QUnit 
	*/
	/// required because when bizagi is loaded also is loaded required libraries (jquery...)
	bizagi.loader.then( function() {
		/// This is the name of the set of tests. Should be the name of the class to test?
		module("First Test");

		/// a specific test, this can have many assertions in it, 
		/// first parameter is the descriptive name of the requirement 
		test("check", function() {
			/// why use !! if this get the same result without that?
			ok(!!bizagi.rendering.render, "bizagi loaded");
			ok(!!$.ajax, "Jquery loaded");
		});


		test("load stub file base" , function(){
			// Ajax load
			expect(1);
			/// stop current execution thread dont forget start at the end
			stop();
			/// Load file
			$.ajax({
				url : "jquery/editor/base/mocks/stub.renders.json.txt",
				dataType : "text"
			/// option 1 use then with callback for done and fail
			}).then(function() {
				//console.debug("THEN DONE");
			}, function() {
				//console.debug("THEN FAIL");
			/// Option two use done and fail directly, this is better!
			}).done(function(json) {
				ok(true, "DONE Loaded stub.renders.json.txt");
				start();
			}).fail(function() {
				start();
			});
			
			/// Required if the ajax doesn't load the file.
			/// set to 1000ms for avoid false negatives, the load take about 20ms  
			setTimeout(function() {
				start();
			}, 1000);
		});


		/// A more realistic test
		test("load stub file base" , function(){
			// Ajax load
			/// Expected assertions in the test
			expect(3);
			stop();
			$.ajax({
				url : "jquery/editor/base/mocks/stub.renders.json.txt",
				dataType : "text"
			}).done(function(json) {
				ok(!!json, "File loaded successfuly");
				json = JSON.parse(json);
				start();
				ok(json.renders !== undefined, "renders exists");

				ok(json.renders.length == 29, "renders' length is 29");
			});
			setTimeout(function() {
				start();
			}, 1000);
		});


	});
