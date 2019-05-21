/*
*   Name: BizAgi Tablet Render Extension
*   Author: Diego Parra
*   Comments:
*   -   This script will redefine the render class to adjust to tablet devices
*/

bizagi.rendering.render.extend("bizagi.rendering.render", {}, {

    /*
    *   Update or init the element data
    */
    initializeData: function(data) {
        var self = this;

        // Call base
        self._super(data);

        var formContainer = self.getFormContainer();
        self.formParams = formContainer.getParams();
    },

    /*
    *   Returns the in-memory processed element
    */
    postRender: function () {
        var self = this;
        // Call base
        self.configureHelpText();
    },

    postRenderReadOnly: function () {
        var self = this;
        var container = self.getControl();

        // Call base
        self._super();
        self.configureHelpText();

        // Add styles readonly controls
        container.addClass("bz-rn-read-only");
        container.parent().addClass("bz-rn-read-only");
    },

    configureHelpText: function() {
        var self = this;
        var properties = self.properties;

        if (properties && properties.helpText && properties.helpText !== "") {
            var containerHelp = self.getContainerHelpText();

            if (containerHelp) {
                $(containerHelp).helpText({helpText: properties.helpText, dir: properties.orientation});
            }
        }
    },

    /*
    *   Template method to get the label element
    */
    getLabel: function () {
        var self = this;
        if (!self.label) {
            var label = $(".ui-bizagi-label", self.element || self.observableElement);
            if (label.length > 0) {
                self.label = label;
            }
            return label;
        }
        return self.label;
    },

    /*
    *   Template method to get the control element
    */
    getControl: function () {
        var self = this;
        if (!self.control || self.control.length === 0) {
            self.control = $(".ui-bizagi-render-control", self.element || self.observableElement);
        }
        return self.control;
    },

    /*
    *   Template method to get the control filler element
    */
    getControlFiller: function () {
        var self = this;
        if (!self.controlFiller) {
            self.controlFiller = $(".ui-bizagi-render-control", self.element || self.observableElement);
        }
        return self.controlFiller;
    },

    /*
    *   Starts waiting signal for async stuff
    */
    startLoading: function () {
        //bizagi.util.tablet.startLoading();
    },

    /*
    *   Ends waiting for async stuff
    */
    endLoading: function () {
        //bizagiLoader().stop({});
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
     *   Transform the display type when using RTL orientation
     */
    getRTLDisplayType: function (displayType) {
        return displayType;
    },

    /*
    *   Customizes render display type with custom css classes
    */
    changeDisplayOption: function (displayType) {
        var self = this,
        el = self.element;

        // Clean old display type
        el.removeClass("ui-bizagi-render-display-normal ui-bizagi-render-display-vertical ui-bizagi-render-display-reversed")
          .removeClass("ui-bizagi-render-display-vertical-reversed ui-bizagi-render-display-label ui-bizagi-render-display-value");

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
        label.removeClass("ui-bizagi-render-align-left ui-bizagi-render-align-center ui-bizagi-render-align-right");

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
        controlFiller.removeClass("ui-bizagi-render-align-left ui-bizagi-render-align-center ui-bizagi-render-align-right");

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
        var labelWidth = properties.labelWidth ? (properties.labelWidth != "0" ? properties.labelWidth : "50%") : null;
        var valueWidth = properties.valueWidth ? (properties.valueWidth != "0" ? properties.valueWidth : "50%") : null;

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
    *   Sends all the info to the server then refreshes the form
    *   Returns a deferred
    */
    submitOnChange: function(data, bRefreshForm) {
        var self = this;
        var defer = new $.Deferred();

        bizagi.util.tablet.startLoading();

        $.when(self.isReadyToSave())
            .done(function() {
                $.when(self.internalSubmitOnChange(data, bRefreshForm))
                    .done(function() {
                        defer.resolve();
                    }).fail(function () {
                        defer.reject();
                    }).always( function(){
                        bizagi.util.tablet.stopLoading();
                    });
            });

        return defer.promise();
    },

    /*
     *   Template method to get the control element
     */
    getContainerHelpText: function() {
        var self = this;

        if (!self.containerHelpText) {
            self.containerHelpText = $(".bz-container-rn-helptext", self.element || self.observableElement);
        }

        if (!self.containerHelpText || self.containerHelpText.length === 0) {
            return null;
        }

        return self.containerHelpText;
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
                var bFirstElement = self.element.prev().length === 0 && self.parent === self.getFormContainer();

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

    /*
     *   Method to process the render the layout
     */
    processLayout: function (isLabelFormat, format) {
        var self = this;
        var properties = self.properties;

        if (self.getControl() == null) {
            return;
        }

        // Set customizations
        format = format || {};

        if (format.color) {
            self.changeColor(format.color, isLabelFormat);
        }
        if (format.background) {
            self.changeBackgroundColor(format.background);
        }
        if (format.bold || !format.bold || !isLabelFormat) {//if bold is true in modeler, we receive nothing in execution (!formal.bold)
            self.changeFontBold(format.bold, isLabelFormat);
        }
        if (format.italic) {
            self.changeFontItalic(format.italic, isLabelFormat);
        }
        if (format.underline) {
            self.changeFontUnderline(format.underline, isLabelFormat);
        }
        if (format.strikethru) {
            self.changeFontStrikethru(format.strikethru, isLabelFormat);
        }
        if (format.size) {
            self.changeFontSize(format.size, isLabelFormat);
        }

        // Set required and visiblity
        properties.required = properties.required != undefined ? bizagi.util.parseBoolean(properties.required) : false;
        var visible = properties.visible != undefined ? bizagi.util.parseBoolean(properties.visible) : true;
        if (properties.required) {
            self.changeRequired(properties.required);
        }
        if (!visible) {
            self.changeVisibility(visible);
        }
    },

    changeRequiredLabel: function () {
        var self = this;
        var properties = self.properties;

        if (properties.required) {

            if (!self.checkRequired([])) {
                $("div.ui-bizagi-render-control-required", self.getControl()).show();

            } else {
                $("div.ui-bizagi-render-control-required", self.getControl()).hide();
            }
        }
    },

    changeRequired: function(argument) {
        var self = this;
        var labelElement = $("label", self.getLabel());
        var controlElement = self.getControl();
        //Remove the required div from the dom in order to have only one any time
        controlElement.find(".ui-bizagi-render-control-required").remove();
        var properties = self.properties;

        // Update properties
        properties.required = argument;

        // Changes label
        if (bizagi.util.parseBoolean(argument)) {
            labelElement.text((properties.displayName || "") + " ");

            if (!self.hasValue()) {
                controlElement.prepend("<div class='ui-bizagi-render-control-required'></div>");
            }else{
                controlElement.prepend("<div class='ui-bizagi-render-control-required' style='display: none'></div>");
            }
        } else {
            labelElement.text((properties.displayName || "")); //+ ' :'
        }

        // Perform validations again to check if the form is valid after this change
        self.triggerRenderValidate();
    },

    changeEditability: function (argument) {
        var self = this;
        var editable = bizagi.util.parseBoolean(argument);

        self._super(argument);

        self.getRenderedElement().toggleClass("bz-rn-non-editable", !editable).toggleClass("bz-rn-read-only", !editable);
    },

    /**
    * in mobiles, don't apply styles to icon's elements
    */
    getElementsToStylize: function(context){
        context = $("*:not(.bz-mo-icon):not(.bz-rn-container-control-icon):not(.bz-rn-upload-show-menu):not(.ui-bizagi-render-yesno)", $(context));
        return context;
    },

    getFormParams: function() {
        var self = this;
        return self.formParams || {};
    },

    /**
     *   Sets the value in the rendered control
     */
    clearDisplayValue: function () {
        var self = this;
        var control = self.getControl();
        var input = control.find("input").filter(function(index, ele){
            return ele.type !== "file" && ele.type !== "radio" && ele.type !== "checkbox"
        });

        if (input.length > 0) {
            input.val(self.getValue());
        } else {
            self.setDisplayValue("");
        }
    }
});