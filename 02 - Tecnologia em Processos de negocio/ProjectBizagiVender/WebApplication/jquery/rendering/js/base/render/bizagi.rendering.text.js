/*
 *   Name: BizAgi Render Text Class
 *   Author: Diego Parra
 *   Comments:
 *   -   This script will define basic stuff for text renders
 */

bizagi.rendering.render.extend("bizagi.rendering.text", {}, {
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
        var properties = self.properties;
        var template = self.renderFactory.getTemplate("text");

        // Render template
        var html = $.fasttmpl(template, {value: '', "isEmptyField": typeof properties.value === "undefined"});
        return html;
    },

    renderReadOnly:function(){
        var self = this;
        var properties = self.properties;
        var template = self.renderFactory.getTemplate("text-read-only");

        // Render template
        var html = $.fasttmpl(template, { value: self.getValue() });
        return html;
    },

    /*
    *   Template method to implement in each device to customize each render after processed
    */
    postRender: function () {
        var self = this;
        var control = self.getControl();
        var properties = self.properties;

        // Call base
        self._super();

        self.input = control.find("input");
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
        var control = self.getControl();
        var input = self.input;

        // Check mask property
        if (properties.mask) {
            self.input.mask({ mask: properties.mask });
        }

        // Attach change event
        self.input.bind("change", function () {

            // Updates internal value
            var oldValue = self.getValue();
            self.setValue(self.input.val(), false);

            // Check that the value is valid
            var validationMessages = [];
            if (properties.retype != "duplicate") {
                if (self.isValid(validationMessages) || typeof (properties.regularExpression) == "undefined") {
                    // Update value again triggering handlers
                    self.setValue(self.input.val(), true);
                } else {
                    // Set error message
                    message = validationMessages[0].message;
                    //bizagi.showMessageBox(message, "Bizagi", "error");
                }
            }

        }).keypress(function (e) {
            e = window.event || e;
            var keyUnicode = e.charCode || e.keyCode;
            if (e !== undefined) {
                if (keyUnicode == 13) {
                    $(this).trigger("change");
                }
            }
        });
    },
    /* 
    * Public method to determine if a value is valid or not
    */
    isValid: function (invalidElements) {
        var self = this,
                properties = self.properties;

        // Call base
        var bValid = this._super(invalidElements);
        var value = self.getValue();

        //When the form have big data, block browser executing RegExp. QAF-1418.
        // Check regular expression
        if (typeof value == "string") {
            if (properties.regularExpression) {
                if (value && ((value.match(new RegExp(".*?(<|\\u003C)(.+?)(>|\\u003E)(.?)|eval\\(|eval\\u0028", "g"))) || (!value.match(new RegExp(properties.regularExpression.expression)) && self.properties && self.properties.xpath === "userName"))) {
                    var message = properties.regularExpression.message;
                    invalidElements.push({ xpath: properties.xpath, message: message });
                    bValid = false;
                } else {
                    if (value && ((value.match(new RegExp(".*?(<|\\u003C)(.+?)(>|\\u003E)(.?)|eval\\(|eval\\u0028", "g"))) || (!value.match(new RegExp(properties.regularExpression.expression))))) {
                        var message = properties.regularExpression.message;
                        invalidElements.push({ xpath: properties.xpath, message: message });
                        bValid = false;
                    }
                }
            } else {
                //strange behavior on IE. When matchs are united on IE have is very slow
                //solution, divide matchs
                //.*? means for more information search: "Lazy matching regexp"
                if (value && (value.match(new RegExp(".*?eval\\(", "g"))) && (value.match(new RegExp(".*?eval\\u0028", "g")))) {
                    if (properties.editable) {
                        var message = this.getResource("render-text-regular-expression-default-message");
                        invalidElements.push({ xpath: properties.xpath, message: message });
                        bValid = false;
                    }
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
                
		// TODO: Review on Mobile
                /*if (self.input){
                    self.input.html(valueToDisplay);
                }
                else{*/
                    control.html(valueToDisplay);
                //}
            } else {
                if (bizagi.util.isNull(value)) {
                    control.html("");
                }
            }
        }

        // Set internal value
        self.setValue(decodedValue, false);
    },
    /**
    * Extend setValue to fix all encode data from database
    * More information SUITE-9407
    */
    setValue: function (value) {
        /*ISUPP-4116/*
        /*var decodedValue = bizagi.util.decodeURI(value);*/
        var self = this;
        self._super(value);
    }
});