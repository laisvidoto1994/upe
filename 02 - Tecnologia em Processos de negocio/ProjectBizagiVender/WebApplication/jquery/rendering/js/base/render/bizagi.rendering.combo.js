/*
*   Name: BizAgi Render ComboClass
*   Author: Diego Parra
*   Comments:
*   -   This script will define basic stuff for combo renders
*/

bizagi.rendering.render.extend("bizagi.rendering.combo", {}, {

    /*
    *   Update or init the element data
    */
    initializeData: function (data) {
        var self = this;
        // Call base
        this._super(data);

        // Fill default properties
        var properties = this.properties;
        properties.hasLocalData = properties.data || false;
        properties.value = properties.value && properties.value.length > 0 ? properties.value[0] : (properties.defaultValue && properties.defaultValue.length > 0 ? properties.defaultValue[0] : null);
        if (properties.value && properties.value.id === undefined) properties.value = null;
        this.value = properties.value;

        // Add empty node if configured
        if (properties.hasLocalData) {
            properties.data = this.complementData(properties.data);
        }

        // This line is to set a flag to fetch the data when rendering, or on demand, by default is false, overriding it on desktop implementation
        properties.loadOnDemand = false;
    },


    /*
    *   Template method to implement in each children to customize each control
    */
    renderControl: function () {
        var self = this;
        var params = {};
        if(self.isDependant && self.properties && self.properties.type == "cascadingCombo" && self.getParentCombo){
            var valueControl = self.getParentCombo().getValue();
            if(valueControl && valueControl.id){
                params[self.Class.BA_ACTION_PARAMETER_PREFIX + "parent"] = valueControl.id;
            }
        }

        return self.renderCombo(params);
    },

    /*
    *   Renders the combo
    */
    renderCombo: function (params) {
        var self = this;
        var properties = self.properties;
        var template = self.renderFactory.getTemplate(self.getTemplateName());

        if (properties.loadOnDemand) {
            // Render the combo without data
            var html = self.renderComboTemplate();
            return html;
        } else {

            // Set data promise 
            var defer = new $.Deferred();
            var dataPromise = self.getData(params);

            // Attach callback 
            $.when(dataPromise).done(function (data) {
                // Render combo
                var html = self.renderComboTemplate(data);
                self.properties.data = data;
                defer.resolve(html);

            }).fail(function (data) {
                var html = self.renderComboTemplate({});
                defer.resolve(html);
            });

            // Returns a promise so we can hold post-render method until this is done
            return defer.promise();
        }
    },

    renderComboTemplate: function (data) {
        var self = this;
        var properties = self.properties;
        var template = self.renderFactory.getTemplate(self.getTemplateName());
        var value = properties.value ? "" : self.getResource("render-combo-empty-selection");
        data = data || self.properties.data || {};

        var html = $.fasttmpl(template, $.extend(self.getTemplateParams(), {
            id: properties.id,
            xpath: properties.xpath,
            unique: bizagi.util.randomNumber(10000, 1000000),
            idPageCache: properties.idPageCache,
            items: data,
            align: properties.valueAlign,
            value: value
        }));


        return html;
    },


    /*
    *   Template method to implement in each device to customize each render after processed in read-only mode
    */
    postRenderReadOnly: function () {
        var self = this;
        self._super();
        var item = self.getValue();
        var control = self.getControl();
        if (self.control && self.control.parent()) {
            self.control.parent().addClass("ui-bizagi-noneditable-" + self.properties.displayType);
        }
        if (item) {

            if (item.value != null && typeof item.value == "boolean") {
                if (bizagi.util.parseBoolean(item.value) == true) {
                    item.value = this.getResource("render-boolean-yes");

                } else if (bizagi.util.parseBoolean(item.value) == false) {
                    item.value = this.getResource("render-boolean-no");
                }
            }
            // Returns the cached value from the properties to avoid server side fetching
            (self.getResource("render-combo-empty-value") == item.value || self.getResource("render-combo-empty-selection") == item.value) ? control.text("") : control.text(self.formatItem(item.value));

        } else {
            // Render empty 
            control.text("");
        }
    },

    /*
    *   Gets the template used by the combo render
    *   can be overriden in subclasses to reuse logic and just change the template
    */
    getTemplateName: function () {
        return "combo";
    },

    /*
    *   Determines if we need to show the empty node or not
    *   Can be overriden to change behaviour
    */
    showEmpty: function () {
        return true;
    },

    /*
    *   Determines if we need to show the current data regardless if it belongs to data or not
    *   Can be overriden to change behaviour
    */
    showCurrentData: function () {
        return true;
    },

    /*
    *   Fetch the data into a deferred
    */
    getData: function (params) {
        var self = this;
        var properties = self.properties;
        var defer = new $.Deferred();
        var mode = self.getMode();

        // Just execute ajax calls when rendering in execution mode
        if (mode != "execution") return self.getDummyData();

        if (properties.hasLocalData) {

            // Resolve with local data    
            defer.resolve(properties.data);

        } else {

            // Check if the data has been cached
            if (properties.remoteDataLoaded && properties.type != "cascadingCombo") {
                defer.resolve(properties.data);
            } else {
                // Go to server
                self.dataService.multiaction().getData({
                    url: properties.dataUrl,
                    xpath: properties.xpath,
                    idRender: properties.id,
                    xpathContext: properties.xpathContext,
                    idPageCache: properties.idPageCache,
                    extra: params,
                    contexttype: self.properties.contexttype || null

                }).done(function (data) {

                    // Resolve the data
                    if (!properties.recalculate) {
                        properties.remoteDataLoaded = true;
                    }
                    properties.data = self.complementData(data);
                    defer.resolve(properties.data);

                }).fail(function (data) {

                    if (data.type == "not-processed")
                        return;

                    // Show error from server
                    var form = self.getFormContainer();
                    var msgObj = self.properties.displayName + ": ";

                    if (typeof data == "string") {
                        var auxMsg = JSON && JSON.parse(data) || $.parseJSON(data);
                    }
                    else {
                        var auxMsg = data;
                    }

                    msgObj += auxMsg.message;

                    form.addValidationMessage(msgObj);

                    defer.reject(data);
                });
            }
        }

        return defer.promise();
    },

    /*
    *   Creates a set of dummy data in order to display it when rendering in design or layout mode
    */
    getDummyData: function () {
        var self = this;
        var properties = self.properties;
        if (properties.data) {
            return properties.data;

        } else {
            properties.data = [];
            properties.data = self.complementData(properties.data);

            // Add another data
            properties.data.push({ id: "", value: "Item 1" });
            properties.data.push({ id: "", value: "Item 2" });

            return properties.data;
        }
    },

    /*
    *   Resets the data in order to fetch it again when needed
    */
    resetData: function () {
        var self = this;
        var properties = self.properties;

        properties.hasLocalData = false;
        properties.data = null;
        properties.remoteDataLoaded = false;

    },

    /* 
    *   Gets the display value of the render
    */
    getDisplayValue: function () {
        var self = this;
        var properties = this.properties;

        if (self.combo && self.combo.length > 0) {
            // When there is a combo painted, we fetch the selected value from it
            return self.getSelectedValue();

        } else {

            var displayValue = "";
            var item = self.getValue();
            if (item) {
                // Check on cached propert from server first if the key exists
                displayValue = self.formatItem(item.value);
            }

            return displayValue;
        }
    },


    /*
    *   Returns the selected value in the template
    */
    getSelectedValue: function () { },

    /*
    *   Adds custom parameters to process the template
    */
    getTemplateParams: function () {
        return {};
    },

    /*
    *   Formats value of each item
    */
    formatItem: function (value) {

        if (value !== undefined && value !== null) {
            if ($.isArray(value)) {

                for (var i = 0; i < value.length; i++) {
                    if (value[i] != null && typeof (value[i]) == "boolean") {
                        if (bizagi.util.parseBoolean(value[i]) == true) {
                            value[i] = this.getResource("render-boolean-yes");

                        } else if (bizagi.util.parseBoolean(value[i]) == false) {
                            value[i] = this.getResource("render-boolean-no");
                        }
                    }
                }
                return value.join(" - ");
            } else {

                return value;
            }
        } else {
            return "";
        }
    },

    /*
    *   Add the render data to the given collection in order to send data to the server
    */
    collectData: function (renderValues) {
        var self = this;
        var properties = self.properties;

        // Add the render value
        var xpath = properties.xpath;
        var value = self.getValue();

        if (self.controlValueIsChanged()) {
            // Filter by valid xpaths and valid values
            // Remove empty validation for value for combos        
            if (!bizagi.util.isEmpty(xpath) && value !== null && typeof (value) !== "undefined") {
                // Add a validation because sometimes value contains an empty not null object
                if (typeof (value) == "object" && (value.id === undefined || value.id === "")) {
                    renderValues[properties.xpath] = "";
                }else {
                    // Add the value to the server
                    renderValues[properties.xpath] = typeof (value.id) !== "undefined" ? value.id : "";
                }
            }
        }
    },

    /*
    * Parses additional values info in order to format them correctly
    */
    parseAdditionalValues: function (data) {
        var self = this;

        return $.map(data, function (item) {
            var value = item.value ? self.formatItem(item.value) : item;
            var newItem = { id: item.id, value: value };
            if (item.hidden) newItem.hidden = true;
            return item;
        });
    },

    /*
    *   Complement data from server before control implementation
    */
    complementData: function (data) {
        var self = this;
        var properties = self.properties;

        var bCurrentDataFound = false;
        $.each(data, function (i, item) {

            if (item.value !== undefined && item.value !== null) {
                item.value = self.formatItem(item.value);
                if (properties.value) {
                    if (item.id == properties.value.id) {
                        bCurrentDataFound = true;
                    }
                }
            } else {
                item.value = "";
            }
        });

        // Add empty node if configured
        if (self.showEmpty()) {
            var emptyFound = false;
            for (var i = 0; i < data.length; i++) {
                if (data[i].id == "") {
                    emptyFound = true;
                    break;
                }
            }
            if (!emptyFound) data.unshift({ id: "", value: bizagi.localization.getResource("render-combo-empty-value") });
        }

        if (properties.value) {
            if (!bCurrentDataFound && self.showCurrentData()) {
                data.unshift({ id: properties.value.id, value: properties.value.value, hidden: true });
            }
        }

        // Add additional value
        return self.parseAdditionalValues(data);
    },

    /*
    *   Check if a render has no value for required validation
    */
    hasValue: function () {
        var self = this;
        var currentValue = self.getValue();
        if (bizagi.util.isEmpty(currentValue)) return false;
        if (Object.prototype.toString.apply(currentValue) === "[object Object]" && (bizagi.util.isEmpty(currentValue.id) || currentValue.id == 0)) return false;

        // Else
        return true;
    },

    /*
    * Cleans current data
    */
    cleanData: function () {
        var self = this;
        var value = { id: "", label: "" };

        self.setDisplayValue(value);
        self.setValue(value, false);
    },

    beforeToRefresh: function () {
        this.column && !this.column.comboData && this.getData();
    }


});