/**
 * Smartphone definition of range date control
 *
 * @author: Ricardo Perez
 */

bizagi.rendering.rangeDate.extend("bizagi.rendering.rangeDate", {}, {

    /**
     * Render a specific implementation for Desktop device
     */
    postRenderSingle: function () {
        var self = this;
        self.getArrow().hide();

        self.defineRangeControl();
    }
});