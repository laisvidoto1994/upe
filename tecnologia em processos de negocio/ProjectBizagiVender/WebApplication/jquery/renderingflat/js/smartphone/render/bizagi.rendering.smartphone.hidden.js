/*
*   Name: BizAgi smartphones Render Hidden Extension
*   Author: RicharU based on Diego Parra
*   Comments:
*   -   This script will redefine the hidden render class to adjust to smartphone devices
*/

// Extends itself
bizagi.rendering.hidden.extend("bizagi.rendering.hidden", {}, {
    /**
     * Returns the html templated element
     * @returns {} 
     */
    render: function () {
        var self = this;

        return self.renderSingle();
    },

    /**
     * Returns the in-memory processed element
     * @returns {} 
     */
    renderSingle: function () {
        var self = this;
        if (self.getMode() === "design") {
            return "<div>" + bizagi.localization.getResource("render-hidden-displayName") + "</div>";
        } else {
            return "<div />";
        }
    },

    /**
     * Template method to implement in each device to customize each render after processed
     * @returns {} 
     */
    postRenderSingle: function () {
        var self = this;
        var properties = self.properties;

        // Call base
        self._super();

        // Set the initial value
        if (properties.value !== undefined) {
            self.setDisplayValue(properties.value);
        }
    },

    /**
     * Sets the value in the rendered control
     * @param {} value 
     * @returns {} 
     */
    setDisplayValue: function (value) {
        var self = this;
        self.setValue(value, false);
    }

});
