/*
 * Author : David Montoya
 * Date   : 14mar12 
 * Comments:
 *     Define basic test for the model of the xpath component
 *
 */
 
bizagi.loader.then( function() {

	module("Xpath_navigator_component_model");

	test("Xpath_navigator_component_model", 9, function() {
		var params, 
			model;


	    params = { arguments: { data: "123" }, controller : {}, model: {} };
		model = new bizagi.editor.component.xpathnavigator.model(params);

		ok(!!model, "Model creation");
	    ok(!!model["subscribe"], "Model contain subscribe function");
		ok(!!model["publish"], "Model contain publish function");						
		ok(!!model["processData"], "Model contain processData function");		
		strictEqual(model.processData.length, 1, "the processData function receive a parameter");
		ok(!!model["update"], "Model contain update function");
		strictEqual(model.update.length, 2, "the update function receive two parameters");
		ok(!!model["getChilds"], "Model contain getChilds function");
		strictEqual(model.getChilds.length, 1, "the getChilds function receive a parameter");
		
	});

	test("Instantiate__update_getChilds_in_xpath_navigator_model" , 16,  function(){
			var firstLoadData,
				expandData,
				model,
				childsForm,
				json,
				jsonExpand;
			stop();

			json = bizagi.editor.base.HostFacade.getXpathNavigatorFirstLoad();
			ok(!!json, "Stub xpath first load loaded successfuly");
			
			firstLoadData = JSON.parse(json);
			
			jsonExpand = bizagi.editor.base.HostFacade.getXpathNavigatorExpandLoad(undefined);
			
			ok(!!jsonExpand, "Stub xpath for expand loaded successfuly");
			
			expandData = JSON.parse(jsonExpand);
			/*console.debug("firstLoadData stub: ");
			console.debug(firstLoadData);
			console.debug("expandData stub: ");
			console.debug(expandData);*/
			start();
			
			model = new bizagi.editor.component.xpathnavigator.model(firstLoadData);
			/*console.debug("Model first load: ");
			console.debug(model);*/

			ok(!!model.nodes[0], "Model created successfuly");
			strictEqual(model.nodes[0].nodes[0].displayName, "cliente", "node 1 of application has displayName cliente");

			strictEqual(model.update(expandData, model.nodes[0].nodes[0].id), true, "Added child nodes to node cliente");
			console.debug("Model update: ");
			console.debug(model);

			strictEqual(model.nodes[0].nodes[0].nodes[7].displayName, "Moneda", "node 8 of cliente displayName is Moneda");
			strictEqual(model.nodes[0].nodes[0].nodes[7].canHasChildren, "false", "node 8 of cliente take default value, cannot Has Children");
			strictEqual(model.nodes[0].nodes[0].nodes[7].isScopeAttribute, "false", "node 8 of cliente take default value, is not a Scope Attirbute");
			strictEqual(model.nodes[0].nodes[0].nodes[7].dragabbleClass, "ui-bizagi-draggable-item", "node 8 have dragabbleClass");
			strictEqual(model.nodes[0].nodes[0].nodes[7].guidRelatedEntity, "dedda132-b62a-4199-ba52-7b5edcb2e70b", "node 8 of cliente has guidRelatedEntity");
			strictEqual(model.nodes[0].nodes[0].nodes[12].displayName, "Formas", "node 13 of cliente has displayName Formas");
			strictEqual(model.nodes[0].nodes[0].nodes[12].nodes.length, 1, "node 13 of cliente has only one child node");
			strictEqual(model.nodes[0].nodes[0].nodes[12].isDragabble, "false", "node 13 of cliente not is Dragabble");
			strictEqual(model.nodes[0].nodes[0].nodes[12].dragabbleClass, undefined, "node 13 dont have dragabbleClass");
			strictEqual(model.nodes[0].nodes[0].nodes[12].guidRelatedEntity, undefined, "node 13 of cliente DON'T has guidRelatedEntity");

			childsForm = model.getChilds(model.nodes[0].nodes[0].nodes[12].id);
			console.debug("Model childs of node formas: ");
			console.debug(childsForm);

			strictEqual(model.nodes[0].nodes[0].nodes[12].nodes[0], childsForm[0], "getChilds obtain the nodes expected for node formas");

			
			setTimeout(function() {
				start();
			}, 1000);		
	});

})
 	