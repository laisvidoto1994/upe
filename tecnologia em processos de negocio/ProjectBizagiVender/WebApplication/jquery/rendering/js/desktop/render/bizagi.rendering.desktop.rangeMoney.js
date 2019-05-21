/**
 * Desktop definition of range money control
 *
 * @author: Andr�s Fernando Mu�oz
 */

bizagi.rendering.rangeMoney.extend("bizagi.rendering.rangeMoney", {}, {

	/**
	 * Render a specific implementation for Desktop device
	 */
	postRender: function() {
        var self = this;
        self.defineRangeControl();
	},

	/**
	 * Render actual value of control and set events
	 * @param data
	 */
	setDisplayValue: function(data) {
		var self = this;
		var control = self.getControl();
	}
});