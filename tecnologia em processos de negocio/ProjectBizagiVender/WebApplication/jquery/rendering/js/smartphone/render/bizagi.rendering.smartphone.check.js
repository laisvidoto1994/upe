/*
*   Name: BizAgi Smartphone Render Check
*   Author: oscar osorio
*   Comments: Check implementation for smartphone
*/

// Extends itself
bizagi.rendering.check.extend('bizagi.rendering.check', {}, {

    postRenderSingle: function () {
        var self = this;
        var control = self.getControl();
        var properties = self.properties;
        var container = self.getContainerRender();

        //personalize display of render
        self.element.find(".bz-container-render-cell > .ui-bizagi-render-control").addClass("bz-check-control");
        self.element.find(".bz-container-render-cell > .ui-bizagi-label").addClass("bz-check-label");
        self.element.find(".bz-container-render-cell > .ui-bizagi-render-control").insertBefore(self.element.find(".bz-container-render-cell > .ui-bizagi-label"));

        if (properties.editable) {
            self.input = self.getControl().find("input"); //$("", self.getControl()); //$.tmpl(self.renderFactory.getTemplate("check")).appendTo(control);
            container.addClass("bz-command-edit-inline");
            self.input.bind("click", function () {
                self.setValue(self.input.is(':checked'), true);
                if (self.properties.submitOnChange) {
                    self.submitOnChange();
                }

            });

        }
        else {
            self.input = $.tmpl(self.renderFactory.getTemplate("text")).appendTo(control); //$("<span></span>").appendTo(control);
            container.addClass("bz-command-not-edit");
        }

    },
    /* SET DISPLAY VALUE
    ======================================================*/
    setDisplayValue: function (value) {

        var self = this;
        var properties = self.properties;
        var control = self.getControl();
        self.setValue(value, false);
        
        if (properties.editable) {
            var parsedValue = bizagi.util.parseBoolean(value);
            if (parsedValue == true) {
                self.input.prop('checked', true);
            }
        }
        else {
            // Call base
            this._super(value);
        }
    }

});
