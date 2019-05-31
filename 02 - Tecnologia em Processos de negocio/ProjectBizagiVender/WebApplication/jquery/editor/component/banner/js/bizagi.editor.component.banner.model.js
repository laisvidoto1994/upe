/*
 * Author : Ramiro Gomez
 * Date   : 05 Oct 2012
 * Comments:
 *     Define the model of the banner component
 *
 */

$.Class.extend("bizagi.editor.component.banner.model", {
	/*
	 *   @static
	 *   Return the model for a specified control
	 */
	getBannerModel: function() {
		var self = this;
		var model = this.model = {"banner": {
			"displayname": bizagi.localization.getResource("formmodeler-component-banner-store-legend"),
			"cite": bizagi.localization.getResource("formmodeler-component-banner-store-cite"),
			"icon": "mtool-item-more-controls",
			"on": true
		}
		};

		return model;
	}
});
