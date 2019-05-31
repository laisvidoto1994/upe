/*
*   Name: BizAgi FormModeler Editor Render Behaviour
*   Author: Alexander Mejia, Diego Parra
*   Comments:
*   -   This script will define behavioral code for the renders in order to keep
*       the render code clean
*/

// Make sure the namespaces exists
bizagi.editor = bizagi.editor || { };
bizagi.editor.base = bizagi.editor.base || { };

bizagi.editor.base.renderBehaviour = {


    //TODO: We need to change this, because this is not responsability for the render
    findPositionOfElementInFormById: function (guid, position) {
        var self = this,
            result = { position: position, found: false };

        if (self.guid === guid) {
            result = { position: position, found: true };
        }

        return result;
    }
};


