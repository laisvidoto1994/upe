/*
*   Name: BizAgi Tablet Render Extension
*   Author: Diego Parra
*   Comments:
*   -   This script will redefine the render class to adjust to tablet devices
*/

bizagi.rendering.render.extend('bizagi.rendering.render', {}, {


    /*
    *   Returns the in-memory processed element
    */
    postRender: function () {
        var self = this;
        // Call base
        self.configureHelpText();
        // return result; 
    },

    postRenderReadOnly: function () {
        var self = this;
        var container = self.getControl();

        // Call base
        self._super();

        self.configureHelpText();

        // Add styles readonly controls
        container.addClass("bz-rn-read-only");
    },

    configureHelpText: function () {
        var self = this;
        if (self.element) {
            self.element.find('.ui-bizagi-helptext').click(
            function () {
                var elementContainer = $(this);

                if (!elementContainer.data("active")) {
                    //Stores the flag for the current active tooltip
                    elementContainer.data("active", "true");

                    //Extracts the helptext data
                    var helpTextData = elementContainer.data("helptext");

                    //Creates a container for the tooltip
                    var previewTooltip = $("<span class=\"bz-rn-helptext\"></span>").appendTo(elementContainer);

                    //Setup the tooltip component
                    previewTooltip.attr("title", '');
                    previewTooltip.tooltip({content: helpTextData});
                    previewTooltip.tooltip('open');

                } else {
                    //Removes the flag for the current active tooltip
                    elementContainer.removeData("active");

                    //Destroy the current tooltip
                    elementContainer.find('.bz-rn-helptext').tooltip("destroy");

                    //Destroy the tooltip's container
                    elementContainer.find('.bz-rn-helptext').remove();
                }
            }
        );
        }
    },


    /*
    *   Template method to get the label element
    */
    getLabel: function () {
        var self = this;
        if (!self.label) self.label = $(".ui-bizagi-label", self.element || self.observableElement);
        return self.label;
    },

    /*
    *   Template method to get the control element
    */
    getControl: function () {
        var self = this;
        if (!self.control || self.control.length == 0) self.control = $(".ui-bizagi-render-control", self.element || self.observableElement);
        //if (!self.control || self.control.length == 0) return null;
        return self.control;
    },

    /*
    *   Template method to get the control filler element
    */
    getControlFiller: function () {
        var self = this;
        if (!self.controlFiller) self.controlFiller = $(".ui-bizagi-render-control", self.element || self.observableElement);
        return self.controlFiller;
    },

    /*
    *   Starts waiting signal for async stuff
    */
    startLoading: function () {
        var self = this;

        // Remove loading class
        if (self.element) {
            self.element.addClass("ui-bizagi-state-loading");

            // Create loading
            var loadingDiv = $('<div class="ui-bizagi-render-loading ui-bizagi-loading"></div>');
            self.element.append(loadingDiv);
        }
    },

    /*
    *   Ends waiting for async stuff
    */
    endLoading: function () {
        var self = this;

        // Remove loading class
        if (self.element) {
            self.element.removeClass("ui-bizagi-state-loading");
            self.element.find(".ui-bizagi-render-loading").detach();
            self.element.find(".ui-bizagi-control").removeClass("ui-bizagi-loading");
        };
    },

    /*
    *   Return the right display option class
    */
    getDisplayOptionClass: function (displayType) {
        // Set display type
        if (displayType == "normal" ||
                displayType == "both") {
            return "ui-bizagi-render-display-normal";

        } else if (displayType == "vertical") {
            return "ui-bizagi-render-display-vertical";

        } else if (displayType == "reversed") {
            return "ui-bizagi-render-display-reversed";

        } else if (displayType == "verticalReversed") {
            return "ui-bizagi-render-display-vertical-reversed";

        } else if (displayType == "label") {
            return "ui-bizagi-render-display-label";

        } else if (displayType == "value") {
            return "ui-bizagi-render-display-value";
        }
    },

    /*
    *   Customizes render display type with custom css classes
    */
    changeDisplayOption: function (displayType) {
        var self = this,
        el = self.element;

        // Clean old display type
        el.removeClass('ui-bizagi-render-display-normal ui-bizagi-render-display-vertical ui-bizagi-render-display-reversed')
          .removeClass('ui-bizagi-render-display-vertical-reversed ui-bizagi-render-display-label ui-bizagi-render-display-value');

        // Set display type
        /*  if (displayType == 'normal' ||
        displayType == 'both') {
        el.addClass('ui-bizagi-render-display-normal');

        } else if (displayType == 'vertical') {
        el.addClass('ui-bizagi-render-display-vertical');

        } else if (displayType == 'reversed') {
        el.addClass('ui-bizagi-render-display-reversed');

        } else if (displayType == 'verticalReversed') {
        el.addClass('ui-bizagi-render-display-vertical-reversed');

        } else if (displayType == 'label') {
        el.addClass('ui-bizagi-render-display-label');

        } else if (displayType == 'value') {
        el.addClass('ui-bizagi-render-display-value');
        }*/
        el.addClass(self.getDisplayOptionClass(displayType));
    },

    /*
    *   Return the right align class
    */
    getAlignClass: function (alignType) {
        // Set label align
        if (alignType == "left") {
            return "ui-bizagi-render-align-left";

        } else if (alignType == "center") {
            return "ui-bizagi-render-align-center";

        } else if (alignType == "right") {
            return "ui-bizagi-render-align-right";
        }
    },

    /*
    *   Customizes render label align
    */
    changeLabelAlign: function (alignType) {
        var self = this;

        // Get label
        var label = self.getLabel();

        // Remove old label align
        label.removeClass('ui-bizagi-render-align-left ui-bizagi-render-align-center ui-bizagi-render-align-right');

        // Set label align
        label.addClass(self.getAlignClass(alignType));
    },

    /*
    *   Customizes render value align
    */
    changeValueAlign: function (alignType) {
        var self = this;

        // Get control
        var controlFiller = self.getControlFiller();

        // Remove old value align
        controlFiller.removeClass('ui-bizagi-render-align-left ui-bizagi-render-align-center ui-bizagi-render-align-right');

        // Set value align
        controlFiller.addClass(self.getAlignClass(alignType));
    },

    /*
    *   Customizes render label and value width
    */
    customizeRenderWidth: function () {
        var self = this;
        var label = self.getLabel();
        var properties = self.properties;
        var controlFiller = self.getControlFiller();

        // Read values
        // If the label width or the value width are 0, the BAS means that no value is used, so we need to adjust them to 50%
        var labelWidth = properties.labelWidth ? (properties.labelWidth != '0' ? properties.labelWidth : '50%') : null;
        var valueWidth = properties.valueWidth ? (properties.valueWidth != '0' ? properties.valueWidth : '50%') : null;

        // Normalize percentages
        if (labelWidth && !valueWidth) {
            labelWidth = bizagi.util.percent2Number(labelWidth);
            valueWidth = 100 - labelWidth;

        } else if (!labelWidth && valueWidth) {
            valueWidth = bizagi.util.percent2Number(valueWidth);
            labelWidth = 100 - valueWidth;

        } else {
            labelWidth = bizagi.util.percent2Number(labelWidth);
            valueWidth = bizagi.util.percent2Number(valueWidth);

            // Check 100% percentage
            if ((labelWidth + valueWidth) != 100) {
                valueWidth = 100 - labelWidth;
            }
        }

        // Now apply width
        label.width(labelWidth + "%");
        controlFiller.width((valueWidth - 0.01) + "%");
    },

    /* 
    *   Adds a validation message to the render
    */
    setValidationMessage: function (message) {
        var self = this;

        // Call base
        self._super(message);

        // Wait until element is ready
        $.when(self.ready())
	    .done(function () {
	        var control = self.getControl();

	        if (message && message.length > 0) {

	            // Check if this is the first element
	            var bFirstElement = self.element.prev().length == 0 && self.parent == self.getFormContainer();

	            // Remove html tags
	            message = message.replace(/<\w+>([^<]*)<\/\w+>/g, "$1");
	            control.attr("data-error", message);
	            control.addClass(bFirstElement ? "ui-bizagi-render-error-firstControl" : "ui-bizagi-render-error");

	        } else {
	            if (control) {
	                control.attr("data-error", "");
	                control.removeClass("ui-bizagi-render-error");
	                control.removeClass("ui-bizagi-render-error-firstControl");
	            }
	        }
	    });
	},
	changeRequired: function (argument) {
	    var self = this,
                properties = self.properties;

	    // Update properties
	    properties.required = argument;
	    self._super(argument);

	    if (bizagi.detectDevice() == "tablet" && properties.displayType == "vertical") {

	        if (self.getMode() == "execution" && self.checkRequired([])) {
	            //Do nothing
	        } else if (bizagi.util.parseBoolean(argument) == true && properties.editable) {
	            self.getLabel().addClass("ui-bizagi-required-vertical");
	        } else {
	            self.getLabel().removeClass("ui-bizagi-required-vertical");
	        }

	    }
	},

	changeRequiredLabel: function (argument) {
	    var self = this,
        properties = self.properties;
	    self._super(argument);

	    if (bizagi.detectDevice() == "tablet" && properties.displayType == "vertical") {

	        if (bizagi.util.parseBoolean(argument) == true && properties.editable) {
	            self.getLabel().addClass("ui-bizagi-required-vertical");
	        } else {
	            self.getLabel().removeClass("ui-bizagi-required-vertical");
	        }

	    }
	},
	/*
	*   Sets the value in the rendered control
	*/
	clearDisplayValue: function () {
	    var self = this;
	    var control = self.getControl();
	    control.html("");
	}
});
