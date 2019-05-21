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
        this._super();
        // TODO: write functionality 
        var control = self.getControl();

        self.cordinate = $(".ui-geolocation-cordinate", control);
        $(".bz-cm-icon", control).addClass("bz-rn-icon-geolocation");
        //self.configureHandlers();
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
    * Template method to implement in each device to customize the render's behaviour to add handlers 
    */

    configureHandlers: function () {
        var self = this;
        if (self.getMode() === "execution") {
            var control = self.getControl();
            // TODO: write functionality 
            //If the control doesn't have a value set the position
            if (self.value == null)
                self.setDisplayValue();

            $(".ui-bizagi-render-geolocation", control).bind("click", function () {
                self.cordinate.empty();
                //this retun a promise if is usefull
                self.setDisplayValue().then(function () { }).fail(function (msg) {
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
        // TODO: write functionality 
        if (value != null && value != "") {
            if(!self.cordinate) self.cordinate = self.getControl();
            self.cordinate.html(value);
            // Set internal value 
            self.setValue(value, false);
            def.resolve();
        }
        else {
            self.getCurrentPosition(
            //callback
            function (position) {
                self.cordinate.html(position.coords.latitude.toString() + " " + position.coords.longitude.toString());
                // Set internal value 
                self.setValue(position.coords.latitude.toString() + " " + position.coords.longitude.toString(), false);
                def.resolve();
            },
            //fail
            function (msg) {
                self.cordinate.html(self.properties.value);
                def.reject(msg);
            });
        }
        return def.promise();
    }

});