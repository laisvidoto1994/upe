
/*
*   Name: BizAgi FormModeler Editor Load Widgets Command
*   Author: Diego Parra
*   Comments:
*   -   This script will define basic stuff for loadwidgetscommand
*/

bizagi.editor.notUndoableCommand.extend("bizagi.editor.loadWidgetsCommand", {}, {

    /*
    *   Executes the command
    */
    execute: function () {
        var self = this;
        var args = self.arguments;

        // Adds definition widsets to model
        self.model.addWidgets(args.controls.widgets);

        // Gets controls model
        var controlsModel = self.controller.componentModels["controlsNavigator"];
        var controls = self.controller.getControlsModel();
        
        // Loads widgets
        $.each(args.controls.widgets, function (index, val) {
            if (val.type && val.type == 'userfield') {
                self.controller.loadIconUserField(val);
                self.controller.loadUserfield(val);
            }
        });
       
        controlsModel.processData({ controls: args.controls.widgets });
        controls.processData({ controls: args.controls.widgets }, []);

        // Remove the metadata cached
        for (var key in localStorage) {
            if (key.indexOf("control.definitions") >= 0) localStorage.removeItem(key);
        }

        return true;
    }
})
