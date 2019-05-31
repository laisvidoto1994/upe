
/*
*   Name: BizAgi FormModeler Editor Load Model Command
*   Author: Diego Parra
*   Comments:
*   -   This script will define basic stuff for loadmodelcommand
*/

bizagi.editor.notUndoableCommand.extend("bizagi.editor.loadModelCommand", {}, {
    
	/*
	*   Executes the command
	*/  
    execute: function(){
        var self = this;
    	var args = self.arguments;
    	var dataModel = args.dataModel;
    	
    	// loads the model
    	self.model.loadModel(self.controller.getContext(), dataModel);
                                                                                                          
        return true;        
    }
})
