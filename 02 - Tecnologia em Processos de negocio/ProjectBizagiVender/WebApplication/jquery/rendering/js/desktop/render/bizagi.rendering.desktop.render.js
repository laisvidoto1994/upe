/*
*   Name: BizAgi Desktop Render Extension
*   Author: Diego Parra
*   Comments:
*   -   This script will redefine the render class to adjust to desktop devices
*/

bizagi.rendering.render.extend("bizagi.rendering.render", {}, {

    /*
    *   Template method to implement in each device to customize each render after processed
    */
    postRender: function () {
        var self = this;
        var properties = self.properties;

        // Call base
        this._super();

        // Add classic retype validation
        if (properties.retype == "double") {
            self.processClassicRetype();
        }

        // Add hint dfeature
        if (properties.hint) {
            self.processRenderHint();
        }

        // Hide icons if no helptext is provided
        if (properties.helpText && properties.helpText.length > 0) {
            self.showIcon("help");
        }
    },

    postRenderReadOnly: function () {
        var self = this;
        var properties = self.properties;
        if (properties.helpText && properties.helpText.length > 0) {
            self.showIcon("help");
        }
    },

    /*
    *   Starts waiting signal for async stuff
    */
    startLoading: function () {
        var self = this;
        var element = self.element;
        if (element) {
            element.startLoading({ delay: 250, overlay: true });
        }
    },

    /*
    *   Ends waiting for async stuff
    */
    endLoading: function () {
        var self = this;

        var element = self.element;
        if (element) {
            element.endLoading();
        }
    },

    /*
    *   Template method to get the label element
    */
    getLabel: function () {
        var self = this;
        if (!self.label) {
            self.label = $(".ui-bizagi-label", self.element || self.observableElement);
        }
        self.processLabelLineBreak(self.label);
        return self.label;
    },

    processLabelLineBreak: function ($label) {
        var label = $label.find("label");
        var text = label.text();
        var reg = /\\n/g;
        var array, result = "", lastIndex = 0;
        while ((array = reg.exec(text)) !== null) {
            if (lastIndex === 0) {
                label.text("");
            }
            label.append(text.substring(lastIndex, reg.lastIndex - 2));
            label.append($("<br/>"));
            lastIndex = reg.lastIndex;
        }
        if (lastIndex !== 0) {
            label.append(text.substring(lastIndex));
        }
    },

    /*
    *   Template method to get the control element
    */
    getControl: function () {
        var self = this;
        if (!self.control || (self.control instanceof jQuery && self.control.length === 0)) {
            self.control = $(".ui-bizagi-render-control", self.element || self.observableElement);
        }
        if (!self.control || self.control.length == 0) {
            return null;
        }
        return self.control;
    },

    /*
    *   Template method to get the control filler element
    */
    getControlFiller: function () {
        var self = this;
        if (!self.controlFiller) self.controlFiller = $(".ui-bizagi-control", self.element || self.observableElement);
        return self.controlFiller;
    },

    /* 
    *   Adds a validation message to the render
    */
    setValidationMessage: function (message) {
        var self = this;

        // Call base
        self._super(message);

        // DiegoP: Please don't remove this line again, this is intended to avoid performance problems in IE8
        if (!bizagi.util.isIE8()) {

            // Wait until element is ready
            $.when(self.ready())
    		.done(function () {
    		    var element = self.element;

    		    // Set tooltip
    		    var iconError = $(".ui-bizagi-render-icon-error", element);
    		    var iconHelp = $(".ui-bizagi-render-icon-help", element);

    		    if (message && message.length > 0) {
    		        self.showIcon("error");
    		        if (bizagi.util.isIE9()) {
    		            iconError.attr("data-title", message);
    		        } else {
    		            iconError.attr("title", message);
    		        }

    		        iconError.tooltip();

    		        // 
    		        $(iconError).parent().removeClass('ui-hidden');

    		    } else {
    		        self.hideIcon("error");
    		        if ($(iconHelp).text() == "") {
    		            $(iconError).parent().addClass('ui-hidden');
    		        }
    		    }
    		});
        }
    },

    /* 
    *   Attach handlers to implement the classic retype option
    */
    processClassicRetype: function () { },

    /* 
    *   Attach effects to implement render hint
    */
    processRenderHint: function () {
        var self = this,
            element = self.element,
            properties = self.properties;

        var input = $("input[type!=hidden], select", element);
        if (!input) return;

        var span = input.parent();
        if (!span) return;

        // Add hint label
        span.prepend('<label class="ui-bizagi-render-hint">' + properties.hint + '</label>');
        var hint = $(".ui-bizagi-render-hint", element);

        // Bind events
        input.focus(function () {
            hint.addClass("focus");
        });
        input.keypress(function () {
            hint.addClass("has-text").removeClass("focus");
        });
        input.blur(function () {
            if ($(this).val() == "") {
                hint.removeClass("has-text").removeClass("focus");
            }
        });
        hint.click(function () {
            input.focus();
        });
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
        return "";
    },

    /*
    *   Customizes render display type with custom css classes
    */
    changeDisplayOption: function (displayType) {
        var self = this,
        el = self.element;

        // Call base
        self._super(displayType);

        // Clean old display type
        el.removeClass("ui-bizagi-render-display-normal ui-bizagi-render-display-vertical ui-bizagi-render-display-reversed")
          .removeClass("ui-bizagi-render-display-vertical-reversed ui-bizagi-render-display-label ui-bizagi-render-display-value");

        // Set display type
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
        } else if (alignType == "justify") {
            return "ui-bizagi-render-align-justify";
        }
        return "";
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

        // Call base
        this._super(alignType);
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

        // Call base
        this._super(alignType);
    },

    /*
    *   Show a notification icon
    */
    showIcon: function (icon) {
        var self = this;
        var containerIcons = $(".ui-bizagi-render-icons", self.element);
        var errorIcon = $(".ui-bizagi-render-icon-error", self.element);
        var helpIcon = $(".ui-bizagi-render-icon-help", self.element);
        var orientation = self.properties.orientation;
        var visibleIcon;

        containerIcons.removeClass('ui-hidden');

        if (icon == "error") {
            visibleIcon = errorIcon.css("display", "inline-block");
        }
        if (icon == "help") {
            visibleIcon = helpIcon.css("display", "inline-block");
        }

        if (helpIcon.is(':visible') && errorIcon.is(':visible')) {
            containerIcons.css('width', '48px');
        } else if (helpIcon.is(':visible') || errorIcon.is(':visible')) {
            containerIcons.css('width', '28px');
        }

        // Make sure that icon container is visible
        self.getControlFiller().addClass("ui-bizagi-state-show-icons");


        // Add hover handler in order to lazy-add the tooltip plugin
        visibleIcon.mouseover(function (e) {
            e.preventDefault();
            e.stopPropagation();
            if (visibleIcon.data("tooltip") === undefined) {
                // Apply tooltip plugin

                var myOrientation = (orientation == 'rtl' ?  "left" : "right") + " bottom ";
                var atOrientation = (orientation == 'rtl' ?  "right" : "left") + " bottom ";

                visibleIcon.tooltip({
                    tooltipClass: 'ui-widget-content ui-help-tooltip',
                    position: { my: myOrientation, at: atOrientation, of: containerIcons, collision: "fit" },
                    items: visibleIcon.attr("title") ? ".ui-icon[title]" : ".ui-icon[data-title]",
                    content: function () {
                        var element = $(this);
                        var replaceHTML = !element.hasClass("ui-bizagi-render-icon-error");
                        //set the title as 'content' to apply possible html tags or styles included in original title
                        if (element[0] && element[0].attributes["data-title"]) {
                            var text = element[0].attributes["data-title"].value;
                            return text;
                        } else if (element[0] && element[0].title) {
                            var _title = element[0].title;
                            element[0].title = "";
                            return _title;
                        }
                    }
                });
                visibleIcon.tooltip("open");
                $(".ui-help-tooltip").css("z-index", $.ui.dialog.prototype._getMaxZindex());
            }

        });
    },

    /*
    *   Show a notification icon
    */
    hideIcon: function (icon) {
        var self = this;
        var containerIcons = $(".ui-bizagi-render-icons", self.element);
        var errorIcon = $(".ui-bizagi-render-icon-error", self.element);
        var helpIcon = $(".ui-bizagi-render-icon-help", self.element);

        if (helpIcon.is(':visible') && errorIcon.is(':visible')) {
            containerIcons.css('width', '24px');
        }

        if (icon == "error") {
            $(".ui-bizagi-render-icon-error", self.element).css("display", "none");
        }
        if (icon == "help") {
            $(".ui-bizagi-render-icon-help", self.element).css("display", "none");
        }

        // Hide icon container if no icons are shown
        var iconContainer = $(".ui-bizagi-render-icons span", self.element);
        if (iconContainer.length > 0 && iconContainer[0].style.display != "none") {
            self.getControlFiller().removeClass("ui-bizagi-state-show-icons");
        }
    }
});
