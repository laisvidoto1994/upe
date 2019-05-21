
/*
*   Name: BizAgi FormModeler Editor Component contextmenu Model Class
*   Author: Jair Tellez Jair.Tellez@bizagi.com 
*           Ramiro Gomez Ramiro.Gomez@bizagi.com
*           Diego Parra  Diego.Parra@bizagi.com (refactor)
*   Comments:
*   - This script will define the model that uses the context menu component
*/

$.Class.extend("bizagi.editor.component.contextmenu.model", {}, {
    /*
    *   Constructor
    */
    init: function (model) {
        var self = this;
        self.model = model;

        // Don't build anything of there is no model
        if (!model || !model.items) return;

        // Process context menu model
        self.items = {};
        self.actionItems = {};
        self.properties = {};
        self.processItems(model.items);
    },

    /*
    *   Returns the model that is going to be used in the view
    */
    getViewModel: function () {
        return this.model;
    },

    /*
    *   Process model in order to add indexes to access any item
    */
    processItems: function (items) {
        var self = this;

        for (var i = 0; i < items.length; i++) {
            self.processItem(items[i]);
        }

    },

    /*
    * Process a single item
    */
    processItem: function (item) {
        var self = this;

        // Add a guid in order to index it
        item.guid = Math.guid();

        // Index the element
        self.items[item.guid] = item;

        if (item.caption) { item.caption = bizagi.localization.getResource(item.caption); }
        if (item.action) { self.actionItems[item.action] = item; }

        // Index values
        if (item.property && item.value) {
            var relatedItem = self.properties[item.property] = self.properties[item.property] || { values: {} };
            relatedItem.values = relatedItem.values || {};
            item["default"] = item.value;
            relatedItem.values[JSON.encode(item.value)] = item;

        }



        // Process sub-items
        if (item.items) self.processItems(item.items);
    },

    /*
    *   Gets an item by guid
    */
    getItem: function (guid) {
        return this.items[guid];
    },

    /*
    * Gets item by action
    */
    getItemByAction: function (action) {
        var self = this;
        return self.actionItems[action];
    },


    /*
    *   Get the properties linked in this context menu
    */
    getProperties: function () {
        return this.properties;
    },

    /*
    *   Assign a property value in order to set the selected sub-value
    */
    assignProperty: function (property, value) {
        var self = this;
        var item = self.properties[property];
        if (item) {


            // Clear previous values
            for (var key in item.values) {
                item.values[key].selected = false;
                item.values[key].value = item.values[key]["default"];
            }

            // if value is a boolean then convert it to string
            value = (value !== "undefined" && typeof value == "boolean") ? value.toString() : value;
            
            // Set current value
            if (value) {
                if (item.values[JSON.encode(value)]) {
                    item.values[JSON.encode(value)].selected = true;
                } else if (typeof value.rule === "object") {
                    item.values[JSON.encode("expression")].selected = true;
                    item.values[JSON.encode("expression")].value = value;
                }
            }
        }
    },

    /*
    * Adds converTo item
    */
    addConverToItem: function (model) {
        var self = this;

        self.removeConvertToItem();

        if ($.isArray(model) && model.length > 0) {

            var convertToItem = {
                caption: "formmodeler-component-contextmenu-caption-convertto",
                style: "convertTo",
                items: [],
                css: "bz-studio bz-convert-to_16x16_standard"
            };

            for (var i = 0, l = model.length; i < l; i += 1) {
                var control = model[i];
                convertToItem.items.push({ caption: control.caption, style: control.controlName, action: "convertTo", value: control.controlName, css: control.style});
            }

            self.model.items.push(convertToItem);
            self.currentConvertToModel = convertToItem;
            self.processItem(convertToItem);
        }

    },

    /*
    * Removes current convertTo item
    */
    removeConvertToItem: function () {
        var self = this;

        if (self.currentConvertToModel) {
            self.model.items.splice($.inArray(self.currentConvertToModel, self.model.items), 1);
        }
    }


});