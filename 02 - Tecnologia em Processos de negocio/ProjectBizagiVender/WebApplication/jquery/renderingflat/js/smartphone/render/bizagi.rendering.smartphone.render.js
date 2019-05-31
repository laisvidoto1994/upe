/**
*   Name: BizAgi Smartphone Render Extension
*   Author: Bizagi Mobile Team
*   Comments:
*   -   This script will redefine the render class to adjust to smartphone devices
*/

bizagi.rendering.render.extend("bizagi.rendering.render", {}, {
    getMenu: function() {
        var params = this.getFormContainer().getParams();
        return params.menu;
    },

    /*
    *   Template method to implement in each device to customize each render after processed
    */
    postRender: function() {
        bizagi.log(" post render smartphone  edit", this, "error");
    },

    /*
    *   Template method to implement in each device to customize each render after processed in read-only mode
    */
    postRenderSingle: function() {
        var self = this;
        var properties = self.properties;
        var control = self.getControl();

        self.configureHelpText();

        self.checkListGroup = $(".ui-bizagi-render-checkList .ui-bizagi-render-checkList-item", control);

        if (typeof (properties.textFormat) !== "undefined" && typeof (properties.textFormat.background) !== "undefined") {
            self.changeBackgroundColor(properties.textFormat.background);
        }

        if (typeof (properties.textFormat) !== "undefined" && typeof (properties.textFormat.color) !== "undefined") {
            self.getControl().parent().css("color", properties.textFormat.color);
            self.element.find("input").css("color", properties.textFormat.color);

            // Not apply for radio control
            if (properties.type !== "radio") {
                self.element.find(".ui-bizagi-render-control > span").css("color", properties.textFormat.color);
            }
        }

        if (typeof (properties.valueFormat) !== "undefined" && typeof (properties.valueFormat.color) !== "undefined") {
            self.element.find(".ui-bizagi-render-control > span").css("color", properties.valueFormat.color);

            // Not apply for radio control | properties.valueFormat.color
            if (properties.type !== "radio") {
                self.element.find("input").css("color", properties.valueFormat.color);
            }
        }

        // Not apply renderEdition
        if ($(self.element).hasClass("bz-command-edit-inline") || $(self.element).hasClass("bz-command-not-edit") || $(self.element).hasClass("bz-rn-non-editable")) {
            return true;
        }

        var contextEdition = self.element;

        if (self.properties.type === "image" || self.properties.type === "columnImage") {
            /**
             * If this is an image, we should show a preview of it
             * but only when click right into the img tag
             */
            contextEdition = $(self.element).find("img");
            if ( contextEdition.length === 0) {
                /**
                * There is no image so, there is nothing to show/do
                */
                return;
            }
        }

        $(contextEdition).bind("click", function () {
            $.when(self.renderEdition())
                .then(function() {

                    self.endLoading();
                    self.postRenderEdit();

                    if (!bizagi.util.isEmpty(self.value)) {
                        if (self.value !== false) {
                            // Encode html to avoid html tags
                            self.setDisplayValueEdit(bizagi.util.encodeHtml(self.value));

                        } else {
                            // Special case when the value is false for boolean renders
                            self.setDisplayValueEdit(self.value);
                        }
                    }
                });
        });
    },

    postRenderEdit: function() {

        var self = this;
        var context = self.getFormContainer().container;
        var properties = self.properties;
        var actualscroll = $("body").scrollTop();

        if (self.getParams() && self.getParams().postRenderEdit) {
            return self.getParams().postRenderEdit(self);
        }

        $("#container-items-edit", context).find(".ui-bizagi-container-inputs").remove();
        var fordwardActionCommon = function() {
            $(".ui-bizagi-container-children-form", context).hide();
            $("#container-items-edit", context).empty();
            $("#container-items-edit", context).show();
            $(".ui-bizagi-button-container", context).hide();
        };

        fordwardActionCommon();
        $("#container-items-edit", context).append($.tmpl(self.renderFactory.getTemplate("editRender"), { "label": properties.displayName }));

        $("#container-items-edit", context).find(".ui-bizagi-container-inputs").html(self.inputEdition);

        var contexttmp = self.contextEdit = $(context).find("#container-items-edit");
        var backActionCommon = function() {
            $(".ui-bizagi-container-children-form", context).show();
            $("#container-items-edit", context).hide();
            $(".ui-bizagi-button-container", context).show();

            setTimeout(function() {
                window.scrollTo(0, actualscroll);
            }, 10);
        };

        $(".ui-bizagi-container-button-edit .ui-bizagi-save-btn", contexttmp).bind("click", function() {
            backActionCommon();
            $.when(self.actionSave())
                .done(function() {
                    if (self.properties.submitOnChange) {
                        self.submitOnChange();
                    }
                });
        });

        $(".ui-bizagi-container-button-edit .ui-bizagi-cancel-btn", contexttmp).bind("click", function() {
            backActionCommon();
        });
    },

    /*
    *   Template method to get the label element
    */
    getLabel: function() {
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

    getContainerRender: function() {
        var self = this;
        return $(self.element);
    },

    getArrowContainer: function() {
        var self = this;

        if (!self.arrow) {
            self.arrow = $(".bz-container-render-cell1 >.ui-bizagi-render-edition-arrow ", self.element || self.observableElement);
        }

        return self.arrow;
    },

    /*
    *   Return the right align class
    */
    getAlignClass: function (alignType) {
        return alignType;
    },

    getArrow: function() {
        var self = this;

        self.arrow = $(".bz-container-render-cell1 >.ui-bizagi-render-edition-arrow > .bz-cm-icon  ", self.element || self.observableElement);
        return self.arrow;

    },
    /*
    *   Template method to get the control element
    */
    getControl: function() {
        var self = this;

        if (!self.control || self.control.length === 0) {
            self.control = $(".ui-bizagi-render-control", self.element || self.observableElement);
        }

        return self.control;
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
    *   Template method to get the control filler element
    */
    getControlFiller: function() {
        var self = this;
        if (!self.controlFiller) {
            self.controlFiller = $(".ui-bizagi-render-control", self.element || self.observableElement);
        }

        return self.controlFiller;
    },

    getContainerMessage: function() {
        var self = this;
        if (!self.containerMessage) {
            self.containerMessage = $(".bz-rn-messages", self.element || self.observableElement);
        }

        return self.containerMessage;
    },

    getContextEdit: function() {
        return this.contextEdit;
    },

    /*
    * Customizes render display type with custom css classes
    *   - Type: normal, value, invert
    */
    changeDisplayOption: function(dspType) {
        var self = this;
        var properties = self.properties;
        var displayType = dspType || (properties.displayType || "normal");
        var orientation = properties.orientation || "";
        var control = self.getControl();

        var excludeControls = ["activityCheckList", "userfield", "date", "columnDate", "searchDate", "list", "columnList", "link", "fileprint", "searchList", "geolocation", "money"];

        // Enable new mobile grid
        if (bizagi.util.isMobileGridEnabled()) {
            excludeControls.push("columnUpload", "columnImage");
        }

        if (!$(self.element).hasClass("bz-command-edit-inline") && excludeControls.indexOf(properties.type) !== -1) {
            $(self.element).addClass("bz-command-edit-inline");
        }

        if (displayType == "value") {
            if (control) {
                control.addClass("bz-rn-display-value");
            }

            self.getLabel().hide();
        }

        // o rtl //ltr
        if (displayType === "reversed" || orientation === "rtl") {

            control.addClass("bz-control-reversed");
            control.find("input").addClass("bz-render-reversed");

            if (!control.children().hasClass("bz-render-reversed")) {
                control.children().addClass("bz-render-reversed");
            }

            self.getLabel().addClass("bz-label-reversed");
        }

        if (displayType == "label" && properties.type !== "layoutLabel") {
            control.hide();
            self.getLabel().show();
        }
    },

    /*
    *   Customizes render label align
    */
    changeLabelAlign: function(alignType) {
    },

    /*
    *   Customizes render value align
    */
    changeValueAlign: function(alignType) {
    },

    /*
    *   Customizes render label and value width
    */
    customizeRenderWidth: function() {

    },

    /*
    *   Sends all the info to the server then refreshes the form
    *   Returns a deferred
    */
    submitOnChange: function(data, bRefreshForm) {
        var self = this;
        var defer = new $.Deferred();

        bizagi.util.smartphone.startLoading();

        $.when(self.isReadyToSave())
            .done(function() {
                $.when(self.internalSubmitOnChange(data, bRefreshForm))
                    .done(function() {
                        defer.resolve();
                    }).fail(function () {
                        defer.reject();
                    }).always( function(){
                        bizagi.util.smartphone.stopLoading();
                    });
            });

        return defer.promise();
    },

    /*
    *   Adds a validation message to the render
    */
    setValidationMessage: function(message) {
        var self = this;
        self._super(message);

        if (message && message.length > 0) {
            message = message.replace(/<\w+>([^<]*)<\/\w+>/g, "$1");
            var element;
            self.getContainerMessage().html(element = $("<span class=\"bz-rn-err\"></span>"));
            element.attr("data-error", message);
        } else {
            self.getContainerMessage().html("");
        }
    },

    /*
    *   Defines virtual method to extend in each render
    */
    renderSingle: function() {
    },

    /*
    *   Defines virtual method to extend in each render
    */
    renderEdition: function() {
    },

    /*
    *   Override internal rendering in order to apply new smartphone layout
    */
    internalPostRender: function() {
        var self = this;
        // Treat result as a promise, so if the render control returns a promise we can wait until it is done
        // If not, it will be resolved automatically
        $.when(self.renderSingle())
            .then(function() {

                // Remove loading status
                self.endLoading();
                self.changeDisplayOption();

                // Post-render method
                self.postRenderSingle();

                // Resolve rendering deferred
                if (self.renderingDeferred) {
                    self.renderingDeferred.resolve();
                }

                // Set the initial value
                if (!bizagi.util.isEmpty(self.value)) {
                    if (self.value !== false) {
                        // Encode html to avoid html tags
                        self.setDisplayValue(bizagi.util.encodeHtml(self.value));
                    } else {
                        // Special case when the value is false for boolean renders
                        self.setDisplayValue(self.value);
                    }
                }

                self.processLayout(isLabelFormat, self.properties.textFormat || {});
                self.processLayout(!isLabelFormat, self.properties.valueFormat || {});
            });
    },

    /*
    *   Sets the value in the rendered control
    */
    setDisplayValue: function(value) {
        var self = this;
        var control = self.getControl();

        // Set internal value
        self.setValue(value, false);

        // Render as simple value
        var displayValue = self.getDisplayValue();

        if (typeof (displayValue) == "string") {
            control.html(displayValue);
        }
    },

    setPlaceHolder: function() {
        var self = this;
        var properties = self.properties;
        var control = self.getControl();

        if (properties.editable) {
            control.find(".bz-rn-text").attr("placeholder", (properties.required) ? "Required" : "Optional");
        }
    },

    /* Changes the render editability*/
    changeEditability: function (argument) {
        var self = this;
        var editable = bizagi.util.parseBoolean(argument);

        self._super(argument);

        self.getRenderedElement().toggleClass("bz-rn-non-editable", !editable).toggleClass("bz-rn-read-only", !editable);
    },

    /*
    *   Sets the value in the rendered controlEdit
    */
    setDisplayValueEdit: function(value) {
    },

    actionSave: function() {
        var self = this;
        self.setValue(self.inputEdition.val(), false);
    },

    changeRequiredLabel: function () {
        var self = this;
        if (self.properties.displayType == "value"){
            self.changeRequiredLabelByVal();
            return;
        }

        var properties = self.properties;

        if (properties.required) {
            if (!self.checkRequired([])) {
                $("div.bz-rn-required", self.getLabel()).show();

            } else {
                $("div.bz-rn-required", self.getLabel()).hide();
            }
        }
    },


    /**
     * Shows or hides the required icon if the control is configured to show only the value.
     */
    changeRequiredLabelByVal: function () {
        var self = this;
        var properties = self.properties;

        if (properties.required) {

            if (!self.checkRequired([])) {
                $("div.bz-rn-required", self.getControl()).show();

            } else {
                $("div.bz-rn-required", self.getControl()).hide();
            }
        }
    },
    changeRequired: function(argument) {
        var self = this;
        if (self.properties.displayType == "value"){
            self.changeRequiredControl(argument);
            return;
        }
        var labelElement = $("label", self.getLabel());
        //Remove the required div from the dom in order to have only one any time
        self.getLabel().find(".bz-rn-required").remove();
        var properties = self.properties;

        // Update properties
        properties.required = argument;

        // Changes label
        if (bizagi.util.parseBoolean(argument)) {
            labelElement.text((properties.displayName || "") + " ");

            if (!self.hasValue()) {
                labelElement.before("<div class='bz-rn-required'></div>");
            }else{
                labelElement.before("<div class='bz-rn-required' style='display: none'></div>");
            }

            self.setPlaceHolder();
        } else {
            labelElement.text((properties.displayName || "")); //+ ' :'
        }

        // Perform validations again to check if the form is valid after this change
        self.triggerRenderValidate();
    },

    changeRequiredControl: function (argument) {
        var self = this;
        //Remove the required div from the dom in order to have only one any time
        var control = self.getControl();
        control.find(".bz-rn-required").remove();
        var properties = self.properties;

        // Update properties
        properties.required = argument;

        // Changes label
        if (bizagi.util.parseBoolean(argument)) {
            if (!self.hasValue()) {
                control.prepend("<div class='bz-rn-required'></div>");
            }else{
                control.prepend("<div class='bz-rn-required' style='display: none'></div>");
            }

            self.setPlaceHolder();
        }

        // Perform validations again to check if the form is valid after this change
        self.triggerRenderValidate();
    },

    configureLabel: function() {
        return this.properties.displayName;
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
    *   Starts waiting signal for async stuff
    */
    startLoading: function() {
    },

    /**
    * in mobiles, don't apply styles to icon's elements
    */
    getElementsToStylize: function(context){
        context = $("*:not(.bz-mo-icon):not(.bz-rn-container-control-icon):not(.bz-rn-upload-show-menu):not(.bz-rn-yesno)", $(context));
        return context;
    },

    /**
    *   Ends waiting for async stuff
    */
    endLoading: function() {
    },

    changeBackgroundColor: function(color) {
        var self = this;
        if (color && color !== "none") {
            self.getControl().closest(".ui-bizagi-render").css("background-color", color);
        }
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