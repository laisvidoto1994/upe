/*
*   Name: BizAgi User Field render tablet Extension
*   Author: Bizagi Mobile Team
*   Comments:
*   -   This script will define the basic behaviour for userfields    
*/

// Auto-extension
bizagi.rendering.basicUserField.extend("bizagi.rendering.basicUserField", {}, {
    renderSingle: function () {
        var self = this;

        // Hide arrow
        $(".ui-bizagi-render-edition-arrow", self.getControl().parent()).hide();

        return self.postRender();

    },

    renderEdition: function () {
        var self = this;
        var defer = $.Deferred();

        $.when(self.postRender()).done(function () {
            $.when(self.renderUserfieldControl()).done(function () {
                self.inputEdition = self.input;
                defer.resolve();
            });
        });

        return defer.promise();
    },

    getEditableControl: function () {
        if (!this.isSupported()) {
            return bizagi.rendering.defaultUserField.prototype.getEditableControl.apply(this, arguments);
        }
    },

    getReadonlyControl: function () {
        if (!this.isSupported()) {
            return bizagi.rendering.defaultUserField.prototype.getReadonlyControl.apply(this, arguments);
        }
    },

    isSupported: function () {
        return true;
    }
});

/*
*   Default implementation for user fields
*/
bizagi.rendering.basicUserField.extend("bizagi.rendering.defaultUserField", {}, {

    /*
    *   Template method to implement in each device to customize each render after processed
    */
    getEditableControl: function() {
        var self = this;
        var control = self.getControl();
        var container = self.getContainerRender();
        var properties = self.properties;
        var controlName = properties.control.replace(/column/g, "");

        self.input = $("<label>Userfield: " + controlName + " not found</label>").appendTo(control);
        self.input.addClass("ui-bizagi-render-userfield-notSupported");
        container.addClass("bz-rn-non-editable");

        return self.input;
    },

    /*
    *  Dont send the data to the server
    */
    collectData: function(renderValues) {
    },

    getDisplayValue: function() {
        var self = this;
        var properties = self.properties;
        var controlName = properties.control;

        return "Userfield: " + controlName + " not found";
    },

    getReadonlyControl: function() {
        var self = this;
        var control = self.getControl();
        var properties = self.properties;
        var controlName = properties.control;
        var mycontrol = $("<label>Userfield: " + controlName + " not found</label>").appendTo(control);

        return mycontrol;
    }

});