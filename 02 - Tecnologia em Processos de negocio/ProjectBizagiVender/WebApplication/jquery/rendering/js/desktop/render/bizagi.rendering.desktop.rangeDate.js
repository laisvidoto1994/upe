/**
 * Desktop definition of range date control
 *
 * @author: Andr�s Fernando Mu�oz
 */

bizagi.rendering.rangeDate.extend("bizagi.rendering.rangeDate", {}, {

    /**
     * Render a specific implementation for Desktop device
     */
    postRender: function () {
        var self = this;
        self.defineRangeControl();
    }
});