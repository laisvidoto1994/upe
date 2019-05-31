/*
*   Name: BizAgi FormModeler Editor Controls Navigator Group
*   Author: Alexander Mejia
*   Comments:
*   -   This script will define basic stuff for groups in Controls Navigator
*/

bizagi.editor.observableClass.extend("bizagi.editor.component.controlsnavigator.group.model", {}, {

    /*
    *   Cosntructor, builds the group info in order to render to the template
    */
    init: function (control) {
        // Call base
        this._super();

        this.items = [];

        if (control)
            this.processData(control);
    },

    /*
    *   Process the data and builds the mini-model
    */
    processData: function (control) {
        var self = this, group, controlGroup, controlGroupType;

        if (control.design.visual["controls-navigator"]) {

            controlGroup = control.design.visual["controls-navigator"].group;
            controlGroupType = typeof (controlGroup);

            switch (controlGroupType) {
                case "string":
                    group = controlGroup;
                    break;

                case "object":
                    group = bizagi.editor.utilities.resolveInternalResource(controlGroup);
                    break;
            }


            self.id = group;
            self.name = group;
        } else {
            self.id = "default";
            self.name = "default";
        }

        self.addItem(control);
    },

    /*
    *   Adds an item to the group
    */
    addItem: function (control) {
        var self = this;

        var item = { "id": control.name, "name": bizagi.editor.utilities.resolveInternalResource(control.display), "type": control.type, icon: control.icon, "style": control.style };
        self.items.push(item);
    }



})



