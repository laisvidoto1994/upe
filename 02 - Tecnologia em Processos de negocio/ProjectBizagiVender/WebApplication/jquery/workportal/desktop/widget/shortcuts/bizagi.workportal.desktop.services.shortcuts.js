/**
 * Bizagi Workportal Desktop My Shortcuts
 *
 * @author Danny González
 */
bizagi.workportal.services.service.extend('bizagi.workportal.services.service', {}, {
	/**
	 * Return an array with the data related to My Shortcuts
	 * @return {*}
	 */
	getMyShortcuts: function(params) {
		var self = this;
		var data = {};
		var url = self.serviceLocator.getUrl("handler-get-myShortcuts");

		if (params && params.icon && typeof params.icon !== "undefined" ) {
            data.icon = true;
        }

		// Call ajax and returns promise
		return $.read(url, data);
	},

	/**
	 * Get my shorcuts grouped by category
	 * @return {*}
	 */
	getMyShortcutsByCategory: function(params) {
		var self = this;
		var def = new $.Deferred();
		var categories = [];

		var getCategory = function (category) {
			var node = {};
			$.each(categories, function(key, value) {
				if(value.category == category) {
					node = value;
				}
			});
			return node;
		};

		self.getMyShortcuts(params).done( function(response) {
			// Create category
			$.each(response, function(key, value) {
				var category = getCategory(value.classification.displayName);
				var shortcut = {
					"displayName": value.displayName,
					"idProcess": value.idProcess,
					"icon": (typeof value.icon !== "undefined") ? value.icon : null,
					"showConfirmation": value.showConfirmation
				};
				if ($.isEmptyObject(category)) {
					// Add node
					categories.push({
						"category": value.classification.displayName,
						"items": [shortcut]
					});
				}
				else {
					category.items.push(shortcut);
				}
			});
			def.resolve(categories);
		});
		return def.promise();
	}
});