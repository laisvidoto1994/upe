
/*
*   Name: BizAgi FormModeler Editor Change Multiple Properties Command
*   Author: Alexander Mejia
*   Comments:
*   -   This script will define basic stuff for changemultiplepropertiescommand
*/

bizagi.editor.refreshableCommand.extend("bizagi.editor.changeMultiplePropertiesCommand", {}, {

    execute: function () {
        var self = this;
        var args = self.arguments;
        var refresh = false;
        args.canValidate = true;

        if (!$.isArray(args.guids) && typeof args.guid === "string") {
            args.guids = [args.guid];
        }

        if (!self.originalValues) { self.originalValues = {}; }

        for (var i = 0, l = args.guids.length; i < l; i++) {

            var guid = args.guids[i];
            var element = self.model.getElement(guid);

            if (!self.originalValues[guid]) {
                self.originalValues[guid] = [];
                for (var j = 0, k = args.properties.length; j < k; j += 1) {
                    var property = args.properties[j].property;
                    self.originalValues[guid].push({ property: property, value: element.getProperty(property) });
                }
            }

            for (j = 0, k = args.properties.length; j < k; j += 1) {
                property = args.properties[j].property;
                var value = args.properties[j].value;

                // Perform change property
                element.assignProperty(property, value, args.exclusive);

                refresh = element.hasDesignValue(property) || refresh;
            }
        }

        if (refresh) {
            self.arguments.refresh = true;
        }

        return true;
    },

    undo: function () {
        var self = this,
            args = self.arguments;


        for (var i = 0, l = args.guids.length; i < l; i++) {

            var guid = args.guids[i];
            var element = self.model.getElement(guid);

            // Perform change property
            for (var key in self.originalValues) {

                for (var j = 0, k = self.originalValues[key].length; j < k; j++) {
                    
                    var property = self.originalValues[key][j].property;
                    var value = self.originalValues[key][j].value;

                    element.assignProperty(property, value, args.exclusive);
                }
            }
        }

        return true;
    }

})
