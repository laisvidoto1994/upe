/*
*   Name: BizAgi Render Cascading Combo Class
*   Author: Diego Parra
*   Comments:
*   -   This script will define basic stuff for cascading combo renders
*/

bizagi.rendering.combo.extend("bizagi.rendering.cascadingCombo",
    {
        // Statics
        BA_ACTION_PARAMETER_PREFIX: bizagi.render.services.service.BA_ACTION_PARAMETER_PREFIX,
        BA_CONTEXT_PARAMETER_PREFIX: bizagi.render.services.service.BA_CONTEXT_PARAMETER_PREFIX
    },
    {

        /*
        *   Constructor
        */
        init: function (params) {
            var self = this;

            // Call base
            this._super(params);

            // Create dependency collection
            self.dependants = [];
            self.isDependant = false;
        },

        /*
        *   Update or init the element data
        */
        initializeData: function (data) {
            var self = this;
            // Call base
            this._super(data);

            // Fill default properties
            var properties = this.properties;
            properties.hasLocalData = bizagi.util.isEmpty(properties.parentCombo) ? properties.hasLocalData : false;
            //properties.value = properties.value && properties.value.length > 0 ? properties.value[0] : (properties.defaultValue && properties.defaultValue.length > 0 ? properties.defaultValue[0] : null);
            if (properties.value && properties.value.id === undefined) properties.value = null;
            this.value = properties.value;

            // Add empty node if configured
            if (properties.hasLocalData) {
                properties.data = this.complementData(properties.data);
            }
        },

        /*
        *   Template method to implement in each children to customize each control
        */
        renderControl: function () {
            var self = this;
            var mode = self.getMode();

            // Check if this is a dependant combo
            var parentCombo = self.parentCombo = self.getParentCombo();
            if (parentCombo != null) {
                if (parentCombo.properties.type == "cascadingCombo") {
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
        *   Template method to implement in each device to customize the render's behaviour to add handlers
        */
        configureHandlers: function () {
            var self = this;
            var properties = self.properties;

            self.initializingCascadingCombo = false;

            // Bind with parent combo
            if (self.isDependant) {
                self.parentCombo.bindDependantCombo(self);

            }

        },

        /*
        *   Refresh the combo, after it has been painted
        */
        refresh: function (params) {
            var self = this;

            // Wait until current element is rendered
            $.when(self.isRendered())
            .done(function () {

                // Unbind previous handler
                self.parentCombo.unbindDependantCombo(self);

                // Clear current control
                var control = self.getControl();
                var mode = self.getMode();
                control.empty();

                // Render combo again
                $.when(self.renderCombo(params))
                    .then(function (html) {
                        // Append new element
                        control.html(html);

                        // Post-render method
                        self.postRender();

                        if (mode == "execution") {
                            self.configureHandlers();
                        }

                        // Set current value
                        if (self.getValue() !== undefined) {
                            self.setDisplayValue(self.getValue());
                        }

                        if (self.deferredVisible) {
                            self.deferredVisible.resolve();
                        }

                        if (self.internalSetInitialValueFlag) {

                            self.trigger("select", [self.value, self.initialValue]);
                            self.internalSetInitialValueFlag = false;
                        }
                    });
            });
        },

        /*
        *   Fetch the data into a deferred
        */
        getData: function (params) {
            var self = this;
            var mode = self.getMode();

            // Just execute ajax calls when rendering in execution mode
            if (mode != "execution") return self.getDummyData();

            // Do not load dependant combos when there are no parent id
            if (self.isDependant) {
                if (self.parentCombo && params) {
                    self.properties.remoteDataLoaded = false;
                }

                // Return an empty array when there are no parent defined when the combo is dependant

                var parentValue = (self.parentCombo.selectedValue) ? self.parentCombo.selectedValue.id : '';

                if (parentValue != '') {

                    return this._super(params);

                } else {

                    return [];
                }

            }

            return this._super(params);
        },


        /* 
        *   Bind the combos to create the cascading feature
        */
        bindDependantCombo: function (dependantCombo) {
            var self = this,
            properties = self.properties;

            // Check it is a cascading combo
            if (dependantCombo.properties.type == "cascadingCombo") {

                // Append to dependant combos
                self.dependants.push(dependantCombo);

                // When this combo is selected we need to make the other combo to auto fill with an extra filter

                dependantCombo.onChangeFunction = function (event, item, initialValue) {
                    // Fill items for next combo

                    self.refreshDependantCombo(dependantCombo, item.id, self.focusDependant);

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
        *   Unbind the combos that are being redrawn
        */
        unbindDependantCombo: function (dependantCombo) {
            var self = this,
            properties = self.properties;

            // When this combo is selected we need to make the other combo to auto fill with an extra filter
            self.unbind("select", dependantCombo.onChangeFunction);
        },

        /*
        *   Fills the next dependant combo based on the given value
        */
        refreshDependantCombo: function (dependant, parentValue, focus) {
            var self = this;
            var params = {};
            params[self.Class.BA_ACTION_PARAMETER_PREFIX + "parent"] = parentValue;

            dependant.deferredVisible = $.Deferred();

            if (self.internalSetInitialValueFlag == false) {
                // Clear dependant value
                dependant.setValue("", false);
            }

            // Refresh combo
            if (self.internalSetInitialValueFlag) {

                dependant.initialValue = true;
                dependant.internalSetInitialValueFlag = true;
            }

            dependant.refresh(params);

            if (focus) {
                $.when(dependant.deferredVisible.promise()).done(function () {
                    dependant.inputCombo.trigger("click");
                });
            }
        },

        /*
        *   Empty html when render from action
         */

        emptyControlByChangeEditability: function(){
            var self = this;
            var control = self.getControl();
            control.empty();
        },

        /* 
        *   Cleans the combo value
        */
        cleanInput: function () {
            var self = this;

            self.triggerHandler("select", { id: 0 });
        },

        /*
        *   Search for the other cascading combo refering this one, by idRender
        */
        getParentCombo: function () {
            var self = this,
            properties = self.properties;

            // Check if parentCombo is defined
            if (properties.parentCombo === undefined)
                return null;

            // Get form reference
            var form = self.getFormContainer();
            var controls = form.getRenderByType("cascadingCombo");
            var i = 0, j = 0, parents = [], control = null;

            for (; i < controls.length; i++) {
                if (properties.parentCombo === controls[i].properties.id) {
                    parents.push({ control: controls[i], index: i });
                }
            }

            if (parents.length > 1) {
                var parentLength, parent, xpathParent, parentArray;
                for (; j < parents.length; j++) {
                    parent = parents[j].control;
                    xpathParent = parent.properties.xpath;
                    parentArray = xpathParent.split(".");
                    parentLength = parentArray.length;
                    xpathParent = parentArray.slice(0, parentLength - 1).join(".");

                    if (xpathParent === properties.xpath) {
                        control = controls[parents[j].index];
                        break;
                    }
                }
            } else {
                control = form.getRenderById(properties.parentCombo);
            }

            // Return parent combo
            return control;
        },

        /* 
        *  Method to determine if the render value can be sent to the server or not
        */
        canBeSent: function () {
            var self = this;

            // If the render has dependants we can't send to the server
            return this._super() && bizagi.util.isMapEmpty(self.dependants);
        },

        /*
        *   Determines if we need to show the current data regardless if it belongs to data or not
        *   Can be overriden to change behaviour
        */
        showCurrentData: function () {
            var self = this;
            var mode = self.getMode();
            if (mode != "execution") return true;
            return false;
        },

        /*
        *   Enables submit on change feature for the current render
        */
        configureSubmitOnChange: function () {
            var self = this;

            if (!self.configured) {
                // Call super
                this._super();
                self.configured = true;
            }
        },

        internalSubmitOnChange: function (data, bRefreshForm) {
            var self = this;
            var defer = new $.Deferred();

            if (self.isDependant && self.canBeSent() && self.itemSelected !== undefined) {
                return self._super(data, bRefreshForm);
            }
            return defer.resolve();
        },
        /*
        *   Sets the initial value for the renders
        */
        internalSetInitialValue: function () {
            var self = this;
            var properties = self.properties;

            // Call original method
            self._super();

            if (self.value && self.isDependant == false) {

                //This inital value is set to prevent deleting the next combo DRAGON-1142
                self.initialValue = true;

                self.internalSetInitialValueFlag = true;

                self.trigger("select", [self.value, self.initialValue]);
            }

            self.internalSetInitialValueFlag = false;
        }

    });
