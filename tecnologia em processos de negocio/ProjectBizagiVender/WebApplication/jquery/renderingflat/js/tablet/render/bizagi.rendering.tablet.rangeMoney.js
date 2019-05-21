/**
 * Desktop definition of range money control
 *
 * @author: Andrés Fernando Muñoz
 */

bizagi.rendering.rangeMoney.extend("bizagi.rendering.rangeMoney", {}, {

	/**
	 * Render a specific implementation for Desktop device
	 */
	postRender: function() {
		var self = this;

		var minControl = new bizagi.rendering.money(self.getRenderProperties("min"));
		var maxControl = new bizagi.rendering.money(self.getRenderProperties("max"));

		self.setRanageControls(minControl, maxControl);
	},

	getRenderProperties: function (typeRangeControl){
		var self = this;
		var form = self.getFormContainer();
		var properties = self.properties;

		var renderProperties = {
			data: {
				properties: {
					"id": properties.id,
					"xpath": properties.xpath
				}
			},
			mode: "execute",
			parent: form,
			renderFactory: self.renderFactory,
			resources: bizagi.localization,
			dataService: self.dataService
		};

		if (typeRangeControl === "min"){
			renderProperties.data.properties.displayName = "From";
		}else{
			renderProperties.data.properties.displayName = "To";
		}

		return renderProperties;
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