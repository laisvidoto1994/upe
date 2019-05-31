/**
 * Name: BizAgi Desktop Render Link Extension
 * Author: Andrés Fernando Muñoz
 * Comments:
 * -   This script will redefine the non editable link render class to adjust to desktop devices
 * -   This control is based on the link render control
 */
bizagi.rendering.layoutLink.extend("bizagi.rendering.layoutLink", {}, {
    /**
     * Template method to implement in each device to customize each render after processed
     */
    postRender: function () {
        var self = this;
        var element = self.element;

        // Call base
        self._super();
        if (element) {
            $(element).on('click', $.proxy(self.onClickElement, self));
        }
    },
    /**
     *
     */
    onClickElement: function () {
        var self = this;
        var properties = self.properties || {};
        var args = {
            displayName: properties.displayName,
            reference: properties.reference,
            referenceType: properties.referenceType,
            xpath: properties.xpath,
            contextEvent: self.getFormContainer().getContextEvent()
        };
        self.triggerGlobalHandler("DATA-NAVIGATION", args);
    }
});
