/*  
*   Name: BizAgi smartphone Render list Extension
*   Author: Oscaro
*   Comments:
*   -   This script will redefine the list render class to adjust to smartphones devices
*/

// Extends from base list
bizagi.rendering.list.extend("bizagi.rendering.list", {}, {

    renderSingle: function () {
        var self = this;
        var properties = self.properties;
        var container = self.getContainerRender();
        var control = self.getControl();

        //self.getArrowContainer().css("visibility", "hidden");

        self.input = self.inputSpan = (control.find("input").length != 0) ? control.find("input") : control.append("<span class=\"bz-command-not-edit bz-rn-text\"></span>").find("span"); //$.tmpl(textTmpl).appendTo(control);
        if (!properties.editable) {
            container.addClass("bz-command-not-edit");
            self.input.attr('readonly', "readonly");
        }
       
    },
    setDisplayValue: function (value) {
        bizagi.rendering.combo.prototype.setDisplayValue.apply(this, arguments);
    },
    renderEdition: function () {
        var self = this;
        var properties = self.properties;
        $.when(self.renderList(arguments)).done(function () {
            bizagi.rendering.combo.prototype.renderEdition.apply(self, arguments);
        });
    },
    setDisplayValueEdit: function (value) {
        bizagi.rendering.combo.prototype.setDisplayValueEdit.apply(this, arguments);
    },
    actionSave: function () {
        bizagi.rendering.combo.prototype.actionSave.apply(this, arguments);
    },
    changeCombo: function (valueItem, valueObjet) {
        bizagi.rendering.combo.prototype.changeCombo.apply(this, arguments);
    },
    renderList: function (params) {
        var self = this;
        var defer = new $.Deferred();
        var dataPromise = self.getData(params);
        $.when(dataPromise).done(function (data) {
            defer.resolve();
        });
        return defer.promise();
    },
    getTemplateName: function () {
        return "text";
    },
    getTemplateEditionName: function () {
        return "edition.list";
    }

});
