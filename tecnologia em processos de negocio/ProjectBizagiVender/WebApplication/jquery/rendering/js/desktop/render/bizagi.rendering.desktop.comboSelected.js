/*
 *   Name: BizAgi Render ComboSelected class
 *   Author: Paola Herrera
 *   Comments:
 *   -   This script will define basic stuff for comboSelected renders
 */

bizagi.rendering.comboSelected.extend("bizagi.rendering.comboSelected", {}, {
    /*
    * Template method to implement in each device to customize each render after processed
    */
    postRender: function () {
        var self = this;
        var control = self.getControl();

        // Call base
        this._super();

        // Value data into selectedItemsToUpdate
        self.showInitialData(self.properties.value);

        //Show initial value or nothing
        if (self.selectedItemsToUpdate.length >= 0) {
            $.each(self.selectedItemsToUpdate, function (index, value) {
                $("#listBoxComboData", control).append("<option value='" + value.id + "'>" + value.value + " </option>");
            });
        }
    },

    orderArrayList: function () {
        var self = this;
        var arrayOrderList = self.properties.value;

        var orderList = arrayOrderList.sort(function (a, b) {

            var nA = (a.value !== undefined && a.value !== null) ? a.value.toLowerCase() : "";
            var nB = (b.value !== undefined && b.value !== null) ? b.value.toLowerCase() : "";

            if (nA < nB)
                return -1;
            else if (nA > nB)
                return 1;
            return 0;
        });

        self.properties.value = orderList;
    },

    /*
    * Template method to implement in each device to customize the render's behaviour to add handlers
    */
    configureHandlers: function () {
        var self = this;
        var control = self.getControl();

        //Event to move right the elements
        $("#move_right", control).click(function (e) {
            //if(self.selectedItemsToUpdate.length == 0) self.showListBoxComboData();
            self.addItem();
        });

        //Event to move left the elements
        $("#move_left", control).click(function (e) {
            self.removeItem();
        });
    },

    /*
    * Override display value
    */
    setDisplayValue: function (value) {
        var self = this;
        var control = self.getControl();

        // Set internal value
        self.setValue(value, false);
    },

    /*
    * Add item to listBoxComboData and selectedItemsToUpdate array
    */
    addItem: function () {
        var self = this;
        var control = self.getControl();
        var dataSelected = $("#selectionData option:selected", control);
        var dataResults = $("#listBoxComboData", control);
        var isValidAdd = true;

        $.each(dataSelected, function (i, item) {

            var newItem = { id: parseInt(item.value), value: item.text };
            var inArray = $.grep(self.selectedItemsToUpdate, function (e) {
                return e.id == newItem.id;
            });

            if (inArray.length <= 0) {
                dataResults.append("<option value='" + newItem.id + "'>" + newItem.value + " </option>");
                self.selectedItemsToUpdate.push(newItem);
            }
        });
        dataSelected.remove();
        self.setValue(self.selectedItemsToUpdate);
    },

    /*
    * Remove item from listBoxComboData and selectedItemsToUpdate array
    */
    removeItem: function () {
        var self = this;
        var control = self.getControl();

        var dataSelectedToRemove = $("#listBoxComboData option:selected", control);
        var dataOptions = $("#selectionData", control);

        $.each(dataSelectedToRemove, function (i, item) {
            var removeItem = { id: parseInt(item.value), value: item.text };
            var inArray = $.grep(dataOptions, function (e) {
                return e.id == removeItem.id;
            });
            if (inArray.length <= 0) {
                dataOptions.append("<option value='" + removeItem.id + "'>" + removeItem.value + " </option>");
                self.selectedItemsToUpdate = $.grep(self.selectedItemsToUpdate, function (e) {
                    return e.id != removeItem.id;
                });
            }
        });

        dataSelectedToRemove.remove();
        self.setValue(self.selectedItemsToUpdate);
    },

    /*
    * Show listBoxComboData and move_left button from control view
    */
    showListBoxComboData: function () {
        var self = this;
        var control = self.getControl();

        $("#move_left", control).show();
        $("#bz-render-comboSelected-listBoxResults", control).show();
    },

    /*
    *   Sets the value in the rendered control
    */
    showInitialData: function (val) {
        var self = this;
        self.orderArrayList();
        self.selectedItemsToUpdate = [];

        if (!!val) {

            $.each(val, function (index, value) {
                self.selectedItemsToUpdate.push({
                    id: value.id,
                    value: value.value
                });
            });
        }
    },

    /*
    *   Template method to implement in each device to customize each render after processed in read-only mode
    */
    postRenderReadOnly: function () {
        var self = this;
        var control = self.getControl();

        var htmlControl = self.renderControlReadOnly();
        control.append(htmlControl);

        // Execute the same as post-render
        // Value data into selectedItemsToUpdate
        self.showInitialData(self.properties.value);

        var tempCombo = "<ul>{{each datasource}}<li data-value='${id}'>${value}</li>{{/each}}</ul>";
        var selectTmp = $.tmpl(tempCombo, { datasource: self.selectedItemsToUpdate });
        $("#bz-render-comboSelected-listBoxResults-ReadOnly", control).append(selectTmp);
    },
    /*
    * Has Value
    */
    hasValue: function () {

        var self = this;
        var data =  (typeof self.value === "string")? JSON.parse(self.value).value: self.value;

        return !bizagi.util.isEmpty(data);
    },

    /*
    *   Sets the internal value
    */
    setValue: function (value, triggerEvents) {
        var self = this;
        triggerEvents = triggerEvents !== undefined ? triggerEvents : true;

        // Set previous value
        self.properties.previousValue = self.properties.originalValue = JSON.stringify({ "value": self.value });

        // Change internal value
        self.value = self.properties.value = JSON.stringify({ "value": value });

        if (self.properties.required && self.getMode() == "execution") {

            if (self.checkRequired([])) {
                self.changeRequiredLabel(false);
            } else {
                self.changeRequiredLabel(true);
            }
        }
        // Trigger events
        if (triggerEvents && !self.internalSetInitialValueFlag) {
            self.triggerRenderChange();
            self.triggerRenderValidate();
        }
    }
});