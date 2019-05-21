/*
*   Name: BizAgi FormModeler Editor Communication Protocol Get Controls Disabled
*   Author: Alexander Mejia
*   Comments:
*   -   This script will define basic stuff for get controls disabled protocol
*/

bizagi.editor.base.protocol.base.extend("bizagi.editor.base.protocol.getcontrolsdisabled", {}, {

    /*
    *   Constructor
    */
    init: function (data) {
        var self = this;

        self._super(data);
        self.actiontype = "GetControlsDisabled";

    },


    /*
    *   Process BAs answer to use in the modeler
    */
    processBasAnswer: function (basAnswer) {
        var self = this;
        var result = basAnswer.result;

        if (result.success) {
            var controls = {};

            if (result.parameters) {
                for (var i = 0, l = result.parameters.length; i < l; i++) {
                    controls[result.parameters[i].key] = !bizagi.util.parseBoolean(result.parameters[i].value);
                }
            }

            if (self.args.context === "startform") {
                controls["actionlauncher"] = true;
                controls["polymorphiclauncher"] = true;
            }

            return controls;
        }

        return result.success;
    }


})