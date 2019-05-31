/*
*   Name: BizAgi Form Modeler Tab Item Extension
*   Author: Diego Parra
*   Comments:
*   -   This script will redefine the tab item class to adjust to form modeler
*/

bizagi.rendering.tabItem.original = $.extend(true, {}, bizagi.rendering.tabItem.prototype);
// Extends itself
$.extend(bizagi.rendering.tabItem.prototype, {

    /*
    *   Set the tab header reference from the parent in order to attach edition handlers
    */
    setTabHeader: function (tabHeader) {
        var self = this,
        properties = self.properties;

        // Add handlers if the tabitem isn't contained in a nested form
        if (!self.isContainedInNestedForm() && !self.isContainedInCollectionNavigator()) {

            // Delete handler
            $(".bz-render-tab-delete", tabHeader).click(function () {
                // Publish deletetab event to the view
                self.triggerGlobalHandler("deletetab", { guid: properties.guid });
                return false;
            });

            // Add tab display name edition handler
            $(".bz-render-tab-edit", tabHeader).click(function () {
                if (!self.isEditableLabelActive()) { self.editDisplayName(tabHeader); }
            });
            tabHeader.dblclick(function () {
                if (!self.isEditableLabelActive()) { self.editDisplayName(tabHeader); }
            }).click(function (ev) {
                ev.stopImmediatePropagation();
                if (!self.isEditableLabelActive()) {
                    self.triggerGlobalHandler("showProperties", { guid: self.properties.guid, redraw: true });
                }
            }).mousedown(function (ev) {
                if (ev.button === 2) {
                    ev.stopImmediatePropagation();
                    if (!self.isEditableLabelActive()) {
                        self.triggerGlobalHandler("elementrightclick", { guid: self.properties.guid, position: { x: ev.clientX, y: ev.clientY} });
                    }
                }
            });




            // Allow sortable connections between tabs
            tabHeader.droppable({
                accept: ".ui-bizagi-draggable-item",
                hoverClass: "ui-bizagi-tab-drop-hover",
                tolerance: "pointer",
                drop: function (event, ui) { self.dropRender(event, ui); },
                activate: function (event, ui) {
                    self.currentDragSource = self.getDragSource(ui.draggable);
                }

            });

        }
    },

    /* 
    *   Change selected item 
    */
    activate: function () {
        var self = this;

        // Call base
        bizagi.rendering.tabItem.original.activate.apply(this, arguments);

        // Publish activatetab event to the view
        self.triggerGlobalHandler("activatetab", { guid: self.properties.guid });
    },

    /*
    * Edit the current display name
    */
    editDisplayName: function (tabHeader) {
        var self = this;
        var label = $("a", tabHeader);

        // Publish label edition event
        self.triggerGlobalHandler("startlabeledition");

        // Create editable label component
        var presenter = self.editableLabelPresenter = new bizagi.editor.component.editableLabel.presenter({
            label: label,
            value: self.properties.displayName
        });

        // Bind change event
        presenter.subscribe("change", function (ev, args) {
            self.triggerGlobalHandler("changelabel", { guid: self.properties.guid, value: args.value });
        });

        // Bind keyup event
        presenter.subscribe("keyup", function (ev, args) {
            // Extend tab header
            tabHeader.find(".ui-bizagi-container-input-editable").width(bizagi.measureString(args.value) + 100);
        });

        // Render label
        presenter.render();

    },

    /*
    * Returns true if the editable label component is active
    */
    isEditableLabelActive: function () {
        var self = this;

        if (self.editableLabelPresenter && self.editableLabelPresenter.editableLabel) { return true; }
        return false;
    },

    /*
    *   Handles renders drop finish operation
    */
    dropRender: function (e, ui) {
        var self = this;

        // If the original event isn't mouseup returns
        if (e.originalEvent.type !== "mouseup") { return; }

        var finalPosition = self.children.length;
        var targetContainer = self.properties.guid;
        var initialPosition = ui.draggable ? ui.draggable.data("start-position") : null;
        var sourceContainer = ui.draggable ? ui.draggable.data("sourceContainer") : null;
        var source = self.currentDragSource;
     
        if (bizagi.editor.utilities.isObject(source)) {

            // Set a timer to avoid multiple drop bug at the same time
            if (bizagi.sortContainerTimeout != null) {
                return;
            }
            bizagi.sortContainerTimeout = setTimeout(function () {
                bizagi.sortContainerTimeout = null;
            }, 100);
            
            // Trigger sort finish event
            self.triggerGlobalHandler("sortfinish", {
                source: source,
                initialPosition: initialPosition,
                finalPosition: finalPosition,
                sourceContainer: sourceContainer,
                targetContainer: targetContainer
            });
        }
    }

});
