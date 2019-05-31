/**
 *   Name: BizAgi Smartphone Render Cascading combo Extension
 *   Author: Oscar O
 *   Comments:
 *   -   This script will redefine the cascading combo render class to adjust to tablet devices
 */

// Extends from base cascading combo, then apply tablet combo stuff
bizagi.rendering.cascadingCombo.extend("bizagi.rendering.cascadingCombo", {}, {
    renderSingle: function () {
        var self = this;
        self._super();

        var parentCombo = self.getParentCombo();
        if (parentCombo != null) {
            if (parentCombo.properties.type == "cascadingCombo") {
                self.isDependant = true;
                parentCombo.dependants.push(self);
                if (self.getValue() != null) {
                    self.properties.parentComboValue = self.getValue().id;
                } else {
                    self.initializingCascadingCombo = true;
                }
            }
        }

        self.initialValueSet = true;
        $.when(bizagi.rendering.combo.prototype.renderSingle.apply(self, arguments))
            .done(function () {
                self.bind("selectElement", function (ex, valueObj) {
                    self.onComboChange(valueObj);
                });

                self.initialValueSet = false;
            });
    },

    postRenderSingle: function () {
        bizagi.rendering.combo.prototype.postRenderSingle.apply(this, arguments); 
    },

    renderEdition: function () {
        bizagi.rendering.combo.prototype.renderEdition.apply(this, arguments);
    },

    configureCombo: function () {
        bizagi.rendering.combo.prototype.configureCombo.apply(this, arguments);
    },

    configureModalViewHandlers: function () {
        bizagi.rendering.combo.prototype.configureModalViewHandlers.apply(this, arguments);
    },

    filterList: function () {
        bizagi.rendering.combo.prototype.filterList.apply(this, arguments);
    },

    setModalViewDisplayValue: function () {
        bizagi.rendering.combo.prototype.setModalViewDisplayValue.apply(this, arguments);
    },

    /*
     *   Sets the value in the rendered control
     */
    setDisplayValue: function (value) {
        var self = this;
        var properties = self.properties;
        var control = self.getControl();

        var valuers = value.value ? bizagi.rendering.combo.prototype.formatItem.call(self, value.value) : value.value;

        if (properties.editable) {
            $(".bz-rn-combo-control", control).val(value.value);
            self.inputSpan.html(valuers);
            self.inputSpan.val(valuers);
            self.changeCombo(value.value, value);
        } else {
            //hide the control arrow
            $('.bz-rn-icon', self.control).hide();

            //Set the values
            self.inputSpan.html(valuers);
            self.inputSpan.val(valuers);
            self.input.val(valuers);
        }
    },

    changeCombo: function (valueItem, valueObjet) {
        bizagi.rendering.combo.prototype.changeCombo.apply(this, arguments);
    },

    processComboData: function(data){
        bizagi.rendering.combo.prototype.processComboData.apply(this, arguments);
    },

    validateValue: function(value){
        bizagi.rendering.combo.prototype.validateValue.apply(this, arguments);
    },

    /*
     *   Returns the selected value in the template
     */
    getSelectedValue: function () {
        return bizagi.rendering.combo.prototype.getSelectedValue.call(this, arguments);
    },

    /*
     *   Handler for combo change
     */
    onComboChange: function (newValue) {
        var self = this;
        self.selectedValue = newValue.value;
        var params = {};
        params[self.Class.BA_ACTION_PARAMETER_PREFIX + "parent"] = newValue.id;
        var deferred = $.Deferred();

        if (self.dependants[0]) {
            if (self.dependants[0].initialValueSet) {
                self.dependants[0].setValue("", false);
            }
            self.dependants[0].properties.params = params;
            self.dependants[0].properties.parentComboValue = newValue.id;
            self.dependants[0].getControl().html("");
            self.dependants[0].initializingCascadingCombo = false;
            $.when(bizagi.rendering.combo.prototype.renderSingle.apply(self.dependants[0], self.dependants[0].properties)).done(function () {
                deferred.resolve();
            });
        }

        return deferred.promise();
    },

    getTemplateName: function () {
        return "combo";
    }
});