/*
*   Name: BizAgi Render Label Class
*   Author: Diego Parra
*   Comments:
*   -   This script will define basic stuff for labels
*/

bizagi.rendering.render.extend("bizagi.rendering.label", {}, {


    /*
    *   Update or init the element data
    */
    initializeData: function (data) {
        var self = this;
        // Call base
        this._super(data);
        
        // A label itself is never "required" as other controls
        var properties = this.properties;
        properties.required = false;



        // Set properties
        this.properties.displayType = "label";
        this.properties.labelAlign = this.originalProperties.labelAlign || "left";

        this.properties.displayName = data.properties.displayName || "";
        if(bizagi.util.parseBoolean(this.properties.allowDinamiclabel)){
            this.properties.displayName = data.properties.displayName || bizagi.localization.getResource("render-label-default-display-name");
        }

        this.bindingValue();

        // Calculate layout properties
        this.calculateInitialLayoutProperties();
    },

    /*
    *   Template method to implement in each device to customize each render after processed
    */
    postRender: function () {
        var self = this;
        var properties = self.properties;

        self._super();
        // Just apply display-type: label, align it to the left
        self.changeDisplayOption("label");
        self.changeLabelAlign(properties.labelAlign || "left");

        if (typeof self.configureHelpText == "function") {
            self.configureHelpText();
        }
    },

    /*
    *   Template method to implement in each device to customize each render after processed in read-only mode
    */
    postRenderReadOnly: function () {
        var self = this;
        var properties = self.properties;

        self._super();
        // Just apply display-type: label, align it to the left
        self.changeDisplayOption("label");
        self.changeLabelAlign(properties.labelAlign || "left");
    },

    /* 
    * Public method to determine if a value is valid or not
    */
    isValid: function (invalidElements) {
        // Automatically this render is valid, so we can't check a required label
    },

    /* 
    *   Resolves default align for each display type
    */
    getDefaultLabelAlign: function (displayType) {
        return "left";
    },
    
    /* 
     *  Method to determine if the render value can be sent to the server or not
     */
    canBeSent: function() {
        // This render cannot be sent because it is full ajax
        return false;
    },

    bindingValue: function () {
        var self = this;
        if (self.properties.allowDinamiclabel && self.properties.value) {
            if (typeof(self.properties.value) === "object" && self.properties.value[0]) {
                self.properties.displayName = self.properties.value[0].value;
            }
            else if (typeof(self.properties.value) === "string" && self.properties.value !== "") {
                self.properties.displayName = self.properties.value;
            }
        }
    }

});
