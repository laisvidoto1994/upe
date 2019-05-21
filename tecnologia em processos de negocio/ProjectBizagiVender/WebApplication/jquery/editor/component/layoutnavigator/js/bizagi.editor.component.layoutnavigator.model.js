
/*
*   Name: BizAgi FormModeler Editor Layout Navigator
*   Author: Diego Parra
*   Comments:
*   -   This script will define basic stuff for layouts (elements in toolbar)
*/

bizagi.editor.observableClass.extend("bizagi.editor.component.layoutnavigator.model", {}, {

    /*
    *   Cosntructor, creates the component model based on the control's definitions
    */
    init: function (data) {
        var self = this;

        // Call base
        this._super();

        self.layouts = [];
        if (data)
            this.processData(data);
    },

    /*
    *   Reads the metadata, checks the visual section and find the render groups to build this object
    */
    processData: function (data) {
        var self = this;

        $.each(data.layouts, function(i, layout) {
            if (layout.caption.resource) {
                layout.caption = bizagi.localization.getResource(layout.caption.resource);
            }

            self.layouts.push(layout);
        });
    },

    findControlById: function (id) {
        var self = this,
            result = false;

        for (var i = 0, l = self.layouts.length; i < l; i = i + 1) {
            if (self.layouts[i].id === id) {
                result = self.layouts[i];
                break;
            }
        }

        return result;
    }

})


