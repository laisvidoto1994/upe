/*
*   Name: BizAgi smartphone Render Link Extension
*   Author: Oscar O
*   Comments:
*   -   This script will redefine the link render class to adjust to tablet devices
*/

// Extends itself
bizagi.rendering.link.extend("bizagi.rendering.link", {}, {
    renderSingle: function () {
        var self = this;
        var properties = self.properties;
        var container = self.getContainerRender();
        var control = self.getControl();
        var link = $(".ui-bizagi-render-link", control);

        self.input = control.find("a");

        if (!properties.editable) {
            link.addClass("ui-state-disabled");
            container.addClass("bz-command-not-edit");
        }
    },

    setDisplayValue: function (value) {
        var self = this;
        var properties = self.properties;
        var isValidValue = (properties.value
            && properties.value.toLowerCase().match(/^(http|https):\/\//) !== null) || false;

        if (isValidValue) {
            self.input.attr("href", properties.value);
            self.input.bind("click", function (e) {
                e.preventDefault();
                e.stopPropagation();
                window.open(encodeURI(this.getAttribute("href")), "_system", "location=yes");
            });
        }
    },

    renderEdition: function () {
        var self = this;
        var textTmpl = self.renderFactory.getTemplate("edition.link");

        self.inputEdition = $.tmpl(textTmpl);
    },

    setDisplayValueEdit: function (value) {
        var self = this;
        var properties = self.properties;

        self.inputEdition.val(value);

        self.input.bind("click", function (e) {
            e.preventDefault();
            e.stopPropagation();
            window.open(encodeURI(properties.value), "_system", "location=yes");
        });
    },

    actionSave: function () {
        var self = this;
        var value = self.inputEdition.val();
        var properties = self.properties;

        properties.value = value;
        self.setValue(value, false);

        self.input.html(value);
        self.input.attr("href", properties.value);
    }
});
