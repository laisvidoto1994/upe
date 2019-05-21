/**
 * Render a new type of form called template
 *
 * @author Edward Morales
 */
bizagi.rendering.form.extend("bizagi.rendering.formTemplate", {

    /**
     *   Constructor
     */
    init: function (params) {
        this._super(params);
        if(params.paramsRender && params.paramsRender.contextEvent){
            self.contextEvent = params.paramsRender.contextEvent;
        }
    },

	/**
	 * Process controls on template
	 * @param template
	 * @param controls
	 * @return {*}
	 */
	processTemplate: function(template, controls) {
	    var regexControl = /\{\{([\w:]*)\s*(\{["':,-\[\]\w\s]*\})\}\}/g;
		var regexRepeater = /\{\{(((repeater)\s*(\{["':,-\[\]\w\s]*\}))|([\/repeater]+:item)|(\/repeater)|(repeater)|(separator))\}\}/g;

		// Remove all repeaters key words
		var processedTemplate = template.replace(regexRepeater, "");

		// replace controls
		processedTemplate = processedTemplate.replace(regexControl, function(match, g1, g2, offset, string) {
		    var parameters = JSON.parse(g2);
            
			return controls[parameters.id] || '';
		});

	    processedTemplate = processedTemplate.replace(/{{([\w:]*)\s*}}/g, function() {
	        return '';
	    });


		return processedTemplate;
	},

	/**
	 * Render layout container
	 * @return {*}
	 */
	renderContainer: function() {
		var self = this;
		var layoutCollection = self.getRenderByType("layout");
		var layout = (layoutCollection.length > 0) ? layoutCollection[0] : {};
		var template = (typeof layout.getTemplate == "function") ? layout.getTemplate() : "";
		var css = (typeof layout.getCss == "function") ? layout.getCss() : "";
		var mode = self.getMode();
		var layoutGuid = self.properties.layoutguid || Math.guid();

		var controls = {};

		/**
		 * Render all elements within first layout container
		 */
		if(layout.children) {
			$.each(layout.children, function(i, child) {
			    // ignore layoutPlaceholder control in execution
			    if (!(mode == 'execution' && child.properties.type == 'layoutPlaceholder')) {

			        var type = child.getElementType();
			        if (type == bizagi.rendering.element.ELEMENT_TYPE_RENDER) {
			            controls[child.properties.id] = child.renderElement();
			        }
			        if (type == bizagi.rendering.element.ELEMENT_TYPE_CONTAINER) {
			            controls[child.properties.id] = child.renderContainerHtml();
			        }
			        self.childrenHash[child.properties.uniqueId] = child;
			    }
			});
		}

		// Load css
		bizagi.util.loadStyle(css, layoutGuid);

		return self.processTemplate(template, controls);
	},

    /**
     * Get the context in which loads the formTemplate
     *
     */
    getContextEvent: function(){
        return self.contextEvent;
    }
});
