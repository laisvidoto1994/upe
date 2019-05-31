/**
 * Desktop definition of range number control
 *
 * @author: Andr�s Fernando Mu�oz
 */

bizagi.rendering.rangeNumber.extend("bizagi.rendering.rangeNumber", {}, {

	/**
	 * Render a specific implementation for Desktop device
	 */
	postRender: function() {
        var self = this;
        self.defineRangeControl();
	}
});