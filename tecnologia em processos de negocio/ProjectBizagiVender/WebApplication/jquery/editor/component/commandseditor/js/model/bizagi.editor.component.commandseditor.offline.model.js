/*
*   Name: BizAgi FormModeler Editor Commands Editor Offline Model
*   Author: Alexander Mejia
*   Comments:
*   -   This script will define basic stuff to design actions and validations
*/

bizagi.editor.component.commandseditor.model.extend("bizagi.editor.component.commandseditor.offline.model", {
      
    actionCommands: {
        "background-color": { label: "formmodeler-component-commandseditor-actioncommands-set-background-color", appliesTo: ["render", "container"], exclude: ["nestedform"], type: "color", hasReverse: true },
        "forecolor": { label: "formmodeler-component-commandseditor-actioncommands-set-forecolor-color", appliesTo: ["render"], exclude: ["collection"], type: "color", hasReverse: true },
        "visible": { label: "formmodeler-component-commandseditor-actioncommands-changes-visibility-for", appliesTo: ["render", "container"], type: "boolean", hasReverse: true },
        "readonly": { label: "formmodeler-component-commandseditor-actioncommands-changes-editability-for", appliesTo: ["render", "container"], exclude: ["undefined"], type: "boolean", hasReverse: true },
        "required": { label: "formmodeler-component-commandseditor-actioncommands-set-required-for", appliesTo: ["render"], exclude: ["collection", "undefined", "button"], type: "boolean", hasReverse: true },
        "set-value": { label: "formmodeler-component-commandseditor-actioncommands-set-value-for", appliesTo: ["render"], exclude: ["collection", "undefined", "button"], type: "argument", hasReverse: false },
        "set-min": { label: "formmodeler-component-commandseditor-actioncommands-set-minimum-value-for", appliesTo: ["render"], filterBy: ["number", "date"], type: "argument", hasReverse: false },
        "set-max": { label: "formmodeler-component-commandseditor-actioncommands-set-maximum-value-for", appliesTo: ["render"], filterBy: ["number", "date"], type: "argument", hasReverse: false },
        "collapse": { label: "formmodeler-component-commandseditor-actioncommands-collapse", appliesTo: ["container"], filterBy: ["group"], type: "boolean", hasReverse: true },
        "set-active": { label: "formmodeler-component-commandseditor-actioncommands-set-as-active", appliesTo: ["container"], filterBy: ["tabItem"], type: "boolean", hasReverse: false },        
        "clean-data": { label: "formmodeler-component-commandseditor-actioncommands-clean-data", appliesTo: ["render"], filterBy: ["entity"], isUnary: true, hasReverse: false }
    }
}, { 
    init: function (data) {
        // Call base
        this._super(data);
                    
        // Initialize action commands
        this.actionCommands = this.Class.actionCommands;
    }
});