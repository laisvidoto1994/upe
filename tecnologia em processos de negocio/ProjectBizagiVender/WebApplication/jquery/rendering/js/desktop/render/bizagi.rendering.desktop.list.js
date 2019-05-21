/*  
*   Name: BizAgi Desktop Render list Extension
*   Author: Diego Parra
*   Comments:
*   -   This script will redefine the list render class to adjust to desktop devices
*/

// Extends from base list
bizagi.rendering.list.extend("bizagi.rendering.list", {}, {

    /*
    *   Template method to implement in each device to customize each render after processed
    */
    postRender: function () {
        var self = this;
        var control = self.getControl();
        var properties = self.properties;

        // Call base 
        this._super();

        // Set control container to behave as a block
        control.addClass("ui-bizagi-render-display-block");
        control.addClass("ui-bizagi-render-boolean-yesno");

        // Apply plugin
        self.list = $(".ui-bizagi-render-list", control);

        //if Windows8 don't use plugin's select option, it affects scrolling behaviour
        if (typeof Windows != "undefined") {
            self.list.selectable2({
                closest: false
            });

            $.when(self.ready())
            .done(function () {
                var selected = self.getControl().find("li[tabindex='0']");
                if (selected.length > 0) {
                    selected = selected[0];
                    self.focusSelectedItem(selected);
                }
            });


            $(".ui-bizagi-render-list li", control).addClass("ui-list-w8");

            $(".ui-bizagi-render-list li", control).on("click", function (e) {
                if (e.isPropagationStopped()) {
                    return;
                }
                // if (ui.selection.length == 0) return;
                var selected = this; //$("li.ui-selected", this);
                var value = $(selected).data("value");
                var label = $(selected).text();

                // Updates internal value
                var newValue = { id: value, value: label };
                self.setValue(newValue);
                self.selectedValue = newValue.value;
                self.focusSelectedItem(selected);

                e.stopPropagation();
            });

        } else {

            self.list.selectable2({
                closest: false,
                select: function (e, ui) {
                    if (e.isPropagationStopped()) {
                        return;
                    }
                    // if (ui.selection.length == 0) return;
                    var selected = $("li[tabindex='0']", this); //$("li.ui-selected", this);
                    var value = $(selected).data("value");
                    var label = $(selected).text();

                    // Updates internal value
                    var newValue = { id: value, value: label };
                    self.setValue(newValue);
                    self.selectedValue = newValue.value;
                    self.focusSelectedItem(selected);

                    e.stopPropagation();
                }
            });
        }


        // Apply list size
        if (properties.listSize > 0) {
            var listSize = Number(properties.listSize) * 23;
            self.list.height(listSize + "px");
        }
        if (self.properties.orientation == "rtl") $(".ui-bizagi-wrapper-render-list", self.getControl()).addClass("ui-bizagi-rtl");
    },
    focusSelectedItem: function (elList) {
        var self = this;
        $.when(self.ready())
            .done(function () {
                elList.focus(0);
            });
    },

    /*
    *   Template method to implement in each device to customize the render's behaviour to add handlers
    */
    configureHandlers: function () {
        var self = this;

        // Call base
        self._super();

        // Nothing todo, all events apply in selectable plugin
    },

    /*
    *   Template method to implement in each device to customize the render's behaviour when rendering in design mode
    */
    configureDesignView: function () {
        var self = this;
        var properties = self.properties;

        // Call base
        self._super();

        // Un-bind selection handlers
        if (properties.editable) {
            self.list.unbind("mousedown.selectable");
            self.list.unbind("focus.selectable");
            self.list.unbind("blur.selectable");
            self.list.unbind("keydown.selectable");
        }
    },

    /*
    *   Sets the value in the rendered control
    */
    setDisplayValue: function (value) {
        var self = this;
        var properties = self.properties;
        var control = self.getControl();

        if (properties.editable) {
            if (value !== undefined && value.id != "") {
                self.list.selectable2("select", "[id='ui-bizagi-list-" + value.id + "']");
            }
        }
    },

    /*
    *   Sets the value in the rendered control
    */
    clearDisplayValue: function () {
        var self = this;
        var control = self.getControl();
        var selected = control.find(".ui-state-active");

        if (selected.length > 0) {
            // Updates internal value
            var newValue = self.getValue();
            self.selectedValue = newValue.value;
            selected.removeClass("ui-state-focus ui-selected ui-state-active");
        } else if (!self.properties.editable) {
            $(control).html("<label class='readonly-control'></label>");
        }
    },

    /*
    *   Returns the selected value in the template
    */
    getSelectedValue: function () {
        var self = this;
        return self.selectedValue;
    },

    /*
     * Cleans current data
     */
    cleanData: function () {
        var self = this;
        self.value = self.properties.value = self.selectedValue = { id: "", value: "" };
        self.clearDisplayValue();
    }
});
