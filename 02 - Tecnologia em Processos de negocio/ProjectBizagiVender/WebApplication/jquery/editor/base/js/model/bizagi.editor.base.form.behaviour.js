/*
*   Name: BizAgi FormModeler Editor Search Form Behaviour
*   Author: Diego Parra
*   Comments:
*   -   This script will define behavioral code for the search form in order to keep
*       the container code clean
*/

// Make sure the namespaces exists
bizagi.editor = bizagi.editor || { };
bizagi.editor.base = bizagi.editor.base || { };

/*
*   CONTAINER BEHAVIOUR OVERRIDES
*/
bizagi.editor.base.formBehaviour = {

    /*
    *   Check if an element is a button
    */
    isButtonElement: function (element) {

        return (element && element.type) ? (element.type == "formbutton") : false;
    },


    /*
    *   Adds a button to the last position
    */
    addButton: function (element) {
        var self = this;

        // Add to buttons
        element.position = self.buttons.length;
        self.buttons.push(element);
        element.setParent(self);
        return element;
    },

    /*
    *   Move an element between the container
    */
    moveElement: function (posIni, posEnd, parent, elementType) {
        var self = this;

        if (elementType != "button") {
            // Check in elements
            return self._super(posIni, posEnd, parent);
        } else {
            // Check in buttons    
            self.buttons.move(posIni, posEnd);
            return this;
        }
    },

    /* 
    *   Gets the element with the especified guid and return it 
    */
    getElement: function (guid) {
        var self = this;

        // Search in elements
        var result = self._super(guid);

        if (!result && self.buttons) {
            // Search in buttons
            for (var i = 0; i < self.buttons.length; i++) {
                var button = self.buttons[i];
                if (button.guid == guid) {
                    // Element found
                    button.position = self.buttons.indexOf(button);
                    return button;
                }
            }
        }

        return result;
    },
    
    /*
    *   Find the element with the especified guid and removes this.
    */
    removeElementById: function (guid) {
        var self = this;
        var element = self.getElement(guid);
        if (element == null) return null;

        if (!self.isButtonElement(element)) {
            // Check in elements
            return self._super(guid);
        } else {
            // Check in buttons
            self.buttons.splice(element.position, 1);
            return element;
        }
    },

    /*
    *   Remove the element with the especified position and parent
    */
    removeElement: function (position, parent, element) {
        var self = this;

        // Remove from elements
        if (!self.isButtonElement(element)) {
            return self._super(position, parent);
        }

        // remove from buttons
        self.buttons.splice(position, 1);
        return element;
    }
}