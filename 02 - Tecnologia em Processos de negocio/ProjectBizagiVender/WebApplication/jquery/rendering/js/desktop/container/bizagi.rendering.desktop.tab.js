/*
*   Name: BizAgi Desktop Tab Container Extension
*   Author: Diego Parra
*   Comments:
*   -   This script will redefine the container class to adjust to desktop devices
*/

// Auto extend
bizagi.rendering.tab.extend("bizagi.rendering.tab", {}, {

    /* 
    *   Template method to implement in each device to customize each container after processed
    */
    postRenderContainer: function (tab) {
        var self = this;

        // Call base
        self._super(tab);

        // Apply tabs widget
        tab.tabs({
            active: self.activeTab,
            activate: function (event, ui) {
                self.children[self.activeTab].visibleTab(); 
                // BUGFIX for grids inside tabs
                setTimeout(
            		function () {
            		    self.resize({ width: self.container.width(), height: self.container.height() });
            		    if (typeof (self.getParams()) != "undefined")
            		        if (self.getParams().context == "sharepoint" || window.self !== window.top)
            		            self.resizeInPopUpHTML();
            		}, 50
            	);
            },
            beforeActivate: function (event, ui) {
                var index = ui.newTab.index();
                self.triggerHandler("selected", { index: index, tab: self.children[index] });
                if (self.children[index]) {
                    var form = self.getFormContainer();
                    self.children[index].activate();
                    self.activeTab = index;
                    var selectedTab = {};
                    selectedTab[self.children[index].parent.properties.id] = index;
                    form.setParam("selectedTabs", selectedTab);
                }
            }
        });

    },
    resizeInPopUpHTML: function () {
        var self = this;
        if ($(".activitiFormContainer").length > 0) {
            var heightActivitiFormContainer = $(".activitiFormContainer").height() || 0;
            var renderForm = $(".activitiFormContainer #ui-bizagi-webpart-render-container");
            var buttonContainer = $(".ui-bizagi-button-container", ".activitiFormContainer");
            var params = self.getParams();
            if (params.idWorkitem || buttonContainer.length > 0) {
                //display buttons
                var heightButtonContainer = buttonContainer.height() || 0;
                renderForm.height(heightActivitiFormContainer - 110 - heightButtonContainer);
            }
            else {
                //NOT display buttons
                renderForm.height(heightActivitiFormContainer - 110);
            }
        }
    },
    /*
    *   Template method to implement in each device to customize the container's behaviour to show layout
    */
    configureLayoutView: function () {
        // Do nothing
    }
});
