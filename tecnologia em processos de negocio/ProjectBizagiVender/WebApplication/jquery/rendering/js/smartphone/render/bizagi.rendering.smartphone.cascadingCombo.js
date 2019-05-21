/*
*   Name: BizAgi Smartphone Render Cascading combo Extension
*   Author: Oscar O
*   Comments:
*   -   This script will redefine the cascading combo render class to adjust to tablet devices
*/

// Extends from base cascading combo, then apply tablet combo stuff
bizagi.rendering.cascadingCombo.extend("bizagi.rendering.cascadingCombo", {

    MAXIMUN_ALLOWED_EDIT_INLINE: 40
}, {

    /*
    *   Template method to implement in each device to customize each render after processed
    */
    renderSingle: function () {

        var self = this;
        self._super();
        var parentCombo = self.getParentCombo();
        var mode = self.getMode();
        
        if (parentCombo != null) {
            if (parentCombo.properties.type == "cascadingCombo") {
                self.isDependant = true;
                parentCombo.dependants.push(self);
                //   if (!jQuery.isEmptyObject(self.getValue()) && !jQuery.isEmptyObject(self.getValue().id) )
                if (self.getValue() != null)
                    self.properties.parentComboValue = self.getValue().id;
                else
                    self.initializingCascadingCombo = true;
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

        // Perform execution mode methods
        if (mode == "execution") {
            self.performExecutionModeMethods();
        } else {
            self.performDesignModeMethods();
        }
        
    },

    postRenderSingle: function () {
        var self = this;
        self._super();
        bizagi.rendering.combo.prototype.postRenderSingle.apply(this, arguments);

    },



    /*
    *   Sets the value in the rendered control
    */
    setDisplayValue: function (value) {
        var self = this;
        var properties = self.properties;
        var valuers = value.value ? bizagi.rendering.combo.prototype.formatItem.call(self, value.value) : value.value; //self.formatItem(value.value)
        if (properties.editable) {
            $(self.input).val(value.id);
            self.inputSpan.html(valuers);
            self.inputSpan.val(valuers);
            self.getControl().find(".bz-rn-cm-text-label").html(valuers);
            self.getControl().find(".bz-rn-cm-text-label").val(valuers);
        }

    },

    renderEdition: function () {
        bizagi.rendering.combo.prototype.renderEdition.apply(this, arguments);
    },


    setDisplayValueEdit: function (value) {

        bizagi.rendering.combo.prototype.setDisplayValueEdit.apply(this, arguments);
    },

    actionSave: function () {
        bizagi.rendering.combo.prototype.actionSave.apply(this, arguments);
    },


    configureCombo: function () {
        bizagi.rendering.combo.prototype.configureCombo.apply(this, arguments);
    },


    changeCombo: function (valueItem, valueObjet) {
        bizagi.rendering.combo.prototype.changeCombo.apply(this, arguments);
    },



    /*
    *   Returns the selected value in the template
    */
    getSelectedValue: function () {
        return bizagi.rendering.combo.prototype.getSelectedValue.call(this, arguments);
    },

    addComboToControl: function (element) {
        var self = this;

        if (element.isDependant) {
            var dependant = true;
            var rendertmp = self;
            do {
                var parent = rendertmp.getParentCombo();
                if (parent != null) {
                    rendertmp = parent;
                }
                else {
                    dependant = false;
                }
            } while (dependant);

            bizagi.rendering.combo.prototype.addComboToControl.call(rendertmp, element)
        }


    },


    /*
    *   Handler for combo change
    */
    onComboChange: function (newValue) {
        var self = this;
        var context = self.getFormContainer().container;
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
