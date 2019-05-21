/*
*   Name: BizAgi Render Geolocation control
*   Author: Ricardo Perez
*   Comments:
*   -   This script will define basic stuff for form link renders
*/

bizagi.rendering.render.extend("bizagi.rendering.geolocation", {}, {
    /* 
    * Constructor 
    */
    init: function (params) {
        var self = this;
        // Call base 
        self._super(params);
        var properties = self.properties;
        properties.allowUpdate = bizagi.util.parseBoolean(properties.allowUpdate)
        self.geoloc = window.navigator.geolocation;
    },

    /* 
    * Template method to implement in each children to customize each control 
    */

    renderControl: function () {
        var self = this;
        var template = self.renderFactory.getTemplate("geolocation");
        // Render template 
        var html = $.fasttmpl(template, self.properties);
        return html;
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

        // TODO: write functionality
        return bValid;
    },

    /* 
    * Sets the value in the rendered control 
    */
    setDisplayValue: function (value) {
        var self = this;
        var control = self.getControl();
        // TODO: write functionality 
        // Set internal value 
        self.setValue(value, false);
    },
    /* 
    * Template method to implement in each device to customize the render's behaviour to add handlers 
    */

    configureHandlers: function () {

    },

    /* 
    * Sets the value in the rendered control 
    */
    getCurrentPosition: function (succes_callback, fail_callback) {
        var self = this;

        if (typeof self.geoloc == "undefined") {
            if (fail_callback)
                fail_callback(bizagi.localization.getResource("render-control-unsuported-by-browser").replace("{0}", self.properties.type));
            return;
        }

        return self.geoloc.getCurrentPosition(
        //success
            function (position) {
                if (succes_callback)
                    succes_callback(position);
            },
        //error
            function (error) {
                var strMessage = "";

                // Check for known errors
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                    case 1:
                        strMessage = bizagi.localization.getResource("render-geolocation-permission-denied");
                        break;
                    case error.POSITION_UNAVAILABLE:
                    case 2:
                        strMessage = bizagi.localization.getResource("render-geolocation-position-unavailable");
                        break;
                    case error.TIMEOUT:
                    case  3:
                        strMessage = bizagi.localization.getResource("render-geolocation-timeout");
                        break;
                    default:
                        strMessage = "WD: " + bizagi.localization.getResource("render-geolocation-permission-denied");
                        break;
                }
                if (fail_callback)
                    fail_callback(strMessage);
            });
    }
});