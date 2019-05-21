bizagi.rendering.container.extend("bizagi.rendering.layout", {}, {

	/**
	 * Get html template
	 * @return {*}
	 */
	getTemplate: function() {
	    var self = this;
	    var mode = self.getMode();
	    var html = self.properties.html || "";

        // Add a container, this is important in design to calculate the scroll 
	    if (mode == 'design' && html) {
            html = "<div class='bz-design-template'>" + html + "</div>"
	    }
		
		return bizagi.util.stripslashes(html);
	},

	/**
	 * Get string css of layout container
	 * @return {*}
	 */
	getCss: function() {
	    var self = this;
		var css = self.properties.css || ""

		var mode = self.getMode();
		if (mode == "design") {
		    css = css && css.desktop;
		}

		return bizagi.util.stripslashes(css);
	},


	/*
	 *   Template method to process each jquery object
	 *   must be overriden in each container
	 */
	postRenderContainer: function(container) {
		var self = this;
		var properties = self.properties;
		var mode = self.getMode();

		// Resolve rendering deferred
		if(self.renderingDeferred)
			self.renderingDeferred.resolve();

		// Process children elements
		self.container = container;
		self.executeChildrenPostRender(container);

		if(mode == "execution") {
			// Apply handlers
			self.configureHandlers();
		}
		if(mode == "design") {
			// Configure view
			self.configureDesignView();
		}
		if(mode == "layout") {
			// Configure view
			self.configureDesignView();
			self.configureLayoutView();
		}
	}
});