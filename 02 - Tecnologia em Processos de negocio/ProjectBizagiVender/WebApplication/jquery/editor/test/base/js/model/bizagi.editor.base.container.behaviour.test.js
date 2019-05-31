

/*
@title: Test container
@authors: Alexander Mejia
@date: 08-JUN-12
@description: This unit test will prove, the container behaviour			
*/

    bizagi.loader.then( function() {
        module( "class container behaviour" );
        
        test( "container class", function(){
        
            var container = new bizagi.editor.base.container( {}, true );
            
            ok( !!container["subscribe"], "container contain subscribe function" );
            ok( !!container["publish"], "container contain publish function" );
            ok( !!container["addElement"], "container contain addElement function" );
            ok( !!container["removeLastElement"], "container contain removeLastElement function" );
            ok( !!container["moveElement"], "container contain moveElement function" );
            ok( !!container["removeElement"], "container contain removeElement function" );
            ok( !!container["findElementByPosition"], "container contain findElementByPosition function" );
            ok( !!container["insertElement"], "container contain insertElement function" );                                                                            
            ok( !!container["updateElementByPosition"], "Container has method updateElementByPosition" );
        });
    });