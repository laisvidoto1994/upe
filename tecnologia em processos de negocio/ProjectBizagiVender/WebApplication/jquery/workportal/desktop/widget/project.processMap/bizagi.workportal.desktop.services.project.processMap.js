/**
 * Extend service for Process Map
 */
bizagi.workportal.services.service.extend("bizagi.workportal.services.service", {}, {
	getActivityMap: function(params) {
		var self = this;
		var url = self.serviceLocator.getUrl("activity-map");
		var data = {};
		(params.radNumber) ? data.radNumber = params.radNumber : "";
		return $.read({
			url: url,
			data: data
		});
	},
	/*
	 * Get activity information
	 * */
	getActivitySummary: function(params) {
		var self = this;
		// Define data
		var data = {};
		data["guidWorkitem"] = params.guidWorkitem;

		// Call ajax and returns promise
		return $.ajax({
			url: self.serviceLocator.getUrl("activity-map-getActivitySummary"),
			data: data,
			type: "GET",
			dataType: "json"
		});
	},

	getSubProcessMap: function(params) {
		var self = this;
		var url = self.serviceLocator.getUrl("subprocess-map");
		var data = {};
		params = params|| {};
		(params.radNumber) ? data.radNumber = params.radNumber : "";

		return $.read({
			url: url,
			data: data
		});
	}
});