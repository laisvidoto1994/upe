/*
*   Name: BizAgi User Field render tablet Extension
*   Author: Diego Parra
*   Comments:
*   -   This script will define the basic behaviour for userfields
*/

// Auto-extension
bizagi.rendering.basicUserField.extend("bizagi.rendering.basicUserField", {}, {

    /*
    *   Constructor
    */
    init: function (params) {
        var self = this;

        // Call base
        this._super(params);

        // Check if the userfield is supported
        if (!this.isSupported()) {
            var form = self.getFormContainer();
            form.addError(self.getResource("render-tablet-error-userfield"));
        }
    },

    /*
    *   Template method to implement in each device to customize each render after processed
    */
    getEditableControl: function () {
        if (!this.isSupported()) {
            return bizagi.rendering.defaultUserField.prototype.getEditableControl.apply(this, arguments);
        }
    },

    /*
    *   Template method to implement in each device to customize each render after processed
    */
    getReadonlyControl: function () {
        if (!this.isSupported()) {
            return bizagi.rendering.defaultUserField.prototype.getReadonlyControl.apply(this, arguments);
        }
    },

    /*
	*   Returns if the userfield is supported in this device
	*/
    isSupported: function () { return true; }
});

/*
*   Default implementation for user fields
*/
bizagi.rendering.basicUserField.extend("bizagi.rendering.defaultUserField", {}, {

    /*
    *   Template method to implement in each device to customize each render after processed
    */
    getEditableControl: function () {
        var self = this;
        var control = self.getControl();
        var properties = self.properties;
        var controlName = properties.control.replace(/column/g, "");

        self.input = $("<label>Userfield: " + controlName + " not found</label>").appendTo(control);
        self.input.addClass("ui-bizagi-render-userfield-notSupported");

        return self.input;
    },

    /*
    *   Template method to implement in each device to customize each render after processed
    */
    getReadonlyControl: function () {
        return this.getEditableControl();
    },

    /*
	*  Dont send the data to the server
	*/
    collectData: function (renderValues) {
    }
});