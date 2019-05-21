/*
*   Name: BizAgi Smartphone Panel Extension
*   Author: Diego Parra
*   Comments:
*   -   This script will redefine the container class to adjust to Smartphone devices
*/

// Auto extend
bizagi.rendering.tabItem.extend("bizagi.rendering.tabItem", {}, {

    setAsActiveContainer: function (argument) {
     /*   var self = this;

        $.when(self.ready())
    	.done(function () {
    	    // Changes item
    	    var tabContainer = self.parent;
    	    tabContainer.container.tabs("select", self.container.attr("id"));
    	});*/
    },

    /* 
    *   Focus on container
    */
    focus: function () {
        var self = this;

        // Set this tab as an active container
      //  self.setAsActiveContainer();

        // Call base
        this._super();
    }



});
