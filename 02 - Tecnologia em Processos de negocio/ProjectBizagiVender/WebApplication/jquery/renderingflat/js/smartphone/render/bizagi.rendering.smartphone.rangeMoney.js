/**
 * Desktop definition of range money control
 *
 * @author: Andr�s Fernando Mu�oz
 */

bizagi.rendering.rangeMoney.extend("bizagi.rendering.rangeMoney", {}, {

	/**
	 * Render a specific implementation for Desktop device
	 */
	postRenderSingle: function() {
        var self = this;
        self.getArrow().hide();
        self.defineRangeControl();
    }
});