
/*
@title: Test main controller
@authors: Alexander Mejia
@date: 28-feb-12
@description: This unit test will prove, the main controller			
*/

    bizagi.loader.then( function() {
        module("class main controller");
        
        test("controller class", function(){
            var controller = new bizagi.editor.base.controller();
            ok(!!controller["subscribe"], "controller contain subscribe function");
            ok(!!controller["publish"], "controller contain publish function");
            ok(!!controller["undo"], "controller contain undo function");
            ok(!!controller["redo"], "controller contain redo function");
            ok(!!controller["onCommandExecuted"], "controller contain onCommandExecuted event");
            ok(!!controller["executeCommand"], "controller contain executeCommand function");
            strictEqual(controller["executeCommand"].length, 1, "executeCommand has one parameter");
            strictEqual(controller.undoCommandStack.length, 0, "controller contain undoCommandStack array");
            strictEqual(controller.redoCommandStack.length, 0, "controller contain redoCommandStack array"); 
            ok(!!controller["getMinitoolbarModel"], "controller contain getMinitoolbarModel function");
            ok(!!controller["getRenderModel"], "controller contain getRenderModel function");                               
            ok(!!controller["getXpathNavigatorModel"], "controller contain getXpathNavigatorModel function");                               
                        
        });
        
        
        test("getMinitoolbarModel function", function(){
            var controller = new bizagi.editor.base.controller();
            var data =  controller.getMinitoolbarModel();
            ok(!!data.minitoolbar["groups"], "the MinitoolbarModel was loaded");  
              
        });
        
        test("getRenderModel function", function(){
            var controller = new bizagi.editor.base.controller();
            var data =  controller.getRenderModel();
            ok(!!data["form"], "the RenderModel was loaded");  
              
        });
                     
        test("getXpathNavigatorModel function", function(){
            var controller = new bizagi.editor.base.controller();
            var data =  controller.getXpathNavigatorModel();
			//strictEqual(model.nodes.length, 10, "the nodes was created");				
            ok(!!data["nodes"], "the XpathNavigatorModel was loaded");  
              
        });
                     
                        
        /*
        test("throw exeption create function without command argument", function(){
	        raises(function(){			     
	             var factory = new bizagi.editor.commandfactory({controller: "controller"}); 
	             factory.create({model : "model"});
			}, "must throw error to pass, call create without command argument");			    
	    }) 
	    
	     test("throw exeption, call to create, without the corresponding command exists ", function(){
	        raises(function(){			     
	             var factory = new bizagi.editor.commandfactory({controller: "controller"}); 
	             factory.create({command : "AddElement"});
			}, "must throw error to pass, call to create with command AddElement, but is not exists");			    
	    })
	    */ 
    
    });