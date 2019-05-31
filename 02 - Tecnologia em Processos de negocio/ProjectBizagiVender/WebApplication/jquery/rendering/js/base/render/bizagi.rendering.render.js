/*
 *   Name: BizAgi Render Class
 *   Author: Diego Parra
 *   Comments:
 *   -   This script will define a base render class with common stuff related to all renders
 */

bizagi.rendering.element.extend("bizagi.rendering.render", {
    postRenderTimeout: 0,
    maxRendersPerScreen: 50,
    rendersExecuted: 0,
    renderOptimization: false,
    TYPE_QUERY_FORM: "queryForm",
    startOptimization: function () {
        bizagi.rendering.render.postRenderTimeout = 500;
        bizagi.rendering.render.rendersExecuted = 0;
        // Cancelled optimization temporaly, because its on experimental stage
        bizagi.rendering.render.renderOptimization = false;
    },
    stopOptimization: function () {
        bizagi.rendering.render.postRenderTimeout = 0;
        bizagi.rendering.render.rendersExecuted = 0;
        bizagi.rendering.render.renderOptimization = false;
    }
}, {
    /*
    *   Update or init the element data
    */
    initializeData: function (data) {
        var self = this;

        // Call base
        self._super(data);

        var form = self.getFormContainer();

        // Fill default properties
        var properties = self.properties;
        properties.included = (typeof properties.included != "undefined") ? bizagi.util.parseBoolean(properties.included) : false;
        properties.uniqueId = Math.ceil(Math.random() * 1000000);
        properties.displayName = properties.displayName || "";
        properties.editable = (typeof properties.editable != "undefined") ? bizagi.util.parseBoolean(properties.editable) : true;
        properties.visible = (typeof properties.visible != "undefined") ? bizagi.util.parseBoolean(properties.visible) : true;
        properties.includedInResult = (typeof properties.includedInResult != "undefined") ? bizagi.util.parseBoolean(properties.includedInResult) : false;
        if (properties.type == "hidden")
            properties.visible = false;
        properties.required = (typeof properties.required != "undefined") ? bizagi.util.parseBoolean(properties.required) : false;
        properties.submitOnChange = (typeof properties.submitOnChange != "undefined") ? bizagi.util.parseBoolean(properties.submitOnChange) : false;
        properties.maxLength = properties.maxLength || 0;
        properties.helpText = bizagi.util.trim(properties.helpText) || "";
        properties.textFormat = properties.textFormat || {};
        properties.valueFormat = properties.valueFormat || {};
        properties.isHidden = (typeof properties.isHidden != "undefined") ? bizagi.util.parseBoolean(properties.isHidden) : false;
        properties.visible = (properties.isHidden) ? false : properties.visible;

        // Old color and background color
        if (properties.color) {
            properties.textFormat.color = properties.color;
        }
        if (properties.backgroundColor) {
            properties.textFormat.backgroundColor = properties.backgroundColor;
        }

        // Non-editable fields cannot be required
        properties.required = properties.editable ? properties.required : false;

        // Override orientation from parent if not set
        properties.orientation = properties.orientation || self.parent.properties.orientation;

        // Check contexttype
        properties.contexttype = (form.params && form.params.data && form.params.data.contextType) ? form.params.data.contextType : "";

        // Save original properties
        self.originalProperties = {
            textFormat: {
                color: properties.textFormat.color,
                backgroundColor: properties.textFormat.backgroundColor
            },
            valueFormat: {
                color: properties.textFormat.color,
                backgroundColor: properties.textFormat.backgroundColor
            },
            visible: properties.visible,
            editable: properties.editable,
            required: properties.required,
            labelAlign: properties.labelAlign
        };

        // Create value property
        self.value = (typeof properties.value != "undefined") ? properties.value : null;

        // Register original value property
        self.properties.originalValue = self.value;
        self.properties.previousValue = self.value;

        // Calculate layout properties
        self.calculateInitialLayoutProperties();
    },
    /*
    *   Calculate aligns, display types, rtl and widths
    */
    calculateInitialLayoutProperties: function () {
        var self = this;
        var properties = self.properties;


        // Set visual defaults
        properties.displayType = properties.displayType || "normal";
        properties.labelAlign = properties.labelAlign || self.getDefaultLabelAlign(properties.displayType);
        properties.valueAlign = properties.valueAlign || self.getDefaultValueAlign(properties.displayType);

        // Check rtl orientation
        if (properties.orientation == "rtl") {
            properties.displayType = self.getRTLDisplayType(properties.displayType);
            properties.labelAlign = self.getRTLAlign(properties.labelAlign);
            properties.valueAlign = self.getRTLAlign(properties.valueAlign);
        }

        // Calculate render with
        var renderWidth = self.calculateRenderWidth(properties.labelWidth, properties.valueWidth, properties.displayType);
        properties.labelWidth = renderWidth.label;
        if (properties.layoutType == "percentage"){
            properties.valueWidth = renderWidth.control;
        }

        if (properties.labelWidth == 0) {
            properties.displayType = "value";
            properties.valueWidth = renderWidth.control;
        }
        if (properties.valueWidth == 0) {
            properties.displayType = "label";
        }

        if (properties.type === "userfield") {
            if (properties.displayType === "both") {
                properties.valueWidth = properties.valueWidth || 50;
                properties.labelWidth = properties.labelWidth || 50;
            } else if (properties.displayType === "vertical") {
                properties.valueWidth = 100;
                properties.labelWidth = 100;
            } else {
                properties.valueWidth = 100;
                properties.labelWidth = 0;
            }
        }
    },
    /*
    *   Returns the element type
    */
    getElementType: function () {
        return bizagi.rendering.element.ELEMENT_TYPE_RENDER;
    },
    /*
    *   Returns the html templated element
    */
    render: function (renderTemplateName) {
        return this.renderElement(renderTemplateName);
    },
    /*
    *   Returns the html templated element
    */
    renderElement: function (renderTemplateName) {
        var self = this;
        var properties = self.properties;
        var form = self.getFormContainer();
        // Start rendering deferred
        self.renderingDeferred = new $.Deferred();

        // Set render template
        renderTemplateName = renderTemplateName || "render";
        var renderTemplate = self.renderFactory.getTemplate(renderTemplateName);

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
            label: label, helpText: properties.helpText,
            editable: properties.editable,
            isExtendedText: (properties.type == "text" && properties.isExtended),
            orientation: properties.orientation,
            uniqueId: properties.uniqueId,
            id: properties.id,
            xpath: properties.xpath,
            tag: properties.tag,
            displayOptionClass: self.getDisplayOptionClass(properties.displayType),
            labelAlignClass: self.getAlignClass(properties.labelAlign),
            valueAlignClass: self.getAlignClass(properties.valueAlign),
            labelWidth: labelWidth,
            valueWidth: parseFloat(properties.valueWidth),
            layoutType: properties.layoutType,
            isDesign: self.getMode() === "design",
            messageValidation: properties.messageValidation,
            printVersion: form.params.printversion,
            cssClass: properties.cssclass || "",
            includedInResult: properties.includedInResult,
            included: properties.included,
            type: properties.type,
            showFullRender: bizagi.util.detectDevice() !== "desktop" && (properties.type === 'association' || properties.type === 'uploadecm'|| (properties.type === 'actionLauncher' && bizagi.util.isTabletDevice()) || (properties.type === 'polymorphicLauncher' && bizagi.util.isTabletDevice()) || (properties.type === 'grid' && !bizagi.util.isTabletDevice()))
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
    *   Returns the resolved result from a promise when the promise has been executed already
    */
    resolveResult: function (promise) {
        return bizagi.resolveResult(promise);
    },
    /*
    *   Check if the jquery element is ready or not
    */
    isRendered: function () {
        var self = this;
        if (!self.renderingDeferred) {
            return false;
        }
        return self.renderingDeferred.promise();
    },
    /*
    *   Renders the control html
    */
    internalRenderControl: function () {
        var self = this;
        var properties = self.properties;
        self.control = null;

        if (self.renderFactory.printVersion) {
            properties.editable = false;
            return self.renderControl();

        } else if (properties.editable) {
            return self.renderControl();
        }
        return self.renderReadOnly();
    },
    /*
    *   Template method to implement in each device to customize each render after processed
    */
    postRenderElement: function (element) {
        var self = this;
        var properties = self.properties;

        // Set element variable
        self.element = element;

        if (properties.submitOnChange)
            self.configureSubmitOnChange();

        // Process internal layout
        isLabelFormat = true;

        var executePostRender = function (_element) {
            if (bizagi.rendering.render.renderOptimization &&
                    bizagi.rendering.render.rendersExecuted > bizagi.rendering.render.maxRendersPerScreen) {

                // Execute post-render control
                setTimeout(function () {
                    self.internalPostRender(_element);
                    bizagi.rendering.render.postRenderTimeout += 50;
                }, bizagi.rendering.render.postRenderTimeout);

            } else {
                self.internalPostRender(_element);
            }
            bizagi.rendering.render.rendersExecuted++;
        };

        if (self.asyncRenderDeferred) {
            // Wait for async result
            $.when(self.asyncRenderDeferred)
                    .done(function (html) {
                        var control = self.getControl();
                        if(typeof self.emptyControlByAsyncRenderDeferred == "function"){
                            self.emptyControlByAsyncRenderDeferred();
                        }
                        control.append(html);

                        // Execute post-render control
                        executePostRender(element);
                        self.processLayout(!isLabelFormat, self.properties.valueFormat || {});
                    });
        } else {
            // Execute post-render control
            executePostRender(element);
        }
    },
    /*
    *   Executes the post render handlers
    */
    internalPostRender: function (element) {
        var self = this;
        var properties = self.properties;
        var mode = self.getMode();
        var control = self.control = self.getControl();

        // Resolve rendering deferred
        if (self.renderingDeferred) {
            self.renderingDeferred.resolve();
        }

        // Execute post-renders
        if (properties.editable) {
            // Post-render editable version
            if (self.renderFactory.printVersion && self.postRenderPrintVersion) {
                self.postRenderPrintVersion();
            }
            else {
                self.postRender();
            }

        } else {
            // Post-render readonly version
            self.postRenderReadOnly(element);
        }

        // Perform execution mode methods
        if (mode == "execution") {
            self.performExecutionModeMethods();
        } else {
            self.performDesignModeMethods();
        }

        self.processLayout(isLabelFormat, self.properties.textFormat || {});
        self.processLayout(!isLabelFormat, self.properties.valueFormat || {});
    },
    /*
    *   Execute runtime only methods
    */
    performExecutionModeMethods: function () {
        var self = this;
        var properties = self.properties;
        if (self.getFormType() == self.Class.TYPE_QUERY_FORM) {
            self.configureHandlersQueryForm();
        }
        // Apply handlers
        if (properties.editable) {
            self.configureHandlers();
        } else {
            self.configureHandlersReadOnly();
        }

        // Set initial value
        self.internalSetInitialValue();
    },
    /*
    *   Execute design only methods
    */
    performDesignModeMethods: function () {
        var self = this;
        var properties = self.properties;

        // Set all controls read-only
        var control = self.getControl();
        //Valid control
        if (control !== null) {
            $("input, select, button, textarea", control).attr("readonly", true);
        }
        // Execute custom code for each render
        self.configureDesignView();

        // Set initial value
        self.internalSetInitialValue();
    },
    /*
    *   Replaces a {{control}} string in the specified element
    */
    replaceControlHtml: function (html, replace) {
        html = html || "";
        replace = replace || "";
        return html.replace("{{control}}", replace);
    },
    /*
    *   Return the rendered element
    */
    getRenderedElement: function () {
        if (bizagi.util.isEmpty(this.element))
            alert("render hasn't been rendered!");

        return this.element;
    },
    /*
    *   Sets the initial value for the renders
    */
    internalSetInitialValue: function () {
        var self = this;
        var properties = self.properties;
        self.internalSetInitialValueFlag = true;

        // Set the initial value
        if (properties.editable) {
            if (!bizagi.util.isEmpty(self.value)) {
                self.setDisplayValue(self.value);
            }
        } else {
            if (!bizagi.util.isEmpty(self.value)) {
                self.setDisplayValue(self.value);
            }
        }
        self.internalSetInitialValueFlag = false;
    },
    /*
    * Public method to determine if a value is valid or not
    */
    isValid: function (invalidElements) {
        var self = this,
                properties = self.properties,
                message;
        var inlineAdd = self.grid && self.grid.properties && self.grid.properties.inlineAdd ;

        // Don't check non-editable renders
        if (bizagi.util.parseBoolean(properties.visible) == false) {
            return true;
        }
        // Don't check non-editable renders
        if (bizagi.util.parseBoolean(properties.editable) == false && !inlineAdd) {
            return true;
        }

        // Clear error message
        self.setValidationMessage("");

        // Check required
        if (bizagi.util.parseBoolean(properties.required)) {
            var form = self.getFormContainer();
            var renders = self.grid ? [self] : form.getRenders(properties.xpath);
            var hasValue = false;
            $.each(renders, function (i, render) {
                if (render.hasValue()&& (render.properties.editable || inlineAdd)) {
                    hasValue = true;
                    return false;
                }
            });

            if (!hasValue && !self.properties.isClone) {
                message = self.getResource("render-required-text").replaceAll("#label#", properties.displayName);
                invalidElements.push({
                    xpath: properties.xpath,
                    message: message
                });
                return false;
            }
        }

        // Check retypes
        if (properties.retype == "duplicate") {
            // Don't process cloned renders, just originals
            if (self.cloneRender) {
                if (self.cloneRender.getValue() != self.getValue()) {
                    message = self.getResource("render-text-retype-error");
                    invalidElements.push({
                        xpath: properties.xpath,
                        message: message
                    });
                    return false;
                }
            }
        }
        else
        if (properties.retype == "double")
        {
            var control = $("input", self.element);

            //Waits until the control has the second value written
            if (control && control.data("oldValue")) {
                if (control.val() == "") {

                    message = self.getResource("render-text-retype-error");
                    invalidElements.push({
                        xpath: properties.xpath,
                        message: message
                    });

                    return false;
                }
                else
                if (control.val() != control.data("oldValue")) {
                    message = self.getResource("render-text-retype-error");
                    invalidElements.push({
                        xpath: properties.xpath,
                        message: message
                    });

                    return false;
                }
            }
        }

        // Check maxlength
        var columnEditable = self.grid && self.grid.getColumn ? self.grid.getColumn(self.properties.xpath).properties.editable : true;
        if (properties.type!="userPassword" && properties.maxLength !== undefined && properties.maxLength > 0 && bizagi.util.isNumeric(properties.maxLength)) {
            if (columnEditable || (!columnEditable && self.controlValueIsChanged())) {
                var maxLength = new Number(properties.maxLength);
                var value = self.getValue();
                if (value && value.toString().length > maxLength) {
                    message = self.getResource("render-text-maxLength-error").replaceAll("#maxLength#", maxLength);
                    invalidElements.push({
                        xpath: properties.xpath,
                        message: message
                    });
                    return false;
                }
            }
        }

        return true;
    },
    /*
    *   Check if a render has no value for required validation
    */
    hasValue: function () {
        var self = this;
        // Next line decides if only spaces are accepted as valid texts or not. Anyway the spaces are still saved as self.value has not changed
        var value = self.getValue();
        value = (value && self.properties.type == "text") ? value.trim() : value;
        return !bizagi.util.isEmpty(value);
    },
    /*
    *   Template method to implement in each device to customize each render after processed
    */
    postRender: function () {
    },
    /*
    *   Template method to implement in each device to customize each render after processed in read-only mode
    */
    postRenderReadOnly: function () {
    },
    /*
    *   Template method to implement in each device to customize the render's behaviour to add handlers
    */
    configureHandlers: function () {
    },
    /*
    *   Template method to implement in each device to customize the render's behaviour to add handlers when the control is readonly
    */
    configureHandlersReadOnly: function () {
    },
    /*
    *   Template method to implement in each device to customize the render's behaviour when rendering in design mode
    */
    configureDesignView: function () {
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
    /*
    *   Sets the internal value
    */
    setValue: function (value, triggerEvents) {
        var self = this;
        triggerEvents = triggerEvents !== undefined ? triggerEvents : true;

        if (!(bizagi.util.identicalObjects(value, self.value))) {
            // set previous value
            self.properties.previousValue = self.properties.originalValue = self.value;

            // Change internal value
            self.value = self.properties.value = value;
            if (self.properties.required && self.getMode() == "execution") {

                if (self.checkRequired([])) {
                    self.changeRequiredLabel(false);
                } else {
                    self.changeRequiredLabel(true);
                }
            }

            // Trigger events
            if (triggerEvents && !self.internalSetInitialValueFlag) {
                self.triggerRenderChange();
                self.triggerRenderValidate();
            }
        }
    },
    checkRequired: function (invalidElements) {
        var self = this;
        var properties = self.properties;

        if (bizagi.util.parseBoolean(properties.required)) {
            if (!self.hasValue()) {
                message = self.getResource("render-required-text").replaceAll("#label#", properties.displayName);
                invalidElements.push({
                    xpath: properties.xpath,
                    message: message
                });
                return false;
            }
        }
        return true;
    },
    /*
    *   Triggers the render change event
    */
    triggerRenderChange: function (params) {
        var self = this;
        params = params || {};
        params.changed = params.changed !== undefined ? params.changed : true;
        self.triggerHandler("renderchange", { render: self, changed: params.changed });
    },
    /*
    *   Triggers the render validate event
    */
    triggerRenderValidate: function () {
        var self = this;
        self.triggerHandler("rendervalidate", { render: self });
    },
    /*
    *   Sets the value in the rendered control
    */
    setDisplayValue: function (value) {
        var self = this;
        var control = self.getControl();

        // Set internal value
        self.setValue(value, false);

        if (self.properties.editable == false && self.properties.display != "check") {
            // Render as simple value
            var displayValue = self.getDisplayValue(value);
            if (typeof (displayValue) == "string" || typeof (displayValue) == "number") {
                $(control).html("<label class='readonly-control'>" + displayValue + "</label>");
            }
        }
    },
    /*
    *   Returns the internal value
    */
    getValue: function () {
        return this.value;
    },
    /*
    *   Returns the value to display, ex. non-editable renders
    */
    getDisplayValue: function () {
        return this.getValue();
    },
    /*
    *   Template method to get the label element
    */
    getLabel: function () {
        bizagi.util.mustImplement("getLabel");
    },
    /*
    *   Template method to get the control element
    */
    getControl: function () {
        bizagi.util.mustImplement("getControl");
    },
    /*
    *   Template method to get the control filler element
    */
    getControlFiller: function () {
        bizagi.util.mustImplement("getControlFiller");
    },
    /*
    *   Template method to implement in each children to customize each control
    */
    renderControl: function () {
    },
    /*
    *   Adds a validation message to the render
    */
    setValidationMessage: function (message) {
        var self = this;
        self.validationMessage = message;
    },
    /*
    *   Method to render non editable values
    */
    renderReadOnly: function () {
        var result = this.getValue();
        if((typeof result) === 'object'){
             return "";
        }else{
            return result;
        }
    },
    /*
    *  Method to render print version
    */
    postRenderPrintVersion: function () {

    },
    /*
    *   Customizes render display type with custom css classes
    */
    changeDisplayOption: function (displayType) {
        this.properties.displayType = displayType;
    },
    /*
    *   Return the right display option class
    */
    getDisplayOptionClass: function (displayType) {
        return "";
    },
    /*
    *   Customizes render label align
    */
    changeLabelAlign: function (alignType) {
        this.properties.labelAlign = alignType;
    },
    /*
    *   Customizes render value align
    */
    changeValueAlign: function (alignType) {
        this.properties.valueAlign = alignType;
    },
    /*
    *   Return the right align class
    */
    getAlignClass: function (alignType) {
        return "";
    },
    /*
    *   Customizes render label and value width
    */
    customizeRenderWidth: function () {
    },
    /* Customizes render color*/
    changeColor: function (color, isLabelFormat) {
        var self = this;
        var control = self.getControl();
        var label = self.getLabel();
        var isLabelFormat = (typeof isLabelFormat != "undefined" || isLabelFormat != null) ? isLabelFormat : true;
        if (control && label) {
            if (color != 'none') {
                // Hide - show the render
                if (self.properties.displayType == "value" || !isLabelFormat) {
                    self.getElementsToStylize(self.getControl()).css("color", color, "!important");
                    self.getControl().find("*").each(function (i, element) {
                        self.getElementsToStylize(element).css("color", color, "!important");
                    });
                } else {
                    self.element.each(function () {
                        this.style.setProperty('color', color, 'important');
                    });
                    self.getLabel().find("label").css("color", color, "!important");
                }
            } else {
                self.element.css("color", "");
                self.getLabel().find("label").css("color", "");
                self.getControl().css("color", "");
                self.getControl().find("input, textarea").each(function (i, element) {
                    var originalColor = $(element).data("originalColor") || "";
                    self.getElementsToStylize(element).css("color", originalColor);
                });
            }
        }
    },
    /* Customizes render background color*/
    changeBackgroundColor: function (color) {
        var self = this;
        var control = self.getControl();
        var label = self.getLabel();
        if (control && label) {
            if (color != 'none') {
                self.element.each(function () {
                    this.style.setProperty('background-color', color, 'important');
                });

                if (typeof label.find('label').style != 'undefined') {
                    self.getLabel().find("label").style("background-color", color, "important");
                }
                else {
                    self.getLabel().find("label").css("background-color", color, "!important");
                }

                var currentStyle = self.getLabel().attr("style");
                currentStyle += "; background-color:" + color + "!important";
                self.getLabel().attr("style", currentStyle);
            } else {
                self.element.css("background-color", "");
                self.getLabel().find("label").css("background-color", "");
                self.getControl().css("background-color", "");
                self.getControl().find("input, textarea").each(function (i, element) {
                    var originalColor = $(element).data("originalColor") || "";
                    $(element).css("background-color", originalColor);
                });
            }
        }
    },
    /* Returns the formatting label to be used for bold, italic, underline, strikethrough and size*/
    getFormattingLabel: function () {
        var self = this;
        return self.getLabel().find("label");
    },
    /* Customizes the font weight */
    changeFontBold: function (bold, isLabelFormat) {
        var self = this;
        var isLabelFormat = (typeof isLabelFormat != "undefined" || isLabelFormat != null) ? isLabelFormat : true;

        // Hide - show the render
        if (bizagi.util.parseBoolean(bold) != false && isLabelFormat) {
            self.getFormattingLabel().css("font-weight", "bold", "!important");
            self.getControl().each(function (i, element) {
                $(element).css("font-weight", "bold", "!important");
            });

        } else {
            if (isLabelFormat)
                self.getFormattingLabel().css("font-weight", "normal", "!important");
        }
        if (!isLabelFormat) {
            if (bizagi.util.parseBoolean(bold) == true) {
                self.getControl().find("*").each(function (i, element) {
                    $(element).css("font-weight", "bold", "!important");
                });
            } else {
                self.getControl().find("*").each(function (i, element) {
                    $(element).css("font-weight", "normal", "!important");
                });
                self.getControl().css("font-weight", "normal", "!important");
            }
        }
    },

    controlValueIsChanged: function () {
        var self = this;
        var properties = self.properties;
        var value = self.getValue();
        var compareValue = properties.originalValue;
        var baseValue = properties.defaultValue;
        var result = true;

        // Flag to force to collect data
        if ($.forceCollectData) {
            return true;
        }

        // Verify if control has been ready
        if (self.properties.type == "grid" && self.ready().state() == "pending") {
            return false;
        }

        if (properties.type == "combo" || properties.type == "queryCombo" || properties.type == "list" || properties.type == "queryList" || properties.type == "radio" || properties.type == "queryRadio" || properties.type == "cascadingCombo") {
            if (value && value.length !== undefined) {
                value = value[0];
            }
            if (compareValue && compareValue.length !== undefined) {
                compareValue = compareValue[0];
            }
            if (baseValue && baseValue.length !== undefined) {
                baseValue = baseValue[0];
            }
            value = value && value.id ? value.id : value;
            compareValue = compareValue && compareValue.id ? compareValue.id : compareValue;
            baseValue = baseValue && baseValue.id ? baseValue.id : baseValue;
            if (typeof baseValue != "undefined" && baseValue != null)
                result = (compareValue == value) && (compareValue != baseValue) ? false : true;
            else
                result = (compareValue == value) ? false : true;
        } else if (properties.type == "boolean" || properties.type == "queryBoolean" || properties.type == "queryCheck") {
            result = (bizagi.util.parseBoolean(compareValue) == bizagi.util.parseBoolean(value)) ? false : true;
        } else if (properties.type == "searchNumber") {
            result = (value) ? true : false;
        } else if(properties.type == "actionLauncher"){
            //Object must be an array
            result = false;
            var compareValueObj = [];
            try {
                if(typeof compareValue === "string"){
                    compareValueObj = JSON.parse(compareValue);
                }
                else{
                    compareValueObj = compareValue;
                }
            } catch (e) {
            }

            var _findAction = function (guid, targetObj) {
                guid = guid || "";
                targetObj = targetObj || [];
                var result = false;
                for (var i = 0, l = targetObj.length; i < l; i++) {
                    if (targetObj[i].guidAction == guid) {
                        result = true;
                        break;
                    }
                }
                return result;
            };

            if (compareValueObj.length == value.length) {
                for (var i = 0, l = compareValueObj.length; i < l; i++) {
                    if (!_findAction(compareValueObj[i].guidAction, value)) {
                        result = true;
                    }
                }

            } else {
                result = true;
            }
		}else if(properties.type =="polymorphicLauncher" || properties.type =="entityTemplate"){
			//Object must be an array
			if(compareValue.length != value.length){
				result = true;
			} else{
				result = (JSON.encode(value) == JSON.encode(compareValue))?false :true;
			}
		} else if (properties.type == "image") {
            if (compareValue == null && value.indexOf(true) < 0) {
                result = false;
            }
            else {
                result = true;
            }
        } else if (properties.type == "searchList") {
            var objectValue = {};
            try{
                objectValue = JSON.parse(value);
            }
            catch(e){ console.log("Error when detect change value on searchList control") }
            result = (JSON.encode(compareValue) == JSON.encode(objectValue.value)) ? false : true;
        } else {
            result = (compareValue == value) ? false : true;
        }

        return result;
    },
    /* Customizes the font italic style */
    changeFontItalic: function (italic, isLabelFormat) {
        var self = this;
        var isLabelFormat = (typeof isLabelFormat != "undefined" || isLabelFormat != null) ? isLabelFormat : true;

        // Hide - show the render
        if (self.properties.displayType == "value" || !isLabelFormat) {
            if (bizagi.util.parseBoolean(italic) == true) {
                if (isLabelFormat)
                    self.getFormattingLabel().css("font-style", "italic", "!important");

                if (self.properties.editable) {
                    self.getControl().find("*").each(function (i, element) {
                        self.getElementsToStylize(element).css("font-style", "italic", "!important");
                    });
                } else {
                    self.getElementsToStylize(self.getControl()).css("font-style", "italic", "!important");
                }
            } else {
                if (isLabelFormat)
                    self.getFormattingLabel().css("font-style", "normal", "!important");

                if (self.properties.editable) {
                    self.getControl().find("*").each(function (i, element) {
                        self.getElementsToStylize(element).css("font-style", "normal", "!important");
                    });
                } else {
                    self.getElementsToStylize(self.getControl()).css("font-style", "normal", "!important");
                }
            }
        } else {
            if (bizagi.util.parseBoolean(italic) == true) {
                self.getFormattingLabel().css("font-style", "italic", "!important");
            } else {
                self.getFormattingLabel().css("font-style", "normal", "!important");
            }
        }
    },
    /* Customizes the font underline */
    changeFontUnderline: function (underline, isLabelFormat) {
        var self = this;
        var textFormat = self.properties.textFormat || {};
        var valueFormat = self.properties.valueFormat || {};
        var strikethru = bizagi.util.parseBoolean(textFormat.strikethru) ? "line-through " : "";
        var valuestrikethru = bizagi.util.parseBoolean(valueFormat.strikethru) ? "line-through " : "";
        var isLabelFormat = (typeof isLabelFormat != "undefined" || isLabelFormat != null) ? isLabelFormat : true;

        // Hide - show the render
        if (bizagi.util.parseBoolean(underline) == true && isLabelFormat) {
            self.getFormattingLabel().css("text-decoration", strikethru + "underline", "!important");
            self.getControl().each(function (i, element) {
                self.getElementsToStylize(element).css("text-decoration", strikethru + "underline");
            });
        } else {
            if (isLabelFormat)
                self.getFormattingLabel().css("text-decoration", strikethru, "!important");
        }
        if (self.properties.displayType == "value" || !isLabelFormat) {
            if (bizagi.util.parseBoolean(underline) == true) {
                if (self.properties.editable) {
                    self.getControl().find("*").each(function (i, element) {
                        self.getElementsToStylize(element).css("text-decoration", valuestrikethru + "underline", "!important");
                    });
                } else {
                    self.getElementsToStylize(self.getControl()).css("text-decoration", valuestrikethru + "underline", "!important");
                }
            } else {
                self.getControl().find("*").each(function (i, element) {
                    self.getElementsToStylize(element).css("text-decoration", valuestrikethru, "!important");
                });
            }
        }
    },
    /* Customizes the font Strikethrough property */
    changeFontStrikethru: function (strikethru, isLabelFormat) {
        var self = this;
        var textFormat = self.properties.textFormat || {};
        var valueFormat = self.properties.valueFormat || {};
        var underline = bizagi.util.parseBoolean(textFormat.underline) ? "underline " : "";
        var valueunderline = bizagi.util.parseBoolean(valueFormat.underline) ? "underline " : "";
        var isLabelFormat = (typeof isLabelFormat != "undefined" || isLabelFormat != null) ? isLabelFormat : true;

        // Hide - show the render
        if (bizagi.util.parseBoolean(strikethru) == true && isLabelFormat) {
            self.getFormattingLabel().css("text-decoration", underline + "line-through", "!important");
        } else {
            if (isLabelFormat)
                self.getFormattingLabel().css("text-decoration", underline, "!important");
        }
        if (self.properties.displayType == "value" || !isLabelFormat) {
            if (bizagi.util.parseBoolean(strikethru) == true) {
                if (self.properties.editable) {
                    self.getControl().find("*").each(function (i, element) {
                        self.getElementsToStylize(element).css("text-decoration", valueunderline + "line-through", "!important");
                    });
                } else {
                    self.getElementsToStylize(self.getControl()).css("text-decoration", valueunderline + "line-through", "!important");
                }
            } else {
                if (self.properties.editable) {
                    self.getControl().find("*").each(function (i, element) {
                        self.getElementsToStylize(element).css("text-decoration", valueunderline, "!important");
                    });
                } else {
                    self.getElementsToStylize(self.getControl()).css("text-decoration", valueunderline, "!important");
                }
            }
        }
    },
    /* Customizes the font size property */
    changeFontSize: function (size, isLabelFormat) {
        var self = this;
        var isLabelFormat = (typeof isLabelFormat != "undefined" || isLabelFormat != null) ? isLabelFormat : true;

        // Hide - show the render
        if (size != "0") {
            var label = self.getFormattingLabel();
            var newFontSize = (100 + Number(size) * 10) + "%";
            if (isLabelFormat) {
                label.css("font-size", newFontSize, "!important");
            }
            if (self.properties.displayType == "value" || !isLabelFormat) {
                var control = self.getControl();
                if (typeof control.children() == "object" && control.children().length > 0) {
                    self.getElementsToStylize(control.children()).css("font-size", newFontSize, "!important");
                } else {
                    self.getElementsToStylize(control).css("font-size", newFontSize, "!important");
                    // Next line applies to Cascading combo and combo in order to increase the control space with large value fonts
                    if (self.properties.type.indexOf("ombo") != -1 && size > 4) (".ui-selectmenu", control).children(0).height(2 * size + 20);
                }

                self.getElementsToStylize(control.find(".ui-bizagi-render-date")).css("line-height", "normal");
            }
        }
    },

    /**
    * in mobiles, don't apply styles to icon's elements
    */
    getElementsToStylize: function(context){
        return $(context);
    },

    /* Changes the render visibility*/
    changeVisibility: function (argument) {
        var self = this,
                properties = self.properties;

        // Hide - show the render
        if (bizagi.util.parseBoolean(argument) == true) {
            if (properties.type !== "hidden") {
                self.element.show();
                self.element.css("display", "");
            }
        } else if (self.element) {
            self.element.hide();
        }

        // Update properties
        properties.visible = argument;
    },
    /* Changes the render editability*/
    changeEditability: function (argument) {
        var self = this,
                properties = self.properties;
        var control = self.getControl();

        // Renders again
        properties.editable = bizagi.util.parseBoolean(argument);

        // Clears control
        control.empty();
        if (typeof self.internalRenderControl == "function") {
            $.when(self.internalRenderControl()).
                    done(function (html) {
                        if(typeof self.emptyControlByChangeEditability == "function"){
                            self.emptyControlByChangeEditability();
                        }
                        control.append(html);
                        self.postRenderElement(self.element);
                    });

        }
    },

    /*
    * change cell editability and attach bindings
    */
    changeEditabilityCellControl: function (argument, key, xpath) {
        var self = this,
        properties = self.properties;
        var control = self.getControl();

        var renderColumn = self.grid.getColumn(xpath);
        var decorated = renderColumn.getDecorated(key);

        // Renders again
        properties.editable = bizagi.util.parseBoolean(argument);

        // Clears control
        control.empty();
        if (typeof self.internalRenderControl == "function") {
            $.when(self.internalRenderControl()).
                done(function (html) {
                    control.append(html);
                    self.postRenderElement(self.element);

                    if (properties.editable) {

                        renderColumn.bind("rendered", function () {
                            renderColumn.readyDeferred.resolve();
                        });

                        // If the render changes set the flag on
                        decorated.bind("renderchange", function (render, args) {
                            renderColumn.changed = true;
                            self.grid.onCellChange(renderColumn, null, key, args);
                        });
                    }
                });
        }
    },

    changeRequired: function (argument) {
        var self = this,
                properties = self.properties;

        var label = properties.displayName || "";
        var labelElement = $("label", self.getLabel());
        var controlElement = self.getControl();

        // Update properties
        properties.required = argument;

        // Changes label

        if (self.getMode() == "execution" && self.checkRequired([])) {

            self.changeRequiredLabel(false);

        } else if (bizagi.util.parseBoolean(argument) == true && properties.editable) {
            if (self.properties.orientation == "rtl") {
                controlElement.prepend('<div class="ui-bizagi-render-control-required-rtl"></div>');
            }
            else {
                controlElement.prepend('<div class="ui-bizagi-render-control-required"></div>');
            }
            /*label = label + '<span class="ui-bizagi-render-required"></span>';*/
        } else {
            // if element has required label and through action change it, remove element.
            if (self.properties.orientation == "rtl") {
                $(".ui-bizagi-render-control-required-rtl", controlElement).remove();
            }
            else {
                $(".ui-bizagi-render-control-required", controlElement).remove();
            }
        }

        // Set text
        //labelElement.text(label); // HTML is more suitable for the content
        labelElement.html(label);

        // Perform validations again to check if the form is valid after this change
        self.triggerRenderValidate();
    },
    /**
    * This method just make a toggle of red label indicator
    * Does't change internal value of control, if you need it
    * please use changeRequired method
    *
    * @argument {boolean} argument
    */
    changeRequiredLabel: function (argument) {
        var self = this,
                properties = self.properties;

        var label = properties.displayName || "";
        var labelElement = $("label", self.getLabel());
        var controlElement = self.getControl();

        // Changes label
        if (bizagi.util.parseBoolean(argument) == true && properties.editable) {
            if (self.properties.orientation == "rtl") {
                controlElement.prepend('<div class="ui-bizagi-render-control-required-rtl"></div>');
            }
            else {
                controlElement.prepend('<div class="ui-bizagi-render-control-required"></div>');
            }
            /*label = label + '<span class="ui-bizagi-render-required"></span>';*/
        } else {
            // if element has required label and through action change it, remove element.
            if (self.properties.orientation == "rtl") {
                $(".ui-bizagi-render-control-required-rtl", controlElement).remove();
            }
            else {
                $(".ui-bizagi-render-control-required", controlElement).remove();
            }
        }

        // Set text
        //labelElement.text(label); // HTML is more suitable for the content
        labelElement.html(label);

        // Perform validations again to check if the form is valid after this change
        self.triggerRenderValidate();
    },
    /*
    *   Refresh the control with a new data
    */
    refreshControl: function (args) {
        var self = this;
        var properties = self.properties;
        var originalValue = self.value;
		var form = self.getFormContainer();
		var idForm = form.properties.id || "";

        args = args || {};

        // Start waiting
        self.startLoading();

        // Execute personalized stuff before to refresh it
        self.beforeToRefresh();

        // Call the ajax service
        return $.when(self.dataService.multiaction().refreshControl({
            xpath: properties.xpath,
            idRender: properties.id,
            idPageCache: properties.idPageCache,
            xpathContext: (properties.xpathContext || args.xpathContext),
			idForm:idForm
        })).pipe(function (data) {
            // Clear variables
            self.control = self.controlFiller = self.label = null;

            // Update properties data
            var currentElement = self.element;
            self.initializeData(data.render);

            // Render the control again
            return $.when(self.render()).pipe(function (html) {
                var result = $(html);
                //Dont remove unused rendered var
                var rendered = self.postRenderElement(result);
                self.properties.originalValue = self.value;
                return result;
            }).pipe(function (result) {
                // When the content has been post-renderized, replace it
                currentElement.replaceWith(result);
                self.triggerRenderChange({ changed: false });

                // Execute personalized stuff before to refresh it
                self.afterToRefresh();
            });

        }).fail(function (message) {
            var message = self.processFailMessage(message);

        }).always(function () {
            self.endLoading();
        });
    },

    /*
     *   Refresh the control with a new data
     */
    refreshDesignControl: function (data) {
        var self = this;
        var properties = self.properties;

        // Execute personalized stuff before to refresh it
        self.beforeToRefresh();

        // Clear variables
        self.control = self.controlFiller = self.label = null;

        $.extend(data.render.properties, {
            xpath: properties.xpath,
            idRender: properties.id,
            xpathContext: (properties.xpathContext || "form"),
            idPageCache: properties.idPageCache
        });


        // Update properties data
        var currentElement = self.element;
        self.initializeData(data.render);

        // Render the control again
        return $.when(self.render()).pipe(function (html) {
            var result = $(html);
            //Dont remove unused rendered var
            var rendered = self.postRenderElement(result);
            self.properties.originalValue = self.value;
            return result;
        }).pipe(function (result) {
            // When the content has been post-renderized, replace it
            currentElement.replaceWith(result);
            self.triggerRenderChange();

            // Execute personalized stuff before to refresh it
            self.beforeToRefresh();
        });
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
        var input = control.find("input");
        if (input.length > 0) {
            input.val(self.getValue());
        } else if (self.properties.editable === false) {
            $(control).html("<label class='readonly-control'></label>");
        }
    },

    /*
    *   Updates original value for some comparisons
    */
    updateOriginalValue: function () {
        var self = this;
        self.properties.originalValue = self.value;
    },
    /*
    *   Add the render data to the given collection in order to send data to the server
    */
    collectData: function (renderValues) {
        var self = this;
        var properties = self.properties;

        // Add the render value
        var xpath = properties.xpath;
        var value = self.getValue();

        if (self.controlValueIsChanged()) {
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

    hasChanged: function (result) {
        var self = this;
        if (self.controlValueIsChanged()) {
            result.push(true);
            return true;
        } else {
            return false;
        }
    },

    /*
    *  Configure aditional Handlers for queryForm type
    */
    configureHandlersQueryForm: function () {
        var self = this;
        var checkIncluded = self.element.find(".ui-bizagi-render-control-included");
        checkIncluded.change(function () {
            self.properties.included = $(this).is(":checked");
        });
    },
    /*
    *   Add the render data to the given collection in order to send data to the server
    */
    collectDataQueryForm: function (renderValues) {
        var self = this;
        var properties = self.properties;
        var xpath = properties.xpath;
        var value = self.getValue();
        var queryValue = null;
        if (!bizagi.util.isEmpty(xpath)) {
            if (value !== null && typeof (value) !== "undefined") {
                var isObject = typeof (value.id) !== "undefined";
                if (isObject) {
                    queryValue = (!bizagi.util.isEmpty(value.id)) ? [value] : null;
                } else {
                    queryValue = (value !== "") ? value : null;
                }
            }
            if (queryValue !== null || properties.included) {
                var searchType = self.properties.typeSearch || self.properties.rangeQuery || "NONE";
                searchType = searchType.toUpperCase();
                var newParameter = { "value": queryValue, "included": self.properties.included, "xpath": properties.xpath, "searchType": searchType, "orderType": "NONE" };
                if (typeof properties.displayXpath !== "undefined" && properties.displayXpath !== "") {
                    //newParameter.displayXpath= properties.xpath+"."+properties.displayXpath;
                    newParameter.displayXpath = properties.displayXpath;
                }
                renderValues.push(newParameter);
            }
        }
    },

    /*
    *  Method to determine if the render value can be sent to the server or not
    */
    canBeSent: function () {
        var self = this, force;
        var properties = self.properties;
        var displayOnly = bizagi.util.parseBoolean(properties.displayOnly) || false;
        var editable = properties.editable;

        // The render can be sent if it is editable and is not "display only"
        if (!displayOnly && editable) {
            return true;
        }

        // Don't send the clones
        if (properties.isClone) {
            return false;
        }

        if (properties.xpath) {
            var form = self.getFormContainer();
            if (form.getRenders(properties.xpath).length == 1) {
                force = $.forceCollectData ? $.forceCollectData.toString() : false;
                $.forceCollectData = force ? undefined : $.forceCollectData;
                if (self.controlValueIsChanged()) {
                    $.forceCollectData = force ? bizagi.util.parseBoolean(force) : $.forceCollectData;
                    return true;
                }
                $.forceCollectData = force ? bizagi.util.parseBoolean(force) : $.forceCollectData;
            }
        }

        return false;
    },
    /*
    *  Method to determine if the render value can be sent to search
    */
    canBeSentQueryForm: function () {
        var self = this, force;
        var properties = self.properties;
        // Don't send the clones
        if (properties.isClone) {
            return false;
        }
        return true;
    },
    /*
    *   Focus on the current element
    */
    focus: function (time) {
        var self = this;

        // Focus is only allowed when the render is visible
        if (!self.properties.visible) return;

        // Call base
        this._super();
        var layout = $("#ui-bizagi-wp-app-render-form-content");

        // Configures effect
        var effect = function () {
            var control = self.getControl();
            var defaultControl = (self.properties.type != "grid") ? $("input, select, option, textarea", control) : $("input, select, option, textarea", control).first();
            if (defaultControl.length > 0) {

                // Focus control
                $.each(defaultControl, function (i) {
                    var innerControl = defaultControl[i];
                    if ($(innerControl).attr("type") != "hidden" &&
                            $(innerControl).css("display") != "none" &&
                            $(innerControl).css("visibility") != "hidden") {

                        try {
                            if (!bizagi.util.isIE()) {
                                bizagi.util.autoScrollBottom(layout);
                            }
                            innerControl.focus();
                        } catch (e) {
                        }
                    }
                });
            }
        };

        // Wait until the render is ready to apply the focus effect
        $.when(self.ready())
                .done(function () {
                    // Run effect
                    if (time > 0) {
                        setTimeout(effect, time);

                    } else {
                        effect();
                    }
                });

    },
    /*
    *   Resolves default align for each display type
    */
    getDefaultLabelAlign: function (displayType) {
        displayType = displayType || "normal";

        if (displayType == "normal" ||
                displayType == "both") {
            return "left";

        } else if (displayType == "vertical") {
            return "left";

        } else if (displayType == "reversed") {
            return "left";

        } else if (displayType == "verticalReversed") {
            return "left";

        } else if (displayType == "label") {
            return "left";

        } else if (displayType == "value") {
            return "left";
        }

        return "";
    },
    /*
    *   Resolves default value align for each display type
    */
    getDefaultValueAlign: function (displayType) {
        displayType = displayType || "normal";

        if (displayType == "normal" ||
                displayType == "both") {
            return "left";

        } else if (displayType == "vertical") {
            return "left";

        } else if (displayType == "reversed") {
            return "right";

        } else if (displayType == "verticalReversed") {
            return "left";

        } else if (displayType == "label") {
            return "left";

        } else if (displayType == "value") {
            return "left";
        }

        return "";
    },

    /*
    *   Enables submit on change feature for the current render
    */
    configureSubmitOnChange: function () {
        var self = this,
                properties = self.properties,
                xpath = "";

        if (!properties.editable) {
            return;
        }

        // Build action
        properties.dependencies = properties.dependencies || 'all';

        if (properties.xpath) {
            if (properties.submitOnChangexpathContext) {
                xpath = properties.submitOnChangexpathContext + "." + properties.xpath;
            } else {
                xpath = properties.xpath;
            }
        } else {
            if (properties.submitOnChangexpathContext) {
                xpath = properties.submitOnChangexpathContext + "." + properties.id;
            } else {
                xpath = properties.id;
            }
        }

        var action = {
            "conditions": {
                "expressions": [
                    {
                        "simple": {
                            "xpath": xpath,
                            "operator": "changes",
                            "argumentType": "const"
                        }
                    }
                ]
            },
            "commands": [{
                "xpath": xpath,
                "command": 'submit-value',
                "argument": properties.dependencies
            }],
            "dependencies": [xpath],
            "elseCommands": []
        };

        // Add action when form ends its rendering
        $.when(self.ready())
                .done(function () {
                    var form = self.getFormContainer();
                    form.addSubmitAction(xpath, action);
                });
    },

    /*
    *   Sends all the info to the server then refreshes the form
    *   Returns a deferred
    */
    submitOnChange: function (data, bRefreshForm, notCollect) {
        var self = this;
        var defer = $.Deferred();

        // Add context parameter
        if (self.properties.contexttype != "" && data) {
            data[self.dataService.Class.BA_CONTEXT_PARAMETER_PREFIX + "contexttype"] = self.properties.contexttype;
        }

        $.when(self.isReadyToSave())
                .done(function () {
                    self.internalSubmitOnChange(data, bRefreshForm, notCollect).done(function () {
                        defer.resolve();
                    }).fail(function () {
                        defer.reject();
                    });
                });

        return defer.promise();
    },

    getCacheIdCase: function () {
        var self = this;
        var idCase = self.getParams().idCase;

        if (bizagi.cache === undefined) {
            bizagi.cache = {};
            bizagi.cache.idCaseObject = {
                idCase: idCase !== undefined ? idCase : (bizagi.cache.idCase !== undefined ? bizagi.cache.idCase : undefined)
            };
        } else {
            if (idCase !== undefined && bizagi.cache.idCaseObject !== undefined) {
                bizagi.cache.idCaseObject.idCase = idCase;
            } else {
                if (idCase !== undefined && bizagi.cache.idCaseObject === undefined) {
                    bizagi.cache.idCaseObject = {};
                    bizagi.cache.idCaseObject.idCase = idCase;
                }
            }
        }

        if (idCase === undefined) {
            if (bizagi.cache.idCaseObject === undefined) {
                idCase = undefined;
            } else {
                idCase = bizagi.cache.idCaseObject.idCase;
            }
        } else {
            idCase = idCase;
        }

        return idCase;
    },
    /*
    *   Internal method
    *   Sends all the info to the server then refreshes the form
    *   Returns a deferred
    */
    internalSubmitOnChange: function (data, bRefreshForm, notCollect) {
        var self = this;
        var form = self.getFormContainer();
        var properties = self.properties;
        var parameters = {
            data: data,
            bRefreshForm: bRefreshForm,
            notCollect: notCollect,
            properties: {
                idCase: self.getCacheIdCase(),
                id: properties.id,
                xpath: properties.xpath,
                idPageCache: properties.idPageCache,
                contexttype: properties.contexttype
            }
        }

        return form.internalSubmitOnChange(parameters);
    },
    /*
    *   Returns a promise that will resolve when the element is ready
    */
    ready: function () {
        var self = this;
        return $.when(self.parent.ready(), self.isRendered());
    },
    /*
    *   Get the custom handlers set for this execution
    */
    getCustomHandlers: function () {
        var self = this;
        var form = self.getFormContainer();

        if (form) {
            return form.getCustomHandlers();
        }
        return null;
    },
    /*
    *   Get the custom handlers set for this execution
    */
    getCustomHandler: function (key) {
        var self = this;
        var customHandlers = self.getCustomHandlers();

        if (customHandlers) {
            return customHandlers[key];
        }
        return null;
    },
    /*
    *   Transform the display type when using RTL orientation
    */
    getRTLDisplayType: function (displayType) {
        if (displayType == "normal" || displayType == "both")
            return "reversed";
        if (displayType == "reversed")
            return "normal";
        return displayType;
    },
    /*
    *   Transform the align type when using RTL orientation
    */
    getRTLAlign: function (align) {
        if (align == "default" || align == "left") {
            return "right";
        }
        if (align == "right") {
            return "left";
        }

        return align;
    },
    /*
    *   Calculates render label and value width
    */
    calculateRenderWidth: function (labelWidth, valueWidth, displayType) {
        var self = this;
        // Read values
        // If the label width or the value width are 0, the BAS means that no value is used, so we need to adjust them to 50%
        if(valueWidth == "100" && typeof labelWidth === "undefined"){
            labelWidth = "0";
        }
        else{
            labelWidth = labelWidth ? (labelWidth != "0" ? labelWidth : "50") : "50%";
        }
        valueWidth = valueWidth ? (valueWidth != "0" ? valueWidth : "50") : "50%";

        if (displayType == "normal" ||
                displayType == "both" ||
                displayType == "reversed") {

            // Special case with lower values, so they want both fields in "auto" width
            if (labelWidth && bizagi.util.percent2Number(labelWidth) < 5 &&
                    valueWidth && bizagi.util.percent2Number(valueWidth) < 5) {
                return { label: 0, control: 100 };
            }
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
        } else {
            labelWidth = 100;
            valueWidth = 100;
        }

        return { label: labelWidth, control: valueWidth };
    },
    /*
    *   Get param value idCase
    */
    getIdCase: function () {
        var self = this;
        return self.getFormContainer().params.idCase || bizagi.context.idCase;
    },
    /*
    *   Get param value idWorkitem
    */
    getIdWorkitem: function () {
        var self = this;
        return self.getFormContainer().params.idWorkitem || bizagi.context.idWorkitem;
    },
    /*
    *   Get param value idTask
    */
    getidTask: function () {
        var self = this;
        return self.getFormContainer().params.idTask || bizagi.context.idTask;
    },
    /*
    *   Get param value sessionId
    */
    getSessionId: function () {
        var self = this;
        return self.getFormContainer().properties.sessionId;
    },
    /*
    *   CELL STUFF
    *   TODO: Move to other place
    */

    /* Customizes cell color*/
    changeCellColor: function (color) {
        var self = this;
        var control = self.getControl();
        if (control) {
            if (color != 'none') {
                control.css("color", color);
                control.find("input, textarea, label").each(function (i, element) {
                    $(element).css("color", color);
                });
            } else {
                control.css("color", "");
                control.find("input, textarea, label").each(function (i, element) {
                    $(element).css("color", "");
                });
            }
        }
    },
    /* Customizes cell background color*/
    changeCellBackgroundColor: function (color) {
        var self = this;
        var control = self.getControl();
        var backgroundColor = "";
        var backgroundImage = "";

        if (control) {
            if (color != 'none') {
                backgroundColor = color;
                backgroundImage = "none";
            }

            if (self.properties.editable) {
                var needBGPaint = false;

                control.find("input, textarea, .ui-selectmenu").each(function (i, element) {

                    if (((element.type == "text") || (element.type == "textarea")) && !($(element).hasClass('ui-select-data')))
                        needBGPaint = true;

                    $(element).css({
                        "background-color": backgroundColor,
                        "background-image": backgroundImage
                    });
                });

                if (!needBGPaint) {
                    control.closest("td").each(function (i, element) {
                        $(element).css({
                            "background-color": backgroundColor,
                            "background-image": backgroundImage
                        });
                    });
                }

            } else {
                control.each(function (i, element) {
                    var item = ($(element).hasClass("ui-bizagi-cell-readonly")) ? control.closest("td") : $(element);
                    item.css({
                        "background-color": backgroundColor,
                        "background-image": backgroundImage
                    });
                });
            }
        }

    },
    /* Changes the cell visibility*/
    changeCellVisibility: function (argument) {
        var self = this;
        var properties = self.properties;
        var control = self.getControl();

        if (control) {
            // Hide - show the render
            if (bizagi.util.parseBoolean(argument) == true) {
                //control.show();
                control.css("visibility", "visible");
                control.css("display", "");
            } else {
                //control.hide();
                control.css("visibility", "hidden");
            }
        }

        // Update properties
        properties.visible = argument;
    },
    changeCellRequired: function (argument) {
        var self = this;
        var properties = self.properties;
        var control = self.getControl();

        if (control) {
            // Check if argument is true and control donot have any value
            if (bizagi.util.parseBoolean(argument) == true && bizagi.util.isEmpty(self.value)) {
                control.prepend('<div class="ui-bizagi-render-control-required"></div>');
            } else {
                $(".ui-bizagi-render-control-required", control).remove();
            }
            // Update properties
            properties.required = argument;
        }
    },

    /*method to create deferred at the moment to start multiaction */
    startActionExecution: function () {
        var self = this;
        self.startLoading();
        self.actionExecutionDeferred = new $.Deferred();
    },

    /*method to resolve the deferred when multiaction finish*/
    endActionExecution: function () {
        var self = this;
        self.endLoading();
        if (self.actionExecutionDeferred) self.actionExecutionDeferred.resolve();
        delete self.actionExecutionDeferred;
    },

    /*method to return the promise to anyone that needs to know if multiaction ended*/
    readyActionExecution: function () {
        var self = this;
        if (!self.actionExecutionDeferred) return $.when(true);
        return self.actionExecutionDeferred.promise();
    },

    /*
    * Verifies is the elements was inside a new row in a grid
    */
    isFromCreatedRow: function () {
        var self = this;

        if (self.grid) {
            var i = self.grid.columns.length;

            while (i-- > 0) {
                if (self.grid.columns[i].properties.xpath == self.properties.xpath) {
                    if (self.grid.columns[i].isNewRow == true) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

});
