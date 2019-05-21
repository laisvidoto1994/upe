/*
*   Name: BizAgi FormModeler Editor Communication Protocol Copy From 
*   Author: Alexander Mejia
*   Comments:
*   -   This script will define basic stuff for copyfrom protocol
*/

bizagi.editor.base.protocol.base.extend("bizagi.editor.base.protocol.copyform", {}, {

    init: function (data) {
        var self = this;

        self._super(data);
        self.actiontype = "LoadCopyForm";

    },

    processBasAnswer: function (basAnswer) {
        var self = this,
            result = basAnswer.result;

        if (result.success) {
            self.answerParameters = result.parameters;
            var jsonForm = self.findKeyInParameters("form");
            var taskButtons = self.findKeyInParameters("buttons");

            jsonForm = JSON.parse(jsonForm.value);
            if (taskButtons) {
                taskButtons = JSON.parse(taskButtons.value);
                jsonForm.buttons = taskButtons.buttons;
            }
            return jsonForm;
        }

        return result.success;
    }

})