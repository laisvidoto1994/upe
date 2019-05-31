/*
*   Name: BizAgi Workportal Main Controller
*   Author: Richar Urbano
*   Comments:
*   -   This script will define a base class to handle workportal layouts for any device
*/

bizagi.workportal.controllers.controller.extend("bizagi.workportal.controllers.controller", {}, {
    /*
    *   Returns the component replaced tag selector
    */
    getComponentContainer: function(component) {
        var self = this;
        var content = self.getContent();
        if (!content || content.length == 0) return null;

        // Find component parent and cache it
        var componentElement = self.componentContainers[component];
        if (componentElement == null) {
            // Find the component inside the main content
            componentElement = $(self.getComponentSelector(component), content);

            // If still not found, try to check if content element is the component
            if (componentElement.length == 0 && content.is(self.getComponentSelector(component))) {
                componentElement = content;
            }

            // Cache the component
            self.componentContainers[component] = componentElement;
        }
        return self.componentContainers[component];
    },

    /*
    * Gets template 
    */
    getTemplate: function(name) {
        var self = this;

        return self.workportalFacade.getTemplate(name);
    }

});
