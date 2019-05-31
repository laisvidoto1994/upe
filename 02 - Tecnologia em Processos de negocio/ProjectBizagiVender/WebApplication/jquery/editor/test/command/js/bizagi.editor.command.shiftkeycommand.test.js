
/*
	@title: Test command shiftKey
	@authors: Alexander Mejia
	@date: 211-Apr-12
	@description: This unit test will prove, the command shiftKey
	*/
	
	bizagi.loader.then( function() {
	    
	    module( "shiftKey test" );
	    
	    test("shift key Command", function(){	        
	        
	        var params,
	            command;
	        
	        params = { arguments: { data: "123" }, controller : {}, model: {} };
	        command = new bizagi.editor.shiftKeyCommand(params);
	        
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
	    	    
	    test( "load controller and create a new instantiate of shiftKeyCommand. DIFERENTS ID'S " , function(){
	        
	        var controller,
                command1,
                command2,
                command3,
                command4,
                command5,
                commandshiftKeyCommand,
                parentGroup,
                label,
                text,
                render1,
                render2,
                idElement,
                idElement1,
                idElement2;
	        
	        controller = new bizagi.editor.base.controller();	       	        
	        
	        command1 = new bizagi.editor.addElementCommand( { arguments: { name: "label", type: "render" }, controller: controller, model: controller.getRenderModel() } ); 	        
	        command1.execute();
	        	                      
	        command2 = new bizagi.editor.addElementCommand( { arguments: { name: "text", type: "render" }, controller: controller, model: controller.getRenderModel() } ); 	        
	        command2.execute();
	        
	        idElement = command2.model.form.elements[1].render.properties.guid;
	        
	        command3 = new bizagi.editor.addElementCommand( { arguments: { name: "group", type: "container" }, controller: controller, model: controller.getRenderModel() } ); 	        
	        command3.execute();
            
            parentGroup = command3.model.form.elements[2].container.properties.guid;
	        
	         label = {
                 properties: {                                
                     displayName: "label",                
                     type: "label"
                 }
             };
              
             text = {
                properties: {                                
                    displayName: "text",                
                    type: "text"
                }
             };
             	         
	        render1 = new bizagi.editor.base.render( label ); 
	        idElement1 = render1.render.properties.guid;
	        
	        render2 = new bizagi.editor.base.render( text ); 
	        idElement2 = render2.render.properties.guid;
	        
	        command4 = new bizagi.editor.insertElementCommand( { arguments: { position: 0, parent: parentGroup, element: render1}, controller: controller, model: controller.getRenderModel()});       
	        command4.execute();	                      	                      
	        	                      
            command5 = new bizagi.editor.insertElementCommand( { arguments: { position: 1, parent: parentGroup, element: render2}, controller: controller, model: controller.getRenderModel()});       
	        command5.execute();
	        	        	        
	        commandshiftKeyCommand = new bizagi.editor.shiftKeyCommand( { arguments: { idFirstShift: idElement, idLaterShift: idElement1 }, controller: controller, model: controller.getRenderModel() } ); 	        
	        commandshiftKeyCommand.execute();
	        
	        ok( !( !!commandshiftKeyCommand.model.form.elements[0].render.properties.shiftKey ), "element[0] in the model isn't shiftkey" ); 
	        ok( commandshiftKeyCommand.model.form.elements[1].render.properties.shiftKey , "element[1] in the model is shiftkey" ); 
	        ok( commandshiftKeyCommand.model.form.elements[2].container.elements[0].render.properties.shiftKey , "first render in group element[2] in the model is shiftkey" ); 
	        ok( !( !!commandshiftKeyCommand.model.form.elements[2].container.elements[1].render.properties.shiftKey ) , "second render in group element[2] in the model isn't shiftkey" ); 	        	        
			
		});
		
		test( "load controller and create a new instantiate of shiftKeyCommand. SECOND ID (UNDEFINED) " , function(){
	        
	        var controller,
                command1,
                command2,
                command3,
                command4,
                command5,
                commandshiftKeyCommand,
                parentGroup,
                label,
                text,
                render1,
                render2,
                idElement,
                idElement1,
                idElement2;
	        
	        controller = new bizagi.editor.base.controller();	       	        
	        
	        command1 = new bizagi.editor.addElementCommand( { arguments: { name: "label", type: "render" }, controller: controller, model: controller.getRenderModel() } ); 	        
	        command1.execute();
	        	                      
	        command2 = new bizagi.editor.addElementCommand( { arguments: { name: "text", type: "render" }, controller: controller, model: controller.getRenderModel() } ); 	        
	        command2.execute();
	        
	        idElement = command2.model.form.elements[1].render.properties.guid;
	        
	        command3 = new bizagi.editor.addElementCommand( { arguments: { name: "group", type: "container" }, controller: controller, model: controller.getRenderModel() } ); 	        
	        command3.execute();
            
            parentGroup = command3.model.form.elements[2].container.properties.guid;
	        
	         label = {
                 properties: {                                
                     displayName: "label",                
                     type: "label"
                 }
             };
              
             text = {
                properties: {                                
                    displayName: "text",                
                    type: "text"
                }
             };
             	         
	        render1 = new bizagi.editor.base.render( label ); 
	        idElement1 = render1.render.properties.guid;
	        
	        render2 = new bizagi.editor.base.render( text ); 
	        idElement2 = render2.render.properties.guid;
	        
	        command4 = new bizagi.editor.insertElementCommand( { arguments: { position: 0, parent: parentGroup, element: render1}, controller: controller, model: controller.getRenderModel()});       
	        command4.execute();	                      	                      
	        	                      
            command5 = new bizagi.editor.insertElementCommand( { arguments: { position: 1, parent: parentGroup, element: render2}, controller: controller, model: controller.getRenderModel()});       
	        command5.execute();
	        	        	        
	        commandshiftKeyCommand = new bizagi.editor.shiftKeyCommand( { arguments: { idFirstShift: idElement }, controller: controller, model: controller.getRenderModel() } ); 	        
	        commandshiftKeyCommand.execute();
	        
	        ok( !( !!commandshiftKeyCommand.model.form.elements[0].render.properties.shiftKey ), "element[0] in the model isn't shiftkey" ); 
	        ok( !( !!commandshiftKeyCommand.model.form.elements[1].render.properties.shiftKey ) , "element[1] in the model isn't shiftkey" ); 
	        ok( !( !!commandshiftKeyCommand.model.form.elements[2].container.elements[0].render.properties.shiftKey ) , "first render in group element[2] in the model isn'tshiftkey" ); 
	        ok( !( !!commandshiftKeyCommand.model.form.elements[2].container.elements[1].render.properties.shiftKey ) , "second render in group element[2] in the model isn't shiftkey" ); 	        	        
			
		});
		
		test( "load controller and create a new instantiate of shiftKeyCommand. EQUALS ID'S " , function(){
	        
	        var controller,
                command1,
                command2,
                command3,
                command4,
                command5,
                commandshiftKeyCommand,
                parentGroup,
                label,
                text,
                render1,
                render2,
                idElement,
                idElement1,
                idElement2;
	        
	        controller = new bizagi.editor.base.controller();	       	        
	        
	        command1 = new bizagi.editor.addElementCommand( { arguments: { name: "label", type: "render" }, controller: controller, model: controller.getRenderModel() } ); 	        
	        command1.execute();
	        	                      
	        command2 = new bizagi.editor.addElementCommand( { arguments: { name: "text", type: "render" }, controller: controller, model: controller.getRenderModel() } ); 	        
	        command2.execute();
	        
	        idElement = command2.model.form.elements[1].render.properties.guid;
	        
	        command3 = new bizagi.editor.addElementCommand( { arguments: { name: "group", type: "container" }, controller: controller, model: controller.getRenderModel() } ); 	        
	        command3.execute();
            
            parentGroup = command3.model.form.elements[2].container.properties.guid;
	        
	         label = {
                 properties: {                                
                     displayName: "label",                
                     type: "label"
                 }
             };
              
             text = {
                properties: {                                
                    displayName: "text",                
                    type: "text"
                }
             };
             	         
	        render1 = new bizagi.editor.base.render( label ); 
	        idElement1 = render1.render.properties.guid;
	        
	        render2 = new bizagi.editor.base.render( text ); 
	        idElement2 = render2.render.properties.guid;
	        
	        command4 = new bizagi.editor.insertElementCommand( { arguments: { position: 0, parent: parentGroup, element: render1}, controller: controller, model: controller.getRenderModel()});       
	        command4.execute();	                      	                      
	        	                      
            command5 = new bizagi.editor.insertElementCommand( { arguments: { position: 1, parent: parentGroup, element: render2}, controller: controller, model: controller.getRenderModel()});       
	        command5.execute();
	        	        	        
	        commandshiftKeyCommand = new bizagi.editor.shiftKeyCommand( { arguments: { idFirstShift: idElement, idLaterShift: idElement }, controller: controller, model: controller.getRenderModel() } ); 	        
	        commandshiftKeyCommand.execute();
	        
	        ok( !( !!commandshiftKeyCommand.model.form.elements[0].render.properties.shiftKey ), "element[0] in the model isn't shiftkey" ); 
	        ok( commandshiftKeyCommand.model.form.elements[1].render.properties.shiftKey , "element[1] in the model is shiftkey" ); 
	        ok( !( !!commandshiftKeyCommand.model.form.elements[2].container.elements[0].render.properties.shiftKey ) , "first render in group element[2] in the model isn't shiftkey" ); 
	        ok( !( !!commandshiftKeyCommand.model.form.elements[2].container.elements[1].render.properties.shiftKey ) , "second render in group element[2] in the model isn't shiftkey" ); 	        	        
			
		});
			
	    	    	    
	});
