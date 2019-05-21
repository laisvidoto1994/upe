/*
*   @tittle: BizAgi FormModeler Editor Hacks Rendering element
*   @authors: David Montoya
	@date: 02-mar-12
*   @Comments:
*   -   This script will define basic stuff for enable the rendering element
*		in the formModeler
*/
bizagi.rendering.element.original = $.extend(true, {}, bizagi.rendering.element.prototype);
$.extend(bizagi.rendering.element.prototype, {

    /*
    *   Check if the current element is inside a nested form
    */
    isContainedInNestedForm: function () {
        var self = this;

        // If the element has no parent, we are in the root element
        if (!self.parent) return false;

        // If the parent is nested form, this element is contained in a nested form
        if (self.parent.properties.type === "nestedForm") return true;

        // If the parent is collectionnavigator, this element is contained in a collectionnavigator control
        if (self.parent.properties.type === "collectionnavigator") return true;

        // If the element has a parent, then check in parent recursively
        return self.parent.isContainedInNestedForm();
    },


    /*
    *   Check if the current element is inside a collection navigator
    */
    isContainedInCollectionNavigator: function () {
        var self = this;

        var form = self.getFormContainer();
        var properties = form.properties;

        return properties.isNavigationForm || false;
    },

    /*
     * Returns true if the element is a column of a grid 
    */
    isContainedInGrid: function () {
        var self = this,
            column = self.column;

        return (column != undefined);

    },


    /*
    * This method returns true if the current form is read only
    */
    isReadOnlyForm: function () {
        var self = this;

        var form = self.getFormContainer() || {};
        var properties = form.properties || {};
        if (properties.isReadOnly) {
            return true;
        }

        return false;
    },

    /*
    *   Finds an element by guid
    */
    findElement: function (guid) {
        var self = this;
        if (!guid) { return null; }

        if (self.properties.guid === guid) {
            // Element found
            return this;
        }

        // Element not found
        return null;
    },

    /*
    *  Selects the current element
    */
    selectElement: function () { },

    /*
    *  Un-selects the current element
    */
    unselectElement: function () { }

});