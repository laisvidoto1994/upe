/*
*   Name: BizAgi Render Geolocation control
*   Author: Ricardo Perez
*   Comments:
*   -   This script will define basic stuff for form link renders
*/

bizagi.rendering.geolocation.extend("bizagi.rendering.geolocation", {}, {

    renderSingle: function () {
        var self = this;
        var control = self.getControl();
        var container = self.getContainerRender();

        self.cordinate = $(".ui-geolocation-cordinate", control);
        container.addClass("bz-command-not-edit");
    },
    /* 
    * Template method to implement in each device to customize each render after processed 
    */
    postRenderSingle: function () {
        var self = this;
        var control = self.getControl();
        //bz-command-not-edit
        // Call base 
        self._super();

        $(".bz-cm-icon", control).addClass("bz-rn-icon-geolocation");
        self.configureHandlers();
        // TODO: write functionality 
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