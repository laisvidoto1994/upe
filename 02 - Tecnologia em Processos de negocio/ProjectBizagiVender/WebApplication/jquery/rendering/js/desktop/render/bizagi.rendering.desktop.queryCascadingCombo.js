/*
 *   Name: BizAgi Desktop queryCascadingCombo
 *   Author: Jeison Borja Abril
 *   Comments:
 *   -
 */

bizagi.rendering.cascadingCombo.extend("bizagi.rendering.queryCascadingCombo", {}, {
    /*
     *  configure Handlers for check, column included in the response
     */
    initializeData: function (data) {
        var self = this;

        // Call base
        this._super(data);
        self.properties.contexttype = self.properties.contexttype || "metadata";
    },

    postRender: function () {
        var self = this;
        var properties = self.properties;
        if (self.parentCombo !== null && self.isDependant) {
            self.parentCombo.isRendered().done(function () {
                $(".ui-bizagi-render-control-included", self.parentCombo.getRenderedElement()).hide();
            });
        }
        this._super();
    },

    /*
     *   Template method to implement in each children to customize each control
     */
    renderControl: function () {
        var self = this;
        var mode = self.getMode();

        // Check if this is a dependant combo
        var parentCombo = self.parentCombo = self.getParentCombo();
        if (parentCombo !== null) {
            if (parentCombo.properties.type == "queryCascadingCombo") {
                self.isDependant = true;
            }
        }

        // Apply element plugin, set a flag to avoid dependant combo ajax requests
        self.initializingCascadingCombo = true;

        // Call base
        var result = this._super();

        if (mode != "execution") {
            self.initializingCascadingCombo = false;
        }

        return result;
    },

    /*
     *   Bind the combos to create the cascading feature
     */
    bindDependantCombo: function (dependantCombo) {
        var self = this,
            properties = self.properties;

        // Check it is a cascading combo
        if (dependantCombo.properties.type == "queryCascadingCombo") {

            // Append to dependant combos
            self.dependants.push(dependantCombo);

            // When this combo is selected we need to make the other combo to auto fill with an extra filter

            dependantCombo.onChangeFunction = function (event, item, initialValue) {
                // Fill items for next combo

                self.refreshDependantCombo(dependantCombo, item.id);

                //if initial value is true, it prevents deleting the next combo
                if (!initialValue) {
                    // Clean next inputs
                    dependantCombo.cleanInput();
                }
            };

            self.bind("select", dependantCombo.onChangeFunction);
            //self.bind("initialValue", dependantCombo.onSetInitialValue);

            // After the event binding has been made, we need to fill the new dependant render if this instance (the parent) has a value
            if (!bizagi.util.isEmpty(self.getValue())) {

                // Auto fill dependant items with current value
                if (properties.hasLocalData) {
                    self.refreshDependantCombo(dependantCombo, self.getValue().id);
                }

            }
        }
    },
    /*
     *  Method to determine if the render value can be sent to search
     */
    canBeSentQueryForm: function () {
        return true;
    }
});

