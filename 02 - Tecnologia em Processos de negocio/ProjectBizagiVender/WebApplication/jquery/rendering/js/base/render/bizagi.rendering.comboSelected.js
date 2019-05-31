/*
 *   Name: BizAgi Render ComboSelected class
 *   Author: Paola Herrera
 *   Comments:
 *   -   This script will define basic stuff for comboSelected renders
 */

bizagi.rendering.render.extend("bizagi.rendering.comboSelected", {}, {
    /* 
    * Constructor 
    */
    init: function (params) {
        // Call base 
        this._super(params);
        self.properties = this.properties;
    },

    /*
    * Template method to implement in each children to customize each control
    */
    renderControl: function () {
        var self = this;

        var template = self.renderFactory.getTemplate("render-comboSelected");
        var dataList = self.filterData();
        dataList = self.orderArraySelected(dataList);
        var html = $.fasttmpl(template, { dataList: dataList });

        return html;
    },
    orderArraySelected: function (dataList) {
        var self = this;
        var arrayOrder = dataList;

        var order = arrayOrder.sort(function (a, b) {

            var nA = a.value.toLowerCase();
            var nB = b.value.toLowerCase();

            if (nA < nB)
                return -1;
            else if (nA > nB)
                return 1;
            return 0;
        });

        return order;
    },

    /*
    * Filter data before set
    */
    filterData: function () {
        var self = this;
        var dataListArray = [];

        $.each(self.properties.data, function (i, data) {

            var el = $.grep(self.properties.value, function (value, e) {
                return (self.properties.xpath == "Organizations") ? value.id == data.id : value.id === data.id;
            });

            if (!el.length) {
                dataListArray.push(data);
            }
        });

        return dataListArray;
    },

    /*
    * Template method to implement in each children to customize each control
    */
    renderControlReadOnly: function () {
        var self = this;

        var template = self.renderFactory.getTemplate("render-comboSelectedReadOnly");
        var html = $.fasttmpl(template, {});

        return html;
    }

});