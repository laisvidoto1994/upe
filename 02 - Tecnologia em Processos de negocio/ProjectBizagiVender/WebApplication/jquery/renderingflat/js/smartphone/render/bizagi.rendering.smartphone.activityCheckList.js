/*
 *   Name: BizAgi Desktop Render list Extension
 *   Author: Iván Ricardo Taimal Narváez
 *   Comments:
 *   -   This script will redefine the list render class to adjust to desktop devices
 */

// Extends from base list
bizagi.rendering.checkList.extend("bizagi.rendering.activityCheckList", {}, {

    /*
     *   Template method to implement in each device to customize each render after processed
     */
    postRenderSingle: function () {
        var self = this;
        var control = self.getControl();
        // Call base
        this._super();
        self.header = $(".ui-bizagi-render-checkList-activity-work", self.element);
        self.addButton = $(".ui-bizagi-render-checkList-add-item", self.control);
        self.newItemName = $(".ui-bizagi-render-checkList-input-name", self.control);
        self.separator = $(".ui-bizagi-render-checkList-separator", self.element);
        self.goalActivity = $(".ui-bizagi-render-checkList-goal-activity", self.element);
        self.addEditButton = $(".add-edit-item-button-checklist", self.control);
        self.cancelEditButton = $(".cancel-edit-item-button-checklist", self.control);
        self.additionalElements();
        self.configureHandlers();
        $(".ui-bizagi-render-edition-arrow", self.getControl().parent()).hide();
        self.notifyLoadItems();

        //self.configureProgressHandlers();
    },

    /**
     * Event Handlers
     *
    configureProgressHandlers: function () {
        var self = this;

        bizagi.webpart.subscribe('onLoadDataFromFormActivityPlan', function (e, params) {
            var activityWorkTitle = self.getResource("render-activity-check-list-activitywork") + " (" + params.activityWork.progress + "%)";

            $(".ui-bizagi-render-checkList-activity-work").text(activityWorkTitle);
            e.stopImmediatePropagation();
        });
    },*/

    notifyLoadItems: function(){
        var self = this;
        setTimeout(function(){
            var resolvedItems = self.properties.items.filter(function(i){
                return i.resolved
            }).length;
            bizagi.util.setItemLocalStorage("newChanges", JSON.stringify({
                'hasChanges': true,
                'idActivity': self.properties.idActivity,
                'itemsResolved': resolvedItems,
                'items': self.properties.items,
                'progress': self.properties.activityWork
            }));

            bizagi.webpart.publish("onLoadDataItemsFromFormActivityPlan", { "items": self.properties.items, "activityWork": self.properties.activityWork });
        }, 100);
    },

    additionalElements: function () {
        var self = this;
        var control = self.getControl();
        var activityWorkTitle = this.getResource("render-activity-check-list-activitywork") + " (" + self.properties.activityWork + "%)";
        var activityFormTitle = this.getResource("render-activity-check-list-form");
        if (!(self.header && self.header.length > 0)) {
            self.element.prepend($("<div/>").addClass("ui-bizagi-render-checkList-activity-work").append($("<span/>").text(bizagi.localization.getResource("workportal-project-plan-activity-work-title"))));
        }
        if (!(self.goalActivity && self.goalActivity.length > 0)) {
            if(self.properties.activityDescription && self.properties.activityDescription !== ""){
                self.element.prepend($("<div/>").addClass("ui-bizagi-render-checkList-goal-activity").append("<h4><span class='ui-bizagi-wp-bold'>" +
                bizagi.localization.getResource("workportal-project-plan-activity-goal") +
                ": </span><span>" + self.properties.activityDescription  + "</span></h4>"));
            }
        }
        if (!(self.addButton && self.addButton.length > 0)) {
            self.control.append($("<div/>").addClass("ui-bizagi-render-checkList-add-item").append($("<button/>").text("+")));
        }
        if (!(self.separator && self.separator.length > 0)) {
            self.element.append($("<div/>").addClass("ui-bizagi-render-checkList-separator").append($("<span/>").text(activityFormTitle)));
        }
        if (self.addEditButton && self.addEditButton.length > 0) {
            self.addEditButton.hide();
        }
        if (self.cancelEditButton && self.cancelEditButton.length > 0) {
            self.cancelEditButton.hide();
        }
        control.parent().addClass("render-activity-check");
    },

    configureHandlers: function () {
        var self = this;
        var control = self.getControl();
        this._super();
        $(".ui-bizagi-render-checkList-add-item button", control).unbind( "click").click(function () {
            var itemSelected = $(".ui-bizagi-render-checkList-item.selected", self.control);
            if (itemSelected.length <= 0) {
                self.prepareNewItem();
            } else {
                $(".ui-bizagi-render-checkList-input-name", itemSelected).focus();
            }
        });

        $(".delete-item-from-activity", self.control).bind("click", function () {
            var contentHolder = $(this).closest(".ui-bizagi-render-checkList-item");
            contentHolder.addClass("ui-bizagi-to-remove");
            if( window.confirm( bizagi.localization.getResource("workportal-widget-reports-confirm") ) ) {
                var itemId = $(this).closest(".ui-bizagi-render-checkList-item").data("item-guid");
                self.deleteItem(itemId);
                self.addButton.show();
            }
            else {
                contentHolder.removeClass("ui-bizagi-to-remove");
            }
        });

        $(".activity-work-items", self.control).bind("click", function () {
            var element = $(this).closest(".ui-bizagi-render-checkList-item");
            var itemId = element.data("item-guid");
            var itemPosition = element.data("item-position");
            self.selectItem(itemId, itemPosition);
        });
    },

    selectItem: function (itemId) {
        var self = this;

        for (var i = 0; i < self.properties.items.length; i++) {
            if (self.properties.items[i].guid === itemId) {
                self.properties.items[i].selected = true;
            } else {
                self.properties.items[i].selected = false;
            }
        }
        self.repaintControl();
        var itemSelected = $(".ui-bizagi-render-checkList-item.selected");
        var itemSelectedName = $(".ui-bizagi-render-checkList-input-name", itemSelected);
        var itemContent = itemSelectedName.val();
        itemSelectedName.focus();
        itemSelectedName[0].setSelectionRange(itemContent.length, itemContent.length);
        self.addButton.hide();

        self.addSelectedHandlers();
    },

    deleteItem: function (itemId) {
        var self = this;
        for (var i = 0; i < self.properties.items.length ; i++) {
            if (self.properties.items[i].guid === itemId) {
                self.properties.items.splice(i,1);
                break;
            }
        }
        self.setValue(self.properties.items);
        self.repaintControl();
        self.addSelectedHandlers();
    },

    prepareNewItem: function () {
        var self = this;
        var newItem = {
            guid: Math.guid(),
            resolved: false,
            name: "",
            selected: true
        };
        self.properties.items.push(newItem);
        self.repaintControl();
        self.addButton.hide();
        self.newItemName.focus();
        self.newItemName.blur(function () {
             var itemSelected = $(".ui-bizagi-render-checkList-item.selected", self.control);
             var itemSelectedName = $(".ui-bizagi-render-checkList-input-name", itemSelected);
             var valueInput = itemSelectedName.val();

             if(valueInput === "" && self.properties.items && self.properties.items.length >= 1
                    && self.properties.items.slice(-1)[0].name === ""){
                self.properties.items.pop();
             }
         });
        self.addSelectedHandlers();
        self.newItemName.keypress(function (event) {
            if (event.which == 13) {
                event.preventDefault();
                self.addItem();
                self.prepareNewItem();
            }
        });
    },

    addSelectedHandlers: function () {
        var self = this;
        var itemSelected = $(".ui-bizagi-render-checkList-item.selected", self.control);
        var itemSelectedName = $(".ui-bizagi-render-checkList-input-name", itemSelected);
        itemSelectedName.focus();
        $(".add-item-button-checklist", itemSelected).bind("click", function () {
            var newItemName = itemSelectedName.val();
            if (newItemName && newItemName !== "") {
                self.addItem();
            }
        });
        $(".cancel-item-button-checklist", itemSelected).bind("click", function (e) {
            var newItemName = itemSelectedName.val();
            var element = $(this).closest(".ui-bizagi-render-checkList-item");
            var itemPosition = element.data("item-position");
            var guidItem = element.data("item-guid");

            if (newItemName && newItemName !== "" && self.properties.items[itemPosition].name !== "") {
                self.properties.items[itemPosition].selected = false;
            }
            if (newItemName === "" || self.properties.items[itemPosition].name === "") {
                self.deleteItem(guidItem);
            }
            self.addButton.show();
            self.repaintControl();
        });
    },

    addItem: function () {
        var self = this;
        var control = self.getControl();

        var itemSelected = $(".ui-bizagi-render-checkList-item.selected", self.control);
        var itemSelectedName = $(".ui-bizagi-render-checkList-input-name", itemSelected);
        var newItemName = itemSelectedName.val();

        $.each(self.properties.items, function (index, item) {
            if (item.selected) {
                item.name = newItemName;
                item.selected = false;
            }
        });
        self.updateOriginalValue();
        self.setValue(self.properties.items);
        self.repaintControl();
        self.addButton.show();
    },

    repaintControl: function () {
        var self = this;
        var control = self.getControl();
        var checkListHtml = self.renderControl();
        $(".ui-bizagi-render-checkList", self.control).replaceWith(checkListHtml);
        self.postRenderSingle();
    },

    onCheckListGroupChange: function (itemId, checked) {
        var self = this;
        var item;
        var items = $.grep(self.properties.items, function (element, index) {
            return element.guid === itemId;
        });
        if (items && items.length > 0) {
            item = items[0];
        }
        item.resolved = checked;
        self.setValue(self.properties.items);
        self.refreshValue(self.properties.items);
    },

    refreshValue: function(items){
        var self = this,
            control = self.getControl(),
            length = items.length,
            completed = 0;

        for (var i = 0; i < length; i++) {
            if (items[i].resolved) {
                completed += 1;
            }
        }

        if (length > 0) {
            self.properties.activityWork = Math.floor(100 * completed / length);
        }
        else {
            self.properties.activityWork = 100;
        }

        self.notifyLoadItems();
    },

    getValue: function (data) {
        var self = this;

        return self.value || [];
    },

    controlValueIsChanged: function () {
        var self = this;
        var originalValue = JSON.stringify(self.properties.originalValue);
        var newValue = JSON.stringify(self.value);
        return originalValue !== newValue;
    },

    /*
     *   Updates original value for some comparisons
     */
    updateOriginalValue: function () {
        var self = this;
        self.properties.originalValue = bizagi.clone(self.value);
    },

    /*
     *   Add the render data to the given collection in order to send data to the server
     */
    collectData: function (renderValues) {
        var self = this;
        var properties = self.properties;

        // Add the render value
        var xpath = properties.xpath;
        var value = self.getValue();
        var idActivity = self.properties.idActivity;

        if (self.controlValueIsChanged()) {
            // Filter by valid xpaths and valid values
            if (!bizagi.util.isEmpty(xpath) && !bizagi.util.isEmpty(idActivity)) {
                if (Array.isArray(value)) {
                    renderValues[properties.xpath] = {
                        idActivity: idActivity,
                        items: value
                    };
                } else if (value === "") {
                    renderValues[properties.xpath] = "";
                }
            }
        }else{
            bizagi.util.setItemLocalStorage("newChanges", JSON.stringify({
                'hasChanges': false
            }));
        }
    },

    isValid: function (invalidElements) {
        var self = this,
            properties = self.properties,
            message;
        var items = self.getValue();
        message = self.getResource("render-activity-check-list-validation");
        for (var i = 0; i < items.length; i+=1) {
            var item = items[i];
            if (!item.resolved) {
                invalidElements.push({
                    xpath: properties.xpath,
                    message: message
                });
                break;
            }
        }
    }
});
