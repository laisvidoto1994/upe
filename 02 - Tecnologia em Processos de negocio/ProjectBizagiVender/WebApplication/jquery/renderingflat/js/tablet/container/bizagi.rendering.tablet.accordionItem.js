/*
*   Name: BizAgi Tablet Panel Extension
*   Author: Diego Parra
*   Comments:
*   -   This script will redefine the container class to adjust to tablet devices
*/

// Auto extend
bizagi.rendering.accordionItem.extend("bizagi.rendering.accordionItem", {}, {


    /* 
    *   Change selected item 
    */
    setAsActiveContainer: function (argument) {
        
    },

    /* 
    *   Focus on container
    */
    focus: function () {
        var self = this;

        self.setAsActiveContainer();

        // Call base
        this._super();
    }        
});
