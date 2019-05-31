/*
*   Name: BizAgi FormModeler Editor Copy Format Command
*   Author: Rhony Pedraza
*   Comments:
*   -   This script will define basic stuff for copyformatcommand
*/
bizagi.editor.notUndoableCommand.extend("bizagi.editor.copyFormatCommand", {}, {
    
    execute : function() {
        var self = this;
        var args = self.arguments;
        
        var element = self.model.getElement(args.guid);
        var property = element.getProperty("format");
        
        // set stack
        self.controller.pushCopyFormat({
            guid : args.guid,
            properties : property
        });
        
        return true;
    }
    
});