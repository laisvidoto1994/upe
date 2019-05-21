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
bizagi.editor.base.searchFormBehaviour = {

    /*
    *   Check if an element is a result
    */
    isResultElement: function (element) {

        return (element.type.indexOf("columnResult") >= 0);
    },

    /*
    *   Adds an element to the last position of the container
    */
    addElement: function (element, parent) {
        var self = this;

        // Add to filters
        if (!self.isResultElement(element)) {
            return self._super(element, parent);
        }

        // Add to results
        element.position = self.result.length;
        self.result.push(element);
        element.setParent(self);
        return element;
    },

    /*
    *   Insert element(render) in the especified position and parent
    */
    insertElement: function (position, parent, element) {
        var self = this;

        // Add to filters
        if (!self.isResultElement(element)) {
            return self._super(position, parent, element);
        }

        self.result.splice(position, 0, element);
        element.setParent(self);
        return element;
    },

    /* 
    *   Gets the element with the especified guid and return it 
    */
    getElement: function (guid) {
        var self = this;

        // Search in elements
        var result = self._super(guid);

        if (!result) {
            // Search in results
            for (var i = 0; i < self.result.length; i++) {
                var resultColumn = self.result[i];
                if (resultColumn.guid == guid) {
                    // Element found
                    resultColumn.position = self.result.indexOf(resultColumn);
                    return resultColumn;
                }
            }
        }

        return result;
    },

    /*
    *   Move an element between the container
    */
    moveElement: function (posIni, posEnd, parent, elementType) {
        var self = this;

        if (elementType != "searchresult") {
            // Check in filters
            return self._super(posIni, posEnd, parent);
        } else {
            // Check in results    
            self.result.move(posIni, posEnd);
            return this;
        }
    },

    /*
    *   Find the element with the especified guid and removes this.
    */
    removeElementById: function (guid) {
        var self = this;
        var element = self.getElement(guid);
        if (element == null) return null;

        if (!self.isResultElement(element)) {
            // Check in filters
            return self._super(guid);
        } else {
            // Check in results    
            self.result.splice(element.position, 1);
            return element;
        }
    }
}