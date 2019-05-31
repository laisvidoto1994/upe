/*
 *   Name: BizAgi Render Layout Simple Link Class
 *   Author: Ricardo Pérez
 *   Comments:
 *   -   This script will define basic stuff for non editable link renders inside templates
 *   -   This control is based on the link render control
 */

bizagi.rendering.layoutLink.extend("bizagi.rendering.layoutLink", {}, {
    /*
     *   Template method to implement in each children to customize each control
     */
    renderSingle: function () {
        var self = this;
        var container = self.getContainerRender();
        container.addClass("bz-command-not-edit");
        self.value = undefined;
    },

    postRenderSingle: function(){
        var self= this;
        var element = self.element;
        if (element){
            element.on("click", $.proxy(self.onClickElement, self));
        }
    },

    onClickElement: function(){
        var self = this,
            params = {
                "displayName": self.properties.displayName,
                "navigateFromRender": false,
                "reference": self.properties.reference,
                "referenceType": self.properties.referenceType,
                "xpath": self.properties.xpath
            };
        if (bizagi.kendoMobileApplication && bizagi.kendoMobileApplication.view().id == "#renderSplitView"){
            params.navigateFromRender = true;
        }
        self.triggerGlobalHandler("DATA-NAVIGATION", params);
    }
});