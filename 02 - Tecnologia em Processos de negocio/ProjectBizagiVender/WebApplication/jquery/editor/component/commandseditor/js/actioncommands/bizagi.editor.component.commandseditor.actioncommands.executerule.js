
/*
*   Name: BizAgi Editor Component CommandEditor Action Commands ExecuteRule   
    Author: Alexander Mejia
*   Comments:
*   - bizagi.editor.component.commandseditor.actioncommands.executerule

Params
    guidStatement
*/

bizagi.editor.component.commandseditor.actioncommands.base.extend("bizagi.editor.component.commandseditor.actioncommands.executerule", {}, {

    /*
    *   Executes the command
    */
    execute: function () {
        var self = this;

        if (self.existSubmitDataCommand()) {
            return true;
        }

        self.addSubmitDataCommand();
        self.controller.refresh();
                
        return true;
    },

    /*
    * Adds statement submit data in specific position (before current statement)
    */
    addSubmitDataCommand: function () {
        var self = this;

        var statementCollection = self.args.section == "then" ? self.data.commands : self.data.elseCommands;
        self.model.addStatement(self.args.section);

        var statement = statementCollection.pop();
        statement.command = "submit-data";
        statementCollection.splice(self.getPositionStatement(), 0, statement);
    },

    /*
    * Gets current position of statement
    */
    getPositionStatement: function () {
        var self = this;

        var position = 0;
        var statementCollection = self.args.section == "then" ? self.data.commands : self.data.elseCommands;

        for (var i = 0, l = statementCollection.length; i < l; i++) {
            if (statementCollection[i].guid === self.args.guid) {
                position = i;
                break;
            }
        }

        return position;
    },

    /*
    * Returns true if in set of commands, there is a submit-data command
    */
    existSubmitDataCommand: function () {
        var self = this;

        var statementCollection = self.args.section == "then" ? self.data.commands : self.data.elseCommands;
        statementCollection = statementCollection.slice(0, self.getPositionStatement());

        statementCollection = $.grep(statementCollection, function (item) {
            return item.command === "submit-data";
        });

        return (statementCollection.length > 0);
    }

})
