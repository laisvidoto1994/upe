/*
*   Name: BizAgi Render Layout Render Class
*   Author: Andrés Fernando Muñoz
*   Comments:
*   -   This script will define a base layout render class with common stuff related to all renders
*/

bizagi.rendering.render.extend("bizagi.rendering.layoutRender", {}, {
	/*
	 *   Returns the html templated element
	 */
	renderElement: function (template) {
		var self = this;
		var properties = self.properties;
		var form = self.getFormContainer();
		// Start rendering deferred
		self.renderingDeferred = new $.Deferred();

		// Set render template
		template = template || "render-layout";
		var renderTemplate = self.renderFactory.getTemplate(template);

		// Resolve render label
		var label = properties.displayName;
		if (typeof label == "string") {
			label = label.replaceAll("&", "&amp;");
			label = label.replaceAll("$", "&#36;");
			label = label.replaceAll("<", "&lt;").replaceAll(">", "&gt;");
			label = label.replaceAll("\"", "&#34;").replaceAll("'", "&#39;").replaceAll("/", "&#47;");
			label = label.replaceAll("\\n", "<br/>");
			label = label.replaceAll("\n", "<br/>");
		}

		var labelWidth = parseFloat(properties.labelWidth);
		// Render template
		var html = $.fasttmpl(renderTemplate, {
			label: label,			
			isExtendedText: (properties.type == "text" && properties.isExtended),
			orientation: properties.orientation,
			uniqueId: properties.uniqueId,
			id: properties.id,			
			isDesign: self.getMode() === "design",
			messageValidation: properties.messageValidation,
			printVersion: form.params.printversion,
			cssClass: properties.cssclass || "",
			hide: properties.hide
		});

		// Render internal control html
		var result = self.internalRenderControl();
		if (!result) {
			result = "";
		}

		// Check if this is an async element or not
		var async = typeof (result) === "object" && result.done;
		if (!async) {
			html = self.replaceControlHtml(html, result);

		} else {
			if (result.state() === "resolved") {
				// Fetch resolved result
				html = self.replaceControlHtml(html, self.resolveResult(result));
				self.asyncRenderDeferred = null;
			} else {
				// Wait for result
				self.asyncRenderDeferred = result;
				html = self.replaceControlHtml(html, "");
			}
		}

		return html;
	},

    /*
    *   Template method to get the control element
    */
	getControl: function () {
	    var self = this;
	    if (!self.control || (self.control instanceof jQuery && self.control.length === 0)) {
	        self.control = self.element;
	    }
	    if (!self.control || self.control.length == 0) {
	        return null;
	    }
	    return self.control;
	},

    /*
    * Customizes the font italic style *
    */
	changeFontItalic: function (italic) {
	    var self = this;

	    if (bizagi.util.parseBoolean(italic)) {
	        self.getControl().css("font-style", "italic", "!important");
	    } else {
	        self.getControl().css("font-style", "normal", "!important");
	    }
	},

    /*
    * Customizes the font underline
    */
	changeFontUnderline: function (underline) {
	    var self = this,
	        valueFormat = self.properties.valueFormat || {},
	        valuestrikethru = bizagi.util.parseBoolean(valueFormat.strikethru) ? "line-through " : "";

	    if (bizagi.util.parseBoolean(underline)) {
	        self.getControl().css("text-decoration", valuestrikethru + "underline", "!important");
	    } else {
	        self.getControl().find("*").each(function (i, element) {
	            $(element).css("text-decoration", valuestrikethru, "!important");
	        });
	    }
	}
});