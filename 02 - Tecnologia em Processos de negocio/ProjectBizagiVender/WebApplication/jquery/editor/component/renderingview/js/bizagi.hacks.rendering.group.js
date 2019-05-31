
/*
*   Name: BizAgi Form Modeler Group Extension
*   Author: Alexander Mejia
*   Comments:
*   -   This script will redefine the group class to adjust to form modeler
*/

// Auto extend
bizagi.rendering.group.original = $.extend(true, {}, bizagi.rendering.group.prototype);
$.extend(bizagi.rendering.group.prototype, {
    /* 
    *   Template method to implement in each device to customize each container after processed
    */
    postRenderContainer: function (group) {
        var self = this;

        // Call original method
        bizagi.rendering.group.original.postRenderContainer.apply(this, arguments);

        // If the current form is readonly return;
        if (self.isReadOnlyForm()) {
            return;
        }

        // Bind header double click
        var header = group.find(".ui-bizagi-container-group-header:first a");

        if (!self.isInNestedform()) {
            header.dblclick(function () {
                // Publish label edition event
                self.triggerGlobalHandler("startlabeledition");

                // Create editable label component
                var presenter = new bizagi.editor.component.editableLabel.presenter({
                    label: header,
                    value: self.properties.displayName
                });

                // Bind change event
                presenter.subscribe("change", function (ev, args) {
                    self.triggerGlobalHandler("changelabel", { guid: self.properties.guid, value: args.value });
                });

                // Render label
                presenter.render();
            });
        }

        var guid = self.properties.guid;
        setTimeout(function () {
            var lastElementInserted = self.triggerGlobalHandler("getLastInsertedElement");
            if (guid == lastElementInserted) {
                self.showElementLabelEditor();
                self.triggerGlobalHandler("setLastInsertedElement", null);
            }
        }, 0);
    },

    /*
    *   Disable sortable plugin
    */
    disableSortablePlugin: function () {
        var self = this;
        var container = self.container.find('.ui-bizagi-container-group-wrapper');

        if (container && container.hasClass('ui-sortable')) {
            if (container.data()["ui-sortable"]) {
                container.sortable('destroy');
            }
        }

        for (var i = 0, l = self.children.length; i < l; i = i + 1) {
            if (self.children[i].container) {
                self.children[i].disableSortablePlugin();
            }
        }
    },


    // Configure  sortable plugin
    configureSortablePlugin: function (container) {
        var self = this;
        container = container.find('.ui-bizagi-container-group-wrapper');

        return bizagi.rendering.group.original.configureSortablePlugin.apply(this, arguments);
    },

    // fix for SUITE-6665
    isInNestedform: function () {
        var self = this, parent, properties, result = false;
        properties = self.properties;
        parent = self.parent;
        do {
            if (properties.type == "nestedForm" || properties.type == "collectionnavigator") {
                result = true;
                break;
            } else {
                properties = parent.properties;
                parent = parent.parent;
            }
        } while (parent !== undefined);
        return result;
    },

    /*
    *   Show the label editor and update the element
    */
    showElementLabelEditor: function () {
        var self = this;

        if (!(self.container.find(".ui-bizagi-container-input-editable > input.ui-bizagi-input-editable").length > 0)) {
            self.container.find("a:first").trigger('dblclick');
        }
    }
})