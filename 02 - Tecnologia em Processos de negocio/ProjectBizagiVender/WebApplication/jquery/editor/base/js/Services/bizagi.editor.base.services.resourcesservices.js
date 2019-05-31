bizagi.editor.base.services.resourcesServices = (function () {
	function ResourcesServices() {
		this._managerServices = bizagi.editor.base.services.Manager;
		this._endPointHelper = bizagi.editor.base.services.EndPointsHelper;
		this.batch = {};
		this.batchTimer = 50;
	}

	
	ResourcesServices.prototype.getResource = function (basrequest) {
	    return this._managerServices.requestRestService(basrequest,
            this._endPointHelper.getResource())
            .done(function (data) {
                return ($.isArray(data)) ? data[0] : data;
            });
	}

	ResourcesServices.prototype.getMultiResources = function (basrequest) {
	    return this.addResource(basrequest);
	}

	ResourcesServices.prototype.addResource = function (basrequest) {
	    var self = this;
	    var deferred = new $.Deferred();

	    // First clear previous timeout
	    clearTimeout(self.batchTimeout);
	    var tag = basrequest.tag = Math.guid();
	    var singleRequest = { request: basrequest, deferred: deferred };
	    self.batch[tag] = singleRequest;

	    // Start a new timeout
	    self.batchTimeout = setTimeout(function () {
	        self.fire();
	    }, self.batchTimer);

	    return deferred.promise();
	}
	
	ResourcesServices.prototype.fire = function () {
	    var self = this;
	    var batch = {};
	    var defer = new $.Deferred();
	    
	    // Prepare actions and clone batch manually
	    var actions = [];
	    $.each(self.batch, function (tag, item) {
	        actions.push(item);
	        batch[tag] = item;
	    });

	    // Reset batch
	    self.batch = {};

	    this._managerServices.requestRestService(actions, this._endPointHelper.getMultiResources())
           .done(function (responses) {
               // Process each response
               $.each(responses, function (i, item ) {
                   var response = item.response;
                   var tag = response.tag;
                   if (!response.error) {
                       batch[tag].deferred.resolve(response);
                   } else {
                       batch[tag].deferred.reject(response.error);
                   }

                   // Remove paired tag from collection
                   delete batch[tag];
               });
           });

	    return defer.promise();

	}

	
	return new ResourcesServices();
})();




