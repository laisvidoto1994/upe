

/*
@title: Test container (model for rendering)
@authors: Alexander Mejia
@date: 08-mar-12
@description: This unit test will prove, the model container			
*/

    bizagi.loader.then( function() {
        module( "class container(model render)" );
        
        test( "container class", function(){
        
            var container = new bizagi.editor.base.container( {}, true );
            
            ok( !!container["subscribe"], "container contain subscribe function" );
            ok( !!container["publish"], "container contain publish function" );            
            ok( !!container["getRenderingModel"], "container contain getRenderingModel function" );
            ok( !!container["getPersistenceModel"], "container contain getPersistenceModel function" ); 
            ok( !!container["setParent"], "container contain setParent function" );
            ok( !!container["getParent"], "container contain getParent function" );
            ok( !!container["getRenderingProperties"], "container contain getRenderingProperties function" );
            ok( !!container["getPropertiesModel"], "container contain getPropertiesModel function" );
            ok( !!container["filterDefaultValues"], "container contain filterDefaultValues function" );                                                            
            ok( !!container["addElement"], "container contain addElement function" );
            ok( !!container["removeLastElement"], "container contain removeLastElement function" );
            ok( !!container["getElement"], "container contain getElement function" );            
            ok( !!container["moveElement"], "container contain moveElement function" );
            ok( !!container["removeElement"], "container contain removeElement function" );
            ok( !!container["removeElementById"], "container contain removeElement function" );            
            ok( !!container["findElementByPosition"], "container contain findElementByPosition function" );
            ok( !!container["insertElement"], "container contain insertElement function" );
            ok( !!container["getElement"], "container contain getElement function" );
            ok( !!container["changeProperty"], "Container has method changeProperty" );                                                                                                                
            ok( !!container["updateElementByPosition"], "Container has method updateElementByPosition" );
            ok( !!container["findPositionOfElementInFormById"], "Container has method findPositionOfElementInFormById" );
            ok( !!container["shiftKeyOn"], "Container has method shiftKeyOn" );
            ok( !!container["shiftKeyOff"], "Container has method shiftKeyOff" );
                                    
        });
        
                      
        test( "addElement, removeLastElement function", function(){
        
            var container,
                model,
                definitions,
                element;
            
            
            definitions = bizagi.editor.base.HostFacade.getControlsMetadata();
            
            model = new bizagi.editor.model({ definitions: definitions });
            
            container = new bizagi.editor.base.container( {}, true );              
            strictEqual( container.form.elements.length, 0, "there are 0 elements in the form container" );	                                 
            strictEqual( container.addElement.length, 1, "addElement receive a parameter" );
            strictEqual( container.removeLastElement.length, 0, "removeLastElement receive 0 parameter" );
            
            element = {
                properties: {                                
                    displayName: "label",                
                    type: "label"
                }
            };                
                
            container.addElement( new bizagi.editor.base.render( element ) );
            
            strictEqual( container.form.elements.length, 1, "there are an elements in the form container" );
            
            container.removeLastElement();
            
            strictEqual( container.form.elements.length, 0, "there are 0 elements in the form container" );	                                               
        });
        
        /*
        test( "moveElement function", function(){
        
            var container,
                element,
                group,
                groupContainer,
                groupContainer2,
                parent,
                parentContainer;
            
            container = new bizagi.editor.base.container( {}, true );
            strictEqual( container.moveElement.length, 3, "moveElement receive 3 parameter" );
            
            element = {
                properties: {                                
                    displayName: "label",                
                    type: "label"
                }
            };
            
            group = {
                properties: {                                
                    displayName: "group",                
                    type: "group"
                }
            };              
            
            groupContainer = new bizagi.editor.base.container( group )
            groupContainer2 = new bizagi.editor.base.container( group )
            container.addElement( new bizagi.editor.base.render( element ) );
            container.addElement( groupContainer );
            
            strictEqual( container.form.elements.length, 2, "there are 2 elements in the form container" );
            ok( !!container.form.elements[0].render, "the first element in model is a render" );
            ok( !!container.form.elements[1].container, "the second element in model is a container" );
            
            parent = container.form.properties.guid;
            container.moveElement( 0, 1, parent );
            
            ok( !!container.form.elements[0].container, "the first element in model is a container after move" );
            ok( !!container.form.elements[1].render, "the second element in model is a render after move" );
            
            parentContainer = groupContainer.container.properties.guid;
            container.insertElement( 0, parentContainer, new bizagi.editor.base.render( element ) );
            container.insertElement( 1, parentContainer, groupContainer2 );
            
            strictEqual( groupContainer.container.elements.length, 2, "there are 2 elements in the group container" );
            strictEqual( container.form.elements.length, 2, "there are 2 elements in the form container" ); 
            ok( !!groupContainer.container.elements[0].render, "the first element in groupContainer is a render" );
            ok( !!groupContainer.container.elements[1].container, "the second element in groupContainer is a container" );                                   
            
        });
        
        test( "insertElement, removeElement function", function(){
        
            var container,
                parent,
                label,
                text,
                group,
                parentGroup;
            
            container = new bizagi.editor.base.container( {}, true );
            strictEqual( container.insertElement.length, 3, "insertElement receive 3 parameters" );
            strictEqual( container.removeElement.length, 2, "removeElement receive 2 parameters" );
            parent = container.form.properties.guid;
             
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
            
            group = {
                properties: {                                
                    displayName: "group",                
                    type: "group"
                }
            };
            
            container.insertElement( 0, parent, new bizagi.editor.base.render( label ) );
            strictEqual( container.form.elements.length, 1, "there are 1 elements in the form" );   
            ok( !!container.form.elements[0].render, "the first element in form is a render" );
            
            container.insertElement( 1, parent, new bizagi.editor.base.container( group ) );
            strictEqual( container.form.elements.length, 2, "there are 2 elements in the form" );   
            ok( !!container.form.elements[1].container, "the second element in form is a container" );
            
            parentGroup = container.form.elements[1].container.properties.guid;
            container.insertElement( 0, parentGroup, new bizagi.editor.base.render( text ) );
            strictEqual( container.form.elements.length, 2, "there are 2 elements in the form" );
            strictEqual( container.form.elements[1].container.elements.length, 1, "there are 1 elements in the groupContainer" );
            ok( !!container.form.elements[1].container.elements[0].render, "the first element in groupContainer is a render" ); 
            
            container.removeElement( 0, parentGroup ); 
            strictEqual( container.form.elements.length, 2, "there are 2 elements in the form" );
            strictEqual( container.form.elements[1].container.elements.length, 0, "there are 0 elements in the groupContainer" );
                                  
        }); 
        
        test( "getElement, changeProperty function", function(){
        
             var container,
                 parent,
                 label,
                 idLabel,
                 render;
             
             container = new bizagi.editor.base.container( {}, true );
             strictEqual( container.getElement.length, 1, "getElement receive 1 parameter" );
             strictEqual( container.changeProperty.length, 3, "changeProperty receive 3 parameters" );  
             parent = container.form.properties.guid;
             
             label = {
                properties: {                                
                    displayName: "label",                
                    type: "label"
                }
             };
             
             container.insertElement( 0, parent, new bizagi.editor.base.render( label ) );
             strictEqual( container.form.elements.length, 1, "there are 1 elements in the form" ); 
             
             idLabel = container.form.elements[0].render.properties.guid;
             
             render = container.getElement( idLabel );
             strictEqual( render.properties.guid, idLabel, "the render was found"  );
             strictEqual( render.properties.displayName, "label", "the render finded is a label" );
             
             container.changeProperty( idLabel, "displayName", "newLabel" ); 
             strictEqual( container.form.elements[0].render.properties.displayName, "newLabel", "the property was changed" );                        
                         
        });
                                                                           
        test( "findElementByPosition, removeElementById function", function(){
        
            var container,
                 parent,
                 label,
                 idLabel,
                 render;                 
             
             container = new bizagi.editor.base.container( {}, true );
             
             strictEqual( container.findElementByPosition.length, 2, "findElementByPosition receive 2 parameters" );
             strictEqual( container.removeElementById.length, 1, "removeElementById receive 1 parameter" ); 
              
             parent = container.form.properties.guid;
             
             label = {
                properties: {                                
                    displayName: "label",                
                    type: "label"
                }
             };
                                      
             container.insertElement( 0, parent, new bizagi.editor.base.render( label ) );
             
             strictEqual( container.form.elements.length, 1, "there are 1 elements in the form" ); 
             
             idLabel = container.form.elements[0].render.properties.guid;
             
             render = container.findElementByPosition( 0, parent );
             
             strictEqual( render.render.properties.guid, idLabel, "the render was found"  );
             strictEqual( render.render.properties.displayName, "label", "the render finded is a label" );
             
             container.removeElementById( idLabel ); 
             strictEqual( container.form.elements.length, 0, "there are 0 elements in the form container" );
        
        });
                                                          
        test("updateElementByPosition_function", 4, function(){
        
            var container,
                 parent,
                 label,
                 text,
                 idLabel,
                 idText,
                 render,
                 renderText;                 
             
             container = new bizagi.editor.base.container( {}, true );
             
              strictEqual( container.updateElementByPosition.length, 3, "updateElementById receive 3 parameters" );
              
             parent = container.form.properties.guid;
             
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
                                      
             container.insertElement( 0, parent, new bizagi.editor.base.render( label ) );
             
             strictEqual( container.form.elements.length, 1, "there are 1 elements in the form" ); 
             

             idLabel = container.form.elements[0].render.properties.guid;
             renderText = new bizagi.editor.base.render( text )
             idText = renderText.render.properties.guid;
             container.updateElementByPosition( 0, parent, renderText );
             
             render = container.findElementByPosition( 0, parent );

             strictEqual( render.render.properties.guid, idText, "the render guid is of the text"  );
             strictEqual( render.render.properties.displayName, "text", "the render displayName is a text" );
             
                    
        });
        
        test( "findPositionOfElementInFormById shiftKeyOn, shiftKeyOff function", function(){
            var container,
                controller,
                command1,
                command2,
                command3,
                command4,
                command5,
                parentGroup,
                label,
                text,
                render1,
                render2,
                idElement,
                idElement1,
                idElement2;
                            
            //ok( !!container["subscribe"], "container contain subscribe function" );                            
            container = new bizagi.editor.base.container( {}, true ); 
            strictEqual( container.findPositionOfElementInFormById.length, 2, "findPositionOfElementInFormById receive 2 parameters" );
            strictEqual( container.shiftKeyOn.length, 3, "shiftKeyOn receive 3 parameters" );
            strictEqual( container.shiftKeyOff.length, 0, "shiftKeyOff receive 0 parameters" );
                        
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
	         
	        strictEqual( command5.model.findPositionOfElementInFormById(idElement1, 0).position, 4 ,"position label render is 4" );    
	        strictEqual( command5.model.findPositionOfElementInFormById(idElement2, 0).position, 5 ,"position text render is 5" );
	        
	        command5.model.shiftKeyOn(idElement, idElement1, false );
	        
	        ok( !( !!command5.model.form.elements[0].render.properties.shiftKey ), "element[0] in the model isn't shiftkey" ); 
	        ok( command5.model.form.elements[1].render.properties.shiftKey , "element[1] in the model is shiftkey" ); 
	        ok( command5.model.form.elements[2].container.elements[0].render.properties.shiftKey , "first render in group element[2] in the model is shiftkey" ); 
	        ok( !( !!command5.model.form.elements[2].container.elements[1].render.properties.shiftKey ) , "second render in group element[2] in the model isn't shiftkey" ); 
	        
	        command5.model.shiftKeyOff();
	        
	        ok( !command5.model.form.elements[0].render.properties.shiftKey, "element[0] in the model isn't shiftkey" ); 
	        ok( !command5.model.form.elements[1].render.properties.shiftKey , "element[1] in the model isn't shiftkey" ); 
	        ok( !command5.model.form.elements[2].container.elements[0].render.properties.shiftKey, "first render in group element[2] in the model isn't shiftkey" ); 
	        ok( !command5.model.form.elements[2].container.elements[1].render.properties.shiftKey, "second render in group element[2] in the model isn't shiftkey" ); 	             	                      	     
                    
        });
        */
                                   
    });