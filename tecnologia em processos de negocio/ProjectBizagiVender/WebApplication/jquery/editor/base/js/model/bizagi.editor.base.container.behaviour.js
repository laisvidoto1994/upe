/*
*   Name: BizAgi FormModeler Editor Container Behaviour
*   Author: Alexander Mejia, Diego Parra
*   Comments:
*   -   This script will define behavioral code for the containers in order to keep
*       the container code clean
*/

// Make sure the namespaces exists
bizagi.editor = bizagi.editor || { };
bizagi.editor.base = bizagi.editor.base || { };

bizagi.editor.base.containerBehaviour = {


    /*
    *   Adds an element to the last position of the container
    */
    addElement: function (element, parent) {
        var self = this;
        var container = parent ? self.getElement(parent) : this;

        element.position = container.elements.length;
        container.elements.push(element);
        element.setParent(container);
        return element;
    },

    /*
    *   Remove to element in the last position of container
    */
    removeLastElement: function (parent) {
        var self = this;
        var container = parent ? self.getElement(parent) : this;

        return container.elements.pop();
    },

    /* 
    *   Gets the element with the especified guid and return it 
    */
    getElement: function (guid) {
        var self = this;

        if (self.guid == guid) {
            self.position = 0;
            return self;
        } else {
            for (var i = 0, l = self.elements.length; i < l; i += 1) {
                var childElement = self.elements[i];
                if (childElement.guid == guid) {
                    // Element found
                    childElement.position = self.elements.indexOf(childElement);
                    return childElement;
                }
                if (childElement.elements) {
                    // Search on children
                    var foundElement = childElement.getElement(guid);
                    if (foundElement) return foundElement;
                }
            }
        }

        return null;
    },


    /* 
    *   Gets the element with the especified guid and return it 
    */
    getElementByOldGuid: function (guid) {
        var self = this;

        if (self.oldGuid == guid) {
            self.position = 0;
            return self;
        } else {
            for (var i = 0, l = self.elements.length; i < l; i += 1) {
                var childElement = self.elements[i];
                if (childElement.oldGuid == guid) {
                    // Element found
                    childElement.position = self.elements.indexOf(childElement);
                    return childElement;
                }
                if (childElement.elements) {
                    // Search on children
                    var foundElement = childElement.getElementByOldGuid(guid);
                    if (foundElement) return foundElement;
                }
            }
        }

        return null;
    },

    /*
    *   Move an element between the container
    *   elementType = render here always
    */
    moveElement: function (posIni, posEnd, parent, elementType) {
        var self = this;
        var element = self.getElement(parent);

        if (element == null) return null;
        element.elements.move(posIni, posEnd);
        return element;
    },

    /*
    *   Remove the element with the especified position and parent
    */
    removeElement: function (position, parent) {
        var self = this;
        var container = parent ? self.getElement(parent) : this;

        if (container == null) return null;
        container.elements.splice(position, 1);
        return container;
    },

    // Find the element with the especified guid and removes this.
    removeElementById: function (guid) {
        var self = this;
        var element = self.getElement(guid);

        if (element == null) return null;

        var parent = self.getElement(element.parent.guid);

        if (parent == null) return null;

        parent.elements.splice(element.position, 1);
        
        return element;
    },

    /*
    *   Find the element with the especified position and parent
    */
    findElementByPosition: function (position, parent) {
        var self = this,
		    container = self.getElement(parent);

        if (container == null) return null;
        return container.elements[position];
    },

    /*
    *   Insert element(render) in the especified position and parent
    */
    insertElement: function (position, parent, element) {
        var self = this,
		    container = self.getElement(parent);

        if (container == null) return null;
        container.elements.splice(position, 0, element);
        element.setParent(container);
        return element;
    },

    /*
    *   Changes a property for a element in the model
    */
    changeProperty: function (guid, property, value) {
        var self = this,
		    element;

        element = self.getElement(guid);
        if (element == null) return null;

        // Assign the property
        element.assignProperty(property, value);

        return element;
    },

    // Find one element based on their guid and replace it with the newElement
    // @ return removed element
    updateElementByPosition: function (position, parent, newElement) {
        var self = this,
		    container = self.getElement(parent);


        if (container == null) return null;
        var oldElement = container.elements.splice(position, 1);
        container.elements.splice(position, 0, newElement);

        return oldElement;
    },

    findPositionOfElementInFormById: function (guid, position) {
        var self = this,
		    result = { position: position, found: false };

        if (self.guid === guid) {
            return true;
        }

        for (var i = 0; i < self.elements.length; i++) {
            position += 1;
            result = self.elements[i].findPositionOfElementInFormById(guid, position);

            if (result.found) {
                break;
            }
            position = result.position;
        }

        return result;
    },

    /*
    *   Replaces an element model with a new one
    */
    replaceElement: function (guid, newElement) {
        var self = this;
        var grid = self.removeElementById(guid);
        var parent = grid.parent;

        self.insertElement(grid.position, parent.guid, newElement);
    }
};

    