

/*
@title: Test modeler view
@authors: Alexander Mejia
@date: 28-feb-12
@description: This unit test will prove, the main view			
*/

bizagi.loader.then( function() {
     
     module("modelerview test");
     
     test("class modeler view", function(){
        
        var view = new bizagi.editor.modelerView();
        ok(!!view["subscribe"], "view contain subscribe function");
        ok(!!view["publish"], "view contain publish function");
        ok(!!view["undo"], "view contain undo function");
        ok(!!view["redo"], "view contain redo function"); 
        ok(!!view["render"], "view contain render function");        
        ok(!!view["commandExecuted"], "view contain commandExecuted function");                
        ok(!!view["executeCommand"], "view contain executeCommand function");
        strictEqual(view["executeCommand"].length, 1, "executeCommand has one parameter");
        
        ok(!!view.controller, "view contain controller property");
                  
     });
})
