

/*
@title: Test facade (communication with host)
@authors: David Montoya
@date: 11-apr-12
@description: This unit test will prove, the facade for communicate with the host
*/

    bizagi.loader.then( function() {
        
        module( "facade_communication_with_host" );                               
        
        test( "facade_function", function(){
      		
      		strictEqual( bizagi.editor.base.HostFacade.getControlsMetadata.length, 0, "function getControlsMetadata() don´t receive parameters" );
      		strictEqual( bizagi.editor.base.HostFacade.getXpatHNavigatorFirstLoad.length, 0, "function getXpatHNavigatorFirstLoad() don´t receive parameters" );      		       		           
        });
                
    })
