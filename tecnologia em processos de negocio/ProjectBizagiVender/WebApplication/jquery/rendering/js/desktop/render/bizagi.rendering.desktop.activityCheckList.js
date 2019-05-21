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
    postRender: function () {
        var self = this;
        var control = self.getControl();
        // Call base
        this._super();
        self.addButton = $(".ui-bizagi-render-checkList-add-item", self.element);
        self.newItemName = $(".ui-bizagi-render-checkList-input-name", self.control);
        self.separator = $(".ui-bizagi-render-checkList-separator", self.element);
        self.goalActivity = $(".ui-bizagi-render-checkList-goal-activity", self.element);
        self.additionalElements(); 
        self.notifyLoadItems();

    },

    additionalElements: function () {
        var self = this;
        var control = self.getControl();
        var activityWorkTitle = this.getResource("render-activity-check-list-activitywork") + " (" + self.properties.activityWork + "%)";
        var activityFormTitle = this.getResource("render-activity-check-list-form");

        if (!(self.addButton && self.addButton.length > 0)) {
            var $divContainer = $("<div/>").addClass("ui-bizagi-render-checkList-add-item");
            $divContainer.append($("<h4 />").text(bizagi.localization.getResource("workportal-project-plan-activity-work-title")));
            $divContainer.append($("<button class=''/>").text("+ " +  bizagi.localization.getResource("workportal-project-plan-activity-action-add")));
            self.element.prepend($divContainer);
        }
        if (!(self.separator && self.separator.length > 0)) {
            self.element.append($("<div/>").addClass("ui-bizagi-render-checkList-separator").append($("<span/>")));
        }
        if (!(self.goalActivity && self.goalActivity.length > 0)) {
            if(self.properties.activityDescription && self.properties.activityDescription !== ""){
                self.element.prepend($("<div/>").addClass("ui-bizagi-render-checkList-goal-activity").append("<h3><span class='ui-bizagi-wp-bold'>" +
                bizagi.localization.getResource("workportal-project-plan-activity-goal") +
                ": </span><span>" + self.properties.activityDescription  + "</span></h3>"));
            }
        }
    },

    notifyLoadItems: function(){
        var self = this;
        setTimeout(function(){
            self.triggerGlobalHandler("onLoadDataItemsFromFormActivityPlan", { "items": self.properties.items, "activityWork": self.properties.activityWork });
        }, 100);
    },

    configureHandlers: function () {
        var self = this;
        var control = self.getControl();
        this._super();
        $(".ui-bizagi-render-checkList-add-item button", self.element).unbind("click").click(function () {
            var itemSelected = $(".ui-bizagi-render-checkList-item.selected", self.control);
            if (itemSelected.length <= 0) {
                self.prepareNewItem();
            } else {
                $(".ui-bizagi-render-checkList-input-name", itemSelected).focus();
            }
        });

        $(".item-button.delete", self.checkListGroup).bind("click", function (evt, ui) {
            var itemId = $(this).closest(".ui-bizagi-render-checkList-item").data("item-guid");
            self.deleteItem(itemId);
        });

        $("label.item-name", self.checkListGroup).bind("click", function (evt, ui) {
            var itemSelected = $(this).closest(".ui-bizagi-render-checkList-item");
            var itemId = itemSelected.data("item-guid");
            self.selectItem(itemId);
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
        self.configureHandlers();
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
        self.configureHandlers();
        self.refreshValue(self.properties.items);
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
        self.configureHandlers();
        self.addSelectedHandlers();
    },

    addSelectedHandlers: function () {
        var self = this;
        var itemSelected = $(".ui-bizagi-render-checkList-item.selected", self.control);
        var itemSelectedName = $(".ui-bizagi-render-checkList-input-name", itemSelected);
        itemSelectedName.focus();
        itemSelectedName.blur(function () {
            var newItemName = itemSelectedName.val();
            if (newItemName && newItemName !== "") {
                self.addItem();
            }
            else {
                self.properties.items.splice(self.properties.items.length - 1, 1);
                self.setValue(self.properties.items);
                self.repaintControl();
                self.configureHandlers();
            }
        });
        itemSelectedName.keypress(function (event) {
            if (event.which == 13) {
                event.preventDefault();
                var newItemName = itemSelectedName.val();
                if (newItemName && newItemName !== "") {
                    self.addItem();
                    self.prepareNewItem();
                }
            }
        });
    },

    addItem: function () {
        var self = this;
        var control = self.getControl();
        var itemSelected = $(".ui-bizagi-render-checkList-item.selected", self.control);
        var itemSelectedName = $(".ui-bizagi-render-checkList-input-name", itemSelected);
        var newItemName = itemSelectedName.val();
        self.addButton.show();
        $.each(self.properties.items, function (index, item) {
            if (item.selected) {
                item.name = newItemName;
                item.selected = false;
            }
        });
        self.updateOriginalValue();
        self.setValue(self.properties.items);
        self.repaintControl();
        self.configureHandlers();
        self.refreshValue(self.properties.items);
    },

    repaintControl: function () {
        var self = this;
        var control = self.getControl();
        var checkListHtml = self.renderControl();
        $(".ui-bizagi-render-checkList", self.control).replaceWith(checkListHtml);
        self.postRender();
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

        var html = this.getResource("render-activity-check-list-activitywork") + " (" + self.properties.activityWork + "%)";
        $(".ui-bizagi-render-checkList-activity-work span", self.element).html(html);
        self.triggerGlobalHandler("onLoadDataItemsFromFormActivityPlan", { "items": self.properties.items, "activityWork": self.properties.activityWork });
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

    /**
     * Validate if all checked items on activity
     * @returns {boolean}
     */
    allCheckedItems: function (){
        var self = this;
        var response = false;
        if(Array.isArray(self.value)){
            response = self.value.every(function(item){
                return item.resolved == true;
            });
        }
        return response;
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

        var validationResolvedItems = true;
        var lastActionButton = self.getFormContainer().getLastActionButton();
        if(lastActionButton && lastActionButton.action == "next"){
            validationResolvedItems = self.allCheckedItems();
        }

        if (self.controlValueIsChanged() && validationResolvedItems) {
            // Filter by valid xpaths and valid values
            if (!bizagi.util.isEmpty(xpath) && !bizagi.util.isEmpty(idActivity)) {
                if (Array.isArray(value)) {
                    var data = {
                        idActivity: idActivity,
                        items: value
                    };
                    renderValues[properties.xpath] = JSON.stringify(data);
                } else if (value === "") {
                    renderValues[properties.xpath] = "";
                }
            }
        }
    },
    isValid: function (invalidElements) {
        var self = this,
            properties = self.properties,
            message;
        var items = self.getValue();
        var valid = true;
        message = self.getResource("render-activity-check-list-validation");
        for (var i = 0; i < items.length; i+=1) {
            var item = items[i];
            if (!item.resolved) {
                invalidElements.push({
                    xpath: properties.xpath,
                    message: message
                });
                valid = false;
                break;
            }
        }
        return valid;
    }

});
