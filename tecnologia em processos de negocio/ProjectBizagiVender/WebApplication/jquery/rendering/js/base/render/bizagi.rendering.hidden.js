/*
*   Name: BizAgi Render Hidden Class
*   Author: Diego Parra
*   Comments:
*   -   This script will define basic stuff for hiddens
*/

bizagi.rendering.render.extend("bizagi.rendering.hidden", {}, {

    /*
    *   Returns the in-memory processed element
    */
    renderControl: function () {
        var self = this;
        if (self.getMode() === "design") {
            return "<div>" + bizagi.localization.getResource("render-hidden-displayName") + "</div>";
        } else {
            return "<div />";
        }
    },

    /*
    *   Template method to implement in each device to customize each render after processed
    */
    postRender: function () {
        var self = this;
        var properties = self.properties;

        // Call base
        self._super();

        // Set the initial value
        if (properties.value !== undefined) {
            self.setDisplayValue(properties.value);
        }
    }

});
