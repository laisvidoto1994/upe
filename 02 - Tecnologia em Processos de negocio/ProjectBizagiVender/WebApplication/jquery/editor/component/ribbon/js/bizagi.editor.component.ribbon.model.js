/*
* Author : Alexande Mejia / Jair Tellez
* Date   : 13 Ago 2012
* Comments:
*     Define the model of the ribbon component
*
*/
bizagi.editor.observableClass.extend("bizagi.editor.component.ribbon.model", {

}, {

    /*
    *   Constructor
    */
    init: function (data) {
        var self = this;
        self.model = data;

        // Call base
        self._super();

        // Create indexes
        self.items = {};
        self.properties = {};
        self.actions = {};
        self.groups = {};

        // Process data
        if (data.elements) {
            self.processElements(data.elements, true);
        }

    },

    /*
    *   Get view model
    */
    getViewModel: function () {
        var viewModel = { elements: [] };

        for (var i = 0, l = this.model.elements.length; i < l; i++) {
            var element = this.model.elements[i];
            if (!element.hide) {
                viewModel.elements.push(element);
            }
        }

        return viewModel;
    },

    /*
    *   Process the dta in order to index elements
    */
    processElements: function (elements, isMainGroup) {
        var self = this;
        for (var i = 0; i < elements.length; i++) {
            var element = elements[i];
            element.guid = element.guid || Math.guid();
            element.caption = bizagi.localization.getResource(element.caption) || "";
            element.tooltip = (element.tooltip) ? bizagi.localization.getResource(element.tooltip) : element.caption;

            // Index main groups
            if (isMainGroup) self.groups[element.name] = element;

            // Index element 
            self.items[element.guid] = element;
            if (element.property && !element.value) self.properties[element.property] = element;
            if (element.action) self.actions[element.action] = element;

            // Index values
            if (element.property && element.value) {
                var relatedItem = self.properties[element.property];
                relatedItem.values = relatedItem.values || {};
                relatedItem.values[JSON.encode(element.value)] = element;
            }

            // Set disabled settings
            element.disabled = element.disabled == true || element.disabled == "disabled" ? true : false;
            element.originalDisabled = element.disabled;

            // Process sub-elements
            if (element.elements) {
                self.processElements(element.elements);
            }
        }
    },

    /*
    *  Gets an element by action
    */
    getElementByAction: function (action) {
        var self = this;
        return self.actions[action];
    },


    /*
    *  Process elements for convert to
    */
    processElementsForConvertTo: function (elements) {
        var self = this;
        self.processElements(elements);
    },

    /*
    *   Gets an element by guid
    */
    getElement: function (guid) {
        return this.items[guid];
    },

    /*
    *   Reset ribbon to its original state
    */
    reset: function () {
        var self = this;

        // Reset properties
        $.each(self.properties, function (key, item) {
            item.disabled = item.originalDisabled;
        });

        // Reset actions
        $.each(self.actions, function (key, item) {
            item.disabled = item.originalDisabled;
        });
    },

    /*
    *   Enable an item with a linked property
    */
    enableProperty: function (property, value) {
        var self = this;
        var item = self.properties[property];
        if (item) {
            item.disabled = false;

            // Clear previous values
            for (var key in item.values) {
                item.values[key].selected = false;
            }

            // if value is a boolean then convert it to string
            value = (value !== "undefined" && typeof value == "boolean") ? value.toString() : value;

            // Set current value
            if (value) {
                if (item.values[JSON.encode(value)]) {
                    item.values[JSON.encode(value)].selected = true;
                } else if (typeof value.rule === "object") {
                    item.values[JSON.encode("expression")].selected = true;
                }
            }
        }
    },

    /*
    *   Disable an item with a linked property
    */
    disableProperty: function (property) {
        var self = this;
        var item = self.properties[property];
        if (item) {
            item.disabled = true;
        }
    },

    /*
    *   Enable an item with a linked action
    */
    enableAction: function (action) {
        var self = this;
        var item = self.actions[action];
        if (item) {
            item.disabled = false;
        }
    },

    /*
    *   Disable an item with a linked action
    */
    disableAction: function (action) {
        var self = this;
        var item = self.actions[action];
        if (item) {
            item.disabled = true;
        }
    },

    /*
    *   Check an item with a linked action
    */
    checkAction: function (action) {
        var self = this;

        var item = self.actions[action];
        if (item) { item.checked = true; }
    },

    /*
    *   Unckeck an item with a linked action
    */
    uncheckAction: function (action) {
        var self = this;

        var item = self.actions[action];
        if (item) { item.checked = false; }
    },

    /*
    * Shows a group
    */
    showGroup: function (groupName) {
        var self = this;

        var group = self.groups[groupName];
        if (group)
            group.hide = false;
    },

    /*
    * Hides a group 
    */
    hideGroup: function (groupName) {
        var self = this;

        var group = self.groups[groupName];
        if (group)
            group.hide = true;
    },

    /*
    * Sets element's caption
    */
    setCaption: function (property, key) {
        var self = this;
        var item = self.properties[property];
        var result;

        if (item && $.isArray(item.elements) && item.elements.length > 0) {
            result = $.grep(item.elements, function (element, _) {
                if (element.value && element.value.key) { return (element.value.key === key); }
                else { return false; }
            });
        }

        if (result && result[0] && result[0].caption) {
            item.caption = result[0].caption;
        }
    }

})