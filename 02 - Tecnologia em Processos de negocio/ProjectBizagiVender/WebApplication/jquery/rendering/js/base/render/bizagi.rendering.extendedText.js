/*
 *   Name: BizAgi Render Text Class
 *   Author: Diego Parra
 *   Comments:
 *   -   This script will define basic stuff for text renders
 */

bizagi.rendering.render.extend("bizagi.rendering.extendedText", {}, {

    /*
    *   Update or init the element data
    */
    initializeData: function (data) {
        var self = this;
        // Call base
        this._super(data);

        // Fill default properties
        var properties = this.properties;
        if (properties.regularExpressionExpression) {
            properties.regularExpression = {
                "expression": properties.regularExpressionExpression,
                "message": properties.regularExpressionMessage || this.getResource("render-text-regular-expression-default-message")
            };
        }
    },
    /*
    *   Template method to implement in each children to customize each control
    */
    renderControl: function () {
        var self = this;
        var template = self.renderFactory.getTemplate("extendedText");

        // Render template
        var html = $.fasttmpl(template, {"isEmptyField": typeof self.properties.value === "undefined"});
        return html;
    },
    /*
    *   Template method to implement in each device to customize each render after processed
    */
    postRender: function () {
        var self = this;
        self._super();
        var control = self.getControl();
        var properties = self.properties;
        self.textarea = control.find("textarea");

        //if is textarea, then enable resize element.
        if(self.textarea){
            self.textarea.css({
                resize: "both"
            });
        }else{
            self.textarea.css({
                resize: "none"
            });
        }

        //Attach event for retype double
        if (properties.retype == "double") {
            self.attachRetypeDouble();
        }
    },

    //function virtual implements on children (desktop,samrtphone...).
    attachRetypeDouble: function () {
    },
    /*
    *   Template method to implement in each device to customize the render's behaviour to add handlers
    */
    configureHandlers: function () {
        var self = this;
        var properties = self.properties;

        // Set the default maxlenght for the input if is 0 or undefined set to infinity
        // this resolve issue with scope strings that don't have maxlength
        if (properties.maxLength)
            self.textarea.prop('maxlength', properties.maxLength);

        (properties.maxLines) ? self.textarea.prop('rows', properties.maxLines): self.textarea.prop('rows', 6);

        // Attach change event
        self.textarea.bind("change", function () {

            // Updates internal value
            var oldValue = self.getValue();
            self.setValue(self.textarea.val());

            // Check that the value is valid
            var validationMessages = [];
            if (properties.retype != "duplicate") {
                if (self.isValid(validationMessages) || typeof (properties.regularExpression) == "undefined") {
                    // Update value again triggering handlers
                    self.setValue(self.textarea.val(), true);
                } else {
                    // Set error message
                    var message = validationMessages[0].message;
                    bizagi.showMessageBox(message, "Bizagi", "error");
                }
            }

        });

        // Attach blur event
        self.textarea.bind("blur", function () {

            // Updates internal value
            self.setValue(self.textarea.val());
        });
    },
    /*
    * Public method to determine if a value is valid or not
    */
    isValid: function(invalidElements) {
        var self = this;
        var properties = self.properties;
        var message;

        // Call base
        var bValid = this._super(invalidElements);
        var value = self.getValue();

        // Check is offline form        
        var isOfflineForm = bizagi.util.isOfflineForm({ context: self });

        // Check regular expression
        if (properties.regularExpression) {

            // Offline capability
            if (isOfflineForm && bizagi.util.isTabletDevice()) {
                value = typeof (value) === "object" && value.value ? value.value : value;
            }

            if (value && ((value.match(new RegExp(".*?(<|\\u003C)(.+?)(>|\\u003E)(.?)|eval\\(|eval\\u0028", "g")))
                || (!value.match(new RegExp(properties.regularExpression.expression))
                    && self.properties && self.properties.xpath === "userName"))) {
                message = properties.regularExpression.message;
                invalidElements.push({ xpath: properties.xpath, message: message });
                bValid = false;
            } else {
                if (value && ((value.match(new RegExp(".*?(<|\\u003C)(.+?)(>|\\u003E)(.?)|eval\\(|eval\\u0028", "g")))
                    || (!value.match(new RegExp(properties.regularExpression.expression))))) {
                    message = properties.regularExpression.message;
                    invalidElements.push({ xpath: properties.xpath, message: message });
                    bValid = false;
                }
            }
        } else {
            if (value && (value.match(new RegExp(".*?(<|\\u003C)(.+?)(>|\\u003E)(.?)|eval\\(|eval\\u0028", "g")))) {
                if (properties.editable) {
                    message = this.getResource("render-text-regular-expression-default-message");
                    invalidElements.push({ xpath: properties.xpath, message: message });
                    bValid = false;
                }
            }
        }

        return bValid;
    },
    /*
    *   Sets the value in the rendered control
    */
    setDisplayValue: function (value) {
        var self = this;
        var control = self.getControl();
        var displayValue = self.getDisplayValue();
        var decodedValue = bizagi.util.decodeURI(value);
        var decodedDisplayValue = bizagi.util.decodeURI(displayValue);
        if (self.properties.editable == false) {
            // Render as simple value
            if (typeof (value) == "string") {

                // Replace line breaks for html line breaks
                var valueToDisplay = decodedDisplayValue.replaceAll("&", "&amp;");
                valueToDisplay = valueToDisplay.replaceAll("<", "&lt;").replaceAll(">", "&gt;");
                valueToDisplay = valueToDisplay.replaceAll("\"", "&#34;").replaceAll("'", "&#39;").replaceAll("/", "&#47;");
                valueToDisplay = valueToDisplay.replaceAll("\\n", "<br/>");
                valueToDisplay = valueToDisplay.replaceAll("\n", "<br/>");

                control.html(valueToDisplay);
            }
        }

        // Set internal value
        self.setValue(decodedValue, false);
    },
    /*
    *   Add the render data to the given collection in order to send data to the server
    */
    collectData: function (renderValues) {
        var self = this;
        var properties = self.properties;

        // Call base
        self._super(renderValues);
    },
    /**
    * Extend setValue to fix all encode data from database
    * More information SUITE-9407
    */
    setValue: function (value) {
        var self = this;
        var decodedValue = bizagi.util.decodeURI(value);

        self._super(decodedValue);
    }
});
