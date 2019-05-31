/*
*   Name: BizAgi Render Geolocation control
*   Author: Ricardo Perez
*   Comments:
*   -   This script will define basic stuff for form link renders
*/

bizagi.rendering.geolocation.extend("bizagi.rendering.geolocation", {}, {

    /* 
    * Template method to implement in each device to customize each render after processed 
    */
    postRender: function () {
        var self = this;

        // Call base 
        self._super();

        var control = self.getControl();

        self.cordinate = $(".bz-rn-geolocation-coordinate", control);
    },
    /* 
    * Public method to determine if a value is valid or not 
    */
    isValid: function (invalidElements) {
        var self = this;

        // Call base
        var bValid = self._super(invalidElements);

        return bValid;
    },

    /* 
    * Template method to implement in each device to customize the render's behaviour to add handlers 
    */

    configureHandlers: function () {
        var self = this;
        if (self.getMode() === "execution") {
            var control = self.getControl();

            //If the control doesn't have a value set the position
            if (self.value == null)
                self.setDisplayValue();

            $(".bz-rn-geolocation-selector", control).on("click", function () {
                self.cordinate.empty();

                //this retun a promise if is usefull
                self.setDisplayValue().then(function () { })
                    .fail(function (msg) {
                        self.cordinate.html("<span style='color: red'>" + msg + "</span>");
                    });
            });
        }
    },

    /* 
    * Sets the value in the rendered control 
    */
    setDisplayValue: function (value) {
        var self = this;
        var def = new $.Deferred();

        if (value != null && value !== "") {
            if (!self.cordinate) {
                self.cordinate = self.getControl();
            }

            self.cordinate.html(value);

            // Set internal value 
            self.setValue(value, false);
            def.resolve();
        } else {
            var onSuccess = function(position) {
                var latitude = position.coords.latitude.toString();
                var longitude = position.coords.longitude.toString();

                self.cordinate.html(latitude + " " + longitude);

                // Set internal value 
                self.setValue(latitude + " " + longitude, false);
                def.resolve();
            };

            // onError Callback receives a PositionError object
            var onError = function(msg) {
                self.cordinate.html(self.properties.value);
                def.reject(msg);
            };

            if (bizagi.util.isCordovaSupported() && (bizagi.util.detectDevice().indexOf("ios") > 0)) {
                navigator.geolocation.getCurrentPosition(onSuccess, onError);
            } else {
                self.getCurrentPosition(onSuccess, onError);
            }
        }

        return def.promise();
    }

});