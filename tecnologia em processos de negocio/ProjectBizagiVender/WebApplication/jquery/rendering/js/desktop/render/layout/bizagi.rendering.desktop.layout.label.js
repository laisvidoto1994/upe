/*
 *   Name: BizAgi Desktop Render Template Label Extension
 *   Author: Mauricio Sánchez
 *   Comments:
 *   -   This script will redefine the label render class inside templates to adjust to desktop devices
 */

// Extends itself
bizagi.rendering.layoutLabel.extend("bizagi.rendering.layoutLabel", {}, {

	setValue: function(val,triggerEvents) {
		var self = this;
		self.properties.displayName = val;
		this._super(val, triggerEvents);
		var control = self.getControl();
		if(control) {
			$(".ui-bizagi-render-label", control).text(val);
		}
	}
});
