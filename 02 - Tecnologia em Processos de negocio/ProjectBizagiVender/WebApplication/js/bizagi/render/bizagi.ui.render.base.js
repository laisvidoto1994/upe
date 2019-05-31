    /* GLOBAL CONSTANTS */
/* Those must come from the server*/
var BA_CURRENT_CULTURE = "es-CO";
var BA_DEFAULT_DATE_FORMAT = "MM/dd/yyyy";
var BA_DEFAULT_TIME_FORMAT = "hh:mm:ss a";


/*
 * jQuery BizAgi Base Render Widget 0.1
 *
 * Copyright (c) http://www.bizagi.com
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 *	jquery.metadata.js
 */
// Global constants
var BIZAGI_RENDER_POPUP_WIDTH = 800;
var BIZAGI_GETXPATH_URL = "ajax/AjaxGetXPath.aspx";
    
(function ($) {

    // Set default language
    if (!BA_CURRENT_CULTURE){
        BA_CURRENT_CULTURE = "en-US";
    }

    // Load resource
    $.bizAgiResources = $.bizAgiRegions[BA_CURRENT_CULTURE];

    // Set communication defaults
    $.bizAgiCommunication = {   dataType: "json",  // choose jsonp or json
                                jsonpParam: "callback",
                                type: "POST" };
    if ($.bizAgiCommunication.dataType == "json") $.bizAgiCommunication.jsonpParam = "";
    if ($.bizAgiCommunication.dataType == "jsonp") $.bizAgiCommunication.type = "GET";

    // Base widget definition
    $.ui.widget.subclass("ui.baseRender", {
        /* Default options here*/
        options: {
            properties: {},
            containerEditable: true,
            type: ''
        },

        /* Constructor */
        _create: function () {

            // Set variables
            var self = this,
            o = self.options,
            el = self.element;

            // Set access through baseClass
            $(self.element).data("baseRender", this);

            // Extract metadata
            var properties = o.properties = el.metadata({ type: 'attr', name: 'properties', single: 'bizagi' });
            
            // Clone properties
            o.originalProperties = JSON.parse( JSON.encode(properties)); 
            
            // Define editability
            properties.editable = (typeof properties.editable != "undefined") ? properties.editable : true;
            
            // Overrides editable
            if (!o.containerEditable || !properties.editable) {
                properties.editable = false;
            }

            // Apply defaults
            self.applyElementDefaults();
            
            // Cache basic layout elements
            self.label = $(".ui-bizagi-label", el);
            self.control = $(".ui-bizagi-render-control", el);

            // Renders the control
            self._internalRender();

            // Add classic retype validation
            if (properties.reType == "double"){
                self._processClassicRetype();
            }

            // Add hint dfeature
            if (properties.hint){
                self._processRenderHint();
            }
            
            // Set value
            if (properties.value) {
                self._setValue(properties.value);
            }            

            // Check for submit on change
            if (properties.submitOnChange){
                self._configureSubmitOnChange();
            }
        },

        bindEvent: function(eventName, callback){
            var self = this;

            self.element.bind( (self.widgetEventPrefix + eventName).toLowerCase(), callback);
        },

        oneTimeEvent: function(eventName, callback){
            var self = this;

            self.element.one( (self.widgetEventPrefix + eventName).toLowerCase(), callback);
        },

        /*  Destructor */
        destroy: function () {
            var self = this;

            // Cleans the render contents 
            self._clean();

            return this;
        },

        /* PUBLIC METHODS */
        /* 
        *   Returns the real value shown in the render
        */
        getValue: function(){
            var self = this;

            return self._getValue();
        },

        /* 
        *   Returns the display value shown in the render
        */
        getDisplayValue: function(){
            var self = this;
            
            return self._getDisplayValue();
        },

        /* set defaults*/
        applyElementDefaults: function(){
            var self = this,
                properties = self.options.properties;

            // Set display type, and basic aligns
            var displayType = properties.displayType || "normal";
            var labelAlign = properties.labelAlign || self._getDefaultLabelAlign(displayType);
            var valueAlign = properties.valueAlign || self._getDefaultValueAlign(displayType);
            self.changeDisplayType(displayType);
            self.changeLabelAlign(labelAlign);
            self.changeValueAlign(valueAlign);

            // Set customizations
            if (properties.color) self.changeColor(properties.color);
            if (properties.backgroundColor) self.changeBackgroundColor(properties.backgroundColor);

            // Set required and visiblity
            var required = properties.required != undefined ? properties.required : false;
            var visible = properties.visible != undefined ? properties.visible : true;
            if (required) self.changeRequired(required);
            if (!visible) self.changeVisibility(visible);
        },

        /*
        *   Customizes render display type with custom css classes
        */
        changeDisplayType : function(displayType){
            var self = this,
            el = self.element;

            // Clean old display type
            el.removeClass("ui-bizagi-render-display-normal ui-bizagi-render-display-vertical ui-bizagi-render-display-reversed")
              .removeClass("ui-bizagi-render-display-vertical-reversed ui-bizagi-render-display-label ui-bizagi-render-display-value");

            // Set display type
            if (displayType == "normal") {
                el.addClass("ui-bizagi-render-display-normal");

            } else if (displayType == "vertical") {
                el.addClass("ui-bizagi-render-display-vertical");

            } else if (displayType == "reversed") {
                el.addClass("ui-bizagi-render-display-reversed");

            } else if (displayType == "verticalReversed") {
                el.addClass("ui-bizagi-render-display-vertical-reversed");

            } else if (displayType == "label") {
                el.addClass("ui-bizagi-render-display-label");

            } else if (displayType == "value") {
                el.addClass("ui-bizagi-render-display-value");
            }
        },

        /*
        *   Customizes render label align
        */
        changeLabelAlign: function(alignType){
            var self = this,
            el = self.element;
            var label = $(".ui-bizagi-label", el);

            // Remove old label align
            label.removeClass("ui-bizagi-render-align-left ui-bizagi-render-align-center ui-bizagi-render-align-right");

            // Set label align
            if (alignType == "left") {
                label.addClass("ui-bizagi-render-align-left");

            } else if (alignType == "center") {
                label.addClass("ui-bizagi-render-align-center");

            } else if (alignType == "right") {
                label.addClass("ui-bizagi-render-align-right");
            }
        },

        /*
        *   Customizes render value align
        */
        changeValueAlign: function(alignType){
            var self = this,
            el = self.element;
            var control = $(".ui-bizagi-control", el);

            // Remove old value align
            control.removeClass("ui-bizagi-render-align-left ui-bizagi-render-align-center ui-bizagi-render-align-right");

            // Set value align
            if (alignType == "left") {
                control.addClass("ui-bizagi-render-align-left");

            } else if (alignType == "center") {
                control.addClass("ui-bizagi-render-align-center");

            } else if (alignType == "right") {
                control.addClass("ui-bizagi-render-align-right");
            }
        },

        /* Customizes render color*/
        changeColor: function(color){
            var self = this;
            if (color != 'none'){
                self.element.css("color", color);
            } else {
                self.element.css("color", "");
            }
        },

        /* Customizes render background color*/
        changeBackgroundColor: function(color){
            var self = this;

            if (color != 'none'){
                self.element.css({ "background-color": color, "background-image": "none"});
            } else {
                self.element.css({ "background-color": "", "background-image": ""});
            }
        },

        changeVisibility: function(argument){
            var self = this,
                properties = self.options.properties;
            
            // Hide - show the render
            if (argument == true) {
                self.element.fadeIn();
            } else {
                self.element.fadeOut();   
                self.element.css("display", "none");
            }

            // Update properties
            properties.visible = argument;
        },

        changeEditability: function(argument){
            var self = this,
                properties = self.options.properties;
            
            // Renders again
            properties.editable = argument;
            var value = self._getValue();
            self._internalRender();
            self._setValue(value);
        },

        changeRequired: function(argument){
            var self = this,
                properties = self.options.properties;

            var label = properties.label || "";
            var labelElement = $(".ui-bizagi-label label", self.element);

            // Changes label
            if (argument == true) {
                label = label + ' *';
                labelElement.css("font-weight", "bold");
            } else {
                labelElement.css("font-weight", "");
            }
            
            // Update properties
            properties.required = argument;

            // Set text
            labelElement.text(label);
        },

        /* Changes the render min value*/
        changeMinValue: function(value){
            /* Override in each render type if needed*/
            var self = this,
                properties = self.options.properties;
            
            self.minValue = value;
        },

        /* Changes the render max value*/
        changeMaxValue: function(value){
            /* Override in each render type if needed*/
            var self = this,
                properties = self.options.properties;
            
            self.maxValue = value;
        },
        
        /* Refresh the value from the server using ajax */
        refreshValueFromAjax: function(){
            /* Override in each render type if needed*/
            var self = this,
                properties = self.options.properties;
            
            self.getXPath(properties.xpath, function (data) {
                self._setValue(data);
            });
        },

        /* Submits the render and then refresh some dependencies */
        submitRender: function(dependencies){
            /* Override in each render type if needed*/
            var self = this,
                properties = self.options.properties;

            var form = self.getFormContainer();
            form.ajaxSubmit({
                        url: BIZAGI_GETXPATH_URL,
                        data: {xpath: properties.xpath, dependencies: JSON.parse(dependencies)},
                        success: function (responseText, statusText, xhr, element) { 
                            // Process response
                            self._parseSubmitOnChangeResponse(responseText);
                        }
                    });
        },

        /* 
        * Public method to determine if a value is valid or not
        */
        isValid: function (invalidElements) {
            var self = this,
                element = self.element,
                properties = self.options.properties;

            /* Override in each render type if needed*/

            // Clear error message
            self.setValidationMessage("");

            // Check required
            if (properties.required){
                if (self.isEmpty()){
                    var message = $.bizAgiResources["bizagi-ui-render-required-text"].replaceAll("#label#", properties.label);
                    invalidElements.push({xpath: properties.xpath, message: message});
                    return false;
                }
            }

            // Check retypes
            if (properties.reType == "duplicate"){
                // Don't process cloned renders, just originals
                if (element.attr("clone") == "true") return;

                var clone = element.data("clone");
                if (element.baseRender("option", "value") != clone.baseRender("option", "value")){
                    var message = $.bizAgiResources["bizagi-ui-render-text-retype-error"];
                    invalidElements.push({xpath: properties.xpath, message: message});
                    return false;
                }
            }

            return true;
        },

        /* Returns trus if the internal value is empty */
        isEmpty: function(){
            var self = this,
                properties = self.options.properties;
            
            var value = self._getValue();
            if (value.toString().length == 0){
                return true;        
            }

            return false;
        },

        /* Adds a validation message to the render*/ 
        setValidationMessage: function(message){
            var self = this;
            var element = self.element;
                                
            var iconError = $(".ui-bizagi-render-icon-error", element);

            if (message && message.length > 0){
                iconError.css("display", "inline-block");
                iconError.attr("title", message);
                iconError.tooltip();
            
            } else {
                iconError.css("display", "none");
            }
        },

        /* 
            Uses ajax to get a xpath value
        */
        getXPath: function (xpath, callback) {
            
            // Retrieve data
            $.ajax({
                url: BIZAGI_GETXPATH_URL,
                data: {'xpath': xpath} , 
                dataType: $.bizAgiCommunication.dataType,
                jsonp: $.bizAgiCommunication.jsonpParam,
                success: function (data) {
                    if (!data) return;
                    
                    // Execute success method
                    callback(data);
                }
            });
        },

        getFormContainer: function(){
            var self = this,
                element = self.element;

            var formSearch = element.parents("form");
            if (formSearch.length == 0) return null;
            return $(formSearch[0]);
        },

        /* 
        *   Resolves default align for each display type
        */
        _getDefaultLabelAlign : function(displayType) {
            displayType = displayType || "normal";

            if (displayType == "normal") {
                return "right";

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
        },

        /* Makes the control to focus*/
        focus: function(){
            var self = this,
                control = self.control,
                element = self.element;

            // Makes sure the container is shown
            var container = element.parents(".ui-bizagi-container:first").baseContainer("focus");
            
            // Configures effect
            var effect = function(){
                var defaultControl = $("input, select, option", control);
                if (defaultControl.length > 0){
                    // Scroll to control
                    window.scrollTo(defaultControl[0]);
                    
                    // Run animation
                    var speed = 250;
                    setTimeout(function(){ defaultControl.addClass('ui-state-hover') }, 0 * speed);
                    setTimeout(function(){ defaultControl.removeClass('ui-state-hover') }, 1 * speed);
                    setTimeout(function(){ defaultControl.addClass('ui-state-hover') }, 2 * speed);
                    setTimeout(function(){ defaultControl.removeClass('ui-state-hover') }, 3 * speed);
                    setTimeout(function(){ defaultControl.addClass('ui-state-hover') }, 4 * speed);
                    setTimeout(function(){ defaultControl.removeClass('ui-state-hover') }, 5 * speed);                    
                    
                    // Focus control
                    $.each(defaultControl, function(i){
                        var control = defaultControl[i];
                        if ($(control).attr("type") != "hidden" &&
                            $(control).css("display") != "none" && 
                            $(control).css("visibility") != "hidden"){

                            try{control.focus();}catch(e){}
                        }
                    });                    
                }
            }

            // Run effect
            //setTimeout(effect, 300);
            effect();
        },
        
        /* PRIVATE METHODS */
        /* Getter override*/
        option: function (key, value) {
            var self = this;

            if (typeof key === "string") {
                if (value === undefined) {
                    if (key == "value") return self._getValue();
                    if (key == "properties") return self.options.properties;
                    if (key == "originalProperties") return self.options.originalProperties;
                    else if (key == "displayValue") return self._getDisplayValue();
                    else {
                        // Get property value
                        try {  return self.options.properties[key]; } 
                        catch (e) { alert("Option " +  key + " not valid for render " +  self.options.properties.xpath); } 
                    }
                }
            }
            
            var options = key;
             if (typeof key === "string") {
                options = {};
                options[key] = value;
            }

            $.each(options, function (key, value) {
                self._setOption(key, value);
            });

            return self;
        }, 

        /* Setter override*/
        _setOption: function (key, value) {
            var self = this;
            
            if (key == "value") {
                // Special case for value
                if (value) {
                    this._setValue(value);
                } 
            
            } else if (key == "displayValue") {
                // Special case for display value
                if (value) {
                    this._setDisplayValue(value);
                } 

            } else if (key == "editable") {
                // Renders again the HTML
                self.changeEditability(value);
            } 
        },

        /* Sets the value */
        _setValue: function (value) {
            /* Override in each render type if needed*/
            var self = this,
                properties = self.options.properties;

            // Sets internal value
            self._setInternalValue(value);

            if (properties.editable == false){
                // Set read-only text
                var label = $(".ui-bizagi-render-noEditable", self.element);
                label.text(self._getDisplayValue(value));
            }
        },

        /* Internally sets the value */
        _setInternalValue: function (value) {
            /* Override in each render type if needed*/
            var self = this;
            self.internalValue.val(value);

            // Trigger event
            self._trigger("change", window.event, {render: self.element});
            self._trigger("validate", window.event, {render: self.element});
        },

        /* Internally gets the value */
        _getValue: function () {
            /* Override in each render type if needed*/
            var self = this;
            return self.internalValue.val();
        },

        /* Internally sets the display value */
        _setDisplayValue: function (value) {
            /* Override in each render type if needed*/

        },

        /* Internally gets the display value */
        _getDisplayValue: function () {
            /* Override in each render type if needed*/
            var self = this;

            // Normally is the same value
            return self._getValue();
        },

        /* Clean the render elements*/
        _clean: function () {
            var self = this;

            // Removes everything
            self.control.empty();
        },

        _internalRender: function () {
            var self = this,
                o = self.options,
                properties = o.properties,
                editable = o.properties.editable;

            // Cleans the render contents 
            self._clean();

            // Creates hidden value to store data to be send
            if (properties.xpath){
                self.internalValue = $('<input type="hidden" value="" />')
                    .attr("id", encodeXpath(properties.xpath))
                    .attr("name", !properties.temporal? properties.xpath: "")
                    .appendTo(self.control);
            } 
            
            // Render contents
            if (editable == true) {
                this._render();
            } else {
                this._renderReadOnly();
            }
        },

        /* Attach handlers to implement the classic retype option*/
        _processClassicRetype: function(){
            var self = this,
                element = self.element,
                properties = self.options.properties;

            var input = $("input", element);
            input.blur(function () {
                var control = $(this);
                if ($(control).attr("type") != "hidden" &&
                    $(control).css("display") != "none" && 
                    $(control).css("visibility") != "hidden"){

                    if (!control.data("oldValue") || $(this).data("oldValue") == "") {

                        // Check that there is something in the value
                        if (control.val() == "")
                            return;

                        // Check if a value has already been set
                        if (control.val() == control.attr("newValue"))
                            return;

                        control.data("oldValue", control.val());
                        control.val("");

                        // Create new tooltip
                        control.attr("title", "Re-escriba el valor");
                        control.tooltip();
                        control.tooltip("open");

                        // Focus after 100ms to avoid bubbling
                        setTimeout(function () { control.focus(); }, 100);

                    } else {
                        if (control.val() != control.data("oldValue")) {
                            self._setValue("");
                        } else {
                            control.data("newValue", control.val());
                        }
                        control.data("oldValue", "");

                        // Destroy tooltips
                        control.tooltip("destroy");
                    }
                }
            });
        },

        /* Adds a hint to the render */
        _processRenderHint: function(){
            var self = this,   
                element = self.element,
                properties= self.options.properties;

            var input = $("input[type!=hidden], select", element);
            if (!input) return;

            var span = input.parent();
            if (!span) return;

            // Add hint label
            span.prepend('<label class="ui-bizagi-render-hint">' + properties.hint + '</label>');
            var hint = $(".ui-bizagi-render-hint", element);

            // Bind events
            input.focus(function (i) {
               hint.addClass("focus");
            });
            input.keypress(function (i) {
                hint.addClass("has-text").removeClass("focus");
            });
            input.blur(function (i) {
                if ($(this).val() == "") {
                    hint.removeClass("has-text").removeClass("focus");
                }
            });
            hint.click(function (i) {
                input.focus();
            });
        },

        /* Renders the control*/
        _render: function () {
            /* Override in each render type if needed*/
        },

        /* Renders the read only version of the control*/
        _renderReadOnly: function () {
            /* Override in each render type if needed*/
            var self = this,
            properties = self.options.properties,
            control = self.control;

            var label = $('<label class="ui-bizagi-render-noEditable"/>')
                .appendTo(control);
        },

        /* 
        *   Resolves default value align for each display type
        */
        _getDefaultValueAlign : function(displayType) {
            displayType = displayType || "normal";

            if (displayType == "normal") {
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
        },

        /* Configures the submit on change feature*/
        _configureSubmitOnChange: function(){
            var self = this,
                properties = self.options.properties;

            // Build action
            var action = { conditions: [], logicalOperator: 1, commands: [{ xpath: properties.xpath, command: 14, argumentType: 8,  argument: properties.dependencies}], dependencies: [properties.xpath] };

            // Push action
            var form = self.getFormContainer();
            form.formContainer("processAction", action);
        },

        /* 
        *   Process submit on change response
        */
        _parseSubmitOnChangeResponse: function(responseText){
            var self = this;
            
            var form = self.getFormContainer();
            var result = JSON.parse(responseText);
            $.each(result, function(i){
                                
                if (result[i].xpath != "") {
                    // Process renders
                    var renders = form.formContainer("getRenders", result[i].xpath);
                    $.each(renders, function(j){
                        renders[j].baseRender("option", "value", result[i].value);
                    });

                } else {                                    
                    // Process containers
                    form.formContainer("reloadContainer", result[i].container, result[i].value, self.options.properties.xpath);
                }
            });
        },

        /* Opens a form in a popup*/
        /* args = {url, afterLoad, onSave}*/
        _showFormPopup: function (args) {
            var self = this;
            var doc = self.element.ownerDocument;
            
            var popupDialog = $('<div></div>')
                .appendTo("body", doc);

            popupDialog.load(args.url, function () {
                var popupContainer = $("form.ui-bizagi-container", popupDialog);

                if (args.afterLoad)
                    args.afterLoad(popupContainer);

                // Do dialog
                popupContainer
                    .baseContainer()
                    .dialog({
                        show: 'blind',
                        width: BIZAGI_RENDER_POPUP_WIDTH,
                        height: 550,
                        title: 'Bizagi',
                        modal: true,
                        buttons: {
                            "Cerrar": function () {
                                popupContainer.dialog("close");
                            },
                            "Guardar": function () {
                                popupContainer.dialog("close");
                                if (args.onSave)
                                    args.onSave(popupContainer);
                            }
                        },
                        close: function (ev, ui) {
                            popupContainer.dialog('destroy');
                            popupDialog.detach();

                            // MINI-FIX to workaround tabs bug (does not work always)
                            // Reload current tabs
                            $(".ui-bizagi-container-tabContainer", self).each(function (i) {
                                var tabContainer = $(this);
                                var index = tabContainer.tabs("option", "selected");
                                tabContainer.tabs("option", "selected", index - 1);
                                tabContainer.tabs("option", "selected", index);
                            });
                        }
                    });
            });
        }
    });

    $.extend($.ui.baseRender, {
        version: "@VERSION",
        eventPrefix: "render"
    });

})(jQuery);