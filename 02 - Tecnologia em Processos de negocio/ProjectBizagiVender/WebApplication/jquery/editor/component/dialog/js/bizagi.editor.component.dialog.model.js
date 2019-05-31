/*
*   Name: BizAgi FormModeler Editor Dialog Editor Model
*   Author: Alexander Mejia
*   Comments:
*   -   This script will define basic stuff to dialogs
*/

bizagi.editor.observableClass.extend("bizagi.editor.component.dialog.model", {}, {

    /*
    *   Constructor
    */
    init: function(data) {
        var self = this;

        // Call base
        self._super();

        self.events = {};
        self.processData(data);

    },

    /*
    *  
    */
    processData: function(data) {
        var self = this;

        self.model = data;

        if (data.buttons) {
            $.each(data.buttons, function(_, button) {
                button.icon = button.text ? button.text.toLowerCase() : "";
                button.style = button.style ? button.style : "";
                if (typeof button.click === "function") {
                    self.events[button.text] = button.click;
                }
            });
        }
    },

    /*
    * Returns current model
    */
    getModel: function() {
        return this.model;
    },
    /*
    * Returns dialog name
    */
    getName: function() {
        return this.model.name;
    },
    /*
    * Returns dialog title
    */
    getTitle: function() {
        return this.model.title;
    },

    getStyle: function() {
        return this.model.style;
    },

    /*
    *  Return click event
    */
    getClickEvent: function (key) {
        var self = this;

        return self.events[key];
    }

});