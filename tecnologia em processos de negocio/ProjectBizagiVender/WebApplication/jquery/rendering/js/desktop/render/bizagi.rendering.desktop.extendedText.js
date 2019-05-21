/*
 *   Name: BizAgi Desktop Render Text Extension
 *   Author: Diego Parra
 *   Comments:
 *   -   This script will redefine the text render class to adjust to desktop devices
 */

// Extends itself
bizagi.rendering.extendedText.extend("bizagi.rendering.extendedText", {}, {

    postRender: function () {
        var self = this;
        self._super();
        if (bizagi.util.isIE8()) {
            self.textarea.attr("cols", "5000");
        }
    },
    /*
    *   Template method to implement in each device to customize the render's behaviour to add handlers
    */
    configureHandlers: function () {
        var self = this;
        var properties = self.properties;

        // Call base
        self._super();

        // Define max length of element
        if (properties.maxLength > 0) {
            self.textarea.attr("maxlength", properties.maxLength);
            self.actualMaxLength = properties.maxLength;

            $(self.textarea).bind("keydown", function (e) {
                if (e.which === 8 || e.which === 13 || e.which === 32 || e.which > 46) {
                    self.setMaxLengthContext()
                }
            });

            $(self.textarea).bind("paste", function (e) {
                setTimeout(function () {
                    self.setMaxLengthContext();
                }, 100);
            });

        }

        self.ready().done(function () {
            // auto extend
            if (properties.autoExtend) {
                var value = "";
                var minHeight = self.textarea.css("height");
                var valMinHeight;
                var fakeControl = $("<div />").css({
                    whiteSpace: "pre-wrap",
                    display: "none"
                });

                if (typeof minHeight == "string" && minHeight.search("px") !== -1) {
                    valMinHeight = Number(minHeight.split("px")[0]);
                    if (valMinHeight <= 150) {
                        minHeight = "150px";
                    }
                } else {
                    minHeight = "150px";
                }

                // set textarea styles
                self.textarea.css({
                    overflow: "hidden",
                    resize: "none",
                    minHeight: minHeight
                });

                fakeControl.insertAfter(self.textarea);

                setTimeout(function () {
                    self.proccessStyles(value, fakeControl);
                }, 100);
                self.textarea.bind("keyup", function () {
                    self.proccessStyles(value, fakeControl);
                });
            }
        });

    },

    /*
    * Set textarea styles
    */
    proccessStyles: function (value, fakeControl) {
        var self = this;
        if (value === (value = self.textarea.val())) {
            return;
        }
        fakeControl.text(value);
        self.textarea.css("height", fakeControl.height());
    },

    /*
    * Set variables to calculate max length
    */
    setMaxLengthContext: function () {
        var self = this;
        var string = self.textarea.val();
        var match = string.match(/\n/gm);
        var numberEnters = match ? match.length : 0;

        self.setMaxLength(self.textarea, numberEnters, string);
    },

    /*
    * Set dynamic max length
    */
    setMaxLength: function ($textarea, numberEnters, string) {
        var self = this;
        var properties = self.properties;
        var calculated = properties.maxLength - (3 * numberEnters); // 3 for \\n

        calculated = (calculated > 0) ? calculated : 0;

        if (string.length > calculated) {
            $textarea.val(string.substr(0, calculated));
        }

        if (self.actualMaxLength !== calculated) {
            $textarea.attr("maxlength", calculated);
            self.actualMaxLength = calculated;
        }
    },

    /*
    *   Sets the value in the rendered control
    */
    setDisplayValue: function (value) {
        var self = this;
        var properties = self.properties;
        var decodedValue = bizagi.util.decodeURI(value);
        value = (typeof decodedValue == "string") ? decodedValue : "";

        // Call base
        this._super(value);

        // Set value in input
        if (value && properties.editable) {
            var resolvedValue = $.br2nl(value);
            self.textarea.val(resolvedValue);
        }
    },
    collectData: function (renderValues) {
        var self = this;
        var properties = self.properties;

        // Add the render value
        var xpath = properties.xpath;
        // replace strange character
        var value = self.getValue();
        if (self.getValue() != null)
            if (typeof (self.getValue()) != "undefined") {
                value = self.getValue().replaceAll(String.fromCharCode("030"), '');
                value = self.getValue().replaceAll(String.fromCharCode("018"), '');
                value = self.getValue().replaceAll(String.fromCharCode("016"), '');
            }

        if ($.controlValueIsChanged(self)) {
            // Filter by valid xpaths and valid values        
            if (!bizagi.util.isEmpty(xpath)) {
                if (!bizagi.util.isEmpty(value)) {
                    renderValues[properties.xpath] = value;
                } else if (value === "") {
                    renderValues[properties.xpath] = "";
                }
            }
        }
    },
    /*
     * Cleans current value
     */
    cleanData: function () {
        var self = this;

        self.setValue("");
        self.clearDisplayValue();
    },

    /*
     *   Sets the value in the rendered control
     */
    clearDisplayValue: function () {
        var self = this;
        var control = self.getControl();
        var input = control.find("textarea");
        if (input.length > 0) {
            input.val(self.getValue());
        } else if (!self.properties.editable) {
            $(control).html("<div class='ui-bizagi-render-control    ui-bizagi-text-extended-readonly'></div>");
        }
    },
    //function virtual implements on children (desktop,samrtphone...).
    attachRetypeDouble: function () {
        var self = this;
        var element = self.element;
        var input = $("input, textarea", element);
        if (!input || input.length == 0) return;
        // Apply blur handler to check value
        input.blur(function () {
            var control = $(this);
            var previousValue = self.previousValue;
            var value = self.value;

            if (previousValue != null && value != previousValue) {
                if ($(this).data("newValue") != undefined && control.val() != $(this).data("newValue")) {
                    $(this).data().newValue = undefined;
                }
            }
            self.retypeDouble(control);

        });
    },

    retypeDouble: function (control) {
        var self = this;
        var element = self.element;

        if ($(control).attr("type") != "hidden" &&
            $(control).css("display") != "none" &&
            $(control).css("visibility") != "hidden" &&
            $(this).data("newValue") == undefined) {

            if (!control.data("oldValue") || $(this).data("oldValue") == "") {

                // Check that there is something in the value
                if (control.val() == "")
                    return;

                // Check if a value has already been set
                if (control.val() == control.data("newValue"))
                    return;

                control.data("oldValue", control.val());
                control.val("");
                // Create new tooltip
                try {
                    control.tooltip("destroy");
                } catch (e) {
                }
                control.attr("title", self.getResource("render-text-retype")); //"Re-escriba el valor"

                //Set up tool tip
                control.tooltip();

                var toolTipZindex = $.getMaxZindex();
                control.tooltip().on("tooltipopen", function (event, ui) {
                        ui.tooltip.zIndex(toolTipZindex);
                    }
                );

                control.tooltip("open");
                // Focus after 100ms to avoid bubbling
                setTimeout(function () {
                    control.focus();
                }, 100);

            }

            else {

                // Check that there is something in the value
                if (control.val() == "") {
                    return;
                }

                if (control.val() != control.data("oldValue")) {
                    self.setValue("");
                    control.val("");
                    control.data("oldValue", "");
                    control.tooltip("destroy");
                    control.attr("title", self.getResource("render-text-retype-fail"));

                    //Set up tool tip
                    control.tooltip();

                    var toolTipZindex = $.getMaxZindex();
                    control.tooltip().on("tooltipopen", function (event, ui) {
                            ui.tooltip.zIndex(toolTipZindex);
                        }
                    );

                    control.tooltip("open");
                    setTimeout(function () {
                        control.focus();
                    }, 100);
                } else {

                    control.data("newValue", control.val());
                    control.data("oldValue", "");
                    // Destroy tooltips
                    control.tooltip("destroy");
                }
            }
        }
    }
});
