
/*
*   Name: BizAgi FormModeler Editor Move Element Container Command
*   Author: Alexander Mejia
*   Comments:
*   -   This script will define basic stuff for moveelementcontainercommand
*/

bizagi.editor.refreshableCommand.extend("bizagi.editor.moveElementContainerCommand", {}, {
    
    execute: function(){
        var self = this,
            args = self.arguments;
                                    
        if ( !self.element ){
            self.element =  self.model.findElementByPosition(args.posIni, args.parentSource);            
        }

        self.controller.executeCommand({
            command: "removeElement",
            position: args.posIni,
            parent: args.parentSource,
            canUndo: false
        });            
        
        self.controller.executeCommand({
            command: "insertElement",
            position: args.posEnd,
            parent: args.parentTarget,
            element: self.element,
            canUndo: false
        });
                                 
        return true;                                           
    },
    
    undo: function(){
        var self = this,
             args = self.arguments ;
                
        self.controller.executeCommand({
            command: "removeElement",
            position: args.posEnd,
            parent: args.parentTarget,
            canUndo: false
        });
        
        self.controller.executeCommand({
            command: "insertElement",
            position: args.posIni,
            parent: args.parentSource,
            element: self.element,
                canUndo: false
         });
        
        return true;
    }
        
})

