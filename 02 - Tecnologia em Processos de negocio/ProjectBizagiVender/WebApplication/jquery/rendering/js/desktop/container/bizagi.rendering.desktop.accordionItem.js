/*
*   Name: BizAgi Desktop Panel Extension
*   Author: Diego Parra
*   Comments:
*   -   This script will redefine the container class to adjust to desktop devices
*/

// Auto extend
bizagi.rendering.accordionItem.extend("bizagi.rendering.accordionItem", {}, {


    /* 
    *   Change selected item 
    */
    setAsActiveContainer: function (argument) {
        var self = this;
    	
    	$.when(self.ready())
    	.done(function () {
            var accordionContainer = self.parent;

            // Changes item
            accordionContainer.container.accordion("option", "active", self.properties.ordinal);
        });
    },

    /* 
    *   Focus on container
    */
    focus: function () {
        var self = this;

    	self.activate();
        self.setAsActiveContainer();

        // Call base
        this._super();
    }        
});
