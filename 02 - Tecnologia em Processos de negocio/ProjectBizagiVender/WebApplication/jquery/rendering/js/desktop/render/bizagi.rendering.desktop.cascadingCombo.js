/*
*   Name: BizAgi Desktop Render Cascading combo Extension
*   Author: Diego Parra
*   Comments:
*   -   This script will redefine the cascading combo render class to adjust to desktop devices
*/

// Extends from base cascading combo, then apply desktop combo stuff
bizagi.rendering.cascadingCombo.extend("bizagi.rendering.cascadingCombo", {}, {

    /*
    *   Template method to implement in each device to customize each render after processed
    */
    postRender: function () {
        // Call desktop.combo method
        var self = this;
        bizagi.rendering.combo.prototype.postRender.apply(self, arguments);
        self.processLayout(false, self.properties.valueFormat || {});
    },

    /*
    *   Template method to implement in each device to customize the render's behaviour to add handlers
    */
    configureHandlers: function () {
        // Call base
        this._super();

        // Call desktop.combo method
        bizagi.rendering.combo.prototype.configureHandlers.apply(this, arguments);
    },
    comboDropDown: function () {
        // Call desktop.combo method
        bizagi.rendering.combo.prototype.comboDropDown.apply(this, arguments);

    },

    showLoadingData: function () {
        // Call desktop.combo method
        bizagi.rendering.combo.prototype.showLoadingData.apply(this, arguments);
    },

    hideLoadingData: function () {
        // Call desktop.combo method
        bizagi.rendering.combo.prototype.hideLoadingData.apply(this, arguments);
    },
    internalComboDropDown: function(){
        // Call desktop.combo method
        bizagi.rendering.combo.prototype.internalComboDropDown.apply(this, arguments);    
    },
    /*
    *   
    */
    validateValueInDatasource: function () {
        // Call desktop.combo method
        bizagi.rendering.combo.prototype.validateValueInDatasource.apply(this, arguments);
    },
    /*
    *   Keydown listener
    */
    keyDownFunction: function (e) {
        // Call desktop.combo method
        bizagi.rendering.combo.prototype.keyDownFunction.apply(this, arguments);
    },
    /*
    *   KeyUp listener
    */
    keyUpFunction: function (e) {
        // Call desktop.combo method
        bizagi.rendering.combo.prototype.keyUpFunction.apply(this, arguments);
    },
    /*
    * Select letter by letter
    */
    selectItemByKeyUp: function () {
        // Call desktop.combo method
        bizagi.rendering.combo.prototype.selectItemByKeyUp.apply(this, arguments);
    },

    selectFirstElement: function(){
     // Call desktop.combo method
        bizagi.rendering.combo.prototype.selectFirstElement.apply(this, arguments);
    },

    selectLastElement: function(){
     // Call desktop.combo method
        bizagi.rendering.combo.prototype.selectLastElement.apply(this, arguments);
    },
    /*
    * Handler key Up
    */
    selectPreviousElement: function () {
        // Call desktop.combo method
        bizagi.rendering.combo.prototype.selectPreviousElement.apply(this, arguments);
    },
    /*
    *Handler key Down
    */
    selectNextElement: function () {
        // Call desktop.combo method
        bizagi.rendering.combo.prototype.selectNextElement.apply(this, arguments);
    },
    /*
    *   Sets the value in the rendered control
    */
    setDisplayValue: function () {
        // Call desktop.combo method
        bizagi.rendering.combo.prototype.setDisplayValue.apply(this, arguments);
    },

    /*
    *   Sets the value in the rendered control
    */
    clearDisplayValue: function () {
        // Call desktop.combo method
        bizagi.rendering.combo.prototype.clearDisplayValue.apply(this, arguments);
    },

    /*
    *   Returns the selected value in the template
    */
    getSelectedValue: function () {
        // Call desktop.combo method
        return bizagi.rendering.combo.prototype.getSelectedValue.apply(this, arguments);
    },

    /*
    *   Handler to react when a combo item is selected
    */
    onComboItemSelected: function () {
        var self = this;
        self.itemSelected = true;
        // Call desktop.combo method
        return bizagi.rendering.combo.prototype.onComboItemSelected.apply(this, arguments);
    },

    postRenderPrintVersion: function () {
        var self = this;
        var control = self.getControl();

        control.empty();
        control.append(self.value.value);

    },
    /*
    * validate when fire event form document and window
    */
    dropDownValidClose: function () {

        return bizagi.rendering.combo.prototype.dropDownValidClose.apply(this, arguments);
    },
    /*
    * set a new dropdown position
    */
    dropDownReposition: function (dropDown, containerForm) {
        return bizagi.rendering.combo.prototype.dropDownReposition.apply(this, arguments);
    },
    /*
    * destroy dropdown
    */
    dropDownDestroy: function (dropDown) {
        return bizagi.rendering.combo.prototype.dropDownDestroy.apply(this, arguments);
    },
    /*
    *   Find elements within a data source
    */
    findDataById: function () {

        return bizagi.rendering.combo.prototype.findDataById.apply(this, arguments);

    },
    findDataByValue: function () {

        return bizagi.rendering.combo.prototype.findDataByValue.apply(this, arguments);
    },

    recalculateComboOffset: function(){
        return bizagi.rendering.combo.prototype.recalculateComboOffset.apply(this, arguments);
    },


    setValue: function (val, triggerEvents) {
        var self = this;
        triggerEvents = triggerEvents !== undefined ? triggerEvents : true;

        if (val === '') {
            val = { id: "", value: "" };
        }

        if (!!val) {
            var id = val.id || "";
            var label = val.value || self.findDataById(id).value;

            self.selectedValue = { id: id, value: label };
            if (triggerEvents) self.triggerHandler("select", { id: id, value: label });
            this._super(self.selectedValue, triggerEvents);
        }
    },

    /*
     * Cleans current data
     */
    cleanData: function () {
        var self = this;
        self.value = self.properties.value = self.selectedValue = { id: "", value: "" };
        self.setValue(self.value, false);
        self.setDisplayValue(self.value);
        self.clearDisplayValue();
    }
});

// We override original select menu refresh position method to adjust custom stuff
var originalRefreshPositionMethod = $.ui.selectmenu.prototype._refreshPosition;
$.ui.selectmenu.prototype._refreshPosition = function() {
    // Set initial heigth to zero
    this.list.height(0);

    // Call original method
    var result = originalRefreshPositionMethod.apply(this, arguments);

    // Return original response
    this.list.css("width", this.newelement.width() + "px");
    return result;
};
