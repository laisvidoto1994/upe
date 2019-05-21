
/*
 *   Name: BizAgi Workportal Action
 *   Author: Diego Parra
 *   Comments:
 *   -   This script will define a base class to process workportal actions in order to take decisions
 */

bizagi.workportal.controllers.controller.extend("bizagi.workportal.actions.action", {
	    BIZAGI_WORKPORTAL_ACTION_ROUTING: "routing",
        BIZAGI_WORKPORTAL_ACTION_SEARCH : "search"
    }, {
        
        /*
         *   Makes the base processing of the layout (mix templates + data)
         *   after all that processing will call a post-render method to
         *   be implemented in each device to apply custom plugins
         *   Returns a promise because the rendering could be asynchronous
         */
        render: function () {
            bizagi.assert(false, "An action can't be rendered because it has no view");
        },
                    
            
        /*
         *   To be overriden in each device to apply layouts
         */
        postRender: function(){ 
            bizagi.assert(false, "An action can't be rendered because it has no view");
        },
            
        /*
         *   Executes the action
         *   Could return a deferred
         */
        execute: function(){
            // Override in implementations
        }
});
