/*
*   Name: BizAgi FormModeler Editor Element
*   Author: Alexander Mejia, Diego Parra
*   Comments:
*   -   This script will define basic stuff for element
*/

bizagi.editor.base.render.extend("bizagi.editor.base.internal", {}, {

    /*
    *   Constructor for base element
    */
    init: function (data, elementFactory, regenerateGuid) {

        var self = this;

        // Call base
        self._super(data, elementFactory, regenerateGuid);        

    },
    
    /*
    *   Extension method to add properties when create a JSON for rendering
    */
    
    getRenderingProperties: function () {
        var self = this;
        var properties = self._super();

        properties.isInternal = true;

        return properties;
    },

    /*
    * Returns if the element is internal 
    * ex. queryapplication, queryprocesses, etc
    */
    isInternal: function () {
        return true;
    }
    

});



