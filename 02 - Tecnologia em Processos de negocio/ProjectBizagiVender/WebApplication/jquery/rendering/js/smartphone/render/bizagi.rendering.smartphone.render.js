/*
*   Name: BizAgi Smartphone Render Extension
*   Author: Diego Parra
*   Comments:
*   -   This script will redefine the render class to adjust to smartphone devices
*/

bizagi.rendering.render.extend("bizagi.rendering.render", {}, {
    getMenu: function () {
        var params = this.getFormContainer().getParams();
        return params.menu;
    },

    /*
    *   Template method to implement in each device to customize each render after processed
    */
    postRender: function () {
        bizagi.log(" post render smartphone  edit", this, "error");
    },

    /*
    *   Template method to implement in each device to customize each render after processed in read-only mode
    */
    postRenderSingle: function () {
        var self = this;
        var properties = self.properties;
        self.configureHelpText();

        if (typeof (properties.textFormat) !== "undefined" && typeof (properties.textFormat.background) !== "undefined") {
            self.changeBackgroundColor(properties.textFormat.background);
        }

        if (typeof (properties.textFormat) !== "undefined" && typeof (properties.textFormat.color) !== "undefined") {
            self.getControl().parent().css("color", properties.textFormat.color);
        }

        if ($(self.element).hasClass("bz-command-edit-inline") || $(self.element).hasClass("bz-command-not-edit")) return true;

        $(self.element).bind("click", function () {

            $.when(
                self.renderEdition()
            ).then(function () {

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

                // do focus to the top of the page
                window.scrollTo(0, 0);
            });
        });
    },

    postRenderEdit: function () {
        var self = this;
        var context = self.getFormContainer().container;
        var properties = self.properties;
        var actualscroll = $("body").scrollTop();

        if (self.getParams() && (handler = self.getParams().postRenderEdit)) {
            return handler(self);
        }

        $("#container-items-edit", context).find(".ui-bizagi-container-inputs").remove();
        var fordwardActionCommon = function () {
            $(".ui-bizagi-container-children-form", context).hide();
            $("#container-items-edit", context).empty();
            $("#container-items-edit", context).show();
            $(".ui-bizagi-button-container", context).hide();
        };

        fordwardActionCommon();

        $("#container-items-edit", context).append($.tmpl(self.renderFactory.getTemplate("editRender"), { "label": properties.displayName }));
        $("#container-items-edit", context).find(".ui-bizagi-container-inputs").html(self.inputEdition);

        var contexttmp = self.contextEdit = $(context).find("#container-items-edit");
        var backActionCommon = function () {
            $(".ui-bizagi-container-children-form", context).show();
            $("#container-items-edit", context).hide();
            $(".ui-bizagi-button-container", context).show();
            setTimeout(function () { window.scrollTo(0, actualscroll); }, 10);
        };
        $(".ui-bizagi-container-button-edit .ui-bizagi-save-btn", contexttmp).bind("click", function () {
            backActionCommon();
            $.when(self.actionSave()).done(
                function () {
                    if (self.properties.submitOnChange) {
                        self.submitOnChange();
                    }
                });
        });

        $(".ui-bizagi-container-button-edit .ui-bizagi-cancel-btn", contexttmp).bind("click", function () {
            backActionCommon();
        });
    },

    /*
    *   Template method to get the label element
    */
    getLabel: function () {
        var self = this;
        if (!self.label) self.label = $(".ui-bizagi-label", self.element || self.observableElement);
        return self.label;
    },

    getContainerRender: function () {
        var self = this;
        return $(self.element);
    },

    getArrowContainer: function () {
        var self = this;
        if (!self.arrow) self.arrow = $(".bz-container-render-cell1 >.ui-bizagi-render-edition-arrow ", self.element || self.observableElement);
        return self.arrow;
    },

    getArrow: function () {
        var self = this;
        if (!self.arrow) self.arrow = $(".bz-container-render-cell1 >.ui-bizagi-render-edition-arrow > .bz-cm-icon  ", self.element || self.observableElement);
        return self.arrow;
    },
    /*
    *   Template method to get the control element
    */
    getControl: function () {
        var self = this;
        if (!self.control || self.control.length == 0) self.control = $(".ui-bizagi-render-control", self.element || self.observableElement);
        return self.control;
    },


    /*
    *   Template method to get the control element
    */
    getContainerHelpText: function () {
        var self = this;
        if (!self.containerHelpText) self.containerHelpText = $(".bz-container-rn-helptext", self.element || self.observableElement);
        if (!self.containerHelpText || self.containerHelpText.length == 0) return null;
        return self.containerHelpText;
    },

    /*
    *   Template method to get the control filler element
    */
    getControlFiller: function () {
        var self = this;
        if (!self.controlFiller) self.controlFiller = $(".ui-bizagi-render-control", self.element || self.observableElement);
        return self.controlFiller;
    },

    getContainerMessage: function () {
        var self = this;
        if (!self.containerMessage) self.containerMessage = $(".bz-rn-messages", self.element || self.observableElement);
        return self.containerMessage;
    },

    getContextEdit: function () {
        return this.contextEdit;
    },

    /*
    *   Customizes render display type with custom css classes
    *   - normal, value & invert
    */
    changeDisplayOption: function (dspType) {
        var self = this;
        var properties = self.properties;
        var displayType = dspType || (properties.displayType || "normal");
        var orientation = properties.orientation || "";
        var control = self.getControl();
        var excludeControls = ["userfield", "list", "columnList", "link", "searchList"];

        if (properties.isColumn) {
            return;
        }

        if (!properties.editable && properties.type != "grid") {
            $(".bz-container-render-cell1", self.element).addClass("ui-bizagi-render-no-editable-style");
        }

        //Add the inline edit to specific controls
        if (!$(self.element).hasClass("bz-command-edit-inline") && excludeControls.indexOf(properties.type) !== -1)
            $(self.element).addClass("bz-command-edit-inline");

        if (displayType == "value") {
            if (control) {
                control.addClass("bz-rn-display-value");
            }

            self.getLabel().hide();
        }

        if (displayType == "reversed" || orientation == "rtl") {

            control.insertBefore(self.getLabel());
            control.addClass("bz-control-reversed");
            control.find("input").addClass("bz-render-reversed");
            if (!control.children().hasClass("bz-render-reversed"))
                control.children().addClass("bz-render-reversed");
            self.getLabel().addClass("bz-label-reversed");
        }

        if (displayType == "label") {
            control.hide();
            self.getLabel().show();
        }
    },

    /*
    *   Customizes render label align
    */
    changeLabelAlign: function (alignType) {
    },

    /*
    *   Customizes render value align
    */
    changeValueAlign: function (alignType) {
    },

    /*
    *   Customizes render label and value width
    */
    customizeRenderWidth: function () {

    },

    /*
    *   Sends all the info to the server then refreshes the form
    *   Returns a deferred
    */
    submitOnChange: function (data, bRefreshForm) {
        var self = this;
        var actualscroll = $("body").scrollTop();

        $.when(self.isReadyToSave())
            .done(function () {

                $.when(self.internalSubmitOnChange(data, bRefreshForm)).done(
                    function () {
                        setTimeout(function () { window.scrollTo(0, actualscroll); }, 50);
                    }
                );

            });
    },

    /* 
    *   Adds a validation message to the render
    */
    setValidationMessage: function (message) {
        var self = this;
        self._super(message);
        if (message && message.length > 0) {
            message = message.replace(/<\w+>([^<]*)<\/\w+>/g, "$1");
            self.getContainerMessage().html(element = $("<span class=\"bz-rn-err\"></span>"));
            element.attr("data-error", message);
        } else {
            self.getContainerMessage().html("");
        }

    },

    /*
    *   Defines virtual method to extend in each render
    */
    renderSingle: function () {
    },

    /*
    *   Defines virtual method to extend in each render
    */
    renderEdition: function () {
    },

    /*
    *   Override internal rendering in order to apply new smartphone layout
    */
    internalPostRender: function () {
        var self = this;
        // Treat result as a promise, so if the render control returns a promise we can wait until it is done
        // If not, it will be resolved automatically
        $.when(
            self.renderSingle()
        ).then(function () {
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
                    self.setDisplayValue(self.value);
                } else {
                    // Special case when the value is false for boolean renders
                    self.setDisplayValue(self.value);
                }
            }
        });
    },

    /*
    *   Sets the value in the rendered control
    */
    setDisplayValue: function (value) {
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

    setPlaceHolder: function () {
        var self = this;
        var properties = self.properties;
        var container = self.getContainerRender();
        var control = self.getControl();

        if (properties.editable) {

            control.find(".bz-rn-text").attr("placeholder", (properties.required) ? "Required" : "Optional");

        }
    },

    /*
    *   Sets the value in the rendered controlEdit
    */
    setDisplayValueEdit: function (value) {
    },

    actionSave: function () {
        var self = this;
        self.setValue(self.inputEdition.val(), false);
    },

    actionBack: function () {
    },

    setValue: function (value, triggerEvents) {
        var self = this;

        self._super(value, triggerEvents);
        var properties = self.properties;

        if (properties.required) {
            if (value == null || value == "") {
                $("div.bz-rn-required", self.getLabel()).show();

            } else {
                $("div.bz-rn-required", self.getLabel()).hide();
            }
        }
    },

    changeRequired: function (argument) {
        var self = this,
            properties = self.properties;
        var labelElement = $("label", self.getLabel());
        // Update properties
        properties.required = argument;

        // Changes label
        if (bizagi.util.parseBoolean(argument) === true && (properties.value == null || properties.value == "")) {
            labelElement.text((properties.displayName || "") + " ");

            labelElement.before('<div class="bz-rn-required" ></div>');

            self.setPlaceHolder();
        } else {
            labelElement.text((properties.displayName || ""));
            $(".bz-rn-required", self.getLabel()).remove();
        }

        // Perform validations again to check if the form is valid after this change
        self.triggerRenderValidate();
    },

    configureLabel: function () {
        return this.properties.displayName;
    },

    configureHelpText: function () {

        var self = this;
        var properties = self.properties;

        if (properties && properties.helpText && properties.helpText != "") {
            var containerHelp = self.getContainerHelpText();
            if (containerHelp)
                containerHelp.bind("click", function (e) {

                    e.stopPropagation();
                    e.preventDefault();

                    var elementContainer = $(this);
                    if (elementContainer.data("active")) {
                        self.getContainerMessage().html("");
                        elementContainer.removeData("active");
                        self.getContainerMessage().removeClass("display");
                        return;
                    }

                    var element;

                    self.getContainerMessage().html(element = $("<span class=\"bz-rn-helptext\"></span>"));
                    element.html(elementContainer.data("helptext"));
                    elementContainer.data("active", "true");
                    self.getContainerMessage().addClass("display");
                });
        }

    },

    /*
    *   Starts waiting signal for async stuff
    */
    startLoading: function () {
    },

    /*
    *   Ends waiting for async stuff
    */
    endLoading: function () {
    },

    changeBackgroundColor: function (color) {
        var self = this;
        if (color && color != 'none') {
            self.getControl().parent().css("background-color", color);
        }
    }
});
