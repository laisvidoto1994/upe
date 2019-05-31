

/*
*   Name: BizAgi FormModeler Editor Communication Protocol Edit Entity Values
*   Author: Alexander Mejia
*   Comments:
*   -   This script will define basic stuff for editentityvalues protocol
*/

bizagi.editor.base.protocol.base.extend("bizagi.editor.base.protocol.editentityvalues", {}, {

    /*
    *   Constructor
    */
    init: function (data) {
        var self = this;

        self._super(data);
        self.actiontype = "LoadEditEntityValues";
    },

    /*
    *   Builds the request info for the protocol
    */
    buildRequest: function () {
        var self = this,
            parameterItem;

        self.parameters = [];

        parameterItem = self.createParameterItem("id", self.args.id);
        self.parameters.push(parameterItem);

    },

    /*
    *   Process BAs answer to use in the modeler
    */
    processBasAnswer: function (basAnswer) {

        if (basAnswer && basAnswer.result) return basAnswer.result.success;
    }

})